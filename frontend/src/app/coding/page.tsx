"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code2, Search, Filter, CheckCircle2, Clock, Trophy,
  Bookmark, Star, Flame, Play, Timer, ChevronRight, Brain, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { getStudentQuestions } from "@/lib/api/questions";
import { getLeaderboard } from "@/lib/api/resources";

type CodingProblem = { id: string; title: string; difficulty: "Easy" | "Medium" | "Hard"; solved: boolean; acceptance: number };

const difficultyColors = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

const tabs = ["All Problems", "Solved", "Unsolved", "Bookmarked"];

export default function CodingPage() {
  const [activeTab, setActiveTab] = useState("All Problems");
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{ student_id: string; student_name: string; average_score: number; rank: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudentQuestions().then((questions) => {
      const mockQuestions = questions && questions.length > 0 ? questions : [
        { _id: "q1", title: "Two Sum", difficulty: "Easy", question_type: "coding" },
        { _id: "q2", title: "Add Two Numbers", difficulty: "Medium", question_type: "coding" },
        { _id: "q3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", question_type: "coding" },
        { _id: "q4", title: "Median of Two Sorted Arrays", difficulty: "Hard", question_type: "coding" },
        { _id: "q5", title: "Longest Palindromic Substring", difficulty: "Medium", question_type: "coding" },
        { _id: "q6", title: "Zigzag Conversion", difficulty: "Medium", question_type: "coding" },
        { _id: "q7", title: "Reverse Integer", difficulty: "Medium", question_type: "coding" },
        { _id: "q8", title: "String to Integer (atoi)", difficulty: "Medium", question_type: "coding" },
        { _id: "q9", title: "Palindrome Number", difficulty: "Easy", question_type: "coding" },
        { _id: "q10", title: "Regular Expression Matching", difficulty: "Hard", question_type: "coding" },
      ];
      setCodingProblems(mockQuestions.filter((question) => question.question_type === "coding").map((question) => ({ id: question._id, title: question.title || (question as any).description, difficulty: question.difficulty?.toLowerCase() === "easy" ? "Easy" : question.difficulty?.toLowerCase() === "hard" ? "Hard" : "Medium", solved: false, acceptance: Math.floor(Math.random() * 60) + 20 })));
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load coding problems."));
    getLeaderboard().then(data => {
      const mockLeaderboard = data && data.length > 0 ? data : [
        { student_id: "u1", student_name: "Sara Patel", average_score: 892, rank: 1 },
        { student_id: "u2", student_name: "Arjun Mehta", average_score: 847, rank: 2 },
        { student_id: "u3", student_name: "Rahul Kumar", average_score: 789, rank: 3 },
        { student_id: "u4", student_name: "Priya Sharma", average_score: 756, rank: 4 },
        { student_id: "u5", student_name: "Dev Joshi", average_score: 723, rank: 5 },
      ];
      setLeaderboard(mockLeaderboard);
    }).catch(() => undefined);
  }, []);

  const filtered = codingProblems.filter((p) => {
    if (activeTab === "Solved") return p.solved;
    if (activeTab === "Unsolved") return !p.solved;
    return true;
  }).filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const leaderboardRows = leaderboard.map((user) => ({ rank: user.rank, name: user.student_name, score: user.average_score, badge: "" }));

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Coding Platform</h1>
            <p className="text-text-muted">Practice problems, improve your skills, climb the leaderboard.</p>
          </div>
          <div className="flex items-center gap-3">
            <Card className="!p-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-brand-orange" />
              <span className="text-sm font-medium text-text-primary">Daily Challenge</span>
            </Card>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Available", value: codingProblems.length, icon: CheckCircle2, color: "text-emerald-400" },
            { label: "Easy", value: codingProblems.filter((problem) => problem.difficulty === "Easy").length, icon: Star, color: "text-emerald-400" },
            { label: "Medium", value: codingProblems.filter((problem) => problem.difficulty === "Medium").length, icon: Code2, color: "text-amber-400" },
            { label: "Hard", value: codingProblems.filter((problem) => problem.difficulty === "Hard").length, icon: Trophy, color: "text-red-400" },
          ].map((stat, i) => (
            <Card key={i} className="flex items-center gap-3 !p-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary"><CountUp end={stat.value} duration={1.5} /></p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>
        {error && <Card className="text-red-400">{error}</Card>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <Card>
              {/* Tabs & Search */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex gap-1 glass-card rounded-xl p-1 flex-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-1",
                        activeTab === tab ? "bg-brand-orange/10 text-brand-orange" : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-48 bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30"
                  />
                </div>
              </div>

              {/* Problem Table */}
              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-text-muted font-medium">
                  <span className="col-span-1">#</span>
                  <span className="col-span-5">Title</span>
                  <span className="col-span-2">Difficulty</span>
                  <span className="col-span-2 hidden sm:block">Acceptance</span>
                  <span className="col-span-2 text-right">Status</span>
                </div>
                {filtered.map((problem, i) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedProblem(problem.id)}
                    className={cn(
                      "grid grid-cols-12 gap-2 px-3 py-3 rounded-xl cursor-pointer transition-all text-sm",
                      selectedProblem === problem.id ? "bg-brand-orange/5 border border-brand-orange/20" : "hover:bg-glass"
                    )}
                  >
                    <span className="col-span-1 text-text-muted">{i + 1}</span>
                    <span className="col-span-5 text-text-primary font-medium truncate">{problem.title}</span>
                    <span className="col-span-2">
                      <Badge className={difficultyColors[problem.difficulty]}>{problem.difficulty}</Badge>
                    </span>
                    <span className="col-span-2 text-text-muted hidden sm:block">{problem.acceptance ? `${problem.acceptance}%` : "—"}</span>
                    <span className="col-span-2 text-right">
                      {problem.solved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                      ) : (
                        <span className="text-xs text-text-muted">—</span>
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Right Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
            {/* Daily Challenge */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-orange/10 rounded-full blur-2xl" />
              <Badge className="mb-3">🔥 Daily Challenge</Badge>
              <h3 className="text-base font-semibold text-text-primary mb-2">{codingProblems[0]?.title || "No challenge available"}</h3>
              <p className="text-xs text-text-muted mb-4">Today&apos;s challenge is selected from the current coding-question catalogue.</p>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="warning">{codingProblems[0]?.difficulty || "—"}</Badge>
                <span className="text-xs text-text-muted">• 45 min</span>
              </div>
              <Button size="sm" className="w-full" disabled={!codingProblems[0]} onClick={() => codingProblems[0] && setSelectedProblem(codingProblems[0].id)}>
                <Play className="w-3.5 h-3.5" /> Start Challenge
              </Button>
            </Card>

            {/* Leaderboard */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-primary">Leaderboard</h3>
                <Trophy className="w-4 h-4 text-brand-orange" />
              </div>
              <div className="space-y-3">
                {(leaderboardRows.length ? leaderboardRows : [
                  { rank: 1, name: "Sara Patel", score: 892, badge: "🥇" },
                  { rank: 2, name: "Arjun Mehta", score: 847, badge: "🥈" },
                  { rank: 3, name: "Rahul Kumar", score: 789, badge: "🥉" },
                  { rank: 4, name: "Priya Sharma", score: 756, badge: "" },
                  { rank: 5, name: "Dev Joshi", score: 723, badge: "" },
                ]).map((user, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl",
                    user.rank === 2 ? "bg-brand-orange/5 border border-brand-orange/20" : "glass-card"
                  )}>
                    <span className="text-sm w-6">{user.badge || user.rank}</span>
                    <span className="text-sm text-text-primary flex-1">{user.name}</span>
                    <span className="text-xs font-medium text-text-muted">{user.score}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Review */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-brand-orange" />
                <h3 className="text-sm font-medium text-text-primary">AI Code Review</h3>
              </div>
              <p className="text-xs text-text-muted mb-4">Submit your solution and get instant AI feedback on time complexity, space usage, and code quality.</p>
              <Button variant="outline" size="sm" className="w-full">
                <Sparkles className="w-3.5 h-3.5" /> Get AI Review
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
