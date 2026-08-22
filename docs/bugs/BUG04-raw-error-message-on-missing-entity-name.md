# BUG04 - Missing Entity Name validation shows a raw/technical error message with a typo

**Test type:** Manual testing
**Severity:** Low
**Status:** Open
**Related test case(s):** TC17
**Module:** Contacts page (Grantees / Entities)
**Found by:** Luiz
**Date found:** 2026-08-21
**Environment / URL:** Temelio foundation account ("QA test for Luiz Neto"), Contacts > Grantees > New Entity

## Summary
Submitting "Create New Entity" with the Entity Name left blank correctly blocks submission, but the error message shown to the user is a raw/technical string rather than a clean, user-friendly validation message. It also contains a spelling typo.

## Steps to Reproduce
1. Click "Grantees" then "New Entity."
2. Leave "Entity Name" blank (and don't select a "Find Entity" result).
3. Optionally fill in Primary Contact Name/Email and toggle "Send Email Invite."
4. Click "Create Contact."

## Expected Result
A clear, user-friendly validation message, e.g. "Entity Name is required," ideally shown inline next to the field (consistent with how other required-field validation is handled elsewhere in the app, e.g. Admin Settings > Add Team Member in TC04).

## Actual Result
A red banner error is shown: **"Error! An error ocurred: legalName: Legal name must be specified when creating a nonprofit."**
- Typo: "ocurred" should be "occurred."
- Exposes the internal/backend field name `legalName` rather than the UI label "Entity Name."
- Uses the term "nonprofit" even though the entity being created isn't necessarily framed that way elsewhere in this form.

## Screenshots / Evidence
`docs/tests/results/evidence/TC17-Evidence.png` — shows the New Entity form with Entity Name blank and the raw error banner after clicking "Create Contact."

## Additional Notes
- Functionally this is not blocking — submission is correctly prevented, so there's no data-integrity or access-control impact, hence Low severity.
- Purely a polish/consistency issue: contrast with Admin Settings' "Add Team Member" validation (TC04), which shows clean inline messages like "Name is required. Email is required."
