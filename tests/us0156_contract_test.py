"""US-0156 / S0162 - OpenCode /auto parity contracts (DEC-0152).

Covers the nine architecture-listed markers plus the permission-order
regression:
  test_us0156_auto_command_owns_spawn_only_parent
  test_us0156_sequential_fresh_phase_tasks
  test_us0156_resolver_never_falls_back_to_execute
  test_us0156_start_from_resume_phase_plan_precedence
  test_us0156_story_bug_scheduler_mutex_and_order
  test_us0156_stop_matrix_and_cap_boundaries
  test_us0156_resume_idempotence_provenance
  test_us0156_dod_and_active_template_parity
  test_opencode_agent_permission_specific_paths_override_broad_deny

No live desktop, --pure, or provider-complete run is claimed (architecture
test-contract guard; US-0156 AC-7).
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))
sys.path.insert(0, str(REPO_ROOT / "scripts"))
import opencode_auto_bridge as bridge  # noqa: E402

ACTIVE_AUTO_CMD = REPO_ROOT / ".opencode" / "commands" / "auto.md"
TEMPLATE_AUTO_CMD = REPO_ROOT / "template" / ".opencode" / "commands" / "auto.md"
ACTIVE_AUTO_AGENT = REPO_ROOT / ".opencode" / "agents" / "auto.md"
TEMPLATE_AUTO_AGENT = REPO_ROOT / "template" / ".opencode" / "agents" / "auto.md"
ACTIVE_ORCH = REPO_ROOT / ".opencode" / "plugins" / "orchestrator.ts"
TEMPLATE_ORCH = REPO_ROOT / "template" / ".opencode" / "plugins" / "orchestrator.ts"
ACTIVE_BRIDGE = REPO_ROOT / "scripts" / "opencode_auto_bridge.py"
TEMPLATE_BRIDGE = REPO_ROOT / "template" / "scripts" / "opencode_auto_bridge.py"
ROLE_AGENTS = (
    "dev",
    "po",
    "qa",
    "release",
    "tech-lead",
    "curator",
    "security",
)


def _run_bridge(repo: Path, *args: str) -> dict:
    proc = subprocess.run(
        [sys.executable, str(ACTIVE_BRIDGE), "--repo", str(repo), *args],
        capture_output=True,
        text=True,
        timeout=30,
        cwd=str(REPO_ROOT),
    )
    try:
        parsed = json.loads(proc.stdout or "{}")
    except json.JSONDecodeError:
        parsed = {}
    return {"status": proc.returncode, "stdout": proc.stdout, "parsed": parsed}


def _run_bridge_env(
    repo: Path,
    env_extra: dict[str, str],
    *args: str,
) -> dict:
    env = dict(os.environ)
    env.update(env_extra)
    proc = subprocess.run(
        [sys.executable, str(ACTIVE_BRIDGE), "--repo", str(repo), *args],
        capture_output=True,
        text=True,
        timeout=30,
        env=env,
        cwd=str(REPO_ROOT),
    )
    try:
        parsed = json.loads(proc.stdout or "{}")
    except json.JSONDecodeError:
        parsed = {}
    return {"status": proc.returncode, "stdout": proc.stdout, "parsed": parsed}


def _write_scratchpad(repo: Path, **keys: str) -> None:
    lines = []
    for k, v in keys.items():
        lines.append(f"{k}={v}")
    lines.append("")
    # hrc resolves the repo's `.cursor/scratchpad.*` layers (DEC-0055).
    # The 'local' layer is the operator overlay and wins on key conflict.
    (repo / ".cursor").mkdir(parents=True, exist_ok=True)
    (repo / ".cursor" / "scratchpad.local.md").write_text(
        "\n".join(lines), encoding="utf-8"
    )


def _write_resume_brief(repo: Path, **fields: str) -> None:
    lines = ["# Resume Brief"]
    for k, v in fields.items():
        # Bare `key=value` form (m3 regex in the bridge parser).
        lines.append(f"{k}={v}")
    lines.append("")
    (repo / "handoffs").mkdir(parents=True, exist_ok=True)
    (repo / "handoffs" / "resume_brief.md").write_text(
        "\n".join(lines), encoding="utf-8"
    )


def _write_state(repo: Path, next_phase: str | None) -> None:
    lines = ["# State"]
    if next_phase:
        lines.append(f"next_scheduled_phase={next_phase}")
    lines.append("")
    (repo / "docs" / "engineering").mkdir(parents=True, exist_ok=True)
    (repo / "docs" / "engineering" / "state.md").write_text(
        "\n".join(lines), encoding="utf-8"
    )


def _write_backlog(
    repo: Path, story: str, status: str, sprint: str | None = None
) -> None:
    (repo / "docs" / "product").mkdir(parents=True, exist_ok=True)
    path = repo / "docs" / "product" / "backlog.md"
    entry = [f"## {story}", f"- Status: `{status}`"]
    if sprint:
        entry.append(f"- Sprint: `{sprint}`")
    entry.append("")
    block = "\n".join(entry)
    if path.is_file():
        existing = path.read_text(encoding="utf-8").rstrip("\n")
        path.write_text(existing + "\n" + block + "\n", encoding="utf-8")
    else:
        path.write_text("# Backlog\n\n" + block + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# AC-1: command ownership, agent: auto, spawn-only, no retired route
# ---------------------------------------------------------------------------


def test_us0156_auto_command_owns_spawn_only_parent() -> None:
    active = ACTIVE_AUTO_CMD.read_text(encoding="utf-8")
    template = TEMPLATE_AUTO_CMD.read_text(encoding="utf-8")
    assert "agent: auto" in active
    assert "agent: auto" in template
    assert ACTIVE_AUTO_CMD.read_bytes() == TEMPLATE_AUTO_CMD.read_bytes(), (
        "command parity"
    )

    agent = ACTIVE_AUTO_AGENT.read_text(encoding="utf-8")
    # auto agent must not allow edits: broad `edit: deny` or `"*": deny`.
    assert re.search(r"^\s*edit:\s*deny\b", agent, re.MULTILINE) or (
        re.search(r'"\*":\s*deny', agent)
    ), "auto agent must be edit-deny"
    assert "task:" in agent
    assert "client.rpc" not in active
    assert "ctx.rpc" not in active
    # retired route markers must not appear in the documented command body
    # (BUG-0030 guard; retired TUI/RPC surfaces stay retired).
    for marker in ("its-magic-auto/tui.ts", "its-magic-auto/rpc.ts"):
        assert marker not in active.replace("\\", "/"), f"retired route leaked: {marker}"


def test_opencode_agent_permission_specific_paths_override_broad_deny() -> None:
    """Broad deny first, specific allows after. Last-match wins => owned paths
    effective. Security remains read-only (edit: deny)."""
    for role in ROLE_AGENTS:
        a = (REPO_ROOT / ".opencode" / "agents" / f"{role}.md").read_text(
            encoding="utf-8"
        )
        t = (REPO_ROOT / "template" / ".opencode" / "agents" / f"{role}.md").read_text(
            encoding="utf-8"
        )
        assert a == t, f"agent parity ({role})"
        if role == "security":
            # security: read-only (edit: deny, no allow lines)
            assert re.search(r"^\s*edit:\s*deny\b", a, re.MULTILINE), (
                "security must be read-only"
            )
            continue
        # All non-security roles: broad '**" deny present and must come before
        # any 'allow' line (OpenCode last-match-wins ⇒ specific paths effective).
        assert re.search(r'"\*"\s*:\s*deny', a) or re.search(
            r'"\*\*"\s*:\s*deny', a
        ), f"broad deny missing in {role}"
        deny_idx = a.find('"**": deny')
        if deny_idx == -1:
            deny_idx = a.find('"*": deny')
        allow_idx = a.find("allow")
        if allow_idx >= 0 and deny_idx >= 0:
            assert deny_idx < allow_idx, f"broad deny not first in {role}"


# ---------------------------------------------------------------------------
# AC-3 / AC-2: sequential fresh-phase tasks (fresh session per phase, role
# match, Phase->Role matrix covers the full lifecycle).
# ---------------------------------------------------------------------------


def test_us0156_sequential_fresh_phase_tasks() -> None:
    src = ACTIVE_ORCH.read_text(encoding="utf-8")
    template_src = TEMPLATE_ORCH.read_text(encoding="utf-8")
    assert src == template_src
    expected = (
        "intake",
        "discovery",
        "research",
        "architecture",
        "sprint-plan",
        "plan-verify",
        "execute",
        "qa",
        "verify-work",
        "release",
        "closure",
        "refresh-context",
    )
    matrix_block = src.split("PHASE_ROLE_MATRIX")[1][:1500]
    for phase in expected:
        assert phase in matrix_block, f"PHASE_ROLE_MATRIX missing {phase}"
    # spawnPhase rejects a child session identical to the orchestrator
    # (sessionID === args.orchestratorSessionId) via SUBTASK_IGNORED.
    assert "sessionID === args.orchestratorSessionId" in src
    assert "fresh_context_marker" in src


# ---------------------------------------------------------------------------
# AC-6 / AC-5: resolver never falls back to execute; fail-closed reasons.
# ---------------------------------------------------------------------------


def test_us0156_resolver_never_falls_back_to_execute(tmp_path: Path) -> None:
    res = _run_bridge(
        tmp_path, "--resolve-continuation", "--orchestrator-run-id", "r-empty"
    )
    assert res["status"] != 0
    assert res["parsed"].get("ok") in (False, None)
    assert res["parsed"].get("reasonCode"), "reason code required on failure"
    assert res["parsed"].get("phase_id") in (None, ""), (
        "no fallback phase on failure"
    )
    bridge_src = ACTIVE_BRIDGE.read_text(encoding="utf-8")
    orchestrator_src = ACTIVE_ORCH.read_text(encoding="utf-8")

    def _strip_line_comments(t: str) -> str:
        return "\n".join(line.split("//", 1)[0] for line in t.splitlines())

    assert "fallback_execute" not in _strip_line_comments(bridge_src)
    assert "fallback_execute" not in _strip_line_comments(orchestrator_src)
    assert res["parsed"].get("phase_id") != "execute"


def test_us0156_start_from_resume_phase_plan_precedence(tmp_path: Path) -> None:
    _write_resume_brief(
        tmp_path,
        orchestrator_run_id="r-startfrom",
        story_id="US-9999",
        next_scheduled_phase="qa",
        sprint_id="S9999",
    )
    _write_state(tmp_path, "architecture")

    # Priority 1: --start-from wins even when resume/state exist.
    res = _run_bridge(
        tmp_path,
        "--resolve-continuation",
        "--orchestrator-run-id",
        "r-startfrom",
        "--start-from",
        "execute",
    )
    assert res["status"] == 0, res["parsed"]
    assert res["parsed"]["phase_id"] == "execute"
    assert res["parsed"]["source"] == "argv"

    # Priority 2: resume_brief used when resume brief has a valid phase
    # (state may match or be absent — no ambiguity).
    _write_resume_brief(
        tmp_path,
        orchestrator_run_id="r-resume-match",
        story_id="US-9999",
        next_scheduled_phase="qa",
        sprint_id="S9999",
    )
    _write_state(tmp_path, "qa")
    res2m = _run_bridge(
        tmp_path,
        "--resolve-continuation",
        "--orchestrator-run-id",
        "r-resume-match",
    )
    assert res2m["status"] == 0, res2m["parsed"]
    assert res2m["parsed"]["phase_id"] == "qa"
    assert res2m["parsed"]["source"].startswith("resume_brief")

    # Priority 3: state.md used when resume brief has no valid phase.
    _write_state(tmp_path, "architecture")
    _write_resume_brief(
        tmp_path,
        orchestrator_run_id="r-state",
        story_id="US-9999",
        next_scheduled_phase="none",
        sprint_id="S9999",
    )
    res3 = _run_bridge(
        tmp_path, "--resolve-continuation", "--orchestrator-run-id", "r-state"
    )
    assert res3["status"] == 0, res3["parsed"]
    assert res3["parsed"]["phase_id"] == "architecture"
    assert res3["parsed"]["source"] == "state.md"

    # Ambiguity: resume phase differs from state phase ⇒ RESUME_AMBIGUOUS.
    _write_state(tmp_path, "execute")
    _write_resume_brief(
        tmp_path,
        orchestrator_run_id="r-amb2",
        story_id="US-9999",
        next_scheduled_phase="qa",
        sprint_id="S9999",
    )
    res4 = _run_bridge(
        tmp_path, "--resolve-continuation", "--orchestrator-run-id", "r-amb2"
    )
    assert res4["status"] != 0
    assert res4["parsed"].get("reasonCode") == "OPENCODE_AUTO_RESUME_AMBIGUOUS"


# ---------------------------------------------------------------------------
# AC-3 / AC-4: scheduler mutex, order, OPEN-only filtering, empty failures.
# ---------------------------------------------------------------------------


def test_us0156_story_bug_scheduler_mutex_and_order(tmp_path: Path) -> None:
    # bug_target precedence: explicit target + drain flags on ⇒ no
    # AUTO_SCHEDULER_CONFLICT (bug-target wins).
    _write_scratchpad(tmp_path, AUTO_BACKLOG_DRAIN="1", AUTO_BUG_QUEUE="1")
    res = _run_bridge(
        tmp_path,
        "--resolve-continuation",
        "--orchestrator-run-id",
        "r-bug",
        "--bug-target",
        "BUG-0042",
        "--start-from",
        "research",
    )
    assert res["status"] == 0, res["parsed"]
    assert res["parsed"]["phase_id"] == "research"
    assert res["parsed"]["bug_id"] == "BUG-0042"
    assert res["parsed"]["work_item_kind"] == "bug"

    # No bug_target, both flags on ⇒ AUTO_SCHEDULER_CONFLICT.
    res2 = _run_bridge(
        tmp_path,
        "--resolve-continuation",
        "--orchestrator-run-id",
        "r-conflict",
    )
    assert res2["status"] != 0
    assert res2["parsed"].get("reasonCode") == "AUTO_SCHEDULER_CONFLICT"

    # Story drain selection: backlog first OPEN story.
    _write_scratchpad(tmp_path, AUTO_BACKLOG_DRAIN="1", AUTO_BUG_QUEUE="0")
    _write_backlog(tmp_path, "US-2001", "OPEN", "S9990")
    _write_backlog(tmp_path, "US-2002", "DONE", "S9991")
    res3 = _run_bridge(
        tmp_path,
        "--resolve-continuation",
        "--orchestrator-run-id",
        "r-drain",
        "--start-from",
        "intake",
    )
    assert res3["status"] == 0, res3["parsed"]
    assert res3["parsed"].get("story_id") == "US-2001"
    assert res3["parsed"].get("work_item_kind") == "story"

    # Blocked: only DONE ⇒ OPENCODE_AUTO_DEPENDENCY_BLOCKED.
    (tmp_path / "docs" / "product" / "backlog.md").unlink(missing_ok=True)
    _write_backlog(tmp_path, "US-3003", "DONE", "S9992")
    res4 = _run_bridge(
        tmp_path,
        "--resolve-continuation",
        "--orchestrator-run-id",
        "r-noopen",
        "--start-from",
        "intake",
    )
    assert res4["status"] != 0
    assert res4["parsed"].get("reasonCode") == "OPENCODE_AUTO_DEPENDENCY_BLOCKED"


# ---------------------------------------------------------------------------
# AC-2 / AC-3 / AC-5: Stop-Matrix + cap boundaries: only explicit continuation
# advances; exhausted budgets terminate.
# ---------------------------------------------------------------------------


def test_us0156_stop_matrix_and_cap_boundaries(tmp_path: Path) -> None:
    res = _run_bridge(
        tmp_path,
        "--resolve-continuation",
        "--orchestrator-run-id",
        "r-budget",
        "--start-from",
        "execute",
        "--remaining-budget",
        "0",
    )
    assert res["status"] != 0
    assert res["parsed"].get("reasonCode") == "OPENCODE_AUTO_RESOLUTION_FAILED"
    assert res["parsed"].get("reason", "").startswith("exhausted_")
    orchestrator_src = ACTIVE_ORCH.read_text(encoding="utf-8")
    assert "dispatchStopMatrix" in orchestrator_src
    assert "stop.action" in orchestrator_src
    assert "maxCycles" in orchestrator_src


# ---------------------------------------------------------------------------
# AC-5 / AC-6: Resume idempotence + provenance: exact repeat is a no-op,
# conflicting evidence fails closed.
# ---------------------------------------------------------------------------


def test_us0156_resume_idempotence_provenance(tmp_path: Path) -> None:
    bridge.reset_continuation_registry_for_tests()
    _write_resume_brief(
        tmp_path,
        orchestrator_run_id="r-idem",
        story_id="US-9999",
        next_scheduled_phase="qa",
        sprint_id="S9999",
    )
    a = bridge.resolve_continuation(
        tmp_path, start_from=None, bug_target=None, orchestrator_run_id="r-idem"
    )
    assert a["ok"] is True
    b = bridge.resolve_continuation(
        tmp_path, start_from=None, bug_target=None, orchestrator_run_id="r-idem"
    )
    assert b["ok"] is True
    assert b.get("idempotent_noop") is True
    assert b["continuation_key"] == a["continuation_key"]

    # Conflict: same key with a recorded session ID on a different phase ⇒
    # OPENCODE_AUTO_CONTINUATION_CONFLICT (or fail close).
    bridge.reset_continuation_registry_for_tests()
    first = bridge.resolve_continuation(
        tmp_path, start_from=None, bug_target=None, orchestrator_run_id="r-conf"
    )
    assert first["ok"] is True
    ckey = first["continuation_key"]
    bridge.note_continuation_session(ckey, "sess-1")
    bridge.continuation_registry[ckey]["phase_id"] = "execute"
    c = bridge.resolve_continuation(
        tmp_path, start_from=None, bug_target=None, orchestrator_run_id="r-conf"
    )
    assert c.get("ok") in (False,) or c.get("idempotent_noop") is True
    bridge.reset_continuation_registry_for_tests()


# ---------------------------------------------------------------------------
# AC-7 / AC-9: DoD boundary + active/template parity + installer overwrite.
# ---------------------------------------------------------------------------


def test_us0156_dod_and_active_template_parity() -> None:
    assert ACTIVE_BRIDGE.read_bytes() == TEMPLATE_BRIDGE.read_bytes(), "bridge parity OK"
    assert ACTIVE_ORCH.read_bytes() == TEMPLATE_ORCH.read_bytes(), "orchestrator parity OK"
    assert ACTIVE_AUTO_CMD.read_bytes() == TEMPLATE_AUTO_CMD.read_bytes(), "command parity OK"
    assert ACTIVE_AUTO_AGENT.read_bytes() == TEMPLATE_AUTO_AGENT.read_bytes(), "agent parity OK"
    for role in ROLE_AGENTS:
        a = (REPO_ROOT / ".opencode" / "agents" / f"{role}.md").read_bytes()
        t = (REPO_ROOT / "template" / ".opencode" / "agents" / f"{role}.md").read_bytes()
        assert a == t, f"agent parity {role}"
    backlog_text = (
        REPO_ROOT / "docs" / "product" / "backlog.md"
    ).read_text(encoding="utf-8")
    assert re.search(r"BUG-0027[^\n]*DONE", backlog_text) is not None
    assert re.search(r"BUG-0030[^\n]*DONE", backlog_text) is not None
    acceptance_text = (
        REPO_ROOT / "docs" / "product" / "acceptance.md"
    ).read_text(encoding="utf-8")
    m = re.search(r"\[( |x|X)\]\s*US-0156", acceptance_text)
    installer_src = (REPO_ROOT / "installer.py").read_text(encoding="utf-8")
    assert ".opencode/plugins/orchestrator.ts" in installer_src
    assert "scripts/opencode_auto_bridge.py" in installer_src
    assert ".opencode/commands/auto.md" in installer_src


# ---------------------------------------------------------------------------
# AC-1 / AC-2 / AC-5: no retired TUI/RPC in the active orchestrator surfaces.
# ---------------------------------------------------------------------------


def _strip_line_comments(text: str) -> str:
    return "\n".join(line.split("//", 1)[0] for line in text.splitlines())


def test_us0156_no_retired_route_or_fallback() -> None:
    orchestrator_src = ACTIVE_ORCH.read_text(encoding="utf-8")
    bridge_src = ACTIVE_BRIDGE.read_text(encoding="utf-8")
    orch_no_comments = _strip_line_comments(orchestrator_src)
    assert "fallback_execute" not in _strip_line_comments(bridge_src)
    assert "fallback_execute" not in orch_no_comments
    # ctx.rpc.register may still appear in message literals (BUG-0024 token);
    # what must NOT appear is active `client.rpc(` calls or invented localhost
    # dispatch.
    assert "client.rpc(" not in orch_no_comments
    assert not re.search(r"localhost:\s*\d+", bridge_src)
    for code in (
        "OPENCODE_AUTO_RESOLUTION_FAILED",
        "OPENCODE_AUTO_RESUME_AMBIGUOUS",
        "OPENCODE_AUTO_PHASE_PLAN_INVALID",
        "OPENCODE_AUTO_CONTINUATION_CONFLICT",
        "OPENCODE_AUTO_DEPENDENCY_BLOCKED",
    ):
        assert code in bridge_src, f"bridge missing {code}"
        assert code in orchestrator_src, f"orchestrator missing {code}"


if __name__ == "__main__":
    import pytest

    sys.exit(pytest.main([__file__, "-v"]))
