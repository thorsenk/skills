# Prompt Maestro Report Audit

Date: 2026-07-07  
Surface: `http://127.0.0.1:8899/prompt-maestro/report-template.html#findings`  
Destination: `/Users/thorsenk/skills/output/product-design-audits/prompt-maestro-report-2026-07-07`

## Scope

This audit reviews the Prompt Maestro HTML report as a product surface, not only as a static template. The focus is whether the report helps a user understand prompt quality, severity, scoring, classification, and next edits without visual confusion.

Evidence comes only from screenshots captured in this audit run. Accessibility notes are screenshot-based risks, not a full compliance claim.

## Captured Steps

1. `01-verdict-overview.png` — Verdict overview  
   General health: mixed. The score ring and verdict summary are clearer than the earlier broken state, but the first viewport still spends too much vertical space before the user reaches supporting evidence.

2. `02-scorecard-overview.png` — Rubric scorecard  
   General health: mixed. The rubric rows are readable and the numerical hierarchy is clearer, but the single long scorecard makes comparison slow and visually repetitive.

3. `03-findings-collapsed.png` — Findings collapsed  
   General health: mostly healthy. The findings are scannable, ranked, and no longer dump long paragraphs by default. The section still has loose vertical pacing before the next block.

4. `04-finding-expanded.png` — Finding expanded  
   General health: needs refinement. The expanded content is useful, but the expanded state lands with the previous scorecard still occupying the top of the viewport, weakening the feeling of a clean section jump.

5. `05-suggested-edits-collapsed.png` — Suggested edits collapsed  
   General health: weak. The edit cards are clear, but the section is too sparse on desktop and leaves a large empty area that makes the report feel unfinished.

6. `06-mobile-findings.png` — Mobile findings  
   General health: mostly healthy. The mobile layout has no horizontal overflow and the accordion pattern works, but dense card text and pale low-contrast surfaces need keyboard and contrast checks.

## Strengths

- The primary score is now an actual visual component rather than plain text inside a broken oversized ring.
- The report now separates verdict, classification, rubric detail, findings, and edits into recognizable sections.
- Findings and suggested edits use progressive disclosure, which improves scanning.
- The `#findings`, `#scorecard`, and `#edits` anchors land on the intended sections in the captured states.
- Mobile findings reflow into a single column without visible horizontal overflow.

## UX Findings

### High: The first viewport still delays the useful evidence

In `01-verdict-overview.png`, the score, headline, and summary are legible, but the first screen leaves substantial vertical air before the classification and scorecard evidence. The report reads like a presentation cover before it reads like an evaluator.

Recommendation: reduce the hero height and pull either classification metadata or the first two rubric signals into the first viewport.

### High: The scorecard is too long as one repeated pattern

In `02-scorecard-overview.png`, every rubric row uses a similar bar-plus-ring treatment. This makes each row individually readable, but weakens comparison because the user must scan a tall stack of near-identical components.

Recommendation: introduce grouping or a compact summary strip for strongest and weakest dimensions, then keep the detailed rows below.

### Medium: Expanded findings do not feel anchored

In `04-finding-expanded.png`, the expanded finding is visible, but the upper viewport still shows the tail of the scorecard. That creates a discontinuity: the user clicked into findings, but the visual frame still partly belongs to the previous section.

Recommendation: when a finding opens from a hash landing, keep the findings heading and expanded row closer to the top of the viewport, or reduce the inter-section vertical gap above findings.

### Medium: Suggested edits look underfilled

In `05-suggested-edits-collapsed.png`, the three edit rows are useful, but the section has a large empty area below them. On desktop, this makes the report feel unfinished and lowers confidence in the artifact.

Recommendation: add copy preview snippets, affected prompt locations, or a compact before/after view inside the collapsed row area so the section has enough information density.

### Medium: The visual route is more decorative than operational

Across `01-verdict-overview.png`, `02-scorecard-overview.png`, and `03-findings-collapsed.png`, the node/route language is present, but it does not strongly teach flow or state. Users may not understand whether it is navigation, progress, or decoration.

Recommendation: either make the route strip clearly interactive with active state and stronger labels, or simplify it so the sections themselves carry the navigation.

## Accessibility Risks

- Contrast risk: several muted captions, glass borders, and pale icon containers sit on a light gradient. They appear refined, but may fail contrast for low-vision users.
- Motion risk: score-fill and reveal animations need a `prefers-reduced-motion` path verified in browser behavior, not just CSS presence.
- Accordion risk: screenshots show visible summaries, but keyboard focus order, focus outlines, and screen-reader expanded/collapsed state need manual testing.
- Color reliance risk: the rubric and risk model uses blue/gold/red visual meaning. Text labels are present, which helps, but color still does much of the scanning work.
- Target-size risk: chevrons and row controls appear usable, but pointer and keyboard target size should be tested directly.

## Evidence Limits

- Browser DOM snapshot support was unreliable in this environment, so this audit relies on screenshots plus captured scroll and overflow metrics.
- Screenshots can show layout, density, contrast risk, and visible hierarchy, but cannot prove screen-reader behavior or keyboard navigation.
- The saved product-design user context file was missing, so there were no prior brand or design-system preferences to compare against.

## Recommended Next Pass

1. Tighten the top section so the first viewport contains verdict plus one evidence block.
2. Compress the scorecard with a summary strip and grouped detail rows.
3. Reduce inter-section vertical gaps, especially between scorecard, findings, and suggested edits.
4. Make route/navigation affordances clearly interactive or remove the decorative map treatment.
5. Add richer collapsed-state content to suggested edits so the section feels complete.
6. Run keyboard, focus, reduced-motion, and contrast checks after the visual pass.

