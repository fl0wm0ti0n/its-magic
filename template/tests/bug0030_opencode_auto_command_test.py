"""BUG-0030: OpenCode 1.18.32 `/auto` uses the documented Markdown command."""

from __future__ import annotations

import json
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))
import installer  # noqa: E402

ACTIVE_COMMAND = REPO_ROOT / ".opencode" / "commands" / "auto.md"
TEMPLATE_COMMAND = REPO_ROOT / "template" / ".opencode" / "commands" / "auto.md"
ACTIVE_TUI = REPO_ROOT / ".opencode" / "tui.json"
TEMPLATE_TUI = REPO_ROOT / "template" / ".opencode" / "tui.json"
LEGACY_RELS = (
    ".opencode/plugins/its-magic-auto/index.ts",
    ".opencode/plugins/its-magic-auto/tui.ts",
    ".opencode/plugins/its-magic-auto/rpc.ts",
)
PARITY = REPO_ROOT / "scripts" / "check_intake_template_parity.py"


def _opencode_command(*args: str) -> list[str]:
    executable = shutil.which("opencode") or shutil.which("opencode.ps1")
    if not executable:
        pytest.skip("opencode is not on PATH")
    if executable.lower().endswith(".ps1"):
        return ["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", executable, *args]
    return [executable, *args]


def _unused_port() -> int:
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        return int(probe.getsockname()[1])


def _json_request(url: str, payload: dict | None = None) -> object:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"} if data else {},
        method="POST" if data else "GET",
    )
    with urllib.request.urlopen(request, timeout=15) as response:
        return json.load(response)


def test_bug0030_auto_command_selects_agent_and_is_not_stop_only():
    """AC-1/AC-2: the documented command selects the spawn-only auto agent."""
    for path in (ACTIVE_COMMAND, TEMPLATE_COMMAND):
        text = path.read_text(encoding="utf-8")
        assert text.startswith("---\n")
        assert "agent: auto" in text.split("---", 2)[1]
        assert "spawn-only" in text
        assert text.strip() != "STOP"


def test_bug0030_private_route_is_not_active():
    """AC-3: no private TUI/RPC path remains configured for `/auto`."""
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        data = json.loads(installer._strip_jsonc(path.read_text(encoding="utf-8")))
        assert "./plugins/its-magic-auto/tui.ts" not in data.get("plugin", [])
    for rel in LEGACY_RELS:
        assert not (REPO_ROOT / rel).exists()
        assert not (REPO_ROOT / "template" / rel).exists()
    plugin = (REPO_ROOT / ".opencode" / "plugins" / "orchestrator.ts").read_text(
        encoding="utf-8"
    )
    assert 'import { ITS_MAGIC_AUTO_RPC }' not in plugin
    assert "ctx.rpc.register" not in plugin.split("const plugin = Plugin.define", 1)[1]


def test_bug0030_upgrade_copies_command_and_removes_only_legacy_route():
    """AC-5: upgrades preserve unrelated TUI settings while removing the old entry."""
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        source = root / "source"
        target = root / "target"
        source_command = source / ".opencode" / "commands" / "auto.md"
        source_tui = source / ".opencode" / "tui.json"
        source_command.parent.mkdir(parents=True)
        source_command.write_text(ACTIVE_COMMAND.read_text(encoding="utf-8"), encoding="utf-8")
        source_tui.parent.mkdir(parents=True, exist_ok=True)
        source_tui.write_text('{"plugin": []}\n', encoding="utf-8")

        legacy = target / LEGACY_RELS[0]
        legacy.parent.mkdir(parents=True)
        legacy.write_text("legacy\n", encoding="utf-8")
        target_tui = target / ".opencode" / "tui.json"
        target_tui.write_text(
            '{"theme": "operator", "plugin": ["./plugins/its-magic-auto/tui.ts", "other"]}\n',
            encoding="utf-8",
        )

        assert installer.copy_opencode_auto_listing_surface(str(target), str(source), "opencode") == "copied"
        assert (target / ".opencode" / "commands" / "auto.md").read_text(encoding="utf-8") == ACTIVE_COMMAND.read_text(encoding="utf-8")
        assert installer.copy_or_merge_opencode_tui_json(str(target), str(source), "opencode") == "removed"
        assert installer.remove_legacy_opencode_auto_route(str(target), "opencode") == "removed"
        data = json.loads(installer._strip_jsonc(target_tui.read_text(encoding="utf-8")))
        assert data["theme"] == "operator"
        assert data["plugin"] == ["other"]
        assert not legacy.exists()


def test_bug0030_active_template_parity():
    """AC-5: the managed command and migration documentation stay aligned."""
    proc = subprocess.run(
        [sys.executable, str(PARITY), "--repo", str(REPO_ROOT), "--scope", "bug-0030"],
        check=False,
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )
    assert proc.returncode == 0, proc.stdout + proc.stderr


@pytest.mark.skipif(
    os.environ.get("ITS_MAGIC_OPENCODE_SMOKE") != "1",
    reason="set ITS_MAGIC_OPENCODE_SMOKE=1 to run the local OpenCode host smoke test",
)
def test_bug0030_opencode_host_admits_auto_command():
    """AC-1/AC-4: the real host exposes `/auto` as the `auto` agent command."""
    version = subprocess.run(
        _opencode_command("--version"), check=False, capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert version.returncode == 0, version.stderr
    assert version.stdout.strip() == "1.18.32"

    port = _unused_port()
    server = subprocess.Popen(
        _opencode_command("serve", "--hostname", "127.0.0.1", "--port", str(port)),
        cwd=REPO_ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        deadline = time.monotonic() + 15
        while True:
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{port}/command", timeout=1) as response:
                    commands = json.load(response)
                break
            except OSError:
                if time.monotonic() >= deadline:
                    raise AssertionError("OpenCode host did not start its command endpoint")
                time.sleep(0.2)
        auto = next((command for command in commands if command.get("name") == "auto"), None)
        assert auto is not None
        assert auto["source"] == "command"
        assert auto["agent"] == "auto"
        assert "spawn-only" in auto["template"]
    finally:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()
            server.wait(timeout=5)


@pytest.mark.skipif(
    os.environ.get("ITS_MAGIC_OPENCODE_SESSION_SMOKE") != "1",
    reason="set ITS_MAGIC_OPENCODE_SESSION_SMOKE=1 with a valid provider to test prompt admission",
)
def test_bug0030_opencode_host_session_command_admits_auto_prompt():
    """AC-4: `session.command` selects `auto` and durably admits its prompt."""
    model = os.environ.get("ITS_MAGIC_OPENCODE_SMOKE_MODEL", "").strip()
    if not model:
        pytest.skip("set ITS_MAGIC_OPENCODE_SMOKE_MODEL to a configured provider/model")
    port = _unused_port()
    server = subprocess.Popen(
        _opencode_command("serve", "--hostname", "127.0.0.1", "--port", str(port)),
        cwd=REPO_ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    base_url = f"http://127.0.0.1:{port}"
    try:
        deadline = time.monotonic() + 15
        while True:
            try:
                _json_request(f"{base_url}/command")
                break
            except OSError:
                if time.monotonic() >= deadline:
                    raise AssertionError("OpenCode host did not start its command endpoint")
                time.sleep(0.2)
        session = _json_request(f"{base_url}/session", {})
        assert isinstance(session, dict) and isinstance(session.get("id"), str)
        session_id = session["id"]
        command_error: list[BaseException] = []

        def invoke_command() -> None:
            try:
                _json_request(
                    f"{base_url}/session/{session_id}/command",
                    {"command": "auto", "arguments": "", "model": model},
                )
            except BaseException as error:
                command_error.append(error)

        threading.Thread(target=invoke_command, daemon=True).start()
        deadline = time.monotonic() + 15
        while True:
            messages = _json_request(f"{base_url}/session/{session_id}/message")
            serialized_messages = json.dumps(messages)
            if "Begin the canonical its-magic auto orchestration lifecycle." in serialized_messages:
                break
            if command_error:
                error = command_error[0]
                if isinstance(error, urllib.error.HTTPError):
                    detail = error.read().decode("utf-8", errors="replace")
                    raise AssertionError(
                        "session.command could not admit /auto; configure a valid OpenCode provider before running this smoke: "
                        f"HTTP {error.code} {detail}"
                    ) from error
                raise AssertionError(f"session.command failed before prompt admission: {error}") from error
            if time.monotonic() >= deadline:
                raise AssertionError("session.command did not durably admit the /auto prompt within 15 seconds")
            time.sleep(0.2)
        assert '"agent": "auto"' in serialized_messages
    finally:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()
            server.wait(timeout=5)
