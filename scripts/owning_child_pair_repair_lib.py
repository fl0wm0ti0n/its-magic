"""Owning-child continuation pair repair (US-0157).

The phase child whose identity already matches the pair may repair that pair
once. The spawn-only parent calls ``validate_resume_pair`` and does not write
``docs/engineering/state.md`` or ``handoffs/resume_brief.md``. This module does
not call ``write_resume_pair`` (that helper prepends state). It does not import
the repairable-blocker library and it does not read environment files.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Mapping

from opencode_auto_bridge import (
    RESUME_BRIEF_STALE,
    _validate_pair_tuple,
    validate_resume_pair,
)
from token_cost_lib import compute_strict_proof_hash

PARENT_ROLES = frozenset({"auto", "parent", "orchestrator"})
TASK_ALLOWLIST = (
    "po",
    "tech-lead",
    "dev",
    "qa",
    "release",
    "curator",
    "security",
)
PHASE_ROLE_CAPABILITY_MISSING = "PHASE_ROLE_CAPABILITY_MISSING"
HASH_FIELDS = (
    "orchestrator_run_id",
    "runtime_proof_id",
    "phase_id",
    "role",
    "proof_issued_at",
    "proof_ttl_seconds",
)
SHAPE_EXACT = frozenset({
    "absent_required_record_key",
    "malformed_record_key",
    "strict_proof_ttl_invalid",
})
FAIL_CLOSED = frozenset({
    "unauthorized_writer_role",
    "writer_role_mismatch",
    "replay_conflict",
    "fresh_marker_reused_or_missing",
    "strict_proof_phase_invalid",
    "strict_proof_issued_at_missing",
    "strict_proof_id_missing",
    "pair_record_not_object",
    "expired_ttl",
})
HARD_SECURITY_ACTIONS = frozenset({
    "env_read",
    "secrets",
    "credential_theft",
})

_repair_attempts: dict[tuple[str, str, str, str], int] = {}
_repair_seq = 0


def reset_repair_attempts_for_tests() -> None:
    """Clear the one-attempt ledger (test isolation only)."""
    global _repair_seq
    _repair_attempts.clear()
    _repair_seq = 0


def work_item_id(record: Mapping[str, Any]) -> str:
    kind = str(record.get("work_item_kind") or "")
    if kind == "story":
        return str(record.get("story_id") or "")
    story = record.get("story_id")
    if kind != "bug" and isinstance(story, str) and story and story != "(none)":
        return story
    return str(record.get("bug_id") or "")


def plan_critic_spawn(
    cross_model_review: object,
    allowlist: tuple[str, ...] | list[str] | None = None,
) -> dict[str, Any]:
    """Hook plan. A missing critic key is not a capability miss."""
    enabled = cross_model_review == 1 or cross_model_review == "1"
    if not enabled:
        return {"spawn": False, "reasonCode": None}
    allow = tuple(allowlist) if allowlist is not None else TASK_ALLOWLIST
    if "tech-lead" not in allow:
        return {
            "spawn": False,
            "reasonCode": PHASE_ROLE_CAPABILITY_MISSING,
        }
    return {
        "spawn": True,
        "agent": "tech-lead",
        "command": "/sovereign-critic",
        "reasonCode": None,
    }


def delivery_role_capability(
    role: str,
    allowlist: tuple[str, ...] | list[str] | None = None,
) -> dict[str, Any]:
    """A real missing allowlisted delivery role stays security-hard."""
    allow = tuple(allowlist) if allowlist is not None else TASK_ALLOWLIST
    if role not in allow:
        return {"ok": False, "reasonCode": PHASE_ROLE_CAPABILITY_MISSING}
    return {"ok": True, "reasonCode": None}


def deny_hard_security(action: str) -> dict[str, Any]:
    """Hard security denies stay hard stops. This function reads no env file."""
    return {
        "performed": False,
        "hard_stop": True,
        "read_env": False,
        "action": action,
        "recognized": action in HARD_SECURITY_ACTIONS,
        "reason_code": "security_hard",
        "member_of_repair": False,
    }


def predicate_repairable(predicate: str | None) -> bool:
    if not predicate or predicate in FAIL_CLOSED:
        return False
    if predicate in {
        "strict_proof_hash_invalid",
        "pair_key_mismatch",
        *SHAPE_EXACT,
    }:
        return True
    return (
        predicate.startswith("tuple_conflict:")
        or predicate.startswith("absent_required_field:")
        or predicate.startswith("malformed_field:")
    )


def _names(record: Mapping[str, Any], child: Mapping[str, Any]) -> bool:
    writer = str(child.get("writer_role") or "")
    if not writer or writer in PARENT_ROLES:
        return False
    if record.get("writer_role") != writer:
        return False
    if record.get("orchestrator_run_id") != child.get("orchestrator_run_id"):
        return False
    if record.get("completed_phase") != child.get("completed_phase"):
        return False
    return work_item_id(record) == str(child.get("work_item_id") or "")


def _hash_role(record: Mapping[str, Any]) -> str | None:
    role = record.get("role")
    if isinstance(role, str) and role:
        return role
    writer = record.get("writer_role")
    if isinstance(writer, str) and writer:
        return writer
    return None


def _tuple_complete(record: Mapping[str, Any]) -> bool:
    role = _hash_role(record)
    if not role:
        return False
    ttl = record.get("proof_ttl_seconds")
    if isinstance(ttl, bool) or not isinstance(ttl, int) or ttl <= 0:
        return False
    for field in (
        "orchestrator_run_id",
        "runtime_proof_id",
        "phase_id",
        "proof_issued_at",
    ):
        value = record.get(field)
        if not isinstance(value, str) or not value:
            return False
    return True


def _recompute_hash(record: Mapping[str, Any]) -> str | None:
    if not _tuple_complete(record):
        return None
    role = _hash_role(record)
    if role is None:
        return None
    return compute_strict_proof_hash(
        str(record["orchestrator_run_id"]),
        str(record["runtime_proof_id"]),
        str(record["phase_id"]),
        role,
        str(record["proof_issued_at"]),
        int(record["proof_ttl_seconds"]),
    )


def _record_key(record: Mapping[str, Any]) -> str:
    return "|".join(
        [
            str(record.get("orchestrator_run_id") or ""),
            str(record.get("work_item_kind") or ""),
            work_item_id(record),
            str(record.get("completed_phase") or ""),
            str(record.get("runtime_proof_id") or ""),
        ]
    )


def _snapshot(repo: Path) -> tuple[bytes | None, bytes | None]:
    state = repo / "docs" / "engineering" / "state.md"
    brief = repo / "handoffs" / "resume_brief.md"
    return (
        state.read_bytes() if state.is_file() else None,
        brief.read_bytes() if brief.is_file() else None,
    )


def _append_state(repo: Path, record: Mapping[str, Any]) -> None:
    path = repo / "docs" / "engineering" / "state.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    existing = path.read_text(encoding="utf-8") if path.is_file() else ""
    if existing and not existing.endswith("\n"):
        existing += "\n"
    payload = json.dumps(dict(record), sort_keys=True)
    block = (
        "\n## Continuation pair repair checkpoint\n\n"
        f"- writer_role: {record.get('writer_role')}\n"
        f"- completed_phase: {record.get('completed_phase')}\n"
        f"- runtime_proof_id: {record.get('runtime_proof_id')}\n\n"
        "```json\n"
        f"{payload}\n"
        "```\n"
    )
    path.write_text(existing + block, encoding="utf-8")


def _prepend_brief(repo: Path, record: Mapping[str, Any]) -> None:
    path = repo / "handoffs" / "resume_brief.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    prior = path.read_text(encoding="utf-8") if path.is_file() else ""
    payload = json.dumps(dict(record), sort_keys=True)
    block = (
        "# Resume Brief — owning-child continuation repair\n\n"
        f"- `record_key`: `{record.get('record_key')}`\n"
        f"- `writer_role`: `{record.get('writer_role')}`\n"
        f"- `completed_phase`: `{record.get('completed_phase')}`\n"
        f"- `next_scheduled_phase`: `{record.get('next_scheduled_phase')}`\n"
        f"- `runtime_proof_id`: `{record.get('runtime_proof_id')}`\n\n"
        "```json\n"
        f"{payload}\n"
        "```\n"
    )
    if prior:
        block = block + "\n---\n\n" + prior
    path.write_text(block, encoding="utf-8")


def _mint_proof_id(child: Mapping[str, Any]) -> str:
    global _repair_seq
    _repair_seq += 1
    return (
        f"rp-{child.get('orchestrator_run_id')}-repair-"
        f"{child.get('writer_role')}-{_repair_seq}"
    )


def _new_checkpoint(
    state: Mapping[str, Any],
    brief: Mapping[str, Any],
    child: Mapping[str, Any],
) -> dict[str, Any] | None:
    source: Mapping[str, Any] | None = None
    if _names(brief, child) and _validate_pair_tuple(dict(brief)).get("ok"):
        source = brief
    elif _names(state, child):
        source = state
    elif _names(brief, child):
        source = brief
    if source is None:
        return None
    record = dict(source)
    record["writer_role"] = child["writer_role"]
    record["orchestrator_run_id"] = child["orchestrator_run_id"]
    record["completed_phase"] = child["completed_phase"]
    record["phase_id"] = record.get("phase_id") or child["completed_phase"]
    record["role"] = record.get("role") or child["writer_role"]
    kind = str(child.get("work_item_kind") or record.get("work_item_kind") or "story")
    record["work_item_kind"] = kind
    if kind == "story":
        record["story_id"] = child["work_item_id"]
        record["bug_id"] = record.get("bug_id") or "(none)"
    else:
        record["bug_id"] = child["work_item_id"]
    record["runtime_proof_id"] = _mint_proof_id(child)
    ttl = record.get("proof_ttl_seconds")
    if isinstance(ttl, bool) or not isinstance(ttl, int) or ttl <= 0:
        record["proof_ttl_seconds"] = 3600
    if not isinstance(record.get("proof_issued_at"), str) or not record.get(
        "proof_issued_at"
    ):
        record["proof_issued_at"] = "2026-10-16T21:40:00Z"
    marker = record.get("fresh_context_marker")
    if not (
        isinstance(marker, str)
        and marker
        and marker != "tui-auto"
        and marker.endswith("-fresh")
    ):
        record["fresh_context_marker"] = (
            f"{child['writer_role']}-repair-{_repair_seq}-fresh"
        )
    defaults = {
        "resolution_source": "resume_brief",
        "effective_plan": ["spec", "plan", "build+verify", "ship"],
        "skipped_phases": ["intake", "plan-verify"],
        "completed_phases": ["intake", "execute"],
        "next_scheduled_phase": "qa",
        "next_scheduled_role": "qa",
        "phase_cursor": "build+verify/execute-pass",
        "budget_scope": "owning-child-repair",
        "stop_reason": "execute_complete_phase_boundary",
    }
    for field, fallback in defaults.items():
        if field not in record:
            record[field] = fallback
    digest = _recompute_hash(record)
    if digest is None:
        return None
    record["proof_hash"] = digest
    record["record_key"] = _record_key(record)
    checked = _validate_pair_tuple(record)
    if not checked.get("ok"):
        return None
    return record


def _repaired_record(
    state: Mapping[str, Any],
    brief: Mapping[str, Any],
    predicate: str,
    child: Mapping[str, Any],
) -> dict[str, Any] | None:
    if predicate in FAIL_CLOSED or not predicate_repairable(predicate):
        return None
    if predicate == "strict_proof_hash_invalid":
        source = dict(state) if _tuple_complete(state) else dict(brief)
        if not _tuple_complete(source) or not _names(source, child):
            return None
        digest = _recompute_hash(source)
        if digest is None:
            return None
        source["proof_hash"] = digest
        if "role" not in source:
            source["role"] = _hash_role(source)
        return source
    if predicate == "pair_key_mismatch" or predicate.startswith("tuple_conflict:"):
        if not (_names(state, child) and _names(brief, child)):
            return None
        if not _validate_pair_tuple(dict(state)).get("ok"):
            return None
        return dict(state)
    state_ok = bool(_validate_pair_tuple(dict(state)).get("ok"))
    brief_ok = bool(_validate_pair_tuple(dict(brief)).get("ok"))
    if state_ok and not brief_ok and _names(state, child):
        return dict(state)
    if not state_ok:
        return _new_checkpoint(state, brief, child)
    return None


def parent_consider_pair(
    repo: Path,
    *,
    child: Mapping[str, Any],
    state_tuple: Mapping[str, Any],
    brief_tuple: Mapping[str, Any],
    known_predicate: str | None = None,
) -> dict[str, Any]:
    """Read and validate only. Never writes the pair files."""
    before = _snapshot(repo)
    if known_predicate == "expired_ttl":
        after = _snapshot(repo)
        return {
            "action": "stop",
            "spawn_repair": False,
            "spawn_next": False,
            "parent_wrote": before != after,
            "writes_state": False,
            "writes_brief": False,
            "sets_resume_brief_auto_refresh": False,
            "reason_code": RESUME_BRIEF_STALE,
            "predicate": "expired_ttl",
            "next_scheduled_phase": None,
            "calls_write_resume_pair": False,
        }
    result = validate_resume_pair(
        repo,
        writer_role=str(child.get("writer_role") or ""),
        state_tuple=dict(state_tuple),
        brief_tuple=dict(brief_tuple),
    )
    after = _snapshot(repo)
    parent_wrote = before != after
    base = {
        "parent_wrote": parent_wrote,
        "writes_state": False,
        "writes_brief": False,
        "sets_resume_brief_auto_refresh": False,
        "calls_write_resume_pair": False,
    }
    if result.get("ok"):
        return {
            **base,
            "action": "continue",
            "spawn_repair": False,
            "spawn_next": True,
            "reason_code": None,
            "predicate": None,
            "next_scheduled_phase": result.get("next_scheduled_phase"),
        }
    predicate = str(known_predicate or result.get("predicate") or "")
    reason = result.get("reasonCode")
    writer = str(child.get("writer_role") or "")
    owns = writer not in PARENT_ROLES and (
        _names(state_tuple, child) or _names(brief_tuple, child)
    )
    if (
        predicate == "pair_key_mismatch"
        or predicate.startswith("tuple_conflict:")
    ):
        owns = _names(state_tuple, child) and _names(brief_tuple, child)
    if owns and predicate_repairable(predicate):
        return {
            **base,
            "action": "spawn_repair",
            "spawn_repair": True,
            "spawn_next": False,
            "charter": "repair-only",
            "writer_role": writer,
            "completed_phase": child.get("completed_phase"),
            "reason_code": reason,
            "predicate": predicate,
            "next_scheduled_phase": None,
        }
    return {
        **base,
        "action": "stop",
        "spawn_repair": False,
        "spawn_next": False,
        "reason_code": reason,
        "predicate": predicate,
        "next_scheduled_phase": None,
    }


def repair_own_pair(
    repo: Path,
    *,
    child: Mapping[str, Any],
    state_tuple: Mapping[str, Any],
    brief_tuple: Mapping[str, Any],
    predicate: str | None = None,
) -> dict[str, Any]:
    """One owning-child rewrite. Append state at the bottom, then prepend the brief."""
    refused = {
        "repaired": False,
        "wrote": False,
        "calls_write_resume_pair": False,
        "write_order": [],
        "parent_wrote": False,
    }
    writer = str(child.get("writer_role") or "")
    if writer in PARENT_ROLES or not writer:
        return {**refused, "predicate": "unauthorized_writer_role"}
    if predicate == "expired_ttl" or predicate in FAIL_CLOSED:
        return {**refused, "predicate": predicate}
    if predicate is None:
        state_check = _validate_pair_tuple(dict(state_tuple))
        if not state_check.get("ok"):
            predicate = str(state_check.get("predicate") or "")
        else:
            brief_check = _validate_pair_tuple(dict(brief_tuple))
            if not brief_check.get("ok"):
                predicate = str(brief_check.get("predicate") or "")
            elif state_tuple.get("record_key") != brief_tuple.get("record_key"):
                predicate = "pair_key_mismatch"
            else:
                predicate = "tuple_conflict:unspecified"
    if not predicate_repairable(predicate):
        return {**refused, "predicate": predicate}
    key = (
        str(child.get("orchestrator_run_id") or ""),
        str(child.get("work_item_id") or ""),
        str(child.get("completed_phase") or ""),
        writer,
    )
    if _repair_attempts.get(key, 0) >= 1:
        return {**refused, "predicate": predicate, "attempt": "exhausted"}
    record = _repaired_record(state_tuple, brief_tuple, predicate, child)
    if record is None:
        return {**refused, "predicate": predicate}
    if "record_key" not in record or not record.get("record_key"):
        record["record_key"] = _record_key(record)
    _append_state(repo, record)
    _prepend_brief(repo, record)
    _repair_attempts[key] = _repair_attempts.get(key, 0) + 1
    return {
        "repaired": True,
        "wrote": True,
        "calls_write_resume_pair": False,
        "write_order": ["append_state_bottom", "prepend_brief"],
        "parent_wrote": False,
        "predicate": predicate,
        "state": record,
        "brief": dict(record),
        "attempt": 1,
    }


def continue_after_pair(
    repo: Path,
    *,
    child: Mapping[str, Any],
    state_tuple: Mapping[str, Any],
    brief_tuple: Mapping[str, Any],
    known_predicate: str | None = None,
) -> dict[str, Any]:
    """Parent validates, may spawn one repair child, then validates again."""
    plan = parent_consider_pair(
        repo,
        child=child,
        state_tuple=state_tuple,
        brief_tuple=brief_tuple,
        known_predicate=known_predicate,
    )
    if plan.get("parent_wrote"):
        return {**plan, "action": "stop", "reason_code": "parent_write_forbidden"}
    if plan.get("action") == "continue":
        return plan
    if not plan.get("spawn_repair"):
        return plan
    repaired = repair_own_pair(
        repo,
        child=child,
        state_tuple=state_tuple,
        brief_tuple=brief_tuple,
        predicate=str(plan.get("predicate") or ""),
    )
    if not repaired.get("repaired"):
        return {
            **plan,
            "action": "stop",
            "spawn_next": False,
            "repaired": False,
            "next_scheduled_phase": None,
            "parent_wrote": False,
            "calls_write_resume_pair": False,
        }
    again = parent_consider_pair(
        repo,
        child=child,
        state_tuple=repaired["state"],
        brief_tuple=repaired["brief"],
    )
    if again.get("action") == "continue":
        return {
            "action": "continue",
            "spawn_repair": True,
            "spawn_next": True,
            "repaired": True,
            "parent_wrote": False,
            "writes_state": False,
            "writes_brief": False,
            "sets_resume_brief_auto_refresh": False,
            "calls_write_resume_pair": False,
            "next_scheduled_phase": again.get("next_scheduled_phase"),
            "predicate": plan.get("predicate"),
            "reason_code": None,
            "write_order": repaired.get("write_order"),
            "spawn_next_while_invalid": False,
        }
    return {
        "action": "stop",
        "spawn_repair": True,
        "spawn_next": False,
        "repaired": True,
        "parent_wrote": False,
        "writes_state": False,
        "writes_brief": False,
        "sets_resume_brief_auto_refresh": False,
        "calls_write_resume_pair": False,
        "next_scheduled_phase": None,
        "predicate": plan.get("predicate"),
        "reason_code": plan.get("reason_code"),
        "write_order": repaired.get("write_order"),
    }
