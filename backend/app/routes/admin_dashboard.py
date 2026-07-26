from fastapi import APIRouter, Depends, HTTPException

from app.database.db import db
from app.dependencies.auth import admin_required

router = APIRouter()


# -----------------------------------
# Collections
# -----------------------------------

def get_collection(name: str):

    if db is None:
        return None

    return db[name]


# -----------------------------------
# Admin Dashboard
# -----------------------------------

@router.get("/admin/dashboard")
def admin_dashboard(
    current_user=Depends(admin_required)
):

    users = get_collection("users")
    questions = get_collection("questions")
    assessments = get_collection("assessments")
    submissions = get_collection("submissions")
    results = get_collection("results")

    if (
        users is None or
        questions is None or
        assessments is None or
        submissions is None or
        results is None
    ):

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    # -----------------------------
    # Basic Counts
    # -----------------------------

    total_students = users.count_documents(
        {
            "role": "student"
        }
    )

    total_admins = users.count_documents(
        {
            "role": "admin"
        }
    )

    total_questions = questions.count_documents({})

    total_assessments = assessments.count_documents({})

    total_attempts = submissions.count_documents({})

    # -----------------------------
    # Result Statistics
    # -----------------------------

    all_results = list(results.find())

    total_percentage = 0

    pass_count = 0

    highest_score = 0

    lowest_score = 100

    for item in all_results:

        percentage = item.get(
            "percentage",
            0
        )

        total_percentage += percentage

        if percentage > highest_score:
            highest_score = percentage

        if percentage < lowest_score:
            lowest_score = percentage

        if item.get("result") == "PASS":
            pass_count += 1

    average_score = 0

    pass_rate = 0

    fail_rate = 0

    if len(all_results) > 0:

        average_score = round(
            total_percentage / len(all_results),
            2
        )

        pass_rate = round(
            (pass_count / len(all_results)) * 100,
            2
        )

        fail_rate = round(
            100 - pass_rate,
            2
        )
    else:

        lowest_score = 0

    # -----------------------------
    # Response
    # -----------------------------

    return {

        "total_students": total_students,

        "total_admins": total_admins,

        "total_questions": total_questions,

        "total_assessments": total_assessments,

        "total_attempts": total_attempts,

        "average_score": average_score,

        "highest_score": highest_score,

        "lowest_score": lowest_score,

        "pass_rate": pass_rate,

        "fail_rate": fail_rate
    }