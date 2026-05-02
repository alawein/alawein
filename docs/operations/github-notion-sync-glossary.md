---
type: canonical
source: none
sync: none
sla: none
title: GitHub ↔ Notion sync glossary and guardrails
description: Definitions for Sync [project] vs GitHub Sync, canonical data flow, and out-of-scope rules for agents and operators.
last_updated: 2026-03-25
category: operations
audience: [ai-agents, contributors, notion]
status: active
related:
  - ./notion-projects-database.md
  - ../../projects.json
  - ../../.github/workflows/notion-sync.yml
---

# GitHub ↔ Notion sync glossary and guardrails

This page is the **GitHub-side** counterpart to the Operations Hub handoff in Notion. Keep terminology aligned between Notion AI sessions and this repository.

## Definitions

| Term | Meaning |
|------|--------|
| **Sync [project]** | Refresh **project row** data using the **canonical org path**: [`alawein/alawein`](https://github.com/alawein/alawein) → [`projects.json`](../../projects.json) → Notion (via [`notion-sync.yml`](../../.github/workflows/notion-sync.yml) and [`scripts/notion/sync-to-notion.mjs`](../../scripts/notion/sync-to-notion.mjs)). |
| **GitHub Sync** (operational) | **Activity scan** for a single GitHub repo: last commits, open PRs, open issues, emitted as `reports/sync-report.<repo>.json` by per-repo `scripts/github-sync-report.mjs` and the **Ops — GitHub sync report** workflow. **Does not** write to Notion. |

## Canonical flow (project rows)

1. **Source of truth for portfolio / project rows:** `alawein/alawein` — `projects.json` (`featured`, `notion_sync`, `research` as applicable).
2. **Notion database:** “Projects (Canonical)” — populated/updated by org automation, not by default from each product repo.
3. **Per-repo** `.github/workflows/notion-sync.yml` **stubs** in product repos are **placeholders** (pointer + TODO). They exist so operators know where real sync lives; they are **not** a second Notion pipeline unless explicitly wired with secrets and a deliberate design change.

## Out-of-scope guardrails (for agents and tools)

1. **Do not** treat per-repo `sync-report` workflows as **Notion push** pipelines. They produce **JSON scans** for ops (and optional CI artifacts).
2. **Do not** assume every product repo should edit **`projects.json`** or push to Notion as the default way to “sync a project.” The default is **org repo** → `projects.json` → Notion.
3. **Do not** introduce duplicate `NOTION_TOKEN` / `NOTION_DB_ID` wiring across all repos **without** an explicit decision to centralize vs reuse workflows (e.g. `workflow_call` to `alawein/alawein`).
4. **Rule #4 (architecture drift):** If a suggestion implies **per-repo Notion pushes from every product repo** or **routinely editing `projects.json` from each repo** as the primary sync path, treat that as **out of scope** unless the architecture is **explicitly** changed and documented here and in Notion.

## Naming and legal entity

- **Legal / repository metadata:** **Kohyr Inc.** (match counsel and filings).
- **Public / brand copy:** **Kohyr** is acceptable where the legal suffix is not required.

## Related docs

- [Notion Projects (Canonical) — sync and checklist](./notion-projects-database.md)
- Per-repo operator docs: `docs/operations/SYNC.md` and `docs/operations/RUNBOOK.md` inside individual `alawein/*` repositories (pattern established for ops scans).

## Notion parity note

If the **Memories** or instruction page in Notion is missing (e.g. in Trash), restore it from **Trash** before relying on Notion-only preference storage. **Guardrails in this file remain authoritative on the GitHub side.**
