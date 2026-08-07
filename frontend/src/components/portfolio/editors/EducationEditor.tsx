"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Education } from "@/types/portfolio";
import { Plus, Trash2 } from "lucide-react";

interface EducationEditorProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function EducationEditor({ education, onChange }: EducationEditorProps) {
  const addEducation = () => {
    onChange([
      ...education,
      {
        id: `edu-${Date.now()}`,
        degree: "",
        college: "",
        university: "",
        branch: "",
        cgpa: "",
        startDate: "",
        endDate: "",
        achievements: [],
      },
    ]);
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 border border-white/10 p-6 backdrop-blur">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-text-primary">Education</h3>
            <p className="text-sm text-text-muted">Add your educational background</p>
          </div>
          <Button onClick={addEducation} size="sm" className="gradient-bg !text-white border-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </div>
      </div>

      {education.map((edu, index) => (
        <Card key={edu.id} className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-text-primary">Education {index + 1}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removeEducation(index)}>
                <Trash2 className="h-4 w-4 text-rose-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-primary/80">Degree *</Label>
                <Input value={edu.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} placeholder="Bachelor of Technology" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">College/School</Label>
                <Input value={edu.college || ""} onChange={(e) => updateEducation(index, "college", e.target.value)} placeholder="MIT" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">University/Board</Label>
                <Input value={edu.university || ""} onChange={(e) => updateEducation(index, "university", e.target.value)} placeholder="University Name" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Branch/Major</Label>
                <Input value={edu.branch || ""} onChange={(e) => updateEducation(index, "branch", e.target.value)} placeholder="Computer Science" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">CGPA/GPA</Label>
                <Input value={edu.cgpa || ""} onChange={(e) => updateEducation(index, "cgpa", e.target.value)} placeholder="3.8" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Percentage</Label>
                <Input value={edu.percentage || ""} onChange={(e) => updateEducation(index, "percentage", e.target.value)} placeholder="85%" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Start Date</Label>
                <Input type="month" value={edu.startDate} onChange={(e) => updateEducation(index, "startDate", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">End Date</Label>
                <Input type="month" value={edu.endDate || ""} onChange={(e) => updateEducation(index, "endDate", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {education.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-text-muted mb-4">No education added yet</p>
            <Button onClick={addEducation} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Education
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
