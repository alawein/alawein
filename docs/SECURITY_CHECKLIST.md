---
title: 'Security Checklist'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Security Checklist

Pre-deployment security audit checklist for all platforms.

## Authentication

- [ ] All routes requiring auth are protected
- [ ] Password requirements enforced
- [ ] Session timeout configured
- [ ] Logout properly clears session
- [ ] Password reset flow is secure
- [ ] MFA available for sensitive operations

## Authorization

- [ ] Row Level Security (RLS) enabled on all tables
- [ ] RLS policies tested for each user role
- [ ] API endpoints verify user permissions
- [ ] Admin routes properly restricted
- [ ] No privilege escalation vulnerabilities

## Data Protection

- [ ] Sensitive data encrypted at rest
- [ ] TLS/HTTPS enforced
- [ ] No sensitive data in logs
- [ ] No sensitive data in URLs
- [ ] PII handling complies with privacy policy
- [ ] Data retention policies implemented

## Input Validation

- [ ] All user input validated server-side
- [ ] File uploads validated and sanitized
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output encoding)
- [ ] CSRF tokens implemented
- [ ] Rate limiting configured

## Dependencies

- [ ] npm audit shows no high/critical vulnerabilities
- [ ] Dependabot enabled
- [ ] No known vulnerable packages
- [ ] Dependencies up to date
- [ ] Lock file committed

## Configuration

- [ ] Debug mode disabled in production
- [ ] Error messages don't leak sensitive info
- [ ] CORS configured correctly
- [ ] Security headers set (CSP, HSTS, etc.)
- [ ] No hardcoded secrets in code

## Environment

- [ ] Secrets stored in environment variables
- [ ] .env files not committed
- [ ] Production secrets rotated recently
- [ ] Service accounts have minimal permissions
- [ ] API keys scoped appropriately

## Logging & Monitoring

- [ ] Security events logged
- [ ] Logs don't contain sensitive data
- [ ] Alerting configured for security events
- [ ] Log retention policy defined
- [ ] Access to logs restricted

## Infrastructure

- [ ] Database not publicly accessible
- [ ] Firewall rules configured
- [ ] SSH keys rotated
- [ ] Backups encrypted
- [ ] Disaster recovery tested

## Code Review

- [ ] Security-focused code review completed
- [ ] No TODO/FIXME for security issues
- [ ] Secrets scanning passed
- [ ] Static analysis completed
- [ ] Dynamic testing performed

## Compliance

- [ ] Privacy policy up to date
- [ ] Terms of service current
- [ ] Cookie consent implemented
- [ ] Data subject rights supported
- [ ] Breach notification process defined

## Platform-Specific

### SimCore

- [ ] Simulation inputs validated
- [ ] Resource limits enforced
- [ ] No arbitrary code execution

### REPZ

- [ ] Health data encrypted
- [ ] Social features have privacy controls
- [ ] Workout data access restricted

### LiveItIconic

- [ ] Payment processing via Stripe
- [ ] No card data stored locally
- [ ] Order data access controlled
- [ ] PCI compliance verified

### LLMWorks

- [ ] Prompt injection mitigated
- [ ] Output sanitized
- [ ] API rate limits enforced
- [ ] Content moderation in place

### QMLab

- [ ] Experiment data isolated
- [ ] Computation resources limited
- [ ] No sensitive data in simulations

## Sign-Off

| Role            | Name | Date | Signature |
| --------------- | ---- | ---- | --------- |
| Developer       |      |      |           |
| Security Review |      |      |           |
| Deployment Lead |      |      |           |

## Notes

Document any exceptions or deferred items:

---

## Related Documents

- [SECURITY.md](./SECURITY.md) - Security best practices
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [MONITORING.md](./MONITORING.md) - Monitoring setup
