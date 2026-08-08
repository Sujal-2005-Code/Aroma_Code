import json
from app.database.db import db

if db is not None:
    coll = db['ai_assessments']
    doc = coll.find_one({'_id': '6a7604b302f7921a2d75b870'})
    print(json.dumps(doc, default=str, indent=2) if doc else 'not found')
else:
    print('db unavailable')
