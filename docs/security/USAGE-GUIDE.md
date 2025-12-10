---
title: 'Security Implementation Usage Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Security Implementation Usage Guide

## Quick Start

### 1. Use Security Headers in Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { getSecurityHeaders } from '@alawein/security-headers';

export default defineConfig({
  server: {
    headers: getSecurityHeaders('development'),
  },
  preview: {
    headers: getSecurityHeaders('production'),
  },
});
```

### 2. Use Security Config

```typescript
// src/config/security.config.ts
import { securityConfig, getResponseHeaders } from './config/security.config';

// Get configured headers
const headers = getResponseHeaders();

// Use in fetch
fetch(url, { headers });
```

### 3. Use Secure Fetch Wrapper

```typescript
// src/lib/security.ts
import { secureFetch } from '@/lib/security';

// Automatically applies security headers
const response = await secureFetch('/api/data');
```

## Integration Examples

### React Component with Security

```typescript
import { useEffect } from 'react';
import { secureFetch } from '@/lib/security';

export function SecureComponent() {
  useEffect(() => {
    secureFetch('/api/data')
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return <div>Secure Component</div>;
}
```

### Supabase with Security Headers

```typescript
import { createClient } from '@supabase/supabase-js';
import { getSecurityHeaders } from '@alawein/security-headers';

const supabase = createClient(url, key, {
  global: {
    headers: getSecurityHeaders('production'),
  },
});
```

### Express/Node.js Middleware

```typescript
import express from 'express';
import { securityHeaders } from '@alawein/security-headers';

const app = express();

app.use((req, res, next) => {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  next();
});
```

## Environment Variables

```bash
# .env
VITE_ENABLE_CSP=true
VITE_ENABLE_HSTS=true
VITE_ENABLE_FRAME_PROTECTION=true
```

## Testing

```bash
# Run security check
npm run security:check

# Test headers locally
curl -I http://localhost:8080

# Verify CSP
curl -I http://localhost:8080 | grep Content-Security-Policy
```

## Production Deployment

### Vercel

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Netlify

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
```

### Supabase Edge Functions

```typescript
// supabase/functions/api/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import { securityHeaders } from '@alawein/security-headers';

serve((req) => {
  return new Response('OK', {
    headers: securityHeaders,
  });
});
```

## Troubleshooting

### CSP Blocking Resources

If CSP blocks legitimate resources, update the policy:

```typescript
// packages/security-headers/index.ts
'Content-Security-Policy': "default-src 'self'; img-src 'self' https://trusted-cdn.com"
```

### HSTS in Development

HSTS is automatically disabled in development mode.

### TypeScript Errors

Ensure strict mode is enabled:

```json
// tsconfig.json
{
  "extends": "@alawein/typescript-config/react.json"
}
```

## Best Practices

1. **Always use HTTPS in production**
2. **Test CSP before deploying**
3. **Monitor security headers with tools**
4. **Keep dependencies updated**
5. **Run security checks regularly**

## Resources

- [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [Security Headers Checker](https://securityheaders.com/)
