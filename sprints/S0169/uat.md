# UAT — Sprint S0169 / US-0149

## Result

**PASS.** Contract and install behavior. A live PATH or HKCU probe is `UAT_PROBE_FORBIDDEN` because it would mutate the operator machine. Fake-home tests cover the behavior.

- Contract tests: `python -m pytest tests/us0149_path_registration_test.py -q` → **8 passed in 0.37s**
- Harness: `tests/report.md` timestamp **2026-10-11T13:42:10Z**, **Pass 875 / Fail 5**. The US-0149 path row passed. The five fails are scratchpad newline drift, not this story. Fail=0 is not claimed.
- fresh_context_marker: `qa-US0149-qa-20261011T134545Z-fresh`
- timestamp: 2026-10-11T13:45:45Z
- US-0149 stays OPEN. Backlog AC boxes stay unchecked.

## Steps

| Step | AC | Probe | Result |
|---|---|---|---|
| UAT-1 | AC-1 | Missing shim returns `ITSM_PATH_SHIM_MISSING` and writes no ledger and no PATH entry | PASS (`test_us0149_register_refuses_when_shim_missing`) |
| UAT-2 | AC-2 | Install without the flag or env writes nothing; non-TTY `prompt` fail-closes | PASS (`test_us0149_register_opt_in_default_off`) |
| UAT-3 | AC-2 | User-chosen directory receives the link; defaults match R-0160 | PASS (`test_us0149_register_user_chosen_dir`) |
| UAT-4 | AC-3 | Fake Windows store appends the directory only when absent | PASS (`test_us0149_register_windows_user_path`) |
| UAT-5 | AC-3 | Fake POSIX home gets the marked snippet; second call is idempotent | PASS (`test_us0149_register_posix_profile_snippet`) |
| UAT-6 | AC-4 | Unregister removes only recorded links; pre-existing PATH directory stays when `path_entry_added` is false; write failure is not partial | PASS (`test_us0149_unregister_removes_only_owned_entry`, `test_us0149_register_fail_closed_on_write_error`) |
| UAT-7 | AC-5 | Active and template PATH sections match and name the tokens | PASS (`test_us0149_runbook_path_section_parity`) |
| convergence_smoke | — | Waived live probes plus green contract tests | PASS |

## Live probes

All six live-runtime classes are `UAT_PROBE_FORBIDDEN`. No browser UI. No live installer PATH write.
