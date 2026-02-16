"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TOKENS, SOCIAL_PROOF_SECTION } from "@/lib/tokens";

export default function SocialProof() {
  return (
    <div
      className="vite-section vite-frame relative overflow-hidden"
      style={{ background: TOKENS.bgPrimary }}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-28">
        <p className="vite-label text-white/40 mb-5">
          {SOCIAL_PROOF_SECTION.label}
        </p>
        <h2
          className="vite-h2 text-white mb-12"
          style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
        >
          {SOCIAL_PROOF_SECTION.h}
        </h2>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOCIAL_PROOF_SECTION.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              className="liquid-card p-8 rounded-2xl flex flex-col"
            >
              <Quote
                size={20}
                className="text-vite/40 mb-4"
                strokeWidth={1.5}
              />
              <p className="text-white/80 text-sm md:text-base leading-relaxed italic flex-grow">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="font-mono text-white text-sm">
                  {testimonial.name}, {testimonial.age} años
                </p>
                <p className="font-mono text-white/40 text-xs">
                  {testimonial.city}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
        >
          {SOCIAL_PROOF_SECTION.metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="font-mono text-2xl md:text-3xl text-vite font-bold">
                {metric.value}
              </p>
              <p className="font-mono text-xs text-white/40 mt-1 tracking-widest uppercase">
                {metric.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
