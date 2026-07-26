from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AssessmentSession(BaseModel):

    student_id: str

    assessment_id: str

    status: str = "in_progress"

    started_at: datetime

    expires_at: datetime

    submitted_at: Optional[datetime] = None