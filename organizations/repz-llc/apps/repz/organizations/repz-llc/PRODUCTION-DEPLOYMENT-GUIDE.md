# Production Deployment Guide - REPZ Platform

## Overview
This guide provides step-by-step instructions for deploying the REPZ fitness coaching platform to production.

**Estimated Time**: 2-4 hours
**Difficulty**: Intermediate
**Prerequisites**: Domain name, hosting account, API keys

---

## Pre-Deployment Checklist

### Required Accounts & Services
- [ ] **Supabase Account** (Database & Auth)
- [ ] **Vercel Account** (Hosting) OR **Netlify** OR **AWS**
- [ ] **Stripe Account** (Payment Processing)
- [ ] **SendGrid Account** (Email Service)
- [ ] **Twilio Account** (SMS Service) - Optional
- [ ] **Calendly Account** (Scheduling) - Optional
- [ ] **Domain Name** (e.g., repz.com)
- [ ] **SSL Certificate** (Usually auto-provided)
- [ ] **Google Analytics** (Tracking)
- [ ] **Sentry Account** (Error Tracking)

### API Keys & Credentials Needed
```env
# Production Environment Variables
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Stripe (Production Keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_[your-key]
STRIPE_SECRET_KEY=sk_live_[your-key]
STRIPE_WEBHOOK_SECRET=whsec_[your-secret]

# Email Service
SENDGRID_API_KEY=[your-sendgrid-key]
SENDGRID_FROM_EMAIL=noreply@repz.com

# SMS Service (Optional)
TWILIO_ACCOUNT_SID=[your-sid]
TWILIO_AUTH_TOKEN=[your-token]
TWILIO_PHONE_NUMBER=+1234567890

# Analytics
VITE_GA_TRACKING_ID=G-[your-id]
VITE_GTM_ID=GTM-[your-id]

# Error Tracking
VITE_SENTRY_DSN=https://[your-dsn]@sentry.io/[project]

# App Configuration
VITE_APP_URL=https://repz.com
VITE_API_URL=https://api.repz.com
```

---

## Step 1: Database Deployment

### 1.1 Production Database Setup
```bash
# Login to Supabase Dashboard
https://supabase.com/dashboard

# Create Production Project
1. Click "New Project"
2. Name: "repz-production"
3. Database Password: [Generate strong password]
4. Region: Choose closest to users
5. Plan: Pro ($25/month recommended)
```

### 1.2 Deploy Schema
```sql
-- In Supabase SQL Editor
-- Copy entire content of reset-and-deploy.sql
-- Run the script
-- Verify: 18 tables created
```

### 1.3 Configure Auth
```javascript
// Supabase Dashboard > Authentication > Settings
{
  "site_url": "https://repz.com",
  "redirect_urls": [
    "https://repz.com/auth/callback",
    "https://repz.com/reset-password"
  ],
  "email_auth": true,
  "magic_link": false,
  "rate_limits": {
    "signup": 5,  // per hour
    "login": 10   // per hour
  }
}
```

### 1.4 Enable Row Level Security
```sql
-- Verify RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- All should show 'true'
```

---

## Step 2: Stripe Configuration

### 2.1 Create Products & Prices
```javascript
// Stripe Dashboard > Products
const products = [
  {
    name: "Core Program",
    id: "core",
    prices: {
      monthly: "$89",
      quarterly: "$249 (save $18)",
      semiannual: "$479 (save $55)",
      annual: "$899 (save $169)"
    }
  },
  {
    name: "Adaptive Engine",
    id: "adaptive",
    prices: {
      monthly: "$149",
      quarterly: "$419 (save $28)",
      semiannual: "$809 (save $85)",
      annual: "$1,549 (save $239)"
    }
  },
  {
    name: "Performance Suite",
    id: "performance",
    prices: {
      monthly: "$229",
      quarterly: "$649 (save $38)",
      semiannual: "$1,259 (save $115)",
      annual: "$2,399 (save $349)"
    }
  },
  {
    name: "Longevity Concierge",
    id: "longevity",
    prices: {
      monthly: "$349",
      quarterly: "$999 (save $48)",
      semiannual: "$1,949 (save $145)",
      annual: "$3,699 (save $489)"
    }
  }
];
```

### 2.2 Configure Webhooks
```javascript
// Stripe Dashboard > Webhooks
Endpoint URL: https://repz.com/api/stripe-webhook
Events to listen:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

### 2.3 Update Environment Variables
```env
# Get these from Stripe Dashboard
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs for each tier/period
STRIPE_PRICE_CORE_MONTHLY=price_...
STRIPE_PRICE_CORE_QUARTERLY=price_...
# ... etc for all tiers
```

---

## Step 3: Frontend Deployment

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configure domain
vercel domains add repz.com
```

#### Vercel Configuration
```json
// vercel.json
{
  "build": {
    "env": {
      "VITE_SUPABASE_URL": "@supabase-url",
      "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key",
      "VITE_STRIPE_PUBLISHABLE_KEY": "@stripe-publishable-key"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Option B: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Configure domain
netlify domains:add repz.com
```

#### Netlify Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option C: AWS (Advanced)

```bash
# Build for production
npm run build

# Upload to S3
aws s3 sync dist/ s3://repz-frontend --delete

# Configure CloudFront
aws cloudfront create-distribution \
  --origin-domain-name repz-frontend.s3.amazonaws.com

# Set up Route 53 for domain
```

---

## Step 4: Edge Functions Deployment

### Deploy Supabase Edge Functions
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to production project
supabase link --project-ref [production-project-ref]

# Deploy all functions
supabase functions deploy --no-verify-jwt

# Set secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set SENDGRID_API_KEY=...
supabase secrets set OPENAI_API_KEY=...
```

---

## Step 5: Email Configuration

### SendGrid Setup
```javascript
// SendGrid Dashboard Configuration
1. Verify domain (repz.com)
2. Create API key with full access
3. Configure templates:
   - Welcome email
   - Password reset
   - Workout reminder
   - Payment receipt
   - Session confirmation
```

### Email Templates
```html
<!-- Welcome Email Template -->
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #F15B23; color: white; padding: 20px; }
    .content { padding: 20px; }
    .button {
      background: #F15B23;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to REPZ!</h1>
    </div>
    <div class="content">
      <p>Hi {{name}},</p>
      <p>Welcome to REPZ - your journey to peak performance starts now!</p>
      <a href="{{dashboard_url}}" class="button">Access Your Dashboard</a>
    </div>
  </div>
</body>
</html>
```

---

## Step 6: Monitoring & Analytics

### 6.1 Google Analytics
```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR-ID');
</script>
```

### 6.2 Sentry Error Tracking
```javascript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: "production",
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1
});
```

### 6.3 Uptime Monitoring
```yaml
# UptimeRobot Configuration
Monitors:
  - URL: https://repz.com
    Type: HTTP(s)
    Interval: 5 minutes

  - URL: https://repz.com/api/health
    Type: Keyword (expects "ok")
    Interval: 5 minutes
```

---

## Step 7: Security Hardening

### 7.1 Security Headers
```javascript
// vercel.json or netlify.toml
headers: {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' *.googleapis.com",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload"
}
```

### 7.2 Rate Limiting
```javascript
// Edge Function: rate-limiter.ts
import { RateLimiter } from '@supabase/rate-limiter';

const limiter = new RateLimiter({
  points: 100,     // requests
  duration: 3600,  // per hour
  blockDuration: 3600
});

export async function rateLimit(req: Request) {
  const ip = req.headers.get('x-forwarded-for');
  const consumed = await limiter.consume(ip);

  if (consumed.remainingPoints < 0) {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

### 7.3 API Security
```javascript
// Implement API key validation
const API_KEY = Deno.env.get('API_KEY');

export function validateApiKey(req: Request) {
  const key = req.headers.get('x-api-key');
  if (key !== API_KEY) {
    throw new Error('Unauthorized');
  }
}
```

---

## Step 8: Performance Optimization

### 8.1 CDN Configuration
```javascript
// CloudFlare Configuration
1. Add domain to CloudFlare
2. Enable:
   - Auto Minify (JS, CSS, HTML)
   - Brotli compression
   - HTTP/3
   - Early Hints
   - Cache Level: Standard
```

### 8.2 Image Optimization
```javascript
// Use Supabase Storage CDN
const imageUrl = supabase.storage
  .from('images')
  .getPublicUrl('profile.jpg', {
    transform: {
      width: 200,
      height: 200,
      quality: 80
    }
  });
```

### 8.3 Database Optimization
```sql
-- Create indexes for common queries
CREATE INDEX idx_workouts_client_date
ON workouts(client_id, scheduled_date);

CREATE INDEX idx_messages_conversation
ON messages(sender_id, recipient_id, created_at);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM workouts
WHERE client_id = '...' AND scheduled_date > NOW();
```

---

## Step 9: Launch Checklist

### Pre-Launch (24 hours before)
- [ ] Database migrated and tested
- [ ] All API keys configured
- [ ] SSL certificate active
- [ ] DNS propagated
- [ ] Email templates tested
- [ ] Payment flow tested with real card
- [ ] Load testing completed
- [ ] Backup system configured
- [ ] Monitoring alerts set up

### Launch Day
- [ ] Deploy to production
- [ ] Verify all endpoints
- [ ] Test critical user paths
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify email delivery
- [ ] Test payment processing
- [ ] Announce launch

### Post-Launch (First 48 hours)
- [ ] Monitor error rates
- [ ] Check conversion funnel
- [ ] Review user feedback
- [ ] Performance optimization
- [ ] Scale resources if needed
- [ ] Daily backups verified
- [ ] Security scan
- [ ] Analytics review

---

## Step 10: Maintenance & Updates

### Deployment Pipeline
```yaml
# GitHub Actions: .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Database Backup
```bash
# Daily backup script
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
aws s3 cp backup-*.sql s3://repz-backups/
```

### Monitoring Dashboard
```javascript
// Custom monitoring endpoint
app.get('/api/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    stripe: await checkStripe(),
    email: await checkEmail(),
    storage: await checkStorage()
  };

  res.json({
    status: 'healthy',
    timestamp: new Date(),
    checks
  });
});
```

---

## Troubleshooting

### Common Issues & Solutions

#### Database Connection Issues
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check SSL mode
psql $DATABASE_URL -c "SHOW ssl"
```

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm ci
npm run build

# Check for type errors
npm run type-check
```

#### Payment Issues
```javascript
// Test Stripe webhook
stripe listen --forward-to localhost:8080/api/stripe-webhook
stripe trigger checkout.session.completed
```

---

## Support & Resources

### Documentation
- [Supabase Docs](https://supabase.io/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)

### Monitoring URLs
- Database: https://supabase.com/dashboard/project/[id]
- Hosting: https://vercel.com/[team]/[project]
- Payments: https://dashboard.stripe.com
- Analytics: https://analytics.google.com
- Errors: https://sentry.io/[org]/[project]

### Emergency Contacts
- Database Issues: support@supabase.io
- Payment Issues: support@stripe.com
- Hosting Issues: support@vercel.com

---

## Cost Estimates

### Monthly Costs (Production)
```
Supabase Pro:        $25/month
Vercel Pro:          $20/month
Stripe:              2.9% + $0.30 per transaction
SendGrid:            $15/month (up to 40k emails)
Domain:              $15/year
SSL:                 Free (included)
CloudFlare:          Free tier
Sentry:              $26/month
---
Total Fixed:         ~$86/month + transaction fees
```

### Scaling Costs
```
Users     | Database | Hosting | Email  | Total
----------|----------|---------|--------|-------
0-100     | $25      | $20     | $15    | $60
100-1000  | $25      | $20     | $25    | $70
1000-5000 | $149     | $150    | $90    | $389
5000+     | Custom   | Custom  | Custom | $1000+
```

---

## Conclusion

This deployment guide covers all aspects of taking the REPZ platform from development to production. Follow each step carefully and use the checklists to ensure nothing is missed.

**Estimated Total Deployment Time**: 2-4 hours
**Recommended Team Size**: 1-2 developers
**Risk Level**: Low (with proper testing)

For additional support or questions, consult the documentation links provided or contact the respective service support teams.

**Good luck with your launch! 🚀**