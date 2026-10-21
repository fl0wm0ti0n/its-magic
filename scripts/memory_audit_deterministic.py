#!/usr/bin/env python3
"""Deterministic memory audit. A clean result records model_calls=0.

Order: git diff, hash comparison, cross-reference validation, status
validation, schema validation. This helper never calls a model.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

AUDIT_ORDER = (
    "git_diff",
    "hash_comparison",
    "cross_reference",
    "status",
    "schema",
)


def run_audit(root: Path) -> Dict[str, Any]:
    root = Path(root)
    steps: List[Dict[str, Any]] = [
        {"step": "git_diff", "ok": _git_diff_ok(root)},
        {"step": "hash_comparison", "ok": _hash_ok(root)},
        {"step": "cross_reference", "ok": _cross_ref_ok(root)},
        {"step": "status", "ok": _status_ok(root)},
        {"step": "schema", "ok": _schema_ok(root)},
    ]
    if [step["step"] for step in steps] != list(AUDIT_ORDER):
        raise RuntimeError("audit order drifted")
    semantic = _semantic_question(root)
    drift = any(not step["ok"] for step in steps)
    unresolved = semantic
    if drift and not unresolved:
        unresolved = "deterministic drift is unresolved"
    return {
        "order": list(AUDIT_ORDER),
        "steps": steps,
        "model_calls": 0,
        "unresolved_semantic_question": unresolved,
        "clean": (not drift) and unresolved is None,
    }


def _read_optional(path: Path) -> str:
    if not path.is_file():
        return ""
    return path.read_text(encoding="utf-8")


def _git_diff_ok(root: Path) -> bool:
    return _read_optional(root / "audit-git.diff").strip() == ""


def _hash_ok(root: Path) -> bool:
    path = root / "audit-hashes.json"
    if not path.is_file():
        return True
    expected = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(expected, dict):
        return False
    for rel, digest in expected.items():
        target = root / str(rel)
        if not target.is_file():
            return False
        import hashlib
        actual = hashlib.sha256(target.read_bytes()).hexdigest()
        if actual != digest:
            return False
    return True


def _cross_ref_ok(root: Path) -> bool:
    path = root / "audit-refs.json"
    if not path.is_file():
        return True
    payload = json.loads(path.read_text(encoding="utf-8"))
    refs = payload.get("refs") if isinstance(payload, dict) else None
    if not isinstance(refs, list):
        return False
    for rel in refs:
        if not (root / str(rel)).exists():
            return False
    return True


def _status_ok(root: Path) -> bool:
    path = root / "audit-status.json"
    if not path.is_file():
        return True
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        return False
    status = str(payload.get("status") or "")
    allowed = payload.get("allowed") or ["OPEN", "DONE"]
    return status in allowed


def _schema_ok(root: Path) -> bool:
    path = root / "audit-schema.json"
    if not path.is_file():
        return True
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        return False
    required = payload.get("required") or []
    body = payload.get("body") or {}
    if not isinstance(body, dict):
        return False
    return all(key in body for key in required)


def _semantic_question(root: Path) -> Optional[str]:
    text = _read_optional(root / "unresolved-semantic.txt").strip()
    return text or None


def main() -> int:
    import sys
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    sys.stdout.write(json.dumps(run_audit(target), sort_keys=True) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
