---
name: storyboard-prompt-orchestration-test-2
description: >-
  Image-quality-first comparison test 2 version of the storyboard prompt-orchestration
  workflow. Use when the user explicitly invokes
  $storyboard-prompt-orchestration-test-2 to turn product, service, system,
  workflow, or design context into a staged visual storyboard: select and lock
  a complete visual language, review stable panel plans, then generate separate
  images, one combined board, or export prompts. Require explicit waits at style
  selection and storyboard approval. The orchestration mechanics exist to
  protect excellent image composition, rendering, annotation, continuity, and
  style fidelity; never shorten the visual contracts into generic style names.
---

# Storyboard Prompt-Orchestration Test 2

## Core objective

Produce **excellent, art-directed images**, not merely correct storyboard
content.

The workflow gates protect the user's decisions, but they are subordinate to
image quality. A panel is not successful when its subject is technically
present but the composition is cramped, the style has drifted, the annotation
layer is missing, or the image reads like a generic infographic.

**Non-negotiable rule:** Never compress a selected style into a short phrase
such as “editorial,” “blueprint,” or “notebook sketch” when building an image
prompt. Expand the full visual contract, canvas rules, label treatment, color
roles, continuity lock, and negative constraints inside every prompt.

## Required workflow

Follow this order:

**source context -> style choice -> WAIT -> complete style + label lock ->
storyboard panels -> WAIT -> output choice -> full prompts or images -> image
QA -> delivery**

A **WAIT** ends the response. Do not continue into the next stage in the same
turn unless the user already supplied that exact decision. Never generate
prompts or images before the user reviews the storyboard unless the user
explicitly says to skip storyboard review.

## 1. Scope the source

- Use the material the user identifies.
- Ask one short source question only when the intended material is genuinely
  unclear.
- When several files or sources are available, show their names in plain
  language and let the user select one, several, or all.
- Do not ask again for information the user already supplied.
- Extract recurring subjects, objects, interfaces, environments, terminology,
  and constraints that must remain stable across panels.

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
“rough pencil notebook sketch” as an explicit selection. If the user says “you
choose” or “just make it,” select the best fit, state it briefly, and continue.

After selection, lock the style, label treatment, background, aspect ratio, and
continuity rules for every panel. Do not blend styles unless the user explicitly
requests a hybrid and names the dominant style.

Use the selected style's default label treatment unless the user explicitly
asks for **hand-lettered**, **typeset**, or **no visible text**. State the locked
choice in plain language before drafting the storyboard. A handwriting-style
digital font does not satisfy a hand-lettered lock.

## 2A. Global image-quality contract

These rules apply to every style unless a style contract explicitly overrides
them.

### Canvas and edge safety

- Honor the requested image dimensions and aspect ratio exactly when the image
  tool supports them.
- Reserve a **hard outer safe frame equal to approximately 9% of the canvas on
  every side** for separate panel images.
- Keep the full 9% perimeter visually quiet: no titles, labels, arrows, objects,
  washes, shadows, frames, or meaningful marks may touch or cross it.
- For a combined storyboard, reserve 6–8% around the complete board and 3–4%
  gutters between panels.
- Place every required element inside the inner safe area. Do not rely on
  post-generation cropping to rescue the composition.
- No accidental edge clipping, tangencies, or objects that appear to continue
  beyond the frame unless the user explicitly requests a deliberate crop.

### Composition and hierarchy

- Establish one unmistakable primary focal cluster per panel.
- Use 2–4 supporting elements or fragments, sized according to importance.
- Do not make every object the same size or visual weight.
- Maintain intentional negative space between the primary cluster, secondary
  elements, annotations, and the safe frame.
- Favor immediate 3–5 second comprehension: the viewer should see the main idea,
  then the supporting logic, then the annotations.
- Avoid both extremes: edge-to-edge crowding and empty abstract minimalism that
  fails to explain the concept.
- Use overlap only when it clarifies grouping or depth. Never stack unrelated
  elements because the canvas is overcrowded.

### Annotation contract

Unless the user locks **no visible text**, every panel must include a meaningful
annotation layer.

- Use 2–5 short labels or callouts for a normal panel. Add more only when the
  selected style and panel complexity justify it.
- Each annotation must explain a relationship, decision, state, transition,
  risk, or design rationale. Decorative filler labels do not count.
- Keep labels short, normally 1–6 words. Prefer several readable labels over one
  dense paragraph.
- Attach callouts with clear leader lines, arrows, brackets, underlines, or
  proximity. The viewer must know what each note refers to.
- Keep labels inside the safe area and separated from one another.
- Repeat the full locked label treatment in every image prompt, including the
  drawing medium and forbidden typography.
- When exact wording is critical, reserve clean label space and add the final
  copy as an editable overlay. Do not claim renderer-produced text is exact.

### Material and mark fidelity

- Name the physical or visual medium explicitly: graphite, colored pencil,
  watercolor wash, alcohol marker, drafting pencil, ink, pastel, or typeset
  overlay.
- Specify line-weight hierarchy, pressure variation, fill behavior, texture,
  and surface treatment.
- Do not use generic phrases such as “hand-drawn style” without describing the
  actual marks.
- Avoid material mixing that contradicts the locked style.

### Color discipline

- Define what each accent color means. Color must organize information, not
  merely decorate it.
- Keep the number of active accents restrained. Two or three accents are usually
  enough for one panel.
- Preserve palette hue, saturation, and contrast across the complete image set.
- Do not allow later panels to become brighter, glossier, warmer, or more
  colorful unless the storyboard specifically requires that state change.

### Continuity packet

Before generating the first panel, create an internal continuity packet and
carry it unchanged into every panel prompt:

- selected style and complete style lock
- aspect ratio, background, and 9% safe frame
- recurring-subject identity and proportions
- device or object geometry
- camera angle, perspective, and viewing distance
- linework and material treatment
- palette and semantic color roles
- label and annotation treatment
- recurring symbols, connector style, and visual vocabulary
- prohibited drift

Do not summarize the continuity packet after panel one. Repeat the relevant
constraints in full for every panel.

### Image-quality priority order

When constraints compete, resolve them in this order:

1. Correct narrative meaning
2. Safe framing and composition
3. Locked-style fidelity
4. Annotation clarity
5. Recurring-subject continuity
6. Color and material discipline
7. Decorative detail

## 2B. Complete style contracts

### A — Rough notebook storyboard

#### Identity

A senior product designer's exploratory notebook page: energetic, imperfect,
reasoned, and visibly made by hand. It should feel like active design thinking,
not uncontrolled mess and not a polished UI presentation.

#### Canvas and composition

- Warm off-white sketchbook paper with subtle grain.
- Preserve the global 9% safe frame.
- Use an asymmetric multi-zone layout with one dominant concept area and
  several smaller thinking fragments.
- Maintain roughly 25–35% breathing room inside the safe frame.
- Mix scales deliberately: one large focal sketch, smaller interface fragments,
  arrows, notes, and optional mini-views.
- Do not default to a centered poster or a rigid quadrant grid.

#### Mark-making and surface

- Rough graphite construction drawing with restrained colored-pencil accents.
- Visible construction marks, redrawn contours, erased-but-visible strokes,
  occasional smudges, and natural pressure variation.
- Lines may wobble and overlap, but the focal subject must remain legible.
- Use rough rectangles, rounded boxes, wobbly circles, arrows, dashed lines,
  brackets, checkboxes, device outlines, simple human figures, and hand-drawn
  symbols rather than icon-library glyphs.
- No smooth gradients, digital drop shadows, glass effects, or vector-perfect
  geometry.

#### Semantic color roles

- Blue: structure, frames, hierarchy, and layout.
- Red: interaction, movement, problems, and critical paths.
- Yellow: selections, attention, and decision points.
- Green: approved, validated, or completed states.
- Orange: callouts, transitions, warnings, and annotation energy.
- Use only 2–3 accents in one panel unless the content genuinely requires more.
- Color must retain visible pencil texture; never use saturated flat fills.

#### Annotation and lettering

- Annotation layer is mandatory unless the user requests no text.
- Hand-letter all labels in graphite or colored pencil with an uneven baseline,
  natural pressure variation, and slight irregularity.
- Use short headings, arrows, underlines, brackets, and callout boxes distributed
  through the page.
- Notes must reveal the designer's reasoning, not merely name objects.
- No digital, UI, presentation, serif, or sans-serif fonts.

#### Required image-prompt lock

Repeat this full sentence in every Style A prompt:

> Render as a senior product designer's rough notebook storyboard on warm
> off-white sketchbook paper: graphite construction lines, redrawn contours,
> restrained colored-pencil accents with semantic color roles, asymmetric
> multi-zone composition, mixed scale, visible arrows and reasoning callouts,
> and 25–35% breathing room inside a hard 9% empty perimeter. All visible text
> is genuinely hand-lettered in graphite or colored pencil with an uneven
> baseline and natural pressure variation; no digital or typeset fonts.

#### Drift to reject

- polished Figma or Dribbble presentation
- one centered screen or object with no surrounding reasoning
- random decorative color
- fake handwriting font
- edge-to-edge content
- illegible notebook chaos
- photorealistic, CGI, or vector rendering

---

### B — Editorial systems illustration

#### Identity

A calm, intelligent, presentation-friendly conceptual explainer. It combines
soft technical sketching with restrained watercolor or pastel wash so a complex
product, workflow, service, or system becomes clear without becoming sterile,
corporate, or glossy.

#### Canvas and composition

- Clean white or extremely pale warm-white background.
- Preserve the global 9% safe frame as a visibly quiet border.
- Use centered to near-centered concept-diagram composition with moderate
  symmetry, not a rigid mirrored layout.
- Establish one central or near-central focal structure supported by 2–4
  secondary cards, nodes, figures, or fragments.
- Keep approximately 30–45% of the inner safe area as open breathing room.
- The image should scan clearly in 3–5 seconds: focal idea first, relationships
  second, annotations third.
- Do not let translucent cards, connector paths, or labels drift toward the
  outer edge.

#### Rendering and materials

- Soft graphite contours with lightly sketched technical structure.
- Medium-fine line precision with gentle pressure variation.
- Construction marks remain minimal and selective rather than messy.
- Add very light watercolor or pastel wash over graphite; use translucent,
  irregular wash edges and slight pigment variation, never smooth digital
  gradients.
- Keep texture low and refined. The image should feel lightly tactile, not
  grainy, distressed, or glossy.
- Use translucent UI cards, lightly framed system nodes, thin connectors,
  simple figures, small flow strips, and restrained diagram overlays.

#### Palette and semantic roles

- Base: white, graphite, and soft gray.
- Muted blue-gray: system structure, connectors, primary grouping.
- Desaturated violet: governed boundaries, secondary grouping, or conceptual
  emphasis.
- Optional tiny cool accent: one additional low-saturation hue only when it
  clarifies meaning.
- Amber, red, or green may appear only as very small semantic state accents,
  never as dominant colors.
- Saturation remains low; contrast comes primarily from graphite line weight and
  tonal hierarchy.

#### Annotation and lettering

- Annotations are sparse but mandatory when the image would otherwise be
  ambiguous.
- Use 2–5 short graphite labels, underlines, arrows, brackets, or callout
  strokes.
- Every note must clarify logic, state, hierarchy, or relationship.
- All visible labels are hand-lettered in graphite with a slightly uneven
  baseline and natural pressure variation.
- Lettering should feel controlled and editorial, not messy or childlike.
- Do not use serif, sans-serif, display, UI, or presentation typography unless
  the user explicitly requests typeset labels.

#### Required image-prompt lock

Repeat this full sentence in every Style B prompt:

> Render as an editorial systems illustration on a clean white or extremely
> pale warm-white background: centered to near-centered explanatory hierarchy,
> one clear focal structure with 2–4 supporting fragments, 30–45% open breathing
> room inside a hard 9% empty perimeter, soft graphite technical contours,
> translucent conceptual UI or system cards, thin lightly sketched connectors,
> and very light watercolor or pastel washes in graphite, soft gray, muted
> blue-gray, and desaturated violet. Keep saturation low, texture restrained,
> and the finish refined but never glossy. All visible labels are genuinely
> hand-lettered in graphite; no digital or typeset fonts. Use a slightly uneven
> baseline, natural pressure variation, and restrained hand-drawn underlines,
> arrows, brackets, or callout strokes.

#### Drift to reject

- notebook chaos or dense margin notes
- heavy blueprint grids or drafting texture
- workshop sticky-note clutter
- generic infographic icons
- hard-edged corporate dashboard mockups
- glossy marketing-render polish
- loud color blocking
- excessive wash that muddies linework
- empty minimalism with no explanation
- missing annotation layer
- edge crowding or cropped callouts

---

### C — Industrial concept sketch

#### Identity

A disciplined product-design study that explains physical form, construction,
materials, components, and interaction through graphite-and-marker sketching.
The object is central, but the page still shows enough supporting views and
annotations to communicate design intent.

#### Canvas and composition

- Warm white or pale neutral marker paper.
- Preserve the global 9% safe frame.
- Place one dominant product or device view within the inner safe area,
  typically occupying 45–60% of it.
- Use a three-quarter perspective by default unless the source requires another
  camera angle.
- Add 2–4 secondary elements: orthographic mini-views, an exploded detail,
  cutaway, material swatch, interaction hand, or component study.
- Keep support views clearly subordinate and separated from the main form.
- For repeated panels, lock product proportions, camera angle, lens feel, and
  recurring component placement.

#### Mark-making and rendering

- Graphite underdrawing with confident darker contour lines.
- Layered line weights: light construction, medium internal structure, dark
  silhouette and important seams.
- Gray marker or soft wash for tonal planes, volume, and material separation.
- Restrained accent marker for interaction points or critical components.
- Use hatching, contour shading, reflected-light hints, and small material cues
  rather than photorealistic texture.
- Perspective guides may remain faintly visible.

#### Palette and material roles

- Graphite and cool or warm grays dominate.
- One muted accent color identifies interaction, moving parts, or the key design
  proposition.
- Optional second accent may identify an alternate state or material layer.
- Avoid broad decorative color fields.

#### Annotation and lettering

- Use disciplined hand-lettered graphite or marker annotations.
- Leader lines should terminate precisely at components, surfaces, seams, or
  mechanisms.
- Use short component names, material notes, motion arrows, dimensional cues,
  and design-rationale callouts.
- Labels remain visibly drawn, with slight irregularity; no digital or typeset
  fonts.

#### Required image-prompt lock

Repeat this full sentence in every Style C prompt:

> Render as an industrial concept sketch on pale marker paper: one dominant
> product or device view occupying roughly 45–60% of the inner composition,
> supported by 2–4 smaller orthographic, exploded, cutaway, material, or
> interaction studies, all contained inside a hard 9% empty perimeter. Use
> graphite underdrawing, visible perspective guides, layered line weights,
> confident dark contours, restrained gray marker shading, hatching, tonal
> planes, and one muted semantic accent. All annotations are disciplined
> hand-lettered graphite or marker notes with precise leader lines and slight
> drawing irregularity; no digital or typeset fonts.

#### Drift to reject

- polished CGI or photoreal product render
- flat infographic layout
- generic app dashboard board
- decorative branding unrelated to the form
- one isolated object with no supporting design evidence
- inconsistent proportions between panels
- saturated marker fills
- edge clipping

---

### D — Blueprint UX schematic

#### Identity

A hand-drafted technical explanation of system architecture, UX logic, flows,
states, dependencies, and interface structure. It should feel precise and
engineered while remaining visibly drawn rather than digitally diagrammed.

#### Canvas and composition

- Pale cool-white or very light blue-gray drafting surface by default.
- Preserve the global 9% safe frame.
- Use an internal modular grid, but stop the grid before the safe frame so the
  image retains a clear border.
- Organize the panel around one primary flow, architecture spine, or structural
  frame.
- Add supporting modules, state frames, legends, or detail enlargements without
  making every module equal in weight.
- Connectors must route cleanly, avoid label collisions, and show direction.
- Use numbered steps or clear entry and exit points where sequence matters.

#### Drafting language

- Cool blue-gray drafting pencil or ink with 3 line weights: heavy primary
  structure, medium components, light guides.
- Use precise but visibly drawn rectangles, modular frames, dashed paths,
  alignment guides, brackets, measurement ticks, and connector arrows.
- Slight line variation and hand-drawn joints prevent a CAD or Figma look.
- Optional restrained violet wash may identify system boundaries or grouped
  states.
- Avoid watercolor softness except for extremely light grouping washes.

#### Semantic color roles

- Blue-gray: primary structure and standard paths.
- Desaturated violet: boundaries, layers, or controlled domains.
- Muted red: exception, conflict, or failure path only.
- Muted green: verified, completed, or validated state only.
- Keep all accents low saturation and subordinate to line logic.

#### Annotation and lettering

- Use compact hand-drafted technical block lettering.
- Lettering must be precise but visibly drawn, with subtle stroke and baseline
  variation.
- Keep labels short and attach them to modules, connectors, states, or legends.
- No UI, presentation, generic digital, or handwriting-style fonts.

#### Required image-prompt lock

Repeat this full sentence in every Style D prompt:

> Render as a hand-drafted blueprint UX schematic on a pale cool-white or very
> light blue-gray drafting surface: one primary architecture spine or flow,
> modular interface frames, clean directional connectors, dashed optional paths,
> guide marks, brackets, measurement ticks, and three visible line weights, all
> contained inside a hard 9% empty perimeter. Use cool blue-gray structure,
> desaturated violet for boundaries, and only tiny muted red or green state
> accents when semantically required. All visible labels use compact
> hand-drafted technical block lettering that is precise but visibly drawn; no
> UI, presentation, or generic digital fonts.

#### Drift to reject

- dark theatrical blueprint poster unless explicitly requested
- perfect vector or CAD geometry
- warm watercolor illustration
- playful marker doodles
- tangled connectors
- tiny unreadable interface detail
- dense full-canvas grid
- missing hierarchy or entry point
- edge-to-edge technical clutter

---

### E — Product keynote concept board

#### Identity

An executive storytelling image with disciplined hierarchy, generous space,
curated concept fragments, and enough sketch evidence to remain exploratory.
It should feel elevated and intentional without pretending to be a final product
mockup or advertisement.

#### Canvas and composition

- Default to a light neutral or warm-white presentation surface. Use a dark
  background only when the user explicitly requests it.
- Preserve a 10–12% safe frame for this style, exceeding the global minimum.
- Use one hero idea or object occupying roughly 50–65% of the inner safe area.
- Add only 1–3 secondary fragments, diagrams, or detail crops.
- Keep alignment disciplined and spacing generous; do not fill the page merely
  because space remains.
- Use a quiet grid and deliberate asymmetry or balanced near-centering.
- Separate headline, hero, and supporting evidence into a clear reading order.

#### Rendering and object treatment

- Refined conceptual forms with subtle graphite underdrawing, light tonal wash,
  paper-cut fragments, or restrained diagram overlays.
- Edges may be more controlled than Styles A–D, but should not become
  vector-perfect.
- Use understated depth from overlap, scale, and tonal separation rather than
  glossy shadows, glass effects, or 3D rendering.
- UI fragments remain conceptual, not pixel-perfect screens.

#### Palette

- One neutral base family.
- One muted primary accent.
- Optional second low-saturation support accent.
- Strong contrast is reserved for the main idea or key state.
- Avoid rainbow palettes and decorative gradients.

#### Label treatment

- Default label treatment is restrained typeset sans-serif.
- Use one concise headline and 2–4 compact captions or callouts.
- Keep one consistent type hierarchy and generous text spacing.
- Do not imitate handwriting or mix type styles.
- If the user explicitly requests hand-lettering, replace this default and lock
  the chosen hand-rendered treatment in every prompt.

#### Required image-prompt lock

Repeat this full sentence in every Style E prompt:

> Render as a product keynote concept board on a light neutral or warm-white
> presentation surface: one hero concept occupying roughly 50–65% of the inner
> composition, only 1–3 curated supporting fragments, a disciplined reading
> order, quiet grid, refined spacing, and a 10–12% empty perimeter. Preserve
> subtle graphite or conceptual sketch evidence, restrained tonal washes or
> diagram overlays, and a limited neutral-plus-one-accent palette. Use one
> compact, consistent typeset sans-serif hierarchy with a concise headline and
> 2–4 subordinate captions; do not imitate handwriting or mix type styles.

#### Drift to reject

- glossy product advertisement
- polished dashboard or pixel-perfect UI
- cinematic 3D render
- over-cleaned false finality
- multiple competing hero objects
- dense text or presentation chrome
- decorative gradients and drop shadows
- edge crowding

---

### F — Whiteboard strategy map

#### Identity

A live, senior-facilitator strategy board that organizes product thinking,
service logic, user journeys, operating models, priorities, dependencies, and
decisions. It should feel energetic and collaborative but remain immediately
readable.

#### Canvas and composition

- Clean whiteboard or bright white paper surface with only subtle dry-erase
  ghosting.
- Preserve the global 9% safe frame.
- Use organized complexity: 3–5 large zones or clusters connected by one clear
  main logic path.
- Use swimlanes, loops, decision diamonds, grouped cards, journey steps,
  priority zones, or Now / Next / Later structures when appropriate.
- Keep major labels large and readable. Do not overload the image with tiny
  notes.
- Retain at least 20–30% breathing room inside the safe frame so clusters remain
  distinct.

#### Marker language

- Black marker for primary outlines, section titles, main arrows, and decisions.
- Dark cool gray for major containers and system structure.
- Mid cool gray for secondary cards and interface blocks.
- Warm gray for emphasis zones, priority areas, and grouped fills.
- Light gray for ghost notes, erased traces, grouping halos, and secondary
  annotations.
- Use dual-tip alcohol marker or dry-erase behavior: broad chisel strokes,
  brush-tip curves, slight streaking, translucent overlaps, and confident
  imperfect outlines.
- Optional one muted accent color may identify the critical route or decision.

#### Annotation and lettering

- Use bold hand-lettered marker text with natural stroke and baseline variation.
- Label zones, decisions, paths, and priorities in short phrases.
- Use large directional arrows, braces, loops, and underlines.
- The annotation layer carries the strategy; it cannot be omitted.
- No digital or typeset fonts.

#### Required image-prompt lock

Repeat this full sentence in every Style F prompt:

> Render as a senior UX strategist's hand-drawn whiteboard strategy map on a
> clean white surface: 3–5 large grouped zones connected by one readable main
> logic path, using swimlanes, loops, decision paths, rough UI frames, grouped
> cards, and large annotations, all contained inside a hard 9% empty perimeter
> with 20–30% breathing room. Use black marker for primary structure, layered
> cool and warm gray marker strokes for hierarchy and grouping, slight
> streaking, translucent overlap, and confident imperfect outlines. All visible
> text is bold hand-lettered marker lettering with natural stroke and baseline
> variation; no digital or typeset fonts.

#### Drift to reject

- messy illegible brainstorming wall
- sticky-note rainbow palette
- editorial watercolor softness
- graphite notebook texture
- polished vector flowchart
- tiny UI-detail overload
- decorative doodles unrelated to logic
- over-rendered presentation board
- missing labels or arrows
- full-bleed clutter

## 3. Draft the storyboard

Treat a panel as the main unit:

**one panel = one narrative beat = one render unit**

- Honor an explicit panel count from 1 to 6.
- When no count is supplied, use the smallest count from 3 to 6 that gives each
  idea its own clear panel. State the proposed count.
- Assign stable IDs: P1, P2, P3, and so on.
- Do not use “zones” as substitutes for panels. Interface, interaction, brand,
  annotation, and spatial content are optional coverage dimensions within a
  panel.
- Include brand content only when identity or tone matters.
- Include spatial content only for physical products, environments, or
  touchpoints.

For each panel provide:

1. **Title**
2. **Purpose / narrative beat**
3. **Primary focal composition** — the dominant subject, its scale, and its
   location inside the safe area
4. **Supporting elements** — 2–4 secondary fragments or contextual objects
5. **Action, transition, or state change**
6. **Required annotations** — short meaning-bearing labels or callouts
7. **Continuity notes** — what must remain identical or evolve deliberately
   from adjacent panels

Keep this artifact focused on panel meaning and visual staging. Do not include
full generation prompts yet. Treat each required annotation as intended copy,
not a guarantee that an image renderer will reproduce it exactly.

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
- **Separate images:** Build one complete prompt and generate one separate image
  for each panel. P1 through Pn must produce exactly n image artifacts. Never
  combine multiple panels into one image under this option.
- **Combined storyboard image:** Build one prompt for one image containing all
  approved panels in their approved order, with a 6–8% board perimeter and
  3–4% gutters.
- **Prompts only:** Output one labeled, complete prompt per panel and never invoke
  an image tool.
- **Stop:** End without generating anything.

When an image tool is unavailable, provide the approved prompts instead and say
that rendering was not available. Follow any host-specific image-tool response
rules, including rules that require silence after generation.

## 4A. Mandatory prompt architecture

Every image prompt must use the following sections. Do not collapse them into a
single short paragraph.

### Separate-image prompt template

```markdown
Create one standalone image for panel [PANEL_ID]. Do not create a collage,
contact sheet, storyboard grid, split screen, or multiple panels.

PANEL INTENT
- Narrative beat: [PURPOSE]
- Primary message: [ONE-SENTENCE MESSAGE]

CANVAS AND SAFE AREA
- Output: [DIMENSIONS / ASPECT RATIO]
- Background: [LOCKED BACKGROUND]
- Reserve a hard 9% empty perimeter on every side.
- Keep every object, label, arrow, wash, and meaningful mark inside the inner
  safe area.
- No accidental cropping, edge collisions, or full-bleed elements.

COMPOSITION AND HIERARCHY
- Primary focal composition: [DOMINANT SUBJECT, SCALE, PLACEMENT]
- Supporting elements: [2–4 SUPPORTING FRAGMENTS]
- Reading order: [FIRST -> SECOND -> THIRD]
- Required breathing room: [STYLE-SPECIFIC WHITESPACE]

SUBJECTS, OBJECTS, AND STATE
- [EXACT VISIBLE CONTENT]
- [ACTION / TRANSITION / STATE CHANGE]
- [RECURRING SUBJECT DETAILS]

STYLE LOCK
- [PASTE THE COMPLETE REQUIRED IMAGE-PROMPT LOCK FOR THE SELECTED STYLE]

COLOR AND MATERIAL ROLES
- [PALETTE]
- [SEMANTIC COLOR MAPPING]
- [LINEWORK, WASH, MARKER, OR SURFACE DETAILS]

ANNOTATION LOCK
- Required short labels: [LABELS]
- What each annotation explains: [MEANING]
- [PASTE OR RESTATE THE FULL LOCKED LABEL TREATMENT]

CONTINUITY LOCK
- Preserve: [CAMERA, SCALE, PROPORTIONS, OBJECT GEOMETRY, SYMBOLS, PALETTE,
  LINE WEIGHT, BACKGROUND, CONNECTORS]
- Deliberate change from prior panel: [ONLY THE APPROVED CHANGE]

DO NOT PRODUCE
- [STYLE-SPECIFIC DRIFT LIST]
- No generic infographic treatment.
- No substitute typography.
- No edge crowding.
- No extra subjects, screens, objects, or decorative elements.

FINAL IMAGE CHECK
- One image only.
- Correct panel content.
- Clear focal hierarchy.
- Full safe frame visible.
- Required annotations present.
- Locked visual style and continuity preserved.
```

### Combined-board prompt additions

For a combined storyboard image, also state:

- exact panel count and reading order
- one consistent panel ratio
- 6–8% empty outer perimeter around the complete board
- 3–4% gutters between panels
- no panel may invade another panel's safe area
- recurring subjects remain identical across panels
- each panel retains its own focal hierarchy and annotation layer
- no panel is reduced to a tiny unreadable thumbnail

## 5. Inspect rendered images

Image QA is mandatory when inspection is available. **Correct content alone is
not a pass.**

Check each rendered artifact against the following gates:

### Critical gates — any failure requires regeneration

1. Correct artifact count and order
2. Correct panel content and narrative beat
3. Hard safe frame remains visible; no meaningful element crowds or crosses it
4. Approved composition and focal hierarchy
5. Locked-style fidelity
6. Locked label treatment, including absence of forbidden digital or typeset
   fonts when hand-lettering is required
7. Required annotation layer is present and meaning-bearing
8. Recurring-subject, object, camera, and visual continuity

### Quality gates

9. Materials look physically coherent: graphite, pencil, wash, marker, or
   drafting language behaves as specified
10. Palette remains restrained and semantically consistent
11. Supporting elements are correctly subordinate
12. Text is sparse and legible enough for the selected treatment
13. The image does not collapse into a generic infographic, polished mockup,
    clip-art diagram, or unrelated illustration style
14. White space is intentional rather than accidental emptiness

### Regeneration policy

- Regenerate only failed panels.
- State the failure internally in precise visual terms, then strengthen the
  affected prompt section.
- Do not merely repeat the same prompt after a failure.
- Reassert the complete style lock and continuity packet on every regeneration.
- Do not regenerate the whole set when one panel fails.

## 5A. Image failure taxonomy

Use these terms during QA and revision:

| Failure | Symptom | Required correction |
|---|---|---|
| Edge-pressure failure | Objects, labels, or washes sit too close to the canvas boundary | Reassert the hard safe frame, reduce scale, and reposition the full composition |
| Style-summary failure | Prompt names the style but omits material, composition, label, or drift controls | Restore the complete style lock verbatim |
| Style drift | Later panel changes medium, palette, texture, polish, or label behavior | Reassert continuity packet and compare against the first accepted panel |
| Annotation starvation | Image is visually attractive but ambiguous because callouts are missing | Add 2–5 meaning-bearing annotations and explicit attachment strokes |
| Typography substitution | Renderer uses a digital font where hand-lettering is locked | Reassert genuine hand lettering and forbid digital/typeset/handwriting fonts |
| Polish drift | Image resembles a Figma export, advertisement, vector infographic, or CGI render | Strengthen physical-medium and anti-polish language |
| Single-object collapse | One isolated object replaces the planned supporting fragments and reasoning | Restate focal/support hierarchy and required secondary elements |
| Color inflation | Accents become loud, numerous, or decorative | Restore palette limits, saturation ceiling, and semantic roles |
| Wash muddiness | Watercolor or pastel obscures graphite structure | Reduce wash intensity and preserve line hierarchy |
| Continuity break | Recurring subjects change scale, proportions, viewpoint, or geometry | Restate exact recurring-subject and camera lock |
| Generic infographic collapse | Icons and clean blocks replace the selected visual language | Forbid infographic iconography and reassert style-specific primitives |
| Text overload | Dense labels dominate or become unreadable | Reduce copy to short phrases and enlarge clean label zones |

## 6. Finish plainly

After delivery, offer plain-language follow-ups only when host response rules
allow it:

- Change the visual style
- Change the panel count
- Revise specific panels
- Export the prompts
- Start over with new context
- Done

Do not use internal codes in user-facing choices.

## Final failure checks

Before responding, verify that you did not:

- Treat a recommended style as user-selected
- Continue past a WAIT without the user's decision
- Generate prompts or images before storyboard approval
- Confuse panels with content zones
- Reduce the selected visual style to a short name or adjective
- Omit the hard perimeter and breathing-room instructions
- Change style between panels
- Leave label treatment unstated or omit it from an image prompt
- Let a style name stand in for an explicit typography instruction
- Use digital or typeset fonts when the locked treatment is hand-lettered
- Substitute a handwriting-style font for genuinely hand-drawn lettering
- Omit meaning-bearing annotations and leave the image ambiguous
- Treat renderer-produced text as guaranteed exact copy
- Generate the wrong number of image artifacts
- Combine panels when separate images were requested
- Force transparency when it was not requested
- Accept a panel merely because the right objects are present
- Expose unnecessary internal metadata
