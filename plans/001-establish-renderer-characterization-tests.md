# Plan 001: Establish renderer characterization tests

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before continuing.
> Update the status row in `plans/README.md` when complete. Do not improvise
> past a STOP condition.
>
> **Drift check (run first)**:
> `git diff --stat 9ebe015 -- refactor-writing scripts/validate-skills.mjs .github/workflows/validate.yml tests/refactor-writing`
> This plan was written against commit `9ebe015` plus the uncommitted Revision 8
> working tree. If the Revision 8 catalog or required untracked assets are
> absent, stop and preserve the audited working tree before continuing.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests / dx
- **Planned at**: commit `9ebe015` plus live working tree, 2026-07-23

## Why this matters

CI currently proves registry shape and Markdown links, but it never executes
the `refactor-writing` renderer. The system specification requires both report
branches, four generated pages, source hashing, local links, accessibility
states, and resilience checks. Characterization tests must land before the
renderer or catalog is hardened so later executors have a machine-checkable
safety net.

## Current state

- `.github/workflows/validate.yml:15` runs only
  `node scripts/validate-skills.mjs`.
- `scripts/validate-skills.mjs:185-206` checks registered files and Markdown
  links; it does not execute `render-report.mjs`.
- `refactor-writing/references/report-design-system.md:543-569` requires a
  multi-finding fixture, no-change fixture, four-page inspection, interaction
  fallbacks, and renderer validation.
- `refactor-writing/scripts/render-report.mjs:310-350` is a CLI module that
  reads JSON, writes four HTML pages and two assets, and prints its result.

Repository conventions:

- Use Node 22 and built-in modules; there is no `package.json`.
- Keep the package dependency-free.
- Run `node scripts/validate-skills.mjs` after changes.
- Match the existing conventional commit style, for example
  `feat(refactor-writing): add report design system`.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Package validation | `node scripts/validate-skills.mjs` | Prints validated package counts; exit 0 |
| Renderer tests | `node --test tests/refactor-writing/*.test.mjs` | All tests pass; exit 0 |
| Syntax | `node --check refactor-writing/scripts/render-report.mjs && node --check refactor-writing/assets/report/artifact.js` | No output; exit 0 |
| Whitespace | `git diff --check` | No output; exit 0 |

## Scope

**In scope**:

- `tests/refactor-writing/render-report.test.mjs` — create
- `tests/refactor-writing/fixtures/multi-finding.json` — create
- `tests/refactor-writing/fixtures/no-change.json` — create
- `.github/workflows/validate.yml`
- `scripts/validate-skills.mjs` only if needed to invoke the new test command

**Out of scope**:

- Renderer behavior changes; characterize current behavior first.
- Browser screenshot dependencies or a new package manager.
- Other skill packages and their tests.
- CSS or design-system visual changes.

## Git workflow

- Branch: `codex/improve-001-renderer-tests`
- Commit message: `test(refactor-writing): add renderer fixtures`
- Do not push or open a pull request from this advisor workflow.

## Steps

### Step 1: Add deterministic input fixtures

Create one valid multi-finding input and one valid zero-finding input using the
schema printed by `render-report.mjs --help`.

The multi-finding fixture must contain at least two findings, HTML-significant
characters in ordinary text, redactions, assumptions, and repeated prose that
does not make the selected target ambiguous. The no-change fixture must use
`finalOutput.heading: "No change recommended"` and return the complete
unchanged source.

Do not include machine-specific absolute paths. Use descriptive portable paths
such as `/portable/source/input.md`.

**Verify**:
`node -e "for (const f of ['tests/refactor-writing/fixtures/multi-finding.json','tests/refactor-writing/fixtures/no-change.json']) JSON.parse(require('node:fs').readFileSync(f,'utf8'))"`
→ exit 0.

### Step 2: Add Node built-in integration tests

Create `render-report.test.mjs` with `node:test`, `assert/strict`,
`child_process.execFile`, and temporary directories under `os.tmpdir()`.

For both fixtures:

1. invoke the real renderer as a subprocess;
2. assert exit code 0;
3. assert exactly the expected generated files exist;
4. assert all four pages use `./artifact.css` and `./artifact.js`;
5. assert navigation targets exist and contain one matching
   `aria-current="page"`;
6. assert the embedded `SKILL.md` text and reported SHA-256 match the supplied
   skill file;
7. assert the multi-finding page contains exact escaped text and expected
   `<mark>` spans;
8. assert the no-change page contains zero `.finding` articles and the complete
   unchanged output;
9. assert every non-data `href`/`src` is same-folder relative and resolves to a
   generated file.

Add negative cases for missing required fields, incorrect final-output heading,
target text not found, output inside `sourceWorkspace`, and HTML-significant
input escaping.

Use subprocess execution rather than importing the CLI module because importing
currently runs `main()`.

**Verify**:
`node --test tests/refactor-writing/*.test.mjs`
→ all named cases pass.

### Step 3: Put renderer tests in CI

Add separate workflow steps for syntax checks and the Node tests after the
existing package validation. Keep Node 22 and do not add install steps.

**Verify**:
`sed -n '1,80p' .github/workflows/validate.yml`
→ visibly contains package validation, syntax checks, and renderer tests.

### Step 4: Run the complete baseline

Run all commands in the command table.

**Verify**: every command exits 0 and `git status --short` lists only the
in-scope files plus pre-existing user changes.

## Test plan

The new integration file is the test plan. It must cover:

- multi-finding success;
- no-change success;
- exact output file set and local-link resolution;
- skill embedding and hash;
- HTML escaping;
- malformed schema;
- wrong final heading;
- missing target;
- lexical source-workspace rejection.

Do not add screenshot assertions in this plan.

## Done criteria

- [ ] `node --test tests/refactor-writing/*.test.mjs` passes.
- [ ] CI executes the renderer tests and both JavaScript syntax checks.
- [ ] Both report branches have deterministic fixtures.
- [ ] No package-manager or third-party dependency was introduced.
- [ ] `node scripts/validate-skills.mjs` and `git diff --check` pass.
- [ ] No out-of-scope files were modified.

## STOP conditions

- The Revision 8 renderer/catalog files are absent from the execution branch.
- A test requires changing production behavior to pass; record the mismatch
  instead and leave production unchanged.
- The only viable approach requires installing a third-party test framework.
- Existing user changes overlap an in-scope file and cannot be preserved.

## Maintenance notes

Every future renderer defect should first receive a failing case in this suite.
Keep fixtures descriptive and portable; never place private source content,
credentials, or machine-specific paths in committed fixtures.
