PROBLEMS = [
  {
    "slug": "add-two-numbers",
    "title": "Add Two Numbers",
    "difficulty": "Easy",
    "tags": ["Math", "Basics", "I/O"],
    "order": 1,
    "timeLimitMs": 3000,
    "description": "Given two integers **a** and **b** provided on a single line separated by a space, print their sum.\n\nThis is the classic warm-up problem to get comfortable reading input from **stdin** and writing to **stdout**.",
    "constraints": ["-10^9 ≤ a, b ≤ 10^9", "The two integers are on one line, space-separated."],
    "examples": [
      { "input": "3 5", "output": "8", "explanation": "3 + 5 = 8" },
      { "input": "10 -2", "output": "8" },
    ],
    "hints": ["Read the whole line, split by whitespace, convert to numbers.", "Print only the sum, nothing else."],
    "starterCode": {
      "javascript": "const [a, b] = require('fs')\n  .readFileSync(0, 'utf8')\n  .trim()\n  .split(/\\s+/)\n  .map(Number);\n\n// TODO: print the sum of a and b\n",
      "python": "a, b = map(int, input().split())\n\n# TODO: print the sum of a and b\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    // TODO: print a + b\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    long long a, b;\n    scanf(\"%lld %lld\", &a, &b);\n    // TODO: print a + b\n    return 0;\n}\n"
    },
    "sampleTests": [
      { "input": "3 5", "expectedOutput": "8" },
      { "input": "10 -2", "expectedOutput": "8" },
    ],
    "hiddenTests": [
      { "input": "100 200", "expectedOutput": "300" },
      { "input": "0 0", "expectedOutput": "0" },
      { "input": "-5 -7", "expectedOutput": "-12" },
      { "input": "1000000000 1000000000", "expectedOutput": "2000000000" },
    ],
  },
  {
    "slug": "reverse-string",
    "title": "Reverse a String",
    "difficulty": "Easy",
    "tags": ["String", "Two Pointers"],
    "order": 2,
    "timeLimitMs": 3000,
    "description": "Read a single line containing a string **s** and print the string reversed.\n\nThe string contains only printable characters and no leading/trailing spaces.",
    "constraints": ["1 ≤ |s| ≤ 10^5", "s contains no leading or trailing whitespace."],
    "examples": [
      { "input": "hello", "output": "olleh" },
      { "input": "AROMA", "output": "AMORA" },
    ],
    "hints": ["Most languages have a built-in way to reverse a sequence.", "Watch out for the trailing newline when reading."],
    "starterCode": {
      "javascript": "const s = require('fs').readFileSync(0, 'utf8').replace(/\\n$/, '');\n\n// TODO: print s reversed\n",
      "python": "import sys\ns = sys.stdin.readline().rstrip('\\n')\n\n# TODO: print s reversed\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // TODO: print s reversed\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[100005];\n    if (!fgets(s, sizeof(s), stdin)) return 0;\n    s[strcspn(s, \"\\n\")] = 0;\n    // TODO: print s reversed\n    return 0;\n}\n"
    },
    "sampleTests": [
      { "input": "hello", "expectedOutput": "olleh" },
      { "input": "AROMA", "expectedOutput": "AMORA" },
    ],
    "hiddenTests": [
      { "input": "abcdef", "expectedOutput": "fedcba" },
      { "input": "a", "expectedOutput": "a" },
      { "input": "racecar", "expectedOutput": "racecar" },
      { "input": "Coding Platform", "expectedOutput": "mroftalP gnidoC" },
    ],
  },
  {
    "slug": "fizzbuzz",
    "title": "FizzBuzz",
    "difficulty": "Easy",
    "tags": ["Math", "Simulation"],
    "order": 3,
    "timeLimitMs": 3000,
    "description": "Read an integer **n** and print the numbers from **1 to n**, one per line, with the following rules:\n\n- Print **Fizz** if the number is divisible by 3.\n- Print **Buzz** if the number is divisible by 5.\n- Print **FizzBuzz** if the number is divisible by both 3 and 5.\n- Otherwise print the number itself.",
    "constraints": ["1 ≤ n ≤ 10^4"],
    "examples": [
      { "input": "5", "output": "1\n2\nFizz\n4\nBuzz" },
      { "input": "3", "output": "1\n2\nFizz" },
    ],
    "hints": ["Check divisibility by 15 first (or by both 3 and 5).", "Each value goes on its own line."],
    "starterCode": {
      "javascript": "const n = Number(require('fs').readFileSync(0, 'utf8').trim());\nconst out = [];\nfor (let i = 1; i <= n; i++) {\n  // TODO: push the correct value into out\n}\nconsole.log(out.join('\\n'));\n",
      "python": "n = int(input())\nfor i in range(1, n + 1):\n    # TODO: print the correct value\n    pass\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    for (int i = 1; i <= n; i++) {\n        // TODO: print the correct value\n    }\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    for (int i = 1; i <= n; i++) {\n        // TODO: print the correct value\n    }\n    return 0;\n}\n"
    },
    "sampleTests": [
      { "input": "5", "expectedOutput": "1\n2\nFizz\n4\nBuzz" },
      { "input": "3", "expectedOutput": "1\n2\nFizz" },
    ],
    "hiddenTests": [
      { "input": "15", "expectedOutput": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { "input": "1", "expectedOutput": "1" },
      { "input": "16", "expectedOutput": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16" },
    ],
  },
  {
    "slug": "two-sum",
    "title": "Two Sum",
    "difficulty": "Medium",
    "tags": ["Array", "Hash Table"],
    "order": 4,
    "timeLimitMs": 4000,
    "description": "Given an array of integers **nums** and an integer **target**, return the indices of the two numbers that add up to **target**.\n\n**Input format**\n- Line 1: an integer **n**, the length of the array.\n- Line 2: **n** space-separated integers.\n- Line 3: the integer **target**.\n\n**Output**: the two 0-based indices, smaller index first, separated by a space. Exactly one valid answer exists.",
    "constraints": ["2 ≤ n ≤ 10^4", "-10^9 ≤ nums[i], target ≤ 10^9", "Exactly one solution exists."],
    "examples": [
      { "input": "4\n2 7 11 15\n9", "output": "0 1", "explanation": "nums[0] + nums[1] = 2 + 7 = 9" },
      { "input": "3\n3 2 4\n6", "output": "1 2" },
    ],
    "hints": ["A hash map from value → index lets you solve this in O(n).", "For each number x, check if target − x was seen before."],
    "starterCode": {
      "javascript": "const lines = require('fs').readFileSync(0, 'utf8').split('\\n');\nconst n = Number(lines[0]);\nconst nums = lines[1].trim().split(/\\s+/).map(Number);\nconst target = Number(lines[2]);\n\n// TODO: print the two indices separated by a space\n",
      "python": "import sys\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\ntarget = int(data[1 + n])\n\n# TODO: print the two indices separated by a space\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> nums(n);\n    for (auto &x : nums) cin >> x;\n    long long target; cin >> target;\n    // TODO: print the two indices separated by a space\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    long long nums[10005];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &nums[i]);\n    long long target; scanf(\"%lld\", &target);\n    // TODO: print the two indices separated by a space\n    return 0;\n}\n"
    },
    "sampleTests": [
      { "input": "4\n2 7 11 15\n9", "expectedOutput": "0 1" },
      { "input": "3\n3 2 4\n6", "expectedOutput": "1 2" },
    ],
    "hiddenTests": [
      { "input": "2\n3 3\n6", "expectedOutput": "0 1" },
      { "input": "5\n1 2 3 4 5\n9", "expectedOutput": "3 4" },
      { "input": "4\n-1 -2 -3 -4\n-7", "expectedOutput": "2 3" },
      { "input": "6\n0 4 3 0 5 2\n0", "expectedOutput": "0 3" },
    ],
  },
  {
    "slug": "maximum-subarray",
    "title": "Maximum Subarray",
    "difficulty": "Medium",
    "tags": ["Array", "Dynamic Programming", "Kadane"],
    "order": 5,
    "timeLimitMs": 4000,
    "description": "Given an integer array **nums**, find the contiguous subarray (containing at least one number) which has the largest sum, and print that sum.\n\n**Input format**\n- Line 1: an integer **n**.\n- Line 2: **n** space-separated integers.",
    "constraints": ["1 ≤ n ≤ 10^5", "-10^4 ≤ nums[i] ≤ 10^4"],
    "examples": [
      { "input": "9\n-2 1 -3 4 -1 2 1 -5 4", "output": "6", "explanation": "The subarray [4,-1,2,1] has sum 6." },
      { "input": "1\n1", "output": "1" },
    ],
    "hints": ["Kadane's algorithm runs in O(n).", "Keep a running sum; reset it to the current element when it drops below it."],
    "starterCode": {
      "javascript": "const lines = require('fs').readFileSync(0, 'utf8').split('\\n');\nconst n = Number(lines[0]);\nconst nums = lines[1].trim().split(/\\s+/).map(Number);\n\n// TODO: print the maximum subarray sum\n",
      "python": "import sys\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\n\n# TODO: print the maximum subarray sum\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> nums(n);\n    for (auto &x : nums) cin >> x;\n    // TODO: print the maximum subarray sum\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    // TODO: read the array and print the maximum subarray sum\n    return 0;\n}\n"
    },
    "sampleTests": [
      { "input": "9\n-2 1 -3 4 -1 2 1 -5 4", "expectedOutput": "6" },
      { "input": "1\n1", "expectedOutput": "1" },
    ],
    "hiddenTests": [
      { "input": "5\n5 4 -1 7 8", "expectedOutput": "23" },
      { "input": "1\n-1", "expectedOutput": "-1" },
      { "input": "4\n-2 -1 -3 -4", "expectedOutput": "-1" },
      { "input": "6\n-1 -2 -3 -4 -5 -6", "expectedOutput": "-1" },
    ],
  },
  {
    "slug": "binary-search",
    "title": "Binary Search",
    "difficulty": "Easy",
    "tags": ["Array", "Binary Search"],
    "order": 6,
    "timeLimitMs": 3000,
    "description": "Given a **sorted** array of integers and a **target** value, return the index of the target if it is present, otherwise return **-1**.\n\n**Input format**\n- Line 1: an integer **n**.\n- Line 2: **n** space-separated integers in ascending order.\n- Line 3: the integer **target**.",
    "constraints": ["1 ≤ n ≤ 10^5", "The array is sorted in ascending order.", "All values are unique."],
    "examples": [
      { "input": "6\n-1 0 3 5 9 12\n9", "output": "4" },
      { "input": "6\n-1 0 3 5 9 12\n2", "output": "-1" },
    ],
    "hints": ["Maintain low/high pointers and inspect the middle element.", "Return the index, not the value."],
    "starterCode": {
      "javascript": "const lines = require('fs').readFileSync(0, 'utf8').split('\\n');\nconst n = Number(lines[0]);\nconst nums = lines[1].trim().split(/\\s+/).map(Number);\nconst target = Number(lines[2]);\n\n// TODO: print the index of target, or -1\n",
      "python": "import sys\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:1 + n]))\ntarget = int(data[1 + n])\n\n# TODO: print the index of target, or -1\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<long long> nums(n);\n    for (auto &x : nums) cin >> x;\n    long long target; cin >> target;\n    // TODO: print the index of target, or -1\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    long long nums[100005];\n    for (int i = 0; i < n; i++) scanf(\"%lld\", &nums[i]);\n    long long target; scanf(\"%lld\", &target);\n    // TODO: print the index of target, or -1\n    return 0;\n}\n"
    },
    "sampleTests": [
      { "input": "6\n-1 0 3 5 9 12\n9", "expectedOutput": "4" },
      { "input": "6\n-1 0 3 5 9 12\n2", "expectedOutput": "-1" },
    ],
    "hiddenTests": [
      { "input": "1\n5\n5", "expectedOutput": "0" },
      { "input": "1\n5\n-3", "expectedOutput": "-1" },
      { "input": "5\n1 2 3 4 5\n1", "expectedOutput": "0" },
      { "input": "5\n1 2 3 4 5\n5", "expectedOutput": "4" },
    ],
  },
  {
    "slug": "count-primes",
    "title": "Count Primes",
    "difficulty": "Medium",
    "tags": ["Math", "Sieve"],
    "order": 7,
    "timeLimitMs": 4000,
    "description": "Given an integer **n**, count and print the number of prime numbers strictly less than **n**.",
    "constraints": ["0 ≤ n ≤ 5 × 10^6"],
    "examples": [
      { "input": "10", "output": "4", "explanation": "2, 3, 5, 7 are the primes below 10." },
      { "input": "0", "output": "0" },
    ],
    "hints": ["Use the Sieve of Eratosthenes for efficiency.", "Numbers below 2 have no primes."],
    "starterCode": {
      "javascript": "const n = Number(require('fs').readFileSync(0, 'utf8').trim());\n\n// TODO: print the count of primes strictly less than n\n",
      "python": "n = int(input())\n\n# TODO: print the count of primes strictly less than n\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    // TODO: print the count of primes strictly less than n\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    // TODO: print the count of primes strictly less than n\n    return 0;\n}\n"
    },
    "sampleTests": [
      { "input": "10", "expectedOutput": "4" },
      { "input": "0", "expectedOutput": "0" },
    ],
    "hiddenTests": [
      { "input": "2", "expectedOutput": "0" },
      { "input": "20", "expectedOutput": "8" },
      { "input": "100", "expectedOutput": "25" },
      { "input": "1000", "expectedOutput": "168" },
    ],
  },
  {
    "slug": "valid-parentheses",
    "title": "Valid Parentheses",
    "difficulty": "Medium",
    "tags": ["String", "Stack"],
    "order": 8,
    "timeLimitMs": 3000,
    "description": "Given a string containing just the characters `()[]{}`, determine if the input string is valid.\n\nA string is valid if open brackets are closed by the same type of brackets, and in the correct order.\n\nPrint **true** if the string is valid, otherwise print **false**.",
    "constraints": ["1 ≤ |s| ≤ 10^4", "s consists only of the characters ()[]{}"],
    "examples": [
      { "input": "()", "output": "true" },
      { "input": "([)]", "output": "false" },
    ],
    "hints": ["Use a stack of open brackets.", "When you see a closing bracket, the top of the stack must be the matching open bracket."],
    "starterCode": {
      "javascript": "const s = require('fs').readFileSync(0, 'utf8').replace(/\\n$/, '');\n\n// TODO: print \"true\" or \"false\"\n",
      "python": "import sys\ns = sys.stdin.readline().rstrip('\\n')\n\n# TODO: print \"true\" or \"false\"\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // TODO: print \"true\" or \"false\"\n    return 0;\n}\n",
      "c": "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[10005];\n    if (!fgets(s, sizeof(s), stdin)) return 0;\n    s[strcspn(s, \"\\n\")] = 0;\n    // TODO: print \"true\" or \"false\"\n    return 0;\n}\n"
    },
    "sampleTests": [
      { "input": "()", "expectedOutput": "true" },
      { "input": "([)]", "expectedOutput": "false" },
    ],
    "hiddenTests": [
      { "input": "()[]{}", "expectedOutput": "true" },
      { "input": "(]", "expectedOutput": "false" },
      { "input": "{[]}", "expectedOutput": "true" },
      { "input": "(((", "expectedOutput": "false" },
    ],
  }
]
