# Release Notes — S0169 / US-0149

- **Sprint**: `S0169`
- **Story**: `US-0149` — opt-in global `itsm` PATH registration at a user-chosen directory (Windows, Linux, macOS). A normal install does not change PATH.
- **Release date**: `2026-10-11T14:13:22Z` (UTC)
- **orchestrator_run_id**: `auto-20261011-us0149-release`
- **fresh_context_marker**: `release-US0149-release-20261011T141322Z-fresh`
- **runtime_proof_id**: `rp-auto-20261011-us0149-release-release-20261011T141322Z`
- **proof_hash**: `ae9f5cbf0b26abd4994c21165f71db157d4dc18b2127456294ddcc6bb216e6d3`
- **proof_issued_at**: `2026-10-11T14:13:22Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-11T15:13:22Z`
- **release_version**: none (workflow-only; kit stays `0.1.10`)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. US-0149 stays **OPEN**. Closure owns the DONE flip and the acceptance ticks.

- **Publish: NOT PERFORMED** (`RELEASE_PUBLISH_MODE=confirm`; no npm publish; no registry write; no kit semver bump).
- **Push: NOT PERFORMED** (`SYNC_POLICY_MODE=disabled`; no git push; no commit).

## What this release records

Operators can opt in after the shim exists:

- `python installer.py --register-itsm-path [DIR|prompt]`
- `python installer.py --unregister-itsm-path`
- `installer.ps1` and `installer.sh` forward those flags only. They do not edit PATH themselves.
- Env opt-in: `ITS_MAGIC_REGISTER_ITSM_PATH=1`. Directory override: `ITS_MAGIC_ITSM_PATH_DIR`.
- Defaults: `%LOCALAPPDATA%\its-magic\bin` on Windows, `$HOME/.local/bin` on Linux and macOS.
- Missing shim: `ITSM_PATH_SHIM_MISSING`, nothing written. That residual stays **BUG-0026**.
- Success: `ITSM_PATH_REGISTER_OK` / `ITSM_PATH_UNREGISTER_OK`. Failed write: `ITSM_PATH_REGISTER_FAILED` and rollback.
- Docs: `### Global itsm PATH registration (US-0149)` in `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md`.

This release did not run those commands against the operator PATH or HKCU.

## Gate summary

| Gate | Result |
|------|--------|
| check_in_tests (1) | **PASS** — `tests/report.md` `2026-10-11T14:01:36Z` Pass 880 / Fail 0. US-0071 L713–L722 PASS. Triad L725–L726 PASS. US-0149 path row PASS. Eight markers re-run this release: 8 passed in 0.39s. |
| qa (2) | **PASS** — `sprints/S0169/qa-findings.md` QA_PASS, no blocking findings |
| uat (3) | **PASS** — `sprints/S0169/uat.json` 8/8, `uat_lifecycle=populated`. Live PATH probe `UAT_PROBE_FORBIDDEN`. |
| isolation (4) | **PASS** — execute/dev, qa/qa, verify-work/qa, plus this release/release marker |
| strict_runtime_proof (4b) | **PASS** — execute, qa, and verify-work pair hashes recomputed MATCH and in TTL; own proof MATCH |
| readme_feature_coverage_3f | **PASS** — coverage_total=44, `coverage_missing=[]`. US-0149 absent while OPEN. |
| project_readme_3g | **PASS** — `kit_repo_skipped=true` |
| publish | **NOT PERFORMED** |
| sync | **NOT PERFORMED** (`SYNC_DISABLED`) |
| backlog | **deferred to `/closure`** — US-0149 remains OPEN |

## Reproduce

```powershell
python -m pytest tests/us0149_path_registration_test.py -q
powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1
python scripts/validate_readme_feature_coverage.py --repo . --enforce
```

## Next

Fresh `/closure` as **curator**. Do not flip US-0149 in this phase.
