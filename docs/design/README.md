---
title: Design System Documentation
description: Portal to the cross-platform design system docs covering tokens, implementation, and governance.
category: design
audience: contributors
status: active
version: 1.0.0
last_updated: 2026-03-13
tags: [design, docs]
---
# Design System Documentation

This folder holds the **cross-platform UI/UX design system** docs for alawein. Tokens and themes are implemented in **devkit** (`_devkit/tokens`, `_devkit/tokens/themes`); this directory is the governance and specification index.

---

## Contents

| Document | Purpose |
|----------|---------|
| [audit-extract.md](./audit-extract.md) | Draft token spec and component list extracted from attributa, simcore, repz, edf |
| [DESIGN-INVENTORY.md](./DESIGN-INVENTORY.md) | Single reference for tokens, themes, templates, per-app theme table; points to devkit |
| [wireframes-and-hierarchies.md](./wireframes-and-hierarchies.md) | Wireframes and component hierarchies per platform (attributa, meshal-web, simcore, edf, repz, others) |
| [COMPONENT-LIBRARY.md](./COMPONENT-LIBRARY.md) | Where the shared UI lives (devkit/packages/ui), how to consume tokens, pilot migration |
| [IMPLEMENTATION-GUIDELINES.md](./IMPLEMENTATION-GUIDELINES.md) | How to consume tokens, add tokens/themes, add a new platform, run repz design-team workflow |
| [ACCESSIBILITY-CHECKLIST.md](./ACCESSIBILITY-CHECKLIST.md) | Motion, contrast, focus, keyboard, semantics, testing |
| [MIGRATION-NOTES.md](./MIGRATION-NOTES.md) | Per-repo migration notes (attributa, meshal-web, simcore, edf, repz, others) |

---

## Design authority

- **Tokens and themes:** devkit — `_devkit/tokens/` (base, themes, overlays), `_devkit/tokens/design-tokens.json`
- **Brand and style rules:** repz/branding — [STYLE_GUIDE.md](https://github.com/alawein/repz/blob/main/branding/guides/STYLE_GUIDE.md), brand manifests
- **Governance:** alawein/docs/governance — [branding-workflow-and-standards.md](../governance/branding-workflow-and-standards.md), [DESIGN-BRANDING-SUMMARY.md](../governance/DESIGN-BRANDING-SUMMARY.md)

---

## Quick start for developers

1. Use **devkit** as the source for design tokens and themes (import `_devkit/tokens/index.css` or use `@alawein/tokens` if configured).
2. Configure your app’s Tailwind (or CSS) so `primary`, `background`, `card`, `border`, `ring`, etc. resolve to devkit semantic variables (see IMPLEMENTATION-GUIDELINES and COMPONENT-LIBRARY).
3. Use shared components from **devkit/packages/ui** (Button, Card, Input, etc.) and follow ACCESSIBILITY-CHECKLIST for new UI.
