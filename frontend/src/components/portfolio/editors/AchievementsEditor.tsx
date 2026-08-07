"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Achievement, CodingProfile } from "@/types/portfolio";
import { Plus, Trash2 } from "lucide-react";

interface AchievementsEditorProps {
  achievements: Achievement[];
  codingProfiles: CodingProfile[];
  onChange: (field: string, value: any) => void;
}

export function AchievementsEditor({ achievements, codingProfiles, onChange }: AchievementsEditorProps) {
  const addAchievement = () => {
    onChange("achievements", [
      ...achievements,
      {
        id: `ach-${Date.now()}`,
        title: "",
        type: "other" as const,
        description: "",
      },
    ]);
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: any) => {
    const updated = [...achievements];
    updated[index] = { ...updated[index], [field]: value };
    onChange("achievements", updated);
  };

  const removeAchievement = (index: number) => {
    onChange("achievements", achievements.filter((_, i) => i !== index));
  };

  const addCodingProfile = () => {
    onChange("codingProfiles", [
      ...codingProfiles,
      {
        platform: "",
        username: "",
        profileLink: "",
      },
    ]);
  };

  const updateCodingProfile = (index: number, field: keyof CodingProfile, value: any) => {
    const updated = [...codingProfiles];
    updated[index] = { ...updated[index], [field]: value };
    onChange("codingProfiles", updated);
  };

  const removeCodingProfile = (index: number) => {
    onChange("codingProfiles", codingProfiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Achievements Section */}
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-red-500/20 border border-white/10 p-6 backdrop-blur">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-text-primary">Achievements</h3>
              <p className="text-sm text-text-muted">Showcase your accomplishments and awards</p>
            </div>
            <Button onClick={addAchievement} size="sm" className="gradient-bg !text-white border-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Achievement
            </Button>
          </div>
        </div>

        {achievements.map((achievement, index) => (
          <Card key={achievement.id} className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-text-primary">Achievement {index + 1}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeAchievement(index)}>
                  <Trash2 className="h-4 w-4 text-rose-400" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-text-primary/80">Title *</Label>
                  <Input value={achievement.title} onChange={(e) => updateAchievement(index, "title", e.target.value)} placeholder="First Place - Hackathon 2024" />
                </div>
                <div className="space-y-2">
                  <Label className="text-text-primary/80">Type</Label>
                  <Select value={achievement.type} onValueChange={(value) => updateAchievement(index, "type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hackathon">Hackathon</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="award">Award</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="publication">Publication</SelectItem>
                      <SelectItem value="opensource">Open Source</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary/80">Description</Label>
                <Textarea value={achievement.description || ""} onChange={(e) => updateAchievement(index, "description", e.target.value)} placeholder="Describe your achievement..." rows={3} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coding Profiles Section */}
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-white/10 p-6 backdrop-blur">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-text-primary">Coding Profiles</h3>
              <p className="text-sm text-text-muted">Add your competitive programming profiles</p>
            </div>
            <Button onClick={addCodingProfile} size="sm" className="gradient-bg !text-white border-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Profile
            </Button>
          </div>
        </div>

        {codingProfiles.map((profile, index) => (
          <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-text-primary">Profile {index + 1}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeCodingProfile(index)}>
                  <Trash2 className="h-4 w-4 text-rose-400" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-text-primary/80">Platform *</Label>
                  <Input value={profile.platform} onChange={(e) => updateCodingProfile(index, "platform", e.target.value)} placeholder="LeetCode" />
                </div>
                <div className="space-y-2">
                  <Label className="text-text-primary/80">Username *</Label>
                  <Input value={profile.username} onChange={(e) => updateCodingProfile(index, "username", e.target.value)} placeholder="your_username" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-text-primary/80">Profile Link *</Label>
                  <Input value={profile.profileLink} onChange={(e) => updateCodingProfile(index, "profileLink", e.target.value)} placeholder="https://leetcode.com/your_username" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
