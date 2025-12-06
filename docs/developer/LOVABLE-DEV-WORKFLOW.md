# Lovable.dev Integration Workflow

> **Last Updated:** 2024-12-06  
> **Status:** Active  
> **Applies To:** All Lovable.dev compatible projects

## Overview

This document describes the standardized workflow for integrating Lovable.dev templates with our canonical repository structure.

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

## Workflow: Creating New Lovable.dev Projects

### Step 1: Create Template in Lovable.dev

1. Open [lovable.dev](https://lovable.dev)
2. Create your UI/platform template
3. Use one of the starter templates:
   - **SaaS Dashboard** - For `saas/` projects
   - **E-commerce Store** - For `ecommerce/` projects
   - **Mobile-First App** - For `mobile-apps/` projects

### Step 2: Export/Clone the Project

```bash
# Clone from Lovable.dev GitHub integration
git clone https://github.com/lovable-dev/your-project-name temp-project
```

### Step 3: Move to Canonical Location

```powershell
# Determine the correct LLC and category
# Example: New SaaS platform for Alawein Technologies

$projectName = "your-project-name"
$llc = "alawein-technologies-llc"
$category = "saas"

# Move to canonical location
Move-Item -Path "temp-project" -Destination "organizations\$llc\$category\$projectName"
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

```
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

```
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
