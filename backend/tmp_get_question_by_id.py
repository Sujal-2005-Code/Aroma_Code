import urllib.request

question_id = '6a5f7881f82bef303f0b31cf'
req = urllib.request.Request(f'http://127.0.0.1:8000/questions/{question_id}', method='GET')

with urllib.request.urlopen(req) as response:
    print('STATUS', response.status)
    print('BODY', response.read().decode())
