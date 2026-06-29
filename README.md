# skills

A public monorepo of agent skills for hosts that can load folder-based `SKILL.md`
packages, including Claude Code and Codex. Each top-level skill directory is
self-contained: a `SKILL.md` with YAML frontmatter plus any supporting reference files.

## Skills

| Skill | Description |
|-------|-------------|
| [storyboard-sketch](storyboard-sketch/) | Structured concept visualization for external image-capable AI: mandatory storyboard script, six locked `style_output_mode` contracts, anti-drift rules, optional image or prompt output, and a one-shot post-run rerun menu (R0–R5). |

`concept-storyboard-sketch` is preserved as a legacy trigger alias inside the skill
metadata; install the canonical `storyboard-sketch` package.

## Install

Clone the repo once, then symlink the skills you want into the host-specific skills
directory so updates here are picked up automatically.

```sh
# from anywhere
git clone https://github.com/thorsenk/skills.git
cd skills

# Claude Code
mkdir -p ~/.claude/skills
ln -s "$PWD/storyboard-sketch" ~/.claude/skills/storyboard-sketch

# Codex
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
ln -s "$PWD/storyboard-sketch" "${CODEX_HOME:-$HOME/.codex}/skills/storyboard-sketch"
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

Codex-specific display metadata can live in `agents/openai.yaml` inside a skill folder.
Keep host-specific metadata there rather than forking the skill instructions.

## License

[MIT](LICENSE) © 2026 Kyle Thorsen
