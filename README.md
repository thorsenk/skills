# skills

Kyle's personal public library of agent skills for hosts that can load
folder-based `SKILL.md` packages, including Claude Code and Codex. Each
top-level skill directory is self-contained: a `SKILL.md` with YAML frontmatter
plus any supporting reference files.

## Skills

| Skill | Description |
|-------|-------------|
| [storyboard-prompt-orchestration](storyboard-prompt-orchestration/) | Storyboard Prompt-Orchestration Skill for external image-capable AI: context scoping, mandatory storyboard script, six locked `style_output_mode` contracts, prompt generation, optional rendering, and a controlled rerun menu (R0–R5). |
| [prompt-maestro](prompt-maestro/) | Classify, audit, and harden prompts with a visual HTML scorecard before execution. |
| [tot-adaptable](tot-adaptable/) | Tree-of-Thought-inspired internal branching for multi-lens critique, discovery, planning, and review without process theater. |
| [agent-skill-mechanics](agent-skill-mechanics/) | Design predictable agent skills through triggers, structure, steering, and pruning. |

`storyboard-sketch` and `concept-storyboard-sketch` are preserved as legacy
trigger aliases inside the skill metadata; install the primary
`storyboard-prompt-orchestration` package.

## Package layout

Each top-level skill directory must include:

- `SKILL.md` — main skill instructions with YAML frontmatter
- Optional `reference.md` — main local reference for the skill
- Optional `references/` — deeper craft references
- Optional `agents/openai.yaml` — Codex/OpenAI display metadata
- No host-specific fork of the core skill instructions

Each package entry in `skills.registry.json` must declare one `support_level`:

- `portable` — same core behavior expected in Claude Code and Codex
- `host-adapted` — shared core with small host-specific metadata or notes
- `host-specific` — intentionally built for one host only

Keep `SKILL.md` host-neutral unless host-specific behavior is unavoidable.

## Install

Clone the repo once, then symlink the skills you want into the host-specific skills
directory so updates here are picked up automatically.

```sh
# from anywhere
git clone https://github.com/thorsenk/skills.git
cd skills

# Claude Code
mkdir -p ~/.claude/skills
ln -s "$PWD/storyboard-prompt-orchestration" ~/.claude/skills/storyboard-prompt-orchestration

# Codex
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
ln -s "$PWD/storyboard-prompt-orchestration" "${CODEX_HOME:-$HOME/.codex}/skills/storyboard-prompt-orchestration"
```

To install every skill in the repo for both hosts:

```sh
for target in ~/.claude/skills "${CODEX_HOME:-$HOME/.codex}/skills"; do
  mkdir -p "$target"
  for d in */; do
    [ -f "$d/SKILL.md" ] || continue
    ln -s "$PWD/${d%/}" "$target/${d%/}"
  done
done
```

Remove a skill by deleting its symlink; the source in this repo is untouched.
If an old install path is a copied folder instead of a symlink, move or remove that
folder before linking the repo package.
If `storyboard-sketch` is already installed as an old symlink, remove that
symlink and install `storyboard-prompt-orchestration`.

Codex-specific display metadata can live in `agents/openai.yaml` inside a skill folder.
Keep host-specific metadata there rather than forking the skill instructions.

## Sanity check

```sh
node scripts/validate-skills.mjs
```

The sanity check covers the package index, each package entrypoint, listed
support files, README coverage, and Codex display metadata when present.

## License

[MIT](LICENSE) © 2026 Kyle Thorsen
