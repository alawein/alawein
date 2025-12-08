import { test, expect } from '@playwright/test';

test.describe('Client Portal', () => {
  test.beforeEach(async ({ page }) => {
    // This would need to be updated once authentication is working
    // For now, we'll test the UI structure
    await page.goto('/dashboard');
  });

  test('should display dashboard layout', async ({ page }) => {
    // Check main sections exist (even if empty)
    await expect(page.locator('text=Quick Stats')).toBeVisible();
    await expect(page.locator('text=Today\'s Workout')).toBeVisible();
    await expect(page.locator('text=Progress')).toBeVisible();
    await expect(page.locator('text=Goals')).toBeVisible();
    await expect(page.locator('text=Messages')).toBeVisible();
    await expect(page.locator('text=Sessions')).toBeVisible();
  });

  test('should have navigation tabs', async ({ page }) => {
    // Check tab navigation exists
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(6); // Dashboard, Workout, Progress, Goals, Messages, Sessions
  });

  test('should display quick stats cards', async ({ page }) => {
    // Check stats cards are present
    await expect(page.locator('text=Workouts')).toBeVisible();
    await expect(page.locator('text=Weight')).toBeVisible();
    await expect(page.locator('text=Sessions')).toBeVisible();
    await expect(page.locator('text=Streak')).toBeVisible();
  });

  test('should show week calendar', async ({ page }) => {
    // Check calendar component exists
    await expect(page.locator('text=Week View')).toBeVisible();
  });

  test('should have workout logging interface', async ({ page }) => {
    // Navigate to workout tab
    await page.locator('[role="tab"]').filter({ hasText: 'Workout' }).click();

    // Check workout logging elements exist
    await expect(page.locator('text=Exercise')).toBeVisible();
    await expect(page.locator('text=Sets')).toBeVisible();
    await expect(page.locator('text=Reps')).toBeVisible();
    await expect(page.locator('text=Weight')).toBeVisible();
  });

  test('should display progress charts', async ({ page }) => {
    // Navigate to progress tab
    await page.locator('[role="tab"]').filter({ hasText: 'Progress' }).click();

    // Check chart containers exist
    await expect(page.locator('text=Weight Progress')).toBeVisible();
    await expect(page.locator('text=Body Fat')).toBeVisible();
    await expect(page.locator('text=Strength')).toBeVisible();
  });

  test('should have goals management', async ({ page }) => {
    // Navigate to goals tab
    await page.locator('[role="tab"]').filter({ hasText: 'Goals' }).click();

    // Check goals interface exists
    await expect(page.locator('text=Add Goal')).toBeVisible();
  });

  test('should have messaging interface', async ({ page }) => {
    // Navigate to messages tab
    await page.locator('[role="tab"]').filter({ hasText: 'Messages' }).click();

    // Check messaging interface exists
    await expect(page.locator('text=Send Message')).toBeVisible();
  });

  test('should have session booking', async ({ page }) => {
    // Navigate to sessions tab
    await page.locator('[role="tab"]').filter({ hasText: 'Sessions' }).click();

    // Check session booking exists
    await expect(page.locator('text=Book Session')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile layout
    await expect(page.locator('text=Quick Stats')).toBeVisible();

    // Check tabs are accessible on mobile
    const tabs = page.locator('[role="tab"]');
    await expect(tabs.first()).toBeVisible();
  });
});
