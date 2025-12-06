# Packages

Shared libraries and utilities used across applications.

## Structure

Following the Turborepo/Nx pattern:

| Package | Purpose |
|---------|---------|
| `ui/` | Shared React/UI components |
| `config/` | Shared ESLint, TypeScript, Prettier configs |
| `utils/` | Shared utility functions |
| `types/` | Shared TypeScript type definitions |

## Usage

Import packages using workspace protocol:

```json
{
  "dependencies": {
    "@monorepo/ui": "workspace:*",
    "@monorepo/utils": "workspace:*"
  }
}
```

## Adding a New Package

1. Create directory under `packages/`
2. Add `package.json` with proper name
3. Export from `index.ts`
4. Add to workspace configuration
