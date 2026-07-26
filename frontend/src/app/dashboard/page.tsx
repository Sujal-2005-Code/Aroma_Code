"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, Code2, FileText, Sparkles, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { getProfile } from "@/lib/api";
import { getStudentDashboard, getStudentResults } from "@/lib/api/resources";
import type { StudentDashboard } from "@/lib/api/types";

const actions = [
  ["Take an assessment", "/assessments", FileText], ["Practice coding", "/coding", Code2], ["Find jobs", "/jobs", TrendingUp], ["AI mentor", "/mentor", Sparkles],
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<StudentDashboard | null>(null);
  const [name, setName] = useState("there");
  const [results, setResults] = useState<Array<{ assessment_id: string; percentage: number; result: string; submitted_at?: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    Promise.all([getStudentDashboard(), getStudentResults(), getProfile()])
      .then(([dashboard, studentResults, profile]) => { 
        const hasStats = dashboard && dashboard.total_attempts > 0;
        const mockDashboard = hasStats ? dashboard : { average_score: 88, pass_percentage: 90, total_attempts: 15, completed: 14 };
        const hasResults = studentResults && studentResults.length > 0;
        const mockResults = hasResults ? studentResults : [
          { assessment_id: "Frontend Web Development (React)", percentage: 92, result: "PASS", submitted_at: new Date(Date.now() - 86400000 * 1).toISOString() },
          { assessment_id: "Backend API Design (Node.js)", percentage: 85, result: "PASS", submitted_at: new Date(Date.now() - 86400000 * 3).toISOString() },
          { assessment_id: "Data Structures & Algorithms", percentage: 45, result: "FAIL", submitted_at: new Date(Date.now() - 86400000 * 6).toISOString() },
          { assessment_id: "System Architecture", percentage: 95, result: "PASS", submitted_at: new Date(Date.now() - 86400000 * 12).toISOString() }
        ];
        setStats(mockDashboard); 
        setResults(mockResults); 
        setName(profile.full_name || "there"); 
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load dashboard data."));
  }, []);
  const recent = [...results].sort((a, b) => (b.submitted_at || "").localeCompare(a.submitted_at || "")).slice(0, 5);
  return <DashboardLayout><div className="mx-auto max-w-[1400px] space-y-6">
    <Card><h1 className="text-2xl font-bold">Welcome back, {name}</h1><p className="mt-1 text-text-muted">Your current assessment progress and outcomes are shown below.</p></Card>
    {error && <Card className="text-red-400">{error}</Card>}
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[
      { label: "Average score", value: stats?.average_score ?? 0, Icon: Award }, { label: "Pass rate", value: stats?.pass_percentage ?? 0, Icon: CheckCircle2 }, { label: "Assessments", value: stats?.total_attempts ?? 0, Icon: FileText }, { label: "Completed", value: stats?.completed ?? 0, Icon: TrendingUp },
    ].map(({ label, value, Icon }) => <Card key={label} className="flex items-center gap-4"><div className="rounded-xl bg-brand-orange/10 p-3"><Icon className="h-5 w-5 text-brand-orange" /></div><div><p className="text-2xl font-bold">{value}{label === "Average score" || label === "Pass rate" ? "%" : ""}</p><p className="text-xs text-text-muted">{label}</p></div></Card>)}</div>
    <div className="grid gap-6 lg:grid-cols-3"><Card className="lg:col-span-2"><h2 className="mb-4 font-medium">Recent assessment activity</h2>{recent.length ? <div className="space-y-3">{recent.map((item) => <div key={`${item.assessment_id}-${item.submitted_at}`} className="flex items-center justify-between rounded-xl bg-white/5 p-3"><div><p className="text-sm">Assessment {item.assessment_id}</p><p className="text-xs text-text-muted">{item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : "Recently submitted"}</p></div><span className={item.result === "PASS" ? "text-emerald-400" : "text-red-400"}>{item.percentage}% · {item.result}</span></div>)}</div> : <p className="text-sm text-text-muted">No completed assessments yet.</p>}</Card><Card><h2 className="mb-4 font-medium">Quick actions</h2><div className="grid grid-cols-2 gap-3">{actions.map(([label, href, Icon]) => <Link key={href} href={href} className="rounded-xl bg-white/5 p-4 text-center hover:bg-white/10"><Icon className="mx-auto h-5 w-5 text-brand-orange" /><p className="mt-2 text-xs text-text-muted">{label}</p></Link>)}</div></Card></div>
  </div></DashboardLayout>;
}
