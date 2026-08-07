from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.services.judge0 import execute_code, evaluate_submission
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/judge0",
    tags=["Judge0"]
)


# -----------------------------
# Request / Response Models
# -----------------------------

class ExecuteRequest(BaseModel):
    language: str
    source_code: str
    stdin: Optional[str] = ""


class Judge0Status(BaseModel):
    id: int
    description: str


class ExecuteResponse(BaseModel):
    success: bool
    stdout: str
    stderr: str
    compile_output: str
    status: Judge0Status
    time: Optional[float]
    memory: Optional[int]
    message: Optional[str] = None


class TestCaseInput(BaseModel):
    input: str
    output: str


class EvaluateRequest(BaseModel):
    language: str
    source_code: str
    test_cases: List[TestCaseInput]


class TestCaseDetail(BaseModel):
    test_case: int
    passed: bool
    expected_output: str
    actual_output: str
    execution_time: Optional[float] = None
    memory: Optional[int] = None
    status: Optional[str] = None


class EvaluateResponse(BaseModel):
    passed: int
    failed: int
    total: int
    percentage: float
    average_execution_time: float
    maximum_memory: int
    details: List[TestCaseDetail]


# -----------------------------
# Endpoints
# -----------------------------

@router.get("/test")
def test_judge0():
    code = """
a = int(input())
b = int(input())

print(a+b)
"""

    result = execute_code(
        language="python",
        source_code=code,
        stdin="10\n20"
    )

    return result


@router.post("/execute", response_model=ExecuteResponse)
def execute_code_endpoint(
    request: ExecuteRequest,
    _current_user=Depends(get_current_user),
):
    raw = execute_code(
        language=request.language,
        source_code=request.source_code,
        stdin=request.stdin or "",
    )

    if not raw.get("success"):
        return ExecuteResponse(
            success=False,
            stdout="",
            stderr=raw.get("message", "Execution failed"),
            compile_output="",
            status=Judge0Status(id=-1, description="Internal Error"),
            time=None,
            memory=None,
            message=raw.get("message"),
        )

    data = raw.get("data") or {}
    status = data.get("status") or {}

    return ExecuteResponse(
        success=True,
        stdout=(data.get("stdout") or ""),
        stderr=(data.get("stderr") or ""),
        compile_output=(data.get("compile_output") or ""),
        status=Judge0Status(
            id=int(status.get("id", -1)),
            description=str(status.get("description", "Unknown")),
        ),
        time=float(data["time"]) if data.get("time") not in (None, "") else None,
        memory=int(data["memory"]) if data.get("memory") not in (None, "") else None,
        message=None,
    )


@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate_endpoint(
    request: EvaluateRequest,
    _current_user=Depends(get_current_user),
):
    test_cases = [{"input": tc.input, "output": tc.output} for tc in request.test_cases]

    if not test_cases:
        raise HTTPException(status_code=400, detail="At least one test case is required")

    result = evaluate_submission(
        language=request.language,
        source_code=request.source_code,
        hidden_test_cases=test_cases,
    )

    details: List[TestCaseDetail] = []
    for d in result.get("details", []):
        exec_time = d.get("execution_time")
        mem = d.get("memory")
        details.append(TestCaseDetail(
            test_case=int(d.get("test_case", 0)),
            passed=bool(d.get("passed", False)),
            expected_output=str(d.get("expected_output", "")),
            actual_output=str(d.get("actual_output", "")),
            execution_time=float(exec_time) if exec_time not in (None, "") else None,
            memory=int(mem) if mem not in (None, "") else None,
            status=str(d.get("status")) if d.get("status") is not None else None,
        ))

    return EvaluateResponse(
        passed=int(result.get("passed", 0)),
        failed=int(result.get("failed", 0)),
        total=int(result.get("total", 0)),
        percentage=float(result.get("percentage", 0)),
        average_execution_time=float(result.get("average_execution_time", 0)),
        maximum_memory=int(result.get("maximum_memory", 0)),
        details=details,
    )
