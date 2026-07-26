from pydantic import BaseModel
from typing import List, Optional


class Assessment(BaseModel):
    title: str
    description: Optional[str] = None

    topic: str

    duration: int

    total_marks: int

    passing_marks: int = 40

    question_ids: List[str]