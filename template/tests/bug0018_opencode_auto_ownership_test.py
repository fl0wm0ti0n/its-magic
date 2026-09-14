"""BUG-0018 OpenCode markdown `/auto` vs plugin execute ownership — 6 markers.

Markers per architecture.md # BUG-0018 / R-0120 DQ7.
Static/fixture only — no live OpenCode CI probe.
"""

from __future__ import annotations

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
ACTIVE_AGENT_AUTO = REPO_ROOT / ".opencode" / "agents" / "auto.md"
CURSOR_AUTO_MD = REPO_ROOT / ".cursor" / "commands" / "auto.md"
RUNBOOK = REPO_ROOT / "docs" / "engineering" / "runbook.md"
TEMPLATE_RUNBOOK = REPO_ROOT / "template" / "docs" / "engineering" / "runbook.md"
INSTALLER_PY = REPO_ROOT / "installer.py"
INSTALLER_SH = REPO_ROOT / "installer.sh"
INSTALLER_PS1 = REPO_ROOT / "installer.ps1"

COLLISION = "OPENCODE_AUTO_MARKDOWN_COLLISION"
ATTACH_UNSUPPORTED = "OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED"


def test_bug0018_no_colliding_opencode_auto_md():
    """Marker 1: active + template `.opencode/commands/auto.md` absent."""
    assert not ACTIVE_AUTO_MD.exists(), "active .opencode/commands/auto.md must be deleted"
    assert not TEMPLATE_AUTO_MD.exists(), "template .opencode/commands/auto.md must be deleted"
    assert ACTIVE_AGENT_AUTO.is_file(), ".opencode/agents/auto.md must remain"
    assert CURSOR_AUTO_MD.is_file(), ".cursor/commands/auto.md must remain"


def test_bug0018_plugin_editor_add_auto_execute():
    """Marker 2: command.transform + editor.add({ name: auto }) + execute / runAutoLifecycle."""
    for path in (ACTIVE_PLUGIN, TEMPLATE_PLUGIN):
        src = path.read_text(encoding="utf-8")
        assert "command.transform" in src
        assert "editor.add" in src
        assert 'name: "auto"' in src or "name: 'auto'" in src
        assert "execute" in src
        assert "runAutoLifecycle" in src
        assert 'description:\n              "its-magic auto: orchestrator dispatch entry (spawn-only)."' in src or (
            "its-magic auto: orchestrator dispatch entry (spawn-only)." in src
        )


def test_bug0018_active_template_opencode_auto_ownership_parity():
    """Marker 3: absence of auto.md + plugin attach byte-parity."""
    assert not ACTIVE_AUTO_MD.exists()
    assert not TEMPLATE_AUTO_MD.exists()
    assert ACTIVE_PLUGIN.read_bytes() == TEMPLATE_PLUGIN.read_bytes()
    assert RUNBOOK.is_file() and TEMPLATE_RUNBOOK.is_file()
    assert RUNBOOK.read_bytes() == TEMPLATE_RUNBOOK.read_bytes()


def test_bug0018_upgrade_prunes_consumer_auto_md():
    """Marker 4: upgrade helper removes leftover consumer auto.md; no sweeper."""
    py = INSTALLER_PY.read_text(encoding="utf-8")
    sh = INSTALLER_SH.read_text(encoding="utf-8")
    ps1 = INSTALLER_PS1.read_text(encoding="utf-8")
    assert "def prune_retired_opencode_auto_md" in py
    assert "prune_retired_opencode_auto_md" in sh
    assert "Invoke-PruneRetiredOpencodeAutoMd" in ps1
    assert COLLISION in py and COLLISION in sh and COLLISION in ps1
    assert "delete all files not in template" not in py.lower()

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
        (source / ".opencode" / "commands").mkdir(parents=True)
        # Template no longer ships auto.md.

        skipped = installer.prune_retired_opencode_auto_md(str(target), str(source), "cursor")
        assert skipped == "skipped-host"
        assert leftover.is_file()

        result = installer.prune_retired_opencode_auto_md(str(target), str(source), "opencode")
        assert result == "pruned"
        assert not leftover.exists()
        assert agent.is_file()
        assert cursor_auto.is_file()

        both_target = Path(tmp) / "consumer-both"
        both_left = both_target / ".opencode" / "commands" / "auto.md"
        both_left.parent.mkdir(parents=True)
        both_left.write_text("STOP\n", encoding="utf-8")
        assert installer.prune_retired_opencode_auto_md(str(both_target), str(source), "both") == "pruned"
        assert not both_left.exists()

        still_ships = Path(tmp) / "kit-ships"
        still_src = still_ships / ".opencode" / "commands" / "auto.md"
        still_src.parent.mkdir(parents=True)
        still_src.write_text("kit auto\n", encoding="utf-8")
        leftover2 = Path(tmp) / "consumer2" / ".opencode" / "commands" / "auto.md"
        leftover2.parent.mkdir(parents=True)
        leftover2.write_text("STOP\n", encoding="utf-8")
        assert installer.prune_retired_opencode_auto_md(str(leftover2.parents[2]), str(still_ships), "opencode") == "template-still-ships"
        assert leftover2.is_file()


def test_bug0018_compose_bug0015_attach_api_unchanged():
    """Marker 5: runAutoLifecycle / attach reason codes still present (read-only compose)."""
    src = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert "export async function runAutoLifecycle" in src
    assert "ctx.command.transform" in src or "command.transform" in src
    assert "editor.add" in src
    assert ATTACH_UNSUPPORTED in src
    assert "OPENCODE_PLUGIN_SPAWN_UNSUPPORTED" in src
    assert "OPENCODE_AUTO_ALREADY_RUNNING" in src
    assert ACTIVE_PLUGIN.read_bytes() == TEMPLATE_PLUGIN.read_bytes()


def test_bug0018_markdown_collision_reason_code_stub():
    """Marker 6: OPENCODE_AUTO_MARKDOWN_COLLISION in plugin vocabulary / runbook stub."""
    plugin = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    runbook = RUNBOOK.read_text(encoding="utf-8")
    assert COLLISION in plugin
    assert "AUTO_MARKDOWN_COLLISION" in plugin
    assert "leftoverAutoMarkdownExists" in plugin
    leftover_fn = plugin.split("export function leftoverAutoMarkdownExists", 1)[1].split(
        "export async function runAutoLifecycle", 1
    )[0]
    assert "unlink" not in leftover_fn
    assert "rmSync" not in leftover_fn
    assert "rmdir" not in leftover_fn
    assert COLLISION in runbook
    assert "US-0126" in runbook
    assert "### OpenCode `/auto` markdown collision reason codes (BUG-0018)" in runbook
    assert "### OpenCode markdown `/auto` vs plugin execute (BUG-0018 / R-0120)" in runbook
    # Plugin leftover check must not delete the file (installer owns prune).
    assert "plugin does not delete" in plugin.lower() or "must not\n * delete" in leftover_fn or "must not" in leftover_fn
