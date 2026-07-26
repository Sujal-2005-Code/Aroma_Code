from fastapi import APIRouter, Depends, HTTPException

from app.database.db import db
from app.dependencies.auth import admin_required

router = APIRouter()


def get_results_collection():

    if db is None:
        return None

    return db["results"]


@router.get("/admin/assessment/{assessment_id}/analytics")
def assessment_analytics(
    assessment_id: str,
    current_user=Depends(admin_required)
):

    results = get_results_collection()

    if results is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    data = list(

        results.find({

            "assessment_id": assessment_id

        })

    )

    attempts = len(data)

    if attempts == 0:

        return {

            "assessment_id": assessment_id,

            "total_attempts": 0,

            "pass_count": 0,

            "fail_count": 0,

            "pass_rate": 0,

            "fail_rate": 0,

            "average_score": 0,

            "highest_score": 0,

            "lowest_score": 0
        }

    pass_count = 0

    total_percentage = 0

    highest = 0

    lowest = 100

    for item in data:

        percentage = item.get("percentage", 0)

        total_percentage += percentage

        highest = max(highest, percentage)

        lowest = min(lowest, percentage)

        if item.get("result") == "PASS":

            pass_count += 1

    fail_count = attempts - pass_count

    return {

        "assessment_id": assessment_id,

        "total_attempts": attempts,

        "pass_count": pass_count,

        "fail_count": fail_count,

        "pass_rate": round((pass_count/attempts)*100,2),

        "fail_rate": round((fail_count/attempts)*100,2),

        "average_score": round(total_percentage/attempts,2),

        "highest_score": highest,

        "lowest_score": lowest
    }