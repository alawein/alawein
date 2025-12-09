# ⚡ BLACKBOX Quick Optimization Phases - 5-Day Action Plan

**Repository**: Alawein Multi-LLC Monorepo  
**Timeline**: 5 days (~12 hours total)  
**Approach**: High-impact quick wins  
**Focus**: Immediate improvements with measurable results

---

## 🎯 Overview

### Quick Wins Strategy

- ✅ **Day 1**: Workspace setup + Config extraction (2.5 hrs)
- ✅ **Day 2**: Duplicate elimination + CI consolidation (2.5 hrs)
- ✅ **Day 3**: Turbo optimization + TypeScript refs (2.5 hrs)
- ✅ **Day 4**: Bundle optimization + Shared library (2.5 hrs)
- ✅ **Day 5**: Governance + Validation (2 hrs)

### Expected Results

- 🚀 **40% smaller node_modules** (immediate)
- 🚀 **5-10x faster builds** (Day 3)
- 🚀 **57% fewer workflows** (Day 2)
- 🚀 **<200KB bundles** (Day 4)
- 🚀 **100% policy compliance** (Day 5)

---

## 📅 Day 1: Workspace Setup & Config Extraction (2.5 hours)

### Phase 1: Workspace Consolidation (30 minutes)

**Blackbox Commands**:

```bash
# Analyze current workspace structure
/analyze workspace dependencies in package.json

# Generate dependency consolidation plan
/refactor consolidate duplicate dependencies to root workspace
```

**Exact Actions**:

```bash
# 1. Audit dependencies (5 min)
npm ls --all --json > dependency-audit.json

# 2. Identify duplicates (5 min)
node -e "
const audit = require('./dependency-audit.json');
const deps = {};
function traverse(node) {
  if (node.dependencies) {
    Object.entries(node.dependencies).forEach(([name, info]) => {
      if (!deps[name]) deps[name] = [];
      deps[name].push(info.version);
      traverse(info);
    });
  }
}
traverse(audit);
const duplicates = Object.entries(deps)
  .filter(([_, versions]) => new Set(versions).size > 1)
  .map(([name, versions]) => ({ name, versions: [...new Set(versions)] }));
console.log(JSON.stringify(duplicates, null, 2));
" > duplicates.json

# 3. Consolidate to root (15 min)
npm install react@18.3.0 react-dom@18.3.0 typescript@5.6.3 -w root
npm install vite@5.4.0 vitest@3.2.4 -D -w root

# 4. Remove from workspaces (5 min)
npm uninstall react react-dom typescript --workspaces
```

**Target Files**:

- `package.json` (root)
- `organizations/*/package.json` (all workspaces)

**Success Metrics**:

- ✅ Zero duplicate dependencies
- ✅ ~40% reduction in node_modules size
- ✅ Clean `npm ls` output

**Validation**:

```bash
npm dedupe --dry-run
npm ls react typescript vite --workspaces
```

---

### Phase 2: Configuration Extraction (45 minutes)

**Blackbox Commands**:

```bash
# Extract TypeScript configs
/generate shared typescript configuration package

# Extract Vite configs
/generate shared vite configuration factory

# Extract ESLint configs
/generate shared eslint configuration
```

**Exact Actions**:

**Step 1: Create Config Package (10 min)**

```bash
mkdir -p packages/config/{typescript,vite,eslint}
cd packages/config
npm init -y
```

**Step 2: TypeScript Configs (15 min)**

```bash
# Create base config
cat > typescript/base.json << 'EOF'
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
    "incremental": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
EOF

# Create React config
cat > typescript/react.json << 'EOF'
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
EOF

# Create Node config
cat > typescript/node.json << 'EOF'
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": ["node"]
  }
}
EOF
```

**Step 3: Vite Config Factory (10 min)**

```bash
cat > vite/index.ts << 'EOF'
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export function createViteConfig(dirname: string): UserConfig {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(dirname, './src') }
    },
    build: {
      target: 'es2022',
      minify: 'esbuild',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom']
          }
        }
      }
    }
  });
}
EOF
```

**Step 4: Migrate Projects (10 min)**

```bash
# Update all project tsconfig.json files
find organizations -name "tsconfig.json" -type f -exec sed -i 's/"extends": ".*"/"extends": "@alawein\/config\/typescript\/react.json"/' {} \;

# Update all vite.config.ts files
find organizations -name "vite.config.ts" -type f -exec sh -c '
  echo "import { createViteConfig } from \"@alawein/config/vite\";
export default createViteConfig(__dirname);" > "$1"
' _ {} \;
```

**Target Files**:

- `packages/config/typescript/*.json`
- `packages/config/vite/index.ts`
- `packages/config/eslint/index.js`
- All `tsconfig.json` files (migrate)
- All `vite.config.ts` files (migrate)

**Success Metrics**:

- ✅ 90% reduction in config files
- ✅ All projects use shared configs
- ✅ Builds still work

**Validation**:

```bash
npx turbo type-check
npx turbo build
```

---

### Phase 3: Package Setup (30 minutes)

**Blackbox Commands**:

```bash
# Create shared packages structure
/generate monorepo shared packages structure

# Setup package exports
/optimize package.json exports for shared packages
```

**Exact Actions**:

```bash
# 1. Create package structure (10 min)
mkdir -p packages/{shared-ui,shared-utils,config}

# 2. Initialize packages (10 min)
for pkg in shared-ui shared-utils config; do
  cd packages/$pkg
  npm init -y
  cat > package.json << EOF
{
  "name": "@alawein/$pkg",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
EOF
  cd ../..
done

# 3. Update root package.json (5 min)
npm install @alawein/shared-ui@* @alawein/shared-utils@* @alawein/config@* -w root

# 4. Verify workspace setup (5 min)
npm ls --workspaces --depth=0
```

**Success Metrics**:

- ✅ 3 shared packages created
- ✅ Proper package exports configured
- ✅ Workspace links working

**Validation**:

```bash
npm ls @alawein/shared-ui @alawein/shared-utils @alawein/config
```

---

### Day 1 Summary

- ⏱️ **Time**: 2.5 hours
- ✅ **Completed**: Workspace consolidation, config extraction, package setup
- 📊 **Impact**: 40% smaller node_modules, 90% fewer config files
- 🎯 **Next**: Duplicate elimination and CI consolidation

---

## 📅 Day 2: Duplicate Elimination & CI Consolidation (2.5 hours)

### Phase 4: CI/CD Consolidation (1 hour)

**Blackbox Commands**:

```bash
# Analyze GitHub workflows
/analyze .github/workflows for consolidation opportunities

# Generate reusable workflow templates
/generate reusable github workflow for CI and deployment

# Consolidate similar workflows
/refactor merge similar github workflows into matrix strategies
```

**Exact Actions**:

**Step 1: Create Reusable CI Workflow (15 min)**

```bash
cat > .github/workflows/reusable-ci.yml << 'EOF'
name: Reusable CI

on:
  workflow_call:
    inputs:
      workspace:
        required: true
        type: string

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx turbo type-check --filter=${{ inputs.workspace }}
      - run: npx turbo lint --filter=${{ inputs.workspace }}
      - run: npx turbo test --filter=${{ inputs.workspace }}
      - run: npx turbo build --filter=${{ inputs.workspace }}
EOF
```

**Step 2: Create Matrix CI Workflow (10 min)**

```bash
cat > .github/workflows/ci.yml << 'EOF'
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
          - repz
          - liveiticonic
          - llmworks
          - simcore
          - qmlab
          - attributa
    uses: ./.github/workflows/reusable-ci.yml
    with:
      workspace: ${{ matrix.workspace }}
EOF
```

**Step 3: Consolidate Governance Workflows (15 min)**

```bash
cat > .github/workflows/governance.yml << 'EOF'
name: Governance

on:
  pull_request:
  schedule:
    - cron: '0 0 * * 0'

jobs:
  governance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run governance -- validate-structure
      - run: npm run governance -- enforce-policies
      - run: npm audit --audit-level=moderate
      - run: npx license-checker --production --onlyAllow="MIT;Apache-2.0;BSD-3-Clause"
EOF
```

**Step 4: Archive Old Workflows (20 min)**

```bash
# Create archive directory
mkdir -p .github/workflows-archive

# Move consolidated workflows
mv .github/workflows/ai-feedback.yml .github/workflows-archive/
mv .github/workflows/ai-governance-audit.yml .github/workflows-archive/
mv .github/workflows/governance-enforcement.yml .github/workflows-archive/
mv .github/workflows/weekly-governance-check.yml .github/workflows-archive/
mv .github/workflows/ci-cd-pipeline.yml .github/workflows-archive/
mv .github/workflows/reusable-ts-ci.yml .github/workflows-archive/
mv .github/workflows/reusable-python-ci.yml .github/workflows-archive/

# Keep only essential workflows (15 total)
ls -1 .github/workflows/ | wc -l  # Should show ~15
```

**Target Files**:

- `.github/workflows/reusable-ci.yml` (new)
- `.github/workflows/ci.yml` (updated)
- `.github/workflows/governance.yml` (consolidated)
- `.github/workflows-archive/*` (archived)

**Success Metrics**:

- ✅ 35 → 15 workflows (57% reduction)
- ✅ All workflows use reusable patterns
- ✅ Matrix strategies for parallel execution
- ✅ Faster CI runs

**Validation**:

```bash
gh workflow list
gh run list --limit 5
```

---

### Phase 5: Duplicate Code Elimination (1.5 hours)

**Blackbox Commands**:

```bash
# Analyze code duplication
/analyze organizations/ for duplicate code patterns

# Extract shared components
/generate shared component library from duplicates

# Extract shared utilities
/generate shared utilities package from common functions
```

**Exact Actions**:

**Step 1: Analyze Duplicates (15 min)**

```bash
# Install jscpd
npm install -g jscpd

# Run analysis
jscpd --min-lines 10 --min-tokens 50 \
  --format "typescript,tsx" \
  --output ./reports/duplication.html \
  organizations/

# Generate report
open reports/duplication.html
```

**Step 2: Extract Shared UI Components (30 min)**

```bash
# Create component files
mkdir -p packages/shared-ui/src/components

# Button component
cat > packages/shared-ui/src/components/Button.tsx << 'EOF'
import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled
}: ButtonProps) {
  const baseClasses = 'rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
EOF

# Input component
cat > packages/shared-ui/src/components/Input.tsx << 'EOF'
import React from 'react';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  label
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`px-3 py-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
EOF

# Card component
cat > packages/shared-ui/src/components/Card.tsx << 'EOF'
import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}
EOF

# Export all
cat > packages/shared-ui/src/index.ts << 'EOF'
export * from './components/Button';
export * from './components/Input';
export * from './components/Card';
EOF
```

**Step 3: Extract Shared Utilities (30 min)**

```bash
mkdir -p packages/shared-utils/src

# Validation utilities
cat > packages/shared-utils/src/validation.ts << 'EOF'
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase');
  if (!/[a-z]/.test(password)) errors.push('Must contain lowercase');
  if (!/[0-9]/.test(password)) errors.push('Must contain number');
  return { valid: errors.length === 0, errors };
}

export function validatePhone(phone: string): boolean {
  return /^\+?[\d\s-()]+$/.test(phone);
}
EOF

# Formatting utilities
cat > packages/shared-utils/src/formatting.ts << 'EOF'
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: format
  }).format(d);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
EOF

# Export all
cat > packages/shared-utils/src/index.ts << 'EOF'
export * from './validation';
export * from './formatting';
EOF
```

**Step 4: Migrate Projects (15 min)**

```bash
# Find and replace in all projects
find organizations -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's/import.*Button.*from.*components/import { Button } from "@alawein\/shared-ui"/g'

find organizations -name "*.tsx" -o -name "*.ts" | xargs sed -i \
  's/import.*validateEmail.*from.*utils/import { validateEmail } from "@alawein\/shared-utils"/g'
```

**Target Files**:

- `packages/shared-ui/src/components/*.tsx`
- `packages/shared-utils/src/*.ts`
- All project files (migrate imports)

**Success Metrics**:

- ✅ 70% reduction in duplicate code
- ✅ 20+ shared components
- ✅ 30+ shared utilities
- ✅ All projects use shared code

**Validation**:

```bash
# Re-run duplication analysis
jscpd organizations/

# Verify imports
grep -r "@alawein/shared" organizations/ | wc -l

# Run tests
npx turbo test
```

---

### Day 2 Summary

- ⏱️ **Time**: 2.5 hours
- ✅ **Completed**: CI consolidation (35→15 workflows), duplicate elimination
- 📊 **Impact**: 57% fewer workflows, 70% less duplicate code
- 🎯 **Next**: Turbo optimization and TypeScript project references

---

## 📅 Day 3: Turbo Optimization & TypeScript References (2.5 hours)

### Phase 6: Turborepo Optimization (1 hour)

**Blackbox Commands**:

```bash
# Optimize Turborepo configuration
/optimize turbo.json for maximum build performance

# Setup remote caching
/generate turborepo remote cache configuration

# Configure parallel execution
/optimize turborepo pipeline for parallel builds
```

**Exact Actions**:

**Step 1: Optimize turbo.json (20 min)**

```bash
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    ".env",
    "tsconfig.json",
    "package.json"
  ],
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
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
EOF
```

**Step 2: Enable Remote Caching (15 min)**

```bash
# Option 1: Vercel (recommended)
npx turbo login
npx turbo link

# Option 2: Self-hosted (if needed)
cat > turbo-cache-server.ts << 'EOF'
import { createServer } from 'http';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const CACHE_DIR = '.turbo-cache';
await mkdir(CACHE_DIR, { recursive: true });

createServer(async (req, res) => {
  const key = req.url?.slice(1);
  if (!key) return res.writeHead(400).end();

  if (req.method === 'GET') {
    try {
      const data = await readFile(join(CACHE_DIR, key));
      res.writeHead(200).end(data);
    } catch {
      res.writeHead(404).end();
    }
  } else if (req.method === 'PUT') {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      await writeFile(join(CACHE_DIR, key), Buffer.concat(chunks));
      res.writeHead(200).end();
    });
  }
}).listen(3001, () => console.log('Cache server on :3001'));
EOF
```

**Step 3: Test Performance (15 min)**

```bash
# Clean build (no cache)
npx turbo clean
time npx turbo build
# Expected: 60-120s

# Cached build (should be instant)
time npx turbo build
# Expected: 1-5s (10-50x faster!)

# Parallel build
time npx turbo build --parallel
# Expected: 30-60s (2x faster than sequential)
```

**Step 4: Update Scripts (10 min)**

```bash
# Add to package.json
cat > package.json << 'EOF'
{
  "scripts": {
    "build": "turbo build",
    "build:parallel": "turbo build --parallel",
    "build:filter": "turbo build --filter",
    "test": "turbo test",
    "test:parallel": "turbo test --parallel --concurrency=4",
    "lint": "turbo lint --parallel --concurrency=8",
    "type-check": "turbo type-check",
    "clean": "turbo clean"
  }
}
EOF
```

**Success Metrics**:

- ✅ 10-50x faster cached builds
- ✅ 2-5x faster parallel builds
- ✅ Remote caching enabled
- ✅ Optimal pipeline configuration

**Validation**:

```bash
# Measure build times
time npm run build
time npm run build  # Should be instant

# Check cache stats
npx turbo build --summarize
```

---

### Phase 7: TypeScript Project References (1.5 hours)

**Blackbox Commands**:

```bash
# Setup TypeScript project references
/generate typescript project references configuration

# Configure composite projects
/optimize typescript for incremental builds with project references

# Update build pipeline
/refactor typescript build to use project references
```

**Exact Actions**:

**Step 1: Configure Root tsconfig (15 min)**

```bash
cat > tsconfig.json << 'EOF'
{
  "files": [],
  "references": [
    { "path": "./packages/shared-ui" },
    { "path": "./packages/shared-utils" },
    { "path": "./packages/config" },
    { "path": "./organizations/repz-llc/apps/repz" },
    { "path": "./organizations/live-it-iconic-llc/ecommerce/liveiticonic" },
    { "path": "./organizations/alawein-technologies-llc/saas/llmworks" },
    { "path": "./organizations/alawein-technologies-llc/saas/simcore" },
    { "path": "./organizations/alawein-technologies-llc/saas/qmlab" },
    { "path": "./organizations/alawein-technologies-llc/saas/attributa" }
  ]
}
EOF
```

**Step 2: Configure Package References (30 min)**

```bash
# Shared UI
cat > packages/shared-ui/tsconfig.json << 'EOF'
{
  "extends": "@alawein/config/typescript/react.json",
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
EOF

# Shared Utils
cat > packages/shared-utils/tsconfig.json << 'EOF'
{
  "extends": "@alawein/config/typescript/node.json",
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
EOF
```

**Step 3: Configure Project References (30 min)**

```bash
# REPZ
cat > organizations/repz-llc/apps/repz/tsconfig.json << 'EOF'
{
  "extends": "@alawein/config/typescript/react.json",
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
EOF

# Repeat for other projects (LLMWorks, SimCore, etc.)
for project in llmworks simcore qmlab attributa; do
  cat > organizations/alawein-technologies-llc/saas/$project/tsconfig.json << 'EOF'
{
  "extends": "@alawein/config/typescript/react.json",
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
EOF
done
```

**Step 4: Update Build Scripts (15 min)**

```bash
# Update package.json
cat >> package.json << 'EOF'
{
  "scripts": {
    "type-check": "tsc --build",
    "type-check:watch": "tsc --build --watch",
    "type-check:clean": "tsc --build --clean"
  }
}
EOF

# Test incremental builds
npm run type-check:clean
time npm run type-check
# Expected: 20-30s (initial)

# Make a change
echo "// test" >> packages/shared-ui/src/index.ts

# Incremental build
time npm run type-check
# Expected: 3-5s (5-10x faster!)
```

**Success Metrics**:

- ✅ 5-10x faster type-checking
- ✅ Incremental builds working
- ✅ All projects use project references
- ✅ Build cache effective

**Validation**:

```bash
# Verify project references
tsc --build --dry --verbose

# Check build info files
find . -name "*.tsbuildinfo" | wc -l

# Test incremental builds
npm run type-check:clean && time npm run type-check
echo "// change" >> packages/shared-ui/src/index.ts
time npm run type-check
```

---

### Day 3 Summary

- ⏱️ **Time**: 2.5 hours
- ✅ **Completed**: Turborepo optimization, TypeScript project references
- 📊 **Impact**: 10-50x faster cached builds, 5-10x faster type-checking
- 🎯 **Next**: Bundle optimization and shared library completion

---

## 📅 Day 4: Bundle Optimization & Shared Library (2.5 hours)

### Phase 8: Bundle Optimization (1.5 hours)

**Blackbox Commands**:

```bash
# Analyze bundle sizes
/analyze build output for bundle size optimization opportunities

# Configure code splitting
/optimize vite rollup configuration for code splitting

# Implement lazy loading
/refactor routes to use React lazy loading
```

**Exact Actions**:

**Step 1: Analyze Current Bundles (15 min)**

```bash
# Install analyzer
npm install -D rollup-plugin-visualizer

# Add to vite config
cat >> packages/config/vite/index.ts << 'EOF'
import { visualizer } from 'rollup-plugin-visualizer';

export function createViteConfig(dirname: string, analyze = false): UserConfig {
  const plugins = [react()];
  if (analyze) {
    plugins.push(visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    }));
  }
  // ... rest of config
}
EOF

# Build with
```
