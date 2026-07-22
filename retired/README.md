# Retired skills

Packages move here only when they are no longer supported or installable.

- Keep deprecated packages at the repository top level with `status: deprecated` and a `replacement` skill ID while users can still install them.
- Move retired packages to `retired/<skill-id>/`, move their registry entry from `skills` to `retired`, and set `status: retired`.
- Preserve the package ID and folder contents so old links and migration history remain understandable.
- Do not include retired packages in bulk installation.

Blocked, experimental, or incomplete packages are not retired. Keep them in the main package area with their applicable status until they are completed or intentionally withdrawn.
