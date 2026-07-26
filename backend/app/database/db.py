from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

print("MONGODB_URL =", MONGODB_URL)
print("DATABASE_NAME =", DATABASE_NAME)


def get_database():
    if not MONGODB_URL or not DATABASE_NAME:
        return None

    try:
        client = MongoClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=10000,
            tls=True,
            retryWrites=False,
        )
        client.admin.command("ping")
        return client[DATABASE_NAME]
    except Exception as exc:
        print(f"[ERROR] MongoDB unavailable: {exc}")
        return None


db = get_database()

if db is not None:
    print("[SUCCESS] MongoDB connected successfully!")
else:
    print("[WARNING] MongoDB unavailable; using in-memory fallback for question routes.")

def get_db():
    return db    