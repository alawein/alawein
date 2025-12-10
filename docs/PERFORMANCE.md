---
title: 'Performance Optimization Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Performance Optimization Guide

Best practices for optimizing performance across Alawein platforms.

## Overview

Performance is critical for user experience. This guide covers optimization
strategies for frontend, backend, and infrastructure.

## Frontend Performance

### Bundle Optimization

#### Code Splitting

```typescript
// Lazy load routes
const SimCore = lazy(() => import("./platforms/simcore/Dashboard"));
const REPZ = lazy(() => import("./platforms/repz/Dashboard"));

// Use Suspense for loading states
<Suspense fallback={<Loading />}>
  <SimCore />
</Suspense>
```

#### Tree Shaking

Import only what you need:

```typescript
// BAD - imports entire library
import _ from 'lodash';

// GOOD - imports only needed function
import debounce from 'lodash/debounce';
```

#### Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --analyze

# Or use vite-bundle-visualizer
npx vite-bundle-visualizer
```

### React Optimization

#### Memoization

```typescript
// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  return <ComplexVisualization data={data} />;
});

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Memoize computed values
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);
```

#### Virtualization

For long lists:

```typescript
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: "400px", overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Image Optimization

#### Responsive Images

```tsx
<img
  src='/image-800.webp'
  srcSet='/image-400.webp 400w, /image-800.webp 800w, /image-1200.webp 1200w'
  sizes='(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px'
  alt='Description'
  loading='lazy'
/>
```

#### WebP Format

Convert images to WebP:

```bash
# Using sharp
npx sharp -i input.png -o output.webp
```

### CSS Optimization

#### Critical CSS

Inline critical CSS for above-the-fold content:

```html
<style>
  /* Critical styles */
  .hero {
    display: flex;
  }
</style>
<link
  rel="stylesheet"
  href="/styles.css"
  media="print"
  onload="this.media='all'"
/>
```

#### Tailwind Purging

Tailwind automatically purges unused styles in production:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // Unused classes are removed in production
};
```

## Backend Performance

### Database Optimization

#### Indexing

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_user_id ON simulations(user_id);
CREATE INDEX idx_created_at ON simulations(created_at);

-- Composite index for common queries
CREATE INDEX idx_user_status ON simulations(user_id, status);
```

#### Query Optimization

```typescript
// BAD - N+1 query
const users = await supabase.from('users').select('*');
for (const user of users) {
  const posts = await supabase.from('posts').select('*').eq('user_id', user.id);
}

// GOOD - single query with join
const { data } = await supabase.from('users').select(`
    *,
    posts (*)
  `);
```

#### Pagination

```typescript
// Use cursor-based pagination for large datasets
const { data } = await supabase
  .from('items')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(20)
  .gt('created_at', lastCursor);
```

### Caching

#### React Query Caching

```typescript
const { data } = useQuery({
  queryKey: ['simulations', userId],
  queryFn: () => fetchSimulations(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
});
```

#### HTTP Caching

```typescript
// Edge Function with cache headers
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300', // 5 minutes
  },
});
```

### Edge Functions

#### Cold Start Optimization

```typescript
// Initialize outside handler
const supabase = createClient(url, key);

export async function handler(req: Request) {
  // Reuses initialized client
  const { data } = await supabase.from('table').select('*');
}
```

## Monitoring

### Core Web Vitals

Track these metrics:

| Metric | Target  | Description              |
| ------ | ------- | ------------------------ |
| LCP    | < 2.5s  | Largest Contentful Paint |
| FID    | < 100ms | First Input Delay        |
| CLS    | < 0.1   | Cumulative Layout Shift  |

### Performance Monitoring

```typescript
// Track performance metrics
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

### Lighthouse

Run regular audits:

```bash
# CLI audit
npx lighthouse https://yoursite.com --output html

# Or use Chrome DevTools > Lighthouse tab
```

## Platform-Specific

### SimCore

- Use WebGL for visualizations
- Offload calculations to Web Workers
- Stream large datasets

### REPZ

- Cache workout templates
- Lazy load historical data
- Optimize chart rendering

### QMLab

- Use WebAssembly for quantum calculations
- Progressive loading for experiments
- Efficient state management

## Checklist

### Before Release

- [ ] Bundle size under budget
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Database queries optimized
- [ ] Caching configured
- [ ] Lighthouse score > 90

## Related Documents

- [MONITORING.md](./MONITORING.md) - Monitoring setup
- [CACHING.md](./CACHING.md) - Caching strategies
- [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) - Infrastructure guide
