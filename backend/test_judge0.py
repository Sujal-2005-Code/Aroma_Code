import requests

code = '''
def twoSum(nums, target):
    num_map = {} 
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []

if __name__ == "__main__":
    import sys
    input_data = sys.stdin.read().split()
    
    if len(input_data) > 0:
        n = int(input_data[0])
        nums = list(map(int, input_data[1:1 + n]))
        target = int(input_data[1 + n])
        
        result = twoSum(nums, target)
        print(f"{result[0]} {result[1]}")
'''

response = requests.post('http://localhost:8000/judge0/evaluate', json={
    'language': 'python',
    'source_code': code,
    'test_cases': [
        {'input': '4\n2 7 11 15\n9\n', 'output': '0 1\n'}
    ]
})
print(response.json())
