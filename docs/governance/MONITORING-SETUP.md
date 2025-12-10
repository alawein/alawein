---
title: 'Monitoring Setup Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Monitoring Setup Guide

## 🔴 Sentry Error Tracking

### 1. Create Sentry Account & Projects

1. Go to [sentry.io](https://sentry.io) and create an account
2. Create a new organization (e.g., "Alawein Technologies")
3. Create projects for each platform:
   - `simcore` (React)
   - `qmlab` (React)
   - `llmworks` (React)
   - `attributa` (React)
   - `liveiticonic` (React)
   - `repz` (React)
   - `portfolio` (React)
   - `studios-hub` (React)

### 2. Get DSN for Each Project

After creating each project, copy the DSN from:
`Settings > Projects > [Project] > Client Keys (DSN)`

### 3. Configure Environment Variables

Add to each platform's `.env` file:

```env
# Sentry Configuration
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
VITE_APP_ENV=production
```

### 4. Initialize in Each Platform

Update each platform's `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initSentry } from '@alawein/integrations/sentry';
import App from './App';
import './index.css';

// Initialize Sentry before rendering
initSentry({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV || 'development',
  release: `${import.meta.env.VITE_APP_NAME}@${import.meta.env.VITE_APP_VERSION}`,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 5. Wrap App with Error Boundary

```tsx
import { SentryErrorBoundary } from '@alawein/integrations/sentry';

function App() {
  return (
    <SentryErrorBoundary fallback={<ErrorFallback />} showDialog={true}>
      {/* Your app components */}
    </SentryErrorBoundary>
  );
}
```

### 6. Capture Errors Manually

```tsx
import { captureError, captureMessage } from '@alawein/integrations/sentry';

// In catch blocks
try {
  await riskyOperation();
} catch (error) {
  captureError(error, {
    context: 'checkout',
    userId: user.id,
  });
}

// For important events
captureMessage('User upgraded to Pro', 'info', {
  plan: 'pro',
  userId: user.id,
});
```

---

## 📊 Analytics (Plausible)

### Self-Hosted (Recommended for Privacy)

1. Deploy Plausible using Docker
2. Add script to each platform's `index.html`:

```html
<script
  defer
  data-domain="simcore.dev"
  src="https://analytics.alawein.com/js/script.js"
></script>
```

### Cloud Option

1. Sign up at [plausible.io](https://plausible.io)
2. Add domains for each platform
3. Add tracking script to `index.html`

---

## ⏱️ Uptime Monitoring

### Recommended: Uptime Robot (Free)

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create monitors for each domain:
   - https://malawein.com
   - https://simcore.dev
   - https://qmlab.online
   - https://llmworks.dev
   - https://attributa.dev
   - https://liveiticonic.com
   - https://getrepz.app

3. Set check interval: 5 minutes
4. Configure alerts: Email + Slack/Discord

---

## 🔧 Environment Variable Template

Create `.env.example` in each platform:

```env
# App Configuration
VITE_APP_NAME=simcore
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Sentry Error Tracking
VITE_SENTRY_DSN=

# Supabase (if needed)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Stripe (for commercial platforms)
VITE_STRIPE_PUBLISHABLE_KEY=

# Analytics
VITE_PLAUSIBLE_DOMAIN=
```

---

## 📋 Monitoring Checklist

### Per Platform

- [ ] Sentry project created
- [ ] DSN configured in `.env`
- [ ] `initSentry()` called in `main.tsx`
- [ ] Error boundaries in place
- [ ] Plausible/Analytics script added
- [ ] Uptime monitor configured
- [ ] Alert notifications set up

### Organization-Wide

- [ ] Sentry team access configured
- [ ] Slack/Discord integration for alerts
- [ ] Weekly error review scheduled
- [ ] Performance baselines documented
