# Temelio QA Assessment

![E2E Tests](https://github.com/LRCCN/temelio-testing/actions/workflows/e2e.yml/badge.svg)

QA assessment covering two functionalities of the Temelio platform — **Admin Settings / Team
Member Management** and **Grantees / Entities (Contacts page)** — against
`https://app-dev.trytemelio.com`. The work is split into two tasks: manual test design/execution
(Task 1), and automating a subset of those scenarios with Playwright (Task 2).

## Repo layout

```
docs/
  specs-functionalities/     Source feature specs (screenshots + steps) the test cases are derived from
  prompts/                   Prompt used to generate the manual test case set
  bugs/                      One report per bug found, plus an index (docs/bugs/README.md)
tests/
  Task_1-Manual Testing/     25 manual test cases (the full scope)
  Task_2-Automation/         Doc mapping the 10 automated test cases to their specs, + setup/run README
  pages/, utils/, auth/      Playwright page objects, test-data helpers, session-capture script
  e2e/                       The automated Playwright specs (+ CI runs these)
  results/                   Manual execution report + screenshot evidence
.github/workflows/e2e.yml    CI pipeline (GitHub Actions)
```

## Task 1 — Manual Testing

**Scope:** 25 test cases across the two modules, derived from the feature specs via
`docs/prompts/prompt-testcase-generator.md`.
**Test cases:** [`tests/Task_1-Manual Testing/test-cases-admin-settings-contacts.md`](<tests/Task_1-Manual Testing/test-cases-admin-settings-contacts.md>)
**Execution report:** [`tests/results/execution/Task 1 - manual-test-execution-admin-settings-contacts.md`](<tests/results/execution/Task 1 - manual-test-execution-admin-settings-contacts.md>)
**Evidence:** [`tests/results/evidence/`](tests/results/evidence/)

**Results:** 17 Pass · 2 Fail · 6 Not Executed (0 Blocked)

### Bugs found

| Bug | Title | Severity | Related TC(s) |
|-----|-------|----------|----------------|
| [BUG01](docs/bugs/BUG01-duplicate-email-overwrites-existing-team-member.md) | Adding a team member with an existing email silently overwrites the existing member instead of showing a duplicate error | High | TC06 |
| [BUG06](docs/bugs/BUG06-session-expires-silently-after-short-idle.md) | User session silently expires after a few minutes of inactivity, breaking background requests with no warning | High | Exploratory; likely root cause of BUG03 |
| [BUG02](docs/bugs/BUG02-sidebar-role-badge-shows-wrong-access-level.md) | Sidebar profile widget shows "User" badge regardless of the account's actual access level | Medium | TC09, TC11 |
| [BUG03](docs/bugs/BUG03-global-search-returns-no-results.md) | Global search bar returns no results for a term that should match existing data | Medium | Exploratory |
| [BUG05](docs/bugs/BUG05-entity-primary-contact-email-not-validated.md) | Entity's Primary Contact Email field accepts malformed addresses with no validation | Medium | TC18 |
| [BUG07](docs/bugs/BUG07-no-duplicate-entity-detection.md) | No duplicate detection when creating a new entity, including exact EIN duplicates | Medium | TC13, TC19 |
| [BUG04](docs/bugs/BUG04-raw-error-message-on-missing-entity-name.md) | Missing Entity Name validation shows a raw/technical error message with a typo | Low | TC17 |

Full index with status/dates: [`docs/bugs/README.md`](docs/bugs/README.md).

## Task 2 — Automation

**Scope:** 10 of the 25 scenarios (5 per module), selected for breadth across happy-path,
validation, and duplicate-handling cases — not exhaustive 1:1 coverage.
**Scenario-to-spec mapping:** [`tests/Task_2-Automation/test-cases-automation-admin-settings-contacts.md`](tests/Task_2-Automation/test-cases-automation-admin-settings-contacts.md)
**Setup & run instructions:** [`tests/Task_2-Automation/README.md`](tests/Task_2-Automation/README.md)

| Module | Automated |
|---|---|
| Admin Settings / Team Member Management | TC01, TC04, TC05, TC06, TC12 |
| Grantees / Entities (Contacts) | TC13, TC14, TC17, TC18, TC19 |

Two of the ten (TC06, TC18) intentionally assert the *spec-compliant* behavior that BUG01 and
BUG05 currently violate, wrapped in `test.fail()` — they show as an expected failure today and
would flip to an **unexpected pass** (the signal to fix the test) if those bugs get resolved.

### Technologies used

- **Playwright + TypeScript** — browser automation and test runner
- **Node.js** — script runtime (session capture, tooling)
- **dotenv** — environment/credential configuration (`.env`, never committed)
- **GitHub Actions** — CI pipeline (`.github/workflows/e2e.yml`), runs on every push/PR to
  `main`/`master` plus manual dispatch

### CI

The pipeline installs Chromium, scripts a login for an Admin-Access account (required) and a
User/Payments-Access account (optional — TC12 self-skips without it) using repo secrets, runs
the full suite, and uploads the HTML report as a build artifact. See the workflow badge above
for current status.
