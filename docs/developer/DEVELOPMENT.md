# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# Clone & install
git clone <repo-url>
cd alawein-quantum-forge
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Development Workflow

### Adding Features to a Platform

1. **Locate the dashboard**:
   `src/projects/pages/{platform}/{Platform}Dashboard.tsx`
2. **Update the API** if needed: `supabase/functions/{platform}-api/index.ts`
3. **Update config** if adding routes: `src/projects/config.ts`
4. **Update App.tsx** if adding new routes

### Creating a New Platform

```bash
# 1. Add type definition
# src/projects/types.ts
export interface NewPlatformProject extends Project {
  customField: string;
}

# 2. Add configuration
# src/projects/config.ts
export const projectRegistry = {
  // ...existing platforms
  newplatform: {
    id: 'newplatform',
    name: 'New Platform',
    slug: 'newplatform',
    // ... full config
  }
}

# 3. Create dashboard
# src/projects/pages/newplatform/NewPlatformDashboard.tsx

# 4. Update barrel exports
# src/projects/pages/index.ts

# 5. Add routes to App.tsx

# 6. Create Edge Function
# supabase/functions/newplatform-api/index.ts

# 7. Create database migration for platform data
```

### Working with the Design System

```tsx
// Always import from design engines
import { GlassCard } from '@/components/design-engines/glassmorphism';
import { GlitchText } from '@/components/design-engines/cyberpunk';

// Use semantic tokens
<div className='bg-background text-foreground'>
  <span className='text-primary'>Highlighted</span>
  <span className='text-muted-foreground'>Muted</span>
</div>;

// Never use raw colors
// ❌ className="bg-purple-500"
// ✅ className="bg-primary"
```

---

## Code Patterns

### Fetching Data with TanStack Query

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['simulations'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('simcore_simulations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
});

// Mutate data
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: async (newSimulation) => {
    const { data, error } = await supabase
      .from('simcore_simulations')
      .insert(newSimulation)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['simulations'] });
  },
});
```

### Using Zustand Stores

```tsx
import { useAuthStore } from '@/stores/authStore';

function Component() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return isAuthenticated ? (
    <Button onClick={logout}>Logout</Button>
  ) : (
    <Button onClick={() => login(email, password)}>Login</Button>
  );
}
```

### Protected Routes

```tsx
// In App.tsx
<Route
  path='/admin'
  element={
    <PageTransition>
      <Protected>
        <AdminPanel />
      </Protected>
    </PageTransition>
  }
/>

// The Protected component checks isAuthenticated from authStore
```

### Calling Edge Functions

```tsx
import { supabase } from '@/integrations/supabase/client';

// Call platform API
const response = await supabase.functions.invoke('simcore-api', {
  body: {
    path: '/simulations',
    method: 'POST',
    data: { name: 'New Simulation', type: 'particle' },
  },
});

if (response.error) {
  console.error(response.error);
} else {
  console.log(response.data);
}
```

---

## File Conventions

### Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Stores: `camelCaseStore.ts`
- Types: `camelCase.types.ts`

### Imports

```tsx
// Use path aliases
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { projectRegistry } from '@/projects/config';
```

### Component Structure

```tsx
// Standard component structure
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

const Component = ({ title, onAction }: ComponentProps) => {
  const [state, setState] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='p-4 bg-card rounded-lg'
    >
      <h2 className='text-lg font-semibold'>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </motion.div>
  );
};

export default Component;
```

---

## Testing

### Manual Testing

1. Run `npm run dev`
2. Navigate to each platform: `/simcore`, `/mezan`, `/talai`, `/optilibria`,
   `/qmlab`
3. Test authentication flow at `/auth`
4. Verify protected routes redirect properly

### Checking Edge Functions

```bash
# View function logs in Lovable Cloud
# Or test via curl:
curl -X POST https://hfbexbargmskuwybaucz.supabase.co/functions/v1/simcore-api \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"path": "/simulations", "method": "GET"}'
```

---

## Common Issues

### "Cannot find module" errors

- Check path aliases in `tsconfig.json`
- Ensure barrel exports in `index.ts` files

### Supabase types out of sync

- The `types.ts` is auto-generated; never edit manually
- Changes appear after database migrations

### Styling not applying

- Use semantic tokens, not raw colors
- Check if CSS variables are defined in `index.css`
- Verify Tailwind classes exist in `tailwind.config.ts`

### Protected routes not working

- Check `useAuthStore` has correct `isAuthenticated` state
- Verify `AuthProvider` wraps routes in `App.tsx`
