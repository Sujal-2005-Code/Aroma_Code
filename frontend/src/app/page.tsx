"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/layout/footer";
import {getQuestions} from "@/lib/api/questions";

const Benefits = dynamic(() => import("@/components/landing/benefits").then((mod) => mod.Benefits), {
  ssr: false,
});

const Testimonials = dynamic(() => import("@/components/landing/testimonials").then((mod) => mod.Testimonials), {
  ssr: false,
});

const Pricing = dynamic(() => import("@/components/landing/pricing").then((mod) => mod.Pricing), {
  ssr: false,
});

const FAQ = dynamic(() => import("@/components/landing/faq").then((mod) => mod.FAQ), {
  ssr: false,
});

const ContactSection = dynamic(() => import("@/components/landing/contact-section").then((mod) => mod.ContactSection), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <ContactSection />
      <Footer />
    </div>
  );
  
}
