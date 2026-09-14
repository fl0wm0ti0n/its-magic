"""BUG-0020 OpenCode desktop Command.Info listing vs CLI TUI `/auto` — 8 markers.

Markers per architecture.md # BUG-0020 / R-0126 DQ6 / sprints/S0140/tasks.md.
Static/fixture only — no live OpenCode desktop probe.
Do not weaken tests/bug0018_*. Compose-only vs tests/bug0019_*:
E* TUI keymap is not the desktop picker fix; project `.opencode/tui.json`
is the CLI TUI load path; plugin-local `its-magic-auto/tui.json` stays forbidden.

Compose BUG-0021 (comments only): C-limb file-presence (`tui.json` lists `tui.ts`)
is the load path, not the CLI listing proof. Loader still requires default
export `{ id, tui }`. Do not treat this suite as proof that CLI TUI `/auto` listed.
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

DESKTOP_TOKEN = "OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED"
LISTING_UNSUPPORTED = "OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED"
DISPATCH_UNSUPPORTED = "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED"
COLLISION = "OPENCODE_AUTO_MARKDOWN_COLLISION"
AUTO_DESCRIPTION = "its-magic auto: orchestrator dispatch entry (spawn-only)."
TUI_PLUGIN_SPEC = "./plugins/its-magic-auto/tui.ts"
FORBIDDEN_SESSIONPROMPT = "SessionPrompt.command"
FORBIDDEN_PLUGIN_TUI_JSON = REPO_ROOT / ".opencode" / "plugins" / "its-magic-auto" / "tui.json"
FORBIDDEN_PLUGIN_CLI_JSON = REPO_ROOT / ".opencode" / "plugins" / "its-magic-auto" / "cli.json"
FORBIDDEN_KIT_CLI_JSON = REPO_ROOT / ".opencode" / "cli.json"

# Quoted contract from OpenCode desktop prompt-input.tsx + Command.Service phases
# (R-0126 DQ1; static fixture — no live desktop probe).
DESKTOP_PICKER_CONTRACT = """
prompt-input.tsx slashCommands =
  (a) app-internal builtins via command.register("composer", …) (command.options with slash)
  (b) sync.data.command (GET /api/command / v2.command.list → Command.Info[]
      with source: command|mcp|skill). Custom rows are Command.Info only.
Command.Service merge phases: built-in init/review + cfg.command (JSON/markdown
templates) + MCP prompts + skills. Plugin editor.add / CommandDefinition.execute
is not a merge source. TUI keymap slash/slashName and tui.json plugin list are
CLI TUI only and do not feed desktop Command.Info.
"""


def _assert_no_desktop_feed_claim(text: str, path: Path) -> None:
    lowered = text.lower()
    if "tui.json" not in lowered and "keymap" not in lowered:
        return
    claims = (
        "tui.json feeds desktop command.info",
        "tui.json lists /auto in desktop",
        "keymap feeds command.info",
        "tui.json feeds that picker",
        "keymap lists /auto in the operator picker",
    )
    for claim in claims:
        assert claim not in lowered, f"forbidden desktop-feed claim in {path}: {claim}"


def test_bug0020_desktop_command_info_picker_contract():
    """Marker 1: desktop custom slash = Command.Info merge; not keymap/editor.add/tui.json."""
    assert "sync.data.command" in DESKTOP_PICKER_CONTRACT
    assert "source: command|mcp|skill" in DESKTOP_PICKER_CONTRACT
    assert "Command.Info" in DESKTOP_PICKER_CONTRACT
    assert "editor.add" in DESKTOP_PICKER_CONTRACT
    assert "not a merge source" in DESKTOP_PICKER_CONTRACT
    assert "do not feed desktop Command.Info" in DESKTOP_PICKER_CONTRACT

    for path in (
        ACTIVE_TUI_JSON,
        TEMPLATE_TUI_JSON,
        ACTIVE_PLUGIN,
        TEMPLATE_PLUGIN,
        RUNBOOK,
        TEMPLATE_RUNBOOK,
    ):
        text = path.read_text(encoding="utf-8")
        _assert_no_desktop_feed_claim(text, path)

    tui = ACTIVE_TUI_JSON.read_text(encoding="utf-8")
    assert "Does NOT list /auto in desktop Command.Info" in tui
    assert "CLI TUI plugin load only" in tui
    plugin = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert "Not TUI keymap" in plugin or "not tui.json" in plugin.lower()
    assert "emitDesktopCommandInfoListingUnsupported" in plugin
    runbook = RUNBOOK.read_text(encoding="utf-8")
    assert "Command.Info" in runbook
    assert "CLI TUI" in runbook
    assert DESKTOP_TOKEN in runbook


def test_bug0020_no_command_info_auto_template():
    """Marker 2: no OpenCode auto.md and no JSON/JSONC commands.auto with template."""
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


def test_bug0020_plugin_editor_add_auto_execute_retained():
    """Marker 3: command.transform + editor.add({ name: auto }) + execute / runAutoLifecycle."""
    for path in (ACTIVE_PLUGIN, TEMPLATE_PLUGIN):
        src = path.read_text(encoding="utf-8")
        assert "command.transform" in src
        assert "editor.add" in src
        assert 'name: "auto"' in src or "name: 'auto'" in src
        assert "execute" in src
        assert "runAutoLifecycle" in src
        assert AUTO_DESCRIPTION in src
        assert "OPENCODE_AUTO_MARKDOWN_COLLISION" in src
        assert "emitDesktopCommandInfoListingUnsupported" in src

    for path in (ACTIVE_INDEX, TEMPLATE_INDEX):
        src = path.read_text(encoding="utf-8")
        assert "editor.add" not in src
        assert 'name: "auto"' not in src


def test_bug0020_desktop_listing_fail_closed_token():
    """Marker 4: additive desktop listing token; not TUI-toast-only; not collision reuse."""
    assert DESKTOP_TOKEN != LISTING_UNSUPPORTED
    assert DESKTOP_TOKEN != COLLISION
    assert DESKTOP_TOKEN != DISPATCH_UNSUPPORTED
    for path in (ACTIVE_PLUGIN, TEMPLATE_PLUGIN):
        src = path.read_text(encoding="utf-8")
        assert DESKTOP_TOKEN in src
        assert "AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED" in src
        assert "function emitDesktopCommandInfoListingUnsupported" in src
        emit_idx = src.index("export function emitDesktopCommandInfoListingUnsupported")
        setup_idx = src.index("setup(ctx")
        add_idx = src.index("editor.add({")
        call_idx = src.index("emitDesktopCommandInfoListingUnsupported(ctx)")
        assert add_idx < call_idx, "emit must run after editor.add"
        body = src[emit_idx:setup_idx]
        assert "tui.toast" not in body or "never call tui.toast" in body
        assert "ui.toast" not in body or "never call tui.toast" in body
        assert "session.alert" in body
        assert "app.notify" in body
        assert "setup-session-error" in body or "sessionError" in src
        assert "desktop-notify" in body
        assert COLLISION in src
        assert LISTING_UNSUPPORTED in src
        # Token must not be aliased onto the 0018/0019 codes.
        assert f"{COLLISION} = {DESKTOP_TOKEN}" not in src.replace(" ", "")
        assert f"{LISTING_UNSUPPORTED} = {DESKTOP_TOKEN}" not in src.replace(" ", "")

    runbook = RUNBOOK.read_text(encoding="utf-8")
    assert DESKTOP_TOKEN in runbook
    lowered = runbook.lower().replace("**", "")
    assert "not tui-toast-only" in lowered or "not cli tui toast-only" in lowered


def test_bug0020_cli_tui_working_start_load_path():
    """Marker 5: tui.json lists tui.ts and asserts CLI-TUI-only (not file-exists alone).

    Compose BUG-0021: this marker is the load path, not CLI listing proof.
    """
    for path in (ACTIVE_TUI_JSON, TEMPLATE_TUI_JSON):
        assert path.is_file()
        text = path.read_text(encoding="utf-8")
        assert '"$schema": "https://opencode.ai/tui.json"' in text
        assert TUI_PLUGIN_SPEC in text
        assert "CLI TUI plugin load only" in text
        assert "Does NOT list /auto in desktop Command.Info" in text
        assert '"theme"' not in text
        assert '"keybinds"' not in text
        assert '"attention"' not in text
        # Must list the module file, not the package directory.
        assert "./plugins/its-magic-auto/tui.ts" in text
        remainder = text.replace(TUI_PLUGIN_SPEC, "")
        assert '"./plugins/its-magic-auto"' not in remainder
        data = json.loads(installer._strip_jsonc(text))
        assert TUI_PLUGIN_SPEC in data.get("plugin", [])
        assert "./plugins/its-magic-auto" not in data.get("plugin", [])
    runbook = RUNBOOK.read_text(encoding="utf-8")
    assert "tui.json" in runbook
    assert "CLI TUI" in runbook
    assert "Command.Info" in runbook
    runbook_plain = " ".join(runbook.lower().replace("**", "").replace("`", "").split())
    assert "does not feed desktop command.info" in runbook_plain


def test_bug0020_tui_run_still_dispatches_lifecycle():
    """Marker 6: compose 0019 — TUI run → runAutoLifecycle / RPC; not Command.Info template."""
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert "runAutoLifecycle" in src
        assert "dispatchRunAutoLifecycle" in src
        assert "context.client" in src or "client.rpc" in src
        assert DISPATCH_UNSUPPORTED in src
        assert FORBIDDEN_SESSIONPROMPT not in src
        assert "\nSTOP\n" not in src
        assert "ITS_MAGIC_AUTO_RPC" in src
        assert 'slashName: "auto"' in src
    plugin = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert "runAutoLifecycleRpc" in plugin
    assert "ctx.rpc.register" in plugin


def test_bug0020_active_template_parity():
    """Marker 7: tui.json / token wiring / no-auto.md / no JSON template byte-parity."""
    assert not ACTIVE_AUTO_MD.exists()
    assert not TEMPLATE_AUTO_MD.exists()
    assert ACTIVE_TUI_JSON.is_file() and TEMPLATE_TUI_JSON.is_file()
    assert ACTIVE_TUI_JSON.read_bytes() == TEMPLATE_TUI_JSON.read_bytes()
    assert ACTIVE_PLUGIN.read_bytes() == TEMPLATE_PLUGIN.read_bytes()
    assert ACTIVE_TUI.read_bytes() == TEMPLATE_TUI.read_bytes()
    assert ACTIVE_INDEX.read_bytes() == TEMPLATE_INDEX.read_bytes()
    assert RUNBOOK.is_file() and TEMPLATE_RUNBOOK.is_file()
    assert RUNBOOK.read_bytes() == TEMPLATE_RUNBOOK.read_bytes()
    assert MANIFEST.is_file() and TEMPLATE_MANIFEST.is_file()
    assert MANIFEST.read_bytes() == TEMPLATE_MANIFEST.read_bytes()
    this_file = Path(__file__).resolve()
    template_test = REPO_ROOT / "template" / "tests" / this_file.name
    assert template_test.is_file()
    assert this_file.read_bytes() == template_test.read_bytes()
    for path in (ACTIVE_PLUGIN, TEMPLATE_PLUGIN):
        assert DESKTOP_TOKEN in path.read_text(encoding="utf-8")


def test_bug0020_upgrade_copies_surface_still_prunes_auto_md():
    """Marker 8: upgrade copy-if-absent / JSONC-merge tui.json; still prunes auto.md."""
    py = INSTALLER_PY.read_text(encoding="utf-8")
    sh = INSTALLER_SH.read_text(encoding="utf-8")
    ps1 = INSTALLER_PS1.read_text(encoding="utf-8")
    assert "def copy_or_merge_opencode_tui_json" in py
    assert "copy_or_merge_opencode_tui_json" in sh
    assert "Invoke-CopyOrMergeOpencodeTuiJson" in ps1
    assert "def prune_retired_opencode_auto_md" in py
    assert "prune_retired_opencode_auto_md" in sh
    assert "Invoke-PruneRetiredOpencodeAutoMd" in ps1
    assert COLLISION in py and COLLISION in sh and COLLISION in ps1
    assert "delete all files not in template" not in py.lower()
    manifest = MANIFEST.read_text(encoding="utf-8")
    assert ".opencode/tui.json" in manifest
    assert "template/.opencode/tui.json" in manifest

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

        src_tui = source / ".opencode" / "tui.json"
        src_tui.parent.mkdir(parents=True)
        src_tui.write_text(
            '{\n  "$schema": "https://opencode.ai/tui.json",\n'
            '  // BUG-0020: CLI TUI plugin load only. Does NOT list /auto in desktop Command.Info.\n'
            f'  "plugin": ["{TUI_PLUGIN_SPEC}"]\n}}\n',
            encoding="utf-8",
        )

        skipped = installer.copy_or_merge_opencode_tui_json(str(target), str(source), "cursor")
        assert skipped == "skipped-host"
        assert not (target / ".opencode" / "tui.json").exists()

        copied = installer.copy_or_merge_opencode_tui_json(str(target), str(source), "opencode")
        assert copied == "copied"
        dst = target / ".opencode" / "tui.json"
        assert dst.is_file()
        assert TUI_PLUGIN_SPEC in dst.read_text(encoding="utf-8")
        assert leftover.is_file(), "tui.json helper must not prune leftover auto.md itself"

        both_target = Path(tmp) / "consumer-both"
        assert installer.copy_or_merge_opencode_tui_json(str(both_target), str(source), "both") == "copied"

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
        assert "Does NOT list /auto in desktop Command.Info" in merged_text

        unchanged = installer.copy_or_merge_opencode_tui_json(str(existing), str(source), "opencode")
        assert unchanged == "unchanged"

        pruned = installer.prune_retired_opencode_auto_md(str(target), str(source), "opencode")
        assert pruned == "pruned"
        assert not leftover.exists()
        assert agent.is_file()
        assert cursor_auto.is_file()
        assert dst.is_file()
