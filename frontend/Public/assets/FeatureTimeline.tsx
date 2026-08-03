import React, { useEffect, useRef, useCallback, CSSProperties } from "react";

/**
 * FeatureTimeline
 * ----------------
 * A vertical, corner-to-corner "snake" feature timeline for an AI product page.
 *
 * Implementation note: this component intentionally avoids GSAP and
 * Framer Motion as runtime dependencies — every effect below (scroll
 * reveal, spring easing, 3D tilt, parallax, and the snake-body wave)
 * is built with native DOM refs, IntersectionObserver, and CSS
 * transitions/keyframes/SMIL. All per-frame work mutates refs directly
 * instead of going through React state, so nothing re-renders during
 * scroll or pointer movement — that's what keeps this at 60fps.
 *
 * Snake motion: a single rAF loop tracks scroll velocity and turns it
 * into a decaying "energy" value. That energy is applied to each card
 * as translateY + a touch of rotation, with a phase offset per card
 * index — so the wave visibly travels along the chain of cards like a
 * snake's body, reversing direction when you scroll up vs. down, and
 * settling back to rest a moment after you stop scrolling.
 */

/* ------------------------------ Types ------------------------------ */

type GlowKey = "blue" | "cyan" | "purple";

interface Feature {
  tag: string;
  title: string;
  body: string;
  glow: GlowKey;
}

type Align = "left" | "right";

/** Allows CSS custom properties (--foo) inside a typed style object. */
type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

type WaveRefCallback = (el: HTMLDivElement | null) => void;

/* ---------------------------- Content data --------------------------- */

const FEATURES: Feature[] = [
  {
    tag: "Ingestion",
    title: "Neural Ingestion",
    body: "Streams data from any source and cleans it into model-ready signal in real time.",
    glow: "blue",
  },
  {
    tag: "Reasoning",
    title: "Contextual Reasoning",
    body: "Builds a long-context map of your stack so answers stay grounded.",
    glow: "cyan",
  },
  {
    tag: "Autonomy",
    title: "Autonomous Agents",
    body: "Plans multi-step tasks, executes them, and self-corrects along the way.",
    glow: "purple",
  },
  {
    tag: "Memory",
    title: "Adaptive Memory",
    body: "Persists across sessions, learning your team's conventions over time.",
    glow: "blue",
  },
  {
    tag: "Fusion",
    title: "Multi-Modal Fusion",
    body: "Reads text, code, images, and audio as one continuous signal.",
    glow: "cyan",
  },
  {
    tag: "Inference",
    title: "Real-Time Inference",
    body: "Sub-100ms responses at production scale, tuned to feel instant.",
    glow: "purple",
  },
  {
    tag: "Safety",
    title: "Guarded Autonomy",
    body: "Every autonomous action is scoped, logged, and reversible.",
    glow: "blue",
  },
  {
    tag: "Learning",
    title: "Continuous Learning",
    body: "Retrains on live feedback loops instead of static snapshots.",
    glow: "cyan",
  },
];

const GLOW: Record<GlowKey, { core: string; soft: string }> = {
  blue: { core: "#3b82f6", soft: "rgba(59,130,246,0.35)" },
  cyan: { core: "#22d3ee", soft: "rgba(34,211,238,0.35)" },
  purple: { core: "#a855f7", soft: "rgba(168,85,247,0.35)" },
};

const ROW_H = 210; // svg units per row
const TOP_PAD = 80;
const SVG_H = TOP_PAD * 2 + ROW_H * (FEATURES.length - 1);

interface PathPoint {
  x: number;
  y: number;
}

// Corner-to-corner: points sit near the far edges (x: 8 / 192 in a
// 200-wide viewBox) instead of a gentle offset, so the connector reads
// as a snake winding from one corner of the track to the other.
function buildPath(): { d: string; pts: PathPoint[] } {
  const pts: PathPoint[] = FEATURES.map((_, i) => ({
    x: i % 2 === 0 ? 16 : 184,
    y: TOP_PAD + i * ROW_H,
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const midY = a.y + (b.y - a.y) / 2;
    d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
  }
  return { d, pts };
}

const { d: PATH_D } = buildPath();

/* ---------------------------------------------------------------- */

interface FeatureCardProps {
  feature: Feature;
  index: number;
  align: Align;
  waveRef: WaveRefCallback;
}

function FeatureCard({ feature, index, align, waveRef }: FeatureCardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null); // handles scroll-reveal
  const tiltRef = useRef<HTMLDivElement | null>(null); // handles 3D pointer tilt
  const rafRef = useRef<number | null>(null);
  const colors = GLOW[feature.glow];

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("ft-inview");
          io.unobserve(el);
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = tiltRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 14;
    const rotateX = (0.5 - py) * 14;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      card.style.transition = "transform 0.08s linear";
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
    });
  }, []);

  const handleLeave = useCallback(() => {
    const card = tiltRef.current;
    if (!card) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    card.style.transition = "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  }, []);

  const rowStyle: CSSVars = { "--float-delay": `${(index % 4) * 0.9}s` };
  const dotStyle: CSSVars = { "--dot-color": colors.core };
  const cardStyle: CSSVars = {
    "--glow-core": colors.core,
    "--glow-soft": colors.soft,
  };

  return (
    <div
      ref={wrapRef}
      className={`ft-row ${align === "left" ? "ft-row-left" : "ft-row-right"}`}
      style={rowStyle}
    >
      {/* connector dot on the spine */}
      <span className="ft-dot" style={dotStyle} aria-hidden="true">
        <span className="ft-dot-core" />
        <span className="ft-dot-ring" />
      </span>

      {/* scroll-velocity "snake" wave — its own element so it never
          fights with the tilt or idle-float transforms below it */}
      <div ref={waveRef} className="ft-wave">
        <div className="ft-card-float">
          <div
            ref={tiltRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="ft-card"
            style={cardStyle}
          >
            <div className="ft-card-sheen" />
            <span className="ft-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="ft-tag">{feature.tag}</span>
            <h3 className="ft-title">{feature.title}</h3>
            <p className="ft-body">{feature.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

export default function FeatureTimeline() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const revealPathRef = useRef<SVGPathElement | null>(null);
  const mobilePathRef = useRef<SVGLineElement | null>(null);
  const desktopSvgRef = useRef<SVGSVGElement | null>(null);
  const orbARef = useRef<HTMLDivElement | null>(null);
  const orbBRef = useRef<HTMLDivElement | null>(null);
  const pathLenRef = useRef<number>(0);
  const tickingRef = useRef<boolean>(false);

  // Per-card wave elements, filled via ref callbacks as cards mount.
  const waveElsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll-velocity -> snake-wave physics state.
  const lastYRef = useRef<number>(0);
  const energyRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);
  const waveRafRef = useRef<number | null>(null);

  // Precompute path length once mounted (for the scroll-driven dash reveal)
  useEffect(() => {
    if (revealPathRef.current) {
      pathLenRef.current = revealPathRef.current.getTotalLength();
      revealPathRef.current.style.strokeDasharray = `${pathLenRef.current}`;
      revealPathRef.current.style.strokeDashoffset = `${pathLenRef.current}`;
    }
    if (mobilePathRef.current) {
      const len = mobilePathRef.current.getTotalLength();
      mobilePathRef.current.style.strokeDasharray = `${len}`;
      mobilePathRef.current.style.strokeDashoffset = `${len}`;
    }
  }, []);

  const updateScroll = useCallback(() => {
    tickingRef.current = false;
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const total = rect.height + vh * 0.6;
    const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / total));

    const len = pathLenRef.current;
    if (revealPathRef.current && len) {
      revealPathRef.current.style.strokeDashoffset = `${len * (1 - progress)}`;
    }
    if (mobilePathRef.current) {
      const mlen = mobilePathRef.current.getTotalLength();
      mobilePathRef.current.style.strokeDashoffset = `${mlen * (1 - progress)}`;
    }
  }, []);

  const onScroll = useCallback(() => {
    if (!tickingRef.current) {
      tickingRef.current = true;
      requestAnimationFrame(updateScroll);
    }
  }, [updateScroll]);

  const onPointerMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (orbARef.current) {
      orbARef.current.style.transform = `translate3d(${px * 40}px, ${py * 40}px, 0)`;
    }
    if (orbBRef.current) {
      orbBRef.current.style.transform = `translate3d(${px * -55}px, ${py * -55}px, 0)`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll, updateScroll]);

  // The snake wave: converts scroll velocity into a decaying "energy"
  // value, then propagates it through the cards (and the connector
  // line itself) with a per-index phase offset so it visibly travels
  // like a body undulating — moving down as you scroll down, and
  // reversing as you scroll up.
  useEffect(() => {
    lastYRef.current = window.scrollY;

    const tick = () => {
      const y = window.scrollY;
      const dy = y - lastYRef.current;
      lastYRef.current = y;

      // Impulse from this frame's scroll delta, decayed each frame so
      // motion settles smoothly a moment after scrolling stops.
      energyRef.current = energyRef.current * 0.9 + dy * 0.55;
      energyRef.current = Math.max(-28, Math.min(28, energyRef.current));

      // Phase keeps advancing (a little faster while energetic) so the
      // wave keeps traveling along the chain rather than snapping still.
      phaseRef.current += 0.045 + Math.min(Math.abs(energyRef.current) / 60, 0.12);

      waveElsRef.current.forEach((el, i) => {
        if (!el) return;
        const localPhase = phaseRef.current - i * 0.55;
        const offsetY = energyRef.current * Math.sin(localPhase) * 0.6;
        const rotate = energyRef.current * Math.cos(localPhase) * 0.12;
        el.style.transform = `translateY(${offsetY}px) rotate(${rotate}deg)`;
      });

      if (desktopSvgRef.current) {
        desktopSvgRef.current.style.transform = `translateY(${energyRef.current * 0.35}px) skewY(${energyRef.current * 0.045}deg)`;
      }

      waveRafRef.current = requestAnimationFrame(tick);
    };

    waveRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (waveRafRef.current) cancelAnimationFrame(waveRafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onPointerMove}
      className="ft-section"
      aria-label="Product feature timeline"
    >
      <style>{`
        .ft-section {
          position: relative;
          overflow: hidden;
          background: radial-gradient(ellipse 80% 50% at 50% 0%, #0d1226 0%, #05060c 55%, #030409 100%);
          padding: 96px 20px 120px;
          isolation: isolate;
        }
        .ft-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          will-change: transform;
          transition: transform 0.15s ease-out;
          z-index: 0;
        }
        .ft-orb-a {
          top: 6%;
          left: 8%;
          width: 380px;
          height: 380px;
          background: rgba(59,130,246,0.25);
        }
        .ft-orb-b {
          bottom: 8%;
          right: 6%;
          width: 420px;
          height: 420px;
          background: rgba(168,85,247,0.22);
        }
        .ft-heading {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 680px;
          margin: 0 auto 88px;
        }
        .ft-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #7dd3fc;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          margin-bottom: 18px;
        }
        .ft-eyebrow::before {
          content: "";
          width: 6px; height: 6px; border-radius: 50%;
          background: linear-gradient(90deg,#3b82f6,#a855f7);
          box-shadow: 0 0 12px 2px #3b82f6;
        }
        .ft-heading h2 {
          font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
          font-weight: 600;
          font-size: clamp(30px, 4.4vw, 46px);
          line-height: 1.12;
          letter-spacing: -0.01em;
          background: linear-gradient(180deg, #f4f6ff 0%, #b9c3de 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin: 0 0 16px;
        }
        .ft-heading p {
          color: #8b93a7;
          font-size: 16px;
          line-height: 1.6;
          margin: 0;
        }

        .ft-track {
          position: relative;
          max-width: 1040px;
          margin: 0 auto;
          z-index: 2;
          padding-left: 44px;
        }
        @media (min-width: 860px) {
          .ft-track { padding-left: 0; }
        }
        .ft-mobile-svg { display: block; }
        @media (min-width: 860px) {
          .ft-mobile-svg { display: none; }
        }
        .ft-svg {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          display: none;
          will-change: transform;
        }
        @media (min-width: 860px) {
          .ft-svg { display: block; }
        }

        .ft-row {
          position: relative;
          min-height: ${ROW_H}px;
          display: flex;
          align-items: center;
          z-index: 2;
        }
        .ft-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          display: none;
        }
        @media (min-width: 860px) {
          .ft-dot { display: block; }
        }
        .ft-dot-core {
          position: absolute;
          inset: 4px;
          border-radius: 50%;
          background: var(--dot-color);
          box-shadow: 0 0 14px 3px var(--dot-color), 0 0 28px 8px color-mix(in srgb, var(--dot-color) 55%, transparent);
        }
        .ft-dot-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid color-mix(in srgb, var(--dot-color) 60%, transparent);
          animation: ft-pulse 2.4s ease-out infinite;
        }
        @keyframes ft-pulse {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        .ft-row-left { justify-content: flex-start; }
        .ft-row-right { justify-content: flex-end; }

        /* Snake-wave wrapper: sized to sit near the track's edges so
           the small portrait cards visually anchor at each corner. */
        .ft-wave {
          width: 100%;
          will-change: transform;
        }
        @media (min-width: 860px) {
          .ft-wave { width: 30%; max-width: 210px; }
        }

        .ft-card-float {
          width: 100%;
        }
        .ft-inview .ft-card-float {
          animation: ft-float 6s ease-in-out var(--float-delay) infinite;
        }

        @keyframes ft-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .ft-row {
          opacity: 0;
        }
        .ft-row-left { transform: translate(-64px, 26px); }
        .ft-row-right { transform: translate(64px, 26px); }
        .ft-row.ft-inview {
          opacity: 1;
          transform: translate(0, 0);
          transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Small, portrait ("standing" / upside-down-rectangle) card */
        .ft-card {
          position: relative;
          width: 100%;
          max-width: 210px;
          min-height: 260px;
          margin: 0 auto;
          padding: 24px 20px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          background: linear-gradient(155deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid transparent;
          background-clip: padding-box;
          box-shadow:
            0 20px 45px -20px rgba(0,0,0,0.6),
            0 0 0 1px rgba(255,255,255,0.03) inset;
          transform-style: preserve-3d;
          will-change: transform;
          overflow: hidden;
          isolation: isolate;
        }
        @media (min-width: 860px) {
          .ft-card { max-width: none; }
        }
        .ft-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, var(--glow-core), rgba(255,255,255,0.06) 40%, var(--glow-soft));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.55;
          pointer-events: none;
        }
        .ft-card::after {
          content: "";
          position: absolute;
          inset: -40%;
          background: radial-gradient(circle at 50% 0%, var(--glow-soft), transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: -1;
        }
        .ft-card:hover::after { opacity: 0.8; }
        .ft-card-sheen {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.14), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .ft-card:hover .ft-card-sheen { opacity: 1; }

        .ft-index {
          display: block;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--glow-core);
          opacity: 0.85;
          margin-bottom: 8px;
        }
        .ft-tag {
          display: inline-block;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 10px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #cfe0ff;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          padding: 3px 9px;
          border-radius: 999px;
          margin-bottom: 12px;
          width: fit-content;
        }
        .ft-title {
          font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
          font-size: 17px;
          font-weight: 600;
          color: #f2f4fb;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .ft-body {
          font-size: 13px;
          line-height: 1.55;
          color: #9aa3b8;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          .ft-inview .ft-card-float { animation: none; }
          .ft-row { transition: opacity 0.4s ease; transform: none !important; }
          .ft-dot-ring { animation: none; }
          .ft-wave { transform: none !important; }
        }
      `}</style>

      <div className="ft-orb ft-orb-a" ref={orbARef} />
      <div className="ft-orb ft-orb-b" ref={orbBRef} />

      <div className="ft-heading">
        <span className="ft-eyebrow">Product Architecture</span>
        <h2>Eight systems, one continuous signal</h2>
        <p>
          Every part of the pipeline talks to the next in real time — trace the
          line to see how a raw signal becomes an autonomous decision.
        </p>
      </div>

      <div className="ft-track">
        <svg
          ref={desktopSvgRef}
          className="ft-svg"
          viewBox={`0 0 200 ${SVG_H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ft-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="ft-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* faint static track */}
          <path
            d={PATH_D}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
          />

          {/* scroll-revealed glowing line */}
          <path
            ref={revealPathRef}
            d={PATH_D}
            fill="none"
            stroke="url(#ft-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#ft-blur)"
          />

          {/* flowing energy particles */}
          {[0, 1, 2].map((i) => (
            <circle key={i} r="3" fill="#eaf2ff" filter="url(#ft-blur)">
              <animateMotion
                dur="4.5s"
                begin={`${i * 1.5}s`}
                repeatCount="indefinite"
                path={PATH_D}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.08;0.9;1"
                dur="4.5s"
                begin={`${i * 1.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>

        {/* simplified mobile spine */}
        <svg
          className="ft-mobile-svg"
          viewBox={`0 0 24 ${SVG_H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "6px",
            height: "100%",
            width: "24px",
          }}
        >
          <defs>
            <linearGradient id="ft-grad-m" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <line x1="4" y1="0" x2="4" y2={SVG_H} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <line
            ref={mobilePathRef}
            x1="4"
            y1="0"
            x2="4"
            y2={SVG_H}
            stroke="url(#ft-grad-m)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={f.title}
              feature={f}
              index={i}
              align={i % 2 === 0 ? "left" : "right"}
              waveRef={(el) => {
                waveElsRef.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
