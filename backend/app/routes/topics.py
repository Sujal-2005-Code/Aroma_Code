from fastapi import APIRouter, HTTPException
from app.models.topic import Topic
from app.database.db import get_db

router = APIRouter()


@router.post("/topics")
def create_topic(topic: Topic):
    try:
        db = get_db()
        topics_collection = db["topics"]

        result = topics_collection.insert_one(
            topic.model_dump()
        )

        return {
            "message": "Topic created successfully",
            "id": str(result.inserted_id)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/topics")
def get_topics():
    try:
        db = get_db()
        topics_collection = db["topics"]

        topics = []

        for topic in topics_collection.find():
            topic["_id"] = str(topic["_id"])
            topics.append(topic)

        return topics

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )