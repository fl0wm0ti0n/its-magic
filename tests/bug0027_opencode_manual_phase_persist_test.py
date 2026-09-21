"""BUG-0027 OpenCode manual phase persist — 10 markers.

Markers per architecture.md # BUG-0027 / R-0151 DQ8 / sprints/S0160/tasks.md.
Mock-ctx / stub-harness only — no live OpenCode CLI TUI probe (UAT_PROBE_FORBIDDEN).
Do not weaken tests/bug0024_* / test_us0124_* except US-0125 named-CLI compose-amend.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

ACTIVE_PLUGIN = REPO_ROOT / ".opencode" / "plugins" / "orchestrator.ts"
TEMPLATE_PLUGIN = REPO_ROOT / "template" / ".opencode" / "plugins" / "orchestrator.ts"
ACTIVE_BRIDGE = REPO_ROOT / "scripts" / "opencode_auto_bridge.py"
TEMPLATE_BRIDGE = REPO_ROOT / "template" / "scripts" / "opencode_auto_bridge.py"
ACTIVE_DEV = REPO_ROOT / ".opencode" / "agents" / "dev.md"
TEMPLATE_DEV = REPO_ROOT / "template" / ".opencode" / "agents" / "dev.md"
ACTIVE_QA = REPO_ROOT / ".opencode" / "agents" / "qa.md"
TEMPLATE_QA = REPO_ROOT / "template" / ".opencode" / "agents" / "qa.md"
ACTIVE_TUI = REPO_ROOT / ".opencode" / "plugins" / "its-magic-auto" / "tui.ts"
TEMPLATE_TUI = REPO_ROOT / "template" / ".opencode" / "plugins" / "its-magic-auto" / "tui.ts"
HARNESS = REPO_ROOT / "tests" / "bug0027_persist_harness.mjs"
PARITY = REPO_ROOT / "scripts" / "check_intake_template_parity.py"
INSTALLER_PY = REPO_ROOT / "installer.py"
INSTALLER_SH = REPO_ROOT / "installer.sh"
INSTALLER_PS1 = REPO_ROOT / "installer.ps1"

COMMAND_NAMES = ("intake", "execute", "discovery", "qa", "verify-work")
INVALID_INTAKE_CLI = "intake_evidence_validate.py --repo . --enforce"
DISPATCH_UNSUPPORTED = "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED"
PLACEHOLDER_REJECTED = "OPENCODE_PLACEHOLDER_PARENT_REJECTED"
PERSIST_DENIED = "OPENCODE_MANUAL_PHASE_PERSIST_DENIED"
CONTEXT_MISSING = "OPENCODE_MANUAL_PHASE_CONTEXT_MISSING"
WRITE_DENIED = "OPENCODE_MANUAL_PHASE_WRITE_DENIED"


def _run_harness(scenario: str) -> dict:
    assert HARNESS.is_file(), "bug0027 persist harness missing"
    proc = subprocess.run(
        ["node", "--experimental-strip-types", str(HARNESS), scenario],
        check=False,
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )
    assert proc.returncode == 0, proc.stderr or proc.stdout
    return json.loads(proc.stdout)


def _command_text(name: str, *, template: bool) -> str:
    root = REPO_ROOT / ("template" if template else "") / ".opencode" / "commands"
    if template:
        root = REPO_ROOT / "template" / ".opencode" / "commands"
    else:
        root = REPO_ROOT / ".opencode" / "commands"
    return (root / f"{name}.md").read_text(encoding="utf-8")


def test_bug0027_manual_phase_persists_isolation():
    """Marker 1: mock command.executed /execute with real IDs → IsolationEvidence."""
    out = _run_harness("manual-execute-persist")
    assert out.get("ok") is True, out
    evidence = out.get("evidence") or {}
    assert evidence.get("storyId") == "US-0001"
    assert evidence.get("sprintId") == "S0160"
    assert evidence.get("orchestratorRunId") == "auto-20260921-bug0027"
    assert evidence.get("bugId") == "BUG-0027"
    assert evidence.get("phase_id") == "execute"
    assert evidence.get("parentID") == "sess-real-parent"
    assert "tui-auto" not in json.dumps(evidence)
    src = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert "persistManualPhaseIsolation" in src
    assert "MANUAL_PHASE_COMMAND_NAMES" in src
    assert "command.executed" in src
    assert "isManualPhaseCommandName" in src


def test_bug0027_denied_persist_not_success():
    """Marker 2: persist helper non-ok → ok:false + PERSIST_DENIED; no success."""
    out = _run_harness("denied-persist")
    assert out.get("ok") is False, out
    assert out.get("reasonCode") == PERSIST_DENIED
    src = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert PERSIST_DENIED in src
    assert "MANUAL_PHASE_PERSIST_DENIED" in src


def test_bug0027_rpc_forwards_story_sprint_run():
    """Marker 3: runAutoLifecycleRpc no longer drops IDs (AC-3)."""
    out = _run_harness("rpc-forward")
    src = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert 'input.sessionID ?? "tui-auto"' not in src
    assert "storyId: input.storyId" in src
    assert "sprintId: input.sprintId" in src
    assert "orchestratorRunId: input.orchestratorRunId" in src
    forwarded = out.get("forwarded") or {}
    assert forwarded.get("storyId") == "US-0001"
    assert forwarded.get("sprintId") == "S0160"
    assert forwarded.get("orchestratorRunId") == "run-rpc-1"
    assert forwarded.get("bugId") == "BUG-0027"
    assert out.get("rpcForwardsIds") is True
    assert out.get("rpcMissingUsedTuiAuto") is False


def test_bug0027_tui_auto_rejected_as_release_evidence():
    """Marker 4: tui-auto as parentID or orchestratorRunId fail-closes."""
    out = _run_harness("tui-auto-rejected")
    assert out.get("parentOk") is False
    assert out.get("parentCode") == PLACEHOLDER_REJECTED
    assert out.get("runOk") is False
    assert out.get("runCode") == PLACEHOLDER_REJECTED
    assert out.get("rpcOk") is False
    assert out.get("rpcCode") == PLACEHOLDER_REJECTED
    assert out.get("writtenCount") == 0
    src = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert PLACEHOLDER_REJECTED in src
    bridge = ACTIVE_BRIDGE.read_text(encoding="utf-8")
    assert PLACEHOLDER_REJECTED in bridge
    assert "--story-id" in bridge
    assert "--sprint-id" in bridge
    assert "--bug-id" in bridge


def test_bug0027_no_fabricated_proof_when_orchestrator_unavailable():
    """Marker 5: missing run context → CONTEXT_MISSING; no invented proof tuple."""
    out = _run_harness("context-missing")
    assert out.get("ok") is False, out
    assert out.get("reasonCode") == CONTEXT_MISSING
    assert out.get("hasProofId") is False
    assert out.get("hasProofHash") is False
    src = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert CONTEXT_MISSING in src
    assert "do not invent" in src.lower() or "CONTEXT_MISSING" in src


def test_bug0027_auto_tui_toast_not_claimed():
    """Marker 6: dispatch toast / DISPATCH_UNSUPPORTED path unchanged (BUG-0024 compose)."""
    tui = ACTIVE_TUI.read_text(encoding="utf-8")
    tpl_tui = TEMPLATE_TUI.read_text(encoding="utf-8")
    orch = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert DISPATCH_UNSUPPORTED in tui
    assert DISPATCH_UNSUPPORTED in tpl_tui
    assert "dispatchRunAutoLifecycle" in tui
    assert "OPENCODE_AUTO_TUI_MISSING_CLIENT" in tui
    assert "toast repair" not in orch.lower()
    assert "runAutoLifecycleRpc" in orch
    for token in (
        "OPENCODE_MANUAL_PHASE_WRITE_DENIED",
        "OPENCODE_MANUAL_PHASE_PERSIST_DENIED",
        "OPENCODE_PLACEHOLDER_PARENT_REJECTED",
    ):
        assert token in orch
        assert token not in tui


def test_bug0027_validator_invocation_file_stdin_not_repo_enforce():
    """Marker 7: packs contain no invalid intake --repo --enforce; intake uses --file/--stdin."""
    for template in (False, True):
        for name in COMMAND_NAMES:
            text = _command_text(name, template=template)
            assert INVALID_INTAKE_CLI not in text, f"{name} still has invalid CLI"
        intake = _command_text("intake", template=template)
        assert "--file" in intake
        assert "--stdin" in intake
        assert "--self-test" in intake
        assert "intake_evidence_validate.py" in intake


def test_bug0027_non_intake_packs_drop_intake_validator():
    """Marker 8: execute.md / discovery.md do not require intake_evidence_validate."""
    for template in (False, True):
        for name in ("execute", "discovery"):
            text = _command_text(name, template=template)
            assert "intake_evidence_validate" not in text, f"{name} still requires intake validator"
        qa = _command_text("qa", template=template)
        verify = _command_text("verify-work", template=template)
        assert "bug_issue_validate.py --repo . --check-acceptance" in qa
        assert "bug_issue_validate.py --repo . --check-acceptance" in verify
        assert "intake_evidence_validate" not in qa
        assert "intake_evidence_validate" not in verify
    cursor_intake = (REPO_ROOT / ".cursor" / "commands" / "intake.md").read_text(
        encoding="utf-8"
    )
    # Cursor packs OUT of this rewrite — must not be the OpenCode thin pack.
    assert len(cursor_intake.splitlines()) > 20


def test_bug0027_active_template_parity():
    """Marker 9: touched OpenCode commands/agents/plugin/bridge byte-parity + BUG0027_PAIRS."""
    pairs = [
        (ACTIVE_PLUGIN, TEMPLATE_PLUGIN),
        (ACTIVE_BRIDGE, TEMPLATE_BRIDGE),
        (ACTIVE_DEV, TEMPLATE_DEV),
        (ACTIVE_QA, TEMPLATE_QA),
    ]
    for name in COMMAND_NAMES:
        pairs.append(
            (
                REPO_ROOT / ".opencode" / "commands" / f"{name}.md",
                REPO_ROOT / "template" / ".opencode" / "commands" / f"{name}.md",
            )
        )
    pairs.append((HARNESS, REPO_ROOT / "template" / "tests" / "bug0027_persist_harness.mjs"))
    pairs.append((Path(__file__).resolve(), REPO_ROOT / "template" / "tests" / Path(__file__).name))
    for active, template in pairs:
        assert active.is_file(), f"missing {active}"
        assert template.is_file(), f"missing {template}"
        assert active.read_bytes() == template.read_bytes(), f"parity fail {active.name}"
    parity_src = PARITY.read_text(encoding="utf-8")
    assert "BUG0027_PAIRS" in parity_src
    assert "bug-0027" in parity_src
    proc = subprocess.run(
        [sys.executable, str(PARITY), "--repo", str(REPO_ROOT), "--scope", "bug-0027"],
        check=False,
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )
    assert proc.returncode == 0, proc.stdout + proc.stderr
    py = INSTALLER_PY.read_text(encoding="utf-8")
    sh = INSTALLER_SH.read_text(encoding="utf-8")
    ps1 = INSTALLER_PS1.read_text(encoding="utf-8")
    assert ".opencode/commands/execute.md" in py
    assert "scripts/opencode_auto_bridge.py" in py
    assert ".opencode/commands/execute.md" in sh
    assert "scripts/opencode_auto_bridge.py" in sh
    assert ".opencode/commands/execute.md" in ps1
    assert "scripts/opencode_auto_bridge.py" in ps1


def test_bug0027_permission_matrix_phase_writes():
    """Marker 10: dev allows state.md + summary.md; qa allows state.md; deny-last held."""
    for path in (ACTIVE_DEV, TEMPLATE_DEV):
        text = path.read_text(encoding="utf-8")
        assert '"docs/engineering/state.md": allow' in text
        assert '"sprints/S*/summary.md": allow' in text
        lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
        assert '"**": deny' in text
        deny_idx = text.rfind('"**": deny')
        state_idx = text.find('"docs/engineering/state.md": allow')
        summary_idx = text.find('"sprints/S*/summary.md": allow')
        assert 0 <= state_idx < deny_idx
        assert 0 <= summary_idx < deny_idx
    for path in (ACTIVE_QA, TEMPLATE_QA):
        text = path.read_text(encoding="utf-8")
        assert '"docs/engineering/state.md": allow' in text
        assert '"**": deny' in text
        deny_idx = text.rfind('"**": deny')
        state_idx = text.find('"docs/engineering/state.md": allow')
        assert 0 <= state_idx < deny_idx
    orch = ACTIVE_PLUGIN.read_text(encoding="utf-8")
    assert WRITE_DENIED in orch
    # Plugin must not copy the permission array (DEC-0124).
    assert '"docs/engineering/state.md": allow' not in orch
    execute = _command_text("execute", template=False)
    assert WRITE_DENIED in execute
    assert "persistManualPhaseIsolation" in execute
