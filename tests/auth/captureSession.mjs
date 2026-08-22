// One-time session capture, run via `npm run auth:admin` / `npm run auth:user`.
// Not a Playwright test (deliberately outside tests/**/*.spec.ts) so it never runs as
// part of the regular suite and never requires credentials to be set for `npm test`.
//
// The /signin form was confirmed live to be a plain email/password form (not a Google
// OAuth redirect), so it can be scripted directly rather than requiring a human to
// click through Google's consent screen.
import 'dotenv/config';
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const role = process.argv[2];

if (role !== 'admin' && role !== 'user') {
  console.error('Usage: node tests/auth/captureSession.mjs <admin|user>');
  process.exit(1);
}

const prefix = role.toUpperCase();
const email = process.env[`${prefix}_EMAIL`];
const password = process.env[`${prefix}_PASSWORD`];

if (!email || !password) {
  console.error(`Set ${prefix}_EMAIL and ${prefix}_PASSWORD in .env before running "npm run auth:${role}".`);
  process.exit(1);
}

const baseURL = process.env.BASE_URL || 'https://app-dev.trytemelio.com/';
const outFile = path.join(__dirname, '..', '..', 'playwright', '.auth', `${role}.json`);

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

try {
  await page.goto(new URL('/signin', baseURL).toString());
  await page.locator('#username').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForLoadState('networkidle');

  await page.context().storageState({ path: outFile });
  console.log(`Saved ${role} session to ${outFile}`);
} finally {
  await browser.close();
}
