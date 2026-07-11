# Prompt Maestro Visual Report

Produce a standalone HTML report by default. The report is the main deliverable, not an optional supplement.

## Acceptance Criteria

The visual report is complete only when it has:

- A long-scroll structure with separate sections for verdict, classification, scorecard, findings, suggested edits, revised prompt, and open questions.
- A visible scoring model: every scored rubric dimension has a label, score, rationale, and impact on the overall verdict.
- Visual indicators beyond text: at minimum one overall score ring, rubric bars or mini-rings, and severity markers for findings.
- The overall score ring must be inline SVG. Animate its `stroke-dashoffset` with CSS so the ring fills to the score on page load.
- The overall score must be integrated into the verdict band or a clearly connected assessment component. Do not place it as a detached floating tile.
- Scoring explanation: the reader can tell why the prompt got its score and which edit would raise it.
- Professional spacing: do not cram all content into one viewport or one dashboard.
- Anchor behavior: direct links such as `#findings` and `#edits` must land near useful section content, not at the top of a blank band or another section.
- Compact typography: no oversized hero headline; keep report headings modest and readable.
- Motion with restraint: scroll reveals are allowed, including staggered fade-and-slide rubric rows as they enter view, but decorative motion must never sit behind score rings, cards, or report text.
- Progressive disclosure: findings and suggested edits should use native collapsible controls or equivalent accessible accordions so the report scans before details expand.
- Visual language: use glass-like report surfaces with translucent backgrounds, 1px low-opacity borders, subtle shadows, and backdrop blur over a quiet textured or gradient background.
- Structure: connect classification metadata to the scorecard with a node-and-line grid pattern so the reader can follow the review from prompt type to score.
- Routing: include an explicit score-to-findings-to-edits route using CSS Grid plus 1px tracking lines drawn with pseudo-elements or inline SVG.
- Gestalt proximity: keep each section heading and its related cards in the same constrained section container so headings are not orphaned from content.
- Iconography: use inline flat SVG icons for classification, risk, severity, and action states. Do not use emoji for visual styling or report content.
- Risk icon containers must use a 10% opacity tint of the root risk color plus a 1px solid border; do not use solid-fill risk circles.
- Typography: use a geometric sans-serif heading stack and a monospace stack for numerical scores and technical paths.
- Reduced-motion support through `prefers-reduced-motion`.
- A clear next step at the end.
- Direct-open safety: `report-template.html` must render as a meaningful sample report when opened directly, including classification, rubric rows, representative findings, and copy-ready edits. Do not leave visible raw placeholder tokens such as `{{field_name}}` in the page.

## Required Sections

1. **Verdict band**
   - Verdict: Ready / Needs edits / Hold
   - Overall score
   - Risk level
   - One-sentence reason

2. **Classification**
   - Primary type
   - Secondary types
   - Context dependency
   - Lifecycle
   - Target executor
   - Expected output

3. **Rubric scorecard**
   - Objective clarity
   - Target clarity
   - Context grounding
   - Scope boundaries
   - Autonomy boundaries
   - Output contract
   - Evidence and verification
   - Risk handling
   - Model and tool fit
   - Ambiguity control

4. **Findings**
   - Each finding gets severity, score impact, evidence, why it matters, and exact fix.
   - Use visual severity indicators: Critical, High, Medium, Low.

5. **Suggested edits**
   - Use Replace / Add / Delete blocks.
   - Keep edits copy-ready.

6. **Revised prompt**
   - Include only when requested or when the prompt is close enough that a revision is more useful than a patch list.

7. **Open questions and next step**
   - Include only blockers or high-value unknowns.
   - End with the smallest useful next action.

## Visual Direction

The report should feel like a professional review document, not a chat transcript.

- Layout: long-scroll editorial report with section bands and roomy vertical rhythm.
- Palette: neutral paper, ink, muted blue, amber, and red accents. Avoid one-color monotony.
- Typography: small-to-medium report scale. Body text around 15-17px, section heads around 22-34px, no huge hero type.
- Components: score rings, rubric rows, evidence callouts, finding cards, edit blocks, sticky local navigation when useful.
- Animation: fade/slide reveals and structural scroll accents are acceptable. Do not animate every element, and do not place decorative shapes behind scoring content.
- Accessibility: strong contrast, visible focus states, reduced-motion support, no content hidden behind hover-only controls.

## Score Ring Rules

Use score rings to make scoring legible:

- Overall score ring: 0-100.
- Finding rings or small radial meters: severity or score impact.
- Rubric bars: score plus one-line rationale.
- Color coding:
  - 90-100: green
  - 75-89: blue
  - 60-74: amber
  - 40-59: orange
  - 0-39: red

Do not rely on color alone; include labels.

## Text Fallback

Use this only when the user asks for text-only output or when HTML artifact creation is not possible:

```text
Verdict: Ready / Needs edits / Hold
Overall score: <score>/100
Classification: <type and context dependency>
Risk level: <level>

Rubric scorecard
- Objective clarity: <score> - <reason>
- Target clarity: <score> - <reason>
- Context grounding: <score> - <reason>
- Scope boundaries: <score> - <reason>
- Autonomy boundaries: <score> - <reason>
- Output contract: <score> - <reason>
- Evidence and verification: <score> - <reason>
- Risk handling: <score> - <reason>
- Model and tool fit: <score> - <reason>
- Ambiguity control: <score> - <reason>

Findings
- <severity>: <issue> -> <fix>

Suggested edits
- <copy-ready edit>

Next step
- <smallest useful action>
```
