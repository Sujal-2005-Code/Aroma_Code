"use client";

import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Benefits } from "@/components/landing/benefits";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/layout/footer";
import {getQuestions} from "@/lib/api/questions";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
  
}
