import { test, expect } from '@playwright/test';

test.describe('Assignment Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Initial Login before every test + add project
    await page.goto('/login');
    await page.getByPlaceholder('Your email address').fill('selin@yildiz.com');
    await page.getByPlaceholder('Your password').fill('0000');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: '+ Add Project' }).click();
    await page.getByText('Click & Enter Project Name').click();
    await page.getByRole('textbox').first().fill('New Assign Project');
    await page.getByLabel('Normal').check();
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Stockholm' }).click();
    await page.getByLabel('New Profile Name').click();
    await page.getByLabel('New Profile Name').fill('New Assign Profile');
    await page.getByText('Number of FTEs').click();
    await page.getByRole('option', { name: '2', exact: true }).click();
    await page.locator('.MuiSlider-thumb').first().click();
    await page.locator('div:nth-child(4) > .MuiSlider-root').click();
    await page.getByRole('button', { name: 'ADD' }).click();
    await page.getByRole('button', { name: 'Create & Close' }).click();

    //Add employee
    await page.getByRole('link', { name: 'Employees Employees' }).click();
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await page.getByText('Click & Enter Employee Name').click();
    await page.getByRole('textbox').fill('New Assign Employee 1');
    await page.getByText('Click & Enter email').click();
    await page.getByText('Click & Enter email').click();
    await page.getByRole('textbox').fill('new@employee1.com');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Munich' }).click();
    await page.getByRole('button', { name: 'Create & Close' }).click();
  });

  test('should display all components in assign project page', async ({ page }) => {
    await page.getByRole('link', { name: 'Projects Projects' }).click();
    await page.waitForSelector('div:has-text("New Assign Project")');
    await page.locator('div').filter({ hasText: /^New Assign Project/ }).getByRole('button').click();
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

    await expect(page.getByText('Suitable Employees')).toBeVisible();
    await expect(page.getByText('New Assign Employee 1')).toBeVisible();

    await page.getByRole('button', { name: 'Save & Close' }).click();
  });

  test('should test assignment process', async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for this test
    await page.getByRole('link', { name: 'Projects Projects' }).click();
      
    //Assign Employee
    await page.getByRole('link', { name: 'Projects Projects' }).click();
    await page.locator('div').filter({ hasText: /^New Assign Project/ }).getByRole('button').click();
    await page.getByRole('tab', { name: 'Assign Team ASSIGN TEAM' }).click();
    await page.getByRole('combobox').click();

    /*
    await expect(page.locator('div:nth-child(2) > div:nth-child(8) > .MuiButtonBase-root')).toBeVisible();
    await page.locator('div:nth-child(2) > div:nth-child(8) > .MuiButtonBase-root').click();
    await expect(page.getByText('Assigned profiles (1)')).toBeVisible();
    await expect(page.getByText('New test Employee 1')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Remove' })).toBeVisible();
    await page.getByRole('img', { name: 'Remove' }).click();
    await expect(page.getByText('Assignment for the profile')).toBeVisible();
    await expect(page.getByText('Assigned profiles (0)')).toBeVisible();
    await page.locator('div').filter({ hasText: 'Start / Projects / Edit ProjectEdit ProjectNew Assign ProjectOVERVIEWASSIGN' }).nth(3).click();
    await page.getByRole('button', { name: 'Save & Close' }).click();
    await page.locator('div').filter({ hasText: /^New Assign Project1 FTENot Started0%normal0 Days left$/ }).getByRole('button').click();
    await page.getByRole('tab', { name: 'Assign Team ASSIGN TEAM' }).click();
    await page.locator('div').filter({ hasText: 'Start / Projects / Edit ProjectEdit ProjectNew Assign ProjectOVERVIEWASSIGN' }).nth(1).click();
    */

  });


  // Delete Project after every test
  test.afterEach(async ({ page }) => {
    //Delete Employee
    await page.getByRole('link', { name: 'Employees Employees' }).click();
    await page.locator('div').filter({ hasText: /^New Assign Employee 1/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'Delete Delete Profile' }).click();

    //Delete Project
    await page.getByRole('link', { name: 'Projects Projects' }).click();
    await page.locator('div').filter({ hasText: /^New Assign Project/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'Delete Delete Project' }).click();
  });
}); 