---
type: canonical
source: none
sync: none
sla: on-change
title: Version History Audit
description: Repeatable protocol to take a repo from incoherent version history to a clean SemVer baseline by additive re-indexing, never by rewriting published history
category: governance
audience: [ai-agents, contributors]
status: active
last_updated: 2026-06-09
tags: [versioning, semver, audit, changelog, history, convention]
---

# Version History Audit

This document defines a repeatable protocol for taking a repo from incoherent
version history to a clean SemVer baseline. The load-bearing
principle is: **re-index by addition, never by rewriting published history**
(the convention at `commit-release-convention.md` forbids history rewrite
outright). The convention's standing remedy for bad version truth is to fix
forward (a corrective patch tag); this protocol adds a one-time backward
reconstruction, but confines it to the rosetta annotation layer so it never
rewrites or fabricates the canonical tag-and-CHANGELOG line. Three phases run in
sequence: Phase A inventories without writing anything; Phase B reconciles by
adding annotations; Phase C sets the baseline and wires the standing gate.

## Phase A: Inventory (read-only)

Phase A collects every version signal in the repo before any decision is made.
It writes nothing but the inventory report (written to
`docs/version-audit-report.md`), which feeds Phase B.

1. Locate every version anchor: git tags; `CHANGELOG.md`; every `package.json`,
   `pyproject.toml`, `__init__.py`, and `VERSION` file; and version-encoded
   document names (for example, workspace memory records Kohyr
   "dotted-version docnames" and an "unregistered VERSION").
2. Build a coherence matrix (anchor by claimed version) and flag every
   disagreement between anchors.
3. Classify history: are existing tags valid SemVer? Are there milestone-only
   tags (for example Kohyr M1-M6) that are not SemVer? Are there gaps, meaning
   CHANGELOG entries with no corresponding tag, or tags with no CHANGELOG entry?
4. Resolve physical-location ambiguity. For Kohyr, this is the first concrete
   task: the local workspace holds both `kohyr/kohyr` (reads as empty or husk)
   and `kohyr/kohyr-internal-wip` (the pre-rename name that memory marks
   archived). Confirm which directory holds canonical version truth before
   reconciling anything. For any repo, identify and confirm the canonical
   checkout before Phase B begins.

## Phase B: Reconcile (decide, do not destroy)

Phase B makes decisions and writes the rosetta annotation. It never touches
existing tags, commits, or CHANGELOG entries in a destructive way.

1. Pick the canonical current version: either the highest credible anchor found
   in Phase A, or a deliberate reset recorded with rationale in the rosetta.
2. Produce a `VERSION-HISTORY.md` rosetta (see format below) that maps every
   legacy or milestone identifier to a reconstructed SemVer, with dates and
   anchor commit SHAs. This is the "re-index without losing traceability"
   mechanism. The rosetta is a **write-once historical record, not a forward
   anchor**: from the baseline tag onward, the git tag plus the CHANGELOG top
   entry are the only canonical version truth (per `commit-release-convention.md`
   sections 5 and 7), so the rosetta cannot become a fourth drifting anchor. It
   is exempt from the 30-day freshness SLA because it describes settled history,
   not living state.
3. Map milestone tags to the SemVer they correspond to in the rosetta.
   Reconstructed historical tags are **optional and local only**: do not push a
   reconstructed tag to a shared remote. A pushed tag is indistinguishable to
   `git describe`, GitHub Releases, and changelog tooling from a real historical
   release, so pushing reconstructed tags fabricates release history. The rosetta,
   not a tag, is the canonical reconstruction record.
4. For real-but-unreleased past work, synthesize backfilled CHANGELOG entries
   marked as reconstructed, so the changelog reads continuously from the earliest
   recoverable anchor to the current HEAD.

## Phase C: Baseline and enforce

Phase C closes the protocol and hands off to the standing gate.

1. Correct all derived anchors (`package.json`, `pyproject.toml`, `__init__.py`,
   `VERSION`) so they agree with the canonical version established in Phase B.
2. Write the current CHANGELOG head entry for that version and cut a clean
   baseline tag. The tag number is the one Phase B determined.
3. Wire the `version-coherence` check warn-only, then flip it to blocking once
   it goes green (per `commit-release-convention.md` section 7). Warn-only mode
   lets the first post-baseline commits settle without noise; blocking mode is
   the permanent state.
4. Log any deliberate residual, such as an anchor that cannot be corrected
   without touching a published artifact, in `docs/DEBT.md` via the `/debt-log`
   skill.

## Rosetta format

The rosetta lives at `docs/VERSION-HISTORY.md` (prefer `docs/`; the repo root is
acceptable only when the repo has no `docs/` directory). It uses the table format
below. The `Anchor commit` column holds the shortest
unambiguous SHA prefix for the commit that best represents the milestone or
release event. The `Notes` column explains what the milestone was and why the
SemVer mapping was chosen.

| Legacy identifier | Reconstructed SemVer | Date       | Anchor commit | Notes |
|-------------------|----------------------|------------|---------------|-------|
| M1 (gate opened)  | v0.1.0               | 2026-06-07 | 772bfff       | First verified heal-to-attest loop |
| M2 + M4 merged    | v0.2.0               | 2026-06-07 | 772bfff       | Verified self-healing loop shipped |

Add one row per distinct legacy identifier. Preserve the table once written;
do not remove rows when later milestones land. The rosetta is append-only after
the Phase B session that created it.

## Related

- [`commit-release-convention.md`](commit-release-convention.md) (sections 5
  and 7): the mechanical SemVer rules, the version-anchor model, and the
  `version-coherence` gate that Phase C wires.
- [`anti-rot.md`](anti-rot.md): the standing guardrails against silent debt and
  documentation drift, which apply to the rosetta and CHANGELOG outputs of this
  protocol.
- [`repo-framework.md`](repo-framework.md): repo maturity statuses and archive
  criteria; Phase C's baseline tag and tier effects feed into the posture
  declared here.
