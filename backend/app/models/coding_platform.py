from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime

class CodingExample(BaseModel):
    input: str
    output: str
    explanation: Optional[str] = None

class CodingTestCase(BaseModel):
    input: str
    expectedOutput: str

class CodingStarterCode(BaseModel):
    javascript: Optional[str] = None
    python: Optional[str] = None
    cpp: Optional[str] = None
    c: Optional[str] = None

class CodingProblem(BaseModel):
    model_config = ConfigDict(extra="allow")

    slug: str
    title: str
    difficulty: str
    tags: List[str] = Field(default_factory=list)
    description: str
    constraints: List[str] = Field(default_factory=list)
    examples: List[CodingExample] = Field(default_factory=list)
    hints: List[str] = Field(default_factory=list)
    starterCode: CodingStarterCode
    sampleTests: List[CodingTestCase] = Field(default_factory=list)
    hiddenTests: List[CodingTestCase] = Field(default_factory=list)
    timeLimitMs: int = 5000
    order: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class CodingSubmission(BaseModel):
    model_config = ConfigDict(extra="allow")

    userId: str
    problemSlug: str
    language: str
    code: str
    verdict: str
    runtimeMs: int = 0
    memoryKb: int = 0
    passedTests: int = 0
    totalTests: int = 0
    detail: str = ""
    submittedAt: datetime = Field(default_factory=datetime.utcnow)

class CodingScore(BaseModel):
    model_config = ConfigDict(extra="allow")

    userId: str
    displayName: str = "Anonymous"
    totalSolved: int = 0
    easy: int = 0
    medium: int = 0
    hard: int = 0
    streak: int = 0
    score: int = 0
    lastSolvedAt: Optional[datetime] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
