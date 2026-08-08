export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "student" | "recruiter" | "admin";
  title?: string;
  company?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  passportScore?: number;
  atsScore?: number;
  resumeScore?: number;
  codingScore?: number;
  githubScore?: number;
  portfolioScore?: number;
  aiReadiness?: number;
  industryReadiness?: number;
  communicationScore?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract" | "Remote";
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
  skills: string[];
  applicants: number;
  status: "Active" | "Closed" | "Draft";
}

export interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  acceptance: number;
  submissions: number;
  solved: boolean;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  score: number;
  verified: boolean;
  stars: number;
  forks: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verified: boolean;
  credentialId: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  location: string;
  skills: string[];
  experience: string;
  passportScore: number;
  atsScore: number;
  status: "New" | "Shortlisted" | "Interview" | "Hired" | "Rejected";
  appliedDate: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface InterviewRound {
  id: string;
  type: "HR" | "Technical" | "Behavioral" | "Communication" | "System Design";
  status: "upcoming" | "in-progress" | "completed";
  score?: number;
  feedback?: string;
}
