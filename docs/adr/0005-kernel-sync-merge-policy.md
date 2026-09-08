---
type: canonical
status: accepted
last_updated: 2026-09-08
owner: meshal
---

# ADR 0005: kernel-sync auto-merge is a narrow exception to the per-PR gate

## Decision

The default merge policy for this workspace is unchanged: every PR requires
an explicit, per-PR `exact yes merge #N` confirmation from the sole
maintainer. A single narrow exception is introduced: PRs labelled
`kernel-sync` may use GitHub auto-merge, and only when all of the following
hold simultaneously: the diff stays inside the path allowlist recorded in
`catalog/kernel.yaml`, the diff contains no changes to `src/`, `tests/`, or
dependency manifests, and all required checks (including the
`kernel-sync-guard` job) pass. A kill switch flag in `catalog/kernel.yaml`
disables auto-merge fleet-wide without a code change. Every auto-merge event
is appended to `catalog/generated/kernel-sync-audit.json`.

## Rejected alternatives

- No auto-merge; every kernel-sync PR still needs manual `exact yes merge #N`
  across up to 46 repos per wave. Rejected as the default because it does not
  scale with wave count and the risk on a guard-verified, path-restricted,
  no-source-change diff is low; retained as the universal fallback for
  anything the guard does not clear.
- Auto-merge for all PR classes, not just `kernel-sync`. Rejected: removes
  the review point for source/logic changes, which is the actual risk
  surface this workspace's merge discipline protects against.
- No kill switch. Rejected: an unattended fanout mechanism needs a fast,
  code-free way to stop it if the guard has a gap.

## Consequences

`kernel-sync-guard.yml` (Phase 6, step 26) is a required check on every
`kernel-sync`-labelled PR, not an advisory one. `catalog/kernel.yaml` becomes
security-relevant configuration: its path allowlist is the actual boundary
of what auto-merge can touch, so changes to that allowlist itself follow the
strict per-PR gate, never auto-merge.
