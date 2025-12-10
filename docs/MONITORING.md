---
title: 'Monitoring Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Monitoring Guide

Observability patterns, logging standards, and alerting configuration.

## Overview

Effective monitoring ensures platform reliability and helps identify issues
before they impact users.

## Monitoring Stack

| Layer    | Tool               | Purpose                 |
| -------- | ------------------ | ----------------------- |
| Frontend | Vercel Analytics   | Performance, Web Vitals |
| Errors   | Sentry             | Error tracking          |
| Backend  | Supabase Dashboard | Database metrics        |
| Uptime   | UptimeRobot        | Availability monitoring |
| Logs     | Vercel/Supabase    | Application logs        |

## Metrics

### Key Performance Indicators

| Metric              | Target  | Alert Threshold |
| ------------------- | ------- | --------------- |
| Uptime              | 99.9%   | < 99.5%         |
| Response Time (p95) | < 500ms | > 1000ms        |
| Error Rate          | < 0.1%  | > 1%            |
| Apdex Score         | > 0.9   | < 0.8           |

### Core Web Vitals

| Metric | Good    | Needs Improvement | Poor    |
| ------ | ------- | ----------------- | ------- |
| LCP    | < 2.5s  | 2.5s - 4s         | > 4s    |
| FID    | < 100ms | 100ms - 300ms     | > 300ms |
| CLS    | < 0.1   | 0.1 - 0.25        | > 0.25  |

### Tracking Web Vitals

```typescript
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });

  navigator.sendBeacon('/api/analytics', body);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
getFCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Logging

### Log Levels

| Level | Use Case                     | Example                    |
| ----- | ---------------------------- | -------------------------- |
| ERROR | Failures requiring attention | Database connection failed |
| WARN  | Potential issues             | Rate limit approaching     |
| INFO  | Normal operations            | User logged in             |
| DEBUG | Development details          | Query parameters           |

### Structured Logging

```typescript
// Logger utility
const logger = {
  info: (message: string, meta?: object) => {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      }),
    );
  },

  error: (message: string, error?: Error, meta?: object) => {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        timestamp: new Date().toISOString(),
        error: error?.message,
        stack: error?.stack,
        ...meta,
      }),
    );
  },

  warn: (message: string, meta?: object) => {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message,
        timestamp: new Date().toISOString(),
        ...meta,
      }),
    );
  },
};

// Usage
logger.info('User authenticated', { userId: user.id });
logger.error('Database query failed', error, { query: 'SELECT...' });
```

### What to Log

**Do Log**:

- Authentication events
- API requests/responses (without sensitive data)
- Error details
- Performance metrics
- Business events

**Don't Log**:

- Passwords or tokens
- Personal identifiable information
- Credit card numbers
- API keys

## Error Tracking

### Sentry Integration

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
});

// Capture errors
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'simcore' },
    extra: { userId: user.id },
  });
}
```

### Error Boundaries

```tsx
import { ErrorBoundary } from '@sentry/react';

function App() {
  return (
    <ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error, componentStack) => {
        console.error('Error caught:', error);
      }}
    >
      <MainContent />
    </ErrorBoundary>
  );
}
```

## Alerting

### Alert Configuration

| Alert           | Condition              | Channel    | Priority |
| --------------- | ---------------------- | ---------- | -------- |
| Site Down       | Uptime < 100% for 5min | Email, SMS | Critical |
| High Error Rate | > 1% for 10min         | Email      | High     |
| Slow Response   | p95 > 2s for 15min     | Email      | Medium   |
| Database Full   | > 90% storage          | Email      | High     |

### Alert Best Practices

1. **Actionable** - Every alert should have a clear action
2. **Prioritized** - Not everything is critical
3. **Deduplicated** - Avoid alert fatigue
4. **Documented** - Include runbook links

## Dashboards

### Key Dashboards

1. **Overview** - High-level health metrics
2. **Performance** - Response times, throughput
3. **Errors** - Error rates, top errors
4. **Business** - User signups, conversions

### Example Dashboard Metrics

```
┌─────────────────────────────────────────────────────────┐
│                    Platform Health                       │
├─────────────────┬─────────────────┬─────────────────────┤
│ Uptime: 99.99%  │ Errors: 0.02%   │ Avg Response: 120ms │
├─────────────────┴─────────────────┴─────────────────────┤
│                                                          │
│  Response Time (p95)                                     │
│  ▁▂▂▃▂▂▁▂▃▄▃▂▂▁▂▂▃▂▂▁▂▃▄▃▂▂▁▂▂▃▂▂▁▂▃▄▃▂▂▁▂▂▃▂▂▁     │
│                                                          │
│  Requests/min                                            │
│  ▃▄▅▆▇█▇▆▅▄▃▄▅▆▇█▇▆▅▄▃▄▅▆▇█▇▆▅▄▃▄▅▆▇█▇▆▅▄▃▄▅▆▇█     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Health Checks

### Endpoint Implementation

```typescript
// /api/health endpoint
export async function handler(req: Request) {
  const checks = {
    database: await checkDatabase(),
    cache: await checkCache(),
    external: await checkExternalServices(),
  };

  const healthy = Object.values(checks).every((c) => c.status === 'healthy');

  return new Response(
    JSON.stringify({
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    }),
    {
      status: healthy ? 200 : 503,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

async function checkDatabase() {
  try {
    await supabase.from('health_check').select('1');
    return { status: 'healthy' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

## Incident Response

### Severity Levels

| Level | Description          | Response Time     |
| ----- | -------------------- | ----------------- |
| P1    | Service down         | 15 minutes        |
| P2    | Major feature broken | 1 hour            |
| P3    | Minor issue          | 4 hours           |
| P4    | Cosmetic/low impact  | Next business day |

### Incident Process

1. **Detect** - Alert triggered or user report
2. **Triage** - Assess severity and impact
3. **Communicate** - Update status page
4. **Investigate** - Find root cause
5. **Resolve** - Fix the issue
6. **Review** - Post-incident analysis

## Related Documents

- [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) - Infrastructure guide
- [SECURITY.md](./SECURITY.md) - Security practices
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
