import os
import requests
from dotenv import load_dotenv

load_dotenv()

JUDGE0_URL = os.getenv("JUDGE0_URL")


def _normalize_output(text: str) -> str:
    if text is None:
        return ""

    normalized = str(text).replace("\r\n", "\n").replace("\r", "\n")
    lines = [line.rstrip() for line in normalized.split("\n")]

    while lines and lines[-1] == "":
        lines.pop()

    while lines and lines[0] == "":
        lines.pop(0)

    return "\n".join(lines)


def _collapse_whitespace(text: str) -> str:
    import re

    if text is None:
        return ""

    s = str(text).replace("\r\n", "\n").replace("\r", "\n")
    parts = [p.strip() for p in s.splitlines() if p.strip() != ""]
    joined = " ".join(parts)
    return re.sub(r"\s+", " ", joined).strip()


def _tokens_from_text(text: str) -> str:
    """Convert bracket/comma-separated outputs into a normalized token string.

    Examples:
    - "[0,1]" -> "0 1"
    - "0\n1" -> "0 1"
    - "0 1" -> "0 1"
    """
    import re

    if text is None:
        return ""

    s = str(text)
    # Replace common list delimiters with spaces
    s = re.sub(r"[\[\]\(\),;{}]", " ", s)
    # Replace newlines and tabs with spaces
    s = s.replace("\r\n", "\n").replace("\r", "\n").replace("\t", " ")
    # Collapse whitespace
    s = re.sub(r"\s+", " ", s)
    return s.strip()

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
            timeout=30,
        )

        if response.status_code >= 400:
            return {
                "success": False,
                "message": f"Judge0 request failed with status {response.status_code}: {response.text}",
            }

        return {
            "success": True,
            "data": response.json(),
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e),
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

        stdout = _normalize_output(data.get("stdout"))
        expected = _normalize_output(testcase.get("output", ""))

        status_info = data.get("status") or {}
        status_description = str(status_info.get("description") or "Unknown")

        if status_info.get("id") not in (None, 3):
            stdout = f"{stdout}\n{status_description}".strip()

        # Strict comparison first
        is_passed = stdout == expected

        # Fallback: compare collapsed whitespace forms (handles newlines vs spaces)
        if not is_passed:
            is_passed = _collapse_whitespace(stdout) == _collapse_whitespace(expected)

        # Fallback: compare tokenized forms (handles lists like "[0,1]", "0\n1", "0 1")
        if not is_passed:
            is_passed = _tokens_from_text(stdout) == _tokens_from_text(expected)

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
            "status": status_description,
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