"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, UploadCloud, X } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatBytes } from "@/lib/utils";

export function SectionShell({
  id,
  icon,
  title,
  description,
  accent = "from-violet-500/30 to-cyan-500/20",
  action,
  index = 0,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: string;
  action?: React.ReactNode;
  index?: number;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.section
      id={id}
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="glass group/section relative scroll-mt-28 overflow-hidden rounded-3xl p-5 transition-colors duration-500 hover:border-white/20 sm:p-7"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/section:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx, 50%) var(--my, 0%), rgba(139,92,246,0.13), transparent 65%)",
        }}
      />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-gradient-to-br text-white shadow-lg shadow-black/40",
              accent,
            )}
          >
            {icon}
          </motion.div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h2>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-slate-400">{description}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="relative mt-6">{children}</div>
    </motion.section>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="flex items-center gap-1">
        {label}
        {required ? <span className="text-violet-400">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-[11px] text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  label,
  hint,
  className,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} hint={hint} className={className} required={required}>
      <Input {...props} />
    </Field>
  );
}

export function TextAreaField({
  label,
  hint,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <Field label={label} hint={hint} className={className}>
      <Textarea {...props} />
    </Field>
  );
}

export function TagInput({
  value,
  onChange,
  placeholder = "Type a skill and press Enter",
  suggestions = [],
  accent = "from-violet-500/80 to-cyan-500/60",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  accent?: string;
}) {
  const [draft, setDraft] = React.useState("");

  const add = (raw: string) => {
    const tag = raw.trim().replace(/,$/, "");
    if (!tag) return;
    if (value.some((v) => v.toLowerCase() === tag.toLowerCase())) return;
    onChange([...value, tag]);
    setDraft("");
  };

  const remove = (tag: string) => onChange(value.filter((v) => v !== tag));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {value.map((tag) => (
            <motion.span
              key={tag}
              layout
              initial={{ opacity: 0, scale: 0.7, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-gradient-to-r px-3 py-1 text-xs font-medium text-white shadow-sm shadow-black/40",
                accent,
              )}
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                className="rounded-full p-0.5 text-white/70 transition hover:bg-black/30 hover:text-white"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            }
            if (e.key === "Backspace" && !draft && value.length) remove(value[value.length - 1]);
          }}
          className="h-10"
        />
        <button
          type="button"
          onClick={() => add(draft)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-slate-200 transition hover:border-violet-400/50 hover:bg-violet-500/15 hover:text-white"
          aria-label="Add tag"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions
            .filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()))
            .slice(0, 6)
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="rounded-full border border-dashed border-white/15 px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-violet-400/50 hover:text-violet-200"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export function FileDrop({
  onFile,
  accept,
  title,
  subtitle,
  maxMB = 4,
  compact,
}: {
  onFile: (payload: { name: string; dataUrl: string; size: number; type: string }) => void;
  accept: string;
  title: string;
  subtitle: string;
  maxMB?: number;
  compact?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File must be under ${maxMB} MB (received ${formatBytes(file.size)})`);
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () =>
      onFile({
        name: file.name,
        dataUrl: String(reader.result ?? ""),
        size: file.size,
        type: file.type,
      });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <motion.div
        whileHover={{ scale: 1.01 }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-center transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/[0.06]",
          compact ? "px-4 py-4" : "px-6 py-8",
          dragging && "border-cyan-400/70 bg-cyan-500/10",
        )}
      >
        <motion.div
          animate={{ y: dragging ? -4 : [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-violet-200"
        >
          <UploadCloud className="h-5 w-5" />
        </motion.div>
        <p className="text-sm font-medium text-slate-200">{title}</p>
        <p className="text-[11px] text-slate-500">{subtitle}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </motion.div>
      {error ? <p className="text-[11px] text-rose-300">{error}</p> : null}
    </div>
  );
}

export function RepeatableItem({
  title,
  subtitle,
  onRemove,
  children,
  index,
}: {
  title: string;
  subtitle?: string;
  onRemove: () => void;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -24, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className="glass-soft relative rounded-2xl p-4 transition-colors duration-300 hover:border-white/20 sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/15 text-[11px] font-semibold text-violet-200">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-100">{title}</p>
            {subtitle ? <p className="text-[11px] text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-white/10 p-1.5 text-slate-400 transition hover:border-rose-400/40 hover:bg-rose-500/15 hover:text-rose-200"
          aria-label="Remove entry"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {children}
    </motion.div>
  );
}

export function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-6 text-center text-[13px] text-slate-500">
      {text}
    </div>
  );
}
