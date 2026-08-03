"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pricingPlans } from "@/mock-data";

export function Pricing() {
  const [activeIndex, setActiveIndex] = useState<number | null>(1);

  return (
    <section id="pricing" className="pricing-section relative overflow-hidden py-24 text-white">
      <style>{css}</style>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-[#ff7a2e]/18 blur-[120px]"
        animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.34, 0.18] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-32 h-64 w-64 rounded-full bg-[#8b5cf6]/12 blur-[120px]"
        animate={{ y: [0, -14, 0], opacity: [0.18, 0.28, 0.18] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-15 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium text-[#FFB07C] backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            Pricing
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            Simple, transparent <span className="bg-gradient-to-r from-[#FF8A1A] via-[#F61E66] to-[#FF4D7D] bg-clip-text text-transparent">pricing</span>
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[#95A3BA] sm:text-[16px]">
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3 lg:gap-7">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={index}
              isActive={activeIndex === index}
              isDimmed={activeIndex !== null && activeIndex !== index}
              onActivate={() => setActiveIndex(index)}
              onDeactivate={() => setActiveIndex(1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  plan,
  index,
  isActive,
  isDimmed,
  onActivate,
  onDeactivate,
}: {
  plan: (typeof pricingPlans)[number];
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const initials = useMemo(() => plan.name.slice(0, 1), [plan.name]);

  return (
    <motion.div
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      animate={{
        scale: isActive ? 1.015 : isDimmed ? 0.985 : 1,
        opacity: isDimmed ? 0.86 : 1,
        y: plan.popular && isActive ? -3 : 0,
      }}
      transition={{ type: "spring", stiffness: 180, damping: 24 }}
      className={`relative ${plan.popular ? "z-20" : "z-10"}`}
    >
      <div className={`pricing-glow ${plan.popular ? "pricing-glow-popular" : ""}`} aria-hidden="true" />
      <Card
        gradient={plan.popular}
        className={`pricing-card group relative h-full overflow-hidden rounded-[28px] border border-white/8 bg-[#181f30] p-6 shadow-[0_18px_60px_rgba(2,6,23,0.24)] backdrop-blur-xl ${plan.popular ? "ring-1 ring-[#ff7b3a]/30" : ""}`}
      >
        {plan.popular && (
          <motion.div
            animate={{ y: [0, -2, 0], opacity: [0.92, 1, 0.92] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="absolute -top-3 left-1/2 -translate-x-1/2"
          >
            <Badge className="border border-[#ff7b3a]/30 bg-[#ff7b3a]/10 text-[#ffb07c] shadow-[0_0_22px_rgba(255,123,58,0.22)]">
              <Sparkles className="mr-1 h-3 w-3" />
              Most Popular
            </Badge>
          </motion.div>
        )}

        <div className="pointer-events-none absolute -left-[120%] top-0 h-full w-[60%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)] opacity-0 transition-all duration-700 group-hover:left-[140%] group-hover:opacity-100" />

        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-sm font-bold text-[#FFB07C] ring-1 ring-white/10">
              {initials}
            </div>
          </div>

          <div className="mb-7 flex items-baseline gap-1">
            <h1 className="text-5xl font-black tracking-[-0.05em] text-text-primary transition-colors duration-300 group-hover:text-white">
              {plan.price}
            </h1>
            <span className="text-sm text-text-muted">/{plan.period}</span>
          </div>

          <ul className="space-y-3.5 mb-8">
            {plan.features.map((feature, featureIndex) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: featureIndex * 0.08 }}
                className="flex items-start gap-2.5"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400 transition-transform duration-300 group-hover:translate-x-0.5">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm text-text-muted">{feature}</span>
              </motion.li>
            ))}
          </ul>

          <Button
            variant={plan.popular ? "default" : "outline"}
            className={`w-full rounded-full py-6 text-sm font-semibold transition-all duration-300 ${
              plan.popular
                ? "border-0 bg-gradient-to-r from-[#ff8a1a] via-[#f61e66] to-[#ff4d7d] text-white shadow-[0_14px_30px_rgba(255,91,58,0.28)] hover:shadow-[0_16px_34px_rgba(255,91,58,0.34)]"
                : "border border-white/10 bg-white/[0.06] text-white hover:border-white/16 hover:bg-[linear-gradient(180deg,#1b2438,#20273d)] hover:shadow-[0_10px_24px_rgba(255,120,50,.16)]"
            }`}
          >
            {plan.popular ? "Start Free →" : plan.cta}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

const css = `
.pricing-section {
  background: #0b1120;
}

.pricing-card {
  background: #181f30;
  transition: border-color .35s ease, background .35s ease, box-shadow .35s ease, transform .35s ease;
}

.pricing-card:hover {
  border-color: rgba(255, 123, 58, 0.45);
  background: linear-gradient(180deg, #1a2235, #20283d);
  transform: translateY(-2px);
}

.pricing-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 28px;
  background: radial-gradient(circle at 50% 0%, rgba(255,255,255,.08), transparent 40%);
  opacity: .6;
  pointer-events: none;
}

.pricing-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(255,138,26,.18), rgba(246,30,102,.1), rgba(168,85,247,.12));
  opacity: 0;
  transition: opacity .35s ease;
  pointer-events: none;
}

.pricing-card:hover::after {
  opacity: .45;
}

.pricing-glow {
  position: absolute;
  inset: -20px;
  border-radius: 36px;
  background: linear-gradient(90deg, rgba(255,138,26,.22), rgba(246,30,102,.16), rgba(168,85,247,.2));
  filter: blur(44px);
  opacity: 0;
  transition: opacity .4s ease;
  pointer-events: none;
}

.pricing-card:hover + .pricing-glow,
.pricing-glow:hover {
  opacity: .2;
}

.pricing-glow-popular {
  opacity: .22;
}

@media (prefers-reduced-motion: reduce) {
  .pricing-card,
  .pricing-glow {
    transition: none !important;
    animation: none !important;
  }
}
`;
