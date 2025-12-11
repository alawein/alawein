# REPZ to Nexus Transformation Plan

> **Strategic Overview**: Transform REPZ to adopt Nexus Framework patterns while preserving the Supabase/Vercel stack. This plan focuses on organizational improvements, standardized processes, and enhanced developer experience without risky backend migration.

---

## 🎯 Transformation Objectives

### Primary Goals
1. **Standardize Development** - Adopt Nexus folder structure and patterns
2. **Environment Management** - Implement dev/main/production branch strategy
3. **CI/CD Standardization** - Move from Vercel-only to GitHub Actions
4. **Tier Configuration** - Align REPZ tiers with Nexus tier system
5. **Developer Experience** - Unified CLI and tooling

### Non-Goals
- ❌ Migrating from Supabase to AWS Amplify
- ❌ Changing deployment platform (stay on Vercel)
- ❌ Data migration or schema changes
- ❌ Disrupting production operations

---

## 📊 Current State Analysis

### REPZ Architecture
```
Frontend: React 18 + TypeScript + Vite
Backend: Supabase (PostgreSQL + Edge Functions)
Auth: Supabase Auth (PKCE flow)
Payments: Stripe
Deployment: Vercel
Components: 60+ component directories
Database: 115+ migrations
Functions: 40 Edge Functions
```

### Pain Points
- Inconsistent folder structure
- Manual deployments to Vercel
- No environment branching strategy
- Scattered configuration
- Mixed deployment patterns

---

## 🚀 Transformation Phases

## Phase 1: Foundation (Week 1-2)

### 1.1 Create Nexus-Adapter for Supabase Stack
```typescript
// .nexus/adapter/supabase.ts
export interface SupabasePlatformConfig {
  platform: {
    type: 'saas';
    name: string;
    description: string;
  };
  environments: {
    dev: { branch: 'app/dev'; url: 'dev.repzcoach.com' };
    staging: { branch: 'app/main'; url: 'staging.repzcoach.com' };
    production: { branch: 'production'; url: 'app.repzcoach.com' };
  };
  features: {
    authentication: { provider: 'supabase' };
    database: { type: 'postgresql'; provider: 'supabase' };
    functions: { type: 'edge'; provider: 'supabase' };
    payments: { provider: 'stripe' };
  };
}
```

### 1.2 Initialize Nexus Structure
```bash
# Create Nexus directories without disrupting existing code
mkdir -p .nexus/{config,scripts,templates}
mkdir -p .github/workflows
mkdir -p environments/{dev,staging,production}
```

### 1.3 Configuration Consolidation
- Move tier configs to `.nexus/config/tiers.json`
- Centralize environment variables
- Create unified platform configuration

---

## Phase 2: Folder Structure Migration (Week 3-4)

### 2.1 New Target Structure
```
repz/
├── .nexus/                    # Nexus configuration
│   ├── config/               # Platform configuration
│   ├── scripts/              # Automation scripts
│   └── adapter/              # Supabase adapter
├── amplify/ → supabase/       # Keep Supabase (no change)
├── src/
│   ├── components/           # Reorganize by domain
│   │   ├── ui/              # Base UI components
│   │   ├── features/        # Feature-specific components
│   │   └── layouts/         # Layout components
│   ├── pages/               # Route components
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities and helpers
│   ├── services/            # Business logic
│   └── types/               # TypeScript definitions
├── environments/            # Environment-specific configs
├── .github/workflows/       # CI/CD pipelines
└── tests/                   # Test suites
```

### 2.2 Migration Script
```typescript
// .nexus/scripts/migrate-structure.ts
const migrationMap = {
  // Map old structure to new
  'src/components/auth': 'src/components/features/auth',
  'src/components/coach': 'src/components/features/coach',
  'src/components/client': 'src/components/features/client',
  // ... map all 60+ components
};
```

### 2.3 Import Path Updates
- Update all imports to use new structure
- Create path aliases in tsconfig.json
- Verify no broken imports

---

## Phase 3: Environment Management (Week 5)

### 3.1 Branch Strategy Implementation
```bash
# Create new branches
git checkout -b app/dev
git checkout -b app/main
git checkout -b production

# Configure branch protections
# - app/main requires PR review
# - production requires approval
```

### 3.2 Environment Configuration
```typescript
// environments/dev/config.ts
export const devConfig = {
  supabaseUrl: process.env.SUPABASE_DEV_URL,
  supabaseAnonKey: process.env.SUPABASE_DEV_ANON_KEY,
  stripeSecretKey: process.env.STRIPE_TEST_KEY,
  features: {
    debugMode: true,
    mockData: true,
    hotReload: true,
  },
};

// environments/production/config.ts
export const prodConfig = {
  supabaseUrl: process.env.SUPABASE_PROD_URL,
  supabaseAnonKey: process.env.SUPABASE_PROD_ANON_KEY,
  stripeSecretKey: process.env.STRIPE_LIVE_KEY,
  features: {
    debugMode: false,
    analytics: true,
    monitoring: true,
  },
};
```

### 3.3 Vercel Environment Setup
- Configure separate Vercel projects per environment
- Set up environment-specific domains
- Configure preview deployments for PRs

---

## Phase 4: CI/CD Transformation (Week 6-7)

### 4.1 GitHub Actions Workflow
```yaml
# .github/workflows/repz-ci-cd.yml
name: REPZ CI/CD

on:
  push:
    branches: ['app/dev', 'app/main', 'production']
  pull_request:
    branches: ['app/main', 'production']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run lint
      - run: npm run type-check

  deploy-dev:
    if: github.ref == 'refs/heads/app/dev'
    needs: test
    steps:
      - name: Deploy to Vercel (Dev)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_DEV }}
          vercel-args: '--prod'

  deploy-staging:
    if: github.ref == 'refs/heads/app/main'
    needs: test
    steps:
      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_STAGING }}
          vercel-args: '--prod'

  deploy-production:
    if: github.ref == 'refs/heads/production'
    needs: test
    steps:
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_PROD }}
          vercel-args: '--prod'
```

### 4.2 Quality Gates
- Automated testing on all PRs
- Performance budgets
- Bundle size limits
- Security scanning

---

## Phase 5: Tier Configuration Alignment (Week 8)

### 5.1 Nexus-Style Tier Configuration
```typescript
// .nexus/config/tiers.json
{
  "tiers": {
    "core": {
      "name": "Core",
      "price": 8900,
      "currency": "USD",
      "interval": "month",
      "features": [
        "training_program",
        "nutrition_plan",
        "email_support",
        "response_time_72h"
      ],
      "limits": {
        "consultations": 2,
        "program_updates": 1
      }
    },
    "adaptive": {
      "name": "Adaptive",
      "price": 14900,
      "features": [
        "all_core_features",
        "biomarkers_tracking",
        "wearable_integration",
        "weekly_checkins",
        "response_time_48h"
      ],
      "limits": {
        "consultations": 4,
        "program_updates": 2
      }
    },
    "performance": {
      "name": "Performance",
      "price": 22900,
      "features": [
        "all_adaptive_features",
        "ai_coaching_assistant",
        "form_analysis",
        "peds_protocols",
        "response_time_24h"
      ],
      "limits": {
        "consultations": 8,
        "program_updates": 4
      }
    },
    "longevity": {
      "name": "Longevity",
      "price": 34900,
      "features": [
        "all_performance_features",
        "in_person_training",
        "concierge_service",
        "response_time_12h"
      ],
      "limits": {
        "consultations": -1,
        "program_updates": -1
      }
    }
  }
}
```

### 5.2 Tier Service
```typescript
// src/services/tierService.ts
import { tiers } from '../../.nexus/config/tiers.json';

export class TierService {
  static getTier(tierId: string) {
    return tiers.tiers[tierId];
  }
  
  static canAccessFeature(tierId: string, feature: string) {
    const tier = this.getTier(tierId);
    return tier.features.includes(feature);
  }
  
  static isWithinLimit(tierId: string, resource: string, current: number) {
    const tier = this.getTier(tierId);
    const limit = tier.limits[resource];
    return limit === -1 || current < limit;
  }
}
```

---

## Phase 6: CLI Integration (Week 9)

### 6.1 REPZ-Specific CLI Commands
```typescript
// .nexus/cli/commands/repz-dev.ts
export async function repzDevCommand() {
  // Start Supabase local development
  await execa('supabase', ['start']);
  
  // Start Vite dev server
  await execa('npm', ['run', 'dev']);
}

// .nexus/cli/commands/repz-deploy.ts
export async function repzDeployCommand(options: DeployOptions) {
  const branch = await getCurrentBranch();
  const environment = mapBranchToEnvironment(branch);
  
  // Run tests
  await execa('npm', ['run', 'test:run']);
  
  // Deploy to appropriate Vercel project
  await execa('vercel', ['--prod', '--scope', `repz-${environment}`]);
}
```

### 6.2 Package Scripts Update
```json
{
  "scripts": {
    "dev": "repz dev",
    "deploy": "repz deploy",
    "deploy:staging": "repz deploy --env=staging",
    "deploy:production": "repz deploy --env=production",
    "db:reset": "supabase db reset",
    "db:migrate": "supabase db push"
  }
}
```

---

## 📋 Implementation Checklist

### Week 1-2: Foundation
- [ ] Create `.nexus` directory structure
- [ ] Implement Supabase adapter
- [ ] Consolidate configuration files
- [ ] Set up tier configuration
- [ ] Initialize environment directories

### Week 3-4: Structure Migration
- [ ] Create migration script
- [ ] Reorganize 60+ components
- [ ] Update all import paths
- [ ] Configure TypeScript aliases
- [ ] Verify no broken imports

### Week 5: Environment Management
- [ ] Create branch strategy
- [ ] Set up Vercel environments
- [ ] Configure environment variables
- [ ] Implement environment configs
- [ ] Test branch deployments

### Week 6-7: CI/CD
- [ ] Create GitHub Actions workflows
- [ ] Configure quality gates
- [ ] Set up secrets and tokens
- [ ] Test deployment pipelines
- [ ] Configure preview deployments

### Week 8: Tier Configuration
- [ ] Migrate tier configs to Nexus format
- [ ] Implement TierService
- [ ] Update subscription logic
- [ ] Test tier enforcement
- [ ] Verify billing integration

### Week 9: CLI Integration
- [ ] Implement REPZ CLI commands
- [ ] Update package scripts
- [ ] Test local development
- [ ] Verify deployment commands
- [ ] Document new workflows

---

## 🚨 Risk Mitigation

### Technical Risks
1. **Import Path Breakage** - Automated migration script with validation
2. **Deployment Downtime** - Blue-green deployment strategy
3. **Environment Confusion** - Clear naming and documentation
4. **Configuration Drift** - Centralized config management

### Business Risks
1. **Developer Productivity** - Parallel development during migration
2. **Feature Delays** - Phase gates with rollback options
3. **Customer Impact** - Zero-downtime deployments

---

## 📊 Success Metrics

### Developer Experience
- [ ] Setup time < 30 minutes for new developers
- [ ] PR to deployment < 10 minutes
- [ ] 0 manual deployment steps

### Code Quality
- [ ] 100% test coverage on critical paths
- [ ] 0 TypeScript errors
- [ ] < 5 minutes CI/CD pipeline time

### Operational Excellence
- [ ] 99.9% uptime maintained
- [ ] < 1 minute rollback time
- [ ] Automated environment provisioning

---

## 🔄 Rollback Strategy

If any phase fails:
1. **Immediate**: Revert to last known good commit
2. **Analysis**: Review failure logs and metrics
3. **Fix**: Apply fix to feature branch
4. **Test**: Full regression in staging
5. **Deploy**: Gradual rollout with monitoring

---

## 📚 Training & Documentation

### Developer Onboarding
1. New developer setup guide
2. Environment management training
3. CI/CD workflow documentation
4. Troubleshooting guide

### Process Documentation
1. Branch strategy guide
2. Deployment runbook
3. Emergency procedures
4. Best practices checklist

---

## 🎉 Post-Transformation Benefits

1. **Standardized Development** - Consistent patterns across all features
2. **Improved Velocity** - Automated deployments and environments
3. **Better Quality** - Automated testing and quality gates
4. **Easier Onboarding** - Clear structure and documentation
5. **Scalable Processes** - Ready for team growth

---

*Transformation Timeline: 9 weeks*
*Estimated Effort: 2-3 developers*
*Risk Level: Low (preserves existing stack)*

---

**Next Steps**: Review with team, assign phase owners, schedule kickoff meeting
