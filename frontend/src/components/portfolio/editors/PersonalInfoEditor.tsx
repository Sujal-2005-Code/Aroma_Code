"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonalInfo, SocialLinks } from "@/types/portfolio";
import { Sparkles, Wand2 } from "lucide-react";

interface PersonalInfoEditorProps {
  data: PersonalInfo;
  summary?: string;
  bio?: string;
  socialLinks: SocialLinks;
  onChange: (field: string, value: any) => void;
}

export function PersonalInfoEditor({ data, summary, bio, socialLinks, onChange }: PersonalInfoEditorProps) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 border border-white/10 p-6 backdrop-blur">
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Personal Information</h3>
            <p className="text-sm text-text-muted">Your identity makes the first impression</p>
          </div>
        </div>
      </div>

      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-text-primary">Basic Info</CardTitle>
          <CardDescription>Name, headline, and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Full Name *" value={data.fullName} onChange={(v) => onChange("fullName", v)} placeholder="John Doe" />
            <InputField label="Headline" value={data.headline} onChange={(v) => onChange("headline", v)} placeholder="Full Stack Developer & AI Engineer" />
            <InputField label="Role" value={data.role} onChange={(v) => onChange("role", v)} placeholder="Senior Software Engineer" />
            <InputField label="Email" value={data.email} onChange={(v) => onChange("email", v)} placeholder="john@example.com" type="email" />
            <InputField label="Phone" value={data.phone} onChange={(v) => onChange("phone", v)} placeholder="+1 (555) 123-4567" />
            <InputField label="Location" value={data.location} onChange={(v) => onChange("location", v)} placeholder="San Francisco, CA" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-text-primary">Professional Summary</CardTitle>
              <CardDescription>Quick overview of your professional background</CardDescription>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-xs font-semibold text-white hover:scale-105 transition-transform">
              <Wand2 className="h-3 w-3" />
              AI Improve
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextareaField label="Summary" value={summary} onChange={(v) => onChange("summary", v)} placeholder="A passionate developer with expertise in..." rows={4} />
          <TextareaField label="Bio / About Me" value={bio} onChange={(v) => onChange("bio", v)} placeholder="Tell your story..." rows={6} />
        </CardContent>
      </Card>

      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-text-primary">Social Links</CardTitle>
          <CardDescription>Connect your social media and professional profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="LinkedIn" value={socialLinks.linkedin} onChange={(v) => onChange("socialLinks", { ...socialLinks, linkedin: v })} placeholder="https://linkedin.com/in/username" />
            <InputField label="GitHub" value={socialLinks.github} onChange={(v) => onChange("socialLinks", { ...socialLinks, github: v })} placeholder="https://github.com/username" />
            <InputField label="Twitter/X" value={socialLinks.twitter} onChange={(v) => onChange("socialLinks", { ...socialLinks, twitter: v })} placeholder="https://twitter.com/username" />
            <InputField label="Website" value={data.website} onChange={(v) => onChange("website", v)} placeholder="https://yourwebsite.com" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }: { label: string; value?: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-text-muted uppercase tracking-wider">{label}</Label>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 4 }: { label: string; value?: string; onChange: (v: string) => void; placeholder: string; rows?: number }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-text-muted uppercase tracking-wider">{label}</Label>
      <Textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}
