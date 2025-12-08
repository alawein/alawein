# Monitoring & Observability Setup

## Error Tracking - Sentry

### Installation
```bash
npm install @sentry/react @sentry/vite-plugin
```

### Configuration
```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
});
```

### Usage
```typescript
import { ErrorBoundary } from '@alawein/shared-ui';
import { captureError } from '@alawein/monitoring';

<ErrorBoundary onError={(error) => captureError(error)}>
  <App />
</ErrorBoundary>
```

## Uptime Monitoring

### UptimeRobot
1. Sign up at uptimerobot.com
2. Add monitors for each service
3. Configure alerts (email, Slack)
4. Set check interval (5 minutes)

### Endpoints to Monitor
- https://llmworks.dev/health
- https://api.supabase.co/health
- https://your-domain.com/api/health

## Performance Monitoring

### Web Vitals
```typescript
// src/lib/vitals.ts
import { onCLS, onFID, onLCP } from 'web-vitals';

function sendToAnalytics(metric: any) {
  console.log(metric);
  // Send to analytics service
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
```

### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://your-domain.com
          uploadArtifacts: true
```

## Log Aggregation

### Supabase Logs
```sql
-- Query logs
SELECT * FROM auth.audit_log_entries
WHERE created_at > now() - interval '1 hour'
ORDER BY created_at DESC;
```

### Application Logs
```typescript
// src/lib/logger.ts
export const logger = {
  info: (msg: string, meta?: any) => {
    console.log(`[INFO] ${msg}`, meta);
    // Send to log service
  },
  error: (msg: string, error?: Error) => {
    console.error(`[ERROR] ${msg}`, error);
    // Send to Sentry
  },
};
```

## Metrics Dashboard

### Key Metrics
- Response time (p50, p95, p99)
- Error rate
- Request rate
- Active users
- Database connections
- Memory usage
- CPU usage

### Grafana Setup
```yaml
# docker-compose.yml
services:
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

## Alerts

### Critical Alerts
- Error rate > 5%
- Response time > 2s
- Uptime < 99%
- Database connections > 80%

### Warning Alerts
- Error rate > 1%
- Response time > 1s
- Memory usage > 80%
- Disk usage > 80%

### Alert Channels
- Email: team@example.com
- Slack: #alerts
- PagerDuty: On-call rotation

## Health Checks

### Application Health
```typescript
// src/api/health.ts
export async function healthCheck() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: import.meta.env.VITE_APP_VERSION,
    uptime: performance.now(),
    checks: {
      database: await checkDatabase(),
      cache: await checkCache(),
      storage: await checkStorage(),
    },
  };
}
```

### Database Health
```sql
-- Check database health
SELECT 
  count(*) as active_connections,
  max(now() - query_start) as longest_query
FROM pg_stat_activity
WHERE state = 'active';
```

## Incident Response

### Runbook
1. **Detect:** Alert triggered
2. **Assess:** Check dashboards
3. **Mitigate:** Apply fix or rollback
4. **Communicate:** Update status page
5. **Resolve:** Verify fix
6. **Document:** Post-mortem

### Status Page
- Use statuspage.io or similar
- Update during incidents
- Post-incident reports

## Cost Monitoring

### AWS Cost Explorer
- Set budget alerts
- Monitor by service
- Review monthly

### Supabase Usage
- Monitor database size
- Track API requests
- Review storage usage

## Security Monitoring

### Failed Login Attempts
```sql
SELECT 
  email,
  count(*) as failed_attempts,
  max(created_at) as last_attempt
FROM auth.audit_log_entries
WHERE action = 'login_failed'
  AND created_at > now() - interval '1 hour'
GROUP BY email
HAVING count(*) > 5;
```

### Suspicious Activity
- Multiple failed logins
- Unusual API patterns
- Large data exports
- Permission changes

## Checklist

- [ ] Sentry configured
- [ ] Uptime monitoring enabled
- [ ] Performance tracking active
- [ ] Log aggregation working
- [ ] Metrics dashboard created
- [ ] Alerts configured
- [ ] Health checks implemented
- [ ] Incident runbook documented
- [ ] Status page setup
- [ ] Cost monitoring enabled
