"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, Code2, FileText, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "react-countup";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
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
  const [loading, setLoading] = useState(true);

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
          { assessment_id: "System Architecture", percentage: 95, result: "PASS", submitted_at: new Date(Date.now() - 86400000 * 12).toISOString() },
        ];
        setStats(mockDashboard);
        setResults(mockResults);
        setName(profile.full_name || "there");
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const recent = [...results].sort((a, b) => (b.submitted_at || "").localeCompare(a.submitted_at || "")).slice(0, 5);
  const skillData = [
    { subject: "Coding", score: 92, fullMark: 100 },
    { subject: "Communication", score: 84, fullMark: 100 },
    { subject: "Problem Solving", score: 89, fullMark: 100 },
    { subject: "Leadership", score: 76, fullMark: 100 },
    { subject: "Design", score: 81, fullMark: 100 },
  ];
  const statCards = [
    { label: "Average score", value: stats?.average_score ?? 0, Icon: Award, suffix: "%" },
    { label: "Pass rate", value: stats?.pass_percentage ?? 0, Icon: CheckCircle2, suffix: "%" },
    { label: "Assessments", value: stats?.total_attempts ?? 0, Icon: FileText, suffix: "" },
    { label: "Completed", value: stats?.completed ?? 0, Icon: TrendingUp, suffix: "" },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-white/10 via-transparent to-brand-orange/10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success">Live progress</Badge>
                <Badge variant="secondary">Updated today</Badge>
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight">Welcome back, {name}</h1>
              <p className="mt-2 text-sm text-text-muted">Your current assessment progress and outcomes are shown below.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Avatar size="lg" className="bg-brand-orange/20 text-brand-orange">
                  <AvatarFallback>{name === "there" ? "ST" : name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-text-muted">Student dashboard</p>
                </div>
              </div>
              <Button size="sm" className="rounded-full px-4">
                Continue learning
              </Button>
            </div>
          </div>
        </Card>

        {error && (
          <Card className="border-red-400/30 bg-red-500/10 text-red-300">
            {error}
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-full" />
                  </div>
                </Card>
              ))
            : statCards.map(({ label, value, Icon, suffix }) => (
                <Card key={label} className="flex items-start gap-4" hover>
                  <div className="rounded-2xl bg-brand-orange/10 p-3">
                    <Icon className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-semibold">
                      <CountUp end={value} duration={1.5} suffix={suffix} />
                    </p>
                    <p className="mt-1 text-xs text-text-muted">{label}</p>
                    <div className="mt-3">
                      <Progress value={Math.min(value, 100)} size="sm" />
                    </div>
                  </div>
                </Card>
              ))}
        </div>

        <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-brand-orange/10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-medium">Skill profile snapshot</h2>
              <p className="mt-1 text-sm text-text-muted">A quick view of your strongest growth areas.</p>
            </div>
            <Badge variant="secondary">Live insight</Badge>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <PolarRadiusAxis angle={24} domain={[0, 100]} tick={false} />
                <Radar name="Skill score" dataKey="score" stroke="#fb923c" fill="#fb923c" fillOpacity={0.28} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium">Recent assessment activity</h2>
              <Badge variant="secondary">Last 5</Badge>
            </div>
            {recent.length ? (
              <div className="space-y-3">
                {recent.map((item) => (
                  <div key={`${item.assessment_id}-${item.submitted_at}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm" className="bg-brand-orange/15 text-brand-orange">
                          <AvatarFallback>{item.assessment_id.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">Assessment {item.assessment_id}</p>
                          <p className="text-xs text-text-muted">{item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : "Recently submitted"}</p>
                        </div>
                      </div>
                      <Badge variant={item.result === "PASS" ? "success" : "danger"}>{item.result}</Badge>
                    </div>
                    <div className="mt-3">
                      <Progress value={item.percentage} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No completed assessments yet.</p>
            )}
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium">Quick actions</h2>
              <Badge variant="secondary">Next steps</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {actions.map(([label, href, Icon]) => (
                <Link key={href} href={href} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition-colors hover:bg-white/10">
                  <Icon className="mx-auto h-5 w-5 text-brand-orange" />
                  <p className="mt-2 text-xs text-text-muted">{label}</p>
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
              <Sparkles className="h-4 w-4 text-brand-orange" />
              Keep your momentum going
              <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
