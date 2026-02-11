---
name: Genesis Visual Style
description: Cinematic Scrollytelling & Premium UI System
---

# Genesis Visual Style Skill

This skill provides the core building blocks to replicate the "Genesis" aesthetic: a high-performance scrollytelling experience with sticky video frames, glassmorphism UI, and a premium dark-mode design system.

## Prerequisites

- **Next.js 14+** (App Router recommended)
- **Tailwind CSS**
- **Framer Motion** (`npm install framer-motion`)
- **Lucide React** (`npm install lucide-react`)
- **Image Sequence**: You must have a sequence of images (e.g., 120 frames) in `public/sequence/`.

## 1. Setup Design Tokens

Copy the `resources/tokens.ts.template` to your project's `lib/` directory (e.g., `lib/tokens.ts`).

```bash
cp .agent/skills/genesis_style/resources/tokens.ts.template lib/tokens.ts
```

This file contains:
- The **Color Palette** (Vite, Electric, Backgrounds).
- **constants** for the scroll engine (Total Frames, Scroll Height).

## 2. Configure Global Styles

Append the contents of `resources/globals.css.template` to your `app/globals.css`.

```bash
cat .agent/skills/genesis_style/resources/globals.css.template >> app/globals.css
```

This adds utility classes like:
- `.glass-card`: The signature blurred background panels.
- `.vite-section`: Standard spacing and layout.
- `.text-vite`: The accent violet color.
- `.scan-line` & `.noise-overlay`: Cinematic effects.

## 3. Scaffold the Page

Copy the `resources/ScrollytellingTemplate.tsx.template` to your components directory.

```bash
cp .agent/skills/genesis_style/resources/ScrollytellingTemplate.tsx.template components/GenesisReveal.tsx
```

## 4. Customization Guide

Open `components/GenesisReveal.tsx` and look for the **CONFIGURATION** section at the top.

### Narrative Sections
Edit the `SECTIONS` array to define your story flow. Each section needs:
- `id`: Unique identifier.
- `scrollStart` (0 to 1): When the section starts fading in.
- `scrollEnd` (0 to 1): When the section fades out.

### Content
Update the JSX in the `NARRATIVE SECTIONS` block (marked with comments) to match your story. Use the provided CSS classes:
- `<h1 className="vite-h1">` for main titles.
- `<div className="glass-card">` for floating panels.
- `<span className="text-vite">` for emphasis.

### Image Sequence
Ensure your images are named `frame_000.webp` through `frame_119.webp` (or adjust `getFramePath` in the component) and placed in `public/sequence/`.

## Philosophy

The "Genesis" style is about **depth and precision**.
- **Darkness is default**: Start with a black screen (`#010101`) and reveal content with light.
- **Motion conveys meaning**: Things shouldn't just appear; they should drift, fade, or slide in response to the user's action (scrolling).
- **Glass over Solid**: Use transparency and blur to keep the background video visible, maintaining context.
