---
type: canonical
source: local-scan
sync: quarterly
sla: best-effort
title: Desktop repository inventory
description: Machine-readable list of git roots under the desktop workspace, archetypes, and golden reference repos.
last_updated: 2026-03-30
category: governance
audience: [ai-agents, contributors]
status: active
related:
  - ./repository-layout-standard.md
  - ./tooling-quality-gates.md
  - ../operations/github-repo-canonical-verification.md
---

# Desktop repository inventory

## SSOT

- **JSON inventory**: [`desktop-repo-inventory.json`](./desktop-repo-inventory.json) — repo folder names, archetypes, tiers, golden references.
- **Portfolio manifest**: [`projects.json`](../../projects.json) — public-facing slugs, URLs, `category` (lifecycle).

## Regenerating

Re-scan local folders (PowerShell example):

```powershell
Get-ChildItem -Path "$env:USERPROFILE\Desktop\GitHub" -Directory -Recurse -Depth 5 -ErrorAction SilentlyContinue |
  Where-Object { Test-Path (Join-Path $_.FullName '.git') } |
  ForEach-Object { $_.FullName }
```

Merge results into `desktop-repo-inventory.json` and bump `generated`.

## Exclusions

- **Duplicate rollout clones**: paths containing `_devkit-rollout` (use authoritative repo folders).
- **Nested caches**: e.g. `.cache/` under a repo (not standalone products).

## Golden references

See `golden_references` in the JSON file. Use these when scaffolding or copying ESLint/Prettier/Next patterns.
