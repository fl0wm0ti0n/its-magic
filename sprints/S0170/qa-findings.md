# QA Findings — S0170 / US-0150

- **verdict**: **QA_PASS**
- **phase_id**: qa
- **role**: qa
- **story_id**: US-0150
- **sprint_id**: S0170
- **timestamp**: 2026-10-11T15:27:10Z
- **fresh_context_marker**: `qa-US0150-qa-20261011T152710Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0150 remains **OPEN**. Backlog AC-1..AC-6 stay `[ ]`. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md`. US-0149 was not reopened. US-0151 was not started.

Consumed as provenance only: execute marker `dev-US0150-execute-20261011T151310Z-fresh`; execute-pair `record_key=auto-20261011-us0150-execute-pair|story|(none)|execute|rp-auto-20261011-us0150-execute-pair-curator-20261011T151551Z`; `proof_hash=2c7c0e2becbdbcdb838e3525fd7157563f32d619812d88040e5fd2c50ccaa6a3`. This context re-ran the six contract markers and the harness.

## Test plan

1. Read US-0150 AC-1..AC-6, S0170 tasks/summary, and the top of `handoffs/dev_to_qa.md`.
2. Check one composition root, no throwing kernel on the production entrypoints, no literal empty config on the host-present daemon path, a fresh attested custom-tool session, tool execute-or-deny without `ok:` success text, an operational store that is not artifact authority, and `RUNTIME_SERVICE_UNAVAILABLE` when intelligence is unavailable.
3. Re-run the six `test_us0150_*` markers in `standalone/tests/contract/us0150.contract.test.ts` on the deterministic local model seam. No paid credentials and no network.
4. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp.
5. Treat a live daemon or paid-model probe as `UAT_PROBE_FORBIDDEN`. Cover behavior with the existing local-model-seam tests.
6. Leave US-0150 OPEN. Do not tick backlog acceptance boxes. Do not edit `.cursor/scratchpad.md`. Do not write `handoffs/resume_brief.md`.

## Contract markers

Command: `node --experimental-strip-types --test --test-name-pattern "test_us0150_" tests/contract/us0150.contract.test.ts` (cwd `standalone`).

| Marker | Result |
|---|---|
| `test_us0150_runtime_host_resolves_one_config_and_builds_graph` | PASS |
| `test_us0150_cli_and_daemon_use_runtime_host_not_throwing_kernel` | PASS |
| `test_us0150_host_creates_fresh_attested_custom_tool_session` | PASS |
| `test_us0150_admitted_tool_executes_or_denies_without_placeholder_success` | PASS |
| `test_us0150_bridge_validator_and_operational_store_preserve_artifact_authority` | PASS |
| `test_us0150_production_composition_unavailable_services_and_disposal` | PASS |

**6 pass / 0 fail.** Duration 1933.826 ms.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | One composition root resolves config and builds kernel, bridge, supervisor, broker, intelligence/context, and an operational store. | `createRuntimeHost` in `standalone/packages/runtime-host/src/index.ts` is the root both entrypoints call. `buildContextPack` calls `codeContext`. The host exposes a `ContextPack` whose `content_hash` matches `computePackContentHash`. Unavailable intelligence rejects with `RUNTIME_SERVICE_UNAVAILABLE` and the host source has no `persistContextPack`. | PASS |
| AC-2 | CLI and daemon use that composition. The host-present daemon path has no literal empty config. Missing prerequisites fail closed. | `apps/cli/src/index.ts` and `apps/daemon/src/index.ts` call `createRuntimeHost` and `dispose()` and do not pass `factories` or `config: {}`. Host-present reconcile sets `resumeConfig` from `deps.runtime.config` and passes `config: resumeConfig`. The `{}` branch is the supervisor-only path, not taken by those two `index.ts` files. Bridge, kernel, and intelligence failures throw `RUNTIME_BRIDGE_UNAVAILABLE`, `RUNTIME_KERNEL_ADMISSION_FAILED`, or `RUNTIME_SERVICE_UNAVAILABLE`. | PASS |
| AC-3 | A production session is fresh, attested, custom-tool only, and deny-by-default. | A no-factory `createRuntimeHost` routes `ask` to role `scout`, `fresh: true`, and attestation `model_id` `deterministic-local-model`. `getRuntimeInfo().builtinTools` is `disabled`. Registered names are `itsm_*` only, including `itsm_read`, and exclude `itsm_browser`. Loader counts for extensions, agents, skills, and prompts are 0. The session uses `createFakeModel` / `createFakeModelRuntime` (`itsm-fake-ping`, `baseUrl` `http://127.0.0.1:9`). | PASS |
| AC-4 | File, edit, shell, git, and intelligence tools execute or deny, with no `ok:` success text. | `itsm_read` read `package.json` with policy `ALLOW` and an audit `ALLOW` row. `../outside` was denied. `itsm_edit`, `itsm_shell`, and `itsm_git` are live catalog tools; the broker returns `TOOL_EXECUTION_UNAVAILABLE` for those non-read live tools, which the marker accepts as `details.denied`. `itsm_search` returned an intelligence result. No result text matched `^ok:`. No browser or app tool was offered. | PASS |
| AC-5 | The operational store is not artifact authority. Dispose does not delete repository files. | Store tables stay inside `runs`, `sessions`, `audit`, `process_handles`, and `index_meta`. A SQLite row that claims complete throws from `assertRepoCanonical` while the repo is OPEN. Config provenance is non-secret. `dispose()` twice leaves `package.json` hash unchanged. | PASS |
| AC-6 | Production-composition tests cover a real Pi session, fresh role sessions, admission/denial, validator blocking, persisted run state, and unavailable services. | All six markers passed, including the no-factory production case on the local model seam. Schema mismatch and a throwing bridge return `RUNTIME_BRIDGE_UNAVAILABLE` before work. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- Exit code: **0**
- `tests/report.md` timestamp **2026-10-11T15:26:11Z**
- **Pass 880 / Fail 0**
- Triad rows `triad check passes on repo` and `triad check idempotent rerun passes`: **PASS** (this report is the pre-checkpoint repo)

## UAT

A live daemon or paid-model probe is `UAT_PROBE_FORBIDDEN`. The six live-runtime probe classes stay waived. Acceptance behavior is covered by the local-model-seam contract tests above. UAT result: **PASS** (`sprints/S0170/uat.md`, `sprints/S0170/uat.json`).

## Guards held

- US-0150 stays OPEN. AC boxes stay unchecked.
- US-0149 was not reopened. US-0151 was not started.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.
- `.cursor/scratchpad.md` was not edited. `handoffs/resume_brief.md` was not written.

## Next

Fresh `/verify-work` for US-0150 / S0170. This QA child does not spawn it.
