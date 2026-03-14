---
title: Migration Notes
description: Repository-specific guidance for migrating platforms to the centralized design tokens and components.
category: design
audience: contributors
status: active
version: 1.0.0
last_updated: 2026-03-13
tags: [migration, design]
---
# Per-Repo Migration Notes

Short, actionable notes for migrating a platform to the centralized design system (devkit tokens + optional shared UI). See [DESIGN-BRANDING-SUMMARY.md](../governance/DESIGN-BRANDING-SUMMARY.md) for overall status and [branding-workflow-and-standards.md](../governance/branding-workflow-and-standards.md) for workflow.

---

## Attributa

- **Current:** Local `designTokens.ts` + `design-tokens.css`; green/gaming palette; Press Start 2P, Manrope; AppShell with top + bottom nav.
- **Migration:** (1) Import devkit tokens or map existing `--color-*` / `--space-*` to devkit semantic aliases. (2) Optionally replace button/card/input with `@alawein/ui` components and theme Tailwind to devkit vars. (3) Keep RPG-specific tokens (xp, level, streak) in app; document in DESIGN-INVENTORY. (4) Ensure accessibility.css remains in use (reduced-motion, high-contrast, focus, skip-link).

---

## Meshal-web

- **Current:** Framer Motion; Clerk; multi-neon (cyan/magenta/yellow); Navigation + Footer.
- **Migration:** (1) Align CSS variables with repz meshal manifest or devkit theme (e.g. industrial-neon / vhs-pulp-future). (2) Use devkit spacing and motion tokens. (3) Optional: use shared Button/Card from devkit UI with theme override for neon palette.

---

## Simcore

- **Current:** Full token stack in `index.css` (primitive → semantic → component); brand-effects.css; @morphism/shared-layouts.
- **Migration:** (1) Keep physics/plot and brand tokens in simcore; they are product-specific. (2) Optionally import devkit base (spacing, motion, typography) and override only color layer with simcore primitives. (3) Ensure reduced-motion in brand-effects remains. (4) Map shared component tokens (button, card) to devkit semantic names if adopting shared UI later.

---

## EDF (event-discovery-framework)

- **Current:** Inline dark theme in frontend `index.css`; standalone build.
- **Migration:** (1) Optional: import devkit tokens and override only color vars with EDF oklch values so spacing/motion/typography align. (2) Or keep standalone theme and add a one-line entry in DESIGN-INVENTORY; no blocking change.

---

## Repz

- **Current:** Tailwind + semantic-tokens.css; design-team-config (UX → UI → theme → QA); repz branding manifest.
- **Migration:** (1) Point Tailwind preset at devkit tokens or keep repz manifest as source and ensure devkit semantic aliases are compatible. (2) Run design-team workflow to extract components to devkit/packages/ui and consolidate tokens into devkit. (3) Use DESIGN-INVENTORY and COMPONENT-LIBRARY as reference.

---

## Gainboy, Bolts, Rounaq-atelier, Llmworks, Qmlab, Scribd

- **Migration:** (1) Add README “Design and branding” link to devkit and repz STYLE_GUIDE. (2) Apply devkit tokens (or repo-level theme aligned with devkit) per branding-workflow-and-standards. (3) Favicon and logo in shell per workflow. (4) Optional: adopt Button/Card/Input from devkit UI and theme to product palette.
