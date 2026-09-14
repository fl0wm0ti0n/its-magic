# Sprint S0151 - Task checklist (US-0143)

Total tasks: 11 (T-anch + T-001..T-010). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0143`. Sprint id S0151 (next free after S0150 occupied by US-0142). Do not overwrite S0140–S0150. Do not reuse S0146 (BUG-0021), S0147 (US-0140), S0148 (BUG-0023), S0149 (US-0141), or S0150 (US-0142).

**Isolation**: `tl-US0143-sprintplan-20260914T073000Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-us0143`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (lift `DEFERRED_COMMANDS` + `RouteScheduled` + compose-amend `test_us0140_command_coverage`)
3. T-002 (ConfigView independent axis lookups + preset expand-before-run)
4. T-003 (TS L8 adapter + conflict code + golden vectors)
5. T-004 (compressed graphs: ultra_lean held; mega_quick/`/quick` tests+acceptance)
6. T-005 (WorkflowEngine `runAuto`/`runQuick` §14.4 loop)
7. T-006 (drain/bulk/retry/skip/quiet/pause/approval caps)
8. T-007 (YAML stop-matrix consume + AC-6 additive `security_hard`)
9. T-008 (audit + repair JSONL + mid-resume `discardOrphans`)
10. T-009 (critic-hook slot only; US-0144 content OUT)
11. T-010 (12 `test_us0143_*` Win/Linux fake-model)
12. Integration verification

## Critic NB awareness (execute)

- **T-001/T-003/T-007/T-010** (`us0143arc-challenger-001` NB1): AC-6 terminals locked DEC-0143. Compose-amend `test_us0140_command_coverage`. L8 golden vs Python kit SOT. `RouteScheduled` vs 7-step. `AUTONOMY_PRESET=full` cannot relax AC-6. Never read `.env`. `compute_strict_proof_hash` tuple unamended.
- **T-anch..T-010** (`us0143arc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is S0151 (S0150 occupied by US-0142); execute owns runtime-core lift + `delivery-router.ts` + 12 tests; architecture owns H1+DEC-0143; do not rewrite GateEngine/`RELEASE_GATE_ORDER`; US-0144 content OUT.
- **T-anch** (`us0143arc-subtractor-003` NB3): verification-only; do not rewrite `# US-0143` / DEC-0143 / R-0141; reject A2–A15; do not add sibling auto-scheduler; do not restore `auto.md`; do not amend isolation/`noTools`/KernelBridge/PolicyEngine tables/RoleCatalog internals/config loaders; do not mark DONE; do not reopen US-0133..US-0142; do not design US-0144+; do not drain BUG-0024; do not own credentials or read `.env`; do not mutate BUG-0021/0022/0023/0024 or S0146/S0147/S0148/S0149/S0150; 12 markers required.

## Task checklist

- [x] **T-anch**: Verify `# US-0143` H1 in `docs/engineering/architecture.md`; DEC-0143 Accepted; approach A1 LOCKED; R-0141 DQ1–DQ10 LOCKED; 12-marker table locked; compose guards (US-0140 lift deferred only / GateEngine unamended; US-0118 L8 Python kit SOT; US-0119 YAML consume not fork; US-0096 ultra_lean skip held; KernelBridge unamended; isolation/`noTools` unamended; kit `files` omit `standalone/`; US-0144+ out; US-0133..US-0142 DONE; BUG-0021 DONE not mutated; BUG-0022 OPEN not mutated; BUG-0023 DONE not mutated; BUG-0024 OPEN not drained; S0146/S0147/S0148/S0149/S0150 not reused; R-0120..R-0141 intact; R-0139 remains US-0142; R-0138 remains US-0141; R-0140 remains BUG-0024). Verify `workflow/delivery-router.ts` and `test_us0143_*` do NOT yet exist (or document baseline). Record to `sprints/S0151/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0143.md` / `docs/engineering/research.md` R-0141 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Lift deferred `/auto`/`/quick` inside existing `@its-magic/runtime-core`. Create nested `src/workflow/delivery-router.ts`. `SCHEDULER_COMMANDS = ["/auto","/quick"]`. Fate of `DEFERRED_COMMANDS`: empty (`[] as const`) or removed. `CommandRouter.route("/auto"|"/quick")` → `RouteScheduled` (`ok: true`, `implemented: true`, `plan`, `axes`, `in_process_producer: false`, `host_scheduling_only: true`). Does **not** run 7-step for the scheduler command. Programmatic 16-command path **unamended**. Keep `WORKFLOW_ROUTE_DEFERRED` in `codes.ts` unused for these two names. `listCommands()` still lists `/auto` and `/quick` as implemented scheduler commands. **No Pi imports.** Do not add a Biome override. Kit `files` omit `standalone/`. Do not add a sibling `packages/auto-scheduler`. Compose-amend `test_us0140_command_coverage` so it no longer expects deferred `/auto`/`/quick` (US-0140 ACs stay DONE). Tests: markers 1, 2 (owned by T-010). (AC-1)

- [x] **T-002**: Five independent axes must not fold. Consume-only ConfigView lookups: `lookupDeliveryMode` (exists), `lookupTokenProfile`, `lookupVoice`, `lookupAutonomyPreset`, `lookupWorkKindRouting`. Values: delivery `standard`\|`ultra_lean`\|`mega_quick`; token `lean`\|`balanced`\|`full`; voice CAVEMAN family; autonomy `none`\|`balanced`\|`full`; work-kind `WORK_KIND_ROUTING` `0`\|`1`. **No new RuntimeConfig domain / loader rewrite**. Call `@its-magic/config` `expandAutonomyPreset` **before** `runAuto`/`runQuick`. Compressed modes still require tests + acceptance. Tests: markers 3, 5, 8. (AC-2, AC-4)

- [x] **T-003**: TS adapter `resolveDeliveryRoute` in `delivery-router.ts` ports `scripts/work_kind_routing_lib.py` with golden vectors vs Python fixtures. Python remains kit SOT. Precedence LOCKED: `start-from` > explicit `DELIVERY_MODE` > `AUTO_PHASE_*` > work-kind > default `standard`. Conflict → `WORK_KIND_DELIVERY_MODE_CONFLICT`. Mid-story switch → `DELIVERY_MODE_SWITCH_MID_STORY`. `WORK_KIND_ROUTING=0` early-return `WORK_KIND_ROUTING_OFF`. Do **not** add `work_kind_classify` to KernelBridge `ALLOWED_VALIDATOR_NAMES`. Reject LLM classification. Tests: markers 6, 7. (AC-3)

- [x] **T-004**: Compressed graphs LOCKED. `standard` = full `CANONICAL_PHASES`. `ultra_lean` = existing skip `plan-verify` held. `mega_quick` and **`/quick`** = `execute` → `qa` → `verify-work` → `release` → `closure` → `refresh-context`. Must not skip test evidence, UAT/acceptance, or GateEngine. `/quick` forces mega_quick shape (not a prompt). Eligibility remains US-0096. Ineligible → existing `DELIVERY_MODE_INELIGIBLE` / `MEGA_QUICK_*`. Tests: markers 3, 4. (AC-2)

- [x] **T-005**: `WorkflowEngine` owns `while run active` (masterplan §14.4). New methods `runAuto(input)`, `runQuick(input)`. Reuse existing `runExecuteQaLoop` for execute↔qa and unamended `evaluateRelease` before release. CommandRouter resolves the plan; it does not drain. Host Cursor/OpenCode remain scheduling-only. Tests: markers 1, 9. (AC-1, AC-5)

- [x] **T-006**: Caps consume resolved config (no new domain): `AUTO_LOOP_MAX_CYCLES`, `AUTO_BACKLOG_MAX_STORIES`, `AUTO_BACKLOG_ON_BLOCK`, `AUTO_EXECUTE_MAX_ITEMS`, `AUTO_BLOCK_RETRY_MAX`, `AUTO_PAUSE_REQUEST`, `AUTO_QUIET`, operator approvals. Exhaust → `WORKFLOW_LOOP_CAP` / `BLOCK_RETRY_CAP_EXHAUSTED` / `BUDGET_EXHAUSTED`. Bug-drain axis required (AC-5) but this run `AUTO_BUG_QUEUE=0` (do **not** drain BUG-0024). Pause, skip, approval, and `AUTONOMY_PRESET=none` remain operator-visible and non-bypassable. Tests: marker 9. (AC-5)

- [x] **T-007**: Consume `scripts/data/autonomy_stop_matrix.yaml` via kernel locate path (file read, not a new validator). Do **not** weaken existing US-0119 `security_hard`. Mirror additive codes into `stop-matrix/codes.ts` (consume-not-fork). AC-6 terminals LOCKED even under `AUTONOMY_PRESET=full`: `DECISION_UNRESOLVED`, `KERNEL_INCOMPATIBLE`, `QUALITY_EVIDENCE_FAILED`, `BUDGET_EXHAUSTED`, `RESUME_AMBIGUOUS` + existing YAML `security_hard`. Models never decide relaxability. GateEngine order unamended. Tests: markers 8, 10. (AC-4, AC-6)

- [x] **T-008**: Dual-write `RunsStore.audit` + append-only `handoffs/autonomy_repair_ledger/<orchestrator_run_id>.jsonl`. Repo artifacts remain canonical. SQLite is **not** stop/DONE SOT (`RECOVERY_FALSE_COMPLETION` held). Ledger fields LOCKED: phase selection, retries, skips, stop reason, resume choice, repair kind, cap remaining, axis snapshot. Mid-process resume: `discardOrphans` + fresh correct-role spawn. Never restore old specialist transcript. Never switch `DELIVERY_MODE` mid-story. Tests: marker 11. (AC-7)

- [x] **T-009**: Existing `scheduleSupplementaryHooks` when `CROSS_MODEL_REVIEW=1`. US-0144 critic/memory/convergence **content** OUT — this story only schedules the slot. Do not implement lenses, memory digest, or convergence evaluators. Tests: marker 1 (hook scheduled, content absent). (AC-1)

- [x] **T-010**: Create contract tests covering exactly 12 markers (DEC-0143 §9). Primary: `standalone/tests/contract` (`node:test`) Windows + Linux. Fake-model CI. In-memory SQLite. No paid model calls. Count stays 12.
  1. `test_us0143_auto_route_implemented`
  2. `test_us0143_quick_route_implemented`
  3. `test_us0143_standard_lifecycle_auto`
  4. `test_us0143_compressed_ultra_lean_mega_quick`
  5. `test_us0143_axis_independence`
  6. `test_us0143_l8_precedence_start_from`
  7. `test_us0143_work_kind_conflict`
  8. `test_us0143_preset_expand_stop_matrix`
  9. `test_us0143_drain_caps_operator_authority`
  10. `test_us0143_nonrelaxable_terminals`
  11. `test_us0143_audit_ledger_mid_resume`
  12. `test_us0143_autonomy_disabled`
  Do not weaken `test_us0133_*` / `test_us0134_*` / `test_us0135_*` / `test_us0136_*` / `test_us0137_*` / `test_us0138_*` / `test_us0139_*` / `test_us0140_*` / `test_us0141_*` / `test_us0142_*`. Compose-amend `test_us0140_command_coverage` only. (AC-1..AC-8)

## Integration verification (post T-010)

- [x] Test gate: standalone npm test covers 12/12 `test_us0143_*` plus compose us0133..us0142 still green
- [x] Import-boundary gate: no Pi imports in `packages/runtime-core`; kit `files` omit `standalone/`; no sibling auto-scheduler
- [x] Isolation gate: AgentKernel empty loader / `noTools` builtin / KernelBridge / auth-models store / PolicyEngine tables / RoleCatalog internals / config loaders unamended; fake-model CI held; DEC-0038 tuple unamended; GateEngine `RELEASE_GATE_ORDER` unamended
- [x] Scope gate: no credentials / `.env` reads; no US-0144 content; no `auto.md` restore; no BUG-0024 drain; no US-0144+ authoring; no GateEngine rewrite
- [x] Status gate: US-0143 remains OPEN; AC-1..AC-8 unchecked; intake JSON not mutated; US-0133..US-0142 remain DONE; BUG-0021/BUG-0022/BUG-0023/BUG-0024 not mutated; S0146/S0147/S0148/S0149/S0150 not mutated

## Files to touch (scope)

### New (create)

- `standalone/packages/runtime-core/src/workflow/delivery-router.ts` (L8 + independent axes + compressed plans)
- `standalone/tests/contract` `test_us0143_*` (`node:test`)
- `handoffs/autonomy_repair_ledger/` JSONL (execute; per-run)
- `sprints/S0151/t-anch-verification.md` (execute)

### Edit (scoped)

- `standalone/packages/runtime-core/src/workflow/types.ts` — `SCHEDULER_COMMANDS`; empty/remove `DEFERRED_COMMANDS`; `RouteScheduled`
- `standalone/packages/runtime-core/src/workflow/command-router.ts` — lift `/auto`/`/quick` to `RouteScheduled`
- `standalone/packages/runtime-core/src/workflow/workflow-engine.ts` — `runAuto` / `runQuick`
- `standalone/packages/runtime-core/src/workflow/config-view.ts` — consume-only axis lookups
- `standalone/packages/runtime-core/src/stop-matrix/codes.ts` — additive AC-6 codes (consume-not-fork)
- `test_us0140_command_coverage` — compose-amend (US-0140 ACs stay DONE)
- `.github/workflows/ci.yml` — extend existing standalone Windows+Linux job only if glob would miss new tests

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` / `DEC-0143.md` | locked in /architecture |
| PolicyEngine decision tables | unamended |
| KernelBridge / isolation / `noTools` | unamended |
| RoleCatalog internals | inject spawn only |
| config loaders | consume lookups / `expandAutonomyPreset` only |
| DEC-0038 tuple | UNAMENDED |
| GateEngine `RELEASE_GATE_ORDER` | US-0140 DONE — unamended |
| CommandRouter 7-step producer path | unamended (scheduler is not 7-step) |
| US-0144 critic/memory content | OUT |
| US-0141 / US-0142 / S0149 / S0150 | DONE — do not reopen |
| S0146 / BUG-0021 | DONE — do not mutate |
| S0148 / BUG-0023 | DONE — do not mutate |
| BUG-0022 / BUG-0024 | OPEN — do not mutate / do not drain |
| `.env` / credentials | never read |
| `.opencode/commands/auto.md` restore | forbidden |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-005, T-009 (T-010 m1–m2) |
| AC-2 | T-002, T-004 (T-010 m3–m5) |
| AC-3 | T-003 (T-010 m6–m7) |
| AC-4 | T-002, T-007 (T-010 m8) |
| AC-5 | T-005, T-006 (T-010 m9) |
| AC-6 | T-007 (T-010 m10) |
| AC-7 | T-008 (T-010 m11) |
| AC-8 | T-010 (m12; plus m1–m11) |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. T-010 markers attest AC-1..AC-8. No `PLAN_AC_COVERAGE_GAP`.
