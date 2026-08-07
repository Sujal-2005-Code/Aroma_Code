"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CodingWorkbench } from "@/components/coding-platform";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code2, Search, CheckCircle2, Clock, Trophy,
  Bookmark, Star, Flame, Play, ChevronRight, Brain, Sparkles,
  XCircle, List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { getRealCodingProblems, getLeaderboard } from "@/lib/api/resources";
import type { ApiQuestion } from "@/lib/api/types";

type CodingProblem = ApiQuestion & {
  id: string;
  displayTitle: string;
  difficultyLevel: "Easy" | "Medium" | "Hard";
  solved: boolean;
  acceptance: number;
  number: number;
};

const difficultyColors = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

const tabs = ["All Problems", "Solved", "Unsolved", "Bookmarked"];

export default function CodingPage() {
  const [activeTab, setActiveTab] = useState("All Problems");
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{ student_id: string; student_name: string; average_score: number; rank: number }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRealCodingProblems()
      .then((questions) => {
        const mapped = (questions || []).map((q, idx) => ({
          ...q,
          id: q._id || String(idx),
          displayTitle: `${idx + 1}. ${q.title}`,
          difficultyLevel: q.difficulty || "Medium",
          solved: false,
          acceptance: Math.floor(Math.random() * 40) + 40,
          number: idx + 1,
          question_type: "coding",
          marks: q.marks || 10,

          // Map backend casing to what coding-platform.tsx expects
          starter_code: q.starterCode?.python || q.starterCode?.cpp || "",
          supported_languages: Object.keys(q.starterCode || {}),
          sample_test_cases: (q.sampleTests || []).map((tc: any) => ({
            input: tc.input,
            output: tc.expectedOutput
          })),
        }));
        setCodingProblems(mapped);
      })
      .catch((err) => {
        console.error("Failed to load problems", err);
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(`Failed to load coding problems. ${message}`);
      });

    getLeaderboard()
      .then((data) => {
        const mockLeaderboard =
          data && data.length > 0
            ? data
            : [
                { student_id: "u1", student_name: "Sara Patel", average_score: 892, rank: 1 },
                { student_id: "u2", student_name: "Arjun Mehta", average_score: 847, rank: 2 },
                { student_id: "u3", student_name: "Rahul Kumar", average_score: 789, rank: 3 },
                { student_id: "u4", student_name: "Priya Sharma", average_score: 756, rank: 4 },
                { student_id: "u5", student_name: "Dev Joshi", average_score: 723, rank: 5 },
              ];
        setLeaderboard(mockLeaderboard);
      })
      .catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    return codingProblems
      .filter((p) => {
        if (activeTab === "Solved") return p.solved;
        if (activeTab === "Unsolved") return !p.solved;
        return true;
      })
      .filter((p) => (difficultyFilter !== "All" ? p.difficultyLevel === difficultyFilter : true))
      .filter((p) => p.displayTitle.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [codingProblems, activeTab, difficultyFilter, searchQuery]);

  const leaderboardRows = leaderboard.map((user) => ({
    rank: user.rank,
    name: user.student_name,
    score: user.average_score,
    badge: "",
  }));

  if (selectedProblem) {
    return (
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto">
          <CodingWorkbench problem={selectedProblem} onBack={() => setSelectedProblem(null)} />
        </div>
      </DashboardLayout>
    );
  }

  const daily = codingProblems[0];

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Coding Platform</h1>
            <p className="text-text-muted">
              Practice problems with Monaco editor, run sample tests, and submit to Judge0.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Card className="!p-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-brand-orange" />
              <span className="text-sm font-medium text-text-primary">Daily Challenge</span>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Available", value: codingProblems.length, icon: CheckCircle2, color: "text-emerald-400" },
            {
              label: "Easy",
              value: codingProblems.filter((p) => p.difficultyLevel === "Easy").length,
              icon: Star,
              color: "text-emerald-400",
            },
            {
              label: "Medium",
              value: codingProblems.filter((p) => p.difficultyLevel === "Medium").length,
              icon: Code2,
              color: "text-amber-400",
            },
            {
              label: "Hard",
              value: codingProblems.filter((p) => p.difficultyLevel === "Hard").length,
              icon: Trophy,
              color: "text-red-400",
            },
          ].map((stat, i) => (
            <Card key={i} className="flex items-center gap-3 !p-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary">
                  <CountUp end={stat.value} duration={1.5} />
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {error && <Card className="text-red-400">{error}</Card>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex gap-1 glass-card rounded-xl p-1">
                  {tabs.map((tab) => (
                    <button
                      suppressHydrationWarning
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-1",
                        activeTab === tab
                          ? "bg-brand-orange/10 text-brand-orange"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      suppressHydrationWarning
                      type="text"
                      placeholder="Search problems..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30"
                    />
                  </div>
                  <div className="flex gap-1 p-1 rounded-xl glass-card">
                    {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
                      <button
                        suppressHydrationWarning
                        key={d}
                        onClick={() => setDifficultyFilter(d)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                          difficultyFilter === d
                            ? "bg-brand-orange/10 text-brand-orange"
                            : "text-text-muted hover:text-text-primary"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-text-muted font-medium">
                  <span className="col-span-1">#</span>
                  <span className="col-span-5">Title</span>
                  <span className="col-span-2">Difficulty</span>
                  <span className="col-span-2 hidden sm:block">Acceptance</span>
                  <span className="col-span-2 text-right">Action</span>
                </div>
                {filtered.map((problem, i) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="group"
                  >
                    <div
                      className={cn(
                        "grid grid-cols-12 gap-2 px-3 py-3 rounded-xl cursor-pointer transition-all text-sm items-center",
                        "hover:bg-brand-orange/5 hover:border hover:border-brand-orange/20"
                      )}
                      onClick={() => setSelectedProblem(problem)}
                    >
                      <span className="col-span-1 text-text-muted">{problem.number}</span>
                      <div className="col-span-5 min-w-0 flex items-center gap-2">
                        <List className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <span className="text-text-primary font-medium truncate">
                          {problem.displayTitle}
                        </span>
                      </div>
                      <span className="col-span-2">
                        <Badge className={difficultyColors[problem.difficultyLevel]}>
                          {problem.difficultyLevel}
                        </Badge>
                      </span>
                      <span className="col-span-2 text-text-muted hidden sm:block">
                        {problem.acceptance ? `${problem.acceptance}%` : "—"}
                      </span>
                      <span className="col-span-2 text-right flex justify-end items-center gap-2">
                        {problem.solved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Button
                            suppressHydrationWarning
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 !px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProblem(problem);
                            }}
                          >
                            <Play className="w-3 h-3" />
                            <span className="text-[11px]">Solve</span>
                          </Button>
                        )}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {filtered.length === 0 && (
                  <div className="py-16 text-center text-text-muted text-sm">
                    <XCircle className="w-8 h-8 mx-auto mb-2 opacity-60" />
                    No problems match your filters.
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-6"
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-orange/10 rounded-full blur-2xl" />
              <Badge className="mb-3">🔥 Daily Challenge</Badge>
              <h3 className="text-base font-semibold text-text-primary mb-2">
                {daily?.displayTitle || "No challenge available"}
              </h3>
              <p className="text-xs text-text-muted mb-4 line-clamp-3">
                {daily?.description?.split("\n")[0] ||
                  "Today's challenge is selected from the current coding-question catalogue."}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={daily ? difficultyColors[daily.difficultyLevel] : ""}>
                  {daily?.difficultyLevel || "—"}
                </Badge>
                <span className="text-xs text-text-muted">• 45 min</span>
              </div>
              <Button
                suppressHydrationWarning
                size="sm"
                className="w-full"
                disabled={!daily}
                onClick={() => daily && setSelectedProblem(daily)}
              >
                <Play className="w-3.5 h-3.5" /> Start Challenge
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-primary">Leaderboard</h3>
                <Trophy className="w-4 h-4 text-brand-orange" />
              </div>
              <div className="space-y-3">
                {(leaderboardRows.length
                  ? leaderboardRows
                  : [
                      { rank: 1, name: "Sara Patel", score: 892, badge: "🥇" },
                      { rank: 2, name: "Arjun Mehta", score: 847, badge: "🥈" },
                      { rank: 3, name: "Rahul Kumar", score: 789, badge: "🥉" },
                      { rank: 4, name: "Priya Sharma", score: 756, badge: "" },
                      { rank: 5, name: "Dev Joshi", score: 723, badge: "" },
                    ]
                ).map((user, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl",
                      user.rank === 1
                        ? "bg-brand-orange/5 border border-brand-orange/20"
                        : "glass-card"
                    )}
                  >
                    <span className="text-sm w-6">{user.badge || user.rank}</span>
                    <span className="text-sm text-text-primary flex-1 truncate">
                      {user.name}
                    </span>
                    <span className="text-xs font-medium text-text-muted">{user.score}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-brand-orange" />
                <h3 className="text-sm font-medium text-text-primary">AI Code Review</h3>
              </div>
              <p className="text-xs text-text-muted mb-4">
                Inside the editor, run sample inputs or submit to all test cases. AI review
                (upcoming) will rate time complexity, space usage, and code quality.
              </p>
              <div className="flex items-center gap-2 text-xs text-text-muted bg-glass rounded-lg p-2.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span>Powered by Monaco + Judge0</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}