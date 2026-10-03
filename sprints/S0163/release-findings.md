# Release Findings — BUG-0022 / S0163 — RELEASE_PASS

- sprint_id: S0163
- story_id: (none)
- bug_id: BUG-0022
- phase_id: release
- role: release
- orchestrator_run_id: auto-20260930-bug0022
- delivery_mode: ultra_lean
- macro_phase: ship
- fresh_context_marker: release-BUG0022-20260930T210851Z-fresh
- timestamp: 2026-09-30T21:08:51Z (UTC)
- model_id: qwen3.8:27b (CROSS_MODEL_REVIEW=0 — no sovereign-critic consume required this segment)
- kit_version: 0.1.9 (unchanged — no semver bump this release)
- release_version: (blank — workflow-only)
- RELEASE_PUBLISH_MODE: confirm (publish deferred — no operator confirm this turn; orchestrator default-off)
- RELEASE_PUBLISH_AUTO_CONFIRM: 0
- SYNC_POLICY_MODE: disabled (no git push)
- FRAMEWORK_KIT_REPO: 1
- CROSS_MODEL_REVIEW: 0
- npm_published: false
- publish_status: deferred-to-operator-confirm / PUBLISH_CONFIRMATION_REQUIRED

## Verdict

**RELEASE_PASS** — mandatory gates 1–4b green. Queue S0163 → `released` with gate note that **npm publish is deferred** (`PUBLISH_CONFIRMATION_REQUIRED`). **No backlog mutation (closure owns OPEN→DONE per US-0045).** Acceptance BUG-0022 row `[ ]` unchecked. US-0156 not mutated (row 185 `[ ]`). No npm publish. No git push. No `/closure` spawn from this subagent. Do NOT claim a live Cursor IDE run (`UAT_PROBE_FORBIDDEN` — D5 mock-injection only). Do NOT reopen BUG-0021/0023/0024/0026/0027/0028/0029/0030.

## Gate chain

| Gate | Result | Evidence |
|------|--------|----------|
| 1 check_in_tests | PASS | Live **independent re-run** @ release 2026-09-30T21:08:51Z: `pytest tests/bug0022_cursor_task_spawn_model_test.py -v` **6/6** (m1–m6); `pytest template/tests/bug0022_cursor_task_spawn_model_test.py -v` **8/8** (m1–m8, inc. `test_bug0022_active_template_parity` + `test_bug0022_no_sibling_mutation`); `pytest tests/bug0030_opencode_auto_command_test.py -v` **4 pass / 2 skip** (inc. `test_bug0030_active_template_parity`); `pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py` **8 skip**; `pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py` **8 skip**; `pytest tests/us0156_contract_test.py` **10/10**. **Total 28 passed / 0 failed / 18 skipped (46 tests).** Parity `--scope model-tier|sovereign-critic|bug-0030` all `[INTAKE_TEMPLATE_PARITY_OK]`; `scripts/model_tier_lib.py --self-test` `[MODEL_TIER_SELF_TEST_OK]`; runbook active↔template **byte-identical 263345b** (SHA-256 `88168288…5F4BE`); US-0071 metadata guard `check-user-visible-metadata.py --repo .` exit 0; `harness_fail_zero_claimed=false` |
| 2 qa | PASS | `sprints/S0163/verify-work-findings.md` **VERIFY_PASS** (S0163_REMEDIATED_OK); 8/8 ACs PASS on fresh evidence; blocking findings resolved (prior F-001 runbook byte-parity closed); `sprints/S0163/qa-findings.md` QA_PASS (F-001 active-side edit-policy blocker remediated by dev cycle) |
| 3 uat | PASS | `contract_tests_primary`; `probe_kind=contract_tests_primary`; `live_cursor_ide_pass_claimed=false`; `provider_completion_claimed=false`; 6 live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (incl. `cli_smoke`) — mock/contract only, no live Cursor probe (D5) |
| 4 isolation | PASS | execute + remediation-dev + qa(verify-work) + release distinct `fresh_context_marker` in `docs/engineering/state.md`; CROSS_MODEL_REVIEW=0 |
| 4b strict_runtime_proof | PASS | **Consumed** (independently RECOMPUTED MATCH via `from scripts.token_cost_lib import compute_strict_proof_hash`): dev remediation `rp-auto-20260930-bug0022-remediate-dev-20260930T000000Z-BUG-0022` / `D913260AFAEC21EA0292895ABF5B58EE3F18667BADB018E98DF64BF9C976E0CE` — **MATCH**; qa verify-work `rp-auto-20260930-bug0022-reverify-qa-20260930T000000Z-BUG-0022` / `A07647CC1C4FAAA8DB992D7FA5E71270B8E94CFC7181CE33A83D8876EF61CC6F` — **MATCH** (not STALE on TTL 2026-09-30T01:00:00Z at recompute; hash valid) |
| 3a cross_repo | skipped | CROSS_REPO_OBSERVABILITY=0 |
| 3b component_scope | skipped | COMPONENT_SCOPE_MODE=0 |
| 3c spec_pack | skipped | SPEC_PACK_MODE=0 |
| 3d user_guide | skipped | USER_GUIDE_MODE=0 |
| 3e legacy_drift | PASS | BUG-0022 still **OPEN** (closure owns DONE flip) — no DONE/acceptance drift introduced this release |
| 3f readme_feature_coverage | skipped_not_enforced | `README_FEATURE_COVERAGE_ENFORCE` not enabled for this run (S0161 precedent: not_enforced); not blocking |
| 3g project_readme | skipped | FRAMEWORK_KIT_REPO=1 (kit_repo_skipped=true; exit 0) |
| publish | deferred | RELEASE_PUBLISH_MODE=confirm; orchestrator default-off; PUBLISH_CONFIRMATION_REQUIRED; npm_published=false; no kit semver bump |
| sync | not_eligible | SYNC_POLICY_MODE=disabled |
| version-doc (17) | skipped_no_release_version | workflow-only; release_version blank → `[Unreleased]` path; CHANGELOG `## [Unreleased]` Fixed bullet for BUG-0022 only (no kit semver / no per-version file) |
| finalization | PASS | queue S0163 → `released`; notes `handoffs/releases/S0163-release-notes.md`; backlog reconciliation **deferred to closure** (US-0045) |

## Doc gates (3e / 3f / 3g)

- **3e**: PASS — no new DONE-story drift for BUG-0022 (Status **OPEN**; acceptance row 213 `[ ]` unchecked; closure owns).
- **3f**: skipped_not_enforced — `README_FEATURE_COVERAGE_ENFORCE` not enabled this run; not blocking this sprint.
- **3g**: skipped (`FRAMEWORK_KIT_REPO=1`).

## UAT / browser honesty

- `probe_kind=contract_tests_primary`
- `live_cursor_ide_pass_claimed=false`
- `provider_completion_claimed=false`
- `fake_browser_pass_claimed=false`
- `harness_fail_zero_claimed=false`
- `live_npm_publish_probed=false`
- 6 live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (incl. `cli_smoke`) — D5 mock-injection contract only

## Independent re-verification (run myself, not copied from QA/dev)

> This release session independently re-ran and re-verified; do NOT trust the prior roles' word.

| Check | Command / method | Result |
|---|---|---|
| bug0022 active | `pytest tests/bug0022_cursor_task_spawn_model_test.py -v` | **6/6 PASSED** (0.13s) |
| bug0022 template | `pytest template/tests/bug0022_cursor_task_spawn_model_test.py -v` | **8/8 PASSED** (1.34s) — inc. `test_bug0022_active_template_parity` (m7) + `test_bug0022_no_sibling_mutation` (m8) **PASS** (both previously-failing lines now green) |
| bug0030 | `pytest tests/bug0030_opencode_auto_command_test.py -v` | **4 pass / 2 skip** — inc. `test_bug0030_active_template_parity` **PASS** (was FAIL = F-001) |
| bug0021 | `pytest tests/bug0021_opencode_cli_tui_plugin_load_test.py` | **8 skip** (as-is, no new failures) |
| bug0023 | `pytest tests/bug0023_opencode_cli_tui_dispatch_rpc_test.py` | **8 skip** (as-is, no new failures) |
| us0156 DoD gate | `pytest tests/us0156_contract_test.py -v` | **10/10 PASSED** (0.98s) |
| **Total** | — | **28 passed / 0 failed / 18 skipped (46 tests)** |
| runbook byte-parity (F-001) | `Get-FileHash … SHA256` + `Get-Item … Length` on active + template | **263345 b** both; SHA-256 `88168288261464514317AD5BB37CD3C13830293ECA427B222801436D5495F4BE` both → **MATCH** (F-001 CLOSED) |
| one-line addendum | read line 805 of both runbooks | identical `6. Pre-spawn model resolution (BUG-0022 / R-0154): … resolve_model_for_phase … model_provenance …` under `### Role catalog enablement recipe` (line 796) in BOTH → conformant to architecture.md:3183 |
| self-test | `python scripts/model_tier_lib.py --self-test` | `[MODEL_TIER_SELF_TEST_OK]` (exit 0) |
| resolver libs | `git status --porcelain scripts/{model_tier,sovereign_critic}_lib.py template/scripts/{...}` | **empty → UNMUTATED vs HEAD** (exit 0) |
| parity scopes | `check_intake_template_parity.py --scope model-tier|sovereign-critic|bug-0030` | all `[INTAKE_TEMPLATE_PARITY_OK]` (exit 0) |
| regression pairs | `Get-Item … Length` active vs template | po.mdc **7849↔7849** (keyless), release.mdc **839↔839** (keyless), auto.md **39231↔39231** — all byte-matched, keyless |
| US-0071 metadata | `check-user-visible-metadata.py --repo .` | exit 0 |

## Publish disposition

- **Mode**: `RELEASE_PUBLISH_MODE=confirm` / `RELEASE_PUBLISH_AUTO_CONFIRM=0` (orchestrator: default-off)
- **Operator confirm this session**: absent
- **Action taken**: no `npm publish`; no git push; no silent publish; no kit version bump
- **Status**: `deferred-to-operator-confirm` / `PUBLISH_CONFIRMATION_REQUIRED`
- **npm_published**: false
- **Release verdict impact**: not a FAIL — release PASS with publish deferred under confirm mode

## Strict runtime proof (release)

- runtime_proof_id: `rp-auto-20260930-bug0022-release-release-20260930T210851Z-BUG-0022`
- phase_id: `release`, role: `release`, bug_id: `BUG-0022`, sprint_id: `S0163`
- proof_issued_at: 2026-09-30T21:08:51Z
- proof_ttl_seconds: 3600 → proof_ttl: 2026-09-30T22:08:51Z
- **proof_hash: `9649B6C8AFB71A0E60907E9B940B440431FCA9DA873E4430658323810471D417`**
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional: orchestrator_run_id, runtime_proof_id, phase_id, role, proof_issued_at, proof_ttl_seconds; compact sorted-key JSON; SHA-256)
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260930-bug0022","phase_id":"release","proof_issued_at":"2026-09-30T21:08:51Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20260930-bug0022-release-release-20260930T210851Z-BUG-0022"}`
- **Consumed dev remediation**: `rp-auto-20260930-bug0022-remediate-dev-20260930T000000Z-BUG-0022` / `D913260AFAEC21EA0292895ABF5B58EE3F18667BADB018E98DF64BF9C976E0CE` — **independently RECOMPUTED = MATCH** (not STALE; hash valid)
- **Consumed qa verify-work**: `rp-auto-20260930-bug0022-reverify-qa-20260930T000000Z-BUG-0022` / `A07647CC1C4FAAA8DB992D7FA5E71270B8E94CFC7181CE33A83D8876EF61CC6F` — **independently RECOMPUTED = MATCH** (not STALE; hash valid)
- CROSS_MODEL_REVIEW=0 — no sovereign-critic proof consume required this segment
- **hash_recompute_confirmation=true** (second computation of my own release tuple → identical hash `9649B6C8…D417`; 64 hex; stored uppercase)

## Generated-test evidence (US-0066)

- generated_test_stack_profile: python (Cursor `/auto` Task-spawn model-resolve contract)
- generated_test_command: `python -m pytest tests/bug0022_cursor_task_spawn_model_test.py template/tests/bug0022_cursor_task_spawn_model_test.py -v`
- generated_test_result: pass (6 + 8 = 14 markers this release pass; 0.13s + 1.34s)
- generated_test_output_ref: this file § Independent re-verification; `sprints/S0163/verify-work-findings.md`; `sprints/S0163/qa-findings.md`
- generated_test_paths_ref: `tests/bug0022_cursor_task_spawn_model_test.py`, `template/tests/bug0022_cursor_task_spawn_model_test.py`
- generated_test_reason_code: none (pass)

## Sync-policy prerequisite

- phase_boundary=release
- policy_mode=disabled
- checks=test:pass(scoped_pytest_bug0022_active_6/6 @ release_2026-09-30T21:08:51Z;template_8/8;bug0030_4pass/2skip;bug0021_8skip;bug0023_8skip;us0156_10/10; total_28p/0f/18s (46);parity_model-tier+sovereign-critic+bug-0030_ALL_OK;runbook_active_template_byte-identical_263345b_SHA88168288…5F4BE;model_tier_self_test_OK;US-0071_metadata_OK;harness_fail_zero_claimed=false),lint:skipped,typecheck:skipped
- push_decision=not_eligible
- reason_code=SYNC_DISABLED
- evidence_refs=sprints/S0163/release-findings.md;handoffs/releases/S0163-release-notes.md

## Status confirmation (US-0045) — WHO OWNS THE DONE FLIP

**Rule I applied (documented, exact artifact+line):**

> **`docs/engineering/architecture.md:3236–3237`** (Non-goals and closure gate, `# BUG-0022`), verbatim:
> *"… do not tick `docs/product/acceptance.md` or flip `### BUG-0022` status (**verify-work / closure owns per US-0045**) — BUG-0022 remains **OPEN**, AC-1..AC-8 **unchecked**."*

> Corroborated by **`.cursor/commands/release.md:334-338`** (Steps, item 10):
> *"Backlog reconciliation is now handled by the dedicated `/closure` phase — see `.cursor/commands/closure.md`. **Story Closure holds exclusive responsibility for status flip (OPEN→DONE …), acceptance tick ([ ]→[x] …), closure checkpoint append …**"*

> Corroborated by **`.cursor/commands/closure.md:14-19`** (Phase responsibility):
> *"Story Closure holds exclusive responsibility for: 1. Status flip in `docs/product/backlog.md` … `OPEN` → `DONE`; 2. Acceptance checkbox … `[ ]` → `[x]` …"*

> Corroborated by **`docs/engineering/architecture.md:610`**: *"**Release ≠ closure** (AC-5): **Release cannot mark DONE (US-0045).**"*

**My read (documented):** The repo's own rule consistently and unambiguously assigns the **status flip (OPEN→DONE) + acceptance tick** to the **`/closure` phase** (US-0045). `/release` is explicitly excluded from marking DONE. I therefore applied the **strict "closure owns the flip"** reading — the same one the two prior QA verify-work cycles and the S0160/S0159 sibling releases applied. **This release phase DID NOT flip `### BUG-0022` → DONE and DID NOT tick `docs/product/acceptance.md` (row 213 stays `[ ]`).** BUG-0022 remains **OPEN** (now *eligible* for closure: all 8 ACs verified PASS).

- **BUG-0022** backlog/acceptance: **OPEN, unchanged** (this phase did not mutate `docs/product/backlog.md` or `docs/product/acceptance.md`)
- **US-0156**: **OPEN** (acceptance.md row 185 `[ ]`; **not mutated** — its own DoD gate = BUG-0022 + BUG-0027 DONE; BUG-0027 DONE, BUG-0022 *eligible-not-flipped*; US-0156 release is US-0156's own closure act per architecture.md:3235 + vision D10)
- **BUG-0027**: **DONE — NOT reopened** (acceptance.md row 218 `[x]`)
- **BUG-0021 / 0023**: **OPEN, untouched** (8 skip each; not reopened)
- **BUG-0024 / 0026 / 0028 / 0029 / 0030**: untouched / not reopened (BUG-0024 DONE, BUG-0027 DONE preserved)
- **resolver libs** (`scripts/model_tier_lib.py` / `scripts/sovereign_critic_lib.py` + template twins): **UNMUTATED** (git status clean)

## Non-blocking findings

1. **NB1 LIVE_CURSOR_IDE_RESIDUAL** — CI cannot prove a live Cursor IDE `/auto` Task-spawn resolves the catalog model (D5 mock-injection only). Residual behavior requires the operator's live Cursor re-probe post-ship. Does not block RELEASE_PASS.
2. **NB2 CATALOG_ROLE_HYGIENE** — role→catalog gaps (`qe`/`curator`/`tech-lead`/`closure`/`sprint-plan`) emit `MODEL_ROLE_SLUG_UNKNOWN` (unresolved-but-cited, never force-mapped). Bounded follow-on; tracked separately; **not** this bug, **not** a schema redesign. Does not block RELEASE_PASS.
3. **NB3 README_FEATURE_COVERAGE (3f)** — not enforced this run; no gap introduced for BUG-0022. Non-blocking.

## Blocking findings

None. (Prior F-001 runbook active↔template byte-parity defect closed by the dev remediation cycle; independently re-verified MATCH this release.)

## Next

`/closure` (fresh **qe** default; `AUTO_ROLE_CLOSURE` empty → qe; **curator** fallback if qe unavailable). CROSS_MODEL_REVIEW=0 — no sovereign-critic. **STOP** — do not spawn `/closure` from this subagent. **Do NOT mark BUG-0022 DONE. Do NOT tick AC-1..AC-8 in acceptance.md. Do NOT npm-publish. Do NOT git push. Do NOT claim a live Cursor IDE run. Do NOT reopen BUG-0021/0023/0024/0026/0027/0028/0029/0030. Do NOT mutate US-0156. Do NOT restore the TUI/RPC route / JSON `commands.auto` / localhost endpoint. Do NOT read `.env`.** The `/closure` phase (owns the DONE flip per US-0045) ships BUG-0022 + releases US-0156.
