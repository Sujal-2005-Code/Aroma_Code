"use client";

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
    <footer className="border-t border-border-subtle bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/aroma-logo.png"
                alt="Aroma Logo"
                width={36}
                height={36}
                className="rounded-xl"
              />
            </div>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              AI-Powered Talent Intelligence Platform. Empowering students, enabling recruiters.
            </p>
            <div className="flex gap-3">
              {[Globe, ExternalLink, MessageCircle, Mail].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-text-muted hover:text-brand-orange hover:border-brand-orange/30 transition-all" aria-label="Social link">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border-subtle py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">© 2024 AROMA. All rights reserved.</p>
          <p className="text-xs text-text-muted">Built with ❤️ for the future of hiring</p>
        </div>
      </div>
    </footer>
  );
}
