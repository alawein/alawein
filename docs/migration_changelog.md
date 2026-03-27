---
type: frozen
source: none
sync: none
sla: none
title: Migration changelog
description: Timestamped notes for docs and catalog moves in this repository (informal log).
last_updated: 2026-03-26
category: documentation
audience: [ai-agents, contributors]
status: active
---

# Migration Changelog

## 2026-03-25

- Extracted Claude Code reference content into canonical governance docs: `docs/governance/claude-code-configuration-guide.md` and `docs/governance/claude-code-migration-prompts.md`; linked from `CLAUDE.md` and `docs/README.md`. Source was local scratch JSX (`claude-code-*.jsx`, gitignored).

## 2026-03-23T03:12:43-07:00

- Ran `audits-collector` manually because `ops/consolidation_toolbox.py` is not present in this repository.
- Enumerated current `docs/audits` reports and established `docs/audits/README.md` as the canonical audits index.
- Updated `docs/README.md` Audits section to align with the canonical audits index.
- `docs/catalog/review_log.md` was not updated because this repository currently has no `docs/catalog/` workflow to log against.

## 2026-03-23T03:16:26-07:00

- Ran `repo-inspector` manually because `ops/consolidation_toolbox.py` is not present in this repository.
- Inventory snapshot: 132 files, 21 unique extensions, 1 duplicate-filename candidate group, 2 duplicate-size candidate groups.
- Duplicate filename candidate: `README.md` appears in repo root, `docs/`, and `docs/audits/`; decision: keep as intentional index files, no archival action.
- Duplicate size candidate A: 94,394-byte JSON group under `docs/dashboard/` and `docs/dashboard/snapshots/`; decision: keep as dashboard snapshot history, no archival action.
- Duplicate size candidate B: 2,542-byte pair (`.github/workflows/workspace-audit.yml` and `scripts/tests/test_vercel_alias_audit.py`); decision: same size only, distinct content and purpose, no archival action.
- `docs/catalog/review_log.md` was not updated because this repository currently has no `docs/catalog/` workflow to log against.
