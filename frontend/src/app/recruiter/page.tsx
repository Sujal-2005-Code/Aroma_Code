"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, Users, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getRecruiterCandidates, type RecruiterCandidate, updateCandidateStatus } from "@/lib/api/resources";

const statusClass: Record<RecruiterCandidate["status"], string> = { New: "bg-blue-500/10 text-blue-400", Shortlisted: "bg-amber-500/10 text-amber-400", Interview: "bg-purple-500/10 text-purple-400", Hired: "bg-emerald-500/10 text-emerald-400", Rejected: "bg-red-500/10 text-red-400" };

export default function RecruiterPage() {
  const [candidates, setCandidates] = useState<RecruiterCandidate[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { 
    getRecruiterCandidates().then((cands) => {
      const mockCandidates: RecruiterCandidate[] = cands && cands.length > 0 ? cands : [
        { id: "c1", name: "Alice Smith", email: "alice@example.com", title: "Frontend Developer", skills: ["React", "TypeScript", "Tailwind"], passport_score: 92, status: "New" },
        { id: "c2", name: "Bob Johnson", email: "bob@example.com", title: "Backend Developer", skills: ["Node.js", "Express", "MongoDB"], passport_score: 88, status: "Shortlisted" },
        { id: "c3", name: "Charlie Davis", email: "charlie@example.com", title: "Full Stack Engineer", skills: ["React", "Python", "PostgreSQL"], passport_score: 95, status: "Interview" },
        { id: "c4", name: "Diana Prince", email: "diana@example.com", title: "UI/UX Designer", skills: ["Figma", "CSS", "HTML"], passport_score: 85, status: "Hired" },
        { id: "c5", name: "Evan Wright", email: "evan@example.com", title: "Data Scientist", skills: ["Python", "Machine Learning", "SQL"], passport_score: 72, status: "Rejected" },
        { id: "c6", name: "Fiona Gallagher", email: "fiona@example.com", title: "DevOps Engineer", skills: ["Docker", "Kubernetes", "AWS"], passport_score: 89, status: "New" },
        { id: "c7", name: "George Miller", email: "george@example.com", title: "Product Manager", skills: ["Agile", "Scrum", "Jira"], passport_score: 91, status: "Shortlisted" },
      ];
      setCandidates(mockCandidates);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load candidates.")); 
  }, []);
  const visible = useMemo(() => candidates.filter((candidate) => `${candidate.name} ${candidate.title} ${candidate.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [candidates, query]);
  const setStatus = (id: string, status: RecruiterCandidate["status"]) => updateCandidateStatus(id, status).then(() => setCandidates((items) => items.map((item) => item.id === id ? { ...item, status } : item))).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not update candidate."));
  return <DashboardLayout><div className="mx-auto max-w-[1400px] space-y-6"><div><h1 className="text-2xl font-bold">Recruiter Dashboard</h1><p className="text-text-muted">Search and manage verified candidate outcomes.</p></div>{error && <Card className="text-red-400">{error}</Card>}<div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[["Candidates", candidates.length], ["Shortlisted", candidates.filter((item) => item.status === "Shortlisted").length], ["Interviews", candidates.filter((item) => item.status === "Interview").length], ["Hired", candidates.filter((item) => item.status === "Hired").length]].map(([label, value]) => <Card key={String(label)} className="flex items-center gap-3"><Users className="h-5 w-5 text-brand-orange" /><div><p className="text-xl font-bold">{value}</p><p className="text-xs text-text-muted">{label}</p></div></Card>)}</div><Card><div className="relative mb-5"><Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidates by name, role, or skills…" className="w-full rounded-xl border border-border-subtle bg-glass py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-orange/30" /></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border-subtle text-left text-xs text-text-muted"><th className="p-3">Candidate</th><th className="p-3">Role</th><th className="p-3">Skills</th><th className="p-3 text-center">Score</th><th className="p-3 text-center">Status</th><th className="p-3 text-right">Actions</th></tr></thead><tbody>{visible.map((candidate) => <tr key={candidate.id} className="border-b border-border-subtle"><td className="p-3"><p className="font-medium">{candidate.name}</p><p className="text-xs text-text-muted">{candidate.email}</p></td><td className="p-3 text-text-muted">{candidate.title}</td><td className="p-3">{candidate.skills.map((skill) => <Badge key={skill} variant="secondary" className="mr-1">{skill}</Badge>)}</td><td className="p-3 text-center font-bold">{candidate.passport_score}%</td><td className="p-3 text-center"><Badge className={statusClass[candidate.status]}>{candidate.status}</Badge></td><td className="p-3 text-right"><Button variant="ghost" size="sm" onClick={() => setStatus(candidate.id, "Shortlisted")} aria-label="Shortlist"><CheckCircle2 className="h-4 w-4 text-emerald-400" /></Button><Button variant="ghost" size="sm" onClick={() => setStatus(candidate.id, "Rejected")} aria-label="Reject"><XCircle className="h-4 w-4 text-red-400" /></Button></td></tr>)}</tbody></table>{!visible.length && <p className="p-5 text-center text-sm text-text-muted">No matching candidates.</p>}</div></Card></div></DashboardLayout>;
}
