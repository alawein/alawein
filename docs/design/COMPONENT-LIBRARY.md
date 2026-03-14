---
title: Component Library Reference
description: Shared UI component catalog built on devkit, covering atomic layers, token usage, and migration guidance.
category: design
audience: contributors
status: active
version: 1.0.0
last_updated: 2026-03-13
tags: [components, design]
---

# Component Library Reference

Shared UI components live in **devkit** (`_devkit/packages/ui`). They follow atomic design (atoms: Button, Input, Badge; molecules: Card, FormField; organisms: composed in apps). This doc summarizes what to use and how to consume tokens.

---

## Location

- **Package:** `_devkit/packages/ui` — exports Button, Card, Input, Badge, Form, Dialog, and many more (see `packages/ui/src/index.ts`).
- **Token usage doc:** `_devkit/packages/ui/COMPONENTS.md` — token mapping, variants, and interactive states (hover, active, focus, disabled, loading).

---

## Consuming tokens in an app

1. **Import devkit tokens** in your app so CSS variables are available:
   - Link or import `_devkit/tokens/index.css`, or
   - Use `@alawein/tokens` if your build resolves it to devkit.
2. **Tailwind theme:** In `tailwind.config.js`, extend `theme` so that `colors.background`, `colors.primary`, `colors.card`, `borderColor`, `ringColor` use the same variable names devkit semantic layer defines (e.g. `var(--background-primary)` or `var(--aw-color-bg)`). Repz uses `createThemedTailwindConfig` from `@morphism/config/tailwind/theme-preset`; other apps can map Tailwind keys to devkit vars.
3. **Use components:** Import Button, Card, Input from `@alawein/ui` (or from devkit path). They will pick up the themed variables.

---

## Component inventory (core)

| Component | Type | Token usage | States |
|-----------|------|-------------|--------|
| Button | Atom | primary, destructive, outline, secondary, ghost, link, hero | hover, focus-visible, disabled |
| Input | Atom | border, background, ring, muted-foreground | focus-visible, disabled, error (via class) |
| Badge | Atom | accent/semantic colors | — |
| Card | Molecule | card, card-foreground, border, shadow | optional hover shadow |
| Form (Field) | Molecule | label, input, error message | invalid state |
| Dialog / Sheet | Organism | overlay, card, border | open/close |

Full list and props: see `_devkit/packages/ui/src/index.ts` and `_devkit/packages/ui/COMPONENTS.md`.

---

## Pilot migration

To refactor one platform (e.g. attributa or repz) to consume the library and tokens:

1. Add devkit tokens to the app (import `tokens/index.css` or equivalent).
2. Configure Tailwind to use devkit semantic variables for `background`, `foreground`, `primary`, `card`, `border`, `ring`, `muted`, `destructive`, `accent`.
3. Replace local button/card/input implementations with imports from `@alawein/ui` where structure matches.
4. Keep platform-specific variants (e.g. attributa RPG button style) as overrides or new variants that still use the same token names.
