import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";



export const metadata: Metadata = {
  title: "AROMA – AI Powered Talent Intelligence Platform",
  description: "Bridge the gap between students and recruiters with AI-powered skill verification, career mentoring, and smart hiring tools.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
      </body>
    </html>
  );
}