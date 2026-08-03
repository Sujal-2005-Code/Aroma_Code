"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin, Sparkles, Send, ShieldCheck, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden px-4 py-20 sm:scroll-mt-28 sm:px-6 sm:py-24 lg:scroll-mt-32 lg:px-12 lg:py-28">
      <style>{css}</style>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-[#ff7a2e]/16 blur-[120px]"
        animate={{ scale: [1, 1.16, 1], opacity: [0.2, 0.34, 0.2] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-[#8b5cf6]/12 blur-[120px]"
        animate={{ y: [0, -16, 0], opacity: [0.18, 0.28, 0.18] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-[#FFB07C] backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            Contact
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Let’s connect and build your next <span className="bg-gradient-to-r from-[#FF8A1A] via-[#F61E66] to-[#FF4D7D] bg-clip-text text-transparent">opportunity</span>
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[#95A3BA] sm:text-[16px]">
            Whether you are a student, recruiter, or partner, AROMA is here to help you unlock smarter hiring and career growth.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="contact-shell relative h-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl sm:p-7">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,120,60,0.04))] opacity-80" />
              <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-[#ff7a2e]/12 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-10 right-0 h-56 w-56 rounded-full bg-[#8b5cf6]/10 blur-[100px]" />

              <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#ff7b3a]/20 bg-[#ff7b3a]/10 px-3 py-1 text-[11px] font-medium text-[#ffb07c]">
                    <ShieldCheck className="h-3 w-3" />
                    Secure & responsive
                  </div>
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                    Start a conversation.
                  </h3>
                </div>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] text-[#8B99B0]"
                >
                  Premium reply
                </motion.div>
              </div>

              <div className="relative z-10 mt-6 space-y-4">
                <ContactField label="Your name" placeholder="Enter your full name" />
                <ContactField label="Email" placeholder="name@example.com" type="email" />
                <ContactField label="Subject" placeholder="What would you like to talk about?" />
                <ContactField label="Message" placeholder="Tell us a little more..." multiline />
              </div>

              <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3 text-[11px] text-[#8B99B0]">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <Clock3 className="h-3 w-3 text-[#FFB07C]" />
                  Avg reply: 24 hours
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-300" />
                  Privacy first
                </span>
              </div>

              <div className="relative z-10 mt-7 flex flex-wrap gap-3">
                <Link href="/auth/register" className="w-full sm:w-auto">
                  <Button className="group w-full rounded-full bg-gradient-to-r from-[#FF8A1A] via-[#F61E66] to-[#FF4D7D] px-6 py-6 text-[14px] font-semibold text-white shadow-[0_14px_34px_rgba(255,90,138,0.34)] transition-transform hover:scale-[1.03] sm:w-auto">
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Button variant="outline" className="w-full rounded-full border-white/10 bg-white/[0.06] px-6 py-6 text-[14px] font-semibold text-white hover:border-[#ff7b3a] hover:bg-[linear-gradient(180deg,#1b2438,#22263d)] sm:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="contact-shell relative h-full overflow-hidden rounded-[32px] border border-white/10 bg-[#181f30] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl sm:p-7">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,120,60,0.06))] opacity-90" />
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ff7b3a] to-transparent opacity-50" />

              <div className="relative z-10 space-y-4">
                <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff7b3a]/30 hover:bg-[linear-gradient(180deg,#1b2438,#22263d)] hover:shadow-[0_0_40px_rgba(255,120,50,.18)]">
                  <ContactRow icon={<Mail className="h-5 w-5 text-[#FFB07C]" />} title="Email" value="support@aroma.ai" />
                </div>
                <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff7b3a]/30 hover:bg-[linear-gradient(180deg,#1b2438,#22263d)] hover:shadow-[0_0_40px_rgba(255,120,50,.18)]">
                  <ContactRow icon={<Phone className="h-5 w-5 text-[#FFB07C]" />} title="Phone" value="+91 98765 43210" />
                </div>
                <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ff7b3a]/30 hover:bg-[linear-gradient(180deg,#1b2438,#22263d)] hover:shadow-[0_0_40px_rgba(255,120,50,.18)]">
                  <ContactRow icon={<MapPin className="h-5 w-5 text-[#FFB07C]" />} title="Office" value="Mumbai, India" />
                </div>
              </div>

              <div className="relative z-10 mt-6 rounded-[28px] border border-white/10 bg-[#111827]/75 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">Why users trust us</div>
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="text-[#ffb07c]">
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatPill label="Fast response" value="24h" />
                  <StatPill label="Support" value="24/7" />
                  <StatPill label="Coverage" value="Global" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactField({ label, placeholder, type = "text", multiline = false }: { label: string; placeholder: string; type?: string; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-medium text-[#8B99B0]">{label}</span>
      {multiline ? (
        <textarea
          rows={5}
          placeholder={placeholder}
          className="contact-input min-h-[140px] w-full resize-none rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-4 text-sm text-white outline-none placeholder:text-[#66748d] focus:border-[#ff7b3a]/40"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="contact-input w-full rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-4 text-sm text-white outline-none placeholder:text-[#66748d] focus:border-[#ff7b3a]/40"
        />
      )}
    </label>
  );
}

function ContactRow({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/[0.06] p-3">{icon}</div>
      <div>
        <p className="font-semibold text-text-primary">{title}</p>
        <p className="text-sm text-text-muted">{value}</p>
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-center">
      <div className="text-[11px] text-[#8B99B0]">{label}</div>
      <div className="mt-1 text-[13px] font-semibold text-white">{value}</div>
    </div>
  );
}

const css = `
.contact-shell {
  transition: transform .35s ease, border-color .35s ease, box-shadow .35s ease, background .35s ease;
}

.contact-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 32px;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,.12), transparent 45%);
  opacity: .9;
  pointer-events: none;
}

.contact-input {
  transition: border-color .3s ease, background .3s ease, box-shadow .3s ease, transform .3s ease;
}

.contact-input:focus {
  box-shadow: 0 0 0 4px rgba(255, 123, 58, 0.12);
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .contact-shell,
  .contact-input {
    transition: none !important;
    animation: none !important;
  }
}
`;
