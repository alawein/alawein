# Architecture Documentation

## Overview
Modern SaaS React template with enterprise-grade architecture patterns.

## Tech Stack
- **Frontend**: React 18, TypeScript 5.7, Vite 6
- **Styling**: Tailwind CSS, Radix UI
- **State**: TanStack Query, Context API
- **Backend**: Supabase (Auth, Database, Storage)
- **Testing**: Vitest, Testing Library
- **Build**: SWC, ESBuild

## Architecture Patterns

### 1. Component Architecture
```
src/
├── components/     # Reusable UI components
├── pages/          # Route-level components
├── contexts/       # Global state providers
├── hooks/          # Custom React hooks
└── lib/            # Utilities and services
```

### 2. State Management
- **Server State**: TanStack Query (caching, refetching)
- **Auth State**: AuthContext (Supabase integration)
- **UI State**: React hooks (useState, useReducer)

### 3. Data Flow
```
User Action → Component → Hook → API Client → Supabase → Cache → UI Update
```

### 4. Security Layers
- Environment validation (Zod)
- CSP headers
- HTTPS enforcement
- PKCE auth flow
- Input sanitization

### 5. Performance Optimizations
- Code splitting (lazy loading)
- Manual chunk splitting
- Service worker caching
- View Transitions API
- Optimized dependencies

### 6. Error Handling
- ErrorBoundary (React errors)
- API error handling
- Logger utility
- User-friendly fallbacks

## Design Decisions

### Why Supabase?
- Built-in auth with PKCE
- Real-time subscriptions
- Row-level security
- Automatic API generation

### Why TanStack Query?
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication

### Why Radix UI?
- Accessibility built-in
- Unstyled primitives
- Keyboard navigation
- ARIA compliance

## Scalability Considerations
- Modular architecture
- Lazy loading routes
- API client abstraction
- Environment-based config
- Horizontal scaling ready

## Security Best Practices
- No hardcoded secrets
- Validated environment variables
- Strict CSP headers
- HTTPS only
- Secure session management

## Deployment
- Vercel/Netlify/Cloudflare Pages
- Automatic HTTPS
- Edge caching
- Global CDN
- Zero-downtime deploys
