"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock, Trophy, CheckCircle2, XCircle, TrendingUp,
  Calendar, Users, ChevronRight, BarChart3, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api/client";
import CountUp from "react-countup";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    api<any[]>("/student/demo-student/history")
      .then((data) => {
        if (active) {
          setHistory(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          console.error(err);
          setError("Could not load student history.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const progressData = history.slice().reverse().map((item: any) => ({
    name: item.assessment_id || "Assessment",
    score: item.percentage || 0,
    cutoff: 70,
  }));

  const passed = history.filter((item) => item.result === "PASS").length;
  const avgScore = history.length > 0 ? Math.round(history.reduce((a, item) => a + (item.percentage || 0), 0) / history.length) : 0;
  const bestRank = history.length > 0 ? Math.min(...history.map((item) => item.rank || 999)) : 0;

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Assessment History</h1>
          <p className="text-text-muted">Track your performance across all assessments.</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Taken", value: history.length, icon: BarChart3, color: "text-blue-400" },
            { label: "Passed", value: passed, icon: CheckCircle2, color: "text-emerald-400" },
            { label: "Avg Score", value: avgScore, icon: TrendingUp, color: "text-brand-orange", suffix: "%" },
            { label: "Best Rank", value: bestRank, icon: Trophy, color: "text-amber-400", prefix: "#" },
          ].map((stat, i) => (
            <Card key={i} className="flex items-center gap-3 !p-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary">
                  {stat.prefix || ""}<CountUp end={stat.value} duration={1.5} />{stat.suffix || ""}
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {loading && <Card className="text-center py-8 text-text-muted">Loading history...</Card>}
        {error && <Card className="text-center py-8 text-red-400">{error}</Card>}

        {/* Score Trend Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <h3 className="text-sm font-medium text-text-primary mb-4">Score Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="scoreGradH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FC8F0F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FC8F0F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "12px", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="score" stroke="#FC8F0F" fill="url(#scoreGradH)" strokeWidth={2} name="Score" />
                <Area type="monotone" dataKey="cutoff" stroke="rgba(239,68,68,0.5)" fill="none" strokeWidth={1} strokeDasharray="4 4" name="Cutoff" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* History List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <h3 className="text-sm font-medium text-text-primary mb-4">All Attempts</h3>
            <div className="space-y-3">
              {history.map((item: any, i: number) => (
                <motion.div
                  key={item._id || item.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-0.5">{item.assessment_id || "Assessment"}</h4>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.created_at || "Unknown date"}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration || 0} min</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />Rank {item.rank || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xl font-bold text-text-primary">{item.percentage || 0}<span className="text-xs text-text-muted">%</span></p>
                        <p className="text-xs text-text-muted">{item.result || "UNKNOWN"}</p>
                      </div>
                      <Badge className={item.result === "PASS" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                        {item.result === "PASS" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {item.result}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage || 0}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                      className={cn(
                        "h-full rounded-full",
                        item.result === "PASS" ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-red-500 to-red-400"
                      )}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
