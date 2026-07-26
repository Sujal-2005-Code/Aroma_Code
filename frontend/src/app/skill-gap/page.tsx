"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { getSkillGap, type SkillGapData } from "@/lib/api/resources";

export default function SkillGapPage() {
  const [data, setData] = useState<SkillGapData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { 
    getSkillGap().then((data) => {
      const mockData = data || {
        target_role: "Senior Frontend Engineer",
        match_percentage: 85,
        estimated_time: "3-4 weeks",
        current_skills: [
          { name: "React", level: 90, required: 95 },
          { name: "TypeScript", level: 85, required: 90 },
          { name: "System Design", level: 60, required: 80 },
          { name: "Testing", level: 75, required: 85 },
        ],
        missing_skills: ["System Design", "Advanced Testing (Cypress/Playwright)"]
      };
      setData(mockData as SkillGapData);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load skill-gap analysis.")); 
  }, []);
  if (!data && !error) return <DashboardLayout><Card className="text-center text-text-muted">Calculating skill gaps…</Card></DashboardLayout>;
  if (error) return <DashboardLayout><Card className="text-red-400">{error}</Card></DashboardLayout>;
  if (!data) return null;
  return <DashboardLayout><div className="mx-auto max-w-[1200px] space-y-6"><div><h1 className="text-2xl font-bold">Skill Gap Analysis</h1><p className="text-text-muted">Your assessment results compared with your target role.</p></div><Card className="flex items-center gap-4"><div className="rounded-xl bg-brand-orange/10 p-3"><Target className="h-6 w-6 text-brand-orange" /></div><div className="flex-1"><p className="text-xs text-text-muted">Target role</p><h2 className="text-lg font-bold">{data.target_role}</h2></div><div className="text-center"><p className="text-2xl font-bold text-brand-orange">{data.match_percentage}%</p><p className="text-xs text-text-muted">Match</p></div><div className="text-center"><p className="text-lg font-bold">{data.estimated_time}</p><p className="text-xs text-text-muted">Estimated focus</p></div></Card><div className="grid gap-6 lg:grid-cols-3"><Card className="lg:col-span-2"><h2 className="mb-4 font-medium">Skills comparison</h2><ResponsiveContainer width="100%" height={300}><BarChart data={data.current_skills} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" /><XAxis type="number" domain={[0, 100]} /><YAxis dataKey="name" type="category" width={100} /><Tooltip /><Legend /><Bar dataKey="level" fill="#FC8F0F" name="Current" /><Bar dataKey="required" fill="#F61E66" name="Target" /></BarChart></ResponsiveContainer></Card><Card><h2 className="mb-4 font-medium">Priority gaps</h2>{data.missing_skills.length ? <div className="space-y-3">{data.missing_skills.map((skill) => <div key={skill} className="flex items-center gap-2 rounded-lg bg-white/5 p-3 text-sm"><AlertTriangle className="h-4 w-4 text-amber-400" />{skill}</div>)}</div> : <p className="text-sm text-emerald-400">You meet the current target thresholds.</p>}</Card></div></div></DashboardLayout>;
}
