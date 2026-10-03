# Release Findings — BUG-0031 / S0164 — RELEASE_PASS

- sprint_id: S0164
- story_id: (none)
- bug_id: BUG-0031
- phase_id: release
- role: release
- orchestrator_run_id: auto-20261001-bug0031
- delivery_mode: ultra_lean
- macro_phase: ship
- fresh_context_marker: release-BUG0031-20261001T224628Z-fresh
- timestamp: 2026-10-01T22:46:28Z (UTC)
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

**RELEASE_PASS** — mandatory gates 1–4b green on a **fresh, independent re-run** (this release session did not copy the dev/QA/verify-work numbers). Queue S0164 → `released` with a gate note that **npm publish is deferred** (`PUBLISH_CONFIRMATION_REQUIRED`). **No backlog mutation (closure owns OPEN→DONE per US-0045).** BUG-0031 row 222 `[ ]` unchecked. US-0156 row 185 `[ ]` **not mutated**. BUG-0022 row 213 `[ ]` **not mutated** (unblocked by this sprint's repair, NOT performed — its own closure owns the flip). No npm publish. No git push. No `/closure` spawn from this subagent. Do NOT claim a live OpenCode `/closure` host run (`UAT_PROBE_FORBIDDEN` — D5 mock-injection permission-map only, no live OpenCode spawn/flip). Do NOT reopen BUG-0016/0022/0027/0028/0029/0030 or mutate US-0156.

## Gate chain

| Gate | Result | Evidence |
|------|--------|----------|
| 1 check_in_tests | PASS | Live **independent re-run** @ release 2026-10-01T22:46:28Z: `pytest tests/bug0031_opencode_closure_flip_authz_test.py -v` **8/8 PASSED** (m1–m8, 1.42s); `pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0016_contract_test.py` **17 passed** (bug0027 **10/10** + bug0016 **7/7**, 0.82s, unmodified); `bug_issue_validate.py --backlog … --acceptance … --check-acceptance` **`[BUG_VALIDATION_OK]` exit 0**; `check_intake_template_parity.py --scope={us-0120,model-tier,bug-0030}` all **`[INTAKE_TEMPLATE_PARITY_OK]` exit 0**; **8/8 byte-parity pairs** active↔template MATCH (curator 837b/300364FC; closure 10252b/73DF8409; test 13248b/1729344A; runbook 263729b/0F82B02B; reason_codes 34163b/D05823EC; curator.mdc 1254b/1807B9B9; thin closure 557b/6BFAD205; qa.md 744b/880798C2). **Total 25 passed / 0 failed / 0 skipped (8 + 10 + 7 = 25 tests)**. `harness_fail_zero_claimed=false` |
| 2 qa | PASS | `sprints/S0164/qa-findings.md` **QA_PASS** (5/5 ACs, 0 blocking, NF-1 ACCEPT convention + NF-2 pre-existing hygiene); `sprints/S0164/verify-work-findings.md` **VERIFY_PASS** (`S0164_UNBLOCK_OK`), 25/25 tests, 8 parity pairs, all 4 status-guards unmutated |
| 3 uat | PASS | `contract_tests_primary`; `probe_kind=contract_tests_primary`; `live_opencode_closure_pass_claimed=false`; `provider_completion_claimed=false`; live-host classes waived `UAT_PROBE_FORBIDDEN` — permission-map/contract slice only, no live OpenCode spawn or flip (D5) |
| 4 isolation | PASS | execute (`dev-BUG0031-execute-20261001T160000Z-fresh`) + qa (`qa-BUG0031-qa-20261001T163000Z-fresh`) + verify-work (`qa-BUG0031-verify-20261001T170000Z-fresh`) + release (`release-BUG0031-20261001T224628Z-fresh`) distinct `fresh_context_marker` in `docs/engineering/state.md`; CROSS_MODEL_REVIEW=0 |
| 4b strict_runtime_proof | PASS | **Consumed** (independently RECOMPUTED via `from scripts.token_cost_lib import compute_strict_proof_hash`): execute `rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031` / `4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D` — **MATCH** (not STALE on TTL `2026-10-01T17:00:00Z`); qa `rp-auto-20261001-bug0031-qa-qa-20261001T163000Z-BUG-0031` / `FA1091BF040849C1E0B2B122895D3FF8AFFAFBA96D63797FFAAC4895ED76E892` — **MATCH** (not STALE on TTL `2026-10-01T17:30:00Z`); verify-work `rp-auto-20261001-bug0031-verify-work-qa-20261001T170000Z-BUG-0031` / `3E5349B50286A96261E6CF83078C7BA94F412E638841D96C57B3586E32445950` — **MATCH** (not STALE on TTL `2026-10-01T18:00:00Z`) — all THREE hashes reproduce exactly (deterministic canonical payload), legitimately citable as consumed |
| 3a cross_repo | skipped | CROSS_REPO_OBSERVABILITY=0 |
| 3b component_scope | skipped | COMPONENT_SCOPE_MODE=0 |
| 3c spec_pack | skipped | SPEC_PACK_MODE=0 |
| 3d user_guide | skipped | USER_GUIDE_MODE=0 |
| 3e legacy_drift | PASS | BUG-0031 still **OPEN** (closure owns DONE flip) — no DONE/acceptance drift introduced this release (re-read backlog L5663 `Status: OPEN`, acceptance L222 `[ ]`) |
| 3f readme_feature_coverage | skipped_not_enforced | `README_FEATURE_COVERAGE_ENFORCE` not enabled for this run (S0163 precedent: not_enforced); not blocking |
| 3g project_readme | skipped | `FRAMEWORK_KIT_REPO=1` (kit_repo_skipped=true) |
| publish | deferred | RELEASE_PUBLISH_MODE=confirm; orchestrator default-off; PUBLISH_CONFIRMATION_REQUIRED; npm_published=false; no kit semver bump |
| sync | not_eligible | SYNC_POLICY_MODE=disabled |
| version-doc (17) | skipped_no_release_version | workflow-only; release_version blank → `[Unreleased]` path; CHANGELOG `## [Unreleased]` Fixed **bullet for BUG-0031 only** (no kit semver / no per-version file) — mirrors sibling BUG-defect-only release decision |
| finalization | PASS | queue S0164 → `released`; notes `handoffs/releases/S0164-release-notes.md`; backlog reconciliation **deferred to closure** (US-0045) |

## Doc gates (3e / 3f / 3g)

- **3e**: PASS — no new DONE-story drift for BUG-0031 (backlog L5663 `Status: OPEN`; acceptance L222 `[ ]` unchecked; closure owns).
- **3f**: skipped_not_enforced — `README_FEATURE_COVERAGE_ENFORCE` not enabled this run; not blocking this sprint.
- **3g**: skipped (`FRAMEWORK_KIT_REPO=1`).

## UAT / browser honesty

- `probe_kind=contract_tests_primary`
- `live_opencode_closure_pass_claimed=false`
- `provider_completion_claimed=false`
- `fake_browser_pass_claimed=false`
- `harness_fail_zero_claimed=false`
- `live_npm_publish_probed=false`
- Live-host /closure classes waived `UAT_PROBE_FORBIDDEN` — D5 mock-injection permission-map contract only

## Independent re-verification (run myself, not copied from QA/verify-work)

> This release session independently re-ran and re-verified; do NOT trust the prior roles' word.

| Check | Command / method | Result |
|---|---|---|
| bug0031 active | `python -m pytest tests/bug0031_opencode_closure_flip_authz_test.py -v` | **8/8 PASSED** (1.42s) — m1–m8 (incl. m3 byte-parity, m4 qa-negative, m5 deny-order, m7 fail-closed token, m8 no-sibling-mutation) |
| compose bug0027 + bug0016 | `python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py tests/bug0016_contract_test.py` | **17 passed** (0.82s) — bug0027 **10/10** + bug0016 **7/7**, unmodified |
| **Total** | — | **25 passed / 0 failed / 0 skipped (8 + 10 + 7 = 25 tests)** |
| bug/acceptance validator | `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --acceptance docs/product/acceptance.md --check-acceptance` | **`[BUG_VALIDATION_OK]` exit 0** |
| parity scopes | `python scripts/check_intake_template_parity.py --scope={us-0120,model-tier,bug-0030}` | all **`[INTAKE_TEMPLATE_PARITY_OK]` exit 0** (×3) |
| byte-parity (8 pairs) | `Get-FileHash … SHA256` + `Get-Item … Length` on active + template | **8/8 MATCH** — curator 837b, closure(rich) 10252b, test 13248b, runbook 263729b, reason_codes 34163b, curator.mdc 1254b (no `permission:`), thin closure 557b (zero `CLOSURE_*`), qa.md 744b (none of 3 flip paths) |
| curator 3-allow delta | read `.opencode/agents/curator.md` L6-19 | `"**": deny` (L6) → state.md (L7) → … → handoffs/archive/** (L14) → **backlog.md (L15) / acceptance.md (L16) / sprints/S*/closure-verification.md (L17)** → bash: ask (L18) / task: deny (L19) — DENY-FIRST held, append-only, wildcard literal |
| guard status lines | read actual lines (not from QA/verify) | backlog L5663 **`Status: OPEN`**; acceptance L222 **`[ ]`** (BUG-0031), L185 **`[ ]`** (US-0156), L213 **`[ ]`** (BUG-0022) — all **UNTOUCHED** |
| proof recompute execute | `compute_strict_proof_hash` 6-field tuple | **MATCH** `4A7B8024…29835D`; recompute → identical |
| proof recompute qa | `compute_strict_proof_hash` 6-field tuple | **MATCH** `FA1091BF…E892`; recompute → identical |
| proof recompute verify-work | `compute_strict_proof_hash` 6-field tuple | **MATCH** `3E5349B5…445950`; recompute → identical |

## Publish disposition

- **Mode**: `RELEASE_PUBLISH_MODE=confirm` / `RELEASE_PUBLISH_AUTO_CONFIRM=0` (orchestrator: default-off)
- **Operator confirm this session**: absent
- **Action taken**: no `npm publish`; no git push; no silent publish; no kit version bump
- **Status**: `deferred-to-operator-confirm` / `PUBLISH_CONFIRMATION_REQUIRED`
- **npm_published**: false
- **Release verdict impact**: not a FAIL — release PASS with publish deferred under confirm mode

## Strict runtime proof (release)

- runtime_proof_id: `rp-auto-20261001-bug0031-release-release-20261001T224628Z-BUG-0031`
- phase_id: `release`, role: `release`, bug_id: `BUG-0031`, sprint_id: `S0164`
- proof_issued_at: 2026-10-01T22:46:28Z
- proof_ttl_seconds: 3600 → proof_ttl: 2026-10-01T23:46:28Z
- **proof_hash: `F30CED5D29017DBB20184EDAD5940A7F4088E336D27AD788959C081C2F023326`**
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional: orchestrator_run_id, runtime_proof_id, phase_id, role, proof_issued_at, proof_ttl_seconds; compact sorted-key JSON; SHA-256)
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20261001-bug0031","phase_id":"release","proof_issued_at":"2026-10-01T22:46:28Z","proof_ttl_seconds":3600,"role":"release","runtime_proof_id":"rp-auto-20261001-bug0031-release-release-20261001T224628Z-BUG-0031"}`
- **Consumed execute (dev)**: `rp-auto-20261001-bug0031-execute-dev-20261001T160000Z-BUG-0031` / `4A7B80246286CAC24FAC395334A5DA4A846F34D7F77597CC3816BE7F1629835D` — **independently RECOMPUTED = MATCH** (not STALE; hash valid)
- **Consumed qa**: `rp-auto-20261001-bug0031-qa-qa-20261001T163000Z-BUG-0031` / `FA1091BF040849C1E0B2B122895D3FF8AFFAFBA96D63797FFAAC4895ED76E892` — **independently RECOMPUTED = MATCH** (not STALE; hash valid)
- **Consumed verify-work (qa)**: `rp-auto-20261001-bug0031-verify-work-qa-20261001T170000Z-BUG-0031` / `3E5349B50286A96261E6CF83078C7BA94F412E638841D96C57B3586E32445950` — **independently RECOMPUTED = MATCH** (not STALE; hash valid)
- CROSS_MODEL_REVIEW=0 — no sovereign-critic proof consume required this segment
- **hash_recompute_confirmation=true** (second computation of my own release tuple → identical hash `F30CED5D…23326`; 64 hex; stored uppercase)

## Generated-test evidence (US-0066)

- generated_test_stack_profile: python (OpenCode `/closure` flip-path authorization contract)
- generated_test_command: `python -m pytest tests/bug0031_opencode_closure_flip_authz_test.py -v` (+ compose batch + validators + parity)
- generated_test_result: pass (8 + 10 + 7 = 25 markers this release pass; 0 failed)
- generated_test_output_ref: this file § Independent re-verification; `sprints/S0164/verify-work-findings.md`; `sprints/S0164/qa-findings.md`
- generated_test_paths_ref: `tests/bug0031_opencode_closure_flip_authz_test.py`, `template/tests/bug0031_opencode_closure_flip_authz_test.py`
- generated_test_reason_code: none (pass)

## Sync-policy prerequisite

- phase_boundary=release
- policy_mode=disabled
- checks=test:pass(scoped_pytest_bug0031_active_8/8 @ release_2026-10-01T22:46:28Z;compose_bug0027_10/10+bug0016_7/7_unmodified;validator_BUG_VALIDATION_OK_exit_0;parity_us-0120+model-tier+bug-0030_ALL_OK;byte-parity_8pairs_ALL_MATCH;harness_fail_zero_claimed=false),lint:skipped,typecheck:skipped
- push_decision=not_eligible
- reason_code=SYNC_DISABLED
- evidence_refs=sprints/S0164/release-findings.md;handoffs/releases/S0164-release-notes.md

## Status confirmation (US-0045) — WHO OWNS THE DONE FLIP

**Rule I applied (documented, exact artifact+line — re-read by me this session, not borrowed):**

> **`docs/engineering/architecture.md:3236–3237`** (Non-goals and closure gate, `# BUG-0022`), verbatim (current at HEAD):
> *"Do not mutate or tick US-0156 (this bug **is** its DoD gate); do not tick `docs/product/acceptance.md` or flip `### BUG-0022` status (**verify-work / closure owns per US-0045**) — BUG-0022 remains **OPEN**, AC-1..AC-8 **unchecked**."* — and the same US-0045 closure-ownership convention is the authoritative ownership rule across the ship macro.

> Corroborated by **`.cursor/commands/release.md:334–338`** (Steps, item 10), re-read by me:
> *"**10.** Backlog reconciliation is now handled by the dedicated `/closure` phase — see `.cursor/commands/closure.md`. **Story Closure holds exclusive responsibility for status flip (OPEN→DONE in `docs/product/backlog.md`), acceptance tick ([ ]→[x] in `docs/product/acceptance.md`), closure checkpoint append to `docs/engineering/state.md`, and creation of `sprints/Sxxxx/closure-verification.md`.**"*

> Corroborated by **`.cursor/commands/closure.md:14–21`** (Phase responsibility), re-read by me:
> *"Story Closure holds exclusive responsibility for: 1. Status flip in `docs/product/backlog.md` (canonical status owner per US-0045): `Status: OPEN` → `Status: DONE`; 2. Acceptance checkbox in `docs/product/acceptance.md`: `- [ ]` → `- [x]`; …"*

> Corroborated by **`docs/engineering/architecture.md:610`** (v1 kernel AC-5), re-read by me:
> *"**Release ≠ closure** (AC-5): **Release cannot mark DONE (US-0045).**"*

**My read (documented):** The repo's own rules consistently and unambiguously assign the **status flip (OPEN→DONE) + acceptance tick** to the **`/closure` phase** (US-0045). `/release` is explicitly excluded from marking DONE (`architecture.md:610`). Note: `architecture.md:610` and `release.md:334-338`/`closure.md:14-19` are the *general* rule; `architecture.md:3236-3237` is the `# BUG-0022`-specific restatement of that same US-0045 closure-ownership rule — all four point to the same owner: **`/closure`**. I applied the **strict "closure owns the flip"** reading — the same one the S0161/S0160 sibling releases applied. **This release phase DID NOT flip `### BUG-0031` → DONE, DID NOT tick `docs/product/acceptance.md` L222, and DID NOT mutate BUG-0022 (L213) or US-0156 (L185).** BUG-0031 remains **OPEN** (now *eligible* for closure: all 5 ACs verified PASS). This sprint **unblocks** the `/closure` capability (the flip-path permission repair); it does **not** perform any closure.

- **BUG-0031** backlog/acceptance: **OPEN, unchanged** (this phase did not mutate `docs/product/backlog.md` or `docs/product/acceptance.md`)
- **US-0156**: **OPEN** (acceptance row 185 `[ ]`; **not mutated** — its DoD gate = BUG-0022 + BUG-0027 DONE; BUG-0027 DONE, BUG-0022 still OPEN (L213); US-0156's release is its own closure act)
- **BUG-0022**: **OPEN** (acceptance row 213 `[ ]`; **unblocked** by this sprint's /closure repair, **NOT performed** — its own closure cycle owns the flip)
- **BUG-0016**: **DONE** (acceptance row 207 `[x]`) — NOT reopened
- **BUG-0027**: **DONE** (acceptance row 218 `[x]`) — NOT reopened
- **BUG-0023/0024/0025/0026/0028/0029/0030**: untouched / not reopened; **US-0156 AC-7** not ticked
- **role/twin files** (`.opencode/agents/{curator,qa}.md`, `.cursor/agents/curator.mdc`, thin `.opencode/commands/closure.md`) + **deliverable files** (rich `closure.md` pair, runbook, reason_codes, `tests/bug0031_*`, `template` twins): **unchanged this release phase** (this phase is record-keeping + queue-update only; all 8 parity pairs re-verified MATCH)

## Non-blocking findings (carried from QA/verify-work — no new)

1. **NB1 LIVE_OPENCODE_CLOSURE_RESIDUAL** — CI cannot prove a **live** OpenCode `/closure` host run to `CLOSURE_PASS` (`UAT_PROBE_FORBIDDEN` held — the `test_bug0031_*` suite is mock-injection / permission-map verification only, no live OpenCode spawn or flip). The AC-1 *capability* is proven by the permission-map + fail-closed contract + compose guards; end-to-end live `/closure` completion remains an operator UAT residual post-ship. **No live OpenCode PASS claimed.** Does not block RELEASE_PASS.
2. **NF-1 (QA, carried)** template-mirror `tests/bug0031_*` fails standalone from the same `REPO_ROOT=parents[1]` convention as the BUG-0027 sibling; the active copy is authoritative-green (8/8) and the template mirror is byte-identical (13248b, SHA `1729344A…C4D241F`). Accepted as in-repo convention. Does not block RELEASE_PASS.
3. **NF-2 (QA, carried)** pre-existing `CLOSURE_*` fail-safe-table-vs-stop-conditions asymmetry in `closure.md` — hygiene only, not introduced/mutated by this sprint. Does not block RELEASE_PASS.

## Blocking findings

None. (Zero blocking findings — the full execute → qa → verify-work chain is green; all gates independently re-verified this release.)

## Next

`/closure` (fresh **qe** default; `AUTO_ROLE_CLOSURE` empty → qe; **curator** fallback — on this OpenCode host `qe` is unspawnable, so `/closure` resolves to the sanctioned alternate **`curator`**, which BUG-0031's repair now authorizes on the three flip paths). CROSS_MODEL_REVIEW=0 — no sovereign-critic. **STOP** — do not spawn `/closure` from this subagent (orchestrator owns the next spawn per BUG-0006). **Do NOT mark BUG-0031 DONE. Do NOT tick AC-1..AC-5 in acceptance.md. Do NOT flip/tick BUG-0022 or US-0156 from this release session. Do NOT npm-publish. Do NOT git push. Do NOT claim a live OpenCode `/closure` run. Do NOT reopen any DQ10 sibling. Do NOT read `.env`.** The `/closure` phase (owns the DONE flip per US-0045) ships BUG-0031 (DONE flip + AC tick) and is the consumer that also unblocks/owns the S0163/BUG-0022 flip.
