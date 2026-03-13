---
title: Branding Workflow and Standards
description: Per-repo checklist and icon/favicon/theme standard for design and branding.
last_updated: 2026-03-13
category: governance
status: active
---

# Branding Workflow and Standards

This document is the single source of truth for how we apply branding across alawein web projects. Use it for Phase 2 work and when adding or updating a product UI.

## Workflow (per repo)

1. **Design authority:** Consume design authority from devkit and/or repz (tokens, STYLE_GUIDE, branding docs). Link README to the design authority.
2. **Tokens and theme:** Apply tokens/STYLE_GUIDE — use `@alawein/tokens` or repo-level `theme/tokens.ts` aligned with devkit. Document which theme the app uses (e.g. repz REPZ tokens, gainboy D-2 Game Boy palette).
3. **Logo in shell:** Ensure logo appears in header, footer, and loading screens where the app has a shell.
4. **Favicon and icons:** Provide at least one favicon in `public/` (or repo root); link from `index.html`. Prefer committed assets; no random external URLs. Optionally add `site.webmanifest` with consistent naming.
5. **Quality and deploy:** Run format and lint; fix blocking errors; then deploy (Vercel where applicable).

## Icons and favicons — standard

- **Minimal set per product:** At least one favicon: `public/favicon.ico` or `public/favicon.svg`.
- **HTML:** In `index.html`, use `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />` (or `/favicon.ico`). Add `rel="apple-touch-icon"` if PWA or mobile matter.
- **No external favicon URLs:** Replace any external favicon URL (e.g. Dropbox, CDN) with a committed asset under `public/`.
- **Manifest:** If the app has a web manifest, ensure `icons` array references committed paths.

## Theme — which app uses what

| App | Theme / tokens |
|-----|----------------|
| devkit | Design system source; Storybook, tokens, themes |
| repz | repz `branding/` and `src/theme/tokens.ts` (REPZ tokens) |
| gainboy | D-2 Game Boy / RPG / Habitica palette; tokens and STYLE_GUIDE |
| simcore | simcore `src/theme/tokens.ts`; align with devkit |
| meshal-web, attributa, llmworks, qmlab, rounaq-atelier, bolts | devkit or repo-level theme; align with STYLE_GUIDE |
| event-discovery-framework | Inline EDF theme in frontend (standalone build); optional future alignment with devkit |

## Favicon audit (current state)

| Repo | Current favicon / icon | Committed? | Action |
|------|-------------------------|------------|--------|
| simcore | Dropbox URL (external) | No | Replace with `public/favicon.svg` (or placeholder.svg); update index.html |
| repz | `/repz-icon.png` | Yes | OK |
| rounaq-atelier | `/favicon.svg` | Yes | OK |
| attributa | `/favicon.ico`, `/placeholder.svg` | Yes | OK |
| qmlab | `/favicon.svg`, `/favicon.ico` | Yes | OK |
| llmworks | `/favicon.png`, `/favicon.svg` | Yes | OK |
| meshal-web | `/favicon.svg` | Yes | OK (applied) |
| gainboy | `/favicon.svg` | Yes | OK (applied) |
| bolts | (Next.js; check app layout) | — | Ensure favicon in app or public |
| event-discovery-framework | (frontend) | — | Add if missing |
| devkit templates | `/vite.svg` | Yes | Template default |

Apply the minimal standard (committed favicon, no external URL) to any repo where the audit shows "Replace" or "Add".
