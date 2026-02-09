# GENESIS REVEAL — Scrollytelling Landing Page

## What This Is

A cinematic scrollytelling experience for NGX GENESIS. The user scrolls and a futuristic android "activates" progressively through 120 pre-rendered frames tied to scroll position. Text narrative overlays tell the story of the Muscular Health thesis.

**Think Apple product reveal meets scientific manifesto.**

## What's Already Done

- **120 WebP frames** in `public/sequence/` (genesis_000.webp → genesis_119.webp, 1920×1080, 14.2MB total)
- **Design tokens and copy** in `lib/tokens.ts` (all colors, section data, narrative text)
- **Tailwind config** with NGX Vite Style tokens (JetBrains Mono, violet palette, blueprint borders)
- **Global CSS** with Vite Style classes (.glass-card, .btn-glow, .scan-line, .noise-overlay, .vite-section, etc.)
- **Layout** with Google Fonts pre-connected (JetBrains Mono + Inter)
- **Scaffold** component at `components/GenesisReveal.tsx`

## What You Need To Build

Implement `components/GenesisReveal.tsx` as a complete, production-ready scroll experience.

### 1. IMAGE PRELOADER + LOADING SCREEN

```
- Preload all 120 images using Promise.all
- Use getFramePath(i) from lib/tokens.ts for paths
- Show loading screen: black #010101 bg, pulsing violet dot, "CARGANDO PROTOCOLO..." label, thin progress bar
- Smooth fade-out transition when loaded
```

### 2. STICKY CANVAS SCROLL ENGINE

```
- Outer container: height = 600vh (SCROLL_HEIGHT_VH from tokens)
- Inner sticky viewport: position sticky, top 0, height 100vh
- HTML5 Canvas centered in viewport (object-fit: contain behavior)
- useScroll() from framer-motion tracks scroll progress (0→1)
- Map scroll progress to frame index (0→119)
- Draw frame to canvas via requestAnimationFrame
- CRITICAL: Canvas must scale properly on all screen sizes
  The frames are 1920×1080 — scale to fit viewport while maintaining aspect ratio
```

### 3. NARRATIVE OVERLAY SECTIONS

Six text sections that fade in/out at specific scroll percentages. All data is in SECTIONS and COPY from lib/tokens.ts.

**Positioning rules:**
- Text NEVER covers the android's face or chest (center of frame)
- "left" sections: left 5%, max-width 38%
- "right" sections: right 5%, max-width 38%  
- "center" section (hook): full-width centered, upper area
- "center-bottom" section (CTA): centered, bottom 10%

**Each section fades:**
- Fade in: first 25% of its scroll range
- Full visible: middle 55%
- Fade out: last 20% of its scroll range

**Section details:**

**SCROLL 0–12% — "THE HOOK" (center)**
- Label: uppercase mono, tracking-wide, white/40
- H1: vite-h1 style (JetBrains Mono, -3px letter-spacing), clamp(32px, 5vw, 56px)
- Body: white/50
- Accent line: "Es la falta de músculo." in vite violet, appears with 800ms delay

**SCROLL 15–30% — "THE THESIS" (left, glassmorphism card)**
- Use .glass-card class
- H2: vite-h2 style, clamp(22px, 3vw, 36px)
- Body: white/90
- Citation: italic, white/30, 12px

**SCROLL 33–50% — "THE SCIENCE" (right)**
- H2 + 3 stat blocks
- Stats: animated count-up from 0 to final value when section becomes visible
- Each stat staggers 300ms after previous
- Number: font-mono, clamp(36px, 5vw, 48px), color vite (#b39aff)
- Label: 13px, white/60
- Source: mono 10px, white/20

**SCROLL 53–68% — "THE 4 PILLARS" (left)**
- H2 + 4 pillar cards stacked
- Each card: bg-white/5, border nickel, rounded-xl, flex with icon
- Cards stagger in from left with 120ms delay between each
- Title: mono 13px bold, Body: 12px text-2

**SCROLL 70–82% — "THE VEHICLE" (right, glassmorphism card)**
- H2 + body + violet-divider + body2 + accent
- Accent line in vite color

**SCROLL 85–100% — "THE CTA" (center-bottom)**
- Massive "NGX" text: font-mono, clamp(80px, 18vw, 180px), white/8
- "GENESIS" over it: font-mono, clamp(36px, 7vw, 64px), white, violet text-shadow glow
- Tagline: mono 11px, tracking-[0.5em], uppercase, white/40
- Quote: italic, white/70, clamp(14px, 1.5vw, 18px)
- CTA button: use .btn-glow class, "INICIAR PROTOCOLO", mono bold
- Sub text: 11px, white/30

### 4. VISUAL EFFECTS

```
- Scan line: use .scan-line class (already in globals.css)
- Noise texture: use .noise-overlay class
- Blueprint frame borders: 1px solid nickel/30 on left and right (1rem inset)
- Tick marks: 1px × 11px at top corners of frame
- Frame counter: bottom-right, mono 10px, white/15, shows "042 / 119"
```

### 5. POST-SCROLL SECTION

After the 600vh scroll container, add a Vite-style section:
```
- .vite-section with tick marks
- Background: #16171d (primary)
- Label: "EL SISTEMA" in .vite-label style
- H2: "Construido para quienes juegan a largo plazo."
- Body: description of NGX GENESIS
- Max-width: 976px, centered, padding 112px 40px
```

### 6. FOOTER

```
- .vite-section with tick marks
- "NGX GENESIS" logo text (NGX white, GENESIS in vite color)
- "© 2026 NGX Inc. Performance & Longevity."
- Flex between, grey text
```

### 7. PERFORMANCE REQUIREMENTS

```
- All 120 images preloaded before showing content
- Canvas drawing via requestAnimationFrame only
- Scroll handler uses passive listener
- Debounce with RAF (cancel previous frame before drawing new one)
- Mobile: hide any desktop-only effects, text goes full-width (max-w-[90%])
```

## Design System Reference: NGX Vite Style

**Typography signature:** JetBrains Mono with NEGATIVE letter-spacing (-3px hero, -1.2px h2). This is what creates the dense, technical feel. Never use positive letter-spacing on headings.

**Blueprint frame:** Visible left/right borders with tick marks at horizontal intersections. This frames the entire experience.

**Effects philosophy:** Minimal. No glassmorphism blur on the canvas area. Subtle noise texture. Single scan line. The video frames ARE the visual spectacle — everything else supports, never competes.

**Button style:** Pseudo-element gradient glow border, not box-shadow. See .btn-glow in globals.css.

**Color discipline:** Violet (#b39aff, #6c3bff) is the ONLY accent. No cyan. No blue. No warm tones. The video frames use the same violet palette.

## Key Technical Notes

- Background color #010101 was sampled from the actual video frames. The CSS must match exactly for seamless blending.
- Frames are 1920×1080 but the canvas should render at the image's native resolution and CSS-scale to fit the viewport.
- The video shows GENESIS (android) activating from darkness → full violet glow with holographic dashboards. The frames go from almost pure black to rich violet with data displays, DNA structures, and biomarker visualizations.
- All scroll percentages and copy text are in lib/tokens.ts — import from there, don't hardcode.

## Run

```bash
npm install
npm run dev
```
