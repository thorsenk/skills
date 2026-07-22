#!/usr/bin/env python3
"""Run the package validator copied from calibrate-visual-language."""

from __future__ import annotations

import runpy
import sys
from pathlib import Path


def main() -> int:
    package = Path(__file__).resolve().parents[1]
    candidate = package.parent / "calibrate-visual-language" / "scripts" / "validate_vdl_package.py"
    if not candidate.is_file():
        print("error: validation helper is unavailable; copy the validator into this file before release", file=sys.stderr)
        return 1
    sys.argv = [str(candidate), str(package)]
    runpy.run_path(str(candidate), run_name="__main__")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
