---
type: canonical
source: session 2026-05-24
sla: on-change
last_updated: 2026-05-24
audience: [ai-agents, contributors]
---

# Session handoff (2026-05-24)

Resume point for the fleet audit + governance remediation program. The agent-doable work is complete; everything left is gated on the maintainer (commits + approvals).

## TL;DR

36 repos audited, governance source fixes done, all alawein-org CLAUDE.md cleaned. Nothing is committed. ~20 SAFE-NOW branches plus a governance branch are staged UNCOMMITTED across the fleet, and most repo branches now also carry a CLAUDE.md doc/em-dash edit. The maintainer authors every commit.

## Durable artifacts (all in `alawein/alawein/docs/internal/plans/`)

- `2026-05-23-fleet-remediation.md` — sequenced rollout plan (Phases 1-6); Task 2.2 has the verified 14-repo CI-adoption gap with commands + blockers.
- `2026-05-23-fleet-commit-manifest.md` — every staged SAFE-NOW branch, suggested commit message, verification status.
- `2026-05-23-fleet-program-report.md` — consolidated record + full per-repo status table.
- Per-repo audit handouts at `<repo>/.claude/plans/2026-05-23-<repo>-audit-handout.md` (gitignored via each repo's `.git/info/exclude`).
- Cross-session memory: `project_fleet_remediation.md` (auto-recalled) + `dropbox-workspace-reparse-gotcha.md`.

## State by phase

- **Audit: DONE (36/36).** tools 6, research 15, governance 1, products 4, ventures 4, family 1, personal 2, other orgs 3. Secrets hygiene clean fleet-wide.
- **Phase 1 (governance source fixes): DONE**, uncommitted on `alawein/alawein` branch `chore/governance-cleanup`. Includes: em-dash ban + blocking voice-check rule, placeholder-residue rule (R11), version-coherence check (warn-only), governed-doc path sweep, morphism removal + catalog regen, loopholelab catalog stack fix, the `bootstrap-repo.sh` doctrine-path fix, and `service-metadata.yaml` dead link. Repo gate green (224 tests, validate + catalog clean). The known `HANDOFF.md` R1 "failure" is a working-tree-only false positive (it is gitignored; CI does not see it).
- **Phase 3.1 (registry-aware Extender): DONE**, same branch. `claude-agent-platform/bin/repo-scanner.sh` + `generate-local-claude.sh` now read `catalog/repos.json` `local_path` + `projects.json` `bucket` to emit a bucketed Root and real commands, with a `# registry: not found` guard. Verified cwd-independent (a relative-`$0` bug was caught and fixed). NOT yet mirrored to `~/.claude/bin/` (that is gated Phase 3.2).
- **claude-md-improver pass: DONE** (this session):
  - `alawein/CLAUDE.md` (org-dir loose file, not a git repo): flat->bucket paths, corrected script locations, em-dashes removed, `last-verified` bumped. Saved directly.
  - `veyra/CLAUDE.md` (branch `docs/refresh-claude-md`): "Phase 1 / 53 tests / Stub" corrected to "Phase 2 implemented / 100 tests / built+tested"; em-dashes removed.
  - `gymboy/CLAUDE.md` (branch `fix/ci-green`): "GitHub Spark platform" corrected to "deployed on Vercel"; em-dashes removed; dates bumped.
  - ~31 more alawein-org hand-authored CLAUDE.md (incl. the nested `tools/workspace-tools/mcps/docs/CLAUDE.md`): em-dashes stripped in place on each repo's current branch; dates bumped where frontmatter had them. Deep `maxdepth 8` scan confirms the alawein-org governed CLAUDE.md surface is em-dash-free.
  - `claude-agent-platform/global/CLAUDE.md` (branch `chore/governance-cleanup`): em-dash in version stamp.

## Next actions (maintainer-gated, in order)

1. **Commit the backlog** (you author all commits). Work the commit manifest. NOTE: most repos' branches now ALSO carry a CLAUDE.md doc/em-dash edit from the claude-md pass — stage each as a separate `docs:` commit. A few clean repos (edfp, helios, quantumalgo, simcore, bolts, repz, scribd, adil) have a CLAUDE.md edit sitting on `main` with no branch — branch + commit those. For `roka-oakland-hustle`, set `git config user.email meshal@kohyr.com` first (the clone shows a placeholder identity).
2. **Gated rollout** (fleet-remediation plan Phases 2-5):
   - Phase 2 CI adoption: add the 14 missing repos (plan Task 2.2) to `github-baseline.yaml`; run `sync-github.sh --all` (writes downstream `.github/`). Land each repo's SAFE-NOW first so the new gate is not born red (scicomp conftest, spincirc phantom dep, maglogic/qmatsim ruff).
   - Phase 3.2/3.3: mirror the registry-aware Extender to `~/.claude/bin/` (confirm byte-identical first), then regenerate `.claude/CLAUDE.md` fleet-wide (fixes the ~40 generated stale configs at once).
   - Phase 4: repin helios/optiqap (and any repo on a stale ref) to the current `doctrine-reusable.yml` SHA.
   - Phase 5: per-repo downstream sweep (each handout's deferred items: stub docs, `drift.yml` secrets-in-if bug, `Production/Stable` classifiers, hallucinated docs, heavy artifacts).
3. **Open decisions** to confirm: bolts historical `sk_live` rotation + possible history scrub; meshal-web "Kohyr v0.3 Lean 4" claim vs Python/SymPy reality; atelier-rounaq `autonomous.yml` that self-commits to main and posts a fake build status; missing security headers on repz/scribd/bolts; the version-anchor model (tag + CHANGELOG).

## Hard constraints to carry forward

- The maintainer authors ALL git commits. Agents: create branches, leave changes UNCOMMITTED; never commit, push, `git add -A`/`.`, or force-push; never push branches other than the named one.
- Never edit `.env`/secrets (flag for rotation, never reproduce values). `.github/` edits are gated. No em-dashes (now enforced by `VOICE.md`). American spelling. No AI attribution in commits/docs.
- Dropbox-hosted workspace: recursive globs time out and the tree is non-deterministic; use depth-limited finds. Reparse/junction detection uses `LinkType`/reparse tag, never the ReparsePoint attribute (see memory). `.git` dirs set to `com.dropbox.ignored`.
- `.claude/` working docs are excluded per repo via `.git/info/exclude`. `jobs-projects/` is untouched (gitignored). In `alawein/alawein`, bump `last_updated` on any `.md` edited (and `last-verified` on `SSOT.md`); `docs/internal/` and `docs/archive/` are CI-exempt.

## Gotchas discovered this program

- Shallow finds (`maxdepth 5` from `GitHub/`) miss nested CLAUDE.md (e.g. `mcps/docs/CLAUDE.md` at depth 6); use `maxdepth 8` from `alawein/`. Verification caught a straggler the shallow sweep missed.
- The catalog SSOT: `catalog/repos.json` is authored (`bucket` + `local_path`), `projects.json` is derived (regenerate via `scripts/catalog/build-catalog.py`; never hand-edit it first). 8 repos legitimately cross-list into two groups via `catalog_groups` (not duplicates).
- The fleet's recurring defects are governance-layer, not per-repo: stale generated `.claude/CLAUDE.md`, the CI-adoption registry gap, scaffold residue. Three were source-fixable (done); the rest are downstream residue (Phase 5).
- `kohyr-internal-wip` CI is dark org-wide (billing/Actions policy on the `kohyr-app` org, not a YAML defect).

## Intentionally left (not in scope / need owner judgment)

- Other-org CLAUDE.md em-dashes: `blackmalejournal` (102), `kohyr-internal-wip` (14), `menax` (13) — stylistic, ungoverned by alawein VOICE.md.
- 2 incore test fixtures (`tests/fixtures/workspace-mini/repo-{a,c}/CLAUDE.md`) with 1 em-dash each — test data; editing risks breaking incore's tests.
- The ~40 generated `.claude/CLAUDE.md` — fixed by the Extender regen (Phase 3.3), not by hand.
