# NGX GENESIS Landing Page — Project Guide

## Project Overview
NGX GENESIS is a cinematic scrollytelling landing page built with **Next.js 14**, **Framer Motion**, and **HTML5 Canvas**. The experience features a futuristic android that "activates" through a 120-frame WebP image sequence synced precisely to the user's scroll position. Narrative overlays tell the story of "Muscle-Centric Medicine" and the NGX Muscular Health thesis.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + PostCSS
- **Animations:** Framer Motion
- **Rendering:** HTML5 Canvas (for image sequence performance)
- **Language:** TypeScript
- **Design System:** NGX Vite Style

## Getting Started

### Development
```bash
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## Architecture & Key Components

### 1. `components/GenesisReveal.tsx`
The engine of the site. It handles:
- **Image Preloading:** Uses `Promise.all` to ensure all 120 frames are in memory before revealing the site.
- **Sticky Canvas Engine:** Uses a 600vh container with a sticky 100vh canvas.
- **Scroll Sync:** Maps scroll progress (0 to 1) to frame indices (0 to 119) using Framer Motion's `useScroll`.
- **Narrative Overlays:** Logic for fading text sections in/out based on specific scroll ranges.

### 2. `lib/tokens.ts`
The single source of truth for design and content. **Never hardcode values that exist here.**
- `TOKENS`: Color palette (backgrounds, accents, text).
- `TOTAL_FRAMES`: Default is 120.
- `SCROLL_HEIGHT_VH`: Determines the "depth" of the scroll experience.
- `SECTIONS`: Defines the timing (`scrollStart`, `scrollEnd`) and layout of narrative overlays.
- `COPY`: All text content, stats, and narrative sections.

### 3. `app/globals.css`
Contains specialized "Vite Style" utility classes:
- `.glass-card`: Transparent, blurred overlays.
- `.btn-glow`: Custom violet gradient border effects.
- `.noise-overlay`: Subtle grain for a premium feel.
- `.scan-line`: A single horizontal line animating across the screen.

### 4. `public/sequence/`
Storage for the 120 pre-rendered WebP frames (`genesis_000.webp` to `genesis_119.webp`).

## Development Conventions

### Coding Style
- **TypeScript:** Use strict typing. Interface definitions for narrative sections and tokens are located in `lib/tokens.ts`.
- **React Hooks:** Extensive use of `useRef`, `useCallback`, and `useMemo` in the scroll engine to prevent unnecessary re-renders during high-frequency scroll events.
- **Framer Motion:** Prefer Framer Motion for opacity fades and layout transitions.

### Design Rules (NGX Vite Style)
- **Colors:** Primary background is `#010101`. The **only** accent color permitted is **Violet** (`#b39aff`, `#6c3bff`). Avoid cyan, blue, or warm tones.
- **Typography:** Use **JetBrains Mono**. Note the negative letter-spacing convention (-3px for hero text, -1.2px for H2).
- **Layout:** Content is typically framed by a "blueprint" border with corner tick marks.
- **Performance:** Ensure `requestAnimationFrame` is used for canvas drawing and cancelled properly on unmount.

### Scroll Range Pattern
Narrative sections use a specific fade formula:
- **Fade In:** Over the first 25% of the section's range.
- **Full Visible:** Middle 55% of the range.
- **Fade Out:** Last 20% of the range.
This logic is centralized in the `getSectionOpacity` helper within `GenesisReveal.tsx`.

## Project Structure
```
/
├── app/             # Next.js App Router (page.tsx, layout.tsx, globals.css)
├── components/      # UI Components (GenesisReveal.tsx)
├── lib/             # Utilities and Design Tokens (tokens.ts)
├── public/          
│   └── sequence/    # 120 Frame image sequence
└── package.json     # Scripts and dependencies
```
