"""Fixture/mock contract tests for BUG-0034's bounded PO repair registration."""

import subprocess
import sys
from pathlib import Path

import pytest


SELF = Path(__file__).resolve().parent.parent
if SELF.name == "template":
    TEMPLATE_ROOT = SELF
    REPO_ROOT = SELF.parent
else:
    REPO_ROOT = SELF
    TEMPLATE_ROOT = SELF / "template"
sys.path.insert(0, str(REPO_ROOT / "scripts"))

import autonomy_repair_ledger_lib as ledger  # pyright: ignore[reportMissingImports]
from validate_autonomy_stop_matrix import parse_yaml_matrix  # pyright: ignore[reportMissingImports]


CODE = "PO_CLOSURE_PRECONDITION_CONFLICT"
KIND = "disambiguate_state"
RATIONALE = (
    "Closure preconditions can be selected only from one already-evidenced state; "
    "ambiguous or paired-brief evidence remains fail-closed."
)


def _matrix_row() -> dict:
    matrix = parse_yaml_matrix(REPO_ROOT / "scripts" / "data" / "autonomy_stop_matrix.yaml")
    return next(row for row in matrix["reason_codes"] if row["code"] == CODE)


def _pair(active: str) -> tuple[Path, Path]:
    return REPO_ROOT / active, TEMPLATE_ROOT / active


def test_bug0034_matrix_row_autonomy_resolvable():
    row = _matrix_row()
    assert row["stop_class"] == "autonomy_resolvable"
    assert row["code"] == CODE


def test_bug0034_disambiguate_state_only_no_auto_refresh():
    row = _matrix_row()
    assert row["auto_repair_kind"] == KIND
    assert row["auto_repair_kind"] != "auto_refresh_brief"
    with pytest.raises(ledger.RepairCapResolutionError):
        ledger.resolve_matrix_repair(CODE, "auto_refresh_brief")


def test_bug0034_matrix_cap_three_and_rationale():
    row = _matrix_row()
    assert row["cap"] == 3
    assert row["rationale"] == RATIONALE


def test_bug0034_operator_matrix_active_template_parity():
    active, template = _pair("docs/engineering/autonomy-stop-matrix.md")
    assert active.read_bytes() == template.read_bytes()
    text = active.read_text(encoding="utf-8")
    assert "## Autonomy-resolvable gates (10 codes)" in text
    assert CODE in text and KIND in text


def test_bug0034_reason_code_active_template_parity():
    active, template = _pair("docs/engineering/reason_codes.md")
    assert active.read_bytes() == template.read_bytes()
    text = active.read_text(encoding="utf-8")
    assert "BUG-0034 / US-0119" in text
    assert CODE in text and "matrix cap `3`" in text


def test_bug0034_runbook_no_refresh_active_template_parity():
    active, template = _pair("docs/engineering/runbook.md")
    assert active.read_bytes() == template.read_bytes()
    text = active.read_text(encoding="utf-8")
    for required in (
        CODE,
        "Never refresh a brief",
        "fall back to state evidence",
        "reconcile",
        "hand-edit",
        "fresh authorized child",
        "RESUME_BRIEF_AUTO_REFRESH=0",
    ):
        assert required in text


def test_bug0034_ledger_matrix_cap_override_audit_and_success_breadcrumb(tmp_path, monkeypatch):
    monkeypatch.setattr(ledger, "LEDGER_DIR", tmp_path)
    run = "bug0034-ledger-default"
    failed = ledger.attempt_repair(run, CODE, KIND, False, Path("negative-evidence"))
    assert failed["effective_cap"] == 3 and failed["cap_source"] == "matrix"
    assert failed["breadcrumb"] == ""
    ledger.attempt_repair(run, CODE, KIND, False)
    exhausted = ledger.attempt_repair(run, CODE, KIND, False)
    assert exhausted["capped"] is True
    assert exhausted["terminal_stop"] == "AUTONOMY_REPAIR_CAP_EXHAUSTED"
    assert len(ledger.read_ledger(run)) == 3
    blocked = ledger.attempt_repair(run, CODE, KIND, True)
    assert blocked["outcome"] == "not_attempted" and blocked["breadcrumb"] == ""
    override_run = "bug0034-ledger-override"
    success = ledger.attempt_repair(
        override_run,
        CODE,
        KIND,
        True,
        Path("unique-validated-state"),
        cap_override=4,
        override_authorized=True,
    )
    assert success["effective_cap"] == 4
    assert success["cap_source"] == "authorized_override"
    assert success["breadcrumb"] == f"autonomy_relaxed: {CODE} -> {KIND}"
    entry = ledger.read_ledger(override_run)[0]
    assert entry["reason_code"] == CODE and entry["auto_repair_kind"] == KIND
    assert entry["effective_cap"] == 4 and entry["cap_source"] == "authorized_override"
    with pytest.raises(ledger.RepairCapResolutionError):
        ledger.resolve_effective_cap(CODE, KIND, cap_override=4, override_authorized=False)
    with pytest.raises(ledger.RepairCapResolutionError):
        ledger.resolve_effective_cap(CODE, KIND, cap_override=0, override_authorized=True)


def test_bug0034_negative_pair_codes_and_compose_invariants():
    row = _matrix_row()
    matrix = parse_yaml_matrix(REPO_ROOT / "scripts" / "data" / "autonomy_stop_matrix.yaml")
    codes = {entry["code"]: entry for entry in matrix["reason_codes"]}
    assert codes["RESUME_AMBIGUOUS"]["stop_class"] == "security_hard"
    assert codes["RESUME_BRIEF_STALE"]["stop_class"] == "security_hard"
    runbook = (REPO_ROOT / "docs" / "engineering" / "runbook.md").read_text(encoding="utf-8")
    for code in ("RESUME_AMBIGUOUS", "RESUME_BRIEF_UNPARSEABLE", "RESUME_BRIEF_STALE"):
        assert code in runbook
    validator = subprocess.run(
        [sys.executable, "scripts/validate_autonomy_stop_matrix.py", "--self-test"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    # Five US-0143 security-hard orphan reports pre-date BUG-0034. The new
    # registration must not add an orphan or weaken that carried baseline.
    expected_baseline = {
        "BUDGET_EXHAUSTED",
        "DECISION_UNRESOLVED",
        "KERNEL_INCOMPATIBLE",
        "QUALITY_EVIDENCE_FAILED",
        "RESUME_AMBIGUOUS",
    }
    assert validator.returncode == 1
    assert {line.rsplit(": ", 1)[-1] for line in validator.stderr.splitlines() if "US-0119 surface:" in line} == expected_baseline
    assert CODE not in validator.stderr
    assert row["cap"] == 3
