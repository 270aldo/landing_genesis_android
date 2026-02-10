"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AUDIO, AUDIO_CONFIG, TOKENS } from "@/lib/tokens";

interface GenesisAudioProps {
    active: boolean;
}

export default function GenesisAudio({ active }: GenesisAudioProps) {
    const [muted, setMuted] = useState(true);
    const [userInteracted, setUserInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        // We would construct the audio source here. 
        // For now, we'll placeholder it or use a simple efficient method.
        // Ideally, we fetch the blob or use a direct URL.

        // Example: If using a direct URL to a file in public/ or external
        // audioRef.current = new Audio("/path/to/audio"); 

        // Since we are waiting for the ID, we will setup the structure.
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true; // For ambience? Or voice?
            // For Genesis Voice, likely not loop. 
            // Let's assume this component manages the "Ambience" or "Main Track".
        }
    }, []);

    // Handle Play/Pause based on 'active' and 'muted' and 'userInteracted'
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (active && userInteracted && !muted) {
            // PLay with fade in?
            audio.volume = 0;
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Fade in
                    fadeIn(audio);
                }).catch(error => {
                    console.warn("Audio playback failed:", error);
                });
            }
        } else {
            // Fade out and pause
            audio.pause();
        }
    }, [active, muted, userInteracted]);

    const fadeIn = (audio: HTMLAudioElement) => {
        let vol = 0;
        const interval = 50;
        const step = interval / AUDIO_CONFIG.fadeDuration;

        const fade = setInterval(() => {
            vol += step;
            if (vol >= AUDIO_CONFIG.voiceVolume) {
                vol = AUDIO_CONFIG.voiceVolume;
                clearInterval(fade);
            }
            audio.volume = vol;
        }, interval);
    };

    const toggleMute = () => {
        setMuted(!muted);
        if (!userInteracted) setUserInteracted(true);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 mix-blend-difference">
            <button
                onClick={toggleMute}
                className="group flex items-center gap-3 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all"
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
