import { test, expect } from '@playwright/test';

test.describe('Projects Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Initial Login before every test 
    await page.goto('http://localhost:3000/login');
    await page.getByPlaceholder('Your email address').fill('selin@yildiz.com');
    await page.getByPlaceholder('Your password').fill('0000');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: '+ Add Project' }).click();
    await page.getByText('Click & Enter Project Name').click();
    await page.getByRole('textbox').first().fill('New Project');
    await page.getByLabel('Normal').check();
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Stockholm' }).click();
    await page.getByRole('button', { name: 'Create & Close' }).click();
  });

  test('should display all components in assign project page', async ({ page }) => {
    await page.waitForSelector('div:has-text("New Project")');
    await page.locator('div').filter({ hasText: /^New Project/ }).getByRole('button').click();
    await page.waitForSelector('role=dialog');
    await expect(page.getByRole('tab', { name: 'Overview OVERVIEW' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Assign Team ASSIGN TEAM' })).toBeVisible();
    await page.getByRole('tab', { name: 'Assign Team ASSIGN TEAM' }).click();
    await expect(page.getByText('Staffed Profiles')).toBeVisible();
    await expect(page.getByText('Target Skillsets')).toBeVisible();
    await expect(page.getByText('Target Points')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save & Close' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete Delete Project' })).toBeVisible();
    await expect(page.getByText('Assigned for Profile')).toBeVisible();
    });

    test('should test assignment process', async ({ page }) => {
        //Add employee
        await page.getByRole('button', { name: '+ Add Employee' }).click();
        await page.getByText('Click & Enter Employee Name').click();
        await page.getByRole('textbox').fill('New Employee');
        await page.getByText('Click & Enter email').click();
        await page.getByText('Click & Enter email').click();
        await page.getByRole('textbox').fill('new@employee.com');
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: 'Munich' }).click();
        await page.getByRole('button', { name: 'Create & Close' }).click();

        //Assign Employee
        await page.getByRole('link', { name: 'Projects Projects' }).click();
        await page.locator('div').filter({ hasText: /^New Project/ }).getByRole('button').click();
        await page.getByRole('tab', { name: 'Assign Team ASSIGN TEAM' }).click();
        await page.getByRole('combobox').click();

        //Delte Employee
        await page.getByRole('link', { name: 'Employees Employees' }).click();
        await page.locator('div').filter({ hasText: /^New Employee 1/ }).getByRole('button').click();
        await page.getByRole('button', { name: 'Delete Delete Profile' }).click();
        });


  // Delete Project after every test
  test.afterEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Delete Delete Project' }).click();
  });
}); 