"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, Search, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout, currentUser } from "@/lib/auth";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Students", href: "/#students" },
  { label: "Recruiters", href: "/#recruiters" },
  { label: "Pricing", href: "/#pricing" },
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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? currentUser() : null;

  const links = isDashboard ? dashboardLinks : navLinks;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border-subtle"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/assets/aroma-logo.png"
              alt="Aroma Logo"
              width={36}
              height={36}
              className="rounded-xl shadow-lg shadow-brand-orange/20 group-hover:shadow-brand-orange/40 transition-shadow"
            />
            <span className="text-xl font-bold gradient-text hidden sm:block">AROMA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
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
            <div className="px-4 py-4 space-y-1 bg-bg-surface/95 backdrop-blur-xl">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm text-text-muted hover:text-text-primary hover:bg-glass rounded-lg transition-colors"
                >
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
