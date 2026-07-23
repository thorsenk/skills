# Plan 002: Make artifact output transactional and symlink-safe

> **Executor instructions**: Execute each step and verification gate in order.
> Update `plans/README.md` when complete. Stop instead of weakening a safety
> check to preserve legacy behavior.
>
> **Drift check (run first)**:
> `git diff --stat 9ebe015 -- refactor-writing/scripts/render-report.mjs refactor-writing/SKILL.md refactor-writing/references/report-design-system.md tests/refactor-writing`
> Compare the excerpts below with live source. This plan requires Plan 001's
> tests and the preserved Revision 8 working tree.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/001-establish-renderer-characterization-tests.md`
- **Category**: security / bug
- **Planned at**: commit `9ebe015` plus live working tree, 2026-07-23

## Why this matters

The renderer promises to keep output outside the reviewed workspace, but the
guard is lexical and output writes follow existing symlinks. It also overwrites
files concurrently and deletes `hero-dotted-wave.png` without proving the file
belongs to the renderer. A malformed or reused output folder can therefore
overwrite unrelated files or retain a partial artifact after failure.

## Current state

`refactor-writing/scripts/render-report.mjs:108-110`:

```js
function inside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
```

`refactor-writing/scripts/render-report.mjs:334-343`:

```js
await mkdir(outputDir, { recursive: true });
await rm(path.join(outputDir, "hero-dotted-wave.png"), { force: true });
await Promise.all([
  copyFile(...),
  writeFile(...)
]);
```

The renderer may be rerun into an invocation folder that also contains
`invocation.json`; do not delete unknown files. Output must remain a movable,
dependency-free folder with same-folder links.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Focused tests | `node --test tests/refactor-writing/*.test.mjs` | All tests pass |
| Syntax | `node --check refactor-writing/scripts/render-report.mjs` | No output |
| Package validation | `node scripts/validate-skills.mjs` | Exit 0 |
| Whitespace | `git diff --check` | No output |

## Scope

**In scope**:

- `refactor-writing/scripts/render-report.mjs`
- `refactor-writing/SKILL.md`
- `refactor-writing/DESIGN.md`
- `refactor-writing/references/report-design-system.md`
- `tests/refactor-writing/render-report.test.mjs`

**Out of scope**:

- Deleting or moving any real user artifact folder.
- Changing generated HTML structure or visual design.
- Adding a general-purpose filesystem library.
- Cleaning unknown files from existing invocation folders.

## Git workflow

- Branch: `codex/improve-002-safe-output`
- Commit message: `fix(refactor-writing): harden artifact output writes`
- Do not push from this advisor workflow.

## Steps

### Step 1: Add failing filesystem-boundary cases

Extend the integration tests with temporary directories and symlinks. Cover:

- output directory itself is a symlink;
- an owned destination such as `report.html` is a symlink;
- `sourceWorkspace` or an existing output ancestor contains a symlink that
  makes the effective output land inside the reviewed workspace;
- a pre-existing unrelated `hero-dotted-wave.png` is not deleted;
- a forced validation failure leaves the prior complete output unchanged.

Skip symlink cases only when the operating system explicitly denies symlink
creation; report the skip reason.

**Verify**:
`node --test tests/refactor-writing/*.test.mjs`
→ new cases fail against the old renderer for the expected reasons.

### Step 2: Resolve effective paths safely

Use `lstat`, `realpath`, and the nearest existing ancestor to calculate the
effective output location before any write. Reject:

- an output directory that is a symbolic link;
- any owned destination file that is a symbolic link;
- an effective output path inside the effective `sourceWorkspace` unless the
  explicit `--allow-inside-source` flag is present.

If `sourceWorkspace` does not exist, retain lexical checking but state that
limitation in the error. Do not silently treat an unresolvable path as safe.

**Verify**:
`node --test tests/refactor-writing/*.test.mjs`
→ symlink and containment cases pass.

### Step 3: Stage and validate before replacing owned files

Render all six owned files into a newly created sibling staging directory.
Run `verifyRelativeLinks` against staging. Only after every render and
validation succeeds, replace the six owned destination files with staged
regular files.

Do not remove unknown files. Remove the unconditional
`rm(...hero-dotted-wave.png)`. If a retired raster is present, leave it
unreferenced and print one warning explaining that the renderer did not delete
an unowned file.

Always clean the renderer-created staging directory in `finally`. Cleanup must
target the exact staging path, never the output parent.

**Verify**:
focused tests pass and the failure-injection case preserves the old artifact.

### Step 4: Document the output contract

Update the skill and system documents to say:

- output must not be a symlink;
- generated destinations must be regular files or absent;
- validation completes in staging before replacement;
- unknown files are preserved;
- `--allow-inside-source` is the only authorized containment override.

Keep the existing plain vocabulary and avoid introducing a general deployment
system.

**Verify**:
`rg -n "symlink|staging|allow-inside-source" refactor-writing/SKILL.md refactor-writing/DESIGN.md refactor-writing/references/report-design-system.md`
→ each concept appears where relevant.

## Test plan

Use Plan 001's subprocess integration style. New cases must prove source
containment, output-dir symlink rejection, destination symlink rejection,
preservation of unrelated files, and no partial replacement after validation
failure.

## Done criteria

- [ ] No unconditional deletion remains in the renderer.
- [ ] All generated destinations reject symbolic links.
- [ ] Effective source/output containment is tested.
- [ ] Rendering is validated in staging before owned files are replaced.
- [ ] Unknown invocation-folder files remain untouched.
- [ ] All focused and repository validation commands pass.

## STOP conditions

- Safe replacement requires recursively deleting the selected output folder.
- A solution would discard `invocation.json` or other unknown user files.
- Real-path verification cannot distinguish the output from the reviewed
  workspace.
- Plan 001 is not present and passing.

## Maintenance notes

Any future generated filename must be added to the explicit owned-file list and
the symlink tests. Never broaden cleanup from that list to the output folder.
