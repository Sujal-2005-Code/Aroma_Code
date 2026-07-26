"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Palette, Upload, Eye, Globe, Smartphone, Monitor, Tablet,
  Code2, Download, ExternalLink, Search, CheckCircle2, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { name: "Developer", color: "from-blue-500 to-cyan-400", desc: "Clean, code-focused design" },
  { name: "Minimal", color: "from-gray-500 to-gray-400", desc: "Simple and elegant" },
  { name: "Glass", color: "from-brand-orange to-brand-pink", desc: "Glassmorphism style" },
  { name: "Modern", color: "from-purple-500 to-pink-400", desc: "Bold and creative" },
  { name: "SaaS", color: "from-emerald-500 to-teal-400", desc: "Professional SaaS feel" },
];

const previewSections = [
  "Hero", "About", "Skills", "Projects", "Experience", "Education", "Certificates", "Contact"
];

export default function PortfolioPage() {
  const [selectedTheme, setSelectedTheme] = useState("Glass");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [generated, setGenerated] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Portfolio Builder</h1>
            <p className="text-text-muted">Generate a beautiful portfolio from your resume in seconds.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm"><Download className="w-4 h-4" /> Export</Button>
            <Button size="sm"><Globe className="w-4 h-4" /> Deploy</Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            {!generated ? (
              <Card>
                <h3 className="text-sm font-medium text-text-primary mb-3">Generate Portfolio</h3>
                <p className="text-xs text-text-muted mb-4">Upload your resume or use your existing profile data to generate a portfolio.</p>
                <div
                  onClick={() => setGenerated(true)}
                  className="border-2 border-dashed border-border-subtle rounded-xl p-6 text-center cursor-pointer hover:border-brand-orange/30 transition-colors group mb-4"
                >
                  <Upload className="w-8 h-8 text-text-muted mx-auto mb-2 group-hover:text-brand-orange transition-colors" />
                  <p className="text-xs text-text-muted">Upload Resume</p>
                </div>
                <Button className="w-full" onClick={() => setGenerated(true)}>
                  <Sparkles className="w-4 h-4" /> Use Profile Data
                </Button>
              </Card>
            ) : (
              <>
                <Card>
                  <h3 className="text-sm font-medium text-text-primary mb-3">Theme</h3>
                  <div className="space-y-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => setSelectedTheme(theme.name)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all text-left",
                          selectedTheme === theme.name ? "bg-brand-orange/10 border border-brand-orange/20" : "glass-card hover:bg-glass-strong"
                        )}
                      >
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${theme.color}`} />
                        <div>
                          <p className="text-xs font-medium text-text-primary">{theme.name}</p>
                          <p className="text-[10px] text-text-muted">{theme.desc}</p>
                        </div>
                        {selectedTheme === theme.name && <CheckCircle2 className="w-4 h-4 text-brand-orange ml-auto" />}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm font-medium text-text-primary mb-3">Sections</h3>
                  <div className="space-y-1.5">
                    {previewSections.map((section, i) => (
                      <div key={i} className="flex items-center justify-between glass-card rounded-lg px-3 py-2">
                        <span className="text-xs text-text-muted">{section}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm font-medium text-text-primary mb-3">SEO Score</h3>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-emerald-400 mb-1">92</p>
                    <p className="text-xs text-text-muted">Excellent SEO optimization</p>
                  </div>
                </Card>
              </>
            )}
          </motion.div>

          {/* Preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-3">
            <Card className="!p-0 overflow-hidden">
              {/* Preview Controls */}
              <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex gap-1 glass-card rounded-lg p-0.5">
                  {[
                    { mode: "desktop" as const, icon: Monitor },
                    { mode: "tablet" as const, icon: Tablet },
                    { mode: "mobile" as const, icon: Smartphone },
                  ].map((item) => (
                    <button
                      key={item.mode}
                      onClick={() => setPreviewMode(item.mode)}
                      className={cn(
                        "p-1.5 rounded-md transition-all",
                        previewMode === item.mode ? "bg-brand-orange/10 text-brand-orange" : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
                <div className="glass-card rounded-lg px-3 py-1 text-xs text-text-muted">arjun-mehta.aroma.dev</div>
              </div>

              {/* Preview Content */}
              <div className={cn(
                "mx-auto transition-all duration-300 bg-bg-primary min-h-[500px]",
                previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "max-w-[768px]" : "max-w-[375px]"
              )}>
                {!generated ? (
                  <div className="flex items-center justify-center h-[500px] text-center">
                    <div>
                      <Palette className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                      <p className="text-text-muted">Upload a resume or use your profile to generate a portfolio</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8">
                    {/* Mock Portfolio Preview */}
                    <div className="text-center mb-12">
                      <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">AM</div>
                      <h2 className="text-2xl font-bold text-text-primary mb-1">Arjun Mehta</h2>
                      <p className="text-text-muted">Full Stack Developer</p>
                      <div className="flex justify-center gap-2 mt-3">
                        {["React", "TypeScript", "Node.js"].map((s) => (
                          <Badge key={s}>{s}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {["E-Commerce Platform", "Real-time Chat App", "ML Image Classifier", "Task Management CLI"].map((project, i) => (
                        <div key={i} className="glass-card rounded-xl p-4">
                          <div className="h-24 rounded-lg bg-gradient-to-br from-brand-orange/10 to-brand-pink/10 mb-3 flex items-center justify-center">
                            <Code2 className="w-8 h-8 text-brand-orange/40" />
                          </div>
                          <h4 className="text-sm font-medium text-text-primary">{project}</h4>
                          <p className="text-xs text-text-muted mt-1">Full-stack project with modern technologies</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
