"""BUG-0038 / S0183 — QA continuation-brief permission contract (T-004).

Five locked markers per `sprints/S0183/tasks.md` (T-004) and
`docs/engineering/architecture.md` `# BUG-0038` (R-0173 A1):

  1. test_bug0038_qa_owns_qa_and_verify_work
  2. test_bug0038_qa_narrow_allow_parity_and_deny_first
  3. test_bug0038_every_phase_writer_has_brief_grant_in_both_trees
  4. test_bug0038_parent_orchestrator_remain_negative_permission_surfaces
  5. test_bug0038_unrepairable_map_requires_operator_without_pair_or_schedule

Static permission-map / matrix contract only. Phase writers are derived from
`PHASE_ROLE_MATRIX` (deduplicated role values) and checked in BOTH the active
and template agent trees. Parent/orchestrator authority is asserted from the
actual orchestrator permission map, NOT inferred from the matrix. The operator
boundary is exercised through the pure `scripts/permission_matrix_repair_lib`
classifier.

No secrets are read, no live host is run, and no continuation artifact is
written by this file.
"""

from __future__ import annotations

import hashlib
import re
import sys
from pathlib import Path

SELF = Path(__file__).resolve().parent.parent

# This file lives only in the active tree (tests/), per T-004 ("Add only
# tests/..."). Resolve the active repo root and its template twin.
ACTIVE_ROOT = SELF
TEMPLATE_ROOT = SELF / "template"

sys.path.insert(0, str(ACTIVE_ROOT / "scripts"))

from permission_matrix_repair_lib import (  # noqa: E402
    DIAGNOSTIC_PATHS,
    NARROW_ALLOW_ENTRY,
    PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR,
    QA_MAP_ACTIVE,
    QA_MAP_PAIR_HEALTHY,
    QA_MAP_TEMPLATE,
    RESUME_BRIEF_PATH,
    assert_no_continuation_side_effects,
    classify_qa_map_pair,
    is_healthy,
    is_operator_required,
)

ACTIVE_QA_MAP = ACTIVE_ROOT / QA_MAP_ACTIVE
# QA_MAP_TEMPLATE already carries the "template/" prefix, so it resolves from
# the active repo root (not from TEMPLATE_ROOT).
TEMPLATE_QA_MAP = ACTIVE_ROOT / QA_MAP_TEMPLATE
ACTIVE_ORCH = ACTIVE_ROOT / ".opencode" / "plugins" / "orchestrator.ts"
TEMPLATE_ORCH = TEMPLATE_ROOT / ".opencode" / "plugins" / "orchestrator.ts"
ACTIVE_ORCH_MAP = ACTIVE_ROOT / ".opencode" / "agents" / "auto.md"
TEMPLATE_ORCH_MAP = TEMPLATE_ROOT / ".opencode" / "agents" / "auto.md"

# The QA map entries that must be retained by the narrow allow (in addition to
# the deny-first entry and the one narrow allow).
QA_RETAINED_ALLOWS = (
    '"sprints/S*/qa-findings.md": allow',
    '"sprints/S*/plan-verify.json": allow',
    '"sprints/S*/verify-work-findings.md": allow',
    '"sprints/S*/uat.md": allow',
    '"sprints/S*/uat.json": allow',
    '"docs/engineering/state.md": allow',
    '"handoffs/qa_to_dev.md": allow',
    '"handoffs/qa_to_verify.md": allow',
    '"handoffs/qa_to_verify_work.md": allow',
)

# Security-hard / boundary lines that must remain unchanged in the QA map.
QA_SECURITY_HARD = (
    "mode: subagent",
    "bash: ask",
    "task: deny",
)

# The orchestrator (parent) must NOT carry any of these write grants.
ORCH_FORBIDDEN_GRANTS = (
    '"handoffs/resume_brief.md": allow',
    '"docs/engineering/state.md": allow',
    '".opencode/agents/qa.md": allow',
    '"template/.opencode/agents/qa.md": allow',
    'handoffs/resume_brief.md": allow',
    'docs/engineering/state.md": allow',
)


def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _front_matter(text: str) -> str:
    """Return the leading YAML front-matter block (between the ``---`` fences)."""
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return text
    out: list[str] = []
    for line in lines[1:]:
        if line.strip() == "---":
            break
        out.append(line)
    return "\n".join(out)


def _entry_lines(text: str) -> list[str]:
    """Return the indented permission-entry lines of the front matter.

    These are lines shaped like ``"key": allow`` / ``"key": deny`` inside the
    ``edit:`` block (the first indented block). We return them in file order so
    deny-first ordering can be checked.
    """
    fm = _front_matter(text)
    entries: list[str] = []
    for line in fm.splitlines():
        if re.match(r'\s*"[^"]*"\s*:\s*(allow|deny)\b', line):
            entries.append(line.strip())
    return entries


def _sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _parse_phase_role_matrix(src: str) -> dict[str, str]:
    """Parse the ``PHASE_ROLE_MATRIX`` object literal into an ordered dict."""
    start = src.index("PHASE_ROLE_MATRIX")
    brace = src.index("{", start)
    depth = 0
    end = -1
    for i in range(brace, len(src)):
        if src[i] == "{":
            depth += 1
        elif src[i] == "}":
            depth -= 1
            if depth == 0:
                end = i
                break
    if end == -1:
        raise AssertionError("PHASE_ROLE_MATRIX closing brace not found")
    block = src[brace : end + 1]

    matrix: dict[str, str] = {}
    entry_re = re.compile(
        r'''^\s*(?:"((?:[^"\\]|\\.)+)"|([A-Za-z0-9_-]+))\s*:\s*"([A-Za-z0-9_-]+)"\s*,?\s*$''',
        re.MULTILINE,
    )
    for m in entry_re.finditer(block):
        key = m.group(1) if m.group(1) is not None else m.group(2)
        role = m.group(3)
        matrix[key] = role
    return matrix


def _deduped_matrix_roles(active_src: str, template_src: str) -> tuple[list[str], dict[str, str]]:
    active_matrix = _parse_phase_role_matrix(active_src)
    template_matrix = _parse_phase_role_matrix(template_src)
    assert active_matrix == template_matrix, (
        "PHASE_ROLE_MATRIX active/template mismatch: "
        f"active={active_matrix} template={template_matrix}"
    )
    roles = sorted(set(active_matrix.values()))
    return roles, active_matrix


def _map_has_brief_allow(map_text: str) -> bool:
    return NARROW_ALLOW_ENTRY in map_text


# ---------------------------------------------------------------------------
# 1. test_bug0038_qa_owns_qa_and_verify_work
# ---------------------------------------------------------------------------


def test_bug0038_qa_owns_qa_and_verify_work() -> None:
    active_matrix = _parse_phase_role_matrix(_read(ACTIVE_ORCH))
    template_matrix = _parse_phase_role_matrix(_read(TEMPLATE_ORCH))
    assert active_matrix == template_matrix, (
        "PHASE_ROLE_MATRIX active/template mismatch"
    )
    # QA is the matrix writer for BOTH QA-owned phases.
    assert active_matrix.get("qa") == "qa", (
        f"matrix maps qa to {active_matrix.get('qa')!r}, expected 'qa'"
    )
    assert active_matrix.get("verify-work") == "qa", (
        f"matrix maps verify-work to {active_matrix.get('verify-work')!r}, "
        "expected 'qa'"
    )
    assert template_matrix.get("qa") == "qa"
    assert template_matrix.get("verify-work") == "qa"


# ---------------------------------------------------------------------------
# 2. test_bug0038_qa_narrow_allow_parity_and_deny_first
# ---------------------------------------------------------------------------


def test_bug0038_qa_narrow_allow_parity_and_deny_first() -> None:
    active = _read(ACTIVE_QA_MAP)
    template = _read(TEMPLATE_QA_MAP)

    # Byte parity (AC-2).
    assert _sha256(active) == _sha256(template), (
        "active/template QA maps are not byte-identical"
    )

    for label, text in (("active", active), ("template", template)):
        entries = _entry_lines(text)

        # Deny-first: the very first entry is the deny-all.
        assert entries and entries[0] == '"**": deny', (
            f"{label} QA map is not deny-first; first entry={entries[0]!r}"
        )

        # Exactly one narrow allow (AC-2 "exactly once"), never a duplicate.
        narrow_count = sum(
            1 for e in entries if e == '"handoffs/resume_brief.md": allow'
        )
        assert narrow_count == 1, (
            f"{label} QA map has {narrow_count} narrow brief allows; "
            "expected exactly one"
        )

        # The narrow allow sits IMMEDIATELY after the deny-first entry.
        allow_idx = entries.index('"handoffs/resume_brief.md": allow')
        assert allow_idx == 1, (
            f"{label} QA map narrow allow is not immediately after deny-first "
            f"(index={allow_idx}, expected 1)"
        )

        # Retain every existing allow.
        for retained in QA_RETAINED_ALLOWS:
            assert retained in text, (
                f"{label} QA map lost retained allow {retained!r}"
            )

        # Retain security-hard boundaries.
        for hard in QA_SECURITY_HARD:
            assert hard in text, (
                f"{label} QA map lost security-hard boundary {hard!r}"
            )

        # No wildcard / broad handoff grant was introduced.
        assert '"handoffs/**": allow' not in text, (
            f"{label} QA map carries a broad handoff wildcard grant"
        )


# ---------------------------------------------------------------------------
# 3. test_bug0038_every_phase_writer_has_brief_grant_in_both_trees
# ---------------------------------------------------------------------------


def test_bug0038_every_phase_writer_has_brief_grant_in_both_trees() -> None:
    active_src = _read(ACTIVE_ORCH)
    template_src = _read(TEMPLATE_ORCH)
    roles, _matrix = _deduped_matrix_roles(active_src, template_src)

    # Derive writers from PHASE_ROLE_MATRIX (deduplicated role values). The
    # orchestrator/parent is not a matrix role, so it is excluded here.
    assert "qa" in roles, "qa is a matrix writer role but was not derived"
    for role in roles:
        active_map = ACTIVE_ROOT / ".opencode" / "agents" / f"{role}.md"
        template_map = TEMPLATE_ROOT / ".opencode" / "agents" / f"{role}.md"
        assert active_map.is_file(), f"missing active agent map for role {role!r}"
        assert template_map.is_file(), (
            f"missing template agent map for role {role!r}"
        )
        active_text = _read(active_map)
        template_text = _read(template_map)
        assert _map_has_brief_allow(active_text), (
            f"active map for matrix writer role {role!r} lacks the "
            f"{RESUME_BRIEF_PATH!r} grant"
        )
        assert _map_has_brief_allow(template_text), (
            f"template map for matrix writer role {role!r} lacks the "
            f"{RESUME_BRIEF_PATH!r} grant"
        )


# ---------------------------------------------------------------------------
# 4. test_bug0038_parent_orchestrator_remain_negative_permission_surfaces
# ---------------------------------------------------------------------------


def test_bug0038_parent_orchestrator_remain_negative_permission_surfaces() -> None:
    # The parent/orchestrator is the ``mode: primary`` agent (auto.md). Its
    # negative surface is asserted from its ACTUAL permission map, not
    # inferred from PHASE_ROLE_MATRIX.
    for label, path in (
        ("active", ACTIVE_ORCH_MAP),
        ("template", TEMPLATE_ORCH_MAP),
    ):
        text = _read(path)
        fm = _front_matter(text)

        # The orchestrator has no edit surface at all.
        assert re.search(r"^\s*edit:\s*deny\s*$", fm, re.MULTILINE), (
            f"{label} orchestrator map does not deny edit outright"
        )

        # No continuation-pair, state, QA-map, matrix, or Task-allowlist write
        # grant is introduced anywhere in the map.
        for grant in ORCH_FORBIDDEN_GRANTS:
            assert grant not in text, (
                f"{label} orchestrator map carries forbidden grant {grant!r}"
            )
        assert "resume_brief.md" not in text, (
            f"{label} orchestrator map references the resume brief at all"
        )
        assert "state.md" not in text, (
            f"{label} orchestrator map references state.md at all"
        )
        # No authority to change the matrix or Task allowlist.
        assert "PHASE_ROLE_MATRIX" not in text
        assert "TASK_ALLOWLIST" not in text

    # The matrix does not invent a parent/orchestrator writer role (we do not
    # infer parent authority from the matrix).
    active_matrix = _parse_phase_role_matrix(_read(ACTIVE_ORCH))
    matrix_roles = set(active_matrix.values())
    for parent_token in ("parent", "orchestrator", "auto"):
        assert parent_token not in matrix_roles, (
            f"PHASE_ROLE_MATRIX must not map a delivery phase to "
            f"{parent_token!r} (parent authority is not inferred from the "
            f"matrix)"
        )


# ---------------------------------------------------------------------------
# 5. test_bug0038_unrepairable_map_requires_operator_without_pair_or_schedule
# ---------------------------------------------------------------------------


def _healthy_pair_text() -> str:
    # The live QA map text is a healthy pair; reuse its content as the
    # well-formed baseline for the classifier.
    return _read(ACTIVE_QA_MAP)


def test_bug0038_unrepairable_map_requires_operator_without_pair_or_schedule() -> None:
    healthy_text = _healthy_pair_text()

    # (a) The current live pair is healthy: no operator action required.
    healthy = classify_qa_map_pair(healthy_text, _read(TEMPLATE_QA_MAP))
    assert is_healthy(healthy), f"live QA pair unexpectedly unhealthy: {healthy}"
    assert healthy["reason"] == QA_MAP_PAIR_HEALTHY
    assert healthy["requires_operator"] is False
    assert_no_continuation_side_effects(healthy)

    # (b) Non-parity pair -> operator-only dead-end.
    mutated = healthy_text.replace(
        '"sprints/S*/uat.md": allow', '"sprints/S*/uat.md": deny', 1
    )
    non_parity = classify_qa_map_pair(healthy_text, mutated)
    assert is_operator_required(non_parity), (
        f"non-parity pair must require operator, got {non_parity['reason']!r}"
    )
    assert non_parity["reason"] == PERMISSION_MATRIX_REPAIR_REQUIRES_OPERATOR
    assert non_parity["byte_parity"] is False
    assert non_parity["faults"], "non-parity verdict must carry fault detail"
    assert_no_continuation_side_effects(non_parity)

    # (c) Missing map -> operator-only dead-end.
    missing = classify_qa_map_pair(healthy_text, None)
    assert is_operator_required(missing)
    assert any(f.startswith("missing_map:") for f in missing["faults"]), (
        f"missing-map fault not recorded: {missing['faults']}"
    )
    assert_no_continuation_side_effects(missing)

    # (d) Duplicate narrow allow -> operator-only dead-end.
    duplicated = healthy_text.replace(
        '"sprints/S*/qa-findings.md": allow',
        '"handoffs/resume_brief.md": allow\n    "sprints/S*/qa-findings.md": allow',
        1,
    )
    dup = classify_qa_map_pair(duplicated, duplicated)
    assert is_operator_required(dup), (
        f"duplicate narrow allow must require operator, got {dup['reason']!r}"
    )
    assert any(
        "narrow_allow_duplicate" in f for f in dup["faults"]
    ), f"duplicate fault not recorded: {dup['faults']}"
    assert_no_continuation_side_effects(dup)

    # (e) The diagnostic names both QA map paths and the exact brief path.
    for verdict in (non_parity, missing, dup):
        for p in DIAGNOSTIC_PATHS:
            assert p in verdict["diagnostics"], (
                f"operator-only diagnostic must name {p!r}"
            )
        # The three required paths are exactly the QA maps + the brief.
        assert QA_MAP_ACTIVE in verdict["diagnostics"]
        assert QA_MAP_TEMPLATE in verdict["diagnostics"]
        assert RESUME_BRIEF_PATH in verdict["diagnostics"]

    # (f) No continuation side effect on any unrepairable verdict: no pair
    # write, no phase scheduled, no automatic repair.
    for verdict in (non_parity, missing, dup):
        assert verdict["wrote_state_md"] is False, "must not write state.md"
        assert verdict["wrote_resume_brief"] is False, "must not write the brief"
        assert verdict["next_scheduled_phase"] is None, "must not schedule a phase"
        assert verdict["next_scheduled_role"] is None, "must not schedule a role"
        assert verdict["auto_repair_attempted"] is False, (
            "must not attempt automatic map repair"
        )
        assert verdict["schedules_phase"] is False
