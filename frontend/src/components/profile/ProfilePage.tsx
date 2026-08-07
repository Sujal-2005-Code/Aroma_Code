"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Globe2,
  GitBranch,
  Link2,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  ShieldCheck,
  Star,
  Tag,
  Toolbox,
  Trash2,
  User,
  Users,
  X,
  Plus,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfilePhoto } from "./ProfilePhoto";
import { ToastContainer, type ToastMessage } from "./Toast";
import type {
  AchievementEntry,
  EducationEntry,
  ExperienceEntry,
  PassportSummary,
  ProfileInfo,
  SkillEntry,
  SocialLink,
} from "@/types";

const initialProfile: ProfileInfo = {
  fullName: "Arjun Mehta",
  headline: "AI Talent Architect & Career Strategist",
  tagline: "Designing premium career journeys with precision and data-driven intuition.",
  bio: "I build powerful candidate narratives for AI-first careers, blending performance signals, verified skills, and storytelling into a high-impact personal brand.",
  location: "Bengaluru, India",
  website: "arjun.ai",
  phone: "+91 98765 43210",
  birthday: "1993-09-18",
  languages: ["English", "Hindi", "French"],
  interests: ["AI Ethics", "Product Design", "Travel", "Growth Strategy"],
};

const experienceData: ExperienceEntry[] = [
  {
    id: "exp-1",
    company: "AROMA Labs",
    logoText: "AR",
    logoColor: "from-violet-500 to-fuchsia-500",
    jobTitle: "Head of AI Product",
    employmentType: "Full-time",
    locationType: "Hybrid",
    location: "Bengaluru, India",
    startDate: "2023-01-01",
    currentlyWorking: true,
    description: "Leading a premium AI talent platform for high-growth startups and enterprises. I define product strategy, mentor engineers, and design the candidate experience.",
    skills: ["Roadmapping", "AI Hiring", "Product Ops"],
  },
  {
    id: "exp-2",
    company: "Google Brain",
    logoText: "GB",
    logoColor: "from-sky-500 to-cyan-500",
    jobTitle: "Research Engineer",
    employmentType: "Contract",
    locationType: "Remote",
    location: "Global",
    startDate: "2021-05-01",
    endDate: "2022-12-31",
    currentlyWorking: false,
    description: "Built AI models for knowledge search and scaling research workflows, collaborating across research, design, and engineering teams.",
    skills: ["Transformer Models", "Python", "MLOps"],
  },
  {
    id: "exp-3",
    company: "Meta",
    logoText: "ME",
    logoColor: "from-purple-500 to-indigo-500",
    jobTitle: "Product Analyst",
    employmentType: "Full-time",
    locationType: "On-site",
    location: "Menlo Park, CA",
    startDate: "2019-09-01",
    endDate: "2021-04-30",
    currentlyWorking: false,
    description: "Designed growth experiments, performance dashboards and insights for social experiences at scale.",
    skills: ["Analytics", "Experimentation", "SQL"],
  },
];

const educationData: EducationEntry[] = [
  {
    id: "edu-1",
    school: "Stanford University",
    degree: "M.S.",
    fieldOfStudy: "Computer Science",
    startDate: "2017-08-01",
    endDate: "2019-05-31",
    currentlyStudying: false,
    grade: "3.9 GPA",
    activities: ["AI Club", "Product Lab"],
    description: "Specialized in machine learning products and human-centered computing.",
    logoText: "SU",
    logoColor: "from-red-500 to-pink-500",
  },
  {
    id: "edu-2",
    school: "MIT",
    degree: "B.S.",
    fieldOfStudy: "Electrical Engineering",
    startDate: "2013-08-01",
    endDate: "2017-05-31",
    currentlyStudying: false,
    grade: "9.8 CGPA",
    activities: ["Robotics Team", "Startups Club"],
    description: "Focused on systems, algorithms, and real-world engineering practice.",
    logoText: "MIT",
    logoColor: "from-amber-500 to-orange-500",
  },
];

const achievementData: AchievementEntry[] = [
  {
    id: "ach-1",
    title: "AWS Certified Machine Learning",
    issuer: "Amazon",
    type: "Certification",
    emoji: "☁️",
    date: "2024-04-12",
    description: "Verified cloud machine learning expertise for high-scale production systems.",
    url: "https://example.com/cert/aws-ml",
    colorClass: "from-sky-500 to-indigo-500",
  },
  {
    id: "ach-2",
    title: "NeurIPS Best Paper Award",
    issuer: "NeurIPS",
    type: "Award",
    emoji: "🏆",
    date: "2023-12-08",
    description: "Recognized research advances in neural architecture optimization.",
    url: "https://example.com/award/neurips",
    colorClass: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "ach-3",
    title: "Google Cloud Innovator",
    issuer: "Google",
    type: "Certification",
    emoji: "🚀",
    date: "2023-08-17",
    description: "Demonstrated expertise in building scalable cloud AI systems.",
    url: "https://example.com/cert/google-cloud",
    colorClass: "from-cyan-500 to-blue-500",
  },
  {
    id: "ach-4",
    title: "Forbes 30 Under 30",
    issuer: "Forbes",
    type: "Recognition",
    emoji: "🌟",
    date: "2022-11-05",
    description: "Featured for building innovative talent intelligence products.",
    url: "https://example.com/forbes",
    colorClass: "from-amber-400 to-orange-500",
  },
];

const socialData: SocialLink[] = [
  { id: "link-1", platform: "GitHub", username: "arjunmehta", url: "https://github.com/arjunmehta", brandColor: "from-slate-800 to-slate-500", icon: "GitHub" },
  { id: "link-2", platform: "LinkedIn", username: "arjun-mehta", url: "https://linkedin.com/in/arjun-mehta", brandColor: "from-blue-500 to-cyan-500", icon: "LinkedIn" },
  { id: "link-3", platform: "Twitter", username: "@arjun_ai", url: "https://twitter.com/arjun_ai", brandColor: "from-sky-500 to-blue-600", icon: "Twitter" },
  { id: "link-4", platform: "Portfolio", username: "arjun.ai", url: "https://arjun.ai", brandColor: "from-violet-500 to-fuchsia-500", icon: "Globe" },
];

const skillEntries: SkillEntry[] = [
  {
    id: "skill-1",
    category: "AI",
    name: "Machine Learning",
    verified: true,
    level: "Expert",
    endorsements: 124,
    overall: 96,
    scores: { assessment: 98, github: 92, coding: 94, passport: 96, resume: 84, portfolio: 88 },
  },
  {
    id: "skill-2",
    category: "Engineering",
    name: "TypeScript",
    verified: true,
    level: "Advanced",
    endorsements: 78,
    overall: 88,
    scores: { assessment: 84, github: 88, coding: 92, passport: 86, resume: 78, portfolio: 80 },
  },
  {
    id: "skill-3",
    category: "Product",
    name: "Roadmapping",
    verified: true,
    level: "Advanced",
    endorsements: 68,
    overall: 82,
    scores: { assessment: 78, github: 60, coding: 52, passport: 90, resume: 84, portfolio: 82 },
  },
  {
    id: "skill-4",
    category: "Cloud",
    name: "MLOps",
    verified: false,
    level: "Intermediate",
    endorsements: 42,
    overall: 74,
    scores: { assessment: 82, github: 76, coding: 70, passport: 68, resume: 72, portfolio: 74 },
  },
  {
    id: "skill-5",
    category: "Design",
    name: "UX Strategy",
    verified: false,
    level: "Intermediate",
    endorsements: 38,
    overall: 72,
    scores: { assessment: 70, github: 54, coding: 48, passport: 80, resume: 76, portfolio: 84 },
  },
  {
    id: "skill-6",
    category: "Data",
    name: "SQL",
    verified: true,
    level: "Advanced",
    endorsements: 89,
    overall: 86,
    scores: { assessment: 88, github: 80, coding: 84, passport: 86, resume: 82, portfolio: 80 },
  },
];

export function ProfilePage() {
  const [profile, setProfile] = useState<ProfileInfo>(initialProfile);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [experiences, setExperiences] = useState<ExperienceEntry[]>(experienceData);
  const [educations] = useState<EducationEntry[]>(educationData);
  const [achievements] = useState<AchievementEntry[]>(achievementData);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(socialData);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [editExperience, setEditExperience] = useState<ExperienceEntry | null>(null);
  const [experienceModal, setExperienceModal] = useState(false);
  const [toastList, setToastList] = useState<ToastMessage[]>([]);
  const [addStep, setAddStep] = useState(1);
  const [experienceDraft, setExperienceDraft] = useState<ExperienceEntry>({
    id: "",
    company: "",
    logoText: "",
    logoColor: "from-violet-500 to-fuchsia-500",
    jobTitle: "",
    employmentType: "Full-time",
    locationType: "Hybrid",
    location: "",
    startDate: "",
    endDate: undefined,
    currentlyWorking: false,
    description: "",
    skills: [],
  });

  const passportSummary: PassportSummary = useMemo(
    () => ({ score: 94, totalSkills: 42, verifiedSkills: 19, endorsements: 582, averageLevel: 4.2 }),
    []
  );

  const addToast = (toast: ToastMessage) => {
    setToastList((current) => [...current, toast]);
    window.setTimeout(() => setToastList((current) => current.filter((item) => item.id !== toast.id)), 4500);
  };

  const handleSaveProfile = (nextProfile: ProfileInfo) => {
    setProfile(nextProfile);
    setAboutOpen(false);
    addToast({
      id: `toast-${Date.now()}`,
      title: "Profile updated",
      description: "Your About section has been saved.",
      variant: "success",
    });
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences((items) => items.filter((item) => item.id !== id));
    addToast({ id: `toast-${Date.now()}`, title: "Experience removed", description: "The entry was deleted successfully.", variant: "info" });
  };

  const handleOpenExperience = (entry?: ExperienceEntry) => {
    setEditExperience(entry ?? null);
    setExperienceDraft(
      entry ?? {
        id: `exp-${Date.now()}`,
        company: "",
        logoText: "",
        logoColor: "from-violet-500 to-fuchsia-500",
        jobTitle: "",
        employmentType: "Full-time",
        locationType: "Hybrid",
        location: "",
        startDate: "",
        endDate: undefined,
        currentlyWorking: false,
        description: "",
        skills: [],
      }
    );
    setAddStep(1);
    setExperienceModal(true);
  };

  const handleSaveExperience = () => {
    setExperiences((list) => {
      if (editExperience) {
        return list.map((item) => (item.id === experienceDraft.id ? experienceDraft : item));
      }
      return [experienceDraft, ...list];
    });
    setExperienceModal(false);
    addToast({ id: `toast-${Date.now()}`, title: "Experience saved", description: "Your timeline has been updated.", variant: "success" });
  };

  const durationTag = (entry: ExperienceEntry) => {
    const start = new Date(entry.startDate);
    const end = entry.currentlyWorking ? new Date() : new Date(entry.endDate || entry.startDate);
    const months = Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainder = months % 12;
    return `${entry.startDate} – ${entry.currentlyWorking ? "Present" : entry.endDate} · ${years ? `${years}y ` : ""}${remainder}m`;
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1200px] space-y-6 pb-6">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_34%)] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.24)] backdrop-blur-xl md:p-8">
          <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.1),transparent_30%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="flex flex-col items-center gap-6 rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_45px_rgba(6,11,35,0.35)] backdrop-blur-xl">
              <ProfilePhoto name={profile.fullName} avatarUrl={avatarUrl} onSave={setAvatarUrl} onToast={addToast} />
              <div className="space-y-2 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Online • Verified</p>
                <h1 className="text-3xl font-semibold text-white">{profile.fullName}</h1>
                <p className="text-sm text-slate-300">{profile.headline}</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge variant="success">Remote-friendly</Badge>
                <Badge variant="pink">AI Career Strategist</Badge>
                <Badge variant="secondary">Premium Profile</Badge>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Profile metrics</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Premium Dashboard</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="default" onClick={() => setAboutOpen(true)}>
                    Edit Profile
                  </Button>
                  <Button variant="secondary">Share Profile</Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="rounded-3xl border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-brand-orange to-brand-pink text-white shadow-[0_20px_45px_rgba(252,143,15,0.18)]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-white">42</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Projects</p>
                    </div>
                  </div>
                </Card>
                <Card className="rounded-3xl border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_20px_45px_rgba(56,189,248,0.18)]">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-white">19</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Verified Skills</p>
                    </div>
                  </div>
                </Card>
                <Card className="rounded-3xl border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-emerald-500 to-lime-400 text-white shadow-[0_20px_45px_rgba(16,185,129,0.18)]">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-white">94%</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Profile Strength</p>
                    </div>
                  </div>
                </Card>
                <Card className="rounded-3xl border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow-[0_20px_45px_rgba(236,72,153,0.18)]">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-white">18</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Achievements</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[32px] border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">About</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Career profile</h2>
              </div>
              <Button variant="outline" onClick={() => setAboutOpen(true)}>
                Edit
              </Button>
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-300">{profile.bio}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <InfoTile icon={<MapPin className="h-4 w-4" />} label="Location" value={profile.location} />
              <InfoTile icon={<Globe2 className="h-4 w-4" />} label="Website" value={profile.website} />
              <InfoTile icon={<Phone className="h-4 w-4" />} label="Phone" value={profile.phone} />
              <InfoTile icon={<CalendarDays className="h-4 w-4" />} label="Birthday" value={profile.birthday} />
              <InfoTile icon={<Users className="h-4 w-4" />} label="Languages" value={profile.languages.join(", ")} />
              <InfoTile icon={<Tag className="h-4 w-4" />} label="Interests" value={profile.interests.join(", ")} />
            </div>
          </Card>

          <Card className="rounded-[32px] border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Passport summary</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Skill signal</h2>
              </div>
              <Badge variant="success">Live</Badge>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Score", value: `${passportSummary.score}%` },
                { label: "Skills", value: `${passportSummary.totalSkills}` },
                { label: "Verified", value: `${passportSummary.verifiedSkills}` },
                { label: "Endorsements", value: `${passportSummary.endorsements}` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="space-y-6">
          <SectionHeader title="Experience" description="A polished timeline of your premium roles and contributions." actionLabel="Add Experience" onAction={() => handleOpenExperience()} />
          <div className="space-y-5">
            {experiences.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.2)] backdrop-blur-xl"
              >
                <div className="absolute left-7 top-0 h-full w-px bg-gradient-to-b from-brand-orange to-fuchsia-500 opacity-40" />
                <div className="relative grid gap-4 xl:grid-cols-[0.95fr_0.95fr]">
                  <div className="flex items-start gap-4">
                    <div className={`grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br ${entry.logoColor} text-white shadow-[0_24px_80px_rgba(59,130,246,0.18)]`}>
                      <span className="text-xl font-semibold">{entry.logoText}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                        <span>{entry.employmentType}</span>
                        <span className="rounded-full border border-white/10 px-2 py-1">{entry.locationType}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">{entry.jobTitle}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                        <span>{entry.company}</span>
                        <span>•</span>
                        <span>{durationTag(entry)}</span>
                        {entry.currentlyWorking ? <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Currently Working</span> : null}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm leading-7 text-slate-300">{entry.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleOpenExperience(entry)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteExperience(entry.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader title="Education" description="Academic milestones that support your AI career story." />
          <div className="grid gap-5 lg:grid-cols-2">
            {educations.map((edu) => (
              <Card key={edu.id} className="rounded-[28px] border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className={`grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br ${edu.logoColor} text-white text-lg font-semibold`}>
                    {edu.logoText}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{edu.school}</p>
                    <h3 className="text-lg font-semibold text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span>{edu.startDate} – {edu.currentlyStudying ? "Present" : edu.endDate}</span>
                  <span>•</span>
                  <span>{edu.grade}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {edu.activities.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{edu.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader title="Achievements" description="Verified awards, certifications, and credentials." />
          <div className="grid gap-4 xl:grid-cols-2">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="rounded-[28px] border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-3xl">{achievement.emoji}</p>
                    <h3 className="mt-3 text-lg font-semibold text-white">{achievement.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{achievement.issuer}</p>
                  </div>
                  <div className={`grid h-12 w-12 place-items-center rounded-3xl bg-gradient-to-br ${achievement.colorClass} text-white shadow-[0_20px_45px_rgba(255,255,255,0.12)]`}>
                    <span className="text-sm">{achievement.type}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300 line-clamp-3">{achievement.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-400">
                  <span>{achievement.date}</span>
                  {achievement.url ? (
                    <a href={achievement.url} target="_blank" rel="noreferrer" className="text-brand-orange hover:underline">
                      Credential link
                    </a>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader title="Social links" description="A premium network of verified profile links." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {socialLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4, scale: 1.01 }}
                className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition-shadow hover:shadow-[0_30px_60px_rgba(59,130,246,0.16)]"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${link.brandColor} text-white shadow-[0_15px_40px_rgba(59,130,246,0.25)]`}>
                  {link.icon === "GitHub" && <GitBranch className="h-5 w-5" />}
                  {link.icon === "LinkedIn" && <Link2 className="h-5 w-5" />}
                  {link.icon === "Twitter" && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M22.46 6c-.77.35-1.6.59-2.47.69a4.3 4.3 0 0 0 1.87-2.36 8.45 8.45 0 0 1-2.7 1.03 4.23 4.23 0 0 0-7.2 3.86A12.01 12.01 0 0 1 3.15 4.4a4.22 4.22 0 0 0 1.31 5.64 4.18 4.18 0 0 1-1.92-.53v.05a4.24 4.24 0 0 0 3.39 4.15 4.22 4.22 0 0 1-1.91.07 4.24 4.24 0 0 0 3.96 2.95 8.49 8.49 0 0 1-5.26 1.81A8.56 8.56 0 0 1 2 19.55a12 12 0 0 0 6.5 1.9c7.79 0 12.06-6.46 12.06-12.06 0-.18-.01-.35-.02-.53A8.65 8.65 0 0 0 24 5.57a8.52 8.52 0 0 1-2.54.7z" />
                    </svg>
                  )}
                  {link.icon === "Globe" && <Globe2 className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm text-slate-500">{link.platform}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{link.username}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </div>

      <ToastContainer toasts={toastList} onDismiss={(id) => setToastList((current) => current.filter((toast) => toast.id !== id))} />

      {aboutOpen ? (
        <Modal onClose={() => setAboutOpen(false)}>
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Edit About</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Update your profile summary</h3>
              </div>
              <button onClick={() => setAboutOpen(false)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4">
              <InputRow label="Headline" value={profile.headline} onChange={(value) => setProfile((prev) => ({ ...prev, headline: value }))} />
              <InputRow label="Tagline" value={profile.tagline} onChange={(value) => setProfile((prev) => ({ ...prev, tagline: value }))} textarea />
              <InputRow label="Bio" value={profile.bio} onChange={(value) => setProfile((prev) => ({ ...prev, bio: value }))} textarea maxLength={1000} help="1000 characters max" />
              <InputRow label="Location" value={profile.location} onChange={(value) => setProfile((prev) => ({ ...prev, location: value }))} />
              <InputRow label="Website" value={profile.website} onChange={(value) => setProfile((prev) => ({ ...prev, website: value }))} />
              <InputRow label="Phone" value={profile.phone} onChange={(value) => setProfile((prev) => ({ ...prev, phone: value }))} />
              <InputRow label="Birthday" value={profile.birthday} onChange={(value) => setProfile((prev) => ({ ...prev, birthday: value }))} type="date" />
              <InputRow label="Languages" value={profile.languages.join(", ")} onChange={(value) => setProfile((prev) => ({ ...prev, languages: value.split(",").map((item) => item.trim()) }))} />
              <InputRow label="Interests" value={profile.interests.join(", ")} onChange={(value) => setProfile((prev) => ({ ...prev, interests: value.split(",").map((item) => item.trim()) }))} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="default" onClick={() => handleSaveProfile(profile)}>
                Save changes
              </Button>
              <Button variant="secondary" onClick={() => setAboutOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}

      {experienceModal ? (
        <Modal onClose={() => setExperienceModal(false)}>
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{editExperience ? "Edit Experience" : "Add Experience"}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{addStep === 1 ? "Work details" : "Description & skills"}</h3>
              </div>
              <button onClick={() => setExperienceModal(false)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4">
              {addStep === 1 ? (
                <>
                  <InputRow label="Job title" value={experienceDraft.jobTitle} onChange={(value) => setExperienceDraft((prev) => ({ ...prev, jobTitle: value }))} />
                  <InputRow label="Company" value={experienceDraft.company} onChange={(value) => setExperienceDraft((prev) => ({ ...prev, company: value }))} />
                  <InputRow label="Location" value={experienceDraft.location} onChange={(value) => setExperienceDraft((prev) => ({ ...prev, location: value }))} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputRow label="Employment type" value={experienceDraft.employmentType} onChange={(value) => setExperienceDraft((prev) => ({ ...prev, employmentType: value as typeof prev.employmentType }))} />
                    <InputRow label="Location type" value={experienceDraft.locationType} onChange={(value) => setExperienceDraft((prev) => ({ ...prev, locationType: value as typeof prev.locationType }))} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputRow label="Start date" value={experienceDraft.startDate} onChange={(value) => setExperienceDraft((prev) => ({ ...prev, startDate: value }))} type="date" />
                    <InputRow label="End date" value={experienceDraft.endDate || ""} onChange={(value) => setExperienceDraft((prev) => ({ ...prev, endDate: value || undefined }))} type="date" />
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={experienceDraft.currentlyWorking}
                      onChange={(event) => setExperienceDraft((prev) => ({ ...prev, currentlyWorking: event.target.checked }))}
                      className="h-4 w-4 rounded border-white/10 bg-slate-950 text-brand-orange focus:ring-brand-orange"
                    />
                    Currently work here
                  </label>
                </>
              ) : (
                <>
                  <InputRow
                    label="Description"
                    value={experienceDraft.description}
                    onChange={(value) => setExperienceDraft((prev) => ({ ...prev, description: value }))}
                    textarea
                    maxLength={2000}
                    help="Describe your impact and results."
                  />
                  <InputRow label="Skills used" value={experienceDraft.skills.join(", ")} onChange={(value) => setExperienceDraft((prev) => ({ ...prev, skills: value.split(",").map((item) => item.trim()).filter(Boolean) }))} />
                  <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm font-semibold text-white">Writing tip</p>
                    <p className="mt-2 text-sm text-slate-400">Keep bullets precise, mention the outcome, and highlight tools or AI systems you owned.</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {addStep === 1 ? (
                <Button variant="default" onClick={() => setAddStep(2)}>
                  Continue to step 2
                </Button>
              ) : (
                <Button variant="default" onClick={handleSaveExperience}>
                  Save experience
                </Button>
              )}
              <Button variant="secondary" onClick={() => setExperienceModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </DashboardLayout>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
      <div className="flex items-center gap-2 text-slate-300">{icon}<span className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</span></div>
      <p className="mt-3 text-sm text-white">{value}</p>
    </div>
  );
}

function SectionHeader({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-slate-950/60 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{description}</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
      </div>
      {actionLabel ? (
        <Button variant="default" onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function InputRow({ label, value, onChange, textarea, type = "text", maxLength, help }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; type?: string; maxLength?: number; help?: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
        <label className="font-medium text-white">{label}</label>
        {help ? <span>{help}</span> : null}
      </div>
      {textarea ? (
        <textarea
          rows={textarea ? 4 : 1}
          value={value}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-orange/40 focus:ring-2 focus:ring-brand-orange/10"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-orange/40 focus:ring-2 focus:ring-brand-orange/10"
        />
      )}
    </div>
  );
}
