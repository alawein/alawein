---
type: canonical
source: none
sla: on-change
last_updated: 2026-09-15
audience: [ai-agents, contributors]
---

# Technical Debt Ledger

The accumulated cost of deliberate shortcuts. The goal is not zero debt, it is
zero untracked debt. Anything recorded here was a conscious choice with a known
fix. Add entries with `/debt-log`. Remove an entry when the debt is paid (note it
in the PR).

### Anti-rot rollout: six repos not yet seeded (dirty at rollout time)
- **Date:** 2026-06-06
- **Where:** `tools/design-system`, `tools/knowledge-base`, `tools/prompty`, `tools/workspace-tools`, `research/edfp`, `research/optiqap`
- **What:** The Phase 7 fleet rollout skipped these six code-archetype repos because they had uncommitted changes (in-flight work) when it ran, to avoid entangling the anti-rot seed with unrelated edits.
- **Risk if left:** The fleet is not 100 percent covered; `validate-repo-framework.py` will report missing anti-rot artifacts for these repos once the rule is enforced.
- **Suggested fix:** Re-run `scripts/ops/rollout-antirot.sh <repo>` on each once its working tree is clean, then commit on a `docs/anti-rot` branch.
- **Owner:** alawein

### Anti-rot rollout staged unmerged; kohyr ADR path not reconciled
- **Date:** 2026-06-06
- **Where:** 24 alawein code repos (`docs/anti-rot` branches, local, unpushed); `kohyr` org
- **What:** The 24 seeded repos hold their `docs/DEBT.md` and `docs/adr/` on local `docs/anti-rot` branches awaiting the maintainer's merge and push. Separately, `kohyr` already uses ADRs (for example ADR-049, ADR-053) but its ADR location was not reconciled to the standard `docs/adr/` path; it was deliberately not force-migrated.
- **Risk if left:** Working trees do not carry the artifacts until the branches merge, so a working-tree doctrine walk still reports them missing; kohyr's ADR convention stays divergent from the fleet standard.
- **Suggested fix:** Merge and push the `docs/anti-rot` branches per the fleet merge policy; separately, confirm kohyr's ADR directory and align it to `docs/adr/` (or record an ADR documenting the divergence).
- **Owner:** alawein

### docs-validation Audit no longer runs on non-main pushes or non-main-base PRs
- **Date:** 2026-06-10
- **Where:** `.github/workflows/docs-validation.yml` (`push:` and `pull_request:` triggers scoped to `branches: [main]`)
- **What:** The `Audit Documentation` workflow was scoped to `branches: [main]` on both triggers (PR #136) to match `ci.yml` and to drop a redundant feature-branch push run whose `--full` freshness window absorbed target-branch commits after a `git merge main`. The side effect is that direct pushes to non-main branches, and pull requests whose base is not `main`, no longer run the documentation audit.
- **Risk if left:** Doc drift introduced on a non-main branch that never reaches `main` through a PR is not audited. Low in practice: generated-doc autocommits land on `main` (still covered) and nearly all PRs target `main`, so the main-targeted `pull_request` run remains the authoritative gate.
- **Suggested fix:** None required while the workflow mirrors `ci.yml`. If stacked PRs onto non-main bases become common, broaden the `pull_request` branches filter and rely on the `validate-doc-contract.sh` fail-loud-on-unresolvable-base guard so a non-main base cannot silently no-op the freshness check.
- **Owner:** alawein

### verify-profile-pins README link check fails for non-research pins
- **Date:** 2026-08-27
- **Closed:** 2026-09-04
- **Where:** `scripts/github/verify-profile-pins.py:30-39`, `scripts/catalog/sync-readme.py`
- **What:** The README pin check requires a `[slug](` link for every pin, but the generated README links only the research rows, so `fallax`-style pins from other rows fail `--skip-live --check`. Pre-existing before the gate work.
- **Resolution:** All six configured `profile_pins` (`qmatsim`, `spincirc`, `maglogic`, `scicomp`, `fallax`, `chshlab`) are now research-row pins with matching README links, so `verify-profile-pins.py --skip-live --check` passes. Re-open if a future pin is added outside `research_rows`.
- **Owner:** alawein

### CLAUDE.md cites a /voice-resweep skill that does not exist on disk
- **Date:** 2026-08-27
- **Where:** `CLAUDE.md` (Build and validate section), `~/.claude/skills/registry.json` entry `voice-resweep`
- **What:** The registry points at `~/.claude/skills/voice-resweep/SKILL.md`, which is absent; only `config/model-routing.yaml` defines a `voice-resweep` workflow.
- **Risk if left:** A new session follows a dead pointer instead of running the listed commands.
- **Suggested fix:** Create the skill wrapping the Build and validate block, or reword CLAUDE.md to point at the block directly.
- **Owner:** alawein

### compliance field drifts from visibility
- **Date:** 2026-08-27
- **Where:** `catalog/repos.json` `github_custom_properties.compliance`; `scripts/catalog/compile_index.py` hardcodes `public-data` for new entries
- **What:** `provegate` is public with `internal-only`; seven private repos carry `public-data`.
- **Risk if left:** GitHub custom properties misstate data handling.
- **Suggested fix:** Derive `compliance` from visibility when unset, and audit the seven by hand.
- **Owner:** alawein

### Promotion grace and scan expiries turn CI red on fixed dates
- **Date:** 2026-08-27
- **Where:** `catalog/index.yaml` promotion records, `scripts/catalog/catalog_lib.py` (`grace_active`, `promotion_is_current`)
- **What:** `grace_until` is 2026-09-30 on `alawein`, `outpost`, `chshlab`, `fallax`, `qmatsim`; all nine scans (2026-08-27) age out after 90 days on 2026-11-25. On each date, `validate-catalog.py --strict` (`docs-validation.yml`, `github-metadata-sync.yml`) and the docs-doctrine gate go red.
- **Risk if left:** CI fails on main with no warning.
- **Suggested fix:** Before 2026-09-30, the README redo wave promotes the four pins to P0 or they leave `profile_pins`, and the hub fixes B6/B7 or its grace is renewed with a reason; re-scan every public repo before 2026-11-25 and bump `scanned`.
- **Owner:** alawein

### sync-github.sh --check --all and github-baseline-audit.py resolve siblings from ROOT.parent
- **Date:** 2026-08-27
- **Closed:** 2026-09-04
- **Where:** `scripts/github/sync-github.sh`, `scripts/github/github-baseline-audit.py`, `scripts/catalog/catalog_lib.py`
- **What:** After the six-bucket move the control plane lives at `alawein/core/alawein`, so `ROOT.parent` is `alawein/core/` and sibling resolution missed bucketed paths.
- **Resolution:** All four call sites (`sync-github.sh`, `github-baseline-audit.py`, `catalog_lib.py`, `validate-projects-json.py`) now resolve through one shared `scripts/workspace_paths.py::workspace_root_for()` instead of independently computing `.parent` depth. It infers the workspace root from the known bucket names (`apps/core/lab/sites/work/_archive`) and accepts an `ALAWEIN_WORKSPACE_ROOT` override for linked worktrees, where a fixed-depth `.parent.parent` breaks. `catalog_lib.WORKSPACE_YAML` resolves under `core/knowledge-base`.
- **Owner:** alawein

### Gate CI step runs offline because ALAWEIN_METADATA_SYNC_TOKEN is dead
- **Date:** 2026-08-28
- **Where:** `.github/workflows/docs-doctrine.yml` (step "Validate public readiness gate"), repo secret `ALAWEIN_METADATA_SYNC_TOKEN`, `.github/workflows/github-metadata-sync.yml`
- **What:** The first CI run of `validate-visibility.py --github-api` got `401 Bad credentials` from the secret, so the step now runs `--offline` (catalog rules V4 and V5 only). The metadata sync workflow uses the same secret and will fail the same way.
- **Risk if left:** Catalog-vs-GitHub drift (V1, V2, V3, V6, V7, V8) is caught only when someone runs the gate locally before a PR.
- **Suggested fix:** Issue a fine-grained PAT with metadata read on all repos, store it as `ALAWEIN_METADATA_SYNC_TOKEN`, and switch the step back to `--github-api` with that secret in `env`.
- **Owner:** alawein

### Hub secret VERCEL_TOKEN unconfigured
- **Date:** 2026-09-13
- **Expires:** 2026-10-13
- **Where:** repo secret name `VERCEL_TOKEN`; `.github/workflows/sync-vercel.yml`
- **What:** The Vercel catalog sync workflow references `secrets.VERCEL_TOKEN`, but the secret is not configured for reliable scheduled use. The weekly cron is commented out; only `workflow_dispatch` remains until the credential is issued and the schedule is re-enabled.
- **Risk if left:** Catalog `vercel:` blocks drift from live Vercel state with no automatic catch-up.
- **Suggested fix:** Create a Vercel token with read access to declared projects, store it as `VERCEL_TOKEN`, smoke-test via `workflow_dispatch`, then restore the Monday cron.
- **Owner:** alawein

### Hub secret KERNEL_SYNC_TOKEN unconfigured
- **Date:** 2026-09-13
- **Expires:** 2026-10-13
- **Where:** repo secret name `KERNEL_SYNC_TOKEN`; `.github/workflows/kernel-sync.yml`
- **What:** Kernel fanout is parked on `workflow_dispatch` with `dry_run: true` as the only safe mode because `KERNEL_SYNC_TOKEN` is not configured. Non-dry runs that open PRs across target repos will fail until the credential exists.
- **Risk if left:** Kernel-managed surfaces cannot be synced from the hub without a local workaround.
- **Suggested fix:** Issue a fine-grained PAT or GitHub App installation token with `contents:write` and `pull-requests:write` on target repos, store it as `KERNEL_SYNC_TOKEN`, then re-evaluate enabling real sync waves.
- **Owner:** alawein

### Hub secret AUTO_PR_TOKEN unconfigured
- **Date:** 2026-09-13
- **Expires:** 2026-10-13
- **Where:** repo secret name `AUTO_PR_TOKEN`; `.github/workflows/docs-auto-gen.yml`
- **What:** Auto-generated architecture PRs fall back to `secrets.GITHUB_TOKEN` when `AUTO_PR_TOKEN` is unset. The default token cannot trigger `pull_request` workflows, so required checks do not run on those bot PRs until someone manually updates the branch.
- **Risk if left:** Docs auto-gen PRs stay check-less and need a manual nudge before merge gates appear.
- **Suggested fix:** Create a fine-grained PAT with contents and pull-requests write, store it as `AUTO_PR_TOKEN`, and confirm a bot PR runs required checks without a manual update-branch.
- **Owner:** alawein
