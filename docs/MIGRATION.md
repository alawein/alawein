---
title: 'Migration Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Migration Guide

How to migrate between major versions of the Alawein platforms.

## Overview

This guide covers migration procedures for breaking changes between major
versions.

## Version Migration Matrix

| From | To  | Difficulty | Guide                   |
| ---- | --- | ---------- | ----------------------- |
| 0.x  | 1.0 | Medium     | [0.x to 1.0](#0x-to-10) |

## 0.x to 1.0

### Breaking Changes

#### UI Package Consolidation

The UI packages have been consolidated:

```typescript
// Before (0.x)
import { Button } from '@monorepo/ui-components';
import { ErrorBoundary } from '@monorepo/shared-ui';

// After (1.0)
import { Button, ErrorBoundary } from '@monorepo/ui';
```

#### Button Variant Changes

```typescript
// Before (0.x)
<Button variant="default">Click</Button>

// After (1.0)
<Button variant="primary">Click</Button>
```

#### Size Prop Changes

```typescript
// Before (0.x)
<Button size="default">Click</Button>

// After (1.0)
<Button size="md">Click</Button>
```

### Migration Steps

1. **Update imports**

   Find and replace across your codebase:

   ```bash
   # Using sed (Unix)
   find . -name "*.tsx" -exec sed -i 's/@monorepo\/ui-components/@monorepo\/ui/g' {} +
   find . -name "*.tsx" -exec sed -i 's/@monorepo\/shared-ui/@monorepo\/ui/g' {} +
   ```

2. **Update variant props**

   ```bash
   find . -name "*.tsx" -exec sed -i 's/variant="default"/variant="primary"/g' {} +
   ```

3. **Update size props**

   ```bash
   find . -name "*.tsx" -exec sed -i 's/size="default"/size="md"/g' {} +
   ```

4. **Run type check**

   ```bash
   npm run type-check
   ```

5. **Run tests**

   ```bash
   npm run test:run
   ```

### Codemods

We provide automated codemods for common migrations:

```bash
# Run all 1.0 migrations
npx jscodeshift -t ./codemods/v1.0/index.ts src/

# Run specific migration
npx jscodeshift -t ./codemods/v1.0/ui-imports.ts src/
```

## API Changes

### Authentication

```typescript
// Before (0.x)
const user = await getUser();

// After (1.0)
const {
  data: { user },
} = await supabase.auth.getUser();
```

### Data Fetching

```typescript
// Before (0.x) - custom hooks
const { data, loading } = useData('/api/items');

// After (1.0) - React Query
const { data, isLoading } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
});
```

## Database Migrations

### Running Migrations

```bash
# Check pending migrations
npx supabase migration list

# Apply migrations
npx supabase db push

# Rollback last migration
npx supabase migration repair --status reverted <id>
```

### Schema Changes in 1.0

```sql
-- New columns added
ALTER TABLE simulations ADD COLUMN metadata JSONB;
ALTER TABLE workouts ADD COLUMN template_id UUID;

-- Renamed columns
ALTER TABLE users RENAME COLUMN name TO display_name;
```

## Configuration Changes

### Environment Variables

```bash
# Before (0.x)
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_KEY=...

# After (1.0)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Build Configuration

```typescript
// Before (0.x) - Create React App
// react-scripts build

// After (1.0) - Vite
// vite build
```

## Deprecation Timeline

| Feature                   | Deprecated | Removed | Alternative         |
| ------------------------- | ---------- | ------- | ------------------- |
| `@monorepo/ui-components` | 0.9        | 1.0     | `@monorepo/ui`      |
| `@monorepo/shared-ui`     | 0.9        | 1.0     | `@monorepo/ui`      |
| `variant="default"`       | 0.9        | 2.0     | `variant="primary"` |
| `useOldAuth`              | 1.0        | 2.0     | `useAuth`           |

## Troubleshooting

### Common Issues

**Import errors after migration**

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

**Type errors**

```bash
# Rebuild TypeScript
npm run type-check
```

**Test failures**

Check for:

- Updated mock implementations
- Changed API responses
- New required props

### Getting Help

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Search [GitHub Issues](https://github.com/alawein/alawein/issues)
- Contact: meshal@berkeley.edu

## Related Documents

- [CHANGELOG.md](../CHANGELOG.md) - Version history
- [QUICK_START.md](./QUICK_START.md) - Getting started
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
