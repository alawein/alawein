import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/rest/v1/**', route => route.abort());

    await page.goto('/dashboard');

    // Should show error message instead of crashing
    await expect(page.locator('text=Network error')).toBeVisible();
  });

  test('should handle authentication errors', async ({ page }) => {
    // Mock auth failure
    await page.route('**/auth/v1/**', route => route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Invalid credentials' })
    }));

    await page.goto('/login');

    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    // Should show auth error
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should handle database connection errors', async ({ page }) => {
    // Mock database error
    await page.route('**/rest/v1/profiles**', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Database connection failed' })
    }));

    await page.goto('/dashboard');

    // Should show database error message
    await expect(page.locator('text=Database connection failed')).toBeVisible();
  });

  test('should retry failed requests', async ({ page }) => {
    let attemptCount = 0;

    await page.route('**/rest/v1/workouts**', route => {
      attemptCount++;
      if (attemptCount === 1) {
        // Fail first attempt
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Temporary server error' })
        });
      } else {
        // Succeed on retry
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    await page.goto('/dashboard');

    // Should eventually succeed after retry
    await expect(page.locator('text=No workouts scheduled')).toBeVisible();
  });

  test('should handle rate limiting', async ({ page }) => {
    // Mock rate limit response
    await page.route('**/rest/v1/**', route => route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Too many requests' })
    }));

    await page.goto('/dashboard');

    // Should show rate limit message
    await expect(page.locator('text=Too many requests')).toBeVisible();
  });

  test('should handle timeout errors', async ({ page }) => {
    // Mock slow response that times out
    await page.route('**/rest/v1/**', route => {
      // Delay response to trigger timeout
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }, 35000); // Longer than timeout
    });

    await page.goto('/dashboard');

    // Should show timeout error
    await expect(page.locator('text=Request timeout')).toBeVisible();
  });

  test('should handle malformed JSON responses', async ({ page }) => {
    // Mock invalid JSON response
    await page.route('**/rest/v1/profiles**', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: 'invalid json {'
    }));

    await page.goto('/dashboard');

    // Should handle JSON parsing error gracefully
    await expect(page.locator('text=Failed to load data')).toBeVisible();
  });

  test('should handle CORS errors', async ({ page }) => {
    // Mock CORS error
    await page.route('**/rest/v1/**', route => route.fulfill({
      status: 0,
      contentType: 'text/plain',
      body: 'CORS error'
    }));

    await page.goto('/dashboard');

    // Should show CORS error message
    await expect(page.locator('text=Network error')).toBeVisible();
  });
});
