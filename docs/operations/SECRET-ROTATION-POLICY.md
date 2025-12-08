# Secret Rotation Policy

## Overview

All secrets must be rotated regularly to maintain security posture.

## Rotation Schedule

### Critical Secrets (Every 30 days)
- Database passwords
- API keys with write access
- Admin credentials
- Encryption keys

### Standard Secrets (Every 90 days)
- Service account tokens
- OAuth client secrets
- Webhook secrets
- CI/CD tokens

### Low-Risk Secrets (Every 180 days)
- Read-only API keys
- Development tokens
- Analytics tokens

## Rotation Process

### 1. Generate New Secret
```bash
# Generate secure random secret
openssl rand -base64 32
```

### 2. Update in Secret Manager
```bash
# AWS Secrets Manager
aws secretsmanager update-secret \
  --secret-id prod/api-key \
  --secret-string "new-secret-value"

# Or update .env for development
```

### 3. Deploy with New Secret
```bash
# Update environment variables
# Deploy application
npm run deploy:production
```

### 4. Verify New Secret Works
```bash
# Test API with new credentials
curl -H "Authorization: Bearer NEW_TOKEN" https://api.example.com/health
```

### 5. Revoke Old Secret
```bash
# Revoke old token/key
# Wait 24 hours for propagation
# Delete old secret
```

### 6. Document Rotation
```bash
# Log rotation in tracking sheet
echo "$(date): Rotated API_KEY" >> secret-rotation-log.txt
```

## Secrets Inventory

| Secret | Type | Rotation | Last Rotated | Next Due |
|--------|------|----------|--------------|----------|
| GITHUB_TOKEN | Critical | 30 days | 2025-01-01 | 2025-01-31 |
| SUPABASE_KEY | Critical | 30 days | 2025-01-01 | 2025-01-31 |
| ANTHROPIC_API_KEY | Standard | 90 days | 2025-01-01 | 2025-04-01 |
| SENTRY_DSN | Standard | 90 days | 2025-01-01 | 2025-04-01 |

## Automation

### Automated Rotation Script
```bash
#!/bin/bash
# scripts/rotate-secrets.sh

SECRET_NAME=$1
NEW_VALUE=$(openssl rand -base64 32)

# Update in AWS Secrets Manager
aws secretsmanager update-secret \
  --secret-id "$SECRET_NAME" \
  --secret-string "$NEW_VALUE"

# Trigger deployment
gh workflow run deploy.yml

echo "Rotated $SECRET_NAME on $(date)"
```

### Scheduled Rotation
```yaml
# .github/workflows/rotate-secrets.yml
name: Rotate Secrets

on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly
  workflow_dispatch:

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - name: Rotate secrets
        run: |
          # Rotation logic here
          echo "Secrets rotated"
```

## Emergency Rotation

If a secret is compromised:

1. **Immediately** generate and deploy new secret
2. Revoke compromised secret
3. Review access logs
4. Notify security team
5. Document incident
6. Update rotation schedule

## Monitoring

### Expiration Alerts
```bash
# Check secret age
SECRET_AGE=$(( ($(date +%s) - $(date -d "2025-01-01" +%s)) / 86400 ))
if [ $SECRET_AGE -gt 30 ]; then
  echo "WARNING: Secret older than 30 days"
fi
```

### Rotation Tracking
- Log all rotations
- Track rotation dates
- Alert on overdue rotations
- Audit rotation compliance

## Best Practices

1. **Never commit secrets** to version control
2. **Use secret managers** (AWS Secrets Manager, HashiCorp Vault)
3. **Rotate proactively** before expiration
4. **Test new secrets** before revoking old ones
5. **Document all rotations**
6. **Automate where possible**
7. **Monitor for anomalies**

## Compliance

- SOC 2: Secrets rotated every 90 days
- PCI DSS: Passwords changed every 90 days
- HIPAA: Access credentials reviewed quarterly
- GDPR: Access controls reviewed regularly

## Contacts

- Security Team: security@example.com
- On-Call: oncall@example.com
- Emergency: +1-555-0100
