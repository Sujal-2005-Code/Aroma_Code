"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import { Progress } from "@/components/ui/progress";
import {
  Video, Play, Clock, Eye, MessageSquare, Mic,
  Brain, Timer, CheckCircle2, BarChart3, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import CountUp from "react-countup";

const rounds = [
  { type: "HR", icon: MessageSquare, description: "Behavioral and cultural fit questions", duration: "20 min", questions: 10 },
  { type: "Technical", icon: Brain, description: "DSA, system design, and coding", duration: "45 min", questions: 5 },
  { type: "Behavioral", icon: Eye, description: "STAR method and situational questions", duration: "25 min", questions: 8 },
  { type: "Communication", icon: Mic, description: "Presentation and articulation skills", duration: "15 min", questions: 6 },
  { type: "System Design", icon: BarChart3, description: "Design scalable systems and architecture", duration: "45 min", questions: 3 },
];

const performanceData = [
  { metric: "Confidence", value: 82 },
  { metric: "Clarity", value: 88 },
  { metric: "Technical", value: 91 },
  { metric: "Grammar", value: 85 },
  { metric: "Eye Contact", value: 75 },
  { metric: "Body Language", value: 78 },
];

const sampleQuestions = [
  { q: "Tell me about yourself and your experience.", category: "HR", difficulty: "Easy" },
  { q: "Design a URL shortener like bit.ly. Walk me through the architecture.", category: "System Design", difficulty: "Hard" },
  { q: "What is your biggest professional achievement?", category: "Behavioral", difficulty: "Medium" },
  { q: "Explain the difference between REST and GraphQL.", category: "Technical", difficulty: "Medium" },
];

export default function InterviewPage() {
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Mock Interview</h1>
          <p className="text-text-muted">Practice with AI-powered mock interviews and get detailed feedback.</p>
        </motion.div>

        {!showResults ? (
          <>
            {/* Round Selection */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {rounds.map((round, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card
                    hover
                    className={cn("cursor-pointer text-center", selectedRound === round.type && "ring-1 ring-brand-orange/30 bg-brand-orange/5")}
                    onClick={() => setSelectedRound(round.type)}
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-3">
                      <round.icon className="w-6 h-6 text-brand-orange" />
                    </div>
                    <h3 className="text-sm font-medium text-text-primary mb-1">{round.type}</h3>
                    <p className="text-xs text-text-muted mb-2">{round.description}</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
                      <Clock className="w-3 h-3" /> {round.duration}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Question Preview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <h3 className="text-sm font-medium text-text-primary mb-4">Sample Questions</h3>
                <div className="space-y-3">
                  {sampleQuestions.map((q, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 flex items-start gap-3">
                      <span className="text-xs text-text-muted w-6">{i + 1}.</span>
                      <div className="flex-1">
                        <p className="text-sm text-text-primary mb-2">{q.q}</p>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{q.category}</Badge>
                          <Badge variant={q.difficulty === "Easy" ? "success" : q.difficulty === "Hard" ? "danger" : "warning"}>
                            {q.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <Button className="flex-1" onClick={() => setShowResults(true)}>
                    <Play className="w-4 h-4" /> Start Interview
                  </Button>
                  <Button variant="outline"><Timer className="w-4 h-4" /> Set Timer</Button>
                </div>
              </Card>
            </motion.div>
          </>
        ) : (
          <>
            {/* Results */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {performanceData.map((item, i) => (
                <Card key={i} className="text-center">
                  <ScoreRing score={item.value} label={item.metric} size={64} />
                </Card>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
                <Card>
                  <h3 className="text-sm font-medium text-text-primary mb-4">Performance Radar</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={performanceData}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar dataKey="value" stroke="#FC8F0F" fill="#FC8F0F" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
                <Card>
                  <h3 className="text-sm font-medium text-text-primary mb-3">Feedback</h3>
                  <div className="space-y-3">
                    {[
                      { type: "success", text: "Strong technical knowledge demonstrated" },
                      { type: "success", text: "Clear and structured communication" },
                      { type: "warning", text: "Could improve eye contact during answers" },
                      { type: "warning", text: "Consider using more specific examples" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className={cn("w-3.5 h-3.5 flex-shrink-0 mt-0.5", item.type === "success" ? "text-emerald-400" : "text-amber-400")} />
                        <span className="text-text-muted">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Button className="w-full" onClick={() => setShowResults(false)}>
                  <Play className="w-4 h-4" /> Try Again
                </Button>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
