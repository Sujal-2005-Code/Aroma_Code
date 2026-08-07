"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { WorkExperience } from "@/types/portfolio";
import { Plus, Trash2 } from "lucide-react";

interface ExperienceEditorProps {
  experience: WorkExperience[];
  onChange: (experience: WorkExperience[]) => void;
}

export function ExperienceEditor({ experience, onChange }: ExperienceEditorProps) {
  const addExperience = () => {
    onChange([
      ...experience,
      {
        id: `exp-${Date.now()}`,
        company: "",
        role: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        location: "",
        responsibilities: [],
        achievements: [],
        technologies: [],
      },
    ]);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(experience.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 border border-white/10 p-6 backdrop-blur">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-text-primary">Work Experience</h3>
            <p className="text-sm text-text-muted">Add your professional experience</p>
          </div>
          <Button onClick={addExperience} size="sm" className="gradient-bg !text-white border-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </div>
      </div>

      {experience.map((exp, index) => (
        <Card key={exp.id} className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-text-primary">Experience {index + 1}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removeExperience(index)}>
                <Trash2 className="h-4 w-4 text-rose-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-primary/80">Company *</Label>
                <Input value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} placeholder="Company Name" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Role *</Label>
                <Input value={exp.role} onChange={(e) => updateExperience(index, "role", e.target.value)} placeholder="Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Employment Type</Label>
                <Input value={exp.employmentType || ""} onChange={(e) => updateExperience(index, "employmentType", e.target.value)} placeholder="Full-time" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Location</Label>
                <Input value={exp.location || ""} onChange={(e) => updateExperience(index, "location", e.target.value)} placeholder="San Francisco, CA" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Start Date</Label>
                <Input type="month" value={exp.startDate} onChange={(e) => updateExperience(index, "startDate", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">End Date</Label>
                <Input type="month" value={exp.endDate || ""} onChange={(e) => updateExperience(index, "endDate", e.target.value)} placeholder="Leave empty if current" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-text-primary/80">Responsibilities (one per line)</Label>
              <Textarea
                value={exp.responsibilities?.join("\n") || ""}
                onChange={(e) => updateExperience(index, "responsibilities", e.target.value.split("\n").filter(Boolean))}
                placeholder="Led development of microservices&#10;Mentored junior developers"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-text-primary/80">Technologies (comma-separated)</Label>
              <Input
                value={exp.technologies?.join(", ") || ""}
                onChange={(e) => updateExperience(index, "technologies", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {experience.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-text-muted mb-4">No experience added yet</p>
            <Button onClick={addExperience} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
