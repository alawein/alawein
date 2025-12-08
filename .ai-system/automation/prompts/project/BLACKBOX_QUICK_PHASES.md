# Blackbox IDE: Quick Action Phases

**Ultra-focused prompts for Blackbox's strongest features: code analysis, refactoring, and generation.**

---

## 🎯 PHASE 1: Workspace Setup (30 min)

```
Analyze all package.json files in organizations/**/*/package.json and packages/*/package.json.

Identify:
1. Duplicate dependencies across projects
2. Version conflicts
3. Common dependencies used by 3+ projects

Generate:
1. Root package.json with workspaces configuration
2. packages/shared-deps/package.json with common deps
3. Migration script to update all projects

Output workspace configuration that reduces node_modules by 40%.
```

---

## 🎯 PHASE 2: Config Extraction (45 min)

```
Extract shared configuration from these files:
- organizations/alawein-technologies-llc/saas/*/vite.config.ts
- organizations/alawein-technologies-llc/saas/*/tsconfig.json
- organizations/alawein-technologies-llc/saas/*/tailwind.config.ts

Create:
1. packages/vite-config/base.ts - shared Vite config factory
2. packages/typescript-config/base.json - base tsconfig
3. packages/tailwind-config/base.js - shared Tailwind preset

Refactor all projects to extend these configs.
```

---

## 🎯 PHASE 3: Duplicate Elimination (1 hour)

```
Find and consolidate duplicate code:

1. Compare research/ vs organizations/alawein-technologies-llc/research/
   - Identify identical projects
   - Merge into single canonical location
   - Update all imports

2. Compare .ai-system/automation/ vs tools/
   - Find overlapping functionality
   - Merge into tools/automation/
   - Remove duplicates

3. Compare .ai-system/knowledge/ vs docs/
   - Consolidate documentation
   - Remove redundant files

Generate migration plan with file moves and import updates.
```

---

## 🎯 PHASE 4: CI Consolidation (1 hour)

```
Analyze .github/workflows/*.yml (29 files).

Create reusable workflows:
1. .github/workflows/reusable-test.yml
2. .github/workflows/reusable-lint.yml
3. .github/workflows/reusable-security.yml
4. .github/workflows/reusable-deploy.yml

Consolidate existing workflows to use these templates.
Reduce from 29 to 15 workflows using matrix strategies.

Add caching for:
- npm dependencies
- TypeScript builds
- Test results
```

---

## 🎯 PHASE 5: Turbo Setup (20 min)

```
Create turbo.json configuration for:
- build (depends on ^build)
- test (depends on build, cached)
- lint (cached)
- type-check (cached)

Configure:
- Remote caching
- Parallel execution
- Task dependencies
- Output directories

Update package.json scripts to use turbo.
```

---

## 🎯 PHASE 6: TypeScript Optimization (45 min)

```
Configure TypeScript project references:

1. Analyze dependency graph between packages
2. Add "composite": true to all packages
3. Configure "references" in dependent projects
4. Enable incremental compilation
5. Set up proper build order

Expected result: 5x faster type-checking.
```

---

## 🎯 PHASE 7: Bundle Optimization (1 hour)

```
For each SaaS project in organizations/*/saas/*:

1. Analyze current bundle size
2. Implement route-based code splitting
3. Add lazy loading for:
   - Route components
   - Heavy libraries (recharts, etc.)
   - Modal dialogs
4. Optimize vendor chunks
5. Add bundle size budgets

Target: Initial bundle < 200KB, total < 1MB.
```

---

## 🎯 PHASE 8: Component Library (2 hours)

```
Create packages/ui-components/:

Extract common components from all SaaS projects:
- Button, Dialog, Select, Tabs (Radix UI wrappers)
- Form components (Input, Textarea, Checkbox)
- Layout components (Card, Container, Grid)
- Feedback components (Toast, Alert, Loading)

Generate:
1. Component files with TypeScript
2. Storybook configuration
3. Export index
4. Package.json

Update all projects to import from @packages/ui-components.
```

---

## 🎯 PHASE 9: API Abstraction (1.5 hours)

```
Create packages/api-client/:

Wrap Supabase client with abstraction layer:

1. Create client.ts with SupabaseClient wrapper
2. Generate type-safe methods for common operations
3. Add error handling and retry logic
4. Create React hooks (useQuery, useMutation)
5. Add request/response interceptors

Replace all direct Supabase imports in apps with this abstraction.
```

---

## 🎯 PHASE 10: Monitoring Setup (1 hour)

```
Create packages/observability/:

1. Sentry integration (error tracking)
2. Structured logger (Winston/Pino)
3. Performance monitoring (Web Vitals)
4. Health check utility

Add to all SaaS projects:
- Error boundary with Sentry
- Performance tracking
- Health check endpoint
- Structured logging

Generate initialization code for each app.
```

---

## 🎯 PHASE 11: Security Headers (30 min)

```
Add security hardening to all SaaS projects:

1. Content Security Policy in index.html
2. Security headers middleware
3. CORS configuration
4. Rate limiting utility
5. Input validation helpers

Generate:
- CSP meta tags
- Middleware functions
- Configuration files
- Integration code
```

---

## 🎯 PHASE 12: Schema Documentation (1 hour)

```
For each Supabase project:

1. Generate schema documentation from database
2. Create ER diagrams (Mermaid format)
3. Document RLS policies
4. Extract migration files
5. Create schema validation tests

Output:
- docs/architecture/schemas/[project].md
- docs/architecture/schemas/[project].mermaid
- Schema test files
```

---

## 🚀 Blackbox Commands Reference

### Analysis
```
/analyze organizations/alawein-technologies-llc/saas/
/dependencies organizations/
/duplicates .
```

### Refactoring
```
/refactor [file] --extract-config
/consolidate [pattern]
/extract [selection] --to-package
```

### Generation
```
/generate package --name ui-components --type react
/generate config --type vite --shared
/generate workflow --type reusable --for testing
```

### Optimization
```
/optimize [file] --bundle-size
/optimize [file] --performance
/split [component] --lazy-load
```

---

## 📊 Expected Results

| Phase | Time | Impact | Metric |
|-------|------|--------|--------|
| 1. Workspace | 30m | High | -40% node_modules |
| 2. Configs | 45m | High | -60% config duplication |
| 3. Duplicates | 1h | High | -70% code duplication |
| 4. CI | 1h | High | -50% CI time |
| 5. Turbo | 20m | High | -60% build time |
| 6. TypeScript | 45m | High | 5x faster type-check |
| 7. Bundles | 1h | Medium | -40% bundle size |
| 8. Components | 2h | Medium | Shared UI library |
| 9. API | 1.5h | Medium | Decoupled backend |
| 10. Monitoring | 1h | High | Full observability |
| 11. Security | 30m | High | Hardened apps |
| 12. Schemas | 1h | Medium | Complete docs |

**Total Time:** ~12 hours  
**Total Impact:** Massive improvement in DX, performance, maintainability

---

## 🎬 Execution Order

### Day 1 (4 hours)
1. Workspace Setup
2. Config Extraction
3. Duplicate Elimination

### Day 2 (4 hours)
4. CI Consolidation
5. Turbo Setup
6. TypeScript Optimization

### Day 3 (4 hours)
7. Bundle Optimization
8. Component Library (start)

### Day 4 (4 hours)
8. Component Library (finish)
9. API Abstraction

### Day 5 (3 hours)
10. Monitoring Setup
11. Security Headers
12. Schema Documentation

---

## 💡 Pro Tips for Blackbox

1. **Use /analyze first** - Let Blackbox understand the codebase
2. **Be specific** - Point to exact files/directories
3. **Request metrics** - Ask for before/after comparisons
4. **Iterate** - Review generated code, refine prompts
5. **Test incrementally** - Validate each phase before moving on
6. **Use /refactor** - Blackbox excels at code transformation
7. **Leverage /generate** - Fast boilerplate creation
8. **Ask for migration scripts** - Automate repetitive changes

---

## ✅ Validation Checklist

After each phase:

- [ ] Code compiles without errors
- [ ] Tests pass
- [ ] Linting passes
- [ ] Type-checking passes
- [ ] No broken imports
- [ ] Documentation updated
- [ ] Git commit with clear message
- [ ] Metrics improved (measure!)

---

## 🎯 Success Criteria

**Phase 1-6 (Foundation):**
- Workspace configured
- Configs centralized
- Duplicates removed
- CI optimized
- Turbo working
- TypeScript fast

**Phase 7-9 (Quality):**
- Bundles optimized
- Components shared
- API abstracted

**Phase 10-12 (Operations):**
- Monitoring active
- Security hardened
- Schemas documented

**Overall:**
- Build time: 60% faster
- Bundle size: 40% smaller
- CI time: 50% faster
- Code duplication: 70% less
- Maintenance: 50% easier
