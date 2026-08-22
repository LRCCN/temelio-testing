# BUG05 - Entity's Primary Contact Email field accepts malformed addresses with no validation

**Test type:** Manual testing
**Severity:** Medium
**Status:** Open
**Related test case(s):** TC18
**Module:** Contacts page (Grantees / Entities)
**Found by:** Luiz
**Date found:** 2026-08-21
**Environment / URL:** Temelio foundation account ("QA test for Luiz Neto"), Contacts > Grantees > New Entity

## Summary
The "Primary Contact Email" field on the New Entity form accepts a malformed email address (`-@hotmail.com`) with no client-side or server-side validation error, and successfully saves it to the entity's Team/contact record. This is inconsistent with the equivalent email field in Admin Settings > Add Team Member (see TC05), which correctly rejects malformed formats with an inline "Please enter a valid email address" error.

## Steps to Reproduce
1. Click "Grantees" then "New Entity."
2. Enter an Entity Name (e.g., "invalidEmail").
3. Enter Primary Contact Name: "Test."
4. Enter Primary Contact Email: `-@hotmail.com`.
5. Click "Create Contact."

## Expected Result
The email field should reject the malformed address, consistent with the validation already present on the Admin Settings > Add Team Member email field (TC05) — e.g., "Please enter a valid email address," blocking submission until corrected.

## Actual Result
No validation error appears at any point. The entity is created successfully, and the malformed email `-@hotmail.com` is saved and displayed as the contact's email on the entity's profile page (Team section).

## Screenshots / Evidence
`docs/tests/results/evidence/TC18-Evidence.png` — shows the created entity "invalidEmail" with Team member "Test," Email `-@hotmail.com` saved and displayed with no error indicator.

## Additional Notes
- Likely impact: if "Send Email Invite" is used with a malformed address like this, the invite would fail to deliver silently (worth a follow-up test: create an entity with a malformed email AND "Send Email Invite" ON, and confirm whether it fails silently or surfaces an error).
- Recommend reusing the same email-format validation logic already implemented for the Admin Settings > Add Team Member form (TC05) on this field, for consistency.
- Consider testing other malformed formats here too (missing @, missing domain, etc.) to see if this is a complete absence of validation or specific to this pattern.
