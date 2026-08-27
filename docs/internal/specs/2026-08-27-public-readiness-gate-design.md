---
type: managed
status: draft
last_updated: 2026-08-27
owner: meshal
---

# Public readiness gate: private by default, promotion by scan (2026-08-27)

## Summary

Every repo in the fleet is private unless it holds a current, passing public
scan recorded in the catalog. A new read-only validator enforces the machine
checks against live GitHub; the manual checks (credibility, secrets, CI,
license) are a written rubric whose pass is recorded as a scan date. Profile
pins draw only from the top tier. Visibility flips and pin edits stay manual,
one approved table at a time.

## Findings that drive the design (verified 2026-08-27)

- GitHub: 56 repos, 12 public, 44 private, 13 archived, 1 empty (`outpost`,
  public). Catalog and GitHub agree on all 12 public slugs.
- Live pins: `fallax, loopholelab, chshlab, qmatsim, llmworks` (5). Catalog
  expects 6 with `outpost` first. `outpost` has no README on `main`.
- No gate exists. No script compares catalog visibility to GitHub, requires a
  pinned repo to be public, or flags empty public repos. Nothing can flip
  visibility (`sync-github-metadata.py` writes description, homepage, topics).
- Fleet validators are already clean on the public set: `validate-readme-voice.py
  --github-api` passes all 40; `validate-readme-topology.py --github-api` fails
  only `attributa` and `veyra`, both private. Both validators skip empty repos
  silently.
- `llmworks` README on `main` now states it does not call provider SDKs or
  score benchmarks. The April 2026 credibility flag is closed on that surface.
- `README.governance.md` and `README.archive.md` named in
  `docs/governance/repo-topology-canon.md` were never created. The three
  existing templates lack the mandatory framework header.
- `docs/governance/repo-framework.md` visibility table still keys on the old
  eight buckets. Canon section A still lists seven.
- `catalog/index.yaml` exists only on `feat/minimal-buckets-model-routing`
  (PR #184, CI green, review pending).

## Decisions taken in this brainstorm

| Decision | Choice | Why |
|---|---|---|
| Gate form | Validator plus rubric (approach A) | Doc-only drifts the next day; automated flips are unsafe (going private detaches forks and drops stars) |
| Cited research that fails the gate | One fix-in-place wave of grace, then flip | Paper links to `qmatsim`, `spincirc`, `maglogic`, `scicomp`, `qubeml` must not break on a lint finding |
| README redo scope this cycle | Pin candidates only (6) | P0 slots are scarce; the other public repos are already validator-clean |
| Visibility mutation | Manual `gh api` per approved table | Irreversible enough to want a human on every row |

## The gate

### Blockers (all must pass before `visibility: public`)

| # | Check | Enforced by |
|---|---|---|
| B1 | Catalog visibility equals live GitHub visibility | validator |
| B2 | Repo is not empty and has `README.md` on the default branch | validator |
| B3 | Tier-1 README topology clean (`validate-readme-topology.py`) | validator (existing) |
| B4 | README voice clean: no em dash, no banned register, no AI attribution (`validate-readme-voice.py`) | validator (existing) |
| B5 | Credibility: no claim a skeptical senior engineer can falsify from the code (fake AI, stub API, simulated scores, payment without fulfillment, dead deploy) | manual, recorded |
| B6 | Secrets: no secret in tree or history, no committed `.env`; gitleaks run noted | manual, recorded |
| B7 | CI green, or an honest Status section that says preview-only | manual, recorded |
| B8 | `LICENSE` present for public research or tooling | validator (local or API) |
| B9 | Pinned implies public and tier P0 | validator |

### Warnings (fix before pin, not required for public)

- More than 2 CI badges plus license.
- Missing `docs/architecture/topology.md` tree.
- Stale `last_verified` (over 90 days).
- Live GitHub description differs from `canonical_description` (fix by
  metadata sync).

### Tiers

| Tier | Meaning | Visibility | Pin |
|---|---|---|---|
| P0 | Blockers pass, README at benchmark quality, live deploy or documented reproduction path | public | eligible |
| P1 | Blockers pass | public | no |
| P2 | Maintained, private by policy (apps with open credibility flags, `work` bucket, internal tooling) | private | no |
| P3 | Dormant or unseeded; keep in catalog | private | no |

Archived repos (catalog `status: archived`) are exempt from flips and tiers.

### Grace rule

A repo with `CITATION.cff` or a `research_rows` entry in
`profile-from-guides.yaml` may stay public while failing B3, B4, or B8 until
`promotion.grace_until`, which is set once, to the end of the current fix
wave. After that date the validator fails it like any other repo.

### Promotion order (never reversed)

1. Scan recorded in the matrix, all blockers pass.
2. README redo and fixes merged to `main` in the sibling repo.
3. `validate-readme-topology.py --github-api` and `validate-readme-voice.py
   --github-api` clean.
4. `catalog/index.yaml`: set `visibility: public` and `promotion`.
5. `python scripts/catalog/build-catalog.py` and `sync-readme.py`.
6. User-approved `gh api -X PATCH repos/alawein/<slug> -f visibility=public`.
7. Only then add to `profile_pins` (max 6). Pins are edited in the GitHub UI,
   then `verify-profile-pins.py --check`.

Demotion runs the reverse: drop the pin, set catalog private, then flip GitHub.

## Data model: `promotion` in `catalog/index.yaml`

```yaml
- slug: qmatsim
  visibility: public
  url: https://github.com/alawein/qmatsim
  promotion:
    tier: P0
    scanned: '2026-08-27'
    grace_until: '2026-09-30'   # optional, cited research only
    notes: CITATION.cff, Phys. Rev. Materials 2025   # optional
```

Rules:

- `promotion` is optional. Absent means no scan: the repo must be private.
- `tier` is one of `P0 | P1 | P2 | P3`. `scanned` is an ISO date.
- `visibility: public` requires `tier` in `{P0, P1}` and `scanned` within 90
  days, or a `grace_until` in the future.
- `compile_index.py` passes `promotion` through to `repos.json` unchanged;
  `slim_entry` keeps it when present. `projects.schema.json` gains the object
  in all three repo shapes (`additionalProperties: false` is in force).
- `validate-catalog.py` gains the offline half of the rules (enum, date
  format, public-without-scan, pinned-without-P0) so `build-catalog.py --check`
  fails locally before CI.

## Validator: `scripts/github/validate-visibility.py`

Read-only. Inputs: `catalog/repos.json`, `profile-from-guides.yaml`, and live
GitHub through the REST API with `GITHUB_TOKEN` (same pattern as
`validate-readme-topology.py`).

| Check | Fails when |
|---|---|
| V1 | catalog `visibility` differs from live `visibility` |
| V2 | catalog public and live `size == 0` |
| V3 | catalog public and `GET /repos/{r}/readme` is 404 |
| V4 | catalog public without a valid `promotion` (tier, freshness, or grace) |
| V5 | slug in `profile_pins` and not (public and P0) |
| V6 | catalog public, type research or tooling, no `LICENSE` at default branch |
| V7 | live pinned list contains a slug that is private, archived, or empty |
| V8 | archived on GitHub but catalog `status` is not `archived` (warning) |

Flags: `--github-api` (default), `--offline` (V4, V5 only), `--slug SLUG`,
`--json`. Exit 0 clean, 1 findings, 2 usage or API error. Findings print one
line per repo per check, all at once, so a fix-and-push loop clears everything
in one pass.

Wiring: a step in `.github/workflows/docs-doctrine.yml` after the voice check;
a line in the CLAUDE.md validation list and in the `/voice-resweep` skill.

Tests: `scripts/tests/test_validate_visibility.py` with fixture JSON for a
fake API (public-and-empty, pinned-and-private, stale scan, grace in future,
grace expired, archived mismatch). Target: every V-check has a failing and a
passing case.

## Templates and canon fixes (control plane)

- Add the framework header block (`Status / Category / Owner / Visibility /
  Purpose / Next action`) to `README.product.md`, `README.research.md`,
  `README.tooling.md`; add `Docs map` to the tooling template so it matches the
  canon order.
- Create `templates/scaffolding/README.governance.md` (Purpose, Catalog SSOT,
  Validators, Docs map) and `README.archive.md` (Status, Archive reason,
  Contents, Access rules, Docs map).
- Rewrite the visibility table in `docs/governance/repo-framework.md` for the
  six buckets: every bucket defaults to private; public requires a P0 or P1
  scan; `sites` is the only bucket expected to hold public repos by intent.
- Update `repo-topology-canon.md` section A to the six buckets and point the
  Visibility header rule at the gate.
- Add the gate to `SSOT.md` active decisions and bump `last-verified`.
- Record deferred items in `docs/DEBT.md`.

## Audits (control plane)

- `docs/internal/audits/2026-08-27-public-visibility-matrix.md`: one row per
  slug: slug, catalog visibility, live visibility, pinned, type, bucket, lane,
  README on main, empty, B1 to B9 result, tier, action.
- `docs/internal/audits/2026-08-27-public-benchmark-patterns.md`: patterns
  from `meshal-web`, `gymboy`, `design-system`, `spincirc`, `workspace-tools`,
  plus two external minimal repos named in the doc. Records first six lines,
  section order, badge count, how status and non-goals are stated,
  architecture tree depth, and what they omit.
- `docs/batches/public-credibility-1/manifest.yaml`: the six pin-candidate
  repos with tasks `[voice-resweep, topology-redo, public-scan]`,
  `default_visibility: private`, `promote_only_if: public_scan_pass`.

Preliminary tiers from today's evidence (proposed; the matrix confirms):

| Tier | Slugs |
|---|---|
| P0 candidates | `qmatsim`, `spincirc`, `maglogic`, `scicomp`, `fallax`, `chshlab` |
| P1 | `alawein` (hub, never pinned), `llmworks`, `loopholelab`, `provegate`, `qubeml` |
| P2 | all `apps`, `work`, private `core`, active private `lab`, both `sites` |
| P3 | `outpost` (empty on GitHub), `edfp`, `qmlab` |
| exempt | `helios` |

Expected private-first batch: `outpost` only. It is public, empty, and first
in `profile_pins`; it leaves the pin list and goes private until seeded.

## Sibling README redos (six repos)

One PR per repo, branch `docs/readme-redo-public`, from the fixed template
for its type. Each PR body carries: before and after intent (two sentences),
voice findings fixed (count), credibility findings fixed (list), validator
exit codes, and the promotion decision (`PRIVATE | PUBLIC-P1 | PUBLIC-P0-PIN`).
Sibling-repo artifacts state the change, why, and verification only.

## Sequencing

| Step | Where | Output |
|---|---|---|
| 0 | alawein | Merge PR #184; close #183 as folded in; branch `feat/public-readiness-gate` from `main` |
| 1 | alawein | Gate spec (this file), `promotion` field, `validate-visibility.py` and tests, CI step, template and canon fixes, SSOT and DEBT entries |
| 2 | alawein | Matrix, benchmark doc, batch manifest; private-first table for approval |
| 3 | user | Approve the table; `outpost` flip and pin removal |
| 4 | six sibling repos | README redos, merged, validators clean |
| 5 | alawein | `promotion` records set to P0, pin proposal (max 6), user edits pins in the UI, `verify-profile-pins.py --check` |
| 6 | alawein | `docs/internal/audits/2026-08-27-public-portfolio-sweep.md` final report |

Steps 1 and 2 can run in parallel. Step 4 fans out one worker per repo.

## Testing

- Control plane: the full CLAUDE.md validation list, `python -m pytest
  scripts/tests scripts/doctrine/tests -q`, plus the new validator tests.
- Per sibling repo: `validate-readme-topology.py --repo-path . --repo-slug
  <slug>`, `validate-readme-voice.py` likewise, `style-advisory-audit.py
  --repo-root .`, then the `--github-api` runs after merge.
- Gate proof: run `validate-visibility.py --github-api` before step 3 (must
  fail on `outpost`) and after (must pass).

## Risks and limits

- Going private detaches forks and drops stars; that is why flips are manual.
- `GITHUB_TOKEN` in CI must read private repos for V1; the docs-doctrine job
  already uses one for the topology check.
- B5 to B7 are judgment calls. The scan date is the audit trail; the matrix
  row names what was checked.
- The pin list edit is a UI action; the validator only catches drift after.

## Non-goals

- Fixing the open credibility flags in `apps` (bolts, repz, scribd,
  atelier-rounaq). They stay P2; that is a product-integrity workstream.
- Tier-2 exact-heading enforcement across the fleet.
- Automating visibility or pin mutations.

## Deferred (to DEBT.md)

- README redo for the six P1 public repos.
- `sites` bucket promotion (`meshal-web` had zero criticals in April).
- Fixing `compliance` drift (`provegate` public but `internal-only`; seven
  private repos marked `public-data`).
