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

export const AUDIO = {
  // TODO: Replace with actual ElevenLabs URL provided by user
  genesisVoiceId: "PLACEHOLDER_ID",
  baseUrl: "https://api.elevenlabs.io/v1/text-to-speech",
} as const;

export const AUDIO_CONFIG = {
  fadeDuration: 2000,
  bgVolume: 0.3,
  voiceVolume: 1.0,
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
export const SCROLL_HEIGHT_VH = 1200; // 12x viewport for smoother pacing
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
        icon: "Dumbbell",
        title: "Estímulo Inteligente",
        desc: "Diseño progresiones de fuerza y resistencia con dosis mínima efectiva para resultados sostenibles.",
      },
      {
        icon: "Beef",
        title: "Nutrición Centrada en Proteínas",
        desc: "Gestiono la estrategia nutricional con enfoque en masa magra, adherencia y precisión metabólica.",
      },
      {
        icon: "Moon",
        title: "Recuperación Optimizada",
        desc: "Orquesto sueño, estrés y recuperación para que cada sesión se convierta en adaptación real.",
      },
      {
        icon: "TrendingUp",
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

export interface CapabilityDetails {
  subtitle: string;
  problem: string;
  solution: string;
  stat: string;
  statLabel: string;
}

export interface CapabilityItem {
  icon: CapabilityIconId;
  tag: string;
  title: string;
  desc: string;
  details: CapabilityDetails;
}

export type CapabilityIconId =
  | "Dumbbell"
  | "Beef"
  | "Moon"
  | "Activity"
  | "Brain"
  | "Cpu"
  | "Accessibility";

export const CAPABILITIES: CapabilityItem[] = [
  {
    icon: "Dumbbell",
    tag: "CAP_01",
    title: "Entrenamiento de Fuerza y Resistencia",
    desc: "Programo estímulos progresivos con foco en capacidad funcional, potencia y longevidad muscular.",
    details: {
      subtitle: "El músculo es el órgano de la longevidad.",
      problem: "La conversación dominante es de restricción y pérdida de peso. El problema no es el exceso de grasa; es la falta de músculo.",
      solution: "El músculo es tu armadura metabólica y el predictor #1 de mortalidad. Programo estímulos progresivos para maximizar tu 'Musclespan'.",
      stat: "-66%",
      statLabel: "Riesgo Mortalidad (Baja Fuerza)",
    },
  },
  {
    icon: "Beef",
    tag: "CAP_02",
    title: "Nutrición Centrada en Proteínas",
    desc: "Alineo ingesta proteica, timing y estructura nutricional para preservar y construir masa magra.",
    details: {
      subtitle: "Superando la resistencia anabólica.",
      problem: "Con la edad, el cuerpo se vuelve menos sensible a los estímulos para construir músculo. Un adulto de 50 años necesita más proteína que uno de 25.",
      solution: "Estrategia centrada en proteínas. Objetivo basado en evidencia: ≥1.6 g/kg/día para maximizar la masa magra.",
      stat: "≥1.6g",
      statLabel: "Proteína por kg/día",
    },
  },
  {
    icon: "Moon",
    tag: "CAP_03",
    title: "Recuperación Optimizada",
    desc: "Orquesto sueño, estrés y recuperación para que cada sesión se convierta en adaptación real.",
    details: {
      subtitle: "Recuperación no negociable.",
      problem: "El estrés crónico y el mal sueño degradan el músculo a través del cortisol. Sin recuperación, no hay adaptación.",
      solution: "Orquesto sueño y gestión del estrés para optimizar la síntesis de proteínas y la regulación hormonal.",
      stat: "100%",
      statLabel: "Requisito de Adaptación",
    },
  },
  {
    icon: "Activity",
    tag: "CAP_04",
    title: "Medición Real",
    desc: "Opero con biomarcadores y función. No persigo peso; optimizo capacidad física y longevidad.",
    details: {
      subtitle: "Medicina de precisión aplicada.",
      problem: "El peso corporal es una métrica incompleta. Lo que no se mide con precisión, no se puede mejorar.",
      solution: "Opero con biomarcadores funcionales. La fuerza de agarre y la velocidad de marcha son predictores más potentes de longevidad que el IMC.",
      stat: "KPI",
      statLabel: "Grip Strength & Vo2 Max",
    },
  },
  {
    icon: "Cpu",
    tag: "CAP_05",
    title: "Sistemas & Hábitos",
    desc: "Diseño entornos y rutinas que eliminan la fricción. La motivación es efímera; el sistema es permanente.",
    details: {
      subtitle: "Consistencia sobre intensidad.",
      problem: "La motivación es efímera. La mayoría de los programas fallan por falta de adherencia real.",
      solution: "Construyo sistemas, no retos. La adherencia es la única variable que garantiza el interés compuesto en tu salud.",
      stat: "365",
      statLabel: "Días de Ejecución",
    },
  },
  {
    icon: "Brain",
    tag: "CAP_06",
    title: "Salud Cognitiva",
    desc: "Potencio el eje músculo-cerebro. El ejercicio es el fertilizante neuronal más potente que existe.",
    details: {
      subtitle: "Crosstalk Músculo-Cerebro.",
      problem: "La disfunción muscular contribuye al deterioro cognitivo. El cuerpo y la mente no son sistemas separados.",
      solution: "Mioquinas como BDNF e Irisina, liberadas durante la contracción, promueven la neurogénesis y plasticidad cerebral.",
      stat: "BDNF",
      statLabel: "Fertilizante Cerebral",
    },
  },
  {
    icon: "Accessibility",
    tag: "CAP_07",
    title: "Movilidad & Estructura",
    desc: "Construyo la base mecánica para que tu cuerpo opere sin dolor ni límites durante décadas.",
    details: {
      subtitle: "Infraestructura para la vida.",
      problem: "La fragilidad es el enemigo. Un músculo fuerte construye un hueso fuerte, previniendo la osteoporosis.",
      solution: "Entrenamiento enfocado en rango de movimiento bajo carga. El músculo y el hueso se comunican constantemente.",
      stat: "-30%",
      statLabel: "Riesgo Mortalidad (Baja Masa)",
    },
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
  aldo: DuoColumn;
  genesis: DuoColumn;
  synthesis: string;
}

export const DUO_COPY: DuoCopy = {
  label: "EL DÚO: ARQUITECTO HUMANO & SISTEMA DE IA",
  subtitle:
    "La ventaja no es elegir entre humano o máquina. La ventaja es su sinergia de precisión aplicada.",
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

export const CONTACT_SECTION = {
  title: "Inicia tu Protocolo",
  subtitle: "Dos caminos para dar el primer paso.",
  human: {
    title: "Estrategia Humana",
    desc: "Agenda una llamada de 15 min con un especialista para evaluar tu caso.",
    cta: "AGENDAR LLAMADA",
    icon: "Calendar",
  },
  ai: {
    title: "Interfaz Genesis",
    desc: "Habla directamente con mi núcleo de IA. Respuestas inmediatas sobre costos y metodología.",
    cta: "INICIAR CHAT",
    icon: "Sparkles",
  },
};

export const PERFORMANCE_GRID = {
  engine: {
    label: "THE_ENGINE",
    stat: "VO2_MAX_OPTIMIZED",
    desc: "Metabolic conditioning without joint impact.",
  },
  mind: {
    label: "THE_MIND",
    stat: "NEURO_PRIMED",
    desc: "Focus state activation.",
  },
  fuel: {
    label: "THE_FUEL",
    stat: "METABOLIC_EFFICIENCY",
    desc: "Nutrition as a precision tool.",
  },
};

export const USER_JOURNEY_SECTION = {
  label: "TU ROL",
  title: "Tú pones la voluntad. Nosotros la precisión.",
  subtitle:
    "Genesis no es un piloto automático; es un copiloto de alto rendimiento. Nuestra tecnología traduce la ciencia, pero tu disciplina traduce los datos en resultados.",
  responsibilityNote:
    "El 80% del éxito depende de tu ejecución diaria. Nosotros garantizamos que ese esfuerzo sea en la dirección correcta.",
  steps: [
    {
      step: "01",
      title: "Recolección de Datos",
      desc: "Sincronizas tus biométricos y respondes a los requerimientos de la IA.",
    },
    {
      step: "02",
      title: "Ejecución Crítica",
      desc: "Sigues el protocolo de entrenamiento y nutrición con precisión quirúrgica.",
    },
    {
      step: "03",
      title: "Feedback Operativo",
      desc: "Reportas sensaciones y métricas para que el sistema se recalibre en tiempo real.",
    },
  ],
};

