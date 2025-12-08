---
document_metadata:
  title: "Lovable.dev to Monorepo Migration Guide"
  document_id: "LOVABLE-MIGRATION-GUIDE-001"
  version: "1.0.0"
  status: "Active"
  classification: "Internal"
  
  dates:
    created: "2025-12-07"
    last_updated: "2025-12-07"
    next_review: "2026-03-07"
    
  ownership:
    owner: "DevOps Team"
    maintainer: "Platform Engineers"
    reviewers: ["Development Teams", "Technical Writing Team"]
    
  change_summary: |
    [2025-12-07] Initial migration guide creation
    - Documented complete Lovable.dev to monorepo migration process
    - Included before/after examples for all configuration files
    - Added package manager migration from npm to pnpm
    
  llm_context:
    purpose: "Comprehensive migration guide for Lovable.dev projects integrating into the monorepo"
    scope: "Configuration modifications, package management, build setup, design system integration"
    key_concepts: ["migration", "lovable.dev", "monorepo", "pnpm", "configuration"]
    related_documents: ["LOVABLE-README-TEMPLATE.md", "LOVABLE-GITHUB-WORKFLOWS.md", "LOVABLE-DEV-WORKFLOW.md"]
---

## 🎯 Migration Overview

This guide walks through converting a standalone Lovable.dev project to work seamlessly within the monorepo structure while maintaining all functionality.

### Key Changes Required

1. **Package Manager**: npm → pnpm
2. **Path Aliases**: Standardized monorepo aliases
3. **Build Configuration**: Optimized for monorepo builds
4. **Design System**: Integration with brand tokens
5. **Workflows**: Replace with monorepo CI/CD

## 📋 Prerequisites

- **Backup**: Create a backup of your project
- **Git Clean**: Ensure all changes are committed
- **Dependencies**: Note any custom dependencies
- **Environment**: Document all environment variables

## 🔧 File-by-File Migration

### 1. package.json

**Before (Lovable.dev default):**

```json
{
  "name": "my-lovable-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.0"
  }
}
```

**After (Monorepo optimized):**

```json
{
  "name": "my-lovable-project",
  "description": "Brief description of the project",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "homepage": "https://alawein.dev",
  "repository": {
    "type": "git",
    "url": "https://github.com/alawein/alawein.git",
    "directory": "organizations/[organization]/[category]/my-lovable-project"
  },
  "keywords": [
    "react",
    "vite",
    "typescript",
    "lovable-dev"
  ],
  "author": "Alawein Technologies",
  "license": "MIT",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react-swc": "^3.3.0",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.0",
    "vitest": "^0.34.0"
  }
}
```

### 2. vite.config.ts

**Before (Lovable.dev default):**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

**After (Monorepo optimized):**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["framer-motion", "lucide-react"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### 3. tsconfig.json

**Before (Lovable.dev default):**
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
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**After (Monorepo optimized):**
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
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/types/*": ["./src/types/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. tailwind.config.ts

**Before (Lovable.dev default):**
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

**After (Monorepo with brand colors):**
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Primary
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Semantic colors
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        // Neutral palette
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
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
      },
    },
  },
  plugins: [],
} satisfies Config
```

### 5. src/index.css

**Before (Lovable.dev default):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**After (Monorepo with brand variables):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Brand CSS Variables */
:root {
  /* Brand Colors */
  --brand-primary: 59 130 246;      /* rgb(59, 130, 246) */
  --brand-secondary: 100 116 139;    /* rgb(100, 116, 139) */
  --brand-accent: 245 158 11;        /* rgb(245, 158, 11) */
  --brand-success: 16 185 129;       /* rgb(16, 185, 129) */
  --brand-warning: 245 158 11;       /* rgb(245, 158, 11) */
  --brand-error: 239 68 68;          /* rgb(239, 68, 68) */
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Base layer styling */
@layer base {
  html {
    font-family: var(--font-sans);
  }
  
  body {
    @apply bg-neutral-50 text-neutral-900 antialiased;
  }
}

/* Component layer styling */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background;
  }
  
  .btn-primary {
    @apply btn bg-brand-500 text-white hover:bg-brand-600;
  }
  
  .btn-secondary {
    @apply btn bg-neutral-100 text-neutral-900 hover:bg-neutral-200;
  }
  
  .card {
    @apply rounded-lg border bg-white text-neutral-950 shadow-sm;
  }
}
```

### 6. src/main.tsx

**Before (Lovable.dev default):**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**After (Monorepo with providers):**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/components/theme-provider';
import App from './App.tsx';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

### 7. src/App.tsx

**Before (Lovable.dev default):**
```typescript
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
```

**After (Monorepo with routing):**
```typescript
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/layout';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
```

## 🔄 Migration Steps

### Step 1: Backup and Clean

```bash
# Create backup
cp -r . ../my-project-backup

# Clean existing lockfiles
rm -rf node_modules package-lock.json
```

### Step 2: Update Configuration Files

```bash
# Update package.json
# Update vite.config.ts
# Update tsconfig.json
# Update tailwind.config.ts
```

### Step 3: Migrate to pnpm

```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies with pnpm
pnpm install

# Update lockfile
pnpm install --frozen-lockfile
```

### Step 4: Update Source Files

```bash
# Update src/index.css with brand variables
# Update src/main.tsx with providers
# Update src/App.tsx with routing
# Update import paths to use aliases
```

### Step 5: Replace Workflows

```bash
# Remove existing workflows
rm -rf .github/workflows/*

# Copy monorepo workflows
cp docs/templates/lovable-workflows/* .github/
```

### Step 6: Test Migration

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Build
pnpm build

# Test
pnpm test
```

## 🧪 Post-Migration Validation

### Essential Checks

- [ ] **Build Success**: `pnpm build` completes without errors
- [ ] **Type Check**: `pnpm type-check` passes
- [ ] **Linting**: `pnpm lint` shows no errors
- [ ] **Tests**: `pnpm test` passes
- [ ] **Dev Server**: `pnpm dev` starts successfully
- [ ] **Path Aliases**: Imports work with `@/` aliases
- [ ] **Brand Colors**: Tailwind colors render correctly

### Functionality Tests

- [ ] **Navigation**: Routing works correctly
- [ ] **Components**: All components render properly
- [ ] **Styling**: Brand colors and styles applied
- [ ] **Responsive**: Mobile and desktop layouts work
- [ ] **Performance**: Build size and load times acceptable

## 🔧 Common Issues & Solutions

### Issue: Path alias not found
```bash
# Solution: Ensure tsconfig.json and vite.config.ts have matching aliases
# Check that paths are correct and files exist
```

### Issue: pnpm install fails
```bash
# Solution: Clear cache and reinstall
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Build fails after migration
```bash
# Solution: Check for missing dependencies
# Update import statements to use new aliases
# Verify all configuration files are syntactically correct
```

### Issue: Styles not applying
```bash
# Solution: Ensure Tailwind config is correct
# Check that CSS variables are defined
# Verify component classes are properly applied
```

## 📚 Additional Resources

- **[Main README](../../../README.md)** - Monorepo overview
- **[Design System](../../../docs/design-system.md)** - Brand guidelines
- **[Component Library](../../../packages/ui/README.md)** - Shared components
- **[Deployment Guide](./DEPLOYMENT.md)** - Deployment instructions

## 🆘 Support

If you encounter issues during migration:

1. **Check this guide** for common solutions
2. **Review existing projects** in `organizations/` for reference
3. **Create an issue** in the monorepo repository
4. **Contact the DevOps team** for assistance

---

*This migration guide ensures Lovable.dev projects work seamlessly within the Alawein Technologies Monorepo while maintaining all functionality.*
