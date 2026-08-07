"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/portfolio";
import { Plus, Trash2 } from "lucide-react";

interface ProjectsEditorProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProjectsEditor({ projects, onChange }: ProjectsEditorProps) {
  const addProject = () => {
    onChange([
      ...projects,
      {
        id: `proj-${Date.now()}`,
        name: "",
        description: "",
        techStack: [],
        features: [],
      },
    ]);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 border border-white/10 p-6 backdrop-blur">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-text-primary">Projects</h3>
            <p className="text-sm text-text-muted">Showcase your work and achievements</p>
          </div>
          <Button onClick={addProject} size="sm" className="gradient-bg !text-white border-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      {projects.map((project, index) => (
        <Card key={project.id} className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-text-primary">Project {index + 1}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => removeProject(index)}>
                <Trash2 className="h-4 w-4 text-rose-400" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-text-primary/80">Project Name *</Label>
              <Input value={project.name} onChange={(e) => updateProject(index, "name", e.target.value)} placeholder="Awesome Project" />
            </div>
            <div className="space-y-2">
              <Label className="text-text-primary/80">Description *</Label>
              <Textarea value={project.description} onChange={(e) => updateProject(index, "description", e.target.value)} placeholder="Describe what this project does..." rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-primary/80">GitHub Link</Label>
                <Input value={project.githubLink || ""} onChange={(e) => updateProject(index, "githubLink", e.target.value)} placeholder="https://github.com/user/project" />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Live Link</Label>
                <Input value={project.liveLink || ""} onChange={(e) => updateProject(index, "liveLink", e.target.value)} placeholder="https://project.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-text-primary/80">Tech Stack (comma-separated)</Label>
              <Input value={project.techStack.join(", ")} onChange={(e) => updateProject(index, "techStack", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} placeholder="React, Node.js, PostgreSQL" />
            </div>
            <div className="space-y-2">
              <Label className="text-text-primary/80">Key Features (one per line)</Label>
              <Textarea value={project.features?.join("\n") || ""} onChange={(e) => updateProject(index, "features", e.target.value.split("\n").filter(Boolean))} placeholder="Real-time updates&#10;AI-powered features" rows={3} />
            </div>
          </CardContent>
        </Card>
      ))}

      {projects.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-text-muted mb-4">No projects added yet</p>
            <Button onClick={addProject} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
