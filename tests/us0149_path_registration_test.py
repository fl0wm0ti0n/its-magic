"""US-0149 opt-in itsm PATH registration — eight R-0160 markers.

Uses a fake home and a fake PATH store. Never opens the live user PATH or HKCU.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "scripts"))

import standalone_runtime_install_lib as srl  # noqa: E402

RUNBOOK = REPO_ROOT / "docs" / "engineering" / "runbook.md"
TEMPLATE_RUNBOOK = REPO_ROOT / "template" / "docs" / "engineering" / "runbook.md"
README = REPO_ROOT / "README.md"
TEMPLATE_README = REPO_ROOT / "template" / "README.md"
PATH_HEADING = "### Global itsm PATH registration (US-0149)"
PATH_TOKENS = (
    "--register-itsm-path",
    "--unregister-itsm-path",
    "ITS_MAGIC_REGISTER_ITSM_PATH",
    "ITS_MAGIC_ITSM_PATH_DIR",
    "prompt",
    "ITSM_PATH_REGISTER_FAILED",
    "ITSM_PATH_SHIM_MISSING",
    "ITSM_PATH_REGISTER_OK",
    "ITSM_PATH_UNREGISTER_OK",
    "%LOCALAPPDATA%\\its-magic\\bin",
    "$HOME/.local/bin",
    "BUG-0026",
    "setx",
)


class FakePathStore:
    def __init__(self, value: str = "", value_type: str = "REG_EXPAND_SZ", fail: bool = False) -> None:
        self.value = value
        self.value_type = value_type
        self.fail = fail
        self.writes: list[tuple[str, str]] = []

    def read(self) -> tuple[str, str]:
        return self.value, self.value_type

    def write(self, value: str, value_type: str) -> None:
        if self.fail:
            raise OSError("simulated PATH write failure")
        self.writes.append((value, value_type))
        self.value = value
        self.value_type = value_type


def _seed_shim(repo: Path, *, windows: bool) -> None:
    shim = repo / ".its-magic" / "bin" / "itsm"
    shim.parent.mkdir(parents=True, exist_ok=True)
    shim.write_text("#!/bin/sh\necho itsm\n", encoding="utf-8")
    if windows:
        (repo / ".its-magic" / "bin" / "itsm.cmd").write_text("@echo off\r\n", encoding="utf-8")


def _ledger(home: Path, platform: str) -> Path:
    return Path(srl.itsm_path_ledger_path(platform=platform, home=str(home)))


def _section(text: str) -> str:
    start = text.index(PATH_HEADING)
    body = [PATH_HEADING]
    for line in text[start + len(PATH_HEADING) :].splitlines():
        if line.startswith("### ") or line.startswith("## "):
            break
        body.append(line)
    return "\n".join(body).strip() + "\n"


def test_us0149_register_refuses_when_shim_missing(tmp_path: Path) -> None:
    home = tmp_path / "home"
    home.mkdir()
    repo = tmp_path / "repo"
    repo.mkdir()
    chosen = tmp_path / "chosen"
    store = FakePathStore(r"C:\Windows;C:\Other", "REG_SZ")

    ok, token = srl.register_itsm_user_path(
        str(repo),
        str(chosen),
        platform_name="posix",
        home=str(home),
        path_store=store,
    )
    assert ok is False
    assert token == "ITSM_PATH_SHIM_MISSING"
    assert not _ledger(home, "posix").exists()
    assert store.writes == []
    assert store.value == r"C:\Windows;C:\Other"
    assert not chosen.exists()

    _seed_shim(repo, windows=False)
    ok, token = srl.register_itsm_user_path(
        str(repo),
        str(chosen),
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        path_store=store,
    )
    assert ok is False
    assert token == "ITSM_PATH_SHIM_MISSING"
    assert not _ledger(home, "nt").exists()
    assert store.writes == []
    assert not chosen.exists()


def test_us0149_register_opt_in_default_off(tmp_path: Path) -> None:
    home = tmp_path / "home"
    home.mkdir()
    repo = tmp_path / "repo"
    _seed_shim(repo, windows=True)
    store = FakePathStore(r"C:\Windows")
    code, token = srl.dispatch_itsm_path_registration(
        str(repo),
        register_flag=None,
        unregister=False,
        env={},
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        localappdata=str(home / "Local"),
        path_store=store,
        is_tty=False,
    )
    assert code == 0
    assert token is None
    assert srl.resolve_itsm_path_opt_in(None, {}) is False
    assert not _ledger(home, "nt").exists()
    assert store.writes == []
    assert store.value == r"C:\Windows"

    prompted: list[str] = []

    def _boom(prompt: str) -> str:
        prompted.append(prompt)
        raise AssertionError("prompt must not run when stdin is not a TTY")

    code, token = srl.dispatch_itsm_path_registration(
        str(repo),
        register_flag="prompt",
        env={},
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        path_store=store,
        is_tty=False,
        prompt_fn=_boom,
    )
    assert code == 1
    assert token == "ITSM_PATH_REGISTER_FAILED"
    assert prompted == []
    assert store.writes == []
    assert not _ledger(home, "nt").exists()

    py = (REPO_ROOT / "installer.py").read_text(encoding="utf-8")
    ps1 = (REPO_ROOT / "installer.ps1").read_text(encoding="utf-8")
    sh = (REPO_ROOT / "installer.sh").read_text(encoding="utf-8")
    assert "--register-itsm-path" in py
    assert "--unregister-itsm-path" in py
    for script in (ps1, sh):
        assert "--register-itsm-path" in script
        assert "--unregister-itsm-path" in script
        assert "installer.py" in script
        assert "setx" not in script.lower()


def test_us0149_register_user_chosen_dir(tmp_path: Path) -> None:
    home = tmp_path / "home"
    local = home / "AppData" / "Local"
    home.mkdir()
    local.mkdir(parents=True)
    assert srl.WINDOWS_ITSM_BIN_REL == os.path.join("its-magic", "bin")
    assert srl.POSIX_ITSM_BIN_REL == os.path.join(".local", "bin")
    assert srl.default_itsm_link_dir(platform="nt", home=str(home), localappdata=str(local)) == str(
        local / "its-magic" / "bin"
    )
    assert srl.default_itsm_link_dir(platform="posix", home=str(home)) == os.path.join(str(home), ".local", "bin")

    repo = tmp_path / "repo"
    _seed_shim(repo, windows=False)
    chosen = tmp_path / "custom" / "bin"
    code, token = srl.dispatch_itsm_path_registration(
        str(repo),
        register_flag=str(chosen),
        env={"ITS_MAGIC_ITSM_PATH_DIR": str(tmp_path / "ignored")},
        platform_name="posix",
        home=str(home),
        is_tty=False,
    )
    assert code == 0
    assert token == "ITSM_PATH_REGISTER_OK"
    link = chosen / "itsm"
    assert link.exists() or link.is_symlink()
    target = os.path.abspath(os.path.join(str(repo), ".its-magic", "bin", "itsm"))
    chosen_abs = os.path.abspath(str(chosen))
    if link.is_symlink():
        assert os.path.abspath(os.readlink(link)) == target
    else:
        assert link.read_text(encoding="utf-8") == (repo / ".its-magic" / "bin" / "itsm").read_text(encoding="utf-8")
    ledger = json.loads(_ledger(home, "posix").read_text(encoding="utf-8"))
    assert ledger["dir"] == chosen_abs
    assert ledger["link_names"] == ["itsm"]
    assert ledger["link_target"] == target
    assert ledger["path_entry_added"] is True

    empty_flag_dir = srl.resolve_itsm_path_directory(
        "",
        platform="posix",
        home=str(home),
        env={},
        is_tty=True,
        prompt_fn=lambda _prompt: (_ for _ in ()).throw(AssertionError("default must not prompt")),
    )
    assert empty_flag_dir == (os.path.join(str(home), ".local", "bin"), None)


def test_us0149_register_windows_user_path(tmp_path: Path) -> None:
    home = tmp_path / "home"
    home.mkdir()
    repo = tmp_path / "repo"
    _seed_shim(repo, windows=True)
    chosen = tmp_path / "its-magic" / "bin"
    prefix = r"C:\Windows\system32;C:\Tools"
    chosen_abs = os.path.abspath(str(chosen))
    store = FakePathStore(prefix, "REG_EXPAND_SZ")
    ok, token = srl.register_itsm_user_path(
        str(repo),
        str(chosen),
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        path_store=store,
    )
    assert ok is True
    assert token == "ITSM_PATH_REGISTER_OK"
    assert store.value_type == "REG_EXPAND_SZ"
    assert store.value == prefix + ";" + chosen_abs
    assert store.writes == [(store.value, "REG_EXPAND_SZ")]
    assert (chosen / "itsm").is_file()
    assert (chosen / "itsm.cmd").is_file()
    assert not (chosen / "itsm").is_symlink()
    assert (chosen / "itsm.cmd").read_bytes() == (repo / ".its-magic" / "bin" / "itsm.cmd").read_bytes()
    ledger = json.loads(_ledger(home, "nt").read_text(encoding="utf-8"))
    assert ledger["path_entry_added"] is True
    assert ledger["link_names"] == ["itsm", "itsm.cmd"]

    ok, token = srl.register_itsm_user_path(
        str(repo),
        str(chosen),
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        path_store=store,
    )
    assert ok is True and token == "ITSM_PATH_REGISTER_OK"
    assert store.value == prefix + ";" + chosen_abs
    assert len(store.writes) == 1

    preseeded = FakePathStore(r"C:\Windows;" + chosen_abs + r";C:\Other", "REG_SZ")
    ok, _token = srl.register_itsm_user_path(
        str(repo),
        str(chosen),
        platform_name="nt",
        home=str(home / "other-profile"),
        userprofile=str(home / "other-profile"),
        path_store=preseeded,
    )
    assert ok is True
    assert preseeded.writes == []
    assert preseeded.value == r"C:\Windows;" + chosen_abs + r";C:\Other"
    other = json.loads(_ledger(home / "other-profile", "nt").read_text(encoding="utf-8"))
    assert other["path_entry_added"] is False


def test_us0149_register_posix_profile_snippet(tmp_path: Path, monkeypatch) -> None:
    home = tmp_path / "home"
    home.mkdir()
    (home / ".bashrc").write_text("# operator\nexport EDITOR=vi\n", encoding="utf-8")
    repo = tmp_path / "repo"
    _seed_shim(repo, windows=False)
    chosen = tmp_path / "local-bin"
    monkeypatch.setattr(os, "symlink", lambda *_args, **_kwargs: (_ for _ in ()).throw(OSError("no symlink")))
    chmod_modes: list[int] = []
    real_chmod = os.chmod

    def _record_chmod(path, mode):
        chmod_modes.append(mode)
        return real_chmod(path, mode)

    monkeypatch.setattr(os, "chmod", _record_chmod)
    ok, token = srl.register_itsm_user_path(
        str(repo),
        str(chosen),
        platform_name="posix",
        home=str(home),
    )
    assert ok is True and token == "ITSM_PATH_REGISTER_OK"
    assert 0o755 in chmod_modes
    snippet = home / ".config" / "its-magic" / "itsm-path.sh"
    text = snippet.read_text(encoding="utf-8")
    resolved = os.path.abspath(str(chosen))
    assert text == (
        "# its-magic:itsm-path:begin\n"
        f'export PATH="{resolved}:$PATH"\n'
        "# its-magic:itsm-path:end\n"
    )
    assert not (home / ".profile").exists()
    bashrc = (home / ".bashrc").read_text(encoding="utf-8")
    assert bashrc.count("its-magic:itsm-path:source") == 1
    assert bashrc.startswith("# operator\nexport EDITOR=vi\n")

    ok, token = srl.register_itsm_user_path(
        str(repo),
        str(chosen),
        platform_name="posix",
        home=str(home),
    )
    assert ok is True and token == "ITSM_PATH_REGISTER_OK"
    assert snippet.read_text(encoding="utf-8") == text
    assert not (home / ".profile").exists()
    assert (home / ".bashrc").read_text(encoding="utf-8").count("its-magic:itsm-path:source") == 1


def test_us0149_unregister_removes_only_owned_entry(tmp_path: Path) -> None:
    home = tmp_path / "home"
    home.mkdir()
    repo = tmp_path / "repo-a"
    other = tmp_path / "repo-b"
    other.mkdir()
    _seed_shim(repo, windows=True)
    chosen = tmp_path / "bin"
    chosen.mkdir()
    (chosen / "keep.cmd").write_text("keep\n", encoding="utf-8")
    prefix = r"C:\Windows;C:\Other"
    chosen_abs = os.path.abspath(str(chosen))
    store = FakePathStore(prefix, "REG_EXPAND_SZ")
    ok, _token = srl.register_itsm_user_path(
        str(repo),
        str(chosen),
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        path_store=store,
    )
    assert ok is True
    added_value = prefix + ";" + chosen_abs
    assert store.value == added_value

    srl.uninstall_standalone(
        str(other),
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        path_store=store,
    )
    assert store.value == added_value
    assert (chosen / "itsm.cmd").is_file()
    assert _ledger(home, "nt").is_file()

    ok, token = srl.unregister_itsm_user_path(
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        path_store=store,
    )
    assert ok is True and token == "ITSM_PATH_UNREGISTER_OK"
    assert store.value == prefix
    assert not (chosen / "itsm").exists()
    assert not (chosen / "itsm.cmd").exists()
    assert (chosen / "keep.cmd").is_file()
    assert not _ledger(home, "nt").exists()

    pre = FakePathStore(r"C:\Windows;" + chosen_abs + r";C:\Other", "REG_SZ")
    (chosen / "keep.cmd").write_text("keep\n", encoding="utf-8")
    ok, _token = srl.register_itsm_user_path(
        str(repo),
        str(chosen),
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        path_store=pre,
    )
    assert ok is True
    ledger = json.loads(_ledger(home, "nt").read_text(encoding="utf-8"))
    assert ledger["path_entry_added"] is False
    assert pre.writes == []
    ok, token = srl.unregister_itsm_user_path(
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        path_store=pre,
    )
    assert ok is True and token == "ITSM_PATH_UNREGISTER_OK"
    assert pre.value == r"C:\Windows;" + chosen_abs + r";C:\Other"
    assert (chosen / "keep.cmd").is_file()
    assert not (chosen / "itsm").exists()


def test_us0149_register_fail_closed_on_write_error(tmp_path: Path) -> None:
    home = tmp_path / "home"
    home.mkdir()
    repo = tmp_path / "repo"
    _seed_shim(repo, windows=True)
    chosen = tmp_path / "chosen"
    original = r"C:\Windows;C:\Other"
    store = FakePathStore(original, "REG_EXPAND_SZ", fail=True)
    ok, token = srl.register_itsm_user_path(
        str(repo),
        str(chosen),
        platform_name="nt",
        home=str(home),
        userprofile=str(home),
        path_store=store,
    )
    assert ok is False
    assert token == "ITSM_PATH_REGISTER_FAILED"
    assert store.value == original
    assert store.value_type == "REG_EXPAND_SZ"
    assert store.writes == []
    assert not (chosen / "itsm").exists()
    assert not (chosen / "itsm.cmd").exists()
    assert not _ledger(home, "nt").exists()


def test_us0149_runbook_path_section_parity() -> None:
    active = _section(RUNBOOK.read_text(encoding="utf-8"))
    template = _section(TEMPLATE_RUNBOOK.read_text(encoding="utf-8"))
    assert active == template
    for token in PATH_TOKENS:
        assert token in active
    for readme in (README, TEMPLATE_README):
        text = readme.read_text(encoding="utf-8")
        assert "npm install -g --prefix" in text
        assert "ITS_MAGIC_REGISTER_ITSM_PATH" in text
        assert "--register-itsm-path" in text
