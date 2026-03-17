---
title: Branch and deployment convention
description: Single reference for branch naming, workflow, and Vercel deployment across alawein repos
category: governance
audience: [ai-agents, contributors]
status: active
last_updated: 2026-03-17
tags: [branch, naming, workflow, vercel, deployment, convention]
---

# Branch and deployment convention

Use this doc as the single reference for **branch naming**, **feature workflow**, and **Vercel deployment** across the `@alawein` org. It aligns [git-operations.md](git-operations.md), [workflow.md](workflow.md), [feature-lifecycle.md](feature-lifecycle.md), and [phase5-version-control-and-deployment.md](phase5-version-control-and-deployment.md).

---

## Branch taxonomy (canonical)

| Prefix | Use when | Merge strategy |
|--------|----------|-----------------|
| `main` | Protected default; PR-first | — |
| `feat/*` | Additive scoped work (features, docs, governance) | Squash |
| `fix/*` | Scoped bugfix or drift correction | Squash |
| `hotfix/*` | Urgent fix; fast-track | Merge commit allowed |
| `release/*` | Pre-tag stabilization | Merge commit allowed |
| `fast/*` | Short-lived spike or discovery | Delete or promote to `feat/*` |
| `chore/*` | Non-feature chores (deps, config, rename) | Squash |
| `codex/<batch-id>/<slug>` | Autonomous batch (one branch per repo) | Squash |

**Naming rules:** kebab-case; intent-revealing; ≤4 path segments. Prefer `feat/domain-outcome` (e.g. `feat/docs-governance-suite`).

**Note:** Existing branches named `feature/*` (e.g. `feature/branding-and-standardization`) are legacy; new branches should use `feat/*`. Both are accepted until merged and deleted.

---

## Workflow (any repo)

1. **Branch from `main`:** `git switch main && git pull --ff-only origin main && git switch -c feat/your-scope`
2. **Work:** Scoped changes only; no direct push to `main`.
3. **Validate:** Repo-specific (lint, test) + org-level in `alawein`: `./scripts/validate-doc-contract.sh --full` when touching governance.
4. **Push:** `git push -u origin feat/your-scope`
5. **PR:** Open PR into `main`; request review.
6. **Merge:** Squash (default) or merge commit only for `hotfix/*` / `release/*`.
7. **After merge:** `git switch main && git pull --ff-only origin main`; delete local and remote branch when done.

Detailed mechanics: [git-operations.md](git-operations.md). Lifecycle and branch choice: [feature-lifecycle.md](feature-lifecycle.md).

---

## Other repos (sibling to alawein)

Repos under the same org (e.g. `edfp`, `repz`, `meshal-web`, `devkit`, `gymboy`, `attributa`, …) follow the same convention:

- **Default branch:** `main` (PR-first; no direct push).
- **Branch naming:** Same taxonomy (`feat/*`, `fix/*`, …).
- **Per-repo:** Each repo has its own `main`; branch and PR are per repo. Multi-repo work uses [parallel-batch-execution.md](parallel-batch-execution.md) with one branch per repo.

---

## Vercel deployment

- **Production:** Deploy from `main`. Either Vercel Git integration (auto-deploy on push to `main`) or manual: `vercel deploy --prod` after merge.
- **Preview:** Every branch/PR gets a preview URL when the repo is connected to Vercel.
- **Audit (from alawein repo):**  
  `python scripts/vercel_alias_audit.py`  
  `python scripts/vercel_alias_audit.py --apply`  
  Ensures production alias matches `https://[github-repo-name].vercel.app`.

Repos with `vercel.json` and build/output config: see [phase5-version-control-and-deployment.md](phase5-version-control-and-deployment.md) for the list and build commands.

---

## Current branches (alawein repo)

Run `git branch -a` in `alawein/alawein` for the current list. After hygiene, only `main` and unmerged branches (e.g. `codex/*`, `feat/*`, `agent/*`) remain.

**Hygiene:** After merging a branch, delete it locally and on origin. Prune stale remotes with `git fetch --prune`. Prefer short-lived branches.

---

## Quick reference

| Task | Command / rule |
|------|-----------------|
| New feature branch | `git switch -c feat/scope-outcome` |
| Sync with main | `git fetch origin && git switch main && git pull --ff-only origin main && git switch feat/… && git merge --ff-only main` |
| Push branch | `git push -u origin feat/scope-outcome` |
| After merge | `git switch main && git pull && git branch -d feat/… && git push origin --delete feat/…` |
| Deploy (after merge) | `vercel deploy --prod` or rely on Vercel Git |
| Vercel alias audit | `python scripts/vercel_alias_audit.py` (from alawein) |

---

## Stale branch cleanup

Keep branch lists manageable:

- **List all branches:** `git branch -a`
- **List remote branches merged into main:** `git branch -r --merged main`
- **Prune stale remote refs:** `git fetch --prune`
- **After merging a branch:** Delete local `git branch -d feat/name` and remote `git push origin --delete feat/name`

Do not delete branches that are still in review or that others depend on. Prefer deleting only branches you merged yourself or that are explicitly obsolete.

---

## See also

- [workflow.md](workflow.md) — Branch model, merge model, CI
- [git-operations.md](git-operations.md) — Day-to-day Git mechanics
- [merge-policy.md](merge-policy.md) — How branches land on `main`
- [phase5-version-control-and-deployment.md](phase5-version-control-and-deployment.md) — Vercel repo list and steps
