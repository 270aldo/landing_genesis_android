"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import {
  TOKENS,
  TOTAL_FRAMES,
  SCROLL_HEIGHT_VH,
  SECTIONS,
  COPY,
  getFramePath,
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
      let start = 0;
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
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // --- Refs ---
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number>(0);

  // --- Scroll tracking ---
  const { scrollYProgress } = useScroll({ target: containerRef });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollProgress(v);
    const frameIndex = Math.min(Math.floor(v * TOTAL_FRAMES), TOTAL_FRAMES - 1);
    setCurrentFrame(Math.max(0, frameIndex));
  });

  // --- Preload images ---
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const promises = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          loadedCount++;
          setLoadProgress(loadedCount / TOTAL_FRAMES);
          resolve(img);
        };
        img.onerror = reject;
      });
    });

    Promise.all(promises).then((imgs) => {
      imagesRef.current = imgs;
      setLoaded(true);
    });
  }, []);

  // --- Draw to canvas ---
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[currentFrame];
    if (!img) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    });
  }, [loaded, currentFrame]);

  // --- Section opacities ---
  const sectionOpacities = useMemo(() => {
    return SECTIONS.map((s) => getSectionOpacity(scrollProgress, s));
  }, [scrollProgress]);

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
            {padFrame(currentFrame)} / {padFrame(TOTAL_FRAMES - 1)}
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

            <button className="btn-glow font-mono font-bold text-sm text-white px-8 py-3 rounded-full mt-6 pointer-events-auto cursor-pointer">
              {COPY.cta.cta}
            </button>

            <p className="text-[11px] text-white/30 mt-3">{COPY.cta.sub}</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          POST-SCROLL: EL SISTEMA
          ═══════════════════════════════════════════════════════════════ */}
      <div className="vite-section vite-frame" style={{ background: TOKENS.bgPrimary }}>
        <div className="max-w-content mx-auto px-10 py-28 text-center">
          <p className="vite-label text-white/40 mb-6">EL SISTEMA</p>
          <h2
            className="vite-h2 text-white mb-6"
            style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }}
          >
            Construido para quienes juegan a largo plazo.
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            NGX GENESIS combina inteligencia artificial con coaching humano para transformar la
            ciencia de la salud muscular en un sistema de rendimiento y longevidad personalizado.
            13 agentes especializados. Un cerebro central. Tu coach garantizando la adherencia.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <div className="vite-section vite-frame" style={{ background: TOKENS.bg }}>
        <div className="max-w-content mx-auto px-10 py-10 flex items-center justify-between">
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
