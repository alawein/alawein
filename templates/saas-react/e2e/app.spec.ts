import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/{{PROJECT_NAME}}/);
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="/dashboard"]');
  await expect(page).toHaveURL(/dashboard/);
});
