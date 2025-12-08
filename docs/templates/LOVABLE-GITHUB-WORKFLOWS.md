---
document_metadata:
  title: "Lovable.dev GitHub Workflows Template"
  document_id: "LOVABLE-WORKFLOWS-TEMPLATE-001"
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
    [2025-12-07] Initial Lovable.dev GitHub workflows template
    - Standardized CI/CD workflows for monorepo integration
    - Added security scanning and dependency checks
    - Included deployment and testing workflows
    
  llm_context:
    purpose: "Standardized GitHub workflows template for Lovable.dev projects in the monorepo"
    scope: "CI/CD, security, testing, deployment workflows"
    key_concepts: ["github actions", "workflows", "ci/cd", "monorepo", "security"]
    related_documents: ["LOVABLE-README-TEMPLATE.md", "LOVABLE-DEV-WORKFLOW.md"]
---

# Lovable.dev GitHub Workflows Template

> **Standardized GitHub Actions workflows** for Lovable.dev projects integrated into the Alawein Technologies Monorepo.

## 🚀 Overview

These workflows replace the default Lovable.dev workflows with monorepo-optimized versions that include:

- **Security scanning** and dependency checks
- **Monorepo-aware** caching and builds
- **Standardized** testing and deployment
- **Brand compliance** checks

## 📁 Directory Structure

```text
.github/
├── workflows/
│   ├── ci.yml                 # Continuous Integration
│   ├── security.yml           # Security Scanning
│   ├── deploy.yml             # Deployment Pipeline
│   ├── dependency-review.yml  # Dependency Security
│   └── codeql.yml            # CodeQL Analysis
├── ISSUE_TEMPLATE/
│   └── bug_report.md         # Standardized bug reports
└── PULL_REQUEST_TEMPLATE.md  # Standardized PR template
```

## 🔧 Workflow Files

### 1. CI Workflow (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'

jobs:
  test:
    name: Test and Build
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
          
      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV
          
      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
            
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Type check
        run: pnpm type-check
        
      - name: Lint
        run: pnpm lint
        
      - name: Test
        run: pnpm test
        
      - name: Build
        run: pnpm build
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
          retention-days: 1
```

### 2. Security Workflow (`.github/workflows/security.yml`)

```yaml
name: Security

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday 2 AM

jobs:
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
          
      - name: Audit dependencies
        run: |
          npm audit --audit-level moderate
          pnpm audit --audit-level moderate
```

### 3. Deployment Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'

jobs:
  deploy:
    name: Deploy to ${{ github.event.inputs.environment || 'staging' }}
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment || 'staging' }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build
        run: pnpm build
        
      - name: Deploy to Vercel
        if: github.event.inputs.environment == 'production' || github.ref == 'refs/heads/main'
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          
      - name: Deploy to Staging
        if: github.event.inputs.environment == 'staging'
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 4. CodeQL Analysis (`.github/workflows/codeql.yml`)

```yaml
name: "CodeQL"

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # Weekly

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write
      
    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript' ]
        
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}
          
      - name: Autobuild
        uses: github/codeql-action/autobuild@v2
        
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

## 📝 Templates

### Issue Template (`.github/ISSUE_TEMPLATE/bug_report.md`)

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### Pull Request Template (`.github/PULL_REQUEST_TEMPLATE.md`)

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Build passes successfully

## Screenshots (if applicable)
Add screenshots to illustrate changes.

## Additional Notes
Any additional information about the change.
```

## 🔧 Integration Instructions

### 1. Replace Existing Workflows

```bash
# Remove existing Lovable workflows
rm -rf .github/workflows/*

# Copy monorepo workflows
cp -r docs/templates/lovable-workflows/* .github/
```

### 2. Update Repository Settings

**Required Secrets:**
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID  
- `VERCEL_PROJECT_ID` - Vercel project ID

**Branch Protection:**
- Enable protection on `main` branch
- Require PR reviews
- Require status checks to pass
- Require up-to-date branches

### 3. Environment Configuration

```bash
# Set up environments in GitHub Settings
# - staging: Preview deployments
# - production: Production deployments
```

## 🔍 Security Features

- **CodeQL Analysis** - Static code analysis
- **Trivy Scanning** - Container and dependency scanning
- **Dependency Audit** - Automated vulnerability detection
- **Secret Scanning** - GitHub's built-in secret detection

## 📊 Monitoring

- **Build Status** - Automated build and test reporting
- **Security Alerts** - Real-time vulnerability notifications
- **Deployment Tracking** - Deployment status and rollback capabilities
- **Performance Monitoring** - Integration with monitoring tools

## 🚀 Benefits

- **Standardized** workflows across all Lovable projects
- **Enhanced Security** with automated scanning
- **Faster Builds** with optimized caching
- **Better Testing** with comprehensive test coverage
- **Easy Deployment** with automated CI/CD

---

*These workflows are designed specifically for Lovable.dev projects integrated into the Alawein Technologies Monorepo.*
