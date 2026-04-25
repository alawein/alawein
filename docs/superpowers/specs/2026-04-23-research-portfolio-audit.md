---
title: Spec D — Research Portfolio Audit
date: 2026-04-23
status: active
type: canonical
feeds: [master-execution-plan]
last_updated: 2026-04-23
---

# Spec D — Research Portfolio Audit

**Generated:** 2026-04-23
**Repos audited:** adil, alembiq, chshlab, edfp, fallax, helios, loopholelab, maglogic, meatheadphysicist, optiqap, provegate, qmatsim, qmlab, qubeml, scicomp, simcore, spincirc (17 repos)
**Scope:** Disposition decisions and one-line rationale only. No code review. Inputs: last non-baseline commit date, file-shape, live URL presence, catalog status.

---

## Executive Summary

**Overall health:** Yellow. Of 17 research repos, 8 are actively shipping code or have credible-enough recent activity to stay live, 7 are substantively complete but dormant (freeze candidates), 1 is already correctly archived (helios), and 1 is marked "planned" but has never had a feature push (edfp — freeze-as-planned). Zero repos qualify for deletion — every repo has real code or paper content.

**Key observation:** the workspace-wide "governance sync" commit floor from 2026-04-17 creates a misleading `git log` signal. Every repo's most recent commit is `chore(governance): sync workspace baseline`. The meaningful activity signal is the *last non-baseline, non-docs-only* commit — and on that axis, 7 repos have gone 2+ weeks without feature work.

**Strongest portfolio assets:** fallax (2026-04-19 feat(cli) — most recent code), simcore (2026-04-19 feat(auth)), optiqap (2026-04-18 feat(api) timing-safe token), adil and alembiq (2026-04-16 feature work), chshlab (paper + live site, Kante collab per memory).

**Weakest portfolio surfaces:** qmatsim / scicomp / spincirc — no homepage, no feature commits since 2026-04-09, but real multi-language code content; should be frozen rather than archived (the work is credible research artifact).

**Reset opportunity:** 8 repos to freeze (marked public, dormant, zero maintenance going forward). Doing this in one pass cleans the profile without losing any real work.

---

## Per-Repo Disposition

| # | Repo | Catalog status | Last non-baseline commit | Homepage | Disposition | One-line rationale |
|---|------|----------------|--------------------------|----------|-------------|-------------------|
| 1 | **adil** | active | 2026-04-16 `refactor: type Matter fields, real PDF export, consolidate audit log` | none | Keep-live | Legal-ops CLI with active feature work two weeks ago; real Python, Matter records, tests; private-tool value, not portfolio-facing |
| 2 | **alembiq** | active | 2026-04-16 `feat(config): reject unknown YAML keys and wrap errors with file path` | alembiq.online | Keep-live | LLM training/alignment/eval platform with recent config hardening and live site; marketing site job added 2026-04-16 |
| 3 | **chshlab** | active | 2026-04-06 `feat(polish): v0.1 read-only verifier loop` | chshlab.online | Keep-live | Static Bell-inequality rebuttal site with paper artifact; collaboration context (Prof Kante, UC Berkeley); paper.html + index.html shipped |
| 4 | **edfp** | **planned** | 2026-04-10 `fix(deps): upgrade uv.lock and frontend npm deps` — no feature commits | edfp.online | Freeze (as-planned) | Status has been "planned" and still is; dependency refresh + docs only; has src + tests + notebooks + paper but concept has not been pushed forward. Freeze and let the concept page speak for itself |
| 5 | **fallax** | active | 2026-04-19 `polish(baseline): ascii output, stderr regressions, sorted baselines (#7)` + same-day `feat(cli): add baseline capture/compare/status subcommands` | fallax.online | Keep-live | Most active research repo in the workspace; LLM adversarial eval with real CLI + website + baseline system; already subject of a 2026-04-18 sweep per memory |
| 6 | **helios** | **archived** | 2026-04-09 docs only | none | Archive (already) — confirm GitHub flag | README explicitly declares "Proprietary research archive. All rights reserved."; catalog status=archived; verify `gh api -X PATCH /repos/alawein/helios -f archived=true` reflects this |
| 7 | **loopholelab** | active | 2026-04-10 `docs: update deployment and monitoring documentation` — no feature code | loopholelab.online | Freeze | Adversarial claim-stress tool with real src/; last feature commit precedes 2026-04-08 (not found in recent window); has live URL so keep public, flip status to frozen |
| 8 | **maglogic** | active | 2026-04-05 `fix(docs): repair broken CLAUDE.md frontmatter` — no feature code | none | Freeze | Nanomagnetic logic simulation with real matlab/ + mumax3/ + oommf/ + python/ surfaces; substantive research artifact; dormant; no homepage means nothing to break by freezing |
| 9 | **meatheadphysicist** | active | 2026-04-15 `fix(ci): restore meatheadphysicist pipeline` — CI-only | mhphys.online | Keep-live (with caveat) | Bell-inequality / reproducible-research workspace with src + tests + notebooks + website + paper infrastructure + live URL; recent commits are CI fixes; next substantive push would lift this into "active" category but status quo is defensible |
| 10 | **optiqap** | maintained | 2026-04-18 `feat(api): require X-Admin-Token on /apply-theme and /sync-theme` + `fix(api): timing-safe token compare; strengthen auth tests` | optiqap.online | Keep-live | QAP workspace with active API hardening in the last 5 days; real notebooks, tests, website, multiple verification surfaces |
| 11 | **provegate** | active | 2026-04-15 `chore(ci): update setup-python pins` — CI only | provegate.online | Keep-live (with caveat) | MCP servers for agent "justified revisable beliefs"; real website and package but last feature code predates 2026-04-09 docs commit; kept live on strength of framing, needs a code push to defend status |
| 12 | **qmatsim** | active | 2026-04-09 `docs: workspace-wide documentation audit cleanup` — no feature code | none | Freeze | Quantum material simulation with real qmatsim/ Python package + lammps/ + siesta/ surfaces; legitimate research artifact; dormant since Apr 9; no homepage to protect |
| 13 | **qmlab** | active | 2026-04-16 `chore(deps): bump @alawein/tokens to 0.2.0 and @alawein/theme-base to 0.3.0 (#9)` — dep bump only | qmlab.online | Freeze | React + Three.js QML interactive surface; has homepage so keep public-live, but recent activity is only dependency bumps via governance sync — flip status to frozen rather than pretend active |
| 14 | **qubeml** | active | 2026-04-12 `chore: add bootstrap and handoff session commands` — infra only | none | Freeze | Notebook-first teaching repo (Qiskit/Cirq/PennyLane + PyTorch/sklearn/Kwant); real src + tests; last commits are bootstrap commands rather than content; no homepage |
| 15 | **scicomp** | active | 2026-04-09 docs only | none | Freeze | Cross-platform Python/MATLAB/Mathematica utility repo; real tests + notebooks; dormant since Apr 9; no homepage |
| 16 | **simcore** | active | 2026-04-19 `feat(auth): add anonymous sign-in so clients hold a JWT (#15)` | simcore.dev | Keep-live | Most recent code commit alongside fallax; interactive scientific computing with 3D + symbolic + numerical + Capacitor targets; real src/ + tests/ + live URL |
| 17 | **spincirc** | active | 2026-04-09 docs only | none | Freeze | Spintronic device modeling across matlab/ + python/ + verilogA/ surfaces; substantive multi-language research; dormant; no homepage |

---

## Aggregated Dispositions

| Disposition | Count | Repos |
|-------------|-------|-------|
| Keep-live | 8 | adil, alembiq, chshlab, fallax, meatheadphysicist, optiqap, provegate, simcore |
| Freeze | 8 | edfp (as-planned), loopholelab, maglogic, qmatsim, qmlab, qubeml, scicomp, spincirc |
| Archive (GitHub flag) | 1 | helios (already marked archived in catalog — verify GitHub side) |
| Delete | 0 | — |

---

## Keep-live Caveats

Two "Keep-live" repos have notable caveats that should not delay disposition but are worth flagging for the master plan:

| Repo | Caveat | Suggested follow-up |
|------|--------|---------------------|
| meatheadphysicist | Last commit is `fix(ci): restore meatheadphysicist pipeline` on 2026-04-15 — no feature work | Push one substantive content update (paper revision, site refresh, or new simulation notebook) within 30 days or flip to freeze |
| provegate | Last commit is `chore(ci): update setup-python pins` on 2026-04-15 — no feature code in recent window | Push an MCP server feature or benchmark result within 30 days or flip to freeze |

---

## Freeze Mechanics

Freezing a repo means: GitHub repo stays public, README stays as-is, but:
1. Catalog entry in `alawein/catalog/repos.json` flips `status` and `lifecycle` from `active` → `frozen` (or `maintained` → `frozen` where applicable)
2. Optional: Add a visible `> **Status:** Frozen — feature work paused 2026-04-23` banner at top of README
3. CI stays running via governance baseline (dependabot + CodeQL) so the repo doesn't rot at security boundary
4. No commitment to feature work or issue triage beyond what governance batches already do

No repo in this set needs GitHub archival — all have enough real content to stay present without archive-flagging.

---

## Cross-Cutting Observations

### Workspace-wide commit-floor noise
All 17 repos have a `chore(governance): sync workspace baseline` at 2026-04-17 as their most recent commit (when it applied). This creates a uniform "active" mirage on `git log -1`. The correct signal is *last commit excluding `chore(governance)` syncs and docs-only commits*. This should be encoded as a script: `workspace-tools/scripts/last-feature-commit.py <repo>` returning a per-repo age-days value. A 4-tier heuristic:
- 0–14 days: active
- 15–30 days: stale — warn
- 31–90 days: freeze candidate
- 91+ days: archive candidate

### Scaffolding artifacts at root
`spincirc`, `maglogic`, and `qmatsim` all carry `claude-code-guide.jsx` and `claude-code-superprompt.jsx` at repo root — agent guide files that should either move to `.claude/` or be deleted. Cosmetic but propagates a "this is a prompt-farm" read on the public profile.

### Simulation-specific layout
`spincirc` (matlab/ + python/ + verilogA/), `maglogic` (matlab/ + mumax3/ + oommf/ + python/), and `qmatsim` (lammps/ + qmatsim/ + siesta/) share a common pattern: top-level language directories, no `src/`. This is idiomatic for research computation and should not be "fixed" to match product-repo conventions.

### Homepage coverage
Of 17 repos, 10 have live `*.online`/`.dev` homepages. 7 have none (adil, helios, qmatsim, qubeml, scicomp, spincirc, maglogic). Of the 7 without homepages, 6 are freeze candidates and 1 (adil) is a private tool that likely shouldn't get a public site.

---

## Feeds Into Master Execution Plan

**Phase 1 — Portfolio (immediate):**
- Flip 8 repos to `frozen` in `catalog/repos.json`: edfp, loopholelab, maglogic, qmatsim, qmlab, qubeml, scicomp, spincirc
- Verify helios GitHub `archived=true` flag matches catalog
- Add "Frozen" README banner to the 8 freeze targets

**Phase 2 — Debt reduction:**
- Delete or move `claude-code-guide.jsx` and `claude-code-superprompt.jsx` from spincirc, maglogic, qmatsim repo roots
- Write `workspace-tools/scripts/last-feature-commit.py` per the 4-tier heuristic

**Phase 4 — Onboarding:**
- Add a 30-day feature-push follow-up for meatheadphysicist and provegate; if no push by 2026-05-23, flip to frozen
- Encode the "governance-sync-only" commit filter in any future freshness dashboard

---

## Totals

| Metric | Value |
|--------|-------|
| Repos audited | 17 |
| Keep-live | 8 |
| Freeze | 8 |
| Archive (confirm existing) | 1 |
| Delete | 0 |
| Repos with live homepage | 10 |
| Repos with recent (≤7 day) feature code | 4 (fallax, simcore, optiqap, alembiq) |
| Repos with governance-only commits for 14+ days | 7 |

---

## Methodology Notes

- Disposition based on: (a) last commit subject and date from `git log --since=2026-03-01`, filtering out `chore(governance): sync workspace baseline`, (b) catalog status/lifecycle from `alawein/catalog/repos.json` lastVerified 2026-04-14, (c) on-disk file inventory (src/tests/notebooks/website/paper presence), (d) README opening paragraph for scope claim.
- "Active" was defined as ≥1 feature or bugfix commit (not CI/docs/deps/governance) within the last 14 days of 2026-04-23, i.e. from 2026-04-09 onward.
- CI-only, docs-only, and dependency-bump-only commits were counted as maintenance, not feature work.
- No code review was performed; disposition decisions do not depend on code quality, only on activity signal and catalog metadata.
- Subagents were not used for Spec D — single-session inline inspection proved faster for a metadata-only audit.
