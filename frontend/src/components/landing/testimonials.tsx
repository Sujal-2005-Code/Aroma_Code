"use client";

import { motion, type Variants, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { testimonials } from "@/mock-data";
import { useMemo } from "react";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.92,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const sectionStats = [
  { label: "Students helped", value: "12K+" },
  { label: "Recruiters", value: "500+" },
  { label: "Placement rate", value: "96%" },
  { label: "ATS reports", value: "50K+" },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24">
      <style>{css}</style>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[#ff7a2e]/15 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-12 top-28 h-56 w-56 rounded-full bg-[#8b5cf6]/10 blur-[110px]"
        animate={{ y: [0, -16, 0], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-[#FFB07C] backdrop-blur-xl">
            <Quote className="h-3.5 w-3.5" />
            Testimonials
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Loved by <span className="bg-gradient-to-r from-[#FF8A1A] via-[#FF4D7D] to-[#A855F7] bg-clip-text text-transparent">thousands</span> of students
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[#95A3BA] sm:text-[16px]">
            See how AROMA has transformed careers and opened doors to top companies.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.24 }}
          className="grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ y: -12, scale: 1.04 }}
              className="group relative"
            >
              <TestimonialCard testimonial={testimonial} index={index} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {sectionStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.03 }}
              className="stats-chip glass-card relative overflow-hidden rounded-2xl border border-white/10 px-4 py-5 text-center"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,138,26,0.14),transparent_55%)] opacity-80" />
              <div className="relative z-10">
                <div className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-[12px] font-medium text-[#8C9BB4]">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: (typeof testimonials)[number]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-120, 120], [12, -12]);
  const rotateY = useTransform(x, [-120, 120], [-12, 12]);
  const spotlight = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.14), transparent 52%)`;
  const initials = useMemo(() => testimonial.name.split(" ").map((part) => part[0]).join(""), [testimonial.name]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="relative h-full"
    >
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-[#FF8A1A] via-[#F61E66] to-[#A855F7] opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
      <div className="animated-border absolute inset-0 rounded-[28px]" />

      <Card
        hover={false}
        gradient={false}
        className="testimonial-card relative h-full rounded-[28px] border-white/10 bg-[#151b2d]/86 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl transition-all duration-300"
        style={{ backgroundImage: spotlight }}
      >
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <Quote className="mb-4 h-8 w-8 text-brand-orange/35" />
        </motion.div>

        <p className="mb-7 text-sm leading-relaxed text-text-muted">&ldquo;{testimonial.quote}&rdquo;</p>

        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 250, damping: 14 }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A1A] via-[#F61E66] to-[#A855F7] text-[13px] font-bold text-white shadow-[0_10px_30px_rgba(255,90,138,0.25)]"
          >
            {initials}
          </motion.div>

          <div>
            <p className="text-sm font-medium text-text-primary">{testimonial.name}</p>
            <p className="text-xs text-text-muted">{testimonial.role}</p>
          </div>

          <motion.div
            className="ml-auto flex gap-0.5"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut" }}
          >
            {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
              <motion.span
                key={starIndex}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: starIndex * 0.08, ease: "easeInOut" }}
              >
                <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange drop-shadow-[0_0_10px_rgba(252,143,15,0.28)]" />
              </motion.span>
            ))}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

const css = `
.testimonial-card {
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 120, 60, 0.06)),
    #151b2d;
}

.animated-border {
  background: linear-gradient(135deg, rgba(255, 138, 26, 0.65), rgba(246, 30, 102, 0.35), rgba(168, 85, 247, 0.6));
  opacity: 0.28;
  filter: blur(18px);
  animation: borderSpin 7s linear infinite;
}

.testimonial-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 28px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 138, 26, 0.7), rgba(246, 30, 102, 0.42), rgba(168, 85, 247, 0.62));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.32;
  pointer-events: none;
}

.testimonial-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 28px;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.08), transparent 42%);
  opacity: 0.9;
  pointer-events: none;
}

.stats-chip {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
}

@keyframes borderSpin {
  from {
    transform: rotate(0deg) scale(1);
  }

  to {
    transform: rotate(360deg) scale(1.02);
  }
}

@media (max-width: 768px) {
  .testimonial-card {
    transform-style: flat !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animated-border,
  .testimonial-card,
  .stats-chip {
    animation: none !important;
  }
}
`;
