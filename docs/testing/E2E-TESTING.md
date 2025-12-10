---
title: 'End-to-End Testing Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# End-to-End Testing Guide

Playwright E2E testing patterns and best practices.

## Overview

We use Playwright for end-to-end testing across all platforms. E2E tests verify
complete user flows from the browser perspective.

## Setup

### Installation

```bash
# Install Playwright
npx playwright install

# Install with dependencies
npx playwright install --with-deps
```

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    // Navigate
    await page.goto('/login');

    // Fill form
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');

    // Submit
    await page.click('button[type="submit"]');

    // Assert
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });
});
```

### Page Object Model

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// Usage in test
test('login with page object', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
```

### Fixtures

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

type Fixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

## Common Patterns

### Waiting for Elements

```typescript
// Wait for element to be visible
await page.locator('.loading').waitFor({ state: 'hidden' });

// Wait for network idle
await page.waitForLoadState('networkidle');

// Wait for specific response
await page.waitForResponse(
  (response) =>
    response.url().includes('/api/data') && response.status() === 200,
);
```

### Handling Modals

```typescript
test('should handle confirmation modal', async ({ page }) => {
  await page.click('button:text("Delete")');

  // Wait for modal
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();

  // Confirm
  await modal.locator('button:text("Confirm")').click();

  // Verify modal closed
  await expect(modal).not.toBeVisible();
});
```

### API Mocking

```typescript
test('should display mocked data', async ({ page }) => {
  // Mock API response
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 1, name: 'Test User' }]),
    });
  });

  await page.goto('/users');
  await expect(page.locator('.user-name')).toContainText('Test User');
});
```

### Screenshot Testing

```typescript
test('visual regression', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png');
});

// With options
await expect(page).toHaveScreenshot('dashboard.png', {
  maxDiffPixels: 100,
  threshold: 0.2,
});
```

### Accessibility Testing

```typescript
import AxeBuilder from '@axe-core/playwright';

test('should have no accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
```

## Platform-Specific Tests

### SimCore

```typescript
test.describe('SimCore', () => {
  test('should run particle simulation', async ({ page }) => {
    await page.goto('/simcore');

    // Configure simulation
    await page.fill('[name="particles"]', '1000');
    await page.selectOption('[name="type"]', 'fluid');

    // Start simulation
    await page.click('button:text("Run")');

    // Wait for completion
    await expect(page.locator('.status')).toContainText('Complete', {
      timeout: 30000,
    });

    // Verify results
    await expect(page.locator('.results')).toBeVisible();
  });
});
```

### REPZ

```typescript
test.describe('REPZ', () => {
  test('should log workout', async ({ authenticatedPage: page }) => {
    await page.goto('/repz/workout');

    // Add exercise
    await page.click('button:text("Add Exercise")');
    await page.fill('[name="exercise"]', 'Bench Press');
    await page.fill('[name="sets"]', '3');
    await page.fill('[name="reps"]', '10');
    await page.fill('[name="weight"]', '135');

    // Save
    await page.click('button:text("Save Workout")');

    // Verify
    await expect(page.locator('.toast')).toContainText('Workout saved');
  });
});
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/e2e/auth.spec.ts

# Run in headed mode
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# Generate report
npx playwright show-report
```

## CI Integration

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npx playwright install --with-deps

      - run: npx playwright test

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Use data-testid** for stable selectors
2. **Avoid hardcoded waits** - use proper assertions
3. **Keep tests independent** - no shared state
4. **Use Page Objects** for reusability
5. **Mock external services** in CI
6. **Run tests in parallel** when possible

## Related Documents

- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - Main testing guide
- [PERFORMANCE-TESTING.md](./PERFORMANCE-TESTING.md) - Performance tests
- [../TESTING_STRATEGY.md](../TESTING_STRATEGY.md) - Testing strategy
