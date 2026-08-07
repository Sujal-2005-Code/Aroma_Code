"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, GraduationCap, Building2, ChevronLeft, Zap, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { register } from "@/lib/auth";
import { ApiError } from "@/lib/api/client";
import asset from "@/lib/asset";
import { useHydrated } from "@/lib/use-hydrated";

const roles = [
  { id: "student", label: "Candidate", icon: GraduationCap, desc: "Looking for opportunities", color: "brand-orange" },
  { id: "recruiter", label: "Recruiter", icon: Building2, desc: "Hiring talent", color: "blue" },
];

const steps = ["Account Type", "Personal Info", "Security"];

const features = [
  { icon: Zap, text: "AI-Powered" },
  { icon: Shield, text: "Secure" },
  { icon: Users, text: "Community" },
];

const floatingParticles = Array.from({ length: 15 }, (_, index) => ({
  id: index,
  left: (index * 41 + 7) % 100,
  top: (index * 67 + 23) % 100,
  rise: 50 + ((index * 31) % 150),
  duration: 4 + ((index * 5) % 6),
  delay: (index * 11) % 4,
}));

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mounted = useHydrated();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", college: "", company: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    if (step === 2) {
      if (form.password !== form.confirm) {
        setError("Passwords do not match.");
        return;
      }
      setError("");
      setLoading(true);
      try {
        await register(form.name, form.email, form.password, selectedRole as "student" | "recruiter");
        router.push("/auth/login");
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Unable to create your account.");
      } finally {
        setLoading(false);
      }
      return;
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden py-8">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Floating Particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1.5 h-1.5 bg-brand-pink/20 rounded-full"
              initial={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -particle.rise],
                opacity: [0, 1, 0],
                scale: [1, 1.5, 1],
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
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="flex justify-center gap-6 mb-6">
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

          {/* Step Indicator */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <motion.div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all relative",
                    i < step ? "gradient-bg text-white" : i === step ? "gradient-bg text-white" : "bg-white/5 text-text-muted"
                  )}
                  whileHover={{ scale: 1.1 }}
                >
                  <AnimatePresence mode="wait">
                    {i < step ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                      >
                        {i + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span className={cn("text-xs hidden sm:block transition-colors", i === step ? "text-text-primary" : "text-text-muted")}>{s}</span>
                {i < steps.length - 1 && (
                  <motion.div
                    className={cn("w-12 h-0.5 rounded", i < step ? "bg-brand-orange" : "bg-white/10")}
                    initial={{ width: i < step ? "100%" : "0%" }}
                    animate={{ width: i < step ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="gradient-border overflow-hidden">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "2px" }}
                className="absolute top-0 left-0 right-0 bg-gradient-to-r from-brand-orange via-brand-pink to-purple-500"
              />

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
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

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    custom={step > 0 ? 1 : -1}
                  >
                    {step === 0 && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h2 className="text-xl font-bold text-text-primary mb-1">Create your account</h2>
                          <p className="text-sm text-text-muted mb-6">Choose your role to get started</p>
                        </motion.div>
                        <div className="space-y-3">
                          {roles.map((role) => (
                            <motion.button
                              key={role.id}
                              type="button"
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedRole(role.id)}
                              className={cn(
                                "premium-btn w-full flex items-center gap-4 rounded-xl p-4 border text-left relative overflow-hidden",
                                selectedRole === role.id
                                  ? `bg-${role.color}/10 border-${role.color}/30 text-${role.color}`
                                  : "glass-card text-text-muted hover:text-text-primary"
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
                              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center relative z-10", selectedRole === role.id ? `bg-${role.color}/20` : "bg-white/5")}>
                                <role.icon className="w-6 h-6" />
                              </div>
                              <div className="relative z-10">
                                <p className="font-medium">{role.label}</p>
                                <p className="text-xs opacity-70">{role.desc}</p>
                              </div>
                              <AnimatePresence>
                                {selectedRole === role.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="ml-auto relative z-10"
                                  >
                                    <CheckCircle2 className="w-5 h-5" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                          ))}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button type="submit" className="w-full" size="lg">
                            Continue
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </motion.div>
                          </Button>
                        </motion.div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h2 className="text-xl font-bold text-text-primary mb-1">Personal Information</h2>
                          <p className="text-sm text-text-muted mb-4">Tell us about yourself</p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="text-xs text-text-muted mb-1.5 block">Full Name</label>
                          <div className="relative">
                            <motion.div
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                              animate={{ rotate: [0, -5, 5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                            >
                              <User className="w-4 h-4" />
                            </motion.div>
                            <motion.input
                              whileFocus={{ scale: 1.02 }}
                              type="text"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                              placeholder="Arjun Mehta"
                              required
                            />
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="text-xs text-text-muted mb-1.5 block">Email Address</label>
                          <div className="relative">
                            <motion.div
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                            >
                              <Mail className="w-4 h-4" />
                            </motion.div>
                            <motion.input
                              whileFocus={{ scale: 1.02 }}
                              type="email"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                              placeholder="you@example.com"
                              required
                            />
                          </div>
                        </motion.div>
                        {selectedRole === "student" ? (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <label className="text-xs text-text-muted mb-1.5 block">College / University</label>
                            <motion.input
                              whileFocus={{ scale: 1.02 }}
                              type="text"
                              value={form.college}
                              onChange={(e) => setForm({ ...form, college: e.target.value })}
                              className="w-full bg-glass border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                              placeholder="IIT Bombay"
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <label className="text-xs text-text-muted mb-1.5 block">Company Name</label>
                            <motion.input
                              whileFocus={{ scale: 1.02 }}
                              type="text"
                              value={form.company}
                              onChange={(e) => setForm({ ...form, company: e.target.value })}
                              className="w-full bg-glass border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                              placeholder="TechCorp Inc."
                            />
                          </motion.div>
                        )}
                        <div className="flex gap-3 pt-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="flex-1 px-4 py-2 glass-card rounded-xl text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                          </motion.button>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1"
                          >
                            <Button type="submit" className="w-full" size="lg">
                              Continue
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </motion.div>
                            </Button>
                          </motion.div>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <h2 className="text-xl font-bold text-text-primary mb-1">Security Setup</h2>
                          <p className="text-sm text-text-muted mb-4">Create a secure password</p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="text-xs text-text-muted mb-1.5 block">Password</label>
                          <div className="relative">
                            <motion.div
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                              animate={{ rotate: [0, -5, 5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                            >
                              <Lock className="w-4 h-4" />
                            </motion.div>
                            <motion.input
                              whileFocus={{ scale: 1.02 }}
                              type={showPassword ? "text" : "password"}
                              value={form.password}
                              onChange={(e) => setForm({ ...form, password: e.target.value })}
                              className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                              placeholder="••••••••"
                              required
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
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
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="text-xs text-text-muted mb-1.5 block">Confirm Password</label>
                          <div className="relative">
                            <motion.div
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                            >
                              <Lock className="w-4 h-4" />
                            </motion.div>
                            <motion.input
                              whileFocus={{ scale: 1.02 }}
                              type="password"
                              value={form.confirm}
                              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                              className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                              placeholder="••••••••"
                              required
                            />
                          </div>
                        </motion.div>
                        <div className="flex gap-3 pt-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="flex-1 px-4 py-2 glass-card rounded-xl text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                          </motion.button>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1"
                          >
                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                              {loading ? (
                                <span className="flex items-center gap-2">
                                  <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                  />
                                  Creating...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4" />
                                  Create Account
                                </span>
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </form>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-sm text-text-muted">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-brand-orange hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
