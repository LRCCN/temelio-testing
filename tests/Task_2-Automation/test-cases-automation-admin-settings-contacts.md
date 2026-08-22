# Temelio — Automated Test Cases: Admin Settings Page & Contacts Page

**Modules covered:** Admin Settings / Team Member Management, Grantees / Entities (Contacts Page)
**Source specs:** `docs/specs-functionalities/01_how-to-add-a-team-member`, `docs/specs-functionalities/02_contacts-page`
**Derived from:** `docs/tests/Task 1 - Manual Testing/test-cases-admin-settings-contacts.md`
**Automated with:** Playwright + TypeScript (this folder — see `README.md` for setup/run instructions)

This document re-expresses, in the same template used for Task 1's manual test cases, the
subset of test cases that have been automated. Each TC below states what the automated
suite actually does (the tool call sequence a Playwright test performs), which spec file
implements it, and how to read its result. It is not a duplicate of Task 1 — Task 1 is the
source of truth for the full 25-scenario scope and manual execution results; this document
covers only the 10 scenarios selected for automation (5 per functionality) plus the shared
preconditions the automated suite relies on.

**Shared automation preconditions (apply to every TC below):**
- Dependencies installed (`npm install`) and browsers installed (`npx playwright install --with-deps chromium`).
- `.env` populated from `.env.example` with `BASE_URL` and `FOUNDATION_ID` (for TC12) — no account passwords, since Temelio's login is Google-SSO-only.
- `playwright/.auth/admin.json` and `playwright/.auth/user.json` exist, captured by manually logging in once via `npm run auth:admin` / `npm run auth:user` (each opens a real browser for a one-time Google SSO login, then saves the session). Scripting Google's own login form is not attempted — see README.md "Setup" and "Known gaps."
- Test data (names/emails) is generated per run via `utils/testData.ts` (`uniqueName`/`uniqueEmail`) to avoid collisions with existing records — each run creates fresh records rather than reusing fixed ones.
- If a run fails on an auth redirect rather than the assertion under test, the captured session has likely expired (see **BUG06**) — re-run the relevant `auth:*` script and retry.

---

## Module 1: Admin Settings Page (Team Member Management)

---

### TC01 - Add a team member with Admin Access (happy path)

#### Objective
Automated regression check that a user with Admin Access can invite a new team member and assign the "Admin Access" level.

#### Pre-Conditions
- `admin.json` storage state available (Admin Access session).
- See shared automation preconditions above.

#### Steps

| Id | Action (Playwright) | Expected Result |
|----|--------|------------------|
| 1  | `AdminSettingsPage.openViaMenu()` — click the foundation double-arrow menu, click "Admin Settings," click the "Admin" tab. | Admin Settings/team page is loaded. |
| 2  | Record `teamCount()` (parses the "Team (N)" heading) as `countBefore`. | Baseline count captured. |
| 3  | `openAddTeamMemberModal()` then `fillTeamMemberForm({ name, email, accessType: 'Admin Access' })` with a uniquely generated name/email. | Modal fields are filled. |
| 4  | `submitAddTeamMember()`. | Submission succeeds without a validation error. |
| 5  | Assert `teamRowByEmail(email)` is visible and contains "Admin"; assert `teamCount()` equals `countBefore + 1`. | New row present with correct access level; count incremented by exactly one. |

#### Expected Results
- A new team member row exists with the generated name/email and "Admin Access."

#### Acceptance Criteria
- Test passes (not marked `test.fail()`).
- Implemented in `tests/e2e/add-team-member.spec.ts` ("creates a team member with Admin Access").

---

### TC04 - Attempt to add a team member with required fields empty

#### Objective
Automated check that submitting the Add Team Member form with Name and Email blank is blocked with validation errors.

#### Pre-Conditions
- `admin.json` storage state available.

#### Steps

| Id | Action (Playwright) | Expected Result |
|----|--------|------------------|
| 1  | `openAddTeamMemberModal()`. | Modal opens; fields are empty. |
| 2  | `submitAddTeamMember()` without filling any field. | Submission is blocked. |
| 3  | `expectErrorMessage(/name is required/i)`. | "Name is required" text is visible. |
| 4  | `expectErrorMessage(/email is required/i)`. | "Email is required" text is visible. |

#### Expected Results
- No team member is created; both required-field errors are asserted visible.

#### Acceptance Criteria
- Test passes (not marked `test.fail()`).
- Implemented in `tests/e2e/add-team-member.spec.ts` ("blocks submission when Name and Email are blank").

---

### TC05 - Attempt to add a team member with an invalid email format

#### Objective
Automated check that a malformed email (`not-an-email`) is rejected on submission.

#### Pre-Conditions
- `admin.json` storage state available.

#### Steps

| Id | Action (Playwright) | Expected Result |
|----|--------|------------------|
| 1  | `openAddTeamMemberModal()` then `fillTeamMemberForm({ name, email: 'not-an-email', accessType: 'User Access' })`. | Fields accept the (invalid) input. |
| 2  | `submitAddTeamMember()`. | Submission is blocked. |
| 3  | `expectErrorMessage(/please enter a valid email address/i)`. | Invalid-email error text is visible. |

#### Expected Results
- No team member is created with the malformed email.

#### Acceptance Criteria
- Test passes (not marked `test.fail()`).
- Implemented in `tests/e2e/add-team-member.spec.ts` ("blocks submission for a malformed email address").

---

### TC06 - Attempt to add a team member with an email already in use

#### Objective
Regression test asserting the **expected** (spec-compliant) behavior for duplicate emails — reject with a duplicate error and leave the original record untouched.

#### Pre-Conditions
- `admin.json` storage state available.
- Test currently fails against the real app by design (see Acceptance Criteria) — this documents **BUG01**.

#### Steps

| Id | Action (Playwright) | Expected Result |
|----|--------|------------------|
| 1  | Create an original Admin Access member with a unique email via `fillTeamMemberForm` + `submitAddTeamMember`. | Row created and contains "Admin". Baseline count captured. |
| 2  | `openAddTeamMemberModal()` again; `fillTeamMemberForm({ name: 'Duplicate Attempt', email: <same email>, accessType: 'User Access' })`. | Fields accept the duplicate email. |
| 3  | `submitAddTeamMember()`. | *(Expected)* submission is blocked. |
| 4  | `expectErrorMessage(/already exists/i)`; assert the row for that email still shows "Admin" and the original name; assert `teamCount()` unchanged. | *(Expected)* no duplicate created, original record intact. |

#### Expected Results
- Per spec: no duplicate row, error shown, original member untouched.
- Actual (current app behavior, per BUG01): the email is silently reassigned/overwritten instead of being rejected.

#### Acceptance Criteria
- Test is wrapped in `test.fail(true, ...)` — Playwright expects it to fail and will flag it (as a newly-passing test) if BUG01 is fixed.
- Implemented in `tests/e2e/add-team-member.spec.ts` ("does not overwrite an existing team member when the same email is resubmitted").
- Related: `docs/bugs/BUG01-duplicate-email-overwrites-existing-team-member.md`.

---

### TC12 - Verify non-Admin users cannot access team member management

#### Objective
Automated permission-boundary check that a User Access session cannot reach the Admin Settings team-management screen via direct URL navigation.

#### Pre-Conditions
- `user.json` storage state available (User Access session, via `test.use({ storageState: 'playwright/.auth/user.json' })`).
- `FOUNDATION_ID` environment variable set (test is skipped via `test.skip` if absent).

#### Steps

| Id | Action (Playwright) | Expected Result |
|----|--------|------------------|
| 1  | `AdminSettingsPage.openViaDirectUrl(FOUNDATION_ID)` — navigates directly to `/foundation/{id}/settings/admin`. | Navigation completes (no crash). |
| 2  | Assert the "Admin" tab (`getByRole('tab', { name: 'Admin', exact: true })`) has count 0. | Admin tab/team-management UI is not rendered for this role. |
| 3  | Assert the page URL does not match `/\/settings\/admin/`. | User was redirected away from the admin route. |

#### Expected Results
- A User Access session is redirected away from the admin settings route and never sees the team-management UI.

#### Acceptance Criteria
- Test passes (not marked `test.fail()`); skipped automatically if `FOUNDATION_ID` is not configured.
- Implemented in `tests/e2e/permissions.spec.ts` ("direct navigation to the Admin Settings URL redirects away for User Access").

---

## Module 2: Contacts Page (Grantees / Entities)

---

### TC13 - Create a new entity by searching via "Find Entity" (happy path)

#### Objective
Automated check that searching via "Find Entity" auto-populates Organization Name and EIN, and that the entity is created successfully.

#### Pre-Conditions
- `admin.json` storage state available.
- A searchable result exists for the term used (`ORG_SEARCH_TERM = 'Test'`) in the underlying "Find Entity" data source (every.org). Flagged in code as a possible source of flakiness if no seed match exists — see `create-entity.spec.ts` inline note.

#### Steps

| Id | Action (Playwright) | Expected Result |
|----|--------|------------------|
| 1  | `ContactsPage.gotoGrantees()` then `openNewEntityModal()`. | New Entity form is open. |
| 2  | `searchFindEntity('Test')`. | Search executes against the Find Entity source. |
| 3  | Click the first result matching the search term. | Result is selected. |
| 4  | Assert `entityNameInput` and `einInput` are not empty. | Organization Name and EIN fields were auto-populated. |
| 5  | `submitCreateContact()`; `expectToastMessage(/contact created/i)`. | Entity is created; confirmation toast appears. |

#### Expected Results
- A new entity is created with Organization Name/EIN populated from the selected search result.

#### Acceptance Criteria
- Test passes (not marked `test.fail()`).
- Implemented in `tests/e2e/create-entity.spec.ts` ("auto-populates Organization Name and EIN from a Find Entity search result").

---

### TC14 - Create a new entity by manual entry (happy path)

#### Objective
Automated check that an entity can be created by typing the Entity Name manually, without using "Find Entity."

#### Pre-Conditions
- `admin.json` storage state available.

#### Steps

| Id | Action (Playwright) | Expected Result |
|----|--------|------------------|
| 1  | `gotoGrantees()` then `openNewEntityModal()`. | New Entity form is open. |
| 2  | `fillNewEntityForm({ entityName: <uniqueName> })` — no `Find Entity` search performed. | Entity Name field accepts the typed value. |
| 3  | `submitCreateContact()`; `expectToastMessage(/contact created/i)`. | Entity is created; confirmation toast appears. |
| 4  | `gotoGrantees()` again; assert `entityRowByName(entityName)` is visible. | Entity is discoverable in the Grantees list. |

#### Expected Results
- Entity created with the exact manually entered name and visible in the Grantees list.

#### Acceptance Criteria
- Test passes (not marked `test.fail()`).
- Implemented in `tests/e2e/create-entity.spec.ts` ("creates an entity via manual Entity Name entry, no Find Entity search").

---

### TC17 - Attempt to create an entity without an entity name (required field validation)

#### Objective
Automated check that omitting the entity name blocks submission with a validation error.

#### Pre-Conditions
- `admin.json` storage state available.

#### Steps

| Id | Action (Playwright) | Expected Result |
|----|--------|------------------|
| 1  | `openNewEntityModal()`; `fillNewEntityForm({ primaryContactName: 'Test', primaryContactEmail: <uniqueEmail> })` — Entity Name left blank. | Fields accept the partial input. |
| 2  | `submitCreateContact()`. | Submission is blocked. |
| 3  | `expectErrorBanner(/legal name must be specified/i)`. | Error banner (`^Error!`) plus the "legal name must be specified" text are both visible. |

#### Expected Results
- No entity is created while the entity name/selection is missing.

#### Acceptance Criteria
- Test passes (not marked `test.fail()`).
- Implemented in `tests/e2e/create-entity.spec.ts` ("blocks submission when Entity Name is blank").

---

### TC18 - Attempt to add a primary contact with an invalid email format

#### Objective
Regression test asserting the **expected** (spec-compliant) behavior — a malformed primary contact email (`-@hotmail.com`) should block submission.

#### Pre-Conditions
- `admin.json` storage state available.
- Test currently fails against the real app by design (see Acceptance Criteria) — this documents **BUG05**.

#### Steps

| Id | Action (Playwright) | Expected Result |
|----|--------|------------------|
| 1  | `openNewEntityModal()`; `fillNewEntityForm({ entityName, primaryContactName: 'Test', primaryContactEmail: '-@hotmail.com' })`. | Fields accept the (invalid) input. |
| 2  | `submitCreateContact()`. | *(Expected)* submission is blocked. |
| 3  | Assert `/valid email/i` text is visible; assert `entityRowByName(entityName)` has count 0. | *(Expected)* no entity persisted with the malformed email. |

#### Expected Results
- Per spec: submission blocked, no entity created.
- Actual (current app behavior, per BUG05): the malformed email is accepted with no validation and the entity is created.

#### Acceptance Criteria
- Test is wrapped in `test.fail(true, ...)` — flips to a visible failure signal if BUG05 is fixed.
- Implemented in `tests/e2e/create-entity.spec.ts` ("blocks submission for a malformed Primary Contact Email").
- Related: `docs/bugs/BUG05-entity-primary-contact-email-not-validated.md`.

---

### TC19 - Attempt to create a duplicate entity

#### Objective
Documents the app's **current** (not spec-required) behavior when the same Entity Name + EIN are submitted twice.

#### Pre-Conditions
- `admin.json` storage state available.

#### Steps

| Id | Action (Playwright) | Expected Result |
|----|--------|------------------|
| 1  | Create an entity with a unique name and fixed `ein = '85-0000001'`; assert `entityRowByName` has count 1. | Original entity created. |
| 2  | Repeat the exact same `fillNewEntityForm` + `submitCreateContact` with identical name/EIN. | Second submission succeeds (per current behavior); toast confirms creation. |
| 3  | Assert `entityRowByName(entityName)` now has count 2. | Two separate rows exist for the same Entity Name/EIN. |

#### Expected Results
- Current behavior: duplicate creation succeeds, no warning/block — asserted as-is, not as a failure.

#### Acceptance Criteria
- Test passes (not marked `test.fail()`) — this is intentional: the "How to add a new entity" spec never requires duplicate detection, so Task 1 recorded TC19 as **Pass** and filed BUG07 as a product/data-quality suggestion rather than a confirmed defect.
- Implemented in `tests/e2e/create-entity.spec.ts` ("creating an entity with the same Entity Name and EIN as an existing one is currently allowed").
- Related: `docs/bugs/BUG07-no-duplicate-entity-detection.md`.
- **Maintenance note:** if duplicate-prevention is intentionally added to the product later, this test must be updated to assert the new blocking behavior instead of the current pass-through behavior.

---

## Coverage summary

| Functionality | TCs automated | TCs not automated (see Task 1 for manual coverage) |
|---|---|---|
| Admin Settings / Team Member Management | TC01, TC04, TC05, TC06, TC12 | TC02, TC03, TC07, TC08, TC09, TC10, TC11 |
| Grantees / Entities (Contacts) | TC13, TC14, TC17, TC18, TC19 | TC15, TC16, TC20, TC21, TC22, TC23, TC24, TC25 |

10 of the 25 manually-documented scenarios are automated (5 per functionality), selected for
breadth across positive/happy-path, negative/validation, and duplicate-handling cases rather
than exhaustive 1:1 coverage. See `README.md` in this folder for run instructions and known
gaps (e.g. `LoginPage.ts` selectors never verified against the live sign-in page).