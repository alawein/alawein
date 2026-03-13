---
title: Phase 1 — Design and Branding Analysis (Front-end Repos)
description: Combined setup and initial analysis for meshal-web, gainboy, attributa, llmworks, simcore, qmlab, rounaq-atelier.
last_updated: 2026-03-12
category: governance
status: complete
---

# Phase 1: Front-end Repositories — Setup and Initial Analysis

## Repos in scope

| Repo | Type | Stack | Vercel | Notes |
|------|------|-------|--------|-------|
| meshal-web | Front-end | Vite, React 19, Tailwind 4 | Yes | D-5 refinement; portfolio (meshal.ai) |
| gainboy | Front-end | Vite, React 19, Spark, Radix, Tailwind 4 | Yes | D-2 Game Boy redesign; gymboy.coach |
| attributa | Front-end | Vite, React 19, Radix, Tailwind 4 | Yes | Design/accessibility audit; attributa.dev |
| llmworks | Front-end / OSS | Vite, React 19, Radix, Supabase, Tailwind 4 | Yes | LLM evaluation; llmworks.dev |
| simcore | Front-end | Vite, React 19, Capacitor, Radix, Tailwind 4 | Yes | Scientific simulation UI |
| qmlab | Front-end | Vite, React, Radix, Tailwind 4 | Yes | Quantum mechanics lab |
| rounaq-atelier | Front-end | Vite SPA | Yes | Fashion/atelier; has brand/Logo.tsx |
| bolts | Full-stack SaaS | Next.js, Stripe, Supabase | Yes | BOLTS.FIT; has Logo.tsx |
| scribd | Front-end / Internal | Next.js, Tailwind, Radix | — | Handbook platform |
| event-discovery-framework | Full-stack | Python backend + frontend/ | Yes | edfp.online |
| shared-utils | Package | TypeScript | — | No UI |
| qaplibria | Research | Python + tools | Yes | Multi-surface |
| MeatheadPhysicist | Documentation / Research | Python | Yes | Docs-focused |

## Current state summary

- **Layout:** All use Vite SPA layout with `src/components/`, `src/pages/` or `src/app/`; aligned with workspace-standardization.
- **Shared config:** Most use `@alawein/prettier-config` (file link to devkit); attributa, llmworks, simcore, qmlab use `@alawein/ui` from alawein-ui.
- **Tokens/themes:** repz has `src/theme/tokens.ts`; simcore has `src/theme/tokens.ts`. meshal-web uses `src/app/globals.css`; others use Tailwind and local CSS. None consistently depend on `@alawein/tokens` from devkit.
- **Logo/header/footer:** rounaq-atelier has `src/components/brand/Logo.tsx`; bolts has `Logo.tsx`. Others need audit for consistent logo placement in header, footer, loading.
- **Gaps:** (1) Add or align global styles with devkit tokens and repz/branding STYLE_GUIDE. (2) Ensure logo in header, footer, loading screens. (3) Standardize on @alawein/eslint-config where missing.

## Next actions (Phase 2)

- **meshal-web:** Add design-authority link in README; consider @alawein/tokens or theme package; ensure logo in shell.
- **gainboy:** Same; D-2 redesign uses Game Boy aesthetic; keep tokens compatible with devkit.
- **attributa, llmworks, simcore, qmlab, rounaq-atelier:** Add README link to design authority; ensure theme/tokens from devkit or local theme file; logo in header/footer/loading.
- **bolts, scribd:** README design section added; apply tokens and logo in shell/dashboard.
- **event-discovery-framework:** README design section added; frontend theme + backend API format.
- **shared-utils, qaplibria, MeatheadPhysicist:** README workspace-standards/design links added.
