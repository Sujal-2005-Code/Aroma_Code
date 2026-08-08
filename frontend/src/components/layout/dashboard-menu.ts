import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  Code2,
  Briefcase,
  Bot,
  Award,
  GitBranch,
  Palette,
  Target,
  Users,
  Video,
  Settings,
  BarChart3,
  Shield,
  ChevronRight,
  FolderGit2,
} from "lucide-react";

export type DashboardMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

export const dashboardMenuItems: DashboardMenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Assessments", href: "/assessments", icon: BarChart3 },
  { label: "History", href: "/student/history", icon: ChevronRight },
  { label: "Resume Analyzer", href: "/resume", icon: FileText },
  { label: "Coding Platform", href: "/coding", icon: Code2 },
  { label: "Skill Passport", href: "/passport", icon: Award },
  { label: "Portfolio Builder", href: "/portfolio", icon: Palette },
  { label: "Job Portal", href: "/jobs", icon: Briefcase },
  { label: "AI Mentor", href: "/mentor", icon: Bot },
  { label: "GitHub Analytics", href: "/github", icon: GitBranch },
  { label: "Skill Gap", href: "/skill-gap", icon: Target },
  { label: "Project Verify", href: "/project-verify", icon: FolderGit2 },
  { label: "Mock Interview", href: "/interview", icon: Video },
  { label: "Recruiter", href: "/recruiter", icon: Users },
  { label: "Admin", href: "/admin", icon: Shield, adminOnly: true },
  { label: "Settings", href: "/settings", icon: Settings },
];

