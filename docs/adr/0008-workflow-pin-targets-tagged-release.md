---
type: canonical
status: accepted
last_updated: 2026-09-08
owner: meshal
---

# ADR 0008: Reusable-workflow pin targets a tagged hub release, not a main SHA

## Decision

The fleet-wide reusable-workflow pin recorded in `catalog/kernel.yaml`
(`workflow_pin_sha`) targets a **tagged release of `core/alawein`**, not an
arbitrary `main` commit SHA. Reusable workflow `uses:` references across the
46-repo fleet resolve to `alawein-org/alawein/.github/workflows/<name>.yml@<tag>`
(exact org path per repo remote config), where `<tag>` is a dedicated kernel
release tag (e.g. `kernel-v0.1.0`), scoped to kernel releases and distinct
from any product-level tags already present on `core/alawein` (`v1.0.0`,
`v2.1.0`), which belong to an unrelated release line and must not be reused
for kernel pins.

Mechanics:

- A kernel release tag is cut only after the corresponding reusable workflow
  changes have merged to `core/alawein` `main` through the normal per-PR
  merge gate. The tag is never pushed to a commit that has not passed review.
- `catalog/kernel.yaml.workflow_pin_sha` stores the tag name (not a raw SHA)
  once cut. Until a kernel release tag exists, the field stays `null` per the
  existing kernel.yaml comment; this ADR resolves the *mechanism*, not the
  specific value, which is set at Phase 6 step 4 (repo-drift release) /
  Phase 6 step 5 (kernel-sync workflow PR merge) time.
- One pin bump = one new kernel release tag = one bump PR per wave (existing
  step 30 constraint), never a same-tag force-move.

## Rejected alternatives

- **Pin to a specific `main` commit SHA.** Rejected by explicit maintainer
  decision (checkpoint 1, 2026-09-08 session): a raw SHA pin has no
  human-readable version marker, requires out-of-band tracking of "which SHA
  is blessed," and makes a bad pin harder to spot in review than a tag bump.
  The existing drift this plan exists to fix (`ed5ed61`, `6cddc4b`, `9779fa3`,
  `1256254`, `430c345`, `67c8b3e`) is itself evidence that untracked SHA pins
  drift silently.
- **Float on `main` directly (`@main`).** Rejected: no pin at all defeats the
  purpose of a fleet-wide pin; any hub `main` commit, reviewed or not, would
  immediately affect all 46 repos' CI with no bump PR and no rollback point.

## Consequences

- Requires a tag-cutting step in the kernel-sync release process
  (Phase 2 step 11 for the `repo-drift` release; a parallel tag for
  `core/alawein` reusable workflows themselves once Phase 6 step 5's
  workflow PR merges).
- `catalog/kernel.yaml` documentation and the renderer's template-fetch logic
  must treat `workflow_pin_sha` as a git ref (tag), not assume it is a 40-char
  SHA. Any code that validates the field's shape must accept tag syntax.
- Rollback is a tag move to the previous kernel release tag, which is a
  reviewable, auditable action rather than a raw SHA lookup.
