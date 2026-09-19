#!/usr/bin/env python3
"""Synchronize the publishable standalone runtime mirror with its source workspace."""

from __future__ import annotations

import argparse
import filecmp
import shutil
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "standalone"
TARGET = ROOT / "template" / ".its-magic" / "standalone"
RUNTIME_DIRS = ("apps", "packages")
RUNTIME_FILES = ("package.json", "package-lock.json", "tsconfig.json", "biome.json")
IGNORED_NAMES = {"node_modules", "__pycache__", ".pytest_cache", ".git", ".runtime-isolation"}


def _runtime_files(root: Path) -> dict[str, Path]:
    inventory: dict[str, Path] = {}
    for name in RUNTIME_FILES:
        path = root / name
        if path.is_file():
            inventory[name] = path
    for dirname in RUNTIME_DIRS:
        base = root / dirname
        if not base.is_dir():
            continue
        for path in base.rglob("*"):
            if not path.is_file() or any(part in IGNORED_NAMES for part in path.parts):
                continue
            inventory[path.relative_to(root).as_posix()] = path
    return inventory


def check() -> int:
    source = _runtime_files(SOURCE)
    target = _runtime_files(TARGET)
    missing = sorted(source.keys() - target.keys())
    extra = sorted(target.keys() - source.keys())
    changed = sorted(
        rel for rel in source.keys() & target.keys() if not filecmp.cmp(source[rel], target[rel], shallow=False)
    )
    if not missing and not extra and not changed:
        print(f"standalone template mirror OK ({len(source)} files)")
        return 0
    for label, paths in (("missing", missing), ("extra", extra), ("changed", changed)):
        if paths:
            print(f"standalone template mirror {label}: {', '.join(paths)}", file=sys.stderr)
    print("run: python scripts/sync_standalone_template.py", file=sys.stderr)
    return 1


def sync() -> int:
    if not SOURCE.is_dir() or not (SOURCE / "package.json").is_file():
        print(f"standalone source workspace missing: {SOURCE}", file=sys.stderr)
        return 1
    TARGET.mkdir(parents=True, exist_ok=True)
    for dirname in RUNTIME_DIRS:
        source_dir = SOURCE / dirname
        target_dir = TARGET / dirname
        if target_dir.exists():
            shutil.rmtree(target_dir)
        shutil.copytree(
            source_dir,
            target_dir,
            ignore=lambda _path, names: {name for name in names if name in IGNORED_NAMES},
        )
    for name in RUNTIME_FILES:
        shutil.copy2(SOURCE / name, TARGET / name)
    return check()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail when the mirror differs")
    args = parser.parse_args()
    return check() if args.check else sync()


if __name__ == "__main__":
    raise SystemExit(main())
