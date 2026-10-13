# Sprint S0169 — US-0149 global `itsm` PATH registration

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0169** (next free id: `sprints/S0168/` exists; `sprints/S0169/` did not) |
| story_id | US-0149 — **OPEN**, P0; AC-1..AC-6 unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean; plan-verify is a PENDING stub for the later QA phase |
| research_anchor | **R-0160** (`docs/engineering/research.md`) |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0149` |
| companion_DEC | **none** (discovery D1–D6 already determine the design) |
| task_count | 7 (T-anch + T-001..T-006; `SPRINT_MAX_TASKS=12`; split not triggered) |
| fresh_context_marker | `tl-US0149-plan-20261011T125459Z-fresh` |

## Goal

When the operator opts in, put the materialized project shim `.its-magic/bin/itsm` on the user PATH at a directory they choose, on Windows and on Linux/macOS, and let uninstall remove only that registration.

The design is locked by R-0160 and `# US-0149`. This sprint does not re-decide it.

- Registration is off unless `--register-itsm-path` or `ITS_MAGIC_REGISTER_ITSM_PATH=1`.
- Missing shim prints `ITSM_PATH_SHIM_MISSING` and writes nothing. BUG-0026 still owns published-kit materialize.
- Defaults: `%LOCALAPPDATA%\its-magic\bin` and `$HOME/.local/bin`.
- Windows PATH uses `HKCU\Environment`. POSIX uses a marked snippet. `setx` is forbidden.
- Unregister deletes recorded links and drops the PATH directory only when this story appended it.
- Tests use a fake home and a fake PATH store.

## Scope

### In scope (execute)

1. `register_itsm_user_path` / `unregister_itsm_user_path` in `scripts/standalone_runtime_install_lib.py`.
2. `installer.py` flags, plus forward-only wiring in `installer.ps1` and `installer.sh`.
3. Runbook section in `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md`.
4. `tests/us0149_path_registration_test.py` (eight markers) wired into `tests/run-tests.ps1` and `tests/run-tests.sh`.

### Out of scope

- This phase implements nothing.
- Do not edit BUG-0026, BUG-0025, US-0146, US-0148, or BUG-0033.
- Do not change `write_itsm_shim`, `bin/itsm.js`, or `package.json` `bin.itsm`.
- Do not change the assertions in `tests/us0149_global_itsm_launcher_test.py`.
- Do not touch the autonomy stop matrix, `reason_codes.md`, scratchpad, or `.env`.
- Do not flip US-0149 or tick AC-1..AC-6.
- Do not start US-0150..US-0155.
- No publish, push, `/auto`, or live PATH mutation.

## Plan-verify

`sprints/S0169/plan-verify.json` is **PENDING**. Ultra-lean skips plan-verify at plan time. QA overwrites it inside build+verify.

## Proof

- `runtime_proof_id=rp-auto-20261011-us0149-plan-techlead-20261011T125459Z`
- `proof_hash=604facda30531a9cbe890329ce2346408fad2dbb3f4e08ebc4731a84829c08dc`
- `proof_issued_at=2026-10-11T12:54:59Z`; `proof_ttl=2026-10-11T13:54:59Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261011-us0149-plan","phase_id":"sprint-plan","proof_issued_at":"2026-10-11T12:54:59Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261011-us0149-plan-techlead-20261011T125459Z"}`
- `hash_recompute_confirmation=true`
