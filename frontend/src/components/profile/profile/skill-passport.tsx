"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Brain,
  Code2,
  FileCheck2,
  Lightbulb,
  MessagesSquare,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircularProgress, CountUp, MeterBar, ScoreDonut } from "@/components/profile/charts";
import type { SkillScores } from "@/lib/profile";
import { cn } from "@/lib/utils";

export const SCORE_META: {
  key: keyof SkillScores;
  label: string;
  short: string;
  color: string;
  to: string;
  icon: React.ReactNode;
}[] = [
  { key: "ats", label: "ATS Resume Score", short: "ATS", color: "#8b5cf6", to: "#c4b5fd", icon: <FileCheck2 className="h-4 w-4" /> },
  { key: "coding", label: "Coding Score", short: "Coding", color: "#22d3ee", to: "#67e8f9", icon: <Code2 className="h-4 w-4" /> },
  { key: "communication", label: "Communication", short: "Comms", color: "#f472b6", to: "#fbcfe8", icon: <MessagesSquare className="h-4 w-4" /> },
  { key: "problemSolving", label: "Problem Solving", short: "Problem", color: "#34d399", to: "#a7f3d0", icon: <Lightbulb className="h-4 w-4" /> },
  { key: "aiReadiness", label: "AI Readiness", short: "AI Ready", color: "#fbbf24", to: "#fde68a", icon: <Brain className="h-4 w-4" /> },
];

function tierOf(score: number) {
  if (score >= 85) return { label: "Platinum Talent", variant: "cyan" as const };
  if (score >= 70) return { label: "Gold Talent", variant: "amber" as const };
  if (score >= 50) return { label: "Silver Talent", variant: "violet" as const };
  return { label: "Rising Talent", variant: "default" as const };
}

export function SkillPassport({
  scores,
  insights,
  name,
  headline,
  slug,
  analyzing,
  onAnalyze,
}: {
  scores: SkillScores;
  insights: string[];
  name: string;
  headline: string;
  slug: string;
  analyzing: boolean;
  onAnalyze: () => void;
}) {
  const tier = tierOf(scores.overall);
  const segments = SCORE_META.map((m) => ({
    label: m.label,
    value: scores[m.key],
    color: m.color,
  }));

  return (
    <motion.section
      id="passport"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass relative scroll-mt-28 overflow-hidden rounded-3xl p-5 sm:p-7"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.10) 45%, rgba(34,211,238,0.10) 55%, transparent 70%)",
          backgroundSize: "260% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "220% 0%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ rotate: [0, 6, -4, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-violet-500/40 to-cyan-500/25 text-white shadow-lg shadow-black/40"
          >
            <ShieldCheck className="h-5 w-5" />
          </motion.div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">Skill Passport</h2>
              <Badge variant={tier.variant}>
                <BadgeCheck className="h-3 w-3" /> {tier.label}
              </Badge>
            </div>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-slate-400">
              A live, AI-verified snapshot of your employability — recalculated every time you edit your profile.
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={onAnalyze} disabled={analyzing}>
          <RefreshCcw className={cn("h-4 w-4", analyzing && "animate-spin")} />
          {analyzing ? "Analyzing…" : "Re-run AI Analysis"}
        </Button>
      </div>

      {/* Passport identity strip */}
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-violet-600/15 via-fuchsia-500/10 to-cyan-500/15 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-violet-200/80">AROMA Talent Passport</p>
            <p className="truncate text-lg font-semibold text-white">{name || "Unnamed Candidate"}</p>
            <p className="truncate text-xs text-slate-400">{headline || "Add a headline to complete your passport"}</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Passport ID</p>
              <p className="font-mono text-xs text-cyan-200">
                AR-{slug.slice(0, 4).toUpperCase()}-{String(scores.overall).padStart(3, "0")}
              </p>
            </div>
            <div className="hidden gap-[3px] sm:flex">
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="w-[3px] rounded-full bg-gradient-to-b from-violet-300 to-cyan-300"
                  animate={{ height: [10, 22 + ((i * 7) % 16), 10], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-7 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Composite breakdown
          </p>
          <ScoreDonut
            segments={segments}
            centerValue={scores.overall}
            centerLabel="Overall Skill Score"
          />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SCORE_META.map((m, i) => (
              <CircularProgress
                key={m.key}
                value={scores[m.key]}
                label={m.label}
                sublabel={m.short}
                size={104}
                from={m.color}
                to={m.to}
                delay={i * 0.08}
                icon={m.icon}
              />
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, scale: 1.03 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-violet-400/25 bg-gradient-to-br from-violet-600/20 to-cyan-500/10 p-4 text-center"
            >
              <Sparkles className="mb-1 h-5 w-5 text-violet-200" />
              <p className="bg-gradient-to-br from-white to-cyan-200 bg-clip-text text-3xl font-bold text-transparent">
                <CountUp value={scores.overall} />
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Overall</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:grid-cols-2">
            {SCORE_META.map((m, i) => (
              <MeterBar
                key={m.key}
                label={m.label}
                value={scores[m.key]}
                delay={i * 0.06}
                color="from-violet-500 via-fuchsia-500 to-cyan-400"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-6 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" /> AI recommendations
        </p>
        <AnimatePresence mode="popLayout">
          {insights.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[13px] text-slate-500"
            >
              Fill in more sections and re-run the analysis to unlock personalised recommendations.
            </motion.p>
          ) : (
            <ul className="grid gap-2 md:grid-cols-2">
              {insights.map((tip, i) => (
                <motion.li
                  key={tip}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="flex gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-[13px] leading-relaxed text-slate-300"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
                  {tip}
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
