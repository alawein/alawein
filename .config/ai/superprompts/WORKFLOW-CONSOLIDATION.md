# Workflow Consolidation Prompt

## Objective
Consolidate 29+ GitHub Actions workflows into a unified, elegant system with clear patterns and reusable components.

## Current State
- 29+ individual workflow files
- Multiple orchestration tools
- Scattered workflow patterns
- Inconsistent naming conventions
- Duplicated workflow logic
- Complex workflow dependencies

## Target State
- Single unified workflow engine
- Clear, reusable workflow patterns
- Centralized workflow configuration
- Consistent naming conventions
- Minimal workflow duplication
- Simple workflow composition

## Consolidation Strategy

### Phase 1: Workflow Inventory & Analysis
```
1. Catalog all 29+ workflows
   - Name and location
   - Purpose and triggers
   - Steps and dependencies
   - Reusable components
   - Unique requirements

2. Identify workflow patterns
   - CI/CD patterns
   - Deployment patterns
   - Testing patterns
   - Security patterns
   - Notification patterns

3. Analyze duplication
   - Duplicate steps
   - Duplicate conditions
   - Duplicate configurations
   - Duplicate error handling

4. Map dependencies
   - Workflow dependencies
   - Tool dependencies
   - Secret dependencies
   - Artifact dependencies
```

### Phase 2: Pattern Extraction
```
Extract reusable patterns:

1. CI Pattern
   - Checkout code
   - Setup environment
   - Install dependencies
   - Run linters
   - Run tests
   - Generate reports

2. Build Pattern
   - Checkout code
   - Setup environment
   - Build artifacts
   - Run tests
   - Generate reports

3. Deploy Pattern
   - Checkout code
   - Setup environment
   - Build artifacts
   - Deploy to environment
   - Run smoke tests
   - Notify

4. Security Pattern
   - Run security scans
   - Check dependencies
   - Generate SBOM
   - Report findings

5. Release Pattern
   - Checkout code
   - Build artifacts
   - Create release
   - Upload artifacts
   - Notify
```

### Phase 3: Unified Workflow Engine Design
```
Create unified engine with:

1. Workflow Composition System
   - Base workflow template
   - Workflow mixins
   - Workflow inheritance
   - Workflow composition

2. Step Library
   - Common steps
   - Step parameters
   - Step error handling
   - Step notifications

3. Configuration System
   - Workflow configuration
   - Environment configuration
   - Secret management
   - Matrix strategies

4. Orchestration System
   - Workflow triggering
   - Workflow sequencing
   - Workflow parallelization
   - Workflow dependencies

5. Monitoring System
   - Workflow status
   - Step status
   - Performance metrics
   - Error tracking
```

### Phase 4: Migration Strategy
```
1. Create unified workflow templates
   - Base templates for each pattern
   - Configuration examples
   - Migration guides

2. Migrate workflows incrementally
   - Start with simple workflows
   - Validate each migration
   - Gather feedback
   - Iterate

3. Maintain backward compatibility
   - Keep old workflows during transition
   - Create compatibility layer
   - Gradual deprecation

4. Validate migrations
   - Run parallel workflows
   - Compare results
   - Validate performance
   - Gather metrics
```

## Unified Workflow Structure

### Directory Structure
```
.github/
├── workflows/
│   ├── templates/
│   │   ├── ci.yml
│   │   ├── build.yml
│   │   ├── deploy.yml
│   │   ├── security.yml
│   │   └── release.yml
│   ├── patterns/
│   │   ├── checkout.yml
│   │   ├── setup.yml
│   │   ├── test.yml
│   │   ├── build.yml
│   │   ├── deploy.yml
│   │   └── notify.yml
│   ├── config/
│   │   ├── defaults.yml
│   │   ├── environments.yml
│   │   └── secrets.yml
│   └── [project-specific workflows]
├── actions/
│   ├── setup-environment/
│   ├── run-tests/
│   ├── build-artifacts/
│   ├── deploy/
│   └── notify/
└── scripts/
    ├── validate-workflow.sh
    ├── test-workflow.sh
    └── migrate-workflow.sh
```

### Workflow Composition Example
```yaml
name: Unified CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    uses: ./.github/workflows/templates/ci.yml
    with:
      node-version: 18
      python-version: "3.11"
      run-tests: true
      run-lint: true
    secrets: inherit

  build:
    needs: ci
    uses: ./.github/workflows/templates/build.yml
    with:
      artifact-name: build-${{ github.sha }}
    secrets: inherit

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    uses: ./.github/workflows/templates/deploy.yml
    with:
      environment: production
      artifact-name: build-${{ github.sha }}
    secrets: inherit
```

## Reusable Workflow Patterns

### CI Pattern
```yaml
name: CI Template
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: "18"
      python-version:
        type: string
        default: "3.11"
      run-tests:
        type: boolean
        default: true
      run-lint:
        type: boolean
        default: true

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ./.github/actions/setup-environment
        with:
          node-version: ${{ inputs.node-version }}
          python-version: ${{ inputs.python-version }}
      - if: ${{ inputs.run-lint }}
        uses: ./.github/actions/run-lint
      - if: ${{ inputs.run-tests }}
        uses: ./.github/actions/run-tests
```

## Configuration System

### Workflow Configuration
```yaml
# .github/workflows/config/defaults.yml
defaults:
  node-version: "18"
  python-version: "3.11"
  ubuntu-version: "ubuntu-latest"
  timeout-minutes: 30
  retry-attempts: 2

patterns:
  ci:
    timeout: 30
    retry: 2
    parallel: 4
  
  build:
    timeout: 45
    retry: 1
    parallel: 2
  
  deploy:
    timeout: 60
    retry: 0
    parallel: 1
```

## Success Metrics
- [ ] 70% reduction in workflow files
- [ ] 100% of workflows using unified patterns
- [ ] <5% workflow duplication
- [ ] <2 minute average workflow startup time
- [ ] 100% workflow test coverage
- [ ] Zero workflow failures due to consolidation
- [ ] Developer satisfaction >8/10

## Rollback Procedures
1. Keep all original workflows in archive
2. Maintain compatibility layer for 2 weeks
3. Monitor for issues during transition
4. Rollback individual workflows if needed
5. Document lessons learned

## Validation Checkpoints
- [ ] All workflows cataloged
- [ ] Patterns extracted
- [ ] Templates created
- [ ] First workflow migrated
- [ ] Parallel validation running
- [ ] All workflows migrated
- [ ] Performance validated
- [ ] Documentation complete