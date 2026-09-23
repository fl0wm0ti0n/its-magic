"""Contract tests for release-time kernel metadata synchronization."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
SYNC_SCRIPT = REPO_ROOT / "scripts" / "sync_kernel_version.py"


def _write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def _seed_repo(root: Path) -> None:
    _write(root / "package.json", json.dumps({"version": "1.2.3"}))
    for rel in ("its_magic", "template/its_magic"):
        _write(root / rel / ".its-magic-version", "0.0.0\n")
        _write(root / rel / "kernel-contract.json", json.dumps({"schema_version": 1, "kernel_version": "0.0.0"}))


def _run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(SYNC_SCRIPT), *args],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )


def test_kernel_version_sync_updates_all_kernel_metadata(tmp_path: Path) -> None:
    _seed_repo(tmp_path)

    result = _run("--repo", str(tmp_path))

    assert result.returncode == 0, result.stderr
    for rel in ("its_magic", "template/its_magic"):
        assert (tmp_path / rel / ".its-magic-version").read_text(encoding="utf-8") == "1.2.3\n"
        assert json.loads((tmp_path / rel / "kernel-contract.json").read_text(encoding="utf-8"))["kernel_version"] == "1.2.3"


def test_kernel_version_sync_check_fails_closed_on_mismatch(tmp_path: Path) -> None:
    _seed_repo(tmp_path)

    result = _run("--repo", str(tmp_path), "--check")

    assert result.returncode == 1
    assert "KERNEL_VERSION_MISMATCH" in result.stdout


def test_kernel_version_sync_supports_installed_consumer_layout(tmp_path: Path) -> None:
    _seed_repo(tmp_path)
    for path in (tmp_path / "template").glob("**/*"):
        if path.is_file():
            path.unlink()
    for path in sorted((tmp_path / "template").glob("**/*"), reverse=True):
        if path.is_dir():
            path.rmdir()
    (tmp_path / "template").rmdir()

    result = _run("--repo", str(tmp_path))

    assert result.returncode == 0, result.stderr
    assert (tmp_path / "its_magic/.its-magic-version").read_text(encoding="utf-8") == "1.2.3\n"


def test_kernel_version_sync_script_is_packaged() -> None:
    package = json.loads((REPO_ROOT / "package.json").read_text(encoding="utf-8"))

    assert "scripts/sync_kernel_version.py" in package["files"]
