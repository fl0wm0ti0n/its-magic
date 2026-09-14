"""US-0134 KernelBridge kit-side contract marker (files-omit + no-Pi-in-bridge).

Markers 1–9 live in `standalone/tests/contract/us0134.contract.test.ts` (`node:test`).
This module covers marker 10. No live provider. No vitest/jest.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

MARKERS = (
    "test_us0134_locate_three_marker_and_kernel_root",
    "test_us0134_kernel_not_found_empty_walk",
    "test_us0134_supported_version_0_1_3_9_in_range",
    "test_us0134_unsupported_version_0_1_2",
    "test_us0134_contract_mismatch_bad_manifest_or_missing_backlog",
    "test_us0134_validator_missing",
    "test_us0134_validator_pass_advances",
    "test_us0134_validator_fail_blocks_with_python_reason",
    "test_us0134_validator_crash_or_timeout",
    "test_us0134_kit_files_omit_standalone_and_no_pi_in_kernel_bridge",
)

PI_IMPORT_RE = re.compile(r"""['"]@(?:earendil-works/pi-[^'"]+|its-magic/pi-kernel)['"]""")
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


def test_us0134_kit_files_omit_standalone_and_no_pi_in_kernel_bridge():
    """Marker 10: kit files omit standalone/; kernel-bridge has no Pi deps/imports; no Biome override."""
    root = _kit_root()
    pkg = _load_json(root / "package.json")
    files = pkg.get("files") or []
    for entry in files:
        text = str(entry).replace("\\", "/").strip("/")
        assert text != "standalone"
        assert not text.startswith("standalone/")
    guard = (root / "scripts" / "guard_installer_publish.py").read_text(encoding="utf-8")
    assert "_reject_standalone_in_kit_publish" in guard

    bridge = root / "standalone" / "packages" / "kernel-bridge"
    assert (bridge / "package.json").is_file()
    bridge_pkg = _load_json(bridge / "package.json")
    assert bridge_pkg.get("name") == "@its-magic/kernel-bridge"
    assert bridge_pkg.get("private") is True
    deps = {**bridge_pkg.get("dependencies", {}), **bridge_pkg.get("devDependencies", {})}
    assert "semver" in deps
    assert deps.get("semver") == "7.8.5"
    assert deps.get("@types/semver") == "7.8.0"
    for key in deps:
        assert not str(key).startswith("@earendil-works/pi-"), key
        assert key != "@its-magic/pi-kernel"

    hits: list[str] = []
    for path in bridge.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIR_NAMES for part in path.parts):
            continue
        if path.suffix not in CODE_SUFFIXES and path.name != "package.json":
            continue
        text = path.read_text(encoding="utf-8")
        if PI_IMPORT_RE.search(text) or "@earendil-works/pi-" in text or "@its-magic/pi-kernel" in text:
            hits.append(path.relative_to(root).as_posix())
    assert hits == [], f"Pi imports inside kernel-bridge: {hits}"
    auth_models = root / "standalone" / "packages" / "auth-models"
    if auth_models.is_dir():
        auth_hits: list[str] = []
        for path in auth_models.rglob("*"):
            if not path.is_file():
                continue
            if any(part in SKIP_DIR_NAMES for part in path.parts):
                continue
            if path.suffix not in CODE_SUFFIXES and path.name != "package.json":
                continue
            text = path.read_text(encoding="utf-8")
            if PI_IMPORT_RE.search(text) or "@earendil-works/pi-" in text or "@its-magic/pi-kernel" in text:
                auth_hits.append(path.relative_to(root).as_posix())
        assert auth_hits == [], f"Pi imports inside auth-models: {auth_hits}"

    role_runtime = root / "standalone" / "packages" / "role-runtime"
    if role_runtime.is_dir():
        rr_hits: list[str] = []
        for path in role_runtime.rglob("*"):
            if not path.is_file():
                continue
            if any(part in SKIP_DIR_NAMES for part in path.parts):
                continue
            if path.suffix not in CODE_SUFFIXES and path.name != "package.json":
                continue
            text = path.read_text(encoding="utf-8")
            if "@earendil-works/pi-" in text:
                rr_hits.append(path.relative_to(root).as_posix())
        assert rr_hits == [], f"Pi imports inside role-runtime: {rr_hits}"

    biome = json.loads((root / "standalone" / "biome.json").read_text(encoding="utf-8"))
    for override in biome.get("overrides") or []:
        includes = override.get("includes") or []
        joined = " ".join(str(x) for x in includes)
        assert "kernel-bridge" not in joined

    contract = (
        root / "standalone" / "tests" / "contract" / "us0134.contract.test.ts"
    ).read_text(encoding="utf-8")
    for marker in MARKERS:
        if marker == "test_us0134_kit_files_omit_standalone_and_no_pi_in_kernel_bridge":
            continue
        assert marker in contract, marker

    kernel_src = "\n".join(
        p.read_text(encoding="utf-8")
        for p in (root / "standalone" / "packages" / "pi-kernel" / "src").glob("*.ts")
    )
    assert "createKernelBridge" not in kernel_src
    cli = (root / "standalone" / "apps" / "cli" / "src" / "index.ts").read_text(encoding="utf-8")
    assert "child_process" not in cli
    assert "@its-magic/kernel-bridge" in cli
    codes = ["KERNEL_NOT_FOUND", "KERNEL_VERSION_UNSUPPORTED", "KERNEL_VALIDATOR_MISSING", "KERNEL_CONTRACT_MISMATCH"]
    types = (bridge / "src" / "types.ts").read_text(encoding="utf-8")
    for code in codes:
        assert code in types
    assert types.count("KERNEL_") >= 4
    assert "KERNEL_TIMEOUT" not in types
    spawn = (bridge / "src" / "spawn.ts").read_text(encoding="utf-8")
    handshake = (bridge / "src" / "handshake.ts").read_text(encoding="utf-8")
    assert "OPENCODE_" not in spawn
    assert "OPENCODE_" not in handshake
    assert "sys.executable" in spawn
    assert "includePrerelease" in handshake
