# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cinematic scrollytelling landing page for NGX GENESIS. A futuristic android "activates" through 120 pre-rendered WebP frames synced to scroll position, with narrative text overlays telling the Muscular Health thesis story. Built with Next.js 14, Framer Motion, HTML5 Canvas, and Tailwind CSS.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
```

No test suite is configured.

## Architecture

Single-page app with one main component:

- **`app/page.tsx`** → renders `<GenesisReveal />`
- **`components/GenesisReveal.tsx`** (~400 lines) → The entire scroll experience: image preloader, sticky canvas engine, 6 narrative overlay sections, post-scroll section, footer. Contains internal `AnimatedStat` helper component.
- **`lib/tokens.ts`** → All design tokens (colors, scroll ranges, section definitions, narrative copy). **Never hardcode values that exist here.**
- **`app/globals.css`** → Vite Style design system classes (.glass-card, .btn-glow, .scan-line, .noise-overlay, .vite-section, .vite-h1/.vite-h2, .vite-label, .violet-divider, .stat-number)
- **`public/sequence/`** → 120 WebP frames (genesis_000.webp → genesis_119.webp, 1920×1080)
- **`genesis-project/`** → Earlier scaffold/subset of the project (reference only, not the active code)

## Scroll Engine Pattern

The core pattern: a 600vh tall container with a sticky 100vh viewport. `useScroll()` from Framer Motion maps scroll progress (0→1) to frame index (0→119). Canvas draws the corresponding pre-loaded image via `requestAnimationFrame`. Six narrative sections fade in/out based on scroll ranges defined in `SECTIONS` array in tokens.ts.

Section opacity formula: fade in over first 25% of range, full visibility for middle 55%, fade out over last 20%.

## Design System: NGX Vite Style

**Critical rules:**
- Background `#010101` — sampled from actual video frames, must match exactly for seamless canvas blending
- Typography: JetBrains Mono with **negative** letter-spacing (-3px hero, -1.2px h2). Never positive on headings.
- Color: Violet (#b39aff, #6c3bff) is the **only** accent. No cyan, blue, or warm tones.
- Button glow uses pseudo-element gradient borders (`.btn-glow`), not box-shadow
- Blueprint frame borders with tick marks at corners frame the experience
- Effects are minimal — noise texture, single scan line. Frames ARE the spectacle.

## Performance Constraints

- All 120 images must be preloaded before showing content (Promise.all)
- Canvas drawing exclusively via requestAnimationFrame with RAF cancellation
- Overlay text uses position absolute to avoid layout thrash
- Mobile: text sections go max-w-[90%]

## Key Data Flow

`tokens.ts` exports → `GenesisReveal.tsx` imports:
- `TOKENS` (colors) — used for inline styles matching CSS custom properties
- `TOTAL_FRAMES` (120), `SCROLL_HEIGHT_VH` (600) — scroll container dimensions
- `getFramePath(i)` — returns `/sequence/genesis_{padded}.webp`
- `SECTIONS` (array of {id, scrollStart, scrollEnd, position, card?}) — overlay timing
- `COPY` (object keyed by section id) — all narrative text, stats, pillar items
