"""BUG-0035 / S0165 — phase-child-owned paired continuation contract tests.

Seven locked groups per `sprints/S0165/sprint.md` "Test contract" and
`docs/engineering/architecture.md` `# BUG-0035` / DEC-0153:

  1. test_bug0035_lawful_child_pair_allows_architecture
  2. test_bug0035_parent_remains_edit_denied
  3. test_bug0035_fresh_marker_and_strict_proof_required
  4. test_bug0035_missing_or_malformed_pair_stops
  5. test_bug0035_tuple_conflict_stops
  6. test_bug0035_unauthorized_replay_and_idempotence
  7. test_bug0035_active_template_parity_and_runbook_remediation

Fixture/mock contract tests only; no live OpenCode host claim
(UAT_PROBE_FORBIDDEN). BUG-0005 / BUG-0034 / US-0156 are compose-only
regression guards, not mutated here.
"""

from __future__ import annotations

import sys
from pathlib import Path

SELF = Path(__file__).resolve().parent.parent

# Resolve the active repo root and its template twin from either location so
# that this file remains byte-identical between tests/ and template/tests/.
if SELF.name == "template":
    TEMPLATE_ROOT = SELF
    ACTIVE_ROOT = SELF.parent
else:
    ACTIVE_ROOT = SELF
    TEMPLATE_ROOT = SELF / "template"

sys.path.insert(0, str(ACTIVE_ROOT / "scripts"))

import opencode_auto_bridge as bridge  # noqa: E402

STALE = bridge.RESUME_BRIEF_STALE
UNPARSEABLE = bridge.RESUME_BRIEF_UNPARSEABLE


# -- fixtures ---------------------------------------------------------------

def base_record(**overrides) -> dict:
    """A canonical, internally-consistent research→architecture pair record."""
    rec = {
        "record_key": "auto-BUG0035-research|bug|BUG-0035|research"
        "|rp-auto-20261003-bug0035-research-techlead-20261003T181856Z-BUG-0035",
        "orchestrator_run_id": "auto-20261003-bug0035-research",
        "work_item_kind": "bug",
        "bug_id": "BUG-0035",
        "completed_phase": "research",
        "writer_role": "tech-lead",
        "fresh_context_marker": "tl-BUG0035-research-20261003T181856Z-fresh",
        "resolution_source": "explicit start-from",
        "effective_plan": ["spec", "plan", "build+verify", "ship"],
        "skipped_phases": ["discovery"],
        "completed_phases": ["intake", "research"],
        "next_scheduled_phase": "architecture",
        "next_scheduled_role": "tech-lead",
        "phase_cursor": "plan/1-of-3",
        "budget_scope": "explicit BUG-0035 only; AUTO_BUG_QUEUE=0; no backlog drain",
        "stop_reason": "research_complete_phase_boundary",
        "runtime_proof_id": "rp-auto-20261003-bug0035-research-techlead-20261003T181856Z-BUG-0035",
        "proof_hash": "5F84DA760BBD4F390A2F1D9CC59BA29D54162FD9322FDB9A1F5CF605D26FC58D",
        "proof_issued_at": "2026-10-03T18:18:56Z",
        "proof_ttl_seconds": 3600,
        "phase_id": "research",
    }
    rec.update(overrides)
    return rec


def _reset() -> None:
    bridge.reset_resume_pair_registry_for_tests()


def _validate(**kwargs) -> dict:
    kwargs.setdefault("state_tuple", base_record())
    kwargs.setdefault("brief_tuple", base_record())
    kwargs.setdefault("writer_role", "tech-lead")
    _reset()
    return bridge.validate_resume_pair(ACTIVE_ROOT, **kwargs)


# -- group 1: lawful child pair allows architecture -------------------------

def test_bug0035_lawful_child_pair_allows_architecture() -> None:
    """State-first lawful research pair yields the sole schedulable continuation."""
    _reset()
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(), brief_tuple=base_record(),
    )
    assert out["ok"] is True, out
    assert out.get("idempotent_noop") is False
    assert out.get("next_scheduled_phase") == "architecture", out
    # the parent (auto) is still only allowed to *request* this next phase,
    # it never authors the pair
    assert out.get("key") == base_record()["record_key"]


# -- group 2: parent remains edit-denied -----------------------------------

def test_bug0035_parent_remains_edit_denied() -> None:
    """The auto parent cannot author state or brief; no broad role grant."""
    # (a) parent role is an unauthorized writer
    _reset()
    for bad_role in ("auto", "parent", "orchestrator", "", None):
        out = bridge.validate_resume_pair(
            ACTIVE_ROOT, writer_role=bad_role,
            state_tuple=base_record(), brief_tuple=base_record(),
        )
        assert out["ok"] is False, (bad_role, out)
        assert out.get("reasonCode") == STALE, (bad_role, out)

    # (b) active + template maps: exactly one resume_brief allow on tech-lead,
    #     deny-first ordering preserved, and the auto parent stays edit: deny.
    for root, label in ((ACTIVE_ROOT, "active"), (TEMPLATE_ROOT, "template")):
        tl = (root / ".opencode" / "agents" / "tech-lead.md").read_text(encoding="utf-8")
        # exactly one resume_brief allow
        assert '"handoffs/resume_brief.md": allow' in tl, label
        assert tl.count('"handoffs/resume_brief.md": allow') == 1, label
        # no broad handoff / wildcard grant
        assert '"handoffs/**": allow' not in tl, label
        assert '"*": allow' not in tl, label
        # deny-first: "**": deny appears and precedes the resume_brief allow
        deny_idx = tl.index('"**": deny')
        allow_idx = tl.index('"handoffs/resume_brief.md": allow')
        assert deny_idx < allow_idx, label
        # auto parent remains edit: deny (deny-by-default, not a grant)
        auto = (root / ".opencode" / "agents" / "auto.md").read_text(encoding="utf-8")
        assert "edit: deny" in auto, label
        assert "resume_brief.md" not in auto, label


# -- group 3: fresh marker + strict proof required --------------------------

def test_bug0035_fresh_marker_and_strict_proof_required() -> None:
    """Unique valid child marker and a valid strict-proof tuple are required."""
    # (a) missing/malformed fresh marker
    _reset()
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(fresh_context_marker="not-fresh"),
        brief_tuple=base_record(),
    )
    assert out["ok"] is False and out.get("reasonCode") == STALE, out
    assert "fresh_marker" in out.get("predicate", "") or "tuple_conflict" in out.get("predicate", ""), out

    # (b) a malformed strict-proof hash (non-64-hex) is UNPARSEABLE
    _reset()
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(proof_hash="0123"),
        brief_tuple=base_record(),
    )
    assert out["ok"] is False and out.get("reasonCode") == UNPARSEABLE, out
    assert "proof_hash" in out.get("predicate", ""), out

    # (c) non-positive TTL is a syntax failure
    _reset()
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(proof_ttl_seconds=0),
        brief_tuple=base_record(),
    )
    assert out["ok"] is False and out.get("reasonCode") == UNPARSEABLE, out


# -- group 4: missing / malformed pair stops --------------------------------

def test_bug0035_missing_or_malformed_pair_stops() -> None:
    """Absent-required and malformed sides stop; syntax is UNPARSEABLE."""
    # (a) brief side entirely missing → absent-required (STALE)
    _reset()
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(), brief_tuple={},
    )
    assert out["ok"] is False, out
    assert out.get("reasonCode") in (STALE, UNPARSEABLE), out
    assert out.get("next_scheduled_phase") is None, out

    # (b) non-dict state → UNPARSEABLE
    _reset()
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple="corrupt-bytes", brief_tuple=base_record(),
    )
    assert out["ok"] is False and out.get("reasonCode") == UNPARSEABLE, out

    # (c) absent required proof field (proof_hash dropped) → STALE
    _reset()
    rec = base_record()
    del rec["proof_hash"]
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=rec, brief_tuple=base_record(),
    )
    assert out["ok"] is False and out.get("reasonCode") == STALE, out
    assert "proof_hash" in out.get("predicate", ""), out
    assert out.get("next_scheduled_phase") is None, out


# -- group 5: tuple conflict stops -----------------------------------------

def test_bug0035_tuple_conflict_stops() -> None:
    """Any same-key field/phase/role/next-target mismatch is a hard stop."""
    # (a) differing next phase under the same key
    _reset()
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(),
        brief_tuple=base_record(next_scheduled_phase="qa"),
    )
    assert out["ok"] is False and out.get("reasonCode") == STALE, out
    assert out.get("predicate") == "tuple_conflict:next_scheduled_phase", out

    # (b) differing next role
    _reset()
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(),
        brief_tuple=base_record(next_scheduled_role="dev"),
    )
    assert out["ok"] is False and out.get("reasonCode") == STALE, out
    assert out.get("predicate") == "tuple_conflict:next_scheduled_role", out

    # (c) differing strict proof id under the same key → key mismatch
    _reset()
    other = "rp-auto-20261003-bug0035-research-techlead-20261003T181857Z-BUG-0035"
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(),
        brief_tuple=base_record(
            runtime_proof_id=other,
            record_key="auto-20261003-bug0035-research|bug|BUG-0035|research|" + other,
        ),
    )
    assert out["ok"] is False and out.get("reasonCode") == STALE, out
    assert out.get("next_scheduled_phase") is None, out


# -- group 6: unauthorized / replay / idempotence ---------------------------

def test_bug0035_unauthorized_replay_and_idempotence() -> None:
    """Unauthorized writer + reused proof fail; exact canonical replay is a no-op."""
    # (a) wrong writer role on an otherwise-good pair
    _reset()
    out = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="dev",
        state_tuple=base_record(), brief_tuple=base_record(),
    )
    assert out["ok"] is False and out.get("reasonCode") == STALE, out
    assert out.get("predicate") == "writer_role_mismatch", out

    # (b) exact canonical replay → idempotent no-op (ok, no reschedule)
    _reset()
    first = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(), brief_tuple=base_record(),
    )
    assert first["ok"] is True and first.get("idempotent_noop") is False
    replay = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(), brief_tuple=base_record(),
    )
    assert replay["ok"] is True and replay.get("idempotent_noop") is True, replay
    assert replay.get("predicate") == "exact_canonical_replay", replay

    # (c) changed field under the same registered key → replay conflict
    _reset()
    first = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(), brief_tuple=base_record(),
    )
    assert first["ok"] is True
    changed = bridge.validate_resume_pair(
        ACTIVE_ROOT, writer_role="tech-lead",
        state_tuple=base_record(budget_scope="drain everything"),
        brief_tuple=base_record(budget_scope="drain everything"),
    )
    assert changed["ok"] is False and changed.get("reasonCode") == STALE, changed
    assert changed.get("predicate") == "replay_conflict", changed


# -- group 7: parity + runbook remediation ---------------------------------

PAIRS = (
    ".opencode/agents/tech-lead.md",
    ".opencode/agents/dev.md",
    ".opencode/agents/auto.md",
    ".opencode/commands/research.md",
    ".opencode/commands/architecture.md",
    ".opencode/commands/auto.md",
    "scripts/opencode_auto_bridge.py",
    "docs/engineering/auto-orchestration-reference.md",
    "docs/engineering/runbook.md",
)


def test_bug0035_active_template_parity_and_runbook_remediation() -> None:
    """Permission/bridge/command/reference/runbook mirrors stay aligned."""
    for rel in PAIRS:
        a = (ACTIVE_ROOT / rel).read_bytes()
        t = (TEMPLATE_ROOT / rel).read_bytes()
        assert a == t, f"byte-parity FAIL: {rel} (active vs template)"

    # test-file mirror must exist and be byte-identical
    a_test = (ACTIVE_ROOT / "tests" / "bug0035_continuation_pair_test.py").read_bytes()
    t_test = (TEMPLATE_ROOT / "tests" / "bug0035_continuation_pair_test.py").read_bytes()
    assert a_test == t_test, "byte-parity FAIL: tests/bug0035_continuation_pair_test.py"

    # runbook remediation forbids fallback / hand-edit / auto-refresh
    for root in (ACTIVE_ROOT, TEMPLATE_ROOT):
        rb = (root / "docs" / "engineering" / "runbook.md").read_text(encoding="utf-8")
        assert "BUG-0035" in rb
        assert "RESUME_BRIEF_STALE" in rb
        assert "must not" in rb.lower() or "not hand-edit" in rb.lower()
        assert "Do NOT hand-edit" in rb
        assert "RESUME_BRIEF_AUTO_REFRESH" in rb
        assert "state" in rb.lower()

    # the bridge keeps the fail-closed vocabulary and no auto-refresh bypass
    src = (ACTIVE_ROOT / "scripts" / "opencode_auto_bridge.py").read_text(encoding="utf-8")
    assert "RESUME_BRIEF_STALE" in src
    assert "RESUME_BRIEF_UNPARSEABLE" in src
    assert "RESUME_BRIEF_AUTO_REFRESH" in src


if __name__ == "__main__":
    import pytest

    sys.exit(pytest.main([__file__, "-q"]))
