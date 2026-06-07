---
type: canonical
source: none
sync: none
sla: on-change
last_updated: 2026-06-06
title: Anti-Rot Primitives
description: Failure-mode guardrails for agentic work, their canonical homes, and the mapping onto existing platform tools.
category: governance
audience: [ai-agents, contributors]
status: active
tags: [governance, debt, adr, anti-rot]
---

# Anti-Rot Primitives

Each named failure mode of agentic coding maps to a guardrail with a canonical home.

| Failure mode | Guardrail | Canonical home |
|---|---|---|
| Big-bang rewrite / diff-size-for-its-own-sake | Incremental, test-gated change | `refactor` / `refactor-scout` (existing) |
| Context drift on long runs | Periodic re-grounding | `/checkpoint` (global skill) |
| Software rot / silent technical debt | Debt is tracked, never silent | `docs/DEBT.md` + `/debt-log` |
| Architectural erosion | Conformance vs intended design | `arch-review` (existing) + `docs/adr/` |
| Unverified change called "done" | Test gate is the objective | `reviewer` (existing) + repo CI gate |
| Decisions lost to memory | Reasoning is recorded | `docs/adr/` + `/new-adr` |

## Hard rules (folded into doctrine)

- **No big-bang rewrites.** Refactor incrementally; flag a wholesale module
  replacement to the maintainer with the risk spelled out.
- **No unverified change.** Never declare success without running the repo's gate.
- **No silent debt.** A deliberate shortcut is logged in `docs/DEBT.md` via
  `/debt-log`, never buried.

## Canonical homes

- Architecture decisions: `docs/adr/` (one decision per record, append-only,
  supersede rather than rewrite). Scaffold with `/new-adr`.
- Known shortcuts and debt: `docs/DEBT.md`. Append with `/debt-log`.

## Overlap with existing platform tools (do not re-add the kit versions)

The source anti-rot kit ships `code-reviewer`, `architecture-guardian`, and
`refactor-safe`. These are already covered and must not be re-added:

- `code-reviewer` maps to the `reviewer` agent (and `security-reviewer`, `pr-prep`).
- `architecture-guardian` maps to the `arch-review` skill.
- `refactor-safe` maps to the `refactor` skill and `refactor-scout` agent.

## Which repos must carry the artifacts

Code archetypes (`products`, `ventures`, `tools`, `research`) must carry
`docs/DEBT.md` and `docs/adr/`, enforced by
`scripts/doctrine/validate-repo-framework.py`. `_archive` and docs-only repos are
exempt.
