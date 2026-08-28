---
type: canonical
source: none
sla: on-change
last_updated: 2026-08-28
audience: [ai-agents, contributors]
---

# Technical Debt Ledger

The accumulated cost of deliberate shortcuts. The goal is not zero debt, it is
zero untracked debt. Anything recorded here was a conscious choice with a known
fix. Add entries with `/debt-log`. Remove an entry when the debt is paid (note it
in the PR).

### No .gitattributes enforcing LF line endings
- **Date:** 2026-06-06
- **Where:** repo root (.gitattributes absent)
- **What:** The repo has no `.gitattributes`, so some tracked files drifted to CRLF on Windows checkouts (for example `scripts/doctrine/validate-repo-framework.py` and its test were committed CRLF while sibling `.py` files are LF). Endings were normalized ad hoc during the anti-rot work rather than enforced at the source.
- **Risk if left:** CRLF in a tracked `.sh` breaks bash on the Linux CI runner; mixed endings cause noisy diffs and review friction.
- **Suggested fix:** Add a `.gitattributes` with `* text=auto eol=lf` and `*.sh text eol=lf`, then run `git add --renormalize .`. Whitelist `.gitattributes` in the doc-contract R8 root-file allowlist if the contract requires it.
- **Owner:** alawein

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
- **Where:** `scripts/github/verify-profile-pins.py:30-39`, `scripts/catalog/sync-readme.py`
- **What:** The README pin check requires a `[slug](` link for every pin, but the generated README links only the research rows, so `fallax`-style pins from other rows fail `--skip-live --check`. Pre-existing before the gate work.
- **Risk if left:** The CLAUDE.md validation list has one permanently red command; people learn to ignore it.
- **Suggested fix:** Have `sync-readme.py` emit a pinned-repos line, or drop the README half of the check now that `validate-visibility.py` V5 and V7 cover pins.
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
- **Where:** `scripts/github/sync-github.sh`, `scripts/github/github-baseline-audit.py`, `scripts/catalog/catalog_lib.py` (`WORKSPACE_ROOT = ROOT.parent`)
- **What:** After the six-bucket move the control plane lives at `alawein/core/alawein`, so `ROOT.parent` is `alawein/core/` and both commands report every sibling as missing (`core/core/*`, `core/lab/*`). CI runs the audit with `--local`.
- **Risk if left:** Two commands in the CLAUDE.md validation list are permanently red locally.
- **Suggested fix:** Resolve the workspace root as `ROOT.parents[1]` or from `catalog/buckets.yaml` `on_disk_prefix`, with a test.
- **Owner:** alawein

### Gate CI step runs offline because ALAWEIN_METADATA_SYNC_TOKEN is dead
- **Date:** 2026-08-28
- **Where:** `.github/workflows/docs-doctrine.yml` (step "Validate public readiness gate"), repo secret `ALAWEIN_METADATA_SYNC_TOKEN`, `.github/workflows/github-metadata-sync.yml`
- **What:** The first CI run of `validate-visibility.py --github-api` got `401 Bad credentials` from the secret, so the step now runs `--offline` (catalog rules V4 and V5 only). The metadata sync workflow uses the same secret and will fail the same way.
- **Risk if left:** Catalog-vs-GitHub drift (V1, V2, V3, V6, V7, V8) is caught only when someone runs the gate locally before a PR.
- **Suggested fix:** Issue a fine-grained PAT with metadata read on all repos, store it as `ALAWEIN_METADATA_SYNC_TOKEN`, and switch the step back to `--github-api` with that secret in `env`.
- **Owner:** alawein
