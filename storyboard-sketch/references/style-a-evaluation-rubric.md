# Style A Evaluation Rubric

> Scope: this file elaborates craft for **style A** (`rough_notebook_storyboard`) only. Styles B–F follow their locked contracts in [../reference.md](../reference.md).

## 7 Criteria (Score 1-5 Each)

### 1. Sketch Authenticity (1-5)
Does the output language produce hand-drawn, notebook-quality results?

| Score | Description |
|-------|-------------|
| 1 | Reads like a polished mockup or vector illustration prompt |
| 2 | Some sketch language but dominated by production terms |
| 3 | Sketch aesthetic present but inconsistent — clean and rough mixed |
| 4 | Strong notebook energy throughout, minor polish leaks |
| 5 | Unmistakably hand-drawn designer notebook — construction marks, imperfect shapes, pencil texture |

### 2. Multi-Zone Composition (1-5)
Does the output use the zone model with multiple idea regions?

| Score | Description |
|-------|-------------|
| 1 | Single centered object, no zones |
| 2 | Two areas but rigid/symmetric split |
| 3 | Multiple zones present but feel like separate images, not one board |
| 4 | Organic multi-zone layout with clear relationships between zones |
| 5 | Zones flow naturally, overlap where appropriate, feel like one unified thinking page |

### 3. Design Reasoning Artifacts (1-5)
Are arrows, labels, callouts, and annotations present and meaningful?

| Score | Description |
|-------|-------------|
| 1 | No annotations or reasoning visible |
| 2 | A few labels but decorative, not functional |
| 3 | Annotations present but don't add design insight |
| 4 | Meaningful callouts that explain design decisions |
| 5 | Rich annotation layer — arrows show flow, labels explain choices, callouts reveal thinking |

### 4. Colored-Pencil Semantics (1-5)
Does the output use color meaningfully per the semantic system?

| Score | Description |
|-------|-------------|
| 1 | No color guidance or random color use |
| 2 | Colors mentioned but no semantic mapping |
| 3 | Some semantic color use but inconsistent |
| 4 | Clear semantic color system with 3+ colors mapped to meaning |
| 5 | Full colored-pencil palette with blue=structure, red=interaction, etc. — pencil texture specified |

### 5. Diagrammatic/Spatial Balance (1-5)
Is the blend appropriate for the concept?

| Score | Description |
|-------|-------------|
| 1 | All one mode — purely flat diagrams OR purely spatial, ignoring the other |
| 2 | Token acknowledgment of second mode |
| 3 | Both present but balance doesn't match the concept type |
| 4 | Good balance that matches the concept — rebalanced for product/spatial when appropriate |
| 5 | Intentional, well-reasoned blend — diagrammatic for system logic, spatial for physical context |

### 6. Anti-Polish Discipline (1-5)
Does the output resist drift toward production aesthetics?

| Score | Description |
|-------|-------------|
| 1 | Reads like a Figma export or Dribbble shot prompt |
| 2 | Sketch framing but production language leaks throughout |
| 3 | Mostly sketch but some clean/polished terms sneak in |
| 4 | Strong anti-polish — rough, imperfect, exploratory |
| 5 | Uncompromising notebook energy — every element is sketchy, no polish anywhere |

### 7. Transparency & Background (1-5)
Does the output handle background correctly per guidance?

| Score | Description |
|-------|-------------|
| 1 | Defaults to solid white rectangle with no background consideration |
| 2 | Mentions background but defaults to white canvas |
| 3 | Transparent background mentioned but no feathered edges or organic boundary |
| 4 | Transparent background with feathered edges specified |
| 5 | Full transparency guidance — alpha channel, feathered edges, organic cutout, no white slab |

## Thresholds

| Level | Score | Meaning |
|-------|-------|---------|
| **Fail** | < 28/35 | Output has significant drift or missing elements. Revise. |
| **Pass** | 28-30/35 | Solid output. Minor improvements possible. |
| **Gold** | 31+/35 | Excellent. Fully aligned with skill intent. |

## Quick Self-Check

Before finalizing any output, verify:

- [ ] Would this feel at home in a designer's Moleskine? (Criterion 1)
- [ ] Are there multiple zones with organic flow? (Criterion 2)
- [ ] Do annotations explain thinking, not just label things? (Criterion 3)
- [ ] Is color used semantically, not decoratively? (Criterion 4)
- [ ] Is the diagrammatic/spatial blend right for this concept? (Criterion 5)
- [ ] Would a designer say "that's rough and real" not "that's clean and polished"? (Criterion 6)
- [ ] Is the background handled per guidance? (Criterion 7)
