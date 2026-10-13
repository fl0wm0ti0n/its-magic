# Verify-work findings — S0170 / US-0150

- **verdict**: **VERIFY_PASS**
- **phase_id**: verify-work
- **role**: qa
- **story_id**: US-0150
- **sprint_id**: S0170
- **timestamp**: 2026-10-11T15:39:50Z
- **fresh_context_marker**: `qa-US0150-vw-20261011T153950Z-fresh`
- **CROSS_MODEL_REVIEW**: 0 (model_id omitted)
- **blocking findings**: none
- **status guard**: US-0150 remains **OPEN**. Backlog AC-1..AC-6 stay `[ ]`. Closure owns the DONE flip. This child did not write `handoffs/resume_brief.md` and did not edit `.cursor/scratchpad.md`. US-0149 was not reopened. US-0151 was not started.

Consumed as provenance only: QA marker `qa-US0150-qa-20261011T152710Z-fresh`; qa-pair `record_key=auto-20261011-us0150-qa-pair|story|(none)|qa|rp-auto-20261011-us0150-qa-pair-curator-20261011T152957Z`; `proof_hash=d56a0bf60cf6a3779c738b1fddd5090b3883988cb8f374e65f77073136454137`. This context re-ran the six contract markers and the harness. No daemon was started. No paid model was called.

## Test plan

1. Read S0170 `qa-findings.md`, `uat.md`, `uat.json`, and `tasks.md`, plus US-0150 AC-1..AC-6.
2. Re-run the six `test_us0150_*` markers in `standalone/tests/contract/us0150.contract.test.ts` on the deterministic local model seam. No paid credentials and no network.
3. Re-run `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1` and record Pass/Fail plus the report timestamp.
4. Treat a live daemon or paid-model probe as `UAT_PROBE_FORBIDDEN`. Existing UAT stays PASS.
5. Leave US-0150 OPEN. Do not tick backlog acceptance boxes. Do not edit `.cursor/scratchpad.md`. Do not write `handoffs/resume_brief.md`.

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

**6 pass / 0 fail.** Duration 1921.5022 ms. Exit code 0.

## AC checklist

| AC | Expectation | Evidence | Result |
|---|---|---|---|
| AC-1 | One composition root resolves config and builds kernel, bridge, supervisor, broker, intelligence/context, and an operational store. | Marker `test_us0150_runtime_host_resolves_one_config_and_builds_graph` passed. The contract imports `createRuntimeHost` and expects `RUNTIME_SERVICE_UNAVAILABLE` when intelligence is unavailable. | PASS |
| AC-2 | CLI and daemon use that composition. The host-present daemon path has no literal empty config. Missing prerequisites fail closed. | Marker `test_us0150_cli_and_daemon_use_runtime_host_not_throwing_kernel` passed. Tasks T-002 done-when is covered by that marker. | PASS |
| AC-3 | A production session is fresh, attested, custom-tool only, and deny-by-default. | Marker `test_us0150_host_creates_fresh_attested_custom_tool_session` passed. Production path calls `createRuntimeHost` with no factories. | PASS |
| AC-4 | File, edit, shell, git, and intelligence tools execute or deny, with no `ok:` success text. | Marker `test_us0150_admitted_tool_executes_or_denies_without_placeholder_success` passed. The contract asserts result text does not match `/^ok:/`. | PASS |
| AC-5 | The operational store is not artifact authority. Dispose does not delete repository files. | Marker `test_us0150_bridge_validator_and_operational_store_preserve_artifact_authority` passed. `dispose()` is invoked twice in the production-composition marker. | PASS |
| AC-6 | Production-composition tests cover a real Pi session, fresh role sessions, admission/denial, validator blocking, persisted run state, and unavailable services. | All six markers passed, including `test_us0150_production_composition_unavailable_services_and_disposal` (573.2404 ms) on the local model seam. | PASS |

## Harness

- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/run-tests.ps1`
- Exit code: **0**
- `tests/report.md` timestamp **2026-10-11T15:39:14Z**
- **Pass 880 / Fail 0**
- Triad rows `triad check passes on repo` and `triad check idempotent rerun passes`: **PASS**

## UAT

A live daemon or paid-model probe stays `UAT_PROBE_FORBIDDEN`. This phase did not start a daemon and did not call a paid model. Existing UAT result remains **PASS** (`sprints/S0170/uat.md`, `sprints/S0170/uat.json`). Those files still cite the QA harness timestamp `2026-10-11T15:26:11Z`. This verify-work harness is Pass 880 / Fail 0 at `2026-10-11T15:39:14Z`.

## Guards held

- US-0150 stays OPEN. AC boxes stay unchecked.
- US-0149 was not reopened. US-0151 was not started.
- No `.env` read, no commit, no push, no publish, no `/auto`, no subagent spawn.
- `.cursor/scratchpad.md` was not edited. `handoffs/resume_brief.md` was not written.

## Triad

- Pre-append `docs/engineering/state.md` was **1174** lines, under the inclusive 1200 cap. This checkpoint was sized to stay at or under 1200, so the oldest checkpoint was not archived.
- Post-append the hot file is **1188** lines. Checkpoints left in place include this verify-work checkpoint, the US-0150 qa-pair checkpoint, the US-0150 execute-pair checkpoint, the US-0150 plan checkpoint, the US-0150 discovery checkpoint, the US-0149 closure checkpoint, and the BUG-0033 refresh checkpoint.
- `python scripts/enforce-triad-hot-surface.py --repo . --check` exit **0**.

## Next

Fresh `/release` for US-0150 / S0170. This verify-work child does not spawn it. US-0150 stays OPEN.
