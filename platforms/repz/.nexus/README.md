# REPZ to Nexus Transformation Guide

> **Quick Start Guide** - Execute your REPZ platform transformation to adopt Nexus Framework patterns while preserving your Supabase/Vercel stack.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git repository access
- Admin access to REPZ GitHub repository
- Vercel account with team access
- Supabase project access

### Step 1: Install Dependencies
```bash
cd platforms/repz
npm install -g ts-node
npm install
```

### Step 2: Run Structure Migration
```bash
# Backup current state
git checkout -b backup-before-transformation
git add .
git commit -m "backup: before nexus transformation"

# Run migration script
npx ts-node .nexus/scripts/migrate-structure.ts

# Verify migration
npm run type-check
npm run test
```

### Step 3: Setup Branch Strategy
```bash
# Create new branches
npx ts-node .nexus/scripts/setup-branches.ts

# Push to remote
git push -u origin app/dev app/main production
```

### Step 4: Configure GitHub Secrets
Add these secrets to your GitHub repository:

**Supabase:**
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF_DEV`
- `SUPABASE_PROJECT_REF_STAGING` 
- `SUPABASE_PROJECT_REF_PROD`

**Vercel:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_DEV`
- `VERCEL_PROJECT_ID_STAGING`
- `VERCEL_PROJECT_ID_PROD`

**Stripe:**
- `STRIPE_TEST_KEY`
- `STRIPE_LIVE_KEY`
- `STRIPE_WEBHOOK_SECRET_DEV`
- `STRIPE_WEBHOOK_SECRET_STAGING`
- `STRIPE_WEBHOOK_SECRET_PROD`
- `STRIPE_TEST_PUBLISHABLE_KEY`
- `STRIPE_LIVE_PUBLISHABLE_KEY`

**Environment Variables:**
- `SUPABASE_DEV_URL`
- `SUPABASE_DEV_ANON_KEY`
- `SUPABASE_STAGING_URL`
- `SUPABASE_STAGING_ANON_KEY`
- `SUPABASE_PROD_URL`
- `SUPABASE_PROD_ANON_KEY`

**Optional:**
- `SLACK_WEBHOOK` (for deployment notifications)
- `SNYK_TOKEN` (for security scanning)

### Step 5: Configure Vercel Projects
Create three separate Vercel projects:

1. **Development** (`repz-dev`)
   - Branch: `app/dev`
   - Domain: `dev.repzcoach.com`
   - Environment: Development variables

2. **Staging** (`repz-staging`)
   - Branch: `app/main`
   - Domain: `staging.repzcoach.com`
   - Environment: Staging variables

3. **Production** (`repz-prod`)
   - Branch: `production`
   - Domain: `app.repzcoach.com`
   - Environment: Production variables

### Step 6: Configure Branch Protections
In GitHub Settings > Branches:

1. **app/main**
   - Require PR review (2 reviewers)
   - Require status checks: `qa`, `migrate`, `deploy-functions`
   - Require up-to-date branches
   - Restrict pushes

2. **production**
   - Require PR review (2 reviewers)
   - Require status checks: `qa`, `migrate`, `deploy-functions`, `security`
   - Require up-to-date branches
   - Restrict pushes

---

## 📁 New Folder Structure

After migration, your structure will be:

```
repz/
├── .nexus/                    # Nexus configuration
│   ├── adapter/              # Supabase adapter
│   ├── config/               # Tier configurations
│   └── scripts/              # Automation scripts
├── environments/             # Environment configs
│   ├── dev/
│   ├── staging/
│   └── production/
├── src/
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   ├── features/        # Feature components
│   │   ├── shared/          # Shared components
│   │   └── layouts/         # Layout components
│   ├── services/            # Business logic
│   ├── hooks/               # Custom hooks
│   ├── types/               # TypeScript types
│   ├── config/              # Configuration
│   └── lib/                 # Utilities
├── supabase/                # Supabase backend (unchanged)
└── .github/workflows/       # CI/CD pipelines
```

---

## 🔄 Development Workflow

### Daily Development
```bash
# Work on dev branch
git checkout app/dev
git pull origin app/dev

# Start local development
npm run dev:supabase

# Make changes...

# Push to trigger deployment
git add .
git commit -m "feat: new feature"
git push origin app/dev
```

### Deploy to Staging
```bash
# Create PR from app/dev to app/main
# PR triggers tests and preview deployment
# Merge triggers staging deployment
```

### Deploy to Production
```bash
# Create PR from app/main to production
# PR triggers full test suite and security scan
# Merge triggers production deployment
```

---

## 📊 Tier Management

### Accessing Tier Configuration
```typescript
import { repzConfig } from './.nexus/adapter/supabase';

// Get tier details
const coreTier = repzConfig.tiers.core;

// Check if feature is available
const hasFeature = repzConfig.tiers.adaptive.features.includes('wearable_integration');

// Check limits
const consultationLimit = repzConfig.tiers.performance.limits.consultations;
```

### Updating Tiers
Edit `.nexus/config/tiers.json`:
- Add new tiers
- Update prices
- Modify features
- Adjust limits

---

## 🚨 Troubleshooting

### Migration Issues
```bash
# Restore from backup if needed
git checkout backup-before-transformation
git reset --hard HEAD

# Re-run migration
npx ts-node .nexus/scripts/migrate-structure.ts
```

### Deployment Failures
Check GitHub Actions logs:
1. **QA failures** - Fix lint/test errors
2. **Migration failures** - Check Supabase access
3. **Deploy failures** - Verify Vercel configuration

### Environment Variable Issues
1. Ensure all secrets are added to GitHub
2. Verify Vercel environment variables
3. Check `.env.example` for required variables

---

## 📚 Additional Resources

- [Full Transformation Plan](../../../docs/REPZ-TRANSFORMATION-PLAN.md)
- [Nexus Framework Documentation](../../../docs/NEXUS-FRAMEWORK.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## 🎯 Success Metrics

After transformation:
- ✅ Setup time < 30 minutes for new developers
- ✅ PR to deployment < 10 minutes
- ✅ 0 manual deployment steps
- ✅ Automated quality gates
- ✅ Environment isolation

---

**Need help?** Check the transformation plan or create an issue in the repository.
