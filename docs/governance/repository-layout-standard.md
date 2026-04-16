---
type: canonical
source: none
sync: on-change
sla: none
title: Repository layout standard
description: Canonical top-level layout by stack archetype; aligns apps with AWS-style separation of code, infra, docs, and automation.
last_updated: 2026-04-15
category: governance
audience: [ai-agents, contributors]
status: active
related:
  - ./tooling-quality-gates.md
  - ./public-private-boundary.md
  - ./workspace-standardization.md
---

# Repository layout standard

This document defines **layout archetypes**, not a single folder shape for every repository. Pick the archetype that matches the primary deliverable.

## Shared rules (all archetypes)

| Area | Rule |
|------|------|
| **Root** | Keep a root `README.md`, license file, and one primary manifest (`package.json` or `pyproject.toml`). |
| **Human docs** | Place narrative documentation under `docs/` with a short `docs/README.md` index when the folder exists. |
| **Automation** | Prefer `scripts/` for repo-local tooling; avoid unexplained loose scripts at repo root. |
| **CI** | GitHub Actions live under `.github/workflows/`. |
| **Generated output** | Do not commit build artifacts, `dist/`, `.next/`, coverage output, or `*.tsbuildinfo` (see `.gitignore`). |
| **Ops reports** | Generated sync or health reports may use `reports/` (gitignored patterns as documented per repo). |

## Anti-patterns

- Emitting TypeScript declaration files **into** `src/` alongside sources when using composite projects without a dedicated `declarationDir`.
- Treating **local folder names** with underscores (`_devkit`, `_ops`) as GitHub slugs — verify `origin` (see operations doc linked below).
- Standardizing **archive** or **notebook-only** trees to full app layout — use `research-archive` posture instead.

## Archetype: `vite-react-spa`

**Typical roots**: `index.html`, `vite.config.*`, `src/`, `public/`.

| Path | Purpose |
|------|---------|
| `src/` | Application source |
| `public/` | Static assets |
| `docs/` | Optional deep docs |
| `reports/` | Optional generated ops reports |

**Tests**: Co-located `*.test.ts(x)` under `src/` or a dedicated `src/test/` / `e2e/` folder — pick one per repo and document in README.

## Archetype: `next-app-router`

**Typical roots**: `next.config.*`, `src/app` or `app/`, `public/`.

| Path | Purpose |
|------|---------|
| `src/app` or `app/` | Routes and layouts |
| `public/` | Static assets |

**ESLint**: If `package.json` does not set `"type": "module"`, prefer **`eslint.config.mjs`** for flat config using ESM `import` syntax (avoids Node `MODULE_TYPELESS_PACKAGE_JSON` warnings).

## Archetype: `node-monorepo`

**Typical roots**: `packages/*`, workspace file (`pnpm-workspace.yaml` / `package.json` workspaces).

| Path | Purpose |
|------|---------|
| `packages/<name>/` | Publishable or internal packages |
| `apps/` or `services/` | Optional app packages |

Document boundaries in the **root README** and link packages to consumers.

## Archetype: `python-library`

**Typical roots**: `pyproject.toml`, `src/<package>/` or flat package, `tests/`.

| Path | Purpose |
|------|---------|
| `src/<package>/` | Preferred src layout (PEP 517) |
| `tests/` | `pytest` tests |

Prefer **ruff** + **pytest**; optional **mypy** with incremental adoption.

## Archetype: `python-service`

Same as `python-library`, plus when applicable:

| Path | Purpose |
|------|---------|
| `Dockerfile` | Container entry |
| `infra/` or `terraform/` | IaC co-located with service |

## Archetype: `research-archive`

**Posture**: Read-only or low churn. **No** full standardization requirement unless security or licensing demands it.

Typical: `archive/`, `notebooks/`, large `data/` (often gitignored or LFS).

## Reference implementations

Reference implementations are tracked in the private Alawein control plane. The
public repo only carries the governance standard, not the full machine-readable
workspace inventory.

## Related

- [Tooling and quality gates](./tooling-quality-gates.md)
- [GitHub canonical verification](../operations/github-repo-canonical-verification.md)
