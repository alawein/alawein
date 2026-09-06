---
type: canonical
source: none
sync: none
sla: none
title: Alawein Workspace Master Prompt
description: Six-rule operating contract. Agent prompt, portfolio inventory, and batch execution live in their own sources.
last_updated: 2026-09-06
category: governance
audience: [ai-agents, contributors]
status: active
author: alawein maintainers
version: 1.3.0
tags: [workspace, governance, naming, directives, portfolio, batches]
---

# Alawein Workspace: Master Prompt

**Owner:** Meshal M. Alawein (`contact@meshal.ai`)

This file is the six-rule operating contract. Do not copy inventory, session
workflow, or style rules here.

| Concern | Canonical source |
| --- | --- |
| Agent system prompt | [`prompt-kits/AGENT.md`](../../prompt-kits/AGENT.md) |
| Portfolio and repo geography | `catalog/index.yaml` (compiled to `catalog/repos.json`) |
| Batch execution | [`parallel-batch-execution.md`](parallel-batch-execution.md) |
| Branch, commit, merge | [`commit-release-convention.md`](commit-release-convention.md) |
| Current decisions | [`SSOT.md`](../../SSOT.md) |

## Workspace rules

These are non-negotiable. Violations block merge.

### R-1: Single source of truth

- Every repo has an `SSOT.md` declaring canonical current state.
- `alawein/README.md` is the org-level portfolio surface. It is generated from
  the catalog. Do not hand-edit it.
- Read `SSOT.md` and `AGENTS.md` before making non-trivial changes.

### R-2: Scope before action

- Read the target repo `AGENTS.md` before editing.
- Respect that repo's always-do, ask-first, and never-do boundaries.
- Cross-repo changes require reading both repos' governance files first.

### R-3: Observable changes

- Use commit messages: `type(scope): description`.
- Every structural change must be traceable.

### R-4: Reject with evidence

- If a request violates a rule, refuse and explain why.
- Cite the exact file for the violated rule.
- Provide the compliant path forward.

### R-5: Sync or it did not happen

- Any structural change (rename, move, add, remove) must be reflected in the
  catalog, then `python scripts/catalog/sync-readme.py`.
- Config, imports, deploy targets, and documentation must be updated together.
- A change is incomplete until every reference is consistent.

### R-6: Batch contract

- Multi-repo autonomous execution starts from a
  `workspace-tools` batch `manifest.yaml`.
- Use `workspace-tools` repo-capability and state paths from
  [`parallel-batch-execution.md`](parallel-batch-execution.md).
- Healthy batch runs should not emit routine progress chatter between kickoff
  and final report.

## Naming

During naming transitions, canonical names are authoritative in governance
docs. Physical repo slugs may temporarily differ. Format:
`canonical-name (repo: physical-slug)`. Links stay on the physical slug until
cutover. Disk homes are `apps|core|lab|sites|work/<slug>` via catalog
`local_path`. See [`repo-topology-canon.md`](repo-topology-canon.md).
