"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
  gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, glass = true, hover = false, gradient = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-6",
        glass && "glass-card",
        hover && "hover:bg-glass-strong hover:border-brand-orange/20 transition-all duration-300 hover:-translate-y-1",
        gradient && "gradient-border",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

export { Card };
