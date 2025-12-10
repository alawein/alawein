---
title: 'Alawein Platform - System Architecture'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Alawein Platform - System Architecture

**Purpose:** Comprehensive guide to the system architecture, data flow, and
component hierarchy

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALAWEIN PLATFORM (MONOREPO)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │   APPLICATIONS    │  │  DESIGN SYSTEM   │  │  PACKAGES   │ │
│  │                   │  │                  │  │             │ │
│  │ • SimCore         │  │ • Tokens (500+)  │  │ • API Types │ │
│  │ • MEZAN           │  │ • Themes (4)     │  │ • UI Comps  │ │
│  │ • TalAI           │  │ • Components     │  │ • Infra     │ │
│  │ • OptiLibria      │  │ • React Context  │  │ • Feature   │ │
│  │ • QMLab           │  │                  │  │   Flags     │ │
│  │                   │  │                  │  │ • Config    │ │
│  └─────────┬─────────┘  └────────┬─────────┘  └──────┬──────┘ │
│            │                     │                   │        │
│            └─────────────────────┼───────────────────┘        │
│                                  │                            │
│                        ┌─────────▼────────┐                  │
│                        │  SHARED LAYERS   │                  │
│                        │                  │                  │
│                        │ • State (Zustand)│                  │
│                        │ • API (Zod types)│                  │
│                        │ • Routing        │                  │
│                        │ • Services       │                  │
│                        └──────────────────┘                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                  INFRASTRUCTURE                          │ │
│  │  ┌────────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │  Turborepo     │  │   Git Hooks  │  │  Validation  │ │ │
│  │  │  (Orchestration│  │              │  │  Scripts     │ │ │
│  │  │   & Caching)   │  │  Enforcement │  │              │ │ │
│  │  └────────────────┘  └──────────────┘  └──────────────┘ │ │
│  │                                                            │ │
│  │  ┌────────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │  TypeScript    │  │  ESLint      │  │  Prettier    │ │ │
│  │  │  Strict Mode   │  │  Enforced    │  │  Formatted   │ │ │
│  │  └────────────────┘  └──────────────┘  └──────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              BACKEND INTEGRATION                         │ │
│  │         Supabase Edge Functions & DB                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Workspace & Dependency Structure

### Foundation Layer (Zero Dependencies)

```
@alawein/design-tokens     → Colors, typography, spacing, effects, animations
@alawein/api-schema        → Zod type definitions for APIs
@alawein/infrastructure    → Deployment utilities & monitoring
```

### Composition Layer

```
@alawein/ui-components     → Reusable React atoms & molecules
@alawein/feature-flags     → Feature flag system with React provider
@alawein/eslint-config     → Shared ESLint configuration
@alawein/prettier-config   → Shared Prettier configuration
@alawein/typescript-config → Shared TypeScript configuration
```

### Design System Layer

```
@alawein/design-system
├── Theme definitions (Quantum, Dark, Glassmorphism, Light)
├── ThemeProvider component with React Context
├── Hooks (useTheme, useThemeColors, useThemeSpacing, useThemeTypography)
└── Theme-aware UI components
```

### Application Layer

```
Root Application (depends on design-system)
├── src/App.tsx                    (Router & provider setup)
├── src/pages/                     (3 essential pages)
├── src/projects/                  (5 platform dashboards)
├── src/components/                (UI library)
├── src/stores/                    (Zustand stores)
├── src/services/                  (API integration)
├── src/hooks/                     (Custom React hooks)
└── src/integrations/supabase/     (Supabase client)
```

---

## 🎨 Design System Hierarchy

### Tokens (Foundation)

```
Colors
├── Primary: #6B5B95 (Quantum Purple)
├── Secondary: #00D9FF (Cyan)
├── Success: #00FF87
├── Warning: #FFB800
├── Error: #FF006E
├── Background: #0A0E27
└── Text: #E0E0FF

Typography
├── Fonts: Inter, JetBrains, Courier Prime, Space Grotesk, IBM
├── Weights: 400, 500, 600, 700, 800
├── Sizes: 12px to 48px scale
└── Line heights: 1.2x to 1.8x

Spacing (8px base)
├── Scale: 0, 4, 8, 12, 16, 24, 32, 48, 64px

Effects
├── Shadows: sm, md, lg, xl, 2xl
├── Glows: primary, secondary, success, warning
└── Blur: sm, md, lg

Animation
├── Durations: fast, normal, slow, slower
├── Easing: ease-in, ease-out, ease-in-out
└── Special: orbital quantum animations
```

### Themes (4 Variations)

```
Quantum Theme
├── Base color: #6B5B95
├── Accent: #00D9FF
├── Background: Space-like dark blue
├── Typography: Futuristic fonts
└── Effects: Glow, orbital animations

Glassmorphism Theme
├── Backdrop blur: 10px
├── Opacity: 0.8
├── Border: 1px rgba white
└── Soft shadows

Dark Theme
├── High contrast
├── Pure blacks
├── Bright whites
└── Minimal effects

Light Theme
├── Clean whites
├── Dark text
├── Minimal shadows
└── Soft interactions
```

---

## 📂 Directory Structure

```
quantum-dev-profile/
│
├── design-system/              (Theme + tokens package)
│   ├── src/
│   │   ├── tokens/            (Color, typography, spacing, etc.)
│   │   ├── themes/            (quantum, dark, glassmorphism, light)
│   │   ├── context/           (ThemeContext with hooks)
│   │   └── components/        (Theme-aware UI)
│   └── package.json
│
├── packages/                   (Shared packages)
│   ├── api-schema/            (Zod type definitions)
│   ├── design-tokens/         (Foundation tokens)
│   ├── ui-components/         (Reusable atoms/molecules)
│   ├── feature-flags/         (Feature management)
│   ├── infrastructure/        (Deployment utilities)
│   ├── eslint-config/         (Shared ESLint)
│   ├── prettier-config/       (Shared Prettier)
│   └── typescript-config/     (Shared TypeScript)
│
├── src/                        (Main application)
│   ├── App.tsx                (Root with router)
│   ├── pages/                 (3 essential pages)
│   │   ├── Index.tsx          (Portfolio home)
│   │   ├── InteractiveResume.tsx
│   │   └── NotFound.tsx
│   │
│   ├── projects/              (5 platform dashboards)
│   │   ├── config.ts          (Platform registry)
│   │   ├── types.ts           (Interfaces)
│   │   └── pages/
│   │       ├── ProjectsHub.tsx
│   │       ├── simcore/SimCoreDashboard.tsx
│   │       ├── mezan/MEZANDashboard.tsx
│   │       ├── talai/TalAIDashboard.tsx
│   │       ├── optilibria/OptiLibriaDashboard.tsx
│   │       └── qmlab/QMLabDashboard.tsx
│   │
│   ├── components/            (UI library)
│   │   ├── ui/               (40+ Shadcn/ui components)
│   │   ├── layout/           (Page layouts)
│   │   └── shared/           (Common patterns)
│   │
│   ├── hooks/                (Custom React hooks)
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   └── [others]
│   │
│   ├── stores/               (Zustand state)
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   │
│   ├── services/             (API integration)
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── index.ts
│   │
│   ├── integrations/         (Third-party)
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts (auto-generated)
│   │
│   ├── types/                (Type definitions)
│   │   ├── auth.types.ts
│   │   ├── theme.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   ├── utils/                (Utilities)
│   │   ├── cn.ts            (Class merge helper)
│   │   ├── helpers.ts
│   │   └── constants.ts
│   │
│   ├── config/               (Configuration)
│   │   ├── constants.ts
│   │   ├── env.ts
│   │   ├── routes.ts
│   │   └── index.ts
│   │
│   └── index.css            (Global styles with Tailwind)
│
├── templates/               (Template library)
│   ├── config.json
│   ├── README.md
│   └── [template files]
│
├── docs/                    (Documentation)
│   ├── README.md
│   ├── ARCHITECTURE.md      (this file)
│   ├── STRUCTURE.md
│   ├── DEVELOPMENT.md
│   ├── DESIGN_SYSTEM.md
│   ├── APIS.md
│   ├── AI_GUIDE.md
│   ├── SOLO_DEVELOPMENT.md
│   └── templates/
│       ├── DEVELOPMENT.md
│       ├── INTEGRATION.md
│       └── REGISTRY.md
│
├── scripts/                 (Automation)
│   ├── validate-structure.js
│   ├── check-imports.js
│   └── [others]
│
├── CLAUDE.md               (AI assistant context)
├── README.md               (Main entry point)
└── REPOSITORY_GOVERNANCE.md (Governance rules)
```

---

## 🔗 Data Flow Architecture

### Component Rendering Flow

```
USER INTERACTION
    ↓
REACT COMPONENT
    ↓
THEME CONTEXT (design-system)
    ↓
DOM UPDATES (CSS variables)
    ↓
ALL COMPONENTS RE-RENDER
    ↓
localStorage PERSISTENCE
```

### API Request Flow

```
COMPONENT (useQuery hook)
    ↓
SERVICE LAYER (user.service, auth.service)
    ↓
SUPABASE CLIENT (auto-typed)
    ↓
SUPABASE EDGE FUNCTIONS
    ↓
POSTGRESQL DATABASE
    ↓
RESPONSE (Zod validated)
    ↓
ZUSTAND STORE (global state)
    ↓
COMPONENT RE-RENDER (TanStack Query cache)
```

---

## 🚀 Build & Deployment Pipeline

```
DEVELOPER PUSH
    ↓
PRE-COMMIT HOOKS
  ✓ Structure validation
  ✓ Import validation
  ✓ Prettier formatting
  ✓ ESLint linting
  ✓ TypeScript types
    ↓
COMMIT MESSAGE VALIDATION
  ✓ Conventional commits format
  ✓ Valid type & scope
    ↓
PRE-PUSH HOOKS
  ✓ Run tests
  ✓ Check circular dependencies
    ↓
TURBOREPO BUILD
  ✓ Parallel package builds
  ✓ Cached outputs
    ↓
VITE BUILD
  ✓ Fast ESM bundling
  ✓ Tree-shaking
    ↓
DEPLOYMENT
  → Staging / Production
```

---

## 🎓 State Management

### Global State (Zustand)

```
authStore       → User authentication & permissions
themeStore      → Theme preferences
uiStore         → UI state (modals, sidebars, etc.)
```

### Server State (TanStack Query)

```
useQuery()      → Fetching platform data
useMutation()   → Creating/updating data
```

### Local State (React)

```
useState()      → Component-level state
```

---

## 🔒 Security & Enforcement

### Pre-commit Enforcement

- ✅ Structure validation (no orphaned files)
- ✅ Import validation (no ../../../ relative imports)
- ✅ Prettier formatting (consistency)
- ✅ ESLint linting (best practices)
- ✅ TypeScript strict mode (type safety)

### Type Safety

- ✅ TypeScript strict mode enabled
- ✅ No `any` types allowed
- ✅ Zod schemas for runtime validation
- ✅ Auto-generated Supabase types

---

## 📈 Performance Optimizations

### Build Time

- **Turborepo**: Caches build outputs, parallel execution
- **Vite**: Fast ESM-based bundling
- **Tree-shaking**: Unused code removed

### Runtime Performance

- **Code splitting**: Dynamic imports for pages
- **Lazy loading**: Components loaded on demand
- **TanStack Query**: API response caching
- **Theme caching**: localStorage persistence

### Development Experience

- **Hot Module Replacement**: Instant updates
- **IDE feedback**: Real-time type checking
- **Git hooks**: Instant validation before commit

---

## 🔄 Integration Points

### 1. Theme Integration

Every styled component uses `useThemeColors()` hook which automatically applies
the active theme (Quantum, Dark, Glassmorphism, or Light).

### 2. Component Reusability

- 40+ Shadcn UI components
- Design system provides styling
- Common logic in shared utilities

### 3. State Management

- Zustand for global state
- TanStack Query for server state
- React Context for theme

### 4. Type Safety

- All API calls are typed via @alawein/api-schema
- Supabase types auto-generated
- No `any` types in codebase

### 5. API Integration

- Supabase client (auto-typed)
- Edge functions for each platform
- Zod validation on request/response

---

**For more details, see other documentation in `docs/` folder.**
