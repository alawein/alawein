# Lovable.dev Integration Workflow

> **Last Updated:** 2025-12-07
> **Status:** Active
> **Applies To:** All Lovable.dev compatible projects
> **Audience:** Lovable.dev AI, Human Developers, CI/CD Systems

---

## 🎯 Quick Reference Card

### TL;DR: Essential Commands & Rules

| Purpose                     | Command                                                                                                      | Notes                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| **Import from Lovable.dev** | `git clone https://github.com/alawein/{project} temp && mv temp/* organizations/{llc}/{category}/{project}/` | Clone → Remove .git → Move to canonical location |
| **Start from Template**     | `cp -r templates/lovable-react organizations/{llc}/{category}/{project}`                                     | Update package.json name and install             |
| **Verify Integration**      | `npm install && npm run build && npm run dev`                                                                | Test build and dev server                        |
| **Daily Sync**              | `git pull → work → git commit → git push`                                                                    | Always pull before editing                       |

### Directory Ownership (CRITICAL)

| Directory                | Owner          | What You Can Edit           |
| ------------------------ | -------------- | --------------------------- |
| `src/components/ui/`     | 🔒 Lovable.dev | **NEVER edit manually**     |
| `src/components/layout/` | 🔒 Lovable.dev | **NEVER edit manually**     |
| `src/services/`          | 🔧 Local IDE   | API clients, business logic |
| `src/stores/`            | 🔧 Local IDE   | Zustand state management    |
| `src/hooks/`             | 🔧 Local IDE   | Custom React hooks          |
| `src/types/`             | 🔧 Local IDE   | TypeScript definitions      |
| `src/integrations/`      | 🔧 Local IDE   | Supabase, Stripe, etc.      |
| `src/pages/`             | 🔄 Shared      | Both can edit with care     |
| `src/App.tsx`            | 🔄 Shared      | Both can edit with care     |

### Emergency Fixes

```bash
# Lovable.dev overwrote your changes?
git checkout HEAD~1 -- src/components/ui/your-component.tsx

# Build failing after sync?
rm -rf node_modules dist && npm install && npm run build

# Path aliases not working?
# Check tsconfig.json and vite.config.ts have matching paths
```

---

## 🤖 INSTRUCTIONS FOR LOVABLE.DEV AI

```text
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    LOVABLE.DEV AI: READ THIS SECTION FIRST                    ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  This section contains explicit instructions for Lovable.dev AI to follow    ║
║  when generating or modifying code for this project.                         ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

### ✅ WHAT LOVABLE.DEV SHOULD DO

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    LOVABLE.DEV: DO THESE THINGS                         │
   └─────────────────────────────────────────────────────────────────────────┘

   1. GENERATE UI COMPONENTS
      ────────────────────────
      • Create components in src/components/ui/ using shadcn/ui patterns
      • Create layout components in src/components/layout/
      • Create feature-specific components in src/components/{feature}/
      • Use Tailwind CSS for all styling
      • Follow React 18 best practices

   2. CREATE PAGE COMPONENTS
      ───────────────────────
      • Create pages in src/pages/
      • Use React Router for navigation
      • Import components using @/ path aliases
      • Example: import { Button } from "@/components/ui/button"

   3. USE THESE TECHNOLOGIES
      ───────────────────────
      • React 18.x with TypeScript 5.x
      • Vite 5.x for build tooling
      • Tailwind CSS 3.x for styling
      • shadcn/ui for UI primitives
      • Lucide React for icons
      • React Router for routing

   4. FOLLOW THESE PATTERNS
      ──────────────────────
      • Use functional components with hooks
      • Use TypeScript for all files (.tsx, .ts)
      • Use the cn() utility from @/lib/utils for class merging
      • Use CSS custom properties for brand colors (--brand-primary, etc.)
      • Export components as named exports

   5. MAINTAIN THESE FILES
      ─────────────────────
      • src/components/ui/*.tsx - shadcn/ui components
      • src/components/layout/*.tsx - Layout components
      • src/pages/*.tsx - Page components
      • src/lib/utils.ts - Utility functions
      • src/hooks/use-mobile.tsx - Mobile detection hook
```

### ❌ WHAT LOVABLE.DEV SHOULD NOT DO

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    LOVABLE.DEV: DO NOT DO THESE THINGS                  │
   └─────────────────────────────────────────────────────────────────────────┘

   1. DO NOT MODIFY THESE DIRECTORIES (Human Developer Owned)
      ─────────────────────────────────────────────────────────
      ❌ src/services/      - API clients and business logic
      ❌ src/stores/        - Zustand state management
      ❌ src/types/         - TypeScript type definitions
      ❌ src/integrations/  - Supabase, Stripe, third-party integrations

   2. DO NOT CHANGE THESE CONFIGURATION FILES
      ────────────────────────────────────────
      ❌ package.json name field (keep the scoped name like @alawein/...)
      ❌ vite.config.ts path aliases (keep the @ alias)
      ❌ tsconfig.json paths (keep matching vite.config.ts)
      ❌ .env files (contain secrets)

   3. DO NOT USE THESE PATTERNS
      ──────────────────────────
      ❌ Class components (use functional components)
      ❌ CSS modules (use Tailwind CSS)
      ❌ Styled-components (use Tailwind CSS)
      ❌ Redux (use Zustand if state management needed)
      ❌ Axios (use fetch or the existing API client in src/services/)

   4. DO NOT DELETE OR RENAME
      ────────────────────────
      ❌ Existing files in src/services/
      ❌ Existing files in src/stores/
      ❌ Existing files in src/types/
      ❌ Existing files in src/integrations/
      ❌ The src/lib/utils.ts file
```

### 📋 LOVABLE.DEV CODE GENERATION CHECKLIST

```text
   Before generating or modifying code, verify:

   [ ] Using TypeScript (.tsx/.ts files)
   [ ] Using Tailwind CSS for styling
   [ ] Using @/ path aliases for imports
   [ ] Using shadcn/ui component patterns
   [ ] NOT modifying src/services/, src/stores/, src/types/, src/integrations/
   [ ] NOT changing package.json name or configuration files
   [ ] Exporting components as named exports
   [ ] Using functional components with hooks
```

### 🎨 BRAND COLOR USAGE

```text
   Use CSS custom properties for brand colors:

   ┌─────────────────────────────────────────────────────────────────────────┐
   │ CSS Variable           │ Tailwind Class      │ Usage                   │
   ├─────────────────────────┼─────────────────────┼─────────────────────────│
   │ --brand-primary        │ bg-brand-primary    │ Primary buttons, links  │
   │ --brand-secondary      │ bg-brand-secondary  │ Secondary elements      │
   │ --brand-accent         │ bg-brand-accent     │ Highlights, badges      │
   └─────────────────────────┴─────────────────────┴─────────────────────────┘

   Example usage in components:
   <Button className="bg-brand-primary hover:bg-brand-primary/90">
     Click Me
   </Button>
```

### 📁 FILE STRUCTURE LOVABLE.DEV SHOULD CREATE

```text
   When creating new features, follow this structure:

   src/
   ├── components/
   │   ├── ui/                    ← Lovable.dev creates these
   │   │   ├── button.tsx
   │   │   ├── card.tsx
   │   │   ├── input.tsx
   │   │   └── ...
   │   ├── layout/                ← Lovable.dev creates these
   │   │   ├── Header.tsx
   │   │   ├── Sidebar.tsx
   │   │   └── Footer.tsx
   │   └── {feature}/             ← Lovable.dev creates these
   │       ├── FeatureCard.tsx
   │       └── FeatureList.tsx
   ├── pages/                     ← Lovable.dev creates these
   │   ├── Index.tsx
   │   ├── Dashboard.tsx
   │   └── Settings.tsx
   ├── hooks/                     ← Lovable.dev can add hooks here
   │   └── use-mobile.tsx
   └── lib/                       ← Lovable.dev maintains this
       └── utils.ts
```

---

## 🎯 Purpose & Context

This document serves as the **canonical reference** for integrating Lovable.dev-generated projects into our enterprise monorepo infrastructure. It is designed to be understood by:

1. **Lovable.dev AI** - To generate code that aligns with our standards
2. **Human Developers** - To follow consistent import/integration workflows
3. **CI/CD Systems** - To validate project structure compliance

### What is This Monorepo?

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          ALAWEIN ENTERPRISE MONOREPO                            │
│                                                                                 │
│  Repository: github.com/alawein/alawein                                         │
│  Purpose:    Single source of truth for all Alawein Technologies products      │
│                                                                                 │
│  Contains:                                                                      │
│    • 3 LLCs (Alawein Technologies, Live It Iconic, REPZ)                        │
│    • 10+ SaaS products (TalAI, Librex, QAPLibria, MEZAN, etc.)                  │
│    • E-commerce platforms (LiveItIconic, Rounaq)                                │
│    • Fitness applications (REPZ)                                                │
│    • Shared templates, branding, and infrastructure                             │
│                                                                                 │
│  Structure:                                                                     │
│    organizations/                                                               │
│    ├── alawein-technologies-llc/                                                │
│    │   ├── saas/           # SaaS products (TalAI, Librex, MEZAN, etc.)         │
│    │   ├── packages/       # Python/npm packages                                │
│    │   ├── research/       # Academic/research projects                         │
│    │   └── mobile-apps/    # Mobile applications                                │
│    ├── live-it-iconic-llc/                                                      │
│    │   └── ecommerce/      # Luxury automotive e-commerce                       │
│    └── repz-llc/                                                                │
│        └── apps/           # Fitness tracking applications                      │
│    templates/              # Reusable project templates                         │
│    docs/                   # Documentation                                      │
│    scripts/                # Automation scripts                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Concept: Repository Relationship

### CRITICAL: Lovable.dev Creates SEPARATE Repositories

```text
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    ⚠️  IMPORTANT ARCHITECTURAL CONCEPT  ⚠️                    ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   Lovable.dev does NOT create projects inside our monorepo.                   ║
║                                                                               ║
║   Instead, Lovable.dev creates STANDALONE GitHub repositories:                ║
║                                                                               ║
║   ┌─────────────────┐          ┌─────────────────────────────────────┐        ║
║   │   Lovable.dev   │ creates  │ github.com/alawein/{project-name}  │        ║
║   │   (AI Builder)  │ ───────► │ (Separate, standalone repository)  │        ║
║   └─────────────────┘          └─────────────────────────────────────┘        ║
║                                                                               ║
║   To integrate with our monorepo, we must:                                    ║
║     1. Clone the Lovable.dev-generated repository                             ║
║     2. Standardize the project structure                                      ║
║     3. Copy/move files into our monorepo                                      ║
║     4. Update configurations to match our conventions                         ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

### Visual: The Two-Repository Model

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                        REPOSITORY LANDSCAPE                             │
   └─────────────────────────────────────────────────────────────────────────┘

   LOVABLE.DEV CREATES:                    OUR MAIN MONOREPO:
   ════════════════════                    ══════════════════

   github.com/alawein/                     github.com/alawein/alawein
         │                                          │
         ├── talai-web/     ◄─── import ───►       organizations/
         │   (standalone)                           └── alawein-technologies-llc/
         │                                              └── saas/
         ├── librex-dashboard/  ◄─── import ───►            └── talai/
         │   (standalone)                                   └── librex/
         │                                                  └── mezan/
         ├── liveiticonic-store/  ◄─── import ───►  └── live-it-iconic-llc/
         │   (standalone)                               └── ecommerce/
         │                                                  └── liveiticonic/
         └── repz-coach/  ◄─── import ───►          └── repz-llc/
             (standalone)                               └── apps/
                                                            └── repz/

   Each Lovable.dev project is                Our monorepo organizes all
   its own GitHub repository                  projects under LLC structure
```

### The Integration Workflow (High-Level)

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    LOVABLE.DEV → MONOREPO WORKFLOW                      │
   └─────────────────────────────────────────────────────────────────────────┘

   STEP 1: CREATE                STEP 2: CLONE               STEP 3: STANDARDIZE
   ═══════════════               ═════════════               ═══════════════════

   ┌─────────────┐              ┌─────────────┐              ┌─────────────────┐
   │ Lovable.dev │              │    Clone    │              │   Update:       │
   │   creates   │  ───────►    │  to temp    │  ───────►    │   • package.json│
   │  project    │              │  location   │              │   • vite.config │
   └─────────────┘              └─────────────┘              │   • tailwind    │
         │                            │                      │   • Add dirs    │
         ▼                            ▼                      └─────────────────┘
   github.com/alawein/          C:/temp/project/                    │
   {project-name}/              (temporary)                         ▼

   STEP 4: INTEGRATE             STEP 5: VERIFY              STEP 6: CLEANUP
   ════════════════              ══════════════              ═══════════════

   ┌─────────────────┐          ┌─────────────┐              ┌─────────────────┐
   │   Move to       │          │   npm install│             │ Delete temp dir │
   │   canonical     │ ───────► │   npm build  │ ───────►    │ Archive/delete  │
   │   location      │          │   npm dev    │             │ standalone repo │
   └─────────────────┘          └─────────────┘              └─────────────────┘
         │                            │                             │
         ▼                            ▼                             ▼
   organizations/{llc}/          ✅ Working!                 🎉 Complete!
   {category}/{project}/
```

---

## 📁 Directory Ownership & Boundaries

Understanding which directories are "owned" by Lovable.dev vs local development is crucial for avoiding conflicts and maintaining code quality.

### Ownership Matrix

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                      DIRECTORY OWNERSHIP MATRIX                         │
   └─────────────────────────────────────────────────────────────────────────┘

   LOVABLE.DEV OWNS (Do not manually edit):
   ─────────────────────────────────────────
   src/
   ├── components/
   │   ├── ui/              ← 🔒 Lovable.dev: shadcn/ui primitives
   │   │   ├── button.tsx       (Button, Card, Input, etc.)
   │   │   ├── card.tsx
   │   │   └── ...
   │   └── layout/          ← 🔒 Lovable.dev: Layout components
   │       ├── Header.tsx       (Header, Sidebar, Footer)
   │       ├── Sidebar.tsx
   │       └── Footer.tsx

   LOCAL IDE OWNS (Lovable.dev should not modify):
   ────────────────────────────────────────────────
   src/
   ├── services/            ← 🔧 Local: API clients, business logic
   │   ├── api.ts               External API integrations
   │   └── auth.ts              Authentication logic
   ├── stores/              ← 🔧 Local: Zustand state management
   │   ├── useAuthStore.ts      Global state stores
   │   └── useCartStore.ts
   ├── hooks/               ← 🔧 Local: Custom React hooks
   │   ├── useAuth.ts           Reusable hook logic
   │   └── useQuery.ts
   ├── types/               ← 🔧 Local: TypeScript type definitions
   │   ├── User.ts              Shared type definitions
   │   └── Product.ts
   └── integrations/        ← 🔧 Local: Third-party integrations
       ├── supabase/            Supabase client & helpers
       └── stripe/              Stripe client & helpers

   SHARED (Both can modify with care):
   ────────────────────────────────────
   src/
   ├── pages/               ← 🔄 Shared: Page components
   │   ├── Dashboard.tsx        Lovable.dev creates initial pages
   │   └── Settings.tsx         Local adds business logic
   ├── App.tsx              ← 🔄 Shared: Main app component
   └── main.tsx             ← 🔄 Shared: Entry point
```

### Why These Boundaries Matter

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                        BOUNDARY RATIONALE                               │
   └─────────────────────────────────────────────────────────────────────────┘

   Problem without boundaries:
   ──────────────────────────

   Developer A edits src/components/ui/button.tsx locally
                      │
                      ▼
   Lovable.dev regenerates button.tsx with new design
                      │
                      ▼
   ⚠️ CONFLICT: Developer A's changes are LOST or cause merge conflicts

   Solution with boundaries:
   ─────────────────────────

   Lovable.dev owns:        Local IDE owns:          No conflicts!
   src/components/ui/       src/services/            Each team/tool has
   src/components/layout/   src/stores/              clear responsibility
                            src/hooks/
                            src/types/
                            src/integrations/
```

---

## 🏢 Our LLC & Product Structure

Understanding our organizational structure is essential for placing projects in the correct location.

### The Three LLCs

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                      ALAWEIN LLC STRUCTURE                              │
   └─────────────────────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    ALAWEIN TECHNOLOGIES LLC                             │
   │                    ════════════════════════                             │
   │    Focus: Enterprise SaaS, AI/ML Platforms, Developer Tools             │
   │    Domain: alawein.com, talai.dev, librex.dev                           │
   │                                                                         │
   │    Products:                                                            │
   │    ┌─────────────┬─────────────┬─────────────┬─────────────┐            │
   │    │   TalAI     │   Librex    │  QAPLibria  │    MEZAN    │            │
   │    │ (AI Chat)   │(Optimizer)  │(QAP Solver) │  (DevOps)   │            │
   │    └─────────────┴─────────────┴─────────────┴─────────────┘            │
   │    ┌─────────────┬─────────────┬─────────────┬─────────────┐            │
   │    │   QMLab     │  LLMWorks   │  SimCore    │  Attributa  │            │
   │    │(Quantum)    │(LLM Tools)  │(Simulation) │(Attribution)│            │
   │    └─────────────┴─────────────┴─────────────┴─────────────┘            │
   │    ┌─────────────┬─────────────┐                                        │
   │    │   Helios    │   Foundry   │                                        │
   │    │  (Energy)   │ (Platform)  │                                        │
   │    └─────────────┴─────────────┘                                        │
   └─────────────────────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────────────────────┐
   │                      LIVE IT ICONIC LLC                                 │
   │                      ══════════════════                                 │
   │    Focus: Luxury E-commerce, Automotive, Fashion                        │
   │    Domain: liveiticonic.com                                             │
   │                                                                         │
   │    Products:                                                            │
   │    ┌─────────────────────────┬─────────────────────────┐                │
   │    │     LiveItIconic        │        Rounaq           │                │
   │    │  (Luxury Automotive)    │   (Fashion E-commerce)  │                │
   │    └─────────────────────────┴─────────────────────────┘                │
   └─────────────────────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────────────────────┐
   │                           REPZ LLC                                      │
   │                           ════════                                      │
   │    Focus: Fitness & Health Technology                                   │
   │    Domain: repz.app                                                     │
   │                                                                         │
   │    Products:                                                            │
   │    ┌─────────────────────────────────────────────────┐                  │
   │    │                      REPZ                       │                  │
   │    │     (Fitness Tracking, Workout Planning)        │                  │
   │    └─────────────────────────────────────────────────┘                  │
   └─────────────────────────────────────────────────────────────────────────┘
```

### Directory Mapping

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    CANONICAL DIRECTORY STRUCTURE                        │
   └─────────────────────────────────────────────────────────────────────────┘

   organizations/
   │
   ├── alawein-technologies-llc/          ← Alawein Technologies LLC
   │   ├── saas/                          ← SaaS web applications
   │   │   ├── talai/                       TalAI platform
   │   │   ├── librex/                      Librex optimizer
   │   │   ├── qaplibria/                   QAPLibria solver
   │   │   ├── mezan/                       MEZAN DevOps
   │   │   ├── qmlab/                       QMLab quantum
   │   │   ├── llmworks/                    LLMWorks tools
   │   │   ├── simcore/                     SimCore simulation
   │   │   ├── attributa/                   Attributa platform
   │   │   ├── helios/                      Helios energy
   │   │   └── foundry/                     Foundry platform
   │   ├── packages/                      ← Python/npm packages
   │   │   └── librex-core/                 Core optimizer library
   │   ├── research/                      ← Research projects
   │   │   └── qap-benchmarks/              QAP research
   │   └── mobile-apps/                   ← Mobile applications
   │       └── talai-mobile/                TalAI mobile app
   │
   ├── live-it-iconic-llc/                ← Live It Iconic LLC
   │   └── ecommerce/                     ← E-commerce platforms
   │       ├── liveiticonic/                Luxury automotive store
   │       └── rounaq/                      Fashion e-commerce
   │
   └── repz-llc/                          ← REPZ LLC
       └── apps/                          ← Fitness applications
           └── repz/                        REPZ fitness tracker
```

---

## ✅ Project Compatibility Matrix

Not all project types are compatible with Lovable.dev. Use this matrix to determine which approach to use.

### Compatibility Overview

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    LOVABLE.DEV COMPATIBILITY                            │
   └─────────────────────────────────────────────────────────────────────────┘

   ✅ FULLY COMPATIBLE (Use Lovable.dev):
   ──────────────────────────────────────
   • SaaS Platforms      → React/Vite + Supabase
   • E-commerce Sites    → React/Vite + Stripe
   • Mobile Apps         → React/Vite + Capacitor
   • Marketing Sites     → React/Vite + static

   ⚠️ PARTIALLY COMPATIBLE (Use with care):
   ─────────────────────────────────────────
   • Backend Services    → Only for admin dashboards, not API logic
   • Documentation Sites → For UI only, content managed separately

   ❌ NOT COMPATIBLE (Do NOT use Lovable.dev):
   ────────────────────────────────────────────
   • Python Packages     → Use PyPI, setup.py, pyproject.toml
   • Research Projects   → Multi-module Python, Jupyter notebooks
   • Pure APIs           → FastAPI, Express, no frontend
   • CLI Tools           → Python Click, Node Commander
```

### Detailed Compatibility Table

| Category           | Directory      | Lovable.dev | Reason                                                |
| ------------------ | -------------- | ----------- | ----------------------------------------------------- |
| SaaS Platforms     | `saas/`        | ✅ Yes      | React/Vite stack matches Lovable.dev output perfectly |
| E-commerce         | `ecommerce/`   | ✅ Yes      | React/Vite + Stripe integration supported             |
| Mobile Apps        | `mobile-apps/` | ✅ Yes      | React/Vite + Capacitor for native wrapper             |
| Python Packages    | `packages/`    | ❌ No       | Lovable.dev only generates JavaScript/TypeScript      |
| Research Platforms | `research/`    | ❌ No       | Requires Jupyter, Python scientific stack             |
| Product Incubators | `incubator/`   | ❌ No       | Early prototypes, often multi-language                |
| Services           | `services/`    | ⚠️ Partial  | Only for admin UIs, not the actual service logic      |

---

## 🚀 Quick Start: Creating a New Project

There are two approaches to creating new projects. Choose based on your project's primary focus.

### Decision Flowchart

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    WHICH APPROACH SHOULD I USE?                         │
   └─────────────────────────────────────────────────────────────────────────┘

                              START
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Is this project       │
                    │ primarily UI-focused? │
                    └───────────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼ YES                               ▼ NO
   ┌───────────────────────┐          ┌───────────────────────┐
   │  Does it need complex │          │  Use OPTION B:        │
   │  animations or custom │          │  Start from Template  │
   │  UI interactions?     │          │                       │
   └───────────────────────┘          │  Better for:          │
              │                        │  • API-heavy apps     │
              ▼ YES                    │  • Complex state      │
   ┌───────────────────────┐          │  • Custom hooks       │
   │  Use OPTION A:        │          │  • Backend integration│
   │  Start in Lovable.dev │          └───────────────────────┘
   │                       │
   │  Better for:          │
   │  • Landing pages      │
   │  • Dashboards         │
   │  • Marketing sites    │
   │  • Quick prototypes   │
   └───────────────────────┘
```

### Option A: Start in Lovable.dev (Recommended for UI-heavy projects)

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │              OPTION A: LOVABLE.DEV → MONOREPO WORKFLOW                  │
   └─────────────────────────────────────────────────────────────────────────┘

   STEP 1                    STEP 2                    STEP 3
   Create in Lovable.dev     Connect to GitHub         Clone locally
   ──────────────────────    ─────────────────────     ───────────────────

   ┌─────────────────┐      ┌─────────────────────┐   ┌─────────────────────┐
   │                 │      │ github.com/alawein/ │   │                     │
   │  lovable.dev    │ ───► │ my-new-project      │   │  git clone ...      │
   │  "Create app"   │      │ (standalone repo)   │   │  temp-project/      │
   │                 │      │                     │   │                     │
   └─────────────────┘      └─────────────────────┘   └─────────────────────┘

   Use natural language      Lovable connects to      Clone to temporary
   to describe your UI       your GitHub account      location first


   STEP 4                    STEP 5                    STEP 6
   Standardize               Move to monorepo          Verify & run
   ────────────────          ────────────────          ────────────────

   ┌─────────────────┐      ┌─────────────────────┐   ┌─────────────────────┐
   │ Update:         │      │ organizations/      │   │                     │
   │ • package.json  │ ───► │   {llc}/            │   │  npm install        │
   │ • vite.config   │      │     {category}/     │   │  npm run build      │
   │ • tailwind      │      │       my-project/   │   │  npm run dev        │
   └─────────────────┘      └─────────────────────┘   └─────────────────────┘

   Apply our naming          Place in canonical        Ensure everything
   conventions               LLC/category path         works correctly
```

#### Option A: PowerShell Commands

```powershell
# ═══════════════════════════════════════════════════════════════════════════
# OPTION A: Import from Lovable.dev
# ═══════════════════════════════════════════════════════════════════════════

# Step 1-2: Create in Lovable.dev and connect to GitHub (do this in browser)
# Visit: https://lovable.dev
# Create your project with natural language prompts
# Connect to GitHub: github.com/alawein/{your-project-name}

# Step 3: Clone locally to temporary location
git clone https://github.com/alawein/your-project C:/temp/your-project
cd C:/temp/your-project

# Step 4: Remove standalone git history (we'll use monorepo's git)
Remove-Item -Recurse -Force .git

# Step 5: Determine canonical location
$llc = "alawein-technologies-llc"   # or: live-it-iconic-llc, repz-llc
$category = "saas"                   # or: ecommerce, mobile-apps, apps
$projectName = "your-project"

# Step 6: Move to monorepo
Move-Item "C:/temp/your-project/*" "organizations/$llc/$category/$projectName/"

# Step 7: Navigate and install
cd "organizations/$llc/$category/$projectName"
npm install

# Step 8: Verify build works
npm run build

# Step 9: Start development server
npm run dev

# Step 10 (Optional): Connect Vercel for auto-deploy
# Visit: https://vercel.com → Import from GitHub → Select repo
```

### Option B: Start from Template (Recommended for logic-heavy projects)

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │              OPTION B: TEMPLATE → LOVABLE.DEV WORKFLOW                  │
   └─────────────────────────────────────────────────────────────────────────┘

   STEP 1                    STEP 2                    STEP 3
   Copy template             Update configs            Install & develop
   ───────────────           ─────────────────         ─────────────────

   ┌─────────────────┐      ┌─────────────────────┐   ┌─────────────────────┐
   │ templates/      │      │ Edit:               │   │                     │
   │ lovable-react/  │ ───► │ • package.json      │   │  npm install        │
   │                 │      │   name: @alawein/.. │   │  npm run dev        │
   │                 │      │ • Update branding   │   │                     │
   └─────────────────┘      └─────────────────────┘   └─────────────────────┘

   Start with our           Apply LLC-specific        Develop locally with
   pre-configured base      naming and branding       full IDE features


   STEP 4                    STEP 5                    STEP 6
   Push to GitHub            Connect Lovable.dev       Bidirectional sync
   ──────────────            ─────────────────────     ─────────────────────

   ┌─────────────────┐      ┌─────────────────────┐   ┌─────────────────────┐
   │ git init        │      │                     │   │ ◄───────────────►   │
   │ git add .       │ ───► │  lovable.dev        │   │  Local IDE          │
   │ git commit      │      │  "Import repo"      │   │  ↕ GitHub ↕         │
   │ git push        │      │                     │   │  Lovable.dev        │
   └─────────────────┘      └─────────────────────┘   └─────────────────────┘

   Create standalone        Connect Lovable.dev       Both can push to
   GitHub repo              to existing repo          the same repo
```

#### Option B: PowerShell Commands

```powershell
# ═══════════════════════════════════════════════════════════════════════════
# OPTION B: Start from Template
# ═══════════════════════════════════════════════════════════════════════════

# Step 1: Set project details
$llc = "alawein-technologies-llc"   # or: live-it-iconic-llc, repz-llc
$category = "saas"                   # or: ecommerce, mobile-apps, apps
$projectName = "my-new-project"
$targetPath = "organizations/$llc/$category/$projectName"

# Step 2: Copy template to canonical location
Copy-Item -Recurse "templates/lovable-react" $targetPath

# Step 3: Navigate to project
cd $targetPath

# Step 4: Update package.json (edit manually or use script)
# Change: "name": "@alawein/my-new-project"
# The @alawein prefix should match LLC:
#   Alawein Technologies → @alawein
#   Live It Iconic       → @liveiticonic
#   REPZ                 → @repz

# Step 5: Install dependencies
npm install

# Step 6: Start development server
npm run dev

# Step 7: Push to GitHub (creates standalone repo for Lovable.dev connection)
git init
git add .
git commit -m "Initial commit from lovable-react template"
git remote add origin https://github.com/alawein/$projectName
git push -u origin main

# Step 8 (Optional): Connect to Lovable.dev for visual editing
# Visit: https://lovable.dev → Import existing GitHub repository
# Lovable.dev will sync with your repo bidirectionally
```

---

## 🔄 Workflow: Updating Existing Projects with Lovable.dev

When you need to update an existing project's UI using Lovable.dev, follow these guidelines.

### Update Strategy Decision Tree

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    WHICH UPDATE STRATEGY?                               │
   └─────────────────────────────────────────────────────────────────────────┘

                         What are you updating?
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
   │ Just a few      │ │ Multiple pages  │ │ Complete app    │
   │ components?     │ │ or sections?    │ │ redesign?       │
   └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
            │                   │                   │
            ▼                   ▼                   ▼
   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
   │ STRATEGY A:     │ │ STRATEGY B:     │ │ STRATEGY C:     │
   │ Component Copy  │ │ Partial Import  │ │ Full Redesign   │
   │                 │ │                 │ │                 │
   │ • Copy specific │ │ • Export to temp│ │ • Create new in │
   │   component files│ │ • Merge selectively│ │   Lovable.dev  │
   │ • Minimal changes│ │ • Preserve logic│ │ • Full migration│
   └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Strategy A: Component Copy (For UI Changes Only)

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    STRATEGY A: COMPONENT COPY                           │
   └─────────────────────────────────────────────────────────────────────────┘

   Use when: You need to add or update a few specific UI components

   STEP 1                    STEP 2                    STEP 3
   ──────────────────        ──────────────────        ──────────────────

   Create component          Copy component            Update imports
   in Lovable.dev            files only                in existing project

   ┌─────────────────┐      ┌─────────────────┐       ┌─────────────────┐
   │ Lovable.dev:    │      │ Copy:           │       │ Update:         │
   │ "Create a new   │ ───► │ src/components/ │ ───►  │ Import paths    │
   │  dashboard card │      │   ui/card.tsx   │       │ in pages that   │
   │  with metrics"  │      │   DataChart.tsx │       │ use new comps   │
   └─────────────────┘      └─────────────────┘       └─────────────────┘

   ⚠️ DO NOT copy: src/services/, src/stores/, src/hooks/, src/types/
   These contain your business logic that Lovable.dev doesn't know about!
```

### Strategy B: Partial Import (For Section Updates)

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    STRATEGY B: PARTIAL IMPORT                           │
   └─────────────────────────────────────────────────────────────────────────┘

   Use when: You need to update multiple pages or significant UI sections

   STEP 1                    STEP 2                    STEP 3
   ──────────────────        ──────────────────        ──────────────────

   Create full template      Export to temp            Selective merge
   in Lovable.dev            directory

   ┌─────────────────┐      ┌─────────────────────┐   ┌─────────────────────┐
   │ Build complete  │      │ Clone to:           │   │ Copy ONLY:          │
   │ UI in Lovable   │ ───► │ C:/temp/new-design/ │   │ ✅ src/components/  │
   │ with all pages  │      │                     │   │ ✅ src/pages/       │
   └─────────────────┘      └─────────────────────┘   │ ❌ src/services/    │
                                                       │ ❌ src/stores/      │
                                                       │ ❌ src/hooks/       │
                                                       └─────────────────────┘

   STEP 4                    STEP 5
   ──────────────────        ──────────────────

   Update page imports       Test thoroughly

   ┌─────────────────────┐   ┌─────────────────────┐
   │ In new pages, add:  │   │ npm run build       │
   │ • Service imports   │   │ npm run dev         │
   │ • Store connections │   │                     │
   │ • Hook usage        │   │ Verify all features │
   └─────────────────────┘   └─────────────────────┘
```

### Strategy C: Full Redesign (For Major Overhauls)

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    STRATEGY C: FULL REDESIGN                            │
   └─────────────────────────────────────────────────────────────────────────┘

   Use when: Complete application redesign is needed

   ⚠️ WARNING: This is the most complex strategy. Use with caution.

   STEP 1: Export existing business logic
   ────────────────────────────────────────

   BEFORE redesign, backup these directories from your existing project:

   ┌─────────────────────────────────────────────────────────────────────────┐
   │ SAVE THESE (your custom business logic):                               │
   │                                                                         │
   │   src/services/     ← API clients, business rules                      │
   │   src/stores/       ← Zustand stores, global state                     │
   │   src/hooks/        ← Custom React hooks                               │
   │   src/types/        ← TypeScript type definitions                      │
   │   src/integrations/ ← Supabase, Stripe clients                         │
   │   src/lib/          ← Utility functions (if customized)                │
   └─────────────────────────────────────────────────────────────────────────┘

   STEP 2: Create new design in Lovable.dev
   ────────────────────────────────────────

   STEP 3: Import new design following full import process
   ────────────────────────────────────────────────────────

   STEP 4: Copy saved business logic back into new project
   ────────────────────────────────────────────────────────

   STEP 5: Update imports in new pages to use restored logic
   ────────────────────────────────────────────────────────
```

---

## 📦 Infrastructure Standardization Guide

This section provides detailed instructions for importing and restructuring Lovable.dev-generated projects to match our monorepo infrastructure standards.

### Understanding Lovable.dev Output Structure

When Lovable.dev creates a project, it generates a specific file structure. Understanding this structure is essential for proper integration.

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                  LOVABLE.DEV DEFAULT OUTPUT STRUCTURE                   │
   └─────────────────────────────────────────────────────────────────────────┘

   github.com/alawein/{lovable-project}/
   │
   │  ROOT FILES (Configuration)
   │  ───────────────────────────
   ├── index.html              ← Entry HTML file
   ├── package.json            ← ⚠️ Generic name, needs our scoped name
   ├── package-lock.json       ← Will regenerate after npm install
   ├── vite.config.ts          ← ⚠️ May need path alias updates
   ├── tailwind.config.ts      ← ⚠️ Needs brand color extension
   ├── tsconfig.json           ← ⚠️ Ensure path aliases match vite.config
   ├── tsconfig.node.json      ← Node-specific TS config
   ├── postcss.config.js       ← PostCSS for Tailwind
   ├── components.json         ← shadcn/ui configuration (keep as-is)
   ├── .gitignore              ← Standard ignores (keep as-is)
   ├── .eslintrc.cjs           ← ESLint config (keep or enhance)
   └── README.md               ← ⚠️ Lovable-generated, replace with ours
   │
   │  SOURCE CODE
   │  ───────────
   ├── src/
   │   │
   │   │  ENTRY POINTS
   │   ├── main.tsx            ← App entry, mounts React
   │   ├── App.tsx             ← Root component with routing
   │   ├── index.css           ← ⚠️ Add brand CSS variables
   │   │
   │   │  COMPONENTS (Lovable.dev creates these)
   │   ├── components/
   │   │   ├── ui/             ← shadcn/ui primitives
   │   │   │   ├── button.tsx
   │   │   │   ├── card.tsx
   │   │   │   ├── input.tsx
   │   │   │   └── ...
   │   │   └── {feature}/      ← Feature-specific components
   │   │       ├── Dashboard.tsx
   │   │       └── Sidebar.tsx
   │   │
   │   │  PAGES (Lovable.dev creates these)
   │   ├── pages/
   │   │   ├── Index.tsx
   │   │   ├── Dashboard.tsx
   │   │   └── Settings.tsx
   │   │
   │   │  UTILITIES (Lovable.dev creates these)
   │   ├── lib/
   │   │   └── utils.ts        ← cn() and other utilities
   │   │
   │   │  HOOKS (Lovable.dev may create some)
   │   ├── hooks/
   │   │   └── use-mobile.tsx
   │   │
   │   │  ⚠️ MISSING DIRECTORIES (We need to add these)
   │   │  ──────────────────────────────────────────────
   │   │
   │   ├── services/           ← ❌ NOT CREATED - Add for API clients
   │   ├── stores/             ← ❌ NOT CREATED - Add for Zustand
   │   ├── types/              ← ❌ NOT CREATED - Add for TypeScript
   │   └── integrations/       ← ❌ NOT CREATED - Add for Supabase/Stripe
   │
   │  STATIC ASSETS
   │  ──────────────
   └── public/
       ├── favicon.ico
       └── {images}/
```

### File Disposition Matrix

Understanding which files to keep, modify, or replace is critical for successful integration.

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                      FILE DISPOSITION MATRIX                            │
   └─────────────────────────────────────────────────────────────────────────┘

   ✅ KEEP AS-IS (No changes needed)
   ──────────────────────────────────
   File/Folder          │ Reason
   ──────────────────────┼─────────────────────────────────────────────────
   src/components/ui/   │ shadcn/ui primitives, standard across all projects
   src/components/*     │ Feature components created by Lovable.dev
   src/pages/           │ Page components (may need import updates)
   src/hooks/           │ Hooks created by Lovable.dev
   src/lib/utils.ts     │ cn() utility and helpers
   components.json      │ shadcn/ui configuration
   .gitignore           │ Standard ignore patterns
   postcss.config.js    │ PostCSS configuration
   .eslintrc.cjs        │ ESLint configuration

   🔄 MODIFY (Update to match our standards)
   ──────────────────────────────────────────
   File                 │ What to Change
   ──────────────────────┼─────────────────────────────────────────────────
   package.json         │ Add scoped name: "@alawein/{project}"
                        │ Add additional scripts: typecheck, etc.
   vite.config.ts       │ Add "@" path alias
                        │ Configure server port
   tailwind.config.ts   │ Add brand color tokens
                        │ Extend theme with our design system
   tsconfig.json        │ Ensure paths match vite.config.ts
   src/index.css        │ Add CSS custom properties for branding
   src/App.tsx          │ May need route updates
   src/main.tsx         │ May need provider wrappers

   🔁 REPLACE (Use our version instead)
   ─────────────────────────────────────
   File                 │ Replace With
   ──────────────────────┼─────────────────────────────────────────────────
   README.md            │ Our standard README template
   .github/             │ Our monorepo GitHub workflows

   ❌ DELETE (Will be regenerated or not needed)
   ──────────────────────────────────────────────
   File/Folder          │ Reason
   ──────────────────────┼─────────────────────────────────────────────────
   node_modules/        │ Will regenerate with npm install
   package-lock.json    │ Will regenerate with npm install
   .git/                │ Remove standalone history, use monorepo git
   dist/                │ Build output, will regenerate
```

### Detailed Step-by-Step Import Process

This section provides exhaustive instructions for each step of the import process.

#### Step 1: Clone the Lovable.dev Repository

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                        STEP 1: CLONE PROJECT                            │
   └─────────────────────────────────────────────────────────────────────────┘

   Purpose: Get the Lovable.dev project onto your local machine

   From:                              To:
   ┌─────────────────────────┐       ┌─────────────────────────────┐
   │ github.com/alawein/     │       │ C:/temp/{project-name}/     │
   │   {lovable-project}     │ ───►  │   (temporary location)      │
   └─────────────────────────┘       └─────────────────────────────┘

   Why temporary? We need to standardize the project before placing it
   in its final monorepo location.
```

```powershell
# ═══════════════════════════════════════════════════════════════════════════
# STEP 1: Clone the Lovable.dev repository to a temporary location
# ═══════════════════════════════════════════════════════════════════════════

# Clone to a temporary location (not in monorepo yet)
git clone https://github.com/alawein/{lovable-project} C:/temp/{lovable-project}

# Navigate to the cloned project
cd C:/temp/{lovable-project}

# Remove the standalone git history
# Why? This project will become part of the monorepo, which has its own git history
Remove-Item -Recurse -Force .git

# Verify .git is removed
Test-Path .git  # Should return: False
```

#### Step 2: Determine Canonical Location

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    STEP 2: DETERMINE LOCATION                           │
   └─────────────────────────────────────────────────────────────────────────┘

   The canonical path follows this pattern:

   organizations / {llc} / {category} / {project-name}
        │           │          │              │
        │           │          │              └── Your project name
        │           │          │                  (e.g., talai, librex, repz)
        │           │          │
        │           │          └── Project category
        │           │              ├── saas/        - Web applications
        │           │              ├── ecommerce/   - Online stores
        │           │              ├── mobile-apps/ - Mobile applications
        │           │              ├── packages/    - npm/pip packages
        │           │              ├── apps/        - Desktop/standalone apps
        │           │              └── research/    - Research projects
        │           │
        │           └── LLC identifier
        │               ├── alawein-technologies-llc
        │               ├── live-it-iconic-llc
        │               └── repz-llc
        │
        └── Root organizations directory
```

```powershell
# ═══════════════════════════════════════════════════════════════════════════
# STEP 2: Determine the canonical location for your project
# ═══════════════════════════════════════════════════════════════════════════

# Identify the correct LLC based on the product
# ───────────────────────────────────────────────────────────────────────────
# ALAWEIN TECHNOLOGIES LLC products:
#   TalAI, Librex, QAPLibria, MEZAN, QMLab, LLMWorks, SimCore, Attributa,
#   Helios, Foundry
# ───────────────────────────────────────────────────────────────────────────
# LIVE IT ICONIC LLC products:
#   LiveItIconic (luxury automotive), Rounaq (fashion)
# ───────────────────────────────────────────────────────────────────────────
# REPZ LLC products:
#   REPZ (fitness tracking)
# ───────────────────────────────────────────────────────────────────────────

$llc = "alawein-technologies-llc"   # Choose based on product owner
$category = "saas"                   # Choose based on project type
$projectName = "my-project"          # Your project's name (lowercase, hyphenated)

# Construct the target path
$targetPath = "organizations/$llc/$category/$projectName"

# Display the path for verification
Write-Host "Target path: $targetPath" -ForegroundColor Cyan
```

**LLC and Category Quick Reference:**

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    LLC AND CATEGORY REFERENCE                           │
   └─────────────────────────────────────────────────────────────────────────┘

   ALAWEIN TECHNOLOGIES LLC
   ────────────────────────
   Directory: alawein-technologies-llc/
   Package prefix: @alawein/

   Categories:
   ├── saas/        → Web platforms (TalAI, Librex, MEZAN, etc.)
   ├── packages/    → npm/pip libraries (librex-core, talai-sdk)
   ├── research/    → Research projects (qap-benchmarks)
   └── mobile-apps/ → Mobile apps (talai-mobile)

   LIVE IT ICONIC LLC
   ───────────────────
   Directory: live-it-iconic-llc/
   Package prefix: @liveiticonic/

   Categories:
   ├── ecommerce/   → E-commerce platforms (liveiticonic, rounaq)
   └── mobile-apps/ → Mobile apps (liveiticonic-app)

   REPZ LLC
   ────────
   Directory: repz-llc/
   Package prefix: @repz/

   Categories:
   ├── apps/        → Fitness applications (repz)
   └── mobile-apps/ → Mobile apps (repz-mobile)
```

#### Step 3: Update package.json

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                   STEP 3: UPDATE PACKAGE.JSON                           │
   └─────────────────────────────────────────────────────────────────────────┘

   The package.json file needs to be updated to use our scoped naming convention.

   BEFORE (Lovable.dev generates):        AFTER (Our standard):
   ┌────────────────────────────────┐     ┌────────────────────────────────┐
   │ {                              │     │ {                              │
   │   "name": "vite-project",      │     │   "name": "@alawein/talai",    │
   │   "version": "0.0.0",          │ ──► │   "version": "0.1.0",          │
   │   ...                          │     │   "private": true,             │
   │ }                              │     │   "type": "module",            │
   └────────────────────────────────┘     │   ...                          │
                                          └────────────────────────────────┘
```

```json
{
  "name": "@alawein/{project-name}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

**Package Naming by LLC:**

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    PACKAGE NAMING CONVENTION                            │
   └─────────────────────────────────────────────────────────────────────────┘

   LLC                  │ Package Prefix   │ Example
   ──────────────────────┼──────────────────┼─────────────────────────
   Alawein Technologies │ @alawein/       │ @alawein/llmworks
                        │                  │ @alawein/talai
                        │                  │ @alawein/librex
   ──────────────────────┼──────────────────┼─────────────────────────
   Live It Iconic       │ @liveiticonic/  │ @liveiticonic/storefront
                        │                  │ @liveiticonic/rounaq
   ──────────────────────┼──────────────────┼─────────────────────────
   REPZ                 │ @repz/          │ @repz/coach
                        │                  │ @repz/tracker
```

#### Step 4: Update vite.config.ts

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                   STEP 4: UPDATE VITE.CONFIG.TS                         │
   └─────────────────────────────────────────────────────────────────────────┘

   The vite.config.ts file needs path aliases and server configuration.

   Key Changes:
   ────────────
   1. Add "@" path alias → Enables imports like: import { Button } from "@/components/ui/button"
   2. Configure server port → Standardize on port 3000
   3. Enable sourcemaps → Better debugging in production
```

```typescript
// vite.config.ts - Our Standard Configuration
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This enables "@/..." imports throughout the project
      // Example: import { Button } from "@/components/ui/button"
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000, // Standardized port across all projects
    host: true, // Allow external connections (for mobile testing)
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable source maps for debugging
  },
});
```

**Important**: Make sure `tsconfig.json` has matching path configuration:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Step 5: Update tailwind.config.ts with Brand Colors

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                STEP 5: UPDATE TAILWIND.CONFIG.TS                        │
   └─────────────────────────────────────────────────────────────────────────┘

   The tailwind.config.ts file needs brand color tokens for consistent styling.

   Brand Color System:
   ───────────────────
   Each LLC has its own color palette defined in CSS custom properties.
   This allows the same component to look different across products.

   Example:
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ TalAI (Alawein)     │ LiveItIconic (LII)  │ REPZ (REPZ LLC)            │
   ├─────────────────────┼─────────────────────┼────────────────────────────│
   │ Primary: Blue       │ Primary: Gold       │ Primary: Neon Green        │
   │ Secondary: Purple   │ Secondary: Black    │ Secondary: Dark Gray       │
   └─────────────────────┴─────────────────────┴────────────────────────────┘
```

```typescript
// tailwind.config.ts - Our Standard Configuration
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'], // Enable dark mode via class
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors using CSS custom properties
        // These are defined in src/index.css
        brand: {
          primary: 'hsl(var(--brand-primary))',
          secondary: 'hsl(var(--brand-secondary))',
          accent: 'hsl(var(--brand-accent))',
        },
      },
      // Optional: Add brand-specific fonts
      fontFamily: {
        brand: ['var(--font-brand)', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

**Add to src/index.css:**

```css
/* src/index.css - Brand CSS Custom Properties */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Replace these with your brand colors */
    --brand-primary: 220 90% 56%; /* Blue for Alawein */
    --brand-secondary: 280 80% 60%; /* Purple */
    --brand-accent: 45 100% 50%; /* Gold accent */

    /* Font family (optional) */
    --font-brand: 'Inter', sans-serif;
  }

  .dark {
    /* Dark mode overrides */
    --brand-primary: 220 90% 70%;
    --brand-secondary: 280 80% 70%;
  }
}
```

#### Step 6: Add Missing Directories

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                  STEP 6: ADD MISSING DIRECTORIES                        │
   └─────────────────────────────────────────────────────────────────────────┘

   Lovable.dev creates a minimal structure. We need to add directories
   for business logic, state management, and integrations.

   BEFORE (Lovable.dev):              AFTER (Our Standard):
   ┌────────────────────────┐         ┌────────────────────────┐
   │ src/                   │         │ src/                   │
   │ ├── components/        │         │ ├── components/        │
   │ ├── hooks/             │         │ ├── hooks/             │
   │ ├── lib/               │         │ ├── lib/               │
   │ └── pages/             │         │ ├── pages/             │
   └────────────────────────┘         │ ├── services/     ← NEW│
                                      │ ├── stores/       ← NEW│
                                      │ ├── types/        ← NEW│
                                      │ └── integrations/ ← NEW│
                                      └────────────────────────┘
```

```powershell
# ═══════════════════════════════════════════════════════════════════════════
# STEP 6: Create missing directories for our standard structure
# ═══════════════════════════════════════════════════════════════════════════

# Create monorepo-standard directories
New-Item -ItemType Directory -Force -Path src/services      # API clients, business logic
New-Item -ItemType Directory -Force -Path src/stores        # Zustand stores
New-Item -ItemType Directory -Force -Path src/types         # TypeScript type definitions
New-Item -ItemType Directory -Force -Path src/integrations  # Supabase, Stripe, etc.

# Create placeholder files (optional, helps with git tracking)
"// API service clients" | Out-File -FilePath src/services/.gitkeep
"// Zustand state stores" | Out-File -FilePath src/stores/.gitkeep
"// TypeScript type definitions" | Out-File -FilePath src/types/.gitkeep
"// Third-party integrations" | Out-File -FilePath src/integrations/.gitkeep
```

#### Step 7: Move to Monorepo Location

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                 STEP 7: MOVE TO MONOREPO LOCATION                       │
   └─────────────────────────────────────────────────────────────────────────┘

   Now move the standardized project to its canonical location in the monorepo.

   FROM:                               TO:
   ┌─────────────────────────┐        ┌─────────────────────────────────────┐
   │ C:/temp/{project}/      │        │ organizations/                      │
   │   ├── src/              │        │   └── alawein-technologies-llc/     │
   │   ├── package.json      │  ───►  │       └── saas/                     │
   │   └── ...               │        │           └── {project}/            │
   └─────────────────────────┘        │               ├── src/              │
                                      │               ├── package.json      │
                                      │               └── ...               │
                                      └─────────────────────────────────────┘
```

```powershell
# ═══════════════════════════════════════════════════════════════════════════
# STEP 7: Move the project to its canonical monorepo location
# ═══════════════════════════════════════════════════════════════════════════

# Ensure the target directory exists
New-Item -ItemType Directory -Force -Path "organizations/$llc/$category/$projectName"

# Move all files from temp to monorepo
Move-Item "C:/temp/{lovable-project}/*" "organizations/$llc/$category/$projectName/"

# Alternative: Copy if you want to keep the original for reference
# Copy-Item -Recurse "C:/temp/{lovable-project}/*" "organizations/$llc/$category/$projectName/"

# Clean up temp directory
Remove-Item -Recurse -Force "C:/temp/{lovable-project}"
```

#### Step 8: Install Dependencies and Verify

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │              STEP 8: INSTALL DEPENDENCIES AND VERIFY                    │
   └─────────────────────────────────────────────────────────────────────────┘

   Final step: Install dependencies and verify everything works.

   Verification Checklist:
   ───────────────────────
   ✓ npm install completes without errors
   ✓ npm run build succeeds
   ✓ npm run dev starts the dev server
   ✓ Application loads in browser at http://localhost:3000
   ✓ No TypeScript errors in the console
   ✓ All routes work correctly
```

```powershell
# ═══════════════════════════════════════════════════════════════════════════
# STEP 8: Install dependencies and verify the project works
# ═══════════════════════════════════════════════════════════════════════════

# Navigate to the project
cd "organizations/$llc/$category/$projectName"

# Install dependencies (this regenerates package-lock.json)
npm install

# Run TypeScript type checking
npm run typecheck

# Verify the build succeeds
npm run build

# Start the development server
npm run dev

# ═══════════════════════════════════════════════════════════════════════════
# Expected output:
#   VITE v5.x.x  ready in xxx ms
#   ➜  Local:   http://localhost:3000/
#   ➜  Network: http://192.168.x.x:3000/
# ═══════════════════════════════════════════════════════════════════════════
```

### Integrating into Templates Directory

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │              CONVERTING A PROJECT TO A REUSABLE TEMPLATE                │
   └─────────────────────────────────────────────────────────────────────────┘

   When should a project become a template?
   ─────────────────────────────────────────
   • When the design/structure can be reused for similar projects
   • When you want to create variations (themes) of the same base
   • When onboarding new products that share common patterns

   Template vs. Product:
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ TEMPLATE                          │ PRODUCT                            │
   ├───────────────────────────────────┼────────────────────────────────────│
   │ Generic, reusable                 │ Specific, customized               │
   │ Lives in templates/               │ Lives in organizations/            │
   │ No real data/API keys             │ Has real data/API keys             │
   │ Placeholder branding              │ Actual brand colors/logos          │
   │ Example: saas-midnight            │ Example: talai, librex             │
   └───────────────────────────────────┴────────────────────────────────────┘
```

```powershell
# ═══════════════════════════════════════════════════════════════════════════
# CONVERTING A PROJECT TO A TEMPLATE
# ═══════════════════════════════════════════════════════════════════════════

# Step 1: Determine the template name
$templateName = "product-{name}"  # or saas-{theme}, ecommerce-{theme}

# Step 2: Copy to templates directory
Copy-Item -Recurse "organizations/$llc/$category/$projectName" "templates/$templateName"

# Step 3: Update template's package.json
# Change name to: "@alawein/template-{name}"

# Step 4: Remove any real API keys or sensitive data
# Replace with placeholder values like "YOUR_API_KEY_HERE"

# Step 5: Update README with template usage instructions
```

**Template Naming Conventions:**

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    TEMPLATE NAMING CONVENTIONS                          │
   └─────────────────────────────────────────────────────────────────────────┘

   Type              │ Pattern             │ Example
   ──────────────────┼─────────────────────┼─────────────────────────────────
   Product Dashboard │ product-{name}      │ product-talai, product-librex
   SaaS Theme        │ saas-{theme}        │ saas-midnight, saas-aurora
   E-commerce Theme  │ ecommerce-{theme}   │ ecommerce-luxury, ecommerce-minimal
   Fitness Theme     │ fitness-{theme}     │ fitness-neon, fitness-zen
   Portfolio Theme   │ {style}-portfolio   │ cyberpunk-portfolio, classic-portfolio
   Family Platform   │ family-{name}       │ family-drmalowein, family-rounaq
```

### Post-Integration Checklist

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    POST-INTEGRATION CHECKLIST                           │
   └─────────────────────────────────────────────────────────────────────────┘

   After importing a Lovable.dev project, verify ALL of the following:

   CONFIGURATION FILES:
   ────────────────────
   [ ] package.json has scoped name (@alawein/..., @liveiticonic/..., @repz/...)
   [ ] vite.config.ts has "@" path alias configured
   [ ] tailwind.config.ts extends brand colors
   [ ] tsconfig.json has matching path aliases (baseUrl and paths)
   [ ] postcss.config.js exists and is configured

   DIRECTORY STRUCTURE:
   ────────────────────
   [ ] src/services/     directory exists (for API clients)
   [ ] src/stores/       directory exists (for Zustand stores)
   [ ] src/types/        directory exists (for TypeScript types)
   [ ] src/integrations/ directory exists (for Supabase/Stripe)

   BUILD VERIFICATION:
   ───────────────────
   [ ] npm install completes without errors
   [ ] npm run typecheck passes (no TypeScript errors)
   [ ] npm run build succeeds
   [ ] npm run dev starts the dev server on port 3000

   FUNCTIONALITY:
   ──────────────
   [ ] Application loads in browser at http://localhost:3000
   [ ] All routes work correctly
   [ ] No console errors in browser DevTools
   [ ] Dark mode toggle works (if applicable)

   DOCUMENTATION:
   ──────────────
   [ ] README.md updated with project-specific info
   [ ] Any API keys are documented (but not committed)
   [ ] Setup instructions are accurate
```

### Automated Import Script

For convenience, use this PowerShell script to automate the entire import process:

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                    AUTOMATED IMPORT SCRIPT                              │
   └─────────────────────────────────────────────────────────────────────────┘

   This script automates Steps 1-8 of the import process.

   Usage:
   ──────
   .\scripts\import-lovable-project.ps1 `
       -RepoUrl "https://github.com/alawein/my-lovable-project" `
       -LLC "alawein-technologies-llc" `
       -Category "saas" `
       -ProjectName "my-project"

   What it does:
   ─────────────
   1. Clones the Lovable.dev repository to temp
   2. Removes standalone git history
   3. Creates target directory in monorepo
   4. Moves files to canonical location
   5. Creates missing directories (services, stores, types, integrations)
   6. Installs dependencies
   7. Runs build verification
```

```powershell
# ═══════════════════════════════════════════════════════════════════════════
# AUTOMATED IMPORT SCRIPT
# Save as: scripts/import-lovable-project.ps1
# ═══════════════════════════════════════════════════════════════════════════

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl,

    [Parameter(Mandatory=$true)]
    [ValidateSet("alawein-technologies-llc", "live-it-iconic-llc", "repz-llc")]
    [string]$LLC,

    [Parameter(Mandatory=$true)]
    [ValidateSet("saas", "ecommerce", "mobile-apps", "apps", "packages", "research")]
    [string]$Category,

    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════
$tempPath = "C:/temp/$ProjectName"
$targetPath = "organizations/$LLC/$Category/$ProjectName"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  LOVABLE.DEV PROJECT IMPORT SCRIPT" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Source:  $RepoUrl" -ForegroundColor White
Write-Host "  Target:  $targetPath" -ForegroundColor White
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════════
# STEP 1: Clone repository
# ═══════════════════════════════════════════════════════════════════════════
Write-Host "[1/7] Cloning repository..." -ForegroundColor Yellow
git clone $RepoUrl $tempPath
if ($LASTEXITCODE -ne 0) { throw "Failed to clone repository" }

# ═══════════════════════════════════════════════════════════════════════════
# STEP 2: Remove standalone git history
# ═══════════════════════════════════════════════════════════════════════════
Write-Host "[2/7] Removing standalone git history..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "$tempPath/.git"

# ═══════════════════════════════════════════════════════════════════════════
# STEP 3: Create target directory
# ═══════════════════════════════════════════════════════════════════════════
Write-Host "[3/7] Creating target directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $targetPath | Out-Null

# ═══════════════════════════════════════════════════════════════════════════
# STEP 4: Move files to monorepo
# ═══════════════════════════════════════════════════════════════════════════
Write-Host "[4/7] Moving files to monorepo..." -ForegroundColor Yellow
Move-Item "$tempPath/*" $targetPath

# ═══════════════════════════════════════════════════════════════════════════
# STEP 5: Create missing directories
# ═══════════════════════════════════════════════════════════════════════════
Write-Host "[5/7] Creating missing directories..." -ForegroundColor Yellow
@("services", "stores", "types", "integrations") | ForEach-Object {
    New-Item -ItemType Directory -Force -Path "$targetPath/src/$_" | Out-Null
    "// $_ - Add your code here" | Out-File -FilePath "$targetPath/src/$_/.gitkeep"
}

# ═══════════════════════════════════════════════════════════════════════════
# STEP 6: Install dependencies
# ═══════════════════════════════════════════════════════════════════════════
Write-Host "[6/7] Installing dependencies..." -ForegroundColor Yellow
Set-Location $targetPath
npm install

# ═══════════════════════════════════════════════════════════════════════════
# STEP 7: Verify build
# ═══════════════════════════════════════════════════════════════════════════
Write-Host "[7/7] Verifying build..." -ForegroundColor Yellow
npm run build

# ═══════════════════════════════════════════════════════════════════════════
# CLEANUP
# ═══════════════════════════════════════════════════════════════════════════
Remove-Item -Recurse -Force "C:/temp/$ProjectName" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ IMPORT COMPLETE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  Project location: $targetPath" -ForegroundColor White
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor White
Write-Host "    1. Update package.json with scoped name" -ForegroundColor Gray
Write-Host "    2. Configure brand colors in tailwind.config.ts" -ForegroundColor Gray
Write-Host "    3. Run 'npm run dev' to start development" -ForegroundColor Gray
Write-Host ""
```

---

## Standard Tech Stack

All Lovable.dev compatible projects should use:

| Component     | Technology                | Version |
| ------------- | ------------------------- | ------- |
| Framework     | React                     | 18.x    |
| Build Tool    | Vite                      | 5.x     |
| Language      | TypeScript                | 5.x     |
| Styling       | Tailwind CSS              | 3.x     |
| UI Components | shadcn/ui                 | latest  |
| Backend       | Supabase                  | latest  |
| State         | Zustand or TanStack Query | latest  |

## Directory Structure (Standard)

```text
{project-name}/
├── src/
│   ├── components/     # UI components (Lovable.dev primary)
│   │   ├── ui/         # shadcn/ui base components
│   │   └── ...         # Feature components
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # Supabase/API clients
│   ├── lib/            # Utility functions
│   ├── pages/          # Route pages
│   ├── services/       # Business logic
│   ├── stores/         # State management
│   └── types/          # TypeScript types
├── public/             # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── index.html
```

---

## 🔄 Development Workflow: Bidirectional Sync

### The Golden Rule of Development

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          THE GOLDEN RULE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   GITHUB IS THE SINGLE SOURCE OF TRUTH                                  │
│   ─────────────────────────────────────────                            │
│                                                                         │
│   Both Lovable.dev and Local IDE push to the SAME repository             │
│   Never work in isolation - always sync through GitHub                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Visual Workflow Diagram

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                      BIDIRECTIONAL DEVELOPMENT WORKFLOW                │
   └─────────────────────────────────────────────────────────────────────────┘

   ┌─────────────┐         ┌──────────────┐         ┌─────────────┐
   │ Lovable.dev │ ──push──►│   GitHub     │◄──push── │ Local IDE   │
   │ (UI Design) │         │ (Truth)      │         │ (Logic)     │
   └─────────────┘         └──────┬───────┘         └─────────────┘
                                │
                                ▼ auto-deploy
                        ┌──────────────┐
                        │   Vercel     │
                        │ (Preview)    │
                        └──────────────┘

   Key Principles:
   ──────────────────
   • GitHub is the single source of truth
   • Both tools can push, but never simultaneously
   • Always pull latest changes before editing
   • Use branches for major changes
   • Commit messages indicate which tool made changes
```

### Daily Development Cycle

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                        DAILY DEVELOPMENT CYCLE                         │
   └─────────────────────────────────────────────────────────────────────────┘

   MORNING SETUP:
   ─────────────
   1. Pull latest changes
   2. Review what Lovable.dev may have added
   3. Check for any merge conflicts

   DEVELOPMENT SESSION:
   ───────────────────
   1. Work in your designated directories
   2. Test locally
   3. Commit with clear messages

   HANDOFF TO LOVABLE.DEV:
   ─────────────────────
   1. Push changes to GitHub
   2. Leave notes for Lovable.dev in comments
   3. Specify what areas need UI work

   EVENING SYNC:
   ─────────────
   1. Pull changes made by Lovable.dev
   2. Test UI integration
   3. Fix any conflicts in shared areas
```

---

## 🛠️ Development Environment Setup

### Prerequisites

```text
Required Software:
─────────────────
• Node.js >= 20.0.0
• npm >= 9.0.0 or pnpm >= 8.0.0
• Git >= 2.40.0
• VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - GitLens
  - Prettier
  - ESLint
```

### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Environment Configuration

Create `.env.example`:

```bash
# Development
VITE_API_URL=http://localhost:3001
VITE_APP_URL=http://localhost:5173

# Supabase (if using)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (if using)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key

# Feature flags
VITE_ENABLE_BETA_FEATURES=false
VITE_DEBUG_MODE=false
```

---

## 📁 Advanced Directory Patterns

### Complex Project Structure

For larger projects, use this expanded structure:

```text
{project-name}/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui (Lovable.dev domain)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── index.ts     # Barrel exports
│   │   ├── layout/          # Layout components (Lovable.dev domain)
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   ├── features/        # Feature-specific (Shared)
│   │   │   ├── auth/
│   │   │   │   ├── login-form.tsx
│   │   │   │   └── register-form.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── stats-card.tsx
│   │   │   │   └── chart-container.tsx
│   │   │   └── shared/
│   │   │       ├── loading-spinner.tsx
│   │   │       └── error-boundary.tsx
│   │   └── forms/           # Form components (Shared)
│   │       ├── user-form.tsx
│   │       └── settings-form.tsx
│   ├── pages/               # Route pages (Shared)
│   │   ├── api/             # API routes (if needed)
│   │   ├── (auth)/          # Auth group
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── (dashboard)/     # Dashboard group
│   │   │   ├── overview.tsx
│   │   │   └── analytics.tsx
│   │   └── layout.tsx       # Root layout
│   ├── hooks/               # Custom hooks (Local domain)
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   ├── services/            # API services (Local domain)
│   │   ├── api.ts           # Base API client
│   │   ├── auth.ts          # Auth service
│   │   ├── users.ts         # User service
│   │   └── index.ts
│   ├── stores/              # State management (Local domain)
│   │   ├── authStore.ts     # Zustand store
│   │   ├── userStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   ├── types/               # TypeScript types (Local domain)
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── lib/                 # Utilities (Shared)
│   │   ├── utils.ts         # General utilities
│   │   ├── constants.ts     # App constants
│   │   ├── validations.ts   # Form validations
│   │   └── index.ts
│   ├── integrations/        # Third-party (Local domain)
│   │   ├── supabase/
│   │   │   ├── client.ts    # Supabase client
│   │   │   ├── auth.ts      # Auth helpers
│   │   │   └── database.ts  # Database helpers
│   │   ├── stripe/
│   │   │   ├── client.ts    # Stripe client
│   │   │   └── webhooks.ts  # Webhook handlers
│   │   └── index.ts
│   ├── styles/              # Styles (Shared)
│   │   ├── globals.css      # Global styles
│   │   ├── components.css   # Component styles
│   │   └── variables.css    # CSS variables
│   ├── assets/              # Static assets (Shared)
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── App.tsx              # Main app (Shared)
│   ├── main.tsx             # Entry point (Shared)
│   └── vite-env.d.ts        # Vite types
├── public/                  # Public assets (Shared)
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json
├── docs/                    # Project documentation (Local)
│   ├── README.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── tests/                   # Tests (Local)
│   ├── __mocks__/
│   ├── components/
│   └── utils/
├── .vscode/                 # VS Code config (Local)
│   ├── settings.json
│   └── extensions.json
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── components.json          # shadcn/ui config
├── .env.example
├── .gitignore
├── README.md
└── CHANGELOG.md
```

### Index Files for Clean Imports

Create `index.ts` files in key directories:

```typescript
// src/components/ui/index.ts
export { Button } from './button';
export { Card } from './card';
export { Input } from './input';
export { Label } from './label';
export { Textarea } from './textarea';

// src/hooks/index.ts
export { useAuth } from './useAuth';
export { useApi } from './useApi';
export { useLocalStorage } from './useLocalStorage';

// src/services/index.ts
export { apiClient } from './api';
export { authService } from './auth';
export { userService } from './users';

// src/types/index.ts
export type { User } from './user';
export type { AuthState } from './auth';
export type { ApiResponse } from './api';
```

---

## 🔧 Configuration Files Deep Dive

### Advanced vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/integrations': path.resolve(__dirname, './src/integrations'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', '@radix-ui/react-slot'],
          utils: ['clsx', 'tailwind-merge'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
```

### Advanced tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors from our design system
        brand: {
          50: 'hsl(var(--brand-50))',
          100: 'hsl(var(--brand-100))',
          200: 'hsl(var(--brand-200))',
          300: 'hsl(var(--brand-300))',
          400: 'hsl(var(--brand-400))',
          500: 'hsl(var(--brand-500))',
          600: 'hsl(var(--brand-600))',
          700: 'hsl(var(--brand-700))',
          800: 'hsl(var(--brand-800))',
          900: 'hsl(var(--brand-900))',
          950: 'hsl(var(--brand-950))',
        },
        // Semantic colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
```

### Advanced tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/integrations/*": ["./src/integrations/*"],
      "@/assets/*": ["./src/assets/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  },
  "include": ["src", "vite.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 🚀 Deployment Strategies

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Link to existing project
vercel link
```

**vercel.json configuration:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "functions": {
    "src/api/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle React Router
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
    }
}
```

---

## 🧪 Testing Strategy

### Unit Testing with Vitest

Install dependencies:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
```

Update `package.json` scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Example Test Files

```typescript
// src/components/ui/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// src/hooks/__tests__/useAuth.test.ts
import { renderHook } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('returns initial auth state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });
});
```

---

## 🔒 Security Best Practices

### Environment Variable Security

```bash
# .env.local (never commit)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key

# Server-side only (never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
STRIPE_SECRET_KEY=sk_live_your-secret-key
```

### Content Security Policy

Add to `index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://your-project.supabase.co https://api.stripe.com;
"
/>
```

### API Security

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

---

## 📈 Performance Optimization

### Code Splitting

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load components
const Dashboard = lazy(() => import('@/pages/dashboard'));
const Settings = lazy(() => import('@/pages/settings'));
const Analytics = lazy(() => import('@/pages/analytics'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Settings />
            </Suspense>
          }
        />
        <Route
          path="/analytics"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Analytics />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### Image Optimization

```typescript
// src/components/ui/optimized-image.tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
```

---

## 🐛 Troubleshooting Guide

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                       TROUBLESHOOTING GUIDE                             │
   └─────────────────────────────────────────────────────────────────────────┘

   This section covers common issues you may encounter when working with
   Lovable.dev projects and how to resolve them.
```

### Common Issues and Solutions

#### 1. Lovable.dev Overwrites Local Changes

**Problem**: You made changes to UI components, but Lovable.dev overwrote them.

**Why this happens**: Lovable.dev has ownership of certain directories and will
regenerate files in those directories when you make changes through its interface.

**Solution**:

```bash
# PREVENTION: Always work in designated directories
# ═══════════════════════════════════════════════════════════════════════════
# Lovable.dev owns: src/components/ui/, src/components/layout/
# Local IDE owns: src/services/, src/stores/, src/hooks/, src/types/
# ═══════════════════════════════════════════════════════════════════════════

# RECOVERY: If conflict occurs, restore your version:
git checkout HEAD~1 -- src/components/ui/your-component.tsx

# Then manually merge your changes into the new version
```

#### 2. Path Alias Not Working

**Problem**: Import errors with @/ aliases (e.g., `Cannot find module '@/components/ui/button'`).

**Why this happens**: The path alias must be configured in BOTH `tsconfig.json` AND `vite.config.ts`.

**Solution**:

```text
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ Both files must have matching path configurations:                      │
   └─────────────────────────────────────────────────────────────────────────┘
```

```json
// tsconfig.json - Add these paths
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"]
    }
  }
}
```

```typescript
// vite.config.ts - Add matching aliases
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
    },
  },
});
```

#### 3. Build Fails After Lovable.dev Changes

**Problem**: `npm run build` fails after Lovable.dev modifications.

**Why this happens**: Lovable.dev may add new dependencies, remove components, or change imports.

**Solution**:

```bash
# ═══════════════════════════════════════════════════════════════════════════
# STEP 1: Check for missing dependencies
# ═══════════════════════════════════════════════════════════════════════════
npm install

# ═══════════════════════════════════════════════════════════════════════════
# STEP 2: Clear cache and reinstall (if Step 1 doesn't work)
# ═══════════════════════════════════════════════════════════════════════════
Remove-Item -Recurse -Force node_modules, dist
npm install

# ═══════════════════════════════════════════════════════════════════════════
# STEP 3: Check TypeScript errors
# ═══════════════════════════════════════════════════════════════════════════
npm run typecheck

# ═══════════════════════════════════════════════════════════════════════════
# STEP 4: Check for missing imports
# Look for components that might have been deleted or renamed
# ═══════════════════════════════════════════════════════════════════════════
```

#### 4. Styles Not Applying

**Problem**: Tailwind classes not working after integration.

**Why this happens**: Tailwind needs to know which files to scan for class names.

**Solution**:

```typescript
// tailwind.config.ts - Verify content paths include all source files
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Must include all component files
  ],
  // ...
};
```

```typescript
// src/main.tsx - Verify CSS is imported
import './index.css'; // or './styles/globals.css'
```

#### 5. Git Merge Conflicts

**Problem**: Merge conflicts when syncing changes between Lovable.dev and local IDE.

**Why this happens**: Both tools edited the same file.

**Solution**:

```bash
# ═══════════════════════════════════════════════════════════════════════════
# STEP 1: Pull latest changes
# ═══════════════════════════════════════════════════════════════════════════
git pull origin main

# ═══════════════════════════════════════════════════════════════════════════
# STEP 2: Resolve conflicts
# Use VS Code's built-in merge conflict resolver
# Or use a merge tool like: git mergetool
# ═══════════════════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════════════════
# STEP 3: Test after resolution
# ═══════════════════════════════════════════════════════════════════════════
npm run build
npm run dev

# ═══════════════════════════════════════════════════════════════════════════
# STEP 4: Commit the resolution
# ═══════════════════════════════════════════════════════════════════════════
git add .
git commit -m "resolve: merge conflicts between Lovable.dev and local changes"
```

### Debug Mode

Enable debug mode in `.env.local` for more verbose logging:

```bash
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

Add debug utilities:

```typescript
// src/lib/debug.ts
export const debug = {
  log: (...args: any[]) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('[DEBUG]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.error('[DEBUG ERROR]', ...args);
    }
  },
};
```

---

## 📚 Additional Resources

### Documentation Templates

- **[API Documentation Template](../../templates/API-TEMPLATE.md)**
- **[README Template](../../templates/README-TEMPLATE.md)**
- **[Security Template](../../templates/SECURITY-TEMPLATE.md)**

### Integration Guides

- **[Lovable Migration Guide](../../templates/LOVABLE-MIGRATION-GUIDE.md)**
- **[Environment Variables Guide](../../templates/LOVABLE-ENV-EXAMPLE.md)**
- **[GitHub Workflows Guide](../../templates/LOVABLE-GITHUB-WORKFLOWS.md)**

### Tools and Utilities

- **[Migration Validation Script](../../../scripts/validate-migration.sh)**
- **[Documentation Governance](../../governance/DOCUMENTATION-GOVERNANCE-FINAL-POLICY.md)**

---

## 🆘 Getting Help

### Support Channels

1. **Documentation**: Check this guide and related templates
2. **GitHub Issues**: Create issues for technical problems
3. **Team Communication**: Use internal channels for urgent issues
4. **Code Review**: Request review for complex integrations

### Best Practices

1. **Always pull before editing**: Avoid conflicts by syncing latest changes
2. **Commit frequently**: Small, focused commits are easier to merge
3. **Use branches**: For major changes, create feature branches
4. **Test locally**: Always test before pushing to GitHub
5. **Document changes**: Update README and documentation

### Emergency Procedures

If Lovable.dev breaks critical functionality:

```bash
# 1. Revert to last known good state
git log --oneline -10  # Find last good commit
git revert <commit-hash>  # Revert problematic commit

# 2. Notify team immediately
# Use emergency communication channels

# 3. Create hotfix branch
git checkout -b hotfix/urgent-fix
# Make necessary fixes
git push origin hotfix/urgent-fix

# 4. Deploy hotfix
# Use emergency deployment procedures
```

---

**This document serves as the comprehensive guide for Lovable.dev integration into the Alawein Technologies Monorepo. Follow these guidelines carefully to ensure smooth collaboration between AI-generated UI components and human-developed business logic.**

---

## Naming Conventions

| Item         | Convention             | Example             |
| ------------ | ---------------------- | ------------------- |
| Package name | `@{llc-prefix}/{name}` | `@alawein/llmworks` |
| Components   | PascalCase             | `UserDashboard.tsx` |
| Hooks        | camelCase with `use`   | `useAuth.ts`        |
| Services     | camelCase              | `apiClient.ts`      |
| Types        | PascalCase             | `User.ts`           |

### LLC Prefixes

| LLC                  | Prefix          |
| -------------------- | --------------- |
| Alawein Technologies | `@alawein`      |
| Live It Iconic       | `@liveiticonic` |
| REPZ                 | `@repz`         |

## Web Interface Strategy

For Python packages that need web interfaces:

```text
organizations/{llc}/
├── packages/
│   └── librex/              # Python library (pip install)
└── saas/
    └── librex-web/          # Web interface (Lovable.dev ✅)
        └── calls librex via FastAPI
```

**Pattern:** `{package-name}-web` for dashboards, `{package-name}-docs` for documentation sites.

## Quick Reference Commands

```bash
# Verify Lovable.dev project structure
ls -la src/components/ui/

# Check for required files
test -f package.json && test -f vite.config.ts && echo "Valid structure"

# Standard dev workflow
npm install
npm run dev
npm run build
npm run preview
```
