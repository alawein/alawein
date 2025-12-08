# REPZ Coach Platform

> AI-powered fitness coaching platform connecting certified personal trainers with clients through tiered subscriptions.

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run test         # Run tests
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Radix UI + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Payments**: Stripe
- **Mobile**: Capacitor
- **Testing**: Vitest + Playwright

## Project Structure

```text
repz/
├── src/                 # Application source
│   ├── components/      # React components (261 items)
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities
│   └── integrations/    # Supabase client
├── supabase/            # Backend
│   ├── functions/       # 30+ Edge Functions
│   └── migrations/      # Database migrations
├── tests/               # E2E & integration tests
├── packages/            # Shared packages (monorepo)
├── scripts/             # Build & maintenance scripts
└── docs/                # Documentation
    ├── archive/         # Historical docs
    ├── deployment/      # Deployment guides
    └── reports/         # Audit reports
```

## Tier System

| Tier | Price | Features |
|------|-------|----------|
| Core | $89/mo | Essential training & nutrition |
| Adaptive | $149/mo | Interactive coaching + tracking |
| Performance | $229/mo | AI + biohacking features |
| Longevity | $349/mo | Premium concierge service |

**Tier IDs**: `core`, `adaptive`, `performance`, `longevity`

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build:production` | Production build |
| `npm run lint` | ESLint check |
| `npm run type-check` | TypeScript validation |
| `npm run test:run` | Run all tests |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run db:migrate` | Apply Supabase migrations |
| `npm run validate:production` | Full production validation |

## Environment Setup

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLIC_KEY`
- `VITE_OPENAI_API_KEY`

See `docs/deployment/PRODUCTION-CONFIG.md` for complete setup.

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI assistant context
- **[docs/deployment/](./docs/deployment/)** - Deployment guides
- **[docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md)** - Third-party integrations
- **[SECURITY.md](./SECURITY.md)** - Security policies

## License

Proprietary - REPZ LLC
