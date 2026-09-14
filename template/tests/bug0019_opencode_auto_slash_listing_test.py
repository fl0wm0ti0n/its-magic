"""BUG-0019 OpenCode `/auto` slash listing vs plugin execute — 7 markers.

Markers per architecture.md # BUG-0019 / R-0124 DQ6.
Static/fixture only — no live OpenCode TUI probe.
Do not weaken tests/bug0018_*.

Compose BUG-0020 (comments only): E* is the CLI TUI keymap surface, not the
desktop Command.Info picker fix. Project `.opencode/tui.json` is now the CLI
TUI load path; plugin-local `its-magic-auto/tui.json` remains forbidden
(FORBIDDEN_TUI_JSON). Compose BUG-0021: Plugin.define remains on **index.ts**
(server), not as the TUI default export. Keep `slashName: "auto"` /
`slash: { name: "auto" }` / `registerLayer` or `keymap.layer`. TUI default is
`{ id, tui }`.
"""

from __future__ import annotations

import json
import os
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

LISTING_UNSUPPORTED = "OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED"
DISPATCH_UNSUPPORTED = "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED"
COLLISION = "OPENCODE_AUTO_MARKDOWN_COLLISION"
AUTO_DESCRIPTION = "its-magic auto: orchestrator dispatch entry (spawn-only)."

FORBIDDEN_SESSIONPROMPT = "SessionPrompt.command"
FORBIDDEN_CLI_JSON = REPO_ROOT / ".opencode" / "plugins" / "its-magic-auto" / "cli.json"
# Plugin-local tui.json stays forbidden. Project `.opencode/tui.json` is the
# CLI TUI load path (BUG-0020); it does not feed desktop Command.Info.
FORBIDDEN_TUI_JSON = REPO_ROOT / ".opencode" / "plugins" / "its-magic-auto" / "tui.json"


def test_bug0019_no_restored_opencode_auto_md():
    """Marker 1: active + template `.opencode/commands/auto.md` remain absent."""
    assert not ACTIVE_AUTO_MD.exists(), "must not restore .opencode/commands/auto.md"
    assert not TEMPLATE_AUTO_MD.exists(), "must not restore template .opencode/commands/auto.md"
    assert ACTIVE_AGENT_AUTO.is_file(), ".opencode/agents/auto.md must remain"
    assert CURSOR_AUTO_MD.is_file(), ".cursor/commands/auto.md must remain"


def test_bug0019_plugin_editor_add_auto_execute_retained():
    """Marker 2: command.transform + editor.add({ name: auto }) + execute / runAutoLifecycle."""
    for path in (ACTIVE_PLUGIN, TEMPLATE_PLUGIN):
        src = path.read_text(encoding="utf-8")
        assert "command.transform" in src
        assert "editor.add" in src
        assert 'name: "auto"' in src or "name: 'auto'" in src
        assert "execute" in src
        assert "runAutoLifecycle" in src
        assert AUTO_DESCRIPTION in src
        assert "runAutoLifecycleRpc" in src
        assert 'id: "its-magic.auto"' in src or "id: 'its-magic.auto'" in src


def test_bug0019_no_json_commands_auto_template():
    """Marker 3: no OpenCode JSON/JSONC commands.auto / command.auto with template."""
    roots = [
        REPO_ROOT / ".opencode",
        REPO_ROOT / "template" / ".opencode",
    ]
    candidates: list[Path] = []
    for root in roots:
        if root.is_dir():
            candidates.extend(root.rglob("*.json"))
            candidates.extend(root.rglob("*.jsonc"))
    for name in ("opencode.json", "opencode.jsonc", "cli.json", "tui.json"):
        candidates.append(REPO_ROOT / name)
        candidates.append(REPO_ROOT / "template" / name)
        candidates.append(REPO_ROOT / ".opencode" / name)
        candidates.append(REPO_ROOT / "template" / ".opencode" / name)

    for path in candidates:
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        lowered = text.lower()
        # Kit must not ship a JSON/JSONC Command.Info `/auto` with template.
        if '"auto"' in lowered or "'auto'" in lowered:
            if "template" in lowered and (
                '"commands"' in lowered or "'commands'" in lowered or '"command"' in lowered
            ):
                # Heuristic: a commands map that names auto and includes template.
                if "commands" in lowered and "auto" in lowered and "template" in lowered:
                    try:
                        data = json.loads(text)
                    except json.JSONDecodeError:
                        data = None
                    if isinstance(data, dict):
                        commands = data.get("commands") or data.get("command") or {}
                        auto = commands.get("auto") if isinstance(commands, dict) else None
                        if isinstance(auto, dict) and "template" in auto:
                            raise AssertionError(
                                f"JSON commands.auto template forbidden: {path}"
                            )
                    else:
                        raise AssertionError(
                            f"JSON/JSONC commands.auto template forbidden: {path}"
                        )

    assert not FORBIDDEN_CLI_JSON.exists(), "must not ship kit cli.json"
    assert not FORBIDDEN_TUI_JSON.exists(), "must not ship plugin-local tui.json (project .opencode/tui.json is CLI load path; FORBIDDEN_TUI_JSON stays)"
    assert not (REPO_ROOT / "template" / ".opencode" / "plugins" / "its-magic-auto" / "cli.json").exists()
    assert not (REPO_ROOT / "template" / ".opencode" / "plugins" / "its-magic-auto" / "tui.json").exists()


def test_bug0019_tui_slash_auto_listing_surface():
    """Marker 4: TUI keymap slash / slashName auto in its-magic-auto/tui.ts."""
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert 'slash: { name: "auto" }' in src or 'slashName: "auto"' in src
        assert 'slashName: "auto"' in src
        assert 'name: "auto"' in src
        assert "keymap.layer" in src or "registerLayer" in src
        assert LISTING_UNSUPPORTED in src
        assert AUTO_DESCRIPTION in src
        assert "@opencode/plugin/tui" in src or "@opencode-ai/plugin/tui" in src

    for path in (ACTIVE_INDEX, TEMPLATE_INDEX):
        src = path.read_text(encoding="utf-8")
        assert "Plugin.define" in src
        assert "editor.add" not in src
        assert 'name: "auto"' not in src

    assert not (REPO_ROOT / ".opencode" / "commands" / "auto.md").exists()


def test_bug0019_tui_run_dispatches_lifecycle_not_template():
    """Marker 5: TUI run wires to runAutoLifecycle / client RPC; not Command.Info template."""
    for path in (ACTIVE_TUI, TEMPLATE_TUI):
        src = path.read_text(encoding="utf-8")
        assert "runAutoLifecycle" in src
        assert "dispatchRunAutoLifecycle" in src
        assert "context.client" in src or "client.rpc" in src
        assert DISPATCH_UNSUPPORTED in src
        assert FORBIDDEN_SESSIONPROMPT not in src
        assert "template:" not in src.lower() or "Command.Info" in src
        # Must not ship a STOP prompt body as the listing/dispatch path.
        assert "\nSTOP\n" not in src
        assert src.strip() != "STOP"
        assert "ITS_MAGIC_AUTO_RPC" in src

    plugin = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert "runAutoLifecycleRpc" in plugin
    assert "ctx.rpc.register" in plugin
    assert DISPATCH_UNSUPPORTED in plugin
    assert LISTING_UNSUPPORTED in plugin
    assert COLLISION in plugin


def test_bug0019_active_template_listing_parity():
    """Marker 6: listing surface + no-auto.md + no JSON template byte-parity."""
    assert not ACTIVE_AUTO_MD.exists()
    assert not TEMPLATE_AUTO_MD.exists()
    assert ACTIVE_INDEX.is_file() and TEMPLATE_INDEX.is_file()
    assert ACTIVE_TUI.is_file() and TEMPLATE_TUI.is_file()
    assert ACTIVE_INDEX.read_bytes() == TEMPLATE_INDEX.read_bytes()
    assert ACTIVE_TUI.read_bytes() == TEMPLATE_TUI.read_bytes()
    assert ACTIVE_PLUGIN.read_bytes() == TEMPLATE_PLUGIN.read_bytes()
    assert RUNBOOK.is_file() and TEMPLATE_RUNBOOK.is_file()
    assert RUNBOOK.read_bytes() == TEMPLATE_RUNBOOK.read_bytes()
    assert MANIFEST.is_file() and TEMPLATE_MANIFEST.is_file()
    assert MANIFEST.read_bytes() == TEMPLATE_MANIFEST.read_bytes()
    this_file = Path(__file__).resolve()
    template_test = REPO_ROOT / "template" / "tests" / this_file.name
    assert template_test.is_file()
    assert this_file.read_bytes() == template_test.read_bytes()


def test_bug0019_upgrade_copies_listing_surface():
    """Marker 7: upgrade --host opencode|both copies listing files; still prunes auto.md."""
    py = INSTALLER_PY.read_text(encoding="utf-8")
    sh = INSTALLER_SH.read_text(encoding="utf-8")
    ps1 = INSTALLER_PS1.read_text(encoding="utf-8")
    assert "def copy_opencode_auto_listing_surface" in py
    assert "copy_opencode_auto_listing_surface" in sh
    assert "Invoke-CopyOpencodeAutoListingSurface" in ps1
    assert "def prune_retired_opencode_auto_md" in py
    assert "prune_retired_opencode_auto_md" in sh
    assert "Invoke-PruneRetiredOpencodeAutoMd" in ps1
    assert COLLISION in py and COLLISION in sh and COLLISION in ps1
    assert "delete all files not in template" not in py.lower()
    manifest = MANIFEST.read_text(encoding="utf-8")
    assert "template/.opencode/plugins/its-magic-auto/index.ts" in manifest
    assert "template/.opencode/plugins/its-magic-auto/tui.ts" in manifest
    assert ".opencode/plugins" in manifest

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
        src_tui.write_text("listing-tui\n", encoding="utf-8")

        skipped = installer.copy_opencode_auto_listing_surface(str(target), str(source), "cursor")
        assert skipped == "skipped-host"
        assert not (target / ".opencode" / "plugins" / "its-magic-auto" / "index.ts").exists()

        result = installer.copy_opencode_auto_listing_surface(str(target), str(source), "opencode")
        assert result == "copied"
        dst_index = target / ".opencode" / "plugins" / "its-magic-auto" / "index.ts"
        dst_tui = target / ".opencode" / "plugins" / "its-magic-auto" / "tui.ts"
        assert dst_index.read_text(encoding="utf-8") == "listing-index\n"
        assert dst_tui.read_text(encoding="utf-8") == "listing-tui\n"
        assert leftover.is_file(), "copy helper must not prune leftover auto.md itself"

        both_target = Path(tmp) / "consumer-both"
        assert installer.copy_opencode_auto_listing_surface(str(both_target), str(source), "both") == "copied"
        assert (both_target / ".opencode" / "plugins" / "its-magic-auto" / "index.ts").is_file()

        pruned = installer.prune_retired_opencode_auto_md(str(target), str(source), "opencode")
        assert pruned == "pruned"
        assert not leftover.exists()
        assert agent.is_file()
        assert cursor_auto.is_file()
        assert dst_index.is_file()
        assert dst_tui.is_file()
