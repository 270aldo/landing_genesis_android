"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Play,
  RefreshCw,
} from "lucide-react";
import { TOKENS, HOW_IT_WORKS_SECTION } from "@/lib/tokens";

function getStepIcon(iconId: string) {
  const props = { size: 24, strokeWidth: 1.5, className: "text-vite" };
  switch (iconId) {
    case "ClipboardCheck":
      return <ClipboardCheck {...props} />;
    case "Play":
      return <Play {...props} />;
    case "RefreshCw":
      return <RefreshCw {...props} />;
    default:
      return <ClipboardCheck {...props} />;
  }
}

export default function HowItWorks() {
  return (
    <div
      id="comofunciona"
      className="vite-section vite-frame relative overflow-hidden"
      style={{ background: TOKENS.bg }}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vite/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-28 relative z-10">
        <p className="font-mono text-vite text-xs tracking-[0.2em] mb-5">
          {HOW_IT_WORKS_SECTION.label}
        </p>
        <h2
          className="vite-h2 text-white mb-12 md:mb-16"
          style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
        >
          {HOW_IT_WORKS_SECTION.h}
        </h2>

        {/* 3-Column Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {HOW_IT_WORKS_SECTION.steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="liquid-card p-8 rounded-2xl relative group"
            >
              {/* Step number watermark */}
              <div className="absolute top-4 right-4 font-mono text-[80px] leading-none font-bold text-white/[0.03] select-none">
                {step.step}
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-vite/10 border border-vite/20 flex items-center justify-center mb-6 group-hover:bg-vite/20 group-hover:border-vite/40 transition-all duration-300">
                  {getStepIcon(step.icon)}
                </div>

                <p className="font-mono text-vite text-xs tracking-widest mb-3">
                  PASO {step.step}
                </p>
                <h3 className="font-mono text-white text-xl font-semibold mb-4 group-hover:text-vite transition-colors">
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="font-mono text-xs text-white/40 max-w-2xl mx-auto leading-relaxed">
            {HOW_IT_WORKS_SECTION.note}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
