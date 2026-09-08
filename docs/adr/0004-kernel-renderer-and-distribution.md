---
type: canonical
status: accepted
last_updated: 2026-09-08
owner: meshal
---

# ADR 0004: Single renderer, fanout PR distribution

## Decision

One renderer lives in the hub (`scripts/kernel/render.py`, invoked as
`python -m kernel render`). Distribution to the 46 repos happens two ways
using the same renderer: (1) `.github/workflows/kernel-sync.yml` opens or
updates one PR per repo, verified by the `kernel_conformance` detector in
`repo-drift`; (2) `workspace-batch` invokes the same renderer locally for
bulk worktree runs, so a contributor working in a worktree gets identical
output without waiting for CI.

## Rejected alternatives

- Per-repo renderers (each repo has its own scaffolding script). Rejected:
  this is the status quo (`templates/scaffolding/` static fragments with no
  renderer) and produces exactly the drift this plan exists to remove.
- Push-based sync that commits directly to each repo's default branch
  without a PR. Rejected: no review point before a managed-file change lands;
  violates the per-PR merge gate in ADR 0005.
- A separate renderer implementation for the CI fanout path and the local
  `workspace-batch` path. Rejected: guarantees the two paths diverge; the
  plan requires local runs and CI runs to be byte-identical.

## Consequences

The renderer must be dependency-light and callable from both a GitHub Actions
job and a local Python invocation with no network access, since
`workspace-batch` runs it against local worktrees. `.kernel-manifest.json`
(sha256 per managed path) is the only state `repo-drift` needs to verify
conformance without re-rendering, keeping the detector itself
dependency-free (ADR 0003 consequence).
