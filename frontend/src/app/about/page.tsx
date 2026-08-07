import Link from "next/link";
import { ArrowRight } from "lucide-react";
import asset from "@/lib/asset";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="pt-24 pb-16">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-3 py-1 text-sm font-medium text-brand-orange">
                <span className="h-2 w-2 rounded-full bg-brand-orange" />
                About AROMA
              </div>

              <h1 className="text-4xl font-black tracking-[-0.02em] text-text-primary sm:text-5xl lg:text-6xl">
                AI-powered talent intelligence for smarter careers.
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-text-muted">
                <span className="font-semibold text-text-primary">AROMA</span> is an AI-powered Talent Intelligence Platform that transforms resumes into verified digital talent profiles. Discover skills, validate achievements, showcase projects, and connect students with recruiters through AI-driven matching, analytics, and trusted skill verification—making hiring faster, smarter, and based on proven capabilities.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-strong rounded-[2rem] p-2 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="overflow-hidden rounded-[1.5rem] bg-bg-surface/90 p-2">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={asset("/assets/aroma-logo.png")}
                  className="w-full rounded-[1.25rem] object-cover shadow-2xl"
                >
                  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
