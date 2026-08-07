"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skills, Skill } from "@/types/portfolio";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface SkillsEditorProps {
  skills: Skills;
  onChange: (skills: Skills) => void;
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState<{ [key: string]: string }>({});

  const categories = [
    { key: "programmingLanguages", label: "Programming Languages" },
    { key: "frameworks", label: "Frameworks" },
    { key: "libraries", label: "Libraries" },
    { key: "databases", label: "Databases" },
    { key: "cloud", label: "Cloud" },
    { key: "devops", label: "DevOps" },
    { key: "tools", label: "Tools" },
    { key: "softSkills", label: "Soft Skills" },
  ];

  const addSkill = (category: keyof Skills) => {
    const skillName = newSkill[category]?.trim();
    if (!skillName) return;

    const currentSkills = (skills[category] as Skill[]) || [];
    onChange({
      ...skills,
      [category]: [...currentSkills, { name: skillName, level: "intermediate" as const }],
    });
    setNewSkill({ ...newSkill, [category]: "" });
  };

  const removeSkill = (category: keyof Skills, index: number) => {
    const currentSkills = (skills[category] as Skill[]) || [];
    onChange({
      ...skills,
      [category]: currentSkills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/20 via-amber-500/20 to-orange-500/20 border border-white/10 p-6 backdrop-blur">
        <h3 className="text-xl font-bold text-text-primary">Skills</h3>
        <p className="text-sm text-text-muted">Add your technical and soft skills</p>
      </div>

      {categories.map(({ key, label }) => (
        <Card key={key} className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-base text-text-primary">{label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {((skills[key as keyof Skills] as Skill[]) || []).map((skill, index) => (
                <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                  {skill.name}
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-2 hover:bg-transparent" onClick={() => removeSkill(key as keyof Skills, index)}>
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill[key] || ""}
                onChange={(e) => setNewSkill({ ...newSkill, [key]: e.target.value })}
                placeholder={`Add ${label.toLowerCase()}...`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(key as keyof Skills);
                  }
                }}
              />
              <Button onClick={() => addSkill(key as keyof Skills)} size="icon" className="gradient-bg !text-white border-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
