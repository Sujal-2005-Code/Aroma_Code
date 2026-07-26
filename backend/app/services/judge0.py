import os
import requests
from dotenv import load_dotenv

load_dotenv()

JUDGE0_URL = os.getenv("JUDGE0_URL")

# Judge0 Language IDs
LANGUAGE_IDS = {
    "python": 71,
    "cpp": 54,
    "java": 62,
    "c": 50
}


def execute_code(language: str, source_code: str, stdin: str = ""):

    language_id = LANGUAGE_IDS.get(language.lower())

    if language_id is None:
        return {
            "success": False,
            "message": f"Language '{language}' not supported."
        }

    payload = {
        "language_id": language_id,
        "source_code": source_code,
        "stdin": stdin
    }

    try:

        response = requests.post(
            f"{JUDGE0_URL}/submissions?base64_encoded=false&wait=true",
            json=payload,
            timeout=30
        )

        return {
            "success": True,
            "data": response.json()
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


def evaluate_submission(
    language: str,
    source_code: str,
    hidden_test_cases: list
):
    """
    Executes student's code on every hidden test case.
    """

    passed = 0
    failed = 0

    execution_details = []

    total_time = 0.0
    max_memory = 0

    for index, testcase in enumerate(hidden_test_cases, start=1):

        result = execute_code(
            language=language,
            source_code=source_code,
            stdin=testcase["input"]
        )

        if not result["success"]:

            execution_details.append({
                "test_case": index,
                "status": "Execution Failed",
                "passed": False,
                "expected_output": testcase["output"],
                "actual_output": result.get("message", "")
            })

            failed += 1
            continue

        data = result["data"]

        stdout = (data.get("stdout") or "").strip()
        expected = testcase["output"].strip()

        is_passed = stdout == expected

        if is_passed:
            passed += 1
        else:
            failed += 1

        try:
            total_time += float(data.get("time") or 0)
        except:
            pass

        memory = data.get("memory") or 0

        if memory > max_memory:
            max_memory = memory

        execution_details.append({
            "test_case": index,
            "passed": is_passed,
            "expected_output": expected,
            "actual_output": stdout,
            "execution_time": data.get("time"),
            "memory": memory,
            "status": data.get("status", {}).get("description")
        })

    total = len(hidden_test_cases)

    percentage = 0

    if total > 0:
        percentage = round((passed / total) * 100, 2)

    average_time = 0

    if total > 0:
        average_time = round(total_time / total, 4)

    return {

        "passed": passed,

        "failed": failed,

        "total": total,

        "percentage": percentage,

        "average_execution_time": average_time,

        "maximum_memory": max_memory,

        "details": execution_details
    }