---
type: managed
status: approved
last_updated: 2026-07-07
owner: meshal
---

# Topology consolidation: single declared model with a validator

> Status note (2026-07-07): Wave 0 landed on 2026-06-29 (#144: topology
> validator, canon, and fleet README audit). Later waves remain open.

## Summary

The repo topology is not single-source. `catalog/repos.json` carries two grouping
fields (`bucket` and `type`) that use different, non-normalized vocabularies and disagree
for 24 of 37 repos, and the on-disk folder
layout is a third grouping that disagrees with both in several cases. A reader gets up to
three different answers to "where does this repo belong?". This spec adopts a single
declared two-axis model (ownership and functional role), fixes the data so all views
agree, and adds a validator that fails when they drift again. This is option B from the
review; the dependency-graph generation and CI wiring (option C) are deferred.

## Problem

Three groupings exist and none is reconciled with the others:

| Axis | Field / source | Values |
|---|---|---|
| Ownership / life-area | `bucket` in repos.json (also drives `local_path`) | products, personal, family, research, ventures, tools, jobs-projects |
| Functional role | `type` in repos.json (drives the architecture "Repo Topology" diagram) | governance, infra, product, research, tooling, archive |
| Actual location | on-disk folder | products, personal, family, research, ventures, tools, jobs-projects |

`attributa` is the clearest case: `bucket=tools`, `type=product`, on disk in `ventures/`.

### Verified findings (against repos.json, disk, and generate-arch-diagram.py)

1. `bucket` and `type` are two undocumented axes that disagree for 24/37 repos. They do
   not even share a vocabulary: `bucket` uses plural ownership labels (`products`,
   `tools`) while `type` uses singular role labels (`product`, `tooling`), so the two
   cannot be compared without a mapping. They are useful as separate axes (own vs role)
   but nothing declares that, so the disagreement is indistinguishable from rot.
2. `local_path` is wrong for two repos: `attributa` and `llmworks` record `tools/X` but
   live in `ventures/X`.
3. slug/folder drift: `handshake-hai` is in folder `handshake`; `mercor-llm-failsafe` is
   in folder `mercor`. Lookups by slug miss the folder.
4. `helios` records `local_path = research/helios` but actually lives in
   `_archive/2026-06-helios`. Its `type=archive` / `status=archived` are correct; the
   path and `bucket=research` were never updated for the archive move.
5. The real dependency graph is unused: `depends_on` is populated 36/37 and `provides`
   37/37, but the architecture doc's dependency edges are hand-drawn mermaid. (Addressed
   in option C, not here.)
6. Prose number drift in architecture.md: "17 workflows" (actual 16), "33 product repos
   via AGENTS.md" (4 product-bucket repos; wrong noun), "37+" against an exact 37.

## Decision

Adopt a **single declared two-axis model**, both axes intentional and documented:

- **`bucket` = ownership / life-area axis.** Where the repo lives on disk. `local_path`
  and the on-disk folder MUST agree with `bucket`. This is the layout axis.
- **`type` = functional role axis.** governance / infra / product / research / tooling /
  archive. Drives the architecture role diagram. Independent of `bucket` by design.

Allowed values are fixed sets (above). Disagreement between `bucket` and `type` is legal
and expected; disagreement between `bucket`, `local_path`, and disk is a bug the validator
must catch.

Archive handling: archived repos (`status=archived` and `type=archive`) live under
`_archive/` on disk. `bucket` retains the repo's pre-archive ownership for history; the
validator exempts archived repos from the bucket-matches-disk-folder check but still
requires `local_path` to point at a real path.

## Phase 0: truth-up (prerequisite)

Make every view agree, per repo. Rule: on-disk reality is authoritative for paths; each
`bucket`/`type` assignment is confirmed deliberately during execution.

| Repo | Issue | Recommended resolution (confirm on execute) |
|---|---|---|
| attributa | bucket=tools, disk=ventures | Set `bucket=ventures`, `local_path=ventures/attributa`. It is a product/venture, not platform tooling. `type=product` stays. |
| llmworks | bucket=tools, disk=ventures | Set `bucket=ventures`, `local_path=ventures/llmworks`. `type=product` stays. |
| helios | path stale, in _archive | Set `local_path=_archive/2026-06-helios`. Keep `bucket=research`, `type=archive`. |
| mercor-llm-failsafe | folder `mercor`, archived, not in _archive | Move folder to `_archive/`, set `local_path` to match; or, if not moving, set `local_path=jobs-projects/mercor` and accept slug != folder for archived repos. Pick one archive convention and apply it to helios and mercor consistently. |
| handshake-hai | folder `handshake` | Rename folder to `handshake-hai` (match slug), set `local_path=jobs-projects/handshake-hai`. |

Also fix the prose in `architecture.md`: workflow count (16), the "33 product repos"
label (correct the noun and number), and make the repo count consistent (exact 37 or a
deliberate "37+", not both).

## Phase 1: declare the model and add the validator

### Declare the model

Add a short legend to `architecture.md` above the Repo Topology diagram stating the two
axes: the diagram shows the **role** (`type`) axis; `bucket` is the **ownership** axis that
governs on-disk layout. One paragraph, no new diagram required. A second generated subgraph
grouped by `bucket` is optional and out of scope unless requested (YAGNI).

### Validator: `scripts/doctrine/validate-topology.py`

A standalone Python script (no new dependencies; stdlib + the existing repos.json read
pattern). It loads `catalog/repos.json`, walks disk, and fails non-zero with a per-repo
report on any violation. Checks:

1. `type` is in the allowed role set; `bucket` is in the allowed ownership set.
2. `local_path` points at an existing path (exemptions: the hub `alawein` itself).
3. slug equals the final path component of `local_path` (catches slug/folder drift).
4. For non-archived repos, the first path component of `local_path` equals `bucket`, and
   the repo physically exists under that folder on disk.
5. `status=archived` iff `type=archive` (the two archived markers stay in sync), and
   archived repos resolve under `_archive/`.

Out of scope for the checker: validating prose numbers in architecture.md (manual in
Phase 0; can be added later with option C).

### Data flow

```
catalog/repos.json ──┐
                     ├─> validate-topology.py ──> pass / per-repo failure report
on-disk folders ─────┘
```

The validator is read-only and reports; it does not edit. It is the gate that keeps
Phase 0's truth-up from silently regressing.

## Components

| Unit | Purpose | Depends on | Testable by |
|---|---|---|---|
| repos.json edits (Phase 0) | Correct bucket/local_path for the 5 drift cases | none | re-running the validator: zero failures |
| architecture.md edits | Fix numbers; declare two-axis legend | repos.json edits | manual read; grep for the corrected numbers |
| validate-topology.py | Detect bucket/type/local_path/disk drift | repos.json, disk layout | unit fixtures: a known-good set passes, each injected drift fails |

## Testing

- The validator ships with fixture-based tests: a synthetic good repo set passes; one
  injected fault per check (bad type, missing path, slug/folder mismatch, bucket/disk
  mismatch, archived-marker mismatch) each produces the expected failure.
- After Phase 0 edits, `python scripts/doctrine/validate-topology.py` against the real
  workspace exits 0.
- Run with `python -m pytest` for the validator's own tests (machine convention: use
  `python -m pytest`, not bare `pytest`).

## Risks and limitations

- The bucket reassignments (attributa, llmworks) and the archive convention (mercor) are
  judgment calls; they are marked confirm-on-execute, not silently applied.
- Moving on-disk folders (handshake rename, mercor to _archive) happens in a non-git
  Dropbox tree; the committable mirror is `C:/Users/mesha/alawein-hub`. Changes here must
  be carried to that clone to land in the repo.
- This spec does not generate the dependency diagram from `depends_on`/`provides`, nor
  wire the validator into CI. That is option C, a deliberate follow-up.
- The validator checks data/layout coherence, not whether a repo's `type` is the *right*
  role; role assignment stays a human decision.
