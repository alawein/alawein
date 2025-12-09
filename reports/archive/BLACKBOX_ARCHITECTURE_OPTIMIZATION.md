# 🏗️ BLACKBOX Architecture Optimization - Comprehensive 8-Week Plan

**Repository**: Alawein Multi-LLC Monorepo  
**Current State**: 35+ workflows, partial Turborepo, scattered configs  
**Target State**: Centralized, standardized, governed, optimized  
**Timeline**: 8 weeks (systematic approach)  
**Effort**: ~160 hours total

---

## 📊 Executive Summary

### Current Issues

- ❌ **35+ GitHub workflows** (target: 15, 57% reduction needed)
- ❌ **Duplicate configurations** across 20+ projects
- ❌ **No TypeScript project references** (slow type-checking)
- ❌ **Turborepo underutilized** (basic pipeline only)
- ❌ **Scattered governance policies** (inconsistent enforcement)
- ❌ **Large bundle sizes** (no optimization strategy)
- ❌ **No shared component library** (code duplication)
- ❌ **Inconsistent API patterns** (each project different)
- ❌ **No centralized monitoring** (fragmented observability)
- ❌ **Missing schema documentation** (database drift risk)

### Expected Outcomes

- ✅ **57% fewer workflows** (35 → 15)
- ✅ **40% smaller node_modules** (~2GB → ~1.2GB)
- ✅ **5-10x faster builds** (Turborepo + caching)
- ✅ **5x faster type-checking** (project references)
- ✅ **<200KB initial bundles** (code splitting + tree shaking)
- ✅ **90% code reuse** (shared component library)
- ✅ **100% policy compliance** (automated enforcement)
- ✅ **Centralized observability** (unified monitoring)
- ✅ **Zero config drift** (single source of truth)

---

## 🎯 Phase 1: Dependency Consolidation (Week 1)

### Objective

Eliminate duplicate dependencies and optimize workspace structure.

### Current State Analysis

```bash
# Analyze duplicate dependencies
npm ls --all | grep -E "deduped|extraneous"

# Check workspace structure
npm ls --workspaces --depth=0

# Identify version conflicts
npm outdated --workspaces
```

### Actions

#### 1.1 Audit Dependencies (Day 1-2)

```bash
# Generate dependency report
npm list --all --json > dependency-audit.json

# Analyze with custom script
node scripts/analyze-dependencies.js

# Identify duplicates
npx npm-check-updates --workspaces
```

**Expected Findings**:

- React versions: 18.2.0, 18.3.0 (consolidate to 18.3.0)
- TypeScript: 5.3.x, 5.6.x (consolidate to 5.6.3)
- Vite: 4.x, 5.x (consolidate to 5.x)
- Testing libraries: vitest, jest (standardize on vitest)

#### 1.2 Create Dependency Matrix (Day 2)

```typescript
// scripts/dependency-matrix.ts
interface DependencyMatrix {
  shared: string[]; // Root-level shared deps
  workspace: string[]; // Workspace-specific deps
  duplicates: string[]; // To be consolidated
  conflicts: string[]; // Version mismatches
}
```

#### 1.3 Consolidate to Root (Day 3-4)

```bash
# Move shared dependencies to root
npm install -w root react@18.3.0 react-dom@18.3.0
npm install -w root typescript@5.6.3
npm install -w root vite@5.x

# Remove from individual workspaces
npm uninstall react react-dom --workspaces

# Verify
npm ls react --workspaces
```

#### 1.4 Update Package.json Files (Day 4-5)

```json
// Root package.json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.6.3"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vitest": "^3.2.4",
    "@types/react": "^18.3.0"
  }
}
```

### Success Metrics

- ✅ 40% reduction in node_modules size
- ✅ Zero version conflicts
- ✅ All workspaces use shared dependencies
- ✅ Clean `npm ls` output (no duplicates)

### Validation

```bash
# Check for duplicates
npm dedupe --dry-run

# Verify workspace integrity
npm install --workspaces

# Run tests
npx turbo test
```

---

## 🔧 Phase 2: Configuration Centralization (Week 2)

### Objective

Create single source of truth for all configurations.

### Current State

- 15+ tsconfig.json files (mostly duplicates)
- 10+ vite.config.ts files (similar patterns)
- 8+ eslint configs (inconsistent rules)
- Multiple prettier configs

### Actions

#### 2.1 TypeScript Configuration (Day 1-2)

**Create Base Configs**:

```typescript
// packages/typescript-config/base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "incremental": true
  }
}

// packages/typescript-config/react.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}

// packages/typescript-config/node.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": ["node"]
  }
}
```

**Migrate Projects**:

```json
// organizations/repz-llc/apps/repz/tsconfig.json
{
  "extends": "@alawein/typescript-config/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

#### 2.2 Vite Configuration (Day 2-3)

**Create Shared Factory**:

```typescript
// packages/vite-config/index.ts
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export function createViteConfig(dirname: string): UserConfig {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(dirname, './src'),
      },
    },
    build: {
      target: 'es2022',
      minify: 'esbuild',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
          },
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  });
}
```

**Migrate Projects**:

```typescript
// organizations/repz-llc/apps/repz/vite.config.ts
import { createViteConfig } from '@alawein/vite-config';

export default createViteConfig(__dirname);
```

#### 2.3 ESLint Configuration (Day 3-4)

**Create Shared Config**:

```typescript
// packages/eslint-config/index.js
export default {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
```

#### 2.4 Prettier Configuration (Day 4)

**Single Root Config**:

```json
// .prettierrc.json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

#### 2.5 Create Config Package (Day 5)

```json
// packages/config/package.json
{
  "name": "@alawein/config",
  "version": "1.0.0",
  "exports": {
    "./typescript": "./typescript-config/base.json",
    "./typescript/react": "./typescript-config/react.json",
    "./typescript/node": "./typescript-config/node.json",
    "./vite": "./vite-config/index.ts",
    "./eslint": "./eslint-config/index.js"
  }
}
```

### Success Metrics

- ✅ 90% reduction in config files
- ✅ Single source of truth for each config type
- ✅ All projects use shared configs
- ✅ Zero config drift

### Validation

```bash
# Verify TypeScript configs
npx turbo type-check

# Verify ESLint
npx turbo lint

# Verify builds
npx turbo build
```

---

## 🗑️ Phase 3: Duplicate Elimination (Week 3)

### Objective

Identify and eliminate code duplication across projects.

### Actions

#### 3.1 Code Duplication Analysis (Day 1)

**Run Analysis Tools**:

```bash
# Install jscpd (copy-paste detector)
npm install -g jscpd

# Analyze codebase
jscpd --min-lines 10 --min-tokens 50 \
  --format "typescript,javascript,tsx,jsx" \
  --output ./reports/duplication.html \
  organizations/

# Generate report
node scripts/analyze-duplication.js
```

**Expected Findings**:

- Authentication components (5+ copies)
- Form validation logic (8+ copies)
- API client patterns (10+ copies)
- UI components (20+ copies)
- Utility functions (15+ copies)

#### 3.2 Extract Shared Components (Day 2-3)

**Create Shared UI Package**:

```typescript
// packages/shared-ui/src/components/Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Export all components
export * from './Button';
export * from './Input';
export * from './Card';
export * from './Modal';
export * from './ErrorBoundary';
```

#### 3.3 Extract Shared Utilities (Day 3-4)

**Create Shared Utils Package**:

```typescript
// packages/shared-utils/src/validation.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Must contain lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Must contain number');
  return { valid: errors.length === 0, errors };
}

// packages/shared-utils/src/formatting.ts
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string, format = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: format as any,
  }).format(d);
}
```

#### 3.4 Migrate Projects (Day 4-5)

**Replace Duplicates**:

```typescript
// Before (in each project)
function validateEmail(email: string) {
  /* ... */
}

// After (import from shared)
import { validateEmail } from '@alawein/shared-utils';
```

### Success Metrics

- ✅ 70% reduction in duplicate code
- ✅ Shared component library with 20+ components
- ✅ Shared utilities package with 30+ functions
- ✅ All projects use shared code

### Validation

```bash
# Run duplication analysis again
jscpd organizations/

# Verify imports
grep -r "@alawein/shared" organizations/

# Run tests
npx turbo test
```

---

## 🔄 Phase 4: CI/CD Optimization (Week 4)

### Objective

Consolidate 35+ workflows to 15 reusable workflows.

### Current Workflows (35+)

```
.github/workflows/
├── ai-feedback.yml
├── ai-governance-audit.yml
├── auto-merge-dependabot.yml
├── bundle-size.yml
├── catalog.yml
├── checkpoint.yml
├── ci-cd-pipeline.yml
├── ci.yml
├── codeql.yml
├── deploy-llmworks.yml
├── deploy-pages.yml
├── deploy.yml
├── docs.yml
├── enforce.yml
├── governance-enforcement.yml
├── health-check.yml
├── health-dashboard.yml
├── mcp-validation.yml
├── opa-conftest.yml
├── orchestration-governance.yml
├── release.yml
├── renovate.yml
├── repo-health.yml
├── reusable-deploy.yml
├── reusable-policy.yml
├── reusable-python-ci.yml
├── reusable-release.yml
├── reusable-test.yml
├── reusable-ts-ci.yml
├── reusable-universal-ci.yml
├── scorecard.yml
├── slsa-provenance.yml
├── structure-enforce.yml
├── structure-validation.yml
├── super-linter.yml
└── weekly-governance-check.yml
```

### Target Workflows (15)

#### 4.1 Core Reusable Workflows (Day 1-2)

**1. Universal CI Workflow**:

```yaml
# .github/workflows/reusable-ci.yml
name: Reusable CI

on:
  workflow_call:
    inputs:
      workspace:
        required: true
        type: string
      node-version:
        required: false
        type: string
        default: '20'

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx turbo type-check --filter=${{ inputs.workspace }}

      - name: Lint
        run: npx turbo lint --filter=${{ inputs.workspace }}

      - name: Test
        run: npx turbo test --filter=${{ inputs.workspace }}

      - name: Build
        run: npx turbo build --filter=${{ inputs.workspace }}
```

**2. Universal Deploy Workflow**:

```yaml
# .github/workflows/reusable-deploy.yml
name: Reusable Deploy

on:
  workflow_call:
    inputs:
      workspace:
        required: true
        type: string
      environment:
        required: true
        type: string
      platform:
        required: true
        type: string
    secrets:
      deploy-token:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npx turbo build --filter=${{ inputs.workspace }}

      - name: Deploy to ${{ inputs.platform }}
        run: |
          if [ "${{ inputs.platform }}" == "vercel" ]; then
            npx vercel --token=${{ secrets.deploy-token }} --prod
          elif [ "${{ inputs.platform }}" == "netlify" ]; then
            npx netlify deploy --prod --auth=${{ secrets.deploy-token }}
          fi
```

**3. Governance Workflow**:

```yaml
# .github/workflows/governance.yml
name: Governance

on:
  pull_request:
  schedule:
    - cron: '0 0 * * 0' # Weekly

jobs:
  governance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Structure Validation
        run: npm run governance -- validate-structure

      - name: Policy Enforcement
        run: npm run governance -- enforce-policies

      - name: Security Audit
        run: npm audit --audit-level=moderate

      - name: License Check
        run:
          npx license-checker --production
          --onlyAllow="MIT;Apache-2.0;BSD-3-Clause"
```

#### 4.2 Project-Specific Workflows (Day 2-3)

**Consolidate into Matrix Strategy**:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  ci:
    strategy:
      matrix:
        workspace:
          - llmworks
          - simcore
          - qmlab
          - attributa
          - repz
          - liveiticonic
    uses: ./.github/workflows/reusable-ci.yml
    with:
      workspace: ${{ matrix.workspace }}
```

#### 4.3 Consolidation Plan (Day 3-5)

**Merge Similar Workflows**:

```
Before (35 workflows):
- ai-feedback.yml
- ai-governance-audit.yml
- governance-enforcement.yml
- weekly-governance-check.yml

After (1 workflow):
- governance.yml (with schedule triggers)

Before (8 workflows):
- ci.yml
- ci-cd-pipeline.yml
- reusable-ts-ci.yml
- reusable-python-ci.yml
- reusable-universal-ci.yml

After (2 workflows):
- ci.yml (matrix strategy)
- reusable-ci.yml (reusable)

Before (5 workflows):
- deploy.yml
- deploy-llmworks.yml
- deploy-pages.yml
- reusable-deploy.yml

After (2 workflows):
- deploy.yml (matrix strategy)
- reusable-deploy.yml (reusable)
```

### Success Metrics

- ✅ 57% reduction (35 → 15 workflows)
- ✅ All workflows use reusable patterns
- ✅ Matrix strategies for similar jobs
- ✅ Faster CI/CD execution (parallel jobs)

### Validation

```bash
# Validate workflow syntax
gh workflow list

# Test workflows locally
act -l

# Monitor workflow runs
gh run list --limit 10
```

---

## 📦 Phase 5: TypeScript Project References (Week 5)

### Objective

Implement TypeScript project references for 5x faster type-checking.

### Current State

- Single tsconfig.json at root
- No project references
- Full type-check on every change (~30s)

### Target State

- Project references configured
- Incremental builds enabled
- Type-check only changed projects (~5s)

### Actions

#### 5.1 Create Root Configuration (Day 1)

```json
// tsconfig.json (root)
{
  "files": [],
  "references": [
    { "path": "./packages/shared-ui" },
    { "path": "./packages/shared-utils" },
    { "path": "./packages/typescript-config" },
    { "path": "./organizations/repz-llc/apps/repz" },
    { "path": "./organizations/live-it-iconic-llc/ecommerce/liveiticonic" },
    { "path": "./organizations/alawein-technologies-llc/saas/llmworks" },
    { "path": "./organizations/alawein-technologies-llc/saas/simcore" },
    { "path": "./organizations/alawein-technologies-llc/saas/qmlab" },
    { "path": "./organizations/alawein-technologies-llc/saas/attributa" }
  ]
}
```

#### 5.2 Configure Package References (Day 1-2)

```json
// packages/shared-ui/tsconfig.json
{
  "extends": "@alawein/typescript-config/react.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}

// packages/shared-utils/tsconfig.json
{
  "extends": "@alawein/typescript-config/node.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### 5.3 Configure Project References (Day 2-3)

```json
// organizations/repz-llc/apps/repz/tsconfig.json
{
  "extends": "@alawein/typescript-config/react.json",
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "references": [
    { "path": "../../../packages/shared-ui" },
    { "path": "../../../packages/shared-utils" }
  ],
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### 5.4 Update Build Scripts (Day 3-4)

```json
// package.json
{
  "scripts": {
    "type-check": "tsc --build",
    "type-check:watch": "tsc --build --watch",
    "type-check:clean": "tsc --build --clean"
  }
}

// turbo.json
{
  "pipeline": {
    "type-check": {
      "dependsOn": ["^type-check"],
      "outputs": ["**/*.tsbuildinfo"],
      "cache": true
    }
  }
}
```

#### 5.5 Test Incremental Builds (Day 4-5)

```bash
# Initial build (slow)
time npx turbo type-check
# Expected: ~30s

# Change one file
echo "// comment" >> packages/shared-ui/src/Button.tsx

# Incremental build (fast)
time npx turbo type-check
# Expected: ~5s (5x faster!)
```

### Success Metrics

- ✅ 5x faster type-checking (30s → 5s)
- ✅ Incremental builds working
- ✅ All projects use project references
- ✅ Build cache effective

### Validation

```bash
# Verify project references
tsc --build --dry --verbose

# Check build info files
find . -name "*.tsbuildinfo"

# Test incremental builds
npm run type-check:clean
npm run type-check
```

---

## ⚡ Phase 6: Turborepo Orchestration (Week 6)

### Objective

Optimize Turborepo for maximum build performance.

### Current Configuration

```json
// turbo.json (basic)
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### Target Configuration

#### 6.1 Advanced Pipeline (Day 1-2)

```json
// turbo.json (optimized)
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env", "tsconfig.json", "package.json"],
  "globalEnv": ["NODE_ENV", "CI"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build", "type-check"],
      "outputs": ["dist/**", "build/**", ".next/**", ".vite/**"],
      "cache": true,
      "env": ["NODE_ENV"]
    },
    "type-check": {
      "dependsOn": ["^type-check"],
      "outputs": ["**/*.tsbuildinfo"],
      "cache": true
    },
    "lint": {
      "dependsOn": ["^build"],
      "outputs": [],
      "cache": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": true,
      "env": ["NODE_ENV"]
    },
    "test:run": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

#### 6.2 Remote Caching Setup (Day 2-3)

**Option 1: Vercel Remote Cache**:

```bash
# Link to Vercel
npx turbo login
npx turbo link

# Enable remote caching
npx turbo build --remote-cache
```

**Option 2: Self-Hosted Cache**:

```typescript
// turbo-cache-server.ts
import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const CACHE_DIR = '.turbo-cache';

createServer(async (req, res) => {
  const cacheKey = req.url?.slice(1);

  if (req.method === 'GET') {
    try {
      const data = await readFile(join(CACHE_DIR, cacheKey));
      res.writeHead(200);
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end();
    }
  } else if (req.method === 'PUT') {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', async () => {
      await writeFile(join(CACHE_DIR, cacheKey), Buffer.concat(chunks));
      res.writeHead(200);
      res.end();
    });
  }
}).listen(3001);
```

#### 6.3 Parallel Execution Optimization (Day 3-4)

```json
// package.json
{
  "scripts": {
    "build:all": "turbo build --parallel",
    "test:all": "turbo test --parallel --concurrency=4",
    "lint:all": "turbo lint --parallel --concurrency=8"
  }
}
```

#### 6.4 Workspace Filtering (Day 4-5)

```bash
# Build specific workspace
npx turbo build --filter=repz

# Build workspace and dependencies
npx turbo build --filter=repz...

# Build workspace and dependents
npx turbo build --filter=...repz

# Build changed workspaces only
npx turbo build --filter=[HEAD^1]
```

### Success Metrics

- ✅ 5-10x faster builds (parallel + cache)
- ✅ Remote caching enabled (team-wide benefits)
- ✅ Optimal concurrency settings
- ✅ Smart filtering strategies

### Validation

```bash
# Measure build time
time npx turbo build

# Check cache hits
npx turbo build --summarize

# Verify remote cache
npx turbo build --remote-cache --dry-run
```

---

## 📦 Phase 7: Bundle Optimization (Week 7)

### Objective

Reduce bundle sizes to <200KB initial load.

### Current State

- No code splitting
- No tree shaking optimization
- Large vendor bundles
- No lazy loading

### Actions

#### 7.1 Analyze Current Bundles (Day 1)

```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Generate bundle reports
npx turbo build
node scripts/analyze-bundles.js
```

**Expected Findings**:

- Initial bundle: 500-800KB
- Vendor chunk: 300-400KB
- Unused code: 20-30%

#### 7.2 Configure Code Splitting (Day 1-2)

```typescript
// packages/vite-config/index.ts
export function createViteConfig(dirname: string): UserConfig {
  return defineConfig({
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['react-router-dom'],
            'vendor-query': ['@tanstack/react-query'],

            // Feature chunks
            'feature-auth': [
              './src/features/auth/Login.tsx',
              './src/features/auth/SignUp.tsx',
            ],
            'feature-dashboard': ['./src/features/dashboard/Dashboard.tsx'],
          },
          chunkFileNames: 'chunks/[name]-[hash].js',
          entryFileNames: 'entries/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 200, // 200KB warning
    },
  });
}
```

#### 7.3 Implement Lazy Loading (Day 2-3)

```typescript
// Before: Eager loading
import Dashboard from './features/dashboard/Dashboard';
import Profile from './features/profile/Profile';

// After: Lazy loading
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const Profile = lazy(() => import('./features/profile/Profile'));

function App() {
  return (
    <Suspense fallback={
```
