---
type: canonical
source: none
sync: none
sla: none
title: Parallel Batch Execution
description: Manifest-driven, exception-only rules for autonomous multi-repo execution in the alawein workspace
category: governance
audience: contributors
status: active
author: alawein maintainers
version: 1.0.0
last_updated: 2026-03-16
tags: [governance, automation, workspace, batches, orchestration]
---

# Parallel Batch Execution

This guide defines the approved way to run large multi-repo changes without
serial "accept/go" coordination.

## Purpose

Use batch mode when the work spans multiple repos or when the execution is long
enough that conversational progress chatter adds no value.

Healthy batch behavior is:

- one kickoff artifact
- silent execution while the run is healthy
- one consolidated final report
- repo-scoped PRs instead of a mixed cross-repo branch

## Canonical Artifacts

- kickoff manifest: `docs/batches/<batch-id>/manifest.yaml`
- repo registry: `workspace-tools/config/repo-capabilities.yaml`
- runtime state: `workspace-tools/state/<batch-id>/status.json`
- audit ledger: `workspace-tools/state/<batch-id>/ledger.jsonl`
- final report: `docs/batches/<batch-id>/report.md`

## Execution Contract

- Use `workspace-batch` as the active control plane.
- Use one isolated git worktree per repo per batch.
- Never run two mutating workers against the same repo checkout.
- Keep one branch and one PR per repo.
- Use branch names in the form `codex/<batch-id>/<initiative-slug>`.
- Advance repos through:
  `discover -> preflight -> mutate -> validate -> package -> publish -> summarize`

## Communication Model

- Emit kickoff once the manifest is planned.
- Do not emit routine progress updates during healthy execution.
- Interrupt only for structured exceptions.
- Emit one final report after completion or abort.

## Exception Model

Structured exceptions must capture:

- `exception_id`
- `batch_id`
- `repo`
- `phase`
- `class`
- `blocking_scope`
- `evidence`
- `proposed_action`

Batch-blocking exceptions stop the run. Repo-local exceptions remain local unless
the manifest promotes them to batch-blocking policy.

The default batch-blocking set is:

- `destructive-risk`
- `policy-conflict`
- `missing-credentials`
- `canonical-truth-conflict`

Publish failures are repo-local by default.

## Validation and Publish Rules

- Run only commands declared in the repo registry.
- Skip missing validation commands only when the manifest allows it.
- After repo-local validation passes, package and publish automatically when the
  publish mode allows it.
- Resume uses the saved status and ledger instead of replaying completed green
  phases.

## Legacy Status

`workspace-tools/workspace-orchestration/` and the old bash entrypoints are
reference-only. They are not the approved execution path for current workspace
operations.

## See Also

- [workflow.md](workflow.md)
- [operating-model.md](operating-model.md)
- [review-playbook.md](review-playbook.md)
- [clean-slate-workflow.md](clean-slate-workflow.md)
