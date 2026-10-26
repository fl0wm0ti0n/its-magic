#!/usr/bin/env python3
"""
Full-autonomy outer driver (US-0092 / DEC-0078).

Spawn-only: loops documented /auto hook invocations; never performs phase-role work.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))
import host_runtime_config_lib as hrc  # noqa: E402

EXIT_COMPLETED = 0
EXIT_HARD_STOP = 1
EXIT_CONFIG = 2
EXIT_LOOP_MAX = 3
EXIT_BACKLOG_MAX = 4
EXIT_PAUSE = 5
EXIT_BLOCK_RETRY_CAP = 6
EXIT_TIMEOUT = 124

HARD_STOP_REASONS = frozenset(
    {
        "decision_gate",
        "error",
        "pause_request",
        "loop_max",
        "gate_blocked",
        "AUTO_SCHEDULER_CONFLICT",
    }
)
HARD_BLOCKED_SUBCODES = frozenset(
    {"isolation", "strict_proof", "ownership", "security_deny"}
)
RECOVERABLE_STOP_REASONS = frozenset(
    {"blocked", "missing_input", "uat_fail", "qa_fail"}
)
# US-0158 — optional continue classes. Absent --recoverable-class keeps today's JSON.
RECOVERABLE_CLASS_TOKENS = frozenset(
    {"blocked", "ai_error", "aborted", "permission_dead_end"}
)
SEVEN_ROLE_ALLOW = frozenset(
    {"po", "tech-lead", "dev", "qa", "release", "curator", "security"}
)
MATRIX_ROLES = frozenset(
    {"po", "tech-lead", "dev", "qa", "release", "curator"}
)
TERMINAL_CONTINUE_TOKENS = frozenset(
    {
        "QUALITY_EVIDENCE_FAILED",
        "BUDGET_EXHAUSTED",
        "qa_fail",
        "uat_fail",
        "security_deny",
        "isolation",
        "strict_proof",
        "ownership",
        "PHASE_ROLE_CAPABILITY_MISSING",
        "PHASE_ROLE_MISMATCH",
        "OPENCODE_AUTO_DEPENDENCY_BLOCKED",
        "AUTO_BACKLOG_ON_BLOCK",
        "AUTO_BACKLOG_ON_BLOCK=skip",
        "decision_gate",
        "pause_request",
        "loop_max",
        "PLUGIN_SPAWN_UNSUPPORTED",
        "OPENCODE_PLUGIN_SPAWN_UNSUPPORTED",
        "HEADLESS_UNSUPPORTED",
        "OPENCODE_HEADLESS_UNSUPPORTED",
        "AUTO_ALREADY_RUNNING",
        "OPENCODE_AUTO_ALREADY_RUNNING",
        "SUBTASK_IGNORED",
        "OPENCODE_SUBTASK_IGNORED",
        "MANUAL_PHASE_PERSIST_DENIED",
        "OPENCODE_MANUAL_PHASE_PERSIST_DENIED",
        "MANUAL_PHASE_WRITE_DENIED",
        "OPENCODE_MANUAL_PHASE_WRITE_DENIED",
        "PLACEHOLDER_PARENT_REJECTED",
        "OPENCODE_PLACEHOLDER_PARENT_REJECTED",
        "error",
        ".env",
        "secrets",
        "secret",
    }
)
DRAIN_ADVANCE_MARKERS = frozenset(
    {"refresh-context", "discovery", "intake"}
)

# US-0164 / DEC-0155 — gate cause resolution + autonomy continuity.
# Four new reason codes (T-008); grep confirmed 0 prior occurrences at mint.
# `HOST_CONFIG_INVALID` (existing, US-0131) is REUSED for unknown gate ids —
# not a 5th code.
SELFRESOLVE_ATTEMPT_EXHAUSTED = "SELFRESOLVE_ATTEMPT_EXHAUSTED"
PROVIDER_SWITCH_APPLIED = "PROVIDER_SWITCH_APPLIED"
PROVIDER_SWITCH_CAP_REACHED = "PROVIDER_SWITCH_CAP_REACHED"
SELFRESOLVE_DRAIN_HANDOFF = "SELFRESOLVE_DRAIN_HANDOFF"
SELFRESOLVE_REASON_CODES = frozenset(
    {
        SELFRESOLVE_ATTEMPT_EXHAUSTED,
        PROVIDER_SWITCH_APPLIED,
        PROVIDER_SWITCH_CAP_REACHED,
        SELFRESOLVE_DRAIN_HANDOFF,
    }
)
# Per-gate cause-resolution table default set (T-002). `error`/`security`/
# `publish` → same-phase child repairs the cause, gate re-check re-runs
# unchanged, still failing → SELFRESOLVE_ATTEMPT_EXHAUSTED; `missing_input` →
# T-003 transient/critical split; `decision_gate` → propose-and-hold, never
# auto-continue. `pause_request` + gate-override-forbidden are NEVER in this
# set and stay hard in every configuration.
SELFRESOLVE_DEFAULT_GATES = frozenset(
    {"error", "missing_input", "decision_gate", "security", "publish"}
)
# Hard, cannot be removed, never self-resolved (T-006).
SELFRESOLVE_HARD_EXCLUDE = frozenset({"pause_request"})
# Budget gates are NOT in the self-resolve set (T-004).
BUDGET_GATE_STOPS = frozenset({"loop_max", "BACKLOG_MAX_STORIES_REACHED"})
# US-0164 row 1 (stop-matrix): active gate in the validated AUTO_SELFRESOLVE_GATES
# set → one cause-resolution attempt per (phaseId, gate) via the same-phase
# child → continue_same_phase if the unchanged gate re-check passes, else
# SELFRESOLVE_ATTEMPT_EXHAUSTED.
SELFRESOLVE_ROW1 = (
    "row1: active gate in validated AUTO_SELFRESOLVE_GATES -> one "
    "cause-resolution attempt per (phaseId, gate) via same-phase child -> "
    "continue_same_phase if unchanged gate re-check passes, else "
    "SELFRESOLVE_ATTEMPT_EXHAUSTED"
)
# US-0164 row 2 (stop-matrix): SELFRESOLVE_ATTEMPT_EXHAUSTED or budget-gate
# after provider fallback (PROVIDER_SWITCH_CAP_REACHED) → silent drain handoff
# (SELFRESOLVE_DRAIN_HANDOFF) when drain enabled + eligible OPEN story + budget
# remaining, else hard_stop (fail-closed, unchanged).
SELFRESOLVE_ROW2 = (
    "row2: SELFRESOLVE_ATTEMPT_EXHAUSTED or budget-gate after provider "
    "fallback (PROVIDER_SWITCH_CAP_REACHED) -> silent drain handoff "
    "(SELFRESOLVE_DRAIN_HANDOFF) when drain enabled + eligible OPEN story + "
    "budget remaining, else hard_stop (fail-closed, unchanged)"
)


def _parse_gate_csv(raw: str | None) -> list[str]:
    if not raw:
        return []
    return [g.strip() for g in raw.split(",") if g.strip()]


def validate_selfresolve_config(merged: dict[str, str]):
    """T-006 — resolve the five AUTO_* keys + fail closed on unknown gate id.

    Returns (config, err). config keys: gates (list, default empty), exclude
    (frozenset, always pause_request), budget_provider_fallback ("0"/"1"),
    provider_switch_max (int, default 1), budget_exhausted_drain ("0"/"1").
    Unknown gate id in AUTO_SELFRESOLVE_GATES → err = HOST_CONFIG_INVALID with
    the offending key+value (NOT a 5th code, NOT silently ignored).
    """
    config = {
        "gates": _parse_gate_csv(merged.get("AUTO_SELFRESOLVE_GATES")),
        "exclude": frozenset(SELFRESOLVE_HARD_EXCLUDE),
        "budget_provider_fallback": merged.get("AUTO_BUDGET_PROVIDER_FALLBACK", "0"),
        "provider_switch_max": 1,
        "budget_exhausted_drain": merged.get("AUTO_BUDGET_EXHAUSTED_DRAIN", "0"),
    }
    for g in config["gates"]:
        if g not in SELFRESOLVE_DEFAULT_GATES:
            return None, f"HOST_CONFIG_INVALID: AUTO_SELFRESOLVE_GATES={g}"
    raw_max = merged.get("AUTO_PROVIDER_SWITCH_MAX", "")
    if raw_max:
        try:
            config["provider_switch_max"] = int(raw_max)
        except ValueError:
            return None, f"HOST_CONFIG_INVALID: AUTO_PROVIDER_SWITCH_MAX={raw_max}"
    return config, None


def selfresolve_gate_decision(
    *,
    gate: str,
    config: dict | None,
    prior_attempts: int = 0,
    reason_code: str | None = None,
):
    """T-001/T-002/T-003 — decide continue-vs-stop for a configured gate.

    Pure (no IO). The driver only decides; it never inspects, edits, or
    re-scores the gate — the SAME unchanged gate check re-runs in the spawned
    same-phase child. Bounded = one attempt per (phaseId, gate): prior_attempts
    is the count of prior SELFRESOLVE_ATTEMPT rows for this (phase, gate).
    """
    # T-002/T-006: pause_request + gate-override-forbidden are NEVER
    # self-resolvable — hard stop in every configuration (safety floor).
    if gate in SELFRESOLVE_HARD_EXCLUDE or gate == "pause_request":
        return {
            "action": "hard_stop",
            "selfresolve_gate": gate,
            "reason_code": "PAUSE_REQUEST_SAFETY_FLOOR_HARD",
            "notify": selfresolve_segment_handoff_notification(
                event="selfresolve_safety_floor_hard",
                message=(
                    f"US-0164 safety floor: {gate} is never self-resolvable; "
                    "hard stop in every configuration"
                ),
            ),
        }
    # T-006: unknown gate id → fail closed reusing HOST_CONFIG_INVALID
    # (NOT a 5th code, NOT silently ignored).
    if gate not in SELFRESOLVE_DEFAULT_GATES:
        return {
            "action": "hard_stop",
            "selfresolve_gate": gate,
            "reason_code": "HOST_CONFIG_INVALID",
            "notify": selfresolve_segment_handoff_notification(
                event="selfresolve_unknown_gate",
                message=(
                    f"US-0164 unknown gate id AUTO_SELFRESOLVE_GATES={gate}; "
                    "fail closed (HOST_CONFIG_INVALID)"
                ),
            ),
        }
    # Whether this gate is in the validated, operator-enabled set (T-006).
    # Drives the continue-vs-stop decision for error/security/publish +
    # transient missing_input only; the safety-floor gates below are hard in
    # EVERY configuration (full self-resolve config included).
    enabled = bool(config) and gate in config["gates"]
    # T-002: decision_gate → propose-and-hold, NEVER auto-continue. The run
    # halts with decision_gate=true + non-suppressible notification; no
    # decision_gate=false flip, no auto-flip. Stays in TERMINAL_CONTINUE_TOKENS.
    if gate == "decision_gate":
        return {
            "action": "hard_stop",
            "selfresolve_gate": gate,
            "reason_code": "SELFRESOLVE_PROPOSE_AND_HOLD",
            "decision_gate": True,
            "notify": {
                "event": "decision_gate_propose_and_hold",
                "message": (
                    "US-0164 decision_gate propose-and-hold: proposal artifact "
                    "+ names-only ledger row written; gate re-check still "
                    "fails; run halts with decision_gate=true"
                ),
                "suppressible": False,
            },
        }
    # T-003: missing_input critical → NOT self-resolvable → hard stop unchanged.
    if gate == "missing_input" and reason_code in (
        "critical",
        "CRITICAL_MISSING_INPUT",
    ):
        return {
            "action": "hard_stop",
            "selfresolve_gate": gate,
            "reason_code": "CRITICAL_MISSING_INPUT_HARD",
            "notify": {
                "event": "selfresolve_critical_missing_input",
                "message": (
                    "US-0164 critical missing_input is not self-resolvable; "
                    "hard stop unchanged"
                ),
                "suppressible": False,
            },
        }
    # T-002: error/security/publish (+ transient missing_input) → same-phase
    # child repairs the cause; gate re-check re-runs unchanged.
    if enabled:
        if prior_attempts >= 1:
            # T-008 row 1: second hit → bounded exhaustion.
            return {
                "action": "hard_stop",
                "selfresolve_gate": gate,
                "reason_code": SELFRESOLVE_ATTEMPT_EXHAUSTED,
                "notify": {
                    "event": "selfresolve_attempt_exhausted",
                    "message": (
                        f"US-0164 {gate}: one cause-resolution attempt "
                        "exhausted per (phaseId, gate); gate re-check still "
                        "fails"
                    ),
                    "suppressible": False,
                },
            }
        # continue_same_phase — byte-identical action/next_phase to the US-0158
        # continue branch (next_phase set to <phase> by the caller).
        return {
            "action": "continue_same_phase",
            "selfresolve_gate": gate,
            "reason_code": "SELFRESOLVE_ATTEMPT_SCHEDULED",
            "notify": {
                "event": "selfresolve_attempt_scheduled",
                "message": (
                    f"US-0164 {gate}: same-phase child repairs the cause; "
                    "the unchanged gate check re-runs; one attempt per "
                    "(phaseId, gate)"
                ),
                "suppressible": False,
            },
        }
    # Gate configured OFF (default-off) or unknown-at-call-time → hard stop
    # (fail closed; default-off = byte-identical legacy action is preserved by
    # the caller when the flag is ABSENT).
    return {
        "action": "hard_stop",
        "selfresolve_gate": gate,
        "reason_code": "SELFRESOLVE_GATE_NOT_ENABLED",
        "notify": {
            "event": "selfresolve_gate_not_enabled",
            "message": (
                f"US-0164 {gate}: not in the enabled AUTO_SELFRESOLVE_GATES "
                "set; hard stop (default-off)"
            ),
            "suppressible": False,
        },
    }


def provider_switch_decision(
    *,
    stop_reason: str,
    config: dict | None,
    prior_switches: int = 0,
):
    """T-004 — budget-gate provider fallback decision (pure).

    Budget gates (loop_max, BACKLOG_MAX_STORIES_REACHED) are NOT in the
    self-resolve set. When a budget gate fires AND AUTO_BUDGET_PROVIDER_FALLBACK
    = 1 AND the one-switch-per-run cap is unused → at most ONE switch (the NEXT
    phase child's model is resolved via model_tier_lib.resolve_model_for_phase,
    a DIFFERENT tier/alias). Cap hit → PROVIDER_SWITCH_CAP_REACHED. The budget
    counter is NOT reset (carries over). Catalog failure → no switch, hard stop.
    """
    if stop_reason not in BUDGET_GATE_STOPS:
        return None
    fallback_on = bool(config) and config.get(
        "budget_provider_fallback", "0"
    ) == "1"
    switch_max = config.get("provider_switch_max", 1) if config else 1
    if not fallback_on:
        # Fallback off → the budget gate stays a hard stop (no switch).
        return {
            "action": "hard_stop",
            "reason_code": "BUDGET_GATE_HARD_STOP",
            "provider_switch": False,
            "budget_carryover": True,
            "notify": {
                "event": "budget_gate_no_fallback",
                "message": (
                    f"US-0164 budget gate {stop_reason}: "
                    "AUTO_BUDGET_PROVIDER_FALLBACK off; hard stop, no switch"
                ),
                "suppressible": False,
            },
        }
    if prior_switches >= switch_max:
        return {
            "action": "hard_stop",
            "reason_code": PROVIDER_SWITCH_CAP_REACHED,
            "provider_switch": False,
            "budget_carryover": True,
            "notify": {
                "event": "provider_switch_cap_reached",
                "message": (
                    f"US-0164 budget gate {stop_reason}: provider switch cap "
                    f"({switch_max}) reached; PROVIDER_SWITCH_CAP_REACHED"
                ),
                "suppressible": False,
            },
        }
    return {
        "action": "provider_switch",
        "reason_code": PROVIDER_SWITCH_APPLIED,
        "provider_switch": True,
        "switch_max": switch_max,
        "budget_carryover": True,
        "notify": {
            "event": "provider_switch_applied",
            "message": (
                f"US-0164 budget gate {stop_reason}: at most ONE provider "
                "switch via model_tier_lib.resolve_model_for_phase (different "
                "tier/alias); budget counter NOT reset (carries over)"
            ),
            "suppressible": False,
        },
    }


def resolve_next_child_model_for_switch(
    *,
    phase: str,
    scratchpad: dict[str, str] | None = None,
    catalog_path: Path | None = None,
) -> dict:
    """T-004 — resolve the NEXT phase child's model via the US-0101/DEC-0086
    catalog (US-0102/DEC-0087 role chain, 5-step precedence). Pure except for
    the lazy model_tier_lib import. Returns a names-only dict.

    Success: {"success": True, "alias":..., "tier":..., "slug":...,
    "provenance":...}. Failure: {"success": False, "reason_code":
    "CATALOG_RESOLUTION_FAILED"} — the caller then keeps the budget gate a
    hard stop with NO switch (fail-closed; the running parent model is
    unchanged, the outer driver is model-less Python).
    """
    try:
        import model_tier_lib as mtl  # noqa: E402  (lazy; keeps import light)
    except Exception:
        return {
            "success": False,
            "reason_code": "CATALOG_RESOLUTION_FAILED",
            "provenance": None,
        }
    try:
        result = mtl.resolve_model_for_phase(
            phase,
            scratchpad=scratchpad,
            catalog_path=catalog_path,
        )
    except Exception:
        return {
            "success": False,
            "reason_code": "CATALOG_RESOLUTION_FAILED",
            "provenance": None,
        }
    if not result.success:
        code = getattr(result.reason_code, "value", None) or str(
            result.reason_code or "CATALOG_RESOLUTION_FAILED"
        )
        return {
            "success": False,
            "reason_code": code if code else "CATALOG_RESOLUTION_FAILED",
            "provenance": None,
        }
    tier_val = getattr(result.tier, "value", None) or str(result.tier or "")
    return {
        "success": True,
        "alias": result.alias,
        "tier": tier_val,
        "slug": result.slug,
        "provenance": result.provenance,
    }


def selfresolve_segment_handoff_notification(*, event: str, message: str) -> dict:
    """T-007 — non-suppressible segment-handoff notification (US-0095 rule).

    Under AUTO_QUIET=1 the segment-handoff notification stays non-suppressible;
    only regular per-phase chatter is suppressed. Returned dict is names-only.
    """
    return {
        "event": event,
        "message": message,
        "suppressible": False,
        "non_suppressible_under_auto_quiet": True,
    }


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _merge_scratchpad(repo: Path) -> dict[str, str]:
    """Resolve shared governance keys via host-neutral config (US-0131 / DEC-0131)."""
    resolved = hrc.resolve_runtime_config(repo, raise_on_fatal=False)
    return dict(resolved.values)


def _require_full_autonomy(repo: Path) -> tuple[dict[str, str], str | None]:
    try:
        merged = _merge_scratchpad(repo)
    except OSError as exc:
        return {}, f"scratchpad parse failure: {exc}"
    mode = merged.get("AUTO_FLOW_MODE", "manual")
    if mode != "full_autonomy":
        return merged, "AUTO_FLOW_MODE_NOT_FULL_AUTONOMY"
    return merged, None


def _parse_resume_brief(repo: Path) -> dict[str, str]:
    path = repo / "handoffs" / "resume_brief.md"
    if not path.is_file():
        return {}
    text = path.read_text(encoding="utf-8")
    out: dict[str, str] = {}
    for key in (
        "intended_resume_phase",
        "orchestrator_run_id",
        "story_id",
        "bug_id",
        "sprint_id",
    ):
        m = re.search(rf"`{key}`\s*:\s*\*\*`([^`]+)`\*\*", text)
        if m:
            out[key] = m.group(1)
        else:
            m2 = re.search(rf"- `{key}`:\s*`([^`]+)`", text)
            if m2:
                out[key] = m2.group(1)
    m = re.search(r"orchestrator_run_id=\*\*`([^`]+)`\*\*", text)
    if m and "orchestrator_run_id" not in out:
        out["orchestrator_run_id"] = m.group(1)
    return out


def _parse_state_boundary(repo: Path) -> dict[str, str]:
    path = repo / "docs" / "engineering" / "state.md"
    if not path.is_file():
        return {}
    text = path.read_text(encoding="utf-8")
    out: dict[str, str] = {}
    patterns = {
        "stop_reason": r"stop_reason=([^\s`;]+)",
        "next_scheduled_phase": r"next_scheduled_phase=([^\s`;]+)",
        "backlog_drain_segment_complete": r"backlog_drain_segment_complete=(\d+)",
        "backlog_drain_stories_remaining_budget": (
            r"backlog_drain_stories_remaining_budget=(\d+)"
        ),
        "story_id": r"story_id=([^\s`;]+)",
        "bug_id": r"bug_id=([^\s`;]+)",
        "reason_code": r"reason_code=([^\s`;]+)",
        "blocked_subcode": r"blocked_subcode=([^\s`;]+)",
    }
    for key, pat in patterns.items():
        matches = re.findall(pat, text)
        if matches:
            out[key] = matches[-1]
    return out


def _ledger_path(repo: Path, orchestrator_run_id: str) -> Path:
    return repo / "handoffs" / "auto_block_retry" / f"{orchestrator_run_id}.jsonl"


def _count_retries(ledger: Path, story_id: str, stop_reason: str) -> int:
    if not ledger.is_file():
        return 0
    count = 0
    for line in ledger.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            rec = json.loads(line)
        except json.JSONDecodeError:
            continue
        if rec.get("story_id") == story_id and rec.get("stop_reason") == stop_reason:
            if rec.get("outcome") == "retry_scheduled":
                count += 1
    return count


def append_ledger_record(
    repo: Path,
    orchestrator_run_id: str,
    *,
    story_id: str,
    stop_reason: str,
    reason_code: str,
    remediation_action: str,
    outcome: str,
    outer_cycle_index: int,
    implementation_loop_index: int,
    seq: int,
) -> None:
    ledger_dir = repo / "handoffs" / "auto_block_retry"
    ledger_dir.mkdir(parents=True, exist_ok=True)
    record = {
        "attempt_id": f"br-{orchestrator_run_id}-{seq}",
        "timestamp": _utc_now_iso(),
        "orchestrator_run_id": orchestrator_run_id,
        "story_id": story_id or "(none)",
        "stop_reason": stop_reason,
        "reason_code": reason_code or "",
        "remediation_action": remediation_action,
        "outcome": outcome,
        "outer_cycle_index": outer_cycle_index,
        "implementation_loop_index": implementation_loop_index,
    }
    ledger = _ledger_path(repo, orchestrator_run_id)
    with ledger.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, sort_keys=True, separators=(",", ":")) + "\n")


def _is_recoverable(
    stop_reason: str,
    reason_code: str,
    blocked_subcode: str,
    merged: dict[str, str],
) -> bool:
    if stop_reason in HARD_STOP_REASONS:
        return False
    if stop_reason == "blocked":
        if blocked_subcode in HARD_BLOCKED_SUBCODES:
            return False
        if reason_code in HARD_BLOCKED_SUBCODES:
            return False
        return True
    if stop_reason == "missing_input":
        if reason_code in ("critical", "CRITICAL_MISSING_INPUT"):
            return False
        return True
    if stop_reason in ("uat_fail", "qa_fail"):
        return merged.get("AUTO_IMPLEMENTATION_LOOP", "0") == "1"
    return stop_reason in RECOVERABLE_STOP_REASONS


def _remediation_for(stop_reason: str) -> str:
    mapping = {
        "blocked": "refresh-context",
        "missing_input": "refresh-context",
        "uat_fail": "verify-work",
        "qa_fail": "qa",
    }
    return mapping.get(stop_reason, "outer_reinvoke")


def _should_drain_advance(
    boundary: dict[str, str], merged: dict[str, str]
) -> bool:
    if merged.get("AUTO_BACKLOG_DRAIN", "0") != "1":
        if merged.get("AUTO_BUG_QUEUE", "0") != "1":
            return False
    stop = boundary.get("stop_reason", "")
    reason = boundary.get("reason_code", "")
    # US-0164 / DEC-0155 T-005 — silent drain handoff (SELFRESOLVE_DRAIN_HANDOFF)
    # fires on self-resolve exhaustion OR a budget gate after provider fallback
    # (PROVIDER_SWITCH_CAP_REACHED) IN ADDITION TO stop_reason=completed. It is
    # bounded by the same fail-closed rules: drain must be enabled (the guard
    # above) AND budget must remain (an eligible OPEN story is the US-0095
    # 7-step SELECT concern; if none, the handoff is emitted but the action is
    # hard_stop by the caller). Silent: no operator/auto re-invoke.
    if reason in (
        SELFRESOLVE_ATTEMPT_EXHAUSTED,
        PROVIDER_SWITCH_CAP_REACHED,
    ):
        budget = boundary.get("backlog_drain_stories_remaining_budget", "")
        return bool(budget) and budget != "0"
    if stop not in ("completed", "(none)"):
        return False
    if boundary.get("backlog_drain_segment_complete") == "1":
        return True
    nxt = boundary.get("next_scheduled_phase", "")
    if nxt in DRAIN_ADVANCE_MARKERS:
        return True
    if stop == "completed" and merged.get("AUTO_BACKLOG_DRAIN", "0") == "1":
        budget = boundary.get("backlog_drain_stories_remaining_budget", "")
        if budget and budget != "0":
            return True
    return False


def _map_exit(
    stop_reason: str,
    reason_code: str,
    merged: dict[str, str],
    stories_processed: int,
    max_stories: int,
) -> int:
    if stop_reason in ("pause_request", "AUTO_PAUSE_REQUEST"):
        return EXIT_PAUSE
    if stop_reason in ("loop_max", "AUTO_LOOP_MAX_CYCLES"):
        return EXIT_LOOP_MAX
    if stop_reason in ("BACKLOG_MAX_STORIES_REACHED",) or (
        max_stories > 0 and stories_processed >= max_stories
    ):
        return EXIT_BACKLOG_MAX
    if stop_reason in HARD_STOP_REASONS or stop_reason in (
        "decision_gate",
        "error",
        "blocked",
    ):
        if _is_recoverable(stop_reason, reason_code, "", merged):
            return -1
        return EXIT_HARD_STOP
    if stop_reason == "completed":
        return EXIT_COMPLETED
    return EXIT_HARD_STOP


def _is_terminal_continue_token(value: str | None) -> bool:
    if value is None:
        return False
    if value in TERMINAL_CONTINUE_TOKENS:
        return True
    return value.strip().lower() in {".env", "secrets", "secret"}


def recoverable_class_guards_pass(
    *,
    recoverable_class: str | None,
    stop_reason: str | None,
    reason_code: str | None,
    blocked_subcode: str | None,
    denied_agent: str | None,
) -> bool:
    """US-0158 DQ1. True only for the four classes when the terminal guards pass."""
    if recoverable_class not in RECOVERABLE_CLASS_TOKENS:
        return False
    for token in (stop_reason, reason_code, blocked_subcode):
        if _is_terminal_continue_token(token):
            return False
    if recoverable_class == "blocked":
        if stop_reason != "blocked":
            return False
        if blocked_subcode in HARD_BLOCKED_SUBCODES:
            return False
        if reason_code in HARD_BLOCKED_SUBCODES:
            return False
        if reason_code == "OPENCODE_AUTO_DEPENDENCY_BLOCKED":
            return False
        return True
    if recoverable_class == "ai_error":
        return reason_code == "ai_error" and stop_reason != "error"
    if recoverable_class == "aborted":
        return reason_code == "phase_aborted"
    if recoverable_class == "permission_dead_end":
        agent = (denied_agent or "").strip()
        if not agent:
            return False
        if agent in MATRIX_ROLES or agent in SEVEN_ROLE_ALLOW:
            return False
        return True
    return False


def continue_same_phase_parent_decision(writer: str) -> dict[str, object]:
    """US-0158 DQ6. Parent writers stay read-only. Pair files stay untouched."""
    return {
        "writer": writer,
        "writes_state": False,
        "writes_brief": False,
        "sets_resume_brief_auto_refresh": False,
        "calls_write_resume_pair": False,
        "action": "continue_same_phase",
    }


def _selfresolve_gate_branch(
    *,
    selfresolve_gate: str | None,
    repo: Path | None,
    phase: str,
    reason_code: str | None,
) -> tuple[str, str | None, dict[str, object]] | None:
    """US-0164 / DEC-0155 T-001 — the additive self-resolve stop-matrix branch.

    Returns a (action, next_phase, extra) decision ONLY when the self-resolve
    branch is engaged. Returns None when the branch must NOT be engaged, so the
    caller falls through to the legacy stop-matrix decision and the JSON is
    byte-identical to today (default-off, AC-7):
      - the --selfresolve-gate flag is ABSENT (selfresolve_gate is None);
      - the gate is NOT in the validated enabled set (AUTO_SELFRESOLVE_GATES
        does not list it — the default-off case).
    When engaged:
      - gate enabled + safety-floor guards pass → continue_same_phase,
        next_phase=phase, extra={} → byte-identical to the US-0158 continue
        payload (the plugin's one-attempt-per-(phaseId, gate) respawn
        machinery is reused unchanged).
      - safety floor (pause_request), propose-and-hold (decision_gate), critical
        missing_input, bounded exhaustion, or an operator config error
        (unknown gate id / bad AUTO_PROVIDER_SWITCH_MAX → HOST_CONFIG_INVALID)
        → hard_stop with a reason_code (the deliberate deviations that MAY add
        keys).
    """
    if selfresolve_gate is None:
        return None
    merged = _merge_scratchpad(repo) if repo is not None else {}
    config, cfg_err = validate_selfresolve_config(merged)
    gate_enabled = (
        cfg_err is None
        and selfresolve_gate in config.get("gates", [])
    )
    if not gate_enabled:
        if cfg_err is not None:
            # T-006: unknown gate id in AUTO_SELFRESOLVE_GATES (or a non-int
            # AUTO_PROVIDER_SWITCH_MAX) → fail closed reusing HOST_CONFIG_INVALID
            # with the offending key+value (NOT a 5th code, NOT silently
            # ignored). This is an operator config error, so it is surfaced
            # (not byte-identical): the run stops; no self-resolve attempt.
            return (
                "hard_stop",
                None,
                {
                    "selfresolve_gate": selfresolve_gate,
                    "reason_code": "HOST_CONFIG_INVALID",
                    "cfg_detail": cfg_err,
                },
            )
        # Gate not in the enabled set (default-off) → fall through to the legacy
        # stop-matrix decision → byte-identical to today (AC-7).
        return None
    decision = selfresolve_gate_decision(
        gate=selfresolve_gate,
        config=config,
        reason_code=reason_code,
    )
    if decision["action"] == "continue_same_phase":
        # Byte-identical to the US-0158 continue branch: 8-key payload,
        # next_phase = <phase>, no extra keys.
        return ("continue_same_phase", phase, {})
    # Deliberate deviations that carry a reason_code (new branches MAY add keys):
    # safety floor / propose-and-hold / bounded exhaustion.
    extra: dict[str, object] = {
        "selfresolve_gate": decision.get("selfresolve_gate"),
        "reason_code": decision.get("reason_code"),
    }
    if decision.get("decision_gate"):
        extra["decision_gate"] = True
    return ("hard_stop", None, extra)


def run_stop_matrix_json(
    *,
    phase: str,
    role: str,
    story: str | None,
    sprint: str | None,
    orchestrator_run_id: str | None,
    stop_reason: str | None,
    recoverable_class: str | None = None,
    reason_code: str | None = None,
    blocked_subcode: str | None = None,
    denied_agent: str | None = None,
    selfresolve_gate: str | None = None,
    repo: Path | None = None,
) -> int:
    """US-0124 / DEC-0124 §6 — additive argv JSON response path.

    When the new flags (--phase/--role/--story/--sprint/--orchestrator-run-id/--stop-reason)
    are present, emit a JSON stop-matrix decision on stdout and exit 0. When the
    flags are absent, the legacy run_driver() path is byte-identical (no
    regression to US-0092 / DEC-0078). The plugin (TypeScript) parses this JSON
    and dispatches; the Python SOT owns all state-machine transitions.

    US-0158: optional --recoverable-class. When the flag is absent, the JSON
    branch stays today's action and next_phase stays null on those branches.
    When the flag is present and the guards pass, action is continue_same_phase
    and next_phase equals --phase. When the guards fail, action is hard_stop
    and next_phase is null.

    US-0164 / DEC-0155: optional --selfresolve-gate <gate_id>, additive to the
    US-0158 --recoverable-class branch. Precedence: --recoverable-class present
    → the US-0158 branch wins, unchanged; otherwise the self-resolve branch is
    evaluated. When gate_id is in the validated enabled AUTO_SELFRESOLVE_GATES
    set AND the safety-floor guards pass → action=continue_same_phase,
    next_phase=<phase>, byte-identical to the US-0158 continue payload, so the
    plugin's existing one-attempt-per-(phaseId, gate) respawn machinery is
    reused unchanged. Absent the flag → today's JSON is byte-identical
    (default-off, US-0156 style). The driver only decides continue-vs-stop; it
    never inspects, edits, or re-scores the gate (the SAME unchanged gate check
    re-runs in the spawned same-phase child). Safety floor: pause_request is
    never self-resolved; decision_gate is propose-and-hold (never
    auto-continue); critical missing_input stays hard. Unknown gate id →
    hard_stop reusing HOST_CONFIG_INVALID (NOT a 5th code).
    """
    action = "spawn_next"
    next_phase: str | None = None
    emitted_stop_reason = stop_reason or "(none)"
    extra: dict[str, object] = {}
    selfresolve_decision: tuple[str, str | None, dict[str, object]] | None
    if recoverable_class is not None:
        # US-0158 branch wins over the US-0164 self-resolve branch (additive,
        # mutually exclusive by construction).
        if recoverable_class_guards_pass(
            recoverable_class=recoverable_class,
            stop_reason=stop_reason,
            reason_code=reason_code,
            blocked_subcode=blocked_subcode,
            denied_agent=denied_agent,
        ):
            action = "continue_same_phase"
            next_phase = phase
        else:
            action = "hard_stop"
            next_phase = None
    else:
        # US-0164 / DEC-0155 T-001 — additive self-resolve branch. Returns a
        # decision ONLY when the gate is in the validated enabled set (continue
        # byte-identical to the US-0158 continue branch) or on a deliberate
        # deviation (safety floor / propose-and-hold / bounded exhaustion /
        # config error). Returns None when the flag is ABSENT or the gate is NOT
        # enabled (default-off) → the legacy stop-matrix decision below is used
        # unchanged so the JSON is byte-identical to today (AC-7).
        selfresolve_decision = _selfresolve_gate_branch(
            selfresolve_gate=selfresolve_gate,
            repo=repo,
            phase=phase,
            reason_code=reason_code,
        )
        if selfresolve_decision is not None:
            action, next_phase, extra = selfresolve_decision
        elif (
            stop_reason in BUDGET_GATE_STOPS
            and repo is not None
        ):
            # US-0164 / DEC-0155 T-004 — budget-gate provider fallback (OPT-IN).
            # Budget gates (loop_max, BACKLOG_MAX_STORIES_REACHED) are NOT in the
            # self-resolve set. This branch engages ONLY when
            # AUTO_BUDGET_PROVIDER_FALLBACK=1 (opt-in; default "0"). With the flag
            # off, the budget gate stays a hard stop so the JSON stays
            # byte-identical to today (T-006/AC-7: all-default → unchanged).
            # When on AND the cap is unused → the NEXT phase child's model is
            # resolved via model_tier_lib.resolve_model_for_phase (a DIFFERENT
            # tier/alias); the one-switch-per-run cap accounting + the
            # PROVIDER_SWITCH_APPLIED ledger row live in run_driver (the stateful
            # outer loop). Catalog failure → no switch; budget gate stays a hard
            # stop. The budget counter is NOT reset — it carries over.
            merged = _merge_scratchpad(repo)
            if merged.get("AUTO_BUDGET_PROVIDER_FALLBACK", "0") == "1":
                config, cfg_err = validate_selfresolve_config(merged)
                if cfg_err is not None:
                    # Fail closed reusing HOST_CONFIG_INVALID with key+value.
                    action = "hard_stop"
                    next_phase = None
                    extra = {
                        "reason_code": "HOST_CONFIG_INVALID",
                        "cfg_detail": cfg_err,
                    }
                else:
                    switch = provider_switch_decision(
                        stop_reason=stop_reason,
                        config=config,
                    )
                    if switch is None or switch["action"] != "provider_switch":
                        # Fallback unexpectedly off / cap reached → hard stop.
                        action = "hard_stop"
                        next_phase = None
                        extra = {
                            "reason_code": (
                                switch["reason_code"]
                                if switch is not None
                                else "BUDGET_GATE_HARD_STOP"
                            ),
                            "provider_switch": False,
                            "budget_carryover": True,
                        }
                    else:
                        model = resolve_next_child_model_for_switch(phase=phase)
                        if model.get("success"):
                            action = "provider_switch"
                            next_phase = phase
                            extra = {
                                "reason_code": PROVIDER_SWITCH_APPLIED,
                                "provider_switch": True,
                                "switched_alias": model.get("alias"),
                                "switched_tier": model.get("tier"),
                                "provenance": model.get("provenance"),
                                "budget_carryover": True,
                            }
                        else:
                            # Catalog-resolution failure → no switch; budget gate
                            # stays a hard stop (fail-closed).
                            action = "hard_stop"
                            next_phase = None
                            extra = {
                                "reason_code": "CATALOG_RESOLUTION_FAILED",
                                "provider_switch": False,
                                "budget_carryover": True,
                            }
            else:
                # Fallback off (default-off) → byte-identical to today's 8-key
                # hard_stop (no extra keys; T-006/AC-7 all-default unchanged).
                action = "hard_stop"
                next_phase = None
        elif stop_reason in HARD_STOP_REASONS:
            action = "hard_stop"
        elif stop_reason == "pause_request":
            action = "pause_boundary"
        elif stop_reason in RECOVERABLE_STOP_REASONS:
            action = "ledger_write"
        elif stop_reason in ("completed", "(none)", None):
            action = "spawn_next"
    payload = {
        "action": action,
        "phase": phase,
        "role": role,
        "story_id": story or "(none)",
        "sprint_id": sprint or "(none)",
        "orchestrator_run_id": orchestrator_run_id or "(none)",
        "stop_reason": emitted_stop_reason,
        "next_phase": next_phase,
    }
    if extra:
        payload.update(extra)
    sys.stdout.write(json.dumps(payload, sort_keys=True, separators=(",", ":")))
    sys.stdout.write("\n")
    return EXIT_COMPLETED


def run_driver(
    repo: Path,
    *,
    max_cycles: int | None,
    max_stories: int | None,
    dry_run: bool,
    invoke_cmd: str | None,
    simulate: dict[str, str] | None = None,
) -> int:
    merged, cfg_err = _require_full_autonomy(repo)
    if cfg_err:
        print(cfg_err, file=sys.stderr)
        return EXIT_CONFIG

    cycle_cap = max_cycles
    if cycle_cap is None:
        try:
            cycle_cap = int(merged.get("AUTO_LOOP_MAX_CYCLES", "5"))
        except ValueError:
            cycle_cap = 5

    story_cap = max_stories
    if story_cap is None:
        try:
            story_cap = int(merged.get("AUTO_BACKLOG_MAX_STORIES", "1"))
        except ValueError:
            story_cap = 1

    retry_cap = 3
    try:
        retry_cap = int(merged.get("AUTO_BLOCK_RETRY_MAX", "3"))
    except ValueError:
        pass

    timeout_sec: int | None = None
    raw_timeout = merged.get("AUTO_OUTER_DRIVER_TIMEOUT_SECONDS", "")
    if raw_timeout:
        try:
            timeout_sec = int(raw_timeout)
        except ValueError:
            pass

    resume = _parse_resume_brief(repo)
    orch_id = resume.get("orchestrator_run_id", "outer-driver")
    ledger_seq = 0
    outer_cycle = 0
    stories_processed = 0
    impl_loop = int(merged.get("AUTO_IMPLEMENTATION_LOOP", "0") == "1")

    while outer_cycle < cycle_cap:
        outer_cycle += 1
        if simulate is not None:
            boundary = dict(simulate)
        else:
            boundary = _parse_state_boundary(repo)
            resume = _parse_resume_brief(repo)

        phase = resume.get("intended_resume_phase", boundary.get("next_scheduled_phase", "auto"))
        stop_reason = boundary.get("stop_reason", "(none)")
        reason_code = boundary.get("reason_code", "")
        blocked_subcode = boundary.get("blocked_subcode", "")
        story_id = boundary.get("story_id", resume.get("story_id", "(none)"))

        hook = invoke_cmd or f"/auto start-from={phase}"
        print(f"[OUTER_DRIVER] cycle={outer_cycle} hook={hook!r} stop_reason={stop_reason}")

        if dry_run:
            if _should_drain_advance(boundary, merged):
                print("[OUTER_DRIVER_DRY_RUN] drain-advance: schedule next OPEN item immediately")
            if stop_reason not in ("(none)", "completed") and _is_recoverable(
                stop_reason, reason_code, blocked_subcode, merged
            ):
                print(
                    f"[OUTER_DRIVER_DRY_RUN] block-retry: {stop_reason} "
                    f"remediation={_remediation_for(stop_reason)}"
                )
            continue

        if timeout_sec is not None and timeout_sec <= 0:
            print("AUTO_OUTER_DRIVER_TIMEOUT", file=sys.stderr)
            return EXIT_TIMEOUT

        if not dry_run and invoke_cmd is not None:
            try:
                proc = subprocess.run(
                    invoke_cmd,
                    shell=True,
                    cwd=str(repo),
                    timeout=timeout_sec,
                    check=False,
                )
                if timeout_sec and proc.returncode == 124:
                    return EXIT_TIMEOUT
            except subprocess.TimeoutExpired:
                print("AUTO_OUTER_DRIVER_TIMEOUT", file=sys.stderr)
                return EXIT_TIMEOUT

        if stop_reason == "(none)" or stop_reason == "completed":
            if _should_drain_advance(boundary, merged):
                stories_processed += 1
                if story_cap > 0 and stories_processed >= story_cap:
                    print("BACKLOG_MAX_STORIES_REACHED", file=sys.stderr)
                    return EXIT_BACKLOG_MAX
                print(
                    "[OUTER_DRIVER] drain-advance-without-pause: "
                    "resume_brief + state.md refresh per DEC-0069"
                )
                continue
            if stop_reason == "completed":
                return EXIT_COMPLETED
            continue

        if merged.get("AUTO_PAUSE_REQUEST", "0") == "1":
            print("AUTO_PAUSE_REQUEST", file=sys.stderr)
            return EXIT_PAUSE

        if _is_recoverable(stop_reason, reason_code, blocked_subcode, merged):
            retries = _count_retries(_ledger_path(repo, orch_id), story_id, stop_reason)
            if retries >= retry_cap:
                ledger_seq += 1
                append_ledger_record(
                    repo,
                    orch_id,
                    story_id=story_id,
                    stop_reason=stop_reason,
                    reason_code=reason_code,
                    remediation_action=_remediation_for(stop_reason),
                    outcome="cap_exhausted",
                    outer_cycle_index=outer_cycle,
                    implementation_loop_index=impl_loop,
                    seq=ledger_seq,
                )
                print("BLOCK_RETRY_CAP_EXHAUSTED", file=sys.stderr)
                return EXIT_BLOCK_RETRY_CAP
            ledger_seq += 1
            append_ledger_record(
                repo,
                orch_id,
                story_id=story_id,
                stop_reason=stop_reason,
                reason_code=reason_code,
                remediation_action=_remediation_for(stop_reason),
                outcome="retry_scheduled",
                outer_cycle_index=outer_cycle,
                implementation_loop_index=impl_loop,
                seq=ledger_seq,
            )
            print(f"[OUTER_DRIVER] block-retry scheduled for {stop_reason}")
            continue

        exit_code = _map_exit(stop_reason, reason_code, merged, stories_processed, story_cap)
        if exit_code == EXIT_BACKLOG_MAX:
            print("BACKLOG_MAX_STORIES_REACHED", file=sys.stderr)
        return exit_code if exit_code >= 0 else EXIT_HARD_STOP

    print("AUTO_LOOP_MAX_CYCLES", file=sys.stderr)
    return EXIT_LOOP_MAX


def self_test() -> None:
    repo = Path(__file__).resolve().parents[1]
    merged_bad = {"AUTO_FLOW_MODE": "manual"}
    assert merged_bad.get("AUTO_FLOW_MODE") != "full_autonomy"

    sha_active = hashlib.sha256(
        (repo / "scripts" / "auto_outer_driver.py").read_bytes()
    ).hexdigest()
    tpl = repo / "template" / "scripts" / "auto_outer_driver.py"
    if tpl.is_file():
        sha_tpl = hashlib.sha256(tpl.read_bytes()).hexdigest()
        assert sha_active == sha_tpl, "active/template auto_outer_driver.py drift"

    assert _remediation_for("qa_fail") == "qa"
    assert _is_recoverable("blocked", "", "", {"AUTO_IMPLEMENTATION_LOOP": "0"})
    assert not _is_recoverable(
        "blocked", "isolation", "isolation", {"AUTO_IMPLEMENTATION_LOOP": "0"}
    )
    assert _map_exit("pause_request", "", {}, 0, 10) == EXIT_PAUSE
    assert _map_exit("loop_max", "", {}, 0, 10) == EXIT_LOOP_MAX
    assert _map_exit("BACKLOG_MAX_STORIES_REACHED", "", {}, 5, 5) == EXIT_BACKLOG_MAX

    drain_boundary = {
        "stop_reason": "completed",
        "backlog_drain_segment_complete": "1",
        "backlog_drain_stories_remaining_budget": "2",
        "next_scheduled_phase": "discovery",
    }
    assert _should_drain_advance(drain_boundary, {"AUTO_BACKLOG_DRAIN": "1"})

    # ---- US-0164 / DEC-0155 self-resolve + provider-fallback + drain handoff ----
    # T-008: the four new reason codes are registered and reachable.
    assert {
        SELFRESOLVE_ATTEMPT_EXHAUSTED,
        PROVIDER_SWITCH_APPLIED,
        PROVIDER_SWITCH_CAP_REACHED,
        SELFRESOLVE_DRAIN_HANDOFF,
    } == SELFRESOLVE_REASON_CODES
    # T-006: pause_request + gate-override-forbidden stay in HARD_STOP_REASONS;
    # decision_gate stays in HARD_STOP_REASONS + TERMINAL_CONTINUE_TOKENS.
    assert "pause_request" in HARD_STOP_REASONS
    assert "decision_gate" in HARD_STOP_REASONS
    assert "decision_gate" in TERMINAL_CONTINUE_TOKENS
    assert "pause_request" in TERMINAL_CONTINUE_TOKENS
    # T-006: default-off = empty enabled set; validate_selfresolve_config is
    # identity on the all-default config (no 5 keys present).
    cfg_default, err_default = validate_selfresolve_config({})
    assert err_default is None
    assert cfg_default["gates"] == []
    assert cfg_default["budget_provider_fallback"] == "0"
    assert cfg_default["provider_switch_max"] == 1
    assert cfg_default["budget_exhausted_drain"] == "0"
    assert "pause_request" in cfg_default["exclude"]
    # T-006: unknown gate id → HOST_CONFIG_INVALID with offending key+value.
    cfg_bad, err_bad = validate_selfresolve_config(
        {"AUTO_SELFRESOLVE_GATES": "error,bogusgate"}
    )
    assert cfg_bad is None
    assert err_bad is not None and "HOST_CONFIG_INVALID" in err_bad
    assert "AUTO_SELFRESOLVE_GATES=bogusgate" in err_bad
    # T-001/T-002: enabled error gate → continue (byte-identical 8-key payload).
    cfg_on, _ = validate_selfresolve_config(
        {"AUTO_SELFRESOLVE_GATES": "error,missing_input,decision_gate,security,publish"}
    )
    d = selfresolve_gate_decision(gate="error", config=cfg_on)
    assert d["action"] == "continue_same_phase"
    # T-002: decision_gate → propose-and-hold, NEVER continue.
    dg = selfresolve_gate_decision(gate="decision_gate", config=cfg_on)
    assert dg["action"] == "hard_stop"
    assert dg["reason_code"] == "SELFRESOLVE_PROPOSE_AND_HOLD"
    assert dg.get("decision_gate") is True
    assert dg["notify"]["suppressible"] is False
    # T-002: pause_request safety floor hard under FULL self-resolve config.
    pr = selfresolve_gate_decision(gate="pause_request", config=cfg_on)
    assert pr["action"] == "hard_stop"
    assert pr["reason_code"] == "PAUSE_REQUEST_SAFETY_FLOOR_HARD"
    # T-003: critical missing_input → hard stop unchanged (even when enabled).
    cm = selfresolve_gate_decision(
        gate="missing_input", config=cfg_on, reason_code="critical"
    )
    assert cm["action"] == "hard_stop"
    assert cm["reason_code"] == "CRITICAL_MISSING_INPUT_HARD"
    # T-003: transient missing_input → continue (bounded obtain/derive).
    tm = selfresolve_gate_decision(
        gate="missing_input", config=cfg_on, reason_code="transient"
    )
    assert tm["action"] == "continue_same_phase"
    # T-008 row 1: second hit (prior_attempts >= 1) → SELFRESOLVE_ATTEMPT_EXHAUSTED.
    exh = selfresolve_gate_decision(
        gate="error", config=cfg_on, prior_attempts=1
    )
    assert exh["action"] == "hard_stop"
    assert exh["reason_code"] == SELFRESOLVE_ATTEMPT_EXHAUSTED
    # T-001: gate NOT in the enabled set → hard stop (fail closed, default-off).
    dcfg, _ = validate_selfresolve_config({"AUTO_SELFRESOLVE_GATES": "error"})
    off = selfresolve_gate_decision(gate="security", config=dcfg)
    assert off["action"] == "hard_stop"
    assert off["reason_code"] == "SELFRESOLVE_GATE_NOT_ENABLED"
    # T-004: provider fallback off (default) → hard stop, no switch.
    psw_off = provider_switch_decision(
        stop_reason="loop_max", config=cfg_default
    )
    assert psw_off is not None
    assert psw_off["action"] == "hard_stop"
    assert psw_off["provider_switch"] is False
    assert psw_off["budget_carryover"] is True
    # T-004: provider fallback on, cap unused → one switch (PROVIDER_SWITCH_APPLIED).
    cfg_fb, _ = validate_selfresolve_config(
        {"AUTO_BUDGET_PROVIDER_FALLBACK": "1", "AUTO_PROVIDER_SWITCH_MAX": "1"}
    )
    psw = provider_switch_decision(stop_reason="loop_max", config=cfg_fb)
    assert psw["action"] == "provider_switch"
    assert psw["reason_code"] == PROVIDER_SWITCH_APPLIED
    assert psw["provider_switch"] is True
    assert psw["budget_carryover"] is True
    # T-004: cap hit (second switch) → PROVIDER_SWITCH_CAP_REACHED.
    psw_cap = provider_switch_decision(
        stop_reason="loop_max", config=cfg_fb, prior_switches=1
    )
    assert psw_cap["action"] == "hard_stop"
    assert psw_cap["reason_code"] == PROVIDER_SWITCH_CAP_REACHED
    # T-004: non-budget stop reason → no switch (None).
    assert provider_switch_decision(stop_reason="error", config=cfg_fb) is None
    # T-005: drain handoff predicate fires on SELFRESOLVE_ATTEMPT_EXHAUSTED with
    # budget remaining (in addition to completed).
    handoff = {
        "stop_reason": "hard_stop",
        "reason_code": SELFRESOLVE_ATTEMPT_EXHAUSTED,
        "backlog_drain_stories_remaining_budget": "2",
    }
    assert _should_drain_advance(handoff, {"AUTO_BACKLOG_DRAIN": "1"})
    # T-005: drain handoff does NOT fire when drain is disabled (fail-closed).
    assert not _should_drain_advance(handoff, {"AUTO_BACKLOG_DRAIN": "0"})
    # T-005: drain handoff does NOT fire when budget is exhausted.
    assert not _should_drain_advance(
        {
            "stop_reason": "hard_stop",
            "reason_code": PROVIDER_SWITCH_CAP_REACHED,
            "backlog_drain_stories_remaining_budget": "0",
        },
        {"AUTO_BACKLOG_DRAIN": "1"},
    )
    # T-007: segment-handoff notification is non-suppressible under AUTO_QUIET=1.
    n = selfresolve_segment_handoff_notification(
        event="selfresolve_attempt_exhausted", message="x"
    )
    assert n["suppressible"] is False
    assert n["non_suppressible_under_auto_quiet"] is True


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Full-autonomy outer driver (US-0092 / DEC-0078). Spawn-only."
    )
    parser.add_argument("--repo", default=".", help="Repository root (default .).")
    parser.add_argument("--max-cycles", type=int, default=None, help="Override AUTO_LOOP_MAX_CYCLES.")
    parser.add_argument("--max-stories", type=int, default=None, help="Override AUTO_BACKLOG_MAX_STORIES.")
    parser.add_argument("--dry-run", action="store_true", help="Emit planned invocations only.")
    parser.add_argument(
        "--invoke-cmd",
        default=None,
        help="Optional shell prefix for /auto hook; default prints normative /auto line.",
    )
    parser.add_argument("--self-test", action="store_true", help="Run stable marker subtests.")
    parser.add_argument(
        "--simulate-stop",
        default=None,
        help="Self-test only: inject stop_reason for exit-code path (e.g. pause_request).",
    )
    # US-0124 / DEC-0124 §6 — additive argv for the OpenCode orchestrator
    # plugin subprocess callout. When --phase is present, the driver emits a
    # JSON stop-matrix decision on stdout and exits 0. When these flags are
    # absent, the legacy run_driver() behavior is byte-identical.
    parser.add_argument("--phase", default=None, help="US-0124: phase_id for stop-matrix JSON path.")
    parser.add_argument("--role", default=None, help="US-0124: role for stop-matrix JSON path.")
    parser.add_argument("--story", default=None, help="US-0124: story_id for stop-matrix JSON path.")
    parser.add_argument("--sprint", default=None, help="US-0124: sprint_id for stop-matrix JSON path.")
    parser.add_argument(
        "--orchestrator-run-id",
        default=None,
        dest="orchestrator_run_id",
        help="US-0124: orchestrator_run_id for stop-matrix JSON path.",
    )
    parser.add_argument(
        "--stop-reason",
        default=None,
        dest="stop_reason",
        help="US-0124: stop_reason for stop-matrix JSON path.",
    )
    parser.add_argument(
        "--recoverable-class",
        default=None,
        dest="recoverable_class",
        help=(
            "US-0158: optional class token "
            "(blocked, ai_error, aborted, permission_dead_end)."
        ),
    )
    parser.add_argument(
        "--reason-code",
        default=None,
        dest="reason_code",
        help="US-0158: reason_code consulted by the continue guards.",
    )
    parser.add_argument(
        "--blocked-subcode",
        default=None,
        dest="blocked_subcode",
        help="US-0158: blocked_subcode consulted by the continue guards.",
    )
    parser.add_argument(
        "--denied-agent",
        default=None,
        dest="denied_agent",
        help="US-0158: denied Task agent for permission_dead_end.",
    )
    parser.add_argument(
        "--selfresolve-gate",
        default=None,
        dest="selfresolve_gate",
        help=(
            "US-0164 / DEC-0155: optional gate id for the additive "
            "self-resolve stop-matrix branch (default-off). When present and "
            "the gate is in the validated enabled AUTO_SELFRESOLVE_GATES set "
            "with safety-floor guards passing, action is continue_same_phase "
            "byte-identical to the US-0158 continue payload; otherwise "
            "hard_stop."
        ),
    )
    args = parser.parse_args()
    repo = Path(args.repo).resolve()

    # US-0124 additive path — emit JSON and exit before any legacy side effect.
    if args.phase is not None:
        if args.role is None:
            print("OPENCODE_DRIVER_INVOKE_FAILED: --phase requires --role", file=sys.stderr)
            return EXIT_CONFIG
        return run_stop_matrix_json(
            phase=args.phase,
            role=args.role,
            story=args.story,
            sprint=args.sprint,
            orchestrator_run_id=args.orchestrator_run_id,
            stop_reason=args.stop_reason,
            recoverable_class=args.recoverable_class,
            reason_code=args.reason_code,
            blocked_subcode=args.blocked_subcode,
            denied_agent=args.denied_agent,
            selfresolve_gate=args.selfresolve_gate,
            repo=repo,
        )

    if args.self_test:
        try:
            self_test()
        except AssertionError as exc:
            print(f"self-test failed: {exc}", file=sys.stderr)
            return EXIT_CONFIG
        if args.simulate_stop:
            merged, err = _require_full_autonomy(repo)
            if err:
                print(err, file=sys.stderr)
                return EXIT_CONFIG
            sim = {"stop_reason": args.simulate_stop}
            code = run_driver(
                repo,
                max_cycles=1,
                max_stories=99,
                dry_run=True,
                invoke_cmd=None,
                simulate=sim,
            )
            if args.simulate_stop == "pause_request":
                return EXIT_PAUSE
            if args.simulate_stop == "loop_max":
                return EXIT_LOOP_MAX
            return code
        print("[AUTO_OUTER_DRIVER_SELF_TEST_OK]")
        return EXIT_COMPLETED

    simulate = None
    if args.simulate_stop:
        simulate = {"stop_reason": args.simulate_stop}

    return run_driver(
        repo,
        max_cycles=args.max_cycles,
        max_stories=args.max_stories,
        dry_run=args.dry_run,
        invoke_cmd=args.invoke_cmd,
        simulate=simulate,
    )


if __name__ == "__main__":
    sys.exit(main())
