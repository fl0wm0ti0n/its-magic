# PO to TL archive pack (2026-09-17)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 12
- First archived heading: `## Architecture handoff — US-0141 Application runtime and pluggable execution backends`
- Last archived heading: `## Architecture handoff — US-0141 Application runtime and pluggable execution backends`
- Verification tuple (mandatory):
  - archived_body_lines=43
  - retained_body_lines=615

---

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

