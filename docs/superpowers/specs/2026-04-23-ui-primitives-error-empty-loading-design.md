---
title: "@alawein/ui Primitives Design — ErrorBoundary, EmptyState, Spinner, PageLoader"
date: 2026-04-23
status: active
type: canonical
feeds_from: [active-products-audit, shared-infrastructure-audit, master-execution-plan]
last_updated: 2026-04-23
---

# Design Spec: @alawein/ui Primitives — ErrorBoundary, EmptyState, Spinner, PageLoader

- **Date:** 2026-04-23
- **Author:** Meshal Alawein
- **Status:** Approved for implementation
- **MEP rows covered:** 16, 17, 18, 19 (Spec B, `@alawein/ui`)
- **Downstream unblocks:** MEP rows 20–26 (bolts, repz, gymboy, meshal-web, attributa, atelier-rounaq, llmworks migrations)
- **Repo:** `design-system/` (Turborepo npm workspace)
- **Target package:** `packages/ui/` (`@alawein/ui`)
- **Version target:** `0.1.2 → 0.2.0` (minor via Changesets)

---

## 1. Summary

Ship three missing primitives into `@alawein/ui` so that 7 active products (bolts, repz, gymboy, meshal-web, attributa, atelier-rounaq, llmworks) can delete their local duplicates and import from the shared package:

- `<ErrorBoundary>` + `<ErrorFallback>` with typed `FallbackProps` and `variant: 'inline' | 'page'`
- `<EmptyState>` with `icon | title | description | action` slots and `variant: 'inline' | 'page'`
- `<Spinner>` (sized via CVA) + `<PageLoader>` (centered Suspense fallback wrapper)

Skeleton already exists. Together these four components form the canonical three-primitive loading surface (Spinner, PageLoader, Skeleton) plus two canonical state surfaces (ErrorBoundary, EmptyState) that every Alawein product needs.

Publish a minor version bump (`0.2.0`) with a CHANGELOG entry. Do not change any existing export.

## 2. Problem

From Spec B ("shared infrastructure audit") and Spec A ("active products audit"):

- `@alawein/ui` currently exports 44 Radix+CVA components. `ErrorBoundary`, `EmptyState`, `Spinner`, and `PageLoader` are absent.
- Each of the 7 products has independently reinvented these primitives. Variations:
  - **ErrorBoundary:** repz ships a custom `useErrorHandler`; gymboy's `ErrorFallback` has `implicit any` typing; bolts' fallback applies light-theme styling on dark themes (Spec A visual bug); meshal-web/attributa/atelier-rounaq all have separate hand-rolled class components.
  - **EmptyState:** repz, gymboy, attributa, atelier-rounaq, scribd each have local variants. llmworks silently omits empty states (Spec A flagged it as a UX gap).
  - **Loading:** repz uses bare divs, bolts uses `animate-pulse`, scribd uses inline strings, llmworks has a custom `LoadingSpinner`. No shared Suspense fallback exists.

The cost: 7 products' error/empty/loading surfaces drift independently; token-correct theming is inconsistent; bug fixes don't propagate.

## 3. Non-goals

- Not migrating the 7 consumers in this spec — each migration is a separate MEP row (20–26), scoped to that product's own PR.
- Not shipping a Sentry/PostHog telemetry adapter — the `onError` prop is the hook point; how consumers wire telemetry is out of scope (MEP row 95 tracks canonical toast/telemetry patterns separately).
- Not modifying `@alawein/tokens` or any theme package — these primitives consume existing tokens (`text-foreground`, `bg-muted`, `text-muted-foreground`, `text-destructive`) via Tailwind utilities.
- Not touching `packages/ui/src/components/skeleton.tsx` — skeleton is already shipped and canonical.
- Not refactoring existing components. Scope is additive only.

## 4. Architecture

### 4.1 Package layout

All three primitives live in the existing `@alawein/ui` package. No new workspace packages. File additions:

```
design-system/packages/ui/src/components/
  error-boundary.tsx
  error-boundary.test.tsx
  empty-state.tsx
  empty-state.test.tsx
  spinner.tsx
  spinner.test.tsx
```

### 4.2 Dependency additions

`packages/ui/package.json` → `dependencies`:

```json
"react-error-boundary": "^4.1.2"
```

Rationale: `react-error-boundary` (Brian Vaughn, ~2.9M weekly downloads) is React 18/19 compatible, correctly typed, and ships `resetErrorBoundary`, `resetKeys`, `onReset`, and `FallbackProps` as a tested contract. Wrapping it avoids reinventing class-component lifecycle, `getDerivedStateFromError`, and the typing edge cases that caused gymboy's implicit-any bug.

No other dependencies added. `lucide-react` is already present.

### 4.3 Export additions

`packages/ui/src/index.ts` — insert three `export * from` lines in the existing alphabetical block. Correct alphabetical position: `dropdown-menu` < `empty-state` < `error-boundary` < `form`; `sonner` < `spinner` < `switch`.

| Position | New line |
| --- | --- |
| between `dropdown-menu` and `form` | `export * from './components/empty-state';` |
| between `empty-state` and `form` | `export * from './components/error-boundary';` |
| between `sonner` and `switch` | `export * from './components/spinner';` |

Top-level exports added:

- `ErrorBoundary` (component)
- `ErrorFallback` (component)
- `FallbackProps` (type re-export)
- `ErrorBoundaryProps` (type re-export)
- `EmptyState` (component)
- `Spinner` (component)
- `PageLoader` (component)

Existing exports are untouched.

## 5. Component APIs

### 5.1 `<ErrorBoundary>` + `<ErrorFallback>`

**File:** `packages/ui/src/components/error-boundary.tsx`

```tsx
import { AlertTriangle } from 'lucide-react';
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
  type ErrorBoundaryProps,
} from 'react-error-boundary';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Button } from './button';

export type { FallbackProps, ErrorBoundaryProps };

export function ErrorBoundary({ onError, ...props }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      onError={onError ?? ((error) => { console.error('[ErrorBoundary]', error); })}
      {...props}
    />
  );
}

const fallbackVariants = cva(
  'flex flex-col items-center justify-center gap-3 text-center',
  {
    variants: {
      variant: {
        inline: 'rounded-lg border bg-card p-6',
        page: 'min-h-[60vh] p-8 gap-4',
      },
    },
    defaultVariants: { variant: 'inline' },
  },
);

export interface ErrorFallbackProps
  extends FallbackProps,
    VariantProps<typeof fallbackVariants> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
  variant,
  title = 'Something went wrong',
  description,
  icon,
  action,
  className,
}: ErrorFallbackProps) {
  const iconSize = variant === 'page' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div role="alert" className={cn(fallbackVariants({ variant }), className)}>
      {icon ?? <AlertTriangle className={cn(iconSize, 'text-destructive')} />}
      <div className="space-y-1">
        <h2 className={cn(
          'font-semibold text-foreground',
          variant === 'page' ? 'text-2xl' : 'text-lg',
        )}>
          {title}
        </h2>
        <p className="text-sm text-muted-foreground max-w-prose">
          {description ?? error.message}
        </p>
      </div>
      {action ?? (
        <Button onClick={resetErrorBoundary} variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
}
```

**Behavior contract:**

- `ErrorBoundary` re-exports `react-error-boundary`'s full surface. `resetErrorBoundary`, `resetKeys`, `onReset`, `fallback`, `fallbackRender`, `FallbackComponent` all work unchanged.
- Default `onError` logs `[ErrorBoundary]` + the error to `console.error`. Pass `onError={customHandler}` to override. Pass `onError={() => {}}` to silence.
- `ErrorFallback` defaults to `variant="inline"` (fits inside a Card/route segment). `variant="page"` for full-route fallbacks.
- Default copy: `title = "Something went wrong"`, `description = error.message`. Both overridable.
- Default icon: `AlertTriangle` at `text-destructive`. Consumer passes any `ReactNode` via `icon` prop.
- Default action: `Button` with `onClick={resetErrorBoundary}` labeled "Try again". Replaceable via `action` slot.
- `role="alert"` is set on the container so screen readers announce the error.

### 5.2 `<EmptyState>`

**File:** `packages/ui/src/components/empty-state.tsx`

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center gap-3 text-center',
  {
    variants: {
      variant: {
        inline: 'rounded-lg border border-dashed bg-muted/30 p-8',
        page: 'min-h-[50vh] p-8 gap-4',
      },
    },
    defaultVariants: { variant: 'inline' },
  },
);

export interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ variant }), className)}>
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="space-y-1">
        <h2 className={cn(
          'font-semibold text-foreground',
          variant === 'page' ? 'text-2xl' : 'text-lg',
        )}>
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground max-w-prose">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
```

**Behavior contract:**

- `title` is required. `icon`, `description`, `action` are optional and only render when provided.
- `icon` wrapper applies `text-muted-foreground` so any Lucide icon passed inherits the correct muted color automatically via `currentColor`. Consumer controls sizing (e.g., `<Inbox className="w-10 h-10" />`).
- `variant="inline"` uses a dashed border + muted background — signals "empty slot" visually distinct from an error surface.
- `variant="page"` mirrors ErrorFallback's page shape at `min-h-[50vh]` (slightly shorter than ErrorFallback's `60vh` — empty pages feel less alarming).
- `action` slot accepts any `ReactNode`: a `Button`, a `Link`, a fragment with multiple buttons, etc.

### 5.3 `<Spinner>` + `<PageLoader>`

**File:** `packages/ui/src/components/spinner.tsx`

```tsx
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const spinnerVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-10 h-10',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface SpinnerProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'aria-label'>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({
  size,
  label = 'Loading',
  className,
  ...props
}: SpinnerProps) {
  return (
    <>
      <Loader2
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ size }), className)}
        {...props}
      />
      <span className="sr-only">{label}</span>
    </>
  );
}

export interface PageLoaderProps {
  label?: string;
  className?: string;
}

export function PageLoader({ label = 'Loading', className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex min-h-[50vh] w-full items-center justify-center',
        className,
      )}
    >
      <Spinner size="lg" label={label} />
    </div>
  );
}
```

**Behavior contract:**

- `Spinner` renders Lucide `Loader2` with `animate-spin`. Sizes: `sm` (16px), `md` (24px, default), `lg` (40px).
- `role="status"` + `aria-label` + sibling `sr-only` text — screen readers announce loading state.
- Base color is `text-muted-foreground`. Override via `className="text-primary"` or similar. `cn` merges so variant size + custom color compose correctly.
- `PageLoader` is a thin centered wrapper around `<Spinner size="lg">` for Suspense fallbacks. Defaults to `min-h-[50vh]`; full-screen consumers pass `className="min-h-screen"`.
- Accepts all `SVGAttributes` except `aria-label` (reserved for the `label` prop).

## 6. Token wiring

All three primitives rely on the existing token contract from `@alawein/tokens` via Tailwind utilities:

| Token utility | Where used | Why |
| --- | --- | --- |
| `text-foreground` | Titles in ErrorFallback, EmptyState | Primary readable text across all 29 themes |
| `text-muted-foreground` | Descriptions, Spinner base color, EmptyState icon wrapper | Secondary/subdued text, consistent muted contrast |
| `text-destructive` | Default AlertTriangle icon in ErrorFallback | Signals error severity; themed per palette |
| `bg-card` / `border` | ErrorFallback `variant="inline"` container | Matches Card surface contract |
| `bg-muted/30` / `border-dashed` | EmptyState `variant="inline"` container | Visually distinct from error surface (dashed) and from content surface (muted) |

No new tokens are introduced. All 29 themes (8 families + 2 special edition groups) inherit correct contrast for free.

## 7. Testing strategy

Every component file gets a sibling `*.test.tsx` following the existing `alert.test.tsx`/`skeleton.test.tsx` pattern (vitest + `@testing-library/react` + `jsdom`).

### 7.1 `error-boundary.test.tsx`

- Renders children when no error is thrown.
- Catches thrown error and renders `FallbackComponent` with correct `FallbackProps` (`error`, `resetErrorBoundary`).
- Default `console.error` fires on catch; custom `onError` prop suppresses default and receives `(error, info)`.
- `ErrorFallback variant="inline"` applies `rounded-lg`, `border`, `bg-card`, `p-6` classes.
- `ErrorFallback variant="page"` applies `min-h-[60vh]` class.
- Clicking default action button calls `resetErrorBoundary`.
- `resetKeys` change re-renders children after a reset.
- Custom `title`, `description`, `icon`, `action` props override defaults.
- `role="alert"` is present on the fallback container.

### 7.2 `empty-state.test.tsx`

- Renders `title` (required).
- `icon`, `description`, `action` render only when provided.
- `variant="inline"` applies `border-dashed` + `bg-muted/30` classes.
- `variant="page"` applies `min-h-[50vh]` class.
- `action` slot accepts fragment with multiple children.
- `className` prop merges via `cn` without clobbering variant classes.

### 7.3 `spinner.test.tsx`

- Renders `Loader2` svg with `animate-spin` class.
- Each `size` variant sets the correct `w-*`/`h-*` pair (`sm`→`w-4 h-4`, `md`→`w-6 h-6`, `lg`→`w-10 h-10`).
- `role="status"` present; `aria-label` matches `label` prop; `sr-only` span matches `label` prop.
- `PageLoader` wraps a `size="lg"` Spinner in a `min-h-[50vh]` flex-centered container.
- Custom `className` on `PageLoader` merges — does not replace `min-h-[50vh]`.
- Custom `label` prop propagates to both `aria-label` and `sr-only` text.

### 7.4 Export-parity test update

`packages/ui/src/components/export-parity.test.ts` currently enumerates expected top-level exports. Add to the expected list:

- `ErrorBoundary`
- `ErrorFallback`
- `EmptyState`
- `Spinner`
- `PageLoader`

Type-only exports (`FallbackProps`, `ErrorBoundaryProps`) are covered by `tsc --noEmit` compilation, not by the runtime export-parity test — do not add them to the parity list.

### 7.5 Storybook stories

`apps/storybook/stories/` gets three new files following existing conventions (`Alert.stories.tsx`, `Skeleton.stories.tsx`):

- **`ErrorBoundary.stories.tsx`** — Default inline; Page variant; Custom title/description; Custom icon; Sentry-style `onError` (console-logged). Uses a `<ThrowOnClick>` helper component so reviewers can trigger the fallback interactively.
- **`EmptyState.stories.tsx`** — No data yet; No search results (inline in Card); Page variant 404; With single action; With dual action (fragment); Without action.
- **`Spinner.stories.tsx`** — All three sizes; In-button composition; In-card centered; `PageLoader` fullbleed.

Verify all three stories render cleanly under at least 3 themes (`theme-base`, `theme-meshal-ai`, `theme-brutalism`) via Storybook's theme switcher.

## 8. Release mechanics

### 8.1 Changeset

`design-system/.changeset/ui-error-empty-loading-primitives.md`:

```md
---
"@alawein/ui": minor
---

Add ErrorBoundary, EmptyState, and Spinner/PageLoader primitives.

- `<ErrorBoundary>` wraps `react-error-boundary` with a `console.error` default
  `onError` handler. Re-exports `FallbackProps` and `ErrorBoundaryProps` types.
- `<ErrorFallback>` — token-driven default fallback with `variant: 'inline' | 'page'`,
  overridable `title`, `description`, `icon`, and `action`.
- `<EmptyState>` — `icon | title | description | action` slot API with
  `variant: 'inline' | 'page'`.
- `<Spinner>` — Lucide `Loader2` with `size: 'sm' | 'md' | 'lg'` and accessible
  `role="status"` + `sr-only` label.
- `<PageLoader>` — centered `<Spinner size="lg">` wrapper for Suspense fallbacks.

Adds `react-error-boundary@^4.1.2` as a dependency.
```

### 8.2 Version bump sequence

1. Drop the changeset `.md` above into `design-system/.changeset/`.
2. `npx changeset version` — bumps `@alawein/ui` to `0.2.0`, regenerates `packages/ui/CHANGELOG.md`, commits.
3. `npm run build -w @alawein/ui` — regenerates `dist/`.
4. `npm test -w @alawein/ui && npm run lint -w @alawein/ui` — must pass.
5. `npx changeset publish` — pushes `@alawein/ui@0.2.0` to npm (public access).
6. `git push --follow-tags`.

### 8.3 CHANGELOG + COMPONENTS docs

- `packages/ui/CHANGELOG.md` — auto-generated by Changesets. No manual edit.
- `packages/ui/COMPONENTS.md` — append three rows to the existing table documenting the new components and their variants.
- `packages/ui/README.md` — optional three-primitive-loading-surface section (Spinner / PageLoader / Skeleton) noted as a follow-up; MEP row 93 covers extended README documentation separately.

### 8.4 Release gate (must pass before `changeset publish`)

- All new vitest files pass (`npm test -w @alawein/ui`).
- `tsc --noEmit` clean in `packages/ui/`.
- `export-parity.test.ts` updated and passing.
- `npm run build -w @alawein/ui` produces `dist/components/error-boundary.*`, `dist/components/empty-state.*`, `dist/components/spinner.*` via tsup.
- Storybook builds clean with three new stories.
- Manual Storybook visual verification under `theme-base`, `theme-meshal-ai`, and `theme-brutalism`.
- **Bolts smoke test (pre-publish):** in `bolts/`, `npm link @alawein/ui` → replace local ErrorBoundary → `npm run dev` → trigger an error → verify the fallback renders correctly under bolts' dark theme (this catches the Spec A light-theme-on-dark bug before it ships to npm).

### 8.5 Rollback plan

npm publish is effectively irreversible (24hr unpublish window, registry propagation). Mitigations:

1. Pre-publish verification gate above — the bolts smoke test is the last catch.
2. If a regression surfaces post-publish, ship `0.2.1` with the fix (forward-only).
3. Consumer migrations (MEP rows 20–26) land one at a time against `^0.2.0`. Bolts goes first (item 20, High priority, smallest diff). If bolts reveals a `0.2.0` bug, remaining migrations pause until `0.2.1` ships.

## 9. Consumer migration contract (out of scope here, but tracked)

Each consumer migration (MEP rows 20–26) is a separate PR that:

1. Bumps `@alawein/ui` dep to `^0.2.0`.
2. Replaces local `ErrorBoundary`/`EmptyState`/`Spinner` imports with imports from `@alawein/ui`.
3. Deletes the local files.
4. Re-runs the product's existing test suite + smoke test.

Specific per-product notes (from Spec A):

- **bolts** (row 20, High) — migration also fixes the light-theme-on-dark ErrorBoundary bug.
- **repz** (row 21, High) — also migrates EmptyState; retain local `useErrorHandler` for now (separate scope decision).
- **gymboy** (row 22, Medium) — replaces implicit-`any` ErrorFallback with our typed version.
- **meshal-web** (row 23, Medium) — migrates both ErrorBoundary and PageLoader.
- **attributa** (row 24, Medium) — migrates both ErrorBoundary and EmptyState.
- **atelier-rounaq** (row 25, Medium) — ErrorBoundary only.
- **llmworks** (row 26, Medium) — adds EmptyState where currently silently omitted (UX fix).

## 10. Verification checklist (before marking spec rows 16–19 complete)

- [ ] `@alawein/ui@0.2.0` published to npm public registry
- [ ] `react-error-boundary@^4.1.2` present in `packages/ui/package.json` `dependencies`
- [ ] `packages/ui/CHANGELOG.md` updated by Changesets
- [ ] `packages/ui/src/index.ts` exports `ErrorBoundary`, `ErrorFallback`, `EmptyState`, `Spinner`, `PageLoader`, `FallbackProps`, `ErrorBoundaryProps`
- [ ] `packages/ui/dist/` contains built `error-boundary`, `empty-state`, `spinner` modules
- [ ] Vitest passes for all three new test files
- [ ] `export-parity.test.ts` passes
- [ ] `tsc --noEmit` clean
- [ ] Storybook builds with three new stories
- [ ] Manual theme spot-check (`theme-base`, `theme-meshal-ai`, `theme-brutalism`)
- [ ] Bolts smoke test passes (pre-publish gate)
- [ ] Git tag `@alawein/ui@0.2.0` pushed

## 11. Open questions / deferred

- Sentry/PostHog telemetry adapter — out of scope; tracked separately under MEP row 95 (canonical toast/telemetry patterns).
- Extended README documentation for Form primitives + loading surfaces — MEP row 93.
- Exporting `tailwind-merge` + `cn` audit — already exported (`packages/ui/src/index.ts:2`); MEP row 94 covers consumer-side usage.

## 12. References

- Spec A: `docs/superpowers/specs/2026-04-23-active-products-audit.md` — per-product primitive inventory
- Spec B: `docs/superpowers/specs/2026-04-23-shared-infrastructure-audit.md` — `@alawein/ui` gap analysis
- MEP: `docs/superpowers/specs/2026-04-23-master-execution-plan.md` — rows 16–26
- Current state: `design-system/packages/ui/src/index.ts` (44 existing exports, 0 of the four new components)
- Upstream: `react-error-boundary` — <https://github.com/bvaughn/react-error-boundary>
