import { Page, Locator, expect } from '@playwright/test';

// CI runners have been observed needing meaningfully longer than a local machine for a
// just-created row to show up in the Grantees grid — likely a combination of network
// latency to the shared staging backend and its own indexing lag, neither of which
// smarter DOM-querying can shortcut. Scale the retry budgets up accordingly on CI.
const IS_CI = !!process.env.CI;

export interface NewEntityFormInput {
  entityName?: string;
  ein?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  sendEmailInvite?: boolean;
}

export class ContactsPage {
  constructor(private readonly page: Page) {}

  private get createEntityDialog(): Locator {
    return this.page.getByRole('dialog', { name: 'Create New Entity' });
  }

  async gotoGrantees() {
    // Clicking the sidebar link is a no-op when already on this route (same-route SPA
    // navigation doesn't refetch), which left post-creation assertions checking stale,
    // pre-creation data. Force a real reload in that case instead.
    if (/\/contacts\/?$/.test(new URL(this.page.url()).pathname)) {
      await this.page.reload();
    } else {
      await this.page.locator('[data-pw="sidebar_link_contacts_grantees"]').click();
    }
    await expect(this.page.getByRole('heading', { name: 'Contacts' })).toBeVisible();
    // The heading renders before the grid's own async data fetch resolves; wait for at
    // least one row so callers never scan/assert against a still-loading, empty grid.
    await this.page.locator('[data-pw="table-rows"] [data-row="true"]').first().waitFor({ state: 'visible' });
  }

  async openNewEntityModal() {
    await this.page.getByRole('button', { name: 'New Entity' }).click();
    await expect(this.createEntityDialog).toBeVisible();
  }

  async searchFindEntity(term: string) {
    const dialog = this.createEntityDialog;
    await dialog.getByRole('textbox', { name: 'Find Entity' }).fill(term);
    await dialog.getByRole('button', { name: 'Search' }).click();
  }

  /**
   * Clicks the first Find Entity result whose text contains the search term.
   * The exact result-item markup isn't documented anywhere the team could confirm ahead of
   * time, so this is a best-effort text match rather than a fixed data-pw/role selector —
   * flagged in the automated test-cases doc (TC13) as a possible source of flakiness if the
   * "every.org" data source returns nothing for the configured search term.
   */
  async selectFirstFindEntityResult(term: string) {
    const dialog = this.createEntityDialog;
    const result = dialog.getByText(term, { exact: false }).filter({ hasNot: this.page.getByRole('textbox') }).first();
    await result.waitFor({ state: 'visible' });
    await result.click();
  }

  get entityNameInput(): Locator {
    return this.createEntityDialog.getByRole('textbox', { name: 'Entity Name' });
  }

  get einInput(): Locator {
    return this.createEntityDialog.getByRole('textbox', { name: 'EIN' });
  }

  async fillNewEntityForm(input: NewEntityFormInput) {
    const dialog = this.createEntityDialog;
    if (input.entityName) await dialog.getByRole('textbox', { name: 'Entity Name' }).fill(input.entityName);
    if (input.ein) await dialog.getByRole('textbox', { name: 'EIN' }).fill(input.ein);
    if (input.primaryContactName) {
      await dialog.getByRole('textbox', { name: 'Primary Contact Name' }).fill(input.primaryContactName);
    }
    if (input.primaryContactEmail) {
      await dialog.getByRole('textbox', { name: 'Primary Contact Email' }).fill(input.primaryContactEmail);
    }
    if (input.sendEmailInvite) {
      await dialog.getByRole('checkbox', { name: 'Send Email Invite' }).check();
    }
  }

  async submitCreateContact() {
    await this.createEntityDialog.getByRole('button', { name: 'Create Contact' }).click();
  }

  /** Grantees list renders each entity name as a link; count()>1 signals duplicates (TC19). */
  entityRowByName(name: string): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }

  /**
   * The Grantees grid virtualizes rows (a fixed-height scroll container mounts only the
   * rows near the current scroll position), and the account this suite runs against
   * accumulates records across runs, so a freshly created entity isn't guaranteed to be
   * within the initially-rendered window. Scrolls the grid incrementally until `locator`
   * has at least `minCount` matches, retrying full top-to-bottom passes with a delay in
   * between — a single pass isn't always enough to outlast the app's own list
   * fetch/index lag for a just-created row, especially under CI or parallel workers.
   */
  async scrollUntilCount(
    locator: Locator,
    minCount: number,
    passes = IS_CI ? 10 : 5,
    stepsPerPass = 40,
    delayMs = IS_CI ? 3000 : 1200
  ) {
    for (let pass = 0; pass < passes; pass++) {
      await this.page.evaluate(() => {
        let el: HTMLElement | null = document.querySelector('[data-pw="table-rows"]');
        while (el && el.scrollHeight <= el.clientHeight + 1) el = el.parentElement;
        if (el) el.scrollTop = 0;
      });
      await this.page.waitForTimeout(150);

      for (let i = 0; i < stepsPerPass; i++) {
        if ((await locator.count()) >= minCount) return;
        const scrolled = await this.page.evaluate(() => {
          let el: HTMLElement | null = document.querySelector('[data-pw="table-rows"]');
          while (el && el.scrollHeight <= el.clientHeight + 1) {
            el = el.parentElement;
          }
          if (!el) return false;
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) return false;
          el.scrollTop = Math.min(el.scrollTop + el.clientHeight, el.scrollHeight);
          return true;
        });
        if (!scrolled) break;
        await this.page.waitForTimeout(120);
      }

      if ((await locator.count()) >= minCount) return;
      if (pass < passes - 1) await this.page.waitForTimeout(delayMs);
    }
  }

  /**
   * Repeatedly rescans (see countEntityRows) until at least `expectedCount` distinct rows
   * are found, or gives up and returns the best count seen. A single scan can undercount
   * on a slower runner (e.g. CI) if the grid's async fetch/index hasn't caught up with a
   * just-created row yet — that's a slower version of the same lag `gotoGrantees` already
   * waits out for the *first* row, but a full top-to-bottom scan takes long enough that a
   * second or third row can still land mid-scan. Rescanning from scratch (rather than
   * trusting Playwright's test-level retry) avoids creating yet more duplicate entities.
   */
  async waitForEntityRowCount(
    name: string,
    expectedCount: number,
    retries = IS_CI ? 10 : 8,
    delayMs = IS_CI ? 3000 : 1500
  ): Promise<number> {
    let best = 0;
    for (let attempt = 0; attempt <= retries; attempt++) {
      best = Math.max(best, await this.countEntityRows(name));
      if (best >= expectedCount) return best;
      if (attempt < retries) await this.page.waitForTimeout(delayMs);
    }
    return best;
  }

  /**
   * Counts distinct rows matching `name` by scrolling the virtualized grid from top to
   * bottom and accumulating unique row hrefs seen along the way. Needed because two
   * same-named rows (TC19) are never both mounted in the DOM at once — as you scroll past
   * one, it unmounts before the other mounts — so a plain `locator.count()` at any single
   * scroll position can only ever report 0 or 1, even when 2 genuinely exist.
   */
  async countEntityRows(name: string, maxSteps = 60): Promise<number> {
    await this.page.evaluate(() => {
      let el: HTMLElement | null = document.querySelector('[data-pw="table-rows"]');
      while (el && el.scrollHeight <= el.clientHeight + 1) el = el.parentElement;
      if (el) el.scrollTop = 0;
    });
    await this.page.waitForTimeout(150);

    const hrefs = new Set<string>();
    const collect = () =>
      this.page.evaluate(
        (targetName) =>
          [...document.querySelectorAll('a[href*="/nonprofit/"]')]
            .filter((a) => a.textContent?.trim() === targetName)
            .map((a) => a.getAttribute('href')),
        name
      );

    for (let i = 0; i < maxSteps; i++) {
      (await collect()).forEach((href) => href && hrefs.add(href));

      // Overlap consecutive windows by scrolling less than a full page, so a row sitting
      // exactly at a window boundary isn't skipped between two checks.
      const scrolled = await this.page.evaluate(() => {
        let el: HTMLElement | null = document.querySelector('[data-pw="table-rows"]');
        while (el && el.scrollHeight <= el.clientHeight + 1) el = el.parentElement;
        if (!el) return false;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) return false;
        el.scrollTop = Math.min(el.scrollTop + el.clientHeight * 0.6, el.scrollHeight);
        return true;
      });
      if (!scrolled) break;
      await this.page.waitForTimeout(120);
    }

    return hrefs.size;
  }

  async expectToastMessage(pattern: RegExp) {
    await expect(this.page.getByRole('status').filter({ hasText: pattern })).toBeVisible();
  }

  async expectErrorBanner(pattern: RegExp) {
    const banner = this.page.getByRole('status').filter({ hasText: /^Error!/ });
    await expect(banner).toBeVisible();
    await expect(banner).toHaveText(pattern);
  }
}
