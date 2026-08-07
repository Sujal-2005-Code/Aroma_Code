"use client";

import { AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { EmptyHint, Field, RepeatableItem, SectionShell, TextField } from "@/components/profile/fields";
import type { EducationEntry, ExperienceEntry, ProfileData } from "@/lib/profile";
import { uid } from "@/lib/utils";

type Props = { data: ProfileData; patch: (p: Partial<ProfileData>) => void };

const EMPLOYMENT_TYPES = [
  "Internship",
  "Full-time",
  "Part-time",
  "Freelance",
  "Apprenticeship",
  "Open Source",
];

const DEGREES = ["B.Tech", "B.E.", "B.Sc", "BCA", "M.Tech", "MCA", "M.Sc", "Diploma", "PhD"];

export function EducationSection({ data, patch }: Props) {
  const add = () =>
    patch({
      education: [
        ...data.education,
        {
          id: uid("edu"),
          college: "",
          university: "",
          degree: "",
          branch: "",
          graduationYear: "",
          cgpa: "",
          semester: "",
        },
      ],
    });

  const update = (id: string, field: keyof EducationEntry, value: string) =>
    patch({
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });

  const remove = (id: string) => patch({ education: data.education.filter((e) => e.id !== id) });

  return (
    <SectionShell
      id="education"
      index={2}
      icon={<GraduationCap className="h-5 w-5" />}
      title="Education"
      description="Academic record powering eligibility filters — CGPA, graduation year and branch are matched automatically."
      accent="from-emerald-500/35 to-teal-500/20"
      action={
        <Button variant="glass" size="sm" onClick={add}>
          <Plus className="h-4 w-4" /> Add Education
        </Button>
      }
    >
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {data.education.map((edu, i) => (
            <RepeatableItem
              key={edu.id}
              index={i}
              title={edu.college || "New institution"}
              subtitle={[edu.degree, edu.branch].filter(Boolean).join(" · ") || "Degree details"}
              onRemove={() => remove(edu.id)}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField
                  label="College Name"
                  placeholder="Indian Institute of Technology"
                  value={edu.college}
                  onChange={(e) => update(edu.id, "college", e.target.value)}
                />
                <TextField
                  label="University"
                  placeholder="Autonomous / Affiliated university"
                  value={edu.university}
                  onChange={(e) => update(edu.id, "university", e.target.value)}
                />
                <Field label="Degree">
                  <NativeSelect
                    value={edu.degree}
                    onChange={(e) => update(edu.id, "degree", e.target.value)}
                  >
                    <option value="">Select degree</option>
                    {DEGREES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <TextField
                  label="Branch"
                  placeholder="Computer Science & Engineering"
                  value={edu.branch}
                  onChange={(e) => update(edu.id, "branch", e.target.value)}
                />
                <TextField
                  label="Graduation Year"
                  placeholder="2026"
                  inputMode="numeric"
                  value={edu.graduationYear}
                  onChange={(e) => update(edu.id, "graduationYear", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    label="CGPA"
                    placeholder="8.7"
                    value={edu.cgpa}
                    onChange={(e) => update(edu.id, "cgpa", e.target.value)}
                  />
                  <TextField
                    label="Semester"
                    placeholder="7th"
                    value={edu.semester}
                    onChange={(e) => update(edu.id, "semester", e.target.value)}
                  />
                </div>
              </div>
            </RepeatableItem>
          ))}
        </AnimatePresence>
        {data.education.length === 0 && (
          <EmptyHint text="No education added yet — add your college, degree and CGPA to unlock campus-eligibility matching." />
        )}
      </div>
    </SectionShell>
  );
}

export function ExperienceSection({ data, patch }: Props) {
  const add = () =>
    patch({
      experience: [
        ...data.experience,
        {
          id: uid("exp"),
          company: "",
          title: "",
          employmentType: "Internship",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    });

  const update = <K extends keyof ExperienceEntry>(id: string, field: K, value: ExperienceEntry[K]) =>
    patch({
      experience: data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });

  const remove = (id: string) => patch({ experience: data.experience.filter((e) => e.id !== id) });

  return (
    <SectionShell
      id="experience"
      index={3}
      icon={<Briefcase className="h-5 w-5" />}
      title="Experience"
      description="Internships, part-time roles and open-source work. Quantified bullet points score highest with the ATS engine."
      accent="from-amber-500/35 to-orange-500/20"
      action={
        <Button variant="glass" size="sm" onClick={add}>
          <Plus className="h-4 w-4" /> Add More
        </Button>
      }
    >
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {data.experience.map((exp, i) => (
            <RepeatableItem
              key={exp.id}
              index={i}
              title={exp.company || "New experience"}
              subtitle={[exp.title, exp.employmentType].filter(Boolean).join(" · ")}
              onRemove={() => remove(exp.id)}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField
                  label="Company Name"
                  placeholder="Nebula Labs"
                  value={exp.company}
                  onChange={(e) => update(exp.id, "company", e.target.value)}
                />
                <TextField
                  label="Job Title"
                  placeholder="AI Engineering Intern"
                  value={exp.title}
                  onChange={(e) => update(exp.id, "title", e.target.value)}
                />
                <Field label="Employment Type">
                  <NativeSelect
                    value={exp.employmentType}
                    onChange={(e) => update(exp.id, "employmentType", e.target.value)}
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <div className="flex items-end">
                  <div className="glass-soft flex h-11 w-full items-center justify-between rounded-xl px-3.5">
                    <span className="text-xs text-slate-300">I currently work here</span>
                    <Switch
                      checked={exp.current}
                      onCheckedChange={(v) => update(exp.id, "current", v)}
                    />
                  </div>
                </div>
                <TextField
                  label="Start Date"
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => update(exp.id, "startDate", e.target.value)}
                />
                <TextField
                  label="End Date"
                  type="month"
                  disabled={exp.current}
                  value={exp.current ? "" : exp.endDate}
                  onChange={(e) => update(exp.id, "endDate", e.target.value)}
                  hint={exp.current ? "Present" : undefined}
                />
                <Field label="Description" className="md:col-span-2">
                  <Textarea
                    placeholder="• Shipped a RAG pipeline that cut support resolution time by 38%…"
                    value={exp.description}
                    onChange={(e) => update(exp.id, "description", e.target.value)}
                  />
                </Field>
              </div>
            </RepeatableItem>
          ))}
        </AnimatePresence>
        {data.experience.length === 0 && (
          <EmptyHint text="No experience yet? Add internships, freelance gigs, research or open-source contributions." />
        )}
      </div>
    </SectionShell>
  );
}
