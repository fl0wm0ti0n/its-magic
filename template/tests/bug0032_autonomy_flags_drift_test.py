"""BUG-0032 — AUTONOMY_FLAGS_DRIFT declared-mirror drift-detect (S0166).

R-0156 DQ3 inventory — exactly EIGHT `test_bug0032_*` markers.  The
`--scope=autonomy-flags` semantic scope compares the two autonomy keys
(`AUTONOMY_PRESET` then `AUTONOMY_STOP_POLICY`) between the baseline
(`.its-magic/config.json` JSONC `shared`) and the live surface
(`.cursor/scratchpad.md` `KEY=VALUE`).  Drift-DETECT only, NOT drift-FIX.

Fixture/mock only — no live host probe (UAT_PROBE_FORBIDDEN held).  `--repo`
redirects BOTH inputs so the real baseline/live sources are never touched by the
tests (marker 7 asserts no source mutation).

This file is authored for the ACTIVE repo and mirrored byte-identically to
`template/tests/`.  The twin resolves the active repo root so it can read the
active fixtures + active/template checker regardless of which side runs it.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import pytest  # noqa: F401  (imported for parity with the suite convention)

# --- active-repo root resolution (active copy OR template twin) -------------
_SELF = Path(__file__).resolve()
# tests/bug0032_*.py            -> _SELF.parent.parent == <repo>
# template/tests/bug0032_*.py   -> _SELF.parent.parent == <repo>/template
if _SELF.parent.parent.name == "template":
    REPO_ROOT = _SELF.parent.parent.parent  # the active repo root
else:
    REPO_ROOT = _SELF.parent.parent

SCRIPTS = REPO_ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

import check_intake_template_parity as ctp  # noqa: E402

FIXTURES = REPO_ROOT / "tests" / "fixtures" / "bug0032_autonomy_flags"
CHECKER_ACTIVE = REPO_ROOT / "scripts" / "check_intake_template_parity.py"
CHECKER_TEMPLATE = REPO_ROOT / "template" / "scripts" / "check_intake_template_parity.py"

_OK_BANNER = "[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags"
_DRIFT = "[AUTONOMY_FLAGS_DRIFT] scope=autonomy-flags"


def _run(repo: Path) -> "subprocess.CompletedProcess[str]":
    return subprocess.run(
        [sys.executable, str(CHECKER_ACTIVE), "--scope=autonomy-flags",
         "--repo", str(repo)],
        capture_output=True, text=True,
    )


def _drift_lines(proc) -> list[str]:
    return [ln for ln in proc.stdout.splitlines() if ln.startswith("[AUTONOMY_FLAGS_DRIFT]")]


# --------------------------------------------------------------------------- #
# marker 1 — scope registration + active/template checker byte parity          #
# --------------------------------------------------------------------------- #
def test_bug0032_scope_registration_parity():
    """R-0156 DQ3(1): the semantic scope is registered and the checker is
    byte-parity identical between active and template."""
    assert ctp.AUTONOMY_FLAGS_SCOPE == "autonomy-flags"
    assert "autonomy-flags" in ctp.SCOPES
    assert ctp.AUTONOMY_FLAGS_KEYS == ("AUTONOMY_PRESET", "AUTONOMY_STOP_POLICY")
    # The handlers exist and the fixed key order is PRESET-first.
    assert callable(ctp.check_autonomy_flags)
    assert ctp.AUTONOMY_FLAGS_KEYS[0] == "AUTONOMY_PRESET"
    assert ctp.AUTONOMY_FLAGS_KEYS[1] == "AUTONOMY_STOP_POLICY"
    # Active/template checker byte parity (US-0017-class guard).
    assert CHECKER_ACTIVE.is_file(), "active checker missing"
    assert CHECKER_TEMPLATE.is_file(), "template checker missing"
    assert CHECKER_ACTIVE.read_bytes() == CHECKER_TEMPLATE.read_bytes(), \
        "active + template check_intake_template_parity.py must be byte-identical"


# --------------------------------------------------------------------------- #
# marker 2 — equal fixture -> exit 0 + exact banner                            #
# --------------------------------------------------------------------------- #
def test_bug0032_equal_fixture_exit0():
    """R-0156 DQ3(2) / AC-2: identity fixture -> exit 0 + exact banner."""
    rep = _run(FIXTURES / "identity")
    assert rep.returncode == 0, f"identity fixture must exit 0, got {rep.returncode}\n{rep.stdout}\n{rep.stderr}"
    assert _OK_BANNER in rep.stdout, f"exact banner missing: {rep.stdout!r}"
    assert _DRIFT not in rep.stdout


# --------------------------------------------------------------------------- #
# marker 3 — preset-only drift -> exit 1                                       #
# --------------------------------------------------------------------------- #
def test_bug0032_preset_only_drift_exit1():
    """R-0156 DQ3(3) / AC-2: AUTONOMY_PRESET-only drift -> exit 1, no banner."""
    rep = _run(FIXTURES / "preset-drift")
    assert rep.returncode == 1, f"preset-only drift must exit 1, got {rep.returncode}\n{rep.stdout}"
    assert _OK_BANNER not in rep.stdout
    lines = _drift_lines(rep)
    assert len(lines) == 1, f"exactly one affected key expected, got {lines}"
    assert "key=AUTONOMY_PRESET" in lines[0]
    assert "config=full" in lines[0]
    assert "scratchpad=none" in lines[0]
    assert "AUTONOMY_STOP_POLICY" not in lines[0], "policy key must NOT be reported on preset-only drift"


# --------------------------------------------------------------------------- #
# marker 4 — policy-only drift -> exit 1                                       #
# --------------------------------------------------------------------------- #
def test_bug0032_policy_only_drift_exit1():
    """R-0156 DQ3(4) / AC-2: AUTONOMY_STOP_POLICY-only drift -> exit 1, no banner."""
    rep = _run(FIXTURES / "policy-drift")
    assert rep.returncode == 1, f"policy-only drift must exit 1, got {rep.returncode}\n{rep.stdout}"
    assert _OK_BANNER not in rep.stdout
    lines = _drift_lines(rep)
    assert len(lines) == 1, f"exactly one affected key expected, got {lines}"
    assert "key=AUTONOMY_STOP_POLICY" in lines[0]
    assert "AUTONOMY_PRESET" not in lines[0], "preset key must NOT be reported on policy-only drift"


# --------------------------------------------------------------------------- #
# marker 5 — two-key deterministic fixed order                                 #
# --------------------------------------------------------------------------- #
def test_bug0032_two_key_deterministic_order():
    """R-0156 DQ3(5): both keys drift -> exactly two lines, PRESET before POLICY."""
    rep = _run(FIXTURES / "two-key-drift")
    assert rep.returncode == 1
    assert _OK_BANNER not in rep.stdout
    lines = _drift_lines(rep)
    assert len(lines) == 2, f"two affected keys expected, got {lines}"
    assert "key=AUTONOMY_PRESET" in lines[0], f"PRESET must come first, got {lines[0]}"
    assert "key=AUTONOMY_STOP_POLICY" in lines[1], f"POLICY must come second, got {lines[1]}"


# --------------------------------------------------------------------------- #
# marker 6 — malformed / missing / duplicate -> fail-closed exit 1             #
# --------------------------------------------------------------------------- #
def test_bug0032_malformed_fail_closed():
    """R-0156 DQ3(6): duplicate / missing / unparseable all fail closed (exit 1)."""
    for name in ("malformed-duplicate", "malformed-missing", "malformed-unparseable"):
        rep = _run(FIXTURES / name)
        assert rep.returncode == 1, f"{name} must fail closed (exit 1), got {rep.returncode}\n{rep.stdout}"
        assert _OK_BANNER not in rep.stdout, f"{name}: no success banner allowed"
        assert _drift_lines(rep), f"{name}: at least one fixed-order drift line required"
        # Fixed order: any reported preset line must precede any policy line.
        keys = [ln for ln in _drift_lines(rep)]
        idx_preset = [i for i, ln in enumerate(keys) if "key=AUTONOMY_PRESET" in ln]
        idx_policy = [i for i, ln in enumerate(keys) if "key=AUTONOMY_STOP_POLICY" in ln]
        if idx_preset and idx_policy:
            assert min(idx_preset) == 0 and min(idx_policy) == 1, f"{name}: fixed key order violated"
    # Duplicate: the duplicated scratchpad key is reported as <missing> (unevaluable).
    dup = _run(FIXTURES / "malformed-duplicate")
    assert any("<missing>" in ln and "key=AUTONOMY_PRESET" in ln for ln in _drift_lines(dup))


# --------------------------------------------------------------------------- #
# marker 7 — --repo fixture isolation / no source mutation                     #
# --------------------------------------------------------------------------- #
def test_bug0032_repo_fixture_isolation():
    """R-0156 DQ3(7): --repo redirects both inputs; the real sources are untouched."""
    active_config = REPO_ROOT / ".its-magic" / "config.json"
    active_scratch = REPO_ROOT / ".cursor" / "scratchpad.md"
    # Guard on real-repo bytes (read-only) before/after every fixture run.
    before = {
        "config": active_config.read_bytes() if active_config.is_file() else b"",
        "scratch": active_scratch.read_bytes() if active_scratch.is_file() else b"",
    }
    for name in ("identity", "preset-drift", "policy-drift",
                 "two-key-drift", "malformed-duplicate", "malformed-unparseable"):
        # The scope MUST read the fixture (not the real repo): identity fixture exits 0
        # even when the real repo is drifted — proving --repo redirected both inputs.
        rep = _run(FIXTURES / name)
        if name == "identity":
            assert rep.returncode == 0, "identity fixture must exit 0 under --repo isolation"
            assert _OK_BANNER in rep.stdout
        # No source mutation.
        assert active_config.exists() is before["config"] != b"" or active_config.is_file()
        after = {
            "config": active_config.read_bytes() if active_config.is_file() else b"",
            "scratch": active_scratch.read_bytes() if active_scratch.is_file() else b"",
        }
        assert after == before, "--repo fixture runs must not mutate the real baseline/live sources"


# --------------------------------------------------------------------------- #
# marker 8 — US-0119 `none` + security-hard invariants (compose guard)         #
# --------------------------------------------------------------------------- #
def test_bug0032_us0119_security_invariants():
    """R-0156 DQ3(8): BUG-0032 does not touch US-0119 / stop-matrix / intake gates."""
    from autonomy_preset_lib import expand_autonomy_preset  # noqa: E402
    from validate_autonomy_stop_matrix import parse_yaml_matrix  # noqa: E402

    # AC-4: AUTONOMY_PRESET=none is byte-identical pre-US-0119 (empty expansion).
    assert expand_autonomy_preset("none") == {}

    # 12 per-feature flags intact on `full`.
    full = expand_autonomy_preset("full")
    assert len(full) == 12, f"full preset MUST expand to 12 flags, got {len(full)}"

    # security_hard rows retain auto_repair_kind=n/a (BUG-0032 must not alter the matrix).
    yaml_path = REPO_ROOT / "scripts" / "data" / "autonomy_stop_matrix.yaml"
    matrix = parse_yaml_matrix(yaml_path)
    hard = [e for e in matrix.get("reason_codes", []) if e.get("stop_class") == "security_hard"]
    assert hard, "expected at least one security_hard row in the stop matrix"
    for entry in hard:
        assert entry.get("auto_repair_kind") == "n/a", \
            f"security_hard code {entry.get('code')} MUST keep auto_repair_kind=n/a"

    # AUTONOMY_FLAGS_DRIFT must NOT be an autonomy_resolvable stop-matrix code
    # (BUG-0034 owns that registration; R-0156 DQ2 forbids it here).
    codes = {e.get("code") for e in matrix.get("reason_codes", [])}
    assert "AUTONOMY_FLAGS_DRIFT" not in codes, \
        "AUTONOMY_FLAGS_DRIFT must NOT be registered in the stop matrix (BUG-0034 owns it)"

    # AC-5: intake autonomy gates unchanged (real config).
    cfg_map, errored = ctp._config_shared_values(REPO_ROOT / ".its-magic" / "config.json")
    assert not errored, "real config.json must be readable for the intake-gate invariant"
    assert cfg_map.get("INTAKE_AUTONOMY_MODE") == "0", "INTAKE_AUTONOMY_MODE must remain 0 (AC-5)"
    assert cfg_map.get("INTAKE_SUBAGENT_FALLBACK") == "deny", \
        "INTAKE_SUBAGENT_FALLBACK must remain deny (AC-5)"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
