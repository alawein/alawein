---
type: canonical
source: none
sync: none
sla: none
authority: canonical
last-verified: 2026-04-25
audience: [ai-agents, contributors]
last_updated: 2026-04-25
---

# Design System Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `@alawein/ui`'s four shared primitives (ErrorBoundary, EmptyState, LoadingSpinner, PageLoader) fully into spec compliance so product repos can drop their local copies.

**Architecture:** All four components live in `packages/ui/src/components/`. ErrorBoundary wraps `react-error-boundary` (already a dependency). LoadingSpinner is a headless SVG component using explicit `@keyframes` so it works outside Tailwind consumers. PageLoader wraps LoadingSpinner in a fixed full-viewport overlay. EmptyState is a composable slot component with all props optional. Exports are already wired through `src/index.ts`.

**Tech Stack:** TypeScript 5, React 18/19, Vitest 3, `@testing-library/react` 16, `react-error-boundary` 4, `class-variance-authority`, `tailwind-merge`, jsdom

---

## Current State vs. Spec

Before implementing, understand what already exists and what gaps remain. Running `git log --oneline -5` and reading existing files is the first step.

### Files that exist

| File | Status |
|------|--------|
| `src/components/error-boundary.tsx` | Exists — missing dev-mode console re-render with full stack |
| `src/components/error-boundary.test.tsx` | Exists — missing dev-mode test |
| `src/components/empty-state.tsx` | Exists — `title` is required (spec says optional); missing the fully-optional variant |
| `src/components/empty-state.test.tsx` | Exists — tests for required-title shape; needs update for optional-title |
| `src/components/spinner.tsx` | Exists — contains `Spinner` + `PageLoader`; uses Tailwind `animate-spin` + lucide-react `Loader2` (spec requires explicit `@keyframes rotate` + plain SVG + required `aria-label`) |
| `src/components/spinner.test.tsx` | Exists — tests current `Spinner`/`PageLoader` shape; needs replacement for `LoadingSpinner`/`PageLoader` spec shape |
| `src/index.ts` | Already exports all four via `components/` barrel files |

### Spec gaps to close

1. **ErrorBoundary** — add dev-mode console re-render: in `process.env.NODE_ENV === 'development'`, log `error.stack` in addition to the existing `console.error('[ErrorBoundary]', error)`.
2. **EmptyState** — make `title` optional (change from required `string` to `string | undefined`). Keep current layout and variant system.
3. **LoadingSpinner** — new component in `spinner.tsx` alongside `Spinner`. Uses plain SVG with `currentColor` stroke and `@keyframes rotate` (no Tailwind `animate-spin`). Required `aria-label` (no default). Size variants map to px dimensions via `width`/`height` attributes, not class strings. Export as `LoadingSpinner`.
4. **PageLoader** — existing implementation is close but uses `Spinner` not `LoadingSpinner`. Spec requires: fixed full-viewport overlay (`fixed inset-0`), `aria-live="polite"`, background `var(--color-background)` at 80% opacity. Update `PageLoader` to use `LoadingSpinner` and `label` prop (required, forwarded as `aria-label`).

### Component naming note

The spec uses the name `LoadingSpinner` — the existing codebase uses `Spinner`. Both will coexist: keep `Spinner` (backward compat), add `LoadingSpinner` as the spec-compliant headless variant. `PageLoader` is already exported; update it in place.

---

## File Map

```
design-system/
  packages/
    ui/
      src/
        components/
          error-boundary.tsx          <- modify (add dev-mode logging)
          error-boundary.test.tsx     <- modify (add dev-mode test case)
          empty-state.tsx             <- modify (make title optional)
          empty-state.test.tsx        <- modify (add optional-title test cases)
          spinner.tsx                 <- modify (add LoadingSpinner; update PageLoader)
          spinner.test.tsx            <- modify (add LoadingSpinner + updated PageLoader tests)
        index.ts                      <- no change needed (already exports spinner barrel)
```

All commands run from:
```
C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system/
```

---

## Phase 1 — ErrorBoundary: dev-mode stack logging

### 1.1 Write the failing test

- [ ] Open `packages/ui/src/components/error-boundary.test.tsx`
- [ ] Add the following test block **after** the existing `describe('ErrorBoundary', ...)` closing brace:

```tsx
describe('ErrorBoundary dev mode logging', () => {
  it('logs error.stack in development mode alongside the [ErrorBoundary] tag', () => {
    const originalEnv = process.env['NODE_ENV'];
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true,
    });
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );
    const stackCall = errSpy.mock.calls.find(
      (call) => typeof call[0] === 'string' && call[0].includes('[ErrorBoundary:dev]'),
    );
    expect(stackCall).toBeTruthy();
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true,
    });
    errSpy.mockRestore();
  });
});
```

### 1.2 Run — expect FAIL

- [ ] Run from `design-system/`:

```bash
npx vitest run packages/ui/src/components/error-boundary.test.tsx
```

Expected output (failure):
```
x ErrorBoundary dev mode logging > logs error.stack in development mode ...
  AssertionError: expected undefined to be truthy
```

### 1.3 Implement the dev-mode logging

- [ ] Open `packages/ui/src/components/error-boundary.tsx`
- [ ] Replace only the `ErrorBoundary` function body. The complete updated function:

```tsx
function ErrorBoundary({ onError, ...props }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      onError={
        onError ??
        ((error) => {
          // Default: log with a tag so consumers can grep production logs.
          console.error('[ErrorBoundary]', error);
          if (process.env['NODE_ENV'] === 'development') {
            // In development, emit the full stack so it surfaces in the
            // browser console alongside React's own error overlay.
            console.error('[ErrorBoundary:dev] Full stack:', error.stack);
          }
        })
      }
      {...props}
    />
  );
}
```

All other code in the file (imports, `fallbackVariants`, `ErrorFallback`) remains unchanged.

### 1.4 Run — expect PASS

- [ ] Run:

```bash
npx vitest run packages/ui/src/components/error-boundary.test.tsx
```

Expected: all tests pass, including the new dev-mode test.

### 1.5 Commit

- [ ] From `design-system/`:

```bash
git add packages/ui/src/components/error-boundary.tsx packages/ui/src/components/error-boundary.test.tsx
git commit -m "feat(ui): add dev-mode stack logging to ErrorBoundary"
```

---

## Phase 2 — EmptyState: make title optional

### 2.1 Write the failing tests

- [ ] Open `packages/ui/src/components/empty-state.test.tsx`
- [ ] Add the following test block at the end:

```tsx
describe('EmptyState optional title', () => {
  it('renders without crashing when no props are provided', () => {
    // Title is now optional — no required props
    const { container } = render(<EmptyState />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders no h2 when title is omitted', () => {
    const { container } = render(<EmptyState />);
    expect(container.querySelector('h2')).toBeNull();
  });

  it('renders h2 when title is provided', () => {
    render(<EmptyState title="No results" />);
    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
  });
});
```

### 2.2 Run — expect FAIL

- [ ] Run:

```bash
npx vitest run packages/ui/src/components/empty-state.test.tsx
```

Expected output (TypeScript compile error or runtime crash on `title` being required):
```
x EmptyState optional title > renders without crashing when no props are provided
  TypeError or TS error: Property 'title' is missing in type '{}'
```

### 2.3 Implement optional title

- [ ] Open `packages/ui/src/components/empty-state.tsx`
- [ ] Change `EmptyStateProps.title` from `title: string` to `title?: string`
- [ ] Update the render body to conditionally render the `h2` only when `title !== undefined`
- [ ] Complete updated file:

```tsx
import * as React from 'react';
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

export interface EmptyStateProps
  extends VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({
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
      {(title !== undefined || description !== undefined) && (
        <div className="space-y-1">
          {title !== undefined && (
            <h2
              className={cn(
                'font-semibold text-foreground',
                variant === 'page' ? 'text-2xl' : 'text-lg',
              )}
            >
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground max-w-prose">
              {description}
            </p>
          )}
        </div>
      )}
      {action}
    </div>
  );
}

export { EmptyState };
```

### 2.4 Run — expect PASS

- [ ] Run:

```bash
npx vitest run packages/ui/src/components/empty-state.test.tsx
```

Expected: all existing tests pass (title still works when provided) and all three new optional-title tests pass.

### 2.5 Commit

- [ ] From `design-system/`:

```bash
git add packages/ui/src/components/empty-state.tsx packages/ui/src/components/empty-state.test.tsx
git commit -m "feat(ui): make EmptyState title prop optional"
```

---

## Phase 3 — LoadingSpinner and PageLoader

### 3.1 Write the failing tests

- [ ] Open `packages/ui/src/components/spinner.test.tsx`
- [ ] Add the following import at the top of the file alongside the existing imports:

```tsx
import { LoadingSpinner } from './spinner';
```

- [ ] Add the following `describe` block at the end of the file (after existing `PageLoader` tests):

```tsx
describe('LoadingSpinner', () => {
  it('renders an svg with role="img"', () => {
    render(<LoadingSpinner aria-label="Loading data" />);
    const svg = screen.getByRole('img', { name: 'Loading data' });
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('requires and forwards aria-label', () => {
    render(<LoadingSpinner aria-label="Saving changes" />);
    const svg = screen.getByRole('img', { name: 'Saving changes' });
    expect(svg).toHaveAttribute('aria-label', 'Saving changes');
  });

  it('applies sm dimensions (16px) when size="sm"', () => {
    render(<LoadingSpinner aria-label="Loading" size="sm" />);
    const svg = screen.getByRole('img', { name: 'Loading' });
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });

  it('applies md dimensions (24px) when size="md" (default)', () => {
    render(<LoadingSpinner aria-label="Loading" />);
    const svg = screen.getByRole('img', { name: 'Loading' });
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('applies lg dimensions (40px) when size="lg"', () => {
    render(<LoadingSpinner aria-label="Loading" size="lg" />);
    const svg = screen.getByRole('img', { name: 'Loading' });
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '40');
  });

  it('uses currentColor stroke with no hardcoded color on the arc circle', () => {
    render(<LoadingSpinner aria-label="Loading" />);
    const svg = screen.getByRole('img', { name: 'Loading' });
    const circles = svg.querySelectorAll('circle');
    // Both circles must use currentColor stroke, never a hex literal
    circles.forEach((circle) => {
      expect(circle.getAttribute('stroke')).toBe('currentColor');
    });
  });

  it('does not apply animate-spin class (uses explicit keyframes instead)', () => {
    render(<LoadingSpinner aria-label="Loading" />);
    const svg = screen.getByRole('img', { name: 'Loading' });
    expect(svg.className).not.toContain('animate-spin');
  });

  it('applies custom className to the svg element', () => {
    render(<LoadingSpinner aria-label="Loading" className="text-primary" />);
    const svg = screen.getByRole('img', { name: 'Loading' });
    expect(svg).toHaveClass('text-primary');
  });
});
```

### 3.2 Run — expect FAIL

- [ ] Run:

```bash
npx vitest run packages/ui/src/components/spinner.test.tsx
```

Expected output (failure — `LoadingSpinner` not yet exported):
```
x LoadingSpinner > renders an svg with role="img"
  Error: Unable to find an accessible element with the role "img" and name "Loading data"
```

### 3.3 Implement LoadingSpinner and update PageLoader

- [ ] Open `packages/ui/src/components/spinner.tsx`
- [ ] Replace the entire file with the following complete implementation:

```tsx
import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

// ---------------------------------------------------------------------------
// Spinner — Tailwind-based convenience wrapper (backward compat)
// ---------------------------------------------------------------------------

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

function Spinner({ size, label = 'Loading', className, ...props }: SpinnerProps) {
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

// ---------------------------------------------------------------------------
// LoadingSpinner — headless SVG spinner (spec-compliant, portable)
//
// Design constraints from spec:
// - No Tailwind animate-spin: uses CSS animation via inline style
// - Required aria-label: enforced at the TypeScript interface level
// - currentColor stroke: inherits from parent text color
// - Size via explicit px width/height on the <svg> element
// - @keyframes injected once via a <style> element rendered by the component
// ---------------------------------------------------------------------------

const SPINNER_KEYFRAME_NAME = 'alawein-spinner-rotate';

// The keyframes string is a static constant with no user input — safe to inject.
const SPINNER_KEYFRAME_CSS = `@keyframes ${SPINNER_KEYFRAME_NAME} {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}`;

const SPINNER_SIZE_PX: Record<'sm' | 'md' | 'lg', number> = {
  sm: 16,
  md: 24,
  lg: 40,
};

export interface LoadingSpinnerProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'aria-label'> {
  'aria-label': string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function LoadingSpinner({
  'aria-label': ariaLabel,
  size = 'md',
  className,
  style,
  ...props
}: LoadingSpinnerProps) {
  const px = SPINNER_SIZE_PX[size];
  const strokeWidth = size === 'sm' ? 2 : size === 'lg' ? 3.5 : 2.5;
  const r = (px - strokeWidth * 2) / 2;
  const cx = px / 2;
  const cy = px / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <>
      <style>{SPINNER_KEYFRAME_CSS}</style>
      <svg
        role="img"
        aria-label={ariaLabel}
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        className={className}
        style={{
          animation: `${SPINNER_KEYFRAME_NAME} 0.75s linear infinite`,
          ...style,
        }}
        {...props}
      >
        {/* Background track — faded arc for depth */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={0.25}
        />
        {/* Spinning arc — 75% of the circumference */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        />
      </svg>
    </>
  );
}

// ---------------------------------------------------------------------------
// PageLoader — fixed full-viewport overlay (spec-compliant)
//
// Design constraints from spec:
// - Fixed overlay: position fixed, inset-0, z-50
// - aria-live="polite" so screen readers announce the loading state
// - Background: var(--color-background) at 80% opacity
// - Wraps LoadingSpinner (not Spinner)
// - label prop is required and forwarded to LoadingSpinner aria-label
// ---------------------------------------------------------------------------

export interface PageLoaderProps {
  label: string;
  className?: string;
}

function PageLoader({ label, className }: PageLoaderProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        className,
      )}
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-background) 80%, transparent)',
      }}
    >
      <LoadingSpinner aria-label={label} size="lg" />
    </div>
  );
}

export { Spinner, LoadingSpinner, PageLoader };
```

### 3.4 Run — expect PASS

- [ ] Run:

```bash
npx vitest run packages/ui/src/components/spinner.test.tsx
```

The existing `PageLoader` tests check for `Spinner`'s DOM structure (classes like `animate-spin`, `w-10`, `h-10`). Because `PageLoader` now wraps `LoadingSpinner`, those specific assertions will fail. Proceed to step 3.5 before the full run.

### 3.5 Update legacy PageLoader tests

- [ ] Replace the existing `describe('PageLoader', ...)` block in `spinner.test.tsx` with:

```tsx
describe('PageLoader', () => {
  it('renders a fixed full-viewport overlay with aria-live="polite"', () => {
    const { container } = render(<PageLoader label="Loading dashboard" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-live', 'polite');
    expect(wrapper).toHaveClass('fixed', 'inset-0', 'flex', 'items-center', 'justify-center');
  });

  it('renders a LoadingSpinner (svg with role="img") inside the overlay', () => {
    render(<PageLoader label="Loading dashboard" />);
    const svg = screen.getByRole('img', { name: 'Loading dashboard' });
    expect(svg.tagName.toLowerCase()).toBe('svg');
  });

  it('forwards label to the inner LoadingSpinner aria-label', () => {
    render(<PageLoader label="Fetching posts" />);
    expect(screen.getByRole('img', { name: 'Fetching posts' })).toBeInTheDocument();
  });

  it('merges custom className on the wrapper', () => {
    const { container } = render(<PageLoader label="Loading" className="opacity-90" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('opacity-90');
  });
});
```

### 3.6 Run — expect all spinner tests PASS

- [ ] Run:

```bash
npx vitest run packages/ui/src/components/spinner.test.tsx
```

Expected output:
```
PASS packages/ui/src/components/spinner.test.tsx
  Spinner
    v renders a Loader2 svg with animate-spin
    v applies size=md classes by default
    v applies size=sm classes when size="sm"
    v applies size=lg classes when size="lg"
    v exposes an aria-label and a screen-reader-only label
    v defaults label to "Loading"
    v merges custom className without dropping variant classes
  PageLoader
    v renders a fixed full-viewport overlay with aria-live="polite"
    v renders a LoadingSpinner (svg with role="img") inside the overlay
    v forwards label to the inner LoadingSpinner aria-label
    v merges custom className on the wrapper
  LoadingSpinner
    v renders an svg with role="img"
    v requires and forwards aria-label
    v applies sm dimensions (16px) when size="sm"
    v applies md dimensions (24px) when size="md" (default)
    v applies lg dimensions (40px) when size="lg"
    v uses currentColor stroke with no hardcoded color on the arc circle
    v does not apply animate-spin class (uses explicit keyframes instead)
    v applies custom className to the svg element
```

### 3.7 Verify LoadingSpinner export is automatic

- [ ] Confirm `src/index.ts` exports the spinner barrel (no manual change needed):

```bash
grep "spinner" packages/ui/src/index.ts
```

Expected: `export * from './components/spinner';`

The `export *` automatically picks up `LoadingSpinner` from the named export added in step 3.3.

### 3.8 Commit

- [ ] From `design-system/`:

```bash
git add packages/ui/src/components/spinner.tsx packages/ui/src/components/spinner.test.tsx
git commit -m "feat(ui): add LoadingSpinner headless SVG; update PageLoader to spec"
```

---

## Phase 4 — Full test suite gate

Run the entire `@alawein/ui` test suite to confirm no regressions across all components.

- [ ] Run from `design-system/`:

```bash
npx turbo run test --filter=@alawein/ui
```

Or directly from the package directory:

```bash
cd packages/ui && npx vitest run
```

Expected output:
```
Test Files  N passed (no failures)
Tests       N passed (no failures)
```

If any test besides the modified files regresses, diagnose and fix before proceeding to Phase 5.

---

## Phase 5 — Versioning and build

### 5.1 Create changeset

- [ ] From `design-system/`:

```bash
npx changeset
```

When prompted interactively:
- Select `@alawein/ui` (spacebar to toggle on, enter to confirm)
- Select **minor** bump (new exports, no breaking changes)
- Enter message: `feat(ui): add ErrorBoundary dev-mode logging, optional EmptyState title, LoadingSpinner headless SVG, PageLoader fixed overlay`

A new file is created in `.changeset/` (auto-named slug).

- [ ] Verify the changeset file was created:

```bash
ls .changeset/*.md | grep -v README.md
```

Expected: one new `.md` file.

### 5.2 Build the package

- [ ] Run from `design-system/`:

```bash
npm run build
```

Expected Turborepo output:
```
@alawein/tokens:build  -> success
@alawein/ui:build      -> success
Tasks:    N successful, 0 failed
```

If build fails, check for TypeScript errors in the modified files. The most common issue: `style` prop accepting the `animation` key requires `React.CSSProperties` (already satisfied by `React.SVGAttributes`).

### 5.3 Smoke-check exports in dist

- [ ] Verify the compiled output contains the new export names:

```bash
grep "LoadingSpinner\|PageLoader\|EmptyState\|ErrorBoundary" packages/ui/dist/index.js | head -10
```

Expected: all four names appear.

### 5.4 Commit changeset

- [ ] From `design-system/`:

```bash
git add .changeset/
git commit -m "chore(changeset): minor bump @alawein/ui — primitives spec compliance"
```

---

## Phase 6 — PR

- [ ] Ensure the feature branch is pushed:

```bash
git push -u origin feat/ui-primitives-spec
```

- [ ] Open a PR:

```bash
gh pr create \
  --title "feat(ui): design system primitives spec compliance" \
  --body "Closes spec 2026-04-25-design-system-primitives-design.md.

Changes:
- ErrorBoundary: dev-mode stack trace logging via [ErrorBoundary:dev] tag
- EmptyState: title prop made optional (was required string)
- LoadingSpinner: new headless SVG component — explicit keyframes, required aria-label, currentColor stroke, px-based size variants
- PageLoader: updated to wrap LoadingSpinner with fixed full-viewport overlay, aria-live=polite, var(--color-background) at 80% opacity
- Spinner: unchanged (backward compat)
- Changeset: minor bump

All 4 components have full Vitest test coverage. Full test suite green. No product migrations in this PR."
```

---

## Completion checklist

- [ ] Phase 1 complete — ErrorBoundary dev-mode logging added and tested
- [ ] Phase 2 complete — EmptyState title made optional and tested
- [ ] Phase 3 complete — LoadingSpinner headless SVG added; PageLoader updated to spec; all spinner tests pass
- [ ] Phase 4 complete — full `@alawein/ui` test suite green (no regressions)
- [ ] Phase 5 complete — changeset created (minor), `npm run build` passes, dist exports verified
- [ ] Phase 6 complete — PR open

**Total tasks: 26 checkbox steps across 6 phases.**

---

## Constraints (from spec)

- `react-error-boundary` is already in `package.json` at `^4.1.2` — do not add or pin again
- `LoadingSpinner` must not use Tailwind `animate-spin` — use `animation` inline style with `@keyframes alawein-spinner-rotate`
- No hardcoded hex colors in any component — all colors via CSS custom properties or `currentColor`
- All four components in one PR to keep the changeset atomic
- Do not migrate product repos away from their local copies in this spec — that is a follow-up task

---

## Follow-up (out of scope for this plan)

After this PR merges and `@alawein/ui` publishes at the new minor version, a separate task per product repo replaces local copies:
- Replace local `ErrorBoundary` with `import { ErrorBoundary } from '@alawein/ui'`
- Replace local `EmptyState` with `import { EmptyState } from '@alawein/ui'`
- Replace local spinner/loader variants with `import { LoadingSpinner, PageLoader } from '@alawein/ui'`

That sweep is tracked in the workspace execution plan as a downstream task from this spec.
