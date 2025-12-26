import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between Home and Favourites', async ({ page }) => {
    await page.goto('/');
    
    // Verify we're on home page
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('input[placeholder*="Search for movies"]')).toBeVisible();
    
    // Navigate to favourites
    await page.locator('text=Favourites').click();
    await expect(page).toHaveURL(/\/favourites/);
    await expect(page.locator('text=Favourites Page')).toBeVisible();
    
    // Navigate back to home
    await page.locator('text=Home').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('input[placeholder*="Search for movies"]')).toBeVisible();
  });

  test('should navigate using brand logo', async ({ page }) => {
    await page.goto('/favourites');
    await expect(page).toHaveURL(/\/favourites/);
    
    // Click brand logo
    await page.locator('text=Movie App').click();
    await expect(page).toHaveURL(/\/$/);
  });});

