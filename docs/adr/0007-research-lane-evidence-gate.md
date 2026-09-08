---
type: canonical
status: accepted
last_updated: 2026-09-08
owner: meshal
---

# ADR 0007: Evidence-gated research lane, no shortcut to the renderer

## Decision

Kernel-relevant research lives in `catalog/research.yaml` and
`docs/research/`, seeded only from verifiable exemplars with a source URL and
a date observed (Phase 8). No forward-dated citations. Any kernel-spec change
that research motivates requires an ADR before it reaches the kernel spec,
the renderer, or a wave. The promotion path is fixed: research entry -> ADR
-> kernel spec change -> renderer change -> wave. There is no shortcut from a
research entry directly to a renderer or template change.

## Rejected alternatives

- Let contributors add exemplar-inspired templates directly, backfilling the
  research citation later. Rejected: this is how unverifiable or
  forward-dated claims enter governance docs; the gate has to come before the
  artifact, not after.
- Skip the research lane entirely and rely on ADRs alone. Rejected: ADRs
  record decisions, not the evidence trail of what was considered and why;
  without `catalog/research.yaml` there is no durable, scored record of
  rejected or deferred exemplars.

## Consequences

`docs/research/README.md` carries the scoring rubric (adoption signal,
maintenance signal, security posture, fit to this kernel, migration cost).
Reviewers can reject a research-lane PR purely on the "no shortcut" rule
regardless of how good the proposed template is, if it skipped the ADR step.
