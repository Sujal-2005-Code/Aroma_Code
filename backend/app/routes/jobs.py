from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.database.db import db
from app.dependencies.auth import admin_required, student_required

router = APIRouter()


class JobPayload(BaseModel):
    title: str
    company: str
    location: str = "Remote"
    job_type: str = "Full-time"
    salary: str | None = None
    description: str
    requirements: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    apply_url: str | None = None


def serialize(job: dict) -> dict:
    payload = dict(job)
    payload["id"] = str(payload.pop("_id"))
    payload["applicants"] = payload.get("applicants", 0)
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
