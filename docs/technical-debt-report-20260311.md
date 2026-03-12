# Technical Debt & Code Quality Report

**Scope:** 24 git repositories under the `alawein/` organisation  
**Analysis Date:** 2026-03-11  
**Repositories Analysed:** `attributa`, `bolts`, `gainboy`, `devkit`, `event-discovery-framework`, `helios`, `llmworks`, `alawein` + 16 others  

---

## Executive Summary

The workspace is mid-stream through a large cross-repo "workspace standardisation" campaign (P1-P20) and a design-system migration. Several critical issues were found: broken Vercel deployment configurations, an active identity/naming crisis in `gainboy`, a dual test-framework conflict in `bolts`, widespread ESLint config fragmentation, and multiple repos sitting on a mid-flight local branch with uncommitted changes. The most urgent items require action before the next deployment.

---

## Severity Scale

| Level | Meaning |
|-------|---------|
| 🔴 CRITICAL | Blocks CI/CD or production deployments |
| 🟠 HIGH | Causes build failures, test instability, or security risk |
| 🟡 MEDIUM | Creates maintainability debt or developer friction |
| 🟢 LOW | Code quality / style / minor inconsistency |

---

## Critical Findings

### 🔴 CRITICAL-1 — `gainboy` package name identity crisis

**Repo:** `gainboy/`  
**File:** `gainboy/package.json` line 2  
**Evidence:** `"name": "gymboy-app"` — the package name is `gymboy-app`, the directory is `gainboy/`, but the GitHub repo is `alawein/gainboy`.

**Commit history trail:**
- `2026-02-26` — `rebrand: rename Gainboy to Gymboy to match gymboy.coach domain`
- `2026-03-06` — `refactor: rename gainboy to gymboy across all files` ← applied ON TOP of the previous rebrand (double rename)
- Dependabot PRs, CI workflows, and devkit references still use `gainboy`

**Impact:** Any script reading `package.json#name` receives `gymboy-app`. Internal cross-references (SSOT.md, CI badge URLs, Vercel project name) are inconsistent.

**Action:** Decide on the canonical name. Apply a single coordinated rename across `package.json`, `index.html`, `README.md`, `SSOT.md`, Vercel project name, and all CI workflow names. Do not apply another automated rename on top of existing renames.

---

### 🔴 CRITICAL-2 — `attributa` will fail Vercel deployment due to `file:` dependency reference

**Repo:** `attributa/`  
**File:** `attributa/package.json` line 6  
**Code:** `"@alawein/ui": "file:../devkit/packages/ui"`

**Problem:** `file:` protocol references resolve from the local filesystem. Vercel clones only the `attributa` repository — `../devkit/packages/ui` does not exist in that clone context.

**Comparison:** `llmworks` already fixed this on 2026-03-07 with commit `Switch @alawein/ui from file: to github: for Vercel deploys`. Attributa has not received the same fix.

**Action:** Change to a GitHub-hosted reference: `"@alawein/ui": "github:alawein/devkit#main&path=packages/ui"` or publish `@alawein/ui` to npm/GitHub Packages.

---

### 🔴 CRITICAL-3 — Multiple repos on mid-flight local branch with uncommitted source code

**Branch:** `chore/hard-cutover-20260311` (local only, not pushed)  
**Repos affected:** `gainboy/`, `devkit/`, `event-discovery-framework/`, `attributa/`, `bolts/`

**Uncommitted modifications by repo:**

| Repo | Modified Files (uncommitted) |
|------|------------------------------|
| attributa | `.github/workflows/status.yml`, `CONTRIBUTING.md`, `docs/Architecture-Audit.md`, `docs/README.md`, `docs/User-Manual.md`, **`src/components/ui/quick-actions.tsx`** |
| bolts | `.github/CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `docs/DEPLOYMENT_EXECUTION_STATUS.md`, `docs/DEPLOYMENT_READINESS_SUMMARY.md`, `docs/README.md`, `docs/resources/Plans/_EXECUTION_COMPLETION_STATUS.md` |
| gainboy | `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `SSOT.md`, `docs/README.md`, `docs/architecture/STRUCTURE_DECISION.md` |
| devkit | `AGENTS.md`, `CLAUDE.md`, `README.md`, `SSOT.md`, `apps/storybook/.storybook/preview.ts`, `docs/README.md`, `docs/aw-devkit-retirement.md`, `packages/theme-luxury/index.css`, `packages/theme-luxury/package.json`, `packages/tokens/index.css`, untracked `tokens/` directory |
| event-discovery-framework | `AGENTS.md`, `CHANGELOG.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `DNS_SETUP.md`, `LESSONS.md`, `MEETING_BRIEF.md`, `README.md`, `SETUP_INSTRUCTIONS.md`, `SSOT.md`, `docs/index.html`, `pyproject.toml`, `scripts/setup_github.sh` |

**Highest risk:** `attributa/src/components/ui/quick-actions.tsx` is a production source file sitting uncommitted alongside doc changes — it will be lost if the working tree is cleaned.

**Action:** Push the `chore/hard-cutover-20260311` branch and open PRs for each repo, or stash with labelled stash entries. Do not leave source code changes uncommitted.

---

### 🔴 CRITICAL-4 — `bolts` has both Jest AND Vitest configured simultaneously

**Repo:** `bolts/`  
**Files:** `bolts/jest.config.js`, `bolts/vitest.config.ts`, `bolts/package.json`

**Evidence:**
- `"jest": "^29.7.0"` listed in `dependencies`
- `"vitest": "4.0.18"` listed in `devDependencies`
- `"test": "jest"` script runs Jest
- `vitest.config.ts` defines coverage thresholds that are never enforced because `npm test` runs Jest

**Impact:** Tests run with Jest but the `vitest.config.ts` coverage thresholds (80% lines/functions, 70% branches) are phantom gates — never evaluated. Developers writing Vitest-style tests (`vi.mock`, `vi.fn`) may produce tests that silently don't run under Jest.

**Action:** Pick one framework. Vitest is the standard across `gainboy` and `llmworks`. Remove the unused framework's config file and its package dependency.

---

## High Severity Findings

### 🟠 HIGH-1 — `@alawein/eslint-config` removed from 3 repos but still present in `gainboy`

**Root cause:** `devkit/packages/eslint-config` had a version conflict with `@eslint/js` (v9 vs v10), causing CI failures across the workspace. Instead of fixing the root package, each repo received emergency patches:

| Repo | Fix commit date | Fix applied |
|------|----------------|-------------|
| attributa | 2026-03-10 | Inline eslint config, remove `@alawein/eslint-config`; downgrade `@eslint/js` to v9 |
| llmworks | 2026-03-09 | Inline eslint config; pin `@eslint/js` to v9 |
| bolts | 2026-03-09 | Inline eslint config; switch to `eslint` directly |
| **gainboy** | **not yet fixed** | **Still has `"@alawein/eslint-config": "file:../devkit/packages/eslint-config"` in `package.json`** |

**Action:** Either fix `devkit/packages/eslint-config` for v9 compatibility and republish, or remove the dep from `gainboy` before its CI fails like the others did. This is imminent.

---

### 🟠 HIGH-2 — `@alawein/ui` vs `@malawein/ui` npm scope conflict

**Repos:** `attributa`, `llmworks`, `devkit`

**Timeline of conflicting commits:**
- `devkit` 2026-03-04: `fix: rename npm scope from @alawein to @malawein`
- `attributa` 2026-03-04: `feat: migrate to @alawein/ui shared component library`
- `llmworks` 2026-03-04: `feat: migrate to @malawein/ui shared component library (#1)` (note: `@malawein`)
- `attributa` 2026-03-06: `feat: merge design system migration - @malawein/ui components` (note: `@malawein`)

**Current state:** `devkit/packages/ui/package.json` says `"name": "@alawein/ui"` (the rename to `@malawein` was apparently reverted or partial). Import paths in `attributa/src/` and `llmworks/src/` may be split across both package names.

**Action:** Grep all `import` statements for both `@alawein/ui` and `@malawein/ui`. Standardise on `@alawein/ui` to match the package's current name.

---

### 🟠 HIGH-3 — `attributa` has a known esbuild vulnerability from Vite 5 (llmworks already patched this)

**Repo:** `attributa/`  
**File:** `attributa/package.json`  
**Current:** `"vite": "^5.4.10"`  
**Pending Dependabot PR:** `dependabot/npm_and_yarn/vite-7.3.1`

`llmworks` committed `chore: upgrade vite 5->7, plugin-react to 5.1.4 to fix esbuild vuln` on 2026-03-03. `gainboy` already runs `"vite": "^7.2.6"`. Attributa is the only repo still on Vite 5 with the known vulnerability.

**Action:** Merge the `vite-7.3.1` Dependabot PR in `attributa`. Also review other pending Dependabot PRs in attributa: `pdfjs-dist-5.4.530`, `react-day-picker-9.13.0`, `tailwind-merge-3.4.0`.

---

### 🟠 HIGH-4 — `bolts` uses deprecated `next export` command (removed in Next.js 14+)

**Repo:** `bolts/`  
**File:** `bolts/package.json`, `"scripts"` section  
**Code:** `"export": "next export"`

`next export` was removed in Next.js 13.3+. Bolts is on **Next.js 16.1.6**. Running `npm run export` will throw an error.

**Action:** Remove the `export` script. If static export is needed, add `output: 'export'` to `bolts/next.config.js`.

---

### 🟠 HIGH-5 — `gainboy` build disables TypeScript type checking

**Repo:** `gainboy/`  
**File:** `gainboy/package.json`  
**Code:** `"build": "tsc -b --noCheck && vite build"`

`--noCheck` skips all TypeScript type checking during the build. Type errors will not surface in CI or production builds.

**Action:** Remove `--noCheck`. Fix resulting type errors. Use `// @ts-ignore` with `// TODO:` comments for intentional suppressions rather than disabling checking globally.

---

### 🟠 HIGH-6 — `event-discovery-framework` CI coverage floor was lowered to pass, mypy is disabled

**Repo:** `event-discovery-framework/`

Two back-to-back CI compliance shortcuts:
- `2026-02-25`: `fix(ci): lower coverage threshold to 50% (actual: 55%)` — CI was failing at 55%, so the threshold was dropped to make CI green
- `2026-02-25`: `fix(ci): make mypy non-blocking until type annotations are fixed` — Python type checking silently ignored

A later commit (`2026-03-02`: `test: boost test coverage above 80% threshold`) claims to restore 80% coverage, but the `pyproject.toml` is currently in the uncommitted modified files — its actual threshold is unknown.

**Action:** Re-enable mypy in CI with `--ignore-missing-imports` rather than non-blocking mode. Verify `pyproject.toml` coverage threshold is 80%, not the old 50%.

---

### 🟠 HIGH-7 — `chore: stage in-progress work` committed to `main` in two repos

**Repos:** `attributa` (commit `0c0b8d1`, 2026-03-07), `devkit` (commit `13a4a38`, 2026-03-07)

Committing "in-progress work" directly to `main` means partially implemented features may be in deployed production code.

**Action:** Audit the contents of these two commits. If they contain incomplete implementations, add feature flags or create follow-up completion commits.

---

## Medium Severity Findings

### 🟡 MEDIUM-1 — React version fragmentation (React 18 vs React 19)

| Repo | React Version |
|------|--------------|
| bolts | `^18.3.1` |
| attributa | `^19` |
| gainboy | `^19.0.0` |
| llmworks | (React 19 — same pattern as attributa) |

`devkit/packages/ui` is described as "Shared React UI component library". If it uses React 19 APIs (ref-as-prop without `forwardRef`, `use()` hook), bolts will silently break when consuming shared components.

**Action:** Upgrade bolts to React 19, or document and enforce a minimum React version in `devkit/packages/ui/README.md`.

---

### 🟡 MEDIUM-2 — `bolts` uses `eslint 10.x` while all other repos use `9.x`

**File:** `bolts/package.json`  
**Code:** `"eslint": "10.0.2"` (pinned exact)  
**Others:** `attributa: "^9.0.0"`, `gainboy: "^9.28.0"`

ESLint 10 has breaking changes from ESLint 9. The shared `devkit/packages/eslint-config` was built for ESLint 9. Rule behaviour in bolts may differ silently from all other repos.

**Action:** Standardise on ESLint 9 across all repos until ESLint 10 support is explicitly tested in the shared config.

---

### 🟡 MEDIUM-3 — `feat: workspace standardisation (P1-P20)` committed twice in `attributa`

**Repo:** `attributa/`

- `73493c2 2026-03-05` — `feat: workspace standardisation (P1-P20)` (direct push)
- `80e5bef 2026-03-05` — `feat: workspace standardisation (P1-P20) (#2)` (PR merge, same day)

Same content pushed directly to `main` and then merged again as a PR. Creates confusing doubled history and potential conflicting file state.

**Action:** Run `git diff 73493c2 80e5bef` to verify no conflicting content. Consider squashing in a future cleanup.

---

### 🟡 MEDIUM-4 — `gainboy/package.json` contains a Linux-only kill script

**File:** `gainboy/package.json`  
**Code:** `"kill": "fuser -k 5000/tcp"`

`fuser` is Linux-only and fails on macOS and Windows. The current development OS is Windows.

**Action:** Remove this script or replace with `npx kill-port 5000` (cross-platform).

---

### 🟡 MEDIUM-5 — Major dependency version divergence across repos

| Package | attributa | bolts | gainboy |
|---------|-----------|-------|---------|
| `tailwind-merge` | `2.6.0` (**pinned**) | `^2.6.0` | `^3.0.2` |
| `framer-motion` | not used | `^10.16.16` | `^12.6.2` |
| `lucide-react` | `^0.556.0` | `^0.295.0` | `^0.484.0` |
| `vite` | `^5.4.10` | N/A | `^7.2.6` |
| `@tanstack/react-query` | `^5.83.0` | `5.90.21` (exact) | `^5.83.1` |

**Notes:**
- `tailwind-merge` v3 has breaking API changes from v2. `gainboy` is on v3; others are on v2. Shared component snippets will break.
- `lucide-react` 0.295 vs 0.556 — icon names change between releases, causing import errors when sharing components.
- `bolts` pins `@tanstack/react-query` to exact `5.90.21` without justification, preventing automatic security patches.
- `framer-motion` spans two major versions (10 vs 12) with significant API changes.

**Action:** Create `devkit/packages/dependency-policy.md` defining canonical versions for shared packages. Use Dependabot groups to align patch/minor bumps across all repos simultaneously.

---

### 🟡 MEDIUM-6 — `helios` has no code commits since November 2025 (3+ month gap)

**Repo:** `helios/`

- **Nov 2025:** 20+ commits from `alaweimm90-archieve/claude/*` AI-agent branches (REST API, WebSocket, plugin system, Prometheus metrics, CLI — all claiming "ALL PHASES COMPLETE & DEPLOYED")
- **Feb–Mar 2026:** Only governance files added (SSOT.md, CLAUDE.md, markdown lint, CODE_OF_CONDUCT)
- **No application code commits in 2026**

The Nov 2025 "v0.1.0 MVP readiness" claims are contradicted by months of silence and the subsequent governance-only additions.

**Action:** Formally assess whether `helios` is active, in planning, or superseded. If inactive, add `> ⚠️ This repository is currently not under active development.` to the README and disable scheduled CI workflows.

---

### 🟡 MEDIUM-7 — Stale branches proliferating across every repo

| Branch pattern | Repos containing it |
|----------------|---------------------|
| `feat/workspace-standardisation` | attributa, bolts, devkit, EDF, llmworks, gainboy |
| `governance/morphism-framework-20260208` | attributa, gainboy, llmworks |
| `revival/*/revival` | attributa, bolts, gainboy, EDF |

`feat/workspace-standardisation` was merged weeks ago but remote branches were never deleted. `revival/*` branches have no apparent open PRs.

**Action:** Delete all merged remote branches across all repos:
```bash
git push origin --delete feat/workspace-standardisation
git push origin --delete governance/morphism-framework-20260208
git push origin --delete revival/<repo>/revival
```

---

### 🟡 MEDIUM-8 — `@alawein/prettier-config file:` links hardcode the directory layout

Every JS/TS repo contains:
```json
"@alawein/prettier-config": "file:../devkit/packages/prettier-config"
```

This requires `devkit/` to always be a sibling of every consuming repo. Any standalone checkout (Vercel, GitHub Codespaces, CI that clones only one repo) will fail at `npm ci`.

**Action:** Publish `@alawein/prettier-config` to GitHub Packages (it's a single-file package) and update all references to the registry version.

---

### 🟡 MEDIUM-9 — `devkit` has an untracked `tokens/` directory at the repository root

**Repo:** `devkit/`  
**Evidence:** `git status` shows `?? tokens/` (untracked)  
**Conflict:** `devkit/packages/tokens/` already exists and is tracked.

**Action:** Determine if the root `tokens/` is a new version or accidental duplicate of `packages/tokens/`. Move to `packages/` and commit, or delete if stale.

---

## Low Severity Findings

### 🟢 LOW-1 — `attributa` pdfjs-dist version mismatch between `package.json` and Dependabot PR

**File:** `attributa/package.json`  
**In `dependencies`:** `"pdfjs-dist": "^4.10.38"`  
**Dependabot PR:** `dependabot/npm_and_yarn/pdfjs-dist-5.4.530`

`^4.x.x` cannot resolve to `5.x`. If the lockfile was updated separately, there is a mismatch between the declared range and the installed version.

**Action:** Merge the Dependabot PR to align `package.json` with the installed version, or explicitly reject it if staying on v4.

---

### 🟢 LOW-2 — `attributa build:dev` script produces unminified development builds

**File:** `attributa/package.json`  
**Code:** `"build:dev": "vite build --mode development"`

A development-mode build includes debug code, unminified output, and may skip production optimisations. This could be accidentally deployed.

**Action:** Rename to `build:debug` and add a comment in `package.json` clarifying it is for debugging only, never for deployment.

---

### 🟢 LOW-3 — `gainboy` CI still had pnpm references after npm migration (risk of recurrence)

Commit `2026-03-10`: `fix(ci): replace pnpm with npm in Build/Security/Performance/Test/Code Quality workflows`. This means at least one CI run failed after the migration before the fix.

**Action:** Search `.github/workflows/` and `tools/` for any remaining `pnpm` references to ensure the migration is complete.

---

### 🟢 LOW-4 — Raw AI prompt text committed as git messages in public `gainboy` history

70+ commits contain verbatim user prompts such as:
- `"Generated by Spark: Please clone www.benchbarrier.com; it is my website and would like to perfect it"`
- `"Generated by Spark: We need a unique app name. ALso, improve the theme/style/typography/etc."`

These expose internal thought process, business decisions (including cloning intent), and typos in a public repository's permanent git history.

**Action:** Future AI-generated commits should use a standard format: `feat(spark): <short description>`. Consider adding a git commit-msg hook that rejects messages starting with `Generated by Spark:`.

---

### 🟢 LOW-5 — `bolts` uses a completely different component library stack from all other repos

**File:** `bolts/package.json`  
`"@headlessui/react": "^1.7.17"`, `"@heroicons/react": "^2.0.18"`

All other repos use `@radix-ui/*` + `lucide-react`. The shared `devkit/packages/ui` is described as "Radix + CVA + Tailwind". Bolts cannot consume shared UI components without migrating its Headless UI components.

**Action:** Plan migration of bolts Headless UI components to Radix UI. Migrate `@heroicons/react` to `lucide-react` (already in devkit).

---

## Cross-Cutting Patterns & Systemic Issues

### Pattern A — Repeated ESLint Firefighting (consolidation failure)

Four repos went through 2–4 emergency ESLint fix commits in a 3-day window (Mar 9–10, 2026). Root cause was `devkit/packages/eslint-config` incompatibility. Each repo got its own patched inline config instead of the root package being fixed once.

**Recommendation:** Fix `devkit/packages/eslint-config` as the authoritative source, version-bump it, and roll out to all repos in one coordinated update. Each repo maintaining its own 60–100 line copy of ESLint rules is a consolidation failure.

---

### Pattern B — Workspace Standardisation Without Branch Protection

Multiple repos show `feat: workspace standardisation (P1-P20)` landing directly on `main`, then the same content arriving again as a PR merge (`#1`, `#2` suffixes). Direct pushes bypass branch protection rules and create doubled commit history.

**Recommendation:** The cross-repo automation pipeline should create PRs only — never push directly to `main` — and wait for CI green before merging.

---

### Pattern C — `chore/hard-cutover-20260311` Is a Live Workspace Operation

Three or more repos are on this local branch today (March 11, 2026) with significant uncommitted changes. This appears to be a workspace-wide cutover in flight. Any deployment trigger (Vercel webhook, scheduled CI) will deploy from `main`, not from this in-progress work, creating a divergence between development state and production.

**Recommendation:** Complete or pause the cutover. Push the branch, open PRs, and merge when ready. Production source files (e.g., `src/components/ui/quick-actions.tsx`) must not remain uncommitted.

---

## Open Pull Requests Inventory

> *Note: The `gh` CLI returned no open non-Dependabot PRs, confirming all feature work has been merged to `main`. The following Dependabot PRs are open and were identified from remote branch listings.*

### Attributa — 7 Open Dependabot PRs (all unmerged)

| Dependabot Branch | Package | Notes |
|-------------------|---------|-------|
| `dependabot/npm_and_yarn/vite-7.3.1` | `vite` | **Security fix** — esbuild vuln (see HIGH-3) |
| `dependabot/npm_and_yarn/pdfjs-dist-5.4.530` | `pdfjs-dist` | Major version bump 4→5 (see LOW-1) |
| `dependabot/npm_and_yarn/react-day-picker-9.13.0` | `react-day-picker` | Major version bump 8→9 |
| `dependabot/npm_and_yarn/tailwind-merge-3.4.0` | `tailwind-merge` | Major version bump 2→3 (breaking API) |
| `dependabot/npm_and_yarn/lucide-react-0.562.0` | `lucide-react` | Minor bump |
| `dependabot/github_actions/actions/download-artifact-7` | actions/download-artifact | GitHub Actions bump |
| `dependabot/github_actions/actions/upload-artifact-6` | actions/upload-artifact | GitHub Actions bump |

**Risk:** 4 of these are major version bumps. The vite PR is a security fix that should be merged immediately. The tailwind-merge v3 PR will have breaking API changes and needs migration work before merging.

---

### Gainboy — 11 Open Dependabot PRs

| Dependabot Branch | Package | Notes |
|-------------------|---------|-------|
| `dependabot/npm_and_yarn/eslint-10.0.0` | `eslint` | Would upgrade to ESLint 10 — inconsistent with workspace standard |
| `dependabot/npm_and_yarn/tailwindcss-4.1.18` | `tailwindcss` | Patch bump |
| `dependabot/npm_and_yarn/recharts-3.7.0` | `recharts` | Minor bump |
| `dependabot/npm_and_yarn/react-error-boundary-6.1.0` | `react-error-boundary` | Minor bump |
| `dependabot/npm_and_yarn/eslint-plugin-react-refresh-0.5.0` | `eslint-plugin-react-refresh` | Minor bump |
| `dependabot/github_actions/actions/cache-5` | actions/cache | GitHub Actions bump |
| `dependabot/github_actions/actions/checkout-6` | actions/checkout | GitHub Actions bump |
| `dependabot/github_actions/actions/setup-node-6` | actions/setup-node | GitHub Actions bump |
| `dependabot/github_actions/actions/setup-python-6` | actions/setup-python | GitHub Actions bump |
| `dependabot/github_actions/pnpm/action-setup-4` | pnpm/action-setup | Stale — gainboy migrated from pnpm to npm (see LOW-3) |

**Risk:** The `eslint-10.0.0` PR must **not** be merged — it would create the same ESLint v10 inconsistency that bolts already has. The `pnpm/action-setup-4` PR is a ghost — gainboy migrated away from pnpm but Dependabot still tracks it, indicating the old pnpm workflow was not fully removed.

---

### LLMWorks — 5 Open Dependabot PRs

| Dependabot Branch | Package | Notes |
|-------------------|---------|-------|
| `dependabot/npm_and_yarn/date-fns-4.1.0` | `date-fns` | Major bump 3→4 |
| `dependabot/npm_and_yarn/radix-ui/react-accordion-1.2.12` | `@radix-ui/react-accordion` | Patch |
| `dependabot/npm_and_yarn/radix-ui/react-radio-group-1.3.8` | `@radix-ui/react-radio-group` | Patch |
| `dependabot/npm_and_yarn/radix-ui/react-separator-1.1.8` | `@radix-ui/react-separator` | Patch |
| `dependabot/npm_and_yarn/react-is-19.2.4` | `react-is` | Minor bump |

**Note:** The three Radix UI patch bumps could be grouped and merged together. The `date-fns` 3→4 bump is a major version with breaking changes.

---

### Merged PRs of Interest

| PR | Repo | Concern |
|----|------|---------|
| `#2 feat: workspace standardization (P1-P20)` | attributa | Merged 2026-03-06; same content also pushed directly to `main` before merge (see MEDIUM-3) |
| `#1 feat: migrate to @malawein/ui shared component library` | attributa | PR title references `@malawein` but package is named `@alawein/ui` (see HIGH-2) |

---

### PR Process Issue — Dependabot Accumulation

Across the three tracked repos, **23 open Dependabot PRs** are accumulating without being processed. This creates:
1. **Security risk** — the Vite security fix (attributa) has been sitting in an open PR since January 2026
2. **Merge conflict debt** — long-lived Dependabot PRs go stale and require rebase work to merge
3. **False status signals** — the `pnpm/action-setup-4` PR in gainboy is for a workflow that was already migrated away from

**Action:** Review and triage all open Dependabot PRs. Merge the vite security fix immediately. Set up Dependabot auto-merge for patch and minor bumps on non-breaking packages.

---

## Consolidation Opportunities

| Opportunity | Effort | Savings |
|-------------|--------|---------|
| Fix and republish `devkit/packages/eslint-config` for ESLint 9 | Medium | ~400 lines duplicated across 5 repos eliminated |
| Publish `@alawein/prettier-config` to GitHub Packages | Low | Removes `file:` fragility from all 8+ repos |
| Unify Dependabot groups: radix-ui/*, actions/*, eslint-* | Low | Reduces simultaneous Dependabot PRs from 40+ to ~10 |
| Resolve `devkit/tokens/` vs `devkit/packages/tokens/` duplication | Low | Removes one untracked directory |
| Delete all merged `feat/workspace-standardisation` remote branches | Low | Cleans branch list across 6 repos |
| Migrate `bolts` from Headless UI to Radix UI | High | Enables shared component consumption from devkit |

---

## Prioritised Action Plan

| Priority | Action | Repo | Effort |
|----------|--------|------|--------|
| 1 | Fix `@alawein/ui` `file:` dep → `github:` reference | attributa | 15 min |
| 2 | Commit or stash all uncommitted changes (esp. `quick-actions.tsx`) | attributa, bolts, gainboy, devkit, EDF | 30 min |
| 3 | Merge `vite-7.3.1` Dependabot PR (security fix) | attributa | 10 min |
| 4 | Remove deprecated `next export` script | bolts | 5 min |
| 5 | Remove Jest from bolts, standardise on Vitest | bolts | 2 hrs |
| 6 | Remove `@alawein/eslint-config` dep from gainboy | gainboy | 10 min |
| 7 | Remove `--noCheck` from gainboy build script | gainboy | 1–4 hrs |
| 8 | Decide gainboy vs gymboy, apply one clean rename | gainboy | 1 hr |
| 9 | Re-enable mypy in EDF CI (non-silent mode) | EDF | 30 min |
| 10 | Audit `0c0b8d1` (attributa) + `13a4a38` (devkit) in-progress commits | attributa, devkit | 30 min |
| 11 | Delete all merged stale remote branches | All repos | 15 min |
| 12 | Align React versions — upgrade bolts to React 19 | bolts | 4–8 hrs |
| 13 | Fix `devkit/packages/eslint-config` for v9; republish | devkit | 2 hrs |
| 14 | Publish `@alawein/prettier-config` to GitHub Packages | devkit | 1 hr |
| 15 | Audit and standardise `@alawein/ui` vs `@malawein/ui` imports | attributa, llmworks | 1 hr |
| 16 | Assess `helios` status; archive if inactive | helios | 30 min |
| 17 | Replace `"kill": "fuser -k 5000/tcp"` with cross-platform solution | gainboy | 5 min |
| 18 | Add Dependabot groups config across all repos | All repos | 1 hr |

---

*Generated by static analysis of git history, branch state, and configuration files across the `alawein/` workspace on 2026-03-11.*
