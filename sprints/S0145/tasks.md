# Sprint S0145 - Task checklist (US-0139)

Total tasks: 11 (T-anch + T-001..T-010). SPRINT_MAX_TASKS=12, SPRINT_AUTO_SPLIT=1, no split. T-anch retained as NO-OP verification. Seeds 1:1 from docs/engineering/architecture.md # US-0139. Sprint id S0145 (next free after S0144).

**Isolation**: `tl-US0139-sprintplan-20260913T175500Z-fresh` · `model_id=cursor-grok-4.6-high` · `orchestrator_run_id=auto-20260913-us0139`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (packages/code-intelligence + packages/context-engine + Pi import-boundary grep)
3. T-002 (CodeIntelligenceProvider + nested AFT read sidecar + fake adapter + mutation deny)
4. T-003 (ToolBroker unstub itsm_* + LIVE_INTEL_TOOLS)
5. T-004 (code_context ranking + TOKEN_PROFILE caps) - parallel with T-005 after T-003
6. T-005 (per-phase exclusion assembler + sovereign digest cap) - parallel with T-004 after T-003
7. T-006 (source refs + content hash, not DEC-0038)
8. T-007 (derived codebase-map compose + codebase-map.meta.json)
9. T-008 (benchmark harness, its-indexd OUT)
10. T-009 (degradation + incremental refresh)
11. T-010 (12 test_us0139_* Win/Linux fake-model + fake-AFT)
12. Integration verification

## Critic NB awareness (execute)

- **T-002/T-005/T-006/T-008/T-009/T-010** (us0139arc-challenger-001 NB1): fail-closed INTEL_*/CONTEXT_* edges locked DEC-0139. Mutation deny, exclusion, pack hash not DEC-0038, its-indexd OUT, secret/.env deny, partial pack not empty. compute_strict_proof_hash tuple unamended.
- **T-anch..T-010** (us0139arc-architect-002 NB2): keep 1:1 architecture seeds, sprint folder is S0145, execute owns packages + nested AFT read + unstub + 12 tests, architecture owns H1+DEC-0139, PolicyEngine/config/RoleCatalog compose-only, US-0140 deferred, DEC-0133..0138 compose held.
- **T-anch** (us0139arc-subtractor-003 NB3): verification-only, do not rewrite # US-0139 / DEC-0139 / R-0132, reject A2-A13, do not amend isolation/noTools/KernelBridge/auth-models/PolicyEngine tables, do not mark DONE, do not reopen US-0138 or BUG-0020, do not design US-0140+, do not own credentials or read .env, 12 markers required.

## Task checklist

- [x] **T-anch**: Verify # US-0139 H1 in docs/engineering/architecture.md, DEC-0139 Accepted, approach A1 LOCKED, R-0132 DQ1-DQ10 LOCKED, 12-marker table locked, compose guards (US-0138 TOKEN_PROFILE consume-only, US-0137 PolicyEngine tables unamended except unstub six itsm_*, US-0136 fill context_pack_hash, US-0135 credentials OUT, KernelBridge unamended, isolation/noTools unamended, kit files omit standalone/, US-0140+ out, US-0138 DONE, BUG-0020 DONE, BUG-0021 OPEN not mutated, R-0120..R-0133 intact). Verify standalone/packages/code-intelligence, context-engine, and test_us0139_* do NOT yet exist (or document baseline). Record to sprints/S0145/t-anch-verification.md. NO mutation to architecture.md / decisions/DEC-0139.md / docs/engineering/research.md R-0132 in /execute. (DC / architecture baseline, NO-OP)

- [x] **T-001**: Create standalone/packages/code-intelligence and standalone/packages/context-engine. package.json: names @its-magic/code-intelligence and @its-magic/context-engine, private true, version 0.0.0, type module, engines.node >=22.19.0, export ./src/index.ts. Workspaces glob packages/* already includes them. No Pi imports. package.json must not depend on @earendil-works/pi-* or @cortexkit/aft-pi. Type-only import from @its-magic/config is allowed. Do not import PolicyEngine internals. Extend the US-0133..US-0138 grep to deny Pi inside both packages. Do not add a Biome override. Kit files omit standalone/. Do not stub runtime-core (US-0140). (AC-1)

- [x] **T-002**: Implement CodeIntelligenceProvider (status, search lexical+semantic, outline, symbol, references, callers/callees, impact, diagnostics, refresh(changes?)). Nested AFT read adapter under code-intelligence/src/aft/. Sidecar JSON-over-stdio, one warm process per repo root. AFT_BINARY_VERSION=0.55.1 (not a runtime npm dependency). Resolve: cache then npm platform package matching pin then PATH. CI uses fake adapter (no live binary, no network, no GitHub release, no cargo). Never register or forward write/edit/apply_patch/aft_delete/aft_move/aft_transform/aft_refactor/ast_grep_replace. Adapter returns INTEL_MUTATION_DENIED. Do not import @cortexkit/aft-pi / aft-opencode / aft-bridge. (AC-1/AC-2)

- [x] **T-003**: Unstub existing names. ToolBroker handlers for itsm_search / itsm_outline / itsm_symbol / itsm_references / itsm_callers / itsm_impact call the injected provider. Add LIVE_INTEL_TOOLS and drop those six from STUB_TOOLS. Decision tables (path/shell/secret/profile/audit) unamended. Remaining stubs (app/browser/test/validate/spawn_review) stay stub-denied. No parallel aft_* / intel_* production tool names. (AC-2)

- [x] **T-004**: Implement code_context(task) deterministic weighted rank + greedy pack until first cap. Weights: exact_symbol 100, lexical_exact 80, semantic 60, graph_edge 50, tests 40, git_recency 30, active_ac 25, architecture_decision 20. MMR_LAMBDA=0.7. Caps: lean 6000 tokens / 8 files / 16 hits, balanced 12000 / 16 / 32, full 24000 / 32 / 64. First cap wins, remainder CONTEXT_BUDGET with dropped-id audit. Consume US-0138 TOKEN_PROFILE, no new RuntimeConfig domain. Giant prompt bodies never enter the ranker. No LLM-in-the-loop compression. Tests: marker 3. (AC-3)

- [x] **T-005**: Session assembler in context-engine owns include/exclude. Provider is retrieval-only. Default exclude previous-role transcripts, secrets/credential blobs, whole backlog/history, giant static prompts, .env. Consume AUTO_PHASE_INCLUDE / AUTO_PHASE_EXCLUDE / SOVEREIGN_MEMORY as injected flags (do not import config loaders). When SOVEREIGN_MEMORY=1, inject size-capped digest of 1500 tokens only. HOT/WARM/COLD compose US-0053 / US-0096. Compose US-0136: assembler runs in a fresh role session, fill attestation context_pack_hash with this pack content_hash. Never read .env. Tests: marker 4. (AC-4)

- [x] **T-006**: Owned pack envelope, not an extension of compute_strict_proof_hash / DEC-0038. Schema v1: schema_version, token_profile, source_refs (kind, path, start?, end?, snippet_sha256), ranked_ids, exclude_set_hash, content_hash. content_hash = SHA-256 of canonical sorted-key JSON of those fields excluding content_hash. Snippets hashed, full source and secrets never persisted. Persist gitignored runtime JSON under DEC-0133 agentDir analog. SQLite deferred to US-0140. Tests: marker 5. (AC-5)

- [x] **T-007**: Compose scripts/materialize_codebase_map.py (US-0082 / DEC-0065 / R-0060). Do not rewrite the Python contract, sentinel, [CODEBASE_MAP_OK], or CODEBASE_MAP_BLOCKED:*. Fresh / missing map -> invoke materializer. Bootstrap-sentinel maps may be refreshed. Non-bootstrap operator maps: preserve body, write coverage/version as sibling gitignored docs/engineering/codebase-map.meta.json. Map is derived, not the index database. Tests: marker 6. (AC-6)

- [x] **T-008**: Harness under standalone/tests/fixtures/code-intel + a bench entry exported from code-intelligence (fake-model, fake-AFT). Measures NL lookup, exact symbol, callers, tests, impact, cross-language ref, recent changes, fixture monorepo latency, token use, stale-index recovery. Live AFT / paid embeddings never CI. crates/its-indexd remains OUT. Tests: marker 7. (AC-7)

- [x] **T-009**: Partial pack + reason codes, not fail-closed empty context when a backend is down. Silent empty pack is forbidden. Reason codes: INTEL_AFT_UNAVAILABLE, INTEL_LSP_UNAVAILABLE, INTEL_EMBEDDINGS_UNAVAILABLE, INTEL_INDEX_STALE, INTEL_INDEX_UNAVAILABLE, INTEL_MUTATION_DENIED, CONTEXT_EXCLUSION, CONTEXT_BUDGET. Fallback: AFT read then lexical/git/artifact-only. refresh(changes?) is incremental. Stale index: serve pack with INTEL_INDEX_STALE and trigger refresh. Tests: markers 8-12. (AC-8)

- [x] **T-010**: Create contract tests covering exactly 12 markers (DEC-0139). Primary: standalone/tests/contract (node:test) Windows + Linux. Fake-model + fake-AFT CI. No paid/model/AFT-download calls.
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
  Do not weaken test_us0133_* / test_us0134_* / test_us0135_* / test_us0136_* / test_us0137_* / test_us0138_*. (AC-1..AC-8 coverage via markers)

## Integration verification (post T-010)

- [x] Test gate: standalone npm test covers 12/12 test_us0139_* plus compose us0133..us0138 still green
- [x] Import-boundary gate: no Pi imports in packages/code-intelligence or packages/context-engine, kit files omit standalone/
- [x] Isolation gate: AgentKernel empty loader / noTools builtin / KernelBridge / auth-models store / PolicyEngine tables / RoleCatalog internals unamended, fake-model CI held, DEC-0038 tuple unamended
- [x] Scope gate: no credentials / .env reads, no runtime-core, no live paid CI, no its-indexd, no US-0140+ authoring
- [x] Status gate: US-0139 remains OPEN, AC-1..AC-8 unchecked, intake JSON not mutated, US-0133..US-0138/BUG-0020 remain DONE, BUG-0021 not mutated

## Files to touch (scope)

### New (create)

- standalone/packages/code-intelligence/ (package.json, src/index.ts, provider, src/aft/ nested read adapter, fake adapter, bench)
- standalone/packages/context-engine/ (package.json, src/index.ts, code_context ranker, assembler, pack envelope)
- standalone/tests/contract test_us0139_* (node:test)
- standalone/tests/fixtures/code-intel
- sprints/S0145/t-anch-verification.md (execute)

### Edit (scoped)

- existing US-0133..US-0138 Pi-import grep - extend to both new packages
- ToolBroker STUB_TOOLS / LIVE_INTEL_TOOLS (unstub six itsm_* names)
- .github/workflows/ci.yml - extend existing standalone Windows+Linux job only if glob would miss new tests

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 - closure only |
| architecture.md / DEC-0139.md | locked in /architecture |
| PolicyEngine decision tables | unstub names only |
| KernelBridge / isolation / noTools | unamended |
| DEC-0038 tuple | UNAMENDED |
| materialize_codebase_map.py | compose only |
| crates/its-indexd | OUT |
| US-0140..US-0148 | OUT OF SCOPE |
| US-0138 / BUG-0020 | DONE - do not reopen |
| .env / credentials | never read |

## AC -> Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002 |
| AC-2 | T-002, T-003 |
| AC-3 | T-004 |
| AC-4 | T-005 |
| AC-5 | T-006 |
| AC-6 | T-007 |
| AC-7 | T-008 |
| AC-8 | T-009 |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. T-010 markers attest AC-1..AC-8. No PLAN_AC_COVERAGE_GAP.

