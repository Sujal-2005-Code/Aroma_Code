from fastapi import APIRouter, HTTPException

from app.database.db import db

router = APIRouter()


def get_users_collection():

    if db is None:
        return None

    return db["users"]


def get_results_collection():

    if db is None:
        return None

    return db["results"]


@router.get("/leaderboard")
def leaderboard():

    users = get_users_collection()
    results = get_results_collection()

    if users is None or results is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    leaderboard_data = []

    students = users.find(
        {
            "role": "student"
        }
    )

    for student in students:

        student_results = list(

            results.find(
                {
                    "student_id": str(student["_id"])
                }
            )

        )

        total_attempts = len(student_results)

        average_score = 0

        if total_attempts > 0:

            total = sum(

                result.get(
                    "percentage",
                    0
                )

                for result in student_results

            )

            average_score = round(

                total / total_attempts,

                2

            )

        leaderboard_data.append({

            "student_id": str(student["_id"]),

            "student_name": student["full_name"],

            "average_score": average_score,

            "total_attempts": total_attempts

        })

    leaderboard_data.sort(

        key=lambda x: x["average_score"],

        reverse=True

    )

    for index, student in enumerate(leaderboard_data):

        student["rank"] = index + 1

    return leaderboard_data