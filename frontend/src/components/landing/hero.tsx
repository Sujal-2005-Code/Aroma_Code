"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Sparkles, ArrowRight, Play, Zap, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 via-bg-primary to-brand-pink/10 animate-gradient" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-brand-orange/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-brand-pink/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-coral/5 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {[
          { left: "12%", top: "20%" },
          { left: "22%", top: "68%" },
          { left: "78%", top: "24%" },
          { left: "84%", top: "70%" },
          { left: "56%", top: "15%" },
        ].map((point, index) => (
          <motion.div
            key={index}
            className="absolute h-2 w-2 rounded-full bg-white/60"
            style={{ left: point.left, top: point.top }}
            animate={{ y: [0, -12, 0], opacity: [0.2, 0.9, 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: 4 + index * 0.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
          />
        ))}

        <motion.div
          className="absolute left-1/2 top-1/2 hidden h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 hidden h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-orange/20 lg:block"
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 hidden h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-pink/20 lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 text-center">
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
          <h1 className="mb-6 text-4xl font-black tracking-[-0.03em] text-text-primary sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[0.95]">
            <span className="block">The Future of</span>
            <span className="mt-2 block text-white/90">
              <TypeAnimation
                sequence={[
                  "Verified Skills.",
                  1800,
                  "AI Recruitment.",
                  1800,
                  "Talent Intelligence.",
                  1800,
                  "Career Growth.",
                  1800,
                ]}
                wrapper="span"
                speed={45}
                repeat={Infinity}
                className="bg-gradient-to-r from-brand-orange via-brand-pink to-brand-coral bg-clip-text text-transparent"
              />
            </span>
            <span className="mt-2 block text-white/90">Built for ambitious students.</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl">
            Experience a premium AI platform that helps students verify skills, build standout portfolios, and connect with smarter career opportunities.
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
