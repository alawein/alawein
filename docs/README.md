# AlaweinOS Documentation

Complete documentation for AI assistants (Claude, Cline, Cursor, etc.) and developers.

## Table of Contents

1. [Architecture Overview](./ARCHITECTURE.md)
2. [Project Structure](./STRUCTURE.md)
3. [Platform APIs](./APIS.md)
4. [Design System](./DESIGN_SYSTEM.md)
5. [Development Guide](./DEVELOPMENT.md)

---

## Quick Overview

### What is AlaweinOS?

AlaweinOS is a **unified platform** that hosts multiple specialized applications:

| Platform     | Route         | Purpose                           | Status      |
| ------------ | ------------- | --------------------------------- | ----------- |
| Portfolio    | `/`           | Personal portfolio site           | Active      |
| Projects Hub | `/projects`   | Central hub for all platforms     | Active      |
| SimCore      | `/simcore`    | Scientific computing & simulation | Active      |
| MEZAN        | `/mezan`      | Enterprise workflow automation    | Development |
| TalAI        | `/talai`      | AI research & model training      | Beta        |
| OptiLibria   | `/optilibria` | Optimization algorithms (31+)     | Active      |
| QMLab        | `/qmlab`      | Quantum mechanics laboratory      | Beta        |

### Key Concepts

1. **Root is Portfolio**: The `/` route IS the portfolio. Don't confuse it with other pages.
2. **Projects Hub**: `/projects` shows all available platforms as cards.
3. **Independent Platforms**: Each platform (`/simcore`, `/mezan`, etc.) has its own dashboard,
   routes, and backend API.
4. **Shared Design System**: All platforms use a unified design system defined in `src/index.css`
   and `tailwind.config.ts`.

### File Organization

```
src/
├── pages/Index.tsx          # Portfolio (root /)
├── projects/                # Unified projects module
│   ├── types.ts             # Platform type definitions
│   ├── config.ts            # Platform registry & config
│   ├── components/          # Shared platform components
│   └── pages/               # Platform dashboards
│       ├── ProjectsHub.tsx  # /projects route
│       ├── simcore/         # /simcore routes
│       ├── mezan/           # /mezan routes
│       ├── talai/           # /talai routes
│       ├── optilibria/      # /optilibria routes
│       └── qmlab/           # /qmlab routes
├── components/
│   ├── design-engines/      # 5 design engine component sets
│   ├── layout/              # Layout components
│   ├── shared/              # Shared utilities
│   └── ui/                  # Shadcn UI components
└── features/                # Legacy feature pages (templates)

supabase/
├── functions/               # Edge Functions (one per platform)
│   ├── simcore-api/
│   ├── mezan-api/
│   ├── talai-api/
│   ├── optilibria-api/
│   └── qmlab-api/
└── config.toml              # Supabase configuration
```

### Database Tables

Each platform has its own data table:

- `simcore_simulations` - Simulation runs
- `mezan_workflows` - Workflow definitions
- `talai_experiments` - ML experiments
- `optilibria_runs` - Optimization runs
- `qmlab_experiments` - Quantum experiments

Shared tables:

- `projects` - Platform metadata
- `project_features` - Platform features
- `project_tech_stack` - Technology associations
- `user_project_preferences` - User settings per platform
- `profiles` - User profiles

---

## For AI Assistants

### Important Rules

1. **Never modify the portfolio at `/`** unless explicitly asked
2. **Platform routes are at root level**: `/simcore`, not `/projects/simcore`
3. **Use the project registry** in `src/projects/config.ts` for platform data
4. **Backend APIs** are Edge Functions in `supabase/functions/{platform}-api/`
5. **Design tokens** are in `src/index.css` - use semantic variables, not raw colors

### Common Tasks

**Adding a new feature to a platform:**

1. Check `src/projects/pages/{platform}/` for the dashboard
2. Check `supabase/functions/{platform}-api/` for the API
3. Check `src/projects/config.ts` for route configuration

**Modifying the design system:**

1. Update CSS variables in `src/index.css`
2. Update Tailwind config in `tailwind.config.ts`
3. Use semantic tokens like `bg-background`, `text-foreground`

**Adding a new platform:**

1. Add type to `src/projects/types.ts`
2. Add config to `src/projects/config.ts`
3. Create dashboard in `src/projects/pages/{slug}/`
4. Create API in `supabase/functions/{slug}-api/`
5. Add routes to `src/App.tsx`
6. Create database migration for platform data
