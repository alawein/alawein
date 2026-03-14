---
title: Implementation Guidelines
description: Instructions to consume tokens, add new tokens/themes, and onboard new platforms to the shared design system.
category: design
audience: contributors
status: active
version: 1.0.0
last_updated: 2026-03-13
tags: [implementation, tokens]
---
# Implementation Guidelines

How to consume tokens, where to add new tokens, how to add a new platform, and how to run the design-team workflow. See also [branding-workflow-and-standards.md](../governance/branding-workflow-and-standards.md).

---

## 1. Consuming tokens

### CSS variables

- **Option A:** Import devkit token master file so all `--aw-*` and semantic aliases are available:
  - `_devkit/tokens/index.css` (or the built package equivalent).
- **Option B:** In repo-level CSS, define a thin layer that maps your app’s variable names to devkit:
  - Example: `--primary: var(--accent-primary);` or `--primary: var(--aw-color-accent);`.

### Tailwind

- Extend `theme` so that Tailwind’s default names (`background`, `foreground`, `primary`, `card`, `border`, `ring`, `muted`, `destructive`, `accent`) resolve to your chosen tokens (e.g. devkit semantic aliases or `--aw-*`).
- Repz: uses `createThemedTailwindConfig` from `@morphism/config/tailwind/theme-preset`; point the preset at devkit tokens or repz branding manifest.
- Use spacing scale from devkit: `--aw-space-*` or semantic `--motion-*`, `--spacing-mobile|tablet|desktop`.

### New tokens in an app

- Prefer using existing semantic tokens (`--background-primary`, `--accent-primary`, etc.). If you need a one-off value, define it in the app and avoid adding to devkit unless it’s cross-platform.

---

## 2. Where to add new tokens

- **Global semantic token:** Add to `_devkit/tokens/base/` (e.g. `color.css` or `semantic-cross-platform.css`). Optionally add to `_devkit/tokens/design-tokens.json`.
- **New theme (e.g. product-specific palette):** Add a new file under `_devkit/tokens/themes/` and import it in `_devkit/tokens/index.css`.
- **Platform-only token:** Keep in the app’s CSS or theme file; document in DESIGN-INVENTORY per-app table if significant.

---

## 3. Adding a new platform

1. Add a row to the **Per-app theme / token source** table in [DESIGN-INVENTORY.md](./DESIGN-INVENTORY.md).
2. In the new repo: add README “Design and branding” section that links to devkit and/or repz branding ([STYLE_GUIDE](https://github.com/alawein/repz/blob/main/branding/guides/STYLE_GUIDE.md)), per [branding-workflow-and-standards.md](../governance/branding-workflow-and-standards.md).
3. Apply tokens/theme (devkit or repo-level) and ensure logo in shell and favicon per workflow doc.
4. Optional: Add wireframe and component hierarchy for the new platform in [wireframes-and-hierarchies.md](./wireframes-and-hierarchies.md).

---

## 4. Design-team workflow (repz)

Repz uses a role-based workflow for UX → UI → theme/tokens → QA. To run it:

- Scripts and roles: `repz/scripts/design-team-config.ts` and `repz/scripts/run-design-team.ts` (if present).
- Roles: UX Designer → UI Engineer → Theme/Tokens Specialist → QA. Focus: extract components to shared UI, consolidate tokens, validate showcase and theme switching.
- Use devkit as the target for “consolidate design tokens” and “extract reusable components” (e.g. `_devkit/tokens`, `_devkit/packages/ui`).

---

## 5. Measurements and touch targets

- **Spacing:** Use devkit 4px-based scale (`--aw-space-1` … `--aw-space-24`). See [audit-extract.md](./audit-extract.md#3-spacing-single-scale).
- **Touch targets:** Minimum 44px height/width for interactive controls on touch devices (devkit `--touch-target-min`, simcore/attributa already use min 44px for buttons).
- **Border radius:** Use `--radius-sm` (0.5rem), `--radius-md` (0.75–0.85rem), `--radius-lg` (1.2rem) for consistency.

---

## 6. Font and color references

- **Fonts:** See [audit-extract.md § Typography](./audit-extract.md#2-typography-unified-scale) and devkit `tokens/base/typography.css`. Load from Google Fonts or local; avoid generic-only stacks (e.g. pair display + body).
- **Hex/HSL:** Semantic colors are defined in devkit `tokens/base/color.css` (and light mode); product-specific hex/HSL are in [audit-extract.md § Colors](./audit-extract.md#1-extracted-color-tokens-unified-schema). Use CSS variables in code, not raw hex in components.
