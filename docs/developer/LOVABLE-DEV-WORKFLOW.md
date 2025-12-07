# Lovable.dev Integration Workflow

> **Last Updated:** 2024-12-07
> **Status:** Active
> **Applies To:** All Lovable.dev compatible projects

## Overview

This document describes the **bidirectional workflow** for working with Lovable.dev and local IDEs.

### The Golden Rule

```
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
```

**GitHub is the single source of truth.** Both Lovable.dev and local IDEs push to the same repo.

### Clear Boundaries

| Directory                | Owner       | Purpose                     |
| ------------------------ | ----------- | --------------------------- |
| `src/components/ui/`     | Lovable.dev | shadcn/ui base components   |
| `src/components/layout/` | Lovable.dev | Layout components           |
| `src/pages/`             | Shared      | Page components             |
| `src/services/`          | Local IDE   | API clients, business logic |
| `src/stores/`            | Local IDE   | Zustand state management    |
| `src/hooks/`             | Local IDE   | Custom React hooks          |
| `src/types/`             | Local IDE   | TypeScript types            |
| `src/integrations/`      | Local IDE   | Supabase, Stripe, etc.      |

## Project Compatibility Matrix

| Category           | Directory      | Lovable.dev | Notes                  |
| ------------------ | -------------- | ----------- | ---------------------- |
| SaaS Platforms     | `saas/`        | ✅ Yes      | React/Vite + Supabase  |
| E-commerce         | `ecommerce/`   | ✅ Yes      | React/Vite + Stripe    |
| Mobile Apps        | `mobile-apps/` | ✅ Yes      | React/Vite + Capacitor |
| Python Packages    | `packages/`    | ❌ No       | Pure Python (PyPI)     |
| Research Platforms | `research/`    | ❌ No       | Multi-module Python    |
| Product Incubators | `incubator/`   | ❌ No       | Prototypes/concepts    |
| Services           | `services/`    | ⚠️ Partial  | Backend only           |

## Quick Start: New Project

### Option A: Start in Lovable.dev (Recommended for UI-heavy projects)

```powershell
# 1. Create in Lovable.dev, connect to GitHub
# 2. Clone locally
git clone https://github.com/alawein/your-project temp-project

# 3. Move to canonical location
$llc = "alawein-technologies-llc"
$category = "saas"  # or ecommerce, mobile-apps
Move-Item temp-project "organizations/$llc/$category/your-project"

# 4. Install & run
cd "organizations/$llc/$category/your-project"
npm install
npm run dev

# 5. Connect Vercel for auto-deploy
# Go to vercel.com → Import from GitHub → Select repo
```

### Option B: Start from Template (Recommended for logic-heavy projects)

```powershell
# 1. Copy the lovable-react template
$llc = "alawein-technologies-llc"
$category = "saas"
$name = "my-new-project"

Copy-Item -Recurse "templates/lovable-react" "organizations/$llc/$category/$name"

# 2. Update package.json name
cd "organizations/$llc/$category/$name"
# Edit package.json: "name": "@alawein/my-new-project"

# 3. Install & run
npm install
npm run dev

# 4. Push to GitHub
git init
git add .
git commit -m "Initial commit from lovable-react template"
git remote add origin https://github.com/alawein/$name
git push -u origin main

# 5. Connect to Lovable.dev (optional)
# Go to lovable.dev → Import existing GitHub repo
```

### Step 4: Standardize Configuration

Update `package.json` name field:

```json
{
  "name": "@alawein/{project-name}",
  "version": "0.1.0",
  "private": true
}
```

Update `vite.config.ts` path aliases:

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Step 5: Install Dependencies

```bash
cd organizations/{llc}/{category}/{project-name}
npm install
```

### Step 6: Verify Build

```bash
npm run build
npm run dev  # Test locally
```

## Workflow: Updating Existing Projects with Lovable.dev

### For UI Changes Only

1. Create a new Lovable.dev template with desired changes
2. Export only the `src/components/` directory
3. Merge components into existing project

### For Major Redesigns

1. Create full Lovable.dev template
2. Export to temporary directory
3. Carefully merge, preserving:
   - Business logic in `src/services/`
   - State management in `src/stores/`
   - API integrations in `src/integrations/`

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
