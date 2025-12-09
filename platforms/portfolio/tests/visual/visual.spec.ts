import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Portfolio
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

  test('hero section visual snapshot', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('[data-testid="hero"], .hero, section:first-of-type');
    if (await hero.isVisible()) {
      await expect(hero).toHaveScreenshot('hero-section.png', {
        maxDiffPixelRatio: 0.05,
      });
    }
  });

  test('projects section visual snapshot', async ({ page }) => {
    await page.goto('/');
    const projects = page.locator('[data-testid="projects"], #projects, .projects');
    if (await projects.isVisible()) {
      await expect(projects).toHaveScreenshot('projects-section.png', {
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

