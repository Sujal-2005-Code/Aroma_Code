export interface PersonalInfo {
  fullName: string;
  headline?: string;
  role?: string;
  email?: string;
  phone?: string;
  location?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  photo?: string;
}

export interface Education {
  id: string;
  degree: string;
  college?: string;
  university?: string;
  board?: string;
  branch?: string;
  cgpa?: string;
  percentage?: string;
  startDate: string;
  endDate?: string;
  achievements?: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  employmentType?: string;
  duration?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
  companyWebsite?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  problemStatement?: string;
  solution?: string;
  features?: string[];
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
  images?: string[];
  demoVideo?: string;
  duration?: string;
  role?: string;
  challenges?: string;
  futureScope?: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface Skills {
  programmingLanguages?: Skill[];
  frameworks?: Skill[];
  libraries?: Skill[];
  databases?: Skill[];
  cloud?: Skill[];
  devops?: Skill[];
  tools?: Skill[];
  softSkills?: Skill[];
  languages?: Skill[];
}

export interface Certificate {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  credentialId?: string;
  verificationLink?: string;
  certificateImage?: string;
}

export interface Achievement {
  id: string;
  title: string;
  type: 'hackathon' | 'competition' | 'award' | 'research' | 'publication' | 'opensource' | 'other';
  description?: string;
  date?: string;
  organization?: string;
  link?: string;
}

export interface CodingProfile {
  platform: string;
  username: string;
  profileLink: string;
  badges?: string[];
  rating?: string;
  solvedProblems?: number;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  discord?: string;
  medium?: string;
  hashnode?: string;
  devto?: string;
  behance?: string;
  dribbble?: string;
}

export interface ThemeCustomization {
  accentColor?: string;
  primaryColor?: string;
  background?: string;
  typography?: string;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  cursorEffect?: boolean;
  particleEffect?: boolean;
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  sectionOrder?: string[];
}

export interface SEOMetadata {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  keywords?: string[];
}

export interface PortfolioData {
  id?: number;
  userId?: number;
  resumeId?: number;
  slug: string;
  personalInfo: PersonalInfo;
  summary?: string;
  bio?: string;
  headline?: string;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: Skills;
  certificates: Certificate[];
  achievements: Achievement[];
  codingProfiles: CodingProfile[];
  socialLinks: SocialLinks;
  theme: string;
  customization?: ThemeCustomization;
  seoMetadata?: SEOMetadata;
  isPublished: boolean;
  isPublic: boolean;
  isPasswordProtected: boolean;
  password?: string;
  customDomain?: string;
}

export type ThemeName =
  | 'modern-dark'
  | 'minimal'
  | 'glassmorphism'
  | 'cyberpunk'
  | 'developer'
  | 'creative'
  | 'gradient'
  | 'apple'
  | 'github'
  | 'framer';

export const defaultPortfolioData: PortfolioData = {
  slug: 'portfolio',
  personalInfo: {
    fullName: '',
    headline: '',
    role: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  bio: '',
  headline: '',
  education: [],
  workExperience: [],
  projects: [],
  skills: {},
  certificates: [],
  achievements: [],
  codingProfiles: [],
  socialLinks: {},
  theme: 'modern-dark',
  isPublished: false,
  isPublic: true,
  isPasswordProtected: false,
};
