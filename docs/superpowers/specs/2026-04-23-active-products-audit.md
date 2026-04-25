---
title: Spec A — Active Products Audit
date: 2026-04-23
status: active
type: canonical
feeds: [master-execution-plan]
last_updated: 2026-04-23
---

# Spec A — Active Products Audit

**Generated:** 2026-04-23
**Repos audited:** bolts, repz, gymboy, scribd, llmworks, meshal-web, attributa, atelier-rounaq
**Purpose:** Full audit of the 8 active product repos — front-end quality, design-system adoption, architecture, portfolio presentation, feature gaps.

---

## Executive Summary

**Overall health:** Red. 7 of 8 repos carry Critical findings (only meshal-web has zero Criticals), and 5 of 8 contain false or unverifiable capability claims (6 if atelier-rounaq's build failures backing product promises are included) that are immediately discoverable by a technical visitor. Stripe and AI/eval surfaces dominate the Critical list — commercial paths take real money without fulfillment, and "AI-powered" claims resolve to `Math.random()` or hardcoded returns on inspection. Design-system adoption is fragmented: only 2 of 8 repos (scribd, llmworks) reach Low drift; 4 repos import tokens then neutralize them via parallel CSS. Portfolio-level visibility is strong only on meshal-web and gymboy.

**Strongest portfolio assets:** meshal-web (coherent narrative, strict TS, 0 Criticals), gymboy (genuinely-implemented retro RPG with real AI agents), atelier-rounaq (visual polish despite 4 build-breaking Criticals), scribd (cleanest DS adoption, polished commerce UI).

**Weakest portfolio assets:** attributa (live domain shows the wrong product entirely — fitness RPG instead of attribution intelligence), llmworks (benchmark results are Math.random() on a domain positioned as an eval platform), atelier-rounaq (4 Criticals including 3 build-breaking missing modules and broken image paths on the live luxury storefront).

**Most urgent cross-cutting issue:** False product claims in READMEs and live domains — 5 of 8 repos contain false or unverifiable capability claims (6 if atelier-rounaq's build failures backing product promises are included) backed by stubs, mock data, or unrouted code, and this is discoverable on first interaction by any technical evaluator.

---

## Per-Product Findings

### bolts (https://bolts.fit)

**Stack:** Next.js 16.2.3 / TS strict / Tailwind 4 / TanStack Query v5 | **DS Adoption:** tokens + theme imported, no @alawein/ui, installed versions 0.1.0 lag declared 0.2.0/0.3.0 | **Drift Level:** Critical

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | Account/dashboard pages use mock data, no auth gate | FE | src/app/account/page.tsx:4-17, src/app/dashboard/page.tsx | Replace mockUser with real Supabase session + purchases query; add middleware auth redirect | L |
| Critical | Admin panel publicly accessible, no auth check | Arch | src/app/admin/page.tsx, src/app/admin/testimonials/page.tsx | Add Supabase session guard or Next.js middleware to protect /admin/* routes | S |
| Critical | Installed design packages are v0.1.0, declared as 0.2.0/0.3.0 — lockfile never updated | DX | node_modules/@alawein/tokens package.json | Run `npm install @alawein/tokens@0.2.0 @alawein/theme-base@0.3.0` and commit updated lockfile | S |
| High | Components bypass design tokens — 156 hard-coded Tailwind color instances vs 11 token-derived | FE | src/components/Testimonials.tsx, src/app/dashboard/page.tsx | Migrate component color classes to bolts-* token utilities already defined in globals.css @theme block | L |
| High | ErrorBoundary uses light theme classes (bg-gray-50, text-navy-900) — invisible against dark site | FE/UX | src/components/ErrorBoundary.tsx:37-53 | Replace with dark theme classes matching the site (bg-bolts-bg, text-bolts-white) | S |
| Medium | Affiliate route is a stub with TODO; refund email notification also missing | Arch | src/app/api/affiliate/route.ts:13, src/app/api/refund/route.ts:50-51 | Implement or remove stub endpoints; stubs log to console in production | M |
| Medium | Blog route exists but no content source — will 404 in production | FE | src/app/blog/page.tsx, src/app/blog/[slug]/page.tsx | Wire to MDX files, Supabase table, or remove route | M |
| Medium | ProgressTracker hardcoded session data, not persisted to Supabase | FE/Arch | src/components/ProgressTracker.tsx:23-46 | Connect to Supabase user_sessions table; replace hardcoded dates | M |
| Low | alert() used for checkout error feedback | FE/UX | src/app/checkout/[planId]/page.tsx:91 | Replace with inline error state in the checkout form | S |
| Low | README omits design system, content package architecture, and env var requirements | Portfolio/DX | README.md | Add design system section and content package description | S |

---

### repz (https://repzcoach.com)

**Stack:** Vite 7.3.2 + React Router 7 / TS strict:false / Tailwind 4 / TanStack Query v5 + Zustand / PWA + Capacitor | **DS Adoption:** 228 @alawein/ui imports across 244 files; tokens/theme-base not CSS-imported, parallel custom token layer in src/index.css | **Drift Level:** Medium-High

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | AI service stubs shipped as product features | Arch | src/services/ai/WorkoutAI.ts:38-45 hardcoded analyzeForm return, NutritionAI.ts | Remove or replace stub methods with live inference; update README until real calls exist | L |
| High | TypeScript strict mode disabled with 204 `any` usages | Code Quality | tsconfig.app.json line 18; grep `: any` src/ | Enable strict incrementally starting with noImplicitAny per domain | L |
| High | Dead code: unrouted projects tree + LazyRouter + duplicate AuthContext | Arch | src/projects/ (no App.tsx routes), src/router/LazyRouter.tsx, src/contexts/AuthContext.tsx | Remove or route src/projects/ content; delete LazyRouter.tsx; delete duplicate AuthContext | M |
| High | Dual CSS token system — @alawein/tokens not the source of truth | DS | src/index.css lines 136-322 custom vars; tokens/theme-base not CSS-imported | Adopt @alawein/theme-base as the CSS variable source or document the intentional divergence | M |
| Medium | Integration tests are hollow smoke tests asserting only page renders | Testing | src/test/integration/user-journey.test.tsx lines 65-105 | Replace behavior-named tests with actual behavior assertions or rename | M |
| Medium | 71 local src/components/ui/ files shadow @alawein/ui without clear boundary | DS | src/components/ui/ directory (71 files) | Establish explicit ownership boundary and document the contract | S |
| Medium | src/App.css contains default Vite scaffold boilerplate | Dead Code | src/App.css lines 1-43 (logo-spin, #646cff, .read-the-docs) | Delete or replace with product-specific styles | S |
| Medium | No payment flow despite pricing page and tier system | Feature Gap | App.tsx has /pricing route; no Stripe Elements component | Wire Stripe checkout before claiming subscription/tier business model | L |
| Medium | next package in dependencies with no next.config.js and 4 frozen files | Tech Stack | package.json line 69; src/app/ | Remove next from dependencies after deleting src/app/ frozen layer | S |
| Low | src/superprompts/ (AI agent tooling) committed into product src tree | Dead Code | src/superprompts/diff.ts, scan.ts, types.ts | Move to scripts/ or .ai-tools/ at repo root | S |
| Low | Suspense fallbacks in App.tsx are bare string divs, not skeleton components | UX | App.tsx lines 83, 95, 111, 127, 200 | Replace bare divs with CardSkeleton or domain-appropriate skeleton | S |

---

### gymboy (https://gymboy.coach)

**Stack:** Vite 7.2.6 / React 19 / TS strictNullChecks-only / Tailwind 4 / local state + IndexedDB (useKV) | **DS Adoption:** tokens + theme imported in main.css then overridden by two competing :root blocks; no @alawein/ui (local shadcn copies) | **Drift Level:** High

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | App.tsx monolith exceeds 3,500 lines | Arch | src/App.tsx lines 1-3500+ | Split into feature modules with context providers; extract state slices | XL |
| High | TanStack Query declared but never used — manual loading state duplication | Arch | package.json + 0 grep hits for useQuery/useMutation in src | Adopt TQ for all async state or remove the dependency (prerequisite for App.tsx decomposition) | L |
| High | Design system tokens imported then immediately overridden — two competing :root blocks | DS | src/main.css:2-3 imports, src/main.css:37 first override, src/index.css:907 second override | Create @alawein/theme-gymboy package or remove @alawein imports and own GBA palette locally | M |
| High | Installed @alawein package versions (0.1.0) lag pinned versions (0.2.0, 0.3.0) | DS | node_modules/@alawein/*/package.json | Run npm install to resolve; run visual smoke test after install | S |
| Medium | src/debug.log is a committed Chrome Crashpad artifact | Repo hygiene | src/debug.log:1 | Delete file, add *.log to .gitignore | S |
| Medium | ErrorFallback.tsx props are untyped (implicit any) | TypeScript | src/ErrorFallback.tsx:4 | Add `FallbackProps` from react-error-boundary | S |
| Medium | README undersells the product — no mention of RPG mechanics, AI agents, or visual identity | Portfolio | README.md | Add feature summary, screenshots/GIF of GBA UI, character selection, XP system | M |
| Low | Dead vite chunk config references three.js (not installed) | Build config | vite.config.ts:28 — `vendor-3d` chunk | Remove the three chunk or add the dependency if 3D is planned | S |
| Low | 20+ generative dev artifacts at repo root | Repo hygiene | gymboy/ root directory | Move to docs/ or delete; root should contain only standard project files | S |

---

### scribd (https://scribd.fit)

**Stack:** Next.js 16.2.3 / TS strict / Tailwind 4.1.9 / no state manager | **DS Adoption:** tokens + theme imported in app/globals.css, @alawein/ui Button used directly, 4 hardcoded color values | **Drift Level:** Low

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | Stripe webhook and entitlement fulfillment not implemented | Arch | No /api/webhooks/stripe route; no post-purchase delivery; README claims this is shipped | Add webhook handler, purchase recording, and PDF delivery route | XL |
| High | Checkout route silently ignores payment options | Commerce | app/api/checkout/route.ts:5-8 — paymentOption/giftEmail/promoCode never read | Implement Stripe Subscriptions for installments, coupon codes for promos, gift flow | L |
| High | Duplicate component directories causing dead code confusion | Structure | app/components/ contains identical copies of root components/ (MD5 confirmed); theme-provider.tsx imported nowhere | Delete app/components/, remove unused theme-provider.tsx | S |
| Medium | Monolithic client page (1,167 lines "use client") | Performance | app/page.tsx forces entire storefront to client-side render | Decompose into server component shell with targeted client islands | M |
| Medium | Stale globals.css dead file in styles/ | Maintenance | styles/globals.css is an unmodified shadcn default (light theme); active entry is app/globals.css | Delete styles/globals.css | S |
| Medium | Raw oklch values in component inline styles instead of CSS variables | DS | app/page.tsx:743,754,765 use oklch(0.18 0 0) directly | Replace three oklch literals with var(--border) | S |
| Low | README overstates shipped features | Portfolio | Claims Supabase auth and Stripe entitlement delivery are live; neither is implemented | Qualify as "planned" or implement the missing pieces | S |
| Low | No error toast on checkout failure | UX | app/page.tsx:360-364 only console.error on checkout error | Add sonner toast (already in deps) on checkout failure | S |
| Low | Footer links 404 on live site | UX/Portfolio | /privacy, /terms, /support linked in footer but routes do not exist | Create stub pages or remove links | S |

---

### llmworks (https://llmworks.dev)

**Stack:** Vite 7.3.2 / React 19 / TS strict / Tailwind 4 / TanStack Query v5 (configured, unused) | **DS Adoption:** tokens + theme imported; @alawein/ui (Button, Card, Badge, Select, cn) used in 6+ files; 550 var(--*) vs 70 hex in chart arrays only | **Drift Level:** Low

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | All benchmark/eval execution is simulated | Arch | BenchmarkRunner.tsx:129 (Math.random()), DebateMode.tsx:52-78 (setTimeout mock), useModelComparison.ts:5 (MOCK_MODELS const) | Wire at least one real provider (Anthropic SDK or OpenAI SDK via edge function or proxy) | XL |
| Critical | README claims "OpenAI and Anthropic integrations where configured" with no supporting code | Portfolio | README.md line 26 vs. zero SDK import in any src file | Update README to remove false capability claims AND wire at least one real provider | S |
| High | Supabase schema defined but fully unused | Arch | integrations/supabase/types.ts defines evaluations + models tables; zero .select()/.insert() calls outside useAuth.tsx | Implement persistence for model configs and eval results using existing schema | L |
| Medium | Parallel component trees — local shadcn components alongside @alawein/ui | DS | src/components/ui/sidebar.tsx + toast.tsx import cn from @alawein/ui but are locally vendored duplicates | Consolidate: remove src/components/ui/ vendored copies and source from @alawein/ui | M |
| Medium | App.css is Vite scaffold boilerplate, never imported | Dead Code | src/App.css:1-42 (.logo, .read-the-docs, logo-spin) never referenced | Delete App.css | S |
| Medium | lib/ init functions (security, advancedSEO, monitoring) implemented but commented out at call site | Dead Code | App.tsx:26-28, src/lib/advanced-seo.ts, monitoring.ts, security.ts | Either wire the init calls or delete the modules | S |
| Low | TanStack Query configured but never used for data fetching | Arch | App.tsx:42-61 has production QueryClient config; no useQuery anywhere in src/ | Wire data fetching through TanStack Query when provider calls are implemented | M |
| Low | Empty blank import lines in component files | Code Quality | BenchmarkRunner.tsx:4-8, DebateMode.tsx:3-7, ResultsViewer.tsx:1-5, ModelManager.tsx:3-11 | Remove blank import blocks | S |

---

### meshal-web (https://www.meshal.ai)

**Stack:** Vite 7.3.2 / React 19 / react-router-dom 7 / TS strict, 0 `any` / Tailwind 4 / no global state | **DS Adoption:** tokens TS sub-path imported in designTokens.ts only; @alawein/theme-base CSS not consumed (1360-line globals.css hand-duplicates all values); zero @alawein/ui imports; tailwind-merge absent from local cn() | **Drift Level:** Medium

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| High | LinkedIn not surfaced | Navigation/Contact | contact.ts:6 has linkedinUrl, never rendered in nav/footer/hero | Add to SiteFooter and hero social strip | S |
| Medium | @alawein/theme-base CSS not consumed | Arch | src/app/globals.css:1-1360 duplicates all token values manually; package installed but CSS never imported | Switch globals.css to @import from @alawein/theme-base and remove duplicate @theme block | L |
| Medium | @alawein/ui declared but unused | DS | package.json:63 — zero imports in src/; parallel local Button/Card/etc. maintained | Evaluate replacing local ui components with @alawein/ui counterparts incrementally | L |
| Medium | Stale unreachable section components | Arch | src/components/sections/HeroSection.tsx, ProjectsSection.tsx, AboutSection.tsx, SkillsSection.tsx — theme-delegated routes never reach these | Delete or archive stale components; document active theme path in SSOT.md | S |
| Medium | tailwind-merge absent from cn() utility | Component Quality | src/vendor/meshal-site-primitives/cn.ts:1 — no conflict resolution for Tailwind class merging | Add tailwind-merge to package.json and update cn() | S |
| Low | Publications not surfaced in portfolio | Portfolio | src/data/publications.ts has real data; no landing/about section renders it | Add a publications/research section to /about or landing | M |

---

### attributa (https://attributa.dev)

**Stack:** Vite 7.3.2 / React 19 / TS strict:false / Tailwind 4 / Zustand + TanStack Query | **DS Adoption:** tokens + theme imported; @alawein/ui broad usage across ~25 files; src/styles/design-tokens.css overrides theme-base with bespoke RPG palette | **Drift Level:** Medium

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | Attribution feature set unreachable in production | Arch | src/App.tsx — no routes for /scan, /workspace, /results, /settings | Restore routing for attribution pages or explicitly document the product as Repz/Gymboy fitness app | S |
| High | NLP analyzer is a stub — AI detection returns hardcoded values | Feature | src/lib/nlp/analyzer.ts:3; analyzeText() returns score: 0.5 hardcoded; detectgpt.ts curvature logic real but unwired | Wire @huggingface/transformers pipeline to compute real GLTR token ranks and supply getLogProb() to detectGPTCurvature() | L |
| High | Attribution product features have zero routes — invisible at live URL | Portfolio/Arch | App.tsx has no routes for Workspace/Scan/Results/Settings | Reconnect routes only after NLP stub is resolved or demo-mode path is built | L |
| High | Orphaned pages create dead code surface — 7+ unreachable pages in src/pages/ | Arch | src/pages/{Workspace,Scan,Results,Settings,Auth,Index,Documentation,NotFound}.tsx not in App.tsx | Either route them or move to _hidden/; current state is navigational debt | S |
| Medium | projects.json describes wrong product for attributa.dev | Portfolio | projects.json description says "attribution intelligence" but live site shows fitness RPG | Update projects.json description to match current live product OR add routing redirect | S |
| Medium | TypeScript strict mode disabled | Code quality | tsconfig.app.json:11-14 (strict: false, noImplicitAny: false) | Enable strict and noImplicitAny; fix resulting type errors | M |
| Medium | DOI resolver is a stub — no live CrossRef API calls | Feature | src/lib/citations/doi.ts:35-63, resolveDOI() returns synthetic metadata for known publisher prefixes | Integrate CrossRef REST API with rate limiting and caching | M |
| Medium | Demo resume files in _hidden/ may contain real PII | Privacy/security | src/_hidden/resumeTailor/demo/resume_research.md, resume_software.md | Audit these files; replace with clearly synthetic demo data before any public fork | S |
| Low | Duplicate page pairs — Auth.tsx/AuthPage.tsx, NotFound.tsx/NotFoundPage.tsx | Code quality | src/pages/Auth.tsx and src/pages/AuthPage.tsx (both exist; only AuthPage.tsx routed) | Delete the unrouted duplicates | S |
| Low | src/styles/design-tokens.css overrides @alawein/theme-base silently | DS | src/index.css:4 + src/styles/design-tokens.css | Document the theme extension pattern or derive an official theme variant | S |

---

### atelier-rounaq (https://atelier-rounaq.com)

**Stack:** Vite 7.3.2 / React 19 / TS strict, 0 `any` / Tailwind 4 / CartContext + localStorage; TanStack Query installed unused | **DS Adoption:** none — zero @alawein/* packages; intentional luxury divergence with bespoke src/design/ + @theme inline | **Drift Level:** Intentional standalone

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|
| Critical | Missing design/utilities.ts causes build failure | Design | src/design/hooks.ts:25, src/design/index.ts:72 | Create utilities.ts exporting getColor, getTextStyle, getShadow, etc. OR remove the import and inline needed helpers | M |
| Critical | lib/auth.ts and lib/booking.ts missing — ProtectedRoute and AppointmentForm will not compile | Arch | src/components/auth/ProtectedRoute.tsx:3, src/components/booking/AppointmentForm.tsx:8 | Implement both modules using Supabase client, or stub with no-ops if not yet active | M |
| Critical | Broken product images — all collection pieces reference /images/*.jpg paths that do not exist | Portfolio | src/data/collection.ts:18,24,30 | Add actual product images to public/images/ or use Supabase Storage URLs | S |
| Critical | tokens.ts has duplicate exports (tokens and DesignTokens declared twice) | Design | src/design/tokens.ts:52 vs 419, :1 vs 421 | Merge into a single coherent token file; the two palettes are contradictory | S |
| High | TanStack Query installed but fully unused — adds ~50KB bundle weight | Arch | package.json:37 | Either wire up useQuery for Supabase data fetching or remove the dependency | S |
| High | @react-three/fiber, @react-three/drei, @react-three/xr in dependencies but zero usage | Arch | package.json:31-33 | Remove three.js packages — saves ~2MB potential bundle weight | S |
| High | Ore/mining scaffold contamination — MiningAnimations.tsx and ore-showcase-data.ts have no place in a luxury fashion codebase | Dead code | src/data/ore-showcase-data.ts, src/components/animations/MiningAnimations.tsx, src/components/cards/LuxuryCards.tsx:23 | Delete both files and replace copper-ore Tailwind class references | S |
| High | Client portal lazy-loads 5 components that do not exist — will throw at runtime if any protected route is hit | Arch | src/config/routes.ts:19-25 | Implement or remove client portal stubs; /login route also absent from App.tsx | L |
| Medium | No SEO meta tags or structured data | Portfolio | App.tsx — no helmet/meta | Add react-helmet-async or Vite-side meta for Open Graph, Arabic locale hreflang | M |
| Medium | LuxuryHero.tsx stub component diverges from actual hero in LandingPage.tsx | Arch | src/components/luxury/LuxuryHero.tsx:1-21 | Either delete stub or expand it to replace the inline landing hero | S |
| Low | DesignSystemPage defined in routes.ts but not routed in App.tsx | Dead code | src/config/routes.ts:14,69 | Either expose as /design-system dev route in App.tsx or remove | S |
| Low | Two parallel Supabase clients (src/lib/supabase.ts throws on missing env; src/integrations/supabase/client.ts uses placeholders) | Arch | src/lib/supabase.ts:7, src/integrations/supabase/client.ts:12 | Consolidate to one Supabase client module | S |

---

## Cross-Product Findings

### Design-System Adoption Ranking

| Rank | Repo | Packages Present | Drift Level | Assessment |
|------|------|-----------------|-------------|------------|
| 1 | scribd | @alawein/tokens 0.2.0, @alawein/theme-base 0.3.0, @alawein/ui ^0.1.0 | Low | Cleanest adoption: tokens + theme imported in globals.css, @alawein/ui Button used, only 4 hardcoded color values. Custom brutalist palette is intentional override layered on top. |
| 2 | llmworks | @alawein/tokens, @alawein/theme-base, @alawein/ui (Button, Card, Badge, Select, cn) | Low | 550 var(--*) vs 70 hex values (hex isolated to recharts arrays and icon strokes). Parallel local src/components/ui/ shadows DS without overriding it. |
| 3 | attributa | @alawein/tokens, @alawein/theme-base, @alawein/ui (~25 files) | Medium | Good @alawein/ui breadth. src/styles/design-tokens.css overrides theme-base with bespoke RPG neon green palette — documented enough to count as intentional extension. |
| 4 | repz | @alawein/tokens, @alawein/theme-base, @alawein/ui (228 import lines across 244 files) | Medium-High | Heaviest @alawein/ui consumption by volume. BUT tokens/theme-base NOT CSS-imported; parallel custom token layer in src/index.css is the actual visual SSOT. |
| 5 | bolts | @alawein/tokens 0.2.0 declared / 0.1.0 installed, @alawein/theme-base 0.3.0 declared / 0.1.0 installed, NO @alawein/ui | Critical | Tokens + theme CSS imported but bypassed: 156 hardcoded Tailwind color classes vs 11 token-derived. Lockfile drift means declared upgrade never installed. |
| 6 | gymboy | @alawein/tokens 0.2.0 declared / 0.1.0 installed, @alawein/theme-base 0.3.0 declared / 0.1.0 installed, NO @alawein/ui | High | Tokens imported in src/main.css then immediately overridden by hardcoded :root block; second competing :root block in src/index.css redefines everything again. |
| 7 | meshal-web | @alawein/tokens 0.2.0 (ninja sub-path only), @alawein/theme-base 0.3.0 unused, @alawein/ui ^0.1.0 unused | Medium | Zero @alawein/ui imports. Theme CSS not imported — globals.css hand-duplicates 1360-line @theme block. tailwind-merge missing from cn(). Silent drift on every token upgrade. |
| 8 | atelier-rounaq | NONE | Intentional standalone | Zero @alawein/* packages. Bespoke luxury design system documented in CLAUDE.md as deliberate divergence for Arabic typography + SAR-market aesthetic. Verdict: justified. |

### Shared Component Candidates

| Component | Repos | Recommended Action |
|-----------|-------|--------------------|
| LoadingSpinner / PageLoader / Skeleton | bolts, repz, gymboy, llmworks, meshal-web, attributa, scribd, atelier-rounaq (8/8) | Extract a headless Spinner + Skeleton primitive pair to @alawein/ui; each repo skins via tokens |
| ErrorBoundary / ErrorFallback | bolts, repz, gymboy, llmworks, meshal-web, attributa, atelier-rounaq (7/8) | Extract to @alawein/ui with a token-driven default fallback and typed FallbackProps |
| EmptyState | repz, gymboy, attributa, atelier-rounaq, scribd (5/8; llmworks missing and silently omits it) | Extract to @alawein/ui with icon + title + description + action slot |
| Button | scribd, repz, llmworks, attributa consume @alawein/ui; bolts, gymboy, meshal-web, atelier-rounaq local | Already in @alawein/ui — migrate bolts/gymboy/meshal-web; atelier may justifiably fork |
| Card / CardContent / CardHeader / CardTitle | repz (100+ uses), llmworks, attributa, scribd | Already in @alawein/ui — push remaining 4 repos (bolts, gymboy, meshal-web, atelier) to adopt |
| cn utility | repz (97 uses), llmworks (6 imports), attributa, scribd use @alawein/ui; bolts/gymboy/meshal-web/atelier vendor their own | Consolidate on @alawein/ui cn; meshal-web's lacks tailwind-merge — correctness bug |
| Tabs / TabsList / TabsTrigger / TabsContent | repz (16), llmworks, attributa, gymboy (local shadcn copy) | Already in @alawein/ui — migrate gymboy local copy |
| Form primitives + react-hook-form + zod | repz, llmworks, attributa, bolts, gymboy, atelier-rounaq; scribd uses raw HTML inputs (outlier) | Document the canonical @alawein/ui + react-hook-form + zod composition pattern; migrate scribd |
| Testimonials / social proof card | bolts, scribd | Borderline (2 repos); extract if a third commerce repo ships one |
| Vite scaffold lint (App.css boilerplate) | repz, llmworks, gymboy, atelier-rounaq | Not a component — add a bootstrap lint rule to @alawein/eslint-config |

### Unjustified Divergences

| Pattern | Repos | Impact | Fix |
|---------|-------|--------|-----|
| Auth context shape | repz (src/context/AuthContext.tsx AND src/contexts/AuthContext.tsx duplicate), attributa (AuthContext vs legacy useAuth), bolts (mock user), atelier-rounaq (imports nonexistent lib/auth) | Auth code diverges per-repo and per-file; blocks shared session primitive | Ship @alawein/auth or document canonical Supabase+Clerk useAuth pattern in workspace-tools |
| TanStack Query declared but not used | gymboy, llmworks (QueryClient configured, 0 useQuery), atelier-rounaq | ~50KB dead dep per repo; manual loading state duplicated across 8+ components; inconsistent UX | Workspace-level decision — adopt TQ as canonical async state layer, or remove from recommended deps |
| Loading-state spinners inline | repz (bare divs), scribd (inline string), bolts (animate-pulse), llmworks (LoadingSpinner) | Each repo invents its own Suspense fallback; no consistent UX across portfolio | Ship @alawein/ui PageLoader + Skeleton |
| Error feedback on form submit | bolts (alert()), scribd (console.error only), repz (useErrorHandler), attributa (inline isError), gymboy (local string state), meshal-web (controlled error + mailto — best) | User-visible error quality varies wildly | Adopt sonner (already in scribd) or shared @alawein/ui Toast pattern |
| Stale Vite scaffold CSS | repz (App.css #646cff), llmworks (same), gymboy (implicit) | 42+ lines of template cruft per repo signaling incomplete cleanup | Workspace-level lint rule or pre-commit hook flagging scaffold artifacts |
| tailwind-merge absence | meshal-web (explicit gap — local cn uses filter+join) | Unpredictable utility class conflicts | Export cn from @alawein/ui (done); require consumption |
| Payment/checkout fulfillment | bolts (Stripe + webhook, but /account mock), scribd (Stripe session only, no webhook), repz (no Stripe at all), attributa (tier stubs), atelier-rounaq (no gateway) | 5/8 repos claim commercial surfaces with incomplete wiring | Extract @alawein/payments pattern kit with reference Stripe webhook + Supabase entitlement write |

### Critical Cross-Cutting Issues

| Severity | Issue | Repos Affected | Systemic Fix |
|----------|-------|---------------|--------------|
| Critical | Payment/fulfillment surfaces incomplete or deceptive | scribd (no webhook on live paid product), bolts (admin unguarded + account mock), attributa (tier stubs), atelier-rounaq (no gateway), repz (no Stripe) — 5 repos | Ship @alawein/payments pattern kit with reference Stripe webhook + Supabase entitlement write; gate any commerce-claiming repo on conformance |
| Critical | READMEs overstate shipped features | scribd (Supabase auth + entitlement), llmworks (OpenAI/Anthropic integrations), repz (AI coaching), attributa (attribution intelligence), bolts (/account), gymboy (undersells — opposite) — 6 repos | Add voice-contract rule in alawein's style validator flagging unverified capability claims; dispatch llm-prompts sweep pattern |
| High | TypeScript strict mode disabled or partial | repz (strict:false, 204 any), gymboy (strictNullChecks-only, 27 any), attributa (strict:false, 6 any), bolts (strict but mock data/unknown) — 4 repos vs strict-clean: scribd, llmworks, meshal-web, atelier-rounaq | Enforce strict:true as @alawein/tsconfig base-extends requirement; CI gate in workspace-tools rejecting PRs loosening strict flags |
| High | @alawein/tokens + theme-base imported then overridden/neutralized | bolts (hardcoded classes bypass tokens), gymboy (two competing :root blocks), repz (parallel custom token layer), meshal-web (theme-base CSS never consumed, hand-duplicated 1360 lines) — 4 repos | Document 3 allowed relationships in SSOT.md (consume as-is, intentional override, forked DS); ship `audit:token-adoption` workspace-tools script flagging bypasses |
| High | Dead code surfaces — orphan pages / unmounted routes / scaffold artifacts committed | repz, gymboy, llmworks, attributa, atelier-rounaq, meshal-web, bolts, scribd — 8 repos at varying severity | workspace-tools script `audit:dead-routes` finding orphans; .gitignore rule for *.log; validator for scaffold artifacts (claude-code-*.jsx, debug.log, Vite App.css) |
| Medium | Installed @alawein/* package versions lag declared (lockfile drift) | bolts (declared 0.2.0/0.3.0, installed 0.1.0), gymboy (same), meshal-web/attributa need verification — 2+ confirmed | Pre-commit / CI check in workspace-tools diffing package.json declared vs node_modules installed versions for @alawein/* packages |
| Medium | TanStack Query declared as dependency but not used | gymboy (0 usages), llmworks (QueryClient configured, 0 useQuery), atelier-rounaq (0 usages, no provider) — 3 repos | Workspace-level decision: adopt TQ canonically or remove from recommended deps |

### AI/Feature Stub Pattern

| Repo | Claim | Reality | Severity |
|------|-------|---------|----------|
| repz | "AI-powered coaching platform" (WorkoutAI form analysis via TensorFlow/PoseNet, NutritionAI, predictive progression) | WorkoutAI.analyzeForm() returns hardcoded `score: 85`; predictProgress() returns static values; NutritionAI methods return hardcoded recommendations; TensorFlow/PoseNet installed but wired to nothing | HIGH |
| llmworks | "LLM evaluation and security-testing workbench, runs evaluation and benchmark flows against configured providers (OpenAI, Anthropic)" | BenchmarkRunner.tsx:129 Math.random() generates all scores; DebateMode setTimeout-returns hardcoded strings; MOCK_MODELS const; zero OpenAI/Anthropic SDK imports; MMLU/TruthfulQA/GSM8K decorative; Supabase tables never read/written; no security-testing component | CRITICAL |
| attributa | "Privacy-first attribution intelligence with AI detection, citation checks, and CWE scans" | Live site shows fitness RPG, not attribution; attribution code unrouted in App.tsx; analyzeText() returns hardcoded 0.5/0.8; DetectGPT curvature real but unwired; resolveDOI() stub returns fake metadata for known prefixes; CWE scan real but Python-only | CRITICAL |
| bolts | "Fitness transformation storefront with authenticated account + dashboard" | /account shows hardcoded "John Doe" + fabricated purchase history with no auth gate; /admin publicly accessible; ProgressTracker uses 2024-01-15 hardcoded dates; affiliate route only console.warns; LoyaltyProgram/ReferralProgram/BundleOffer unwired | HIGH |
| scribd | "Stripe-backed purchase and entitlement flows, Supabase-backed auth and access control" | NO /api/webhooks/stripe route; success_url redirects lead nowhere; no protected downloads; paymentOption/giftEmail/promoCode silently discarded (all 3 UX paths = identical $190 charge); promo "Apply" button calls console.log; footer /privacy, /terms, /support 404 | CRITICAL |
| gymboy | (README undersells — opposite pattern) "fitness coaching app" | GBA RPG, character sprite, XP/streak/level system, GBA sound effects, 9 AI coaching agents, PRCelebration animations — all real and implemented. AI calls route through /api/ai with no rate limiting or caching | LOW (undersell) |
| meshal-web | "AI systems engineer for governed agents, evaluation infrastructure, and scientific compute" | Real projects (Morphism, Alembiq, LLMWorks, EDFP, CHSH Lab, OptiQAP, REPZ), real Ph.D. EECS bio, 9 blog posts, working /api/contact + mailto fallback | NONE |
| atelier-rounaq | "Luxury couture atelier with bilingual EN/AR, private consultation booking" | UI real and polished; 151-key EN/AR parity; Zod booking form. BUT: lib/booking.ts imported by AppointmentForm does not exist — bookings will not compile; /images/collection-*.jpg paths reference nonexistent files — broken images on live site; no payment gateway; client portal lazy-loads 5 nonexistent components | HIGH |

---

## Portfolio Strength Assessment

| Rank | Repo | Verdict | Key Strength | Key Gap |
|------|------|---------|-------------|---------|
| 1 | meshal-web | Coherent portfolio hub telling a defensible story with real projects, real bio, strict TypeScript | Zero Criticals; strict:true with 0 `any`; real /api/contact; 7 real projects with live URLs and GitHub links; 9 substantive blog posts | LinkedIn not surfaced in nav/footer/hero; @alawein/ui + theme-base installed but unused (silent DS drift) |
| 2 | gymboy | Strongest genuinely-functional product — GBA RPG aesthetic is fully implemented and distinctive | Real character progression, 9 AI coaching agents, PDF export, GBA sound effects, pixel art, coherent retro identity | 3500-line App.tsx monolith; TanStack Query declared-but-unused; installed DS packages lag declared versions; README undersells the product |
| 3 | atelier-rounaq | Visually polished luxury atelier with correct i18n/RTL and Arabic-English parity, intentional DS divergence is justified | Editorial dark palette, Bodoni + Arabic typography, 151-key locale parity, WhatsApp/Saudi-market awareness, Framer Motion reveals | 4 Criticals including build-breaking missing modules (design/utilities.ts, lib/auth.ts, lib/booking.ts), duplicate tokens exports, broken image paths, mining/ore scaffold contamination |
| 4 | scribd | Cleanest design-system adoption in the portfolio, polished commerce surface — but the core commercial promise is a stub | Low drift; @alawein/ui Button adopted; brutalist palette layered cleanly on tokens; working Stripe checkout session | No Stripe webhook on live paid product (Critical); paymentOption/giftEmail/promoCode silently discarded; footer links 404; README overstates entitlement delivery |
| 5 | bolts | Real Stripe flow and real Supabase backend exist, but authenticated UX is fabricated and admin panel is publicly accessible | Working Stripe checkout; real webhook handler; real DB helpers; content-package-driven plans; A/B testing infra | 3 Criticals: /account hardcoded "John Doe", /admin unguarded, lockfile mismatch; 156 hardcoded Tailwind colors bypass tokens |
| 6 | repz | Largest codebase, most @alawein/ui adoption by volume — but AI coaching product claim is entirely stubbed | 642 TS/TSX files; broad domain coverage; TanStack Query + Zustand layered correctly; PWA/Capacitor configured | 1 Critical — all AI services return hardcoded values; dead `next` dep; strict:false with 204 `any`; unrouted src/projects/ contamination from other alawein products |
| 7 | llmworks | Looks credible from outside, collapses immediately on first interaction with any benchmark | Polished UI; strict TypeScript; Low drift; 10 lazy-loaded routes; real ErrorBoundary; Supabase auth wired | 2 Criticals — benchmark results are Math.random(), README claims OpenAI/Anthropic integrations with zero SDK code; Supabase schema defined but never read/written |
| 8 | attributa | The product claimed at the domain is not the product deployed at the domain | Attribution code itself shows genuine domain understanding (real GLTR math, real DetectGPT curvature, real watermark p-value, real CWE regex scanning); _hidden/resumeTailor complete and production-ready | Live site shows fitness RPG not attribution intelligence; 7+ orphaned attribution pages unreachable; NLP analyzer stub returns 0.5/0.8; CrossRef resolver is prefix-matching stub; strict:false |

---

## Summary Counts

| Repo | Critical | High | Medium | Low | Total |
|------|----------|------|--------|-----|-------|
| bolts | 3 | 2 | 3 | 2 | 10 |
| repz | 1 | 3 | 5 | 2 | 11 |
| gymboy | 1 | 3 | 3 | 2 | 9 |
| scribd | 1 | 2 | 3 | 3 | 9 |
| llmworks | 2 | 1 | 3 | 2 | 8 |
| meshal-web | 0 | 1 | 4 | 1 | 6 |
| attributa | 1 | 3 | 4 | 2 | 10 |
| atelier-rounaq | 4 | 4 | 2 | 2 | 12 |
| **Totals** | **13** | **19** | **27** | **16** | **75** |
