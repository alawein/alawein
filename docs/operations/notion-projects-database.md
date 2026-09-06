---
type: canonical
source: none
sync: none
sla: none
title: Notion Projects sync
description: Run the existing Projects pipeline with process-injected credentials.
last_updated: 2026-09-06
category: operations
audience: [ai-agents, contributors]
status: active
related:
  - ../../projects.json
  - ../../scripts/notion/sync-to-notion.mjs
  - ./github-notion-sync-glossary.md
---

# Notion Projects sync

The existing pipeline projects `featured` and `notion_sync` entries from
`projects.json` into Projects (Canonical). Edit `catalog/index.yaml`, then run
`scripts/catalog/build-catalog.py` to generate the manifest. Do not edit the
manifest by hand or add another Projects synchronization route.

## Validate locally

From the repository root:

```bash
python scripts/catalog/build-catalog.py --check
python scripts/catalog/validate-projects-json.py
```

## Run an authorized sync

Keep credentials in 1Password. Configure `NOTION_TOKEN` and `NOTION_DB_ID` as
secret references in the process environment, then let `op run` resolve them.
Do not store secret values in `.env`, `.env.local`, scripts, or documentation.
The runner uses its inherited environment and does not load credential files.

```powershell
op run -- pwsh -NoProfile -File scripts/notion/run-notion-local.ps1
```

The runner resolves the repository root from its own location, validates the
manifest, synchronizes rows, and verifies canonical state. It stops on the
first failed command. The command writes existing canonical project fields
and can create missing rows or schema options; run it only within the approved
database and field scope.

To verify existing state without synchronizing it, use the same injected
environment and the canonical category mapping:

```powershell
$env:NOTION_STATUS_PROPERTY = 'Category'
op run -- node scripts/notion/verify-notion-canonical-state.mjs
```

## Canonical database contract

| Property | Type | Purpose |
|----------|------|---------|
| Name | title | Project name |
| Slug | rich text | Stable project identity |
| Repo | rich text or URL | Repository identity and fallback match |
| URL | URL | Public project link |
| Description | rich text | Generated project description |
| Tags | multi-select | Project tags |
| Category | select | active, maintained, planned, archived |
| Domain | select | Portfolio domain when supplied |

The runner sets `Category`, `Tags`, and `Domain` to match this contract. Direct
script calls accept the property overrides listed in each script. The sync
preflight checks required property types and option names. Set
`NOTION_AUTO_CREATE_OPTIONS=0` when schema expansion is outside the approved
scope; missing options then fail validation.

The verifier expects one historical `kohyr.com` row with Category `archived`.
That category is not Notion's page archive state. Preserve historical records;
do not delete unexpected rows to satisfy a count check. Investigate differences
against the approved manifest and database before changing either.

## Ownership and scheduling

The [sync glossary](github-notion-sync-glossary.md) separates this Projects
pipeline from repository activity reports. A scheduler outside this repository
must be verified at its live source before claiming scheduled execution.
Successful local tests or a merged PR do not prove a live sync completed.
