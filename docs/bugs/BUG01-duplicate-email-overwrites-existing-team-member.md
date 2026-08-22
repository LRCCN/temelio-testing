# BUG01 - Adding a team member with an existing email silently overwrites the existing member instead of showing a duplicate error

**Test type:** Manual testing
**Severity:** High
**Status:** Open
**Related test case(s):** TC06
**Module:** Admin Settings page
**Found by:** Luiz
**Date found:** 2026-08-20
**Environment / URL:** Temelio foundation account, Admin Settings

## Summary
Submitting "Add Team Member" with an email address that already belongs to an existing team member does not create a duplicate and does not show any "already exists" error. Instead, it silently overwrites the existing team member's record — clearing their Title and downgrading their Permissions/Access Type to whatever was selected in the new submission.

## Steps to Reproduce
1. In Admin Settings, note an existing team member, e.g. "qa-test-01" — Title: `qa-test-01`, Email: `qa-test-01@mail.com`, Permissions: `Admin`.
2. Click "+ Team Member."
3. Enter Name: `qa-test-01`, Email: `qa-test-01@mail.com` (same email as the existing member above).
4. Leave Title blank.
5. Select Access Type: `User Access`.
6. Click "Add."

## Expected Result
The system should reject the submission with a clear "team member already exists" (or similar) validation error, and the existing team member's data (Title: `qa-test-01`, Permissions: `Admin`) should remain unchanged.

## Actual Result
No error is shown. The popup closes as if successful. The existing "qa-test-01" record is silently overwritten in place:
- Title changed from `qa-test-01` to `--` (cleared)
- Permissions changed from `Admin` to `User`

No new row is added — team count stays the same — but the original member's data and access level are modified without any confirmation or warning.

## Screenshots / Evidence
`docs/tests/results/evidence/TC06-Evidence.png` — shows the team list before submission (qa-test-01 = Admin, Title "qa-test-01"), the Add Team Member popup being submitted with the same email, and the team list after (qa-test-01 = User, Title cleared, row highlighted showing the change).

## Additional Notes
- This is a data-integrity and access-control concern, not just a UX gap: an Admin's permissions can be unintentionally (or maliciously, by anyone with access to the Add Team Member form) downgraded to User just by re-submitting their email with a different access type — no confirmation step, no audit trail visible in the UI.
- The reverse case should also be checked: does resubmitting with `Admin Access` silently *elevate* an existing User/Payments member to Admin? If so, this raises the severity further (privilege escalation with no confirmation).
- Suggested fix: on submit, check for an existing team member with the same email and either (a) block with a clear validation error, or (b) if "edit existing member" is the intended behavior, make it an explicit, confirmed edit flow rather than an implicit side effect of "Add Team Member."
