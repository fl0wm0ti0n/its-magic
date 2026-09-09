# Sprint S0134 - Task checklist (US-0132)

Total tasks: 10 (T-anch + T-001..T-009). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification (architecture critic NB3).

**Isolation**: `tl-US0132-sprint-plan-20260908T212407Z-fresh` · `model_id=cursor-grok-4.6` · `orchestrator_run_id=auto-20260908-us0132`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (inventory + unknown-path `MODEL_CONFIG_PATH_UNKNOWN`)
3. T-002 (schema-mix `MODEL_CONFIG_SCHEMA_MIX`)
4. T-003 (Cursor `provenance=` diagnostics overlay)
5. T-004 (OpenCode kit vs host layering + optional names-only host-JSON read)
6. T-005 (gitignore + exclude-from-clean + installer never-overwrite)
7. T-006 (`MODEL_CONFIG_*` codes + `HOST_COLLISION` distinct both-host row)
8. T-007 (materializer invariants)
9. T-008 (`model_tier_validate.py --scope model-config`)
10. T-009 (10 `test_us0132_*` + runbook h2 + README pointer)
11. Integration verification

## Critic NB awareness (execute)

- **THIS sprint-plan / T-anch** (`us0132arc-challenger-001` NB1): architecture_notes relocated from `### BUG-0016` onto `## US-0132` (form-feed removed). Do not reopen BUG-0016.
- **T-005** (NB1): explicit `.opencode/model-catalog.local.json` gitignore rows (root + template); exclude-from-clean named locals — do **not** copy-aside/restore. `[opencode_clean_paths] .opencode` must not delete `.opencode/model-catalog.local.json` or `.opencode/opencode.json{,c}`.
- **T-001 / T-004 / T-006 / T-008** (NB2): four surfaces only; optional host-JSON names-only (fail-open absent); `HOST_COLLISION` distinct under `--host both` alongside `PATH_UNKNOWN`; extend `--scope model-config` in place.
- **T-anch** (NB3): verification-only; do not rewrite `# US-0132` / `DEC-0132.md` in execute. A2/A3/A4 rejected. US-0131 DONE compose-only.

## Task checklist

- [x] **T-anch**: Verify `# US-0132` H1 in `docs/engineering/architecture.md`; verify DEC-0132 Accepted; approach A1 LOCKED; R-0117 DQ1–DQ10 LOCKED; 10-marker table locked; compose guards (US-0131 DONE compose-only; BUG-0015/0016 not reopened); verify `tests/us0132_contract_test.py` does NOT yet exist (or document baseline). Record to `sprints/S0134/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0132.md` in /execute. (DC / DEC baseline; NO-OP)

- [x] **T-001**: Implement canonical four-surface inventory and unknown-path gate. Scan **kit-owned, repo-scoped only**: `model.json` and `model.jsonc` at repo root, `.cursor/`, `.opencode/`. Present → `MODEL_CONFIG_PATH_UNKNOWN`. Do **not** alias to catalog or `opencode.json`. Do **not** scan `~/.config/opencode/model.json`. `--host both` never maps the generic file to either host. Tests: marker 1. (AC-1)

- [x] **T-002**: Keep Cursor vs OpenCode schemas separate. Cursor resolver **must not** read `.opencode/model-catalog.local.json`. OpenCode materializer **must not** read `.cursor/model-catalog.local.json` or scratchpad `MODEL_*`. Cross-offer (Cursor schema at OpenCode catalog path, or reverse) → `MODEL_CONFIG_SCHEMA_MIX`. No union schema. Tests: markers 2, 3. (AC-2)

- [x] **T-003**: Add Cursor resolver/validator `provenance=` overlay of the winning DEC-0087 step (`host=cursor`, path, step). Do **not** amend the 5-step chain or US-0130 critic overlay (`MODEL_SOVEREIGN-CRITIC` > catalog `roles.critic` > opposition / `dev` fallback). Absent catalog + `alias_only` remains **valid**. Tests: marker 4. (AC-3)

- [x] **T-004**: Document/implement OpenCode two independent layers (kit does not merge them). Kit materializer: absent catalog → no-op exit 0; present → inject `model: provider/slug` into **installed** `.opencode/agents/<role>.md` only. Optional kit diagnostic read of `opencode.json{,c}`: names-only (`model` string / agent model ids), fail-open if absent; malformed **present** file → `MODEL_CATALOG_INVALID` `scope=opencode-host`. Kit **never writes** `opencode.json{,c}`. Tests: markers 5, 8. (AC-3)

- [x] **T-005**: Gitignore + installer + clean exemption. Add explicit `.opencode/model-catalog.local.json` to **root** and **template** `.gitignore`. Keep `template/.opencode/.gitignore` `*.local.json` + `.opencode/opencode.json{,c}` rows. Do **not** force-gitignore repo-root `opencode.json{,c}`. **Never overwrite** on install/missing/upgrade: `.cursor/model-catalog.local.json`, `.opencode/model-catalog.local.json`, `.cursor/scratchpad.local.md`, repo-root and `.opencode/` `opencode.json{,c}`. **Exclude-from-clean** named locals (not copy-aside): `[opencode_clean_paths] .opencode` must not delete `.opencode/model-catalog.local.json` or `.opencode/opencode.json{,c}`; Cursor clean must not delete `.cursor/model-catalog.local.json` / `.cursor/scratchpad.local.md`. Shrinking `--host` must not delete the other host’s locals. Example delivery: Cursor examples on `--host cursor|both`; OpenCode example catalog on `--host opencode|both`; never deliver `opencode.json` or active catalogs. Triple-installer + manifest additive. Tests: markers 7, 9. (AC-6, AC-7)

- [x] **T-006**: Reason-code family. Reuse existing host-scoped `MODEL_*` / `OPENCODE_MODEL_SLUG_UNKNOWN` / scoped `MODEL_CATALOG_INVALID`. Add `MODEL_CONFIG_PATH_UNKNOWN`, `MODEL_CONFIG_SCHEMA_MIX`, `MODEL_CONFIG_HOST_COLLISION`. `--host cursor|opencode` + `model.json` → `PATH_UNKNOWN` only. `--host both` + `model.json` → `PATH_UNKNOWN` **and** `HOST_COLLISION` (never pick a host). Do **not** reuse `HOST_CONFIG_*`. Do **not** invent `OPENCODE_MODEL_CATALOG_INVALID`. Absent optional file ≠ invalid. Tests: markers 1, 5, 8, 10. (AC-5)

- [x] **T-007**: Confirm `opencode_model_catalog_apply.py` invariants: (1) idempotent second apply; (2) never write `template/.opencode/agents/**`; (3) never write the active local catalog; (4) never write Cursor catalog, scratchpad, or `opencode.json{,c}`; (5) no credentials / real operator slugs in examples; (6) absent catalog remains no-op exit 0. Tests: marker 6. (AC-4)

- [x] **T-008**: Extend in place `scripts/model_tier_validate.py`. Keep default unscoped Cursor checks and `--scope opencode-catalog`. Add `--scope model-config` covering inventory + unknown `model.json` + schema-mix + both-host coexistence + gitignore row. Do **not** fold into `opencode-catalog`. Reject a new `opencode_model_catalog_validate.py` as the default. Mirror template counterpart. Tests: markers 1, 2, 3, 8, 9. (AC-1, AC-5, AC-8)

- [x] **T-009**: Create `tests/us0132_contract_test.py` (+ `template/tests/` byte-identical) with **exactly 10** markers (AC-8). Markers:
  1. `test_us0132_canonical_inventory_rejects_model_json`
  2. `test_us0132_cursor_schema_not_interpreted_as_opencode`
  3. `test_us0132_opencode_schema_not_interpreted_as_cursor`
  4. `test_us0132_cursor_precedence_diagnostics_overlay`
  5. `test_us0132_opencode_absent_catalog_noop_vs_present_fail_closed`
  6. `test_us0132_materializer_idempotent_never_writes_template_or_host_json`
  7. `test_us0132_installer_preserves_local_model_files_including_clean`
  8. `test_us0132_both_host_independent_catalogs`
  9. `test_us0132_gitignore_opencode_catalog_explicit_row`
  10. `test_us0132_docs_migration_and_reason_codes`
  Static/fixture only — **no live OpenCode CI probe**. Add runbook h2 `## Cursor/OpenCode model configuration contract (US-0132)` (active + template byte-identical) covering inventory, per-host precedence, `model.json` migration, fail-closed codes, clean/install protection. README operator subsection pointer. Compose cross-link only on US-0126 OpenCode host runbook and US-0131 runtime-config h2 (do not rewrite those contracts). US-0126 table: **additive** `MODEL_CONFIG_*` rows only. (AC-8)

## Integration verification (post T-009)

- [x] Test gate: `python -m pytest tests/us0132_contract_test.py -v` → 10/10 PASS
- [x] Parity gate: active ↔ template lib / tests / runbook / gitignore row byte-identical where mirrored
- [x] Scope gate: no US-0131 reopen; no DEC-0086/0087/0123/0131 amendment; no live OpenCode probe; no `model.json` alias
- [x] Compose gate: Cursor 5-step + US-0130 overlay unchanged; materializer never writes host JSON; DEC-0039 locals preserved
- [x] Status gate: US-0132 remains OPEN; AC checkboxes unchecked; intake JSON not mutated

## Files to touch (scope)

### New (create)

- `tests/us0132_contract_test.py` + `template/tests/us0132_contract_test.py`
- `sprints/S0134/t-anch-verification.md` (execute)

### Edit (scoped)

- `scripts/model_tier_validate.py` (+ template) — `--scope model-config`
- Cursor resolver/diagnostics (`scripts/model_tier_lib.py` or validator) — additive `provenance=` only
- `scripts/opencode_model_catalog_apply.py` — confirm invariants; optional names-only host-JSON diagnostic read
- Root + template `.gitignore` — explicit `.opencode/model-catalog.local.json`
- Installer / `installer-owned-paths.manifest` — exclude-from-clean named locals; never-overwrite
- `docs/engineering/runbook.md` + template (US-0132 h2)
- README + US-0126 additive `MODEL_CONFIG_*` rows only
- Optional: `scripts/check_intake_template_parity.py` scope `us-0132`

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # US-0132`
- `decisions/DEC-0132.md`
- `docs/engineering/research.md ## R-0117`
- `docs/product/backlog.md ## US-0132` Status/ACs (US-0045)
- `docs/product/acceptance.md` US-0132 row
- `handoffs/intake_evidence/US-0131-0132-intake-20260906.json`

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| DEC-0086 / DEC-0087 / DEC-0123 / DEC-0131 | compose-only; do not amend |
| US-0131 runtime-config ACs | DONE — do not reopen |
| BUG-0015 / BUG-0016 artifacts | DONE — do not reopen (notes relocate already done) |
| `opencode.json` kit-key dump | forbidden (DEC-0131) |
| Live OpenCode CI probe | forbidden |
| Home-dir `~/.config/opencode/model.json` scan | forbidden (DQ1) |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-008, T-009 (m1) |
| AC-2 | T-002, T-009 (m2, m3) |
| AC-3 | T-003, T-004, T-009 (m4, m5, m8) |
| AC-4 | T-007, T-009 (m6) |
| AC-5 | T-006, T-008, T-009 (m1, m5, m10) |
| AC-6 | T-005, T-009 (m7) |
| AC-7 | T-005, T-009 (m7, m9) |
| AC-8 | T-008, T-009 (all 10) |
| DC / DEC | T-anch |

**Surjectivity check**: 8/8 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
