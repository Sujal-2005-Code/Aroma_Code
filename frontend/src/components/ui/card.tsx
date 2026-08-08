"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

interface CardProps extends ComponentPropsWithoutRef<typeof motion.div> {
  glass?: boolean;
  hover?: boolean;
  gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, glass = true, hover = false, gradient = false, ...props }, ref) => {
  return (
    <motion.div
      initial={false}
      ref={ref}
      whileHover={{ scale: 1.01, y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
      className={cn(
        "premium-card border border-white/10 bg-white/10 p-6 shadow-[0_18px_55px_rgba(2,6,23,0.24)] backdrop-blur-xl",
        glass && "glass-card",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/20 hover:bg-white/[0.16] hover:shadow-[0_20px_50px_rgba(252,143,15,0.16)]",
        gradient && "gradient-border",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

export { Card };
