"use client";

import type { PortfolioData } from "@/types/portfolio";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ExternalLink, Calendar, Download, Send, Award, Briefcase, GraduationCap, Code, Trophy, Target, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GradientText, FloatingOrb, GradientDivider } from "./effects/AnimatedEffects";

interface PortfolioPreviewProps {
  data: PortfolioData;
  className?: string;
}

const themes: Record<string, {
  bg: string;
  cardBg: string;
  text: string;
  accent: string;
  hero: string;
  gradient: string;
}> = {
  "modern-dark": {
    bg: "bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950",
    cardBg: "bg-white/5 backdrop-blur-xl border border-white/10",
    text: "text-white",
    accent: "text-purple-400",
    hero: "from-purple-500 via-pink-500 to-orange-500",
    gradient: "",
  },
  "minimal": {
    bg: "bg-bg-primary",
    cardBg: "bg-white/5 border border-border-subtle",
    text: "text-text-primary",
    accent: "text-brand-orange",
    hero: "from-brand-orange to-brand-pink",
    gradient: "",
  },
  "glassmorphism": {
    bg: "bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-xl",
    cardBg: "bg-white/10 backdrop-blur-2xl border border-white/20",
    text: "text-white",
    accent: "text-pink-300",
    hero: "from-pink-400 via-purple-400 to-blue-400",
    gradient: "",
  },
  "cyberpunk": {
    bg: "bg-black",
    cardBg: "bg-cyan-950/30 backdrop-blur-xl border border-cyan-500/30",
    text: "text-cyan-100",
    accent: "text-cyan-400",
    hero: "from-cyan-400 via-pink-500 to-purple-500",
    gradient: "",
  },
  "developer": {
    bg: "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900",
    cardBg: "bg-gray-800/50 backdrop-blur-xl border border-emerald-500/20",
    text: "text-gray-100",
    accent: "text-emerald-400",
    hero: "from-emerald-400 via-teal-500 to-cyan-500",
    gradient: "",
  },
  "creative": {
    bg: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500",
    cardBg: "bg-white/10 backdrop-blur-xl border border-white/20",
    text: "text-white",
    accent: "text-yellow-300",
    hero: "from-yellow-300 via-orange-300 to-pink-300",
    gradient: "",
  },
  "gradient": {
    bg: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
    cardBg: "bg-white/10 backdrop-blur-xl border border-white/20",
    text: "text-white",
    accent: "text-yellow-200",
    hero: "from-yellow-200 via-pink-200 to-white",
    gradient: "",
  },
  "apple": {
    bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
    cardBg: "bg-white border border-gray-200 shadow-lg",
    text: "text-gray-900",
    accent: "text-blue-600",
    hero: "from-gray-900 via-blue-600 to-purple-600",
    gradient: "",
  },
  "github": {
    bg: "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900",
    cardBg: "bg-gray-800/50 backdrop-blur-xl border border-gray-700",
    text: "text-gray-100",
    accent: "text-purple-400",
    hero: "from-purple-400 via-pink-400 to-blue-400",
    gradient: "",
  },
  "framer": {
    bg: "bg-black",
    cardBg: "bg-zinc-900/50 backdrop-blur-xl border border-zinc-800",
    text: "text-white",
    accent: "text-violet-400",
    hero: "from-violet-400 via-fuchsia-400 to-pink-400",
    gradient: "",
  },
};

export function PortfolioPreview({ data, className }: PortfolioPreviewProps) {
  const theme = themes[data.theme] || themes["modern-dark"];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className={cn("min-h-screen relative overflow-hidden", theme.bg, theme.text, className)}>
      <FloatingOrb color={theme.hero} size="xl" position="top-0 -right-40" delay={0} />
      <FloatingOrb color="from-purple-500 to-pink-500" size="lg" position="top-1/3 -left-40" delay={2} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-6 py-16 space-y-24 relative z-10"
      >
        {/* Hero Section */}
        <motion.section variants={item} className="text-center space-y-8 py-16">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="inline-block">
            <div className={cn(
              "h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br",
              theme.hero,
              "flex items-center justify-center text-5xl md:text-6xl font-bold text-white shadow-2xl"
            )}>
              {data.personalInfo.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </motion.div>

          <h1 className={cn("text-5xl md:text-7xl font-bold tracking-tight leading-tight")}>
            <GradientText variant="vibrant" className={cn("bg-gradient-to-r bg-clip-text text-transparent", theme.hero)}>
              {data.personalInfo.fullName || "Your Name"}
            </GradientText>
          </h1>

          {data.personalInfo.headline && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto">
              {data.personalInfo.headline}
            </motion.p>
          )}

          {data.summary && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg max-w-3xl mx-auto text-text-muted leading-relaxed">
              {data.summary}
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {data.personalInfo.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10">
                <MapPin className="h-3.5 w-3.5" />
                {data.personalInfo.location}
              </span>
            )}
            {data.personalInfo.email && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10">
                <Mail className="h-3.5 w-3.5" />
                {data.personalInfo.email}
              </span>
            )}
            {data.personalInfo.phone && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10">
                <Phone className="h-3.5 w-3.5" />
                {data.personalInfo.phone}
              </span>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-3 pt-2">
            {data.socialLinks.github && (
              <a href={data.socialLinks.github} target="_blank" rel="noopener noreferrer" className="group h-10 w-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.756-1.332-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.627 0 12 0z"/></svg>
              </a>
            )}
            {data.socialLinks.linkedin && (
              <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="group h-10 w-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            )}
            {data.socialLinks.twitter && (
              <a href={data.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="group h-10 w-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
          </motion.div>
        </motion.section>

        {/* About Section */}
        {data.bio && (
          <motion.section variants={item} className="space-y-6">
            <SectionHeader icon={Target} title="About Me" gradient={theme.hero} />
            <div className={cn("rounded-2xl p-8", theme.cardBg)}>
              <p className="text-lg leading-relaxed text-text-muted">{data.bio}</p>
            </div>
          </motion.section>
        )}

        {/* Experience Section */}
        {data.workExperience && data.workExperience.length > 0 && (
          <motion.section variants={item} className="space-y-6">
            <SectionHeader icon={Briefcase} title="Experience" gradient={theme.hero} />
            <div className="space-y-4">
              {data.workExperience.map((exp, i) => (
                <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={cn("rounded-2xl p-6 relative", theme.cardBg, "hover:scale-[1.02] transition-transform")}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{exp.role}</h3>
                      <p className={cn("text-base font-medium", theme.accent)}>{exp.company}</p>
                    </div>
                    <div className={cn("text-sm flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit")}>
                      <Calendar className="h-3.5 w-3.5" />
                      {exp.startDate} - {exp.endDate || "Present"}
                    </div>
                  </div>
                  {exp.location && (
                    <p className="text-sm text-text-muted mb-3 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {exp.location}
                    </p>
                  )}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="list-none space-y-2 mb-4">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex gap-3 text-text-muted">
                          <span className={cn("mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0 bg-gradient-to-r", theme.hero)} />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <motion.section variants={item} className="space-y-6">
            <SectionHeader icon={Code} title="Projects" gradient={theme.hero} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={cn("group rounded-2xl p-6 overflow-hidden relative", theme.cardBg)}>
                  <div className={cn("absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl", theme.hero)} />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold group-hover:gradient-text transition-all">{project.name}</h3>
                      <div className="flex gap-2">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.756-1.332-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.627 0 12 0z"/></svg>
                          </a>
                        )}
                        {project.liveLink && (
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-text-muted mb-4 leading-relaxed">{project.description}</p>
                    {project.features && project.features.length > 0 && (
                      <ul className="list-none text-sm space-y-1 mb-4">
                        {project.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex gap-2 text-text-muted">
                            <span className={cn("mt-2 h-1 w-1 rounded-full flex-shrink-0 bg-gradient-to-r", theme.hero)} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, idx) => (
                        <Badge key={idx} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills Section */}
        {data.skills && Object.keys(data.skills).some((k) => ((data.skills as any)[k] || []).length > 0) && (
          <motion.section variants={item} className="space-y-6">
            <SectionHeader icon={Sparkles} title="Skills" gradient={theme.hero} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.skills).map(([category, skills]) => {
                if (!skills || (skills as any[]).length === 0) return null;
                return (
                  <div key={category} className={cn("rounded-2xl p-5", theme.cardBg)}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-text-muted">
                      {category.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(skills as any[]).map((skill: any, idx: number) => (
                        <Badge key={idx} variant="secondary">{skill.name}</Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <motion.section variants={item} className="space-y-6">
            <SectionHeader icon={GraduationCap} title="Education" gradient={theme.hero} />
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <motion.div key={edu.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={cn("rounded-2xl p-6", theme.cardBg)}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold">{edu.degree}</h3>
                      <p className={cn("text-base font-medium", theme.accent)}>{edu.college || edu.university}</p>
                      {edu.branch && <p className="text-text-muted text-sm">{edu.branch}</p>}
                    </div>
                    <div className={cn("text-sm flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit")}>
                      <Calendar className="h-3.5 w-3.5" />
                      {edu.startDate} - {edu.endDate || "Present"}
                    </div>
                  </div>
                  {edu.cgpa && (
                    <div className="mt-3">
                      <span className="text-sm text-text-muted">CGPA: </span>
                      <span className="font-semibold">{edu.cgpa}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Certificates Section */}
        {data.certificates && data.certificates.length > 0 && (
          <motion.section variants={item} className="space-y-6">
            <SectionHeader icon={Award} title="Certificates" gradient={theme.hero} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certificates.map((cert, i) => (
                <motion.div key={cert.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className={cn("rounded-2xl p-5", theme.cardBg)}>
                  <Award className={cn("h-6 w-6 mb-3", theme.accent)} />
                  <h3 className="text-lg font-bold mb-1">{cert.name}</h3>
                  <p className={cn("text-sm font-medium mb-2", theme.accent)}>{cert.organization}</p>
                  <p className="text-xs text-text-muted">Issued: {cert.issueDate}</p>
                  {cert.verificationLink && (
                    <a href={cert.verificationLink} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-foreground mt-2 inline-block">
                      Verify Certificate →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Achievements Section */}
        {data.achievements && data.achievements.length > 0 && (
          <motion.section variants={item} className="space-y-6">
            <SectionHeader icon={Trophy} title="Achievements" gradient={theme.hero} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.achievements.map((ach, i) => (
                <motion.div key={ach.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={cn("rounded-2xl p-5", theme.cardBg)}>
                  <Trophy className={cn("h-6 w-6 mb-3", theme.accent)} />
                  <h3 className="text-lg font-bold mb-2">{ach.title}</h3>
                  {ach.description && <p className="text-sm text-text-muted">{ach.description}</p>}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Contact Section */}
        <motion.section variants={item} className="space-y-6">
          <SectionHeader icon={Send} title="Let's Connect" gradient={theme.hero} />
          <div className={cn("rounded-2xl p-8 text-center", theme.cardBg)}>
            <p className="text-lg text-text-muted mb-6">Interested in working together? Let&apos;s chat!</p>
            <div className="flex flex-wrap justify-center gap-3">
              {data.personalInfo.email && (
                <a href={`mailto:${data.personalInfo.email}`} className={cn("px-6 py-3 rounded-full bg-gradient-to-r font-semibold", theme.hero, "text-white hover:scale-105 transition-transform inline-flex items-center")}>
                  <Mail className="h-4 w-4 inline mr-2" />
                  Send Email
                </a>
              )}
              <Button variant="outline" className="px-6 py-3 rounded-full">
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer variants={item} className="text-center py-10">
          <GradientDivider className="mb-6" />
          <p className="text-sm text-text-muted">© {new Date().getFullYear()} {data.personalInfo.fullName}. All rights reserved.</p>
          <p className="text-xs text-text-muted mt-2 flex items-center justify-center gap-1">
            Built with <Sparkles className="h-3 w-3 text-brand-orange" /> AROMA AI Talent Intelligence Platform
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, gradient }: { icon: any; title: string; gradient: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", gradient)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-text-primary">{title}</h2>
    </div>
  );
}
