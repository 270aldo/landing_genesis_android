// ═══════════════════════════════════════════════════════════════
// NGX GENESIS REVEAL — Design Tokens & Narrative Data
// Design System: NGX Vite Style
// ═══════════════════════════════════════════════════════════════

export const TOKENS = {
  bg: "#010101",          // Exact video frame background (sampled)
  bgPrimary: "#16171d",   // Vite primary surface
  bgAlt: "#14121a",       // Elevated surfaces
  bgDeep: "#0c0912",      // Deepest
  border: "#3b3440",      // Section dividers
  electric: "#6c3bff",    // Electric violet
  vite: "#b39aff",        // Primary brand
  brand: "#6b1eb9",       // Deep purple
  zest: "#22ff73",        // Green accent
  aqua: "#32f3e9",        // Aqua accent
  text1: "#ffffff",
  text2: "#98989f",
  text3: "#6a6a71",
  grey: "#827a89",
} as const;

export const TOTAL_FRAMES = 120;
export const SCROLL_HEIGHT_VH = 600; // 6x viewport

// Frame naming: genesis_000.webp through genesis_119.webp
export function getFramePath(index: number): string {
  return `/sequence/genesis_${String(index).padStart(3, "0")}.webp`;
}

// ═══════════════════════════════════════════════════════════════
// NARRATIVE SECTIONS (Tesis de Salud Muscular)
// ═══════════════════════════════════════════════════════════════

export type SectionPosition = "center" | "left" | "right" | "center-bottom";

export interface NarrativeSection {
  id: string;
  scrollStart: number; // 0-1
  scrollEnd: number;   // 0-1
  position: SectionPosition;
  card?: boolean;      // glassmorphism card wrapper
}

export const SECTIONS: NarrativeSection[] = [
  {
    id: "hook",
    scrollStart: 0.0,
    scrollEnd: 0.12,
    position: "center",
  },
  {
    id: "thesis",
    scrollStart: 0.15,
    scrollEnd: 0.30,
    position: "left",
    card: true,
  },
  {
    id: "science",
    scrollStart: 0.33,
    scrollEnd: 0.50,
    position: "right",
  },
  {
    id: "pillars",
    scrollStart: 0.53,
    scrollEnd: 0.68,
    position: "left",
  },
  {
    id: "vehicle",
    scrollStart: 0.70,
    scrollEnd: 0.82,
    position: "right",
    card: true,
  },
  {
    id: "cta",
    scrollStart: 0.85,
    scrollEnd: 1.0,
    position: "center-bottom",
  },
];

// Copy content for each section
export const COPY = {
  hook: {
    label: "LA INDUSTRIA TE MINTIÓ",
    h: "La conversación\nequivocada.",
    body: "Décadas obsesionados con el peso.\nEl problema nunca fue el exceso de grasa.",
    accent: "Es la falta de músculo.",
  },
  thesis: {
    h: "El músculo es el órgano de la longevidad.",
    body: "No es solo fuerza. Es el órgano endocrino más grande de tu cuerpo. Tu moneda metabólica. Tu reservorio de aminoácidos. Tu regulador de inflamación.",
    citation: "— Dra. Gabrielle Lyon, Muscle-Centric Medicine",
  },
  science: {
    h: "La ciencia es inequívoca.",
    stats: [
      { value: 30, unit: "%", label: "mayor riesgo de mortalidad con baja masa muscular" },
      { value: 66, unit: "%", label: "mayor riesgo de mortalidad con baja fuerza muscular" },
      { value: 15, unit: "%", label: "reducción en mortalidad con CUALQUIER entrenamiento de resistencia" },
    ],
    source: "Li et al., Hsieh et al., Shailendra et al. (2022–2025)",
  },
  pillars: {
    h: "De la tesis al sistema.",
    items: [
      { icon: "🏋️", title: "Estímulo Inteligente", desc: "Entrenamiento de resistencia basado en dosis mínima efectiva" },
      { icon: "🥩", title: "Nutrición Centrada en Proteínas", desc: "≥1.6 g/kg/día — la dosis que maximiza masa magra" },
      { icon: "🌙", title: "Recuperación Optimizada", desc: "Sueño y manejo de estrés como componentes no negociables" },
      { icon: "📊", title: "Medición Real", desc: "Fuerza de agarre, no IMC. Función, no solo forma." },
    ],
  },
  vehicle: {
    h: "IA + Coach Humano.",
    body: "La ciencia es clara. Implementarla a escala requiere tecnología. Pero la adherencia requiere humanidad.",
    body2: "GENESIS es el motor que escala la ciencia.\nTu coach es quien garantiza que la apliques.",
    accent: "13 agentes especializados. Un cerebro central: NEXUS.",
  },
  cta: {
    mega: "NGX",
    h: "GENESIS",
    tagline: "Performance & Longevity",
    quote: "La epidemia de obesidad no es de exceso de grasa.\nEs de falta de músculo.",
    cta: "INICIAR PROTOCOLO",
    sub: "Rinde hoy. Vive mejor mañana.",
  },
} as const;
