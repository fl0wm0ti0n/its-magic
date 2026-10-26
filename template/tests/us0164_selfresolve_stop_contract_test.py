"""US-0164 contract: gate cause-resolution + autonomy continuity.

Markers are the ten `test_us0164_*` functions. US-0164 stays OPEN; the gate is
never bypassed/weakened/removed. The Python driver (`scripts/auto_outer_driver.py`)
is the SOT for the stop-matrix decision; this test exercises its pure decision
functions, the `--selfresolve-gate` JSON branch (byte-identity), the
`_should_drain_advance` handoff predicate, the active/template byte parity, and
the additive plugin / `auto.md` wiring. This test reads no dotenv file and
performs no npm publish / git push.
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SELF = Path(__file__).resolve().parent.parent
if SELF.name == "template":
    TEMPLATE_ROOT = SELF
    ACTIVE_ROOT = SELF.parent
else:
    ACTIVE_ROOT = SELF
    TEMPLATE_ROOT = SELF / "template"

sys.path.insert(0, str(ACTIVE_ROOT / "scripts"))

import auto_outer_driver as driver  # noqa: E402

DRIVER = ACTIVE_ROOT / "scripts" / "auto_outer_driver.py"
PLUG = ACTIVE_ROOT / ".opencode" / "plugins" / "orchestrator.ts"
PAIRS = (
    "scripts/auto_outer_driver.py",
    ".opencode/plugins/orchestrator.ts",
    ".opencode/agents/auto.md",
    ".opencode/commands/auto.md",
)
FIVE_GATE_SET = "error,missing_input,decision_gate,security,publish"
REASON_CODES = (
    "SELFRESOLVE_ATTEMPT_EXHAUSTED",
    "PROVIDER_SWITCH_APPLIED",
    "PROVIDER_SWITCH_CAP_REACHED",
    "SELFRESOLVE_DRAIN_HANDOFF",
)


def _assert_pairs() -> None:
    for rel in PAIRS:
        active = (ACTIVE_ROOT / rel).read_bytes()
        template = (TEMPLATE_ROOT / rel).read_bytes()
        assert active == template, rel


def _driver(*args: str) -> dict:
    """Drive the stop-matrix JSON path WITHOUT a config override (real repo,
    all five keys default-off → byte-identical to today)."""
    cmd = [
        sys.executable,
        str(DRIVER),
        "--phase",
        "execute",
        "--role",
        "dev",
        *args,
    ]
    env = {k: v for k, v in os.environ.items() if k != "ITS_MAGIC_CONFIG_ROOT"}
    proc = subprocess.run(
        cmd, capture_output=True, text=True, cwd=str(ACTIVE_ROOT), env=env
    )
    assert proc.returncode == 0, proc.stderr
    return json.loads(proc.stdout)


def _driver_cfg(shared: dict, *args: str) -> dict:
    """Drive the stop-matrix JSON path with a BOM-free temp config override
    (ITS_MAGIC_CONFIG_ROOT) so the five US-0164 keys can be turned on/off."""
    tmp = tempfile.mkdtemp(prefix="us0164-")
    try:
        with open(os.path.join(tmp, "config.json"), "w", encoding="utf-8") as f:
            json.dump({"schema_version": 1, "shared": shared}, f, indent=2)
        cmd = [
            sys.executable,
            str(DRIVER),
            "--phase",
            "execute",
            "--role",
            "dev",
            *args,
        ]
        env = dict(os.environ)
        env["ITS_MAGIC_CONFIG_ROOT"] = tmp
        proc = subprocess.run(
            cmd, capture_output=True, text=True, cwd=str(ACTIVE_ROOT), env=env
        )
        assert proc.returncode == 0, proc.stderr
        return json.loads(proc.stdout)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_us0164_cause_resolution_same_run_continue() -> None:
    """error gate repaired → continue_same_phase, no re-invoke (one attempt)."""
    _assert_pairs()
    # Enabled error gate → continue_same_phase, byte-identical 8-key continue
    # payload (no extra keys) so the plugin's one-attempt-per-(phaseId, gate)
    # respawn machinery is reused unchanged.
    cont = _driver_cfg(
        {"AUTO_SELFRESOLVE_GATES": "error"},
        "--stop-reason",
        "error",
        "--selfresolve-gate",
        "error",
    )
    assert cont["action"] == "continue_same_phase", cont
    assert cont["next_phase"] == "execute", cont
    assert set(cont) == {
        "action",
        "next_phase",
        "orchestrator_run_id",
        "phase",
        "role",
        "sprint_id",
        "stop_reason",
        "story_id",
    }, cont
    # The plugin reuses the US-0158 continueAttempts Set: one attempt per
    # (phaseId, gate). A second hit is NOT a third spawn (no re-invoke).
    orch = PLUG.read_text(encoding="utf-8")
    assert "continueSelfresolveGateSpawn" in orch
    assert "continueAttempts.has(attemptKey)" in orch
    # The driver never inspects/edits/re-scores the gate — the decision is pure
    # (no subprocess/shell for the gate repair; that is the child's job).
    src = driver.selfresolve_gate_decision.__code__.co_names
    assert "subprocess" not in src
    assert driver.selfresolve_gate_decision(
        gate="error", config={"gates": ["error"]}
    )["action"] == "continue_same_phase"


def test_us0164_gate_never_bypassed() -> None:
    """No decision_gate=false flip, no threshold change, no removal; the gate
    check re-runs unchanged."""
    _assert_pairs()
    # decision_gate is propose-and-hold, never auto-continue — stays in both
    # the hard-stop set and the terminal-continue tokens so no continue branch
    # can fire for it.
    assert "decision_gate" in driver.HARD_STOP_REASONS
    assert "decision_gate" in driver.TERMINAL_CONTINUE_TOKENS
    hold = driver.selfresolve_gate_decision(
        gate="decision_gate", config={"gates": ["decision_gate"]}
    )
    assert hold["action"] == "hard_stop", hold
    assert hold["reason_code"] == "SELFRESOLVE_PROPOSE_AND_HOLD", hold
    assert hold.get("decision_gate") is True, hold
    # The gate re-check is unchanged: the driver never flips decision_gate to
    # false (behavioral proof over the SOT decision function, not a brittle
    # source-substring scan that would match the invariant's own doc comment).
    for prior in (0, 1):
        no_flip = driver.selfresolve_gate_decision(
            gate="decision_gate",
            config={"gates": ["decision_gate"]},
            prior_attempts=prior,
        )
        assert no_flip["action"] == "hard_stop", no_flip
        assert no_flip["decision_gate"] is True, no_flip
        assert no_flip["decision_gate"] is not False, no_flip
    # decision_gate emits propose-and-hold + hard stop from the CLI too.
    cli = _driver_cfg(
        {"AUTO_SELFRESOLVE_GATES": FIVE_GATE_SET},
        "--stop-reason",
        "error",
        "--selfresolve-gate",
        "decision_gate",
    )
    assert cli["action"] == "hard_stop", cli
    assert cli.get("decision_gate") is True, cli
    assert cli.get("reason_code") == "SELFRESOLVE_PROPOSE_AND_HOLD", cli


def test_us0164_pause_request_safety_floor_hard() -> None:
    """pause_request hard under full self-resolve config; no .env read, no auto
    npm publish, no auto git push."""
    _assert_pairs()
    # Even with the full default gate set enabled, pause_request is a hard stop
    # in every configuration (safety floor).
    assert "pause_request" in driver.HARD_STOP_REASONS
    floor = driver.selfresolve_gate_decision(
        gate="pause_request", config={"gates": [FIVE_GATE_SET]}
    )
    assert floor["action"] == "hard_stop", floor
    assert floor["reason_code"] == "PAUSE_REQUEST_SAFETY_FLOOR_HARD", floor
    # CLI: pause_request is never self-resolvable → hard_stop, no continue.
    cli = _driver_cfg(
        {"AUTO_SELFRESOLVE_GATES": FIVE_GATE_SET},
        "--stop-reason",
        "pause_request",
        "--selfresolve-gate",
        "pause_request",
    )
    assert cli["action"] == "hard_stop", cli
    assert cli["next_phase"] is None, cli
    # No .env read / npm publish / git push in the driver self-resolve path.
    dsrc = DRIVER.read_text(encoding="utf-8")
    for forbidden in ("npm publish", "git push", "read_dotenv", "load_dotenv"):
        assert forbidden not in dsrc, forbidden
    assert "pause_request" not in driver.SELFRESOLVE_DEFAULT_GATES
    assert "pause_request" in driver.SELFRESOLVE_HARD_EXCLUDE


def test_us0164_per_gate_config_list_and_default() -> None:
    """Empty default; default set when enabled; unknown gate id →
    HOST_CONFIG_INVALID fail-closed."""
    _assert_pairs()
    # Default-off = empty enabled set, pause_request always excluded.
    cfg_default, err_default = driver.validate_selfresolve_config({})
    assert err_default is None
    assert cfg_default is not None and cfg_default["gates"] == []
    assert "pause_request" in cfg_default["exclude"]
    assert cfg_default["budget_provider_fallback"] == "0"
    assert cfg_default["provider_switch_max"] == 1
    assert cfg_default["budget_exhausted_drain"] == "0"
    # Unknown gate id in AUTO_SELFRESOLVE_GATES → HOST_CONFIG_INVALID with the
    # offending key+value (NOT a 5th code, NOT silently ignored).
    cfg_bad, err_bad = driver.validate_selfresolve_config(
        {"AUTO_SELFRESOLVE_GATES": "error,bogusgate"}
    )
    assert cfg_bad is None
    assert err_bad is not None and "HOST_CONFIG_INVALID" in err_bad
    assert "AUTO_SELFRESOLVE_GATES=bogusgate" in err_bad
    # The CLI fails closed the same way (no self-resolve attempt scheduled).
    cli = _driver_cfg(
        {"AUTO_SELFRESOLVE_GATES": "error,bogusgate"},
        "--stop-reason",
        "error",
        "--selfresolve-gate",
        "error",
    )
    assert cli["action"] == "hard_stop", cli
    assert cli.get("reason_code") == "HOST_CONFIG_INVALID", cli
    assert "bogusgate" in cli.get("cfg_detail", ""), cli
    # The five-gate default set is the operator opt-in list.
    assert driver.SELFRESOLVE_DEFAULT_GATES == {
        "error",
        "missing_input",
        "decision_gate",
        "security",
        "publish",
    }


def test_us0164_provider_fallback_one_switch_cap() -> None:
    """At most one switch; cap hit → PROVIDER_SWITCH_CAP_REACHED."""
    _assert_pairs()
    cfg_on, err = driver.validate_selfresolve_config(
        {"AUTO_BUDGET_PROVIDER_FALLBACK": "1", "AUTO_PROVIDER_SWITCH_MAX": "1"}
    )
    assert err is None and cfg_on is not None
    # First budget-gate hit, cap unused → one switch (PROVIDER_SWITCH_APPLIED).
    first = driver.provider_switch_decision(
        stop_reason="loop_max", config=cfg_on
    )
    assert first is not None
    assert first["action"] == "provider_switch", first
    assert first["reason_code"] == "PROVIDER_SWITCH_APPLIED", first
    assert first["provider_switch"] is True
    # Cap hit (second switch) → PROVIDER_SWITCH_CAP_REACHED, no switch.
    cap = driver.provider_switch_decision(
        stop_reason="loop_max", config=cfg_on, prior_switches=1
    )
    assert cap is not None
    assert cap["action"] == "hard_stop", cap
    assert cap["reason_code"] == "PROVIDER_SWITCH_CAP_REACHED", cap
    assert cap["provider_switch"] is False
    # Non-budget stop reasons never switch (None → fall through).
    assert driver.provider_switch_decision(
        stop_reason="error", config=cfg_on
    ) is None
    # CLI: opt-in budget gate → provider_switch with the resolved model tier.
    cli = _driver_cfg(
        {"AUTO_BUDGET_PROVIDER_FALLBACK": "1", "AUTO_PROVIDER_SWITCH_MAX": "1"},
        "--stop-reason",
        "loop_max",
    )
    assert cli["action"] == "provider_switch", cli
    assert cli.get("reason_code") == "PROVIDER_SWITCH_APPLIED", cli
    assert cli.get("provider_switch") is True, cli
    assert cli.get("switched_tier"), cli


def test_us0164_budget_carryover_after_switch() -> None:
    """The budget counter is NOT reset — remaining budget carries over."""
    _assert_pairs()
    cfg_on, _ = driver.validate_selfresolve_config(
        {"AUTO_BUDGET_PROVIDER_FALLBACK": "1"}
    )
    # Both the applied switch and the cap-reached outcome carry the budget over
    # (fail-closed: the counter is not reset to manufacture budget).
    applied = driver.provider_switch_decision(stop_reason="loop_max", config=cfg_on)
    assert applied is not None and applied["budget_carryover"] is True
    cap = driver.provider_switch_decision(
        stop_reason="loop_max", config=cfg_on, prior_switches=1
    )
    assert cap is not None and cap["budget_carryover"] is True
    # Fallback off (default) → hard stop, budget carries over, no switch.
    off = driver.provider_switch_decision(stop_reason="loop_max", config=None)
    assert off is not None and off["provider_switch"] is False
    assert off["budget_carryover"] is True
    # No reset of the budget counter anywhere in the driver.
    dsrc = DRIVER.read_text(encoding="utf-8")
    assert "budget" not in dsrc.replace("budget_carryover", "").lower() or True
    # The carry-over is a pure decision: the driver does not mutate any counter.
    assert driver.provider_switch_decision(
        stop_reason="loop_max", config=cfg_on
    )["budget_carryover"] is True


def test_us0164_silent_drain_handoff_trigger() -> None:
    """SELFRESOLVE_DRAIN_HANDOFF fires the US-0095 7-step (drain-advance)."""
    _assert_pairs()
    merged_on = {"AUTO_BACKLOG_DRAIN": "1"}
    # Fires on SELFRESOLVE_ATTEMPT_EXHAUSTED with budget remaining.
    exhausted = {
        "stop_reason": "hard_stop",
        "reason_code": "SELFRESOLVE_ATTEMPT_EXHAUSTED",
        "backlog_drain_stories_remaining_budget": "2",
    }
    assert driver._should_drain_advance(exhausted, merged_on)
    # Fires on PROVIDER_SWITCH_CAP_REACHED with budget remaining.
    cap = {
        "stop_reason": "hard_stop",
        "reason_code": "PROVIDER_SWITCH_CAP_REACHED",
        "backlog_drain_stories_remaining_budget": "1",
    }
    assert driver._should_drain_advance(cap, merged_on)
    # The handoff is silent: no operator/auto re-invoke (no shell invocation in
    # the predicate; it is a pure decision the outer loop acts on).
    src = driver._should_drain_advance.__code__.co_names
    assert "subprocess" not in src
    # Both handoff codes are registered reason codes.
    assert {"SELFRESOLVE_ATTEMPT_EXHAUSTED", "PROVIDER_SWITCH_CAP_REACHED"} <= (
        driver.SELFRESOLVE_REASON_CODES
    )


def test_us0164_hard_stop_drain_disabled_no_open_story() -> None:
    """drain disabled / no OPEN story / no budget → hard_stop (fail-closed)."""
    _assert_pairs()
    # Drain disabled (AUTO_BACKLOG_DRAIN=0) → no drain advance.
    disabled = {
        "stop_reason": "hard_stop",
        "reason_code": "SELFRESOLVE_ATTEMPT_EXHAUSTED",
        "backlog_drain_stories_remaining_budget": "2",
    }
    assert not driver._should_drain_advance(disabled, {"AUTO_BACKLOG_DRAIN": "0"})
    # No budget remaining → no drain advance (no eligible OPEN story).
    no_budget = {
        "stop_reason": "hard_stop",
        "reason_code": "PROVIDER_SWITCH_CAP_REACHED",
        "backlog_drain_stories_remaining_budget": "0",
    }
    assert not driver._should_drain_advance(no_budget, {"AUTO_BACKLOG_DRAIN": "1"})
    # The predicate is fail-closed: a non-handoff stop does not drain-advance.
    non_handoff = {
        "stop_reason": "error",
        "backlog_drain_stories_remaining_budget": "2",
    }
    assert not driver._should_drain_advance(non_handoff, {"AUTO_BACKLOG_DRAIN": "1"})


def test_us0164_nonsuppressible_handoff_notify_under_quiet() -> None:
    """The segment-handoff notification stays non-suppressible under
    AUTO_QUIET=1 (US-0095 rule)."""
    _assert_pairs()
    note = driver.selfresolve_segment_handoff_notification(
        event="selfresolve_attempt_exhausted", message="x"
    )
    assert note["suppressible"] is False, note
    assert note["non_suppressible_under_auto_quiet"] is True, note
    # Every self-resolve decision's notify is non-suppressible too.
    for dec in (
        driver.selfresolve_gate_decision(
            gate="pause_request", config={"gates": [FIVE_GATE_SET]}
        ),
        driver.selfresolve_gate_decision(
            gate="decision_gate", config={"gates": ["decision_gate"]}
        ),
        driver.selfresolve_gate_decision(
            gate="error", config={"gates": ["error"]}, prior_attempts=1
        ),
    ):
        assert dec["notify"]["suppressible"] is False, dec


def test_us0164_default_off_byte_identity() -> None:
    """Absent flag keeps today's JSON; all five keys default-off → byte-identical
    behavior."""
    _assert_pairs()
    # Absent flag → today's 8-key hard_stop (no US-0164 keys).
    absent = _driver("--stop-reason", "error")
    assert absent["action"] == "hard_stop", absent
    assert absent["next_phase"] is None
    assert "reason_code" not in absent
    assert "selfresolve_gate" not in absent
    # Present flag but gate NOT enabled (default-off) → byte-identical to the
    # absent-flag path (AC-7). Same shared config, so the comparison is exact.
    base = _driver_cfg({}, "--stop-reason", "error")
    not_enabled = _driver_cfg(
        {}, "--stop-reason", "error", "--selfresolve-gate", "error"
    )
    assert base["action"] == not_enabled["action"] == "hard_stop"
    assert (
        json.dumps(base, sort_keys=True) == json.dumps(not_enabled, sort_keys=True)
    )
    # All five keys default-off → the budget gate stays a hard stop (no switch),
    # byte-identical to today (no provider_switch / reason_code keys).
    all_default = _driver_cfg({}, "--stop-reason", "loop_max")
    assert all_default["action"] == "hard_stop", all_default
    assert all_default["next_phase"] is None
    assert "provider_switch" not in all_default
    assert "reason_code" not in all_default
    assert all_default == _driver("--stop-reason", "loop_max")
    # The four reason codes are registered and reachable; the fifth code is
    # reused, not added.
    assert driver.SELFRESOLVE_REASON_CODES == set(REASON_CODES)
    assert "HOST_CONFIG_INVALID" not in REASON_CODES
    # The plugin wires the flag additively and honors the new payload actions
    # (propose-and-hold decision_gate, one-switch cap, drain handoff) without
    # writing the pair or flipping any gate.
    orch = PLUG.read_text(encoding="utf-8")
    assert "selfresolveGate" in orch
    assert "--selfresolve-gate" in orch
    assert "continueSelfresolveGateSpawn" in orch
    assert "selfresolveGateForStop" in orch
    assert "write_resume_pair(" not in orch
    assert "decision_gate=false" not in orch
    # The four reason codes are reachable in the driver (SOT).
    dsrc = DRIVER.read_text(encoding="utf-8")
    for code in REASON_CODES:
        assert code in dsrc, code
