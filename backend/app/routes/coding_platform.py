from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import pymongo

from app.database.db import get_db
from app.dependencies.auth import get_current_user
from app.services.judge0 import evaluate_submission
from app.services.groq import analyze_submission, generate_coding_problem
from app.models.coding_platform import CodingProblem, CodingSubmission, CodingScore

router = APIRouter(
    prefix="/coding",
    tags=["Coding Platform"]
)

# -----------------------------
# Endpoints
# -----------------------------

@router.get("/problems", response_model=List[Dict[str, Any]])
def get_coding_problems(db=Depends(get_db)):
    """List all problems without hidden test cases."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    collection = db["coding_problems"]
    problems = list(collection.find().sort("order", 1))

    result = []
    for p in problems:
        p["_id"] = str(p["_id"])
        if "hiddenTests" in p:
            del p["hiddenTests"]
        result.append(p)

    return result

@router.get("/problems/{slug}", response_model=Dict[str, Any])
def get_coding_problem(slug: str, db=Depends(get_db)):
    """Get a specific problem by slug without hidden test cases."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    collection = db["coding_problems"]
    p = collection.find_one({"slug": slug})

    if not p:
        raise HTTPException(status_code=404, detail="Problem not found")

    p["_id"] = str(p["_id"])
    if "hiddenTests" in p:
        del p["hiddenTests"]

    return p

class SubmitRequest(BaseModel):
    problemSlug: str
    language: str
    code: str

class GenerateProblemRequest(BaseModel):
    topic: Optional[str] = None
    difficulty: Optional[str] = None

@router.post("/generate", response_model=Dict[str, Any])
def generate_problem(
    request: GenerateProblemRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Generate and persist a new coding problem using GROQ AI."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    raw_problem = generate_coding_problem(topic=request.topic, difficulty=request.difficulty)
    problem = {
        "slug": raw_problem.get("slug") or raw_problem.get("title", "problem").lower().replace(" ", "-").replace("/", "-").strip("-"),
        "title": raw_problem.get("title", "Untitled Problem"),
        "description": raw_problem.get("description", ""),
        "difficulty": raw_problem.get("difficulty", "Medium"),
        "tags": raw_problem.get("tags", []),
        "constraints": raw_problem.get("constraints", []),
        "examples": raw_problem.get("examples", []),
        "hints": raw_problem.get("hints", []),
        "starterCode": {
            "python": raw_problem.get("starterCode", {}).get("python", ""),
            "cpp": raw_problem.get("starterCode", {}).get("cpp", ""),
            "java": raw_problem.get("starterCode", {}).get("java", ""),
            "c": raw_problem.get("starterCode", {}).get("c", ""),
        },
        "sampleTests": raw_problem.get("sampleTests", []),
        "hiddenTests": raw_problem.get("hiddenTests", []),
        "timeLimitMs": int(raw_problem.get("timeLimitMs", 5000)),
        "order": int(raw_problem.get("order", 0)),
        "createdAt": datetime.utcnow(),
    }

    problems_col = db["coding_problems"]
    existing = problems_col.find_one({"slug": problem["slug"]})
    if existing:
        problem["slug"] = f"{problem["slug"]}-{int(datetime.utcnow().timestamp())}"

    insert_result = problems_col.insert_one(problem)
    problem["_id"] = str(insert_result.inserted_id)
    return problem

@router.post("/submit", response_model=Dict[str, Any])
def submit_code(
    request: SubmitRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Evaluate code submission, save it, and update score."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    problems_col = db["coding_problems"]
    problem = problems_col.find_one({"slug": request.problemSlug})

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    hidden_tests = problem.get("hiddenTests", [])

    # Map to format expected by evaluate_submission
    mapped_tests = [
        {"input": tc["input"], "output": tc["expectedOutput"]}
        for tc in hidden_tests
    ]

    # Evaluate using Judge0 service
    result = evaluate_submission(
        language=request.language,
        source_code=request.code,
        hidden_test_cases=mapped_tests
    )

    # Determine verdict
    if result["total"] > 0 and result["passed"] == result["total"]:
        verdict = "Accepted"
    elif result["failed"] > 0:
        verdict = "Wrong Answer" # Simplification, could be Time Limit, Runtime Error etc.
        # Check details for true status
        for d in result["details"]:
            if not d["passed"]:
                if "Time Limit" in str(d["status"]):
                    verdict = "Time Limit Exceeded"
                elif "Runtime" in str(d["status"]):
                    verdict = "Runtime Error"
                elif "Compilation" in str(d["status"]):
                    verdict = "Compilation Error"
                break
    else:
        verdict = "Internal Error"

    analysis = analyze_submission(
        problem=problem,
        language=request.language,
        source_code=request.code,
        judge0_result=result,
    )

    submission = CodingSubmission(
        userId=current_user.get("user_id", ""),
        problemSlug=request.problemSlug,
        language=request.language,
        code=request.code,
        verdict=verdict,
        runtimeMs=int(result.get("average_execution_time", 0) * 1000),
        memoryKb=result.get("maximum_memory", 0),
        passedTests=result["passed"],
        totalTests=result["total"],
        detail=f"{result['passed']}/{result['total']} passed"
    )

    submissions_col = db["coding_submissions"]
    sub_doc = submission.model_dump()
    sub_doc["submittedAt"] = datetime.utcnow()
    sub_id = submissions_col.insert_one(sub_doc).inserted_id

    # Update coding score if accepted
    if verdict == "Accepted":
        update_coding_score(db, current_user, problem)

    return {
        "submission_id": str(sub_id),
        "verdict": verdict,
        "runtimeMs": submission.runtimeMs,
        "memoryKb": submission.memoryKb,
        "passedTests": submission.passedTests,
        "totalTests": submission.totalTests,
        "details": result["details"],
        "analysis": analysis,
    }

def update_coding_score(db, current_user, problem):
    """Helper to update a user's coding score upon an Accepted submission."""
    scores_col = db["coding_scores"]
    user_id = current_user["user_id"]
    difficulty = problem.get("difficulty", "Easy").lower()

    score = scores_col.find_one({"userId": user_id})
    if not score:
        display_name = current_user.get("name") or current_user.get("displayName") or "Anonymous"
        new_score = CodingScore(
            userId=user_id,
            displayName=display_name,
            totalSolved=0,
            easy=0,
            medium=0,
            hard=0,
            score=0
        ).model_dump()
        scores_col.insert_one(new_score)
        score = new_score

    # Check if problem is already solved to avoid double-counting
    # We can check if an Accepted submission already exists for this problem
    # BEFORE this current one (which we just added, so there should be at least 1).
    # If count > 1, it was already solved.
    submissions_col = db["coding_submissions"]
    solved_count = submissions_col.count_documents({
        "userId": user_id,
        "problemSlug": problem["slug"],
        "verdict": "Accepted"
    })

    if solved_count == 1:
        # First time solving this problem!
        points_map = {"easy": 10, "medium": 30, "hard": 50}
        points = points_map.get(difficulty, 10)

        scores_col.update_one(
            {"userId": user_id},
            {
                "$inc": {
                    "totalSolved": 1,
                    f"{difficulty}": 1,
                    "score": points
                },
                "$set": {
                    "lastSolvedAt": datetime.utcnow(),
                    "updatedAt": datetime.utcnow()
                }
            }
        )

@router.get("/submissions", response_model=List[Dict[str, Any]])
def get_user_submissions(
    problemSlug: Optional[str] = None,
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    """Fetch user's submissions. Optionally filter by problem."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    query = {"userId": current_user["user_id"]}
    if problemSlug:
        query["problemSlug"] = problemSlug

    submissions_col = db["coding_submissions"]
    cursor = submissions_col.find(query).sort("submittedAt", pymongo.DESCENDING).limit(50)

    result = []
    for sub in cursor:
        sub["_id"] = str(sub["_id"])
        result.append(sub)

    return result

@router.get("/leaderboard", response_model=List[Dict[str, Any]])
def get_leaderboard(db=Depends(get_db)):
    """Fetch top users by score."""
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    scores_col = db["coding_scores"]
    cursor = scores_col.find().sort("score", pymongo.DESCENDING).limit(100)

    result = []
    for idx, score in enumerate(cursor, 1):
        score["_id"] = str(score["_id"])
        score["rank"] = idx
        result.append(score)

    return result
