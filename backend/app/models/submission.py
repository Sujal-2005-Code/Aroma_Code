from pydantic import BaseModel, Field
from typing import Dict, List, Union


class CodingAnswer(BaseModel):
    language: str
    source_code: str


class Submission(BaseModel):
    # The authenticated student is the source of truth; this is optional only
    # to keep the public request shape simple for the web client.
    student_id: str = ""
    assessment_id: str
    session_id: str

    # Supports:
    # MCQ  -> "question_id": "A"
    # MSQ  -> "question_id": ["A", "C"]
    # Coding -> "question_id": {
    #               "language": "python",
    #               "source_code": "print('Hello')"
    #            }

    answers: Dict[
        str,
        Union[
            str,
            List[str],
            CodingAnswer
        ]
    ] = Field(default_factory=dict)
