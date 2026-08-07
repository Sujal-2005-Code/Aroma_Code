"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImagePlus, Mail, MapPin, Phone, Sparkles, Trash2, UserRound, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, NativeSelect } from "@/components/ui/input";
import { Field, SectionShell, TextField } from "@/components/profile/fields";
import { avatarBatch, initialsOf } from "@/lib/avatar";
import type { ProfileData } from "@/lib/profile";

type Props = { data: ProfileData; patch: (p: Partial<ProfileData>) => void };

export function PhotoSection({ data, patch }: Props) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [showAi, setShowAi] = React.useState(false);
  const [salt, setSalt] = React.useState("v1");
  const [generating, setGenerating] = React.useState(false);

  const avatars = React.useMemo(() => avatarBatch(data.fullName, salt), [data.fullName, salt]);

  const onUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ photoUrl: String(reader.result ?? ""), photoKind: "upload" });
    reader.readAsDataURL(file);
  };

  const regenerate = () => {
    setGenerating(true);
    setSalt(Math.random().toString(36).slice(2, 7));
    window.setTimeout(() => setGenerating(false), 700);
  };

  return (
    <SectionShell
      id="photo"
      index={0}
      icon={<Camera className="h-5 w-5" />}
      title="Profile Photo"
      description="A crisp headshot lifts recruiter response rates by ~2.4×. No photo ready? Generate an AI avatar instantly."
      accent="from-violet-500/40 to-fuchsia-500/25"
      action={<Badge variant="violet"><Sparkles className="h-3 w-3" /> AI Avatar Studio</Badge>}
    >
      <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-start">
        <div className="relative">
          <motion.div
            className="absolute -inset-3 rounded-full bg-[conic-gradient(from_0deg,#8b5cf6,#22d3ee,#f472b6,#8b5cf6)] opacity-70 blur-[14px]"
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="relative h-36 w-36 overflow-hidden rounded-full border border-white/20 bg-ink-800 shadow-2xl shadow-black/60"
          >
            {data.photoUrl ? (
              <Image
                src={data.photoUrl}
                alt="Profile"
                fill
                unoptimized
                sizes="144px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-600/30 to-cyan-500/20 text-3xl font-bold text-white/80">
                {initialsOf(data.fullName)}
              </div>
            )}
          </motion.div>
          <span className="animate-pulse-ring absolute inset-0 rounded-full border border-violet-400/40" />
          <motion.button
            type="button"
            onClick={() => fileRef.current?.click()}
            whileHover={{ scale: 1.12, rotate: 6 }}
            whileTap={{ scale: 0.92 }}
            className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-900/50"
            aria-label="Upload photo"
          >
            <ImagePlus className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="w-full flex-1 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={() => fileRef.current?.click()}>
              <ImagePlus className="h-4 w-4" /> Upload Picture
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={() => setShowAi((v) => !v)}
              className={showAi ? "border-violet-400/50 text-white" : ""}
            >
              <Wand2 className="h-4 w-4" /> AI Avatar
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Camera className="h-4 w-4" /> Edit Photo
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => patch({ photoUrl: "", photoKind: "none" })}
              disabled={!data.photoUrl}
            >
              <Trash2 className="h-4 w-4" /> Remove
            </Button>
          </div>

          <p className="text-[12px] text-slate-500">
            PNG / JPG · square framing works best · stored privately with your AROMA profile
            {data.photoKind === "ai" ? " · currently using an AI generated avatar" : ""}
          </p>

          <AnimatePresence initial={false}>
            {showAi && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="glass-soft rounded-2xl p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Generated identities
                    </p>
                    <Button variant="ghost" size="sm" onClick={regenerate}>
                      <Sparkles className={`h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} /> Regenerate
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {avatars.map((src, i) => (
                      <motion.button
                        key={src.slice(-24) + i}
                        type="button"
                        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 18 }}
                        whileHover={{ scale: 1.09, y: -3 }}
                        onClick={() => patch({ photoUrl: src, photoKind: "ai" })}
                        className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                          data.photoUrl === src
                            ? "border-violet-400 shadow-[0_0_20px_-4px_rgba(139,92,246,0.9)]"
                            : "border-white/12 hover:border-cyan-300/60"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`AI avatar ${i + 1}`} className="h-full w-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onUpload(e.target.files)}
      />
    </SectionShell>
  );
}

const GENDERS = ["Prefer not to say", "Female", "Male", "Non-binary", "Other"];

export function PersonalSection({ data, patch }: Props) {
  const words = data.about.trim().split(/\s+/).filter(Boolean).length;

  return (
    <SectionShell
      id="personal"
      index={1}
      icon={<UserRound className="h-5 w-5" />}
      title="Personal Information"
      description="The identity layer of your profile — used across recruiter search, matching and outreach."
      accent="from-cyan-500/35 to-blue-500/20"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          label="Full Name"
          required
          placeholder="Aarav Sharma"
          value={data.fullName}
          onChange={(e) => patch({ fullName: e.target.value })}
        />
        <TextField
          label="Headline"
          required
          placeholder="Final year CSE · AI & Full-stack Engineer"
          value={data.headline}
          onChange={(e) => patch({ headline: e.target.value })}
        />

        <Field
          label="About Me"
          className="md:col-span-2"
          hint={`${words} words · aim for 60–120 words with impact + metrics`}
        >
          <div className="relative">
            <textarea
              value={data.about}
              onChange={(e) => patch({ about: e.target.value })}
              placeholder="I build AI-native products… Describe your focus, strongest wins and what you want next."
              className="min-h-[130px] w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-300 hover:border-white/20 focus:border-violet-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-violet-500/25"
            />
            <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-slate-400">
              {data.about.length} chars
            </div>
          </div>
        </Field>

        <Field label="Email" required>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              type="email"
              placeholder="you@college.edu"
              className="pl-10"
              value={data.email}
              onChange={(e) => patch({ email: e.target.value })}
            />
          </div>
        </Field>

        <Field label="Phone Number">
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="+91 98765 43210"
              className="pl-10"
              value={data.phone}
              onChange={(e) => patch({ phone: e.target.value })}
            />
          </div>
        </Field>

        <TextField
          label="Date of Birth"
          type="date"
          value={data.dob}
          onChange={(e) => patch({ dob: e.target.value })}
        />

        <Field label="Gender">
          <NativeSelect value={data.gender} onChange={(e) => patch({ gender: e.target.value })}>
            <option value="">Select gender</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <Field label="Location" className="md:col-span-2">
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Bengaluru, Karnataka, India"
              className="pl-10"
              value={data.location}
              onChange={(e) => patch({ location: e.target.value })}
            />
          </div>
        </Field>
      </div>
    </SectionShell>
  );
}
