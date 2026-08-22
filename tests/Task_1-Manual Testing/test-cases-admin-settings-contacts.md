# Temelio — Manual Test Cases: Admin Settings Page & Contacts Page

**Modules covered:** Admin Settings / Team Member Management, Grantees / Entities (Contacts Page)
**Source specs:** `docs/Specs-Functionalities/01_How-to-add-a-team-member`, `docs/Specs-Functionalities/02_contacts-page`
**Generated with:** `docs/prompts/prompt-testcase-generator.md`

---

## Module 1: Admin Settings Page (Team Member Management)

---

### TC01 - Add a team member with Admin Access (happy path)

#### Objective
Validate that a user with Admin Access can successfully invite a new team member and assign them the "Admin Access" level.

#### Pre-Conditions
- Logged in to a foundation's account in Temelio with Admin Access.
- The email address to be used for the new team member is not already registered on the account.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Click the double-arrow button on the top left, next to the foundation name. | The foundation menu opens, showing navigation options including "Admin Settings." |
| 2  | Click "Admin Settings." | The Admin Settings page loads, displaying the existing list of team members. |
| 3  | Click "Add Team Member" in the top right corner. | A popup/modal opens with fields for the new team member's information. |
| 4  | Fill in the team member's name and email address. | Fields accept the input without error. |
| 5  | Select "Admin Access" as the access type. | "Admin Access" is selected/highlighted as the chosen option. |
| 6  | Click "Add." | The popup closes and no error is shown. |

#### Expected Results
- The new team member appears in the Admin Settings team list with the name, email, and "Admin Access" level exactly as entered.

#### Acceptance Criteria
- Team member is created and persisted without a page error.
- Access level shown in the list matches "Admin Access."
- Team member can subsequently log in and has full system access, including the ability to edit settings and all other editable fields.

---

### TC02 - Add a team member with User Access (happy path)

#### Objective
Validate that a team member can be added with the "User Access" level.

#### Pre-Conditions
- Logged in with Admin Access.
- Email address used is not already registered.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Navigate to Admin Settings and click "Add Team Member." | Add Team Member popup opens. |
| 2  | Fill in name and email. | Fields accept input. |
| 3  | Select "User Access." | "User Access" is selected. |
| 4  | Click "Add." | Popup closes, team member is created. |

#### Expected Results
- The team member is listed in Admin Settings with "User Access."

#### Acceptance Criteria
- Team member with User Access can view all system information, add comments/internal notes, and take action on tasks and grantees assigned to them.
- Team member with User Access cannot edit account/admin settings.

---

### TC03 - Add a team member with Payments Access (happy path)

#### Objective
Validate that a team member can be added with the "Payments Access" level.

#### Pre-Conditions
- Logged in with Admin Access.
- Email address used is not already registered.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Navigate to Admin Settings and click "Add Team Member." | Add Team Member popup opens. |
| 2  | Fill in name and email. | Fields accept input. |
| 3  | Select "Payments Access." | "Payments Access" is selected. |
| 4  | Click "Add." | Popup closes, team member is created. |

#### Expected Results
- The team member is listed in Admin Settings with "Payments Access."

#### Acceptance Criteria
- Team member with Payments Access has all User Access permissions, plus the ability to view grantee payment information and edit the payments page.

---

### TC04 - Attempt to add a team member with required fields empty

#### Objective
Validate that the system enforces required-field validation when adding a team member.

#### Pre-Conditions
- Logged in with Admin Access.
- Add Team Member popup is open.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Leave the name and/or email field blank. | No auto-fill occurs. |
| 2  | Do not select an access type. | No access type is pre-selected. |
| 3  | Click "Add." | The system blocks submission and displays a validation error indicating which field(s) are required. |

#### Expected Results
- No new team member is created; the popup remains open with the validation error(s) visible.

#### Acceptance Criteria
- Submission is rejected while any required field (name, email, access type) is empty.
- Error message clearly identifies the missing field(s).

---

### TC05 - Attempt to add a team member with an invalid email format

#### Objective
Validate that the email field rejects malformed email addresses.

#### Pre-Conditions
- Logged in with Admin Access.
- Add Team Member popup is open.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Enter a valid name. | Field accepts input. |
| 2  | Enter an invalid email (e.g., `john.doe`, `john@`, `john@@domain.com`). | Field either shows a client-side validation error immediately or after submission. |
| 3  | Select an access type. | Access type is selected. |
| 4  | Click "Add." | The system blocks submission and shows an "invalid email" error. |

#### Expected Results
- No team member is created with an invalid email.

#### Acceptance Criteria
- All tested malformed email formats are rejected with a clear error message.

---

### TC06 - Attempt to add a team member with an email already in use

#### Objective
Validate the system's handling of duplicate team member invitations (same email added twice).

#### Pre-Conditions
- Logged in with Admin Access.
- A team member with a known email address already exists in Admin Settings (e.g., created in TC01).

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Click "Add Team Member." | Popup opens. |
| 2  | Enter a name and the email address of the already-existing team member. | Fields accept input. |
| 3  | Select any access type. | Access type is selected. |
| 4  | Click "Add." | The system either rejects the submission with a "team member already exists" error, or clearly indicates a duplicate could not be created. |

#### Expected Results
- No duplicate team member entry is created for the same email address.

#### Acceptance Criteria
- Admin Settings team list contains only one entry for the given email address after the attempt.

---

### TC07 - Cancel the Add Team Member popup without saving

#### Objective
Validate that closing/cancelling the Add Team Member popup does not create a team member.

#### Pre-Conditions
- Logged in with Admin Access.
- Add Team Member popup is open with some or all fields filled in.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Fill in name, email, and select an access type. | Fields hold entered values. |
| 2  | Close the popup using the close/cancel control (without clicking "Add"). | Popup closes without a save confirmation. |
| 3  | Review the Admin Settings team list. | The entered team member does not appear in the list. |

#### Expected Results
- No new team member is added when the popup is dismissed without submitting.

#### Acceptance Criteria
- Team list count remains unchanged after cancelling.

---

### TC08 - Verify newly added team member appears correctly in the list

#### Objective
Validate that the Admin Settings list accurately reflects a newly created team member's data.

#### Pre-Conditions
- Logged in with Admin Access.
- A new team member was just added (e.g., via TC01).

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Navigate to Admin Settings. | Team member list loads. |
| 2  | Locate the newly added team member. | Entry is visible in the list. |
| 3  | Verify displayed name, email, and access level. | All fields match exactly what was entered during creation. |

#### Expected Results
- Team member data displayed in the list is accurate and consistent with what was submitted.

#### Acceptance Criteria
- No data is missing, truncated, or mismatched between input and displayed values.

---

### TC09 - Verify Admin Access permissions are correctly enforced

#### Objective
Validate that a user with Admin Access has full system access, including editing settings and all other editable fields, as defined in the business rules.

#### Pre-Conditions
- A team member with "Admin Access" exists and can log in.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Log in as the Admin Access team member. | Login succeeds. |
| 2  | Navigate to Admin Settings. | Admin Access user can view and access the page. |
| 3  | Attempt to edit an account/foundation setting. | Change is accepted and saved. |
| 4  | Navigate to Grantees and attempt to edit an entity's attributes. | Change is accepted and saved. |

#### Expected Results
- Admin Access user can perform all edit actions across settings and other editable fields without being blocked.

#### Acceptance Criteria
- No permission-denied errors occur for any edit action available to Admin Access.

---

### TC10 - Verify User Access permissions are correctly enforced

#### Objective
Validate that a user with User Access can view system information, add comments/internal notes, and act on tasks/grantees assigned to them, but cannot edit settings.

#### Pre-Conditions
- A team member with "User Access" exists and can log in.
- At least one grantee/task is assigned to this user.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Log in as the User Access team member. | Login succeeds. |
| 2  | View grantee/organization records. | User can view all information in the system. |
| 3  | Add a comment or internal note to a grantee record. | Comment/note is saved successfully. |
| 4  | Take action on a task or grantee assigned to this user. | Action completes successfully. |
| 5  | Attempt to navigate to Admin Settings and edit account settings. | Access is denied, or Admin Settings/edit controls are not available/visible. |

#### Expected Results
- User Access permits viewing, commenting, and acting on assigned items, but blocks settings edits.

#### Acceptance Criteria
- No settings-editing capability is exposed to a User Access account.
- All viewing/commenting/task actions succeed without error.

---

### TC11 - Verify Payments Access permissions are correctly enforced

#### Objective
Validate that a user with Payments Access has all User Access permissions plus the ability to view grantee payment information and edit the payments page.

#### Pre-Conditions
- A team member with "Payments Access" exists and can log in.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Log in as the Payments Access team member. | Login succeeds. |
| 2  | Perform the same viewing/commenting/task actions as in TC10. | All actions succeed, consistent with User Access. |
| 3  | Navigate to a grantee's payment information. | Payment information is visible. |
| 4  | Edit an entry on the payments page. | Change is accepted and saved. |
| 5  | Attempt to navigate to Admin Settings and edit account settings. | Access is denied (Payments Access does not include settings edits). |

#### Expected Results
- Payments Access exposes payment viewing/editing on top of standard User Access, without granting Admin-level settings access.

#### Acceptance Criteria
- Payment info is visible and editable.
- Admin Settings edit capability remains blocked.

---

### TC12 - Verify non-Admin users cannot access team member management

#### Objective
Validate that users without Admin Access cannot add, edit, or remove team members via Admin Settings.

#### Pre-Conditions
- A team member with "User Access" or "Payments Access" exists and can log in.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Log in as the User Access (or Payments Access) team member. | Login succeeds. |
| 2  | Attempt to open the foundation menu and navigate to "Admin Settings." | Either the "Admin Settings" option is not available, or the page loads without the "Add Team Member" action available. |
| 3  | Attempt to directly access the team member management functionality (if a direct link/route is known). | Access is denied with an appropriate permission error. |

#### Expected Results
- Users without Admin Access cannot invite, edit, or remove team members.

#### Acceptance Criteria
- No path exists for a non-Admin user to reach the "Add Team Member" action.

---

## Module 2: Contacts Page (Grantees / Entities)

---

### TC13 - Create a new entity by searching via "Find Entity" (happy path)

#### Objective
Validate that searching for an organization via "Find Entity" auto-populates the Organization Name and EIN fields and successfully creates the entity.

#### Pre-Conditions
- Logged in to a foundation's account with a role that can create entities (Admin Access or User Access).
- A searchable organization exists in the "Find Entity" data source and is not already added as a grantee.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Click "Grantees." | Grantees tab/page loads. |
| 2  | Click "New Entity." | New Entity form opens. |
| 3  | Type an organization name into the "Find Entity" field and select a matching result. | "Organization Name" and "EIN" fields auto-populate with the selected organization's data. |
| 4  | Click "Create Contact." | Form submits without error. |

#### Expected Results
- A new entity is created with the Organization Name and EIN matching the values auto-populated from the search.

#### Acceptance Criteria
- Organization Name and EIN exactly match the source record selected via "Find Entity."
- Entity is retrievable afterward from the Grantees list.

---

### TC14 - Create a new entity by manual entry (happy path)

#### Objective
Validate that a user can create a new entity by manually typing the entity name instead of using "Find Entity."

#### Pre-Conditions
- Logged in with a role that can create entities.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Click "Grantees" then "New Entity." | New Entity form opens. |
| 2  | Skip the "Find Entity" search field. | No auto-populated data appears. |
| 3  | Manually type an organization name into the "Entity Name" field. | Field accepts the typed value. |
| 4  | Click "Create Contact." | Form submits without error. |

#### Expected Results
- A new entity is created using the manually entered Entity Name, with no EIN pre-filled.

#### Acceptance Criteria
- Entity is created and visible in the Grantees list with the exact manually entered name.

---

### TC15 - Create an entity with a primary contact and email invite (happy path)

#### Objective
Validate that adding a primary contact and toggling "Send Email Invite" on results in the entity being created and an invitation being sent.

#### Pre-Conditions
- Logged in with a role that can create entities.
- A valid, reachable test email address is available for the primary contact.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Click "Grantees" then "New Entity." | New Entity form opens. |
| 2  | Enter the entity name (manually or via search). | Entity name field populated. |
| 3  | Enter the primary contact's name and email address. | Fields accept input. |
| 4  | Toggle "Send Email Invite" to ON. | Toggle switches to the enabled state. |
| 5  | Click "Create Contact." | Form submits without error. |

#### Expected Results
- Entity is created with the specified primary contact, and an invitation email is sent to the primary contact's address to complete the organization profile.

#### Acceptance Criteria
- Primary contact info is saved and displayed on the entity's profile.
- Invitation email is received by the primary contact (verify via test mailbox or system email log).

---

### TC16 - Create an entity without a primary contact (happy path)

#### Objective
Validate that the primary contact fields are optional and an entity can be created without them.

#### Pre-Conditions
- Logged in with a role that can create entities.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Click "Grantees" then "New Entity." | New Entity form opens. |
| 2  | Enter the entity name only. | Entity name field populated. |
| 3  | Leave primary contact name/email blank and leave "Send Email Invite" off. | No validation error appears for the blank contact fields. |
| 4  | Click "Create Contact." | Form submits without error. |

#### Expected Results
- Entity is created successfully with no primary contact attached.

#### Acceptance Criteria
- Entity's profile shows no primary contact, confirming the field is optional.
- A primary contact can be added later from the entity's profile.

---

### TC17 - Attempt to create an entity without an entity name (required field validation)

#### Objective
Validate that the system requires either a "Find Entity" selection or a manually entered "Entity Name" before an entity can be created.

#### Pre-Conditions
- Logged in with a role that can create entities.
- New Entity form is open.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Leave both "Find Entity" and "Entity Name" fields empty. | No entity data is populated. |
| 2  | Click "Create Contact." | The system blocks submission and displays a validation error requiring an entity name/selection. |

#### Expected Results
- No entity is created.

#### Acceptance Criteria
- Submission is rejected while the entity name/selection is missing, with a clear error message.

---

### TC18 - Attempt to add a primary contact with an invalid email format

#### Objective
Validate that the primary contact email field rejects malformed email addresses.

#### Pre-Conditions
- Logged in with a role that can create entities.
- New Entity form is open with a valid entity name entered.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Enter a primary contact name. | Field accepts input. |
| 2  | Enter an invalid email (e.g., `contact@`, `contact.domain`). | Field flags invalid format immediately or on submit. |
| 3  | Click "Create Contact." | Submission is blocked with an "invalid email" error. |

#### Expected Results
- The entity is not created until the email is corrected, or is created with the invalid email rejected/cleared.

#### Acceptance Criteria
- No entity with a malformed primary contact email is persisted.

---

### TC19 - Attempt to create a duplicate entity

#### Objective
Validate the system's handling of attempting to create an entity that already exists as a grantee.

#### Pre-Conditions
- Logged in with a role that can create entities.
- An entity (e.g., created in TC13) already exists in the Grantees list.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Click "Grantees" then "New Entity." | New Entity form opens. |
| 2  | Search for and select the same organization already added (via "Find Entity"), or type the exact same entity name manually. | Matching data appears (if using search). |
| 3  | Click "Create Contact." | The system either warns that this entity already exists / offers to view the existing record, or blocks creation of an exact duplicate. |

#### Expected Results
- No unintended duplicate entity record is created for the same organization.

#### Acceptance Criteria
- Grantees list contains only one entry for the given organization after the attempt (unless duplicates are an explicitly supported/expected behavior, in which case this should be flagged as a finding).

---

### TC20 - Verify "Send Email Invite" OFF does not send an invitation

#### Objective
Validate that leaving "Send Email Invite" toggled off does not send an invitation, even when primary contact info is provided.

#### Pre-Conditions
- Logged in with a role that can create entities.
- A valid, reachable test email address is available for the primary contact.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Click "Grantees" then "New Entity." | New Entity form opens. |
| 2  | Enter entity name and primary contact name/email. | Fields accept input. |
| 3  | Ensure "Send Email Invite" remains OFF (default/untouched). | Toggle is in the disabled state. |
| 4  | Click "Create Contact." | Form submits without error. |
| 5  | Check the primary contact's mailbox. | No invitation email is received. |

#### Expected Results
- Entity and primary contact are saved, but no invite email is sent.

#### Acceptance Criteria
- Zero invitation emails delivered when the toggle is off.

---

### TC21 - Find a newly created entity in the Grantees list

#### Objective
Validate that a newly created entity can be located via search/browse in the Grantees tab.

#### Pre-Conditions
- An entity was just created (e.g., via TC13 or TC14).

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Navigate to the "Grantees" tab. | Grantees list loads. |
| 2  | Search for the newly created organization by name. | The organization appears in the search results. |

#### Expected Results
- The newly created entity is discoverable in the Grantees list immediately after creation.

#### Acceptance Criteria
- Search returns the correct organization with no noticeable delay or missing record.

---

### TC22 - Open an organization profile and edit its attributes

#### Objective
Validate that a user can open an organization's profile and successfully edit its attributes via "Edit Attributes."

#### Pre-Conditions
- An entity exists in the Grantees list.
- Logged in with a role permitted to edit entity attributes (e.g., Admin Access).

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | In the Grantees tab, click on the organization's name. | The organization's profile page opens, showing more information. |
| 2  | On the right-hand side of the profile, click "Edit Attributes." | An editable form/fields for the organization's attributes appears. |
| 3  | Modify one or more attribute values. | Fields accept the new values. |
| 4  | Save the changes. | Changes are saved without error. |
| 5  | Reload the organization profile. | Updated attribute values persist and display correctly. |

#### Expected Results
- Organization attribute changes are saved and reflected on the profile after a reload.

#### Acceptance Criteria
- No data loss or reversion of edited attributes occurs after saving and reloading.

---

### TC23 - Add an organization-level team member via the "+" icon

#### Objective
Validate that a user can add a team member scoped to a specific organization's profile (distinct from platform-level team members added via Admin Settings).

#### Pre-Conditions
- An entity/organization profile is open.
- Logged in with a role permitted to manage the organization's team.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | On the organization's profile, locate the "Team" header. | Team section is visible, showing any existing organization team members. |
| 2  | Click the "+" icon next to the Team header. | A form/popup opens to add a new organization team member. |
| 3  | Enter the new team member's name and email. | Fields accept input. |
| 4  | Submit the form. | New organization team member is saved. |

#### Expected Results
- The new team member appears under the "Team" section of this specific organization's profile, and does NOT appear in the platform-level Admin Settings team member list.

#### Acceptance Criteria
- Organization-level team member is scoped only to this organization's profile access, confirming it is distinct from platform-level Admin Settings team members.

---

### TC24 - Attempt to add an organization team member with missing required fields

#### Objective
Validate required-field validation when adding an organization-level team member.

#### Pre-Conditions
- An entity/organization profile is open.
- The "+" icon add-team-member form is open.

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Leave the name and/or email field blank. | No auto-fill occurs. |
| 2  | Submit the form. | The system blocks submission and displays a validation error for the missing field(s). |

#### Expected Results
- No organization team member is added while required fields are missing.

#### Acceptance Criteria
- Error message clearly identifies which field(s) are required.

---

### TC25 - Verify permission restrictions on entity creation and editing

#### Objective
Validate that a user without adequate permissions cannot create new entities or edit entity attributes.

#### Pre-Conditions
- A team member account exists with a restricted access level (per the platform's permission model for this action).

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | Log in as the restricted team member. | Login succeeds. |
| 2  | Navigate to "Grantees" and attempt to click "New Entity." | Action is unavailable, or attempting it returns a permission-denied error. |
| 3  | Open an existing organization's profile and attempt to click "Edit Attributes." | Action is unavailable, or attempting it returns a permission-denied error. |

#### Expected Results
- Users without the required access level cannot create entities or edit organization attributes.

#### Acceptance Criteria
- No entity creation or attribute edit succeeds for a restricted user; a clear permission error or absence of the control is observed.
