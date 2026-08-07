"use client";

import { FormEvent, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Globe2,
  Link2,
  Loader2,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Check = { label: string; score: number; detail: string; state: "strong" | "needs-work" };
type Analysis = {
  url: string;
  title: string;
  description: string;
  overall: number;
  checks: Check[];
  recommendations: string[];
  stats: { headings: number; links: number; externalLinks: number };
};

export default function PortfolioAnalyserPage() {
  const [url, setUrl] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/portfolio-analyser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const payload = await response.json() as Analysis | { error?: string };
      if (!response.ok || !("overall" in payload)) throw new Error("error" in payload ? payload.error : "The portfolio could not be analysed.");
      setAnalysis(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The portfolio could not be analysed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1160px] space-y-6 pb-10">
        <section className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-brand-pink/10 to-cyan-500/10 p-6 shadow-[0_20px_60px_rgba(139,92,246,0.16)] sm:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-brand-pink/15 blur-3xl" />
          <div className="relative max-w-3xl">
            <Badge variant="violet" className="mb-4"><Sparkles className="h-3.5 w-3.5" /> AROMA Portfolio Intelligence</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Portfolio Analyser</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted sm:text-base">Paste a public portfolio URL. AROMA reads that page only and evaluates its recruiter-facing signals, structure, proof of work, and contact readiness.</p>
          </div>
        </section>

        <Card gradient className="overflow-hidden">
          <form onSubmit={handleAnalyse} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="block flex-1 space-y-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted"><Globe2 className="h-3.5 w-3.5" /> Public portfolio URL</span>
              <input required type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://yourname.dev" className="h-11 w-full rounded-xl border border-border-subtle bg-bg-primary px-3 text-sm text-text-primary outline-none transition focus:border-brand-orange/50 focus:ring-2 focus:ring-brand-orange/10 placeholder:text-text-muted" />
            </label>
            <Button type="submit" variant="primary" size="lg" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}{loading ? "Scanning portfolio" : "Analyse URL"}</Button>
          </form>
          <p className="mt-3 text-xs text-text-muted">The URL must be publicly reachable. Private, local-network, and non-web addresses are blocked.</p>
        </Card>

        {error && <Card className="border-red-500/30 bg-red-500/10 text-sm text-red-300">{error}</Card>}

        {analysis && (
          <>
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
              <Card gradient className="overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">Portfolio strength</p><p className="mt-2 text-5xl font-bold text-text-primary">{analysis.overall}<span className="text-xl text-text-muted">/100</span></p><p className="mt-2 text-sm text-text-muted">{analysis.overall >= 75 ? "Strong recruiter-ready foundation" : "Focused improvements can raise visibility"}</p></div>
                  <div className="rounded-2xl bg-brand-orange/10 p-3 text-brand-orange"><BarChart3 className="h-6 w-6" /></div>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-brand-orange via-brand-pink to-violet-400 transition-all duration-700" style={{ width: `${analysis.overall}%` }} /></div>
                <a href={analysis.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand-orange hover:underline"><ExternalLink className="h-3.5 w-3.5" /> Open analysed portfolio</a>
              </Card>

              <Card className="space-y-4">
                <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">Page snapshot</p><h2 className="mt-1 text-lg font-semibold text-text-primary">{analysis.title || "No page title detected"}</h2><p className="mt-2 text-sm leading-6 text-text-muted">{analysis.description || "No meta description was found on this page."}</p></div>
                <div className="grid grid-cols-3 gap-3 border-t border-border-subtle pt-4">
                  <Snapshot label="Headings" value={analysis.stats.headings} /><Snapshot label="Links" value={analysis.stats.links} /><Snapshot label="External links" value={analysis.stats.externalLinks} />
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
              <Card className="space-y-5">
                <div><h2 className="text-lg font-semibold text-text-primary">URL-based signal breakdown</h2><p className="text-sm text-text-muted">Scores are derived only from public content found at the analysed URL.</p></div>
                <div className="space-y-4">{analysis.checks.map((check) => <div key={check.label} className="rounded-2xl border border-border-subtle bg-white/[0.03] p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 font-medium text-text-primary">{check.state === "strong" ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <TriangleAlert className="h-4 w-4 text-amber-300" />}{check.label}</div><span className={cn("text-sm font-semibold", check.state === "strong" ? "text-emerald-300" : "text-amber-200")}>{check.score}/100</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={cn("h-full rounded-full", check.state === "strong" ? "bg-emerald-400" : "bg-gradient-to-r from-brand-orange to-brand-pink")} style={{ width: `${check.score}%` }} /></div><p className="mt-3 text-sm leading-5 text-text-muted">{check.detail}</p></div>)}</div>
              </Card>
              <Card className="space-y-4"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-pink" /><h2 className="font-semibold text-text-primary">Priority improvements</h2></div>{analysis.recommendations.length ? analysis.recommendations.map((recommendation, index) => <div key={`${index}-${recommendation}`} className="flex gap-3 rounded-xl border border-brand-orange/15 bg-brand-orange/5 p-3 text-sm leading-5 text-text-muted"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-xs font-semibold text-brand-orange">{index + 1}</span>{recommendation}</div>) : <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">Excellent public coverage. Keep your projects and outcomes current.</div>}<div className="border-t border-border-subtle pt-4 text-xs text-text-muted">AROMA does not use your profile, resume, or manually entered skills for this result.</div></Card>
            </div>
          </>
        )}

        {!analysis && !error && <Card className="flex flex-col items-center gap-3 py-10 text-center"><div className="rounded-2xl bg-brand-orange/10 p-3 text-brand-orange"><Link2 className="h-6 w-6" /></div><h2 className="font-semibold text-text-primary">Ready to analyse your public portfolio</h2><p className="max-w-md text-sm text-text-muted">Enter one portfolio URL above to generate an evidence-based content and structure review.</p><Button variant="outline" onClick={() => setUrl("")}><RefreshCw className="h-4 w-4" /> Reset URL</Button></Card>}
      </div>
    </DashboardLayout>
  );
}

function Snapshot({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl bg-white/[0.04] p-3 text-center"><p className="text-lg font-semibold text-text-primary">{value}</p><p className="text-[11px] text-text-muted">{label}</p></div>;
}
