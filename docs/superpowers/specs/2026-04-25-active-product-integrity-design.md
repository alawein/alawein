---
title: Spec 2 — Active Product Integrity
date: 2026-04-25
status: active
type: canonical
feeds: [master-execution-plan]
---

# Spec 2 — Active Product Integrity

**Repos:** bolts, repz, gymboy, scribd, llmworks, attributa, atelier-rounaq
**Track:** Parallel with Specs 1, 3, 5
**Source:** 2026-04-24 workspace review — Spec A (active products audit), Layer B Quick Wins + Critical Path

---

## Purpose

Address all Critical findings across the 8 active product repos. Findings are organized by repo and sequenced by effort: S-effort fixes ship first, XL items are specified but flagged as their own implementation milestone.

---

## bolts

**Stack:** Next.js 16, TypeScript strict, Supabase, Stripe
**Live:** https://bolts.fit

### B1 — Admin panel auth gate (S)

**Finding:** `src/app/admin/page.tsx` and `src/app/admin/testimonials/page.tsx` render unconditionally — no session check, no middleware redirect. Any visitor can access `/admin/*`.

**Fix:** Add Next.js middleware entry for `/admin/:path*` that redirects unauthenticated users to `/login`. Use the existing Supabase client pattern already present in the codebase.

Files: `src/middleware.ts` (modify or create), `src/app/admin/page.tsx` (add server-side session check as backup)

### B2 — Account/dashboard mock data (L)

**Finding:** `src/app/account/page.tsx` and `src/app/dashboard/page.tsx` use a hardcoded `mockUser` object. No real Supabase session is fetched. A logged-in user sees mock data; an unauthenticated user sees it too.

**Fix:** Replace `mockUser` with a real `supabase.auth.getUser()` call in each page's server component. Add a redirect to `/login` if session is null. Wire the purchases query to the user's actual `user_id`.

Files: `src/app/account/page.tsx`, `src/app/dashboard/page.tsx`

### B3 — Design package version lag (S)

**Finding:** `node_modules/@alawein/tokens` is at 0.1.0; `package.json` declares 0.2.0. Lockfile was never updated after the design-system release.

**Fix:** Run `npm install @alawein/tokens@0.2.0 @alawein/theme-base@0.3.0 --legacy-peer-deps` and commit the updated `package-lock.json`. Run a visual smoke test after install to confirm no token regressions.

Files: `package.json`, `package-lock.json`

---

## repz

**Stack:** Vite + React Router, TypeScript strict:false, Supabase, TanStack Query
**Live:** https://repzcoach.com

### R1 — AI service stubs (L)

**Finding:** `src/services/ai/WorkoutAI.ts` returns a hardcoded object from `analyzeForm()`. `NutritionAI.ts` returns hardcoded recommendations. These are shipped as product features on the pricing page and in the README.

**Fix (two options — choose one before implementation):**
- **Option A (recommended):** Wire to a real inference endpoint (OpenAI, Anthropic, or self-hosted). Replace stub returns with actual API calls. Gate behind a feature flag until validated.
- **Option B:** Remove the stub methods and update the README and pricing page to remove AI claims until real inference is implemented.

The spec does not prescribe the model or provider — that decision belongs in the implementation plan. What it prescribes: stubs must not ship as product features.

Files: `src/services/ai/WorkoutAI.ts`, `src/services/ai/NutritionAI.ts`, README.md (update claims)

---

## gymboy

**Stack:** Vite + React 19, TypeScript strictNullChecks-only, GitHub Spark runtime
**Live:** https://gymboy.coach

### G1 — App.tsx monolith (XL)

**Finding:** `src/App.tsx` exceeds 3,500 lines. It contains route definitions, feature state, context providers, AI agent integration, and UI logic in a single file. This is an architectural finding, not a style finding — files of this size cannot be held in context, tested reliably, or maintained incrementally.

**Fix:** Decompose into feature modules. The decomposition follows domain boundaries already visible in the file:

| Module | Responsibility | Target path |
|--------|---------------|-------------|
| Router shell | Route definitions only | `src/router.tsx` |
| Workout feature | State + AI agent + UI | `src/features/workout/` |
| Character/RPG feature | XP system, character selection, progression | `src/features/character/` |
| Coach feature | Coaching workflows, program builder | `src/features/coach/` |
| Auth context | Session state | `src/contexts/AuthContext.tsx` |
| App shell | Provider composition, layout | `src/App.tsx` (reduced to ~100 lines) |

Each feature module exports a route component and its own context/state. The router shell composes them.

**Implementation constraint:** This is XL effort. The plan must sequence decomposition incrementally — one feature module per task — with the app remaining functional after each step. Do not attempt a single-pass rewrite.

Files: `src/App.tsx` (decompose), `src/router.tsx` (create), `src/features/*/` (create)

---

## scribd

**Stack:** Next.js 16, TypeScript strict, Stripe, no state manager
**Live:** https://scribd.fit

### SC1 — Stripe webhook + fulfillment (XL)

**Finding:** There is no `/api/webhooks/stripe` route. After a successful Stripe checkout, no event is processed and no entitlement is granted. The README claims Stripe entitlement delivery is shipped.

**Fix:**
1. Create `app/api/webhooks/stripe/route.ts` — handle `checkout.session.completed`, `payment_intent.succeeded`, `invoice.payment_failed`
2. On `checkout.session.completed`: record purchase in Supabase (`user_purchases` table or equivalent), trigger PDF delivery via the existing email path
3. Add Stripe webhook secret to `.env.example` and deployment env vars
4. Update README to accurately reflect shipping status

**Implementation constraint:** XL effort. The plan must stage this: webhook handler first, purchase recording second, PDF delivery third.

Files: `app/api/webhooks/stripe/route.ts` (create), `app/api/checkout/route.ts` (update to handle all payment options), Supabase migration for purchase table

### SC2 — Duplicate component directories (S)

**Finding:** `app/components/` contains MD5-identical copies of files in root `components/`. `theme-provider.tsx` in `app/components/` is imported nowhere.

**Fix:** Delete `app/components/`. Remove `theme-provider.tsx`. Verify no import paths broke.

Files: `app/components/` (delete), any files importing from it (update to `components/`)

---

## llmworks

**Stack:** Next.js, TypeScript, custom eval harness
**Live:** (domain per catalog)

### L1 — Benchmark results return Math.random() (L)

**Finding:** The benchmark scoring function returns `Math.random()` for all model comparisons. LLMWorks is positioned as an LLM evaluation platform. Fake benchmark results are the product's core claim.

**Fix:** Replace `Math.random()` returns with real model inference calls and scoring logic. The specific implementation depends on the eval harness design — the spec does not prescribe the algorithm, but prescribes: benchmark results must be computed from actual model output, not generated randomly.

Update README to remove any claims about shipped benchmark results until real inference is wired.

Files: Benchmark scoring module (exact path to be confirmed during implementation), README.md

---

## attributa

**Stack:** (per catalog)
**Live:** attributa.online (or equivalent)

### AT1 — Live domain shows wrong product (L)

**Finding:** The live domain for attributa (an attribution intelligence product) renders a fitness RPG interface — the wrong product entirely.

**Fix:** Two options:
- **Option A:** Fix the deployment/DNS to point the attributa domain at the correct build
- **Option B:** If the attributa product is not ready for public access, redirect the domain to a coming-soon page or 404

Determine which option applies during implementation (check the deployment config and Vercel project assignment).

Files: Vercel project configuration, DNS records (outside of git), or `app/` routing if the wrong page is being served from within the codebase

---

## atelier-rounaq

**Stack:** (per catalog)
**Live:** (luxury storefront)

### AR1 — Missing modules causing build breaks (S–M)

**Finding:** 3 missing module imports cause build failures. Broken image paths on the live storefront.

**Fix:**
1. Identify the 3 missing modules from the build error output (run `npm run build` and capture errors)
2. Either install the missing packages or replace the imports with equivalent packages already in `node_modules`
3. Fix broken image paths — verify each `src` attribute points to an existing asset
4. Confirm `npm run build` passes before considering this done

Files: Whichever files contain the missing imports (confirm during implementation), `public/` or `src/assets/` for image paths

---

## Sequencing

Within the implementation plan, sequence as follows:

**Phase 1 — S-effort Criticals** (ship first, unblock portfolio visibility):
- B3: bolts tokens version lag
- B1: bolts admin auth gate
- SC2: scribd duplicate components
- AR1: atelier-rounaq build breaks

**Phase 2 — L-effort Criticals** (parallel subagents per repo):
- B2: bolts account/dashboard real auth
- R1: repz AI stubs
- L1: llmworks Math.random()
- AT1: attributa wrong product

**Phase 3 — XL-effort Criticals** (own implementation cycles):
- G1: gymboy App.tsx decomposition
- SC1: scribd Stripe webhook + fulfillment

---

## Constraints

- Each repo is an independent git repo — commits must happen inside the repo directory, not the workspace root
- Do not enable TypeScript strict mode in repz as a side effect of fixing R1 — that is a separate High finding, not a Critical
- The gymboy decomposition (G1) must keep the app functional after each incremental step — no big-bang rewrite
- The scribd Stripe integration (SC1) must be tested with Stripe's test mode before any production webhook secret is used
- README updates must accurately reflect shipping status — do not describe a fix as "shipped" until the code is deployed
