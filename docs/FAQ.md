---
title: 'Frequently Asked Questions'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Frequently Asked Questions

## Getting Started

### Q: How do I set up the development environment?

A: Follow the [Quick Start Guide](./QUICK_START.md) for step-by-step
instructions.

### Q: Which platform should I work on first?

A: Start with the [Portfolio platform](../platforms/portfolio/) as it's the
simplest, then move to [REPZ](../platforms/repz/) or
[LiveItIconic](../platforms/liveiticonic/).

### Q: How do I run tests?

A: Use `npm test` for all tests or see the
[Testing Guide](./testing/TESTING-GUIDE.md) for detailed instructions.

## Development

### Q: How do I add a new platform?

A: See the [Architecture Guide](./architecture/ARCHITECTURE.md) for platform
creation steps.

### Q: What's the difference between platforms and packages?

A: Platforms are user-facing applications, packages are shared libraries used
across platforms.

### Q: How do I deploy changes?

A: See the [Deployment Guide](./DEPLOYMENT.md) for platform-specific deployment
instructions.

## Troubleshooting

### Q: Tests are failing after I pulled latest changes

A: Run `npm install` and `npm run type-check` to ensure dependencies and types
are up to date.

### Q: Port 8080 is already in use

A: Use `npx kill-port 8080` or change the port in your platform's package.json.

### Q: Build errors with TypeScript

A: Run `npm run type-check` to see detailed type errors and fix them.

## Architecture

### Q: How are the platforms organized?

A: Each platform is in `platforms/` with its own package.json, while shared code
is in `packages/`.

### Q: What's the difference between src/ and docs/src/?

A: `src/` is the main application code, `docs/src/` is documentation-specific
components.

### Q: How do APIs work?

A: Each platform has its own Supabase Edge Function. See
[API Reference](./api/API_REFERENCE.md).

## Need More Help?

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review [Architecture Documentation](./architecture/ARCHITECTURE.md)
- Ask in team channels
