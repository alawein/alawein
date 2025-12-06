# AI Assistant Guide

> Instructions for Claude, Cursor, Cline, and other AI coding assistants.

## Critical Context

### Project Identity

This is **AlaweinOS**, a unified platform with:

- **Portfolio** at `/` - Personal portfolio site (DO NOT MODIFY unless asked)
- **Projects Hub** at `/projects` - Shows all platforms
- **5 Platforms** at root-level routes (`/simcore`, `/mezan`, `/talai`, `/optilibria`, `/qmlab`)

### What NOT to Do

1. **Never modify `/` (Portfolio)** unless explicitly requested
2. **Never create routes under `/projects/`** - platforms are at root (`/simcore`, not
   `/projects/simcore`)
3. **Never edit auto-generated files**:
   - `src/integrations/supabase/client.ts`
   - `src/integrations/supabase/types.ts`
   - `supabase/config.toml`
   - `.env`
4. **Never use raw colors** - use semantic tokens from design system
5. **Never create duplicate functionality** - check existing components first

---

## File Locations

### When asked about platforms:

```
src/projects/config.ts        → Platform configurations
src/projects/types.ts         → Platform TypeScript types
src/projects/pages/{slug}/    → Platform dashboards
supabase/functions/{slug}-api/ → Platform APIs
```

### When asked about design:

```
src/index.css                 → CSS variables (design tokens)
tailwind.config.ts            → Tailwind extensions
src/components/design-engines/ → 5 design engine component sets
src/components/ui/            → Shadcn components
```

### When asked about auth:

```
src/stores/authStore.ts       → Auth state (Zustand)
src/components/shared/AuthProvider.tsx
src/components/shared/ProtectedRoute.tsx
src/pages/AuthForms.tsx       → Login/signup UI
```

### When asked about the portfolio:

```
src/pages/Index.tsx           → Main portfolio page
src/components/Navigation.tsx
src/components/HeroSection.tsx
src/components/AboutSection.tsx
src/components/ProjectsSection.tsx
src/components/SkillsSection.tsx
src/components/ContactSection.tsx
src/components/Footer.tsx
```

---

## Common Tasks

### "Add a feature to SimCore"

1. Open `src/projects/pages/simcore/SimCoreDashboard.tsx`
2. Add UI components
3. If backend needed, modify `supabase/functions/simcore-api/index.ts`
4. If new route, add to `src/projects/config.ts` and `src/App.tsx`

### "Change the design/colors"

1. Edit CSS variables in `src/index.css` (lines 8-100)
2. If adding new colors, also add to `tailwind.config.ts`
3. Use semantic names: `--my-color: 270 80% 50%;`
4. Reference as: `bg-[hsl(var(--my-color))]` or add to tailwind config

### "Add a new platform"

1. Add type to `src/projects/types.ts`
2. Add config to `src/projects/config.ts`
3. Create `src/projects/pages/{newslug}/{NewSlug}Dashboard.tsx`
4. Export from `src/projects/pages/index.ts`
5. Add routes to `src/App.tsx`
6. Create `supabase/functions/{newslug}-api/index.ts`
7. Create database migration for platform data

### "Fix the portfolio"

1. Open `src/pages/Index.tsx`
2. Check related components in `src/components/` (HeroSection, AboutSection, etc.)
3. Keep the "/" route pointing to Index

### "Add authentication to a page"

```tsx
// In App.tsx, wrap with Protected
<Route
  path="/mypage"
  element={
    <PageTransition>
      <Protected>
        <MyPage />
      </Protected>
    </PageTransition>
  }
/>
```

---

## Code Snippets

### Fetching platform data

```tsx
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['simulations'],
  queryFn: async () => {
    const { data, error } = await supabase.from('simcore_simulations').select('*');
    if (error) throw error;
    return data;
  },
});
```

### Using design tokens

```tsx
// ✅ CORRECT - semantic tokens
<div className="bg-background text-foreground">
  <span className="text-primary">Highlighted</span>
</div>

// ❌ WRONG - raw colors
<div className="bg-purple-500 text-white">
```

### Calling Edge Functions

```tsx
const { data, error } = await supabase.functions.invoke('simcore-api', {
  body: { path: '/simulations', method: 'GET' },
});
```

---

## Database Tables

| Table                 | Platform   | Purpose              |
| --------------------- | ---------- | -------------------- |
| `simcore_simulations` | SimCore    | Simulation runs      |
| `mezan_workflows`     | MEZAN      | Workflow definitions |
| `talai_experiments`   | TalAI      | ML experiments       |
| `optilibria_runs`     | OptiLibria | Optimization runs    |
| `qmlab_experiments`   | QMLab      | Quantum experiments  |
| `projects`            | All        | Platform metadata    |
| `profiles`            | All        | User profiles        |

All tables have RLS - users can only access their own data.

---

## Quick Reference

### Routes

```
/                 → Portfolio (src/pages/Index.tsx)
/portfolio        → Same as /
/projects         → Projects Hub
/simcore          → SimCore Dashboard
/mezan            → MEZAN Dashboard
/talai            → TalAI Dashboard
/optilibria       → OptiLibria Dashboard
/qmlab            → QMLab Dashboard
/auth             → Login/Signup
```

### Key Imports

```tsx
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { projectRegistry, getProject } from '@/projects/config';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/design-engines/glassmorphism';
```

### Design Engines

```tsx
// Cyberpunk
import { GlitchText, MatrixRain } from '@/components/design-engines/cyberpunk';

// Glassmorphism
import { GlassCard, GlassButton } from '@/components/design-engines/glassmorphism';

// Neumorphism
import { NeuCard, NeuButton } from '@/components/design-engines/neumorphism';

// Brutalist
import { BrutalCard, BrutalButton } from '@/components/design-engines/brutalist';

// Soft Pastel
import { PastelCard, PastelBadge } from '@/components/design-engines/soft-pastel';
```
