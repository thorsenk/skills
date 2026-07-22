# Generated VDL skill contract

## Required layout

```text
<style-skill-name>/
├── SKILL.md
├── agents/openai.yaml
├── references/
│   ├── generation-contract.md
│   ├── style-schema.json
│   ├── reference-manifest.json
│   └── evaluation-rubric.md
├── assets/
│   ├── reference-board/
│   │   ├── index.html
│   │   └── styles.css
│   ├── approved-locks/
│   ├── anti-references/
│   └── calibration-fixtures/
└── scripts/validate_vdl_package.py
```

Do not add a README, install guide, change log, or duplicate explanation. Keep routine procedure in `SKILL.md`; keep detailed style data in references and visual evidence in assets.

## Identity fields

Use the same slug, display name, package version, and status in `SKILL.md`, the generation contract, schema, manifest, and reference board. Resolve every rule and reference ID across files.

## Generated `SKILL.md`

Keep it concise and procedural. It must route supported modes, preserve structure/style boundaries, load the applicable surface profile and approved references, construct generation instructions, apply the rubric, route style revisions back to calibration, and avoid reopening approved decisions during routine use.

## Package data

- `style-schema.json`: package identity, intended and excluded uses, generation environment, rules, surface profiles, prohibited traits, and open decisions.
- `reference-manifest.json`: each reference path, role, approval, checksum, applicable traits and surfaces, exclusions, provenance, and limitations.
- `generation-contract.md`: prompt order, input-role handling, generation method, output behavior, and drift response.
- `evaluation-rubric.md`: weighted criteria, critical failures, thresholds, and pass/revise/reject behavior.
- reference board: actual images, trait samples, palette, spacing demonstrations, rules, open decisions, and validation status.

The interface around the reference board must be neutral and visually subordinate to the documented style.
