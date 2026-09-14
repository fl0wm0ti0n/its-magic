"""US-0133 standalone workspace + Pi AgentKernel — kit-side contract markers.

Kernel/session markers 4, 6, 7, 8, 9 live in `standalone/tests/contract`
(`node:test`). This module covers kit publish / layout / pin / import-boundary /
spike evidence (markers 1, 2, 3, 5, 10). No live provider. No vitest/jest.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

MARKERS = (
    "test_us0133_standalone_workspace_layout",
    "test_us0133_kit_npm_files_omit_standalone",
    "test_us0133_pi_packages_pinned_exact",
    "test_us0133_agentkernel_methods",
    "test_us0133_no_pi_imports_outside_pi_kernel",
    "test_us0133_production_session_custom_tools_only",
    "test_us0133_default_resource_loader_empty",
    "test_us0133_session_id_stable_and_abort",
    "test_us0133_audit_event_order_with_fake_model",
    "test_us0133_phase0_spike_gng_no_branding",
)

PINNED = "0.85.1"
PI_IMPORT_RE = re.compile(r"""['"]@earendil-works/pi-[^'"]+['"]""")
CODE_SUFFIXES = {".ts", ".js", ".mjs", ".cjs", ".tsx", ".mts", ".cts"}
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


def test_us0133_standalone_workspace_layout():
    """Marker 1: in-tree npm workspaces root, cli stub, pi-kernel, tests, scripts."""
    root = _kit_root()
    standalone = root / "standalone"
    pkg = _load_json(standalone / "package.json")
    assert pkg.get("private") is True
    assert pkg.get("name") != "its-magic"
    assert pkg.get("name") == "@its-magic/standalone"
    engines = pkg.get("engines") or {}
    assert str(engines.get("node", "")).startswith(">=")
    assert "22.19.0" in str(engines.get("node"))
    workspaces = pkg.get("workspaces")
    assert workspaces == ["apps/*", "packages/*"] or (
        isinstance(workspaces, dict) and "apps/*" in workspaces.get("packages", [])
    )
    scripts = pkg.get("scripts") or {}
    for key in ("typecheck", "lint", "format", "test"):
        assert key in scripts, key
    kit_pkg = _load_json(root / "package.json")
    assert "workspaces" not in kit_pkg or not any(
        str(w).replace("\\", "/").startswith("standalone")
        for w in (
            kit_pkg.get("workspaces")
            if isinstance(kit_pkg.get("workspaces"), list)
            else (kit_pkg.get("workspaces") or {}).get("packages", [])
        )
    )
    assert (standalone / "apps" / "cli" / "src" / "index.ts").is_file()
    cli_pkg = _load_json(standalone / "apps" / "cli" / "package.json")
    assert "itsm" in (cli_pkg.get("bin") or {})
    assert (standalone / "packages" / "pi-kernel" / "src" / "index.ts").is_file()
    assert (standalone / "tests" / "unit").is_dir()
    assert (standalone / "tests" / "contract").is_dir()
    assert (standalone / "biome.json").is_file()
    assert (standalone / "tsconfig.json").is_file()
    ci = (root / ".github" / "workflows" / "ci.yml").read_text(encoding="utf-8")
    assert "working-directory: standalone" in ci
    assert "windows-latest" in ci
    kernel_src = "\n".join(
        p.read_text(encoding="utf-8")
        for p in (standalone / "packages" / "pi-kernel" / "src").glob("*.ts")
    )
    assert "KernelBridge" not in kernel_src
    assert "ToolBroker" not in kernel_src


def test_us0133_kit_npm_files_omit_standalone():
    """Marker 2: kit files whitelist omits standalone/; guard fail-closed."""
    root = _kit_root()
    pkg = _load_json(root / "package.json")
    files = pkg.get("files") or []
    for entry in files:
        text = str(entry).replace("\\", "/").strip("/")
        assert text != "standalone"
        assert not text.startswith("standalone/")
    guard = (root / "scripts" / "guard_installer_publish.py").read_text(encoding="utf-8")
    assert "_reject_standalone_in_kit_publish" in guard
    assert "standalone" in guard
    template_guard = root / "template" / "scripts" / "guard_installer_publish.py"
    assert template_guard.is_file()
    assert template_guard.read_bytes() == (root / "scripts" / "guard_installer_publish.py").read_bytes()


def test_us0133_pi_packages_pinned_exact():
    """Marker 3: exact 0.85.1 pins inside pi-kernel only."""
    root = _kit_root()
    kernel_pkg = _load_json(root / "standalone" / "packages" / "pi-kernel" / "package.json")
    deps = {**kernel_pkg.get("dependencies", {}), **kernel_pkg.get("devDependencies", {})}
    assert deps.get("@earendil-works/pi-coding-agent") == PINNED
    assert deps.get("@earendil-works/pi-ai") == PINNED
    root_pkg = _load_json(root / "standalone" / "package.json")
    root_deps = {**root_pkg.get("dependencies", {}), **root_pkg.get("devDependencies", {})}
    assert "@earendil-works/pi-coding-agent" not in root_deps
    assert "@earendil-works/pi-ai" not in root_deps
    lock = root / "standalone" / "package-lock.json"
    assert lock.is_file(), "standalone/package-lock.json must record the pin"
    lock_text = lock.read_text(encoding="utf-8")
    assert '"@earendil-works/pi-coding-agent"' in lock_text
    assert '"@earendil-works/pi-ai"' in lock_text
    assert PINNED in lock_text


def test_us0133_no_pi_imports_outside_pi_kernel():
    """Marker 5: no Pi module imports outside standalone/packages/pi-kernel/**."""
    root = _kit_root()
    standalone = root / "standalone"
    allowed = (standalone / "packages" / "pi-kernel").resolve()
    hits: list[str] = []
    for path in standalone.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIR_NAMES for part in path.parts):
            continue
        try:
            resolved = path.resolve()
        except OSError:
            continue
        if allowed in resolved.parents or resolved.parent == allowed:
            continue
        if path.suffix not in CODE_SUFFIXES:
            continue
        text = path.read_text(encoding="utf-8")
        if PI_IMPORT_RE.search(text):
            hits.append(path.relative_to(root).as_posix())
    assert hits == [], f"Pi imports outside pi-kernel: {hits}"
    bridge = standalone / "packages" / "kernel-bridge"
    if bridge.is_dir():
        bridge_hits: list[str] = []
        for path in bridge.rglob("*"):
            if not path.is_file() or path.suffix not in CODE_SUFFIXES:
                continue
            if any(part in SKIP_DIR_NAMES for part in path.parts):
                continue
            text = path.read_text(encoding="utf-8")
            if PI_IMPORT_RE.search(text) or "@its-magic/pi-kernel" in text:
                bridge_hits.append(path.relative_to(root).as_posix())
        assert bridge_hits == [], f"Pi imports inside kernel-bridge: {bridge_hits}"
    biome = (standalone / "biome.json").read_text(encoding="utf-8")
    assert "noRestrictedImports" in biome
    assert "@earendil-works/pi-coding-agent" in biome
    assert "kernel-bridge" not in biome or '"packages/kernel-bridge/**"' not in biome
    auth_models = standalone / "packages" / "auth-models"
    if auth_models.is_dir():
        auth_hits: list[str] = []
        for path in auth_models.rglob("*"):
            if not path.is_file() or path.suffix not in CODE_SUFFIXES:
                continue
            if any(part in SKIP_DIR_NAMES for part in path.parts):
                continue
            text = path.read_text(encoding="utf-8")
            if PI_IMPORT_RE.search(text) or "@its-magic/pi-kernel" in text:
                auth_hits.append(path.relative_to(root).as_posix())
        assert auth_hits == [], f"Pi imports inside auth-models: {auth_hits}"
        assert '"packages/auth-models/**"' not in biome
    role_runtime = standalone / "packages" / "role-runtime"
    if role_runtime.is_dir():
        rr_hits: list[str] = []
        for path in role_runtime.rglob("*"):
            if not path.is_file() or path.suffix not in CODE_SUFFIXES:
                continue
            if any(part in SKIP_DIR_NAMES for part in path.parts):
                continue
            text = path.read_text(encoding="utf-8")
            if PI_IMPORT_RE.search(text) or "@earendil-works/pi-" in text:
                rr_hits.append(path.relative_to(root).as_posix())
        assert rr_hits == [], f"Pi imports inside role-runtime: {rr_hits}"
        assert '"packages/role-runtime/**"' not in biome
    config_pkg = standalone / "packages" / "config"
    if config_pkg.is_dir():
        cfg_hits: list[str] = []
        for path in config_pkg.rglob("*"):
            if not path.is_file() or path.suffix not in CODE_SUFFIXES:
                continue
            if any(part in SKIP_DIR_NAMES for part in path.parts):
                continue
            text = path.read_text(encoding="utf-8")
            if PI_IMPORT_RE.search(text) or "@earendil-works/pi-" in text:
                cfg_hits.append(path.relative_to(root).as_posix())
        assert cfg_hits == [], f"Pi imports inside packages/config: {cfg_hits}"
        assert '"packages/config/**"' not in biome
        pkg = _load_json(config_pkg / "package.json")
        deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
        for key in deps:
            assert not str(key).startswith("@earendil-works/pi-"), key


def test_us0133_phase0_spike_gng_no_branding():
    """Marker 10: spike evidence for items 1/2/3/5; no branding lock; no OS-sandbox claim."""
    root = _kit_root()
    spike = root / "standalone" / "docs" / "phase0-kernel-spike.md"
    text = spike.read_text(encoding="utf-8")
    assert PINNED in text
    assert "@earendil-works/pi-coding-agent" in text
    assert "@earendil-works/pi-ai" in text
    assert "GO" in text
    for item in ("1", "2", "3", "5"):
        assert item in text
    assert "pi.dev/security" in text
    lowered = text.lower()
    assert "no built-in sandbox" in lowered or "no os-sandbox claim" in lowered
    assert "no branding lock" in lowered or "unpublished" in lowered
    assert '"name": "its-magic"' not in (root / "standalone" / "package.json").read_text(encoding="utf-8")
    contract = (root / "standalone" / "tests" / "contract" / "us0133.contract.test.ts").read_text(
        encoding="utf-8"
    )
    for marker in MARKERS:
        if marker in {
            "test_us0133_standalone_workspace_layout",
            "test_us0133_kit_npm_files_omit_standalone",
            "test_us0133_pi_packages_pinned_exact",
            "test_us0133_no_pi_imports_outside_pi_kernel",
            "test_us0133_phase0_spike_gng_no_branding",
        }:
            continue
        assert marker in contract, marker
