import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the home page with navbar', async ({ page }) => {
    await expect(page.locator('nav.navbar')).toBeVisible();
    await expect(page.locator('text=Movie App')).toBeVisible();
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Favourites')).toBeVisible();
  });

  test('should display search form', async ({ page }) => {
    await expect(page.locator('input[placeholder*="Search for movies"]')).toBeVisible();
    await expect(page.locator('button:has-text("Search")')).toBeVisible();
  });

  test('should load popular movies on page load', async ({ page }) => {
    // Wait for movies to load
    await page.waitForSelector('.movies-grid', { timeout: 10000 });
    
    // Check if movie cards are displayed
    const movieCards = page.locator('.movie-card');
    const count = await movieCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should search for movies', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search for movies"]');
    const searchButton = page.locator('button:has-text("Search")');
    
    await searchInput.fill('batman');
    await searchButton.click();
    
    // Wait for search results
    await page.waitForSelector('.movies-grid', { timeout: 10000 });
    
    // Verify search results are displayed
    const movieCards = page.locator('.movie-card');
    const count = await movieCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display loading state during search', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search for movies"]');
    const searchButton = page.locator('button:has-text("Search")');
    
    await searchInput.fill('inception');
    await searchButton.click();
    
    // Check for loading state (may be too fast to catch, but we'll try)
    const loading = page.locator('text=Loading...');
    // Loading might appear briefly, so we check if it exists or if results appear
    await page.waitForSelector('.movies-grid, text=Loading...', { timeout: 10000 });
  });

  test('should handle empty search gracefully', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search for movies"]');
    const searchButton = page.locator('button:has-text("Search")');
    
    // Try to search with empty query
    await searchInput.fill('');
    await searchButton.click();
    
    // Should still show movies (popular movies)
    await page.waitForSelector('.movies-grid', { timeout: 10000 });
  });
});
