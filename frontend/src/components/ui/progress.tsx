"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  gradient?: boolean;
}

export function Progress({ value, max = 100, className, barClassName, showLabel, size = "md", gradient = true }: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-xs">
          <span className="text-text-muted">{value}%</span>
          <span className="text-text-muted">{max}%</span>
        </div>
      )}
      <div className={cn("w-full rounded-full bg-white/5 overflow-hidden", heights[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            gradient ? "bg-gradient-to-r from-brand-orange to-brand-pink" : "",
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
