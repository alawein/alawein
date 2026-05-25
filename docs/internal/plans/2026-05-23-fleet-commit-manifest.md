---
type: canonical
source: fleet remediation program 2026-05-23
sla: on-change
last_updated: 2026-05-23
audience: [ai-agents, contributors]
---

# Fleet commit manifest (2026-05-23)

Every staged SAFE-NOW branch from the fleet audit, with a suggested commit message and verification status. The maintainer authors all commits. Branches are left checked out and UNCOMMITTED in each repo.

How to use: in each repo, review the diff (`git -C <path> diff`), then commit on the listed branch with the suggested message (adjust to taste), then open a PR or merge per that repo's release model. Nothing here has been committed or pushed.

Legend: VERIFIED = gates re-run green after the change; PARTIAL = the change is green for what it fixes but other gates remain red (noted); DOC = docs/config only (no test impact).

## Ready to commit (SAFE-NOW branch checked out)

### Governance source
| Repo | Branch | Suggested message | Status |
|---|---|---|---|
| alawein/alawein | `chore/governance-cleanup` | split into the 7 commits below | VERIFIED (gate green: 224 tests, validate OK) |

alawein/alawein suggested commit split (one branch, logical commits):
1. `fix: correct scaffold doctrine path and service-metadata link`
2. `style: forbid em-dashes on governed surfaces`
3. `feat(doctrine): fail residual scaffold placeholders; scope product Deployment`
4. `feat(doctrine): add version-coherence check and version SSOT rule`
5. `docs: fix stale script/layout paths and remove dead-brand references`
6. `fix(catalog): remove archived morphism, correct loopholelab stack, regenerate outputs`
7. `feat(extender): make repo-scanner registry-aware for bucketed Root and commands`
Plus untracked deliverables to commit: `docs/internal/plans/2026-05-23-fleet-remediation.md`, this manifest, `scripts/doctrine/version-coherence.py` + the new tests.

### tools/
| Repo | Branch | Suggested message | Status |
|---|---|---|---|
| workspace-tools | `fix/ci-green` | `fix(ci): add toolbox entrypoint and repoint e2e to python -m toolbox` | VERIFIED (246 pass) |
| llmworks | `fix/ci-green` | `fix(ci): restore vitest config` | VERIFIED (310 pass, CI green) |
| incore | `chore/cleanup` | `chore: clear ruff lint` | VERIFIED (ruff 36->0, 284 pass) |
| attributa | `fix/ci-green` | `fix(ci): regenerate lockfile and repair jest setup` | PARTIAL (type-check 106 errs remain - NEEDS-DECISION) |
| design-system | `fix/ci-green` | `fix(ci): add NodeNext .js import extensions` | PARTIAL (2 app failures remain) |

knowledge-base and prompty showed dirty trees on main at scan time; treat as their own WIP - see their handouts before committing.

### research/
| Repo | Branch | Suggested message | Status |
|---|---|---|---|
| alembiq | `fix/ci-green` | `docs: correct changelog naming and fill contributing command tokens` | VERIFIED (197 pass); note CI red is a separate cross-OS lockfile (GATED-on-Linux) |
| chshlab | `chore/cleanup` | `docs: fill CONTRIBUTING command placeholders` | VERIFIED (154 pass) |
| fallax | `chore/cleanup` | `docs: populate website benchmark table and fix changelog ordering` | VERIFIED (400 pass) |
| maglogic | `chore/cleanup` | `chore: clear ruff errors and add ruff config` | VERIFIED (241 pass, ruff 0) |
| qmatsim | `chore/cleanup` | `chore: clear ruff lint and de-dup gitignore` | VERIFIED (220 pass, ruff 0) |
| qmlab | `chore/cleanup` | `chore(meta): mark repo status frozen to match README/SSOT` | DOC |
| meatheadphysicist | `chore/cleanup` | `chore: remove corrupted restructure script, sort imports, fix paper.tex doc path` | VERIFIED (static: ruff 504->316, compile clean) |
| qubeml | `chore/cleanup` | `chore: remove unused imports and dead assignment` | VERIFIED (98 pass, ruff 0) |
| scicomp | `chore/cleanup` | `chore: gitignore setuptools_scm _version.py and quiet banner during pytest collection` | PARTIAL (unblocks single-file pytest; full green needs the two-conftest decision) |
| spincirc | `chore/cleanup` | `chore: remove unused imports flagged by ruff (F401)` | VERIFIED (126 pass) |

### products/
| Repo | Branch | Suggested message | Status |
|---|---|---|---|
| gymboy | `fix/ci-green` | `fix: clear lint and type errors blocking CI build` | VERIFIED (lint+type 0, build ok, 382 pass) |
| repz | (on main, dirty - branch it) `fix/ci-green` | `fix(deps): resync package-lock.json so npm ci passes` | PARTIAL (lockfile fixed; 157 type errors remain - NEEDS-DECISION) |

### ventures/
| Repo | Branch | Suggested message | Status |
|---|---|---|---|
| loopholelab | `chore/cleanup` | `chore: remove unused imports in validate route` | VERIFIED (108 pass) |
| provegate | `fix/ci-green` | `fix: unblock mypy and clear type errors in drift/proof servers` | PARTIAL (type fixes verified; full CI-green needs per-file mypy in ci.yml = GATED) |

### family/ + personal/
| Repo | Branch | Suggested message | Status |
|---|---|---|---|
| atelier-rounaq | `fix/ci-green` | `fix: repair broken build (design-system route + home-page import) and remove dead mining theme` | PARTIAL (build green, 72 pass; type-check needs orphaned-module decision) |
| meshal-web | `chore/cleanup` | `chore: correct Extender root path and clarify src/lib README comment` | DOC (CI already green) |
| roka-oakland-hustle | `chore/cleanup` | `chore: repoint phantom validate_data.py, fix license + qa-lock ignore, repair parking_puzzle indentation` | PARTIAL (1 of 6 Godot errors fixed). WARNING: set `git config user.email meshal@kohyr.com` in this clone first (it shows Test <test@test.local>) |

### other orgs
| Repo | Branch | Suggested message | Status |
|---|---|---|---|
| blackmalejournal | `fix/ci-green` | `fix(deps): bump next to 16.2.6 and pin fast-uri to clear high-severity advisories` | VERIFIED (1246 pass, audit clean) |

## No SAFE-NOW needed (clean - handout only, nothing to commit)
helios (docs archive), quantumalgo (green; only red gate is GATED .github/), simcore (green React app), bolts (green-ish; CI-red is a test-vs-source decision), scribd (green; doc rewrites need review), adil (green, already clean), veyra (green, exemplary; doc PR only), kohyr-internal-wip (conservative; CI dark org-wide).

## Audit-only - commit your own WIP first, then apply the handout's deferred SAFE-NOW
| Repo | Why |
|---|---|
| menax-inc/menax | 19 dirty files - real WIP in flight (preserved byte-for-byte) |
| optiqap | open PR #12 (+560k lines), main red on a stale self-test |
| edfp | `.claude/settings.json` tracked+modified (WIP) |
| knowledge-base, prompty | dirty on main at scan - confirm their state before acting |

## After committing the backlog
The gated fleet rollout (fleet-remediation plan Phases 2-5) needs your commits + approvals:
- Phase 2: add the 10 research repos to `github-baseline.yaml`, run `sync-github.sh --all` (writes downstream `.github/`).
- Phase 3.2/3.3: mirror the registry-aware Extender to `~/.claude/bin/`, regenerate `.claude/CLAUDE.md` fleet-wide.
- Phase 4: repin helios/optiqap (+others) to the current `doctrine-reusable.yml` SHA.
- Phase 5: the per-repo downstream sweep (stub docs, drift.yml secrets bug, maturity classifiers, hallucinated docs, heavy artifacts).
Catalog follow-up: DONE on this branch. loopholelab stack corrected (added python/fastapi - it has a primary FastAPI backend the catalog omitted). On inspection the other flagged items needed no change: the adil OCR tag and conflicting description were already cleaned by the Phase 1.5 regeneration; provegate's stack was already correct (python/mcp/agents); and the adil/provegate "duplicates" are intentional `catalog_groups` cross-listing in the grouped projects.json (8 repos cross-list into two groups each), not data bugs. Remaining open question (NEEDS-DECISION): loopholelab `version_source` is `package.json` while its primary package is Python (pyproject.toml) - left as-is since the repo is frozen.
