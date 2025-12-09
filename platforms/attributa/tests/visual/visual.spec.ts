import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Attributa
 * 
 * These tests capture screenshots and compare them against baseline images.
 * Run `npx playwright test --update-snapshots` to update baselines.
 */

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.waitForLoadState('networkidle');
  });

  test('homepage visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test('analysis panel visual snapshot', async ({ page }) => {
    await page.goto('/');
    const analysisPanel = page.locator('[data-testid="analysis-panel"], .analysis-panel');
    if (await analysisPanel.isVisible()) {
      await expect(analysisPanel).toHaveScreenshot('analysis-panel.png', {
        maxDiffPixelRatio: 0.05,
      });
    }
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

