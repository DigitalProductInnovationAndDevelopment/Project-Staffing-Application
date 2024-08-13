import { test, expect } from '@playwright/test';

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); 
  });

  //Test if the login page is loaded correctly & every component is visible
  test('should load the login page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'GREAT STAFF' })).toBeVisible();
    await expect(page.getByRole('heading')).toContainText('GREAT STAFF');
    await expect(page.getByText('Login with your email and')).toBeVisible();
    await expect(page.locator('#root')).toContainText('Login with your email and password');
    await expect(page.locator('form div').filter({ hasText: 'Email' })).toBeVisible();
    await expect(page.locator('form')).toContainText('Email');
    await expect(page.getByText('Email', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Your email address')).toBeVisible();
    await expect(page.locator('form div').filter({ hasText: 'Password' })).toBeVisible();
    await expect(page.getByText('Password', { exact: true })).toBeVisible();
    await expect(page.locator('form')).toContainText('Password');
    await expect(page.getByPlaceholder('Your password')).toBeVisible();
    await expect(page.locator('form div').filter({ hasText: 'Password' }).getByRole('button')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });

    //Test if errors for invalid email & password are displayed correctly    
    test('should display error for empty email and password fields', async ({ page }) => {
        await page.getByPlaceholder('Your email address').click();
        await page.getByPlaceholder('Your email address').fill('');
        await page.getByPlaceholder('Your email address').press('Enter');
        await page.getByPlaceholder('Your password').click();
        await page.getByPlaceholder('Your password').fill('');
        await page.getByPlaceholder('Your password').press('Enter');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByText('Email or password is empty').click();
        await expect(page.locator('form')).toContainText('Email or password is empty');
      });

    // Test for successfull login with valid credentials
    test('should login successfully with valid credentials', async ({ page }) => {
        await page.getByPlaceholder('Your email address').click();
        await page.getByPlaceholder('Your email address').fill('selin@yildiz.com');
        await page.getByPlaceholder('Your password').click();
        await page.getByPlaceholder('Your password').fill('0000');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL('/projects'); 
      });
     
    // Test for error message for incorrect credentials  
    test('should display error for incorrect credentials', async ({ page }) => {
        await page.getByPlaceholder('Your email address').click();
        await page.getByPlaceholder('Your email address').fill('selin@yildiz.com');
        await page.getByPlaceholder('Your password').click();
        await page.getByPlaceholder('Your password').fill('wrongpasswort');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.locator('p').filter({ hasText: 'Login failed. Please check' })).toBeVisible();
      });

    // Test for toggling password visibility
    test('should toggle password visibility', async ({ page }) => {
        await page.getByPlaceholder('Your password').fill('hello');
        await expect(page.getByPlaceholder('Your password')).toBeVisible();
        await page.locator('form div').filter({ hasText: 'Password' }).getByRole('button').click();
        await expect(page.getByPlaceholder('Your password')).toHaveAttribute('type', 'text');
        await page.locator('form div').filter({ hasText: 'Password' }).getByRole('button').click();
        await expect(page.getByPlaceholder('Your password')).toHaveAttribute('type', 'password');
      });

       // Test Logout functionality
    test('should logout successfully', async ({ page }) => {
      await page.getByPlaceholder('Your email address').fill('selin@yildiz.com');
      await page.getByPlaceholder('Your password').fill('0000');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.getByText('Sign Out').click();
      await expect(page).toHaveURL('/login');
    });
});