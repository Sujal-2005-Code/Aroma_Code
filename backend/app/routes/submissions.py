
""""

from fastapi import APIRouter
from bson import ObjectId
from datetime import datetime

from app.models.submission import Submission
from app.database.db import db
from app.services.judge0 import evaluate_submission

router = APIRouter()


def get_submissions_collection():
    if db is None:
        return None
    return db["submissions"]


def get_questions_collection():
    if db is None:
        return None
    return db["questions"]


def get_results_collection():
    if db is None:
        return None
    return db["results"]


@router.post("/submissions")
def create_submission(submission: Submission):

    submissions_collection = get_submissions_collection()
    questions_collection = get_questions_collection()
    results_collection = get_results_collection()

    if submissions_collection is None or questions_collection is None:
        return {
            "message": "Submission storage unavailable",
            "submission_id": None,
            "score": 0,
            "total_marks": 0,
            "percentage": 0,
            "results": []
        }

    score = 0.0
    total_marks = 0
    results = []

    for question_id, student_answer in submission.answers.items():

        try:
            question = questions_collection.find_one(
                {"_id": ObjectId(question_id)}
            )
        except Exception:
            continue

        if not question:
            continue

        question_type = question.get("question_type")
        marks = question.get("marks", 1)

        total_marks += marks

        is_correct = False

        # -----------------------------
        # MCQ Evaluation
        # -----------------------------
        if question_type == "mcq":

            correct_answer = question.get("correct_answer")

            is_correct = (
                str(student_answer).strip().lower()
                ==
                str(correct_answer).strip().lower()
            )

            if is_correct:
                score += marks

            results.append({
                "question_id": question_id,
                "question_type": "mcq",
                "marks": marks,
                "your_answer": student_answer,
                "is_correct": is_correct,
                "explanation": question.get("explanation")
            })

        # -----------------------------
        # MSQ Evaluation
        # -----------------------------
        elif question_type == "msq":

            correct_answers = question.get(
                "correct_answers",
                []
            )

            if isinstance(student_answer, list):

                is_correct = (
                    set(map(str.lower, student_answer))
                    ==
                    set(map(str.lower, correct_answers))
                )

            if is_correct:
                score += marks

            results.append({
                "question_id": question_id,
                "question_type": "msq",
                "marks": marks,
                "your_answer": student_answer,
                "is_correct": is_correct,
                "explanation": question.get("explanation")
            })

        # -----------------------------
        # Coding Evaluation
        # -----------------------------
        elif question_type == "coding":

            hidden_test_cases = question.get(
                "hidden_test_cases",
                []
            )

            if (
               hasattr(student_answer, "language")
               and 
               hasattr(student_answer, "source_code")
               ):
                
                coding_result = evaluate_submission(
                    language=student_answer.language,
                    source_code=student_answer.source_code,
                    hidden_test_cases=hidden_test_cases
                )

                marks_awarded = round(
                    (coding_result["percentage"] / 100) * marks,
                    2
                )

                score += marks_awarded

                is_correct = (
                    coding_result["percentage"] == 100
                )

                results.append({

                    "question_id": question_id,

                    "question_type": "coding",

                    "marks": marks,

                    "marks_awarded": marks_awarded,

                     "is_correct": is_correct,

                    "passed_testcases": coding_result["passed"],

                    "failed_testcases": coding_result["failed"],

                    "percentage": coding_result["percentage"],

                    "average_execution_time":
                        coding_result["average_execution_time"],

                    "maximum_memory":
                        coding_result["maximum_memory"],

                    "details":
                        coding_result["details"]
                })

    percentage = 0

    if total_marks > 0:
        percentage = round(
            (score / total_marks) * 100,
            2
        )

    correct_count = sum(
        1 for item in results
        if item.get("is_correct", False)
    )

    wrong_count = len(results) - correct_count

    result_status = "PASS"

    if percentage < 40:
        result_status = "FAIL"

    submission_data = submission.model_dump()

    submission_data["score"] = score
    submission_data["total_marks"] = total_marks
    submission_data["percentage"] = percentage
    submission_data["correct_count"] = correct_count
    submission_data["wrong_count"] = wrong_count
    submission_data["result"] = result_status
    submission_data["submitted_at"] = datetime.utcnow()
    submission_data["results"] = results

    submission_result = submissions_collection.insert_one(
        submission_data
    )

    if results_collection is not None:

        result_document = {

            "student_id": submission.student_id,

            "assessment_id": submission.assessment_id,

            "score": score,

            "total_marks": total_marks,

            "percentage": percentage,

            "correct_count": correct_count,

            "wrong_count": wrong_count,

            "result": result_status,

            "submitted_at": datetime.utcnow()
        }

        results_collection.insert_one(result_document)

    return {

        "message": "Submission saved",

        "submission_id": str(
            submission_result.inserted_id
        ),

        "score": score,

        "total_marks": total_marks,

        "percentage": percentage,

        "correct_count": correct_count,

        "wrong_count": wrong_count,

        "result": result_status,

        "results": results
    }


@router.get("/submissions")
def get_submissions():

    submissions_collection = get_submissions_collection()

    if submissions_collection is None:
        return []

    submissions = []

    for submission in submissions_collection.find():

        submission["_id"] = str(submission["_id"])

        submissions.append(submission)

    return submissions
    """


from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime

from app.models.submission import Submission
from app.database.db import db
from app.services.judge0 import evaluate_submission

from fastapi import Depends
from app.dependencies.auth import student_required



router = APIRouter()


# ---------------------------------------
# Collections
# ---------------------------------------

def get_submissions_collection():
    if db is None:
        return None
    return db["submissions"]


def get_questions_collection():
    if db is None:
        return None
    return db["questions"]


def get_results_collection():
    if db is None:
        return None
    return db["results"]


def get_sessions_collection():
    if db is None:
        return None
    return db["assessment_sessions"]


# ---------------------------------------
# Submit Assessment
# ---------------------------------------

@router.post("/submissions")
def create_submission(
    submission: Submission,
    current_user=Depends(student_required)
):
    submissions_collection = get_submissions_collection()
    questions_collection = get_questions_collection()
    results_collection = get_results_collection()
    sessions_collection = get_sessions_collection()

    if (
        submissions_collection is None
        or questions_collection is None
        or results_collection is None
        or sessions_collection is None
    ):
        raise HTTPException(
            status_code=500,
            detail="Database unavailable"
        )

    # ---------------------------------------
    # Validate Assessment Session
    # ---------------------------------------

    try:

        session = sessions_collection.find_one(
            {"_id": ObjectId(submission.session_id)}
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid session id"
        )

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    if session["student_id"] != current_user["user_id"]:

        raise HTTPException(
            status_code=403,
            detail="Student mismatch"
        )

    if session["assessment_id"] != submission.assessment_id:

        raise HTTPException(
            status_code=403,
            detail="Assessment mismatch"
        )

    if session["status"] == "submitted":

        raise HTTPException(
            status_code=400,
            detail="Assessment already submitted"
        )

    if session["status"] == "expired":

        raise HTTPException(
            status_code=400,
            detail="Assessment already expired"
        )

    if datetime.utcnow() >= session["expires_at"]:
        sessions_collection.update_one(
            {"_id": session["_id"]},
            {"$set": {"status": "expired"}}
        )
        raise HTTPException(status_code=400, detail="Assessment time is over")

    score = 0.0
    total_marks = 0
    results = []


        # ---------------------------------------
    # Evaluate Answers
    # ---------------------------------------

    for question_id, student_answer in submission.answers.items():

        try:

            question = questions_collection.find_one(
                {"_id": ObjectId(question_id)}
            )

        except Exception:
            continue

        if question is None:
            continue

        question_type = question.get("question_type")
        marks = question.get("marks", 1)

        total_marks += marks

        is_correct = False

        # ---------------------------------------
        # MCQ Evaluation
        # ---------------------------------------

        if question_type == "mcq":

            correct_answer = question.get("correct_answer")

            is_correct = (

                str(student_answer).strip().lower()

                ==

                str(correct_answer).strip().lower()

            )

            if is_correct:
                score += marks

            results.append({

                "question_id": question_id,

                "question_type": "mcq",

                "marks": marks,

                "your_answer": student_answer,

                "is_correct": is_correct,

                "explanation": question.get("explanation")

            })

        # ---------------------------------------
        # MSQ Evaluation
        # ---------------------------------------

        elif question_type == "msq":

            correct_answers = question.get(
                "correct_answers",
                []
            )

            if isinstance(student_answer, list):

                is_correct = (

                    set(map(str.lower, student_answer))

                    ==

                    set(map(str.lower, correct_answers))

                )

            if is_correct:
                score += marks

            results.append({

                "question_id": question_id,

                "question_type": "msq",

                "marks": marks,

                "your_answer": student_answer,

                "is_correct": is_correct,

                "explanation": question.get("explanation")

            })

        # ---------------------------------------
        # Coding Evaluation
        # ---------------------------------------

        elif question_type == "coding":

            hidden_test_cases = question.get(
                "hidden_test_cases",
                []
            )

            if (

                hasattr(student_answer, "language")

                and

                hasattr(student_answer, "source_code")

            ):

                coding_result = evaluate_submission(

                    language=student_answer.language,

                    source_code=student_answer.source_code,

                    hidden_test_cases=hidden_test_cases

                )

                marks_awarded = round(

                    (
                        coding_result["percentage"] / 100
                    ) * marks,

                    2

                )

                score += marks_awarded

                is_correct = (
                    coding_result["percentage"] == 100
                )

                results.append({

                    "question_id": question_id,

                    "question_type": "coding",

                    "marks": marks,

                    "marks_awarded": marks_awarded,

                    "is_correct": is_correct,

                    "passed_testcases":
                        coding_result["passed"],

                    "failed_testcases":
                        coding_result["failed"],

                    "percentage":
                        coding_result["percentage"],

                    "average_execution_time":
                        coding_result["average_execution_time"],

                    "maximum_memory":
                        coding_result["maximum_memory"],

                    "details":
                        coding_result["details"]

                })


                    # ---------------------------------------
    # Final Result Calculation
    # ---------------------------------------

    percentage = 0

    if total_marks > 0:

        percentage = round(
            (score / total_marks) * 100,
            2
        )

    correct_count = sum(

        1

        for item in results

        if item.get("is_correct", False)

    )

    wrong_count = len(results) - correct_count

    result_status = "PASS"

    if percentage < 40:

        result_status = "FAIL"

    # ---------------------------------------
    # Save Submission
    # ---------------------------------------

    submission_data = submission.model_dump()

    submission_data["score"] = score
    submission_data["total_marks"] = total_marks
    submission_data["percentage"] = percentage
    submission_data["correct_count"] = correct_count
    submission_data["wrong_count"] = wrong_count
    submission_data["result"] = result_status
    submission_data["submitted_at"] = datetime.utcnow()
    submission_data["results"] = results

    submission_result = submissions_collection.insert_one(
        submission_data
    )

    # ---------------------------------------
    # Save Result Summary
    # ---------------------------------------

    result_document = {

        "student_id": current_user["user_id"],

        "assessment_id": submission.assessment_id,

        "session_id": submission.session_id,

        "score": score,

        "total_marks": total_marks,

        "percentage": percentage,

        "correct_count": correct_count,

        "wrong_count": wrong_count,

        "result": result_status,

        "results": results,

        "submitted_at": datetime.utcnow()

    }

    results_collection.insert_one(result_document)

    # ---------------------------------------
    # Close Assessment Session
    # ---------------------------------------

    sessions_collection.update_one(

        {

            "_id": session["_id"]

        },

        {

            "$set": {

                "status": "submitted",

                "submitted_at": datetime.utcnow()

            }

        }

    )

    # ---------------------------------------
    # Response
    # ---------------------------------------

    return {

        "message": "Submission saved successfully",

        "submission_id": str(
            submission_result.inserted_id
        ),

        "student_id": current_user["user_id"],

        "assessment_id": submission.assessment_id,

        "session_id": submission.session_id,

        "score": score,

        "total_marks": total_marks,

        "percentage": percentage,

        "correct_count": correct_count,

        "wrong_count": wrong_count,

        "result": result_status,

        "results": results

    }


# ---------------------------------------
# Get All Submissions
# ---------------------------------------

@router.get("/submissions")
def get_submissions():

    submissions_collection = get_submissions_collection()

    if submissions_collection is None:

        return []

    submissions = []

    for submission in submissions_collection.find():

        submission["_id"] = str(submission["_id"])

        submissions.append(submission)

    return submissions
