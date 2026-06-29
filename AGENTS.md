# Agent instructions

## Repo purpose

This is Kyle's personal public skill library.

It contains host-portable skill packages that can be installed into Claude Code
and Codex from one shared repo.

## Working rules

- Keep the repo simple.
- Preserve durable package conventions.
- Do not use governance, canonical-source, SoT, corpus, doctrine, or workspace-OS language.
- Do not add process unless it directly helps install, use, check, or update skills.
- Work with one agent/session at a time on this repo.
- Before editing, inspect the current git state.
- Do not overwrite uncommitted changes from another agent or session.
- After edits, run `node scripts/validate-skills.mjs`.

## Package layout

Each skill lives in one top-level folder.

A skill folder may include:

- `SKILL.md` — main skill instructions
- `reference.md` — local support reference
- `references/` — deeper support notes
- `agents/openai.yaml` — Codex/OpenAI display metadata

Keep `SKILL.md` host-neutral unless host-specific behavior is unavoidable.

## Host support

Claude Code and Codex are supported hosts.

Each skill should declare one support level in `skills.registry.json`:

- `portable` — same core behavior expected in Claude Code and Codex
- `host-adapted` — shared core with small host-specific metadata or behavior notes
- `host-specific` — intentionally built for one host only

Do not maintain separate Claude and Codex instruction forks.

## Language guardrail

Prefer: main, primary, shared, package, skill folder, support file, package index,
sanity check, compatibility note.

Avoid: canonical, source of truth, SoT, governance, doctrine, corpus, authority,
control plane, operating system.
