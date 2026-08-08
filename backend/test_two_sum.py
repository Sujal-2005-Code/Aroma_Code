def twoSum(nums, target):
    num_map = {} # Issue 1 fixed: Initialize the dictionary
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []

if __name__ == "__main__":
    import sys
    # Issue 2 fixed: Read from standard input dynamically
    input_data = sys.stdin.read().split()
    
    if len(input_data) > 0:
        n = int(input_data[0])
        nums = list(map(int, input_data[1:1 + n]))
        target = int(input_data[1 + n])
        
        result = twoSum(nums, target)
        # The platform expects space-separated values, not a python list string like "[0, 1]"
        print(f"{result[0]} {result[1]}")
