---
title: 'Troubleshooting Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### Node Version Mismatch

```bash
# Check current version
node --version

# Use correct version with nvm
nvm use 20
```

### Dependencies Out of Sync

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Permission Errors

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Or use nvm to avoid permission issues
```

## Development Issues

### Port Already in Use

```bash
# Kill process on specific port
npx kill-port 8080
npx kill-port 5173

# Or find and kill manually
lsof -ti:8080 | xargs kill -9
```

### TypeScript Errors

```bash
# Check types
npm run type-check

# Rebuild TypeScript
npm run build

# Clear TypeScript cache
rm -rf .tsbuildinfo
```

### Test Failures

```bash
# Run specific test
npm test -- tests/specific.test.ts

# Clear test cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose
```

## Build Issues

### Vite Build Failures

```bash
# Clear Vite cache
rm -rf .vite node_modules/.vite

# Rebuild
npm run build
```

### Turbo Cache Issues

```bash
# Clear Turbo cache
npx turbo clean
rm -rf .turbo

# Force rebuild
npx turbo build --force
```

### Memory Issues

```bash
# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## Platform-Specific Issues

### REPZ Platform

- **Database connection**: Check Supabase environment variables
- **Stripe integration**: Verify API keys in `.env`

### LiveItIconic Platform

- **Image uploads**: Check file size limits and formats
- **Payment processing**: Verify Stripe webhook endpoints

### SimCore Platform

- **Simulation errors**: Check WebGL support in browser
- **Performance**: Enable hardware acceleration

## Environment Issues

### Environment Variables

```bash
# Copy example file
cp .env.example .env

# Check required variables
grep -v '^#' .env.example
```

### Database Issues

```bash
# Reset Supabase local instance
supabase db reset

# Check connection
supabase status
```

### API Issues

```bash
# Check Supabase functions
supabase functions list

# View function logs
supabase functions logs <function-name>
```

## Performance Issues

### Slow Development Server

```bash
# Disable source maps temporarily
export GENERATE_SOURCEMAP=false

# Use faster build tool
npm run dev -- --host
```

### Large Bundle Size

```bash
# Analyze bundle
npm run analyze:bundle

# Check for duplicate dependencies
npm ls --depth=0
```

## Git Issues

### Merge Conflicts

```bash
# Reset to clean state
git stash
git pull origin main
git stash pop
```

### Pre-commit Hook Failures

```bash
# Skip hooks temporarily (not recommended)
git commit --no-verify

# Fix linting issues
npm run lint:fix
npm run format
```

## Getting Help

1. **Check logs**: Look at console output for specific error messages
2. **Search issues**: Check GitHub issues for similar problems
3. **Ask team**: Use team communication channels
4. **Documentation**: Review relevant guides in `docs/`

## Common Error Messages

### "Module not found"

- Run `npm install`
- Check import paths
- Verify file exists

### "Port 8080 is already in use"

- Use `npx kill-port 8080`
- Change port in package.json

### "Permission denied"

- Check file permissions
- Use `sudo` if necessary (not recommended for npm)

### "Out of memory"

- Increase Node memory limit
- Close other applications
- Use `--max-old-space-size=4096`

## Still Need Help?

- Review [FAQ](./FAQ.md)
- Check [Architecture Documentation](./architecture/ARCHITECTURE.md)
- Contact team leads
