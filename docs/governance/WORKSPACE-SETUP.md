# Workspace Setup Guide

This monorepo uses **npm workspaces** to manage multiple packages and applications.

## Structure

```
GitHub/
├── package.json              # Root workspace configuration
├── package-lock.json         # Root lockfile
├── apps/                     # Deployable applications
│   ├── attributa/           # ✅ In workspace
│   ├── llmworks/            # ✅ In workspace
│   ├── portfolio/           # ✅ In workspace
│   ├── qmlab/               # ✅ In workspace
│   ├── liveiticonic/        # ❌ Excluded (dependency conflicts)
│   └── simcore/             # ❌ Excluded (dependency conflicts)
├── packages/                 # Shared libraries
│   ├── ui/                  # @monorepo/ui
│   ├── config/              # @monorepo/config
│   ├── utils/               # @monorepo/utils
│   └── types/               # @monorepo/types
├── tools/                    # Development tools
└── automation/               # Automation tools
    └── typescript/          # TypeScript CLI
```

## Installing Dependencies

```bash
# Install all workspace dependencies
npm install

# Install for specific workspace
npm install --workspace=packages/utils

# Add dependency to specific package
npm install lodash --workspace=packages/utils

# Add dev dependency to root
npm install --save-dev prettier
```

## Running Scripts

```bash
# Run script in specific workspace
npm run build --workspace=packages/types

# Run script in all workspaces
npm run build --workspaces

# Use workspace-level scripts (recommended)
npm run build:all    # Build all packages
npm run test:all     # Test all packages
npm run lint:all     # Lint all packages
```

## Adding New Packages

### 1. Create Package Directory

```bash
mkdir packages/my-package
cd packages/my-package
```

### 2. Create package.json

```json
{
  "name": "@monorepo/my-package",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest"
  }
}
```

### 3. Add to Workspace

The `packages/*` wildcard in root package.json automatically includes it.

## Importing Between Packages

Use the workspace protocol:

```json
// packages/utils/package.json
{
  "dependencies": {
    "@monorepo/types": "workspace:*"
  }
}
```

```typescript
// packages/utils/src/index.ts
import { ApiResponse } from '@monorepo/types';
```

## Migrating Existing Apps

### Apps Currently Excluded

- `organizations/live-it-iconic-llc/ecommerce/liveiticonic` - Storybook version conflicts
- `organizations/alawein-technologies-llc/mobile-apps/simcore` - Complex dependency tree

### Migration Steps

1. **Resolve dependency conflicts** in the app's package.json
2. **Update package name** to use @monorepo prefix (optional)
3. **Add to workspace** in root package.json
4. **Test** with `npm install --legacy-peer-deps`

Example migration:

```diff
// Before
"workspaces": [
  "organizations/alawein-technologies-llc/saas/attributa",
  "organizations/alawein-technologies-llc/saas/llmworks",
  "organizations/alawein-technologies-llc/saas/portfolio",
  "organizations/alawein-technologies-llc/saas/qmlab",
  "packages/*"
]

// After
"workspaces": [
  "organizations/alawein-technologies-llc/saas/attributa",
  "organizations/alawein-technologies-llc/saas/llmworks",
  "organizations/alawein-technologies-llc/saas/portfolio",
  "organizations/alawein-technologies-llc/saas/qmlab",
+ "organizations/live-it-iconic-llc/ecommerce/liveiticonic",
  "packages/*"
]
```

## Workspace Scripts

| Script      | Purpose               | Scope          |
| ----------- | --------------------- | -------------- |
| `build:all` | Build all packages    | All workspaces |
| `test:all`  | Test all packages     | All workspaces |
| `lint:all`  | Lint all packages     | All workspaces |
| `dev:all`   | Start all dev servers | Apps only      |

## Best Practices

1. **Use workspace protocol** for internal dependencies: `"@monorepo/ui": "workspace:*"`
2. **Keep packages focused** - single responsibility per package
3. **Version together** - Use `npm version` at root to update all packages
4. **Test in isolation** - Each package should have its own tests
5. **Document exports** - Clear index.ts files for each package

## Troubleshooting

### Dependency Conflicts

```bash
# Use legacy peer deps for initial setup
npm install --legacy-peer-deps

# Check for conflicts
npm ls --workspaces
```

### Package Not Found

```bash
# Verify workspace configuration
npm ls --workspaces --depth=0

# Reinstall if needed
rm -rf node_modules package-lock.json
npm install
```

### Build Issues

```bash
# Clean build
npm run clean && npm run build:all

# Check TypeScript project references
npx tsc --build --verbose
```

## Next Steps

1. **Add Turborepo** for build orchestration (optional)
2. **Configure TypeScript project references** for faster builds
3. **Set up CI/CD** to test all workspaces
4. **Extract shared code** from apps into packages
