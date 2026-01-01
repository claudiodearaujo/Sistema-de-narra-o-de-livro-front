import { test, expect, Page } from '@playwright/test';

/**
 * Social Features E2E Tests
 * Tests feed, posts, likes, comments, and profile
 * 
 * Test Users:
 * - USER: usuario@livria.com.br / User@2024!
 * - WRITER: escritor@livria.com.br / Writer@2024!
 * - PRO: pro@livria.com.br / Pro@2024!
 * - ADMIN: sophia@livria.com.br / Livria@2024!
 */

const TEST_USERS = {
  USER: { email: 'usuario@livria.com.br', password: 'User@2024!' },
  WRITER: { email: 'escritor@livria.com.br', password: 'Writer@2024!' },
  PRO: { email: 'pro@livria.com.br', password: 'Pro@2024!' },
  ADMIN: { email: 'sophia@livria.com.br', password: 'Livria@2024!' }
};

// Helper to login before tests
async function loginAsTestUser(page: Page, userType: keyof typeof TEST_USERS = 'USER') {
  await page.goto('/auth/login');
  const user = TEST_USERS[userType];
  await page.locator('#email').fill(user.email);
  await page.locator('#password input, input[type="password"]').first().fill(user.password);
  await page.locator('button[type="submit"]').click();
  
  // Wait for redirect to feed or dashboard
  await page.waitForURL(/social|dashboard/, { timeout: 15000 });
}

test.describe('Social Feed', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('should display feed page with posts', async ({ page }) => {
    await page.goto('/social/feed');
    
    // Wait for feed to load
    await page.waitForLoadState('networkidle');
    
    // Should show feed content or empty state
    const hasPosts = await page.locator('[class*="post"], [data-testid="post"]').count() > 0;
    const hasEmptyState = await page.locator('text=/nenhum post|sem posts|feed vazio/i').isVisible();
    
    expect(hasPosts || hasEmptyState).toBeTruthy();
  });

  test('should show story bar at top of feed', async ({ page }) => {
    await page.goto('/social/feed');
    
    // Story bar should be visible
    await expect(page.locator('[class*="story"], [data-testid="story-bar"]')).toBeVisible();
  });

  test('should have post composer button', async ({ page }) => {
    await page.goto('/social/feed');
    
    // Should have a way to create posts
    const createButton = page.locator('button:has-text("criar"), button:has-text("postar"), button[aria-label*="criar"], [class*="composer"]').first();
    await expect(createButton).toBeVisible();
  });

  test('should navigate to explore page', async ({ page }) => {
    await page.goto('/social/feed');
    
    // Find and click explore link
    const exploreLink = page.locator('a[href*="explore"], button:has-text("explorar")').first();
    await exploreLink.click();
    
    await expect(page).toHaveURL(/explore/);
  });
});

test.describe('Explore Page', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('should display explore page', async ({ page }) => {
    await page.goto('/social/explore');
    
    await page.waitForLoadState('networkidle');
    
    // Should show explore content
    await expect(page.locator('h1, h2').first()).toContainText(/explor|descobr|trending/i);
  });

  test('should show trending section', async ({ page }) => {
    await page.goto('/social/explore');
    
    // Look for trending or popular content section
    const trendingSection = page.locator('text=/trending|em alta|popular/i').first();
    await expect(trendingSection).toBeVisible();
  });
});

test.describe('User Profile', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('should display user profile', async ({ page }) => {
    await page.goto('/social/profile');
    
    await page.waitForLoadState('networkidle');
    
    // Should show profile information
    await expect(page.locator('[class*="avatar"], img[alt*="avatar"]')).toBeVisible();
  });

  test('should show followers/following counts', async ({ page }) => {
    await page.goto('/social/profile');
    
    // Should display follower stats
    await expect(page.locator('text=/seguidores|followers/i')).toBeVisible();
    await expect(page.locator('text=/seguindo|following/i')).toBeVisible();
  });

  test('should show user posts tab', async ({ page }) => {
    await page.goto('/social/profile');
    
    // Should have posts section
    await expect(page.locator('text=/posts|publicações/i')).toBeVisible();
  });
});

test.describe('Search', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('should display search page', async ({ page }) => {
    await page.goto('/social/search');
    
    // Should have search input
    await expect(page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]')).toBeVisible();
  });

  test('should search for content', async ({ page }) => {
    await page.goto('/social/search');
    
    // Enter search query
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]').first();
    await searchInput.fill('livro');
    await searchInput.press('Enter');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    // Should show results or no results message
    const hasResults = await page.locator('[class*="result"], [data-testid="search-result"]').count() > 0;
    const hasNoResults = await page.locator('text=/nenhum resultado|não encontrado/i').isVisible();
    
    expect(hasResults || hasNoResults).toBeTruthy();
  });
});

test.describe('Notifications', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('should display notifications page', async ({ page }) => {
    await page.goto('/social/notifications');
    
    await page.waitForLoadState('networkidle');
    
    // Should show notifications or empty state
    const hasNotifications = await page.locator('[class*="notification"], [data-testid="notification"]').count() > 0;
    const hasEmptyState = await page.locator('text=/nenhuma notificação|sem notificações/i').isVisible();
    
    expect(hasNotifications || hasEmptyState).toBeTruthy();
  });

  test('should have notification bell in header', async ({ page }) => {
    await page.goto('/social/feed');
    
    // Should have notification icon
    await expect(page.locator('[class*="notification-bell"], [aria-label*="notification"], .pi-bell')).toBeVisible();
  });
});

test.describe('Messages', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('should display messages/inbox page', async ({ page }) => {
    await page.goto('/social/messages');
    
    await page.waitForLoadState('networkidle');
    
    // Should show messages or empty state
    const hasConversations = await page.locator('[class*="conversation"], [data-testid="conversation"]').count() > 0;
    const hasEmptyState = await page.locator('text=/nenhuma mensagem|sem conversas|inbox vazio/i').isVisible();
    
    expect(hasConversations || hasEmptyState).toBeTruthy();
  });
});
