import { test, expect } from '@playwright/test';

test.describe('Favourites Page', () => {
  test('should display empty state when no favourites', async ({ page }) => {
    // Clear localStorage to ensure empty state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/favourites');
    
    await expect(page.locator('text=Favourites Page')).toBeVisible();
    await expect(page.locator('text=Please add your favourites here...')).toBeVisible();
  });

  test('should display favourites when movies are added', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.movie-card', { timeout: 10000 });
    
    // Add first movie to favourites
    const firstMovieCard = page.locator('.movie-card').first();
    const favouriteButton = firstMovieCard.locator('.favourite-btn');
    const movieTitle = await firstMovieCard.locator('h3').textContent();
    
    await favouriteButton.click();
    
    // Navigate to favourites page
    await page.locator('text=Favourites').click();
    await page.waitForURL('**/favourites');
    
    // Verify favourites page content
    await expect(page.locator('text=Favourites Page')).toBeVisible();
    await expect(page.locator('text=Your favourites are here...')).toBeVisible();
    await expect(page.locator(`text=${movieTitle}`)).toBeVisible();
    
    // Verify movie card is displayed
    const favouriteMovieCard = page.locator('.movie-card').first();
    await expect(favouriteMovieCard).toBeVisible();
  });

  test('should persist favourites after page reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.movie-card', { timeout: 10000 });
    
    // Add movie to favourites
    const firstMovieCard = page.locator('.movie-card').first();
    const favouriteButton = firstMovieCard.locator('.favourite-btn');
    const movieTitle = await firstMovieCard.locator('h3').textContent();
    
    await favouriteButton.click();
    
    // Navigate to favourites and verify
    await page.locator('text=Favourites').click();
    await page.waitForURL('**/favourites');
    await expect(page.locator(`text=${movieTitle}`)).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Verify favourites persist
    await expect(page.locator(`text=${movieTitle}`)).toBeVisible();
  });

  test('should remove movie from favourites page', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.movie-card', { timeout: 10000 });
    
    // Add movie to favourites
    const firstMovieCard = page.locator('.movie-card').first();
    const favouriteButton = firstMovieCard.locator('.favourite-btn');
    
    await favouriteButton.click();
    
    // Navigate to favourites
    await page.locator('text=Favourites').click();
    await page.waitForURL('**/favourites');
    
    // Remove from favourites
    const favouriteCard = page.locator('.movie-card').first();
    const removeButton = favouriteCard.locator('.favourite-btn');
    await removeButton.click();
    
    // Verify empty state appears
    await expect(page.locator('text=Please add your favourites here...')).toBeVisible();
  });
});
