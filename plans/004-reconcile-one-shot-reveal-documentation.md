# Plan 004: Reconcile reveal documentation with one-shot behavior

> **Executor instructions**: This is a documentation and contract-alignment
> plan. Do not change the one-shot JavaScript behavior unless a test proves it
> violates the stated accessibility fallback.
>
> **Drift check (run first)**:
> `git diff --stat 9ebe015 -- refactor-writing/SKILL.md refactor-writing/DESIGN.md refactor-writing/references/report-design-system.md refactor-writing/assets/report/design-system.html refactor-writing/assets/report/artifact.js tests/refactor-writing`

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/001-establish-renderer-characterization-tests.md`
- **Category**: docs / bug
- **Planned at**: commit `9ebe015` plus live working tree, 2026-07-23

## Why this matters

The mobile-safe implementation reveals each element once and then stops
observing it. The specification still says visibility is toggled, and the skill
asks agents to inspect reverse-scroll reveals. Those phrases can lead a future
executor to restore repeated hiding and the tall-section lockout that Revision
8 corrected.

## Current state

- `artifact.js:167-175` adds `.is-visible` once and calls
  `observer.unobserve(entry.target)`.
- `report-design-system.md:188-191` says JavaScript “toggles”
  `.is-visible`.
- `SKILL.md:64` asks for “reverse scroll reveals.”
- The catalog effect contract correctly says the trigger is first entry above
  the lower 12% viewport boundary.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Drift search | `rg -n "reverse scroll|toggles .is-visible|toggle.*is-visible" refactor-writing` | No stale behavior claims |
| Tests | `node --test tests/refactor-writing/*.test.mjs` | All pass |
| Validation | `node scripts/validate-skills.mjs && git diff --check` | Exit 0 |

## Scope

**In scope**:

- `refactor-writing/SKILL.md`
- `refactor-writing/DESIGN.md`
- `refactor-writing/references/report-design-system.md`
- `refactor-writing/assets/report/design-system.html` only if visible wording is stale
- `tests/refactor-writing/render-report.test.mjs` for contract assertions

**Out of scope**:

- `artifact.js` behavior changes.
- Replay-button behavior; catalog replay remains repeatable.
- Motion durations, distances, or easing.
- Reintroducing a global motion control.

## Git workflow

- Branch: `codex/improve-004-reveal-docs`
- Commit message: `docs(refactor-writing): specify one-shot reveals`
- Do not push from this advisor workflow.

## Steps

### Step 1: State the reveal lifecycle consistently

Use this contract everywhere:

- content is visible before enhancement;
- an observed element reveals once when it first enters above the lower 12%
  viewport boundary;
- it remains visible after leaving the viewport;
- tall sections must not depend on intersection ratio;
- reduced motion and no JavaScript render all content immediately;
- only catalog replay controls repeat a specimen animation.

Replace “reverse scroll reveals” with a check that already revealed content
stays visible during reverse scrolling.

**Verify**:
the drift-search command returns no stale behavior claims.

### Step 2: Add a source-contract assertion

In Plan 001's tests, assert the runtime contains both
`observer?.unobserve(entry.target)` and the lower viewport root margin, and the
specification contains “reveals once” or equivalent wording.

This is intentionally a narrow source contract; browser behavior remains part
of manual/visual QA until a browser harness is adopted.

**Verify**:
focused tests pass.

## Test plan

Add only contract assertions needed to prevent a future textual or behavioral
reversion. Do not add snapshots for prose.

## Done criteria

- [ ] All instructions describe one-shot reveal behavior.
- [ ] Reverse scrolling is described as persistent visibility, not replay.
- [ ] Reduced-motion and no-JavaScript fallbacks remain explicit.
- [ ] Runtime source contract is tested.
- [ ] Validation commands pass.

## STOP conditions

- A current product decision explicitly requires repeated viewport reveals.
- Aligning the docs would require changing the runtime.
- The tall-section visibility regression is not covered by preserved QA
  evidence.

## Maintenance notes

Automatic production reveal and catalog replay are separate responsibilities.
Future documentation must not use “replay” for ordinary page scrolling.
