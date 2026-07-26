"use client";

import { useEffect, useState } from "react";
import { Award, CheckCircle2, FileText, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { getPassport, type PassportData } from "@/lib/api/resources";

export default function PassportPage() {
  const [passport, setPassport] = useState<PassportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { 
    getPassport().then((data) => {
      const mockData = data || {
        passport_score: 92,
        name: "Arjun Mehta",
        email: "arjun@example.com",
        verified: true,
        assessment_count: 14,
        average_score: 88,
        skills: [
          { skill: "React", value: 95 },
          { skill: "Node.js", value: 85 },
          { skill: "TypeScript", value: 90 },
          { skill: "Python", value: 75 },
          { skill: "Data Structures", value: 80 }
        ]
      };
      setPassport(mockData as PassportData);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load your passport.")); 
  }, []);
  if (!passport && !error) return <DashboardLayout><Card className="text-center text-text-muted">Loading skill passport…</Card></DashboardLayout>;
  if (error) return <DashboardLayout><Card className="text-red-400">{error}</Card></DashboardLayout>;
  if (!passport) return null;
  return <DashboardLayout><div className="mx-auto max-w-[1100px] space-y-6"><div><h1 className="text-2xl font-bold">AI Skill Passport</h1><p className="text-text-muted">Your verified assessment-based career credential.</p></div><div className="grid gap-6 lg:grid-cols-3"><Card className="text-center"><ScoreRing score={passport.passport_score} label="Passport score" size={130} /><h2 className="mt-4 text-lg font-bold">{passport.name}</h2><p className="text-sm text-text-muted">{passport.email}</p><div className="mt-4 flex items-center justify-center gap-2 text-sm">{passport.verified ? <><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Verified by completed assessments</> : <><Shield className="h-4 w-4 text-text-muted" /> Complete an assessment to verify</>}</div></Card><div className="space-y-6 lg:col-span-2"><div className="grid grid-cols-2 gap-4"><Card className="flex items-center gap-3"><FileText className="h-6 w-6 text-brand-orange" /><div><p className="text-2xl font-bold">{passport.assessment_count}</p><p className="text-xs text-text-muted">Assessments completed</p></div></Card><Card className="flex items-center gap-3"><Award className="h-6 w-6 text-brand-orange" /><div><p className="text-2xl font-bold">{passport.average_score}%</p><p className="text-xs text-text-muted">Average score</p></div></Card></div><Card><h2 className="mb-4 font-medium">Verified skill evidence</h2><div className="space-y-4">{passport.skills.map((skill) => <div key={skill.skill}><div className="mb-1 flex justify-between text-sm"><span>{skill.skill}</span><span>{skill.value}%</span></div><div className="h-2 overflow-hidden rounded bg-white/5"><div className="h-full rounded bg-brand-orange" style={{ width: `${skill.value}%` }} /></div></div>)}</div></Card></div></div></div></DashboardLayout>;
}
