---
title: Design System Audit & Extract
description: Draft token spec and component inventory extracted from attributa, simcore, repz, and EDF for the unified theme.
category: design
audience: contributors
status: active
version: 1.0.0
last_updated: 2026-03-13
tags: [tokens, audit]
---
# Design System Audit & Extract

**Purpose:** Single draft token spec and list of components to centralize, derived from attributa, simcore, repz, meshal-web, and edf. Authority: [../governance/](../governance/), [repz branding guide](https://github.com/alawein/repz/blob/main/branding/guides/STYLE_GUIDE.md). Tokens and themes live in **devkit** (templates/themes source).

---

## 1. Extracted color tokens (unified schema)

Semantic naming for light and dark. Values below are current hex/HSL from repos; light-mode equivalents to be added where missing.

| Semantic token | Attributa (hex) | Repz (HSL) | Simcore (ref) | EDF (oklch) | Notes |
|----------------|-----------------|------------|---------------|-------------|-------|
| `background.primary` | `#09110c` | `222 47% 5%` | `--primitive-purple-900` | `oklch(0.07 0.03 260)` | Dark base |
| `background.deep` | `#060c09` | — | — | — | Deeper canvas |
| `surface.default` | `#122016` | `222 41% 9%` (card) | `--semantic-surface-glass` | `--color-edfp-surface` | Card/panel |
| `surface.panel` | `#223827` | — | `--card` | — | Elevated panel |
| `text.primary` | `#efffe9` | `214 32% 91%` | `--semantic-text-primary` | `oklch(0.93 0.01 260)` | Body text |
| `text.muted` | `#a6bfa8` | `215 20% 55%` | `--semantic-text-muted` | `--color-edfp-text-muted` | Secondary text |
| `accent.primary` | `#9ff27f` | `14 100% 57%` (repz) | `--semantic-domain-quantum` | `oklch(0.82 0.18 195)` | CTA, brand |
| `accent.secondary` | `#59df9f` | `189 94% 62%` | `--primitive-cyan-500` | `oklch(0.7 0.28 328)` | Secondary CTA |
| `border.default` | `#3b5f3f` | `222 30% 18%` | `--border` | `--color-edfp-border` | Default border |
| `border.bright` | `#7bce6f` | — | — | — | Active/focus border |
| `semantic.success` | — | `142 71% 45%` | `--primitive-green-500` | `oklch(0.72 0.19 160)` | Success state |
| `semantic.warning` | `#ffd15a` | `48 96% 53%` | `--primitive-gold-500` | `oklch(0.82 0.18 95)` | Warning |
| `semantic.error` | `#ff7f7f` | — | `--destructive` | — | Error/destructive |
| `semantic.info` | `#7fc3ff` | `217 91% 60%` | `--primitive-cyan-500` | — | Info |

**Product-specific (keep in theme presets):** attributa `--color-xp`, `--color-level`, `--color-streak`; simcore `--brand-*`, `--physics-*`, `--plot-*`; repz `--repz-orange`, `--neon-*`; EDF `--color-edfp-rank-*`, `--shadow-edfp-*`.

---

## 2. Typography (unified scale)

| Role | Font stack (unified) | Sizes (scale) | Weight | Line height | Source |
|------|---------------------|---------------|--------|-------------|--------|
| **display** | Orbitron, JetBrains Mono, monospace | 2.5rem–4rem (40–64px) | 700–800 | 1.1 | repz cyber |
| **heading** | Space Grotesk, system-ui, sans-serif | 1.25rem–2rem (20–32px) | 600–700 | 1.2 | repz |
| **body** | Manrope / Inter, system-ui, sans-serif | 0.875rem–1rem (14–16px) | 400 | 1.5 | attributa / repz |
| **mono / labels** | JetBrains Mono, monospace | 0.75rem–0.875rem | 400–500 | 1.4 | repz |
| **cyber / metrics** | Orbitron, JetBrains Mono, monospace | 1rem–1.25rem | 600 | 1.2 | repz |
| **pixel / gaming** | Press Start 2P, monospace | 0.75rem–1rem | — | 1.4 | attributa |

**Font scale (t-shirt):** `xs: 0.75rem`, `sm: 0.875rem`, `base: 1rem`, `lg: 1.125rem`, `xl: 1.25rem`, `2xl: 1.5rem`, `3xl: 2rem`, `4xl: 2.5rem`, `5xl: 3rem`, `6xl: 4rem`. Simcore plot-specific: use existing `--font-size-plot-*` clamp tokens.

---

## 3. Spacing (single scale)

4px base. All repos use rem; unified scale:

| Token | Value | Rem |
|-------|--------|-----|
| `space.0` | 0 | 0 |
| `space.1` | 4px | 0.25rem |
| `space.2` | 8px | 0.5rem |
| `space.3` | 12px | 0.75rem |
| `space.4` | 16px | 1rem |
| `space.5` | 20px | 1.25rem |
| `space.6` | 24px | 1.5rem |
| `space.8` | 32px | 2rem |
| `space.10` | 40px | 2.5rem |
| `space.12` | 48px | 3rem |
| `space.16` | 64px | 4rem |

Attributa: `xs=1`, `sm=2`, `md=4`, `lg=6`, `xl=8`. Simcore: `--primitive-space-*` and `--semantic-spacing-*` map to this scale. Repz: use same scale in Tailwind theme.

**Responsive:** `--spacing-mobile: 1rem`, `--spacing-tablet: 1.5rem`, `--spacing-desktop: 2rem` (simcore). Touch target min: `44px` (simcore `--touch-target-min`).

---

## 4. Shadows and elevation

| Token | Value | Use |
|-------|--------|-----|
| `shadow.sm` | `0 1px 3px hsla(0,0%,0%,0.12)` | Cards, dropdowns |
| `shadow.md` | `0 4px 12px hsla(0,0%,0%,0.15)` | Modals, raised panels |
| `shadow.lg` | `0 10px 30px -10px hsl(primary/0.1)` | Hero cards |
| `shadow.glow` | Product-specific (quantum, orange, cyan) | CTAs, active states |

Product glows: simcore `--primitive-shadow-quantum`, repz `--glow-orange`, EDF `--shadow-edfp-primary`. Keep in theme presets.

---

## 5. Motion

| Token | Duration | Easing | Use |
|-------|----------|--------|-----|
| `motion.fast` | 120–160ms | ease / cubic-bezier(0.22,1,0.36,1) | Hover, focus |
| `motion.base` | 200–240ms | cubic-bezier(0.22,1,0.36,1) | Transitions |
| `motion.slow` | 350–420ms | ease-out | Page/section reveal |

**Rule:** All animations MUST be gated by `@media (prefers-reduced-motion: reduce)` (duration → 0.01ms, iteration-count → 1). Ref: attributa `accessibility.css`, simcore `brand-effects.css`.

---

## 6. Border radius

| Token | Value | Use |
|-------|--------|-----|
| `radius.sm` | 0.5rem (8px) | Buttons, inputs, chips |
| `radius.md` | 0.75–0.85rem | Cards, panels |
| `radius.lg` | 1.2rem | Modals, large surfaces |

---

## 7. Components to centralize

**Atoms:** Button (primary, secondary, ghost, danger), Input (text, number, checkbox, radio), Badge, Icon (wrapper), Spinner/Loading.

**Molecules:** Card (glass, elevated, with glow), FormField (label + input + message), NavItem (with active state), Chip/Tag, Modal (header/body/footer).

**Organisms:** AppShell (header + main + optional sidebar/bottom nav), Sidebar (collapsible), DataTable (sortable, optional pagination), TopNav (with CTA), BottomNav (mobile).

**Templates:** Dashboard (sidebar + main grid), Marketing (top nav + sections + footer), Auth (centered card, logo, form), Settings (sidebar nav + content panels).

**Source locations:** attributa `AppShell`, `StatTile`, `LoadingView`, rpg-button classes; simcore `layout.tsx`, `BrandLogo`, button/card component tokens; meshal-web `Navigation`, `Footer`; edf `Nav`; repz semantic-tokens utilities (`.btn-brand`, `.card-glass`, `.glass-*`).

---

## 8. Accessibility baseline (centralize)

- **Reduced motion:** `prefers-reduced-motion: reduce` overrides (attributa `accessibility.css`, simcore brand-effects).
- **High contrast:** `prefers-contrast: high` and `.high-contrast` / `.a11y-high-contrast` semantic overrides (attributa).
- **Focus:** Visible focus ring (`outline`, `box-shadow`) for keyboard users; `.a11y-focus-indicators`, `.skip-link` (attributa).
- **Screen reader:** `.sr-only` utility (attributa).
- **Touch targets:** Min 44px (simcore `--touch-target-min`).

These patterns will be included in the devkit token/theme deliverables and implementation guidelines.
