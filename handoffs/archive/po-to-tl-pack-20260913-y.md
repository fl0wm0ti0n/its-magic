# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 13
- First archived heading: `## Sprint-plan handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json`
- Last archived heading: `## Discovery handoff — US-0140 Canonical lifecycle and gate orchestrator`
- Verification tuple (mandatory):
  - archived_body_lines=104
  - retained_body_lines=598

---

## Sprint-plan handoff — BUG-0021 OpenCode CLI TUI still has no invokable `/auto` after BUG-0020 tui.json

- **Phase completed**: sprint-plan. **Role**: tech-lead. **Bug**: BUG-0021 only. **Sprint**: **S0146**. **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T12:40:00Z. **Fresh marker**: `tl-BUG0021-sprintplan-20260913T124000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0021`, `parent_orchestrator_run_id=cursor-20260913-BUG0021-intake`, `delivery_mode=ultra_lean`, macro=`plan` (sprint-plan terminal; plan-verify NOT in resolved_phase_plan — skipped), `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK` (requested_slug=`gpt-5.6-sol-high`), CROSS_MODEL_REVIEW=1, AUTO_QUIET=1.
- **Sibling boundary**: BUG-0020/BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE — out of scope; do not reopen ACs / S0140. **BUG-0022 OPEN** — do not mutate. Do not mutate US-0133..US-0148; do not drain US-0139+; do not reuse S0145. Do **not** restore `.opencode/commands/auto.md`. Do **not** rewrite historical `# BUG-0020`.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# BUG-0021`**. **Companion DEC**: **none**.
- **Approach**: **Axis A LOCKED**. 8 tasks T-anch + T-001..T-007 (≤ SPRINT_MAX_TASKS=12; 1:1 architecture seeds). All 8 `test_bug0021_*` mapped (m7 T-007, m8 T-006; T-005 owns m1–m8 including m4+m6).
- **Architecture consumed**: `rp-auto-20260913-bug0021-architecture-techlead-20260913T121000Z-BUG-0021` / `7621D2D4FCE1EEB34FF8E41F8B26F6069E5D348833F8EEBEF8CD5210DE53A60B` — RUNTIME_PROOF_VALID MATCH at `2026-09-13T12:40:00Z` before TTL `2026-09-13T13:10:00Z`; critic PASS `rp-auto-20260913-bug0021-sovereign-critic-techlead-20260913T123600Z-BUG-0021` / `83E7EEBC715167A882F8A5301DC8FBCB63610CAEEBFB1748A28EC830D127E2BE`; anti_slop=10; 0 blocking; NBs `bug0021arc-*` routed as execute awareness.

### Locked sprint (S0146)

- T-anch: verify `# BUG-0021` H1 + Axis A + R-0134; no `# BUG-0020` rewrite.
- T-001: reshape `tui.ts` `{ id, tui }` (marker 1).
- T-002: `registerLayer` `name`/`slashName: auto`/`palette`/`ctrl+shift+a` (marker 2).
- T-003: `run()` → `api.client.rpc` → `runAutoLifecycle`; keep `editor.add` (marker 3).
- T-004: `OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED` + `#36505` residual (marker 5).
- T-005: 8 `test_bug0021_*` (owns m1–m8 including m4 + m6).
- T-006: upgrade overwrite reshaped `tui.ts`; still prune `auto.md` (marker 8).
- T-007: runbook + `--pure` out + `BUG0021_PAIRS` (marker 7).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0021-sprint-plan-techlead-20260913T124000Z-BUG-0021`
- `proof_hash=11A440144E6A2350DADBE1C2709BE6A2769E15D1074964211AD11CD7897423DD`
- `proof_ttl=2026-09-13T13:40:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0021","phase_id":"sprint-plan","proof_issued_at":"2026-09-13T12:40:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0021-sprint-plan-techlead-20260913T124000Z-BUG-0021"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=S0146`, `story_id=BUG-0021`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 11A440144E6A2350DADBE1C2709BE6A2769E15D1074964211AD11CD7897423DD)

### Isolation + stop

- `phase_id=sprint-plan`, `role=tech-lead`, `bug_id=BUG-0021`, `sprint_id=S0146`, `fresh_context_marker=tl-BUG0021-sprintplan-20260913T124000Z-fresh`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`
- `evidence_ref=sprints/S0146/{sprint,tasks,progress,uat}.{md,json}; sprints/S0146/plan-verify.json; docs/product/backlog.md ### BUG-0021 sprint_plan_notes; this handoff; docs/engineering/state.md sprint-plan checkpoint; handoffs/tl_to_dev.md; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED state 1358/1200 + po_to_tl 679/650 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` pack_state=`docs/engineering/state-archive/state-pack-20260913-ci.md` (moved=2) pack_po=`handoffs/archive/po-to-tl-pack-20260913-n.md` (moved=1) → `--post` exit 0; architecture not rolled; heading-policy baseline_h2_count=0 PASS; final `--check` PASS.
- **Status**: BUG-0021 remains **OPEN**. Acceptance unchecked. **Next**: sovereign-critic of sprint-plan then `/execute` in fresh **dev** subagent. Do not spawn execute, plan-verify, or critic from this sprint-plan chat. STOP.

## Discovery handoff — US-0140 Canonical lifecycle and gate orchestrator

- **Phase completed**: discovery. **Role**: po. **Story**: US-0140 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T20:15:00Z. **Fresh marker**: `po-US0140-discovery-20260913T201500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0140`, parent=`auto-20260913-us0139`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6-high`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1, FRAMEWORK_KIT_REPO=1, drain story 6 of 10.
- **Sibling boundary**: **US-0141..US-0148** OPEN — OUT OF SCOPE this segment (do not mutate). **US-0143** drain/compressed routes OUT. **BUG-0021** OPEN / **BUG-0022** OPEN — do not mutate. **US-0133** / **US-0134** / **US-0135** / **US-0136** / **US-0137** / **US-0138** / **US-0139** DONE — compose only; do not reopen. **BUG-0020** DONE — do not reopen.
- **Gap confirmed (narrow-read)**: Standalone TypeScript runtime has no `WorkflowEngine`, no `CommandRouter`, no standard phase graph, no GateEngine, no crash-resume reconcilers, and no operational SQLite. Kit Python `/auto` + validators remain the Cursor/OpenCode host path — consume via KernelBridge (US-0134), do not copy. Role-runtime/PolicyEngine/config/context-engine exist and must be composed, not rewritten. Standard lifecycle correctness must stand alone without US-0143 routes.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Owned workflow package is **`standalone/packages/runtime-core`** (`@its-magic/runtime-core`) with nested `workflow/` (CommandRouter + WorkflowEngine + phase graph), `runs/`, and `recovery/` per §30. GateEngine nested vs sibling and sibling `packages/workflow` = **DQ1**. **No Pi imports** outside `packages/pi-kernel` (R1 / DEC-0133). Do **not** rewrite AgentKernel isolation loader or `noTools: "builtin"`. Do **not** fold RoleCatalog/SessionSupervisor into this package (US-0136 A2 rejected — compose). |
| **D2** | Standard phase graph §14.1: intake → discovery → research → architecture → sprint-plan → plan-verify → execute ↔ qa (bounded) → verify-work → release → closure → refresh-context. Each command runs the §14.3 seven steps (target/config, preconditions, role/model/tool/context, fresh-session spawn, validators, evidence, next-state intent). Agent work is **spawn-only** (BUG-0006 / DEC-0051). Host Cursor/OpenCode orchestrators remain scheduling-only. `/auto` and `/quick` are **US-0143** — not implemented as delivery routes here (fail-closed stub vs omit = DQ2). No 200-line prompt is the engine. |
| **D3** | Execute/QA rework is bounded (consume US-0138 `AUTO_IMPLEMENTATION_LOOP` / loop caps). Decision gates, security-review, and critics **supplement** rather than substitute the owning producer (AC-3 / §14.1 / §22). Compose US-0136 fresh critic/review sessions; critic *content* is **US-0144** OUT. |
| **D4** | Release gate order (AC-4 / US-0039 KEEP / §35): check-in tests → independent QA → UAT → documentation/release artifacts → fail-closed reason semantics. Release cannot bypass QA/UAT. Publish/deploy targets are **US-0145** OUT. |
| **D5** | Release ≠ closure (AC-5 / §25.4). Release cannot mark stories DONE (US-0045). Closure requires valid release evidence before reconciling backlog, acceptance, status, isolation, and closure-verification, then routes refresh-context. |
| **D6** | Repository artifacts remain canonical (§27.1 / AC-6). SQLite stores operational run/session/audit/process/index metadata only (§27.2). Do not move backlog/acceptance/decisions/sprint state into SQLite. Library/path = **DQ7**. |
| **D7** | Runtime restart reconciles repo `resume_brief`/state/active work + last operational run record, rejects falsely claimed completion, discards orphan sessions (compose US-0136 abort+dispose), reconstructs next schedulable phase, and resumes by spawning a **fresh correct-role session** (AC-7 / §27.3). No inherited old-role conversation. |
| **D8** | Tests `test_us0140_*` (AC-8 / §35 Kernel/gates / §36): E2E standard lifecycle intake through closure/refresh; validator FAIL blocks next phase; QA/UAT FAIL; premature closure blocked; bounded execute/QA; crash resume; SQLite non-authority for DONE; orchestrator spawn-only. Fake-model CI. Windows + Linux. |
| **D9** | Compose US-0136 SessionSupervisor/RoleCatalog, US-0137 PolicyEngine/ToolBroker, US-0138 RuntimeConfig, US-0139 context packs, US-0134 KernelBridge validators. Do **not** rewrite PolicyEngine tables, config loaders, auth-models, KernelBridge internals, isolation/`noTools`, or context-engine ranking. Out of scope: US-0141 OS sandbox, US-0142 browser, US-0143 drain, US-0144 critic content, US-0145 parallel/deploy, US-0146 CLI/TUI, BUG-0021, BUG-0022. US-0133..US-0139 / BUG-0020 not reopened. US-0141+ not mutated. |
| **D10** | Research questions DQ1–DQ10 → `/research` authors **R-0135** (next after highest existing **R-0134** BUG-0021 research; parent hint R-0134 is **ineligible** — do **not** reuse R-0130/R-0131/R-0132/R-0133/**R-0134**; compose R-0132/DEC-0139 + R-0130/DEC-0138 + R-0129/DEC-0137 + R-0128/DEC-0136 + R-0122/DEC-0134; do not wipe R-0120..R-0134). PO does **not** author `## R-0135`. Companion **DEC-0140** + `# US-0140` at `/architecture` only — PO does not author them. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0135**; stub only here)

1. **DQ1**: Package split — `runtime-core` with nested `workflow/`/`runs/`/`recovery/` vs sibling `standalone/packages/workflow`; GateEngine nested vs `packages/release-runtime` (US-0145 owns deploy targets); no Pi imports; who calls SessionSupervisor/PolicyEngine/config/context-engine without those packages importing workflow internals.
2. **DQ2**: CommandRouter vs kit `.cursor/commands/*.md` — consume Python validators via KernelBridge (US-0134) vs duplicating; `/auto`/`/quick` fail-closed stub vs omit until US-0143; fate of kit `/auto` host plugins (scheduling-only held).
3. **DQ3**: Phase-graph encoding — typed TS graph vs machine-readable manifest extracted from kit; precondition table; next-state intent schema; plan-verify skip under `ultra_lean`.
4. **DQ4**: Bounded execute/QA cap source (consume US-0138 loop keys vs new workflow caps); critic/security-review spawn as supplementary sessions (compose US-0136; content US-0144).
5. **DQ5**: Release GateEngine vs WorkflowEngine methods; consume US-0039 semantics without rewriting Python release scripts; fail-closed reason-code inventory.
6. **DQ6**: Closure exclusive DONE flip (US-0045); release-evidence schema required before closure; isolation/proof fields written by closure vs release.
7. **DQ7**: SQLite library (better-sqlite3 vs bun:sqlite vs sql.js), gitignored path, schema for run/session/audit/process/index; crash reconcile vs US-0136 in-memory registry; what remains artifact-only.
8. **DQ8**: Restart algorithm — `resume_brief` + repo artifacts + SQLite; reject false completion; orphan discard; fresh role session; relation to DEC-0069 pointer.
9. **DQ9**: Spawn injection — consume US-0139 context packs, US-0137 allowlist/`policy_hash`, US-0138 phase flags, US-0136 RoleCatalog; empty loader + `noTools` held; KernelBridge unamended.
10. **DQ10**: `test_us0140_*` Win+Linux inventory — AC-1 command coverage; graph preconditions; bounded rework; release order; release≠closure; SQLite non-authority; crash resume; AC-8 E2E happy + validator/QA/UAT/premature-closure fails.

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 14, 16, 25.4, 27, 30 (`runtime-core`), 32 Phase 3, 35 Kernel/gates, 37 DoD 3/4/9/10
- Compose: `decisions/DEC-0139.md` (context consume-only), `decisions/DEC-0138.md` (config consume-only), `decisions/DEC-0137.md` (policy consume-only), `decisions/DEC-0136.md` (sessions + crash orphan), `decisions/DEC-0134.md` (KernelBridge), `decisions/DEC-0051.md` / BUG-0006 spawn-only
- Compose: `docs/engineering/research.md` R-0132 / R-0130 / R-0129 / R-0128 / R-0122 (do not wipe R-0120..R-0134; **R-0134** is BUG-0021)
- Compose: `standalone/packages/role-runtime`, `policy-engine`, `tool-broker`, `config`, `context-engine`, `kernel-bridge`
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`workflow-standard` → US-0140)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0135** (deterministic continuation; `ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0134** BUG-0021).
- Parent orchestrator hint **R-0134** is **ineligible** (heading already taken). Do **not** author `## R-0134`. Do **not** author `## R-0135` this phase — tech-lead owns allocation at `/research`.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0140-discovery-po-20260913T201500Z-US-0140`
- `proof_hash=297A65DF1274B4DC7BD10782CDF794F5E8A0882DFCF0CB8BAD472348F1E9F3EB`
- `proof_ttl=2026-09-13T21:15:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0140","phase_id":"discovery","proof_issued_at":"2026-09-13T20:15:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0140-discovery-po-20260913T201500Z-US-0140"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0140`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 297A65DF1274B4DC7BD10782CDF794F5E8A0882DFCF0CB8BAD472348F1E9F3EB; **64 hex** verified)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0140`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0140-discovery-20260913T201500Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0140 discovery_notes; docs/product/acceptance.md US-0140 row (unchecked); docs/product/vision.md Discovery Notes — US-0140; handoffs/intake_evidence/US-0133-0148-intake-20260911.json; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → STATE_ARCHIVE_REQUIRED `state` 1359/1200 units=15/80 + `po_to_tl` 704/650 units=15/60 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=2,1` pack_state=`docs/engineering/state-archive/state-pack-20260913-cv.md` (archived `## Sovereign-critic checkpoint — execute BUG-0021` through `## QA checkpoint — US-0139`; archived_body_lines=186; preamble_lines=11; retained_body_lines=1173) pack_po=`handoffs/archive/po-to-tl-pack-20260913-o.md` (archived `## Discovery handoff — US-0137`; archived_body_lines=62; retained_body_lines=642) → `--post` exit 0; architecture not rolled; final `--check` PASS (`state` 1173/1200; `po_to_tl` 642/650; `architecture` 2992/3000).
- **Status**: US-0140 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: sovereign-critic (discovery) then `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

