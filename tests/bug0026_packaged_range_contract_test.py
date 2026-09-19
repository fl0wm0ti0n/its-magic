"""BUG-0026 contract for published-kit standalone supported-range bootstrap."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tarfile
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "scripts"))

import standalone_runtime_install_lib as srl  # noqa: E402  # pyright: ignore[reportMissingImports]

PACKAGED_RANGE = "scripts/standalone-supported-kernel-range.json"
CANONICAL_RANGE = "standalone/packages/kernel-bridge/supported-kernel-range.json"
DEV_ENVIRONMENT_LIB = "scripts/dev_environment_lib.py"
HOST_RUNTIME_CONFIG_LIB = "scripts/host_runtime_config_lib.py"


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _seed_kernel(root: Path, version: str = "0.1.4") -> None:
    _write(root / "docs/product/backlog.md", "# backlog\n")
    _write(root / "scripts/intake_evidence_validate.py", "# stub\n")
    _write(root / "its_magic/.its-magic-version", version + "\n")
    contract = json.loads((REPO_ROOT / "its_magic/kernel-contract.json").read_text(encoding="utf-8"))
    contract["kernel_version"] = version
    _write(root / "its_magic/kernel-contract.json", json.dumps(contract) + "\n")


def _pack_paths() -> set[str]:
    npm = shutil.which("npm")
    assert npm, "npm must be on PATH for pack inventory contract"
    proc = subprocess.run(
        [npm, "pack", "--dry-run", "--json"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    assert proc.returncode == 0, proc.stderr or proc.stdout
    payload = json.loads(proc.stdout or "[]")
    items = payload if isinstance(payload, list) else [payload]
    return {
        str(row.get("path") if isinstance(row, dict) else row).replace("\\", "/")
        for item in items
        if isinstance(item, dict)
        for row in (item.get("files", []) or [])
    }


def test_bug0026_allowlist_ships_equivalent_range_without_private_workspace() -> None:
    pkg = json.loads((REPO_ROOT / "package.json").read_text(encoding="utf-8"))
    files = pkg.get("files") or []
    assert PACKAGED_RANGE in files
    assert DEV_ENVIRONMENT_LIB in files
    assert HOST_RUNTIME_CONFIG_LIB in files
    assert "standalone/" not in files
    assert "standalone" not in files


def test_bug0026_packaged_range_matches_kernel_bridge_source() -> None:
    packaged = json.loads((REPO_ROOT / PACKAGED_RANGE).read_text(encoding="utf-8"))
    canonical = json.loads((REPO_ROOT / CANONICAL_RANGE).read_text(encoding="utf-8"))
    assert packaged == canonical


def test_bug0026_npm_pack_contains_range_fallback_and_omits_standalone_workspace() -> None:
    paths = _pack_paths()
    assert PACKAGED_RANGE in paths
    assert not any(path == "standalone" or path.startswith("standalone/") for path in paths)
    assert not any("__pycache__" in path or path.endswith((".pyc", ".pyo")) for path in paths)


def test_bug0026_published_layout_preflight_uses_packaged_range(tmp_path: Path) -> None:
    package_root = tmp_path / "published-package"
    consumer = tmp_path / "consumer"
    package_root.mkdir()
    consumer.mkdir()
    _write(
        package_root / PACKAGED_RANGE,
        (REPO_ROOT / PACKAGED_RANGE).read_text(encoding="utf-8"),
    )
    _seed_kernel(consumer)

    metadata, reason = srl.run_kernel_preflight(str(consumer), str(package_root))

    assert reason is None
    assert metadata["kernel_version"] == "0.1.4"
    assert metadata["supported_range"]["maxExclusive"] == "0.2.0"
    assert not (package_root / "standalone").exists()


def test_bug0026_published_layout_materializes_itsm_shim(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    package_root = tmp_path / "published-package"
    consumer = tmp_path / "consumer"
    source_root = package_root / "template"
    shutil.copytree(REPO_ROOT / "template/.its-magic/standalone", source_root / ".its-magic/standalone")
    _write(
        package_root / PACKAGED_RANGE,
        (REPO_ROOT / PACKAGED_RANGE).read_text(encoding="utf-8"),
    )
    consumer.mkdir()
    _seed_kernel(consumer)
    monkeypatch.delenv("FRAMEWORK_KIT_REPO", raising=False)
    monkeypatch.setenv("ITSM_SKIP_NPM_CI", "1")

    ok, reason = srl.bootstrap_standalone_runtime_installer_hook(
        str(consumer), str(source_root), str(package_root)
    )

    assert ok
    assert reason is None
    assert (consumer / ".its-magic/bin/itsm").is_file()
    assert (consumer / ".its-magic/standalone/runtime-metadata.json").is_file()


def test_bug0026_packed_tarball_upgrade_materializes_itsm_shim(
    tmp_path: Path,
) -> None:
    npm = shutil.which("npm")
    assert npm, "npm must be on PATH for packed-install contract"
    pack_dir = tmp_path / "pack"
    extract_dir = tmp_path / "extract"
    consumer = tmp_path / "consumer"
    pack_dir.mkdir()
    extract_dir.mkdir()
    consumer.mkdir()
    _seed_kernel(consumer)
    packed = subprocess.run(
        [npm, "pack", "--pack-destination", str(pack_dir), "--json"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    assert packed.returncode == 0, packed.stderr or packed.stdout
    payload = json.loads(packed.stdout or "[]")
    filename = payload[0]["filename"]
    with tarfile.open(pack_dir / filename, "r:gz") as archive:
        if sys.version_info >= (3, 12):
            archive.extractall(extract_dir, filter="data")
        else:
            archive.extractall(extract_dir)
    package_root = extract_dir / "package"
    env = dict(os.environ, ITSM_SKIP_NPM_CI="1")

    proc = subprocess.run(
        [
            sys.executable,
            str(package_root / "installer.py"),
            "--mode",
            "upgrade",
            "--host",
            "both",
            "--source-root",
            str(package_root / "template"),
            "--target",
            str(consumer),
        ],
        cwd=package_root,
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )

    assert proc.returncode == 0, proc.stdout + proc.stderr
    assert "KERNEL_CONTRACT_MISMATCH" not in proc.stdout + proc.stderr
    assert (consumer / ".its-magic/bin/itsm").is_file()


def test_bug0026_missing_range_is_not_false_kernel_contract_mismatch(tmp_path: Path) -> None:
    package_root = tmp_path / "broken-package"
    consumer = tmp_path / "consumer"
    package_root.mkdir()
    consumer.mkdir()
    _seed_kernel(consumer)

    _metadata, reason = srl.run_kernel_preflight(str(consumer), str(package_root))

    assert reason == "STANDALONE_SUPPORTED_RANGE_MISSING"
    assert reason != "KERNEL_CONTRACT_MISMATCH"
