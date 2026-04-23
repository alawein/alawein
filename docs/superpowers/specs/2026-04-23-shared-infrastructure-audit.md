---
title: Spec B — Shared Infrastructure Audit
date: 2026-04-23
status: active
type: canonical
feeds: [master-execution-plan]
---

# Spec B — Shared Infrastructure Audit

**Generated:** 2026-04-23
**Repos audited:** design-system, workspace-tools, knowledge-base
**Purpose:** Audit the three shared-infrastructure repos that active products depend on — token/theme/component contract, operator CLI and config packages, dashboard app and config-audit pipeline.

---

## Executive Summary

**Overall health:** Yellow. design-system is the healthiest of the three — governance audit reports 5/5 clean, 30 themes coherent, `@alawein/ui` has 46 components with per-component test coverage. workspace-tools is functional but shows advanced scope creep — 10K lines Python CLI (4 modules over 800 lines, one at 4,155), unresolved 2026-03-29 audit artifacts at repo root, and sidecar subprojects (dotnet-kilo C# editor, profile-platform k8s, gmail-ops) that read as dormant experiments. knowledge-base's dashboard has zero `@alawein/*` consumption despite living in the same workspace, the career lane has crowded out dashboard work in recent commits, and `services/vscode-extension/` is an untracked abandoned sidecar.

**Load-bearing finding for the rest of the audit:** `@alawein/ui` is missing the three primitives Spec A flagged as duplicated across 7–8 active products: `ErrorBoundary`, `EmptyState`, and `LoadingSpinner/PageLoader`. Every product invents its own. Shipping these three components in `@alawein/ui` unlocks the largest cross-product consolidation win.

**Strongest infrastructure asset:** design-system — governance clean, turbo pipeline correct, @alawein/ui test-covered per component, published versions consistent with theme coordination.

**Weakest infrastructure asset:** workspace-tools — real CLI exists and works, but the repo has absorbed 8+ unrelated experimental sub-projects that should be extracted or deleted, and 2,099 lines of unresolved 2026-03-29 error-handling audit findings sit at root.

**Most urgent cross-cutting issue:** Infrastructure repos do not consume their own primitives. knowledge-base's dashboard imports no `@alawein/tokens`, no `@alawein/ui`, and no `@alawein/theme-*` — the workspace's own operator surface is a DS adoption hole as wide as any Spec A product.

---

## Per-Repo Findings

### design-system

**Stack:** Turborepo / TypeScript / tsup + vitest / Tailwind v4 / Changesets | **Packages:** 24 total (2 under `@alawein/` scope on disk: tokens, morphism-themes; 22 unscoped dirs publishing as `@alawein/*` via package.json name fields) | **Governance:** 5/5 checks clean 2026-04-22 | **Drift Level:** Low

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | `@alawein/ui` missing ErrorBoundary — 7 of 8 active products duplicate this locally | UI | `packages/ui/src/index.ts:1-51` exports 46 components, zero ErrorBoundary/ErrorFallback; Spec A confirms repz, gymboy, llmworks, meshal-web, attributa, atelier-rounaq, bolts each ship a local variant | Ship `@alawein/ui` ErrorBoundary with typed FallbackProps and token-driven default fallback; migrate 7 products | L |
| Critical | `@alawein/ui` missing EmptyState — 5 products duplicate; llmworks silently omits it | UI | `packages/ui/src/index.ts:1-51` has no EmptyState; Spec A confirms repz, gymboy, attributa, atelier-rounaq, scribd have variants | Ship `@alawein/ui` EmptyState with icon + title + description + action slot | M |
| Critical | `@alawein/ui` missing LoadingSpinner/PageLoader — Suspense fallbacks diverge across all 8 products | UI | No LoadingSpinner/PageLoader export; Spec A documents bare divs (repz), animate-pulse (bolts), inline strings (scribd), custom LoadingSpinner (llmworks) | Ship headless Spinner + skinnable PageLoader primitives; Skeleton already present | M |
| High | `@alawein/morphism-themes` status ambiguous — described as "archived" but still versioned as a live 0.1.0 package | Governance | `packages/@alawein/morphism-themes/` present; package README/description flags archived per audit agent findings but no deprecation field in package.json and no redirect to `theme-base` | Mark deprecated via `"deprecated"` field in package.json and README banner, or unarchive and document canonical usage | S |
| High | Theme packages have no build/test scripts — CSS outputs have no CI gate | DX | `packages/theme-base/package.json` has no `scripts` block; package contents are just `index.css` + `package.json` + `package-lock.json`; same pattern across 15 theme-* packages | Add `test` script per theme package asserting CSS variable export set matches contract; gate publish on pass | M |
| High | Installed theme-base v0.1.0 in consumers despite 0.3.0 published — lockfile drift propagates to bolts/gymboy | DS | `packages/theme-base/package.json:version=0.3.0`; Spec A confirms bolts and gymboy have 0.1.0 installed | Add workspace-tools `audit:published-vs-installed` script; CI gate for declared-vs-installed drift on `@alawein/*` packages | S |
| Medium | Storybook stories grouped as meta-categories — many individual components have no dedicated story | Storybook | `apps/storybook/src/stories/` has 16 story files covering Accordion, Alert, Badge, Button, Card, Dialog, Input, Select, Tabs, Table + 6 category files (Advanced, DataDisplay, FormControls, Navigation, Overlays, Surfaces); 46 exported components | Audit the 6 category files' coverage; ensure every exported component has at least one visible story | M |
| Medium | `packages/icons/package.json` declares dependency on `@alawein/design-system: file:../..` — monorepo boundary violation | DX | Subagent audit flagged this; root is workspace root, not a publishable package | Remove the workspace-root file: dependency; move any build tools to devDependencies | S |
| Medium | `governance-audit.json` embeds absolute Windows paths — reports non-portable across machines/CI | Governance | `reports/governance-audit.json:29` `report:` fields contain `C:\Users\mesha\Desktop\...` | Update `scripts/audit-registry.mjs` + `verify-theme-registry.mjs` to emit `path.relative()` | S |
| Medium | `packages/shared-utils` peer deps marked optional — `cn` behaviour when deps missing is untested | DX | `packages/shared-utils/package.json` peerDependencies `clsx` + `tailwind-merge` marked optional; no test matrix | Add test cases for missing-peer paths; document combinations in README | S |
| Medium | Storybook app version 0.1.3 drifts from core package 0.2.0/0.3.0 cadence — versioning policy undocumented | DX | `apps/storybook/package.json:version=0.1.3` vs `@alawein/tokens:0.2.0`, `@alawein/theme-base:0.3.0` | Document in CLAUDE.md whether Storybook versions independently or with core; enforce via CI if lockstep | S |
| Low | `meshal-site-primitives` package lives in `packages/` alongside workspace-published packages with no README explaining scope | DX | `packages/meshal-site-primitives/` present in packages dir — private? published? | Add a one-line README clarifying purpose and publish status | S |
| Low | No CHANGELOG aggregation — individual package CHANGELOGs exist but no workspace-level release history | DX | Changesets 2.30.0 installed; per-package CHANGELOG.md in tokens and theme-base; no root CHANGELOG.md | Add root CHANGELOG.md aggregating release-scope changes per changeset | S |

---

### workspace-tools

**Stack:** Python 3.12 + setuptools + PyYAML + pytest / TypeScript npm workspaces under `packages/` | **CLI:** `workspace-batch` (`workspace_batch/cli.py`) — real entry point, `py -3.12` install path documented | **Packages:** 4 (eslint-config 0.1.0, prettier-config 0.1.0, tsconfig 0.1.0, alawein-standards 1.0.0 — legacy) | **Python LoC:** 10,265 across 9 modules | **Drift Level:** Medium-High

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | Unresolved 2026-03-29 error-handling audit — 2,099 lines of findings sitting at repo root for 25 days | Python | `ERROR_AUDIT_REPORT.md:1-654`, `ERROR_AUDIT_FIXES.md:1-623`, `ERROR_AUDIT_INDEX.md:1-389`, `ERROR_AUDIT_SUMMARY.txt:1-216`, `AUDIT_START_HERE.txt:1-216` — report documents 4 Critical + 8 High issues in `workspace_batch/core.py:384-385` (unhandled `FileNotFoundError` / `JSONDecodeError` in `read_json()`) and others | Either implement the fixes and delete the artifacts, or move to `docs/historical/` and open issues for remaining items. Root should not carry a 25-day-old audit-in-progress | L |
| High | `workspace_batch/work_orchestration.py` at 4,155 lines — single-file monolith | Python/Arch | `workspace_batch/work_orchestration.py:1-4155` | Split by concern (task graph, execution engine, state persistence, report emission); decomposition enables per-module test isolation | L |
| High | `alawein-standards` package (v1.0.0, attributed "Möbius team") overlaps with `eslint-config`/`prettier-config`/`tsconfig` (all v0.1.0) | DX/Packages | `packages/alawein-standards/package.json:name=@alawein/standards, version=1.0.0` exports `./eslint`, `./prettier`, `./typescript`, `./vitest`; `packages/eslint-config/`, `packages/prettier-config/`, `packages/tsconfig/` publish the same concerns at 0.1.0 | Decide canonical source: delete `@alawein/standards` (legacy Möbius), or delete the three modular configs. Do not ship both — consumers will pick at random | M |
| High | 8+ sidecar subprojects with unclear scope in the workspace operator repo | Structure | `dotnet-kilo/` (C# editor — `.csproj`, `.sln`, `Editor.cs`), `profile-platform/` (full stack: `apps/`, `docker-compose.yml`, `k8s/`, `monitoring/`, `notifier/`), `gmail-ops/email-digest/ + email-labeler/`, `ingesta/` (separate package.json + pyproject.toml), `clis/mobius-cli/`, `mcp/` (docs only) vs `mcps/code-review-mcp + docs-mcp/` | Decide per sidecar: promote to own repo, archive in `dotnet-kilo`/`profile-platform`/etc. subtrees under `experiments/`, or delete. Workspace-tools is the operator surface, not a monorepo | XL |
| High | `consolidation_toolbox.py` at root is a 5-line backward-compat shim to `toolbox.cli.main` — no callers verified | Python | `consolidation_toolbox.py:1-8` just does `from toolbox.cli import main` | Verify no scripts reference it; if unused, delete; if referenced, document the rename | S |
| Medium | `testing/` contains only `test-all.sh`; `tests/` contains the actual pytest suite — two test dirs | Structure | `testing/test-all.sh` (1 file); `tests/` has 7 `test_*.py` + `conftest.py` + `e2e/` + `unit/` | Move `test-all.sh` to `scripts/` or `tests/` root; remove `testing/` | S |
| Medium | `mcp/` (docs only) vs `mcps/` (code) — pluralization duplicate | Structure | `mcp/` contains `AGENTS.md`, `CLAUDE.md`, `docs/`, `LESSONS.md`, `README.md`, `SSOT.md` — no code; `mcps/` contains `code-review-mcp/` and `docs-mcp/` | Consolidate: move `mcp/` docs into `mcps/docs/`; delete empty `mcp/` dir | S |
| Medium | `state/` contains 5 versioned workspace-clean-slate rollouts (v1 through v5) | Operational | `state/workspace-clean-slate`, `/workspace-clean-slate-v2` through `/-v5`, plus `initial-clean-slate` and `workspace-batch-v1-rollout-20260315` | Prune to most recent one or two rollouts; archive the rest to `state/_archive/` or delete | S |
| Medium | `workspace_batch/core.py` and `maintenance_run.py` both near/over 800 lines — secondary monolith risk | Python/Arch | `core.py:1758` (also cited in ERROR_AUDIT), `auth.py:823`, `maintenance_run.py:839`, `maintenance.py:784`, `yolo.py:785`, `catalog_standards.py:767` | After fixing ERROR_AUDIT findings, consider splitting core.py along file I/O / JSON / registry boundaries | M |
| Medium | Config packages (`eslint-config`, `prettier-config`, `tsconfig`) at v0.1.0 — no README documenting adoption path | DX | `packages/eslint-config/package.json`, `packages/prettier-config/package.json`, `packages/tsconfig/package.json` — none have README.md in the package dir | Add one README per package with install + extend instructions; link from workspace SSOT.md | S |
| Low | `__init__.py` at repo root (`workspace-tools/__init__.py`) alongside `workspace_batch/` package | Python | `workspace-tools/__init__.py` exists (contents unverified) | Verify purpose; repo root should not be a Python package unless intentional | S |
| Low | No `.npmrc` file declaring `legacy-peer-deps=true` — workspace documents the flag as required but relies on oral tradition | DX | CLAUDE.md mentions `--legacy-peer-deps` required; `ls` shows no `.npmrc` | Add `.npmrc` with `legacy-peer-deps=true` so `npm install` works without the flag | S |
| Low | `REPO-SWEEP-PROMPT.md` at root — prompt artifact alongside the audit artifacts | Repo hygiene | `REPO-SWEEP-PROMPT.md:1-209` | Move to `docs/prompts/` or delete | S |

---

### knowledge-base

**Stack:** Next.js 16.2.3 / React 19.2.4 / Tailwind v4 (no config, inline `@theme`) / gray-matter + remark / no state manager / Python 3.11 tooling | **DS Adoption:** zero `@alawein/*` packages in `app/package.json`; only referenced via `app/public/catalog-export/catalog.json` as tracked subjects | **Dashboard LoC:** 9 local `.tsx` components | **Python LoC:** 4,277 across 14 scripts | **Drift Level:** High

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | Dashboard consumes zero design-system packages — workspace's own operator surface does not use the DS | App/DS | `app/package.json:20-44` dependencies: `gray-matter`, `next`, `react`, `react-dom`, `rehype-*`, `remark-*`, `server-only` — zero `@alawein/*`; `app/src/app/globals.css:1-30` defines `--background: #ffffff` and `--foreground: #171717` as hardcoded light theme; the 9 local `.tsx` components use no shared primitives | Import `@alawein/tokens` + `@alawein/theme-base` into `app/globals.css`; migrate `nav`, `record-card`, `search-bar`, `status-badge` to `@alawein/ui` Button/Card/Badge; makes this repo the canonical DS consumption reference | L |
| High | `pkos.py` at 1,520 lines — Python CLI monolith | Python | `scripts/pkos.py:1-1520`; handles multiple record kinds, all CLI subcommands, validation | Split along record-kind boundaries (`records/assets.py`, `records/decisions.py`, etc.) and keep `pkos.py` as thin dispatcher | L |
| High | `services/vscode-extension/` sidecar appears abandoned — untracked by git, v0.1.0 | Structure | `services/vscode-extension/package.json:version=0.1.0`; `git ls-files services/vscode-extension/` returns 0 files (entire dir is ignored); ~200 node_modules subdirs on disk | Either finish and commit the extension or delete the on-disk directory; current state is loose files masquerading as an active service | S |
| High | `icf_pipeline.py` at 956 lines — secondary monolith | Python | `scripts/icf_pipeline.py:1-956` | Decompose; at minimum split ingest-extract-load stages into separate modules | M |
| Medium | `WORKSPACE.yaml` last reconciled 2026-04-03 — 20 days stale relative to ongoing workspace rename activity | Data | `WORKSPACE.yaml` header comment "last reconciled 2026-04-03" (per audit agent finding); 267 records inventoried | Re-run reconcile; schedule as part of config-audit CLI or add to `verify_repo.py` as a stale-file gate | S |
| Medium | Domain registry flags `repzapp.com` payment past due 2026-04-16 — 7 days stale warning | Data | `db/assets/domain-registry.md` (per audit agent finding) | Resolve the billing issue or update the registry entry to current status | S |
| Medium | `globals.css` hardcodes light theme (`--background: #ffffff`) — dashboard does not offer dark mode despite workspace preference | App/UX | `app/src/app/globals.css:3-7` | Add dark-mode theme block using `@alawein/theme-base` tokens once DS adoption lands | S |
| Medium | `services/knowledge-forge/` purpose undocumented in top-level README/CLAUDE.md | Structure | `services/knowledge-forge/` has `README.md`, `src/`, `requirements.txt` — a Python sub-service in a dashboard repo without explanation | Document in CLAUDE.md what knowledge-forge does and whether it's active or experimental | S |
| Medium | `MASTER_REFERENCE.md` is generated output but lives next to source-of-truth docs at root — easy to hand-edit by mistake | Docs | `MASTER_REFERENCE.md` at root (per audit agent: 326 lines, modified 2026-04-21); generated by `scripts/generate_master_reference.py:214` | Move to `docs/generated/` or add a banner comment noting it is generated; add CI check enforcing the generator stays in sync | S |
| Medium | `out/` and `output/` coexist at root — semantic collision | Structure | `out/` gitignored (per agent: profile-export artifacts 2026-04-21); `output/` used for Polish loop reports; `.next/output/` is the Vercel build | Rename one (e.g., `reports/` for polish loop); confusion cost is real across Windows tab-completion | S |
| Medium | Recent commit activity skews entirely toward `career/` — dashboard and DB layers have not landed meaningful changes recently | Activity | `git log --oneline -5` returns 5 `career:` commits (resume/AI_ML_CrashCourse/Silk-River appendix); no app/db commits in the window | This is a prioritization signal, not a bug — but flags that the dashboard is under-invested relative to its role as workspace control plane | M |
| Low | No `app/src/app/not-found.tsx` or `error.tsx` visible in App Router | App | `app/src/app/` lists: `api/`, `browse/`, `catalog/`, `config/`, `decisions/`, `journal/`, `record/`, `search/`, `layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico` — no `not-found.tsx` or `error.tsx` | Add top-level `error.tsx` + `not-found.tsx` with token-styled fallback once DS is adopted | S |
| Low | `requirements.txt` coexists with `pyproject.toml` — dependency declaration ambiguity | Python | Both files present at root | Use one (prefer `pyproject.toml` with `uv`, per workspace convention); delete or commentize the other | S |

---

## Cross-Infrastructure Findings

### Infrastructure Self-Adoption Ranking

| Rank | Repo | Own-DS Adoption | Assessment |
|------|------|-----------------|------------|
| 1 | design-system | N/A (it *is* the DS) | Clean contract; governance audit 5/5 |
| 2 | workspace-tools | No front-end surface to adopt into; publishes `@alawein/eslint-config`, `prettier-config`, `tsconfig` for others | Adoption gap is in *consumers* of its config packages, not this repo |
| 3 | knowledge-base | Zero `@alawein/*` imports in `app/package.json`; `globals.css` hardcodes light theme; 9 local components | Dashboard should be the canonical DS consumption reference; instead it is the worst DS consumer in the entire workspace — worse than any Spec A product |

### Shared Primitives Missing from `@alawein/ui` (load-bearing)

This table is the Spec A → Spec B handoff. Each row is a primitive Spec A found duplicated across 5+ active products with no canonical export:

| Primitive | Currently shipped in `@alawein/ui`? | Duplicating repos (from Spec A) | Recommended action |
|-----------|-------------------------------------|---------------------------------|--------------------|
| ErrorBoundary / ErrorFallback | No | repz, gymboy, llmworks, meshal-web, attributa, atelier-rounaq, bolts (7/8) | Ship a `<ErrorBoundary>` wrapper + token-driven `<ErrorFallback>` with typed `FallbackProps` |
| EmptyState | No | repz, gymboy, attributa, atelier-rounaq, scribd (5/8; llmworks silently omits) | Ship `<EmptyState icon title description action>` primitive |
| LoadingSpinner / PageLoader | Partial — `skeleton.tsx` only | All 8 products use ad-hoc Suspense fallbacks (bare div, animate-pulse, inline string, custom LoadingSpinner) | Ship `<Spinner>` + `<PageLoader>`; combine with existing Skeleton for a three-primitive loading surface |
| Toast | Partial — `sonner.tsx` re-export | bolts uses `alert()`, scribd uses `console.error`, repz uses custom `useErrorHandler` | Document Sonner as canonical; add a migration snippet to `@alawein/ui` README |
| `cn` utility | Yes (exports from `lib/utils`) | meshal-web has a local `cn` without `tailwind-merge` — correctness bug | No DS change needed; migrate meshal-web to `@alawein/ui/cn` (Spec A finding) |

### Config Package Story

| Package | Location | Version | Adoption status | Risk |
|---------|----------|---------|-----------------|------|
| `@alawein/eslint-config` | workspace-tools/packages/eslint-config | 0.1.0 | Unknown — no consumer inventory | Medium — active products should either extend it or drift is silent |
| `@alawein/prettier-config` | workspace-tools/packages/prettier-config | 0.1.0 | Unknown | Medium |
| `@alawein/tsconfig` | workspace-tools/packages/tsconfig | 0.1.0 | Unknown; exports `base.json`, `react-vite.json`, `react-next.json` | High — Spec A found 3 products with `strict:false` tsconfigs; is this the canonical base? |
| `@alawein/standards` | workspace-tools/packages/alawein-standards | 1.0.0 | Legacy Möbius — likely none | Medium — presence creates ambiguity about which config bundle is canonical |
| `@alawein/tailwind-preset` | design-system/packages/tailwind-preset | 0.3.0 | Referenced in catalog.json | Low — depends on tokens, lives correctly in design-system |

### Governance Signal Quality

| Signal | Where | Currency | Verdict |
|--------|-------|----------|---------|
| `design-system/reports/governance-audit.json` | design-system | 2026-04-22 (1 day) | Fresh, 5/5 clean — strongest governance artifact in the three repos |
| `workspace-tools/ERROR_AUDIT_*.md` | workspace-tools root | 2026-03-29 (25 days, pre-rename) | Stale — either act or archive; current state is governance theater |
| `knowledge-base/WORKSPACE.yaml` reconcile timestamp | knowledge-base root | 2026-04-03 (20 days) | Stale — should update on rename/migration events |
| `knowledge-base/db/assets/domain-registry.md` | knowledge-base | 2026-04-10 overall; `repzapp.com` entry 2026-04-16 payment warning unresolved | Active but entries rot — registry needs a stale-entry gate |

### Monolith Watch (files over 800 lines)

| File | Lines | Repo | Note |
|------|-------|------|------|
| `workspace_batch/work_orchestration.py` | 4,155 | workspace-tools | Largest; primary refactor target |
| `workspace_batch/core.py` | 1,758 | workspace-tools | Named in 2026-03-29 ERROR_AUDIT as source of Critical I/O bugs |
| `scripts/pkos.py` | 1,520 | knowledge-base | Python CLI dispatcher — split by record kind |
| `scripts/icf_pipeline.py` | 956 | knowledge-base | Pipeline; split by stage |
| `workspace_batch/maintenance_run.py` | 839 | workspace-tools | |
| `workspace_batch/auth.py` | 823 | workspace-tools | |
| `workspace_batch/maintenance.py` | 784 | workspace-tools | |
| `workspace_batch/yolo.py` | 785 | workspace-tools | |
| `workspace_batch/catalog_standards.py` | 767 | workspace-tools | Borderline; 33 lines under the 800-line trigger |

### Scope-Creep Directories (workspace-tools)

| Dir | Contents | Recommendation |
|-----|----------|----------------|
| `dotnet-kilo/` | C# text editor (`.csproj`, `.sln`, `Editor.cs`, `EditorSyntax.cs`, `HighlightDatabase.cs`) | Extract to own repo or delete; C# in a Python/TS operator surface is gratuitous |
| `profile-platform/` | Full-stack product (`apps/`, `docker-compose.yml`, `jest.config.*`, `k8s/`, `monitoring/`, `notifier/`) | Extract to own repo — this is product-scale, not operator tooling |
| `gmail-ops/email-digest/ + email-labeler/` | Email tooling | Extract or move into `scripts/` as ops utilities |
| `ingesta/` | Independent package (own `package.json` + `pyproject.toml` + `deploy.sh` + `REPO-SWEEP-PROMPT.md`) | Extract to own repo — it already pretends to be one |
| `clis/mobius-cli/` | Möbius-branded CLI (likely predates repo rename) | Extract or delete |
| `mcp/` | Docs-only (no code) | Merge into `mcps/` |
| `mcps/code-review-mcp + docs-mcp/` | Real MCP servers | Keep; promote as canonical location |
| `testing/test-all.sh` | One-file dir | Move to `scripts/` or `tests/`, remove dir |
| `state/workspace-clean-slate-v{1..5}` | Rollout artifacts | Prune old versions to `state/_archive/` |

---

## Reset Decisions (candidates for master execution plan Part 1)

Before improvement work begins, the following are recommended for archive / extract / delete:

1. **workspace-tools scope-creep subprojects** — extract `dotnet-kilo`, `profile-platform`, `ingesta` to own repos (or delete if dormant); delete `consolidation_toolbox.py` shim if unused; consolidate `mcp/` into `mcps/`; prune `state/workspace-clean-slate-v1..v4` to `_archive/`.
2. **workspace-tools 2026-03-29 error audit** — decision: implement the 4 Critical fixes or archive the 5 audit files to `docs/historical/`. 25 days of drift at root is an antipattern.
3. **`@alawein/standards` (legacy Möbius)** — delete if the three modular configs (`eslint-config`, `prettier-config`, `tsconfig`) are canonical, or migrate consumers to it and delete the three. Shipping both invites silent drift.
4. **`@alawein/morphism-themes` archival decision** — either mark `deprecated: true` in package.json with a README banner, or unarchive and document canonical usage.
5. **knowledge-base `services/vscode-extension/`** — the on-disk directory is not tracked and not versioned. Either finish and commit or delete the filesystem artifacts.

---

## Infrastructure Strength Assessment

| Rank | Repo | Verdict | Key Strength | Key Gap |
|------|------|---------|--------------|---------|
| 1 | design-system | Green — healthiest shared infra | Governance audit 5/5 clean; @alawein/ui 46-component tested surface; token registry coherent | Missing ErrorBoundary/EmptyState/LoadingSpinner primitives that 7/8 products duplicate |
| 2 | workspace-tools | Yellow — functional CLI, scope creep | Real working `workspace-batch` CLI; config packages exist | 10K-line CLI with 2,099 lines of unresolved audit debt at root; 8+ sidecar subprojects |
| 3 | knowledge-base | Yellow — dashboard under-invested | Modern Next.js 16 stack; rich record store; config-audit pipeline | Zero DS adoption in the repo that should be the DS showcase; career lane crowding out dashboard work |

---

## Feeds Into Master Execution Plan

**Critical items (Phase 1 — Portfolio):**
- Ship `@alawein/ui` ErrorBoundary + EmptyState + LoadingSpinner (unlocks Spec A cross-product consolidation)
- Migrate knowledge-base dashboard to consume `@alawein/tokens` + `@alawein/ui` (the workspace's own operator surface should demonstrate DS)

**High items (Phase 2 — Debt reduction):**
- Resolve or archive workspace-tools 2026-03-29 ERROR_AUDIT findings
- Decide `@alawein/standards` vs the three modular configs
- Extract or delete workspace-tools sidecar subprojects (dotnet-kilo, profile-platform, ingesta)
- Fix `@alawein/morphism-themes` archival status
- Add workspace-level `audit:published-vs-installed` drift check

**Medium items (Phase 3 — Architecture):**
- Split `work_orchestration.py` (4,155 lines), `core.py` (1,758), `pkos.py` (1,520), `icf_pipeline.py` (956)
- Add theme-* package CSS variable contract tests
- Migrate `governance-audit.json` paths to relative
- Add root CHANGELOG aggregation to design-system

**Low items (Phase 4 — Onboarding):**
- README per config package
- `.npmrc` for `legacy-peer-deps`
- Storybook story coverage audit
- `error.tsx` + `not-found.tsx` in knowledge-base app

---

## Totals by Severity

| Repo | Critical | High | Medium | Low | Total |
|------|----------|------|--------|-----|-------|
| design-system | 3 | 3 | 5 | 2 | 13 |
| workspace-tools | 1 | 4 | 5 | 3 | 13 |
| knowledge-base | 1 | 3 | 6 | 2 | 12 |
| **Total** | **5** | **10** | **16** | **7** | **38** |

---

## Methodology Notes

- Parallel Explore-agent audits of design-system, workspace-tools, and knowledge-base were launched; the workspace-tools and knowledge-base agents thrashed their context windows and returned partial data. Findings for those two repos were completed via direct filesystem inspection from the main session.
- Cross-reference with Spec A confirmed that `@alawein/ui` gap (ErrorBoundary, EmptyState, LoadingSpinner) is the load-bearing infra → product consolidation win.
- Subagent accuracy (per prior memory note: ~88%) — the design-system subagent's claim of "zero test coverage" was verified *wrong*: every `@alawein/ui` component has a `.test.tsx` file. Their other findings (Storybook dependency pinning, CSS-only theme test gap, tokens report path absoluteness) were verified accurate.
