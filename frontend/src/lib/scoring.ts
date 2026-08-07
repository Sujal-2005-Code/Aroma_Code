import { CODING_PLATFORMS, type ProfileData, type SkillScores } from "@/lib/profile";
import { clamp } from "@/lib/utils";

const filled = (value?: string | null) => Boolean(value && value.trim().length > 0);

export type CompletionSection = {
  id: string;
  label: string;
  weight: number;
  done: boolean;
};

export function completionBreakdown(p: ProfileData): CompletionSection[] {
  const skillCount = Object.values(p.skills).reduce((sum, list) => sum + list.length, 0);
  const socialCount = Object.values(p.social).filter(filled).length;

  return [
    { id: "photo", label: "Profile Photo", weight: 8, done: filled(p.photoUrl) },
    {
      id: "personal",
      label: "Personal Info",
      weight: 16,
      done: [p.fullName, p.headline, p.about, p.email, p.phone, p.location].every(filled),
    },
    {
      id: "education",
      label: "Education",
      weight: 14,
      done: p.education.some((e) => filled(e.college) && filled(e.degree)),
    },
    {
      id: "experience",
      label: "Experience",
      weight: 12,
      done: p.experience.some((e) => filled(e.company) && filled(e.title)),
    },
    {
      id: "projects",
      label: "Projects",
      weight: 12,
      done: p.projects.some((e) => filled(e.name) && filled(e.description)),
    },
    { id: "skills", label: "Skills", weight: 12, done: skillCount >= 6 },
    {
      id: "certifications",
      label: "Certifications",
      weight: 6,
      done: p.certifications.some((c) => filled(c.name)),
    },
    { id: "social", label: "Social Links", weight: 8, done: socialCount >= 3 },
    { id: "resume", label: "Resume", weight: 7, done: Boolean(p.resume?.fileName) },
    {
      id: "preferences",
      label: "Career Preferences",
      weight: 5,
      done: filled(p.preferences.role) && filled(p.preferences.workMode),
    },
  ];
}

export function computeCompletion(p: ProfileData): number {
  const sections = completionBreakdown(p);
  const total = sections.reduce((sum, s) => sum + s.weight, 0);
  const earned = sections.reduce((sum, s) => sum + (s.done ? s.weight : 0), 0);
  return Math.round((earned / total) * 100);
}

export function computeScores(p: ProfileData): SkillScores {
  const skills = p.skills;
  const skillCount = Object.values(skills).reduce((sum, list) => sum + list.length, 0);
  const projects = p.projects.filter((x) => filled(x.name));
  const experience = p.experience.filter((x) => filled(x.company));
  const certifications = p.certifications.filter((x) => filled(x.name));
  const codingProfiles = CODING_PLATFORMS.filter((k) => filled(p.social[k])).length;
  const aboutWords = p.about.trim().split(/\s+/).filter(Boolean).length;
  const projectDescWords = projects.reduce(
    (sum, x) => sum + x.description.trim().split(/\s+/).filter(Boolean).length,
    0,
  );
  const githubLinks = projects.filter((x) => filled(x.github)).length;
  const liveLinks = projects.filter((x) => filled(x.demo)).length;
  const aiProjects = projects.filter((x) =>
    /(\bai\b|\bml\b|llm|neural|model|vision|nlp|rag|agent)/i.test(
      `${x.name} ${x.description} ${x.tech.join(" ")}`,
    ),
  ).length;

  const coding = clamp(
    10 +
      Math.min(skills.programming.length, 6) * 6 +
      codingProfiles * 6 +
      Math.min(githubLinks, 4) * 5 +
      Math.min(skills.backend.length, 4) * 2.5,
  );

  const atsRaw =
    (p.resume ? 24 : 6) +
    Math.min(aboutWords, 90) * 0.25 +
    Math.min(skillCount, 22) * 1.2 +
    Math.min(experience.length, 3) * 6 +
    Math.min(projects.length, 4) * 4 +
    Math.min(certifications.length, 3) * 3 +
    (filled(p.headline) ? 6 : 0) +
    (filled(p.location) ? 3 : 0);
  const ats = clamp(p.resume ? atsRaw : atsRaw * 0.78);

  const communication = clamp(
    10 +
      Math.min(skills.soft.length, 5) * 6 +
      Math.min(aboutWords, 120) * 0.22 +
      (filled(p.headline) ? 9 : 0) +
      Math.min(certifications.length, 3) * 4 +
      Math.min(projectDescWords, 160) * 0.08 +
      (filled(p.social.linkedin) ? 6 : 0) +
      (filled(p.social.twitter) ? 3 : 0),
  );

  const problemSolving = clamp(
    12 +
      codingProfiles * 8 +
      Math.min(projects.length, 4) * 5 +
      Math.min(skills.programming.length, 6) * 3 +
      Math.min(skills.aiml.length, 5) * 2 +
      Math.min(experience.length, 3) * 3,
  );

  const aiReadiness = clamp(
    8 +
      Math.min(skills.aiml.length, 5) * 7 +
      Math.min(aiProjects, 3) * 8 +
      Math.min(skills.tools.length, 6) * 2.5 +
      (filled(p.social.github) ? 5 : 0) +
      Math.min(skills.database.length, 4) * 2 +
      Math.min(liveLinks, 3) * 3,
  );

  const overall = Math.round(
    coding * 0.24 + ats * 0.2 + communication * 0.16 + problemSolving * 0.22 + aiReadiness * 0.18,
  );

  return {
    overall: clamp(overall),
    ats: Math.round(ats),
    coding: Math.round(coding),
    communication: Math.round(communication),
    problemSolving: Math.round(problemSolving),
    aiReadiness: Math.round(aiReadiness),
  };
}

export function generateInsights(p: ProfileData, scores: SkillScores): string[] {
  const out: string[] = [];
  const skillCount = Object.values(p.skills).reduce((sum, list) => sum + list.length, 0);

  if (!p.resume) out.push("Upload a resume to unlock full ATS parsing — worth up to +20 ATS points.");
  if (scores.ats >= 80) out.push("ATS parsing is strong: your profile will rank in the top recruiter filters.");
  if (p.about.trim().split(/\s+/).filter(Boolean).length < 40)
    out.push("Expand 'About Me' to 60–120 words with impact metrics for a stronger narrative score.");
  if (CODING_PLATFORMS.filter((k) => p.social[k]?.trim()).length < 2)
    out.push("Link at least two coding platforms (LeetCode, CodeChef…) to validate problem solving.");
  if (p.skills.aiml.length === 0)
    out.push("Add AI/ML skills or an AI project — AI readiness is the fastest-growing recruiter filter.");
  if (skillCount < 10) out.push("Recruiters shortlist profiles with 12+ tagged skills. Add a few more.");
  if (p.projects.filter((x) => x.github.trim()).length === 0)
    out.push("Attach GitHub links to projects so your code can be verified automatically.");
  if (scores.overall >= 75)
    out.push("Talent-match engine: you are a strong fit for AI/Full-stack early-career roles.");

  return out.slice(0, 5);
}
