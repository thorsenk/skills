# Refactor Writing Report Implementation Guide

System ID: `refactor-writing-report`
Revision: `1`
Maturity: Operational Design System
Supported profile: Portable static HTML report

The complete system rules live in
`references/report-design-system.md`. This guide is the implementation checklist
for agents changing the renderer or its assets.

## Use the shared adapter

- Generate pages with `scripts/render-report.mjs`.
- Load `./artifact.css` and `./artifact.js`; add no network dependency.
- Use `main`, `.page-footer`, `.topbar`, and `.hero` for the page shell.
- Use `.section` and `.section-head` for ordinary content groups.
- Use `.finding` and `.method-step` when a component spans the label rail and
  reading column.
- Use `.document-shell` for exact selectable source or final output.

## Preserve the grid contract

- Wide layouts use `--editorial-grid` and `--editorial-gap`.
- Section headings, findings, comparisons, proof groups, and method steps share
  the same reading-column anchor.
- At and below `1024px`, the editorial grid becomes one column.
- At and below `700px`, comparisons and fact lists become one column.
- Never repair alignment with a composition-specific margin, transform, or
  duplicated column definition.

## Use semantic tokens

Use only the named roles in `:root`: paper, surface, ink, muted, line, strong
line, accent, accent wash, success, changed span, maximum width, type stacks,
and editorial grid. Add a role to the specification before adding a new raw
visual value.

## Follow component rules

- A report finding keeps index, title, Original/Proposal comparison, proof, and
  textual status in that order.
- `mark` identifies only the exact changed span.
- Status and current navigation state remain understandable without color.
- Copy controls enhance a document that is already readable and selectable.
- Motion is optional, reversible, and reduced-motion aware.
- All generated navigation and assets remain same-folder relative links.

## Prevent these deviations

Reject `RW-01` grid drift, `RW-02` evidence separation, `RW-03` viewport
overflow, `RW-04` color-only meaning, `RW-05` motion lockout, `RW-06` copy
dependency, `RW-07` portability break, and `RW-08` token fork.

## Completion checks

1. Render findings and no-change fixtures.
2. Inspect `report.html`, `skill.html`, `how-it-works.html`, and
   `design-system.html` at desktop, tablet, and phone widths.
3. Check relative navigation, copy and motion state, keyboard focus, console,
   overflow, long content, reduced motion, no-JavaScript content, and print.
4. Confirm the design-system catalog uses the same `artifact.css`.
5. Run `node scripts/validate-skills.mjs` and `git diff --check`.
