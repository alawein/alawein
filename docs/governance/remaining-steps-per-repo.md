---
title: Remaining Steps Per Repository — Design & Branding Plan
description: What's left and step-by-step plan for each repo after bulk Phase 3–5 execution.
last_updated: 2026-03-12
category: governance
status: active
---

# What's Left & Step-by-Step Plan Per Repo

After the bulk run (Phase 3 format/lint, Phase 4 tests, Phase 5 branch + local commit), this document lists **what's left** and gives a **step-by-step plan** for each repository. The master plan is the Cursor plan *Repo design branding agent plans* (or see [DESIGN-BRANDING-SUMMARY.md](./DESIGN-BRANDING-SUMMARY.md)); progress is in [bulk-execution-progress.md](./bulk-execution-progress.md). Handoff and automation: [HANDOFF-DESIGN-BRANDING.md](../HANDOFF-DESIGN-BRANDING.md).

---

## What's done vs what's left (overview)

| Area | Done | Left |
|------|------|------|
| **Phase 1** | Analysis/docs for alawein, devkit, repz, frontends (combined doc) | Optional: Phase 1 doc for qaplibria, MeatheadPhysicist |
| **Phase 2** | README/design sections and links to devkit/repz branding in most repos | Full Phase 2: tokens in CSS, component refactors, logo in shell, templates (per repo type) |
| **Phase 3** | Format (Prettier/ruff) and lint run; meshal-web lint fix | repz ESLint config fix; gainboy/simcore lint fixes; event-discovery-framework notebook ruff |
| **Phase 4** | Tests run; results documented | meshal-web test setup (Clerk/Router); gainboy rollup env; qmlab Playwright run; simcore tests |
| **Phase 5** | Branch `feature/branding-and-standardization` + local commit in 12 repos | **Push, open PR, merge, then Vercel deploy** for all |

---

## Step-by-step plan by repository

Use `REPO_ROOT` = your path to each repo (e.g. `.../alawein/meshal-web`). Replace `main` with `develop` if that's your default branch.

---

### alawein (Documentation / Governance)

**Classification:** Documentation / Governance. No app runtime.

**Done:** Phase 1 doc, governance docs, bulk progress tracker, README/workspace-resource-map updates; Phase 5 branch + commit.

**Left:**

1. Push the feature branch:  
   `cd REPO_ROOT/alawein && git push origin feature/branding-and-standardization`
2. Open a PR to `main`: title e.g. *feat(alawein): design system and branding integration (Phase 3–5 docs)*; link to `docs/governance/bulk-execution-progress.md` in the body.
3. After review, merge the PR.
4. Run `git checkout main && git pull origin main`. No Vercel for this repo.

---

### devkit (Open Source Library / Design System)

**Classification:** Design system monorepo; Storybook, tokens, UI, icons, themes.

**Done:** Phase 1 doc, README design authority, format + turbo lint; Phase 5 branch + commit.

**Left:**

1. **(Optional)** Phase 2: Ensure Storybook and README use tokens and org branding; align `templates/vite-spa` and `templates/next-app` with workspace layout and branding (see plan Phase 2 for devkit).
2. Push: `cd REPO_ROOT/devkit && git push origin feature/branding-and-standardization`
3. Open PR to `main`; after merge, `git checkout main && git pull origin main`.
4. Vercel: confirm `vercel.json` (e.g. build Storybook); run `vercel deploy --prod` or rely on CI; verify production.

---

### repz (Full-stack SaaS)

**Classification:** Full-stack SaaS; Vite + React, Supabase, Stripe; has `branding/` and `src/theme/tokens.ts`.

**Done:** Phase 1 doc, format, 343 tests passed; Phase 5 branch + commit. Lint has config issue (@typescript-eslint rule load).

**Left:**

1. **(Optional)** Fix ESLint config so `npm run lint` passes (resolve @typescript-eslint/no-unused-expressions or equivalent rule load error).
2. **(Optional)** Phase 2: Align all app surfaces with `repz/branding` and BRAND_BOUNDARY; logo and REPZ tokens in header/footer/loading (see plan Phase 2 for repz).
3. Push: `cd REPO_ROOT/repz && git push origin feature/branding-and-standardization`
4. Open PR to `main`; after merge, pull main.
5. Vercel: confirm `vercel.json` (buildCommand, outputDirectory); deploy prod and verify.

---

### meshal-web (Front-end Application)

**Classification:** Front-end; Vite + React; portfolio (meshal.ai); D-5 refinement target.

**Done:** Format, lint fix (Navigation setState-in-effect), Phase 5 branch + commit. Four unit tests still fail (Clerk/Router context — pre-existing).

**Left:**

1. **(Optional)** Fix test setup: add Clerk/Router providers or mocks so `npm run test` passes (see phase4-testing-and-validation.md known issues).
2. **(Optional)** Phase 2: Add/update global styles from devkit; refactor core UI to tokens and STYLE_GUIDE; integrate logo in header/footer/loading (see plan Phase 2 for front-ends).
3. Push: `cd REPO_ROOT/meshal-web && git push origin feature/branding-and-standardization`
4. Open PR to `main`; after merge, pull main.
5. Vercel: deploy prod and verify.

---

### gainboy (Front-end Application)

**Classification:** Front-end; Vite + React; fitness UI; D-2 Game Boy–inspired redesign target.

**Done:** Format; Phase 5 branch + commit. Lint has warnings/errors (no-undef, unused vars, etc.). Tests fail in bulk run (rollup native module missing).

**Left:**

1. **(Optional)** Fix test env: e.g. `rm -rf node_modules package-lock.json && npm i` to resolve rollup optional deps; re-run `npm run test`.
2. **(Optional)** Address lint: fix or relax no-undef for `process`, remove unused vars, fix no-useless-escape (see bulk-execution-progress).
3. **(Optional)** Phase 2: Theme + logo + D-2 redesign (tokens, STYLE_GUIDE, logo in shell).
4. Push: `cd REPO_ROOT/gainboy && git push origin feature/branding-and-standardization`
5. Open PR to `main`; after merge, pull main.
6. Vercel: deploy prod and verify.

---

### attributa (Front-end Application)

**Classification:** Front-end; Vite + React; design/accessibility audit (attributa.dev).

**Done:** Format (npx prettier), lint (warnings only), 55 tests passed; Phase 5 branch + commit.

**Left:**

1. **(Optional)** Phase 2: Theme, tokens, logo in header/footer/loading; align with STYLE_GUIDE (see plan Phase 2 for front-ends).
2. Push: `cd REPO_ROOT/attributa && git push origin feature/branding-and-standardization`
3. Open PR to `main`; after merge, pull main.
4. Vercel: deploy prod and verify.

---

### llmworks (Front-end / OSS)

**Classification:** Front-end / OSS; Vite + React; LLM evaluation (llmworks.dev).

**Done:** Format (npx), lint ok, 192 tests passed. No local commit in bulk run (no changes staged).

**Left:**

1. If you have local changes (e.g. README design section): create branch, commit, then push. Else ensure main is up to date.
2. **(Optional)** Phase 2: Theme + tokens + logo (see plan Phase 2 for front-ends).
3. Push (if branch exists): `git push origin feature/branding-and-standardization`; open PR, merge, pull main.
4. Vercel: deploy prod and verify.

---

### simcore (Front-end Application)

**Classification:** Front-end; Vite + React, Capacitor; scientific simulation UI.

**Done:** Layout is `layout.tsx`; Prettier run ok; 189 tests passed; branch + commit + **push** (2026-03-12). Lint has pre-existing warnings in `public/` and `scripts/`.

**Left:**

1. Open PR to `main`, merge, then `git checkout main && git pull origin main`.
2. **(Optional)** Phase 2: Theme + tokens + logo.
3. Vercel: deploy prod and verify.

---

### qmlab (Front-end Application)

**Classification:** Front-end; Vite + React; quantum mechanics lab.

**Done:** Format ok, lint ok; Phase 5 branch + commit. Playwright not run in bulk.

**Left:**

1. **(Optional)** Run Playwright: `npm run test:e2e` or equivalent; fix any failures.
2. **(Optional)** Phase 2: Theme + tokens + logo (see plan Phase 2 for front-ends).
3. Push: `cd REPO_ROOT/qmlab && git push origin feature/branding-and-standardization`
4. Open PR to `main`; after merge, pull main.
5. Vercel: deploy prod and verify.

---

### rounaq-atelier (Front-end Application)

**Classification:** Front-end; Vite SPA; fashion/atelier; has `src/components/brand/Logo.tsx`.

**Done:** Format, lint (warnings), 321 tests passed; Phase 5 branch + commit.

**Left:**

1. **(Optional)** Phase 2: Ensure theme and tokens from devkit/repz; logo in header/footer/loading (may already be present via Logo.tsx).
2. Push: `cd REPO_ROOT/rounaq-atelier && git push origin feature/branding-and-standardization`
3. Open PR to `main`; after merge, pull main.
4. Vercel: deploy prod and verify.

---

### bolts (Full-stack SaaS)

**Classification:** Full-stack SaaS; Next.js, Stripe, Resend, Supabase; BOLTS.FIT.

**Done:** Format, lint (warnings), tests passed; Phase 5 branch + commit.

**Left:**

1. **(Optional)** Phase 2: Shared tokens (devkit or local theme); logo and BOLTS branding in shell and emails; standardize API response shape if any (see plan Phase 2 for bolts).
2. Push: `cd REPO_ROOT/bolts && git push origin feature/branding-and-standardization`
3. Open PR to `main`; after merge, pull main.
4. Vercel: deploy prod and verify.

---

### scribd (Front-end / Internal)

**Classification:** Front-end / Internal; Next.js.

**Done:** Format (npx), lint (warnings), 75 tests passed; Phase 5 branch + commit (README).

**Left:**

1. **(Optional)** Phase 2: Theme + logo if UI exists (see plan).
2. Push: `cd REPO_ROOT/scribd && git push origin feature/branding-and-standardization`
3. Open PR to `main`; after merge, pull main. Vercel only if `vercel.json` exists.

---

### event-discovery-framework (Full-stack: Python + Front-end)

**Classification:** Full-stack; Python backend + `frontend/` (edfp-frontend); edfp.online.

**Done:** Frontend Prettier, backend ruff format (22 files); ruff check has 4 errors in notebooks only; pytest run via uv; Phase 5 branch + commit. Frontend has no ESLint config and no test script.

**Left:**

1. **(Optional)** Backend: fix 4 ruff issues in notebooks (E402, C408, B007) or exclude notebooks from ruff check.
2. **(Optional)** Frontend: add `npm run lint` (ESLint) and `npm run test` if desired.
3. **(Optional)** Phase 2: Frontend theme from devkit/repz; backend API response envelope and error middleware; API docs branding if present (see plan Phase 2 for event-discovery-framework).
4. Push: `cd REPO_ROOT/event-discovery-framework && git push origin feature/branding-and-standardization`
5. Open PR to `main`; after merge, pull main.
6. Vercel: confirm config for frontend; deploy prod and verify.

---

### shared-utils (Package Library)

**Classification:** Package library; shared TypeScript utilities.

**Done:** Lint ok, 65 tests passed; Phase 5 branch + commit (README workspace standards).

**Left:**

1. **(Optional)** Run `npx prettier --write .` if you want consistent formatting (no format script in package.json).
2. Push: `cd REPO_ROOT/shared-utils && git push origin feature/branding-and-standardization`
3. Open PR to `main`; after merge, pull main. No Vercel unless a docs site has vercel.json.

---

### qaplibria (Research / Multi-surface)

**Classification:** Research / multi-surface; Python + tools (e.g. solo-coder).

**Done:** README design/workspace standards section added in prior work; may not have a dedicated Phase 3–5 bulk commit.

**Left:**

1. If uncommitted: create branch `feature/branding-and-standardization`, add README/docs changes, commit, push, open PR, merge.
2. **(Optional)** Phase 1: Add `docs/phase1-design-branding-analysis-qaplibria.md` (stack, layout, design gaps).
3. **(Optional)** Phase 2: Docs/CLI branding and workspace-standardization links (see plan 2.6).
4. Vercel only if `vercel.json` exists (e.g. docs or landing).

---

### MeatheadPhysicist (Documentation / Research)

**Classification:** Documentation / Research; writing and docs.

**Done:** README design/workspace standards section added in prior work; may not have a dedicated Phase 3–5 bulk commit.

**Left:**

1. If uncommitted: create branch `feature/branding-and-standardization`, add README/docs changes, commit, push, open PR, merge.
2. **(Optional)** Phase 1: Add a short Phase 1 analysis doc if useful for future agents.
3. **(Optional)** Phase 2: Docs use org branding and link to design authority (see plan 2.5/2.6).
4. Vercel only if `vercel.json` exists.

---

## Summary: minimum to close the loop

To close the loop with no extra Phase 2 work:

1. **For each repo that has a local commit on `feature/branding-and-standardization`:**  
   Push → Open PR → Merge → `git checkout main && git pull origin main`.
2. **Repos with that branch (from bulk run):** alawein, event-discovery-framework, meshal-web, repz, devkit, bolts, gainboy, attributa, rounaq-atelier, qmlab, scribd, shared-utils.
3. **simcore:** Fix layout.ts (JSX/extension), then format/lint/test, then create branch + commit if needed, then push/PR/merge.
4. **llmworks, qaplibria, MeatheadPhysicist:** Push/PR/merge if you have local changes on a feature branch; otherwise just keep main up to date.
5. **Vercel:** After each merge, trigger deploy (or rely on CI) for repos that have `vercel.json` (see phase5-version-control-and-deployment.md).

All optional steps (Phase 2 deep work, lint/test fixes) can be done in follow-up PRs per repo.

---

## Automation & one-liners

**Push (from each repo):** `git push origin feature/branding-and-standardization`

**Open PR (GitHub CLI, from each repo after push):**
```bash
gh pr create --base main --head feature/branding-and-standardization \
  --title "feat: design system and branding integration (Phase 3-5)" \
  --body "See alawein/docs/governance/bulk-execution-progress.md and remaining-steps-per-repo.md."
```

**After merge:** `git checkout main && git pull origin main`

**Vercel (from each repo with vercel.json):** `vercel deploy --prod` (or use Vercel GitHub integration).

Full handoff with batch push examples: [HANDOFF-DESIGN-BRANDING.md](../HANDOFF-DESIGN-BRANDING.md).
