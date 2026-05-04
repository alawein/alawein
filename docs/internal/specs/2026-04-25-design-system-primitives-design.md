---
title: Spec 3 — Design System Primitives
date: 2026-04-25
status: active
type: canonical
feeds: [master-execution-plan]
last_updated: 2026-04-25
---

# Spec 3 — Design System Primitives

**Repo:** `design-system/`
**Track:** Parallel with Specs 1, 2, 5
**Source:** 2026-04-24 workspace review — Spec B (Criticals: missing ErrorBoundary, EmptyState, LoadingSpinner/PageLoader in @alawein/ui); 7 active product repos each ship their own local variant

---

## Purpose

Ship four components to `@alawein/ui` that every active product repo currently duplicates locally. Once shipped, products can remove their local copies and import from the shared package. This is the highest cross-product leverage change in the workspace.

---

## Components

### 1. ErrorBoundary

**Why it's missing:** React error boundaries cannot be written as function components — they require a class component. Most teams defer shipping this to the shared library because it's slightly awkward. All 7 products have a local variant.

**Design:**
- Wraps `react-error-boundary`'s `ErrorBoundary` with a default fallback that uses `@alawein/tokens` CSS variables
- Exports both the wrapper component and the `FallbackProps` type re-export for consumers who build custom fallbacks
- Default fallback: centered container, `var(--color-destructive)` border, `var(--color-destructive-foreground)` text, error message + optional reset button
- `onError` prop forwarded to `react-error-boundary` for logging
- In development (`process.env.NODE_ENV === 'development'`): re-renders the error to the console with full stack trace

**API:**
```tsx
<ErrorBoundary fallback={<p>Something went wrong</p>} onError={logError}>
  <MyComponent />
</ErrorBoundary>

// Or use the default fallback:
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

**Files:**
- Create: `packages/@alawein/ui/src/ErrorBoundary.tsx`
- Create: `packages/@alawein/ui/src/ErrorBoundary.test.tsx`
- Modify: `packages/@alawein/ui/src/index.ts` — add export

---

### 2. EmptyState

**Why it's missing:** EmptyState is surface-specific (empty search results, empty lists, empty dashboards all look different) so teams default to local implementations. The result is 5 divergent styles.

**Design:**
- Composable: all slots are optional with sensible defaults
- Slots: `icon` (any ReactNode), `title` (string), `description` (string), `action` (ReactNode — typically a `Button`)
- Layout: vertical stack, centered, uses `var(--spacing-*)` tokens for gaps
- No hardcoded colors — inherits from parent context
- `className` prop for surface-level overrides

**API:**
```tsx
<EmptyState
  icon={<SearchIcon />}
  title="No results found"
  description="Try adjusting your filters."
  action={<Button onClick={clearFilters}>Clear filters</Button>}
/>
```

**Files:**
- Create: `packages/@alawein/ui/src/EmptyState.tsx`
- Create: `packages/@alawein/ui/src/EmptyState.test.tsx`
- Modify: `packages/@alawein/ui/src/index.ts` — add export

---

### 3. LoadingSpinner

**Why it's missing:** Products use a mix of `animate-pulse` (Tailwind skeleton), bare div strings, and custom SVG spinners. None are accessible.

**Design:**
- Headless: no hardcoded colors or sizes — all via `className`
- Animated via CSS `@keyframes rotate` (not Tailwind animate — keeps it portable)
- Required `aria-label` prop (no silent spinners)
- `size` variant prop: `sm` (16px), `md` (24px, default), `lg` (40px)
- Uses `currentColor` for the stroke so it inherits from parent text color

**API:**
```tsx
<LoadingSpinner aria-label="Loading workout data" size="md" className="text-primary" />
```

**Files:**
- Create: `packages/@alawein/ui/src/LoadingSpinner.tsx`
- Create: `packages/@alawein/ui/src/LoadingSpinner.test.tsx`
- Modify: `packages/@alawein/ui/src/index.ts` — add export

---

### 4. PageLoader

**Why it's missing:** Suspense fallbacks across the 8 products are bare string divs (`<div>Loading...</div>`). A `PageLoader` wrapping `LoadingSpinner` with a full-viewport overlay is the correct Suspense-compatible primitive.

**Design:**
- Wraps `LoadingSpinner` in a fixed full-viewport overlay
- `aria-live="polite"` on the overlay so screen readers announce it
- `label` prop forwarded to `LoadingSpinner`'s `aria-label`
- Background: `var(--color-background)` at 80% opacity (backdrop blur optional via `className`)
- Exported as a named export for direct `Suspense` use:

```tsx
// In a route file:
<Suspense fallback={<PageLoader label="Loading dashboard" />}>
  <Dashboard />
</Suspense>
```

**Files:**
- Create: `packages/@alawein/ui/src/PageLoader.tsx`
- Create: `packages/@alawein/ui/src/PageLoader.test.tsx`
- Modify: `packages/@alawein/ui/src/index.ts` — add export

---

## Test requirements

Each component test file (Vitest + `@testing-library/react`) must cover:

| Component | Required test cases |
|-----------|---------------------|
| ErrorBoundary | Renders children when no error; renders fallback when child throws; calls onError when child throws; resets correctly |
| EmptyState | Renders with all slots; renders with no slots (no crash); icon/title/description/action are all optional |
| LoadingSpinner | Has correct aria-label; renders at correct size variant; has no hardcoded color |
| PageLoader | Has aria-live="polite"; renders LoadingSpinner inside; forwarded label prop reaches spinner |

---

## Versioning

After all four components are implemented and tested:

1. Create a changeset: `npx changeset` — minor bump for `@alawein/ui` (new exports, backward compatible)
2. Changeset message: "feat(ui): add ErrorBoundary, EmptyState, LoadingSpinner, PageLoader primitives"
3. Run `npm run build` from design-system root to confirm turbo pipeline succeeds
4. Publish via existing changeset workflow

The version bump is `minor` not `patch` — new exports, no breaking changes.

---

## Constraints

- `react-error-boundary` must be added as a dependency of `@alawein/ui` if not already present — do not inline the class component logic
- `LoadingSpinner` must not use Tailwind `animate-spin` — use explicit `@keyframes` so it works in non-Tailwind consumers
- No hardcoded hex colors in any component — all colors via CSS custom properties from `@alawein/tokens`
- All four components in one PR to keep the changeset atomic
- Do not migrate product repos away from their local copies in this spec — that is a follow-up task per product
