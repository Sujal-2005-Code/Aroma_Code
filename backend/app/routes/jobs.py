from datetime import datetime
from typing import Literal

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.database.db import db
from app.dependencies.auth import admin_required, recruiter_required, student_required

router = APIRouter()


class JobPayload(BaseModel):
    title: str
    companyName: str
    location: str = "Remote"
    jobType: str = "Full-time"
    salary: str | None = None
    experience: str = "Fresher"
    description: str
    skills: list[str] = Field(default_factory=list)
    applicationDeadline: str
    companyLogo: str | None = None
    requirements: list[str] = Field(default_factory=list)
    apply_url: str | None = None


def serialize(job: dict) -> dict:
    payload = dict(job)
    payload["id"] = str(payload.pop("_id"))
    payload["applicants"] = payload.get("applicants", 0)
    # Map field names to match frontend expectations
    if "companyName" in payload:
        payload["company"] = payload.pop("companyName")
    if "jobType" in payload:
        payload["job_type"] = payload.pop("jobType")
    if "applicationDeadline" in payload:
        payload["application_deadline"] = payload.pop("applicationDeadline")
    if "companyLogo" in payload:
        payload["company_logo"] = payload.pop("companyLogo")
    return payload


@router.get("/jobs")
def list_jobs():
    if db is None:
        return []
    return [serialize(job) for job in db["jobs"].find({"is_active": {"$ne": False}}).sort("created_at", -1)]


@router.post("/jobs")
def create_job(payload: JobPayload, current_user=Depends(admin_required)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")
    job = payload.model_dump()
    job.update({"is_active": True, "applicants": 0, "created_at": datetime.utcnow()})
    result = db["jobs"].insert_one(job)
    return {"id": str(result.inserted_id), "message": "Job created"}


@router.post("/career/jobs")
def create_recruiter_job(payload: JobPayload, current_user=Depends(recruiter_required)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")
    job = payload.model_dump()
    job.update({
        "is_active": True,
        "status": "active",
        "applicants": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    result = db["jobs"].insert_one(job)
    inserted_id = str(result.inserted_id)
    return {"id": inserted_id, "message": "Job created", **job, "_id": inserted_id}


@router.get("/career/jobs")
def list_recruiter_jobs(current_user=Depends(recruiter_required)):
    if db is None:
        return []
    return [serialize(job) for job in db["jobs"].find({"is_active": {"$ne": False}}).sort("created_at", -1)]


@router.patch("/career/jobs")
def update_job_status(payload: dict, current_user=Depends(recruiter_required)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")
    job_id = payload.get("id")
    status = payload.get("status", "closed")
    try:
        object_id = ObjectId(job_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid job id") from exc

    result = db["jobs"].update_one(
        {"_id": object_id},
        {"$set": {"status": status, "is_active": status == "active", "updated_at": datetime.utcnow()}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"message": "Job status updated"}


@router.post("/jobs/{job_id}/save")
def save_job(job_id: str, current_user=Depends(student_required)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")
    try:
        object_id = ObjectId(job_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid job id") from exc
    if not db["jobs"].find_one({"_id": object_id, "is_active": {"$ne": False}}):
        raise HTTPException(status_code=404, detail="Job not found")
    db["saved_jobs"].update_one(
        {"student_id": current_user["user_id"], "job_id": job_id},
        {"$set": {"saved_at": datetime.utcnow()}}, upsert=True,
    )
    return {"message": "Job saved"}


@router.post("/jobs/{job_id}/apply")
def apply_to_job(job_id: str, current_user=Depends(student_required)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")
    try:
        object_id = ObjectId(job_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid job id") from exc
    if not db["jobs"].find_one({"_id": object_id, "is_active": {"$ne": False}}):
        raise HTTPException(status_code=404, detail="Job not found")
    result = db["job_applications"].update_one(
        {"student_id": current_user["user_id"], "job_id": job_id},
        {"$setOnInsert": {"applied_at": datetime.utcnow()}}, upsert=True,
    )
    if result.upserted_id:
        db["jobs"].update_one({"_id": object_id}, {"$inc": {"applicants": 1}})
    return {"message": "Application submitted"}
