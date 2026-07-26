from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.database.db import db
from app.models.assessment_session import AssessmentSession
from app.utils.question_sanitizer import sanitize_question
from app.dependencies.auth import student_required
from app.models.autosave import AutoSaveRequest
from fastapi import Depends

router = APIRouter()


# -----------------------------------
# Request Models
# -----------------------------------

class StartAssessmentRequest(BaseModel):

    assessment_id: str


# -----------------------------------
# Database Collections
# -----------------------------------

def get_assessments_collection():

    if db is None:
        return None

    return db["assessments"]


def get_questions_collection():

    if db is None:
        return None

    return db["questions"]


def get_sessions_collection():

    if db is None:
        return None

    return db["assessment_sessions"]

def get_autosave_collection():

    if db is None:
        return None

    return db["autosaves"]

def get_results_collection():

    if db is None:
        return None

    return db["results"]


# -----------------------------------
# Get Assessment
# -----------------------------------

@router.get("/student/assessment/{assessment_id}")
def get_student_assessment(
    assessment_id: str,
    current_user=Depends(student_required)
):

    assessments = get_assessments_collection()
    questions = get_questions_collection()

    if assessments is None or questions is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    try:

        assessment = assessments.find_one(
            {
                "_id": ObjectId(assessment_id)
            }
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid assessment id"
        )

    if assessment is None:

        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    question_list = []

    for question_id in assessment.get("question_ids", []):

        try:

            question = questions.find_one(
                {
                    "_id": ObjectId(question_id)
                }
            )

            if question:

                question_list.append(
                    sanitize_question(question)
                )

        except Exception:
            continue

    return {

        "assessment_id": str(
            assessment["_id"]
        ),

        "title": assessment["title"],

        "description": assessment.get(
            "description"
        ),

        "topic": assessment["topic"],

        "duration": assessment["duration"],

        "total_marks": assessment["total_marks"],

        "passing_marks": assessment["passing_marks"],

        "total_questions": len(
            question_list
        ),

        "questions": question_list
    }

# -----------------------------------
# Start Assessment
# -----------------------------------

@router.post("/student/assessment/start")
def start_assessment(
    request: StartAssessmentRequest,
    current_user=Depends(student_required)
):

    assessments = get_assessments_collection()
    sessions = get_sessions_collection()

    if assessments is None or sessions is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    # -----------------------------
    # Find Assessment
    # -----------------------------
    try:

        assessment = assessments.find_one(
            {
                "_id": ObjectId(request.assessment_id)
            }
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid assessment id"
        )

    if assessment is None:

        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )

    # -----------------------------
    # Check Existing Session
    # -----------------------------
    existing_session = sessions.find_one(
        {
            "student_id": current_user["user_id"],
            "assessment_id": request.assessment_id
        }
    )

    if existing_session:

        status = existing_session.get("status")

        if status == "submitted":

            raise HTTPException(
                status_code=400,
                detail="Assessment already submitted."
            )

        if status == "expired":

            raise HTTPException(
                status_code=400,
                detail="Assessment session has expired."
            )

        if status == "in_progress":

            return {

                "message": "Assessment already started",

                "session_id": str(
                    existing_session["_id"]
                ),

                "student_id": existing_session[
                    "student_id"
                ],

                "assessment_id": existing_session[
                    "assessment_id"
                ],

                "started_at": existing_session[
                    "started_at"
                ],

                "expires_at": existing_session[
                    "expires_at"
                ],

                "duration": assessment["duration"],

                "status": existing_session[
                    "status"
                ]
            }

    # -----------------------------
    # Create New Session
    # -----------------------------
    started_at = datetime.utcnow()

    expires_at = started_at + timedelta(
        minutes=assessment["duration"]
    )

    session = AssessmentSession(

        student_id=current_user["user_id"],

        assessment_id=request.assessment_id,

        started_at=started_at,

        expires_at=expires_at,

        status="in_progress"
    )

    result = sessions.insert_one(
        session.model_dump()
    )

    return {

        "message": "Assessment started",

        "session_id": str(
            result.inserted_id
        ),

        "student_id": current_user["user_id"],

        "assessment_id": request.assessment_id,

        "started_at": started_at,

        "expires_at": expires_at,

        "duration": assessment["duration"],

        "status": "in_progress"
    }

@router.post("/student/autosave")
def autosave_answer(
    request: AutoSaveRequest,
    current_user=Depends(student_required)
):

    autosaves = get_autosave_collection()

    if autosaves is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    existing = autosaves.find_one({

        "student_id": current_user["user_id"],

        "assessment_id": request.assessment_id,

        "question_id": request.question_id

    })

    if existing:

        autosaves.update_one(

            {
                "_id": existing["_id"]
            },

            {
                "$set": {

                    "answer": request.answer,

                    "updated_at": datetime.utcnow()
                }
            }
        )

        return {

            "message": "Answer updated successfully"
        }

    autosaves.insert_one({

        "student_id": current_user["user_id"],

        "assessment_id": request.assessment_id,

        "question_id": request.question_id,

        "answer": request.answer,

        "updated_at": datetime.utcnow()

    })

    return {

        "message": "Answer saved successfully"
    }

@router.get("/student/autosave/{assessment_id}")
def get_saved_answers(
    assessment_id: str,
    current_user=Depends(student_required)
):

    autosaves = get_autosave_collection()

    if autosaves is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    saved = autosaves.find({

        "student_id": current_user["user_id"],

        "assessment_id": assessment_id

    })

    answers = {}

    for item in saved:

        answers[item["question_id"]] = item["answer"]

    return {

        "assessment_id": assessment_id,

        "answers": answers
    }

@router.get("/student/dashboard")
def student_dashboard(
    current_user=Depends(student_required)
):

    results = get_results_collection()

    if results is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    student_results = list(

        results.find({

            "student_id": current_user["user_id"]

        })

    )

    total_attempts = len(student_results)

    completed = total_attempts

    pass_count = 0

    total_percentage = 0

    for item in student_results:

        total_percentage += item.get(
            "percentage",
            0
        )

        if item.get("result") == "PASS":

            pass_count += 1

    average_score = 0

    pass_percentage = 0

    if total_attempts > 0:

        average_score = round(

            total_percentage / total_attempts,

            2
        )

        pass_percentage = round(

            (pass_count / total_attempts) * 100,

            2
        )

    return {

        "student_id": current_user["user_id"],

        "total_attempts": total_attempts,

        "completed": completed,

        "average_score": average_score,

        "pass_percentage": pass_percentage
    }

@router.get("/student/results")
def get_student_results(
    current_user=Depends(student_required)
):

    results = get_results_collection()

    if results is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    data = []

    for result in results.find({

        "student_id": current_user["user_id"]

    }):

        result["_id"] = str(result["_id"])

        data.append(result)

    return data

@router.get("/student/result/{assessment_id}")
def get_single_result(
    assessment_id: str,
    current_user=Depends(student_required)
):

    results = get_results_collection()

    if results is None:

        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    result = results.find_one({

        "student_id": current_user["user_id"],

        "assessment_id": assessment_id

    })

    if result is None:

        raise HTTPException(

            status_code=404,

            detail="Result not found"
        )

    result["_id"] = str(result["_id"])

    return result