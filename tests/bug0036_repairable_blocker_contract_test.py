"""BUG-0036 contract: repair continues, and block still stops.

Markers are the seven `test_bug0036_*` functions. The live policy assignment
stays `block`. The library does not read that assignment; callers pass it.
"""

from __future__ import annotations

import os
import sys
from datetime import datetime, timezone
from pathlib import Path

SELF = Path(__file__).resolve().parent.parent
if SELF.name == "template":
    TEMPLATE_ROOT = SELF
    ACTIVE_ROOT = SELF.parent
else:
    ACTIVE_ROOT = SELF
    TEMPLATE_ROOT = SELF / "template"

sys.path.insert(0, str(ACTIVE_ROOT / "scripts"))

import repairable_blocker_lib as repair  # noqa: E402
from token_cost_lib import compute_strict_proof_hash  # noqa: E402

STOP_FOREIGN = repair.STOP_FOREIGN_HARNESS
STALE = repair.STOP_STALE
UNPARSEABLE = repair.STOP_UNPARSEABLE
ISSUED = "2026-10-16T17:06:02Z"
EXPIRED_NOW = datetime(2026, 10, 16, 18, 6, 3, tzinfo=timezone.utc)


def _pair(**overrides) -> dict:
    record = {
        "record_key": "auto-bug0036|bug|BUG-0036|execute|rp-bug0036-test",
        "orchestrator_run_id": "auto-bug0036",
        "runtime_proof_id": "rp-bug0036-test",
        "phase_id": "execute",
        "role": "dev",
        "proof_issued_at": ISSUED,
        "proof_ttl_seconds": 3600,
        "proof_hash": "",
        "writer_role": "dev",
        "completed_phase": "execute",
        "next_scheduled_phase": "qa",
        "next_scheduled_role": "qa",
        "fresh_context_marker": "dev-bug0036-test-20261016T170602Z-fresh",
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
    else:
        record["proof_hash"] = supplied_hash
    return record


def _foreign(**overrides):
    payload = {
        "own_contract_passed": True,
        "failures": [
            {
                "name": "README_FEATURE_COVERAGE_GAP:BUG-0029",
                "path": "README.md",
                "owning_id": "BUG-0029",
            },
            {
                "name": "AUTO_BACKLOG_DRAIN",
                "path": ".cursor/scratchpad.md",
                "owning_id": "BUG-0026",
            },
        ],
        "active_work_item_id": "BUG-0036",
        "orchestrator_run_id": "auto-bug0036",
        "next_lawful_phase": "qa",
        "writer_role": "dev",
    }
    payload.update(overrides)
    return payload


def _later(**overrides) -> dict:
    candidate = {
        "stop_id": "synthetic_later_member",
        "blocks_next_lawful_action": True,
        "bounded_repair_restores_scheduling": True,
        "leaves_foreign_owners_unchanged": True,
        "outside_us0092_deny": True,
        "evidence_present": True,
        "evidence_consistent": True,
        "evidence_authorized": True,
        "repair_descriptor": {
            "kind": "schedule_next",
            "leaves_foreign_owners_unchanged": True,
            "outside_us0092_deny": True,
        },
    }
    candidate.update(overrides)
    return candidate


def _assignments(path: Path) -> dict[str, str]:
    found: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("AUTONOMY_STOP_POLICY=") or line.startswith("RESUME_BRIEF_AUTO_REFRESH="):
            key, value = line.split("=", 1)
            found[key] = value
    return found


def test_bug0036_foreign_harness_repair_continues(tmp_path: Path) -> None:
    """A repair value quarantines foreign owners and schedules the next phase."""
    forbidden = tmp_path / "tree"
    forbidden.mkdir()
    watched = {}
    for name in (
        "BUG-0026.md",
        "BUG-0029.md",
        "US-0162.md",
        "README.md",
        "scratchpad.md",
        "acceptance.md",
    ):
        path = forbidden / name
        path.write_text(name + "\n", encoding="utf-8")
        watched[path] = path.read_bytes()
    ledger = tmp_path / "ledger"
    kwargs = _foreign(ledger_dir=ledger)
    kwargs["failures"] = [
        {
            "name": "README_FEATURE_COVERAGE_GAP:BUG-0029",
            "path": str(forbidden / "README.md"),
            "owning_id": "BUG-0029",
        },
        {
            "name": "AUTO_BACKLOG_DRAIN",
            "path": str(forbidden / "scratchpad.md"),
            "owning_id": "BUG-0026",
        },
    ]
    for policy in (repair.POLICY_REPAIR_THEN_BLOCK, repair.POLICY_REPAIR_THEN_SKIP):
        run_ledger = ledger / policy
        result = repair.evaluate_foreign_harness(policy, **{**kwargs, "ledger_dir": run_ledger})
        assert result["member"] is True, result
        assert result["action"] == "continue", result
        assert result["schedules"] is True, result
        assert result["next_scheduled_phase"] == "qa", result
        assert result["quarantine_written"] is True, result
        assert result["owning_ids"] == ["BUG-0029", "BUG-0026"], result
        assert result["edited_paths"] == [str(run_ledger / "auto-bug0036.jsonl")], result
        rows = (run_ledger / "auto-bug0036.jsonl").read_text(encoding="utf-8")
        assert "BUG-0029" in rows and "BUG-0026" in rows
        assert "README_FEATURE_COVERAGE_GAP:BUG-0029" in rows
        assert "failure_name" in rows and "owning_id" in rows and "active_work_item_id" in rows
    for path, prior in watched.items():
        assert path.read_bytes() == prior, path
    in_scope = repair.evaluate_foreign_harness(
        repair.POLICY_REPAIR_THEN_BLOCK,
        **_foreign(
            ledger_dir=tmp_path / "in-scope",
            failures=[
                {
                    "name": "own-contract",
                    "path": "tests/bug0036_repairable_blocker_contract_test.py",
                    "owning_id": "BUG-0036",
                }
            ],
        ),
    )
    assert in_scope["member"] is False and in_scope["predicate"] == "in_scope_failure", in_scope
    assert not (tmp_path / "in-scope").exists()
    cap_ledger = tmp_path / "cap"
    for _ in range(3):
        ok = repair.evaluate_foreign_harness(
            repair.POLICY_REPAIR_THEN_BLOCK,
            **_foreign(ledger_dir=cap_ledger),
        )
        assert ok["action"] == "continue", ok
    blocked = repair.evaluate_foreign_harness(
        repair.POLICY_REPAIR_THEN_BLOCK,
        **_foreign(ledger_dir=cap_ledger),
    )
    assert blocked["action"] == "block" and blocked["schedules"] is False, blocked
    assert blocked["predicate"] == "cap_exhausted", blocked
    skip_ledger = tmp_path / "skip-cap"
    for _ in range(3):
        repair.evaluate_foreign_harness(
            repair.POLICY_REPAIR_THEN_SKIP,
            **_foreign(ledger_dir=skip_ledger, orchestrator_run_id="auto-skip"),
        )
    skipped = repair.evaluate_foreign_harness(
        repair.POLICY_REPAIR_THEN_SKIP,
        **_foreign(ledger_dir=skip_ledger, orchestrator_run_id="auto-skip"),
    )
    assert skipped["action"] == "skip" and skipped["skip_segment"] is True, skipped
    assert skipped["schedules"] is False, skipped


def test_bug0036_foreign_harness_block_stops(tmp_path: Path) -> None:
    """`block` still emits the foreign-harness stop and does not schedule."""
    prior = os.environ.get("AUTONOMY_STOP_POLICY")
    os.environ["AUTONOMY_STOP_POLICY"] = repair.POLICY_REPAIR_THEN_SKIP
    try:
        result = repair.evaluate_foreign_harness(
            repair.POLICY_BLOCK,
            **_foreign(ledger_dir=tmp_path / "ledger"),
        )
    finally:
        if prior is None:
            os.environ.pop("AUTONOMY_STOP_POLICY", None)
        else:
            os.environ["AUTONOMY_STOP_POLICY"] = prior
    assert result["action"] == "terminal", result
    assert result["stop_id"] == STOP_FOREIGN, result
    assert result["schedules"] is False and result["next_scheduled_phase"] is None, result
    assert result["quarantine_written"] is False, result
    assert not (tmp_path / "ledger").exists()
    yaml = (ACTIVE_ROOT / "scripts" / "data" / "autonomy_stop_matrix.yaml").read_text(encoding="utf-8")
    assert STOP_FOREIGN not in yaml
    block = yaml[yaml.index("code: RESUME_BRIEF_STALE"): yaml.index("code: RESUME_BRIEF_STALE") + 180]
    assert "security_hard" in block and "n/a" in block and "cap: 0" in block
    for root in (ACTIVE_ROOT, TEMPLATE_ROOT):
        assigned = _assignments(root / ".cursor" / "scratchpad.md")
        assert assigned["AUTONOMY_STOP_POLICY"] == "block", assigned
        assert assigned["RESUME_BRIEF_AUTO_REFRESH"] == "0", assigned
    active_matrix = (ACTIVE_ROOT / "docs" / "engineering" / "autonomy-stop-matrix.md").read_bytes()
    template_matrix = (TEMPLATE_ROOT / "docs" / "engineering" / "autonomy-stop-matrix.md").read_bytes()
    assert active_matrix == template_matrix
    assert b"## Repairable blocker overlay (BUG-0036)" in active_matrix
    assert b"## Autonomy-resolvable gates (10 codes)" in active_matrix
    lib = (ACTIVE_ROOT / "scripts" / "repairable_blocker_lib.py").read_bytes()
    assert lib == (TEMPLATE_ROOT / "scripts" / "repairable_blocker_lib.py").read_bytes()
    text = lib.decode("utf-8")
    for banned in ("resolve_matrix_repair", "attempt_repair", "scratchpad", "write_resume_pair("):
        assert banned not in text


def test_bug0036_expired_proof_repair_spawns_child(tmp_path: Path) -> None:
    """A repair value requests an authorized child. The parent writes neither file."""
    state_path = tmp_path / "docs" / "engineering" / "state.md"
    brief_path = tmp_path / "handoffs" / "resume_brief.md"
    state_path.parent.mkdir(parents=True)
    brief_path.parent.mkdir(parents=True)
    state_path.write_text("STATE\n", encoding="utf-8")
    brief_path.write_text("BRIEF\n", encoding="utf-8")
    before = (state_path.read_bytes(), brief_path.read_bytes())
    record = _pair()
    for policy in (repair.POLICY_REPAIR_THEN_BLOCK, repair.POLICY_REPAIR_THEN_SKIP):
        result = repair.classify_before_terminal_stale(
            policy,
            {
                "kind": "expired_proof",
                "state": record,
                "brief": dict(record),
                "writer_role": "dev",
                "now": EXPIRED_NOW,
                "ledger_dir": tmp_path / policy,
                "repo_root": tmp_path,
            },
        )
        assert result["spawn"] is True, result
        assert result["action"] == "spawn_child", result
        assert result["writer_role"] == "dev", result
        assert result["completed_phase"] == "execute", result
        assert result["parent_writes_state"] is False, result
        assert result["parent_writes_brief"] is False, result
        assert result["calls_write_resume_pair"] is False, result
        assert result["schedules_next_before_child_pair"] is False, result
        assert result["next_scheduled_phase"] is None, result
        assert result["same_next_scheduled_phase"] == "qa", result
        assert result["same_next_scheduled_role"] == "qa", result
        assert result["child_write_order"] == ["append_state_bottom", "prepend_brief"], result
        assert result["new_runtime_proof_id_required"] is True, result
        assert result["new_proof_hash_required"] is True, result
    assert (state_path.read_bytes(), brief_path.read_bytes()) == before
    active_auto = (ACTIVE_ROOT / ".cursor" / "commands" / "auto.md").read_text(encoding="utf-8")
    template_auto = (TEMPLATE_ROOT / ".cursor" / "commands" / "auto.md").read_text(encoding="utf-8")
    assert active_auto == template_auto
    call_at = active_auto.index("classify_before_terminal_stale")
    terminal_at = active_auto.index("Fail-closed vocabulary: syntax")
    assert call_at < terminal_at
    assert "does not call `write_resume_pair`" in " ".join(active_auto.split())
    assert "spawn-only" in active_auto
    assert "RESUME_BRIEF_AUTO_REFRESH" in active_auto


def test_bug0036_expired_proof_block_stays_stale(tmp_path: Path) -> None:
    """`block` stays stale and does not schedule."""
    record = _pair()
    result = repair.evaluate_expired_proof(
        repair.POLICY_BLOCK,
        state=record,
        brief=dict(record),
        writer_role="dev",
        now=EXPIRED_NOW,
        ledger_dir=tmp_path / "ledger",
        repo_root=tmp_path,
    )
    assert result["member"] is True, result
    assert result["reason_code"] == STALE, result
    assert result["stop_id"] == STALE, result
    assert result["spawn"] is False, result
    assert result["schedules"] is False and result["next_scheduled_phase"] is None, result
    assert not (tmp_path / "ledger").exists()
    fresh = repair.evaluate_expired_proof(
        repair.POLICY_REPAIR_THEN_BLOCK,
        state=record,
        brief=dict(record),
        writer_role="dev",
        now=datetime(2026, 10, 16, 18, 6, 2, tzinfo=timezone.utc),
        ledger_dir=tmp_path / "fresh",
    )
    assert fresh["member"] is False and fresh["predicate"] == "in_ttl", fresh
    assert fresh["schedules"] is False, fresh


def test_bug0036_bad_evidence_fail_closed(tmp_path: Path) -> None:
    """Missing, conflicting, and unauthorized evidence stay fail-closed."""
    policies = repair.POLICIES
    record = _pair()
    cases = [
        ("missing", {**record, "proof_issued_at": ""}, dict(record), "dev", "strict_proof_issued_at_missing"),
        ("conflict", record, {**record, "next_scheduled_phase": "execute"}, "dev", "tuple_conflict"),
        ("unauthorized", record, dict(record), "auto", "unauthorized_writer_role"),
        ("hash", {**_pair(proof_hash="ab" * 32)}, {**_pair(proof_hash="ab" * 32)}, "dev", "tuple_conflict"),
        ("malformed", {**_pair(proof_hash="0123")}, {**_pair(proof_hash="0123")}, "dev", "strict_proof_hash_invalid"),
        ("ttl", {**_pair(proof_ttl_seconds=0, proof_hash="ab" * 32)}, {**_pair(proof_ttl_seconds=0, proof_hash="ab" * 32)}, "dev", "strict_proof_ttl_invalid"),
    ]
    for policy in policies:
        for _name, state, brief, role, predicate in cases:
            result = repair.evaluate_expired_proof(
                policy,
                state=state,
                brief=brief,
                writer_role=role,
                now=EXPIRED_NOW,
                ledger_dir=tmp_path / policy,
            )
            assert result["member"] is False, (policy, predicate, result)
            assert result["action"] == "fail_closed", (policy, predicate, result)
            assert result["skip_applies"] is False, (policy, predicate, result)
            assert result["schedules"] is False, (policy, predicate, result)
            assert result["predicate"] == predicate, (policy, predicate, result)
        for predicate in repair.FAIL_CLOSED_STALE_PREDICATES:
            result = repair.evaluate_fail_closed(policy, reason_code=STALE, predicate=predicate)
            assert result["member"] is False and result["skip_applies"] is False, (policy, predicate, result)
            assert result["reason_code"] == STALE, (policy, predicate, result)
        for predicate in repair.FAIL_CLOSED_UNPARSEABLE_PREDICATES:
            result = repair.evaluate_fail_closed(
                policy, reason_code=UNPARSEABLE, predicate=predicate
            )
            assert result["reason_code"] == UNPARSEABLE, (policy, predicate, result)
            assert result["skip_applies"] is False, (policy, predicate, result)
        for code in repair.SECURITY_HARD_RUNTIME:
            result = repair.classify_before_terminal_stale(
                policy,
                {"kind": "fail_closed", "reason_code": code, "predicate": code},
            )
            assert result["member"] is False, (policy, code, result)
            assert result["reason_code"] == code, (policy, code, result)
            assert result["security_hard"] is True, (policy, code, result)
            assert result["skip_applies"] is False, (policy, code, result)


def test_bug0036_later_member_same_rule(tmp_path: Path) -> None:
    """A synthetic later member uses the same predicate and is neither session stop."""
    assert "synthetic_later_member" not in repair.SESSION_STOP_IDS
    continued = repair.evaluate_later_member(
        repair.POLICY_REPAIR_THEN_BLOCK,
        _later(),
        ledger_dir=tmp_path / "later",
        orchestrator_run_id="auto-later",
        next_lawful_phase="qa",
    )
    assert continued["member"] is True and continued["action"] == "continue", continued
    assert continued["next_scheduled_phase"] == "qa", continued
    assert continued["stop_id"] not in repair.SESSION_STOP_IDS, continued
    blocked = repair.evaluate_later_member(
        repair.POLICY_BLOCK,
        _later(),
        ledger_dir=tmp_path / "later-block",
        orchestrator_run_id="auto-later-block",
        next_lawful_phase="qa",
    )
    assert blocked["action"] == "terminal" and blocked["schedules"] is False, blocked
    assert blocked["stop_id"] == "synthetic_later_member", blocked
    missing = repair.evaluate_later_member(
        repair.POLICY_REPAIR_THEN_SKIP,
        _later(repair_descriptor=None),
        ledger_dir=tmp_path / "missing",
        orchestrator_run_id="auto-missing",
        next_lawful_phase="qa",
    )
    assert missing["member"] is False and missing["skip_applies"] is False, missing
    for session_stop in repair.SESSION_STOP_IDS:
        rejected = repair.evaluate_later_member(
            repair.POLICY_REPAIR_THEN_BLOCK,
            _later(stop_id=session_stop),
            ledger_dir=tmp_path / "session",
            orchestrator_run_id="auto-session",
            next_lawful_phase="qa",
        )
        assert rejected["member"] is False, (session_stop, rejected)
        assert rejected["predicate"] == "session_stop_not_later_member", rejected


def test_bug0036_us0092_denies_not_performed(tmp_path: Path) -> None:
    """Env reads, npm publish, and git push are not performed at any hardness."""
    secret = tmp_path / ".env"
    secret.write_text("TOKEN=hidden\n", encoding="utf-8")
    before = secret.read_bytes()
    for policy in repair.POLICIES:
        for action in ("env_read", "npm_publish", "git_push"):
            result = repair.deny_us0092(policy, action)
            assert result["performed"] is False, (policy, action, result)
            assert result["member"] is False, (policy, action, result)
            assert result["skip_applies"] is False, (policy, action, result)
            assert result["schedules"] is False, (policy, action, result)
            routed = repair.classify_before_terminal_stale(
                policy, {"kind": "us0092", "action": action}
            )
            assert routed["performed"] is False, routed
    assert secret.read_bytes() == before
    text = (ACTIVE_ROOT / "scripts" / "repairable_blocker_lib.py").read_text(encoding="utf-8")
    for banned in ("subprocess", "npm publish", "git push", ".env"):
        assert banned not in text
