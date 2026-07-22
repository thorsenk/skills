---
name: {{SKILL_SLUG}}
description: Apply the {{DISPLAY_NAME}} visual-design language to supported image-generation and image-restyling requests. Use for routine generation, continuation, comparison, or drift evaluation after the style package has been calibrated and validated. Route requests that change the visual language itself back through calibrate-visual-language.
---

# {{DISPLAY_NAME}}

Apply the approved visual language recorded in this package. Package ID: `{{SKILL_SLUG}}`.

## Load the package

1. Read [generation-contract.md](references/generation-contract.md).
2. Read [style-schema.json](references/style-schema.json) and select the applicable surface profile.
3. Read [reference-manifest.json](references/reference-manifest.json) and load only the approved locks that apply to the requested traits and surface.
4. Read [evaluation-rubric.md](references/evaluation-rubric.md) before judging output.

## Generate

1. Identify the generation mode, artifact purpose, surface, required content, hierarchy, image roles, output count, and aspect ratio.
2. Preserve information architecture from structure references. Apply visual treatment only from the approved style rules and applicable locks.
3. Resolve conflicts using the package's recorded reference priority. Ask one concise question only when the conflict materially changes the output.
4. Construct the generation instruction in the order defined by the generation contract.
5. Generate or edit with the available image capability, including every required image input through its supported mechanism.
6. Score the result. Regenerate when a critical rule fails and another attempt is reasonable. Do not present a known failure as validated.
7. Return routine results without unnecessary process narration. Report the smallest actionable gap when a request exceeds a validated boundary.

## Boundaries

- Use one artifact per image unless the user explicitly asks for a board or comparison set.
- Do not import styling from a structure-only reference.
- Do not redesign supplied information architecture during a style-only restyle.
- Do not reopen approved style decisions during routine use.
- Route style changes to `calibrate-visual-language` as a candidate revision.
- Do not claim deterministic or pixel-identical stochastic output.
