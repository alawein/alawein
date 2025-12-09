import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for SimCore
 * 
 * These tests capture screenshots and compare them against baseline images.
 * Run `npx playwright test --update-snapshots` to update baselines.
 */

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for fonts and animations to settle
    await page.waitForLoadState('networkidle');
  });

  test('homepage visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000); // Wait for animations
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('navigation menu visual snapshot', async ({ page }) => {
    await page.goto('/');
    // Open navigation if collapsed
    const menuButton = page.locator('[data-testid="menu-button"], button[aria-label*="menu"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('nav, [role="navigation"]').first()).toHaveScreenshot('navigation.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('dark mode visual snapshot', async ({ page }) => {
    await page.goto('/');
    // Toggle dark mode if available
    const themeToggle = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"]');
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('responsive mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('responsive tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});

