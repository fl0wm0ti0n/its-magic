#!/usr/bin/env python3
"""Read-only status-surface checker (US-0134 / DEC-0134 §8).

Never writes backlog, acceptance, state, or resume_brief.
Does not perform curator /status-reconcile.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

HEADING_RE = re.compile(r"^#{1,6} ", re.MULTILINE)

SURFACES = (
    "docs/product/backlog.md",
    "docs/product/acceptance.md",
    "docs/engineering/state.md",
    "handoffs/resume_brief.md",
)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument("--kernel-root", default=os.getcwd())
    args, _extra = parser.parse_known_args(argv)
    root = Path(args.kernel_root).resolve()
    for rel in SURFACES:
        path = root / rel
        if not path.is_file():
            print("STATUS_RECONCILE_SURFACE_MISSING", file=sys.stderr)
            return 1
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            print("STATUS_RECONCILE_PARSE_FAILED", file=sys.stderr)
            return 1
        if HEADING_RE.search(text) is None:
            print("STATUS_RECONCILE_PARSE_FAILED", file=sys.stderr)
            return 1
    print("[STATUS_RECONCILE_VALIDATE_OK]")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
