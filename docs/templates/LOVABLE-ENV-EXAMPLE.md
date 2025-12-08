---
document_metadata:
  title: "Lovable.dev Environment Variables Template"
  document_id: "LOVABLE-ENV-TEMPLATE-001"
  version: "1.0.0"
  status: "Active"
  classification: "Internal"
  
  dates:
    created: "2025-12-07"
    last_updated: "2025-12-07"
    next_review: "2026-03-07"
    
  ownership:
    owner: "DevOps Team"
    maintainer: "Platform Engineers"
    reviewers: ["Development Teams", "Security Lead"]
    
  change_summary: |
    [2025-12-07] Initial environment variables template creation
    - Standardized environment configuration for Lovable.dev projects
    - Added Supabase, API, and feature flag examples
    - Included security and deployment variables
    
  llm_context:
    purpose: "Standardized environment variables template for Lovable.dev projects in the monorepo"
    scope: "Environment configuration, API keys, feature flags, deployment settings"
    key_concepts: ["environment variables", "supabase", "api", "configuration", "security"]
    related_documents: ["LOVABLE-MIGRATION-GUIDE.md", "LOVABLE-README-TEMPLATE.md"]
---

# Lovable.dev Environment Variables Template

> **Standardized environment configuration** for Lovable.dev projects integrated into the Alawein Technologies Monorepo.

## 📋 .env.example Template

Create a `.env.example` file in your project root with the following structure:

```bash
# =============================================================================
# Lovable.dev Environment Variables
# =============================================================================
# Copy this file to .env.local and fill in your actual values
# Never commit .env.local to version control

# -----------------------------------------------------------------------------
# Development Configuration
# -----------------------------------------------------------------------------
# Development server URL
VITE_APP_URL=http://localhost:5173

# API configuration
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# Enable/disable development features
VITE_DEV_MODE=true
VITE_ENABLE_DEVTOOLS=true

# -----------------------------------------------------------------------------
# Supabase Configuration (if using Supabase)
# -----------------------------------------------------------------------------
# Get these from your Supabase project settings
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: Supabase service role (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# -----------------------------------------------------------------------------
# Authentication Configuration
# -----------------------------------------------------------------------------
# Authentication provider settings
VITE_AUTH_PROVIDER=supabase
VITE_ENABLE_SIGN_UP=true
VITE_ENABLE_MAGIC_LINK=true

# Session configuration
VITE_SESSION_TIMEOUT=3600000
VITE_AUTO_REFRESH_TOKEN=true

# -----------------------------------------------------------------------------
# Database Configuration
# -----------------------------------------------------------------------------
# Database connection (if not using Supabase)
VITE_DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Connection pool settings
VITE_DB_POOL_SIZE=10
VITE_DB_TIMEOUT=5000

# -----------------------------------------------------------------------------
# External API Configuration
# -----------------------------------------------------------------------------
# Stripe (if using payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
VITE_STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# SendGrid (if using email)
VITE_SENDGRID_API_KEY=SG.your-sendgrid-key

# Google Analytics
VITE_GA_MEASUREMENT_ID=G-YOUR-GA-ID

# Sentry (error tracking)
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# -----------------------------------------------------------------------------
# Feature Flags
# -----------------------------------------------------------------------------
# Enable/disable features
VITE_ENABLE_BETA_FEATURES=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CRASH_REPORTING=true

# Experimental features
VITE_EXPERIMENTAL_DARK_MODE=true
VITE_EXPERIMENTAL_OFFLINE_MODE=false

# -----------------------------------------------------------------------------
# UI/UX Configuration
# -----------------------------------------------------------------------------
# Theme and branding
VITE_DEFAULT_THEME=light
VITE_DEFAULT_LOCALE=en
VITE_ENABLE_THEMES=true

# Animation and performance
VITE_ENABLE_ANIMATIONS=true
VITE_REDUCED_MOTION=false
VITE_LAZY_LOAD_IMAGES=true

# -----------------------------------------------------------------------------
# Deployment Configuration
# -----------------------------------------------------------------------------
# Deployment environment
VITE_DEPLOYMENT_ENV=development
VITE_BUILD_TARGET=es2020

# CDN and assets
VITE_CDN_URL=https://cdn.your-domain.com
VITE_ASSETS_URL=/assets

# -----------------------------------------------------------------------------
# Security Configuration
# -----------------------------------------------------------------------------
# CORS settings
VITE_CORS_ORIGIN=http://localhost:5173
VITE_CORS_CREDENTIALS=true

# Rate limiting
VITE_RATE_LIMIT_WINDOW=900000
VITE_RATE_LIMIT_MAX=100

# -----------------------------------------------------------------------------
# Monitoring and Analytics
# -----------------------------------------------------------------------------
# Performance monitoring
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_PERFORMANCE_SAMPLE_RATE=0.1

# User analytics
VITE_TRACK_USER_EVENTS=true
VITE_ANONYMIZE_IPS=true

# -----------------------------------------------------------------------------
# Development Tools
# -----------------------------------------------------------------------------
# Hot reload settings
VITE_HMR_OVERLAY=true
VITE_HMR_TIMEOUT=2000

# Debugging
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info

# -----------------------------------------------------------------------------
# Testing Configuration
# -----------------------------------------------------------------------------
# Test environment settings
VITE_TEST_MODE=false
VITE_MOCK_APIS=false
VITE_TEST_TIMEOUT=5000

# -----------------------------------------------------------------------------
# Third-party Integrations
# -----------------------------------------------------------------------------
# OpenAI (if using AI features)
VITE_OPENAI_API_KEY=sk-your-openai-key
VITE_OPENAI_MODEL=gpt-3.5-turbo

# Firebase (if using Firebase)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id

# Algolia (if using search)
VITE_ALGOLIA_APP_ID=your-algolia-app-id
VITE_ALGOLIA_SEARCH_KEY=your-algolia-search-key
```

## 🔧 Setup Instructions

### 1. Create Environment File

```bash
# Copy the template to your local environment file
cp .env.example .env.local
```

### 2. Fill in Your Values

Edit `.env.local` with your actual configuration values:

```bash
# Use your favorite editor
nano .env.local

# Or use VS Code
code .env.local
```

### 3. Validate Configuration

Run the validation script to ensure all required variables are set:

```bash
# Validate environment setup
bash scripts/validate-migration.sh
```

## 🔒 Security Best Practices

### Do's
- ✅ Use `.env.local` for local development
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use different keys for development/staging/production
- ✅ Rotate API keys regularly
- ✅ Use environment-specific configurations

### Don'ts
- ❌ Never commit `.env.local` to version control
- ❌ Don't use production keys in development
- ❌ Don't share API keys in public repositories
- ❌ Don't hardcode secrets in your code

## 🌍 Environment-Specific Files

### Development
- **File**: `.env.local`
- **Purpose**: Local development configuration
- **Scope**: Development only

### Staging
- **File**: `.env.staging`
- **Purpose**: Staging environment configuration
- **Scope**: Testing and preview deployments

### Production
- **File**: `.env.production`
- **Purpose**: Production configuration
- **Scope**: Live deployments

## 🚀 Deployment Variables

### Vercel (Recommended)

Set environment variables in Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add your production variables
4. Deploy with `vercel --prod`

### Docker

Create environment file for Docker:

```bash
# Create production environment file
cp .env.example .env.production

# Build and run with Docker
docker build --build-arg ENV_FILE=.env.production -t your-app .
docker run --env-file .env.production your-app
```

### CI/CD

Set secrets in your CI/CD platform:

```yaml
# GitHub Actions example
env:
  VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

## 🔍 Variable Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_URL` | Application URL | `http://localhost:5173` |
| `VITE_API_URL` | API endpoint URL | `http://localhost:3001` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOi...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_DEFAULT_THEME` | Default UI theme | `light` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `true` |
| `VITE_DEV_MODE` | Development mode flag | `true` |

### Feature Flags

| Variable | Description | Impact |
|----------|-------------|--------|
| `VITE_ENABLE_BETA_FEATURES` | Enable beta features | UI changes |
| `VITE_EXPERIMENTAL_DARK_MODE` | Dark mode support | Theme system |
| `VITE_ENABLE_THEMES` | Multiple themes | Theme switcher |

## 🧪 Testing Environment Variables

### Mock Configuration

For testing without real services:

```bash
# .env.test
VITE_TEST_MODE=true
VITE_MOCK_APIS=true
VITE_SUPABASE_URL=http://localhost:3001/mock
VITE_SUPABASE_ANON_KEY=mock-key
```

### Validation Script

Test your environment setup:

```bash
# Validate all required variables are set
node scripts/validate-env.js

# Test API connectivity
pnpm test:api
```

## 📚 Additional Resources

- **[Security Guide](../../../docs/security.md)** - Security best practices
- **[Deployment Guide](./DEPLOYMENT.md)** - Deployment instructions
- **[Migration Guide](./LOVABLE-MIGRATION-GUIDE.md)** - Complete migration process

## 🆘 Troubleshooting

### Common Issues

**Variable not found:**
```bash
# Check if variable is set
echo $VITE_SUPABASE_URL

# Restart development server
pnpm dev
```

**API connection failed:**
```bash
# Verify API URL is accessible
curl $VITE_API_URL/health

# Check CORS settings
```

**Build fails in production:**
```bash
# Ensure all required variables are set
grep -r "VITE_" .env.production

# Check for missing secrets in deployment platform
```

---

*This template ensures consistent environment configuration across all Lovable.dev projects in the monorepo.*
