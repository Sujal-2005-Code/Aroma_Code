"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function AuroraBackground({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("aurora-bg", className)}>{children}</div>;
}

export function Blob({ color = "from-purple-500 to-pink-500", className }: { color?: string; className?: string }) {
  return (
    <div
      className={cn(
        "animate-blob absolute rounded-full bg-gradient-to-r opacity-30 blur-3xl",
        color,
        className
      )}
    />
  );
}

export function GridBackground({ className }: { className?: string }) {
  return <div className={cn("absolute inset-0 grid-pattern opacity-40", className)} />;
}

export function DotBackground({ className }: { className?: string }) {
  return <div className={cn("absolute inset-0 dot-pattern opacity-50", className)} />;
}

export function GradientBorderCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("gradient-border p-[1px]", className)}>{children}</div>;
}

export function GradientText({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "blue" | "vibrant";
}) {
  const variants = {
    default: "gradient-text",
    blue: "gradient-text-blue",
    vibrant: "gradient-text-vibrant",
  };
  return <span className={cn(variants[variant], className)}>{children}</span>;
}

export function AnimatedIcon({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn("animate-bounce-slow", className)}
    >
      {children}
    </motion.div>
  );
}

export function Shimmer({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded", className)} />;
}

export function FloatingOrb({
  color = "from-purple-500 to-pink-500",
  size = "md",
  position,
  delay = 0,
}: {
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  position?: string;
  delay?: number;
}) {
  const sizes = {
    sm: "h-20 w-20",
    md: "h-40 w-40",
    lg: "h-64 w-64",
    xl: "h-96 w-96",
  };

  return (
    <div
      className={cn(
        "absolute rounded-full bg-gradient-to-br blur-3xl opacity-30 animate-float",
        color,
        sizes[size],
        position
      )}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

export function PremiumCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("card-premium rounded-2xl p-6", className)}>{children}</div>;
}

export function PremiumButton({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn("btn-premium rounded-xl px-6 py-3 font-semibold", className)} {...props}>
      {children}
    </button>
  );
}

export function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, type: "spring" }}
    >
      {value}
    </motion.span>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <motion.svg
      className={cn("text-yellow-400", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      animate={{
        rotate: [0, 360],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M12 0l3.09 8.26L24 12l-8.91 3.74L12 24l-3.09-8.26L0 12l8.91-3.74z" />
    </motion.svg>
  );
}

export function GradientDivider({ className }: { className?: string }) {
  return <div className={cn("h-px bg-gradient-to-r from-transparent via-primary to-transparent", className)} />;
}

export function GradientBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 px-3 py-1 text-sm font-medium text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="animate-marquee flex whitespace-nowrap">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}
