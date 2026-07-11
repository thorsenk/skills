---
name: storyboard-prompt-orchestration-test
description: >-
  Test version of the storyboard prompt-orchestration workflow. Use when the
  user explicitly invokes $storyboard-prompt-orchestration-test to turn product,
  service, system, workflow, or design context into a staged visual storyboard:
  choose a visual style, load its dedicated visual module, review stable panel
  summaries, then generate separate images, one combined board, or prompts.
  Require explicit waits at style selection and storyboard approval. Not for
  final production mockups or one-shot images that intentionally skip review.
---

# Storyboard Prompt-Orchestration Test

Use a staged workflow so the user controls visual style, panel content, and the
final output. Keep internal field names out of the user-facing response unless
the user asks for them.

## Required workflow

Follow this order:

**source context -> style choice -> WAIT -> load selected style module -> lock
style, labels, and spacing -> storyboard panels -> WAIT -> output choice ->
prompts or images -> module-specific image QA -> delivery**

A **WAIT** ends the response. Do not continue into the next stage in the same
turn unless the user already supplied that exact decision. Never generate
prompts or images before the user reviews the storyboard, unless the user
explicitly says to skip storyboard review.

## 1. Scope the source

- Use the material the user identifies.
- Ask one short source question only when the intended material is genuinely
  unclear.
- When several files or sources are available, show their names in plain
  language and let the user select one, several, or all.
- Do not ask again for information the user already supplied.

## 2. Select the visual style

If the user has not explicitly selected a style or delegated the choice, show
all six options below. You may mark one as **Recommended**, but a recommendation
is not a selection. Ask the user to choose, then **WAIT**.

| Choice | User-facing name | Best for |
|---|---|---|
| A | Rough notebook storyboard | Pencil-sketch ideation and visual thinking |
| B | Editorial systems illustration | Calm, clear product or system explanation |
| C | Industrial concept sketch | Physical products, devices, and form studies |
| D | Blueprint UX schematic | Technical architecture, flows, and UX logic |
| E | Product keynote concept board | Executive or presentation-deck storytelling |
| F | Whiteboard strategy map | Workshops, service maps, and operating models |

Treat a letter, user-facing name, or unmistakable direct description such as
"rough pencil notebook sketch" as an explicit selection. If the user says
"you choose" or "just make it," select the best fit, state it briefly, and
continue.

After selection, lock the style, label treatment, and composition spacing for
every panel. Do not blend styles unless the user explicitly requests a hybrid
and names the dominant style.

Use the default label treatment from the selected style module unless the user
explicitly asks for **hand-lettered**, **typeset**, or **no visible text**. State
the locked choice in plain language before drafting the storyboard. Style words
such as "editorial," "blueprint," or "keynote" do not define typography by
themselves.

Repeat the full locked label treatment as an explicit sentence in every image
prompt, including the drawing medium and any forbidden typography. Do not rely
on the style name or other visual adjectives to imply it. A handwriting-style
digital font does not satisfy a hand-lettered lock.

## Composition spacing

Use a zoomed-out composition with a generous outer safe area for every style
unless the user explicitly requests full bleed or edge-to-edge cropping. State
the spacing lock in plain language before drafting the storyboard.

Repeat this in every image prompt:

> ZOOMED-OUT COMPOSITION: Keep every subject, label, arrow, panel frame, and
> meaningful mark inside the central 76% of the canvas. Leave approximately
> 12% uninterrupted background, paper, or transparency on all four edges.
> Within the central area, leave at least one-quarter of the usable space
> visibly unoccupied as negative space between content groups.
> Nothing important may touch or cross the canvas boundary. No full bleed or
> accidental cropping.

- Prefer a slightly smaller content cluster over near-edge crowding.
- Preserve the outer safe area when content is dense; simplify the content
  rather than shrinking the margin.
- For a combined storyboard, keep the entire panel grid inside the same safe
  area and use clear gutters at least half as wide as the outer margin.
- Treat a user-requested full-bleed composition as an explicit override and
  state it with the other locked choices.

## Load the selected style module

The selector names the style; it does not contain enough visual direction to
generate an image. After selection, read the matching module end to end before
drafting the storyboard or writing any image prompt:

| Choice | Required module |
|---|---|
| A | [Rough notebook storyboard](references/style-a-rough-notebook.md) |
| B | [Editorial systems illustration](references/style-b-editorial-systems.md) |
| C | [Industrial concept sketch](references/style-c-industrial-concept.md) |
| D | [Blueprint UX schematic](references/style-d-blueprint-ux.md) |
| E | [Product keynote concept board](references/style-e-product-keynote.md) |
| F | [Whiteboard strategy map](references/style-f-whiteboard-strategy.md) |

- Read only the selected module unless the user explicitly requests a hybrid.
- For a hybrid, read the dominant module plus each named borrowed module. Keep
  the dominant prompt lock intact and append only the approved borrowed traits.
- Use the module's visual goal and non-negotiable signature when drafting panel
  composition, not only when writing the final image prompt.
- Copy the module's complete **Prompt lock** into every image prompt without
  shortening, summarizing, or replacing it with generic style adjectives. An
  explicit user override may replace only the directly conflicting sentence;
  keep every other prompt-lock sentence unchanged and state the override.
- Add the approved panel content and the complete global spacing instruction
  after the module prompt lock. If the user explicitly requested full bleed,
  add that named override instead of the default spacing instruction.
- Use the module's **Drift exclusions** as negative constraints and its
  **Style-specific QA gate** as required acceptance criteria.
- Never generate from the selector table, the style name, or memory alone.

## 3. Draft the storyboard

Treat a panel as the main unit:

**one panel = one narrative beat = one render unit**

- Honor an explicit panel count from 1 to 6.
- When no count is supplied, use the smallest count from 3 to 6 that gives each
  idea its own clear panel. State the proposed count.
- Assign stable IDs: P1, P2, P3, and so on.
- Do not use "zones" as substitutes for panels. Interface, interaction, brand,
  annotation, and spatial content are optional coverage tags within panels.
- Include brand content only when identity or tone matters.
- Include spatial content only for physical products, environments, or
  touchpoints.

For each panel provide:

1. **Title**
2. **Purpose / narrative beat**
3. **Visible content**
4. **Action, transition, or state change**
5. **Key label or callout**
6. **Composition / open space** describing the main content cluster and the
   surrounding area that must remain empty
7. **Continuity notes** connecting it to adjacent panels

Keep this artifact focused on panel meaning. Do not include generation prompts
yet. Treat each **Key label or callout** as the intended phrase, not a guarantee
that an image renderer will reproduce it exactly. Keep planned content sparse
enough to fit within the locked safe area.

End every storyboard draft with this question, then **WAIT**:

> Review the panel context. What should happen next?
>
> 1. Revise the panels
> 2. Generate each panel as a separate image
> 3. Generate one combined storyboard image
> 4. Export prompts only
> 5. Stop

## 4. Produce the selected output

Follow the user's answer literally:

- **Revise the panels:** Change only the affected panels, show the updated
  storyboard, ask the approval question again, and wait.
- **Separate images:** Build one prompt and generate one separate image for each
  panel. P1 through Pn must produce exactly n image artifacts. Carry the same
  style lock, label treatment, spacing lock, recurring subjects, visual
  vocabulary, and continuity notes into every prompt.
- **Combined storyboard image:** Build one prompt for one image containing all
  approved panels in their approved order. Preserve the outer safe area around
  the full grid and clear gutters between panels.
- **Prompts only:** Output one labeled prompt per panel and never invoke an image
  tool.
- **Stop:** End without generating anything.

When an image tool is unavailable, provide the approved prompts instead and say
that rendering was not available. Follow any host-specific image-tool response
rules, including rules that require silence after generation.

Keep generated labels short enough for the locked treatment to remain legible.
When exact wording matters, reserve clean label space in the render and add the
copy afterward as an editable overlay layer that matches the lock. If no
suitable editing tool is available, deliver the exact overlay copy separately
rather than claiming that renderer-produced text is exact. Do not use a
handwriting font as a substitute for hand-drawn lettering.

## 5. Inspect rendered images

Re-read the selected style module before inspection. When inspection is
available, check each rendered artifact for:

1. Approved panel content
2. Every non-negotiable signature trait from the selected style module
3. Every item in the module's style-specific QA gate
4. Locked label treatment, including the absence of forbidden digital or
   typeset fonts when hand-lettering is required
5. Approximately 12% clear safe area on all four edges, with no meaningful
   marks touching, crossing, or appearing cropped by the canvas boundary
6. Deliberate negative space between content groups, with at least one-quarter
   of the usable interior left visibly unoccupied
7. Clear internal gutters for a combined storyboard
8. Recurring-subject and visual continuity
9. Readable essential labels
10. Correct artifact count and order

If spacing fails, regenerate the affected artifact with a smaller content scale
and the full zoomed-out composition instruction. Do not crop an existing image
or merely add the vague phrase "more white space." Regenerate only failed
panels; do not regenerate the whole set when one panel fails.

## 6. Finish plainly

After delivery, offer plain-language follow-ups only when host response rules
allow it:

- Change the visual style
- Change the panel count
- Revise specific panels
- Export the prompts
- Start over with new context
- Done

Do not use R0-R5, C1/C-all, or other internal codes in user-facing choices.

## Failure checks

Before responding, verify that you did not:

- Treat a recommended style as user-selected
- Continue past a WAIT without the user's decision
- Generate prompts or images before storyboard approval
- Confuse panels with content zones
- Draft or generate from the selector summary without loading the style module
- Shorten, paraphrase, or omit part of the selected module's prompt lock
- Approve generic style fidelity without running the module-specific QA gate
- Change style between panels
- Leave the label treatment unstated or omit it from an image prompt
- Let a style name stand in for an explicit typography instruction
- Use digital or typeset fonts when the locked treatment is hand-lettered
- Substitute a handwriting-style font for genuinely hand-drawn lettering
- Treat renderer-produced text as guaranteed exact copy
- Omit the spacing lock from an image prompt
- Let subjects, labels, arrows, or panel frames crowd or touch a canvas edge
- Fill every interior gap with content, annotations, or decorative marks
- Shrink the outer safe area or crop the image to accommodate dense content
- Remove the gutters between panels in a combined storyboard
- Generate the wrong number of image artifacts
- Force transparency when it was not requested
- Expose unnecessary internal metadata
