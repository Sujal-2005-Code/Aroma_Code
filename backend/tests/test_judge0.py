import unittest
from unittest.mock import patch

from app.services.judge0 import evaluate_submission


class Judge0EvaluationTests(unittest.TestCase):
    def test_normalizes_trailing_newlines_when_comparing_output(self):
        with patch("app.services.judge0.execute_code") as mock_execute_code:
            mock_execute_code.return_value = {
                "success": True,
                "data": {
                    "stdout": "42\n",
                    "time": 0.12,
                    "memory": 128,
                    "status": {"description": "Accepted"},
                },
            }

            result = evaluate_submission(
                language="python",
                source_code="print(42)",
                hidden_test_cases=[{"input": "", "output": "42"}],
            )

        self.assertEqual(result["passed"], 1)
        self.assertEqual(result["failed"], 0)
        self.assertEqual(result["percentage"], 100.0)
        self.assertEqual(result["details"][0]["passed"], True)

    def test_accepts_list_style_and_newline_outputs_as_equal(self):
        with patch("app.services.judge0.execute_code") as mock_execute_code:
            # Student output is a Python list string
            mock_execute_code.return_value = {
                "success": True,
                "data": {
                    "stdout": "[0,1]\n",
                    "time": 0.05,
                    "memory": 64,
                    "status": {"description": "Accepted"},
                },
            }

            result = evaluate_submission(
                language="python",
                source_code="print([0,1])",
                hidden_test_cases=[{"input": "", "output": "0 1"}],
            )

        self.assertEqual(result["passed"], 1)
        self.assertEqual(result["failed"], 0)
        self.assertEqual(result["percentage"], 100.0)
        self.assertTrue(result["details"][0]["passed"])


if __name__ == "__main__":
    unittest.main()
