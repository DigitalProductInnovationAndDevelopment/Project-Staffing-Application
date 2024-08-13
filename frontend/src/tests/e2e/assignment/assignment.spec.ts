import { test, expect } from '@playwright/test';

test.describe('Assignment Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Initial Login before every test + add project
    await page.goto('/login');
    await page.getByPlaceholder('Your email address').fill('admin@email.com');
    await page.getByPlaceholder('Your password').fill('A86b#s5g@k');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  test('should display all components in assign project page', async ({ page }) => {
    //Add project
    await page.getByRole('button', { name: '+ Add Project' }).click();
    await page.getByText('Click & Enter Project Name').click();
    await page.getByRole('textbox').first().fill('New Project');
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

    //Test components on assign page
    await page.getByRole('link', { name: 'Projects Projects' }).click();
    await page.waitForSelector('div:has-text("New Project")');
    await page.locator('div').filter({ hasText: /^New Project/ }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Assign' }).click();
    await page.waitForSelector('role=dialog');
    await expect(page.getByText('Staffed Profiles')).toBeVisible();
    await expect(page.getByText('Target Skillsets')).toBeVisible();
    await expect(page.getByText('Target Points')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save & Close' })).toBeVisible();
    await expect(page.getByText('Assigned for Profile')).toBeVisible();

    //await expect(page.getByText('Suitable Employees')).toBeVisible();
    await expect(page.getByText('New Assign Employee 1')).toBeVisible();

    await page.getByRole('button', { name: 'Save & Close' }).click();

    //Delete Project
    //await page.waitForSelector('div:has-text("New Project")');
    await page.locator('div').filter({ hasText: /^New Project/ }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.waitForSelector('role=dialog');
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^New Project/ })).not.toBeVisible();

    //Delete Employee
    await page.getByRole('link', { name: 'Employees Employees' }).click();
    await page.getByRole('row', { name: 'New Assign Employee 1 new@' }).getByRole('button').click();
    await page.getByRole('button', { name: 'Delete Delete Profile' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^New Assign Employee 1/ })).not.toBeVisible();
  });

}); 