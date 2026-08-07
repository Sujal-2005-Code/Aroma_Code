"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoEditor } from "./editors/PersonalInfoEditor";
import { EducationEditor } from "./editors/EducationEditor";
import { ExperienceEditor } from "./editors/ExperienceEditor";
import { ProjectsEditor } from "./editors/ProjectsEditor";
import { SkillsEditor } from "./editors/SkillsEditor";
import { CertificatesEditor } from "./editors/CertificatesEditor";
import { AchievementsEditor } from "./editors/AchievementsEditor";
import { ThemeCustomizer } from "./editors/ThemeCustomizer";
import type { PortfolioData } from "@/types/portfolio";
import { User, GraduationCap, Briefcase, FolderKanban, Sparkles, Award, Trophy, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PortfolioEditorProps {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  onSave?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
}

const tabs = [
  { value: "personal", label: "Personal", icon: User, gradient: "from-purple-500 to-pink-500" },
  { value: "education", label: "Education", icon: GraduationCap, gradient: "from-blue-500 to-cyan-500" },
  { value: "experience", label: "Experience", icon: Briefcase, gradient: "from-green-500 to-emerald-500" },
  { value: "projects", label: "Projects", icon: FolderKanban, gradient: "from-orange-500 to-red-500" },
  { value: "skills", label: "Skills", icon: Sparkles, gradient: "from-yellow-500 to-amber-500" },
  { value: "certificates", label: "Certs", icon: Award, gradient: "from-indigo-500 to-purple-500" },
  { value: "achievements", label: "Awards", icon: Trophy, gradient: "from-pink-500 to-rose-500" },
  { value: "theme", label: "Theme", icon: Palette, gradient: "from-violet-500 to-fuchsia-500" },
];

export function PortfolioEditor({
  data,
  onChange,
  onSave,
  onPreview,
  onPublish,
}: PortfolioEditorProps) {
  const [activeTab, setActiveTab] = useState("personal");

  const updateField = (field: keyof PortfolioData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text-primary">Edit Portfolio</h2>
            <p className="text-sm text-text-muted mt-1">Customize every detail of your portfolio</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-text-muted">Auto-saved</span>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full h-auto p-2 bg-white/5 backdrop-blur-xl border border-border-subtle rounded-2xl grid grid-cols-4 lg:grid-cols-8 gap-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "relative rounded-xl px-2 py-3 data-[state=active]:bg-white/10 data-[state=active]:text-text-primary transition-all group",
                "flex flex-col items-center gap-1.5 text-text-muted"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-lg bg-gradient-to-br flex items-center justify-center transition-transform group-data-[state=active]:scale-110",
                tab.gradient
              )}>
                <tab.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
              {activeTab === tab.value && (
                <motion.div
                  layoutId="tab-indicator"
                  className={cn("absolute inset-0 rounded-xl bg-gradient-to-br opacity-10", tab.gradient)}
                />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="personal" className="mt-6">
            <PersonalInfoEditor
              data={data.personalInfo}
              summary={data.summary}
              bio={data.bio}
              socialLinks={data.socialLinks}
              onChange={(field, value) => {
                if (field === "summary" || field === "bio") {
                  updateField(field, value);
                } else if (field === "socialLinks") {
                  updateField("socialLinks", value);
                } else {
                  updateField("personalInfo", { ...data.personalInfo, [field]: value });
                }
              }}
            />
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <EducationEditor education={data.education || []} onChange={(education) => updateField("education", education)} />
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <ExperienceEditor experience={data.workExperience || []} onChange={(experience) => updateField("workExperience", experience)} />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ProjectsEditor projects={data.projects || []} onChange={(projects) => updateField("projects", projects)} />
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <SkillsEditor skills={data.skills || {}} onChange={(skills) => updateField("skills", skills)} />
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <CertificatesEditor certificates={data.certificates || []} onChange={(certificates) => updateField("certificates", certificates)} />
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <AchievementsEditor
              achievements={data.achievements || []}
              codingProfiles={data.codingProfiles || []}
              onChange={(field, value) => updateField(field as keyof PortfolioData, value)}
            />
          </TabsContent>

          <TabsContent value="theme" className="mt-6">
            <ThemeCustomizer
              theme={data.theme}
              customization={data.customization}
              onChange={(field, value) => {
                if (field === "theme") {
                  updateField("theme", value);
                } else {
                  updateField("customization", { ...data.customization, [field]: value });
                }
              }}
            />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}
