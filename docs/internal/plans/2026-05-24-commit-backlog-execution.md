---
type: canonical
source: writing-plans session 2026-05-24
sla: on-change
last_updated: 2026-05-24
audience: [ai-agents, contributors]
---

# Fleet Commit-Backlog Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to work this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Authorship gate (overrides the sub-skill):** The maintainer authors EVERY commit in this plan. An agent may run the read-only inspect and verify steps and may prepare staging, but MUST stop at `git commit` and hand the exact command to the maintainer. Never push, never open a PR, never merge without the maintainer's explicit go-ahead.

**Goal:** Move the entire staged fleet-audit backlog (the governance source-fix branch, roughly 20 SAFE-NOW branches, and the fleet-wide CLAUDE.md cleanup) out of uncommitted working trees into clean per-repo history, with the maintainer authoring every commit, so the program is ready for the gated rollout (Phases 2-5 of `2026-05-23-fleet-remediation.md`).

**Architecture:** One shared commit recipe (inspect, review the diff, stage by name, commit, verify) applied per repo. Repos are committed in waves: the governance keystone first (it is the source of the systemics and later phases depend on it), then tools, research, then products/ventures/family/personal, then other orgs. Most repos take two commits (the SAFE-NOW change, then a separate `docs:` commit for the CLAUDE.md em-dash or content cleanup). A handful of clean repos carry only a CLAUDE.md edit on `main` and need a branch created first.

**Tech Stack:** git per repo via `git -C <path>`; PowerShell 7 for the fleet snapshot; the `alawein/alawein` Python 3.12 governance gate (`validate.py`, `validate-doctrine.py`, `validate-doc-contract.sh`, `build-catalog.py`); per-project node/python test commands.

---

## Hard constraints (apply to every task)

1. The maintainer authors all commits. Agents inspect and prepare only, then stop at `git commit`.
2. Never `git add -A`, `git add .`, or `git commit -a`. Stage files by name, after inspecting `git status`.
3. Never push, force-push, open a PR, or merge in this plan. Pushing is a separate maintainer decision (Task 7). Check remotes first; some repos have multiple remotes.
4. No `.github/` edits in this plan. Every SAFE-NOW change here is non-`.github/`. CI adoption and `.github/` writes are gated Phases 2-4, out of scope here.
5. Never stage `.env`, secrets, or credential files. If you see one in `git status`, stop and flag it.
6. No em-dashes and no AI attribution in any commit message. American spelling.
7. In `alawein/alawein` only: any governed `.md` you touch must already have `last_updated` bumped to today (and `last-verified` on `SSOT.md`), or `validate-doc-contract.sh` fails. `docs/internal/` and `docs/archive/` are CI-exempt.
8. Dropbox-hosted tree: avoid recursive globs. All commands below are per-repo `git -C` calls, which are safe.

---

## The commit recipe (read once, reused everywhere)

Every repo task gives you four values: `PATH`, `BRANCH`, `SAFE` (the SAFE-NOW message), `DOCS` (the CLAUDE.md cleanup message). Substitute them into these commands. `<base>` is `C:\Users\mesha\Desktop\Dropbox\GitHub`.

### Recipe R: commit the SAFE-NOW change on an existing branch

- [ ] **R1 Inspect.** `git -C "PATH" status -sb` and `git -C "PATH" diff --stat`. Confirm `BRANCH` is checked out and the changed files match what the audit changed (the repo's SAFE-NOW set plus `CLAUDE.md`). If an unexpected file appears, stop and reconcile before staging.
- [ ] **R2 Review.** `git -C "PATH" diff -- <safe-now files>`. Confirm it is the intended change with no secrets, no em-dashes, no AI attribution.
- [ ] **R3 Stage by name.** `git -C "PATH" add -- <safe-now files>`. Stage every changed file EXCEPT `CLAUDE.md`. Do not stage `CLAUDE.md` in this commit.
- [ ] **R4 Commit (maintainer authors).** `git -C "PATH" commit -m "SAFE"`.
- [ ] **R5 Verify.** `git -C "PATH" log --oneline -1` shows your commit; `git -C "PATH" status -sb` now shows only `CLAUDE.md` remaining (handled by R-docs).

### Recipe R-branch: the change is on `main` with no branch yet

- [ ] **RB1** `git -C "PATH" switch -c BRANCH` (equivalent: `git checkout -b BRANCH`). Uncommitted changes carry onto the new branch.
- [ ] Then run R2 through R5.

### Recipe R-docs: the separate CLAUDE.md cleanup commit (same branch, after the SAFE-NOW commit)

- [ ] **RD1 Review.** `git -C "PATH" diff -- CLAUDE.md`. Confirm it is only the em-dash strip (and, for the few content-fix repos, the corrected product detail). Confirm it is the repo-root hand-authored `CLAUDE.md`, not a generated `.claude/CLAUDE.md` and not a test fixture.
- [ ] **RD2 Stage.** `git -C "PATH" add -- CLAUDE.md`.
- [ ] **RD3 Commit (maintainer authors).** `git -C "PATH" commit -m "DOCS"`.
- [ ] **RD4 Verify.** `git -C "PATH" status -sb` shows a clean working tree (or only intentional leftover WIP, noted per repo).

Default `DOCS` message: `docs: remove em-dashes from CLAUDE.md`. Three repos override it (veyra, gymboy, and any with a content fix) as noted in their rows.

---

## Repo ledger (master checklist)

`E` = branch already exists and is checked out. `C` = create the branch with R-branch. `docs` column: Y = run R-docs; left = intentionally left (see notes). Paths are relative to `<base>`.

| # | Repo | Path | Branch | SAFE-NOW message | docs | Status / note |
|---|---|---|---|---|---|---|
| keystone | alawein/alawein | `alawein\alawein` | E `chore/governance-cleanup` | see Task 2 (commit groups) | in-group | gate green; drifted from manifest, reconcile in Task 2 |
| tools | workspace-tools | `alawein\tools\workspace-tools` | E `fix/ci-green` | `fix(ci): add toolbox entrypoint and repoint e2e to python -m toolbox` | Y | VERIFIED 246 pass |
| tools | llmworks | `alawein\tools\llmworks` | E `fix/ci-green` | `fix(ci): restore vitest config` | Y | VERIFIED 310 pass |
| tools | incore | `alawein\tools\incore` | E `chore/cleanup` | `chore: clear ruff lint` | Y | VERIFIED 284 pass; do NOT touch the 2 test fixtures with em-dashes |
| tools | attributa | `alawein\tools\attributa` | E `fix/ci-green` | `fix(ci): regenerate lockfile and repair jest setup` | Y | PARTIAL: 106 type errors remain (decision deferred) |
| tools | design-system | `alawein\tools\design-system` | E `fix/ci-green` | `fix(ci): add NodeNext .js import extensions` | Y | PARTIAL: 2 app failures remain |
| tools | knowledge-base | `alawein\tools\knowledge-base` | WIP-first | (none from program) | maybe | dirty on `main` at scan; confirm WIP before any commit |
| tools | prompty | `alawein\tools\prompty` | WIP-first | (none from program) | maybe | dirty on `main` at scan; confirm WIP before any commit |
| research | alembiq | `alawein\research\alembiq` | E `fix/ci-green` | `docs: correct changelog naming and fill contributing command tokens` | Y | VERIFIED 197 pass; CI red is a separate cross-OS lockfile (gated) |
| research | chshlab | `alawein\research\chshlab` | E `chore/cleanup` | `docs: fill CONTRIBUTING command placeholders` | Y | VERIFIED 154 pass |
| research | fallax | `alawein\research\fallax` | E `chore/cleanup` | `docs: populate website benchmark table and fix changelog ordering` | Y | VERIFIED 400 pass |
| research | maglogic | `alawein\research\maglogic` | E `chore/cleanup` | `chore: clear ruff errors and add ruff config` | Y | VERIFIED 241 pass, ruff 0 |
| research | qmatsim | `alawein\research\qmatsim` | E `chore/cleanup` | `chore: clear ruff lint and de-dup gitignore` | Y | VERIFIED 220 pass, ruff 0 |
| research | qmlab | `alawein\research\qmlab` | E `chore/cleanup` | `chore(meta): mark repo status frozen to match README/SSOT` | Y | DOC only |
| research | meatheadphysicist | `alawein\research\meatheadphysicist` | E `chore/cleanup` | `chore: remove corrupted restructure script, sort imports, fix paper.tex doc path` | Y | VERIFIED static (ruff 504->316, compile clean) |
| research | qubeml | `alawein\research\qubeml` | E `chore/cleanup` | `chore: remove unused imports and dead assignment` | Y | VERIFIED 98 pass, ruff 0 |
| research | scicomp | `alawein\research\scicomp` | E `chore/cleanup` | `chore: gitignore setuptools_scm _version.py and quiet banner during pytest collection` | Y | PARTIAL: unblocks single-file pytest; full green needs the two-conftest decision |
| research | spincirc | `alawein\research\spincirc` | E `chore/cleanup` | `chore: remove unused imports flagged by ruff (F401)` | Y | VERIFIED 126 pass |
| research | quantumalgo | `alawein\research\quantumalgo` | C `docs/claude-md-cleanup` | (none from program) | Y | green; `drift.yml` bug is Phase 5 and gated |
| research | simcore | `alawein\research\simcore` | C `docs/claude-md-cleanup` | (none from program) | Y | green React app |
| research | edfp | `alawein\research\edfp` | C `docs/claude-md-cleanup` | (none from program) | Y | WIP: `.claude/settings.json` tracked+modified; commit ONLY CLAUDE.md, leave settings.json |
| research | optiqap | `alawein\research\optiqap` | WIP-first | (none from program) | maybe | open PR #12, `main` red; reconcile PR before touching; then optional R-docs |
| research | helios | `alawein\research\helios` | C `docs/claude-md-cleanup` | (none from program) | Y | docs archive, no code |
| products | gymboy | `alawein\products\gymboy` | E `fix/ci-green` | `fix: clear lint and type errors blocking CI build` | Y* | VERIFIED 382 pass; *DOCS = `docs: correct platform to Vercel and remove em-dashes in CLAUDE.md` |
| products | repz | `alawein\products\repz` | C `fix/ci-green` | `fix(deps): resync package-lock.json so npm ci passes` | Y | PARTIAL: 157 type errors remain (decision deferred); both edits are on `main`, branch first |
| products | bolts | `alawein\products\bolts` | C `docs/claude-md-cleanup` | (none from program) | Y | open decision: historical `sk_live` rotation (separate, not committed here) |
| products | scribd | `alawein\products\scribd` | C `docs/claude-md-cleanup` | (none from program) | Y | green; doc rewrites and security headers are separate decisions |
| ventures | veyra | `alawein\ventures\veyra` | E `docs/refresh-claude-md` | (none; CLAUDE.md content fix only) | Y* | exemplary; *DOCS = `docs: correct phase and test count and remove em-dashes in CLAUDE.md` |
| ventures | adil | `alawein\ventures\adil` | C `docs/claude-md-cleanup` | (none from program) | Y | green, already clean. Use `ventures\adil`; the loose `alawein\adil` dir is NOT a repo |
| ventures | loopholelab | `alawein\ventures\loopholelab` | E `chore/cleanup` | `chore: remove unused imports in validate route` | Y | VERIFIED 108 pass |
| ventures | provegate | `alawein\ventures\provegate` | E `fix/ci-green` | `fix: unblock mypy and clear type errors in drift/proof servers` | Y | PARTIAL: full green needs per-file mypy in ci.yml (gated); commit only the type fixes |
| family | atelier-rounaq | `alawein\family\atelier-rounaq` | E `fix/ci-green` | `fix: repair broken build (design-system route + home-page import) and remove dead mining theme` | Y | PARTIAL: type-check needs orphaned-module decision; `autonomous.yml` is a separate decision |
| personal | meshal-web | `alawein\personal\meshal-web` | E `chore/cleanup` | `chore: correct Extender root path and clarify src/lib README comment` | Y | DOC (CI already green); the `Now.tsx` Lean 4 claim is a separate decision |
| personal | roka-oakland-hustle | `alawein\personal\roka-oakland-hustle` | E `chore/cleanup` | `chore: repoint phantom validate_data.py, fix license + qa-lock ignore, repair parking_puzzle indentation` | Y | PARTIAL (1 of 6 Godot errors). Set git identity FIRST (Task 1) |
| other | blackmalejournal | `blackmalejournal\blackmalejournal` | E `fix/ci-green` | `fix(deps): bump next to 16.2.6 and pin fast-uri to clear high-severity advisories` | left | VERIFIED 1246 pass; em-dashes intentionally left (other-org, ungoverned) |
| other | menax | `menax-inc\menax` | WIP-first | (none from program) | left | 19 dirty files = real WIP; no program commit; em-dashes left |
| other | kohyr-internal-wip | `kohyr\kohyr-internal-wip` | audit-only | (none from program) | left | CI dark org-wide; no program commit; em-dashes left |

Repos with NO action here (clean, handout-only, nothing staged): none beyond the rows above. Tooling dirs that are not audited repos and are skipped: `alawein\tools\claude-templates`, `alawein\tools\inventory`, `alawein\tools\packages`, `alawein\adil` (stray non-repo dir).

---

## Task 0: Pre-flight and fleet state snapshot

**Files:** none (read-only). Safe for an agent to run unattended.

- [ ] **Step 1: Confirm the constraints are loaded.** Re-read the Hard constraints block above. The single most important one: you stage and prepare, the maintainer commits.

- [ ] **Step 2: Snapshot every repo's branch and dirty count.** Run this in PowerShell from any directory:

```powershell
$base = 'C:\Users\mesha\Desktop\Dropbox\GitHub'
$repos = @(
  'alawein\alawein',
  'alawein\tools\workspace-tools','alawein\tools\llmworks','alawein\tools\incore','alawein\tools\attributa','alawein\tools\design-system','alawein\tools\knowledge-base','alawein\tools\prompty',
  'alawein\research\alembiq','alawein\research\chshlab','alawein\research\fallax','alawein\research\maglogic','alawein\research\qmatsim','alawein\research\qmlab','alawein\research\meatheadphysicist','alawein\research\qubeml','alawein\research\scicomp','alawein\research\spincirc','alawein\research\quantumalgo','alawein\research\simcore','alawein\research\edfp','alawein\research\optiqap','alawein\research\helios',
  'alawein\products\gymboy','alawein\products\repz','alawein\products\bolts','alawein\products\scribd',
  'alawein\ventures\veyra','alawein\ventures\adil','alawein\ventures\loopholelab','alawein\ventures\provegate',
  'alawein\family\atelier-rounaq','alawein\personal\meshal-web','alawein\personal\roka-oakland-hustle',
  'blackmalejournal\blackmalejournal','menax-inc\menax','kohyr\kohyr-internal-wip'
)
foreach ($r in $repos) {
  $p = Join-Path $base $r
  if (Test-Path "$p\.git") {
    $br = (git -C $p rev-parse --abbrev-ref HEAD 2>$null)
    $dirty = (git -C $p status --porcelain 2>$null | Measure-Object -Line).Lines
    "{0,-42} {1,-24} dirty={2}" -f $r, $br, $dirty
  } else { "{0,-42} (no .git)" -f $r }
}
```

Expected: each repo prints its branch and a nonzero `dirty` count. Compare against the ledger. If a repo is on an unexpected branch or `dirty=0`, the maintainer may have already committed it; reconcile before acting on that repo.

- [ ] **Step 3: Confirm nothing was pushed by surprise.** For the governance repo: `git -C "$base\alawein\alawein" status -sb`. Expected first line `## chore/governance-cleanup` with no `[ahead N]` against a remote you did not intend. Branches are local until Task 7.

---

## Task 1: Setup (identities and branch the on-main edits)

**Files:** git config for one repo; new branches created via R-branch (no file edits).

- [ ] **Step 1: Fix the roka-oakland-hustle commit identity.** That clone shows a placeholder author (`Test <test@test.local>`), which would land in commit metadata. Set it before committing that repo:

```powershell
$roka = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\personal\roka-oakland-hustle'
git -C $roka config user.email 'meshal@kohyr.com'
git -C $roka config user.name 'Meshal'   # match the name you use in your other repos
git -C $roka config user.email           # verify it now prints meshal@kohyr.com
```

- [ ] **Step 2: Note the "create a branch first" repos.** These carry program edits on `main` with no branch. They are handled in their bucket tasks with R-branch (do not create them all now; create each at its task so the working changes are fresh): quantumalgo, simcore, edfp, helios (research); repz, bolts, scribd (products); adil (ventures). Branch name `docs/claude-md-cleanup` for the docs-only ones; `fix/ci-green` for repz.

- [ ] **Step 3: Note the WIP-first repos.** These were dirty with the maintainer's own work at scan time. Do NOT `git add -A` here. The maintainer commits or stashes their own WIP first, then optionally applies the audit handout's deferred items: knowledge-base, prompty (tools); optiqap, edfp (research); menax (other org). For these, the only possible program commit is a separable CLAUDE.md docs edit, and only if it is cleanly isolated from the WIP.

- [ ] **Step 4: Confirm the no-commit other-org repos.** menax and kohyr-internal-wip get no program commit. Their CLAUDE.md em-dashes were intentionally left (ungoverned by alawein VOICE.md). blackmalejournal gets only its SAFE-NOW commit (also no docs commit, em-dashes left).

---

## Task 2: Governance keystone (alawein/alawein)

This is the source repo for the systemics and later phases depend on it, so commit it first. Path `<base>\alawein\alawein`, branch `chore/governance-cleanup` (already checked out). The working tree has drifted from the manifest: a catalog commit (`d6f4d5e1 fix(catalog): correct ... 5 repos`) already landed on the branch, so commit only what remains uncommitted.

**Two preconditions to resolve before committing (both found in `git status`):**

1. **Two version-coherence files, BOTH intentional (resolved 2026-05-24).** `scripts/doctrine/version_coherence.py` (underscore, 13 lines) is an import shim whose own docstring reads "tests import this module; CLI uses the hyphenated name"; its last line is `globals().update(... vars(_m) ...)`, which re-exports the real module. `scripts/doctrine/version-coherence.py` (hyphen, 249 lines) is the actual CLI module. The test does `import version_coherence as vc` (the shim). Commit BOTH in C2. Do NOT delete either.
2. **Two script edits not in the original manifest split, BOTH in-scope (resolved 2026-05-24).** `scripts/catalog/sync-readme.py` changes the profile link key `"morphism"` to `"kohyr"` (dead-brand removal); group it with C4 (catalog). `scripts/ops/generate-arch-diagram.py` fixes flat script paths (`scripts/generate-arch-diagram.py` to `scripts/ops/...`) and strips em-dashes from its docstring and comments; group it with C3 (docs). Neither is stray; do not discard.

- [ ] **Step 1: Inspect and gate.** Run:

```powershell
$g = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\alawein'
git -C $g status --porcelain=v1
```

Then run the repo gate and confirm it is green before you commit anything:

```powershell
py -3.12 "$g\scripts\doctrine\validate.py" --ci
py -3.12 "$g\scripts\doctrine\validate-doctrine.py" "$g"
bash -lc "cd '$g' && ./scripts/doctrine/validate-doc-contract.sh --full"
py -3.12 "$g\scripts\catalog\build-catalog.py" --check
```

Expected: validate PASS on tracked files, catalog `--check` clean, doc-contract PASS (every governed `.md` already has `last_updated` bumped). The known `HANDOFF.md` R1 finding is a working-tree-only false positive (it is gitignored; CI does not see it). If a real failure appears, fix the classification boundary in the validator, do not silence generated output.

- [ ] **Step 2: Choose your commit grouping.** Two equivalent options:

  - **Option A (clean 7-commit history, more effort):** use `git -C "$g" add -p <file>` to split hunks for the files that carry more than one logical change (`docs/style/VOICE.md`, `scripts/doctrine/validate.py`, `scripts/doctrine/validate-doctrine.py`, `docs/governance/docs-doctrine.md`, `prompt-kits/AGENT.md`, `prompt-kits/PORTFOLIO.md`) and map each hunk to its commit per the manifest's split. `git add -p` is interactive and is safe for the maintainer to run by hand.
  - **Option B (recommended, no hunk-splitting):** each file lands in exactly one commit, six commits total. This preserves the manifest's intent without interactive staging. Use the mapping below.

- [ ] **Step 3: Stage and commit each group (Option B).** Stage only the listed files for each, then commit. Do not `git add -A`.

  **C1** `fix: correct scaffold doctrine path and service-metadata link`
  - `scripts/ops/bootstrap-repo.sh`, `service-metadata.yaml`

  **C2** `feat(doctrine): enforce em-dash ban, residual-placeholder, and version-coherence checks`
  - `docs/style/VOICE.md`, `scripts/doctrine/validate.py`, `scripts/doctrine/validate-doctrine.py`, `templates/scaffolding/README.product.md`
  - `scripts/doctrine/version_coherence.py` AND `scripts/doctrine/version-coherence.py` (both intentional: the import shim plus the CLI module; see precondition 1)
  - `scripts/doctrine/tests/test_validate_doctrine.py`, `scripts/doctrine/tests/test_validate_style.py`, `scripts/doctrine/tests/test_version_coherence.py`

  **C3** `docs: fix stale script and layout paths, remove dead-brand, state version SSOT, strip em-dashes`
  - `SSOT.md`, `CONTRIBUTING.md`, `docs/architecture.md`, `docs/onboarding.md`, `docs/governance/docs-doctrine.md`, `.cursor/rules.md`
  - `prompt-kits/AGENT.md`, `prompt-kits/PORTFOLIO.md`, `prompt-kits/KITS-CHANGELOG.md`, `prompt-kits/registry.yaml`
  - `profile-from-guides.yaml`, `templates/README.md`, `CLAUDE.md`, `AGENTS.md`, `scripts/ops/generate-arch-diagram.py`

  **C4** `fix(catalog): correct loopholelab stack, archive morphism, regenerate outputs`
  - `catalog/repos.json`, `catalog/components.json`, `catalog/generated/discovery-feed.json`, `catalog/generated/github-metadata.json`, `catalog/generated/repo-switcher.json`
  - `projects.json`, `README.md` (generated, do not hand-edit), `docs/archive/desktop-repo-inventory.json`, `scripts/catalog/sync-readme.py`

  **C5** `feat(extender): make repo-scanner registry-aware for bucketed Root and commands`
  - `claude-agent-platform/bin/repo-scanner.sh`, `claude-agent-platform/bin/generate-local-claude.sh`, `claude-agent-platform/global/CLAUDE.md`, `claude-agent-platform/bin/tests/`

  **C6** `docs(plans): add fleet remediation plan, commit manifest, program report, and handoffs`
  - `docs/internal/plans/2026-05-23-fleet-remediation.md`, `docs/internal/plans/2026-05-23-fleet-commit-manifest.md`, `docs/internal/plans/2026-05-23-fleet-program-report.md`, `docs/internal/plans/2026-05-24-session-handoff.md`, `docs/internal/plans/2026-05-24-commit-backlog-execution.md` (this plan)

  Example for C1 (the maintainer runs the commit):

```powershell
$g = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\alawein'
git -C $g add -- scripts/ops/bootstrap-repo.sh service-metadata.yaml
git -C $g diff --cached --stat
git -C $g commit -m "fix: correct scaffold doctrine path and service-metadata link"
```

- [ ] **Step 4: Verify the keystone.** `git -C "$g" status --porcelain=v1` is empty (clean tree). `git -C "$g" log --oneline -8` shows your new commits on top of `d6f4d5e1`. Re-run the gate from Step 1; expected still green. The CLAUDE.md em-dash strip for this repo was folded into C3, so there is no separate R-docs commit here.

---

## Task 3: tools/

For each repo below: confirm the branch with R1, commit the SAFE-NOW set with R (Recipe R), then the CLAUDE.md cleanup with R-docs. Optional re-verify uses the repo's own test command (the audit already verified the VERIFIED rows; do not treat the known PARTIAL residuals as regressions).

- [ ] **workspace-tools**
```
PATH = C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\tools\workspace-tools
BRANCH = fix/ci-green (E)
SAFE = fix(ci): add toolbox entrypoint and repoint e2e to python -m toolbox
DOCS = docs: remove em-dashes from CLAUDE.md
```
Run R then R-docs. Optional verify: `pytest` (expected 246 pass).

- [ ] **llmworks**
```
PATH = C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\tools\llmworks
BRANCH = fix/ci-green (E)
SAFE = fix(ci): restore vitest config
DOCS = docs: remove em-dashes from CLAUDE.md
```
Run R then R-docs. Optional verify: `npm test` (expected 310 pass).

- [ ] **incore**
```
PATH = C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\tools\incore
BRANCH = chore/cleanup (E)
SAFE = chore: clear ruff lint
DOCS = docs: remove em-dashes from CLAUDE.md
```
Run R then R-docs. In RD1, confirm you are staging only the repo-root `CLAUDE.md`. Do NOT stage `tests/fixtures/workspace-mini/repo-*/CLAUDE.md` (those em-dashes are intentional test data). Optional verify: `pytest` (expected 284 pass), `ruff check .` (expected 0).

- [ ] **attributa**
```
PATH = C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\tools\attributa
BRANCH = fix/ci-green (E)
SAFE = fix(ci): regenerate lockfile and repair jest setup
DOCS = docs: remove em-dashes from CLAUDE.md
```
Run R then R-docs. PARTIAL: 106 type errors remain by design (decision deferred); a type-check run will still report them. That is expected, not a regression.

- [ ] **design-system**
```
PATH = C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\tools\design-system
BRANCH = fix/ci-green (E)
SAFE = fix(ci): add NodeNext .js import extensions
DOCS = docs: remove em-dashes from CLAUDE.md
```
Run R then R-docs. PARTIAL: 2 app failures remain. Note the build order (`@alawein/tokens` builds before downstream); a full `npm run build` is optional here since the change is import-extension only.

- [ ] **knowledge-base and prompty (WIP-first).** Run R1 only. If the tree still shows the maintainer's own WIP, stop: commit or stash that WIP yourself first. If a CLAUDE.md em-dash edit is present and cleanly separable, branch `docs/claude-md-cleanup` (R-branch) and commit only `CLAUDE.md` (R-docs). Otherwise defer to a later pass. Do not blanket-add.

---

## Task 4: research/

Same pattern (R then R-docs) for the rows with an existing branch. The four "create a branch" rows use R-branch first. The CLAUDE.md-only rows have no SAFE-NOW commit (skip R, run R-branch then R-docs).

- [ ] **alembiq**
```
PATH = ...\alawein\research\alembiq
BRANCH = fix/ci-green (E)
SAFE = docs: correct changelog naming and fill contributing command tokens
DOCS = docs: remove em-dashes from CLAUDE.md
```
R then R-docs. CI red is a separate cross-OS lockfile issue (gated on Linux), not affected by this commit.

- [ ] **chshlab** `chore/cleanup` (E). SAFE `docs: fill CONTRIBUTING command placeholders`. DOCS default. R then R-docs. Verify: 154 pass.
- [ ] **fallax** `chore/cleanup` (E). SAFE `docs: populate website benchmark table and fix changelog ordering`. DOCS default. R then R-docs. Verify: 400 pass.
- [ ] **maglogic** `chore/cleanup` (E). SAFE `chore: clear ruff errors and add ruff config`. DOCS default. R then R-docs. Verify: 241 pass, ruff 0.
- [ ] **qmatsim** `chore/cleanup` (E). SAFE `chore: clear ruff lint and de-dup gitignore`. DOCS default. R then R-docs. Verify: 220 pass, ruff 0. (Heavy `siesta/bin` artifacts are a separate Phase 5 item, gated.)
- [ ] **qmlab** `chore/cleanup` (E). SAFE `chore(meta): mark repo status frozen to match README/SSOT`. DOCS default. R then R-docs. DOC-only change.
- [ ] **meatheadphysicist** `chore/cleanup` (E). SAFE `chore: remove corrupted restructure script, sort imports, fix paper.tex doc path`. DOCS default. R then R-docs.
- [ ] **qubeml** `chore/cleanup` (E). SAFE `chore: remove unused imports and dead assignment`. DOCS default. R then R-docs. Verify: 98 pass, ruff 0.
- [ ] **scicomp** `chore/cleanup` (E). SAFE `chore: gitignore setuptools_scm _version.py and quiet banner during pytest collection`. DOCS default. R then R-docs. PARTIAL: unblocks single-file pytest; full green needs the two-conftest decision (deferred). Do not expect a fully green suite yet.
- [ ] **spincirc** `chore/cleanup` (E). SAFE `chore: remove unused imports flagged by ruff (F401)`. DOCS default. R then R-docs. Verify: 126 pass. (The phantom-dep install fix is Phase 2 Task 2.1, separate.)

- [ ] **quantumalgo** R-branch `docs/claude-md-cleanup`, then R-docs only (no SAFE-NOW). The `drift.yml` secrets-in-if bug is Phase 5 and touches `.github/` (gated), not here.
- [ ] **simcore** R-branch `docs/claude-md-cleanup`, then R-docs only. (The wrong-product `docs/overview.md` rewrite is Phase 5, separate.)
- [ ] **edfp** R-branch `docs/claude-md-cleanup`, then R-docs only. CAREFUL: `.claude/settings.json` is tracked and modified (maintainer WIP). In RD2 stage ONLY `CLAUDE.md`; leave `settings.json` uncommitted for the maintainer.
- [ ] **helios** R-branch `docs/claude-md-cleanup`, then R-docs only. Docs archive, no code.
- [ ] **optiqap (WIP-first).** Do not branch yet. The repo has open PR #12 and a red `main`. The maintainer reconciles the PR first. Only afterward, if a separable CLAUDE.md em-dash edit remains, R-branch `docs/claude-md-cleanup` + R-docs. The 343-file `docs/archive` residue is Phase 5 (gated).

---

## Task 5: products / ventures / family / personal

- [ ] **gymboy** (products)
```
PATH = ...\alawein\products\gymboy
BRANCH = fix/ci-green (E)
SAFE = fix: clear lint and type errors blocking CI build
DOCS = docs: correct platform to Vercel and remove em-dashes in CLAUDE.md
```
R then R-docs. The DOCS commit also fixes the wrong "GitHub Spark" platform claim (this repo ships on Vercel). Verify: lint 0, type 0, build ok, 382 pass.

- [ ] **repz** (products) R-branch first (both edits are on `main`):
```
PATH = ...\alawein\products\repz
BRANCH = fix/ci-green (C, create with R-branch)
SAFE = fix(deps): resync package-lock.json so npm ci passes   # stage: package-lock.json (and package.json if changed)
DOCS = docs: remove em-dashes from CLAUDE.md
```
R-branch, then R (SAFE), then R-docs. PARTIAL: 157 type errors remain by design (decision deferred). Security headers are a separate decision.

- [ ] **bolts** (products) R-branch `docs/claude-md-cleanup`, then R-docs only. The historical `sk_live` rotation and possible history scrub are an open decision handled separately, never committed here.
- [ ] **scribd** (products) R-branch `docs/claude-md-cleanup`, then R-docs only. Doc rewrites and the missing `DOWNLOAD_TOKEN_SECRET` in `.env.example` are separate decisions.

- [ ] **veyra** (ventures)
```
PATH = ...\alawein\ventures\veyra
BRANCH = docs/refresh-claude-md (E, already created)
SAFE = (none; this branch carries only the CLAUDE.md content fix)
DOCS = docs: correct phase and test count and remove em-dashes in CLAUDE.md
```
Run R-docs only. The DOCS commit corrects the stale "Phase 1 / 53 tests / Stub" to the real "Phase 2 / 100 tests / built and tested". Exemplary repo; only the doc PR.

- [ ] **adil** (ventures) R-branch `docs/claude-md-cleanup`, then R-docs only. Use `ventures\adil` (the loose `alawein\adil` directory is not a git repo).
- [ ] **loopholelab** (ventures) `chore/cleanup` (E). SAFE `chore: remove unused imports in validate route`. DOCS default. R then R-docs. Verify: 108 pass.
- [ ] **provegate** (ventures) `fix/ci-green` (E). SAFE `fix: unblock mypy and clear type errors in drift/proof servers`. DOCS default. R then R-docs. In R3 stage only the server type fixes; do NOT stage `ci.yml` (per-file mypy is gated). PARTIAL until that gated change lands.

- [ ] **atelier-rounaq** (family) `fix/ci-green` (E). SAFE `fix: repair broken build (design-system route + home-page import) and remove dead mining theme`. DOCS default. R then R-docs. PARTIAL: type-check needs an orphaned-module decision. Do NOT touch `.github/workflows/autonomous.yml` (the self-committing workflow is an open decision).

- [ ] **meshal-web** (personal) `chore/cleanup` (E). SAFE `chore: correct Extender root path and clarify src/lib README comment`. DOCS default. R then R-docs. CI already green. The `Now.tsx` "Kohyr v0.3 Lean 4" claim is an open decision, not committed here.

- [ ] **roka-oakland-hustle** (personal) `chore/cleanup` (E). SAFE `chore: repoint phantom validate_data.py, fix license + qa-lock ignore, repair parking_puzzle indentation`. DOCS default. CONFIRM the git identity from Task 1 Step 1 is set (`git -C <path> config user.email` prints `meshal@kohyr.com`) BEFORE committing. R then R-docs. PARTIAL: 1 of 6 Godot errors fixed.

---

## Task 6: Other orgs

- [ ] **blackmalejournal** (`blackmalejournal\blackmalejournal`) `fix/ci-green` (E). SAFE `fix(deps): bump next to 16.2.6 and pin fast-uri to clear high-severity advisories`. NO R-docs (em-dashes intentionally left; ungoverned by alawein VOICE.md). Run R only. Verify: 1246 pass, audit clean.
- [ ] **menax** (`menax-inc\menax`) No program commit. 19 dirty files are the maintainer's real WIP (preserved byte-for-byte). The maintainer commits their own WIP per menax conventions (`npm run test` is vitest). The audit handout's deferred items are optional follow-ups. Em-dashes left.
- [ ] **kohyr-internal-wip** (`kohyr\kohyr-internal-wip`) No program commit. Conservative by design; CI is dark org-wide (a `kohyr-app` org Actions/billing policy, not a YAML defect). Em-dashes left.

---

## Task 7: Wrap-up and handoff to the gated rollout

- [ ] **Step 1: Re-snapshot.** Re-run the Task 0 Step 2 script. Expected: every committed repo now shows `dirty=0` (except the intentional leftovers: edfp `settings.json`, the WIP-first repos, menax). Branches match the ledger.

- [ ] **Step 2: Decide push, PR, or merge per repo (maintainer).** This plan does not push. For each repo, follow its release model: research repos use a dated CHANGELOG entry plus a PR (no tags); products and ventures may use semver tags. Check remotes first (`git -C <path> remote -v`); some repos have more than one. For `alawein/alawein`, open the governance PR for review.

- [ ] **Step 3: Update the program record.** In `alawein/alawein/docs/internal/plans/2026-05-24-session-handoff.md`, change the "State by phase" so the commit backlog reads as done, and note which repos are committed versus still pending a maintainer decision. Bump nothing else (this file is in the CI-exempt `docs/internal/`).

- [ ] **Step 4: Update cross-session memory.** Edit `C:\Users\mesha\.claude\projects\C--Users-mesha-Desktop-Dropbox-GitHub\memory\project_fleet_remediation.md` so the "Remaining" line drops item (1) commit-the-backlog once it is done, leaving the gated rollout (Phases 2-5) and catalog follow-ups.

- [ ] **Step 5: Hand off to the gated rollout.** The remaining program work is already planned task-by-task in `docs/internal/plans/2026-05-23-fleet-remediation.md`. Do not duplicate it. Proceed in this order, confirming the gating decisions first:
  - **Confirm open decisions** before the phases that depend on them: bolts `sk_live` rotation and history scrub; meshal-web Lean 4 claim; atelier-rounaq `autonomous.yml`; repz/scribd/bolts security headers; the version-anchor model (tag + CHANGELOG).
  - **Phase 2 (CI adoption):** land the four pre-req SAFE-NOW repos first (scicomp, spincirc, maglogic, qmatsim) so the new gate is not born red, then `github-baseline.yaml` Task 2.2 and the gated `sync-github.sh --all`.
  - **Phase 3.2/3.3 (Extender):** mirror the now-committed registry-aware Extender to `~/.claude/bin/` (confirm byte-identical first), then regenerate `.claude/CLAUDE.md` fleet-wide.
  - **Phase 4 (doctrine repins):** repin helios/optiqap and any repo on a stale `doctrine-reusable.yml` SHA (gated, `.github/`).
  - **Phase 5 (downstream sweep):** per-repo deferred items from each handout (stub docs, `drift.yml` secrets-in-if, maturity classifiers, hallucinated docs, heavy artifacts).

---

## Self-review

- **Coverage.** Every repo with staged program work in the commit manifest and the session handoff has a ledger row and a task: the governance keystone (Task 2), the SAFE-NOW branches (Tasks 3-6), the CLAUDE.md-on-main repos branched via R-branch (Task 1 Step 2, executed in their buckets), the WIP-first repos (Task 1 Step 3), and the no-commit other-orgs (Task 6). The gated rollout is referenced, not duplicated (Task 7 Step 5).
- **Drift handled.** Task 2 reconciles the already-committed `d6f4d5e1` catalog commit, the `version_coherence.py` versus `version-coherence.py` duplicate, and the two unplanned script edits (`generate-arch-diagram.py`, `sync-readme.py`) instead of assuming the manifest snapshot is current.
- **Constraint check.** The maintainer authors every commit (authorship gate in the header and Recipe R4/RD3). No task stages with `git add -A`; staging is by name after inspection. No task touches `.github/` (CI, `drift.yml`, `autonomous.yml` all deferred to gated phases). No em-dashes or AI attribution in any suggested message. roka identity is fixed before its commit.
- **No placeholders.** Every row has an exact path, branch, and commit message; the recipe gives exact commands; the snapshot script is runnable as written. The only deliberately open items are the WIP-first repos (knowledge-base, prompty, optiqap, menax), which require live maintainer judgment and are flagged as such rather than guessed.
- **Type/name consistency.** Branch names match the manifest and handoff (`fix/ci-green`, `chore/cleanup`, `docs/refresh-claude-md` for veyra, `docs/claude-md-cleanup` for the new docs branches). The recipe names (R, R-branch, R-docs) are used consistently in every task.
