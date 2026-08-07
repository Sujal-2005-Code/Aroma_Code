import sys
from pathlib import Path

import pytest
from fastapi import HTTPException

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.models.ai_assessment import AIAssessmentGenerateRequest, AIAssessmentSubmitRequest, AIAssessmentSubmissionItem
from app.routes.ai_assessment import generate_assessment, submit_assessment
import app.services.groq as groq_service
from app.services.groq import evaluate_ai_assessment, generate_ai_assessment


def test_generate_ai_assessment_falls_back_when_groq_fails(monkeypatch):
    def fake_call(*args, **kwargs):
        raise HTTPException(status_code=502, detail="groq unavailable")

    monkeypatch.setattr("app.services.groq._call_groq_api", fake_call)

    assessment = generate_ai_assessment("Python", "Intermediate", "Technical", 3)

    assert "questions" in assessment
    assert len(assessment["questions"]) == 3
    assert all("correctAnswer" in question for question in assessment["questions"])


def test_evaluate_ai_assessment_returns_structured_payload_when_groq_fails(monkeypatch):
    def fake_call(*args, **kwargs):
        raise HTTPException(status_code=502, detail="groq unavailable")

    monkeypatch.setattr("app.services.groq._call_groq_api", fake_call)

    payload = {
        "interest": "Python",
        "level": "Intermediate",
        "totalQuestions": 2,
        "correctCount": 1,
        "incorrectCount": 1,
        "unansweredCount": 0,
        "percentage": 50,
        "questionAnalysis": [
            {
                "questionId": 1,
                "question": "What is a list?",
                "userAnswer": "A mutable sequence",
                "correctAnswer": "A mutable sequence",
                "isCorrect": True,
                "topic": "Collections",
                "difficulty": "Intermediate",
                "explanation": "Lists are mutable order-preserving collections.",
            }
        ],
    }

    evaluation = evaluate_ai_assessment(payload)

    assert evaluation["summary"]
    assert evaluation["strengths"]
    assert evaluation["weakAreas"]
    assert evaluation["learningRecommendations"]
    assert evaluation["improvementPlan"]
    assert evaluation["aiFeedback"]
    assert evaluation["motivationalQuote"]


def test_find_env_file_uses_workspace_root_env():
    env_file = groq_service._find_env_file()

    assert env_file is not None
    assert env_file.name == ".env"
    assert env_file.exists()


def test_generate_assessment_forwards_assessment_type_to_groq(monkeypatch):
    calls = []

    def fake_generate(interest, level, assessment_type, num_questions):
        calls.append((interest, level, assessment_type, num_questions))
        return {
            "questions": [
                {
                    "id": 1,
                    "question": "What is a function?",
                    "options": ["A", "B", "C", "D"],
                    "correctAnswer": "A",
                    "topic": "Functions",
                    "difficulty": level,
                    "explanation": "Functions encapsulate reusable logic.",
                }
            ]
        }

    class FakeInsertResult:
        inserted_id = "assessment-1"

    class FakeCollection:
        def insert_one(self, doc):
            return FakeInsertResult()

    monkeypatch.setattr("app.routes.ai_assessment.generate_ai_assessment", fake_generate)
    monkeypatch.setattr("app.routes.ai_assessment.get_ai_assessments_collection", lambda: FakeCollection())

    request = AIAssessmentGenerateRequest(
        skill="Python",
        topic="Functions",
        level="Intermediate",
        assessment_type="Technical",
        num_questions=1,
    )

    response = generate_assessment(request=request, current_user={"user_id": "student-1"})

    assert response["assessment_id"] == "assessment-1"
    assert response["questions"][0]["question"] == "What is a function?"
    assert calls == [("Functions", "Intermediate", "Technical", 1)]


def test_submit_assessment_accepts_option_text_when_correct_answer_is_letter(monkeypatch):
    class FakeAssessmentsCollection:
        def find_one(self, query):
            return {
                "_id": "assessment-1",
                "student_id": "student-1",
                "questions": [
                    {
                        "id": 1,
                        "question": "What is a function?",
                        "options": ["A. Reusable block of code", "B. A database", "C. A UI component", "D. A testing framework"],
                        "correctAnswer": "A",
                        "topic": "Functions",
                        "difficulty": "Intermediate",
                        "explanation": "Functions encapsulate reusable logic.",
                    }
                ],
            }

    class FakeResultsCollection:
        def find_one(self, query):
            return None

        def insert_one(self, doc):
            return type("InsertResult", (), {"inserted_id": "result-1"})()

    monkeypatch.setattr("app.routes.ai_assessment.get_ai_assessments_collection", lambda: FakeAssessmentsCollection())
    monkeypatch.setattr("app.routes.ai_assessment.get_ai_results_collection", lambda: FakeResultsCollection())
    monkeypatch.setattr("app.routes.ai_assessment.evaluate_ai_assessment", lambda payload: {"summary": "ok", "strengths": [], "weakAreas": [], "learningRecommendations": [], "improvementPlan": [], "aiFeedback": "ok", "motivationalQuote": "keep going"})

    request = AIAssessmentSubmitRequest(answers=[AIAssessmentSubmissionItem(questionId=1, selectedAnswer="A. Reusable block of code")])

    response = submit_assessment("assessment-1", request=request, current_user={"user_id": "student-1"})

    assert response["score"] == 1
    assert response["questionAnalysis"][0]["isCorrect"] is True


def test_submit_assessment_formats_answers_in_option_label_style(monkeypatch):
    class FakeAssessmentsCollection:
        def find_one(self, query):
            return {
                "_id": "assessment-1",
                "student_id": "student-1",
                "questions": [
                    {
                        "id": 1,
                        "question": "What is a function?",
                        "options": ["A. Reusable block of code", "B. A database", "C. A UI component", "D. A testing framework"],
                        "correctAnswer": "B",
                        "topic": "Functions",
                        "difficulty": "Intermediate",
                        "explanation": "Functions encapsulate reusable logic.",
                    }
                ],
            }

    class FakeResultsCollection:
        def find_one(self, query):
            return None

        def insert_one(self, doc):
            return type("InsertResult", (), {"inserted_id": "result-1"})()

    monkeypatch.setattr("app.routes.ai_assessment.get_ai_assessments_collection", lambda: FakeAssessmentsCollection())
    monkeypatch.setattr("app.routes.ai_assessment.get_ai_results_collection", lambda: FakeResultsCollection())
    monkeypatch.setattr("app.routes.ai_assessment.evaluate_ai_assessment", lambda payload: {"summary": "ok", "strengths": [], "weakAreas": [], "learningRecommendations": [], "improvementPlan": [], "aiFeedback": "ok", "motivationalQuote": "keep going"})

    request = AIAssessmentSubmitRequest(answers=[AIAssessmentSubmissionItem(questionId=1, selectedAnswer="A. Reusable block of code")])

    response = submit_assessment("assessment-1", request=request, current_user={"user_id": "student-1"})

    assert response["questionAnalysis"][0]["userAnswer"] == "A. Reusable block of code"
    assert response["questionAnalysis"][0]["correctAnswer"] == "B. A database"
