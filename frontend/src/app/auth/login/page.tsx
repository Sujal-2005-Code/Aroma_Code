"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Zap, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { login } from "@/lib/auth";
import { ApiError } from "@/lib/api/client";
import asset from "@/lib/asset";
import { useHydrated } from "@/lib/use-hydrated";

const roles = [
  { id: "student", label: "Candidate", color: "text-brand-orange", bg: "bg-brand-orange/10 border-brand-orange/30", icon: "🎓" },
  { id: "admin", label: "Admin", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30", icon: "🛡️" },
  { id: "recruiter", label: "Recruiter", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", icon: "💼" },
];

const demoCredentials = [
  { role: "Candidate", email: "student@aroma.ai", password: "student123" },
  { role: "Admin", email: "admin@aroma.ai", password: "admin123" },
  { role: "Recruiter", email: "recruiter@aroma.ai", password: "recruiter123" },
];

const features = [
  { icon: Zap, text: "AI-Powered" },
  { icon: Globe, text: "Global Access" },
  { icon: Award, text: "Verified Skills" },
];

const floatingParticles = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  left: (index * 37 + 11) % 100,
  top: (index * 61 + 17) % 100,
  rise: 100 + ((index * 29) % 200),
  duration: 5 + ((index * 7) % 5),
  delay: (index * 13) % 5,
}));

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("student");
  const [email, setEmail] = useState("student@aroma.ai");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mounted = useHydrated();

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]"
        />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Floating Particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-brand-orange/20 rounded-full"
              initial={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -particle.rise],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={asset("/assets/aroma-logo.png")}
                  alt="Aroma Logo"
                  width={48}
                  height={48}
                  className="rounded-2xl shadow-lg shadow-brand-orange/20"
                />
              </motion.div>
            </Link>
            <motion.p
              variants={itemVariants}
              className="text-text-muted mt-2 text-sm"
            >
              AI-Powered Talent Intelligence Platform
            </motion.p>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="flex justify-center gap-6 mb-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 text-text-muted text-xs"
              >
                <feature.icon className="w-4 h-4 text-brand-orange" />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="gradient-border overflow-hidden">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "2px" }}
                className="absolute top-0 left-0 right-0 bg-gradient-to-r from-brand-orange via-brand-pink to-purple-500"
              />

              <h1 className="text-xl font-bold text-text-primary mb-1">Welcome back</h1>
              <p className="text-sm text-text-muted mb-6">Sign in to your account to continue</p>

              {/* Role Selector */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedRole(role.id);
                      const cred = demoCredentials.find(d => d.role.toLowerCase() === role.id);
                      if (cred) { setEmail(cred.email); setPassword(cred.password); }
                    }}
                    className={cn(
                      "premium-btn py-2.5 rounded-xl text-sm font-medium border relative overflow-hidden",
                      selectedRole === role.id ? `${role.bg} ${role.color}` : "glass-card text-text-muted hover:text-text-primary"
                    )}
                  >
                    <AnimatePresence>
                      {selectedRole === role.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        />
                      )}
                    </AnimatePresence>
                    <span className="relative z-10">{role.icon} {role.label}</span>
                  </motion.button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <label className="text-xs text-text-muted mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <motion.div
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Mail className="w-4 h-4" />
                    </motion.div>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40 transition-colors"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="text-xs text-text-muted mb-1.5 block">Password</label>
                  <div className="relative">
                    <motion.div
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Lock className="w-4 h-4" />
                    </motion.div>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40 transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                      aria-label="Toggle password visibility"
                    >
                      <AnimatePresence mode="wait">
                        {showPassword ? (
                          <motion.div
                            key="hide"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                          >
                            <EyeOff className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="show"
                            initial={{ opacity: 0, rotate: 90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -90 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded accent-brand-orange" />
                    <span className="text-xs text-text-muted">Remember me</span>
                  </label>
                  <Link href="#" className="text-xs text-brand-orange hover:underline">Forgot password?</Link>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-red-400 glass-card rounded-lg px-3 py-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Signing in...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Sign In
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>

              {/* Demo Credentials */}
              <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-border-subtle">
                <p className="text-xs text-text-muted mb-3 text-center">Demo Credentials</p>
                <div className="space-y-2">
                  {demoCredentials.map((cred) => (
                    <motion.button
                      key={cred.role}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedRole(cred.role.toLowerCase());
                        setEmail(cred.email);
                        setPassword(cred.password);
                      }}
                      className="premium-btn w-full glass-card rounded-lg px-3 py-2 flex items-center justify-between hover:bg-glass-strong"
                    >
                      <span className="text-xs font-medium text-text-primary">{cred.role}</span>
                      <span className="text-xs text-text-muted">{cred.email}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-brand-orange hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
