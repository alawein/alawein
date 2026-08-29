---
type: audit
status: draft
last_updated: 2026-08-29
owner: meshal
---

# Public portfolio report (2026-08-28)

Closes the private-by-default mission started 2026-08-27: the gate, the scan,
the demotions, the README redo wave, and the promotions. Evidence lives in
`docs/internal/audits/2026-08-27-public-visibility-matrix.md`,
`docs/internal/audits/2026-08-28-public-benchmark-patterns.md`, and
`docs/batches/public-credibility-1/manifest.yaml`.

## Executive summary

| Measure | Before (2026-08-27 morning) | After (2026-08-29) |
|---|---|---|
| Public repos | 12 | 9 |
| Public to private | 0 | 3 (llmworks, loopholelab, provegate) |
| Records at P0 | 0 | 6 (qmatsim, spincirc, maglogic, scicomp, chshlab, fallax) |
| Records at P1 | 0 | 2 (outpost under grace, qubeml) |
| Hub record | none | P2 under grace to 2026-09-30 (B6 and B7 open) |
| Catalog `profile_pins` | 6 (outpost, fallax, loopholelab, chshlab, qmatsim, llmworks) | 4 (outpost, fallax, chshlab, qmatsim) |
| Live pins | 5 | 3 (fallax, chshlab, qmatsim) |
| Gate (`validate-visibility.py --github-api`) | no gate | 0 errors, 2 grace warnings |

## Visibility by slug

| Tier | Slugs |
|---|---|
| P0, public | chshlab, fallax, maglogic, qmatsim, scicomp, spincirc |
| P1, public | qubeml; outpost (grace to 2026-09-30, pinned) |
| P2, public under grace | alawein (hub; cannot be private; secrets in history and CI red) |
| P2, private | adil, alembiq, attributa, atelier-rounaq, auditraise, bolts, design-system, gymboy, handshake, incore, knowledge-base, llmworks, loopholelab, meatheadphysicist, mercor, meshal-web, optiqap, prompty, provegate, quantumalgo, repz, roka-oakland-hustle, scribd, simcore, turing, veyra, workspace-control, workspace-tools |
| P3, private | edfp, qmlab |
| exempt | helios (archived) |

## What shipped

- Gate: `promotion` records in `catalog/index.yaml`, offline rules in
  `validate-catalog.py`, `scripts/github/validate-visibility.py` (V1 to V8)
  in Docs Doctrine (offline mode until the metadata token is replaced),
  templates with the framework header, governance docs rewritten private by
  default (PR #185, merged 2026-08-28).
- Scan v1 of all 40 slugs; three public repos failed a blocker and went
  private with approval on 2026-08-28.
- README redo wave 1: six PRs, each reviewed against the P0 checklist with
  the reproduction commands run and recorded (qmatsim #42, spincirc #101,
  maglogic #94, scicomp #101, chshlab #73, fallax #65; merged 2026-08-29).
  Two side fixes landed in the wave: a wrong compose path in maglogic and a
  requirements pin in spincirc that named a package not on PyPI.

## Benchmark patterns applied

From `2026-08-28-public-benchmark-patterns.md`: header first; one paragraph
with what, for whom, and how it differs; one boundary sentence; status as
key-value with a verification date; reproduction command on the first
screen and actually run; tree of `origin/main`; bare docs-map bullets; no
badge walls; no planning voice. Items most often failed before the wave:
P0-01 (every header said `Category: research` against bucket `lab`, three
said `Visibility: private` on public repos), P0-05 (no command had been run
for the README), P0-07 (chshlab.online and fallax.online unmentioned),
P0-10 (planning voice in five of six).

## Still blocked, owner action

| Item | Owner action |
|---|---|
| alawein B6: 224 gitleaks hits in public history and 2 open secret-scanning alerts (Supabase); B7: `CI - Documentation Contract` red since 2026-08-17 | Rotate the two credentials; decide on history rewrite; fix the contract job. Grace ends 2026-09-30, then the gate errors. |
| llmworks: one anon-scope key in history | Rotate. Repo is private; re-promotion needs a fresh scan. |
| loopholelab: README claims routes the live site does not serve | Deploy the app or drop the claims; then re-scan. |
| provegate: `test` workflow red on main since 2026-08-15 | Fix Lint; then re-scan. |
| `ALAWEIN_METADATA_SYNC_TOKEN` returns 401 | Issue a fine-grained PAT with metadata read; switch the gate step back to `--github-api`; metadata sync also depends on it. |
| outpost: pinned in the catalog, not live | Pin it in the profile UI, or drop it from `profile_pins`. Grace ends 2026-09-30. |
| fallax GitHub `homepage` field still points at the legacy Vercel URL | Metadata sync fixes it once the token works. |
| `drift.yml` red fleet-wide (missing token) | Replace the token or retire the workflow. |
| Scans age out 2026-11-25 | Re-scan every public repo and bump `scanned`. |

## Pin proposal

Up to six from P0: qmatsim, spincirc, maglogic, scicomp, fallax, chshlab.
Taking all six means `outpost` leaves `profile_pins`. Pins are edited in the
GitHub UI, then `python scripts/github/verify-profile-pins.py --check`.

## Recommended next wave

1. Secrets and tokens above (unblocks live CI gating and metadata sync).
2. README pass for qubeml and outpost (P1 to P0 candidates), then a
   `sites` decision for meshal-web (zero criticals in the April audit).
3. The three demoted repos: fix the named blocker, re-scan, re-promote.
4. Retire or fix the `ROOT.parent` assumption so `sync-github.sh --check
   --all` and `github-baseline-audit.py` run locally again (DEBT).
