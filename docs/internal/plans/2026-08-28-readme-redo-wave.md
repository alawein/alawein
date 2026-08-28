---
title: README redo wave: implementation plan
date: 2026-08-28
status: draft
type: implementation-plan
source_spec: docs/internal/specs/2026-08-28-readme-redo-wave-design.md
last_updated: 2026-08-28
---

# README Redo Wave Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the six pin-candidate READMEs to the P0 bar with one small PR each, record the benchmark study behind the bar, then move the six catalog records to P0.

**Architecture:** A benchmark doc turns today's evidence into a 12-item checklist. Six workers, one per sibling clone, apply the checklist to that repo's README on a fresh branch, run the three single-repo validators, and open a PR in the sibling's own template. The controller merges each PR when its CI is green, then updates the catalog, the matrix, and the final report in the control plane.

**Tech Stack:** Markdown, YAML, git and `gh`, the hub's doctrine validators (`scripts/doctrine/*.py`), Python and Node toolchains inside the siblings for the reproduction commands.

**Spec:** `docs/internal/specs/2026-08-28-readme-redo-wave-design.md`

## Global Constraints

- Voice on every README and doc: no em dash (U+2014); none of the banned register in `docs/style/VOICE.md`; no praise, no planning voice ("should emphasize", "where possible"), no AI attribution; plain ASCII in new text; American spelling.
- Header block is lines 3 to 8 of each README, six lines, labels padded exactly as in `templates/scaffolding/README.research.md`: `Status:      `, `Category:    `, `Owner:       `, `Visibility:  `, `Purpose:     `, `Next action: `.
- Header values come from the catalog: `Category: lab` for all six; `Visibility: public` for all six; `Status: frozen` for qmatsim, spincirc, maglogic, scicomp and `Status: active` for chshlab, fallax; `Owner: alawein`; `Next action: continue`.
- Sibling commits follow the sibling's `CONTRIBUTING.md`: Conventional Commits, `docs(readme): <subject>`, no body unless the why is non-obvious, no `Co-Authored-By`, no AI attribution. Branch `docs/readme-redo-public` from a fast-forwarded `main`. Stage explicit paths only.
- Sibling PR body uses the sibling's `.github/PULL_REQUEST_TEMPLATE.md` sections (Summary, Problem, Testing, Risk Assessment, Rollback Plan, Checklist). No agentic-process narration, no internal path leakage, no hub-internal file names.
- Control-plane commits: imperative subject under 70 chars, no trailers; every touched `.md` gets `last_updated: 2026-08-28`.
- Nothing is pushed and no PR is opened until the user gives the send word for the six branches in one turn (Task 4 step 1). Merges are pre-approved by the user (2026-08-28): squash, delete branch, admin bypass where the ruleset blocks on a review the owner cannot self-give.
- The reproduction command in each README must have been run for the PR; its exit code and date go in the PR body. A command that cannot run is documented with its prerequisite and is not claimed as run.
- Never edit `catalog/repos.json`, `projects.json`, `catalog/generated/*`, or the hub `README.md` by hand.
- Evidence files from today's scan (session-local, read-only) live under `C:/Users/mesha/AppData/Local/Temp/claude/C--Users-mesha-Desktop-GitHub-alawein-core-alawein/4fbc2492-9774-43bf-8c19-98b635465a11/tasks/`: `y_candidates.txt`, `y_internal-benchmarks.txt`, `y_external-exemplars.txt`, `y_rules-and-tooling.txt`; fetched READMEs under `.../scratchpad/readmes/` and `.../scratchpad/<slug>.README.md`.

---

### Task 0: Control-plane branch and commit the spec and plan

**Files:** none new.

- [ ] **Step 1: Branch from main**

```bash
git checkout main && git pull --ff-only origin main
git checkout -b feat/readme-redo-wave
git add docs/internal/specs/2026-08-28-readme-redo-wave-design.md docs/internal/plans/2026-08-28-readme-redo-wave.md
git commit -m "Add README redo wave design spec and implementation plan"
```
Expected: branch at one commit ahead of `main`; `git status --short` shows only the hook-written `docs/operations/session-log.md`.

---

### Task 1: Benchmark patterns doc

**Files:**
- Create: `docs/internal/audits/2026-08-28-public-benchmark-patterns.md`

**Interfaces:**
- Produces: the `P0 README checklist` block (P0-01 to P0-12, verbatim from the spec) that every sibling PR body walks.

- [ ] **Step 1: Write the doc**

Frontmatter `type: audit`, `status: draft`, `last_updated: 2026-08-28`, `owner: meshal`. H1 `# Public benchmark patterns (2026-08-28)`. Sections, in order:

1. `## Evidence base`: two tables. Internal (repo, lines, badges, H2 order, how status and limits are stated, tree lines) for gymboy, meshal-web, spincirc, and the origin/main versions of design-system and workspace-tools, from `y_internal-benchmarks.txt`. External (repo, lines, header badges, scope or boundary sentence quoted or `none`, install line number) for the twelve repos in `y_external-exemplars.txt`; mark the six badge walls.
2. `## Patterns`: the nine bullets from the spec's Benchmark study section, each ending with its evidence in parentheses (file and line).
3. `## What the bar omits`: one paragraph (feature lists, screenshots, table of contents, testimonials, roadmap, praise, emoji, motivational closers, badge walls).
4. `## P0 README checklist`: the fenced block from the spec, verbatim.
5. `## Picks`: gymboy and meshal-web internally, p-map, pdoc, click externally, two lines each on why, with the caveat lines (meshal-web license badge on a private repo; pdoc's six badges; click's missing install line).

- [ ] **Step 2: Voice scan and contract**

```bash
python - <<'EOF'
import io,re
t=io.open("docs/internal/audits/2026-08-28-public-benchmark-patterns.md",encoding="utf-8").read()
print("em dashes:",t.count("\u2014"),"non-ascii:",sorted(set(c for c in t if ord(c)>127)))
EOF
bash ./scripts/doctrine/validate-doc-contract.sh --full
```
Expected: `em dashes: 0 non-ascii: []`; contract passes.

- [ ] **Step 3: Commit**

```bash
git add docs/internal/audits/2026-08-28-public-benchmark-patterns.md
git commit -m "Record public benchmark patterns and the P0 README checklist"
```

---

### Task 2: Batch record

**Files:**
- Create: `docs/batches/public-credibility-1/manifest.yaml`

- [ ] **Step 1: Write the record**

```yaml
wave: public-credibility-1
date: 2026-08-28
spec: docs/internal/specs/2026-08-28-readme-redo-wave-design.md
checklist: docs/internal/audits/2026-08-28-public-benchmark-patterns.md
branch: docs/readme-redo-public
default_visibility: private
promote_only_if: p0_checklist_pass
repos:
  - slug: qmatsim
    type: research
    tasks: [header, first-paragraph, status, reproduction, citation, planning-voice]
    pr: null
    merged: null
    decision: pending
  - slug: spincirc
    type: research
    tasks: [header, first-paragraph, status, reproduction, planning-voice]
    pr: null
    merged: null
    decision: pending
  - slug: maglogic
    type: research
    tasks: [header, first-paragraph, status, reproduction, compose-path, planning-voice]
    pr: null
    merged: null
    decision: pending
  - slug: scicomp
    type: research
    tasks: [header, first-paragraph, status, reproduction, planning-voice]
    pr: null
    merged: null
    decision: pending
  - slug: chshlab
    type: research
    tasks: [header, first-paragraph, status, live-surface, build, citation, internal-note]
    pr: null
    merged: null
    decision: pending
  - slug: fallax
    type: tooling
    tasks: [header, first-paragraph, status, live-surface, reproduction, publish-mode, consumers]
    pr: null
    merged: null
    decision: pending
```

- [ ] **Step 2: Check the root-file rule and commit**

`docs/batches/` is a new directory under `docs/`; `validate-doc-contract.sh --full` must still pass (YAML under `docs/` is not a managed markdown doc). Run it, then:

```bash
git add docs/batches/public-credibility-1/manifest.yaml
git commit -m "Add the public-credibility-1 batch record"
```

---

### Task 3: README pass, one worker per repo (six parallel lanes)

Each lane is one sibling clone under `C:/Users/mesha/Desktop/GitHub/alawein/lab/<slug>`. Lanes share no files; they run in parallel. Each lane ends with a local commit on `docs/readme-redo-public` and a PR body file written to the session scratchpad as `pr-<slug>.md`; nothing is pushed in this task.

**Common steps for every lane**

- [ ] **Step A: Fast-forward and branch**

```bash
cd C:/Users/mesha/Desktop/GitHub/alawein/lab/<slug>
git fetch origin
git stash push -m "pre-redo local edits" -- README.md    # only if README.md is modified
git checkout main && git pull --ff-only origin main
git checkout -b docs/readme-redo-public
```
Expected: `git log --oneline -1` equals `origin/main`. Do not touch other local branches. The stash holds the migration's one-line `Category` edit; it is superseded by this work and stays in the stash.

- [ ] **Step B: Apply the header**

Lines 3 to 8 become exactly (values per the Global Constraints):

```
Status:      <frozen|active>
Category:    lab
Owner:       alawein
Visibility:  public
Purpose:     <one factual line, under 100 characters>
Next action: continue
```

- [ ] **Step C: First paragraph and boundary sentence (P0-02, P0-03)**

Directly under the first H2 (`## Abstract` or `## Purpose`): under three sentences saying what it is, for whom, and how it differs from the obvious alternative; then one sentence starting with "It does not" or "Not a" that states the boundary.

- [ ] **Step D: Status section (P0-04, P0-07)**

Research repos: `## Status` bullets `- Lifecycle: <frozen|active>`, `- Verification date: 2026-08-28`, `- Scope: <one line>`, and `- Live: <url>` where the catalog has a homepage other than github.com. Tooling (`fallax`): the same four lines go under `## Purpose` as a short list after the paragraph, since the tooling order has no Status section.

- [ ] **Step E: Reproduction (P0-05, P0-06)**

Run the lane's command block (below) from the repo root, record `exit <code>` and the date, and make the README's Reproducibility (or Commands) block contain exactly the commands that ran. Any command that did not run gets its prerequisite named in one line and is not listed as a step.

- [ ] **Step F: Planning voice and claims (P0-10)**

Delete or rewrite every sentence that instructs rather than states (should, where possible, emphasize, before citing, must be identified). Replace unverifiable claims with facts the tree supports (counts, file names, commands). Keep the ASCII tree; confirm it matches `origin/main` top level with `ls`.

- [ ] **Step G: Validators (from the hub checkout)**

```bash
cd C:/Users/mesha/Desktop/GitHub/alawein/core/alawein
python scripts/doctrine/validate-repo-framework.py --repo ../../lab/<slug> --catalog catalog/repos.json --repo-slug alawein/<slug>
python scripts/doctrine/validate-readme-topology.py --repo-path ../../lab/<slug> --repos-json catalog/repos.json --repo-slug alawein/<slug>
python scripts/doctrine/validate-readme-voice.py --repo-path ../../lab/<slug> --repos-json catalog/repos.json --repo-slug alawein/<slug>
```
Expected: all three exit 0. Then walk P0-01 to P0-12 and record pass or fail per item.

- [ ] **Step H: Commit**

```bash
git add README.md            # plus CITATION.cff where created
git commit -m "docs(readme): meet the P0 readme checklist"
```

- [ ] **Step I: PR body file**

Write `C:/Users/mesha/AppData/Local/Temp/claude/C--Users-mesha-Desktop-GitHub-alawein-core-alawein/4fbc2492-9774-43bf-8c19-98b635465a11/scratchpad/pr-<slug>.md` in the sibling template:

```markdown
## Summary
Before: <one sentence on what the README claimed or lacked>. After: <one sentence on what it now states and verifies>.

## Problem
Header values drifted from the catalog (Category, Visibility); <repo-specific gaps in one or two lines>.

## Testing
- Reproduction: `<command>` exit 0 on 2026-08-28. <second command if any>
- Validators: framework 0, topology 0, voice 0.
- P0 checklist: 12/12 (or list the failing items and why).

## Risk Assessment
Documentation only; no code paths change. <one line if a command in the README changed>

## Rollback Plan
Revert the single commit.

## Checklist
- [x] CI passes
- [x] No secrets
- [x] Docs updated
- [ ] Changelog updated (not applicable: README only)
- [ ] Linked issue (none)

Promotion decision: PUBLIC-P0-PIN
```

**Lane specifics**

- [ ] **qmatsim** (research, frozen). README 78 lines. Commands to run: `python scripts/validate-structure.py`; `python -m pytest tests/test_cli_basic.py tests/test_qmatsim_cli.py -q`. The relax, minimize, analyze examples on MoS2 (README lines 55 to 57) run only if SIESTA or LAMMPS is on PATH; if not, keep them under a line "Requires SIESTA and LAMMPS on PATH; not run in CI." and do not present them as verified. Delete lines 15 to 17 (planning voice) and line 69 (rule, not fact). Move the tree out of Runtime requirements into a `## Architecture` section placed before `## Docs map` (the other four research READMEs already have it). Add `CITATION.cff`: copy `maglogic`'s file shape (cff-version 1.2.0, message, type software, title "QMatSim: Quantum Materials Simulation Toolkit", authors Alawein Meshal contact@meshal.ai, repository-code https://github.com/alawein/qmatsim, keywords from the README, license MIT, version from `pyproject.toml` if present else "0.1.0", date-released 2026-08-28) plus a `references` entry `type: article`, title left as the paper name recorded in `LESSONS.md` line 18 ("Alawein et al., Phys. Rev. Materials 2025"), `journal: Physical Review Materials`, `year: 2025`, no DOI (none recorded in the fleet; say so in the PR body).
- [ ] **spincirc** (research, frozen). README 77 lines; `Visibility: private` at line 6 is wrong. Commands: `python -m pip install -r python/requirements.txt` then `python -m pytest python/tests -q`; MATLAB tests are listed as requiring MATLAB and not run. Rewrite line 14 ("EDA-ready compact models...") as a factual list of what `matlab/`, `python/`, and the Verilog-A models contain; delete line 50 and line 55 unless the cited values are named with a file. Keep `CITATION.cff` (present, DOI 10.1109/JXCDC.2018.2876456).
- [ ] **maglogic** (research, frozen). README 74 lines. Fix line 25 to `docker compose -f docker/docker-compose.yml up --build` and mark it as not run unless Docker is available. Commands: `python scripts/validate-structure.py`; `python -m pytest python/tests -q` (with `environment.yml` or `pyproject.toml` install first). Line 53 names no script: either name `examples/run_basic_triangle.py` or delete the sentence. Line 15 ("automated truth-table verification and energy-landscape analysis for teaching and reproducible research") becomes a plain statement of what the package does.
- [ ] **scicomp** (research, frozen). README 73 lines. Commands: `python -m pip install -e .`; `python scripts/validate_framework.py`; `python -m pytest tests/python -q`. MATLAB and Mathematica tests listed as requiring their runtimes. Line 12 ("a cross-platform scientific computing suite") and 13 to 14 ("shared scientific vocabulary") become a factual sentence naming the three language trees. Keep `CITATION.cff`.
- [ ] **chshlab** (research, active). Clone is two commits behind; Step A fixes that. README 83 lines; `Visibility: private` at line 6 is wrong. Live: `https://chshlab.online` (Vercel) goes in Status and the first paragraph. Commands: `npm ci`; `npm test`; `bash build.sh`; then `curl -s -o /dev/null -w "%{http_code}" https://chshlab.online` must print 200. Delete line 23 (internal note about `docs/meta/ai/`). Keep the figure-provenance link but state it as a fact ("Figures are generated by `scripts/generate_figures.py`; provenance in `docs/FIGURE_PROVENANCE.md`"). Add `CITATION.cff` with `type: software`, title "CHSH Lab: Bell inequality experiments and rebuttal", no references block, other fields as for qmatsim.
- [ ] **fallax** (tooling, active). Clone is on `docs/architecture-topology`; Step A returns it to `main`. README 92 lines; `Visibility: private` wrong. Live: `https://fallax.online` goes in Purpose and the status list. Commands: `python -m pip install -e .`; `python -m fallax --help`; `python -m pytest -q` (CI enforces 90 percent coverage; if the suite needs provider keys, run the smoke subset named in `ci-smoke.yml` and say so). Line 90 becomes `Publish mode: public GitHub repo; PyPI publish not configured`. Line 84 consumer claim: keep only what the tree shows (a named consumer needs a file or import; otherwise "Used by the alawein research workflows through the CLI"). Line 15 "six failure categories": count the categories in `fallax/data/metadata.json` or the templates and state the real number.

---

### Task 4: Push, PRs, merges

**Files:** none in the control plane.

- [ ] **Step 1: Send word**

Show the user a six-row table (slug, commit subject, reproduction result, P0 items failing if any) and ask once for the go-ahead to push all six branches and open the six PRs. Do not push on silence.

- [ ] **Step 2: Push and open, per repo**

```bash
cd C:/Users/mesha/Desktop/GitHub/alawein/lab/<slug>
git push -u origin docs/readme-redo-public
gh pr create --base main --head docs/readme-redo-public --title "docs(readme): meet the P0 readme checklist" --body-file <scratchpad>/pr-<slug>.md
```
Record each PR number in `docs/batches/public-credibility-1/manifest.yaml` (`pr:`).

- [ ] **Step 3: Watch and merge**

For each PR: `gh pr checks <n> --watch --interval 30`; when every required check is green (the per-repo doctrine workflow must be green; `drift` may be red and is not required), `gh pr merge <n> --squash --delete-branch` (add `--admin` only if the ruleset blocks on a review). If a required check fails, read `gh run view <run> --log-failed`, fix in the lane, push, re-watch. Record `merged:` SHA and `decision: PUBLIC-P0-PIN` in the manifest.

---

### Task 5: Close in the control plane

**Files:**
- Modify: `catalog/index.yaml` (six records), regenerate outputs
- Modify: `docs/internal/audits/2026-08-27-public-visibility-matrix.md` (six rows, `last_updated`)
- Modify: `docs/batches/public-credibility-1/manifest.yaml` (results)
- Create: `docs/internal/audits/2026-08-28-public-portfolio-sweep.md`
- Modify: `CHANGELOG.md` (`[Unreleased]` bullets)

- [ ] **Step 1: Fleet validators after the last merge**

```powershell
$env:GITHUB_TOKEN = (gh auth token)
python scripts/doctrine/validate-readme-topology.py --github-api
python scripts/doctrine/validate-readme-voice.py --github-api
```
Expected: topology fails only attributa and veyra (private, unchanged); voice OK on all 40.

- [ ] **Step 2: Records to P0**

For each of the six in `catalog/index.yaml`: `tier: P0`, `scanned: '2026-08-28'`, remove `grace_until`, `notes: P0 via README redo PR #<n>, merged <sha>`. Then:

```bash
python scripts/catalog/build-catalog.py
python scripts/catalog/sync-readme.py
python scripts/catalog/validate-catalog.py --strict
python scripts/github/validate-visibility.py --offline
```
Expected: strict passes; `--offline` shows one warning only, `V4 alawein` under grace (the four pins are now P0, so no V5 warnings). Run `--github-api` once with the local token and expect the same.

- [ ] **Step 3: Matrix and manifest**

Matrix: the six rows get tier `P0` and action `P0 via PR #<n>`; the Findings section gets one line "README redo wave 1 merged 2026-08-28: six repos at P0"; `last_updated: 2026-08-28`. Manifest: every `decision:` filled.

- [ ] **Step 4: Final sweep report**

`docs/internal/audits/2026-08-28-public-portfolio-sweep.md` (frontmatter as the matrix) with: executive summary (public to private count: 3; promoted to P0: 6; pins delta: catalog 6 to 4, live 5 to 3, proposal below); the visibility matrix summary table (40 rows compressed to slug, visibility, tier); benchmark patterns applied (link the patterns doc, list the P0 items most often failed before the wave); repos still blocked with owner action (alawein B6 and B7, the three demoted repos, the dead metadata token, outpost pin); recommended next wave (qubeml and outpost READMEs, `sites` bucket promotion of meshal-web, secret rotation).

Pin proposal (user decides, max 6, P0 only): qmatsim, spincirc, maglogic, scicomp, fallax, chshlab. State that `outpost` is P1 under grace and would have to leave `profile_pins` if the six are taken.

- [ ] **Step 5: CHANGELOG and gates**

Add under `[Unreleased]` `### Added`: the patterns doc, the batch record, the sweep report; under `### Changed`: "six pin candidates promoted to P0 after the README redo wave". Bump `last_updated`. Run the CLAUDE.md validation list and both pytest suites; expected: the same three known-red commands (`verify-profile-pins`, `sync-github.sh --check --all`, `github-baseline-audit.py`), everything else 0, pytest all pass.

- [ ] **Step 6: Commit, PR, merge**

```bash
git add catalog/index.yaml catalog/repos.json projects.json catalog/generated README.md docs/internal/audits/2026-08-27-public-visibility-matrix.md docs/internal/audits/2026-08-28-public-portfolio-sweep.md docs/batches/public-credibility-1/manifest.yaml CHANGELOG.md
git commit -m "Promote six pin candidates to P0 and record the portfolio sweep"
```
Push and PR need the user's send word; merge is pre-approved once CI is green. PR title `Promote six pin candidates to P0 after the README redo wave`.

---

## Self-review

Spec coverage: benchmark study (Task 1), batch record (Tasks 2 and 4), per-repo pass with every table row from the spec (Task 3 lanes), verification and PR contract (Task 3 steps G and I), merge policy (Task 4), close items 1 to 6 (Task 5). The pin proposal is presented, not applied; pins remain a manual UI step. `outpost` is out of scope, as the spec says.

Placeholders: the PR body template's angle-bracket fields are filled per lane; the manifest's `null` values are filled in Tasks 4 and 5.

Consistency: the checklist ids P0-01 to P0-12 are used identically in the spec, Task 1, Task 3 step G, and the PR body; header values match the catalog facts in the spec's findings; commit subjects follow each repo's own convention.
