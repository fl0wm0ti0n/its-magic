# Sprint S0166 — BUG-0032 / execute progress (dev)

## T-anch — baseline / no-op verification (DC) — DONE

- **Timestamp**: 2026-10-04T14:00:00Z (UTC)
- **fresh_context_marker**: `dev-BUG0032-execute-20261004T140000Z-fresh` (dev execute context)
- **role**: dev (execute phase)
- **Read-only observations** (no writes in this step):
  - `docs/engineering/architecture.md` L3590–L3702 `# BUG-0032 — AUTONOMY_FLAGS_DRIFT drift-detect + live-wins sync contract` — A1 semantic declared-mirror drift gate; verdict `ARCHITECTURE_PASS`; `decision_gate=false`; 8 seed tasks `T-anch..T-007`; 8 test markers PLANNED; live-wins operator-sync (drift-DETECT, NOT drift-FIX); BUG-0032 stays **OPEN**. `# BUG-0032` H1 durable.
  - `docs/engineering/research.md` L16040–L16070 `## R-0156 — BUG-0032 autonomy flag baseline/live drift contract` — DQ1 exit-contract + DQ2 doc-token (NOT stop-matrix) + live-wins + security boundary + DQ3 CI-always-run + test strategy; US-0131 10/10; US-0119 8P+2F (matrix-ref baselines, pre-existing, not to be weakened/repaired).
  - **No companion DEC** (R-0156 verdict "No companion DEC recommended"; next-free id **DEC-0154 NOT allocated**).
  - `docs/product/backlog.md` L5673–L5692 `### BUG-0032` — `Status: OPEN`, AC-1..AC-7 all `- [ ]` **unchecked** (guards #1: NOT flipped this phase).
  - `docs/product/acceptance.md` L223 `- [ ] BUG-0032: ... (7 ACs; P0)` **unchecked** (guards #1 hold; NOT flipped this phase).
  - `.its-magic/config.json` L3 header ("Values mirrored from .cursor/scratchpad.md") — baseline mirror-claim asserted; **currently false** (drift). L145 `INTAKE_SUBAGENT_FALLBACK: deny`; L318 `AUTONOMY_PRESET: full`; L320 `AUTONOMY_STOP_POLICY: auto_repair_then_block`; L324 `INTAKE_AUTONOMY_MODE: 0`. `shared:` block spans L10–L347 (schema_version=1 at L9).
  - `.cursor/scratchpad.md` L637–L640 `AUTONOMY_REPAIR_CAP_OVERRIDE` documentation; **L639** `AUTONOMY_PRESET=none`; **L640** `AUTONOMY_STOP_POLICY=block`. Drift vs baseline on both keys is the bug under test.
  - `scripts/check_intake_template_parity.py` — active/template byte-identical (`706CE2BE…3BB39`); `SCOPES` dict at L867–L941 (`"all"` at L904–L940); `main()` at L944–L980 (byte-pair loop L962–L976; `--scope` choices from `SCOPES.keys()` at L954); `--repo` default L949. Slot for the semantic branch: **before** the for-loop at L962 per architecture §"T-001".
  - `scripts/host_runtime_config_lib.py` L196 `strip_jsonc` (self-contained char scanner) — the JSONC pattern this semantic scope will mirror (no import needed — keep the checker self-contained stdlib-only).
  - `tests/us0119_autonomy_preset_test.py` L11–L168 (8 pass + 2 pre-existing matrix-ref failures on `validator self_test` + `no_orphan_codes`; orphans: BUDGET_EXHAUSTED/DECISION_UNRESOLVED/KERNEL_INCOMPATIBLE/QUALITY_EVIDENCE_FAILED/RESUME_AMBIGUOUS). L97–L111 `test_us0119_security_hard_gates_never_auto_repaired` asserts `auto_repair_kind == "n/a"` for all `security_hard` rows.
  - `tests/us0131_contract_test.py` L1–L60: 10 markers; uses `host_runtime_config_lib` for fixture-based resolver tests.
  - `tests/run-tests.ps1` US-0131 block at L1680–L1684 (pattern: scope parity assert 0, then pytest assert 0); `tests/run-tests.sh` equivalent at L1544–L1552.
  - `docs/engineering/reason_codes.md` L455–L468 (`## Other stories` section with **BUG-0031** row at L468) — additive insertion point for the `AUTONOMY_FLAGS_DRIFT` row.
  - `docs/engineering/runbook.md` L4236–L4342 (`## Autonomy preset keys (US-0119 / DEC-0119)`); the `AUTONOMY_FLAGS_DRIFT` remediation entry will be appended as a new `##` section AFTER this (or inserted after the existing `## Story closure` section at L4343 — whichever is lower-disruption).
  - `scripts/data/autonomy_stop_matrix.yaml` — **NOT mutated this phase** (guard #3; BUG-0034 owns that registration).
  - `scripts/bug_issue_validate.py` — bridge; `bug_issue_lib` imported at L13.
  - Siblings HOLD: BUG-0031/0027/0022/0016/0019-0025/0030 DONE (not reopened); BUG-0033/0034/0026/0028/0029 OPEN (not drained); US-0156 DONE; US-0154/0155 OPEN; US-0119 shipped (compose); US-0131/DEC-0131 compose; DEC-0152/0153 UNTOUCHED; S0127..S0165 terminal; **S0166 next-free** (materialized by sprint-plan, consumed this phase).
- **Guards (non-negotiable) held**:
  - #1 BUG-0032 row (backlog + acceptance) NOT flipped / ticked this phase (closure owns).
  - #2 No `decisions/DEC-*.md` author or amendment; **no DEC-0154 allocation**.
  - #3 US-0119 / US-0131 / DEC-0131 / BUG-0031/0027/0022/0016/0019-0025/0030 / BUG-0033/0034/0026/0028/0029 / `autonomy_stop_matrix.yaml` / US-0156 — all untouched (compose-only where applicable).
  - #4 No TUI / RPC / JSON command template / localhost surface restored.
  - #5 No `/auto` invocation, no sub-agent spawn, no phase work outside `/execute`.
  - #6 No `.env` read, no `npm publish`, no `git push`, no live Cursor/OpenCode IDE probe.
  - #7 Config / scratchpad NOT mutated — **drift-DETECT only, NOT drift-FIX** (operator live-sync is T-005, documented in the runbook entry).
  - #8 12 per-feature flags + `AUTONOMY_PRESET=none` byte-identity + `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` + security-hard rows (`auto_repair_kind=n/a`) + `auto_repair_kind=n/a` / `cap=0` rows — all **unchanged**.
  - #9 No `test_bug0032_*` markers pre-T-004 (authored at T-004).
  - #10 No `--scope=all` CI invocation in `run-tests.ps1`/`.sh` (docs/release-note references only — the deliberate fail-on-real-repo is intentional per architecture §T-001).
- **Pre-write validator**: `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **[BUG_VALIDATION_OK] exit 0** (before any write in this phase).

## Verdict (T-anch)

**T-anch PASS** — read-only anchors verified. All checks pass; all guards held. US-0119 2 pre-existing matrix-reference failures documented (guard #3 — NOT weakened, NOT repaired). US-0131 10/10. Sibling HOLD. No writes performed in this T-anch step. Proceed to T-001 (semantic handler).

## T-001 — `--scope=autonomy-flags` semantic handler (AC-2, AC-3, AC-4, AC-5) — DONE

- **Timestamp**: 2026-10-04T14:12:00Z
- **Files modified (this task)**: `scripts/check_intake_template_parity.py` + `template/scripts/check_intake_template_parity.py` (byte-identical mirror).
- **What landed** (additive; existing scope tables untouched):
  - `import json` added to the module (stdlib-only; no new dependency).
  - Module-level contract constants: `AUTONOMY_FLAGS_SCOPE = "autonomy-flags"`, `AUTONOMY_FLAGS_KEYS = ("AUTONOMY_PRESET", "AUTONOMY_STOP_POLICY")` (fixed key order — PRESET first), `_AUTONOMY_CONFIG_REL = ".its-magic/config.json"`, `_AUTONOMY_SCRATCHPAD_REL = ".cursor/scratchpad.md"`, `_OK_BANNER`, `_DRIFT_PREFIX`.
  - `_strip_jsonc(text)` — local string-aware JSONC comment stripper (mirror of `host_runtime_config_lib.strip_jsonc` so the checker stays stdlib-only; `//` + `/* */` removed, string contents preserved).
  - `_config_shared_values(config_path) -> (dict[str,str], errored)` — reads + JSONC-strips + `json.loads`; returns the `shared` scalar mapping; `errored=True` when the file is missing/unreadable/not-object/`shared` not dict (fail-closed).
  - `_scratchpad_assignments(scratchpad_path) -> (dict[str, list[str]], errored)` — exact non-comment `KEY=VALUE` assignments; duplicate key => multiple values (unevaluable → drift).
  - `_scratch_value(values, key)` — the value when assigned **exactly once** and non-empty, else `None` (missing / duplicate / empty are all treated as drift so CI fails closed).
  - `check_autonomy_flags(root) -> int` — **the** semantic scope. Both keys exactly-once-present on both sides and equal ⇒ **exit 0** + exact banner `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags`. Any mismatch / missing / duplicate / unreadable / unparseable ⇒ **exit 1**, one fixed-order line per affected key (AUTONOMY_PRESET first): `[AUTONOMY_FLAGS_DRIFT] scope=autonomy-flags key=<KEY> config=<value-or-<missing>> scratchpad=<value-or-<missing>>`, **no success banner**. `--repo` redirects **both** inputs. Never writes to either surface.
  - `main()` short-circuit: `if args.scope == AUTONOMY_FLAGS_SCOPE: return check_autonomy_flags(root)` **before** the byte loop (R-0156 DQ1 + arch §1) — the semantic verdict is returned and the byte loop is skipped for this scope.
  - `--scope=all` invokes the semantic scope **after** the byte-pair checks (so it intentionally fails on the real drifted repo until the operator remediates — R-0156 DQ1 / arch §T-001): `if args.scope == "all": return check_autonomy_flags(root)`.
  - `SCOPES` gains `"autonomy-flags": ()` — a dedicated **semantic** sentinel (NOT a byte-pair table) so the scope is registered in argparse; the pair value is the empty tuple.
- **Byte parity (active = template)**: `EC5B24C5EB6F034BF50BEEA39F598A0C24ED3C3DA2C5237C742374187F58B3D5` (both) — **MATCH** (mirror copied; verified `Get-FileHash` equality).
- **Self-test (direct CLI)**:
  - Real repo (drifted): `--scope=autonomy-flags --repo .` → **exit 1**, two fixed-order lines (PRESET first, then POLICY), **no** success banner — intended fail-closed behavior.
  - Identity fixture: `--scope=autonomy-flags --repo <identity>` → **exit 0** + `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags`.
  - All 7 fixtures verified exit-0/exit-1 as expected (see T-004).
- **Regression guard**: `tests/us0121_host_mode_test.py::...parity_scope` PASS (checker byte-parity + `opencode-adapter` registration intact); `--help` lists `autonomy-flags`. Two pre-existing failures (`us0108`/`us0112` `SCOPES` membership asserts on **other** scopes, `model-catalog-examples` / `sovereign-parallel-dev`) are **pre-existing on HEAD** — confirmed by `git checkout HEAD -- checker` + re-run (both fail identically on the pristine file); not caused by, and not repaired by, this phase.

## T-002 — reason-code + runbook registration (AC-2, AC-6) — DONE

- **Timestamp**: 2026-10-04T14:20:00Z
- **Files modified (this task)**: `docs/engineering/reason_codes.md` + `template/docs/engineering/reason_codes.md` (byte-identical); `docs/engineering/runbook.md` + `template/docs/engineering/runbook.md` (byte-identical).
- **reason_codes.md**: additive bullet under `## Other stories` (after the BUG-0031 row, compose-additive, no rewrite of the index):
  `- **BUG-0032** (declared-mirror drift-detect on \`AUTONOMY_PRESET\` / \`AUTONOMY_STOP_POLICY\`; composes US-0119): \`AUTONOMY_FLAGS_DRIFT\`` — US-0119 cross-reference + repair-name token.
- **runbook.md**: new remediation entry **titled exactly `AUTONOMY_FLAGS_DRIFT`** (AC-6 verbatim) inserted immediately before `## Story closure (US-0120)`:
  - `exit 1` diagnostic contract + the exact `[AUTONOMY_FLAGS_DRIFT] ...` line shape.
  - **Live-wins operator-sync** remediation (T-005 operator step documented here): re-read live scratchpad values → copy those two values to `config.json shared` → re-run the scope (must print `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags` exit 0) → record the decision in BUG-0032 closure evidence.
  - **Do NOT** auto-repair from CI (drift-DETECT only); do **NOT** register in `autonomy_stop_matrix.yaml` (BUG-0034 owns); do **NOT** alter `autonomy_preset_lib.py` / 12 flags / `PRESET_DEFINITIONS` / precedence / stop-matrix / `security_hard` (`n/a`); `INTAKE_AUTONOMY_MODE=0` + `INTAKE_SUBAGENT_FALLBACK=deny` unchanged (AC-5).
  - Related-artifacts block (architecture `# BUG-0032`, R-0156, reason_codes.md, 8-marker tests, CI).
- **Byte parity (active = template)**: reason_codes.md `MATCH`; runbook.md `MATCH` (both pairs verified `Get-FileHash` equality).
- **NOT the stop-matrix**: `scripts/data/autonomy_stop_matrix.yaml` **unchanged** (8,374 bytes; BUG-0034 owns that registration; R-0156 DQ2 forbids stop-matrix changes here).

## T-003 — CI wiring (AC-3) — DONE

- **Timestamp**: 2026-10-04T14:22:00Z
- **Files modified (this task)**: `tests/run-tests.ps1` + `tests/run-tests.sh`.
- **What landed** (mirrored BUG-0032 block **immediately after the US-0131 (26AE) block**, in **both** harnesses — **always-run, NOT changed-file filtered**, fail-closed):
  - Run `check_intake_template_parity.py --scope=autonomy-flags --repo tests/fixtures/bug0032_autonomy_flags/identity` and **assert exit 0** (the identity fixture = the AC-2 "exit 0 + reason-code-free banner" case).
  - Then `pytest tests/bug0032_autonomy_flags_drift_test.py -q` and assert exit 0 (the 8-marker suite).
- **Both OS file blocks** are independent, ordered after US-0131, and use the shared `tests/fixtures/bug0032_autonomy_flags/identity` fixture (created in T-004) so the harness asserts the success path while the suite covers drift/fail-closed.

## T-004 — 8-marker contract suite (AC-1..AC-7) — DONE

- **Timestamp**: 2026-10-04T14:28:00Z
- **Files created (this task)**:
  - `tests/bug0032_autonomy_flags_drift_test.py` — **8** `test_bug0032_*` markers per the R-0156 DQ3 inventory (byte-identical `template/tests/` mirror copied):
    1. `test_bug0032_scope_registration_parity` — scope registered in `SCOPES`; `AUTONOMY_FLAGS_KEYS` fixed order (PRESET first); `check_autonomy_flags` callable; active↔template checker **byte parity**.
    2. `test_bug0032_equal_fixture_exit0` — identity fixture → **exit 0** + exact banner, no drift line.
    3. `test_bug0032_preset_only_drift_exit1` — PRESET-only drift → exit 1, `key=AUTONOMY_PRESET config=full scratchpad=none`, POLICY not reported, no banner.
    4. `test_bug0032_policy_only_drift_exit1` — POLICY-only drift → exit 1, `key=AUTONOMY_STOP_POLICY`, PRESET not reported, no banner.
    5. `test_bug0032_two_key_deterministic_order` — both drift → exactly two lines, PRESET **before** POLICY.
    6. `test_bug0032_malformed_fail_closed` — duplicate / missing / unparseable all **fail closed** (exit 1, no banner); duplicate surface reported `<missing>` (unevaluable).
    7. `test_bug0032_repo_fixture_isolation` — `--repo` redirects both inputs; real baseline/live sources **not mutated** (bytes compared before/after every fixture run; identity fixture exits 0 even where the real repo is drifted).
    8. `test_bug0032_us0119_security_invariants` — `AUTONOMY_PRESET=none` → empty expansion; `full` → 12 flags; `security_hard` rows `auto_repair_kind=n/a`; `AUTONOMY_FLAGS_DRIFT` **NOT** in the stop matrix (BUG-0034 owns); `INTAKE_AUTONOMY_MODE=0` + `INTAKE_SUBAGENT_FALLBACK=deny` unchanged (AC-5).
  - `tests/fixtures/bug0032_autonomy_flags/` — **7 fixtures** (≥ the required identity / preset-drift / policy-drift / malformed / two-key-drift), each a `.its-magic/config.json` + `.cursor/scratchpad.md` pair:
    - `identity` (both keys equal `none`/`block`) → exit 0.
    - `preset-drift` (config `full` vs scratch `none`) → exit 1 (PRESET).
    - `policy-drift` (config `auto_repair_then_skip` vs scratch `block`) → exit 1 (POLICY).
    - `two-key-drift` (both divergent) → exit 1 (both, fixed order).
    - `malformed-duplicate` (scratch `AUTONOMY_PRESET` twice) → fail-closed exit 1.
    - `malformed-missing` (config + scratch both miss `AUTONOMY_PRESET`) → fail-closed exit 1.
    - `malformed-unparseable` (config is not JSONC) → fail-closed exit 1 (both keys `<missing>` on the config side).
  - **Fixture/test isolation**: fixtures only; **no real source file is edited by the tests** (R-0156 DQ3); `--repo` points the scope at each fixture.
- **Test runs** (this task):
  - `python -m pytest tests/bug0032_autonomy_flags_drift_test.py -v` → **8 passed** exit 0 (active).
  - `python -m pytest template/tests/bug0032_autonomy_flags_drift_test.py -q` → **8 passed** exit 0 (template twin resolves the active repo root and reads active fixtures + active/template checker).
  - Byte parity: `tests/bug0032_autonomy_flags_drift_test.py` = `template/tests/bug0032_autonomy_flags_drift_test.py` **MATCH**.

## T-005 — operator live-wins sync doc (AC-1, AC-6) — DONE (operator step; documented, not code)

- **Timestamp**: 2026-10-04T14:30:00Z
- **What landed**: the operator live-wins sync step is **documented in the runbook entry § `AUTONOMY_FLAGS_DRIFT`** (T-002) — the "Operator remediation (live-wins sync)" sub-section: (1) re-read live scratchpad values, (2) copy exactly those two values to `config.json shared`, (3) re-run the scope (must exit 0 + banner), (4) record the operator decision in BUG-0032 closure evidence.
- **Code contract is drift-DETECT only** (the scope never writes to either surface); the drift is **not** fixed by the checker.
- **NOT performed this phase** (operator action only): `.its-magic/config.json` and `.cursor/scratchpad.md` are **NOT mutated** — verified unchanged (baseline `AUTONOMY_PRESET: full` L318 / `AUTONOMY_STOP_POLICY: auto_repair_then_block` L320; live `AUTONOMY_PRESET=none` L639 / `AUTONOMY_STOP_POLICY=block` L640; `INTAKE_SUBAGENT_FALLBACK: deny` L146 / `INTAKE_AUTONOMY_MODE: 0` L324 all intact).
- **Closure-evidence path**: the operator's live-wins sync decision is to be recorded in `sprints/S0166/closure-verification.md` (closure owns). This execute phase only **documents** the step; it does **not** perform AC-1's operator decision or the status/AC flip.

## T-006 — compose / non-regression guard (AC-4, AC-5, AC-7) — DONE

- **Timestamp**: 2026-10-04T14:34:00Z
- **Guard results** (all re-run post-T-005; **no NEW failures vs the T-anch baseline**):
  - `python -m pytest tests/us0119_autonomy_preset_test.py -q` → **8 passed, 2 failed — exit 1**. The **exact same 2 pre-existing** matrix-reference failures as the T-anch baseline (`test_us0119_matrix_validator_passes`, `test_us0119_matrix_no_orphan_codes`; orphans BUDGET_EXHAUSTED/DECISION_UNRESOLVED/KERNEL_INCOMPATIBLE/QUALITY_EVIDENCE_FAILED/RESUME_AMBIGUOUS) — **NOT weakened, NOT repaired** (guard #3). US-0119 `none` byte-identical held (empty expansion) + 12 flags intact (asserted by marker 8).
  - `python -m pytest tests/us0131_contract_test.py -q` → **10 passed — exit 0** (baseline 10/10, unchanged).
  - `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **PRE (T-anch) `[BUG_VALIDATION_OK]` exit 0** and **POST (this gate) `[BUG_VALIDATION_OK]` exit 0** (AC-7).
  - `python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo tests/fixtures/bug0032_autonomy_flags/identity` → **exit 0** + `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags`.
  - `python scripts/check_intake_template_parity.py --scope=autonomy-flags --repo tests/fixtures/bug0032_autonomy_flags/preset-drift` → **exit 1** + fixed-order `[AUTONOMY_FLAGS_DRIFT]` line, no banner.
  - Active↔template **byte parity MATCH** for all four touched pairs: checker, reason_codes.md, runbook.md, bug0032 test file.
  - `scripts/data/autonomy_stop_matrix.yaml` — **unchanged** (8,374 bytes; `security_hard` rows `auto_repair_kind=n/a`; `AUTONOMY_FLAGS_DRIFT` NOT registered — BUG-0034 owns).
  - `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny` unchanged (AC-5).
- **Note (guard #10 honesty)**: running `--scope=all` against the **real** repo now **intentionally fails** (exit 1) because the current live/baseline drift is unresolved and the operator has not yet performed the T-005 live-wins sync — this is the documented, intended fail-closed behavior from R-0156 DQ1 / arch §T-001, **not** a regression. It does **not** break CI: neither `tests/run-tests.ps1` nor `tests/run-tests.sh` invokes `--scope=all` (verified; only historical release-notes / state-archives reference it). The always-run BUG-0032 CI block (T-003) runs the **identity fixture** (exit 0) + the 8-marker suite.

## T-007 — QA / verify-work / release handoffs (downstream) — DONE (handoff authored; downstream spawn deferred)

- **Timestamp**: 2026-10-04T14:36:00Z
- **What landed**: the dev→qa continuation handoff is authored in `handoffs/dev_to_qa.md` (this sprint's BUG-0032 / S0166 EXECUTE entry), naming the next phase **`/qa`** (fresh qa context; ultra_lean plan-verify merged at `/qa`). This dev context does **not** spawn `/qa` / `/verify-work` / `/release` / `/closure` / `/auto` (BUG-0006 / US-0048 spawn-only isolation).
- **Downstream (not this phase)**: `/qa` (QA findings + ultra_lean plan-verify), `/verify-work`, `/release`, then `/closure` (the post-BUG-0031 curator 3-allow flip-path: backlog `### BUG-0032` `Status: OPEN`→`DONE` + AC-1..AC-7 `[ ]`→`[x]` + `sprints/S0166/closure-verification.md` + AC-1 operator live-wins decision — all closure-owned; DEC-0152 DENY-FIRST honored).

## Completion gate (from sprint.md / tasks.md) — status

- [x] `--scope=autonomy-flags` semantic scope exists in active + template (byte-identical); existing scope tables unchanged.
- [x] Equal fixture → exit 0 + `[INTAKE_TEMPLATE_PARITY_OK] scope=autonomy-flags`; drift/missing/duplicate/malformed → exit 1 + fixed-order `[AUTONOMY_FLAGS_DRIFT]` line(s), no success banner.
- [x] `AUTONOMY_FLAGS_DRIFT` additive row in reason_codes.md + runbook remediation entry (AC-6 verbatim); **not** in the stop-matrix; template twins byte-identical.
- [x] Mirrored BUG-0032 CI block after US-0131 in both `run-tests.ps1` + `run-tests.sh`; always-run.
- [x] 8 `test_bug0032_*` markers pass in active + template; fixtures only, no real source edit.
- [x] US-0119 `none` byte-identical; 12 flags, `INTAKE_AUTONOMY_MODE=0` / `INTAKE_SUBAGENT_FALLBACK=deny`, security-hard rows unchanged; US-0131 10/10; US-0119 2 pre-existing matrix-ref failures not weakened/repaired.
- [x] `python scripts/bug_issue_validate.py --repo . --check-acceptance` exits 0 pre + post.
- [x] BUG-0032 remains **OPEN**, AC-1..AC-7 remain `[ ]` unchecked — closure owns the flip.

## Execute evidence (required by tasks.md)

- **Verdict**: **EXECUTE_PASS**
- All 8 tasks (T-anch + T-001..T-007) DONE, in the locked order.
- Pre-write validator exit 0 (T-anch) + post-write validator exit 0 (T-006) — `[BUG_VALIDATION_OK]` both.
- 8/8 active + 8/8 template `test_bug0032_*` PASS; identity fixture exit-0 + banner; drift/missing/duplicate/malformed exit-1 (7 fixtures, all as spec).
- US-0131 10/10; US-0119 8 passed + 2 pre-existing failures (documented baseline, NOT weakened/repaired).
- Active↔template byte-identical across 4 touched pairs (checker, reason_codes.md, runbook.md, bug0032 test file).
- `scripts/data/autonomy_stop_matrix.yaml` unchanged (BUG-0034 owns); config.json + scratchpad.md unchanged (T-005 operator action, drift-DETECT only).
- BUG-0032 remains **OPEN**, P0, all seven AC rows **unchecked**; backlog `### BUG-0032` `Status: OPEN`; acceptance L223 `- [ ]`. Closure owns the flip per US-0045.
- **Next phase**: `/qa` in a fresh qa context (per handoff; do NOT run `/qa` from this dev context).

---

**Stop condition (this phase)**: STOP after `handoffs/dev_to_qa.md` is authored. Per `.opencode/agents/dev.md` and BUG-0006 spawn-only rule, do NOT spawn `/qa`, `/verify-work`, `/release`, `/closure`, `/auto`, `/refresh-context`, or any subsequent phase from this dev context. The orchestrator (not this dev context) owns the next spawn.
