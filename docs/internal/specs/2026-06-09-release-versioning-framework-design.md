---
title: Release and Versioning Framework: design
date: 2026-06-09
status: active
type: design-spec
feeds: [writing-plans]
last_updated: 2026-06-09
---

# Release and Versioning Framework: design

**Generated:** 2026-06-09
**Scope decision:** Kohyr single pilot; generalize to other repos in a later directive.
**Output decision:** extend the existing convention SSOT plus two companion governance docs.
**Pillar 3 depth:** lightweight outcome-to-version bridge built on `project-lifecycle-tiers.md` and Kohyr's M1-M6 milestones (no quarterly OKR scoring).

This spec turns a three-pillar request (versioning standards, legacy-history cleanup,
outcome-based releasing) into an approved design. It is the input to `writing-plans`.

---

## 1. Context and problem statement

The `alawein` workspace already owns a canonical
[`commit-release-convention.md`](../../governance/commit-release-convention.md). Section 5
("Releases and versioning (uniform semver)") already fixes the mechanical rules: `vX.Y.Z`
tags, `0.x` allowed, Keep a Changelog format, a GitHub release per tag, a version anchor
model (git tag plus the top CHANGELOG entry are canonical; `package.json`, `pyproject.toml`,
and `__init__.py` derive from them), a bump rule (`feat` -> minor, `fix`/other -> patch,
`BREAKING CHANGE` -> major), and a `version-coherence` check. Section 7 states that this
check stays warn-only "after repos converge on coherent versions," then flips to blocking.

So the three pillars sit at three different maturity levels, and the framework's job differs
per pillar:

| Pillar | Current state | This framework's job |
|---|---|---|
| 1. Versioning standards | ~80% specified in convention section 5 | Extend the edges: pre-release identifiers, explicit 0.x semantics, monorepo mode, contract-surface definition, independent contract versions |
| 2. Legacy data management | Known-open; section 7 names convergence as a precondition that has not happened | Add a repeatable audit -> reconcile -> baseline protocol that re-indexes history without rewriting it |
| 3. Strategic roadmap integration | Greenfield; no OKR doc exists, only scattered milestones, lifecycle tiers, and SSOT "What's Next" | Build a lightweight outcome-to-version bridge that maps milestones to target versions |

Existing constructs this design reuses rather than reinvents:

- **Lifecycle tiers** (`docs/operations/project-lifecycle-tiers.md`): `category` in
  `projects.json` is `active | maintained | planned | archived` (portfolio posture).
- **Repo maturity** (`docs/governance/repo-framework.md`): README `Status` is
  `active | paused | experimental | deprecated | archived | frozen`.
- **Kohyr milestones** (workspace memory): M1-M6, the verified self-healing-loop wedge
  (M1 heal-wiring gate, M2 heal-wiring, M4 attestation chain, M5 Rekor, M6 in-toto).
- **Kohyr contract versions** already in use: `kohyr.action-attestation/v1` (Ed25519 chain).

The gap Pillar 3 closes: none of these tie a *version increment* to a *product outcome*.

## 2. Design decisions

### 2.1 The load-bearing fork: how SemVer relates to outcomes

Chosen: **Approach A, parallel outcome track plus annotation.** SemVer stays purely
mechanical. Outcomes are a separate ladder (milestones) that map to target versions through
a required CHANGELOG field and a roadmap doc. `1.0.0` is the single point where outcome and
SemVer deliberately fuse (graduating out of `0.x` is an explicit launch decision).

Rejected alternatives:

- **B, outcome-driven version semantics** (redefine MINOR = "outcome advanced," MAJOR =
  "strategic pivot"). Rejected because it breaks SemVer's compatibility meaning. A breaking
  change to the attestation wire format that carries no strategic weight would be
  mis-numbered, and any consumer of a Kohyr contract could no longer read compatibility from
  the version. This is the trap the phrase "outcome-based releasing" invites; it is the wrong
  reading for any repo with API or schema consumers.
- **C, milestones only, no bridge.** Rejected because it is the status quo and does not
  deliver "every increment reflects an achievement."

Core principle that follows from A: **SemVer answers "did the contract change?" It cannot
answer "did we achieve something that matters?"** Those axes are orthogonal, so the bridge
maps between them; it does not redefine one in terms of the other.

### 2.2 Scope and output (from the brainstorming answers)

- Pilot on Kohyr only. The *framework* is authored as generalizable governance in
  `alawein/alawein`; each piece is then *proven* with a concrete Kohyr instance so it is
  validated, not theorized.
- Extend the convention SSOT (section 5) plus two new companion governance docs, mirroring
  how the governance suite already factors concerns.
- Keep Pillar 3 lightweight: reuse milestones and lifecycle tiers; do not introduce quarterly
  Objectives-and-Key-Results scoring machinery.

## 3. Pillar 1: versioning standards (extend convention section 5)

Leave the canonical rules unchanged. Add five subsections to section 5.

### 3.1 Pre-release identifiers

Define ordering `X.Y.Z-alpha.N` < `X.Y.Z-beta.N` < `X.Y.Z-rc.N` < `X.Y.Z`. Use `-rc.N`
tags for `release/*` stabilization (the convention has `release/*` branches but no tag-suffix
policy). A pre-release tag may carry a provisional CHANGELOG entry; on final release the
pre-release entries roll up into the single dated `X.Y.Z` entry. Pre-release tags never flip
`version-coherence` to a new stable baseline.

### 3.2 Explicit 0.x semantics and the 1.0.0 trigger

While a repo is in `0.x` there is no MAJOR digit to bump, so MINOR absorbs both features and
breaking changes:

- `feat` -> **MINOR** (`0.Y.0`).
- `fix` or other backwards-compatible change -> **PATCH** (`0.y.Z`).
- `BREAKING CHANGE` -> **MINOR** (`0.Y.0`), because there is no MAJOR digit in `0.x`.

This keeps continuity with the `1.x` mapping already in the convention (`feat` stays MINOR,
`fix` stays PATCH); the only `0.x` deviation is that a breaking change lands as MINOR rather
than MAJOR. State it explicitly so agents do not bump a phantom MAJOR inside `0.x`, and so
feature milestones land as MINOR (which is what the Pillar 3 rosetta and roadmap assume).

Graduating `0.x -> 1.0.0` is an **outcome decision**, not a mechanical bump: it happens when
the public contract surface is declared stable (first stable public API, first external
consumer, or the declared launch outcome in the roadmap). This is the **only** outcome-driven
version event.

Past `1.0`, strategy never forces a MAJOR. A relaunch or strategic pivot that breaks no
declared contract surface (section 3.4) ships as the mechanical bump its diff warrants
(usually MINOR); the narrative weight lives in the `Outcome:` line and the roadmap, not in a
vanity `2.0.0`. The deliberate tradeoff: no marketing-driven major numbers. A post-`1.0` MAJOR
fires only on a real contract break. This confines the outcome-to-version coupling to the
single `1.0.0` graduation and preserves SemVer's compatibility meaning for every consumer of a
declared surface.

### 3.3 Monorepo versioning mode

Two valid models; each repo declares which it uses:

- **Fixed (repo-level):** one version, one tag, one CHANGELOG for the whole repo. Default.
- **Independent (changesets):** per-package versions. `tools/design-system` already uses
  this.

Kohyr is declared **fixed repo-level**: it ships as one product, so the product carries one
`vX.Y.Z` line even though it contains internal TypeScript packages (`@kohyr/shared`,
`apps/web`) and a Python tree (`src/kohyr`). The mode is recorded per repo in
`catalog/repos.json` alongside `commit_mode` (for example `release_mode: fixed`); an absent
field means fixed.

### 3.4 Contract-surface definition

"Breaking" is only meaningful relative to a declared surface. Each product repo declares its
public contract surfaces; a `BREAKING CHANGE` footer (and therefore a MAJOR bump, or a MINOR
bump in `0.x`) is warranted only when one of those surfaces breaks. Without this, every
internal refactor looks breaking.

Kohyr's declared surfaces: CLI commands and flags; the attestation/receipt wire format; the
MCP firewall API; the public config schema.

The surface list is **closed-world and must be published where consumers see it** (the repo
README or a `CONTRACT.md`): anything not listed carries no stability promise. This is the
model's sharp edge. Undeclared behavior that consumers nonetheless depend on (exit codes,
stdout and log format, file paths, environment variables, and the attestation *output* read by
third parties) can be broken by a "non-breaking" patch. The list is only as honest as it is
complete, so: review it whenever a new external consumer appears, and promote the attestation
output to a declared surface the moment anything external parses it. A surface list that omits
what people actually depend on gives false compatibility, which is worse than promising
nothing.

### 3.5 Independent contract versions

Some artifacts carry their own SemVer line. The attestation schema
(`kohyr.action-attestation/v1`) and the MCP protocol are examples. Independence is **partial
and asymmetric**, and this is the one place sections 3.4 and 3.5 must agree:

- A **backward-compatible** schema evolution (`v1 -> v1.1`, additive fields) is independent: it
  bumps the contract's own version and does *not* require a product bump.
- A **breaking** schema change (`v1 -> v2`, incompatible wire format) is, by section 3.4, a
  break of a declared contract surface. It therefore *also* moves the product version (MINOR in
  `0.x`, MAJOR in `1.x`). It is not decoupled.

So "independent version line" means the contract gets its own number for additive evolution,
not that a breaking schema change escapes the product version. The registry below prevents the
mistake in the other direction too (bumping the product MAJOR for an unrelated schema patch):

| Contract | Current version | Location | Bumped when |
|---|---|---|---|
| `kohyr.action-attestation` | v1 | attestation schema file | wire format changes incompatibly |
| MCP firewall protocol | (to confirm in audit) | firewall package | request/response contract changes |

## 4. Pillar 2: legacy data management (new doc `version-history-audit.md`)

A repeatable, mostly read-only protocol that takes a repo from incoherent version history to
a clean baseline, then arms the standing coherence gate. Load-bearing principle:
**re-index by addition, never by rewriting published history** (the convention forbids history
rewrite). The convention's standing remedy for bad version truth is to fix *forward* (a
corrective patch tag); this protocol adds a one-time *backward* reconstruction but confines it
to an annotation layer (the rosetta), so it never rewrites or fabricates the canonical
tag-and-CHANGELOG line. Three phases.

### 4.1 Phase A: Inventory (read-only)

1. Locate every version anchor: git tags; `CHANGELOG.md`; every `package.json`,
   `pyproject.toml`, `__init__.py`, `VERSION`; and version-encoded document names (workspace
   memory records Kohyr "dotted-version docnames" and an "unregistered VERSION").
2. Build a coherence matrix (anchor x claimed version) and flag every disagreement.
3. Classify history: are existing tags valid SemVer? Are there milestone-only tags
   (Kohyr M1-M6) that are not SemVer? Are there gaps (CHANGELOG entries with no tag, or tags
   with no CHANGELOG)?
4. Resolve physical-location ambiguity. For Kohyr this is the first concrete task: the local
   workspace holds both `kohyr/kohyr` (reads as empty or husk; `git` returned 128 during this
   design session) and `kohyr/kohyr-internal-wip` (the pre-rename name memory marked archived).
   Confirm which directory holds canonical version truth before reconciling anything.

Phase A writes nothing; it produces a per-repo report.

### 4.2 Phase B: Reconcile (decide, do not destroy)

1. Pick the canonical current version (the highest credible anchor, or a deliberate reset
   recorded with rationale).
2. Produce a `VERSION-HISTORY.md` rosetta that maps every legacy or milestone identifier to a
   reconstructed SemVer, with dates and anchor commit SHAs. This is the "re-index without
   losing traceability" requirement: the past is annotated, never destructively retagged. The
   rosetta is a **write-once historical record, not a forward anchor**: from the baseline tag
   onward, the git tag plus CHANGELOG stay the only canonical version truth (per the
   convention), so the rosetta cannot become a fourth drifting anchor. It is exempt from the
   30-day freshness SLA because it describes settled history.
3. Map milestone tags to the SemVer they correspond to in the rosetta. Reconstructed historical
   tags are **optional and local only**: do not push a reconstructed tag to a shared remote. A
   pushed tag is indistinguishable to `git describe`, GitHub Releases, and changelog tooling
   from a real historical release, so pushing reconstructed tags fabricates release history.
   The rosetta, not a tag, is the canonical reconstruction record.
4. For real-but-unreleased past work, synthesize backfilled CHANGELOG entries marked as
   reconstructed, so the changelog reads continuously.

Rosetta format:

```markdown
| Legacy identifier | Reconstructed SemVer | Date       | Anchor commit | Notes |
|-------------------|----------------------|------------|---------------|-------|
| M1 (gate opened)  | v0.1.0               | 2026-06-07 | 772bfff       | First verified heal-to-attest loop |
| M2 + M4 merged    | v0.2.0               | 2026-06-07 | 772bfff       | Verified self-healing loop shipped |
```

### 4.3 Phase C: Baseline and enforce

1. Correct all derived anchors so they agree with the canonical version.
2. Write the current CHANGELOG head and cut a clean baseline tag.
3. Wire `version-coherence` warn-only, then flip to blocking once green (per convention
   section 7).
4. Log any deliberate residual to `docs/DEBT.md`.

### 4.4 Kohyr pilot output

`kohyr/kohyr/docs/VERSION-HISTORY.md` (rosetta), corrected anchors, a baseline tag whose
number Phase B determines, and `version-coherence` wired into CI. Expected findings, to be
confirmed at execution: two local checkouts, missing or relocated root anchors,
milestone-only tags, the unregistered `VERSION`, and dotted-version docnames.

## 5. Pillar 3: outcome-to-version bridge (new doc `release-roadmap-and-outcomes.md`)

A three-level ladder. Each level is a named artifact with a defined shape.

### 5.1 Level 1: Outcome (the why)

A milestone with a verifiable definition-of-done tied to a strategic driver. Kohyr already
has these (M1-M6); formalize each as:

`{ id, statement, observable definition-of-done, strategic driver, target lifecycle-tier transition }`

Example: M1 -> DoD "heal signs each decision into the attestation chain, verifiable
end-to-end" -> driver "the trust spine is the wedge" -> tier effect "Kohyr moves
planned -> active public loop."

### 5.2 Level 2: Release (the what shipped)

A SemVer version realizing part or all of an outcome. Bridge rules:

- The roadmap declares an outcome's **target version**: the version at which the outcome is
  first declared *shipped* (its definition-of-done is met). An outcome usually realizes over a
  *range* of releases, not one; the target marks completion, not the only version that touches
  it.
- The actual bump still follows mechanical SemVer (section 3); outcomes never override the
  bump math.
- The relationship is **many-to-many**: a release may advance more than one outcome, and an
  outcome may span many releases. So the `Outcome:` field takes one or more outcome ids (the
  ones this release *advances*), not a single milestone.
- The CHANGELOG entry carries a required field: an **`Outcome:`** line naming the outcome(s) it
  advances, or a **`Maintenance:`** line for a release that advances none. `Maintenance:` is
  **not an escape hatch**: a release that advances any roadmap outcome's DoD uses `Outcome:`
  even when it also carries fixes; `Maintenance:` is only for releases that touch no outcome at
  all. This field is the **minimum** hook (presence is checkable in CI). It is necessary, not
  sufficient, for outcome-based releasing; the real enforcement is the cross-doc check in
  section 7.

CHANGELOG head format:

```markdown
## [0.2.0] - 2026-06-07
Outcome: M2 + M4 (verified self-healing loop; heal signs into the attestation chain)

### Added
- ...
```

### 5.3 Level 3: Roadmap (the when and the why-ordered)

One `release-roadmap.md` per product sequencing outcomes to target versions to tier
transitions, with status. This replaces ad-hoc "What's Next" with a structured,
outcome-anchored table. A `pivot`-type entry is how a version increment can reflect a
strategic pivot: it retires a planned outcome and reallocates its version target (for example
ADR-053's wedge resequencing).

Roadmap format:

```markdown
| Outcome | Statement | DoD (observable) | Driver | Target version | Tier effect | Status |
|---------|-----------|------------------|--------|----------------|-------------|--------|
| M1 | heal-wiring gate opens | heal -> attest loop verifiable e2e | trust-spine wedge | v0.1.0 | planned -> active | shipped 2026-06-07 |
| M5 | Rekor transparency log | decisions logged to Rekor | verifiable trust spine | v0.3.0 | active | planned |
```

### 5.4 The feature-to-outcome shift, concretely

- Feature-based: "v0.3.0 because we added three features."
- Outcome-based: "v0.3.0 realizes M5 (Rekor transparency log), advancing the
  verifiable-trust-spine driver; the features are the means." The target version is declared
  before the work and confirmed at release.

### 5.5 Governance binding

- Roadmap outcome statuses feed lifecycle-tier (`category`) transitions: when the launch
  outcome ships at `v1.0.0`, Kohyr's posture is `active` with a stable contract.
- A negative outcome (a venture hypothesis disproved) is a `pivot` entry and may trigger the
  archive criteria in `repo-framework.md`.

### 5.6 Kohyr pilot output

`kohyr/kohyr/docs/release-roadmap.md` with M1-M6 as outcomes, each given a target SemVer and
live status from memory (M1 gate opened; M2 + M4 shipped at `origin/main` `772bfff`; M5 Rekor
and M6 in-toto deferred), plus tier effects. The `Outcome:`/`Maintenance:` lines are
retrofitted into the CHANGELOG head produced by Pillar 2.

## 6. Deliverables

1. **Amend** `docs/governance/commit-release-convention.md` section 5 with the five Pillar 1
   subsections (3.1-3.5 above). Bump `last_updated`.
2. **New** `docs/governance/version-history-audit.md`: the Phase A -> C protocol and the
   no-rewrite re-index method (rosetta as the canonical reconstruction record, plus optional
   local-only annotated tags).
3. **New** `docs/governance/release-roadmap-and-outcomes.md`: the three-level bridge, the
   required `Outcome:`/`Maintenance:` CHANGELOG field, pivot handling, and the lifecycle-tier
   binding.
4. **Kohyr pilot instances** of items 2 and 3: `VERSION-HISTORY.md`, `release-roadmap.md`,
   corrected anchors, a baseline tag, and `version-coherence` in CI.
5. **Cross-links:** convention section 5 links out to both new companion docs; the governance
   index lists them.

## 7. Validation and enforcement

- Pillar 1: extend the `version-coherence` check to understand pre-release tags and the
  declared monorepo mode; the existing `commit_lint` already covers subjects.
- Pillar 2: the audit is a one-time-per-repo procedure plus the standing `version-coherence`
  gate (warn-only, then blocking).
- Pillar 3: a two-tier check. **Floor (presence):** the top CHANGELOG entry carries an
  `Outcome:` or `Maintenance:` line. **Real enforcement (cross-doc):** every id named in an
  `Outcome:` line exists in `release-roadmap.md` and is not already marked shipped, so the
  label cannot be faked or stamped on every release. The presence floor ships first; the
  cross-doc check is what makes Pillar 3 more than a sticker. The roadmap doc also gets doctrine
  frontmatter and `last_updated` enforcement.
- All new and amended docs pass the doctrine gate: frontmatter, kebab-case filenames, voice
  (no em-dashes, American spelling), `last_updated` bumped to the change date. New governance
  docs live under `docs/governance/` and are subject to the blocking doctrine tier.

## 8. Scope boundaries (non-goals)

- No git history rewrite; re-indexing is additive only.
- No quarterly OKR or scoring system (lightweight was chosen).
- No workspace-wide rollout in this pass; Kohyr is the sole pilot. Generalization to
  `menax-inc/menax`, `veyra`, and the rest is a later directive that reuses these docs.
- No change to the mechanical bump rules already in convention section 5.

## 9. Open questions and risks

1. **Kohyr canonical checkout.** `kohyr/kohyr` reads empty/husk locally and `kohyr-internal-wip`
   persists. Phase A must resolve which is canonical before any reconcile. Risk: acting on the
   wrong checkout. Mitigation: Phase A is read-only and confirms location first.
2. **Baseline version number.** Phase B picks Kohyr's baseline (`v0.2.0` is the likely
   candidate from memory, but the audit confirms it). Reversible: it is a declared decision in
   the rosetta.
3. **Monorepo mode for Kohyr.** Declared fixed here; if the TypeScript packages later need
   independent publishing, the repo can switch to changesets. Reversible.
4. **Convention section 5 growth.** Adding five subsections enlarges the convention. Mitigated
   by pushing the procedural detail (audit, roadmap) into the two companion docs and keeping
   section 5 to the rules only.
5. **Rot under solo maintenance (the dominant risk).** `repo-framework.md` names Kohyr a
   sole-owner repo. The framework asks one maintainer to keep three artifacts in sync (tags,
   CHANGELOG `Outcome:` lines, the roadmap); presence-only enforcement would let them drift,
   recreating the Pillar 2 mess one level up. Mitigation: enforcement is the automated cross-doc
   check (section 7), not maintainer discipline; the rosetta is write-once; and if sustaining
   all three proves too heavy, the fallback is to drop to a per-release `Outcome:` line only
   (Level 2 without the Level 3 roadmap) rather than let the roadmap rot into a lie. Tracked as
   the explicit success risk, not assumed away.

## 10. Acceptance criteria

- Convention section 5 states pre-release ordering, explicit 0.x rules, the 1.0.0 trigger,
  monorepo mode, contract-surface definition, and the independent-contract-version registry.
- `version-history-audit.md` defines Phases A-C and the additive re-index method, and a
  reader can run Phase A on any repo from the doc alone.
- `release-roadmap-and-outcomes.md` defines the three levels, the required CHANGELOG field,
  the many-to-many outcome-to-release relationship, pivot entries, and tier binding, with
  copyable table formats, and specifies the cross-doc `Outcome:`-to-roadmap validation (not
  just presence).
- Kohyr carries a `VERSION-HISTORY.md` rosetta, a `release-roadmap.md` mapping M1-M6 to target
  versions, coherent anchors, a baseline tag, and a green `version-coherence` check.
- Every new and amended doc passes the doctrine gate.

---

_Feeds: `writing-plans`. Spec home per SSOT.md ("Specs live in docs/internal/specs/")._
