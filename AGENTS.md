# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js 14 + TypeScript landing page project.
- `app/`: App Router entry points (`layout.tsx`, `page.tsx`) and global styles.
- `components/GenesisReveal.tsx`: Main cinematic scroll experience (canvas render, preload, overlays).
- `lib/tokens.ts`: Source of truth for design tokens, section ranges, copy, and frame path helpers.
- `public/sequence/`: Frame assets (`genesis_000.webp` to `genesis_119.webp`).
- `genesis-project/`: Legacy/reference scaffold; root-level app is the active project.

## Build, Test, and Development Commands
Use npm scripts from the repository root:
```bash
npm install      # install dependencies
npm run dev      # run local dev server at http://localhost:3000
npm run build    # production build check
npm run start    # run built app
npm run lint     # Next.js/ESLint checks
```
Run `npm run build` and `npm run lint` before opening a PR.

## Coding Style & Naming Conventions
- TypeScript is `strict`; keep types explicit for props and shared data shapes.
- Follow existing formatting: 2-space indentation, semicolons, double quotes.
- Component files and React components: `PascalCase` (for example, `GenesisReveal.tsx`).
- Functions/variables: `camelCase`; constants: `UPPER_SNAKE_CASE`.
- Do not hardcode design values already defined in `lib/tokens.ts`.
- Prefer `@/*` imports instead of deep relative paths when possible.

## Testing Guidelines
No automated test suite is currently configured.
- Required checks: `npm run lint` and `npm run build`.
- Manual QA: verify frame preload, scroll-to-frame sync, section fade timing, and mobile layout behavior.
- If adding tests, use `*.test.ts` / `*.test.tsx` naming near the feature or in `__tests__/`.

## Commit & Pull Request Guidelines
Git history currently starts with a single initial commit, so adopt a clear conventional style:
- Example commit: `feat: refine section opacity timing`
- Keep commits focused; separate refactors from copy/content updates.

PRs should include:
- What changed and why
- Linked issue (if available)
- Visual proof for UI changes (screenshots/GIFs)
- Manual verification steps performed (`lint`, `build`, device checks)

## Security & Configuration Tips
- Keep secrets in `.env.local`; never commit credentials.
- Be mindful of `public/sequence/` asset size and count, since media changes directly affect load performance.
