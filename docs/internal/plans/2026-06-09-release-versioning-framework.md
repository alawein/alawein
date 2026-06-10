---
title: Release and Versioning Framework: implementation plan
date: 2026-06-09
status: active
type: implementation-plan
source_spec: docs/internal/specs/2026-06-09-release-versioning-framework-design.md
last_updated: 2026-06-09
---

# Release and Versioning Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a robust release and versioning framework as Kohyr-piloted governance: extend the workspace convention with the Pillar 1 versioning edges, add two companion governance docs (a history-audit protocol and an outcome-to-version bridge), and prove all three by instantiating them on Kohyr with coherent anchors, a baseline tag, and two CI checks.

**Architecture:** The committed spec (`docs/internal/specs/2026-06-09-release-versioning-framework-design.md`) is the **content source of truth**; this plan is the construction sequence. Phase 1 authors the framework in `alawein/alawein` (pure governance docs, validated by the doctrine suite). Phase 2 applies it to the Kohyr repo (a separate nested git repo), starting with a read-only audit whose inventory output drives the later anchor-correction tasks. No git history is rewritten; re-indexing is additive (a rosetta doc).

**Tech Stack:** Markdown governance docs under doctrine validation (`validate-doc-contract.sh`, `validate-doctrine.py`, `build-style-rules.py`, voice-check); Python 3.12 for the two CI check scripts (`pytest` for their tests); GitHub Actions for CI wiring; `git` for tagging.

---

## Plan-wide conventions

Read these once; every task assumes them.

- **Content SoT:** where a task says "content per spec section N", open the committed spec and use that section's prose. Do not invent divergent wording. The plan inlines only the literal edit blocks, frontmatter, table formats, and the genuinely-new CI code.
- **Repo boundaries:** Phase 1 edits `alawein/alawein` (control-plane git repo), continuing on the existing branch `feat/docs-release-versioning-framework` (which already holds the spec commit `4b78cb30`). Phase 2 edits the canonical Kohyr checkout, resolved in Task 6, on its own branch and PR. Always use `git -C <repo-path>`; never assume shared git state.
- **Pre-flight (every task that writes to a nested repo):** confirm repo path, current branch, and clean/dirty state with `git -C <repo> status --short --branch` before editing.
- **Doctrine "test" for doc tasks:** the acceptance test for a governance doc is the validator suite passing plus the spec's section-10 acceptance criteria being met. Governed docs under `docs/governance/` are blocking-tier; `docs/internal/` is exempt.
- **Commit identity and message:** author `contact@meshal.ai`, no AI attribution anywhere (subject, body, trailers), no em-dashes, American spelling, Conventional Commits subject (`type(scope): subject`, imperative, lowercase, hard cap 72 chars). One commit per task. The Docs Doctrine pre-commit hook re-validates on commit.
- **No destructive git:** no history rewrite, no force-push, no reconstructed tags pushed to a shared remote (Phase 2, Task 7).

### Validator commands (Phase 1, run from `alawein/alawein`)

```bash
python scripts/doctrine/build-style-rules.py --check
python scripts/doctrine/validate-doctrine.py .
bash ./scripts/doctrine/validate-doc-contract.sh --full
python scripts/doctrine/style-advisory-audit.py --repo-root .
```

The `/voice-resweep` skill wraps the full suite; run it once before the Phase 1 PR to clear every finding in one pass (the gates are sequential and otherwise surface one issue per run).

---

## Phase 1: Framework governance docs (`alawein/alawein`)

Branch: `feat/docs-release-versioning-framework` (already checked out; holds `4b78cb30`).

### Task 1: Create `version-history-audit.md` (Pillar 2)

**Files:**
- Create: `docs/governance/version-history-audit.md`

- [ ] **Step 1: Pre-flight**

Run: `git -C C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein status --short --branch`
Expected: on `feat/docs-release-versioning-framework`, no unexpected dirty files.

- [ ] **Step 2: Write the doc**

Frontmatter (kebab-case filename already satisfied):

```markdown
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
```

Body sections (content per spec section 4):

1. `# Version History Audit` + one-paragraph purpose, including the load-bearing principle verbatim: **re-index by addition, never by rewriting published history**, and the note that the convention's standing remedy is fix-forward while this protocol adds a one-time backward reconstruction confined to the rosetta annotation layer.
2. `## Phase A: Inventory (read-only)` — the four steps from spec 4.1 (locate every anchor; coherence matrix; classify history; resolve physical-location ambiguity). State that Phase A writes nothing but a report.
3. `## Phase B: Reconcile` — the four steps from spec 4.2, including the rosetta as a **write-once historical record, not a forward anchor** (exempt from the 30-day SLA), and the rule that reconstructed tags are optional and local-only (never pushed).
4. `## Phase C: Baseline and enforce` — the four steps from spec 4.3.
5. `## Rosetta format` — inline this exact table:

```markdown
| Legacy identifier | Reconstructed SemVer | Date       | Anchor commit | Notes |
|-------------------|----------------------|------------|---------------|-------|
| M1 (gate opened)  | v0.1.0               | 2026-06-07 | 772bfff       | First verified heal-to-attest loop |
```

6. `## Related` — link `commit-release-convention.md` (sections 5 and 7), `anti-rot.md`, `repo-framework.md`.

- [ ] **Step 3: Validate**

Run the four validator commands above, then:
Run: `bash ./scripts/doctrine/validate-doc-contract.sh --full`
Expected: PASS (no missing-frontmatter, voice, or filename findings for the new file).

- [ ] **Step 4: Voice-check the new doc**

Invoke the `voice-check` skill on `docs/governance/version-history-audit.md`.
Expected: no BLOCKING findings (resolve any em-dash or forbidden-register hits inline).

- [ ] **Step 5: Commit**

```bash
git -C <alawein/alawein> add -- docs/governance/version-history-audit.md
git -C <alawein/alawein> commit -F - <<'MSG'
docs(governance): add version-history audit protocol

Pillar 2 of the release-versioning framework. Defines the read-only
inventory, additive reconcile (rosetta, never history rewrite), and
baseline-and-enforce phases for converging a repo onto coherent SemVer.
MSG
```

Expected: pre-commit Docs Doctrine passes; one file changed.

---

### Task 2: Create `release-roadmap-and-outcomes.md` (Pillar 3)

**Files:**
- Create: `docs/governance/release-roadmap-and-outcomes.md`

- [ ] **Step 1: Pre-flight** — `git -C <alawein/alawein> status --short --branch`.

- [ ] **Step 2: Write the doc**

Frontmatter:

```markdown
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
```

Body sections (content per spec section 5):

1. `# Release Roadmap and Outcomes` + the core principle verbatim: **SemVer answers "did the contract change?"; it cannot answer "did we achieve something that matters?"** Those axes are orthogonal; the bridge maps between them and never redefines SemVer. Note the single sanctioned coupling is `1.0.0` graduation (cross-link convention section 5.2), and that strategy never forces a post-`1.0` MAJOR.
2. `## Level 1: Outcome` — the `{ id, statement, observable definition-of-done, strategic driver, target lifecycle-tier transition }` shape, per spec 5.1.
3. `## Level 2: Release` — the bridge rules per spec 5.2, including: target version = the version at which the outcome is first declared shipped; the **many-to-many** outcome-to-release relationship; the required `Outcome:`/`Maintenance:` field; `Maintenance:` is not an escape hatch. Inline the CHANGELOG head format:

```markdown
## [0.2.0] - 2026-06-07
Outcome: M2 + M4 (verified self-healing loop; heal signs into the attestation chain)

### Added
- ...
```

4. `## Level 3: Roadmap` — per spec 5.3, including `pivot`-type entries. Inline the roadmap table format:

```markdown
| Outcome | Statement | DoD (observable) | Driver | Target version | Tier effect | Status |
|---------|-----------|------------------|--------|----------------|-------------|--------|
| M1 | heal-wiring gate opens | heal -> attest loop verifiable e2e | trust-spine wedge | v0.1.0 | planned -> active | shipped 2026-06-07 |
```

5. `## Enforcement` — the two-tier check from spec section 7: presence floor (CHANGELOG head carries `Outcome:` or `Maintenance:`) plus the cross-doc check (every id named exists in the roadmap; if the roadmap marks it shipped, the shipped version equals the CHANGELOG head version). Name the script that implements it (`check-changelog-outcome`, built in Phase 2 Task 11).
6. `## Governance binding` — per spec 5.5 (tier transitions; negative outcome as a `pivot` that may trigger `repo-framework.md` archive criteria).
7. `## Related` — link `commit-release-convention.md`, `project-lifecycle-tiers.md` (in `docs/operations/`), `repo-framework.md`, `version-history-audit.md`.

- [ ] **Step 3: Validate** — run the four validators + `validate-doc-contract.sh --full`. Expected: PASS.

- [ ] **Step 4: Voice-check** — `voice-check` skill on the new doc. Expected: no BLOCKING findings.

- [ ] **Step 5: Commit**

```bash
git -C <alawein/alawein> add -- docs/governance/release-roadmap-and-outcomes.md
git -C <alawein/alawein> commit -F - <<'MSG'
docs(governance): add release roadmap and outcomes bridge

Pillar 3 of the release-versioning framework. Defines the three-level
outcome-to-version bridge (outcome, release, roadmap), the required
Outcome/Maintenance CHANGELOG field, the many-to-many mapping, pivot
entries, and the presence-plus-cross-doc enforcement.
MSG
```

---

### Task 3: Amend `commit-release-convention.md` section 5 (Pillar 1)

**Files:**
- Modify: `docs/governance/commit-release-convention.md` (section 5 body; frontmatter `last_updated`)

- [ ] **Step 1: Pre-flight** — `git -C <alawein/alawein> status --short --branch`.

- [ ] **Step 2: Bump frontmatter**

Set `last_updated: 2026-06-09` in the doc's frontmatter (required by doc-contract R for any modified `.md`).

- [ ] **Step 3: Insert the five subsections into section 5**

After the existing "Bump rule" paragraph and before "CHANGELOG entry flow", insert these subsections (wording is the deliverable; adapt only to match the convention's heading depth):

```markdown
### 5.1 Pre-release identifiers

Order pre-releases `X.Y.Z-alpha.N` < `X.Y.Z-beta.N` < `X.Y.Z-rc.N` < `X.Y.Z`.
Use `-rc.N` tags on `release/*` stabilization. A pre-release tag may carry a
provisional CHANGELOG entry; on final release those entries roll up into the
single dated `X.Y.Z` entry. A pre-release tag never sets a new stable baseline
for `version-coherence`.

### 5.2 0.x semantics and the 1.0.0 trigger

In `0.x` there is no MAJOR digit, so MINOR absorbs features and breaks:
`feat` and `BREAKING CHANGE` both bump MINOR (`0.Y.0`); `fix` and other
backward-compatible changes bump PATCH (`0.y.Z`). This keeps continuity with
the `1.x` mapping; the only `0.x` deviation is that a break lands as MINOR.
Graduating `0.x -> 1.0.0` is an outcome decision (first stable public contract,
first external consumer, or the declared launch outcome), the single sanctioned
coupling between versioning and outcomes (see `release-roadmap-and-outcomes.md`).
Past `1.0`, strategy never forces a MAJOR; only a contract break (5.4) does.

### 5.3 Monorepo versioning mode

A repo is either fixed (one version, tag, and CHANGELOG for the whole repo) or
independent (per-package, via changesets). Record the mode per repo in
`catalog/repos.json` alongside `commit_mode` (for example `release_mode: fixed`);
absent means fixed.

### 5.4 Contract-surface definition

"Breaking" is meaningful only against a declared, closed-world surface list,
published where consumers see it (repo README or `CONTRACT.md`): anything not
listed carries no stability promise. Review the list whenever a new external
consumer appears. A `BREAKING CHANGE` footer is warranted only when a declared
surface breaks.

### 5.5 Independent contract versions

An artifact may carry its own SemVer line (for example an attestation or wire
schema). Independence is asymmetric: a backward-compatible schema bump is
independent of the product version, but a breaking schema change is, by 5.4, a
break of a declared surface and therefore also moves the product version. Keep a
per-repo registry of these contracts and their current versions.
```

- [ ] **Step 4: Add cross-links**

In section 8 ("Superseded docs and related references"), add to the Related list:
`version-history-audit.md` (history convergence) and `release-roadmap-and-outcomes.md` (outcome-to-version bridge).

- [ ] **Step 5: Validate** — run the four validators + `validate-doc-contract.sh --full`. Expected: PASS. Confirm the `version-coherence` references still read coherently with the new 5.1 pre-release rule.

- [ ] **Step 6: Voice-check** — `voice-check` skill on the modified doc. Expected: no BLOCKING findings.

- [ ] **Step 7: Commit**

```bash
git -C <alawein/alawein> add -- docs/governance/commit-release-convention.md
git -C <alawein/alawein> commit -F - <<'MSG'
docs(governance): extend convention section 5 with versioning edges

Pillar 1 of the release-versioning framework. Adds pre-release ordering,
explicit 0.x semantics and the 1.0.0 trigger, monorepo mode, the
contract-surface definition, and independent contract versions; links the
two new companion docs.
MSG
```

---

### Task 4: Register the new docs in `governance-index.md`

**Files:**
- Modify: `docs/governance/governance-index.md`

- [ ] **Step 1: Pre-flight** — `git -C <alawein/alawein> status --short --branch`.

- [ ] **Step 2: Read the index to match its existing row format**

Run: open `docs/governance/governance-index.md` and note how existing entries are listed (table or list, ordering).

- [ ] **Step 3: Add two entries** matching that format, one per new doc, with their one-line descriptions from their frontmatter. Bump `last_updated: 2026-06-09` if the index carries it.

- [ ] **Step 4: Validate** — run the four validators + `validate-doc-contract.sh --full`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git -C <alawein/alawein> add -- docs/governance/governance-index.md
git -C <alawein/alawein> commit -F - <<'MSG'
docs(governance): register version-audit and release-roadmap docs

Index the two new Pillar 2 and Pillar 3 companion docs in the governance
suite navigation.
MSG
```

---

### Task 5: Phase 1 full-suite verification and PR

- [ ] **Step 1: Run the full doctrine suite** (the sequential gates, cleared in one pass)

Invoke the `/voice-resweep` skill, or run from `alawein/alawein`:

```bash
python scripts/doctrine/build-style-rules.py --check
python scripts/doctrine/validate.py --ci
python scripts/doctrine/validate-doctrine.py .
bash ./scripts/doctrine/validate-doc-contract.sh --full
python scripts/doctrine/style-advisory-audit.py --repo-root .
python scripts/ops/sync-readme.py --check
python scripts/catalog/build-catalog.py --check
```

Expected: all PASS. Fix any finding inline and amend the relevant task's commit.

- [ ] **Step 2: Open the PR (gated on user approval to push)**

Per the convention, governance changes are PR-first into `main`, squash merge. Confirm with the maintainer before pushing, then:

```bash
git -C <alawein/alawein> push -u origin feat/docs-release-versioning-framework
gh -C <alawein/alawein> pr create --base main --fill
```

PR body: summarize the three pillars, link the spec, note Phase 2 (Kohyr pilot) follows in the Kohyr repo. Do not self-merge until checks are green.

**Phase 1 exit criteria:** spec acceptance bullets 1-3 met (convention section 5 carries the five additions; both companion docs exist and define their protocols with copyable formats); full doctrine suite green; PR open.

---

## Phase 2: Kohyr pilot (canonical Kohyr checkout)

Phase 2 begins only after Phase 1's docs exist (it instantiates them). It runs in the Kohyr repo, on its own branch and PR. **Task 6 is read-only and must complete before any Phase 2 write**, because it resolves which checkout is canonical and produces the inventory that Tasks 7-9 consume.

### Task 6: Read-only version audit (Phase A) and checkout resolution

**Files:**
- Create: `<kohyr-canonical>/docs/version-audit-report.md` (the inventory; written only after the canonical checkout is confirmed)

- [ ] **Step 1: Resolve the canonical checkout**

Run:

```bash
ls -la "C:/Users/mesha/Desktop/Dropbox/GitHub/kohyr"
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/kohyr/kohyr" rev-parse --is-inside-work-tree
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/kohyr/kohyr-internal-wip" rev-parse --is-inside-work-tree
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/kohyr/kohyr" remote -v
git -C "C:/Users/mesha/Desktop/Dropbox/GitHub/kohyr/kohyr-internal-wip" remote -v
```

Decision rule: the canonical checkout is the working tree whose `origin` remote is the renamed canonical repo (`kohyr-app/kohyr` per workspace memory) and whose HEAD has recent commits. `kohyr/kohyr` read as empty/husk during design (git returned 128); if that persists, the canonical tree is `kohyr-internal-wip` until the rename is physically reconciled, and that reconciliation is a prerequisite logged as a blocker. Record the chosen path as `<kohyr-canonical>` for all later tasks.

- [ ] **Step 2: Inventory every version anchor (read-only)**

From `<kohyr-canonical>`, locate and record the value at each anchor: `git tag --sort=-v:refname`; `CHANGELOG.md`; every `package.json`, `pyproject.toml`, `__init__.py`, `VERSION`; and any version-encoded doc names. Note the polyglot layout (TS packages `@kohyr/shared`, `apps/web`; Python `src/kohyr`).

- [ ] **Step 3: Build the coherence matrix and classify history**

Produce `docs/version-audit-report.md` containing: the anchor-by-claimed-version matrix with disagreements flagged; whether existing tags are valid SemVer; which milestone identifiers (M1-M6) lack SemVer tags; and gaps (CHANGELOG entries without tags or vice versa). This report is the input to Tasks 7-9.

- [ ] **Step 4: Commit the report (read-only audit output)**

On a new branch in the Kohyr repo:

```bash
git -C <kohyr-canonical> switch -c feat/release-versioning-pilot
git -C <kohyr-canonical> add -- docs/version-audit-report.md
git -C <kohyr-canonical> commit -F - <<'MSG'
docs: add version-history audit report (phase A inventory)

Read-only inventory of version anchors and history per the workspace
version-history-audit protocol. Input to the reconcile and baseline steps.
MSG
```

Expected: no source files modified; only the report added.

**Gate:** if Step 1 cannot identify a single canonical checkout with a valid working tree, STOP and surface the blocker (checkout reconciliation) to the maintainer before continuing.

---

### Task 7: Write the rosetta `VERSION-HISTORY.md` (Phase B)

**Files:**
- Create: `<kohyr-canonical>/docs/VERSION-HISTORY.md`

- [ ] **Step 1: Build the rosetta from the audit report + known milestones**

Map each milestone and legacy identifier to a reconstructed SemVer using the format from `version-history-audit.md`. Seed rows from workspace memory, correcting dates/SHAs against the audit report:

```markdown
# Version History (reconstructed)

This is a write-once historical record, not a forward anchor. From the baseline
tag onward, the git tag and CHANGELOG are the only canonical version truth.

| Legacy identifier | Reconstructed SemVer | Date       | Anchor commit | Notes |
|-------------------|----------------------|------------|---------------|-------|
| M1 (gate opened)  | v0.1.0               | 2026-06-07 | <from report> | First verified heal-to-attest loop |
| M2 + M4 merged    | v0.2.0               | 2026-06-07 | 772bfff       | Verified self-healing loop shipped (origin/main) |
```

Do not push reconstructed tags. The rosetta is the record.

- [ ] **Step 2: Commit**

```bash
git -C <kohyr-canonical> add -- docs/VERSION-HISTORY.md
git -C <kohyr-canonical> commit -F - <<'MSG'
docs: add reconstructed version-history rosetta (phase B)

Additive re-index of milestone identifiers to SemVer. No history rewrite.
MSG
```

---

### Task 8: Instantiate `release-roadmap.md` for Kohyr (Pillar 3)

**Files:**
- Create: `<kohyr-canonical>/docs/release-roadmap.md`

- [ ] **Step 1: Write the roadmap**

Use the table format from `release-roadmap-and-outcomes.md`. Populate M1-M6 with target versions and live status from the audit report and memory (M1 shipped; M2 + M4 shipped at `772bfff`; M5 Rekor and M6 in-toto planned). Each row carries an observable DoD and the driver. Include at least one example showing the tier effect (`planned -> active`).

- [ ] **Step 2: Commit**

```bash
git -C <kohyr-canonical> add -- docs/release-roadmap.md
git -C <kohyr-canonical> commit -F - <<'MSG'
docs: add release roadmap mapping M1-M6 to target versions

Pillar 3 instance: the outcome-to-version roadmap for Kohyr.
MSG
```

---

### Task 9: Reconcile version anchors and CHANGELOG head (Phase C)

**Files:**
- Modify: every anchor flagged disagreeing in the Task 6 report (exact paths come from that report)
- Modify/Create: `<kohyr-canonical>/CHANGELOG.md`

- [ ] **Step 1: Choose the baseline version**

From the audit report, set the canonical current version (memory suggests `v0.2.0`; the report confirms). Record the rationale in the rosetta if it is a reset.

- [ ] **Step 2: Correct each derived anchor**

For each anchor in the report's coherence matrix, set its version to the baseline so all anchors agree (the git tag and CHANGELOG head remain canonical; manifests derive).

- [ ] **Step 3: Write the CHANGELOG head with the required field**

Ensure `CHANGELOG.md` has an `Unreleased` section and a dated baseline entry carrying an `Outcome:` line, for example:

```markdown
## [0.2.0] - 2026-06-07
Outcome: M2 + M4 (verified self-healing loop; heal signs into the attestation chain)

### Added
- ...
```

- [ ] **Step 4: Commit**

```bash
git -C <kohyr-canonical> add -- CHANGELOG.md <each corrected anchor path>
git -C <kohyr-canonical> commit -F - <<'MSG'
chore(release): reconcile version anchors to v0.2.0 baseline

Phase C: align tag-derived manifests with the canonical CHANGELOG head and
add the required Outcome line. Baseline number per the audit report.
MSG
```

---

### Task 10: Version-coherence CI check (locate or create)

**Files:**
- Investigate: `alawein/alawein` reusable workflows and `<kohyr-canonical>/.github/workflows/`
- Create or modify: the coherence check script and its workflow wiring

- [ ] **Step 1: Locate any existing `version-coherence` check**

Run (from `alawein/alawein`): `grep -ri "version-coherence" .github scripts` and inspect `<kohyr-canonical>/.github/workflows/`. The convention (sections 5, 7) treats this as a reusable-CI check that may already exist in warn-only form.

- [ ] **Step 2a (if it exists): extend it**

Add awareness of (1) pre-release tags (`-rc.N` etc. do not set the stable baseline, per convention 5.1) and (2) the declared `release_mode` from `catalog/repos.json` (fixed vs independent). Add a unit test for each new branch of logic.

- [ ] **Step 2b (if it does not exist): create a minimal check**

Create `<kohyr-canonical>/scripts/check_version_coherence.py` that asserts the latest non-pre-release git tag, the top dated `CHANGELOG.md` version, and each manifest version agree. TDD it:

```python
# tests/test_check_version_coherence.py
from scripts.check_version_coherence import coherent

def test_agreeing_anchors_pass():
    assert coherent(tag="0.2.0", changelog="0.2.0", manifests={"package.json": "0.2.0"}) == []

def test_disagreement_reports_each():
    problems = coherent(tag="0.2.0", changelog="0.2.0", manifests={"pyproject.toml": "0.1.0"})
    assert any("pyproject.toml" in p for p in problems)

def test_prerelease_tag_is_ignored_for_baseline():
    assert coherent(tag="0.3.0-rc.1", changelog="0.2.0", manifests={"package.json": "0.2.0"}) == []
```

Run: `pytest tests/test_check_version_coherence.py -v` (expect FAIL: module missing), then implement `coherent(...)` returning a list of disagreement strings (empty == coherent, pre-release tag skipped), then rerun (expect PASS).

- [ ] **Step 3: Wire into CI** as warn-only first (per convention section 7), in a `version-coherence` job. Note in the job comment that it flips to blocking once green across the converged anchors.

- [ ] **Step 4: Commit**

```bash
git -C <kohyr-canonical> add -- scripts/check_version_coherence.py tests/test_check_version_coherence.py .github/workflows/<file>
git -C <kohyr-canonical> commit -F - <<'MSG'
ci: add version-coherence check (warn-only)

Asserts tag, CHANGELOG head, and manifests agree; ignores pre-release tags
for the baseline. Flips to blocking once anchors converge.
MSG
```

---

### Task 11: Pillar 3 CHANGELOG-outcome CI check (presence + cross-doc)

**Files:**
- Create: `<kohyr-canonical>/scripts/check_changelog_outcome.py`
- Create: `<kohyr-canonical>/tests/test_check_changelog_outcome.py`
- Modify: a CI workflow to run it

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_check_changelog_outcome.py
from scripts.check_changelog_outcome import check

ROADMAP = """
| Outcome | ... | Target version | Tier effect | Status |
|---|---|---|---|---|
| M2 | ... | v0.2.0 | planned -> active | shipped 2026-06-07 |
| M5 | ... | v0.3.0 | active | planned |
"""

def test_presence_floor_missing_line_fails():
    changelog = "## [0.2.0] - 2026-06-07\n\n### Added\n- x\n"
    assert check(changelog, ROADMAP)  # non-empty problem list

def test_outcome_line_passes_presence():
    changelog = "## [0.2.0] - 2026-06-07\nOutcome: M2\n\n### Added\n- x\n"
    assert check(changelog, ROADMAP) == []

def test_maintenance_line_passes():
    changelog = "## [0.2.1] - 2026-06-08\nMaintenance: dependency bumps\n\n### Fixed\n- y\n"
    assert check(changelog, ROADMAP) == []

def test_unknown_outcome_id_fails():
    changelog = "## [0.2.0] - 2026-06-07\nOutcome: M9\n\n### Added\n- x\n"
    assert any("M9" in p for p in check(changelog, ROADMAP))

def test_shipped_version_must_match_changelog_version():
    # roadmap says M2 shipped at v0.2.0; a v0.3.0 entry claiming M2 disagrees
    changelog = "## [0.3.0] - 2026-06-08\nOutcome: M2\n\n### Added\n- x\n"
    assert any("0.2.0" in p and "0.3.0" in p for p in check(changelog, ROADMAP))
```

- [ ] **Step 2: Run the tests, expect FAIL**

Run: `pytest tests/test_check_changelog_outcome.py -v`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement the check**

```python
# scripts/check_changelog_outcome.py
"""Pillar 3 enforcement: the top CHANGELOG entry must carry an Outcome: or
Maintenance: line; named outcomes must exist in the roadmap, and a roadmap
'shipped at vX' must agree with the CHANGELOG entry version."""
import re
from typing import Dict, List

_VERSION_HEAD = re.compile(r"^##\s*\[(?P<ver>[0-9][^\]]*)\]\s*-\s*\d{4}-\d{2}-\d{2}", re.M)
_FIELD = re.compile(r"^(?P<kind>Outcome|Maintenance):\s*(?P<rest>.*)$", re.M)
_OUTCOME_ID = re.compile(r"\bM\d+\b")
_ROADMAP_ROW = re.compile(r"^\|\s*(?P<id>M\d+)\s*\|.*\|\s*v(?P<ver>[0-9][^\s|]*)\s*\|[^|]*\|\s*(?P<status>[^|]*)\|", re.M)


def _roadmap_index(roadmap: str) -> Dict[str, Dict[str, str]]:
    out = {}
    for m in _ROADMAP_ROW.finditer(roadmap):
        out[m.group("id")] = {"ver": m.group("ver").strip(), "status": m.group("status").strip().lower()}
    return out


def check(changelog: str, roadmap: str) -> List[str]:
    problems: List[str] = []
    head = _VERSION_HEAD.search(changelog)
    if not head:
        return ["no dated version entry found at the CHANGELOG head"]
    head_ver = head.group("ver").strip()
    # The field must appear in the entry body, before the next version head.
    nxt = _VERSION_HEAD.search(changelog, head.end())
    body = changelog[head.end():(nxt.start() if nxt else len(changelog))]
    field = _FIELD.search(body)
    if not field:
        return [f"version {head_ver} entry is missing an Outcome: or Maintenance: line"]
    if field.group("kind") == "Maintenance":
        return []
    ids = _OUTCOME_ID.findall(field.group("rest"))
    if not ids:
        return [f"Outcome line for {head_ver} names no outcome id"]
    rmap = _roadmap_index(roadmap)
    for oid in ids:
        if oid not in rmap:
            problems.append(f"Outcome {oid} (v{head_ver}) is not in the roadmap")
            continue
        row = rmap[oid]
        if "shipped" in row["status"] and row["ver"] != head_ver:
            problems.append(
                f"roadmap marks {oid} shipped at v{row['ver']} but CHANGELOG claims it at v{head_ver}"
            )
    return problems
```

- [ ] **Step 4: Run the tests, expect PASS**

Run: `pytest tests/test_check_changelog_outcome.py -v`
Expected: all PASS.

- [ ] **Step 5: Wire into CI** in a `changelog-outcome` job that reads `CHANGELOG.md` and `docs/release-roadmap.md` and fails on a non-empty problem list (presence floor blocking immediately; the cross-doc rule blocking once the roadmap is populated).

- [ ] **Step 6: Commit**

```bash
git -C <kohyr-canonical> add -- scripts/check_changelog_outcome.py tests/test_check_changelog_outcome.py .github/workflows/<file>
git -C <kohyr-canonical> commit -F - <<'MSG'
ci: enforce Outcome/Maintenance CHANGELOG field with cross-doc check

Pillar 3 enforcement: presence floor plus validation that named outcomes
exist in the roadmap and shipped versions agree.
MSG
```

---

### Task 12: Cut the baseline tag, verify, and open the Kohyr PR

- [ ] **Step 1: Run both checks locally against the converged repo**

```bash
pytest <kohyr-canonical>/tests/test_check_version_coherence.py <kohyr-canonical>/tests/test_check_changelog_outcome.py -v
python <kohyr-canonical>/scripts/check_version_coherence.py
python <kohyr-canonical>/scripts/check_changelog_outcome.py
```

Expected: tests PASS; both checks report no problems against the v0.2.0 baseline.

- [ ] **Step 2: Cut the baseline tag (gated on maintainer approval)**

```bash
git -C <kohyr-canonical> tag -a v0.2.0 -m "Baseline: verified self-healing loop (M2 + M4)"
```

Do not push the tag until the PR merges and the maintainer approves the release step. The reconstructed historical tags from the rosetta are NOT created here.

- [ ] **Step 3: Open the Kohyr PR (gated on approval to push)**

```bash
git -C <kohyr-canonical> push -u origin feat/release-versioning-pilot
gh -C <kohyr-canonical> pr create --base main --fill
```

PR body: link the spec and the two new governance docs; list the pilot outputs (audit report, rosetta, roadmap, coherent anchors, two CI checks, baseline tag pending).

**Phase 2 exit criteria:** spec acceptance bullet 4 met (Kohyr carries the rosetta, the roadmap mapping M1-M6, coherent anchors, a baseline tag, and a green `version-coherence` check), plus the Pillar 3 check green; canonical-checkout ambiguity resolved or blocker surfaced.

---

## Self-review (author checklist, completed)

**Spec coverage:** deliverable 1 -> Task 3; deliverable 2 -> Task 1; deliverable 3 -> Task 2; deliverable 4 -> Tasks 6-12; deliverable 5 -> Tasks 3 (cross-links) and 4 (index). Acceptance criteria 1-3 -> Phase 1 (Task 5 gate); criterion 4 -> Phase 2 (Task 12 gate); criterion 5 (doctrine) -> every doc task's validate step plus Task 5. No uncovered spec section.

**Hard-constraint coverage:** read-only Phase A before any write -> Task 6 (with a STOP gate); checkout ambiguity resolved first -> Task 6 Step 1; no history rewrite / no pushed reconstructed tags -> Task 7 Step 1 and Task 12 Step 2; blocking-tier doctrine on governance docs -> validate + voice-check steps in Tasks 1-4; both CI checks as implementation tasks -> Tasks 10 and 11.

**Placeholder scan:** the only deferred specifics are the Kohyr anchor paths and baseline number, which are genuine outputs of the Task 6 audit and are routed through `version-audit-report.md`, not hand-waved. The CI scripts are fully inlined with tests.

**Type/name consistency:** the Pillar 3 check is `check_changelog_outcome.check(changelog, roadmap)` in Task 11 and referenced as `check-changelog-outcome` in the Task 2 doc and Task 11 CI wiring; the coherence check is `check_version_coherence.coherent(...)` in Task 10. The roadmap table columns used by the regex in Task 11 match the format authored in Tasks 2 and 8.
