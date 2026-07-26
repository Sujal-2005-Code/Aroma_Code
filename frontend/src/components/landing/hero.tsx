"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Zap, Brain, Shield, TrendingUp, BarChart3, Code2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";
import Link from "next/link";

const typingTexts = ["Resume Score", "Skill Passport", "Career Roadmap", "Interview Prep", "Code Reviews"];

function TypingEffect() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = typingTexts[index];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length === current.length) {
          setTimeout(() => setDeleting(true), 1500);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setDeleting(false);
          setIndex((i) => (i + 1) % typingTexts.length);
        }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  return (
    <span className="gradient-text">
      {displayed}
      <span className="animate-pulse text-brand-orange">|</span>
    </span>
  );
}

const floatingCards = [
  { icon: Brain, label: "AI Analysis", value: "92%", x: "5%", y: "20%", delay: 0 },
  { icon: Code2, label: "Problems Solved", value: "247", x: "80%", y: "15%", delay: 0.2 },
  { icon: FileText, label: "ATS Score", value: "87", x: "75%", y: "70%", delay: 0.4 },
  { icon: TrendingUp, label: "Career Growth", value: "+45%", x: "8%", y: "65%", delay: 0.6 },
];

const stats = [
  { label: "Students Placed", value: 12450 },
  { label: "Companies Hiring", value: 340 },
  { label: "Problems Solved", value: 89000 },
  { label: "AI Accuracy", value: 97 },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-bg-primary to-brand-pink/5 animate-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-coral/5 rounded-full blur-[150px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Floating Cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + card.delay, duration: 0.6 }}
          className="absolute hidden lg:block"
          style={{ left: card.x, top: card.y }}
        >
          <div className="glass-card rounded-2xl p-4 animate-float" style={{ animationDelay: `${card.delay * 2}s` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange/20 to-brand-pink/20 flex items-center justify-center">
                <card.icon className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <p className="text-xs text-text-muted">{card.label}</p>
                <p className="text-lg font-bold text-text-primary">{card.value}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span className="text-sm text-text-muted">AI-Powered Talent Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-text-primary">Your AI-Powered</span>
            <br />
            <TypingEffect />
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-text-muted mb-10 leading-relaxed">
            AROMA bridges the gap between students and recruiters with intelligent skill verification, AI career mentoring, and smart hiring tools.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/register">
              <Button size="xl" className="w-full sm:w-auto">
                Start Free Trial
                <Sparkles className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="xl" variant="secondary" className="w-full sm:w-auto">
              <Play className="w-4 h-4" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="glass-strong rounded-2xl p-1">
            <div className="bg-bg-surface rounded-xl overflow-hidden">
              {/* Mock Dashboard */}
              <div className="p-4 border-b border-border-subtle flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="glass-card rounded-lg px-4 py-1 text-xs text-text-muted">app.aroma.ai/dashboard</div>
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Passport Score", value: 87, color: "text-emerald-400" },
                  { label: "ATS Score", value: 82, color: "text-blue-400" },
                  { label: "Coding Score", value: 91, color: "text-brand-orange" },
                  { label: "AI Readiness", value: 88, color: "text-purple-400" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="glass-card rounded-xl p-4 text-center"
                  >
                    <p className="text-xs text-text-muted mb-2">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      <CountUp end={stat.value} duration={2} delay={1} />
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card rounded-xl p-4 md:col-span-2 h-40 flex items-end gap-2">
                  {[40, 65, 50, 75, 60, 85, 70, 90, 78, 92, 85, 87].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 1.2 + i * 0.05, duration: 0.5 }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-brand-orange to-brand-pink opacity-80"
                    />
                  ))}
                </div>
                <div className="glass-card rounded-xl p-4 space-y-3">
                  {["React", "TypeScript", "Node.js", "Python"].map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted">{skill}</span>
                        <span className="text-brand-orange">{[92, 87, 85, 78][i]}%</span>
                      </div>
                      <motion.div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${[92, 87, 85, 78][i]}%` }}
                          transition={{ delay: 1.4 + i * 0.1, duration: 0.6 }}
                          className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-pink"
                        />
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-b from-brand-orange/10 via-transparent to-brand-pink/10 blur-3xl -z-10 rounded-3xl" />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold gradient-text">
                <CountUp end={stat.value} duration={2.5} delay={1.5} separator="," />
                {stat.label === "AI Accuracy" ? "%" : "+"}
              </p>
              <p className="text-sm text-text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Company Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20"
        >
          <p className="text-sm text-text-muted mb-6">Trusted by students placed at</p>
          <div className="overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-bg-primary to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg-primary to-transparent z-10" />
            <div className="flex animate-marquee">
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center gap-12 px-6">
                  {["Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix", "Stripe", "Vercel", "Linear", "Figma", "Notion", "Slack"].map((company) => (
                    <span key={`${setIdx}-${company}`} className="text-lg font-semibold text-text-muted/30 whitespace-nowrap hover:text-text-muted/60 transition-colors">
                      {company}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
