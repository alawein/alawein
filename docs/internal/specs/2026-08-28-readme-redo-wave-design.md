---
type: managed
status: draft
last_updated: 2026-08-29
owner: meshal
---

# README redo wave for the pin candidates (2026-08-28)

## Summary

Six public repos (`qmatsim`, `spincirc`, `maglogic`, `scicomp`, `chshlab`,
`fallax`) get a content pass on their READMEs so they meet the P0 bar of the
public readiness gate: benchmark quality plus a verified reproduction path or
live surface. The structure stays; the header, claims, reproduction steps,
and live links get fixed. A benchmark study written first supplies the
checklist. One PR per repo, merged as CI goes green, then the catalog records
move to P0 and pins are proposed.

Covers sub-projects 2 and 3 of
`docs/internal/specs/2026-08-27-public-readiness-gate-design.md`.

## Findings that drive the design (verified 2026-08-27 and 2026-08-28)

- All six READMEs already follow the canon order for their type and carry
  zero badges, an ASCII tree, and links to `docs/architecture/topology.md`.
  The fleet topology and voice validators pass them. A template rewrite would
  change nothing a reader sees.
- Every header says `Category: research`; the catalog bucket is `lab`. The
  per-repo doctrine CI (`doctrine-reusable.yml`, framework check against
  `catalog/repos.json`) will fail each repo's next PR until this is fixed.
- `spincirc`, `chshlab`, `fallax` say `Visibility: private`; all six are
  public.
- `chshlab` (chshlab.online) and `fallax` (fallax.online) are live on Vercel
  and their READMEs do not say so.
- `maglogic` documents `docker compose up --build` from the repo root; the
  compose file is under `docker/`, so the command fails as written.
- `qmatsim` and `chshlab` have no `CITATION.cff`; `maglogic`, `scicomp`,
  `spincirc` do.
- Several sentences are planning voice, not facts ("Public polish should
  emphasize...", "Tie published figures to the demo scripts where possible").
- Every local clone holds the same uncommitted one-line `Category: lab` edit
  left by the bucket migration; `chshlab`'s clone is two commits behind
  `origin/main` with the old README shape; `qmatsim` and `fallax` clones sit on
  a `docs/architecture-topology` branch whose commits are already upstream.
- Sibling repos require Conventional Commits (`CONTRIBUTING.md`) and ship a
  six-section PR template. Their doctrine CI is pinned to hub SHA `6cddc4b4`,
  which already runs the framework, topology, and voice checks.
- `workspace-batch` exists in `workspace-tools` but is not installed on PATH;
  `fallax` is absent from its registry; `chshlab` is registered analysis-only
  with publishing disabled; no manifest schema exists.

## Decisions taken in this brainstorm

| Decision | Choice | Why |
|---|---|---|
| Redo depth | Content pass in place, structure kept | Structure is already canon; credibility problems are in the values and claims |
| Execution | One worker per repo in its own clone, one PR each | No shared state between repos; `workspace-batch` needs tooling work first |
| Merge policy | I merge each PR when its CI is green (user decision 2026-08-28) | Six small PRs; one summary at the end |
| Commit style in siblings | The sibling's own rule: Conventional Commits `docs(readme): ...` | Project-local rules win over house style |
| Batch manifest | Written as a record, not executed | Traceability without adopting an uninstalled tool |

## Benchmark study (sub-project 2)

`docs/internal/audits/2026-08-28-public-benchmark-patterns.md` records the
evidence already gathered and distills it into the P0 README checklist.

Evidence base: internal `gymboy`, `meshal-web`, `design-system`,
`workspace-tools`, `spincirc` (origin/main versions for the two stale clones);
external `sindresorhus/p-map`, `mitmproxy/pdoc`, `pallets/click` as picks,
with `casey/just`, `sharkdp/hyperfine`, `python-attrs/attrs`, `junegunn/fzf`,
`charmbracelet/glow`, `sharkdp/bat`, `tiangolo/typer`, `astral-sh/ruff`,
`psf/black` as the comparison set (six of them are badge walls).

Patterns to record, each with its evidence line:

- First six lines are the framework header; the H1 is the name, never a
  slogan.
- One paragraph states what it is, for whom, and how it differs from the
  obvious alternative (VOICE.md README rule; `p-map` line 7).
- One negated boundary sentence at the point of use, never a Limitations
  section (`meshal-web` 16-17, `gymboy` 64-65, `pdoc` 60).
- Status is key-value: lifecycle, verification date, scope (`spincirc` 19-21).
- Install or reproduce command on the first screen (`p-map` 12, `pdoc` 21).
- Architecture: 5 to 15 line tree of `origin/main`, then one link line.
- Docs map: bare link bullets to files that exist.
- At most 2 CI badges plus license; the strong internal examples use 0 or 1.
- Omitted: feature lists, screenshots, table of contents, testimonials,
  roadmap, praise, emoji, motivational closers.

### P0 README checklist

```
P0-01  Header block is lines 3 to 8 and every value matches the catalog
       (Status = catalog status, Category = bucket, Visibility = live).
P0-02  First paragraph: what it is, for whom, how it differs. Under 3 sentences.
P0-03  One boundary sentence saying what it does not do or assume.
P0-04  Status section carries Lifecycle, Verification date (today), Scope.
P0-05  Reproduction: one command block that was run for this PR; exit code
       and the date recorded in the PR body. For a site: the live URL
       returned 200 on the PR date and the build command was run.
P0-06  Every path, script, and command named in the README exists on main
       and runs from the repo root as written.
P0-07  Live surface named in Status when one exists (homepage in catalog).
P0-08  Tree is 5 to 15 lines and matches origin/main top level.
P0-09  Docs map bullets resolve; minimum docs/README.md, SSOT.md, LESSONS.md.
P0-10  No planning voice (should, where possible, emphasize), no praise,
       no banned register, no em dash, no AI attribution.
P0-11  At most 2 CI badges plus license; none is acceptable.
P0-12  CITATION.cff present for research repos with a publication; fields
       match the existing fleet files (author, ORCID, license, repository).
```

## README pass (sub-project 3)

One PR per repo, branch `docs/readme-redo-public` from a fast-forwarded
`main` in the repo's own clone under `lab/<slug>`.

Per-repo work items (all six unless noted):

| Item | Repos |
|---|---|
| Header: `Category: lab`; `Visibility: public`; `Status` from catalog (`frozen` for qmatsim, spincirc, maglogic, scicomp; `active` for chshlab, fallax); `Next action: continue` | all |
| First paragraph rewritten to P0-02 and a boundary sentence (P0-03) | all |
| Status section: Lifecycle, Verification date 2026-08-28, Scope; live URL for chshlab.online and fallax.online | all |
| Reproduction command run and recorded (research); build plus live 200 (chshlab, fallax) | all |
| Fix broken or unverifiable commands: `maglogic` compose path; `qmatsim` example commands run or replaced by ones that run | maglogic, qmatsim |
| Drop planning-voice sentences; replace claims with facts that the tree supports | all |
| `CITATION.cff` added, author fields copied from `maglogic`'s file; DOI only if recorded in the fleet (qmatsim's paper, Alawein et al., Phys. Rev. Materials 2025, is named in its `LESSONS.md` with no DOI anywhere in the fleet, so the file ships without one and the PR flags it) | qmatsim, chshlab |
| `fallax`: Purpose names the live site; "Publish mode: private GitHub repo" corrected; consumer claim made verifiable or dropped | fallax |
| `chshlab`: internal note about `docs/meta/ai/` removed from the public README | chshlab |

Verification per repo, before the PR: from `core/alawein`,
`validate-repo-framework.py --repo <clone> --catalog catalog/repos.json
--repo-slug alawein/<slug>`, `validate-readme-topology.py --repo-path <clone>
--repos-json catalog/repos.json --repo-slug alawein/<slug>`,
`validate-readme-voice.py` likewise, and the P0 checklist walked line by line
in the PR body. Sibling tests are not run unless the README names a command
the PR changes; the reproduction command is run once and its exit code
recorded.

PR body: the sibling template (Summary, Problem, Testing, Risk Assessment,
Rollback Plan, Checklist) with the spec's contract inside Summary and Testing:
before and after intent in two sentences, findings fixed by P0 item, validator
exit codes, promotion decision `PUBLIC-P0-PIN` or `PUBLIC-P1`.

Merge: squash, delete branch, admin bypass where the ruleset requires a review
the owner cannot self-give. Commit subject `docs(readme): <what changed>`.

## Close

1. `validate-readme-topology.py --github-api` and `validate-readme-voice.py
   --github-api` clean on all 40.
2. `catalog/index.yaml`: the six records move to `tier: P0`, `scanned:
   2026-08-28`, grace removed, notes pointing at the PR numbers; rebuild;
   `validate-visibility.py --github-api` shows no warning for the six.
3. Matrix rows updated (tier, action) with `last_updated` bumped.
4. Pin proposal for the user: up to 6 from P0. `outpost` is P1 under grace
   and not part of this wave; keeping or dropping its pin is the user's call.
5. Final report `docs/internal/audits/2026-08-28-public-portfolio-report.md`:
   public to private count, promoted count, pins delta, patterns applied,
   repos still blocked with owner action, next wave.
6. Batch record `docs/batches/public-credibility-1/manifest.yaml`: wave,
   repos, tasks, branch, PR, merge SHA, decision.

## Testing

- Control plane: the CLAUDE.md validation list and both pytest suites stay
  green after the catalog and matrix changes.
- Per repo: the three single-repo validators exit 0; the per-repo doctrine CI
  is green on the PR; the reproduction command exit code is in the PR body.
- Fleet: the two `--github-api` validators and the gate are clean after the
  last merge.

## Risks and limits

- `qmatsim` reproduction commands (relax, minimize, analyze on MoS2) may need
  solver binaries the worker does not have; if a command cannot run, the
  README documents the exact prerequisite and the PR body says which commands
  ran and which did not. P0 is not claimed on a command nobody ran.
- The fleet-wide `drift.yml` failure (missing token) is unrelated and stays
  red; the B7 rule counts it as a warning.
- The six clones carry local edits and stale branches; each worker fast-
  forwards `main` and branches from it, leaving stale local branches alone.
- Conventional Commits in siblings versus imperative subjects in the hub is
  expected; each repo's own rule applies.

## Non-goals

- Rewriting `docs/architecture/topology.md` or `docs/README.md` in the
  siblings.
- Fixing `drift.yml` or replacing the metadata token.
- README work on the other public repos (`qubeml`, `outpost`, `alawein`) or
  on the three demoted repos.
- Adopting `workspace-batch`.
