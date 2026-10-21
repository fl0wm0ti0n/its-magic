"""US-0158 contract: OpenCode /auto continues through recoverable stops.

Markers are the six `test_us0158_*` functions. US-0158 stays OPEN.
The security test does not read a dotenv file.
"""

from __future__ import annotations

import inspect
import json
import shutil
import subprocess
import sys
from pathlib import Path

SELF = Path(__file__).resolve().parent.parent
if SELF.name == "template":
    TEMPLATE_ROOT = SELF
    ACTIVE_ROOT = SELF.parent
else:
    ACTIVE_ROOT = SELF
    TEMPLATE_ROOT = SELF / "template"

sys.path.insert(0, str(ACTIVE_ROOT / "scripts"))

import auto_outer_driver as driver  # noqa: E402

HARNESS = ACTIVE_ROOT / "tests" / "us0158_hook_harness.mjs"
DRIVER = ACTIVE_ROOT / "scripts" / "auto_outer_driver.py"
YAML = ACTIVE_ROOT / "scripts" / "data" / "autonomy_stop_matrix.yaml"
PAIRS = (
    "scripts/auto_outer_driver.py",
    ".opencode/plugins/orchestrator.ts",
    ".opencode/agents/auto.md",
    ".opencode/commands/auto.md",
)
SEVEN = ("po", "tech-lead", "dev", "qa", "release", "curator", "security")
CLASSES = ("blocked", "ai_error", "aborted", "permission_dead_end")


def _node_bin() -> str:
    node = shutil.which("node")
    if not node:
        raise AssertionError("node not on PATH")
    return node


def _hook(scenario: str) -> dict:
    proc = subprocess.run(
        [_node_bin(), "--experimental-strip-types", str(HARNESS), scenario],
        capture_output=True,
        text=True,
        cwd=str(ACTIVE_ROOT),
    )
    if proc.returncode != 0:
        raise AssertionError(
            f"hook scenario {scenario!r} rc={proc.returncode} "
            f"stdout={proc.stdout!r} stderr={proc.stderr!r}"
        )
    return json.loads(proc.stdout)


def _driver(**kwargs: str) -> dict:
    cmd = [
        sys.executable,
        str(DRIVER),
        "--phase",
        kwargs.pop("phase", "execute"),
        "--role",
        kwargs.pop("role", "dev"),
    ]
    for key, val in kwargs.items():
        cmd.extend(["--" + key.replace("_", "-"), val])
    proc = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        cwd=str(ACTIVE_ROOT),
    )
    assert proc.returncode == 0, proc.stderr
    return json.loads(proc.stdout)


def _assert_pairs() -> None:
    for rel in PAIRS:
        active = (ACTIVE_ROOT / rel).read_bytes()
        template = (TEMPLATE_ROOT / rel).read_bytes()
        assert active == template, rel


def _class_flag(calls: list) -> list[str]:
    found = []
    for args in calls:
        if "--recoverable-class" in args:
            found.append(args[args.index("--recoverable-class") + 1])
    return found


def test_us0158_recoverable_classes_continue() -> None:
    """Each of the four tokens continues once, and the same phase is respawned."""
    _assert_pairs()
    absent_blocked = _driver(stop_reason="blocked")
    assert absent_blocked["action"] == "ledger_write", absent_blocked
    assert absent_blocked["next_phase"] is None, absent_blocked
    absent_error = _driver(stop_reason="error")
    assert absent_error["action"] == "hard_stop", absent_error
    assert absent_error["next_phase"] is None, absent_error
    absent_completed = _driver(stop_reason="completed")
    assert absent_completed["action"] == "spawn_next", absent_completed
    assert absent_completed["next_phase"] is None

    blocked = _driver(
        stop_reason="blocked",
        recoverable_class="blocked",
        reason_code="needs_input",
        blocked_subcode="transient",
    )
    assert blocked["action"] == "continue_same_phase", blocked
    assert blocked["next_phase"] == "execute", blocked
    ai_error = _driver(recoverable_class="ai_error", reason_code="ai_error")
    assert ai_error["action"] == "continue_same_phase", ai_error
    assert ai_error["next_phase"] == "execute"
    aborted = _driver(recoverable_class="aborted", reason_code="phase_aborted")
    assert aborted["action"] == "continue_same_phase", aborted
    assert aborted["next_phase"] == "execute"
    permission = _driver(
        recoverable_class="permission_dead_end",
        denied_agent="critic",
    )
    assert permission["action"] == "continue_same_phase", permission
    assert permission["next_phase"] == "execute"
    bare = _driver(stop_reason="error", recoverable_class="ai_error")
    assert bare["action"] == "hard_stop", bare
    assert bare["next_phase"] is None
    dependency = _driver(
        stop_reason="blocked",
        recoverable_class="blocked",
        reason_code="OPENCODE_AUTO_DEPENDENCY_BLOCKED",
    )
    assert dependency["action"] == "hard_stop", dependency
    drain = _driver(
        stop_reason="blocked",
        recoverable_class="blocked",
        reason_code="AUTO_BACKLOG_ON_BLOCK=skip",
    )
    assert drain["action"] == "hard_stop", drain
    assert "resolve_matrix_repair" not in DRIVER.read_text(encoding="utf-8")

    continued = _hook("continue-aborted")
    assert continued["ok"] is True, continued
    assert continued["cycles"] == 2, continued
    assert continued["agents"] == ["dev", "dev"], continued
    assert continued["markers"][0] != continued["markers"][1]
    assert _class_flag(continued["driverCalls"]) == ["aborted"], continued["driverCalls"]

    ai = _hook("continue-ai-error")
    assert ai["ok"] is True and ai["cycles"] == 2, ai
    assert _class_flag(ai["driverCalls"]) == ["ai_error"]
    blocked_run = _hook("continue-blocked")
    assert blocked_run["ok"] is True and blocked_run["cycles"] == 2, blocked_run
    assert _class_flag(blocked_run["driverCalls"]) == ["blocked"]
    perm = _hook("continue-permission")
    assert perm["ok"] is True and perm["cycles"] == 2, perm
    assert perm["agents"] == ["dev", "dev"], perm
    assert _class_flag(perm["driverCalls"]) == ["permission_dead_end"]
    assert "critic" not in perm["allowAfter"]
    assert perm["allowBefore"] == perm["allowAfter"]

    second = _hook("second-aborted")
    assert second["ok"] is False, second
    assert second["reasonCode"] == "phase_aborted", second
    assert second["cycles"] == 2, second
    assert _class_flag(second["driverCalls"]) == ["aborted"]
    direct = _hook("spawn-abort-direct")
    assert direct["abort"]["ok"] is False, direct
    assert direct["abort"]["reasonCode"] == "phase_aborted"
    assert direct["other"]["ok"] is True, direct
    assert direct["other"]["reasonCode"] is None
    hard = _hook("hard-blocked")
    assert hard["ok"] is False and hard["cycles"] == 1, hard
    assert hard["reasonCode"] == "isolation", hard
    bare_run = _hook("bare-error")
    assert bare_run["ok"] is False and bare_run["cycles"] == 1, bare_run
    assert bare_run["reasonCode"] == "error", bare_run
    assert _class_flag(bare_run["driverCalls"]) == []
    other = _hook("other-wait")
    assert other["ok"] is True and other["cycles"] == 1, other
    unsupported = _hook("missing-create")
    assert unsupported["reasonCode"] == "OPENCODE_PLUGIN_SPAWN_UNSUPPORTED", unsupported
    ignored = _hook("subtask-ignored")
    assert ignored["reasonCode"] == "OPENCODE_SUBTASK_IGNORED", ignored
    assert set(CLASSES) == {"blocked", "ai_error", "aborted", "permission_dead_end"}


def test_us0158_no_session_restart_prompt() -> None:
    """Agent and command text for the four classes do not ask for a session restart."""
    import re

    restart = re.compile(
        r"restart(?:\s+\w+){0,4}\s+session|start a new session|new opencode session",
        re.IGNORECASE,
    )
    for rel in (".opencode/agents/auto.md", ".opencode/commands/auto.md"):
        active = (ACTIVE_ROOT / rel).read_text(encoding="utf-8")
        template = (TEMPLATE_ROOT / rel).read_text(encoding="utf-8")
        assert active == template, rel
        for text in (active, template):
            assert "recoverable blocker" in text, rel
            assert "AI error" in text, rel
            assert "aborted phase" in text, rel
            assert re.search(r"permission\s+dead-end", text), rel
            assert "same run" in text, rel
            assert "quality" in text.lower() and "uat" in text.lower()
            assert "budget" in text.lower()
            assert restart.search(text) is None, rel
    command = (ACTIVE_ROOT / ".opencode" / "commands" / "auto.md").read_text(
        encoding="utf-8"
    )
    assert "parent stays read-only" in command.lower() or "read-only" in command.lower()


def test_us0158_security_hard_stops() -> None:
    """Dotenv tokens, secrets, and security_deny stay hard stops. This test reads no dotenv file."""
    for token in (".env", "secrets", "security_deny"):
        payload = _driver(
            recoverable_class="blocked",
            stop_reason="blocked",
            reason_code=token,
        )
        assert payload["action"] == "hard_stop", (token, payload)
        assert payload["next_phase"] is None, (token, payload)
        via_subcode = _driver(
            recoverable_class="ai_error",
            reason_code="ai_error",
            blocked_subcode=token,
        )
        assert via_subcode["action"] == "hard_stop", (token, via_subcode)
    secret = _driver(
        recoverable_class="aborted",
        reason_code="phase_aborted",
        blocked_subcode="secret",
    )
    assert secret["action"] == "hard_stop", secret
    for code in ("isolation", "strict_proof", "ownership"):
        payload = _driver(
            recoverable_class="blocked",
            stop_reason="blocked",
            blocked_subcode=code,
        )
        assert payload["action"] == "hard_stop", (code, payload)


def test_us0158_quality_and_budget_stay_terminal() -> None:
    """Quality, budget, qa_fail, and uat_fail do not continue."""
    text = YAML.read_text(encoding="utf-8")
    for code in ("QUALITY_EVIDENCE_FAILED", "BUDGET_EXHAUSTED"):
        start = text.index(f"- code: {code}")
        nxt = text.find("\n  - code:", start + 1)
        row = text[start:nxt if nxt != -1 else None]
        assert "stop_class: security_hard" in row, row
        assert "auto_repair_kind: n/a" in row, row
        assert "cap: 0" in row, row
    for code in (
        "QUALITY_EVIDENCE_FAILED",
        "BUDGET_EXHAUSTED",
        "qa_fail",
        "uat_fail",
    ):
        flagged = _driver(
            recoverable_class="blocked",
            stop_reason=code,
            reason_code=code,
        )
        assert flagged["action"] == "hard_stop", (code, flagged)
        assert flagged["next_phase"] is None
    for stop in ("qa_fail", "uat_fail"):
        today = _driver(stop_reason=stop)
        assert today["action"] == "ledger_write", today
        assert today["next_phase"] is None
        assert today["action"] != "continue_same_phase"
    for code in (
        "PHASE_ROLE_CAPABILITY_MISSING",
        "PHASE_ROLE_MISMATCH",
        "decision_gate",
        "pause_request",
        "loop_max",
        "PLUGIN_SPAWN_UNSUPPORTED",
        "OPENCODE_SUBTASK_IGNORED",
        "PLACEHOLDER_PARENT_REJECTED",
    ):
        payload = _driver(recoverable_class="ai_error", reason_code=code)
        assert payload["action"] == "hard_stop", (code, payload)


def test_us0158_orchestrator_cannot_write_pair() -> None:
    """Parent writers do not write state.md or resume_brief.md."""
    for writer in ("auto", "parent", "orchestrator"):
        decision = driver.continue_same_phase_parent_decision(writer)
        assert decision["writes_state"] is False, decision
        assert decision["writes_brief"] is False, decision
        assert decision["sets_resume_brief_auto_refresh"] is False, decision
        assert decision["calls_write_resume_pair"] is False, decision
    src = inspect.getsource(driver.continue_same_phase_parent_decision)
    assert "write_resume_pair(" not in src
    assert "RESUME_BRIEF_AUTO_REFRESH=" not in src
    orch = (ACTIVE_ROOT / ".opencode" / "plugins" / "orchestrator.ts").read_text(
        encoding="utf-8"
    )
    assert "write_resume_pair(" not in orch
    assert "RESUME_BRIEF_AUTO_REFRESH=" not in orch
    assert "resolve_matrix_repair" not in orch
    roles = _hook("roles")
    for writer, decision in roles["parent"].items():
        assert decision["writes_state"] is False, writer
        assert decision["writes_brief"] is False, writer
        assert decision["sets_resume_brief_auto_refresh"] is False, writer
        assert decision["calls_write_resume_pair"] is False, writer


def test_us0158_permission_dead_end_keeps_seven_roles() -> None:
    """No new Task role. A missing matrix role still fails closed. Critic stays tech-lead."""
    roles = _hook("roles")
    assert list(roles["allowlist"]) == list(SEVEN), roles["allowlist"]
    assert "critic" not in roles["matrix"]
    assert "sovereign-critic" not in roles["matrix"]
    assert roles["critic"]["spawn"] is True, roles["critic"]
    assert roles["critic"]["agent"] == "tech-lead"
    assert roles["critic"]["command"] == "/sovereign-critic"
    assert roles["off"]["spawn"] is False
    assert roles["missingTechLead"]["reasonCode"] == "PHASE_ROLE_CAPABILITY_MISSING"
    assert roles["missingQa"]["reasonCode"] == "PHASE_ROLE_CAPABILITY_MISSING"
    assert roles["denial"]["recoverableClass"] == "permission_dead_end"
    assert roles["denial"]["addToAllowlist"] is False
    assert roles["matrixMiss"]["reasonCode"] == "PHASE_ROLE_CAPABILITY_MISSING"
    assert "recoverableClass" not in roles["matrixMiss"]
    missing = _hook("missing-matrix-role")
    assert missing["ok"] is False, missing
    assert missing["reasonCode"] == "PHASE_ROLE_CAPABILITY_MISSING", missing
    assert missing["createCount"] == 0, missing
    perm = _hook("continue-permission")
    assert perm["agents"] == ["dev", "dev"], perm
    assert "critic" not in perm["allowAfter"]
    assert perm["allowBefore"] == list(SEVEN)
    text = (ACTIVE_ROOT / ".opencode" / "agents" / "auto.md").read_text(
        encoding="utf-8"
    )
    for role in SEVEN:
        assert f"{role}: allow" in text, role
    assert "critic: allow" not in text
    assert "sovereign-critic: allow" not in text
    assert "error" in driver.HARD_STOP_REASONS
    assert "blocked" in driver.RECOVERABLE_STOP_REASONS
    names = [
        item
        for item in globals()
        if item.startswith("test_us0158_")
    ]
    assert names == [
        "test_us0158_recoverable_classes_continue",
        "test_us0158_no_session_restart_prompt",
        "test_us0158_security_hard_stops",
        "test_us0158_quality_and_budget_stay_terminal",
        "test_us0158_orchestrator_cannot_write_pair",
        "test_us0158_permission_dead_end_keeps_seven_roles",
    ]
