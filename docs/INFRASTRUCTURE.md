---
title: 'Infrastructure Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Infrastructure Guide

Cloud architecture, scaling strategies, and infrastructure management.

## Overview

The Alawein platforms run on a modern cloud infrastructure optimized for
performance, reliability, and cost efficiency.

## Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CDN (Vercel)                        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ SimCore  │ │   REPZ   │ │  QMLab   │ │ LiveIt   │  ...  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Edge Functions                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │simcore-  │ │ repz-api │ │qmlab-api │ │liveit-api│  ...  │
│  │   api    │ │          │ │          │ │          │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Auth    │ │ Storage  │ │ Realtime │ │ Database │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Services

### Frontend Hosting (Vercel)

| Feature          | Configuration       |
| ---------------- | ------------------- |
| Framework        | Vite                |
| Build Command    | `npm run build`     |
| Output Directory | `dist`              |
| Node Version     | 20.x                |
| Regions          | Global Edge Network |

### Backend (Supabase)

| Service        | Purpose                 |
| -------------- | ----------------------- |
| Database       | PostgreSQL 15           |
| Auth           | User authentication     |
| Storage        | File uploads            |
| Realtime       | WebSocket subscriptions |
| Edge Functions | Serverless APIs         |

### CDN

- Vercel Edge Network
- Automatic SSL
- Global distribution
- Automatic cache invalidation

## Database

### Schema Design

Each platform has dedicated tables with prefixes:

```sql
-- SimCore tables
simcore_simulations
simcore_results

-- REPZ tables
repz_workouts
repz_exercises
repz_progress

-- Shared tables
profiles
projects
```

### Connection Pooling

```typescript
// Use connection pooling for Edge Functions
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: false,
  },
});
```

### Backups

- **Automatic**: Daily backups retained for 7 days
- **Point-in-time**: Available for Pro plans
- **Manual**: Export via Supabase dashboard

## Scaling

### Horizontal Scaling

Frontend automatically scales via Vercel's edge network.

Edge Functions scale automatically based on demand.

### Vertical Scaling

Database can be upgraded through Supabase dashboard:

| Tier | RAM   | CPU     | Connections |
| ---- | ----- | ------- | ----------- |
| Free | 500MB | Shared  | 20          |
| Pro  | 8GB   | 2 cores | 60          |
| Team | 16GB  | 4 cores | 120         |

### Caching Strategy

```typescript
// React Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});
```

## Monitoring

### Metrics to Track

| Metric        | Tool             | Alert Threshold |
| ------------- | ---------------- | --------------- |
| Response Time | Vercel Analytics | p95 > 500ms     |
| Error Rate    | Sentry           | > 1%            |
| Database CPU  | Supabase         | > 80%           |
| Storage Usage | Supabase         | > 80%           |

### Logging

```typescript
// Structured logging in Edge Functions
console.log(
  JSON.stringify({
    level: 'info',
    message: 'Request processed',
    userId: user.id,
    duration: Date.now() - start,
  }),
);
```

## Security

### Network Security

- All traffic over HTTPS
- Database not publicly accessible
- Edge Functions have network isolation

### Access Control

- Row Level Security on all tables
- API keys scoped per environment
- Secrets stored in environment variables

## Cost Optimization

### Strategies

1. **Use caching** - Reduce database queries
2. **Optimize images** - Use WebP, lazy loading
3. **Bundle splitting** - Load only needed code
4. **Edge caching** - Cache static assets

### Cost Breakdown

| Service  | Free Tier       | Typical Usage |
| -------- | --------------- | ------------- |
| Vercel   | 100GB bandwidth | $0-20/month   |
| Supabase | 500MB database  | $0-25/month   |
| Total    | -               | $0-45/month   |

## Disaster Recovery

### Backup Strategy

| Data     | Frequency | Retention  |
| -------- | --------- | ---------- |
| Database | Daily     | 7 days     |
| Storage  | Daily     | 30 days    |
| Code     | Git       | Indefinite |

### Recovery Procedures

1. **Database**: Restore from Supabase backup
2. **Frontend**: Redeploy from Git
3. **Edge Functions**: Redeploy from Git

### RTO/RPO

| Metric               | Target     |
| -------------------- | ---------- |
| RTO (Recovery Time)  | < 1 hour   |
| RPO (Recovery Point) | < 24 hours |

## Environment Management

### Environments

| Environment | Purpose                | URL           |
| ----------- | ---------------------- | ------------- |
| Development | Local development      | localhost     |
| Preview     | PR previews            | \*.vercel.app |
| Staging     | Pre-production testing | staging.\*    |
| Production  | Live users             | \*.com        |

### Environment Variables

```bash
# Development
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=local-key

# Production
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=production-key
```

## Related Documents

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [MONITORING.md](./MONITORING.md) - Monitoring setup
- [SECURITY.md](./SECURITY.md) - Security practices
