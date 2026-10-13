# Sprint S0174 — Task checklist (US-0154)

Seven planned tasks: **T-anch + T-001..T-006**, within `SPRINT_MAX_TASKS=12`.
Execute only in this order. Every box stays open until a fresh `/execute` dev context finishes it.

## Checklist

- [x] **T-anch — locked baseline (all AC):** Read R-0164 and `# US-0154`. Confirm US-0154 is OPEN, AC-1..AC-6 are unchecked, and S0173 is historical. Confirm US-0149 through US-0153 stay DONE. Confirm root CI uses kit `TEST_COMMAND` with blank `LINT_COMMAND` and `TYPECHECK_COMMAND`, `standalone-test` typechecks and tests on Windows only and does not lint, and `standalone/apps/cli/src/index.ts` calls `createRuntimeHost` while `standalone/tests` does not spawn that bin. Do not mutate product code in this task.
  **Done-when:** the notes match those gaps and the story is still OPEN.

- [x] **T-001 — standalone CI beside the kit (AC-1):** In `.github/workflows/ci.yml`, keep job `checks` on kit `TEST_COMMAND`. Leave `LINT_COMMAND` and `TYPECHECK_COMMAND` blank in `docs/engineering/runbook.md`. Do not fold standalone npm scripts into `TEST_COMMAND`. Change `standalone-test` to a matrix of `windows-latest` and `ubuntu-latest`. Pin Node `22.19.0`. Install with `npm ci` in `standalone/`. Run `npm run typecheck && npm run lint && npm test`. Document that pin in `docs/engineering/runbook.md` and `template/docs/engineering/runbook.md`. Do not edit `template/.github/workflows/ci.yml`.
  **Done-when:** both matrix legs run typecheck, lint, and tests, the kit command keys are unchanged, and the runbook pin names Node `22.19.0`, `npm ci`, and those three scripts.

- [x] **T-002 — public itsm bin (AC-2):** Add `standalone/tests/contract/us0154.contract.test.ts` with `test_us0154_public_itsm_reaches_production_composition`. The test spawns a child whose entry is `standalone/apps/cli/src/index.ts` (package bin `itsm`) using `node --experimental-strip-types`. Pass no `RuntimeHostFactories`. A passing fixture shows store path `.its-magic/runtime/ops.sqlite`, a non-empty resolved config, and a transport disposition. An empty-config fixture exits with `RUNTIME_CONFIG_UNAVAILABLE` and does not print `{ok:true}`. An in-process `createRuntimeHost({ factories })` call does not satisfy this task.
  **Done-when:** the marker fails if the child is a test-created facade, and passes when the public bin reaches production composition.

- [x] **T-003 — operator-path E2E (AC-3):** Add `test_us0154_operator_e2e_session_policy_validator_resume_replay_parity`. Spawn the CLI bin, `itsm-daemon` (`standalone/apps/daemon/src/index.ts`), and `itsm-tui` (`standalone/apps/tui/src/index.ts`). Cover fresh Pi session admission, a policy allow and a policy deny, validator-gate failure before work, restart/resume from `.its-magic/runtime/ops.sqlite`, daemon attach/replay, and CLI/TUI parity on the same run events. Use the US-0150..US-0153 seams. Do not add a workflow engine. No paid model. No `.env`.
  **Done-when:** one spawned run shows each of those outcomes, and the TUI timeline matches the daemon events.

- [x] **T-004 — reject fake production evidence (AC-4):** Add `test_us0154_production_rejects_fake_browser_and_synthetic_release`. Operator-path assertions fail if production acceptance would pass on `FakeBrowserDriver`, the text `screenshot-placeholder`, `artifact_sha: "fake-sha"`, or a no-op `{ok:true}` / `{scheduled:true}` with no execution. Leave unit-test construction of `FakeBrowserDriver` and the US-0145 dry-run stub in place. Do not count those unit results as operator-path passes.
  **Done-when:** each of those four fakes fails the operator-path fixture, and the existing unit fake seams still exist.

- [x] **T-005 — seam report (AC-5):** Add `test_us0154_report_separates_seams_and_fails_closed`. The contract asserts buckets `unit_seam` and `operator_path`. The operator-path bucket fails when the spawned entrypoint uses a throwing kernel, an empty configuration, a store of `:memory:`, or a discarded transport (`resolveOperatorTransport` result unused). Do not delete unit fake seams.
  **Done-when:** a fixture for each of those four failures fails the operator-path bucket, and unit-seam cases are reported separately.

- [x] **T-006 — acceptance classification (AC-6):** In `docs/product/acceptance.md`, add a note that US-0133 through US-0148 are completed library/contract slices and US-0150 through US-0154 are their production-integration follow-up, and that phase-9 deferrals (own indexer, stronger sandbox/micro-VM, IDE, web/mobile/watch, distributed workers, remote always-on Debian) are not missing v1 work. Do not uncheck completed rows. Do not check the US-0154 row. Do not edit `template/docs/product/acceptance.md` (it does not carry these rows). Add `test_us0154_acceptance_records_library_slices_and_production_followup` to assert that note and that the US-0154 checkbox is still open.
  **Done-when:** the note is present, completed rows stay checked, and the US-0154 row stays unchecked.

## Execute boundary

US-0154 stays OPEN. AC boxes stay unchecked. Closure owns the DONE flip. Do not start US-0155. Do not add a README coverage row.
