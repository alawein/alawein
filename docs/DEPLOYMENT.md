---
title: 'Deployment Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Deployment Guide

## Platform Deployments

### REPZ (Vercel)

```bash
cd platforms/repz
npm run build:production
npm run vercel:deploy
```

**Environment Variables:**

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

### LiveItIconic (Vercel)

```bash
cd platforms/liveiticonic
npm run build
vercel --prod
```

### Portfolio (GitHub Pages)

Automatically deployed via `.github/workflows/deploy-pages.yml`

### LLMWorks (Custom)

Deployed via `.github/workflows/deploy-llmworks.yml`

## Pre-Deployment Checklist

- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run test:all` passes
- [ ] `npm run build:production` succeeds
- [ ] Environment variables configured

## Rollback Procedures

```bash
# Tag current state
git tag rollback-$(date +%Y%m%d-%H%M%S)

# Revert to previous version
git revert <commit-hash>
git push origin main
```

## Monitoring

- Check deployment logs in platform dashboards
- Monitor error rates and performance metrics
- Verify critical user flows work correctly

## Related Documents

- [Architecture](./architecture/ARCHITECTURE.md)
- [Testing Guide](./testing/TESTING-GUIDE.md)
