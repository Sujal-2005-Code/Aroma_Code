import os
import pathlib
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(dotenv_path=pathlib.Path('.env').resolve())
url = os.getenv('MONGODB_URL')
client = MongoClient(url, serverSelectionTimeoutMS=20000, tls=True, retryWrites=False)
print(client.list_database_names())
