# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 3
- Retained units in hot file: 13
- First archived heading: `## Architecture handoff — US-0138 Typed runtime configuration and legacy migration adapter`
- Last archived heading: `## Discovery handoff — US-0139 Persistent code intelligence and bounded context engine`
- Verification tuple (mandatory):
  - archived_body_lines=119
  - retained_body_lines=592

---

## Architecture handoff — US-0138 Typed runtime configuration and legacy migration adapter

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0138 only. **Sprint**: (pending — materialize S0144 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T14:15:00Z. **Fresh marker**: `tl-US0138-architecture-20260913T141500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0138`, parent=`auto-20260913-us0137`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0138`**. Research **`R-0130`** (DQ1–DQ10 unchanged). Discovery D1–D10 unchanged. **No R-0131**. Companion **DEC-0138 Accepted**.
- **Approach**: **A1 (A\*)** LOCKED — `@its-magic/config` (no Pi) + Zod-typed versioned `RuntimeConfig` + JSONC `.its-magic/config{,.local,.example}.json` same files as US-0131 analog (do not rewrite `host_runtime_config_lib.py`) + TS `LegacyScratchpadAdapter` (no Python spawn, no forced migration) + public 5-layer ladder mapped onto kit 7-layer + per-key provenance + `CONFIG_*` fail-closed + secret names/handles only (credentials OUT US-0135) + US-0119 expansion with `security_hard` unrelaxable + inject PolicyEngine/ModelRouter/RoleCatalog flags only. 12 `test_us0138_*`. Seeds T-anch + T-001..T-010 (11 ≤ 12). **Execute owns `standalone/packages/config`.**
- **Rejected**: A2–A12 per R-0130 / DEC-0138.
- **CLI pins**: `--delivery-mode` / `--token-profile` / `--autonomy-preset` / `--work-kind` / `--runtime-override KEY=VAL` / `--config-strict` with env peers `ITSM_RUNTIME_<KEY>`.
- **Permission map**: `none`→`supervised`; `balanced`/`full`→`autonomous`; `interactive`→`ask-on-write`; `auto`→`default-deny`.
- **Sibling boundary**: US-0139..US-0148 OPEN — OUT OF SCOPE. US-0133/0134/0135/0136/0137 DONE — compose only; do not reopen. BUG-0020 DONE — do not reopen. Do not create `standalone/packages/config` or `sprints/S0144/` this phase. Do not restore STOP-only `auto.md`. Do not spawn `/sprint-plan` from this architecture chat.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0138-architecture-techlead-20260913T141500Z-US-0138`
- `proof_hash=7400FC661403FBA49902875B7A08FB930D156840A8B84EF9ED5D5B385DF6BEE4`
- `proof_ttl=2026-09-13T15:15:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0138","phase_id":"architecture","proof_issued_at":"2026-09-13T14:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0138-architecture-techlead-20260913T141500Z-US-0138"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0138`
- Consumed research proof: `rp-auto-20260913-us0138-research-techlead-20260913T135500Z-US-0138` / `68976ADDB5153E18222EC444D27B3962EB8155714E9F8711F2F9BA7016EF4D3A` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-13T14:55:00Z`)
- Consumed critic proof: `rp-auto-20260913-us0138-sovereign-critic-techlead-20260913T140500Z-US-0138` / `1C72EEDDCB0786F986E953E38CC99F98EE9FAF35E2230EE84EF04C726159287A` — MATCH; anti_slop=10; 0 blocking; degraded_mode=false

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0138`, `fresh_context_marker=tl-US0138-architecture-20260913T141500Z-fresh`, `model_id=cursor-grok-4.6-high`
- `evidence_ref=docs/engineering/architecture.md # US-0138; decisions/DEC-0138.md; docs/engineering/research.md ## R-0130; docs/product/backlog.md ## US-0138; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended newest H1 `# US-0138` (not `## US-`); `baseline_h2_count=0`; heading policy PASS (after=0). Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1336/1200 + `architecture` 3110/3000 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=2,1` pack_state=`docs/engineering/state-archive/state-pack-20260913-bn.md` (archived execute-critic through QA US-0137; archived_body_lines=162; retained_body_lines=1174) pack_arch=`docs/engineering/architecture-archive/architecture-pack-20260913-c.md` (archived `# US-0132`; archived_body_lines=152; retained_body_lines=2958) → `--post` exit 0; final `--check` PASS (`state` 1174/1200; `architecture` 2958/3000; `po_to_tl` 637/650). `[CODEBASE_MAP_OK]` preserved_existing.
- **Status**: US-0138 remains **OPEN**. **Next**: sovereign-critic of architecture, then `/sprint-plan` S0144 in fresh **tech-lead** subagent. ultra_lean: plan-verify skipped after sprint-plan. Do not spawn sprint-plan from this architecture chat. STOP.

## Intake handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0021. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-13T11:20:00Z. **Fresh marker**: `po-BUG0021-intake-20260913T112000Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260913-BUG0021-intake`, `intake_run_id=cursor-20260913-BUG0021-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `INTAKE_SUBAGENT_FALLBACK=deny`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0021** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0021-intake-20260913.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]` (pre-write)
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — `[BUG_VALIDATION_OK]`
  - `python scripts/intake_bug_resume_brief_refresh.py --bug-id BUG-0021 --validate-file` — `[INTAKE_RESUME_BRIEF_VALIDATE_OK]`; `intended_resume_phase=discovery`; `resolved_start_phase=discovery`; `resolution_source=resume_brief`; `bug_id=BUG-0021`. In-place `--resume-brief` upsert skipped: 72 historical `## Latest orchestration pointer*` headings would be clobbered; canonical DEC-0069 block prepended via `build_latest_pointer_markdown` (US-0138 / prior history retained).
- **Research**: **R-0131** (`docs/engineering/research.md`) — intake-time Context7 `/anomalyco/opencode`: TUI plugin default export `{ id, tui }` + `api.keymap.registerLayer` (`name`/`slashName`, bindings `{ key, cmd }`); kit `tui.ts` uses `Plugin.define({ setup })` + command `id` + keyless `bindings`. `GET /api/command` = Command.Info markdown (peers listed). C-limb `tui.json` listing live-falsified. Compose **R-0126** (do not wipe). Do not wipe R-0120..R-0130.
- **Operator ask**: working `/auto` command on OpenCode CLI TUI (comparable to Cursor `/auto`). Quotes (typos preserved): "ich erwarte mir einen /auto befehl der funktioniert."; "ich habe in der cli version von opencode weiterhin kein commant für auto."; "wenn ich \"/auto \" eingebe ohne, dass es als commant erkantn wird, durch das leerzeichen dahinter. komtm folgendes:"; host/model "Auto mode enabled. Describe the task you want handled."; "wie ist der korrekte weg autgo zu nutzen?".
- **Root cause (intake)**: BUG-0020 E2 C-limb registered CLI TUI load via `.opencode/tui.json` listing `its-magic-auto/tui.ts`. Operator CLI TUI still has **no `/auto`**. Typing `/auto ` (not highlighted as command) sends chat; LLM roleplays Auto mode — not `runAutoLifecycle`, not OpenCode `--auto`. Live TUI plugin API mismatch is the leading hypothesis (module shape + keymap fields). Files already present in this repo.
- **Duplicate check**: Persist **NEW BUG-0021**. Do **not** reopen BUG-0020 DONE. Do **not** restore STOP-only `auto.md` (BUG-0018). Not BUG-0019/0017/0015/0016. Do not drain US-0139+. Do not mutate US-0133..US-0148.
- **Decomposition**: **single_bug** — operator already invoked `/intake bug` (treat as **accept**). One outcome: listed, working OpenCode CLI TUI `/auto` that starts `runAutoLifecycle` (or documented `OPENCODE_*`).
- **Alternatives**: (1) persist BUG-0021; live-falsify C-limb; keep BUG-0020 DONE; listed+execute `/auto` without restoring `auto.md`; tests not file-existence-only — **recommended**; (2) restore STOP-only `auto.md` — **reject**; (3) reopen BUG-0020 — **reject**; (4) Cursor-only — **reject**.
- **Scope for `/discovery`**: lock CLI TUI plugin load vs live `{ id, tui }` + `registerLayer`; require invokable `/auto` that starts `runAutoLifecycle` or documented `OPENCODE_*`. Do not restore STOP-only `auto.md`. Do not reopen BUG-0020 ACs. Do not touch Cursor `auto.md`.
- **Risks**: R1 — kit `Plugin.define({ setup })` default export ignored by TUI loader that only reads `{ id, tui }` (R-0131 high); R2 — keyless `bindings` / command `id` vs `name` means slash never registers (high); R3 — JSON/md `auto` recreates BUG-0018; R4 — file-existence tests close the bug again without operator-visible `/auto`.
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0021`; `fresh_context_marker=po-BUG0021-intake-20260913T112000Z-fresh`; `timestamp=2026-09-13T11:20:00Z`; `model_id=cursor-grok-4.6`; `evidence_ref=docs/product/backlog.md ### BUG-0021, docs/product/acceptance.md BUG-0021 row, handoffs/intake_evidence/BUG-0021-intake-20260913.json, docs/engineering/research.md ## R-0131, this handoff`.
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section (same policy as BUG-0020 intake). Post-append `python scripts/enforce-triad-hot-surface.py --rollover --json` → `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-i.md","retained_lines":616,"retained_sections":13}` (archived `## Research handoff — BUG-0020`; archived_body_lines=43). Then `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1256/1200 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` pack_state=`docs/engineering/state-archive/state-pack-20260913-by.md` (archived `## Architecture checkpoint — US-0138`; moved=1; archived_body_lines=77; preamble_lines=11; retained_body_lines=1179) → `--post` exit 0; architecture not rolled; final `--check` PASS (`state` 1179/1200; `po_to_tl` 616/650). Intake did not append `docs/engineering/state.md`.
- **Status**: OPEN per US-0045. **Next**: `/discovery` (fresh **po**) for **BUG-0021**, or `/auto bug-target=BUG-0021`. Do not run discovery/architecture/execute from this intake chat. STOP.

## Discovery handoff — US-0139 Persistent code intelligence and bounded context engine

- **Phase completed**: discovery. **Role**: po. **Story**: US-0139 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T16:55:00Z. **Fresh marker**: `po-US0139-discovery-20260913T165500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0139`, parent=`auto-20260913-us0138`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1, FRAMEWORK_KIT_REPO=1, drain story 5 of 10.
- **Sibling boundary**: **US-0140..US-0148** OPEN — OUT OF SCOPE this segment (do not mutate). **BUG-0021** OPEN — OUT (R-0131 already allocated; do not reuse). **US-0133** / **US-0134** / **US-0135** / **US-0136** / **US-0137** / **US-0138** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Gap confirmed (narrow-read)**: Standalone TypeScript runtime has no `CodeIntelligenceProvider`, no AFT read adapter, no `code_context(task)` fusion, and no per-phase bounded context pack. Kit `scripts/materialize_codebase_map.py` (US-0082 / DEC-0065) remains the derived-map bootstrap — compose, do not rewrite. PolicyEngine already stubs `itsm_search`/`itsm_outline`/`itsm_symbol`/`itsm_references`/`itsm_callers`/`itsm_impact` (DEC-0137) — this story binds those names to a provider, not a new permission matrix. `@its-magic/config` owns phase/token/sovereign flags (DEC-0138) — consume-only.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | `CodeIntelligenceProvider` exposes status, search, outline, symbol, references, callers/callees, impact, diagnostics, and incremental refresh behind a backend-neutral interface (AC-1 / §17.2 / R8). v1 backend is a persistent **read-oriented AFT adapter** (AC-2 / §17.3). Agent must not notice a later backend swap (§17.4). |
| **D2** | Direct AFT mutation features are disabled or routed through `PolicyEngine` (AC-2 / §17.3 / R2). **No raw AFT write** in production Pi sessions. Compose DEC-0137: unstub `itsm_search` / `itsm_outline` / `itsm_symbol` / `itsm_references` / `itsm_callers` / `itsm_impact` via ToolBroker; do **not** rewrite PolicyEngine decision tables, `noTools: "builtin"`, or isolation loader. |
| **D3** | `code_context(task)` ranks semantic + exact matches, symbols, graph edges, tests, git signals, active ACs, architecture, and decisions into a bounded context pack (AC-3 / §17.5). Pack size consumes US-0138 `TOKEN_PROFILE` (`lean`/`balanced`/`full`) — **consume-only**; do not rewrite `RuntimeConfig` unless `/research` proves a typed context key is required. |
| **D4** | Per-phase context includes only relevant work, handoff, state, decision, diff/failure, and bounded sovereign inputs (AC-4 / §18.1). Default **exclude**: previous-role transcripts, secrets, whole backlog/history, giant prompt bodies, `.env` (AC-4 / §18.2). HOT/WARM/COLD layering (§18.3 / US-0053 / US-0096). Compose US-0136 fresh sessions — no cross-role transcript leakage. Consume `AUTO_PHASE_INCLUDE`/`AUTO_PHASE_EXCLUDE` and `SOVEREIGN_MEMORY` flags from config. |
| **D5** | Persist context source refs + a content hash for reproducibility without duplicating secret or full source content (AC-5 / §18.4). Never read `.env`. Never persist credentials. Pack hash is **not** the DEC-0038 runtime-proof tuple — do **not** extend `compute_strict_proof_hash`. |
| **D6** | Fresh repos auto-index and generate/refresh `docs/engineering/codebase-map.md` as a **derived** map with coverage/version metadata (AC-6 / §17.6). Compose US-0082 / DEC-0065 `materialize_codebase_map.py` (sentinel `<!-- its-magic:codebase-map-bootstrap v1 -->`, `[CODEBASE_MAP_OK]`, `CODEBASE_MAP_BLOCKED:*`); do **not** rewrite that contract without cause. US-0076 freshness compose-only. Map is not the primary index database. |
| **D7** | Repeatable benchmark measures NL lookup, symbols, callers, tests, impact, cross-language refs, recent changes, monorepo latency, token use, and stale-index recovery (AC-7 / §17.7). Goal is measured agent usefulness, not marketing Cursor parity. Owned Rust `its-indexd` / `crates/its-indexd` is **explicitly deferred** pending benchmark evidence (Boundaries / §17.4 / §30). |
| **D8** | Tests `test_us0139_*` prove incremental refresh after edits and safe degradation/recovery when AFT, LSP, embeddings, or the index is unavailable/stale (AC-8 / §36 / §21.3). Fake-model CI. Windows + Linux. Large logs stay in evidence files and are summarized to the model (§21.3). |
| **D9** | New packages per §30: `standalone/packages/code-intelligence` (`@its-magic/code-intelligence`) + `standalone/packages/context-engine` (`@its-magic/context-engine`). `aft-adapter` nested vs sibling = **DQ1**. **No Pi imports** outside `packages/pi-kernel` (R1 / DEC-0133). Do not rewrite PolicyEngine/ToolBroker tables, `@its-magic/config` loaders, auth-models, KernelBridge, or `noTools`. Out of scope: US-0140 WorkflowEngine, US-0141 OS sandbox, US-0142 browser, US-0143 drain, US-0144 critic *content*, BUG-0021. US-0133..US-0138 / BUG-0020 not reopened. US-0140+ not mutated. |
| **D10** | Research questions DQ1–DQ10 → `/research` authors **R-0132** (next after highest existing **R-0131** BUG-0021; **do not reuse R-0131**; compose R-0130/DEC-0138 + R-0129/DEC-0137 + R-0128/DEC-0136 + R-0060/DEC-0065; do not wipe R-0120..R-0131). PO does **not** author `## R-0132`. Companion **DEC-0139** + `# US-0139` at `/architecture` only — PO does not author them. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0132**; stub only here)

1. **DQ1**: Package split — `code-intelligence` + `context-engine` vs fold; `aft-adapter` nested vs `standalone/packages/aft-adapter`; no Pi imports; who injects provider into ToolBroker without those packages importing PolicyEngine internals.
2. **DQ2**: AFT process model — sidecar vs in-process; version pin; Windows + Linux; persistent warm process; how read-only adapter disables/wraps AFT edit/write.
3. **DQ3**: Ranking for `code_context(task)` — deterministic weights vs learned; token budget vs `TOKEN_PROFILE`; what “bounded” means in tokens/files/hits.
4. **DQ4**: Per-phase exclusion enforcement — session assembler vs provider; sovereign digest size cap; relation to US-0096 hot/warm/cold and US-0136 attestation (compose, do not rewrite).
5. **DQ5**: Context-pack source-ref + content-hash schema; algorithm; where persisted (artifact vs SQLite operational metadata per US-0140 boundary); secret/full-source exclusion tests.
6. **DQ6**: `codebase-map.md` — consume `materialize_codebase_map.py` vs additive coverage/version metadata; when to refresh vs preserve non-bootstrap maps; do not rewrite US-0082 contract without cause.
7. **DQ7**: Benchmark harness location, fixture repos, latency/token metrics, stale-index recovery; what evidence would later justify `its-indexd` (must remain OUT this story).
8. **DQ8**: Degradation matrix when AFT / LSP / embeddings / index unavailable or stale — fail-closed vs partial pack + reason codes; incremental `refresh(changes)`.
9. **DQ9**: Kernel compose — unstub existing `itsm_*` search names vs new names; empty loader + `noTools` held; KernelBridge unamended; config consume-only (`TOKEN_PROFILE`, phase include/exclude, `SOVEREIGN_MEMORY`); no new RuntimeConfig domain unless required.
10. **DQ10**: `test_us0139_*` Win+Linux inventory — provider methods; AFT mutation deny/route; ranking bounds; exclusion list; hash/refs; derived map; benchmark smoke; incremental refresh; each degradation class.

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 17, 18, 21.3, 30 (`code-intelligence` / `context-engine` / `aft-adapter`; `crates/its-indexd` deferred), 32 Phase 2, 36, R1/R2/R8
- EARLY_RESEARCH analog (DQ seed, not adopted): https://github.com/cortexkit/aft and `packages/pi-plugin/README.md`
- Compose: `decisions/DEC-0138.md` (config consume-only), `decisions/DEC-0137.md` (AFT mutations routed; search stubs), `decisions/DEC-0136.md` (sessions), `decisions/DEC-0065.md` (US-0082 map)
- Compose: `docs/engineering/research.md` R-0130 / R-0129 / R-0128 / R-0060 (do not wipe R-0120..R-0131; R-0131 is BUG-0021)
- Compose: `standalone/packages/policy-engine` STUB_TOOLS; `standalone/packages/tool-broker/src/catalog.ts` SEARCH_STUBS; `standalone/packages/config/src/types.ts` phase/token/sovereign; `scripts/materialize_codebase_map.py`
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`code-intelligence-aft` + `context-engine` → US-0139)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0132** (deterministic continuation; `ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0131** BUG-0021).
- **Do not** author `## R-0131` (already taken). **Do not** author `## R-0132` this phase — tech-lead owns allocation at `/research`.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0139-discovery-po-20260913T165500Z-US-0139`
- `proof_hash=C49A557A4028330D420A97DFEC8D53472F3BF26BCDAB948D13A4C9270FCCE881`
- `proof_ttl=2026-09-13T17:55:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0139","phase_id":"discovery","proof_issued_at":"2026-09-13T16:55:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0139-discovery-po-20260913T165500Z-US-0139"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0139`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → C49A557A4028330D420A97DFEC8D53472F3BF26BCDAB948D13A4C9270FCCE881; **64 hex** verified)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0139`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0139-discovery-20260913T165500Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0139 discovery_notes; docs/product/acceptance.md US-0139 row (unchecked); handoffs/intake_evidence/US-0133-0148-intake-20260911.json; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=2,2` pack_state=`docs/engineering/state-archive/state-pack-20260913-ca.md` (archived `## Sprint-plan checkpoint — US-0138 / S0144` through `## Sovereign-critic checkpoint — sprint-plan US-0138`; archived_body_lines=162; preamble_lines=11; retained_body_lines=1131) pack_po=`handoffs/archive/po-to-tl-pack-20260913-j.md` (archived `## Architecture handoff — BUG-0020` + `## Discovery handoff — US-0135`; archived_body_lines=91; retained_body_lines=592) → `--post` exit 0; architecture not rolled; final `--check` PASS (`state` 1131/1200; `po_to_tl` 592/650).
- **Status**: US-0139 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: sovereign-critic (discovery) then `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

