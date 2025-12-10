# Live It Iconic LLC

E-commerce business specializing in statement jewelry and accessories.

## Overview

| Field          | Value                                            |
| -------------- | ------------------------------------------------ |
| **Entity**     | Live It Iconic LLC                               |
| **Focus**      | E-commerce, Fashion, Jewelry                     |
| **Tech Stack** | React 18, TypeScript, Vite, Stripe, Tailwind CSS |
| **Owner**      | [@alawein](https://github.com/alawein)           |
| **Domain**     | liveiticonic.com                                 |

## Directory Structure

```
live-it-iconic-llc/
├── ecommerce/               # E-commerce platforms
│   └── liveiticonic/        # Main e-commerce store
├── packages/                # LLC-specific shared libraries
├── docs/                    # Organization documentation
└── tools/                   # Development tooling
```

## Applications

### E-Commerce Platform

| App                | Description                        | Status |
| ------------------ | ---------------------------------- | ------ |
| **Live It Iconic** | Statement jewelry e-commerce store | Active |

**Features:**

- Product catalog with dynamic filtering
- Stripe payment integration
- Order management system
- Customer account portal
- Inventory tracking
- Responsive design

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Development

```bash
# Navigate to e-commerce app
cd ecommerce/liveiticonic

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Required environment variables (see `.env.example`):

```env
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

## Deployment

| App            | Vercel Project | Domain           |
| -------------- | -------------- | ---------------- |
| Live It Iconic | `liveiticonic` | liveiticonic.com |

### Deployment Configuration

```json
{
  "buildCommand": "npm run build:production",
  "outputDirectory": "dist",
  "framework": "vite",
  "regions": ["iad1"]
}
```

## E-Commerce Features

### Product Management

- Category organization
- Variant support (size, color)
- Image gallery
- SEO-optimized product pages

### Payments

- Stripe Checkout integration
- Multiple payment methods
- Secure PCI-compliant processing

### Customer Experience

- Account creation and management
- Order history
- Wishlist functionality
- Newsletter subscription

## Documentation

- [IP Manifest](./IP-MANIFEST.md) - Intellectual property ownership
- [Organization Docs](./docs/) - Detailed documentation

## Related

- [Monorepo Root](../../README.md)
- [Shared Packages](../../packages/)
- [CI/CD Workflows](../../.github/workflows/)

---

_Part of the [alawein/alawein](https://github.com/alawein/alawein) monorepo_
