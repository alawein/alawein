# Configuration Guide

**Alawein Technologies Monorepo**  
**Version**: 1.0.0  
**Last Updated**: 2024  

---

## Overview

This guide provides comprehensive documentation for all configuration packages and files in the Alawein Technologies monorepo. Our configuration system is designed to provide consistency, maintainability, and ease of use across all projects.

---

## Table of Contents

1. [Configuration Packages](#configuration-packages)
2. [Root Configurations](#root-configurations)
3. [Usage Guide](#usage-guide)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)
6. [Migration Guide](#migration-guide)

---

## Configuration Packages

We maintain 4 centralized configuration packages that can be shared across all projects in the monorepo.

### 1. ESLint Configuration (`@alawein/eslint-config`)

**Purpose**: Shared ESLint rules for code quality and consistency

**Location**: `packages/eslint-config/`

**Installation**:
```bash
npm install --save-dev @alawein/eslint-config
```

**Usage**:
```javascript
// eslint.config.js
import alaweinConfig from '@alawein/eslint-config';

export default [
  ...alaweinConfig,
  // Your custom rules here
];
```

**Features**:
- TypeScript support
- React rules
- Import sorting
- Accessibility checks
- Best practices enforcement

**Customization**:
```javascript
export default [
  ...alaweinConfig,
  {
    rules: {
      // Override specific rules
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
```

---

### 2. TypeScript Configuration (`@alawein/typescript-config`)

**Purpose**: Shared TypeScript compiler configurations

**Location**: `packages/typescript-config/`

**Available Configs**:
- `base.json` - Base configuration for all projects
- `node.json` - Node.js specific configuration
- `react.json` - React specific configuration

**Installation**:
```bash
npm install --save-dev @alawein/typescript-config
```

**Usage**:

**For Node.js projects**:
```json
{
  "extends": "@alawein/typescript-config/node.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

**For React projects**:
```json
{
  "extends": "@alawein/typescript-config/react.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

**For Library projects**:
```json
{
  "extends": "@alawein/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

**Configuration Details**:

**base.json**:
- Strict mode enabled
- ES2022 target
- Module resolution: bundler
- Source maps enabled
- Declaration files generated

**node.json** (extends base):
- Node.js module resolution
- CommonJS module system
- Node.js type definitions

**react.json** (extends base):
- JSX support (react-jsx)
- DOM type definitions
- React type definitions

---

### 3. Prettier Configuration (`@alawein/prettier-config`)

**Purpose**: Shared code formatting rules

**Location**: `packages/prettier-config/`

**Installation**:
```bash
npm install --save-dev @alawein/prettier-config
```

**Usage**:

**package.json**:
```json
{
  "prettier": "@alawein/prettier-config"
}
```

**Or .prettierrc.json**:
```json
"@alawein/prettier-config"
```

**With overrides**:
```json
{
  "...": "@alawein/prettier-config",
  "printWidth": 100,
  "tabWidth": 4
}
```

**Configuration Details**:
- Print width: 80 characters
- Tab width: 2 spaces
- Semicolons: required
- Single quotes: true
- Trailing commas: es5
- Arrow function parentheses: always

---

### 4. Vite Configuration (`@alawein/vite-config`)

**Purpose**: Shared Vite build configuration

**Location**: `packages/vite-config/`

**Installation**:
```bash
npm install --save-dev @alawein/vite-config
```

**Usage**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import baseConfig from '@alawein/vite-config/base';

export default defineConfig({
  ...baseConfig,
  // Your custom configuration
  server: {
    port: 3000,
  },
});
```

**Features**:
- React support
- TypeScript support
- Path aliases configured
- Optimized build settings
- Development server configuration

---

## Root Configurations

### Build & Development

#### 1. tsconfig.json (Root)
**Purpose**: Root TypeScript configuration for the monorepo

**Usage**: Automatically used by TypeScript compiler

**Key Settings**:
- Composite project references
- Path mappings for packages
- Strict mode enabled

**Example**:
```json
{
  "extends": "@alawein/typescript-config/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@alawein/*": ["packages/*/src"]
    }
  },
  "references": [
    { "path": "./packages/ui" },
    { "path": "./packages/utils" }
  ]
}
```

#### 2. turbo.json
**Purpose**: Turborepo configuration for monorepo task orchestration

**Key Features**:
- Task pipelines
- Caching configuration
- Dependency management

**Example**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

#### 3. vitest.config.ts
**Purpose**: Vitest test runner configuration

**Usage**: Automatically used by Vitest

**Example**:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

#### 4. jest.config.js
**Purpose**: Jest test runner configuration (legacy)

**Note**: Consider migrating to Vitest for better TypeScript support

#### 5. cypress.config.ts
**Purpose**: Cypress E2E test configuration

**Usage**: Automatically used by Cypress

---

### Code Quality

#### 1. eslint.config.js (Root)
**Purpose**: Root ESLint configuration

**Best Practice**: Extend from `@alawein/eslint-config`

**Example**:
```javascript
import alaweinConfig from '@alawein/eslint-config';

export default [
  ...alaweinConfig,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
```

#### 2. .prettierrc.json (Root)
**Purpose**: Root Prettier configuration

**Best Practice**: Reference `@alawein/prettier-config`

**Example**:
```json
"@alawein/prettier-config"
```

#### 3. .prettierignore
**Purpose**: Files to ignore for Prettier formatting

**Example**:
```
dist/
node_modules/
.next/
coverage/
```

---

### Docker & Deployment

#### 1. docker-compose.yml
**Purpose**: Docker Compose configuration for local development

**Usage**:
```bash
docker-compose up
```

#### 2. Dockerfile
**Purpose**: Docker image configuration for deployment

**Usage**:
```bash
docker build -t alawein-app .
```

#### 3. mkdocs.yaml
**Purpose**: MkDocs documentation site configuration

**Usage**:
```bash
mkdocs serve
```

---

### Editor & Git

#### 1. .editorconfig
**Purpose**: Editor configuration for consistent coding styles

**Supported Editors**: VS Code, IntelliJ, Sublime Text, etc.

**Key Settings**:
- Indent style: space
- Indent size: 2
- End of line: lf
- Charset: utf-8

#### 2. .pre-commit-config.yaml
**Purpose**: Pre-commit hooks for code quality

**Hooks**:
- Trailing whitespace removal
- End of file fixer
- YAML validation
- Large file check

**Usage**:
```bash
pre-commit install
```

---

## Usage Guide

### Setting Up a New Package

1. **Create package directory**:
```bash
mkdir packages/my-package
cd packages/my-package
```

2. **Initialize package**:
```bash
npm init -y
```

3. **Install configuration packages**:
```bash
npm install --save-dev @alawein/eslint-config @alawein/typescript-config @alawein/prettier-config
```

4. **Create tsconfig.json**:
```json
{
  "extends": "@alawein/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

5. **Create eslint.config.js**:
```javascript
import alaweinConfig from '@alawein/eslint-config';

export default alaweinConfig;
```

6. **Add to package.json**:
```json
{
  "prettier": "@alawein/prettier-config",
  "scripts": {
    "build": "tsc",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

---

### Migrating Existing Package

1. **Install configuration packages**:
```bash
npm install --save-dev @alawein/eslint-config @alawein/typescript-config @alawein/prettier-config
```

2. **Update tsconfig.json**:
```json
{
  "extends": "@alawein/typescript-config/base.json",
  // Keep your existing compilerOptions
}
```

3. **Update eslint configuration**:
```javascript
import alaweinConfig from '@alawein/eslint-config';

export default [
  ...alaweinConfig,
  // Keep your existing custom rules
];
```

4. **Update prettier configuration**:
```json
{
  "prettier": "@alawein/prettier-config"
}
```

5. **Test the changes**:
```bash
npm run build
npm run lint
npm run format
```

---

## Best Practices

### 1. Always Extend Base Configurations
✅ **Do**:
```json
{
  "extends": "@alawein/typescript-config/base.json"
}
```

❌ **Don't**:
```json
{
  "compilerOptions": {
    // Duplicating all base settings
  }
}
```

### 2. Minimize Custom Overrides
Only override when absolutely necessary. Document why you're overriding.

✅ **Do**:
```javascript
export default [
  ...alaweinConfig,
  {
    // Override for specific project requirement
    rules: {
      'no-console': 'off', // Needed for CLI tool
    },
  },
];
```

### 3. Keep Configurations DRY
Use configuration packages instead of duplicating settings.

### 4. Document Custom Configurations
Always add comments explaining custom configurations.

### 5. Test Configuration Changes
Run full build and test suite after configuration changes.

---

## Troubleshooting

### TypeScript Errors

**Problem**: "Cannot find module '@alawein/typescript-config'"

**Solution**:
```bash
npm install --save-dev @alawein/typescript-config
```

**Problem**: "Module resolution errors"

**Solution**: Check your `tsconfig.json` extends path:
```json
{
  "extends": "@alawein/typescript-config/base.json"
}
```

### ESLint Errors

**Problem**: "Failed to load config"

**Solution**:
```bash
npm install --save-dev @alawein/eslint-config
```

**Problem**: "Parsing error"

**Solution**: Ensure TypeScript parser is installed:
```bash
npm install --save-dev @typescript-eslint/parser
```

### Prettier Issues

**Problem**: "Config not found"

**Solution**: Add to package.json:
```json
{
  "prettier": "@alawein/prettier-config"
}
```

### Build Issues

**Problem**: "Build fails after config update"

**Solution**:
1. Clear build cache: `rm -rf dist/`
2. Clear node_modules: `rm -rf node_modules/`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

---

## Migration Guide

### From Custom Configs to Centralized Configs

#### Step 1: Backup Current Configuration
```bash
cp tsconfig.json tsconfig.json.backup
cp eslint.config.js eslint.config.js.backup
```

#### Step 2: Install Configuration Packages
```bash
npm install --save-dev @alawein/eslint-config @alawein/typescript-config @alawein/prettier-config
```

#### Step 3: Update Configurations
Replace your configurations with extends from packages.

#### Step 4: Test Thoroughly
```bash
npm run build
npm run lint
npm run test
```

#### Step 5: Remove Backups
Once everything works:
```bash
rm *.backup
```

---

## Configuration Package Development

### Updating Configuration Packages

1. **Make changes in package**:
```bash
cd packages/eslint-config
# Edit configuration files
```

2. **Version bump**:
```bash
npm version patch
```

3. **Publish** (if using private registry):
```bash
npm publish
```

4. **Update consumers**:
```bash
npm update @alawein/eslint-config
```

---

## Support

### Getting Help

- **Documentation**: Check this guide first
- **Issues**: Create issue in monorepo
- **Questions**: Ask in team chat

### Contributing

To improve configurations:
1. Create feature branch
2. Make changes to config package
3. Test across multiple packages
4. Submit pull request
5. Document changes

---

## Appendix

### Configuration Package Versions

| Package | Version | Last Updated |
|---------|---------|--------------|
| @alawein/eslint-config | 1.0.0 | 2024 |
| @alawein/typescript-config | 1.0.0 | 2024 |
| @alawein/prettier-config | 1.0.0 | 2024 |
| @alawein/vite-config | 1.0.0 | 2024 |

### Related Documentation

- [Architecture Guide](../ARCHITECTURE.md)
- [Development Guide](../DEVELOPMENT.md)
- [Package Development](../guides/PACKAGE-DEVELOPMENT.md)
- [Testing Guide](../guides/TESTING-GUIDE.md)

---

**Last Updated**: 2024  
**Maintained By**: Alawein Technologies DevOps Team  
**Version**: 1.0.0
