# Summary — Sprint S0169

## Goal

Opt-in global `itsm` PATH registration for US-0149 (R-0160, no companion DEC).

## Completed

T-anch and T-001..T-006. `register_itsm_user_path` / `unregister_itsm_user_path` live in `scripts/standalone_runtime_install_lib.py`. `installer.py` owns `--register-itsm-path` and `--unregister-itsm-path`. `installer.ps1` and `installer.sh` forward those flags only. Missing shim returns `ITSM_PATH_SHIM_MISSING` and writes nothing. Unregister removes recorded links and drops the PATH directory only when `path_entry_added` is true. Active and template runbooks share the PATH subsection. Eight R-0160 markers passed.

QA, verify-work, release, and closure **PASS**. Backlog US-0149 **DONE**; AC-1..AC-6 checked; acceptance row checked. Harness `tests/report.md` at `2026-10-11T14:31:11Z` is Pass **880** / Fail **0** (includes US-0149 path registration and global launcher coverage).

## Pre-closure coverage rows

`its_magic/README.md` Features catalog names `US-0149`, and `template/its_magic/README.md` is a byte copy. `docs/developer/README.md` Architecture notes has `**US-0149**` pointing at runbook `### Global itsm PATH registration (US-0149)` and architecture `# US-0149`.

## Segment terminal

`/refresh-context` **REFRESH_CONTEXT_PASS** @ `2026-10-11T14:32:45Z` (`auto-20261011-us0149-refresh`). Drain advances to **US-0150** (OPEN); intake evidence shared at `handoffs/intake_evidence/US-0150-0154-standalone-integration-intake-20260919.json` — next phase **discovery** (po).
