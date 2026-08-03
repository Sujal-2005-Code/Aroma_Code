"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { login } from "@/lib/auth";
import { ApiError } from "@/lib/api/client";

const roles = [
  { id: "student", label: "Candidate", color: "text-brand-orange", bg: "bg-brand-orange/10 border-brand-orange/30" },
  { id: "admin", label: "Admin", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  { id: "recruiter", label: "Recruiter", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
];

const demoCredentials = [
  { role: "Candidate", email: "student@aroma.ai", password: "student123" },
  { role: "Admin", email: "admin@aroma.ai", password: "admin123" },
  { role: "Recruiter", email: "recruiter@aroma.ai", password: "recruiter123" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("student");
  const [email, setEmail] = useState("student@aroma.ai");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      router.push(result.role === "admin" ? "/admin" : result.role === "recruiter" ? "/recruiter" : "/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-pink/8 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
                <img
                  src={asset("/assets/aroma-logo.png")}
                  alt="Aroma Logo"
                  width={48}
                  height={48}
                  className="rounded-2xl shadow-lg shadow-brand-orange/20"
                />
          </Link>
          <p className="text-text-muted mt-2 text-sm">AI-Powered Talent Intelligence Platform</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="gradient-border">
            <h1 className="text-xl font-bold text-text-primary mb-1">Welcome back</h1>
            <p className="text-sm text-text-muted mb-6">Sign in to your account to continue</p>

            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    const cred = demoCredentials.find(d => d.role.toLowerCase() === role.id);
                    if (cred) { setEmail(cred.email); setPassword(cred.password); }
                  }}
                  className={cn(
                    "premium-btn py-2.5 rounded-xl text-sm font-medium border",
                    selectedRole === role.id ? `${role.bg} ${role.color}` : "glass-card text-text-muted hover:text-text-primary"
                  )}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40 transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-brand-orange" />
                  <span className="text-xs text-text-muted">Remember me</span>
                </label>
                <Link href="#" className="text-xs text-brand-orange hover:underline">Forgot password?</Link>
              </div>

              {error && <p className="text-xs text-red-400 glass-card rounded-lg px-3 py-2">{error}</p>}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-border-subtle">
              <p className="text-xs text-text-muted mb-3 text-center">Demo Credentials</p>
              <div className="space-y-2">
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.role}
                    onClick={() => {
                      setSelectedRole(cred.role.toLowerCase());
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                    className="premium-btn w-full glass-card rounded-lg px-3 py-2 flex items-center justify-between hover:bg-glass-strong"
                  >
                    <span className="text-xs font-medium text-text-primary">{cred.role}</span>
                    <span className="text-xs text-text-muted">{cred.email}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-text-muted mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-brand-orange hover:underline">Register free</Link>
            </p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-2 mt-6">
          <Shield className="w-3.5 h-3.5 text-text-muted" />
          <p className="text-xs text-text-muted">JWT secured • 256-bit encryption • GDPR compliant</p>
        </motion.div>
      </div>
    </div>
  );
}
