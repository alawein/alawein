---
title: 'Project Structure'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Project Structure

## Directory Overview

```
alawein-quantum-forge/
├── docs/                           # Documentation
│   ├── README.md                   # Documentation index
│   ├── ARCHITECTURE.md             # System architecture
│   ├── STRUCTURE.md                # This file
│   ├── APIS.md                     # API documentation
│   ├── DESIGN_SYSTEM.md            # Design tokens & components
│   └── DEVELOPMENT.md              # Development guide
│
├── public/                         # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── App.tsx                     # Main app with all routes
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Global CSS & design tokens
│   │
│   ├── projects/                   # ⭐ UNIFIED PROJECTS MODULE
│   │   ├── index.ts                # Barrel export
│   │   ├── types.ts                # Platform type definitions
│   │   ├── config.ts               # Platform registry
│   │   ├── components/
│   │   │   ├── index.ts
│   │   │   ├── ProjectCard.tsx     # Platform card for hub
│   │   │   └── ProjectLayout.tsx   # Shared layout for platforms
│   │   └── pages/
│   │       ├── index.ts
│   │       ├── ProjectsHub.tsx     # /projects route
│   │       ├── simcore/
│   │       │   └── SimCoreDashboard.tsx
│   │       ├── mezan/
│   │       │   └── MEZANDashboard.tsx
│   │       ├── talai/
│   │       │   └── TalAIDashboard.tsx
│   │       ├── optilibria/
│   │       │   └── OptiLibriaDashboard.tsx
│   │       └── qmlab/
│   │           └── QMLabDashboard.tsx
│   │
│   ├── pages/                      # Standalone pages
│   │   ├── Index.tsx               # ⭐ PORTFOLIO (root /)
│   │   ├── NotFound.tsx
│   │   ├── AuthForms.tsx
│   │   └── [60+ template pages]    # Demo/template pages
│   │
│   ├── components/
│   │   ├── design-engines/         # 5 distinct design systems
│   │   │   ├── index.ts
│   │   │   ├── brutalist/
│   │   │   │   ├── BrutalButton.tsx
│   │   │   │   ├── BrutalCard.tsx
│   │   │   │   └── BrutalTable.tsx
│   │   │   ├── cyberpunk/
│   │   │   │   ├── GlitchText.tsx
│   │   │   │   ├── HexStatCard.tsx
│   │   │   │   ├── MatrixRain.tsx
│   │   │   │   └── [20+ components]
│   │   │   ├── glassmorphism/
│   │   │   │   ├── GlassButton.tsx
│   │   │   │   ├── GlassCard.tsx
│   │   │   │   ├── GlassModal.tsx
│   │   │   │   └── FloatingOrbs.tsx
│   │   │   ├── neumorphism/
│   │   │   │   ├── NeuButton.tsx
│   │   │   │   ├── NeuCard.tsx
│   │   │   │   ├── NeuSlider.tsx
│   │   │   │   └── NeuToggle.tsx
│   │   │   └── soft-pastel/
│   │   │       ├── PastelBadge.tsx
│   │   │       ├── PastelButton.tsx
│   │   │       └── PastelCard.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ThemeProvider.tsx
│   │   │
│   │   ├── ui/                     # Shadcn components (40+)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── [...]
│   │   │
│   │   └── [Portfolio components]
│   │       ├── Navigation.tsx
│   │       ├── HeroSection.tsx
│   │       ├── AboutSection.tsx
│   │       ├── ProjectsSection.tsx
│   │       ├── SkillsSection.tsx
│   │       ├── ContactSection.tsx
│   │       └── Footer.tsx
│   │
│   ├── features/                   # Feature-based pages (legacy)
│   │   ├── organizations/alawein-technologies-llc/apps/                   # Productivity apps
│   │   ├── auth/                   # Auth pages
│   │   ├── commerce/               # E-commerce
│   │   ├── content/                # Blog, docs
│   │   ├── dashboard/              # Dashboard templates
│   │   ├── gaming/                 # Game interfaces
│   │   ├── landing/                # Landing pages
│   │   ├── media/                  # Media players
│   │   ├── research/               # Data visualization
│   │   ├── showcase/               # Portfolio templates
│   │   ├── social/                 # Social apps
│   │   └── templates/              # UI templates
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   └── use-mobile.tsx
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── uiStore.ts
│   │
│   ├── services/                   # API services
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts           # ⚠️ AUTO-GENERATED
│   │       └── types.ts            # ⚠️ AUTO-GENERATED
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── theme.types.ts
│   │   └── user.types.ts
│   │
│   ├── utils/
│   │   ├── cn.ts                   # classnames utility
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── config/
│   │   ├── constants.ts
│   │   ├── env.ts
│   │   └── routes.ts
│   │
│   └── lib/
│       └── utils.ts                # shadcn utils
│
├── supabase/
│   ├── config.toml                 # ⚠️ AUTO-MANAGED
│   ├── functions/
│   │   ├── simcore-api/
│   │   │   └── index.ts
│   │   ├── mezan-api/
│   │   │   └── index.ts
│   │   ├── talai-api/
│   │   │   └── index.ts
│   │   ├── optilibria-api/
│   │   │   └── index.ts
│   │   ├── qmlab-api/
│   │   │   └── index.ts
│   │   ├── analyze-threat/
│   │   │   └── index.ts
│   │   ├── detect-anomalies/
│   │   │   └── index.ts
│   │   └── extract-theme/
│   │       └── index.ts
│   └── migrations/                 # ⚠️ AUTO-MANAGED
│
├── tailwind.config.ts              # Tailwind configuration
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

## Key Files Explained

### Entry Points

- `src/main.tsx` - React entry, mounts App
- `src/App.tsx` - All routes defined here

### Configuration

- `src/projects/config.ts` - Platform registry with all metadata
- `src/projects/types.ts` - TypeScript interfaces for platforms

### Auto-Generated (DO NOT EDIT)

- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `supabase/config.toml`
- `.env`

### Design System

- `src/index.css` - CSS variables (lines 1-150 most important)
- `tailwind.config.ts` - Tailwind theme extension
