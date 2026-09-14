"""BUG-0023 OpenCode CLI TUI dispatch Rpc.define — 8 markers.

Markers per architecture.md # BUG-0023 / R-0137 DQ7 / sprints/S0148/tasks.md.
Mock invoke / fixture only — no live OpenCode CLI TUI probe.
Do not weaken tests/bug0021_* except compose-only comments that
`"api.client.rpc" in src` is not dispatch proof. Keep bug0020/0019/0018.
"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))
import installer  # noqa: E402

ACTIVE_AUTO_MD = REPO_ROOT / ".opencode" / "commands" / "auto.md"
TEMPLATE_AUTO_MD = REPO_ROOT / "template" / ".opencode" / "commands" / "auto.md"
ACTIVE_PLUGIN = REPO_ROOT / ".opencode" / "plugins" / "orchestrator.ts"
TEMPLATE_PLUGIN = REPO_ROOT / "template" / ".opencode" / "plugins" / "orchestrator.ts"
ACTIVE_INDEX = REPO_ROOT / ".opencode" / "plugins" / "its-magic-auto" / "index.ts"
TEMPLATE_INDEX = REPO_ROOT / "template" / ".opencode" / "plugins" / "its-magic-auto" / "index.ts"
ACTIVE_TUI = REPO_ROOT / ".opencode" / "plugins" / "its-magic-auto" / "tui.ts"
TEMPLATE_TUI = REPO_ROOT / "template" / ".opencode" / "plugins" / "its-magic-auto" / "tui.ts"
ACTIVE_RPC = REPO_ROOT / ".opencode" / "plugins" / "its-magic-auto" / "rpc.ts"
TEMPLATE_RPC = REPO_ROOT / "template" / ".opencode" / "plugins" / "its-magic-auto" / "rpc.ts"
ACTIVE_AGENT_AUTO = REPO_ROOT / ".opencode" / "agents" / "auto.md"
CURSOR_AUTO_MD = REPO_ROOT / ".cursor" / "commands" / "auto.md"
RUNBOOK = REPO_ROOT / "docs" / "engineering" / "runbook.md"
TEMPLATE_RUNBOOK = REPO_ROOT / "template" / "docs" / "engineering" / "runbook.md"
INSTALLER_PY = REPO_ROOT / "installer.py"
INSTALLER_SH = REPO_ROOT / "installer.sh"
INSTALLER_PS1 = REPO_ROOT / "installer.ps1"
MANIFEST = REPO_ROOT / "docs" / "engineering" / "context" / "installer-owned-paths.manifest"
TEMPLATE_MANIFEST = (
    REPO_ROOT / "template" / "docs" / "engineering" / "context" / "installer-owned-paths.manifest"
)
HARNESS = REPO_ROOT / "tests" / "bug0023_dispatch_harness.mjs"
TEMPLATE_HARNESS = REPO_ROOT / "template" / "tests" / "bug0023_dispatch_harness.mjs"

DISPATCH_UNSUPPORTED = "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED"
LISTING_UNSUPPORTED = "OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED"
LOAD_UNSUPPORTED = "OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED"
DESKTOP_TOKEN = "OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED"
COLLISION = "OPENCODE_AUTO_MARKDOWN_COLLISION"
INVENTED_POST_URL = "/rpc/its-magic.auto/runAutoLifecycle"
INVENTED_POST_BODY = "body: { input: payload }"


def _run_harness(scenario: str) -> dict:
    assert HARNESS.is_file(), "mock-invoke harness missing"
    proc = subprocess.run(
        ["node", str(HARNESS), scenario],
        check=False,
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )
    assert proc.returncode == 0, proc.stderr or proc.stdout
    return json.loads(proc.stdout)


def test_bug0023_rpc_define_shared_contract():
    """Marker 1: ITS_MAGIC_AUTO_RPC is Rpc.define with id its-magic.auto."""
    for path in (ACTIVE_RPC, TEMPLATE_RPC):
        src = path.read_text(encoding="utf-8")
        assert "Rpc.define" in src
        assert '@opencode/plugin/rpc' in src
        assert 'id: "its-magic.auto"' in src
        assert "runAutoLifecycle" in src
        assert "sessionID" in src
        assert "reasonCode" in src
        assert "export const ITS_MAGIC_AUTO_RPC = {" not in src
        assert "Zod" not in src or "no Zod" in src
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert "ITS_MAGIC_AUTO_RPC" in src
        assert 'await import("./rpc.ts")' in src
        assert "from \"./rpc.ts\"" not in src.split("dispatchRunAutoLifecycle")[0]
    for path in (ACTIVE_PLUGIN, TEMPLATE_PLUGIN):
        src = path.read_text(encoding="utf-8")
        assert 'from "./its-magic-auto/rpc.ts"' in src
        assert "ITS_MAGIC_AUTO_RPC" in src
        assert "Rpc.define" not in src or "its-magic-auto/rpc.ts" in src


def test_bug0023_dispatch_mock_invokes_runAutoLifecycle():
    """Marker 2: mock client.rpc(Defined).runAutoLifecycle is actually invoked."""
    out = _run_harness("client-rpc")
    assert out.get("ok") is True
    assert out.get("invoked") == "client.rpc"
    calls = out.get("calls") or {}
    assert calls.get("rpc"), "runAutoLifecycle was not invoked"
    payload = calls["rpc"][0]["payload"]
    assert payload.get("sessionID") == "sess-1"
    assert payload.get("prompt") == "go"
    assert "input" not in payload
    assert not calls.get("post")
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert "dispatchRunAutoLifecycle" in src
        assert "rpc.runAutoLifecycle(payload)" in src
        assert "api.client.rpc" in src
        assert "runAutoLifecycle({ input" not in src


def test_bug0023_http_fallback_is_client_rpc_not_invented_post():
    """Marker 3: fallback is OpenCode.make().rpc; invented POST is not happy path."""
    out = _run_harness("make-fallback")
    assert out.get("ok") is True
    assert out.get("invoked") == "OpenCode.make"
    calls = out.get("calls") or {}
    assert calls.get("make")
    assert calls["make"][0]["baseUrl"] == "http://connected.example:4096"
    assert calls.get("rpc")
    assert calls["rpc"][0]["payload"].get("prompt") == "go"
    assert "input" not in calls["rpc"][0]["payload"]
    ignored = _run_harness("post-ignored")
    assert ignored.get("ok") is False
    assert ignored.get("reasonCode") == DISPATCH_UNSUPPORTED
    assert (ignored.get("calls") or {}).get("post") == [{"ignored": True}]
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert "OpenCode.make" in src
        assert "@opencode/client" in src
        assert INVENTED_POST_URL not in src
        assert INVENTED_POST_BODY not in src
        assert "localhost:4096" not in src or "Do not silent-default" in src


def test_bug0023_orchestrator_await_register_defined_rpc():
    """Marker 4: await ctx.rpc.register(Defined, { runAutoLifecycle }); keep editor.add."""
    for path in (ACTIVE_PLUGIN, TEMPLATE_PLUGIN):
        src = path.read_text(encoding="utf-8")
        assert "await ctx.rpc.register(ITS_MAGIC_AUTO_RPC" in src
        assert "runAutoLifecycle: runAutoLifecycleRpc" in src
        assert "void registered" not in src
        assert "editor.add" in src
        assert 'name: "auto"' in src
        assert "runAutoLifecycle" in src
        compact = "".join(src.split())
        assert "awaitctx.rpc.register(ITS_MAGIC_AUTO_RPC,{runAutoLifecycle:runAutoLifecycleRpc" in compact
    for path in (ACTIVE_INDEX, TEMPLATE_INDEX):
        src = path.read_text(encoding="utf-8")
        assert "editor.add" not in src
        assert "tui:" not in src


def test_bug0023_keep_editor_add_no_auto_md():
    """Marker 5: compose C/D — editor.add present; no OpenCode auto.md; no JSON template."""
    assert not ACTIVE_AUTO_MD.exists(), "must not restore .opencode/commands/auto.md"
    assert not TEMPLATE_AUTO_MD.exists(), "must not restore template .opencode/commands/auto.md"
    assert ACTIVE_AGENT_AUTO.is_file(), ".opencode/agents/auto.md must remain"
    assert CURSOR_AUTO_MD.is_file(), ".cursor/commands/auto.md must remain"
    plugin = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert "editor.add({" in plugin
    assert 'name: "auto"' in plugin
    roots = [REPO_ROOT / ".opencode", REPO_ROOT / "template" / ".opencode"]
    candidates: list[Path] = []
    for root in roots:
        if root.is_dir():
            candidates.extend(root.rglob("*.json"))
            candidates.extend(root.rglob("*.jsonc"))
    for name in ("opencode.json", "opencode.jsonc", "cli.json"):
        candidates.append(REPO_ROOT / name)
        candidates.append(REPO_ROOT / "template" / name)
        candidates.append(REPO_ROOT / ".opencode" / name)
        candidates.append(REPO_ROOT / "template" / ".opencode" / name)
    for path in candidates:
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        try:
            data = json.loads(installer._strip_jsonc(text))
        except (json.JSONDecodeError, TypeError, ValueError):
            data = None
        if not isinstance(data, dict):
            continue
        commands = data.get("commands") or data.get("command") or {}
        if isinstance(commands, dict):
            auto = commands.get("auto")
            if isinstance(auto, dict) and "template" in auto:
                raise AssertionError(f"JSON commands.auto template forbidden: {path}")


def test_bug0023_dispatch_token_only_when_rpc_absent():
    """Marker 6: DISPATCH toast only when client/RPC truly absent."""
    missing = _run_harness("missing-client")
    assert missing.get("ok") is False
    assert missing.get("reasonCode") == DISPATCH_UNSUPPORTED
    absent = _run_harness("absent-rpc")
    assert absent.get("ok") is False
    assert absent.get("reasonCode") == DISPATCH_UNSUPPORTED
    happy = _run_harness("client-rpc")
    assert happy.get("ok") is True
    assert happy.get("reasonCode") != DISPATCH_UNSUPPORTED or happy.get("invoked") == "client.rpc"
    assert DISPATCH_UNSUPPORTED != LISTING_UNSUPPORTED
    assert DISPATCH_UNSUPPORTED != LOAD_UNSUPPORTED
    assert DISPATCH_UNSUPPORTED != DESKTOP_TOKEN
    assert DISPATCH_UNSUPPORTED != COLLISION
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert DISPATCH_UNSUPPORTED in src
        compact = src.replace(" ", "")
        assert f"{LISTING_UNSUPPORTED}={DISPATCH_UNSUPPORTED}" not in compact
        assert f"{LOAD_UNSUPPORTED}={DISPATCH_UNSUPPORTED}" not in compact
        assert f"{DESKTOP_TOKEN}={DISPATCH_UNSUPPORTED}" not in compact
        assert f"{COLLISION}={DISPATCH_UNSUPPORTED}" not in compact
        dispatch_idx = src.index("export async function dispatchRunAutoLifecycle")
        body = src[dispatch_idx:]
        assert LISTING_UNSUPPORTED not in body.split("function registerSlashListing")[0]
        assert LOAD_UNSUPPORTED not in body.split("function registerSlashListing")[0]
        assert COLLISION not in body.split("function registerSlashListing")[0]
    runbook = RUNBOOK.read_text(encoding="utf-8")
    assert DISPATCH_UNSUPPORTED in runbook
    lowered = runbook.lower()
    assert "dispatch" in lowered and ("defect" in lowered or "not success" in lowered or "not the happy path" in lowered)


def test_bug0023_active_template_parity():
    """Marker 7: rpc.ts / dispatch-path tui.ts / orchestrator / no-auto.md byte-parity."""
    assert not ACTIVE_AUTO_MD.exists()
    assert not TEMPLATE_AUTO_MD.exists()
    assert ACTIVE_RPC.is_file() and TEMPLATE_RPC.is_file()
    assert ACTIVE_RPC.read_bytes() == TEMPLATE_RPC.read_bytes()
    assert ACTIVE_TUI.is_file() and TEMPLATE_TUI.is_file()
    assert ACTIVE_TUI.read_bytes() == TEMPLATE_TUI.read_bytes()
    assert ACTIVE_PLUGIN.read_bytes() == TEMPLATE_PLUGIN.read_bytes()
    assert ACTIVE_INDEX.read_bytes() == TEMPLATE_INDEX.read_bytes()
    assert RUNBOOK.is_file() and TEMPLATE_RUNBOOK.is_file()
    assert RUNBOOK.read_bytes() == TEMPLATE_RUNBOOK.read_bytes()
    assert MANIFEST.is_file() and TEMPLATE_MANIFEST.is_file()
    assert MANIFEST.read_bytes() == TEMPLATE_MANIFEST.read_bytes()
    this_file = Path(__file__).resolve()
    template_test = REPO_ROOT / "template" / "tests" / this_file.name
    assert template_test.is_file()
    assert this_file.read_bytes() == template_test.read_bytes()
    assert HARNESS.is_file() and TEMPLATE_HARNESS.is_file()
    assert HARNESS.read_bytes() == TEMPLATE_HARNESS.read_bytes()
    for path in (ACTIVE_RPC, TEMPLATE_RPC, ACTIVE_TUI, TEMPLATE_TUI):
        assert "ITS_MAGIC_AUTO_RPC" in path.read_text(encoding="utf-8")


def test_bug0023_upgrade_copies_dispatch_still_prunes_auto_md():
    """Marker 8: upgrade overwrites rpc.ts/tui.ts/orchestrator; still prunes auto.md."""
    py = INSTALLER_PY.read_text(encoding="utf-8")
    sh = INSTALLER_SH.read_text(encoding="utf-8")
    ps1 = INSTALLER_PS1.read_text(encoding="utf-8")
    assert "def copy_opencode_auto_listing_surface" in py
    assert ".opencode/plugins/its-magic-auto/rpc.ts" in py
    assert ".opencode/plugins/orchestrator.ts" in py
    assert "shutil.copy2" in py
    assert "copy_opencode_auto_listing_surface" in sh
    assert "its-magic-auto/rpc.ts" in sh
    assert "cp -f" in sh
    assert "Invoke-CopyOpencodeAutoListingSurface" in ps1
    assert "its-magic-auto/rpc.ts" in ps1
    assert "Copy-Item" in ps1 and "-Force" in ps1
    assert "def prune_retired_opencode_auto_md" in py
    assert "prune_retired_opencode_auto_md" in sh
    assert "Invoke-PruneRetiredOpencodeAutoMd" in ps1
    assert COLLISION in py and COLLISION in sh and COLLISION in ps1
    manifest = MANIFEST.read_text(encoding="utf-8")
    assert "template/.opencode/plugins/its-magic-auto/rpc.ts" in manifest
    assert "template/.opencode/plugins/its-magic-auto/tui.ts" in manifest

    stale_tui = "export const ITS_MAGIC_AUTO_RPC = { id: 'plain-json' };\n"
    new_tui = 'await import("./rpc.ts");\nclient.rpc(Defined).runAutoLifecycle(payload);\n'
    stale_rpc = "export const ITS_MAGIC_AUTO_RPC = { id: 'old' };\n"
    new_rpc = 'export const ITS_MAGIC_AUTO_RPC = Rpc.define({ id: "its-magic.auto" });\n'
    stale_orch = "ctx.rpc.register(PLAIN, { runAutoLifecycle });\n"
    new_orch = "await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle: runAutoLifecycleRpc });\n"

    with tempfile.TemporaryDirectory() as tmp:
        target = Path(tmp) / "consumer"
        source = Path(tmp) / "kit"
        leftover = target / ".opencode" / "commands" / "auto.md"
        agent = target / ".opencode" / "agents" / "auto.md"
        cursor_auto = target / ".cursor" / "commands" / "auto.md"
        leftover.parent.mkdir(parents=True)
        leftover.write_text("STOP\n", encoding="utf-8")
        agent.parent.mkdir(parents=True)
        agent.write_text("agent\n", encoding="utf-8")
        cursor_auto.parent.mkdir(parents=True)
        cursor_auto.write_text("cursor auto\n", encoding="utf-8")

        src_index = source / ".opencode" / "plugins" / "its-magic-auto" / "index.ts"
        src_tui = source / ".opencode" / "plugins" / "its-magic-auto" / "tui.ts"
        src_rpc = source / ".opencode" / "plugins" / "its-magic-auto" / "rpc.ts"
        src_orch = source / ".opencode" / "plugins" / "orchestrator.ts"
        src_index.parent.mkdir(parents=True)
        src_index.write_text("listing-index\n", encoding="utf-8")
        src_tui.write_text(new_tui, encoding="utf-8")
        src_rpc.write_text(new_rpc, encoding="utf-8")
        src_orch.parent.mkdir(parents=True, exist_ok=True)
        src_orch.write_text(new_orch, encoding="utf-8")

        dst_tui = target / ".opencode" / "plugins" / "its-magic-auto" / "tui.ts"
        dst_rpc = target / ".opencode" / "plugins" / "its-magic-auto" / "rpc.ts"
        dst_orch = target / ".opencode" / "plugins" / "orchestrator.ts"
        dst_tui.parent.mkdir(parents=True)
        dst_tui.write_text(stale_tui, encoding="utf-8")
        dst_rpc.write_text(stale_rpc, encoding="utf-8")
        dst_orch.parent.mkdir(parents=True, exist_ok=True)
        dst_orch.write_text(stale_orch, encoding="utf-8")

        skipped = installer.copy_opencode_auto_listing_surface(str(target), str(source), "cursor")
        assert skipped == "skipped-host"
        assert dst_tui.read_text(encoding="utf-8") == stale_tui
        assert dst_rpc.read_text(encoding="utf-8") == stale_rpc

        result = installer.copy_opencode_auto_listing_surface(str(target), str(source), "opencode")
        assert result == "copied"
        assert dst_tui.read_text(encoding="utf-8") == new_tui
        assert dst_rpc.read_text(encoding="utf-8") == new_rpc
        assert dst_orch.read_text(encoding="utf-8") == new_orch
        assert leftover.is_file(), "copy helper must not prune leftover auto.md itself"

        both_target = Path(tmp) / "consumer-both"
        both_rpc = both_target / ".opencode" / "plugins" / "its-magic-auto" / "rpc.ts"
        both_rpc.parent.mkdir(parents=True)
        both_rpc.write_text(stale_rpc, encoding="utf-8")
        assert installer.copy_opencode_auto_listing_surface(str(both_target), str(source), "both") == "copied"
        assert both_rpc.read_text(encoding="utf-8") == new_rpc

        pruned = installer.prune_retired_opencode_auto_md(str(target), str(source), "opencode")
        assert pruned == "pruned"
        assert not leftover.exists()
        assert agent.is_file()
        assert cursor_auto.is_file()
