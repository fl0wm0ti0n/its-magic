"""BUG-0025 packaging contract — standalone_runtime_install_lib in npm files + fail-closed loader."""

from __future__ import annotations

import importlib
import io
import json
import os
import subprocess
import sys
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

import installer  # noqa: E402

LIB_ALLOWLIST = "scripts/standalone_runtime_install_lib.py"
STANDALONE_TOKEN = "STANDALONE_BOOTSTRAP_FAILED"


def _load_pkg() -> dict:
    return json.loads((REPO_ROOT / "package.json").read_text(encoding="utf-8"))


def test_bug0025_package_json_files_lists_standalone_runtime_install_lib() -> None:
    """Marker 1 / AC-2: root files allowlist lists the exact lib path."""
    pkg = _load_pkg()
    assert pkg.get("name") == "its-magic"
    files = pkg.get("files") or []
    assert isinstance(files, list)
    assert LIB_ALLOWLIST in files
    assert "scripts/" not in files
    assert "standalone/" not in files
    assert "standalone" not in files


def test_bug0025_npm_pack_includes_standalone_runtime_install_lib() -> None:
    """Marker 2 / AC-1, AC-5: npm pack inventory includes the lib path."""
    import shutil

    npm_bin = shutil.which("npm")
    assert npm_bin, "npm must be on PATH for pack inventory contract"
    npm = subprocess.run(
        [npm_bin, "pack", "--dry-run", "--json"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
        shell=False,
    )
    assert npm.returncode == 0, npm.stderr or npm.stdout
    payload = json.loads(npm.stdout or "[]")
    items = payload if isinstance(payload, list) else [payload]
    paths: set[str] = set()
    for item in items:
        if not isinstance(item, dict):
            continue
        for row in item.get("files", []) or []:
            p = row.get("path") if isinstance(row, dict) else row
            if p:
                paths.add(str(p).replace("\\", "/"))
    assert any(
        p == LIB_ALLOWLIST or p.endswith("/" + LIB_ALLOWLIST) or p == f"package/{LIB_ALLOWLIST}"
        for p in paths
    ), f"expected {LIB_ALLOWLIST} in pack inventory; got sample={sorted(paths)[:20]}"


def test_bug0025_load_missing_lib_emits_standalone_bootstrap_failed(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Marker 3 / AC-3: missing lib raises RuntimeError with STANDALONE_BOOTSTRAP_FAILED."""
    fake_installer = tmp_path / "installer.py"
    fake_installer.write_text("# stub\n", encoding="utf-8")
    (tmp_path / "scripts").mkdir()
    monkeypatch.setattr(installer, "__file__", str(fake_installer))
    with pytest.raises(RuntimeError) as excinfo:
        installer._load_standalone_runtime_install_lib()
    msg = str(excinfo.value)
    assert STANDALONE_TOKEN in msg
    assert "FileNotFoundError" not in type(excinfo.value).__name__


def test_bug0025_bootstrap_wrapper_no_raw_filenotfound_traceback(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Marker 4 / AC-3, AC-4: bootstrap wrapper prints token; no raw FileNotFoundError traceback."""
    fake_installer = tmp_path / "installer.py"
    fake_installer.write_text("# stub\n", encoding="utf-8")
    (tmp_path / "scripts").mkdir()
    monkeypatch.setattr(installer, "__file__", str(fake_installer))
    out = io.StringIO()
    err = io.StringIO()
    with redirect_stdout(out), redirect_stderr(err):
        ok = installer.bootstrap_standalone_runtime_installer_hook(
            str(tmp_path / "target"),
            str(tmp_path / "source"),
            script_dir=str(tmp_path),
            print_ok=True,
        )
    combined = out.getvalue() + err.getvalue()
    assert ok is False
    assert STANDALONE_TOKEN in combined
    assert "Traceback" not in combined
    assert "FileNotFoundError" not in combined


def test_bug0025_guard_installer_publish_requires_allowlist_entry() -> None:
    """Marker 5 / AC-5: guard asserts allowlist entry (T-006 extended)."""
    import shutil

    guard = (REPO_ROOT / "scripts" / "guard_installer_publish.py").read_text(encoding="utf-8")
    assert "_require_standalone_runtime_install_lib_allowlist" in guard
    assert LIB_ALLOWLIST in guard
    template_guard = REPO_ROOT / "template" / "scripts" / "guard_installer_publish.py"
    assert template_guard.is_file()
    assert template_guard.read_bytes() == (
        REPO_ROOT / "scripts" / "guard_installer_publish.py"
    ).read_bytes()
    # Live guard must pass on current tree (allowlist present; standalone omitted).
    proc = subprocess.run(
        [sys.executable, str(REPO_ROOT / "scripts" / "guard_installer_publish.py")],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    assert proc.returncode == 0, proc.stderr or proc.stdout
    # When npm is available, dry-run inventory must also list the lib (compose US-0084 path).
    if shutil.which("npm"):
        # Re-assert via the pack marker helper path already covered by marker 2.
        assert LIB_ALLOWLIST in _load_pkg().get("files", [])



def test_bug0025_us0147_compose_hook_call_sites_unchanged() -> None:
    """Marker 6 / AC-7: US-0147 hook call sites remain; no feature reopen."""
    py = (REPO_ROOT / "installer.py").read_text(encoding="utf-8")
    assert "bootstrap_standalone_runtime_installer_hook" in py
    assert "run_standalone_postinstall" in py
    assert "_load_standalone_runtime_install_lib" in py
    # Call sites: upgrade + missing + CLI standalone-postinstall paths.
    assert py.count("run_standalone_postinstall(") >= 3
    assert "classify_project_adoption_profile" in py
    # Lib still present as package-root peer (not inlined into installer.py).
    lib = REPO_ROOT / "scripts" / "standalone_runtime_install_lib.py"
    assert lib.is_file()
    body = lib.read_text(encoding="utf-8")
    assert "def bootstrap_standalone_runtime_installer_hook" in body
    # Reload installer module symbols still export the hook.
    importlib.reload(installer)
    assert callable(installer.bootstrap_standalone_runtime_installer_hook)
    assert callable(installer.run_standalone_postinstall)
