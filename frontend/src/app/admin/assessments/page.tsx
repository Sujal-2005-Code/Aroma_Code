"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Search, Edit2, Trash2, ClipboardList, Play,
  Eye, Calendar, Clock, Users, CheckCircle2, X, Save, Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createAssessment, deleteAssessment, getAssessments } from "@/lib/api/assessments";
import type { ApiAssessment } from "@/lib/api/types";
import { currentUser } from "@/lib/auth";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  expired: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AssessmentManagementPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", duration: "60", cutoff: "70", description: "" });
  const [assessments, setAssessments] = useState<ApiAssessment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = currentUser();
    if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    getAssessments().then(setAssessments).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load assessments."));
  }, [router]);
  const displayAssessments = assessments.map((assessment) => ({ id: assessment._id, title: assessment.title, company: assessment.topic, duration: assessment.duration, totalQuestions: assessment.question_ids.length, cutoff: assessment.passing_marks, endDate: "Not scheduled", status: "active" }));
  const saveAssessment = () => {
    if (!form.title.trim()) { setError("A title is required."); return; }
    createAssessment({ title: form.title, description: form.description || null, topic: form.company || "General", duration: Number(form.duration), total_marks: 0, passing_marks: Number(form.cutoff), question_ids: [] })
      .then(({ id }) => { setAssessments((items) => [...items, { _id: id, title: form.title, description: form.description, topic: form.company || "General", duration: Number(form.duration), total_marks: 0, passing_marks: Number(form.cutoff), question_ids: [] }]); setShowCreateModal(false); setForm({ title: "", company: "", duration: "60", cutoff: "70", description: "" }); })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not create assessment."));
  };

  const filtered = displayAssessments.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Assessment Management</h1>
            <p className="text-text-muted">Create, configure, and manage assessment sessions.</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" /> Create Assessment
          </Button>
        </motion.div>

        {/* Overview Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: displayAssessments.length, color: "text-blue-400" },
            { label: "Active", value: displayAssessments.filter(a => a.status === "active").length, color: "text-emerald-400" },
            { label: "Upcoming", value: 0, color: "text-amber-400" },
            { label: "Completed", value: 0, color: "text-gray-400" },
          ].map((s, i) => (
            <Card key={i} className="text-center !p-4">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-text-muted mt-1">{s.label}</p>
            </Card>
          ))}
        </motion.div>
        {error && <Card className="text-red-400">{error}</Card>}

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30"
              />
            </div>
          </Card>
        </motion.div>

        {/* Assessment Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-muted">Assessment</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-text-muted hidden md:table-cell">Company</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-text-muted">Duration</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-text-muted">Questions</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-text-muted">Status</th>
                    <th className="text-right py-3 px-5 text-xs font-medium text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-border-subtle hover:bg-glass transition-colors">
                      <td className="py-4 px-5">
                        <p className="text-sm font-medium text-text-primary">{a.title}</p>
                        <p className="text-xs text-text-muted">Cutoff: {a.cutoff}% | Ends: {a.endDate}</p>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="flex items-center gap-1.5 text-text-muted text-xs">
                          <Building2 className="w-3.5 h-3.5" />
                          {a.company || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-text-muted">
                        <span className="flex items-center gap-1 justify-center">
                          <Clock className="w-3 h-3" />{a.duration}m
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-sm font-medium text-text-primary">{a.totalQuestions}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize", statusColors[a.status])}>{a.status}</span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm" aria-label="View results"><Eye className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" aria-label="Edit"><Edit2 className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" aria-label="Delete" onClick={() => deleteAssessment(a.id).then(() => setAssessments((items) => items.filter((item) => item._id !== a.id))).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not delete assessment."))}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-lg">
              <Card className="gradient-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-text-primary">Create Assessment</h3>
                  <button onClick={() => setShowCreateModal(false)} aria-label="Close"><X className="w-5 h-5 text-text-muted hover:text-text-primary" /></button>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Title", key: "title" as const, placeholder: "Frontend Engineering Test" },
                    { label: "Company", key: "company" as const, placeholder: "Vercel" },
                    { label: "Duration (minutes)", key: "duration" as const, placeholder: "90", type: "number" },
                    { label: "Pass Cutoff (%)", key: "cutoff" as const, placeholder: "70", type: "number" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs text-text-muted mb-1.5 block">{field.label}</label>
                      <input
                        type={field.type || "text"}
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full bg-glass border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-text-muted mb-1.5 block">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full bg-glass border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30 resize-none"
                      placeholder="Describe the assessment..."
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button className="flex-1" onClick={saveAssessment}><Save className="w-4 h-4" /> Create</Button>
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
