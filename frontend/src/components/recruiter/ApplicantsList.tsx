'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Star,
  X,
} from 'lucide-react';
import { API_URL } from '@/lib/api/client';

interface ApplicantsListProps {
  applications: any[];
  jobs: any[];
  selectedJob: any;
  onRefresh: () => void;
}

export default function ApplicantsList({ applications, jobs, selectedJob, onRefresh }: ApplicantsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSkills, setFilterSkills] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Filter by skills
    if (filterSkills) {
      const skillArray = filterSkills.split(',').map(s => s.trim().toLowerCase());
      filtered = filtered.filter(app =>
        app.skills?.some((s: string) =>
          skillArray.some(searchSkill => s.toLowerCase().includes(searchSkill))
        )
      );
    }

    // Filter by minimum score
    if (minScore > 0) {
      filtered = filtered.filter(app =>
        (app.passport_score || 0) >= minScore
      );
    }

    return filtered;
  }, [applications, filterSkills, filterStatus, minScore, searchTerm]);

  const updateApplicationStatus = async (studentId: string, status: string) => {
    try {
      await fetch(`${API_URL}/career/recruiter/candidates/${studentId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-blue-500 to-blue-600';
    if (score >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Interview':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Hired':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Applicants</h2>
          <p className="text-purple-200 text-sm mt-1">
            {filteredApplications.length} {filteredApplications.length === 1 ? 'applicant' : 'applicants'} found
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="New">New</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Interview">Interview</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>

              {/* Min Score */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Min Match Score: {minScore}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  value={filterSkills}
                  onChange={(e) => setFilterSkills(e.target.value)}
                  placeholder="e.g., React, TypeScript"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Applicants List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white/40">No applicants found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app, index) => (
            <motion.div
              key={app.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {app.name?.charAt(0) || 'U'}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{app.name || 'Unknown'}</h3>
                        <p className="text-sm text-purple-200">{app.email || 'No email'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                        {app.status || 'New'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {app.skills?.slice(0, 4).map((skill: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-white/10 text-purple-200 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4">
                      {app.passport_score !== null && app.passport_score !== undefined && (
                        <div className={`px-3 py-1 bg-gradient-to-r ${getScoreColor(app.passport_score)} rounded-lg`}>
                          <span className="text-xs font-bold text-white">
                            {app.passport_score}% Match
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  {app.status === 'New' && (
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Shortlist</span>
                    </button>
                  )}

                  {app.status !== 'Rejected' && (
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  )}

                  {app.status === 'Shortlisted' && (
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'Interview')}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg text-sm transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      <span>Interview</span>
                    </button>
                  )}

                  {app.status === 'Interview' && (
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'Hired')}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-sm transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Hire</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
