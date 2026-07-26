from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.database.db import db
from app.dependencies.auth import admin_required

router = APIRouter()


@router.get("/admin/students")
def list_students(current_user=Depends(admin_required)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    students = []
    for user in db["users"].find({"role": "student"}):
        student_id = str(user["_id"])
        results = list(db["results"].find({"student_id": student_id}))
        average_score = round(
            sum(item.get("percentage", 0) for item in results) / len(results), 2
        ) if results else 0
        students.append({
            "id": student_id,
            "full_name": user.get("full_name", "Unnamed student"),
            "email": user.get("email", ""),
            "is_active": user.get("is_active", True),
            "assessments_taken": len(results),
            "average_score": average_score,
        })
    return students


@router.delete("/admin/students/{student_id}")
def deactivate_student(student_id: str, current_user=Depends(admin_required)):
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")
    try:
        result = db["users"].update_one(
            {"_id": ObjectId(student_id), "role": "student"},
            {"$set": {"is_active": False}},
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid student id") from exc
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deactivated"}
