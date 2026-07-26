from pydantic import BaseModel


class Result(BaseModel):
    student_id: str
    assessment_id: str

    score: int
    total_marks: int

    percentage: float

    correct_count: int
    wrong_count: int

    result: str