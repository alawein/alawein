# IP Ownership Manifest - REPZ LLC

> **Legal Notice**: This document establishes intellectual property ownership
> for all code, assets, and deliverables within this directory structure.

## Entity Information

| Field               | Value                     |
| ------------------- | ------------------------- |
| **Legal Entity**    | REPZ LLC                  |
| **Jurisdiction**    | United States             |
| **Owner**           | Meshaal Alawein           |
| **Repository Path** | `organizations/repz-llc/` |
| **Primary Domain**  | repzcoach.com             |

## Ownership Declaration

All source code, documentation, designs, algorithms, AI models, fitness
protocols, and digital assets contained within this directory and its
subdirectories are the exclusive intellectual property of **REPZ LLC**, unless
explicitly noted otherwise in the Licensed Components section below.

## Directory Scope

This IP manifest covers the following directories:

| Directory                   | Description                            | IP Status   |
| --------------------------- | -------------------------------------- | ----------- |
| `apps/`                     | Application directory                  | Proprietary |
| `apps/repz/`                | REPZ Coach fitness platform            | Proprietary |
| `apps/repz/src/`            | Platform source code (261+ components) | Proprietary |
| `apps/repz/src/features/`   | Feature modules (17 domains)           | Proprietary |
| `apps/repz/src/components/` | UI component library                   | Proprietary |
| `apps/repz/api/`            | API endpoints                          | Proprietary |
| `packages/`                 | LLC-specific shared libraries          | Proprietary |
| `supabase/`                 | Backend configuration                  | Proprietary |
| `supabase/functions/`       | Edge functions (30+)                   | Proprietary |
| `supabase/migrations/`      | Database schema                        | Proprietary |
| `tests/`                    | Testing infrastructure                 | Proprietary |
| `docs/`                     | Organization documentation             | Proprietary |
| `tools/`                    | Development tooling                    | Proprietary |
| `client-deliverables/`      | Client-specific work (local only)      | Per-client  |

## Brand Assets

The following brand assets are registered trademarks or proprietary to REPZ LLC:

| Asset                        | Type          | Status      |
| ---------------------------- | ------------- | ----------- |
| "REPZ"                       | Brand Name    | Proprietary |
| "REPZ Coach"                 | Product Name  | Proprietary |
| repzcoach.com                | Domain        | Owned       |
| Logo and Visual Identity     | Design Assets | Proprietary |
| Brand Color (#F15B23 Orange) | Design Token  | Proprietary |

## Proprietary Algorithms & Systems

| System             | Description                          | Protection Level |
| ------------------ | ------------------------------------ | ---------------- |
| AI Coaching Engine | Fitness analysis and recommendations | Trade Secret     |
| Tier Feature Gates | 4-tier subscription access control   | Proprietary      |
| Workout Generation | AI-powered workout planning          | Trade Secret     |
| Nutrition AI       | Meal planning algorithms             | Trade Secret     |
| Form Analysis      | Video-based form correction          | Trade Secret     |
| Progress Analytics | Performance tracking algorithms      | Proprietary      |

## Subscription Tier System

The 4-tier subscription model is proprietary business logic:

| Tier                | Monthly Price | IP Status   |
| ------------------- | ------------- | ----------- |
| Core Program        | $89           | Proprietary |
| Adaptive Engine     | $149          | Proprietary |
| Performance Suite   | $229          | Proprietary |
| Longevity Concierge | $349          | Proprietary |

## Licensed Components

Components licensed from external sources or shared infrastructure:

| Component                     | License Type     | Source           | Terms Reference                                           |
| ----------------------------- | ---------------- | ---------------- | --------------------------------------------------------- |
| `@monorepo/eslint-config`     | Internal License | Root `packages/` | [LICENSE-INTERNAL.md](../../packages/LICENSE-INTERNAL.md) |
| `@monorepo/typescript-config` | Internal License | Root `packages/` | [LICENSE-INTERNAL.md](../../packages/LICENSE-INTERNAL.md) |
| `@monorepo/ui`                | Internal License | Root `packages/` | [LICENSE-INTERNAL.md](../../packages/LICENSE-INTERNAL.md) |
| React 18                      | MIT              | Open Source      | npm package license                                       |
| Vite                          | MIT              | Open Source      | npm package license                                       |
| TypeScript                    | Apache 2.0       | Open Source      | npm package license                                       |
| Tailwind CSS                  | MIT              | Open Source      | npm package license                                       |
| Radix UI Components           | MIT              | Open Source      | npm package licenses                                      |
| Supabase Client               | Apache 2.0       | Open Source      | npm package license                                       |
| Stripe SDK                    | Apache 2.0       | Open Source      | npm package license                                       |
| Capacitor                     | MIT              | Open Source      | npm package license                                       |
| Framer Motion                 | MIT              | Open Source      | npm package license                                       |

## Third-Party Dependencies

177+ production dependencies governed by their respective open-source licenses.
Full audit available via:

```bash
cd organizations/repz-llc/apps/repz && npm ls --all
```

## Data Protection

| Data Category         | Description                   | Protection               |
| --------------------- | ----------------------------- | ------------------------ |
| User Fitness Data     | Workout history, body metrics | Encrypted, HIPAA-aligned |
| Payment Information   | Stripe-processed, not stored  | PCI-DSS Compliant        |
| Coach Credentials     | Professional certifications   | Confidential             |
| Client Communications | Messages and coaching notes   | Encrypted                |
| AI Training Data      | Anonymized fitness patterns   | Proprietary              |

## Client Deliverables

The `client-deliverables/` directory contains:

- Client-specific customizations
- White-label configurations
- Per-client assets

**Policy**: Client deliverables are stored locally only (`.gitignore`d) and
ownership is determined by individual client contracts.

## Contributor Agreement

All contributions to this directory require:

1. **Assignment Agreement**: Contributors must have signed an IP assignment
   agreement transferring ownership to REPZ LLC
2. **Work for Hire**: All work performed is considered "work for hire" under US
   copyright law
3. **No Prior Claims**: Contributors warrant they have no prior IP claims on
   contributed code
4. **Fitness Industry Compliance**: Contributors acknowledge fitness/health
   industry regulations

## Confidentiality

Code within this directory is considered **Confidential and Proprietary**.
Unauthorized access, copying, or distribution is prohibited.

## Contact

For licensing inquiries or IP questions:

- **Entity**: REPZ LLC
- **Owner**: Meshaal Alawein
- **GitHub**: [@alawein](https://github.com/alawein)
- **Platform**: https://repzcoach.com

---

_Last Updated: December 2024_ _Document Version: 1.0.0_
