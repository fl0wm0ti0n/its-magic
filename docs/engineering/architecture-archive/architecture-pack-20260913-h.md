# Architecture archive pack (2026-09-13)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 19
- First archived heading: `# US-0139 — Persistent code intelligence and bounded context engine`
- Last archived heading: `# US-0139 — Persistent code intelligence and bounded context engine`
- Verification tuple (mandatory):
  - archived_body_lines=171
  - preamble_lines=1
  - retained_body_lines=2973

---

# US-0139 — Persistent code intelligence and bounded context engine

## Overview

**US-0139** adds backend-neutral indexed retrieval plus bounded per-phase context packs so agents can answer “where / who calls / what tests / what breaks” without brute-force reads or cross-role transcript leakage. Two new packages `@its-magic/code-intelligence` and `@its-magic/context-engine` never import Pi. Nested AFT **read** adapter is the v1 `CodeIntelligenceProvider`. ToolBroker unstubs existing `itsm_search`/`outline`/`symbol`/`references`/`callers`/`impact`. PolicyEngine decision tables, config loaders, auth-models, KernelBridge, RoleCatalog internals, isolation loader, and `noTools: "builtin"` stay **unamended**. DEC-0038 `compute_strict_proof_hash` tuple stays **UNAMENDED**. `its-indexd` / `crates/its-indexd` **OUT**. Execute owns package files.

**Research anchor**: **R-0132** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0139** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0132 (cortexkit/aft JSON-over-stdio BridgePool analog not adopted as SOT; TokenGate/Matrix Context/ContextPipe budgeted packing — learned compression rejected) — **no new R-id**. Do not wipe R-0120..R-0133.

**Fresh context marker**: `tl-US0139-architecture-20260913T173500Z-fresh`
**Orchestrator run id**: `auto-20260913-us0139`
**Timestamp**: 2026-09-13T17:35:00Z (UTC)
**Verdict**: PASS
**Next**: sovereign-critic (architecture), then `/sprint-plan` **S0145** (orchestrator-owned). ultra_lean: plan-verify is **not** in `resolved_phase_plan`. Do **not** spawn sprint-plan or critic from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0132)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | `@its-magic/code-intelligence` + `@its-magic/context-engine` (no Pi); nested AFT **read** adapter (sidecar per root); ToolBroker unstub existing `itsm_*`; deterministic rank + TOKEN_PROFILE caps; assembler exclusion; pack hash ≠ DEC-0038; compose `materialize_codebase_map`; benchmark; its-indexd OUT; partial-pack degradation | **Preferred / LOCKED** — AC-1..AC-8 |
| A2 | Fold into `runtime-core` | **Rejected** — §30 / US-0140 |
| A3 | Sibling public `packages/aft-adapter` this story | **Rejected** — Yagni until second backend |
| A4 | Load `@cortexkit/aft-pi` into Pi sessions | **Rejected** — hoists write/edit; D2 / R1 / R2 |
| A5 | In-process AFT / no persistent warm process | **Rejected** — §17.3 |
| A6 | Own Rust `its-indexd` this story | **Rejected** — Boundaries / D7 |
| A7 | Learned ranking or LLM compression | **Rejected** — AC-5; TokenGate breakage |
| A8 | Extend `compute_strict_proof_hash` / DEC-0038 | **Rejected** — D5 |
| A9 | Rewrite `materialize_codebase_map.py` | **Rejected** — D6 / R-0060 / DEC-0065 |
| A10 | New RuntimeConfig context domain | **Rejected** — D3 consume-only |
| A11 | SQLite as pack persistence | **Rejected** — US-0140 |
| A12 | Rewrite PolicyEngine / config / auth / KernelBridge / `noTools` | **Rejected** — D2 / D9 compose |
| A13 | Fail-closed empty pack when AFT/LSP/embeddings down | **Rejected** — AC-8 |

**Can this be simpler?** Loading the AFT Pi plugin looks smaller and fails D2 (mutation hoist) plus R1 (Pi imports outside pi-kernel). One mega-package mixing retrieval and packing fails the provider-vs-assembler split. A1 is the simplest design that meets AC-1..AC-8.

### Locked surfaces (DEC-0139)

1. **Packages**: `@its-magic/code-intelligence` (`standalone/packages/code-intelligence`) and `@its-magic/context-engine` (`standalone/packages/context-engine`). Both `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. **No Pi dependency.** Type-only `@its-magic/config` allowed (TOKEN_PROFILE / AUTO_PHASE_INCLUDE|EXCLUDE / SOVEREIGN_MEMORY). Do **not** import PolicyEngine internals. Extend US-0133..0138 Pi-import grep to both packages. No Biome override. Kit `files` omit `standalone/`. **Execute owns package creation.**
2. **Provider**: `CodeIntelligenceProvider` methods — `status`, `search` (lexical+semantic), `outline`, `symbol`, `references`, `callers`/`callees`, `impact`, `diagnostics`, `refresh(changes?: Path[])`. Backend-neutral; AFT is an internal constructor, not a public package.
3. **Nested AFT read adapter**: `code-intelligence/src/aft/`. Sidecar JSON-over-stdio, **one warm process per repo root**. Adapter-owned pin **`AFT_BINARY_VERSION="0.55.1"`** (EARLY_RESEARCH analog `@cortexkit/aft` 0.55.1; not a runtime npm dependency). Resolve: cache → npm platform package matching pin → PATH. **CI never downloads** (no cargo, no GitHub release). Fake adapter in CI. Do **not** import `@cortexkit/aft-pi` / `@cortexkit/aft-opencode` / `@cortexkit/aft-bridge`.
4. **Read allowlist / mutation deny**: Never register or forward `write`/`edit`/`apply_patch`/`aft_delete`/`aft_move`/`aft_transform`/`aft_refactor`/`ast_grep_replace`. Adapter returns `INTEL_MUTATION_DENIED`. Production mutations stay `itsm_edit`/`itsm_write`/`itsm_patch` via existing PolicyEngine.
5. **Unstub existing names**: ToolBroker handlers for `itsm_search`/`itsm_outline`/`itsm_symbol`/`itsm_references`/`itsm_callers`/`itsm_impact` call the injected provider. Add `LIVE_INTEL_TOOLS` and **drop those six from `STUB_TOOLS`**. Decision tables (path/shell/secret/profile/audit) **unamended**. Remaining stubs (app/browser/test/validate/spawn_review) stay stub-denied. No parallel `aft_*`/`intel_*` production tool names.
6. **Ranking + TOKEN_PROFILE caps** (first cap wins; remainder `CONTEXT_BUDGET` + dropped-id audit):

| Rank kind | Weight |
|-----------|--------|
| exact_symbol | 100 |
| lexical_exact | 80 |
| semantic | 60 |
| graph_edge | 50 |
| tests | 40 |
| git_recency | 30 |
| active_ac | 25 |
| architecture_decision | 20 |

`MMR_LAMBDA=0.7` (0.3 redundancy penalty). Caps: `lean` 6000 tokens / 8 files / 16 hits; `balanced` 12000 / 16 / 32; `full` 24000 / 32 / 64. Consume US-0138 `TOKEN_PROFILE` — **no new RuntimeConfig domain**. Giant prompt bodies never enter the ranker. Deterministic; no LLM-in-the-loop compression.

7. **Assembler exclusion** (context-engine owns include/exclude; provider is retrieval-only): default exclude previous-role transcripts, secrets/credential blobs, whole backlog/history, giant static prompts / command markdown, `.env`. Consume `AUTO_PHASE_INCLUDE`/`AUTO_PHASE_EXCLUDE`/`SOVEREIGN_MEMORY` as injected flags. When `SOVEREIGN_MEMORY=1`, inject size-capped digest **1500 tokens** only. HOT/WARM/COLD compose US-0053/US-0096. Fresh role session compose US-0136; fill attestation `context_pack_hash` with this pack `content_hash`. Never read `.env`.
8. **Pack envelope** (owned; **not** DEC-0038): `{ schema_version, token_profile, source_refs: [{ kind, path, start?, end?, snippet_sha256 }], ranked_ids, exclude_set_hash, content_hash }`. `content_hash` = SHA-256 of canonical sorted-key JSON of those fields excluding `content_hash`. Snippets hashed; full source and secrets never persisted. Persist gitignored runtime JSON under DEC-0133 `agentDir` analog. Python validators ignore unknown sidecar keys. SQLite deferred to US-0140.
9. **Derived codebase-map**: compose `scripts/materialize_codebase_map.py` (US-0082 / DEC-0065). Do **not** rewrite sentinel / `[CODEBASE_MAP_OK]` / `CODEBASE_MAP_BLOCKED:*`. Fresh/missing/bootstrap-sentinel maps may refresh. Non-bootstrap operator maps: **preserve body**; write coverage/version to sibling gitignored `docs/engineering/codebase-map.meta.json`. Map is not the index DB.
10. **Benchmark**: `standalone/tests/fixtures/code-intel` + `bench` export from code-intelligence (fake-model, fake-AFT). Measures NL lookup, exact symbol, callers, tests, impact, cross-language ref, recent changes, fixture monorepo latency, token use, stale-index recovery. Live AFT / paid embeddings never CI. **`crates/its-indexd` OUT**. Later-story evidence = documented AC-7 latency/coverage failures the AFT read adapter cannot recover after N measured runs — not authored here.
11. **Degradation**: partial pack + reason codes, never silent empty. `INTEL_AFT_UNAVAILABLE`, `INTEL_LSP_UNAVAILABLE`, `INTEL_EMBEDDINGS_UNAVAILABLE`, `INTEL_INDEX_STALE`, `INTEL_INDEX_UNAVAILABLE`, `INTEL_MUTATION_DENIED`, `CONTEXT_EXCLUSION`, `CONTEXT_BUDGET`. Fallback: AFT read → lexical/git/artifact-only. Stale index: serve pack with `INTEL_INDEX_STALE` and trigger refresh; do not block the phase on AFT health.
12. **OUT**: credentials (US-0135), US-0140 workflow, US-0138 rewrite, OS sandbox (US-0141), its-indexd, SQLite pack store, `@cortexkit/aft-pi`.
13. **Tests**: 12 `test_us0139_*`; Win+Linux; fake-model + fake-AFT CI held.

### Critic NB closures (research us0139rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 fail-closed edges named; stale index, AFT/LSP/embeddings unavailable, secret/.env deny, its-indexd OUT | LOCKED §4, §7–§11; T-002, T-005, T-008, T-009 |
| NB2 `code-intelligence` + `context-engine` boundary; ToolBroker unstub `itsm_*`; PolicyEngine/config/RoleCatalog compose-only; US-0140 OUT | LOCKED this H1 + DEC-0139; T-001, T-003 |
| NB3 no provider/context-engine code; no DONE; 11 tasks ≤ 12; no its-indexd | Held — T-anch; Status OPEN; execute owns packages; do not spawn `/sprint-plan` from this subagent |

## Components

### `code-intelligence` package (AC-1, AC-2, AC-7, AC-8)

- Provider interface + nested AFT read sidecar + fake adapter + incremental `refresh` + `bench` export
- Grep denies `@earendil-works/pi-` and `@cortexkit/aft-pi` inside the package

### `context-engine` package (AC-3, AC-4, AC-5)

- `code_context(task)` ranker + TOKEN_PROFILE caps + assembler exclusion + pack envelope hash
- Calls provider interface only (not AFT protocol)

### ToolBroker compose (AC-1, AC-2)

- Unstub six `itsm_*` names via injected provider; `LIVE_INTEL_TOOLS`; PolicyEngine tables unamended

### Derived map compose (AC-6)

- Invoke `materialize_codebase_map.py`; sibling `codebase-map.meta.json` for non-bootstrap coverage/version

### Contract tests (AC-1..AC-8)

- Twelve markers (DEC-0139 §14). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0139 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0139.md`. Locks A1, packages, AFT pin, unstub, ranking, caps, exclusion, pack hash, map compose, benchmark OUT, degradation, markers, seeds.

## Risks finalized (R1–R6 from R-0132)

- **R1 (MEDIUM)** AFT binary/platform drift Win vs Linux → fake adapter in CI; version pin 0.55.1; doctor optional / out of CI
- **R2 (MEDIUM)** Nested adapter vs later its-indexd swap friction → provider interface is the swap boundary; promote package only with D7 evidence
- **R3 (LOW)** TOKEN_PROFILE integer caps too tight/loose → this H1 pins; tests lock winners; orthogonal to thinking
- **R4 (MEDIUM)** Accidental AFT mutation leak if protocol grows → allowlist + `INTEL_MUTATION_DENIED` + test 2
- **R5 (LOW)** Operators treat codebase-map as the index → DQ6 derived-only; map is not the DB
- **R6 (LOW)** Pack hash confused with DEC-0038 runtime proof → DQ5 separate envelope; do not extend `compute_strict_proof_hash`

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0138 / DEC-0138 / R-0130 | `TOKEN_PROFILE` + phase include/exclude + `SOVEREIGN_MEMORY` | ✓ consume-only; loaders unamended |
| US-0137 / DEC-0137 / R-0129 | PolicyEngine / ToolBroker | ✓ unstub six names; tables unamended |
| US-0136 / DEC-0136 / R-0128 | SessionSupervisor / RoleCatalog / `context_pack_hash` stub | ✓ fill hash; internals unamended |
| US-0135 / DEC-0135 / R-0127 | auth-models / credentials | ✓ OUT; never read `.env` |
| US-0134 / DEC-0134 / R-0122 | KernelBridge | ✓ unamended |
| US-0133 / DEC-0133 / R-0121 | AgentKernel, isolation loader, `noTools`, fake-model CI, `agentDir` | ✓ unamended; pack persist under agentDir analog |
| US-0082 / DEC-0065 / R-0060 | `materialize_codebase_map.py` | ✓ compose; contract unamended |
| US-0053 / US-0096 | HOT/WARM/COLD | ✓ compose; not rewrite |
| US-0056 / DEC-0038 | `compute_strict_proof_hash` tuple | ✓ UNAMENDED |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0140..US-0148 | later capabilities | ✓ OUT OF SCOPE |
| BUG-0020 / R-0126 | OpenCode `/auto` | ✓ DONE; not reopened |
| BUG-0021 / R-0131 | OpenCode CLI TUI `/auto` | ✓ OPEN; not mutated |
| R-0120..R-0133 | prior research | ✓ not wiped |

## Sprint seeds (11 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` S0145)

- **T-anch** (`# US-0139` H1 + DEC-0139 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `packages/code-intelligence` + `packages/context-engine` + Pi-import grep)
- **T-002** (AC-1/AC-2 — `CodeIntelligenceProvider` + nested AFT read sidecar + fake adapter + mutation deny)
- **T-003** (AC-2 — ToolBroker unstub `itsm_*` + `LIVE_INTEL_TOOLS`; no PolicyEngine table rewrite)
- **T-004** (AC-3 — `code_context` ranking + TOKEN_PROFILE caps)
- **T-005** (AC-4 — per-phase exclusion assembler + sovereign digest cap)
- **T-006** (AC-5 — source refs + content hash; not DEC-0038)
- **T-007** (AC-6 — derived codebase-map compose materialize + `codebase-map.meta.json`)
- **T-008** (AC-7 — benchmark harness; its-indexd OUT)
- **T-009** (AC-8 — degradation + incremental refresh)
- **T-010** (AC-1..AC-8 — 12 `test_us0139_*` Win/Linux fake-model + fake-AFT)

AC surjection: AC-1→T-001,T-002 (T-010 m1); AC-2→T-002,T-003 (T-010 m2); AC-3→T-004 (T-010 m3); AC-4→T-005 (T-010 m4); AC-5→T-006 (T-010 m5); AC-6→T-007 (T-010 m6); AC-7→T-008 (T-010 m7); AC-8→T-009 (T-010 m8–m12). Order: T-anch → T-001 → T-002 → T-003 → {T-004, T-005} → T-006 → T-007 → T-008 → T-009 → T-010. No split (11 ≤ 12). Not `/quick`. Do **not** write `sprints/S0145/` this phase.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0139`, `sprint_id=none` (pending — sprint-plan owns S0145), `orchestrator_run_id=auto-20260913-us0139`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0139-architecture-20260913T173500Z-fresh`, `timestamp=2026-09-13T17:35:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0132; docs/product/backlog.md ## US-0139; docs/engineering/architecture.md (this # US-0139); decisions/DEC-0139.md; handoffs/resume_brief.md`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133/US-0134/US-0135/US-0136/US-0137/US-0138 DONE compose-only not reopened. BUG-0020 DONE not reopened. BUG-0021 OPEN not mutated. No US-0140+ authoring. No `/sprint-plan` spawn from this subagent. No `standalone/packages/code-intelligence` or `context-engine` this phase.
- Prior phase strict proof consumed: `rp-auto-20260913-us0139-research-techlead-20260913T171500Z-US-0139` / `D93CCEC8331FF46E4379CCAC53672D45C25DC79F44D241DC4FFF2724FCF2B465` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; critic consume-before-TTL `2026-09-13T17:25:00Z` < `2026-09-13T18:15:00Z`; immutable R-0132). Critic findings us0139rsc-* informational only (`rp-auto-20260913-us0139-sovereign-critic-techlead-20260913T172500Z-US-0139` / `6BCC5D7C6567AD1A31DCC5426699D9E2430245EAE400B4F0C7F5D24FD3791F65`; anti_slop=10; 0 blocking; degraded_mode=false).

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0139-architecture-techlead-20260913T173500Z-US-0139`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0139","phase_id":"architecture","proof_issued_at":"2026-09-13T17:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0139-architecture-techlead-20260913T173500Z-US-0139"}`
- `proof_hash=93664305B6847E244901E87027891EA2EC9FA4E23F9A66B5CC5BC00293C0F51C` (SHA-256; actual `compute_strict_proof_hash`)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T18:35:00Z` (UTC)
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0139`

## Decision gate + next scheduled phase

- `decision_gate=false` (no blocking unknown; DQ1–DQ10 LOCKED; DEC-0139 Accepted; approach A1 locked; critic NBs closed)
- `next_scheduled_phase=sovereign-critic` (architecture), then `/sprint-plan` (role=tech-lead; S0145; third canonical phase of `plan` macro). ultra_lean: after sprint-plan next is execute (orchestrator skips plan-verify).
- `next_scheduled_role=tech-lead` (critic, then sprint-plan)
- `stop_condition=STOP after architecture completes; hand off via artifacts only. Orchestrator MUST spawn sovereign-critic (architecture) then /sprint-plan in fresh tech-lead subagents (BUG-0006). Do NOT spawn /sprint-plan or critic from this subagent. Do NOT mark US-0139 DONE. Do NOT tick acceptance. Do NOT reopen US-0138, US-0137, US-0136, US-0135, or BUG-0020. Do NOT design US-0140+. Do NOT create standalone/packages/code-intelligence or context-engine. Do NOT create sprints/S0145/.`

