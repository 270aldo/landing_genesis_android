"use client";

import { motion } from "framer-motion";
import { TOKENS, PERFORMANCE_GRID } from "@/lib/tokens";
import Image from "next/image";

const IMAGES: Record<string, string> = {
    engine: "/assets/grid_engine.png",
    mind: "/assets/grid_mind.png",
    fuel: "/assets/grid_fuel.png",
};

const OVERLAYS: Record<string, string> = {
    engine: "TORQUE ANALYSIS: OPTIMAL",
    mind: "CORTISOL: REGULATED",
    fuel: "NITROGEN BALANCE: POSITIVE",
};

export default function PerformanceGrid() {
    return (
        <div
            className="vite-section vite-frame relative overflow-hidden py-24 md:py-32"
            style={{ background: TOKENS.bg }}
        >
            <div className="max-w-content mx-auto px-6 md:px-10">
                <div className="mb-12">
                    <h2 className="vite-h2 text-white mb-2" style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}>
                        The Performance Grid
                    </h2>
                    <p className="font-mono text-xs text-white/40 tracking-widest uppercase">
                        Optimización Sistémica
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(PERFORMANCE_GRID).map(([key, data], index) => {
                        const item = data as { label: string; stat: string; desc: string };
                        const imagePath = IMAGES[key] || "/assets/grid_engine.png"; // Fallback
                        const overlayText = OVERLAYS[key] || "ANALYSIS COMPLETE";

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="glass-card relative overflow-hidden group min-h-[400px] flex flex-col justify-end p-6 md:p-8"
                                style={{ borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)" }}
                            >
                                {/* Background Image */}
                                <Image
                                    src={imagePath}
                                    alt={item.label}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                                {/* HUD Overlay */}
                                <div className="absolute top-6 right-6 z-10">
                                    <div className="font-mono text-[9px] md:text-[10px] tracking-widest text-vite border border-vite/30 bg-vite/5 px-3 py-1 rounded backdrop-blur-md">
                                        {overlayText}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <h3 className="font-mono text-xs md:text-sm text-vite tracking-[0.2em] mb-3">
                                        {item.label}
                                    </h3>
                                    <p className="vite-h3 text-white mb-3 text-2xl md:text-3xl leading-none">
                                        {item.stat.replace(/_/g, " ")}
                                    </p>
                                    <div className="h-px w-12 bg-white/20 mb-3 group-hover:w-full group-hover:bg-vite/50 transition-all duration-500" />
                                    <p className="text-white/70 text-sm leading-relaxed max-w-[90%]">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
