"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Calendar,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CircularProgress } from "@/components/profile/charts";
import { SCORE_META } from "@/components/profile/skill-passport";
import { initialsOf } from "@/lib/avatar";
import { SKILL_GROUPS, SOCIAL_FIELDS, type ProfileData, type SkillScores } from "@/lib/profile";

function Block({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-soft rounded-2xl p-4 sm:p-5"
    >
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-violet-300">{icon}</span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

export function PreviewDialog({
  open,
  onOpenChange,
  data,
  scores,
  completion,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: ProfileData;
  scores: SkillScores;
  completion: number;
}) {
  const links = SOCIAL_FIELDS.filter((f) => data.social[f.key]?.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Profile preview</DialogTitle>

        <div className="relative h-32 overflow-hidden bg-gradient-to-r from-violet-700/60 via-fuchsia-600/40 to-cyan-600/50 sm:h-40">
          <div className="absolute inset-0 grid-veil opacity-60" />
          <motion.div
            className="absolute -left-16 top-0 h-full w-1/2 bg-white/10 blur-2xl"
            animate={{ x: ["0%", "260%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute right-4 top-4 flex gap-2">
            <Badge variant="cyan">{completion}% complete</Badge>
            <Badge variant="violet">AI score {scores.overall}</Badge>
          </div>
        </div>

        <div className="px-5 pb-8 sm:px-7">
          <div className="-mt-14 flex flex-wrap items-end gap-5">
            <div className="relative h-28 w-28 overflow-hidden rounded-3xl border-4 border-ink-900 bg-ink-800 shadow-2xl">
              {data.photoUrl ? (
                <Image src={data.photoUrl} alt={data.fullName} fill unoptimized sizes="112px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-600/40 to-cyan-500/30 text-2xl font-bold text-white">
                  {initialsOf(data.fullName)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <h2 className="truncate text-2xl font-bold text-white">{data.fullName || "Unnamed Candidate"}</h2>
              <p className="text-sm text-violet-200">{data.headline || "Add a headline"}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-slate-400">
                {data.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {data.location}
                  </span>
                )}
                {data.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {data.email}
                  </span>
                )}
                {data.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {data.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:grid-cols-5">
            {SCORE_META.map((m, i) => (
              <CircularProgress
                key={m.key}
                value={scores[m.key]}
                label={m.short}
                size={82}
                stroke={7}
                from={m.color}
                to={m.to}
                delay={i * 0.06}
              />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.about && (
              <div className="lg:col-span-2">
                <Block icon={<Rocket className="h-4 w-4" />} title="About">
                  <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-300">{data.about}</p>
                </Block>
              </div>
            )}

            {data.experience.length > 0 && (
              <Block icon={<Briefcase className="h-4 w-4" />} title="Experience">
                <div className="space-y-4">
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="relative border-l border-white/12 pl-4">
                      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
                      <p className="text-sm font-medium text-white">{exp.title || "Role"}</p>
                      <p className="text-[12px] text-violet-200">
                        {exp.company} · {exp.employmentType}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {exp.startDate || "—"} → {exp.current ? "Present" : exp.endDate || "—"}
                      </p>
                      {exp.description && (
                        <p className="mt-1.5 whitespace-pre-line text-[12px] leading-relaxed text-slate-400">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {data.education.length > 0 && (
              <Block icon={<GraduationCap className="h-4 w-4" />} title="Education">
                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                      <p className="text-sm font-medium text-white">{edu.college || "Institution"}</p>
                      <p className="text-[12px] text-slate-400">
                        {[edu.degree, edu.branch].filter(Boolean).join(" · ")}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                        {edu.cgpa && <Badge variant="emerald">CGPA {edu.cgpa}</Badge>}
                        {edu.graduationYear && <Badge variant="violet">Class of {edu.graduationYear}</Badge>}
                        {edu.semester && <Badge>Sem {edu.semester}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {data.projects.length > 0 && (
              <div className="lg:col-span-2">
                <Block icon={<Rocket className="h-4 w-4" />} title="Projects">
                  <div className="grid gap-3 md:grid-cols-2">
                    {data.projects.map((p) => (
                      <motion.div
                        key={p.id}
                        whileHover={{ y: -4 }}
                        className="rounded-xl border border-white/8 bg-white/[0.03] p-3 transition-colors hover:border-violet-400/40"
                      >
                        <p className="text-sm font-medium text-white">{p.name || "Untitled"}</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{p.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {p.tech.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="mt-2 flex gap-3 text-[11px]">
                          {p.github && (
                            <span className="flex items-center gap-1 text-cyan-200">
                              <GitBranch className="h-3 w-3" /> Repo
                            </span>
                          )}
                          {p.demo && (
                            <span className="flex items-center gap-1 text-violet-200">
                              <ExternalLink className="h-3 w-3" /> Live demo
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Block>
              </div>
            )}

            <div className="lg:col-span-2">
              <Block icon={<Target className="h-4 w-4" />} title="Skills">
                <div className="space-y-3">
                  {SKILL_GROUPS.filter((g) => data.skills[g.key].length > 0).map((g) => (
                    <div key={g.key}>
                      <p className="mb-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-500">{g.label}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {data.skills[g.key].map((s) => (
                          <span
                            key={s}
                            className={`rounded-full border border-white/12 bg-gradient-to-r ${g.accent} px-2.5 py-1 text-[11px] font-medium text-white`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Block>
            </div>

            {data.certifications.length > 0 && (
              <Block icon={<Award className="h-4 w-4" />} title="Certifications">
                <ul className="space-y-2">
                  {data.certifications.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 text-[13px]">
                      <span className="text-slate-200">{c.name}</span>
                      <span className="text-[11px] text-slate-500">{c.issuedBy}</span>
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            <Block icon={<Target className="h-4 w-4" />} title="Career Preferences">
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <p className="text-slate-500">Role</p>
                  <p className="text-slate-200">{data.preferences.role || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Work mode</p>
                  <p className="text-slate-200">{data.preferences.workMode || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Location</p>
                  <p className="text-slate-200">{data.preferences.location || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Expected salary</p>
                  <p className="text-slate-200">{data.preferences.salary || "—"}</p>
                </div>
              </div>
            </Block>

            {links.length > 0 && (
              <div className="lg:col-span-2">
                <Block icon={<ExternalLink className="h-4 w-4" />} title="Links">
                  <div className="flex flex-wrap gap-2">
                    {links.map((f) => (
                      <span
                        key={f.key}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300"
                      >
                        <span className={`font-bold ${f.tone}`}>{f.emoji}</span>
                        {data.social[f.key]}
                      </span>
                    ))}
                  </div>
                </Block>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
