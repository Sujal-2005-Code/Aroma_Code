"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import asset from "@/lib/asset";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function About() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, {
    stiffness: 150,
    damping: 20,
  });

  const mouseY = useSpring(y, {
    stiffness: 150,
    damping: 20,
  });

  const rotateX = useTransform(mouseY, [-200, 200], [15, -15]);
  const rotateY = useTransform(mouseX, [-200, 200], [-15, 15]);

  return (
    <section id="about" className="bg-bg-primary/80 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="relative overflow-hidden rounded-[3.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-7 lg:p-10 xl:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,138,26,0.12),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(255,77,125,0.1),transparent_26%),radial-gradient(circle_at_50%_85%,rgba(168,85,247,0.08),transparent_34%)]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-20 w-[84%] -translate-x-1/2 rounded-b-[999px] bg-white/5 blur-2xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center xl:gap-14">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-4 py-1.5 text-sm font-medium text-brand-orange shadow-[0_0_24px_rgba(255,138,26,0.12)]">
                <span className="h-2 w-2 rounded-full bg-brand-orange" />
                About AROMA
              </div>

              <h2 className="max-w-2xl text-3xl font-black tracking-[-0.03em] text-text-primary sm:text-4xl lg:text-5xl xl:text-6xl">
                AI-powered talent intelligence for smarter careers.
              </h2>

              <p className="max-w-2xl text-[15px] leading-8 text-text-muted sm:text-lg">
                <span className="font-semibold text-text-primary">AROMA</span> is an AI-powered Talent Intelligence Platform that transforms resumes into verified digital talent profiles. Discover skills, validate achievements, showcase projects, and connect students with recruiters through AI-driven matching, analytics, and trusted skill verification—making hiring faster, smarter, and based on proven capabilities.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            <div
              className="flex items-center justify-center perspective-[2000px]"
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                x.set(event.clientX - rect.left - rect.width / 2);
                y.set(event.clientY - rect.top - rect.height / 2);
              }}
              onMouseLeave={() => {
                x.set(0);
                y.set(0);
              }}
            >
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, rotateZ: 1 }}
                className="relative w-full max-w-[760px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.25)] sm:p-5 lg:max-w-[820px] lg:p-6"
              >
               <motion.div
  className="relative flex min-h-[330px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent backdrop-blur-xl sm:min-h-[420px] lg:min-h-[560px] xl:min-h-[620px]"
>

  {/* Background Glow */}
  <motion.div
    className="absolute h-[450px] w-[450px] rounded-full bg-orange-500/20 blur-[120px]"
    animate={{
      scale: [1, 1.15, 1],
      opacity: [0.4, 0.7, 0.4],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Rotating Ring */}
  <motion.div
    className="absolute h-[80%] w-[80%] rounded-full border border-orange-400/20"
    animate={{
      rotate: 360,
    }}
    transition={{
      duration: 40,
      repeat: Infinity,
      ease: "linear",
    }}
  />

  {/* Gradient Overlay */}
  <motion.div
    className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.03))]"
    animate={{
      scale: [1, 1.03, 1],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "linear",
    }}
  />

  {/* Robot */}
  <motion.img
    src={asset("/assets/Robot.png")}
    alt="AROMA Robot"
    className="relative z-10 w-full max-w-[720px] object-contain scale-125 drop-shadow-[0_30px_60px_rgba(255,120,40,0.35)]"
    animate={{
      y: [0, -12, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Floating ATS Card */}
  <motion.div
    className="absolute left-6 top-12 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl"
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
    }}
  >
    <p className="text-xs text-gray-400">ATS Score</p>
    <p className="text-xl font-bold text-green-400">96%</p>
  </motion.div>

  {/* AI Resume Card */}
  <motion.div
    className="absolute right-8 top-20 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl"
    animate={{
      y: [0, 12, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
    }}
  >
    <p className="text-xs text-gray-400">AI Resume</p>
    <p className="font-semibold text-white">Verified ✓</p>
  </motion.div>

  {/* Skill Passport */}
  <motion.div
    className="absolute bottom-16 left-12 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl"
    animate={{
      y: [0, -8, 0],
    }}
    transition={{
      duration: 4.5,
      repeat: Infinity,
    }}
  >
    <p className="text-xs text-gray-400">Skill Passport</p>
    <p className="font-semibold text-orange-400">Level 8</p>
  </motion.div>

  {/* GitHub Analytics */}
  <motion.div
    className="absolute bottom-16 right-12 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-xl"
    animate={{
      y: [0, 10, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
    }}
  >
    <p className="text-xs text-gray-400">GitHub</p>
    <p className="font-semibold text-cyan-400">98 Projects</p>
  </motion.div>

</motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
