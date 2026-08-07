from app.database.db import get_db
from app.database.problems_data import PROBLEMS
from datetime import datetime

def seed():
    db = get_db()
    if db is None:
        print("[ERROR] Could not connect to database.")
        return

    collection = db["coding_problems"]

    for problem in PROBLEMS:
        # Check if exists
        existing = collection.find_one({"slug": problem["slug"]})
        if not existing:
            problem["createdAt"] = datetime.utcnow()
            collection.insert_one(problem)
            print(f"[INFO] Inserted problem: {problem['slug']}")
        else:
            # Optionally update existing
            collection.update_one({"slug": problem["slug"]}, {"$set": problem})
            print(f"[INFO] Updated existing problem: {problem['slug']}")

    print("[SUCCESS] Seeded coding_problems.")

if __name__ == "__main__":
    seed()
