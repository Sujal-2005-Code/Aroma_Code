"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileQuestion, TrendingUp, XCircle, Sparkles, Star } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAIAssessmentResult, getAssessmentResult, getStudentAssessment } from "@/lib/api/assessments";
import type { StudentAssessment } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [result, setResult] = useState<any>(null);
  const [assessment, setAssessment] = useState<StudentAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAi = window.location.search.includes("ai=1");
    const loader = isAi ? getAIAssessmentResult(id) : getAssessmentResult(id);
    const assessmentLoader = isAi ? Promise.resolve(null) : getStudentAssessment(id);
    Promise.all([loader, assessmentLoader])
      .then(([savedResult, savedAssessment]) => {
        setResult(savedResult);
        setAssessment(savedAssessment as StudentAssessment | null);
      })
      .catch((cause) => {
        if (cause instanceof Error && cause.message === "Not authenticated") {
          return;
        }
        setError(cause instanceof Error ? cause.message : "Could not load your result.");
      });
  }, [id]);

  const sections = useMemo(() => {
    if (!result || !assessment) return [];
    return (["mcq", "msq", "coding"] as const).map((type) => {
      const questionIds = new Set(assessment.questions.filter((question) => question.question_type === type).map((question) => question._id));
      const entries = (result.results || []).filter((entry: { question_id?: string | number; marks_awarded?: number; is_correct?: boolean; marks?: number }) => questionIds.has(entry.question_id as never)) || [];
      return { type, earned: entries.reduce((sum: number, entry: { marks_awarded?: number; is_correct?: boolean; marks?: number }) => sum + (entry.marks_awarded ?? ((entry.is_correct ? entry.marks : 0) ?? 0)), 0), total: entries.reduce((sum: number, entry: { marks?: number }) => sum + (entry.marks ?? 0), 0) };
    });
  }, [assessment, result]);

  if (error) return <DashboardLayout><Card className="mx-auto max-w-5xl text-center text-red-400">{error}</Card></DashboardLayout>;
  if (!result) return <DashboardLayout><Card className="mx-auto max-w-5xl text-center text-text-muted">Loading result…</Card></DashboardLayout>;

  const isAiResult = Boolean(result?.questionAnalysis || result?.strengths);
  const passed = (result?.percentage ?? 0) >= 60;
  return <DashboardLayout><div className="mx-auto max-w-5xl space-y-6">
    <Card className={cn("relative overflow-hidden text-center", passed ? "border-emerald-500/30" : "border-red-500/30")}>
      {passed ? <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" /> : <XCircle className="mx-auto h-14 w-14 text-red-400" />}
      <h1 className={cn("mt-3 text-3xl font-bold", passed ? "text-emerald-400" : "text-red-400")}>{passed ? "Assessment passed" : "Assessment not passed"}</h1>
      <p className="mt-2 text-text-muted">{assessment?.title || "AI generated assessment"}</p>
      <Badge className={cn("mt-4 text-base", passed ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>{result.performanceLevel || (passed ? "Good" : "Needs Improvement")} · {result.percentage ?? 0}%</Badge>
    </Card>

    {isAiResult ? <>
      <div className="grid gap-4 md:grid-cols-4">{[
        ["Score", `${result.score ?? 0}/${result.totalQuestions ?? 0}`], ["Percentage", `${result.percentage ?? 0}%`], ["Correct", `${result.score ?? 0}`], ["Incorrect", `${(result.totalQuestions ?? 0) - (result.score ?? 0)}`],
      ].map(([label, value]) => <Card key={label} className="text-center"><p className="text-xs text-text-muted">{label}</p><p className="mt-2 text-2xl font-bold text-text-primary">{value}</p></Card>)}</div>

      <Card>
        <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-orange" /><h2 className="font-medium">Performance summary</h2></div>
        <p className="mt-3 text-sm leading-7 text-text-muted">{result.summary || "Your performance has been summarized by the AI mentor."}</p>
      </Card>

      <Card>
        <h2 className="mb-4 font-medium">Your strengths</h2>
        <div className="flex flex-wrap gap-2">{(result.strengths || []).map((item: { topic: string; performance: number }) => <Badge key={item.topic} className="bg-emerald-500/10 text-emerald-400">{item.topic} · {item.performance}%</Badge>)}</div>
      </Card>

      <Card>
        <h2 className="mb-4 font-medium">Areas to improve</h2>
        <div className="space-y-3">{(result.weakAreas || []).map((item: { topic: string; performance: number; reason: string }) => <div key={item.topic} className="rounded-xl border border-border-subtle bg-white/5 p-3"><div className="flex items-center justify-between"><p className="font-medium text-text-primary">{item.topic}</p><Badge variant="secondary">{item.performance}%</Badge></div><p className="mt-2 text-sm text-text-muted">{item.reason}</p></div>)}</div>
      </Card>

      <Card>
        <h2 className="mb-4 font-medium">Question analysis</h2>
        <div className="space-y-4">{(result.questionAnalysis || []).map((item: any, index: number) => <div key={item.questionId ?? index} className="rounded-2xl border border-border-subtle bg-white/5 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-text-primary">{index + 1}. {item.question}</p>{item.isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-red-400" />}</div><div className="mt-3 space-y-2 text-sm text-text-muted"><p><span className="font-medium text-text-primary">Your answer:</span> {item.userAnswer || "Not answered"}</p><p><span className="font-medium text-text-primary">Correct answer:</span> {item.correctAnswer}</p><p><span className="font-medium text-text-primary">Topic:</span> {item.topic}</p><p><span className="font-medium text-text-primary">Explanation:</span> {item.explanation}</p></div></div>)}</div>
      </Card>

      <Card>
        <h2 className="mb-4 font-medium">Learning recommendations</h2>
        <div className="flex flex-wrap gap-2">{(result.learningRecommendations || []).map((item: string) => <Badge key={item} className="bg-brand-orange/10 text-brand-orange">{item}</Badge>)}</div>
      </Card>

      <Card>
        <h2 className="mb-4 font-medium">Personalized plan</h2>
        <div className="space-y-3">{(result.improvementPlan || []).map((item: { topic: string; priority: string; action: string }) => <div key={item.topic} className="rounded-xl border border-border-subtle bg-white/5 p-3"><div className="flex items-center justify-between"><p className="font-medium text-text-primary">{item.topic}</p><Badge variant="secondary">{item.priority}</Badge></div><p className="mt-2 text-sm text-text-muted">{item.action}</p></div>)}</div>
      </Card>

      <Card>
        <h2 className="mb-4 font-medium">AI feedback</h2>
        <p className="text-sm leading-7 text-text-muted">{result.aiFeedback || "Keep practicing and you will continue to improve."}</p>
      </Card>

      <Card>
        <div className="flex items-center gap-2"><Star className="h-4 w-4 text-brand-orange" /><h2 className="font-medium">Motivation</h2></div>
        <p className="mt-3 text-sm leading-7 text-text-muted">“{result.motivationalQuote || "Every attempt makes you stronger."}”</p>
      </Card>
    </> : <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[
        ["Score", `${result.score}/${result.total_marks}`], ["Percentage", `${result.percentage}%`], ["Correct", `${result.correct_count}`], ["Incorrect", `${result.wrong_count}`],
      ].map(([label, value]) => <Card key={label} className="text-center"><p className="text-xs text-text-muted">{label}</p><p className="mt-2 text-2xl font-bold text-text-primary">{value}</p></Card>)}</div>
      <Card><h2 className="mb-4 font-medium">Performance by question type</h2><div className="space-y-5">{sections.map((section) => <div key={section.type}><div className="mb-2 flex justify-between text-sm"><span className="uppercase text-text-muted">{section.type}</span><span>{section.earned}/{section.total}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-brand-orange" style={{ width: `${section.total ? (section.earned / section.total) * 100 : 0}%` }} /></div></div>)}</div></Card>
      <Card><h2 className="mb-4 font-medium">Question review</h2><div className="space-y-3">{assessment?.questions.map((question, index) => { const entry = result.results?.find((item: { question_id?: string | number }) => item.question_id === question._id); const earned = entry?.marks_awarded ?? (entry?.is_correct ? question.marks : 0); return <div key={question._id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><span className="text-text-muted">{index + 1}</span>{entry?.is_correct ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-red-400" />}<p className="flex-1 truncate text-sm">{question.title || question.description}</p><Badge variant="secondary">{earned}/{question.marks}</Badge></div>; })}</div></Card>
    </>}

    <div className="flex flex-col gap-3 sm:flex-row"><Link className="flex-1" href="/assessments"><Button variant="outline" className="w-full"><FileQuestion className="h-4 w-4" /> All assessments</Button></Link><Link className="flex-1" href="/dashboard"><Button className="w-full"><TrendingUp className="h-4 w-4" /> Dashboard</Button></Link></div>
  </div></DashboardLayout>;
}
