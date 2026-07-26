"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, Search, Eye, Trash2, Mail, MapPin,
  CheckCircle2, Clock, Trophy, TrendingUp, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { deactivateStudent, getAdminStudents } from "@/lib/api/resources";
import type { AdminStudent } from "@/lib/api/types";
import { currentUser } from "@/lib/auth";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  Placed: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
};

export default function StudentManagementPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = currentUser();
    if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    getAdminStudents().then(setStudents).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load students."));
  }, [router]);

  const studentData = students.map((student) => ({
    id: student.id, name: student.full_name, email: student.email, college: "Not provided", passportScore: Math.round(student.average_score), assessmentsTaken: student.assessments_taken, avgScore: student.average_score, status: student.is_active ? "Active" : "Inactive",
  }));

  const filtered = studentData.filter((s) => {
    if (statusFilter !== "All" && s.status !== statusFilter) return false;
    return s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || s.college.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Student Management</h1>
          <p className="text-text-muted">Monitor, manage, and track all registered students.</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: studentData.length, icon: Users, color: "text-blue-400" },
            { label: "Active", value: studentData.filter((student) => student.status === "Active").length, icon: CheckCircle2, color: "text-emerald-400" },
            { label: "Inactive", value: studentData.filter((student) => student.status === "Inactive").length, icon: Trophy, color: "text-brand-orange" },
            { label: "Avg Score", value: studentData.length ? Math.round(studentData.reduce((sum, student) => sum + student.avgScore, 0) / studentData.length) : 0, icon: TrendingUp, color: "text-purple-400", suffix: "%" },
          ].map((stat, i) => (
            <Card key={i} className="flex items-center gap-3 !p-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary">
                  <CountUp end={stat.value} duration={1.5} separator="," />{stat.suffix || ""}
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>
        {error && <Card className="text-red-400">{error}</Card>}

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name, email, or college..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30"
              />
            </div>
            <div className="flex gap-1 glass-card rounded-xl p-1">
              {["All", "Active", "Inactive", "Placed"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  statusFilter === s ? "bg-brand-orange/10 text-brand-orange" : "text-text-muted hover:text-text-primary"
                )}>{s}</button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Student Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left py-3 px-5 text-xs font-medium text-text-muted">Student</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-text-muted hidden md:table-cell">College</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-text-muted">Passport Score</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-text-muted hidden lg:table-cell">Assessments</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-text-muted hidden lg:table-cell">Avg Score</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-text-muted">Status</th>
                    <th className="text-right py-3 px-5 text-xs font-medium text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student, i) => (
                    <motion.tr key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-border-subtle hover:bg-glass transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{student.name}</p>
                            <p className="text-xs text-text-muted flex items-center gap-1"><Mail className="w-3 h-3" />{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell text-text-muted text-xs">{student.college}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={cn(
                          "text-sm font-bold",
                          student.passportScore >= 85 ? "text-emerald-400" : student.passportScore >= 70 ? "text-amber-400" : "text-red-400"
                        )}>{student.passportScore}</span>
                      </td>
                      <td className="py-4 px-4 text-center hidden lg:table-cell text-text-muted">{student.assessmentsTaken}</td>
                      <td className="py-4 px-4 text-center hidden lg:table-cell text-text-muted">{student.avgScore}%</td>
                      <td className="py-4 px-4 text-center">
                        <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full border", statusColors[student.status])}>{student.status}</span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm" aria-label="View profile"><Eye className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" aria-label="Deactivate" onClick={() => deactivateStudent(student.id).then(() => setStudents((items) => items.map((item) => item.id === student.id ? { ...item, is_active: false } : item))).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not deactivate student."))}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
