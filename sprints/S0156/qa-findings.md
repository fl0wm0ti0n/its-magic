# QA findings — US-0148 / S0156 / auto-20260917-us0148 (qa)

- **phase_id**: qa, **role**: qa, **story_id**: US-0148 (OPEN — not marked DONE per US-0045), **sprint_id**: S0156
- `orchestrator_run_id=auto-20260917-us0148`, `parent_run=auto-20260917-us0146`, `delivery_mode=ultra_lean`, `macro_phase=build+verify`
- `drain_story_index=1 of 3`, `backlog_drain_stories_remaining_budget=2`
- `AUTO_IMPLEMENTATION_LOOP=1` (no blocking findings — do not return to `/execute`)
- `AUTO_QUIET=1`
- `FRAMEWORK_KIT_REPO=1`
- `SECURITY_REVIEW=0`
- `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `producer_phase_id=execute`, `producer_role=dev`, `producer_model_id=inherit`
- `CROSS_MODEL_REVIEW=0` — no sovereign-critic of execute or qa this chain segment
- `cross_reviewer_findings.open_blocking_count=0`

- `fresh_context_marker=qa-US0148-qa-20260917T222500Z-fresh` (NEW per US-0048 / BUG-0006; not reused from execute `dev-US0148-execute-20260917T220000Z-fresh`)
- `timestamp (UTC)=2026-09-17T22:25:00Z` (wall-clock)
- **verdict: QA_PASS**
- `plan_verify_verdict=PASS` (ultra_lean deferred — `sprints/S0156/plan-verify.json` merged at /qa; 8/8 AC surjective in sprint-plan + DEC-0148 / R-0148 DQ1–DQ10 + twelve locked `test_us0148_*`)
- `blocking_count=0`
- `non_blocking_count=0`
- `story_status=OPEN` (do not mark US-0148 DONE; intake JSON not mutated)
- `acceptance_US-0148=NOT ticked` (`docs/product/acceptance.md` row remains `- [ ] US-0148`)
- `backlog_ACs=NOT ticked` (verify-work/closure ownership)
- `intake_json=NOT mutated`
- Daemon control protocol slice — **no live remote bind / npm publish / git push / post-deploy browser MCP**; **no fake live deploy PASS**
- `SECURITY_REVIEW=0`, `CROSS_REPO_OBSERVABILITY=0`, `COMPONENT_SCOPE_MODE=0`, `USER_GUIDE_MODE=0`, `SPEC_PACK_MODE=0`
- `sibling_boundary=US-0145 OUT of daemon; US-0133..US-0147 DONE compose-only; US-0146 InProcessTransport doubles IN; BUG-* not mutated; no kit cli.json/tui.json; no auto.md restore; RELEASE_GATE_ORDER literal unamended`

## Verdict rationale

Fresh QA independently remapped AC-1..AC-8 against architecture `# US-0148` A1 (`@its-magic/protocol` + `apps/daemon` loopback JSON-RPC/WebSocket + `OperatorTransport`/`DaemonTransport` + per-run SQLite event log + restart reconcile + twelve `test_us0148_*`) + `DEC-0148` + `R-0148` DQ1–DQ10 + `tasks.md`, treated ultra_lean deferred plan-verify as **PASS** (8/8 AC surjective; merged at `/qa`), re-ran scoped `node --experimental-strip-types --test tests/contract/us0148.contract.test.ts` (**14 passed**, **12/12** locked markers, fail 0, duration_ms 1119.9884), re-ran full standalone `npm test` (**167/167** PASS, fail 0, duration_ms 3111.3819), confirmed `docs/engineering/operator/daemon-protocol.md` present, metadata checker exit 0, triad pre-write exit 0, and independently recomputed execute proof hash **MATCH** before TTL (`2026-09-17T23:00:00Z`). Blocking findings: **none**. US-0148 remains OPEN; acceptance.md unchecked. POLICY_QA_SILENT_FIX held.

## Test plan

| # | Check | Expected |
|---|---|---|
| 1 | Independent AC-1..AC-8 remap vs A1 + DEC-0148 + tasks | Each AC ≥1 task; primary acceptance covered |
| 2 | Ultra_lean `sprints/S0156/plan-verify.json` merged at /qa | PASS if 8/8 surjective + 12 locked markers |
| 3 | scoped standalone `us0148.contract.test.ts` | 12/12 `test_us0148_*` PASS |
| 4 | full standalone `npm test` | 167/167 PASS; US-0146 in-process held |
| 5 | Execute DEC-0038 proof consume | MATCH before TTL |
| 6 | Status OPEN; acceptance unchecked; backlog ACs unchecked | unchanged |
| 7 | UAT probes | `probe_kind=contract_tests_primary`; live browser `UAT_PROBE_FORBIDDEN` |
| 8 | Emit `convergence_smoke` when `contract_test_failed=0` | present, `result=pass` |
| 9 | Compose guards (no US-0145 delivery in daemon; no DONE flip) | HELD |

## Independent checks (this qa subagent)

| Check | Command / method | Result |
|---|---|---|
| Execute proof SHA-256 | `compute_strict_proof_hash` 6-field tuple | **MATCH** `4E95757067D26F6502C94856C7F746046F57A7291A52FAD5F68CF818B694ABD5`; ttl `2026-09-17T23:00:00Z`; consumed_at `2026-09-17T22:25:00Z` — **RUNTIME_PROOF_VALID** (not STALE) |
| Standalone contract (scoped) | `node --experimental-strip-types --test tests/contract/us0148.contract.test.ts` | **14 passed** fail 0 duration_ms 1119.9884 (**12/12** locked `test_us0148_*`) |
| Standalone contract + unit | `npm test` in `standalone/` | **167 passed** fail 0 duration_ms 3111.3819 |
| Metadata | `python scripts/check-user-visible-metadata.py --repo .` | **exit 0** |
| Triad pre-write | `python scripts/enforce-triad-hot-surface.py --rollover` + `--check` | **PASS** (exit 0) |
| Operator doc | `docs/engineering/operator/daemon-protocol.md` | **present** |
| Contract file | `standalone/tests/contract/us0148.contract.test.ts` | **present** (12 locked markers + compose) |
| DEC-0148 Accepted + R-0148 LOCKED | decisions + research anchors | **held** (not mutated this pass) |
| Backlog / acceptance | Status + checkbox spot-check | OPEN; acceptance `- [ ] US-0148`; AC-1..AC-8 **unchecked** |
| No `.env` / no live publish/push | this pass | **held** |
| POLICY_QA_SILENT_FIX | no production source patch | **held** |

## Blocking findings

None.

## Non-blocking findings

None (CROSS_MODEL_REVIEW=0 — no execute-critic NB carry-forward).

## AC remap (independent — files + tests vs A1 / DEC-0148)

| AC | Delivered surface | Task(s) / markers | Result |
|---|---|---|---|
| AC-1 versioned schemas | `@its-magic/protocol` unions + redact | T-001; m1,m2 | **PASS** |
| AC-2 thin daemon | `apps/daemon` delegates to runtime | T-002; m3 | **PASS** |
| AC-3 attach/stream/reconnect | SQLite log + WS replay + DaemonTransport + CLI/TUI | T-003..T-006; m4,m5 | **PASS** |
| AC-4 local security | loopback bind, bearer, redaction | T-002,T-005,T-007; m6,m7 | **PASS** |
| AC-5 fail closed | protocol negotiation + reason codes | T-001,T-007; m1 | **PASS** |
| AC-6 restart reconcile | crashResume + reconcileOperationalLedger | T-008; m12 | **PASS** |
| AC-7 contract breadth | backpressure, roles, approval, cancel | T-003,T-004,T-009; m5,m8–m11 | **PASS** |
| AC-8 deferred clients | daemon-protocol.md + full matrix | T-010,T-011; 12/12 | **PASS** |

**Overall AC gate**: **PASS** (slice) — Status remains OPEN; `docs/product/acceptance.md` US-0148 **unchecked** (closure ownership).

## Contract marker results (12/12 locked)

| # | Marker | Harness | Result |
|---|---|---|---|
| 1 | `test_us0148_protocol_version_mismatch_fail_closed` | node:test | PASS |
| 2 | `test_us0148_schema_command_event_roundtrip` | node:test | PASS |
| 3 | `test_us0148_daemon_delegates_no_duplicate_workflow` | node:test | PASS |
| 4 | `test_us0148_cli_attach_ordered_events` | node:test | PASS |
| 5 | `test_us0148_reconnect_replay_after_seq` | node:test | PASS |
| 6 | `test_us0148_loopback_bind_default_deny_remote` | node:test | PASS |
| 7 | `test_us0148_wire_payload_secret_redaction` | node:test | PASS |
| 8 | `test_us0148_event_backpressure_summary_mode` | node:test | PASS |
| 9 | `test_us0148_concurrent_observer_controller_roles` | node:test | PASS |
| 10 | `test_us0148_approval_routing_single_controller` | node:test | PASS |
| 11 | `test_us0148_cancel_propagates_to_runtime` | node:test | PASS |
| 12 | `test_us0148_crash_restart_reconcile_fresh_sessions` | node:test | PASS |

Compose (non-blocking): `test_us0148_in_process_transport_for_us0146_doubles`, `test_us0148_daemon_unreachable_hint` — PASS.

## Compose / scope gates

| Gate | Result |
|---|---|
| A1 LOCKED (protocol + daemon + daemon-client + SQLite + reconcile) | HELD |
| US-0145 delivery OUT of daemon | HELD |
| US-0146 `InProcessTransport` for `test_us0146_*` | HELD |
| RELEASE_GATE_ORDER literal unamended | HELD |
| Fake doubles; no live npm publish/git push | HELD |
| DEC-0038 `compute_strict_proof_hash` tuple UNAMENDED | HELD |
| US-0133..US-0147 DONE compose-only | HELD |
| US-0045 Status OPEN; acceptance.md unchecked; backlog ACs unchecked | HELD |
| Twelve locked architecture markers | HELD |
| No `.env` read / no intake JSON mutation / no POLICY_QA_SILENT_FIX production patch | HELD |
| `harness_fail_zero_claimed=false`; `fake_browser_pass_claimed=false`; `live_chrome_probed=false` | HELD |

## UAT / convergence (US-0128)

- Contract slice green (`contract_test_failed=0`); 12/12 locked `test_us0148_*`.
- Canonical `convergence_smoke` recorded as **pass** in `sprints/S0156/uat.json`.
- Six live-runtime probe classes waived `UAT_PROBE_FORBIDDEN` (daemon protocol slice; ephemeral loopback tests only).
- Full UAT ownership completion remains with `/verify-work` (do not flip DONE).
- **No fake live deploy/browser PASS.**

## UAT probes (FRAMEWORK_KIT_REPO=1 — honest classification)

Applicable probe class: **`contract_tests_primary`**. Live browser/deploy: **`UAT_PROBE_FORBIDDEN`**.

| Probe class | Classification | reason_code |
|---|---|---|
| `browser_smoke` | not probed | `UAT_PROBE_FORBIDDEN` |
| `api_health` | waived | `UAT_PROBE_FORBIDDEN` |
| `process_health` | waived | `UAT_PROBE_FORBIDDEN` |
| `cli_smoke` | waived (contract tests) | `UAT_PROBE_FORBIDDEN` |
| `build` | waived (standalone tests recorded independently) | `UAT_PROBE_FORBIDDEN` |
| `manual_operator` | deferred to verify-work | `UAT_PROBE_FORBIDDEN` |

**Runtime browser evidence**: none. MCP `browser_navigate` **not run**.

## Runtime QA evidence (US-0065) — daemon protocol slice

- `runtime_startup_command`: n/a (contract tests; ephemeral daemon on port 0)
- `runtime_stack_profile`: node (standalone workspace)
- `runtime_mode`: local
- `runtime_health_target`: n/a
- `runtime_health_result`: not_applicable
- `runtime_log_summary`: n/a
- `runtime_retry_count`: 0
- `runtime_retry_ledger`: []
- `runtime_final_verdict`: pass
- `runtime_reason_code`: `UAT_PROBE_FORBIDDEN` for live-runtime probes; slice health is contract tests + `convergence_smoke`
- `runtime_evidence_refs`: npm 167/167; scoped us0148 12/12; `sprints/S0156/uat.json` `convergence_smoke`

## Generated-test evidence (US-0066)

- `generated_test_stack_profile`: node
- `generated_test_command`: `cd standalone && npm test`
- `generated_test_result`: pass
- `generated_test_output_ref`: this file § Independent checks (167 passed duration_ms 3111.3819)
- `generated_test_paths_ref`: `standalone/tests/contract/us0148.contract.test.ts`
- `generated_test_reason_code`: none (pass)

## Status confirmation (US-0045)

- backlog `## US-0148` Status: **OPEN**
- acceptance US-0148: **unchecked**
- AC-1..AC-8: **unchecked** (verify-work/closure)
- US-0133..US-0147: **DONE** (not reopened)
- US-0145: **OPEN** (not mutated)
- BUG-*: not mutated

## Producer proof consumed (execute)

- `producer_runtime_proof_id=rp-auto-20260917-us0148-execute-dev-20260917T220000Z-US-0148`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260917-us0148","phase_id":"execute","proof_issued_at":"2026-09-17T22:00:00Z","proof_ttl_seconds":3600,"role":"dev","runtime_proof_id":"rp-auto-20260917-us0148-execute-dev-20260917T220000Z-US-0148"}`
- `producer_attested_proof_hash=4E95757067D26F6502C94856C7F746046F57A7291A52FAD5F68CF818B694ABD5`
- Independent `compute_strict_proof_hash` recompute: **MATCH**
- `producer_proof_ttl=2026-09-17T23:00:00Z`, `consumed_at=2026-09-17T22:25:00Z` (before RUNTIME_PROOF_STALE)
- `producer_ttl_stale=false`
- `producer_fresh_context_marker=dev-US0148-execute-20260917T220000Z-fresh`

## Strict runtime proof (DEC-0038) — qa

- `orchestrator_run_id=auto-20260917-us0148`
- `runtime_proof_id=rp-auto-20260917-us0148-qa-qa-20260917T222500Z-US-0148`
- `phase_id=qa`, `role=qa`, `story_id=US-0148`, `sprint_id=S0156`
- `proof_issued_at=2026-09-17T22:25:00Z`
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-17T23:25:00Z`
- `proof_hash=BBE54BEC118319917F07862D641170BBC4FD9A17C5858249BF2C93EE3D307D61`
- Canonical payload: `{"orchestrator_run_id":"auto-20260917-us0148","phase_id":"qa","proof_issued_at":"2026-09-17T22:25:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260917-us0148-qa-qa-20260917T222500Z-US-0148"}`
- `hash_recompute_confirmation=true`

## Strict runtime proof (DEC-0038) — plan-verify (ultra_lean merged)

- `runtime_proof_id=rp-auto-20260917-us0148-plan-verify-qa-20260917T222500Z-US-0148`
- `phase_id=plan-verify`, `role=qa`
- `proof_issued_at=2026-09-17T22:25:00Z`, `proof_ttl=2026-09-17T23:25:00Z`
- `proof_hash=7B4A71D4749E4B56E0590A103F586F513EE97C0F0E38CC92BAA2AD7620846B8A`
- Canonical payload: `{"orchestrator_run_id":"auto-20260917-us0148","phase_id":"plan-verify","proof_issued_at":"2026-09-17T22:25:00Z","proof_ttl_seconds":3600,"role":"qa","runtime_proof_id":"rp-auto-20260917-us0148-plan-verify-qa-20260917T222500Z-US-0148"}`

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=qa`, `role=qa`, `model_id=inherit` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=qa-US0148-qa-20260917T222500Z-fresh` (NEW per US-0048 / BUG-0006)
- `timestamp=2026-09-17T22:25:00Z` (UTC wall-clock)
- `evidence_ref=sprints/S0156/qa-findings.md; sprints/S0156/plan-verify.json; sprints/S0156/uat.json; sprints/S0156/uat.md`
- Fresh qa subagent per BUG-0006; no `/verify-work` or `/execute` spawn from this subagent.

## Next scheduled phase

- `next_scheduled_phase=/verify-work` (fresh qa subagent per BUG-0006 — orchestrator-owned)
- `next_scheduled_role=qa`
- `stop_condition=STOP after qa PASS. Do NOT mark US-0148 DONE. Do NOT tick acceptance. Do NOT npm-publish. Do NOT git push.`
