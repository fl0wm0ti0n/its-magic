"""US-0142 kit-side contract markers (files-omit + no-Pi-in-browser-uat).

Markers 1–12 live primarily in `standalone/tests/contract/us0142.contract.test.ts`
(`node:test`). This module covers kit files omit + no Pi in packages/browser-uat
+ Connect consume + fail-closed BROWSER_* codes. No live Chrome.
No vitest/jest. Not folded into kit TEST_COMMAND as standalone npm test.
"""

from __future__ import annotations

import json
from pathlib import Path

MARKERS = (
    "test_us0142_isolated_launch_context",
    "test_us0142_cdp_connect_disconnect",
    "test_us0142_cdp_unauthorized_and_default_profile",
    "test_us0142_itsm_browser_typed_actions",
    "test_us0142_uat_planner_browser_smoke",
    "test_us0142_kit_forbidden_unweakened",
    "test_us0142_evidence_schema_connect_ref",
    "test_us0142_redact_headers_cookies_tokens",
    "test_us0142_credential_deny_no_env",
    "test_us0142_fail_closed_retry_cap",
    "test_us0142_e2e_happy_uat_gate",
    "test_us0142_e2e_failure_and_exploratory_spec",
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


def _browser_uat_src(root: Path) -> str:
    pkg = root / "standalone" / "packages" / "browser-uat"
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
    pkg_dir = root / "standalone" / "packages" / "browser-uat"
    assert (pkg_dir / "package.json").is_file()
    pkg = _load_json(pkg_dir / "package.json")
    assert pkg.get("name") == "@its-magic/browser-uat"
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
    assert hits == [], f"forbidden imports inside browser-uat: {hits}"


def _contract(root: Path) -> str:
    return (
        root / "standalone" / "tests" / "contract" / "us0142.contract.test.ts"
    ).read_text(encoding="utf-8")


def test_us0142_isolated_launch_context():
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
    assert "test_us0142_isolated_launch_context" in contract
    src = _browser_uat_src(root)
    assert "class BrowserUAT" in src
    assert "launch" in src
    assert "newContext" in src
    assert "headless" in src


def test_us0142_cdp_connect_disconnect():
    root = _kit_root()
    src = _browser_uat_src(root)
    assert "connectOverCDP" in src
    assert "disconnect" in src
    assert "browser.close()" not in src or "Reject" in src or "not" in src.lower()
    assert "test_us0142_cdp_connect_disconnect" in _contract(root)


def test_us0142_cdp_unauthorized_and_default_profile():
    root = _kit_root()
    src = _browser_uat_src(root)
    assert "BROWSER_CDP_UNAUTHORIZED" in src
    assert "BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN" in src
    assert "test_us0142_cdp_unauthorized_and_default_profile" in _contract(root)


def test_us0142_itsm_browser_typed_actions():
    root = _kit_root()
    src = _browser_uat_src(root)
    for action in (
        "open",
        "navigate",
        "snapshot",
        "click",
        "type",
        "select",
        "wait",
        "screenshot",
        "console",
        "network",
        "download",
        "upload",
        "accessibility",
    ):
        assert action in src, action
    assert "toHaveScreenshot" not in src
    types = (
        root / "standalone" / "packages" / "policy-engine" / "src" / "types.ts"
    ).read_text(encoding="utf-8")
    assert "itsm_browser" in types
    assert "PROMOTED_LIVE_TOOLS" in types
    assert "test_us0142_itsm_browser_typed_actions" in _contract(root)


def test_us0142_uat_planner_browser_smoke():
    root = _kit_root()
    src = _browser_uat_src(root)
    lib = (root / "scripts" / "uat_probe_lib.py").read_text(encoding="utf-8")
    assert "browser_smoke" in src
    assert 'UAT_BROWSER_PROBE_MODE", "cursor"' in lib
    assert '"owned"' in lib
    assert "test_us0142_uat_planner_browser_smoke" in _contract(root)


def test_us0142_kit_forbidden_unweakened():
    root = _kit_root()
    lib = (root / "scripts" / "uat_probe_lib.py").read_text(encoding="utf-8")
    assert "UAT_PROBE_FORBIDDEN" in lib
    assert ".env" in lib
    assert "password" in lib
    src = _browser_uat_src(root)
    assert "UAT_PROBE_FORBIDDEN" in src
    assert "test_us0142_kit_forbidden_unweakened" in _contract(root)


def test_us0142_evidence_schema_connect_ref():
    root = _kit_root()
    src = _browser_uat_src(root)
    for field in (
        "snapshot_summary",
        "trace_ref",
        "duration_ms",
        "browser_backend",
        "app_runtime_ref",
        "connect_endpoint",
        "health_path",
        "service_id",
    ):
        assert field in src, field
    gitignore = (root / ".gitignore").read_text(encoding="utf-8")
    assert "**/.its-magic/runtime/" in gitignore
    assert "browser-evidence" in src
    assert "test_us0142_evidence_schema_connect_ref" in _contract(root)


def test_us0142_redact_headers_cookies_tokens():
    root = _kit_root()
    src = _browser_uat_src(root)
    assert "Authorization" in src or "authorization" in src
    assert "Cookie" in src or "cookie" in src
    assert "Set-Cookie" in src or "set-cookie" in src
    assert "[redacted]" in src
    assert "test_us0142_redact_headers_cookies_tokens" in _contract(root)


def test_us0142_credential_deny_no_env():
    root = _kit_root()
    src = _browser_uat_src(root)
    assert ".env" in src
    assert "BROWSER_CREDENTIAL_FORBIDDEN" in src
    assert "never" in src.lower() or "UAT_PROBE_FORBIDDEN" in src
    assert "test_us0142_credential_deny_no_env" in _contract(root)


def test_us0142_fail_closed_retry_cap():
    root = _kit_root()
    src = _browser_uat_src(root)
    assert "BROWSER_UNAVAILABLE" in src
    assert "BROWSER_RETRY_MAX" in src
    assert "DEFAULT_RETRY_MAX = 2" in src
    assert "BROWSER_RETRY_CAP_EXHAUSTED" in src
    assert "APP_RUNTIME_RESTART_MAX" not in src
    assert "test_us0142_fail_closed_retry_cap" in _contract(root)


def test_us0142_e2e_happy_uat_gate():
    root = _kit_root()
    src = _browser_uat_src(root)
    assert "class BrowserUAT" in src
    assert "executeOwnedUat" in src
    assert "UAT_PROBE_PASS" in src
    assert "test_us0142_e2e_happy_uat_gate" in _contract(root)


def test_us0142_e2e_failure_and_exploratory_spec():
    root = _kit_root()
    src = _browser_uat_src(root)
    assert "toHaveScreenshot" not in src
    assert "UAT_BROWSER_PROBE_FAILED" in src
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
