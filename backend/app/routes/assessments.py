from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.models.assessment import Assessment
from app.database.db import db

from fastapi import Depends
from app.dependencies.auth import admin_required

router = APIRouter()

fallback_assessments = []


def get_assessments_collection():
    if db is None:
        return None

    return db["assessments"]


def _serialize_assessment(assessment: dict):
    serialized = dict(assessment)

    if "_id" in serialized:
        serialized["_id"] = str(serialized["_id"])

    return serialized


@router.post("/assessments")
def create_assessment(
    assessment: Assessment,
    current_user=Depends(admin_required)
):
    collection = get_assessments_collection()

    if collection is None:
        assessment_id = str(len(fallback_assessments) + 1)

        payload = assessment.model_dump()
        payload["_id"] = assessment_id

        fallback_assessments.append(payload)

        return {
            "message": "Assessment created",
            "id": assessment_id
        }

    try:
        result = collection.insert_one(
            assessment.model_dump()
        )

        return {
            "message": "Assessment created",
            "id": str(result.inserted_id)
        }

    except Exception:
        assessment_id = str(len(fallback_assessments) + 1)

        payload = assessment.model_dump()
        payload["_id"] = assessment_id

        fallback_assessments.append(payload)

        return {
            "message": "Assessment created",
            "id": assessment_id
        }


@router.get("/assessments")
def get_assessments():

    collection = get_assessments_collection()

    if collection is None:
        return [
            _serialize_assessment(assessment)
            for assessment in fallback_assessments
        ]

    try:
        assessments = []

        for assessment in collection.find():
            assessments.append(
                _serialize_assessment(assessment)
            )

        return assessments

    except Exception:
        return [
            _serialize_assessment(assessment)
            for assessment in fallback_assessments
        ]


@router.get("/assessments/{assessment_id}")
def get_assessment(assessment_id: str):

    collection = get_assessments_collection()

    if collection is None:

        assessment = next(
            (
                a for a in fallback_assessments
                if str(a.get("_id")) == assessment_id
            ),
            None
        )

        if not assessment:
            raise HTTPException(
                status_code=404,
                detail="Assessment not found"
            )

        return _serialize_assessment(assessment)

    try:
        assessment = collection.find_one(
            {"_id": ObjectId(assessment_id)}
        )

        if not assessment:
            raise HTTPException(
                status_code=404,
                detail="Assessment not found"
            )

        return _serialize_assessment(assessment)

    except Exception:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )


@router.get("/assessments/search")
def search_assessments(q: str):

    collection = get_assessments_collection()

    if collection is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    assessments = []

    cursor = collection.find({

        "$or": [

            {"title": {"$regex": q, "$options": "i"}},

            {"topic": {"$regex": q, "$options": "i"}}

        ]

    })

    for assessment in cursor:

        assessment["_id"] = str(
            assessment["_id"]
        )

        assessments.append(
            assessment
        )

    return assessments   


@router.get("/assessments/page")
def paginate_assessments(
    page: int = 1,
    limit: int = 10
):

    collection = get_assessments_collection()

    if collection is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    skip = (page - 1) * limit

    data = []

    cursor = collection.find().skip(skip).limit(limit)

    for assessment in cursor:

        assessment["_id"] = str(
            assessment["_id"]
        )

        data.append(
            assessment
        )

    return data


@router.put("/assessments/{assessment_id}")
def update_assessment(
    assessment_id: str,
    assessment: Assessment,
    current_user=Depends(admin_required)
):

    collection = get_assessments_collection()

    if collection is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    try:

        result = collection.update_one(

            {
                "_id": ObjectId(assessment_id)
            },

            {
                "$set": assessment.model_dump()
            }

        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid assessment id"
        )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    return {

        "message": "Assessment updated successfully"

    }


@router.delete("/assessments/{assessment_id}")
def delete_assessment(
    assessment_id: str,
    current_user=Depends(admin_required)
):

    collection = get_assessments_collection()

    if collection is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    try:

        result = collection.delete_one(

            {
                "_id": ObjectId(assessment_id)
            }

        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid assessment id"
        )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    return {

        "message": "Assessment deleted successfully"

    }