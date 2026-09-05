---
type: canonical
source: none
sync: none
sla: none
title: Design & Branding Plan, Executive Summary
description: One-page summary of plan state, what's done, and what's left.
last_updated: 2026-09-05
category: governance
status: active
---

# Design & Branding Plan: Summary

## What this is

This document preserves a March 2026 report for a **workspace-wide design and branding integration plan** across 16+ repos. The report classified each repo (front-end, SaaS, docs, research, etc.), assigned a design and branding strategy, and provided a 5-phase agent-executable implementation plan. It recorded **Phases 1-5 and Vercel deployment as complete for 11 of 12 Vercel repos**, with simcore PR #6 merged, repz and meshal-web fixes deployed, and Attributa awaiting a GH_TOKEN in Vercel before redeployment. These historical deployment claims were not reverified for this terminology update.

**Authority:** Tokens → `design-system/packages/@alawein/tokens/`; brand manifests and guides → `repz/branding/`. Governance → `alawein/docs/governance/`.

---

## What's done

| Phase | Done |
| --- | --- |
| **Phase 1** | Analysis docs for alawein, the historical `devkit` repo, repz, and combined frontends. |
| **Phase 2** | README/design sections and links to the historical `devkit` repo and repz branding in most repos. |
| **Phase 3** | Format (Prettier/ruff) and lint run; meshal-web lint fix (Navigation). |
| **Phase 4** | Tests run and results documented (some pre-existing failures noted). |
| **Phase 5 (local)** | Branch `feature/branding-and-standardization` was recorded as created and committed in these repositories: alawein, event-discovery-framework, meshal-web, repz, historical slugs `devkit` and `gainboy`, bolts, attributa, rounaq-atelier, qmlab, scribd, and shared-utils. |

---

## What's left

- **Reported outstanding step:** The March 2026 report said Attributa still needed a **GH_TOKEN** (GitHub PAT with `repo` scope) in Vercel project Settings → Environment Variables before redeployment. It marked the other 11 Vercel deployments green.
- **Optional:** Phase 2 deep work (tokens in CSS, component refactors, logo in shell); fix repz ESLint, meshal-web tests, the historically reported `gainboy` rollup issue, and event-discovery-framework notebook ruff.

---

## Key docs (agents & automation)

| Doc | Purpose |
| --- | --- |
| [remaining-steps-per-repo.md](../archive/remaining-steps-per-repo.md) | **Step-by-step plan per repo** (push, PR, deploy, optional fixes). |
| [bulk-execution-progress.md](../archive/bulk-execution-progress.md) | Session log and per-repo Phase 3–5 status. |
| [phase5-version-control-and-deployment.md](../archive/phase5-version-control-and-deployment.md) | Git workflow + Vercel table + automation one-liners. |
| [HANDOFF-DESIGN-BRANDING.md](../archive/HANDOFF-DESIGN-BRANDING.md) | Handoff for next session: context, commands, automation (gh, Vercel). |

---

## Repos with branch (13); push status

The historical report lists alawein, event-discovery-framework, meshal-web, repz, `devkit`, bolts, `gainboy`, attributa, rounaq-atelier, qmlab, scribd, shared-utils, and simcore.

**Push (2026-03-12):** alawein and repz (branch pushed for first time); simcore (new commits pushed); other 10 already up-to-date on remote.

**PR opened:** simcore PR #6 (historical reference; upstream PR link no longer resolves). Other 12 repos: remote reports no commits between main and feature branch (may already be merged or in sync).

**Reported done (2026-03-13):** simcore PR #6 merged; main pulled. **Reported Vercel deploy, OK (11/12):** simcore, historical slugs `devkit` and `gainboy`, llmworks, qmlab, bolts, rounaq-atelier, event-discovery-framework, repz, and meshal-web. meshal-web: pinned @clerk/react to 6.1.0 and use Show. **attributa:** The report said the install script and README were in place, while a **GH_TOKEN** in Vercel and a redeployment remained outstanding.

**Reported final status (2026-03-13):** Plan execution was complete except the Attributa deployment, which was blocked on GH_TOKEN in Vercel. Optional work included Phase 2 deep work and lint/test fixes listed in remaining-steps-per-repo.
