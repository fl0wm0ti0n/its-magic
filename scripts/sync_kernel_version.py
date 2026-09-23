#!/usr/bin/env python3
"""Keep kernel metadata aligned with the package version."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


VERSION_FILES = (
    "its_magic/.its-magic-version",
    "template/its_magic/.its-magic-version",
)
CONTRACT_FILES = (
    "its_magic/kernel-contract.json",
    "template/its_magic/kernel-contract.json",
)


def metadata_files(repo: Path, files: tuple[str, str]) -> tuple[str, ...]:
    # Installed consumer projects do not include the source template mirror.
    return files if (repo / "template").is_dir() else files[:1]


def package_version(repo: Path) -> str:
    try:
        value = json.loads((repo / "package.json").read_text(encoding="utf-8"))["version"]
    except (KeyError, OSError, json.JSONDecodeError) as exc:
        raise SystemExit(f"PACKAGE_VERSION_UNAVAILABLE: {exc}") from exc
    if not isinstance(value, str) or not value:
        raise SystemExit("PACKAGE_VERSION_UNAVAILABLE")
    return value


def mismatches(repo: Path, version: str) -> list[str]:
    problems: list[str] = []
    for rel in metadata_files(repo, VERSION_FILES):
        try:
            actual = (repo / rel).read_text(encoding="utf-8").strip()
        except OSError:
            actual = None
        if actual != version:
            problems.append(f"KERNEL_VERSION_MISMATCH: {rel}")
    for rel in metadata_files(repo, CONTRACT_FILES):
        try:
            actual = json.loads((repo / rel).read_text(encoding="utf-8")).get("kernel_version")
        except (OSError, json.JSONDecodeError):
            actual = None
        if actual != version:
            problems.append(f"KERNEL_VERSION_MISMATCH: {rel}")
    return problems


def synchronize(repo: Path, version: str) -> None:
    for rel in metadata_files(repo, VERSION_FILES):
        (repo / rel).write_text(f"{version}\n", encoding="utf-8")
    for rel in metadata_files(repo, CONTRACT_FILES):
        path = repo / rel
        contract = json.loads(path.read_text(encoding="utf-8"))
        contract["kernel_version"] = version
        path.write_text(json.dumps(contract, indent="\t") + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", default=".", help="repository root (default: current directory)")
    parser.add_argument("--version", help="version to write (default: package.json version)")
    parser.add_argument("--check", action="store_true", help="fail instead of writing mismatches")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    version = args.version or package_version(repo)
    problems = mismatches(repo, version)
    if args.check:
        if problems:
            print("\n".join(problems))
            return 1
        return 0
    synchronize(repo, version)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
