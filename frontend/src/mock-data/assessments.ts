export interface Assessment {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  totalQuestions: number;
  mcqCount: number;
  msqCount: number;
  codingCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  company?: string;
  cutoff: number;
  maxScore: number;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed" | "expired";
  attempted?: boolean;
  score?: number;
  result?: "PASS" | "FAIL";
}

export interface Question {
  id: string;
  type: "mcq" | "msq" | "coding";
  question: string;
  options?: string[];
  correctOptions?: number[];
  code?: string;
  language?: string;
  testCases?: { input: string; expectedOutput: string; hidden: boolean }[];
  marks: number;
}

export const assessments: Assessment[] = [
  {
    id: "a1",
    title: "Frontend Engineering Assessment",
    description: "Comprehensive test covering React, JavaScript, TypeScript, CSS, and system design fundamentals.",
    duration: 90,
    totalQuestions: 35,
    mcqCount: 20,
    msqCount: 10,
    codingCount: 5,
    difficulty: "Medium",
    tags: ["React", "JavaScript", "TypeScript", "CSS"],
    company: "Vercel",
    cutoff: 70,
    maxScore: 100,
    startDate: "2024-12-10",
    endDate: "2024-12-20",
    status: "active",
    attempted: false,
  },
  {
    id: "a2",
    title: "Data Structures & Algorithms",
    description: "Test your DSA skills with problems on arrays, trees, graphs, dynamic programming, and more.",
    duration: 120,
    totalQuestions: 25,
    mcqCount: 10,
    msqCount: 5,
    codingCount: 10,
    difficulty: "Hard",
    tags: ["Arrays", "Trees", "DP", "Graphs"],
    company: "Google",
    cutoff: 75,
    maxScore: 100,
    startDate: "2024-12-05",
    endDate: "2024-12-18",
    status: "active",
    attempted: true,
    score: 82,
    result: "PASS",
  },
  {
    id: "a3",
    title: "Backend Development Test",
    description: "Node.js, REST APIs, databases, authentication, and system architecture questions.",
    duration: 60,
    totalQuestions: 30,
    mcqCount: 25,
    msqCount: 5,
    codingCount: 0,
    difficulty: "Medium",
    tags: ["Node.js", "REST", "PostgreSQL", "Auth"],
    company: "Stripe",
    cutoff: 65,
    maxScore: 100,
    startDate: "2024-11-20",
    endDate: "2024-11-30",
    status: "completed",
    attempted: true,
    score: 58,
    result: "FAIL",
  },
  {
    id: "a4",
    title: "Machine Learning Fundamentals",
    description: "Covers ML algorithms, model evaluation, feature engineering, and Python libraries.",
    duration: 75,
    totalQuestions: 40,
    mcqCount: 30,
    msqCount: 10,
    codingCount: 0,
    difficulty: "Medium",
    tags: ["Python", "ML", "Scikit-learn", "TensorFlow"],
    company: "OpenAI",
    cutoff: 80,
    maxScore: 100,
    startDate: "2024-12-25",
    endDate: "2025-01-05",
    status: "upcoming",
    attempted: false,
  },
  {
    id: "a5",
    title: "Full Stack Campus Drive",
    description: "Combined test for campus placement covering frontend, backend, and problem solving.",
    duration: 180,
    totalQuestions: 50,
    mcqCount: 25,
    msqCount: 10,
    codingCount: 15,
    difficulty: "Hard",
    tags: ["Full Stack", "DSA", "System Design"],
    company: "Amazon",
    cutoff: 70,
    maxScore: 100,
    startDate: "2024-12-15",
    endDate: "2024-12-15",
    status: "active",
    attempted: false,
  },
];

export const sampleQuestions: Question[] = [
  {
    id: "q1",
    type: "mcq",
    question: "Which of the following is NOT a valid React Hook?",
    options: ["useState", "useEffect", "useClass", "useCallback"],
    correctOptions: [2],
    marks: 2,
  },
  {
    id: "q2",
    type: "mcq",
    question: "What does the 'async' keyword do in JavaScript?",
    options: [
      "Makes the function run in parallel threads",
      "Returns a Promise from the function",
      "Blocks the event loop",
      "Converts callbacks to promises automatically",
    ],
    correctOptions: [1],
    marks: 2,
  },
  {
    id: "q3",
    type: "msq",
    question: "Which of the following are valid ways to prevent unnecessary re-renders in React? (Select all that apply)",
    options: ["React.memo", "useMemo", "useCallback", "useReducer", "useRef"],
    correctOptions: [0, 1, 2],
    marks: 4,
  },
  {
    id: "q4",
    type: "msq",
    question: "Which HTTP status codes indicate a client-side error? (Select all that apply)",
    options: ["200 OK", "400 Bad Request", "401 Unauthorized", "404 Not Found", "500 Internal Server Error"],
    correctOptions: [1, 2, 3],
    marks: 4,
  },
  {
    id: "q5",
    type: "coding",
    question: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
    testCases: [
      { input: "[2,7,11,15], target=9", expectedOutput: "[0,1]", hidden: false },
      { input: "[3,2,4], target=6", expectedOutput: "[1,2]", hidden: false },
      { input: "[3,3], target=6", expectedOutput: "[0,1]", hidden: true },
    ],
    marks: 10,
    code: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
  },
  {
    id: "q6",
    type: "mcq",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctOptions: [1],
    marks: 2,
  },
  {
    id: "q7",
    type: "mcq",
    question: "Which CSS property is used to create a flexbox container?",
    options: ["display: block", "display: flex", "position: flex", "flex: 1"],
    correctOptions: [1],
    marks: 2,
  },
  {
    id: "q8",
    type: "msq",
    question: "Which of the following are JavaScript array methods that return a new array? (Select all that apply)",
    options: ["map()", "filter()", "forEach()", "reduce()", "slice()"],
    correctOptions: [0, 1, 4],
    marks: 4,
  },
  {
    id: "q9",
    type: "coding",
    question: "Write a function to check if a string is a palindrome. A palindrome reads the same forward and backward.",
    testCases: [
      { input: '"racecar"', expectedOutput: "true", hidden: false },
      { input: '"hello"', expectedOutput: "false", hidden: false },
      { input: '"A man a plan a canal Panama"', expectedOutput: "true", hidden: true },
    ],
    marks: 8,
    code: `function isPalindrome(s) {
  // Write your solution here
  
}`,
  },
  {
    id: "q10",
    type: "mcq",
    question: "What is the output of: console.log(typeof null)?",
    options: ['"null"', '"undefined"', '"object"', '"number"'],
    correctOptions: [2],
    marks: 2,
  },
];

export const assessmentHistory = [
  { id: "h1", title: "Frontend Engineering Assessment", date: "2024-12-01", score: 82, maxScore: 100, result: "PASS" as const, duration: 78, rank: 12, totalParticipants: 234 },
  { id: "h2", title: "Data Structures & Algorithms", date: "2024-11-20", score: 91, maxScore: 100, result: "PASS" as const, duration: 115, rank: 3, totalParticipants: 189 },
  { id: "h3", title: "Backend Development Test", date: "2024-11-05", score: 58, maxScore: 100, result: "FAIL" as const, duration: 60, rank: 98, totalParticipants: 156 },
  { id: "h4", title: "System Design Basics", date: "2024-10-25", score: 75, maxScore: 100, result: "PASS" as const, duration: 52, rank: 28, totalParticipants: 201 },
  { id: "h5", title: "Python & ML Basics", date: "2024-10-10", score: 88, maxScore: 100, result: "PASS" as const, duration: 68, rank: 7, totalParticipants: 312 },
];
