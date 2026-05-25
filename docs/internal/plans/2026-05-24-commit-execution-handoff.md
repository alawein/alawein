---
type: canonical
source: executing-plans session 2026-05-24
sla: on-change
last_updated: 2026-05-24
audience: [ai-agents, contributors]
---

# Session handoff (2026-05-24, commit-execution session)

Latest resume point for the fleet program. This is the successor to the same-day audit handoff (`2026-05-24-session-handoff.md`): that one records the end of the audit phase, this one records the commit-execution phase and is what the next session should act on. This session created the commit-backlog execution plan and drove the backlog wave by wave, handing the maintainer exact, live-verified `git add` + `git commit` commands for every repo. The maintainer authors all commits; this session committed nothing.

## Re-snapshot first (state drifts during a session)

The maintainer commits in parallel, so live state moves. Observed this session: the governance branch had already gained a catalog commit (`d6f4d5e1`), and `kohyr-internal-wip` went from dirty to clean mid-session. Before acting, re-run the fleet snapshot (Task 0 of `2026-05-24-commit-backlog-execution.md`) and trust it over any file list captured here. The Appendix blocks are accurate as of 2026-05-24 but must be re-verified against live `git status` per repo.

## What this session produced

- `docs/internal/plans/2026-05-24-commit-backlog-execution.md`: the bite-sized commit plan (recipe R / R-branch / R-docs, a 37-row repo ledger, Tasks 0-7). It references Phases 2-5 of the remediation plan instead of duplicating them.
- Live inspection of all 36 repos plus a verified keystone gate.
- Exact `git add` + `git commit` blocks for every repo (Appendix), with per-repo corrections the manifest alone did not capture.
- Two corrections to the plan itself (the version-coherence files and the two unplanned scripts; see below).

## Verified this session

- Keystone `alawein/alawein` gate is green: `validate.py --ci` reports no violations, `build-catalog.py --check` is up to date, 130 doctrine tests pass (includes the new style and version-coherence tests).
- The execution plan and this handoff are em-dash free.
- Every repo's actual change set was reconciled against the manifest; the deltas are recorded below.

## Keystone grouping (alawein/alawein), corrected

Six commits (Option B, each file in exactly one commit, no hunk splitting) on `chore/governance-cleanup`, on top of the already-committed `d6f4d5e1`. Two corrections from the original plan:

1. BOTH version-coherence files are intentional and both get committed in C2. `version_coherence.py` (underscore, 13 lines) is an import shim ending in `globals().update(... vars(_m) ...)` that re-exports; `version-coherence.py` (hyphen, 249 lines) is the CLI module the test loads through the shim. Do not delete either.
2. The two scripts not in the manifest split are in-scope: `scripts/catalog/sync-readme.py` (changes the profile link key `morphism` to `kohyr`, dead-brand removal, group with C4) and `scripts/ops/generate-arch-diagram.py` (flat-path fixes plus em-dash strips, group with C3).

## State by wave, with the deltas found

- **Wave 1 keystone (alawein/alawein):** 6-commit grouping above; gate verified green. C6 includes the four prior plan docs plus the new execution plan. This handoff is a new untracked doc to add to that commit (or a follow-up `docs(plans):` commit if C6 already ran).
- **Wave 2 tools:** blocks for workspace-tools, llmworks, incore, attributa, design-system. Deltas: workspace-tools excludes `workspace_batch.egg-info/` (build output) and its docs commit covers root + `mcps/docs/CLAUDE.md`; design-system docs commit covers root + `sync/CLAUDE.md`; incore has NO docs commit (CLAUDE.md unchanged, fixtures intentionally keep em-dashes); knowledge-base (64-file resume/CV WIP) and prompty (no program change) are WIP-first with no program commit.
- **Wave 3 research:** blocks for 10 SAFE-NOW branches plus 4 branch-and-docs (quantumalgo, simcore, edfp, helios on new `docs/claude-md-cleanup`). Deltas: fallax has NO docs commit and excludes `.superpowers/`; scicomp SAFE-NOW includes the new `tests/conftest.py`; meatheadphysicist is 86 files via `git add -- . ':(exclude)CLAUDE.md'` (includes a staged `scripts/restructure.py` deletion); edfp commits only CLAUDE.md (leave `.claude/settings.json` WIP); optiqap is WIP-first on `feature/web-playground` (PR 12), only program change is CLAUDE.md, and its untracked `papers/*` are heavy build artifacts to gitignore.
- **Wave 4 products / ventures / family / personal:** all blocks. Deltas: roka identity must be set first and its `validate_data.py` repoint lives in AGENTS/CONTRIBUTING/SSOT (SAFE-NOW), license in package.json, qa-lock in .gitignore, indentation in the `.gd`; meshal-web SAFE-NOW is the tracked `.claude/CLAUDE.md` Extender-root-path fix plus README; veyra excludes `.claude/agent-memory/`; provegate and atelier carry already-staged deletions; repz branches `fix/ci-green` first.
- **Wave 5 other orgs:** blackmalejournal one SAFE-NOW commit (`package.json` + `package-lock.json`), no docs commit; menax no program commit (19-file WIP); kohyr-internal-wip clean, no program commit.

## Remaining (maintainer-gated, in order)

1. Finish running the commit blocks (Waves 1-5). Re-snapshot to confirm clean trees, allowing for the intentional WIP leftovers: edfp `.claude/settings.json`, knowledge-base, prompty, menax, optiqap.
2. Push or open PRs per each repo's release model (research = dated CHANGELOG entry + PR, no tags; products and ventures = semver tags allowed). Check `git -C <path> remote -v` first; some repos have multiple remotes.
3. Gated rollout = remediation plan Phases 2-5: land the four CI pre-reqs first (scicomp, spincirc, maglogic, qmatsim), then `github-baseline.yaml` + `sync-github.sh --all`; mirror the registry-aware Extender to `~/.claude/bin/` and regenerate `.claude/CLAUDE.md` fleet-wide; repin helios/optiqap doctrine SHAs; per-repo downstream sweep.
4. Confirm the open decisions (below) before the phases that depend on them. Then update this handoff and the memory to mark the backlog committed.

## Open decisions to confirm

bolts historical `sk_live` rotation and possible history scrub; meshal-web `Now.tsx` Lean 4 claim vs Python/SymPy reality; atelier `autonomous.yml` self-commit workflow; missing security headers on repz/scribd/bolts; the version-anchor model (tag + CHANGELOG). None are touched by the commits above.

## Excluded-artifact cleanup backlog (gitignore, never commit)

- workspace-tools: `*.egg-info/` (saw `workspace_batch.egg-info/`)
- fallax: `.superpowers/`
- veyra: `.claude/agent-memory/`
- optiqap: `papers/*.tar.gz`, `papers/*.pdf`, `papers/*.aux`/`.bbl`/`.blg`/`.out`, `archive/**/.claude/settings.local.json`
- scicomp: setuptools_scm `_version.py` (already handled by its SAFE-NOW `.gitignore`)

## New gotchas this session

- Em-dash sweep on non-CLAUDE governed docs is mostly source-driven, not dozens of hand edits (scoped 2026-05-24 across the alawein-org fleet, since the earlier strip was CLAUDE.md-only and VOICE now bans em-dashes):
  - `CONTRIBUTING.md` (uniform 2 per repo, about 25 repos) is synced from `${ORG_REPO}/CONTRIBUTING.md` by `scripts/ops/sync-contributing.sh`. That source is already clean (keystone C3), so re-running the sync fixes the fleet at once. GATED (writes downstream; skips `sync: manual` repos).
  - Root `AGENTS.md` (uniform 1 per repo) is the H1 title at line 12 (`# AGENTS` then an em-dash then the repo name), canonical per repo. Fix with a scripted replace of that one title line (use a colon) across repos, and in whatever scaffolds new AGENTS.md.
  - `SSOT.md` (varies 1 to 26) plus the high-count outliers (design-system 26, optiqap 10, meshal-web, veyra, prompty) are per-repo content; fold into the Phase 5 downstream sweep. Roka `CONTRIBUTING.md` is one confirmed inline example.
  - gitignore backlog (separate from em-dashes): workspace-tools `*.egg-info/`, fallax `.superpowers/`, veyra `.claude/agent-memory/` are all absent from their `.gitignore` and need adding; optiqap needs `papers/*` and `**/.claude/settings.local.json` (handle with its PR).
- Several repos carry audit-staged deletions in the index (meatheadphysicist `scripts/restructure.py`; provegate three `__init__.py`; atelier four mining-theme files). They commit correctly as part of the SAFE-NOW; no `git rm` needed.
- Repos whose docs commit covers a nested governed CLAUDE.md beyond the root: workspace-tools (`mcps/docs/CLAUDE.md`), design-system (`sync/CLAUDE.md`).
- incore and fallax have NO docs commit (CLAUDE.md unchanged).
- roka clone identity is `test@test.local`; set `user.email` and `user.name` before its commit.
- meshal-web tracks `.claude/CLAUDE.md`; its SAFE-NOW is a manual Extender-root-path correction there (the full Extender regen is the gated Phase 3.3).

## Hard constraints carried forward

- The maintainer authors all commits. Agents inspect, verify, and prepare only; stop at `git commit`. Never `git add -A`/`.`, push, force-push, or push branches other than the named one.
- Never stage `.env`/secrets; `.github/` edits are gated (none in this backlog). No em-dashes (now VOICE-enforced); American spelling; no AI attribution.
- In `alawein/alawein`, bump `last_updated` on any `.md` edited (and `last-verified` on `SSOT.md`); `docs/internal/` and `docs/archive/` are CI-exempt.
- Dropbox tree: recursive globs time out and state is non-deterministic; use per-repo `git -C` and depth-limited finds. Related: [[dropbox-workspace-reparse-gotcha]].

## Appendix: consolidated commit blocks (as inspected 2026-05-24; re-verify per repo before running)

### Wave 1: keystone

```powershell
$g = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\alawein'
git -C $g add -- scripts/ops/bootstrap-repo.sh service-metadata.yaml
git -C $g commit -m "fix: correct scaffold doctrine path and service-metadata link"
git -C $g add -- docs/style/VOICE.md scripts/doctrine/validate.py scripts/doctrine/validate-doctrine.py templates/scaffolding/README.product.md scripts/doctrine/version_coherence.py scripts/doctrine/version-coherence.py scripts/doctrine/tests/test_validate_doctrine.py scripts/doctrine/tests/test_validate_style.py scripts/doctrine/tests/test_version_coherence.py
git -C $g commit -m "feat(doctrine): enforce em-dash ban, residual-placeholder, and version-coherence checks"
git -C $g add -- SSOT.md CONTRIBUTING.md docs/architecture.md docs/onboarding.md docs/governance/docs-doctrine.md .cursor/rules.md prompt-kits/AGENT.md prompt-kits/PORTFOLIO.md prompt-kits/KITS-CHANGELOG.md prompt-kits/registry.yaml profile-from-guides.yaml templates/README.md CLAUDE.md AGENTS.md scripts/ops/generate-arch-diagram.py
git -C $g commit -m "docs: fix stale script and layout paths, remove dead-brand, state version SSOT, strip em-dashes"
git -C $g add -- catalog/repos.json catalog/components.json catalog/generated/discovery-feed.json catalog/generated/github-metadata.json catalog/generated/repo-switcher.json projects.json README.md docs/archive/desktop-repo-inventory.json scripts/catalog/sync-readme.py
git -C $g commit -m "fix(catalog): correct loopholelab stack, archive morphism, regenerate outputs"
git -C $g add -- claude-agent-platform/bin/repo-scanner.sh claude-agent-platform/bin/generate-local-claude.sh claude-agent-platform/global/CLAUDE.md claude-agent-platform/bin/tests/
git -C $g commit -m "feat(extender): make repo-scanner registry-aware for bucketed Root and commands"
git -C $g add -- docs/internal/plans/2026-05-23-fleet-remediation.md docs/internal/plans/2026-05-23-fleet-commit-manifest.md docs/internal/plans/2026-05-23-fleet-program-report.md docs/internal/plans/2026-05-24-session-handoff.md docs/internal/plans/2026-05-24-commit-backlog-execution.md docs/internal/plans/2026-05-24-commit-execution-handoff.md
git -C $g commit -m "docs(plans): add fleet remediation plan, manifest, report, and handoffs"
```

### Wave 2: tools

```powershell
$t = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\tools'
git -C "$t\workspace-tools" add -- tests/e2e/test_toolbox_e2e.py tests/test_drift_branch_name.py tests/test_drift_claimed_dep.py tests/test_drift_cli.py tests/test_drift_feature_claim.py tests/test_drift_github_helpers.py tests/test_drift_main_cli_integration.py tests/test_drift_stale_config.py workspace_batch/drift/detectors/missing_file.py workspace_batch/drift/finding.py toolbox/__main__.py
git -C "$t\workspace-tools" commit -m "fix(ci): add toolbox entrypoint and repoint e2e to python -m toolbox"
git -C "$t\workspace-tools" add -- CLAUDE.md mcps/docs/CLAUDE.md
git -C "$t\workspace-tools" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$t\llmworks" add -- package.json package-lock.json
git -C "$t\llmworks" commit -m "fix(ci): restore vitest config"
git -C "$t\llmworks" add -- CLAUDE.md
git -C "$t\llmworks" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$t\incore" add -- incore/_scripts/common.py incore/_scripts/discover.py incore/_scripts/ingest.py incore/scanner.py tests/test_common.py tests/test_config.py tests/test_discover.py tests/test_ingest.py tests/test_ingestor_class.py tests/test_integration.py tests/test_merge.py tests/test_populate_ingest_from_briefs.py tests/test_query.py tests/test_query_engine.py tests/test_render.py tests/test_renderer_class.py tests/test_scanner.py tests/test_store.py
git -C "$t\incore" commit -m "chore: clear ruff lint"

git -C "$t\attributa" add -- package-lock.json tests/export.test.ts tests/setup.ts
git -C "$t\attributa" commit -m "fix(ci): regenerate lockfile and repair jest setup"
git -C "$t\attributa" add -- CLAUDE.md
git -C "$t\attributa" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$t\design-system" add -- packages/@alawein/motion/src/fm/index.ts packages/@alawein/motion/src/fm/variants.ts packages/@alawein/motion/src/m1/choreography.ts packages/@alawein/motion/src/m1/index.ts packages/@alawein/motion/src/m1/scroll.ts
git -C "$t\design-system" commit -m "fix(ci): add NodeNext .js import extensions"
git -C "$t\design-system" add -- CLAUDE.md sync/CLAUDE.md
git -C "$t\design-system" commit -m "docs: remove em-dashes from CLAUDE.md"
```

### Wave 3: research

```powershell
$r = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\research'
git -C "$r\alembiq" add -- CHANGELOG.md CONTRIBUTING.md
git -C "$r\alembiq" commit -m "docs: correct changelog naming and fill contributing command tokens"
git -C "$r\alembiq" add -- CLAUDE.md
git -C "$r\alembiq" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$r\chshlab" add -- CONTRIBUTING.md
git -C "$r\chshlab" commit -m "docs: fill CONTRIBUTING command placeholders"
git -C "$r\chshlab" add -- CLAUDE.md
git -C "$r\chshlab" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$r\fallax" add -- CHANGELOG.md website/index.html
git -C "$r\fallax" commit -m "docs: populate website benchmark table and fix changelog ordering"

git -C "$r\maglogic" add -- examples/run_basic_triangle.py pyproject.toml python/maglogic/__init__.py python/maglogic/analysis/magnetization.py python/maglogic/core/validators.py python/maglogic/demos/demo_nand_nor.py python/maglogic/parsers/mumax3_parser.py python/maglogic/parsers/oommf_parser.py python/maglogic/simulation/oommf_runner.py python/maglogic/visualization/berkeley_style.py python/tests/test_analysis.py python/tests/test_constants.py python/tests/test_magnetization.py python/tests/test_parsers.py python/tests/test_simulation.py
git -C "$r\maglogic" commit -m "chore: clear ruff errors and add ruff config"
git -C "$r\maglogic" add -- CLAUDE.md
git -C "$r\maglogic" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$r\qmatsim" add -- .gitignore scripts/validate-structure.py tests/test_change_a33.py tests/test_cli_subcommands.py tests/test_convert.py tests/test_convert_process_structure.py tests/test_cube2xyz.py tests/test_main_unit.py tests/test_qmatsim_cli.py tests/test_round_struct.py tests/test_run_lattice.py tests/test_run_script_safely.py tests/test_struct_geometry.py tests/test_validate_structure.py
git -C "$r\qmatsim" commit -m "chore: clear ruff lint and de-dup gitignore"
git -C "$r\qmatsim" add -- CLAUDE.md
git -C "$r\qmatsim" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$r\qmlab" add -- .meta/repo.yaml
git -C "$r\qmlab" commit -m "chore(meta): mark repo status frozen to match README/SSOT"
git -C "$r\qmlab" add -- CLAUDE.md
git -C "$r\qmlab" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$r\meatheadphysicist" add -- . ':(exclude)CLAUDE.md'
git -C "$r\meatheadphysicist" commit -m "chore: remove corrupted restructure script, sort imports, fix paper.tex doc path"
git -C "$r\meatheadphysicist" add -- CLAUDE.md
git -C "$r\meatheadphysicist" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$r\qubeml" add -- integrative_projects/materials_qsim/materials_discovery.py integrative_projects/quantum_ml_hybrid/hybrid_algorithms.py src/plotting_utils.py src/quantum_utils.py tests/test_materials_edge_cases.py tests/test_package_init.py tests/test_plotting_utils.py tests/test_quantum_edge_cases.py
git -C "$r\qubeml" commit -m "chore: remove unused imports and dead assignment"
git -C "$r\qubeml" add -- CLAUDE.md
git -C "$r\qubeml" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$r\scicomp" add -- .gitignore tests/conftest.py
git -C "$r\scicomp" commit -m "chore: gitignore setuptools_scm _version.py and quiet banner during pytest collection"
git -C "$r\scicomp" add -- CLAUDE.md
git -C "$r\scicomp" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$r\spincirc" add -- python/analysis/data_processor.py python/ml_tools/device_optimization.py python/ml_tools/parameter_extraction.py python/ml_tools/physics_informed_nn.py python/ml_tools/surrogate_models.py python/ml_tools/uncertainty_quantification.py python/tests/test_data_processor.py python/tests/test_parameter_extraction.py python/tests/test_surrogate_models.py python/visualization/animation_tools.py python/visualization/berkeley_plots.py python/visualization/device_visualizer.py python/visualization/interactive_plots.py
git -C "$r\spincirc" commit -m "chore: remove unused imports flagged by ruff (F401)"
git -C "$r\spincirc" add -- CLAUDE.md
git -C "$r\spincirc" commit -m "docs: remove em-dashes from CLAUDE.md"

foreach ($repo in 'quantumalgo','simcore','helios','edfp') {
  git -C "$r\$repo" switch -c docs/claude-md-cleanup
  git -C "$r\$repo" add -- CLAUDE.md
  git -C "$r\$repo" commit -m "docs: remove em-dashes from CLAUDE.md"
}
# optiqap: WIP-first on feature/web-playground; handle CLAUDE.md when finalizing PR 12; gitignore papers/*
```

### Wave 4: products / ventures / family / personal

```powershell
$pp = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\products'
$vv = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\ventures'
$ff = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\family'
$ee = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein\personal'

git -C "$pp\gymboy" add -- scripts/github-sync-report.mjs src/components/NotFoundPage.tsx src/components/ParallaxSection.tsx src/lib/supplementCycling.ts
git -C "$pp\gymboy" commit -m "fix: clear lint and type errors blocking CI build"
git -C "$pp\gymboy" add -- CLAUDE.md
git -C "$pp\gymboy" commit -m "docs: correct platform to Vercel and remove em-dashes in CLAUDE.md"

git -C "$pp\repz" switch -c fix/ci-green
git -C "$pp\repz" add -- package-lock.json
git -C "$pp\repz" commit -m "fix(deps): resync package-lock.json so npm ci passes"
git -C "$pp\repz" add -- CLAUDE.md
git -C "$pp\repz" commit -m "docs: remove em-dashes from CLAUDE.md"

foreach ($repo in 'bolts','scribd') {
  git -C "$pp\$repo" switch -c docs/claude-md-cleanup
  git -C "$pp\$repo" add -- CLAUDE.md
  git -C "$pp\$repo" commit -m "docs: remove em-dashes from CLAUDE.md"
}

git -C "$vv\veyra" add -- CLAUDE.md
git -C "$vv\veyra" commit -m "docs: correct phase and test count and remove em-dashes in CLAUDE.md"

git -C "$vv\adil" switch -c docs/claude-md-cleanup
git -C "$vv\adil" add -- CLAUDE.md
git -C "$vv\adil" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$vv\loopholelab" add -- api/routes/validate.py
git -C "$vv\loopholelab" commit -m "chore: remove unused imports in validate route"
git -C "$vv\loopholelab" add -- CLAUDE.md
git -C "$vv\loopholelab" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$vv\provegate" add -- .gitignore CHANGELOG.md claude-drift/__init__.py claude-drift/server.py claude-memory-mesh/__init__.py claude-proof/__init__.py claude-proof/server.py
git -C "$vv\provegate" commit -m "fix: unblock mypy and clear type errors in drift/proof servers"
git -C "$vv\provegate" add -- CLAUDE.md
git -C "$vv\provegate" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$ff\atelier-rounaq" add -- src/components/animations/MiningAnimations.tsx src/components/animations/index.ts src/config/routes.ts src/data/ore-showcase-data.ts src/pages/design-system-page.tsx src/pages/landing-page-new.tsx tests/data/ore-showcase-data.test.ts
git -C "$ff\atelier-rounaq" commit -m "fix: repair broken build (design-system route + home-page import) and remove dead mining theme"
git -C "$ff\atelier-rounaq" add -- CLAUDE.md
git -C "$ff\atelier-rounaq" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$ee\meshal-web" add -- .claude/CLAUDE.md README.md
git -C "$ee\meshal-web" commit -m "chore: correct Extender root path and clarify src/lib README comment"
git -C "$ee\meshal-web" add -- CLAUDE.md
git -C "$ee\meshal-web" commit -m "docs: remove em-dashes from CLAUDE.md"

git -C "$ee\roka-oakland-hustle" config user.email 'meshal@kohyr.com'
git -C "$ee\roka-oakland-hustle" config user.name 'Meshal'
git -C "$ee\roka-oakland-hustle" add -- AGENTS.md CONTRIBUTING.md SSOT.md package.json .gitignore scripts/minigames/parking_puzzle.gd
git -C "$ee\roka-oakland-hustle" commit -m "chore: repoint phantom validate_data.py, fix license + qa-lock ignore, repair parking_puzzle indentation"
git -C "$ee\roka-oakland-hustle" add -- CLAUDE.md
git -C "$ee\roka-oakland-hustle" commit -m "docs: remove em-dashes from CLAUDE.md"
```

### Wave 5: other orgs

```powershell
$bmj = 'C:\Users\mesha\Desktop\Dropbox\GitHub\blackmalejournal\blackmalejournal'
git -C $bmj add -- package.json package-lock.json
git -C $bmj commit -m "fix(deps): bump next to 16.2.6 and pin fast-uri to clear high-severity advisories"
# menax (menax-inc\menax): no program commit, 19-file maintainer WIP
# kohyr-internal-wip (kohyr\kohyr-internal-wip): clean, no program commit
```

## Appendix B: prepared rollout artifacts (2026-05-24)

### B1. AGENTS.md title em-dash fix (one-time, scripted)

No live script emits the downstream root `AGENTS.md` title (`sync-claude.sh` only writes the derived `.claude/AGENTS.md`; `bootstrap-repo.sh` does not write root AGENTS.md), so this is one-time existing-repo cleanup, not a source fix. The em-dash is the H1 title at line 12 (`# AGENTS` then an em-dash then the repo name), identical across the fleet. This script replaces only that title punctuation with a colon and leaves any other em-dashes alone. Idempotent; run it, review `git diff` per repo, then commit. Note: prompty, veyra, and meshal-web have 2 extra content em-dashes in AGENTS.md that this does NOT touch (review those by hand). `CONTRIBUTING.md` is deliberately excluded here: it is synced from the now-clean keystone via `sync-contributing.sh`, so a re-sync fixes the fleet (gated).

```powershell
$base = 'C:\Users\mesha\Desktop\Dropbox\GitHub\alawein'
$dash = [char]0x2014   # em-dash
$repos = @(
  'tools\workspace-tools','tools\llmworks','tools\attributa','tools\design-system','tools\prompty',
  'research\alembiq','research\chshlab','research\maglogic','research\qmatsim','research\qmlab','research\meatheadphysicist','research\qubeml','research\scicomp','research\spincirc','research\quantumalgo','research\simcore','research\edfp','research\helios',
  'products\bolts','products\gymboy','products\repz','products\scribd',
  'ventures\adil','ventures\loopholelab','ventures\provegate','ventures\veyra',
  'family\atelier-rounaq','personal\meshal-web','personal\roka-oakland-hustle'
)
foreach ($r in $repos) {
  $f = Join-Path $base "$r\AGENTS.md"
  if (Test-Path $f) {
    $c = Get-Content -Raw $f
    $new = $c.Replace("# AGENTS $dash ", "# AGENTS: ")
    if ($new -ne $c) { Set-Content -NoNewline -Path $f -Value $new -Encoding utf8; "fixed: $r" }
  }
}
# optiqap excluded (WIP on feature/web-playground); fix its AGENTS title with the PR.
```

### B2. Phase 2 baseline rows (14 repos, drafted to the live github-baseline.yaml schema)

Append under `repos:` in `alawein/alawein/github-baseline.yaml`. Confirm each build/test against the repo, then validate with `./scripts/github/sync-github.sh --check --all` and `py -3.12 scripts/github/github-baseline-audit.py` before committing. `sync: auto` only for repos green now; notes mark the exceptions. All 14 are confirmed absent from the current 20-repo registry.

```yaml
  - repo: incore
    stack: python
    ci_template: python
    working_directory: "."
    install_command: "python -m pip install -e .[dev]"
    build_command: "ruff check ."
    test_command: "pytest tests/ -v --tb=short"
    codeql_languages:
      - python
    sync: auto

  - repo: chshlab
    stack: node
    ci_template: node
    working_directory: "."
    install_command: "npm ci"
    build_command: "bash build.sh"
    test_command: "npm test"
    codeql_languages:
      - javascript-typescript
    sync: auto

  - repo: fallax
    stack: python
    ci_template: python
    working_directory: "."
    install_command: "python -m pip install -e .[dev,dashboard]"
    build_command: "ruff check . && ruff format --check ."
    test_command: "pytest tests/ -v --tb=short"
    codeql_languages:
      - python
    sync: auto

  - repo: qubeml
    stack: python
    ci_template: python
    working_directory: "."
    install_command: "python -m pip install -e ."
    build_command: "ruff check ."
    test_command: "pytest tests/ -v --tb=short"
    codeql_languages:
      - python
    sync: auto

  - repo: quantumalgo
    stack: python
    ci_template: python
    working_directory: "."
    install_command: "python -m pip install -e .[dev]"
    build_command: "ruff check src tests scripts && mypy src/quantumalgo"
    test_command: "pytest tests/ -v --tb=short"
    codeql_languages:
      - python
    sync: auto

  - repo: veyra
    stack: node
    ci_template: node
    working_directory: "."
    install_command: "npm ci"
    build_command: "npm run build"
    test_command: "npm run test"
    codeql_languages:
      - javascript-typescript
    sync: auto

  - repo: loopholelab
    stack: python
    ci_template: python
    working_directory: "."
    install_command: "python -m pip install -e .[dev]"
    build_command: ""
    test_command: "pytest tests/ -v --tb=short"
    codeql_languages:
      - python
      - javascript-typescript
    sync: auto

  - repo: maglogic
    stack: python
    ci_template: python
    working_directory: "."
    install_command: "python -m pip install -e .[dev]"
    build_command: "ruff check ."
    test_command: "pytest tests/ -v --tb=short"
    codeql_languages:
      - python
    # sync: auto only AFTER the chore/cleanup SAFE-NOW (adds ruff config) is committed; manual until then
    sync: manual

  - repo: qmatsim
    stack: python
    ci_template: python
    working_directory: "."
    install_command: "python -m pip install -e .[dev]"
    build_command: "ruff check ."
    test_command: "pytest tests/ -v --tb=short"
    codeql_languages:
      - python
    # sync: auto only AFTER the chore/cleanup SAFE-NOW (ruff) is committed; manual until then
    sync: manual

  - repo: scicomp
    stack: python
    ci_template: python
    working_directory: "."
    install_command: "python -m pip install -e ."
    build_command: ""
    test_command: "pytest tests/ -v --tb=short"
    codeql_languages:
      - python
    # BLOCKED: pytest aborts at collection until the conftest banner-quiet fix lands; linter unsettled
    sync: manual

  - repo: spincirc
    stack: python
    ci_template: python
    working_directory: "."
    install_command: "python -m pip install -e ."
    build_command: "ruff check python/"
    test_command: "pytest python/ -v --tb=short"
    codeql_languages:
      - python
    # BLOCKED: pip install fails until the phantom-dep fix (sphinxcontrib-matlab to sphinxcontrib-matlabdomain) lands
    sync: manual

  - repo: provegate
    stack: python
    ci_template: python
    working_directory: "."
    install_command: "python -m pip install -e .[dev]"
    build_command: "ruff check ."
    test_command: "pytest tests/ -v --tb=short"
    codeql_languages:
      - python
    # already has its own ci.yml whose mypy step is red; reconcile (per-file mypy, gated) before generating a competing ci.yml
    sync: manual

  - repo: prompty
    stack: node
    ci_template: node
    working_directory: "."
    install_command: "npm ci"
    build_command: "npm run lint && npm run typecheck && npm run build"
    test_command: "npm run test"
    codeql_languages:
      - javascript-typescript
    # node/turbo monorepo (verified); dirty WIP at scan, confirm green before flipping to auto
    sync: manual

  - repo: helios
    stack: docs
    ci_template: manual
    working_directory: "."
    install_command: ""
    build_command: ""
    test_command: ""
    codeql_languages: []
    sync: manual
```

sync-flag summary: green now and safe for `auto` = incore, chshlab, fallax, qubeml, quantumalgo, veyra, loopholelab. Flip to `auto` only after the SAFE-NOW lands = maglogic, qmatsim. Keep `manual` (blocked or special) = scicomp, spincirc, provegate, prompty, helios.

Status 2026-05-24: the 14 rows are appended to `github-baseline.yaml` (uncommitted, for the maintainer). YAML validated: 34 repos total, no duplicate names, all 14 recognized. Suggested commit (after the prerequisite below): `feat(ci): register research repos for reusable CI adoption`.

### B3. Phase 2 prerequisite found 2026-05-24: the github sync tooling is bucket-unaware

Validating the rows surfaced a blocker the remediation plan did not flag. `scripts/github/github-baseline-audit.py` (line 127: `repo_dir = WORKSPACE / entry["repo"]`) and `scripts/github/sync-github.sh` (embedded python line 415, same expression; `WORKSPACE = ORG_REPO.parent` at line 58) resolve every repo by the OLD FLAT layout (`alawein/<repo>`), not the bucketed layout (`alawein/<bucket>/<repo>`). So `github-baseline-audit.py` reports nearly all repos (pre-existing and new) as `repo directory missing`, finding only the stray flat `alawein/adil` directory. The 14 new rows are fine (valid YAML, 34 repos, no duplicate names); this is a pre-existing tooling defect, not a row problem.

Consequence: `sync-github.sh --all` would write to wrong or nonexistent flat paths, so Phase 2 Task 2.3 cannot run yet. Fix first (call it Task 2.0): make both scripts resolve `repo_dir` from the bucketed `local_path` in `catalog/repos.json` (or `projects.json` `bucket`), exactly the registry-aware fix Phase 3.1 applied to the Extender (`repo-scanner.sh` / `generate-local-claude.sh`). Same root cause, different tool that Phase 3.1 did not cover. The change is small: build a slug-to-local_path map from the catalog and set `repo_dir = WORKSPACE / local_path[slug]` in both scripts.

Status: DONE 2026-05-24 (uncommitted, for the maintainer). Both scripts now load `catalog/repos.json`, build a slug-to-local_path map, and resolve `repo_dir = WORKSPACE / local_path`, falling back to the flat slug for uncatalogued entries (which are sync: manual). Files changed: `scripts/github/github-baseline-audit.py` (added `import json`, a `_local_path_map()` plus `resolve_repo_dir()`, and switched `check_repo`); `scripts/github/sync-github.sh` (the same resolver in the embedded python, switched `sync_repo`). Verified: `github-baseline-audit.py` now reports 0 `repo directory missing` (was about 26) and instead shows the expected `missing .github/...` for auto repos (CI not adopted yet, correct pre-rollout state); the embedded python in `sync-github.sh` passes an ast syntax check with the resolver wired in. A regression test `scripts/tests/test_github_baseline_resolver.py` (4 cases, all passing) locks in bucketed resolution and the flat fallback. Local-run caveat: `sync-github.sh` cannot be executed through git-bash on this Windows working tree because the files are stored CRLF (`set: pipefail: invalid option name`); that is a working-tree line-ending artifact only, the committed LF copy runs in CI. Suggested commit: `fix(github): resolve repos by bucketed catalog local_path in sync-github and baseline-audit`. After committing this, the baseline rows (B2) and `sync-github.sh --all` can proceed.

### B4. Phase 4 doctrine / CI repin survey (read-only, 2026-05-24)

Surveyed all 33 alawein-org repos for reusable-workflow pins (`alawein/alawein/.github/workflows/...@<sha>`). This corrects the plan's Phase 4 premise.

- `doctrine-reusable.yml` is pinned to `9779fa3` in every repo. That SHA (2026-05-16, "#121 scope the Vale step") is the doctrine workflow's LATEST change, so the doctrine pin is current and uniform, NOT stale. There is no fleet-wide doctrine SHA repin to do.
- CI workflows (`ci-node` / `ci-python` / `codeql`) are pinned to `workflow_ref = ed5ed61` (2026-04-15) for the synced repos. That is the managed ref the audit enforces.
- Two repos are off the managed ref: `alembiq` and `meshal-web` pin CI + codeql to `5c74562` (2026-05-16), newer than `workflow_ref`. The audit (refs must equal `workflow_ref`) flags both. `meshal-web` is sync: auto (a re-sync fixes it); `alembiq` is sync: manual (repin by hand or via its own ci.yml job).
- No downstream repo references the broken flat `scripts/validate-doctrine.py` path in a wrapper (searched scripts/*.sh, Makefile, .github). So systemic #7's downstream residue is not a wrapper-path problem; the helios/optiqap docs-doctrine "No such file" failures are per-repo (those docs/archive repos lack the validate script the reusable workflow runs against) and belong in the Phase 5 per-repo sweep, not a SHA repin.
- Inconsistency to resolve: `workflow_ref` (ed5ed61, April) is older than SHAs some repos already use (5c74562, May) and than the doctrine pin (9779fa3, May).

Reframed Phase 4: there is no mass doctrine repin. Instead (a) decide the canonical alawein/alawein SHA, bump `workflow_ref`, and re-sync auto repos so CI pins are uniform (catches alembiq/meshal-web); (b) handle the per-repo doctrine-script gaps (helios/optiqap) in Phase 5. All gated (.github/ writes).

### B5. Code review outcome and fixes (2026-05-24)

Three Claude Code review agents reviewed the Task 2.0 change. Verdict: `pr-review-toolkit:code-reviewer` PASS (path math correct, mirrors the Extender, 14 rows schema-valid, no duplicate names); `silent-failure-hunter` raised 1 HIGH + 1 MEDIUM on error handling; `pr-test-analyzer` flagged coverage gaps and the duplicated resolver.

Fixes applied (uncommitted, verified):
- Loud-at-use catalog handling (closes the HIGH + MEDIUM). A missing/corrupt catalog, or a drifted/typo'd slug, no longer silently flat-resolves to a phantom path: `check_repo` (audit) emits `not found in catalog/repos.json ...` and `sync_repo` (sync-github) returns `UNCATALOGUED: ...` for an auto repo whose slug is not mapped. Deliberately placed at use, not at import: the reviewer's suggested raise inside `_local_path_map` would fire at module load and break `--local` CI, the test import, and partial clones; the loud-at-use guard avoids that while still failing loudly on real runs.
- `_local_path_map` accepts an injectable `catalog_path` so its load-failure and shape-parsing branches are unit-testable.
- Fixed the stale flat-fallback comment (the control-plane repo IS catalogued) and a pre-existing em-dash in `github-baseline-audit.py`.
- Tests expanded from 4 to 12 (added dict-with-repos / top-level-list / dict-of-dicts / missing-keys / slash-strip parsing, malformed-and-missing catalog returns empty, and check_repo flags an uncatalogued auto slug while skipping manual repos).

Verified: 12 tests pass; audit reports 0 `repo directory missing` and 0 spurious `not found in catalog` (all 22 auto repos are catalogued); the sync-github embedded python passes an ast syntax check.

Review item 5 (DONE 2026-05-24): the duplicated resolver is factored into one shared importable module `scripts/github/_repo_paths.py` (`load_local_path_map(org_repo, catalog_path=None)` + `resolve_repo_dir(workspace, local_paths, repo)`). Both `github-baseline-audit.py` and the `sync-github.sh` heredoc import it (each inserts `scripts/github` on `sys.path`), so the parity-by-comment risk is gone and the now-unused `import json` was dropped from both callers. The test loads the shared module directly for the parsing and load-failure cases. Verified: 12 tests pass; audit reports 0 `repo directory missing` and 0 spurious `not found in catalog`; the sync-github embedded python is ast-clean, imports `_repo_paths`, and has no leftover local copy.

Updated Task 2.0 suggested commit: `fix(github): resolve repos by bucketed catalog local_path with loud drift detection`. Files: `scripts/github/_repo_paths.py` (new), `scripts/github/github-baseline-audit.py`, `scripts/github/sync-github.sh`, `scripts/tests/test_github_baseline_resolver.py`.

