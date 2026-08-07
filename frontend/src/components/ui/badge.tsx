"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-orange/10 text-brand-orange border border-brand-orange/20",
        secondary: "bg-glass text-text-muted border border-border-subtle",
        success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        danger: "bg-red-500/10 text-red-400 border border-red-500/20",
        pink: "bg-brand-pink/10 text-brand-pink border border-brand-pink/20",
        violet: "border-violet-400/30 bg-violet-500/12 text-violet-200",
        cyan: "border-cyan-400/30 bg-cyan-500/12 text-cyan-200",
        emerald: "border-emerald-400/30 bg-emerald-500/12 text-emerald-200",
        amber: "border-amber-400/30 bg-amber-500/12 text-amber-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
