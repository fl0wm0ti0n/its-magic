# PO to TL archive pack (2026-09-17)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 12
- First archived heading: `## Architecture handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`
- Last archived heading: `## Research handoff — US-0141 Application runtime and pluggable execution backends`
- Verification tuple (mandatory):
  - archived_body_lines=94
  - retained_body_lines=610

---

## Architecture handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED

- **Phase completed**: architecture. **Role**: tech-lead. **Bug**: BUG-0023 only. **Sprint**: (pending `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T00:05:00Z. **Fresh marker**: `tl-BUG0023-architecture-20260914T000500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0023`, `parent_orchestrator_run_id=cursor-20260913-BUG0023-intake`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan; sprint-plan continues later via orchestrator spawn), `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK` (requested_slug=`gpt-5.6-sol-high`; catalog typically quota-blocked this host; Task.model=`cursor-grok-4.6-high` not inherit), CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1 (consumed **R-0137**; confirmatory live-fetch 2026-09-14 v2 RPC; **no new R-id**).
- **Sibling boundary**: BUG-0021 DONE — listing limb remains true; do **not** reopen ACs / S0146. BUG-0020/0019/0018/0017/0015/0016 DONE — compose only; do not reopen. **BUG-0022 OPEN** — do not mutate; do not drain. Do not mutate US-0133..US-0148; do not drain US-0140+ / US-0141 (US-0141 `/research` continues at **R-0138**). Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Cursor `/auto` out of scope. Do **not** restore `.opencode/commands/auto.md`. Do **not** run `--pure`. Do **not** rewrite historical `# BUG-0021` / `# BUG-0019`.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# BUG-0023`**. **Companion DEC**: **none**.
- **Approach**: **Axis A LOCKED**. Shared `Rpc.define` (`@opencode/plugin/rpc`) + TUI `api.client.rpc(Defined)` / `OpenCode.make().rpc(Defined)` + server `await ctx.rpc.register(Defined, { runAutoLifecycle })`. Keep `{ id, tui }` listing. Keep `editor.add`. Reject Axis B / Axis D markdown/JSON template. Invented POST `/rpc/…` `{ input }` is not the happy path. TUI dynamic-imports `rpc.ts` inside dispatch (not top-level).
- **Research consumed**: `rp-auto-20260913-bug0023-research-techlead-20260913T235500Z-BUG-0023` / `A058F36ECE6A6FD173B1004D50597D3A075A0BD0312D720EB9CBE63F3B20AD7B` — RUNTIME_PROOF_VALID MATCH at proof_issued_at `2026-09-14T00:05:00Z` before TTL `2026-09-14T00:55:00Z`; critic PASS `rp-auto-20260913-bug0023-sovereign-critic-techlead-20260914T000000Z-BUG-0023` / `37ADCFFEA3E4DB3347279BDE421DF6F60C7B16E96191C5BB6C94E547D7539EB9`; anti_slop=10; 0 blocking; immutable R-0137; NBs `bug0023rsc-*` closed in H1.

### Locked design (Axis A)

- Shared `.opencode/plugins/its-magic-auto/rpc.ts` (active + template) `ITS_MAGIC_AUTO_RPC = Rpc.define({ id: "its-magic.auto", methods.runAutoLifecycle })` JSON Schema. Specifier **`@opencode/plugin/rpc`**. HTTP client **`@opencode/client` `OpenCode.make`**.
- Orchestrator **static** import + **`await ctx.rpc.register(Defined, { runAutoLifecycle })`** when register exists. Keep `editor.add`. Missing `ctx.rpc` remains attach-optional.
- TUI **dynamic** import inside `dispatchRunAutoLifecycle`: `api.client.rpc(Defined).runAutoLifecycle(payload)` then `OpenCode.make({ baseUrl })` fallback (`client.baseUrl ?? config.baseUrl ?? defaults.baseUrl`). No silent `localhost:4096`. Remove invented POST happy path.
- Keep `{ id, tui }` + `slashName: "auto"` / `ctrl+shift+a` (BUG-0021 listing compose).
- DISPATCH toast **only** when client/RPC truly absent. Do not restore `auto.md`.
- Eight `test_bug0023_*` contract markers (mock invoke, not listing-only / not token-exists-only). Keep 0021/0020/0019/0018 compose.
- Upgrade `--host opencode|both` **overwrites** dispatch path; still prunes leftover `auto.md`.

### Sprint seeds

- T-anch + T-001..T-007 (8 ≤ SPRINT_MAX_TASKS=12). Eight tests: `test_bug0023_rpc_define_shared_contract`, `test_bug0023_dispatch_mock_invokes_runAutoLifecycle`, `test_bug0023_http_fallback_is_client_rpc_not_invented_post`, `test_bug0023_orchestrator_await_register_defined_rpc`, `test_bug0023_keep_editor_add_no_auto_md`, `test_bug0023_dispatch_token_only_when_rpc_absent`, `test_bug0023_active_template_parity`, `test_bug0023_upgrade_copies_dispatch_still_prunes_auto_md`.
- Do not restore `auto.md`. Do not reopen BUG-0021 ACs. Do not mutate BUG-0022 / US-0140+. Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0023-architecture-techlead-20260914T000500Z-BUG-0023`
- `proof_hash=A565DE258312BA535F8CF4E9B00E8A17913E8F44960AC83097EC3C093997EF95`
- `proof_ttl=2026-09-14T01:05:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0023","phase_id":"architecture","proof_issued_at":"2026-09-14T00:05:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0023-architecture-techlead-20260914T000500Z-BUG-0023"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=none`, `story_id=BUG-0023`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → A565DE258312BA535F8CF4E9B00E8A17913E8F44960AC83097EC3C093997EF95)
- Consumed research proof: `rp-auto-20260913-bug0023-research-techlead-20260913T235500Z-BUG-0023` / `A058F36ECE6A6FD173B1004D50597D3A075A0BD0312D720EB9CBE63F3B20AD7B` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T00:55:00Z`; consumed_at `2026-09-14T00:05:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-bug0023-sovereign-critic-techlead-20260914T000000Z-BUG-0023` / `37ADCFFEA3E4DB3347279BDE421DF6F60C7B16E96191C5BB6C94E547D7539EB9` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T01:00:00Z`)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0023`, `fresh_context_marker=tl-BUG0023-architecture-20260914T000500Z-fresh`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`
- `evidence_ref=docs/engineering/architecture.md # BUG-0023; docs/engineering/research.md ## R-0137; docs/product/backlog.md ### BUG-0023; this handoff; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. `baseline_h2_count=0`; heading policy PASS (after=0). Post-append `--check` → STATE_ARCHIVE_REQUIRED `po_to_tl` 684/650 + `architecture` 3126/3000 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` pack_po=`handoffs/archive/po-to-tl-pack-20260913-t.md` (archived `## Research handoff — US-0139`; moved=1; retained_lines=634; retained_sections=14) pack_arch=`docs/engineering/architecture-archive/architecture-pack-20260913-g.md` (archived `# US-0138`; moved=1; retained_lines=2981; retained_story_sections=19; `# BUG-0021`/`# BUG-0019`/`# BUG-0023` retained) → `--post` exit 0; state not rolled; final `--check` PASS; heading-policy baseline_h2_count=0 PASS; `[CODEBASE_MAP_OK] preserved_existing`.
- **Status**: BUG-0023 remains **OPEN**. Acceptance unchecked. **Next**: `/sprint-plan` in fresh **tech-lead** subagent. Do not spawn sprint-plan from this architecture chat. STOP.

## Research handoff — US-0141 Application runtime and pluggable execution backends

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0141 only. **Sprint**: (pending — expected S0148 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T00:10:00Z. **Fresh marker**: `tl-US0141-research-20260914T001000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0141`, parent=`auto-20260913-us0140`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — catalog sa/strong=`gpt-5.6-sol-high` usage-limited), AUTO_QUIET=1, EARLY_RESEARCH=1, FRAMEWORK_KIT_REPO=1, drain story 7 of 10.
- **Sibling boundary**: **US-0142..US-0148** OPEN — OUT OF SCOPE this segment (do not mutate). **US-0133..US-0140** DONE — compose only; do not reopen. **BUG-0021** DONE / **BUG-0022** OPEN / **BUG-0023** OPEN — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Research anchor**: `docs/engineering/research.md` **`## R-0138`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Discovery stub **R-0137** for US-0141 is **stale** — live-inventory: **R-0137 is BUG-0023**. Do not wipe R-0120..R-0137. Do not reuse R-0135 (US-0140), R-0136 (BUG-0023 intake), or R-0137 (BUG-0023 research).
- **Approach**: **A1 (A\*)** recommended. Reject A2 (nested runtime-core), A3 (two §30 packages), A4 (dockerode as facade), A5 (kit Python only), A6 (PM2/forever), A7 (HEALTHCHECK as restart owner), A8 (browser US-0142), A9 (micro-VM), A10 (rewrite workflow/PolicyEngine/config/KernelBridge/`noTools`), A11 (require live Docker in CI), A12 (fold into tool-broker), A13 (unknown backend → local), A14 (second SQLite / better-sqlite3).
- **Companion DEC**: **DEC-0141** Required → Accepted in `/architecture`. Do **not** create `decisions/DEC-0141.md` this phase. Do **not** author `# US-0141`. Recommend architecture H1 **`# US-0141`** (not `## US-`).

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Package + inject | Sibling `@its-magic/app-runtime`; compose RunsStore; no Pi; consumers do not import app-runtime internals | LOCKED |
| DQ2 | process_handles | Additive schema; ProcessManager writes; logs as files+ring refs | LOCKED |
| DQ3 | Backends | local+docker CLI-first core; WSL+SSH typed adapters; fail-closed diagnostics; no silent local fallback | LOCKED |
| DQ4 | Stacks | Port `detect_stack_profile`; unknown fail-closed unless `DEV_SERVER_COMMAND` | LOCKED |
| DQ5 | Remediation | AppRuntime-owned loop; cap `APP_RUNTIME_RESTART_MAX` default 3; HEALTHCHECK status-only | LOCKED |
| DQ6 | Evidence | §21.2 JSON + file refs + 8 KiB summarize; ring 256 lines | LOCKED |
| DQ7 | Connect/cleanup | US-0098 field names to US-0142; no browser; orphan reap | LOCKED |
| DQ8 | Tests | 12 `test_us0141_*` Win+Linux fake-model covering AC-1..AC-8 | LOCKED |
| DQ9 | Compose | Layer A held; Layer B profiles not micro-VM; no workflow rewrite | LOCKED |
| DQ10 | Kit + R-id | `files` omit standalone/; R-0138 this story; R-0137 BUG-0023 | LOCKED |

### Architecture seeds

- Author `# US-0141` + **DEC-0141** (Accepted).
- Seeds T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12).
- Do not expand US-0142+ ACs. Do not implement `standalone/packages/app-runtime` this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0141-research-techlead-20260914T001000Z-US-0141`
- `proof_hash=A69F1FF95B60E566C03355AD24DDB7144B005BD78CD3701C1C8D2EBF2DAFAC45`
- `proof_ttl=2026-09-14T01:10:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0141","phase_id":"research","proof_issued_at":"2026-09-14T00:10:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0141-research-techlead-20260914T001000Z-US-0141"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0141`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → a69f1ff95b60e566c03355ad24ddb7144b005bd78cd3701c1c8d2ebf2dafac45; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery proof: `rp-auto-20260913-us0141-discovery-po-20260913T235000Z-US-0141` / `D7ED017CC467CA58699EC839313FC31A06C1B126E3A13389BA158A093ED9A9B7` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T00:50:00Z`; consumed_at `2026-09-14T00:10:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0141-sovereign-critic-techlead-20260914T000000Z-US-0141` / `28F5D714A2BE94B4F910A07FB49191B0BF7832E480BCCB1C01927D020E84306F` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T01:00:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0141`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0141-research-20260914T001000Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0138; docs/product/backlog.md ## US-0141 research_notes; docs/engineering/state.md research checkpoint; docs/engineering/decisions.md ## DEC-0141 Required stub; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` STATE_ARCHIVE_REQUIRED → `--rollover --json` `{"boundary":"triad-rollover|state","moved":2,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-dp.md","retained_checkpoints":15,"retained_lines":1198}` + `{"boundary":"triad-rollover|po_to_tl","moved":2,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-u.md","retained_lines":633,"retained_sections":13}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. final `--check` PASS. Research handoff retained at true end of `po_to_tl.md`.
- **Status**: US-0141 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of research, then `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture or critic from this research chat. STOP.

