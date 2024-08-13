import { test, expect } from '@playwright/test';

test.describe('Projects Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Initial Login before every test 
    await page.goto('/login');
    await page.getByPlaceholder('Your email address').fill('admin@email.com');
    await page.getByPlaceholder('Your password').fill('A86b#s5g@k');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/projects');
  });

  // Test visibility of Project Page components 
  test('should load the projects page', async ({ page }) => {
    await expect(page.getByText('GREAT STAFF')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects Projects' })).toBeVisible();
    await expect(page.getByText('Current ProjectsPROJECT')).toBeVisible();
    await expect(page.getByText('Current Projects')).toBeVisible();
    await expect(page.getByText('PROJECT TITLE')).toBeVisible();
    await expect(page.getByText('ALLOCATED FTEs')).toBeVisible();
    await expect(page.getByText('DEMAND')).toBeVisible();
    await expect(page.getByText('ASSIGN')).toBeVisible();
    await expect(page.getByText('STAFFING RATE')).toBeVisible();
    await expect(page.getByText('PRIORITY')).toBeVisible();
    await expect(page.getByText('START DATE')).toBeVisible();
    await expect(page.getByText('EDIT')).toBeVisible();
    });

  // Test add New Test Project functionality
  test('should add a New Test Project', async ({ page }) => {
    await expect(page.getByRole('button', { name: '+ Add Project' })).toBeVisible();
    await page.getByRole('button', { name: '+ Add Project' }).click();
    await page.getByText('Click & Enter Project Name').click();
    await page.getByRole('textbox').first().fill('New Test Project');
    await page.getByLabel('Normal').check();
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Stockholm' }).click();
    await page.getByRole('button', { name: 'Create & Close' }).click();
    await expect(page.locator('#root')).toContainText('New Test Project');
  });

}); 