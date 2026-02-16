"use client";

import { motion } from "framer-motion";
import { TOKENS, PERFORMANCE_GRID } from "@/lib/tokens";

export default function PerformanceGrid() {
    return (
        <div
            className="vite-section vite-frame relative overflow-hidden py-24 md:py-32"
            style={{ background: TOKENS.bg }}
        >
            <div className="max-w-content mx-auto px-6 md:px-10">
                <div className="aspect-ratio-video mb-12">
                    {/* Placeholder for potential 3D model or graphic */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(PERFORMANCE_GRID).map(([key, data], index) => {
                        // Type assertion for data since Object.entries can be loose
                        const item = data as { label: string; stat: string; desc: string };
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="glass-card relative overflow-hidden group hover:border-vite/50 transition-colors duration-300"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 bg-vite rounded-full shadow-[0_0_10px_#6d00ff]" />
                                </div>

                                <h3 className="font-mono text-xs md:text-sm text-vite tracking-[0.2em] mb-4">
                                    {item.label}
                                </h3>
                                <p className="vite-h3 text-white mb-4 text-2xl md:text-3xl">
                                    {item.stat.replace(/_/g, " ")}
                                </p>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
