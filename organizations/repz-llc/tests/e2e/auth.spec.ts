import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should load signup page', async ({ page }) => {
    await page.goto('/signup');

    // Check page title
    await expect(page.locator('text=Join REPZ Today')).toBeVisible();

    // Check form elements exist
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

    // Check role selection
    await expect(page.locator('text=Client')).toBeVisible();
    await expect(page.locator('text=Coach')).toBeVisible();

    // Check terms checkbox
    await expect(page.locator('input[name="agreeToTerms"]')).toBeVisible();

    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should load login page', async ({ page }) => {
    await page.goto('/login');

    // Check page elements
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate signup form', async ({ page }) => {
    await page.goto('/signup');

    // Submit empty form
    await page.locator('button[type="submit"]').click();

    // Check validation messages appear
    await expect(page.locator('text=Full name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    await expect(page.locator('text=Please confirm your password')).toBeVisible();
    await expect(page.locator('text=You must agree to the Terms of Service')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/signup');

    // Enter invalid email
    await page.locator('input[name="email"]').fill('invalid-email');
    await page.locator('input[name="password"]').fill('ValidPass123!');
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('input[name="confirmPassword"]').fill('ValidPass123!');
    await page.locator('input[name="agreeToTerms"]').check();

    await page.locator('button[type="submit"]').click();

    // Check email validation
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should validate password strength', async ({ page }) => {
    await page.goto('/signup');

    // Enter weak password
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('input[name="password"]').fill('weak');
    await page.locator('input[name="confirmPassword"]').fill('weak');
    await page.locator('input[name="agreeToTerms"]').check();

    await page.locator('button[type="submit"]').click();

    // Check password validation
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('should validate password confirmation', async ({ page }) => {
    await page.goto('/signup');

    // Enter mismatched passwords
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('input[name="password"]').fill('ValidPass123!');
    await page.locator('input[name="confirmPassword"]').fill('DifferentPass123!');
    await page.locator('input[name="agreeToTerms"]').check();

    await page.locator('button[type="submit"]').click();

    // Check password confirmation validation
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should show password strength indicator', async ({ page }) => {
    await page.goto('/signup');

    const passwordInput = page.locator('input[name="password"]');

    // Test weak password
    await passwordInput.fill('weak');
    await expect(page.locator('text=Password strength: Very Weak')).toBeVisible();

    // Test fair password
    await passwordInput.fill('fair123');
    await expect(page.locator('text=Password strength: Fair')).toBeVisible();

    // Test good password
    await passwordInput.fill('GoodPass123');
    await expect(page.locator('text=Password strength: Good')).toBeVisible();

    // Test strong password
    await passwordInput.fill('StrongPass123!');
    await expect(page.locator('text=Password strength: Strong')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/signup');

    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.locator('button[aria-label*="password"]');

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle
    await toggleButton.click();

    // Password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle again
    await toggleButton.click();

    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/signup');

    // Check mobile layout
    await expect(page.locator('text=Join REPZ Today')).toBeVisible();

    // Check form elements fit
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/signup');

    // Check form labels
    await expect(page.locator('label[for="fullName"]')).toHaveText('Full Name');
    await expect(page.locator('label[for="email"]')).toHaveText('Email Address');
    await expect(page.locator('label[for="password"]')).toHaveText('Password');

    // Check ARIA attributes
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('aria-describedby');
    await expect(emailInput).toHaveAttribute('aria-invalid', 'false');

    // Check required attributes
    await expect(page.locator('input[name="fullName"]')).toHaveAttribute('required');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('required');
    await expect(page.locator('input[name="password"]')).toHaveAttribute('required');
  });
});
