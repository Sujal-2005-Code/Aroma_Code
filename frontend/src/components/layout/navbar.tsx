"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Menu, X, Bell, Search, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout, useCurrentUser } from "@/lib/auth";
import { dashboardMenuItems } from "@/components/layout/dashboard-menu";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "Students", href: "/#students" },
  { label: "Recruiters", href: "/#recruiters" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
];

const dashboardLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Assessments", href: "/assessments" },
  { label: "Resume", href: "/resume" },
  { label: "Jobs", href: "/jobs" },
  { label: "AI Mentor", href: "/mentor" },
];

export function Navbar({ isDashboard = false }: { isDashboard?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();

  const desktopLinks = isDashboard ? dashboardLinks : navLinks;
  const mobileLinks: Array<{ label: string; href: string; icon?: LucideIcon }> = isDashboard
    ? dashboardMenuItems
        .filter((item) => !item.adminOnly || user?.role === "admin")
        .map(({ label, href, icon }) => ({ label, href, icon }))
    : navLinks;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border-subtle"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="premium-btn group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 hover:border-brand-orange/30 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(252,143,15,0.16)]">
            <motion.div
              whileHover={{ rotateY: 180, rotateX: 10, scale: 1.08 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-pink/20 p-1 shadow-inner shadow-brand-orange/20"
            >
              <Image
                src="/assets/Robot.png"
                alt="Aroma Logo"
                width={32}
                height={32}
                className="rounded-xl object-contain"
              />
            </motion.div>
            <span className="hidden text-lg font-semibold tracking-[0.24em] text-text-primary transition-all duration-300 group-hover:text-brand-orange sm:block">
              AROMA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {desktopLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-glass"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isDashboard ? (
              <>
                <Button variant="ghost" size="icon" className="relative" aria-label="Search">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-pink rounded-full" />
                </Button>
                {user ? (
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => router.push("/auth/login")}>
                    Sign In
                  </Button>
                )}
              </>
            ) : (
              <>
                {!user ? (
                  <>
                    <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => router.push("/auth/login")}>
                      Sign In
                    </Button>
                    <Button size="sm" onClick={() => router.push("/auth/register")}>
                      Get Started
                      <Sparkles className="w-3.5 h-3.5" />
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    Sign Out
                  </Button>
                )}
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-border-subtle overflow-hidden"
          >
            <div className="max-h-[calc(100svh-4rem)] overflow-y-auto px-4 py-4 space-y-1 bg-bg-surface/95 backdrop-blur-xl">
              {mobileLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:text-text-primary hover:bg-glass rounded-lg transition-colors",
                    isDashboard && "py-3.5"
                  )}
                >
                  {link.icon && <link.icon className="w-4 h-4 text-text-muted/80" />}
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
