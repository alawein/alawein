---
type: canonical
source: none
sync: none
sla: on-change
title: Release Roadmap and Outcomes
description: Lightweight outcome-to-version bridge mapping product milestones to SemVer releases without redefining SemVer; the parallel outcome track for outcome-based releasing
category: governance
audience: [ai-agents, contributors]
status: active
last_updated: 2026-06-09
tags: [releases, semver, roadmap, outcomes, milestones, changelog, convention]
---

# Release Roadmap and Outcomes

This document defines the three-level outcome-to-version bridge that connects
product milestones to SemVer releases. The core principle is: **SemVer answers
"did the contract change?" It cannot answer "did we achieve something that
matters?"** Those axes are orthogonal; the bridge maps between them and never
redefines SemVer.

The bridge sits alongside the mechanical rules in
`commit-release-convention.md` and reuses the lifecycle tiers defined in
`../operations/project-lifecycle-tiers.md`. It adds a parallel outcome track
so that every increment reflects an achievement, without distorting SemVer's
compatibility meaning for any consumer of a declared contract surface.

The single sanctioned coupling between the outcome track and SemVer is the
`1.0.0` graduation: graduating out of `0.x` is an explicit outcome decision,
not a mechanical bump. Past `1.0`, strategy never forces a MAJOR increment. A
post-`1.0` MAJOR fires only on a real contract break (see
`commit-release-convention.md` sections 5.2 and 5.4 for the explicit rule).

## Level 1: Outcome

An outcome is a milestone with a verifiable definition-of-done tied to a
strategic driver and a target lifecycle-tier transition. Each outcome has the
following shape:

| Field | Description |
|-------|-------------|
| `id` | Short identifier used in the CHANGELOG and roadmap (for example, `M1`) |
| `statement` | One-sentence description of what is achieved |
| `observable definition-of-done` | A concrete, externally verifiable condition confirming the outcome is met |
| `strategic driver` | The product or trust thesis the outcome advances |
| `target lifecycle-tier transition` | The posture change the outcome triggers (for example, `planned -> active`) |

Example (Kohyr M1):

| Field | Value |
|-------|-------|
| `id` | M1 |
| `statement` | heal-wiring gate opens |
| `observable definition-of-done` | heal signs each decision into the attestation chain, verifiable end-to-end |
| `strategic driver` | the trust spine is the wedge |
| `target lifecycle-tier transition` | Kohyr moves `planned -> active` public loop |

Outcomes are declared before the work begins and confirmed at the release that
marks them shipped. They are not invented retroactively.

## Level 2: Release

A release is a SemVer version realizing part or all of an outcome. The
following rules govern the bridge at this level.

**Target version.** The roadmap declares an outcome's target version: the
version at which the outcome is first declared shipped, meaning its
definition-of-done is met. An outcome usually realizes over a range of releases;
the target marks completion, not the only version that touches it.

**Mechanical bump still applies.** The actual version increment follows
mechanical SemVer (see `commit-release-convention.md` section 5). Outcomes never
override the bump math; they annotate it.

**Many-to-many relationship.** A release may advance more than one outcome, and
an outcome may span many releases. The `Outcome:` field therefore takes one or
more outcome ids (the ones this release advances), not a single milestone.

**Required CHANGELOG field.** Every CHANGELOG entry at the top carries exactly
one of:

- `Outcome:` naming the outcome id(s) this release advances (use even when the
  release also carries fixes or maintenance work, as long as it advances any
  roadmap outcome's definition-of-done).
- `Maintenance:` for a release that advances no roadmap outcome at all.

`Maintenance:` is not an escape hatch. A release advancing any roadmap outcome's
definition-of-done uses `Outcome:` even if it also carries fixes; `Maintenance:`
is only for releases that touch no outcome at all. This field is the minimum
hook (presence is checkable in CI). It is necessary, not sufficient, for
outcome-based releasing; the real enforcement is the cross-doc check in the
Enforcement section below.

CHANGELOG head format:

```markdown
## [0.2.0] - 2026-06-07
Outcome: M2 + M4 (verified self-healing loop; heal signs into the attestation chain)

### Added
- ...
```

## Level 3: Roadmap

Each product carries one `release-roadmap.md` sequencing outcomes to target
versions to tier transitions, with live status. This replaces ad-hoc
"What's Next" sections with a structured, outcome-anchored table that can be
verified against the CHANGELOG.

A `pivot`-type entry is how a strategic resequencing is recorded: it retires a
planned outcome and reallocates its version target. For example, ADR-053's wedge
resequencing is a pivot that moved the MCP firewall from a standalone hero to a
gate inside the verified self-healing loop. Pivots appear as explicit rows in
the roadmap so the reallocation is traceable and the version target is not
silently reassigned.

Roadmap format:

```markdown
| Outcome | Statement | DoD (observable) | Driver | Target version | Tier effect | Status |
|---------|-----------|------------------|--------|----------------|-------------|--------|
| M1 | heal-wiring gate opens | heal -> attest loop verifiable e2e | trust-spine wedge | v0.1.0 | planned -> active | shipped 2026-06-07 |
```

Each row carries the outcome id, its statement, the observable definition-of-done,
the strategic driver, the target version, the tier transition it triggers, and
its current status (`planned`, `in-progress`, `shipped YYYY-MM-DD`, or
`pivot: <reason>`).

## Enforcement

Enforcement runs at two tiers.

**Floor (presence).** The top CHANGELOG entry carries an `Outcome:` or
`Maintenance:` line. This is a CI-checkable condition that requires no external
state. A release without this field fails the floor check.

**Real enforcement (cross-doc).** Every id named in an `Outcome:` line exists in
`release-roadmap.md`, and if the roadmap marks it shipped, the shipped version
equals the CHANGELOG head version. This cross-doc check prevents the label from
being faked or stamped on every release without a corresponding roadmap entry.
It also prevents a version target in the roadmap from drifting silently away from
what actually shipped.

The presence floor ships first; the cross-doc check is what makes this framework
more than a sticker. The implementing script (`check-changelog-outcome`) is part
of the Kohyr pilot, not this doc.

## Governance binding

Roadmap outcome statuses feed lifecycle-tier (`category`) transitions recorded
in `../operations/project-lifecycle-tiers.md`. When the launch outcome ships at
`v1.0.0`, the repo's posture transitions to `active` with a stable contract.

A negative outcome (a venture hypothesis disproved) is a `pivot` entry in the
roadmap. A pivot may trigger the archive criteria defined in `repo-framework.md`
if the repo's strategic basis is removed. The connection is explicit: the roadmap
is the input; `repo-framework.md` states the criteria; the decision is recorded
as a `pivot` row so the reasoning is preserved.

## Related

- [`commit-release-convention.md`](commit-release-convention.md): the mechanical
  SemVer rules and the `1.0.0` graduation rule (section 5.2) that is the single
  sanctioned coupling between outcomes and version increments.
- [`../operations/project-lifecycle-tiers.md`](../operations/project-lifecycle-tiers.md):
  the `category` field values (`active`, `maintained`, `planned`, `archived`) that
  roadmap outcome statuses drive.
- [`repo-framework.md`](repo-framework.md): repo maturity statuses and archive
  criteria that pivot entries may trigger.
- [`version-history-audit.md`](version-history-audit.md): the protocol for
  reconstructing and baselining version history in a repo before wiring this
  outcome bridge.
