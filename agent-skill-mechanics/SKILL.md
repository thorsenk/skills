---
name: agent-skill-mechanics
description: Use when designing, reviewing, or editing agent skill packages for predictable behavior: trigger phrasing, package structure, runtime steering, pruning, aliases, SKILL.md content, support files, and minimal host-portable metadata. Helps turn rough skill ideas into small, checkable packages without adding process for its own sake.
---

# Agent Skill Mechanics

Design agent skills that make the next agent follow a predictable process. Predictable means the agent works the same way under similar requests; it does not mean the output text is identical every run.

## Triggers / Invocation

Treat the description as the trigger surface.

- Name the real situations that should activate the skill.
- Keep one trigger per distinct use. Do not stack near-synonyms to make the same point.
- Include aliases only when a user would actually type them or another package needs them.
- If a skill should be reached only by a user, keep its trigger surface narrow and make the human-facing name easy to remember.
- If several manual skills become hard to remember, prefer one small routing skill over stuffing every trigger into every package.

Done when a reader can tell when the skill should run, when it should not run, and which words are expected to trigger it.

## Structure / Information Hierarchy

Put the most-used instructions closest to the top.

- Keep required steps in `SKILL.md`, in the order the agent should perform them.
- End each important step with a checkable done condition.
- Move optional detail into support files only when some runs need it and others do not.
- Keep related rules together so the agent does not have to assemble one concept from scattered lines.
- Do not add support files for future possibilities. Add them when they reduce real clutter or repeated work.

Done when the package can be followed from `SKILL.md` alone, and every extra file has a clear reason to exist.

## Steering / Behavior Shaping

Shape the agent's behavior with compact, reusable cues.

- Use stable terms the model already understands when they express the behavior cleanly.
- Make branches explicit when different requests need different paths.
- Use checkable done conditions to prevent early stopping.
- Hide later steps only when visible later work is causing the agent to rush the current step.
- Prefer one strong instruction in the shared path over repeated reminders in every branch.

Done when the skill points the agent toward the same process without over-explaining ordinary behavior.

## Pruning / Lean Editing

Cut anything that does not change the next run.

- Delete no-op sentences the agent would already follow.
- Delete duplicate meanings instead of rewording them.
- Remove stale examples, speculative branches, and setup notes that do not help install, use, check, or update the package.
- Replace repeated explanations with one good term when the term carries the behavior.
- Keep legal or attribution notes outside runtime instructions unless the runtime needs them.

Done when each remaining line changes invocation, execution, checking, or maintenance.

## Package Check

Before finishing a package:

1. Confirm the folder name, frontmatter `name`, registry `id`, and registry `path` match.
2. Confirm every listed support file exists, and every package file is listed.
3. Confirm README install or package tables include the new package when the repo pattern requires it.
4. Run the repo's skill validator.
5. Search for old names or rejected aliases; every remaining hit must be intentional.
