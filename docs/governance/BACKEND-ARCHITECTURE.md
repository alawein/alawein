# Backend Architecture Decisions

> **Last Updated:** 2025-12-09  
> **Status:** Active  
> **Owner:** Alawein Technologies LLC

---

## Overview

This document formalizes the backend architecture strategy for all platforms in
the monorepo. Each platform uses a **frontend-first approach** with
serverless/BaaS backends.

---

## Architecture Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                    │
├─────────────────────────────────────────────────────────────────┤
│  shadcn/ui  │  Tailwind CSS  │  Zustand  │  TanStack Query     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND-AS-A-SERVICE                         │
├───────────────────┬─────────────────────┬───────────────────────┤
│   Supabase        │   Vercel Functions  │   Stripe              │
│   ─────────────   │   ────────────────  │   ──────              │
│   • Auth          │   • Custom APIs     │   • Payments          │
│   • Database      │   • Webhooks        │   • Subscriptions     │
│   • Edge Funcs    │   • Serverless      │   • Invoices          │
│   • Storage       │                     │                       │
└───────────────────┴─────────────────────┴───────────────────────┘
```

---

## Platform-Specific Backends

| Platform         | Primary Backend  | Auth | Database        | Edge Functions | Payments | Mobile    |
| ---------------- | ---------------- | ---- | --------------- | -------------- | -------- | --------- |
| **Portfolio**    | None (static)    | ❌   | ❌              | ❌             | ❌       | ❌        |
| **SimCore**      | Supabase         | ✅   | ✅              | ❌             | ❌       | PWA       |
| **QMLab**        | Supabase         | ✅   | ✅              | ❌             | ❌       | ❌        |
| **LLMWorks**     | Supabase         | ✅   | ✅              | ⏳             | ❌       | ❌        |
| **Attributa**    | Supabase         | ✅   | ✅              | ✅             | ✅       | ❌        |
| **LiveItIconic** | Supabase         | ✅   | ✅              | ✅             | ✅       | ❌        |
| **REPZ**         | Vercel Functions | ✅   | Vercel Postgres | ✅             | ✅       | Capacitor |

---

## Backend Strategy by Platform

### 1. Portfolio (malawein.com)

**Type:** Static Site  
**Backend:** None required

- Pure frontend showcase
- No authentication needed
- Deploy as static site on Vercel/Lovable

---

### 2. SimCore (simcore.dev)

**Type:** Educational Tool / PWA  
**Backend:** Supabase (optional persistence)

- Physics simulations run client-side
- Optional: Save/load states to Supabase
- **NO Capacitor** - PWA only
- Focus on web deployment

```typescript
// Optional Supabase for state persistence
const { data, error } = await supabase
  .from('simulations')
  .insert({ user_id, state: JSON.stringify(simulation) });
```

---

### 3. QMLab (qmlab.online)

**Type:** Educational Tool  
**Backend:** Supabase (for save/load)

- Quantum mechanics simulations client-side
- Save/load experiment states
- No payments required

---

### 4. LLMWorks (llmworks.dev)

**Type:** SaaS Tool  
**Backend:** Supabase

- Store benchmark results
- User authentication
- Future: Edge Functions for LLM API proxying

---

### 5. Attributa (attributa.dev)

**Type:** SaaS (Freemium)  
**Backend:** Supabase + Edge Functions

**Edge Functions (Ready):**

- `attributions` - AI attribution analysis
- `citations` - Citation generation
- `ingest` - Content ingestion
- `projects` - Project management

**Pricing Tiers:**

- Free: 5 projects, 100 analyses/month
- Pro ($9/mo): 25 projects, 1,000 analyses/month
- Team ($29/mo): Unlimited projects, 10,000 analyses/month

---

### 6. LiveItIconic (liveiticonic.com)

**Type:** E-commerce  
**Backend:** Supabase + Stripe

**Edge Functions (Ready):**

- `create-checkout-session` - Stripe checkout
- `stripe-webhook` - Order fulfillment

**Features:**

- Product catalog in Supabase
- Stripe payment processing
- Order management
- Guest checkout support

---

### 7. REPZ (getrepz.app)

**Type:** Mobile-First SaaS  
**Backend:** Vercel Functions + Vercel Postgres

**Decision:** Migrated from Supabase to Vercel Functions for:

- Simpler deployment (same platform as frontend)
- Better DX for API development
- Lower latency

**API Routes:**

- `/api/auth.ts` - Authentication
- `/api/workouts.ts` - Workout CRUD
- `/api/intake.ts` - Client intake forms

**Mobile:** Capacitor for iOS/Android builds

---

## Supabase Edge Functions Structure

```
platforms/{platform}/supabase/
├── config.toml          # Supabase configuration
├── functions/           # Edge Functions
│   ├── {function-name}/
│   │   └── index.ts     # Deno function
│   └── ...
└── migrations/          # SQL migrations
    └── *.sql
```

---

## Vercel Functions Structure (REPZ)

```
platforms/repz/
├── api/                 # Vercel Functions
│   ├── auth.ts
│   ├── workouts.ts
│   └── intake.ts
├── vercel.json          # Vercel configuration
└── src/                 # React frontend
```

---

## Decision Matrix: When to Use What

| Use Case               | Recommendation                              |
| ---------------------- | ------------------------------------------- |
| Simple auth + database | Supabase                                    |
| Custom API logic       | Supabase Edge Functions or Vercel Functions |
| Payment processing     | Stripe + Supabase Edge Functions            |
| Static site            | No backend (Vercel static)                  |
| Mobile app             | Capacitor + any backend                     |
| Real-time features     | Supabase Realtime                           |
| File storage           | Supabase Storage                            |

---

## Environment Variables Required

### Supabase Platforms

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Edge Functions only
```

### Stripe Platforms

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...  # Edge Functions only
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Vercel Functions (REPZ)

```env
DATABASE_URL=postgres://...
JWT_SECRET=...
```

---

## Related Documents

- [DOMAIN-STRATEGY.md](./DOMAIN-STRATEGY.md) - Domain assignments
- [MONITORING-SETUP.md](./MONITORING-SETUP.md) - Error tracking
- [../developer/LOVABLE-DEV-WORKFLOW.md](../developer/LOVABLE-DEV-WORKFLOW.md) -
  Development workflow
