export type UserRole = "student" | "admin" | "recruiter";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  title?: string;
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
};

export type JobStatus = "Active" | "Closed" | "Draft";

export type Job = {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  applicants: number;
  status: JobStatus;
  requirements: string[];
  skills: string[];
};

export type NotificationType = "success" | "info" | "warning" | "alert";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
};

export type ProblemDifficulty = "Easy" | "Medium" | "Hard";

export type CodingProblem = {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  tags: string[];
  acceptance: number;
  submissions: number;
  solved: boolean;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  score: number;
  verified: boolean;
  stars: number;
  forks: number;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verified: boolean;
  credentialId: string;
};

export type CandidateStatus =
  | "New"
  | "Shortlisted"
  | "Interview"
  | "Hired"
  | "Rejected";

export type Candidate = {
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
  status: CandidateStatus;
  appliedDate: string;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
};

// ---------------- Profile-specific types (ProfilePage + SkillsPassport) ----------------

export type ProfileInfo = {
  fullName: string;
  headline: string;
  tagline: string;
  bio: string;
  location: string;
  website: string;
  phone: string;
  birthday: string;
  languages: string[];
  interests: string[];
};

export type ExperienceEntry = {
  id: string;
  company: string;
  logoText: string;
  logoColor: string;
  jobTitle: string;
  employmentType: "Full-time" | "Part-time" | "Internship" | "Contract" | "Freelance" | "Apprenticeship";
  locationType: "Remote" | "Hybrid" | "On-site";
  location: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
  skills: string[];
};

export type EducationEntry = {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  currentlyStudying: boolean;
  grade: string;
  activities: string[];
  description: string;
  logoText: string;
  logoColor: string;
};

export type AchievementEntry = {
  id: string;
  title: string;
  issuer: string;
  type: "Certification" | "Award" | "Recognition";
  emoji: string;
  date: string;
  description: string;
  url?: string;
  colorClass: string;
};

export type SocialLinkIconName = "GitHub" | "LinkedIn" | "Twitter" | "Globe";

export type SocialLink = {
  id: string;
  platform: string;
  username: string;
  url: string;
  brandColor: string;
  icon: SocialLinkIconName;
};

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type SkillScoreBreakdown = {
  assessment: number;
  github: number;
  coding: number;
  passport: number;
  resume: number;
  portfolio: number;
};

export type SkillEntry = {
  id: string;
  category: string;
  name: string;
  verified: boolean;
  level: SkillLevel;
  endorsements: number;
  overall: number;
  scores: SkillScoreBreakdown;
};

export type PassportSummary = {
  score: number;
  totalSkills: number;
  verifiedSkills: number;
  endorsements: number;
  averageLevel: number;
};
