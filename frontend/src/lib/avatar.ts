const PALETTES: [string, string, string][] = [
  ["#8b5cf6", "#22d3ee", "#f472b6"],
  ["#f97316", "#f43f5e", "#a855f7"],
  ["#10b981", "#06b6d4", "#6366f1"],
  ["#facc15", "#fb7185", "#8b5cf6"],
  ["#38bdf8", "#818cf8", "#e879f9"],
  ["#2dd4bf", "#a3e635", "#22d3ee"],
];

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AI";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Deterministic, dependency-free "AI generated" avatar rendered as an inline SVG data URL. */
export function generateAiAvatar(seed: string, name: string) {
  const h = hash(seed);
  const rand = rng(h);
  const palette = PALETTES[h % PALETTES.length];
  const initials = initialsOf(name);
  const style = h % 4;

  const blobs = Array.from({ length: 5 }, (_, i) => {
    const cx = 20 + rand() * 120;
    const cy = 20 + rand() * 120;
    const r = 26 + rand() * 46;
    const color = palette[i % palette.length];
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="0.55" filter="url(#soft)"/>`;
  }).join("");

  const rings =
    style === 1
      ? Array.from({ length: 3 }, (_, i) => {
          const r = 34 + i * 16;
          return `<circle cx="80" cy="80" r="${r}" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" stroke-dasharray="${4 + i * 3} ${6 + i}"/>`;
        }).join("")
      : "";

  const gridLines =
    style === 2
      ? Array.from({ length: 6 }, (_, i) => {
          const p = 20 + i * 24;
          return `<line x1="${p}" y1="0" x2="${p}" y2="160" stroke="rgba(255,255,255,0.12)" stroke-width="1"/><line x1="0" y1="${p}" x2="160" y2="${p}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`;
        }).join("")
      : "";

  const wave =
    style === 3
      ? `<path d="M0 ${100 + rand() * 20} Q 40 ${70 + rand() * 30} 80 ${100 + rand() * 20} T 160 ${95 + rand() * 25} V160 H0 Z" fill="${palette[2]}" opacity="0.45"/>`
      : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="${palette[0]}"/><stop offset="55%" stop-color="${palette[1]}"/><stop offset="100%" stop-color="${palette[2]}"/>
</linearGradient>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
</defs>
<rect width="160" height="160" fill="#0b0c18"/>
<rect width="160" height="160" fill="url(#bg)" opacity="0.85"/>
${blobs}${gridLines}${rings}${wave}
<circle cx="80" cy="80" r="46" fill="rgba(6,7,16,0.55)"/>
<text x="80" y="80" text-anchor="middle" dominant-baseline="central" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="34" font-weight="700" fill="#ffffff" letter-spacing="1">${initials}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function avatarBatch(name: string, salt = "") {
  return Array.from({ length: 6 }, (_, i) => generateAiAvatar(`${name || "aroma"}-${salt}-${i}`, name));
}
