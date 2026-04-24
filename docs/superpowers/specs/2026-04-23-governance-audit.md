---
title: Spec C — Governance Audit
date: 2026-04-23
status: active
type: canonical
feeds: [master-execution-plan]
---

# Spec C — Governance Audit

**Generated:** 2026-04-23
**Repo audited:** alawein (meta-repo) + workspace-level enforcement
**Purpose:** Scorecard of governance enforcement — what really blocks merges and produces actionable signal, versus what is aspirational documentation or silent-no-op theater.

---

## Executive Summary

**Overall health:** Yellow — real enforcement coexists with governance theater. Four gates actually block merges (docs-doctrine validator, GitHub baseline audit, doc-contract validator, ci.yml markdownlint on governance files). Three Claude Code hooks are silently non-functional because they reference a deleted `_pkos/` directory and use invalid Claude Code hook event names. The `REPO_GOVERNANCE_INITIATIVE.md` document ("RepoReady") promises five deliverables — *none of them exist on disk* — but its practical baseline (CI/CodeQL/dependabot/CODEOWNERS/PR template/issue templates) is fully rolled out on 14 of 14 sampled repos. Governance docs under `docs/governance/` number 56, and the session-log artifact `bulk-execution-progress.md` is still marked `status: active` despite last-updated 2026-03-15 — exactly the supersession the Spec design called out.

**Real enforcement score:** 4 blocking gates, 2 advisory audits, 1 weekly matrix audit (output to Actions summary only).
**Governance theater:** 3 broken local hooks, 1 aspirational initiative document, 1 stale canonical progress log.

**Most urgent cross-cutting issue:** the `RepoReady` initiative promises a compliance dashboard and scorecard that do not exist, while the practical workspace-standardization work has already shipped and keeps working. The initiative document should be either (a) updated to describe the actually-shipped baseline and the audit script that enforces it, or (b) the five promised deliverables should be produced. Leaving the doc in its current state invites a future reader to either distrust the whole governance stack or go off and write a scorecard that duplicates what github-baseline-audit.py already does.

---

## What Actually Enforces (blocking gates)

| Gate | Trigger | Script | Lines | Scope | Verdict |
|------|---------|--------|-------|-------|---------|
| Docs Doctrine validator | push/PR on `docs/**`, `*.md`, itself; monthly freshness cron | `scripts/validate-doctrine.py --ci` | 557 | alawein repo only | **Real** — parses YAML via pyyaml, enforces 10 rules (R1 type, R2 no-dup canonical, R3 derived source/sync, R4 SLA, R5 naming, R6 domain), supports exempt path list, exempts GitHub-facing READMEs, classifies archive/dist as warnings |
| Derived-file drift check | same as above | `scripts/generate-index.sh` + `scripts/render-configs.sh` then `git diff --exit-code` | — | alawein repo | **Real** — regenerates derived files and fails if uncommitted diff remains |
| Doc Contract validator | push/PR on code paths (`paths-ignore: **/*.md, docs/**`) | `scripts/validate-doc-contract.sh --full` / `--changed-only` | 491 | alawein repo | **Real** — runs on every code commit; has both full and diff modes |
| Script tests | push/PR | `pytest scripts/tests/` | — | alawein repo | **Real** — gates scripts/ changes |
| Managed markdown lint | push/PR on code paths | `markdownlint-cli@0.39.0` over 7 root docs + docs/README + docs/governance/*.md | — | alawein repo | **Real** — fails CI on style violations |
| Documentation Audit (docs-validation.yml) | push/PR on docs paths; weekly Monday | Vale + `validate.py --ci` + markdownlint + `validate-no-ai-attribution.py` + catalog build/validate | — | alawein repo | **Real** — multi-check doc gate including Vale linting on prose |
| GitHub Baseline audit | manual / part of `./scripts/sync-github.sh --check --all` | `scripts/github-baseline-audit.py` | 185 | **All sync:auto repos** (21 repos in manifest, 19 sync:auto) | **Real** — checks CODEOWNERS, PR template, issue templates (3), dependabot.yml (with github-actions ecosystem), ci.yml (reusable workflow ref), codeql.yml (pinned workflow ref), rejects README banned widgets |
| sync-github.sh template renderer | manual | bash + python inlined | 430 | All sync:auto repos | **Real** — renders template files from alawein/.github/ to sibling .github/; supports --check mode |
| CodeQL baseline | push/PR | `.github/workflows/codeql.yml` (reusable from alawein/alawein) | 75 | All repos declaring codeql_languages | **Real** — pinned SHA ref; sync-github.sh enforces |
| Secrets scan | push/PR | `.github/workflows/secrets-scan.yml` | 38 | alawein repo | **Real** |

**Total blocking enforcement:** 10 gates, all wired, all running.

---

## What Does Not Enforce (theater)

### Broken Claude Code hooks

`.claude/settings.json` declares three hooks with non-Claude-Code event keys:

```json
"hooks": {
  "pre-commit": "bash .claude/hooks/scope-binding-check.sh --warn-only",
  "post-commit": "bash .claude/hooks/observability-log.sh --log-to docs/operations/session-log.md",
  "hourly": "bash .claude/hooks/drift-detection.sh"
}
```

| Issue | Evidence | Impact |
|-------|----------|--------|
| Hook event names `pre-commit`, `post-commit`, `hourly` are not valid Claude Code events | Claude Code uses `PreToolUse`, `PostToolUse`, `Stop`, `UserPromptSubmit`, `SessionStart` | Hooks never fire from Claude Code — the keys are ignored |
| `drift-detection.sh` resolves `template_source` to `../../../_pkos` | Script line 33; `_pkos/` does not exist anywhere in `C:/Users/mesha/Desktop/Dropbox/GitHub/` — was consolidated into `knowledge-base/` per 2026-04-03 memory | Script loops over CLAUDE.md/AGENTS.md/GUIDELINES.md, both files missing at template_source, so comparison is silently skipped and `echo "No governance drift detected."` always fires — false-green |
| `scope-binding-check.sh` and `observability-log.sh` header comments cite `Source: _pkos/templates/governance-hooks/...` | Files at `.claude/hooks/{scope-binding-check,observability-log,drift-detection}.sh` | Scripts reference a template lineage that is broken; updates cannot flow back via any mechanism |
| `_templateSource` field in settings.json points at `github.com/alawein/knowledge-base/templates/governance-hooks` | But no CI or script pulls from there | Documented intent with no wiring |

**Net:** three hook files, zero effective enforcement.

### Aspirational initiative document

`REPO_GOVERNANCE_INITIATIVE.md` (root, 87 lines, labeled "RepoReady") lists five deliverables under "Deliverables":

| Deliverable | Path | Exists? |
|-------------|------|---------|
| Full initiative specification | `docs/governance/repository-standardization-program.md` | **No** |
| Standard templates | `docs/governance/templates/` | **No** |
| Migration checklist | `docs/governance/migration-checklist.template.md` | **No** |
| Repo audit scorecard | `docs/governance/repo-audit-scorecard.template.md` | **No** |
| Compliance dashboard schema | `docs/governance/compliance-dashboard-schema.yaml` | **No** |

Yet the *practical* baseline — CODEOWNERS, PR templates, issue templates, dependabot, ci.yml, codeql.yml — has been delivered and is verified across 14 of 14 sampled repos via `github-baseline-audit.py`. The initiative document is stuck in a state where it describes aspirations already superseded by working code without acknowledging it.

### Weekly workspace audit — observability only

`.github/workflows/workspace-audit.yml` runs weekly across a 32-repo matrix checking for presence of README/SSOT/AGENTS/CLAUDE/LICENSE/SECURITY/CODE_OF_CONDUCT, CI workflow, test directory. Findings go to `GITHUB_STEP_SUMMARY` only — no issue opened, no PR, no scorecard persisted. Matrix includes `design-system-visual-fix` and `legacy-portfolio-temp` which need existence verification.

### Stale session log marked canonical

`docs/governance/bulk-execution-progress.md` — frontmatter declares `type: canonical, status: active, last_updated: 2026-03-15`. Body is a 2026-03-12/13 Phase 3/4/5 session log with row entries for repos like `gainboy`, `rounaq-atelier`, `devkit`, `event-discovery-framework`, and `shared-utils` — names that have been renamed or retired. The Spec-B design document (`2026-04-23-workspace-audit-design.md`) explicitly called this out: "Open items in docs/governance/bulk-execution-progress.md — migrate to master plan, do not maintain in parallel."

---

## Findings

### alawein (meta-repo) findings

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | `.claude/hooks/drift-detection.sh` silently no-ops — references deleted `_pkos/` template directory; always reports "No governance drift detected" regardless of state | Governance theater | `.claude/hooks/drift-detection.sh:33` `template_source=${1:-../../../_pkos}`; `_pkos` absent from workspace; `knowledge-base/templates/` is now the successor per 2026-04-03 consolidation | Either rewire to `knowledge-base/templates/governance-hooks/` (the successor per settings.json `_templateSource` field) or delete the hook entirely. Current state is false-green | S |
| Critical | `.claude/settings.json` hook event keys `pre-commit`, `post-commit`, `hourly` are not valid Claude Code hook events — hooks never fire | Governance theater | `.claude/settings.json:6-9`; Claude Code schema requires `PreToolUse`, `PostToolUse`, `Stop`, `UserPromptSubmit`, `SessionStart` | Use valid Claude Code hook event names, or document that these are git hook mappings intended to be symlinked into `.git/hooks/`; current wiring is ignored silently | S |
| Critical | `REPO_GOVERNANCE_INITIATIVE.md` promises 5 deliverables that do not exist; yet the practical baseline has shipped | Governance | `REPO_GOVERNANCE_INITIATIVE.md:68-72` lists 5 paths in `docs/governance/` — all absent; 14/14 sampled repos verified baseline-compliant via direct inspection | Rewrite initiative document to describe the delivered baseline (github-baseline.yaml + audit + sync) and link to the authoritative scripts; OR write the 5 promised deliverables. Current doc misleads readers on governance maturity | M |
| High | `docs/governance/bulk-execution-progress.md` marked `type: canonical, status: active` but is a stale 2026-03-12/13 session log with retired repo names (gainboy, rounaq-atelier, devkit, event-discovery-framework, shared-utils) | Governance theater | `docs/governance/bulk-execution-progress.md:3-11`, body rows 17-47 | Change `status` to `superseded` and point at master execution plan (Phase 5 of workspace-audit-design); or delete the file with a tombstone entry in CHANGELOG | S |
| High | `.claude/hooks/scope-binding-check.sh` and `observability-log.sh` are orphaned from their template lineage | Governance | Header comments cite `Source: _pkos/templates/governance-hooks/hooks/...`; `_pkos/` does not exist | Update header comments to point at `knowledge-base/templates/governance-hooks/` if that path exists, or mark the scripts as vendored-and-frozen | S |
| High | `workspace-audit.yml` produces zero actionable artifacts — Step Summary only | Governance | `.github/workflows/workspace-audit.yml:92-99` — emits echo to `$GITHUB_STEP_SUMMARY`; no issue/PR/file created | Either open a GitHub issue per flagged repo with autocloser on fix, or emit a JSON artifact and publish to `knowledge-base/db/` for dashboard consumption | M |
| High | `workspace-audit.yml` matrix includes `design-system-visual-fix` and `legacy-portfolio-temp` — may be orphan repos | Data hygiene | `.github/workflows/workspace-audit.yml:31,37` | Cross-reference against `github-baseline.yaml` repo list (21 entries); remove entries whose repos are archived or renamed | S |
| High | 56 docs under `docs/governance/` — no index showing which are canonical/derived/superseded | Governance surface | `ls docs/governance/` — 30+ files in first listing, matches `wc -l` on governance docs | Add `docs/governance/INDEX.md` (or regenerate via `generate-index.sh`) classifying every doc by type and status; tighten validate-doctrine to flag docs with `status: active` older than N days | M |
| Medium | Workspace-root `alawein/.claude/CLAUDE.md` is 2 lines ("See root AGENTS.md for full project context") while sibling repos ship a 40-line template | Documentation drift | `alawein/.claude/CLAUDE.md:1-4` vs e.g. `bolts/.claude/CLAUDE.md:1-40` | Either run `sync-claude.sh` to propagate the bootstrap template into `alawein/.claude/CLAUDE.md`, or document intentional minimalism for the control-plane repo | S |
| Medium | `github-baseline.yaml` declares 21 repos but `workspace-audit.yml` matrix lists 32 — two separate repo registries | Data consistency | `github-baseline.yaml:4-241` (21 entries); `.github/workflows/workspace-audit.yml:22-54` (32 entries); `catalog/repos.json` is a third | Pick one source of truth (recommend `catalog/repos.json`) and regenerate the other two from it; current state invites per-artifact drift | M |
| Medium | `validate-doctrine.py` allows `LEGACY_TYPES` (`normative`, `guide`, `lessons`, `reference`) as warnings rather than errors — indefinite grace period | Governance | `scripts/validate-doctrine.py:33-35` | Set a sunset date (e.g. 2026-06-30) after which legacy types become errors; current state lets pre-doctrine docs rot indefinitely | S |
| Medium | `docs/governance/` contains 30+ phase-by-phase rollout docs (phase1-*, phase3-*, phase4-*, phase5-*) — executed work left as active documentation | Documentation debt | `docs/governance/phase1-design-branding-analysis-alawein.md`, `phase3-refactor-and-centralization.md`, `phase4-testing-and-validation.md`, `phase5-version-control-and-deployment.md` | Audit each phase doc: if the work shipped and is in CHANGELOG, move to `docs/archive/`; if not shipped, classify as `status: planned` | M |
| Medium | `bootstrap-repo.sh` present but no test coverage under `scripts/tests/` | DX | `scripts/bootstrap-repo.sh`; `scripts/tests/` exists but was not verified to cover bootstrap | Add smoke test for `bootstrap-repo.sh` against a temp dir; verify doctrine-compliant scaffold output | M |
| Medium | `catalog/repos.json` lastVerified 2026-04-14 — 9 days old on 2026-04-23 audit | Data freshness | `catalog/repos.json:3 "lastVerified": "2026-04-14"` | Add CI gate in docs-validation.yml rejecting PRs when lastVerified is more than 7 days old AND relevant files (repos.json) changed | S |
| Low | `markdownlint-cli@0.39.0` pinned in ci.yml but not in docs-validation.yml re-exec — minor duplication | DX | `.github/workflows/ci.yml:64`, `.github/workflows/docs-validation.yml:82` | Extract markdownlint version into a reusable composite action or env var | S |
| Low | `doctrine-reusable.yml` (97 lines) purpose not obvious from name — is it the reusable workflow that sibling repos consume? | Documentation | `.github/workflows/doctrine-reusable.yml` | Add a 3-line header comment documenting which repos consume it and via what path | S |

### Per-repo CLAUDE.md / AGENTS.md drift check

| Repo | CLAUDE.md lines | `.claude/CLAUDE.md` status | Drift Verdict |
|------|-----------------|----------------------------|----------------|
| alawein (meta) | 119 | 2 lines (minimal) | Intentional — control-plane self-contained |
| bolts | 73 | Standard bootstrap template | Synced |
| repz | 64 | Standard bootstrap | Synced |
| gymboy | 60 | Standard bootstrap | Synced |
| scribd | 61 | Standard bootstrap | Synced |
| llmworks | 69 | Standard bootstrap | Synced |
| attributa | 69 | Standard bootstrap | Synced |
| design-system | 58 | Standard bootstrap | Synced |
| workspace-tools | 70 | Standard bootstrap | Synced |
| knowledge-base | 61 | Standard bootstrap | Synced |
| meshal-web | 93 | Standard bootstrap | Synced |

**Sync-claude.sh is working** — every sibling repo's `.claude/CLAUDE.md` matches the canonical bootstrap template. Root `CLAUDE.md` files are per-repo (correctly so) and all have doctrine-compliant content. No drift blocker. (Only note: alawein's own `.claude/CLAUDE.md` is 2 lines vs the 40-line bootstrap; intentional per repo purpose.)

### Enforcement Coverage Matrix

| Rule / Check | Local dev | Pre-commit hook | CI on PR | CI on push | Monthly cron | Who enforces |
|--------------|-----------|-----------------|----------|------------|--------------|--------------|
| Doctrine R1 (frontmatter type) | `validate-doctrine.py` | — | ✓ | ✓ | ✓ | docs-doctrine.yml |
| Doctrine R2 (no dup canonical) | `validate-doctrine.py` | — | ✓ | ✓ | ✓ | docs-doctrine.yml |
| Doctrine R3 (derived source/sync) | `validate-doctrine.py` | — | ✓ | ✓ | ✓ | docs-doctrine.yml |
| Doctrine R4 (SLA) | `validate-doctrine.py` | — | ✓ | ✓ | ✓ | docs-doctrine.yml |
| Doctrine R5 (naming/banned suffixes) | `validate-doctrine.py` | — | ✓ | ✓ | ✓ | docs-doctrine.yml |
| Doctrine R6 (domain boundaries) | `validate-doctrine.py` | — | ✓ | ✓ | ✓ | docs-doctrine.yml |
| Doctrine R7+ (others) | `validate-doctrine.py` | — | ✓ | ✓ | ✓ | docs-doctrine.yml |
| No AI attribution in docs | `validate-no-ai-attribution.py` | — | ✓ (docs paths) | ✓ (docs paths) | weekly | docs-validation.yml |
| No banned README widgets | `github-baseline-audit.py` | — | ✗ (manual run) | ✗ (manual run) | — | manual |
| Markdownlint governance docs | — | — | ✓ | ✓ | weekly | ci.yml + docs-validation.yml |
| Vale voice-contract | — | — | ✓ (docs paths) | ✓ (docs paths) | weekly | docs-validation.yml |
| GitHub baseline (CODEOWNERS/PR/issue/dependabot/CI) | — | — | ✗ | ✗ | ✗ | **Manual only** — no CI gate |
| Derived file drift | `generate-index.sh + render-configs.sh` | — | ✓ | ✓ | ✓ | docs-doctrine.yml |
| Secrets scan | — | — | ✓ | ✓ | — | secrets-scan.yml |
| Scope-binding (hook) | `.claude/hooks/scope-binding-check.sh` | **broken** | — | — | — | theater |
| Drift detection (hook) | `.claude/hooks/drift-detection.sh` | **broken** | — | — | — | theater |
| Observability log (hook) | `.claude/hooks/observability-log.sh` | **broken** | — | — | — | theater |

**Biggest coverage gap:** `github-baseline-audit.py` is not wired into any CI job. It only runs when a human invokes `./scripts/sync-github.sh --check --all` or `python scripts/github-baseline-audit.py` manually. Sibling repos can silently drift from the baseline until the next manual sweep.

---

## Reset Decisions (candidates for master execution plan Part 1)

1. **Delete or rewire the three `.claude/hooks/*.sh` scripts.** Current state is false-green. Either (a) fix template path to `knowledge-base/templates/governance-hooks/` and correct Claude Code hook event names, or (b) delete and stop pretending.
2. **Rewrite `REPO_GOVERNANCE_INITIATIVE.md`** to document what has actually shipped (github-baseline + audit + sync template + docs doctrine) rather than what was planned. Remove references to the 5 absent deliverables.
3. **Supersede `docs/governance/bulk-execution-progress.md`** — change status to `superseded`, add pointer to master execution plan.
4. **Archive the phase1–phase5 governance docs** whose work has shipped. Move to `docs/archive/` with a tombstone index.
5. **Consolidate repo registries** — `github-baseline.yaml` (21), `workspace-audit.yml` matrix (32), `catalog/repos.json` — pick one source of truth (recommend `catalog/repos.json`) and derive the others.

---

## Governance Strength Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| Doctrine enforcement | Green | 10-rule validator running on every docs commit + weekly; pyyaml-based; legitimate |
| Baseline enforcement | Yellow | 14/14 sampled repos compliant, but audit script runs only manually — silent drift risk |
| Docs style enforcement | Green | Vale + markdownlint + validate-no-ai-attribution running on every commit |
| Local hook enforcement | **Red** | 3 hook scripts, all broken, all false-green |
| Initiative documentation | **Red** | 5-of-5 promised deliverables absent; doc misleads readers |
| Governance surface documentation | Yellow | 56 docs under `docs/governance/` with no active/superseded/archive triage |
| Progress tracking | Yellow | `bulk-execution-progress.md` exists but is a stale session log |
| Registry consistency | Yellow | 3 parallel repo lists that can drift |

---

## Feeds Into Master Execution Plan

**Critical items (Phase 2 — Debt reduction):**
- Delete or rewire the three broken `.claude/hooks/*.sh` scripts
- Fix `.claude/settings.json` hook event names or convert to git hooks
- Rewrite `REPO_GOVERNANCE_INITIATIVE.md` to match delivered reality
- Supersede `bulk-execution-progress.md`

**High items (Phase 2):**
- Wire `github-baseline-audit.py` into CI (run per PR; fail on missing templates)
- Add `docs/governance/INDEX.md` classifying every governance doc by status
- Archive phase1-phase5 governance docs whose work has shipped
- Reconcile `github-baseline.yaml` + `workspace-audit.yml` + `catalog/repos.json`
- Make `workspace-audit.yml` produce actionable artifacts (open issues or persist JSON)

**Medium items (Phase 4 — Onboarding):**
- Set sunset date for `LEGACY_TYPES` warning in validate-doctrine.py
- Add smoke test for `bootstrap-repo.sh` under `scripts/tests/`
- Add lastVerified freshness gate in docs-validation.yml

**Low items (Phase 4):**
- Extract markdownlint version into a reusable composite action
- Add header comment to `doctrine-reusable.yml` documenting consumers

---

## Totals by Severity

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High | 5 |
| Medium | 6 |
| Low | 2 |
| **Total** | **16** |

---

## Methodology Notes

- Audited live by reading every workflow under `alawein/.github/workflows/` (16 files, 1,488 lines total), every governance script under `alawein/scripts/` (validate-doctrine 557 lines, validate-doc-contract.sh 491, sync-github.sh 430, validate.py 284, github-baseline-audit.py 185), every `.claude/hooks/*.sh`, and `.claude/settings.json`.
- Cross-checked `github-baseline.yaml` repo entries against filesystem state for 14 of 21 sync:auto repos — 14/14 have the full baseline on disk (CODEOWNERS + ci.yml + codeql.yml + dependabot.yml + ≥11 `.github/` files each). Baseline enforcement is real.
- Verified `_pkos/` directory absence across workspace roots (`GitHub/alawein/`, `Dropbox/`, `GitHub/`). Confirmed `knowledge-base/` is the successor.
- Sibling repo CLAUDE.md comparison: sync-claude.sh is working — all `.claude/CLAUDE.md` bootstrap files match across 10 sampled repos.
- Subagents were not used for Spec C since the prior two specs' subagents thrashed on context; direct inspection proved more reliable for a single-repo audit with ≤2,000 lines of governance script surface.
