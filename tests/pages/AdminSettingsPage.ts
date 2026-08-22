import { Page, Locator, expect } from '@playwright/test';

export type AccessType = 'User Access' | 'Admin Access' | 'Payments Access' | 'Board Member Access';

export interface TeamMemberFormInput {
  name: string;
  email: string;
  accessType?: AccessType;
  title?: string;
}

export class AdminSettingsPage {
  constructor(private readonly page: Page) {}

  private get addTeamMemberDialog(): Locator {
    return this.page.getByRole('alertdialog', { name: 'Add Team Member' });
  }

  /** Foundation menu (double-arrow button) > "Admin Settings" > "Admin" tab. */
  async openViaMenu() {
    await this.page.getByRole('button', { name: 'Open entity switcher' }).click();
    await this.page.getByRole('menuitem', { name: 'Admin Settings' }).click();
    await this.page.getByRole('link', { name: 'Admin', exact: true }).click();
  }

  async openViaDirectUrl(foundationId: string) {
    await this.page.goto(`/foundation/${foundationId}/settings/admin`);
  }

  /** Parses the "Team (N)" heading into N. */
  async teamCount(): Promise<number> {
    const heading = this.page.getByRole('heading', { name: /Team \(\d+\)/ });
    const text = await heading.textContent();
    const match = text?.match(/\((\d+)\)/);
    if (!match) throw new Error(`Could not parse team count from heading text: "${text}"`);
    return Number(match[1]);
  }

  async openAddTeamMemberModal() {
    await this.page.getByRole('button', { name: 'Team Member' }).click();
    await expect(this.addTeamMemberDialog).toBeVisible();
  }

  async fillTeamMemberForm({ name, email, accessType, title }: TeamMemberFormInput) {
    const dialog = this.addTeamMemberDialog;
    if (name) await dialog.getByRole('textbox', { name: 'Name', exact: true }).fill(name);
    if (email) await dialog.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
    if (title) await dialog.getByRole('textbox', { name: 'Title', exact: true }).fill(title);
    if (accessType) await dialog.getByRole('combobox', { name: 'Access Type' }).selectOption(accessType);
  }

  async submitAddTeamMember() {
    await this.addTeamMemberDialog.getByRole('button', { name: 'Add', exact: true }).click();
  }

  async cancelAddTeamMember() {
    await this.addTeamMemberDialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  }

  /** Row (all cells) for a team member with the given email, for content/permission assertions. */
  teamRowByEmail(email: string): Locator {
    return this.page.locator('[data-row="true"]').filter({ hasText: email });
  }

  async expectErrorMessage(pattern: RegExp) {
    await expect(this.addTeamMemberDialog.getByText(pattern)).toBeVisible();
  }
}
