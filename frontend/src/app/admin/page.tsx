"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, Building2, Briefcase, Code2, Award, BarChart3,
  TrendingUp, DollarSign, Activity, FileText, Shield, Eye
} from "lucide-react";
import { getAdminDashboard } from "@/lib/api";
import CountUp from "react-countup";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { currentUser } from "@/lib/auth";

const monthlyUsers = [
  { month: "Jan", students: 800, recruiters: 20 }, { month: "Feb", students: 1200, recruiters: 28 },
  { month: "Mar", students: 1800, recruiters: 35 }, { month: "Apr", students: 2400, recruiters: 42 },
  { month: "May", students: 3200, recruiters: 55 }, { month: "Jun", students: 4100, recruiters: 68 },
  { month: "Jul", students: 5200, recruiters: 82 }, { month: "Aug", students: 6800, recruiters: 95 },
];

const placementData = [
  { company: "Google", placements: 18, color: "#4285F4" },
  { company: "Microsoft", placements: 15, color: "#00A4EF" },
  { company: "Amazon", placements: 12, color: "#FF9900" },
  { company: "Meta", placements: 8, color: "#1877F2" },
  { company: "Others", placements: 14, color: "#94A3B8" },
];

const recentActivities = [
  { user: "Priya S.", action: "completed React certification", time: "2 min ago", type: "certificate" },
  { user: "Rahul K.", action: "submitted resume for analysis", time: "5 min ago", type: "resume" },
  { user: "Sara P.", action: "placed at Google", time: "15 min ago", type: "placement" },
  { user: "Dev J.", action: "solved 10 problems", time: "30 min ago", type: "coding" },
  { user: "Ananya D.", action: "registered as recruiter", time: "1 hour ago", type: "registration" },
];

export default function AdminPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    const user = currentUser();
    if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    let active = true;

    getAdminDashboard()
      .then((data) => {
        if (active) {
          setDashboard(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const adminStats = {
    totalStudents: dashboard?.total_students ?? 0,
    totalRecruiters: 0,
    totalJobs: dashboard?.total_assessments ?? 0,
    revenue: 0,
    growthRate: dashboard?.pass_rate ?? 0,
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Admin Dashboard</h1>
          <p className="text-text-muted">Platform analytics, user management, and system overview.</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: adminStats.totalStudents, icon: Users, color: "text-blue-400", prefix: "" },
            { label: "Recruiters", value: adminStats.totalRecruiters, icon: Building2, color: "text-purple-400", prefix: "" },
            { label: "Active Jobs", value: adminStats.totalJobs, icon: Briefcase, color: "text-emerald-400", prefix: "" },
            { label: "Revenue", value: adminStats.revenue, icon: DollarSign, color: "text-brand-orange", prefix: "$" },
          ].map((stat, i) => (
            <Card key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary">
                  {stat.prefix}<CountUp end={stat.value} duration={2} separator="," />
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-primary">User Growth</h3>
                <Badge variant="success"><TrendingUp className="w-3 h-3 mr-1" />{adminStats.growthRate}%</Badge>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyUsers}>
                  <defs>
                    <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FC8F0F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FC8F0F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="recruiterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F61E66" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F61E66" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "12px", color: "#F8FAFC" }} />
                  <Area type="monotone" dataKey="students" stroke="#FC8F0F" fill="url(#studentGrad)" strokeWidth={2} name="Students" />
                  <Area type="monotone" dataKey="recruiters" stroke="#F61E66" fill="url(#recruiterGrad)" strokeWidth={2} name="Recruiters" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Placements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <h3 className="text-sm font-medium text-text-primary mb-4">Placement Distribution</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={placementData} dataKey="placements" nameKey="company" cx="50%" cy="50%" innerRadius={50} outerRadius={75} strokeWidth={0}>
                    {placementData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", fontSize: "12px", color: "#F8FAFC" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {placementData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                    <span className="text-text-muted flex-1">{item.company}</span>
                    <span className="text-text-primary font-medium">{item.placements}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Activity Log */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-text-primary">Recent Activity</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-3 glass-card rounded-xl p-3"
                >
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-white">
                    {activity.user.split(" ")[0][0]}{activity.user.split(" ")[1]?.[0] || ""}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary"><span className="font-medium">{activity.user}</span> {activity.action}</p>
                    <p className="text-xs text-text-muted">{activity.time}</p>
                  </div>
                  <Activity className="w-4 h-4 text-text-muted" />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
