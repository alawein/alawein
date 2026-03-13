---
title: Design & Branding Plan — Executive Summary
description: One-page summary of plan state, what's done, and what's left.
last_updated: 2026-03-12
category: governance
status: active
---

# Design & Branding Plan — Summary

## What this is

A **workspace-wide design and branding integration plan** across 16+ repos. Each repo is classified (front-end, SaaS, docs, research, etc.), has a design/branding strategy, and a 5-phase agent-executable implementation plan. **Phases 1–4 and local Phase 5 (branch + commit) are done for 12 repos;** push, PR, merge, and Vercel deploy remain.

**Authority:** Tokens → `devkit/tokens/`; brand manifests & guides → `repz/branding/`. Governance → `alawein/docs/governance/`.

---

## What's done

| Phase | Done |
|-------|------|
| **Phase 1** | Analysis docs for alawein, devkit, repz, and combined frontends. |
| **Phase 2** | README/design sections and links to devkit + repz branding in most repos. |
| **Phase 3** | Format (Prettier/ruff) and lint run; meshal-web lint fix (Navigation). |
| **Phase 4** | Tests run and results documented (some pre-existing failures noted). |
| **Phase 5 (local)** | Branch `feature/branding-and-standardization` created and committed in: **alawein, event-discovery-framework, meshal-web, repz, devkit, bolts, gainboy, attributa, rounaq-atelier, qmlab, scribd, shared-utils.** |

---

## What's left

- **Required:** Push each feature branch → open PR → merge → `git pull main` → **Vercel deploy** (where `vercel.json` exists).
- **Optional:** Phase 2 deep work (tokens in CSS, component refactors, logo in shell); fix repz ESLint, meshal-web tests, gainboy rollup, simcore `layout.ts`, event-discovery-framework notebook ruff.

---

## Key docs (agents & automation)

| Doc | Purpose |
|-----|---------|
| [remaining-steps-per-repo.md](./remaining-steps-per-repo.md) | **Step-by-step plan per repo** (push, PR, deploy, optional fixes). |
| [bulk-execution-progress.md](./bulk-execution-progress.md) | Session log and per-repo Phase 3–5 status. |
| [phase5-version-control-and-deployment.md](./phase5-version-control-and-deployment.md) | Git workflow + Vercel table + automation one-liners. |
| [HANDOFF-DESIGN-BRANDING.md](../HANDOFF-DESIGN-BRANDING.md) | Handoff for next session: context, commands, automation (gh, Vercel). |

---

## Repos with branch ready to push (12)

alawein, event-discovery-framework, meshal-web, repz, devkit, bolts, gainboy, attributa, rounaq-atelier, qmlab, scribd, shared-utils.

**Minimum to close the loop:** Push → PR → merge → pull main → deploy (see remaining-steps-per-repo and phase5).
