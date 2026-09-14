# Sprint S0145 - Sprint Plan (US-0139)

## Metadata

| Field | Value |
|---|---|
| story_id | US-0139 |
| bug_id | (none) |
| story_title | Persistent code intelligence and bounded context engine |
| sprint_id | S0145 |
| delivery_mode | ultra_lean |
| macro_phase | plan (sprint-plan terminal, plan-verify NOT in resolved_phase_plan - skipped, next = sovereign-critic of sprint-plan then execute) |
| current_phase | sprint-plan |
| approach | A1 locked (from R-0132 DQ1-DQ10, DEC-0139 Accepted, architecture critic NB1-NB3 CLOSED) |
| companion_DEC | DEC-0139 (Accepted) |
| research_anchor | R-0132 (DQ1-DQ10 LOCKED, compose R-0130 / R-0129 / R-0128 / R-0127 / R-0122 / R-0121 / R-0060, do not wipe R-0120..R-0133) |
| architecture_anchor | docs/engineering/architecture.md # US-0139 |
| orchestrator_run_id | auto-20260913-us0139 |
| parent_orchestrator_run_id | auto-20260913-us0138 |
| fresh_context_marker | tl-US0139-sprintplan-20260913T175500Z-fresh |
| timestamp | 2026-09-13T17:55:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required on isolation) |
| verdict | PASS |
| decision_gate | false |
| SPRINT_MAX_TASKS | 12 |
| SPRINT_AUTO_SPLIT | 1 |
| task_count | 11 (T-anch + T-001..T-010, within 12, no split, 1:1 from architecture seeds) |
| COMPONENT_SCOPE_MODE | 0 |
| USER_GUIDE_MODE | 0 |
| plan-verify | ultra_lean - NOT in resolved_phase_plan, skipped, plan-verify.json written as SKIPPED placeholder only (not a QA phase) |
| backlog_status | OPEN (US-0045 - not mutated, AC-1..AC-8 unchecked) |
| sprint_id_lock | S0145 is next free after S0144 (US-0138 DONE). Confirmed no S0145 folder existed before this spawn. |
| critic_carry_ins | 0 new blocking, 3 architecture critic NBs us0139arc-* status=resolved non-blocking - routed as awareness into /execute |

## Scope summary

Add backend-neutral indexed retrieval plus bounded per-phase context packs so agents can answer where / who calls / what tests / what breaks without brute-force reads or cross-role transcript leakage. Two new packages @its-magic/code-intelligence and @its-magic/context-engine never import Pi. Nested AFT read adapter is the v1 CodeIntelligenceProvider. ToolBroker unstubs existing itsm_search/outline/symbol/references/callers/impact. PolicyEngine decision tables, config loaders, auth-models, KernelBridge, RoleCatalog internals, isolation loader, and noTools: builtin stay unamended. DEC-0038 compute_strict_proof_hash tuple stays UNAMENDED. its-indexd / crates/its-indexd OUT. Execute owns package files.

Approach A1 (DEC-0139 Accepted): standalone/packages/code-intelligence + standalone/packages/context-engine (private, no Pi imports) + nested AFT read sidecar (AFT_BINARY_VERSION=0.55.1, fake adapter in CI) + LIVE_INTEL_TOOLS unstub + deterministic rank + TOKEN_PROFILE caps (lean 6000/8/16, balanced 12000/16/32, full 24000/32/64) + assembler exclusion + pack envelope hash not DEC-0038 + compose materialize_codebase_map.py + benchmark + INTEL_*/CONTEXT_* degradation + 12 test_us0139_* on Windows + Linux, fake-model + fake-AFT CI held.

Out of scope: A2 fold into runtime-core, A3 sibling public aft-adapter, A4 load @cortexkit/aft-pi, A5 in-process AFT, A6 own Rust its-indexd, A7 learned ranking, A8 extend DEC-0038, A9 rewrite materialize_codebase_map.py, A10 new RuntimeConfig domain, A11 SQLite pack persist, A12 rewrite PolicyEngine/config/auth/KernelBridge/noTools, A13 fail-closed empty pack, US-0140..US-0148, marking US-0139 DONE, ticking AC checkboxes, reopening US-0133..US-0138 or BUG-0020, mutating BUG-0021, wiping R-0120..R-0133.

## Execute awareness (architecture critic NBs - 0 blocking)

Sovereign-critic of architecture PASS (critic-US0139-architecture-20260913T174500Z-fresh, anti_slop=10, 0 blocking, degraded_mode=false). Consumed architecture proof MATCH before TTL. Route these resolved NBs as execute awareness - do not re-open them as work:

| Finding | Issue key | Execute awareness |
|---|---|---|
| us0139arc-challenger-001 | ik_us0139arc_proof_failclosed_pass | T-002/T-005/T-006/T-008/T-009/T-010: fail-closed INTEL_*/CONTEXT_* edges locked DEC-0139 - mutation deny, exclusion, pack hash not DEC-0038, its-indexd OUT, secret/.env deny, partial pack not empty. |
| us0139arc-architect-002 | ik_us0139arc_layer_intel_context_ok | Keep T-anch..T-010 1:1 from architecture seeds, sprint folder is S0145, architecture owns H1+DEC-0139, execute owns packages + nested AFT read + unstub + 12 tests. PolicyEngine/config/RoleCatalog compose-only. US-0140 deferred. |
| us0139arc-subtractor-003 | ik_us0139arc_scope_yagni_pass | T-anch ceremony overlap acceptable. Do not invent extra tasks. Do not amend isolation loader / noTools / KernelBridge / auth-models / PolicyEngine tables. Do not design US-0140+. Do not own credentials or read .env. Do not mark US-0139 DONE. Do not reopen US-0138 or BUG-0020. 12 markers required. 11 tasks within SPRINT_MAX_TASKS=12. |

## Acceptance criteria (8) - US-0139 (status OPEN, unchecked per US-0045)

Primary acceptance (docs/product/acceptance.md US-0139 row): Persistent code intelligence and bounded context engine - AFT adapter, indexed retrieval, context fusion/hashes, codebase map, benchmark, and stale recovery (8 ACs).

- **AC-1**: CodeIntelligenceProvider exposes status, search, outline, symbol, references, callers/callees, impact, diagnostics, and incremental refresh behind a backend-neutral interface. - T-001, T-002 (T-010 m1).
- **AC-2**: The v1 AFT adapter runs as a persistent read-oriented backend, direct AFT mutation features are disabled or routed through PolicyEngine. - T-002, T-003 (T-010 m2).
- **AC-3**: code_context(task) ranks semantic and exact matches, symbols, graph edges, tests, git signals, active ACs, architecture, and decisions into a bounded context pack. - T-004 (T-010 m3).
- **AC-4**: Per-phase context includes only relevant work, handoff, state, decision, diff/failure, and bounded sovereign inputs, transcripts, secrets, whole backlog/history, and giant prompt bodies are excluded by default. - T-005 (T-010 m4).
- **AC-5**: Context source refs and a content hash are persisted for reproducibility without duplicating secret/full source content. - T-006 (T-010 m5).
- **AC-6**: Fresh repositories auto-index and generate/refresh codebase-map.md as a derived map with coverage/version metadata. - T-007 (T-010 m6).
- **AC-7**: A repeatable benchmark measures natural-language lookup, symbols, callers, tests, impact, cross-language refs, recent changes, monorepo latency, token use, and stale-index recovery. - T-008 (T-010 m7).
- **AC-8**: Tests prove incremental refresh after edits and safe degradation/recovery when AFT, LSP, embeddings, or the index is unavailable/stale. - T-009 (T-010 m8-m12).

## Task summaries (11 - T-anch + T-001..T-010)

- **T-anch** (NO-OP / verification): Verify # US-0139 H1 + DEC-0139 Accepted + A1 + R-0132 DQ1-DQ10 + 12-marker list. Record to sprints/S0145/t-anch-verification.md. NO mutation to architecture.md / DEC-0139.md / R-0132 in /execute.
- **T-001** (AC-1): Create standalone/packages/code-intelligence (@its-magic/code-intelligence) and standalone/packages/context-engine (@its-magic/context-engine). private true, version 0.0.0, type module, engines.node >=22.19.0, export ./src/index.ts. No Pi imports. Extend US-0133..0138 grep. Do not add a Biome override. Kit files omit standalone/.
- **T-002** (AC-1/AC-2): CodeIntelligenceProvider + nested AFT read sidecar + fake adapter + mutation deny INTEL_MUTATION_DENIED. AFT_BINARY_VERSION=0.55.1. CI never downloads. Do not import @cortexkit/aft-pi.
- **T-003** (AC-2): ToolBroker unstub itsm_search/outline/symbol/references/callers/impact + LIVE_INTEL_TOOLS, drop those six from STUB_TOOLS. No PolicyEngine table rewrite.
- **T-004** (AC-3): code_context ranking + TOKEN_PROFILE caps (lean 6000/8/16, balanced 12000/16/32, full 24000/32/64), MMR_LAMBDA=0.7, first cap wins, remainder CONTEXT_BUDGET.
- **T-005** (AC-4): per-phase exclusion assembler + sovereign digest cap 1500 tokens. Default exclude transcripts, secrets, whole backlog, giant prompts, .env. Never read .env.
- **T-006** (AC-5): source refs + content hash pack envelope, not DEC-0038. Persist gitignored runtime JSON under agentDir analog.
- **T-007** (AC-6): derived codebase-map compose materialize_codebase_map.py + codebase-map.meta.json for non-bootstrap maps. Do not rewrite the Python contract.
- **T-008** (AC-7): benchmark harness standalone/tests/fixtures/code-intel + bench export. its-indexd OUT. Live AFT / paid embeddings never CI.
- **T-009** (AC-8): degradation + incremental refresh. Partial pack + INTEL_*/CONTEXT_* reason codes. Never silent empty.
- **T-010** (AC-1..AC-8): Twelve test_us0139_* markers (DEC-0139). Primary standalone/tests/contract (node:test) Windows + Linux. Fake-model + fake-AFT CI held.

Execution order: T-anch -> T-001 -> T-002 -> T-003 -> {T-004, T-005} -> T-006 -> T-007 -> T-008 -> T-009 -> T-010 (acyclic). No split (11 <= 12). Not /quick.

## AC -> Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 (provider interface + packages) | T-001, T-002 |
| AC-2 (AFT read adapter + unstub) | T-002, T-003 |
| AC-3 (ranking + TOKEN_PROFILE caps) | T-004 |
| AC-4 (per-phase exclusion) | T-005 |
| AC-5 (source refs + content hash) | T-006 |
| AC-6 (derived codebase-map) | T-007 |
| AC-7 (benchmark, its-indexd OUT) | T-008 |
| AC-8 (degradation + refresh) | T-009 |
| DC / architecture baseline | T-anch |

**Surjectivity check**: 8/8 ACs covered (each AC >=1 task) + primary acceptance.md US-0139 row covered by AC-1..AC-8 aggregate. T-010 markers m1-m12 attest AC-1..AC-8. No PLAN_AC_COVERAGE_GAP. T-anch retained as verification-only.

## Locked 12-marker table (DEC-0139 / architecture)

1. test_us0139_provider_interface
2. test_us0139_aft_mutation_denied
3. test_us0139_ranking_bounds_token_profile
4. test_us0139_phase_exclusion
5. test_us0139_pack_hash_and_refs
6. test_us0139_derived_map_compose
7. test_us0139_benchmark_smoke
8. test_us0139_incremental_refresh
9. test_us0139_aft_unavailable_partial_pack
10. test_us0139_lsp_unavailable_partial_pack
11. test_us0139_embeddings_unavailable_partial_pack
12. test_us0139_index_stale_recovery

Primary: standalone/tests/contract (node:test) Windows + Linux. Fake-model + fake-AFT CI held. No paid/model/AFT-download calls.

## Risks (R1-R6 - accepted)

| Risk | Severity | Mitigation |
|---|---|---|
| R1 AFT binary/platform drift Win vs Linux | MEDIUM | T-002/T-010: fake adapter in CI, version pin 0.55.1 |
| R2 Nested adapter vs later its-indexd swap | MEDIUM | T-002: provider interface is the swap boundary |
| R3 TOKEN_PROFILE caps too tight/loose | LOW | T-004/T-010: tests lock winners |
| R4 Accidental AFT mutation leak | MEDIUM | T-002/T-010 m2: allowlist + INTEL_MUTATION_DENIED |
| R5 Operators treat codebase-map as the index | LOW | T-007: derived-only, map is not the DB |
| R6 Pack hash confused with DEC-0038 | LOW | T-006/T-010 m5: separate envelope, do not extend compute_strict_proof_hash |

## Compose guards (UNCHANGED)

| Target | Result |
|---|---|
| US-0138 / DEC-0138 / R-0130 | TOKEN_PROFILE consume-only, loaders unamended |
| US-0137 / DEC-0137 / R-0129 | unstub six names, PolicyEngine tables unamended |
| US-0136 / DEC-0136 / R-0128 | fill context_pack_hash, internals unamended |
| US-0135 / DEC-0135 / R-0127 | credentials OUT, never read .env |
| US-0134 / DEC-0134 / R-0122 | KernelBridge unamended |
| US-0133 / DEC-0133 / R-0121 | isolation, noTools, fake-model CI unamended |
| US-0082 / DEC-0065 / R-0060 | compose materialize_codebase_map.py |
| US-0056 / DEC-0038 | compute_strict_proof_hash tuple UNAMENDED |
| US-0140..US-0148 | OUT OF SCOPE |
| US-0133..US-0138 DONE | compose only, do not reopen |
| BUG-0020 DONE | do not reopen |
| BUG-0021 OPEN | not mutated |
| US-0045 | Status stays OPEN |

## Execute phase role (per DEC-0051 / US-0069)

| Phase | Role | Isolation |
|---|---|---|
| /execute | dev (fresh per BUG-0006) | {phase_id:execute, role:dev} |
| /qa | qa (fresh) | {phase_id:qa, role:qa} - ultra_lean may overwrite plan-verify.json inside build+verify |
| /verify-work | qa (fresh) | {phase_id:verify-work, role:qa} |
| /release | release (fresh) | {phase_id:release, role:release} |
| /closure | qe (fresh) | {phase_id:closure, role:qe} |
| /refresh-context | curator (fresh) | {phase_id:refresh-context, role:curator} |

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

| Field | Value |
|---|---|
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0139 |
| sprint_id | S0145 |
| orchestrator_run_id | auto-20260913-us0139 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| fresh_context_marker | tl-US0139-sprintplan-20260913T175500Z-fresh |
| timestamp | 2026-09-13T17:55:00Z (UTC) |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required) |
| evidence_ref | sprints/S0145/sprint.md, tasks.md, progress.md, uat.json, uat.md, plan-verify.json (SKIPPED), handoffs/tl_to_dev.md, docs/engineering/state.md, handoffs/resume_brief.md |

Prior phase proof consumed: rp-auto-20260913-us0139-architecture-techlead-20260913T173500Z-US-0139 / 93664305B6847E244901E87027891EA2EC9FA4E23F9A66B5CC5BC00293C0F51C - RUNTIME_PROOF_VALID (independent compute_strict_proof_hash MATCH, consumed 2026-09-13T17:55:00Z before TTL 2026-09-13T18:35:00Z). Sovereign-critic architecture PASS (rp-auto-20260913-us0139-sovereign-critic-techlead-20260913T174500Z-US-0139 / F4FA5F3517694EBEB416B9AB43F3885B14CBD81821A870BC31D96EE8A8731E12, critic-US0139-architecture-20260913T174500Z-fresh, anti_slop=10, 0 blocking, degraded_mode=false, findings us0139arc-* informational - routed).

## Runtime proof (DEC-0038)

| Field | Value |
|---|---|
| runtime_proof_id | rp-auto-20260913-us0139-sprint-plan-techlead-20260913T175500Z-US-0139 |
| phase_id | sprint-plan |
| role | tech-lead |
| story_id | US-0139 |
| sprint_id | S0145 |
| orchestrator_run_id | auto-20260913-us0139 |
| delivery_mode | ultra_lean |
| macro_phase | plan |
| model_id | cursor-grok-4.6-high (CROSS_MODEL_REVIEW=1 - required) |
| proof_issued_at | 2026-09-13T17:55:00Z |
| proof_ttl_seconds | 3600 |
| proof_ttl | 2026-09-13T18:55:00Z (UTC) |
| proof_hash | E7EF29705559E89CF0DF2B47132D00CBCCC4E376C5CCCF5862BB305C597DAF17 |
| canonical_payload | `{"orchestrator_run_id":"auto-20260913-us0139","phase_id":"sprint-plan","proof_issued_at":"2026-09-13T17:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0139-sprint-plan-techlead-20260913T175500Z-US-0139"}` |

Hash via scripts.token_cost_lib.compute_strict_proof_hash (positional, compact sorted-key JSON). Isolation extras (not hashed): delivery_mode=ultra_lean, macro_phase=plan, model_id=cursor-grok-4.6-high, sprint_id=S0145, story_id=US-0139. hash_recompute_confirmation=true (compute_strict_proof_hash -> E7EF29705559E89CF0DF2B47132D00CBCCC4E376C5CCCF5862BB305C597DAF17).

## Decision gate

| Field | Value |
|---|---|
| decision_gate | false |
| stop_conditions_met | yes |
| missing_acceptance_criteria | none (8/8 slices + primary acceptance row covered, 12 contract-test markers) |
| task_count | 11 (within SPRINT_MAX_TASKS=12, SPRINT_AUTO_SPLIT=1 but no split needed, 1:1 seeds, not /quick, not --bulk) |
| risks_finalized | 6/6 ACCEPTED (R1..R6) |
| approach | A1 locked |
| companion_DEC | DEC-0139 Accepted |
| plan-verify readiness | ultra_lean - plan-verify NOT in resolved_phase_plan, skipped, plan-verify.json is a SKIPPED placeholder |
| sovereign_memory_note | assemble_sovereign_memory_digest(...) NOT called |

## Definition of done (sprint-plan)

- [x] 11 tasks enumerated (T-anch + T-001..T-010) - within SPRINT_MAX_TASKS=12, 1:1 from architecture seeds
- [x] 8/8 ACs surjective + primary acceptance.md US-0139 covered
- [x] Task dependency graph documented
- [x] Execute phase role matrix documented (ultra_lean - /plan-verify skipped, next = sovereign-critic then /execute)
- [x] Compose guards UNCHANGED
- [x] Critic carry-ins (3 non-blocking from architecture sovereign-critic) routed as execute awareness, sprint id locked S0145
- [x] Isolation evidence + runtime proof emitted (model_id=cursor-grok-4.6-high present)
- [x] Sprint-plan checkpoint appended to docs/engineering/state.md
- [x] Sprint-plan handoff prepended to handoffs/tl_to_dev.md
- [x] Sprint-plan PASS prepended to handoffs/resume_brief.md (-> sovereign-critic then /execute)
- [x] UAT placeholders written (uat.json empty steps, uat.md ACs no results)
- [x] Traceability row added (Story=US-0139, Sprint=S0145, Tasks=T-anch+T-001..T-010, Status=PLANNED, Evidence empty)
- [x] Backlog status OPEN (US-0045 - not mutated), acceptance unchecked, sprint_plan_notes appended
- [x] plan-verify.json SKIPPED placeholder (not a QA phase)

## Next scheduled phase

| Field | Value |
|---|---|
| next_scheduled_phase | sovereign-critic (sprint-plan, CROSS_MODEL_REVIEW=1) then /execute (role=dev per US-0069 / DEC-0051, fresh dev subagent per BUG-0006, first canonical phase of build+verify macro per ultra_lean, plan-verify NOT in resolved_phase_plan - skipped) |
| next_scheduled_role | tech-lead (critic of sprint-plan), then dev |
| next_sprint_macro | build+verify (ultra_lean - plan-verify skipped at this boundary) |
| stop_condition | STOP after sprint-plan completes, hand off via artifacts only. Orchestrator MUST spawn sovereign-critic of sprint-plan then /execute in fresh dev subagent per BUG-0006. Do not spawn /execute, /plan-verify, or critic from this subagent. |

