# Validation protocol

## Structural checks

Run:

```sh
python3 scripts/validate_reference_manifest.py /path/to/style-skill
python3 scripts/validate_vdl_package.py /path/to/style-skill
```

Also run the target skill library's own package validator. A clean file check is necessary but not sufficient.

## Release gates

Mark `VALIDATED` only when:

- every approved image has explicit traits, surfaces, approval metadata, and a valid path;
- every claimed physical-material trait traces to a real photographed or scanned specimen rather than a generated simulation;
- every invariant traces to approved evidence or a recorded decision;
- no blocking conflict is represented as approved;
- skill instructions, contract, schema, manifest, board, and images agree;
- each claimed surface has a confirmation fixture;
- important prohibited traits have rules or anti-references;
- a clean-context agent can act without the calibration conversation;
- the rubric returns an unambiguous pass, revise, or reject outcome;
- structural validators pass;
- the user or delegated evaluator approves the candidate direction.

## Forward tests

Use raw prompts and artifacts. Do not include expected answers or prior conclusions.

1. Ordinary request for the primary artifact and surface.
2. A materially different supported surface or aspect ratio.
3. A pressure prompt likely to tempt drift.
4. A prompt containing conflicting structure and style references.

A test passes only when invariants hold, prohibited traits do not materially appear, the score meets the approved threshold, and the agent surfaces unresolved or out-of-scope requests instead of inventing rules.

If independent fresh-agent execution is unavailable, run a clean-room prompt audit against the package and report that operational generation remains unverified. Do not mislabel a simulated check as a fresh-agent test.

## Status values

- `PROVISIONAL`: usable for continued calibration, not ready for release.
- `VALIDATED`: every release gate passes; not installed or published.
- `BLOCKED`: a material conflict, missing lock, or failed test prevents release.
- `RELEASED`: the user separately approved installation or publication after validation.
