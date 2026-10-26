#!/usr/bin/env python3
"""BUG-0015 thin OpenCode auto bridge (IsolationEvidence + first-phase).

Durable SOT remains docs/engineering/state.md (US-0048 / DEC-0029).
First-phase order (architecture CF3 / R-0114 DQ3):
  argv --start-from → resume_brief → scratchpad → US-0087 bug-queue.
AUTO_SCHEDULER_CONFLICT mutex semantics unchanged (story-drain vs bug-queue).
US-0156 / DEC-0152: no validated source → fail closed (no default phase);
new `--resolve-continuation` emits the typed plan/item tuple (or a reason-coded
failure) and never falls back to an unvalidated phase.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))
import host_runtime_config_lib as hrc  # noqa: E402
import token_cost_lib  # noqa: E402  (BUG-0044 strict-proof recompute)

EXIT_OK = 0
EXIT_FAIL = 1


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _parse_resume_brief(repo: Path) -> dict[str, str]:
    path = repo / "handoffs" / "resume_brief.md"
    if not path.is_file():
        return {}
    text = path.read_text(encoding="utf-8").split("\n---\n", 1)[0]
    out: dict[str, str] = {}
    for key in (
        "intended_resume_phase",
        "next_scheduled_phase",
        "orchestrator_run_id",
        "story_id",
        "bug_id",
        "sprint_id",
    ):
        m = re.search(rf"`{key}`\s*:\s*\*\*`([^`]+)`\*\*", text)
        if m:
            out[key] = m.group(1)
            continue
        m2 = re.search(rf"- `{key}`:\s*`([^`]+)`", text)
        if m2:
            out[key] = m2.group(1)
            continue
        m3 = re.search(rf"{key}=([^\s`;]+)", text)
        if m3:
            out[key] = m3.group(1)
    return out


def _merge_scratchpad(repo: Path) -> dict[str, str]:
    """Resolve shared governance keys via host-neutral config (US-0131 / DEC-0131)."""
    resolved = hrc.resolve_runtime_config(repo, raise_on_fatal=False)
    return dict(resolved.values)


def _parse_state_next_phase(repo: Path) -> str | None:
    path = repo / "docs" / "engineering" / "state.md"
    if not path.is_file():
        return None
    text = path.read_text(encoding="utf-8")
    # State checkpoints are append-only. Prefer the newest complete canonical
    # pair over historical prose and incomplete blocker evidence, which may
    # legitimately carry next_scheduled_phase=none.
    records: list[dict] = []
    for raw in re.findall(r"```json\s*\n(.*?)\n```", text, flags=re.DOTALL):
        try:
            record = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if isinstance(record, dict):
            records.append(record)
    for record in reversed(records):
        phase = record.get("next_scheduled_phase")
        if (
            isinstance(record.get("record_key"), str)
            and isinstance(phase, str)
            and _is_known_phase(phase)
        ):
            return phase

    # Retain compatibility with older state checkpoints that predate the JSON
    # continuation-pair record, while ignoring terminal `none` markers.
    matches = re.findall(r"next_scheduled_phase[=:][\s`*]*([^\s`;*`]+)", text)
    for phase in reversed(matches):
        phase = phase.strip("`")
        if _is_known_phase(phase):
            return phase
    return None


PHASE_PLAN_ORDER = (
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

PHASE_PLAN = tuple(PHASE_PLAN_ORDER)


def _is_known_phase(phase_id: str) -> bool:
    return phase_id in PHASE_PLAN_ORDER


def _validate_resume_brief(repo: Path) -> dict:
    resume = _parse_resume_brief(repo)
    if not resume:
        return {"ok": False, "reason": "empty"}
    if not resume.get("story_id") and not resume.get("bug_id") and not resume.get("orchestrator_run_id"):
        return {"ok": False, "reason": "missing_work_item_anchor"}
    phase = None
    for key in ("intended_resume_phase", "next_scheduled_phase"):
        val = (resume.get(key) or "").strip().lstrip("/")
        if val and val not in ("(none)", "auto", "n/a"):
            phase = val
            break
    if not _is_known_phase(phase or ""):
        return {"ok": False, "reason": "unknown_phase"}
    return {"ok": True, "value": phase, "source": f"resume_brief"}


def _validate_state(repo: Path) -> dict:
    phase = _parse_state_next_phase(repo)
    if not phase:
        return {"ok": False, "reason": "empty"}
    if not _is_known_phase(phase):
        return {"ok": False, "reason": "unknown_phase"}
    return {"ok": True, "value": phase, "source": "state.md"}


def _effective_plan_intersection(phase_id: str, anchor_phase: str | None) -> list[str]:
    if not _is_known_phase(phase_id):
        return []
    if anchor_phase and _is_known_phase(anchor_phase) and anchor_phase != phase_id:
        i_anchor = PHASE_PLAN_ORDER.index(anchor_phase)
        i_phase = PHASE_PLAN_ORDER.index(phase_id)
        if i_anchor > i_phase:
            return list(PHASE_PLAN_ORDER[i_phase:])
        return list(PHASE_PLAN_ORDER[i_anchor:])
    return list(PHASE_PLAN_ORDER[PHASE_PLAN_ORDER.index(phase_id):])


def _select_next_open_story(repo: Path) -> dict:
    path = repo / "docs" / "product" / "backlog.md"
    if not path.is_file():
        return {"ok": False, "reasonCode": "OPENCODE_AUTO_DEPENDENCY_BLOCKED",
                "reason": "backlog_missing"}
    text = path.read_text(encoding="utf-8")
    blocks = re.split(r"(?=^## US-\d+)", text, flags=re.MULTILINE)
    for block in blocks:
        m = re.match(r"^## (US-\d+)", block)
        if not m:
            continue
        if not re.search(r"Status\s*[:=]\s*`*OPEN\b", block, re.IGNORECASE):
            continue
        if re.search(r"Status\s*[:=]\s*`*(DONE|IN_PROGRESS|BLOCKED|PAUSED)\b", block, re.IGNORECASE):
            continue
        return {"ok": True, "value": m.group(1), "source": "backlog.md"}
    return {"ok": False, "reasonCode": "OPENCODE_AUTO_DEPENDENCY_BLOCKED",
            "reason": "no_dependency_eligible_story"}


def _select_next_sprint_from_backlog(repo: Path, story_id: str) -> str:
    path = repo / "docs" / "product" / "backlog.md"
    if not path.is_file():
        return ""
    text = path.read_text(encoding="utf-8")
    m = re.search(
        rf"^## {re.escape(story_id)}.*?(?=^## (?:US|BUG)-\d+\Z|\Z)",
        text,
        flags=re.MULTILINE | re.DOTALL,
    )
    if not m:
        return ""
    sm = re.search(r"Sprint\s*[:=]\s*`*(S\d+)\b", m.group(0), re.IGNORECASE)
    if sm:
        return sm.group(1)
    sm2 = re.search(r"(S\d{3,})", m.group(0))
    return sm2.group(1) if sm2 else ""


def select_first_phase(
    repo: Path,
    *,
    start_from: str | None,
    bug_target: str | None,
) -> dict:
    """Legacy entry retained for adapter compatibility.

    US-0156 / DEC-0152: precedence is start-from → validated resume_brief →
    validated state.md. All fail-closed paths emit a reason code and never
    fall back to an unvalidated phase.
    """
    if start_from and start_from.strip():
        phase = start_from.strip().lstrip("/")
        if _is_known_phase(phase):
            return {"ok": True, "phase_id": phase, "source": "argv"}
        return {"ok": False, "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                "source": "argv"}

    scratch = _merge_scratchpad(repo)
    story_drain = scratch.get("AUTO_BACKLOG_DRAIN", "0") == "1"
    bug_queue = scratch.get("AUTO_BUG_QUEUE", "0") == "1"
    if story_drain and bug_queue and not bug_target:
        return {"ok": False, "reasonCode": "AUTO_SCHEDULER_CONFLICT",
                "source": "scheduler"}

    resume_check = _validate_resume_brief(repo)
    if resume_check["ok"]:
        return {"ok": True, "phase_id": resume_check["value"],
                "source": f"resume_brief"}

    for key in ("INTENDED_RESUME_PHASE", "NEXT_SCHEDULED_PHASE", "AUTO_START_FROM"):
        val = (scratch.get(key) or "").strip().lstrip("/")
        if val and _is_known_phase(val):
            return {"ok": True, "phase_id": val, "source": f"scratchpad:{key}"}
        if val and not _is_known_phase(val):
            return {"ok": False, "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                    "source": f"scratchpad:{key}"}

    state_check = _validate_state(repo)
    if state_check["ok"]:
        return {"ok": True, "phase_id": state_check["value"], "source": "state.md"}

    if bug_queue or bug_target:
        return {"ok": True,
                "phase_id": "intake" if not bug_target else "research",
                "source": "us0087_bug_queue",
                "bug_target": bug_target or ""}

    return {"ok": False, "reasonCode": "OPENCODE_AUTO_RESOLUTION_FAILED",
            "source": "no_validated_source"}


# --- US-0156 / DEC-0152: typed continuation resolver --------------
#
# Module-level provenance registry (idempotence + conflict detection).
# Tests reset via reset_continuation_registry_for_tests().
continuation_registry: dict[str, dict] = {}


def reset_continuation_registry_for_tests() -> None:
    continuation_registry.clear()


def _continuation_key(
    orchestrator_run_id: str,
    work_item_kind: str,
    work_item_id: str,
    phase_id: str,
) -> str:
    return f"{orchestrator_run_id}|{work_item_kind}|{work_item_id}|{phase_id}"


def resolve_continuation(
    repo: Path,
    *,
    start_from: str | None,
    bug_target: str | None,
    orchestrator_run_id: str | None,
    cursor: int = 0,
    remaining_budget: int = 32,
) -> dict:
    """US-0156 / DEC-0152 typed, read-only continuation resolution.

    Inputs: explicit start anchor, merged policy, durable resume/state sources.
    Output: ok=true with one complete plan/item tuple, or ok=false with one
    architecture-owned reason code (no fallback execution).
    """
    if remaining_budget <= 0:
        return {"ok": False,
                "reasonCode": "OPENCODE_AUTO_RESOLUTION_FAILED",
                "reason": "exhausted_retry_or_loop_budget"}

    scratch = _merge_scratchpad(repo)
    story_drain = scratch.get("AUTO_BACKLOG_DRAIN", "0") == "1"
    bug_queue = scratch.get("AUTO_BUG_QUEUE", "0") == "1"

    # Scheduler mutex (US-0087, US-0156): story-drain + bug-queue without
    # explicit bug_target ⇒ AUTO_SCHEDULER_CONFLICT (fail close before any
    # phase resolution).
    if story_drain and bug_queue and not bug_target:
        return {"ok": False, "reasonCode": "AUTO_SCHEDULER_CONFLICT",
                "source": "scheduler"}

    phase_id: str | None = None
    source: str = "no_validated_source"
    resume = _parse_resume_brief(repo)

    if start_from and start_from.strip():
        phase_id = start_from.strip().lstrip("/")
        source = "argv"
        if not _is_known_phase(phase_id):
            return {"ok": False, "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                    "source": "argv"}
    else:
        resume_val = None
        for key in ("intended_resume_phase", "next_scheduled_phase"):
            val = (resume.get(key) or "").strip().lstrip("/")
            if val and val not in ("(none)", "auto", "n/a", "none"):
                resume_val = val
                break
        state_val = _parse_state_next_phase(repo)

        if resume_val is not None:
            if state_val and state_val != resume_val:
                return {"ok": False,
                        "reasonCode": "OPENCODE_AUTO_RESUME_AMBIGUOUS",
                        "source": "resume_brief+state.md"}
            if not _is_known_phase(resume_val):
                return {"ok": False,
                        "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                        "source": "resume_brief"}
            phase_id = resume_val
            source = "resume_brief"
        elif state_val:
            if not _is_known_phase(state_val):
                return {"ok": False,
                        "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                        "source": "state.md"}
            phase_id = state_val
            source = "state.md"

        if phase_id is None and (bug_queue or bug_target):
            phase_id = "intake" if not bug_target else "research"
            source = "us0087_bug_queue"

    if phase_id is None:
        return {"ok": False,
                "reasonCode": "OPENCODE_AUTO_RESOLUTION_FAILED",
                "source": "no_validated_source"}

    def _clean(v: str | None) -> str:
        s = (v or "").strip()
        if s in ("(none)", "n/a", "auto", "", "null", "None", "none"):
            return ""
        return s

    story_id = _clean(resume.get("story_id"))
    sprint_id = _clean(resume.get("sprint_id"))
    run_id = _clean(orchestrator_run_id or resume.get("orchestrator_run_id"))
    bug_id = _clean(resume.get("bug_id"))
    if bug_target:
        bug_id = bug_target

    work_item_kind: str
    work_item_id: str
    if bug_id:
        work_item_kind = "bug"
        work_item_id = bug_id
    elif story_id:
        work_item_kind = "story"
        work_item_id = story_id
    else:
        if story_drain:
            story_sel = _select_next_open_story(repo)
            if not story_sel["ok"]:
                return {"ok": False,
                        "reasonCode": story_sel.get("reasonCode", "OPENCODE_AUTO_DEPENDENCY_BLOCKED"),
                        "source": "backlog.md"}
            work_item_kind = "story"
            work_item_id = story_sel["value"]
            story_id = story_sel["value"]
            sprint_id = sprint_id or _clean(_select_next_sprint_from_backlog(repo, story_sel["value"]))
        elif bug_queue:
            return {"ok": False,
                    "reasonCode": "OPENCODE_AUTO_RESOLUTION_FAILED",
                    "source": "no_bug_id_in_queue"}
        else:
            return {"ok": False,
                    "reasonCode": "OPENCODE_AUTO_RESOLUTION_FAILED",
                    "source": "no_work_item_anchor"}

    plan = _effective_plan_intersection(phase_id, None)
    if not plan:
        return {"ok": False, "reasonCode": "OPENCODE_AUTO_PHASE_PLAN_INVALID",
                "source": "anchor_intersection_empty"}

    ckey = _continuation_key(run_id or "missing", work_item_kind, work_item_id, phase_id)
    existing = continuation_registry.get(ckey)
    if existing is not None:
        if existing.get("session_id") and existing.get("phase_id") != phase_id:
            return {"ok": False, "reasonCode": "OPENCODE_AUTO_CONTINUATION_CONFLICT",
                    "source": "registry"}
        return {
            "ok": True,
            "idempotent_noop": True,
            "source": existing.get("source", source),
            "work_item_kind": work_item_kind,
            "story_id": story_id,
            "bug_id": bug_id,
            "sprint_id": sprint_id,
            "effective_phase_plan": existing.get("effective_phase_plan", plan),
            "skipped_phases": existing.get("skipped_phases", []),
            "phase_id": phase_id,
            "cursor": cursor,
            "remaining_budget": remaining_budget,
            "continuation_key": ckey,
        }
    skipped_phases = (
        list(PHASE_PLAN_ORDER[: PHASE_PLAN_ORDER.index(phase_id)])
        if _is_known_phase(phase_id)
        else []
    )

    continuation_registry[ckey] = {
        "source": source,
        "phase_id": phase_id,
        "effective_phase_plan": plan,
        "skipped_phases": skipped_phases,
        "session_id": None,
    }

    return {
        "ok": True,
        "idempotent_noop": False,
        "source": source,
        "work_item_kind": work_item_kind,
        "story_id": story_id,
        "bug_id": bug_id,
        "sprint_id": sprint_id,
        "effective_phase_plan": plan,
        "skipped_phases": skipped_phases,
        "phase_id": phase_id,
        "cursor": cursor,
        "remaining_budget": remaining_budget,
        "continuation_key": ckey,
    }


def note_continuation_session(
    ckey: str,
    session_id: str,
) -> None:
    existing = continuation_registry.get(ckey)
    if existing is None:
        return
    if existing.get("session_id") and existing["session_id"] != session_id:
        existing["_conflict"] = True
    else:
        existing["session_id"] = session_id


def append_isolation(
    repo: Path,
    *,
    parent_id: str,
    session_id: str,
    role: str,
    phase_id: str,
    timestamp: str,
    fresh_context_marker: str,
    story_id: str | None = None,
    sprint_id: str | None = None,
    orchestrator_run_id: str | None = None,
    bug_id: str | None = None,
    state_path: Path | None = None,
) -> dict:
    placeholder = "tui-auto"
    if parent_id == placeholder or orchestrator_run_id == placeholder:
        return {"ok": False, "reasonCode": "OPENCODE_PLACEHOLDER_PARENT_REJECTED"}
    if not parent_id or not session_id or session_id == parent_id:
        return {"ok": False, "reasonCode": "OPENCODE_SUBTASK_IGNORED"}
    path = state_path or (repo / "docs" / "engineering" / "state.md")
    path.parent.mkdir(parents=True, exist_ok=True)
    extra = ""
    if story_id:
        extra += f"- storyId=`{story_id}`\n"
    if sprint_id:
        extra += f"- sprintId=`{sprint_id}`\n"
    if orchestrator_run_id:
        extra += f"- orchestratorRunId=`{orchestrator_run_id}`\n"
    if bug_id:
        extra += f"- bugId=`{bug_id}`\n"
    block = (
        "\n### IsolationEvidence (OpenCode plugin / BUG-0015)\n\n"
        f"- parentID=`{parent_id}`\n"
        f"- sessionID=`{session_id}`\n"
        f"- role=`{role}`\n"
        f"- phase_id=`{phase_id}`\n"
        f"- timestamp=`{timestamp or _utc_now_iso()}`\n"
        f"- fresh_context_marker=`{fresh_context_marker}`\n"
        f"{extra}"
        f"- sessionID_ne_parentID=`true`\n"
    )
    if path.is_file():
        existing = path.read_text(encoding="utf-8")
        path.write_text(block + "\n" + existing, encoding="utf-8")
    else:
        path.write_text(block.lstrip() + "\n", encoding="utf-8")
    return {"ok": True}


def resolve_manual_phase_context(repo: Path) -> dict:
    resume = _parse_resume_brief(repo)
    return {
        "ok": True,
        "storyId": resume.get("story_id", ""),
        "sprintId": resume.get("sprint_id", ""),
        "orchestratorRunId": resume.get("orchestrator_run_id", ""),
        "bugId": resume.get("bug_id", ""),
    }


# --- BUG-0035 / DEC-0153: phase-child-owned paired continuation record -------
#
# The completed, canonical phase child is the ONLY authorized writer of its
# state-first paired continuation record (state checkpoint first, then the
# resume latest-pointer block). The spawn-only parent never writes either
# artifact and never treats child completion as authority to advance.
#
# Pair key (DEC-0153 §3, exact):
#   orchestrator_run_id|work_item_kind|bug_id|completed_phase|runtime_proof_id
#
# Failure semantics (DEC-0153 §4):
#   - syntax failure only            → RESUME_BRIEF_UNPARSEABLE
#   - stale, absent-required, conflicting, unauthorized, replay, or
#     proof/isolation-invalid        → RESUME_BRIEF_STALE (predicate retained)
# There is NO state fallback, NO parent repair, NO reconciler, NO next spawn,
# and `RESUME_BRIEF_AUTO_REFRESH=0` remains an absolute prohibition.

RESUME_BRIEF_STALE = "RESUME_BRIEF_STALE"
RESUME_BRIEF_UNPARSEABLE = "RESUME_BRIEF_UNPARSEABLE"

# Canonical locked tuple fields the state side and the brief side must agree on.
PAIR_LOCKED_FIELDS = (
    "orchestrator_run_id",
    "work_item_kind",
    "bug_id",
    "completed_phase",
    "writer_role",
    "fresh_context_marker",
    "resolution_source",
    "effective_plan",
    "skipped_phases",
    "completed_phases",
    "next_scheduled_phase",
    "next_scheduled_role",
    "phase_cursor",
    "budget_scope",
    "stop_reason",
    "runtime_proof_id",
    "proof_hash",
    "proof_issued_at",
    "proof_ttl_seconds",
    "phase_id",
)

# Registry of already-authorized pairs: key → canonical tuple (idempotence +
# replay/conflict detection). Tests reset via reset_resume_pair_registry_for_tests().
resume_pair_registry: dict[str, dict] = {}


def reset_resume_pair_registry_for_tests() -> None:
    """Clear the child-owned pair registry (test isolation only)."""
    resume_pair_registry.clear()


def build_resume_pair_key(record: dict) -> str:
    """Construct the exact DEC-0153 pair key from a canonical record."""
    value = record or {}
    return "|".join(
        str(value.get(field, ""))
        for field in (
            "orchestrator_run_id",
            "work_item_kind",
            "bug_id",
            "completed_phase",
            "runtime_proof_id",
        )
    )


def _pair_field_ok(field: str, value: object) -> bool:
    if isinstance(value, bool):
        return False
    if isinstance(value, (int, float, str)) or value is None:
        return True
    if isinstance(value, (list, tuple)):
        return all(_pair_field_ok(field, item) for item in value)
    if isinstance(value, dict):
        if not value:
            return False
        return all(
            isinstance(item, str) and _pair_field_ok(field, item2)
            for item, item2 in value.items()
        )
    return False


def _validate_pair_tuple(record: object) -> dict:
    """Syntax-level validation of one pair-record dict.

    Returns {"ok": True, "record": cleaned} or a reason-coded failure with the
    retained predicate. Syntax failures are RESUME_BRIEF_UNPARSEABLE; absent
    required evidence is RESUME_BRIEF_STALE.
    """
    if not isinstance(record, dict):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_UNPARSEABLE,
            "predicate": "pair_record_not_object",
        }
    if not record or record.get("record_key") is None:
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_STALE,
            "predicate": "absent_required_record_key",
        }
    key = record.get("record_key")
    if not isinstance(key, str) or not all(part for part in key.split("|")):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_UNPARSEABLE,
            "predicate": "malformed_record_key",
        }
    for field in PAIR_LOCKED_FIELDS:
        if field not in record:
            return {
                "ok": False,
                "reasonCode": RESUME_BRIEF_STALE,
                "predicate": f"absent_required_field:{field}",
            }
        if not _pair_field_ok(field, record[field]):
            return {
                "ok": False,
                "reasonCode": RESUME_BRIEF_UNPARSEABLE,
                "predicate": f"malformed_field:{field}",
            }
    marker = record.get("fresh_context_marker")
    if not (
        isinstance(marker, str)
        and marker
        and marker != "tui-auto"
        and marker.endswith("-fresh")
    ):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_STALE,
            "predicate": "fresh_marker_reused_or_missing",
        }
    proof_role = record.get("phase_id")
    if not (
        isinstance(proof_role, str)
        and proof_role
        and proof_role in PHASE_PLAN_ORDER
    ):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_STALE,
            "predicate": "strict_proof_phase_invalid",
        }
    proof_ttl = record.get("proof_ttl_seconds")
    if (
        not isinstance(proof_ttl, int)
        or isinstance(proof_ttl, bool)
        or proof_ttl <= 0
    ):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_UNPARSEABLE,
            "predicate": "strict_proof_ttl_invalid",
        }
    if not (
        isinstance(record.get("proof_issued_at"), str)
        and record["proof_issued_at"]
    ):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_STALE,
            "predicate": "strict_proof_issued_at_missing",
        }
    if not (
        isinstance(record.get("runtime_proof_id"), str)
        and record["runtime_proof_id"]
    ):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_STALE,
            "predicate": "strict_proof_id_missing",
        }
    if not (
        isinstance(record.get("proof_hash"), str)
        and len(record["proof_hash"]) == 64
        and all(c in "0123456789abcdefABCDEF" for c in record["proof_hash"])
    ):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_UNPARSEABLE,
            "predicate": "strict_proof_hash_invalid",
        }
    return {"ok": True, "record": dict(record)}


def validate_resume_pair(
    repo: Path,
    *,
    writer_role: str | None,
    state_tuple: object = None,
    brief_tuple: object = None,
) -> dict:
    """Read/validate-only the BUG-0035 state/brief continuation pair (DEC-0153).

    The spawn-only parent uses this to compare a completed child's state
    checkpoint against the resume latest-pointer block. It NEVER writes either
    artifact and NEVER falls back to state alone: an incomplete or invalid pair
    is a hard fail-closed stop with the retained predicate.
    """
    # -- writer authorization (unauthorized writer → RESUME_BRIEF_STALE) ---
    if (
        not isinstance(writer_role, str)
        or not writer_role
        or writer_role == "auto"
        or writer_role in ("parent", "orchestrator")
    ):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_STALE,
            "predicate": "unauthorized_writer_role",
            "next_scheduled_phase": None,
        }
    state = _validate_pair_tuple(state_tuple)
    if not state["ok"]:
        return {
            "ok": False,
            "reasonCode": state["reasonCode"],
            "predicate": state["predicate"],
            "next_scheduled_phase": None,
        }
    rec_s = state["record"]
    if rec_s.get("writer_role") != writer_role:
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_STALE,
            "predicate": "writer_role_mismatch",
            "next_scheduled_phase": None,
        }
    brief = _validate_pair_tuple(brief_tuple)
    if not brief["ok"]:
        return {
            "ok": False,
            "reasonCode": brief["reasonCode"],
            "predicate": brief["predicate"],
            "next_scheduled_phase": None,
        }
    rec_b = brief["record"]
    key_s = rec_s.get("record_key")
    key_b = rec_b.get("record_key")
    if key_s != key_b:
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_STALE,
            "predicate": "pair_key_mismatch",
            "next_scheduled_phase": None,
        }
    for field in PAIR_LOCKED_FIELDS:
        if rec_s[field] != rec_b[field]:
            return {
                "ok": False,
                "reasonCode": RESUME_BRIEF_STALE,
                "predicate": f"tuple_conflict:{field}",
                "next_scheduled_phase": None,
            }
    # -- replay / idempotence: exact canonical replay is the sole no-op -----
    seen = resume_pair_registry.get(key_s)
    if seen is not None:
        if seen != rec_s:
            return {
                "ok": False,
                "reasonCode": RESUME_BRIEF_STALE,
                "predicate": "replay_conflict",
                "next_scheduled_phase": None,
            }
        return {
            "ok": True,
            "idempotent_noop": True,
            "reasonCode": None,
            "predicate": "exact_canonical_replay",
            "key": key_s,
            "next_scheduled_phase": rec_s.get("next_scheduled_phase"),
        }
    resume_pair_registry[key_s] = dict(rec_s)
    return {
        "ok": True,
        "idempotent_noop": False,
        "reasonCode": None,
        "predicate": None,
        "key": key_s,
        "next_scheduled_phase": rec_s.get("next_scheduled_phase"),
    }


def phase_boundary_self_check(
    repo: Path,
    *,
    writer_role: str,
    state_json: str,
    brief_json: str,
) -> dict:
    """BUG-0044 Lock 4: completed phase child's pre-STOP pair self-check.

    Composes the existing DEC-0153 state/brief pair validation
    (`validate_resume_pair`) with two pre-checks so that a phase child can
    verify its own state-bottom checkpoint and brief-top pointer before
    emitting its STOP reason (architecture `# BUG-0044` Lock 1, step 5):
      1. BOTH sides parse as a JSON object -> otherwise RESUME_BRIEF_UNPARSEABLE
         (predicate `pair_json_unparseable:state` / `pair_json_unparseable:brief`);
      2. the canonical forms are byte-identical -> otherwise RESUME_BRIEF_STALE
         (predicate `pair_not_byte_identical`);
      3. the strict 6-tuple proof hash recomputed from the STATE side's
         strict-proof fields (via `token_cost_lib.compute_strict_proof_hash`)
         equals the stored `proof_hash` -> otherwise RESUME_BRIEF_STALE
         (predicate `proof_hash_mismatch`). Only when all six fields are
         well-typed; malformed types defer to the composed validator below,
         which retains its own reason code and predicate.
    Step 4 delegates to `validate_resume_pair(writer_role=<own role>)`, which
    retains every existing predicate (unauthorized writer role, writer-role
    mismatch, pair-key/field conflict, replay).

    Read-only: this helper NEVER writes either artifact, NEVER mints a proof,
    and NEVER grants the parent any authority. `RESUME_BRIEF_AUTO_REFRESH=0`
    remains an absolute prohibition. A missing/conflicting pair is a
    deterministic fail-closed stop (no state-alone fallback, no auto-refresh,
    no silent continue); `next_scheduled_phase` is only reported on the
    delegated validator's success path.
    """
    # -- step 1: both sides must parse as a JSON object --------------------
    try:
        state_rec = json.loads(state_json)
    except (TypeError, ValueError):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_UNPARSEABLE,
            "predicate": "pair_json_unparseable:state",
            "next_scheduled_phase": None,
        }
    try:
        brief_rec = json.loads(brief_json)
    except (TypeError, ValueError):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_UNPARSEABLE,
            "predicate": "pair_json_unparseable:brief",
            "next_scheduled_phase": None,
        }
    if not isinstance(state_rec, dict):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_UNPARSEABLE,
            "predicate": "pair_record_not_object:state",
            "next_scheduled_phase": None,
        }
    if not isinstance(brief_rec, dict):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_UNPARSEABLE,
            "predicate": "pair_record_not_object:brief",
            "next_scheduled_phase": None,
        }
    # -- step 2: canonical byte-identity (normalized form) -----------------
    if token_cost_lib.canonical_json_dumps(state_rec) != token_cost_lib.canonical_json_dumps(brief_rec):
        return {
            "ok": False,
            "reasonCode": RESUME_BRIEF_STALE,
            "predicate": "pair_not_byte_identical",
            "next_scheduled_phase": None,
        }
    # -- step 3: strict 6-tuple proof hash recompute (STATE side) ----------
    orch_id = state_rec.get("orchestrator_run_id")
    proof_id = state_rec.get("runtime_proof_id")
    phase_id = state_rec.get("phase_id")
    role_field = state_rec.get("role", writer_role)
    issued_at = state_rec.get("proof_issued_at")
    ttl_seconds = state_rec.get("proof_ttl_seconds")
    if (
        isinstance(orch_id, str)
        and isinstance(proof_id, str)
        and isinstance(phase_id, str)
        and isinstance(role_field, str)
        and isinstance(issued_at, str)
        and isinstance(ttl_seconds, int)
        and not isinstance(ttl_seconds, bool)
    ):
        recomputed = token_cost_lib.compute_strict_proof_hash(
            orch_id, proof_id, phase_id, role_field, issued_at, ttl_seconds
        )
        if recomputed != state_rec.get("proof_hash"):
            return {
                "ok": False,
                "reasonCode": RESUME_BRIEF_STALE,
                "predicate": "proof_hash_mismatch",
                "next_scheduled_phase": None,
            }
    # malformed strict-proof types defer to the composed validator below,
    # which retains its own reason code and predicate.
    # -- step 4: composed DEC-0153 pair validation (retained predicates) ---
    return validate_resume_pair(
        repo,
        writer_role=writer_role,
        state_tuple=state_rec,
        brief_tuple=brief_rec,
    )


def _write_resume_pointer_block(
    repo: Path,
    *,
    record_key: str,
    writer_role: str,
    next_phase: str,
    next_role: str,
    completed_phase: str,
    fresh_marker: str,
) -> Path:
    """Atomically prepend the resume latest-pointer block to resume_brief.md.

    Uses the temporary-file-plus-replace strategy already established by
    DEC-0069 history retention; cross-file atomicity is deliberately NOT
    claimed (the validation rule, not a partial write, is the safety boundary).
    """
    path = repo / "handoffs" / "resume_brief.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    header = (
        f"# Resume Brief — BUG-0035 CONTINUATION PAIR — {record_key}"
        f" (role={writer_role})\n\n"
        f"- `record_key`: `{record_key}`\n"
        f"- `writer_role`: `{writer_role}`\n"
        f"- `completed_phase`: `{completed_phase}`\n"
        f"- `next_scheduled_phase`: `{next_phase}`\n"
        f"- `next_scheduled_role`: `{next_role}`\n"
        f"- `fresh_context_marker`: `{fresh_marker}`\n"
    )
    prior = ""
    if path.is_file():
        prior = "\n---\n\n" + path.read_text(encoding="utf-8")
    tmp = path.with_suffix(".md.tmp")
    content = header + prior
    tmp.write_text(content, encoding="utf-8")
    tmp.replace(path)
    return path


def write_resume_pair(
    repo: Path,
    *,
    writer_role: str,
    state_checkpoint_text: str,
    state_path: Path | None = None,
    state_tuple: object = None,
    brief_tuple: object = None,
) -> dict:
    """BUG-0035 / DEC-0153 §2: state-first, validate-then-brief pair update.

    Only the completed, canonical phase child (whose role owns
    `handoffs/resume_brief.md` in the active permission map) may call this.
    Order is deliberately state, then validation, then the atomic brief
    pointer: a denial or crash before the brief leaves no lawful continuation
    record and fails closed. No state fallback, no reconciler, no next spawn
    is scheduled here.
    """
    path = state_path or (repo / "docs" / "engineering" / "state.md")
    path.parent.mkdir(parents=True, exist_ok=True)
    block = state_checkpoint_text.rstrip("\n") + "\n"
    if path.is_file():
        existing = path.read_text(encoding="utf-8")
        path.write_text(block + "\n" + existing, encoding="utf-8")
    else:
        path.write_text(block.lstrip("\n"), encoding="utf-8")

    if state_tuple is None:
        state_tuple = {"record_key": None}
    if brief_tuple is None:
        brief_tuple = {}
    result = validate_resume_pair(repo, writer_role=writer_role,
                                  state_tuple=state_tuple,
                                  brief_tuple=brief_tuple)
    if not result.get("ok"):
        if "next_scheduled_phase" not in result:
            result["next_scheduled_phase"] = None
        return result
    if result.get("idempotent_noop"):
        return result
    rec = resume_pair_registry.get(result.get("key") or "") or {}
    _write_resume_pointer_block(
        repo,
        record_key=str(rec.get("record_key") or result.get("key")),
        writer_role=str(rec.get("writer_role") or writer_role),
        next_phase=str(rec.get("next_scheduled_phase") or ""),
        next_role=str(rec.get("next_scheduled_role") or ""),
        completed_phase=str(rec.get("completed_phase") or ""),
        fresh_marker=str(rec.get("fresh_context_marker") or ""),
    )
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="BUG-0015 OpenCode auto bridge")
    parser.add_argument("--repo", default=".", help="Repository root")
    parser.add_argument(
        "--select-first-phase",
        action="store_true",
        help="Emit JSON first-phase selection",
    )
    parser.add_argument("--start-from", default=None, help="Explicit phase argv")
    parser.add_argument("--bug-target", default=None, help="Bug id when bug-queue wins")
    parser.add_argument(
        "--orchestrator-run-id",
        default=None,
        dest="orchestrator_run_id",
    )
    parser.add_argument(
        "--append-isolation",
        action="store_true",
        help="Append IsolationEvidence block to state.md",
    )
    parser.add_argument("--parent-id", default=None)
    parser.add_argument("--session-id", default=None)
    parser.add_argument("--role", default=None)
    parser.add_argument("--phase-id", default=None)
    parser.add_argument("--timestamp", default=None)
    parser.add_argument("--fresh-context-marker", default=None)
    parser.add_argument("--story-id", default=None, dest="story_id")
    parser.add_argument("--sprint-id", default=None, dest="sprint_id")
    parser.add_argument("--bug-id", default=None, dest="bug_id")
    parser.add_argument(
        "--resolve-context",
        action="store_true",
        help="Emit JSON story/sprint/run/bug from resume_brief",
    )
    parser.add_argument(
        "--resolve-continuation",
        action="store_true",
        help="US-0156 / DEC-0152: typed, read-only continuation resolution",
    )
    parser.add_argument("--cursor", default="0", help="Cursor for continuation accounting")
    parser.add_argument("--remaining-budget", default="32", dest="remaining_budget")
    parser.add_argument("--state-path", default=None, help="Override state.md path")
    parser.add_argument(
        "--write-resume-pair",
        action="store_true",
        help="BUG-0035 / DEC-0153: state-first, validate-then-brief pair update "
             "(child-owned; writer_role required; state/brief tuples via "
             "JSON object: {state: {...}, brief: {...}})",
    )
    parser.add_argument(
        "--resume-pair-json",
        default=None,
        dest="resume_pair_json",
        help="JSON object with state/brief pair tuples for --write-resume-pair",
    )
    args = parser.parse_args()
    repo = Path(args.repo).resolve()

    if args.select_first_phase:
        payload = select_first_phase(
            repo, start_from=args.start_from, bug_target=args.bug_target
        )
        sys.stdout.write(json.dumps(payload, sort_keys=True, separators=(",", ":")))
        sys.stdout.write("\n")
        return EXIT_OK if payload.get("ok") else EXIT_FAIL

    if args.resolve_continuation:
        payload = resolve_continuation(
            repo,
            start_from=args.start_from,
            bug_target=args.bug_target,
            orchestrator_run_id=args.orchestrator_run_id,
            cursor=int(args.cursor or 0),
            remaining_budget=int(args.remaining_budget or 32),
        )
        sys.stdout.write(json.dumps(payload, sort_keys=True, separators=(",", ":")))
        sys.stdout.write("\n")
        return EXIT_OK if payload.get("ok") else EXIT_FAIL

    if args.resolve_context:
        payload = resolve_manual_phase_context(repo)
        sys.stdout.write(json.dumps(payload, sort_keys=True, separators=(",", ":")))
        sys.stdout.write("\n")
        return EXIT_OK

    if args.append_isolation:
        if not all(
            [
                args.parent_id,
                args.session_id,
                args.role,
                args.phase_id,
                args.fresh_context_marker,
            ]
        ):
            sys.stderr.write("append-isolation requires identity fields\n")
            return EXIT_FAIL
        state_path = Path(args.state_path) if args.state_path else None
        payload = append_isolation(
            repo,
            parent_id=args.parent_id,
            session_id=args.session_id,
            role=args.role,
            phase_id=args.phase_id,
            timestamp=args.timestamp or _utc_now_iso(),
            fresh_context_marker=args.fresh_context_marker,
            story_id=args.story_id,
            sprint_id=args.sprint_id,
            orchestrator_run_id=args.orchestrator_run_id,
            bug_id=args.bug_id,
            state_path=state_path,
        )
        sys.stdout.write(json.dumps(payload, sort_keys=True, separators=(",", ":")))
        sys.stdout.write("\n")
        return EXIT_OK if payload.get("ok") else EXIT_FAIL

    if args.write_resume_pair:
        if not args.role:
            sys.stderr.write(
                "write-resume-pair requires --role (the child writer role)\n"
            )
            return EXIT_FAIL
        pair: dict = {}
        if args.resume_pair_json:
            try:
                pair = json.loads(args.resume_pair_json)
            except ValueError as exc:
                sys.stderr.write(f"resume-pair-json parse error: {exc}\n")
                return EXIT_FAIL
        checkpoint = (
            f"## Resume pair checkpoint — BUG-0035 / DEC-0153 (role={args.role})\n\n"
            f"- writer_role=`{args.role}`\n"
            f"- pair_key=see state/brief tuples\n"
            f"- commit_order=state_then_brief\n"
        )
        payload = write_resume_pair(
            repo,
            writer_role=args.role,
            state_checkpoint_text=checkpoint,
            state_path=Path(args.state_path) if args.state_path else None,
            state_tuple=(pair or {}).get("state") or {},
            brief_tuple=(pair or {}).get("brief") or {},
        )
        sys.stdout.write(json.dumps(payload, sort_keys=True, separators=(",", ":")))
        sys.stdout.write("\n")
        return EXIT_OK if payload.get("ok") else EXIT_FAIL

    parser.print_help()
    return EXIT_FAIL


if __name__ == "__main__":
    sys.exit(main())
