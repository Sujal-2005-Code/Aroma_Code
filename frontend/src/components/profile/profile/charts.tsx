"use client";

import * as React from "react";
import { animate, motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export function CountUp({
  value,
  duration = 1.4,
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(display, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {Math.round(display)}
      {suffix}
    </span>
  );
}

export function CircularProgress({
  value,
  label,
  sublabel,
  size = 116,
  stroke = 9,
  from = "#8b5cf6",
  to = "#22d3ee",
  delay = 0,
  icon,
}: {
  value: number;
  label: string;
  sublabel?: string;
  size?: number;
  stroke?: number;
  from?: string;
  to?: string;
  delay?: number;
  icon?: React.ReactNode;
}) {
  const id = React.useId().replace(/:/g, "");
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col items-center gap-2"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: `radial-gradient(circle, ${from}55, transparent 70%)` }}
        />
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#grad-${id})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c - (pct / 100) * c }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.5, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${from}88)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon ? <div className="mb-0.5 text-slate-300">{icon}</div> : null}
          <div className="text-xl font-semibold text-white">
            <CountUp value={pct} suffix="%" />
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[12px] font-medium text-slate-200">{label}</p>
        {sublabel ? <p className="text-[10px] uppercase tracking-widest text-slate-500">{sublabel}</p> : null}
      </div>
    </motion.div>
  );
}

export type DonutSegment = { label: string; value: number; color: string };

function createDonutArcs(segments: DonutSegment[], total: number) {
  let offset = 0;
  return segments.map((segment) => {
    const fraction = Math.max(segment.value, 1) / total;
    const arc = { ...segment, fraction, offset };
    offset += fraction;
    return arc;
  });
}

export function ScoreDonut({
  segments,
  centerValue,
  centerLabel,
  size = 240,
}: {
  segments: DonutSegment[];
  centerValue: number;
  centerLabel: string;
  size?: number;
}) {
  const [active, setActive] = React.useState<number | null>(null);
  const total = segments.reduce((sum, s) => sum + Math.max(s.value, 1), 0);
  const stroke = 26;
  const r = (size - stroke - 14) / 2;
  const c = 2 * Math.PI * r;

  const arcs = createDonutArcs(segments, total);

  const shown = active !== null ? segments[active] : null;

  return (
    <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-8">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <motion.div
          className="absolute inset-6 rounded-full bg-gradient-to-br from-violet-600/25 via-fuchsia-500/10 to-cyan-500/25 blur-2xl"
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg width={size} height={size} className="-rotate-90 relative">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          {arcs.map((a, i) => (
            <motion.circle
              key={a.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={active === i ? stroke + 7 : stroke}
              strokeLinecap="butt"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              whileInView={{ strokeDashoffset: c - a.fraction * c * 0.985 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.2, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{
                transformOrigin: "center",
                rotate: `${a.offset * 360}deg`,
                cursor: "pointer",
                opacity: active === null || active === i ? 1 : 0.3,
                filter: active === i ? `drop-shadow(0 0 10px ${a.color})` : "none",
                transition: "opacity 0.3s ease, stroke-width 0.25s ease, filter 0.3s ease",
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            key={shown?.label ?? "overall"}
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
              {shown ? shown.label : centerLabel}
            </p>
            <p className="bg-gradient-to-br from-white via-violet-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent">
              {shown ? `${shown.value}%` : <CountUp value={centerValue} suffix="%" />}
            </p>
            <p className="text-[10px] tracking-wide text-slate-500">
              {shown ? "metric score" : "AI composite"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {segments.map((s, i) => (
          <motion.button
            type="button"
            key={s.label}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]",
              active === i && "border-white/25 bg-white/[0.08]",
            )}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: s.color, boxShadow: `0 0 12px ${s.color}` }}
            />
            <span className="flex-1 text-xs text-slate-300">{s.label}</span>
            <span className="text-xs font-semibold text-white">{s.value}%</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function MeterBar({
  value,
  label,
  color = "from-violet-500 to-cyan-400",
  delay = 0,
}: {
  value: number;
  label: string;
  color?: string;
  delay?: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-slate-100">
          <CountUp value={value} suffix="%" />
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", color)}
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(100, value)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
