# BUG07 - No duplicate detection when creating a new entity, including exact EIN duplicates

**Test type:** Manual testing
**Severity:** Medium (upgraded from Low after TC19 confirmed EIN-level duplication)
**Status:** Open
**Related test case(s):** TC13, TC19
**Module:** Contacts page (Grantees / Entities)
**Found by:** Luiz
**Date found:** 2026-08-21
**Environment / URL:** Temelio foundation account ("QA test for Luiz Neto"), Contacts > Grantees > New Entity

## Summary
Creating a new entity that matches an existing one succeeds without any warning, merge offer, or block — even when the **EIN itself is an exact duplicate**, not just the entity name. This results in multiple separate entity records representing what appears to be the same organization, sharing the same nominally-unique tax ID.

**Note:** This is not a violation of the documented spec — `docs/Specs-Functionalities/02_contacts-page/How to add a new entity.md` does not mention duplicate detection or prevention at all. This is filed as a product/data-quality concern rather than a confirmed spec violation, per team decision to track it anyway.

## Steps to Reproduce
1. Click "Grantees" then "New Entity."
2. Either:
   - Search "Find Entity" for an organization already in the account (the dropdown result is labeled "Already in your records") and select it, or
   - Manually enter the exact same Entity Name/EIN/Primary Contact as an existing entity.
3. Click "Create Contact."
4. Repeat 2–3 more times with the same data.

## Expected Result
No documented expectation exists. From a product standpoint, one reasonable behavior would be to warn the user ("This entity already exists — view it instead?") or block/merge on an EIN match specifically, since EIN is meant to be a unique tax identifier, rather than silently creating additional records.

## Actual Result
A new, separate entity record is created with no warning, every time. Confirmed with increasing severity:
- TC13: selecting the "Find Entity" result labeled "Already in your records" for "A Test For A Test" (EIN 212121212) still created a new row rather than referencing the existing one.
- TC19: created "Manteqa Global Health" **three times**, all three records sharing the exact same EIN (`85-3601608`) and the exact same Primary Contact ("Luiz R"). No warning or block at any point. As a minor side detail, two of the three records show Entity Type "Individual" while one shows "Organization," despite otherwise identical data.

## Screenshots / Evidence
- `docs/tests/results/evidence/TC13-Evidence.png` — two separate "A Test For A Test" rows with different EIN/Primary Contact values.
- `docs/tests/results/evidence/TC19-Evidence.png` — three separate "Manteqa Global Health" rows, all sharing EIN `85-3601608` and Primary Contact "Luiz R."

## Additional Notes
- Upgraded from Low to Medium because TC19 shows this isn't just name collisions — the system doesn't enforce EIN uniqueness at all, which is a more meaningful data-integrity gap (EIN is a real-world unique tax ID).
- Real-world impact: foundation staff could end up with fragmented records for the same grantee (split funding history, confused reporting, wrong record selected in dropdowns elsewhere in the app) — and with EIN duplication specifically, downstream systems/integrations that assume EIN uniqueness could also be affected.
- Also worth a separate look: the inconsistent "Individual" vs. "Organization" Entity Type across otherwise-identical duplicate records suggests the New Entity form's "Entity is Individual" toggle state may not be resetting consistently between submissions.
- If intended behavior is confirmed (duplicates allowed on purpose), this can be closed as "Won't Fix" — otherwise, recommend at minimum blocking/warning on exact EIN matches.
