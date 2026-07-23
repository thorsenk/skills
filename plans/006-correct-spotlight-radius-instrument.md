# Plan 006: Correct the spotlight-radius instrument

> **Executor instructions**: Correct the visualization and terminology without
> changing production spotlight values. This plan completes the Revision 9
> catalog created by Plan 005.
>
> **Drift check (run first)**:
> `git diff --stat 9ebe015 -- refactor-writing/assets/report/design-system.html refactor-writing/assets/report/artifact.css refactor-writing/references/report-design-system.md tests/refactor-writing`

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**:
  `plans/001-establish-renderer-characterization-tests.md`,
  `plans/005-complete-catalog-contracts.md`
- **Category**: docs / bug
- **Planned at**: commit `9ebe015` plus live working tree, 2026-07-23

## Why this matters

CSS radial-gradient sizes are radii. The specification correctly calls the
220px and 120px tokens radii, but the visible motion instrument calls them
diameters and draws unlabeled concentric circles. An executor reading the
catalog could implement a field at half the intended reach.

## Current state

- `report-design-system.md:185-186` says `220px` and `120px` are spotlight
  radii.
- `artifact.css:1305-1308` passes `var(--spotlight-size)` directly as the
  radial-gradient circle size.
- `design-system.html:313` labels the visual “Control and card spotlight
  diameters.”
- The current rings display `220` and `120` without units or a radial measure.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Terminology | `rg -n "spotlight diameters|spotlight diameter" refactor-writing` | No matches |
| Tests | `node --test tests/refactor-writing/*.test.mjs` | All pass |
| Validation | `node scripts/validate-skills.mjs && git diff --check` | Exit 0 |

## Scope

**In scope**:

- `refactor-writing/assets/report/design-system.html`
- `refactor-writing/assets/report/artifact.css`
- `refactor-writing/references/report-design-system.md` only if wording needs
  clarification
- `tests/refactor-writing/render-report.test.mjs`

**Out of scope**:

- Changing `--spotlight-card-size` or `--spotlight-control-size`.
- Changing pointer/focus behavior or spotlight opacity.
- Adding new spotlight sizes.
- Incrementing the system revision beyond the Revision 9 owned by Plan 005.

## Git workflow

- Branch: `codex/improve-006-spotlight-radii`
- Commit message: `fix(refactor-writing): correct spotlight radius specimen`
- Do not push from this advisor workflow.

## Steps

### Step 1: Correct visible and accessible terminology

Change the instrument's accessible name to “Control and card spotlight radii.”
Label values as `220px radius` and `120px radius`, not bare numbers.

Update nearby explanatory copy to state that CSS radial-gradient circle size is
measured from the center to the fade boundary.

**Verify**:
the terminology command returns no matches and both radius labels occur in the
catalog.

### Step 2: Draw radius measurements

Keep the concentric comparison, but add:

- a visible center point;
- a radial rule from center to each ring edge;
- a compact label aligned to each rule;
- semantic colors and one-pixel geometry only.

The diagram is an inspection reference, not a 1:1 pixel rendering. Preserve the
220:120 proportion. Ensure both labels remain legible in Light, Mid, Dark,
forced colors, and print.

**Verify**:
inspect at desktop and 390px; neither label overlaps or clips.

### Step 3: Lock the terminology in tests

Add assertions that:

- the catalog contains “spotlight radii”;
- `220px radius` and `120px radius` are visible;
- “spotlight diameters” is absent;
- production CSS still maps the two unchanged tokens into
  `--spotlight-size`.

**Verify**:
focused tests pass.

## Test plan

Automated checks prevent terminology drift and token-value changes. Manual
checks cover diagram readability in all modes, forced colors, print, and phone
width.

## Done criteria

- [ ] The catalog and specification both call the values radii.
- [ ] The visual uses radial measurements and preserves the 220:120 ratio.
- [ ] Production spotlight values and behavior are unchanged.
- [ ] Revision remains 9 after Plan 005.
- [ ] All repository checks pass.

## STOP conditions

- CSS behavior shows the value is not a radial-gradient radius.
- Correct labels cannot fit at phone width without hiding exact values.
- Plan 005 has not established Revision 9.

## Maintenance notes

Any future spatial-token instrument must name whether a value is a radius,
diameter, width, height, or distance. “Size” alone is not sufficient in the
visible catalog.
