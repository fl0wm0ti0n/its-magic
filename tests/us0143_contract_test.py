"""US-0143 kit-side contract markers (files-omit + no-Pi-in-runtime-core).

Markers 1–12 live primarily in `standalone/tests/contract/us0143.contract.test.ts`
(`node:test`). This module covers kit files omit + no Pi in packages/runtime-core
+ deferred lift + AC-6 YAML consume. Fake-model only. No vitest/jest.
Not folded into kit TEST_COMMAND as standalone npm test.
"""

from __future__ import annotations

import json
from pathlib import Path

MARKERS = (
    "test_us0143_auto_route_implemented",
    "test_us0143_quick_route_implemented",
    "test_us0143_standard_lifecycle_auto",
    "test_us0143_compressed_ultra_lean_mega_quick",
    "test_us0143_axis_independence",
    "test_us0143_l8_precedence_start_from",
    "test_us0143_work_kind_conflict",
    "test_us0143_preset_expand_stop_matrix",
    "test_us0143_drain_caps_operator_authority",
    "test_us0143_nonrelaxable_terminals",
    "test_us0143_audit_ledger_mid_resume",
    "test_us0143_autonomy_disabled",
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

AC6 = (
    "DECISION_UNRESOLVED",
    "KERNEL_INCOMPATIBLE",
    "QUALITY_EVIDENCE_FAILED",
    "BUDGET_EXHAUSTED",
    "RESUME_AMBIGUOUS",
)


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


def _runtime_core_src(root: Path) -> str:
    pkg = root / "standalone" / "packages" / "runtime-core"
    chunks: list[str] = []
    for path in pkg.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIR_NAMES for part in path.parts):
            continue
        if path.suffix not in CODE_SUFFIXES and path.name != "package.json":
            continue
        chunks.append(path.read_text(encoding="utf-8"))
    return "\n".join(chunks)


def _assert_no_pi(root: Path) -> None:
    pkg_dir = root / "standalone" / "packages" / "runtime-core"
    assert (pkg_dir / "package.json").is_file()
    pkg = _load_json(pkg_dir / "package.json")
    assert pkg.get("name") == "@its-magic/runtime-core"
    assert pkg.get("private") is True
    assert pkg.get("version") == "0.0.0"
    assert pkg.get("type") == "module"
    assert str((pkg.get("engines") or {}).get("node", "")).startswith(">=22.19.0")
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    for key in deps:
        assert not str(key).startswith("@earendil-works/pi-"), key
        assert key != "@its-magic/pi-kernel"
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
        if "@its-magic/pi-kernel" in text:
            hits.append(f"pi-kernel:{path.relative_to(root).as_posix()}")
    assert hits == [], f"forbidden imports inside runtime-core: {hits}"


def _contract(root: Path) -> str:
    return (
        root / "standalone" / "tests" / "contract" / "us0143.contract.test.ts"
    ).read_text(encoding="utf-8")


def test_us0143_auto_route_implemented():
    root = _kit_root()
    _assert_no_pi(root)
    pkg = _load_json(root / "package.json")
    files = pkg.get("files") or []
    for entry in files:
        text = str(entry).replace("\\", "/").strip("/")
        assert text != "standalone"
        assert not text.startswith("standalone/")
    workspaces = pkg.get("workspaces") or []
    for entry in workspaces:
        assert "standalone" not in str(entry).replace("\\", "/")
    assert not (root / "standalone" / "packages" / "auto-scheduler").exists()
    assert not (root / ".opencode" / "commands" / "auto.md").exists()
    src = _runtime_core_src(root)
    assert 'SCHEDULER_COMMANDS = ["/auto", "/quick"]' in src
    assert "DEFERRED_COMMANDS = [] as const" in src
    assert "RouteScheduled" in src
    assert "WORKFLOW_ROUTE_DEFERRED" in src
    assert "runAuto" in src
    contract = _contract(root)
    assert "test_us0143_auto_route_implemented" in contract


def test_us0143_quick_route_implemented():
    root = _kit_root()
    src = _runtime_core_src(root)
    assert 'MEGA_QUICK_PLAN' in src
    assert '"/quick"' in src
    assert "test_us0143_quick_route_implemented" in _contract(root)


def test_us0143_standard_lifecycle_auto():
    root = _kit_root()
    src = _runtime_core_src(root)
    assert "CANONICAL_PHASES" in src
    assert "runAuto" in src
    assert "evaluateRelease" in src
    gates = (
        root / "standalone" / "packages" / "runtime-core" / "src" / "workflow" / "gates" / "gate-engine.ts"
    ).read_text(encoding="utf-8")
    assert 'check_in_tests' in gates
    assert "test_us0143_standard_lifecycle_auto" in _contract(root)


def test_us0143_compressed_ultra_lean_mega_quick():
    root = _kit_root()
    src = _runtime_core_src(root)
    assert "ultra_lean_skip_plan_verify" in src
    assert '"execute"' in src and '"qa"' in src and '"verify-work"' in src
    assert "test_us0143_compressed_ultra_lean_mega_quick" in _contract(root)


def test_us0143_axis_independence():
    root = _kit_root()
    src = _runtime_core_src(root)
    for name in (
        "lookupDeliveryMode",
        "lookupTokenProfile",
        "lookupVoice",
        "lookupAutonomyPreset",
        "lookupWorkKindRouting",
    ):
        assert name in src, name
    assert "IndependentAxes" in src
    assert "test_us0143_axis_independence" in _contract(root)


def test_us0143_l8_precedence_start_from():
    root = _kit_root()
    src = _runtime_core_src(root)
    assert "resolveDeliveryRoute" in src
    assert "WORK_KIND_ROUTING_OFF" in src
    assert "startFrom" in src
    py = (root / "scripts" / "work_kind_routing_lib.py").read_text(encoding="utf-8")
    assert "start-from" in py
    assert "test_us0143_l8_precedence_start_from" in _contract(root)


def test_us0143_work_kind_conflict():
    root = _kit_root()
    src = _runtime_core_src(root)
    assert "WORK_KIND_DELIVERY_MODE_CONFLICT" in src
    bridge = (
        root / "standalone" / "packages" / "kernel-bridge" / "src" / "types.ts"
    ).read_text(encoding="utf-8")
    assert "work_kind_classify" not in bridge
    assert "test_us0143_work_kind_conflict" in _contract(root)


def test_us0143_preset_expand_stop_matrix():
    root = _kit_root()
    src = _runtime_core_src(root)
    assert "expandAutonomyPreset" in src or "expandPresetBeforeRun" in src
    yaml_text = (root / "scripts" / "data" / "autonomy_stop_matrix.yaml").read_text(
        encoding="utf-8"
    )
    assert "security_hard" in yaml_text
    for code in AC6:
        assert f"code: {code}" in yaml_text, code
    assert "test_us0143_preset_expand_stop_matrix" in _contract(root)


def test_us0143_drain_caps_operator_authority():
    root = _kit_root()
    src = _runtime_core_src(root)
    for flag in (
        "AUTO_LOOP_MAX_CYCLES",
        "AUTO_BACKLOG_MAX_STORIES",
        "AUTO_EXECUTE_MAX_ITEMS",
        "AUTO_PAUSE_REQUEST",
        "AUTO_BUG_QUEUE",
        "AUTO_QUIET",
    ):
        assert flag in src, flag
    assert "runQuick" in src
    assert "test_us0143_drain_caps_operator_authority" in _contract(root)


def test_us0143_nonrelaxable_terminals():
    root = _kit_root()
    src = _runtime_core_src(root)
    for code in AC6:
        assert code in src, code
    assert "AC6_NONRELAXABLE_TERMINALS" in src
    assert "isNonRelaxableStop" in src
    assert "test_us0143_nonrelaxable_terminals" in _contract(root)


def test_us0143_audit_ledger_mid_resume():
    root = _kit_root()
    src = _runtime_core_src(root)
    assert "appendRepairLedger" in src
    assert "autonomy_repair_ledger" in src
    assert "discardOrphans" in src or "crashResume" in src
    assert "RECOVERY_FALSE_COMPLETION" in src
    assert "test_us0143_audit_ledger_mid_resume" in _contract(root)


def test_us0143_autonomy_disabled():
    root = _kit_root()
    src = _runtime_core_src(root)
    assert 'AUTONOMY_PRESET' in src
    contract = _contract(root)
    for marker in MARKERS:
        assert marker in contract, marker
    assert len(MARKERS) == 12
    kernel = (
        root / "standalone" / "packages" / "pi-kernel" / "src" / "kernel.ts"
    ).read_text(encoding="utf-8")
    isolation = (
        root / "standalone" / "packages" / "pi-kernel" / "src" / "isolation.ts"
    ).read_text(encoding="utf-8")
    assert "noTools: spec.noTools" in kernel
    assert "extensions: []" in isolation
