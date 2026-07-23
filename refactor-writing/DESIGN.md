# Refactor Writing Report Implementation Guide

System ID: `refactor-writing-report`
Revision: `8`
Maturity: Operational Design System
Supported profile: Portable static HTML report

The complete system rules live in
`references/report-design-system.md`. This guide is the implementation checklist
for agents changing the renderer or its assets.

## Use the shared adapter

- Generate pages with `scripts/render-report.mjs`.
- Load `./artifact.css` and `./artifact.js`; add no network dependency.
- Treat `references/hero-dotted-wave-reference.png` as visual comparison
  material only; never copy or load it at runtime.
- Use `main`, `.page-footer`, `.topbar`, and `.hero` for the page shell.
- Use `.section` and `.section-head` for ordinary content groups.
- Use `.finding` and `.method-step` when a component spans the label rail and
  reading column.
- Use `.document-shell` for exact selectable source or final output.
- Use CSS-generated pseudo-elements for the Verdict signal field and direct
  inline SVG for Copy/Check icons; do not add a raster, sprite, icon font, or
  network asset.

## Preserve the grid contract

- Wide layouts use `--editorial-grid` and `--editorial-gap`.
- Section headings, findings, comparisons, proof groups, and method steps share
  the same reading-column anchor.
- At and below `1024px`, the editorial grid becomes one column.
- At and below `700px`, comparisons and fact lists become one column.
- Keep `110px` scroll margin on catalog sections so anchor navigation clears
  the wrapped sticky Topbar.
- Never repair alignment with a composition-specific margin, transform, or
  duplicated column definition.

## Use semantic tokens

Use only the roles defined in the specification:

- page, content, topbar, control-hover, and Verdict surfaces;
- primary, secondary, changed-span, and Verdict text;
- quiet and strong rules, action, action wash, confirmed state, changed span,
  and focus;
- maximum width, prose measures, label rail, editorial gap, page gutters,
  control size, section and Hero spacing;
- prose and evidence type families;
- content/control radius, rule/focus geometry, and no elevation;
- reveal, spotlight, and particle duration, frame cap, distance, easing, and
  radius.

Map every color role in Light, Mid, Dark, print, and forced-colors contexts.
Add a role to the specification before adding a raw visual value.

## Follow component rules

- A report finding keeps index, title, Original/Proposal comparison, proof, and
  textual status in that order.
- `mark` identifies only the exact changed span.
- Status and current navigation state remain understandable without color.
- Copy controls enhance a document that is already readable and selectable;
  Copy and Check icons always retain visible Copy/Copied text.
- Reveal motion is automatic. Do not add a global motion toggle.
- Spotlight enhances closed outlined components, preserves the base border,
  follows fine pointers, centers for keyboard focus, and does not track touch.
- Dark, Mid, and Light modes remap semantic roles without changing component
  anatomy or meaning.
- The Hero uses the procedural 476-particle inline SVG, remains full-width
  behind the normal content container, loops seamlessly over 32 seconds at no
  more than 30fps, pauses updates offscreen, renders one static reduced-motion
  frame, and removes the decoration from print.
- Verdict uses the specified CSS signal field: a restrained semantic gradient
  composition plus a sparse micro-grid. Its transform-only drift is
  decorative, pointer-inert, static with reduced motion or no JavaScript, and
  removed from print and forced colors.
- The catalog documents real tokens, primitives, icons, components, patterns,
  states, effects, valid uses, invalid uses, and all profile fallbacks. Do not
  present catalog-only imitations or unsupported states as production.
- The icon catalog exposes enlarged path geometry, shared construction rules,
  and the complete production-size ramp. The motion catalog visualizes timing,
  distance, easing, cadence, effect geometry, ambient loops, and reduced-motion
  equivalence; token names without an inspectable specimen are incomplete.
- Pattern cards respond to their own inline size: horizontal above `440px`,
  vertical at `440px` and below. Steps wrap, arrows preserve sequence, and
  Pattern flows never scroll or clip.
- All generated navigation and assets remain same-folder relative links.
- The output directory must not be a symbolic link. Renderer-owned destinations
  must be regular files or absent; unknown invocation-folder files are
  preserved.
- Generate and validate all six owned files in a sibling staging directory
  before replacing the prior owned files. `--allow-inside-source` is the only
  permitted source-containment override.

## Prevent these deviations

Reject `RW-01` grid drift, `RW-02` evidence separation, `RW-03` viewport
overflow, `RW-04` color-only meaning, `RW-05` motion lockout, `RW-06` copy
dependency, `RW-07` portability break, `RW-08` token fork, `RW-09` motion
excess, `RW-10` affordance substitution, `RW-11` input-exclusive effect,
`RW-12` effect leakage, `RW-13` mode drift, `RW-14` icon ambiguity, `RW-15`
catalog fiction, and `RW-16` material shortcut.

## Completion checks

1. Render findings and no-change fixtures.
2. Inspect `report.html`, `skill.html`, `how-it-works.html`, and
   `design-system.html` at desktop, tablet, and phone widths.
3. Check relative navigation, all three color modes, Copy/Copied behavior,
   automatic reveal, no motion toggle, pointer/focus spotlight, keyboard focus,
   console, overflow, long content, and icon labeling.
4. Check reduced motion, touch, no JavaScript, forced colors, and print.
5. Confirm the procedural Hero has no raster dependency, the Verdict field has
   no image or SVG payload, and the shared CSS/JavaScript and real production
   catalog specimens stay aligned.
6. Confirm the Verdict field pauses through reduced-motion and no-JavaScript
   fallbacks, disappears in print and forced colors, and that Copy and Check
   are the only interface icons.
7. Confirm the icon blueprints and motion token instrument remain legible in
   all three modes at desktop, tablet, and phone widths.
8. Run `node scripts/validate-skills.mjs` and `git diff --check`.
