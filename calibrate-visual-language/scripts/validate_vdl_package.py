#!/usr/bin/env python3
"""Validate VDL package structure, identity, links, fixtures, and references."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path


REQUIRED_FILES = [
    "SKILL.md",
    "agents/openai.yaml",
    "references/generation-contract.md",
    "references/style-schema.json",
    "references/reference-manifest.json",
    "references/evaluation-rubric.md",
    "assets/reference-board/index.html",
    "assets/reference-board/styles.css",
    "scripts/validate_vdl_package.py",
]
REQUIRED_DIRS = [
    "assets/approved-locks",
    "assets/anti-references",
    "assets/calibration-fixtures",
]
PLACEHOLDER = re.compile(r"\{\{[A-Z0-9_]+\}\}|\bTODO\b|\bTBD\b")


def digest(path: Path) -> str:
    value = hashlib.sha256(path.read_bytes()).hexdigest()
    return f"sha256:{value}"


def load_json(path: Path, errors: list[str]) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"cannot parse {path.name}: {exc}")
        return {}
    if not isinstance(data, dict):
        errors.append(f"{path.name} must contain an object")
        return {}
    return data


def validate(package: Path) -> list[str]:
    errors: list[str] = []
    for rel in REQUIRED_FILES:
        if not (package / rel).is_file():
            errors.append(f"missing file: {rel}")
    for rel in REQUIRED_DIRS:
        if not (package / rel).is_dir():
            errors.append(f"missing directory: {rel}")
    if errors:
        return errors

    for path in package.rglob("*"):
        if path == package / "scripts/validate_vdl_package.py":
            continue
        if path.is_file() and path.suffix.lower() in {".md", ".json", ".html", ".css", ".yaml", ".py"}:
            match = PLACEHOLDER.search(path.read_text(encoding="utf-8"))
            if match:
                errors.append(f"unresolved placeholder in {path.relative_to(package)}: {match.group(0)}")

    schema = load_json(package / "references/style-schema.json", errors)
    manifest = load_json(package / "references/reference-manifest.json", errors)
    if not schema or not manifest:
        return errors

    identity_fields = [("vdl_id", "vdl_id"), ("name", "name"), ("package_version", "package_version"), ("package_status", "package_status")]
    for schema_key, manifest_key in identity_fields:
        if schema.get(schema_key) != manifest.get(manifest_key):
            errors.append(f"identity mismatch for {schema_key}")
    vdl_id = schema.get("vdl_id")
    name = schema.get("name")
    version = schema.get("package_version")
    status = schema.get("package_status")
    if package.name != vdl_id:
        errors.append("package folder name must match vdl_id")
    if status not in {"PROVISIONAL", "VALIDATED", "BLOCKED", "RELEASED"}:
        errors.append("package_status is invalid")

    skill = (package / "SKILL.md").read_text(encoding="utf-8")
    contract = (package / "references/generation-contract.md").read_text(encoding="utf-8")
    board = (package / "assets/reference-board/index.html").read_text(encoding="utf-8")
    metadata = (package / "agents/openai.yaml").read_text(encoding="utf-8")
    for value, label in [(vdl_id, "vdl_id"), (name, "name")]:
        if not isinstance(value, str) or not value:
            errors.append(f"missing identity value: {label}")
        else:
            for rel, body in [("SKILL.md", skill), ("generation-contract.md", contract), ("index.html", board)]:
                if value not in body:
                    errors.append(f"{rel} does not declare {label}: {value}")
    for value, label in [(version, "package_version"), (status, "package_status")]:
        if not isinstance(value, str) or value not in contract or value not in board:
            errors.append(f"contract or board does not declare {label}: {value}")
    if f"${vdl_id}" not in metadata:
        errors.append("agents/openai.yaml default_prompt must mention the skill")

    references = manifest.get("references", [])
    if not isinstance(references, list):
        errors.append("manifest references must be an array")
        references = []
    ids: set[str] = set()
    manifest_paths: set[str] = set()
    for ref in references:
        if not isinstance(ref, dict) or not isinstance(ref.get("id"), str):
            errors.append("every reference must be an object with an id")
            continue
        ref_id = ref["id"]
        if ref_id in ids:
            errors.append(f"duplicate reference id: {ref_id}")
        ids.add(ref_id)
        rel = ref.get("path")
        if not isinstance(rel, str) or Path(rel).is_absolute() or ".." in Path(rel).parts:
            errors.append(f"{ref_id}: invalid path")
            continue
        manifest_paths.add(rel)
        file = package / rel
        if not file.is_file():
            errors.append(f"{ref_id}: missing reference file: {rel}")
        elif ref.get("checksum") != digest(file):
            errors.append(f"{ref_id}: checksum mismatch")
        if "approved-lock" in ref.get("roles", []):
            approval = ref.get("approval", {})
            if ref.get("approval_state") != "approved" or not approval.get("approver") or not approval.get("date"):
                errors.append(f"{ref_id}: approved lock lacks approval metadata")
            for field in ["applies_to", "does_not_apply_to", "surfaces", "provenance", "limitations"]:
                if field not in ref:
                    errors.append(f"{ref_id}: missing {field}")

    for file in (package / "assets/approved-locks").iterdir():
        if file.is_file() and str(file.relative_to(package)) not in manifest_paths:
            errors.append(f"approved-lock file is absent from manifest: {file.name}")

    rules = schema.get("rules", [])
    rule_ids: set[str] = set()
    for rule in rules if isinstance(rules, list) else []:
        rule_id = rule.get("id") if isinstance(rule, dict) else None
        if not rule_id or rule_id in rule_ids:
            errors.append(f"invalid or duplicate rule id: {rule_id}")
            continue
        rule_ids.add(rule_id)
        missing_evidence = set(rule.get("evidence_reference_ids", [])) - ids
        if missing_evidence:
            errors.append(f"{rule_id}: unknown evidence ids: {sorted(missing_evidence)}")
        if rule.get("variability") == "invariant" and rule.get("status") == "approved" and not rule.get("evidence_reference_ids") and not rule.get("decision_id"):
            errors.append(f"{rule_id}: approved invariant lacks evidence or decision")

    profiles = schema.get("surface_profiles", [])
    if not isinstance(profiles, list) or not profiles:
        errors.append("surface_profiles must be a non-empty array")
    else:
        for profile in profiles:
            fixture = profile.get("confirmation_fixture") if isinstance(profile, dict) else None
            if not isinstance(fixture, str) or not (package / fixture).is_file():
                errors.append(f"surface profile lacks a valid confirmation fixture: {profile}")

    for src in re.findall(r'(?:src|href)=["\']([^"\']+)["\']', board):
        if src.startswith(("http:", "https:", "data:", "#")):
            continue
        if not (package / "assets/reference-board" / src).resolve().exists():
            errors.append(f"reference board has broken local link: {src}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("package", nargs="?", type=Path, default=Path("."))
    args = parser.parse_args()
    package = args.package.expanduser().resolve()
    errors = validate(package)
    if errors:
        for error in errors:
            print(f"error: {error}", file=sys.stderr)
        return 1
    print(f"VDL package valid: {package}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
