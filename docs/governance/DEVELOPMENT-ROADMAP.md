# Development Roadmap

## 🎯 Vision

Build a cohesive ecosystem of scientific, productivity, and lifestyle platforms
under the Alawein Technologies umbrella, all following consistent standards and
deployable via Lovable.dev.

---

## 📊 Platform Registry

| Platform         | Status        | Port | Description                                | Priority |
| ---------------- | ------------- | ---- | ------------------------------------------ | -------- |
| **SimCore**      | ✅ Active     | 5175 | Scientific computing & physics simulations | High     |
| **QMLab**        | ✅ Active     | 5180 | Quantum computing education & tools        | High     |
| **LLMWorks**     | ✅ Active     | 5181 | Open-source LLM benchmarking & tools       | High     |
| **Attributa**    | ✅ Active     | 5179 | AI content attribution detection           | High     |
| **LiveItIconic** | ✅ Active     | 5177 | Statement jewelry e-commerce               | Medium   |
| **REPZ**         | 🔄 Needs Work | 5176 | Fitness tracking & workout logging         | Medium   |
| **Portfolio**    | ✅ Active     | 5174 | Personal portfolio website                 | Low      |
| **Studios Hub**  | ✅ Active     | 5173 | Central navigation hub                     | High     |

---

## 🗓️ Phase 1: Consolidation ✅ COMPLETE

### Goals

- [x] Restore all platforms from GitHub archives
- [x] Fix vite configurations (SWC → Babel)
- [x] Establish governance rules
- [x] Migrate platforms to `/platforms/` folder
- [x] Create shared component library (packages/ui: Button, Card, ErrorBoundary, Input, Badge, Spinner)
- [x] Standardize all package.json files (type-check, format, format:check scripts)

### Completed Tasks

#### 1.1 Platform Migration ✅

All 7 platforms migrated to `/platforms/` folder:

```bash
platforms/
├── simcore/      # Scientific computing & physics simulations
├── qmlab/        # Quantum computing education & tools
├── llmworks/     # Open-source LLM benchmarking & tools
├── attributa/    # AI content attribution detection
├── liveiticonic/ # Statement jewelry e-commerce
├── repz/         # Fitness tracking & workout logging
└── portfolio/    # Personal portfolio website
```

#### 1.2 Organizations Structure (Retained)

The `organizations/` folder is retained for non-platform assets:

- **packages/**: librex, mezan, helios, design-system
- **research/**: talai
- **services/**: marketing-automation
- **incubator/**: foundry
- **data/**: datasets
- **docs, tools, client-deliverables**: LLC-specific documentation

#### 1.3 Shared Library (Pending)

```bash
shared/
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...shadcn components
├── hooks/
│   ├── use-mobile.ts
│   ├── use-toast.ts
│   └── use-theme.ts
└── utils/
    ├── cn.ts
    └── format.ts
```

---

## 🗓️ Phase 2: Enhancement ✅ MOSTLY COMPLETE

### SimCore Improvements

- [x] Add more physics simulations (20+ modules: Ising, LLG, Graphene, MoS2,
      Quantum Tunneling, etc.)
- [x] Improve 3D visualizations (React Three Fiber: LLG3DVisualization,
      CrystalVisualization, PhysicsVisualizationEngine)
- [x] Add export functionality (SimulationExportSystem: JSON, CSV, PDF;
      crystal-store: CIF, XYZ)
- [x] Mobile responsiveness (use-mobile, use-responsive-enhanced,
      MobileCompatibilityTester)
- [x] Performance optimization (AdaptiveDpr, WebGPU, WebWorkers, performance
      monitoring)

### QMLab Improvements

- [x] Circuit builder enhancements (CircuitBuilder.tsx,
      MobileOptimizedCircuitBuilder.tsx)
- [x] More quantum algorithms (BlochSphere, QuantumMLPipeline, visualization
      components)
- [x] Tutorial system (TutorialOverlay.tsx, TutorialTrigger.tsx,
      QuantumLearningTracker.tsx)
- [x] Save/load circuits (useCircuitStorage hook with localStorage, import/export JSON)

### LLMWorks Improvements

- [x] Real API integrations (documented in API_REFERENCE.md, arena components)
- [x] More benchmark tests (BenchmarkRunner.tsx, ResultsViewer.tsx,
      CustomTestBuilder.tsx)
- [x] Cost calculator (CostTrackingDashboard.tsx)
- [x] Model comparison charts (ModelComparisonDashboard, RadarComparisonChart,
      BarComparisonChart)

### Attributa Improvements

- [x] Improve detection accuracy (multiple analyzers: GLTR, DetectGPT,
      watermark, NLP)
- [x] Add batch processing (BatchProcessor class with queue, concurrency, useBatchProcessor hook)
- [x] Export reports (export.ts: JSON, CSV export functions)
- [x] API endpoint (documented in Documentation.tsx, SDK planned)

---

## 🗓️ Phase 3: Integration (Month 2)

### Cross-Platform Features

- [x] Unified authentication (Supabase) - `useAuth` hook in packages/integrations
- [x] Shared user preferences - `useUserPreferences` hook in packages/utils
- [x] Cross-platform notifications - `useNotifications` hook in packages/utils (50 tests)
- [x] Analytics dashboard - `AnalyticsDashboard.tsx` in Studios Hub with platform metrics

### Studios Hub Enhancement

- [x] Real-time platform status - `usePlatformStatus` hook in packages/utils
- [x] Quick actions - Added to PlatformsHub
- [x] Recent activity feed - Added to PlatformsHub
- [x] Search across platforms - Added to PlatformsHub

---

## 🗓️ Phase 4: Production (Month 3)

### Deployment Preparation (Completed)

- [x] Netlify configs for SimCore, LLMWorks, Attributa, Portfolio
- [x] Vercel configs for QMLab, LiveItIconic, REPZ
- [x] Environment variable templates (.env.example) for all platforms
- [x] Security headers configured (X-Frame-Options, CSP, HSTS)
- [x] SPA redirects configured
- [x] Asset caching configured

### Deployment (Requires External Setup)

- [ ] All platforms on Netlify/Vercel
- [ ] Custom domains configured
- [ ] SSL certificates
- [ ] CDN optimization

### Monitoring (Requires External Setup)

- [ ] Error tracking (Sentry)
- [ ] Analytics (Plausible)
- [ ] Uptime monitoring
- [ ] Performance metrics

---

## 🔧 Technical Debt

### Completed

- [x] Consolidated duplicate `cn` utility across 6 platforms to use `@alawein/utils`
- [x] Standardized utils.ts re-exports (formatCurrency, formatDate, debounce, etc.)
- [x] Bundle size optimization - all platforms have manualChunks, vendor splitting
- [x] SimCore vite.config.ts enhanced with proper chunk splitting

### Remaining

### High Priority

1. ~~Remove duplicate code across platforms~~ ✅ (consolidated utils.ts to @alawein/utils)
2. ~~Standardize error handling~~ ✅ (packages/utils, packages/ui ErrorBoundary)
3. ~~Implement proper TypeScript types~~ ✅ (all platforms type-check passing)
4. ~~Add unit tests for critical paths~~ ✅ (50 tests in packages/utils)

### Medium Priority

1. ~~Optimize bundle sizes~~ ✅ (manualChunks in all vite configs)
2. ~~Implement code splitting~~ ✅ (vendor splitting configured)
3. ~~Add E2E tests~~ ✅ (Playwright configs + sample tests for all 7 platforms)
4. ~~Documentation for each platform~~ ✅ (README.md in all platforms)

### Low Priority

1. ~~Storybook for components~~ ✅ (packages/ui with Button, Badge, Input, Spinner stories)
2. ~~Visual regression tests~~ ✅ (Playwright visual tests for all 7 platforms)
3. ~~Accessibility audit~~ ✅ (ACCESSIBILITY-GUIDELINES.md, skip links, ARIA in all platforms)
4. ~~SEO optimization~~ ✅ (All platforms have robots.txt, sitemap.xml, SEO components)

---

## 📈 Success Metrics

| Metric                   | Target            |
| ------------------------ | ----------------- |
| Lighthouse Performance   | > 90              |
| Lighthouse Accessibility | > 95              |
| Build Time               | < 60s             |
| Bundle Size              | < 500KB (initial) |
| Test Coverage            | > 70%             |

---

## 🤖 Lovable.dev Compatibility Checklist

For each platform to be Lovable-compatible:

- [x] Standard Vite + React + TypeScript setup (all 7 platforms)
- [x] `components.json` present and configured (all 7 platforms)
- [x] All shadcn/ui components in `src/components/ui/` (all 7 platforms)
- [x] No custom webpack/build configurations (all use Vite)
- [x] Standard `npm run dev` and `npm run build` scripts (all 7 platforms)
- [x] Clean dependency tree (no conflicting versions)
- [x] TypeScript strict mode enabled (all 7 platforms)
- [x] ESLint configured (all 7 platforms)
- [x] Tailwind CSS with standard config (all 7 platforms)

---

## 📝 Notes

- All platforms should be independently deployable
- Shared code via npm workspace or copy (not symlinks)
- Each platform maintains its own README
- Version numbers follow semver
- Breaking changes require major version bump
