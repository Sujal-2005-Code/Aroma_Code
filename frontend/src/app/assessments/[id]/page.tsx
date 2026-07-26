"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock, FileQuestion, Code2, CheckCircle2, AlertTriangle,
  Play, Building2, Calendar, ChevronRight, Shield, Eye, Laptop
} from "lucide-react";
import { getAssessmentById } from "@/lib/api";
import { use } from "react";

export default function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [assessment, setAssessment] = useState<any>({
    id,
    title: "Loading assessment...",
    description: "",
    duration: 0,
    totalQuestions: 0,
    codingCount: 0,
    cutoff: 0,
    tags: [],
    company: null,
    startDate: "TBD",
    endDate: "TBD",
    mcqCount: 0,
    msqCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    let active = true;

    getAssessmentById(id)
      .then((data) => {
        if (active) {
          setAssessment({
            id: data._id || data.id || id,
            title: data.title || "Untitled assessment",
            description: data.description || "No description available.",
            duration: data.duration || 60,
            totalQuestions: data.question_ids?.length || 30,
            codingCount: 2,
            cutoff: data.passing_marks || 70,
            tags: [data.topic || "General"].filter(Boolean),
            company: data.company || "TechCorp",
            startDate: "TBD",
            endDate: "TBD",
            mcqCount: 20,
            msqCount: 10,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          // Mock data fallback if assessment not found (e.g., from mock list)
          const mockAssessments: Record<string, any> = {
            "a1": { id: "a1", title: "Frontend Web Development (React)", description: "Test your React fundamentals including hooks, state management, and component lifecycle.", duration: 60, totalQuestions: 30, codingCount: 2, cutoff: 70, topic: "React", company: "TechCorp", mcqCount: 20, msqCount: 8 },
            "a2": { id: "a2", title: "Backend API Design (Node.js)", description: "Assess your ability to build robust RESTful APIs using Node.js and Express.", duration: 90, totalQuestions: 40, codingCount: 3, cutoff: 80, topic: "Node.js", company: "Innovate Inc", mcqCount: 25, msqCount: 12 },
            "a3": { id: "a3", title: "Data Structures & Algorithms", description: "Standard computer science DS & Algo assessment used for screening.", duration: 120, totalQuestions: 20, codingCount: 5, cutoff: 60, topic: "Algorithms", company: "GlobalTech", mcqCount: 10, msqCount: 5 },
            "a4": { id: "a4", title: "System Architecture", description: "Design a scalable system architecture for a high-traffic e-commerce platform.", duration: 180, totalQuestions: 15, codingCount: 1, cutoff: 120, topic: "System Design", company: "ScaleFast", mcqCount: 5, msqCount: 9 },
          };
          
          if (mockAssessments[id]) {
            const m = mockAssessments[id];
            setAssessment({ ...m, startDate: "TBD", endDate: "TBD", tags: [m.topic] });
            setLoading(false);
          } else {
            console.error(err);
            setError("Could not load assessment details.");
            setLoading(false);
          }
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const guidelines = [
    "Ensure you have a stable internet connection before starting.",
    "The timer starts immediately when you begin the assessment.",
    "You can navigate between questions using the question palette.",
    "Mark questions for review and come back to them later.",
    "Auto-submit will occur when the timer reaches zero.",
    "Do not switch tabs or go fullscreen will be detected.",
    "MCQ questions have one correct answer. MSQ may have multiple.",
    "Coding questions are evaluated against hidden test cases.",
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-10 text-center text-text-muted">Loading assessment details...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-10 text-center text-red-400">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/assessments" className="hover:text-text-primary transition-colors">Assessments</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text-primary">{assessment.title}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                  <FileQuestion className="w-7 h-7 text-brand-orange" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-text-primary mb-1">{assessment.title}</h1>
                  {assessment.company && (
                    <div className="flex items-center gap-1.5 text-sm text-text-muted">
                      <Building2 className="w-4 h-4" />
                      <span>Conducted by <span className="text-text-primary font-medium">{assessment.company}</span></span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-text-muted mb-4 leading-relaxed">{assessment.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Duration", value: `${assessment.duration} min`, icon: Clock },
                  { label: "Total Questions", value: assessment.totalQuestions, icon: FileQuestion },
                  { label: "Coding Problems", value: assessment.codingCount, icon: Code2 },
                  { label: "Pass Cutoff", value: `${assessment.cutoff}%`, icon: CheckCircle2 },
                ].map((item, i) => (
                  <div key={i} className="glass-card rounded-xl p-3 text-center">
                    <item.icon className="w-4 h-4 text-brand-orange mx-auto mb-1.5" />
                    <p className="text-sm font-bold text-text-primary">{item.value}</p>
                    <p className="text-[10px] text-text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Question Breakdown */}
            <Card>
              <h3 className="text-sm font-medium text-text-primary mb-4">Question Breakdown</h3>
              <div className="space-y-3">
                {[
                  { type: "MCQ (Single Correct)", count: assessment.mcqCount, marks: `${assessment.mcqCount * 2} marks`, color: "bg-blue-500/20", textColor: "text-blue-400" },
                  { type: "MSQ (Multiple Correct)", count: assessment.msqCount, marks: `${assessment.msqCount * 4} marks`, color: "bg-purple-500/20", textColor: "text-purple-400" },
                  { type: "Coding Problems", count: assessment.codingCount, marks: `${assessment.codingCount * 10} marks`, color: "bg-brand-orange/20", textColor: "text-brand-orange" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between glass-card rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                        <span className={`text-xs font-bold ${item.textColor}`}>{item.count}</span>
                      </div>
                      <span className="text-sm text-text-primary">{item.type}</span>
                    </div>
                    <Badge variant="secondary">{item.marks}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Guidelines */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-brand-orange" />
                <h3 className="text-sm font-medium text-text-primary">Important Guidelines</h3>
              </div>
              <div className="space-y-2.5">
                {guidelines.map((g, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>{g}</span>
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-3 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 accent-brand-orange"
                />
                <span className="text-sm text-text-primary">I have read and agree to all the guidelines</span>
              </label>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            <Card className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-text-primary mb-1">{assessment.duration}</p>
              <p className="text-sm text-text-muted mb-6">minutes to complete</p>
              <Link href={agreed ? `/assessments/${assessment.id}/session` : "#"}>
                <Button className="w-full" size="lg" disabled={!agreed}>
                  <Play className="w-5 h-5" /> Start Now
                </Button>
              </Link>
              {!agreed && <p className="text-xs text-text-muted mt-3">Please agree to guidelines first</p>}
            </Card>

            <Card>
              <h3 className="text-sm font-medium text-text-primary mb-3">Topics Covered</h3>
              <div className="flex flex-wrap gap-1.5">
                {assessment.tags.map((tag: string) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-medium text-text-primary mb-3">Schedule</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1"><Calendar className="w-3 h-3" /> Starts</span>
                  <span className="text-text-primary">{assessment.startDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1"><Calendar className="w-3 h-3" /> Ends</span>
                  <span className="text-text-primary">{assessment.endDate}</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-2">
                <Laptop className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-medium text-text-primary">System Requirements</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-text-muted">
                <li>• Stable internet connection</li>
                <li>• Latest Chrome or Firefox browser</li>
                <li>• Camera access (for proctoring)</li>
                <li>• No VPN or proxy</li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
