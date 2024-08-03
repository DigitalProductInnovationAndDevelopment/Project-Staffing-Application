import { test, expect } from '@playwright/test';

test.describe('Projects Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Initial Login before every test 
    await page.goto('http://localhost:3000/login');
    await page.getByPlaceholder('Your email address').fill('selin@yildiz.com');
    await page.getByPlaceholder('Your password').fill('0000');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('http://localhost:3000/projects');
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

  // Test edit existing project name functionality
  test('should edit an existing project', async ({ page }) => {
    await page.waitForSelector('div:has-text("New Test Project")');
    await page.locator('div').filter({ hasText: /^New Test Project/ }).getByRole('button').click();
    await page.waitForSelector('role=dialog');
    await page.getByRole('dialog').getByText('New Test Project').click();
    await page.getByRole('textbox').first().fill('New Test Project 1');
    await page.getByRole('textbox').first().press('Enter');
    await page.getByRole('button', { name: 'Save & Close' }).click();
    await expect(page.locator('#root')).toContainText('New Test Project 1');
  });

  // Test delete existing project functionality
  test('should delete an existing project', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^New Test Project 1/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'Delete Delete Project' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^New Test Project 1/ })).not.toBeVisible();
  });
}); 