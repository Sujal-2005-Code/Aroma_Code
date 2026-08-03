"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Globe, ExternalLink, MessageCircle, Mail } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Resume Analyzer", "Coding Platform", "AI Mentor"],
  Company: ["About", "Careers", "Blog", "Press", "Partners"],
  Resources: ["Documentation", "API Reference", "Community", "Support", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-[#070b16] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-20%] h-80 w-80 rounded-full bg-brand-orange/10 blur-[110px]" />
        <div className="absolute right-[-10%] top-[8%] h-96 w-96 rounded-full bg-brand-pink/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="border-b border-white/8 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.18em] text-white/70 uppercase backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
                Premium Talent Platform
              </div>

              <div className="flex items-center gap-3">
                <Image
                  src="/assets/Robot.png"
                  alt="Aroma Logo"
                  width={44}
                  height={44}
                  className="rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
                />
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">AROMA</h2>
                  <p className="text-sm text-white/55">AI-Powered Talent Intelligence</p>
                </div>
              </div>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-[15px]">
                Empowering students with verified skills, and giving recruiters a faster way to discover, evaluate, and hire standout talent.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/#features" className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/80 transition hover:border-brand-orange/30 hover:bg-white/10 hover:text-white">
                  Explore features
                </Link>
                <Link href="/auth/register" className="rounded-full bg-gradient-to-r from-brand-orange to-brand-pink px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,87,121,0.28)] transition hover:scale-[1.01]">
                  Get started
                </Link>
              </div>

              <div className="mt-7 flex gap-3">
                {[Globe, ExternalLink, MessageCircle, Mail].map((Icon, i) => (
                  <button
                    key={i}
                    className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-brand-orange/30 hover:bg-white/10 hover:text-brand-orange"
                    aria-label="Social link"
                  >
                    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:justify-self-end">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                  <h3 className="mb-4 text-sm font-semibold tracking-[0.08em] text-white/85 uppercase">{title}</h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link}>
                        <Link href="#" className="text-sm text-white/58 transition-colors hover:text-white">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2024 AROMA. All rights reserved.</p>
          <p className="text-white/50">Built for the future of hiring</p>
        </div>
      </div>
    </footer>
  );
}
