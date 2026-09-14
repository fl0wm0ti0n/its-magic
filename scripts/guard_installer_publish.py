#!/usr/bin/env python3
"""Prepublish / CI guard: installer.sh LF + POSIX-safe startup tokens (US-0084 / AC-2).

BUG-0008: reject CR bytes in installer-owned-paths.manifest (CRLF breaks POSIX awk section match).
BUG-0017: reject CR bytes in OpenCode pack inventory (CRLF breaks Linux OpenCode YAML frontmatter).
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INSTALLER_SH = ROOT / "installer.sh"
INSTALLER_MANIFESTS = (
    ROOT / "docs" / "engineering" / "context" / "installer-owned-paths.manifest",
    ROOT / "template" / "docs" / "engineering" / "context" / "installer-owned-paths.manifest",
)

FORBIDDEN_TOKENS = (
    "set -euo",
    "set -o pipefail",
    "set -eu -o pipefail",
    "set -o errexit",
    "set -o nounset",
)


def _iter_opencode_inventory(root: Path) -> list[Path]:
    """OpenCode pack paths that must stay LF (BUG-0017 / R-0118 DQ2+DQ5).

    Skips missing trees and node_modules. Does not scan operator-local
    model-catalog.local.json (gitignored).
    """
    paths: list[Path] = []
    seen: set[Path] = set()

    def add(path: Path) -> None:
        resolved = path.resolve()
        if resolved in seen:
            return
        if not path.is_file():
            return
        if "node_modules" in path.parts:
            return
        seen.add(resolved)
        paths.append(path)

    for base_rel in (".opencode", "template/.opencode"):
        base = root / Path(base_rel)
        if not base.is_dir():
            continue
        for sub, suffixes in (
            ("commands", {".md"}),
            ("agents", {".md"}),
            ("plugins", {".md", ".ts"}),
        ):
            folder = base / sub
            if not folder.is_dir():
                continue
            for path in folder.rglob("*"):
                if path.is_file() and path.suffix in suffixes:
                    add(path)
        add(base / "README.md")

    add(root / "template" / ".opencode" / "model-catalog.local.example.json")
    return paths


def _reject_cr(path: Path, *, bug_label: str) -> int:
    data = path.read_bytes()
    if b"\r" not in data:
        return 0
    rel = path.relative_to(ROOT).as_posix()
    print(
        f"guard_installer_publish: CR/LF (\\r) bytes found in {rel} — "
        f"use LF only ({bug_label}).",
        file=sys.stderr,
    )
    return 1


def main() -> int:
    if not INSTALLER_SH.is_file():
        print("guard_installer_publish: installer.sh missing", file=sys.stderr)
        return 1
    data = INSTALLER_SH.read_bytes()
    if b"\r" in data:
        print(
            "guard_installer_publish: CR/LF (\\r) bytes found in installer.sh — "
            "use LF only; see docs/engineering/runbook.md (US-0084).",
            file=sys.stderr,
        )
        return 1
    for man in INSTALLER_MANIFESTS:
        if not man.is_file():
            continue
        if _reject_cr(man, bug_label=".gitattributes *.manifest; BUG-0008"):
            return 1
    for path in _iter_opencode_inventory(ROOT):
        if _reject_cr(path, bug_label="BUG-0017 OpenCode pack; .gitattributes .opencode/**"):
            return 1
    text = data.decode("utf-8", errors="replace")
    for token in FORBIDDEN_TOKENS:
        if token in text:
            print(
                f"guard_installer_publish: forbidden startup token {token!r} in installer.sh",
                file=sys.stderr,
            )
            return 1
    dash = shutil.which("dash")
    if dash:
        r = subprocess.run(
            [dash, "-n", str(INSTALLER_SH)],
            cwd=ROOT,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        if r.returncode != 0:
            print(
                "guard_installer_publish: dash -n installer.sh failed:\n"
                + (r.stderr or r.stdout or ""),
                file=sys.stderr,
            )
            return 1
    else:
        print(
            "guard_installer_publish: dash not on PATH; skipping dash -n "
            "(Python CRLF + token checks still enforced).",
            file=sys.stderr,
        )
    standalone = _reject_standalone_in_kit_publish()
    if standalone != 0:
        return standalone
    return 0


def _path_mentions_standalone(entry: object) -> bool:
    text = str(entry).replace("\\", "/").strip()
    if text in {"standalone", "standalone/", "./standalone", "./standalone/"}:
        return True
    parts = [p for p in text.split("/") if p and p != "."]
    return bool(parts) and parts[0] == "standalone"


def _reject_standalone_in_kit_publish() -> int:
    """US-0133 / DEC-0133: kit npm `its-magic` must omit standalone/ (fail-closed)."""
    pkg_path = ROOT / "package.json"
    if not pkg_path.is_file():
        return 0
    try:
        pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"guard_installer_publish: package.json is not valid JSON: {exc}", file=sys.stderr)
        return 1
    if pkg.get("name") != "its-magic":
        return 0
    files = pkg.get("files", [])
    if not isinstance(files, list):
        print("guard_installer_publish: package.json files must be an array", file=sys.stderr)
        return 1
    for entry in files:
        if _path_mentions_standalone(entry):
            print(
                "guard_installer_publish: kit package.json files must omit standalone/ (US-0133).",
                file=sys.stderr,
            )
            return 1
    workspaces = pkg.get("workspaces", [])
    workspace_entries: list[object] = []
    if isinstance(workspaces, list):
        workspace_entries = workspaces
    elif isinstance(workspaces, dict):
        workspace_entries = list(workspaces.get("packages", []))
    for entry in workspace_entries:
        if _path_mentions_standalone(entry):
            print(
                "guard_installer_publish: kit package.json workspaces must not include standalone/ (US-0133).",
                file=sys.stderr,
            )
            return 1
    npm = shutil.which("npm")
    if not npm:
        print(
            "guard_installer_publish: npm not on PATH; skipping tarball inventory "
            "(package.json files omit-check still enforced).",
            file=sys.stderr,
        )
        return 0
    packed = subprocess.run(
        [npm, "pack", "--dry-run", "--json"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if packed.returncode != 0:
        print(
            "guard_installer_publish: npm pack --dry-run failed; cannot verify "
            "standalone/ omitted from tarball.\n"
            + (packed.stderr or packed.stdout or ""),
            file=sys.stderr,
        )
        return 1
    try:
        payload = json.loads(packed.stdout or "[]")
    except json.JSONDecodeError as exc:
        print(
            f"guard_installer_publish: npm pack --json was not valid JSON: {exc}",
            file=sys.stderr,
        )
        return 1
    items = payload if isinstance(payload, list) else [payload]
    for item in items:
        if not isinstance(item, dict):
            continue
        for file_row in item.get("files", []):
            path = file_row.get("path") if isinstance(file_row, dict) else file_row
            if _path_mentions_standalone(path):
                print(
                    "guard_installer_publish: published tarball inventory includes "
                    f"{path} — kit files must omit standalone/ (US-0133).",
                    file=sys.stderr,
                )
                return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
