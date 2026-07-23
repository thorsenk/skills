# Plan 003: Require unambiguous changed-span targets

> **Executor instructions**: Follow the schema and compatibility behavior in
> this plan exactly. Update the plan index when complete.
>
> **Drift check (run first)**:
> `git diff --stat 9ebe015 -- refactor-writing/scripts/render-report.mjs refactor-writing/SKILL.md refactor-writing/references/report-design-system.md tests/refactor-writing`
> Stop if `highlightExact` no longer matches the excerpt below.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: `plans/001-establish-renderer-characterization-tests.md`
- **Category**: bug
- **Planned at**: commit `9ebe015` plus live working tree, 2026-07-23

## Why this matters

Findings promise to highlight exact original and proposed language. The current
renderer silently chooses the first occurrence when the target string repeats,
which can attach a finding to the wrong span. The input contract needs an
explicit occurrence selector only when text is ambiguous.

## Current state

`refactor-writing/scripts/render-report.mjs:100-105`:

```js
function highlightExact(entry, context) {
  const text = requireString(entry, "text", context);
  const target = requireString(entry, "target", context);
  const index = text.indexOf(target);
  if (index < 0) throw new Error(`${context}.target must occur exactly in ${context}.text`);
  return `${escapeHtml(text.slice(0, index))}<mark>${escapeHtml(target)}</mark>${escapeHtml(text.slice(index + target.length))}`;
}
```

The package uses strict validation with contextual error messages. Preserve
that pattern.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Tests | `node --test tests/refactor-writing/*.test.mjs` | All pass |
| Help | `node refactor-writing/scripts/render-report.mjs --help` | Documents `occurrence` |
| Package validation | `node scripts/validate-skills.mjs` | Exit 0 |
| Whitespace | `git diff --check` | No output |

## Scope

**In scope**:

- `refactor-writing/scripts/render-report.mjs`
- `refactor-writing/SKILL.md`
- `refactor-writing/references/report-design-system.md`
- `tests/refactor-writing/render-report.test.mjs`
- fixture files only if an ambiguity case belongs in a fixture

**Out of scope**:

- Approximate, regex, or fuzzy matching.
- Browser-side highlighting.
- Changing finding order or visual markup.
- Requiring occurrence metadata for unique targets.

## Git workflow

- Branch: `codex/improve-003-exact-spans`
- Commit message: `fix(refactor-writing): disambiguate repeated targets`
- Do not push from this advisor workflow.

## Steps

### Step 1: Add repeated-target tests

Add cases where `text` contains the same `target` twice:

- no `occurrence` must fail with an error naming the finding side and number of
  matches;
- `occurrence: 1` marks the first target;
- `occurrence: 2` marks the second target;
- zero, negative, fractional, string, and out-of-range occurrences fail;
- a unique target succeeds with omitted `occurrence`;
- supplying `occurrence: 1` for a unique target is accepted.

Occurrence is one-based because input authors count visible occurrences.

**Verify**:
focused tests fail against the old renderer only for the new cases.

### Step 2: Implement exact occurrence resolution

Collect every non-overlapping target start index. Reject zero matches. When
there is one match, use it and accept omitted or `1`. When there are multiple
matches, require an integer `occurrence` from 1 through the match count.

Use the selected start index to build the escaped text and `<mark>` span.
Error messages must include the context path, match count, and allowed
occurrence range without reproducing the full source text.

**Verify**:
`node --test tests/refactor-writing/*.test.mjs`
→ all repeated-target cases pass.

### Step 3: Update the input contract

Extend the `--help` JSON example:

```json
{"text":"Exact original context","target":"exact target","occurrence":1}
```

Explain in the skill/specification that `occurrence` is optional for a unique
target and required for repeated target text.

**Verify**:
`rg -n "occurrence" refactor-writing/scripts/render-report.mjs refactor-writing/SKILL.md refactor-writing/references/report-design-system.md`
→ help, operating instruction, and system contract all describe the same rule.

## Test plan

The new tests are exact string assertions against rendered `<mark>` placement
and contextual validation errors. Include HTML-significant characters around
the repeated target to prove escaping remains intact.

## Done criteria

- [ ] Ambiguous target text never silently selects the first occurrence.
- [ ] One-based occurrence validation is covered.
- [ ] Existing unique-target fixtures remain unchanged.
- [ ] Help and package documentation agree.
- [ ] All repository checks pass.

## STOP conditions

- Compatibility requires guessing an occurrence for repeated text.
- Matching would need normalization, regexes, or locale-sensitive behavior.
- Plan 001 tests are absent or failing before this change.

## Maintenance notes

If future inputs need overlapping or normalized matches, introduce a separate
schema revision rather than changing the meaning of `occurrence`.
