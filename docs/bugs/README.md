# Bug Reports — Admin Settings Page & Contacts Page

Bugs found during **manual testing** (Task 1). This folder holds one bug report file per issue
found while executing `docs/tests/results/manual-test-execution-admin-settings-contacts.md`.

## How to log a new bug

1. Copy `BUG-TEMPLATE.md`.
2. Rename it `BUG##-short-title.md`, using the next sequential number (e.g. `BUG01-duplicate-entity-allowed.md`).
3. Fill in all fields.
4. Add a row to the index table below.
5. In the execution report, add the Bug ID to the `Bug ID(s)` column for the failing TC.

## Index

| Bug ID | Title | Severity | Related TC(s) | Status |
|--------|-------|----------|----------------|--------|
| [BUG01](BUG01-duplicate-email-overwrites-existing-team-member.md) | Adding a team member with an existing email silently overwrites the existing member instead of showing a duplicate error | High | TC06 | Open |
| [BUG02](BUG02-sidebar-role-badge-shows-wrong-access-level.md) | Sidebar profile widget shows "User" badge regardless of the account's actual access level | Medium | TC09, TC11 | Open |
| [BUG03](BUG03-global-search-returns-no-results.md) | Global search bar returns no results for a term that should match existing data | Medium | N/A (exploratory) | Open |
| [BUG04](BUG04-raw-error-message-on-missing-entity-name.md) | Missing Entity Name validation shows a raw/technical error message with a typo | Low | TC17 | Open |
| [BUG05](BUG05-entity-primary-contact-email-not-validated.md) | Entity's Primary Contact Email field accepts malformed addresses with no validation | Medium | TC18 | Open |
| [BUG06](BUG06-session-expires-silently-after-short-idle.md) | User session silently expires after a few minutes of inactivity, breaking background requests with no warning | High | N/A (exploratory); likely root cause of BUG03 | Open |
| [BUG07](BUG07-no-duplicate-entity-detection.md) | No duplicate detection when creating a new entity, including exact EIN duplicates | Medium | TC13, TC19 | Open |

**Severity scale:** Critical (blocks core flow / data loss) · High (major function broken, workaround exists) · Medium (minor function broken or wrong behavior) · Low (cosmetic / copy / polish)

**Status values:** Open · In Progress · Fixed · Won't Fix · Duplicate

## Note on evidence for exploratory bugs
Bugs tied to a specific TC use screenshots from `docs/tests/results/evidence/` (see that folder's `README.md`). Bugs found via exploratory testing, not tied to any TC, use `docs/tests/results/bugs-evidence/` instead.
