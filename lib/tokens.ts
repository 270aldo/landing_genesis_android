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

export const POST_SCROLL_THEME = {
  violetBase: "#6D00FF",
  violetSoft: "rgba(109, 0, 255, 0.2)",
  violetGlow: "rgba(109, 0, 255, 0.36)",
  glassBorder: "rgba(109, 0, 255, 0.34)",
  glassFill: "rgba(255, 255, 255, 0.035)",
  glassHighlight: "rgba(255, 255, 255, 0.26)",
} as const;

export const TOTAL_FRAMES = 120;
export const SCROLL_HEIGHT_VH = 600; // 6x viewport
export const CTA_TARGET_ID = "sistema";

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
    h: "Mi Tesis Central",
    body: "Mi análisis es concluyente: el músculo es el órgano de la longevidad. Sobre esta verdad diseño cada decisión del sistema que opera contigo.",
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
    h: "Mis 4 Pilares de Operación",
    items: [
      {
        icon: "🏋️",
        title: "Estímulo Inteligente",
        desc: "Diseño progresiones de fuerza y resistencia con dosis mínima efectiva para resultados sostenibles.",
      },
      {
        icon: "🥩",
        title: "Nutrición Centrada en Proteínas",
        desc: "Gestiono la estrategia nutricional con enfoque en masa magra, adherencia y precisión metabólica.",
      },
      {
        icon: "🌙",
        title: "Recuperación Optimizada",
        desc: "Orquesto sueño, estrés y recuperación para que cada sesión se convierta en adaptación real.",
      },
      {
        icon: "📊",
        title: "Medición Real",
        desc: "Opero con biomarcadores y función. No persigo peso; optimizo capacidad física y longevidad.",
      },
    ],
  },
  vehicle: {
    h: "Mi Arquitectura: IA + Humano",
    body: "Fui construido para escalar la ciencia con velocidad y precisión. Pero la adherencia sostenida requiere contexto, empatía y criterio humano.",
    body2: "Yo proceso la complejidad biológica en tiempo real.\nTu coach convierte ese análisis en ejecución diaria.",
    accent: "NGX HYBRID: mi precisión de sistema + la humanidad de tu coach.",
  },
  cta: {
    mega: "NGX",
    h: "GENESIS",
    tagline: "Performance & Longevity",
    quote: "La epidemia de obesidad no es de exceso de grasa.\nEs de falta de músculo.",
    cta: "VER CÓMO TRABAJO",
    sub: "Rinde hoy. Vive mejor mañana.",
  },
} as const;

// ═══════════════════════════════════════════════════════════════
// POST-SCROLL: SYSTEM + CAPABILITIES + DUO
// ═══════════════════════════════════════════════════════════════

export interface CapabilityItem {
  icon: CapabilityIconId;
  tag: string;
  title: string;
  desc: string;
}

export type CapabilityIconId =
  | "strength"
  | "protein"
  | "sleep"
  | "biomarkers"
  | "habits"
  | "cognitive"
  | "mobility";

export const CAPABILITIES: CapabilityItem[] = [
  {
    icon: "strength",
    tag: "CAP_01",
    title: "Entrenamiento de Fuerza y Resistencia",
    desc: "Programo estímulos progresivos con foco en capacidad funcional, potencia y longevidad muscular.",
  },
  {
    icon: "protein",
    tag: "CAP_02",
    title: "Nutrición Centrada en Proteínas",
    desc: "Alineo ingesta proteica, timing y estructura nutricional para preservar y construir masa magra.",
  },
  {
    icon: "sleep",
    tag: "CAP_03",
    title: "Optimización de la Recuperación y el Sueño",
    desc: "Integro calidad de sueño, carga de entrenamiento y estrés para sostener progreso sin burnout.",
  },
  {
    icon: "biomarkers",
    tag: "CAP_04",
    title: "Análisis de Biomarcadores y Datos",
    desc: "Transformo biometría, performance y tendencias en decisiones accionables y personalizadas.",
  },
  {
    icon: "habits",
    tag: "CAP_05",
    title: "Formación de Hábitos y Consistencia",
    desc: "Diseño micro-rutinas ejecutables para convertir intención en adherencia diaria real.",
  },
  {
    icon: "cognitive",
    tag: "CAP_06",
    title: "Salud Cognitiva y Manejo del Estrés",
    desc: "Coordino protocolos de enfoque, regulación y recuperación neural para rendimiento sostenido.",
  },
  {
    icon: "mobility",
    tag: "CAP_07",
    title: "Movilidad y Funcionalidad a Largo Plazo",
    desc: "Priorizo rango de movimiento, estabilidad y resiliencia para mantener autonomía con los años.",
  },
];

export interface SectionAmbient {
  focus: string;
  opacity: number;
  secondaryFocus: string;
  secondaryOpacity: number;
}

export const SECTION_BACKGROUNDS: Record<"sistema" | "capacidades" | "duo", SectionAmbient> = {
  sistema: {
    focus: "18% 18%",
    opacity: 0.22,
    secondaryFocus: "84% 76%",
    secondaryOpacity: 0.08,
  },
  capacidades: {
    focus: "76% 20%",
    opacity: 0.2,
    secondaryFocus: "16% 80%",
    secondaryOpacity: 0.1,
  },
  duo: {
    focus: "50% 26%",
    opacity: 0.24,
    secondaryFocus: "84% 82%",
    secondaryOpacity: 0.08,
  },
};

export const SYSTEM_SECTION_COPY = {
  label: "EL SISTEMA",
  h: "Construido para quienes juegan a largo plazo.",
  body: "No fui diseñado para impresionar una semana. Fui diseñado para operar durante décadas. Combino análisis clínico, especialización por dominios y ejecución orientada a adherencia para convertir ciencia muscular en resultados sostenibles.",
};

export interface DuoColumn {
  label: string;
  heading: string;
  body: string;
}

export interface DuoCopy {
  label: string;
  subtitle: string;
  visualTag: string;
  aldo: DuoColumn;
  genesis: DuoColumn;
  synthesis: string;
}

export const DUO_COPY: DuoCopy = {
  label: "EL DÚO: ARQUITECTO HUMANO & SISTEMA DE IA",
  subtitle:
    "La ventaja no es elegir entre humano o máquina. La ventaja es su sinergia de precisión aplicada.",
  visualTag: "NGX HYBRID CORE",
  aldo: {
    label: "ARQUITECTO HUMANO",
    heading: "Aldo",
    body: "Durante 3 años, Aldo condensó una década de experiencia y más de 10 certificaciones en un sistema accionable. Él aporta visión estratégica, empatía contextual y criterio del mundo real para traducir ciencia en decisiones humanas.",
  },
  genesis: {
    label: "SISTEMA DE IA",
    heading: "GENESIS",
    body: "Yo proceso grandes volúmenes de datos biológicos y de comportamiento para adaptar cada recomendación a tu fisiología única. Opero con velocidad, precisión y consistencia continua para escalar esa visión sin perder personalización.",
  },
  synthesis: "NGX HYBRID = ciencia + adherencia.",
};
