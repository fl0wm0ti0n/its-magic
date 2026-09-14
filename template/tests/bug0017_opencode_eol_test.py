"""BUG-0017 OpenCode pack CRLF / LF normalization — 6 contract markers.

Markers per architecture.md # BUG-0017 / R-0118 D7.
Static/fixture only — no live OpenCode CI probe.
"""

from __future__ import annotations

import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GITATTRIBUTES = ROOT / ".gitattributes"
GUARD = ROOT / "scripts" / "guard_installer_publish.py"
TEMPLATE_GUARD = ROOT / "template" / "scripts" / "guard_installer_publish.py"

DQ1_ROWS = (
    ".opencode/**/*.md text eol=lf",
    ".opencode/**/*.ts text eol=lf",
    ".opencode/**/*.json text eol=lf",
    "template/.opencode/**/*.md text eol=lf",
    "template/.opencode/**/*.ts text eol=lf",
    "template/.opencode/**/*.json text eol=lf",
)

ACTIVE_INVENTORY_GLOBS = (
    (".opencode/commands", {".md"}),
    (".opencode/agents", {".md"}),
    (".opencode/plugins", {".md", ".ts"}),
)
TEMPLATE_INVENTORY_GLOBS = (
    ("template/.opencode/commands", {".md"}),
    ("template/.opencode/agents", {".md"}),
    ("template/.opencode/plugins", {".md", ".ts"}),
)


def _collect(base_rel: str, suffixes: set[str]) -> list[Path]:
    base = ROOT / Path(base_rel)
    if not base.is_dir():
        return []
    out: list[Path] = []
    for path in base.rglob("*"):
        if "node_modules" in path.parts:
            continue
        if path.is_file() and path.suffix in suffixes:
            out.append(path)
    return out


def _active_inventory() -> list[Path]:
    paths: list[Path] = []
    for rel, suffixes in ACTIVE_INVENTORY_GLOBS:
        paths.extend(_collect(rel, suffixes))
    readme = ROOT / ".opencode" / "README.md"
    if readme.is_file():
        paths.append(readme)
    return paths


def _template_inventory() -> list[Path]:
    paths: list[Path] = []
    for rel, suffixes in TEMPLATE_INVENTORY_GLOBS:
        paths.extend(_collect(rel, suffixes))
    readme = ROOT / "template" / ".opencode" / "README.md"
    if readme.is_file():
        paths.append(readme)
    example = ROOT / "template" / ".opencode" / "model-catalog.local.example.json"
    if example.is_file():
        paths.append(example)
    return paths


def _tracked_in_scope_pairs() -> list[tuple[Path, Path]]:
    """Active ↔ template pairs for in-scope OpenCode text (md/ts; example JSON template-only)."""
    pairs: list[tuple[Path, Path]] = []
    for sub, suffixes in (
        ("commands", {".md"}),
        ("agents", {".md"}),
        ("plugins", {".md", ".ts"}),
    ):
        active_dir = ROOT / ".opencode" / sub
        template_dir = ROOT / "template" / ".opencode" / sub
        if not active_dir.is_dir() or not template_dir.is_dir():
            continue
        for active in active_dir.rglob("*"):
            if not active.is_file() or active.suffix not in suffixes:
                continue
            if "node_modules" in active.parts:
                continue
            rel = active.relative_to(active_dir)
            peer = template_dir / rel
            if peer.is_file():
                pairs.append((active, peer))
    active_readme = ROOT / ".opencode" / "README.md"
    template_readme = ROOT / "template" / ".opencode" / "README.md"
    if active_readme.is_file() and template_readme.is_file():
        pairs.append((active_readme, template_readme))
    return pairs


class Bug0017OpencodeEolTest(unittest.TestCase):
    def test_bug0017_gitattributes_scoped_opencode_eol_lf(self) -> None:
        text = GITATTRIBUTES.read_text(encoding="utf-8")
        for row in DQ1_ROWS:
            self.assertIn(row, text, f"missing DQ1 row: {row}")
        # Reject repo-wide markdown LF force (D3/D8).
        for line in text.splitlines():
            stripped = line.strip()
            if stripped.startswith("#") or not stripped:
                continue
            self.assertFalse(
                stripped.startswith("*.md ") and "eol=lf" in stripped,
                f"repo-wide *.md eol=lf forbidden: {stripped}",
            )

    def test_bug0017_no_cr_in_active_opencode_pack_text(self) -> None:
        inv = _active_inventory()
        self.assertGreater(len(inv), 0, "active OpenCode inventory empty")
        for path in inv:
            data = path.read_bytes()
            self.assertNotIn(
                b"\r",
                data,
                f"CR found in {path.relative_to(ROOT).as_posix()} (BUG-0017)",
            )

    def test_bug0017_no_cr_in_template_opencode_pack_text(self) -> None:
        inv = _template_inventory()
        self.assertGreater(len(inv), 0, "template OpenCode inventory empty")
        example = ROOT / "template" / ".opencode" / "model-catalog.local.example.json"
        self.assertIn(example, inv, "model-catalog example must be in inventory")
        for path in inv:
            data = path.read_bytes()
            self.assertNotIn(
                b"\r",
                data,
                f"CR found in {path.relative_to(ROOT).as_posix()} (BUG-0017)",
            )

    def test_bug0017_guard_installer_publish_rejects_opencode_cr(self) -> None:
        self.assertTrue(GUARD.is_file(), "scripts/guard_installer_publish.py missing")
        target = ROOT / ".opencode" / "commands" / "intake.md"
        self.assertTrue(target.is_file())
        original = target.read_bytes()
        self.assertNotIn(b"\r", original)
        planted = original.replace(b"\n", b"\r\n", 1)
        try:
            target.write_bytes(planted)
            run = subprocess.run(
                [sys.executable, str(GUARD)],
                cwd=ROOT,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                check=False,
            )
            self.assertNotEqual(0, run.returncode, "guard must fail on OpenCode CR")
            err = (run.stderr or "") + (run.stdout or "")
            self.assertIn("BUG-0017", err)
            self.assertIn(".opencode/commands/intake.md", err.replace("\\", "/"))
        finally:
            target.write_bytes(original)

    def test_bug0017_guard_still_enforces_installer_sh_and_manifests(self) -> None:
        """US-0084 / BUG-0008 regression: installer.sh + manifests stay CR-gated."""
        installer = ROOT / "installer.sh"
        self.assertTrue(installer.is_file())
        self.assertNotIn(b"\r", installer.read_bytes())
        for man in (
            ROOT / "docs" / "engineering" / "context" / "installer-owned-paths.manifest",
            ROOT / "template" / "docs" / "engineering" / "context" / "installer-owned-paths.manifest",
        ):
            if man.is_file():
                self.assertNotIn(b"\r", man.read_bytes(), man.as_posix())

        # Plant CR in a temp copy of installer.sh and run guard against a temp tree
        # that still points at real manifests via monkeypatch: simpler — write CR into
        # installer.sh briefly and restore (same pattern as OpenCode plant).
        original = installer.read_bytes()
        try:
            installer.write_bytes(original.replace(b"\n", b"\r\n", 1))
            run = subprocess.run(
                [sys.executable, str(GUARD)],
                cwd=ROOT,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                check=False,
            )
            self.assertNotEqual(0, run.returncode, "guard must still reject installer.sh CR")
            err = (run.stderr or "") + (run.stdout or "")
            self.assertIn("installer.sh", err)
            self.assertIn("US-0084", err)
        finally:
            installer.write_bytes(original)

        # Manifest CR still rejected (BUG-0008).
        manifest = ROOT / "docs" / "engineering" / "context" / "installer-owned-paths.manifest"
        if manifest.is_file():
            man_orig = manifest.read_bytes()
            try:
                manifest.write_bytes(man_orig.replace(b"\n", b"\r\n", 1))
                run = subprocess.run(
                    [sys.executable, str(GUARD)],
                    cwd=ROOT,
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                    check=False,
                )
                self.assertNotEqual(0, run.returncode, "guard must still reject manifest CR")
                err = (run.stderr or "") + (run.stdout or "")
                self.assertIn("BUG-0008", err)
            finally:
                manifest.write_bytes(man_orig)

    def test_bug0017_active_template_opencode_tracked_text_parity(self) -> None:
        self.assertTrue(GUARD.is_file() and TEMPLATE_GUARD.is_file())
        self.assertEqual(
            GUARD.read_bytes(),
            TEMPLATE_GUARD.read_bytes(),
            "active/template guard_installer_publish.py must be byte-identical",
        )
        pairs = _tracked_in_scope_pairs()
        self.assertGreater(len(pairs), 0, "no active↔template OpenCode pairs found")
        for active, template in pairs:
            self.assertEqual(
                active.read_bytes(),
                template.read_bytes(),
                f"parity mismatch: {active.relative_to(ROOT).as_posix()} vs "
                f"{template.relative_to(ROOT).as_posix()}",
            )
            self.assertNotIn(b"\r", active.read_bytes())
            self.assertNotIn(b"\r", template.read_bytes())


if __name__ == "__main__":
    unittest.main()
