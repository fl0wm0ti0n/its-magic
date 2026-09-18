"""US-0147 standalone install/adopt contract — exactly 10 markers."""

from __future__ import annotations

import json
import os
import shutil
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "scripts"))
sys.path.insert(0, str(REPO_ROOT))

import installer  # noqa: E402
import standalone_runtime_install_lib as srl  # noqa: E402

MANIFEST = REPO_ROOT / "docs" / "engineering" / "context" / "installer-owned-paths.manifest"
TEMPLATE_MANIFEST = REPO_ROOT / "template" / "docs" / "engineering" / "context" / "installer-owned-paths.manifest"
RUNBOOK = REPO_ROOT / "docs" / "engineering" / "runbook.md"
TEMPLATE_RUNBOOK = REPO_ROOT / "template" / "docs" / "engineering" / "runbook.md"
US0147_H2 = "## Standalone install, update, and adoption (US-0147)"


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _seed_kernel_markers(root: Path, *, version: str = "0.1.3-11") -> None:
    _write(root / "docs" / "product" / "backlog.md", "# backlog\n")
    _write(root / "scripts" / "intake_evidence_validate.py", "# stub\n")
    _write(root / "its_magic" / ".its-magic-version", version + "\n")
    contract = json.loads((REPO_ROOT / "its_magic" / "kernel-contract.json").read_text(encoding="utf-8"))
    contract["kernel_version"] = version
    _write(root / "its_magic" / "kernel-contract.json", json.dumps(contract, indent=2) + "\n")


def _manifest_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


@pytest.fixture(autouse=True)
def _framework_kit_repo(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("FRAMEWORK_KIT_REPO", "1")
    monkeypatch.setenv("ITSM_SKIP_NPM_CI", "1")


def test_us0147_fresh_install_manifest_parity() -> None:
    active = _manifest_text(MANIFEST)
    template = _manifest_text(TEMPLATE_MANIFEST)
    for token in ("[deny_overwrite]", "[standalone_install_paths]", ".its-magic/standalone/**"):
        assert token in active
        assert token in template
    py = (REPO_ROOT / "installer.py").read_text(encoding="utf-8")
    ps1 = (REPO_ROOT / "installer.ps1").read_text(encoding="utf-8")
    sh = (REPO_ROOT / "installer.sh").read_text(encoding="utf-8")
    assert "bootstrap_standalone_runtime_installer_hook" in py
    assert "--standalone-postinstall" in py
    assert "Invoke-StandalonePostinstall" in ps1
    assert "standalone_postinstall" in sh
    mirror = REPO_ROOT / "template" / ".its-magic" / "standalone" / "package.json"
    in_tree = REPO_ROOT / "standalone" / "package.json"
    assert mirror.is_file() or in_tree.is_file()


def test_us0147_upgrade_preserves_user_layers(tmp_path: Path) -> None:
    repo = tmp_path / "consumer"
    repo.mkdir()
    _seed_kernel_markers(repo)
    local = repo / ".cursor" / "scratchpad.local.md"
    _write(local, "operator-secret-layer\n")
    deny = srl.read_deny_overwrite(str(MANIFEST))
    assert srl.path_denied_overwrite(".cursor/scratchpad.local.md", deny)
    ok, _ = srl.bootstrap_standalone_runtime_installer_hook(
        str(repo),
        str(REPO_ROOT / "template"),
        str(REPO_ROOT),
    )
    assert ok
    assert local.read_text(encoding="utf-8") == "operator-secret-layer\n"


def test_us0147_adopt_cursor_only_repo(tmp_path: Path) -> None:
    repo = tmp_path / "cursor-only"
    repo.mkdir()
    _seed_kernel_markers(repo)
    (repo / ".cursor").mkdir()
    profile = srl.classify_project_adoption_profile(str(repo))
    assert profile.adoption_class == "existing-its-magic"
    assert profile.host_profile == "cursor-only"
    assert profile.reason_code is None


def test_us0147_adopt_opencode_only_repo(tmp_path: Path) -> None:
    repo = tmp_path / "opencode-only"
    repo.mkdir()
    _seed_kernel_markers(repo)
    (repo / ".opencode").mkdir()
    profile = srl.classify_project_adoption_profile(str(repo))
    assert profile.adoption_class == "existing-its-magic"
    assert profile.host_profile == "opencode-only"


def test_us0147_adopt_both_hosts_repo(tmp_path: Path) -> None:
    repo = tmp_path / "both"
    repo.mkdir()
    _seed_kernel_markers(repo)
    (repo / ".cursor").mkdir()
    (repo / ".opencode").mkdir()
    profile = srl.classify_project_adoption_profile(str(repo))
    assert profile.host_profile == "both-host"


def test_us0147_interrupted_update_rollback(tmp_path: Path) -> None:
    repo = tmp_path / "staged"
    repo.mkdir()
    _seed_kernel_markers(repo)
    run_id = srl.staged_update_begin(str(repo))
    staging = repo / ".its-magic" / "install-staging" / run_id
    assert staging.is_dir()
    code = srl.staged_update_rollback(str(repo), run_id, [".cursor/scratchpad.local.md"])
    assert code == "INSTALL_INTERRUPTED_ROLLBACK_OK"
    assert not staging.exists()


def test_us0147_kernel_mismatch_fail_closed(tmp_path: Path) -> None:
    repo = tmp_path / "bad-kernel"
    repo.mkdir()
    _seed_kernel_markers(repo, version="0.1.2")
    _meta, err = srl.run_kernel_preflight(str(repo), str(REPO_ROOT))
    assert err == "KERNEL_VERSION_UNSUPPORTED"


def test_us0147_browser_setup_explicit_gate(tmp_path: Path) -> None:
    repo = tmp_path / "browser"
    repo.mkdir()
    _seed_kernel_markers(repo)
    ok, _ = srl.bootstrap_standalone_runtime_installer_hook(
        str(repo),
        str(REPO_ROOT / "template"),
        str(REPO_ROOT),
    )
    assert ok
    allowed, code = srl.setup_browser_explicit(str(repo))
    assert not allowed
    assert code == "INSTALL_BROWSER_EXPLICIT_GATE"
    meta = json.loads((repo / ".its-magic" / "standalone" / "runtime-metadata.json").read_text())
    assert meta.get("browser_prereq") == "missing"


def test_us0147_uninstall_preserves_hosts(tmp_path: Path) -> None:
    repo = tmp_path / "uninstall"
    repo.mkdir()
    _seed_kernel_markers(repo)
    (repo / ".cursor").mkdir()
    (repo / ".opencode").mkdir()
    ok, _ = srl.bootstrap_standalone_runtime_installer_hook(
        str(repo),
        str(REPO_ROOT / "template"),
        str(REPO_ROOT),
    )
    assert ok
    srl.uninstall_standalone(str(repo))
    assert (repo / ".cursor").is_dir()
    assert (repo / ".opencode").exists()
    assert not (repo / ".its-magic" / "standalone").exists()


def test_us0147_runbook_sections_present() -> None:
    for path in (RUNBOOK, TEMPLATE_RUNBOOK):
        text = path.read_text(encoding="utf-8")
        assert US0147_H2 in text
        assert "uninstall-standalone" in text
        assert "itsm setup browser" in text
        assert "FRAMEWORK_KIT_REPO" in text
