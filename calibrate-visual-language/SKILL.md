---
name: calibrate-visual-language
description: Build, repair, or validate a reusable visual-design-language skill from visual references, controlled comparison specimens, and explicit decisions. Use when a user wants to define a repeatable image style, turn references into a portable style package, compare visual directions before choosing one, or test a style skill for drift. Do not use for one-off image requests or routine generation with an already approved style skill.
---

# Calibrate Visual Language

Turn evidence and explicit decisions into a portable visual-design-language (VDL) skill. Discover the style through controlled specimens before writing final generation rules.

## Load only what the phase needs

- Read [calibration-protocol.md](references/calibration-protocol.md) before framing or running calibration rounds.
- Read [reference-role-model.md](references/reference-role-model.md) when classifying, approving, or rejecting images.
- Read [visual-rule-taxonomy.md](references/visual-rule-taxonomy.md) when translating evidence into rules.
- Read [generated-skill-contract.md](references/generated-skill-contract.md) before creating or revising a VDL package.
- Read [validation-protocol.md](references/validation-protocol.md) before calling a package validated or proposing release.

## Workflow

1. **Frame.** Identify intended artifacts, surfaces, audience, use context, fidelity, exclusions, generation environment, and whether this is a new package, revision, or fork. Ask one decision-shaping question only when the answer changes the next specimen or package decision.
2. **Inventory.** Inspect every supplied reference. Give each image an explicit role and record conflicts, missing evidence, and uncertain inferences. A layout reference never silently defines visual treatment.
3. **Form a provisional grammar.** Separate observed traits from inferred rules. Track decisions, conflicts, and uncertainties. Mark every rule open, provisional, approved, rejected, or superseded.
4. **Run controlled rounds.** Keep fixture content, hierarchy, aspect ratio, object count, and major geometry fixed. Change one declared variable family at a time. Label each specimen with a stable ID and record fixed and varied parameters.
5. **Confirm surfaces and boundaries.** Test every materially different supported surface plus at least one pressure case. Use actual images, not prose alone, for traits that depend on visual evidence.
   When the intended language claims fidelity to a physical medium, use close-up photographs or scans of that medium as the material evidence. Generated simulations may document rejection directions, but they cannot approve physical stroke behavior.
6. **Request explicit approval.** Never infer approval from silence or continuation. Promote only accepted specimens to approved locks. Keep useful failures as anti-references.
7. **Create the VDL skill.** Run `scripts/init_vdl_skill.py` only after minimum locks exist. Fill the generated package with approved images, rules, manifest entries, fixture records, reference board, and evaluation rubric.
8. **Validate and forward-test.** Run both package validators and the host package check. Test ordinary, alternate-surface, boundary, and reference-conflict prompts in a clean context when available. Do not leak expected answers into tests.
9. **Propose release.** Report `PROVISIONAL`, `VALIDATED`, or `BLOCKED`. Installation or publication requires a separate explicit user approval; validation alone is not release authorization.

## Calibration-round contract

For every round:

1. State what is already approved.
2. Name the variable family under test.
3. Name what remains fixed.
4. Present a bounded comparison set.
5. Ask the user to select, reject, or correct traits.
6. Record the decision and evidence.
7. Select the next unresolved variable with the greatest downstream effect.

When the user delegates approval judgment to you, record that delegation and still apply the same evidence and comparison checks. Do not turn a provisional capability specification into final style rules without specimens.

## Minimum package gate

Do not generate a final VDL package until it has:

- one approved primary-surface lock;
- one approved boundary or materially different surface lock;
- visual evidence for mark-making and other style-defining traits;
- explicit prohibited traits or anti-references;
- resolved blocking conflicts;
- a fixture for every claimed supported surface.

## Scripts

```sh
python3 scripts/init_vdl_skill.py --display-name "Example Style" --slug example-style --destination /path/to/skills
python3 scripts/validate_reference_manifest.py /path/to/example-style
python3 scripts/validate_vdl_package.py /path/to/example-style
```

`init_vdl_skill.py` refuses non-empty destinations. Never overwrite an installed or released package. For revisions, create a separate candidate folder or worktree and preserve the prior version.

## Non-negotiable boundaries

- Do not average contradictory approved references into a hybrid.
- Do not let style references rewrite information architecture or content.
- Do not let structure references import an unrelated visual treatment.
- Do not claim deterministic or pixel-identical output from stochastic models.
- Do not replace approved images with prose summaries.
- Do not use generated texture, noise, blur, displacement, or uniform transparency as evidence for physical material behavior.
- Do not call a package validated because its files merely exist.
- Do not install, publish, overwrite, or release without explicit authorization.
