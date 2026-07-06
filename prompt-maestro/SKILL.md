---
name: prompt-maestro
description: Use when a user wants a prompt classified, evaluated, hardened, rewritten, or checked before it is run. Applies to audit prompts, implementation prompts, research prompts, extraction prompts, creative prompts, agent prompts, skill prompts, handoff prompts, and prompt-quality reviews; classify the prompt first, then produce a visual HTML scorecard report that explains the scoring rubric, findings, risks, and exact fixes without executing the target prompt unless explicitly asked afterward.
---

# Prompt Maestro

Evaluate prompts before execution. The agent is the prompt reviewer and report producer, not the executor, unless the user explicitly asks to run the prompt after the review.

Alias triggers: `prompt-audit`, `prompt-qa`, `prompt-evaluator`, `prompt-review`, `evaluate prompt`, `review this prompt`, `harden this prompt`, `harden-this-prompt`.

## Core Workflow

1. Identify the exact prompt target.
   - Use the pasted prompt, selected text, attached file, or named section the user asked about.
   - If more than one prompt could be reviewed, pick the clearly active one or ask one question.
   - Done when the reviewed prompt is unambiguous.

2. Classify the prompt before scoring it.
   - Assign a primary prompt type, optional secondary types, context dependency, lifecycle, target executor, expected output, and risk level.
   - Use [reference.md](reference.md) for the taxonomy and risk cues.
   - Done when the user can tell what kind of prompt they are holding.

3. Ground the review in the prompt's intended use.
   - For workspace-bound prompts, inspect the relevant local instructions, README files, package metadata, tests, schemas, examples, or docs before judging coverage.
   - For pasted or standalone prompts, use only the supplied context and label missing context plainly.
   - Separate explicit facts, inferences, and assumptions when they affect the verdict.
   - Done when the review is tied to the real operating context, not generic prompt advice.

4. Audit the prompt against the right rubric.
   - Check target clarity, scope, inputs, constraints, autonomy boundaries, output contract, evidence expectations, validation, failure handling, privacy/security, and model/tool fit.
   - Apply the scoring caps in [reference.md](reference.md) when blockers remain.
   - Done when findings are ranked by impact, not by wording preference.

5. Return exact fixes.
   - In QA mode, provide findings plus specific replacement language or additions.
   - In hardening mode, provide a revised prompt after naming the important changes.
   - If the user asked for multiple versions, provide short and expanded variants.
   - Done when the user can either run the prompt, revise it, or decide not to use it.

6. Produce a visual report artifact.
   - When file creation is available, create a standalone long-scroll HTML report.
   - Use [references/visual-report.md](references/visual-report.md) for visual and content requirements.
   - Use [report-template.html](report-template.html) as the starting structure unless the user supplied a stricter design direction.
   - If file creation is unavailable, return complete standalone HTML in a fenced block plus a short plain-language summary.
   - Done when the report explains the score through visible rubric rows, score rings, severity indicators, findings, exact edits, and open questions.

## Default Output

Default to an artifact-first response:

- Create or provide a standalone HTML report.
- In chat, return only the report path or HTML block, verdict, score, and the next concrete step.
- Do not reduce the review to a bare score. The user must be able to see how each rubric dimension affected the score.
- If the user explicitly asks for text only, use the compact text fallback in [references/visual-report.md](references/visual-report.md).

## Operating Rules

- Do not execute the target prompt during review.
- Do not treat a prompt as good just because it is detailed; check whether the details make the intended task safer and clearer.
- Do not force software assumptions onto non-software prompts.
- Do not hard-code live state such as branch names, dates, file paths, versions, prices, schedules, or current roles when the executor should verify them.
- Prefer evidence receipts for high-risk workspace, legal, financial, medical, privacy, publication, destructive, or external-system prompts.
- Keep the answer direct. Name the flaw, why it matters, and the smallest useful fix.
- If a prompt is intentionally minimal, identify the likely intent before calling the omission a defect.
- Use restrained visual design: long scroll, generous whitespace, compact typography, visible hierarchy, scoring rings, finding severity chips, light animation, and parallax only where it clarifies report structure.
- Respect reduced-motion preferences in generated HTML.

## When Not To Use

- The user wants the prompt executed now, not reviewed.
- The user wants broad writing help where no prompt will be reused or run.
- The user asks for visual/storyboard prompt orchestration; use the storyboard package instead when that workflow applies.
