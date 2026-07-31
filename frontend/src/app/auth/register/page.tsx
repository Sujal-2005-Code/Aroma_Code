"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, GraduationCap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { register } from "@/lib/auth";
import { ApiError } from "@/lib/api/client";

const roles = [
  { id: "student", label: "Candidate", icon: GraduationCap, desc: "Looking for opportunities" },
  { id: "recruiter", label: "Recruiter", icon: Building2, desc: "Hiring talent" },
];

const steps = ["Account Type", "Personal Info", "Security"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", college: "", company: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) { setStep(step + 1); return; }
    if (step === 2) {
      if (form.password !== form.confirm) {
        setError("Passwords do not match.");
        return;
      }
      // Register user directly
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

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden py-8">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-orange/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-pink/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <img
              src="/assets/aroma-logo.png"
              alt="Aroma Logo"
              width={48}
              height={48}
              className="rounded-2xl shadow-lg shadow-brand-orange/20"
            />
          </Link>
        </motion.div>

        {/* Step Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                i < step ? "gradient-bg text-white" : i === step ? "gradient-bg text-white" : "bg-white/5 text-text-muted"
              )}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn("text-xs hidden sm:block", i === step ? "text-text-primary" : "text-text-muted")}>{s}</span>
              {i < steps.length - 1 && <div className={cn("w-8 h-0.5 rounded", i < step ? "bg-brand-orange" : "bg-white/10")} />}
            </div>
          ))}
        </motion.div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Card className="gradient-border">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <p className="text-xs text-red-400 glass-card rounded-lg px-3 py-2">{error}</p>}
              {step === 0 && (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1">Create your account</h2>
                    <p className="text-sm text-text-muted mb-6">Choose your role to get started</p>
                    <div className="space-y-3">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={cn(
                            "w-full flex items-center gap-4 rounded-xl p-4 border transition-all text-left",
                            selectedRole === role.id
                              ? "bg-brand-orange/10 border-brand-orange/30 text-brand-orange"
                              : "glass-card text-text-muted hover:text-text-primary"
                          )}
                        >
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", selectedRole === role.id ? "bg-brand-orange/20" : "bg-white/5")}>
                            <role.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{role.label}</p>
                            <p className="text-xs opacity-70">{role.desc}</p>
                          </div>
                          {selectedRole === role.id && <CheckCircle2 className="w-5 h-5 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg">Continue <ArrowRight className="w-4 h-4" /></Button>
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1">Personal Information</h2>
                    <p className="text-sm text-text-muted mb-4">Tell us about yourself</p>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                        placeholder="Arjun Mehta"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1.5 block">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  {selectedRole === "student" ? (
                    <div>
                      <label className="text-xs text-text-muted mb-1.5 block">College / University</label>
                      <input
                        type="text"
                        value={form.college}
                        onChange={(e) => setForm({ ...form, college: e.target.value })}
                        className="w-full bg-glass border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                        placeholder="IIT Bombay"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs text-text-muted mb-1.5 block">Company</label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full bg-glass border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                        placeholder="Acme Corp"
                      />
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
                    <Button type="submit" className="flex-1">Continue <ArrowRight className="w-4 h-4" /></Button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1">Secure Your Account</h2>
                    <p className="text-sm text-text-muted mb-4">Create a strong password</p>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                        placeholder="Min. 8 characters"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" aria-label="Toggle password">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1.5 block">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="password"
                        value={form.confirm}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/40"
                        placeholder="Repeat password"
                        required
                      />
                    </div>
                  </div>
                  {/* Password strength */}
                  <div>
                    <p className="text-xs text-text-muted mb-2">Password Strength</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={cn(
                          "flex-1 h-1.5 rounded-full transition-colors",
                          form.password.length >= i * 2 ? i <= 2 ? "bg-red-400" : i === 3 ? "bg-amber-400" : "bg-emerald-400" : "bg-white/10"
                        )} />
                      ))}
                    </div>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 accent-brand-orange" required />
                    <span className="text-xs text-text-muted">I agree to the <Link href="#" className="text-brand-orange hover:underline">Terms of Service</Link> and <Link href="#" className="text-brand-orange hover:underline">Privacy Policy</Link></span>
                  </label>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Account...</span> : "Create Account"}
                    </Button>
                  </div>
                </>
              )}
            </form>
            <p className="text-center text-xs text-text-muted mt-6">
              Already have an account? <Link href="/auth/login" className="text-brand-orange hover:underline">Sign in</Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
