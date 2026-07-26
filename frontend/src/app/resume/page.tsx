"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import {
  Upload, FileText, CheckCircle2, AlertTriangle, XCircle, Sparkles,
  Download, RefreshCw, ArrowRight, Eye, Zap, Search
} from "lucide-react";

const resumeAnalysis = {
  atsScore: 82,
  resumeScore: 78,
  grammarScore: 91,
  formattingScore: 85,
  keywords: { found: 18, missing: 7, total: 25 },
  missingKeywords: ["Docker", "Kubernetes", "CI/CD", "Agile", "Microservices", "REST APIs", "GraphQL"],
  suggestions: [
    { type: "critical", text: "Add quantifiable achievements (numbers, percentages) to your experience section" },
    { type: "critical", text: "Include 'Docker' and 'Kubernetes' keywords — 89% of target jobs require them" },
    { type: "warning", text: "Your summary is too long. Keep it under 3 lines for better ATS parsing" },
    { type: "warning", text: "Add a 'Projects' section — it increases callback rate by 34%" },
    { type: "info", text: "Consider reordering skills: list most relevant skills first" },
    { type: "info", text: "Your education section formatting could be improved" },
  ],
  sections: [
    { name: "Contact Info", score: 95, status: "pass" },
    { name: "Summary", score: 72, status: "warn" },
    { name: "Experience", score: 80, status: "pass" },
    { name: "Education", score: 88, status: "pass" },
    { name: "Skills", score: 75, status: "warn" },
    { name: "Projects", score: 60, status: "fail" },
  ],
};

export default function ResumePage() {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">AI Resume Analyzer</h1>
          <p className="text-text-muted">Upload your resume and get instant AI-powered feedback to boost your ATS score.</p>
        </motion.div>

        {!analyzed ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="max-w-2xl mx-auto">
              {analyzing ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Analyzing your resume...</h3>
                  <p className="text-sm text-text-muted mb-6">Our AI is checking ATS compatibility, keywords, and formatting</p>
                  <Progress value={65} className="max-w-xs mx-auto" size="md" />
                </div>
              ) : (
                <div
                  onClick={handleUpload}
                  className="border-2 border-dashed border-border-subtle rounded-xl p-12 text-center cursor-pointer hover:border-brand-orange/30 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-brand-orange" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Drop your resume here</h3>
                  <p className="text-sm text-text-muted mb-4">or click to browse. Supports PDF, DOCX, TXT</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4" /> Choose File
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Score Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "ATS Score", value: resumeAnalysis.atsScore },
                { label: "Resume Score", value: resumeAnalysis.resumeScore },
                { label: "Grammar", value: resumeAnalysis.grammarScore },
                { label: "Formatting", value: resumeAnalysis.formattingScore },
              ].map((item, i) => (
                <Card key={i} className="text-center">
                  <ScoreRing score={item.value} label={item.label} size={80} />
                </Card>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Suggestions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-text-primary">AI Suggestions</h3>
                    <Badge>{resumeAnalysis.suggestions.length} items</Badge>
                  </div>
                  <div className="space-y-3">
                    {resumeAnalysis.suggestions.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="flex items-start gap-3 glass-card rounded-xl p-3"
                      >
                        {s.type === "critical" ? (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        ) : s.type === "warning" ? (
                          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm text-text-muted">{s.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Sections & Keywords */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
                <Card>
                  <h3 className="text-sm font-medium text-text-primary mb-4">Section Scores</h3>
                  <div className="space-y-3">
                    {resumeAnalysis.sections.map((s, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-text-muted">{s.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-text-primary">{s.score}%</span>
                            {s.status === "pass" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : s.status === "warn" ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-400" />
                            )}
                          </div>
                        </div>
                        <Progress value={s.score} size="sm" />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm font-medium text-text-primary mb-3">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeAnalysis.missingKeywords.map((kw, i) => (
                      <Badge key={i} variant="danger">{kw}</Badge>
                    ))}
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Download className="w-4 h-4" /> Export
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => { setAnalyzed(false); setUploaded(false); }}>
                    <RefreshCw className="w-4 h-4" /> Re-analyze
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
