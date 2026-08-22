# BUG06 - User session silently expires after a few minutes of inactivity, breaking background requests with no warning

**Test type:** Manual testing (exploratory — not tied to a specific TC in the test case spec)
**Severity:** High
**Status:** Open
**Related test case(s):** N/A — found via exploratory testing; likely root cause of BUG03
**Module:** Platform-wide (session/auth), observed from Contacts page
**Found by:** Luiz
**Date found:** 2026-08-21
**Environment / URL:** `https://app-dev.trytemelio.com/foundation/2c776668-d179-43f3-8b0f-40828d6d3266/contacts`

## Summary
After a few minutes without any interaction, the user's session becomes invalid, and subsequent API calls (e.g., the search feature) fail with a Clerk authentication error — but the app gives no visible indication that the session expired or that re-authentication is needed. The already-rendered page keeps displaying stale content normally, masking the failure.

## Steps to Reproduce
1. Log in and navigate to the Contacts page (or any page).
2. Leave the browser idle for a few minutes without interacting with the app.
3. Open DevTools > Network tab.
4. Perform an action that triggers a background request (e.g., use the search bar).
5. Observe the failed requests and their response bodies.

## Expected Result
Either the session should remain valid during normal short idle periods, or — if it must expire — the user should see a clear, visible prompt to re-authenticate (e.g., a "Your session has expired, please log in again" banner/redirect) rather than having features silently fail in the background.

## Actual Result
Network tab shows multiple failed requests:
- Two `search` requests return errors with response body:
  ```json
  {
    "errors": [
      {
        "message": "Session not found",
        "long_message": "No session was found with id sess_3IEqy6JqVqjrM3cmI13deF...",
        "code": "resource_not_found"
      }
    ],
    "clerk_trace_id": "6fd5915b53628599cc8bbe631889682f"
  }
  ```
- Multiple `tokens?__clerk_api_version=...` requests also fail (shown in red in the Network tab), consistent with the Clerk session/token refresh failing.
- Meanwhile, the Contacts page itself continues to display its already-loaded content (Manual-Test, A Test For A Test x2, invalidEmail) with no visible error, banner, or redirect to a login page.

## Screenshots / Evidence
`docs/tests/results/bugs-evidence/sessionNotFound.png` — DevTools Network tab showing the failed `search` and `tokens` requests and the "Session not found" response body.

## Additional Notes
- **Likely root cause of BUG03** (global search returning "We couldn't find anything for 'Proposal'"): if the session had already silently expired by the time that search was run, the empty-results message may actually be masking an auth failure rather than reflecting a real "no matches" case. Worth re-testing BUG03's search scenario immediately after a fresh login (session guaranteed valid) to see if results come back correctly — that would confirm this as the shared root cause.
- The "few minutes" timeframe is notably short for a session timeout during active testing (idle, not logged out). Worth confirming the actual configured session/token TTL and whether this matches intended behavior or is a misconfiguration.
- Recommend: (1) surface a visible re-authentication prompt when the session is detected as invalid, and/or (2) silently refresh the session/token in the background before it fully expires, so short idle periods during normal use don't cause failures.
