# Locked style contracts (`style_output_mode`)

These six modes are **locked visual contracts**, not interchangeable adjectives. When one is selected, treat its **Style** line, **Visual Language**, and **Common Drift to Avoid** as binding for image generation.

Selection letters **A–F** (fixed mapping):

| Letter | `style_output_mode` |
|--------|---------------------|
| A | `rough_notebook_storyboard` |
| B | `editorial_systems_illustration` |
| C | `industrial_concept_sketch` |
| D | `blueprint_ux_schematic` |
| E | `product_keynote_concept_board` |
| F | `whiteboard_strategy_map` |

---

## Selection and hybrid behavior

Accepted `style_output_mode` values are exactly the six ids above.

Use these selection heuristics when the user gives intent but not a letter:

| User intent | Recommended mode |
|-------------|------------------|
| Messy UX or product ideation | A |
| Clean explanatory product/system image | B |
| Physical device or product form | C |
| System architecture or UX logic | D |
| Executive concept board | E |
| Workshop, service map, or operating model | F |

If a style is selected:

- **Lock** it for the entire run (all panels use the same contract unless the user starts a new run).
- **Preserve** it in the storyboard header and in every image prompt.
- **Do not silently hybridize** (no mixing visual language from another mode without explicit disclosure).

If the user asks for a **hybrid**:

1. Require an explicit **name** for the hybrid (short label).
2. State which base style is **dominant** (one of the six ids).
3. List **borrowed traits** from which other style(s), in concrete terms (e.g. “borrow marker weight from `whiteboard_strategy_map`”).
4. Re-read the dominant style’s drift-avoidance list and ensure borrowed traits do not violate the dominant contract’s intent unless the user accepts that tradeoff.

---

## 1. `rough_notebook_storyboard` (letter **A**)

### Purpose

Early-stage ideation, UX exploration, messy product thinking artifact.

### Definition

A dense, asymmetric, annotation-heavy board that feels like a senior designer’s real notebook page.

### Style (use verbatim or near-verbatim in prompts)

**Style:** Rough notebook storyboard — hand-drawn colored-pencil concept board with messy studio energy, asymmetric layout, visible construction marks, dense annotations, and exploratory product thinking artifacts.

### Visual Language

- rough graphite and colored-pencil rendering
- visible construction lines and pressure variation
- asymmetric multi-cluster composition
- dense arrows, callouts, handwritten labels, section headings, flow notes
- blue for structure, red for interaction, yellow for highlights, green for state, orange for callouts
- uneven frames and intentionally imperfect linework
- mixed-scale fragments across the full frame
- in-progress notebook energy, not presentation polish

### Common Drift to Avoid

- editorial cleanliness
- centered poster layout
- thin annotation layer
- polished glow
- tidy corporate UI styling

---

## 2. `editorial_systems_illustration` (letter **B**)

### Purpose

Presentation-friendly explanation of a product/system concept.

### Definition

A calm, softly rendered, editorial product explainer with strong conceptual clarity.

### Style

**Style:** Editorial systems illustration — soft pencil-and-wash product explainer with airy white space, lightly sketched technical linework, muted blue-violet accents, and centered concept-diagram clarity.

### Visual Language

- soft graphite contouring
- restrained watercolor/pastel wash
- airy spacing and low visual noise
- centered or near-centered composition
- muted blue-gray and violet palette
- translucent or lightly sketched interface cards
- refined labeling and explanatory flow
- presentation-friendly calm and readability

### Common Drift to Avoid

- notebook chaos
- workshop clutter
- heavy technical blueprint texture
- over-polished marketing render feel

---

## 3. `industrial_concept_sketch` (letter **C**)

### Purpose

Physical product and device concept visualization.

### Definition

A form-driven concept sketch mode inspired by industrial design and advanced product concept drawing.

### Style

**Style:** Industrial concept sketch — refined graphite-and-marker product concept rendering with perspective studies, form exploration, material hints, and disciplined annotation around a physical object or device.

### Visual Language

- strong perspective drawing
- form-first silhouette and volume emphasis
- marker-like tonal shading
- layered line weights
- component callouts and mini-views
- reduced but precise annotation density
- object-centered concept review energy

### Common Drift to Avoid

- flat infographic layout
- generic UI board behavior
- polished CGI device render
- decorative brand clutter

---

## 4. `blueprint_ux_schematic` (letter **D**)

### Purpose

Technical systems mapping and structure-heavy UX logic.

### Definition

A cool, drafting-led, structure-first mode that feels like a conceptual blueprint for software and systems behavior.

### Style

**Style:** Blueprint UX schematic — cool-toned drafting-style systems diagram with structural grid logic, modular interface mapping, precise connectors, and technical concept-board clarity.

### Visual Language

- cool blue-gray drafting linework
- modular frames, connectors, arrows, dashed paths
- structural hierarchy over expressive sketchiness
- optional guide marks and construction ticks
- schematic interface fragments
- compact precise labels
- technical, architected composition

### Common Drift to Avoid

- watercolor softness
- warm analog notebook nostalgia
- decorative clutter
- playful whiteboard-marker behavior

---

## 5. `product_keynote_concept_board` (letter **E**)

### Purpose

Executive-facing or deck-safe concept storytelling.

### Definition

A composed, premium concept board that remains conceptual without pretending to be final product design.

### Style

**Style:** Product keynote concept board — premium concept illustration with refined composition, restrained diagrammatic overlays, elegant product framing, and executive-presentation clarity.

### Visual Language

- strong hierarchy and refined spacing
- curated concept fragments
- restrained annotation layer
- elevated palette discipline
- visible concept traces without raw mess
- premium, strategic, presentation-grade framing
- polished enough for review, not final enough to fake completion

### Common Drift to Avoid

- Behance-style false finality
- generic glossy dashboard comps
- over-cleaned mockup presentation
- losing concept evidence entirely

---

## 6. `whiteboard_strategy_map` (letter **F**)

### Purpose

Workshop framing, service logic, strategy systems, operating models.

### Definition

A bold, facilitation-oriented diagram style that feels like a live strategic session captured clearly.

### Style

**Style:** Whiteboard strategy map — bold marker-style workshop diagram with clustered ideas, directional logic, facilitation energy, and live strategy-session clarity.

### Visual Language

- chunkier marker-like linework
- grouped concepts, swimlanes, loops, and relationship arrows
- larger labels and section containers
- broad map-like composition
- high readability and workshop energy
- less delicate rendering, more logic and grouping
- collaborative systems-thinking posture

### Common Drift to Avoid

- editorial softness
- industrial design realism
- tiny interface detail overload
- over-rendered polished boards
