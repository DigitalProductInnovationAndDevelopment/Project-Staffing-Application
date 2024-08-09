import { test, expect } from '@playwright/test';

test.describe('Employee Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Initial Login before every test 
    await page.goto('http://localhost:3000/login');
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

  // Test add new employee functionality
  test('should add a new employee', async ({ page }) => {
    await expect(page.getByRole('button', { name: '+ Add Employee' })).toBeVisible();
    await page.getByRole('button', { name: '+ Add Employee' }).click();
    await page.getByText('Click & Enter Employee Name').click();
    await page.getByRole('textbox').fill('New Employee');
    await page.getByText('Click & Enter email').click();
    await page.getByText('Click & Enter email').click();
    await page.getByRole('textbox').fill('new@employee.com');
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Munich' }).click();
    await page.getByRole('button', { name: 'Create & Close' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('#root')).toContainText('New Employee');
    await expect(page.locator('#root')).toContainText('Munich');
  });

  // Test edit existing employee functionality
  test('should edit an existing employee', async ({ page }) => {
    await page.waitForSelector('div:has-text("New Employee")');
    await page.locator('div').filter({ hasText: /^New Employee/ }).getByRole('button').click();
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Stockholm' }).click();
    await page.getByRole('dialog').getByText('New Employee').click();
    await page.getByRole('textbox').fill('New Employee 1');
    await page.getByRole('textbox').press('Enter');
    await page.getByRole('button', { name: 'Save & Close' }).click();
    await expect(page.locator('#root')).toContainText('Stockholm');
    await expect(page.locator('#root')).toContainText('New Employee 1');
  });

  // Test delete existing employee functionality
  test('should delete an existing employee', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^New Employee 1/ }).getByRole('button').click();
    await page.getByRole('button', { name: 'Delete Delete Profile' }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('div').filter({ hasText: /^New Employee 1/ })).not.toBeVisible();
  }); 
});


