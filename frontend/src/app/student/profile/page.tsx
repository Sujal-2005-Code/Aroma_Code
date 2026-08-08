"use client";

import { useEffect, useState } from "react";
import { Award, CheckCircle2, FileText, Mail } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { getProfile } from "@/lib/api";
import { getPassport, getStudentResults, type PassportData } from "@/lib/api/resources";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);
  const [passport, setPassport] = useState<PassportData | null>(null);
  const [results, setResults] = useState<Array<{ assessment_id: string; percentage: number; result: string; submitted_at?: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { Promise.all([getProfile(), getPassport(), getStudentResults()]).then(([user, pass, items]) => { setProfile(user); setPassport(pass); setResults(items); }).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load profile.")); }, []);
  if (!profile || !passport) return <DashboardLayout><Card className={error ? "text-red-400" : "text-text-muted"}>{error || "Loading profile…"}</Card></DashboardLayout>;
  const initials = profile.full_name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  return <DashboardLayout><div className="mx-auto max-w-[1100px] space-y-6"><h1 className="text-2xl font-bold">My Profile</h1><div className="grid gap-6 lg:grid-cols-3"><div className="space-y-6"><Card className="text-center"><div className="gradient-bg mx-auto grid h-24 w-24 place-items-center rounded-2xl text-3xl font-bold text-white">{initials}</div><h2 className="mt-4 text-xl font-bold">{profile.full_name}</h2><p className="mt-1 flex items-center justify-center gap-1 text-sm text-text-muted"><Mail className="h-3.5 w-3.5" />{profile.email}</p><div className="mt-4"><Badge variant={passport.verified ? "success" : "secondary"}>{passport.verified ? "Assessment verified" : "Unverified"}</Badge></div></Card><Card><h3 className="mb-3 font-medium">Assessment summary</h3><div className="space-y-2 text-sm"><p className="flex justify-between"><span className="text-text-muted">Completed</span><span>{passport.assessment_count}</span></p><p className="flex justify-between"><span className="text-text-muted">Average score</span><span>{passport.average_score}%</span></p></div></Card></div><div className="space-y-6 lg:col-span-2"><Card><h3 className="mb-4 font-medium">Skill scores</h3><div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{[{ label: "Passport", value: passport.passport_score }, ...passport.skills.map((skill) => ({ label: skill.skill, value: skill.value }))].map((score) => <div key={score.label} className="text-center"><ScoreRing score={score.value} label={score.label} size={70} /></div>)}</div></Card><Card><h3 className="mb-4 font-medium">Assessment performance</h3>{results.length ? <div className="space-y-3">{results.slice(0, 5).map((result) => <div key={`${result.assessment_id}-${result.submitted_at}`} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"><FileText className="h-4 w-4 text-brand-orange" /><div className="flex-1"><p className="text-sm">Assessment {result.assessment_id}</p><p className="text-xs text-text-muted">{result.submitted_at ? new Date(result.submitted_at).toLocaleDateString() : "Completed"}</p></div><span className={result.result === "PASS" ? "font-bold text-emerald-400" : "font-bold text-red-400"}>{result.percentage}%</span></div>)}</div> : <p className="text-sm text-text-muted">No assessments completed yet.</p>}</Card><Card><h3 className="mb-3 font-medium">Certificates</h3><p className="flex items-center gap-2 text-sm text-text-muted"><Award className="h-4 w-4 text-brand-orange" />Certificates will appear here when issued by the platform.</p></Card></div></div></div></DashboardLayout>;
}
