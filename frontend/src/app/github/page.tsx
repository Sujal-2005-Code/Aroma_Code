"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BookOpen, GitBranch, GitCommitHorizontal, Star, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getGithubProfile, type GithubData } from "@/lib/api/resources";

export default function GithubPage() {
  const [data, setData] = useState<GithubData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { getGithubProfile().then(setData).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load GitHub data.")); }, []);
  if (!data && !error) return <DashboardLayout><Card className="text-center text-text-muted">Loading GitHub analytics…</Card></DashboardLayout>;
  if (error) return <DashboardLayout><Card className="text-red-400">{error}</Card></DashboardLayout>;
  if (!data) return null;
  const stats = [["Repos", data.stats.repos, BookOpen], ["Stars", data.stats.stars, Star], ["Followers", data.stats.followers, Users], ["Commits", data.stats.commits, GitCommitHorizontal]] as const;
  return <DashboardLayout><div className="mx-auto max-w-[1400px] space-y-6"><div><h1 className="text-2xl font-bold">GitHub Analytics</h1><p className="text-text-muted">Data saved to your connected GitHub profile.</p></div><Card className="flex flex-col gap-6 sm:flex-row sm:items-center"><div><h2 className="text-lg font-bold">{data.username}</h2><p className="text-sm text-text-muted">{data.headline}</p></div><div className="flex flex-wrap gap-3 sm:ml-auto">{stats.map(([label, value, Icon]) => <div key={label} className="rounded-xl bg-white/5 px-4 py-3 text-center"><Icon className="mx-auto h-4 w-4 text-brand-orange" /><p className="mt-1 text-lg font-bold">{value}</p><p className="text-[10px] text-text-muted">{label}</p></div>)}</div></Card><div className="grid gap-6 lg:grid-cols-3"><Card className="lg:col-span-2"><h2 className="mb-4 text-sm font-medium">Monthly commits</h2>{data.monthly_commits.length ? <ResponsiveContainer width="100%" height={240}><BarChart data={data.monthly_commits}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="commits" fill="#FC8F0F" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer> : <p className="text-sm text-text-muted">No GitHub activity has been imported yet.</p>}</Card><Card><h2 className="mb-4 text-sm font-medium">Languages</h2><div className="space-y-3">{data.languages.length ? data.languages.map((language) => <div key={language.name}><div className="mb-1 flex justify-between text-xs"><span>{language.name}</span><span>{language.percentage}%</span></div><div className="h-2 overflow-hidden rounded bg-white/5"><div className="h-full bg-brand-orange" style={{ width: `${language.percentage}%` }} /></div></div>) : <p className="text-sm text-text-muted">No language data imported.</p>}</div></Card></div><Card><h2 className="mb-4 text-sm font-medium">Repositories</h2><div className="grid gap-3 md:grid-cols-2">{data.repositories.length ? data.repositories.map((repo) => <div key={repo.name} className="rounded-xl bg-white/5 p-4"><h3 className="font-medium">{repo.name}</h3><p className="mt-1 text-xs text-text-muted">{repo.description || "No description"}</p><div className="mt-3 flex gap-3 text-xs text-text-muted"><span><Star className="mr-1 inline h-3 w-3" />{repo.stars || 0}</span><span><GitBranch className="mr-1 inline h-3 w-3" />{repo.forks || 0}</span></div><div className="mt-3 flex flex-wrap gap-1">{repo.technologies?.map((tech) => <Badge key={tech} variant="secondary">{tech}</Badge>)}</div></div>) : <p className="text-sm text-text-muted">Connect/import a GitHub profile to add repositories.</p>}</div></Card></div></DashboardLayout>;
}
