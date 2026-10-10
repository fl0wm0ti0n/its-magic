#!/usr/bin/env python3
"""Autonomy repair ledger library (US-0119 / DEC-0119).

Bounded auto-repair ledger tracks per-run repair attempts for autonomy_resolvable
stop codes. The effective cap is resolved from the matrix per
``(orchestrator_run_id, reason_code)``; an explicitly authorized positive-integer
override may replace it. Cap exhaustion emits terminal stop
AUTONOMY_REPAIR_CAP_EXHAUSTED.

Ledger path: handoffs/autonomy_repair_ledger/<orchestrator_run_id>.jsonl

Usage:
  python scripts/autonomy_repair_ledger_lib.py --self-test
"""
import json
import sys
from pathlib import Path
from typing import Any, Optional

from validate_autonomy_stop_matrix import parse_yaml_matrix

REPO_ROOT = Path(__file__).resolve().parent.parent
LEDGER_DIR = REPO_ROOT / "handoffs" / "autonomy_repair_ledger"
DEFAULT_CAP = 3
MATRIX_PATH = REPO_ROOT / "scripts" / "data" / "autonomy_stop_matrix.yaml"


class RepairCapResolutionError(ValueError):
    """Fail-closed error for an invalid matrix classification or cap override."""


def resolve_matrix_repair(reason_code: str, auto_repair_kind: str) -> dict[str, Any]:
    """Resolve and validate one autonomy-resolvable matrix row.

    The ledger deliberately relies on the single YAML matrix rather than a
    PO-specific route. A caller cannot substitute a repair kind for a row.
    """
    matrix = parse_yaml_matrix(MATRIX_PATH)
    for row in matrix.get("reason_codes", []):
        if row.get("code") != reason_code:
            continue
        if row.get("stop_class") != "autonomy_resolvable":
            raise RepairCapResolutionError(
                f"{reason_code} is not autonomy_resolvable"
            )
        if row.get("auto_repair_kind") != auto_repair_kind:
            raise RepairCapResolutionError(
                f"{reason_code} requires {row.get('auto_repair_kind')}, not {auto_repair_kind}"
            )
        cap = row.get("cap")
        if not isinstance(cap, int) or cap < 1:
            raise RepairCapResolutionError(f"{reason_code} has no positive repair cap")
        return row
    raise RepairCapResolutionError(f"{reason_code} is not registered in the stop matrix")


def resolve_effective_cap(
    reason_code: str,
    auto_repair_kind: str,
    cap_override: Optional[int] = None,
    override_authorized: bool = False,
) -> tuple[int, str]:
    """Resolve the matrix cap or an authorized positive-integer override.

    Authorization is explicit input from the existing dispatch layer. This
    library never reads configuration or scratchpad files, avoiding an
    implicit policy bypass.
    """
    row = resolve_matrix_repair(reason_code, auto_repair_kind)
    if cap_override is None:
        return row["cap"], "matrix"
    if (
        not override_authorized
        or isinstance(cap_override, bool)
        or not isinstance(cap_override, int)
        or cap_override < 1
    ):
        raise RepairCapResolutionError(
            "AUTONOMY_REPAIR_CAP_OVERRIDE must be an authorized positive integer"
        )
    return cap_override, "authorized_override"


def get_ledger_path(orchestrator_run_id: str) -> Path:
    """Return per-run ledger path."""
    LEDGER_DIR.mkdir(parents=True, exist_ok=True)
    return LEDGER_DIR / f"{orchestrator_run_id}.jsonl"


def read_ledger(orchestrator_run_id: str) -> list[dict]:
    """Read all entries from the ledger."""
    ledger_path = get_ledger_path(orchestrator_run_id)
    if not ledger_path.exists():
        return []
    entries = []
    with open(ledger_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                entries.append(json.loads(line))
    return entries


def get_attempt_count(orchestrator_run_id: str, reason_code: str) -> int:
    """Count attempts for a specific reason code in the current run."""
    entries = read_ledger(orchestrator_run_id)
    return sum(1 for entry in entries if entry.get("reason_code") == reason_code)


def attempt_repair(
    orchestrator_run_id: str,
    reason_code: str,
    auto_repair_kind: str,
    success: bool,
    evidence_path: Optional[Path] = None,
    *,
    cap_override: Optional[int] = None,
    override_authorized: bool = False,
) -> dict:
    """Attempt a repair and log to ledger.

    Returns dict with keys: attempt, outcome, capped, terminal_stop.

    ``success`` means the caller has completed its actual validated repair; it
    must be false for ambiguity, invalid continuation evidence, or failed
    selection. Only a successful entry returns an autonomy breadcrumb.

    If cap is already exhausted, no untracked extra attempt is written and the
    terminal stop is returned. The cap-th failed attempt is still audited.
    """
    effective_cap, cap_source = resolve_effective_cap(
        reason_code,
        auto_repair_kind,
        cap_override=cap_override,
        override_authorized=override_authorized,
    )
    current_count = get_attempt_count(orchestrator_run_id, reason_code)
    if current_count >= effective_cap:
        return {
            "attempt": current_count,
            "outcome": "not_attempted",
            "capped": True,
            "terminal_stop": "AUTONOMY_REPAIR_CAP_EXHAUSTED",
            "effective_cap": effective_cap,
            "cap_source": cap_source,
            "breadcrumb": "",
        }

    attempt_num = current_count + 1
    outcome = "success" if success else "failure"

    entry = {
        "reason_code": reason_code,
        "auto_repair_kind": auto_repair_kind,
        "attempt": attempt_num,
        "outcome": outcome,
        "evidence_path": str(evidence_path) if evidence_path else "",
        "effective_cap": effective_cap,
        "cap_source": cap_source,
    }

    ledger_path = get_ledger_path(orchestrator_run_id)
    with open(ledger_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")

    capped = attempt_num >= effective_cap and not success
    terminal_stop = "AUTONOMY_REPAIR_CAP_EXHAUSTED" if capped else ""
    breadcrumb = (
        f"autonomy_relaxed: {reason_code} -> {auto_repair_kind}" if success else ""
    )

    return {
        "attempt": attempt_num,
        "outcome": outcome,
        "capped": capped,
        "terminal_stop": terminal_stop,
        "effective_cap": effective_cap,
        "cap_source": cap_source,
        "breadcrumb": breadcrumb,
    }


def self_test() -> tuple[bool, list[str]]:
    """Self-test: verify ledger append, cap, terminal stop."""
    import tempfile
    import os

    errors = []

    # Test 1: ledger append
    test_run_id = "test-run-001"
    test_reason = "STATE_TIMESTAMP_NON_MONOTONIC"
    
    # Clean up any prior test ledger
    test_ledger = get_ledger_path(test_run_id)
    if test_ledger.exists():
        test_ledger.unlink()

    # Attempt 3 failures
    for i in range(3):
        result = attempt_repair(test_run_id, test_reason, "fix_timestamp", False)
        if result["attempt"] != i + 1:
            errors.append(f"Test 1: expected attempt {i+1}, got {result['attempt']}")
        if result["outcome"] != "failure":
            errors.append(f"Test 1: expected outcome=failure, got {result['outcome']}")
        if i < 2 and result["capped"]:
            errors.append(f"Test 1: premature cap at attempt {i+1}")
        if i == 2 and not result["capped"]:
            errors.append(f"Test 1: expected cap at attempt 3, not capped")
        if i == 2 and result["terminal_stop"] != "AUTONOMY_REPAIR_CAP_EXHAUSTED":
            errors.append(f"Test 1: expected terminal_stop=AUTONOMY_REPAIR_CAP_EXHAUSTED, got {result['terminal_stop']}")

    # Test 2: ledger read-back
    entries = read_ledger(test_run_id)
    if len(entries) != 3:
        errors.append(f"Test 2: expected 3 ledger entries, got {len(entries)}")
    if entries[0]["reason_code"] != test_reason:
        errors.append(f"Test 2: reason_code mismatch in ledger entry 0")

    # Test 3: cap count
    count = get_attempt_count(test_run_id, test_reason)
    if count != 3:
        errors.append(f"Test 3: expected attempt count 3, got {count}")

    # Test 4: an exhausted cap must not append a fourth attempt.
    capped_result = attempt_repair(test_run_id, test_reason, "fix_timestamp", False)
    if not capped_result["capped"] or capped_result["attempt"] != 3:
        errors.append("Test 4: exhausted cap did not return the terminal stop")
    if len(read_ledger(test_run_id)) != 3:
        errors.append("Test 4: exhausted cap appended an extra ledger entry")

    # Cleanup
    test_ledger.unlink()

    return len(errors) == 0, errors


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Autonomy repair ledger lib (US-0119)")
    parser.add_argument("--self-test", action="store_true", help="Run self-test")
    args = parser.parse_args()

    if args.self_test:
        passed, errors = self_test()
        if passed:
            print("[AUTONOMY_REPAIR_LEDGER_SELF_TEST_OK]")
            sys.exit(0)
        else:
            print("[AUTONOMY_REPAIR_LEDGER_SELF_TEST_FAIL]")
            for err in errors:
                print(f"  {err}")
            sys.exit(1)

    print("Usage: python scripts/autonomy_repair_ledger_lib.py --self-test")
    sys.exit(0)


if __name__ == "__main__":
    main()
