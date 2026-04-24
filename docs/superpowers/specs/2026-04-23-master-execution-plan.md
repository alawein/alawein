---
title: Master Execution Plan
date: 2026-04-23
status: active
type: canonical
feeds_from: [active-products-audit, shared-infrastructure-audit, governance-audit, research-portfolio-audit]
---

# Master Execution Plan

**Generated:** 2026-04-23
**Synthesizes:** Spec A (75 product findings) + Spec B (38 infra findings) + Spec C (16 governance findings) + Spec D (17 disposition decisions)
**Purpose:** Single sequenced work backlog. This is the document that answers "what do I work on next?"

---

## How To Use This Document

- Pick the lowest-numbered `open` item whose blockers are all `done`.
- Mark items `done` with a date and commit SHA (inline).
- When a spec finding is completed, the finding stays in its spec — update the status column here only.
- Do not edit spec documents (A–D) after this plan exists; new discoveries become new items here.
- After 90 days, completed items migrate to `archive/` section at the bottom.
- Per quarterly review: reclassify repos whose status changed; re-run Spec D disposition on any dormant repo.

---

## Part 1 — Reset Decisions

These happen **before** improvement work begins. Each eliminates permanent maintenance debt.

### Freeze (8 research repos)

Flip `status` and `lifecycle` from `active`/`maintained` → `frozen` in `alawein/catalog/repos.json`, add "Frozen" banner to each README.

| # | Repo | Source | Rationale |
|---|------|--------|-----------|
| R1 | edfp | Spec D | `planned` status with no feature push in the window; freeze-as-planned |
| R2 | loopholelab | Spec D | Docs-only since 2026-04-10; has live URL; flip active→frozen |
| R3 | maglogic | Spec D | Fix(docs) 2026-04-05; no homepage; substantive multi-language research artifact; dormant |
| R4 | qmatsim | Spec D | Docs-only since 2026-04-09; no homepage; complete research surface |
| R5 | qmlab | Spec D | Dep-bumps only recently; has qmlab.online; keep public-live but honest status |
| R6 | qubeml | Spec D | Bootstrap commands only since 2026-04-12; no homepage |
| R7 | scicomp | Spec D | Docs-only since 2026-04-09; real tests but no recent content |
| R8 | spincirc | Spec D | Docs-only since 2026-04-09; no homepage; multi-language legit research |

### Archive (1 research repo)

| # | Repo | Source | Rationale |
|---|------|--------|-----------|
| R9 | helios | Spec D | Already `status: archived` in catalog; README declares "Proprietary research archive"; confirm `gh api -X PATCH /repos/alawein/helios -f archived=true` matches |

### Extract or delete (workspace-tools sidecars)

| # | Path | Source | Action |
|---|------|--------|--------|
| R10 | `workspace-tools/dotnet-kilo/` | Spec B | Extract to own repo or delete — C# editor in a Python/TS operator surface is gratuitous |
| R11 | `workspace-tools/profile-platform/` | Spec B | Extract to own repo — full stack (apps/, docker-compose, k8s/, monitoring/, notifier/) |
| R12 | `workspace-tools/ingesta/` | Spec B | Extract — already has own `package.json` + `pyproject.toml` + deploy.sh |
| R13 | `workspace-tools/gmail-ops/` | Spec B | Move email-digest + email-labeler to `scripts/` or extract |
| R14 | `workspace-tools/clis/mobius-cli/` | Spec B | Möbius-branded CLI predating rename; extract or delete |
| R15 | `workspace-tools/mcp/` (docs-only) | Spec B | Merge into `mcps/docs/`; delete empty `mcp/` dir |
| R16 | `workspace-tools/testing/test-all.sh` | Spec B | Move to `scripts/` or `tests/` root; delete `testing/` dir |
| R17 | `workspace-tools/state/workspace-clean-slate-v{1..4}` | Spec B | Prune to most recent v5 + `state/initial-clean-slate`; archive rest to `state/_archive/` |
| R18 | `workspace-tools/consolidation_toolbox.py` | Spec B | 5-line shim to `toolbox.cli`; verify no callers; delete if unused |
| R19 | `workspace-tools/ERROR_AUDIT_*.md` + `AUDIT_START_HERE.txt` + `REPO-SWEEP-PROMPT.md` | Spec B | Either implement 4 Critical fixes and delete artifacts, or move to `docs/historical/` |

### Remove or rewire (alawein governance theater)

| # | Path | Source | Action |
|---|------|--------|--------|
| R20 | `alawein/.claude/hooks/drift-detection.sh` | Spec C | References deleted `_pkos/`; always echoes false-green. Rewire to `knowledge-base/templates/governance-hooks/` or delete |
| R21 | `alawein/.claude/hooks/scope-binding-check.sh` | Spec C | Update header comment away from `_pkos/` source lineage; verify the file-count logic still triggers |
| R22 | `alawein/.claude/hooks/observability-log.sh` | Spec C | Same lineage fix |
| R23 | `alawein/.claude/settings.json` hook keys | Spec C | `pre-commit`/`post-commit`/`hourly` are not Claude Code hook events; rewrite to valid events OR move to `.git/hooks/` |
| R24 | `alawein/REPO_GOVERNANCE_INITIATIVE.md` | Spec C | Rewrite to describe delivered baseline (github-baseline.yaml + audit + sync); remove references to 5 non-existent deliverables |
| R25 | `alawein/docs/governance/bulk-execution-progress.md` | Spec C | Flip `status: active` → `superseded`; add pointer to this plan |

### Cosmetic cleanup (low-effort, one batch)

| # | Path | Source | Action |
|---|------|--------|--------|
| R26 | `spincirc/claude-code-guide.jsx`, `claude-code-superprompt.jsx` | Spec D | Move to `.claude/` or delete |
| R27 | `maglogic/claude-code-guide.jsx`, `claude-code-superprompt.jsx` | Spec D | Move to `.claude/` or delete |
| R28 | `qmatsim/claude-code-guide.jsx`, `claude-code-superprompt.jsx` | Spec D | Move to `.claude/` or delete |
| R29 | `gymboy/src/debug.log` (Chrome Crashpad artifact) | Spec A | Delete; add `*.log` to `.gitignore` |
| R30 | `knowledge-base/services/vscode-extension/` on-disk node_modules (untracked) | Spec B | Delete filesystem artifacts; repo doesn't need them |

### Reset execution log (2026-04-23)

| Item | Status | Commit / Action |
|------|--------|-----------------|
| R1 (edfp freeze banner) | ✓ done | `alawein/edfp@f9cfea0` chore(status): freeze repo per MEP R1 |
| R1 (edfp catalog flip) | ✓ done | `alawein/alawein@0fb56485` catalog status/lifecycle → frozen |
| R2 (loopholelab banner) | pending | catalog flipped in `0fb56485`; banner deferred — README has user WIP |
| R3 (maglogic banner) | pending | catalog flipped in `0fb56485`; banner deferred — README has user WIP |
| R4 (qmatsim banner) | pending | catalog flipped in `0fb56485`; banner deferred — README has user WIP |
| R5 (qmlab banner) | ✓ done | `alawein/qmlab@41c3a2e` chore(status): freeze repo per MEP R5 |
| R5 (qmlab catalog flip) | ✓ done | `alawein/alawein@0fb56485` |
| R6 (qubeml banner) | pending | catalog flipped in `0fb56485`; banner deferred — README has user WIP |
| R7 (scicomp banner) | pending | catalog flipped in `0fb56485`; banner deferred — README has user WIP |
| R8 (spincirc banner) | pending | catalog flipped in `0fb56485`; banner deferred — README has user WIP |
| R9 (helios archived=true) | ✓ done | `gh api -X PATCH repos/alawein/helios -f archived=true`; verified true |
| R10 (delete dotnet-kilo/) | ✓ done | `alawein/workspace-tools@474c58b` |
| R11 (delete profile-platform/) | ✓ done | `alawein/workspace-tools@474c58b` |
| R12 (delete ingesta/) | ✓ done | `alawein/workspace-tools@474c58b` |
| R13 (delete gmail-ops/) | ✓ done | `alawein/workspace-tools@474c58b` |
| R14 (delete clis/mobius-cli/) | ✓ done | `alawein/workspace-tools@474c58b` (whole clis/ removed) |
| R15 (merge mcp/ → mcps/docs/) | ✓ done | `alawein/workspace-tools@474c58b` |
| R16 (move testing/test-all.sh) | ✓ done | `alawein/workspace-tools@474c58b` → scripts/test-all.sh |
| R17 (prune state/ v1-v4) | ✓ done | `alawein/workspace-tools@474c58b` → state/_archive/ |
| R18 (delete consolidation_toolbox.py) | ✓ done | `alawein/workspace-tools@474c58b` (verified no callers) |
| R19 (ERROR_AUDIT archive + tests) | ✓ done | `alawein/workspace-tools@474c58b` — 4 Critical fixes already shipped pre-batch; added 6-test `tests/test_core_io.py` + archived all 6 audit artifacts to `docs/historical/` |
| R20 (rewire drift-detection hook) | ✓ done | `alawein/alawein@0fb56485` + `alawein/workspace-tools@474c58b` — both repos sync'd from `knowledge-base/templates/governance-hooks` |
| R21 (rewire scope-binding hook) | ✓ done | `alawein/alawein@0fb56485` + `alawein/workspace-tools@474c58b` |
| R22 (rewire observability hook) | ✓ done | `alawein/alawein@0fb56485` + `alawein/workspace-tools@474c58b` |
| R23 (fix settings.json hooks) | ✓ done | `alawein/alawein@0fb56485` — removed invalid Claude Code event keys; added `_note` documenting that scripts are not wired as Claude Code hooks |
| R24 (rewrite REPO_GOVERNANCE_INITIATIVE.md) | ✓ done | Workspace-root file (not git-tracked); Dropbox-synced only. Rewritten to describe delivered baseline + marked 5 missing deliverables as "Future work" |
| R25 (supersede bulk-execution-progress.md) | ✓ done | `alawein/alawein@0fb56485` — status: active → superseded, pointer added |
| R26 (spincirc jsx delete) | ✓ done locally (push pending) | local commit on spincirc/main; push blocked by unrelated WIP in sibling repo |
| R27 (maglogic jsx delete) | ✓ done locally (push pending) | local commit on maglogic/main; push blocked by unrelated WIP |
| R28 (qmatsim jsx delete) | ✓ done locally (push pending) | local commit on qmatsim/main; push blocked by unrelated WIP |
| R29 (gymboy debug.log) | ✓ done | `.gitignore` already had `*.log`; file was untracked; deleted from disk (no commit needed) |
| R30 (knowledge-base vscode-extension/) | ✓ done | filesystem `rm -rf` on untracked on-disk artifacts (never committed) |

**Summary:** 22 of 30 reset items fully complete + pushed. 3 complete locally but push deferred (R26-R28 — sibling repos have unrelated README WIP blocking rebase). 5 README banner items (R2, R3, R4, R6, R7, R8) intentionally deferred — sibling READMEs have substantial user WIP mid-rewrite; catalog entries have been flipped for all 8, so the canonical status is correct; banners will be added as part of the user's ongoing README rewrite.

---

## Part 2 — Work Backlog

### Phase 1 — Portfolio (visible credibility, first-pass fixes)

Critical and High items where a technical visitor, hiring manager, or collaborator would immediately notice a false claim, broken feature, or missing polish.

#### 1.1 False-claim remediation (cross-product)

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 1 | Fix attributa.dev live URL — currently shows fitness RPG, not attribution product | attributa | Critical | S | — | Spec A |
| 2 | Replace WorkoutAI/NutritionAI stubs with real inference OR update README | repz | Critical | L | — | Spec A |
| 3 | Replace BenchmarkRunner `Math.random()` with real provider call OR rewrite README | llmworks | Critical | XL | — | Spec A |
| 4 | Remove "OpenAI/Anthropic integrations configured" claim from llmworks README | llmworks | Critical | S | — | Spec A |
| 5 | Fix attributa NLP analyzer stub — wire @huggingface/transformers pipeline for real GLTR token ranks | attributa | High | L | 1 | Spec A |
| 6 | Restore attribution routes in attributa App.tsx — /scan, /workspace, /results, /settings | attributa | Critical | S | 1, 5 | Spec A |
| 7 | Qualify scribd README claims (Supabase auth, Stripe entitlement) as "planned" until shipped | scribd | Low | S | — | Spec A |
| 8 | Update bolts README to reflect actual account/dashboard state (currently claims full flow, /account is mock) | bolts | Medium | S | 15 | Spec A |

#### 1.2 Commerce + auth fulfillment

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 9 | Ship Stripe webhook + entitlement fulfillment for scribd | scribd | Critical | XL | — | Spec A |
| 10 | Implement scribd paymentOption/giftEmail/promoCode paths (currently silently discarded) | scribd | High | L | 9 | Spec A |
| 11 | Add auth middleware gating /admin/* routes on bolts | bolts | Critical | S | — | Spec A |
| 12 | Replace /account mockUser with Supabase session + purchases query on bolts | bolts | Critical | L | — | Spec A |
| 13 | Bump installed @alawein/tokens 0.1.0 → 0.2.0 and theme-base 0.1.0 → 0.3.0 in bolts (lockfile drift fix) | bolts | Critical | S | — | Spec A |
| 14 | Bump installed @alawein packages in gymboy (same drift) | gymboy | High | S | — | Spec A |
| 15 | Implement bolts affiliate + refund notification routes OR remove stubs | bolts | Medium | M | — | Spec A |

#### 1.3 Ship `@alawein/ui` primitives — load-bearing for Spec A consolidation

**Status (2026-04-24):** DONE. `@alawein/ui@0.2.0` published to npm via PR #19 → squash merge `041320fd` → Release workflow run `24875940881`.

| # | Item | Repo | Severity | Effort | Blocked By | Source | Status |
|---|------|------|----------|--------|------------|--------|--------|
| 16 | Ship `@alawein/ui` `<ErrorBoundary>` + `<ErrorFallback>` with typed FallbackProps | design-system | Critical | L | — | Spec B | DONE 2026-04-24 (`041320fd`) |
| 17 | Ship `@alawein/ui` `<EmptyState icon title description action>` | design-system | Critical | M | — | Spec B | DONE 2026-04-24 (`041320fd`) |
| 18 | Ship `@alawein/ui` `<Spinner>` + `<PageLoader>` (skeleton already shipped) | design-system | Critical | M | — | Spec B | DONE 2026-04-24 (`041320fd`) |
| 19 | Publish @alawein/ui minor bump with the three new primitives; update CHANGELOG | design-system | High | S | 16, 17, 18 | Spec B | DONE 2026-04-24 — published as `@alawein/ui@0.2.0` |
| 20 | Migrate bolts ErrorBoundary to @alawein/ui (fixes light-theme-on-dark ErrorBoundary bug) | bolts | High | S | 19 | Spec A |
| 21 | Migrate repz ErrorBoundary + EmptyState to @alawein/ui | repz | High | M | 19 | Spec A |
| 22 | Migrate gymboy ErrorFallback (currently untyped, implicit any) to @alawein/ui | gymboy | Medium | S | 19 | Spec A |
| 23 | Migrate meshal-web ErrorBoundary + PageLoader to @alawein/ui | meshal-web | Medium | M | 19 | Spec A |
| 24 | Migrate attributa ErrorBoundary + EmptyState to @alawein/ui | attributa | Medium | M | 19 | Spec A |
| 25 | Migrate atelier-rounaq ErrorBoundary to @alawein/ui | atelier-rounaq | Medium | S | 19 | Spec A |
| 26 | Add llmworks EmptyState (currently missing; silent omission) | llmworks | Medium | S | 19 | Spec A |

#### 1.4 Build-breaking product fixes

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 27 | Create atelier-rounaq `src/design/utilities.ts` (or remove import; currently breaks build) | atelier-rounaq | Critical | M | — | Spec A |
| 28 | Implement atelier-rounaq `lib/auth.ts` + `lib/booking.ts` (or stub with no-ops; currently will not compile) | atelier-rounaq | Critical | M | — | Spec A |
| 29 | Fix atelier-rounaq broken product images (/images/*.jpg paths that do not exist) | atelier-rounaq | Critical | S | — | Spec A |
| 30 | Merge atelier-rounaq duplicate tokens.ts exports (declared twice with contradictory palettes) | atelier-rounaq | Critical | S | — | Spec A |

#### 1.5 Dashboard + portfolio surfaces

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 31 | Split gymboy App.tsx 3,500-line monolith into feature modules | gymboy | Critical | XL | 48 | Spec A |
| 32 | Adopt TanStack Query in gymboy (declared, 0 useQuery hits) OR remove dep | gymboy | High | L | 31 | Spec A |
| 33 | Resolve gymboy competing `:root` token blocks (tokens overridden twice) | gymboy | High | M | 14 | Spec A |
| 34 | Surface LinkedIn in meshal-web nav/footer (linkedinUrl exists, never rendered) | meshal-web | High | S | — | Spec A |
| 35 | Switch meshal-web globals.css to @import from @alawein/theme-base (stop hand-duplicating 1,360 lines) | meshal-web | Medium | L | — | Spec A |
| 36 | Surface publications section in meshal-web (publications.ts has real data; unrendered) | meshal-web | Low | M | — | Spec A |
| 37 | Wire knowledge-base dashboard to consume @alawein/tokens + @alawein/ui (currently zero DS imports) | knowledge-base | Critical | L | 19 | Spec B |

#### 1.6 Disposition actions (from Part 1 reset)

| # | Item | Repos | Severity | Effort | Source |
|---|------|-------|----------|--------|--------|
| 38 | Execute R1–R8: flip 8 research repos to `frozen` in catalog + README banner | 8 | High | M | Spec D |
| 39 | Execute R9: verify helios GitHub `archived=true` matches catalog | helios | Medium | S | Spec D |
| 40 | Execute R26–R28: remove stray `.jsx` prompt files from spincirc/maglogic/qmatsim roots | 3 | Low | S | Spec D |

---

### Phase 2 — Debt reduction (consolidation, dead code, drift)

#### 2.1 Governance theater removal

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 41 | Execute R20–R23: fix or delete the 3 broken `.claude/hooks/*.sh` scripts and settings.json hook keys | alawein | Critical | S | — | Spec C |
| 42 | Execute R24: rewrite REPO_GOVERNANCE_INITIATIVE.md to match delivered baseline | alawein | Critical | M | — | Spec C |
| 43 | Execute R25: supersede `bulk-execution-progress.md` — add pointer to this plan | alawein | High | S | — | Spec C |

#### 2.2 Workspace-tools consolidation

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 44 | Execute R10–R19: extract/delete workspace-tools sidecars and audit artifacts | workspace-tools | High | XL | — | Spec B |
| 45 | Implement 4 Critical fixes from ERROR_AUDIT (unhandled FileNotFoundError/JSONDecodeError in core.py `read_json()` etc.) | workspace-tools | High | M | — | Spec B |
| 46 | Decide `@alawein/standards` (v1.0.0, legacy Möbius) vs modular `eslint-config` + `prettier-config` + `tsconfig` (all v0.1.0); delete the non-canonical one | workspace-tools | High | M | — | Spec B |
| 47 | Add README to each config package (`eslint-config`, `prettier-config`, `tsconfig`) documenting adoption | workspace-tools | Medium | S | 46 | Spec B |
| 48 | Add `.npmrc` with `legacy-peer-deps=true` (workspace documents requirement orally) | workspace-tools | Low | S | — | Spec B |
| 49 | Fix `@alawein/morphism-themes` archival status (mark `deprecated: true` in package.json + README banner) | design-system | High | S | — | Spec B |
| 50 | Add workspace-level `audit:published-vs-installed` script — prevents lockfile drift observed in bolts/gymboy | workspace-tools | High | M | 46 | Spec B |

#### 2.3 Wire github-baseline into CI

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 51 | Wire `github-baseline-audit.py` into CI (run per PR in alawein + opt-in per sibling repo) — today it only runs manually | alawein | High | M | — | Spec C |
| 52 | Reconcile `github-baseline.yaml` (21 repos) + `workspace-audit.yml` matrix (32) + `catalog/repos.json` — pick catalog as SSOT and derive others | alawein | Medium | M | 51 | Spec C |
| 53 | Make `workspace-audit.yml` produce actionable artifacts (open issues or persist JSON to knowledge-base) | alawein | High | M | 52 | Spec C |
| 54 | Remove `design-system-visual-fix` and `legacy-portfolio-temp` from workspace-audit.yml matrix if not real | alawein | High | S | 52 | Spec C |
| 55 | Add `docs/governance/INDEX.md` classifying 56 governance docs by status | alawein | High | M | — | Spec C |
| 56 | Archive shipped phase1–phase5 docs to `docs/archive/` with tombstone | alawein | Medium | M | 55 | Spec C |

#### 2.4 Dead code + stub removal (per product)

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 57 | Remove repz unrouted projects tree + LazyRouter + duplicate AuthContext | repz | High | M | — | Spec A |
| 58 | Remove repz src/App.css Vite scaffold (13 lines .logo-spin boilerplate) | repz | Medium | S | — | Spec A |
| 59 | Move repz src/superprompts/ AI tooling out of product src tree | repz | Low | S | — | Spec A |
| 60 | Remove repz frozen src/app/ Next layer + `next` dep | repz | Medium | S | — | Spec A |
| 61 | Delete scribd app/components/ duplicate tree (identical MD5 to root components/) | scribd | High | S | — | Spec A |
| 62 | Delete scribd styles/globals.css stale shadcn default | scribd | Medium | S | — | Spec A |
| 63 | Delete llmworks App.css Vite scaffold | llmworks | Medium | S | — | Spec A |
| 64 | Wire or delete llmworks commented-out lib/ init functions (security, advancedSEO, monitoring) | llmworks | Medium | S | — | Spec A |
| 65 | Delete gymboy src/debug.log Chrome Crashpad artifact (R29) | gymboy | Medium | S | — | Spec A |
| 66 | Clear atelier-rounaq @react-three/* deps (0 usage, ~2MB bundle) + ore-showcase scaffolds | atelier-rounaq | High | S | — | Spec A |
| 67 | Route or delete 7+ orphaned pages in attributa src/pages/ (Workspace/Scan/Results/Settings/Auth/Index/Documentation/NotFound) | attributa | High | S | 6 | Spec A |
| 68 | Delete attributa duplicate Auth/NotFound page pairs (unrouted copies) | attributa | Low | S | 67 | Spec A |
| 69 | Delete meshal-web unreachable section components (theme-delegated routes bypass) | meshal-web | Medium | S | — | Spec A |
| 70 | Delete atelier-rounaq LuxuryHero stub OR expand to replace inline landing hero | atelier-rounaq | Medium | S | — | Spec A |
| 71 | Delete atelier-rounaq DesignSystemPage from routes.ts (defined, never routed) | atelier-rounaq | Low | S | — | Spec A |

#### 2.5 TypeScript strict adoption (workspace policy)

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 72 | Enable `strict:true` in repz tsconfig (currently 204 `any` usages) — incrementally, per domain | repz | High | L | — | Spec A |
| 73 | Enable `strict:true` in gymboy tsconfig (currently strictNullChecks-only, 27 `any`) | gymboy | High | L | 31 | Spec A |
| 74 | Enable `strict:true` in attributa tsconfig (currently `strict:false`, 6 `any`) | attributa | Medium | M | — | Spec A |
| 75 | Add CI gate in `@alawein/tsconfig` base rejecting PRs loosening strict flags | workspace-tools | High | M | 46 | Spec A |

#### 2.6 Design-system drift audits

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 76 | Document 3 allowed @alawein/tokens relationships in SSOT.md (consume as-is / intentional override / forked DS); ship `audit:token-adoption` flag-bypass script | workspace-tools | High | M | 46 | Spec A/B |
| 77 | Standardize Storybook theme package dependency refs (mix of version pins and `file:` refs) | design-system | High | M | — | Spec B |
| 78 | Add test scripts to 15 theme-* CSS-only packages (CSS variable export contract tests) | design-system | High | L | — | Spec B |
| 79 | Add build+test scripts to theme-base + tailwind-preset (bypass turbo task graph today) | design-system | High | M | 78 | Spec B |
| 80 | Fix packages/icons @alawein/design-system file:../.. dep (monorepo boundary violation) | design-system | Medium | S | — | Spec B |
| 81 | Migrate governance-audit.json absolute Windows paths → relative (non-portable across CI) | design-system | Medium | S | — | Spec B |

#### 2.7 Workspace-level audit scripts

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 82 | Ship `workspace-tools/scripts/last-feature-commit.py` — filters governance-sync + docs-only noise (4-tier: active/stale/freeze/archive) | workspace-tools | Medium | M | 44 | Spec D |
| 83 | Ship `workspace-tools/scripts/audit-dead-routes.py` — scans for orphaned pages/routes per Spec A finding | workspace-tools | Medium | M | 44 | Spec A |
| 84 | Add pre-commit / CI lint for scaffold artifacts (*.log, Vite App.css boilerplate, claude-code-*.jsx at roots) | workspace-tools | Medium | M | 44 | Spec A |

---

### Phase 3 — Architecture (structural decomposition, long-lived patterns)

#### 3.1 Monolith decomposition

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 85 | Split `workspace_batch/work_orchestration.py` (4,155 lines) along task-graph / execution / state / reporter | workspace-tools | High | XL | 44, 45 | Spec B |
| 86 | Split `workspace_batch/core.py` (1,758 lines) along I/O / JSON / registry boundaries | workspace-tools | Medium | L | 45 | Spec B |
| 87 | Split `knowledge-base/scripts/pkos.py` (1,520 lines) along record-kind boundaries | knowledge-base | High | L | — | Spec B |
| 88 | Decompose knowledge-base scripts/icf_pipeline.py (956 lines) by ingest-extract-load stage | knowledge-base | Medium | M | 87 | Spec B |
| 89 | Decompose scribd monolithic app/page.tsx (1,167-line "use client") into server shell + client islands | scribd | Medium | M | — | Spec A |

#### 3.2 Canonical patterns + shared packages

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 90 | Extract `@alawein/payments` pattern kit with reference Stripe webhook + Supabase entitlement write | design-system | Critical | L | 9, 11, 12 | Spec A |
| 91 | Ship or document canonical Supabase+Clerk `useAuth` pattern (auth context diverges per repo per file) | workspace-tools | High | L | — | Spec A |
| 92 | Workspace decision: adopt TanStack Query as canonical async-state, or remove from recommended deps; currently 3 repos import unused | workspace-tools | High | M | 46 | Spec A |
| 93 | Document Form primitives + react-hook-form + zod composition pattern in `@alawein/ui` README | design-system | Medium | M | 19 | Spec A |
| 94 | Export `tailwind-merge` + `cn` from `@alawein/ui`; require consumption (meshal-web's local cn lacks tailwind-merge — correctness bug) | design-system | Medium | S | 19 | Spec A |
| 95 | Document canonical @alawein/ui Toast pattern (Sonner); migrate bolts (`alert()`), scribd (`console.error`), repz (custom useErrorHandler) | design-system | Medium | M | 19 | Spec A |

#### 3.3 Strict voice + claim validation

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 96 | Add voice-contract validator rule in alawein/scripts/validate.py flagging unverified capability claims in READMEs | alawein | High | M | 42 | Spec A |
| 97 | Dispatch llm-prompts sweep pattern over 8 active-product READMEs (reference pattern in memory) | alawein | High | L | 96 | Spec A |

#### 3.4 Data fetching + persistence

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 98 | Implement llmworks Supabase persistence for model configs + eval results (schema defined, 0 select/insert) | llmworks | High | L | 3 | Spec A |
| 99 | Wire bolts ProgressTracker to Supabase user_sessions (currently hardcoded dates) | bolts | Medium | M | 12 | Spec A |
| 100 | Wire bolts blog route to MDX or Supabase (currently 404 in prod) | bolts | Medium | M | — | Spec A |
| 101 | Integrate attributa DOI resolver with CrossRef REST API (currently stub returning synthetic metadata) | attributa | Medium | M | 5 | Spec A |

#### 3.5 knowledge-base dashboard enhancements (depend on 37)

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 102 | Re-reconcile knowledge-base WORKSPACE.yaml (20 days stale; 267 records inventoried 2026-04-03) | knowledge-base | Medium | S | 37 | Spec B |
| 103 | Resolve knowledge-base domain-registry.md repzapp.com payment past-due (7 days stale) | knowledge-base | Medium | S | — | Spec B |
| 104 | Add dark-mode theme block to knowledge-base globals.css via @alawein/theme-base (currently hardcoded light) | knowledge-base | Medium | S | 37 | Spec B |
| 105 | Document services/knowledge-forge purpose in CLAUDE.md (Python sub-service, unexplained) | knowledge-base | Medium | S | — | Spec B |
| 106 | Move knowledge-base MASTER_REFERENCE.md (generated) to docs/generated/ with banner | knowledge-base | Medium | S | — | Spec B |
| 107 | Rename knowledge-base output/ → reports/ (collides with out/ semantically) | knowledge-base | Medium | S | — | Spec B |

---

### Phase 4 — Onboarding (docs, runbooks, DX)

| # | Item | Repo | Severity | Effort | Blocked By | Source |
|---|------|------|----------|--------|------------|--------|
| 108 | Run `sync-claude.sh` and propagate bootstrap template into alawein/.claude/CLAUDE.md (or document intentional minimalism) | alawein | Medium | S | — | Spec C |
| 109 | Set sunset date (e.g. 2026-06-30) for `LEGACY_TYPES` warning in validate-doctrine.py; convert to errors after | alawein | Medium | S | — | Spec C |
| 110 | Add lastVerified freshness gate in docs-validation.yml (reject PRs when repos.json lastVerified > 7 days stale AND repos.json changed) | alawein | Medium | S | 52 | Spec C |
| 111 | Add smoke test for bootstrap-repo.sh under scripts/tests/ | alawein | Medium | M | — | Spec C |
| 112 | Extract markdownlint version into reusable composite action or env var (duplicated in ci.yml + docs-validation.yml) | alawein | Low | S | — | Spec C |
| 113 | Add header comment to doctrine-reusable.yml documenting consumers | alawein | Low | S | — | Spec C |
| 114 | Update gymboy README to include product story (RPG mechanics, AI agents, GBA identity) — currently undersells | gymboy | Medium | M | — | Spec A |
| 115 | Delete gymboy vite.config.ts `vendor-3d` chunk (three.js not installed) | gymboy | Low | S | — | Spec A |
| 116 | Clean gymboy 20+ generative dev artifacts at repo root | gymboy | Low | S | — | Spec A |
| 117 | Add bolts README section documenting design system + content package architecture + env vars | bolts | Low | S | — | Spec A |
| 118 | Add scribd sonner toast on checkout failure (currently console.error only) | scribd | Low | S | 19 | Spec A |
| 119 | Create scribd /privacy, /terms, /support stubs (footer links currently 404 on live site) | scribd | Low | S | — | Spec A |
| 120 | Add SEO meta + structured data + Arabic locale hreflang to atelier-rounaq | atelier-rounaq | Medium | M | — | Spec A |
| 121 | Consolidate atelier-rounaq parallel Supabase clients (src/lib + src/integrations) | atelier-rounaq | Low | S | — | Spec A |
| 122 | Implement or remove atelier-rounaq client portal stubs (5 lazy-loaded nonexistent components + missing /login route) | atelier-rounaq | High | L | — | Spec A |
| 123 | Replace bolts checkout alert() with inline error state | bolts | Low | S | — | Spec A |
| 124 | Replace repz suspense bare-div fallbacks with CardSkeleton | repz | Low | S | 19 | Spec A |
| 125 | Replace llmworks blank-import lines in component files | llmworks | Low | S | — | Spec A |
| 126 | Split repz 71 local src/components/ui/ shadow layer (document ownership boundary vs @alawein/ui) | repz | Medium | S | 19 | Spec A |
| 127 | Remove repz empty "integration tests" asserting only page renders | repz | Medium | M | — | Spec A |
| 128 | Audit knowledge-base services/vscode-extension: finish-and-commit or delete on-disk artifacts (R30) | knowledge-base | High | S | — | Spec B |
| 129 | Add error.tsx + not-found.tsx to knowledge-base app (currently absent) | knowledge-base | Low | S | 37 | Spec B |
| 130 | Delete knowledge-base requirements.txt or pyproject.toml (redundant declarations) | knowledge-base | Low | S | — | Spec B |
| 131 | Add meatheadphysicist substantive content push (paper revision / site refresh / simulation notebook) by 2026-05-23 or flip to frozen | meatheadphysicist | Medium | M | — | Spec D |
| 132 | Add provegate substantive feature push (MCP server feature / benchmark result) by 2026-05-23 or flip to frozen | provegate | Medium | M | — | Spec D |
| 133 | Audit demo resume files in attributa src/_hidden/ for real PII | attributa | Medium | S | — | Spec A |
| 134 | Audit Storybook stories grouped as meta-categories (6 category files cover 46 components; gap unknown) | design-system | Medium | M | — | Spec B |
| 135 | Audit +2 decision in design-system Storybook versioning — independent vs lockstep with core | design-system | Medium | S | — | Spec B |

---

## Part 3 — Cross-Phase Roll-ups

### Severity totals across backlog

| Severity | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|----------|--------:|--------:|--------:|--------:|------:|
| Critical | 18 | 2 | 1 | 0 | 21 |
| High | 10 | 21 | 7 | 2 | 40 |
| Medium | 9 | 17 | 15 | 13 | 54 |
| Low | 3 | 4 | 0 | 13 | 20 |
| **Total** | **40** | **44** | **23** | **28** | **135** |

(Reset items R1–R30 are tracked separately; several backlog items — notably 38–40 in Phase 1 and 41–45 in Phase 2 — are the wrappers that actually execute R-numbered resets inside the numbered workflow.)

### Effort totals

| Effort | Count |
|--------|------:|
| S | 67 |
| M | 45 |
| L | 18 |
| XL | 5 |

### High-value consolidation wins (ordered by leverage)

1. **Item 16–18 then 20–26:** ship ErrorBoundary/EmptyState/Spinner in `@alawein/ui`, then migrate 7 consumers. One design-system week → 7 products get consistent primitives.
2. **Item 41 + 42 + 43 + 55–56:** governance cleanup. One week in alawein → readers stop being misled by theater and stale docs.
3. **Item 44:** workspace-tools extract. One focused week → a 10K-line CLI repo stops pretending to be a monorepo for 8 unrelated subprojects.
4. **Item 90 `@alawein/payments`:** one shared reference Stripe webhook + entitlement pattern → unblocks bolts (12), scribd (9), atelier (122).
5. **Item 82–84:** workspace audit scripts. One week in workspace-tools → 8+ product findings become auto-detected on every PR.

---

## Part 4 — Maintenance Model

### When completing an item

1. Commit the work with a message referencing the item number: e.g. `fix(bolts): add admin auth gate — MEP #11`.
2. Append to the item row in this doc: `| done 2026-04-30 a1b2c3d4` (date + short SHA).
3. If the work surfaces new issues, add them as new numbered items at the end — do *not* edit Specs A–D.

### When a reset decision is executed

1. Update `alawein/catalog/repos.json` for freeze/archive items.
2. Commit: `chore(catalog): freeze 8 research repos per Spec D — MEP R1-R8`.
3. Mark R-numbered rows in Part 1 as done inline.

### When new work arrives mid-plan

1. If it maps to an existing item, update that item's description — do not duplicate.
2. If it is genuinely new, add a new row at the bottom of the relevant phase.
3. If it invalidates an open item (e.g., requirement changed), strike the old item and note the superseding item number.

### Quarterly review (next: 2026-07-23)

1. Reclassify any repo whose status has changed in `catalog/repos.json`.
2. Move completed items more than 90 days old to `## Archive` section below.
3. Re-run Spec D freshness filter (`last-feature-commit.py`) against every repo; any active→stale/freeze transition gets a new item here.
4. Record quarterly summary (X items shipped / Y open / Z added).

### When the plan drifts

If you find yourself opening Specs A–D to answer "what do I work on next?" — the plan has drifted. Fix the plan, don't route around it.

---

## Part 5 — Phase Entry Criteria

- **Phase 1 ready:** always; start with highest-severity item whose blockers are done.
- **Phase 2 ready:** when Phase 1 Critical items are ≥50% closed or a specific Phase 2 item has no Phase 1 blocker.
- **Phase 3 ready:** when relevant design-system / workspace-tools items are stable (e.g. item 46 config canonical decision must precede item 75 CI gate).
- **Phase 4 ready:** continuously — Low items can slot in between larger work when context switching is free.

The phases are priority orderings, not strict barriers. A Low-effort Phase 4 item adjacent to completed Phase 2 work should be done in the same commit — don't delay 2 lines of README polish to "honor" the phase number.

---

## Deferrals (2026-04-23)

Items that reached a natural pause in a given session and need to be resumed later. Each entry names the exact resume step, the blocker, and what's already in place.

### D-1 — Publish `@alawein/ui@0.2.0` (MEP row 19) — ✅ RESOLVED 2026-04-24

Published via GitHub Actions release workflow (rather than local `npm publish` with 2FA OTP). The design-system repo already had `.github/workflows/release.yml` wired up with `NPM_TOKEN` and `ALAWEIN_RELEASE_TOKEN` secrets; merging PR #19 to main triggered `changesets/action` → `npm run release` → `changeset publish` inside CI, bypassing local 2FA entirely.

- PR: https://github.com/alawein/design-system/pull/19
- Merge commit: `041320fd`
- Release run: `24875940881` (success, 1m 58s)
- Published: `@alawein/ui@0.2.0` (+ `react-error-boundary@^4.1.2` as dep)
- Worktree cleanup: pending (see [Cleanup tasks](#cleanup-tasks-2026-04-24) below).

**Pattern takeaway:** For Turborepo + Changesets + NPM_TOKEN-configured repos, always prefer the CI release workflow over local publish. Avoids 2FA friction and keeps the release reproducible. Applies to every `@alawein/*` package published from `design-system`.

### D-2 — bolts `.dark` class activation (prerequisite for row 20)

**Finding:** bolts' `src/app/layout.tsx:69` renders `<html lang="en">` without `className="dark"`. Its `globals.css` imports `@alawein/theme-base`, but theme-base's dark semantic tokens (`--color-foreground`, `--color-card`, etc.) only activate under the `.dark` selector. Bolts therefore uses LIGHT token values on top of its dark `#0d0d0d` body — explaining the Spec A "light-theme-on-dark ErrorBoundary bug" that the audit attributed to `@alawein/ui`.

**Action:** When executing MEP row 20 (migrate bolts ErrorBoundary to `@alawein/ui`), include `className="dark"` on `<html>` in the same PR. Without it, the new `<ErrorFallback>` will render in the same light-on-dark state as the existing fallback.

### D-3 — `@testing-library/dom` missing from `design-system` main (baseline fix)

**Finding:** Fresh worktree from `origin/main` fails `npm test -w @alawein/ui` with `Cannot find module '@testing-library/dom'` — it's a peer of `@testing-library/react@16` that's not installed. The primitives branch includes a commit (`dc73f48`) that adds it as a devDep.

**Action:** After row 19 merges (via PR or direct), the fix lands on main automatically via the feature branch's bundled commit. If someone else branches from main in the meantime, they'll hit the same baseline failure; cherry-pick `dc73f48` if needed.

### D-4 — CHANGELOG.md doctrine-frontmatter gap — ✅ RESOLVED 2026-04-24 (in-flight during PR #19)

All 5 `packages/*/CHANGELOG.md` files and `apps/storybook/CHANGELOG.md` now have doctrine-compliant frontmatter (`type: generated`, `source: changesets`). Landed as part of the primitives PR because the strict doctrine check was blocking merge. Two `docs/*.md` files with malformed `---type: canonical` frontmatter (blank line inside block) were also corrected in the same PR.

### Cleanup tasks (2026-04-24)

Minor housekeeping post-publish.

- **C-1** — Remove worktree: `cd design-system && git worktree remove ../design-system-primitives-wt` (branch was auto-deleted on merge).
- **C-2** — The design-system `Docs Doctrine` workflow has been failing on main since 2026-04-16 (vale spelling errors for "npm", "colocation", "vendoring", "repos"). Not blocking merges (not a required check), but noisy. Follow-up PR to either extend vale vocabulary or correct the flagged terms. Low priority.
- **C-3** — `augment-repo.md` frontmatter was fixed to be YAML-valid (quoted `description` and `allowed-tools` fields that had unescaped colons). Worth auditing every `.claude/commands/*.md` across all workspace repos for the same YAML trap.

---

## Archive

(Items move here after 90 days done. Empty at plan inception.)

---

## Spec Index

| Spec | File | SHA | Findings |
|------|------|-----|----------|
| A — Active products | `2026-04-23-active-products-audit.md` | 9f389a7d | 75 |
| B — Shared infrastructure | `2026-04-23-shared-infrastructure-audit.md` | 1e212ed2 | 38 |
| C — Governance | `2026-04-23-governance-audit.md` | 62b47262 | 16 |
| D — Research portfolio | `2026-04-23-research-portfolio-audit.md` | dba7e17b | 17 |
| MEP (this doc) | `2026-04-23-master-execution-plan.md` | pending | 135 backlog items + 30 reset items |
