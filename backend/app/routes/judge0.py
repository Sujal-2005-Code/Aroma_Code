from fastapi import APIRouter

from app.services.judge0 import execute_code

router = APIRouter(
    prefix="/judge0",
    tags=["Judge0"]
)


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