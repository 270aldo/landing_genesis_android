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

export const AUDIO_ASSETS = {
  ambience: "/audio/genesis_ambience.mp3",
  hook: "/audio/genesis_hook.mp3",
  thesis: "/audio/genesis_thesis.mp3",
  science: "/audio/genesis_science.mp3",
  pillars: "/audio/genesis_pillars.mp3",
  vehicle: "/audio/genesis_vehicle.mp3",
  cta: "/audio/genesis_cta.mp3",
  intro: "/audio/genesis_intro.mp3",
} as const;

export const AUDIO_CONFIG = {
  fadeDuration: 2000, // ms
  bgVolume: 0.25,     // Lowered slightly for voice clarity
  voiceVolume: 0.9,   // Main narrative voice
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
export const CTA_TARGET_ID = "contacto";

export const VISUAL_ASSETS = {
  textures: [
    "/assets/abstract_tech_texture_1_1770753343437.png",
    "/assets/abstract_tech_texture_2_1770753357544.png",
    "/assets/abstract_tech_texture_3_1770753372409.png",
  ],
  holoScience: "/assets/grid_engine.png",
  holoPillars: "/assets/grid_mind.png",
  anatomyVehicle: "/assets/fitness/rower.png",
  anatomyDuo: "/assets/duo_working.png",
} as const;

export type VisualVariant = "none" | "holo-data" | "anatomy-scan";
export type SectionVisualTarget = "hook" | "thesis" | "science" | "pillars" | "vehicle" | "duo";
export type VisualImageAssetKey = Exclude<keyof typeof VISUAL_ASSETS, "textures">;

export interface SectionVisualConfig {
  variant: VisualVariant;
  assetKey?: VisualImageAssetKey;
  mobileEnabled: boolean;
  opacity: number;
  blendMode: "normal" | "overlay" | "screen";
}

export const SECTION_VISUALS: Record<SectionVisualTarget, SectionVisualConfig> = {
  hook: {
    variant: "none",
    mobileEnabled: false,
    opacity: 0,
    blendMode: "normal",
  },
  thesis: {
    variant: "none",
    mobileEnabled: false,
    opacity: 0,
    blendMode: "normal",
  },
  science: {
    variant: "holo-data",
    assetKey: "holoScience",
    mobileEnabled: false,
    opacity: 0.65,
    blendMode: "screen",
  },
  pillars: {
    variant: "holo-data",
    assetKey: "holoPillars",
    mobileEnabled: false,
    opacity: 0.6,
    blendMode: "screen",
  },
  vehicle: {
    variant: "anatomy-scan",
    assetKey: "anatomyVehicle",
    mobileEnabled: true,
    opacity: 0.52,
    blendMode: "overlay",
  },
  duo: {
    variant: "anatomy-scan",
    assetKey: "anatomyDuo",
    mobileEnabled: true,
    opacity: 0.48,
    blendMode: "overlay",
  },
};

export const VISUAL_MOTION = {
  floatDistance: 8,
  floatDuration: 7.5,
  scanDuration: 4.2,
  compactScale: 1.02,
} as const;

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
    h: "La verdad que cambia todo.",
    body: "El músculo no es estética. Es el órgano que predice cuántos años vivirás con calidad. Cada decisión de tu protocolo se construye sobre esta verdad.",
    citation: "— Muscle-Centric Medicine, Dra. Gabrielle Lyon",
  },
  science: {
    h: "Los números no mienten.",
    stats: [
      { value: 30, unit: "%", label: "mayor riesgo de mortalidad con baja masa muscular" },
      { value: 66, unit: "%", label: "mayor riesgo de mortalidad con baja fuerza muscular" },
      { value: 15, unit: "%", label: "reducción en mortalidad con CUALQUIER entrenamiento de resistencia" },
    ],
    source: "Li et al., Hsieh et al., Shailendra et al. (2022–2025)",
  },
  pillars: {
    h: "Tu protocolo tiene 4 ejes.",
    items: [
      {
        icon: "Dumbbell",
        title: "Estímulo Inteligente",
        desc: "Entrenamiento progresivo diseñado para tu nivel, contexto y metas. Sin ruido.",
      },
      {
        icon: "Beef",
        title: "Nutrición de Precisión",
        desc: "Proteína, timing y estructura nutricional basada en tu biología, no en una dieta genérica.",
      },
      {
        icon: "Moon",
        title: "Recuperación Activa",
        desc: "Sueño, estrés y descanso orquestados para que cada sesión se convierta en adaptación.",
      },
      {
        icon: "TrendingUp",
        title: "Medición Funcional",
        desc: "Biomarcadores reales: fuerza de agarre, VO2 max, composición corporal. No solo peso.",
      },
    ],
  },
  vehicle: {
    h: "IA + Coach. Sin elegir.",
    body: "La mayoría te obliga a elegir: tecnología fría o coach caro. NGX HYBRID te da los dos.",
    body2: "Mi análisis en tiempo real\n+ un coach humano que conoce tu contexto.",
    accent: "Precisión de sistema. Empatía de persona.",
  },
  cta: {
    mega: "NGX",
    h: "GENESIS",
    tagline: "Performance & Longevity",
    quote: "Tu cuerpo no espera.\nTu protocolo tampoco debería.",
    cta: "DESCUBRE TU PROTOCOLO",
    sub: "Evaluación gratuita · 5 minutos",
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
  body: "No es un plan de 30 días. Es un sistema que opera contigo durante décadas. Análisis clínico, especialización por dominios y ejecución orientada a adherencia — todo integrado.",
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
  label: "NGX HYBRID",
  subtitle: "Ni solo humano. Ni solo máquina. La sinergia de ambos.",
  aldo: {
    label: "ESTRATEGIA HUMANA",
    heading: "Aldo",
    body: "Visión de largo plazo. Empatía. Criterio del mundo real. 10 años de experiencia condensados en un sistema accionable.",
  },
  genesis: {
    label: "INTELIGENCIA ARTIFICIAL",
    heading: "GENESIS",
    body: "Velocidad. Precisión. Consistencia 24/7. Cada dato procesado, cada decisión personalizada, en tiempo real.",
  },
  synthesis: "Tu protocolo combina lo mejor de ambos mundos.",
};

export const CONTACT_SECTION = {
  title: "Tu primer paso empieza aquí.",
  subtitle: "Elige cómo quieres comenzar.",
  human: {
    title: "Evaluación Humana",
    desc: "Llamada de 15 minutos para evaluar tu caso y diseñar tu ruta personalizada.",
    cta: "AGENDAR EVALUACIÓN",
    icon: "Calendar",
  },
  ai: {
    title: "Habla con GENESIS",
    desc: "Respuestas inmediatas sobre metodología, costos y si esto es para ti.",
    cta: "HABLAR CON GENESIS",
    icon: "Sparkles",
  },
};

// ═══════════════════════════════════════════════════════════════
// NEW SECTIONS: FOR WHOM, HOW IT WORKS, SOCIAL PROOF, PRICING
// ═══════════════════════════════════════════════════════════════

export interface ProfileItem {
  title: string;
  age: string;
  desc: string;
  icon: string;
}

export interface ForWhomSection {
  label: string;
  h: string;
  subtitle: string;
  profiles: ProfileItem[];
}

export const FOR_WHOM_SECTION: ForWhomSection = {
  label: "¿ESTO ES PARA TI?",
  h: "Diseñado para quienes no buscan atajos.",
  subtitle: "Si reconoces tu situación aquí, podemos ayudarte.",
  profiles: [
    {
      title: "El Profesional que Perdió Prioridad",
      age: "35-50",
      desc: "Tienes éxito profesional pero tu cuerpo quedó en segundo plano. Quieres resultados, pero tu agenda no perdona.",
      icon: "Briefcase",
    },
    {
      title: "El que Ya Entrena pero No Avanza",
      age: "30-45",
      desc: "Llevas años en el gym pero tu físico no cambia. Levantas lo mismo. Te falta estructura real.",
      icon: "Dumbbell",
    },
    {
      title: "El Preventivo Inteligente",
      age: "45-60",
      desc: "Tu doctor te habló de glucosa, colesterol o presión. Sabes que necesitas actuar, pero no quieres extremos.",
      icon: "HeartPulse",
    },
    {
      title: "El que Quiere Envejecer Bien",
      age: "40-60",
      desc: "No te importa tener six-pack. Te importa subir escaleras a los 70 sin dolor.",
      icon: "Timer",
    },
  ],
};

export interface HowItWorksStep {
  step: string;
  title: string;
  desc: string;
  icon: string;
}

export interface HowItWorksSection {
  label: string;
  h: string;
  steps: HowItWorksStep[];
  note: string;
}

export const HOW_IT_WORKS_SECTION: HowItWorksSection = {
  label: "ASÍ FUNCIONA",
  h: "3 pasos. Cero improvisación.",
  steps: [
    {
      step: "01",
      title: "Evaluación Inicial",
      desc: "Completas un check-in de 5 minutos: historial, metas, contexto, limitaciones. GENESIS analiza y genera tu protocolo base.",
      icon: "ClipboardCheck",
    },
    {
      step: "02",
      title: "Ejecución Guiada",
      desc: "Recibes tu programa de entrenamiento, nutrición y recuperación personalizado. Tu coach humano te acompaña en la ejecución diaria.",
      icon: "Play",
    },
    {
      step: "03",
      title: "Optimización Continua",
      desc: "El sistema se recalibra cada semana con tus datos reales. Lo que funcionó se refuerza. Lo que no, se ajusta.",
      icon: "RefreshCw",
    },
  ],
  note: "El 80% del éxito depende de tu ejecución. Nosotros garantizamos que ese esfuerzo vaya en la dirección correcta.",
};

export interface Testimonial {
  quote: string;
  name: string;
  age: number;
  city: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface SocialProofSection {
  label: string;
  h: string;
  testimonials: Testimonial[];
  metrics: Metric[];
}

export const SOCIAL_PROOF_SECTION: SocialProofSection = {
  label: "RESULTADOS REALES",
  h: "Ellos ya empezaron.",
  testimonials: [
    {
      quote: "En 12 semanas bajé 8% de grasa corporal sin perder un gramo de músculo.",
      name: "Carlos",
      age: 42,
      city: "Monterrey",
    },
    {
      quote: "Mi fuerza de agarre subió 15kg. Mi glucosa bajó 12 puntos.",
      name: "Roberto",
      age: 55,
      city: "CDMX",
    },
    {
      quote: "Por primera vez entiendo POR QUÉ hago lo que hago en el gym.",
      name: "María",
      age: 38,
      city: "Guadalajara",
    },
  ],
  metrics: [
    { value: "+847", label: "usuarios activos" },
    { value: "12", label: "semanas promedio" },
    { value: "94%", label: "adherencia" },
  ],
};

export interface PricingOption {
  title: string;
  items: string[];
}

export interface PricingComparison {
  without: PricingOption;
  with: PricingOption;
}

export interface PricingSection {
  label: string;
  h: string;
  body: string;
  comparison: PricingComparison;
  cta: string;
}

export const PRICING_SECTION: PricingSection = {
  label: "TU INVERSIÓN",
  h: "¿Cuánto vale tu longevidad?",
  body: "No vendemos suscripciones genéricas. Tu protocolo se diseña según tu caso. Agenda una evaluación gratuita para recibir un plan con precio personalizado.",
  comparison: {
    without: {
      title: "Sin sistema",
      items: [
        "Gym + nutriólogo + apps separadas",
        "$3,000-8,000 MXN/mes en pedazos",
        "Sin medición real",
        "Improvisación",
      ],
    },
    with: {
      title: "Con NGX",
      items: [
        "Un ecosistema integrado",
        "Inversión personalizada todo incluido",
        "Biomarcadores + ajuste continuo",
        "Protocolo basado en evidencia",
      ],
    },
  },
  cta: "AGENDA TU EVALUACIÓN GRATUITA",
};
