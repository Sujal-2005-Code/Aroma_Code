from app.routes.auth import register, RegisterRequest
req = RegisterRequest(full_name='Test User', email='test@example.com', password='Password123!', role='student')
print(req)
try:
    result = register(req)
    print('RESULT')
    print(result)
except Exception as e:
    import traceback
    traceback.print_exc()
