from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.questions import router as question_router
from app.routes.topics import router as topic_router
from app.routes.assessments import router as assessment_router
from app.routes.submissions import router as submission_router
from app.routes.results import router as result_router
from app.routes.student import router as student_router
from app.routes.judge0 import router as judge0_router
from app.routes.student_questions import router as student_question_router
from app.routes.student_assessments import router as student_assessment_router
from app.routes.auth import router as auth_router
from app.routes.admin_dashboard import router as admin_dashboard_router
from app.routes.leaderboard import router as leaderboard_router
from app.routes.analytics import router as analytics_router
from app.routes.profile import router as profile_router
from app.routes.export import router as export_router
from app.routes.admin_students import router as admin_students_router
from app.routes.jobs import router as jobs_router
from app.routes.career import router as career_router



app = FastAPI(
    title="Aroma Backend",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(question_router)
app.include_router(topic_router)
app.include_router(assessment_router)
app.include_router(submission_router)
app.include_router(result_router)
app.include_router(student_router)
app.include_router(judge0_router)
app.include_router(student_question_router)
app.include_router(student_assessment_router)
app.include_router(auth_router, tags=["Authentication"])
app.include_router(admin_dashboard_router)
app.include_router(leaderboard_router)
app.include_router(analytics_router)
app.include_router(profile_router)
app.include_router(export_router)
app.include_router(admin_students_router)
app.include_router(jobs_router)
app.include_router(career_router)


@app.get("/")
def root():
    return {
        "message": "Backend Running",
        "status": "online"
    }

@app.get("/health")
def health():
    return {
        "message": "Server Healthy",
        "status": "ok"
    }
