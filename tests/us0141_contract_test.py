"""US-0141 kit-side contract markers (files-omit + no-Pi-in-app-runtime).

Markers 1–12 live primarily in `standalone/tests/contract/us0141.contract.test.ts`
(`node:test`). This module covers kit files omit + no Pi in packages/app-runtime
+ additive process_handles compose + fail-closed reason codes. No live Docker.
No vitest/jest. Not folded into kit TEST_COMMAND as standalone npm test.
"""

from __future__ import annotations

import json
from pathlib import Path

MARKERS = (
    "test_us0141_app_runtime_lifecycle",
    "test_us0141_process_manager_identity",
    "test_us0141_backend_local_docker_core",
    "test_us0141_backend_wsl_ssh_adapters",
    "test_us0141_stack_profiles",
    "test_us0141_self_debug_cap",
    "test_us0141_test_build_evidence",
    "test_us0141_connect_handoff_no_browser",
    "test_us0141_cleanup_success_fail_cancel",
    "test_us0141_chaos_crash_timeout_restart",
    "test_us0141_chaos_docker_remote_disconnect",
    "test_us0141_unsupported_backend",
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


def _app_runtime_src(root: Path) -> str:
    pkg = root / "standalone" / "packages" / "app-runtime"
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
    pkg_dir = root / "standalone" / "packages" / "app-runtime"
    assert (pkg_dir / "package.json").is_file()
    pkg = _load_json(pkg_dir / "package.json")
    assert pkg.get("name") == "@its-magic/app-runtime"
    assert pkg.get("private") is True
    assert pkg.get("version") == "0.0.0"
    assert pkg.get("type") == "module"
    assert str((pkg.get("engines") or {}).get("node", "")).startswith(">=22.19.0")
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    for key in deps:
        assert not str(key).startswith("@earendil-works/pi-"), key
        assert "dockerode" not in str(key)
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
        if "playwright" in text or "puppeteer" in text:
            hits.append(f"browser:{path.relative_to(root).as_posix()}")
    assert hits == [], f"forbidden imports inside app-runtime: {hits}"


def _contract(root: Path) -> str:
    return (
        root / "standalone" / "tests" / "contract" / "us0141.contract.test.ts"
    ).read_text(encoding="utf-8")


def test_us0141_app_runtime_lifecycle():
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
    contract = _contract(root)
    assert "test_us0141_app_runtime_lifecycle" in contract
    src = _app_runtime_src(root)
    assert "class AppRuntime" in src
    assert "discover(" in src


def test_us0141_process_manager_identity():
    root = _kit_root()
    store = (root / "standalone" / "packages" / "runtime-core" / "src" / "runs" / "store.ts").read_text(
        encoding="utf-8"
    )
    for col in (
        "phase_id",
        "backend",
        "identity_kind",
        "identity",
        "command",
        "cwd",
        "ports_json",
        "url",
        "readiness",
        "started_at",
        "crash_count",
        "restart_count",
        "log_ring_ref",
    ):
        assert col in store, col
    assert "upsertProcessHandle" in store
    assert "listProcessHandlesForRun" in store
    assert "reserveProcessHandle" in store
    gitignore = (root / ".gitignore").read_text(encoding="utf-8")
    assert "**/.its-magic/runtime/" in gitignore
    assert "test_us0141_process_manager_identity" in _contract(root)


def test_us0141_backend_local_docker_core():
    root = _kit_root()
    src = _app_runtime_src(root)
    assert "class LocalBackend" in src
    assert "class DockerBackend" in src
    assert "health_check" in src
    assert "BACKEND_DOCKER_UNAVAILABLE" in src
    assert "dockerode" not in src
    assert "test_us0141_backend_local_docker_core" in _contract(root)


def test_us0141_backend_wsl_ssh_adapters():
    root = _kit_root()
    src = _app_runtime_src(root)
    assert "class WslBackend" in src
    assert "class SshBackend" in src
    assert "class RemoteDockerBackend" in src
    assert "BACKEND_WSL_UNAVAILABLE" in src
    assert "BACKEND_SSH_UNAVAILABLE" in src
    assert "BatchMode=yes" in src
    assert "test_us0141_backend_wsl_ssh_adapters" in _contract(root)


def test_us0141_stack_profiles():
    root = _kit_root()
    src = _app_runtime_src(root)
    assert "package.json" in src
    assert "pyproject.toml" in src
    assert "go.mod" in src
    assert ".csproj" in src
    assert "pom.xml" in src
    assert "APP_RUNTIME_UNSUPPORTED_STACK" in src
    assert "DEV_SERVER_COMMAND" in src
    assert "test_us0141_stack_profiles" in _contract(root)


def test_us0141_self_debug_cap():
    root = _kit_root()
    src = _app_runtime_src(root)
    assert "APP_RUNTIME_RESTART_CAP_EXHAUSTED" in src
    assert "APP_RUNTIME_RESTART_MAX" in src
    assert "DEFAULT_RESTART_MAX = 3" in src
    assert "healthcheck_status" in src
    assert "test_us0141_self_debug_cap" in _contract(root)


def test_us0141_test_build_evidence():
    root = _kit_root()
    src = _app_runtime_src(root)
    assert "stdout_ref" in src
    assert "stderr_ref" in src
    assert "duration_ms" in src
    assert "DEFAULT_LOG_BUDGET_BYTES = 8192" in src
    assert "test_us0141_test_build_evidence" in _contract(root)


def test_us0141_connect_handoff_no_browser():
    root = _kit_root()
    src = _app_runtime_src(root)
    for field in (
        "connect_endpoint",
        "health_path",
        "service_id",
        "container_id",
        "env_refs",
    ):
        assert field in src, field
    assert "playwright" not in src
    assert "puppeteer" not in src
    assert "test_us0141_connect_handoff_no_browser" in _contract(root)


def test_us0141_cleanup_success_fail_cancel():
    root = _kit_root()
    src = _app_runtime_src(root)
    assert "PROCESS_ORPHAN_REAPED" in src
    assert "runtime_restart" in src
    assert "AbortSignal" in src or "signal" in src
    assert "test_us0141_cleanup_success_fail_cancel" in _contract(root)


def test_us0141_chaos_crash_timeout_restart():
    root = _kit_root()
    src = _app_runtime_src(root)
    assert "PROCESS_CRASHED" in src
    assert "BACKEND_TIMEOUT" in src
    assert "APP_RUNTIME_RESTART_CAP_EXHAUSTED" in src
    assert "test_us0141_chaos_crash_timeout_restart" in _contract(root)


def test_us0141_chaos_docker_remote_disconnect():
    root = _kit_root()
    src = _app_runtime_src(root)
    assert "BACKEND_CONNECTIVITY_FAILED" in src
    assert "BACKEND_DOCKER_UNAVAILABLE" in src
    assert "remote-docker" in src
    assert "test_us0141_chaos_docker_remote_disconnect" in _contract(root)


def test_us0141_unsupported_backend():
    root = _kit_root()
    src = _app_runtime_src(root)
    assert "BACKEND_UNSUPPORTED" in src
    assert "untrusted_repo" in src
    assert "micro-vm" in src
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
