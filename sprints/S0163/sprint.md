# Sprint S0163 — BUG-0022 `/auto` Task-spawns inherit parent chat model instead of role_catalog

## Metadata

| Field | Value |
|---|---|
| sprint_id | S0163 |
| bug_id | BUG-0022 (Status OPEN — authority `docs/product/backlog.md`) |
| status | PLANNED |
| current_phase | sprint-plan |
| delivery_mode | ultra_lean |
| approach | A1 (A\*) — resolve-then-spawn contract (D5 mock-injection, no live Cursor probe) |
| research_anchor | R-0154 (DQ1–DQ10 LOCKED) |
| architecture_anchor | `docs/engineering/architecture.md` `# BUG-0022` |
| companion_DEC | none (same defect-class pattern as BUG-0021/0023/0024/0025/0027/0030) |
| task_count | 7 (T-anch + T-001..T-007; <= SPRINT_MAX_TASKS=12; no split) |
| plan-verify | skipped: ultra_lean; not in the resolved phase plan (no QA spawn from planning) |
| DoD gate | BUG-0022 is the last OPEN DoD blocker for US-0156 (BUG-0027 DONE); closing it unblocks US-0156 closure — this sprint does **not** tick or release US-0156 |

## Scope

Close the Cursor IDE `/auto` Task-spawn model-inheritance defect. The root cause is one hop
downstream of the (DONE and correct) resolver libs: the Cursor spawn contract never consumes
them, so every `/auto` producer **Task spawn** still carries the parent chat model (silent
`inherit`) and the **critic spawn** still carries a hardcoded release slug (`composer-2.5-fast`).

The fix is a **resolve-then-spawn contract** on the Cursor surface only:

- Before **any** Task spawn, `.cursor/commands/auto.md` (and its `template/` twin) calls
  `model_tier_lib.resolve_model_for_phase(phase_id, scratchpad, catalog)` (DEC-0087 / US-0102,
  source **unchanged**) and threads the resulting `slug`/`alias` into the Task `model:` payload.
- The critic hook aligns: step 1 resolves `producer_model_id` via the same resolver and uses it as
  the producer `model:`; step 2 threads `sovereign_critic_lib.select_critic_model(...)` output
  `critic_model_id` (catalog `roles.critic`) into the critic `model:` — **never** a hardcoded
  release slug. `degraded=true` (US-0130) behavior is unchanged.
- Agent frontmatter becomes a neutral default: `.cursor/agents/{po,release}.mdc` lose the
  hardcoded `model: inherit` (keyless like dev/qa/security/tech-lead); curator `model: fast` is
  untouched (explicit tier-alias, out of the inherit surface). Template twins mirror byte-for-byte.
- `MODEL_FALLBACK=inherit` is honored **only** when the 5-step chain reaches step 4/5 **and** a
  documented scratchpad override is present; otherwise the spawn carries **no silent `model:`** —
  fail-closed per the 7-token `ReasonCode` set, recorded on the isolation row.
- Each `/auto` spawn isolation row in `docs/engineering/state.md` gets additive `model_id` and
  `model_provenance` (or `unresolved-<REASON_CODE>`) so a reviewer can distinguish "resolved from
  catalog" vs "parent inherit" per spawn.

Proven by a mock-injection contract suite (`tests/bug0022_cursor_task_spawn_model_test.py` +
`template/` mirror, 8 markers) — **not** a live Cursor probe (`UAT_PROBE_FORBIDDEN` held).

## Acceptance coverage

Surjective map of BUG-0022 AC-1..AC-8 (authority `docs/product/backlog.md § ### BUG-0022`) to tasks.
All eight acceptance criteria are covered by at least one task.

| Acceptance criterion | Task coverage |
|---|---|
| AC-1 producer spawn carries catalog-resolved `model:` (not silent inherit) | T-001, T-002, T-005 (m1) |
| AC-2 critic spawn carries `roles.critic` (not a hardcoded release slug) | T-001, T-002, T-005 (m2) |
| AC-3 phase→logical-role→catalog-key alignment resolve or fail-closed `MODEL_ROLE_SLUG_UNKNOWN` | T-001, T-005 (m3) |
| AC-4 `MODEL_FALLBACK=inherit` only on documented step-4/5 override; never silent default | T-001, T-003, T-005 (m4) |
| AC-5 reproducible mock-injection contract test (pytest) proving spawn contract | T-005 (m1–m4, m6), T-006 |
| AC-6 isolation/provenance records distinguish resolved vs inherited; silent-inherit detectable | T-004, T-005 (m6) |
| AC-7 sibling integrity (no merge/drain/reopen; catalog hygiene tracked as bounded follow-on) | T-006 (m8), T-007 |
| AC-8 no npm publish / git push / `.env` reads; `template/` parity; catalog schema unchanged; no STOP `auto.md` | T-002, T-006 (m7), T-007; DC → T-anch |

Primary acceptance (`docs/product/acceptance.md`) BUG-0022 row and backlog AC-1..AC-8 remain
**unchecked** — they are cited to DONE only by verify-work/closure per US-0045.

## Task summaries

1. **T-anch** (baseline) — Verify `# BUG-0022` + R-0154 DQ1–DQ10 + no companion DEC + the 5 touch
   surfaces (D9) + sibling/DoD guards, read-only. Confirm the resolver libs (`model_tier_lib.py` /
   `sovereign_critic_lib.py`) and catalog schema are **unchanged** and that US-0156 is the DoD gate
   (BUG-0022 open). Do **not** edit architecture, research, backlog status, or acceptance.
2. **T-001** — Insert the additive **pre-spawn model resolution** step in `.cursor/commands/auto.md`
   (active) **before step 4** ("spawn a fresh subagent…"), with the exact normative wording in
   `# BUG-0022`; align the *Cross-model adversarial critic* hook step 1 (resolve `producer_model_id`
   via `resolve_model_for_phase`, use as producer `model:`) and step 2 (thread `critic_model_id`).
   Fail-closed: emit **no silent `model:`** and record the `ReasonCode` token on the isolation row.
3. **T-002** — Mirror the T-001 change verbatim into `template/.cursor/commands/auto.md` (byte-parity).
4. **T-003** — Frontmatter alignment: **remove** `model: inherit` from
   `.cursor/agents/{po,release}.mdc` (+ template twins) so they are keyless like
   dev/qa/security/tech-lead; confirm curator `model: fast` is untouched. No new key, no schema change.
5. **T-004** — Provenance / isolation-row contract: lock the additive `model_id` + `model_provenance`
   row format (`provenance=host=cursor;path=<catalog-relative>;step=<step-1..5>` or
   `unresolved-<REASON_CODE>`), the silent-inherit detection rule (D8), and the one-line
   `docs/engineering/runbook.md` § *Role catalog enablement recipe* addendum (orchestrator MUST run
   `resolve_model_for_phase` per phase before Task spawn and record `model_provenance`); keep prose
   consistent across `auto.md` / runbook / reference.
6. **T-005** — Author `tests/bug0022_cursor_task_spawn_model_test.py` (active) with the 8 markers
   (m1–m6 here; m7 parity + m8 sibling-mutation land in T-006): producer catalog model; critic
   `roles.critic`; role-gap fail-closed; inherit-only-on-documented-fallback; 5-step-chain compose
   (us0101/us0102/us0104/us0130 + `model_tier_lib --self-test` green); provenance isolation row.
7. **T-006** — Author `template/tests/bug0022_cursor_task_spawn_model_test.py` (parity mirror);
   implement m7 `test_bug0022_active_template_parity` (byte-parity auto.md twin + 6-agent `.mdc` pair
   + `scripts/model_tier_lib.py` parity + test mirror + 8-path catalog-example parity
   `MODEL_CATALOG_EXAMPLE_PARITY_SCOPE_OK`) and m8 `test_bug0022_no_sibling_mutation` (bug0021/0023/0030
   suites as-is; US-0156 OPEN; BUG-0022 OPEN).
8. **T-007** — Regressions + docs: run `test_us0101_*` / `test_us0102_*` / `test_us0104_*` /
   `test_us0130_*` + `python scripts/model_tier_lib.py --self-test` → `[MODEL_TIER_SELF_TEST_OK]`; run
   `test_bug0021_*` / `test_bug0023_*` / `test_bug0030_*` suites green as-is; confirm
   `scripts/model_tier_lib.py ↔ template` byte-parity and no resolver-lib mutation; record runbook
   addendum + template-parity sync. No npm publish, no git push, no `.env` reads.

## Locked reason codes and contracts

- Reuse the **7-token** `ReasonCode` set already in `scripts/model_tier_lib.py` — do **not** extend
  it or add a schema-version v3: `MODEL_TIER_INVALID`, `MODEL_CATALOG_INVALID`, `MODEL_SLUG_UNKNOWN`,
  `MODEL_RESOLVE_FALLBACK`, `MODEL_OVERRIDE_SLUG_UNKNOWN`, `MODEL_ROLE_SLUG_UNKNOWN`,
  `MODEL_CATALOG_SCHEMA_V2_INVALID`.
- The required contracts are the 8 markers in the architecture test contract: producer catalog model,
  critic `roles.critic`, role-gap fail-closed, inherit-only-on-documented-fallback, 5-step-chain
  compose-green, provenance isolation row, active/template parity (+ 8-path catalog-example
  `MODEL_CATALOG_EXAMPLE_PARITY_SCOPE_OK`), and no-sibling-mutation (US-0156/BUG-0022 OPEN; bug0021/
  0023/0030 suites as-is).
- Role→catalog gaps (`qe`/`curator`/`tech-lead`/`closure`/`sprint-plan`) remain
  **unresolved-but-cited** (`MODEL_ROLE_SLUG_UNKNOWN` per spawn), never force-mapped; the bounded
  catalog-hygiene follow-on (missing keys + stale "Claude Opus 4.8" notes) is tracked alongside for a
  future `US-xxxx` slot — **not** this bug, **not** a schema redesign.

## Guards

- Do **not** merge/drain/reopen BUG-0021 / 0023 / 0024 / 0026 / 0027 / 0028 / 0029 / 0030.
- Do **not** reopen US-0101 / US-0102 / US-0104 / US-0130 resolver-lib ACs; do **not** mutate
  `scripts/model_tier_lib.py` / `scripts/sovereign_critic_lib.py` or their `template/` twins (parity
  is a regression guard only — no edit).
- Do **not** mutate or tick US-0156 (this bug **is** its DoD gate); do **not** flip `### BUG-0022`
  status or tick `docs/product/acceptance.md` (verify-work / closure owns per US-0045) — BUG-0022
  remains OPEN, AC-1..AC-8 unchecked.
- Do **not** touch the `.opencode/` surface (OpenCode US-0156/BUG-0030 dispatch class — distinct);
  do **not** restore STOP-only `.opencode/commands/auto.md`; do **not** add JSON `commands.auto`
  templates.
- Do **not** change the catalog `schema` (`schema_version` 1/2 unchanged); do **not** touch
  `.cursor/model-catalog.local.json` or `.cursor/scratchpad*.md` (operator-local, gitignored); do
  **not** author a companion DEC; do **not** author `decisions/DEC-*`.
- Do **not** claim a live Cursor IDE run (`UAT_PROBE_FORBIDDEN` held — D5 mock-only; live Cursor is
  operator UAT post-ship). No npm publish, no git push, no `.env` reads.

## Execution order

T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007.

## Next phase

`/sprint-plan` PASS. Orchestrator MUST spawn `/execute` in a fresh **dev** context (BUG-0006).
BUG-0022 remains **OPEN**; AC-1..AC-8 remain **unchecked** until the lifecycle closure owner acts
(verify-work / release / closure per US-0045). Do **not** spawn `/plan-verify` (ultra_lean) or
sovereign-critic from this planning context. STOP before implementation.
