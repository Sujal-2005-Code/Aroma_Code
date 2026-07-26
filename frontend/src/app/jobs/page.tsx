"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, MapPin, Clock, Users, Bookmark, ExternalLink,
  Building2, Filter, ChevronRight, Heart, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { applyToJob, getJobs, saveJob } from "@/lib/api/resources";
import type { Job } from "@/lib/api/types";

const jobTypes = ["All", "Full-time", "Part-time", "Internship", "Remote", "Contract"];

export default function JobsPage() {
  const [activeType, setActiveType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getJobs().then((data) => { 
      const mockData = data && data.length > 0 ? data : [
        { id: "j1", title: "Frontend React Engineer", company: "TechCorp", location: "Remote", job_type: "Full-time", salary: "$90k - $120k", description: "Looking for an experienced React developer to build modern web interfaces.", requirements: ["3+ years React", "TypeScript", "Tailwind CSS"], skills: ["React", "TypeScript", "Tailwind"], applicants: 24, status: "active" },
        { id: "j2", title: "Backend Node.js Developer", company: "Innovate Inc", location: "New York, NY", job_type: "Full-time", salary: "$100k - $130k", description: "Design and implement scalable APIs using Node.js and Express.", requirements: ["Node.js", "MongoDB", "REST APIs"], skills: ["Node.js", "Express", "MongoDB"], applicants: 15, status: "active" },
        { id: "j3", title: "Full Stack Developer", company: "GlobalTech", location: "San Francisco, CA", job_type: "Contract", salary: "$60/hr", description: "Contract role to help accelerate our full stack Python/React app.", requirements: ["Python", "React", "PostgreSQL"], skills: ["Python", "React", "PostgreSQL"], applicants: 42, status: "active" },
        { id: "j4", title: "UI/UX Designer", company: "DesignStudio", location: "Remote", job_type: "Part-time", salary: "$40k - $60k", description: "Creative designer needed for creating wireframes and mockups.", requirements: ["Figma", "CSS", "UI/UX"], skills: ["Figma", "CSS", "Design"], applicants: 8, status: "active" }
      ];
      setJobs(mockData as Job[]); 
      setSelectedJob(mockData[0] as Job); 
    }).catch((error) => setMessage(error instanceof Error ? error.message : "Could not load jobs."));
  }, []);

  const filtered = jobs.filter((j) => {
    if (activeType !== "All" && j.job_type !== activeType) return false;
    return j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Job Portal</h1>
          <p className="text-text-muted">AI-matched opportunities based on your Skill Passport.</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30"
              />
            </div>
            <div className="flex gap-1 glass-card rounded-xl p-1 overflow-x-auto">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                    activeType === type ? "bg-brand-orange/10 text-brand-orange" : "text-text-muted hover:text-text-primary"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Job List */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  hover
                  className={cn(
                    "cursor-pointer",
                    selectedJob?.id === job.id && "ring-1 ring-brand-orange/30 bg-brand-orange/5"
                  )}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg font-bold text-text-muted">
                        {job.company[0]}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-text-primary">{job.title}</h3>
                        <p className="text-xs text-text-muted">{job.company}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (savedJobs.includes(job.id)) { setSavedJobs((prev) => prev.filter((id) => id !== job.id)); return; }
                        saveJob(job.id).then(() => setSavedJobs((prev) => [...prev, job.id])).catch((error) => setMessage(error instanceof Error ? error.message : "Could not save job."));
                      }}
                      className="text-text-muted hover:text-brand-orange transition-colors"
                      aria-label="Save job"
                    >
                      <Heart className={cn("w-4 h-4", savedJobs.includes(job.id) && "fill-brand-orange text-brand-orange")} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs text-text-muted flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="text-xs text-text-muted flex items-center gap-1"><Clock className="w-3 h-3" />Open</span>
                    <span className="text-xs text-text-muted flex items-center gap-1"><Users className="w-3 h-3" />{job.applicants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{job.job_type}</Badge>
                    <span className="text-sm font-medium text-brand-orange">{job.salary}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Job Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3">
            {selectedJob && (
              <Card className="sticky top-24">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl font-bold text-text-muted">
                      {selectedJob.company[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-text-primary">{selectedJob.title}</h2>
                      <p className="text-sm text-text-muted">{selectedJob.company} • {selectedJob.location}</p>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="secondary"><Briefcase className="w-3 h-3 mr-1" />{selectedJob.job_type}</Badge>
                  <Badge variant="secondary"><MapPin className="w-3 h-3 mr-1" />{selectedJob.location}</Badge>
                  <Badge variant="secondary">{selectedJob.salary}</Badge>
                  <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Open</Badge>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-text-primary mb-2">Description</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{selectedJob.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-text-primary mb-2">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                        <ChevronRight className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-text-primary mb-2">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, i) => (
                      <Badge key={i}>{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => applyToJob(selectedJob.id).then(() => setMessage("Application submitted.")).catch((error) => setMessage(error instanceof Error ? error.message : "Could not submit application."))}>Apply Now</Button>
                  <Button variant="outline" onClick={() => selectedJob.apply_url && window.open(selectedJob.apply_url, "_blank", "noopener,noreferrer")} disabled={!selectedJob.apply_url}>
                    <ExternalLink className="w-4 h-4" /> Company Page
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
