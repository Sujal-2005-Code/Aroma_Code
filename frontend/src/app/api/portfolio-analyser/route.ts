import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const dynamic = "force-dynamic";

type Check = { label: string; score: number; detail: string; state: "strong" | "needs-work" };

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function isPrivateAddress(address: string) {
  if (isIP(address) === 4) {
    const [first, second] = address.split(".").map(Number);
    return first === 10 || first === 127 || first === 0 || first === 169 && second === 254 || first === 172 && second >= 16 && second <= 31 || first === 192 && second === 168;
  }
  const normalized = address.toLowerCase();
  return normalized === "::1" || normalized === "::" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
}

async function validatePublicUrl(rawUrl: string) {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Enter a valid public URL, including https://.");
  }
  if (!/^https?:$/.test(url.protocol) || url.username || url.password) throw new Error("Only standard public HTTP or HTTPS portfolio URLs are supported.");
  if (url.hostname === "localhost" || url.hostname.endsWith(".local")) throw new Error("Local network addresses cannot be analysed.");

  const addresses = isIP(url.hostname) ? [{ address: url.hostname }] : await lookup(url.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new Error("The URL must resolve to a public website.");
  return url;
}

function decode(text: string) {
  return text.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/\s+/g, " ").trim();
}

function textFromHtml(html: string) {
  return decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
}

function firstMatch(html: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) return decode(textFromHtml(match[1]));
  }
  return "";
}

function buildAnalysis(url: URL, html: string) {
  const title = firstMatch(html, [/<title[^>]*>([\s\S]*?)<\/title>/i]);
  const description = firstMatch(html, [/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i]);
  const headings = Array.from(html.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)).map((match) => textFromHtml(match[1])).filter(Boolean);
  const hrefs = Array.from(html.matchAll(/\shref=["']([^"']+)["']/gi)).map((match) => match[1]);
  const resolvedLinks = hrefs.map((href) => { try { return new URL(href, url); } catch { return null; } }).filter((link): link is URL => Boolean(link));
  const externalLinks = resolvedLinks.filter((link) => link.origin !== url.origin).length;
  const visibleText = textFromHtml(html).toLowerCase();
  const hasProjectEvidence = /\b(project|case study|portfolio|work|built|development)\b/.test(visibleText);
  const hasContact = /mailto:|\b(contact|let's talk|get in touch|hire me)\b/.test(html.toLowerCase());
  const hasGithub = /github\.com/i.test(html);
  const titleScore = clamp((title.length >= 18 ? 45 : title.length ? 22 : 0) + (description.length >= 70 ? 35 : description.length >= 20 ? 16 : 0) + (headings.length >= 3 ? 20 : headings.length * 6));
  const projectScore = clamp((hasProjectEvidence ? 45 : 0) + Math.min(headings.filter((heading) => /project|work|case study/i.test(heading)).length, 3) * 18 + (hasGithub ? 15 : 0));
  const navigationScore = clamp(Math.min(resolvedLinks.length, 10) * 6 + Math.min(externalLinks, 3) * 8 + (headings.length >= 4 ? 16 : 0));
  const contactScore = clamp((hasContact ? 55 : 0) + (hasGithub ? 25 : 0) + (externalLinks >= 2 ? 20 : 0));
  const contentScore = clamp(Math.min(visibleText.split(/\s+/).filter(Boolean).length, 500) * 0.12 + (description.length >= 100 ? 30 : 0) + (headings.length >= 5 ? 14 : 0));
  const checks: Check[] = [
    { label: "Search preview", score: titleScore, detail: titleScore >= 70 ? "The page has a meaningful title, description, and heading structure for a strong first impression." : "Add a clear page title, a 70–160 character meta description, and descriptive page headings.", state: titleScore >= 70 ? "strong" : "needs-work" },
    { label: "Project evidence", score: projectScore, detail: projectScore >= 70 ? "Public project or case-study signals are visible on the analysed page." : "Add a dedicated Projects or Case Studies section that explains what you built and the result.", state: projectScore >= 70 ? "strong" : "needs-work" },
    { label: "Portfolio structure", score: navigationScore, detail: navigationScore >= 70 ? "The page exposes enough structure and links for visitors to explore your work." : "Use clear headings and direct links to projects, demos, repositories, or supporting pages.", state: navigationScore >= 70 ? "strong" : "needs-work" },
    { label: "Contact and verification", score: contactScore, detail: contactScore >= 70 ? "Visitors can find contact or public verification paths from this page." : "Include a contact method and links to verifiable professional profiles such as GitHub or LinkedIn.", state: contactScore >= 70 ? "strong" : "needs-work" },
    { label: "Content depth", score: contentScore, detail: contentScore >= 70 ? "The public page has enough descriptive content to establish professional context." : "Add concise narrative copy explaining your role, expertise, process, and outcomes.", state: contentScore >= 70 ? "strong" : "needs-work" },
  ];
  const recommendations = checks.filter((check) => check.state === "needs-work").map((check) => check.detail);
  if (!hasGithub) recommendations.push("Link GitHub repositories or another public code profile from the portfolio to make technical work verifiable.");

  return { url: url.toString(), title, description, overall: clamp(titleScore * 0.2 + projectScore * 0.28 + navigationScore * 0.16 + contactScore * 0.18 + contentScore * 0.18), checks, recommendations: [...new Set(recommendations)].slice(0, 5), stats: { headings: headings.length, links: resolvedLinks.length, externalLinks } };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { url?: string };
    const url = await validatePublicUrl(body.url?.trim() ?? "");
    const response = await fetch(url, { cache: "no-store", redirect: "manual", headers: { Accept: "text/html,application/xhtml+xml" } });
    if (response.status >= 300 && response.status < 400) return NextResponse.json({ error: "This URL redirects. Please enter the final public portfolio URL instead." }, { status: 400 });
    if (!response.ok) return NextResponse.json({ error: `The portfolio returned HTTP ${response.status}.` }, { status: 400 });
    const contentType = response.headers.get("content-type") ?? "";
    const contentLength = Number(response.headers.get("content-length") ?? 0);
    if (!contentType.includes("text/html")) return NextResponse.json({ error: "The URL must point to an HTML portfolio page." }, { status: 400 });
    if (contentLength > 1_500_000) return NextResponse.json({ error: "The portfolio page is too large to analyse." }, { status: 413 });
    const html = (await response.text()).slice(0, 1_500_000);
    return NextResponse.json(buildAnalysis(url, html));
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "The portfolio could not be analysed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
