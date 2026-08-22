# BUG02 - Sidebar profile widget shows "User" badge regardless of the account's actual access level

**Test type:** Manual testing
**Severity:** Medium
**Status:** Open
**Related test case(s):** TC09, TC11
**Module:** Admin Settings page
**Found by:** Luiz
**Date found:** 2026-08-21
**Environment / URL:** Temelio foundation account ("QA test for Luiz Neto"), Admin Settings / Payments

## Summary
The account profile widget in the bottom-left corner of the sidebar displays a "User" role badge regardless of the logged-in account's actual configured Permissions. Confirmed with two different accounts/permission levels:
- "Luiz Roberto" (`luizitowww@gmail.com`) — Team table shows Permissions = "Admin," sidebar badge shows "User" (TC09).
- "luiz" (`luizitow@hotmail.com`) — Team table shows Permissions = "Payments," sidebar badge shows "User" (TC11).

## Steps to Reproduce
1. Log in as any team member whose Team table Permissions is **not** "User" (e.g., "Admin" or "Payments").
2. Look at the profile widget in the bottom-left corner of the sidebar (avatar + name + role badge).
3. Compare the badge shown there to the "Permissions" column for the same account in Admin Settings > Team.

## Expected Result
The sidebar badge should match the account's actual Permissions value ("Admin," "User," or "Payments").

## Actual Result
The sidebar badge reads "User" in both tested cases, even though the accounts' actual permissions were "Admin" and "Payments" respectively.

## Screenshots / Evidence
- `docs/tests/results/evidence/TC09-Evidence.png` — "Luiz Roberto" badge shows "User"; Team table shows "Admin."
- `docs/tests/results/evidence/TC11-Evidence.png` — "luiz" badge shows "User"; Team table shows "Payments."

## Additional Notes
- This appears to be a **display-only** inconsistency: actual permission enforcement looked correct in both TC09 and TC11 (Admin could edit settings/team members; Payments could view/edit payments). No functional impact on permission enforcement was observed in either case.
- With two data points, "stale cache after an update" looks less likely as the sole explanation, since the badge showed "User" for two different non-User permission levels. A more likely hypothesis: the sidebar badge may always default to/hardcode "User" and never reflects the account's actual Access Type at all. Worth checking with a fresh account created directly with Admin or Payments access (no prior edits) to see if the badge is ever correct for non-User accounts.
- Still worth fixing — an incorrect role badge could confuse team members about their own access level, or make support/troubleshooting harder ("why does it say I'm just a User when I can edit settings/payments?").
