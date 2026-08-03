import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import SmoothScroll from "@/components/layout/smooth-scroll";

export const metadata: Metadata = {
  title: "AROMA – AI Powered Talent Intelligence Platform",
  description: "Bridge the gap between students and recruiters with AI-powered skill verification, career mentoring, and smart hiring tools.",
  icons: {
    icon: "/assets/aroma-logo.png",
    shortcut: "/assets/aroma-logo.png",
    apple: "/assets/aroma-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="font-sans">
      <body className="relative isolate">
        <SmoothScroll />
        <div className="relative z-10">
          <TooltipProvider>{children}</TooltipProvider>
        </div>
      </body>
    </html>
  );
}