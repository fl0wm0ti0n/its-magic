## Research handoff — BUG-0023 OpenCode CLI TUI listed `/auto` toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED

- **Phase completed**: research. **Role**: tech-lead. **Bug**: BUG-0023 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T23:55:00Z. **Fresh marker**: `tl-BUG0023-research-20260913T235500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0023`, `parent_orchestrator_run_id=cursor-20260913-BUG0023-intake`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK` (requested_slug=`gpt-5.6-sol-high`; catalog typically quota-blocked this host; Task.model=`cursor-grok-4.6-high` not inherit), CROSS_MODEL_REVIEW=1, AUTO_QUIET=1, EARLY_RESEARCH=1.
- **Sibling boundary**: BUG-0021 DONE — listing limb remains true; do **not** reopen ACs / S0146. BUG-0020/0019/0018/0017/0015/0016 DONE — compose only; do not reopen. **BUG-0022 OPEN** — do not mutate; do not drain. Do not mutate US-0133..US-0148; do not drain US-0140+ / US-0141 (US-0141 `/research` continues at **R-0138**). Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Cursor `/auto` out of scope. Do **not** restore `.opencode/commands/auto.md`. Do **not** run `--pure`. Do **not** rewrite historical `# BUG-0021`.
- **Research anchor**: `docs/engineering/research.md` **`## R-0137`** (DQ1–DQ8 LOCKED). Discovery D1–D10 not rewritten. Compose **R-0136** / **R-0134** / **R-0124** (do not wipe R-0120..R-0136). Do not reuse R-0133 (BUG-0022) or R-0135 (US-0140).
- **Approach**: **Axis A** recommended. Reject Axis B (other TUI→server invoke), Axis D (markdown/JSON template). Axis C (keep `editor.add`) held as constraint delivered by A.
- **Companion DEC**: **no**. Additive `# BUG-0023` at `/architecture` only — do **not** author it this phase.

### Closed questions DQ1–DQ8

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | `api.client` vs `.rpc` | `{ id, tui }` `api.client` is generated OpencodeClient; host-true custom methods are `client.rpc(Rpc.define)`; OpenCode.make fallback if `.rpc` missing | LOCKED |
| DQ2 | `Rpc.define` vs plain JSON | **Yes** — `Rpc.define({ id: "its-magic.auto", methods })`; call `runAutoLifecycle(payload)` not `{ input }` | LOCKED |
| DQ3 | `ctx.rpc.register` | Optional today + swallow + plain JSON → unregistered (H3). **Fix**: `await ctx.rpc.register(Defined, impl)` when present | LOCKED |
| DQ4 | HTTP fallback | Host-true HTTP = `OpenCode.make().rpc(Defined)`; invented POST `/rpc/…` `{ input }` is not the happy path | LOCKED |
| DQ5 | Axis B | **Rejected as winner** — no other documented TUI→server custom invoke; Plugin.define TUI re-breaks listing | LOCKED |
| DQ6 | Axis C | Keep `editor.add` execute owner; TUI `run()` dispatches via RPC | LOCKED |
| DQ7 | Tests + DEC | 8 `test_bug0023_*` with mock invoke; **no companion DEC**; `# BUG-0023` supersedes 0021 dispatch claim | LOCKED |
| DQ8 | Upgrade; Axis D | Overwrite dispatch-path onto Axis-A trees; still prune `auto.md`; **reject** markdown template | LOCKED |

### Architecture seeds

- Author `# BUG-0023` (additive; do **not** rewrite `# BUG-0021`). **No new DEC.**
- Seeds T-anch + T-001..T-007 (8 ≤ SPRINT_MAX_TASKS=12).
- Do not restore `auto.md`. Do not reopen BUG-0021 ACs. Do not mutate BUG-0022 / US-0141. Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0023-research-techlead-20260913T235500Z-BUG-0023`
- `proof_hash=A058F36ECE6A6FD173B1004D50597D3A075A0BD0312D720EB9CBE63F3B20AD7B`
- `proof_ttl=2026-09-14T00:55:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0023","phase_id":"research","proof_issued_at":"2026-09-13T23:55:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-bug0023-research-techlead-20260913T235500Z-BUG-0023"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`, `requested_slug=gpt-5.6-sol-high`, `sprint_id=none`, `story_id=BUG-0023`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → A058F36ECE6A6FD173B1004D50597D3A075A0BD0312D720EB9CBE63F3B20AD7B)
- Consumed discovery proof: `rp-auto-20260913-bug0023-discovery-po-20260913T234500Z-BUG-0023` / `FF27FC4ABB23499336FC068B07F68960B3496FCBE24A79DF6D85FD0F649975AC` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T00:45:00Z`; consumed_at `2026-09-13T23:55:00Z`; independent recompute MATCH)
- Consumed critic: discovery CRITIC_PASS (`composer-2.5`; anti_slop_aggregate=10; blocking_count=0; `bug0023dsc-*`; no critic `runtime_proof_id` in hot state)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `bug_id=BUG-0023`, `fresh_context_marker=tl-BUG0023-research-20260913T235500Z-fresh`, `model_id=cursor-grok-4.6-high`, `model_resolve_fallback=MODEL_RESOLVE_FALLBACK`
- `evidence_ref=docs/engineering/research.md ## R-0137; docs/product/backlog.md ### BUG-0023 research_notes; this handoff; docs/engineering/state.md research checkpoint; handoffs/resume_brief.md; .opencode/plugins/its-magic-auto/tui.ts dispatchRunAutoLifecycle; .opencode/plugins/orchestrator.ts editor.add + ctx.rpc.register; absent .opencode/commands/auto.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `python scripts/enforce-triad-hot-surface.py --check` PASS (`state` 1199/1200; `po_to_tl` 640/650; `architecture` 2858/3000). No rollover required. Research handoff retained at true end of `po_to_tl.md`.
- **Status**: BUG-0023 remains **OPEN**. Acceptance unchecked. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

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

## Architecture handoff — US-0141 Application runtime and pluggable execution backends

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0141 only. **Sprint**: (pending `/sprint-plan` — expected S0149; S0148=BUG-0023 ineligible). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T00:30:00Z (proof_issued_at). **Fresh marker**: `tl-US0141-architecture-20260914T003000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0141`, parent=`auto-20260913-us0140`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = second of research+architecture+sprint-plan; sprint-plan continues later via orchestrator spawn), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, EARLY_RESEARCH=1 (consumed **R-0138**; **no new R-id**), FRAMEWORK_KIT_REPO=1, drain story 7 of 10.
- **Sibling boundary**: **US-0142..US-0148** OPEN — OUT OF SCOPE (US-0142 browser; US-0143 drain). **US-0133..US-0140** DONE — compose only; do not reopen. **BUG-0021** DONE / **BUG-0022** OPEN / **BUG-0023** OPEN — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`. Do not create `standalone/packages/app-runtime` or `sprints/S0148/` or `sprints/S0149/` this phase. Do not spawn `/sprint-plan` from this architecture chat.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0141`**. **Companion DEC**: **DEC-0141** Accepted (`decisions/DEC-0141.md`).
- **Approach**: **A1 (A\*) LOCKED**. Reject A2–A14.
- **Research consumed**: `rp-auto-20260913-us0141-research-techlead-20260914T001000Z-US-0141` / `A69F1FF95B60E566C03355AD24DDB7144B005BD78CD3701C1C8D2EBF2DAFAC45` — RUNTIME_PROOF_VALID MATCH at proof_issued_at `2026-09-14T00:30:00Z` before TTL `2026-09-14T01:10:00Z`; critic PASS `rp-auto-20260913-us0141-sovereign-critic-techlead-20260914T002000Z-US-0141` / `727DABC442D42CD32D3B216AF014C3797BE09F552688BECA429C2A215E6EF53E`; anti_slop=10; 0 blocking; immutable R-0138.

### Locked design (A1)

- Sibling `standalone/packages/app-runtime` (`@its-magic/app-runtime`, no Pi). Compose US-0140 `RunsStore.process_handles` additive; ProcessManager writes; do not reimplement workflow/GateEngine/CommandRouter.
- ExecutionBackend: local + Docker CLI-first core v1; WSL + SSH/remote Docker typed adapters; fail-closed `BACKEND_*` / `APP_RUNTIME_*` / `PROCESS_*` (names locked in DEC-0141).
- AppRuntime owns restart; HEALTHCHECK is status-only. Cap `APP_RUNTIME_RESTART_MAX` default 3.
- Stack-aware Node/Python/Go/Java/.NET; unknown stacks fail/fallback deterministic (`DEV_SERVER_COMMAND` override).
- Structured test/build evidence; 8 KiB log summarize; ring 256 lines.
- Connect/health to US-0142; no browser implementation.
- 12 `test_us0141_*`. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces.
- OUT: micro-VM, US-0142 browser, US-0143 drain, restore `.opencode/commands/auto.md`, kit cli.json, plugin-local tui.json.

### Sprint seeds

- T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12). Expected **S0149**. Do not restore `auto.md`. Do not mutate BUG-0021/0022/0023. Do not reopen US-0133..US-0140. Do not mutate US-0142+. Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0141-architecture-techlead-20260914T003000Z-US-0141`
- `proof_hash=4B5EBD9D8FF00C4C7CC5CF114B946AFBA684E11998C4C553C59AE5080326A3BF`
- `proof_ttl=2026-09-14T01:30:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0141","phase_id":"architecture","proof_issued_at":"2026-09-14T00:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0141-architecture-techlead-20260914T003000Z-US-0141"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0141`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 4B5EBD9D8FF00C4C7CC5CF114B946AFBA684E11998C4C553C59AE5080326A3BF; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0141-research-techlead-20260914T001000Z-US-0141` / `A69F1FF95B60E566C03355AD24DDB7144B005BD78CD3701C1C8D2EBF2DAFAC45` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T01:10:00Z`; consumed_at `2026-09-14T00:30:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0141-sovereign-critic-techlead-20260914T002000Z-US-0141` / `727DABC442D42CD32D3B216AF014C3797BE09F552688BECA429C2A215E6EF53E` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T01:20:00Z`)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0141`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0141-architecture-20260914T003000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0141; decisions/DEC-0141.md; docs/engineering/research.md ## R-0138; docs/product/backlog.md ## US-0141; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Status**: US-0141 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of architecture, then `/sprint-plan` expected **S0149** in fresh **tech-lead** subagent. Do not spawn sprint-plan or critic from this architecture chat. STOP.

## Discovery handoff — US-0142 Owned browser UAT and evidence runtime

- **Phase completed**: discovery. **Role**: po. **Story**: US-0142 only. **Sprint**: (pending — expected S0150 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T03:10:00Z. **Fresh marker**: `po-US0142-discovery-20260914T031000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0142`, parent=`auto-20260913-us0141`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, FRAMEWORK_KIT_REPO=1, drain story 8 of 10.
- **Sibling boundary**: **US-0141 DONE** — compose Connect/health only; do not reopen. **US-0133..US-0140 DONE** — compose only; do not reopen. **US-0143..US-0148 OPEN** — OUT OF SCOPE (do not mutate). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Gap confirmed (narrow-read)**: PolicyEngine `itsm_browser` is **STUB**. No `standalone/packages/browser-uat`. US-0141 shipped `AppRuntime.connectHandoff` (`connect_endpoint`, `health_path`, `service_id`, `container_id`, `env_refs` names-only) with **no** Playwright/CDP. Kit `uat_probe_lib.py` classifies `browser_smoke` but Cursor MCP is host-only (`UAT_BROWSER_PROBE_MODE` default `cursor`); FRAMEWORK_KIT_REPO slices waive live browser with `UAT_PROBE_FORBIDDEN`. Masterplan §20 requires owned Playwright isolated + authorized CDP. Pixel visual baseline deferred.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Compose US-0141 AppRuntime Connect/health/ports. Consume `connectHandoff`. Do **not** reimplement AppRuntime, ProcessManager, or ExecutionBackend. |
| **D2** | Owned browser runtime in standalone. Package home is likely `standalone/packages/browser-uat` **or similar** — **architecture decides (DQ1)**. **No Pi** imports outside `packages/pi-kernel`. |
| **D3** | Playwright isolated/headless contexts **and** operator-authorized Chrome/Chromium CDP for logged-in sessions. Cursor browser MCP is host-only compatibility (US-0093 KEEP contract, REPLACE backend). This story owns kit/standalone runtime — Cursor MCP is **not** v1 authority. |
| **D4** | Typed `itsm_browser` tool: open, navigate, snapshot, click, type, select, wait, screenshot, console, network, download/upload, accessibility. Promote from PolicyEngine `STUB_TOOLS`. Prefer one structured tool with typed actions. |
| **D5** | Existing UAT planning/classification maps to process health, CLI smoke, browser smoke, API probes, or manual judgment; persist compatible `uat.json`. This story **owns lifting** `browser_smoke` for applicable US-0142 probes. Do **not** weaken `UAT_PROBE_FORBIDDEN` for other stories (`.env` / intake-evidence / secret-token deny + kit-slice waives remain). |
| **D6** | Each applicable probe records screenshot, snapshot summary, console errors, failed requests, final URL, trace, duration, backend, and app-runtime reference. Redact headers, cookies, tokens, and sensitive form data from evidence/logs (traces/HAR leak secrets unless scrubbed). |
| **D7** | Crashes, failed waits/assertions, console/network failures, missing authorization, and evidence gaps → fail-closed under bounded retry. Browser agents cannot read credentials from project files; authenticated flows use authorized profile, opaque injected test account, or explicit operator approval. Never read `.env`. |
| **D8** | E2E fixtures: app launch through browser action/evidence/UAT gate happy+failure; exploratory→regression without visual-diff v1 blocker. Tests `test_us0142_*` (expect 12 at execute). Kit `files` omit `standalone/`; do not add standalone to kit workspaces. |
| **D9** | OUT: pixel visual baseline; US-0143 `/auto` drain; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; OS micro-VM; npm-publish; git push. |
| **D10** | Do not mutate US-0141 DONE, US-0143+, BUG-0021/0022/0023. Do not drain bugs. Do not reopen US-0133..US-0140. Research stub **R-0139** (PO does not author `## R-0139`; do not wipe R-0138 / R-0136 / R-0137). Companion **DEC-0142** + `# US-0142` at `/architecture` only. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0139**; stub only here)

1. **DQ1**: Package split — sibling `standalone/packages/browser-uat` vs nested under `app-runtime` vs `tool-broker`. Who owns BrowserUAT vs Playwright driver vs CDP attach. No Pi. How QA/tool-broker consumes `connectHandoff` without importing app-runtime internals.
2. **DQ2**: Two-mode matrix — `chromium.launch` + `newContext` (isolated/headless) vs `connectOverCDP` vs `launchPersistentContext`. Chrome policy: default User Data dir is **not** automatable. Operator CDP authorization UX (debug port, dedicated profile). Disconnect vs close so the developer browser stays alive.
3. **DQ3**: Typed tool schema — single `itsm_browser` + action enum vs many tools. Promote `itsm_browser` from `STUB_TOOLS`. Role capability (QA vs others). Compose PolicyEngine path/shell/secret deny.
4. **DQ4**: UAT planner — reuse `uat_probe_lib.classify_step`; standalone executor plug-in; `UAT_BROWSER_PROBE_MODE` new owned value vs replacing `cursor` default; `FRAMEWORK_KIT_REPO=1` slices still waive `browser_smoke` with `UAT_PROBE_FORBIDDEN` (do not weaken for other stories).
5. **DQ5**: Evidence schema compatible with `uat.json` `probe_results[]` + US-0093 `browser_evidence_refs`. Trace zip / HAR redaction (Playwright traces serialize cookies/Authorization). Compose US-0135 `redact.ts`. App-runtime handle/ref field names.
6. **DQ6**: Credential paths — authorized CDP profile vs opaque externally injected test account vs explicit operator approval. Injection that the model cannot read. Never read `.env`.
7. **DQ7**: Fail-closed taxonomy + retry cap (new vs compose US-0141 `APP_RUNTIME_RESTART_MAX` / existing `UAT_BROWSER_PROBE_*`). Missing CDP authorization reason code. No silent PASS / no fake browser PASS (US-0128).
8. **DQ8**: `test_us0142_*` Win+Linux inventory covering AC-1..AC-8 (expect 12). Playwright install strategy; CI fake-model without live Chrome vs fixture app; happy+failure UAT gate; exploratory→regression without visual-diff.
9. **DQ9**: Compose vs replace: US-0093 Cursor MCP (KEEP contract, REPLACE backend); US-0065 probe catalog; US-0128 smoke surrogate; US-0141 Connect-only. Do not rewrite GateEngine/workflow.
10. **DQ10**: Kit boundary — `package.json` `files` omit `standalone/`; no kit `cli.json`; no plugin-local `tui.json`; no `auto.md` restore. FRAMEWORK_KIT_REPO=1. **R-id live-inventory**: allocate **R-0139**; do not wipe R-0138 (US-0141) or R-0136/R-0137 (BUG-0023).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 20 (two modes, typed API, UAT planner, evidence, credentials, exploratory→regression, visual QA later), 26.4 (secret handling / redact Authorization/Cookie), 32 Phase 4, 35, 36
- Playwright: [isolation / browser contexts](https://playwright.dev/docs/browser-contexts); [`connectOverCDP`](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp); [`launchPersistentContext`](https://playwright.dev/docs/api/class-browsertype) (Chrome default profile blocked); [tracing](https://playwright.dev/docs/api/class-tracing) + HAR `content: omit`
- Industry: [Playwright attach to live Chrome via CDP](https://remote-browser.dev/blog/playwright-use-existing-browser); [trace/HAR secret leakage](https://currents.dev/posts/playwright-avoid-data-leak)
- Compose: US-0141 / DEC-0141 / R-0138 (`connectHandoff`); US-0093 / R-0079 (KEEP contract REPLACE backend); US-0065; US-0128; US-0135 redact; US-0137 PolicyEngine `itsm_browser` stub; US-0085 `.env` deny
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`browser-uat` → US-0142)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0139** (`ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0138** US-0141).
- Do **not** author `## R-0139` this phase. Do **not** wipe R-0138 (US-0141) or R-0136/R-0137 (BUG-0023). Do **not** reuse R-0133 / R-0135.
- Companion **DEC-0142** + `# US-0142` at `/architecture` only — PO does not author them.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0142-discovery-po-20260914T031000Z-US-0142`
- `proof_hash=5FF73D3703330EABE49AA2A07FE6DBD56DAFE5972B489A85309D5CD1A83A1DCB`
- `proof_ttl=2026-09-14T04:10:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0142","phase_id":"discovery","proof_issued_at":"2026-09-14T03:10:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0142-discovery-po-20260914T031000Z-US-0142"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0142`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 5ff73d3703330eabe49aa2a07fe6dbd56dafe5972b489a85309d5cd1a83a1dcb; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0142`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0142-discovery-20260914T031000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0142 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0142; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-en.md","retained_checkpoints":12,"retained_lines":1119}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-w.md","retained_lines":632,"retained_sections":13}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. Discovery handoff retained at true end of `po_to_tl.md`.
- **Status**: US-0142 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of discovery, then `/research` in fresh **tech-lead** subagent. Do not spawn research or critic from this discovery chat. STOP.

## Research handoff — US-0142 Owned browser UAT and evidence runtime

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0142 only. **Sprint**: (pending — expected S0150 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T03:30:00Z. **Fresh marker**: `tl-US0142-research-20260914T033000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0142`, parent=`auto-20260913-us0141`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, EARLY_RESEARCH=1, FRAMEWORK_KIT_REPO=1, drain story 8 of 10.
- **Sibling boundary**: **US-0141 DONE** — compose Connect/health only; do not reopen. **US-0133..US-0140 DONE** — compose only; do not reopen. **US-0143..US-0148 OPEN** — OUT OF SCOPE (do not mutate). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Research anchor**: `docs/engineering/research.md` **`## R-0139`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Do not wipe R-0138 (US-0141) or R-0136/R-0137 (BUG-0023).
- **Approach**: **A1 (A\*)** recommended. Reject A2 (nested app-runtime), A3 (tool-broker fold), A4 (Cursor MCP v1 authority), A5 (Puppeteer), A6 (Selenium), A7 (persistent default Chrome profile), A8 (pixel visual baseline), A9 (US-0143 drain), A10 (rewrite GateEngine), A11 (require live Chrome in CI), A12 (replace kit `cursor` default), A13 (fake browser PASS), A14 (kit Python as standalone runtime), A15 (`browser.close()` after CDP).
- **Companion DEC**: **DEC-0142** Required → Accepted in `/architecture`. Do **not** create `decisions/DEC-0142.md` this phase. Do **not** author `# US-0142`. Recommend architecture H1 **`# US-0142`** (not `## US-`).

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Package + inject | Sibling `@its-magic/browser-uat`; consume `connectHandoff`; no Pi; ToolBroker does not import Playwright internals | LOCKED |
| DQ2 | Two-mode matrix | Isolated `launch`+`newContext`; CDP `connectOverCDP`+`disconnect` + dedicated `--user-data-dir`; default profile forbidden | LOCKED |
| DQ3 | Typed tool | Single `itsm_browser` action enum; promote from `STUB_TOOLS`; QA primary | LOCKED |
| DQ4 | UAT planner | Reuse `classify_step`; additive `owned` mode; kit `cursor` default + `UAT_PROBE_FORBIDDEN` held | LOCKED |
| DQ5 | Evidence | Compatible `uat.json` + `browser_evidence_refs` + redact HAR/headers; gitignored traces | LOCKED |
| DQ6 | Credentials | CDP dedicated profile / opaque injection / operator approval; never read `.env` | LOCKED |
| DQ7 | Fail-closed + retry | `BROWSER_*` + existing `UAT_*`; `BROWSER_RETRY_MAX` default 2; no fake PASS | LOCKED |
| DQ8 | Tests | 12 `test_us0142_*` Win+Linux fake-driver covering AC-1..AC-8 | LOCKED |
| DQ9 | Compose | US-0093 KEEP contract REPLACE backend; US-0141 Connect-only; no GateEngine rewrite | LOCKED |
| DQ10 | Kit + R-id | `files` omit standalone/; R-0139 this story; R-0138/R-0136/R-0137 held | LOCKED |

### Architecture seeds

- Author `# US-0142` + **DEC-0142** (Accepted).
- Seeds T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12). Expected **S0150**.
- Do not expand US-0143+ ACs. Do not implement `standalone/packages/browser-uat` this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142`
- `proof_hash=3C8C3226AB88276C2595CCE79742589FF464C3ED8444D6425CC99183D390655A`
- `proof_ttl=2026-09-14T04:30:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0142","phase_id":"research","proof_issued_at":"2026-09-14T03:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0142`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 3c8c3226ab88276c2595cce79742589ff464c3ed8444d6425cc99183d390655a; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery proof: `rp-auto-20260913-us0142-discovery-po-20260914T031000Z-US-0142` / `5FF73D3703330EABE49AA2A07FE6DBD56DAFE5972B489A85309D5CD1A83A1DCB` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T04:10:00Z`; consumed_at `2026-09-14T03:30:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T032000Z-US-0142` / `38E19C9FCCEE8C5C0A52EEDE4EC8520C1E08A73E8B0A51720E9609D0F574A441` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T04:20:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0142`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0142-research-20260914T033000Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0139; docs/product/backlog.md ## US-0142 research_notes; docs/engineering/state.md research checkpoint; docs/engineering/decisions.md ## DEC-0142 Required stub; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` STATE_ARCHIVE_REQUIRED → `--rollover --json` `{"boundary":"triad-rollover|state","moved":2,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-eo.md","retained_checkpoints":12,"retained_lines":1120}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-x.md","retained_lines":638,"retained_sections":13}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. final `--check` PASS. Research handoff retained at true end of `po_to_tl.md`.
- **Status**: US-0142 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of research, then `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture or critic from this research chat. STOP.

## Intake handoff — BUG-0024 OpenCode CLI TUI listed `/auto` still toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED after BUG-0023 Axis A

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0024. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-14T03:50:00Z. **Fresh marker**: `po-BUG0024-intake-20260914T035000Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260913-BUG0024-intake`, `intake_run_id=cursor-20260913-BUG0024-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `EARLY_RESEARCH=1`. `INTAKE_SUBAGENT_FALLBACK=deny`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0024** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]` (pre-write)
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — pending this handoff; run after persistence
  - DEC-0069 resume_brief: prepend `## Latest orchestration pointer — post-bug-intake` so upsert does not clobber historical US-0141/BUG-0023 pointers (first-match replace)
- **Research**: **R-0140** (`docs/engineering/research.md`) — intake-time live-fetch OpenCode v2 RPC (`Rpc.define` + public TUI call is CLI `Plugin.define({ setup })` `context.client.rpc`, not `{ id, tui }` `api.client`) + Context7 TUI `api.client` is OpencodeClient `.get`/`.post`. Axis A files present; live DISPATCH toast live-falsifies R-0137. Compose **R-0137** / **R-0136** / **R-0134** / **R-0124**. Do not wipe R-0120..R-0139.
- **Operator ask**: `/ask` “prüfe das repo is alles so wie nach dem letzten bug geplant vorhanden? was läuft nun wieder falsch?” Live: toast title `its-magic /auto`, body `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`. `/intake bug siehe chat verlauf`. They want listed `/auto` to **start lifecycle**, not fail-closed toast. Axis A files **are present**. Not Cursor-only as done. Not `--auto`. Not LLM Auto mode.
- **Root cause (intake hypothesis, not proven)**: TUI `run()` only passes `{ api, client: api?.client }`. If OpenCode TUI plugin has no `api.client` (or no `client.rpc` / no `baseUrl` / `@opencode/client` unusable), toast fires immediately. Orchestrator register skipped when `ctx.rpc` absent. All RPC errors swallowed → same toast. CI mock-invoke cannot prove live `client.rpc(Defined)`.
- **Duplicate check**: Persist **NEW BUG-0024**. Do **not** reopen BUG-0023 DONE (S0148 Axis A slice). Do **not** reopen BUG-0021 DONE (listing). Do **not** restore STOP-only `auto.md`. Do **not** merge **BUG-0022 OPEN**. Do **not** reopen BUG-0020/0019/0018. Do not mutate US-0133..US-0148. Do not drain BUG-0022. Do not drain US-0142 from this intake (continue with `/auto start-from=architecture`).
- **Decomposition**: **single_bug** — operator already invoked `/intake bug` (treat as **accept**).
- **Alternatives**: (1) persist BUG-0024; listed `/auto` must reach `runAutoLifecycle` on live CLI; tests must catch this live miss — **recommended**; (2) reopen BUG-0023 — **reject**; (3) reopen BUG-0021 — **reject**; (4) merge BUG-0022 — **reject**; (5) restore `auto.md` — **reject**; (6) files-present as success — **reject**; (7) Cursor-only as done — **reject**.
- **Scope for `/discovery`**: lock host-true live `tui(api)` client wiring → `runAutoLifecycle`. Keep `editor.add`. Do not restore `auto.md`. Do not reopen BUG-0023/0021 ACs. Do not merge BUG-0022. Honest `test_bug0024_*` vs mock-only gap.
- **Risks**: R1 — `{ id, tui }` `api.client` missing (high); R2 — local `Rpc.define` fallback is not host-true `Defined` (medium); R3 — `ctx.rpc.register` skipped so method unregistered (medium); R4 — swallowed RPC errors hide the real miss (high); R5 — mock-only tests close live dispatch again (high).
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0024`; `fresh_context_marker=po-BUG0024-intake-20260914T035000Z-fresh`; `timestamp=2026-09-14T03:50:00Z`; `model_id=cursor-grok-4.6-high`; `evidence_ref=docs/product/backlog.md ### BUG-0024, docs/product/acceptance.md BUG-0024 row, handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json, docs/engineering/research.md ## R-0140, this handoff`.
- **Status**: OPEN per US-0045. **BUG-0023 remains DONE**. **BUG-0022 remains OPEN**. **BUG-0021 remains DONE**. **US-0142 remains OPEN** (not drained). **Next**: `/discovery` (fresh **po**) for **BUG-0024**, or `/auto bug-target=BUG-0024`. Do not run discovery/architecture/execute from this intake chat. STOP.

## Architecture handoff — US-0142 Owned browser UAT and evidence runtime

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0142 only. **Sprint**: (pending `/sprint-plan` — expected S0150; S0149=US-0141; S0148=BUG-0023). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T03:50:00Z (proof_issued_at). **Fresh marker**: `tl-US0142-architecture-20260914T035000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0142`, parent=`auto-20260913-us0141`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = second of research+architecture+sprint-plan; sprint-plan continues later via orchestrator spawn), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, EARLY_RESEARCH=1 (consumed **R-0139**; **no new R-id**), FRAMEWORK_KIT_REPO=1, drain story 8 of 10.
- **Sibling boundary**: **US-0143..US-0148 OPEN** — OUT OF SCOPE (US-0143 drain). **US-0133..US-0141 DONE** — compose only; do not reopen. **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`. Do not create `standalone/packages/browser-uat` or `sprints/S0150/` this phase. Do not spawn `/sprint-plan` from this architecture chat.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0142`**. **Companion DEC**: **DEC-0142** Accepted (`decisions/DEC-0142.md`).
- **Approach**: **A1 (A\*) LOCKED**. Reject A2–A15.
- **Research consumed**: `rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142` / `3C8C3226AB88276C2595CCE79742589FF464C3ED8444D6425CC99183D390655A` — RUNTIME_PROOF_VALID MATCH at proof_issued_at `2026-09-14T03:50:00Z` before TTL `2026-09-14T04:30:00Z`; critic PASS `rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T034000Z-US-0142` / `18F5B1E72CDA4EFAB0F9A8F4588A151E4B84DD7391467BFD4A1D05EF81212621`; anti_slop=10; 0 blocking; immutable R-0139.

### Locked design (A1)

- Sibling `standalone/packages/browser-uat` (`@its-magic/browser-uat`, no Pi). Compose US-0141 `connectHandoff`; do not reimplement AppRuntime/ProcessManager.
- Isolated Playwright `launch`+`newContext` (headless) + typed CDP `connectOverCDP`+`disconnect` with dedicated `--user-data-dir`. Default Chrome User Data forbidden (`BROWSER_CDP_DEFAULT_PROFILE_FORBIDDEN`).
- Typed `itsm_browser` actions: open, navigate, snapshot, click, type, select, wait, screenshot, console, network, download, upload, accessibility. Promote from STUB. QA primary.
- Additive `UAT_BROWSER_PROBE_MODE=owned`; kit `cursor` default held; `UAT_PROBE_FORBIDDEN` unweakened. KEEP US-0093 contract; REPLACE Cursor-MCP backend as v1 authority.
- Evidence: compatible `uat.json` + `browser_evidence_refs` + additive snapshot/trace/duration/backend/`app_runtime_ref`. Redact secrets. Never read `.env`.
- Fail-closed `BROWSER_*` / `UAT_*` names locked in DEC-0142. `BROWSER_RETRY_MAX` default 2 (orthogonal to `APP_RUNTIME_RESTART_MAX`).
- 12 `test_us0142_*`. Kit `files` omit `standalone/`. Do not add standalone to kit workspaces.
- OUT: pixel visual baseline, US-0143 drain, restore `.opencode/commands/auto.md`, kit cli.json, plugin-local tui.json.

### Sprint seeds

- T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12). Expected **S0150**. Do not restore `auto.md`. Do not mutate BUG-0021/0022/0023. Do not reopen US-0133..US-0141. Do not mutate US-0143+. Do not implement application code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0142-architecture-techlead-20260914T035000Z-US-0142`
- `proof_hash=52A720174CB9E0D35507ED9683ED70D22D72A5D9E757A5CF1170B2AC304B3175`
- `proof_ttl=2026-09-14T04:50:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0142","phase_id":"architecture","proof_issued_at":"2026-09-14T03:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0142-architecture-techlead-20260914T035000Z-US-0142"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0142`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 52A720174CB9E0D35507ED9683ED70D22D72A5D9E757A5CF1170B2AC304B3175; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0142-research-techlead-20260914T033000Z-US-0142` / `3C8C3226AB88276C2595CCE79742589FF464C3ED8444D6425CC99183D390655A` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T04:30:00Z`; consumed_at `2026-09-14T03:50:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0142-sovereign-critic-techlead-20260914T034000Z-US-0142` / `18F5B1E72CDA4EFAB0F9A8F4588A151E4B84DD7391467BFD4A1D05EF81212621` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T04:40:00Z`)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0142`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0142-architecture-20260914T035000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0142; decisions/DEC-0142.md; docs/engineering/research.md ## R-0139; docs/product/backlog.md ## US-0142; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Status**: US-0142 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of architecture, then `/sprint-plan` expected **S0150** in fresh **tech-lead** subagent. Do not spawn sprint-plan or critic from this architecture chat. STOP.

## Intake handoff — BUG-0024 OpenCode CLI TUI listed `/auto` still toasts OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED after BUG-0023 Axis A

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0024. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-14T04:00:00Z. **Fresh marker**: `po-BUG0024-intake-20260914T040000Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260913-BUG0024-intake`, `intake_run_id=cursor-20260913-BUG0024-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `EARLY_RESEARCH=1`. `INTAKE_SUBAGENT_FALLBACK=deny`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0024** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]` (pre-write)
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance`
  - DEC-0069: prepend `## Latest orchestration pointer — post-bug-intake` at file top so upsert does not clobber historical US-0141/BUG-0023 pointers (first-match replace). Continue US-0142 with `/auto start-from=architecture`. Continue BUG-0022 with `/auto bug-target=BUG-0022`.
- **Research**: **R-0140** (`docs/engineering/research.md`) — intake-time live-fetch OpenCode v2 RPC (`Rpc.define` + public TUI call is CLI `Plugin.define({ setup })` `context.client.rpc`, not `{ id, tui }` `api.client`) + Context7 TUI `api.client` is OpencodeClient `.get`/`.post`. Axis A files present; live DISPATCH toast live-falsifies R-0137. Compose **R-0137** / **R-0136** / **R-0134** / **R-0124**. Do not wipe R-0120..R-0139.
- **Operator ask**: `/ask` “prüfe das repo is alles so wie nach dem letzten bug geplant vorhanden? was läuft nun wieder falsch?” Live: toast title `its-magic /auto`, body `OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED`. `/intake bug siehe chat verlauf`. They want listed `/auto` to **start lifecycle**, not fail-closed toast. Axis A files **are present**. Not Cursor-only as done. Not `--auto`. Not LLM Auto mode.
- **Root cause (intake hypothesis, not proven)**: TUI `run()` only passes `{ api, client: api?.client }`. If OpenCode TUI plugin has no `api.client` (or no `client.rpc` / no `baseUrl` / `@opencode/client` unusable), toast fires immediately. Orchestrator register skipped when `ctx.rpc` absent. All RPC errors swallowed → same toast. CI mock-invoke cannot prove live `client.rpc(Defined)`.
- **Duplicate check**: Persist **NEW BUG-0024**. Do **not** reopen BUG-0023 DONE (S0148 Axis A slice). Do **not** reopen BUG-0021 DONE (listing). Do **not** restore STOP-only `auto.md`. Do **not** merge **BUG-0022 OPEN**. Do **not** reopen BUG-0020/0019/0018. Do not mutate US-0133..US-0148. Do not drain BUG-0022. Do not drain US-0142 from this intake.
- **Decomposition**: **single_bug** — operator already invoked `/intake bug` (treat as **accept**).
- **Alternatives**: (1) persist BUG-0024; listed `/auto` must reach `runAutoLifecycle` on live CLI; tests must catch this live miss — **recommended**; (2) reopen BUG-0023 — **reject**; (3) reopen BUG-0021 — **reject**; (4) merge BUG-0022 — **reject**; (5) restore `auto.md` — **reject**; (6) files-present as success — **reject**; (7) Cursor-only as done — **reject**.
- **Scope for `/discovery`**: lock host-true live `tui(api)` client wiring → `runAutoLifecycle`. Keep `editor.add`. Do not restore `auto.md`. Do not reopen BUG-0023/0021 ACs. Do not merge BUG-0022. Honest `test_bug0024_*` vs mock-only gap.
- **Risks**: R1 — `{ id, tui }` `api.client` missing (high); R2 — local `Rpc.define` fallback is not host-true `Defined` (medium); R3 — `ctx.rpc.register` skipped so method unregistered (medium); R4 — swallowed RPC errors hide the real miss (high); R5 — mock-only tests close live dispatch again (high).
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0024`; `fresh_context_marker=po-BUG0024-intake-20260914T040000Z-fresh`; `timestamp=2026-09-14T04:00:00Z`; `model_id=cursor-grok-4.6-high`; `evidence_ref=docs/product/backlog.md ### BUG-0024, docs/product/acceptance.md BUG-0024 row, handoffs/intake_evidence/BUG-0024-intake-20260914T035000Z.json, docs/engineering/research.md ## R-0140, this handoff`.
- **Runtime proof**: `rp-cursor-20260913-BUG0024-intake-po-20260914T040000Z-BUG-0024` / `5169E39839C3BE335B9A63CBC76CEF6C0C78EA5157DE51ACFE07A46046B49E8D` (ttl `2026-09-14T05:00:00Z`).
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover` → `docs/engineering/state-archive/state-pack-20260913-er.md` (`boundary=triad-rollover|state`, moved=2, retained_checkpoints=13, retained_body_lines=1137). po_to_tl not packed this pass. Architecture not rolled this intake. Final `--check` PASS.
- **Status**: OPEN per US-0045. **BUG-0023 remains DONE**. **BUG-0022 remains OPEN**. **BUG-0021 remains DONE**. **US-0142 remains OPEN** (not drained). **Next**: `/discovery` (fresh **po**) for **BUG-0024**, or `/auto bug-target=BUG-0024`. Do not run discovery/architecture/execute from this intake chat. STOP.

## Discovery handoff — US-0143 Delivery routing and full-autonomy scheduler

- **Phase completed**: discovery. **Role**: po. **Story**: US-0143 only. **Sprint**: (pending — expected S0151 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T06:30:00Z. **Fresh marker**: `po-US0143-discovery-20260914T063000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0143`, parent=`auto-20260913-us0142`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, FRAMEWORK_KIT_REPO=1, drain story 9 of 10.
- **Sibling boundary**: **US-0141 DONE / US-0142 DONE** — compose only; do not reopen. **US-0133..US-0140 DONE** — compose only; do not reopen. **US-0144..US-0148 OPEN** — OUT OF SCOPE (do not mutate). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE / BUG-0024 OPEN** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Gap confirmed (narrow-read)**: US-0140 CommandRouter `DEFERRED_COMMANDS=["/auto","/quick"]` returns `WORKFLOW_ROUTE_DEFERRED` (`implemented: false`). WorkflowEngine has bounded execute↔QA loop but **no** drain/compressed-route scheduler. GateEngine `RELEASE_GATE_ORDER` (tests→QA→UAT→docs) must stay unamended. `config-view` currently exposes only `lookupDeliveryMode`. Host Cursor/OpenCode remain scheduling-only.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Implement `/auto` and `/quick` **inside** `@its-magic/runtime-core` CommandRouter/WorkflowEngine (compose US-0140). **No** sibling auto-scheduler package. **No Pi**. Do **not** rewrite GateEngine tables. |
| **D2** | Independent axes: `DELIVERY_MODE`, `TOKEN_PROFILE`, CAVEMAN/voice, `AUTONOMY_PRESET`, `WORK_KIND`. Standard / ultra_lean / mega_quick preserve mandatory tests + acceptance. Consume US-0118, US-0119, US-0095, US-0096. |
| **D3** | `/auto` loop is typed runtime state (masterplan §14.4): target → kind/mode → phase plan → role/model/policy → fresh session → phase → evidence → critic hooks → bounded repair → advance or execute↔QA → release→closure→refresh → optional drain → deterministic stop. Not a prompt. |
| **D4** | Explicit `start-from` / `DELIVERY_MODE` / `AUTO_PHASE_*` beat work-kind recommendations (DEC-0118 L8). Conflict → `WORK_KIND_DELIVERY_MODE_CONFLICT` fail-closed. Mid-story `DELIVERY_MODE` switch forbidden (DEC-0082). |
| **D5** | Expand `AUTONOMY_PRESET` before execution (`autonomy_preset_lib.expand_autonomy_preset`). Stop matrix/reason codes from kernel/manifest (`scripts/data/autonomy_stop_matrix.yaml` + consume `stop-matrix/codes.ts` — do not fork; do not encode stops in prompts). Models never decide whether a hard stop is relaxable. |
| **D6** | Drain, bulk, retry/skip/repair, quiet, pause, and operator approvals obey configured caps. Operator authority preserved. |
| **D7** | Non-relaxable even under `AUTONOMY_PRESET=full`: security-hard gates, unresolved decisions, incompatible kernel, failed mandatory quality evidence, budget exhaustion, ambiguous resume. |
| **D8** | Audit/repair ledgers make phase selection, retries, skips, stop reasons, and resume choices reproducible. Tests `test_us0143_*` (expect 12): standard+compressed routes, mid-process resume, multi-item drain, work-kind conflicts, all terminals, autonomy disabled. Kit `files` omit `standalone/`. |
| **D9** | OUT: US-0144 critic/memory *content* (compose hooks only); restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; `.env`. |
| **D10** | Do not mutate US-0141/0142 DONE, US-0144+, BUG-0023/0024. Do not drain bugs. Do not reopen US-0133..US-0140. Research stub **R-0141** (PO does not author `## R-0141`; **R-0139**=US-0142; **R-0140**=BUG-0024 — do not reuse/wipe). Companion **DEC-0143** + `# US-0143` at `/architecture` only. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0141**; stub only here)

1. **DQ1**: Package — AutoScheduler nested in `@its-magic/runtime-core` `workflow/` vs CommandRouter expansion only vs sibling package. D-lock prefers compose-in-place; architecture confirms. No Pi.
2. **DQ2**: How to lift `WORKFLOW_ROUTE_DEFERRED` for `/auto`/`/quick` without rewriting GateEngine tables or the 7-step programmatic path. Fate of `DEFERRED_COMMANDS` / `implemented: false` after this story.
3. **DQ3**: Axis independence — extend `config-view` beyond `lookupDeliveryMode` for `TOKEN_PROFILE`, voice, `AUTONOMY_PRESET`, `WORK_KIND` without folding axes. Consume US-0138 RuntimeConfig vs adapter.
4. **DQ4**: Precedence implementation of DEC-0118 L8 (`start-from` > `DELIVERY_MODE` > `AUTO_PHASE_*` > work-kind > default). KernelBridge consume `work_kind_classify_lib.py` vs TS port.
5. **DQ5**: Autonomy preset expansion — KernelBridge consume `autonomy_preset_lib.py` vs TS port of `PRESET_DEFINITIONS`. Stop matrix: consume YAML via KernelBridge vs TS mirror (do not fork writer).
6. **DQ6**: Drain loop owner — WorkflowEngine `while run active` vs CommandRouter.route(`/auto`). Caps: `AUTO_LOOP_MAX_CYCLES`, drain remaining budget, bulk, retry/skip/repair, quiet, pause, approvals. `AUTO_BUG_QUEUE` vs story drain (this run `AUTO_BUG_QUEUE=0`).
7. **DQ7**: Map AC-6 non-relaxable set onto `autonomy_stop_matrix.yaml` `security_hard` plus new codes (incompatible kernel, failed quality evidence, budget, ambiguous resume). Do not weaken US-0119 `security_hard`.
8. **DQ8**: Audit/repair ledger schema — RunsStore tables vs repo artifacts vs JSONL. Reproducible phase selection, retries, skips, stop reasons, resume choices. Mid-process resume vs US-0140 `discardOrphans` + fresh role.
9. **DQ9**: `/quick` vs `mega_quick` vs `ultra_lean` compressed routes. Preserve tests+acceptance. How critic hooks spawn supplementary (content US-0144 OUT).
10. **DQ10**: Tests — 12 `test_us0143_*` Win+Linux fake-model covering AC-1..AC-8. Kit `files` omit `standalone/`. No `auto.md` restore. No kit `cli.json` / plugin-local `tui.json`. **R-id live-inventory**: allocate **R-0141**; do not wipe R-0139 (US-0142) or R-0140 (BUG-0024).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §§14.4 (`/auto` loop), 14.5 (stop matrix), 14.6 (autonomy presets), 15 (independent axes), 32 Phase 6, 38 (parity DoD)
- Compose: US-0140 / DEC-0140 / R-0135 (`WORKFLOW_ROUTE_DEFERRED`); US-0118 / DEC-0118 L8; US-0119 / DEC-0119; US-0095 / DEC-0078; US-0096 / DEC-0082; US-0070 / DEC-0052; BUG-0006 / DEC-0051 spawn-only
- Market: [Graph Harness scheduler-theoretic](https://arxiv.org/html/2604.11378v1) (deterministic policy, bounded recovery, immutable plans); [deterministic vs LLM orchestration](https://dreaming.press/posts/deterministic-vs-llm-orchestration-for-multi-agent-systems.html); [capability vs permission autonomy](https://arxiv.org/pdf/2607.23438)
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`auto-autonomy` + `delivery-routing` → US-0143)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0141** (`ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0140** BUG-0024).
- Do **not** author `## R-0141` this phase. Do **not** wipe R-0139 (US-0142) or R-0140 (BUG-0024). Do **not** reuse R-0139 / R-0140.
- Companion **DEC-0143** + `# US-0143` at `/architecture` only — PO does not author them.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0143-discovery-po-20260914T063000Z-US-0143`
- `proof_hash=F80760B9FF4DA073C0AF5DDE847206E021A7C47FFE74B9B8A6E477BB27739FD4`
- `proof_ttl=2026-09-14T07:30:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0143","phase_id":"discovery","proof_issued_at":"2026-09-14T06:30:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0143-discovery-po-20260914T063000Z-US-0143"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0143`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → f80760b9ff4da073c0af5dde847206e021a7c47ffe74b9b8a6e477bb27739fd4; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0143`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0143-discovery-20260914T063000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0143 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0143; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-fb.md","retained_checkpoints":13,"retained_lines":1169}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-z.md","retained_lines":637,"retained_sections":14}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. final `--check` PASS. Discovery handoff retained at true end of `po_to_tl.md`.
- **Status**: US-0143 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of discovery, then `/research` in fresh **tech-lead** subagent. Do not spawn research or critic from this discovery chat. STOP.

## Research handoff — US-0143 Delivery routing and full-autonomy scheduler

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0143 only. **Sprint**: (pending — expected S0151 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T06:50:00Z. **Fresh marker**: `tl-US0143-research-20260914T065000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0143`, parent=`auto-20260913-us0142`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (research = first of research+architecture+sprint-plan), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, EARLY_RESEARCH=1, FRAMEWORK_KIT_REPO=1, drain story 9 of 10.
- **Sibling boundary**: **US-0141 DONE / US-0142 DONE** — compose only; do not reopen. **US-0133..US-0140 DONE** — compose only; do not reopen. **US-0144..US-0148 OPEN** — OUT OF SCOPE (do not mutate). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE / BUG-0024 OPEN** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Research anchor**: `docs/engineering/research.md` **`## R-0141`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Do not wipe R-0139 (US-0142) or R-0140 (BUG-0024).
- **Approach**: **A1 (A\*)** recommended. Reject A2 (sibling auto-scheduler), A3 (prompt-only / restore auto.md), A4 (rewrite GateEngine), A5 (fork stop-matrix writer), A6 (LangGraph/Temporal), A7 (fold into role-runtime), A8 (KernelBridge allowlist amend), A9 (US-0144 content), A10 (US-0146 CLI/TUI), A11 (mid-story DELIVERY_MODE switch), A12 (weaken security_hard), A13 (SQLite stop SOT), A14 (keep WORKFLOW_ROUTE_DEFERRED happy path), A15 (LLM work-kind/stop classifier).
- **Companion DEC**: **DEC-0143** Required → Accepted in `/architecture`. Do **not** create `decisions/DEC-0143.md` this phase. Do **not** author `# US-0143`. Recommend architecture H1 **`# US-0143`** (not `## US-`).

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Package | Nested DeliveryRouter in `@its-magic/runtime-core`; no sibling package; no Pi | LOCKED |
| DQ2 | Lift deferred | `RouteScheduled` implemented `/auto`/`/quick`; 7-step unamended; compose-amend `test_us0140_command_coverage` | LOCKED |
| DQ3 | Axes | Independent ConfigView lookups; no fold; no new RuntimeConfig domain | LOCKED |
| DQ4 | L8 | TS adapter + golden vectors; start-from > DELIVERY_MODE > AUTO_PHASE_* > work-kind; conflict fail-closed | LOCKED |
| DQ5 | Preset + matrix | `expandAutonomyPreset` before run; consume YAML; do not fork writer | LOCKED |
| DQ6 | Drain owner | WorkflowEngine `while run active`; caps from resolved config; AUTO_BUG_QUEUE=0 this run | LOCKED |
| DQ7 | AC-6 | YAML `security_hard` + additive KERNEL_INCOMPATIBLE / DECISION_UNRESOLVED / BUDGET_EXHAUSTED / RESUME_AMBIGUOUS; full preset cannot relax | LOCKED |
| DQ8 | Ledger + resume | RunsStore.audit + JSONL repair ledger; repo canonical; discardOrphans + fresh role | LOCKED |
| DQ9 | Compressed | `/quick` forces mega_quick shape; tests+acceptance+GateEngine non-skippable; critic slot only | LOCKED |
| DQ10 | Tests + kit + R-id | 12 `test_us0143_*`; files omit standalone/; R-0141; R-0139/R-0140 held | LOCKED |

### Architecture seeds

- Author `# US-0143` + **DEC-0143** (Accepted).
- Seeds T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12). Expected **S0151**.
- Do not expand US-0144+ ACs. Do not implement drain code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0143-research-techlead-20260914T065000Z-US-0143`
- `proof_hash=27986466F2DEE28D145CB9892C2A3AFBD4E41B2F9E9F88F133008BEB43F94042`
- `proof_ttl=2026-09-14T07:50:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0143","phase_id":"research","proof_issued_at":"2026-09-14T06:50:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0143-research-techlead-20260914T065000Z-US-0143"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0143`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 27986466f2dee28d145cb9892c2a3afbd4e41b2f9e9f88f133008beb43f94042; independently MATCH; **64 hex** verified; stored uppercase)
- Consumed discovery proof: `rp-auto-20260913-us0143-discovery-po-20260914T063000Z-US-0143` / `F80760B9FF4DA073C0AF5DDE847206E021A7C47FFE74B9B8A6E477BB27739FD4` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T07:30:00Z`; consumed_at `2026-09-14T06:50:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T064000Z-US-0143` / `C02F9C52420F869751C412D3D30BB9D324447C6BF1768ED5CB3246BDCCC7EDD0` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T07:40:00Z`)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0143`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0143-research-20260914T065000Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0141; docs/product/backlog.md ## US-0143 research_notes; docs/engineering/state.md research checkpoint; docs/engineering/decisions.md ## DEC-0143 Required stub; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-fd.md","retained_checkpoints":13,"retained_lines":1137}` + `{"boundary":"triad-rollover|po_to_tl","moved":2,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-aa.md","retained_lines":637,"retained_sections":13}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. final `--check` PASS (`state` 1137/1200; `po_to_tl` 637/650). Research handoff retained at true end of `po_to_tl.md`.
- **Status**: US-0143 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of research, then `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture or critic from this research chat. STOP.

## Architecture handoff — US-0143 Delivery routing and full-autonomy scheduler

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0143 only. **Sprint**: (pending `/sprint-plan` — expected S0151; S0150=US-0142; S0149=US-0141; S0148=BUG-0023). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T07:10:00Z (proof_issued_at). **Fresh marker**: `tl-US0143-architecture-20260914T071000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0143`, parent=`auto-20260913-us0142`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`plan` (architecture = second of research+architecture+sprint-plan; sprint-plan continues later via orchestrator spawn), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, EARLY_RESEARCH=1 (consumed **R-0141**; **no new R-id**), FRAMEWORK_KIT_REPO=1, drain story 9 of 10.
- **Sibling boundary**: **US-0141 DONE / US-0142 DONE** — compose only; do not reopen. **US-0133..US-0140 DONE** — compose only; do not reopen. **US-0144..US-0148 OPEN** — OUT OF SCOPE (US-0144 critic content). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE / BUG-0024 OPEN** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`. Do not create `sprints/S0151/` this phase. Do not spawn `/sprint-plan` from this architecture chat.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0143`**. **Companion DEC**: **DEC-0143** Accepted (`decisions/DEC-0143.md`).
- **Approach**: **A1 (A\*) LOCKED**. Reject A2–A15.
- **Research consumed**: `rp-auto-20260913-us0143-research-techlead-20260914T065000Z-US-0143` / `27986466F2DEE28D145CB9892C2A3AFBD4E41B2F9E9F88F133008BEB43F94042` — RUNTIME_PROOF_VALID MATCH at proof_issued_at `2026-09-14T07:10:00Z` before TTL `2026-09-14T07:50:00Z`; critic PASS `rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T070000Z-US-0143` / `242D01E83A4DFE451C679C02C23593A16DD0F6313282F87A8DA846987E187D31`; anti_slop=10; 0 blocking; immutable R-0141; NBs `us0143rsc-*` closed in H1.

### Locked design (A1)

- Lift `WORKFLOW_ROUTE_DEFERRED` in `@its-magic/runtime-core` CommandRouter. `SCHEDULER_COMMANDS=["/auto","/quick"]`. `DEFERRED_COMMANDS` empty after this story. `RouteScheduled` (`ok: true`, `implemented: true`, plan + independent axes). 7-step unamended for canonical phases.
- Nested `workflow/delivery-router.ts`. No sibling auto-scheduler. No Pi.
- WorkflowEngine owns §14.4 drain (`runAuto` / `runQuick`). GateEngine `RELEASE_GATE_ORDER` unamended.
- Independent axes: `DELIVERY_MODE` / `TOKEN_PROFILE` / CAVEMAN-voice / `AUTONOMY_PRESET` / `WORK_KIND`. Consume US-0118/0119/0095/0096. L8 TS adapter. YAML stop-matrix consume. `expandAutonomyPreset` before run.
- Compressed: `ultra_lean` skip-plan-verify held; `mega_quick`/`/quick` nodes `execute` → `qa` → `verify-work` → `release` → `closure` → `refresh-context` (tests+acceptance+GateEngine non-skippable).
- AC-6 non-relaxable even under `full`: `DECISION_UNRESOLVED`, `KERNEL_INCOMPATIBLE`, `QUALITY_EVIDENCE_FAILED`, `BUDGET_EXHAUSTED`, `RESUME_AMBIGUOUS` + existing YAML `security_hard`.
- Dual-write ledger. Mid-resume `discardOrphans` + fresh role. Critic-hook slot only (US-0144 content OUT).
- 12 `test_us0143_*`. Compose-amend `test_us0140_command_coverage`. Kit `files` omit `standalone/`. Do not restore `auto.md`.
- OUT: US-0144 content, restore `.opencode/commands/auto.md`, kit cli.json, plugin-local tui.json, drain BUG-0024.

### Sprint seeds

- T-anch + T-001..T-010 (11 ≤ SPRINT_MAX_TASKS=12). Expected **S0151**. Do not restore `auto.md`. Do not mutate BUG-0021/0022/0023/0024. Do not reopen US-0133..US-0142. Do not mutate US-0144+. Do not implement drain code this phase.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0143-architecture-techlead-20260914T071000Z-US-0143`
- `proof_hash=6FF1DB37B91284FDE90C5EC7058FF518605D49525BD8FACECB5AC570284F26E5`
- `proof_ttl=2026-09-14T08:10:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0143","phase_id":"architecture","proof_issued_at":"2026-09-14T07:10:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0143-architecture-techlead-20260914T071000Z-US-0143"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0143`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 6FF1DB37B91284FDE90C5EC7058FF518605D49525BD8FACECB5AC570284F26E5; independently MATCH; **64 hex** verified)
- Consumed research proof: `rp-auto-20260913-us0143-research-techlead-20260914T065000Z-US-0143` / `27986466F2DEE28D145CB9892C2A3AFBD4E41B2F9E9F88F133008BEB43F94042` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T07:50:00Z`; consumed_at `2026-09-14T07:10:00Z`; independent recompute MATCH)
- Consumed critic proof: `rp-auto-20260913-us0143-sovereign-critic-techlead-20260914T070000Z-US-0143` / `242D01E83A4DFE451C679C02C23593A16DD0F6313282F87A8DA846987E187D31` — RUNTIME_PROOF_VALID (MATCH before TTL `2026-09-14T08:00:00Z`)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0143`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=tl-US0143-architecture-20260914T071000Z-fresh`
- `evidence_ref=docs/engineering/architecture.md # US-0143; decisions/DEC-0143.md; docs/engineering/research.md ## R-0141; docs/product/backlog.md ## US-0143; docs/engineering/state.md architecture checkpoint; handoffs/resume_brief.md`
- **Status**: US-0143 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of architecture, then `/sprint-plan` expected **S0151** in fresh **tech-lead** subagent. Do not spawn sprint-plan or critic from this architecture chat. STOP.

## Discovery handoff — US-0144 Sovereign memory, reviews, and convergence

- **Phase completed**: discovery. **Role**: po. **Story**: US-0144 only. **Sprint**: (pending — expected S0152 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-14T09:50:00Z. **Fresh marker**: `po-US0144-discovery-20260914T095000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0144`, parent=`auto-20260913-us0143`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1), AUTO_QUIET=1, FRAMEWORK_KIT_REPO=1, drain story 10 of 10 (final drain slot; after this segment BACKLOG_MAX_STORIES_REACHED).
- **Sibling boundary**: **US-0143 DONE** — compose RouteScheduled / drain / critic-hook slot only; do not reopen. **US-0133..US-0142 DONE** — compose only; do not reopen. **US-0145..US-0148 OPEN** — OUT OF SCOPE (do not mutate). **BUG-0021 DONE / BUG-0022 OPEN / BUG-0023 DONE / BUG-0024 OPEN** — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Gap confirmed (narrow-read)**: US-0143 WorkflowEngine schedules supplementary critic sessions when `CROSS_MODEL_REVIEW=1` but records `critic_content: false`. Python sovereign libs exist (ledger/critic/memory/manifest/loop/convergence) and are compose-only. Remaining deferred critic/memory/convergence *content* is not yet in `@its-magic/runtime-core`. GateEngine `RELEASE_GATE_ORDER` must stay unamended. `build_injection_digest_block` this spawn returned `(no sovereign memory entries)` (read-only; `SOVEREIGN_MEMORY=1`).

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Implement remaining deferred critic/memory/convergence surfaces **inside** `@its-magic/runtime-core` (existing Python libs compose). **No** sibling package unless architecture later proves it. **No Pi**. Do **not** rewrite GateEngine tables. Do **not** rewrite US-0143 CommandRouter drain. |
| **D2** | Autonomous decisions append model/session/run-aware entries to existing US-0103 ledger (`handoffs/sovereign_decisions/<orchestrator_run_id>.jsonl`). QA verifies plan fidelity. 12-field schema unamended (additive identifiers only). |
| **D3** | Sovereign memory remains repository-owned (`docs/engineering/sovereign-memory/`). Only ranked size-capped digest via `build_injection_digest_block` enters each relevant session. Never inject the full store. Compose US-0105. |
| **D4** | US-0106 role-manifest obligations and US-0104 Challenger/Architect/Subtractor lenses execute as **fresh** review sessions; never replace producer roles. Lift `critic_content: false` through US-0143 `scheduleSupplementaryHooks`. |
| **D5** | Different producer/critic models when available; configured critic pinning; explicit degraded same-model semantics (do not claim cross-model independence). Compose US-0104 L8 + masterplan §12.5/§22.4. |
| **D6** | Deferral processing and drain-generate preserve mandatory operator decision gates and append-only evidence. Compose US-0107. `SOVEREIGN_DRAIN_AUTO_ACCEPT=0` held. |
| **D7** | Convergence is evaluated by **code and evidence** (`evaluate_convergence`). Only blocking open critic findings block critic convergence (US-0127). Eligible non-blocking same-run findings can resolve. Approved smoke surrogates never claim fake browser PASS (US-0128). Models cannot self-declare success. |
| **D8** | Goal progress, partial delivery, token/cost caps, iteration caps, and non-convergence reasons are operator-visible. |
| **D9** | Tests `test_us0144_*` (expect 12): producer/critic separation, model collision, memory bounds, deferrals, convergence success/failure, current critic/smoke fixes. Kit `files` omit `standalone/`. |
| **D10** | OUT: US-0145 parallel/deploy; US-0146 CLI/TUI; restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; `.env`. Do not mutate US-0143 DONE, US-0145+, BUG-0024. Research stub **R-0142** (PO does not author `## R-0142`; **R-0141**=US-0143 — do not reuse/wipe). Companion **DEC-0144** + `# US-0144` at `/architecture` only. Expected sprint **S0152**. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0142**; stub only here)

1. **DQ1**: Package — nested sovereign-runtime in `@its-magic/runtime-core` + KernelBridge to Python libs vs sibling package vs Pi. D-lock prefers compose-in-place; architecture confirms. No Pi.
2. **DQ2**: How to lift `critic_content: false` without rewriting US-0143 CommandRouter drain, WorkflowEngine `runAuto`/`runQuick`, or GateEngine tables.
3. **DQ3**: Ledger — KernelBridge consume `decision_ledger_lib.py` vs TS dual-write. Additive model/session/run identifiers without 12-field schema rewrite. QA plan-fidelity cross-check path.
4. **DQ4**: Memory injection — consume `build_injection_digest_block` via KernelBridge vs TS port. Char cap / top-N+top-K. Never full store. Spawn order: phase-context → digest → role instructions.
5. **DQ5**: Critic model selection — consume `select_critic_model` + pinning; degraded same-model; three-lens fresh sessions; findings JSONL compose US-0104 (no schema wipe).
6. **DQ6**: Role-manifest review graph — dispatch US-0106 `review_obligations` as supplementary sessions without substituting producer; `cross_model_policy` ordering vs `/sovereign-critic`.
7. **DQ7**: Deferral/drain-generate — consume `sovereign_loop_lib` (`append_deferral` / `list_open_deferrals` / drain-generate gate). Mandatory per-candidate `decision_gate`. `SOVEREIGN_DRAIN_AUTO_ACCEPT=0`.
8. **DQ8**: Convergence — consume `evaluate_convergence` (US-0110 five-conjunct) + US-0127 `read_open_blocking` + US-0128 smoke surrogate. Code-evaluated; not model-declared.
9. **DQ9**: Operator-visible `goal_progress` / `sovereign_partial_delivery.md` / token-cost caps / iteration caps / non-convergence reasons — which surfaces now vs US-0146 CLI/TUI.
10. **DQ10**: Tests — 12 `test_us0144_*` covering AC-1..AC-8. Kit `files` omit `standalone/`. No `auto.md` restore. **R-id live-inventory**: allocate **R-0142**; do not wipe R-0141 (US-0143).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` §§22, 24, 32 Phase 7, 38
- Compose: US-0143 / DEC-0143 / R-0141 (`critic_content: false` slot); US-0103 / DEC-0103; US-0104 / DEC-0104; US-0105 / DEC-0105; US-0106 / DEC-0106; US-0107 / DEC-0107; US-0110 / DEC-0110; US-0127; US-0128; BUG-0006 / DEC-0051 spawn-only
- Market: [MultiCritique independent critics](https://aclanthology.org/2025.findings-emnlp.78); [bounded memory control](https://arxiv.org/html/2601.11653); [origin-bound memory authority](https://ar5iv.labs.arxiv.org/html/2606.24322)
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`sovereign-runtime` → US-0144)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0142** (`ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0141** US-0143).
- Do **not** author `## R-0142` this phase. Do **not** wipe R-0141 (US-0143). Do **not** reuse R-0141.
- Companion **DEC-0144** + `# US-0144` at `/architecture` only — PO does not author them.
- Expected sprint **S0152** at `/sprint-plan` only.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0144-discovery-po-20260914T095000Z-US-0144`
- `proof_hash=04F2563AD77B0D0E519ADDF46FF3AA25445C58DF5BCD30FEB933929D7C4A0594`
- `proof_ttl=2026-09-14T10:50:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0144","phase_id":"discovery","proof_issued_at":"2026-09-14T09:50:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0144-discovery-po-20260914T095000Z-US-0144"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0144`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → 04f2563ad77b0d0e519addf46ff3aa25445c58df5bcd30feb933929d7c4a0594; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0144`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0144-discovery-20260914T095000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0144 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0144; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` `{"boundary":"triad-rollover|state","moved":1,"pack_ref":"docs/engineering/state-archive/state-pack-20260914-k.md","retained_checkpoints":14,"retained_lines":1137}` + `{"boundary":"triad-rollover|po_to_tl","moved":1,"pack_ref":"handoffs/archive/po-to-tl-pack-20260914.md","retained_lines":614,"retained_sections":13}`. `arch_linkage_guard.py` not run (architecture.md not touched). Architecture not rolled this phase. final `--check` PASS. Discovery handoff retained at true end of `po_to_tl.md`. **Status**: US-0144 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of discovery, then `/research` in fresh **tech-lead** subagent. Do not spawn research or critic from this discovery chat. STOP.
