import os
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from typing import Literal
from uuid import uuid4

import requests
from dotenv import load_dotenv
from bson import ObjectId
from app.services.groq import generate_mentor_response

ROUTES_DIRECTORY = os.path.dirname(__file__)
# Local development commonly keeps secrets in the workspace root, while
# deployments may keep a backend-specific .env. Load both without replacing
# variables already provided by the process environment.
load_dotenv(os.path.join(ROUTES_DIRECTORY, "..", "..", "..", ".env"))
load_dotenv(os.path.join(ROUTES_DIRECTORY, "..", "..", ".env"))
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, field_validator

from app.database.db import db
from app.dependencies.auth import recruiter_required, student_required

router = APIRouter()


def require_db():
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")
    return db


def student_results(student_id: str):
    return list(require_db()["results"].find({"student_id": student_id}))


def student_summary(student_id: str):
    database = require_db()
    user = database["users"].find_one({"_id": ObjectId(student_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    results = student_results(student_id)
    average = round(sum(item.get("percentage", 0) for item in results) / len(results), 2) if results else 0
    return user, results, average


def _fallback_mentor_content(results, average, request_content: str) -> str:
    return (
        f"You have completed {len(results)} assessments with an average score of {average}%. "
        f"For your question about {request_content[:120]}, start with one focused project, practise it daily, and review the outcome each week."
    )


def _create_mentor_response(request: MentorMessageRequest, current_user: dict):
    database = require_db()
    now = datetime.utcnow()
    database["mentor_messages"].insert_one({"student_id": current_user["user_id"], "role": "user", "content": request.content, "created_at": now})

    _, results, average = student_summary(current_user["user_id"])
    user_context = f"You are an AI Career Mentor for a student who has completed {len(results)} assessments with an average score of {average}%."
    ai_content = _fallback_mentor_content(results, average, request.content)

    if os.getenv("GROQ_API_KEY"):
        try:
            ai_content = generate_mentor_response(user_context, request.content)
        except Exception:
            ai_content = _fallback_mentor_content(results, average, request.content)

    result = database["mentor_messages"].insert_one({"student_id": current_user["user_id"], "role": "assistant", "content": ai_content, "created_at": datetime.utcnow()})
    return {"id": str(result.inserted_id), "role": "assistant", "content": ai_content, "timestamp": datetime.utcnow().isoformat()}


class MentorMessageRequest(BaseModel):
    content: str = Field(min_length=1, max_length=4000)


class GithubProfileRequest(BaseModel):
    username: str
    headline: str = ""
    repositories: list[dict] = Field(default_factory=list)
    languages: list[dict] = Field(default_factory=list)
    contributions: list[dict] = Field(default_factory=list)
    monthly_commits: list[dict] = Field(default_factory=list)


class GithubAnalysisRequest(BaseModel):
    username: str = Field(min_length=1, max_length=39, pattern=r"^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$")

    @field_validator("username")
    @classmethod
    def normalize_username(cls, value: str) -> str:
        return value.strip()


GITHUB_API_URL = "https://api.github.com"
LANGUAGE_COLORS = {
    "TypeScript": "#3178C6", "JavaScript": "#F1E05A", "Python": "#3572A5",
    "Java": "#B07219", "C++": "#F34B7D", "C": "#555555", "C#": "#178600",
    "Go": "#00ADD8", "Rust": "#DEA584", "PHP": "#4F5D95", "Ruby": "#701516",
    "Kotlin": "#A97BFF", "Swift": "#F05138", "HTML": "#E34C26", "CSS": "#563D7C",
}
SOURCE_FILE_EXTENSIONS = {".c", ".cc", ".cpp", ".cs", ".css", ".go", ".html", ".java", ".js", ".jsx", ".kt", ".php", ".py", ".rb", ".rs", ".swift", ".ts", ".tsx", ".vue"}
DEPENDENCY_FILE_NAMES = {"package.json", "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "requirements.txt", "pyproject.toml", "pipfile", "poetry.lock", "cargo.toml", "go.mod", "pom.xml", "build.gradle"}
ANALYSIS_CACHE: dict[str, tuple[datetime, dict]] = {}
ANALYSIS_CACHE_TTL = timedelta(minutes=15)


def _github_headers() -> dict[str, str]:
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "Aroma-GitHub-Analytics"}
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def _github_request(path: str, params: dict | None = None):
    try:
        response = requests.get(f"{GITHUB_API_URL}{path}", headers=_github_headers(), params=params, timeout=12)
    except requests.RequestException as error:
        raise HTTPException(status_code=503, detail="GitHub is temporarily unavailable. Please try again shortly.") from error

    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="GitHub user or repository was not found.")
    if response.status_code == 403 and response.headers.get("X-RateLimit-Remaining") == "0":
        raise HTTPException(status_code=429, detail="GitHub request limit reached. Please try again later.")
    if not response.ok:
        raise HTTPException(status_code=502, detail="GitHub could not provide profile data right now.")
    return response.json()


def _score(value: float) -> int:
    return max(0, min(100, round(value)))


def _repository_metrics(username: str, repository: dict, languages: list[str], has_readme: bool) -> dict:
    if not repository.get("default_branch"):
        return {
            "total_files": 0, "source_files": 0, "sampled_lines": 0, "has_readme": has_readme,
            "has_tests": False, "has_docker": False, "has_ci": False, "has_license": False,
            "detected_frameworks": languages, "dependency_files": [], "important_files": [],
        }
    tree = _github_request(f"/repos/{username}/{repository['name']}/git/trees/{repository['default_branch']}", {"recursive": "1"})
    paths = [item.get("path", "") for item in tree.get("tree", []) if item.get("type") == "blob"]
    lower_paths = [path.lower() for path in paths]
    source_files = [path for path in paths if os.path.splitext(path)[1].lower() in SOURCE_FILE_EXTENSIONS]
    dependency_files = [path for path in paths if os.path.basename(path).lower() in DEPENDENCY_FILE_NAMES]
    important_files = [path for path in paths if os.path.basename(path).lower().startswith(("readme", "dockerfile", "license")) or path.lower().startswith(".github/workflows/")]
    has_tests = any("test" in path or "spec" in path for path in lower_paths)
    has_docker = any(os.path.basename(path).lower().startswith("dockerfile") or path.lower().endswith("docker-compose.yml") for path in paths)
    has_ci = any(path.startswith(".github/workflows/") for path in paths)
    has_license = any(os.path.basename(path).lower().startswith("license") for path in paths)
    frameworks = list(languages)
    if any(os.path.basename(path).lower() == "package.json" for path in paths):
        frameworks.append("Node.js")
    if any(os.path.basename(path).lower() in {"requirements.txt", "pyproject.toml", "pipfile"} for path in paths):
        frameworks.append("Python")
    return {
        "total_files": len(paths), "source_files": len(source_files), "sampled_lines": 0,
        "has_readme": has_readme, "has_tests": has_tests, "has_docker": has_docker,
        "has_ci": has_ci, "has_license": has_license,
        "detected_frameworks": list(dict.fromkeys(frameworks)),
        "dependency_files": dependency_files[:12], "important_files": important_files[:12],
    }


def _repository_review(repository: dict, languages: list[str], metrics: dict) -> dict:
    updated_at = datetime.fromisoformat(repository["updated_at"].replace("Z", "+00:00"))
    days_since_update = max(0, (datetime.now(timezone.utc) - updated_at).days)
    recency = max(0, 30 - min(days_since_update, 365) / 12)
    documentation = _score((55 if metrics["has_readme"] else 0) + (20 if repository.get("description") else 0) + (15 if repository.get("homepage") else 0) + (10 if repository.get("topics") else 0))
    community = min(20, repository.get("stargazers_count", 0) * 2 + repository.get("forks_count", 0) * 2)
    quality = _score(20 + documentation * 0.35 + recency + community + (10 if languages else 0))
    issues = []
    recommendations = []
    if not metrics["has_readme"]:
        issues.append("No README was found in the default branch.")
        recommendations.append("Add a README with purpose, setup steps, and key technical decisions.")
    if not repository.get("description"):
        issues.append("The repository has no project description.")
        recommendations.append("Add a concise repository description so the project is easier to understand and discover.")
    if days_since_update > 180:
        issues.append("The repository has not been updated in over six months.")
        recommendations.append("Document the project status or make a small maintenance update to signal whether it is active.")
    if not issues:
        issues.append("No metadata-level issues were detected. Deeper code review is not included in this public-profile scan.")
    if not recommendations:
        recommendations.append("Keep the README, dependencies, and release notes current as the project evolves.")

    return {
        "repository_name": repository["name"],
        "code_quality_score": quality,
        "architecture_score": _score(35 + (20 if len(languages) > 1 else 0) + (15 if metrics["dependency_files"] else 0) + (15 if metrics["has_ci"] else 0) + (15 if metrics["has_docker"] else 0)),
        "readability_score": _score(45 + (25 if repository.get("description") else 0) + (20 if metrics["has_readme"] else 0) + (10 if metrics["has_license"] else 0)),
        "maintainability_score": _score(quality * 0.7 + (20 if metrics["has_tests"] else 0) + (10 if metrics["has_ci"] else 0)),
        "testing_score": 55 if metrics["has_tests"] else 0,
        "documentation_score": documentation,
        "complexity_score": _score(30 + min(40, len(languages) * 10) + min(30, metrics["source_files"] / 5)),
        "developer_level": "Strong" if quality >= 75 else "Developing" if quality >= 50 else "Early-stage",
        "project_difficulty": "Advanced" if len(languages) >= 4 or metrics["source_files"] >= 80 else "Moderate" if len(languages) >= 2 or metrics["source_files"] >= 20 else "Beginner",
        "summary": f"Public repository metadata indicates a {('well-documented' if metrics['has_readme'] else 'lightly documented')} project, last updated {updated_at.date().isoformat()}.",
        "strengths": [item for item in ["Includes a README." if metrics["has_readme"] else None, "Has a clear project description." if repository.get("description") else None, f"Uses {', '.join(languages[:3])}." if languages else None, "Includes automated test files." if metrics["has_tests"] else None, "Includes a CI workflow." if metrics["has_ci"] else None] if item] or ["Repository metadata is available for further improvement."],
        "issues": issues,
        "detected_skills": languages,
        "engineering_practices": [item for item in ["README documentation" if metrics["has_readme"] else None, "Automated test files" if metrics["has_tests"] else None, "Continuous integration workflow" if metrics["has_ci"] else None, "Container configuration" if metrics["has_docker"] else None] if item] or ["No explicit engineering-practice files were detected in the repository tree."],
        "recommendations": recommendations,
        "metrics": metrics,
    }


@router.get("/mentor/messages")
def get_mentor_messages(current_user=Depends(student_required)):
    database = require_db()
    messages = []
    for item in database["mentor_messages"].find({"student_id": current_user["user_id"]}).sort("created_at", 1):
        messages.append({"id": str(item["_id"]), "role": item["role"], "content": item["content"], "timestamp": item["created_at"].isoformat()})
    return messages


@router.post("/mentor/messages")
def create_mentor_message(request: MentorMessageRequest, current_user=Depends(student_required)):
    return _create_mentor_response(request, current_user)


@router.post("/career/guidance")
def create_career_guidance(request: MentorMessageRequest, current_user=Depends(student_required)):
    return _create_mentor_response(request, current_user)


@router.get("/passport")
def get_passport(current_user=Depends(student_required)):
    user, results, average = student_summary(current_user["user_id"])
    coding = [item for item in results if item.get("percentage", 0) > 0]
    score = round(average) if results else 0
    return {
        "name": user.get("full_name", "Student"), "email": user.get("email", ""), "passport_score": score,
        "assessment_count": len(results), "average_score": average, "verified": bool(results),
        "skills": [{"skill": "Assessments", "value": score}, {"skill": "Coding", "value": round(sum(item.get("percentage", 0) for item in coding) / len(coding)) if coding else 0}],
        "certificates": [],
    }


@router.get("/skill-gap")
def get_skill_gap(current_user=Depends(student_required)):
    _, results, average = student_summary(current_user["user_id"])
    current = round(average) if results else 0
    skills = [
        {"name": "Problem solving", "level": current, "required": 75},
        {"name": "System design", "level": max(0, current - 10), "required": 70},
        {"name": "Testing", "level": max(0, current - 15), "required": 70},
    ]
    missing = [item["name"] for item in skills if item["required"] - item["level"] > 10]
    return {"target_role": "Software Engineer", "match_percentage": round(sum(min(item["level"], item["required"]) / item["required"] for item in skills) / len(skills) * 100), "estimated_time": f"{max(2, len(missing) * 2)} weeks", "current_skills": skills, "missing_skills": missing}


@router.get("/github/profile")
def get_github_profile(current_user=Depends(student_required)):
    database = require_db()
    profile = database["github_profiles"].find_one({"student_id": current_user["user_id"]})
    if profile is None:
        return {"username": "Not connected", "headline": "Connect a GitHub profile to view repository analytics.", "repositories": [], "languages": [], "contributions": [], "monthly_commits": [], "stats": {"repos": 0, "stars": 0, "followers": 0, "commits": 0}}
    profile.pop("_id", None)
    profile.pop("student_id", None)
    return profile


@router.post("/github/analyze")
def analyze_github_profile(request: GithubAnalysisRequest, current_user=Depends(student_required)):
    """Build an evidence-based report from public GitHub profile and repository metadata."""
    username = request.username
    cache_key = username.lower()
    cached = ANALYSIS_CACHE.get(cache_key)
    if cached and cached[0] > datetime.now(timezone.utc):
        return cached[1]
    profile = _github_request(f"/users/{username}")
    repositories = _github_request(f"/users/{username}/repos", {"sort": "updated", "direction": "desc", "per_page": 12, "type": "owner"})
    public_events = _github_request(f"/users/{username}/events/public", {"per_page": 100})

    language_bytes: Counter[str] = Counter()
    repository_reviews = []
    repository_summaries = []
    def analyze_repository(repository: dict):
        repo_languages = _github_request(f"/repos/{username}/{repository['name']}/languages")
        try:
            _github_request(f"/repos/{username}/{repository['name']}/readme")
            has_readme = True
        except HTTPException as error:
            if error.status_code != 404:
                raise
            has_readme = False
        languages = list(repo_languages.keys())
        metrics = _repository_metrics(username, repository, languages, has_readme)
        summary = {
            "name": repository["name"], "description": repository.get("description"), "language": repository.get("language"),
            "stars": repository.get("stargazers_count", 0), "forks": repository.get("forks_count", 0), "has_readme": has_readme,
        }
        return repo_languages, _repository_review(repository, languages, metrics), summary

    # GitHub API calls are independent per repository; bounded concurrency keeps the
    # dashboard responsive while avoiding an excessive burst of public API requests.
    with ThreadPoolExecutor(max_workers=4) as executor:
        analyzed_repositories = list(executor.map(analyze_repository, repositories))
    for repo_languages, review, summary in analyzed_repositories:
        language_bytes.update(repo_languages)
        repository_reviews.append(review)
        repository_summaries.append(summary)

    now = datetime.now(timezone.utc)
    push_events = []
    daily_commits: Counter[str] = Counter()
    monthly_commits: Counter[str] = Counter()
    for event in public_events:
        if event.get("type") != "PushEvent" or not event.get("created_at"):
            continue
        event_time = datetime.fromisoformat(event["created_at"].replace("Z", "+00:00"))
        commits = len(event.get("payload", {}).get("commits", [])) or 1
        push_events.append(event_time)
        daily_commits[event_time.date().isoformat()] += commits
        monthly_commits[event_time.strftime("%b %Y")] += commits

    reviewed_count = len(repository_reviews)
    average_quality = sum(item["code_quality_score"] for item in repository_reviews) / reviewed_count if reviewed_count else 0
    documentation_score = sum(item["documentation_score"] for item in repository_reviews) / reviewed_count if reviewed_count else 0
    recent_pushes = sum(1 for event_time in push_events if event_time >= now - timedelta(days=30))
    activity_score = _score(recent_pushes * 12 + min(25, len(push_events) * 2))
    diversity_score = _score(min(100, len(language_bytes) * 18 + min(28, len(language_bytes) * 3)))
    overall_score = _score(average_quality * 0.45 + documentation_score * 0.2 + activity_score * 0.2 + diversity_score * 0.15)
    total_bytes = sum(language_bytes.values())
    languages = [{"name": name, "percentage": round(amount / total_bytes * 100, 1), "color": LANGUAGE_COLORS.get(name, "#FC8F0F")} for name, amount in language_bytes.most_common(8)] if total_bytes else []
    detected_skills = [item["name"] for item in languages]

    strengths = []
    weaknesses = []
    recommendations = []
    readme_count = sum(1 for item in repository_reviews if item["metrics"]["has_readme"])
    if readme_count:
        strengths.append(f"{readme_count} of {reviewed_count} reviewed repositories include a README.")
    else:
        weaknesses.append("None of the reviewed repositories include a README.")
        recommendations.append("Start by documenting the purpose, setup, and key decisions for each project.")
    if len(languages) >= 3:
        strengths.append(f"The public projects demonstrate technology breadth across {len(languages)} languages.")
    else:
        recommendations.append("Showcase projects in more than one technology area to demonstrate broader engineering experience.")
    if activity_score >= 60:
        strengths.append("Recent public GitHub activity is visible in the last 30 days.")
    else:
        weaknesses.append("Limited recent public push activity was found in the GitHub events feed.")
        recommendations.append("Keep active projects updated or pin your strongest work so your current capabilities are visible.")
    if documentation_score < 60:
        weaknesses.append("Repository documentation and metadata can be improved.")
        recommendations.append("Add descriptions, topics, and README files to make projects easier to evaluate.")
    if not strengths:
        strengths.append("A public GitHub profile is available for evidence-based analysis.")
    if not weaknesses:
        weaknesses.append("This report assesses public metadata, not private repositories or line-by-line code quality.")
    recommendations = list(dict.fromkeys(recommendations)) or ["Maintain clear project documentation and regular public updates."]

    response = {
        "success": True,
        "analysis_id": uuid4().hex[:24],
        "data": {
            "overall_score": overall_score, "repository_score": _score(average_quality),
            "documentation_score": _score(documentation_score), "activity_score": activity_score, "diversity_score": diversity_score,
            "summary": f"{profile.get('login', username)} has {profile.get('public_repos', 0)} public repositories. This report reviews the {reviewed_count} most recently updated repositories using publicly available GitHub metadata.",
            "strengths": strengths, "weaknesses": weaknesses, "recommendations": recommendations,
            "detected_skills": detected_skills, "top_projects": [item["name"] for item in repository_summaries[:3]],
            "repositories": repository_summaries, "repository_reviews": repository_reviews,
        },
    }
    ANALYSIS_CACHE[cache_key] = (now + ANALYSIS_CACHE_TTL, response)
    return response


@router.put("/github/profile")
def update_github_profile(request: GithubProfileRequest, current_user=Depends(student_required)):
    database = require_db()
    payload = request.model_dump()
    payload["stats"] = {"repos": len(payload["repositories"]), "stars": sum(item.get("stars", 0) for item in payload["repositories"]), "followers": 0, "commits": sum(item.get("commits", 0) for item in payload["monthly_commits"])}
    database["github_profiles"].update_one({"student_id": current_user["user_id"]}, {"$set": {**payload, "student_id": current_user["user_id"], "updated_at": datetime.utcnow()}}, upsert=True)
    return {"message": "GitHub profile updated"}


@router.get("/recruiter/candidates")
def get_candidates(current_user=Depends(recruiter_required)):
    database = require_db()
    candidates = []
    for user in database["users"].find({"role": "student", "is_active": {"$ne": False}}):
        student_id = str(user["_id"])
        results = list(database["results"].find({"student_id": student_id}))
        score = round(sum(item.get("percentage", 0) for item in results) / len(results), 2) if results else 0
        state = database["candidate_statuses"].find_one({"recruiter_id": current_user["user_id"], "student_id": student_id}) or {}
        candidates.append({"id": student_id, "name": user.get("full_name", "Student"), "email": user.get("email", ""), "title": "Software Engineer", "location": "Not provided", "skills": ["Assessments", "Coding"], "passport_score": score, "status": state.get("status", "New")})
    return candidates


class CandidateStatusRequest(BaseModel):
    status: Literal["New", "Shortlisted", "Interview", "Hired", "Rejected"]


@router.put("/recruiter/candidates/{student_id}/status")
def update_candidate_status(student_id: str, request: CandidateStatusRequest, current_user=Depends(recruiter_required)):
    database = require_db()
    database["candidate_statuses"].update_one({"recruiter_id": current_user["user_id"], "student_id": student_id}, {"$set": {"status": request.status, "updated_at": datetime.utcnow()}}, upsert=True)
    return {"message": "Candidate status updated"}
