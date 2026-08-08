from datetime import datetime
from typing import Literal

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.database.db import db
from app.dependencies.auth import recruiter_required, student_required

router = APIRouter()


def require_db():
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")
    return db


def student_results(student_id: str):
    return list(require_db()["results"].find({"student_id": student_id}))


def student_summary(student_id: str):
    database = require_db()
    user = database["users"].find_one({"_id": ObjectId(student_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    results = student_results(student_id)
    average = round(sum(item.get("percentage", 0) for item in results) / len(results), 2) if results else 0
    return user, results, average


class MentorMessageRequest(BaseModel):
    content: str = Field(min_length=1, max_length=4000)


class GithubProfileRequest(BaseModel):
    username: str
    headline: str = ""
    repositories: list[dict] = Field(default_factory=list)
    languages: list[dict] = Field(default_factory=list)
    contributions: list[dict] = Field(default_factory=list)
    monthly_commits: list[dict] = Field(default_factory=list)


@router.get("/mentor/messages")
def get_mentor_messages(current_user=Depends(student_required)):
    database = require_db()
    messages = []
    for item in database["mentor_messages"].find({"student_id": current_user["user_id"]}).sort("created_at", 1):
        messages.append({"id": str(item["_id"]), "role": item["role"], "content": item["content"], "timestamp": item["created_at"].isoformat()})
    return messages


@router.post("/mentor/messages")
def create_mentor_message(request: MentorMessageRequest, current_user=Depends(student_required)):
    database = require_db()
    now = datetime.utcnow()
    database["mentor_messages"].insert_one({"student_id": current_user["user_id"], "role": "user", "content": request.content, "created_at": now})
    _, results, average = student_summary(current_user["user_id"])
    response = (
        f"You have completed {len(results)} assessments with an average score of {average}%. "
        f"For your question about {request.content[:120]}, start with one focused project, practise it daily, and review the outcome each week."
    )
    result = database["mentor_messages"].insert_one({"student_id": current_user["user_id"], "role": "assistant", "content": response, "created_at": datetime.utcnow()})
    return {"id": str(result.inserted_id), "role": "assistant", "content": response, "timestamp": datetime.utcnow().isoformat()}


@router.get("/passport")
def get_passport(current_user=Depends(student_required)):
    user, results, average = student_summary(current_user["user_id"])
    coding = [item for item in results if item.get("percentage", 0) > 0]
    score = round(average) if results else 0
    return {
        "name": user.get("full_name", "Student"), "email": user.get("email", ""), "passport_score": score,
        "assessment_count": len(results), "average_score": average, "verified": bool(results),
        "skills": [{"skill": "Assessments", "value": score}, {"skill": "Coding", "value": round(sum(item.get("percentage", 0) for item in coding) / len(coding)) if coding else 0}],
        "certificates": [],
    }


@router.get("/skill-gap")
def get_skill_gap(current_user=Depends(student_required)):
    _, results, average = student_summary(current_user["user_id"])
    current = round(average) if results else 0
    skills = [
        {"name": "Problem solving", "level": current, "required": 75},
        {"name": "System design", "level": max(0, current - 10), "required": 70},
        {"name": "Testing", "level": max(0, current - 15), "required": 70},
    ]
    missing = [item["name"] for item in skills if item["required"] - item["level"] > 10]
    return {"target_role": "Software Engineer", "match_percentage": round(sum(min(item["level"], item["required"]) / item["required"] for item in skills) / len(skills) * 100), "estimated_time": f"{max(2, len(missing) * 2)} weeks", "current_skills": skills, "missing_skills": missing}


@router.get("/github/profile")
def get_github_profile(current_user=Depends(student_required)):
    database = require_db()
    profile = database["github_profiles"].find_one({"student_id": current_user["user_id"]})
    if profile is None:
        return {"username": "Not connected", "headline": "Connect a GitHub profile to view repository analytics.", "repositories": [], "languages": [], "contributions": [], "monthly_commits": [], "stats": {"repos": 0, "stars": 0, "followers": 0, "commits": 0}}
    profile.pop("_id", None)
    profile.pop("student_id", None)
    return profile


@router.put("/github/profile")
def update_github_profile(request: GithubProfileRequest, current_user=Depends(student_required)):
    database = require_db()
    payload = request.model_dump()
    payload["stats"] = {"repos": len(payload["repositories"]), "stars": sum(item.get("stars", 0) for item in payload["repositories"]), "followers": 0, "commits": sum(item.get("commits", 0) for item in payload["monthly_commits"])}
    database["github_profiles"].update_one({"student_id": current_user["user_id"]}, {"$set": {**payload, "student_id": current_user["user_id"], "updated_at": datetime.utcnow()}}, upsert=True)
    return {"message": "GitHub profile updated"}


@router.get("/recruiter/candidates")
def get_candidates(current_user=Depends(recruiter_required)):
    database = require_db()
    candidates = []
    for user in database["users"].find({"role": "student", "is_active": {"$ne": False}}):
        student_id = str(user["_id"])
        results = list(database["results"].find({"student_id": student_id}))
        score = round(sum(item.get("percentage", 0) for item in results) / len(results), 2) if results else 0
        state = database["candidate_statuses"].find_one({"recruiter_id": current_user["user_id"], "student_id": student_id}) or {}
        candidates.append({"id": student_id, "name": user.get("full_name", "Student"), "email": user.get("email", ""), "title": "Software Engineer", "location": "Not provided", "skills": ["Assessments", "Coding"], "passport_score": score, "status": state.get("status", "New")})
    return candidates


class CandidateStatusRequest(BaseModel):
    status: Literal["New", "Shortlisted", "Interview", "Hired", "Rejected"]


@router.put("/recruiter/candidates/{student_id}/status")
def update_candidate_status(student_id: str, request: CandidateStatusRequest, current_user=Depends(recruiter_required)):
    database = require_db()
    database["candidate_statuses"].update_one({"recruiter_id": current_user["user_id"], "student_id": student_id}, {"$set": {"status": request.status, "updated_at": datetime.utcnow()}}, upsert=True)
    return {"message": "Candidate status updated"}
