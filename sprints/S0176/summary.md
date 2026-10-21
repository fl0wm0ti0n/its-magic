# Summary — Sprint S0176

## Goal

Classify help, local auth/models, and bare `status` before any static import of the workflow runner, and keep every other token on production `createRuntimeHost` (R-0166, `# BUG-0028`).

## Planned

`command-class.ts` classifies before `./run.ts` loads. Help prints in the classifier. `auth` and `models` load `@its-magic/auth-models`, and only `auth list`, `auth login`, `auth logout`, and `models test` load `@its-magic/pi-kernel/auth-runtime`. Bare `status` reads a bounded snapshot. Workflow tokens, including `/status`, call `createRuntimeHost({ projectRoot, lifetime: "direct-cli" })` and then `runCliArgv` with the original argv.

## Status

**REFRESH_CONTEXT_PASS** (`curator-BUG0028-refresh-20261014T214623Z-fresh`). BUG-0028 **DONE**; AC-1..AC-5 checked. Sprint **S0176** released and closed. Five `test_bug0028_*` markers 5 pass / 0 fail (release-era duration_ms 5427.8777). UAT 6 pass / 0 fail; live installed binary `UAT_PROBE_FORBIDDEN`. Harness `tests/report.md` **2026-10-14T21:06:12Z** Pass **880** / Fail **0**. Research **R-0166** delivered (no companion DEC). **BUG-0026** and **BUG-0029** remain **OPEN** (out of scope for this run). `next_scheduled_phase=none`; `stop_reason=completed`. Publish/push NOT PERFORMED.

## Generated-test evidence

Framework kit contract harness, not a generated application stack.

- baseline scope: `standalone/tests/contract/bug0028.contract.test.ts` (five `test_bug0028_*` markers)
- command: `node --experimental-strip-types --test --test-name-pattern "test_bug0028_" tests/contract/bug0028.contract.test.ts`
- result: pass, 5 / 0, duration_ms 5617.6656, exit 0
- output ref: `sprints/S0176/verify-work-findings.md`
- paths ref: `standalone/tests/contract/bug0028.contract.test.ts`
- reason code: ok
