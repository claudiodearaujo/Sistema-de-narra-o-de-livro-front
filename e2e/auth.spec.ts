import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * Tests login, register, and protected routes
 */

test.describe('Authentication', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear any stored tokens before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check page title and form elements
    await expect(page.locator('h1, h2').first()).toContainText(/login|entrar/i);
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Check registration form elements
    await expect(page.locator('input[name="name"], input[placeholder*="nome" i]')).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Click submit without filling form
    await page.locator('button[type="submit"]').click();
    
    // Should show validation messages
    await expect(page.locator('text=/obrigatório|required|inválido/i')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill with invalid credentials
    await page.locator('input[type="email"], input[name="email"]').fill('invalid@test.com');
    await page.locator('input[type="password"]').fill('wrongpassword123');
    await page.locator('button[type="submit"]').click();
    
    // Should show error message
    await expect(page.locator('text=/erro|inválido|incorreto|não encontrado/i')).toBeVisible({ timeout: 10000 });
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/social/feed');
    
    // Should redirect to login
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('should have link to register from login page', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Find and click register link
    const registerLink = page.locator('a[href*="register"], a:has-text("cadastr"), a:has-text("criar conta")').first();
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    
    await expect(page).toHaveURL(/register/);
  });

  test('should have link to login from register page', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Find and click login link
    const loginLink = page.locator('a[href*="login"], a:has-text("entrar"), a:has-text("já tenho")').first();
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Protected Routes Guard', () => {
  
  test('should protect dashboard route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('should protect social feed route', async ({ page }) => {
    await page.goto('/social/feed');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('should protect messages route', async ({ page }) => {
    await page.goto('/social/messages');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('should protect notifications route', async ({ page }) => {
    await page.goto('/social/notifications');
    await expect(page).toHaveURL(/auth\/login/);
  });
});
