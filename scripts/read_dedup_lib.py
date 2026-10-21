#!/usr/bin/env python3
"""Phase read-dedup ledger.

Same path, sha256, and section in one phase is not fully read twice.
Large means estimated_tokens >= 3000. The ledger is not copied into state.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

LEDGER_REL = ".its-magic/metrics/read-dedup.jsonl"
LARGE_TOKEN_THRESHOLD = 3000
DUPLICATE_LARGE_RATIO_LIMIT = 0.10


def note_read(
    *,
    ledger_path: Path,
    phase: str,
    path: str,
    sha256: str,
    estimated_tokens: int,
    section: Optional[str] = None,
    symbol: Optional[str] = None,
    read: Optional[Callable[[], Any]] = None,
) -> Dict[str, Any]:
    label = section if section is not None else symbol
    if label is None:
        raise ValueError("section or symbol is required")
    rows = load_ledger(ledger_path)
    for row in rows:
        if (
            row.get("phase") == phase
            and row.get("path") == path
            and row.get("sha256") == sha256
            and row.get("section") == label
            and row.get("performed")
        ):
            duplicate = _record(
                phase=phase,
                path=path,
                sha256=sha256,
                section=label,
                estimated_tokens=estimated_tokens,
                performed=False,
                duplicate=True,
            )
            append_ledger(ledger_path, duplicate)
            return {"performed": False, "duplicate": True, "body": None, "record": duplicate}
    body = read() if read is not None else None
    record = _record(
        phase=phase,
        path=path,
        sha256=sha256,
        section=label,
        estimated_tokens=estimated_tokens,
        performed=True,
        duplicate=False,
    )
    append_ledger(ledger_path, record)
    return {"performed": True, "duplicate": False, "body": body, "record": record}


def large_duplicate_ratio(ledger_path: Path, phase: str) -> float:
    rows = [
        row for row in load_ledger(ledger_path)
        if row.get("phase") == phase and int(row.get("estimated_tokens") or 0) >= LARGE_TOKEN_THRESHOLD
    ]
    large = [row for row in rows if row.get("performed")]
    duplicates = [row for row in rows if row.get("duplicate")]
    if not large:
        return 0.0
    return len(duplicates) / len(large)


def ratio_under_budget(ratio: float) -> bool:
    return ratio < DUPLICATE_LARGE_RATIO_LIMIT


def load_ledger(path: Path) -> List[Dict[str, Any]]:
    path = Path(path)
    if not path.is_file():
        return []
    rows: List[Dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.strip():
            rows.append(json.loads(line))
    return rows


def append_ledger(path: Path, record: Dict[str, Any]) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8", newline="\n") as handle:
        handle.write(json.dumps(record, sort_keys=True, separators=(",", ":")) + "\n")


def _record(
    *,
    phase: str,
    path: str,
    sha256: str,
    section: str,
    estimated_tokens: int,
    performed: bool,
    duplicate: bool,
) -> Dict[str, Any]:
    return {
        "phase": phase,
        "path": path,
        "sha256": sha256,
        "section": section,
        "estimated_tokens": int(estimated_tokens),
        "performed": performed,
        "duplicate": duplicate,
    }
