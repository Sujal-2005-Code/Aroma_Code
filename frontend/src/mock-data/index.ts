import type { User, Job, Notification, CodingProblem, Project, Certificate, Candidate, ChatMessage } from "@/types";

export const currentUser: User = {
  id: "u1",
  name: "Arjun Mehta",
  email: "arjun@aroma.ai",
  avatar: "",
  role: "student",
  title: "Full Stack Developer",
  location: "Bangalore, India",
  bio: "Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. Building the future of web applications.",
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "PostgreSQL", "Tailwind CSS", "Next.js"],
  passportScore: 87,
  atsScore: 82,
  resumeScore: 78,
  codingScore: 91,
  githubScore: 85,
  portfolioScore: 73,
  aiReadiness: 88,
  industryReadiness: 79,
  communicationScore: 84,
};

export const dashboardStats = {
  passportScore: 87,
  atsScore: 82,
  resumeScore: 78,
  codingScore: 91,
  githubScore: 85,
  portfolioScore: 73,
  aiReadiness: 88,
  industryReadiness: 79,
  communicationScore: 84,
  projectsCompleted: 14,
  certificatesEarned: 8,
  learningStreak: 23,
  weeklyHours: 32,
  problemsSolved: 247,
  interviewsScheduled: 3,
};

export const weeklyActivity = [
  { day: "Mon", hours: 4.5, problems: 3, commits: 8 },
  { day: "Tue", hours: 5.2, problems: 5, commits: 12 },
  { day: "Wed", hours: 3.8, problems: 2, commits: 6 },
  { day: "Thu", hours: 6.1, problems: 7, commits: 15 },
  { day: "Fri", hours: 4.0, problems: 4, commits: 9 },
  { day: "Sat", hours: 7.3, problems: 8, commits: 18 },
  { day: "Sun", hours: 2.5, problems: 1, commits: 4 },
];

export const monthlyProgress = [
  { month: "Jan", score: 52, problems: 28, projects: 1 },
  { month: "Feb", score: 58, problems: 35, projects: 2 },
  { month: "Mar", score: 63, problems: 42, projects: 2 },
  { month: "Apr", score: 69, problems: 51, projects: 3 },
  { month: "May", score: 74, problems: 62, projects: 4 },
  { month: "Jun", score: 79, problems: 78, projects: 5 },
  { month: "Jul", score: 82, problems: 89, projects: 6 },
  { month: "Aug", score: 87, problems: 98, projects: 7 },
];

export const skillRadarData = [
  { skill: "Frontend", value: 92, fullMark: 100 },
  { skill: "Backend", value: 85, fullMark: 100 },
  { skill: "DevOps", value: 70, fullMark: 100 },
  { skill: "DSA", value: 88, fullMark: 100 },
  { skill: "System Design", value: 75, fullMark: 100 },
  { skill: "Communication", value: 82, fullMark: 100 },
];

export const jobs: Job[] = [
  {
    id: "j1", title: "Senior Frontend Engineer", company: "Vercel", companyLogo: "",
    location: "Remote", type: "Full-time", salary: "$150k - $200k", posted: "2 days ago",
    description: "Join our team to build the future of web development tools.", applicants: 234, status: "Active",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Performance optimization"],
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    id: "j2", title: "Full Stack Developer", company: "Stripe", companyLogo: "",
    location: "San Francisco, CA", type: "Full-time", salary: "$140k - $190k", posted: "1 week ago",
    description: "Build payment infrastructure that powers the internet economy.", applicants: 189, status: "Active",
    requirements: ["3+ years full-stack experience", "API design", "Database optimization"],
    skills: ["Node.js", "React", "PostgreSQL", "Ruby"],
  },
  {
    id: "j3", title: "Software Engineering Intern", company: "Google", companyLogo: "",
    location: "Mountain View, CA", type: "Internship", salary: "$8k/month", posted: "3 days ago",
    description: "Work on Google's core products and infrastructure.", applicants: 1250, status: "Active",
    requirements: ["Currently enrolled in CS program", "Strong DSA fundamentals"],
    skills: ["Python", "Java", "C++", "Algorithms"],
  },
  {
    id: "j4", title: "Backend Engineer", company: "Linear", companyLogo: "",
    location: "Remote", type: "Full-time", salary: "$130k - $180k", posted: "5 days ago",
    description: "Help build the fastest project management tool.", applicants: 156, status: "Active",
    requirements: ["Node.js/TypeScript expertise", "GraphQL experience", "System design skills"],
    skills: ["TypeScript", "Node.js", "GraphQL", "PostgreSQL"],
  },
  {
    id: "j5", title: "ML Engineer", company: "OpenAI", companyLogo: "",
    location: "San Francisco, CA", type: "Full-time", salary: "$200k - $350k", posted: "1 day ago",
    description: "Push the boundaries of artificial intelligence research.", applicants: 890, status: "Active",
    requirements: ["PhD in ML/AI", "Published research", "PyTorch expertise"],
    skills: ["Python", "PyTorch", "TensorFlow", "CUDA"],
  },
  {
    id: "j6", title: "DevOps Engineer", company: "Datadog", companyLogo: "",
    location: "New York, NY", type: "Full-time", salary: "$120k - $170k", posted: "4 days ago",
    description: "Scale monitoring infrastructure for millions of users.", applicants: 98, status: "Active",
    requirements: ["Kubernetes experience", "CI/CD pipelines", "Cloud platforms"],
    skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
  },
];

export const notifications: Notification[] = [
  { id: "n1", type: "success", title: "Resume Improved", message: "Your ATS score increased from 72 to 82!", time: "2 min ago", read: false, icon: "FileText" },
  { id: "n2", type: "info", title: "Badge Earned", message: "You earned the '100 Problems Solved' badge!", time: "1 hour ago", read: false, icon: "Award" },
  { id: "n3", type: "warning", title: "Interview Reminder", message: "Technical interview with Vercel tomorrow at 2 PM", time: "3 hours ago", read: false, icon: "Calendar" },
  { id: "n4", type: "alert", title: "Placement Drive", message: "Google is visiting your campus on Dec 15th", time: "5 hours ago", read: true, icon: "Building" },
  { id: "n5", type: "info", title: "Internship Alert", message: "3 new internships matching your profile", time: "1 day ago", read: true, icon: "Briefcase" },
  { id: "n6", type: "success", title: "Certificate Generated", message: "React Advanced certification is ready", time: "2 days ago", read: true, icon: "Award" },
];

export const codingProblems: CodingProblem[] = [
  { id: "p1", title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Table"], acceptance: 49.2, submissions: 12500, solved: true },
  { id: "p2", title: "Add Two Numbers", difficulty: "Medium", tags: ["Linked List", "Math"], acceptance: 39.8, submissions: 8900, solved: true },
  { id: "p3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", tags: ["String", "Sliding Window"], acceptance: 33.8, submissions: 7200, solved: false },
  { id: "p4", title: "Median of Two Sorted Arrays", difficulty: "Hard", tags: ["Array", "Binary Search"], acceptance: 35.6, submissions: 5600, solved: false },
  { id: "p5", title: "Valid Parentheses", difficulty: "Easy", tags: ["Stack", "String"], acceptance: 40.7, submissions: 11200, solved: true },
  { id: "p6", title: "Merge Two Sorted Lists", difficulty: "Easy", tags: ["Linked List"], acceptance: 61.5, submissions: 9800, solved: true },
  { id: "p7", title: "Maximum Subarray", difficulty: "Medium", tags: ["Array", "DP"], acceptance: 50.1, submissions: 10500, solved: true },
  { id: "p8", title: "Binary Tree Level Order Traversal", difficulty: "Medium", tags: ["Tree", "BFS"], acceptance: 62.8, submissions: 6700, solved: false },
  { id: "p9", title: "Word Break", difficulty: "Medium", tags: ["DP", "String"], acceptance: 45.2, submissions: 5400, solved: false },
  { id: "p10", title: "Trapping Rain Water", difficulty: "Hard", tags: ["Array", "Two Pointers", "Stack"], acceptance: 58.7, submissions: 4200, solved: true },
];

export const projects: Project[] = [
  { id: "pr1", name: "E-Commerce Platform", description: "Full-stack e-commerce with payment integration, real-time inventory, and admin dashboard", technologies: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"], githubUrl: "github.com/arjun/ecommerce", score: 92, verified: true, stars: 234, forks: 56 },
  { id: "pr2", name: "Real-time Chat App", description: "WebSocket-based chat application with file sharing and video calls", technologies: ["React", "Socket.io", "Node.js", "Redis"], githubUrl: "github.com/arjun/chatapp", score: 88, verified: true, stars: 189, forks: 42 },
  { id: "pr3", name: "ML Image Classifier", description: "Deep learning model for image classification with 97% accuracy", technologies: ["Python", "TensorFlow", "FastAPI", "Docker"], githubUrl: "github.com/arjun/ml-classifier", score: 85, verified: false, stars: 156, forks: 38 },
  { id: "pr4", name: "Task Management CLI", description: "Command-line task manager with cloud sync and team collaboration", technologies: ["Go", "SQLite", "Cobra"], githubUrl: "github.com/arjun/taskctl", score: 79, verified: true, stars: 98, forks: 22 },
];

export const certificates: Certificate[] = [
  { id: "c1", title: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2024-06-15", verified: true, credentialId: "AWS-SA-2024-0156" },
  { id: "c2", title: "React Advanced Patterns", issuer: "Meta", date: "2024-04-20", verified: true, credentialId: "META-REACT-2024-089" },
  { id: "c3", title: "System Design Fundamentals", issuer: "Educative.io", date: "2024-03-10", verified: true, credentialId: "EDU-SD-2024-234" },
  { id: "c4", title: "Docker & Kubernetes Mastery", issuer: "Linux Foundation", date: "2024-01-25", verified: true, credentialId: "LF-DK-2024-567" },
  { id: "c5", title: "TypeScript Professional", issuer: "Microsoft", date: "2023-11-08", verified: true, credentialId: "MS-TS-2023-890" },
];

export const candidates: Candidate[] = [
  { id: "ca1", name: "Arjun Mehta", email: "arjun@email.com", avatar: "", title: "Full Stack Developer", location: "Bangalore", skills: ["React", "Node.js", "TypeScript"], experience: "2 years", passportScore: 87, atsScore: 82, status: "Shortlisted", appliedDate: "2024-08-01" },
  { id: "ca2", name: "Priya Sharma", email: "priya@email.com", avatar: "", title: "Frontend Engineer", location: "Mumbai", skills: ["React", "Vue", "CSS"], experience: "3 years", passportScore: 91, atsScore: 88, status: "Interview", appliedDate: "2024-07-28" },
  { id: "ca3", name: "Rahul Kumar", email: "rahul@email.com", avatar: "", title: "Backend Developer", location: "Delhi", skills: ["Python", "Django", "AWS"], experience: "1 year", passportScore: 75, atsScore: 71, status: "New", appliedDate: "2024-08-05" },
  { id: "ca4", name: "Sara Patel", email: "sara@email.com", avatar: "", title: "ML Engineer", location: "Hyderabad", skills: ["Python", "TensorFlow", "PyTorch"], experience: "4 years", passportScore: 93, atsScore: 90, status: "Hired", appliedDate: "2024-07-15" },
  { id: "ca5", name: "Dev Joshi", email: "dev@email.com", avatar: "", title: "DevOps Engineer", location: "Pune", skills: ["Docker", "K8s", "Terraform"], experience: "2 years", passportScore: 82, atsScore: 78, status: "Rejected", appliedDate: "2024-07-20" },
];

export const chatMessages: ChatMessage[] = [
  { id: "m1", role: "assistant", content: "Hello Arjun! 👋 I'm your AI Career Mentor. I can help you with career advice, resume reviews, interview preparation, learning roadmaps, and much more. What would you like to discuss today?", timestamp: "10:00 AM" },
  { id: "m2", role: "user", content: "I want to prepare for a frontend engineer interview at Vercel. What should I focus on?", timestamp: "10:01 AM" },
  { id: "m3", role: "assistant", content: "Great choice! Vercel is known for their cutting-edge web infrastructure. Here's a focused preparation plan:\n\n**1. Core Skills**\n- Deep React knowledge (hooks, context, suspense, server components)\n- Next.js App Router, SSR, ISR, middleware\n- TypeScript advanced patterns\n- CSS-in-JS and Tailwind CSS\n\n**2. Performance**\n- Core Web Vitals optimization\n- Code splitting & lazy loading\n- Image optimization strategies\n- Bundle analysis\n\n**3. System Design**\n- CDN architecture\n- Edge computing concepts\n- Deployment pipelines\n- Monorepo management (Turborepo)\n\n**4. Behavioral**\n- Open source contributions\n- Technical blog posts or talks\n- Team collaboration examples\n\nShall I create a detailed 2-week study plan for you?", timestamp: "10:02 AM" },
];

export const recentActivity = [
  { id: "a1", type: "coding", title: "Solved 'Two Sum'", time: "2 hours ago", icon: "Code" },
  { id: "a2", type: "project", title: "Pushed 3 commits to E-Commerce", time: "4 hours ago", icon: "GitCommit" },
  { id: "a3", type: "resume", title: "Updated resume skills section", time: "1 day ago", icon: "FileText" },
  { id: "a4", type: "certificate", title: "Completed AWS certification", time: "2 days ago", icon: "Award" },
  { id: "a5", type: "interview", title: "Mock interview completed", time: "3 days ago", icon: "Video" },
];

export const companyLogos = [
  "Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix",
  "Stripe", "Vercel", "Linear", "Figma", "Notion", "Slack",
];

export const testimonials = [
  { id: "t1", name: "Priya Sharma", role: "Placed at Google", avatar: "", quote: "AROMA's AI-powered resume analyzer helped me increase my ATS score by 40%. The skill passport gave me a competitive edge in interviews.", rating: 5 },
  { id: "t2", name: "Rahul Verma", role: "SDE II at Microsoft", avatar: "", quote: "The coding platform and AI career mentor completely transformed my preparation. I went from struggling with mediums to solving hards consistently.", rating: 5 },
  { id: "t3", name: "Ananya Desai", role: "Frontend at Stripe", avatar: "", quote: "The portfolio builder and GitHub analytics gave recruiters a comprehensive view of my abilities. Got 5x more interview callbacks.", rating: 5 },
];

export const pricingPlans = [
  {
    name: "Free", price: "$0", period: "forever",
    features: ["Basic Resume Analysis", "5 Coding Problems/day", "Limited AI Mentor", "Basic Skill Passport", "Community Support"],
    cta: "Get Started", popular: false,
  },
  {
    name: "Pro", price: "$19", period: "month",
    features: ["Advanced AI Resume Analyzer", "Unlimited Coding Problems", "Full AI Career Mentor", "Complete Skill Passport", "Portfolio Builder", "Mock Interviews", "Priority Support", "GitHub Analytics"],
    cta: "Start Pro Trial", popular: true,
  },
  {
    name: "Enterprise", price: "$49", period: "month",
    features: ["Everything in Pro", "Recruiter Dashboard", "Candidate Search", "Bulk Analysis", "API Access", "Custom Integrations", "Dedicated Support", "White Label"],
    cta: "Contact Sales", popular: false,
  },
];

export const faqItems = [
  { q: "What is the AI Skill Passport?", a: "The AI Skill Passport is a comprehensive digital credential that aggregates your coding skills, project work, certifications, GitHub activity, and communication abilities into a single verified score. It's designed to give recruiters a holistic view of your capabilities beyond just a resume." },
  { q: "How does the AI Resume Analyzer work?", a: "Our AI Resume Analyzer uses advanced NLP to parse your resume against industry standards and specific job descriptions. It checks ATS compatibility, keyword optimization, formatting, grammar, and provides actionable suggestions to improve your score." },
  { q: "Is the coding platform free?", a: "Yes! Free users get access to 5 coding problems per day. Pro users get unlimited access to our entire library of 500+ problems across all difficulty levels, along with AI-powered code reviews and detailed explanations." },
  { q: "How accurate is the AI Career Mentor?", a: "Our AI Career Mentor is trained on data from thousands of successful placements and career transitions. It provides personalized advice based on your skill profile, career goals, and current market trends with over 90% satisfaction rate." },
  { q: "Can recruiters access my Skill Passport?", a: "Only if you choose to share it. You control your privacy settings and can generate a shareable link or QR code for specific recruiters. Your data is encrypted and GDPR compliant." },
  { q: "Do you offer campus partnerships?", a: "Yes! We partner with universities and coding bootcamps to provide bulk access to our platform. Contact our enterprise team for custom pricing and integration options." },
];

export const githubData = {
  contributions: Array.from({ length: 365 }, (_, i) => ({
    date: new Date(2024, 0, i + 1).toISOString().split("T")[0],
    count: Math.floor(Math.random() * 12),
  })),
  languages: [
    { name: "TypeScript", percentage: 42, color: "#3178c6" },
    { name: "Python", percentage: 25, color: "#3572A5" },
    { name: "JavaScript", percentage: 18, color: "#f1e05a" },
    { name: "Go", percentage: 8, color: "#00ADD8" },
    { name: "Rust", percentage: 4, color: "#dea584" },
    { name: "Other", percentage: 3, color: "#94A3B8" },
  ],
  stats: { repos: 48, stars: 1247, forks: 389, followers: 892, following: 156, commits: 2847 },
};

export const skillGapData = {
  targetRole: "Senior Frontend Engineer",
  currentSkills: [
    { name: "React", level: 90, required: 95 },
    { name: "TypeScript", level: 85, required: 90 },
    { name: "Next.js", level: 80, required: 90 },
    { name: "Testing", level: 60, required: 85 },
    { name: "System Design", level: 55, required: 80 },
    { name: "Performance", level: 70, required: 85 },
    { name: "Accessibility", level: 45, required: 75 },
    { name: "CI/CD", level: 65, required: 70 },
  ],
  missingSkills: ["Micro Frontends", "Web Workers", "GraphQL Subscriptions", "Advanced CSS Animations"],
  estimatedTime: "3-4 months",
};

export const adminStats = {
  totalStudents: 12450,
  totalRecruiters: 348,
  totalCompanies: 156,
  totalJobs: 892,
  activeUsers: 8234,
  placementsThisMonth: 67,
  revenue: 284500,
  growthRate: 23.5,
};
