"""BUG-0038 / S0183 — deterministic operator-only QA-map repair boundary (T-003).

The active and template QA permission maps (``.opencode/agents/qa.md`` and
``template/.opencode/agents/qa.md``) must each carry exactly one narrow
continuation-brief allow (``"handoffs/resume_brief.md": allow``) placed
immediately after the deny-first entry (``"**": deny``), retaining every other
allow/deny and the security-hard boundary, and the two maps must be
byte-identical.

A **completed phase child** is the only lawful continuation-pair author
(DEC-0153). The dev/qa execute child has **no** write grant on either QA map
(the dev role map does not allow ``.opencode/agents/*`` or
``template/.opencode/agents/*`` QA-map paths), so a QA map pair that is
missing, malformed, non-parity, or otherwise not lawfully repairable by this
child is a **permission dead-end**: the deterministic result is
``PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR``.

This module is the single, pure implementation of that boundary. By
construction it:

* writes **neither** ``docs/engineering/state.md`` **nor**
  ``handoffs/resume_brief.md`` (it accepts only in-memory map text and returns
  a verdict; it opens no files for writing);
* schedules **no** phase (it never returns a next phase/role or a spawn);
* makes **no** automatic repair (it never rewrites a map or proposes one);
* requires **authorized operator action** followed by validation as the only
  recovery path.

It is the deterministic source of truth consumed by the BUG-0038 contract
test (``tests/bug0038_qa_resume_brief_permission_contract_test.py``). It reads
no secrets, does not run a live host, and performs no continuation-artifact
write.
"""

from __future__ import annotations

import hashlib
import re
from typing import Dict, List, Mapping, Optional

# --- Locked reason codes ------------------------------------------------------

#: Healthy QA map pair (both maps present, byte-identical, deny-first, exactly
#: one narrow brief allow in each, every other entry retained).
QA_MAP_PAIR_HEALTHY = "QA_MAP_PAIR_HEALTHY"

#: Unrepairable-by-this-child QA map pair: missing, malformed, non-parity, or
#: otherwise not lawfully repairable. Deterministic operator-only dead-end.
PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR = (
    "PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR"
)

#: The only reason codes this classifier may emit.
REASON_CODES = (
    QA_MAP_PAIR_HEALTHY,
    PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR,
)

# --- Locked diagnostic paths --------------------------------------------------

#: Active QA permission map (operator-owned; never edited by this module).
QA_MAP_ACTIVE = ".opencode/agents/qa.md"

#: Template QA permission map (operator-owned; never edited by this module).
QA_MAP_TEMPLATE = "template/.opencode/agents/qa.md"

#: The exact narrow continuation-brief path the QA map must allow exactly once.
RESUME_BRIEF_PATH = "handoffs/resume_brief.md"

#: The DEC-0153 continuation-pair members this boundary must NOT write.
STATE_MD_PATH = "docs/engineering/state.md"

#: The deny-first entry that must precede every allow in the QA map.
DENY_FIRST_ENTRY = '"**": deny'

#: The exact narrow allow this repair is about (one occurrence per map).
NARROW_ALLOW_ENTRY = '"handoffs/resume_brief.md": allow'

#: The three paths the operator-only diagnostic must name.
DIAGNOSTIC_PATHS = (
    QA_MAP_ACTIVE,
    QA_MAP_TEMPLATE,
    RESUME_BRIEF_PATH,
)

# --- Locked fault labels ------------------------------------------------------

#: Distinct fault labels (diagnostic detail) that all collapse to the single
#: operator-only reason code.
FAULT_MISSING_MAP = "missing_map"
FAULT_NON_PARITY = "non_parity"
FAULT_DENY_FIRST_MISSING = "deny_first_missing"
FAULT_NARROW_ALLOW_MISSING = "narrow_allow_missing"
FAULT_NARROW_ALLOW_DUPLICATE = "narrow_allow_duplicate"
FAULT_ALLOW_NOT_IMMEDIATELY_AFTER_DENY = "allow_not_immediately_after_deny"
FAULT_MALFORMED = "malformed"


def _sha256_hex(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _front_matter_lines(text: str) -> List[str]:
    """Return the lines of the leading YAML front-matter block.

    The permission maps open with a ``---`` fence. We scan that fence region
    (up to the closing ``---``) so line ordering can be checked without
    depending on the prose body that follows.
    """
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return lines
    body: List[str] = []
    for idx in range(1, len(lines)):
        if lines[idx].strip() == "---":
            break
        body.append(lines[idx])
    return body


def _indent(line: str) -> int:
    return len(line) - len(line.lstrip(" "))


def _entry_key(line: str) -> Optional[str]:
    """Return the quoted map key of a permission entry line, or None.

    Recognizes lines shaped like ``"some/path": allow`` / ``"**": deny``.
    """
    m = re.match(r'\s*"(?P<key>[^"]*)"\s*:\s*(?P<val>allow|deny)\b', line)
    if not m:
        return None
    return m.group("key")


def _map_audit(text: str) -> Dict[str, object]:
    """Audit one QA map text for deny-first ordering and narrow-allow count.

    Returns a diagnostic dict. ``ok`` is True only when the deny-first entry
    is present, the narrow allow occurs exactly once, and that allow sits
    immediately after the deny-first entry.
    """
    fm = _front_matter_lines(text)
    keys = [k for k in (_entry_key(line) for line in fm) if k is not None]
    # _entry_key returns the BARE key (no surrounding quotes), e.g. "**".
    deny_idx = keys.count("**")
    narrow_count = keys.count(RESUME_BRIEF_PATH)
    deny_first_present = deny_idx >= 1

    allow_immediately_after_deny = False
    if deny_first_present:
        # Locate the first "**" key line index, then require the narrow allow
        # to be the very next permission entry.
        for pos, k in enumerate(keys):
            if k == "**":
                allow_immediately_after_deny = (
                    pos + 1 < len(keys) and keys[pos + 1] == RESUME_BRIEF_PATH
                )
                break

    ok = (
        deny_first_present
        and narrow_count == 1
        and allow_immediately_after_deny
    )

    faults: List[str] = []
    if not deny_first_present:
        faults.append(FAULT_DENY_FIRST_MISSING)
    if narrow_count == 0:
        faults.append(FAULT_NARROW_ALLOW_MISSING)
    elif narrow_count > 1:
        faults.append(FAULT_NARROW_ALLOW_DUPLICATE)
    if deny_first_present and narrow_count == 1 and not allow_immediately_after_deny:
        faults.append(FAULT_ALLOW_NOT_IMMEDIATELY_AFTER_DENY)

    return {
        "sha256": _sha256_hex(text),
        "deny_first_present": deny_first_present,
        "narrow_allow_count": narrow_count,
        "allow_immediately_after_deny": allow_immediately_after_deny,
        "ok": ok,
        "faults": faults,
    }


def classify_qa_map_pair(
    active_map_text: Optional[str],
    template_map_text: Optional[str],
) -> Dict[str, object]:
    """Classify the active/template QA map pair (BUG-0038 T-003).

    Pure and deterministic. Given only in-memory map text, it returns a
    verdict dict. It never writes ``docs/engineering/state.md`` or
    ``handoffs/resume_brief.md``, never schedules a phase, and never performs
    or proposes an automatic repair.

    ``active_map_text`` / ``template_map_text`` are the raw contents of
    ``.opencode/agents/qa.md`` and ``template/.opencode/agents/qa.md``
    respectively; pass ``None`` for a map that is missing on disk.
    """
    result: Dict[str, object] = {
        "reason": QA_MAP_PAIR_HEALTHY,
        "requires_operator": False,
        "diagnostics": list(DIAGNOSTIC_PATHS),
        "faults": [],
        "active_sha256": None,
        "template_sha256": None,
        "byte_parity": False,
        # Invariants that must hold on EVERY return path (healthy or not):
        "wrote_state_md": False,
        "wrote_resume_brief": False,
        "next_scheduled_phase": None,
        "next_scheduled_role": None,
        "auto_repair_attempted": False,
        "schedules_phase": False,
    }

    active_missing = active_map_text is None
    template_missing = template_map_text is None

    active_audit = None if active_missing else _map_audit(active_map_text)  # type: ignore[arg-type]
    template_audit = (
        None if template_missing else _map_audit(template_map_text)  # type: ignore[arg-type]
    )

    if active_audit is not None:
        result["active_sha256"] = active_audit["sha256"]
    if template_audit is not None:
        result["template_sha256"] = template_audit["sha256"]

    faults: List[str] = []

    if active_missing:
        faults.append(FAULT_MISSING_MAP + ":active")
    if template_missing:
        faults.append(FAULT_MISSING_MAP + ":template")

    if not active_missing and not template_missing:
        byte_parity = active_audit["sha256"] == template_audit["sha256"]  # type: ignore[index]
        result["byte_parity"] = byte_parity
        if not byte_parity:
            faults.append(FAULT_NON_PARITY)

    # Per-map structural faults (deny-first, exactly-one, position).
    if active_audit is not None:
        faults.extend("active:" + f for f in active_audit["faults"])  # type: ignore[index]
    if template_audit is not None:
        faults.extend("template:" + f for f in template_audit["faults"])  # type: ignore[index]

    healthy = (
        not active_missing
        and not template_missing
        and result["byte_parity"] is True
        and bool(active_audit and active_audit["ok"])  # type: ignore[operator]
        and bool(template_audit and template_audit["ok"])  # type: ignore[operator]
    )

    if healthy:
        result["reason"] = QA_MAP_PAIR_HEALTHY
        result["requires_operator"] = False
        result["faults"] = []
    else:
        # Missing, malformed, non-parity, or otherwise not lawfully repairable
        # by this child -> deterministic operator-only dead-end. The diagnostic
        # names both QA map paths and the exact brief path. No state.md write,
        # no brief write, no phase scheduled, no automatic repair.
        result["reason"] = PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR
        result["requires_operator"] = True
        result["faults"] = faults
        # Hard invariants: this branch (and the healthy branch) both never
        # write either continuation-pair member, never schedule, never repair.
        result["wrote_state_md"] = False
        result["wrote_resume_brief"] = False
        result["next_scheduled_phase"] = None
        result["next_scheduled_role"] = None
        result["auto_repair_attempted"] = False
        result["schedules_phase"] = False

    return result


def assert_no_continuation_side_effects(verdict: Mapping[str, object]) -> None:
    """Guard used by the contract test: the verdict must carry no side effects.

    Raises ``AssertionError`` if the classifier ever reported a state.md write,
    a resume-brief write, a scheduled phase, or an automatic repair.
    """
    if verdict.get("reason") not in REASON_CODES:
        raise AssertionError(
            "PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR contract: unknown reason "
            f"{verdict.get('reason')!r}"
        )
    if verdict.get("wrote_state_md") is not False:
        raise AssertionError(
            "PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR contract: "
            f"{STATE_MD_PATH} must not be written"
        )
    if verdict.get("wrote_resume_brief") is not False:
        raise AssertionError(
            "PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR contract: "
            f"{RESUME_BRIEF_PATH} must not be written"
        )
    if verdict.get("next_scheduled_phase") is not None:
        raise AssertionError(
            "PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR contract: no phase may be "
            f"scheduled, got {verdict.get('next_scheduled_phase')!r}"
        )
    if verdict.get("auto_repair_attempted") is not False:
        raise AssertionError(
            "PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR contract: no automatic "
            "map repair may be attempted"
        )
    # The diagnostic must name both QA map paths and the exact brief path.
    for p in DIAGNOSTIC_PATHS:
        if p not in verdict.get("diagnostics", ()):  # type: ignore[operator]
            raise AssertionError(
                "PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR contract: diagnostic "
                f"must name {p!r}"
            )


def is_healthy(verdict: Mapping[str, object]) -> bool:
    """True when the QA map pair is healthy (operator action not required)."""
    return verdict.get("reason") == QA_MAP_PAIR_HEALTHY and not verdict.get(
        "requires_operator"
    )


def is_operator_required(verdict: Mapping[str, object]) -> bool:
    """True when the operator-only dead-end applies."""
    return verdict.get("reason") == (
        PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR
    )
