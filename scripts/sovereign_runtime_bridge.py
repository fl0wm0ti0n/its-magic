#!/usr/bin/env python3
"""Closed 9-op sovereign runtime dispatcher (US-0144 / DEC-0144).

Invoked only as:
  python scripts/sovereign_runtime_bridge.py --operation <allowlisted-name> --request-json <compact-json>

Composes existing sovereign_*_lib / decision_ledger_lib schemas without modifying them.
Never reads .env. Never selects an executable, extra argv, or schema from the caller.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import traceback
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

from decision_ledger_lib import (  # noqa: E402
    LEDGER_SCHEMA_FIELDS,
    read_entries,
    resolve_ledger_path,
    schema_check,
)
from sovereign_convergence_lib import (  # noqa: E402
    ConvergenceResult,
    evaluate_convergence,
    write_partial_delivery_report,
)
from sovereign_critic_lib import select_critic_model  # noqa: E402
from sovereign_loop_lib import (  # noqa: E402
    AUTO_SOVEREIGN_DEFERRAL_MAX_DEFAULT,
    AUTO_SOVEREIGN_DEFERRAL_MAX_KEY,
    append_deferral,
    list_open_deferrals,
)
from sovereign_memory_lib import (  # noqa: E402
    build_injection_digest,
    build_injection_digest_block,
    is_sovereign_memory_enabled,
)
from sovereign_role_manifest_lib import (  # noqa: E402
    dispatch_role_review,
    list_obligations_for_phase,
    load_manifest,
    resolve_role_objective,
)

CLOSED_OPERATIONS = frozenset(
    {
        "memory_digest",
        "critic_model",
        "role_review_plan",
        "decision_session_append",
        "deferral_append",
        "deferral_list",
        "drain_candidate_gate",
        "convergence_evaluate",
        "partial_delivery_write",
    }
)

REQUEST_MAX_BYTES = 16 * 1024
RESPONSE_MAX_BYTES = 64 * 1024
SIDECAR_REL = Path("handoffs") / "sovereign_decision_sessions"
OPERATOR_DECISIONS = frozenset({"accept", "reject", "defer", "pending"})


def _emit(payload: Dict[str, Any], exit_code: int = 0) -> int:
    text = json.dumps(payload, separators=(",", ":"), ensure_ascii=False)
    encoded = text.encode("utf-8")
    if len(encoded) > RESPONSE_MAX_BYTES:
        fail = {
            "schema_version": 1,
            "request_id": payload.get("request_id", ""),
            "operation": payload.get("operation", ""),
            "ok": False,
            "reason_code": "KERNEL_SOVEREIGN_RESPONSE_INVALID",
        }
        sys.stdout.write(json.dumps(fail, separators=(",", ":")) + "\n")
        return 2
    sys.stdout.write(text + "\n")
    return exit_code


def _ok(request_id: str, operation: str, result: Dict[str, Any]) -> int:
    return _emit(
        {
            "schema_version": 1,
            "request_id": request_id,
            "operation": operation,
            "ok": True,
            "result": result,
        }
    )


def _fail(request_id: str, operation: str, reason_code: str, exit_code: int = 0) -> int:
    kernel = reason_code.startswith("KERNEL_SOVEREIGN_")
    return _emit(
        {
            "schema_version": 1,
            "request_id": request_id,
            "operation": operation,
            "ok": False,
            "reason_code": reason_code,
        },
        exit_code=2 if kernel else exit_code,
    )


def _scratchpad(payload: Dict[str, Any]) -> Dict[str, str]:
    raw = payload.get("scratchpad") or {}
    if not isinstance(raw, dict):
        return {}
    return {str(k): "" if v is None else str(v) for k, v in raw.items()}


def _repo(payload: Dict[str, Any]) -> Path:
    raw = payload.get("repo_root")
    if isinstance(raw, str) and raw.strip():
        return Path(raw).resolve()
    return Path.cwd().resolve()


def _as_str_list(value: Any) -> List[str]:
    if not isinstance(value, list):
        return []
    return [str(item) for item in value]


def op_memory_digest(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[str]]:
    scratch = _scratchpad(payload)
    repo = _repo(payload)
    if not is_sovereign_memory_enabled(scratch):
        return {"block": "", "entry_ids": [], "char_count": 0}, None
    digest = build_injection_digest(repo_root=repo, scratchpad=scratch)
    block = build_injection_digest_block(repo_root=repo, scratchpad=scratch) or ""
    return {
        "block": block,
        "entry_ids": list(digest.entry_ids),
        "char_count": int(digest.char_count),
    }, None


def op_critic_model(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[str]]:
    producer = str(payload.get("producer_model_id") or "")
    phase_id = str(payload.get("phase_id") or "execute")
    selected = select_critic_model(producer, _scratchpad(payload), phase_id)
    return {
        "critic_model_id": selected.critic_model_id,
        "degraded": bool(selected.degraded),
    }, None


def op_role_review_plan(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[str]]:
    scratch = _scratchpad(payload)
    repo = _repo(payload)
    phase_id = str(payload.get("phase_id") or "execute")
    producer_role = str(payload.get("producer_role") or "dev")
    evidence_ref = str(payload.get("producer_evidence_ref") or "")
    manifest, err = load_manifest(repo, scratch)
    if manifest is None:
        return {"objective": "", "dispatches": []}, None
    objective = resolve_role_objective(producer_role, manifest) or ""
    obligations = list_obligations_for_phase(phase_id, producer_role, manifest)
    dispatches: List[Dict[str, Any]] = []
    for obl in obligations:
        dispatch, _reason = dispatch_role_review(
            obl,
            evidence_ref,
            phase_id,
            producer_role,
            scratchpad=scratch,
        )
        if dispatch is None:
            continue
        dispatches.append(
            {
                "obligation_id": dispatch.obligation_id,
                "reviewer_role": dispatch.reviewer_role,
                "target_role": dispatch.producer_role,
                "trigger_phase": dispatch.trigger_phase,
                "spawn_only": True,
                "artifact_refs": list(dispatch.artifact_refs),
            }
        )
    return {"objective": objective[:2000], "dispatches": dispatches}, None


def _event_id(run_id: str, decision_id: str, session_id: str) -> str:
    blob = json.dumps(
        {
            "decision_id": decision_id,
            "orchestrator_run_id": run_id,
            "phase_session_id": session_id,
            "schema_version": 1,
        },
        separators=(",", ":"),
        sort_keys=True,
    )
    return hashlib.sha256(blob.encode("utf-8")).hexdigest().upper()


def _sidecar_path(repo: Path, run_id: str) -> Path:
    return repo / SIDECAR_REL / f"{run_id}.jsonl"


def _detect_torn_tail(path: Path) -> Optional[str]:
    if not path.exists():
        return None
    raw = path.read_bytes()
    if not raw:
        return None
    if not raw.endswith(b"\n"):
        return "SOVEREIGN_LEDGER_SIDECAR_PARTIAL_WRITE"
    text = raw.decode("utf-8")
    for line in text.split("\n"):
        if not line.strip():
            continue
        try:
            json.loads(line)
        except json.JSONDecodeError:
            return "SOVEREIGN_LEDGER_SIDECAR_PARTIAL_WRITE"
    return None


def _read_sidecar_ids(path: Path) -> List[str]:
    if not path.exists():
        return []
    ids: List[str] = []
    for line in path.read_text(encoding="utf-8").split("\n"):
        if not line.strip():
            continue
        obj = json.loads(line)
        event_id = obj.get("event_id")
        if isinstance(event_id, str):
            ids.append(event_id)
    return ids


def op_decision_session_append(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[str]]:
    run_id = str(payload.get("orchestrator_run_id") or "")
    decision_id = str(payload.get("decision_id") or "")
    session_id = str(payload.get("phase_session_id") or "")
    repo = _repo(payload)
    if not run_id or not decision_id or not session_id:
        return {}, "KERNEL_SOVEREIGN_REQUEST_INVALID"
    ledger_raw = payload.get("ledger_path")
    ledger_path = Path(str(ledger_raw)) if ledger_raw else resolve_ledger_path(run_id, repo)
    entries, reason, _msg = read_entries(ledger_path, strict=True)
    if reason is not None and not entries:
        return {}, "SOVEREIGN_LEDGER_DECISION_NOT_FOUND"
    match = next((row for row in entries if str(row.get("decision_id")) == decision_id), None)
    if match is None:
        return {}, "SOVEREIGN_LEDGER_DECISION_NOT_FOUND"
    ok, err = schema_check(match)
    if not ok:
        return {}, "SOVEREIGN_LEDGER_DECISION_NOT_FOUND"
    missing = [field for field in LEDGER_SCHEMA_FIELDS if field not in match]
    if missing:
        return {}, "SOVEREIGN_LEDGER_DECISION_NOT_FOUND"
    sidecar = _sidecar_path(repo, run_id)
    torn = _detect_torn_tail(sidecar)
    if torn:
        return {}, torn
    event_id = _event_id(run_id, decision_id, session_id)
    existing = _read_sidecar_ids(sidecar)
    if event_id in existing:
        return {"event_id": event_id, "idempotent": True}, None
    row = {
        "schema_version": 1,
        "event_id": event_id,
        "ts": str(payload.get("ts") or match.get("ts") or ""),
        "orchestrator_run_id": run_id,
        "decision_id": decision_id,
        "phase_id": str(payload.get("phase_id") or match.get("phase_id") or ""),
        "role": str(payload.get("role") or match.get("role") or ""),
        "phase_session_id": session_id,
        "parent_phase_session_id": payload.get("parent_phase_session_id"),
        "producer_model_id": str(payload.get("producer_model_id") or ""),
        "critic_model_id": str(payload.get("critic_model_id") or ""),
        "critic_degraded": bool(payload.get("critic_degraded", False)),
        "ledger_path": str(ledger_path),
    }
    try:
        sidecar.parent.mkdir(parents=True, exist_ok=True)
        line = json.dumps(row, separators=(",", ":"), ensure_ascii=False) + "\n"
        with sidecar.open("a", encoding="utf-8", newline="\n") as handle:
            handle.write(line)
            handle.flush()
            os.fsync(handle.fileno())
    except OSError:
        return {}, "SOVEREIGN_LEDGER_SIDECAR_APPEND_FAILED"
    return {"event_id": event_id, "idempotent": False}, None


def op_deferral_append(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[str]]:
    scratch = _scratchpad(payload)
    deferral_id, err = append_deferral(
        _repo(payload),
        scratch,
        reason_code=str(payload.get("reason_code") or "DEPLOY_DEFERRED"),
        work_item_kind=str(payload.get("work_item_kind") or "story"),
        work_item_ref=str(payload.get("work_item_ref") or "us0144"),
        source_orchestrator_run_id=str(payload.get("orchestrator_run_id") or ""),
        remediation_hint=str(payload.get("remediation_hint") or "operator decision required"),
        blocked_by_phase=payload.get("blocked_by_phase") if isinstance(payload.get("blocked_by_phase"), str) else None,
        retry_count=payload.get("retry_count") if isinstance(payload.get("retry_count"), int) else None,
        ledger_decision_id=payload.get("ledger_decision_id") if isinstance(payload.get("ledger_decision_id"), str) else None,
    )
    if err or not deferral_id:
        return {}, err or "KERNEL_SOVEREIGN_FAILED"
    return {"deferral_id": deferral_id}, None


def op_deferral_list(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[str]]:
    scratch = _scratchpad(payload)
    rows, err = list_open_deferrals(_repo(payload), scratchpad=scratch)
    if err and err == "SOVEREIGN_LOOP_DISABLED":
        return {"count": 0, "deferral_ids": []}, None
    if err:
        return {}, err
    cap = AUTO_SOVEREIGN_DEFERRAL_MAX_DEFAULT
    try:
        cap = int(scratch.get(AUTO_SOVEREIGN_DEFERRAL_MAX_KEY, str(AUTO_SOVEREIGN_DEFERRAL_MAX_DEFAULT)))
    except (TypeError, ValueError):
        cap = AUTO_SOVEREIGN_DEFERRAL_MAX_DEFAULT
    ids = [str(row.get("deferral_id")) for row in rows if row.get("deferral_id")][: max(0, cap)]
    return {"count": len(ids), "deferral_ids": ids}, None


def op_drain_candidate_gate(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[str]]:
    candidate_id = str(payload.get("candidate_id") or "")
    if not candidate_id:
        return {}, "KERNEL_SOVEREIGN_REQUEST_INVALID"
    auto_accept = str(payload.get("auto_accept") if payload.get("auto_accept") is not None else "0").strip()
    operator_decision = str(payload.get("operator_decision") or "pending").strip()
    if operator_decision not in OPERATOR_DECISIONS:
        operator_decision = "pending"
    # Explicit 0 beats preset expansion; absent accept never materializes.
    if auto_accept == "0" or auto_accept != "1":
        materialize = operator_decision == "accept"
    else:
        materialize = operator_decision == "accept"
    return {
        "candidate_id": candidate_id,
        "decision_gate": True,
        "operator_decision": operator_decision,
        "materialize": bool(materialize),
    }, None


def op_convergence_evaluate(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[str]]:
    scratch = _scratchpad(payload)
    repo = _repo(payload)
    result: ConvergenceResult = evaluate_convergence(
        repo,
        scratch,
        orchestrator_run_id=str(payload.get("orchestrator_run_id") or "") or None,
        iteration=payload.get("iteration") if isinstance(payload.get("iteration"), int) else None,
    )
    data = result.to_dict()
    data["smoke_browser_claimed"] = False
    blocking_only = True
    data["blocking_only"] = blocking_only
    return data, None


def op_partial_delivery_write(payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[str]]:
    scratch = _scratchpad(payload)
    repo = _repo(payload)
    run_id = str(payload.get("orchestrator_run_id") or "")
    result = evaluate_convergence(repo, scratch, orchestrator_run_id=run_id or None)
    from sovereign_convergence_lib import ReasonCode as ConvReason  # noqa: WPS433

    timeout_reason = ConvReason.SOVEREIGN_GOAL_TIMEOUT
    path = write_partial_delivery_report(
        repo,
        result,
        str(payload.get("goal_text") or ""),
        timeout_reason,
        run_id or None,
    )
    return {"path": str(path.as_posix())}, None


OPS = {
    "memory_digest": op_memory_digest,
    "critic_model": op_critic_model,
    "role_review_plan": op_role_review_plan,
    "decision_session_append": op_decision_session_append,
    "deferral_append": op_deferral_append,
    "deferral_list": op_deferral_list,
    "drain_candidate_gate": op_drain_candidate_gate,
    "convergence_evaluate": op_convergence_evaluate,
    "partial_delivery_write": op_partial_delivery_write,
}


def dispatch(operation: str, request: Dict[str, Any]) -> int:
    request_id = str(request.get("request_id") or "")
    if operation not in CLOSED_OPERATIONS:
        return _fail(request_id, operation, "KERNEL_SOVEREIGN_OPERATION_MISSING", exit_code=2)
    if (
        request.get("schema_version") != 1
        or not request_id
        or request.get("operation") != operation
        or not isinstance(request.get("orchestrator_run_id"), str)
        or not request.get("orchestrator_run_id")
        or not isinstance(request.get("payload"), dict)
    ):
        return _fail(request_id, operation, "KERNEL_SOVEREIGN_REQUEST_INVALID", exit_code=2)
    payload = request["payload"]
    handler = OPS[operation]
    try:
        result, err = handler(payload)
    except Exception:  # noqa: BLE001 — fail-closed envelope
        traceback.print_exc(file=sys.stderr)
        return _fail(request_id, operation, "KERNEL_SOVEREIGN_FAILED", exit_code=2)
    if err:
        return _fail(request_id, operation, err, exit_code=2 if err.startswith("KERNEL_SOVEREIGN_") else 0)
    return _ok(request_id, operation, result)


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--operation", required=True)
    parser.add_argument("--request-json", required=True)
    try:
        args = parser.parse_args(argv)
    except SystemExit:
        return _fail("", "", "KERNEL_SOVEREIGN_REQUEST_INVALID", exit_code=2)

    operation = str(args.operation)
    raw = str(args.request_json)
    if len(raw.encode("utf-8")) > REQUEST_MAX_BYTES:
        return _fail("", operation, "KERNEL_SOVEREIGN_REQUEST_INVALID", exit_code=2)
    try:
        request = json.loads(raw)
    except json.JSONDecodeError:
        return _fail("", operation, "KERNEL_SOVEREIGN_REQUEST_INVALID", exit_code=2)
    if not isinstance(request, dict):
        return _fail("", operation, "KERNEL_SOVEREIGN_REQUEST_INVALID", exit_code=2)
    return dispatch(operation, request)


if __name__ == "__main__":
    raise SystemExit(main())
