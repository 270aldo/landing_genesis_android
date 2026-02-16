"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Dumbbell,
  HeartPulse,
  Timer,
} from "lucide-react";
import { TOKENS, FOR_WHOM_SECTION } from "@/lib/tokens";

function getProfileIcon(iconId: string) {
  const props = { size: 24, strokeWidth: 1.5, style: { color: "#6D00FF" } };
  switch (iconId) {
    case "Briefcase":
      return <Briefcase {...props} />;
    case "Dumbbell":
      return <Dumbbell {...props} />;
    case "HeartPulse":
      return <HeartPulse {...props} />;
    case "Timer":
      return <Timer {...props} />;
    default:
      return <Briefcase {...props} />;
  }
}

export default function ForWhom() {
  return (
    <div
      className="vite-section vite-frame relative overflow-hidden"
      style={{ background: TOKENS.bgPrimary }}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-28">
        <p className="vite-label text-white/40 mb-5">
          {FOR_WHOM_SECTION.label}
        </p>
        <h2
          className="vite-h2 text-white mb-4"
          style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
        >
          {FOR_WHOM_SECTION.h}
        </h2>
        <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mb-12">
          {FOR_WHOM_SECTION.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FOR_WHOM_SECTION.profiles.map((profile, index) => (
            <motion.div
              key={profile.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="liquid-card p-6 md:p-8 rounded-2xl group hover:border-vite/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-vite/10 border border-vite/20 flex items-center justify-center group-hover:bg-vite/20 transition-colors">
                  {getProfileIcon(profile.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-mono text-white text-base md:text-lg font-semibold group-hover:text-vite transition-colors">
                      {profile.title}
                    </h3>
                    <span className="font-mono text-[10px] text-white/30 tracking-widest">
                      {profile.age}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {profile.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
