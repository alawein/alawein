---
type: canonical
source: none
sync: none
sla: none
title: Notion Projects (Canonical) — sync and checklist
description: Runbook for syncing projects.json to Notion and required database properties.
last_updated: 2026-03-25
category: operations
audience: [ai-agents, contributors]
status: active
related:
  - ../../projects.json
  - ../../scripts/sync-to-notion.mjs
  - ./github-notion-sync-glossary.md
---

# Notion “Projects (Canonical)” — sync and checklist

**Terminology:** [GitHub ↔ Notion sync glossary and guardrails](./github-notion-sync-glossary.md) (`Sync [project]` vs `GitHub Sync`, out-of-scope rules).

## Automated sync

From the repo root (`alawein/`):

```bash
export NOTION_TOKEN="secret_..."
export NOTION_DB_ID="..."
# Optional if your property is not named "Domain":
# export NOTION_DOMAIN_PROPERTY="Domain"
# Optional if your properties are not named Category/Tags:
# export NOTION_CATEGORY_PROPERTY="Status"
# export NOTION_TAGS_PROPERTY="Stack"

node scripts/sync-to-notion.mjs
```

**Windows (CI-parity env):** put `NOTION_TOKEN` and `NOTION_DB_ID` in `.env.local`, then from the repo root:

```powershell
pwsh -File scripts/run-notion-local.ps1
```

That runs `validate-projects-json.mjs`, `sync-to-notion.mjs`, and `verify-notion-canonical-state.mjs` with the same property names as [`.github/workflows/notion-sync.yml`](../../.github/workflows/notion-sync.yml).

Validate JSON contract locally before sync:

```bash
node scripts/validate-projects-json.mjs
```

Optional post-sync invariant check:

```bash
node scripts/verify-notion-canonical-state.mjs
```

Data sources in [`projects.json`](../../projects.json):

- **`featured`** — same list that drives the README (via `sync-readme.py`).
- **`notion_sync`** — extra rows **only** for Notion (e.g. `qmlab`, `simcore`, `meatheadphysicist`).

Each entry can set **`portfolio_domain`**: `Work` | `Personal` | `scientific-computing` (must exist as **select** options on the Notion database).

## Notion database setup (manual)

1. **Integration** — Create at [notion.so/my-integrations](https://www.notion.so/my-integrations), invite it to the database.
2. **Properties** — Align names and types with the script:
   - **Name** (title)
   - **Slug** (text)
   - **URL** (URL)
   - **Description** (text)
   - **Tags** (multi-select) — add options matching `projects.json` tags, or sync will fail on unknown names.
   - **Category** (select) — `active`, `maintained`, `planned`, `archived`
   - **Repo** (text)
   - **Domain** (select) — at minimum add **`scientific-computing`** if you use it for Alembiq; otherwise change `portfolio_domain` for Alembiq to `Work` or `Personal` in JSON.
   - The sync script now runs a **preflight** and will fail early if Category/Domain/Tags options are missing (or wrong type). If your column names differ, set env overrides.
3. **Legacy rows** — The script matches **`aiclarity`** via `legacy_slugs` on **edfp** and rewrites that page to EDFP (`edfp.online`, `alawein/edfp`). You can delete the duplicate **aiclarity.com** row after one successful sync if a second page remains.

## Cursor Notion MCP

If `mcps/user-Notion/STATUS.md` says authentication is required, run **mcp_auth** for the Notion server in Cursor (empty args). After login, MCP tools can edit pages; bulk updates still match GitHub best via `sync-to-notion.mjs`.

## CI

[`.github/workflows/notion-sync.yml`](../../.github/workflows/notion-sync.yml) runs when `projects.json` changes on `main` (secrets: `NOTION_TOKEN`, `NOTION_DB_ID`).
It now also verifies canonical state (expected canonical rows present + expected archived legacy rows).
