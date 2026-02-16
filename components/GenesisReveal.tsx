"use client";

import { useRef, useState, useEffect, useCallback, useMemo, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Beef, Moon, Activity, Cpu, Brain, Accessibility, X, Calendar, MessageSquare, TrendingUp, User } from "lucide-react";
import ForWhom from "./ForWhom";
import HowItWorks from "./HowItWorks";
import SocialProof from "./SocialProof";
import PricingContext from "./PricingContext";
import {
  TOKENS,
  POST_SCROLL_THEME,
  TOTAL_FRAMES,
  SCROLL_HEIGHT_VH,
  CTA_TARGET_ID,
  SECTIONS,
  COPY,
  CAPABILITIES,
  SECTION_BACKGROUNDS,
  SYSTEM_SECTION_COPY,
  DUO_COPY,
  CONTACT_SECTION,
  getFramePath,
  type CapabilityIconId,
  type NarrativeSection,
  type CapabilityItem,
} from "@/lib/tokens";
import GenesisAudio from "./GenesisAudio";

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function getSectionOpacity(progress: number, section: NarrativeSection): number {
  const { scrollStart, scrollEnd } = section;
  const range = scrollEnd - scrollStart;
  const fadeInEnd = scrollStart + range * 0.25;
  const fadeOutStart = scrollStart + range * 0.80;

  if (progress < scrollStart || progress > scrollEnd) return 0;
  if (progress < fadeInEnd) return (progress - scrollStart) / (fadeInEnd - scrollStart);

  // Keep the final section visible at the end
  if (scrollEnd >= 0.99 && progress >= fadeOutStart) return 1;

  if (progress > fadeOutStart) return 1 - (progress - fadeOutStart) / (scrollEnd - fadeOutStart);
  return 1;
}

function padFrame(n: number): string {
  return String(n).padStart(3, "0");
}

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace("#", "");
  const normalized = sanitized.length === 3
    ? sanitized.split("").map((char) => char + char).join("")
    : sanitized;
  const value = parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildAmbientStyle(
  baseColor: string,
  ambient: {
    focus: string;
    opacity: number;
    secondaryFocus: string;
    secondaryOpacity: number;
  }
): CSSProperties {
  return {
    backgroundColor: baseColor,
    backgroundImage: `
      radial-gradient(circle at ${ambient.focus}, ${hexToRgba(POST_SCROLL_THEME.violetBase, ambient.opacity)} 0%, rgba(109, 0, 255, 0) 54%),
      radial-gradient(circle at ${ambient.secondaryFocus}, ${hexToRgba(POST_SCROLL_THEME.violetBase, ambient.secondaryOpacity)} 0%, rgba(109, 0, 255, 0) 62%)
    `,
  };
}

function getCapabilityIcon(iconId: CapabilityIconId): JSX.Element {
  const props = { size: 24, strokeWidth: 1.5, style: { color: "#6D00FF" } };
  switch (iconId) {
    case "Dumbbell": return <Dumbbell {...props} />;
    case "Beef": return <Beef {...props} />;
    case "Moon": return <Moon {...props} />;
    case "Activity": return <Activity {...props} />;
    case "Cpu": return <Cpu {...props} />;
    case "Brain": return <Brain {...props} />;
    case "Accessibility": return <Accessibility {...props} />;
    default: return <Activity {...props} />;
  }
}

function getPillarIcon(iconId: string): JSX.Element {
  const props = { size: 20, strokeWidth: 1.5, style: { color: "#6D00FF" } };
  switch (iconId) {
    case "Dumbbell": return <Dumbbell {...props} />;
    case "Beef": return <Beef {...props} />;
    case "Moon": return <Moon {...props} />;
    case "TrendingUp": return <TrendingUp {...props} />;
    default: return <Activity {...props} />;
  }
}

const FINAL_FRAME_HOLD_START = 0.98;

function progressToFrame(progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  if (clamped >= FINAL_FRAME_HOLD_START) return TOTAL_FRAMES - 1;
  const normalized = clamped / FINAL_FRAME_HOLD_START;
  return Math.min(Math.floor(normalized * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
}

function hideSourceWatermark(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const maskWidth = Math.round(width * 0.08);
  const maskHeight = Math.round(height * 0.07);
  ctx.fillStyle = TOKENS.bg;
  ctx.fillRect(width - maskWidth, height - maskHeight, maskWidth, maskHeight);
}

// ═══════════════════════════════════════════════════════════════
// FRAME PRELOAD CACHE (prevents dev remount flicker)
// ═══════════════════════════════════════════════════════════════

interface FramePreloadState {
  ready: boolean;
  loadedCount: number;
  images: HTMLImageElement[];
  promise: Promise<HTMLImageElement[]> | null;
}

declare global {
  interface Window {
    __GENESIS_PRELOAD_STATE__?: FramePreloadState;
  }
}

function getFramePreloadState(): FramePreloadState {
  if (typeof window === "undefined") {
    return {
      ready: false,
      loadedCount: 0,
      images: [],
      promise: null,
    };
  }

  if (!window.__GENESIS_PRELOAD_STATE__) {
    window.__GENESIS_PRELOAD_STATE__ = {
      ready: false,
      loadedCount: 0,
      images: [],
      promise: null,
    };
  }

  return window.__GENESIS_PRELOAD_STATE__;
}

const framePreloadState = getFramePreloadState();

const frameProgressSubscribers = new Set<(progress: number) => void>();

function emitFrameProgress() {
  const progress = framePreloadState.loadedCount / TOTAL_FRAMES;
  frameProgressSubscribers.forEach((notify) => notify(progress));
}

function preloadGenesisFrames(): Promise<HTMLImageElement[]> {
  if (framePreloadState.ready) return Promise.resolve(framePreloadState.images);
  if (framePreloadState.promise) return framePreloadState.promise;

  framePreloadState.loadedCount = 0;
  emitFrameProgress();

  const promises = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        framePreloadState.loadedCount += 1;
        emitFrameProgress();
        resolve(img);
      };
      // RESILIENT LOADING: If a frame fails, we resolve nicely but the image will be broken.
      // We'll handle filling gaps in the post-processing step if needed, or simply let the canvas draw nothing/previous frame.
      // For now, we resolve so the Promise.all doesn't fail.
      img.onerror = () => {
        console.warn(`Failed to load frame: ${img.src}`);
        framePreloadState.loadedCount += 1;
        emitFrameProgress();
        resolve(img); // Resolve with the broken image object
      };
    });
  });

  framePreloadState.promise = Promise.all(promises)
    .then((imgs) => {
      // POST-PROCESS: Fill gaps (broken images) with the nearest previous valid image
      for (let i = 0; i < imgs.length; i++) {
        // detection of broken image: naturalWidth is 0
        if (imgs[i].naturalWidth === 0) {
          // Find closest previous valid
          let replacement = imgs[i];
          for (let j = i - 1; j >= 0; j--) {
            if (imgs[j].naturalWidth > 0) {
              replacement = imgs[j];
              break;
            }
          }
          // If no previous valid (e.g. frame 0 fails), look ahead? 
          // Or just leave it broken if frame 0 fails (critial error).
          // But assuming frame 0 exists based on user feedback.
          if (replacement.naturalWidth > 0) {
            imgs[i] = replacement;
          }
        }
      }
      framePreloadState.images = imgs;
      framePreloadState.ready = true;
      return imgs;
    })
    .catch((error) => {
      // Should not happen with the resilient logic, but as a safety net:
      framePreloadState.promise = null;
      framePreloadState.ready = false;
      framePreloadState.loadedCount = 0;
      emitFrameProgress();
      throw error;
    });

  return framePreloadState.promise;
}

// ═══════════════════════════════════════════════════════════════
// ANIMATED COUNTER
// ═══════════════════════════════════════════════════════════════

function AnimatedStat({
  value,
  unit,
  label,
  active,
  delay,
}: {
  value: number;
  unit: string;
  label: string;
  active: boolean;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!active || hasStarted.current) return;
    hasStarted.current = true;

    const timer = setTimeout(() => {
      const duration = 1200;
      const startTime = performance.now();
      let rafId: number;
      function tick(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCount(Math.round(eased * value));
        if (t < 1) rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
      // No cleanup for RAF — animation must finish once started
    }, delay);
    // Don't clear timeout — once triggered, let it complete
    return undefined;
  }, [active, value, delay]);

  return (
    <div>
      <div className="stat-number" style={{ fontSize: "clamp(36px, 5vw, 48px)", color: "#6D00FF" }}>
        {count}
        {unit}
      </div>
      <div className="text-[13px] text-white/60 mt-1">{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function GenesisReveal() {
  // --- State ---
  const [loaded, setLoaded] = useState(framePreloadState.ready);
  const [loadProgress, setLoadProgress] = useState(
    framePreloadState.ready ? 1 : framePreloadState.loadedCount / TOTAL_FRAMES
  );
  const [currentFrame, setCurrentFrame] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollReady, setScrollReady] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<CapabilityItem | null>(null);
  const [activeIntegration, setActiveIntegration] = useState<'none' | 'cal' | 'agent'>('none');
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Placeholder Config - USER TO REPLACE
  const CAL_LINK = "https://cal.com/aldoolivas";
  const AGENT_ID = "replace-with-your-elevenlabs-agent-id";

  // --- Refs ---
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>(framePreloadState.images);
  const rafRef = useRef<number>(0);

  // --- Scroll tracking ---
  // Manual progress calculation scoped to the container element.
  // Framer Motion's useScroll({ target }) maps progress to the entire page,
  // which prevents later sections (vehicle, cta) from ever being reached.
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    resetScroll();
    const raf1 = requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(() => {
        setScrollProgress(0);
        setCurrentFrame(0);
        setScrollReady(true);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    if (!scrollReady) return;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) { ticking = false; return; }
        const rect = el.getBoundingClientRect();
        const containerH = el.offsetHeight;
        const viewportH = window.innerHeight;
        const scrollRange = containerH - viewportH;
        if (scrollRange <= 0) { ticking = false; return; }
        // progress 0 → container top at viewport top
        // progress 1 → container bottom at viewport bottom
        const raw = -rect.top / scrollRange;
        const progress = Math.min(1, Math.max(0, raw));
        setScrollProgress(progress);
        setCurrentFrame(Math.max(0, progressToFrame(progress)));
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial sync
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollReady]);

  // --- Preload images ---
  useEffect(() => {
    let cancelled = false;

    const handleProgress = (progress: number) => {
      if (!cancelled) setLoadProgress(progress);
    };

    frameProgressSubscribers.add(handleProgress);
    handleProgress(framePreloadState.ready ? 1 : framePreloadState.loadedCount / TOTAL_FRAMES);

    preloadGenesisFrames()
      .then((imgs) => {
        if (cancelled) return;
        imagesRef.current = imgs;
        setLoadProgress(1);
        setLoaded(true);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(error);
          setLoaded(false);
        }
      });

    return () => {
      cancelled = true;
      frameProgressSubscribers.delete(handleProgress);
    };
  }, []);

  // --- Draw to canvas ---
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const frameToDraw = scrollReady ? currentFrame : 0;
    const img = imagesRef.current[frameToDraw];
    if (!img) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      hideSourceWatermark(ctx, canvas.width, canvas.height);
    });
  }, [loaded, currentFrame, scrollReady]);

  // --- Section opacities ---
  const sectionOpacities = useMemo(() => {
    const activeProgress = scrollReady ? scrollProgress : 0;
    return SECTIONS.map((section) => getSectionOpacity(activeProgress, section));
  }, [scrollProgress, scrollReady]);

  const scrollToSystem = useCallback(() => {
    document.getElementById(CTA_TARGET_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const systemAmbientStyle = useMemo(
    () => buildAmbientStyle(TOKENS.bgPrimary, SECTION_BACKGROUNDS.sistema),
    []
  );

  const capabilitiesAmbientStyle = useMemo(
    () => buildAmbientStyle(TOKENS.bgAlt, SECTION_BACKGROUNDS.capacidades),
    []
  );

  const duoAmbientStyle = useMemo(
    () => buildAmbientStyle(TOKENS.bgPrimary, SECTION_BACKGROUNDS.duo),
    []
  );

  const textures = [
    "/assets/abstract_tech_texture_1.png",
    "/assets/abstract_tech_texture_2.png",
    "/assets/abstract_tech_texture_3.png",
  ];

  // ═══════════════════════════════════════════════════════════════
  // LOADING SCREEN
  // ═══════════════════════════════════════════════════════════════
  if (!loaded) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: TOKENS.bg }}
      >
        <div className="w-3 h-3 rounded-full bg-vite animate-pulse-dot mb-8" />
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40 mb-6">
          CARGANDO PROTOCOLO...
        </p>
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-vite transition-all duration-200 ease-out rounded-full"
            style={{ width: `${loadProgress * 100}%` }}
          />
        </div>
        <p className="font-mono text-[10px] text-white/20 mt-3">
          {Math.round(loadProgress * 100)}%
        </p>
      </div>
    );
  }


  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen text-white" style={{ background: TOKENS.bg }}>
      <GenesisAudio active={loaded} />

      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
          ? 'bg-black/80 backdrop-blur-md border-white/10 py-4'
          : 'bg-transparent border-transparent py-6'
          }`}
      >
        <div className="max-w-content mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-vite rounded-full animate-pulse" />
            <span className="font-mono font-bold text-lg tracking-tighter text-white">
              NGX <span className="text-vite">GENESIS</span>
            </span>
          </div>
          <button
            onClick={() => document.getElementById(CTA_TARGET_ID)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="btn-glow font-mono font-bold text-[10px] md:text-xs text-white px-5 py-2 rounded-full tracking-widest transition-all hover:scale-105 active:scale-95"
          >
            INICIAR_PROTOCOLO
          </button>
        </div>
      </nav>

      {/* ── SCROLL CONTAINER ── */}
      <div ref={containerRef} style={{ height: `${SCROLL_HEIGHT_VH}vh` }} className="relative">
        {/* ── STICKY VIEWPORT ── */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover md:object-contain"
          />

          {/* Blueprint frame borders - Mobile: thinner/subtler? Keep for now. */}
          <div className="absolute inset-0 pointer-events-none mx-2 md:mx-4">
            <div className="absolute top-0 bottom-0 left-0 w-px bg-nickel/30" />
            <div className="absolute top-0 bottom-0 right-0 w-px bg-nickel/30" />
            {/* Tick marks — top corners */}
            <div className="absolute top-0 left-0 w-px h-[8px] md:h-[11px] bg-nickel" />
            <div className="absolute top-0 right-0 w-px h-[8px] md:h-[11px] bg-nickel" />
            {/* Tick marks — bottom corners */}
            <div className="absolute bottom-0 left-0 w-px h-[8px] md:h-[11px] bg-nickel" />
            <div className="absolute bottom-0 right-0 w-px h-[8px] md:h-[11px] bg-nickel" />
          </div>

          {/* Scan line */}
          <div className="scan-line" />

          {/* Noise overlay */}
          <div className="noise-overlay" />

          {/* Frame counter */}
          <div className="absolute bottom-4 right-6 font-mono text-[10px] text-white/15 z-10">
            {padFrame(scrollReady ? currentFrame : 0)} / {padFrame(TOTAL_FRAMES - 1)}
          </div>

          {/* ═══════════════════════════════════════════════════════
              NARRATIVE SECTIONS
              ═══════════════════════════════════════════════════════ */}

          {/* SECTION 0: THE HOOK (center) */}
          <div
            className="absolute inset-0 flex items-start justify-center pt-[20vh] md:pt-[15vh] px-6 pointer-events-none z-10"
            style={{ opacity: sectionOpacities[0], transition: "opacity 0.1s ease-out" }}
          >
            <div className="text-center w-full max-w-2xl">
              <p className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/40 mb-4">
                {COPY.hook.label}
              </p>
              <h1
                className="vite-h1 text-white mb-6"
                style={{ fontSize: "clamp(28px, 5vw, 56px)", whiteSpace: "pre-line" }}
              >
                {COPY.hook.h}
              </h1>
              <p className="text-white/50 text-sm md:text-lg leading-relaxed whitespace-pre-line mb-6 max-w-[90%] mx-auto">
                {COPY.hook.body}
              </p>
              <motion.p
                className="font-mono text-[8vw] md:text-[6vw] font-black tracking-tighter leading-none z-20"
                initial={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
                animate={
                  sectionOpacities[0] > 0.5
                    ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                    : { opacity: 0, scale: 2, filter: "blur(10px)" }
                }
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 120,
                  mass: 1.5,
                }}
                style={{
                  color: "#6D00FF",
                  textShadow: "0 0 30px rgba(109, 0, 255, 0.8), 0 0 60px rgba(109, 0, 255, 0.4)",
                  animation: "pulseGlow 2s ease-in-out infinite alternate",
                }}
              >
                {COPY.hook.accent}
              </motion.p>
            </div>
          </div>

          {/* SECTION 1: THE THESIS (left, glass-card) */}
          <div
            className="absolute inset-0 flex items-end md:items-center justify-center md:justify-start pointer-events-none z-10 px-4 pb-[15vh] md:pb-0"
            style={{ opacity: sectionOpacities[1], transition: "opacity 0.1s ease-out" }}
          >
            <div className="glass-card w-full max-w-[95%] md:ml-[5%] md:max-w-[38%]">
              <h2
                className="vite-h2 text-white mb-4"
                style={{ fontSize: "clamp(20px, 3vw, 36px)" }}
              >
                {COPY.thesis.h}
              </h2>
              <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4">
                {COPY.thesis.body}
              </p>
              {/* Citation removed per design decision */}
            </div>
          </div>

          {/* SECTION 2: THE SCIENCE (right) */}
          <div
            className="absolute inset-0 flex items-start md:items-center justify-center md:justify-end pointer-events-none z-10 px-4 pt-[15vh] md:pt-0"
            style={{ opacity: sectionOpacities[2], transition: "opacity 0.1s ease-out" }}
          >
            <div className="liquid-card rounded-2xl w-full max-w-[95%] md:mr-[5%] md:max-w-[38%] p-6 md:p-8">
              <h2
                className="vite-h2 text-white mb-6 text-center md:text-left"
                style={{ fontSize: "clamp(20px, 3vw, 36px)" }}
              >
                {COPY.science.h}
              </h2>
              <div className="space-y-4 md:space-y-6">
                {COPY.science.stats.map((stat, i) => (
                  <AnimatedStat
                    key={i}
                    value={stat.value}
                    unit={stat.unit}
                    label={stat.label}
                    active={sectionOpacities[2] > 0.1}
                    delay={i * 150}
                  />
                ))}
              </div>
              <p className="font-mono text-[10px] text-white/20 mt-6 text-center md:text-left">
                {COPY.science.source}
              </p>
            </div>
          </div>

          {/* SECTION 3: THE 4 PILLARS (left) */}
          <div
            className="absolute inset-0 flex items-end md:items-center justify-center md:justify-start pointer-events-none z-10 px-4 pb-[15vh] md:pb-0"
            style={{ opacity: sectionOpacities[3], transition: "opacity 0.1s ease-out" }}
          >
            <div className="w-full max-w-[95%] md:ml-[5%] md:max-w-[38%]">
              <h2
                className="vite-h2 text-white mb-6 text-center md:text-left"
                style={{ fontSize: "clamp(20px, 3vw, 36px)" }}
              >
                {COPY.pillars.h}
              </h2>
              <div className="space-y-3">
                {COPY.pillars.items.map((item, i) => (
                  <motion.div
                    key={i}
                    className="liquid-card flex items-start gap-3 rounded-xl p-3"
                    initial={{ opacity: 0, x: -30 }}
                    animate={
                      sectionOpacities[3] > 0.3
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -30 }
                    }
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                  >
                    <span className="flex-shrink-0">{getPillarIcon(item.icon)}</span>
                    <div>
                      <p className="font-mono text-xs md:text-[13px] font-bold text-white">
                        {item.title}
                      </p>
                      <p className="text-[11px] md:text-[12px] text-white/60 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: THE VEHICLE (right, glass-card) */}
          <div
            className="absolute inset-0 flex items-end md:items-center justify-center md:justify-end pointer-events-none z-10 px-4 pb-[15vh] md:pb-0"
            style={{ opacity: sectionOpacities[4], transition: "opacity 0.1s ease-out" }}
          >
            <div className="glass-card w-full max-w-[95%] md:mr-[5%] md:max-w-[38%]">
              <h2
                className="vite-h2 text-white mb-4"
                style={{ fontSize: "clamp(20px, 3vw, 36px)" }}
              >
                {COPY.vehicle.h}
              </h2>
              <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4">
                {COPY.vehicle.body}
              </p>
              <div className="violet-divider my-4" />
              <p className="text-white/90 text-sm md:text-base leading-relaxed whitespace-pre-line mb-4">
                {COPY.vehicle.body2}
              </p>
              <p className="font-mono text-vite text-xs md:text-sm font-semibold">
                {COPY.vehicle.accent}
              </p>
            </div>
          </div>

          {/* SECTION 5: THE CTA (center-bottom) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-end pb-[15vh] md:pb-[10vh] pointer-events-none z-50 px-4"
            style={{ opacity: sectionOpacities[5], transition: "opacity 0.1s ease-out" }}
          >
            <div className="relative text-center">
              {/* Mega NGX background text */}
              <div
                className="font-mono font-bold text-white/[0.08] leading-none select-none"
                style={{ fontSize: "clamp(60px, 18vw, 180px)" }}
              >
                {COPY.cta.mega}
              </div>
              {/* GENESIS overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <h2
                  className="font-mono font-bold text-white"
                  style={{
                    fontSize: "clamp(28px, 7vw, 64px)",
                    textShadow: "0 0 40px rgba(108, 59, 255, 0.6), 0 0 80px rgba(108, 59, 255, 0.3)",
                  }}
                >
                  {COPY.cta.h}
                </h2>
              </div>
            </div>

            <p className="font-mono text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] uppercase text-white/40 mt-4">
              {COPY.cta.tagline}
            </p>

            <p
              className="italic text-white/70 text-center mt-4 whitespace-pre-line max-w-sm md:max-w-md"
              style={{ fontSize: "clamp(13px, 1.5vw, 18px)" }}
            >
              {COPY.cta.quote}
            </p>

            <button
              onClick={scrollToSystem}
              className="btn-glow font-mono font-bold text-xs md:text-sm text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full mt-6 pointer-events-auto cursor-pointer"
            >
              {COPY.cta.cta}
            </button>

            <p className="text-[10px] md:text-[11px] text-white/30 mt-3">{COPY.cta.sub}</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          POST-SCROLL: EL SISTEMA
          ═══════════════════════════════════════════════════════════════ */}
      <div id="sistema" className="vite-section vite-frame section-ambient-sistema" style={systemAmbientStyle}>
        <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-28 text-center">
          <div className="liquid-card mx-auto max-w-3xl rounded-2xl px-6 md:px-10 py-10 md:py-12">
            <p className="vite-label text-white/40 mb-6">{SYSTEM_SECTION_COPY.label}</p>
            <h2
              className="vite-h2 text-white mb-6"
              style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
            >
              {SYSTEM_SECTION_COPY.h}
            </h2>
            <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              {SYSTEM_SECTION_COPY.body}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ¿PARA QUIÉN ES ESTO?
          ═══════════════════════════════════════════════════════════════ */}
      <ForWhom />

      {/* ═══════════════════════════════════════════════════════════════
          CÓMO FUNCIONA
          ═══════════════════════════════════════════════════════════════ */}
      <HowItWorks />

      {/* ═══════════════════════════════════════════════════════════════
          CAPACIDADES
          ═══════════════════════════════════════════════════════════════ */}
      <div className="vite-section vite-frame section-ambient-capacidades" style={capabilitiesAmbientStyle}>
        <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-28">
          <p className="vite-label text-white/40 mb-5">CAPACIDADES</p>
          <h2
            className="vite-h2 text-white mb-5"
            style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
          >
            Especialización, no generalismo.
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl">
            Cada área de tu salud tiene su propio módulo de análisis. Nada genérico.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5 mt-10 md:mt-12">
            {CAPABILITIES.map((capability, index) => {
              // 2-3-2 Layout Pattern for 7 items
              // Row 1 (2 items): Span 3
              // Row 2 (3 items): Span 2
              // Row 3 (2 items): Span 3
              const spanClass = [0, 1, 5, 6].includes(index) ? "lg:col-span-3" : "lg:col-span-2";

              return (
                <article
                  key={capability.tag}
                  onClick={() => setSelectedCapability(capability)}
                  className={`capability-card liquid-card group relative overflow-hidden ${spanClass} cursor-pointer`}
                >
                  {/* Background Texture - Cyclical Assignment */}
                  <div
                    className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none transition-opacity duration-300 group-hover:opacity-20"
                    style={{
                      backgroundImage: `url(${textures[index % textures.length]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />

                  <div className="relative z-10 flex items-center justify-end gap-3">
                    <span className="icon-chip bg-white/5 border-white/10 group-hover:border-vite/50 group-hover:bg-vite/10 transition-all">
                      {getCapabilityIcon(capability.icon)}
                    </span>
                  </div>
                  <h3 className="relative z-10 font-mono text-white text-lg md:text-xl mt-3 leading-tight group-hover:text-vite transition-colors">
                    {capability.title}
                  </h3>
                  <p className="relative z-10 text-sm text-white/65 leading-relaxed mt-3 group-hover:text-white/80 transition-colors">
                    {capability.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          EL DÚO
          ═══════════════════════════════════════════════════════════════ */}
      <div className="vite-section vite-frame section-ambient-duo" style={duoAmbientStyle}>
        <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-28">
          <p className="vite-label text-white/40 mb-5">{DUO_COPY.label}</p>
          <h2
            className="vite-h2 text-white mb-5"
            style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
          >
            La ventaja injusta.
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mb-12">
            {DUO_COPY.subtitle}
          </p>

          {/* Hero Photo Placeholder */}
          <div className="liquid-card rounded-2xl overflow-hidden mb-6">
            <div className="relative w-full aspect-[21/9] bg-gradient-to-br from-vite/10 via-black/50 to-transparent flex items-center justify-center">
              {/* Decorative Background */}
              <div className="absolute inset-0 noise-overlay opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-vite/5 via-transparent to-white/5" />

              {/* Icons Trio */}
              <div className="relative z-10 flex items-center justify-center gap-12 md:gap-20">
                {/* Aldo */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <User size={32} className="text-white/70" strokeWidth={1.5} />
                  </div>
                  <p className="font-mono text-xs md:text-sm text-white/60 tracking-widest">ALDO</p>
                </div>

                {/* Connector */}
                <div className="w-12 h-12 rounded-full bg-black border-2 border-vite flex items-center justify-center shadow-[0_0_30px_rgba(108,59,255,0.5)]">
                  <div className="w-3 h-3 bg-vite rounded-full animate-pulse" />
                </div>

                {/* Genesis */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-vite/10 border border-vite/30 flex items-center justify-center">
                    <Cpu size={32} className="text-vite" strokeWidth={1.5} />
                  </div>
                  <p className="font-mono text-xs md:text-sm text-vite tracking-widest">GENESIS</p>
                </div>
              </div>

              {/* Overlay Text */}
              <div className="absolute bottom-4 right-6">
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  [ Próximamente: Foto del Dúo ]
                </p>
              </div>
            </div>
          </div>

          {/* Info Split - Aldo & Genesis */}
          <div className="relative flex flex-col md:flex-row gap-6 md:gap-0 md:items-stretch">
            {/* Left: Aldo */}
            <div className="flex-1 liquid-card md:rounded-r-none md:border-r-0 p-8 flex flex-col">
              <p className="capability-tag text-vite">{DUO_COPY.aldo.label}</p>
              <h3 className="font-mono text-3xl text-white mt-2">{DUO_COPY.aldo.heading}</h3>
              <div className="mt-6 text-white/70 text-sm leading-relaxed">
                {DUO_COPY.aldo.body}
              </div>
            </div>

            {/* Center Connector (Desktop only) */}
            <div className="hidden md:flex flex-col items-center justify-center relative z-20 w-12 -mx-6">
              <div className="w-12 h-12 rounded-full bg-black border border-vite flex items-center justify-center shadow-[0_0_20px_rgba(108,59,255,0.4)]">
                <div className="w-3 h-3 bg-vite rounded-full animate-pulse" />
              </div>
            </div>

            {/* Right: Genesis */}
            <div className="flex-1 liquid-card md:rounded-l-none md:border-l-0 p-8 flex flex-col text-right items-end">
              <p className="capability-tag text-white/50">{DUO_COPY.genesis.label}</p>
              <h3 className="font-mono text-3xl text-white mt-2">{DUO_COPY.genesis.heading}</h3>
              <div className="mt-6 text-white/70 text-sm leading-relaxed text-right">
                {DUO_COPY.genesis.body}
              </div>
            </div>
          </div>

          {/* Synthesis Statement */}
          <div className="text-center mt-8 md:mt-12">
            <p className="font-mono text-sm md:text-base text-vite tracking-wide">
              {DUO_COPY.synthesis}
            </p>
          </div>

        </div >
      </div >

      {/* ═══════════════════════════════════════════════════════════════
          SOCIAL PROOF
          ═══════════════════════════════════════════════════════════════ */}
      <SocialProof />

      {/* ═══════════════════════════════════════════════════════════════
          PRICING CONTEXT
          ═══════════════════════════════════════════════════════════════ */}
      <PricingContext onCtaClick={() => setActiveIntegration('cal')} />

      {/* ═══════════════════════════════════════════════════════════════
          CTA / CONTACT SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <div id="contacto" className="vite-section vite-frame relative overflow-hidden" style={{ background: TOKENS.bgPrimary }}>
        {/* Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-vite/5 pointer-events-none" />

        <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32 relative z-10">
          <h2 className="vite-h2 text-white text-center mb-4" style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}>
            {CONTACT_SECTION.title}
          </h2>
          <p className="text-white/60 text-center text-sm md:text-base mb-12">
            {CONTACT_SECTION.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Human Option */}
            <button
              onClick={() => {
                console.log("Human CTA clicked");
                setActiveIntegration('cal');
              }}
              className="group liquid-card p-8 rounded-2xl flex flex-col items-center text-center hover:border-white/40 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar size={32} className="text-white/80 group-hover:text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-mono text-xl text-white mb-3">{CONTACT_SECTION.human.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                {CONTACT_SECTION.human.desc}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase border-b border-white/30 pb-1 group-hover:border-white group-hover:text-white transition-colors">
                {CONTACT_SECTION.human.cta}
              </span>
            </button>

            {/* AI Option */}
            <button
              onClick={() => setActiveIntegration('agent')}
              className="group liquid-card p-8 rounded-2xl flex flex-col items-center text-center border-vite/30 hover:border-vite transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Subtle AI Glow */}
              <div className="absolute inset-0 bg-vite/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-16 h-16 rounded-full bg-vite/10 border border-vite/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <MessageSquare size={32} className="text-vite group-hover:text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-mono text-xl text-white mb-3 relative z-10">{CONTACT_SECTION.ai.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs mx-auto relative z-10">
                {CONTACT_SECTION.ai.desc}
              </p>
              <span className="mt-auto relative z-10 inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-vite border-b border-vite/30 pb-1 group-hover:border-vite group-hover:text-white transition-colors">
                {CONTACT_SECTION.ai.cta}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CAPABILITY DETAILS MODAL
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {
          selectedCapability && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setSelectedCapability(null)}
              />

              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-4xl bg-[#0a0a0a] border border-vite/30 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(108,59,255,0.15)] flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCapability(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Left Column: Identify */}
                <div className="w-full md:w-5/12 p-8 md:p-10 bg-gradient-to-br from-vite/5 to-transparent flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
                  {/* Decorative background blur */}
                  <div className="absolute top-0 left-0 w-64 h-64 bg-vite/10 blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-vite/10 border border-vite/20 text-vite mb-6">
                      {getCapabilityIcon(selectedCapability.icon)}
                    </div>
                    <p className="capability-tag text-vite/80 mb-3">{selectedCapability.tag}</p>
                    <h3 className="font-mono text-2xl md:text-3xl text-white leading-tight">
                      {selectedCapability.title}
                    </h3>
                    <div className="w-12 h-1 bg-vite mt-6" />
                  </div>

                  <div className="mt-8 md:mt-auto">
                    <p className="font-mono text-sm text-white/60 uppercase tracking-widest mb-2">Principios</p>
                    <p className="text-lg text-white font-medium leading-relaxed">
                      {selectedCapability.details.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Column: Deep Dive */}
                <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col overflow-y-auto">

                  {/* Problem / Solution Block */}
                  <div className="space-y-8">
                    <div>
                      <h4 className="flex items-center gap-2 font-mono text-sm text-red-400 uppercase tracking-wider mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> El Problema
                      </h4>
                      <p className="text-white/80 leading-relaxed text-base md:text-lg">
                        {selectedCapability.details.problem}
                      </p>
                    </div>

                    <div>
                      <h4 className="flex items-center gap-2 font-mono text-sm text-vite uppercase tracking-wider mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-vite" /> La Solución NGX
                      </h4>
                      <p className="text-white/80 leading-relaxed text-base md:text-lg">
                        {selectedCapability.details.solution}
                      </p>
                    </div>
                  </div>

                  {/* Key Stat Box */}
                  <div className="mt-10 p-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-white/50 uppercase tracking-widest mb-1">
                        {selectedCapability.details.statLabel}
                      </p>
                      <p className="text-3xl md:text-4xl font-mono font-bold text-white">
                        {selectedCapability.details.stat}
                      </p>
                    </div>
                    <div className="opacity-20 text-vite">
                      <Activity size={48} strokeWidth={1} />
                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* ═══════════════════════════════════════════════════════════════
          CAL.COM MODAL
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {
          activeIntegration === 'cal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
            >
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setActiveIntegration('none')}
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-5xl h-[85vh] bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                  <p className="font-mono text-sm tracking-widest">ESTRATEGIA HUMANA</p>
                  <button onClick={() => setActiveIntegration('none')}>
                    <X className="text-white/60 hover:text-white transition-colors" />
                  </button>
                </div>
                <div className="flex-grow w-full h-full bg-[#111]">
                  {/* Cal Embed Iframe */}
                  <iframe
                    src={`${CAL_LINK}?theme=dark`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Cal.com Scheduling"
                    allow="camera; microphone; autoplay; fullscreen"
                  ></iframe>
                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* ═══════════════════════════════════════════════════════════════
          ELEVENLABS AGENT MODAL
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {
          activeIntegration === 'agent' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
            >
              <div
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                onClick={() => setActiveIntegration('none')}
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-md bg-black border border-vite/50 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(108,59,255,0.2)] flex flex-col h-[700px] max-h-[90vh]"
              >
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-vite/20 bg-vite/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-vite animate-pulse" />
                    <p className="font-mono text-sm tracking-widest text-vite">GENESIS CORE</p>
                  </div>
                  <button onClick={() => setActiveIntegration('none')}>
                    <X className="text-white/60 hover:text-white transition-colors" />
                  </button>
                </div>

                {/* Agent Container */}
                <div className="flex-grow w-full relative bg-black/50 flex flex-col items-center justify-center p-8 text-center">
                  {/* Placeholder for ElevenLabs Widget */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                    <Brain size={120} strokeWidth={0.5} className="text-vite" />
                  </div>

                  <p className="text-white/60 text-sm mb-6 relative z-10">
                    Conectando con el núcleo neuronal...
                  </p>

                  {/* INSTRUCTION FOR USER */}
                  <div className="bg-vite/10 border border-vite/30 p-4 rounded-lg text-left w-full relative z-10">
                    <p className="text-xs text-vite font-mono mb-2">[ SYSTEM_MESSAGE ]</p>
                    <p className="text-xs text-white/70 font-mono">
                      Para activar el agente, inserta tu <code>&lt;elevenlabs-convai&gt;</code> script aquí en el código.
                      <br /><br />
                      ID del Agente requerida: <span className="text-white">{AGENT_ID}</span>
                    </p>
                  </div>

                  {/* Example of where the widget code would go */}
                  {/* 
                      <elevenlabs-convai agent-id={AGENT_ID}></elevenlabs-convai>
                      <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
                    */}
                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="vite-section vite-frame" style={{ background: TOKENS.bg }}>
        <div className="max-w-content mx-auto px-6 md:px-10 py-12 flex items-center justify-between">
          <p className="font-mono text-sm">
            <span className="text-white">NGX</span>{" "}
            <span className="text-vite">GENESIS</span>
          </p>
          <p className="font-mono text-xs text-grey">
            &copy; 2026 NGX Inc. Performance &amp; Longevity.
          </p>
        </div>
      </div>
    </div>
  );
}
