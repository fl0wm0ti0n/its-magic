"""BUG-0033 thin OpenCode command parity — 10 markers (R-0159 DQ4).

BUG-0033 adds a diagnostics-only `## Stop conditions` + `## Fail-safe reason
codes` pair to exactly five thin OpenCode command bodies (closure/ask/auto/
refresh-context/execute), active + template mirrors byte-identical (DQ3). This
suite proves the fix without a live OpenCode host probe (UAT_PROBE_FORBIDDEN):
the 10 `test_bug0033_*` markers cover AC-1..AC-8 per the R-0159 DQ4 table
(L16290-L16301).

This file is authored for the ACTIVE repo and mirrored byte-identically to
`template/tests/` (DQ3). The twin resolves the active repo root so it can read
the active command bodies + active/template checker regardless of which side
runs it (BUG-0032 twin precedent).

Composes (never modifies) with the US-0125/US-0126 standalone suites; marker 9
guards that BUG-0033 adds no NEWLY-failing us0125/us0126 marker vs the
documented 5-failure pre-existing baseline (R-0159 DQ6.1).
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

import pytest  # noqa: F401  (imported for parity with the suite convention)

# --- active-repo root resolution (active copy OR template twin) -------------
_SELF = Path(__file__).resolve()
# tests/bug0033_*.py            -> _SELF.parent.parent == <repo>
# template/tests/bug0033_*.py   -> _SELF.parent.parent == <repo>/template
if _SELF.parent.parent.name == "template":
    REPO_ROOT = _SELF.parent.parent.parent  # the active repo root
else:
    REPO_ROOT = _SELF.parent.parent

ACTIVE_OPC = REPO_ROOT / ".opencode" / "commands"
TEMPLATE_OPC = REPO_ROOT / "template" / ".opencode" / "commands"
CURSOR_OPC = REPO_ROOT / ".cursor" / "commands"
ACTIVE_TUI = REPO_ROOT / ".opencode" / "tui.json"
TEMPLATE_TUI = REPO_ROOT / "template" / ".opencode" / "tui.json"
REASON_CODES = REPO_ROOT / "docs" / "engineering" / "reason_codes.md"
RUNBOOK = REPO_ROOT / "docs" / "engineering" / "runbook.md"
PARITY_CLI = REPO_ROOT / "scripts" / "check_intake_template_parity.py"
US0125 = REPO_ROOT / "tests" / "us0125_contract_test.py"
US0126 = REPO_ROOT / "tests" / "us0126_contract_test.py"

# The five BUG-0033 parity-target thin command bodies (DQ3 / DQ4).
TARGETS = ("closure", "ask", "auto", "refresh-context", "execute")
# Expected frontmatter `agent:` per target (ask omits agent — agent-agnostic).
EXPECTED_AGENT = {
    "closure": "qa",
    "ask": None,
    "auto": "auto",
    "refresh-context": "curator",
    "execute": "dev",
}

# US-0125 forbidden fragments that must NOT appear in the thin bodies — the
# added sections are diagnostics-only prose (DQ4/DQ7), not validator/policy
# logic. Mirrors US0125's POLICY_TEXT_FRAGMENTS (kept local so the twin stays
# self-contained and needs no cross-test import).
POLICY_TEXT_FRAGMENTS = (
    "INTAKE_REQUIRED_TOPIC_MISSING",
    "INTAKE_REQUIRED_PACK_INCOMPLETE",
    "INTAKE_ASSUMPTION_CONFIRMATION_REQUIRED",
    "INTAKE_PERSISTENCE_BLOCKED",
    "BUG_ISSUE_VALIDATION_FAILED",
    "topic_coverage",
    "assumption_confirmation_ref",
    "asked_topics",
    "missing_topics",
    "assumptions_confirmed",
)
# Enforcement / dispatch literals that must NOT be owned by the thin bodies
# (US-0125 AC-6/AC-8 + DQ4: diagnostics only, enforcement in Python).
FORBIDDEN_DISPATCH_TOKENS = (
    "ctx.session.create",
    "Session.create",
    "OPENCODE_VALIDATOR_FAILED",
    "OPENCODE_DRIVER_INVOKE_FAILED",
    "npm install",
    "require(",
)

# Documented pre-existing us0125/us0126 red baseline (R-0159 DQ6.1). The set of
# failing markers after BUG-0033 must be a SUBSET of this — i.e. BUG-0033 adds
# no NEWLY-failing marker. None of these five failures is caused by BUG-0033.
US0125_US0126_RED_BASELINE = frozenset(
    {
        "test_us0125_command_inventory",
        "test_us0125_clone_guard",
        "test_us0125_missing_command_does_not_disable_plugin",
        "test_us0125_auto_command_dispatch_only",
        "test_us0126_default_host_reminder",
    }
)


def _strip_frontmatter(text: str) -> str:
    """Strip the leading YAML frontmatter block (between --- fences)."""
    if not text.startswith("---"):
        return text
    lines = text.splitlines()
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return "\n".join(lines[i + 1:])
    return text


def _frontmatter_agent(text: str) -> str | None:
    """Return the `agent:` frontmatter value, or None when absent (/ask)."""
    if not text.startswith("---"):
        return None
    lines = text.splitlines()
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            break
        m = re.match(r"^agent:\s*(\S+)\s*$", lines[i])
        if m:
            return m.group(1)
    return None


def _target_sections(text: str) -> list[str]:
    """Return the bodies of the `## Stop conditions` and `## Fail-safe reason
    codes` sections (the DQ1/DQ2 diagnostics-only pair) from a thin body."""
    body = _strip_frontmatter(text)
    return re.findall(
        r"(?:## Stop conditions|## Fail-safe reason codes)\n(.*?)(?=\n## |\Z)",
        body,
        re.S,
    )


def _assert_both_headings(name: str) -> None:
    """Both headings present in active + template, Stop-conditions first."""
    for side, d in (("active", ACTIVE_OPC), ("template", TEMPLATE_OPC)):
        path = d / f"{name}.md"
        assert path.is_file(), f"{side}/{name}.md missing"
        text = path.read_text(encoding="utf-8")
        i_stop = text.find("## Stop conditions")
        i_fs = text.find("## Fail-safe reason codes")
        assert i_stop != -1, f"{side}/{name}.md missing '## Stop conditions'"
        assert i_fs != -1, f"{side}/{name}.md missing '## Fail-safe reason codes'"
        assert i_stop < i_fs, (
            f"{side}/{name}.md: '## Stop conditions' must precede "
            f"'## Fail-safe reason codes' (DQ2 ordering)"
        )


# -- marker 1 ----------------------------------------------------------------


def test_bug0033_closure_has_both_headings():
    """m1 (AC-1): active + template closure.md each carry both headings."""
    _assert_both_headings("closure")


# -- marker 2 ----------------------------------------------------------------


def test_bug0033_ask_has_both_headings():
    """m2 (AC-2): active + template ask.md each carry both headings."""
    _assert_both_headings("ask")


# -- marker 3 ----------------------------------------------------------------


def test_bug0033_auto_has_both_headings():
    """m3 (AC-3): active + template auto.md each carry both headings."""
    _assert_both_headings("auto")


# -- marker 4 ----------------------------------------------------------------


def test_bug0033_refresh_context_has_both_headings():
    """m4 (AC-4): active + template refresh-context.md each carry both headings."""
    _assert_both_headings("refresh-context")


# -- marker 5 ----------------------------------------------------------------


def test_bug0033_execute_has_both_headings():
    """m5 (AC-5): active + template execute.md each carry both headings."""
    _assert_both_headings("execute")


# -- marker 6 ----------------------------------------------------------------


def test_bug0033_active_template_byte_parity():
    """m6 (AC-6): for each of the 5 pairs, active.read_bytes() == template.read_bytes()."""
    for name in TARGETS:
        a = (ACTIVE_OPC / f"{name}.md").read_bytes()
        t = (TEMPLATE_OPC / f"{name}.md").read_bytes()
        assert a == t, (
            f"{name}.md active<->template byte-parity broken ({len(a)}b vs {len(t)}b)"
        )


# -- marker 7 ----------------------------------------------------------------


def test_bug0033_parity_scope_bug0033_green():
    """m7 (AC-6/AC-7): `check_intake_template_parity.py --scope=bug-0033` ->
    exit 0 + `[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033` banner."""
    proc = subprocess.run(
        [sys.executable, str(PARITY_CLI), "--scope=bug-0033", "--repo", str(REPO_ROOT)],
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
        check=False,
    )
    assert proc.returncode == 0, (
        f"--scope=bug-0033 failed rc={proc.returncode}: "
        f"stdout={proc.stdout!r} stderr={proc.stderr!r}"
    )
    assert "[INTAKE_TEMPLATE_PARITY_OK] scope=bug-0033" in proc.stdout, (
        f"OK banner missing from --scope=bug-0033: {proc.stdout!r}"
    )


# -- marker 8 ----------------------------------------------------------------


def test_bug0033_thin_dispatch_only_preserved():
    """m8 (AC-7): none of the 5 files (active + template) carry a spawn literal,
    a POLICY fragment, an enforcement wrapper, npm/require; frontmatter `agent:`
    preserved per target."""
    for name in TARGETS:
        for side, d in (("active", ACTIVE_OPC), ("template", TEMPLATE_OPC)):
            text = (d / f"{name}.md").read_text(encoding="utf-8")
            body = _strip_frontmatter(text)
            for frag in FORBIDDEN_DISPATCH_TOKENS:
                assert frag not in text, f"{side}/{name}.md contains forbidden {frag!r}"
            for frag in POLICY_TEXT_FRAGMENTS:
                assert frag not in text, f"{side}/{name}.md contains POLICY fragment {frag!r}"
            assert not re.search(r"\bspawn\s*[(=]", body), (
                f"{side}/{name}.md contains spawn-call logic (dispatch-only per DQ5)"
            )
            agent = _frontmatter_agent(text)
            assert agent == EXPECTED_AGENT[name], (
                f"{side}/{name}.md agent frontmatter {agent!r} != {EXPECTED_AGENT[name]!r}"
            )


# -- marker 9 ----------------------------------------------------------------


def test_bug0033_us0125_us0126_no_regression():
    """m9 (AC-7): the us0125 + us0126 failing-marker set is a SUBSET of the
    documented pre-existing 5-failure baseline (no NEWLY-failing marker); the
    `.opencode/tui.json` `"plugin": []` lock (BUG-0030/DEC-0151) holds active +
    template."""
    proc = subprocess.run(
        [sys.executable, "-m", "pytest", str(US0125), str(US0126), "-q", "--tb=no"],
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
        check=False,
    )
    failing = set(re.findall(r"FAILED\s+\S+::(test_\w+)", proc.stdout))
    newly = failing - US0125_US0126_RED_BASELINE
    assert not newly, (
        f"NEWLY-failing us0125/us0126 markers (BUG-0033 regression): {sorted(newly)}; "
        f"full failing set: {sorted(failing)}"
    )
    for side, path in (("active", ACTIVE_TUI), ("template", TEMPLATE_TUI)):
        assert path.is_file(), f"{side} tui.json missing"
        txt = path.read_text(encoding="utf-8")
        assert '"plugin": []' in txt or '"plugin":[]' in txt, (
            f"{side}/tui.json 'plugin': [] lock broken (BUG-0030/DEC-0151)"
        )


# -- marker 10 ----------------------------------------------------------------


def test_bug0033_zero_new_reason_codes():
    """m10 (non-goal DQ5): every fail-closed token cited in the five thin
    `## Stop conditions` / `## Fail-safe reason codes` sections is already
    present in reason_codes.md OR runbook.md OR its rich .cursor/commands/*
    source — no new code string was introduced."""
    rc = REASON_CODES.read_text(encoding="utf-8")
    rb = RUNBOOK.read_text(encoding="utf-8")
    tok_re = re.compile("`([A-Za-z0-9_]+)`")
    checked = 0
    for name in TARGETS:
        active = (ACTIVE_OPC / f"{name}.md").read_text(encoding="utf-8")
        rich_path = CURSOR_OPC / f"{name}.md"
        rich = rich_path.read_text(encoding="utf-8") if rich_path.exists() else ""
        for section in _target_sections(active):
            for tok in tok_re.findall(section):
                checked += 1
                assert tok in rc or tok in rb or tok in rich, (
                    f"{name}.md: NEW reason code {tok!r} not in "
                    f"reason_codes.md / runbook.md / rich source"
                )
    assert checked >= 1, "no reason-code tokens found — section parse failed"


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-q"]))
