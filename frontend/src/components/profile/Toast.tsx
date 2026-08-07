"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  variant: "success" | "info" | "warning" | "danger";
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const variantStyles: Record<ToastMessage["variant"], string> = {
  success: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  info: "border-sky-400/20 bg-sky-500/10 text-sky-200",
  warning: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  danger: "border-rose-400/20 bg-rose-500/10 text-rose-200",
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className={cn(
            "pointer-events-auto overflow-hidden rounded-3xl border p-4 shadow-[0_24px_80px_rgba(2,6,23,0.22)] backdrop-blur-xl",
            variantStyles[toast.variant]
          )}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-2xl bg-white/10 p-2 text-current">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">{toast.title}</p>
              <p className="mt-1 text-sm text-slate-300">{toast.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-slate-300 hover:text-white"
              onClick={() => onDismiss(toast.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
