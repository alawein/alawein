---
type: canonical
source: none
sync: none
sla: on-change
title: Handoff — Catalog + Notion sync reconciliation, 2026-04-07
description: End-of-session handoff covering projects.json cleanup, KB records alignment, Notion CI automation, and stale-page archival.
last_updated: 2026-04-07
---

> **Status: COMPLETE** — all mission objectives shipped and verified end-to-end.
> This document captures state for any future session picking up downstream work.

# Handoff: Catalog Cleanup + Notion Sync Automation

## Mission

Audit the alawein workspace catalog (projects.json + knowledge-base/db/projects + Notion databases), eliminate drift, and wire both Notion databases into self-healing CI automation.

## Result

All three sources of truth are now aligned, both Notion databases are at clean steady-state, and both CIs are green and self-healing on push.

| System | Before | After |
|---|---|---|
| `projects.json` canonical | 15 featured+notion_sync, miscategorized adil/roka, missing scicomp PyPI, stale `eval` slug | 17 featured+notion_sync, adil+roka in `notion_sync[]`, `berkeley-scicomp` PyPI added, `handshake-hai` slug |
| `knowledge-base/db/projects/` | 41 files, ~13 stale (bract-ai, neper, qap-solver, devkit, etc.), 16 dead cross-refs | 32 canonical + README, 0 dead cross-refs, 256 records pass validator |
| Notion "Projects (Canonical)" DB | 25 rows (6 excess drift), verify FAILING | 19 rows (17 canonical + 2 archived legacy), verify PASSING |
| Notion "Knowledge Base" DB | 153 pages, unsynced | 265 pages, all matched to local (112 stale archived, 226 new pushed) |
| `alawein/alawein` `Sync to Notion` CI | **BROKEN since 2026-04-04** (missing `NOTION_DB_ID` secret) | Green, runs on every `projects.json` change |
| `alawein/knowledge-base` KB sync CI | Did not exist | Green, runs on every `db/projects/**` change |
| `alawein/alawein/.env.local` | All keys empty | Populated with `NOTION_TOKEN` + `NOTION_DB_ID` |

## Commits shipped

### alawein

```
e9c21f27  feat(scripts): auto-detect strategy in notion-kb-archive-stale.mjs
7d1c5ddf  feat(scripts): add run-notion-kb-local.ps1 wrapper for KB Projects sync
4667ef87  chore(catalog): reconcile projects.json + fix notion-kb-sync path
```

### knowledge-base

```
9063d14  ci(notion): add KB Projects sync workflow
896c40a  chore(db): clean up stale project records and align with canonical catalog
```

## Architecture summary

Two Notion databases, two sync pipelines, fully automated:

### Canonical pipeline (for public-facing portfolio)

- **Source:** `alawein/projects.json`
- **Target:** Notion "Projects (Canonical)" DB — `3166d8de-2215-8148-b9f6-e283ac85ab93`
- **Script:** `alawein/scripts/sync-to-notion.mjs`
- **CI:** `alawein/.github/workflows/notion-sync.yml` (triggers on `projects.json` change)
- **Local wrapper:** `alawein/scripts/run-notion-local.ps1`
- **Verify:** `alawein/scripts/verify-notion-canonical-state.mjs`
- **Property name overrides:** `Project Name`, `Status`, `Stack`, `One-Liner`, `Repo`, `Domain` (set by both CI env and pwsh wrapper; defaults in sync script don't match this DB)

### KB pipeline (for internal knowledge management)

- **Source:** `knowledge-base/db/**/*.md` (256 records across projects, assets, plans, tasks, profile, decisions, journal)
- **Target:** Notion "Knowledge Base" DB — `3166d8de-2215-810e-89e6-cc9ed7b723d7` (hardcoded fallback in script)
- **Script:** `alawein/scripts/notion-kb-sync.mjs`
- **CI:** `knowledge-base/.github/workflows/notion-kb-sync.yml` (checks out both repos as siblings, triggers on `db/projects/**` change)
- **Local wrapper:** `alawein/scripts/run-notion-kb-local.ps1` (diff-only by default, `-Apply` to push + archive)
- **Archiver:** `alawein/scripts/notion-kb-archive-stale.mjs` (auto-detects schema: LocalFile strategy or Name strategy)

### Secrets

| Repo | Secret | Status |
|---|---|---|
| `alawein/alawein` | `NOTION_TOKEN` | Set (pre-existing) |
| `alawein/alawein` | `NOTION_DB_ID` | **Added this session** (points to canonical DB) |
| `alawein/knowledge-base` | `NOTION_TOKEN` | **Added this session** (same value as alawein) |

Also `alawein/alawein/.env.local` has both values for local wrapper use.

## Critical nuances for future sessions

1. **`alawein` is a user account, not an org.** `gh secret list --org alawein` returns 404. All GitHub secrets must be set per-repo.
2. **The canonical DB uses non-default property names.** Any script touching it must set `NOTION_NAME_PROPERTY="Project Name"`, `NOTION_CATEGORY_PROPERTY="Status"`, `NOTION_TAGS_PROPERTY="Stack"`, `NOTION_DESCRIPTION_PROPERTY="One-Liner"`. The pwsh wrappers and CI workflows already do this.
3. **Two DBs, similar IDs, different schemas.** Projects (Canonical) = `...8148-b9f6-e283ac85ab93`. Knowledge Base (records) = `...810e-89e6-cc9ed7b723d7`. They are NOT the same.
4. **KB frontmatter format is non-standard.** `validate_records.py` requires the `---type: canonical` opener (not standard `---`). New project records must use this format or validation fails.
5. **Python module names lag repo renames.** `optiqap` ships `src/qaplibria/`, `fallax` ships `reasonbench/`, `alembiq` has `NeperSettings` Pydantic class. Intentional per workspace CLAUDE.md gotcha.
6. **`notion-kb-sync.mjs` had a broken path** (`_pkos/db`) until this session — fixed to `knowledge-base/db`. Both `PKOS_DB_DIR` and `KNOWLEDGE_BASE_DB_DIR` env vars override the default.
7. **The archiver auto-detects strategy.** Against the Knowledge Base DB (no LocalFile column), it uses Name-based matching against all `.md` files under `db/**`. Against a hypothetical DB with LocalFile, it uses the original LocalFile logic.

## Known-deferred issues (not blockers, flagged in audit)

These were surfaced during the audit phase but intentionally scoped out of this session. They are safe to pick up independently.

1. **`scribd` trademark collision** — `scribd.fit` is a fitness handbook storefront, unrelated to Scribd Inc. Legal/SEO risk. Rename candidates discussed: `scribdfit`, `pharmlit`, `pephandbook`. Needs user decision before action. Touches repo name, Vercel project, DNS, projects.json, KB record.
2. **Three identical landing page templates** — `optiqap`, `provegate`, `fallax` use the exact same template HTML/CSS (purple `#a78bfa`, indigo `#6366f1`, dark `#0a0a1a`). Visually indistinguishable. Needs per-brand differentiation when each gains real audiences.
3. **`_devkit`/`_ops`/`_pkos` drift in nested docs** — ~80 stale references across `design-system/docs/`, `workspace-tools/docs/`, `knowledge-base/templates/`, `.cursor/rules.md` files in infra repos, old audit reports. Historical changelogs should be left alone; active docs and templates should be swept. Requires regex replacement with allow-list (e.g., `_pkos` → `knowledge-base`, `_devkit` → `design-system`, `_ops` → `workspace-tools`).
4. **`alembiq` deploys via Netlify AND Vercel** — both `netlify.toml` and `vercel.json` exist in `website-app/`. Domain registry currently lists Vercel as primary (correct per Vercel project mapping), but the dual-config is confusing. Remove whichever isn't the active deployment.
5. **`workspace-tools/.claude/CLAUDE.md` quality (45/100)** — pre-commit quality hook blocked earlier. Needs a rewrite pass to get above the D-grade threshold. Known issue from prior session.
6. **`projects.json` has 3-way duplicates** — `qmlab`, `simcore`, `meatheadphysicist` appear in both `notion_sync[]` and `research[]`. The `mergeProjectLists()` dedupes by slug so this is harmless, but it's untidy. Low priority.
7. **`adil` is categorized as Personal portfolio** in projects.json. This is correct for now but if the legal-ops product ever goes public with a URL, it should move to `featured[]`.

## How to resume

### Verify current state

```bash
cd /c/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein

# Schema validation for projects.json
node scripts/validate-projects-json.mjs

# Knowledge-base record validation
cd ../knowledge-base && python scripts/validate_records.py

# Cross-reference integrity (ad-hoc)
cd db/projects && for f in *.md; do
  for ref in pdf-tools qap-solver knowledge-base-system epistemic-stack reasonbench neper devkit governance-proofs; do
    grep -l "id: $ref$" "$f" 2>/dev/null
  done
done
```

### Trigger syncs manually

```bash
cd /c/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein

# Canonical DB sync (validates + syncs + verifies)
pwsh -File scripts/run-notion-local.ps1

# KB DB sync (diff only)
pwsh -File scripts/run-notion-kb-local.ps1

# KB DB sync + archive stale (apply)
pwsh -File scripts/run-notion-kb-local.ps1 -Apply

# Just the archiver (auto-detects LocalFile vs Name strategy)
DBID=$(grep '^NOTION_DB_ID=' .env.local | cut -d= -f2-)
TOKEN=$(grep '^NOTION_TOKEN=' .env.local | cut -d= -f2-)
NOTION_TOKEN="$TOKEN" node scripts/notion-kb-archive-stale.mjs          # preview
NOTION_TOKEN="$TOKEN" node scripts/notion-kb-archive-stale.mjs --apply  # commit
```

### Check CI health

```bash
gh run list --repo alawein/alawein --workflow=notion-sync.yml --limit 5
gh run list --repo alawein/knowledge-base --workflow=notion-kb-sync.yml --limit 5
```

### Query Notion state (via auth)

```bash
# List all DBs the integration can see
cd /c/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein
DBID=$(grep '^NOTION_DB_ID=' .env.local | cut -d= -f2-)
TOKEN=$(grep '^NOTION_TOKEN=' .env.local | cut -d= -f2-)
NOTION_TOKEN="$TOKEN" node scripts/notion-db-audit.mjs
```

## Memory entries created

Both saved to `C:/Users/mesha/.claude/projects/C--Users-mesha-Desktop-Dropbox-GitHub-alawein/memory/`:

- **`project_catalog_cleanup_2026-04-07.md`** — session project memory with what shipped, blockers resolved, known-deferred items
- **`reference_notion_sync_architecture.md`** — reference for the 2-DB / 2-script / 2-CI / 2-wrapper architecture, property name overrides, secret locations, DB IDs

Both are indexed in `MEMORY.md`.

## Out of scope for this handoff

- **Token rotation** — intentionally not discussed per explicit user instruction.
- **Other workspace work** — see separate project memories for `project_docs_cleanup_2026-04.md`, `project_six_repo_sprint_2026-04-03.md`, `project_knowledge_base_consolidation.md`.

---

Session complete 2026-04-07. Pipeline is self-healing — no manual runs required unless troubleshooting.
