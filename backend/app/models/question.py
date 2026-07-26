from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional


class TestCase(BaseModel):
    input: str
    output: str


class Question(BaseModel):
    model_config = ConfigDict(extra="allow")

    # ==========================
    # Basic Information
    # ==========================

    title: str
    description: str

    topic: Optional[str] = None
    difficulty: Optional[str] = None

    # mcq | msq | coding
    question_type: Optional[str] = None

    marks: int = 1

    tags: List[str] = Field(default_factory=list)

    # ==========================
    # MCQ / MSQ
    # ==========================

    options: List[str] = Field(default_factory=list)

    # MCQ
    correct_answer: Optional[str] = None

    # MSQ
    correct_answers: List[str] = Field(default_factory=list)

    explanation: Optional[str] = None

    # ==========================
    # Coding Question
    # ==========================

    constraints: Optional[str] = None

    starter_code: Optional[str] = None

    supported_languages: List[str] = Field(
        default_factory=lambda: [
            "python",
            "cpp",
            "java",
            "c"
        ]
    )

    time_limit: float = 1.0

    memory_limit: int = 256

    sample_test_cases: List[TestCase] = Field(default_factory=list)

    hidden_test_cases: List[TestCase] = Field(default_factory=list)

    # Optional (Backward Compatibility)

    sample_input: Optional[str] = None
    sample_output: Optional[str] = None