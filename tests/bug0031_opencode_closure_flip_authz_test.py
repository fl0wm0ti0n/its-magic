"""BUG-0031 OpenCode `/closure` flip-path authorization — 8 markers (DQ9).

Markers per docs/engineering/architecture.md `# BUG-0031` / R-0155 DQ9 /
sprints/S0164/tasks.md.  Pure read/parse mock-injection only — NO live OpenCode
host probe (UAT_PROBE_FORBIDDEN).  Composes (never modifies) with `test_bug0027_*`
(10 markers) and `test_bug0016*` (7 markers), both of which must stay green.

The fix under test is an OPENCODE deny-by-default role map: `.opencode/agents/curator.md`
gains three additive `edit:` allows (the canonical DONE-flip paths) so the spawnable
closure role `curator` can perform the /closure flip; the rich Closure-surface
pair gains the fail-closed token `CLOSURE_PERMISSION_FLIP_PATHS_DENIED` + the
DQ6 OpenCode-surface parity note.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]

ACTIVE_CURATOR = REPO_ROOT / ".opencode" / "agents" / "curator.md"
TEMPLATE_CURATOR = REPO_ROOT / "template" / ".opencode" / "agents" / "curator.md"
ACTIVE_QA = REPO_ROOT / ".opencode" / "agents" / "qa.md"
TEMPLATE_QA = REPO_ROOT / "template" / ".opencode" / "agents" / "qa.md"
ACTIVE_CLOSURE = REPO_ROOT / ".cursor" / "commands" / "closure.md"
TEMPLATE_CLOSURE = REPO_ROOT / "template" / ".cursor" / "commands" / "closure.md"
ACTIVE_RUNBOOK = REPO_ROOT / "docs" / "engineering" / "runbook.md"
ACTIVE_REASON_CODES = REPO_ROOT / "docs" / "engineering" / "reason_codes.md"
CURATOR_MDC_ACTIVE = REPO_ROOT / ".cursor" / "agents" / "curator.mdc"
CURATOR_MDC_TEMPLATE = REPO_ROOT / "template" / ".cursor" / "agents" / "curator.mdc"

# The three canonical DONE-flip paths added to curator (backlog, acceptance, closure-verification).
FLIP_PATHS = (
    "docs/product/backlog.md",
    "docs/product/acceptance.md",
    "sprints/S*/closure-verification.md",
)
# The 4th canonical flip path (state.md) already held by curator (DQ4 — no redundant allow).
STATE_PATH = "docs/engineering/state.md"

TOKEN = "CLOSURE_PERMISSION_FLIP_PATHS_DENIED"
# The existing seven CLOSURE_* family codes the new token composes with (must not be renamed/replaced).
EXISTING_CLOSURE_CODES = (
    "CLOSURE_RELEASE_EVIDENCE_MISSING",
    "CLOSURE_VERIFICATION_FAILED",
    "CANONICAL_STATUS_CONFLICT",
    "BACKLOG_STATUS_DRIFT",
    "PHASE_OWNERSHIP_VIOLATION",
    "PHASE_OVERRIDE_EVIDENCE_MISSING",
    "CLOSURE_LEGACY_DRIFT",
)


def _parse_map(text: str, section: str) -> dict:
    """Parse a flat 'key: value' indented YAML mapping under a `section:` key.

    Deliberately minimal (no external deps): locates the `section:` line, records its
    indentation, then collects the scalar `key: value` pairs indented exactly one level
    deeper (section_indent + 2).  Sufficient for the deny-by-default `permission:` ->
    `edit:` role maps; robust to CRLF / LF and to the 2-space-per-level indent used here
    (edit: at indent 2, path rows at indent 4).
    """
    lines = text.replace("\r\n", "\n").split("\n")
    out: dict[str, str] = {}
    section_indent: int | None = None
    for line in lines:
        stripped = line.strip()
        if section_indent is None:
            if stripped == f"{section}:" and not line[:2].strip():
                # top-level section key (allow any indent, but record its exact indent)
                section_indent = len(line) - len(line.lstrip(" "))
            continue
        if not stripped:
            continue
        indent = len(line) - len(line.lstrip(" "))
        # Left the section once we meet content at/less than the section indent (non-blank).
        if indent <= section_indent:
            break
        child_indent = section_indent + 2
        if indent == child_indent and ":" in stripped:
            key_part, _, val_part = stripped.partition(":")
            key = key_part.strip().strip('"').strip("'")
            val = val_part.strip().strip('"').strip("'")
            if val:
                out[key] = val
    return out


def _run_pytest(suite_path: Path) -> int:
    """Run a compose suite in an isolated subprocess; return its exit code (0 == green)."""
    proc = subprocess.run(
        [sys.executable, "-m", "pytest", str(suite_path), "-q", "-p", "no:cacheprovider"],
        check=False,
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )
    return proc.returncode


# -- marker 1 ----------------------------------------------------------------


def test_bug0031_curator_flip_paths_present_active():
    """m1: active curator edit: allow set holds all four flip paths; deny-first; bash/task unchanged."""
    text = ACTIVE_CURATOR.read_text(encoding="utf-8")
    edit = _parse_map(text, "edit")

    # DQ2: all four canonical flip paths are allowed (3 new + state.md already held).
    for p in FLIP_PATHS:
        assert edit.get(p) == "allow", f"active curator missing flip-path allow: {p}"
    assert edit.get(STATE_PATH) == "allow", "active curator missing state.md allow (DQ4)"

    # DQ3: DENY-FIRST — the broad deny must be the first edit: row, preceding every allow.
    assert edit.get("**") == "deny", "active curator broad '**' deny missing"
    keys_order = [k for k, v in _parse_map(text, "edit").items()]
    deny_pos = text.index('"**": deny')
    for p in FLIP_PATHS + (STATE_PATH,):
        assert deny_pos < text.index(f'"{p}": allow'), f'"**": deny must precede {p}'

    # DQ3: bash: ask / task: deny unchanged (the fix is edit-only; G2).
    assert text.rstrip().count("bash: ask") >= 1, "active curator `bash: ask` missing (changed?)"
    assert "task: deny" in text, "active curator `task: deny` missing (changed?)"
    # No 4th flip-path allow beyond the canonical four (G2 — least-privilege).
    allow_keys = {k for k, v in edit.items() if v == "allow" and k not in FLIP_PATHS and k != STATE_PATH}
    assert not (allow_keys & {"sprints/Sxxxx/closure-verification.md"}), (
        f"unexpected concrete-sprint literal allow: {allow_keys}"
    )


# -- marker 2 ----------------------------------------------------------------


def test_bug0031_curator_flip_paths_present_template():
    """m2: same asserts on template/.opencode/agents/curator.md."""
    text = TEMPLATE_CURATOR.read_text(encoding="utf-8")
    edit = _parse_map(text, "edit")
    for p in FLIP_PATHS:
        assert edit.get(p) == "allow", f"template curator missing flip-path allow: {p}"
    assert edit.get(STATE_PATH) == "allow", "template curator missing state.md allow (DQ4)"
    assert edit.get("**") == "deny", "template curator broad '**' deny missing"
    deny_pos = text.index('"**": deny')
    for p in FLIP_PATHS + (STATE_PATH,):
        assert deny_pos < text.index(f'"{p}": allow'), f'"**": deny must precede {p}'
    assert "bash: ask" in text and "task: deny" in text, "template bash/task changed (G2)"


# -- marker 3 ----------------------------------------------------------------


def test_bug0031_curator_active_template_byte_parity():
    """m3: active and template curator role files are byte-identical (US-0017 parity)."""
    assert ACTIVE_CURATOR.is_file(), "active curator role file missing"
    assert TEMPLATE_CURATOR.is_file(), "template curator role file missing"
    a = ACTIVE_CURATOR.read_bytes()
    t = TEMPLATE_CURATOR.read_bytes()
    assert a == t, f"curator active<->template byte-parity broken ({len(a)}b vs {len(t)}b)"


# -- marker 4 ----------------------------------------------------------------


def test_bug0031_qa_flip_paths_denied():
    """m4: qa (active + template) does NOT hold any of the 3 flip paths (least-privilege, DQ7)."""
    for path in (ACTIVE_QA, TEMPLATE_QA):
        assert path.is_file(), f"{path} missing"
        text = path.read_text(encoding="utf-8")
        edit = _parse_map(text, "edit")
        allow_keys = {k for k, v in edit.items() if v == "allow"}
        for p in FLIP_PATHS:
            assert p not in allow_keys, f"{path.name} must NOT be granted flip path {p} (DQ7/G3)"


# -- marker 5 ----------------------------------------------------------------


def test_bug0031_deny_before_allow_index():
    """m5: across BOTH curator files, `**`: deny index < each of the 3 new allow indexes (DEC-0152)."""
    for path in (ACTIVE_CURATOR, TEMPLATE_CURATOR):
        text = path.read_text(encoding="utf-8")
        deny_idx = text.find('"**": deny')
        assert deny_idx != -1, f"{path.name}: broad deny not found"
        for p in FLIP_PATHS:
            allow_idx = text.find(f'"{p}": allow')
            assert allow_idx != -1, f"{path.name}: missing flip-path allow {p}"
            assert 0 <= deny_idx < allow_idx, (
                f"{path.name}: '**' deny (idx {deny_idx}) must precede {p} (idx {allow_idx})"
            )


# -- marker 6 ----------------------------------------------------------------


def test_bug0031_sprint_wildcard_shape():
    """m6: the closure-verification allow is the literal `sprints/S*` glob; no concrete-sprint literal."""
    for path in (ACTIVE_CURATOR, TEMPLATE_CURATOR):
        text = path.read_text(encoding="utf-8")
        assert '"sprints/S*/closure-verification.md": allow' in text, (
            f"{path.name}: missing literal S* wildcard allow"
        )
        # US-0156 drift anti-pattern: a specific-sprint literal must NOT be used in place of S*.
        assert '"sprints/Sxxxx/closure-verification.md": allow' not in text
        assert '"sprints/S0163/' not in text and 'S0[0-9]' not in text


# -- marker 7 ----------------------------------------------------------------


def test_bug0031_fail_closed_diagnostic_token_present():
    """m7: CLOSURE_PERMISSION_FLIP_PATHS_DENIED additively present in rich pair + runbook + reason_codes;
    names the 3 paths + curator + remediation; composes with (does not replace) the 7 CLOSURE_* codes."""
    for path in (ACTIVE_CLOSURE, TEMPLATE_CLOSURE):
        assert path.is_file(), f"{path} missing"
        text = path.read_text(encoding="utf-8")
        assert TOKEN in text, f"{path.name}: missing {TOKEN}"
        for p in FLIP_PATHS:
            assert p in text, f"{path.name}: token should name flip path {p}"
        assert "curator" in text and "curator" in text, f"{path.name}: token should name role curator"
        assert "re-run" in text.lower() or "re-run /closure" in text, f"{path.name}: remediation (re-run) missing"
    # Compose-with (do NOT replace) the existing seven CLOSURE_* codes in the rich pair table.
    active = ACTIVE_CLOSURE.read_text(encoding="utf-8")
    for code in EXISTING_CLOSURE_CODES:
        assert code in active, f"existing CLOSURE_* code {code} was replaced/renamed (G8)"
    # The token is registered in the runbook troubleshooting table AND the reason-codes index.
    rb = ACTIVE_RUNBOOK.read_text(encoding="utf-8")
    assert TOKEN in rb, "runbook.md: missing CLOSURE_PERMISSION_FLIP_PATHS_DENIED registration"
    rc = ACTIVE_REASON_CODES.read_text(encoding="utf-8")
    assert TOKEN in rc, "reason_codes.md: missing CLOSURE_PERMISSION_FLIP_PATHS_DENIED registration"


# -- marker 8 ----------------------------------------------------------------


def test_bug0031_no_sibling_mutation():
    """m8: compose suites stay green unmodified; acceptance rows at post-closure state;
    curator.mdc (no permission block) byte-identical and untouched by this change (DQ10 + DQ7 + G7)."""
    # Compose suites must still PASS unmodified (BUG-0027 manual phase persist + BUG-0016 baseline).
    rc27 = _run_pytest(REPO_ROOT / "tests" / "bug0027_opencode_manual_phase_persist_test.py")
    assert rc27 == 0, "test_bug0027_* regression suite FAILED (sibling mutation) — must stay green"
    rc16 = _run_pytest(REPO_ROOT / "tests" / "bug0016_contract_test.py")
    assert rc16 == 0, "test_bug0016* regression suite FAILED (sibling mutation) — must stay green"

    # Sibling story/bug statuses at post-closure state (S0162/S0163/S0164 closures performed the flips).
    backlog = (REPO_ROOT / "docs" / "product" / "backlog.md").read_text(encoding="utf-8")
    acceptance = (REPO_ROOT / "docs" / "product" / "acceptance.md").read_text(encoding="utf-8")
    # BUG-0031 backlog status closed at S0164 closure.
    import re as _re
    bug31_block = _re.search(r"### BUG-0031[^\n]*\n(.*?)(?=\n### |\n## )", backlog, _re.S)
    assert bug31_block is not None, "backlog ### BUG-0031 block not found"
    assert "Status: DONE" in bug31_block.group(1), "BUG-0031 status must be DONE (closed at S0164 closure)"
    # US-0156 acceptance row ticked (closed at S0162 closure).
    assert "- [x] US-0156:" in acceptance, "US-0156 acceptance row must be ticked (closed at S0162 closure)"
    # BUG-0022 acceptance row ticked (closed at S0163 closure).
    assert "- [x] BUG-0022:" in acceptance, "BUG-0022 acceptance row must be ticked (closed at S0163 closure)"

    # .cursor/agents/curator.mdc: distinct Cursor role surface, NO permission: block, active↔template
    # byte-identical and untouched by this change (G7).
    mdc_a = CURATOR_MDC_ACTIVE.read_bytes()
    mdc_t = CURATOR_MDC_TEMPLATE.read_bytes()
    assert mdc_a == mdc_t, "curator.mdc active<->template byte-parity broken"
    assert b"permission:" not in mdc_a, "curator.mdc must NOT carry a permission: block (G7)"
