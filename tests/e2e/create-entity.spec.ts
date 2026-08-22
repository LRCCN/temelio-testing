import { test, expect } from '@playwright/test';
import { ContactsPage } from '../pages/ContactsPage';
import { uniqueName, uniqueEmail } from '../utils/testData';

// A search term expected to return at least one existing "every.org" match in the
// Find Entity source. See ContactsPage.selectFirstFindEntityResult for the flakiness note.
const ORG_SEARCH_TERM = process.env.ORG_SEARCH_TERM || 'Test';

const FOUNDATION_ID = process.env.FOUNDATION_ID;

test.describe('Contacts > Create Entity', () => {
  test.beforeEach(async ({ page }) => {
    if (!FOUNDATION_ID) throw new Error('Set FOUNDATION_ID in .env (see .env.example).');
    const contacts = new ContactsPage(page);
    await page.goto(`/foundation/${FOUNDATION_ID}`);
    await contacts.gotoGrantees();
  });

  test('auto-populates Organization Name and EIN from a Find Entity search result', async ({ page }) => {
    const contacts = new ContactsPage(page);

    await contacts.openNewEntityModal();
    await contacts.searchFindEntity(ORG_SEARCH_TERM);
    await contacts.selectFirstFindEntityResult(ORG_SEARCH_TERM);

    await expect(contacts.entityNameInput).not.toHaveValue('');
    await expect(contacts.einInput).not.toHaveValue('');

    await contacts.submitCreateContact();
    await contacts.expectToastMessage(/contact created/i);
  });

  test('creates an entity via manual Entity Name entry, no Find Entity search', async ({ page }) => {
    // scrollUntilCount's multi-pass retry (to absorb list-indexing lag) can approach the
    // default 30s test timeout under load.
    test.setTimeout(45_000);

    const contacts = new ContactsPage(page);
    const entityName = uniqueName('Manual-Entity');

    await contacts.openNewEntityModal();
    await contacts.fillNewEntityForm({ entityName });
    await contacts.submitCreateContact();
    await contacts.expectToastMessage(/contact created/i);

    await contacts.gotoGrantees();
    await contacts.scrollUntilCount(contacts.entityRowByName(entityName), 1);
    await expect(contacts.entityRowByName(entityName)).toBeVisible();
  });

  test('blocks submission when Entity Name is blank', async ({ page }) => {
    const contacts = new ContactsPage(page);

    await contacts.openNewEntityModal();
    await contacts.fillNewEntityForm({
      primaryContactName: 'Test',
      primaryContactEmail: uniqueEmail(),
    });
    await contacts.submitCreateContact();

    await contacts.expectErrorBanner(/legal name must be specified/i);
  });

  test('blocks submission for a malformed Primary Contact Email', async ({ page }) => {
    test.fail(
      true,
      'BUG05: Primary Contact Email on the New Entity form accepts malformed addresses with no validation, unlike Admin Settings > Add Team Member. See docs/bugs/BUG05-entity-primary-contact-email-not-validated.md'
    );

    const contacts = new ContactsPage(page);
    const entityName = uniqueName('Invalid-Email-Entity');

    await contacts.openNewEntityModal();
    await contacts.fillNewEntityForm({
      entityName,
      primaryContactName: 'Test',
      primaryContactEmail: '-@hotmail.com',
    });
    await contacts.submitCreateContact();

    await expect(page.getByText(/valid email/i)).toBeVisible();
    await contacts.gotoGrantees();
    await expect(contacts.entityRowByName(entityName)).toHaveCount(0);
  });

  test('creating an entity with the same Entity Name and EIN as an existing one is currently allowed', async ({ page }) => {
    // The wider waitForEntityRowCount budget (up to ~12s of rescanning per check, to
    // absorb CI's slower list-indexing lag) can approach the default 30s test timeout.
    test.setTimeout(60_000);

    const contacts = new ContactsPage(page);
    const entityName = uniqueName('Duplicate-Entity');
    const ein = '85-0000001';

    await contacts.openNewEntityModal();
    await contacts.fillNewEntityForm({ entityName, ein });
    await contacts.submitCreateContact();
    await contacts.expectToastMessage(/contact created/i);

    await contacts.gotoGrantees();
    expect(await contacts.waitForEntityRowCount(entityName, 1)).toBe(1);

    await contacts.openNewEntityModal();
    await contacts.fillNewEntityForm({ entityName, ein });
    await contacts.submitCreateContact();
    await contacts.expectToastMessage(/contact created/i);

    await contacts.gotoGrantees();
    expect(await contacts.waitForEntityRowCount(entityName, 2)).toBe(2);
  });
});
