"use client";

import { motion } from "framer-motion";
import { GraduationCap, Building2, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const studentBenefits = [
  "AI-powered resume optimization with ATS scoring",
  "Verified digital Skill Passport for credibility",
  "500+ coding problems with AI code reviews",
  "Personalized career roadmaps and mentoring",
  "Auto-generated portfolios from resume data",
  "Mock interviews with AI feedback and scoring",
  "GitHub profile analytics and insights",
  "Smart job matching and application tracking",
];

const recruiterBenefits = [
  "Search verified candidates by skill scores",
  "AI-powered candidate comparison and ranking",
  "Access authentic Skill Passport credentials",
  "Advanced hiring funnel analytics",
  "Interview scheduling and management",
  "Bulk candidate analysis tools",
  "Custom assessment integration",
  "White-label career portals",
];

export function Benefits() {
  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Student Benefits */}
        <div id="students" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-brand-orange mb-4">
              <GraduationCap className="w-3.5 h-3.5" />
              For Students
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Accelerate your <span className="gradient-text">career journey</span>
            </h2>
            <p className="text-text-muted mb-8 leading-relaxed">
              From first-year students to job seekers, AROMA provides every tool you need to build, verify, and showcase your skills.
            </p>
            <ul className="space-y-3 mb-8">
              {studentBenefits.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-text-muted">{b}</span>
                </motion.li>
              ))}
            </ul>
            <Link href="/dashboard">
              <Button>
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">AM</div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Arjun Mehta</p>
                    <p className="text-xs text-text-muted">Full Stack Developer</p>
                  </div>
                  <div className="ml-auto glass-card rounded-lg px-3 py-1">
                    <span className="text-xs text-emerald-400 font-medium">Score: 87</span>
                  </div>
                </div>
                {[
                  { label: "ATS Score", value: 82, color: "from-blue-500 to-blue-400" },
                  { label: "Coding", value: 91, color: "from-brand-orange to-brand-pink" },
                  { label: "GitHub", value: 85, color: "from-emerald-500 to-emerald-400" },
                  { label: "Portfolio", value: 73, color: "from-purple-500 to-purple-400" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-text-muted">{item.label}</span>
                      <span className="text-text-primary font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                        className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl" />
            </Card>
          </motion.div>
        </div>

        {/* Recruiter Benefits */}
        <div id="recruiters" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <Card className="relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-text-primary">Candidate Pipeline</h4>
                  <span className="text-xs text-text-muted">This week</span>
                </div>
                {[
                  { stage: "Applied", count: 234, width: "100%", color: "bg-blue-500/30" },
                  { stage: "Screened", count: 156, width: "67%", color: "bg-amber-500/30" },
                  { stage: "Interview", count: 48, width: "21%", color: "bg-purple-500/30" },
                  { stage: "Offer", count: 12, width: "5%", color: "bg-emerald-500/30" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                    style={{ transformOrigin: "left", width: item.width }}
                    className={`${item.color} rounded-lg px-4 py-3 flex items-center justify-between`}
                  >
                    <span className="text-sm text-text-primary">{item.stage}</span>
                    <span className="text-sm font-bold text-text-primary">{item.count}</span>
                  </motion.div>
                ))}
              </div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-pink/10 rounded-full blur-3xl" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-brand-pink mb-4">
              <Building2 className="w-3.5 h-3.5" />
              For Recruiters
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Hire <span className="gradient-text">verified talent</span> faster
            </h2>
            <p className="text-text-muted mb-8 leading-relaxed">
              Skip the resume screening. Access AI-verified skill passports and find the perfect candidates for your team.
            </p>
            <ul className="space-y-3 mb-8">
              {recruiterBenefits.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-brand-pink mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-text-muted">{b}</span>
                </motion.li>
              ))}
            </ul>
            <Link href="/recruiter">
              <Button>
                Start Hiring <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
