import re
from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime
from typing import Dict, Any, List

from app.database.db import db
from app.dependencies.auth import student_required
from app.models.ai_assessment import (
    AIAssessmentGenerateRequest,
    AIAssessmentResponse,
    AIAssessmentSubmitRequest,
)
from app.services.groq import generate_ai_assessment, evaluate_ai_assessment

router = APIRouter(prefix="/ai-assessment", tags=["AI Assessment"])

def get_ai_assessments_collection():
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")
    return db["ai_assessments"]

def get_ai_results_collection():
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")
    return db["ai_assessment_results"]


@router.post("/generate")
def generate_assessment(
    request: AIAssessmentGenerateRequest,
    current_user = Depends(student_required)
):
    try:
        assessment_data = generate_ai_assessment(
            interest=request.topic or request.skill,
            level=request.level,
            assessment_type=request.assessment_type,
            num_questions=request.num_questions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    questions = assessment_data.get("questions", [])

    # Store the generated assessment in DB
    assessment_doc = {
        "student_id": current_user["user_id"],
        "skill": request.skill,
        "topic": request.topic,
        "level": request.level,
        "type": request.assessment_type,
        "questions": questions,
        "created_at": datetime.utcnow()
    }

    collection = get_ai_assessments_collection()
    result = collection.insert_one(assessment_doc)

    # Strip correct answers and explanations before returning to client
    client_questions = []
    for q in questions:
        client_questions.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "topic": q.get("topic"),
            "difficulty": q.get("difficulty")
        })

    return {
        "assessment_id": str(result.inserted_id),
        "questions": client_questions
    }


@router.post("/{assessment_id}/submit")
def submit_assessment(
    assessment_id: str,
    request: AIAssessmentSubmitRequest,
    current_user = Depends(student_required)
):
    assessments_col = get_ai_assessments_collection()
    results_col = get_ai_results_collection()

    # Check if already submitted
    existing_result = results_col.find_one({
        "assessment_id": assessment_id,
        "student_id": current_user["user_id"]
    })

    if existing_result:
        existing_result["_id"] = str(existing_result["_id"])
        return existing_result

    try:
        assessment = assessments_col.find_one({"_id": ObjectId(assessment_id), "student_id": current_user["user_id"]})
    except Exception:
        assessment = assessments_col.find_one({"_id": assessment_id, "student_id": current_user["user_id"]})

    if assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    original_questions = assessment.get("questions", [])

    # Prepare data for evaluation
    total_questions = len(original_questions)
    correct_count = 0
    incorrect_count = 0
    unanswered_count = 0

    question_analysis = []

    user_answers_dict = {item.questionId: item.selectedAnswer for item in request.answers}

    def normalize_answer(value: Any) -> str:
        if value is None:
            return ""
        text = str(value).strip()
        if not text:
            return ""
        return text.lower().replace(".", "").replace("-", " ").replace("_", " ").strip()

    def strip_option_label(value: Any) -> str:
        text = str(value or "").strip()
        if not text:
            return ""
        match = re.match(r"^\s*([A-Da-d])(?:[\.)\-:])\s*(.+)$", text)
        if match:
            return match.group(2).strip()
        return text

    def format_display_answer(question: Dict[str, Any], value: Any) -> str:
        if value is None or str(value).strip() == "":
            return "Not Answered"

        options = [str(option).strip() for option in question.get("options", []) if str(option).strip()]
        text = str(value).strip()

        if text.lower() in {"a", "b", "c", "d"}:
            option_index = ord(text.upper()) - ord("A")
            if 0 <= option_index < len(options):
                return options[option_index]

        for option in options:
            if normalize_answer(option) == normalize_answer(text):
                return option
            if normalize_answer(strip_option_label(option)) == normalize_answer(text):
                return option

        return text

    def is_answer_correct(question: Dict[str, Any], user_answer: Any, correct_answer: Any) -> bool:
        normalized_correct = normalize_answer(correct_answer)
        normalized_user = normalize_answer(user_answer)

        if normalized_user == normalized_correct:
            return True

        options = [str(option).strip() for option in question.get("options", []) if str(option).strip()]
        normalized_options = [normalize_answer(option) for option in options]
        stripped_options = [normalize_answer(strip_option_label(option)) for option in options]

        if normalized_user in normalized_options:
            option_index = normalized_options.index(normalized_user)
            option_label = chr(ord("A") + option_index)
            if normalize_answer(option_label) == normalized_correct:
                return True

        if normalized_user in stripped_options:
            option_index = stripped_options.index(normalized_user)
            option_label = chr(ord("A") + option_index)
            if normalize_answer(option_label) == normalized_correct:
                return True

        if normalized_correct in {"a", "b", "c", "d"}:
            option_index = ord(normalized_correct.upper()) - ord("A")
            if 0 <= option_index < len(options):
                option_text = strip_option_label(options[option_index])
                if normalized_user == normalize_answer(option_text) or normalize_answer(chr(ord("A") + option_index)) == normalized_user:
                    return True

        if normalized_user in {"a", "b", "c", "d"}:
            option_index = ord(normalized_user.upper()) - ord("A")
            if 0 <= option_index < len(options):
                option_text = strip_option_label(options[option_index])
                if normalized_correct == normalize_answer(option_text) or normalize_answer(chr(ord("A") + option_index)) == normalized_correct:
                    return True

        return False

    for q in original_questions:
        q_id = q["id"]
        correct_answer = q["correctAnswer"]
        user_answer = user_answers_dict.get(q_id)

        is_correct = False
        if user_answer is None or str(user_answer).strip() == "":
            unanswered_count += 1
        elif is_answer_correct(q, user_answer, correct_answer):
            correct_count += 1
            is_correct = True
        else:
            incorrect_count += 1

        question_analysis.append({
            "questionId": q_id,
            "question": q["question"],
            "userAnswer": format_display_answer(q, user_answer),
            "correctAnswer": format_display_answer(q, correct_answer),
            "isCorrect": is_correct,
            "topic": q.get("topic", "General"),
            "difficulty": q.get("difficulty", "Medium"),
            "explanation": q.get("explanation", "")
        })

    score = correct_count
    percentage = round((score / total_questions) * 100) if total_questions > 0 else 0

    if percentage >= 80:
        performance_level = "Excellent"
    elif percentage >= 60:
        performance_level = "Good"
    elif percentage >= 40:
        performance_level = "Average"
    else:
        performance_level = "Needs Improvement"

    # Ask Groq for detailed feedback based on deterministic results
    evaluation_payload = {
        "interest": assessment.get("topic") or assessment.get("skill"),
        "level": assessment.get("level"),
        "totalQuestions": total_questions,
        "correctCount": correct_count,
        "incorrectCount": incorrect_count,
        "unansweredCount": unanswered_count,
        "percentage": percentage,
        "questionAnalysis": question_analysis
    }

    try:
        ai_eval = evaluate_ai_assessment(evaluation_payload)
    except Exception as e:
        # Fallback if Groq fails
        ai_eval = {
            "summary": f"You scored {percentage}%.",
            "strengths": [],
            "weakAreas": [],
            "learningRecommendations": [],
            "improvementPlan": [],
            "aiFeedback": "Unable to generate detailed feedback at this time.",
            "motivationalQuote": "Keep practicing!"
        }

    # Construct final result
    final_result = {
        "student_id": current_user["user_id"],
        "assessment_id": assessment_id,
        "score": score,
        "totalQuestions": total_questions,
        "percentage": percentage,
        "performanceLevel": performance_level,
        "summary": ai_eval.get("summary", ""),
        "strengths": ai_eval.get("strengths", []),
        "weakAreas": ai_eval.get("weakAreas", []),
        "questionAnalysis": question_analysis,
        "learningRecommendations": ai_eval.get("learningRecommendations", []),
        "improvementPlan": ai_eval.get("improvementPlan", []),
        "aiFeedback": ai_eval.get("aiFeedback", ""),
        "motivationalQuote": ai_eval.get("motivationalQuote", ""),
        "created_at": datetime.utcnow()
    }

    res = results_col.insert_one(final_result)
    final_result["_id"] = str(res.inserted_id)

    return final_result


@router.get("/{assessment_id}/result")
def get_assessment_result(
    assessment_id: str,
    current_user = Depends(student_required)
):
    results_col = get_ai_results_collection()

    result = results_col.find_one({
        "assessment_id": assessment_id,
        "student_id": current_user["user_id"]
    })

    if not result:
        raise HTTPException(status_code=404, detail="Result not found")

    result["_id"] = str(result["_id"])
    return result
