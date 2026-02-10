"use client";

import { useRef, useState, useEffect, useCallback, useMemo, type CSSProperties } from "react";
import { useScroll, motion, useMotionValueEvent } from "framer-motion";
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
  getFramePath,
  type CapabilityIconId,
  type NarrativeSection,
} from "@/lib/tokens";

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
  switch (iconId) {
    case "strength":
      return (
        <svg viewBox="0 0 24 24" className="icon-svg-outline" aria-hidden>
          <path d="M4 10h2m12 0h2M8 8v4m8-4v4M6 8h2v4H6zm10 0h2v4h-2z" />
          <path d="M8 10h8" />
        </svg>
      );
    case "protein":
      return (
        <svg viewBox="0 0 24 24" className="icon-svg-outline" aria-hidden>
          <path d="M8 3h8m-1 0v4l3 5a5 5 0 0 1-4.4 7H10.4A5 5 0 0 1 6 12l3-5V3" />
          <path d="M9 10h6" />
        </svg>
      );
    case "sleep":
      return (
        <svg viewBox="0 0 24 24" className="icon-svg-outline" aria-hidden>
          <path d="M15.5 4.5a7 7 0 1 0 4 10.8A8 8 0 1 1 15.5 4.5z" />
          <path d="M8 6h2M7 9h3" />
        </svg>
      );
    case "biomarkers":
      return (
        <svg viewBox="0 0 24 24" className="icon-svg-outline" aria-hidden>
          <path d="M4 15h3l2-4 3 6 2-5 2 3h4" />
          <path d="M4 6h16M4 20h16" />
        </svg>
      );
    case "habits":
      return (
        <svg viewBox="0 0 24 24" className="icon-svg-outline" aria-hidden>
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
          <path d="m8.5 12 2.2 2.2L15.8 9" />
        </svg>
      );
    case "cognitive":
      return (
        <svg viewBox="0 0 24 24" className="icon-svg-outline" aria-hidden>
          <path d="M8.5 9.5a3.5 3.5 0 0 1 7 0v5a3.5 3.5 0 0 1-7 0z" />
          <path d="M7 12h-2m14 0h-2M12 6V4m0 16v-2" />
        </svg>
      );
    case "mobility":
      return (
        <svg viewBox="0 0 24 24" className="icon-svg-outline" aria-hidden>
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v5l3 3m-3-3-3 3M9 21l3-6 3 6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="icon-svg-outline" aria-hidden>
          <circle cx="12" cy="12" r="6" />
        </svg>
      );
  }
}

const FINAL_FRAME_HOLD_START = 0.92;

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
      img.onerror = () => reject(new Error(`Failed to load frame: ${img.src}`));
    });
  });

  framePreloadState.promise = Promise.all(promises)
    .then((imgs) => {
      framePreloadState.images = imgs;
      framePreloadState.ready = true;
      return imgs;
    })
    .catch((error) => {
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
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!active || started) return;
    const timer = setTimeout(() => {
      setStarted(true);
      const duration = 1200;
      const startTime = performance.now();
      function tick(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCount(Math.round(eased * value));
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [active, started, value, delay]);

  useEffect(() => {
    if (!active) {
      setStarted(false);
      setCount(0);
    }
  }, [active]);

  return (
    <div>
      <div className="stat-number" style={{ fontSize: "clamp(36px, 5vw, 48px)" }}>
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

  // --- Refs ---
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>(framePreloadState.images);
  const rafRef = useRef<number>(0);

  // --- Scroll tracking ---
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Force a deterministic top-start before enabling scroll-driven frame updates.
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    let raf1 = 0;
    let raf2 = 0;

    resetScroll();
    raf1 = requestAnimationFrame(() => {
      resetScroll();
      raf2 = requestAnimationFrame(() => {
        setScrollProgress(0);
        setCurrentFrame(0);
        setScrollReady(true);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.history.scrollRestoration = previous;
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!scrollReady) return;
    setScrollProgress(v);
    const frameIndex = progressToFrame(v);
    setCurrentFrame(Math.max(0, frameIndex));
  });

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
    return SECTIONS.map((section, index) => {
      const baseOpacity = getSectionOpacity(activeProgress, section);
      if (index !== 5) return baseOpacity;
      if (activeProgress <= 0.94) return baseOpacity;
      const releaseFactor = Math.max(0, 1 - (activeProgress - 0.94) / 0.06);
      return baseOpacity * releaseFactor;
    });
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
      {/* ── SCROLL CONTAINER ── */}
      <div ref={containerRef} style={{ height: `${SCROLL_HEIGHT_VH}vh` }} className="relative">
        {/* ── STICKY VIEWPORT ── */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "contain" }}
          />

          {/* Blueprint frame borders */}
          <div className="absolute inset-0 pointer-events-none mx-4">
            <div className="absolute top-0 bottom-0 left-0 w-px bg-nickel/30" />
            <div className="absolute top-0 bottom-0 right-0 w-px bg-nickel/30" />
            {/* Tick marks — top corners */}
            <div className="absolute top-0 left-0 w-px h-[11px] bg-nickel" />
            <div className="absolute top-0 right-0 w-px h-[11px] bg-nickel" />
            {/* Tick marks — bottom corners */}
            <div className="absolute bottom-0 left-0 w-px h-[11px] bg-nickel" />
            <div className="absolute bottom-0 right-0 w-px h-[11px] bg-nickel" />
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
            className="absolute inset-0 flex items-start justify-center pt-[15vh] px-4 pointer-events-none z-10"
            style={{ opacity: sectionOpacities[0], transition: "opacity 0.1s ease-out" }}
          >
            <div className="text-center max-w-[90%] md:max-w-2xl">
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/40 mb-4">
                {COPY.hook.label}
              </p>
              <h1
                className="vite-h1 text-white mb-6"
                style={{ fontSize: "clamp(32px, 5vw, 56px)", whiteSpace: "pre-line" }}
              >
                {COPY.hook.h}
              </h1>
              <p className="text-white/50 text-base md:text-lg leading-relaxed whitespace-pre-line mb-6">
                {COPY.hook.body}
              </p>
              <motion.p
                className="font-mono text-vite text-lg md:text-xl font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={sectionOpacities[0] > 0.5 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {COPY.hook.accent}
              </motion.p>
            </div>
          </div>

          {/* SECTION 1: THE THESIS (left, glass-card) */}
          <div
            className="absolute inset-0 flex items-center pointer-events-none z-10 px-4"
            style={{ opacity: sectionOpacities[1], transition: "opacity 0.1s ease-out" }}
          >
            <div className="glass-card ml-[5%] max-w-[90%] md:max-w-[38%]">
              <h2
                className="vite-h2 text-white mb-4"
                style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
              >
                {COPY.thesis.h}
              </h2>
              <p className="text-white/90 text-sm md:text-base leading-relaxed mb-4">
                {COPY.thesis.body}
              </p>
              <p className="italic text-white/30 text-xs">{COPY.thesis.citation}</p>
            </div>
          </div>

          {/* SECTION 2: THE SCIENCE (right) */}
          <div
            className="absolute inset-0 flex items-center justify-end pointer-events-none z-10 px-4"
            style={{ opacity: sectionOpacities[2], transition: "opacity 0.1s ease-out" }}
          >
            <div className="mr-[5%] max-w-[90%] md:max-w-[38%]">
              <h2
                className="vite-h2 text-white mb-6"
                style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
              >
                {COPY.science.h}
              </h2>
              <div className="space-y-6">
                {COPY.science.stats.map((stat, i) => (
                  <AnimatedStat
                    key={i}
                    value={stat.value}
                    unit={stat.unit}
                    label={stat.label}
                    active={sectionOpacities[2] > 0.3}
                    delay={i * 300}
                  />
                ))}
              </div>
              <p className="font-mono text-[10px] text-white/20 mt-6">
                {COPY.science.source}
              </p>
            </div>
          </div>

          {/* SECTION 3: THE 4 PILLARS (left) */}
          <div
            className="absolute inset-0 flex items-center pointer-events-none z-10 px-4"
            style={{ opacity: sectionOpacities[3], transition: "opacity 0.1s ease-out" }}
          >
            <div className="ml-[5%] max-w-[90%] md:max-w-[38%]">
              <h2
                className="vite-h2 text-white mb-6"
                style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
              >
                {COPY.pillars.h}
              </h2>
              <div className="space-y-3">
                {COPY.pillars.items.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3 bg-white/5 border border-nickel rounded-xl p-3"
                    initial={{ opacity: 0, x: -30 }}
                    animate={
                      sectionOpacities[3] > 0.3
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -30 }
                    }
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-mono text-[13px] font-bold text-white">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-white/60 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: THE VEHICLE (right, glass-card) */}
          <div
            className="absolute inset-0 flex items-center justify-end pointer-events-none z-10 px-4"
            style={{ opacity: sectionOpacities[4], transition: "opacity 0.1s ease-out" }}
          >
            <div className="glass-card mr-[5%] max-w-[90%] md:max-w-[38%]">
              <h2
                className="vite-h2 text-white mb-4"
                style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
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
              <p className="font-mono text-vite text-sm font-semibold">
                {COPY.vehicle.accent}
              </p>
            </div>
          </div>

          {/* SECTION 5: THE CTA (center-bottom) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-end pb-[10vh] pointer-events-none z-10 px-4"
            style={{ opacity: sectionOpacities[5], transition: "opacity 0.1s ease-out" }}
          >
            <div className="relative text-center">
              {/* Mega NGX background text */}
              <div
                className="font-mono font-bold text-white/[0.08] leading-none select-none"
                style={{ fontSize: "clamp(80px, 18vw, 180px)" }}
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
                    fontSize: "clamp(36px, 7vw, 64px)",
                    textShadow: "0 0 40px rgba(108, 59, 255, 0.6), 0 0 80px rgba(108, 59, 255, 0.3)",
                  }}
                >
                  {COPY.cta.h}
                </h2>
              </div>
            </div>

            <p className="font-mono text-[11px] tracking-[0.5em] uppercase text-white/40 mt-4">
              {COPY.cta.tagline}
            </p>

            <p
              className="italic text-white/70 text-center mt-4 whitespace-pre-line max-w-md"
              style={{ fontSize: "clamp(14px, 1.5vw, 18px)" }}
            >
              {COPY.cta.quote}
            </p>

            <button
              onClick={scrollToSystem}
              className="btn-glow font-mono font-bold text-sm text-white px-8 py-3 rounded-full mt-6 pointer-events-auto cursor-pointer"
            >
              {COPY.cta.cta}
            </button>

            <p className="text-[11px] text-white/30 mt-3">{COPY.cta.sub}</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          POST-SCROLL: EL SISTEMA
          ═══════════════════════════════════════════════════════════════ */}
      <div id={CTA_TARGET_ID} className="vite-section vite-frame section-ambient-sistema" style={systemAmbientStyle}>
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
          MIS CAPACIDADES
          ═══════════════════════════════════════════════════════════════ */}
      <div className="vite-section vite-frame section-ambient-capacidades" style={capabilitiesAmbientStyle}>
        <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-28">
          <p className="vite-label text-white/40 mb-5">MIS CAPACIDADES</p>
          <h2
            className="vite-h2 text-white mb-5"
            style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
          >
            No soy un generalista.
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl">
            Soy un conjunto de módulos clínico-tecnológicos, coordinados para traducir ciencia en
            decisiones concretas, sostenibles y personalizadas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-10 md:mt-12">
            {CAPABILITIES.map((capability) => (
              <article key={capability.tag} className="capability-card liquid-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="capability-tag">{capability.tag}</p>
                  <span className="icon-chip">{getCapabilityIcon(capability.icon)}</span>
                </div>
                <h3 className="font-mono text-white text-lg md:text-xl mt-3 leading-tight">
                  {capability.title}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed mt-3">
                  {capability.desc}
                </p>
              </article>
            ))}
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
            Donde el criterio humano se multiplica.
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl">
            {DUO_COPY.subtitle}
          </p>

          <div className="duo-placeholder-visual liquid-card mt-10 mb-8 md:mt-12 md:mb-10">
            <span className="capability-tag">{DUO_COPY.visualTag}</span>
            <div className="duo-core-node mt-5">CORE</div>
            <div className="duo-connector" />
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/35 mt-4">
              Arquitectura colaborativa en tiempo real
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
            <article className="duo-panel liquid-card">
              <p className="capability-tag">{DUO_COPY.aldo.label}</p>
              <h3 className="font-mono text-white text-2xl mt-4">{DUO_COPY.aldo.heading}</h3>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mt-4">
                {DUO_COPY.aldo.body}
              </p>
            </article>

            <article className="duo-panel liquid-card">
              <p className="capability-tag">{DUO_COPY.genesis.label}</p>
              <h3 className="font-mono text-vite text-2xl mt-4">{DUO_COPY.genesis.heading}</h3>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mt-4">
                {DUO_COPY.genesis.body}
              </p>
            </article>
          </div>

          <p className="font-mono text-vite text-base md:text-lg mt-8 md:mt-10 text-center">
            {DUO_COPY.synthesis}
          </p>
        </div>
      </div>

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
