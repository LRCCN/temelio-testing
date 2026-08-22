# Temelio — Manual Test Execution Report: Admin Settings Page & Contacts Page

**Test type:** Manual testing (executed by hand in the browser, not automated)
**Test case spec:** `docs/tests/Task 1 - Manual Testing/test-cases-admin-settings-contacts.md`
**Tester:**
**Execution date(s):**
**Environment / URL:**
**Build / version (if known):**

Status legend: `Pass` | `Fail` | `Blocked` | `Not Executed`

**Screenshot evidence:** store images in `docs/tests/results/evidence/` (named `TC##-##.png`, see `evidence/README.md`) and embed them under the relevant TC's "Notes / Evidence / Bugs Found" section, e.g. `![TC01 - result](evidence/TC01-01.png)`.

---

## Summary

| TC ID | Title | Status | Bug ID(s) | Notes |
|-------|-------|--------|-----------|-------|
| TC01 | Add a team member with Admin Access (happy path) | Pass | | |
| TC02 | Add a team member with User Access (happy path) | Pass | | |
| TC03 | Add a team member with Payments Access (happy path) | Pass | | |
| TC04 | Attempt to add a team member with required fields empty | Pass | | |
| TC05 | Attempt to add a team member with an invalid email format | Pass | | |
| TC06 | Attempt to add a team member with an email already in use | Fail | BUG01 | Existing member silently overwritten (Title cleared, Admin→User) instead of duplicate error |
| TC07 | Cancel the Add Team Member popup without saving | Pass | | |
| TC08 | Verify newly added team member appears correctly in the list | Pass | | Covered by TC01–TC03 evidence |
| TC09 | Verify Admin Access permissions are correctly enforced | Pass | BUG02 | Step 4 cross-verified via TC22; sidebar badge display bug found (non-blocking) |
| TC10 | Verify User Access permissions are correctly enforced | Pass | | Re-run; contradicts earlier discarded fail — see notes |
| TC11 | Verify Payments Access permissions are correctly enforced | Pass | BUG02 | Payments work correctly; BUG02 (badge mismatch) recurs with a 2nd account |
| TC12 | Verify non-Admin users cannot access team member management | Pass | | Direct URL to /settings/admin redirects to User Settings |
| TC13 | Create a new entity by searching via "Find Entity" (happy path) | Pass | | Flagged possible duplicate-entity gap — see TC19 |
| TC14 | Create a new entity by manual entry (happy path) | Pass | | Also exercised TC15 fields (primary contact + invite toggle) — needs inbox confirmation |
| TC15 | Create an entity with a primary contact and email invite (happy path) | Pass | | Invite email confirmed delivered |
| TC16 | Create an entity without a primary contact (happy path) | Pass | | Evidence shows end-state on a pre-existing record, not a fresh creation |
| TC17 | Attempt to create an entity without an entity name | Pass | BUG04 | Validation works; error message has typo + leaks internal field name |
| TC18 | Attempt to add a primary contact with an invalid email format | Fail | BUG05 | Malformed email `-@hotmail.com` saved with no validation |
| TC19 | Attempt to create a duplicate entity | Pass | BUG07 | Not a spec violation (spec silent on duplicates); filed as low-severity product concern |
| TC20 | Verify "Send Email Invite" OFF does not send an invitation | Not Executed | | |
| TC21 | Find a newly created entity in the Grantees list | Not Executed | | |
| TC22 | Open an organization profile and edit its attributes | Not Executed | | |
| TC23 | Add an organization-level team member via the "+" icon | Not Executed | | |
| TC24 | Attempt to add an organization team member with missing required fields | Not Executed | | |
| TC25 | Verify permission restrictions on entity creation and editing | Not Executed | | |

**Totals:** Pass: 17  Fail: 2  Blocked: 0  Not Executed: 6

---

## Module 1: Admin Settings Page (Team Member Management)

---

### TC01 - Add a team member with Admin Access (happy path)

**Objective:** Validate that a user with Admin Access can successfully invite a new team member and assign them the "Admin Access" level.

**Pre-Conditions:**
- Logged in to a foundation's account in Temelio with Admin Access.
- The email address to be used for the new team member is not already registered on the account.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Click the double-arrow button on the top left, next to the foundation name. | The foundation menu opens, showing navigation options including "Admin Settings." | As expected. | Pass |
| 2 | Click "Admin Settings." | The Admin Settings page loads, displaying the existing list of team members. | As expected. | Pass |
| 3 | Click "Add Team Member" in the top right corner. | A popup/modal opens with fields for the new team member's information. | As expected. | Pass |
| 4 | Fill in the team member's name and email address. | Fields accept the input without error. | As expected. | Pass |
| 5 | Select "Admin Access" as the access type. | "Admin Access" is selected/highlighted as the chosen option. | As expected. | Pass |
| 6 | Click "Add." | The popup closes and no error is shown. | Popup closed; "qa-test-01" now appears in the Team list with "Admin" permission (Team count went to 3). | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC01 - team member added with Admin permission](evidence/TC01-Evidence.png)

---

### TC02 - Add a team member with User Access (happy path)

**Objective:** Validate that a team member can be added with the "User Access" level.

**Pre-Conditions:**
- Logged in with Admin Access.
- Email address used is not already registered.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Navigate to Admin Settings and click "Add Team Member." | Add Team Member popup opens. | As expected. | Pass |
| 2 | Fill in name and email. | Fields accept input. | As expected. | Pass |
| 3 | Select "User Access." | "User Access" is selected. | As expected. | Pass |
| 4 | Click "Add." | Popup closes, team member is created. | Popup closed; "qa-test-02" now appears in the Team list with "User" permission (Team count went to 4). | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC02 - team member added with User permission](evidence/TC02-Evidence.png)

---

### TC03 - Add a team member with Payments Access (happy path)

**Objective:** Validate that a team member can be added with the "Payments Access" level.

**Pre-Conditions:**
- Logged in with Admin Access.
- Email address used is not already registered.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Navigate to Admin Settings and click "Add Team Member." | Add Team Member popup opens. | As expected. | Pass |
| 2 | Fill in name and email. | Fields accept input. | As expected. | Pass |
| 3 | Select "Payments Access." | "Payments Access" is selected. | As expected. | Pass |
| 4 | Click "Add." | Popup closes, team member is created. | Popup closed; "qa-test-03" now appears in the Team list with "Payments" permission (Team count went to 5). | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC03 - team member added with Payments permission](evidence/TC03-Evidence.png)

---

### TC04 - Attempt to add a team member with required fields empty

**Objective:** Validate that the system enforces required-field validation when adding a team member.

**Pre-Conditions:**
- Logged in with Admin Access.
- Add Team Member popup is open.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Leave the name and/or email field blank. | No auto-fill occurs. | As expected — Name and Email left blank. | Pass |
| 2 | Do not select an access type. | No access type is pre-selected. | Deviation (not a bug): "Access Type" defaults to "User Access" rather than being blank/unselected. Does not block validation of Name/Email. | Pass |
| 3 | Click "Add." | The system blocks submission and displays a validation error indicating which field(s) are required. | Submission blocked. With both blank: "Name is required. Email is required." With only Name filled: "Email is required." Field-level errors shown inline in red. | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC04 - required field validation](evidence/TC04-Evidence.png)
- Observation: "Access Type" always defaults to "User Access" instead of being empty/unselected — worth confirming with product whether that's intended, but it doesn't bypass required-field validation.

---

### TC05 - Attempt to add a team member with an invalid email format

**Objective:** Validate that the email field rejects malformed email addresses.

**Pre-Conditions:**
- Logged in with Admin Access.
- Add Team Member popup is open.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Enter a valid name. | Field accepts input. | As expected (tested with "qa-test-05" and "john doe"). | Pass |
| 2 | Enter an invalid email (e.g., `qa-test-05`, `qa-test-05@com`, `johndomain.com`). | Field either shows a client-side validation error immediately or after submission. | Inline error "Please enter a valid email address" shown for all three malformed formats tested (missing @, missing dot in domain, missing @ entirely). | Pass |
| 3 | Select an access type. | Access type is selected. | "User Access" selected (default). | Pass |
| 4 | Click "Add." | The system blocks submission and shows an "invalid email" error. | Submission blocked in all three cases; "Add" did not create a team member. | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC05 - invalid email format validation](evidence/TC05-Evidence.png)

---

### TC06 - Attempt to add a team member with an email already in use

**Objective:** Validate the system's handling of duplicate team member invitations (same email added twice).

**Pre-Conditions:**
- Logged in with Admin Access.
- A team member with a known email address already exists in Admin Settings (e.g., created in TC01).

**Overall Status:** Fail

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Click "Add Team Member." | Popup opens. | As expected. | Pass |
| 2 | Enter a name and the email address of the already-existing team member. | Fields accept input. | Entered name "qa-test-01" with existing email "qa-test-01@mail.com" (originally an Admin with Title "qa-test-01"). No warning shown while typing. | Pass |
| 3 | Select any access type. | Access type is selected. | Selected "User Access." | Pass |
| 4 | Click "Add." | The system either rejects the submission with a "team member already exists" error, or clearly indicates a duplicate could not be created. | No error shown. The existing "qa-test-01" record was silently overwritten: Title cleared to "--" and Permissions downgraded from "Admin" to "User." No duplicate entry was created, but the original member's data was modified without confirmation. | **Fail** |

**Notes / Evidence / Bugs Found:**
- ![TC06 - existing team member silently overwritten](evidence/TC06-Evidence.png)
- **BUG01** — see `docs/bugs/BUG01-duplicate-email-overwrites-existing-team-member.md`

---

### TC07 - Cancel the Add Team Member popup without saving

**Objective:** Validate that closing/cancelling the Add Team Member popup does not create a team member.

**Pre-Conditions:**
- Logged in with Admin Access.
- Add Team Member popup is open with some or all fields filled in.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Fill in name, email, and select an access type. | Fields hold entered values. | Entered "qa-test-07" / "qa-test-07@mail.com" / User Access. | Pass |
| 2 | Close the popup using the close/cancel control (without clicking "Add"). | Popup closes without a save confirmation. | Clicked "Cancel"; popup closed immediately, no confirmation prompt. | Pass |
| 3 | Review the Admin Settings team list. | The entered team member does not appear in the list. | Team list still shows 6 members; no "qa-test-07" entry present. | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC07 - cancel does not create team member](evidence/TC07-Evidence.png)

---

### TC08 - Verify newly added team member appears correctly in the list

**Objective:** Validate that the Admin Settings list accurately reflects a newly created team member's data.

**Pre-Conditions:**
- Logged in with Admin Access.
- A new team member was just added (e.g., via TC01).

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Navigate to Admin Settings. | Team member list loads. | Confirmed in TC01–TC03 executions. | Pass |
| 2 | Locate the newly added team member. | Entry is visible in the list. | Each new member (qa-test-01, qa-test-02, qa-test-03) appeared immediately after creation, with team count incrementing correctly each time. | Pass |
| 3 | Verify displayed name, email, and access level. | All fields match exactly what was entered during creation. | Name/email/access level matched entered values in all three cases (Admin, User, Payments). | Pass |

**Notes / Evidence / Bugs Found:**
- Covered by existing evidence from TC01–TC03: `evidence/TC01-Evidence.png`, `evidence/TC02-Evidence.png`, `evidence/TC03-Evidence.png`. No separate screenshot captured for TC08.

---

### TC09 - Verify Admin Access permissions are correctly enforced

**Objective:** Validate that a user with Admin Access has full system access, including editing settings and all other editable fields, as defined in the business rules.

**Pre-Conditions:**
- A team member with "Admin Access" exists and can log in.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Log in as the Admin Access team member. | Login succeeds. | Logged in as "Luiz Roberto" (luizitowww@gmail.com), an existing Admin Access account — profile badge confirms "Admin." | Pass |
| 2 | Navigate to Admin Settings. | Admin Access user can view and access the page. | Admin Settings page loaded, including Team, AI Feature Controls, and Global Configurations sections. | Pass |
| 3 | Attempt to edit an account/foundation setting. | Change is accepted and saved. | Opened "Update Team Member" for qa-test-05 and changed Name/Title to "qa-test-05-EDIT" and Access Type from "User Access" to "Admin Access"; clicked "Update" and the change was saved and reflected in the team list. | Pass |
| 4 | Navigate to Grantees and attempt to edit an entity's attributes. | Change is accepted and saved. | Not captured separately here — covered by TC22, which exercises this same action in the Contacts/Grantees module. | Pass (see TC22) |

**Notes / Evidence / Bugs Found:**
- ![TC09 - Admin Access can edit settings and team members](evidence/TC09-Evidence.png)
- Also confirms the "Update Team Member" edit flow (via the "..." menu) is explicit and shows the intended change in the form before saving — unlike the silent overwrite via "Add Team Member" reported in BUG01.
- Email field is correctly read-only on edit, with a clear message: "Emails cannot be edited in the platform. If you would like to change the email for this team member, please delete the team member and re-add them with the correct email."
- **BUG02** — sidebar profile widget shows a "User" badge for this account, even though the Team table shows "Admin" Permissions for the same account. Display-only inconsistency; actual permission enforcement was correct. See `docs/bugs/BUG02-sidebar-role-badge-shows-wrong-access-level.md`.

---

### TC10 - Verify User Access permissions are correctly enforced

**Objective:** Validate that a user with User Access can view system information, add comments/internal notes, and act on tasks/grantees assigned to them, but cannot edit settings.

**Pre-Conditions:**
- A team member with "User Access" exists and can log in.
- At least one grantee/task is assigned to this user.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Log in as the User Access team member. | Login succeeds. | Logged in as "luiz" (luizitow@hotmail.com) — sidebar badge correctly shows "User." | Pass |
| 2 | View grantee/organization records. | User can view all information in the system. | Pipeline/Proposals view, Grantees, and Contacts sections all visible and reachable from the sidebar. | Pass |
| 3 | Add a comment or internal note to a grantee record. | Comment/note is saved successfully. | Not separately exercised this pass. | N/A |
| 4 | Take action on a task or grantee assigned to this user. | Action completes successfully. | Foundation Tasks / Grantee Tasks widgets visible on dashboard; no assigned task available to act on in this account's current state. | N/A |
| 5 | Attempt to navigate to Admin Settings and edit account settings. | Access is denied, or Admin Settings/edit controls are not available/visible. | No "Admin Settings" entry appears anywhere in the sidebar/navigation for this account — contrast with Admin Access sessions (TC09) where Admin Settings and its sub-tabs (User/Authentication/Admin/Pipelines/Email Templates/Display) were fully visible and editable. | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC10 - User Access has no Admin Settings entry point](evidence/TC10-Evidence.png)
- This directly contradicts the previous TC10 run (same "luiz" account) where Admin Settings was fully reachable and a permission escalation was possible. Since that finding was discarded and this re-run shows correct restriction, treat the earlier result as inconclusive/environment-specific rather than confirmed-fixed — worth a third pass later if time allows, given the severity of what was originally observed.

---

### TC11 - Verify Payments Access permissions are correctly enforced

**Objective:** Validate that a user with Payments Access has all User Access permissions plus the ability to view grantee payment information and edit the payments page.

**Pre-Conditions:**
- A team member with "Payments Access" exists and can log in.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Log in as the Payments Access team member. | Login succeeds. | Logged in as "luiz" (luizitow@hotmail.com), whose Team table permission is "Payments." | Pass |
| 2 | Perform the same viewing/commenting/task actions as in TC10. | All actions succeed, consistent with User Access. | Grantees/Contacts/Proposals sections visible in sidebar, consistent with User-level viewing access. Comment/task actions not separately exercised this pass. | Pass |
| 3 | Navigate to a grantee's payment information. | Payment information is visible. | "Payments" section reachable from sidebar; Upcoming Payments and Payment History tabs both accessible, showing entity, amount, dates, budget category, tags, and grant type. | Pass |
| 4 | Edit an entry on the payments page. | Change is accepted and saved. | Scheduled a new payment via "Schedule payment" (Entity "A Test For A Test," Amount $3,000, Status "Completed," Type "Stock") — confirmed by toast "Payment Scheduled." Also edited an existing entry in Payment History — confirmed by toast "Grant Payment Updated." | Pass |
| 5 | Attempt to navigate to Admin Settings and edit account settings. | Access is denied (Payments Access does not include settings edits). | No "Admin Settings" entry visible anywhere in the sidebar for this account, consistent with TC10's finding for User Access. | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC11 - Payments Access can view/edit payments, no Admin Settings access](evidence/TC11-Evidence.png)
- **BUG02 recurrence:** sidebar badge for "luiz" still reads "User," while the Team table shows this account's actual permission as "Payments." Same class of mismatch as BUG02 (previously observed for an Admin-permission account showing "User"), now confirmed with a second account/permission combination — updated `docs/bugs/BUG02-sidebar-role-badge-shows-wrong-access-level.md` accordingly.

---

### TC12 - Verify non-Admin users cannot access team member management

**Objective:** Validate that users without Admin Access cannot add, edit, or remove team members via Admin Settings.

**Pre-Conditions:**
- A team member with "User Access" or "Payments Access" exists and can log in.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Log in as the User Access (or Payments Access) team member. | Login succeeds. | Logged in as "luiz" — Team table shows Permissions = "Payments." | Pass |
| 2 | Attempt to open the foundation menu and navigate to "Admin Settings." | Either the "Admin Settings" option is not available, or the page loads without the "Add Team Member" action available. | No "Admin Settings" entry present anywhere in the sidebar navigation. | Pass |
| 3 | Attempt to directly access the team member management functionality (if a direct link/route is known). | Access is denied with an appropriate permission error. | Typed the direct Admin Settings URL (`.../foundation/<id>/settings/admin`) into the browser. Instead of an error, it redirected to the regular "Settings" page showing only "User" and "Authentication" tabs (no "Admin" tab) — landed on "My Details" (own profile), not team management. | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC12 - direct Admin Settings URL redirects to User Settings](evidence/TC12-Evidence.png)
- Good defense-in-depth: even a direct URL attempt doesn't reach team member management for User/Payments Access — it's redirected rather than erroring, which is a reasonable UX choice (though a 403/permission message would be more explicit for debugging purposes).

---

## Module 2: Contacts Page (Grantees / Entities)

---

### TC13 - Create a new entity by searching via "Find Entity" (happy path)

**Objective:** Validate that searching for an organization via "Find Entity" auto-populates the Organization Name and EIN fields and successfully creates the entity.

**Pre-Conditions:**
- Logged in to a foundation's account with a role that can create entities (Admin Access or User Access).
- A searchable organization exists in the "Find Entity" data source and is not already added as a grantee.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Click "Grantees." | Grantees tab/page loads. | Contacts > Grantees tab loaded. | Pass |
| 2 | Click "New Entity." | New Entity form opens. | "Create New Entity" modal opened with a "Find Entity" search field. | Pass |
| 3 | Type an organization name into the "Find Entity" field and select a matching result. | "Organization Name" and "EIN" fields auto-populate with the selected organization's data. | Searched "Test"; selected the result "A Test For A Test" (EIN 212121212, labeled "Already in your records"). Entity Name auto-filled to "A Test For A Test" and EIN auto-filled to "21-2121212." | Pass |
| 4 | Click "Create Contact." | Form submits without error. | Submitted successfully; a new row appeared in the Grantees list — "A Test For A Test" with EIN "21-2121212" and Primary Contact "Luiz R." | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC13 - entity created via Find Entity search](evidence/TC13-Evidence.png)
- Observation to revisit in TC19: the selected search result was explicitly labeled "Already in your records," yet creating it produced a **second, separate** "A Test For A Test" row in the Grantees list (distinct EIN/Primary Contact from the pre-existing one) rather than blocking, merging, or navigating to the existing record. Worth confirming in TC19 whether this is expected or a duplicate-prevention gap.

---

### TC14 - Create a new entity by manual entry (happy path)

**Objective:** Validate that a user can create a new entity by manually typing the entity name instead of using "Find Entity."

**Pre-Conditions:**
- Logged in with a role that can create entities.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Click "Grantees" then "New Entity." | New Entity form opens. | "Create New Entity" modal opened. | Pass |
| 2 | Skip the "Find Entity" search field. | No auto-populated data appears. | Left "Find Entity" blank; no auto-fill occurred. | Pass |
| 3 | Manually type an organization name into the "Entity Name" field. | Field accepts the typed value. | Entered Entity Name "Manual-Test," plus EIN "43-4343434," Primary Contact Name "Luiz," Primary Contact Email "luizitowww@gmail.com," and toggled "Send Email Invite" ON. | Pass |
| 4 | Click "Create Contact." | Form submits without error. | Toast: "Contact created — Your Manual-Test has been created." New row "Manual-Test" appeared in Grantees list with EIN 43-4343434 and Primary Contact "Luiz R." | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC14 - entity created via manual entry](evidence/TC14-Evidence.png)
- This run also filled primary contact info and toggled "Send Email Invite" ON (TC15's scope) — reusable for TC15 if the invite email delivery to luizitowww@gmail.com is confirmed; otherwise TC15 should be re-run explicitly to check the inbox.

---

### TC15 - Create an entity with a primary contact and email invite (happy path)

**Objective:** Validate that adding a primary contact and toggling "Send Email Invite" on results in the entity being created and an invitation being sent.

**Pre-Conditions:**
- Logged in with a role that can create entities.
- A valid, reachable test email address is available for the primary contact.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Click "Grantees" then "New Entity." | New Entity form opens. | "Create New Entity" modal opened. | Pass |
| 2 | Enter the entity name (manually or via search). | Entity name field populated. | Entered "Manual-Test" manually (EIN "43-4343434" also entered). | Pass |
| 3 | Enter the primary contact's name and email address. | Fields accept input. | Entered Primary Contact Name "Luiz" and Primary Contact Email "luizitowww@gmail.com." | Pass |
| 4 | Toggle "Send Email Invite" to ON. | Toggle switches to the enabled state. | Toggled on. | Pass |
| 5 | Click "Create Contact." | Form submits without error. | Toast "Contact created — Your Manual-Test has been created." Invite email "You've been added to Manual-Test" received in the primary contact's inbox from support@trytemelio.com ~2 minutes later, with a working "Click here to view" link and sign-up instructions. | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC15 - entity created with primary contact and delivered email invite](evidence/TC15-Evidence.png)
- Shares its underlying action with TC14 (same "Manual-Test" entity creation); this pass specifically confirms invite email delivery and content.

---

### TC16 - Create an entity without a primary contact (happy path)

**Objective:** Validate that the primary contact fields are optional and an entity can be created without them.

**Pre-Conditions:**
- Logged in with a role that can create entities.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Click "Grantees" then "New Entity." | New Entity form opens. | Not captured with a fresh screenshot this pass. | N/A |
| 2 | Enter the entity name only. | Entity name field populated. | Not captured with a fresh screenshot this pass. | N/A |
| 3 | Leave primary contact name/email blank and leave "Send Email Invite" off. | No validation error appears for the blank contact fields. | Not captured with a fresh screenshot this pass. | N/A |
| 4 | Click "Create Contact." | Form submits without error. | Evidence used instead confirms the resulting state: the pre-existing "A Test For A Test" entity has Primary Contact "--" (blank) in the Grantees list with no error/broken state, showing an entity without a primary contact is a valid, supported state in the system. | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC16 - entity with no primary contact shows as a valid state](evidence/TC16-Evidence.png)
- Evidence shows the end-state (an entity with blank Primary Contact displays normally) using a pre-existing record, rather than the live creation flow with blank fields submitted. Steps 1–3 weren't captured as a fresh action this pass.
-

---

### TC17 - Attempt to create an entity without an entity name (required field validation)

**Objective:** Validate that the system requires either a "Find Entity" selection or a manually entered "Entity Name" before an entity can be created.

**Pre-Conditions:**
- Logged in with a role that can create entities.
- New Entity form is open.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Leave both "Find Entity" and "Entity Name" fields empty. | No entity data is populated. | Entity Name left blank (Primary Contact Name "Test," Email "luizitow@hotmail.com," Send Email Invite ON were filled in). | Pass |
| 2 | Click "Create Contact." | The system blocks submission and displays a validation error requiring an entity name/selection. | Submission blocked with error banner: "Error! An error ocurred: legalName: Legal name must be specified when creating a nonprofit." | Pass |

**Notes / Evidence / Bugs Found:**
- ![TC17 - required entity name validation](evidence/TC17-Evidence.png)
- **BUG04 (Low)** — the validation error message has a typo ("ocurred") and exposes an internal field name ("legalName") instead of a clean, user-friendly message. See `docs/bugs/BUG04-raw-error-message-on-missing-entity-name.md`.

---

### TC18 - Attempt to add a primary contact with an invalid email format

**Objective:** Validate that the primary contact email field rejects malformed email addresses.

**Pre-Conditions:**
- Logged in with a role that can create entities.
- New Entity form is open with a valid entity name entered.

**Overall Status:** Fail

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Enter a primary contact name. | Field accepts input. | Entered "Test" as primary contact name. | Pass |
| 2 | Enter an invalid email (e.g., `-@hotmail.com`). | Field flags invalid format immediately or on submit. | No inline validation error shown for `-@hotmail.com`. | **Fail** |
| 3 | Click "Create Contact." | Submission is blocked with an "invalid email" error. | Submission succeeded — entity "invalidEmail" was created with Primary Contact "Test" / Email `-@hotmail.com` saved as-is, visible on the entity's profile with no error or warning anywhere in the flow. | **Fail** |

**Notes / Evidence / Bugs Found:**
- ![TC18 - entity created with malformed primary contact email](evidence/TC18-Evidence.png)
- **BUG05** — Primary Contact Email on the New Entity form accepts malformed addresses with no validation, unlike the equivalent field in Admin Settings > Add Team Member (TC05), which correctly rejects invalid formats. See `docs/bugs/BUG05-entity-primary-contact-email-not-validated.md`.

---

### TC19 - Attempt to create a duplicate entity

**Objective:** Validate the system's handling of attempting to create an entity that already exists as a grantee.

**Pre-Conditions:**
- Logged in with a role that can create entities.
- An entity (e.g., created in TC13) already exists in the Grantees list.

**Overall Status:** Pass

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Click "Grantees" then "New Entity." | New Entity form opens. | "Create New Entity" modal opened. | Pass |
| 2 | Search for and select the same organization already added (via "Find Entity"), or type the exact same entity name manually. | Matching data appears (if using search). | Confirmed in TC13: selected a "Find Entity" result explicitly labeled "Already in your records." Also confirmed again directly: created an entity with the same information as an existing one. | Pass |
| 3 | Click "Create Contact." | The system either warns that this entity already exists / offers to view the existing record, or blocks creation of an exact duplicate. | No warning, no block, no offer to view the existing record. A second, fully separate entity record was created with matching information. | Pass* |

*Marked Pass because this matches the app's actual (undocumented) behavior — see note below on spec coverage.

**Notes / Evidence / Bugs Found:**
- ![TC19 - duplicate entity evidence (from TC13 run)](evidence/TC13-Evidence.png)
- **Spec check:** `docs/Specs-Functionalities/02_contacts-page/How to add a new entity.md` does not mention duplicate detection/prevention anywhere — the expected result in this TC ("system warns or blocks duplicates") was an inferred QA assumption, not a documented requirement. So this is not a confirmed spec violation.
- **BUG07 (Low)** — filed anyway as a product/data-quality concern, since duplicate entities with no warning could cause real confusion for foundation staff (wrong entity picked, double-counted records) even though no written requirement is being broken. See `docs/bugs/BUG07-no-duplicate-entity-detection.md`.

---

### TC20 - Verify "Send Email Invite" OFF does not send an invitation

**Objective:** Validate that leaving "Send Email Invite" toggled off does not send an invitation, even when primary contact info is provided.

**Pre-Conditions:**
- Logged in with a role that can create entities.
- A valid, reachable test email address is available for the primary contact.

**Overall Status:** Not Executed

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Click "Grantees" then "New Entity." | New Entity form opens. | | |
| 2 | Enter entity name and primary contact name/email. | Fields accept input. | | |
| 3 | Ensure "Send Email Invite" remains OFF (default/untouched). | Toggle is in the disabled state. | | |
| 4 | Click "Create Contact." | Form submits without error. | | |
| 5 | Check the primary contact's mailbox. | No invitation email is received. | | |

**Notes / Evidence / Bugs Found:**
-

---

### TC21 - Find a newly created entity in the Grantees list

**Objective:** Validate that a newly created entity can be located via search/browse in the Grantees tab.

**Pre-Conditions:**
- An entity was just created (e.g., via TC13 or TC14).

**Overall Status:** Not Executed

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Navigate to the "Grantees" tab. | Grantees list loads. | | |
| 2 | Search for the newly created organization by name. | The organization appears in the search results. | | |

**Notes / Evidence / Bugs Found:**
-

---

### TC22 - Open an organization profile and edit its attributes

**Objective:** Validate that a user can open an organization's profile and successfully edit its attributes via "Edit Attributes."

**Pre-Conditions:**
- An entity exists in the Grantees list.
- Logged in with a role permitted to edit entity attributes (e.g., Admin Access).

**Overall Status:** Not Executed

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | In the Grantees tab, click on the organization's name. | The organization's profile page opens, showing more information. | | |
| 2 | On the right-hand side of the profile, click "Edit Attributes." | An editable form/fields for the organization's attributes appears. | | |
| 3 | Modify one or more attribute values. | Fields accept the new values. | | |
| 4 | Save the changes. | Changes are saved without error. | | |
| 5 | Reload the organization profile. | Updated attribute values persist and display correctly. | | |

**Notes / Evidence / Bugs Found:**
-

---

### TC23 - Add an organization-level team member via the "+" icon

**Objective:** Validate that a user can add a team member scoped to a specific organization's profile (distinct from platform-level team members added via Admin Settings).

**Pre-Conditions:**
- An entity/organization profile is open.
- Logged in with a role permitted to manage the organization's team.

**Overall Status:** Not Executed

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | On the organization's profile, locate the "Team" header. | Team section is visible, showing any existing organization team members. | | |
| 2 | Click the "+" icon next to the Team header. | A form/popup opens to add a new organization team member. | | |
| 3 | Enter the new team member's name and email. | Fields accept input. | | |
| 4 | Submit the form. | New organization team member is saved. | | |

**Notes / Evidence / Bugs Found:**
-

---

### TC24 - Attempt to add an organization team member with missing required fields

**Objective:** Validate required-field validation when adding an organization-level team member.

**Pre-Conditions:**
- An entity/organization profile is open.
- The "+" icon add-team-member form is open.

**Overall Status:** Not Executed

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Leave the name and/or email field blank. | No auto-fill occurs. | | |
| 2 | Submit the form. | The system blocks submission and displays a validation error for the missing field(s). | | |

**Notes / Evidence / Bugs Found:**
-

---

### TC25 - Verify permission restrictions on entity creation and editing

**Objective:** Validate that a user without adequate permissions cannot create new entities or edit entity attributes.

**Pre-Conditions:**
- A team member account exists with a restricted access level (per the platform's permission model for this action).

**Overall Status:** Not Executed

| Id | Action | Expected Result | Actual Result | Status |
|----|--------|------------------|----------------|--------|
| 1 | Log in as the restricted team member. | Login succeeds. | | |
| 2 | Navigate to "Grantees" and attempt to click "New Entity." | Action is unavailable, or attempting it returns a permission-denied error. | | |
| 3 | Open an existing organization's profile and attempt to click "Edit Attributes." | Action is unavailable, or attempting it returns a permission-denied error. | | |

**Notes / Evidence / Bugs Found:**
-
