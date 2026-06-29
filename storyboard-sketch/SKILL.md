---
name: storyboard-sketch
description: >-
  Storyboard Prompt-Orchestration Skill for external image-capable AI: context
  scoping, mandatory storyboard script, six locked style_output_mode contracts,
  prompt generation, optional rendering, and a controlled rerun menu (R0–R5).
  Aliases and related triggers: visual-concept, concept-storyboard-sketch,
  visualize-the-concept, storyboard script, locked style, principal-designer
  sketches, colored-pencil UX boards, design-review sketch pages, hybrid
  brand-UI-flow ideation. Not for final production mockups, photoreal-only
  requests, or unstructured one-shot prompts without a storyboard phase.
---

# Storyboard Prompt-Orchestration Skill

Package id: `storyboard-sketch`.

**Main files:** This file plus sibling [reference.md](reference.md) in this folder. Do not fetch external wikis for style definitions.

## Purpose

Turn messy context into:

1. A structured **storyboard script** (mandatory first artifact).
2. A **locked** `style_output_mode` from the six contracts in `reference.md`.
3. A **generation-ready prompt** per panel (and **images** when an image tool is available and the user wants them).

The agent is the **prompt architect**, not the renderer—unless an image tool is invoked after the storyboard is approved.

## Pipeline (non-negotiable order)

**context → storyboard script → locked style → final prompt / render**

Do not skip the storyboard. Do not apply rendering adjectives before zones are mapped.

## Output modes

- **Storyboard only** — User wants the structured artifact only.
- **Prompt only** — User already has a storyboard; supply final prompts only.
- **Storyboard + prompt** — Default when not specified.

Defaults when unspecified:

- `context_mode`: last user message unless files, session scope, or pasted material are explicitly mentioned.
- `panel_count`: 4, unless the user requests 1–6 panels.
- `style_output_mode`: ask when unclear; default to A only when the user asks for a rough sketch, notebook storyboard, or "just make it."
- `output`: storyboard + prompt.
- `render`: only when the user explicitly asks for an image or render.

When the user wants **images**: after storyboard + style lock, use the available **image tool** if present and host policy allows it. If no renderer is available, output prompts for an external generator. If the host requires direct image generation, do not expose the internal prompt unless the user asks. If the user asks for prompt-only output, never invoke a renderer.

## Post-run rerun (once per pass)

After delivering the storyboard and prompts/images, offer a **single** follow-up menu:

- **R1** — Same storyboard, **new style** (re-pick A–F; reread `reference.md`; regenerate).
- **R2** — Same storyboard + style, **change panel count** (1–6); regenerate.
- **R3** — **Revise storyboard** then regenerate (combine with new style if user asks).
- **R4** — **Fresh context** — reconfirm source + style from scratch.
- **R5** — **Prompts export only** — markdown copy-paste, no new images.
- **R0 / done** — Stop.

Wait for explicit choice; do not auto-rerun.

## Context/style gate

Before drafting the storyboard:

- If source + style are clear, proceed without re-asking.
- If source is unclear, ask one source-scope question.
- If style is unclear, ask for A–F unless the user asked for rough sketch/storyboard language; then default to A and state that assumption.
- If the user says "just make it," use storyboard + prompt, 4 panels, default A, and state assumptions.
- When multiple files are in play, number them **C1, C2, …**, offer **C-all** and **C-inline** (inline-only plan), and use structured choice UI if the host supports it so the user does not retype paths.

## Storyboard script structure

Emit markdown with:

- **Metadata:** `style_output_mode`, `context_mode`, optional `panel_count` (1–6).
- **Concept Title**, **Product/Service Type**, **Design Goal**, **Primary Surface**
- **Zones**
  - **A — Interface:** screens, surfaces, UI fragments, key objects
  - **B — Interaction:** flows, transitions, state changes, arrows, logic
  - **C — Brand:** tone scraps, logo roughs, swatches, mood cues
  - **D — Annotations:** callouts, labels, questions, design reasoning (must be substantive)
  - **E — Spatial / Product** (optional): physical context, device, environment
- **Key Notes**, **Constraints**, **Open Questions**

Read **full style contracts** from [reference.md](reference.md) before writing final prompts.

## Locked styles and hybrids

The six `style_output_mode` values and hybrid protocol are defined only in [reference.md](reference.md). After selection: **lock**, **preserve**, **no silent hybridization**. Hybrids require dominant style + named borrowed traits (see `reference.md`).

## Failure modes (avoid)

1. **Skip-the-storyboard** — Image-flavored language before zones exist.
2. **Style bleed** — Rendering adjectives in Stage 1.
3. **Weak zone mapping** — Especially thin **B** or **D**.
4. **Generic AI composition drift** — Centered hero object, low conceptual density.
5. **Locked style instability** — Traits from another mode without hybrid disclosure.

## When not to use

Polished final comps, production wireframes, logo-only exploration, photoreal hero shots, unstructured “just generate an image” without a storyboard phase.

## Optional deep references

For style A (`rough_notebook_storyboard`) craft detail, use:
`references/style-a-composition-templates.md`,
`references/style-a-visual-grammar.md`,
`references/style-a-prompt-templates.md`,
`references/style-a-evaluation-rubric.md`,
`references/style-a-failure-modes.md`, and
`references/style-a-examples.md`.

For styles B–F, rely on the locked contracts in `reference.md` unless a future
style-specific reference file exists. **Style locks and A–F mapping** still come
from `reference.md` in this directory first.

## Revision loop

1. Self-check against failure modes above and drift lists in `reference.md`.
2. If hybrid was requested, verify dominant + borrowed traits are explicit in metadata.
3. Regenerate only the sections that failed the check.
