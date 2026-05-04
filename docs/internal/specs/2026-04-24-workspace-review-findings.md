---
title: Workspace Comprehensive Review — Findings
date: 2026-04-24
status: active
type: canonical
feeds: [master-execution-plan]
last_updated: 2026-04-24
---

# Workspace Comprehensive Review — Findings

**Date:** 2026-04-24
**Design spec:** [2026-04-24-workspace-review.md](2026-04-24-workspace-review.md)
**Scope:** alawein org workspace (~30 repos)

---

## Executive Summary

The workspace is Yellow. The governance framework exists and is structurally coherent, but enforcement is narrower than declared and the automation layer that should sustain compliance is broken or missing at every layer. The top external gaps are SHA pin maintenance (5 repos with floating `@v4`/`@main` tags, zero `dependabot.yml` files for the `github-actions` ecosystem), private-key patterns missing from all 8 sampled `.gitignore` files, and README structure violations in 6 repos that CI never catches because docs-validation runs only in the control-plane repo. The governance framework is internally consistent but miscalibrated: all six subsystems are either Undermaintained or Overspecified, which means the rules are often correct but the mechanisms to enforce them are absent, broken, or over-scoped for a solo workspace. The three highest-value quick wins are: (1) fix the four broken Claude Code hook event names in `.claude/settings.json` so governance automation actually fires, (2) add `*.pem` and `*.key` to `.gitignore` in all 8 repos via `sync-github.sh` (one propagation pass, zero repo-by-repo work), and (3) update `drift-detection.sh` to exit non-zero when the template source cannot be resolved so it stops reporting a false green on every run. The single most urgent action is closing the admin auth gap in bolts: the `/admin/*` panel is publicly accessible with no session check on the live product.

---

## Layer A — External Best-Practices Findings

### A1. Community Health Files

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| Community Health | README.md | all sampled | Pass | present in all 9 repos | — | — |
| Community Health | CONTRIBUTING.md | all sampled | Pass | present in all 9 repos | — | — |
| Community Health | CODE_OF_CONDUCT.md | all sampled | Pass | present in all 9 repos | — | — |
| Community Health | SECURITY.md | all sampled | Pass | present in all 9 repos | — | — |
| Community Health | LICENSE | all sampled | Pass | present in all 9 repos | — | — |
| Community Health | .github/ISSUE_TEMPLATE/ | meshal-web | Fail | absent at repo root | Add .github/ISSUE_TEMPLATE/ following alawein template | S |
| Community Health | .github/PULL_REQUEST_TEMPLATE.md | meshal-web | Fail | absent at repo root | Add .github/PULL_REQUEST_TEMPLATE.md following alawein template | S |

### A2. CI/CD and SHA Pinning

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| CI/CD Security | SHA pinning — actions/* (checkout, setup-node, etc.) | alawein, design-system, workspace-tools, bolts, repz | Pass | All uses: pinned to 40-char SHA (e.g. `actions/checkout@de0fac2e...`) | — | — |
| CI/CD Security | SHA pinning — reusable workflow ref | design-system, workspace-tools, bolts, repz, alembiq, knowledge-base | Pass | All reference `alawein/.github/workflows/*@ed5ed61aef28cbdd761eeb0654808833bc4564be` | — | — |
| CI/CD Security | SHA pinning — doctrine-reusable workflow ref | meshal-web, design-system (docs-doctrine.yml) | Fail | `alawein/alawein/.github/workflows/doctrine-reusable.yml@main` — mutable tag, not SHA | Pin to canonical SHA `ed5ed61aef28cbdd761eeb0654808833bc4564be` | S |
| CI/CD Security | SHA pinning — doctrine-reusable workflow ref | fallax | Partial | `doctrine-reusable.yml@e036032418348c7085ce1cd34eed6c3a4266fbb1` — SHA-pinned but different from canonical `ed5ed61...` | Update to canonical SHA `ed5ed61aef28cbdd761eeb0654808833bc4564be` | S |
| CI/CD Security | SHA pinning — actions/checkout, actions/setup-node | knowledge-base (career-profile-checks.yml, ci-app.yml, ci-smoke.yml, resume-latex.yml, smoke-production.yml) | Fail | `actions/checkout@v4`, `actions/setup-node@v4` — mutable tags | Pin to 40-char SHA | S |
| CI/CD Security | SHA pinning — actions/checkout, actions/setup-node | meshal-web (ci.yml, security.yml) | Fail | `actions/checkout@v4`, `actions/setup-node@v4` — mutable tags | Pin to 40-char SHA | S |
| CI/CD Security | SHA pinning — github/codeql-action | meshal-web (security.yml) | Fail | `github/codeql-action/init@v3`, `github/codeql-action/analyze@v3` — mutable tags | Pin to 40-char SHA | S |
| CI/CD Security | SHA pinning — actions/checkout, actions/setup-node, dorny/paths-filter | alembiq (ci.yml) | Fail | `actions/checkout@v4`, `actions/setup-node@v4`, `dorny/paths-filter@v3` — mutable tags (mixed: some steps SHA-pinned, some not) | Pin all uses to 40-char SHA | S |
| CI/CD Security | SHA pinning — actions/checkout, astral-sh/setup-uv | fallax (ci.yml, ci-smoke.yml) | Fail | `actions/checkout@v4`, `astral-sh/setup-uv@v6` — mutable tags | Pin to 40-char SHA | S |
| CI/CD Security | Permissions block — top-level `permissions: contents: read` | meshal-web, fallax | Partial | No top-level `permissions:` block in ci.yml | Add `permissions: contents: read` at workflow level | S |
| CI/CD Security | Permissions block — top-level `permissions: contents: read` | alawein (ci.yml) | Partial | No top-level `permissions:` block; relies on repo default | Add `permissions: contents: read` at workflow level | S |
| CI/CD Security | Concurrency block with `cancel-in-progress: true` | alawein, design-system, workspace-tools, knowledge-base, bolts, repz, alembiq, fallax | Pass | `concurrency:` block with `cancel-in-progress: true` present | — | — |
| CI/CD Security | Concurrency block with `cancel-in-progress: true` | meshal-web | Fail | No `concurrency:` block in ci.yml | Add `concurrency: group: ..., cancel-in-progress: true` | S |

### A3. Branch Protection and Secrets Hygiene

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| Secrets Hygiene | .env in .gitignore | bolts, repz, meshal-web, alembiq, design-system, knowledge-base | Pass | present in all 6 of these repos | — | — |
| Secrets Hygiene | .env in .gitignore | fallax, workspace-tools | Fail | `.env` absent from .gitignore | Add `.env` to .gitignore | S |
| Secrets Hygiene | *.pem in .gitignore | all sampled | Fail | `*.pem` absent from all 8 repos (bolts, repz, meshal-web, alembiq, fallax, design-system, workspace-tools, knowledge-base) | Add `*.pem` to .gitignore in all repos | S |
| Secrets Hygiene | *.key in .gitignore | all sampled | Fail | `*.key` absent from all 8 repos | Add `*.key` to .gitignore in all repos | S |
| Secrets Hygiene | node_modules/ in .gitignore | bolts, repz, meshal-web, design-system, workspace-tools, knowledge-base | Pass | present in all 6 of these repos | — | — |
| Secrets Hygiene | node_modules/ in .gitignore | alembiq, fallax | Fail | `node_modules/` absent from .gitignore | Add `node_modules/` to .gitignore | S |
| Secrets Hygiene | __pycache__/ in .gitignore | bolts, repz, alembiq, fallax, design-system, workspace-tools, knowledge-base | Pass | present in all 7 of these repos | — | — |
| Secrets Hygiene | __pycache__/ in .gitignore | meshal-web | Fail | `__pycache__/` absent from .gitignore (not a Python repo but still a gap) | Add `__pycache__/` to .gitignore | S |
| Secrets Hygiene | .DS_Store in .gitignore | bolts, repz, meshal-web, alembiq, design-system, knowledge-base | Pass | present in all 6 of these repos | — | — |
| Secrets Hygiene | .DS_Store in .gitignore | fallax, workspace-tools | Fail | `.DS_Store` absent from .gitignore | Add `.DS_Store` to .gitignore | S |
| Secrets Hygiene | .env.example | bolts, repz, meshal-web | Pass | present in all 3 product repos | — | — |
| Branch Model | feat/fix/chore naming documented | bolts, repz, meshal-web, design-system, workspace-tools | Pass | All 5 repos document branch prefixes (`feat/`, `fix/`, `docs/`, `chore/`, `test/`) in CONTRIBUTING.md | — | — |

### A4. OSS README Conventions

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| README Conventions | No emoji in headings | all sampled | Pass | No emoji found in any heading across all 9 repos | — | — |
| README Conventions | Factual one-sentence opener | design-system, workspace-tools, knowledge-base, bolts, repz | Pass | All open with repo name + factual one-sentence description | — | — |
| README Conventions | Factual one-sentence opener | alawein | Partial | Profile README opens with a person name, not a repo description; generated output so not a traditional code repo opener | Acceptable for a profile README; note in doc contract that profile READMEs follow different rules | — |
| README Conventions | Factual one-sentence opener | meshal-web | Partial | Opener is "Personal site for Meshal Alawein — Tokyo Dusk." — theme name appended reads as aesthetic, not factual description | Rewrite: "meshal-web is the personal site and portfolio for Meshal Alawein." | S |
| README Conventions | Factual one-sentence opener | alembiq | Partial | Opener is a run-on that leads with the failure-mode problem statement rather than a factual "Alembiq is X" sentence | Rewrite opener to: "Alembiq is LLM training, alignment, and evaluation infrastructure." then start problem context on the next line | S |
| README Conventions | Factual one-sentence opener | fallax | Partial | H1 "Fallax" is followed by bold-formatted opener `**Fallax** evaluates...` — bold name-in-body is a style affectation, not a clean opener | Remove bold; write as plain sentence | S |
| README Conventions | For-whom + differentiator paragraph | design-system, workspace-tools, bolts, repz | Partial | Each describes what it does but omits an explicit differentiator vs the obvious alternative (a generic npm monorepo, ad hoc scripts, a generic SaaS template) | Add one sentence per repo naming the alternative it replaces or why its approach is preferred | S |
| README Conventions | For-whom + differentiator paragraph | alawein | Fail | Profile README has no for-whom section (expected for a profile but is a gap vs the checklist criterion) | Out of scope for a profile README; record as N/A | — |
| README Conventions | For-whom + differentiator paragraph | knowledge-base | Partial | States it is "successor to _pkos/" but does not explain what _pkos was or why this approach differs | Add one sentence: "It replaces the retired _pkos repo and adds a dashboard, config-audit tooling, and a career lane on a single explicit schema contract." | S |
| README Conventions | For-whom + differentiator paragraph | fallax | Fail | "Why Fallax" section lists features only; no audience named, no alternative named | Add a paragraph: who this is for (researchers, engineers running evals), and what alternative it replaces (single-turn benchmarks) | S |
| README Conventions | Quick start with exact commands | alawein | Fail | Profile README has no quick-start section (expected for a profile) | N/A for a profile README; mark as exempted | — |
| README Conventions | Quick start with exact commands | design-system, workspace-tools, knowledge-base, bolts, repz, meshal-web, alembiq, fallax | Pass | All 8 non-profile repos include runnable commands | — | — |
| README Conventions | Stack listed | bolts, fallax, meshal-web | Pass | Explicit "Stack" or "Tech Stack" section present | — | — |
| README Conventions | Stack listed | design-system | Fail | No explicit stack section; Turborepo/TypeScript/Node not stated | Add a one-line "Stack" entry: TypeScript, Turborepo, Node.js | S |
| README Conventions | Stack listed | repz | Fail | No explicit "Stack" section; Vite + React Router + Supabase mentioned inline only | Add explicit "Stack" section | S |
| README Conventions | Stack listed | alembiq | Fail | No explicit "Stack" section; Python implied throughout but not declared | Add a one-line "Stack" entry: Python 3.12+, PyTorch, HuggingFace Transformers | S |
| README Conventions | Stack listed | workspace-tools, knowledge-base | Partial | Stack (Python, Next.js) is mentioned inline in descriptions but there is no dedicated "Stack" section | Add a brief "Stack" line | S |
| README Conventions | Stack listed | alawein | Fail | Profile README lists projects and focus areas but no technical stack | N/A for a profile README | — |
| README Conventions | Badges — version badges | meshal-web | Fail | TypeScript 5.7, React 19, Vite 7 version badges — all pin specific versions that will go stale | Remove version badges; keep only License badge | S |
| README Conventions | Badges — version badges | alembiq | Partial | CI badge (live, Pass) + Python 3.10+ version badge (unverifiable state) + License badge | Remove Python version badge; CI and License badges are acceptable | S |
| README Conventions | Badges — version badges | fallax | Partial | Python 3.10+ version badge + License badge; no CI badge | Remove Python version badge; consider adding a CI badge instead | S |
| README Conventions | Badges | alawein, design-system, workspace-tools, knowledge-base, bolts, repz | Pass | No badges or only license badges | — | — |
| README Conventions | Contribution path | design-system, alembiq, fallax | Pass | CONTRIBUTING.md explicitly linked in README | — | — |
| README Conventions | Contribution path | workspace-tools, knowledge-base, bolts, repz, meshal-web | Fail | CONTRIBUTING.md exists in each repo but is not linked or mentioned in README | Add a "Contributing" section with a link to CONTRIBUTING.md | S |
| README Conventions | Contribution path | alawein | Fail | Profile README has no contribution path (CONTRIBUTING.md exists but not linked) | Add a brief "Contributing" or "Contact" section linking CONTRIBUTING.md | S |

### A5. Conventional Commits and Semver

| Area | Criterion | Repo | Verdict | Evidence | Recommendation | Effort |
|------|-----------|------|---------|----------|----------------|--------|
| Conventional Commits | Commit format compliance | bolts | Pass | 20/20 commits follow `<type>(<scope>): <desc>` format | — | — |
| Conventional Commits | Commit format compliance | design-system | Pass | 19/20 commits follow conventional format; 1 violation: `Wave A: reconcile theme registry + tokens audit infrastructure (#11)` — no type prefix | Enforce with commitlint or pre-commit git hook | S |
| Conventional Commits | Commit format compliance | workspace-tools | Pass | 18/20 commits follow conventional format; 2 violations: `Merge pull request #7 from alawein/docs/...` (GitHub auto-merge message), `merge: integrate quality gates phases 4-5` (`merge` is not a valid conventional type) | Enforce with commitlint; configure `merge` as alias for `chore` or suppress GitHub auto-merge messages via squash-merge policy | S |
| Semver | Package version format | design-system | Pass | All 23 packages use `MAJOR.MINOR.PATCH` (e.g., `0.2.0`, `0.3.0`); no pre-release or malformed strings | — | — |

### A — Gap List

_Gaps from external standards with no internal governance equivalent._

- **SHA pin maintenance process**: `github-baseline.md` requires SHA-pinned Actions and names the `github-actions` Dependabot ecosystem as mandatory, but no repo in the workspace has a `dependabot.yml` configured for it, and no doc explains how to locate new SHAs or schedule pin bumps. The A3 audit found floating `@v4` / `@main` refs in knowledge-base, meshal-web, alembiq, and fallax — exactly the drift that Dependabot would catch. Recommendation: add a "Pin maintenance" section to `docs/governance/github-baseline.md` with the update workflow, and add a template `dependabot.yml` (schedule: weekly, `package-ecosystem: github-actions`) to `scripts/` or the `.github/` scaffold used by `sync-github.sh`. Effort: S.

- **Private key patterns in `.gitignore`**: `credential-hygiene.md` names `.env` as a required `.gitignore` entry but says nothing about `*.pem`, `*.key`, `*.p12`, or other private-key formats. The A4 audit found all 8 sampled repos missing both patterns. GitHub's own push-protection blocks known secret formats but does not substitute for gitignore-level prevention. Recommendation: add `*.pem`, `*.key`, and `*.p12` to the required `.gitignore` entries in `docs/governance/github-baseline.md` and propagate them via `sync-github.sh`. Effort: S.

- **Workflow-level `permissions` block**: `github-baseline.md` lists branch-protection rulesets as manual GitHub settings but has no rule requiring a `permissions:` block in every workflow file. Omitting it means the workflow inherits the org-level `GITHUB_TOKEN` scope, which defaults to `write` for contents — broader than needed. The A3 audit flagged meshal-web as missing this block entirely. Recommendation: add a rule to `docs/governance/github-baseline.md` requiring at minimum `permissions: read-all` at the workflow level with explicit write grants where needed, and add a lint check to `sync-github.sh`. Effort: S.

- **Workflow `concurrency` groups**: No governance doc requires `concurrency:` groups on push/PR workflows. Without them, multiple in-flight runs for the same branch queue and can race on deployments or artifact writes. The A3 audit flagged meshal-web as missing this. Recommendation: add a required `concurrency` block pattern to the workflow baseline section of `docs/governance/github-baseline.md` and to the reusable-workflow templates. Effort: S.

- **Stale version badge rule**: VOICE.md states "use badges only for current, verifiable state" but does not distinguish between CI-status badges (always live via Shields.io API) and version/release badges (go stale unless explicitly updated or automated). The A5 audit found meshal-web carrying stale version badges with no automated refresh. Recommendation: extend the badge rule in `docs/style/VOICE.md` to prohibit manually-maintained version badges unless Renovate or Dependabot is configured to update them, or replace them with CI-generated badges. Effort: XS.

---

## Layer C — Governance Framework Critique

| Subsystem | Verdict | Rationale | Recommendation |
|-----------|---------|-----------|----------------|
| Voice contract | Undermaintained | The forbidden-register list (23 phrases) is fully implemented in validate.py and enforced as a blocking gate on README/CLAUDE.md/prompt-kit surfaces — that part is sound. However, the structural README rules (factual opener, no motivational footers, contribution-path link) and the badge rule ("current, verifiable state only") have no corresponding validator checks; Layer A found 6 repos missing contribution-path links and stale version badges in meshal-web and alembiq with no automated enforcement. The mathematical-notation section is correctly marked Advisory but carries no scope qualifier, so it reads as governing all 30+ repos rather than only scientific-exposition surfaces. | (1) Add a `check_readme_structure` function to validate.py that flags missing contribution-path links and detects version badges (`![](https://img.shields.io/badge/...version...`) on blocking surfaces. (2) Add a scope note to the mathematical-notation section: "Applies to scientific papers, theses, and research docs; not to product or tooling repos." Effort: S. |
| Enforcement tiers | Undermaintained | "Blocking" tier declared in VOICE.md and CLAUDE.md covers README.md, CLAUDE.md, AGENTS.md, and prompt kits, but docs-validation.yml only runs in the `alawein` control-plane repo; the 15 `sync:auto` sibling repos have no docs-validation workflow, and Layer A found README violations in meshal-web, alembiq, and fallax that CI never caught | Propagate docs-validation.yml (or a trimmed version covering forbidden-register + opener checks) to all `sync:auto` repos via `sync-github.sh`; or document that "Blocking" is limited to the control plane and rename the tier "Control-plane Blocking" for honesty |
| Documentation doctrine | Overspecified | The documentation-contract.md imposes a strict 30-day `last-verified` SLA on canonical docs (AGENTS.md, CLAUDE.md, SSOT.md) that is realistic only if every doc is actively reviewed monthly; LESSONS.md last_updated is 2026-03-26 (29 days old, just within the window), but 14 of the 50 non-archive governance docs carry last_updated dates before 2026-03-25 with no CI staleness gate to catch them — the SLA creates a compliance theatre where the field gets bumped without genuine re-verification | Relax canonical-doc SLA to 60 days for a solo workspace, or add a CI step to `docs-validation.yml` that fails if any non-archive governance doc's `last_updated` predates a rolling 90-day window, converting the field from cosmetic metadata into an enforced signal |
| Workflow baseline | Undermaintained | ci-node.yml and ci-python.yml both declare `permissions: contents: read` and cache setup (npm/pip) — structurally sound; github-baseline.md correctly requires SHA-pinning and names `workflow_ref` as the immutable ref mechanism, but it contains no documented process for updating the `workflow_ref` SHA when the reusable workflows change, and there is no Dependabot config for the `github-actions` ecosystem in any repo; the 4 repos with floating `@v4` / `@main` pins (knowledge-base, meshal-web, alembiq, fallax) are the direct consequence | Add a "Pin maintenance" section to `docs/governance/github-baseline.md` with the bump workflow (find new SHA via GitHub API or release page, update `github-baseline.yaml workflow_ref` and all consumer `.github/workflows/*.yml` refs), and add a `dependabot.yml` template (schedule: weekly, `package-ecosystem: github-actions`) to the scaffold used by `sync-github.sh` |
| Validation scripts | Undermaintained | validate-doc-contract.sh is well-structured and covers required-file existence, frontmatter keys, freshness fields, UTF-8 BOM, and local link integrity — the core logic is sound; validate-doctrine.py correctly enforces 10 naming/type/sync/sla rules; however, drift-detection.sh silently no-ops on any file whose template counterpart is missing (uses `continue` when `"$template_source/$file"` does not exist) and defaults to `../../../knowledge-base` as its template root — a path that resolves to nothing when run from most sibling repos — meaning the drift hook passes clean on every repo that doesn't have the knowledge-base at exactly that relative depth | Fix drift-detection.sh to emit a warning and exit non-zero when the template source cannot be resolved (replace silent `continue` with an explicit error), or reconfigure the hook to use an absolute path to the workspace `knowledge-base/` directory; add a smoke-test to CI verifying the hook exits non-zero on an introduced drift |
| Governance overhead | Overspecified | The governance directory contains 51 non-archive docs for a ~20-repo solo workspace; at least 14 carry last_updated dates before 2026-03-15 (45+ days stale), several (phase1-design-branding-analysis-*.md, bulk-execution-progress.md, remaining-steps-per-repo.md, dashboard-rollout-playbook.md) document one-time migration work that is now complete and have no archive path; the REPO_GOVERNANCE_INITIATIVE.md referenced in the task does not exist, and 3 deliverables it would have promised (repository-standardization-program.md, a templates/ directory, migration-checklist.template.md) are absent — the initiative was planned but never landed | Declare a governance doc lifecycle: active, completed, archived; move all one-time-migration docs under `docs/governance/archive/`; cap live governance docs at ~20 (one per functional domain); add a CI staleness gate for docs older than 90 days without an explicit `sla: none` exemption |

---

## Layer B — Compliance Action Table

### Spot-Check Accuracy Notes

**Bolts spot-check (2026-04-24):** 3/3 Criticals confirmed. (1) `account/page.tsx` contains hardcoded `mockUser` with name/email/purchases and no auth check — confirmed. (2) `admin/page.tsx` has no auth gate at the component level (fetches `/api/revenue` via react-query with no session check visible) — confirmed. (3) `node_modules/@alawein/tokens` is v0.1.0 while `package.json` declares `"@alawein/tokens": "0.2.0"` — stale install confirmed; spec framing is accurate.

**Design-system spot-check (2026-04-24):** 3/3 Criticals confirmed. `grep -i "errorboundary|emptystate|loadingspinner|pageloader"` on `@alawein/ui/src/index.ts` returned NONE FOUND — all three component gaps are real.

**Alembiq spot-check (2026-04-24):** Legacy `import neper` not confirmed — source files use `from alembiq.*` throughout (rename is complete). CI SHA matches canonical `ed5ed61aef28cbdd761eeb0654808833bc4564be` exactly.

**Alawein control plane spot-check (2026-04-24):** Broken hook event names confirmed — `.claude/settings.json` contains no `hooks:` key at all; its `_note` field explicitly documents that the three hook scripts (`scope-binding-check`, `observability-log`, `drift-detection`) are not wired as Claude Code hooks and should instead be git hooks. drift-detection.sh no-op confirmed — script uses `template_source=../../../knowledge-base` (relative path that resolves to nothing in most contexts) and silently `continue`s when template files are missing, printing "No governance drift detected." regardless.

**Overall spec accuracy:** 10/11 findings confirmed (alembiq legacy-import finding was incorrect; all others held). Specs are reliable as Layer B input — the one false positive (neper imports) is a resolved migration item; the structural and security findings are accurate.

### Quick Wins (High impact, S–M effort)

| Repo | Severity | Finding | Area | Gov Rule | Effort | Source |
|------|----------|---------|------|----------|--------|--------|
| bolts | Critical | Admin panel publicly accessible — no auth check on `/admin/*` routes | Security | credential-hygiene.md — auth gate required on protected routes | S | Spec A §bolts |
| bolts, gymboy | Critical | Installed `@alawein/tokens` v0.1.0 / `@alawein/theme-base` v0.1.0 while `package.json` declares 0.2.0 / 0.3.0 — lockfile never updated (cross-cutting: 2+ confirmed, 2 unverified) | DS Adoption | design-system adoption SLA — declared version must match installed version | S | Spec A §bolts, §gymboy |
| llmworks | Critical | README claims "OpenAI and Anthropic integrations where configured" — zero SDK import exists | Portfolio | VOICE.md — no unverifiable capability claims on portfolio surfaces | S | Spec A §llmworks |
| alawein | Critical | `.claude/settings.json` hook event keys `pre-commit`, `post-commit`, `hourly` are not valid Claude Code events — hooks never fire | Governance | Claude Code hook contract — event names must be `PreToolUse`, `PostToolUse`, `Stop`, `UserPromptSubmit`, `SessionStart` | S | Spec C §broken-hooks |
| alawein | Critical | `drift-detection.sh` references deleted `_pkos/` directory — always reports "No governance drift detected" regardless of state | Governance | governance-hooks contract — drift detection must resolve template source | S | Spec C §broken-hooks |
| scribd | High | Duplicate component directories — `app/components/` contains MD5-identical copies of root `components/`; unused `theme-provider.tsx` | Code Quality | No explicit rule — cross-cutting hygiene expectation | S | Spec A §scribd |
| atelier-rounaq | Critical | Broken product images — all collection pieces reference `/images/*.jpg` paths that do not exist | Portfolio | portfolio presentation standard — live product must not show broken assets | S | Spec A §atelier-rounaq |
| atelier-rounaq | Critical | `tokens.ts` duplicate exports — `tokens` and `DesignTokens` declared twice; two contradictory palettes | Code Quality | No explicit rule — TypeScript strict contract | S | Spec A §atelier-rounaq |
| atelier-rounaq | High | TanStack Query installed but fully unused (~50KB bundle weight); `@react-three/fiber` + `@react-three/drei` + `@react-three/xr` in deps with zero usage (~2MB potential) | Performance | No explicit rule — dead dependency hygiene | S | Spec A §atelier-rounaq |
| atelier-rounaq | High | Ore/mining scaffold contamination — `MiningAnimations.tsx` and `ore-showcase-data.ts` have no place in a luxury fashion codebase | Code Quality | No explicit rule — product coherence | S | Spec A §atelier-rounaq |
| 4 product repos (bolts, repz, gymboy, attributa) | High | TypeScript strict mode disabled or partial — 204 `any` (repz), 27 (gymboy), 6 (attributa), strict:false; cross-cutting in 4 repos | Code Quality | `@alawein/tsconfig` base — strict mode required | S–M | Spec A §cross-cutting |
| knowledge-base, meshal-web, alembiq, fallax | High | SHA pinning failures — `actions/checkout@v4`, `actions/setup-node@v4`, `@main` mutable tags across 4 repos; no `dependabot.yml` for `github-actions` ecosystem in any workspace repo | CI Security | github-baseline.md — SHA pinning required on all Actions | S | Spec A §A2, A gap |
| meshal-web | High | Missing `permissions:` block and `concurrency:` group in `ci.yml` | CI Security | github-baseline.md — permissions and concurrency required | S | Spec A §A2 |
| all product repos (8) | High | `*.pem` and `*.key` absent from `.gitignore` in all 8 sampled repos — private key patterns unprotected | Secrets Hygiene | credential-hygiene.md — `*.pem` and `*.key` must be in `.gitignore` | S | Spec A §A3 |
| alawein | High | `REPO_GOVERNANCE_INITIATIVE.md` promises 5 deliverables — none exist on disk; practical baseline has shipped | Governance | Documentation doctrine — canonical docs must reflect delivered reality | M | Spec C §initiative |
| alawein | High | `docs/governance/bulk-execution-progress.md` marked `type: canonical, status: active` but is a stale 2026-03-12/13 session log with retired repo names | Governance | Documentation doctrine — active canonical docs must remain current | S | Spec C §stale-session-log |
| design-system | High | Installed `theme-base` v0.1.0 in bolts/gymboy despite 0.3.0 published — no workspace `audit:published-vs-installed` script exists | DS Tooling | design-system adoption SLA — published version drift must be detected | S | Spec B §design-system |
| knowledge-base | High | `services/vscode-extension/` untracked by git, v0.1.0, ~200 `node_modules` subdirs on disk — abandoned sidecar masquerading as active service | Repo Hygiene | No explicit rule — clean repo root contract | S | Spec B §knowledge-base |
| workspace-tools | High | `consolidation_toolbox.py` at root is an unverified backward-compat shim with no confirmed callers | Python | No explicit rule — dead code hygiene | S | Spec B §workspace-tools |

### Critical Path (High impact, L–XL effort)

| Repo | Severity | Finding | Area | Gov Rule | Effort | Source |
|------|----------|---------|------|----------|--------|--------|
| bolts | Critical | Account/dashboard pages use mock `John Doe` data with no auth gate — fabricated purchase history on live product | Security/Portfolio | credential-hygiene.md — authenticated UX must use real session | L | Spec A §bolts |
| repz | Critical | All AI service stubs shipped as product features — `WorkoutAI.analyzeForm()` returns hardcoded `score: 85`, `NutritionAI` hardcoded, TensorFlow/PoseNet installed but unwired | Portfolio | VOICE.md — no unverifiable capability claims | L | Spec A §repz |
| llmworks | Critical | All benchmark/eval execution simulated — `BenchmarkRunner.tsx:129` uses `Math.random()`, `DebateMode` uses `setTimeout` mocks, zero OpenAI/Anthropic SDK imports | Portfolio | VOICE.md — no unverifiable capability claims | XL | Spec A §llmworks |
| scribd | Critical | Stripe webhook and entitlement fulfillment not implemented on live paid product — `paymentOption`/`giftEmail`/`promoCode` silently discarded | Commerce | No explicit rule — commercial surfaces must fulfill stated promises | XL | Spec A §scribd |
| attributa | Critical | Live `attributa.dev` shows fitness RPG, not the attribution intelligence product — no routes for `/scan`, `/workspace`, `/results`, `/settings` | Portfolio | VOICE.md — portfolio surfaces must accurately represent the product | S→L | Spec A §attributa |
| gymboy | Critical | `App.tsx` monolith at 3,500+ lines — blocking decomposition into feature modules | Architecture | No explicit rule — maintainability threshold | XL | Spec A §gymboy |
| atelier-rounaq | Critical | `design/utilities.ts`, `lib/auth.ts`, `lib/booking.ts` missing — build fails on any protected route | Architecture | No explicit rule — build must pass | M | Spec A §atelier-rounaq |
| atelier-rounaq | High | Client portal lazy-loads 5 non-existent components — throws at runtime if any protected route is hit | Architecture | No explicit rule — runtime safety | L | Spec A §atelier-rounaq |
| design-system | Critical | `@alawein/ui` missing `ErrorBoundary` — 7 of 8 active products duplicate this locally (cross-cutting) | UI Primitives | design-system adoption SLA — shared primitives must be available in `@alawein/ui` | L | Spec B §design-system |
| design-system | Critical | `@alawein/ui` missing `EmptyState` — 5 products duplicate; llmworks silently omits it (cross-cutting) | UI Primitives | design-system adoption SLA — shared primitives must be available in `@alawein/ui` | M | Spec B §design-system |
| design-system | Critical | `@alawein/ui` missing `LoadingSpinner`/`PageLoader` — all 8 products use ad-hoc Suspense fallbacks (cross-cutting) | UI Primitives | design-system adoption SLA — shared primitives must be available in `@alawein/ui` | M | Spec B §design-system |
| knowledge-base | Critical | Dashboard consumes zero `@alawein/*` packages — workspace's own operator surface does not use the DS; hardcodes light theme | DS Adoption | design-system adoption SLA — workspace operator surfaces must demonstrate DS | L | Spec B §knowledge-base |
| workspace-tools | Critical | Unresolved 2026-03-29 error-handling audit — 2,099 lines of findings at repo root for 25+ days including 4 Critical `FileNotFoundError`/`JSONDecodeError` bugs in `core.py:384-385` | Python | No explicit rule — open audit debt must be resolved or archived | L | Spec B §workspace-tools |
| workspace-tools | High | `work_orchestration.py` at 4,155 lines — single-file monolith; blocks per-module test isolation | Architecture | No explicit rule — maintainability threshold | L | Spec B §workspace-tools |
| workspace-tools | High | 8+ sidecar subprojects (`dotnet-kilo`, `profile-platform`, `gmail-ops`, `ingesta`, `clis/mobius-cli`) with unclear scope in operator repo | Architecture | No explicit rule — scope boundary | XL | Spec B §workspace-tools |
| workspace-tools | High | `@alawein/standards` v1.0.0 (legacy Möbius) overlaps with `eslint-config`/`prettier-config`/`tsconfig` v0.1.0 — consumers pick at random | DX | No explicit rule — single canonical config source | M | Spec B §workspace-tools |
| attributa | High | NLP analyzer stub returns hardcoded `score: 0.5`; DetectGPT curvature logic real but unwired — core product feature is non-functional | Feature | VOICE.md — no unverifiable capability claims | L | Spec A §attributa |
| repz | High | TypeScript strict mode disabled with 204 `any` usages | Code Quality | `@alawein/tsconfig` base — strict mode required | L | Spec A §repz |
| alawein | High | `github-baseline-audit.py` not wired into any CI job — sibling repos can silently drift from baseline until next manual sweep | CI/Governance | github-baseline.md — baseline enforcement must be automated | M | Spec C §enforcement |

### Deferred (Low impact)

| Repo | Severity | Finding | Area | Gov Rule | Effort | Source |
|------|----------|---------|------|----------|--------|--------|
| meshal-web | High | LinkedIn not surfaced in nav/footer/hero (contact.ts has the URL) | Portfolio | No explicit rule | S | Spec A §meshal-web |
| 8 freeze-candidate research repos | Medium | 8 research repos (edfp, loopholelab, maglogic, qmatsim, qmlab, qubeml, scicomp, spincirc) catalog status still `active` despite no feature commits since ≤2026-04-10 | Catalog Hygiene | catalog/repos.json must reflect actual lifecycle | S | Spec D |
| spincirc, maglogic, qmatsim | Medium | `claude-code-guide.jsx` and `claude-code-superprompt.jsx` at repo roots — agent scaffold artifacts on public profiles | Repo Hygiene | No explicit rule — clean repo root contract | S | Spec D §scaffolding |
| workspace-tools | Medium | `testing/test-all.sh` standalone dir vs `tests/` containing actual pytest suite — two test dirs | Structure | No explicit rule | S | Spec B §workspace-tools |
| workspace-tools | Medium | `mcp/` (docs only) vs `mcps/` (code) — pluralization duplicate dirs | Structure | No explicit rule | S | Spec B §workspace-tools |
| workspace-tools | Medium | `state/` contains 5 versioned `workspace-clean-slate` rollouts (v1–v5) | Repo Hygiene | No explicit rule | S | Spec B §workspace-tools |
| knowledge-base | Medium | `out/` and `output/` coexist at root — semantic collision | Structure | No explicit rule | S | Spec B §knowledge-base |
| knowledge-base | Medium | `MASTER_REFERENCE.md` is generated output but lives next to source-of-truth docs — easily hand-edited | Docs | Documentation doctrine — generated outputs must be identifiable | S | Spec B §knowledge-base |
| design-system | Medium | `@alawein/morphism-themes` status ambiguous — described as archived but no deprecation field in `package.json` | DX | No explicit rule | S | Spec B §design-system |
| design-system | Medium | `governance-audit.json` embeds absolute Windows paths — reports non-portable across machines/CI | Governance | No explicit rule | S | Spec B §design-system |
| alawein | Medium | `github-baseline.yaml` (21 repos) vs `workspace-audit.yml` matrix (32 repos) vs `catalog/repos.json` — three divergent repo registries | Data Consistency | No explicit rule — single SSOT for repo registry | M | Spec C §registries |
| alawein | Medium | `validate-doctrine.py` allows `LEGACY_TYPES` as warnings indefinitely — no sunset date | Governance | Documentation doctrine — legacy type grace period must be bounded | S | Spec C §doctrine |
| repz | Medium | 71 local `src/components/ui/` files shadow `@alawein/ui` without explicit ownership boundary | DS | design-system adoption SLA | S | Spec A §repz |
| bolts | Medium | Affiliate route stub and refund notification missing — stubs log to console in production | Architecture | No explicit rule | M | Spec A §bolts |
| scribd | Medium | Monolithic client page at 1,167 lines with `"use client"` — forces entire storefront to CSR | Performance | No explicit rule | M | Spec A §scribd |
| meshal-web | Medium | `@alawein/theme-base` CSS not consumed — 1,360-line `globals.css` hand-duplicates all token values | DS Adoption | design-system adoption SLA | L | Spec A §meshal-web |

### Rule Changes (Fix the governance rule, not the repo)

| Repo | Finding | Current Rule | Recommended Rule Change | Source |
|------|---------|-------------|------------------------|--------|
| all repos | Freshness SLA violations on governance docs — 14 docs carry `last_updated` dates before 2026-03-25 with no CI gate; 30-day SLA is unrealistic for a solo workspace | documentation-contract.md imposes 30-day `last-verified` SLA on canonical docs | Relax SLA to 60–90 days for solo workspace, or add a CI staleness gate that enforces the field as an actual checked signal rather than a bumped timestamp; mark migration docs with `sla: none` | Spec C §C3 |
| alawein | Governance document volume — 56 docs under `docs/governance/` with no lifecycle triage; phase1–phase5 rollout docs for completed work remain `status: active` | No explicit governance-doc lifecycle rule; documentation-contract.md does not distinguish active from completed work | Add a governance-doc lifecycle (`active`, `completed`, `archived`); require completed migration/phase docs to move to `docs/archive/` within 30 days of the work shipping; cap live governance docs at ~20 | Spec C §C6 |
| alawein | `bulk-execution-progress.md` and session-log artifacts remain `status: active` despite documenting completed one-time migrations — governance overhead, not repo debt | documentation-contract.md does not define a supersession path for operational session logs | Add a `status: superseded` value to the doctrine type contract with a required `superseded_by:` field pointing to the successor document; gate `status: superseded` docs from showing up in freshness validation | Spec C §C6 |
| alawein | Docs-validation CI runs only in the `alawein` control-plane repo — README violations in meshal-web, alembiq, fallax never caught | Enforcement tiers in VOICE.md declare README.md as "Blocking" but the blocking gate only covers the control-plane repo | Either propagate a trimmed `docs-validation.yml` to all `sync:auto` sibling repos via `sync-github.sh`, or rename the tier "Control-plane Blocking" to accurately describe the actual scope | Spec C §C2 |
| all repos | SHA pinning maintenance process undocumented — github-baseline.md requires SHA-pinned Actions but has no documented update process and no `dependabot.yml` template for `github-actions` ecosystem | github-baseline.md requires SHA pinning but contains no pin-maintenance workflow | Add a "Pin maintenance" section to `github-baseline.md` with the SHA-bump process; add a `dependabot.yml` template (schedule: weekly, `package-ecosystem: github-actions`) to the scaffold used by `sync-github.sh` | Spec A §A-gap |
| all repos | `*.pem`, `*.key`, `*.p12` absent from required `.gitignore` entries in governance docs despite being absent from all 8 sampled repos | credential-hygiene.md names `.env` as a required `.gitignore` entry but does not name private-key file patterns | Add `*.pem`, `*.key`, `*.p12` to the required `.gitignore` entries in `credential-hygiene.md` and propagate via `sync-github.sh` | Spec A §A-gap |

---

## Cross-Cutting Recommendations

### 1. Declare the rule and ship the mechanism together

`github-baseline.md` requires SHA-pinned Actions and names the `github-actions` Dependabot ecosystem as mandatory, but no repo in the workspace has a `dependabot.yml` configured for it, and no doc explains how to locate or rotate SHAs — so the 5 repos with floating `@v4`/`@main` tags are the predictable outcome: the rule exists but the upkeep path does not. Add a "Pin maintenance" section to `github-baseline.md` with the SHA-bump workflow and add a `dependabot.yml` template (schedule: weekly, `package-ecosystem: github-actions`) to the scaffold used by `sync-github.sh`.

### 2. Scope enforcement tiers to match actual enforcement reach

VOICE.md and the alawein CLAUDE.md declare README.md as a "Blocking" surface, but docs-validation.yml runs only in the `alawein` control-plane repo; the 15 `sync:auto` sibling repos have no docs-validation workflow, and Layer A confirmed README violations in meshal-web, alembiq, and fallax that CI never caught. Either propagate a trimmed docs-validation workflow to all `sync:auto` repos via `sync-github.sh`, or rename the tier "Control-plane Blocking" so the label accurately describes the actual enforcement boundary.

### 3. Fix automation that silently no-ops

The workspace has three automation promises that do not run: the Claude Code hooks in `.claude/settings.json` use invalid event names (`pre-commit`, `post-commit`, `hourly`) and never fire; `drift-detection.sh` uses a relative path (`../../../knowledge-base`) that resolves to nothing in most contexts and unconditionally prints "No governance drift detected."; and `github-baseline-audit.py` is not wired into any CI job. Fix the hook event names to valid Claude Code events (`PreToolUse`, `PostToolUse`, `Stop`), make `drift-detection.sh` exit non-zero when the template source cannot be resolved, and wire `github-baseline-audit.py` into the docs-validation workflow.

### 4. Archive completed work and stop treating session logs as canonical docs

REPO_GOVERNANCE_INITIATIVE.md promises 5 deliverables that do not exist; `bulk-execution-progress.md` is marked `type: canonical, status: active` but is a stale 2026-03-12 session log; 14 of 51 governance docs carry `last_updated` dates more than 45 days stale with no CI gate. Layer C confirmed the 30-day SLA creates compliance theater — the field gets bumped without re-verification. Introduce a governance-doc lifecycle (`active`, `completed`, `archived`), move all one-time-migration docs to `docs/governance/archive/` within 30 days of the work shipping, and add a CI staleness gate that enforces the `last_updated` field on non-archived docs with a 90-day rolling window.

### 5. Close the design-system version contract with an automated check

`@alawein/tokens` v0.2.0 and `@alawein/theme-base` v0.3.0 are published, but bolts and gymboy have v0.1.0 installed in `node_modules` and the `knowledge-base` dashboard consumes zero `@alawein/*` packages at all. Layer C confirmed badge validation is not enforced and no `audit:published-vs-installed` script exists. Add a workspace-level `audit:published-vs-installed` script (analogous to `audit:registry` in design-system) that compares the latest published version of each `@alawein/*` package against what each consumer repo has installed, and run it as part of the reusable CI workflow so version drift becomes a CI signal rather than a discovered surprise.
