from fastapi import APIRouter
from app.database.db import db

router = APIRouter()


def get_results_collection():
    if db is None:
        return None
    return db["results"]


def get_submissions_collection():
    if db is None:
        return None
    return db["submissions"]


@router.get("/student/{student_id}/results")
def get_student_results(student_id: str):

    collection = get_results_collection()

    if collection is None:
        return []

    results = []

    for result in collection.find(
        {"student_id": student_id}
    ):
        result["_id"] = str(result["_id"])
        results.append(result)

    return results


@router.get("/student/{student_id}/history")
def get_student_history(student_id: str):

    collection = get_submissions_collection()

    if collection is None:
        return []

    history = []

    for submission in collection.find(
        {"student_id": student_id}
    ):

        submission["_id"] = str(submission["_id"])

        history.append(submission)

    return history

@router.get("/student/{student_id}/stats")
def get_student_stats(student_id: str):

    collection = get_results_collection()

    if collection is None:
        return {}

    results = list(
        collection.find({"student_id": student_id})
    )

    if not results:
        return {
            "tests_attempted": 0,
            "tests_passed": 0,
            "tests_failed": 0,
            "average_percentage": 0,
            "highest_percentage": 0,
            "lowest_percentage": 0
        }

    tests_attempted = len(results)

    tests_passed = sum(
        1 for r in results
        if r["result"] == "PASS"
    )

    tests_failed = tests_attempted - tests_passed

    percentages = [
        r["percentage"]
        for r in results
    ]

    return {
        "tests_attempted": tests_attempted,
        "tests_passed": tests_passed,
        "tests_failed": tests_failed,
        "average_percentage": round(
            sum(percentages) / len(percentages),
            2
        ),
        "highest_percentage": max(percentages),
        "lowest_percentage": min(percentages)
    }