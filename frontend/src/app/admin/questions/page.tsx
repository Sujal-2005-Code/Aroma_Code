"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Search, Edit2, Trash2, FileQuestion, Code2, CheckSquare,
  Circle, Filter, Eye, Copy, ChevronDown, X, Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createQuestion, deleteQuestion, getQuestions } from "@/lib/api/questions";
import type { ApiQuestion } from "@/lib/api/types";
import { currentUser } from "@/lib/auth";

const typeLabels = { mcq: "MCQ", msq: "MSQ", coding: "Coding" };
const typeColors = {
  mcq: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  msq: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  coding: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
};

const typeIcons = { mcq: Circle, msq: CheckSquare, coding: Code2 };

export default function QuestionManagementPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<"mcq" | "msq" | "coding">("mcq");
  const [newQuestion, setNewQuestion] = useState({ question: "", options: ["", "", "", ""], correct: [] as number[], marks: 2 });
  const [storedQuestions, setStoredQuestions] = useState<ApiQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = currentUser();
    if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    getQuestions().then(setStoredQuestions).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load questions."));
  }, [router]);
  const saveQuestion = () => {
    if (!newQuestion.question.trim()) { setError("Question text is required."); return; }
    const options = selectedType === "coding" ? [] : newQuestion.options.filter(Boolean);
    const payload = { title: newQuestion.question, description: newQuestion.question, topic: "General", difficulty: "medium", question_type: selectedType, marks: newQuestion.marks, tags: [], options, correct_answer: selectedType === "mcq" ? options[newQuestion.correct[0]] || null : null, correct_answers: selectedType === "msq" ? newQuestion.correct.map((index) => options[index]).filter(Boolean) : [], explanation: null, starter_code: selectedType === "coding" ? "" : null, supported_languages: ["python", "cpp", "java"], time_limit: 1, memory_limit: 256, sample_test_cases: [], hidden_test_cases: [] };
    createQuestion(payload).then(({ id }) => { setStoredQuestions((items) => [...items, { ...payload, _id: id }]); setShowAddModal(false); setNewQuestion({ question: "", options: ["", "", "", ""], correct: [], marks: 2 }); }).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not create question."));
  };

  const questions = storedQuestions.map((question) => ({ id: question._id, type: (question.question_type || "mcq") as "mcq" | "msq" | "coding", question: question.description || question.title, options: question.options, marks: question.marks })).filter((q) => {
    if (filter !== "all" && q.type !== filter) return false;
    return q.question.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Question Management</h1>
            <p className="text-text-muted">Create, edit, and manage assessment questions.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" /> Add Question
          </Button>
        </motion.div>
        {error && <Card className="text-red-400">{error}</Card>}

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Questions", value: questions.length, icon: FileQuestion, color: "text-blue-400" },
            { label: "MCQ", value: questions.filter((question) => question.type === "mcq").length, icon: Circle, color: "text-emerald-400" },
            { label: "MSQ", value: questions.filter((question) => question.type === "msq").length, icon: CheckSquare, color: "text-purple-400" },
            { label: "Coding", value: questions.filter((question) => question.type === "coding").length, icon: Code2, color: "text-brand-orange" },
          ].map((stat, i) => (
            <Card key={i} className="flex items-center gap-3 !p-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30"
              />
            </div>
            <div className="flex gap-1 glass-card rounded-xl p-1">
              {["all", "mcq", "msq", "coding"].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                  filter === f ? "bg-brand-orange/10 text-brand-orange" : "text-text-muted hover:text-text-primary"
                )}>{f === "all" ? "All" : f.toUpperCase()}</button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Question List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-muted">#</th>
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-muted">Question</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-text-muted">Type</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-text-muted">Marks</th>
                    <th className="text-right py-3 px-5 text-xs font-medium text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, i) => {
                    const Icon = typeIcons[q.type];
                    return (
                      <motion.tr
                        key={q.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-border-subtle hover:bg-glass transition-colors"
                      >
                        <td className="py-4 px-5 text-text-muted text-xs">{i + 1}</td>
                        <td className="py-4 px-5">
                          <p className="text-sm text-text-primary line-clamp-2 max-w-lg">{q.question}</p>
                          {q.type !== "coding" && (
                            <p className="text-xs text-text-muted mt-1">{q.options?.length} options</p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border", typeColors[q.type])}>
                            <Icon className="w-3 h-3" />
                            {typeLabels[q.type]}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-sm font-medium text-text-primary">{q.marks}</td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm" aria-label="View"><Eye className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="sm" aria-label="Copy"><Copy className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="sm" aria-label="Edit"><Edit2 className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="sm" aria-label="Delete" onClick={() => deleteQuestion(q.id).then(() => setStoredQuestions((items) => items.filter((item) => item._id !== q.id))).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not delete question."))}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Add Question Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <Card className="gradient-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-text-primary">Add New Question</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary" aria-label="Close"><X className="w-5 h-5" /></button>
                </div>

                {/* Type Selector */}
                <div className="flex gap-2 mb-5">
                  {(["mcq", "msq", "coding"] as const).map((type) => {
                    const Icon = typeIcons[type];
                    return (
                      <button key={type} onClick={() => setSelectedType(type)} className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all",
                        selectedType === type ? typeColors[type] : "glass-card text-text-muted"
                      )}>
                        <Icon className="w-4 h-4" /> {typeLabels[type]}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-text-muted mb-1.5 block">Question Text</label>
                    <textarea
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      rows={3}
                      className="w-full bg-glass border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30 resize-none"
                      placeholder="Enter your question here..."
                    />
                  </div>

                  {(selectedType === "mcq" || selectedType === "msq") && (
                    <div>
                      <label className="text-xs text-text-muted mb-1.5 block">Options {selectedType === "msq" && "(multiple correct)"}</label>
                      <div className="space-y-2">
                        {newQuestion.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (selectedType === "mcq") {
                                  setNewQuestion({ ...newQuestion, correct: [i] });
                                } else {
                                  const newCorrect = newQuestion.correct.includes(i) ? newQuestion.correct.filter(c => c !== i) : [...newQuestion.correct, i];
                                  setNewQuestion({ ...newQuestion, correct: newCorrect });
                                }
                              }}
                              className={cn(
                                "w-5 h-5 flex-shrink-0 border-2 transition-all",
                                selectedType === "mcq" ? "rounded-full" : "rounded-md",
                                newQuestion.correct.includes(i) ? "border-emerald-400 bg-emerald-400" : "border-text-muted"
                              )}
                              aria-label={`Option ${i + 1} correct`}
                            />
                            <input
                              value={opt}
                              onChange={(e) => {
                                const opts = [...newQuestion.options];
                                opts[i] = e.target.value;
                                setNewQuestion({ ...newQuestion, options: opts });
                              }}
                              className="flex-1 bg-glass border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-brand-orange/30"
                              placeholder={`Option ${i + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedType === "coding" && (
                    <div>
                      <label className="text-xs text-text-muted mb-1.5 block">Starter Code</label>
                      <textarea
                        rows={5}
                        className="w-full bg-bg-primary border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary font-mono focus:outline-none focus:border-brand-orange/30 resize-none"
                        placeholder="function solution() {&#10;  // Write your solution here&#10;}"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-text-muted mb-1.5 block">Marks</label>
                    <input
                      type="number"
                      value={newQuestion.marks}
                      onChange={(e) => setNewQuestion({ ...newQuestion, marks: Number(e.target.value) })}
                      className="w-32 bg-glass border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-orange/30"
                      min={1}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button className="flex-1" onClick={saveQuestion}>
                      <Save className="w-4 h-4" /> Save Question
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
