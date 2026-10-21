"""US-0157 contract: OpenCode critic hook and owning-child pair repair.

Markers are the four `test_us0157_*` functions. US-0157 stays OPEN.
"""

from __future__ import annotations

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

import opencode_auto_bridge as bridge  # noqa: E402
import owning_child_pair_repair_lib as repair  # noqa: E402
from token_cost_lib import compute_strict_proof_hash  # noqa: E402

HARNESS = ACTIVE_ROOT / "tests" / "us0157_hook_harness.mjs"
MAPPING = (
    "When `CROSS_MODEL_REVIEW=1`, the critic hook spawns tech-lead "
    "for `/sovereign-critic`."
)
PAIRS = (
    ".opencode/commands/sovereign-critic.md",
    ".opencode/agents/auto.md",
    ".opencode/commands/auto.md",
    ".opencode/plugins/orchestrator.ts",
)


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


def _pair(**overrides) -> dict:
    record = {
        "record_key": "auto-us0157|story|US-0157|execute|rp-us0157-test",
        "orchestrator_run_id": "auto-us0157",
        "work_item_kind": "story",
        "story_id": "US-0157",
        "bug_id": "(none)",
        "completed_phase": "execute",
        "writer_role": "dev",
        "role": "dev",
        "fresh_context_marker": "dev-us0157-test-20261016T214000Z-fresh",
        "resolution_source": "resume_brief",
        "effective_plan": ["spec", "plan", "build+verify", "ship"],
        "skipped_phases": ["intake", "plan-verify"],
        "completed_phases": ["intake", "execute"],
        "next_scheduled_phase": "qa",
        "next_scheduled_role": "qa",
        "phase_cursor": "build+verify/execute-pass",
        "budget_scope": "owning-child-repair",
        "stop_reason": "execute_complete_phase_boundary",
        "runtime_proof_id": "rp-us0157-test",
        "proof_issued_at": "2026-10-16T21:40:00Z",
        "proof_ttl_seconds": 3600,
        "phase_id": "execute",
    }
    supplied_hash = overrides.pop("proof_hash", None)
    record.update(overrides)
    if supplied_hash is None:
        record["proof_hash"] = compute_strict_proof_hash(
            record["orchestrator_run_id"],
            record["runtime_proof_id"],
            record["phase_id"],
            record["role"],
            record["proof_issued_at"],
            int(record["proof_ttl_seconds"]),
        )
        record["record_key"] = "|".join(
            [
                record["orchestrator_run_id"],
                record["work_item_kind"],
                record["story_id"],
                record["completed_phase"],
                record["runtime_proof_id"],
            ]
        )
    else:
        record["proof_hash"] = supplied_hash
    return record


def _child(**overrides) -> dict:
    child = {
        "writer_role": "dev",
        "orchestrator_run_id": "auto-us0157",
        "work_item_id": "US-0157",
        "completed_phase": "execute",
        "work_item_kind": "story",
    }
    child.update(overrides)
    return child


def _reset() -> None:
    bridge.reset_resume_pair_registry_for_tests()
    repair.reset_repair_attempts_for_tests()


def _prepare(tmp_path: Path) -> tuple[Path, Path]:
    state = tmp_path / "docs" / "engineering" / "state.md"
    brief = tmp_path / "handoffs" / "resume_brief.md"
    state.parent.mkdir(parents=True)
    brief.parent.mkdir(parents=True)
    state.write_text("ORIGINAL\n", encoding="utf-8")
    brief.write_text("OLD-BRIEF\n", encoding="utf-8")
    return state, brief


def test_us0157_critic_spawns_tech_lead() -> None:
    """CROSS_MODEL_REVIEW=1 spawns tech-lead. A missing critic key does not."""
    for rel in PAIRS:
        active = (ACTIVE_ROOT / rel).read_bytes()
        template = (TEMPLATE_ROOT / rel).read_bytes()
        assert active == template, rel
    command = (
        ACTIVE_ROOT / ".opencode" / "commands" / "sovereign-critic.md"
    ).read_text(encoding="utf-8")
    assert "agent: tech-lead" in command
    assert ".cursor/commands/sovereign-critic.md" in command
    assert "does not fork the rubric" in command
    assert "does not name a new Task role" in command
    for rel in (
        ".opencode/agents/auto.md",
        ".opencode/commands/auto.md",
    ):
        text = (ACTIVE_ROOT / rel).read_text(encoding="utf-8")
        assert MAPPING in text, rel
        assert "critic: allow" not in text
        assert "sovereign-critic: allow" not in text
    on = _hook("critic-on")
    assert on["ok"] is True and on["spawned"] is True, on
    assert on["role"] == "tech-lead", on
    assert on["calls"][0]["agent"] == "tech-lead", on
    assert on["calls"][0]["prompt"] == "/sovereign-critic", on
    assert on["reasonCode"] != "PHASE_ROLE_CAPABILITY_MISSING"
    off = _hook("critic-off")
    assert off["spawned"] is False and off["calls"] == [], off
    assert off["reasonCode"] is None, off
    missing_key = _hook("critic-no-critic-key")
    assert missing_key["spawned"] is True, missing_key
    assert missing_key["reasonCode"] != "PHASE_ROLE_CAPABILITY_MISSING"
    assert missing_key["calls"][0]["agent"] == "tech-lead"
    assert "critic" not in missing_key["matrix"]
    assert "sovereign-critic" not in missing_key["matrix"]
    assert repair.plan_critic_spawn(0)["spawn"] is False
    assert repair.plan_critic_spawn(1)["agent"] == "tech-lead"


def test_us0157_own_pair_repair_continues(tmp_path: Path) -> None:
    """The owning child repairs one predicate. A different writer is not repaired."""
    state, brief = _prepare(tmp_path)
    _reset()
    bad = _pair(proof_hash="bad")
    owned = repair.continue_after_pair(
        tmp_path,
        child=_child(),
        state_tuple=bad,
        brief_tuple=dict(bad),
    )
    assert owned["action"] == "continue", owned
    assert owned["next_scheduled_phase"] == "qa", owned
    assert owned["parent_wrote"] is False, owned
    assert owned["calls_write_resume_pair"] is False, owned
    assert owned["write_order"] == ["append_state_bottom", "prepend_brief"], owned
    assert owned["spawn_next_while_invalid"] is False, owned
    state_text = state.read_text(encoding="utf-8")
    brief_text = brief.read_text(encoding="utf-8")
    assert state_text.startswith("ORIGINAL\n"), state_text[:40]
    assert state_text.index("ORIGINAL") < state_text.index("rp-us0157-test")
    assert brief_text.index("record_key") < brief_text.index("OLD-BRIEF")
    digest = compute_strict_proof_hash(
        "auto-us0157",
        "rp-us0157-test",
        "execute",
        "dev",
        "2026-10-16T21:40:00Z",
        3600,
    )
    assert f'"proof_hash": "{digest}"' in state_text
    assert '"proof_hash": "bad"' not in state_text

    state2, brief2 = _prepare(tmp_path / "other")
    before = (state2.read_bytes(), brief2.read_bytes())
    _reset()
    foreign = repair.continue_after_pair(
        tmp_path / "other",
        child=_child(writer_role="qa"),
        state_tuple=bad,
        brief_tuple=dict(bad),
    )
    assert foreign["action"] == "stop", foreign
    assert foreign["spawn_repair"] is False, foreign
    assert foreign["next_scheduled_phase"] is None, foreign
    assert (state2.read_bytes(), brief2.read_bytes()) == before

    _reset()
    state3, _brief3 = _prepare(tmp_path / "conflict")
    left = _pair(runtime_proof_id="rp-us0157-conflict")
    right = _pair(
        runtime_proof_id="rp-us0157-conflict",
        next_scheduled_phase="release",
    )
    conflict = repair.continue_after_pair(
        tmp_path / "conflict",
        child=_child(),
        state_tuple=left,
        brief_tuple=right,
    )
    assert conflict["action"] == "continue", conflict
    assert conflict["next_scheduled_phase"] == "qa", conflict
    assert state3.read_text(encoding="utf-8").startswith("ORIGINAL\n")
    helper = (
        ACTIVE_ROOT / "scripts" / "owning_child_pair_repair_lib.py"
    ).read_text(encoding="utf-8")
    assert "write_resume_pair(" not in helper
    assert "repairable_blocker_lib" not in helper


def test_us0157_orchestrator_cannot_write_pair(tmp_path: Path) -> None:
    """Parent, auto, and orchestrator do not write the pair."""
    state, brief = _prepare(tmp_path)
    bad = _pair(proof_hash="bad")
    before = (state.read_bytes(), brief.read_bytes())
    for role in ("auto", "parent", "orchestrator"):
        _reset()
        result = repair.parent_consider_pair(
            tmp_path,
            child=_child(writer_role=role),
            state_tuple=bad,
            brief_tuple=dict(bad),
        )
        assert result["action"] == "stop", (role, result)
        assert result["spawn_repair"] is False, (role, result)
        assert result["parent_wrote"] is False, (role, result)
        assert result["writes_state"] is False, (role, result)
        assert result["writes_brief"] is False, (role, result)
        assert result["sets_resume_brief_auto_refresh"] is False, (role, result)
        assert result["calls_write_resume_pair"] is False, (role, result)
        assert (state.read_bytes(), brief.read_bytes()) == before
    decision = _hook("parent-no-write")
    assert decision["repair"]["writes_state"] is False, decision
    assert decision["repair"]["writes_brief"] is False, decision
    assert decision["repair"]["sets_resume_brief_auto_refresh"] is False, decision
    assert decision["repair"]["spawn_repair"] is True, decision
    assert decision["repair"]["spawn_next"] is False, decision
    assert decision["repair"]["charter"] == "repair-only", decision
    assert decision["foreign"]["spawn_repair"] is False, decision
    assert decision["parent"]["spawn_repair"] is False, decision
    for root in (ACTIVE_ROOT, TEMPLATE_ROOT):
        command = (root / ".opencode" / "commands" / "auto.md").read_text(
            encoding="utf-8"
        )
        assert MAPPING in command
        assert "validate_resume_pair" in command
        assert "does not write `docs/engineering/state.md`" in command
        assert "RESUME_BRIEF_AUTO_REFRESH" in command
        scratch = (root / ".cursor" / "scratchpad.md").read_text(encoding="utf-8")
        assert "RESUME_BRIEF_AUTO_REFRESH=0" in scratch
        assert "AUTONOMY_STOP_POLICY=block" in scratch


def test_us0157_security_denies_stay_hard(tmp_path: Path) -> None:
    """Hard denies, a real capability miss, and expired_ttl stay outside repair."""
    secret = tmp_path / ".env"
    secret.write_text("TOKEN=hidden\n", encoding="utf-8")
    before = secret.read_bytes()
    for action in ("env_read", "secrets", "credential_theft"):
        denied = repair.deny_hard_security(action)
        assert denied["performed"] is False, denied
        assert denied["hard_stop"] is True, denied
        assert denied["read_env"] is False, denied
        assert denied["member_of_repair"] is False, denied
        assert denied["recognized"] is True, denied
    assert secret.read_bytes() == before
    missing = repair.delivery_role_capability(
        "qa",
        [role for role in repair.TASK_ALLOWLIST if role != "qa"],
    )
    assert missing["ok"] is False, missing
    assert missing["reasonCode"] == "PHASE_ROLE_CAPABILITY_MISSING", missing
    node_missing = _hook("delivery-missing")
    assert node_missing["reasonCode"] == "PHASE_ROLE_CAPABILITY_MISSING", node_missing
    tech_lead = _hook("tech-lead-missing")
    assert tech_lead["spawned"] is False, tech_lead
    assert tech_lead["reasonCode"] == "PHASE_ROLE_CAPABILITY_MISSING", tech_lead
    assert tech_lead["calls"] == [], tech_lead
    state, brief = _prepare(tmp_path / "expired")
    prior = (state.read_bytes(), brief.read_bytes())
    _reset()
    expired = repair.continue_after_pair(
        tmp_path / "expired",
        child=_child(),
        state_tuple=_pair(),
        brief_tuple=_pair(),
        known_predicate="expired_ttl",
    )
    assert expired["action"] == "stop", expired
    assert expired["spawn_repair"] is False, expired
    assert expired["predicate"] == "expired_ttl", expired
    assert expired["next_scheduled_phase"] is None, expired
    assert (state.read_bytes(), brief.read_bytes()) == prior
    helper = (
        ACTIVE_ROOT / "scripts" / "owning_child_pair_repair_lib.py"
    ).read_text(encoding="utf-8")
    assert "evaluate_expired_proof" not in helper
    assert "resolve_matrix_repair" not in helper
    assert "repairable_blocker_lib" not in helper
    yaml_text = (
        ACTIVE_ROOT / "scripts" / "data" / "autonomy_stop_matrix.yaml"
    ).read_text(encoding="utf-8")
    for code in ("PHASE_ROLE_CAPABILITY_MISSING", "RESUME_BRIEF_STALE"):
        start = yaml_text.index(f"code: {code}")
        window = yaml_text[start : start + 240]
        assert "stop_class: security_hard" in window, window
        assert "auto_repair_kind: n/a" in window, window
        assert "cap: 0" in window, window
