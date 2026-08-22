# BUG03 - Global search bar returns no results for a term that should match existing data

**Test type:** Manual testing (exploratory — not tied to a specific TC in the test case spec)
**Severity:** Medium
**Status:** Open
**Related test case(s):** N/A — found via exploratory testing while working through Module 2 (Contacts page)
**Module:** Global Search / Navigation (search bar in left sidebar, reachable from any page incl. Contacts)
**Found by:** Luiz
**Date found:** 2026-08-21
**Environment / URL:** Temelio foundation account ("QA test for Luiz Neto"), Contacts page

## Summary
Using the global search bar (top of the left sidebar, `Ctrl+K`) to search for "Proposal" returns zero results ("We couldn't find anything for 'Proposal'"), even though the search is expected to work across the platform's data.

## Steps to Reproduce
1. From the Contacts page (or any page), click the search bar in the sidebar, or press `Ctrl+K`.
2. Type `Proposal` into the search field.
3. Observe the results panel.

## Expected Result
The search should return relevant matches (e.g., proposals, or records/pages related to the term "Proposal"), or otherwise clearly indicate what is/isn't searchable, so results reflect the platform's actual data.

## Actual Result
The search panel shows: *"We couldn't find anything for 'Proposal'. If you don't see what you're looking for, try refreshing and searching again in a few minutes."* with "0 results" and a "Refresh and try again" button — no matches returned.

## Screenshots / Evidence
`docs/tests/results/bugs-evidence/searchBarNotWorking.png` — shows the sidebar search bar location and the empty-results panel for the query "Proposal."

## Additional Notes
- Not yet confirmed whether this affects all search terms (i.e., search is broken entirely) or only certain terms/entity types (e.g., maybe it searches Entities/Contacts but not Proposals). Worth re-testing with a term known to exist verbatim (e.g., an exact entity name like "A Test For A Test," or the proposal title "2026 - Test") to isolate scope.
- Worth checking whether this is a search-indexing delay (the in-app message itself suggests trying again after a few minutes, implying eventual consistency/indexing lag is a known possibility) rather than a hard functional break — if so, severity may be lower than Medium.
- This also exposes a gap in the current test case spec (`docs/tests/Task 1 - Manual Testing/test-cases-admin-settings-contacts.md`): global search isn't covered by any existing TC. Worth adding a dedicated test case for it if search is in scope for this assessment.
- **Possible shared root cause with BUG06:** BUG06 documents the user's session silently expiring after a few minutes of idle time, causing background `search` requests to fail with a Clerk "Session not found" auth error while the page shows no visible error. If this search was run after the session had already expired, the "no results" message may be masking an auth failure rather than a real empty-search-index case. Re-test immediately after a fresh login to confirm whether results return correctly — that would confirm BUG06 as the actual root cause and this could be closed as a duplicate/consequence of it.
