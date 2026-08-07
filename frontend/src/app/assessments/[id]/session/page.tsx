"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, ChevronLeft, ChevronRight, Clock, Flag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiError } from "@/lib/api/client";
import { autosaveAnswer, getSavedAnswers, getStudentAssessment, startAssessment, submitAssessment } from "@/lib/api/assessments";
import type { AssessmentSession, StudentAssessment, SubmissionAnswer } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type Status = "unattempted" | "answered" | "marked" | "answered-marked";

export default function AssessmentSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [assessment, setAssessment] = useState<StudentAssessment | null>(null);
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, SubmissionAnswer>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const started = await startAssessment(id);
        const [data, saved] = await Promise.all([getStudentAssessment(id), getSavedAnswers(id)]);
        if (!mounted) return;
        setAssessment(data);
        setSession(started);
        setAnswers(saved.answers);
        setSeconds(Math.max(0, Math.floor((new Date(started.expires_at).getTime() - Date.now()) / 1000)));
      } catch (cause) {
        if (mounted) setError(cause instanceof Error ? cause.message : "Could not start this assessment.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    if (!session || seconds <= 0) return;
    const interval = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [session, seconds]);

  const question = assessment?.questions[index];
  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const statusFor = useCallback((questionId: string): Status => {
    const answer = answers[questionId];
    const answered = Array.isArray(answer) ? answer.length > 0 : typeof answer === "object" && answer !== null ? Boolean((answer as { source_code: string }).source_code.trim()) : Boolean(answer?.trim());
    return marked.has(questionId) ? answered ? "answered-marked" : "marked" : answered ? "answered" : "unattempted";
  }, [answers, marked]);
  const answeredCount = useMemo(() => assessment?.questions.filter((item) => statusFor(item._id).startsWith("answered")).length ?? 0, [assessment, statusFor]);

  const save = (questionId: string, answer: SubmissionAnswer) => {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
    autosaveAnswer(id, questionId, answer).catch(() => undefined);
  };
  const toggleMark = () => question && setMarked((current) => {
    const next = new Set(current);
    next.has(question._id) ? next.delete(question._id) : next.add(question._id);
    return next;
  });
  const submit = async () => {
    if (!session) return;
    setSubmitting(true);
    try {
      await submitAssessment({ assessment_id: id, session_id: session.session_id, answers });
      router.replace(`/assessments/${id}/results`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Submission failed. Please try again.");
      setConfirming(false);
    } finally { setSubmitting(false); }
  };

  if (loading) return <main className="min-h-screen grid place-items-center text-text-muted">Preparing your assessment…</main>;
  if (error && !assessment) return <main className="min-h-screen grid place-items-center p-6 text-center text-red-400">{error}</main>;
  if (!assessment || !question) return <main className="min-h-screen grid place-items-center text-text-muted">No questions are available for this assessment.</main>;

  return <div className="min-h-screen bg-bg-primary text-text-primary">
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border-subtle bg-bg-primary/95 px-4 py-3 backdrop-blur">
      <div><p className="font-medium">{assessment.title}</p><p className="text-xs text-text-muted">Question {index + 1} of {assessment.questions.length}</p></div>
      <div className={cn("flex items-center gap-2 rounded-lg px-3 py-2 font-mono font-bold", seconds < 300 ? "bg-red-500/15 text-red-400" : "bg-white/5")}><Clock className="h-4 w-4" />{formattedTime}</div>
      <Button size="sm" variant="destructive" onClick={() => setConfirming(true)}><Send className="h-4 w-4" /> Submit</Button>
    </header>
    <div className="mx-auto grid max-w-6xl gap-6 p-4 lg:grid-cols-[1fr_250px] lg:p-6">
      <main className="space-y-5">
        <div className="glass-card rounded-2xl p-5"><div className="mb-4 flex gap-2"><Badge>{(question.question_type || "mcq").toUpperCase()}</Badge><Badge variant="secondary">{question.marks} marks</Badge></div><h1 className="whitespace-pre-wrap text-base leading-7">{question.description || question.title}</h1></div>
        {(question.question_type === "mcq" || question.question_type === "msq") && <div className="space-y-3">{question.options.map((option) => {
          const selected = Array.isArray(answers[question._id]) ? (answers[question._id] as string[]).includes(option) : answers[question._id] === option;
          return <button key={option} onClick={() => {
            if (question.question_type === "mcq") save(question._id, option);
            else { const current = Array.isArray(answers[question._id]) ? answers[question._id] as string[] : []; save(question._id, current.includes(option) ? current.filter((value) => value !== option) : [...current, option]); }
          }} className={cn("flex w-full items-center gap-3 rounded-xl border p-4 text-left", selected ? "border-brand-orange/50 bg-brand-orange/10" : "border-border-subtle hover:bg-white/5")}><span className={cn("grid h-5 w-5 place-items-center border", question.question_type === "mcq" ? "rounded-full" : "rounded", selected && "border-brand-orange bg-brand-orange")}>{selected && <CheckSquare className="h-3.5 w-3.5" />}</span>{option}</button>;
        })}</div>}
        {question.question_type === "coding" && <div className="space-y-3"><textarea value={typeof answers[question._id] === "object" && !Array.isArray(answers[question._id]) && answers[question._id] !== null ? (answers[question._id] as { source_code: string }).source_code : question.starter_code || ""} onChange={(event) => save(question._id, { language: question.supported_languages?.[0] || "python", source_code: event.target.value })} className="h-80 w-full rounded-xl border border-border-subtle bg-[#0d1117] p-4 font-mono text-sm outline-none focus:border-brand-orange/50" spellCheck={false} /><div className="grid gap-3 sm:grid-cols-2">{question.sample_test_cases?.map((test, testIndex) => <div key={testIndex} className="glass-card rounded-xl p-3 text-xs"><p className="text-text-muted">Input</p><pre className="mt-1 whitespace-pre-wrap text-brand-orange">{test.input}</pre><p className="mt-3 text-text-muted">Expected output</p><pre className="mt-1 whitespace-pre-wrap text-emerald-400">{test.output}</pre></div>)}</div></div>}
        <div className="flex justify-between border-t border-border-subtle pt-5"><Button variant="outline" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}><ChevronLeft className="h-4 w-4" /> Previous</Button><div className="flex gap-2"><Button variant="outline" onClick={toggleMark}><Flag className="h-4 w-4" /> {marked.has(question._id) ? "Unmark" : "Mark"}</Button><Button onClick={() => setIndex((value) => Math.min(assessment.questions.length - 1, value + 1))} disabled={index === assessment.questions.length - 1}>Next <ChevronRight className="h-4 w-4" /></Button></div></div>
      </main>
      <aside className="glass-card h-fit rounded-2xl p-4"><div className="mb-4 flex justify-between text-sm"><span>Palette</span><span className="text-text-muted">{answeredCount} answered</span></div><div className="grid grid-cols-5 gap-2">{assessment.questions.map((item, itemIndex) => <button key={item._id} onClick={() => setIndex(itemIndex)} className={cn("rounded-lg p-2 text-xs", index === itemIndex && "ring-1 ring-brand-orange", statusFor(item._id) === "answered" && "bg-emerald-500/20 text-emerald-400", statusFor(item._id) === "marked" && "bg-amber-500/20 text-amber-400", statusFor(item._id) === "answered-marked" && "bg-purple-500/20 text-purple-400", statusFor(item._id) === "unattempted" && "bg-white/5 text-text-muted")}>{itemIndex + 1}</button>)}</div></aside>
    </div>
    {confirming && <div className="fixed inset-0 z-30 grid place-items-center bg-black/70 p-4"><div className="glass-card max-w-md rounded-2xl p-6"><h2 className="text-lg font-semibold">Submit assessment?</h2><p className="mt-2 text-sm text-text-muted">You have answered {answeredCount} of {assessment.questions.length} questions. This action cannot be undone.</p>{error && <p className="mt-3 text-sm text-red-400">{error}</p>}<div className="mt-5 flex justify-end gap-3"><Button variant="outline" onClick={() => setConfirming(false)} disabled={submitting}>Continue working</Button><Button variant="destructive" onClick={submit} disabled={submitting}>{submitting ? "Submitting…" : "Submit now"}</Button></div></div></div>}
  </div>;
}
