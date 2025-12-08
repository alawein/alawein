# CI/CD Pipeline Unification Prompt

## Objective
Unify multiple CI/CD pipeline definitions into a single, composable, elegant pipeline system.

## Current State
- Multiple pipeline definitions
- Inconsistent pipeline patterns
- Duplicated pipeline logic
- Complex pipeline dependencies
- Difficult to maintain pipelines
- Unclear pipeline flow
- Scattered pipeline configuration

## Target State
- Single unified pipeline engine
- Clear, reusable pipeline patterns
- Minimal pipeline duplication
- Simple pipeline composition
- Easy pipeline maintenance
- Clear pipeline flow
- Centralized pipeline configuration

## Consolidation Strategy

### Phase 1: Pipeline Inventory & Analysis
```
1. Catalog all pipelines
   - Pipeline name and location
   - Pipeline purpose and triggers
   - Pipeline stages and steps
   - Pipeline dependencies
   - Pipeline configuration

2. Identify pipeline patterns
   - Build patterns
   - Test patterns
   - Deploy patterns
   - Release patterns
   - Security patterns

3. Analyze pipeline duplication
   - Duplicate stages
   - Duplicate steps
   - Duplicate conditions
   - Duplicate error handling

4. Map pipeline dependencies
   - Stage dependencies
   - Step dependencies
   - Tool dependencies
   - Secret dependencies
```

### Phase 2: Unified Pipeline Engine
```
Create engine with:

1. Pipeline Definition System
   - Pipeline templates
   - Stage definitions
   - Step definitions
   - Condition definitions

2. Pipeline Composition System
   - Compose pipelines from stages
   - Compose stages from steps
   - Compose steps from actions
   - Validate composition

3. Pipeline Execution System
   - Execute pipelines
   - Execute stages in sequence/parallel
   - Execute steps in sequence/parallel
   - Handle errors and retries

4. Pipeline Monitoring System
   - Track pipeline status
   - Track stage status
   - Track step status
   - Generate reports
```

### Phase 3: Unified Pipeline Structure
```
Create structure:

pipelines/
├── README.md
├── PATTERNS.md
├── templates/
│   ├── base-pipeline.yaml
│   ├── build-pipeline.yaml
│   ├── test-pipeline.yaml
│   ├── deploy-pipeline.yaml
│   ├── release-pipeline.yaml
│   └── security-pipeline.yaml
├── stages/
│   ├── checkout.yaml
│   ├── setup.yaml
│   ├── build.yaml
│   ├── test.yaml
│   ├── security-scan.yaml
│   ├── deploy.yaml
│   ├── smoke-test.yaml
│   └── notify.yaml
├── steps/
│   ├── install-dependencies.yaml
│   ├── run-linter.yaml
│   ├── run-tests.yaml
│   ├── build-artifacts.yaml
│   ├── run-security-scan.yaml
│   ├── deploy-to-env.yaml
│   └── run-smoke-tests.yaml
├── actions/
│   ├── checkout/
│   ├── setup-environment/
│   ├── install-dependencies/
│   ├── run-linter/
│   ├── run-tests/
│   ├── build-artifacts/
│   ├── run-security-scan/
│   ├── deploy/
│   └── notify/
├── config/
│   ├── defaults.yaml
│   ├── environments.yaml
│   └── secrets.yaml
└── examples/
    ├── simple-pipeline.yaml
    ├── complex-pipeline.yaml
    └── multi-stage-pipeline.yaml
```

### Phase 4: Pipeline Composition Framework
```
Implement framework:

1. Pipeline Templates
   - Base pipeline template
   - Build pipeline template
   - Test pipeline template
   - Deploy pipeline template
   - Release pipeline template

2. Stage Library
   - Checkout stage
   - Setup stage
   - Build stage
   - Test stage
   - Security scan stage
   - Deploy stage
   - Smoke test stage
   - Notify stage

3. Step Library
   - Install dependencies step
   - Run linter step
   - Run tests step
   - Build artifacts step
   - Run security scan step
   - Deploy to environment step
   - Run smoke tests step

4. Action Library
   - Checkout action
   - Setup environment action
   - Install dependencies action
   - Run linter action
   - Run tests action
   - Build artifacts action
   - Run security scan action
   - Deploy action
   - Notify action
```

## Unified Pipeline Format

### Pipeline Template
```yaml
# pipelines/templates/build-pipeline.yaml

name: Build Pipeline
version: "1.0"
description: Standard build pipeline for all projects

triggers:
  - push:
      branches: [main, develop]
  - pull_request:
      branches: [main, develop]

variables:
  NODE_VERSION: "18"
  PYTHON_VERSION: "3.11"
  TIMEOUT: 30

stages:
  - name: Checkout
    uses: ./stages/checkout.yaml
    
  - name: Setup
    uses: ./stages/setup.yaml
    with:
      node-version: ${{ variables.NODE_VERSION }}
      python-version: ${{ variables.PYTHON_VERSION }}
    
  - name: Build
    uses: ./stages/build.yaml
    needs: [Checkout, Setup]
    
  - name: Test
    uses: ./stages/test.yaml
    needs: [Build]
    
  - name: Security Scan
    uses: ./stages/security-scan.yaml
    needs: [Build]
    
  - name: Notify
    uses: ./stages/notify.yaml
    needs: [Test, Security Scan]
    if: always()

on_failure:
  - name: Cleanup
    uses: ./stages/cleanup.yaml
  - name: Notify Failure
    uses: ./stages/notify-failure.yaml
```

### Stage Definition
```yaml
# pipelines/stages/build.yaml

name: Build Stage
version: "1.0"
description: Build artifacts

steps:
  - name: Install Dependencies
    uses: ./steps/install-dependencies.yaml
    
  - name: Run Linter
    uses: ./steps/run-linter.yaml
    
  - name: Build Artifacts
    uses: ./steps/build-artifacts.yaml
    
  - name: Upload Artifacts
    uses: actions/upload-artifact@v3
    with:
      name: build-${{ github.sha }}
      path: dist/

timeout: 30
retry: 2
```

### Step Definition
```yaml
# pipelines/steps/build-artifacts.yaml

name: Build Artifacts
version: "1.0"
description: Build project artifacts

runs:
  using: composite
  steps:
    - name: Build
      run: npm run build
      shell: bash
    
    - name: Verify Build
      run: |
        if [ ! -d "dist" ]; then
          echo "Build failed: dist directory not found"
          exit 1
        fi
      shell: bash

timeout: 15
retry: 1
```

## Pipeline Composition Example

### Simple Pipeline
```yaml
# .github/workflows/simple-pipeline.yaml

name: Simple CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ./pipelines/templates/build-pipeline.yaml
```

### Complex Pipeline
```yaml
# .github/workflows/complex-pipeline.yaml

name: Complex CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * *'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ./pipelines/templates/build-pipeline.yaml
  
  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ./pipelines/templates/deploy-pipeline.yaml
        with:
          environment: staging
  
  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ./pipelines/templates/deploy-pipeline.yaml
        with:
          environment: production
```

## Pipeline Execution Engine

### Pipeline Executor
```javascript
// pipelines/executor.js

class PipelineExecutor {
  async execute(pipelineDefinition) {
    const stages = pipelineDefinition.stages;
    const results = {};
    
    for (const stage of stages) {
      try {
        console.log(`Executing stage: ${stage.name}`);
        
        // Check dependencies
        if (stage.needs) {
          for (const dependency of stage.needs) {
            if (!results[dependency] || !results[dependency].success) {
              throw new Error(`Dependency ${dependency} failed`);
            }
          }
        }
        
        // Execute stage
        const result = await this.executeStage(stage);
        results[stage.name] = result;
        
        if (!result.success) {
          throw new Error(`Stage ${stage.name} failed`);
        }
      } catch (error) {
        console.error(`Stage ${stage.name} failed:`, error);
        results[stage.name] = { success: false, error };
        
        // Execute failure handlers
        if (pipelineDefinition.on_failure) {
          await this.executeFailureHandlers(pipelineDefinition.on_failure);
        }
        
        throw error;
      }
    }
    
    return results;
  }
  
  async executeStage(stage) {
    const steps = stage.steps;
    const results = {};
    
    for (const step of steps) {
      try {
        console.log(`  Executing step: ${step.name}`);
        const result = await this.executeStep(step);
        results[step.name] = result;
      } catch (error) {
        console.error(`  Step ${step.name} failed:`, error);
        return { success: false, error, results };
      }
    }
    
    return { success: true, results };
  }
  
  async executeStep(step) {
    // Execute step logic
    return { success: true };
  }
}

module.exports = PipelineExecutor;
```

## Migration Plan

### Step 1: Audit & Categorize
- [ ] Catalog all pipelines
- [ ] Categorize by type
- [ ] Identify patterns
- [ ] Map dependencies

### Step 2: Create Unified System
- [ ] Create directory structure
- [ ] Create pipeline templates
- [ ] Create stage library
- [ ] Create step library
- [ ] Create action library

### Step 3: Migrate Pipelines
- [ ] Migrate build pipelines
- [ ] Migrate test pipelines
- [ ] Migrate deploy pipelines
- [ ] Migrate release pipelines
- [ ] Migrate security pipelines

### Step 4: Implement Executor
- [ ] Implement pipeline executor
- [ ] Implement stage executor
- [ ] Implement step executor
- [ ] Implement error handling

### Step 5: Validate & Deploy
- [ ] Validate all pipelines
- [ ] Test pipeline execution
- [ ] Gather feedback
- [ ] Deploy to production

## Success Metrics
- [ ] 65% reduction in pipeline files
- [ ] 100% of pipelines using unified patterns
- [ ] <5% pipeline duplication
- [ ] <2 minute average pipeline startup time
- [ ] 100% pipeline test coverage
- [ ] Zero pipeline failures due to consolidation
- [ ] Developer satisfaction >8/10

## Rollback Procedures
1. Keep all original pipelines in archive
2. Maintain compatibility layer
3. Monitor for issues
4. Rollback if needed
5. Document lessons learned

## Validation Checkpoints
- [ ] All pipelines cataloged
- [ ] Patterns extracted
- [ ] Templates created
- [ ] First pipeline migrated
- [ ] Parallel validation running
- [ ] All pipelines migrated
- [ ] Performance validated
- [ ] Documentation complete