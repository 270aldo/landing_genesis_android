"use client";

import { motion } from "framer-motion";
import { TOKENS, PERFORMANCE_GRID } from "@/lib/tokens";
import Image from "next/image";

const ITEMS = [
    {
        id: "engine",
        colSpan: "md:col-span-2",
        img: "/assets/fitness/rower.png",
        data: PERFORMANCE_GRID.engine,
    },
    {
        id: "mind",
        colSpan: "md:col-span-1",
        img: "/assets/fitness/mind.png", // Using atmosphere for mind/environment
        data: PERFORMANCE_GRID.mind,
    },
    {
        id: "fuel",
        colSpan: "md:col-span-3",
        img: "/assets/fitness/fuel.png",
        data: PERFORMANCE_GRID.fuel,
    },
];

export default function PerformanceGrid() {
    return (
        <div className="vite-section vite-frame bg-black relative overflow-hidden py-24 md:py-32">
            {/* Background Ambient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vite/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-content mx-auto px-6 md:px-10">
                <div className="mb-12 md:mb-16">
                    <p className="font-mono text-vite text-xs tracking-[0.2em] mb-4">SYSTEM_STATUS_VISUALIZATION</p>
                    <h2 className="vite-h2 text-white">THE PERFORMANCE GRID</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">
                    {ITEMS.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className={`relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${item.colSpan}`}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={item.img}
                                    alt={item.data.label}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            </div>

                            {/* UI Overlay */}
                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                {/* HUD Elements */}
                                <div className="absolute top-6 right-6 font-mono text-[10px] text-white/40 tracking-widest border border-white/20 px-2 py-1 rounded">
                                    {item.data.label}_0{index + 1}
                                </div>

                                <div className="max-w-md relative z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="font-mono text-vite text-xs mb-2 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-vite rounded-full animate-pulse" />
                                        {item.data.stat}
                                    </p>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                                        {item.data.desc}
                                    </h3>
                                </div>
                            </div>

                            {/* Decorative Crosshairs */}
                            <div className="absolute top-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-2 h-2 border-l border-t border-white/50" />
                            </div>
                            <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-2 h-2 border-r border-b border-white/50" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
