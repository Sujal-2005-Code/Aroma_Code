import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.routes import questions as questions_routes


class QuestionsRouteTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        questions_routes.fallback_questions[:] = [
            {
                "_id": "sample-question-1",
                "title": "Sample Question",
                "description": "A fallback question returned when the database is unavailable.",
                "topic": "General",
                "difficulty": "easy",
                "question_type": "theory",
                "tags": ["sample"],
                "options": [],
                "correct_answer": None,
                "explanation": None,
                "sample_input": None,
                "sample_output": None,
            }
        ]

    def test_create_and_get_questions_when_database_is_unavailable(self):
        with patch("app.routes.questions.get_questions_collection", return_value=None):
            create_response = self.client.post(
                "/questions",
                json={
                    "title": "Two Sum",
                    "description": "Return the indices of two numbers that add up to target.",
                    "difficulty": "easy",
                    "category": "arrays",
                    "tags": ["algorithms", "hashmap"],
                    "sample_input": "nums = [2,7,11,15], target = 9",
                    "sample_output": "[0,1]",
                },
            )

            self.assertEqual(create_response.status_code, 200)
            payload = create_response.json()
            self.assertEqual(payload["message"], "Question added")
            self.assertIn("id", payload)

            list_response = self.client.get("/questions")
            self.assertEqual(list_response.status_code, 200)
            questions = list_response.json()
            self.assertGreaterEqual(len(questions), 1)
            self.assertTrue(any(question.get("title") == "Two Sum" for question in questions))

    def test_returns_sample_questions_when_database_is_unavailable_without_prior_posts(self):
        with patch("app.routes.questions.get_questions_collection", return_value=None):
            response = self.client.get("/questions")
            self.assertEqual(response.status_code, 200)
            payload = response.json()
            self.assertGreaterEqual(len(payload), 1)
            self.assertIn("title", payload[0])

    def test_allows_browser_requests_from_frontend_origin(self):
        response = self.client.get(
            "/questions",
            headers={"Origin": "http://localhost:3000"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("*", response.headers.get("access-control-allow-origin", ""))


if __name__ == "__main__":
    unittest.main()
