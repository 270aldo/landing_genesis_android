"use client";

import { motion } from "framer-motion";
import { TOKENS, USER_JOURNEY_SECTION } from "@/lib/tokens";
import Image from "next/image";
import { Play } from "lucide-react";

export default function PerformanceGrid() {
    return (
        <div
            className="vite-section vite-frame relative overflow-hidden py-24 md:py-32"
            style={{ background: TOKENS.bg }}
        >
            {/* Background Ambient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vite/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-content mx-auto px-6 md:px-10">
                {/* Header */}
                <div className="mb-12 md:mb-16">
                    <p className="font-mono text-vite text-xs tracking-[0.2em] mb-4">
                        {USER_JOURNEY_SECTION.label}
                    </p>
                    <h2
                        className="vite-h2 text-white"
                        style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
                    >
                        {USER_JOURNEY_SECTION.title}
                    </h2>
                    <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mt-4">
                        {USER_JOURNEY_SECTION.subtitle}
                    </p>
                </div>

                {/* 2-Column Layout: Video + Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    {/* Left: Cinematic Video Player Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative group"
                    >
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                            {/* Video Placeholder Image */}
                            <Image
                                src="/assets/performance_video_placeholder.png"
                                alt="Genesis Metabolic Dashboard"
                                fill
                                className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                            />

                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-vite/20 backdrop-blur-sm border border-vite/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-vite/30 transition-all duration-300 cursor-pointer">
                                    <Play
                                        size={28}
                                        className="text-white ml-1"
                                        fill="white"
                                        strokeWidth={0}
                                    />
                                </div>
                            </div>

                            {/* Blueprint Corners */}
                            <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-white/30" />
                            <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-white/30" />
                            <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-white/30" />
                            <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-white/30" />

                            {/* Scan Line */}
                            <div
                                className="absolute left-0 right-0 h-px bg-vite/30 pointer-events-none"
                                style={{
                                    animation: "scanMove 4s linear infinite",
                                }}
                            />

                            {/* HUD Label */}
                            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/50 tracking-widest">
                                GENESIS_PROTOCOL_V2.4
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Vertical Progress Steps */}
                    <div className="flex flex-col gap-6">
                        {USER_JOURNEY_SECTION.steps.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                className="group flex gap-5 items-start"
                            >
                                {/* Step Number */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-vite/10 border border-vite/20 flex items-center justify-center font-mono text-vite text-sm font-bold group-hover:bg-vite/20 group-hover:border-vite/40 transition-all duration-300">
                                    {step.step}
                                </div>

                                {/* Step Content */}
                                <div>
                                    <h3 className="font-mono text-white text-base md:text-lg font-semibold mb-1 group-hover:text-vite transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-white/60 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Responsibility Note */}
                        <div className="mt-4 p-4 rounded-xl bg-vite/5 border border-vite/15">
                            <p className="font-mono text-xs text-vite/80 leading-relaxed">
                                {USER_JOURNEY_SECTION.responsibilityNote}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
