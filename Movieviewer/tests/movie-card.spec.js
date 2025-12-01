import { test, expect } from '@playwright/test';

test.describe('Movie Card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for movies to load
    await page.waitForSelector('.movie-card', { timeout: 10000 });
  });

  test('should display movie information', async ({ page }) => {
    const firstMovieCard = page.locator('.movie-card').first();
    
    // Check if movie title is visible
    await expect(firstMovieCard.locator('h3')).toBeVisible();
    
    // Check if movie image is visible
    await expect(firstMovieCard.locator('img')).toBeVisible();
    
    // Check if release year is displayed
    await expect(firstMovieCard.locator('text=/Release Year:/')).toBeVisible();
    
    // Check if rating is displayed
    await expect(firstMovieCard.locator('text=/Rating:/')).toBeVisible();
  });

  test('should have favourite button', async ({ page }) => {
    const firstMovieCard = page.locator('.movie-card').first();
    const favouriteButton = firstMovieCard.locator('.favourite-btn');
    
    await expect(favouriteButton).toBeVisible();
    await expect(favouriteButton).toContainText('❤️');
  });

  test('should add movie to favourites', async ({ page }) => {
    const firstMovieCard = page.locator('.movie-card').first();
    const favouriteButton = firstMovieCard.locator('.favourite-btn');
    
    // Get movie title for verification
    const movieTitle = await firstMovieCard.locator('h3').textContent();
    
    // Click favourite button
    await favouriteButton.click();
    
    // Check if button becomes active
    await expect(favouriteButton).toHaveClass(/active/);
    
    // Navigate to favourites page
    await page.locator('text=Favourites').click();
    await page.waitForURL('**/favourites');
    
    // Verify movie is in favourites
    await expect(page.locator(`text=${movieTitle}`)).toBeVisible();
  });

  test('should remove movie from favourites', async ({ page }) => {
    // First, add a movie to favourites
    const firstMovieCard = page.locator('.movie-card').first();
    const favouriteButton = firstMovieCard.locator('.favourite-btn');
    const movieTitle = await firstMovieCard.locator('h3').textContent();
    
    await favouriteButton.click();
    await expect(favouriteButton).toHaveClass(/active/);
    
    // Remove from favourites
    await favouriteButton.click();
    await expect(favouriteButton).not.toHaveClass(/active/);
    
    // Navigate to favourites page
    await page.locator('text=Favourites').click();
    await page.waitForURL('**/favourites');
    
    // Verify movie is not in favourites (should show empty state)
    await expect(page.locator('text=Please add your favourites here...')).toBeVisible();
  });
});
