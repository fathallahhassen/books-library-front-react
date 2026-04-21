import {test, expect} from '@playwright/test';

test.describe('Books Library App', () => {
    test('loads the main page', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Books/);
    });

    test('shows books list page', async ({page}) => {
        await page.goto('/');
        await expect(page.getByRole('heading', {name: /^Books$/i})).toBeVisible();
    });

    test('search bar is present', async ({page}) => {
        await page.goto('/');
        await expect(page.locator('input[placeholder="Search books..."]')).toBeVisible();
    });

    test('can navigate to saved books', async ({page}) => {
        await page.goto('/books/saved');
        await expect(page.getByRole('heading', {name: /Saved Books/i})).toBeVisible();
    });

    test('shows view selection button', async ({page}) => {
        await page.goto('/');
        await expect(page.getByRole('button', {name: /View selection/i})).toBeVisible();
    });
});
