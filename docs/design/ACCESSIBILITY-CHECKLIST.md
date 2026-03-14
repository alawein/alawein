---
title: Accessibility Checklist
description: Cross-repo checklist for motion, contrast, keyboard, and semantic/a11y behaviors following the devkit token system.
category: design
audience: contributors
status: active
version: 1.0.0
last_updated: 2026-03-13
tags: [accessibility, design]
---

# Accessibility Checklist

Use this list for implementation and QA. Baseline: [attributa accessibility.css](https://github.com/alawein/attributa/blob/main/src/styles/accessibility.css), simcore `prefers-reduced-motion` in brand-effects, and devkit motion tokens (collapse under `prefers-reduced-motion: reduce`).

---

## 1. Motion

- [ ] All animations and transitions respect `@media (prefers-reduced-motion: reduce)` (duration → 0.01ms or 0, iteration-count → 1). Devkit does this in `tokens/base/motion.css`; app-level animations must be gated or use devkit duration vars.
- [ ] No essential information conveyed by animation alone.
- [ ] Optional: Class toggles `.reduced-motion` / `.a11y-reduced-motion` for user preference in app settings.

---

## 2. Color and contrast

- [ ] Text/background contrast meets WCAG 2.1 AA (4.5:1 normal text, 3:1 large text). Use semantic tokens (`--text-primary`, `--background-primary`) that are defined to meet contrast in devkit/theme.
- [ ] High-contrast: Support `@media (prefers-contrast: high)` and/or `.high-contrast` / `.a11y-high-contrast` overrides (see attributa accessibility.css) so borders and text remain visible.
- [ ] Do not rely on color alone for meaning (e.g. pair with icon or text for success/error/warning).

---

## 3. Focus

- [ ] All interactive elements (buttons, links, inputs, custom controls) have a visible focus indicator. Use `focus-visible:outline` and/or `focus-visible:ring-2` with `--border-focus` / `--ring` token.
- [ ] Focus order follows DOM order or is managed (e.g. modal trap, skip link). Use `tabIndex` and focus management for modals/drawers.
- [ ] Skip link: “Skip to main content” or equivalent, visible on focus (see attributa `.skip-link`).

---

## 4. Keyboard and pointer

- [ ] All actions available with mouse are available with keyboard (no keyboard traps except inside modal with explicit close).
- [ ] Touch targets: Minimum 44×44px for tap/click areas on touch devices (use `--touch-target-min` or Tailwind `min-h-[44px] min-w-[44px]` where appropriate).

---

## 5. Semantics and ARIA

- [ ] Use semantic HTML (`<button>`, `<a>`, `<nav>`, `<main>`, `<header>`, `<form>`, `<label>`, etc.).
- [ ] Form inputs have associated `<label>` (or `aria-label` / `aria-labelledby`). Error messages linked with `aria-describedby` or `aria-errormessage`.
- [ ] Custom controls have correct roles and state (e.g. `aria-expanded`, `aria-selected`, `aria-checked`, `aria-disabled`, `aria-busy`).
- [ ] Decorative images use `alt=""`; meaningful images have descriptive `alt`.

---

## 6. Screen readers and content

- [ ] Use `.sr-only` (or equivalent) for text that should be read by screen readers but not shown visually (e.g. “Open menu” on icon-only button).
- [ ] Live regions: Use `aria-live` for dynamic content that should be announced (e.g. form errors, notifications).

---

## 7. Testing

- [ ] Run axe or Lighthouse accessibility audit on key routes.
- [ ] Test with keyboard only (tab, Enter, Space, Escape).
- [ ] Test with one screen reader (e.g. NVDA, VoiceOver) on at least one flow.
- [ ] Toggle “Reduce motion” (OS or browser) and confirm animations are disabled or minimal.
