#!/usr/bin/env python3
"""Closed delivery runtime dispatcher (US-0145 / DEC-0145).

Invoked only as:
  python scripts/delivery_runtime_bridge.py --operation <allowlisted-name> --request-json <compact-json>

Composes parallel_dev_arbiter.py and self_healing_deploy_lib.py without modifying them.
Never reads .env.
"""

from __future__ import annotations

import argparse
import json
import sys
import traceback
from pathlib import Path
from typing import Any, Dict

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

import parallel_dev_arbiter as pda  # noqa: E402
import self_healing_deploy_lib as shd  # noqa: E402

CLOSED_OPERATIONS = frozenset(
    {
        "parallel_dev_spawn",
        "parallel_dev_create_worktrees",
        "parallel_dev_list_active",
        "parallel_dev_cleanup_orphans",
        "parallel_dev_merge_winner",
        "deploy_smoke_probe",
        "deploy_healing_retry",
    }
)

REQUEST_MAX_BYTES = 16 * 1024
RESPONSE_MAX_BYTES = 64 * 1024


def _emit(payload: Dict[str, Any], exit_code: int = 0) -> int:
    text = json.dumps(payload, separators=(",", ":"), ensure_ascii=False)
    encoded = text.encode("utf-8")
    if len(encoded) > RESPONSE_MAX_BYTES:
        fail = {
            "schema_version": 1,
            "request_id": payload.get("request_id", ""),
            "operation": payload.get("operation", ""),
            "ok": False,
            "reason_code": "KERNEL_DELIVERY_RESPONSE_INVALID",
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
    kernel = reason_code.startswith("KERNEL_DELIVERY_")
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


def _repo_root(payload: Dict[str, Any]) -> Path:
    raw = payload.get("kernel_root") or payload.get("repo_root") or "."
    return Path(str(raw)).resolve()


def _scratchpad(payload: Dict[str, Any]) -> Dict[str, str]:
    raw = payload.get("scratchpad") or {}
    if isinstance(raw, dict):
        return {str(k): str(v) for k, v in raw.items()}
    return {}


def dispatch(operation: str, request_id: str, payload: Dict[str, Any]) -> int:
    repo = _repo_root(payload)
    story_id = str(payload.get("story_id") or payload.get("run_id") or "story")
    orchestrator_run_id = str(payload.get("orchestrator_run_id") or "")

    if operation == "parallel_dev_create_worktrees":
        count = int(payload.get("instance_count") or 1)
        base_branch = str(payload.get("base_branch") or "main")
        contexts = pda.create_worktrees(base_branch, count, story_id, repo)
        failed = [c for c in contexts if "failed" in c.status]
        if failed:
            return _fail(
                request_id,
                operation,
                pda.ReasonCode.PARALLEL_DEV_WORKTREE_CREATE_FAILED,
            )
        return _ok(
            request_id,
            operation,
            {
                "worktrees": [
                    {
                        "instance_id": c.instance_id,
                        "path": c.path,
                        "branch": c.branch,
                        "status": c.status,
                    }
                    for c in contexts
                ]
            },
        )

    if operation == "parallel_dev_list_active":
        paths = pda.list_worktrees(repo)
        return _ok(request_id, operation, {"active_paths": paths})

    if operation == "parallel_dev_cleanup_orphans":
        contexts_raw = payload.get("contexts") or []
        contexts = []
        for item in contexts_raw:
            if isinstance(item, dict):
                contexts.append(
                    pda.WorktreeContext(
                        str(item.get("instance_id", "")),
                        str(item.get("path", "")),
                        str(item.get("branch", "")),
                        str(item.get("status", "ok")),
                    )
                )
        winner = payload.get("winner_instance_id")
        keep = bool(payload.get("keep_losers"))
        summary = pda.cleanup_worktrees(
            contexts,
            story_id,
            keep_losers=keep,
            winner_instance_id=str(winner) if winner else None,
            repo_root=repo,
        )
        return _ok(request_id, operation, summary)

    if operation == "parallel_dev_merge_winner":
        ctx_raw = payload.get("winner_context") or {}
        ctx = pda.WorktreeContext(
            str(ctx_raw.get("instance_id", story_id)),
            str(ctx_raw.get("path", "")),
            str(ctx_raw.get("branch", "")),
            str(ctx_raw.get("status", "ok")),
        )
        merge = pda.merge_winner(
            ctx,
            main_branch=str(payload.get("main_branch") or "main"),
            repo_root=repo,
            max_retries=int(payload.get("max_retries") or 2),
            timeout_sec=int(payload.get("timeout_sec") or 60),
            merge_resolve=str(payload.get("merge_resolve") or "first_pass_wins"),
        )
        ok = merge.success
        if not ok:
            code = (
                merge.conflicts[0]
                if merge.conflicts
                else pda.ReasonCode.PARALLEL_DEV_MERGE_CONFLICT
            )
            return _fail(request_id, operation, str(code))
        return _ok(
            request_id,
            operation,
            {
                "success": True,
                "branch": merge.branch,
                "commit_hash": merge.commit_hash,
            },
        )

    if operation == "parallel_dev_spawn":
        scratchpad_path = payload.get("scratchpad_path")
        sp_path = Path(str(scratchpad_path)) if scratchpad_path else repo / ".cursor" / "scratchpad.md"
        result = pda.execute_parallel_dev(
            story_id=story_id,
            base_branch=str(payload.get("base_branch") or "main"),
            instance_count=int(payload.get("instance_count") or 3),
            scratchpad_path=sp_path,
            repo_root=repo,
            orchestrator_run_id=orchestrator_run_id,
        )
        disabled = (
            result.merge_result.conflicts
            and pda.ReasonCode.PARALLEL_DEV_DISABLED in result.merge_result.conflicts
        )
        if disabled:
            return _ok(
                request_id,
                operation,
                {"enabled": False, "reason": pda.ReasonCode.PARALLEL_DEV_DISABLED},
            )
        if result.merge_result.conflicts and not result.merge_result.success:
            code = str(result.merge_result.conflicts[0])
            return _fail(request_id, operation, code)
        return _ok(
            request_id,
            operation,
            {
                "enabled": True,
                "winner_path": result.winner_worktree.path if result.winner_worktree else None,
                "merge_success": result.merge_result.success,
                "qa_count": len(result.qa_results),
            },
        )

    if operation == "deploy_smoke_probe":
        scratch = _scratchpad(payload)
        probe = shd.run_smoke_probe_chain(scratch)
        return _ok(
            request_id,
            operation,
            {
                "overall": probe.overall,
                "reason_code": probe.reason_code,
                "probe_kind": probe.probe_kind,
            },
        )

    if operation == "deploy_healing_retry":
        scratch = _scratchpad(payload)

        def _publish_handler(_attempt: str) -> bool:
            return bool(payload.get("publish_ok", True))

        loop = shd.run_deploy_healing_loop(
            repo,
            scratch,
            _publish_handler,
            story_id=story_id,
            orchestrator_run_id=orchestrator_run_id,
        )
        overall = "pass" if loop.reason_code in ("DEPLOY_SMOKE_PROBE_OK", "DEPLOY_HEALING_DISABLED") else "fail"
        deferred = loop.reason_code.endswith("EXHAUSTED") or loop.reason_code == "DEPLOY_HEALING_DEFERRED"
        result = {
            "overall": overall,
            "attempts": loop.retry_count,
            "reason_code": loop.reason_code or "DEPLOY_DEFERRED",
            "deferred": deferred,
        }
        if overall != "pass" and deferred:
            return _fail(request_id, operation, result["reason_code"])
        return _ok(request_id, operation, result)

    return _fail(request_id, operation, "KERNEL_DELIVERY_OPERATION_MISSING", exit_code=2)


def main() -> int:
    parser = argparse.ArgumentParser(description="US-0145 delivery runtime bridge")
    parser.add_argument("--operation", required=True)
    parser.add_argument("--request-json", required=True)
    args = parser.parse_args()
    if args.operation not in CLOSED_OPERATIONS:
        return _fail("", args.operation, "KERNEL_DELIVERY_OPERATION_MISSING", exit_code=2)
    raw = args.request_json.encode("utf-8")
    if len(raw) > REQUEST_MAX_BYTES:
        return _fail("", args.operation, "KERNEL_DELIVERY_REQUEST_INVALID", exit_code=2)
    try:
        envelope = json.loads(args.request_json)
    except json.JSONDecodeError:
        return _fail("", args.operation, "KERNEL_DELIVERY_REQUEST_INVALID", exit_code=2)
    if not isinstance(envelope, dict):
        return _fail("", args.operation, "KERNEL_DELIVERY_REQUEST_INVALID", exit_code=2)
    request_id = str(envelope.get("request_id") or "")
    operation = str(envelope.get("operation") or "")
    payload = envelope.get("payload")
    if operation != args.operation or not isinstance(payload, dict):
        return _fail(request_id, args.operation, "KERNEL_DELIVERY_REQUEST_INVALID", exit_code=2)
    try:
        return dispatch(operation, request_id, payload)
    except Exception:
        return _fail(request_id, operation, "KERNEL_DELIVERY_FAILED", exit_code=2)


if __name__ == "__main__":
    sys.exit(main())
