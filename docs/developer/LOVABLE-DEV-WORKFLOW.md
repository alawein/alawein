# Lovable.dev Integration Workflow

> **Last Updated:** 2025-12-07
> **Status:** Active
> **Applies To:** All Lovable.dev compatible projects

## Overview

This document describes the **bidirectional workflow** for working with Lovable.dev and local IDEs, and how to integrate Lovable.dev-generated projects into our monorepo infrastructure.

### Key Concept: Repository Relationship

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        LOVABLE.DEV CREATES                              │
│                    SEPARATE GITHUB REPOSITORIES                         │
│                                                                         │
│   Lovable.dev → github.com/alawein/{project-name}  (standalone repo)   │
│                                                                         │
│   Our Monorepo → github.com/alawein/alawein        (main monorepo)     │
└─────────────────────────────────────────────────────────────────────────┘
```

**Important:** Lovable.dev projects are **NOT** created inside our monorepo. Each Lovable.dev project generates its own standalone GitHub repository. To use Lovable.dev projects within our monorepo, you must **import and standardize** them.

### The Golden Rule

```text
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│ Lovable.dev │ ──push──►│  Standalone  │         │             │
│ (UI Design) │         │  GitHub Repo │         │             │
└─────────────┘         └──────┬───────┘         │             │
                               │                  │  Monorepo   │
                               │ clone & import   │  (alawein)  │
                               ▼                  │             │
                        ┌──────────────┐         │             │
                        │ Standardize  │─────────►│             │
                        │ & Integrate  │         └─────────────┘
                        └──────────────┘
```

**GitHub is the single source of truth.** Lovable.dev pushes to its own repo, which we then import and standardize into our monorepo.

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

---

## Infrastructure Standardization Guide

This section documents the process for importing and restructuring Lovable.dev-generated projects to match our monorepo infrastructure standards.

### Understanding Lovable.dev Output

When you create a project in Lovable.dev, it generates a **standalone GitHub repository** with this structure:

```text
github.com/alawein/{lovable-project}/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   └── App.tsx
├── public/
├── index.html
├── package.json          # Generic name, no scope
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json       # shadcn/ui config
└── README.md             # Lovable-generated
```

### File Disposition Matrix

When importing a Lovable.dev project, use this matrix to determine what to keep, modify, or replace:

| File/Folder          | Action         | Notes                       |
| -------------------- | -------------- | --------------------------- |
| `src/components/ui/` | ✅ **Keep**    | shadcn/ui base components   |
| `src/components/*`   | ✅ **Keep**    | Feature-specific components |
| `src/pages/`         | ✅ **Keep**    | Page components             |
| `src/hooks/`         | ✅ **Keep**    | Custom React hooks          |
| `src/lib/utils.ts`   | ✅ **Keep**    | Utility functions           |
| `src/App.tsx`        | 🔄 **Modify**  | May need route updates      |
| `src/main.tsx`       | 🔄 **Modify**  | May need provider updates   |
| `src/index.css`      | 🔄 **Modify**  | Add brand CSS variables     |
| `package.json`       | 🔄 **Modify**  | Update name, add scripts    |
| `vite.config.ts`     | 🔄 **Modify**  | Add path aliases            |
| `tailwind.config.ts` | 🔄 **Modify**  | Extend with brand colors    |
| `tsconfig.json`      | 🔄 **Modify**  | Ensure path aliases match   |
| `components.json`    | ✅ **Keep**    | shadcn/ui config            |
| `.gitignore`         | ✅ **Keep**    | Standard ignores            |
| `README.md`          | 🔁 **Replace** | Use our template            |
| `.github/`           | 🔁 **Replace** | Use monorepo workflows      |
| `node_modules/`      | ❌ **Delete**  | Will reinstall              |
| `package-lock.json`  | ❌ **Delete**  | Will regenerate             |

### Step-by-Step Import Process

#### Step 1: Clone the Lovable.dev Repository

```powershell
# Clone to a temporary location
git clone https://github.com/alawein/{lovable-project} C:/temp/{lovable-project}
cd C:/temp/{lovable-project}

# Remove git history (we'll integrate into monorepo)
Remove-Item -Recurse -Force .git
```

#### Step 2: Determine Canonical Location

```powershell
# Identify the correct placement
$llc = "alawein-technologies-llc"  # or live-it-iconic-llc, repz-llc
$category = "saas"                  # or ecommerce, mobile-apps
$projectName = "my-project"

# Target path
$targetPath = "organizations/$llc/$category/$projectName"
```

**LLC and Category Reference:**

| LLC                  | Prefix                     | Categories                                        |
| -------------------- | -------------------------- | ------------------------------------------------- |
| Alawein Technologies | `alawein-technologies-llc` | `saas/`, `packages/`, `research/`, `mobile-apps/` |
| Live It Iconic       | `live-it-iconic-llc`       | `ecommerce/`, `mobile-apps/`                      |
| REPZ                 | `repz-llc`                 | `apps/`, `mobile-apps/`                           |

#### Step 3: Update package.json

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

| LLC                  | Package Prefix   | Example                    |
| -------------------- | ---------------- | -------------------------- |
| Alawein Technologies | `@alawein/`      | `@alawein/llmworks`        |
| Live It Iconic       | `@liveiticonic/` | `@liveiticonic/storefront` |
| REPZ                 | `@repz/`         | `@repz/coach`              |

#### Step 4: Update vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

#### Step 5: Update tailwind.config.ts with Brand Colors

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Import from templates/_branding/brand-tokens.ts
        brand: {
          primary: 'hsl(var(--brand-primary))',
          secondary: 'hsl(var(--brand-secondary))',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

#### Step 6: Add Missing Directories

```powershell
# Create monorepo-standard directories
New-Item -ItemType Directory -Force -Path src/services
New-Item -ItemType Directory -Force -Path src/stores
New-Item -ItemType Directory -Force -Path src/types
New-Item -ItemType Directory -Force -Path src/integrations
```

#### Step 7: Move to Monorepo Location

```powershell
# From the temp directory
Move-Item "C:/temp/{lovable-project}/*" "organizations/$llc/$category/$projectName/"

# Or copy if you want to keep the original
Copy-Item -Recurse "C:/temp/{lovable-project}/*" "organizations/$llc/$category/$projectName/"
```

#### Step 8: Install Dependencies and Verify

```powershell
cd "organizations/$llc/$category/$projectName"

# Install dependencies
npm install

# Verify build
npm run build

# Test locally
npm run dev
```

### Integrating into Templates Directory

If the Lovable.dev project should become a reusable template:

```powershell
# Copy to templates directory
$templateName = "product-{name}"  # or saas-{theme}, ecommerce-{theme}
Copy-Item -Recurse "organizations/$llc/$category/$projectName" "templates/$templateName"

# Update template's package.json
# Change name to: "@alawein/template-{name}"
```

**Template Naming Conventions:**

| Type              | Pattern             | Example                                    |
| ----------------- | ------------------- | ------------------------------------------ |
| Product Dashboard | `product-{name}`    | `product-talai`, `product-librex`          |
| SaaS Theme        | `saas-{theme}`      | `saas-midnight`, `saas-aurora`             |
| E-commerce Theme  | `ecommerce-{theme}` | `ecommerce-luxury`, `ecommerce-minimal`    |
| Fitness Theme     | `fitness-{theme}`   | `fitness-neon`, `fitness-zen`              |
| Portfolio Theme   | `{style}-portfolio` | `cyberpunk-portfolio`, `classic-portfolio` |

### Post-Integration Checklist

After importing a Lovable.dev project, verify:

- [ ] `package.json` has scoped name (`@alawein/...`)
- [ ] `vite.config.ts` has `@` path alias
- [ ] `tailwind.config.ts` extends brand colors
- [ ] `tsconfig.json` has matching path aliases
- [ ] `src/services/` directory exists
- [ ] `src/stores/` directory exists
- [ ] `src/types/` directory exists
- [ ] `src/integrations/` directory exists (if using Supabase/Stripe)
- [ ] Project builds without errors (`npm run build`)
- [ ] Dev server starts correctly (`npm run dev`)
- [ ] README.md updated with project-specific info

### Automated Import Script

For convenience, use this PowerShell script:

```powershell
# Save as: scripts/import-lovable-project.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl,

    [Parameter(Mandatory=$true)]
    [ValidateSet("alawein-technologies-llc", "live-it-iconic-llc", "repz-llc")]
    [string]$LLC,

    [Parameter(Mandatory=$true)]
    [ValidateSet("saas", "ecommerce", "mobile-apps", "apps", "packages")]
    [string]$Category,

    [Parameter(Mandatory=$true)]
    [string]$ProjectName
)

$tempPath = "C:/temp/$ProjectName"
$targetPath = "organizations/$LLC/$Category/$ProjectName"

Write-Host "Importing Lovable.dev project..." -ForegroundColor Cyan

# Clone
git clone $RepoUrl $tempPath
Remove-Item -Recurse -Force "$tempPath/.git"

# Create target directory
New-Item -ItemType Directory -Force -Path $targetPath

# Move files
Move-Item "$tempPath/*" $targetPath

# Create missing directories
@("services", "stores", "types", "integrations") | ForEach-Object {
    New-Item -ItemType Directory -Force -Path "$targetPath/src/$_"
}

# Install and verify
Set-Location $targetPath
npm install
npm run build

Write-Host "✅ Import complete: $targetPath" -ForegroundColor Green
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
