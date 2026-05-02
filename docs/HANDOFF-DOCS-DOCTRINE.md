---
type: frozen
source: none
sync: none
sla: none
title: Handoff — Docs Doctrine Phase 3-5 and Supporting Tasks
description: Actionable superpowers-formatted requests for completing the Docs Doctrine migration.
last_updated: 2026-03-26
---

> **Status: COMPLETE** — All 6 requests executed 2026-03-26. This document is
> frozen. See commit history for implementation details.

# Handoff: Docs Doctrine — Phases 3-5

## Project context

- **Goal:** Complete the Docs Doctrine file governance framework across the alawein workspace (28+ repos).
- **Current state:** Phase 1 (org repo headers, 75 files) and Phase 2 (cross-repo migration, 166 files across 30 repos) are complete. 259 changed files remain **uncommitted** across 31 repos.
- **Authority:** [`docs-doctrine.md`](governance/docs-doctrine.md), [`validate-doctrine.py`](../scripts/doctrine/validate-doctrine.py), [`CLAUDE.md`](../CLAUDE.md)

## What was done

- Docs Doctrine rules document placed at `docs/governance/docs-doctrine.md`
- Validation script: `scripts/doctrine/validate-doctrine.py` (10 rules, CI-ready)
- CI workflow: `.github/workflows/docs-doctrine.yml` (validate + drift-check)
- Pre-commit hook: `scripts/pre-commit-doctrine.sh`
- Generator stubs: `generate-index.sh`, `sync-claude.sh`, `render-configs.sh`
- Bootstrap template: `scripts/bootstrap-repo.sh`
- Phase 1: 75 files in org repo classified with YAML frontmatter (0 errors, 0 warnings)
- Phase 2: 166 files across 30 product repos classified (CLAUDE.md, AGENTS.md, SSOT.md, LESSONS.md, README.md, INDEX.md, GUIDELINES.md, .claude/CLAUDE.md)
- CLAUDE.md (workspace + org) updated with doctrine references, scripts, quality gates, and gotchas

## Key locations

| What | Where |
|------|--------|
| Doctrine rules | `docs/governance/docs-doctrine.md` |
| Validator | `scripts/doctrine/validate-doctrine.py` |
| CI workflow | `.github/workflows/docs-doctrine.yml` |
| Pre-commit hook | `scripts/pre-commit-doctrine.sh` |
| Generator stubs | `scripts/generate-index.sh`, `scripts/sync-claude.sh`, `scripts/render-configs.sh` |
| Bootstrap | `scripts/bootstrap-repo.sh` |

---

## Requests (in order)

Each request below is a self-contained prompt you can paste into a new Claude Code session. They use superpowers skills for structured execution.

---

### Request 1: Commit and push Phase 1+2 changes

> **Priority:** Critical — uncommitted work across 31 repos
> **Skill:** `superpowers:finishing-a-development-branch`
> **Estimated scope:** 259 files, 31 repos

```
Use the "superpowers finishing-a-development-branch" skill. The Docs Doctrine
Phase 1 and Phase 2 migration added YAML frontmatter headers to 241 .md files
across 31 repos in this workspace. All changes are uncommitted.

For each repo with uncommitted changes:
1. Stage only the doctrine-related .md file changes (frontmatter additions)
2. Commit with message: "docs: add docs-doctrine YAML frontmatter headers"
3. Push to the current branch (or main if on main)

Start with the org repo (alawein/alawein) which has the most changes (75 files
+ new scripts + CI workflow), then batch the remaining 30 product repos.

Do NOT force-push or amend existing commits. Each repo gets its own commit.
```

---

### Request 2: Scaffold CLAUDE.md for reasonbench

> **Priority:** High — only repo in workspace missing CLAUDE.md
> **Skill:** `superpowers:executing-plans`

```
Use the "superpowers executing-plans" skill. The repo `reasonbench/` is the
only repo in the workspace missing a CLAUDE.md file.

Plan:
1. Read reasonbench/ to understand its purpose (likely an LLM reasoning
   benchmark or evaluation tool)
2. Create a root CLAUDE.md with proper docs-doctrine frontmatter:
   type: canonical, source: none, sync: none, sla: none
3. Create .claude/CLAUDE.md with frontmatter:
   type: derived, source: org/governance-templates, sync: manual, sla: manual
4. Follow the dual-file pattern used by all other workspace repos
5. Commit: "docs: add CLAUDE.md for reasonbench (doctrine compliance)"
```

---

### Request 3: Implement derived-file generators (Phase 3)

> **Priority:** High — enables enforcement
> **Skill:** `superpowers:brainstorming` then `superpowers:writing-plans`
> **Estimated scope:** 3 generator scripts + CI drift-check wiring

```
Use the "superpowers brainstorming" skill. I need to implement Phase 3 of the
Docs Doctrine: derived-file generation.

Context: Three generator stubs exist at:
- scripts/generate-index.sh — regenerates INDEX.md files from directory listings
- scripts/sync-claude.sh — projects org CLAUDE.md governance to local repos
- scripts/render-configs.sh — renders config files from templates

The CI workflow (.github/workflows/docs-doctrine.yml) already has a drift-check
job that regenerates derived files and fails on git diff. But the generators
are stubs — they don't do real work yet.

Goals:
1. Wire up generate-index.sh to produce INDEX.md files with proper
   "type: derived" frontmatter from directory contents
2. Wire up sync-claude.sh to generate .claude/CLAUDE.md files from an org
   template, preserving per-repo one-line descriptions
3. Wire up render-configs.sh to render any template-driven configs
4. Define freshness SLAs for each derived file pattern
5. The drift-check CI job should catch stale files after this

Constraints: Windows-compatible (bash via Git Bash). Use the existing
docs-doctrine.md classification table and dual-source resolution table as
the source of truth for what is derived from what.
```

---

### Request 4: Clean workspace root (Phase 4)

> **Priority:** Medium — hygiene
> **Skill:** `superpowers:brainstorming` then `superpowers:writing-plans`

```
Use the "superpowers brainstorming" skill. I need to execute Phase 4 of the
Docs Doctrine: clean the workspace root.

Context: The workspace root (C:\Users\mesha\Desktop\GitHub\alawein\) is NOT a
Git repo. Individual subdirectories are independent repos. Files dropped at
the root (debug logs, venvs, session plans, temp scripts) persist indefinitely
unless manually cleaned.

Goals:
1. Audit the workspace root for orphaned/stale files
2. Identify what should be deleted vs moved vs kept
3. Establish a convention for what (if anything) belongs at root level
4. Document the convention so future sessions don't recreate the mess

Constraints: The root package.json is a thin delegator to _devkit/ — it stays.
INDEX.md stays. CLAUDE.md stays. Everything else is suspect.
```

---

### Request 5: Enable full enforcement (Phase 5)

> **Priority:** Medium — final phase
> **Skill:** `superpowers:brainstorming` then `superpowers:writing-plans`
> **Depends on:** Requests 1, 3

```
Use the "superpowers brainstorming" skill. I need to execute Phase 5 of the
Docs Doctrine: full enforcement.

Context: The doctrine validator (scripts/doctrine/validate-doctrine.py) and CI workflow
(.github/workflows/docs-doctrine.yml) exist but are advisory. PRs can merge
even if doctrine validation fails.

Goals:
1. Make doctrine validation a required check (blocking merge) in all repos
   that have GitHub branch protection
2. Deploy the pre-commit hook (scripts/pre-commit-doctrine.sh) across all
   workspace repos — either via a shared git hook config or manual install
3. Set up periodic freshness audits for derived files with declared SLAs
4. Define the escalation path: what happens when a derived file goes stale
   beyond its SLA?

Constraints: Not all repos have branch protection enabled. The hook must work
on Windows (Git Bash). Keep the enforcement proportional — research repos with
minimal docs shouldn't be blocked by governance overhead.
```

---

### Request 6: Cross-repo doctrine health dashboard

> **Priority:** Low — nice-to-have observability
> **Skill:** `superpowers:brainstorming` then `superpowers:writing-plans`

```
Use the "superpowers brainstorming" skill. I want a lightweight dashboard
showing doctrine compliance across all workspace repos.

Context: The validator (scripts/doctrine/validate-doctrine.py) can run in --ci mode and
produces structured output. The workspace has ~28 repos. _ops/ has a
workspace-batch CLI for manifest-driven multi-repo execution.

Goals:
1. Run the doctrine validator across all repos and aggregate results
2. Produce a compliance summary (pass/fail/warning counts per repo)
3. Output as a generated markdown file (type: generated) or JSON snapshot
4. Optionally integrate with the existing _ops workspace-batch tooling

Keep it simple — a script that loops over repos and collates output is fine.
No web UI needed.
```

---

## Success criteria

- **Request 1 done:** All 259 files committed and pushed; clean `git status` in every repo
- **Request 2 done:** reasonbench/ has CLAUDE.md + .claude/CLAUDE.md with proper frontmatter
- **Request 3 done:** Generator scripts produce real output; CI drift-check catches stale derived files
- **Request 4 done:** Workspace root is clean; convention documented
- **Request 5 done:** Doctrine validation is a required CI check; pre-commit hooks deployed
- **Request 6 done:** Single command produces cross-repo compliance summary
