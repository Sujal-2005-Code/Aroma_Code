"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";

const PARTICLE_COUNT = 18;
const STAR_COUNT = 26;
const BLOB_COUNT = 2;

const particlePalette = ["#FF8A1A", "#F61E66", "#8B5CF6", "#38BDF8", "#10B981", "#FACC15"] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function useSeededRandom(seed: number) {
  return () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

function createRandomizedItems(count: number, seedBase: number) {
  const rand = useSeededRandom(seedBase);
  return Array.from({ length: count }, (_, index) => {
    const color = particlePalette[Math.floor(rand() * particlePalette.length)];
    const left = rand() * 100;
    const top = rand() * 100;
    const size = 2 + rand() * 5;
    const duration = 14 + rand() * 24;
    const delay = -(rand() * duration);
    const opacity = 0.18 + rand() * 0.62;
    const glow = 8 + rand() * 28;
    const driftX = (rand() - 0.5) * 18;
    const driftY = (rand() - 0.5) * 18;
    const floatX = (rand() - 0.5) * 10;
    const floatY = (rand() - 0.5) * 10;
    const scale = 0.75 + rand() * 0.75;

    return {
      id: index,
      color,
      left,
      top,
      size,
      duration,
      delay,
      opacity,
      glow,
      driftX,
      driftY,
      floatX,
      floatY,
      scale,
    };
  });
}

function usePointer() {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.32 });
  const latestPoint = useRef({ x: 0.5, y: 0.32 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      latestPoint.current.x = clamp(event.clientX / window.innerWidth, 0, 1);
      latestPoint.current.y = clamp(event.clientY / window.innerHeight, 0, 1);
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(() => {
          setPointer({ x: latestPoint.current.x, y: latestPoint.current.y });
          frameRef.current = null;
        });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return pointer;
}

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reduceMotion;
}

function BackgroundBlob({ seed, className }: { seed: number; className: string }) {
  const rand = useMemo(() => useSeededRandom(seed), [seed]);
  const baseX = 20 + rand() * 60;
  const baseY = 10 + rand() * 70;
  const size = 220 + rand() * 260;
  const duration = 10 + rand() * 10;
  const delay = -rand() * duration;
  const hue = ["rgba(255,138,26,0.18)", "rgba(246,30,102,0.12)", "rgba(139,92,246,0.12)", "rgba(56,189,248,0.1)"][Math.floor(rand() * 4)];

  const x = useMotionValue(baseX);
  const y = useMotionValue(baseY);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0.22);
  const background = useMotionTemplate`radial-gradient(circle, ${hue} 0%, transparent 70%)`;

  const moveX = useTransform(x, (value) => `${value}%`);
  const moveY = useTransform(y, (value) => `${value}%`);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const driftX = (rand() - 0.5) * 10;
      const driftY = (rand() - 0.5) * 10;
      x.set(baseX + driftX);
      y.set(baseY + driftY);
      scale.set(0.95 + rand() * 0.18);
      opacity.set(0.18 + rand() * 0.14);
    }, duration * 1000);

    return () => window.clearInterval(interval);
  }, [baseX, baseY, duration, opacity, rand, scale, x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute rounded-full blur-[120px] will-change-transform ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        x: moveX,
        y: moveY,
        scale,
        opacity,
        background,
      }}
      animate={{
        y: [0, -14, 0],
        scale: [1, 1.12, 1],
      }}
      transition={{
        repeat: Infinity,
        duration,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function FloatingParticle({ item }: { item: ReturnType<typeof createRandomizedItems>[number] }) {
  const x = useMotionValue(item.left);
  const y = useMotionValue(item.top);
  const moveX = useTransform(x, (value) => `${value}%`);
  const moveY = useTransform(y, (value) => `${value}%`);
  const spotlight = useMotionTemplate`radial-gradient(circle, ${item.color} 0%, ${item.color}88 28%, transparent 72%)`;

  useEffect(() => {
    const interval = window.setInterval(() => {
      const offsetX = item.driftX * (0.35 + Math.random() * 0.25);
      const offsetY = item.driftY * (0.35 + Math.random() * 0.25);
      x.set(clamp(item.left + offsetX, 0, 100));
      y.set(clamp(item.top + offsetY, 0, 100));
    }, item.duration * 1000 * 0.75);

    return () => window.clearInterval(interval);
  }, [item, x, y]);

  return (
    <motion.span
      aria-hidden="true"
      className="absolute rounded-full will-change-transform"
      style={{
        left: 0,
        top: 0,
        width: `${item.size}px`,
        height: `${item.size}px`,
        x: moveX,
        y: moveY,
        opacity: item.opacity,
        boxShadow: `0 0 ${item.glow}px ${item.color}66, 0 0 ${item.glow * 1.75}px ${item.color}33`,
        background: spotlight,
        transform: "translate3d(0, 0, 0)",
      }}
      animate={{
        y: [0, item.floatY, 0],
        x: [0, item.floatX, 0],
        scale: [item.scale, item.scale + 0.18, item.scale],
        opacity: [item.opacity * 0.75, item.opacity, item.opacity * 0.78],
      }}
      transition={{
        repeat: Infinity,
        duration: item.duration,
        delay: item.delay,
        ease: "easeInOut",
      }}
    />
  );
}

function TinyStar({ item }: { item: ReturnType<typeof createRandomizedItems>[number] }) {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute rounded-full bg-white will-change-transform"
      style={{
        left: `${item.left}%`,
        top: `${item.top}%`,
        width: `${Math.max(1, item.size - 1)}px`,
        height: `${Math.max(1, item.size - 1)}px`,
        opacity: item.opacity * 0.8,
        boxShadow: `0 0 ${item.glow}px rgba(255,255,255,0.5)`,
      }}
      animate={{
        scale: [0.6, 1.15, 0.6],
        opacity: [item.opacity * 0.3, item.opacity, item.opacity * 0.4],
      }}
      transition={{
        repeat: Infinity,
        duration: item.duration * 0.72,
        delay: item.delay * 0.75,
        ease: "easeInOut",
      }}
    />
  );
}

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const pointer = usePointer();
  const particleCount = reduceMotion ? Math.max(10, Math.floor(PARTICLE_COUNT * 0.6)) : PARTICLE_COUNT;
  const starCount = reduceMotion ? Math.max(12, Math.floor(STAR_COUNT * 0.5)) : STAR_COUNT;
  const blobCount = reduceMotion ? Math.max(1, Math.floor(BLOB_COUNT * 0.5)) : BLOB_COUNT;

  const particles = useMemo(() => createRandomizedItems(particleCount, 17), [particleCount]);
  const stars = useMemo(() => createRandomizedItems(starCount, 97), [starCount]);
  const blobs = useMemo(() => createRandomizedItems(blobCount, 173), [blobCount]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const spotlightX = `${pointer.x * 100}%`;
  const spotlightY = `${pointer.y * 100}%`;
  const parallaxX = reduceMotion ? 0 : (pointer.x - 0.5) * 20;
  const parallaxY = reduceMotion ? 0 : (pointer.y - 0.5) * 16;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0b1120]" aria-hidden="true">
      <style>{css}</style>

      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at ${spotlightX} ${spotlightY}, rgba(255,255,255,0.08), transparent 34%), radial-gradient(circle at ${spotlightX} ${spotlightY}, rgba(255,138,26,0.08), transparent 18%)`,
          transform: `translate3d(${parallaxX * -0.25}px, ${parallaxY * -0.25}px, 0)`,
          willChange: "transform, background-position",
        }}
      />

      <motion.div
        className="absolute inset-[-10%]"
        style={{
          transform: `translate3d(${parallaxX * -0.15}px, ${parallaxY * -0.15}px, 0)`,
          opacity: 0.85,
        }}
      >
        <div className="animated-aurora animated-aurora-a" />
        <div className="animated-aurora animated-aurora-b" />
        <div className="animated-aurora animated-aurora-c" />
        <div className="animated-aurora animated-aurora-d" />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.36, 0.5, 0.36] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        style={{ transform: `translate3d(${parallaxX * 0.12}px, ${parallaxY * 0.12}px, 0)` }}
      >
        <div className="mesh-gradient mesh-gradient-a" />
        <div className="mesh-gradient mesh-gradient-b" />
        <div className="mesh-gradient mesh-gradient-c" />
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_55%)]" />
      <div className="noise-overlay" />
      <div className="vignette-overlay" />
      <div className="noise-drift" />

      <motion.div
        className="absolute inset-0"
        style={{ transform: `translate3d(${parallaxX * 0.18}px, ${parallaxY * 0.18}px, 0)` }}
      >
        {blobs.map((blob) => (
          <BackgroundBlob key={blob.id} seed={blob.id + 211} className={blob.id % 2 === 0 ? "blob-left" : "blob-right"} />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{ transform: `translate3d(${parallaxX * 0.22}px, ${parallaxY * 0.22}px, 0)` }}
      >
        {stars.map((star) => (
          <TinyStar key={star.id} item={star} />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{ transform: `translate3d(${parallaxX * 0.28}px, ${parallaxY * 0.28}px, 0)` }}
      >
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} item={particle} />
        ))}
      </motion.div>

      <motion.div
        className="spotlight-layer"
        style={{
          left: spotlightX,
          top: spotlightY,
          x: `calc(-50% + ${parallaxX * 0.2}px)`,
          y: `calc(-50% + ${parallaxY * 0.2}px)`,
        }}
        animate={{ opacity: [0.14, 0.22, 0.14] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
    </div>
  );
}

export default AnimatedBackground;

const css = `
.animated-aurora {
  position: absolute;
  inset: auto;
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.55;
  will-change: transform, opacity;
  mix-blend-mode: screen;
}

.animated-aurora-a {
  width: 42rem;
  height: 42rem;
  left: -8rem;
  top: 4rem;
  background: radial-gradient(circle, rgba(255, 138, 26, 0.14), transparent 70%);
  animation: driftA 24s ease-in-out infinite;
}

.animated-aurora-b {
  width: 36rem;
  height: 36rem;
  right: -6rem;
  top: 10rem;
  background: radial-gradient(circle, rgba(246, 30, 102, 0.12), transparent 70%);
  animation: driftB 28s ease-in-out infinite;
}

.animated-aurora-c {
  width: 30rem;
  height: 30rem;
  left: 28%;
  bottom: -8rem;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.1), transparent 68%);
  animation: driftC 30s ease-in-out infinite;
}

.animated-aurora-d {
  width: 28rem;
  height: 28rem;
  right: 18%;
  bottom: -10rem;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.09), transparent 68%);
  animation: driftD 34s ease-in-out infinite;
}

.mesh-gradient {
  position: absolute;
  inset: 0;
  opacity: 0.45;
  will-change: transform, opacity;
}

.mesh-gradient-a {
  background:
    radial-gradient(circle at 24% 18%, rgba(255, 138, 26, 0.12), transparent 28%),
    radial-gradient(circle at 74% 28%, rgba(246, 30, 102, 0.1), transparent 26%),
    radial-gradient(circle at 52% 78%, rgba(168, 85, 247, 0.08), transparent 30%);
  animation: meshMoveA 36s linear infinite;
}

.mesh-gradient-b {
  background:
    radial-gradient(circle at 18% 72%, rgba(56, 189, 248, 0.08), transparent 24%),
    radial-gradient(circle at 82% 22%, rgba(255, 255, 255, 0.05), transparent 18%),
    radial-gradient(circle at 60% 58%, rgba(16, 185, 129, 0.08), transparent 26%);
  animation: meshMoveB 40s linear infinite;
}

.mesh-gradient-c {
  background:
    radial-gradient(circle at 48% 42%, rgba(255, 255, 255, 0.04), transparent 16%),
    radial-gradient(circle at 12% 14%, rgba(255, 255, 255, 0.03), transparent 12%),
    radial-gradient(circle at 88% 86%, rgba(255, 255, 255, 0.03), transparent 12%);
  animation: meshMoveC 44s linear infinite;
}

.noise-overlay,
.noise-drift {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.noise-overlay {
  opacity: 0.07;
  background-image:
    linear-gradient(transparent 0 0),
    repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 2px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px);
  mix-blend-mode: soft-light;
}

.noise-drift {
  opacity: 0.06;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0 1px, transparent 1px),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05) 0 1px, transparent 1px),
    radial-gradient(circle at 40% 60%, rgba(255,255,255,0.05) 0 1px, transparent 1px);
  background-size: 180px 180px, 220px 220px, 260px 260px;
  animation: noiseDrift 18s linear infinite;
}

.vignette-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 42%, rgba(5, 8, 17, 0.34) 100%);
}

.spotlight-layer {
  position: absolute;
  width: 32rem;
  height: 32rem;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255,255,255,0.12), rgba(255,138,26,0.08) 24%, transparent 68%);
  filter: blur(84px);
  mix-blend-mode: screen;
  pointer-events: none;
  will-change: transform, opacity;
}

@keyframes driftA {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(28px, -22px, 0) scale(1.06); }
}

@keyframes driftB {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-20px, 18px, 0) scale(1.08); }
}

@keyframes driftC {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(18px, -14px, 0) scale(1.05); }
}

@keyframes driftD {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-18px, 12px, 0) scale(1.07); }
}

@keyframes meshMoveA {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(16px, -18px, 0) scale(1.02); }
}

@keyframes meshMoveB {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-12px, 20px, 0) scale(1.03); }
}

@keyframes meshMoveC {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(8px, -10px, 0) scale(1.01); }
}

@keyframes noiseDrift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-120px, 100px, 0); }
}

@media (max-width: 1024px) {
  .animated-aurora-a {
    left: -12rem;
  }

  .animated-aurora-b {
    right: -10rem;
  }

  .spotlight-layer {
    width: 26rem;
    height: 26rem;
  }
}

@media (max-width: 640px) {
  .animated-aurora,
  .mesh-gradient,
  .noise-overlay,
  .noise-drift,
  .spotlight-layer {
    opacity: 0.55;
  }

  .spotlight-layer {
    width: 20rem;
    height: 20rem;
    filter: blur(72px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animated-aurora,
  .mesh-gradient,
  .noise-overlay,
  .noise-drift,
  .spotlight-layer {
    animation: none !important;
  }
}
`;
