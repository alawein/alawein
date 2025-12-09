import { test, expect } from '@playwright/test';

test('basic smoke test - app loads', async ({ page }) => {
  // Just try to navigate to the root URL
  await page.goto('/', { waitUntil: 'networkidle' });

  // Check that the page has loaded by looking for any common element
  const title = await page.title();
  console.log('Page title:', title);

  // Check for body element as basic verification
  const body = await page.locator('body');
  await expect(body).toBeVisible();

  // Take a screenshot for debugging
  await page.screenshot({ path: 'test-results/smoke-test.png' });
});