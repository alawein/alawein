---
title: 'Security Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Security Guide

## Authentication

All platforms use Supabase Auth with JWT tokens.

### Row Level Security (RLS)

- Enabled on all user data tables
- Users can only access their own data
- Admin roles have elevated permissions

## API Security

### Headers

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};
```

### Rate Limiting

- Read operations: 100 requests/minute
- Write operations: 20 requests/minute
- Auth operations: 10 requests/minute

## Environment Variables

### Required

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side operations (keep secret)

### Optional

- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key (server-side only)

## Security Checklist

### Development

- [ ] No secrets in code or logs
- [ ] Environment variables properly configured
- [ ] Dependencies regularly updated
- [ ] Security headers implemented

### Deployment

- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Rate limiting enabled
- [ ] Error messages don't leak sensitive info

## Incident Response

1. **Identify** - Detect and assess the security incident
2. **Contain** - Limit the scope and impact
3. **Investigate** - Determine root cause
4. **Remediate** - Fix vulnerabilities
5. **Document** - Record lessons learned

## Security Scanning

```bash
# Dependency audit
npm audit --audit-level=moderate

# Security check script
npm run security:check
```

## Reporting Security Issues

Email security concerns to: security@alawein.com

## Related Documents

- [API Reference](./api/API_REFERENCE.md)
- [Architecture](./architecture/ARCHITECTURE.md)
