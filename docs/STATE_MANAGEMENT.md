---
title: 'State Management Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# State Management Guide

React Query patterns, context usage, and local state best practices.

## Overview

We use a layered approach to state management:

| Layer           | Tool                | Use Case            |
| --------------- | ------------------- | ------------------- |
| Server State    | React Query         | API data, caching   |
| Global UI State | React Context       | Theme, auth, modals |
| Local State     | useState/useReducer | Component-specific  |
| Form State      | React Hook Form     | Form handling       |
| URL State       | React Router        | Navigation, filters |

## React Query (Server State)

### Basic Query

```typescript
import { useQuery } from "@tanstack/react-query";

function useSimulations(userId: string) {
  return useQuery({
    queryKey: ["simulations", userId],
    queryFn: () => fetchSimulations(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Usage
function SimulationList() {
  const { data, isLoading, error } = useSimulations(userId);

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return <List items={data} />;
}
```

### Mutations

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useCreateSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSimulation,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
    },
    onError: (error) => {
      toast.error("Failed to create simulation");
    },
  });
}

// Usage
function CreateButton() {
  const mutation = useCreateSimulation();

  return (
    <button
      onClick={() => mutation.mutate({ name: "New Simulation" })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Creating..." : "Create"}
    </button>
  );
}
```

### Optimistic Updates

```typescript
function useUpdateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkout,
    onMutate: async (newWorkout) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['workouts'] });

      // Snapshot previous value
      const previousWorkouts = queryClient.getQueryData(['workouts']);

      // Optimistically update
      queryClient.setQueryData(['workouts'], (old) =>
        old.map((w) => (w.id === newWorkout.id ? newWorkout : w)),
      );

      return { previousWorkouts };
    },
    onError: (err, newWorkout, context) => {
      // Rollback on error
      queryClient.setQueryData(['workouts'], context.previousWorkouts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}
```

### Query Keys

```typescript
// Hierarchical query keys
const queryKeys = {
  all: ['simulations'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: Filters) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
};

// Usage
useQuery({ queryKey: queryKeys.detail(simulationId) });
queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
```

## React Context (Global UI State)

### Auth Context

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

### Theme Context

```typescript
// contexts/ThemeContext.tsx
type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);

    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## Local State

### useState for Simple State

```typescript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### useReducer for Complex State

```typescript
type State = {
  items: Item[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Item[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'REMOVE_ITEM'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
    default:
      return state;
  }
}

function ItemList() {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    loading: false,
    error: null,
  });

  // Use dispatch to update state
  dispatch({ type: 'ADD_ITEM', payload: newItem });
}
```

## Form State

### React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await signIn(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register("password")} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loading..." : "Sign In"}
      </button>
    </form>
  );
}
```

## Best Practices

### When to Use What

| Scenario            | Solution               |
| ------------------- | ---------------------- |
| API data            | React Query            |
| Auth state          | Context                |
| Theme/preferences   | Context + localStorage |
| Form inputs         | React Hook Form        |
| UI toggles          | useState               |
| Complex local state | useReducer             |
| URL params          | React Router           |

### Avoid Common Pitfalls

1. **Don't put server state in Context** - Use React Query
2. **Don't over-use Context** - Causes unnecessary re-renders
3. **Don't duplicate state** - Single source of truth
4. **Don't forget cleanup** - Unsubscribe in useEffect

## Related Documents

- [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) - Component patterns
- [ERROR_HANDLING.md](./ERROR_HANDLING.md) - Error handling
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
