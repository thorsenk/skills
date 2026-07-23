# Plan 005: Complete catalog component and pattern contracts

> **Executor instructions**: Preserve the restrained editorial layout. Add
> inspectable implementation information without turning the catalog into a
> wall of repeated prose. Update the index when complete.
>
> **Drift check (run first)**:
> `git diff --stat 9ebe015 -- refactor-writing/DESIGN.md refactor-writing/references/report-design-system.md refactor-writing/assets/report/design-system.html refactor-writing/assets/report/artifact.css refactor-writing/scripts/render-report.mjs tests/refactor-writing`

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**:
  `plans/001-establish-renderer-characterization-tests.md`,
  `plans/004-reconcile-one-shot-reveal-documentation.md`
- **Category**: tech-debt / docs
- **Planned at**: commit `9ebe015` plus live working tree, 2026-07-23

## Why this matters

The specification promises complete primitive, component, and reusable-pattern
contracts, but the visible catalog often provides only purpose, anatomy, and an
invalid example. Missing selectors, token dependencies, profile applicability,
fallbacks, and accessibility rules force executors back into CSS and Markdown.
The catalog should be a reliable implementation reference while remaining
visually scannable.

## Current state

- `report-design-system.md:294-298` requires every primitive to document
  purpose, selector, tokens, variants, states, responsive behavior,
  accessibility, fallback, valid use, and invalid use.
- `report-design-system.md:386-396` sets the equivalent component contract.
- `report-design-system.md:440-443` requires each pattern to document problem,
  sequence, variation, responsive behavior, accessibility/resilience, and
  invalid combinations.
- `design-system.html:246-253` gives primitive cards only a specimen, short
  purpose, selector, and invalid note.
- `design-system.html:390-469` gives component entries inconsistent subsets.
- `design-system.html:480-485` gives pattern cards a sequence and one sentence.

The catalog uses flat square surfaces, one-pixel rules, semantic tokens, and
the shared editorial grid. Preserve those decisions.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Tests | `node --test tests/refactor-writing/*.test.mjs` | All pass |
| Render check | `node refactor-writing/scripts/render-report.mjs --help` | Exit 0 |
| Validation | `node scripts/validate-skills.mjs` | Exit 0 |
| Syntax | `node --check refactor-writing/assets/report/artifact.js` | Exit 0 |
| Whitespace | `git diff --check` | No output |

## Scope

**In scope**:

- `refactor-writing/assets/report/design-system.html`
- `refactor-writing/assets/report/artifact.css`
- `refactor-writing/DESIGN.md`
- `refactor-writing/references/report-design-system.md`
- `refactor-writing/scripts/render-report.mjs`
- `tests/refactor-writing/render-report.test.mjs`

**Out of scope**:

- Adding unsupported controls, states, components, icons, or profiles.
- Changing production component anatomy.
- Adding cards merely to increase catalog size.
- A framework, template engine, or client-side catalog generator.
- Raw mode-specific colors or new visual materials.

## Git workflow

- Branch: `codex/improve-005-catalog-contracts`
- Commit message: `feat(refactor-writing): complete catalog contracts`
- Do not push from this advisor workflow.

## Steps

### Step 1: Define compact contract anatomy

Add reusable catalog-only structures:

- `.contract-summary` for primitive and pattern metadata;
- `<dl>` rows with consistent `<dt>` labels and `<dd>` values;
- `data-contract-kind="primitive|component|pattern"` on each contract owner.

Required primitive labels:

`Selector`, `Tokens`, `States`, `Responsive`, `Accessibility`, `Fallback`,
`Valid`, `Invalid`.

Required component labels:

`Profile`, `Selector`, `Purpose`, `Anatomy`, `Tokens`, `Variants / states`,
`Responsive`, `Accessibility`, `Fallbacks`, `Valid`, `Invalid`.

Required pattern labels:

`Problem`, `Sequence`, `Variation`, `Responsive`, `Accessibility / resilience`,
`Invalid`.

Group closely related facts in one visible row where needed, but do not omit a
required label.

**Verify**:
`rg -c 'data-contract-kind=' refactor-writing/assets/report/design-system.html`
→ count equals the documented primitive, component, and pattern entries.

### Step 2: Complete primitives without inventing behavior

For each existing primitive, derive token and behavior facts from the production
selector in `artifact.css`. Use `Not applicable` only when a category genuinely
does not apply, and explain why in a few words.

Keep production specimens intact. Inert demonstration buttons must be labeled
as focus/appearance specimens, not as functioning copy actions.

**Verify**:
the contract test from Step 5 reports no missing primitive labels.

### Step 3: Complete component contracts

Add the production selector and token dependencies to every component entry.
Document print, forced-colors, reduced-motion, touch, and no-JavaScript behavior
only where relevant. Link page-level specimens with existing same-page anchors
or “top of this page” labels; do not duplicate them.

Do not claim unsupported loading, disabled, menu, tooltip, disclosure, or
form-field states.

**Verify**:
the contract test reports no missing component labels and no unsupported-state
terms inside component contracts.

### Step 4: Complete reusable-pattern contracts

Keep the visible sequence flow. Add compact metadata below each flow for the
communication problem, allowed variation, responsive rule, accessibility and
resilience rule, and invalid combination.

Every pattern must remain readable at its own container width. Do not add
horizontal scrolling.

**Verify**:
the contract test reports no missing pattern labels.

### Step 5: Add structural contract tests

Extend Plan 001's tests to parse the static catalog sufficiently to assert:

- every `data-contract-kind` entry includes the required label set;
- selectors referenced in the catalog occur in the production CSS or generated
  HTML;
- no unsupported-state vocabulary is introduced as a supported contract;
- the catalog verifier requires the three contract kinds.

Use simple deterministic HTML string/regex checks; do not add an HTML parser
dependency.

**Verify**:
focused tests pass.

### Step 6: Increment the system revision

This materially expands catalog anatomy. Increment Revision 8 to Revision 9 in
`DESIGN.md`, the system specification, visible catalog hero/footer, and
renderer contract messages. Update the current evidence date only if execution
occurs on a later date.

**Verify**:
`rg -n "revision 8|Revision: .8." refactor-writing`
→ no stale Revision 8 identifiers remain except an intentional migration note,
if one is added.

### Step 7: Run visual and package verification

Render both Plan 001 fixtures. Inspect catalog primitives, components, and
patterns at 1280px, 768px, and 390px in Light, Mid, and Dark. Check zero
horizontal overflow, keyboard focus, reduced motion, print, and no JavaScript.

**Verify**:
all command-table checks pass; record screenshots outside the package source.

## Test plan

Automated tests enforce contract label completeness and selector validity.
Manual browser QA checks content density, card height, navigation anchors,
responsive stacking, and mode contrast.

## Done criteria

- [ ] Every existing primitive, component, and pattern satisfies its declared
  contract.
- [ ] No unsupported capability was added.
- [ ] Contract metadata remains readable at phone width without overflow.
- [ ] Revision 9 is consistent across all package surfaces.
- [ ] Renderer and package tests pass.

## STOP conditions

- Completing a contract requires inventing an unsupported production behavior.
- The page becomes meaningfully harder to scan and no compact grouping preserves
  the required information.
- A selector in the specification has no production implementation.
- Completing the work requires a framework or runtime catalog dependency.

## Maintenance notes

New catalog entries must use the same `data-contract-kind` structure so tests
can enforce completeness. The catalog should grow only when production
responsibility grows.
