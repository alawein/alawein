---
type: canonical
source: fleet remediation program 2026-05-23
sla: on-change
last_updated: 2026-05-23
audience: [ai-agents, contributors]
---

# Fleet audit and remediation: program report (2026-05-23)

One consolidated record of the workspace-wide review, governance re-architecture, and per-repo audit program. Companion artifacts: the design spec and engine/rollout/remediation plans under this directory, the fleet remediation plan (`2026-05-23-fleet-remediation.md`), the commit manifest (`2026-05-23-fleet-commit-manifest.md`), and per-repo handouts at `<repo>/.claude/plans/2026-05-23-<repo>-audit-handout.md`.

## 1. What was asked, and what was delivered

The request began as a `/code-review` of "the coding/granularity in the configuration and automation of my GitHub organizations and tools" and grew, by explicit choices, into a full program: review the workspace, re-architect the inventory engine, harden and consolidate the tooling, then give every repo a clear pathway (audit -> handout -> SAFE-NOW fix -> roadmap) under the maintainer's `rb` standard, with clean releases and a commit convention, across all orgs.

Delivered:
- A versioned `.workspace/` inventory engine (scan + metadata sidecar, two byte-identical generators with a parity test and a pre-commit drift gate).
- A governance root-cause audit of `alawein/alawein` and a sequenced fleet remediation plan.
- Source fixes that fix or prevent the systemic defects (Phase 1 + the registry-aware Extender + catalog corrections).
- A full per-repo sweep: 36 repos audited, each with a handout and, where safe, a verified SAFE-NOW branch left uncommitted for the maintainer.

## 2. Operating constraints honored throughout

- The maintainer authors every commit. Agents created branches and left changes UNCOMMITTED; no commits, pushes, `git add -A`, or force-pushes.
- No edits to `.env`/secrets; secret findings were flagged for rotation, never reproduced.
- `.github/` workflow changes treated as gated (propose, maintainer applies).
- `.md` edits in `alawein/alawein` bump `last_updated`; no em-dashes; American spelling.
- `.claude/` working docs excluded per repo via `.git/info/exclude`; `jobs-projects/` left untouched per the workspace gitignore rule.

## 3. The fleet in one read

- **Secrets hygiene is clean across all 36 repos.** No live credentials committed anywhere. This is the most important property for a public fleet and it is already right.
- **The real problems are a small set of governance-layer systemics, not 36 independent messes.** Most defects trace to shared sources (the Extender, the scaffold, the CI-adoption registry, AI-scaffold residue).
- **CI is red on many repos, but always for mechanical reasons** — lockfile desync, lint/type errors, a test-vs-source gap, or an unadopted gate. Never a secret or a deep architecture flaw. Most are a one-line or one-branch fix (staged).
- **A few repos are exemplary** (veyra, meshal-web, adil, scribd, quantumalgo) and were left alone.

## 4. The 10 systemics and their disposition

| # | Systemic | Source | Status |
|---|---|---|---|
| 1 | Stale `.claude/CLAUDE.md` (Root omits bucket, commands `unknown`) | Extender `repo-scanner.sh` (= global `~/.claude/bin/`) ignored the registry | FIXED at source (Phase 3.1 registry-aware); fleet regen GATED |
| 2 | `docs/*` `> TODO` stubs as authoritative | retired scaffold; live analog is the product README template | PREVENTED at source (template gate + placeholder-sentinel rule); downstream sweep pending |
| 3 | `CONTRIBUTING.md` `{TOKEN}` placeholders | retired template; downstream-only | swept on several repos; rest pending |
| 4 | `Production/Stable` on early repos | downstream `pyproject.toml` | per-repo, pending |
| 5 | No test/lint CI gate | research + ventures repos missing from `github-baseline.yaml` | root-caused; registry rows + `sync-github` rollout GATED |
| 6 | `drift.yml` `secrets`-in-job-`if` | downstream-only | corrected pattern provided; rollout GATED |
| 7 | docs-doctrine path error | `bootstrap-repo.sh` wrote `scripts/validate-doctrine.py` (missing `/doctrine/`) | FIXED at source; downstream repins GATED |
| 8 | Hallucinated/wrong-product docs | AI scaffolding residue | per-repo (e.g. simcore, gymboy, atelier "mining", meshal-web Lean 4); pending |
| 9 | Pervasive version drift | no single anchor | version-coherence check ADDED (warn-only); per-repo reconcile pending |
| 10 | Committed heavy artifacts | per-repo | flagged (qmatsim 170 MB, optiqap 343 md, alembiq playwright); GATED history work |

## 5. Per-repo status

CI: green / red / dark / n/a. Secrets: all clean (omitted per row). SAFE-NOW: branch left uncommitted, or "audit-only" (WIP/no-fix-needed).

### tools/
| Repo | CI | SAFE-NOW | Headline |
|---|---|---|---|
| workspace-tools | green after fix | `fix/ci-green` (toolbox entrypoint, 246 pass) | pilot; template for all handouts |
| llmworks | green after fix | `fix/ci-green` (restored vitest, 310 pass) | CI fully green |
| incore | green after fix | `chore/cleanup` (ruff 36->0, 284 pass) | clean |
| attributa | partial | `fix/ci-green` (lockfile + jest) | 106 type errors remain (NEEDS-DECISION) |
| design-system | partial | `fix/ci-green` (NodeNext .js fixes) | 2 app failures remain |
| knowledge-base | audit-only | dirty on main | confirm WIP / deletions before acting |
| prompty | audit-only | dirty on main | confirm WIP before acting |

### research/
| Repo | CI | SAFE-NOW | Headline |
|---|---|---|---|
| fallax | green | `chore/cleanup` | website table + changelog; 400 tests, 93% |
| chshlab | green | `chore/cleanup` | CONTRIBUTING tokens; 154 tests |
| qmatsim | green | `chore/cleanup` | 170 MB committed binaries; ruff 31->0 |
| maglogic | no gate | `chore/cleanup` | no test CI; broken demo import; ruff 88->0 |
| qmlab | red (lockfile) | `chore/cleanup` | frozen but all-red; status label fixed |
| meatheadphysicist | green | `chore/cleanup` | root is a pile; corrupt file removed; ruff 95 |
| qubeml | green (no gate) | `chore/cleanup` | CI runs no tests; ruff 23->0 |
| scicomp | broken pytest | `chore/cleanup` | import-time banner crashes pytest; flake8 9038 |
| spincirc | red (no test CI) | `chore/cleanup` | phantom dep breaks install; ruff 51 |
| alembiq | red (cross-OS lock) | `fix/ci-green` | fictional README API; 197 tests |
| quantumalgo | drift red | audit-only (gated) | `drift.yml` secrets-in-if bug |
| simcore | green | audit-only | React app (not python); overview = wrong product |
| edfp | red | audit-only (WIP) | CI red (ruff-format + httpx); LICENSE says Kohyr |
| optiqap | main red | audit-only (WIP PR #12) | 343 md residue; case-collision Papers/ vs papers/ |
| helios | n/a | audit-only | docs archive; README says public (label only) |

### products/
| Repo | CI | SAFE-NOW | Headline |
|---|---|---|---|
| scribd | green | audit-only (no-ops) | `.env.example` omits DOWNLOAD_TOKEN_SECRET; wrong-product LESSONS |
| gymboy | green after fix | `fix/ci-green` (lint+type, 382 pass) | calls itself "GitHub Spark"; ships on Vercel |
| repz | partial | `fix/ci-green` (lockfile) | 157 type errors remain; split-brain context dirs |
| bolts | red | audit-only (decision) | 7 auth tests bypass mock; rotated historical key to confirm |

### ventures/
| Repo | CI | SAFE-NOW | Headline |
|---|---|---|---|
| veyra | green | audit-only (exemplary) | docs say Phase 1/53 tests; reality Phase 2/100 tests |
| adil | green | audit-only (clean) | legal-ops CLI (not OCR); 443 tests, 94% |
| loopholelab | green | `chore/cleanup` (2 imports) | Python FastAPI primary; catalog stack now corrected |
| provegate | red (mypy) | `fix/ci-green` (mypy + types) | CHANGELOG named wrong product; full green needs per-file mypy (gated) |

### family/ + personal/
| Repo | CI | SAFE-NOW | Headline |
|---|---|---|---|
| meshal-web | green | `chore/cleanup` | exemplary; Now.tsx Lean 4 claim resurfaced (decision) |
| atelier-rounaq | green after fix | `fix/ci-green` (build + removed 1644 dead lines) | dead "mining" theme in a fashion app; risky autonomous.yml |
| roka-oakland-hustle | build red | `chore/cleanup` (1 of 6 fixed) | Godot game; set git user.email before committing |

### governance + other orgs
| Repo | CI | SAFE-NOW | Headline |
|---|---|---|---|
| alawein/alawein | green | `chore/governance-cleanup` (Phase 1 + 3.1 + catalog) | the source of 7 systemics; fixed/prevented at source |
| blackmalejournal | green after fix | `fix/ci-green` (next bump + fast-uri) | alawein "Repo Excellence" governance leaked in |
| kohyr-internal-wip | dark (org Actions/billing) | audit-only (conservative) | company trunk; CI dark org-wide; correctly private |
| menax | green | audit-only (real WIP, preserved) | docs say Next 14 (is 15.5); deleted-token refs |

## 6. What is done vs gated

Done and staged (uncommitted, for the maintainer): ~20 SAFE-NOW branches across the fleet; the governance branch `chore/governance-cleanup` (Phase 1 source fixes + Phase 3.1 registry-aware Extender + catalog corrections, 33 files, gate green, 224 tests); the plan, manifest, and this report; per-repo handouts.

Gated on the maintainer:
1. Commit the backlog using the commit manifest.
2. Phase 2 - CI adoption: add the missing research + ventures repos to `github-baseline.yaml`, run `sync-github.sh --all` (writes downstream `.github/`).
3. Phase 3.2/3.3 - mirror the registry-aware Extender to `~/.claude/bin/`, regenerate `.claude/CLAUDE.md` fleet-wide.
4. Phase 4 - repin helios/optiqap (+others) to the current `doctrine-reusable.yml` SHA.
5. Phase 5 - per-repo downstream sweep (stub docs, drift.yml secrets bug, maturity classifiers, hallucinated docs, heavy artifacts) per each handout.

## 7. Open decisions surfaced for the maintainer

- Em-dash policy is now enforced as none (was a 0-1 budget in VOICE.md); confirm.
- Single version anchor (tag + CHANGELOG); confirm and reconcile per-doc `version:` fields.
- bolts: confirm the historical `sk_live` rotation completed; decide on a git-history scrub.
- meshal-web: the "Kohyr v0.3 Lean 4 formal verification" claim vs the Python/SymPy reality.
- atelier-rounaq: `autonomous.yml` that self-commits/pushes to main and posts a fabricated build status.
- loopholelab: `version_source` package.json vs its Python-primary package (frozen, left as-is).
- repz/scribd/bolts: no security headers on payment/PII/health apps.
