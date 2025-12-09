# Security Checklist (85+ Items)

> Comprehensive security checklist derived from the Universal Lovable
> Integration Framework. Use this checklist before deploying any platform to
> production.

## Quick Status

| Category             | Items | Status         |
| -------------------- | ----- | -------------- |
| Authentication       | 15    | 🔄 In Progress |
| Database/RLS         | 12    | 🔄 In Progress |
| API Security         | 14    | 🔄 In Progress |
| Frontend Security    | 10    | 🔄 In Progress |
| Infrastructure       | 12    | 🔄 In Progress |
| Secrets Management   | 8     | 🔄 In Progress |
| Monitoring & Logging | 8     | 🔄 In Progress |
| Compliance           | 6     | 🔄 In Progress |

---

## 1. Authentication Security (15 items)

### JWT & Token Security

- [ ] Use RS256 (asymmetric) instead of HS256 for JWT signing
- [ ] Set appropriate token expiration (access: 15min, refresh: 7 days)
- [ ] Implement refresh token rotation
- [ ] Store refresh tokens securely (httpOnly cookies or secure storage)
- [ ] Validate JWT signature on every request

### Password Security

- [ ] Enforce strong password policy (8+ chars, uppercase, lowercase, number,
      special)
- [ ] Use bcrypt/argon2 with appropriate cost factor (12+)
- [ ] Implement account lockout after failed attempts (5 attempts, 15min
      lockout)
- [ ] Rate limit authentication endpoints (10 req/min per IP)
- [ ] Implement secure password reset flow with expiring tokens

### Session Security

- [ ] Implement session timeout (30 min inactivity)
- [ ] Allow users to view and revoke active sessions
- [ ] Invalidate all sessions on password change
- [ ] Use secure session identifiers (UUID v4)
- [ ] Implement MFA/2FA for sensitive accounts

---

## 2. Database & RLS Security (12 items)

### Row Level Security

- [ ] Enable RLS on ALL tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- [ ] Create policies for SELECT, INSERT, UPDATE, DELETE separately
- [ ] Use `auth.uid()` for user-owned data policies
- [ ] Implement tenant isolation for multi-tenant apps
- [ ] Test RLS policies with different user contexts

### Database Security

- [ ] Use `private` schema for internal tables
- [ ] Never expose service role key to frontend
- [ ] Use parameterized queries (no string concatenation)
- [ ] Implement database connection pooling
- [ ] Set up database backups (daily, 30-day retention)
- [ ] Use SSL for database connections
- [ ] Audit sensitive data access

---

## 3. API Security (14 items)

### Request Validation

- [ ] Validate all inputs with Zod schemas
- [ ] Sanitize user inputs (XSS prevention)
- [ ] Implement request size limits (1MB default)
- [ ] Validate Content-Type headers
- [ ] Reject unexpected fields in requests

### Rate Limiting & Protection

- [ ] Implement rate limiting (100 req/min per user)
- [ ] Add IP-based rate limiting for unauthenticated endpoints
- [ ] Implement request throttling for expensive operations
- [ ] Add CAPTCHA for public forms
- [ ] Implement webhook signature verification (Stripe, etc.)

### Response Security

- [ ] Never expose internal error details in production
- [ ] Use consistent error response format
- [ ] Implement request ID tracking
- [ ] Log all API errors with context

---

## 4. Frontend Security (10 items)

### Headers & CSP

- [ ] Set Content-Security-Policy header
- [ ] Set X-Frame-Options: DENY
- [ ] Set X-Content-Type-Options: nosniff
- [ ] Set Referrer-Policy: strict-origin-when-cross-origin
- [ ] Enable HSTS (Strict-Transport-Security)

### Client-Side Security

- [ ] Sanitize HTML content (DOMPurify)
- [ ] Use httpOnly cookies for sensitive tokens
- [ ] Implement CSRF protection
- [ ] Validate redirect URLs (prevent open redirects)
- [ ] Use SRI (Subresource Integrity) for external scripts

---

## 5. Infrastructure Security (12 items)

### CORS Configuration

- [ ] Whitelist specific origins (no wildcard in production)
- [ ] Validate Origin header on server
- [ ] Set appropriate Access-Control-Allow-Methods
- [ ] Limit Access-Control-Allow-Headers
- [ ] Set Access-Control-Max-Age for preflight caching

### Deployment Security

- [ ] Use HTTPS everywhere (TLS 1.3)
- [ ] Configure secure DNS (DNSSEC)
- [ ] Implement DDoS protection (Cloudflare, etc.)
- [ ] Use WAF (Web Application Firewall)
- [ ] Regular security scanning (OWASP ZAP, etc.)
- [ ] Implement blue-green deployments
- [ ] Set up health checks and auto-recovery

---

## 6. Secrets Management (8 items)

- [ ] Never commit secrets to version control
- [ ] Use environment variables for all secrets
- [ ] Rotate API keys regularly (90 days)
- [ ] Use different secrets per environment
- [ ] Implement secret scanning in CI/CD
- [ ] Use vault/secrets manager for production
- [ ] Audit secret access
- [ ] Document secret rotation procedures

---

## 7. Monitoring & Logging (8 items)

- [ ] Log authentication events (login, logout, failed attempts)
- [ ] Log authorization failures
- [ ] Log data access for sensitive resources
- [ ] Implement centralized logging (Sentry, LogRocket)
- [ ] Set up alerting for security events
- [ ] Monitor for unusual patterns (anomaly detection)
- [ ] Retain logs for compliance (90+ days)
- [ ] Implement audit trail for admin actions

---

## 8. Compliance (6 items)

- [ ] Implement GDPR data export (user data portability)
- [ ] Implement GDPR data deletion (right to be forgotten)
- [ ] Display cookie consent banner
- [ ] Maintain privacy policy
- [ ] Maintain terms of service
- [ ] Document data processing activities

---

## Platform-Specific Checklists

### Attributa (AI Attribution)

- [ ] Secure AI API keys
- [ ] Rate limit AI inference endpoints
- [ ] Validate AI input/output
- [ ] Log AI usage for billing

### LiveItIconic (E-commerce)

- [ ] PCI DSS compliance for payments
- [ ] Secure checkout flow
- [ ] Validate Stripe webhooks
- [ ] Protect customer PII

### REPZ (Fitness App)

- [ ] HIPAA considerations for health data
- [ ] Secure biometric data storage
- [ ] Implement data encryption at rest
- [ ] Mobile app security (certificate pinning)

### LLMWorks (Benchmarking)

- [ ] Secure API key storage
- [ ] Rate limit benchmark runs
- [ ] Validate model configurations
- [ ] Protect benchmark results

---

## Verification Commands

```bash
# Check for exposed secrets
git secrets --scan

# Run security audit
npm audit --audit-level=moderate

# Check for outdated dependencies
npm outdated

# Run OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://your-app.com
```

---

## Last Updated

- **Date**: 2025-12-09
- **Reviewed By**: Automated Security Scan
- **Next Review**: 2026-01-09
