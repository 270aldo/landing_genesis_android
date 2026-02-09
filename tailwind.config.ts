import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NGX Vite Style tokens
        genesis: {
          bg: "#010101",      // Exact video frame background
        },
        primary: "#16171d",   // Vite primary surface
        slate: "#14121a",     // Elevated surfaces
        midnight: "#0c0912",  // Deepest black
        wine: "#140033",      // Dramatic sections
        nickel: "#3b3440",    // Borders
        grey: "#827a89",      // Labels
        electric: "#6c3bff",  // Electric violet
        vite: "#b39aff",      // Primary brand violet
        brand: "#6b1eb9",     // Deep purple
        zest: "#22ff73",      // Green accent
        aqua: "#32f3e9",      // Aqua accent
        "purple-1": "#c8abfa",
        "purple-2": "#a879e6",
        "purple-3": "#8e5cd9",
      },
      fontFamily: {
        heading: ['"JetBrains Mono"', "monospace"],
        body: ["Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      letterSpacing: {
        "tight-hero": "-3px",
        "tight-h2": "-1.2px",
        "tight-h3": "-1px",
        "tight-h4": "-0.5px",
      },
      maxWidth: {
        content: "976px",
      },
      animation: {
        "scan-line": "scanLine 5s linear infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        shimmer: "shimmerText 8s linear infinite",
      },
      keyframes: {
        scanLine: {
          "0%": { top: "-2px" },
          "100%": { top: "100%" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.3)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmerText: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
