import json
import urllib.request
import urllib.error

payload = {
    "title": "Test question",
    "description": "Verification",
    "difficulty": "easy",
    "category": "general",
    "tags": ["test"],
    "sample_input": "1",
    "sample_output": "1"
}

req = urllib.request.Request(
    'http://127.0.0.1:8000/questions',
    data=json.dumps(payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print('POST_STATUS', response.status)
        print('POST_BODY', response.read().decode())
except urllib.error.HTTPError as e:
    print('POST_STATUS', e.code)
    print('POST_BODY', e.read().decode())

with urllib.request.urlopen('http://127.0.0.1:8000/questions') as response:
    print('GET_STATUS', response.status)
    print('GET_BODY', response.read().decode())
