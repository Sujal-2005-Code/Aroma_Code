from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class AIAssessmentGenerateRequest(BaseModel):
    skill: str
    topic: str
    level: str
    assessment_type: str = "Technical"
    num_questions: int = 5

class AIQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correctAnswer: str
    topic: str
    difficulty: str
    explanation: str

class AIAssessmentResponse(BaseModel):
    questions: List[AIQuestion]

class AIAssessmentSubmissionItem(BaseModel):
    questionId: int
    selectedAnswer: Optional[str]

class AIAssessmentSubmitRequest(BaseModel):
    answers: List[AIAssessmentSubmissionItem]
