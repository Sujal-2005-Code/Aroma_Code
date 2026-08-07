"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, Contrast, Image as ImageIcon, RotateCcw, SunMedium, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ToastMessage } from "./Toast";

interface ProfilePhotoProps {
  name: string;
  avatarUrl?: string;
  onSave: (url: string) => void;
  onToast: (toast: ToastMessage) => void;
}

export function ProfilePhoto({ name, avatarUrl, onSave, onToast }: ProfilePhotoProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>();
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectUrlRef = useRef<string | undefined>(undefined);
  const previewUrl = filePreviewUrl ?? avatarUrl;

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !previewUrl) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const size = 320;
      canvas.width = size;
      canvas.height = size;
      context.clearRect(0, 0, size, size);
      context.filter = `brightness(${brightness}) contrast(${contrast})`;
      context.save();
      context.translate(size / 2, size / 2);
      context.rotate((rotate * Math.PI) / 180);
      context.scale(zoom, zoom);
      context.drawImage(image, -size / 2, -size / 2, size, size);
      context.restore();
    };
    image.src = previewUrl;
  }, [previewUrl, zoom, rotate, brightness, contrast]);

  const hideModal = () => setModalOpen(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    if (nextFile.size > 5 * 1024 * 1024) {
      onToast({
        id: `toast-${Date.now()}`,
        title: "File too large",
        description: "Profile photos must be under 5MB.",
        variant: "danger",
      });
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const preview = URL.createObjectURL(nextFile);
    objectUrlRef.current = preview;
    setFilePreviewUrl(preview);
  };

  const handleSave = () => {
    if (!previewUrl) {
      onToast({
        id: `toast-${Date.now()}`,
        title: "No image selected",
        description: "Choose a photo before saving.",
        variant: "warning",
      });
      return;
    }

    onSave(previewUrl);
    hideModal();
    onToast({
      id: `toast-${Date.now()}`,
      title: "Profile photo updated",
      description: "Your avatar has been refreshed successfully.",
      variant: "success",
    });
  };

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative isolate">
      <div className="relative mx-auto flex h-[176px] w-[176px] items-center justify-center rounded-full before:absolute before:inset-0 before:rounded-full before:border before:border-white/10 before:bg-[conic-gradient(at_top,_rgba(139,92,246,0.65),_rgba(59,130,246,0.55),_rgba(168,85,247,0.35),_rgba(59,130,246,0.35))] before:blur-2xl before:opacity-70 before:animate-[glow-ring_9s_linear_infinite]">
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#090a18]/90 shadow-[0_0_120px_rgba(80,63,255,0.12)]">
          <div className="absolute inset-0 rounded-full bg-white/5 blur-sm" />
          <div className="absolute right-4 bottom-4 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/80 shadow-[0_0_10px_rgba(16,185,129,0.45)]">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-50" />
          </div>
          <div className="absolute left-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 text-[11px] font-semibold text-slate-200 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <SparkleBadge />
          </div>
          {previewUrl ? (
            // Object URLs and external avatar URLs cannot use the Next.js image optimizer.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Profile"
              className="h-[148px] w-[148px] rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="grid h-[148px] w-[148px] place-items-center rounded-full bg-slate-900/80 text-4xl font-semibold text-slate-200">
              {initials}
            </div>
          )}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalOpen(true)}
            className="absolute inset-x-0 bottom-0 mx-auto mb-[-12px] flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/90 px-4 py-2 text-sm text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur"
          >
            <Camera className="h-4 w-4" />
            Change Photo
          </motion.button>
        </div>
      </div>

      {modalOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex max-h-[90vh] w-full max-w-[1100px] flex-col overflow-y-auto rounded-[32px] border border-white/10 bg-slate-950/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 pb-4 sm:items-center sm:gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Update Profile Picture</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Upload, edit and save a glowing avatar</h2>
              </div>
              <button onClick={hideModal} className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid items-stretch gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="flex h-full flex-col justify-between space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.18)] backdrop-blur-xl sm:p-5">
                <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/80 p-3 sm:p-4">
                  <canvas ref={canvasRef} className="aspect-[4/3] w-full rounded-[20px] object-cover" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/90 to-transparent" />
                </div>
                <label className="group flex cursor-pointer items-center justify-between rounded-[24px] border border-dashed border-white/15 bg-white/5 px-4 py-4 text-left transition hover:border-brand-orange/30 hover:bg-white/10">
                  <span className="min-w-0 pr-3">
                    <span className="block text-sm font-semibold text-white">Upload from computer</span>
                    <span className="mt-1 block text-xs text-slate-400">PNG, JPG, JPEG, WEBP up to 5MB</span>
                  </span>
                  <Upload className="h-5 w-5 shrink-0 text-brand-orange" />
                  <input type="file" accept="image/png,image/jpg,image/jpeg,image/webp" className="sr-only" onChange={handleFileChange} />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Slider label="Zoom" value={zoom} min={0.8} max={1.6} step={0.05} onChange={(value) => setZoom(value)} />
                  <Slider label="Rotate" value={rotate} min={-180} max={180} step={1} onChange={(value) => setRotate(value)} />
                  <Slider label="Brightness" value={brightness} min={0.75} max={1.3} step={0.05} onChange={(value) => setBrightness(value)} />
                  <Slider label="Contrast" value={contrast} min={0.75} max={1.4} step={0.05} onChange={(value) => setContrast(value)} />
                </div>
              </div>
              <div className="flex h-full flex-col justify-between space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.18)] backdrop-blur-xl sm:p-5">
                <div className="rounded-3xl bg-gradient-to-br from-brand-orange/10 to-brand-pink/10 p-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Preview</p>
                  <div className="mt-4 flex h-44 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/70">
                  {previewUrl ? (
                      // Object URLs and external avatar URLs cannot use the Next.js image optimizer.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewUrl} alt="Preview" className="h-32 w-32 rounded-full object-cover" />
                    ) : (
                      <div className="grid h-32 w-32 place-items-center rounded-full bg-slate-900/70 text-xl text-slate-300">{initials}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Camera className="h-4 w-4 text-brand-orange" /> Drag & drop or click to browse.
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/60 text-brand-orange">
                      <ImageIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-white">Crop into a perfect circle.</p>
                      <p className="text-sm text-slate-400">Your avatar will appear with premium glass glow and soft ring border.</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <Button variant="default" onClick={handleSave} className="w-full">
                    Save profile photo
                  </Button>
                  <Button variant="secondary" onClick={hideModal} className="w-full">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-brand-orange"
      />
    </div>
  );
}

function SparkleBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-950">
      <path fill="currentColor" d="M12 2.5l1.65 3.35 3.7.55-2.7 2.63.64 3.72L12 11.25l-3.3 1.7.64-3.72L6.6 6.4l3.7-.55L12 2.5z" />
    </svg>
  );
}
