import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match signup page visual snapshot', async ({ page }) => {
    await page.goto('/signup');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('signup-page.png', {
      fullPage: true,
      threshold: 0.1 // Allow 10% difference for minor rendering variations
    });
  });

  test('should match login page visual snapshot', async ({ page }) => {
    await page.goto('/login');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      threshold: 0.1
    });
  });

  test('should match client dashboard visual snapshot', async ({ page }) => {
    await page.goto('/dashboard');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('client-dashboard.png', {
      fullPage: true,
      threshold: 0.1
    });
  });

  test('should match coach dashboard visual snapshot', async ({ page }) => {
    await page.goto('/coach-admin');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('coach-dashboard.png', {
      fullPage: true,
      threshold: 0.1
    });
  });

  test('should match mobile signup page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('signup-mobile.png', {
      fullPage: true,
      threshold: 0.1
    });
  });

  test('should match mobile client dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('client-dashboard-mobile.png', {
      fullPage: true,
      threshold: 0.1
    });
  });

  test('should match tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('client-dashboard-tablet.png', {
      fullPage: true,
      threshold: 0.1
    });
  });
});
