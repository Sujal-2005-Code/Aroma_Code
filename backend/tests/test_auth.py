import unittest

from app.utils.security import hash_password


class AuthSecurityTests(unittest.TestCase):
    def test_hash_password_generates_a_hash(self):
        hashed = hash_password("Password123!")
        self.assertIsInstance(hashed, str)
        self.assertTrue(hashed.startswith("$2"))


if __name__ == "__main__":
    unittest.main()
