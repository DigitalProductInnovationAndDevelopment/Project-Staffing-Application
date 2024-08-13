import { test, expect } from '@playwright/test';

test.describe('Employee Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Initial Login before every test 
    await page.goto('/login');
    await page.getByPlaceholder('Your email address').fill('selin@yildiz.com');
    await page.getByPlaceholder('Your password').fill('0000');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Employees Employees' }).click();
  });

  // Test visibility of Employee Page components 
  test('should load the employees page', async ({ page }) => {
    await expect(page.getByText('GREAT STAFF')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Employees Employees' })).toBeVisible();
    await expect(page.getByText('Employee Overview')).toBeVisible();
    await expect(page.getByText('PERSON')).toBeVisible();
    await expect(page.getByText('# PROJECTS')).toBeVisible();
    await expect(page.getByText('Technology')).toBeVisible();
    await expect(page.getByText('Solution Engineering')).toBeVisible();
    await expect(page.getByText('Self Management')).toBeVisible();
    await expect(page.getByText('Communication')).toBeVisible();
    await expect(page.getByText('Employee Leadership')).toBeVisible();
    await expect(page.getByText('LOCATION')).toBeVisible();
    await expect(page.getByText('EDIT')).toBeVisible();
  });
  
});


