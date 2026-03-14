---
title: Design Inventory
description: Single reference for tokens, themes, templates, and per-app theme assignments under the centralized design system.
category: design
audience: contributors
status: active
version: 1.0.0
last_updated: 2026-03-13
tags: [design, tokens]
---
# Design Inventory

Single reference for tokens, themes, templates, and per-app theme assignment. **Tokens and themes live in devkit** (`_devkit/tokens`, `_devkit/tokens/themes`). This doc is the inventory index and per-platform mapping.

---

## 1. Token system (devkit)

- **Canonical source:** `_devkit/tokens/`
  - `index.css` — import hub (layer order → base → themes → overlays)
  - `base/` — color, typography, spacing, borders, shadows, motion, texture, **semantic-cross-platform.css**
  - `themes/` — post-internet-broadsheet, vhs-pulp-future, industrial-neon, arcade-concrete, soviet-pixel, occult-terminal, blueprint-arcade, dieselpunk-editorial
  - `overlay/` — ninja overlay intensity (s1–s4)
- **Unified semantic aliases:** `base/semantic-cross-platform.css` maps `--background-primary`, `--surface-card`, `--text-primary`, `--accent-primary`, `--border-default`, `--semantic-success|warning|error|info`, `--motion-fast|base|slow`, `--touch-target-min`, etc., to `--aw-*` base tokens.
- **JSON export:** `_devkit/tokens/design-tokens.json` — for Style Dictionary or other tooling.
- **Audit/spec:** [audit-extract.md](./audit-extract.md) — extracted values from attributa, simcore, repz, edf; unified schema.

---

## 2. Reusable layout templates

Documented patterns derived from existing shells; implement in apps or in a shared component package.

| Template | Description | Reference implementation |
|----------|-------------|---------------------------|
| **Dashboard** | Sidebar + main content area; optional top bar | simcore layout config, repz MainLayout |
| **Marketing** | Top nav + full-width sections + footer | meshal-web Navigation + Footer |
| **Auth** | Centered card, logo, single form, no sidebar | attributa AuthPage |
| **Settings** | Sidebar nav (or tabs) + content panels | — |
| **App shell (mobile-first)** | Top header + bottom nav on small viewport; top nav only on desktop | attributa AppShell |
| **Minimal shell** | Single top nav + main; no sidebar | edf Nav + main |

**Shell patterns:**
- **Sidebar + main:** simcore (`layout.tsx`), repz (desktop).
- **Top nav + content:** meshal-web, edf, attributa (desktop).
- **Bottom nav (mobile):** attributa (`md:hidden` bottom nav), repz mobile.

---

## 3. Per-app theme / token source

| App | Theme / tokens | Notes |
|-----|----------------|-------|
| **devkit** | `_devkit/tokens` (base + themes) | Design system source; Storybook |
| **repz** | repz `branding/` + `src/theme/tokens.ts`; align with devkit semantic aliases | REPZ orange/neon; use devkit spacing/motion |
| **attributa** | Local `designTokens.ts` + `design-tokens.css`; align with devkit semantic | Green/gaming; Press Start 2P, Manrope |
| **simcore** | Local `index.css` (primitive + semantic + component); brand-effects.css | Purple/quantum; physics plot tokens |
| **meshal-web** | devkit or repz meshal manifest; multi-neon | Cyan/magenta/yellow |
| **edf** | Inline EDF theme in frontend (`index.css`); optional devkit alignment | Dark cyan/magenta; standalone |
| **gainboy** | D-2 Game Boy palette; devkit spacing/motion | gymboy.coach |
| **bolts** | Next.js; devkit or repo-level theme | BOLTS.FIT |
| **rounaq-atelier** | devkit or repo-level; DesertHeader, FullScreenNav | Fashion/atelier |
| **llmworks, qmlab, scribd** | devkit or repo-level; Radix + Tailwind | Align with STYLE_GUIDE |

---

## 4. Where to add new tokens or themes

- **New global semantic token:** Add to `_devkit/tokens/base/` (e.g. `color.css` or `semantic-cross-platform.css`) and optionally to `design-tokens.json`.
- **New theme:** Add new file under `_devkit/tokens/themes/` and import in `_devkit/tokens/index.css`.
- **New platform:** Add row to §3; link README to devkit and/or repz branding per [branding-workflow-and-standards.md](../governance/branding-workflow-and-standards.md).

---

## 5. Component library location

Shared UI components (atoms/molecules/organisms) are documented in [audit-extract.md §7](./audit-extract.md#7-components-to-centralize). Preferred location: **devkit** (`_devkit/packages/ui` already exists) or a dedicated `_devkit/packages/design-system`. Repz design-team flow references `@morphism/repz-ui` — either alias to devkit packages or create repz-specific package that consumes devkit tokens.
