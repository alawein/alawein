# Workspace Setup Guide

## Quick Start

### 1. Install Dependencies (Workspace Mode)

```bash
# Install all workspace dependencies
npm install

# This will install dependencies for:
# - Root workspace
# - All SaaS projects
# - All mobile apps
# - All packages
```

### 2. Start Local Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 3. Build All Projects

```bash
# Build with Turborepo (cached, parallel)
npx turbo build

# Build specific project
npx turbo build --filter=llmworks
```

### 4. Run Tests

```bash
# Run all tests (cached)
npx turbo test

# Run tests for specific project
npx turbo test --filter=llmworks
```

## Workspace Commands

### Development

```bash
# Start dev server for specific project
cd organizations/alawein-technologies-llc/saas/llmworks
npm run dev

# Or use Turborepo
npx turbo dev --filter=llmworks
```

### Adding Dependencies

```bash
# Add to specific workspace
npm install react-query --workspace=llmworks

# Add to root (shared tooling)
npm install -D vitest --workspace=root
```

### Cleaning

```bash
# Clean all build artifacts
npx turbo clean

# Clean node_modules (full reset)
rm -rf node_modules packages/*/node_modules organizations/*/*/*/node_modules
npm install
```

## Turborepo Benefits

- **Caching:** Builds are cached, only rebuild what changed
- **Parallelization:** Run tasks across multiple projects simultaneously
- **Incremental:** Only affected projects are rebuilt
- **Remote Caching:** Share cache across team (optional)

## Docker Services

### PostgreSQL
- **Port:** 5432
- **User:** postgres
- **Password:** postgres
- **Database:** dev

### Redis
- **Port:** 6379

### Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset data
docker-compose down -v
```

## Shared Configurations

### TypeScript

Projects can extend shared configs:

```json
{
  "extends": "@alawein/typescript-config/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite

Projects can use shared Vite config:

```typescript
import { createViteConfig } from '@alawein/vite-config';

export default createViteConfig(__dirname);
```

## Troubleshooting

### Workspace not found
```bash
# Verify workspace configuration
npm ls --workspaces

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Turborepo cache issues
```bash
# Clear Turborepo cache
npx turbo clean
rm -rf .turbo
```

### Docker issues
```bash
# Reset Docker services
docker-compose down -v
docker-compose up -d
```

## Performance Tips

1. **Use Turborepo for all builds:** `npx turbo build` instead of `npm run build`
2. **Leverage caching:** Don't clean unless necessary
3. **Filter tasks:** Use `--filter` to run tasks for specific projects
4. **Parallel execution:** Turborepo automatically parallelizes independent tasks

## Next Steps

- Review [Architecture Review](./docs/architecture/ARCHITECTURE-REVIEW-2025.md)
- Check [Implementation Status](./docs/architecture/IMPLEMENTATION-STATUS.md)
- See [Quick Wins](./docs/architecture/QUICK-WINS.md) for more improvements
