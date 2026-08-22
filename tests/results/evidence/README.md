# Evidence — Screenshots for Manual Test Execution

Store screenshots/screen recordings referenced by
`Task 1 - manual-test-execution-admin-settings-contacts.md` here.

## Naming convention

`TC##-##.png` — TC ID, then a sequence number if a test case needs more than one image.

Examples:
- `TC01-01.png` — first (and only) screenshot for TC01
- `TC17-01.png`, `TC17-02.png` — two screenshots for TC17 (e.g., empty form + validation error)

## Referencing an image in the execution report

Add it under that TC's **Notes / Evidence / Bugs Found** section using a Markdown image link:

```
![TC01 - validation error](evidence/TC01-01.png)
```

For bugs, the same screenshot can also be linked from the corresponding file in `docs/bugs/`.
