export type EducationEntry = {
  id: string;
  college: string;
  university: string;
  degree: string;
  branch: string;
  graduationYear: string;
  cgpa: string;
  semester: string;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  title: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type ProjectEntry = {
  id: string;
  name: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
};

export type SkillGroupKey =
  | "programming"
  | "frontend"
  | "backend"
  | "database"
  | "aiml"
  | "tools"
  | "soft";

export type SkillGroups = Record<SkillGroupKey, string[]>;

export type CertificationEntry = {
  id: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  fileName: string;
  fileUrl: string;
};

export type SocialLinks = {
  linkedin: string;
  github: string;
  portfolio: string;
  leetcode: string;
  hackerrank: string;
  codechef: string;
  codeforces: string;
  geeksforgeeks: string;
  twitter: string;
};

export type ResumeInfo = {
  fileName: string;
  fileUrl: string;
  size: number;
  uploadedAt: string;
};

export type CareerPreferences = {
  role: string;
  location: string;
  salary: string;
  workMode: "Remote" | "Hybrid" | "Onsite" | "";
  noticePeriod: string;
};

export type SkillScores = {
  overall: number;
  ats: number;
  coding: number;
  communication: number;
  problemSolving: number;
  aiReadiness: number;
};

export type ProfileData = {
  fullName: string;
  headline: string;
  about: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  location: string;
  photoUrl: string;
  photoKind: "upload" | "ai" | "none";
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillGroups;
  certifications: CertificationEntry[];
  social: SocialLinks;
  resume: ResumeInfo | null;
  preferences: CareerPreferences;
};

export type StoredProfile = {
  slug: string;
  status: "draft" | "published";
  completion: number;
  scores: SkillScores;
  insights: string[];
  updatedAt: string;
  data: ProfileData;
};

export type ActivityItem = {
  id: number;
  action: string;
  message: string;
  createdAt: string;
};

export const EMPTY_SKILLS: SkillGroups = {
  programming: [],
  frontend: [],
  backend: [],
  database: [],
  aiml: [],
  tools: [],
  soft: [],
};

export const EMPTY_SOCIAL: SocialLinks = {
  linkedin: "",
  github: "",
  portfolio: "",
  leetcode: "",
  hackerrank: "",
  codechef: "",
  codeforces: "",
  geeksforgeeks: "",
  twitter: "",
};

export function emptyProfile(): ProfileData {
  return {
    fullName: "",
    headline: "",
    about: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    location: "",
    photoUrl: "",
    photoKind: "none",
    education: [],
    experience: [],
    projects: [],
    skills: { ...EMPTY_SKILLS },
    certifications: [],
    social: { ...EMPTY_SOCIAL },
    resume: null,
    preferences: { role: "", location: "", salary: "", workMode: "", noticePeriod: "" },
  };
}

/** Merge partial/legacy payloads onto a complete shape so the UI never sees undefined. */
export function normalizeProfile(input: unknown): ProfileData {
  const base = emptyProfile();
  if (!input || typeof input !== "object") return base;
  const raw = input as Partial<ProfileData>;

  return {
    ...base,
    ...raw,
    skills: { ...EMPTY_SKILLS, ...(raw.skills ?? {}) },
    social: { ...EMPTY_SOCIAL, ...(raw.social ?? {}) },
    preferences: { ...base.preferences, ...(raw.preferences ?? {}) },
    education: Array.isArray(raw.education) ? raw.education : [],
    experience: Array.isArray(raw.experience) ? raw.experience : [],
    projects: Array.isArray(raw.projects) ? raw.projects : [],
    certifications: Array.isArray(raw.certifications) ? raw.certifications : [],
    resume: raw.resume ?? null,
  };
}

export const SKILL_GROUPS: {
  key: SkillGroupKey;
  label: string;
  hint: string;
  accent: string;
  suggestions: string[];
}[] = [
  {
    key: "programming",
    label: "Programming Languages",
    hint: "Core languages you can write production code in",
    accent: "from-violet-500/80 to-fuchsia-500/60",
    suggestions: ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "SQL"],
  },
  {
    key: "frontend",
    label: "Frontend",
    hint: "UI frameworks, styling systems, design tooling",
    accent: "from-cyan-500/80 to-sky-500/60",
    suggestions: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Vue", "Redux"],
  },
  {
    key: "backend",
    label: "Backend",
    hint: "APIs, services, infra you have shipped with",
    accent: "from-emerald-500/80 to-teal-500/60",
    suggestions: ["Node.js", "Express", "FastAPI", "Spring Boot", "GraphQL", "Docker"],
  },
  {
    key: "database",
    label: "Database",
    hint: "Data stores you can model and query",
    accent: "from-amber-500/80 to-orange-500/60",
    suggestions: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Prisma", "Supabase"],
  },
  {
    key: "aiml",
    label: "AI / ML",
    hint: "Models, frameworks and applied AI experience",
    accent: "from-pink-500/80 to-rose-500/60",
    suggestions: ["PyTorch", "TensorFlow", "LangChain", "RAG", "Scikit-learn", "LLM Fine-tuning"],
  },
  {
    key: "tools",
    label: "Tools",
    hint: "Daily driver tooling and platforms",
    accent: "from-indigo-500/80 to-blue-500/60",
    suggestions: ["Git", "GitHub Actions", "Figma", "Postman", "AWS", "Vercel"],
  },
  {
    key: "soft",
    label: "Soft Skills",
    hint: "How you collaborate, lead and communicate",
    accent: "from-lime-500/80 to-emerald-400/60",
    suggestions: ["Communication", "Ownership", "Teamwork", "Public Speaking", "Mentoring"],
  },
];

export const SOCIAL_FIELDS: {
  key: keyof SocialLinks;
  label: string;
  placeholder: string;
  emoji: string;
  tone: string;
}[] = [
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username", emoji: "in", tone: "text-sky-300" },
  { key: "github", label: "GitHub", placeholder: "github.com/username", emoji: "GH", tone: "text-slate-200" },
  { key: "portfolio", label: "Portfolio", placeholder: "yourname.dev", emoji: "WWW", tone: "text-violet-300" },
  { key: "leetcode", label: "LeetCode", placeholder: "leetcode.com/u/username", emoji: "LC", tone: "text-amber-300" },
  { key: "hackerrank", label: "HackerRank", placeholder: "hackerrank.com/username", emoji: "HR", tone: "text-emerald-300" },
  { key: "codechef", label: "CodeChef", placeholder: "codechef.com/users/username", emoji: "CC", tone: "text-orange-300" },
  { key: "codeforces", label: "Codeforces", placeholder: "codeforces.com/profile/username", emoji: "CF", tone: "text-rose-300" },
  { key: "geeksforgeeks", label: "GeeksforGeeks", placeholder: "geeksforgeeks.org/user/username", emoji: "GFG", tone: "text-green-300" },
  { key: "twitter", label: "Twitter / X", placeholder: "x.com/username", emoji: "X", tone: "text-zinc-200" },
];

export const CODING_PLATFORMS: (keyof SocialLinks)[] = [
  "leetcode",
  "hackerrank",
  "codechef",
  "codeforces",
  "geeksforgeeks",
];
