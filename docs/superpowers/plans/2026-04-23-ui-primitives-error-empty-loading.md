---
title: "@alawein/ui Primitives Implementation Plan — ErrorBoundary, EmptyState, Spinner, PageLoader"
date: 2026-04-23
status: active
type: canonical
---

# @alawein/ui Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `<ErrorBoundary>`, `<ErrorFallback>`, `<EmptyState>`, `<Spinner>`, and `<PageLoader>` in `@alawein/ui@0.2.0` so 7 active products (bolts, repz, gymboy, meshal-web, attributa, atelier-rounaq, llmworks) can migrate off local duplicates. Covers MEP rows 16, 17, 18, 19.

**Architecture:** All three primitives live in the existing `@alawein/ui` package. `<ErrorBoundary>` wraps `react-error-boundary` with a default `console.error` handler. `<ErrorFallback>` and `<EmptyState>` use CVA with `variant: 'inline' | 'page'`. `<Spinner>` uses Lucide `Loader2` + `animate-spin` with CVA size variants; `<PageLoader>` is a centered wrapper. No new packages; no token changes. Minor version bump via Changesets (`0.1.2 → 0.2.0`).

**Tech Stack:** TypeScript + React 18/19 + Tailwind v4 + Radix + CVA (`class-variance-authority`) + `react-error-boundary@^4.1.2` + Lucide + vitest + `@testing-library/react` + tsup + Turborepo + Changesets.

**Spec reference:** `docs/superpowers/specs/2026-04-23-ui-primitives-error-empty-loading-design.md`

**Working directory for all tasks:** `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system/`

---

## File Structure

| File | Responsibility | Create or Modify |
| --- | --- | --- |
| `packages/ui/package.json` | Add `react-error-boundary@^4.1.2` to dependencies | Modify |
| `packages/ui/src/components/spinner.tsx` | `<Spinner size>` + `<PageLoader>` | Create |
| `packages/ui/src/components/spinner.test.tsx` | Vitest coverage for Spinner + PageLoader | Create |
| `packages/ui/src/components/empty-state.tsx` | `<EmptyState icon title description action variant>` | Create |
| `packages/ui/src/components/empty-state.test.tsx` | Vitest coverage for EmptyState | Create |
| `packages/ui/src/components/error-boundary.tsx` | `<ErrorBoundary>` + `<ErrorFallback>` | Create |
| `packages/ui/src/components/error-boundary.test.tsx` | Vitest coverage for ErrorBoundary + ErrorFallback | Create |
| `packages/ui/src/index.ts` | Add three `export * from` lines in alphabetical order | Modify |
| `apps/storybook/src/stories/Spinner.stories.tsx` | Storybook demos | Create |
| `apps/storybook/src/stories/EmptyState.stories.tsx` | Storybook demos | Create |
| `apps/storybook/src/stories/ErrorBoundary.stories.tsx` | Storybook demos (interactive throw trigger) | Create |
| `packages/ui/COMPONENTS.md` | Append three H2 sections documenting the new primitives | Modify |
| `.changeset/ui-error-empty-loading-primitives.md` | Changeset minor bump entry | Create |

**Note on `export-parity.test.ts`:** This test auto-discovers components by reading the filesystem and parsing `index.ts` exports. No manual edit needed — it will pass automatically once each new component has a matching `export * from` line in `index.ts`. (Verified at `packages/ui/src/components/export-parity.test.ts:22-26`.)

**Note on tsup output:** `packages/ui/tsup.config.ts` uses single-entry-point + splitting. The built `dist/` will contain code-split chunks, not per-component named files. Verification step checks that the overall build succeeds and types are emitted, not specific filenames.

**Dist layout after build (for reference, not a contract):** `dist/index.js`, `dist/index.d.ts`, `dist/chunk-*.js` (code-split chunks include all three new components). `dist/lib/utils.js` + `.d.ts` (unchanged; the `/cn` sub-export).

---

## Task 1: Add `react-error-boundary` dependency

**Files:**
- Modify: `design-system/packages/ui/package.json`
- Install side effect: `design-system/packages/ui/node_modules/`, `design-system/package-lock.json`

- [ ] **Step 1.1: Read current dependencies block**

Run: `cat packages/ui/package.json | head -90`

Expected: `"dependencies": { ... "vaul": "^1.1.0" }` (no `react-error-boundary`).

- [ ] **Step 1.2: Add the dependency**

Edit `packages/ui/package.json`. In the `dependencies` block, between `"react-day-picker"` and `"react-hook-form"` (alphabetical order: `react-day-picker` < `react-error-boundary` < `react-hook-form`), add:

```json
    "react-error-boundary": "^4.1.2",
```

Final dependencies fragment:

```json
    "react-day-picker": "^9.4.0",
    "react-error-boundary": "^4.1.2",
    "react-hook-form": "^7.53.0",
```

- [ ] **Step 1.3: Install**

Run: `cd packages/ui && npm install`

Expected: "added 1 package" or similar; `react-error-boundary@4.1.2` (or a patch-level update of `^4.1.2`) appears in `packages/ui/node_modules/react-error-boundary/`.

If install fails with peer-dep resolution errors, retry with `npm install --legacy-peer-deps` (matches workspace-level policy for `@alawein/*` consumers, documented in `alawein/CLAUDE.md`).

- [ ] **Step 1.4: Verify install**

Run: `ls packages/ui/node_modules/react-error-boundary/package.json`

Expected: file exists.

Run: `node -e "console.log(require('./packages/ui/node_modules/react-error-boundary/package.json').version)"`

Expected: prints `4.1.x`.

- [ ] **Step 1.5: Commit**

```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system
git add packages/ui/package.json package-lock.json
git commit -m "chore(ui): add react-error-boundary dependency"
```

Expected: commit created; no files left modified.

---

## Task 2: Spinner + PageLoader (TDD)

**Files:**
- Create: `design-system/packages/ui/src/components/spinner.tsx`
- Create: `design-system/packages/ui/src/components/spinner.test.tsx`
- Modify: `design-system/packages/ui/src/index.ts` (add export line)

- [ ] **Step 2.1: Write the failing test**

Create `packages/ui/src/components/spinner.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Spinner, PageLoader } from './spinner';

describe('Spinner', () => {
  it('renders a Loader2 svg with animate-spin', () => {
    render(<Spinner />);
    const icon = screen.getByRole('status');
    expect(icon.tagName.toLowerCase()).toBe('svg');
    expect(icon).toHaveClass('animate-spin');
  });

  it('applies size=md classes by default', () => {
    render(<Spinner />);
    const icon = screen.getByRole('status');
    expect(icon).toHaveClass('w-6', 'h-6');
  });

  it('applies size=sm classes when size="sm"', () => {
    render(<Spinner size="sm" />);
    const icon = screen.getByRole('status');
    expect(icon).toHaveClass('w-4', 'h-4');
  });

  it('applies size=lg classes when size="lg"', () => {
    render(<Spinner size="lg" />);
    const icon = screen.getByRole('status');
    expect(icon).toHaveClass('w-10', 'h-10');
  });

  it('exposes an aria-label and a screen-reader-only label', () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving');
    expect(screen.getByText('Saving')).toHaveClass('sr-only');
  });

  it('defaults label to "Loading"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('merges custom className without dropping variant classes', () => {
    render(<Spinner className="text-primary" />);
    const icon = screen.getByRole('status');
    expect(icon).toHaveClass('animate-spin', 'w-6', 'h-6', 'text-primary');
  });
});

describe('PageLoader', () => {
  it('renders a size=lg Spinner inside a centered container', () => {
    const { container } = render(<PageLoader />);
    const icon = screen.getByRole('status');
    expect(icon).toHaveClass('w-10', 'h-10', 'animate-spin');
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center', 'min-h-[50vh]');
  });

  it('propagates label to the inner Spinner', () => {
    render(<PageLoader label="Fetching posts" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Fetching posts');
    expect(screen.getByText('Fetching posts')).toHaveClass('sr-only');
  });

  it('merges custom className on the wrapper', () => {
    const { container } = render(<PageLoader className="min-h-screen" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('min-h-screen');
  });
});
```

- [ ] **Step 2.2: Run test to verify it fails**

Run: `npx vitest run packages/ui/src/components/spinner.test.tsx`

Expected: FAIL with `Cannot find module './spinner'` or similar. If the test runner can't resolve the import, that proves the test is validly failing because the component doesn't exist yet.

- [ ] **Step 2.3: Write the component**

Create `packages/ui/src/components/spinner.tsx`:

```tsx
import * as React from 'react';
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

export interface PageLoaderProps {
  label?: string;
  className?: string;
}

function PageLoader({ label = 'Loading', className }: PageLoaderProps) {
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

export { Spinner, PageLoader };
```

- [ ] **Step 2.4: Run test to verify it passes**

Run: `npx vitest run packages/ui/src/components/spinner.test.tsx`

Expected: all 10 tests pass (7 for Spinner, 3 for PageLoader).

If `PageLoader`'s `min-h-[50vh]` class assertion fails because the bracket class isn't classname-matched as expected, update the assertion in Step 2.1 to use `toHaveClass('min-h-[50vh]')` directly (bracketed Tailwind classes work fine with jest-dom's `toHaveClass`; if not, fall back to `.className.includes('min-h-[50vh]')`).

- [ ] **Step 2.5: Wire the export in index.ts**

Read `packages/ui/src/index.ts`. Find the line:

```ts
export * from './components/sonner';
```

Immediately after it, insert:

```ts
export * from './components/spinner';
```

Result:

```ts
export * from './components/sonner';
export * from './components/spinner';
export * from './components/switch';
```

- [ ] **Step 2.6: Run the export-parity test**

Run: `npx vitest run packages/ui/src/components/export-parity.test.ts`

Expected: PASS. The test discovers `spinner.tsx` on the filesystem and confirms `index.ts` re-exports it.

- [ ] **Step 2.7: Run the full vitest suite for @alawein/ui**

Run: `npm test -w @alawein/ui`

Expected: all tests pass, no new warnings.

- [ ] **Step 2.8: Commit**

```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system
git add packages/ui/src/components/spinner.tsx packages/ui/src/components/spinner.test.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add Spinner and PageLoader primitives"
```

---

## Task 3: EmptyState (TDD)

**Files:**
- Create: `design-system/packages/ui/src/components/empty-state.tsx`
- Create: `design-system/packages/ui/src/components/empty-state.test.tsx`
- Modify: `design-system/packages/ui/src/index.ts` (add export line)

- [ ] **Step 3.1: Write the failing test**

Create `packages/ui/src/components/empty-state.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders the required title', () => {
    render(<EmptyState title="No posts yet" />);
    expect(screen.getByText('No posts yet')).toBeInTheDocument();
    expect(screen.getByText('No posts yet').tagName).toBe('H2');
  });

  it('omits description when not provided', () => {
    const { container } = render(<EmptyState title="No posts yet" />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="No posts" description="Check back later." />);
    expect(screen.getByText('Check back later.')).toBeInTheDocument();
    expect(screen.getByText('Check back later.').tagName).toBe('P');
  });

  it('renders icon when provided inside a muted-foreground wrapper', () => {
    render(
      <EmptyState
        title="No posts"
        icon={<svg data-testid="empty-icon" />}
      />,
    );
    const icon = screen.getByTestId('empty-icon');
    expect(icon).toBeInTheDocument();
    expect(icon.parentElement).toHaveClass('text-muted-foreground');
  });

  it('renders action slot as provided', () => {
    render(
      <EmptyState
        title="No posts"
        action={<button type="button">Create</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('applies inline variant classes by default', () => {
    const { container } = render(<EmptyState title="x" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('border-dashed');
    expect(wrapper).toHaveClass('bg-muted/30');
  });

  it('applies page variant classes when variant="page"', () => {
    const { container } = render(<EmptyState title="x" variant="page" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('min-h-[50vh]');
    expect(wrapper).not.toHaveClass('border-dashed');
  });

  it('merges className without dropping variant classes', () => {
    const { container } = render(
      <EmptyState title="x" className="custom-class" />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
    expect(wrapper).toHaveClass('border-dashed');
  });
});
```

- [ ] **Step 3.2: Run test to verify it fails**

Run: `npx vitest run packages/ui/src/components/empty-state.test.tsx`

Expected: FAIL with `Cannot find module './empty-state'`.

- [ ] **Step 3.3: Write the component**

Create `packages/ui/src/components/empty-state.tsx`:

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
  title: string;
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
      <div className="space-y-1">
        <h2
          className={cn(
            'font-semibold text-foreground',
            variant === 'page' ? 'text-2xl' : 'text-lg',
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground max-w-prose">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export { EmptyState };
```

- [ ] **Step 3.4: Run test to verify it passes**

Run: `npx vitest run packages/ui/src/components/empty-state.test.tsx`

Expected: all 8 tests pass.

If the "omits description" test fails because another component (Button, etc.) injects a `<p>`, the `container.querySelector('p')` scoping to `EmptyState`'s root means no such injection occurs for the no-description case; if it does in a future refactor, switch to asserting absence of specific text via `screen.queryByText`.

- [ ] **Step 3.5: Wire the export in index.ts**

Read `packages/ui/src/index.ts`. Find the line:

```ts
export * from './components/dropdown-menu';
```

Immediately after it, insert:

```ts
export * from './components/empty-state';
```

Result:

```ts
export * from './components/dropdown-menu';
export * from './components/empty-state';
export * from './components/form';
```

- [ ] **Step 3.6: Run the export-parity test**

Run: `npx vitest run packages/ui/src/components/export-parity.test.ts`

Expected: PASS.

- [ ] **Step 3.7: Run the full vitest suite for @alawein/ui**

Run: `npm test -w @alawein/ui`

Expected: all tests pass.

- [ ] **Step 3.8: Commit**

```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system
git add packages/ui/src/components/empty-state.tsx packages/ui/src/components/empty-state.test.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add EmptyState primitive"
```

---

## Task 4: ErrorBoundary + ErrorFallback (TDD)

**Files:**
- Create: `design-system/packages/ui/src/components/error-boundary.tsx`
- Create: `design-system/packages/ui/src/components/error-boundary.test.tsx`
- Modify: `design-system/packages/ui/src/index.ts` (add export line)

- [ ] **Step 4.1: Write the failing test**

Create `packages/ui/src/components/error-boundary.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';

import { ErrorBoundary, ErrorFallback } from './error-boundary';

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Kaboom');
  return <div>Safe content</div>;
}

describe('ErrorBoundary', () => {
  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => {}}>
        <div>Hello</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders the fallback when a child throws', () => {
    // Silence React's error log for this test
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => {}}>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Kaboom')).toBeInTheDocument();
    errSpy.mockRestore();
  });

  it('calls default console.error when no onError prop is passed', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );
    // console.error is called by React itself AND by our default handler.
    // Confirm at least one call matches our tag.
    const taggedCall = errSpy.mock.calls.find((call) => call[0] === '[ErrorBoundary]');
    expect(taggedCall).toBeTruthy();
    errSpy.mockRestore();
  });

  it('calls custom onError when provided and suppresses the default tag', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const customOnError = vi.fn();
    render(
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={customOnError}>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );
    expect(customOnError).toHaveBeenCalledOnce();
    const [err, info] = customOnError.mock.calls[0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Kaboom');
    expect(info).toHaveProperty('componentStack');
    const taggedCall = errSpy.mock.calls.find((call) => call[0] === '[ErrorBoundary]');
    expect(taggedCall).toBeUndefined();
    errSpy.mockRestore();
  });
});

describe('ErrorFallback', () => {
  function mockFallbackProps(overrides: Partial<Parameters<typeof ErrorFallback>[0]> = {}) {
    return {
      error: new Error('Boom'),
      resetErrorBoundary: vi.fn(),
      ...overrides,
    };
  }

  it('renders default title and error message as description', () => {
    render(<ErrorFallback {...mockFallbackProps()} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Boom')).toBeInTheDocument();
  });

  it('applies inline variant by default', () => {
    const { container } = render(<ErrorFallback {...mockFallbackProps()} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('rounded-lg', 'border', 'bg-card', 'p-6');
  });

  it('applies page variant classes when variant="page"', () => {
    const { container } = render(
      <ErrorFallback {...mockFallbackProps({ variant: 'page' })} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('min-h-[60vh]');
  });

  it('renders default Try again button that invokes resetErrorBoundary', () => {
    const reset = vi.fn();
    render(
      <ErrorFallback {...mockFallbackProps({ resetErrorBoundary: reset })} />,
    );
    const btn = screen.getByRole('button', { name: 'Try again' });
    fireEvent.click(btn);
    expect(reset).toHaveBeenCalledOnce();
  });

  it('renders custom title, description, icon, and action when provided', () => {
    render(
      <ErrorFallback
        {...mockFallbackProps()}
        title="Custom title"
        description="Custom description"
        icon={<span data-testid="custom-icon" />}
        action={<button type="button">Retry now</button>}
      />,
    );
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry now' })).toBeInTheDocument();
  });

  it('has role="alert" on the container', () => {
    render(<ErrorFallback {...mockFallbackProps()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4.2: Run test to verify it fails**

Run: `npx vitest run packages/ui/src/components/error-boundary.test.tsx`

Expected: FAIL with `Cannot find module './error-boundary'`.

- [ ] **Step 4.3: Write the component**

Create `packages/ui/src/components/error-boundary.tsx`:

```tsx
import * as React from 'react';
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

function ErrorBoundary({ onError, ...props }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      onError={
        onError ??
        ((error) => {
          // Default: log with a tag so consumers can grep production logs.
          console.error('[ErrorBoundary]', error);
        })
      }
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

function ErrorFallback({
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
        <h2
          className={cn(
            'font-semibold text-foreground',
            variant === 'page' ? 'text-2xl' : 'text-lg',
          )}
        >
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

export { ErrorBoundary, ErrorFallback };
```

- [ ] **Step 4.4: Run test to verify it passes**

Run: `npx vitest run packages/ui/src/components/error-boundary.test.tsx`

Expected: all 10 tests pass (4 ErrorBoundary + 6 ErrorFallback).

Gotcha: React 18/19 log error-boundary catches to `console.error` regardless of what we do — that's why Step 4.1 wraps with `vi.spyOn(console, 'error').mockImplementation(() => {})` for each test that expects a throw. If tests still emit noisy "The above error occurred" logs, verify the spy is applied before render.

- [ ] **Step 4.5: Wire the export in index.ts**

Read `packages/ui/src/index.ts`. Find the line (inserted in Task 3):

```ts
export * from './components/empty-state';
```

Immediately after it, insert:

```ts
export * from './components/error-boundary';
```

Result:

```ts
export * from './components/empty-state';
export * from './components/error-boundary';
export * from './components/form';
```

- [ ] **Step 4.6: Run the export-parity test**

Run: `npx vitest run packages/ui/src/components/export-parity.test.ts`

Expected: PASS.

- [ ] **Step 4.7: Run the full vitest suite for @alawein/ui**

Run: `npm test -w @alawein/ui`

Expected: all tests pass. This is the first run with all three new components in place.

- [ ] **Step 4.8: Commit**

```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system
git add packages/ui/src/components/error-boundary.tsx packages/ui/src/components/error-boundary.test.tsx packages/ui/src/index.ts
git commit -m "feat(ui): add ErrorBoundary and ErrorFallback primitives"
```

---

## Task 5: Storybook stories

**Files:**
- Create: `design-system/apps/storybook/src/stories/Spinner.stories.tsx`
- Create: `design-system/apps/storybook/src/stories/EmptyState.stories.tsx`
- Create: `design-system/apps/storybook/src/stories/ErrorBoundary.stories.tsx`

Stories follow the existing pattern at `apps/storybook/src/stories/Alert.stories.tsx` (import from `@alawein/ui`, use `Meta` + `StoryObj`, tag `autodocs`).

- [ ] **Step 5.1: Create Spinner stories**

Create `apps/storybook/src/stories/Spinner.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner, PageLoader, Button, Card, CardContent } from '@alawein/ui';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  render: () => <Spinner />,
};

export const Small: Story = {
  render: () => <Spinner size="sm" />,
};

export const Large: Story = {
  render: () => <Spinner size="lg" />,
};

export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner size="sm" className="mr-2" />
      Saving
    </Button>
  ),
};

export const InCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardContent className="flex justify-center p-8">
        <Spinner size="lg" />
      </CardContent>
    </Card>
  ),
};

export const PageLoaderDefault: StoryObj<typeof PageLoader> = {
  render: () => <PageLoader />,
};

export const PageLoaderCustomLabel: StoryObj<typeof PageLoader> = {
  render: () => <PageLoader label="Fetching posts" />,
};
```

- [ ] **Step 5.2: Create EmptyState stories**

Create `apps/storybook/src/stories/EmptyState.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Inbox, Search, FileQuestion } from 'lucide-react';
import {
  EmptyState,
  Button,
  Card,
  CardContent,
} from '@alawein/ui';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoDataYet: Story = {
  render: () => (
    <EmptyState
      icon={<Inbox className="w-10 h-10" />}
      title="No posts yet"
      description="Your published posts will appear here."
      action={<Button>Write your first post</Button>}
    />
  ),
};

export const NoResults: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardContent>
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No results"
          description={'Nothing matched "react error boundary".'}
        />
      </CardContent>
    </Card>
  ),
};

export const PageVariant: Story = {
  render: () => (
    <EmptyState
      variant="page"
      icon={<FileQuestion className="w-14 h-14" />}
      title="Project not found"
      description="This project may have been moved or deleted."
      action={<Button variant="outline">Go home</Button>}
    />
  ),
};

export const WithoutAction: Story = {
  render: () => (
    <EmptyState
      icon={<Inbox className="w-10 h-10" />}
      title="No drafts"
    />
  ),
};

export const WithMultipleActions: Story = {
  render: () => (
    <EmptyState
      icon={<Inbox className="w-10 h-10" />}
      title="No items"
      description="Start by creating one or importing existing data."
      action={
        <div className="flex gap-2">
          <Button>Create</Button>
          <Button variant="outline">Import</Button>
        </div>
      }
    />
  ),
};
```

- [ ] **Step 5.3: Create ErrorBoundary stories**

Create `apps/storybook/src/stories/ErrorBoundary.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Bug } from 'lucide-react';
import {
  ErrorBoundary,
  ErrorFallback,
  Button,
} from '@alawein/ui';

function ThrowOnClick() {
  const [shouldThrow, setShouldThrow] = React.useState(false);
  if (shouldThrow) throw new Error('Intentional error from ThrowOnClick');
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-muted-foreground">
        Click below to throw — the ErrorBoundary will catch it.
      </p>
      <Button onClick={() => setShouldThrow(true)}>Throw error</Button>
    </div>
  );
}

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const InlineDefault: Story = {
  render: () => {
    const [key, setKey] = React.useState(0);
    return (
      <ErrorBoundary
        key={key}
        FallbackComponent={ErrorFallback}
        onReset={() => setKey((k) => k + 1)}
      >
        <ThrowOnClick />
      </ErrorBoundary>
    );
  },
};

export const PageVariant: Story = {
  render: () => {
    const [key, setKey] = React.useState(0);
    return (
      <ErrorBoundary
        key={key}
        FallbackComponent={(props) => (
          <ErrorFallback {...props} variant="page" />
        )}
        onReset={() => setKey((k) => k + 1)}
      >
        <ThrowOnClick />
      </ErrorBoundary>
    );
  },
};

export const CustomCopy: Story = {
  render: () => {
    const [key, setKey] = React.useState(0);
    return (
      <ErrorBoundary
        key={key}
        FallbackComponent={(props) => (
          <ErrorFallback
            {...props}
            title="Couldn't load posts"
            description="Please try again in a moment."
          />
        )}
        onReset={() => setKey((k) => k + 1)}
      >
        <ThrowOnClick />
      </ErrorBoundary>
    );
  },
};

export const CustomIcon: Story = {
  render: () => {
    const [key, setKey] = React.useState(0);
    return (
      <ErrorBoundary
        key={key}
        FallbackComponent={(props) => (
          <ErrorFallback
            {...props}
            icon={<Bug className="w-8 h-8 text-destructive" />}
          />
        )}
        onReset={() => setKey((k) => k + 1)}
      >
        <ThrowOnClick />
      </ErrorBoundary>
    );
  },
};
```

- [ ] **Step 5.4: Typecheck and build Storybook**

Run: `cd apps/storybook && npm run build`

Expected: Storybook build completes without type errors for the three new stories. Output in `dist/` or `storybook-static/` (whichever the existing config uses).

If the build fails because `@alawein/ui` hasn't been rebuilt after Tasks 2–4, run `npm run build -w @alawein/ui` first, then retry `cd apps/storybook && npm run build`.

- [ ] **Step 5.5: Manual visual check under three themes**

Run: `cd design-system && npm run dev` (or `npx turbo run dev --filter=storybook`).

Open the local Storybook URL. For each of the three new story groups (`Components/Spinner`, `Components/EmptyState`, `Components/ErrorBoundary`), switch theme to:
- `theme-base` (baseline)
- `theme-meshal-ai` (branded surface)
- `theme-brutalism` (high-contrast stress test)

Verify for each:
- Spinner is visible against the background (not invisible because of color match).
- EmptyState dashed border is visible; icon color is muted.
- ErrorFallback's AlertTriangle is rendered in `text-destructive`; "Try again" Button is visible.

If any theme renders a primitive invisibly or with broken contrast, document the theme + component in a follow-up issue but do not block this plan — the problem lives in the theme package, not in the new primitive.

- [ ] **Step 5.6: Commit stories**

```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system
git add apps/storybook/src/stories/Spinner.stories.tsx apps/storybook/src/stories/EmptyState.stories.tsx apps/storybook/src/stories/ErrorBoundary.stories.tsx
git commit -m "docs(ui): add Storybook stories for Spinner, EmptyState, ErrorBoundary"
```

---

## Task 5b: Update COMPONENTS.md

**Files:**
- Modify: `design-system/packages/ui/COMPONENTS.md`

`COMPONENTS.md` uses H2 sections per component with `Purpose` / `Token usage` / `Variants` / `States` subsections (see the existing `Button` and `Card` entries at the top of the file). Append three new sections following that format.

- [ ] **Step 5b.1: Append ErrorBoundary section**

Open `packages/ui/COMPONENTS.md`. Find a natural insertion point (alphabetical, between existing sections). Append:

```md

---

## ErrorBoundary / ErrorFallback

**Purpose:** Catch React render-time errors and show a themed fallback. Wraps `react-error-boundary` with a default `console.error` logger.

**Token usage:** `text-foreground` (title), `text-muted-foreground` (description), `text-destructive` (AlertTriangle icon), `bg-card` + `border` (inline container).

**Variants:** `inline` (default) — rendered inside a card/route segment with `rounded-lg border bg-card p-6`. `page` — full-route fallback with `min-h-[60vh]`.

**Props:**
- `ErrorBoundary`: inherits `react-error-boundary`'s full `ErrorBoundaryProps`. Default `onError` logs `[ErrorBoundary]` + error to console; override or silence via the `onError` prop.
- `ErrorFallback`: extends `FallbackProps` with `variant?: 'inline' | 'page'`, `title?: string` (default `"Something went wrong"`), `description?: string` (default `error.message`), `icon?: ReactNode` (default `<AlertTriangle />`), `action?: ReactNode` (default `<Button>Try again</Button>`), `className?: string`.

**Accessibility:** Fallback container has `role="alert"` so screen readers announce state changes.
```

- [ ] **Step 5b.2: Append EmptyState section**

Append:

```md

---

## EmptyState

**Purpose:** "No data yet" and "no results" surfaces. Distinct from `ErrorFallback` — indicates absence, not failure.

**Token usage:** `text-foreground` (title), `text-muted-foreground` (description, icon wrapper), `bg-muted/30` + `border-dashed` (inline container).

**Variants:** `inline` (default) — dashed-border muted container. `page` — standalone `min-h-[50vh]` empty page shell.

**Props:** `icon?: ReactNode`, `title: string` (required), `description?: string`, `action?: ReactNode`, `variant?: 'inline' | 'page'`, `className?: string`.

**Composition:** `icon` is wrapped in a `text-muted-foreground` span so any Lucide icon inherits the correct color via `currentColor`. `action` accepts a single `Button`, multiple buttons in a fragment, or any other node.
```

- [ ] **Step 5b.3: Append Spinner + PageLoader section**

Append:

```md

---

## Spinner / PageLoader

**Purpose:** Indeterminate loading indicator (Spinner) and centered Suspense fallback wrapper (PageLoader). Composes with existing `Skeleton` (structural) to form the three-primitive loading surface.

**Token usage:** `text-muted-foreground` (Spinner base color, `currentColor` inherits).

**Variants (Spinner):** `size: 'sm' | 'md' | 'lg'` → `w-4 h-4` / `w-6 h-6` / `w-10 h-10`.

**Props:**
- `Spinner`: extends `SVGAttributes<SVGSVGElement>` (omitting `aria-label`). `size?: 'sm' | 'md' | 'lg'` (default `md`), `label?: string` (default `"Loading"`), `className?: string`.
- `PageLoader`: `label?: string`, `className?: string`. Renders a `Spinner size="lg"` inside a flex-centered `min-h-[50vh]` container.

**Accessibility:** Spinner has `role="status"` + `aria-label` + a sibling `sr-only` span so screen readers announce the loading state.
```

- [ ] **Step 5b.4: Commit**

```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system
git add packages/ui/COMPONENTS.md
git commit -m "docs(ui): document ErrorBoundary, EmptyState, Spinner in COMPONENTS.md"
```

---

## Task 6: Changeset and version bump

**Files:**
- Create: `design-system/.changeset/ui-error-empty-loading-primitives.md`
- Modify (by `changeset version`): `design-system/packages/ui/package.json` (version field), `design-system/packages/ui/CHANGELOG.md`

- [ ] **Step 6.1: Create the changeset**

Create `.changeset/ui-error-empty-loading-primitives.md`:

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

- [ ] **Step 6.2: Commit the changeset alone**

```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system
git add .changeset/ui-error-empty-loading-primitives.md
git commit -m "chore(changeset): minor bump for @alawein/ui primitives"
```

- [ ] **Step 6.3: Run `changeset version`**

Run: `npx changeset version`

Expected behavior:
- `packages/ui/package.json` `version` field changes from `0.1.2` to `0.2.0`.
- `packages/ui/CHANGELOG.md` gets a new `## 0.2.0` section with the body from Step 6.1.
- `.changeset/ui-error-empty-loading-primitives.md` is deleted (consumed).

- [ ] **Step 6.4: Verify the version changes**

Run: `node -e "console.log(require('./packages/ui/package.json').version)"`

Expected: prints `0.2.0`.

Run: `head -20 packages/ui/CHANGELOG.md`

Expected: first section is `## 0.2.0` with the bullet list from the changeset.

- [ ] **Step 6.5: Commit the version bump**

```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system
git add packages/ui/package.json packages/ui/CHANGELOG.md .changeset/
git commit -m "chore(release): @alawein/ui@0.2.0"
```

---

## Task 7: Full build + test + lint verification

**Files:** no file changes; verification only.

- [ ] **Step 7.1: Clean build**

Run: `cd packages/ui && npm run clean && cd ../..`

Expected: `packages/ui/dist/` removed.

- [ ] **Step 7.2: Build @alawein/ui via Turborepo**

Run: `npx turbo run build --filter=@alawein/ui`

Expected: build completes; `packages/ui/dist/index.js` + `packages/ui/dist/index.d.ts` regenerated. Build time should be comparable to prior builds (sub-30s on a warm cache).

- [ ] **Step 7.3: Run lint (tsc --noEmit)**

Run: `npm run lint -w @alawein/ui`

Expected: no TypeScript errors.

- [ ] **Step 7.4: Run full test suite**

Run: `npm test -w @alawein/ui`

Expected: all vitest suites pass — existing 44 components + 3 new components (Spinner/PageLoader = 10 tests, EmptyState = 8 tests, ErrorBoundary/ErrorFallback = 10 tests) + export-parity.

- [ ] **Step 7.5: Verify build produced the expected surface**

Run: `node -e "const m = require('./packages/ui/dist/index.js'); ['ErrorBoundary','ErrorFallback','EmptyState','Spinner','PageLoader'].forEach(k => console.log(k, typeof m[k]))"`

Expected output:
```
ErrorBoundary function
ErrorFallback function
EmptyState function
Spinner function
PageLoader function
```

If any of these print `undefined`, the export path in `index.ts` is missing or the build didn't pick up the new file. Re-run Step 2.5 / 3.5 / 4.5 to check exports, then re-run Step 7.2.

- [ ] **Step 7.6: Verify type declarations**

Run: `grep -E "ErrorBoundary|ErrorFallback|EmptyState|Spinner|PageLoader|FallbackProps|ErrorBoundaryProps" packages/ui/dist/index.d.ts`

Expected: each symbol appears at least once in the declaration output.

---

## Task 8: Bolts smoke test (pre-publish gate)

**Purpose:** Catch the Spec A light-theme-on-dark bug before publishing to npm. Bolts is the first consumer migration (MEP row 20) and its existing `ErrorBoundary` has the known visual regression.

**Files:** no file changes in design-system; verification inside `bolts/`.

Working directory for this task: `C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts/`.

- [ ] **Step 8.1: Link the local @alawein/ui build**

Run (in design-system):
```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system/packages/ui
npm link
```

Run (in bolts):
```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts
npm link @alawein/ui
```

Expected: `bolts/node_modules/@alawein/ui` becomes a symlink to the design-system build output.

- [ ] **Step 8.2: Temporarily swap bolts' ErrorBoundary usage**

In `bolts/`, find the file that renders bolts' current `ErrorBoundary` (likely `src/App.tsx` or `src/main.tsx` — use `grep -rn "ErrorBoundary" src/`).

Replace the import with:
```tsx
import { ErrorBoundary, ErrorFallback } from '@alawein/ui';
```

And the usage with:
```tsx
<ErrorBoundary FallbackComponent={(props) => <ErrorFallback {...props} variant="page" />}>
  <App />
</ErrorBoundary>
```

**Do NOT commit this change in bolts.** This is smoke-test-only. Revert at the end of this task.

- [ ] **Step 8.3: Run bolts dev server**

Run: `cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts && npm run dev`

Expected: dev server starts on its configured port.

- [ ] **Step 8.4: Trigger an error and visually verify**

In bolts' code, temporarily add a throw somewhere that renders on the page (e.g., inside the root route component):
```tsx
throw new Error('Smoke test — ignore');
```

Reload the browser. Verify:
- Fallback renders centered on the page.
- AlertTriangle icon renders in `text-destructive` color (themed).
- "Something went wrong" heading is readable against the page background.
- Description text is readable.
- "Try again" button is visible and themed correctly.
- **Specifically:** the fallback does not show black text on a dark background (the known Spec A bug). The whole fallback should respect bolts' dark theme.

- [ ] **Step 8.5: Revert bolts changes**

```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/bolts
git checkout -- .
npm unlink @alawein/ui
npm install
```

Expected: bolts is back to its prior state with its local ErrorBoundary.

In design-system:
```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system/packages/ui
npm unlink -g @alawein/ui
```

- [ ] **Step 8.6: Gate decision**

If Step 8.4 showed the fallback rendering correctly under bolts' theme → proceed to Task 9 (publish).

If Step 8.4 showed a regression → do NOT publish. Fix the issue in `packages/ui/src/components/error-boundary.tsx` (likely a hardcoded color class that should be a token), add a new test for the regression, rerun Task 7, re-run Task 8 from Step 8.2.

---

## Task 9: Publish + tag

**Files:** no local file changes; publishes `@alawein/ui@0.2.0` to npm public registry.

**Prerequisite:** `npm whoami` in the design-system dir returns the publishing account (per the `.changeset/config.json` setup). If you're not logged in: `npm login --registry https://registry.npmjs.org/` — this is interactive and requires the user. Do not auto-attempt.

- [ ] **Step 9.1: Confirm publish preconditions**

Run: `cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system && npm whoami --registry https://registry.npmjs.org/`

Expected: prints the npm username that owns `@alawein`.

Run: `cat packages/ui/package.json | grep -E '"version"|"name"'`

Expected: `"name": "@alawein/ui"` and `"version": "0.2.0"`.

- [ ] **Step 9.2: Publish**

Run: `npx changeset publish`

Expected: changesets publishes `@alawein/ui@0.2.0` to npm (public access), creates a git tag `@alawein/ui@0.2.0`, and prints a success summary.

If publish fails due to auth: fix `npm whoami` first, retry.

If publish fails because the version already exists on npm: someone beat us to it. Bump to `0.2.1` with a new changeset, redo Task 6–7, retry.

- [ ] **Step 9.3: Push commits and tag**

```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/design-system
git push origin main
git push origin --tags
```

Expected: commits from Tasks 1–6 land on `origin/main`; tag `@alawein/ui@0.2.0` is pushed.

- [ ] **Step 9.4: Verify the published package**

Run: `npm view @alawein/ui version`

Expected: prints `0.2.0`.

Run: `npm view @alawein/ui dependencies.react-error-boundary`

Expected: prints `^4.1.2`.

- [ ] **Step 9.5: Record the release**

Append to `alawein/docs/superpowers/specs/2026-04-23-master-execution-plan.md` — mark MEP rows 16, 17, 18, 19 as `done` with today's date and the git commit SHA from Task 6.5 (the `chore(release): @alawein/ui@0.2.0` commit).

Commit:
```bash
cd C:/Users/mesha/Desktop/Dropbox/GitHub/alawein/alawein
git add docs/superpowers/specs/2026-04-23-master-execution-plan.md
git commit -m "docs(superpowers): mark MEP rows 16-19 done (@alawein/ui@0.2.0)"
```

---

## Done definition

All of the following must be true:

- `@alawein/ui@0.2.0` is queryable via `npm view @alawein/ui version`.
- `npm view @alawein/ui` lists `react-error-boundary` in dependencies.
- `packages/ui/dist/index.js` runtime import exposes `ErrorBoundary`, `ErrorFallback`, `EmptyState`, `Spinner`, `PageLoader`.
- `packages/ui/dist/index.d.ts` contains `FallbackProps` and `ErrorBoundaryProps` type declarations.
- `packages/ui/src/components/` contains `error-boundary.tsx`, `empty-state.tsx`, `spinner.tsx` (plus their `*.test.tsx` siblings).
- `apps/storybook/src/stories/` contains `Spinner.stories.tsx`, `EmptyState.stories.tsx`, `ErrorBoundary.stories.tsx`.
- `packages/ui/CHANGELOG.md` top section is `## 0.2.0` with the primitives bullet list.
- `packages/ui/COMPONENTS.md` has new H2 sections for `ErrorBoundary / ErrorFallback`, `EmptyState`, and `Spinner / PageLoader`.
- `npm test -w @alawein/ui` passes.
- `npm run lint -w @alawein/ui` passes.
- Bolts smoke test (Task 8) passed before publish.
- MEP rows 16, 17, 18, 19 marked done in `alawein/docs/superpowers/specs/2026-04-23-master-execution-plan.md`.

---

## Rollback contract

npm publishes are effectively irreversible. If a regression is discovered after Task 9:

1. Do not `npm unpublish` (24hr window, breaks registry trust).
2. Bump to `0.2.1` with a fix: new changeset → `npx changeset version` → commit → `npx changeset publish` → push tags.
3. Consumer migrations (MEP rows 20–26) pause until `0.2.1` lands.

---

## Out of scope (do not implement here)

- Consumer migrations (MEP rows 20–26). Each is a separate PR per product.
- Sentry/PostHog telemetry adapter (MEP row 95).
- Extended README documentation for loading-surface patterns (MEP row 93).
- `tailwind-merge` + `cn` consumer-side audit (MEP row 94 — `cn` is already exported at `packages/ui/src/index.ts:2`).

---

## References

- Spec: `alawein/docs/superpowers/specs/2026-04-23-ui-primitives-error-empty-loading-design.md`
- MEP: `alawein/docs/superpowers/specs/2026-04-23-master-execution-plan.md` (rows 16–26)
- Upstream: `react-error-boundary` — <https://github.com/bvaughn/react-error-boundary>
- Existing conventions:
  - Component: `design-system/packages/ui/src/components/alert.tsx`, `skeleton.tsx`
  - Test: `design-system/packages/ui/src/components/alert.test.tsx`
  - Storybook story: `design-system/apps/storybook/src/stories/Alert.stories.tsx`
  - Export parity: `design-system/packages/ui/src/components/export-parity.test.ts`
