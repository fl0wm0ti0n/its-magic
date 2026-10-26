"""BUG-0044 / S0186 — phase-boundary continuation-pair + terminal-state reconcile contract tests.

Six locked markers per `docs/engineering/architecture.md` `# BUG-0044` Lock 5
(composing on DEC-0153 / DEC-0156, BUG-0035 pair surface, and the release UAT
gate of `.cursor/commands/release.md`):

  1. test_bug0044_command_contract_presence_and_parity
  2. test_bug0044_pair_write_byte_identity
  3. test_bug0044_missing_conflicting_pair_fail_closed
  4. test_bug0044_terminal_state_reconcile_uat
  5. test_bug0044_no_parent_proof_minting
  6. test_bug0044_replay_idempotence

Fixture/mock contract tests only; no live host claim (UAT_PROBE_FORBIDDEN),
no network, no publish, no .env reads. Registry isolation via
`reset_resume_pair_registry_for_tests`; temp-repo fixtures under tmp_path.
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

SELF = Path(__file__).resolve().parent.parent

# Resolve the active repo root and its template twin from either location so
# that this file remains byte-identical between tests/ and template/tests/.
if SELF.name == "template":
    TEMPLATE_ROOT = SELF
    ACTIVE_ROOT = SELF.parent
else:
    ACTIVE_ROOT = SELF
    TEMPLATE_ROOT = SELF / "template"

sys.path.insert(0, str(ACTIVE_ROOT / "scripts"))

import opencode_auto_bridge as bridge  # noqa: E402
import token_cost_lib  # noqa: E402

STALE = bridge.RESUME_BRIEF_STALE
UNPARSEABLE = bridge.RESUME_BRIEF_UNPARSEABLE

COMMANDS = ("discovery", "execute", "sprint-plan", "qa", "verify-work", "release", "closure")
HOSTS = (
    ACTIVE_ROOT / ".opencode",
    ACTIVE_ROOT / "template" / ".opencode",
    ACTIVE_ROOT / ".cursor",
    ACTIVE_ROOT / "template" / ".cursor",
)


def _reset() -> None:
    bridge.reset_resume_pair_registry_for_tests()


def _lock1_section() -> str:
    """Extract the verbatim Lock-1 section from the architecture.md fence."""
    arch = (ACTIVE_ROOT / "docs" / "engineering" / "architecture.md").read_bytes().decode("utf-8")
    lines = arch.split("\n")
    i = next(j for j, l in enumerate(lines) if l.startswith("## Lock 1"))
    fo = next(j for j in range(i + 1, len(lines)) if lines[j] == "````markdown")
    fc = next(j for j in range(fo + 1, len(lines)) if lines[j] == "````")
    section = "\n".join(lines[fo + 1 : fc])
    assert section.startswith("## Continuation + terminal-state reconcile contract")
    assert section.endswith("phase.")
    return section


def execute_record(**overrides) -> dict:
    """A canonical, internally-consistent execute-phase pair record.

    Mirrors the real BUG-0044 execute checkpoint record shape (39 keys; the 36
    US-0164 verify-work keys plus invocation_mode / requested_start_from /
    resolution_status). The strict 6-tuple proof hash is computed hermetically
    via `token_cost_lib.compute_strict_proof_hash` so the fixture is
    self-validating (no hardcoded hash constant).
    """
    rec = {
        "CROSS_MODEL_REVIEW": 0,
        "RESUME_BRIEF_AUTO_REFRESH": 0,
        "budget_scope": "OPEN/P1 bug BUG-0044; execute-only; S0186 T-anch..T-005 delivered "
        "(Locks 1-5) + DEC-0153 state/brief pair; no automatic phase spawn",
        "bug_id": "BUG-0044",
        "child_isolation_ref": "docs/engineering/state.md#bug-0044-execute-20261025T202347Z",
        "completed_phase": "execute",
        "completed_phases": ["intake", "discovery", "research", "architecture", "sprint-plan", "execute"],
        "decision_gate": False,
        "delivery_mode": "ultra_lean",
        "effective_plan": ["spec", "plan", "build+verify", "ship"],
        "fresh_context_marker": "dev-BUG0044-execute-20261025T202347Z-fresh",
        "invocation_mode": "auto",
        "memory_layer": "pack",
        "model_id": "zelisko_llm/qwen3.8-27b",
        "model_provenance": "provenance=host=opencode; fresh canonical phase child (dev execute)",
        "next_scheduled_phase": "qa",
        "next_scheduled_role": "qa",
        "orchestrator_run_id": "auto-20261025-bug0044",
        "phase_boundary": "execute",
        "phase_cursor": "build+verify/execute-pass",
        "phase_id": "execute",
        "proof_hash": "x" * 64,  # replaced below with the true recompute
        "proof_issued_at": "2026-10-25T20:23:47Z",
        "proof_ttl_seconds": 3600,
        "record_key": "auto-20261025-bug0044|bug|BUG-0044|execute|"
        "rp-auto-20261025-bug0044-execute-dev-20261025T202347Z-BUG-0044",
        "reinstatement_mode": "none",
        "requested_start_from": "(none)",
        "resolution_source": "resume_brief",
        "resolution_status": "resolved",
        "role": "dev",
        "runtime_proof_id": "rp-auto-20261025-bug0044-execute-dev-20261025T202347Z-BUG-0044",
        "skipped_phases": [],
        "sprint_id": "S0186",
        "stop_matrix_action": "STOP_AFTER_EXECUTE_PASS; validate_pair_then_parent_may_spawn_qa",
        "stop_reason": "execute_complete_phase_boundary",
        "story_id": "(none)",
        "verdict": "EXECUTE_PASS",
        "work_item_kind": "bug",
        "writer_role": "dev",
    }
    rec["proof_hash"] = token_cost_lib.compute_strict_proof_hash(
        rec["orchestrator_run_id"],
        rec["runtime_proof_id"],
        rec["phase_id"],
        rec["role"],
        rec["proof_issued_at"],
        int(rec["proof_ttl_seconds"]),
    )
    rec.update(overrides)
    return rec


# -- marker 1: Lock 1 / Lock 2 — command contract presence + host parity ----

def test_bug0044_command_contract_presence_and_parity() -> None:
    """Every remediation command carries the Lock-1 section; 4-host byte parity."""
    section = _lock1_section().encode("utf-8")
    for host in HOSTS:
        for name in COMMANDS:
            p = host / "commands" / (name + ".md")
            assert p.is_file(), f"missing remediation command {p}"
            b = p.read_bytes()
            assert b"\r\n" not in b, f"CRLF in {p}"
            assert b.count(section) == 1, f"Lock-1 section count != 1 in {p}"
            if host.name == ".opencode":
                assert b.endswith(b"STOP\n"), f"{p} must end with the STOP line"
                assert b[: -len(b"STOP\n")].endswith(section + b"\n\n"), f"bad separation before STOP in {p}"
            else:
                assert b.endswith(section + b"\n"), f"{p} must end with the Lock-1 section at EOF"
    # 14 active/template byte-parity pairs (7 commands x 2 host pairs)
    pairs = 0
    for name in COMMANDS:
        for sub in (".opencode", ".cursor"):
            a = (ACTIVE_ROOT / sub / "commands" / (name + ".md")).read_bytes()
            t = (TEMPLATE_ROOT / sub / "commands" / (name + ".md")).read_bytes()
            assert a == t, f"byte-parity FAIL: {sub}/commands/{name}.md"
            pairs += 1
    assert pairs == 14, pairs
    # bridge twins stay byte-identical (Lock 2)
    assert (
        (ACTIVE_ROOT / "scripts" / "opencode_auto_bridge.py").read_bytes()
        == (TEMPLATE_ROOT / "scripts" / "opencode_auto_bridge.py").read_bytes()
    ), "byte-parity FAIL: scripts/opencode_auto_bridge.py"
    # the spawn-only parent (auto.md, all 4 hosts) is OUT of the remediation set
    for host in HOSTS:
        ap = host / "commands" / "auto.md"
        assert ap.is_file(), f"missing parent command {ap}"
        assert section not in ap.read_bytes(), f"parent command was edited: {ap}"


# -- marker 2: Lock 1 step 2/4 — pair write byte-identity -------------------

def test_bug0044_pair_write_byte_identity(tmp_path: Path) -> None:
    """A fixture child's state-bottom == brief-top; 20/20 locked fields; hash MATCH."""
    _reset()
    rec = execute_record()
    line = token_cost_lib.canonical_json_dumps(rec)
    # 39-key shape == the sprint-plan record key-set of the same run
    assert len(rec) == 39, len(rec)
    # (a) the fixture child writes both sides: state-bottom (append) +
    #     brief-top (prepend pointer block) — temp-file-plus-replace semantics
    state_path = tmp_path / "state.md"
    state_path.write_text("# state\n" + line + "\n", encoding="utf-8")
    brief_path = tmp_path / "resume_brief.md"
    header = (
        f"# Resume Brief — BUG-0044 CONTINUATION PAIR — {rec['record_key']}\n"
        f" (role={rec['writer_role']})\n\n"
        f"```json\n{line}\n```\n"
    )
    brief_path.write_text(header, encoding="utf-8")
    # extract both sides
    state_line = state_path.read_text(encoding="utf-8").strip().splitlines()[-1]
    brief_json = brief_path.read_text(encoding="utf-8").split("```json\n")[1].split("\n```")[0].strip()
    assert state_line == brief_json, "state-bottom and brief-top must be byte-identical"
    assert hashlib.sha256(state_line.encode("utf-8")).hexdigest() == \
        hashlib.sha256(brief_json.encode("utf-8")).hexdigest()
    # (b) 20/20 PAIR_LOCKED_FIELDS present on both sides
    for field in bridge.PAIR_LOCKED_FIELDS:
        assert field in rec, f"missing locked field {field}"
        assert field in json.loads(brief_json), f"brief side missing {field}"
    assert len(bridge.PAIR_LOCKED_FIELDS) == 20
    # (c) strict 6-tuple hash MATCH: lib + independent compact sorted-key recompute
    recomputed = token_cost_lib.compute_strict_proof_hash(
        rec["orchestrator_run_id"], rec["runtime_proof_id"], rec["phase_id"],
        rec["role"], rec["proof_issued_at"], int(rec["proof_ttl_seconds"]),
    )
    independent = hashlib.sha256(
        json.dumps(
            {
                "orchestrator_run_id": rec["orchestrator_run_id"],
                "runtime_proof_id": rec["runtime_proof_id"],
                "phase_id": rec["phase_id"],
                "role": rec["role"],
                "proof_issued_at": rec["proof_issued_at"],
                "proof_ttl_seconds": int(rec["proof_ttl_seconds"]),
            },
            sort_keys=True, separators=(",", ":"),
        ).encode("utf-8")
    ).hexdigest()
    assert recomputed == independent, "two-method hash mismatch"
    assert recomputed == rec["proof_hash"], "stored proof_hash must equal the recompute"
    # (d) the pre-STOP self-check composes on validate_resume_pair and passes
    before = (state_path.read_bytes(), brief_path.read_bytes())
    out = bridge.phase_boundary_self_check(
        tmp_path, writer_role="dev", state_json=state_line, brief_json=brief_json,
    )
    assert out["ok"] is True, out
    assert out.get("idempotent_noop") is False, out
    assert out.get("reasonCode") is None, out
    assert out.get("next_scheduled_phase") == "qa", out
    assert out.get("key") == rec["record_key"], out
    after = (state_path.read_bytes(), brief_path.read_bytes())
    assert before == after, "phase_boundary_self_check must write nothing"


# -- marker 3: missing / conflicting pair — deterministic fail-closed -------

def test_bug0044_missing_conflicting_pair_fail_closed(tmp_path: Path) -> None:
    """Absent/unparseable/conflicting pairs stop with the retained predicate."""
    rec = execute_record()
    good = token_cost_lib.canonical_json_dumps(rec)
    # (a) state side unparseable
    out = bridge.phase_boundary_self_check(
        tmp_path, writer_role="dev", state_json="{not-json", brief_json=good,
    )
    assert out["ok"] is False and out.get("reasonCode") == UNPARSEABLE, out
    assert out.get("predicate") == "pair_json_unparseable:state", out
    assert out.get("next_scheduled_phase") is None, out
    # (b) brief side unparseable
    out = bridge.phase_boundary_self_check(
        tmp_path, writer_role="dev", state_json=good, brief_json="[",
    )
    assert out["ok"] is False and out.get("reasonCode") == UNPARSEABLE, out
    assert out.get("predicate") == "pair_json_unparseable:brief", out
    # (c) non-object state record
    out = bridge.phase_boundary_self_check(
        tmp_path, writer_role="dev", state_json="[]", brief_json=good,
    )
    assert out["ok"] is False and out.get("reasonCode") == UNPARSEABLE, out
    assert out.get("predicate") == "pair_record_not_object:state", out
    # (d) conflicting sides (record_key differs on the brief side)
    conflicting = dict(rec)
    conflicting["record_key"] = rec["record_key"] + "|conflict"
    out = bridge.phase_boundary_self_check(
        tmp_path, writer_role="dev", state_json=good,
        brief_json=token_cost_lib.canonical_json_dumps(conflicting),
    )
    assert out["ok"] is False and out.get("reasonCode") == STALE, out
    assert out.get("predicate") == "pair_not_byte_identical", out
    assert out.get("next_scheduled_phase") is None, out
    # (e) byte-identical sides but wrong writer role -> composed retained predicate
    out = bridge.phase_boundary_self_check(
        tmp_path, writer_role="tech-lead", state_json=good, brief_json=good,
    )
    assert out["ok"] is False and out.get("reasonCode") == STALE, out
    assert out.get("predicate") == "writer_role_mismatch", out


# -- marker 4: Lock 3 — terminal-state reconcile (verify-work UAT) ----------

def release_uat_gate(uat: object) -> str:
    """Fixture-level model of the `.cursor/commands/release.md` UAT gate.

    Placeholder/incomplete UAT (empty or template-only steps, or steps without
    results) -> RELEASE_UAT_INCOMPLETE; an unresolved failed step ->
    RELEASE_UAT_FAILED; otherwise the terminal verify-work state passes.
    """
    if not isinstance(uat, dict):
        return "RELEASE_UAT_INCOMPLETE"
    if not (
        uat.get("status") == "VERIFY_PASS"
        and uat.get("phase_id") == "verify-work"
        and uat.get("uat_lifecycle") == "verify_work_complete_release_pending"
    ):
        return "RELEASE_UAT_INCOMPLETE"
    steps = uat.get("steps")
    if not isinstance(steps, list) or not steps:
        return "RELEASE_UAT_INCOMPLETE"
    for step in steps:
        if not isinstance(step, dict) or not step.get("result"):
            return "RELEASE_UAT_INCOMPLETE"
        if step["result"] in ("FAIL", "FAILED", "FAIL_UNRESOLVED"):
            return "RELEASE_UAT_FAILED"
    return "RELEASE_GATE_PASS"


def test_bug0044_terminal_state_reconcile_uat() -> None:
    """verify-work leaves uat.json terminal; stale QA state still fails the gate."""
    terminal = {
        "sprint_id": "S0185",
        "story_id": "US-0164",
        "phase_id": "verify-work",
        "status": "VERIFY_PASS",
        "uat_lifecycle": "verify_work_complete_release_pending",
        "reason_code": "VERIFY_PASS",
        "steps": [
            {"ac": "AC-1", "result": "PASS", "detail": "contract markers pass"},
            {"ac": "AC-2", "result": "PASS", "detail": "stop-matrix rows present"},
        ],
    }
    stale = {
        "sprint_id": "S0185",
        "story_id": "US-0164",
        "phase_id": "qa",
        "status": "QA_PASS",
        "uat_lifecycle": "qa_complete_verify_work_pending",
        "reason_code": "QA_PASS",
        "steps": [{"ac": "AC-1", "result": "PASS", "detail": "qa-only partial step"}],
    }
    failed = dict(terminal)
    failed["steps"] = [
        {"ac": "AC-1", "result": "PASS", "detail": "ok"},
        {"ac": "AC-2", "result": "FAIL_UNRESOLVED", "detail": "unresolved failure"},
    ]
    assert release_uat_gate(terminal) == "RELEASE_GATE_PASS"
    assert release_uat_gate(stale) == "RELEASE_UAT_INCOMPLETE"
    assert release_uat_gate(failed) == "RELEASE_UAT_FAILED"
    # Lock-3 canonical row: verify-work's terminal UAT state is documented
    arch = (ACTIVE_ROOT / "docs" / "engineering" / "architecture.md").read_text(encoding="utf-8")
    row = next(l for l in arch.split("\n") if l.startswith("| verify-work |"))
    assert "status=VERIFY_PASS" in row and "phase_id=verify-work" in row
    assert "verify_work_complete_release_pending" in row
    # the gate reuses the EXISTING reason code (no new reason code, AC-2)
    assert "RELEASE_UAT_INCOMPLETE" in arch
    assert "RELEASE_UAT_FAILED" not in arch or "RELEASE_UAT_FAILED" in \
        (ACTIVE_ROOT / ".cursor" / "commands" / "release.md").read_text(encoding="utf-8")


# -- marker 5: no parent proof minting / absolute prohibition ---------------

def test_bug0044_no_parent_proof_minting(tmp_path: Path) -> None:
    """auto/parent/orchestrator can never author a pair; helper stays read-only."""
    _reset()
    rec = execute_record()
    good = token_cost_lib.canonical_json_dumps(rec)
    for bad_role in ("auto", "parent", "orchestrator"):
        out = bridge.phase_boundary_self_check(
            tmp_path, writer_role=bad_role, state_json=good, brief_json=good,
        )
        assert out["ok"] is False, (bad_role, out)
        assert out.get("reasonCode") == STALE, (bad_role, out)
        assert out.get("predicate") == "unauthorized_writer_role", (bad_role, out)
        assert out.get("next_scheduled_phase") is None, (bad_role, out)
        out = bridge.validate_resume_pair(
            tmp_path, writer_role=bad_role, state_tuple=rec, brief_tuple=rec,
        )
        assert out["ok"] is False and out.get("predicate") == "unauthorized_writer_role", (bad_role, out)
    # RESUME_BRIEF_AUTO_REFRESH=0 stays absolute in the record
    assert rec["RESUME_BRIEF_AUTO_REFRESH"] == 0
    assert rec["CROSS_MODEL_REVIEW"] == 0
    # the bridge documents the absolute prohibition
    src = (ACTIVE_ROOT / "scripts" / "opencode_auto_bridge.py").read_text(encoding="utf-8")
    assert "RESUME_BRIEF_AUTO_REFRESH=0" in src
    assert "absolute prohibition" in src
    # the helper writes nothing (valid AND invalid paths)
    state_path = tmp_path / "state.md"
    brief_path = tmp_path / "resume_brief.md"
    state_path.write_text(good + "\n", encoding="utf-8")
    brief_path.write_text(good + "\n", encoding="utf-8")
    before = (state_path.read_bytes(), brief_path.read_bytes())
    bridge.phase_boundary_self_check(
        tmp_path, writer_role="dev", state_json=good, brief_json=good,
    )
    bridge.phase_boundary_self_check(
        tmp_path, writer_role="auto", state_json=good, brief_json=good,
    )
    after = (state_path.read_bytes(), brief_path.read_bytes())
    assert before == after, "phase_boundary_self_check must never write artifacts"


# -- marker 6: replay idempotence -------------------------------------------

def test_bug0044_replay_idempotence() -> None:
    """Exact canonical replay is a no-op; same-key conflict fails closed."""
    rec = execute_record()
    good = token_cost_lib.canonical_json_dumps(rec)
    _reset()
    first = bridge.phase_boundary_self_check(
        ACTIVE_ROOT, writer_role="dev", state_json=good, brief_json=good,
    )
    assert first["ok"] is True and first.get("idempotent_noop") is False, first
    replay = bridge.phase_boundary_self_check(
        ACTIVE_ROOT, writer_role="dev", state_json=good, brief_json=good,
    )
    assert replay["ok"] is True and replay.get("idempotent_noop") is True, replay
    assert replay.get("predicate") == "exact_canonical_replay", replay
    assert replay.get("next_scheduled_phase") == "qa", replay
    # a same-key record differing in a locked field -> replay_conflict
    _reset()
    assert bridge.phase_boundary_self_check(
        ACTIVE_ROOT, writer_role="dev", state_json=good, brief_json=good,
    )["ok"] is True
    conflict = dict(rec)
    conflict["budget_scope"] = "drain everything (same key, different locked field)"
    conflict_json = token_cost_lib.canonical_json_dumps(conflict)
    out = bridge.phase_boundary_self_check(
        ACTIVE_ROOT, writer_role="dev", state_json=conflict_json, brief_json=conflict_json,
    )
    assert out["ok"] is False and out.get("reasonCode") == STALE, out
    assert out.get("predicate") == "replay_conflict", out


if __name__ == "__main__":
    import pytest

    sys.exit(pytest.main([__file__, "-q"]))
