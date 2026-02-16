"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AUDIO_ASSETS, AUDIO_CONFIG } from "@/lib/tokens";

interface GenesisAudioProps {
    active: boolean;
    currentSection: string | null;
}

export default function GenesisAudio({ active, currentSection }: GenesisAudioProps) {
    const [muted, setMuted] = useState(true);
    const [userInteracted, setUserInteracted] = useState(false);

    // Refs for audio elements - defined as distinct HTMLAudioElements to mix tracks
    const ambienceRef = useRef<HTMLAudioElement | null>(null);
    // Using a map to manage narrative tracks might be better, but single ref is simpler for linear scroll
    const narrativeRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio Objects
    useEffect(() => {
        // 1. Ambience Layer
        if (!ambienceRef.current) {
            ambienceRef.current = new Audio(AUDIO_ASSETS.ambience);
            ambienceRef.current.loop = true;
            ambienceRef.current.volume = 0;
        }

        // 2. Narrative Layer
        if (!narrativeRef.current) {
            narrativeRef.current = new Audio();
            narrativeRef.current.volume = 0;
        }

        return () => {
            if (ambienceRef.current) {
                ambienceRef.current.pause();
                ambienceRef.current = null;
            }
            if (narrativeRef.current) {
                narrativeRef.current.pause();
                narrativeRef.current = null;
            }
        };
    }, []);

    // MASTER TOGGLE: Mute/Unmute Logic
    const toggleMute = () => {
        // If first interaction, mark it so browsers allow auto-play
        if (!userInteracted) setUserInteracted(true);
        setMuted(!muted);
    };

    // AMBIENCE CONTROLLER
    useEffect(() => {
        const amb = ambienceRef.current;
        if (!amb) return;

        if (active && userInteracted && !muted) {
            // Play Request
            const playPromise = amb.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => fadeIn(amb, AUDIO_CONFIG.bgVolume))
                    .catch(e => console.warn("Ambience play failed:", e));
            }
        } else {
            // Pause Request
            fadeOut(amb, () => amb.pause());
        }
    }, [active, muted, userInteracted]);

    // NARRATIVE CONTROLLER (Reacts to Section Change)
    useEffect(() => {
        // Only proceed if system is active, unmuted, and initialized
        if (!active || !userInteracted || muted || !narrativeRef.current) return;

        // Determine target track based on section
        // Safe lookup: check if currentSection is a key in AUDIO_ASSETS
        const targetSrc = currentSection && (currentSection in AUDIO_ASSETS)
            ? AUDIO_ASSETS[currentSection as keyof typeof AUDIO_ASSETS]
            : null;

        const nar = narrativeRef.current;

        if (targetSrc) {
            // If we are already playing this track, ensure volume is up but don't restart
            // However, standard HTML5 Audio src checking is safer:
            // Note: .src property resolves to absolute URL, so strictly comparing relative path might fail.
            // We use a simpler check: if we are supposed to play X, and we are not playing X, switch.

            const isSameTrack = nar.src.includes(targetSrc);

            if (!isSameTrack || nar.paused) {
                // FADE OUT OLD, THEN SWAP
                fadeOut(nar, () => {
                    nar.src = targetSrc;
                    nar.load();
                    const p = nar.play();
                    if (p) {
                        p.then(() => fadeIn(nar, AUDIO_CONFIG.voiceVolume))
                            .catch(e => console.warn("Narrative play failed", e));
                    }
                });
            }
        } else {
            // Entered a silent section? Fade out narrative.
            fadeOut(nar, () => nar.pause());
        }

    }, [currentSection, active, userInteracted, muted]);


    // --- AUDIO UTILITIES ---

    // Simple linear fade-in
    const fadeIn = (audio: HTMLAudioElement, targetVol: number) => {
        // Clear any existing fade-out intervals attached to this element? 
        // In a robust engine, we'd track interval IDs. 
        // For this implementation, we will perform a quick ramp.
        let vol = audio.volume;
        const step = 0.05; // 5% per tick

        const fade = setInterval(() => {
            vol = Math.min(vol + step, targetVol);
            audio.volume = vol;
            if (vol >= targetVol) clearInterval(fade);
        }, 100);
        // Store interval ID active on this audio? 
        // Risk: fast switching might create competing intervals.
        // Mitigation: We assume slow user scroll behavior for "Cinematic" feel.
    };

    // Simple linear fade-out
    const fadeOut = (audio: HTMLAudioElement, onComplete?: () => void) => {
        let vol = audio.volume;
        const step = 0.1; // Faster fade out

        const fade = setInterval(() => {
            vol = Math.max(0, vol - step);
            audio.volume = vol;
            if (vol <= 0) {
                clearInterval(fade);
                if (onComplete) onComplete();
            }
        }, 100);
    };


    return (
        <div className="fixed bottom-6 left-6 z-50 mix-blend-difference">
            <button
                onClick={toggleMute}
                className="group flex items-center gap-3 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer"
            >
                <div className="relative w-4 h-4 flex items-center justify-center">
                    {muted ? (
                        <div className="w-full h-px bg-white rotate-45" />
                    ) : (
                        <div className="flex gap-0.5 items-end justify-center w-full h-full">
                            <motion.div
                                animate={{ height: ["20%", "100%", "20%"] }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                className="w-1 bg-vite rounded-full"
                            />
                            <motion.div
                                animate={{ height: ["40%", "80%", "40%"] }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear", delay: 0.2 }}
                                className="w-1 bg-vite rounded-full"
                            />
                            <motion.div
                                animate={{ height: ["30%", "60%", "30%"] }}
                                transition={{ repeat: Infinity, duration: 1.0, ease: "linear", delay: 0.1 }}
                                className="w-1 bg-vite rounded-full"
                            />
                        </div>
                    )}
                </div>
                <span className="font-mono text-[10px] tracking-widest text-white/50 group-hover:text-white transition-colors">
                    {muted ? "SOUND OFF" : "GENESIS_OS"}
                </span>
            </button>
        </div>
    );
}
