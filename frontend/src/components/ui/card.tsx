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

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-text-muted", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
