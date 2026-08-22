import { test, expect } from '@playwright/test';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';
import { uniqueName, uniqueEmail } from '../utils/testData';

const FOUNDATION_ID = process.env.FOUNDATION_ID;

test.describe('Admin Settings > Add Team Member', () => {
  test.beforeEach(async ({ page }) => {
    if (!FOUNDATION_ID) throw new Error('Set FOUNDATION_ID in .env (see .env.example).');
    const adminSettings = new AdminSettingsPage(page);
    await page.goto(`/foundation/${FOUNDATION_ID}`);
    await adminSettings.openViaMenu();
  });

  test('creates a team member with Admin Access', async ({ page }) => {
    const adminSettings = new AdminSettingsPage(page);
    const name = uniqueName();
    const email = uniqueEmail();

    const countBefore = await adminSettings.teamCount();

    await adminSettings.openAddTeamMemberModal();
    await adminSettings.fillTeamMemberForm({ name, email, accessType: 'Admin Access' });
    await adminSettings.submitAddTeamMember();

    const row = adminSettings.teamRowByEmail(email);
    await expect(row).toBeVisible();
    await expect(row).toContainText('Admin');
    await expect(async () => {
      expect(await adminSettings.teamCount()).toBe(countBefore + 1);
    }).toPass();
  });

  test('blocks submission when Name and Email are blank', async ({ page }) => {
    const adminSettings = new AdminSettingsPage(page);

    await adminSettings.openAddTeamMemberModal();
    await adminSettings.submitAddTeamMember();

    await adminSettings.expectErrorMessage(/name is required/i);
    await adminSettings.expectErrorMessage(/email is required/i);
  });

  test('blocks submission for a malformed email address', async ({ page }) => {
    const adminSettings = new AdminSettingsPage(page);
    const name = uniqueName();

    await adminSettings.openAddTeamMemberModal();
    await adminSettings.fillTeamMemberForm({ name, email: 'not-an-email', accessType: 'User Access' });
    await adminSettings.submitAddTeamMember();

    await adminSettings.expectErrorMessage(/please enter a valid email address/i);
  });

  test('does not overwrite an existing team member when the same email is resubmitted', async ({ page }) => {
    test.fail(
      true,
      'BUG01: duplicate email silently overwrites the existing member (clears Title, downgrades Admin -> User) instead of being rejected. See docs/bugs/BUG01-duplicate-email-overwrites-existing-team-member.md'
    );

    const adminSettings = new AdminSettingsPage(page);
    const originalName = uniqueName('Original');
    const email = uniqueEmail();

    await adminSettings.openAddTeamMemberModal();
    await adminSettings.fillTeamMemberForm({ name: originalName, email, accessType: 'Admin Access' });
    await adminSettings.submitAddTeamMember();

    const row = adminSettings.teamRowByEmail(email);
    await expect(row).toContainText('Admin');
    const countBefore = await adminSettings.teamCount();

    await adminSettings.openAddTeamMemberModal();
    await adminSettings.fillTeamMemberForm({ name: 'Duplicate Attempt', email, accessType: 'User Access' });
    await adminSettings.submitAddTeamMember();

    await adminSettings.expectErrorMessage(/already exists/i);
    await expect(row).toContainText('Admin');
    await expect(row).toContainText(originalName);
    expect(await adminSettings.teamCount()).toBe(countBefore);
  });
});
