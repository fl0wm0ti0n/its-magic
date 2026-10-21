"""BUG-0037 contract: the canonical structured story-block shape.

Markers are the `test_bug0037_*` functions. The OpenCode PO story-creation
surface must carry the canonical structured block (H2 `## US-#### — <Title>`
plus structured `- <field>:` lines, `Status` mandatory) as the **single source
of truth** in `.opencode/agents/po.md`, referenced (not re-duplicated) by
`.opencode/commands/intake.md`, with byte-identical active/template twins.

The 8-assertion shape lock is the discovery/architecture lock, carried not
expanded. The heading check is glyph-independent on the em-dash (canonical but
not asserted); the contract asserts shape, not intake provenance.

This test reads the four OpenCode surfaces + the `US-0161` exemplar only. It
does not run a live host, read secrets, or write continuation artifacts.
"""

from __future__ import annotations

import re
from pathlib import Path

SELF = Path(__file__).resolve().parent.parent
ROOT = SELF

ACTIVE_PO = ROOT / ".opencode" / "agents" / "po.md"
TEMPLATE_PO = ROOT / "template" / ".opencode" / "agents" / "po.md"
ACTIVE_INTAKE = ROOT / ".opencode" / "commands" / "intake.md"
TEMPLATE_INTAKE = ROOT / "template" / ".opencode" / "commands" / "intake.md"
BACKLOG = ROOT / "docs" / "product" / "backlog.md"

PROSE_MARKERS = ("**Priority:**", "**Release:**", "**Acceptance criteria**")

# Positive fixture: the canonical structured block (US-0161-shaped).
POSITIVE = (
    "## US-9999 \u2014 Canonical Shape Fixture\n"
    "- user_visible: true\n"
    "- Title: Canonical Shape Fixture\n"
    "- Summary: A minimal structured block used as the positive reference fixture.\n"
    "- Priority: P1\n"
    "- Status: OPEN\n"
    "- Acceptance:\n"
    "  - [ ] AC-1: The block carries the canonical structured fields.\n"
)

# Negative fixture: the observed prose shape (H3, prose markers, no Status).
NEGATIVE = (
    "### US-9998 \u2014 Prose Shape Fixture\n"
    "**Priority:** P0 \u00b7 **Release:** V1\n"
    "**Acceptance criteria**\n"
    "- AC-1: Some prose acceptance bullet.\n"
    "- AC-2: Another prose acceptance bullet.\n"
)


def _shape_violations(block: str) -> list[str]:
    """Return the list of the 8 locked shape assertions the block violates.

    Empty means the block is canonical. The heading check is glyph-independent
    on the em-dash (canonical but not asserted).
    """
    lines = block.splitlines()
    violations: list[str] = []

    # (1) canonical H2 heading `## US-#### <Title>` (not H3 / `# User Story`).
    has_h2 = any(re.match(r"^##\s+US-\d{4}\b", ln) for ln in lines)
    has_h3 = any(re.match(r"^###\s+US-\d{4}\b", ln) for ln in lines)
    has_user_story = any(re.match(r"^#\s+User Story", ln) for ln in lines)
    if not (has_h2 and not has_h3 and not has_user_story):
        violations.append("heading_not_h2")

    # (2) `- user_visible:`
    if not any(re.match(r"^-\s+user_visible:", ln) for ln in lines):
        violations.append("missing_user_visible")

    # (3) `- Title:`
    if not any(re.match(r"^-\s+Title:", ln) for ln in lines):
        violations.append("missing_title")

    # (4) `- Summary:`
    if not any(re.match(r"^-\s+Summary:", ln) for ln in lines):
        violations.append("missing_summary")

    # (5) `- Priority: P<n>`
    if not any(re.match(r"^-\s+Priority:\s+P\d+\b", ln) for ln in lines):
        violations.append("missing_priority")

    # (6) `- Status:` (MUST be present)
    if not any(re.match(r"^-\s+Status:", ln) for ln in lines):
        violations.append("missing_status")

    # (7) `- Acceptance:` with at least one `  - [ ] AC-n:` bullet.
    has_acceptance = any(re.match(r"^-\s+Acceptance:", ln) for ln in lines)
    has_ac_bullet = any(re.match(r"^\s+-\s+\[\s\]\s+AC-\d+:", ln) for ln in lines)
    if not (has_acceptance and has_ac_bullet):
        violations.append("missing_acceptance")

    # (8) shape discriminator: no prose markers.
    if any(marker in block for marker in PROSE_MARKERS):
        violations.append("prose_markers_present")

    return violations


def _extract_us0161() -> str:
    """Extract the live `## US-0161` block from the backlog (positive reference
    fixture). Robust to line drift: slice from the heading to the next heading.
    """
    lines = BACKLOG.read_text(encoding="utf-8").splitlines()
    start = None
    for i, line in enumerate(lines):
        if re.match(r"^##\s+US-0161\b", line):
            start = i
            break
    assert start is not None, "US-0161 heading not found in backlog.md"
    end = len(lines)
    for j in range(start + 1, len(lines)):
        if re.match(r"^#{2,3}\s", lines[j]):
            end = j
            break
    return "\n".join(lines[start:end])


def test_bug0037_positive_fixture_is_canonical() -> None:
    """The positive US-0161-shaped fixture passes all 8 shape assertions."""
    assert _shape_violations(POSITIVE) == [], _shape_violations(POSITIVE)


def test_bug0037_negative_prose_fixture_is_rejected() -> None:
    """The observed prose shape violates every one of the 8 locked assertions."""
    violations = _shape_violations(NEGATIVE)
    expected = {
        "heading_not_h2",
        "missing_user_visible",
        "missing_title",
        "missing_summary",
        "missing_priority",
        "missing_status",
        "missing_acceptance",
        "prose_markers_present",
    }
    assert set(violations) == expected, violations


def test_bug0037_us0161_exemplar_is_canonical() -> None:
    """The live `## US-0161` exemplar block is intact and canonical (shape, not
    provenance). This is the positive reference fixture and a no-weakening /
    no-reopen invariance guard (AC-5)."""
    assert _shape_violations(_extract_us0161()) == []


def test_bug0037_four_file_active_template_byte_parity() -> None:
    """Each active/template pair is byte-identical (AC-2 invariant)."""
    assert ACTIVE_PO.read_bytes() == TEMPLATE_PO.read_bytes(), "po.md pair drift"
    assert (
        ACTIVE_INTAKE.read_bytes() == TEMPLATE_INTAKE.read_bytes()
    ), "intake.md pair drift"


def test_bug0037_template_in_pomd_and_directive_in_intake() -> None:
    """The field template (single source of truth) is present in po.md and the
    /intake `## Story creation` directive in intake.md references po.md and
    cites US-0161 (the agent-vs-command split). This is the core deliverable
    that the permission dead-end currently leaves unapplied on the stubs."""
    for po in (ACTIVE_PO, TEMPLATE_PO):
        text = po.read_text(encoding="utf-8")
        assert "## Story block shape" in text, f"template missing in {po}"
        assert "## US-" in text, f"template heading missing in {po}"
        assert "- Status:" in text, f"Status field rule missing in {po}"
    for intake in (ACTIVE_INTAKE, TEMPLATE_INTAKE):
        text = intake.read_text(encoding="utf-8")
        assert "## Story creation" in text, f"directive missing in {intake}"
        assert "po.md" in text, f"directive must reference po.md in {intake}"
        assert "US-0161" in text, f"directive must cite US-0161 in {intake}"
