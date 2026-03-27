---
type: canonical
source: none
sync: none
sla: none
title: Project lifecycle tiers (SSOT)
description: Mapping projects.json category to portfolio posture; align Notion and PKOS.
last_updated: 2026-03-26
category: operations
audience: [ai-agents, contributors]
status: active
related:
  - ../../projects.json
  - ./notion-projects-database.md
---

# Project lifecycle tiers (SSOT)

This document defines how **`category`** in [`projects.json`](../../projects.json) maps to portfolio posture. Apply the same semantics in Notion “Projects (Canonical)” and PKOS (`status` + `phase`) so exports stay aligned.

## Tiers

| `category` | Meaning | Typical signals |
|------------|---------|-----------------|
| **active** | Default shipping mode: feature work, releases, or steady iteration. | Recent commits, `phase: active-development` in PKOS, or P0–P2 priority with ongoing intent. |
| **maintained** | Product or surface stays live; **low churn** — fixes, deps, content tweaks, no major roadmap. | PKOS `phase: maintenance`, or stable portfolio site with rare commits. |
| **planned** | Idea / early build: not yet a stable public product loop. | PKOS `phase: ideation` (or equivalent); may still have a repo and commits. |
| **archived** | Intentionally sunset or **GitHub archived**; keep only for history or redirects. | GitHub `archived=true`, or explicit sunset note in PKOS. |

## Precedence when signals conflict

1. **GitHub archived** → `archived` unless the replacement repo is clearly documented (then old row `archived`, new row `active` / `planned`).
2. Else **PKOS `phase`** wins over “how it feels” in a slide deck.
3. Else **commit recency** (e.g. last 30–90d on default branch) as a tie-breaker for `active` vs `maintained`.

## PKOS alignment

- PKOS **`status`** remains `active` for anything not sunset; use **`phase`** to distinguish maintenance vs ideation vs active-development.
- Notion **Status** / **Domain** properties should not contradict `category` + public URL without an explicit rationale (document in the project page notes).

## Related inventory

- Portfolio manifest: [`projects.json`](../../projects.json)
- Repo paths and redirects: [`github-repo-canonical-verification.md`](github-repo-canonical-verification.md)
- Push tiers + Domain to Notion: [`notion-projects-database.md`](notion-projects-database.md)
