# Sprint S0168 UAT - BUG-0033

- **Sprint**: `S0168`
- **Work item**: **BUG-0033** - Thin to rich command-pair parity: OpenCode closure/ask/auto/refresh-context/execute missing Fail-safe reason codes + Stop conditions
- **Orchestrator run**: **auto-20261010-bug0033-verifywork2** (verify-work phase; fresh QA context `qa-BUG0033-vw-20261010T205038Z-fresh`)
- **Machine-readable**: `sprints/S0168/uat.json`
- **Status**: **populated** (`uat_lifecycle=populated`, `verified_ready=true`)
- **Canonical backlog**: **`docs/product/backlog.md`** - **BUG-0033** **OPEN** (closure owns the DONE flip)

## Metadata

- **author**: qa (verify-work)
- **fresh_context_marker**: `qa-BUG0033-vw-20261010T205038Z-fresh` (grep-verified 0 prior occurrences at mint)
- **runtime_proof_id**: `rp-auto-20261010-bug0033-verifywork2-qa-20261010T205038Z-BUG-0033` / `4283bf15ee49a1f4191b34e0baff56883013bea3a4c9a0cee222ea509c1b11fd` (lib and independent hashlib MATCH)
- **UAT surface**: **static file-level probes only**. Live CLI/TUI/browser/API/process/build/manual-operator probes are **FORBIDDEN** (`UAT_PROBE_FORBIDDEN`); none were executed or claimed.
- **Harness cited**: `tests/report.md` Timestamp **2026-10-10T21:01:29Z**, **Pass=879**, **Fail=0**. This timestamp postdates the `docs/engineering/state.md` append (issued 2026-10-10T20:50:38Z).

## Target acceptance criteria (from backlog `### BUG-0033`)

- **AC-1**: `.opencode/commands/closure.md` contains both `## Fail-safe reason codes` and `## Stop conditions` (Stop first)
- **AC-2**: `.opencode/commands/ask.md` contains both headings
- **AC-3**: `.opencode/commands/auto.md` contains both headings
- **AC-4**: `.opencode/commands/refresh-context.md` contains both headings
- **AC-5**: `.opencode/commands/execute.md` contains both headings
- **AC-6**: Active command files are byte-identical to `template/.opencode/commands/`
- **AC-7**: US-0125 / US-0126 failing set equals the documented 5-failure baseline; `.opencode/tui.json` `"plugin": []` unchanged
- **AC-8**: 8+ `test_bug0033_*` markers; `bug_issue_validate.py --check-acceptance` exit 0

## UAT step results (this fresh context, independently re-run)

| UAT ID | AC | Probe (static, file-level) | Result | Evidence (this context) |
|---|---|---|---|---|
| UAT-1 | AC-1 | both headings in active + template `closure.md` (Stop first) | **PASS** | marker 1 + fresh read |
| UAT-2 | AC-2 | both headings in active + template `ask.md` | **PASS** | marker 2 + fresh read |
| UAT-3 | AC-3 | both headings in active + template `auto.md` | **PASS** | marker 3 + fresh read; `auto.md` has no terminal STOP line |
| UAT-4 | AC-4 | both headings in active + template `refresh-context.md` | **PASS** | marker 4 + fresh read |
| UAT-5 | AC-5 | both headings in active + template `execute.md` | **PASS** | marker 5 + fresh read |
| UAT-6 | AC-6 | byte parity of 5 pairs + `--scope=bug-0033` banner | **PASS** | markers 6+7; sizes 1084/381/3564/892/957; parity CLI exit 0 |
| UAT-7 | AC-7 | us0125/us0126 failing set equals the 5-failure baseline; `tui.json` `"plugin": []` | **PASS** | markers 8+9; standalone 5 failed / 18 passed; SHA prefix `c2fac9d6c3185b05` |
| UAT-8 | AC-8 | 10 `test_bug0033_*` markers green; validator; README coverage while OPEN | **PASS** | active 10 passed and template twin 10 passed; `[BUG_VALIDATION_OK]` exit 0; marker 10; coverage report PASS |
| convergence_smoke | AC-1..8 exit gate | US-0128 surrogate: 6 live classes waived `UAT_PROBE_FORBIDDEN` and `contract_test_failed=0` | **PASS** | `tests/report.md` 2026-10-10T21:01:29Z Pass=879 Fail=0 |

## README affinity (static, file not flipped)

- `resolve_affinity` for BUG-0033: **release_gate** (`root_h2=Commands and workflow`, `dev_h2=Quality gates`)
- `has_root_coverage=True`, `has_dev_coverage=True`
- In-memory Status=DONE classification: `in_scope=True`, `predicate_source=explicit:true`. Backlog file stays **OPEN**.
- `validate_readme_feature_coverage.py --repo . --report` exit 0, `coverage_missing=[]`, `status=PASS`. BUG-0033 is absent from `coverage_present` while OPEN.
- SHA-256 `its_magic/README.md` == `template/its_magic/README.md` = `03f5589ef80a25e60719adcda52fc4cc00bc7a2d57c9281e180dc520a08a482e`

## Live-runtime probe waivers

All 6 live-runtime probe classes are **waived** and recorded in `uat.json` `waived_probes[]` and `probe_results[]` with `reason_code=UAT_PROBE_FORBIDDEN`:

- `browser_smoke`
- `api_health`
- `process_health`
- `cli_smoke` (no live OpenCode CLI/TUI)
- `build`
- `manual_operator`

No live probe was executed, attempted, or claimed. `probe_kind` stays `static_file_read` for UAT-1..UAT-8 and `contract_tests_primary` for the convergence surrogate.

## Verdict summary

| Bucket | Count |
|--------|-------|
| PASS | 9 (UAT-1..UAT-8 + convergence_smoke) |
| FAIL | 0 |
| SKIP | 0 |
| PENDING | 0 |
| Total | 9 |

**UAT verdict: PASS.** UAT-1..UAT-8 are 8/8. BUG-0033 stays **OPEN**. AC-1..AC-8 and acceptance L224 stay `[ ]`.

## Next

This `/verify-work` context stops here. Next scheduled phase is **`/release`** (orchestrator-owned). This QA child does not spawn it.
