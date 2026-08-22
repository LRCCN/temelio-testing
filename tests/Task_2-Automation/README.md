# Task 2 — Automation: Setup & Run

Playwright + TypeScript suite automating 10 of the 25 scenarios in
`tests/Task_1-Manual Testing/test-cases-admin-settings-contacts.md`. See
`test-cases-automation-admin-settings-contacts.md` in this folder for the scenario-by-scenario
mapping (what each spec does, and how to read a pass/fail).

## Layout

```
tests/
  pages/              AdminSettingsPage, ContactsPage — thin wrappers over the app's controls
  utils/testData.ts   uniqueName()/uniqueEmail() — fresh data per run, no fixed-record collisions
  auth/captureSession.mjs   one-time login script (see Setup, step 3)
  e2e/
    add-team-member.spec.ts   TC01, TC04, TC05, TC06
    permissions.spec.ts       TC12
    create-entity.spec.ts     TC13, TC14, TC17, TC18, TC19
    login.spec.ts             pre-existing exploratory login spec (not part of Task 2 scope)
```

## Setup

1. `npm install`
2. `npx playwright install --with-deps chromium`
3. Copy `.env.example` to `.env` and fill in `BASE_URL`, `FOUNDATION_ID`, and the
   `ADMIN_EMAIL`/`ADMIN_PASSWORD` (and, for TC12, `USER_EMAIL`/`USER_PASSWORD`) credentials for
   the two accounts described below.
4. `npm run auth:admin` and, if you want TC12 to run, `npm run auth:user`. Each opens a real
   (headed) browser, logs in, and saves the session to `playwright/.auth/admin.json` /
   `playwright/.auth/user.json`. These files (and `.env`) are gitignored — never commit them.
   Re-run the relevant script whenever a session expires (see BUG06) or a test fails on an
   auth redirect instead of the assertion under test.

You need two accounts in the target foundation: one with **Admin Access** (`ADMIN_*`, used by
every spec except TC12) and one with **User Access or Payments Access** (`USER_*`, used only by
TC12, which is skipped automatically if `USER_EMAIL`/`USER_PASSWORD` — and therefore
`user.json` — aren't set up).

## Run

- `npm test` — full suite, headless.
- `npm run test:headed` — same, with a visible browser.
- `npm run test:ui` — Playwright's interactive UI mode (best for debugging one spec at a time).
- `npx playwright test tests/e2e/create-entity.spec.ts` — a single file.
- `npx playwright show-report` — open the HTML report from the last run.

TC04, TC05, TC13, TC14, TC17, and TC19 create real records in the target foundation on every
run (fresh name/email via `testData.ts`, so nothing collides) — this is a live dev environment,
not a mocked one, so expect the Team/Grantees lists to grow with each execution.

### Reading the two `test.fail()` specs

TC06 ("does not overwrite...") and TC18 ("blocks submission for a malformed Primary Contact
Email") assert the *spec-compliant* behavior, which the app does not currently implement
(BUG01, BUG05). They're wrapped in `test.fail(true, reason)`, so a normal run shows them with a
✘ next to an otherwise-green summary — that's Playwright confirming the bug is still present.
If either bug gets fixed, Playwright will report that test as an **unexpected pass**, which is
the signal to remove the `test.fail()` wrapper and treat it as a normal regression test.

## Known gaps / notes

- **Auth mechanism differs from the original plan.** The scenario doc assumes Temelio's login
  is Google-SSO-only and therefore unscriptable. Live testing against `app-dev.trytemelio.com`
  showed `/signin` is a plain email/password form (`#username`/`#password`, no OAuth redirect),
  so `captureSession.mjs` scripts it directly instead of requiring a human to click through a
  Google consent screen. It's still a manual, one-time step (`npm run auth:admin`/`auth:user`)
  rather than an automatic dependency of every run, so a stale/expired session never silently
  re-authenticates with stored secrets.
- **TC13's Find Entity result selection is a best-effort text match**
  (`ContactsPage.selectFirstFindEntityResult`), not a fixed `data-pw`/role selector — the result
  list's exact markup wasn't available ahead of time. If `ORG_SEARCH_TERM` (default `"Test"`)
  stops returning a match in the underlying every.org-backed source, this test will time out
  waiting for a result rather than fail on an assertion.
- Only 10 of 25 manually-documented scenarios are automated; see the coverage table at the
  bottom of `test-cases-automation-admin-settings-contacts.md` for what's out of scope here.
