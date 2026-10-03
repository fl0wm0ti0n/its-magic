# Sprint S0162 — Task checklist (US-0156)

Total tasks: 10 (T-anch + T-001..T-009). This is within `SPRINT_MAX_TASKS=12`; no split is required.

## Execution order

1. T-anch — Verify planning constraints
2. T-001 — Remove fallback resolution and add typed continuation resolution
3. T-002 — Validate precedence and effective-plan intersection
4. T-003 — Implement scheduler selection, mutex, cursor, and caps
5. T-004 — Consume Stop-Matrix continuation and persist idempotent provenance
6. T-005 — Define the sequential command/auto-agent parent contract
7. T-006 — Preserve the separate manual-persistence route and child evidence
8. T-007 — Repair permission-rule ordering without relaxing deny-by-default
9. T-008 — Add contracts, parity/installer coverage, and runbook guidance
10. T-009 — Run scoped and compose regression evidence

## Checklist

- [x] **T-anch**: Verify R-0153, DEC-0152, `# US-0156`, the BUG-0030 Markdown-command route, BUG-0027 DONE, and the US-0156 DoD/guard set. Do not edit architecture, research, backlog status, or acceptance. (baseline)
- [x] **T-001**: Add typed read-only continuation resolution in the bridge and related adapter/support code; remove every `fallback_execute` outcome. Fail before a Task spawn on resolver failure. (AC-2, AC-5, AC-6)
- [x] **T-002**: Enforce explicit `start-from`, then validated `resume_brief`, then validated `state.md`; resolve exactly one plan and intersect it with the anchor. Emit the locked failure codes for stale, ambiguous, unknown, or empty results. (AC-5, AC-6)
- [x] **T-003**: Select explicit `bug-target` before all other scheduling; otherwise select only dependency-eligible OPEN stories under backlog drain. Fail closed on story/bug conflict, unknown/DONE/blocked/empty work, and enforce cursor/budget limits. (AC-3, AC-4)
- [x] **T-004**: Consume only typed `auto_outer_driver.py` Stop-Matrix continuation actions and persist a bridge-owned, idempotent continuation tuple with source, plan, skips, cursor/budget, stop reason, and child evidence reference. (AC-2, AC-3, AC-5, AC-6)
- [x] **T-005**: Update active/template `auto.md` and the `auto` agent to resolve once, spawn one fresh policy-resolved role Task, wait for durable evidence, then continue or stop. Keep `agent: auto`; do not recursively call `/auto` or reintroduce retired dispatch surfaces. (AC-1, AC-2, AC-3, AC-8, AC-10)
- [x] **T-006**: Keep `persistManualPhaseIsolation` for direct manual commands only. Link real fresh child isolation evidence to `/auto` continuation records and fail closed on missing, conflicting, or reused evidence. The parent must remain unable to write phase artifacts. (AC-1, AC-6)
- [x] **T-007**: Put broad deny entries first and owned-path / auto-Task allows after them in active/template role maps. Preserve security read-only and prove last-match semantics without broad allow rules. (AC-8, AC-10)
- [x] **T-008**: Add all architecture-listed `test_us0156_*` contracts plus the permission-order regression, active/template parity checks, installer overwrite coverage, and runbook documentation. Default CI must not claim live desktop, `--pure`, or provider-complete success. (AC-1..AC-10)
- [x] **T-009**: Run targeted US-0156 tests and compose BUG-0027, BUG-0030, and permission-policy regressions. Capture commands/results in sprint evidence for QA; verify the DoD boundary without mutating independent bug status. (AC-7, AC-9, AC-10)

## Completion gate

- [x] All nine architecture-owned US-0156 test contracts and the permission-order contract pass.
- [x] Targeted BUG-0027 and BUG-0030 compose regressions pass; neither bug is reopened.
- [x] Active/template parity and installer overwrite coverage pass.
- [x] No fallback-to-`execute`, retired TUI/RPC route, JSON template, localhost endpoint, parent artifact write, or Stop-Matrix bypass is present.
- [x] US-0156 remains OPEN and acceptance remains unchanged pending later QA, verify-work, release, and closure phases.

## Execute evidence (T-009)

- US-0156 contracts: `tests/us0156_contract_test.py` — **10 passed** (nine `test_us0156_*` markers + `test_opencode_agent_permission_specific_paths_override_broad_deny`).
- Compose regression: `tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0030_opencode_auto_command_test.py tests/us0124_contract_test.py tests/us0156_contract_test.py` — **36 passed, 2 skipped** (BUG-0027 and BUG-0030 live-desktop probes skipped; neither bug reopened).
- Parity: `scripts/check_intake_template_parity.py` → `[INTAKE_TEMPLATE_PARITY_OK]`; active/template byte-hashes match for `scripts/opencode_auto_bridge.py`, `.opencode/plugins/orchestrator.ts`, `.opencode/commands/auto.md`, `.opencode/agents/auto.md`, and all role agents.
- Fail-closed verified live: no validated source ⇒ `OPENCODE_AUTO_RESOLUTION_FAILED` (no `execute` fallback); conflict ⇒ `AUTO_SCHEDULER_CONFLICT`; blocked ⇒ `OPENCODE_AUTO_DEPENDENCY_BLOCKED`; ambiguous ⇒ `OPENCODE_AUTO_RESUME_AMBIGUOUS`; budget 0 ⇒ `OPENCODE_AUTO_RESOLUTION_FAILED`.
- No `fallback_execute`, no `client.rpc(` active code, no localhost endpoint, no JSON command template. Parent remains `edit: deny` / spawn-only.
- Guard holds: `docs/product/acceptance.md` US-0156 row stays `[ ]`; backlog statuses unchanged; independent bugs not mutated.
