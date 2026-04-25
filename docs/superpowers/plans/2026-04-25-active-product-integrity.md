---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last-verified: 2026-04-25
audience: [ai-agents, contributors]
---

# Active Product Integrity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all Critical findings across 7 active product repos, sequenced by effort.

**Architecture:** Phase 1 covers S-effort Criticals (design package pinning, admin auth gate, duplicate component cleanup, build fixes). Phase 2 covers L-effort Criticals (real auth in account/dashboard, AI stub replacement, wrong domain fix, Math.random() benchmarks). Phase 3 (XL) items are specified at task level but flagged as separate implementation cycles.

**Tech Stack:** Next.js 16, Vite + React Router, TypeScript, Supabase, Vitest

**Source spec:** `docs/superpowers/specs/2026-04-25-active-product-integrity-design.md`

---

## Phase 1 — S-effort Criticals

Ship these first. Each is self-contained and unblocks portfolio visibility.

---

### Task 1: bolts — fix design package version lag

**Finding (B3):** `package.json` declares `@alawein/tokens@0.2.0` and `@alawein/theme-base@0.3.0`, but the lockfile was never updated after the design-system sprint. `node_modules/@alawein/tokens` is still at 0.1.0 at runtime.

**Working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/`

- [ ] Run `npm install @alawein/tokens@0.2.0 @alawein/theme-base@0.3.0 --legacy-peer-deps`
- [ ] Verify the installed version: `node -e "console.log(require('./node_modules/@alawein/tokens/package.json').version)"`
  - Expected output: `0.2.0`
- [ ] Run `npm run build` — confirm it passes with no type errors or missing token references
- [ ] Do a visual smoke test: `npm run dev`, open `http://localhost:3000`, confirm the homepage renders without broken CSS variables or FOUC
- [ ] Stage and commit: `git add package-lock.json && git commit -m "fix(deps): update @alawein/tokens to 0.2.0 and @alawein/theme-base to 0.3.0"`

**Notes:** `package.json` already has the correct version strings — only the lockfile needs updating. Do not change `package.json`.

---

### Task 2: bolts — admin panel auth gate

**Finding (B1):** `src/app/admin/page.tsx` is a `'use client'` component that renders unconditionally — any visitor who navigates to `/admin` sees the revenue dashboard and testimonial controls. There is no `src/middleware.ts`.

**Working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/`

**Step 1: Understand the existing Supabase client pattern**

The codebase uses `@supabase/supabase-js` directly via `src/lib/supabase.ts` (client-side singleton). For middleware and server components, use `@supabase/ssr` package. Check if it is installed:

- [ ] Run `cat package.json | grep supabase`
- [ ] If `@supabase/ssr` is not listed, install it: `npm install @supabase/ssr --legacy-peer-deps`

**Step 2: Create `src/middleware.ts`**

- [ ] Create `src/middleware.ts` with the following content:

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

**Step 3: Add server-side session check in admin page as defense-in-depth**

- [ ] Read the full current content of `src/app/admin/page.tsx`
- [ ] The page is currently `'use client'` — the middleware handles the redirect. Add a comment at the top of the file: `// Auth gate: enforced by src/middleware.ts — middleware redirects unauthenticated users to /login`
  - Note: converting the admin page to a Server Component for double-checking is optional for this task. The middleware redirect is sufficient as the primary gate. Do it only if time permits.

**Step 4: Verify**

- [ ] Run `npm run build` — must pass with no type errors in middleware
- [ ] Commit: `git add src/middleware.ts src/app/admin/page.tsx && git commit -m "fix(auth): protect /admin routes with session middleware"`

**Notes:**
- The env var names `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are the standard Supabase SSR convention. Confirm they match whatever is in `.env.local` or Vercel env vars before deploying.
- Do NOT use the `createClient` from `src/lib/supabase.ts` inside middleware — that singleton is for client-side use only.

---

### Task 3: scribd — remove duplicate component directory

**Finding (SC2):** `app/components/` contains `content-preview-modal.tsx` and `handbook-credibility-card.tsx`, which are identical to the same files in root `components/`. `app/components/theme-provider.tsx` exists only in the `app/components/` tree and is imported nowhere. No files import from `app/components/`.

**Working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd/`

- [ ] Confirm no imports reference `app/components/`:
  ```bash
  grep -r "from.*app/components\|from.*['\"].*app/components" . --include="*.ts" --include="*.tsx" | grep -v node_modules
  ```
  Expected: no output. If any imports are found, update them to point to root `components/` before proceeding.

- [ ] Verify the files are identical:
  ```bash
  diff app/components/content-preview-modal.tsx components/content-preview-modal.tsx
  diff app/components/handbook-credibility-card.tsx components/handbook-credibility-card.tsx
  ```
  Expected: no diff output (files are identical).

- [ ] Remove the duplicate directory:
  ```bash
  git rm -r app/components/
  ```
  If any file has staged changes, use `git rm -rf app/components/` instead.

- [ ] Run `npm run build` — must pass with no missing module errors
- [ ] Commit: `git commit -m "refactor: remove duplicate app/components directory"`

**Notes:** The root `components/` directory is the canonical location. The `ui/` subdirectory inside root `components/` contains primitives (`button-group.tsx`, `sidebar.tsx`, etc.) — do not touch those.

---

### Task 4: atelier-rounaq — fix build-breaking missing modules

**Finding (AR1):** 3 missing module imports cause build failures. Broken image paths on the live storefront.

**Working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/`

**Step 1: Capture actual build errors**

- [ ] Run `npm run build 2>&1 | head -60` and record every `Cannot find module`, `Module not found`, or `Failed to resolve` error message
- [ ] List every file and import path that is broken

**Step 2: Fix missing modules**

For each missing module:
- If it is an npm package (e.g., `framer-motion`, `@react-three/fiber`): run `npm install <package> --legacy-peer-deps`
  - The project already depends on `@react-three/drei@^9.122.0` — check if the missing import is a peer dep of drei that is not installed
- If it is a local import with a wrong path: correct the import path to point to the actual file location

Do not install packages at a major version different from what the import expects. Check `package.json` for the intended version first.

**Step 3: Fix broken image paths**

- [ ] Run: `grep -rn "src=\|url(" src/ --include="*.tsx" --include="*.ts" --include="*.css" | grep -v "http\|data:" | head -30`
- [ ] For each image path, verify the file exists in `public/` or `src/assets/`
- [ ] Update broken paths: if the image should be in `public/`, the correct reference is `/filename.ext` (not `./public/filename.ext`)

**Step 4: Verify**

- [ ] Run `npm run build` — must exit with code 0
- [ ] Run `npm run preview` and visually confirm the storefront renders without broken images
- [ ] Commit: `git add -A && git commit -m "fix: resolve missing module imports and broken image paths"`

**Notes:** The `src/` directory contains: `animations/`, `App.tsx`, `components/`, `config/`, `constants/`, `context/`, `data/`, `design/`, `i18n.ts`, `integrations/`, `index.css`. The project uses Vite with React Router. Missing modules are most likely peer dependencies of `@react-three/drei` (Three.js) or missing local path references.

---

## Phase 2 — L-effort Criticals

Run as parallel subagents per repo where possible. Each task is independent.

---

### Task 5: bolts — account/dashboard real auth

**Finding (B2):** `src/app/account/page.tsx` uses a hardcoded `mockUser` object. `src/app/dashboard/page.tsx` renders without any session check and shows hardcoded activity data. Both pages serve the same content to authenticated and unauthenticated users.

**Working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/`

**Step 1: Understand the server-side Supabase pattern**

The existing `src/lib/supabase.ts` exports a `supabase` client and a `getCurrentUser()` helper. However, these are client-side singletons and cannot be used in Server Components for secure session checks. Use `@supabase/ssr` (installed in Task 2) with `createServerClient` and the cookies API.

Before writing code, run:
```bash
grep -r "createServerClient\|cookies()" src/ --include="*.ts" --include="*.tsx" | grep -v node_modules | head -10
```
If any Server Component already uses `createServerClient`, replicate that exact pattern here.

**Step 2: Update `src/app/account/page.tsx`**

- [ ] Remove the `'use client'` directive and the `mockUser` constant
- [ ] Convert to an async Server Component:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
// keep all existing UI imports

export default async function AccountPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // read-only in Server Components — no-op
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: purchases } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Replace all references to mockUser.name with user.user_metadata?.full_name ?? user.email
  // Replace all references to mockUser.email with user.email
  // Replace all references to mockUser.purchases with purchases ?? []
  // ... rest of JSX unchanged
}
```

- [ ] After applying, run `npm run build` to confirm no type errors
- [ ] The `useState` hook for `activeTab` will need to move into a child Client Component since the page is now a Server Component. Extract the tab switcher UI into `src/components/AccountTabs.tsx` with `'use client'` and pass `purchases` and `user` as props.

**Step 3: Update `src/app/dashboard/page.tsx`**

- [ ] The dashboard page currently renders `<ProgressTracker />` and hardcoded activity entries with no session check
- [ ] Add the same server-side session check at the top of the component (same pattern as account page above)
- [ ] If the user is null, `redirect('/login')`
- [ ] Pass `user.id` as a prop to `<ProgressTracker userId={user.id} />` if that component accepts it; otherwise leave it as-is for now — the auth gate is the Critical fix, not data wiring

**Step 4: Verify**

- [ ] Run `npm run build` — must pass
- [ ] Test manually: open `/account` without a session — should redirect to `/login`
- [ ] Test manually: open `/account` with a valid session — should show real user data
- [ ] Commit: `git add src/app/account/page.tsx src/app/dashboard/page.tsx src/components/AccountTabs.tsx && git commit -m "fix(auth): replace mock user with real Supabase session in account and dashboard"`

---

### Task 6: repz — remove AI service stubs

**Finding (R1):** `src/services/ai/WorkoutAI.ts` and `src/services/ai/NutritionAI.ts` return hardcoded objects from methods named `analyzeForm()`, `predictProgress()`, and `analyzeFoodPhoto()`. These stubs are presented as product features. The `generateWorkout()` and `generateMealPlan()` methods use real calculation logic (Mifflin-St Jeor BMR, exercise database lookups) — those are not stubs and must not be touched.

**Working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz/`

**What is a stub (must be fixed):**
- `WorkoutAI.analyzeForm()` — returns hardcoded `{ score: 85, feedback: [...], corrections: [...] }`
- `WorkoutAI.predictProgress()` — returns hardcoded trend multipliers
- `NutritionAI.analyzeFoodPhoto()` — returns hardcoded food recognition results

**What is NOT a stub (do not touch):**
- `WorkoutAI.generateWorkout()` — uses real exercise database and intensity calculation
- `NutritionAI.generateMealPlan()` — uses real BMR/TDEE calculation
- `NutritionAI.calculateBMR()` / `calculateTDEE()` — real math, not stubs

**Step 1: Check the feature flag pattern**

- [ ] Run: `grep -r "VITE_" src/ --include="*.ts" --include="*.tsx" | grep -v node_modules | head -10`
  This shows what env vars the codebase already uses. Note the naming pattern.
- [ ] Check `.env.example` or `.env` for existing feature flags: `cat .env.example 2>/dev/null || cat .env 2>/dev/null | head -20`

**Step 2: Add `VITE_AI_ENABLED` flag**

- [ ] Add to `.env.example`:
  ```
  # Set to 'true' only when real AI inference endpoints are wired
  VITE_AI_ENABLED=false
  ```

**Step 3: Replace stub methods with feature-flagged placeholder**

In `src/services/ai/WorkoutAI.ts`, replace the three stub methods:

```typescript
export class AIFeatureNotImplementedError extends Error {
  constructor(method: string) {
    super(
      `${method} requires real AI inference. Set VITE_AI_ENABLED=true and wire an inference endpoint before calling this method.`
    );
    this.name = 'AIFeatureNotImplementedError';
  }
}

// Replace analyzeForm():
static async analyzeForm(_videoBlob: Blob): Promise<FormAnalysis> {
  throw new AIFeatureNotImplementedError('WorkoutAI.analyzeForm');
}

// Replace predictProgress():
static async predictProgress(_history: WorkoutHistory[]): Promise<ProgressPrediction> {
  throw new AIFeatureNotImplementedError('WorkoutAI.predictProgress');
}
```

In `src/services/ai/NutritionAI.ts`, replace `analyzeFoodPhoto()`:

```typescript
static async analyzeFoodPhoto(_imageBlob: Blob): Promise<FoodAnalysis> {
  throw new AIFeatureNotImplementedError('NutritionAI.analyzeFoodPhoto');
}
```

**Step 4: Update call sites to handle the error gracefully**

- [ ] Find every call site: `grep -rn "analyzeForm\|predictProgress\|analyzeFoodPhoto" src/ --include="*.ts" --include="*.tsx" | grep -v "\.ts:" | head -20`
- [ ] For each UI component that calls a stub method, wrap the call in try/catch and render a "Feature coming soon" state when `AIFeatureNotImplementedError` is caught:

```typescript
try {
  const result = await WorkoutAI.analyzeForm(videoBlob);
  setAnalysis(result);
} catch (err) {
  if (err instanceof AIFeatureNotImplementedError) {
    setAnalysisState('coming-soon');
  } else {
    throw err;
  }
}
```

**Step 5: Update README**

- [ ] Find AI capability claims: `grep -n "AI\|form analysis\|food recognition\|progress prediction" README.md | head -20`
- [ ] Remove or qualify claims about `analyzeForm`, `predictProgress`, and `analyzeFoodPhoto` as "coming soon" or "planned"
- [ ] Do not remove claims about workout generation or meal plan generation — those use real logic

**Step 6: Verify**

- [ ] Run `npm run build` — must pass (TypeScript: `strict: false` in this repo, as noted in spec — do not change that setting)
- [ ] Run `npm test` to confirm test suite still passes
- [ ] Commit: `git add src/services/ai/WorkoutAI.ts src/services/ai/NutritionAI.ts .env.example README.md && git commit -m "fix(ai): replace hardcoded stubs with feature-flagged placeholder state"`

---

### Task 7: attributa — fix live domain routing

**Finding (AT1):** The live domain for attributa (an attribution intelligence product) renders a fitness RPG interface — the wrong product entirely.

**Working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa/`

**Step 1: Diagnose the deployment configuration**

- [ ] Check which Vercel project is linked: `cat .vercel/project.json 2>/dev/null`
  Note the `projectId` and `orgId`.
- [ ] Check `vercel.json` — it specifies `"buildCommand": "npm run build"`, `"outputDirectory": "dist"`, `"framework": null`. This is a Vite SPA.
- [ ] Check what the attributa app actually serves:
  ```bash
  head -30 src/App.tsx
  ```
  Look at the route structure. Does it look like an attribution product or something else?
- [ ] Check `src/pages/` for the main landing page and confirm whether the correct product is implemented.

**Step 2: Determine the fix option**

After Step 1, choose one path:

**Option A — Wrong Vercel project linked (most likely if another repo's build is deploying to attributa's domain):**
- [ ] Identify which Vercel project is currently serving `attributa.online` (check domain registry: `knowledge-base/db/assets/domain-registry.md`)
- [ ] In the Vercel dashboard: go to the wrong project → Settings → Domains → remove `attributa.online`
- [ ] In the Vercel dashboard: go to the attributa project → Settings → Domains → add `attributa.online`
- [ ] Trigger a new deployment: `git commit --allow-empty -m "chore: trigger redeploy after domain fix"` and push
- [ ] These are Vercel dashboard actions — document them as steps completed, do not attempt via git changes

**Option B — Wrong page served from within the codebase (attributa's own code renders the wrong product):**
- [ ] Read `src/App.tsx` fully and identify the root route component
- [ ] If the root route renders a fitness/RPG component, trace the import and determine whether the source was accidentally copied from another repo
- [ ] Fix the routing to render the correct attributa landing page
- [ ] Run `npm run build` to confirm the build passes

**Option C — Product not ready, take domain offline:**
- [ ] Create a `public/index.html` coming-soon page
- [ ] Update `vercel.json` to set `"buildCommand": null, "outputDirectory": "public"` (same pattern as `fallax/` and `provegate/`)
- [ ] Commit and deploy

**Step 3: Verify**

- [ ] After deploying, visit the live domain and confirm the correct product (or coming-soon page) is served
- [ ] Update `knowledge-base/db/assets/domain-registry.md` if the Vercel project assignment changed
- [ ] Commit any code changes: `git commit -m "fix(routing): serve correct product on attributa domain"`

**Notes:** The attributa project uses Vite + React (not Next.js). The `vercel.json` is already correctly configured for a Vite SPA. The most likely root cause is a misconfigured Vercel domain assignment, not a code bug — check the dashboard first.

---

### Task 8: llmworks — replace Math.random() benchmarks

**Finding (L1):** `src/components/bench/BenchmarkRunner.tsx` line 134–138 returns `Math.random()` for all benchmark scoring metrics (`accuracy`, `brierScore`, `citationQuality`, `avgTime`, `eloRating`). LLMWorks is positioned as an LLM evaluation platform. These fake benchmark results are the product's core claim.

**Working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/llmworks/`

**Note on scope:** Other `Math.random()` usages in the codebase are for UI animations and visual effects (`AIBattleAnimation.tsx`, `AIPersonalityAvatar.tsx`, `EnvironmentalEffects.tsx`, `AchievementSystem.tsx`, `EnhancedDebateArena.tsx`, `ArgumentImpactSystem.tsx`). Those are intentional and must NOT be changed. The scope of this task is narrowly `BenchmarkRunner.tsx` lines 134–138 and any other scoring logic that produces fake metric values.

**Step 1: Read the full BenchmarkRunner**

- [ ] Run: `cat src/components/bench/BenchmarkRunner.tsx`
- [ ] Identify: the function/method that contains lines 134–138, what triggers it, and what it returns to the UI

**Step 2: Replace stub scoring with not-implemented state**

The correct fix is Option B from the spec: remove the stub scoring and surface a clear "not yet implemented" state, rather than silently returning fake data.

Replace the scoring block (approximately lines 130–145) with:

```typescript
// TODO: Real benchmark scoring requires calling the target model's inference API
// and evaluating output against ground truth. This is not yet implemented.
// See: docs/superpowers/specs/2026-04-25-active-product-integrity-design.md L1
throw new Error(
  'Benchmark scoring is not yet implemented. ' +
  'Results shown here are not real model evaluations.'
);
```

Then update the UI that calls this code to catch the error and render a "Benchmarks coming soon" state instead of showing scores:

```typescript
// In the component that calls runBenchmark / the scoring function:
try {
  const results = await runBenchmark(selectedModels, config);
  setResults(results);
} catch (err) {
  if (err instanceof Error && err.message.includes('not yet implemented')) {
    setResultsState('not-implemented');
  } else {
    throw err;
  }
}
```

And add a `not-implemented` render branch:
```typescript
if (resultsState === 'not-implemented') {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <p>Benchmark scoring is not yet available.</p>
      <p className="text-sm mt-2">Real model evaluations require inference API integration.</p>
    </div>
  );
}
```

**Step 3: Update README**

- [ ] Find benchmark result claims: `grep -n "benchmark\|MMLU\|TruthfulQA\|GSM8K\|accuracy\|score" README.md | head -20`
- [ ] Remove any claims that present benchmark results as shipped or real
- [ ] Add a note: "Benchmark scoring UI is in development. Results shown are placeholders."

**Step 4: Verify**

- [ ] Run `npm run build` — must pass
- [ ] Run `npm test` if tests exist for the benchmark module: `ls src/test/ 2>/dev/null`
- [ ] Commit: `git add src/components/bench/BenchmarkRunner.tsx README.md && git commit -m "fix(benchmarks): remove Math.random() results; mark as not yet implemented"`

---

## Phase 3 — XL-effort Criticals (Separate Implementation Cycles)

These tasks are scoped and scaffolded here, but each requires a dedicated implementation plan before execution. Do not attempt a single-pass implementation.

---

### Task 9: gymboy — App.tsx decomposition plan (XL)

**Finding (G1):** `src/App.tsx` is 3,700 lines. It contains route definitions, feature state, context providers, AI agent integration, and UI logic in a single file.

**Working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/gymboy/`

**This task: create the decomposition plan document only. Do not touch App.tsx.**

- [ ] Create `docs/app-decomposition-plan.md` with the following content:

```markdown
# App.tsx Decomposition Plan

Current size: ~3,700 lines
Target: App.tsx reduced to ~100 lines (provider composition and layout shell only)

## Target module structure

| Module | Responsibility | Target path | Estimated lines extracted |
|--------|---------------|-------------|--------------------------|
| Router shell | Route definitions only | `src/router.tsx` | ~50 |
| Workout feature | State + AI agent + UI | `src/features/workout/` | ~800 |
| Character/RPG feature | XP system, character selection, progression | `src/features/character/` | ~700 |
| Coach feature | Coaching workflows, program builder | `src/features/coach/` | ~600 |
| Auth context | Session state | `src/contexts/AuthContext.tsx` | ~200 |
| App shell | Provider composition, layout | `src/App.tsx` (reduced) | ~100 |

## Implementation sequence

Each step must leave the app fully functional before moving to the next.

1. Extract AuthContext → `src/contexts/AuthContext.tsx`
   - Find all auth state: session, user, signIn, signOut
   - Create context and provider
   - Replace direct state refs in App.tsx with useContext(AuthContext)
   - Run the app and confirm auth still works

2. Extract router → `src/router.tsx`
   - Move all <Route> definitions to router.tsx
   - Import and render <Router /> from App.tsx
   - Confirm all routes still resolve

3. Extract Workout feature → `src/features/workout/`
   - Identify workout-related state, handlers, and components
   - Create `src/features/workout/index.tsx` as the route component
   - Move workout context (if any) to `src/features/workout/WorkoutContext.tsx`
   - Update router.tsx import

4. Extract Character/RPG feature → `src/features/character/`
   - Same pattern as workout

5. Extract Coach feature → `src/features/coach/`
   - Same pattern as workout

6. Reduce App.tsx to shell
   - App.tsx should only contain: provider wrappers, global error boundary, and <Router />

## Constraints

- Do not rewrite logic during extraction — move it as-is
- Each PR must pass `npm run build` and a manual smoke test of the extracted feature
- Do not enable strictNullChecks as a side effect (separate High finding)
- GitHub Spark runtime compatibility: confirm any context API changes do not break Spark integration
```

- [ ] Commit: `git add docs/app-decomposition-plan.md && git commit -m "docs: add App.tsx decomposition plan"`

**Note:** Actual decomposition is a separate implementation plan. Do not attempt it here. The plan document above is the full deliverable for Task 9.

---

### Task 10: scribd — Stripe webhook skeleton (XL)

**Finding (SC1):** There is no `/api/webhooks/stripe` route. After a successful Stripe checkout, no event is processed and no entitlement is granted. The README claims Stripe entitlement delivery is shipped.

**Working dir:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd/`

**This task: create the skeleton and env scaffolding only. Do not implement real Stripe logic.**

**Step 1: Create the webhook handler skeleton**

- [ ] Create `app/api/webhooks/stripe/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// TODO: Install stripe package if not present: npm install stripe
// TODO: Wire real Stripe client once STRIPE_SECRET_KEY is confirmed in env

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    // TODO: Uncomment when stripe package is installed and STRIPE_SECRET_KEY is set
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    throw new Error('Stripe webhook handler not yet implemented');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // TODO: Implement handlers below once signature verification is wired

  switch (event.type) {
    case 'checkout.session.completed':
      // TODO: Step 2 — record purchase in Supabase `user_purchases` table
      // TODO: Step 3 — trigger PDF delivery via existing email path
      console.log('checkout.session.completed — not yet handled');
      break;

    case 'payment_intent.succeeded':
      // TODO: Update payment status in purchases table
      console.log('payment_intent.succeeded — not yet handled');
      break;

    case 'invoice.payment_failed':
      // TODO: Mark subscription as past_due, send failure email
      console.log('invoice.payment_failed — not yet handled');
      break;

    default:
      // Ignore unhandled event types
      break;
  }

  return NextResponse.json({ received: true });
}
```

**Step 2: Update `.env.example`**

- [ ] Read current `.env.example` to find the existing Stripe entries
- [ ] Add if not present:
  ```
  # Stripe webhook secret — get from Stripe Dashboard → Webhooks → your endpoint → Signing secret
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```

**Step 3: Update README**

- [ ] Find the Stripe entitlement claim: `grep -n "entitlement\|webhook\|fulfillment\|delivery" README.md | head -10`
- [ ] Replace "Stripe entitlement delivery is shipped" (or equivalent) with "Stripe payment flow is implemented; post-purchase entitlement delivery is in development."

**Step 4: Verify**

- [ ] Run `npm run build` — must pass (the skeleton must compile; the `event` reference on the switch statement will cause a TypeScript error — scope the `event` variable correctly or add `// @ts-expect-error TODO` until the full implementation)
- [ ] Commit: `git add app/api/webhooks/stripe/route.ts .env.example README.md && git commit -m "feat(stripe): scaffold webhook handler skeleton"`

**Note:** Full Stripe integration (purchase recording in Supabase, PDF delivery trigger, test mode validation) requires a dedicated implementation plan. The skeleton and README fix are the full deliverable for Task 10.

---

## Completion Checklist

After all tasks in a phase are complete, run this verification pass:

**Phase 1 gate:**
- [ ] `bolts`: `npm run build` passes, `node_modules/@alawein/tokens` reports 0.2.0
- [ ] `bolts`: visiting `/admin` without a session redirects to `/login`
- [ ] `scribd`: `app/components/` directory no longer exists; `npm run build` passes
- [ ] `atelier-rounaq`: `npm run build` passes with exit code 0

**Phase 2 gate:**
- [ ] `bolts`: visiting `/account` without a session redirects to `/login`; with a session, real user data appears
- [ ] `repz`: `analyzeForm`, `predictProgress`, `analyzeFoodPhoto` throw `AIFeatureNotImplementedError`; UI shows "coming soon" state, not fake data
- [ ] `attributa`: live domain serves the correct product or a coming-soon page
- [ ] `llmworks`: benchmark runner shows "not yet implemented" state instead of random scores

**Phase 3 gate:**
- [ ] `gymboy`: `docs/app-decomposition-plan.md` exists and App.tsx is unchanged
- [ ] `scribd`: `app/api/webhooks/stripe/route.ts` exists as a skeleton, `npm run build` passes
