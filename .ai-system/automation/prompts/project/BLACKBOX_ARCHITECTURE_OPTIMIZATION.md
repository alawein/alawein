# BLACKBOX IDE: Architecture Optimization Superprompt

**Objective:** Leverage Blackbox AI's code analysis, refactoring, and optimization capabilities to systematically improve the monorepo architecture.

---

## PHASE 1: Dependency Consolidation & Workspace Setup

**Context:** The monorepo has duplicate dependencies across 12+ projects without workspace configuration.

**Task:**
1. Analyze all `package.json` files in `organizations/*/saas/*`, `organizations/*/mobile-apps/*`, and `packages/*`
2. Identify duplicate dependencies and version conflicts
3. Configure npm workspaces in root `package.json`
4. Create shared dependency packages in `packages/`
5. Update all project `package.json` files to use workspace dependencies

**Files to analyze:**
- `package.json` (root)
- `organizations/alawein-technologies-llc/saas/*/package.json`
- `organizations/alawein-technologies-llc/mobile-apps/*/package.json`
- `organizations/live-it-iconic-llc/ecommerce/*/package.json`
- `organizations/repz-llc/apps/*/package.json`

**Expected output:**
- Updated root `package.json` with workspaces configuration
- New `packages/shared-deps/package.json` with common dependencies
- Refactored project `package.json` files using workspace protocol
- Dependency version standardization report

**Success criteria:**
- All TypeScript versions aligned
- React/Vite versions consistent
- Radix UI components shared
- 30-50% reduction in node_modules size

---

## PHASE 2: Configuration Centralization

**Context:** Vite, TypeScript, ESLint, and Tailwind configs are duplicated across projects.

**Task:**
1. Extract common Vite configuration to `packages/vite-config/`
2. Create base TypeScript config in `packages/typescript-config/`
3. Consolidate ESLint rules to `packages/eslint-config/`
4. Standardize Tailwind config in `packages/tailwind-config/`
5. Update all projects to extend shared configs

**Files to refactor:**
- `organizations/*/saas/*/vite.config.ts` → `packages/vite-config/base.ts`
- `organizations/*/saas/*/tsconfig.json` → `packages/typescript-config/base.json`
- `organizations/*/saas/*/eslint.config.js` → `packages/eslint-config/index.js`
- `organizations/*/saas/*/tailwind.config.ts` → `packages/tailwind-config/base.js`

**Expected output:**
- 4 new shared config packages
- All projects using `extends` pattern
- Removed duplicate configuration code
- Centralized config management

**Success criteria:**
- Single source of truth for each config type
- Projects inherit from base configs
- Easy to update all projects simultaneously
- Reduced maintenance burden

---

## PHASE 3: Duplicate Code Elimination

**Context:** Research projects exist in both `organizations/` and `research/`, `.ai-system/` overlaps with `tools/`.

**Task:**
1. Analyze duplicate directories: `research/` vs `organizations/alawein-technologies-llc/research/`
2. Identify overlapping code in `.ai-system/automation/` and `tools/`
3. Merge duplicate research projects into canonical location
4. Consolidate `.ai-system/automation/` into `tools/automation/`
5. Update all import paths and references

**Directories to analyze:**
- `research/maglogic/` vs `organizations/.../research/`
- `.ai-system/automation/` vs `tools/`
- `.ai-system/knowledge/` vs `docs/`

**Expected output:**
- Single canonical location for each project
- Merged automation tooling
- Updated import statements
- Removed duplicate directories

**Success criteria:**
- No duplicate project directories
- All imports resolve correctly
- Documentation consolidated
- Reduced repository size

---

## PHASE 4: CI/CD Workflow Optimization

**Context:** 29 GitHub Actions workflows with significant duplication.

**Task:**
1. Analyze all workflows in `.github/workflows/`
2. Identify common patterns and duplicate jobs
3. Create reusable workflows for: testing, linting, security scanning, deployment
4. Consolidate similar workflows using matrix strategies
5. Reduce total workflows from 29 to ~15

**Files to refactor:**
- `.github/workflows/*.yml` (all 29 files)
- Create `.github/workflows/reusable-*.yml` templates

**Expected output:**
- 5-7 reusable workflow templates
- 15 consolidated workflows using reusable patterns
- Matrix builds for parallel execution
- Improved caching strategies

**Success criteria:**
- 50% reduction in workflow files
- Faster CI execution (parallel jobs)
- Easier workflow maintenance
- Consistent CI patterns

---

## PHASE 5: TypeScript Project References

**Context:** No incremental builds, slow type-checking, no project references.

**Task:**
1. Analyze TypeScript project dependencies
2. Configure project references in `tsconfig.json` files
3. Set up composite builds
4. Enable incremental compilation
5. Optimize build order

**Files to modify:**
- Root `tsconfig.json`
- `packages/*/tsconfig.json`
- `organizations/*/saas/*/tsconfig.json`

**Expected output:**
- Project references configured
- Composite builds enabled
- Build dependency graph established
- Incremental compilation working

**Success criteria:**
- 3-5x faster type-checking
- Incremental builds functional
- Proper build order
- Reduced CI time

---

## PHASE 6: Turborepo Build Orchestration

**Context:** Turborepo installed but not configured, no build caching.

**Task:**
1. Create `turbo.json` configuration
2. Define pipeline for build, test, lint, type-check
3. Configure remote caching
4. Set up task dependencies
5. Optimize parallel execution

**Files to create/modify:**
- `turbo.json` (create)
- `package.json` scripts (update to use turbo)
- `.github/workflows/ci.yml` (add turbo caching)

**Expected output:**
- Complete Turborepo configuration
- Build pipeline defined
- Remote caching enabled
- Parallel task execution

**Success criteria:**
- 5-10x faster builds with cache
- Parallel execution working
- Only changed packages rebuild
- CI time reduced by 60%+

---

## PHASE 7: Code Splitting & Bundle Optimization

**Context:** No lazy loading, suboptimal code splitting, large bundle sizes.

**Task:**
1. Analyze bundle sizes for all SaaS projects
2. Implement route-based code splitting
3. Optimize vendor chunk splitting
4. Add lazy loading for heavy components
5. Configure bundle size budgets

**Files to optimize:**
- `organizations/*/saas/*/src/App.tsx` (add lazy loading)
- `organizations/*/saas/*/vite.config.ts` (optimize chunks)
- Add `bundlesize.config.json` to each project

**Expected output:**
- Route-based code splitting implemented
- Optimized vendor chunks
- Lazy-loaded components
- Bundle size budgets enforced

**Success criteria:**
- Initial bundle < 200KB
- Lazy loading for routes
- Vendor chunks optimized
- Performance budget passing

---

## PHASE 8: Shared Component Library

**Context:** Radix UI components duplicated across projects, no shared UI library.

**Task:**
1. Create `packages/ui-components/` package
2. Extract common components from SaaS projects
3. Build shared component library with Radix UI
4. Add Storybook for component documentation
5. Update projects to use shared components

**Files to create:**
- `packages/ui-components/src/` (Button, Dialog, Select, etc.)
- `packages/ui-components/.storybook/`
- Update all SaaS projects to import from `@packages/ui-components`

**Expected output:**
- Shared UI component library
- Storybook documentation
- All projects using shared components
- Consistent design system

**Success criteria:**
- 20+ shared components
- Zero component duplication
- Storybook running
- Design consistency across apps

---

## PHASE 9: API Client Abstraction

**Context:** Direct Supabase client usage creates tight coupling.

**Task:**
1. Create `packages/api-client/` abstraction layer
2. Wrap Supabase client behind interface
3. Add type-safe API methods
4. Implement error handling and retry logic
5. Update all projects to use abstraction

**Files to create:**
- `packages/api-client/src/client.ts`
- `packages/api-client/src/types.ts`
- `packages/api-client/src/hooks.ts` (React hooks)

**Expected output:**
- API client abstraction package
- Type-safe API methods
- Centralized error handling
- Easy to swap backends

**Success criteria:**
- No direct Supabase imports in apps
- Type-safe API calls
- Consistent error handling
- Backend-agnostic architecture

---

## PHASE 10: Monitoring & Observability Setup

**Context:** No error tracking, logging, or performance monitoring.

**Task:**
1. Integrate Sentry for error tracking
2. Add structured logging utility
3. Implement performance monitoring
4. Create observability dashboard
5. Add health check endpoints

**Files to create:**
- `packages/observability/src/sentry.ts`
- `packages/observability/src/logger.ts`
- `packages/observability/src/performance.ts`
- Add to all SaaS projects

**Expected output:**
- Sentry integration
- Structured logging
- Performance tracking
- Health check endpoints

**Success criteria:**
- Errors tracked in Sentry
- Logs structured and searchable
- Performance metrics collected
- Health checks responding

---

## PHASE 11: Database Schema Documentation

**Context:** No schema documentation, migrations not in version control.

**Task:**
1. Generate schema documentation from Supabase
2. Create ER diagrams for each database
3. Document RLS policies
4. Add migration files to version control
5. Create schema validation tests

**Files to create:**
- `docs/architecture/schemas/*.md`
- `docs/architecture/schemas/*.mermaid` (ER diagrams)
- `organizations/*/supabase/migrations/`

**Expected output:**
- Complete schema documentation
- ER diagrams
- Migration files in Git
- Schema validation tests

**Success criteria:**
- All tables documented
- ER diagrams generated
- Migrations versioned
- Schema tests passing

---

## PHASE 12: Security Hardening

**Context:** Good security scanning, but missing runtime protections.

**Task:**
1. Add Content Security Policy headers
2. Implement rate limiting
3. Add input validation middleware
4. Configure CORS properly
5. Add security headers to all responses

**Files to modify:**
- `organizations/*/saas/*/index.html` (CSP meta tags)
- Create `packages/security/` middleware
- Add to all API routes

**Expected output:**
- CSP headers configured
- Rate limiting implemented
- Input validation middleware
- Security headers added

**Success criteria:**
- CSP passing security audit
- Rate limiting functional
- All inputs validated
- Security headers present

---

## Execution Strategy

### Week 1-2: Foundation
- Phase 1: Dependency Consolidation
- Phase 2: Configuration Centralization
- Phase 3: Duplicate Code Elimination

### Week 3-4: Build Optimization
- Phase 4: CI/CD Workflow Optimization
- Phase 5: TypeScript Project References
- Phase 6: Turborepo Build Orchestration

### Week 5-6: Code Quality
- Phase 7: Code Splitting & Bundle Optimization
- Phase 8: Shared Component Library
- Phase 9: API Client Abstraction

### Week 7-8: Operations
- Phase 10: Monitoring & Observability
- Phase 11: Database Schema Documentation
- Phase 12: Security Hardening

---

## Blackbox IDE Commands

For each phase, use these Blackbox commands:

```
/analyze [directory] - Analyze code structure
/refactor [file] - Suggest refactoring improvements
/optimize [file] - Optimize performance
/extract [selection] - Extract to shared module
/consolidate [pattern] - Find and merge duplicates
/generate [type] - Generate boilerplate code
```

---

## Success Metrics

- **Build Time:** 60% reduction
- **Bundle Size:** 40% reduction
- **CI Time:** 50% reduction
- **Code Duplication:** 70% reduction
- **Dependency Count:** 30% reduction
- **Maintenance Effort:** 50% reduction
