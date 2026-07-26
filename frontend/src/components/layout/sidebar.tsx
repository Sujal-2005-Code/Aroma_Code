"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Code2, Briefcase, Bot, Award,
  GitBranch, Palette, Target, Users, Video, Settings,
  ChevronLeft, ChevronRight, BarChart3, Shield,
  FolderGit2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/auth";

const menuItems = [
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
  { label: "Admin", href: "/admin", icon: Shield },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const user = currentUser();

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.label === "Admin") {
      return user?.role === "admin";
    }
    return true;
  });

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 glass-card border-r border-border-subtle transition-all duration-300 hidden lg:flex flex-col",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative",
                  isActive
                    ? "bg-gradient-to-r from-brand-orange/15 to-brand-pink/10 text-brand-orange border border-brand-orange/20"
                    : "text-text-muted hover:text-text-primary hover:bg-glass"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-brand-orange")} />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-brand-orange rounded-r"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-2 border-t border-border-subtle">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-glass transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
