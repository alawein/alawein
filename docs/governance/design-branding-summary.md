---
type: canonical
source: none
sync: none
sla: none
title: Design & Branding Plan — Executive Summary
description: One-page summary of plan state, what's done, and what's left.
last_updated: 2026-05-03
category: governance
status: active
---

# Design & Branding Plan — Summary

## What this is

A **workspace-wide design and branding integration plan** across 16+ repos. Each repo is classified (front-end, SaaS, docs, research, etc.), has a design/branding strategy, and a 5-phase agent-executable implementation plan. **Phases 1–5 and Vercel deploy are done for 11 of 12 Vercel repos.** simcore PR #6 merged; repz and meshal-web fixes deployed. **Attributa** needs GH_TOKEN in Vercel (see README) then redeploy.

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

- **Required (one step):** **Attributa** — In Vercel project Settings → Environment Variables, add **GH_TOKEN** (GitHub PAT with `repo` scope), then redeploy. All other Vercel deploys (11/12) are green.
- **Optional:** Phase 2 deep work (tokens in CSS, component refactors, logo in shell); fix repz ESLint, meshal-web tests, gainboy rollup, event-discovery-framework notebook ruff.

---

## Key docs (agents & automation)

| Doc | Purpose |
|-----|---------|
| [remaining-steps-per-repo.md](../archive/remaining-steps-per-repo.md) | **Step-by-step plan per repo** (push, PR, deploy, optional fixes). |
| [bulk-execution-progress.md](../archive/bulk-execution-progress.md) | Session log and per-repo Phase 3–5 status. |
| [phase5-version-control-and-deployment.md](../archive/phase5-version-control-and-deployment.md) | Git workflow + Vercel table + automation one-liners. |
| [HANDOFF-DESIGN-BRANDING.md](../archive/HANDOFF-DESIGN-BRANDING.md) | Handoff for next session: context, commands, automation (gh, Vercel). |

---

## Repos with branch (13); push status

alawein, event-discovery-framework, meshal-web, repz, devkit, bolts, gainboy, attributa, rounaq-atelier, qmlab, scribd, shared-utils, **simcore**.

**Push (2026-03-12):** alawein and repz (branch pushed for first time); simcore (new commits pushed); other 10 already up-to-date on remote.

**PR opened:** simcore PR #6 (historical reference; upstream PR link no longer resolves). Other 12 repos: remote reports no commits between main and feature branch (may already be merged or in sync).

**Done (2026-03-13):** simcore PR #6 merged; main pulled. **Vercel deploy — OK (11/12):** simcore, devkit, llmworks, qmlab, bolts, gainboy, rounaq-atelier, event-discovery-framework, repz, meshal-web. meshal-web: pinned @clerk/react to 6.1.0 and use Show. **attributa:** Install script + README in place; add **GH_TOKEN** in Vercel (repo scope) and redeploy for 12/12.

**Final status:** Plan execution complete except attributa deploy (blocked on GH_TOKEN in Vercel). Optional: Phase 2 deep work and lint/test fixes per remaining-steps-per-repo.
