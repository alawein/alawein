# Security Quick Fixes

## Immediate Actions (< 1 hour)

### 1. Update Patch Versions (5 min)

```bash
npm update prettier tsx typescript-eslint yaml
```

### 2. Standardize TypeScript (10 min)

```bash
npm install -D typescript@5.8.3
```

### 3. Generate License File (5 min)

```bash
npx license-checker --production --markdown > LICENSES.md
git add LICENSES.md
git commit -m "docs: add license attribution file"
```

### 4. Add Security Headers (30 min)

Create `packages/security-headers/index.ts`:

```typescript
export const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};
```

### 5. Enable Strict TypeScript (15 min)

Update `packages/typescript-config/base.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitAny": true
  }
}
```

### 6. Add CSP Meta Tag (5 min)

Update `index.html` in SaaS projects:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## Verification

```bash
# Check for vulnerabilities
npm audit

# Check outdated packages
npm outdated

# Verify TypeScript
npx turbo type-check

# Test build
npx turbo build
```

## Total Time: ~1 hour
## Impact: High security improvement
