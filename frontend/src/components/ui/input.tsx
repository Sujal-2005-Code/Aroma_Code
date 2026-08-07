"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const inputBase =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none transition-all duration-300 hover:border-white/20 focus:border-violet-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-violet-500/25 disabled:opacity-50 [color-scheme:dark]";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(inputBase, "h-11", className)} suppressHydrationWarning {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(inputBase, "min-h-[110px] resize-y leading-relaxed", className)} suppressHydrationWarning {...props} />
));
Textarea.displayName = "Textarea";

export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      inputBase,
      "h-11 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 stroke=%22%23a78bfa%22 stroke-width=%222%22 viewBox=%220 0 24 24%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px_18px] bg-[right_0.75rem_center] bg-no-repeat pr-10",
      className,
    )}
    suppressHydrationWarning
    {...props}
  >
    {children}
  </select>
));
NativeSelect.displayName = "NativeSelect";
