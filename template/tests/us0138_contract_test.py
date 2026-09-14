"""US-0138 kit-side contract marker (files-omit + no-Pi-in-config + DEC-0039).

Markers 1–12 live primarily in `standalone/tests/contract/us0138.contract.test.ts`
(`node:test`). This module covers kit-side files omit + no Pi in packages/config
+ local-file gitignore (DEC-0039). No live provider. No vitest/jest. Not folded
into kit TEST_COMMAND as standalone npm test.
"""

from __future__ import annotations

import json
from pathlib import Path

MARKERS = (
    "test_us0138_cli_one_run_wins",
    "test_us0138_local_wins_over_shared",
    "test_us0138_shared_wins_over_legacy",
    "test_us0138_legacy_wins_over_defaults",
    "test_us0138_absent_legacy_ok",
    "test_us0138_malformed_fail_closed",
    "test_us0138_local_file_preservation",
    "test_us0138_existing_repo_identity",
    "test_us0138_secret_rejected_from_shared",
    "test_us0138_security_hard_not_weakened_by_autonomy",
    "test_us0138_invalid_version_enum_conflict",
    "test_us0138_provenance_and_orthogonal_axes",
)

CODE_SUFFIXES = {".ts", ".js", ".mjs", ".cjs", ".tsx", ".mts", ".cts", ".json"}
SKIP_DIR_NAMES = {
    "node_modules",
    ".git",
    "__pycache__",
    ".pytest_cache",
    "dist",
    ".runtime-isolation",
}


def _kit_root() -> Path:
    here = Path(__file__).resolve()
    for parent in [here.parent, *here.parents]:
        pkg = parent / "package.json"
        standalone = parent / "standalone"
        if pkg.is_file() and standalone.is_dir():
            return parent
    raise AssertionError("kit root with standalone/ not found")


def _load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _assert_no_pi(root: Path, pkg_name: str) -> None:
    pkg_dir = root / "standalone" / "packages" / pkg_name
    assert (pkg_dir / "package.json").is_file()
    pkg = _load_json(pkg_dir / "package.json")
    assert pkg.get("name") == f"@its-magic/{pkg_name}"
    assert pkg.get("private") is True
    assert pkg.get("version") == "0.0.0"
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    for key in deps:
        assert not str(key).startswith("@earendil-works/pi-"), key
    hits: list[str] = []
    for path in pkg_dir.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIR_NAMES for part in path.parts):
            continue
        if path.suffix not in CODE_SUFFIXES and path.name != "package.json":
            continue
        text = path.read_text(encoding="utf-8")
        if "@earendil-works/pi-" in text:
            hits.append(path.relative_to(root).as_posix())
    assert hits == [], f"Pi imports inside {pkg_name}: {hits}"


def test_us0138_cli_one_run_wins():
    """Kit twin: files omit standalone/; packages/config has no Pi; DEC-0039 local gitignore."""
    root = _kit_root()
    pkg = _load_json(root / "package.json")
    files = pkg.get("files") or []
    for entry in files:
        text = str(entry).replace("\\", "/").strip("/")
        assert text != "standalone"
        assert not text.startswith("standalone/")

    workspaces = pkg.get("workspaces") or []
    for entry in workspaces:
        text = str(entry).replace("\\", "/")
        assert "standalone" not in text

    _assert_no_pi(root, "config")

    biome = json.loads((root / "standalone" / "biome.json").read_text(encoding="utf-8"))
    for override in biome.get("overrides") or []:
        includes = override.get("includes") or []
        joined = " ".join(str(x) for x in includes)
        assert "packages/config" not in joined

    gitignore = (root / ".gitignore").read_text(encoding="utf-8")
    assert ".its-magic/config.local.json" in gitignore

    contract = (
        root / "standalone" / "tests" / "contract" / "us0138.contract.test.ts"
    ).read_text(encoding="utf-8")
    for marker in MARKERS:
        assert marker in contract, marker

    kernel_src = (root / "standalone" / "packages" / "pi-kernel" / "src" / "kernel.ts").read_text(
        encoding="utf-8"
    )
    assert "noTools: spec.noTools" in kernel_src
    isolation = (root / "standalone" / "packages" / "pi-kernel" / "src" / "isolation.ts").read_text(
        encoding="utf-8"
    )
    assert "extensions: []" in isolation
