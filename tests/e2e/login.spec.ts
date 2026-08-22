import { test, expect } from '@playwright/test';

// Overrides the project-wide default (playwright/.auth/admin.json) — this test exercises
// the sign-in form itself, so it must start from a logged-out context.
test.use({ storageState: { cookies: [], origins: [] } });

test('test', async ({ page }) => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  test.skip(!email || !password, 'Set ADMIN_EMAIL and ADMIN_PASSWORD in .env (see .env.example).');

  await page.goto('/signin');
  await page.locator('#username').click();
  await page.locator('#username').fill(email!);
  await page.locator('#username').press('Tab');
  await page.locator('#password').fill(password!);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'QA test for Luiz Neto' }).click();
  await expect(page.getByRole('main')).toContainText(email!);
});
