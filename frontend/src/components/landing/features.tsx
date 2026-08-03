"use client";

const FEATURES = [
  {
    title: "AI Resume Analyzer",
    description: "Get instant ATS scores, keyword optimization, and AI-powered suggestions to make your resume stand out.",
    icon: "doc",
    accent: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.22)",
  },
  {
    title: "Coding Platform",
    description: "Practice 500+ problems with AI code reviews, detailed explanations, and real-time leaderboards.",
    icon: "code",
    accent: "#22c55e",
    glow: "rgba(34, 197, 94, 0.22)",
  },
  {
    title: "AI Skill Passport",
    description: "A verified digital credential combining coding, projects, certificates, and soft skills into one score.",
    icon: "badge",
    accent: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.22)",
  },
  {
    title: "Portfolio Builder",
    description: "Generate stunning portfolios from your resume with multiple themes and one-click deployment.",
    icon: "palette",
    accent: "#a855f7",
    glow: "rgba(168, 85, 247, 0.22)",
  },
  {
    title: "AI Career Mentor",
    description: "24/7 personalized career guidance, interview prep, learning roadmaps, and motivation.",
    icon: "mentor",
    accent: "#ec4899",
    glow: "rgba(236, 72, 153, 0.22)",
  },
  {
    title: "Skill Gap Analysis",
    description: "Identify missing skills for your target role with estimated timelines and curated learning paths.",
    icon: "target",
    accent: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.18)",
  },
  {
    title: "Mock Interviews",
    description: "AI-powered mock interviews across HR, Technical, Behavioral, and System Design rounds.",
    icon: "camera",
    accent: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.22)",
  },
  {
    title: "Smart Job Portal",
    description: "AI-matched job recommendations with application tracking and interview scheduling.",
    icon: "briefcase",
    accent: "#818cf8",
    glow: "rgba(129, 140, 248, 0.22)",
  },
  {
    title: "GitHub Analytics",
    description: "Deep analysis of your GitHub profile including contributions, languages, and project quality.",
    icon: "graph",
    accent: "#10b981",
    glow: "rgba(16, 185, 129, 0.22)",
  },
  {
    title: "Project Verification",
    description: "AI verifies your projects for code quality, architecture, security, and documentation.",
    icon: "chart",
    accent: "#fb7185",
    glow: "rgba(251, 113, 133, 0.22)",
  },
  {
    title: "Recruiter Dashboard",
    description: "Search, compare, and hire verified candidates with comprehensive skill analytics.",
    icon: "shield",
    accent: "#14b8a6",
    glow: "rgba(20, 184, 166, 0.22)",
  },
  {
    title: "Resume to Portfolio",
    description: "Transform your resume into a beautiful portfolio website in seconds with AI.",
    icon: "bolt",
    accent: "#facc15",
    glow: "rgba(250, 204, 21, 0.22)",
  },
] as const;

type FeatureIconName = (typeof FEATURES)[number]["icon"];

export function Features() {
  return (
    <section id="features" className="features-section scroll-mt-24">
      <style>{css}</style>

      <div className="features-shell">
        <header className="features-header">
          <p className="features-eyebrow">Platform features</p>
          <h2>
            <a href="#features" className="features-title-link" aria-label="Jump to features section">
              Feature highlights
            </a>
          </h2>
          <p className="features-intro">
            Click the heading to jump back to this section, then explore the tools built into AROMA.
          </p>
        </header>

        <div className="features-backdrop" aria-hidden="true">
          <span className="aurora aurora-a" />
          <span className="aurora aurora-b" />
          <span className="aurora aurora-c" />
          <svg className="snake-lines" viewBox="0 0 1280 760" preserveAspectRatio="none">
            <path className="snake snake-1" d="M120 140 C 260 40, 370 40, 480 140 S 720 240, 860 140 S 1080 40, 1160 150" />
            <path className="snake snake-2" d="M140 355 C 280 260, 390 260, 520 355 S 760 455, 900 355 S 1080 255, 1140 360" />
            <path className="snake snake-3" d="M120 575 C 270 470, 380 470, 500 575 S 710 685, 870 575 S 1060 470, 1160 585" />
            <path className="snake snake-4" d="M350 85 C 480 170, 610 170, 760 85 S 980 -5, 1160 85" />
          </svg>
        </div>
        <div className="features-grid">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="feature-card"
              style={{
                ["--accent" as never]: feature.accent,
                ["--glow" as never]: feature.glow,
              }}
            >
              <div className="icon-wrap" aria-hidden="true">
                <FeatureIcon type={feature.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;

function FeatureIcon({ type }: { type: FeatureIconName }) {
  switch (type) {
    case "doc":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3h6l4 4v14H7z" />
          <path d="M13 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 8l-4 4 4 4" />
          <path d="M16 8l4 4-4 4" />
          <path d="M14 6l-4 12" />
        </svg>
      );
    case "badge":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="9" r="4" />
          <path d="M10.5 13.5 9 21l3-1.8L15 21l-1.5-7.5" />
        </svg>
      );
    case "palette":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a9 9 0 1 0 0 18h2.2a1.8 1.8 0 0 0 1.8-1.8c0-.8-.5-1.5-1.2-1.7l-.8-.2a1.2 1.2 0 0 1-.9-1.2V15a1 1 0 0 1 1-1h1.3A2.6 2.6 0 0 0 18 11.4V11a8 8 0 0 0-6-8z" />
          <circle cx="8" cy="9" r="1" />
          <circle cx="6.5" cy="13" r="1" />
          <circle cx="9" cy="16" r="1" />
        </svg>
      );
    case "mentor":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a5 5 0 0 0-5 5c0 1.5.7 2.8 1.7 3.7V15l3.3-1.8L15 15v-3.3A5 5 0 0 0 12 3z" />
          <path d="M7 20c1.5-2 3.3-3 5-3s3.5 1 5 3" />
        </svg>
      );
    case "target":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3" />
          <path d="M22 12h-3" />
          <path d="M12 22v-3" />
          <path d="M2 12h3" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h4l2-2h4l2 2h4v10H4z" />
          <circle cx="12" cy="12" r="3.2" />
        </svg>
      );
    case "briefcase":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M4 11h16" />
          <path d="M10 11v2h4v-2" />
        </svg>
      );
    case "graph":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19V5" />
          <path d="M5 19h14" />
          <path d="M8 15l3-3 3 2 4-6" />
          <circle cx="8" cy="15" r="1" />
          <circle cx="11" cy="12" r="1" />
          <circle cx="14" cy="14" r="1" />
          <circle cx="18" cy="8" r="1" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 17v-5" />
          <path d="M12 17V8" />
          <path d="M16 17v-7" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 19 6v5c0 4.7-3.1 8.5-7 10-3.9-1.5-7-5.3-7-10V6z" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
        </svg>
      );
    default:
      return null;
  }
}

const css = `
.features-section {
  position: relative;
  overflow: hidden;
  content-visibility: auto;
  contain-intrinsic-size: 1px 1400px;
  background:
    radial-gradient(circle at 20% 18%, rgba(82, 120, 255, 0.22), transparent 26%),
    radial-gradient(circle at 82% 14%, rgba(236, 72, 153, 0.18), transparent 22%),
    radial-gradient(circle at 50% 82%, rgba(34, 197, 94, 0.13), transparent 28%),
    #070b16;
  padding: 24px 24px 72px;
}

.features-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.55), transparent 90%);
  pointer-events: none;
}

.features-section::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(7, 11, 22, 0), rgba(7, 11, 22, 0.45) 55%, rgba(7, 11, 22, 0.8));
  pointer-events: none;
}

.features-shell {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
}

.features-header {
  position: relative;
  z-index: 2;
  margin-bottom: 28px;
  text-align: center;
}

.features-eyebrow {
  margin: 0 0 10px;
  color: rgba(186, 198, 218, 0.8);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.features-header h2 {
  margin: 0;
  font-size: clamp(28px, 4vw, 46px);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.features-title-link {
  color: #f5f7fb;
  text-decoration: none;
  transition: color 180ms ease, opacity 180ms ease;
}

.features-title-link:hover {
  color: #ffffff;
  opacity: 0.88;
}

.features-intro {
  margin: 14px auto 0;
  max-width: 720px;
  color: rgba(154, 164, 183, 0.92);
  font-size: 15px;
  line-height: 1.7;
}

.features-backdrop {
  position: absolute;
  inset: -40px -20px auto;
  height: 760px;
  pointer-events: none;
  overflow: hidden;
}

.aurora {
  position: absolute;
  border-radius: 999px;
  filter: blur(28px);
  opacity: 0.65;
  animation: drift 16s ease-in-out infinite;
}

.aurora-a {
  width: 340px;
  height: 340px;
  top: 20px;
  left: -80px;
  background: rgba(59, 130, 246, 0.18);
}

.aurora-b {
  width: 280px;
  height: 280px;
  top: 240px;
  right: 60px;
  background: rgba(236, 72, 153, 0.16);
  animation-duration: 20s;
  animation-delay: -4s;
}

.aurora-c {
  width: 320px;
  height: 320px;
  bottom: -40px;
  left: 34%;
  background: rgba(20, 184, 166, 0.16);
  animation-duration: 22s;
  animation-delay: -8s;
}

.snake-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.9;
}

.snake {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.4;
  stroke-dasharray: 18 16;
  filter: drop-shadow(0 0 6px rgba(120, 160, 255, 0.18));
  animation: snakeFlow 14s linear infinite;
}

.snake-1 { stroke: rgba(96, 165, 250, 0.55); animation-duration: 16s; }
.snake-2 { stroke: rgba(34, 197, 94, 0.5); animation-duration: 18s; animation-direction: reverse; }
.snake-3 { stroke: rgba(236, 72, 153, 0.48); animation-duration: 20s; }
.snake-4 { stroke: rgba(245, 158, 11, 0.46); animation-duration: 22s; animation-direction: reverse; }

.features-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.feature-card {
  --accent: #60a5fa;
  --glow: rgba(96, 165, 250, 0.2);
  min-height: 230px;
  padding: 22px 20px 24px;
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.04)),
    linear-gradient(180deg, rgba(19, 25, 41, 0.82), rgba(14, 19, 33, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px) saturate(125%);
  -webkit-backdrop-filter: blur(12px) saturate(125%);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    0 22px 46px rgba(0, 0, 0, 0.24),
    0 0 32px var(--glow);
  color: #edf1f7;
  position: relative;
  overflow: hidden;
  contain: layout paint;
  transform: translateZ(0);
}

.feature-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.16), transparent 28%, transparent 72%, rgba(255, 255, 255, 0.06));
  opacity: 0.75;
  pointer-events: none;
}

.feature-card::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.85;
  filter: drop-shadow(0 0 12px var(--glow));
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
    0 34px 70px rgba(0, 0, 0, 0.34),
    0 0 60px var(--glow);
}

.icon-wrap {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  margin-bottom: 18px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 26%, transparent), rgba(255, 255, 255, 0.06));
  color: var(--accent);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08) inset, 0 0 24px var(--glow);
}

.icon-wrap svg {
  width: 24px;
  height: 24px;
}

.feature-card h3 {
  margin: 0 0 12px;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.feature-card p {
  margin: 0;
  color: #9aa4b7;
  font-size: 15px;
  line-height: 1.6;
  max-width: 250px;
}

@keyframes snakeFlow {
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: -680;
  }
}

@keyframes drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(24px, -18px, 0) scale(1.08);
  }
}

@media (max-width: 1180px) {
  .features-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .features-section {
    padding-inline: 16px;
  }

  .features-backdrop {
    height: 620px;
  }

  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .feature-card {
    min-height: 210px;
  }
}

@media (max-width: 560px) {
  .features-backdrop {
    display: none;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    min-height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .aurora,
  .snake {
    animation: none;
  }
}
`;