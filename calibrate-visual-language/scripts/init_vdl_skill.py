#!/usr/bin/env python3
"""Create a VDL skill from the bundled template without overwriting files."""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path


SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
TEXT_SUFFIXES = {".md", ".json", ".html", ".css", ".yaml", ".py"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--display-name", required=True)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--destination", required=True, type=Path)
    parser.add_argument("--version", default="0.1.0")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not SLUG.fullmatch(args.slug) or len(args.slug) > 63:
        print("error: slug must be lowercase hyphenated text under 64 characters", file=sys.stderr)
        return 2

    template = Path(__file__).resolve().parents[1] / "assets" / "generated-vdl-skill-template"
    target = args.destination.expanduser().resolve() / args.slug
    if target.exists() and any(target.iterdir()):
        print(f"error: refusing to overwrite non-empty destination: {target}", file=sys.stderr)
        return 2
    if not template.is_dir():
        print(f"error: template is missing: {template}", file=sys.stderr)
        return 2

    target.mkdir(parents=True, exist_ok=True)
    shutil.copytree(template, target, dirs_exist_ok=True)
    for rel in ["assets/approved-locks", "assets/anti-references", "assets/calibration-fixtures"]:
        (target / rel).mkdir(parents=True, exist_ok=True)
    shutil.copy2(
        Path(__file__).resolve().parent / "validate_vdl_package.py",
        target / "scripts" / "validate_vdl_package.py",
    )
    replacements = {
        "{{SKILL_SLUG}}": args.slug,
        "{{DISPLAY_NAME}}": args.display_name,
        "{{PACKAGE_VERSION}}": args.version,
    }
    for file in target.rglob("*"):
        if not file.is_file() or file.suffix not in TEXT_SUFFIXES:
            continue
        body = file.read_text(encoding="utf-8")
        for old, new in replacements.items():
            body = body.replace(old, new)
        file.write_text(body, encoding="utf-8")

    files = sorted(str(path.relative_to(target)) for path in target.rglob("*") if path.is_file())
    print(target)
    for file in files:
        print(f"created: {file}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
