"use client";

import { motion } from "framer-motion";
import { FileText, Code2, Award, Palette, Brain, Target, Video, Briefcase, GitBranch, BarChart3, Shield, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  { icon: FileText, title: "AI Resume Analyzer", description: "Get instant ATS scores, keyword optimization, and AI-powered suggestions to make your resume stand out.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Code2, title: "Coding Platform", description: "Practice 500+ problems with AI code reviews, detailed explanations, and real-time leaderboards.", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: Award, title: "AI Skill Passport", description: "A verified digital credential combining coding, projects, certificates, and soft skills into one score.", color: "text-brand-orange", bg: "bg-brand-orange/10" },
  { icon: Palette, title: "Portfolio Builder", description: "Generate stunning portfolios from your resume with multiple themes and one-click deployment.", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Brain, title: "AI Career Mentor", description: "24/7 personalized career guidance, interview prep, learning roadmaps, and motivation.", color: "text-brand-pink", bg: "bg-brand-pink/10" },
  { icon: Target, title: "Skill Gap Analysis", description: "Identify missing skills for your target role with estimated timelines and curated learning paths.", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Video, title: "Mock Interviews", description: "AI-powered mock interviews across HR, Technical, Behavioral, and System Design rounds.", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { icon: Briefcase, title: "Smart Job Portal", description: "AI-matched job recommendations with application tracking and interview scheduling.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: GitBranch, title: "GitHub Analytics", description: "Deep analysis of your GitHub profile including contributions, languages, and project quality.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: BarChart3, title: "Project Verification", description: "AI verifies your projects for code quality, architecture, security, and documentation.", color: "text-rose-400", bg: "bg-rose-500/10" },
  { icon: Shield, title: "Recruiter Dashboard", description: "Search, compare, and hire verified candidates with comprehensive skill analytics.", color: "text-teal-400", bg: "bg-teal-500/10" },
  { icon: Zap, title: "Resume to Portfolio", description: "Transform your resume into a beautiful portfolio website in seconds with AI.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-brand-orange mb-4">
            <Zap className="w-3.5 h-3.5" />
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything you need to <span className="gradient-text">land your dream job</span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            From resume optimization to AI-powered interviews, AROMA provides a complete career acceleration toolkit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Card hover className="h-full group">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
