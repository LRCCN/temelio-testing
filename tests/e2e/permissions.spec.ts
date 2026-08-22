import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';

const USER_AUTH_FILE = path.join(__dirname, '..', '..', 'playwright', '.auth', 'user.json');

test.describe('Admin Settings > Permissions', () => {
  test.skip(
    !fs.existsSync(USER_AUTH_FILE),
    'playwright/.auth/user.json not found - run "npm run auth:user" first (see .env.example for USER_EMAIL/USER_PASSWORD).'
  );
  test.use({ storageState: USER_AUTH_FILE });

  test('direct navigation to the Admin Settings URL redirects away for User Access', async ({ page }) => {
    const foundationId = process.env.FOUNDATION_ID;
    test.skip(!foundationId, 'FOUNDATION_ID is not set in .env');

    const adminSettings = new AdminSettingsPage(page);
    await adminSettings.openViaDirectUrl(foundationId!);

    // The settings sub-nav tabs (User/Authentication/Admin/...) render as links, not
    // ARIA tabs — confirmed against the live app's Admin Settings page.
    await expect(page.getByRole('link', { name: 'Admin', exact: true })).toHaveCount(0);
    await expect(page).not.toHaveURL(/\/settings\/admin/);
  });
});
