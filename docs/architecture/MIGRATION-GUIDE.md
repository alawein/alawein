---
title: 'Migration Guide - Shared Configurations'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Migration Guide - Shared Configurations

## Overview

This guide helps migrate existing projects to use shared workspace
configurations.

## Step 1: Update TypeScript Config

### Before

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "jsx": "react-jsx"
    // ... many more options
  }
}
```

### After

```json
{
  "extends": "../../../../../packages/typescript-config/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Step 2: Update Vite Config

### Before

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ... many options
});
```

### After

```typescript
import { createViteConfig } from '@alawein/vite-config';

export default createViteConfig(__dirname);
```

## Step 3: Add Error Boundary

```typescript
import { ErrorBoundary } from '@alawein/shared-ui';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

## Step 4: Add Monitoring

```typescript
import { initSentry, captureError } from '@alawein/monitoring';

initSentry({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});

// In error boundary
onError={(error) => captureError(error)}
```

## Step 5: Update Package Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build && vite-bundle-visualizer"
  }
}
```

## Step 6: Reinstall Dependencies

```bash
# From workspace root
npm install

# Verify workspace links
npm ls --workspaces
```

## Verification

```bash
# Type check
npm run type-check

# Build
npx turbo build --filter=your-project

# Test
npx turbo test --filter=your-project
```

## Rollback

If issues occur:

1. Restore original config files from git
2. Run `npm install` in project directory
3. Report issue in GitHub

## Benefits After Migration

- ✅ Consistent TypeScript settings
- ✅ Reduced configuration duplication
- ✅ Faster builds with Turborepo
- ✅ Shared dependency management
- ✅ Bundle size monitoring
- ✅ Error tracking ready
- ✅ Easier maintenance

## Project Checklist

- [ ] TypeScript config updated
- [ ] Vite config updated
- [ ] Error boundary added
- [ ] Monitoring initialized
- [ ] Scripts updated
- [ ] Dependencies reinstalled
- [ ] Build verified
- [ ] Tests passing
