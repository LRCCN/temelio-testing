You are a Senior QA Analyst experienced in functional software testing.

Your task is to create a complete Test Case document for the system described below, strictly following the instructions and template provided.

---

## System Information

**System name:** Temelio

**Description:** Temelio is a platform that helps both foundations and nonprofits manage the grantmaking lifecycle. Foundations can create application forms, move submissions through a review pipeline, store records in a CRM, track payments, and communicate with applicants and team members. Testing is performed against a foundation's account in Temelio. This test case document covers only the flows documented in `docs/Specs-Functionalities`, described below.

**Modules/Functionalities to cover:**
- **Admin Settings / Team Member Management** — from the foundation's account, open the panel via the double-arrow button next to the foundation name, go to "Admin Settings," and use "Add Team Member" to invite a platform-level team member, filling in their information and assigning an access level (source: `01_How-to-add-a-team-member`).
- **Grantees / Entities (CRM)** — from the "Grantees" tab, use "New Entity" to create an organization by either searching for it via "Find Entity" (auto-populates Organization Name and EIN) or entering the Entity Name manually, optionally add a primary contact and send an email invite, then locate the created organization in the Grantees list, open its profile, edit its attributes, and add organization-level team members via the "+" icon next to the Team header (source: `02_contacts-page`).

**User profiles:** A single foundation-side user account type, differentiated by access level:
- **Admin Access:** Full system access, with the ability to edit settings and all other editable fields.
- **User Access:** Can view all information in the system, add comments and internal notes, and take action on tasks and grantees assigned to them.
- **Payments Access:** Includes all User Access permissions, plus the ability to view grantee payment information and edit the payments page.

**Relevant business rules:**
- **Team member access levels:** every team member invited via Admin Settings must be assigned exactly one of the three access levels above (Admin, User, or Payments Access); the permissions associated with each level must be enforced consistently across the platform.
- **New entity creation:** when adding a new entity, the user can either search for an existing organization via the "Find Entity" field (which auto-populates the "Organization Name" and "EIN" fields) or enter the entity name manually in the "Entity Name" field.
- **Primary contact (optional):** adding the name and email of the entity's primary contact during entity creation is optional; a primary contact (and other team members) can be added later.
- **Email invite:** toggling "Send Email Invite" on sends the primary contact an invitation to complete the organization profile.
- **Organization-level team members:** team members who can access a specific organization's profile are added via the "+" icon next to the Team header on that organization's profile page — this is distinct from platform-level team members added through Admin Settings.
- **Entity attributes:** organization information can be edited at any time via "Edit Attributes" on the organization's profile page.

---

## Testing Scope

Must cover:
- Functional (blackbox) tests
- Positive scenarios (happy path)
- Negative scenarios (errors, invalid data, denied permissions)
- Required field validation
- Business rule validation
- Main and alternative flows
- Permissions and access levels per user profile

Must NOT include:
- Performance testing
- Load or stress testing
- Automated testing
- Advanced security testing

---

## Test Case Template

Each test case must follow exactly this format:

---

### TC[NN] - [Descriptive test case name]

#### Objective
[Clear, objective description of what is being validated.]

#### Pre-Conditions
- [Condition 1]
- [Condition 2]
- [...]

#### Steps

| Id | Action | Expected Result |
|----|--------|------------------|
| 1  | [User action] | [Expected system behavior] |
| 2  | [...] | [...] |

#### Expected Results
- [Describe the expected final state of the system after all steps.]

#### Acceptance Criteria
- [Objective criterion 1]
- [Objective criterion 2]
- [...]

---

## Generation Instructions

1. Number the test cases sequentially: TC01, TC02, TC03...
2. Cover at least the following base flows for each listed module:
   - Successful operation (happy path)
   - Operation with invalid or incomplete data
   - Operation without adequate permission (when applicable)
3. Include test cases for required field validation.
4. Include test cases for each listed user profile, whenever there are distinct behaviors.
5. Be detailed in the steps — each action must be clear enough for anyone to execute the test without doubts.
6. Generate the output in Markdown format, ready to be saved in a `.md` file inside the project's `docs/tests` folder.
