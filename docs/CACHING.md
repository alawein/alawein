---
title: 'Caching Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Caching Guide

Browser caching, CDN configuration, and React Query cache strategies.

## Overview

Effective caching improves performance and reduces server load. This guide
covers caching strategies at different levels.

## Caching Layers

```
┌─────────────────────────────────────────┐
│           Browser Cache                  │
│  (Service Worker, HTTP Cache, Memory)    │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│              CDN Cache                   │
│         (Vercel Edge Network)            │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│          Application Cache               │
│           (React Query)                  │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           Database Cache                 │
│        (PostgreSQL, Supabase)            │
└─────────────────────────────────────────┘
```

## React Query Caching

### Global Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});
```

### Cache Time vs Stale Time

| Setting     | Description                           |
| ----------- | ------------------------------------- |
| `staleTime` | How long data is considered fresh     |
| `cacheTime` | How long inactive data stays in cache |

```typescript
// Data that changes frequently
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 30 * 1000, // 30 seconds
});

// Data that rarely changes
useQuery({
  queryKey: ['user', 'profile'],
  queryFn: fetchProfile,
  staleTime: 10 * 60 * 1000, // 10 minutes
});

// Static data
useQuery({
  queryKey: ['config'],
  queryFn: fetchConfig,
  staleTime: Infinity, // Never stale
});
```

### Cache Invalidation

```typescript
const queryClient = useQueryClient();

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['simulations'] });

// Invalidate with prefix
queryClient.invalidateQueries({ queryKey: ['simulations', userId] });

// Invalidate all queries
queryClient.invalidateQueries();

// Remove from cache
queryClient.removeQueries({ queryKey: ['simulations', id] });
```

### Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateSimulation,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['simulations', id] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(['simulations', id]);

    // Optimistically update
    queryClient.setQueryData(['simulations', id], newData);

    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['simulations', id], context.previous);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ['simulations', id] });
  },
});
```

### Prefetching

```typescript
// Prefetch on hover
function SimulationLink({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["simulation", id],
      queryFn: () => fetchSimulation(id),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <Link to={`/simulations/${id}`} onMouseEnter={prefetch}>
      View Simulation
    </Link>
  );
}
```

## HTTP Caching

### Cache-Control Headers

```typescript
// Edge Function response
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  },
});
```

### Cache Directives

| Directive                | Description                   |
| ------------------------ | ----------------------------- |
| `public`                 | Can be cached by CDN          |
| `private`                | Only browser can cache        |
| `max-age=N`              | Fresh for N seconds (browser) |
| `s-maxage=N`             | Fresh for N seconds (CDN)     |
| `no-cache`               | Must revalidate               |
| `no-store`               | Never cache                   |
| `stale-while-revalidate` | Serve stale while fetching    |

### Examples

```typescript
// Static assets (1 year)
"Cache-Control": "public, max-age=31536000, immutable"

// API responses (5 minutes)
"Cache-Control": "public, max-age=300, s-maxage=600"

// User-specific data
"Cache-Control": "private, max-age=60"

// Never cache
"Cache-Control": "no-store"
```

## CDN Caching (Vercel)

### Configuration

```json
// vercel.json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Edge Caching

```typescript
// Next.js/Vercel Edge
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const data = await fetchData();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

## Browser Caching

### Service Worker

```typescript
// sw.js
const CACHE_NAME = 'app-cache-v1';
const STATIC_ASSETS = ['/', '/index.html', '/static/js/main.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
```

### LocalStorage Caching

```typescript
// Simple cache wrapper
const cache = {
  get: <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { value, expiry } = JSON.parse(item);
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  },

  set: <T>(key: string, value: T, ttlMs?: number) => {
    const item = {
      value,
      expiry: ttlMs ? Date.now() + ttlMs : null,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },
};
```

## Cache Strategies

### Cache-First

Best for static assets:

```typescript
async function cacheFirst(request: Request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());

  return response;
}
```

### Network-First

Best for dynamic data:

```typescript
async function networkFirst(request: Request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request);
  }
}
```

### Stale-While-Revalidate

Best for frequently updated data:

```typescript
async function staleWhileRevalidate(request: Request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request).then((response) => {
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, response.clone());
    });
    return response;
  });

  return cached || fetchPromise;
}
```

## Platform-Specific

### SimCore

- Cache simulation configs (rarely change)
- Don't cache results (unique per run)
- Prefetch common simulation types

### REPZ

- Cache exercise database (static)
- Short cache for workout history
- Invalidate on new workout

### LiveItIconic

- Cache product catalog (with revalidation)
- Don't cache cart/checkout
- Cache product images aggressively

## Best Practices

1. **Cache static assets aggressively** - Use long max-age with immutable
2. **Use stale-while-revalidate** - Better UX for dynamic data
3. **Invalidate on mutations** - Keep cache consistent
4. **Prefetch likely navigation** - Improve perceived performance
5. **Monitor cache hit rates** - Optimize based on data

## Related Documents

- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - State patterns
- [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) - Infrastructure guide
