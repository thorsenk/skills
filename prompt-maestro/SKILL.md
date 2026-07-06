---
name: prompt-maestro
description: Use when a user wants a prompt classified, evaluated, hardened, rewritten, or checked before it is run. Applies to audit prompts, implementation prompts, research prompts, extraction prompts, creative prompts, agent prompts, skill prompts, handoff prompts, and prompt-quality reviews; classify the prompt first, then audit clarity, context, risk, output contract, and validation without executing the target prompt unless explicitly asked afterward.
---

# Prompt Maestro

Evaluate prompts before execution. The agent is the prompt reviewer, not the executor, unless the user explicitly asks to run the prompt after the review.

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

## Default Output

Use this shape unless the user asks for something shorter:

```text
Verdict: Ready / Needs edits / Hold
Classification: <primary type>; <secondary types if useful>
Risk level: Low / Medium / High / Critical
Best use: <what this prompt is suited for>

Findings
- <severity>: <issue> -> <specific fix>

Suggested edits
- Replace/Add/Delete: <exact language>

Revised prompt
<only when requested or clearly useful>

Open questions
- <only blockers or high-value unknowns>
```

## Operating Rules

- Do not execute the target prompt during review.
- Do not treat a prompt as good just because it is detailed; check whether the details make the intended task safer and clearer.
- Do not force software assumptions onto non-software prompts.
- Do not hard-code live state such as branch names, dates, file paths, versions, prices, schedules, or current roles when the executor should verify them.
- Prefer evidence receipts for high-risk workspace, legal, financial, medical, privacy, publication, destructive, or external-system prompts.
- Keep the answer direct. Name the flaw, why it matters, and the smallest useful fix.
- If a prompt is intentionally minimal, identify the likely intent before calling the omission a defect.

## When Not To Use

- The user wants the prompt executed now, not reviewed.
- The user wants broad writing help where no prompt will be reused or run.
- The user asks for visual/storyboard prompt orchestration; use the storyboard package instead when that workflow applies.
