# Style A Prompt Templates

> Scope: this file elaborates craft for **style A** (`rough_notebook_storyboard`) only. Styles B–F follow their locked contracts in [../reference.md](../reference.md).

## Primary System Prompt

Use this as the framing preamble when generating sketch prompts:

```
You are a principal product designer sketching early-stage concepts in a notebook. Your sketches use colored pencils on rough paper. You think visually — combining UX wireframes, interaction flows, brand exploration, and spatial context on a single page. Your work looks like a senior designer's notebook: imperfect, energetic, full of arrows and annotations, never polished or final. You favor transparent backgrounds with feathered edges so each sketch feels like an organic cutout, not a white rectangle.
```

## Generation Prompt Template

```
Create a concept storyboard sketch for [CONCEPT_TITLE]:

CONCEPT: [PRODUCT_OR_SERVICE_TYPE] — [DESIGN_GOAL]
PRIMARY SURFACE: [PRIMARY_SURFACE]
STYLE: Hand-drawn colored-pencil sketch on [BACKGROUND_TYPE], principal designer notebook page

COMPOSITION:
- Zone A (Interface): [ZONE_A_CONTENT]
- Zone B (Interaction): [ZONE_B_CONTENT]
- Zone C (Brand): [ZONE_C_CONTENT]
- Zone D (Annotations): [ZONE_D_CONTENT]
[- Zone E (Spatial): [ZONE_E_CONTENT]]

VISUAL LANGUAGE:
- Rough hand-drawn linework with visible construction marks
- Colored pencil: blue for structure, red for interaction/emphasis, yellow for highlights, green for state/confirmation, orange for callouts/energy
- [DIAGRAMMATIC_PERCENT]% diagrammatic (UI frames, flow arrows, labels) / [SPATIAL_PERCENT]% spatial (form, perspective, environment)
- Slightly imperfect shapes, notebook energy, exploratory tone
- Multi-zone layout — not one centered object
- Arrows, callouts, handwritten labels, section headings throughout

BACKGROUND: [TRANSPARENT_DIRECTIVE]

DO NOT produce: polished UI mockups, clean vector graphics, symmetrical production layouts, photorealistic renders, or centered single-object compositions.
```

## Favored Prompt Language

Use these terms and phrases in generation prompts:

- hand-drawn colored-pencil sketch
- rough notebook page
- principal designer sketchboard
- visible construction marks
- slightly imperfect shapes
- exploratory tone
- design reasoning artifacts
- arrows and annotations
- callout boxes with handwritten labels
- multi-zone ideation board
- wireframe fragments
- flow indicators
- concept fragments
- notebook energy
- organic cutout
- feathered transparent edges
- alpha transparency
- pinned-board feel
- brand exploration swatches
- interaction flow paths
- sketch composition

## Avoided Prompt Language

Never use these in generation prompts — they pull toward polish/production:

- clean lines
- pixel-perfect
- professional mockup
- sleek design
- polished interface
- modern minimal
- flat design
- material design
- crisp edges
- sharp corners
- gradient fills
- drop shadows
- glass morphism
- vector illustration
- infographic
- presentation-ready
- high-fidelity
- production wireframe
- centered composition
- symmetrical layout
- photorealistic
- 3D render
