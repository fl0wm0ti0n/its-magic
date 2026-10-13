# Summary — Sprint S0170

## Goal

Close the S0158 residuals for US-0150 so the locked `@its-magic/runtime-host` resolves one config, builds a hashed context pack, and is the composition both production entrypoints already construct (R-0150, DEC-0150, no new DEC).

## Done

T-anch and T-001..T-006. The host builds one `ContextPack` through existing `codeContext` and fails with `RUNTIME_SERVICE_UNAVAILABLE` when intelligence is unavailable, without writing a pack. Host-present daemon reconcile passes that host's resolved config into `crashResume`. The supervisor-only empty-config branch remains the US-0148 seam and is not used by `apps/cli/src/index.ts` or `apps/daemon/src/index.ts`. A production `createRuntimeHost` call with no factories creates a fresh attested custom-tool session on the deterministic local model seam. Admitted tools execute or deny without `ok:` success text. `dispose()` is idempotent and does not delete repository files. The operational store stays run/session/audit/index metadata.

## Evidence

Standalone contract runner: six `test_us0150_*` markers pass. US-0148 contract markers still start (14 pass). Harness `tests/report.md` timestamp `2026-10-11T15:13:10Z`, Pass 880 / Fail 0.

## Coverage rows

Literal `US-0150` is in the Features catalog of `its_magic/README.md` and the byte-identical `template/its_magic/README.md`, and in `docs/developer/README.md` Architecture notes. Post-closure `validate_readme_feature_coverage.py --report`: `coverage_present` includes **US-0150**; `coverage_missing=[]`; `coverage_total=46`.

## Closure (2026-10-11)

**CLOSURE_PASS** — US-0150 **DONE**; AC-1..AC-6 checked; `sprints/S0170/closure-verification.md`. Harness post-flip `tests/report.md` **2026-10-11T16:04:45Z** Pass 880 / Fail 0. **REFRESH_CONTEXT_PASS** (2026-10-11T16:08:00Z) — segment closed; drain advances to **US-0151** (discovery next; intake skipped).
