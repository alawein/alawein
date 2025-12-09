# REPZ LLC

AI-powered fitness coaching platform connecting clients with professional trainers.

## Overview

| Field | Value |
|-------|-------|
| **Entity** | REPZ LLC |
| **Focus** | Fitness Technology, AI Coaching, Wellness |
| **Tech Stack** | React 18, TypeScript, Vite, Supabase, Stripe |
| **Owner** | [@alawein](https://github.com/alawein) |
| **Domain** | repzcoach.com |

## Directory Structure

```
repz-llc/
├── apps/
│   └── repz/                # Main REPZ Coach platform
│       ├── src/             # React source code (261+ components)
│       ├── api/             # API endpoints
│       └── public/          # Static assets
├── packages/                # LLC-specific shared libraries
├── supabase/                # Backend configuration
│   ├── functions/           # Edge functions (30+)
│   └── migrations/          # Database schema
├── tests/                   # Testing infrastructure
│   └── e2e/                 # Playwright E2E tests
├── client-deliverables/     # Client-specific work (local only)
├── docs/                    # Organization documentation
└── tools/                   # Development tooling
```

## Platform Features

### User Roles

| Role | Description |
|------|-------------|
| **Client** | Fitness enthusiasts seeking coaching |
| **Coach** | Professional trainers offering services |
| **Admin** | Platform administrators |

### Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Core Program** | $89/mo | Essential training & nutrition |
| **Adaptive Engine** | $149/mo | Interactive coaching + tracking |
| **Performance Suite** | $229/mo | Advanced biohacking + AI |
| **Longevity Concierge** | $349/mo | Premium concierge service |

### Core Features

- **AI Coaching Engine** - Personalized workout recommendations
- **Workout Generation** - AI-powered exercise planning
- **Nutrition AI** - Meal planning and tracking
- **Form Analysis** - Video-based technique feedback
- **Progress Analytics** - Performance dashboards
- **Coach Matching** - Client-coach pairing system
- **Live Sessions** - Real-time coaching integration
- **Mobile App** - Capacitor-based iOS/Android support

## Quick Start

See [QUICK-START.md](./QUICK-START.md) for detailed setup instructions.

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account (for backend)
- Stripe account (for payments)

### Development

```bash
# Navigate to app
cd apps/repz

# Install dependencies
npm install

# Start development server (port 8080)
npm run dev
```

### Testing

```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Full validation
npm run test:all
```

## Deployment

| Environment | URL | Status |
|-------------|-----|--------|
| Production | repzcoach.com | Active |
| Staging | staging.repzcoach.com | Available |

### Vercel Configuration

**Root Directory**: `organizations/repz-llc/apps/repz`

Required environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY`

## Documentation

| Document | Description |
|----------|-------------|
| [IP Manifest](./IP-MANIFEST.md) | Intellectual property ownership |
| [Quick Start](./QUICK-START.md) | Getting started guide |
| [Setup Checklist](./SETUP-CHECKLIST.md) | Deployment checklist |
| [Supabase Guide](./SUPABASE-SETUP-GUIDE.md) | Backend configuration |
| [Testing Guide](./TESTING-GUIDE.md) | Testing documentation |
| [Current Status](./CURRENT-STATUS.md) | Project status |
| [App README](./apps/repz/README.md) | Application details |

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite build system
- Tailwind CSS + shadcn/ui
- Radix UI primitives
- Framer Motion animations
- React Query for data fetching
- React Hook Form + Zod validation

### Backend
- Supabase (PostgreSQL + Auth + Realtime)
- 30+ Edge Functions
- Row-Level Security (RLS)

### Payments
- Stripe Checkout
- Subscription management
- Customer portal

### Mobile
- Capacitor for iOS/Android
- Push notifications
- Haptic feedback

### Testing
- Vitest (unit tests, 80% coverage)
- Playwright (E2E)
- @axe-core (accessibility)
- k6 (performance)

## Related

- [Monorepo Root](../../README.md)
- [Shared Packages](../../packages/)
- [CI/CD Workflows](../../.github/workflows/)

---

*Part of the [alawein/alawein](https://github.com/alawein/alawein) monorepo*
