---
title: Codebase Audit 2026-03-16
description: Full repository audit — governance, scripts, CI, and recommended actions
category: audit
last_updated: 2026-03-16
---

# Codebase audit — alawein

**Date:** 2026-03-16  
**Scope:** Full repository (docs, governance, scripts, CI)  
**Auditor:** Codebase audit skill (repo-superpowers)

---

## 1. Project status

| Aspect | Assessment |
|--------|------------|
| **Maturity** | **Mature** — Documentation and governance are well-structured; CI, validation scripts, and tests are in place. |
| **Type** | Organization profile repo: portfolio truth (`projects.json`, `README-backup-20250807.md`), governance docs, and automation. No application build. |
| **Primary language** | N/A (documentation); Python and Bash for scripts, Node for markdown lint and Notion sync. |

---

## 2. Tech stack summary

| Layer | Technology |
|-------|------------|
| **Docs** | Markdown (governance, README, CONTRIBUTING, etc.); YAML frontmatter for freshness and metadata |
| **Scripts** | Python 3 (stdlib-only for `sync-readme.py`; `validate-doc-contract.sh` embeds Python); `sync-to-notion.mjs` (Node ESM); `vercel_alias_audit.py`, `github_dashboard_lib.py`, dashboard/rollout scripts |
| **CI** | GitHub Actions (`.github/workflows/`): `ci.yml`, `docs-validation.yml`, `readme-sync.yml`, `github-dashboard-sync.yml`, `notion-sync.yml`, `workspace-audit.yml`, reusable workflows |
| **Dependency management** | No root `package.json`, `pyproject.toml`, or `requirements.txt`. CI uses `npx --yes markdownlint-cli@0.39.0` and system `python3`. |
| **Data** | `projects.json` (portfolio source of truth); `projects.schema.json` (added by this audit); dashboard snapshots under `docs/dashboard/snapshots/` |

---

## 3. Critical issues (block development or validation)

### 3.1 Resolved: Missing JSON schema

- **Location:** `projects.json` line 2  
- **Issue:** `"$schema": "./projects.schema.json"` referenced a file that did not exist.  
- **Fix applied:** Added `projects.schema.json` at repo root with a schema matching `featured`, `research`, and `packages` structure.  
- **File:** `projects.schema.json` (new)

### 3.2 Documentation contract validation failing (freshness)

- **Location:** `scripts/validate-doc-contract.sh` (embedded Python); failing on current working tree  
- **Issue:** Uncommitted changes to managed docs without updated freshness keys. Validator reported:
  - `AGENTS.md:1: file changed in current diff but last-verified was not updated`
  - `docs/governance/clean-slate-workflow.md:1` — `last_updated` not updated
  - `docs/governance/parallel-batch-execution.md:1` — `last_updated` not updated
  - `docs/governance/workspace-master-prompt.md:1` — `last_updated` not updated
  - `docs/governance/workspace-resource-map.md:1` — `last_updated` not updated
- **Action required:** Update frontmatter in each changed file:
  - **Canonical docs** (`AGENTS.md`): set `last-verified: YYYY-MM-DD` (e.g. `2026-03-16`).
  - **Governance docs** (clean-slate-workflow, parallel-batch-execution, workspace-master-prompt, workspace-resource-map): set `last_updated: YYYY-MM-DD`.
- **Then:** Re-run `./scripts/validate-doc-contract.sh --full` (or rely on CI after commit).

---

## 4. Warnings (should fix soon)

### 4.1 Required-files mismatch between contract and script

- **Locations:**
  - `docs/governance/documentation-contract.md` lines 41–55 (Required Files list)
  - `scripts/validate-doc-contract.sh` lines 74–90 (`REQUIRED_FILES`)
- **Issue:** Contract says required files include `README-backup-20250807.md`, `CONTRIBUTING-backup-20250807.md`, and `docs/README-backup-20250807.md`. The script requires `README.md`, `CONTRIBUTING.md`, and `docs/README.md`. Repo has both sets; script only checks the non-backup names.
- **Recommendation:** Align the contract’s “Required Files” section with what the script enforces (i.e. list `README.md`, `CONTRIBUTING.md`, `docs/README.md` as required), and add a note that `README-backup-20250807.md` (and backups) are the synced/canonical content files.

### 4.2 Notion sync env vars not documented

- **Location:** `.env.example`  
- **Issue:** Only `DASHBOARD_GITHUB_TOKEN` is documented. `scripts/sync-to-notion.mjs` requires `NOTION_TOKEN` and `NOTION_DB_ID` (see script header).  
- **Recommendation:** Add to `.env.example`:
  - `NOTION_TOKEN=`
  - `NOTION_DB_ID=`

### 4.3 Duplicate / redundant entries in .gitignore

- **Location:** `.gitignore`  
- **Issue:** `.vercel` and `.vercel/` both appear (lines 143–144); `.env.*` and `!.env.example` appear in “Environment” and again in “Keep These Files” (lines 168–169).  
- **Recommendation:** Keep a single `.vercel` (or `.vercel/`) and one place for `.env.*` / `!.env.example` to avoid confusion.

---

## 5. Improvement opportunities (nice to have)

| Item | Suggestion |
|------|------------|
| **Python tests** | `scripts/tests/` has `test_github_dashboard_lib.py` and `test_vercel_alias_audit.py`. Consider running them in CI (e.g. in `ci.yml` or a dedicated workflow) so regressions are caught on push/PR. |
| **Optional schema validation** | Add a CI step or pre-commit check that validates `projects.json` against `projects.schema.json` (e.g. `ajv` or a small Python step). |
| **CLAUDE.md required files** | CLAUDE.md lists `README-backup-20250807.md` in Required Files; the validator requires `README.md`. Consider documenting that both README files exist and that the script checks `README.md`. |
| **Placeholder / TODO in docs** | `docs/technical-debt-report-20260311.md` line 173 references fixing type errors and using `// TODO:` for suppressions — actionable tech-debt; no code change in this repo. |
| **CONTRIBUTING backup naming** | Contract and CLAUDE reference `CONTRIBUTING-backup-20250807.md`; script requires `CONTRIBUTING.md`. Same alignment as README: document both and that the script checks the non-backup name. |

---

## 6. Structure and completeness

- **Layout:** Matches CLAUDE.md/SSOT: root governance files, `docs/governance/`, `scripts/`, `.github/`, `projects.json`.  
- **Imports and entry points:** `sync-readme.py` and `validate-doc-contract.sh` run correctly; `sync-to-notion.mjs` requires env vars. No broken imports or missing modules in scanned scripts.  
- **Tests:** All 10 tests in `scripts/tests/` pass (`pytest scripts/tests/ -v`).  
- **TODOs/placeholders:** No code stubs or `NotImplementedError` in scripts. Only documentation TODOs/placeholders (e.g. branding workflow, technical-debt report).  
- **Required files:** All files required by `validate-doc-contract.sh` exist (`README.md`, `CONTRIBUTING.md`, `docs/README.md`, etc.).  
- **README sync:** `python scripts/sync-readme.py --check` passes; README is in sync with `projects.json`.

---

## 7. Setup verification (post-audit)

| Step | Result |
|------|--------|
| Python available | Yes (used for sync-readme, validate-doc-contract, tests) |
| `python scripts/sync-readme.py --check` | Passed |
| `./scripts/validate-doc-contract.sh --full` | Failed due to freshness keys on uncommitted changes (see §3.2) |
| `python -m pytest scripts/tests/ -v` | 10 passed |
| Git repo | Yes; `.gitignore` present |
| projects.schema.json | Added; `projects.json` $schema now resolves |

---

## 8. Recommended action plan

1. **Immediate**
   - Update freshness keys in `AGENTS.md` and the four changed governance docs (`last-verified` or `last_updated` to today), then run `./scripts/validate-doc-contract.sh --full` and fix any remaining failures.
   - Commit the new `projects.schema.json` and the freshness updates.

2. **Short term**
   - Align `docs/governance/documentation-contract.md` Required Files list with `scripts/validate-doc-contract.sh` and document README/CONTRIBUTING backup vs non-backup roles.
   - Add `NOTION_TOKEN` and `NOTION_DB_ID` to `.env.example` and tidy `.gitignore` (remove duplicate .vercel / .env lines).

3. **Optional**
   - Add a CI job to run `pytest scripts/tests/`.
   - Add a CI or pre-commit step to validate `projects.json` against `projects.schema.json`.

---

## 9. Follow-up audit (2026-03-16) — Avatar asset

| Finding | Severity | Action taken |
|---------|----------|--------------|
| `ninja-favicon.svg` at repo root had informal name; canonical org avatar should be named `avatar.svg` and sourced from devkit (design system) as high-quality asset. | Low | Renamed to `avatar.svg`; updated refs in `docs/governance/clean-slate-workflow.md`, `docs/governance/git-operations.md`, `docs/archive/meshal-alawein-profile.md`. Documented in `docs/governance/branding-workflow-and-standards.md`: org avatar is `avatar.svg`; canonical source is devkit; replace with devkit-produced high-quality avatar when available. |

---

*Audit performed per repo-superpowers codebase-audit skill. Governance sources: AGENTS.md, CLAUDE.md, docs/governance/documentation-contract.md.*
