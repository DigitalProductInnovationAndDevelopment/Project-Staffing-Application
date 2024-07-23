import { test, expect } from '@playwright/test';

test('test that all components on projects overview page is appeared', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByPlaceholder('Your email address').click();
  await page.getByPlaceholder('Your email address').fill('handesy@yilmaz.com');
  await page.getByPlaceholder('Your password').click();
  await page.getByPlaceholder('Your password').fill('0000');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('button', { name: '+ Add Project' })).toBeVisible();
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