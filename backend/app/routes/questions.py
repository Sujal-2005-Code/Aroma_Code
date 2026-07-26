from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.models.question import Question
from app.database.db import db

from fastapi import Depends
from app.dependencies.auth import admin_required

router = APIRouter()

fallback_questions = [
    {
        "_id": "sample-question-1",
        "title": "Sample Question",
        "description": "A fallback question returned when the database is unavailable.",
        "topic": "General",
        "difficulty": "easy",
        "question_type": "theory",
        "tags": ["sample"],
        "options": [],
        "correct_answer": None,
        "explanation": None,
        "sample_input": None,
        "sample_output": None,
    }
]


def get_questions_collection():
    if db is None:
        return None

    return db["questions"]


def _serialize_question(question: dict):
    serialized = dict(question)
    if "_id" in serialized:
        serialized["_id"] = str(serialized["_id"])
    return serialized


@router.post("/questions")
def create_question(
    question: Question,
    current_user=Depends(admin_required)
):
    collection = get_questions_collection()

    if collection is None:
        question_id = str(len(fallback_questions) + 1)
        payload = question.model_dump()
        payload["_id"] = question_id
        fallback_questions.append(payload)
        return {
            "message": "Question added",
            "id": question_id
        }

    try:
        result = collection.insert_one(question.model_dump())

        return {
            "message": "Question added",
            "id": str(result.inserted_id)
        }

    except Exception:
        question_id = str(len(fallback_questions) + 1)
        payload = question.model_dump()
        payload["_id"] = question_id
        fallback_questions.append(payload)
        return {
            "message": "Question added",
            "id": question_id
        }


@router.get("/questions")
def get_questions():
    collection = get_questions_collection()

    if collection is None:
        return [_serialize_question(question) for question in fallback_questions]

    try:
        questions = []

        for question in collection.find():
            questions.append(_serialize_question(question))

        return questions

    except Exception:
        return [_serialize_question(question) for question in fallback_questions]


@router.get("/questions/{question_id}")
def get_question(question_id: str):
    collection = get_questions_collection()

    if collection is None:
        matching_question = next(
            (question for question in fallback_questions if str(question.get("_id")) == question_id),
            None
        )

        if not matching_question:
            raise HTTPException(status_code=404, detail="Question not found")

        return _serialize_question(matching_question)

    try:
        question = collection.find_one({"_id": ObjectId(question_id)})

        if not question:
            raise HTTPException(status_code=404, detail="Question not found")

        return _serialize_question(question)

    except Exception:
        matching_question = next(
            (question for question in fallback_questions if str(question.get("_id")) == question_id),
            None
        )

        if not matching_question:
            raise HTTPException(status_code=404, detail="Question not found")

        return _serialize_question(matching_question)
@router.get("/questions/topic/{topic}")
def get_questions_by_topic(topic: str):
    collection = get_questions_collection()

    if collection is None:
        return [
            _serialize_question(question)
            for question in fallback_questions
            if question.get("topic", "").lower() == topic.lower()
        ]

    questions = []

    for question in collection.find({"topic": topic}):
        questions.append(_serialize_question(question))

    return questions


@router.get("/questions/type/{question_type}")
def get_questions_by_type(question_type: str):
    collection = get_questions_collection()

    if collection is None:
        return [
            _serialize_question(question)
            for question in fallback_questions
            if question.get("question_type", "").lower() == question_type.lower()
        ]

    questions = []

    for question in collection.find({"question_type": question_type}):
        questions.append(_serialize_question(question))

    return questions    


@router.get("/questions/search")
def search_questions(q: str):

    collection = get_questions_collection()

    if collection is None:

        return [
            _serialize_question(question)
            for question in fallback_questions
            if q.lower() in question.get("title", "").lower()
            or q.lower() in question.get("topic", "").lower()
        ]

    questions = []

    cursor = collection.find({

        "$or": [

            {"title": {"$regex": q, "$options": "i"}},

            {"topic": {"$regex": q, "$options": "i"}},

            {"difficulty": {"$regex": q, "$options": "i"}}

        ]

    })

    for question in cursor:

        questions.append(
            _serialize_question(question)
        )

    return questions

@router.get("/questions/page")
def paginate_questions(
    page: int = 1,
    limit: int = 10
):

    collection = get_questions_collection()

    if collection is None:

        start = (page - 1) * limit

        return fallback_questions[start:start + limit]

    skip = (page - 1) * limit

    questions = []

    cursor = collection.find().skip(skip).limit(limit)

    for question in cursor:

        questions.append(
            _serialize_question(question)
        )

    return questions


@router.put("/questions/{question_id}")
def update_question(
    question_id: str,
    updated_question: Question,
    current_user=Depends(admin_required)
):

    collection = get_questions_collection()

    if collection is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    try:

        result = collection.update_one(

            {
                "_id": ObjectId(question_id)
            },

            {
                "$set": updated_question.model_dump()
            }

        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid question id"
        )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return {

        "message": "Question updated successfully"

    }


@router.delete("/questions/{question_id}")
def delete_question(
    question_id: str,
    current_user=Depends(admin_required)
):

    collection = get_questions_collection()

    if collection is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    try:

        result = collection.delete_one(

            {
                "_id": ObjectId(question_id)
            }

        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid question id"
        )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return {

        "message": "Question deleted successfully"

    }


