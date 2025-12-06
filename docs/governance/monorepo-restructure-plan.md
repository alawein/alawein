# Monorepo Restructure & Consolidation Plan

## Current State Analysis

### Issues Identified
1. **Scattered Structure**: Organizations, apps, tools, and root-level files mixed without clear hierarchy
2. **Duplicate Tooling**: Multiple automation systems, CI/CD configs, and build tools
3. **Inconsistent node_modules**: Root-level + project-level dependencies
4. **MetaHub Fragmentation**: `.metaHub` directory not centralized
5. **Root Pollution**: 40+ root-level files causing confusion

### Current Size Distribution
- **organizations**: 3.6GB (5 orgs, multiple projects)
- **apps**: 3.3GB (5 applications)
- **tools**: 13.98MB (25+ utilities)
- **Root files**: 40+ configuration/documentation files

## Target Monorepo Structure

```
GitHub/
├── .metaHub/                    # Centralized CI/CD & tooling
│   ├── ci-cd/                   # All CI/CD pipelines
│   ├── tooling/                 # Shared build tools & configs
│   ├── automation/              # Consolidated automation systems
│   ├── templates/               # Project templates
│   └── governance/              # Code standards & policies
├── organizations/               # Company/LLC scoped projects
│   ├── repz-llc/
│   │   ├── repz/               # Main REPZ application
│   │   ├── repz-coach/         # Coaching platform
│   │   └── repz-api/           # Backend services
│   ├── alawein-technologies-llc/
│   │   ├── attributa/          # Scientific platform
│   │   ├── simcore/            # Simulation core
│   │   └── llmworks/           # LLM platform
│   └── live-it-iconic-llc/
│       └── liveiticonic/       # Live events platform
├── platforms/                   # Shared platform applications
│   ├── portfolio/              # Portfolio site
│   ├── qmlab/                  # Quantum lab
│   └── shared/                 # Platform-agnostic code
├── packages/                    # Shared libraries & utilities
│   ├── ui/                     # Shared UI components
│   ├── utils/                  # Common utilities
│   ├── types/                  # TypeScript definitions
│   └── configs/                # Shared configurations
├── docs/                       # Documentation hub
│   ├── architecture/          # System architecture
│   ├── guides/                # Development guides
│   └── api/                   # API documentation
└── archive/                    # Archived projects
    └── legacy/                # Old implementations
```

## Implementation Strategy

### Phase 1: MetaHub Centralization
1. **Move all CI/CD to `.metaHub/ci-cd/`**
   - Consolidate GitHub Actions workflows
   - Merge Docker configurations
   - Centralize deployment scripts

2. **Unify Tooling in `.metaHub/tooling/`**
   - Single ESLint/Prettier config
   - Shared TypeScript configuration
   - Unified build system (Turborepo)

3. **Merge Automation Systems**
   - Consolidate `tools/automation` + `automation-ts`
   - Move to `.metaHub/automation/`
   - Create single CLI interface

### Phase 2: Organization Restructure
1. **Standardize Organization Layout**
   ```
   organizations/{org-name}/{project-name}/
   ├── apps/                   # Application code
   ├── packages/              # Project-specific packages
   ├── docs/                  # Project documentation
   └── tools/                 # Project-specific tools
   ```

2. **Move Projects to Proper Scopes**
   - REPZ projects → `organizations/repz-llc/`
   - Scientific platforms → `organizations/alawein-technologies-llc/`
   - Live platforms → `organizations/live-it-iconic-llc/`

### Phase 3: Platform Consolidation
1. **Extract Shared Code**
   - Move reusable components to `packages/`
   - Create shared configurations
   - Establish common patterns

2. **Standardize Apps Structure**
   ```
   platforms/{app-name}/
   ├── src/                   # Source code
   ├── public/                # Static assets
   ├── tests/                 # Test files
   ├── docs/                  # App documentation
   └── package.json          # Dependencies
   ```

### Phase 4: Node Modules Strategy
1. **Workspace-Level Dependencies**
   - Remove root `node_modules`
   - Use npm/yarn workspaces
   - Implement dependency caching

2. **Shared Dependencies**
   - Move common deps to root `package.json`
   - Use peer dependencies for shared libs
   - Implement lock file optimization

### Phase 5: Root Level Cleanup
1. **Consolidate Documentation**
   - Move all docs to `docs/`
   - Create single README.md
   - Organize by category

2. **Centralize Configuration**
   - Move configs to `.metaHub/configs/`
   - Create symlinks where needed
   - Document configuration hierarchy

## Migration Commands

### Phase 1 Commands
```bash
# Create MetaHub structure
mkdir -p .metaHub/{ci-cd,tooling,automation,templates,governance}

# Move CI/CD files
mv .github/workflows .metaHub/ci-cd/
mv docker-compose.yml Dockerfile .metaHub/ci-cd/
mv turbo.json .metaHub/tooling/

# Consolidate automation
mv tools/automation .metaHub/automation/
mv automation-ts/* .metaHub/automation/typescript/
```

### Phase 2 Commands
```bash
# Standardize organization structure
for org in organizations/*/; do
  mkdir -p $org/{apps,packages,docs,tools}
done

# Move projects to proper scopes
mv organizations/repz-llc/repz organizations/repz-llc/apps/
```

### Phase 3 Commands
```bash
# Create packages structure
mkdir -p packages/{ui,utils,types,configs}

# Extract shared code
find organizations/ -name "*.tsx" -path "*/components/*" | head -10
```

## Governance & Standards

### Code Organization Rules
1. **Organization Scope**: LLC/company-specific projects
2. **Platform Scope**: Cross-organization applications
3. **Package Scope**: Reusable libraries
4. **MetaHub Scope**: Infrastructure & tooling

### Naming Conventions
- **Organizations**: `{llc-name}/` (kebab-case)
- **Projects**: `{project-name}/` (kebab-case)
- **Packages**: `@{scope}/{name}` (npm package naming)
- **Apps**: `{app-name}/` (kebab-case)

### Dependency Management
- **Root**: Shared dev dependencies
- **Organizations**: Org-specific dependencies
- **Projects**: Application dependencies
- **Packages**: Library dependencies

## Success Metrics

### Structural Metrics
- [ ] Root file count < 10
- [ ] Single CI/CD source of truth
- [ ] Unified build system
- [ ] Clear separation of concerns

### Performance Metrics
- [ ] Build time reduction > 30%
- [ ] Dependency deduplication > 50%
- [ ] CI/CD pipeline optimization > 40%

### Maintainability Metrics
- [ ] Code sharing > 60%
- [ ] Configuration duplication < 10%
- [ ] Documentation coverage > 90%

## Rollback Plan
1. Git stash before each phase
2. Branch per major change
3. Automated validation scripts
4. Rollback automation ready

## Timeline
- **Phase 1**: 2-3 days (MetaHub centralization)
- **Phase 2**: 3-4 days (Organization restructure)
- **Phase 3**: 2-3 days (Platform consolidation)
- **Phase 4**: 1-2 days (Node modules strategy)
- **Phase 5**: 1-2 days (Root cleanup)
- **Total**: 9-14 days

## Next Steps
1. Review and approve this plan
2. Create feature branches for each phase
3. Set up validation automation
4. Begin Phase 1 implementation
