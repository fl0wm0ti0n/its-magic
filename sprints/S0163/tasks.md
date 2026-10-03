# Sprint S0163 — Task checklist (BUG-0022)

Total tasks: 7 (T-anch + T-001..T-007). This is within `SPRINT_MAX_TASKS=12`; no split is required.
The seven map 1:1 to the architecture `# BUG-0022` task seeds; the 8 markers of the architecture
test contract are distributed across T-005 (m1–m6) and T-006 (m7 parity + m8 no-sibling-mutation).

## Execution order

1. T-anch — Verify planning constraints (anchors, surfaces, guards) read-only
2. T-001 — Insert additive pre-spawn model-resolution step + critic step-1 alignment (active `auto.md`)
3. T-002 — Template mirror `template/.cursor/commands/auto.md` (byte-parity)
4. T-003 — Frontmatter alignment: remove `model: inherit` from `{po,release}.mdc` + template twins
5. T-004 — Provenance/isolation-row format lock + runbook addendum + prose consistency
6. T-005 — `tests/bug0022_cursor_task_spawn_model_test.py` (active) markers m1–m6
7. T-006 — Template test mirror + marker m7 (parity) + m8 (no-sibling-mutation)
8. T-007 — Regressions (us0101/0102/0104/0130 + self-test + bug0021/0023/0030) + runbook/parity sync

## Checklist

- [ ] **T-anch**: Verify `# BUG-0022`, R-0154 DQ1–DQ10 LOCKED, no companion DEC, the 5 touch surfaces (D9), and the sibling/DoD guard set. Confirm `scripts/model_tier_lib.py` / `sovereign_critic_lib.py` and the catalog schema are unchanged; confirm US-0156 is the DoD gate and BUG-0022 is OPEN. Do **not** edit architecture, research, backlog status, or acceptance. (DC)
- [ ] **T-001**: In `.cursor/commands/auto.md`, insert the normative **pre-spawn model resolution** step **before step 4** with the exact `# BUG-0022` wording: on success emit Task `model:<slug|alias>` and record `model_id`/`model_provenance` on the isolation row; on fail-closed record the `ReasonCode` token and emit **no silent `model:`**; emit `model:inherit` with `MODEL_RESOLVE_FALLBACK` provenance **only** when steps 1–4 all miss and a documented override is present. Align the *Cross-model adversarial critic* hook: step 1 resolves `producer_model_id` via `resolve_model_for_phase` and uses it as the producer `model:`; step 2 threads `select_critic_model(...)` `critic_model_id`; `degraded=true` unchanged. (AC-1, AC-2, AC-3, AC-4)
- [ ] **T-002**: Mirror the T-001 change into `template/.cursor/commands/auto.md` byte-for-byte (active↔template parity). (AC-1, AC-2, AC-8)
- [ ] **T-003**: Remove the hardcoded `model: inherit` frontmatter key from `.cursor/agents/po.mdc` and `.cursor/agents/release.mdc` (+ template twins) so they are keyless like dev/qa/security/tech-lead; leave `curator.mdc` `model: fast` untouched. No new key, no schema change. (AC-4, AC-8)
- [ ] **T-004**: Lock the additive isolation-row contract: `model_id=<slug|alias|inherit>` + `model_provenance=<result.provenance>` (or `unresolved-<REASON_CODE>`); the silent-inherit detection rule (D8); and add the **one-line** `docs/engineering/runbook.md` § *Role catalog enablement recipe* addendum (orchestrator MUST run `resolve_model_for_phase` per phase before Task spawn and record `model_provenance`). Keep `auto.md` / runbook prose consistent. (AC-6)
- [ ] **T-005**: Author `tests/bug0022_cursor_task_spawn_model_test.py` (active) with markers m1–m6 via a mock Task-spawn harness (no live Cursor): (m1) producer spawn carries catalog-resolved `model:` for resolvable roles; (m2) critic carries `roles.critic`, not `composer-2.5-fast`; (m3) role-gap roles emit `MODEL_ROLE_SLUG_UNKNOWN` with no silent `inherit`; (m4) `inherit` only on a documented step-4/5 override with `MODEL_RESOLVE_FALLBACK`; (m5) `test_us0101_*`/`test_us0102_*`/`test_us0104_*`/`test_us0130_*` + `model_tier_lib --self-test` stay green; (m6) every producer/critic isolation row carries additive `model_id` + `model_provenance`. (AC-1..AC-6, AC-5)
- [ ] **T-006**: Author `template/tests/bug0022_cursor_task_spawn_model_test.py` (parity mirror); implement m7 `test_bug0022_active_template_parity` (byte-parity: `auto.md` + template twin, 6-agent `.mdc` pair set, `scripts/model_tier_lib.py` ↔ template, test-file mirror, and 8-path catalog-example parity → `MODEL_CATALOG_EXAMPLE_PARITY_SCOPE_OK`) and m8 `test_bug0022_no_sibling_mutation` (`test_bug0021_*` / `test_bug0023_*` / `test_bug0030_*` suites green as-is; US-0156 OPEN/unchecked; `backlog ### BUG-0022` OPEN). (AC-7, AC-8)
- [ ] **T-007**: Run and record regressions: `test_us0101_*` / `test_us0102_*` / `test_us0104_*` / `test_us0130_*` + `python scripts/model_tier_lib.py --self-test` → `[MODEL_TIER_SELF_TEST_OK]`; `test_bug0021_*` / `test_bug0023_*` / `test_bug0030_*` green as-is; `scripts/model_tier_lib.py` ↔ `template` byte-parity; confirm no resolver-lib mutation; runbook addendum + template-parity sync complete. No npm publish, no git push, no `.env` reads. (AC-7, AC-8)

## Completion gate

- [ ] All 8 architecture-owned `test_bug0022_*` markers pass (T-005 m1–m6 + T-006 m7, m8).
- [ ] `test_us0101_*` / `test_us0102_*` / `test_us0104_*` / `test_us0130_*` + `model_tier_lib --self-test` stay green; `test_bug0021_*` / `test_bug0023_*` / `test_bug0030_*` suites green as-is (no sibling mutation).
- [ ] Active↔template byte-parity holds for `auto.md` (+ twin), the 6-agent `.mdc` pair set, `scripts/model_tier_lib.py`, the test-file mirror, and the 8-path catalog-example scope (`MODEL_CATALOG_EXAMPLE_PARITY_SCOPE_OK`).
- [ ] No silent `model: inherit` for a resolvable catalog role; only a documented step-4/5 fallback emits `model: inherit` with `MODEL_RESOLVE_FALLBACK`; role gaps emit `MODEL_ROLE_SLUG_UNKNOWN`.
- [ ] No companion DEC authored; resolver libs and catalog schema unchanged; `.opencode/` surface untouched; no STOP `auto.md` restore.
- [ ] BUG-0022 remains **OPEN** (AC-1..AC-8 unchecked) and US-0156 remains **OPEN** (DoD gate held) — no backlog/acceptance mutation during plan/execute.

## Execute evidence (T-anch..T-007)

- _Pending — `/execute` (fresh dev) records commands/results here. Do not claim QA PASS or live
  Cursor completion from planning. `UAT_PROBE_FORBIDDEN` held._
