"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Award,
  Briefcase,
  Camera,
  Check,
  CircleDashed,
  Eye,
  FileText,
  GraduationCap,
  Link2,
  Loader2,
  Rocket,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Wrench,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ambience } from "@/components/profile/ambience";
import { CountUp } from "@/components/profile/charts";
import { PhotoSection, PersonalSection } from "@/components/profile/sections/identity";
import { EducationSection, ExperienceSection } from "@/components/profile/sections/journey";
import { ProjectsSection, SkillsSection } from "@/components/profile/sections/craft";
import {
  CertificationsSection,
  PreferencesSection,
  ResumeSection,
  SocialSection,
} from "@/components/profile/sections/credentials";
import { SkillPassport } from "@/components/profile/skill-passport";
import { PreviewDialog } from "@/components/profile/preview-dialog";
import type { ActivityItem, ProfileData, SkillScores, StoredProfile } from "@/lib/profile";
import { completionBreakdown, computeCompletion, computeScores, generateInsights } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";

const NAV = [
  { id: "photo", label: "Profile Photo", icon: Camera },
  { id: "personal", label: "Personal Info", icon: UserRound },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Rocket },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "passport", label: "Skill Passport", icon: ShieldCheck },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "social", label: "Social Links", icon: Link2 },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "preferences", label: "Career Prefs", icon: Target },
];

function CompletionRing({ value }: { value: number }) {
  const size = 132;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-600/40 to-cyan-500/25 blur-xl"
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="completion-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#completion-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          initial={{ strokeDashoffset: c }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: "drop-shadow(0 0 8px rgba(139,92,246,0.7))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">
          <CountUp value={value} suffix="%" />
        </span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">complete</span>
      </div>
    </div>
  );
}

export function ProfileWorkspace({
  initialProfile,
  initialActivity,
}: {
  initialProfile: StoredProfile;
  initialActivity: ActivityItem[];
}) {
  const [data, setData] = React.useState<ProfileData>(initialProfile.data);
  const [scores, setScores] = React.useState<SkillScores>(initialProfile.scores);
  const [insights, setInsights] = React.useState<string[]>(initialProfile.insights);
  const [activity, setActivity] = React.useState<ActivityItem[]>(initialActivity);
  const [status, setStatus] = React.useState<StoredProfile["status"]>(initialProfile.status);
  const [savedAt, setSavedAt] = React.useState<string>(initialProfile.updatedAt);
  const [pending, setPending] = React.useState<null | "draft" | "published">(null);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("photo");
  const mounted = useHydrated();

  const patch = React.useCallback((p: Partial<ProfileData>) => {
    setData((prev) => ({ ...prev, ...p }));
    setDirty(true);
  }, []);

  const completion = React.useMemo(() => computeCompletion(data), [data]);
  const breakdown = React.useMemo(() => completionBreakdown(data), [data]);

  // Live client-side recompute so the Skill Passport reacts as you type.
  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setScores(computeScores(data));
      setInsights(generateInsights(data, computeScores(data)));
    }, 450);
    return () => window.clearTimeout(t);
  }, [data]);

  // Scroll spy for the section rail.
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.3, 0.6] },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const save = React.useCallback(
    async (nextStatus: "draft" | "published") => {
      setPending(nextStatus);
      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: initialProfile.slug, status: nextStatus, data }),
        });
        if (!res.ok) throw new Error("Request failed");
        const payload = (await res.json()) as { profile: StoredProfile; activity: ActivityItem[] };
        setScores(payload.profile.scores);
        setInsights(payload.profile.insights);
        setStatus(payload.profile.status);
        setSavedAt(payload.profile.updatedAt);
        setActivity(payload.activity);
        setDirty(false);
        toast.success(
          nextStatus === "published" ? "Profile updated & published" : "Draft saved securely",
          {
            description: `${payload.profile.completion}% complete · AI score ${payload.profile.scores.overall}`,
          },
        );
      } catch {
        toast.error("Could not reach the AROMA servers", { description: "Please try again." });
      } finally {
        setPending(null);
      }
    },
    [data, initialProfile.slug],
  );

  const analyze = React.useCallback(async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/profile/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (!res.ok) throw new Error("Request failed");
      const payload = (await res.json()) as { scores: SkillScores; insights: string[] };
      setScores(payload.scores);
      setInsights(payload.insights);
      toast.success("Skill passport recalculated", {
        description: `Overall AI score is now ${payload.scores.overall}`,
      });
    } catch {
      toast.error("Analysis engine unavailable");
    } finally {
      setAnalyzing(false);
    }
  }, [data]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save("draft");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const sectionProps = { data, patch };
  const skillTotal = Object.values(data.skills).reduce((sum, l) => sum + l.length, 0);

  return (
    <div className="relative min-h-screen">
      <Ambience />

      {/* Top bar */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 border-b border-white/8 bg-ink-950/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-500 shadow-[0_0_28px_-6px_rgba(139,92,246,0.9)]"
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <div className="leading-tight">
              <p className="text-[15px] font-bold tracking-[0.2em] text-gradient">AROMA</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                AI Powered Talent Intelligence
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 hidden items-center gap-2 lg:flex">
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]",
                  dirty
                    ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
                    : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", dirty ? "bg-amber-300" : "bg-emerald-300")} />
                {dirty
                  ? "Unsaved changes"
                  : mounted
                    ? `Saved ${new Date(savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : "All changes saved"}
              </span>
              <Badge variant={status === "published" ? "cyan" : "default"}>
                {status === "published" ? "Live profile" : "Draft mode"}
              </Badge>
            </div>

            <Button variant="glass" size="sm" onClick={() => save("draft")} disabled={pending !== null}>
              {pending === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Draft
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4" /> Preview Profile
            </Button>
            <Button variant="primary" size="sm" onClick={() => save("published")} disabled={pending !== null}>
              {pending === "published" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Update Profile
            </Button>
          </div>
        </div>
        <motion.div
          className="h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.header>

      <main className="relative z-10 mx-auto max-w-[1400px] px-4 pb-24 pt-8 sm:px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <Badge variant="violet" className="mb-4">
            <Sparkles className="h-3 w-3" /> Candidate Profile Builder · v2.4
          </Badge>
          <h1 className="max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            <span className="text-gradient">Build the profile</span>{" "}
            <span className="text-white">that gets you hired.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-400">
            Every field you complete trains AROMA&apos;s matching engine — your Skill Passport, ATS score and
            recruiter visibility update in real time.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Overall AI Score", value: `${scores.overall}`, tone: "from-violet-500/25 to-fuchsia-500/10" },
              { label: "Profile Strength", value: `${completion}%`, tone: "from-cyan-500/25 to-blue-500/10" },
              { label: "Skills Tagged", value: `${skillTotal}`, tone: "from-emerald-500/25 to-teal-500/10" },
              { label: "Projects", value: `${data.projects.length}`, tone: "from-amber-500/25 to-orange-500/10" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.07 }}
                whileHover={{ y: -4 }}
                className={cn(
                  "glass-soft rounded-2xl bg-gradient-to-br p-4 transition-colors hover:border-white/25",
                  stat.tone,
                )}
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile / tablet section rail */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="glass mb-6 flex gap-1.5 overflow-x-auto rounded-2xl p-2 xl:hidden no-scrollbar"
        >
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-[12px] transition-colors",
                  active
                    ? "border-violet-400/40 bg-violet-500/15 text-white"
                    : "border-white/8 text-slate-400 hover:text-white",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </a>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden xl:block"
          >
            <div className="sticky top-24 space-y-4">
              <div className="glass rounded-3xl p-5">
                <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Profile Completion
                </p>
                <CompletionRing value={completion} />
                <div className="mt-5 space-y-1.5">
                  {breakdown.map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-[12px]">
                      <span className={s.done ? "text-slate-300" : "text-slate-500"}>{s.label}</span>
                      {s.done ? (
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                      ) : (
                        <CircleDashed className="h-3.5 w-3.5 text-slate-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <nav className="glass rounded-3xl p-3">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] transition-colors duration-300",
                        active ? "text-white" : "text-slate-400 hover:text-slate-100",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-xl border border-violet-400/30 bg-gradient-to-r from-violet-500/20 to-cyan-400/10"
                          transition={{ type: "spring", stiffness: 320, damping: 30 }}
                        />
                      )}
                      <Icon className={cn("relative h-4 w-4", active && "text-violet-300")} />
                      <span className="relative">{item.label}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="glass rounded-3xl p-5">
                <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <Activity className="h-3.5 w-3.5 text-cyan-300" /> Recent activity
                </p>
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {activity.slice(0, 4).map((a) => (
                      <motion.li
                        key={a.id}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="border-l border-white/10 pl-3 text-[12px] text-slate-400"
                      >
                        <p className="text-slate-300">{a.message}</p>
                        <p className="text-[10px] text-slate-600">
                          {mounted
                            ? new Date(a.createdAt).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "recently"}
                        </p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  {activity.length === 0 && <li className="text-[12px] text-slate-500">No activity yet.</li>}
                </ul>
              </div>
            </div>
          </motion.aside>

          {/* Form column */}
          <div className="space-y-6">
            <PhotoSection {...sectionProps} />
            <PersonalSection {...sectionProps} />
            <EducationSection {...sectionProps} />
            <ExperienceSection {...sectionProps} />
            <ProjectsSection {...sectionProps} />
            <SkillsSection {...sectionProps} />
            <SkillPassport
              scores={scores}
              insights={insights}
              name={data.fullName}
              headline={data.headline}
              slug={initialProfile.slug}
              analyzing={analyzing}
              onAnalyze={analyze}
            />
            <CertificationsSection {...sectionProps} />
            <SocialSection {...sectionProps} />
            <ResumeSection {...sectionProps} />
            <PreferencesSection {...sectionProps} />

            {/* Footer actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass flex flex-col items-center justify-between gap-4 rounded-3xl p-5 sm:flex-row"
            >
              <div>
                <p className="text-sm font-medium text-white">Ready to go live?</p>
                <p className="text-[12px] text-slate-400">
                  Publishing pushes your profile to recruiter search and daily AI job matches.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="glass" onClick={() => save("draft")} disabled={pending !== null}>
                  {pending === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Draft
                </Button>
                <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                  <Eye className="h-4 w-4" /> Preview Profile
                </Button>
                <Button variant="primary" onClick={() => save("published")} disabled={pending !== null}>
                  {pending === "published" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  Update Profile
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bar */}
      <motion.div
        initial={{ y: 90 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 24 }}
        className="fixed inset-x-3 bottom-3 z-40 xl:hidden"
      >
        <div className="glass flex items-center gap-2 rounded-2xl p-2">
          <div className="flex flex-1 items-center gap-2 px-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                animate={{ width: `${completion}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <span className="text-[11px] text-slate-300">{completion}%</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(true)} aria-label="Preview">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="glass" size="icon" onClick={() => save("draft")} aria-label="Save draft">
            {pending === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </Button>
          <Button variant="primary" size="sm" onClick={() => save("published")} disabled={pending !== null}>
            {pending === "published" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            Update
          </Button>
        </div>
      </motion.div>

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={data}
        scores={scores}
        completion={completion}
      />
    </div>
  );
}
