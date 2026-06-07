---
type: internal
status: active
last_updated: "2026-06-07"
audience: [ai-agents, contributors]
---

# Handoff: fleet sweep / cleanup / version control / website refresh

Picks up after the anti-rot rollout (30 of 30 code repos merged) and a CLAUDE.md
audit. Location is `docs/internal/`, which is exempt from doctrine/Vale CI.

## Constraints (unchanged)

- Commit as `contact@meshal.ai`; no AI attribution anywhere.
- Never commit secrets; never bypass security or secret scans.
- Confirm before force-push or history rewrite on a shared branch.
- `.github/` is gated; get approval before editing CI.
- No em-dashes in prose. Never hand-edit generated catalog or inventory files.

## 0. Loose ends (do first)

| Item | State | Action |
|---|---|---|
| `alawein/alawein/CLAUDE.md` #11 edit | landed via this handoff PR | none once merged |
| Root `./.claude/CLAUDE.md` de-stale edit | saved on disk, not version-controlled (workspace root is not a git repo) | aware that re-running the Extender re-blanks it |
| `.claude/proposals/CLAUDE.md.proposed` | leftover from a dry-run | delete |

## 1. Version-control cleanup

Stale branches in `alawein/alawein` confirmed mergeable and deletable:
`docs/anti-rot-primitives-spec`, `docs/session-handoff-2026-05-30`,
`feat/anti-rot-primitives` (0 unique commits), `fix/vale-exempt-agent-scaffolding`
(squash-merged via #128).

Keep (real unmerged WIP): `fix/catalog-accuracy-corrections` (catalog fixes, no
PR yet), `p0-infrastructure-spine-stabilization` (open PR #123).

Dependabot backlog (largest VC debt). Triage with `/stale-pr-triage`, batch the
safe ones:

- `blackmalejournal`: 11 PRs from 2026-04-13 (Next.js). Prioritize security
  bumps first (`next` to 16.2.6 in #46, `stripe` #37, npm_and_yarn group #47).
- `spincirc` (5), `menax` (5), `chshlab` (3), `scicomp` (2), plus a wave of
  trivial `github/codeql-action 4.36.0 to 4.36.x` bumps across qubeml, qmatsim,
  maglogic, fallax, scicomp. Batch the trivial ones.
- Review majors before merge: `menax#10 next 15 to 16`,
  `blackmalejournal#35 typescript 5 to 6`, `#39 tailwind 3 to 4`.

Stale feature PRs to decide (merge, rebase, or close): `optiqap#12` (Plan-4
billing, 2026-04-28), `alembiq#43` and `#50`, `alawein#123` (P0 infra spine),
`menax#22` (phase-6c plan), `auditraise#1` (confirm the repo exists), `mercor#5`.
`alawein#129` (auto architecture-diagram refresh) is likely auto-mergeable;
check CI.

## 2. CI and version-control improvements

Recurring CI-infra defects, logged in per-repo `DEBT.md`, fix at source and audit
fleet-wide:

1. `actions/upload-artifact@v3` (auto-failed by GitHub) confirmed in `optiqap`
   `ci.yml`. Grep all workflows for `upload-artifact@v3` and `download-artifact@v3`,
   bump to v4.
2. CodeQL language matrix listing `python` in repos with no Python (`Exit 32`)
   confirmed in `attributa`. Audit all `codeql.yml` matrices against actual
   languages.
3. gitleaks Secret-Scan job missing `pull-requests: read` (403, crashes before
   scanning) confirmed in `attributa`. Audit secret-scan workflow `permissions:`.

Adopt the Vale scaffolding exemption fleet-wide. Org PR #128 added
`.claude/.cursor/.superpowers` to the Vale exclusion in
`doctrine-reusable.yml@0006251`, but only optiqap bumped its pin. Other repos
pick it up only when their `docs-doctrine.yml` pin bumps. Do a fleet pin-bump
sweep (gated `.github/`).

Platform gotchas to enforce (see `alawein/CLAUDE.md`): a `.gitattributes` with
`* text=auto eol=lf` and `*.sh text eol=lf` in every repo; regenerate
Windows-built `package-lock.json` on Linux via `/relock <repo> <branch>`.

Suggested agents: `/portfolio-ci-triage`, `/cross-repo-drift-auditor`,
`/dependency-security-auditor`, `/secrets-exposure-auditor`.

## 3. Fleet doctrine and voice sweep

Anti-rot is merged, but the optiqap Vale pattern (legacy terms plus tone filler
repo-wide) likely repeats elsewhere. Run a fleet voice resweep per repo with the
org `.vale.ini` over the in-scope file set (exclusions now include
`.claude/.cursor/.superpowers`). Watch banned terms (`qaplibria` -> `optiqap`,
`morphism-systems` -> `kohyr`, `devkit` -> `toolkit`, `gainboy` -> `gymboy`) and
`Alawein.Tone` filler. Validators: `validate-doctrine.py`, `validate.py`,
`validate-repo-framework.py`.

## 4. Website updates and refinements

| Site | Repo | Notes |
|---|---|---|
| Portfolio | `alawein/personal/meshal-web` | Dependabot #48 react-router; content refresh |
| alawein profile | `alawein/alawein/README.md` | Generated from `projects.json` via `sync-readme.py`; never hand-edit, run `--check` |
| Friend's site | `blackmalejournal/blackmalejournal` | Next.js; 11 dependabot PRs incl. security, highest website VC debt |
| Joint business | `menax-inc/menax` | Next.js + Prisma; dependabot incl. `next 16`, security group |
| Startup | `kohyr` (`kohyr-internal-wip`, remote `kohyr-app`) | Pre-launch website and docs track; confirm public site repo |
| Other web | `alembiq/website`, `chshlab` website, `roka-oakland-hustle` | dep bumps pending |

Per site: verify build and Vercel deploy green, check Core Web Vitals, run
`/release-readiness` before any production promotion. Founder-only Vercel and
secret env vars stay with the owner.

## 5. Suggested order

1. Section 0 loose ends and section 1 stale-branch delete.
2. `/portfolio-ci-triage` and `/stale-pr-triage` for the PR and CI backlog.
3. Batch-merge safe Dependabot (codeql-action, patch bumps); review majors.
4. Fix the three recurring CI defects at source and audit fleet-wide.
5. Fleet voice resweep.
6. Website dep and security merges, then build and deploy verify, then content
   refresh.
