from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.database.db import db
from app.utils.question_sanitizer import sanitize_question

router = APIRouter()


def get_questions_collection():
    if db is None:
        return None
    return db["questions"]


@router.get("/student/questions")
def get_student_questions():

    collection = get_questions_collection()

    if collection is None:
        return []

    questions = []

    for question in collection.find():

        questions.append(
            sanitize_question(question)
        )

    return questions


@router.get("/student/questions/{question_id}")
def get_student_question(question_id: str):

    collection = get_questions_collection()

    if collection is None:
        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    try:

        question = collection.find_one(
            {"_id": ObjectId(question_id)}
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid Question ID"
        )

    if question is None:

        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return sanitize_question(question)