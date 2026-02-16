"use client";

import { motion } from "framer-motion";
import { Check, X as XIcon } from "lucide-react";
import { TOKENS, PRICING_SECTION } from "@/lib/tokens";

interface PricingContextProps {
  onCtaClick?: () => void;
}

export default function PricingContext({ onCtaClick }: PricingContextProps) {
  return (
    <div
      className="vite-section vite-frame relative overflow-hidden"
      style={{ background: TOKENS.bg }}
    >
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-vite/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-28 relative z-10">
        <p className="vite-label text-white/40 mb-5">{PRICING_SECTION.label}</p>
        <h2
          className="vite-h2 text-white mb-4"
          style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
        >
          {PRICING_SECTION.h}
        </h2>
        <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mb-12">
          {PRICING_SECTION.body}
        </p>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Without */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="liquid-card p-8 rounded-2xl border-white/10"
          >
            <p className="font-mono text-sm text-white/40 tracking-widest uppercase mb-6">
              {PRICING_SECTION.comparison.without.title}
            </p>
            <div className="space-y-4">
              {PRICING_SECTION.comparison.without.items.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <XIcon
                    size={16}
                    className="text-red-400/60 flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <p className="text-white/50 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* With NGX */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="liquid-card p-8 rounded-2xl border-vite/30 relative overflow-hidden"
          >
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-vite/5 pointer-events-none" />

            <p className="font-mono text-sm text-vite tracking-widest uppercase mb-6 relative z-10">
              {PRICING_SECTION.comparison.with.title}
            </p>
            <div className="space-y-4 relative z-10">
              {PRICING_SECTION.comparison.with.items.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check
                    size={16}
                    className="text-vite flex-shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <p className="text-white/80 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={onCtaClick}
            className="btn-glow font-mono font-bold text-xs md:text-sm text-white px-8 py-3 rounded-full tracking-widest transition-all hover:scale-105 active:scale-95"
          >
            {PRICING_SECTION.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
