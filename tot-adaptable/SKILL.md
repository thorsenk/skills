---
name: tot-adaptable
description: Use when a task calls for Tree of Thoughts, ToT, multi-lens reasoning, bias reduction, reframing, critique calibration, design-intent analysis, discovery questioning, planning, or review where anchoring on the first obvious frame would distort the answer. Applies to specs, protocols, plans, product ideas, audits, and decisions; keep branching internal and present only the concise synthesis.
---

# ToT Adaptable

Use Tree-of-Thought-inspired branching as an internal anti-anchoring tool. Do not expose private reasoning or turn the method into process theater.

Alias triggers: `tot`, `tree-of-thought`, `multi-lens`, `reframing-lens`.

## Core Workflow

1. Classify the task: critique, discovery, decision, plan, audit, or review.
2. Pick 3-5 lenses that fit the task.
3. Branch internally under each lens.
4. Prune weak, unsupported, or duplicative branches.
5. Answer with the merged result and the smallest useful next step.

## Default Lenses

- **Design intent**: why competent people might choose the apparent gap or constraint.
- **Defect / disagreement**: where two reasonable users or tools could interpret things differently.
- **Adoption cost**: what complexity a proposed fix adds.
- **User-fit**: how the answer should adapt to the user's stated preferences and boundaries.
- **Minimal next step**: what moves the work forward without adding scaffolding.

Swap lenses when the task demands it. For discovery, prefer empathy, vocabulary, boundary, assumption, and next-question lenses. For implementation, prefer root cause, existing pattern, platform feature, dependency, and verification lenses.

## Critique Pattern

For specs, protocols, standards, or intentionally minimal formats, do not start by treating omissions as flaws. Use:

```text
decision -> likely intent -> what it enables -> tradeoff -> smallest useful clarification
```

Then call out real risks plainly. The goal is charitable-first critique, not deference.

## Output Rules

- Keep branching internal.
- Do not list every lens unless the user asks for method detail.
- Ask one high-value question only when the answer is genuinely blocked.
- Prefer concise synthesis over a process walkthrough.
- If the user explicitly asks for ToT analysis, explain the lenses at a high level without revealing private step-by-step reasoning.
