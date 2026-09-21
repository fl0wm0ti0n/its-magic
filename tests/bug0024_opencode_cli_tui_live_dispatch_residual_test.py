"""BUG-0024 OpenCode CLI TUI live-dispatch residual — 8 markers.

Markers per architecture.md # BUG-0024 / R-0140 DQ8 / sprints/S0159/tasks.md.
Mock invoke / fixture only — no live OpenCode CLI TUI probe (UAT_PROBE_FORBIDDEN).
Do not weaken tests/bug0023_* / 0021 / 0020 / 0019 / 0018 except compose-only.
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
HARNESS = REPO_ROOT / "tests" / "bug0024_dispatch_harness.mjs"
TEMPLATE_HARNESS = REPO_ROOT / "template" / "tests" / "bug0024_dispatch_harness.mjs"
PARITY = REPO_ROOT / "scripts" / "check_intake_template_parity.py"

DISPATCH_UNSUPPORTED = "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED"
MISSING_CLIENT = "OPENCODE_AUTO_TUI_MISSING_CLIENT"
RPC_ABSENT = "OPENCODE_AUTO_TUI_RPC_ABSENT"
DEFINED_UNBRANDED = "OPENCODE_AUTO_TUI_DEFINED_UNBRANDED"
MAKE_UNREACHABLE = "OPENCODE_AUTO_TUI_MAKE_UNREACHABLE"
REGISTER_SKIPPED = "OPENCODE_AUTO_TUI_REGISTER_SKIPPED"
LISTING_UNSUPPORTED = "OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED"
LOAD_UNSUPPORTED = "OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED"
DESKTOP_TOKEN = "OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED"
COLLISION = "OPENCODE_AUTO_MARKDOWN_COLLISION"


def _run_harness(scenario: str) -> dict:
    assert HARNESS.is_file(), "bug0024 mock-invoke harness missing"
    proc = subprocess.run(
        ["node", str(HARNESS), scenario],
        check=False,
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )
    assert proc.returncode == 0, proc.stderr or proc.stdout
    return json.loads(proc.stdout)


def test_bug0024_run_missing_api_client_distinct_code():
    """Marker 1: { api } without api.client → MISSING_CLIENT (not silent umbrella-only)."""
    out = _run_harness("missing-client")
    assert out.get("ok") is False
    assert out.get("reasonCode") == MISSING_CLIENT
    assert out.get("reasonCode") != DISPATCH_UNSUPPORTED
    toasts = (out.get("calls") or {}).get("toasts") or []
    assert MISSING_CLIENT in toasts
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert MISSING_CLIENT in src
        assert "MISSING_CLIENT" in src or MISSING_CLIENT in src
        # fail-closed branch must not be catch-all DISPATCH alone for missing client
        assert "return failStage(context, MISSING_CLIENT)" in src or (
            "failStage(context, MISSING_CLIENT)" in src
        )


def test_bug0024_local_unbranded_defined_not_happy_path():
    """Marker 2: identity-define Defined is not TUI success → DEFINED_UNBRANDED."""
    out = _run_harness("unbranded-defined")
    assert out.get("ok") is False
    assert out.get("reasonCode") == DEFINED_UNBRANDED
    assert out.get("invoked") is None
    assert not (out.get("calls") or {}).get("rpc")
    for path in (ACTIVE_RPC, TEMPLATE_RPC):
        src = path.read_text(encoding="utf-8")
        assert "ITS_MAGIC_AUTO_RPC_PEER_BRANDED" in src
        assert '@opencode/plugin/rpc' in src
        assert "localRpcDefine" in src or "local define" in src.lower()
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert DEFINED_UNBRANDED in src
        assert "ITS_MAGIC_AUTO_RPC_PEER_BRANDED" in src
        assert "peerBranded" in src


def test_bug0024_register_skipped_observable():
    """Marker 3: absent ctx.rpc.register surfaces REGISTER_SKIPPED (not silent)."""
    out = _run_harness("register-skipped")
    assert out.get("emitted") is True
    assert out.get("reasonCode") == REGISTER_SKIPPED
    assert out.get("notices") or out.get("marker")
    for path in (ACTIVE_PLUGIN, TEMPLATE_PLUGIN):
        src = path.read_text(encoding="utf-8")
        assert "emitAutoTuiRegisterSkipped" in src
        assert REGISTER_SKIPPED in src
        assert "await ctx.rpc.register(ITS_MAGIC_AUTO_RPC" in src
        assert "editor.add" in src
        assert 'name: "auto"' in src
        # else branch when register absent — not silent continue
        assert "emitAutoTuiRegisterSkipped(ctx)" in src


def test_bug0024_make_unreachable_without_baseurl():
    """Marker 4: no .rpc + no baseUrl → MAKE_UNREACHABLE; never invent localhost."""
    out = _run_harness("make-unreachable")
    assert out.get("ok") is False
    assert out.get("reasonCode") == MAKE_UNREACHABLE
    assert out.get("reasonCode") != DISPATCH_UNSUPPORTED
    toasts = (out.get("calls") or {}).get("toasts") or []
    assert MAKE_UNREACHABLE in toasts
    assert RPC_ABSENT in toasts  # observable before make limb
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert MAKE_UNREACHABLE in src
        assert 'baseUrl = "http://localhost:4096"' not in src
        assert 'baseUrl="http://localhost:4096"' not in src.replace(" ", "")
        assert "silent-default" in src.lower() or "Never invent" in src or "never invent" in src.lower()


def test_bug0024_swallowed_rpc_error_not_only_dispatch():
    """Marker 5: client.rpc throw → stage code before umbrella DISPATCH."""
    out = _run_harness("swallowed-rpc")
    assert out.get("ok") is False
    assert out.get("reasonCode") == MAKE_UNREACHABLE
    assert out.get("reasonCode") != DISPATCH_UNSUPPORTED
    calls = out.get("calls") or {}
    assert calls.get("rpc"), "rpc throw must be observed before stage"
    happy = _run_harness("branded-client-rpc")
    assert happy.get("ok") is True
    assert happy.get("invoked") == "client.rpc"
    make_ok = _run_harness("rpc-absent-make")
    assert make_ok.get("ok") is True
    assert make_ok.get("invoked") == "OpenCode.make"
    toasts = (make_ok.get("calls") or {}).get("toasts") or []
    assert RPC_ABSENT in toasts
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert DISPATCH_UNSUPPORTED in src
        assert MAKE_UNREACHABLE in src
        # DISPATCH only as umbrella after limbs
        assert "failStage(context, DISPATCH_UNSUPPORTED)" in src
        assert DISPATCH_UNSUPPORTED != LISTING_UNSUPPORTED
        assert DISPATCH_UNSUPPORTED != LOAD_UNSUPPORTED
        assert DISPATCH_UNSUPPORTED != DESKTOP_TOKEN
        assert DISPATCH_UNSUPPORTED != COLLISION


def test_bug0024_keep_editor_add_no_auto_md():
    """Marker 6: compose D3/D4/D5 — editor.add; no OpenCode auto.md; no JSON template."""
    assert not ACTIVE_AUTO_MD.exists(), "must not restore .opencode/commands/auto.md"
    assert not TEMPLATE_AUTO_MD.exists(), "must not restore template .opencode/commands/auto.md"
    assert ACTIVE_AGENT_AUTO.is_file(), ".opencode/agents/auto.md must remain"
    assert CURSOR_AUTO_MD.is_file(), ".cursor/commands/auto.md must remain"
    plugin = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert "editor.add({" in plugin
    assert 'name: "auto"' in plugin
    for path in (ACTIVE_INDEX, TEMPLATE_INDEX):
        src = path.read_text(encoding="utf-8")
        assert "editor.add" not in src
        assert "tui:" not in src
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


def test_bug0024_active_template_parity():
    """Marker 7: AC-8 dispatch-path byte-parity + BUG0024_PAIRS."""
    assert not ACTIVE_AUTO_MD.exists()
    assert not TEMPLATE_AUTO_MD.exists()
    assert ACTIVE_RPC.is_file() and TEMPLATE_RPC.is_file()
    assert ACTIVE_RPC.read_bytes() == TEMPLATE_RPC.read_bytes()
    assert ACTIVE_TUI.is_file() and TEMPLATE_TUI.is_file()
    assert ACTIVE_TUI.read_bytes() == TEMPLATE_TUI.read_bytes()
    assert ACTIVE_PLUGIN.read_bytes() == TEMPLATE_PLUGIN.read_bytes()
    assert ACTIVE_INDEX.read_bytes() == TEMPLATE_INDEX.read_bytes()
    assert RUNBOOK.is_file() and TEMPLATE_RUNBOOK.is_file()
    assert HARNESS.is_file() and TEMPLATE_HARNESS.is_file()
    assert HARNESS.read_bytes() == TEMPLATE_HARNESS.read_bytes()
    this_file = Path(__file__).resolve()
    template_test = REPO_ROOT / "template" / "tests" / this_file.name
    assert template_test.is_file()
    assert this_file.read_bytes() == template_test.read_bytes()
    parity_src = PARITY.read_text(encoding="utf-8")
    assert "BUG0024_PAIRS" in parity_src
    assert "bug-0024" in parity_src
    proc = subprocess.run(
        [sys.executable, str(PARITY), "--repo", str(REPO_ROOT), "--scope", "bug-0024"],
        check=False,
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )
    assert proc.returncode == 0, proc.stdout + proc.stderr


def test_bug0024_upgrade_copies_dispatch_still_prunes_auto_md():
    """Marker 8: upgrade overwrites live dispatch path; still prunes auto.md."""
    py = INSTALLER_PY.read_text(encoding="utf-8")
    sh = INSTALLER_SH.read_text(encoding="utf-8")
    ps1 = INSTALLER_PS1.read_text(encoding="utf-8")
    assert "def copy_opencode_auto_listing_surface" in py
    assert ".opencode/plugins/its-magic-auto/rpc.ts" in py
    assert ".opencode/plugins/its-magic-auto/tui.ts" in py
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
    # BUG-0024: overwrite must cover peer-brand + stage-code residual path
    assert "BUG-0024" in py or "BUG-0023" in py
    manifest = MANIFEST.read_text(encoding="utf-8")
    assert "template/.opencode/plugins/its-magic-auto/rpc.ts" in manifest
    assert "template/.opencode/plugins/its-magic-auto/tui.ts" in manifest

    stale_tui = "// pre-BUG-0024 catch-all DISPATCH\nexport async function dispatchRunAutoLifecycle(){return {ok:false,reasonCode:'OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED'};}\n"
    new_tui = ACTIVE_TUI.read_text(encoding="utf-8")
    stale_rpc = "export const ITS_MAGIC_AUTO_RPC = { id: 'old' };\nexport let ITS_MAGIC_AUTO_RPC_PEER_BRANDED = false;\n"
    new_rpc = ACTIVE_RPC.read_text(encoding="utf-8")
    stale_orch = "// silent skip\nif (ctx?.rpc?.register) { await ctx.rpc.register(X, {}); }\n"
    new_orch = ACTIVE_PLUGIN.read_text(encoding="utf-8")

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

        result = installer.copy_opencode_auto_listing_surface(str(target), str(source), "opencode")
        assert result == "copied"
        assert dst_tui.read_text(encoding="utf-8") == new_tui
        assert dst_rpc.read_text(encoding="utf-8") == new_rpc
        assert dst_orch.read_text(encoding="utf-8") == new_orch
        assert "ITS_MAGIC_AUTO_RPC_PEER_BRANDED" in dst_rpc.read_text(encoding="utf-8")
        assert "DEFINED_UNBRANDED" in dst_tui.read_text(encoding="utf-8") or (
            DEFINED_UNBRANDED in dst_tui.read_text(encoding="utf-8")
        )
        assert "emitAutoTuiRegisterSkipped" in dst_orch.read_text(encoding="utf-8")
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
