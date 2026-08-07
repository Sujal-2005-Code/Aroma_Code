'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { API_URL } from '@/lib/api/client';

interface JobsListProps {
  jobs: any[];
  onViewApplicants: (job: any) => void;
  onRefresh: () => void;
}

export default function JobsList({ jobs, onViewApplicants, onRefresh }: JobsListProps) {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const handleCloseJob = async (jobId: number) => {
    try {
      await fetch(`${API_URL}/career/jobs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId, status: 'closed' }),
      });
      onRefresh();
    } catch (error) {
      console.error('Error closing job:', error);
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-blue-500/20 text-blue-300';
      case 'Internship':
        return 'bg-purple-500/20 text-purple-300';
      case 'Campus Hiring':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Posted Jobs</h2>
        <div className="text-sm text-purple-200">
          {jobs.filter(j => j.status === 'active').length} Active Jobs
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
          <Briefcase className="w-16 h-16 mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No jobs posted yet</h3>
          <p className="text-purple-200">Click &quot;Post New Job&quot; to create your first job posting</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Company Logo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      {job.companyLogo ? (
                        // Company logos are supplied by the recruitment API and may use any host.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <Briefcase className="w-8 h-8 text-white" />
                    )}
                  </div>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                        <p className="text-purple-200">{job.companyName}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-sm text-purple-200">
                        <MapPin className="w-4 h-4 mr-1.5 text-purple-400" />
                        {job.location}
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-sm text-purple-200">
                          <DollarSign className="w-4 h-4 mr-1.5 text-purple-400" />
                          {job.salary}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-purple-200">
                        <Clock className="w-4 h-4 mr-1.5 text-purple-400" />
                        {job.experience}
                      </div>
                      <div className="flex items-center text-sm text-purple-200">
                        <Calendar className="w-4 h-4 mr-1.5 text-purple-400" />
                        Deadline: {format(new Date(job.applicationDeadline), 'MMM dd, yyyy')}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getJobTypeColor(job.jobType)}`}>
                        {job.jobType}
                      </span>
                      {job.skills.slice(0, 4).map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-white/10 text-purple-200 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="px-3 py-1 bg-white/10 text-purple-200 rounded-full text-xs font-medium">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onViewApplicants(job)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
                      >
                        <Users className="w-4 h-4" />
                        <span>View Applicants</span>
                      </motion.button>

                      {job.status === 'active' && (
                        <button
                          onClick={() => handleCloseJob(job.id)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold text-sm transition-colors"
                        >
                          Close Job
                        </button>
                      )}

                      {job.status === 'closed' && (
                        <span className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg font-semibold text-sm">
                          Closed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
