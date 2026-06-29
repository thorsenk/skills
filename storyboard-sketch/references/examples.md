# Examples

> Scope: this file elaborates craft for **style A** (`rough_notebook_storyboard`) only. Styles B–F follow their locked contracts in [../reference.md](../reference.md).

## Example Invocation: AI Research Workspace

### User Request
> "Create a concept storyboard sketch for an AI-powered research workspace — a web app where researchers can organize papers, run literature searches, annotate findings, and collaborate with AI assistants."

### Extracted Inputs

| Input | Value |
|-------|-------|
| concept_title | AI Research Workspace |
| product_or_service_type | SaaS web application |
| primary_surface | Web dashboard |
| design_goal | Explore how researchers interact with AI assistants within a paper organization and annotation workflow |

### Decisions Made
- **Template:** A (Balanced Concept Board) — SaaS dashboard, UX-heavy
- **Diagrammatic/Spatial balance:** 75/25 — slightly more spatial for workspace context
- **Zone E:** Included — researcher's desk environment with laptop showing the app
- **Background:** Transparent with feathered edges (default)

---

## Example Sketch Brief Output

### Sketch Brief: AI Research Workspace

**Concept:** AI-powered research workspace for paper organization, literature search, annotation, and AI collaboration.

**Composition Template:** A — Balanced Concept Board (modified with Zone E)

**Zone A — Interface Concept (35%)**
- Center-left: Main dashboard wireframe with three-panel layout
  - Left panel: paper library with folder tree and search bar
  - Center panel: paper reader with annotation sidebar
  - Right panel: AI assistant chat thread
- Below: Collapsed mobile view showing paper list and AI chat toggle
- Tab row at top: Library | Search | Annotations | Collaborate

**Zone B — Interaction Logic (20%)**
- Red arrows from search bar to AI assistant: "AI-powered search query"
- Flow path: Paper selected → Annotation mode → AI summary generated
- Dashed connector: Annotation highlight → AI assistant context injection
- State change: Empty search → Results grid → Paper detail

**Zone C — Brand Exploration (15%)**
- Top-right corner cluster:
  - Logo rough: stylized open book with neural network nodes
  - Color swatch strip: deep navy, warm amber, soft gray, accent teal
  - Tone adjectives: "scholarly," "alive," "collaborative," "trustworthy"
  - Typography fragment: serif headers + sans-serif body

**Zone D — Annotation Layer (15%)**
- Callout on AI chat: "Context-aware — knows which paper is open"
- Label on annotation sidebar: "Highlights sync to AI memory"
- Arrow note on mobile view: "Progressive disclosure — AI collapses on small screens"
- Section heading: "Core question: How does AI earn researcher trust?"

**Zone E — Spatial/Product (15%)**
- Bottom-right: Slight perspective sketch of researcher at desk
  - Laptop open showing dashboard (connects to Zone A)
  - Physical notebook beside laptop with Post-its
  - Coffee mug, stack of printed papers
  - Suggests the hybrid digital/physical research workflow

**Background:** Transparent, feathered edges, organic cutout composition

---

## Example Generation Prompt Output

```
Create a concept storyboard sketch for AI Research Workspace:

CONCEPT: SaaS web application — Explore how researchers interact with AI assistants within a paper organization and annotation workflow
PRIMARY SURFACE: Web dashboard
STYLE: Hand-drawn colored-pencil sketch on transparent background, principal designer notebook page

COMPOSITION:
- Zone A (Interface): Three-panel web dashboard wireframe — paper library with folder tree on left, paper reader with annotation sidebar center, AI assistant chat thread right. Tab row: Library, Search, Annotations, Collaborate. Collapsed mobile view below showing paper list and AI chat toggle.
- Zone B (Interaction): Red arrows from search bar to AI assistant showing AI-powered query. Flow path from paper selection through annotation mode to AI summary generation. Dashed connectors from annotation highlights to AI context injection. State progression from empty search to results grid to paper detail.
- Zone C (Brand): Top-right cluster with logo rough (open book with neural network nodes), color swatches (deep navy, warm amber, soft gray, accent teal), tone words (scholarly, alive, collaborative, trustworthy), serif/sans-serif typography fragment.
- Zone D (Annotations): Callout on AI chat reading "Context-aware — knows which paper is open." Label on annotation sidebar: "Highlights sync to AI memory." Arrow note on mobile view about progressive disclosure. Section heading: "Core question: How does AI earn researcher trust?"
- Zone E (Spatial): Slight perspective sketch of researcher at desk with laptop showing the dashboard, physical notebook with Post-its beside it, coffee mug, stack of printed papers — hybrid digital/physical research workflow.

VISUAL LANGUAGE:
- Rough hand-drawn linework with visible construction marks
- Colored pencil: blue for structure and layout frames, red for interaction flow arrows and emphasis, yellow for highlighted annotation zones, green for confirmed/completed states, orange for callout energy and labels
- 75% diagrammatic (UI frames, flow arrows, labels) / 25% spatial (desk scene, perspective)
- Slightly imperfect shapes, notebook energy, exploratory tone
- Multi-zone layout — not one centered object
- Arrows, callouts, handwritten labels, section headings throughout

BACKGROUND: Transparent background with alpha transparency. Feathered transparent edges — sketch elements fade organically at boundaries. No solid white rectangular canvas. Isolated sketch composition floating as organic cutout artifact.

DO NOT produce: polished UI mockups, clean vector graphics, symmetrical production layouts, photorealistic renders, or centered single-object compositions.
```

---

## 4 Validation Test Prompts

### Test 1 — UX-Heavy (Diagrammatic Dominant)
> "Create a concept storyboard sketch for a SaaS project management dashboard with kanban boards, timeline views, and team collaboration features."

**Expected behavior:**
- Template A or B selected
- Heavy UI wireframes (kanban columns, timeline bars, team avatars)
- Flow arrows between views
- 70/30 or 80/20 diagrammatic/spatial balance
- Dual output (brief + prompt)
- Zone E minimal or absent

### Test 2 — Product-Heavy (Spatial Rebalance)
> "Create a concept storyboard sketch for a smart home control kiosk — wall-mounted touchscreen device for managing lights, climate, and security."

**Expected behavior:**
- Template C selected (Product + Interface Fusion)
- Rebalanced toward spatial: 50/50 or 40/60
- Zone E mandatory — device form in slight perspective, wall-mounted context
- UI states radiating from device
- Brand zone includes smart home visual identity fragments

### Test 3 — Anti-Drift Pressure
> "Make me a beautiful, polished concept sketch for a fintech mobile app with sleek gradients and clean vector icons."

**Expected behavior:**
- Resists polish language: no "sleek," "clean," "polished" in output prompts
- Maintains notebook energy, rough linework, colored-pencil semantics
- Reframes user intent as concept exploration, not production mockup
- Output uses favored prompt language, avoids all avoided prompt language
- Anti-polish discipline fully enforced

### Test 4 — Transparent Background Enforcement
> "Create a concept storyboard sketch for an AI writing assistant web app. I need it on a transparent background with feathered edges — no white rectangle."

**Expected behavior:**
- Template E selected (Transparent Cutout Board) or transparency applied to other template
- Output explicitly includes: transparent background, alpha transparency, feathered transparent edges
- "Isolated sketch composition" and "no solid white rectangular canvas" present
- Organic boundary, not hard rectangle
- Prompt language matches transparency doctrine verbatim
