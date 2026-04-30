---
title: Spec A — Active Products Audit Implementation Plan
date: 2026-04-23
status: active
type: canonical
last_updated: 2026-04-23
---

# Spec A — Active Products Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce `2026-04-23-active-products-audit.md` — a complete per-product and cross-product audit of the 8 active product repos covering front-end quality, design-system adoption, architecture, portfolio presentation, and feature gaps.

**Architecture:** Per-repo structural exploration → per-repo findings files → cross-product synthesis → written audit document. No code is deployed or changed. All outputs are markdown. This spec feeds the master execution plan (Session 6).

**Tech Stack:** Python/bash (data collection), filesystem inspection, markdown (output format). Repos are TypeScript/React — 3 Next.js (bolts, repz, scribd), 5 Vite/React (gymboy, llmworks, meshal-web, attributa, atelier-rounaq).

**Spec:** `alawein/docs/superpowers/specs/2026-04-23-workspace-audit-design.md` § "Spec A"
**Triage context:** `alawein/docs/superpowers/specs/2026-04-23-workspace-triage.md`
**Output file:** `alawein/docs/superpowers/specs/2026-04-23-active-products-audit.md`

---

## Known Pre-Survey Findings (from Phase 0)

- `atelier-rounaq`: zero `@alawein/*` packages — completely disconnected from design system
- `bolts`, `gymboy`: have `@alawein/tokens` + `@alawein/theme-base` but NOT `@alawein/ui`
- `scribd`: no state management library (may be appropriate for content site)
- `attributa`: only product using Zustand (others use TanStack Query only or nothing)
- `repz`: has Next.js AND vite in deps (likely build/test config artifact — worth flagging)
- `meshal-web`: missing `tailwind-merge`

---

## File Map

- Create: `alawein/docs/superpowers/.spec-a-data/bolts.txt`
- Create: `alawein/docs/superpowers/.spec-a-data/repz.txt`
- Create: `alawein/docs/superpowers/.spec-a-data/gymboy.txt`
- Create: `alawein/docs/superpowers/.spec-a-data/scribd.txt`
- Create: `alawein/docs/superpowers/.spec-a-data/llmworks.txt`
- Create: `alawein/docs/superpowers/.spec-a-data/meshal-web.txt`
- Create: `alawein/docs/superpowers/.spec-a-data/attributa.txt`
- Create: `alawein/docs/superpowers/.spec-a-data/atelier-rounaq.txt`
- Create: `alawein/docs/superpowers/.spec-a-data/cross-product.txt`
- Create: `alawein/docs/superpowers/specs/2026-04-23-active-products-audit.md`
- Modify: `alawein/SSOT.md` (add Spec A pointer)

---

## Per-Repo Audit Template

Each of Tasks 1–8 follows this template. The subagent reads the repo and writes structured findings to `.spec-a-data/<repo>.txt`.

**Sections required in every findings file:**

```
=== REPO: <name> ===
Generated: 2026-04-23

--- TECH STACK ---
Framework: <Next.js|Vite/React>
TypeScript strict: <yes|no|unknown>
Tailwind version: <version>
Design system packages: <list of @alawein/* packages>
Theme in use: <theme name from CSS or config>
State management: <library or "none">
Data fetching: <TanStack Query|SWR|native fetch|none>
Live URL: <url from triage>

--- SOURCE STRUCTURE ---
<tree of src/ or app/ top level — dirs and key files>
Routes/pages: <list>
Component count: <approx number of .tsx files in components/>
Hook count: <approx number in hooks/>

--- DESIGN SYSTEM ADOPTION ---
@alawein/tokens imported: <yes|no — check tailwind.config or CSS imports>
Theme CSS imported: <yes|no — which file?>
@alawein/ui components used: <yes|no — grep for imports from @alawein/ui>
Custom tokens vs design system tokens: <assessment>
Drift level: <Low|Medium|High|Critical>
Evidence: <specific file:line showing adoption or gap>

--- COMPONENT QUALITY ---
Loading states: <present|missing|partial — with example file>
Error states: <present|missing|partial — with example file>
Empty states: <present|missing|partial — with example file>
Form patterns: <consistent|inconsistent|none — with example file>
TypeScript coverage: <strict|loose|any-heavy>
Key quality issue: <most important component quality problem>
Evidence: <specific file:line>

--- ARCHITECTURE ---
State management pattern: <description of how state is actually used>
Data fetching pattern: <how API/data calls are structured>
Component organization: <flat|feature-grouped|domain-grouped|mixed>
Dead code signals: <any unused files, commented blocks, debug artifacts>
Bundle config: <any notable vite/next config issues>
Key architecture issue: <most important architectural problem>
Evidence: <specific file:line>

--- PORTFOLIO PRESENTATION ---
Live site assessment: <what a visitor sees — is it polished?>
README quality: <does it describe the product clearly?>
Key presentation gap: <what most damages credibility>

--- FEATURE GAPS ---
<list of 3-5 specific missing features that weaken the product story>

--- FINDINGS SUMMARY ---
Critical: <count> | High: <count> | Medium: <count> | Low: <count>

Per finding:
[SEVERITY] Title | Area | Evidence | Action
```

---

## Task 1: Deep Audit — bolts

**Repo:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/`
**Framework:** Next.js | **Design system:** @alawein/tokens + @alawein/theme-base (no @alawein/ui) | **State:** TanStack Query
**Live URL:** https://bolts.fit

**Files:**
- Create: `alawein/docs/superpowers/.spec-a-data/bolts.txt`

- [ ] **Step 1: Explore source structure**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src" -type f -name "*.tsx" | head -40
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src" -type d
```

Also read:
- `bolts/src/app/` directory listing (Next.js app router routes)
- `bolts/src/components/` directory listing
- `bolts/next.config.js` or `next.config.ts`
- `bolts/tailwind.config.ts` or `bolts/postcss.config.mjs`

- [ ] **Step 2: Check design-system adoption**

```bash
# Check if @alawein/tokens is imported in CSS or config
grep -r "@alawein/tokens" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src" --include="*.css" --include="*.ts" --include="*.tsx" -l
grep -r "@alawein/ui" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src" --include="*.tsx" --include="*.ts" -l
grep -r "theme-base\|@alawein/theme" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts" --include="*.css" --include="*.ts" -l
```

Read one representative component file to assess whether design tokens are being used or overridden with hard-coded values.

- [ ] **Step 3: Assess component quality and architecture**

```bash
# Count components
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src/components" -name "*.tsx" | wc -l

# Check for loading/error/empty state patterns
grep -r "loading\|isLoading\|skeleton\|Skeleton" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src" --include="*.tsx" -l
grep -r "error\|Error\|catch\|fallback" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src" --include="*.tsx" -l
grep -r "empty\|isEmpty\|no data\|no results" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src" --include="*.tsx" -l

# Check TypeScript strict mode
grep "strict" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/tsconfig.json"
grep -r ": any" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/src" --include="*.tsx" --include="*.ts" | wc -l
```

Read 2-3 representative component files to assess patterns. Read `bolts/src/app/` to understand route structure and layout.

- [ ] **Step 4: Write findings to bolts.txt**

Create `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/bolts.txt` using the template above. Fill every section with real observations. No "TBD" or "unknown" where data was available.

- [ ] **Step 5: Verify findings completeness**

```bash
grep -c "^---" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/bolts.txt"
```

Expected: at least 8 section dividers (one per section). If fewer, the file is incomplete.

---

## Task 2: Deep Audit — repz

**Repo:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz/`
**Framework:** Next.js (+ vite in devDeps — flag this) | **Design system:** @alawein/tokens + @alawein/theme-base + @alawein/ui | **State:** TanStack Query
**Live URL:** https://repzcoach.com

**Files:**
- Create: `alawein/docs/superpowers/.spec-a-data/repz.txt`

- [ ] **Step 1: Explore source structure**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz/src" -type d
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz/src" -name "*.tsx" | head -40
```

Read:
- `repz/src/app/` directory (Next.js routes)
- `repz/src/components/` directory
- `repz/package.json` — confirm whether vite is in devDependencies and why

- [ ] **Step 2: Check design-system adoption**

```bash
grep -r "from '@alawein/ui'" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz/src" --include="*.tsx" | head -15
grep -r "@alawein/tokens" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz" --include="*.css" --include="*.ts" -l
grep -r "theme-base" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz" --include="*.css" -l
```

- [ ] **Step 3: Assess component quality and architecture**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz/src/components" -name "*.tsx" | wc -l
grep -r "loading\|isLoading\|Skeleton" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz/src" --include="*.tsx" -l
grep -r "error\|ErrorBoundary" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz/src" --include="*.tsx" -l
grep -r ": any" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz/src" --include="*.tsx" --include="*.ts" | wc -l
grep "strict" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/repz/tsconfig.json"
```

Read 2-3 representative components. Read the main app layout. Check `repz/src/app/` route structure for loading.tsx and error.tsx files.

- [ ] **Step 4: Write findings to repz.txt**

Create `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/repz.txt` using the template. In TECH STACK section, note whether vite appears to be a test runner artifact or accidental dependency.

- [ ] **Step 5: Verify findings completeness**

```bash
grep -c "^---" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/repz.txt"
```

Expected: at least 8 section dividers.

---

## Task 3: Deep Audit — gymboy

**Repo:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/gymboy/`
**Framework:** Vite/React | **Design system:** @alawein/tokens + @alawein/theme-base (no @alawein/ui) | **State:** TanStack Query
**Live URL:** https://gymboy.coach

**Files:**
- Create: `alawein/docs/superpowers/.spec-a-data/gymboy.txt`

- [ ] **Step 1: Explore source structure**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/gymboy/src" -type d
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/gymboy/src" -name "*.tsx" | head -40
```

Read:
- `gymboy/src/App.tsx` — main entry, routing
- `gymboy/src/components/` directory
- `gymboy/vite.config.ts`
- `gymboy/tailwind.config.ts` or similar

Note: gymboy is described as having a "retro progression-first training interface" — assess whether the UI matches this intent.

- [ ] **Step 2: Check design-system adoption**

```bash
grep -r "@alawein/tokens\|@alawein/theme-base" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/gymboy" --include="*.css" --include="*.ts" --include="*.tsx" -l
grep -r "from '@alawein/ui'" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/gymboy/src" --include="*.tsx"
```

Read `gymboy/src/index.css` or main CSS entry to see how theme tokens are wired.

- [ ] **Step 3: Assess component quality and architecture**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/gymboy/src/components" -name "*.tsx" | wc -l
grep -r "loading\|isLoading\|Skeleton" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/gymboy/src" --include="*.tsx" -l
grep -r "error\|ErrorFallback" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/gymboy/src" --include="*.tsx" -l
grep -r ": any" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/gymboy/src" --include="*.tsx" --include="*.ts" | wc -l
```

Read `gymboy/src/ErrorFallback.tsx` (file exists from survey). Check animation files in `gymboy/src/animations/`.

- [ ] **Step 4: Write findings to gymboy.txt**

Create `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/gymboy.txt` using the template.

- [ ] **Step 5: Verify**

```bash
grep -c "^---" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/gymboy.txt"
```

Expected: at least 8.

---

## Task 4: Deep Audit — scribd

**Repo:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd/`
**Framework:** Next.js | **Design system:** @alawein/tokens + @alawein/theme-base + @alawein/ui | **State:** none
**Live URL:** https://scribd.fit

**Files:**
- Create: `alawein/docs/superpowers/.spec-a-data/scribd.txt`

- [ ] **Step 1: Explore source structure**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd/src" -type d 2>/dev/null || find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd" -maxdepth 2 -type d
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd" -name "*.tsx" | head -30
```

Note: scribd has no `src/` dir from the Phase 0 survey — source may be at root level. Check `scribd/app/` (Next.js app router).

- [ ] **Step 2: Check design-system adoption**

```bash
grep -r "from '@alawein/ui'" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd" --include="*.tsx" | head -15
grep -r "@alawein/tokens" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd" --include="*.css" --include="*.ts" -l
```

- [ ] **Step 3: Assess component quality and architecture**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd" -name "*.tsx" | wc -l
grep -r "loading\|Skeleton" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd" --include="*.tsx" -l
grep -r ": any" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/scribd" --include="*.tsx" --include="*.ts" | wc -l
```

No state management — assess whether this is correct for the product type (fitness publishing/content site). Read the app router structure to understand what scribd actually renders.

- [ ] **Step 4: Write findings to scribd.txt**

Create `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/scribd.txt` using the template. In the architecture section, give a verdict on whether "no state management" is appropriate or a gap for this product.

- [ ] **Step 5: Verify**

```bash
grep -c "^---" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/scribd.txt"
```

Expected: at least 8.

---

## Task 5: Deep Audit — llmworks

**Repo:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/llmworks/`
**Framework:** Vite/React | **Design system:** @alawein/tokens + @alawein/theme-base + @alawein/ui | **State:** TanStack Query
**Live URL:** https://llmworks.dev

**Files:**
- Create: `alawein/docs/superpowers/.spec-a-data/llmworks.txt`

- [ ] **Step 1: Explore source structure**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/llmworks/src" -type d
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/llmworks/src" -name "*.tsx" | head -40
```

Read:
- `llmworks/src/App.tsx`
- `llmworks/src/components/` directory
- `llmworks/src/integrations/` directory (from Phase 0 survey — likely external service integrations)
- `llmworks/src/api/` directory

- [ ] **Step 2: Check design-system adoption**

```bash
grep -r "from '@alawein/ui'" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/llmworks/src" --include="*.tsx" | head -15
grep -r "@alawein/tokens" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/llmworks" --include="*.css" -l
```

- [ ] **Step 3: Assess component quality and architecture**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/llmworks/src/components" -name "*.tsx" | wc -l
grep -r "loading\|isLoading\|Skeleton" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/llmworks/src" --include="*.tsx" -l
grep -r "error\|Error" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/llmworks/src" --include="*.tsx" -l
grep -r ": any" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/llmworks/src" --include="*.tsx" --include="*.ts" | wc -l
```

Read `llmworks/src/integrations/` to understand how external LLM APIs are connected. This is the technically credibility-critical repo — assess whether the integration architecture is defensible.

- [ ] **Step 4: Write findings to llmworks.txt**

Create `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/llmworks.txt` using the template.

- [ ] **Step 5: Verify**

```bash
grep -c "^---" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/llmworks.txt"
```

Expected: at least 8.

---

## Task 6: Deep Audit — meshal-web

**Repo:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/`
**Framework:** Vite/React | **Design system:** @alawein/tokens + @alawein/theme-base + @alawein/ui (no tailwind-merge) | **State:** none
**Live URL:** https://www.meshal.ai

**Files:**
- Create: `alawein/docs/superpowers/.spec-a-data/meshal-web.txt`

- [ ] **Step 1: Explore source structure**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/src" -type d
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/src" -name "*.tsx" | head -40
```

Read:
- `meshal-web/src/App.tsx`
- `meshal-web/src/components/` directory
- `meshal-web/src/content/` or `meshal-web/src/data/` directory (likely portfolio content)
- `meshal-web/src/config/`

This is the primary portfolio showcase. Assess it as a technical recruiter or collaborator would.

- [ ] **Step 2: Check design-system adoption**

```bash
grep -r "from '@alawein/ui'" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/src" --include="*.tsx" | head -15
grep -r "@alawein/tokens\|theme-base" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web" --include="*.css" --include="*.ts" -l
```

Note: meshal-web is missing `tailwind-merge` — check if this causes inconsistent class merging in components.

- [ ] **Step 3: Assess portfolio presentation quality**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/src/components" -name "*.tsx" | wc -l
# Check for project showcase components
grep -r "project\|Project\|case-study\|portfolio" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/src" --include="*.tsx" -l
# Check for contact/CTA components  
grep -r "contact\|Contact\|cta\|CTA" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/src" --include="*.tsx" -l
grep -r ": any" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/meshal-web/src" --include="*.tsx" --include="*.ts" | wc -l
```

Read the main page component and 2-3 section components to assess portfolio presentation quality. Check whether the site actually showcases the active products with real descriptions.

- [ ] **Step 4: Write findings to meshal-web.txt**

Create `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/meshal-web.txt`. In PORTFOLIO PRESENTATION, be specific about what a technical audience would find impressive vs. weak. In FEATURE GAPS, focus on what's missing from a personal portfolio/showcase perspective.

- [ ] **Step 5: Verify**

```bash
grep -c "^---" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/meshal-web.txt"
```

Expected: at least 8.

---

## Task 7: Deep Audit — attributa

**Repo:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa/`
**Framework:** Vite/React | **Design system:** @alawein/tokens + @alawein/theme-base + @alawein/ui | **State:** Zustand + TanStack Query
**Live URL:** https://attributa.dev

**Files:**
- Create: `alawein/docs/superpowers/.spec-a-data/attributa.txt`

- [ ] **Step 1: Explore source structure**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa/src" -type d
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa/src" -name "*.tsx" | head -40
```

Read:
- `attributa/src/App.tsx`
- `attributa/src/features/` directory (feature-based org — from survey)
- `attributa/src/components/` directory
- `attributa/src/_hidden/` directory (from survey — assess what this is)

- [ ] **Step 2: Check design-system adoption and Zustand usage**

```bash
grep -r "from '@alawein/ui'" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa/src" --include="*.tsx" | head -15
grep -r "zustand\|useStore\|create(" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa/src" --include="*.tsx" --include="*.ts" -l
grep -r "@alawein/tokens" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa" --include="*.css" -l
```

- [ ] **Step 3: Assess component quality and architecture**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa/src/components" -name "*.tsx" | wc -l
grep -r "loading\|isLoading\|Skeleton" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa/src" --include="*.tsx" -l
grep -r "error\|Error" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa/src" --include="*.tsx" -l
grep -r ": any" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/attributa/src" --include="*.tsx" --include="*.ts" | wc -l
```

Read `attributa/src/_hidden/` to understand what private/hidden features exist. Read one Zustand store file to assess store design quality.

- [ ] **Step 4: Write findings to attributa.txt**

Create `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/attributa.txt`. Note the `_hidden/` directory in the architecture section.

- [ ] **Step 5: Verify**

```bash
grep -c "^---" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/attributa.txt"
```

Expected: at least 8.

---

## Task 8: Deep Audit — atelier-rounaq

**Repo:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/`
**Framework:** Vite/React | **Design system:** Tailwind only — zero @alawein/* packages | **State:** TanStack Query
**Live URL:** https://atelier-rounaq.com

**Files:**
- Create: `alawein/docs/superpowers/.spec-a-data/atelier-rounaq.txt`

- [ ] **Step 1: Explore source structure**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/src" -type d
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/src" -name "*.tsx" | head -40
```

Read:
- `atelier-rounaq/src/App.tsx`
- `atelier-rounaq/src/design/` directory (from survey — likely custom design tokens)
- `atelier-rounaq/src/context/` directory
- `atelier-rounaq/tailwind.config.ts` or equivalent

This repo has NO @alawein/* packages. Understand how it's styled — custom Tailwind config, inline styles, or custom CSS.

- [ ] **Step 2: Assess design divergence and custom styling**

```bash
# Check what's in the design directory
ls "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/src/design"
# Check tailwind config
cat "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/tailwind.config.ts" 2>/dev/null || cat "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/tailwind.config.js" 2>/dev/null
# Check for hardcoded color values
grep -r "#[0-9a-fA-F]\{3,6\}\|rgb(" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/src" --include="*.tsx" --include="*.css" | wc -l
grep -r "var(--" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/src" --include="*.tsx" --include="*.css" | wc -l
```

- [ ] **Step 3: Assess component quality**

```bash
find "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/src/components" -name "*.tsx" | wc -l
grep -r "loading\|isLoading" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/src" --include="*.tsx" -l
grep -r "error\|Error" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/src" --include="*.tsx" -l
grep -r ": any" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/atelier-rounaq/src" --include="*.tsx" --include="*.ts" | wc -l
```

Read `atelier-rounaq/src/context/` to understand state/data patterns. Read 2-3 components to assess UI quality for a "luxury atelier" aesthetic.

- [ ] **Step 4: Write findings to atelier-rounaq.txt**

Create `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/atelier-rounaq.txt`. In DESIGN SYSTEM ADOPTION, give a clear verdict on whether the divergence from @alawein/* is intentional (luxury branding warrants custom styling) or accidental. In FINDINGS SUMMARY, the Critical finding should address the design system disconnection.

- [ ] **Step 5: Verify**

```bash
grep -c "^---" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/atelier-rounaq.txt"
```

Expected: at least 8.

---

## Task 9: Cross-Product Synthesis

**Purpose:** Identify findings that span multiple products — shared component candidates, design-system drift ranking, unjustified divergences.

**Files:**
- Read: all 8 `.spec-a-data/<repo>.txt` files
- Create: `alawein/docs/superpowers/.spec-a-data/cross-product.txt`

- [ ] **Step 1: Read all 8 findings files**

Read each of:
- `alawein/docs/superpowers/.spec-a-data/bolts.txt`
- `alawein/docs/superpowers/.spec-a-data/repz.txt`
- `alawein/docs/superpowers/.spec-a-data/gymboy.txt`
- `alawein/docs/superpowers/.spec-a-data/scribd.txt`
- `alawein/docs/superpowers/.spec-a-data/llmworks.txt`
- `alawein/docs/superpowers/.spec-a-data/meshal-web.txt`
- `alawein/docs/superpowers/.spec-a-data/attributa.txt`
- `alawein/docs/superpowers/.spec-a-data/atelier-rounaq.txt`

- [ ] **Step 2: Write cross-product synthesis to cross-product.txt**

Create `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/cross-product.txt` with these sections:

```
=== CROSS-PRODUCT SYNTHESIS ===
Generated: 2026-04-23

--- DESIGN SYSTEM ADOPTION RANKING ---
(ranked from most-adopted to least-adopted, with drift level per repo)

--- SHARED COMPONENT CANDIDATES ---
(components that appear in 3+ repos and could be extracted to @alawein/ui)
For each candidate: what it does, which repos have it, rough duplication count

--- UNJUSTIFIED DIVERGENCES ---
(places where repos solve the same problem differently for no clear reason)
For each: what varies, which repos, why it matters

--- JUSTIFIED DIVERGENCES ---
(places where repos intentionally differ due to product type or audience)
For each: what varies, why it's appropriate

--- CRITICAL CROSS-CUTTING ISSUES ---
(issues affecting 4+ repos that need a workspace-level fix, not per-repo fixes)

--- PORTFOLIO STRENGTH RANKING ---
(rank all 8 products by portfolio credibility — most to least defensible)
For each: one-line rationale
```

- [ ] **Step 3: Verify synthesis completeness**

```bash
grep -c "^---" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/.spec-a-data/cross-product.txt"
```

Expected: at least 6 section dividers.

---

## Task 10: Write Spec A Document

**Files:**
- Read: all 9 `.spec-a-data/` files
- Create: `alawein/docs/superpowers/specs/2026-04-23-active-products-audit.md`

- [ ] **Step 1: Create Spec A document with required structure**

Create `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/specs/2026-04-23-active-products-audit.md`:

```markdown
---
title: Spec A — Active Products Audit
date: 2026-04-23
status: active
type: canonical
feeds: [master-execution-plan]
---

# Spec A — Active Products Audit

**Generated:** 2026-04-23
**Repos audited:** bolts, repz, gymboy, scribd, llmworks, meshal-web, attributa, atelier-rounaq
**Purpose:** Full audit of the 8 active product repos — front-end quality, design-system adoption, architecture, portfolio presentation, feature gaps.

---

## Executive Summary

**Overall health:** [Green/Yellow/Red with one-sentence rationale]

**Strongest portfolio assets:** [top 2-3 repos]
**Weakest portfolio assets:** [bottom 2-3 repos and why]
**Most urgent cross-cutting issue:** [one sentence]

---

## Per-Product Findings

[For each of the 8 repos — repeat this block:]

### [Repo Name] ([live URL])

**Stack:** | **DS Adoption:** | **Drift Level:**

| Severity | Finding | Area | Evidence | Action | Effort |
|----------|---------|------|----------|--------|--------|

---

## Cross-Product Findings

### Design-System Adoption Ranking

| Repo | Adoption Level | Missing | Drift |
|------|---------------|---------|-------|

### Shared Component Candidates

| Component | Repos | Action |
|-----------|-------|--------|

### Unjustified Divergences

| Pattern | Repos | Impact | Fix |
|---------|-------|--------|-----|

### Critical Cross-Cutting Issues

| Severity | Issue | Affects | Action |
|----------|-------|---------|--------|

---

## Portfolio Strength Assessment

| Rank | Repo | Verdict | Key strength | Key gap |
|------|------|---------|-------------|---------|

---

## Summary Counts

| Repo | Critical | High | Medium | Low | Total |
|------|----------|------|--------|-----|-------|
```

- [ ] **Step 2: Fill all sections from findings files**

Read all 9 data files and populate every section with real findings. Rules:
- Every finding table row must have evidence (file:line or specific observation)
- Every effort estimate must be S / M / L / XL (not "varies" or "unknown")
- No empty table cells
- The Portfolio Strength Assessment must rank all 8 repos 1–8

- [ ] **Step 3: Verify document completeness**

```bash
grep -c "^###\|^##" "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/docs/superpowers/specs/2026-04-23-active-products-audit.md"
```

Expected: at least 15 heading lines (executive summary + 8 per-product + cross-product sections + portfolio assessment + summary counts).

---

## Task 11: Update SSOT.md and Commit

**Files:**
- Modify: `alawein/SSOT.md`
- Commit: `docs/superpowers/specs/2026-04-23-active-products-audit.md` + `docs/superpowers/plans/2026-04-23-spec-a-active-products-audit.md` + `docs/superpowers/.spec-a-data/` + `SSOT.md`

- [ ] **Step 1: Update SSOT.md**

Read `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein/SSOT.md`. In the superpowers specs bullet added in Phase 0, add a sub-bullet or update the description to reference Spec A.

Or add a new bullet after the existing superpowers line:
```
- Active products audit (Spec A):
  [`docs/superpowers/specs/2026-04-23-active-products-audit.md`](docs/superpowers/specs/2026-04-23-active-products-audit.md)
```

- [ ] **Step 2: Stage only Phase A files**

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein" && git add docs/superpowers/specs/2026-04-23-active-products-audit.md docs/superpowers/plans/2026-04-23-spec-a-active-products-audit.md "docs/superpowers/.spec-a-data/" SSOT.md
```

- [ ] **Step 3: Verify staged files**

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein" && git diff --staged --stat
```

Only the files listed above should appear. If other files appear, unstage them:
```bash
git restore --staged <unexpected-file>
```

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein" && git commit -m "$(cat <<'EOF'
docs(superpowers): spec-a active products audit

Full per-product and cross-product audit of 8 active product repos covering
front-end quality, design-system adoption, architecture, portfolio presentation,
and feature gaps. Feeds master execution plan (Session 6).
EOF
)"
```

If pre-commit hook fires, read the error and fix the underlying issue. Do NOT use --no-verify.

---

## Self-Review

**Spec coverage:**
- Per-product findings (8 repos): Tasks 1–8 ✅
- Design-system adoption per repo: covered in each task's Step 2 ✅
- UX consistency (loading/error/empty states): covered in each task's Step 3 ✅
- Architecture assessment: covered in each task's Step 3 ✅
- Portfolio presentation: covered in each task's PORTFOLIO PRESENTATION section ✅
- Feature gaps: covered in each task's FEATURE GAPS section ✅
- Cross-product synthesis: Task 9 ✅
- Shared component candidates: Task 9, cross-product.txt ✅
- Design-system adoption ranking: Task 9 and Task 10 ✅
- Written Spec A document: Task 10 ✅
- SSOT update + commit: Task 11 ✅

**Placeholder scan:** No TBDs or "implement later" patterns. All commands are complete. All output formats are specified. All file paths are exact.

**Type consistency:** No shared types — this is a documentation plan. Findings file format (template) is identical across Tasks 1–8.
