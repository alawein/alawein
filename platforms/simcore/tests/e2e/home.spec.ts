import { test, expect } from '@playwright/test';

test.describe('SimCore Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SimCore/i);
  });

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/');
    // Check for main navigation or header
    const header = page.locator('header, nav, [role="navigation"]').first();
    await expect(header).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });
});

