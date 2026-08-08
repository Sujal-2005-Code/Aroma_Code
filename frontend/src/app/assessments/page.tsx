"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList, Clock, Search, Filter, Play, CheckCircle2,
  XCircle, Calendar, Building2, Code2, FileQuestion, ChevronRight,
  Trophy, AlertCircle
} from "lucide-react";
import { getAssessments } from "@/lib/api";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";


const filters = ["All", "Active", "Upcoming", "Completed"];
const difficultyColor = {
  Easy: "variant-success" as const,
  Medium: "variant-warning" as const,
  Hard: "variant-danger" as const,
};

function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" | string }) {
  const colors = {
    Easy: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    Hard: "bg-red-500/10 text-red-400 border border-red-500/20",
  };
  const normalizedDifficulty = (difficulty === "easy" ? "Easy" : difficulty === "medium" ? "Medium" : difficulty === "hard" ? "Hard" : difficulty) as "Easy" | "Medium" | "Hard" | string;
  return <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full", colors[normalizedDifficulty as keyof typeof colors] || colors.Medium)}>{normalizedDifficulty}</span>;
}

export default function AssessmentsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getAssessments()
      .then((data) => {
        if (active) {
          const mockData = data && data.length > 0 ? data : [
            { id: "a1", title: "Frontend Web Development (React)", description: "Test your React fundamentals including hooks, state management, and component lifecycle.", duration: 60, totalQuestions: 30, codingCount: 2, total_marks: 100, topic: "React", company: "TechCorp", passing_marks: 70, status: "active" },
            { id: "a2", title: "Backend API Design (Node.js)", description: "Assess your ability to build robust RESTful APIs using Node.js and Express.", duration: 90, totalQuestions: 40, codingCount: 3, total_marks: 120, topic: "Node.js", company: "Innovate Inc", passing_marks: 80, status: "active" },
            { id: "a3", title: "Data Structures & Algorithms", description: "Standard computer science DS & Algo assessment used for screening.", duration: 120, totalQuestions: 20, codingCount: 5, total_marks: 150, topic: "Algorithms", company: "GlobalTech", passing_marks: 60, status: "upcoming" },
            { id: "a4", title: "System Architecture", description: "Design a scalable system architecture for a high-traffic e-commerce platform.", duration: 180, totalQuestions: 15, codingCount: 1, total_marks: 200, topic: "System Design", company: "ScaleFast", passing_marks: 120, status: "completed" },
          ];
          setAssessments(mockData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          console.error(err);
          setError("Could not load assessments from the server.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const normalizedAssessments = assessments.map((assessment: any) => ({
    id: assessment._id || assessment.id,
    title: assessment.title || "Untitled assessment",
    description: assessment.description || "No description available.",
    duration: assessment.duration || 0,
    totalQuestions: assessment.question_ids?.length || 0,
    codingCount: 0,
    difficulty: (assessment.total_marks || 0) >= 100 ? "Hard" : (assessment.total_marks || 0) >= 50 ? "Medium" : "Easy",
    tags: [assessment.topic].filter(Boolean),
    company: null,
    cutoff: assessment.passing_marks || 0,
    status: "active",
    attempted: false,
    score: undefined,
    result: undefined,
    startDate: "Starts soon",
    endDate: "TBD",
    mcqCount: 0,
    msqCount: 0,
  }));

  const filtered = normalizedAssessments.filter((a) => {
    if (activeFilter !== "All" && a.status !== activeFilter.toLowerCase()) return false;
    return a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
  });

  const stats = {
    total: normalizedAssessments.length,
    active: normalizedAssessments.filter((a) => a.status === "active").length,
    passed: 0,
    avgScore: 0,
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Assessments</h1>
            <p className="text-text-muted">Take assessments to prove your skills and get placed.</p>
          </div>
        </motion.div>

        {loading && <Card className="text-center py-8 text-text-muted">Loading assessments...</Card>}
        {error && <Card className="text-center py-8 text-red-400">{error}</Card>}

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Available", value: stats.total, icon: ClipboardList, color: "text-blue-400" },
            { label: "Active Now", value: stats.active, icon: Play, color: "text-emerald-400" },
            { label: "Passed", value: stats.passed, icon: CheckCircle2, color: "text-brand-orange" },
            { label: "Avg Score", value: stats.avgScore, icon: Trophy, color: "text-purple-400" },
          ].map((stat, i) => (
            <Card key={i} className="flex items-center gap-3 !p-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  <CountUp end={stat.value} duration={1.5} />{stat.label === "Avg Score" ? "%" : ""}
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Filters & Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search assessments by title or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30"
              />
            </div>
            <div className="flex gap-1 glass-card rounded-xl p-1">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                    activeFilter === f ? "bg-brand-orange/10 text-brand-orange" : "text-text-muted hover:text-text-primary"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((assessment, i) => (
            <motion.div key={assessment.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card hover className="relative overflow-hidden">
                {/* Status ribbon */}
                {assessment.status === "active" && !assessment.attempted && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Live
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div className="flex-1 min-w-0 pr-12">
                    <h3 className="text-base font-semibold text-text-primary mb-0.5 truncate">{assessment.title}</h3>
                    {assessment.company && (
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Building2 className="w-3 h-3" />
                        {assessment.company}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-text-muted mb-4 line-clamp-2">{assessment.description}</p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {assessment.duration} min</span>
                  <span className="flex items-center gap-1"><FileQuestion className="w-3 h-3" /> {assessment.totalQuestions} questions</span>
                  <span className="flex items-center gap-1"><Code2 className="w-3 h-3" /> {assessment.codingCount} coding</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Ends {assessment.endDate}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <DifficultyBadge difficulty={assessment.difficulty} />
                  {assessment.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>

                {/* Cutoff */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-text-muted">Cutoff: <span className="text-text-primary font-medium">{assessment.cutoff}%</span></span>
                  {assessment.attempted && assessment.score !== undefined && (
                    <div className="flex items-center gap-2">
                      {assessment.result === "PASS" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={cn("text-sm font-bold", assessment.result === "PASS" ? "text-emerald-400" : "text-red-400")}>
                        {assessment.score}/100
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                {assessment.attempted ? (
                  <Link href={`/assessments/${assessment.id}/results`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <ChevronRight className="w-4 h-4" /> View Results
                    </Button>
                  </Link>
                ) : assessment.status === "active" ? (
                  <Link href={`/assessments/${assessment.id}`}>
                    <Button size="sm" className="w-full">
                      <Play className="w-4 h-4" /> Start Assessment
                    </Button>
                  </Link>
                ) : assessment.status === "upcoming" ? (
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <Calendar className="w-4 h-4" /> Starts {assessment.startDate}
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <AlertCircle className="w-4 h-4" /> Expired
                  </Button>
                )}

                {/* Decorative glow */}
                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-brand-orange/5 rounded-full blur-xl" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
