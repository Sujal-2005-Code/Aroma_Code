"use client";

import { motion } from "framer-motion";
import { Brain, Code2, Cpu, Rocket, Sparkles, Star, Trophy, Zap } from "lucide-react";

const floaters = [
  { Icon: Brain, x: "6%", y: "18%", delay: 0, size: 26, tone: "text-violet-300/50" },
  { Icon: Code2, x: "88%", y: "12%", delay: 0.6, size: 24, tone: "text-cyan-300/50" },
  { Icon: Rocket, x: "92%", y: "62%", delay: 1.2, size: 22, tone: "text-fuchsia-300/50" },
  { Icon: Sparkles, x: "12%", y: "74%", delay: 0.9, size: 20, tone: "text-amber-200/50" },
  { Icon: Cpu, x: "50%", y: "6%", delay: 1.6, size: 20, tone: "text-emerald-300/40" },
  { Icon: Trophy, x: "76%", y: "88%", delay: 0.3, size: 20, tone: "text-amber-300/40" },
  { Icon: Star, x: "26%", y: "40%", delay: 2, size: 16, tone: "text-white/25" },
  { Icon: Zap, x: "68%", y: "34%", delay: 1.4, size: 18, tone: "text-cyan-200/35" },
];

export function Ambience() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 grid-veil opacity-70" />

      <div className="animate-aurora absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-violet-600/25 blur-[130px]" />
      <div
        className="animate-aurora absolute -right-32 top-10 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-[120px]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="animate-aurora absolute bottom-[-12rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/18 blur-[140px]"
        style={{ animationDelay: "-11s" }}
      />

      {floaters.map(({ Icon, x, y, delay, size, tone }, i) => (
        <motion.div
          key={i}
          className={`absolute ${tone}`}
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: [0.25, 0.75, 0.25],
            scale: [0.9, 1.12, 0.9],
            y: [0, -22, 0],
            rotate: [0, 12, -8, 0],
          }}
          transition={{
            duration: 9 + i,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon style={{ width: size, height: size }} strokeWidth={1.4} />
        </motion.div>
      ))}

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
    </div>
  );
}
