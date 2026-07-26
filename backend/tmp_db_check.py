import os
import traceback
import pathlib
from pymongo import MongoClient
from dotenv import load_dotenv

env_path = pathlib.Path('.env').resolve()
load_dotenv(dotenv_path=env_path)
url = os.getenv('MONGODB_URL')
print('URL_PRESENT', bool(url))
print('URL_START', url[:70] if url else None)

client = MongoClient(url, serverSelectionTimeoutMS=20000, tls=True, retryWrites=False)
try:
    result = client.admin.command('ping')
    print('PING_OK', result)
except Exception as e:
    print(type(e).__name__)
    print(e)
    traceback.print_exc()
