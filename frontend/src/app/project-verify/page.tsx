"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import {
  FolderGit2, Search, Shield, Zap, FileText, Code2,
  CheckCircle2, AlertTriangle, GitBranch, Star, Folder, File
} from "lucide-react";
import { cn } from "@/lib/utils";

const folderTree = [
  { name: "src/", type: "folder", indent: 0 },
  { name: "components/", type: "folder", indent: 1 },
  { name: "ui/", type: "folder", indent: 2 },
  { name: "Button.tsx", type: "file", indent: 3 },
  { name: "Card.tsx", type: "file", indent: 3 },
  { name: "pages/", type: "folder", indent: 1 },
  { name: "index.tsx", type: "file", indent: 2 },
  { name: "lib/", type: "folder", indent: 1 },
  { name: "utils.ts", type: "file", indent: 2 },
  { name: "api.ts", type: "file", indent: 2 },
  { name: "package.json", type: "file", indent: 0 },
  { name: "README.md", type: "file", indent: 0 },
  { name: "tsconfig.json", type: "file", indent: 0 },
];

export default function ProjectVerifyPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Project Verification</h1>
          <p className="text-text-muted">AI-powered analysis of code quality, security, and architecture.</p>
        </motion.div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FolderGit2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Enter GitHub repository URL..."
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-glass border border-border-subtle rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30"
                />
              </div>
              <Button onClick={handleVerify} disabled={verifying}>
                {verifying ? "Analyzing..." : "Verify Project"}
              </Button>
            </div>
          </Card>
        </motion.div>

        {verifying && (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Analyzing Repository...</h3>
            <p className="text-sm text-text-muted mb-6">Checking code quality, security, and documentation</p>
            <Progress value={45} className="max-w-xs mx-auto" />
          </Card>
        )}

        {verified && (
          <div className="space-y-6">
            {/* Scores */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Overall", value: 88 },
                { label: "Security", value: 92 },
                { label: "Performance", value: 85 },
                { label: "Code Quality", value: 87 },
                { label: "Documentation", value: 78 },
              ].map((score, i) => (
                <Card key={i} className="text-center">
                  <ScoreRing score={score.value} label={score.label} size={72} />
                </Card>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Repo Preview & Tree */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <FolderGit2 className="w-5 h-5 text-brand-orange" />
                    <div>
                      <h3 className="text-sm font-medium text-text-primary">arjun/ecommerce-platform</h3>
                      <p className="text-xs text-text-muted">Full-stack e-commerce with payment integration</p>
                    </div>
                    <Badge variant="success" className="ml-auto"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-text-muted mb-4">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> 234 stars</span>
                    <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> 56 forks</span>
                    <span>TypeScript • Next.js</span>
                  </div>
                  {/* Folder Tree */}
                  <div className="glass-card rounded-xl p-4">
                    <h4 className="text-xs font-medium text-text-muted mb-3">File Structure</h4>
                    <div className="space-y-1 font-mono text-xs">
                      {folderTree.map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-text-muted" style={{ paddingLeft: `${item.indent * 16}px` }}>
                          {item.type === "folder" ? <Folder className="w-3.5 h-3.5 text-brand-orange" /> : <File className="w-3.5 h-3.5" />}
                          <span className={item.type === "folder" ? "text-brand-orange" : ""}>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* AI Report */}
                <Card>
                  <h3 className="text-sm font-medium text-text-primary mb-4">AI Verification Report</h3>
                  <div className="space-y-3">
                    {[
                      { status: "pass", text: "Code follows consistent patterns and best practices" },
                      { status: "pass", text: "No known security vulnerabilities detected" },
                      { status: "pass", text: "Proper error handling implemented across the codebase" },
                      { status: "warn", text: "Test coverage could be improved (currently at 67%)" },
                      { status: "warn", text: "Some components lack proper TypeScript types" },
                      { status: "pass", text: "README documentation is comprehensive and well-structured" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 glass-card rounded-lg px-3 py-2">
                        {item.status === "pass" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm text-text-muted">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Sidebar Details */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
                <Card>
                  <h3 className="text-sm font-medium text-text-primary mb-3">Score Breakdown</h3>
                  {[
                    { label: "Architecture", score: 90 },
                    { label: "Error Handling", score: 85 },
                    { label: "Code Reusability", score: 82 },
                    { label: "Testing", score: 67 },
                    { label: "Type Safety", score: 78 },
                    { label: "Documentation", score: 88 },
                  ].map((item, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted">{item.label}</span>
                        <span className="text-text-primary font-medium">{item.score}%</span>
                      </div>
                      <Progress value={item.score} size="sm" />
                    </div>
                  ))}
                </Card>

                <Card>
                  <h3 className="text-sm font-medium text-text-primary mb-3">Technologies Detected</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Stripe", "PostgreSQL", "Vercel"].map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </Card>

                <Button className="w-full"><Shield className="w-4 h-4" /> Get Verification Badge</Button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
