"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Sparkles } from "lucide-react";
import { faqItems } from "@/mock-data";

function useTypewriter(text: string, speed = 16) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    if (!text) return;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, speed);

    return () => window.clearInterval(timer);
  }, [text, speed]);

  return typed;
}

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = faqItems[activeIndex] ?? faqItems[0];
  const typedAnswer = useTypewriter(activeItem.a, 14);

  const progress = useMemo(() => ((activeIndex + 1) / faqItems.length) * 100, [activeIndex]);

  return (
    <section className="faq-section relative overflow-hidden py-24 text-white">
      <style>{css}</style>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-[#ff7a2e]/14 blur-[120px]"
        animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-28 h-64 w-64 rounded-full bg-[#8b5cf6]/10 blur-[120px]"
        animate={{ y: [0, -16, 0], opacity: [0.16, 0.28, 0.16] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-[#FFB07C] backdrop-blur-xl">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ Reader
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Frequently asked <span className="bg-gradient-to-r from-[#FF8A1A] via-[#F61E66] to-[#FF4D7D] bg-clip-text text-transparent">questions</span>
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[#95A3BA] sm:text-[16px]">
            Tap a question to open a premium reading panel with a smooth typewriter reveal.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="faq-shell relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,120,60,0.05))] opacity-80" />
              <div className="relative z-10 mb-4 flex items-center justify-between px-2 pt-1">
                <div className="text-sm font-semibold text-white">Choose a question</div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] text-[#8B99B0]">
                  <Sparkles className="h-3 w-3 text-[#FFB07C]" />
                  Reader mode
                </div>
              </div>

              <div className="relative z-10 space-y-3">
                {faqItems.map((item, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <motion.button
                      key={item.q}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06, duration: 0.45 }}
                      whileHover={{ x: 6, scale: 1.01 }}
                      className={`faq-question group relative w-full overflow-hidden rounded-[22px] border px-4 py-4 text-left transition-all duration-300 ${
                        isActive
                          ? "border-[#ff7b3a]/35 bg-[linear-gradient(180deg,#1b2438,#22263d)] shadow-[0_0_38px_rgba(255,120,50,.18)]"
                          : "border-white/8 bg-[#181f30] hover:border-[#ff7b3a]/20 hover:bg-[linear-gradient(180deg,#1b2438,#22263d)]"
                      }`}
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(circle at var(--x,50%) var(--y,50%), rgba(255,255,255,.1), transparent 45%)" }} />
                      <div className="relative z-10 flex items-center gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isActive ? "border-[#ff7b3a]/30 bg-[#ff7b3a]/15 text-[#ffb07c]" : "border-white/10 bg-white/[0.05] text-[#8B99B0]"}`}>
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-[14px] font-semibold tracking-[-0.01em] ${isActive ? "text-white" : "text-[#E9EEF7]"}`}>
                            {item.q}
                          </div>
                          <div className={`mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05] ${isActive ? "opacity-100" : "opacity-50"}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: isActive ? "100%" : "16%" }}
                              transition={{ duration: 0.35 }}
                              className="h-full rounded-full bg-gradient-to-r from-[#ff8a1a] via-[#f61e66] to-[#a855f7]"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="faq-reader relative h-full overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,120,60,0.08))] opacity-90" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#ff7b3a] to-transparent opacity-60" />
              <div className="pointer-events-none absolute -left-20 top-0 h-44 w-44 rounded-full bg-[#ff7a2e]/15 blur-[80px]" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#ff7b3a]/20 bg-[#ff7b3a]/10 px-3 py-1 text-[11px] font-medium text-[#ffb07c]">
                    <Sparkles className="h-3 w-3" />
                    Answer reader
                  </div>
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
                    {activeItem.q}
                  </h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] text-[#8B99B0]">
                  {String(activeIndex + 1).padStart(2, "0")} / {faqItems.length.toString().padStart(2, "0")}
                </div>
              </div>

              <div className="relative z-10 mt-6 rounded-[26px] border border-white/10 bg-[#111827]/75 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="mb-4 flex items-center gap-2 text-[12px] text-[#8B99B0]">
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                  />
                  Live answer feed
                </div>

                <p className="whitespace-pre-line text-[15px] leading-8 text-[#C8D2E2] sm:text-[16px]">
                  {typedAnswer}
                  <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#ff7b3a]" />
                </p>
              </div>

              <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-3">
                <InfoChip label="Scroll reveal" value="Premium" />
                <InfoChip label="Typewriter" value="Smooth" />
                <InfoChip label="Motion" value="Polished" />
              </div>

              <div className="relative z-10 mt-6 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-[12px] text-[#8B99B0]">
                <span>Browse answers like a premium product reader.</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
                  className="text-[#ffb07c]"
                >
                  →
                </motion.div>
              </div>

              <div className="relative z-10 mt-6 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  key={activeIndex}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#ff8a1a] via-[#f61e66] to-[#a855f7]"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-3 text-center">
      <div className="text-[11px] text-[#8B99B0]">{label}</div>
      <div className="mt-1 text-[13px] font-semibold text-white">{value}</div>
    </div>
  );
}

const css = `
.faq-section {
  background: #0b1120;
}

.faq-shell,
.faq-reader,
.faq-question {
  transition: border-color .35s ease, background .35s ease, box-shadow .35s ease, transform .35s ease;
}

.faq-question:hover {
  border-color: #ff7b3a;
  background: linear-gradient(180deg, #1b2438, #22263d);
}

.faq-question::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 22px;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,.12), transparent 45%);
  opacity: 0;
  transition: opacity .3s ease;
}

.faq-question:hover::before {
  opacity: 1;
}

.faq-reader::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 30px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,138,26,.7), rgba(246,30,102,.45), rgba(168,85,247,.55));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: .22;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .faq-reader,
  .faq-question {
    animation: none !important;
    transition: none !important;
  }
}
`;
