"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, FileQuestion, TrendingUp, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAssessmentResult, getStudentAssessment } from "@/lib/api/assessments";
import type { StudentAssessment, SubmissionResult } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [assessment, setAssessment] = useState<StudentAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAssessmentResult(id), getStudentAssessment(id)])
      .then(([savedResult, savedAssessment]) => { setResult(savedResult); setAssessment(savedAssessment); })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load your result."));
  }, [id]);

  const sections = useMemo(() => {
    if (!result || !assessment) return [];
    return (["mcq", "msq", "coding"] as const).map((type) => {
      const questionIds = new Set(assessment.questions.filter((question) => question.question_type === type).map((question) => question._id));
      const entries = result.results?.filter((entry) => questionIds.has(entry.question_id)) || [];
      return { type, earned: entries.reduce((sum, entry) => sum + (entry.marks_awarded ?? (entry.is_correct ? entry.marks : 0)), 0), total: entries.reduce((sum, entry) => sum + entry.marks, 0) };
    });
  }, [assessment, result]);

  if (error) return <DashboardLayout><Card className="mx-auto max-w-xl text-center text-red-400">{error}</Card></DashboardLayout>;
  if (!result || !assessment) return <DashboardLayout><Card className="mx-auto max-w-xl text-center text-text-muted">Loading result…</Card></DashboardLayout>;

  const passed = result.result === "PASS";
  return <DashboardLayout><div className="mx-auto max-w-4xl space-y-6">
    <Card className={cn("relative overflow-hidden text-center", passed ? "border-emerald-500/30" : "border-red-500/30")}>
      {passed ? <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" /> : <XCircle className="mx-auto h-14 w-14 text-red-400" />}
      <h1 className={cn("mt-3 text-3xl font-bold", passed ? "text-emerald-400" : "text-red-400")}>{passed ? "Assessment passed" : "Assessment not passed"}</h1>
      <p className="mt-2 text-text-muted">{assessment.title}</p>
      <Badge className={cn("mt-4 text-base", passed ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>{result.result} · {result.percentage}%</Badge>
    </Card>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[
      ["Score", `${result.score}/${result.total_marks}`], ["Percentage", `${result.percentage}%`], ["Correct", `${result.correct_count}`], ["Incorrect", `${result.wrong_count}`],
    ].map(([label, value]) => <Card key={label} className="text-center"><p className="text-xs text-text-muted">{label}</p><p className="mt-2 text-2xl font-bold text-text-primary">{value}</p></Card>)}</div>
    <Card><h2 className="mb-4 font-medium">Performance by question type</h2><div className="space-y-5">{sections.map((section) => <div key={section.type}><div className="mb-2 flex justify-between text-sm"><span className="uppercase text-text-muted">{section.type}</span><span>{section.earned}/{section.total}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-brand-orange" style={{ width: `${section.total ? (section.earned / section.total) * 100 : 0}%` }} /></div></div>)}</div></Card>
    <Card><h2 className="mb-4 font-medium">Question review</h2><div className="space-y-3">{assessment.questions.map((question, index) => { const entry = result.results?.find((item) => item.question_id === question._id); const earned = entry?.marks_awarded ?? (entry?.is_correct ? question.marks : 0); return <div key={question._id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><span className="text-text-muted">{index + 1}</span>{entry?.is_correct ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-red-400" />}<p className="flex-1 truncate text-sm">{question.title || question.description}</p><Badge variant="secondary">{earned}/{question.marks}</Badge></div>; })}</div></Card>
    <div className="flex flex-col gap-3 sm:flex-row"><Link className="flex-1" href="/assessments"><Button variant="outline" className="w-full"><FileQuestion className="h-4 w-4" /> All assessments</Button></Link><Link className="flex-1" href="/dashboard"><Button className="w-full"><TrendingUp className="h-4 w-4" /> Dashboard</Button></Link></div>
  </div></DashboardLayout>;
}
