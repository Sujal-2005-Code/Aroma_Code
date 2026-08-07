'use client';

import { motion } from 'framer-motion';
import { Briefcase, Users, CheckCircle, Clock, TrendingUp, Award } from 'lucide-react';

interface DashboardStatsProps {
  jobs: any[];
  applications: any[];
}

export default function DashboardStats({ jobs, applications }: DashboardStatsProps) {
  const activeJobs = jobs.filter(j => j.status === 'active' || j.is_active === true).length;
  const totalApplications = applications.length;
  const shortlisted = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewScheduled = applications.filter(a => a.status === 'Interview').length;

  const stats = [
    {
      label: 'Active Jobs',
      value: activeJobs,
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-300',
    },
    {
      label: 'Total Applications',
      value: totalApplications,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-300',
    },
    {
      label: 'Shortlisted',
      value: shortlisted,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-300',
    },
    {
      label: 'Interviews Scheduled',
      value: interviewScheduled,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-300',
    },
  ];

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-2xl"
              style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
            />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`px-3 py-1 bg-gradient-to-r ${stat.color} rounded-full`}>
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-purple-200">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Award className="w-6 h-6 mr-2 text-purple-400" />
            Recent Applications
          </h3>
        </div>

        {recentApplications.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-white/20 mb-4" />
            <p className="text-white/40">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentApplications.map((app, index) => (
              <motion.div
                key={app.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {app.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{app.name || 'Unknown'}</p>
                    <p className="text-sm text-purple-200">{app.title || 'Unknown Position'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {app.passport_score !== null && app.passport_score !== undefined && (
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <span className="text-xs font-bold text-white">
                          {app.passport_score}% Match
                        </span>
                      </div>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'Shortlisted' ? 'bg-green-500/20 text-green-300' :
                      app.status === 'Rejected' ? 'bg-red-500/20 text-red-300' :
                      app.status === 'Interview' ? 'bg-orange-500/20 text-orange-300' :
                      app.status === 'Hired' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {app.status || 'New'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
