# skills

A public monorepo of [Claude Code](https://claude.com/claude-code) agent skills. Each
top-level directory is a self-contained skill: a `SKILL.md` (with YAML frontmatter that
Claude reads to decide when to trigger it) plus any supporting reference files.

## Skills

| Skill | Description |
|-------|-------------|
| [storyboard-sketch](storyboard-sketch/) | Structured concept visualization for external image-capable AI: mandatory storyboard script, six locked `style_output_mode` contracts, anti-drift rules, optional image or prompt output, and a one-shot post-run rerun menu (R0–R5). |

## Install

Claude Code discovers skills under `~/.claude/skills/`. Symlink the skills you want from
this repo into that directory so updates here are picked up automatically.

```sh
# from anywhere
git clone https://github.com/thorsenk/skills.git
cd skills

# symlink a single skill
ln -s "$PWD/storyboard-sketch" ~/.claude/skills/storyboard-sketch
```

To install every skill in the repo:

```sh
mkdir -p ~/.claude/skills
for d in */; do
  ln -s "$PWD/${d%/}" ~/.claude/skills/"${d%/}"
done
```

Remove a skill by deleting its symlink (`rm ~/.claude/skills/storyboard-sketch`); the source
in this repo is untouched.

## License

[MIT](LICENSE) © 2026 Kyle Thorsen
