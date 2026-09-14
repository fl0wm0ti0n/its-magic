"""US-0136 kit-side contract marker (files-omit + no-Pi-in-role-runtime).

Markers 1–10 live primarily in `standalone/tests/contract/us0136.contract.test.ts`
(`node:test`). This module covers kit-side files omit + no Pi in role-runtime.
No live provider. No vitest/jest. Not folded into kit TEST_COMMAND as standalone npm test.
"""

from __future__ import annotations

import json
from pathlib import Path

MARKERS = (
    "test_us0136_po_dev_distinct_session_ids",
    "test_us0136_execute_qa_cycle_new_ids",
    "test_us0136_critic_distinct_session",
    "test_us0136_crash_orphan_discard",
    "test_us0136_session_dispose",
    "test_us0136_reused_id_fail_closed",
    "test_us0136_role_mismatch_fail_closed",
    "test_us0136_transcript_carryover_fail_closed",
    "test_us0136_missing_stale_hash_attestation",
    "test_us0136_orchestrator_mutation_deny_and_no_pi_imports",
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


def test_us0136_orchestrator_mutation_deny_and_no_pi_imports():
    """Marker 10 (kit): files omit standalone/; role-runtime has no Pi deps/imports; no Biome override."""
    root = _kit_root()
    pkg = _load_json(root / "package.json")
    files = pkg.get("files") or []
    for entry in files:
        text = str(entry).replace("\\", "/").strip("/")
        assert text != "standalone"
        assert not text.startswith("standalone/")

    role_runtime = root / "standalone" / "packages" / "role-runtime"
    assert (role_runtime / "package.json").is_file()
    rr_pkg = _load_json(role_runtime / "package.json")
    assert rr_pkg.get("name") == "@its-magic/role-runtime"
    assert rr_pkg.get("private") is True
    assert rr_pkg.get("version") == "0.0.0"
    deps = {**rr_pkg.get("dependencies", {}), **rr_pkg.get("devDependencies", {})}
    for key in deps:
        assert not str(key).startswith("@earendil-works/pi-"), key

    hits: list[str] = []
    for path in role_runtime.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIR_NAMES for part in path.parts):
            continue
        if path.suffix not in CODE_SUFFIXES and path.name != "package.json":
            continue
        text = path.read_text(encoding="utf-8")
        if "@earendil-works/pi-" in text:
            hits.append(path.relative_to(root).as_posix())
    assert hits == [], f"Pi imports inside role-runtime: {hits}"

    biome = json.loads((root / "standalone" / "biome.json").read_text(encoding="utf-8"))
    for override in biome.get("overrides") or []:
        includes = override.get("includes") or []
        joined = " ".join(str(x) for x in includes)
        assert "role-runtime" not in joined

    contract = (
        root / "standalone" / "tests" / "contract" / "us0136.contract.test.ts"
    ).read_text(encoding="utf-8")
    for marker in MARKERS:
        assert marker in contract, marker

    kernel_src = "\n".join(
        p.read_text(encoding="utf-8")
        for p in (root / "standalone" / "packages" / "pi-kernel" / "src").glob("*.ts")
    )
    assert "createEmptyResourceLoader" in kernel_src
    assert "noTools: spec.noTools" in kernel_src
    assert "continueRecent" not in (root / "standalone" / "packages" / "pi-kernel" / "src" / "kernel.ts").read_text(
        encoding="utf-8"
    )
