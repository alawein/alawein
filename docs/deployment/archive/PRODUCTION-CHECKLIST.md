---
title: 'Production Deployment Checklist'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Production Deployment Checklist

## Pre-Deployment

### Security

- [ ] Security headers configured in Vite/CDN
- [ ] HTTPS enforced (no HTTP)
- [ ] Environment variables set (no hardcoded secrets)
- [ ] CSP policy tested and working
- [ ] CORS origins restricted (no wildcards)
- [ ] Rate limiting configured
- [ ] MFA enabled for admin accounts

### Code Quality

- [ ] All tests passing (`npx turbo test`)
- [ ] Type checking clean (`npx turbo type-check`)
- [ ] Linting clean (`npx turbo lint`)
- [ ] Bundle size within limits (`npx bundlesize`)
- [ ] No console.log in production build
- [ ] Source maps disabled or secured

### Dependencies

- [ ] No known vulnerabilities (`npm audit`)
- [ ] Dependencies up to date
- [ ] License compliance verified
- [ ] Unused dependencies removed

### Performance

- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Images optimized
- [ ] Code splitting configured
- [ ] CDN configured for static assets

### Monitoring

- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured
- [ ] Uptime monitoring enabled
- [ ] Log aggregation configured
- [ ] Performance monitoring enabled

### Database

- [ ] Migrations applied
- [ ] Backups configured
- [ ] RLS policies tested
- [ ] Indexes optimized
- [ ] Connection pooling configured

### Infrastructure

- [ ] Health check endpoint working
- [ ] Rollback plan documented
- [ ] Disaster recovery tested
- [ ] Scaling limits configured
- [ ] Cost alerts configured

## Deployment

### Build

```bash
# Build all projects
npx turbo build

# Verify build
ls -lh dist/
```

### Deploy

```bash
# Deploy to production
npm run deploy:production

# Verify deployment
curl -I https://your-domain.com/health
```

### Verify

- [ ] Application loads correctly
- [ ] Authentication works
- [ ] API endpoints responding
- [ ] Database connections working
- [ ] Static assets loading
- [ ] Security headers present

## Post-Deployment

### Monitoring

- [ ] Check error rates
- [ ] Monitor performance metrics
- [ ] Verify uptime
- [ ] Check log aggregation
- [ ] Review security alerts

### Testing

- [ ] Smoke tests passing
- [ ] Critical user flows working
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility checked

### Documentation

- [ ] Deployment documented
- [ ] Rollback procedure tested
- [ ] Incident response plan ready
- [ ] Team notified

## Rollback Plan

If issues occur:

1. **Immediate:** Revert to previous version

```bash
git revert HEAD
npm run deploy:production
```

2. **Database:** Restore from backup if needed

```bash
# Restore database
supabase db restore backup-timestamp
```

3. **Notify:** Alert team and users
4. **Investigate:** Review logs and errors
5. **Fix:** Address issues in development
6. **Redeploy:** After thorough testing

## Platform-Specific

### Vercel

- [ ] Environment variables set
- [ ] Build command configured
- [ ] Output directory correct
- [ ] Custom domain configured
- [ ] SSL certificate active

### Netlify

- [ ] Build settings configured
- [ ] Redirects/rewrites set
- [ ] Environment variables set
- [ ] Deploy previews enabled
- [ ] Custom domain configured

### Supabase

- [ ] Database migrations applied
- [ ] Edge Functions deployed
- [ ] Storage buckets configured
- [ ] Auth providers enabled
- [ ] RLS policies active

## Security Headers Verification

```bash
# Check security headers
curl -I https://your-domain.com | grep -E "Strict-Transport-Security|X-Content-Type-Options|X-Frame-Options|Content-Security-Policy"
```

Expected headers:

- Strict-Transport-Security: max-age=31536000
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Content-Security-Policy: default-src 'self'

## Performance Verification

```bash
# Run Lighthouse
npx lighthouse https://your-domain.com --view

# Check bundle sizes
npx bundlesize
```

## Sign-off

- [ ] Technical lead approval
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Team trained on new features

**Deployed by:** ******\_\_\_******  
**Date:** ******\_\_\_******  
**Version:** ******\_\_\_******  
**Approved by:** ******\_\_\_******
