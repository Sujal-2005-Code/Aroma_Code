"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

const studentSkills = [
  { label: "ATS Score", value: 82, gradient: "from-sky-500 to-sky-400" },
  { label: "Coding", value: 91, gradient: "from-orange-400 via-rose-500 to-fuchsia-500" },
  { label: "GitHub", value: 85, gradient: "from-emerald-400 to-emerald-500" },
  { label: "Portfolio", value: 73, gradient: "from-violet-400 to-purple-500" },
];

const pipeline = [
  { label: "Applied", count: 234, width: "100%", gradient: "from-blue-600 to-sky-500" },
  { label: "Screened", count: 156, width: "68%", gradient: "from-amber-600 to-orange-500" },
  { label: "Interview", count: 48, width: "36%", gradient: "from-violet-600 to-fuchsia-500" },
  { label: "Offer", count: 12, width: "16%", gradient: "from-emerald-600 to-teal-500" },
];

export function Benefits() {
  return (
    <section className="relative overflow-hidden bg-[#0b1120] py-20 text-white sm:py-24 lg:py-28">
      <style>{css}</style>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="particle-layer particle-layer-a" />
        <div className="particle-layer particle-layer-b" />
        <div className="particle-layer particle-layer-c" />
        <div className="particle-layer particle-layer-d" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_90%_at_50%_-10%,rgba(255,128,64,0.16),transparent_35%),radial-gradient(75%_55%_at_86%_30%,rgba(124,58,237,0.14),transparent_60%),radial-gradient(65%_50%_at_12%_82%,rgba(16,185,129,0.14),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="space-y-16 lg:space-y-20">
          <div id="students" className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 text-center lg:order-1 lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1.5 text-xs font-semibold text-[#FFB07C] backdrop-blur-xl">
                <GraduationCap className="h-3.5 w-3.5" />
                For Students
              </div>
              <h3 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-[46px]">
                Build skills. <span className="bg-gradient-to-r from-[#FFB14A] via-[#FF5A8A] to-[#A855F7] bg-clip-text text-transparent">Prove</span> them. Land better roles.
              </h3>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-[#95A3BA] sm:text-[16px] lg:mx-0">
                AROMA helps students move from learning to hiring with verified skill passports, guided practice, portfolio generation, and interview preparation in one place.
              </p>

              <ul className="mt-8 space-y-3.5">
                {studentBenefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="flex items-start gap-3 text-[14px] leading-6 text-[#B0BED2]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.16)]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/dashboard">
                  <Button className="group rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FF2E73] px-5 py-6 text-[14px] font-semibold text-white shadow-[0_12px_32px_rgba(255,62,121,0.34)] transition-transform hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(255,62,121,0.46)]">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs text-[#8B99B0] backdrop-blur-xl">
                  No credit card • 2-min setup
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="relative mx-auto max-w-[520px] [perspective:1200px]">
                <div className="pointer-events-none absolute -left-8 -top-10 h-44 w-44 rounded-full bg-[#3B82F6]/15 blur-[34px]" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-[#FF2E73]/12 blur-[38px]" />

                <div className="glass-card-feature relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12),transparent_25%,transparent_75%,rgba(255,255,255,0.06))]" />
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A1A] via-[#FF4D7D] to-[#A855F7] text-[13px] font-extrabold shadow-[0_8px_20px_rgba(255,80,120,0.35)] ring-1 ring-white/10">
                        AM
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-[2px] border-[#0b1120] bg-emerald-400" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold tracking-[-0.01em] text-white">Arjun Mehta</div>
                        <div className="text-[12px] text-[#8C9BB4]">Full Stack Developer • Bangalore</div>
                      </div>
                    </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[12px] font-semibold text-emerald-300">
                      Score: 87
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 space-y-4">
                    {studentSkills.map((skill) => (
                      <div key={skill.label}>
                        <div className="mb-2 flex items-center justify-between text-[12.5px]">
                          <span className="font-medium text-[#9EADC3]">{skill.label}</span>
                          <span className="font-bold text-white">{skill.value}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06] p-[2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                            className={`h-full rounded-full bg-gradient-to-r ${skill.gradient} shadow-[0_0_18px_rgba(255,255,255,0.12)]`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 mt-6 flex items-center justify-between rounded-2xl border border-white/8 bg-[#111827]/70 px-4 py-3 text-[12px] text-[#8C9BB4]">
                    <span className="inline-flex items-center gap-2 text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                      Live profile
                    </span>
                    <span>Verified skills, projects, and interviews</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div id="recruiters" className="grid items-center gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="relative mx-auto max-w-[520px] [perspective:1200px]">
                <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[#FF8A00]/12 blur-[38px]" />
                <div className="pointer-events-none absolute -bottom-12 -right-10 h-52 w-52 rounded-full bg-[#7C3AED]/12 blur-[38px]" />

                <Card className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.12),transparent_30%,transparent_75%,rgba(255,255,255,0.05))]" />
                  <div className="relative z-10 flex items-center justify-between">
                    <h4 className="text-[14px] font-bold tracking-[-0.01em] text-white">Candidate Pipeline</h4>
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] text-[#8B99B0]">This week</span>
                  </div>

                  <div className="relative z-10 mt-5 space-y-3.5">
                    {pipeline.map((stage, index) => (
                      <div key={stage.label} className="group">
                        <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                          <span className="text-[#9EADC3]">{stage.label}</span>
                          <span className="font-bold text-white">{stage.count}</span>
                        </div>
                        <div className="h-[46px] overflow-hidden rounded-2xl border border-white/6 bg-[#121827] p-[2px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: stage.width }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.1, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className={`relative flex h-full items-center justify-between overflow-hidden rounded-[14px] bg-gradient-to-r ${stage.gradient} px-4 text-white`}
                          >
                            <span className="text-[13px] font-semibold tracking-[-0.01em]">{stage.label}</span>
                            <span className="text-[13px] font-black tabular-nums">{stage.count}</span>
                            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)] opacity-60" />
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3 text-[11px] text-[#7F8DA7]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.45)]" /> High volume
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.45)]" /> Converted
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live analytics
                    </span>
                  </div>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 text-center lg:order-2 lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-1.5 text-xs font-semibold text-[#FF99D2] backdrop-blur-xl">
                <Building2 className="h-3.5 w-3.5" />
                For Recruiters
              </div>
              <h3 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-[46px]">
                Hire <span className="bg-gradient-to-r from-[#FF8A1A] via-[#FF4D7D] to-[#FF5A8A] bg-clip-text text-transparent">verified talent</span> faster.
              </h3>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-[#95A3BA] sm:text-[16px] lg:mx-0">
                Skip the resume screening. Access AI-verified skill passports and find the perfect candidates for your team.
              </p>

              <ul className="mt-8 space-y-3.5">
                {recruiterBenefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="flex items-start gap-3 text-[14px] leading-6 text-[#B0BED2]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#FF4D7D]/40 bg-[#FF4D7D]/10 text-[#FF8FB6] shadow-[0_0_18px_rgba(255,77,125,0.16)]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/recruiter">
                  <Button className="group rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FF2E73] px-5 py-6 text-[14px] font-semibold text-white shadow-[0_12px_32px_rgba(255,62,121,0.34)] transition-transform hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(255,62,121,0.46)]">
                    Start Hiring
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs text-[#8B99B0] backdrop-blur-xl">
                  500+ companies hiring
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Benefits;

const css = `
.particle-layer {
  position: absolute;
  inset: -10% -8%;
  background-repeat: repeat;
  opacity: 0.75;
  will-change: transform, opacity;
}

.particle-layer::before,
.particle-layer::after {
  content: "";
  position: absolute;
  inset: 0;
  background-repeat: repeat;
}

.particle-layer-a {
  background-image: radial-gradient(circle, rgba(255, 179, 90, 0.55) 0 1.5px, transparent 2.2px);
  background-size: 140px 140px;
  animation: driftParticlesA 24s linear infinite;
  filter: blur(0.2px) drop-shadow(0 0 10px rgba(255, 138, 0, 0.18));
}

.particle-layer-a::before {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.34) 0 1px, transparent 2px);
  background-size: 220px 220px;
  animation: driftParticlesB 32s linear infinite;
}

.particle-layer-b {
  background-image: radial-gradient(circle, rgba(124, 58, 237, 0.45) 0 1.4px, transparent 2.4px);
  background-size: 180px 180px;
  animation: driftParticlesC 28s linear infinite reverse;
  opacity: 0.6;
}

.particle-layer-b::after {
  background-image: radial-gradient(circle, rgba(16, 185, 129, 0.4) 0 1.2px, transparent 2.1px);
  background-size: 260px 260px;
  animation: driftParticlesD 36s linear infinite;
}

.particle-layer-c {
  background-image: radial-gradient(circle, rgba(255, 77, 125, 0.38) 0 1.3px, transparent 2.1px);
  background-size: 200px 200px;
  animation: driftParticlesE 30s linear infinite;
  opacity: 0.45;
}

.particle-layer-d {
  background-image: radial-gradient(circle, rgba(59, 130, 246, 0.35) 0 1.1px, transparent 2px);
  background-size: 240px 240px;
  animation: driftParticlesF 34s linear infinite reverse;
  opacity: 0.38;
}

.glass-card-feature {
  animation: floatCard 6s ease-in-out infinite;
}

@keyframes floatCard {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-8px);
  }
}

@keyframes driftParticlesA {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-120px, 180px, 0); }
}

@keyframes driftParticlesB {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(160px, -140px, 0); }
}

@keyframes driftParticlesC {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(130px, 220px, 0); }
}

@keyframes driftParticlesD {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-180px, -110px, 0); }
}

@keyframes driftParticlesE {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(90px, 160px, 0); }
}

@keyframes driftParticlesF {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-100px, 140px, 0); }
}

@media (max-width: 1024px) {
  .glass-card-feature {
    animation-duration: 7s;
  }

  .particle-layer {
    opacity: 0.55;
  }
}

@media (prefers-reduced-motion: reduce) {
  .particle-layer,
  .particle-layer::before,
  .particle-layer::after,
  .glass-card-feature {
    animation: none !important;
  }
}
`;
