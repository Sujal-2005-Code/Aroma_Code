import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
import httpx
from fastapi import HTTPException


def _find_env_file() -> Optional[Path]:
    candidates = [
        Path(__file__).resolve().parents[3] / ".env",
        Path(__file__).resolve().parents[2] / ".env",
        Path.cwd() / ".env",
    ]
    for path in candidates:
        if path.exists():
            return path
    return None


def _load_environment() -> None:
    env_file = _find_env_file()
    if env_file:
        load_dotenv(env_file, override=False)


_load_environment()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1/chat/completions")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")


def _build_fallback_assessment(interest: str, level: str, assessment_type: str, num_questions: int) -> Dict[str, Any]:
    topic_pool = ["Core Concepts", "Practical Application", "Problem Solving", "Best Practices"]
    questions = []
    count = max(1, int(num_questions or 5))
    interest_label = (interest or "the selected topic").strip()
    level_label = (level or "Intermediate").strip()
    assessment_label = (assessment_type or "Technical").strip()

    for index in range(1, count + 1):
        topic = topic_pool[(index - 1) % len(topic_pool)]
        question_text = f"Which option best reflects a solid understanding of {interest_label} for {assessment_label.lower()} practice at the {level_label.lower()} level?"
        options = [
            "A well-reasoned answer using the core concept",
            "A guess without supporting evidence",
            "An unrelated explanation",
            "A partially correct but incomplete response",
        ]
        correct_answer = options[0]
        questions.append({
            "id": index,
            "question": question_text,
            "options": options,
            "correctAnswer": correct_answer,
            "topic": topic,
            "difficulty": level_label,
            "explanation": f"{correct_answer} demonstrates the most accurate understanding of {interest_label} for this level.",
        })

    return {"questions": questions}


def _build_fallback_evaluation(payload: Dict[str, Any]) -> Dict[str, Any]:
    question_analysis = payload.get("questionAnalysis") or []
    total_questions = int(payload.get("totalQuestions") or len(question_analysis) or 1)
    correct_count = int(payload.get("correctCount") or 0)
    incorrect_count = int(payload.get("incorrectCount") or 0)
    unanswered_count = int(payload.get("unansweredCount") or 0)
    percentage = int(payload.get("percentage") or round((correct_count / total_questions) * 100) if total_questions else 0)

    topic_stats: Dict[str, int] = {}
    for item in question_analysis:
        if not isinstance(item, dict):
            continue
        topic = item.get("topic") or "General"
        topic_stats[topic] = topic_stats.get(topic, 0) + (1 if item.get("isCorrect") else 0)

    strengths = []
    for topic, count in sorted(topic_stats.items(), key=lambda item: item[1], reverse=True)[:3]:
        strengths.append({"topic": topic, "performance": min(100, round((count / max(1, total_questions)) * 100))})
    if not strengths:
        strengths.append({"topic": payload.get("interest") or "Core concepts", "performance": 70})

    weak_topics = []
    for item in question_analysis:
        if not isinstance(item, dict):
            continue
        if item.get("isCorrect"):
            continue
        topic = item.get("topic") or "General"
        weak_topics.append(topic)

    weak_areas = []
    if weak_topics:
        for topic in sorted(set(weak_topics)):
            weak_areas.append({"topic": topic, "performance": 40, "reason": f"The user needs more practice with {topic.lower()} to build more confidence."})
    else:
        weak_areas.append({"topic": payload.get("interest") or "Foundational concepts", "performance": 45, "reason": "The user can strengthen understanding by practicing the core ideas more thoroughly."})

    learning_recommendations = [item["topic"] for item in weak_areas[:3]] or [payload.get("interest") or "Core concepts"]
    improvement_plan = [
        {"topic": item["topic"], "action": f"Practice {item['topic'].lower()} with short drills and review the explanations carefully.", "priority": "High" if index == 0 else "Medium"}
        for index, item in enumerate(weak_areas[:3])
    ]

    summary = (
        f"You answered {correct_count} of {total_questions} questions correctly with a {percentage}% score. "
        f"You left {unanswered_count} unanswered and can improve by revisiting the weaker topics."
    )
    ai_feedback = (
        f"You demonstrated a solid grasp of the main ideas, but extra practice in the weaker areas will help you build more confidence and consistency."
    )

    return {
        "summary": summary,
        "strengths": strengths,
        "weakAreas": weak_areas,
        "learningRecommendations": learning_recommendations,
        "improvementPlan": improvement_plan,
        "aiFeedback": ai_feedback,
        "motivationalQuote": "Progress comes from steady practice, not perfection on the first try.",
    }


def _extract_json_object(text: str) -> str:
    if not text:
        raise ValueError("Empty AI response")

    cleaned = text.strip()
    cleaned = cleaned.replace("```json", "").replace("```", "")
    cleaned = cleaned.strip()

    # If the model provided a single JSON object, use it directly.
    if cleaned.startswith("{") and cleaned.endswith("}"):
        return cleaned

    # Try to locate the first full JSON object in the response.
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start >= 0 and end >= 0 and end > start:
        return cleaned[start:end + 1]

    raise ValueError("Could not extract JSON from AI response")


def _parse_json(text: str) -> Any:
    try:
        content = _extract_json_object(text)
        return json.loads(content)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Unable to parse JSON from AI response: {exc}")


def _call_groq_api(messages: List[Dict[str, str]], max_tokens: int = 800, temperature: float = 0.2) -> str:
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")

    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "top_p": 0.95,
    }

    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )

        response.raise_for_status()
        data = response.json()
        choices = data.get("choices") or []
        if not choices or not isinstance(choices, list):
            raise ValueError("Invalid GROQ response format")

        message = choices[0].get("message") or {}
        content = message.get("content")
        if not content:
            raise ValueError("GROQ response did not include a message content")

        return content

    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail=f"GROQ API request failed: {exc.response.text}")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"GROQ API error: {exc}")


def generate_mentor_response(user_context: str, user_prompt: str, max_tokens: int = 500, temperature: float = 0.7) -> str:
    messages = [
        {
            "role": "system",
            "content": f"{user_context} Provide helpful, concise career advice, study plans, and interview preparation tips. Keep responses under 200 words.",
        },
        {"role": "user", "content": user_prompt},
    ]
    return _call_groq_api(messages, max_tokens=max_tokens, temperature=temperature)


def generate_coding_problem(topic: Optional[str] = None, difficulty: Optional[str] = None) -> Dict[str, Any]:
    prompt_parts = [
        "Create a single coding interview problem in JSON format.",
        "Return only a valid JSON object and do not include markdown formatting.",
        "The object must include: title, description, difficulty, tags, constraints, examples, hints, starterCode, sampleTests, hiddenTests, timeLimitMs, order.",
        "starterCode must be an object with python, cpp, java, and c fields.",
        "sampleTests and hiddenTests must be arrays of objects with input and expectedOutput fields.",
        "Use escaped newlines in any multiline string values.",
    ]

    if topic:
        prompt_parts.append(f"Use the topic '{topic}' to guide the problem.")
    if difficulty:
        prompt_parts.append(f"Set difficulty to '{difficulty}'.")

    prompt = " ".join(prompt_parts)

    messages = [
        {"role": "system", "content": "You are a coding problem generator that creates clean JSON output."},
        {"role": "user", "content": prompt},
    ]

    raw = _call_groq_api(messages, max_tokens=900, temperature=0.45)
    problem = _parse_json(raw)

    if not isinstance(problem, dict):
        raise HTTPException(status_code=502, detail="GROQ returned invalid problem structure")

    return problem


def analyze_submission(
    problem: Dict[str, Any],
    language: str,
    source_code: str,
    judge0_result: Dict[str, Any],
) -> Dict[str, Any]:
    sample_tests = problem.get("sampleTests") or problem.get("sample_test_cases") or []
    hidden_tests = problem.get("hiddenTests") or problem.get("hidden_test_cases") or []

    summary = []
    summary.append(f"Problem: {problem.get('title', 'Coding problem')}")
    summary.append(f"Language: {language}")
    summary.append(f"Passed {judge0_result.get('passed', 0)} of {judge0_result.get('total', 0)} hidden tests.")

    prompt = (
        "You are an AI coding mentor. Analyze the submitted code and the evaluation results. "
        "Provide a clear candidate-facing summary, a short explanation of why the result happened, "
        "code quality feedback, and an improved suggested solution in the same language. "
        "Return only valid JSON with fields: summary, explanation, code_quality, suggested_solution, verified_test_cases. "
        "Use escaped newlines in multiline values and do not include markdown formatting."
    )

    payload = {
        "problem_title": problem.get("title", "Coding problem"),
        "problem_description": problem.get("description", ""),
        "constraints": problem.get("constraints", []),
        "sample_tests": sample_tests,
        "hidden_tests": [
            {
                "input": tc.get("input"),
                "expectedOutput": tc.get("expectedOutput"),
            }
            for tc in hidden_tests
        ],
        "submitted_language": language,
        "submitted_code": source_code,
        "evaluation": {
            "passed": judge0_result.get("passed", 0),
            "failed": judge0_result.get("failed", 0),
            "total": judge0_result.get("total", 0),
            "details": judge0_result.get("details", []),
        },
    }

    user_content = "".join([
        "Here is the problem and evaluation data:\n",
        json.dumps(payload, ensure_ascii=False, indent=2),
    ])

    messages = [
        {"role": "system", "content": "You are a helpful AI that explains programming solutions and review code clearly."},
        {"role": "user", "content": f"{prompt}\n\n{user_content}"},
    ]

    raw = _call_groq_api(messages, max_tokens=1200, temperature=0.35)
    analysis = _parse_json(raw)

    if not isinstance(analysis, dict):
        raise HTTPException(status_code=502, detail="GROQ returned invalid analysis structure")

    return analysis

def generate_ai_assessment(interest: str, level: str, assessment_type: str, num_questions: int) -> Dict[str, Any]:
    prompt = f"""
    Generate an assessment with exactly {num_questions} questions for a user interested in '{interest}'.
    The user's skill level is '{level}' and the assessment type is '{assessment_type}'.

    The questions should:
    - Test actual understanding rather than memorization only
    - Have clear and unambiguous answers
    - Cover multiple subtopics where appropriate
    - Avoid duplicate questions
    - Have one clearly identifiable correct answer
    - Be suitable for the '{level}' difficulty

    Return ONLY a valid JSON object in the following format (no markdown):
    {{
      "questions": [
        {{
          "id": 1,
          "question": "Question text?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "topic": "Specific Subtopic",
          "difficulty": "{level}",
          "explanation": "Why A is correct"
        }}
      ]
    }}
    """

    messages = [
        {"role": "system", "content": "You are an expert AI assessment engineer. You generate rigorous, accurate, and fair multiple choice questions. You must return only valid JSON."},
        {"role": "user", "content": prompt}
    ]

    try:
        raw = _call_groq_api(messages, max_tokens=2000, temperature=0.3)
        assessment = _parse_json(raw)
    except Exception:
        return _build_fallback_assessment(interest, level, assessment_type, num_questions)

    if not isinstance(assessment, dict) or "questions" not in assessment:
        return _build_fallback_assessment(interest, level, assessment_type, num_questions)

    questions = assessment.get("questions") or []
    if not isinstance(questions, list):
        return _build_fallback_assessment(interest, level, assessment_type, num_questions)

    normalized_questions = []
    for item in questions[:max(1, int(num_questions or 5))]:
        if not isinstance(item, dict):
            continue
        normalized_questions.append({
            "id": item.get("id") or len(normalized_questions) + 1,
            "question": item.get("question") or "Question text",
            "options": item.get("options") or [],
            "correctAnswer": item.get("correctAnswer") or (item.get("options") or [""])[0],
            "topic": item.get("topic") or "General",
            "difficulty": item.get("difficulty") or level,
            "explanation": item.get("explanation") or "Explanation will be shared after submission.",
        })

    if not normalized_questions:
        return _build_fallback_assessment(interest, level, assessment_type, num_questions)

    return {"questions": normalized_questions}


def evaluate_ai_assessment(payload: Dict[str, Any]) -> Dict[str, Any]:
    prompt = """
    You are an expert AI assessment evaluator.
    Analyze the provided assessment result and generate a personalized performance report.
    Return ONLY a valid JSON object in the following format (no markdown):
    {
      "summary": "Brief overall performance summary.",
      "strengths": [
        {
          "topic": "Topic Name",
          "performance": 90
        }
      ],
      "weakAreas": [
        {
          "topic": "Topic Name",
          "performance": 40,
          "reason": "Why the user struggled."
        }
      ],
      "learningRecommendations": ["Topic 1", "Topic 2"],
      "improvementPlan": [
        {
          "topic": "Topic 1",
          "action": "What to practice",
          "priority": "High"
        }
      ],
      "aiFeedback": "Overall feedback paragraph.",
      "motivationalQuote": "A relevant quote."
    }
    """

    user_content = json.dumps(payload, ensure_ascii=False, indent=2)

    messages = [
        {"role": "system", "content": "You are a helpful AI mentor that provides constructive evaluation and study plans. Return only valid JSON."},
        {"role": "user", "content": f"{prompt}\n\nHere is the assessment data:\n{user_content}"}
    ]

    try:
        raw = _call_groq_api(messages, max_tokens=1500, temperature=0.4)
        evaluation = _parse_json(raw)
    except Exception:
        return _build_fallback_evaluation(payload)

    if not isinstance(evaluation, dict):
        return _build_fallback_evaluation(payload)

    normalized = {
        "summary": evaluation.get("summary") or _build_fallback_evaluation(payload)["summary"],
        "strengths": evaluation.get("strengths") or _build_fallback_evaluation(payload)["strengths"],
        "weakAreas": evaluation.get("weakAreas") or _build_fallback_evaluation(payload)["weakAreas"],
        "learningRecommendations": evaluation.get("learningRecommendations") or _build_fallback_evaluation(payload)["learningRecommendations"],
        "improvementPlan": evaluation.get("improvementPlan") or _build_fallback_evaluation(payload)["improvementPlan"],
        "aiFeedback": evaluation.get("aiFeedback") or _build_fallback_evaluation(payload)["aiFeedback"],
        "motivationalQuote": evaluation.get("motivationalQuote") or _build_fallback_evaluation(payload)["motivationalQuote"],
    }

    return normalized
