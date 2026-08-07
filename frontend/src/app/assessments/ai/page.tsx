"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, BrainCircuit } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateAIAssessment, submitAIAssessment } from "@/lib/api/assessments";

export default function AIAssessmentPage() {
  const router = useRouter();
  const [skill, setSkill] = useState("Python");
  const [topic, setTopic] = useState("Functions");
  const [level, setLevel] = useState("Intermediate");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<Array<{ id: number; question: string; options: string[]; topic?: string; difficulty?: string }>>([]);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [selectedLabels, setSelectedLabels] = useState<Record<number, string | null>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  const canSubmit = questions.length > 0 && Object.keys(answers).length >= questions.length;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateAIAssessment({ skill, topic, level, assessment_type: "Technical", num_questions: numQuestions });
      setAssessmentId(response.assessment_id);
      setQuestions(response.questions);
      setAnswers({});
      setSelectedLabels({});
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to generate an AI assessment right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!assessmentId) return;
    setLoading(true);
    setError(null);
    try {
      const payload = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId: Number(questionId),
        selectedAnswer: selectedAnswer ?? selectedLabels[Number(questionId)] ?? null,
      }));
      const result = await submitAIAssessment(assessmentId, payload);
      router.push(`/assessments/${assessmentId}/results?ai=1`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to submit the assessment.");
    } finally {
      setLoading(false);
    }
  };

  const progressText = useMemo(() => {
    if (!questions.length) return "No questions generated yet.";
    return `${Object.keys(answers).length}/${questions.length} answered`;
  }, [answers, questions.length]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-orange">
              <BrainCircuit className="h-5 w-5" />
              <span className="text-sm font-medium">AI-powered assessment</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-text-primary">Generate a personalized assessment with Groq</h1>
            <p className="mt-2 text-sm text-text-muted">Choose the topic and skill level to generate a fresh assessment, answer it, and receive AI feedback with recommendations.</p>
          </div>
          <Badge className="w-fit bg-brand-orange/10 text-brand-orange">Groq-powered</Badge>
        </div>

        <Card className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <label className="block text-sm text-text-muted">
              <span className="mb-1 block text-text-primary">Skill</span>
              <input value={skill} onChange={(event) => setSkill(event.target.value)} className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-2" />
            </label>
            <label className="block text-sm text-text-muted">
              <span className="mb-1 block text-text-primary">Topic</span>
              <input value={topic} onChange={(event) => setTopic(event.target.value)} className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-2" />
            </label>
            <label className="block text-sm text-text-muted">
              <span className="mb-1 block text-text-primary">Level</span>
              <select value={level} onChange={(event) => setLevel(event.target.value)} className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-2">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </label>
            <label className="block text-sm text-text-muted">
              <span className="mb-1 block text-text-primary">Number of questions</span>
              <input type="number" min={3} max={10} value={numQuestions} onChange={(event) => setNumQuestions(Number(event.target.value))} className="w-full rounded-xl border border-border-subtle bg-bg-primary px-3 py-2" />
            </label>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" /> {loading ? "Generating…" : "Generate AI assessment"}
            </Button>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-text-primary">What this workflow does</h2>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              <li>• Uses your selected skill and topic as context for Groq.</li>
              <li>• Generates structured questions without exposing the correct answers.</li>
              <li>• Evaluates your results with AI-generated strengths, weak areas, and recommendations.</li>
            </ul>
            <div className="mt-5 rounded-xl border border-brand-orange/20 bg-brand-orange/10 p-4 text-sm text-text-primary">
              <p className="font-medium">Current progress</p>
              <p className="mt-1 text-text-muted">{progressText}</p>
            </div>
          </div>
        </Card>

        {error && <Card className="border-red-500/30 bg-red-500/10 text-sm text-red-400">{error}</Card>}

        {questions.length > 0 && (
          <Card className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Assessment questions</h2>
                <p className="text-sm text-text-muted">Pick the best answer for each question and submit when you are ready.</p>
              </div>
              <Badge variant="secondary">{questions.length} questions</Badge>
            </div>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="rounded-2xl border border-border-subtle bg-white/5 p-4">
                  <p className="text-sm font-medium text-text-primary">{index + 1}. {question.question}</p>
                  <div className="mt-3 space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const selected = answers[question.id] === option;
                      const label = String.fromCharCode(65 + optionIndex);
                      return (
                        <button key={`${question.id}-${optionIndex}`} onClick={() => {
                          setAnswers((current) => ({ ...current, [question.id]: option }));
                          setSelectedLabels((current) => ({ ...current, [question.id]: label }));
                        }} className={`flex w-full items-start rounded-xl border px-3 py-2 text-left text-sm ${selected ? "border-brand-orange/50 bg-brand-orange/10 text-text-primary" : "border-border-subtle bg-bg-primary text-text-muted"}`}>
                          <span className={`mr-2 mt-0.5 h-4 w-4 rounded-full border ${selected ? "border-brand-orange bg-brand-orange" : "border-border-subtle"}`} />
                          {label}. {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
              <p className="text-sm text-text-muted">Your answers are saved locally while you work through the assessment.</p>
              <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
                <ArrowRight className="mr-2 h-4 w-4" /> {loading ? "Submitting…" : "Submit AI assessment"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
