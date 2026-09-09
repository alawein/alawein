---
type: canonical
status: accepted
last_updated: 2026-09-08
owner: meshal
---

# ADR 0003: Kernel home and single conformance engine

## Decision

`core/alawein` is the kernel: the single source of managed structure, catalog
data, templates, and the renderer for all 46 repos in the fleet. `repo-drift`
is the single conformance engine going forward. `workspace-batch`
(`core/workspace-tools`) keeps only the batch/fanout runner role (worktree
lifecycle, bulk render invocation); its drift-check path retires once
Phase 3 parity is proven with zero regressions.

## Rejected alternatives

- Keep `workspace-batch` as the conformance engine and add kernel checks to
  it directly. Rejected: couples fanout/runner concerns to conformance
  detection, and `workspace-batch` already carries unrelated worktree and
  batch-execution responsibilities.
- Run both `repo-drift` and `workspace-batch drift` as permanent parallel
  gates. Rejected: two engines reporting on the same surface invites
  divergence and doubles the maintenance surface for no benefit once parity
  is proven.
- Distribute conformance logic per-repo (each repo owns its own checks).
  Rejected: reintroduces the drift this plan exists to remove; 46 independent
  implementations cannot stay in sync.

## Consequences

`repo-drift` gains new detectors (`kernel_conformance`, `workflow_pin`,
`agent_contract`, `metadata_schema`, `worktree_registry`) per Phase 2.
`bolts`' required `drift` check keeps running `workspace-batch` until parity
evidence lands (Phase 3, step 12-13); removing it earlier would leave `main`
unprotected. The retirement of the `workspace-batch` drift path is tracked as
a dependency of step 15, not an open question.
