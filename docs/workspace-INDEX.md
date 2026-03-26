---
title: Workspace repository index
description: Mirror of workspace-root INDEX.md for GitHub tracking
category: documentation
audience: contributors
status: active
last_updated: 2026-03-25
---

# Repository Index

**Convention:** Top-level dirs with `.git/` = repos (mirror of `github.com/alawein/<repo-name>`). Non-repo content lives under `docs/`, `ops/`, `_scripts/`, and root files. Tooling repos use `_` prefix; product repos do not.

---

## Infrastructure

| Directory | Type | GitHub | Purpose |
|-----------|------|--------|---------|
| `_devkit/` | Git repo | [alawein/aw-devkit](https://github.com/alawein/aw-devkit) | Shared design tokens, themes, config packages, Storybook (Turborepo) |
| `_ops/` | Git repo | [alawein/workspace-tools](https://github.com/alawein/workspace-tools) | Workspace batch execution, work orchestration (Python) |
| `_pkos/` | Git repo | [alawein/pkos](https://github.com/alawein/pkos) | Personal Knowledge OS — identity, resume (LaTeX), brand tokens, standards |
| `ops/` | Non-repo | — | Workspace consolidation toolbox package, unit/E2E tests, benchmarks, canonical examples, and batch helper scripts |
| `_scripts/` | Non-repo | — | Governance scripts (drift monitor, deploy, verify) |
| `docs/` | Non-repo | — | Workspace-level governance docs, drift reports |

## Product Repos (25+)

| Repo | Description |
|------|-------------|
| `adil/` | |
| `alawein/` | |
| `atelier-rounaq/` | |
| `attributa/` | |
| `bolts/` | |
| `chshlab/` | |
| `edfp/` | |
| `gymboy/` | |
| `helios/` | |
| `llmworks/` | |
| `loopholelab/` | |
| `maglogic/` | |
| `meatheadphysicist/` | |
| `meshal-web/` | |
| `neper/` | |
| `qaplibria/` | |
| `qmatsim/` | |
| `qmlab/` | |
| `qubeml/` | |
| `reasonbench/` | |
| `repz/` | |
| `_handshake-hai/` | |
| `handshake-project-proctor/` | |
| `scicomp/` | |
| `scribd/` | |
| `simcore/` | |
| `spincirc/` | |

## Non-Repo (not version-controlled)

| Directory | Purpose |
|-----------|---------|
| `_mercor-llm-failsafe/` | Employer side project (Mercor) |
| `docs/` | Governance standards, deployment guides, drift reports |
| `ops/` | Consolidation toolbox scripts used by workspace skills |
| `_scripts/` | Operational scripts (drift monitoring, governance deploy/verify) |

## Governance

All top-level git repos in this workspace follow the Morphism Categorical Governance Framework. Per-repo files: `CLAUDE.md`, `AGENTS.md`, `GUIDELINES.md`, `.claude/settings.json`, `.cursor/rules.md`. Drift monitoring: `_scripts/monitor-drift.sh`. Validation: `_scripts/verify-governance.sh`.

Governance docs: `docs/GOVERNANCE_STANDARDS.md`, `docs/PORTFOLIO_STATUS.md`.

---

Update this file when top-level structure changes. **Workspace clone:** keep in sync with `../INDEX.md` at the monorepo-style workspace root when present.
