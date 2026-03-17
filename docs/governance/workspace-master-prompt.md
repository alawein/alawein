---
title: Alawein Workspace Master Prompt
description: Canonical operating contract for workspace naming, scope boundaries, portfolio synchronization, and manifest-driven batch execution.
last_updated: 2026-03-16
category: governance
audience: [ai-agents, contributors]
status: active
author: alawein maintainers
version: 1.1.0
tags: [workspace, governance, naming, directives, portfolio, batches]
---

# Alawein Workspace — Master Prompt

## Context

This is the `@alawein` GitHub organization workspace. It contains repositories
across web apps, research/scientific computing, tooling, and external
integrations.

The canonical portfolio index is `alawein/README-backup-20250807.md`. It must always reflect
the true current state of the workspace.

## Workspace Rules

These are non-negotiable. Violations block merge.

### R-1: Single Source of Truth

- Every repo has an `SSOT.md` declaring canonical current state.
- `alawein/README-backup-20250807.md` is the org-level SSOT for portfolio structure and domains.
- Read `SSOT.md` and `AGENTS.md` before making non-trivial changes.

### R-2: Scope Before Action

- Read target repo `AGENTS.md` before editing.
- Respect that repo's `always do`, `ask first`, and `never do` boundaries.
- Cross-repo changes require reading both repos' governance files first.

### R-3: Observable Changes

- Use commit messages: `type(scope): description`.
- Every structural change must be traceable.

### R-4: Reject With Evidence

- If a request violates a rule, refuse and explain why.
- Cite the exact file and line for the violated rule.
- Provide the compliant path forward.

### R-5: Sync or It Didn't Happen

- Any structural change (rename, move, add, remove) must be reflected in
  `alawein/README-backup-20250807.md`.
- Config, imports, deploy targets, and documentation must be updated together.
- A change is incomplete until every reference is consistent.

### R-6: Batch Contract

- Multi-repo autonomous execution must start from
  `docs/batches/<batch-id>/manifest.yaml`.
- Use `_ops/config/repo-capabilities.yaml` as the repo registry.
- Use `_ops/state/<batch-id>/` as the only valid runtime state
  location.
- Healthy batch runs should not emit routine progress chatter between kickoff
  and final report.

## Phased Migration Semantics

During naming transitions, canonical names are authoritative in governance docs,
while physical repo slugs may temporarily differ.

- Canonical display format in docs:
  `canonical-name (repo: physical-slug)`.
- Links stay pointed to the physical repo slug until cutover.
- Legacy names are only allowed in explicit alias contexts or migration matrices.
- `docs/archive/**` remains exempt unless a cleanup is explicitly scoped.
- Hard cutover status (2026-03-11): `gymboy`, `meatheadphysicist`,
  `atelier-rounaq`, and `edfp` now have canonical=physical repo slugs.

## Canonical Names & Structure

These are binding names.

| Directory | Canonical Name | Domain | Notes |
| --- | --- | --- | --- |
| `meatheadphysicist/` | `meatheadphysicist` | — | — |
| `gymboy/` | `gymboy` | `gymboy.coach` | — |
| `repz/` | `repz` | `repzcoach.com` | Canonical domain is `repzcoach.com` |
| `meshal-web/` | `meshal-web` | `meshal.ai` | — |
| `devkit/` | `devkit` | — | Consolidated from legacy `aw-devkit` |
| `gmail-ops/` | `gmail-ops` | — | External/remote tools |

### External Tool Prefix Rule

All external or remote tool directories and related documentation must be
underscore-prefixed. Internal repos remain unprefixed.

## Active Directives

Track each to completion. None is done until `alawein/README-backup-20250807.md` is updated.

### D-1: Devkit Consolidation

- Status: completed on 2026-03-11 (canonical tokens in `devkit/tokens/`,
  `aw-devkit` physical root retired from active workspace).
- Merge `aw-devkit/` contents into `devkit/`.
- Deduplicate conflicts in favor of the more complete implementation.
- Update all cross-references to `devkit/`.
- Delete or archive `aw-devkit/` once migration is verified.
- Token source of truth is `devkit/tokens/`.

### D-2: Gymboy Redesign (`gymboy.coach`)

- Complete visual redesign with Game Boy-inspired aesthetic.
- Character/progression model should reference Habitica-style systems.
- Keep retro-modern interface with Game Boy palette sensibilities.
- Mobile-first and responsive.
- Branding, metadata, and deploy config target `gymboy.coach`.

### D-3: Repz — Comprehensive Heal & Fix

- Full audit: broken builds, failing tests, lint errors, stale dependencies.
- Resolve architectural debt and incomplete migrations.
- CI must pass end-to-end before completion.

### D-4: Ninja Visual Token System

- All ninja characters share identical core visual tokens.
- Each ninja keeps distinct individual specs within token constraints.
- Source of truth is `devkit/tokens/`, imported elsewhere.
- Consistency is mandatory; individuality is constrained expression.

### D-5: `meshal.ai` Refinement

- `meshal-web/` requires comprehensive revision:
  content, design, performance, SEO, accessibility.
- Align branding/messaging with current portfolio state.
- Must accurately represent active Alawein projects.

## Workspace Inventory

### Web Apps

| Repo | Domain | Stack |
| --- | --- | --- |
| `gymboy` | `gymboy.coach` | React, Vite, Spark, Tailwind v4 |
| `repz` | `repzcoach.com` | React Router, Vite, Supabase |
| `attributa` | `attributa.dev` | React, Vite, Supabase |
| `meshal-web` | `meshal.ai` | React, Vite, Tailwind |
| `bolts` | — | Next.js, Supabase |
| `helios` | — | — |

### Research & Scientific Computing

| Repo | Domain |
| --- | --- |
| `qmatsim` | Quantum material simulation |
| `qmlab` | Quantum mechanics lab tools |
| `qubeml` | Quantum ML experiments |
| `simcore` | Scientific simulation core |
| `scicomp` | Scientific computing utilities |
| `spincirc` | Spintronics circuit simulation |
| `maglogic` | Magnetic logic gates |
| `meatheadphysicist` | Physics research & writing |

### AI & NLP

| Repo | Domain |
| --- | --- |
| `llmworks` | LLM infrastructure, fine-tuning, RLHF |
| `neper` | NLP entity extraction |
| `qaplibria` | — |

### Tooling & Infrastructure

| Repo | Purpose |
| --- | --- |
| `devkit` | Design tokens, components, CLI tools |
| `shared-utils` | Shared utilities |
| `edfp` | Physics-inspired video event detection |
| `scribd` | — |
| `atelier-rounaq` | — |

### External / Remote (underscore-prefixed)

| Repo | Purpose |
| --- | --- |
| `gmail-ops` | Gmail automation tooling |

## Session Workflow

```bash
# 1. Orient
git log --oneline -20
git status

# 2. Read governance
cat AGENTS.md
cat SSOT.md

# 3. Scope the task
# "The one thing is: [X]. Done means: [Y]."
```

### Working on Complex Tasks

- Break work into atomic units.
- Identify dependencies between units.
- Use one verified unit at a time for single-repo work.
- Use manifest-driven parallel batches for multi-repo work.
- Treat structured exceptions as the only approved interruption path during a
  healthy batch run.

### Validation

```bash
# JS/TS repos (when applicable)
npm run lint && npm run typecheck && npm run test

# Python repos
ruff check src/ tests/ && mypy src/ && pytest tests/

# Org-level governance
./scripts/validate-doc-contract.sh --full

# Batch planning/execution
python -m workspace_batch plan docs/batches/<batch-id>/manifest.yaml
python -m workspace_batch run docs/batches/<batch-id>/manifest.yaml
```

## Refusal Templates

### Scope Violation

```text
Cannot implement feature X

Reason: AGENTS.md defines this repo's scope as [scope]
Recommendation: Document in deferred work or route to correct repo
```

### Name Violation

```text
Cannot use non-canonical name.

Reason: Canonical name is [canonical]
Recommendation: Update to canonical name before proceeding
```

### Unsynchronized Change

```text
Cannot complete this change — README sync missing

Reason: alawein README does not reflect the change (R-5)
Recommendation: Update alawein/README-backup-20250807.md to match new state
```

## Done Checklist

- [ ] Target repo `SSOT.md` is current
- [ ] Target repo `AGENTS.md` boundaries are respected
- [ ] Commit messages follow `type(scope): description`
- [ ] Canonical names are used (legacy aliases only in approved contexts)
- [ ] Imports/configs/docs/deploy targets are all updated
- [ ] `alawein/README-backup-20250807.md` reflects the true current state
- [ ] Batch artifacts are present when batch mode was used
- [ ] Tests pass, lint is clean, and no regressions remain
