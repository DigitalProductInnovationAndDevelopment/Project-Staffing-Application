import { test, expect } from '@playwright/test';

test.describe('Profiles Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Initial Login before every test 
    await page.goto('http://localhost:3000/login');
    await page.getByPlaceholder('Your email address').fill('selin@yildiz.com');
    await page.getByPlaceholder('Your password').fill('0000');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: '+ Add Project' }).click();
    await page.getByText('Click & Enter Project Name').click();
    await page.getByRole('textbox').first().fill('New Profile Project');
    await page.getByLabel('Normal').check();
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Stockholm' }).click();
    await page.getByRole('button', { name: 'Create & Close' }).click();
    await page.waitForSelector('div:has-text("New Profile Project")');
    await page.locator('div').filter({ hasText: /^New Profile Project/ }).getByRole('button').click();
    await page.getByLabel('New Profile Name').click();
    await page.getByLabel('New Profile Name').fill('New Test Profile');
    await page.getByText('Number of FTEs').click();
    await page.getByRole('option', { name: '1', exact: true }).click();
    await page.locator('.MuiSlider-thumb').first().click();
    await page.locator('div:nth-child(4) > .MuiSlider-root').click();
    await page.getByRole('button', { name: 'ADD' }).click();
  });

  // Test adding a profile to project
  test('should add a profile to project', async ({ page }) => {
    await expect(page.getByText('Profiles on this Project')).toBeVisible();
    await expect(page.getByText('New Test Profile')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete Delete', exact: true })).toBeVisible();
  });

  // Test editing a profile
  test('should edit profile on project', async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for this test
    await page.waitForSelector('div:has-text("New Profile Project")');
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('New Profile Name').click();
    await page.getByLabel('New Profile Name').fill('New Test Profile 1');
    await page.getByText('1', { exact: true }).click();
    await page.getByRole('option', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: 'SAVE', exact: true }).click();
    await expect(page.getByText('New Test Profile 1')).toBeVisible();
    await expect(page.getByText('2 Instances')).toBeVisible();
  });

  // Test deleting a profile 
  test('should delete profile on project', async ({ page }) => {
    await page.getByRole('button', { name: 'Delete Delete', exact: true }).click();
    await page.waitForTimeout(3000);
    await expect(page.getByText('No profiles available.')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Delete Delete Project' }).click();
  });
}); 
