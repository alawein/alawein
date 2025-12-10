---
title: 'Testing Strategy'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Testing Strategy

Comprehensive testing approach for the Alawein monorepo.

## Testing Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /----\     - Critical user flows
     /      \    - Cross-platform integration
    /--------\
   /          \  Integration Tests (Some)
  /            \ - API endpoints
 /--------------\- Component interactions
/                \
/------------------\ Unit Tests (Many)
                    - Functions
                    - Components
                    - Utilities
```

## Test Types

### Unit Tests

Test individual functions and components in isolation.

**Tools**: Vitest

**Coverage Target**: 80%+

```typescript
// Example: Testing a utility function
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/utils/format';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  it('handles negative values', () => {
    expect(formatCurrency(-50, 'USD')).toBe('-$50.00');
  });
});
```

### Component Tests

Test React components with React Testing Library.

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading", () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Integration Tests

Test multiple components or services working together.

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SimulationList } from "@/features/simcore/SimulationList";

describe("SimulationList Integration", () => {
  it("fetches and displays simulations", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SimulationList />
      </QueryClientProvider>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Fluid Dynamics")).toBeInTheDocument();
    });

    // Verify list renders correctly
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
});
```

### E2E Tests

Test complete user flows in the browser.

**Tools**: Playwright

```typescript
import { test, expect } from '@playwright/test';

test('complete workout logging flow', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Navigate to workout
  await page.goto('/repz/workout');

  // Add exercise
  await page.click('button:text("Add Exercise")');
  await page.fill('[name="exercise"]', 'Squat');
  await page.fill('[name="weight"]', '225');

  // Save
  await page.click('button:text("Save")');

  // Verify
  await expect(page.locator('.toast')).toContainText('Saved');
});
```

### Performance Tests

Test system performance under load.

**Tools**: k6

See [testing/PERFORMANCE-TESTING.md](./testing/PERFORMANCE-TESTING.md)

## Mocking Strategies

### API Mocking

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'Test User' }]));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Module Mocking

```typescript
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
}));
```

### Time Mocking

```typescript
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-01-01'));
});

afterEach(() => {
  vi.useRealTimers();
});
```

## Test Organization

### Directory Structure

```
tests/
├── unit/                 # Unit tests
│   ├── utils/
│   └── components/
├── integration/          # Integration tests
│   ├── api/
│   └── features/
├── e2e/                  # E2E tests
│   ├── auth.spec.ts
│   └── workflows.spec.ts
├── performance/          # Performance tests
│   ├── smoke-test.js
│   └── load-test.js
└── fixtures/             # Test data
    └── users.json
```

### Naming Conventions

| Type        | Pattern                 | Example                    |
| ----------- | ----------------------- | -------------------------- |
| Unit        | `*.test.ts`             | `formatDate.test.ts`       |
| Component   | `*.test.tsx`            | `Button.test.tsx`          |
| Integration | `*.integration.test.ts` | `auth.integration.test.ts` |
| E2E         | `*.spec.ts`             | `login.spec.ts`            |
| Performance | `*-test.js`             | `load-test.js`             |

## CI/CD Integration

### Test Pipeline

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - run: npm ci

      # Unit & Integration
      - run: npm run test:run

      # E2E
      - run: npx playwright install --with-deps
      - run: npx playwright test

      # Coverage
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4
```

### Quality Gates

| Metric                      | Threshold |
| --------------------------- | --------- |
| Unit test coverage          | > 80%     |
| All tests passing           | 100%      |
| No critical vulnerabilities | 0         |
| E2E tests passing           | 100%      |

## Best Practices

### Writing Good Tests

1. **Arrange-Act-Assert** pattern
2. **One assertion per test** (when practical)
3. **Descriptive test names**
4. **Test behavior, not implementation**
5. **Keep tests independent**

### What to Test

| Priority | What           | Example                   |
| -------- | -------------- | ------------------------- |
| High     | Business logic | Calculations, validations |
| High     | User flows     | Login, checkout           |
| Medium   | Edge cases     | Empty states, errors      |
| Medium   | Integrations   | API calls                 |
| Low      | Styling        | Visual appearance         |

### What NOT to Test

- Third-party libraries
- Framework internals
- Implementation details
- Trivial code

## Related Documents

- [testing/TESTING-GUIDE.md](./testing/TESTING-GUIDE.md) - Detailed testing
  guide
- [testing/E2E-TESTING.md](./testing/E2E-TESTING.md) - E2E testing
- [testing/PERFORMANCE-TESTING.md](./testing/PERFORMANCE-TESTING.md) -
  Performance testing
