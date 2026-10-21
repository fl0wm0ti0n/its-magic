"""Repairable `/auto` blockers (BUG-0036).

The caller passes the policy value. This module does not read configuration
files. It does not call the matrix repair helpers. YAML security-hard rows
stay on their own path.

Membership is the four-part predicate plus a repair descriptor. `block` keeps
members terminal. A repair value runs a bounded repair. Cap is 3 attempts per
orchestrator run and member.
"""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Mapping

from token_cost_lib import compute_strict_proof_hash

POLICY_BLOCK = "block"
POLICY_REPAIR_THEN_BLOCK = "auto_repair_then_block"
POLICY_REPAIR_THEN_SKIP = "auto_repair_then_skip"
POLICIES = (
    POLICY_BLOCK,
    POLICY_REPAIR_THEN_BLOCK,
    POLICY_REPAIR_THEN_SKIP,
)
REPAIR_POLICIES = frozenset({POLICY_REPAIR_THEN_BLOCK, POLICY_REPAIR_THEN_SKIP})
ATTEMPT_CAP = 3

STOP_FOREIGN_HARNESS = "execute_harness_blocked_out_of_scope"
STOP_STALE = "RESUME_BRIEF_STALE"
STOP_UNPARSEABLE = "RESUME_BRIEF_UNPARSEABLE"
MEMBER_FOREIGN_HARNESS = "foreign_harness"
MEMBER_EXPIRED_PROOF = "expired_proof"
SESSION_STOP_IDS = frozenset({STOP_FOREIGN_HARNESS, STOP_STALE})

PARENT_ROLES = frozenset({"auto", "parent", "orchestrator"})
PHASES = frozenset({
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
})

FAIL_CLOSED_STALE_PREDICATES = frozenset({
    "absent_required_record_key",
    "absent_required_field",
    "fresh_marker_reused_or_missing",
    "strict_proof_phase_invalid",
    "strict_proof_issued_at_missing",
    "strict_proof_id_missing",
    "unauthorized_writer_role",
    "writer_role_mismatch",
    "pair_key_mismatch",
    "tuple_conflict",
    "replay_conflict",
})
FAIL_CLOSED_UNPARSEABLE_PREDICATES = frozenset({
    "strict_proof_ttl_invalid",
    "strict_proof_hash_invalid",
})
SECURITY_HARD_RUNTIME = frozenset({
    "RUNTIME_PROOF_MISSING",
    "RUNTIME_PROOF_REUSED",
    "RUNTIME_PROOF_STALE",
    "RUNTIME_PROOF_AMBIGUOUS_LINK",
})
US0092_DENY_ACTIONS = frozenset({"env_read", "npm_publish", "git_push"})

LOCKED_FIELDS = (
    "record_key",
    "orchestrator_run_id",
    "runtime_proof_id",
    "phase_id",
    "role",
    "proof_issued_at",
    "proof_ttl_seconds",
    "proof_hash",
    "writer_role",
    "completed_phase",
    "next_scheduled_phase",
    "next_scheduled_role",
    "fresh_context_marker",
)
HASH_FIELDS = (
    "orchestrator_run_id",
    "runtime_proof_id",
    "phase_id",
    "role",
    "proof_issued_at",
    "proof_ttl_seconds",
)


def class_membership(candidate: Mapping[str, Any]) -> dict[str, Any]:
    """Four-part predicate. A later code also needs a repair descriptor."""
    parts = {
        "blocks_next_lawful_action": bool(candidate.get("blocks_next_lawful_action")),
        "bounded_repair_restores_scheduling": bool(
            candidate.get("bounded_repair_restores_scheduling")
        ),
        "leaves_foreign_owners_unchanged": bool(
            candidate.get("leaves_foreign_owners_unchanged")
        ),
        "outside_us0092_deny": bool(candidate.get("outside_us0092_deny")),
    }
    evidence_ok = (
        bool(candidate.get("evidence_present"))
        and bool(candidate.get("evidence_consistent"))
        and bool(candidate.get("evidence_authorized"))
    )
    descriptor = candidate.get("repair_descriptor")
    has_descriptor = isinstance(descriptor, Mapping) and bool(descriptor)
    descriptor_ok = has_descriptor and _descriptor_allowed(descriptor)
    member = all(parts.values()) and evidence_ok and descriptor_ok
    return {
        "member": member,
        "parts": parts,
        "evidence_ok": evidence_ok,
        "has_repair_descriptor": has_descriptor,
        "descriptor_ok": descriptor_ok,
        "stop_id": candidate.get("stop_id"),
    }


def _descriptor_allowed(descriptor: Mapping[str, Any]) -> bool:
    if descriptor.get("leaves_foreign_owners_unchanged") is False:
        return False
    if descriptor.get("outside_us0092_deny") is False:
        return False
    if descriptor.get("action") in US0092_DENY_ACTIONS:
        return False
    return True


def _fail_closed(policy: str, reason_code: str, predicate: str) -> dict[str, Any]:
    return {
        "member": False,
        "action": "fail_closed",
        "skip_applies": False,
        "schedules": False,
        "spawn": False,
        "parent_writes_state": False,
        "parent_writes_brief": False,
        "calls_write_resume_pair": False,
        "reason_code": reason_code,
        "predicate": predicate,
        "policy": policy,
        "security_hard": reason_code in SECURITY_HARD_RUNTIME or reason_code == STOP_STALE,
        "next_scheduled_phase": None,
        "edited_paths": [],
    }


def _unknown_policy(policy: str) -> dict[str, Any]:
    return _fail_closed(policy, STOP_UNPARSEABLE, "unknown_policy")


def _terminal(policy: str, stop_id: str, predicate: str) -> dict[str, Any]:
    return {
        "member": True,
        "action": "terminal",
        "skip_applies": False,
        "schedules": False,
        "spawn": False,
        "parent_writes_state": False,
        "parent_writes_brief": False,
        "calls_write_resume_pair": False,
        "stop_id": stop_id,
        "reason_code": stop_id if stop_id == STOP_STALE else stop_id,
        "predicate": predicate,
        "policy": policy,
        "next_scheduled_phase": None,
        "edited_paths": [],
        "repair_attempted": False,
    }


def _unproven(policy: str, stop_id: str, predicate: str) -> dict[str, Any]:
    if policy == POLICY_REPAIR_THEN_SKIP:
        return {
            "member": True,
            "action": "skip",
            "skip_applies": True,
            "skip_segment": True,
            "schedules": False,
            "spawn": False,
            "parent_writes_state": False,
            "parent_writes_brief": False,
            "calls_write_resume_pair": False,
            "stop_id": stop_id,
            "reason_code": stop_id,
            "predicate": predicate,
            "policy": policy,
            "next_scheduled_phase": None,
            "edited_paths": [],
            "repair_attempted": True,
            "cap_exhausted": predicate == "cap_exhausted",
        }
    return {
        "member": True,
        "action": "block",
        "skip_applies": False,
        "schedules": False,
        "spawn": False,
        "parent_writes_state": False,
        "parent_writes_brief": False,
        "calls_write_resume_pair": False,
        "stop_id": stop_id,
        "reason_code": stop_id,
        "predicate": predicate,
        "policy": policy,
        "next_scheduled_phase": None,
        "edited_paths": [],
        "repair_attempted": True,
        "cap_exhausted": predicate == "cap_exhausted",
    }


def _authorized_role(writer_role: object) -> bool:
    return (
        isinstance(writer_role, str)
        and bool(writer_role)
        and writer_role not in PARENT_ROLES
    )


def _ledger_file(ledger_dir: Path, orchestrator_run_id: str) -> Path:
    if (
        not isinstance(orchestrator_run_id, str)
        or not orchestrator_run_id
        or Path(orchestrator_run_id).name != orchestrator_run_id
        or orchestrator_run_id in {".", ".."}
    ):
        raise ValueError("invalid orchestrator_run_id")
    return Path(ledger_dir) / f"{orchestrator_run_id}.jsonl"


def _read_rows(path: Path) -> list[dict[str, Any]]:
    if not path.is_file():
        return []
    rows: list[dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        item = json.loads(line)
        if isinstance(item, dict):
            rows.append(item)
    return rows


def _attempt_count(rows: list[dict[str, Any]], member: str) -> int:
    return sum(
        1
        for row in rows
        if row.get("member") == member and row.get("kind") == "attempt"
    )


def _append_row(path: Path, row: Mapping[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(dict(row), sort_keys=True, separators=(",", ":"))
    with path.open("a", encoding="utf-8", newline="\n") as handle:
        handle.write(payload + "\n")


def _reserve_attempt(
    ledger_dir: Path | None,
    orchestrator_run_id: str,
    member: str,
) -> dict[str, Any]:
    if ledger_dir is None:
        return {"allowed": False, "cap_exhausted": False, "unproven": True, "path": None}
    path = _ledger_file(ledger_dir, orchestrator_run_id)
    count = _attempt_count(_read_rows(path), member)
    if count >= ATTEMPT_CAP:
        return {
            "allowed": False,
            "cap_exhausted": True,
            "unproven": True,
            "path": path,
            "attempt_count": count,
        }
    attempt = count + 1
    _append_row(
        path,
        {
            "kind": "attempt",
            "member": member,
            "orchestrator_run_id": orchestrator_run_id,
            "attempt": attempt,
        },
    )
    return {
        "allowed": True,
        "cap_exhausted": False,
        "unproven": False,
        "path": path,
        "attempt": attempt,
        "attempt_count": attempt,
    }


def evaluate_foreign_harness(
    policy: str,
    *,
    own_contract_passed: bool,
    failures: list[Mapping[str, Any]],
    active_work_item_id: str,
    orchestrator_run_id: str,
    next_lawful_phase: str,
    writer_role: str,
    ledger_dir: Path | None = None,
) -> dict[str, Any]:
    """Foreign harness member. In-scope failures stay outside the class."""
    if policy not in POLICIES:
        return _unknown_policy(policy)
    if not _authorized_role(writer_role) or writer_role != "dev":
        return _fail_closed(policy, STOP_STALE, "unauthorized_writer_role")
    if not own_contract_passed or not failures:
        return {
            "member": False,
            "action": "out_of_class",
            "skip_applies": False,
            "schedules": False,
            "predicate": "own_contract_failed" if not own_contract_passed else "no_remaining_failure",
            "edited_paths": [],
            "next_scheduled_phase": None,
        }
    normalized: list[dict[str, str]] = []
    for failure in failures:
        if not isinstance(failure, Mapping):
            return _fail_closed(policy, STOP_STALE, "absent_required_field")
        name = failure.get("name")
        path = failure.get("path")
        owning_id = failure.get("owning_id")
        if not all(isinstance(item, str) and item for item in (name, path, owning_id)):
            return _fail_closed(policy, STOP_STALE, "absent_required_field")
        if owning_id == active_work_item_id:
            return {
                "member": False,
                "action": "out_of_class",
                "skip_applies": False,
                "schedules": False,
                "predicate": "in_scope_failure",
                "edited_paths": [],
                "next_scheduled_phase": None,
            }
        normalized.append({"name": name, "path": path, "owning_id": owning_id})
    membership = class_membership(
        {
            "stop_id": STOP_FOREIGN_HARNESS,
            "blocks_next_lawful_action": True,
            "bounded_repair_restores_scheduling": True,
            "leaves_foreign_owners_unchanged": True,
            "outside_us0092_deny": True,
            "evidence_present": True,
            "evidence_consistent": True,
            "evidence_authorized": True,
            "repair_descriptor": {
                "kind": "quarantine",
                "leaves_foreign_owners_unchanged": True,
                "outside_us0092_deny": True,
            },
        }
    )
    if not membership["member"]:
        return _fail_closed(policy, STOP_STALE, "predicate_unmet")
    if policy == POLICY_BLOCK:
        out = _terminal(policy, STOP_FOREIGN_HARNESS, "block")
        out["quarantine_written"] = False
        return out
    reserved = _reserve_attempt(ledger_dir, orchestrator_run_id, MEMBER_FOREIGN_HARNESS)
    if not reserved["allowed"]:
        predicate = "cap_exhausted" if reserved["cap_exhausted"] else "repair_unproven"
        out = _unproven(policy, STOP_FOREIGN_HARNESS, predicate)
        out["quarantine_written"] = False
        return out
    ledger_path = reserved["path"]
    assert isinstance(ledger_path, Path)
    for failure in normalized:
        _append_row(
            ledger_path,
            {
                "kind": "quarantine",
                "member": MEMBER_FOREIGN_HARNESS,
                "orchestrator_run_id": orchestrator_run_id,
                "attempt": reserved["attempt"],
                "failure_name": failure["name"],
                "path": failure["path"],
                "owning_id": failure["owning_id"],
                "active_work_item_id": active_work_item_id,
            },
        )
    return {
        "member": True,
        "action": "continue",
        "skip_applies": False,
        "schedules": True,
        "spawn": False,
        "parent_writes_state": False,
        "parent_writes_brief": False,
        "calls_write_resume_pair": False,
        "stop_id": None,
        "predicate": "foreign_harness_quarantine",
        "policy": policy,
        "next_scheduled_phase": next_lawful_phase,
        "quarantine_written": True,
        "edited_paths": [str(ledger_path)],
        "repair_attempted": True,
        "attempt": reserved["attempt"],
        "owning_ids": [failure["owning_id"] for failure in normalized],
    }


def _parse_issued(value: object) -> datetime | None:
    if not isinstance(value, str) or not value:
        return None
    text = value[:-1] + "+00:00" if value.endswith("Z") else value
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    if parsed.tzinfo is None:
        return None
    return parsed.astimezone(timezone.utc)


def _hash_matches(record: Mapping[str, Any]) -> bool:
    ttl = record.get("proof_ttl_seconds")
    if not isinstance(ttl, int) or isinstance(ttl, bool):
        return False
    expected = compute_strict_proof_hash(
        str(record.get("orchestrator_run_id")),
        str(record.get("runtime_proof_id")),
        str(record.get("phase_id")),
        str(record.get("role")),
        str(record.get("proof_issued_at")),
        ttl,
    )
    stored = record.get("proof_hash")
    return isinstance(stored, str) and stored.lower() == expected


def _record_defects(record: object) -> list[str]:
    if not isinstance(record, dict) or not record:
        return ["absent_required_record_key"]
    if "record_key" not in record:
        return ["absent_required_record_key"]
    defects: list[str] = []
    for field in LOCKED_FIELDS:
        if field not in record:
            defects.append("absent_required_field")
            return defects
    marker = record.get("fresh_context_marker")
    if not isinstance(marker, str) or not marker.endswith("-fresh"):
        defects.append("fresh_marker_reused_or_missing")
    phase_id = record.get("phase_id")
    completed = record.get("completed_phase")
    if phase_id not in PHASES or completed not in PHASES:
        defects.append("strict_proof_phase_invalid")
    ttl = record.get("proof_ttl_seconds")
    if not isinstance(ttl, int) or isinstance(ttl, bool) or ttl <= 0:
        defects.append("strict_proof_ttl_invalid")
    if not isinstance(record.get("proof_issued_at"), str) or not record.get("proof_issued_at"):
        defects.append("strict_proof_issued_at_missing")
    if not isinstance(record.get("runtime_proof_id"), str) or not record.get("runtime_proof_id"):
        defects.append("strict_proof_id_missing")
    proof_hash = record.get("proof_hash")
    if (
        not isinstance(proof_hash, str)
        or len(proof_hash) != 64
        or any(ch not in "0123456789abcdefABCDEF" for ch in proof_hash)
    ):
        defects.append("strict_proof_hash_invalid")
    elif not _hash_matches(record):
        defects.append("tuple_conflict")
    return defects


def _pair_defects(
    state: object,
    brief: object,
    writer_role: object,
    now: datetime,
) -> list[str]:
    if not _authorized_role(writer_role):
        return ["unauthorized_writer_role"]
    state_defects = _record_defects(state)
    if state_defects:
        return state_defects
    assert isinstance(state, dict)
    if state.get("writer_role") != writer_role:
        return ["writer_role_mismatch"]
    brief_defects = _record_defects(brief)
    if brief_defects:
        return brief_defects
    assert isinstance(brief, dict)
    if state.get("record_key") != brief.get("record_key"):
        return ["pair_key_mismatch"]
    for field in LOCKED_FIELDS:
        if state.get(field) != brief.get(field):
            return ["tuple_conflict"]
    issued = _parse_issued(state.get("proof_issued_at"))
    ttl = state.get("proof_ttl_seconds")
    if issued is None or not isinstance(ttl, int):
        return ["strict_proof_issued_at_missing"]
    if now <= issued + timedelta(seconds=ttl):
        return []
    return ["expired_ttl"]


def _reason_for_predicate(predicate: str) -> str:
    if predicate in FAIL_CLOSED_UNPARSEABLE_PREDICATES or predicate == "unknown_policy":
        return STOP_UNPARSEABLE
    if predicate in SECURITY_HARD_RUNTIME:
        return predicate
    return STOP_STALE


def evaluate_expired_proof(
    policy: str,
    *,
    state: object,
    brief: object,
    writer_role: object,
    now: datetime,
    ledger_dir: Path | None = None,
    repo_root: Path | None = None,
) -> dict[str, Any]:
    """Expired matching pair. The parent does not write either artifact."""
    _ = repo_root  # callers pass a tree so tests can prove this function does not write it
    if policy not in POLICIES:
        return _unknown_policy(policy)
    if now.tzinfo is None:
        return _fail_closed(policy, STOP_STALE, "absent_required_field")
    defects = _pair_defects(state, brief, writer_role, now.astimezone(timezone.utc))
    if defects != ["expired_ttl"]:
        if not defects:
            return {
                "member": False,
                "action": "in_ttl",
                "skip_applies": False,
                "schedules": False,
                "spawn": False,
                "parent_writes_state": False,
                "parent_writes_brief": False,
                "calls_write_resume_pair": False,
                "next_scheduled_phase": None,
                "edited_paths": [],
                "predicate": "in_ttl",
            }
        predicate = defects[0]
        return _fail_closed(policy, _reason_for_predicate(predicate), predicate)
    assert isinstance(state, dict)
    if policy == POLICY_BLOCK:
        out = _terminal(policy, STOP_STALE, "expired_ttl")
        out["reason_code"] = STOP_STALE
        return out
    run_id = str(state.get("orchestrator_run_id"))
    reserved = _reserve_attempt(ledger_dir, run_id, MEMBER_EXPIRED_PROOF)
    if not reserved["allowed"]:
        predicate = "cap_exhausted" if reserved["cap_exhausted"] else "repair_unproven"
        return _unproven(policy, STOP_STALE, predicate)
    return {
        "member": True,
        "action": "spawn_child",
        "skip_applies": False,
        "schedules": False,
        "schedules_next_before_child_pair": False,
        "spawn": True,
        "parent_writes_state": False,
        "parent_writes_brief": False,
        "calls_write_resume_pair": False,
        "writer_role": state.get("writer_role"),
        "completed_phase": state.get("completed_phase"),
        "child_write_order": ["append_state_bottom", "prepend_brief"],
        "same_next_scheduled_phase": state.get("next_scheduled_phase"),
        "same_next_scheduled_role": state.get("next_scheduled_role"),
        "new_runtime_proof_id_required": True,
        "new_proof_hash_required": True,
        "predicate": "expired_ttl",
        "policy": policy,
        "reason_code": None,
        "next_scheduled_phase": None,
        "edited_paths": [str(reserved["path"])] if reserved.get("path") else [],
        "repair_attempted": True,
        "attempt": reserved.get("attempt"),
    }


def evaluate_fail_closed(
    policy: str,
    *,
    reason_code: str,
    predicate: str = "",
) -> dict[str, Any]:
    """Predicates outside the class. Skip does not apply at any hardness."""
    if policy not in POLICIES:
        return _unknown_policy(policy)
    if reason_code in SECURITY_HARD_RUNTIME:
        return _fail_closed(policy, reason_code, predicate or reason_code)
    if predicate in FAIL_CLOSED_UNPARSEABLE_PREDICATES or reason_code == STOP_UNPARSEABLE:
        return _fail_closed(
            policy,
            STOP_UNPARSEABLE,
            predicate or "strict_proof_hash_invalid",
        )
    if predicate.startswith("absent_required_field"):
        predicate = "absent_required_field"
    if predicate.startswith("tuple_conflict"):
        predicate = "tuple_conflict"
    if reason_code == STOP_STALE or predicate in FAIL_CLOSED_STALE_PREDICATES:
        return _fail_closed(policy, STOP_STALE, predicate or "absent_required_field")
    return _fail_closed(policy, reason_code or STOP_STALE, predicate or "fail_closed")


def evaluate_later_member(
    policy: str,
    candidate: Mapping[str, Any],
    *,
    ledger_dir: Path | None = None,
    orchestrator_run_id: str = "",
    next_lawful_phase: str = "",
) -> dict[str, Any]:
    """A later code joins only through the predicate plus a repair descriptor."""
    if policy not in POLICIES:
        return _unknown_policy(policy)
    stop_id = candidate.get("stop_id")
    if stop_id in SESSION_STOP_IDS:
        return _fail_closed(policy, STOP_STALE, "session_stop_not_later_member")
    membership = class_membership(candidate)
    if not membership["member"]:
        evidence_present = bool(candidate.get("evidence_present"))
        evidence_consistent = bool(candidate.get("evidence_consistent"))
        evidence_authorized = bool(candidate.get("evidence_authorized"))
        if not evidence_authorized:
            predicate = "unauthorized_writer_role"
        elif not evidence_present:
            predicate = "absent_required_field"
        elif not evidence_consistent:
            predicate = "tuple_conflict"
        else:
            predicate = "predicate_unmet"
        return _fail_closed(policy, STOP_STALE, predicate)
    if policy == POLICY_BLOCK:
        out = _terminal(policy, str(stop_id), "block")
        out["stop_id"] = stop_id
        return out
    reserved = _reserve_attempt(ledger_dir, orchestrator_run_id, str(stop_id))
    if not reserved["allowed"]:
        predicate = "cap_exhausted" if reserved["cap_exhausted"] else "repair_unproven"
        return _unproven(policy, str(stop_id), predicate)
    return {
        "member": True,
        "action": "continue",
        "skip_applies": False,
        "schedules": True,
        "spawn": False,
        "parent_writes_state": False,
        "parent_writes_brief": False,
        "calls_write_resume_pair": False,
        "stop_id": stop_id,
        "predicate": "later_member",
        "policy": policy,
        "next_scheduled_phase": next_lawful_phase,
        "edited_paths": [str(reserved["path"])] if reserved.get("path") else [],
        "repair_attempted": True,
        "session_stop": False,
    }


def deny_us0092(policy: str, action: str) -> dict[str, Any]:
    """Denied actions are not repair actions and are not performed."""
    if policy not in POLICIES:
        return _unknown_policy(policy)
    if action not in US0092_DENY_ACTIONS:
        return _fail_closed(policy, STOP_STALE, "unknown_deny_action")
    return {
        "member": False,
        "action": "not_performed",
        "performed": False,
        "skip_applies": False,
        "schedules": False,
        "spawn": False,
        "parent_writes_state": False,
        "parent_writes_brief": False,
        "calls_write_resume_pair": False,
        "deny_action": action,
        "policy": policy,
        "predicate": "us0092_deny",
        "next_scheduled_phase": None,
        "edited_paths": [],
    }


def classify_before_terminal_stale(
    policy: str,
    observation: Mapping[str, Any],
) -> dict[str, Any]:
    """Entry point called before the terminal stale stop.

    The expired-proof path is a member only when TTL expiry is the sole defect.
    """
    kind = str(observation.get("kind") or "")
    if kind == "foreign_harness":
        failures = observation.get("failures")
        if not isinstance(failures, list):
            failures = []
        return evaluate_foreign_harness(
            policy,
            own_contract_passed=bool(observation.get("own_contract_passed")),
            failures=failures,
            active_work_item_id=str(observation.get("active_work_item_id") or ""),
            orchestrator_run_id=str(observation.get("orchestrator_run_id") or ""),
            next_lawful_phase=str(observation.get("next_lawful_phase") or ""),
            writer_role=str(observation.get("writer_role") or ""),
            ledger_dir=observation.get("ledger_dir"),
        )
    if kind in {"resume_pair", "expired_proof"}:
        now = observation.get("now")
        if not isinstance(now, datetime):
            return _fail_closed(policy, STOP_STALE, "absent_required_field")
        return evaluate_expired_proof(
            policy,
            state=observation.get("state"),
            brief=observation.get("brief"),
            writer_role=observation.get("writer_role"),
            now=now,
            ledger_dir=observation.get("ledger_dir"),
            repo_root=observation.get("repo_root"),
        )
    if kind == "later_member":
        candidate = observation.get("candidate")
        if not isinstance(candidate, Mapping):
            return _fail_closed(policy, STOP_STALE, "absent_required_field")
        return evaluate_later_member(
            policy,
            candidate,
            ledger_dir=observation.get("ledger_dir"),
            orchestrator_run_id=str(observation.get("orchestrator_run_id") or ""),
            next_lawful_phase=str(observation.get("next_lawful_phase") or ""),
        )
    if kind == "us0092":
        return deny_us0092(policy, str(observation.get("action") or ""))
    if kind == "fail_closed":
        return evaluate_fail_closed(
            policy,
            reason_code=str(observation.get("reason_code") or ""),
            predicate=str(observation.get("predicate") or ""),
        )
    return {
        "member": False,
        "action": "not_applicable",
        "skip_applies": False,
        "schedules": False,
        "edited_paths": [],
    }
