"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User, Palette, Bell, Shield, Globe, Eye, Moon, Sun,
  Smartphone, Mail, Lock, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getProfile, updateProfile } from "@/lib/api";

const tabs = [
  { label: "Profile", icon: User },
  { label: "Appearance", icon: Palette },
  { label: "Notifications", icon: Bell },
  { label: "Privacy", icon: Eye },
  { label: "Security", icon: Shield },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-10 h-6 rounded-full transition-colors flex items-center px-0.5",
        enabled ? "bg-brand-orange" : "bg-white/10"
      )}
      aria-label="Toggle setting"
    >
      <div className={cn(
        "w-5 h-5 rounded-full bg-white transition-transform",
        enabled ? "translate-x-4" : "translate-x-0"
      )} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [notifications, setNotifications] = useState({ email: true, push: true, resume: true, jobs: false, marketing: false });
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setFullName(data.full_name || "");
        setEmail(data.email || "");
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(fullName);
      setProfile((prev: any) => ({ ...prev, full_name: fullName }));
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1000px] mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Settings</h1>
          <p className="text-text-muted">Manage your account preferences and privacy.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="!p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all text-left",
                    activeTab === tab.label ? "bg-brand-orange/10 text-brand-orange" : "text-text-muted hover:text-text-primary hover:bg-glass"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </Card>
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-3">
            {activeTab === "Profile" && (
              <Card>
                <h3 className="text-sm font-medium text-text-primary mb-6">Profile Settings</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-2xl font-bold text-white">{(profile?.full_name || fullName || "A").split(" ").map((part: string) => part[0]).join("").slice(0, 2)}</div>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-text-muted mt-1">JPG, PNG, max 2MB</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Full Name", value: fullName, type: "text", onChange: (value: string) => setFullName(value), readOnly: false },
                    { label: "Email", value: email, type: "email", onChange: () => {}, readOnly: true },
                    { label: "Title", value: "Full Stack Developer", type: "text", onChange: () => {}, readOnly: true },
                    { label: "Location", value: "Bangalore, India", type: "text", onChange: () => {}, readOnly: true },
                    { label: "Bio", value: "Passionate full-stack developer with expertise in React, Node.js, and cloud technologies.", type: "textarea", onChange: () => {}, readOnly: true },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="text-xs text-text-muted mb-1 block">{field.label}</label>
                      {field.type === "textarea" ? (
                        <textarea
                          value={field.value}
                          rows={3}
                          readOnly={field.readOnly}
                          className="w-full bg-glass border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-orange/30 resize-none"
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          readOnly={field.readOnly}
                          className="w-full bg-glass border border-border-subtle rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-orange/30"
                        />
                      )}
                    </div>
                  ))}
                  <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                </div>
              </Card>
            )}

            {activeTab === "Appearance" && (
              <Card>
                <h3 className="text-sm font-medium text-text-primary mb-6">Appearance</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-text-primary mb-3">Theme</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: "Dark", icon: Moon, active: true },
                        { name: "Light", icon: Sun, active: false },
                        { name: "System", icon: Smartphone, active: false },
                      ].map((theme) => (
                        <button
                          key={theme.name}
                          className={cn(
                            "glass-card rounded-xl p-4 text-center transition-all",
                            theme.active ? "ring-1 ring-brand-orange/30 bg-brand-orange/5" : "hover:bg-glass-strong"
                          )}
                        >
                          <theme.icon className={cn("w-6 h-6 mx-auto mb-2", theme.active ? "text-brand-orange" : "text-text-muted")} />
                          <p className="text-xs text-text-primary">{theme.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-text-primary mb-3">Accent Color</p>
                    <div className="flex gap-3">
                      {["#FC8F0F", "#F61E66", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444"].map((color) => (
                        <button
                          key={color}
                          className={cn(
                            "w-8 h-8 rounded-full transition-transform hover:scale-110",
                            color === "#FC8F0F" && "ring-2 ring-white/30 ring-offset-2 ring-offset-bg-primary"
                          )}
                          style={{ background: color }}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "Notifications" && (
              <Card>
                <h3 className="text-sm font-medium text-text-primary mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: "email" as const, label: "Email Notifications", desc: "Receive email updates about your activity" },
                    { key: "push" as const, label: "Push Notifications", desc: "Browser push notifications" },
                    { key: "resume" as const, label: "Resume Updates", desc: "When your resume score changes" },
                    { key: "jobs" as const, label: "Job Alerts", desc: "New matching job opportunities" },
                    { key: "marketing" as const, label: "Marketing", desc: "Product updates and newsletters" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between glass-card rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm text-text-primary">{item.label}</p>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </div>
                      <Toggle
                        enabled={notifications[item.key]}
                        onToggle={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "Privacy" && (
              <Card>
                <h3 className="text-sm font-medium text-text-primary mb-6">Privacy Settings</h3>
                <div className="space-y-4">
                  {[
                    { label: "Public Profile", desc: "Allow anyone to view your profile", enabled: true },
                    { label: "Show Skill Passport", desc: "Display your passport on public profile", enabled: true },
                    { label: "Recruiter Visibility", desc: "Allow recruiters to find you", enabled: true },
                    { label: "Show Activity", desc: "Display your coding activity publicly", enabled: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between glass-card rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm text-text-primary">{item.label}</p>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </div>
                      <Toggle enabled={item.enabled} onToggle={() => {}} />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "Security" && (
              <Card>
                <h3 className="text-sm font-medium text-text-primary mb-6">Security</h3>
                <div className="space-y-4">
                  <div className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-text-muted" />
                      <div>
                        <p className="text-sm text-text-primary">Password</p>
                        <p className="text-xs text-text-muted">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  <div className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-text-muted" />
                      <div>
                        <p className="text-sm text-text-primary">Two-Factor Authentication</p>
                        <p className="text-xs text-text-muted">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  <div className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-text-muted" />
                      <div>
                        <p className="text-sm text-text-primary">Connected Accounts</p>
                        <p className="text-xs text-text-muted">Google, GitHub connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
