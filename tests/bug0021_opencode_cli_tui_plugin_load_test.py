"""BUG-0021 OpenCode CLI TUI plugin load `{ id, tui }` — 8 markers.

Markers per architecture.md # BUG-0021 / R-0134 DQ6 / sprints/S0146/tasks.md.
Static/fixture only — no live OpenCode CLI TUI probe.
Do not weaken tests/bug0018_*. Compose-only vs tests/bug0020_*: C-limb
`tui.json` listing is the load path, not CLI listing proof. Compose-only vs
tests/bug0019_*: keep slashName/slash/registerLayer; Plugin.define remains on
index.ts, not as the TUI default.
"""

from __future__ import annotations

import json
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
ACTIVE_TUI_JSON = REPO_ROOT / ".opencode" / "tui.json"
TEMPLATE_TUI_JSON = REPO_ROOT / "template" / ".opencode" / "tui.json"
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

LOAD_UNSUPPORTED = "OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED"
LISTING_UNSUPPORTED = "OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED"
DISPATCH_UNSUPPORTED = "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED"
DESKTOP_TOKEN = "OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED"
COLLISION = "OPENCODE_AUTO_MARKDOWN_COLLISION"
AUTO_DESCRIPTION = "its-magic auto: orchestrator dispatch entry (spawn-only)."
TUI_PLUGIN_SPEC = "./plugins/its-magic-auto/tui.ts"
FORBIDDEN_SESSIONPROMPT = "SessionPrompt.command"
FORBIDDEN_PLUGIN_TUI_JSON = REPO_ROOT / ".opencode" / "plugins" / "its-magic-auto" / "tui.json"
FORBIDDEN_PLUGIN_CLI_JSON = REPO_ROOT / ".opencode" / "plugins" / "its-magic-auto" / "cli.json"
FORBIDDEN_KIT_CLI_JSON = REPO_ROOT / ".opencode" / "cli.json"

# Quoted contract from OpenCode TUI plugin loader + keymap (R-0134 DQ1/DQ3;
# static fixture — no live OpenCode CLI TUI probe).
CLI_TUI_SLASH_CONTRACT = """
readV1Plugin(mod, spec, "tui") requires mod.default to be a record with
typeof tui === "function" — must default export an object with tui().
CLI TUI slash list = keymap slashName + namespace palette on a loaded TUI
plugin layer. GET /api/command / v2.command.list = Command.Info peers
(markdown .opencode/commands/*.md). tui.json does not feed Command.Info.
"""


def test_bug0021_tui_default_export_id_tui_shape():
    """Marker 1: default export is { id, tui } with a tui function; not Plugin.define setup."""
    assert "must default export an object with tui()" in CLI_TUI_SLASH_CONTRACT
    assert "readV1Plugin" in CLI_TUI_SLASH_CONTRACT
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert 'id: "its-magic.auto.tui"' in src
        assert "tui: async (api" in src
        assert "export default {" in src
        assert "export default plugin" not in src
        assert "const plugin = Plugin.define" not in src
        assert "must default export an object with tui()" in src
        assert "readV1Plugin" in src
        assert "@opencode/plugin/tui" in src or "@opencode-ai/plugin/tui" in src
    for path in (ACTIVE_INDEX, TEMPLATE_INDEX):
        src = path.read_text(encoding="utf-8")
        assert "Plugin.define" in src
        assert "tui:" not in src
        assert "export async function tui" not in src


def test_bug0021_registerLayer_name_slashName_palette_key():
    """Marker 2: registerLayer name/slashName/palette + ctrl+shift+a keyed binding."""
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert "registerLayer" in src
        assert 'name: "its-magic.auto"' in src
        assert 'title: "/auto"' in src
        assert 'category: "its-magic"' in src
        assert 'namespace: "palette"' in src
        assert 'slashName: "auto"' in src
        assert 'slash: { name: "auto" }' in src
        assert 'key: "ctrl+shift+a"' in src
        assert 'cmd: "its-magic.auto"' in src
        assert AUTO_DESCRIPTION in src
        assert 'bindings: ["its-magic.auto"]' not in src
        assert "ctrl+p" not in src or "ctrl+shift+a" in src
        for forbidden in ("ctrl+x", "ctrl+shift+p", "ctrl+shift+m"):
            assert f'key: "{forbidden}"' not in src


def test_bug0021_run_rpc_to_runAutoLifecycle():
    """Marker 3: tui run() → api.client.rpc(ITS_MAGIC_AUTO_RPC) → runAutoLifecycle.

    Compose-only (BUG-0023): `"api.client.rpc" in src` is listing/dispatch *string*
    presence, not host-true Rpc.define dispatch proof. See tests/bug0023_*.
    """
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert "dispatchRunAutoLifecycle" in src
        assert "api.client.rpc" in src
        assert "ITS_MAGIC_AUTO_RPC" in src
        assert "runAutoLifecycle" in src
        assert DISPATCH_UNSUPPORTED in src
        assert FORBIDDEN_SESSIONPROMPT not in src
        assert "\nSTOP\n" not in src
        lowered = src.lower()
        if "template:" in lowered:
            assert "command.info" in lowered
    plugin = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert "runAutoLifecycleRpc" in plugin
    assert "ctx.rpc.register" in plugin
    assert "editor.add" in plugin
    assert 'name: "auto"' in plugin
    for path in (ACTIVE_INDEX, TEMPLATE_INDEX):
        src = path.read_text(encoding="utf-8")
        assert "editor.add" not in src


def test_bug0021_no_auto_md_no_json_template():
    """Marker 4: compose 0018/0019 — no OpenCode auto.md; no JSON commands.auto template."""
    assert not ACTIVE_AUTO_MD.exists(), "must not restore .opencode/commands/auto.md"
    assert not TEMPLATE_AUTO_MD.exists(), "must not restore template .opencode/commands/auto.md"
    assert ACTIVE_AGENT_AUTO.is_file(), ".opencode/agents/auto.md must remain"
    assert CURSOR_AUTO_MD.is_file(), ".cursor/commands/auto.md must remain"
    assert not FORBIDDEN_KIT_CLI_JSON.exists(), "must not ship kit .opencode/cli.json"
    assert not (REPO_ROOT / "template" / ".opencode" / "cli.json").exists()
    assert not FORBIDDEN_PLUGIN_TUI_JSON.exists(), "plugin-local tui.json remains forbidden"
    assert not FORBIDDEN_PLUGIN_CLI_JSON.exists()
    assert not (
        REPO_ROOT / "template" / ".opencode" / "plugins" / "its-magic-auto" / "tui.json"
    ).exists()

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


def test_bug0021_fail_closed_load_token():
    """Marker 5: additive CLI-TUI load-skip token; not aliased onto desktop/collision/listing."""
    assert LOAD_UNSUPPORTED != LISTING_UNSUPPORTED
    assert LOAD_UNSUPPORTED != DISPATCH_UNSUPPORTED
    assert LOAD_UNSUPPORTED != DESKTOP_TOKEN
    assert LOAD_UNSUPPORTED != COLLISION
    for path in (ACTIVE_PLUGIN, TEMPLATE_PLUGIN):
        src = path.read_text(encoding="utf-8")
        assert LOAD_UNSUPPORTED in src
        assert "AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED" in src
        assert "function emitCliTuiPluginLoadUnsupported" in src
        emit_idx = src.index("export function emitCliTuiPluginLoadUnsupported")
        setup_idx = src.index("setup(ctx")
        add_idx = src.index("editor.add({")
        call_idx = src.index("emitCliTuiPluginLoadUnsupported(ctx)")
        assert add_idx < call_idx, "emit must run after editor.add"
        body = src[emit_idx:setup_idx]
        assert "tui.toast" not in body or "never call tui.toast" in body
        assert "ui.toast" not in body or "never call tui.toast" in body
        assert "session.alert" in body
        assert "app.notify" in body
        assert "setup-session-error" in body or "sessionError" in src
        compact = src.replace(" ", "")
        assert f"{COLLISION}={LOAD_UNSUPPORTED}" not in compact
        assert f"{LISTING_UNSUPPORTED}={LOAD_UNSUPPORTED}" not in compact
        assert f"{DESKTOP_TOKEN}={LOAD_UNSUPPORTED}" not in compact
        assert f"{DISPATCH_UNSUPPORTED}={LOAD_UNSUPPORTED}" not in compact
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        assert LOAD_UNSUPPORTED in path.read_text(encoding="utf-8")
    runbook = RUNBOOK.read_text(encoding="utf-8")
    assert LOAD_UNSUPPORTED in runbook
    lowered = runbook.lower().replace("**", "").replace("`", "")
    assert "tui() never runs" in lowered or "tui() never run" in lowered
    assert "#36505" in runbook or "36505" in runbook


def test_bug0021_slash_list_is_keymap_not_command_info():
    """Marker 6: CLI TUI slash = keymap slashName; GET /api/command is Command.Info."""
    assert "slashName" in CLI_TUI_SLASH_CONTRACT
    assert "GET /api/command" in CLI_TUI_SLASH_CONTRACT
    assert "Command.Info" in CLI_TUI_SLASH_CONTRACT
    assert "tui.json does not feed Command.Info" in CLI_TUI_SLASH_CONTRACT
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert 'slashName: "auto"' in src
        assert "registerLayer" in src or "keymap.layer" in src
    for path in (ACTIVE_TUI_JSON, TEMPLATE_TUI_JSON):
        text = path.read_text(encoding="utf-8")
        assert TUI_PLUGIN_SPEC in text
        assert "Does NOT list /auto in desktop Command.Info" in text
        assert "load path" in text.lower() or "not proof" in text.lower()
    plugin = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert "Not TUI keymap" in plugin or "not tui.json" in plugin.lower() or "Command.Info" in plugin
    runbook = RUNBOOK.read_text(encoding="utf-8")
    assert "slashName" in runbook
    assert "Command.Info" in runbook
    assert "CLI TUI" in runbook


def test_bug0021_active_template_parity():
    """Marker 7: tui.ts / tui.json / token wiring / no-auto.md byte-parity."""
    assert not ACTIVE_AUTO_MD.exists()
    assert not TEMPLATE_AUTO_MD.exists()
    assert ACTIVE_TUI.is_file() and TEMPLATE_TUI.is_file()
    assert ACTIVE_TUI.read_bytes() == TEMPLATE_TUI.read_bytes()
    assert ACTIVE_TUI_JSON.is_file() and TEMPLATE_TUI_JSON.is_file()
    assert ACTIVE_TUI_JSON.read_bytes() == TEMPLATE_TUI_JSON.read_bytes()
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
    for path in (ACTIVE_PLUGIN, TEMPLATE_PLUGIN, ACTIVE_TUI, TEMPLATE_TUI):
        assert LOAD_UNSUPPORTED in path.read_text(encoding="utf-8")


def test_bug0021_upgrade_copies_tui_shape_still_prunes_auto_md():
    """Marker 8: upgrade overwrites reshaped tui.ts; still prunes leftover auto.md."""
    py = INSTALLER_PY.read_text(encoding="utf-8")
    sh = INSTALLER_SH.read_text(encoding="utf-8")
    ps1 = INSTALLER_PS1.read_text(encoding="utf-8")
    assert "def copy_opencode_auto_listing_surface" in py
    assert "shutil.copy2" in py
    assert "copy_opencode_auto_listing_surface" in sh
    assert "cp -f" in sh
    assert "Invoke-CopyOpencodeAutoListingSurface" in ps1
    assert "Copy-Item" in ps1 and "-Force" in ps1
    assert "def prune_retired_opencode_auto_md" in py
    assert "prune_retired_opencode_auto_md" in sh
    assert "Invoke-PruneRetiredOpencodeAutoMd" in ps1
    assert COLLISION in py and COLLISION in sh and COLLISION in ps1
    assert "delete all files not in template" not in py.lower()
    assert "def copy_or_merge_opencode_tui_json" in py
    manifest = MANIFEST.read_text(encoding="utf-8")
    assert "template/.opencode/plugins/its-magic-auto/tui.ts" in manifest
    assert ".opencode/tui.json" in manifest

    plugin_define_src = (
        'Plugin.define({ setup(context) { /* C-limb skipped TUI default */ } })\n'
        "export default plugin;\n"
    )
    reshaped_src = (
        'export default {\n'
        '  id: "its-magic.auto.tui",\n'
        "  tui: async (api, options, meta) => {},\n"
        "};\n"
    )

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
        src_index.parent.mkdir(parents=True)
        src_index.write_text("listing-index\n", encoding="utf-8")
        src_tui.write_text(reshaped_src, encoding="utf-8")

        dst_tui = target / ".opencode" / "plugins" / "its-magic-auto" / "tui.ts"
        dst_tui.parent.mkdir(parents=True)
        dst_tui.write_text(plugin_define_src, encoding="utf-8")

        skipped = installer.copy_opencode_auto_listing_surface(str(target), str(source), "cursor")
        assert skipped == "skipped-host"
        assert dst_tui.read_text(encoding="utf-8") == plugin_define_src

        result = installer.copy_opencode_auto_listing_surface(str(target), str(source), "opencode")
        assert result == "copied"
        assert dst_tui.read_text(encoding="utf-8") == reshaped_src
        assert "tui: async" in dst_tui.read_text(encoding="utf-8")
        assert "const plugin = Plugin.define" not in dst_tui.read_text(encoding="utf-8")
        assert leftover.is_file(), "copy helper must not prune leftover auto.md itself"

        both_target = Path(tmp) / "consumer-both"
        both_tui = both_target / ".opencode" / "plugins" / "its-magic-auto" / "tui.ts"
        both_tui.parent.mkdir(parents=True)
        both_tui.write_text(plugin_define_src, encoding="utf-8")
        assert installer.copy_opencode_auto_listing_surface(str(both_target), str(source), "both") == "copied"
        assert both_tui.read_text(encoding="utf-8") == reshaped_src

        src_tui_json = source / ".opencode" / "tui.json"
        src_tui_json.parent.mkdir(parents=True, exist_ok=True)
        src_tui_json.write_text(
            '{\n  "$schema": "https://opencode.ai/tui.json",\n'
            "  // BUG-0020: CLI TUI plugin load only. Does NOT list /auto in desktop Command.Info.\n"
            f'  "plugin": ["{TUI_PLUGIN_SPEC}"]\n}}\n',
            encoding="utf-8",
        )
        existing = Path(tmp) / "consumer-merge"
        existing_tui = existing / ".opencode" / "tui.json"
        existing_tui.parent.mkdir(parents=True)
        existing_tui.write_text(
            '{\n  "$schema": "https://opencode.ai/tui.json",\n'
            '  "theme": "operator-theme",\n'
            '  "keybinds": { "leader": "ctrl+x" },\n'
            '  "attention": "bell"\n}\n',
            encoding="utf-8",
        )
        merged = installer.copy_or_merge_opencode_tui_json(str(existing), str(source), "opencode")
        assert merged == "merged"
        merged_text = existing_tui.read_text(encoding="utf-8")
        assert TUI_PLUGIN_SPEC in merged_text
        assert "operator-theme" in merged_text
        assert "ctrl+x" in merged_text
        assert "bell" in merged_text

        pruned = installer.prune_retired_opencode_auto_md(str(target), str(source), "opencode")
        assert pruned == "pruned"
        assert not leftover.exists()
        assert agent.is_file()
        assert cursor_auto.is_file()
        assert dst_tui.is_file()
