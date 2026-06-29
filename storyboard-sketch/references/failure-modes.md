# Failure Modes

> Scope: this file elaborates craft for **style A** (`rough_notebook_storyboard`) only. Styles B–F follow their locked contracts in [../reference.md](../reference.md).

## 7 Failure Modes

### A. Polish Drift
**Symptoms:** Output language includes "clean lines," "sleek design," "professional mockup," "modern minimal." Result looks like a Figma export, not a notebook page.

**Root cause:** Default AI image generation leans toward polished aesthetics. Without explicit resistance, prompts drift to production quality.

### B. Single-Object Collapse
**Symptoms:** Output describes one centered screen or device instead of a multi-zone board. No surrounding zones, no peripheral annotations.

**Root cause:** Simpler to generate a single focal object. Multi-zone requires deliberate spatial planning.

### C. Annotation Starvation
**Symptoms:** Zones A and B present but no callouts, labels, arrows, or design reasoning. The sketch looks like an illustration, not a thinking artifact.

**Root cause:** Annotations feel secondary. Without enforcement, they're the first thing dropped.

### D. Color Decoration
**Symptoms:** Colors used randomly or purely for aesthetics. No semantic mapping (blue=structure, red=interaction, etc.). Colors don't communicate meaning.

**Root cause:** AI defaults to "make it colorful" rather than "use color to encode information."

### E. Spatial Neglect
**Symptoms:** 100% diagrammatic with zero spatial/product context, even when the concept involves a physical device, environment, or touchpoint.

**Root cause:** Diagrammatic is easier and more familiar. Spatial requires perspective and form thinking.

### F. White Canvas Default
**Symptoms:** Output assumes solid white rectangular background. No transparency, no feathered edges, no organic boundary.

**Root cause:** White rectangle is the default canvas assumption. Transparency must be explicitly requested and reinforced.

### G. Brand Zone Omission
**Symptoms:** Interface and flow zones present, but no brand exploration — no logo roughs, color swatches, tone words, or identity fragments.

**Root cause:** Brand feels optional or separate from UX. The skill requires it as part of holistic design thinking.

---

## 7-Step Revision Rules

When a failure mode is detected, follow these steps:

1. **Identify** which failure mode(s) are present (A-G)
2. **Score** the output against the evaluation rubric (see `evaluation-rubric.md`)
3. **Locate** the specific language or omission causing the failure
4. **Reassert** the correct doctrine from the relevant reference file
5. **Rewrite** only the affected sections — don't regenerate everything
6. **Re-score** against the rubric to confirm improvement
7. **Verify** no new failure modes were introduced by the revision

---

## Failure-to-Revision Mapping

| Failure Mode | Primary Fix | Reference |
|-------------|-------------|-----------|
| A. Polish Drift | Replace production language with sketch language. Add anti-polish terms. | `visual-grammar.md` Anti-Polish Discipline |
| B. Single-Object Collapse | Add missing zones. Redistribute content across 4+ zones. | `composition-templates.md` Zone Model |
| C. Annotation Starvation | Add Zone D content — callouts, labels, arrows, design rationale. | `composition-templates.md` Zone D |
| D. Color Decoration | Map colors to semantic roles. Remove decorative color mentions. | `visual-grammar.md` Colored-Pencil Semantics |
| E. Spatial Neglect | Add Zone E if concept is product/device/environment. Rebalance to 50/50 or 40/60. | `composition-templates.md` Template C |
| F. White Canvas Default | Add transparency directive. Specify feathered edges, alpha channel, organic boundary. | `prompt-templates.md` + SKILL.md Transparency Doctrine |
| G. Brand Zone Omission | Add Zone C content — logo roughs, swatches, tone adjectives, identity fragments. | `composition-templates.md` Zone C |

---

## Combined Failure Patterns

Some failures cluster together. Watch for:

- **A + B:** Polish drift + single-object = "polished mockup of one screen" — the most common combined failure
- **C + G:** Annotation starvation + brand omission = "just wireframes" — missing the design thinking layer
- **E + F:** Spatial neglect + white canvas = flat diagram on white rectangle — the least sketch-like output
- **A + D:** Polish drift + color decoration = "colorful but meaningless" — pretty but no semantic depth
