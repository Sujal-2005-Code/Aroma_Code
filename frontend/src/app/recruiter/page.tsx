'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Plus,
  Users,
  TrendingUp,
  Calendar,
  Building2,
  Search,
  Filter,
  X
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import JobPostForm from '@/components/recruiter/JobPostForm';
import JobsList from '@/components/recruiter/JobsList';
import ApplicantsList from '@/components/recruiter/ApplicantsList';
import DashboardStats from '@/components/recruiter/DashboardStats';

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applicants'>('overview');
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/career/jobs`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/career/recruiter/candidates`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]); // Set empty array on error
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => Promise.all([fetchJobs(), fetchApplications()]));
  }, []);

  const handleJobCreated = () => {
    setShowJobForm(false);
    fetchJobs();
  };

  const handleViewApplicants = (job: any) => {
    setSelectedJob(job);
    setActiveTab('applicants');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">AROMA Recruiter</h1>
                    <p className="text-sm text-purple-200">Talent Management Dashboard</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowJobForm(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Post New Job</span>
                </motion.button>
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="flex space-x-4 border-b border-white/10">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'jobs', label: 'Posted Jobs', icon: Briefcase },
                { id: 'applicants', label: 'Applicants', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-all relative ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <DashboardStats jobs={jobs} applications={applications} />
                </motion.div>
              )}

              {activeTab === 'jobs' && (
                <motion.div
                  key="jobs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <JobsList
                    jobs={jobs}
                    onViewApplicants={handleViewApplicants}
                    onRefresh={fetchJobs}
                  />
                </motion.div>
              )}

              {activeTab === 'applicants' && (
                <motion.div
                  key="applicants"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ApplicantsList
                    applications={applications}
                    jobs={jobs}
                    selectedJob={selectedJob}
                    onRefresh={fetchApplications}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Job Post Form Modal */}
        <AnimatePresence>
          {showJobForm && (
            <JobPostForm
              onClose={() => setShowJobForm(false)}
              onSuccess={handleJobCreated}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
