#!/usr/bin/env python3
"""Validate a VDL reference manifest and its local image files."""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path


REQUIRED = {
    "id",
    "path",
    "roles",
    "approval_state",
    "provenance",
    "checksum",
    "applies_to",
    "does_not_apply_to",
    "surfaces",
    "limitations",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate(package_or_manifest: Path) -> list[str]:
    manifest_path = (
        package_or_manifest / "references" / "reference-manifest.json"
        if package_or_manifest.is_dir()
        else package_or_manifest
    )
    package = manifest_path.parent.parent
    errors: list[str] = []
    try:
        data = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"cannot read manifest: {exc}"]

    references = data.get("references")
    if not isinstance(references, list):
        return ["references must be an array"]

    ids: set[str] = set()
    by_id: dict[str, dict] = {}
    for index, ref in enumerate(references):
        label = f"references[{index}]"
        if not isinstance(ref, dict):
            errors.append(f"{label} must be an object")
            continue
        missing = sorted(REQUIRED - ref.keys())
        if missing:
            errors.append(f"{label} missing fields: {', '.join(missing)}")
        ref_id = ref.get("id")
        if not isinstance(ref_id, str) or not ref_id:
            errors.append(f"{label}.id must be non-empty text")
            continue
        if ref_id in ids:
            errors.append(f"duplicate reference id: {ref_id}")
        ids.add(ref_id)
        by_id[ref_id] = ref

        rel = ref.get("path", "")
        rel_path = Path(rel) if isinstance(rel, str) else Path()
        if not rel or rel_path.is_absolute() or ".." in rel_path.parts:
            errors.append(f"{ref_id}: path must be a safe package-relative path")
        else:
            image = package / rel_path
            if not image.is_file():
                errors.append(f"{ref_id}: file does not exist: {rel}")
            elif ref.get("checksum") != f"sha256:{sha256(image)}":
                errors.append(f"{ref_id}: checksum does not match {rel}")

        roles = ref.get("roles", [])
        if not isinstance(roles, list) or not roles:
            errors.append(f"{ref_id}: roles must be a non-empty array")
        if "approved-lock" in roles:
            approval = ref.get("approval")
            if ref.get("approval_state") != "approved":
                errors.append(f"{ref_id}: approved-lock requires approval_state=approved")
            if not isinstance(approval, dict) or not approval.get("approver") or not approval.get("date"):
                errors.append(f"{ref_id}: approved-lock requires approver and date")

    for ref_id, ref in by_id.items():
        for other_id in ref.get("excludes_reference_ids", []):
            other = by_id.get(other_id)
            if not other:
                errors.append(f"{ref_id}: unknown excluded reference: {other_id}")
                continue
            if ref.get("approval_state") == other.get("approval_state") == "approved":
                overlap_traits = set(ref.get("applies_to", [])) & set(other.get("applies_to", []))
                overlap_surfaces = set(ref.get("surfaces", [])) & set(other.get("surfaces", []))
                if overlap_traits and overlap_surfaces:
                    errors.append(
                        f"{ref_id} and {other_id}: contradictory approved references overlap on "
                        f"traits {sorted(overlap_traits)} and surfaces {sorted(overlap_surfaces)}"
                    )
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("package_or_manifest", type=Path)
    args = parser.parse_args()
    errors = validate(args.package_or_manifest.expanduser().resolve())
    if errors:
        for error in errors:
            print(f"error: {error}", file=sys.stderr)
        return 1
    print("Reference manifest valid.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
