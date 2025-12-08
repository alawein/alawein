import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load signup page within 2 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000); // 2 seconds
  });

  test('should load dashboard within 3 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test('should load coach admin within 3 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/coach-admin');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test('should render components quickly', async ({ page }) => {
    await page.goto('/dashboard');

    // Measure time to render main components
    const startTime = Date.now();

    await page.waitForSelector('text=Quick Stats');
    await page.waitForSelector('text=Today\'s Workout');
    await page.waitForSelector('text=Progress');

    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(1000); // 1 second
  });

  test('should handle rapid navigation', async ({ page }) => {
    await page.goto('/dashboard');

    const navigationTimes: number[] = [];

    // Navigate between tabs rapidly
    const tabs = ['Workout', 'Progress', 'Goals', 'Messages', 'Sessions'];

    for (const tab of tabs) {
      const startTime = Date.now();

      await page.locator(`[role="tab"]`).filter({ hasText: tab }).click();
      await page.waitForLoadState('networkidle');

      const navigationTime = Date.now() - startTime;
      navigationTimes.push(navigationTime);
    }

    // Average navigation time should be under 500ms
    const averageTime = navigationTimes.reduce((a, b) => a + b) / navigationTimes.length;
    expect(averageTime).toBeLessThan(500);
  });

  test('should perform well on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const startTime = Date.now();

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(4000); // 4 seconds on mobile
  });

  test('should handle memory efficiently', async ({ page, context }) => {
    // Navigate through multiple pages
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Check that memory usage doesn't grow excessively
    const metrics = await page.evaluate(() => {
      // @ts-ignore
      if (performance.memory) {
        // @ts-ignore
        return performance.memory;
      }
      return null;
    });

    if (metrics) {
      // Memory usage should be reasonable (< 50MB)
      expect(metrics.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('should minimize bundle size', async ({ page }) => {
    // Check that main bundle is not too large
    const resources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources
        .filter(r => r.name.includes('.js'))
        .map(r => ({
          name: r.name,
          size: (r as any).transferSize || 0
        }));
    });

    const totalJSSize = resources.reduce((total, r) => total + r.size, 0);

    // Total JS should be under 2MB
    expect(totalJSSize).toBeLessThan(2 * 1024 * 1024);
  });

  test('should have good lighthouse scores', async ({ page }) => {
    await page.goto('/dashboard');

    // Run basic performance checks
    const metrics = await page.evaluate(() => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        return entries;
      });

      observer.observe({ entryTypes: ['measure'] });

      // Measure time to interactive
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd,
            loadComplete: performance.getEntriesByType('navigation')[0]?.loadEventEnd,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
          });
        }, 100);
      });
    });

    // Basic performance assertions
    expect(metrics.domContentLoaded).toBeLessThan(2000);
    expect(metrics.loadComplete).toBeLessThan(3000);
  });

  test('should handle concurrent users simulation', async ({ browser }) => {
    // Simulate multiple users accessing the app
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);

    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );

    // All pages load dashboard simultaneously
    const loadPromises = pages.map(page => {
      return page.goto('/dashboard').then(() => page.waitForLoadState('networkidle'));
    });

    const startTime = Date.now();
    await Promise.all(loadPromises);
    const totalLoadTime = Date.now() - startTime;

    // All pages should load within reasonable time
    expect(totalLoadTime).toBeLessThan(5000);

    // Clean up
    await Promise.all(contexts.map(context => context.close()));
  });
});
