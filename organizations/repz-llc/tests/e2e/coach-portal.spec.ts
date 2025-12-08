import { test, expect } from '@playwright/test';

test.describe('Coach Portal', () => {
  test.beforeEach(async ({ page }) => {
    // This would need authentication in a real scenario
    await page.goto('/coach-admin');
  });

  test('should display coach dashboard layout', async ({ page }) => {
    // Check main sections exist
    await expect(page.locator('text=Client Overview')).toBeVisible();
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
  });

  test('should have navigation tabs', async ({ page }) => {
    // Check tab navigation exists
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(5); // Dashboard, Clients, Workouts, Sessions, Analytics
  });

  test('should display client list', async ({ page }) => {
    // Navigate to clients tab
    await page.locator('[role="tab"]').filter({ hasText: 'Clients' }).click();

    // Check client list exists
    await expect(page.locator('text=Client List')).toBeVisible();
    await expect(page.locator('text=Search clients')).toBeVisible();
    await expect(page.locator('text=Add Client')).toBeVisible();
  });

  test('should have workout creation interface', async ({ page }) => {
    // Navigate to workouts tab
    await page.locator('[role="tab"]').filter({ hasText: 'Workouts' }).click();

    // Check workout creation exists
    await expect(page.locator('text=Create Workout')).toBeVisible();
    await expect(page.locator('text=Workout Templates')).toBeVisible();
    await expect(page.locator('text=Exercise Library')).toBeVisible();
  });

  test('should have session scheduling', async ({ page }) => {
    // Navigate to sessions tab
    await page.locator('[role="tab"]').filter({ hasText: 'Sessions' }).click();

    // Check session scheduling exists
    await expect(page.locator('text=Schedule Session')).toBeVisible();
    await expect(page.locator('text=Upcoming Sessions')).toBeVisible();
    await expect(page.locator('text=Session Types')).toBeVisible();
  });

  test('should display analytics dashboard', async ({ page }) => {
    // Navigate to analytics tab
    await page.locator('[role="tab"]').filter({ hasText: 'Analytics' }).click();

    // Check analytics sections exist
    await expect(page.locator('text=Revenue')).toBeVisible();
    await expect(page.locator('text=Client Growth')).toBeVisible();
    await expect(page.locator('text=Session Stats')).toBeVisible();
    await expect(page.locator('text=Performance')).toBeVisible();
  });

  test('should have messaging interface', async ({ page }) => {
    // Check messaging exists in dashboard
    await expect(page.locator('text=Messages')).toBeVisible();
    await expect(page.locator('text=Send Message')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check mobile layout
    await expect(page.locator('text=Client Overview')).toBeVisible();

    // Check tabs are accessible on mobile
    const tabs = page.locator('[role="tab"]');
    await expect(tabs.first()).toBeVisible();
  });

  test('should have quick action buttons', async ({ page }) => {
    // Check quick actions exist
    await expect(page.locator('text=Create Workout')).toBeVisible();
    await expect(page.locator('text=Schedule Session')).toBeVisible();
    await expect(page.locator('text=Add Client')).toBeVisible();
    await expect(page.locator('text=Send Message')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    // Check recent activity section
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    await expect(page.locator('text=View All')).toBeVisible();
  });

  test('should have client search functionality', async ({ page }) => {
    await page.locator('[role="tab"]').filter({ hasText: 'Clients' }).click();

    // Check search input exists
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();

    // Check filter options exist
    await expect(page.locator('text=Filter by')).toBeVisible();
  });

  test('should have workout template management', async ({ page }) => {
    await page.locator('[role="tab"]').filter({ hasText: 'Workouts' }).click();

    // Check template management exists
    await expect(page.locator('text=Templates')).toBeVisible();
    await expect(page.locator('text=Create Template')).toBeVisible();
    await expect(page.locator('text=Import Template')).toBeVisible();
  });

  test('should have calendar view for sessions', async ({ page }) => {
    await page.locator('[role="tab"]').filter({ hasText: 'Sessions' }).click();

    // Check calendar exists
    await expect(page.locator('text=Calendar View')).toBeVisible();
    await expect(page.locator('text=Today')).toBeVisible();
    await expect(page.locator('text=Week')).toBeVisible();
    await expect(page.locator('text=Month')).toBeVisible();
  });

  test('should display performance metrics', async ({ page }) => {
    await page.locator('[role="tab"]').filter({ hasText: 'Analytics' }).click();

    // Check performance metrics exist
    await expect(page.locator('text=Client Retention')).toBeVisible();
    await expect(page.locator('text=Average Session Length')).toBeVisible();
    await expect(page.locator('text=Revenue per Client')).toBeVisible();
  });
});
