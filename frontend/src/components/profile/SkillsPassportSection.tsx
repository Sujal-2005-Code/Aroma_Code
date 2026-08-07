"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Filter, Plus, Sparkles, Trophy, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToastContainer, type ToastMessage } from "./Toast";
import type { SkillEntry } from "@/types";

const categories = ["All", "AI", "Engineering", "Product", "Cloud", "Data", "Design", "Research"];
const sortOptions = ["Overall", "Assessment", "GitHub", "Coding", "Passport", "Resume", "Portfolio"];

const initialSkills: SkillEntry[] = [
  {
    id: "skill-1",
    category: "AI",
    name: "Machine Learning",
    verified: true,
    level: "Expert",
    endorsements: 124,
    overall: 96,
    scores: { assessment: 98, github: 92, coding: 94, passport: 96, resume: 84, portfolio: 88 },
  },
  {
    id: "skill-2",
    category: "Engineering",
    name: "TypeScript",
    verified: true,
    level: "Advanced",
    endorsements: 78,
    overall: 88,
    scores: { assessment: 84, github: 88, coding: 92, passport: 86, resume: 78, portfolio: 80 },
  },
  {
    id: "skill-3",
    category: "Product",
    name: "Roadmapping",
    verified: true,
    level: "Advanced",
    endorsements: 68,
    overall: 82,
    scores: { assessment: 78, github: 60, coding: 52, passport: 90, resume: 84, portfolio: 82 },
  },
  {
    id: "skill-4",
    category: "Cloud",
    name: "MLOps",
    verified: false,
    level: "Intermediate",
    endorsements: 42,
    overall: 74,
    scores: { assessment: 82, github: 76, coding: 70, passport: 68, resume: 72, portfolio: 74 },
  },
  {
    id: "skill-5",
    category: "Design",
    name: "UX Strategy",
    verified: false,
    level: "Intermediate",
    endorsements: 38,
    overall: 72,
    scores: { assessment: 70, github: 54, coding: 48, passport: 80, resume: 76, portfolio: 84 },
  },
  {
    id: "skill-6",
    category: "Data",
    name: "SQL",
    verified: true,
    level: "Advanced",
    endorsements: 89,
    overall: 86,
    scores: { assessment: 88, github: 80, coding: 84, passport: 86, resume: 82, portfolio: 80 },
  },
  {
    id: "skill-7",
    category: "Product",
    name: "User Research",
    verified: true,
    level: "Advanced",
    endorsements: 51,
    overall: 80,
    scores: { assessment: 77, github: 60, coding: 45, passport: 90, resume: 82, portfolio: 79 },
  },
  {
    id: "skill-8",
    category: "AI",
    name: "NLP",
    verified: true,
    level: "Expert",
    endorsements: 99,
    overall: 91,
    scores: { assessment: 96, github: 90, coding: 88, passport: 92, resume: 86, portfolio: 87 },
  },
];

const miniMetrics = [
  { label: "Assessment", value: 92, color: "from-violet-500 to-fuchsia-500", icon: "📝" },
  { label: "GitHub Activity", value: 85, color: "from-sky-500 to-cyan-500", icon: "🐙" },
  { label: "Coding Challenges", value: 88, color: "from-emerald-500 to-lime-400", icon: "💻" },
  { label: "Skill Passport", value: 94, color: "from-cyan-500 to-sky-500", icon: "🛂" },
  { label: "Resume", value: 87, color: "from-amber-500 to-orange-400", icon: "📄" },
  { label: "Portfolio", value: 81, color: "from-pink-500 to-rose-500", icon: "🖼️" },
];

export function SkillsPassportSection() {
  const [skillFilter, setSkillFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Overall");
  const [skills, setSkills] = useState<SkillEntry[]>(initialSkills);
  const [toastList, setToastList] = useState<ToastMessage[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState<Partial<SkillEntry>>({
    id: "skill-new",
    category: "AI",
    name: "",
    verified: false,
    level: "Beginner",
    endorsements: 0,
    overall: 0,
    scores: { assessment: 0, github: 0, coding: 0, passport: 0, resume: 0, portfolio: 0 },
  });

  const filteredSkills = useMemo(() => {
    const list = skillFilter === "All" ? skills : skills.filter((skill) => skill.category === skillFilter);
    if (sortBy === "Overall") return [...list].sort((a, b) => b.overall - a.overall);
    if (sortBy === "Assessment") return [...list].sort((a, b) => b.scores.assessment - a.scores.assessment);
    if (sortBy === "GitHub") return [...list].sort((a, b) => b.scores.github - a.scores.github);
    if (sortBy === "Coding") return [...list].sort((a, b) => b.scores.coding - a.scores.coding);
    if (sortBy === "Passport") return [...list].sort((a, b) => b.scores.passport - a.scores.passport);
    if (sortBy === "Resume") return [...list].sort((a, b) => b.scores.resume - a.scores.resume);
    return [...list].sort((a, b) => b.scores.portfolio - a.scores.portfolio);
  }, [skillFilter, skills, sortBy]);

  const stats = useMemo(() => {
    const total = skills.length;
    const levelSum = skills.reduce((sum, item) => sum + (item.level === "Expert" ? 4 : item.level === "Advanced" ? 3 : item.level === "Intermediate" ? 2 : 1), 0);
    const verified = skills.filter((item) => item.verified).length;
    const endorsements = skills.reduce((sum, item) => sum + item.endorsements, 0);
    return { total, average: total ? Math.round((levelSum / total) * 25) : 0, verified, endorsements };
  }, [skills]);

  const addToast = (toast: ToastMessage) => {
    setToastList((current) => [...current, toast]);
    window.setTimeout(() => setToastList((current) => current.filter((item) => item.id !== toast.id)), 4500);
  };

  const handleSaveSkill = () => {
    if (!newSkill.name?.trim()) {
      addToast({ id: `toast-${Date.now()}`, title: "Missing skill name", description: "Please provide a skill name before saving.", variant: "warning" });
      return;
    }
    const next: SkillEntry = {
      id: `skill-${Date.now()}`,
      category: newSkill.category || "AI",
      name: newSkill.name.trim(),
      verified: Boolean(newSkill.verified),
      level: newSkill.level || "Beginner",
      endorsements: newSkill.endorsements || 0,
      overall:
        Math.round(
          ((newSkill.scores?.assessment || 0) + (newSkill.scores?.github || 0) + (newSkill.scores?.coding || 0) + (newSkill.scores?.passport || 0) + (newSkill.scores?.resume || 0) + (newSkill.scores?.portfolio || 0)) / 6
        ),
      scores: {
        assessment: newSkill.scores?.assessment || 0,
        github: newSkill.scores?.github || 0,
        coding: newSkill.scores?.coding || 0,
        passport: newSkill.scores?.passport || 0,
        resume: newSkill.scores?.resume || 0,
        portfolio: newSkill.scores?.portfolio || 0,
      },
    };
    setSkills((current) => [next, ...current]);
    setModalOpen(false);
    addToast({ id: `toast-${Date.now()}`, title: "Skill added", description: "A new skill has been added to your passport.", variant: "success" });
    setNewSkill({ id: "skill-new", category: "AI", name: "", verified: false, level: "Beginner", endorsements: 0, overall: 0, scores: { assessment: 0, github: 0, coding: 0, passport: 0, resume: 0, portfolio: 0 } });
  };

  return (
    <div className="mx-auto max-w-[1120px] space-y-6 pb-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[32px] border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Skill Passport</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">AI Passport Insights</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="default" onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" /> Add Skill
              </Button>
              <Button variant="secondary">Export</Button>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">A premium summary of verified skills, endorsements, and performance metrics across your career credentials.</p>
        </Card>
        <div className="grid gap-4">
          <Card className="rounded-[32px] border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-slate-300">
              <BarChart3 className="h-5 w-5 text-brand-orange" />
              <p className="text-sm uppercase tracking-[0.3em]">Passport dashboard</p>
            </div>
            <div className="mt-6 grid gap-3">
              <MetricCard label="Total Skills" value={stats.total.toString()} color="from-violet-500 to-fuchsia-500" />
              <MetricCard label="Avg level" value={`${stats.average}%`} color="from-sky-500 to-cyan-500" />
              <MetricCard label="Verified" value={stats.verified.toString()} color="from-emerald-500 to-lime-400" />
              <MetricCard label="Endorsements" value={stats.endorsements.toString()} color="from-amber-500 to-orange-400" />
            </div>
          </Card>
        </div>
      </section>

      <Card className="rounded-[32px] border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Filters</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Browse skills</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white">
              <Filter className="h-4 w-4" />
              <select value={skillFilter} onChange={(event) => setSkillFilter(event.target.value)} className="bg-transparent text-sm outline-none">
                {categories.map((category) => (<option key={category} value={category}>{category}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white">
              <Sparkles className="h-4 w-4" />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="bg-transparent text-sm outline-none">
                {sortOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[0.6fr_0.4fr]">
        <Card className="rounded-[32px] border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {miniMetrics.map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="text-2xl">{metric.icon}</span>
                  <p>{metric.label}</p>
                </div>
                <p className="mt-4 text-3xl font-semibold text-white">{metric.value}%</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full bg-gradient-to-r ${metric.color}`} style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-[32px] border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-slate-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em]">Strength meter</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Passport readiness</h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <ProgressItem label="Assessment" value={stats.average} from="from-violet-500" to="to-fuchsia-500" />
            <ProgressItem label="GitHub" value={skills.reduce((sum, skill) => sum + skill.scores.github, 0) / Math.max(skills.length, 1)} from="from-sky-500" to="to-cyan-500" />
            <ProgressItem label="Coding" value={skills.reduce((sum, skill) => sum + skill.scores.coding, 0) / Math.max(skills.length, 1)} from="from-emerald-500" to="to-lime-400" />
          </div>
        </Card>
      </div>

      <Card className="rounded-[32px] border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold text-white">Core skills</h2>
        <div className="mt-6 grid gap-4">
          {filteredSkills.map((skill) => (
            <motion.div key={skill.id} whileHover={{ y: -3 }} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xl font-semibold text-white">{skill.name}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                    <Badge variant={skill.verified ? "success" : "secondary"}>{skill.verified ? "Verified" : "Unverified"}</Badge>
                    <Badge variant="pink">{skill.level}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-semibold text-white">{skill.overall}%</p>
                  <p className="text-sm text-slate-500">{skill.endorsements} endorsements</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {Object.entries(skill.scores).map(([label, value]) => (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-pink" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <ToastContainer toasts={toastList} onDismiss={(id) => setToastList((current) => current.filter((item) => item.id !== id))} />

      {modalOpen ? (
        <Modal onClose={() => setModalOpen(false)}>
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Add Skill</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">New skill passport entry</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Category" value={newSkill.category || "AI"} onChange={(value) => setNewSkill((prev) => ({ ...prev, category: value }))} />
              <FormInput label="Skill name" value={newSkill.name || ""} onChange={(value) => setNewSkill((prev) => ({ ...prev, name: value }))} />
              <FormInput label="Level" value={newSkill.level || "Beginner"} onChange={(value) => setNewSkill((prev) => ({ ...prev, level: value as SkillEntry["level"] }))} />
              <FormInput label="Endorsements" type="number" value={String(newSkill.endorsements ?? 0)} onChange={(value) => setNewSkill((prev) => ({ ...prev, endorsements: Number(value) }))} />
            </div>
            <div className="grid gap-4">
              {(["assessment", "github", "coding", "passport", "resume", "portfolio"] as const).map((scoreKey) => (
                <ScoreInput
                  key={scoreKey}
                  label={`${scoreKey.charAt(0).toUpperCase() + scoreKey.slice(1)} score`}
                  value={newSkill.scores?.[scoreKey] ?? 0}
                  onChange={(value) => setNewSkill((prev) => ({ ...prev, scores: { ...(prev.scores ?? { assessment: 0, github: 0, coding: 0, passport: 0, resume: 0, portfolio: 0 }), [scoreKey]: value } }))}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="default" onClick={handleSaveSkill}>
                Save skill
              </Button>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: value.replace("%", "") + "%" }} />
      </div>
    </div>
  );
}

function ProgressItem({ label, value, from, to }: { label: string; value: number; from: string; to: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${from} ${to}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function FormInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-orange/40 focus:ring-2 focus:ring-brand-orange/10"
      />
    </div>
  );
}

function ScoreInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
        <span>{label}</span>
        <span className="text-sm text-white">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-brand-orange"
      />
    </div>
  );
}
