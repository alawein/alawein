# @alawein/integrations

Shared integration clients for the Alawein monorepo. Provides unified access to:

- **Supabase** - Database, Authentication, Storage
- **Stripe** - Payments, Subscriptions, Checkout
- **Resend** - Transactional Email
- **Sentry** - Error Monitoring
- **Analytics** - Vercel Analytics + Posthog

## Installation

```bash
# From the monorepo root
npm install

# Or add to a specific project
npm install @alawein/integrations
```

## Quick Start

### 1. Copy Environment Variables

```bash
cp packages/integrations/.env.example .env.local
```

### 2. Initialize in Your App

```tsx
// main.tsx
import { initSentry } from '@alawein/integrations/sentry';
import { AnalyticsProvider } from '@alawein/integrations/analytics';

// Initialize Sentry first
initSentry();

function App() {
  return (
    <AnalyticsProvider>
      <YourApp />
    </AnalyticsProvider>
  );
}
```

## Usage Examples

### Supabase (Database & Auth)

```tsx
import {
  supabase,
  signIn,
  signUp,
  signOut,
} from '@alawein/integrations/supabase';

// Query data
const { data, error } = await supabase.from('users').select('*');

// Authentication
await signIn({ email: 'user@example.com', password: 'xxx' });
await signUp({ email: 'user@example.com', password: 'xxx' });
await signOut();

// OAuth
import { signInWithOAuth } from '@alawein/integrations/supabase';
await signInWithOAuth({ provider: 'google' });
```

### Stripe (Payments)

```tsx
import {
  quickCheckout,
  createPortalSession,
} from '@alawein/integrations/stripe';

// Start checkout
await quickCheckout({
  priceId: 'price_xxx',
  successUrl: '/success',
  cancelUrl: '/cancel',
});

// Customer portal
const { url } = await createPortalSession(customerId);
window.location.href = url;
```

### Resend (Email)

```tsx
// Server-side only (API routes)
import { sendEmail, sendTemplateEmail } from '@alawein/integrations/resend';

// Simple email
await sendEmail({
  to: 'user@example.com',
  subject: 'Hello!',
  html: '<h1>Welcome</h1>',
});

// Template email
await sendTemplateEmail('welcome', {
  to: 'user@example.com',
  data: { name: 'John' },
});
```

### Sentry (Error Tracking)

```tsx
import { captureError, setUser } from '@alawein/integrations/sentry';

// Capture error
try {
  await riskyOperation();
} catch (error) {
  captureError(error, { context: 'checkout' });
}

// Set user context
setUser({ id: 'user_123', email: 'user@example.com' });
```

### Analytics

```tsx
import { trackEvent, identifyUser } from '@alawein/integrations/analytics';

// Track events
trackEvent('button_clicked', { buttonId: 'signup' });

// Identify user
identifyUser({ id: 'user_123', email: 'user@example.com', plan: 'pro' });
```

## Project-Specific Setup

Each project needs a `.env.local` file with the required variables. See
`.env.example` for the full list.

### Required for All Projects

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SENTRY_DSN`

### Required for Payment Features

- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY` (server-side)

### Required for Email Features

- `RESEND_API_KEY` (server-side)

## API Reference

See individual module documentation:

- [Supabase](./src/supabase/README.md)
- [Stripe](./src/stripe/README.md)
- [Resend](./src/resend/README.md)
- [Sentry](./src/sentry/README.md)
- [Analytics](./src/analytics/README.md)
