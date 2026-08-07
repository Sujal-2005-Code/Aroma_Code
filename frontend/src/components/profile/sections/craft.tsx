"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GitBranch, Globe, Plus, Rocket, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import {
  EmptyHint,
  Field,
  RepeatableItem,
  SectionShell,
  TagInput,
  TextField,
} from "@/components/profile/fields";
import { SKILL_GROUPS, type ProfileData, type ProjectEntry } from "@/lib/profile";
import { uid } from "@/lib/utils";

type Props = { data: ProfileData; patch: (p: Partial<ProfileData>) => void };

export function ProjectsSection({ data, patch }: Props) {
  const add = () =>
    patch({
      projects: [
        ...data.projects,
        { id: uid("prj"), name: "", description: "", tech: [], github: "", demo: "" },
      ],
    });

  const update = <K extends keyof ProjectEntry>(id: string, field: K, value: ProjectEntry[K]) =>
    patch({ projects: data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)) });

  const remove = (id: string) => patch({ projects: data.projects.filter((p) => p.id !== id) });

  return (
    <SectionShell
      id="projects"
      index={4}
      icon={<Rocket className="h-5 w-5" />}
      title="Projects"
      description="Proof of work. Linked repos are parsed for stack, commit cadence and code quality signals."
      accent="from-pink-500/35 to-rose-500/20"
      action={
        <Button variant="glass" size="sm" onClick={add}>
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      }
    >
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {data.projects.map((project, i) => (
            <RepeatableItem
              key={project.id}
              index={i}
              title={project.name || "Untitled project"}
              subtitle={project.tech.slice(0, 4).join(" · ") || "Stack & links"}
              onRemove={() => remove(project.id)}
            >
              <div className="grid grid-cols-1 gap-4">
                <TextField
                  label="Project Name"
                  placeholder="AROMA Resume Intelligence"
                  value={project.name}
                  onChange={(e) => update(project.id, "name", e.target.value)}
                />
                <Field label="Description">
                  <Textarea
                    placeholder="What problem does it solve, what did you build, what was the measurable outcome?"
                    value={project.description}
                    onChange={(e) => update(project.id, "description", e.target.value)}
                  />
                </Field>
                <Field label="Technology Used" hint="Press Enter to add each technology">
                  <TagInput
                    value={project.tech}
                    onChange={(tech) => update(project.id, "tech", tech)}
                    placeholder="Next.js, FastAPI, pgvector…"
                    suggestions={["Next.js", "TypeScript", "Python", "PostgreSQL", "OpenAI", "Docker"]}
                    accent="from-pink-500/70 to-violet-500/60"
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="GitHub Link">
                    <div className="relative">
                      <GitBranch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        className="pl-10"
                        placeholder="github.com/you/project"
                        value={project.github}
                        onChange={(e) => update(project.id, "github", e.target.value)}
                      />
                    </div>
                  </Field>
                  <Field label="Live Demo Link">
                    <div className="relative">
                      <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        className="pl-10"
                        placeholder="project.vercel.app"
                        value={project.demo}
                        onChange={(e) => update(project.id, "demo", e.target.value)}
                      />
                    </div>
                  </Field>
                </div>
              </div>
            </RepeatableItem>
          ))}
        </AnimatePresence>
        {data.projects.length === 0 && (
          <EmptyHint text="Add 2–4 flagship projects. Recruiters open project links 3× more often than resumes." />
        )}
      </div>
    </SectionShell>
  );
}

export function SkillsSection({ data, patch }: Props) {
  const total = Object.values(data.skills).reduce((sum, list) => sum + list.length, 0);

  return (
    <SectionShell
      id="skills"
      index={5}
      icon={<Wrench className="h-5 w-5" />}
      title="Skills"
      description="Tag every capability. AROMA weights these against live job descriptions to compute match scores."
      accent="from-indigo-500/35 to-violet-500/20"
      action={
        <Badge variant="cyan">
          {total} skills tagged
          <span className="ml-1 text-cyan-300/70">/ 12 recommended</span>
        </Badge>
      }
    >
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (total / 18) * 100)}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {SKILL_GROUPS.map((group, i) => (
          <motion.div
            key={group.key}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="glass-soft rounded-2xl p-4 transition-colors duration-300 hover:border-white/20"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-100">{group.label}</p>
                <p className="text-[11px] text-slate-500">{group.hint}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                {data.skills[group.key].length}
              </span>
            </div>
            <TagInput
              value={data.skills[group.key]}
              onChange={(next) => patch({ skills: { ...data.skills, [group.key]: next } })}
              suggestions={group.suggestions}
              accent={group.accent}
              placeholder={`Add ${group.label.toLowerCase()}…`}
            />
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
