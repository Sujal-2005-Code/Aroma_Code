"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Building2,
  Check,
  Download,
  Eye,
  FileText,
  Link2,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, NativeSelect } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  EmptyHint,
  Field,
  FileDrop,
  RepeatableItem,
  SectionShell,
  TextField,
} from "@/components/profile/fields";
import { SOCIAL_FIELDS, type CertificationEntry, type ProfileData } from "@/lib/profile";
import { cn, formatBytes, uid } from "@/lib/utils";

type Props = { data: ProfileData; patch: (p: Partial<ProfileData>) => void };

export function CertificationsSection({ data, patch }: Props) {
  const add = () =>
    patch({
      certifications: [
        ...data.certifications,
        { id: uid("cert"), name: "", issuedBy: "", issueDate: "", fileName: "", fileUrl: "" },
      ],
    });

  const update = <K extends keyof CertificationEntry>(
    id: string,
    field: K,
    value: CertificationEntry[K],
  ) =>
    patch({
      certifications: data.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    });

  const remove = (id: string) =>
    patch({ certifications: data.certifications.filter((c) => c.id !== id) });

  return (
    <SectionShell
      id="certifications"
      index={6}
      icon={<Award className="h-5 w-5" />}
      title="Certifications"
      description="Verified credentials add trust signals and boost your ATS and communication scores."
      accent="from-amber-500/35 to-yellow-500/20"
      action={
        <Button variant="glass" size="sm" onClick={add}>
          <Plus className="h-4 w-4" /> Add Certificate
        </Button>
      }
    >
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {data.certifications.map((cert, i) => (
            <RepeatableItem
              key={cert.id}
              index={i}
              title={cert.name || "New certificate"}
              subtitle={cert.issuedBy || "Issuing organisation"}
              onRemove={() => remove(cert.id)}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField
                  label="Certificate Name"
                  placeholder="AWS Certified Cloud Practitioner"
                  value={cert.name}
                  onChange={(e) => update(cert.id, "name", e.target.value)}
                />
                <TextField
                  label="Issued By"
                  placeholder="Amazon Web Services"
                  value={cert.issuedBy}
                  onChange={(e) => update(cert.id, "issuedBy", e.target.value)}
                />
                <TextField
                  label="Issue Date"
                  type="month"
                  value={cert.issueDate}
                  onChange={(e) => update(cert.id, "issueDate", e.target.value)}
                />
                <Field label="Upload Certificate">
                  {cert.fileName ? (
                    <div className="flex h-11 items-center justify-between rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3">
                      <span className="flex items-center gap-2 truncate text-xs text-emerald-100">
                        <Check className="h-3.5 w-3.5" /> {cert.fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          update(cert.id, "fileName", "");
                          update(cert.id, "fileUrl", "");
                        }}
                        className="text-emerald-200/70 transition hover:text-rose-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <FileDrop
                      compact
                      accept="image/*,application/pdf"
                      title="Drop certificate"
                      subtitle="PDF or image · max 3 MB"
                      maxMB={3}
                      onFile={(f) => {
                        update(cert.id, "fileName", f.name);
                        update(cert.id, "fileUrl", f.dataUrl);
                      }}
                    />
                  )}
                </Field>
              </div>
            </RepeatableItem>
          ))}
        </AnimatePresence>
        {data.certifications.length === 0 && (
          <EmptyHint text="Add certifications from AWS, Google, NPTEL, Coursera or campus programmes." />
        )}
      </div>
    </SectionShell>
  );
}

export function SocialSection({ data, patch }: Props) {
  const connected = Object.values(data.social).filter((v) => v.trim()).length;

  return (
    <SectionShell
      id="social"
      index={7}
      icon={<Link2 className="h-5 w-5" />}
      title="Social & Coding Profiles"
      description="Connected platforms are crawled for contribution graphs, contest ratings and problem-solving depth."
      accent="from-sky-500/35 to-cyan-500/20"
      action={<Badge variant="cyan">{connected}/9 connected</Badge>}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SOCIAL_FIELDS.map((field, i) => {
          const value = data.social[field.key];
          return (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              className={cn(
                "glass-soft rounded-2xl p-3 transition-colors duration-300",
                value ? "border-violet-400/30 bg-violet-500/[0.07]" : "hover:border-white/20",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-8 items-center justify-center rounded-lg border border-white/12 bg-black/30 text-[10px] font-bold",
                      field.tone,
                    )}
                  >
                    {field.emoji}
                  </span>
                  <span className="text-xs font-medium text-slate-200">{field.label}</span>
                </span>
                {value ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : null}
              </div>
              <Input
                className="h-9 text-xs"
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => patch({ social: { ...data.social, [field.key]: e.target.value } })}
              />
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}

export function ResumeSection({ data, patch }: Props) {
  const [preview, setPreview] = React.useState(false);
  const resume = data.resume;

  return (
    <SectionShell
      id="resume"
      index={8}
      icon={<FileText className="h-5 w-5" />}
      title="Resume"
      description="Upload your latest resume — AROMA parses it for ATS keyword coverage, formatting and impact language."
      accent="from-violet-500/35 to-indigo-500/20"
      action={resume ? <Badge variant="emerald">Parsed by AI</Badge> : <Badge>No file yet</Badge>}
    >
      {resume ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-soft flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-violet-200"
            >
              <FileText className="h-5 w-5" />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-slate-100">{resume.fileName}</p>
              <p className="text-[11px] text-slate-500">
                {formatBytes(resume.size)} · uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="glass" size="sm" onClick={() => setPreview(true)}>
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <a href={resume.fileUrl} download={resume.fileName}>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" /> Download
              </Button>
            </a>
            <Button variant="danger" size="sm" onClick={() => patch({ resume: null })}>
              <Trash2 className="h-4 w-4" /> Remove
            </Button>
          </div>
        </motion.div>
      ) : (
        <FileDrop
          accept="application/pdf,.doc,.docx"
          title="Drag & drop your resume, or click to browse"
          subtitle="PDF preferred · max 4 MB · parsed instantly by the ATS engine"
          maxMB={4}
          onFile={(f) =>
            patch({
              resume: {
                fileName: f.name,
                fileUrl: f.dataUrl,
                size: f.size,
                uploadedAt: new Date().toISOString(),
              },
            })
          }
        />
      )}

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-w-5xl">
          <div className="border-b border-white/10 p-5">
            <DialogTitle className="text-base font-semibold text-white">
              Resume preview · {resume?.fileName}
            </DialogTitle>
          </div>
          <div className="h-[70vh] w-full bg-black/40">
            {resume ? (
              <iframe src={resume.fileUrl} title="Resume preview" className="h-full w-full" />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </SectionShell>
  );
}

const WORK_MODES = ["Remote", "Hybrid", "Onsite"] as const;
const ROLES = [
  "AI/ML Engineer",
  "Full Stack Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "Data Analyst",
  "Product Engineer",
  "DevOps Engineer",
];

export function PreferencesSection({ data, patch }: Props) {
  const prefs = data.preferences;

  return (
    <SectionShell
      id="preferences"
      index={9}
      icon={<Target className="h-5 w-5" />}
      title="Career Preferences"
      description="Tell the matching engine what you want next — these drive your daily job recommendations."
      accent="from-emerald-500/35 to-lime-500/20"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Preferred Job Role">
          <NativeSelect
            value={prefs.role}
            onChange={(e) => patch({ preferences: { ...prefs, role: e.target.value } })}
          >
            <option value="">Select a role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <Field label="Preferred Location">
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              className="pl-10"
              placeholder="Bengaluru · Hyderabad · Remote (India)"
              value={prefs.location}
              onChange={(e) => patch({ preferences: { ...prefs, location: e.target.value } })}
            />
          </div>
        </Field>

        <TextField
          label="Expected Salary"
          placeholder="₹ 12–18 LPA"
          value={prefs.salary}
          onChange={(e) => patch({ preferences: { ...prefs, salary: e.target.value } })}
        />

        <TextField
          label="Availability / Notice"
          placeholder="Immediately after June 2026"
          value={prefs.noticePeriod}
          onChange={(e) => patch({ preferences: { ...prefs, noticePeriod: e.target.value } })}
        />

        <Field label="Work Mode" className="md:col-span-2">
          <div className="grid grid-cols-3 gap-3">
            {WORK_MODES.map((mode) => {
              const active = prefs.workMode === mode;
              return (
                <motion.button
                  key={mode}
                  type="button"
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => patch({ preferences: { ...prefs, workMode: mode } })}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border px-4 py-4 text-sm font-medium transition-all duration-300",
                    active
                      ? "border-violet-400/60 bg-gradient-to-br from-violet-600/30 to-cyan-500/20 text-white shadow-[0_0_28px_-10px_rgba(139,92,246,0.9)]"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="workmode-glow"
                      className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/25 to-cyan-400/15"
                      transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    />
                  )}
                  {mode}
                </motion.button>
              );
            })}
          </div>
        </Field>
      </div>
    </SectionShell>
  );
}
