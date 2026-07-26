from fastapi import APIRouter
from app.database.db import db

router = APIRouter()


def get_results_collection():
    if db is None:
        return None

    return db["results"]


@router.get("/results")
def get_results():

    collection = get_results_collection()

    if collection is None:
        return []

    results = []

    for result in collection.find():

        result["_id"] = str(result["_id"])

        results.append(result)

    return results