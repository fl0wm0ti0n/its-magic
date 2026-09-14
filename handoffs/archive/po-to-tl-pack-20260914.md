# PO to TL archive pack (2026-09-14)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 13
- First archived heading: `## Discovery handoff — US-0141 Application runtime and pluggable execution backends`
- Last archived heading: `## Discovery handoff — US-0141 Application runtime and pluggable execution backends`
- Verification tuple (mandatory):
  - archived_body_lines=66
  - retained_body_lines=614

---

## Discovery handoff — US-0141 Application runtime and pluggable execution backends

- **Phase completed**: discovery. **Role**: po. **Story**: US-0141 only. **Sprint**: (pending — expected S0148 at `/sprint-plan`). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-13T23:50:00Z. **Fresh marker**: `po-US0141-discovery-20260913T235000Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-us0141`, parent=`auto-20260913-us0140`, `delivery_mode=ultra_lean`, resolved_phase_plan=`[spec, plan, build+verify, ship]`, macro=`spec` (intake already DONE — not re-intaken; `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` held, not mutated), `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — catalog po=`gpt-5.6-sol-high` usage-limited), AUTO_QUIET=1, EARLY_RESEARCH=1, FRAMEWORK_KIT_REPO=1, drain story 7 of 10.
- **Sibling boundary**: **US-0142..US-0148** OPEN — OUT OF SCOPE this segment (do not mutate). **US-0133..US-0140** DONE — compose only; do not reopen. **BUG-0021** DONE / **BUG-0022** OPEN / **BUG-0023** OPEN — do not mutate; do not drain bugs. Do not restore `.opencode/commands/auto.md`. Do not ship kit `cli.json` or plugin-local `its-magic-auto/tui.json`.
- **Gap confirmed (narrow-read)**: Standalone has `runtime-core` workflow/GateEngine/RunsStore with **reserved** `process_handles` (`id`, `run_id`, `reserved`) — no AppRuntime, ProcessManager, or ExecutionBackend. No `standalone/packages/app-runtime`. Kit `files` omit `standalone/`. Kit remote/dev-environment contracts (US-0086 / US-0098 / US-0065) remain input/QA compatibility — runtime must own execution. Browser interaction is US-0142. OS micro-VM is future.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Owned `AppRuntime` in standalone. Package home is likely `standalone/packages/app-runtime` **or** nested `runtime-core` process table — **architecture decides (DQ1)**. **No Pi** imports outside `packages/pi-kernel`. Do not rewrite AgentKernel isolation loader or `noTools: "builtin"`. |
| **D2** | Compose US-0140 `RunsStore` reserved `process_handles` SQLite table. Extend columns for process/container identity — do **not** reimplement workflow, GateEngine, CommandRouter, or crash-resume DONE authority. Repo artifacts remain canonical. |
| **D3** | `ExecutionBackend`: **local** + **Docker** core v1; **WSL** + **SSH/remote Docker** typed adapters with connectivity diagnostics. Kit `remote.json` / US-0086 remain input compatibility surfaces; the runtime owns execution. |
| **D4** | Supported Node, Python, Go, Java, and .NET projects receive stack-aware test/start; unknown stacks fail or fall back deterministically (compose US-0065). |
| **D5** | Startup/health failure: capture logs, classify, optionally spawn a **fresh DEV** remediation session (compose US-0136), rebuild/restart, stop at a configured retry cap with a deterministic reason. Docker HEALTHCHECK does not auto-restart standalone containers — AppRuntime owns the loop. |
| **D6** | Test/build commands execute through the selected backend and persist structured exit, duration, stdout, and stderr evidence while summarizing large logs for model context. |
| **D7** | App URL/ports and health are safely exposed to browser QA (US-0142 consumes; this story does not drive the browser). Process cleanup works after success, failure, cancellation, and runtime restart. Never read `.env` (US-0085). |
| **D8** | Tests `test_us0141_*` (expect 12 later at execute). Chaos/integration: local web app, Docker stack, remote disconnect, process crash, timeout, restart, unsupported backend. Kit `files` omit `standalone/`; do not add standalone to kit workspaces. |
| **D9** | OUT: OS micro-VM isolation (future); browser UAT (US-0142); `/auto`/`/quick` drain routing (US-0143); restore `.opencode/commands/auto.md`; kit `cli.json`; plugin-local `its-magic-auto/tui.json`; npm-publish; git push; `.env` reads. |
| **D10** | Do not mutate BUG-0021 (DONE), BUG-0022 (OPEN), BUG-0023 (OPEN). Do not drain bugs. Do not reopen US-0133..US-0140. Do not mutate US-0142+. Research stub **R-0137** (PO does not author `## R-0137`; **R-0136 is BUG-0023**). Companion **DEC-0141** + `# US-0141` at `/architecture` only. |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0137**; stub only here)

1. **DQ1**: Package split — sibling `standalone/packages/app-runtime` vs nested `runtime-core` (`src/runtime/` / process table). Who owns `AppRuntime` vs `ProcessManager` vs `ExecutionBackend`. No Pi. Who calls PolicyEngine/SessionSupervisor/config without those packages importing app-runtime internals.
2. **DQ2**: `process_handles` schema extension vs reserved stub (`reserved INTEGER`). Migration, owning run/phase columns, log-ring storage vs files. Who writes vs US-0140 `RunsStore`.
3. **DQ3**: Backend matrix — local + docker-local core v1; WSL and SSH/remote Docker as typed adapters. Connectivity diagnostic contract (fail-closed missing binary, like Chump `health_check`). Compose US-0086 `remote.json` as input only.
4. **DQ4**: Stack discovery — Node/Python/Go/Java/.NET profiles; unknown-stack fail vs fallback reason codes. Consume vs replace US-0065 `uat_probe_lib` / `DEV_SERVER_*` / US-0098 `.cursor/dev-environment.json`.
5. **DQ5**: Bounded remediation — retry cap source (new vs US-0138 loop keys); fresh DEV session spawn via SessionSupervisor; classification taxonomy; Docker HEALTHCHECK vs AppRuntime-owned restart (industry: standalone Docker does not auto-restart unhealthy containers).
6. **DQ6**: Evidence schema for test/build (exit, duration, stdout/stderr refs, summarization). Log ring size and model-context budget.
7. **DQ7**: Connect/health exposure for US-0142 without implementing browser. Secret redaction. Cleanup on crash/restart (compose US-0140 `discardOrphans`).
8. **DQ8**: `test_us0141_*` Win+Linux inventory — AC-1..AC-8; chaos fixtures; Docker availability in CI; fake-model CI; unsupported-backend fail-closed.
9. **DQ9**: Compose vs rewrite: PolicyEngine path/shell (US-0137 Layer A held; Layer B execution profiles §26.3 now in scope as **profiles**, not micro-VM). Do not rewrite KernelBridge, workflow, config, context-engine, `noTools`.
10. **DQ10**: Kit boundary — `package.json` `files` omit `standalone/`; no kit `cli.json`; no plugin-local `tui.json`; no `auto.md` restore. FRAMEWORK_KIT_REPO=1. **R-id live-inventory**: if BUG-0023 `/research` authors `## R-0137` first, US-0141 continues to next unused heading (do not wipe R-0136).

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 19 (AppRuntime/ProcessManager/backends/self-debug), 21 (stack-aware tests + structured evidence), 26.3 (execution profiles; micro-VM later), 32 Phase 4, 36
- Industry: [Dev Containers `CLIHostType` `local|wsl|container|ssh`](https://github.com/devcontainers/cli/blob/39685cf1/src/spec-common/cliHost.ts); [Chump ExecutionBackend](https://github.com/repairman29/chump/blob/main/docs/architecture/EXECUTION_BACKENDS.md) (`name`/`execute`/`health_check`, fail-closed missing docker/ssh); [Xec adapters](https://github.com/xec-sh/xec/tree/main/packages/core) (Local/Docker/SSH, timeouts, cancellation, remote Docker); Docker HEALTHCHECK does not auto-restart standalone containers
- Compose: US-0140 / DEC-0140 / R-0135 (`process_handles` reserved); US-0065 runtime QA; US-0086 remote targeting; US-0098 Connect block; US-0085 `.env` deny; US-0136 SessionSupervisor; US-0137 PolicyEngine
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json` (`dev-environment-runtime` + `remote-execution` → US-0141)

### Research stub (PO does not author `docs/engineering/research.md`)

- **Expected next R-id**: **R-0137** (orchestrator assignment for US-0141; `ID_NAMESPACE_BOOTSTRAP=0`; highest existing heading is **R-0136** BUG-0023).
- **Collision**: BUG-0023 discovery independently stubbed **R-0137** for that bug's `/research`. PO does **not** author `## R-0137`. `/research` live-inventories headings: if `## R-0137` is absent, allocate it for US-0141; if present, continue to the next unused id. Do **not** wipe R-0136. Do **not** reuse R-0133 / R-0135 / R-0136. EARLY_RESEARCH=1 does not authorize writing the heading in discovery.
- Companion **DEC-0141** + `# US-0141` at `/architecture` only — PO does not author them.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-us0141-discovery-po-20260913T235000Z-US-0141`
- `proof_hash=D7ED017CC467CA58699EC839313FC31A06C1B126E3A13389BA158A093ED9A9B7`
- `proof_ttl=2026-09-14T00:50:00Z`
- Hash via `from scripts.token_cost_lib import compute_strict_proof_hash` (positional; compact sorted-key JSON).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-us0141","phase_id":"discovery","proof_issued_at":"2026-09-13T23:50:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-us0141-discovery-po-20260913T235000Z-US-0141"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0141`, `skipped_phases=[intake]`, `native_chain_active=true`, `native_chain_continuing=true`
- `hash_recompute_confirmation=true` (compute_strict_proof_hash → d7ed017cc467ca58699ec839313fc31a06c1b126e3a13389ba158a093ed9a9b7; independently MATCH; **64 hex** verified; stored uppercase)

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0141`, `model_id=cursor-grok-4.6-high`, `fresh_context_marker=po-US0141-discovery-20260913T235000Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0141 discovery_notes; docs/product/vision.md ## Discovery Notes — US-0141; this handoff; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md; handoffs/intake_evidence/US-0133-0148-intake-20260911.json (read-only)`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--rollover --json` `{"boundary":"triad-rollover|state","moved":2,"pack_ref":"docs/engineering/state-archive/state-pack-20260913-dm.md","retained_checkpoints":14,"retained_lines":1141}` (archived `## Sovereign-critic checkpoint — US-0140 execute` through `## Sovereign-critic checkpoint — refresh-context BUG-0021`; archived_body_lines=155; preamble_lines=11; retained_body_lines=1141) + `{"boundary":"triad-rollover|po_to_tl","moved":3,"pack_ref":"handoffs/archive/po-to-tl-pack-20260913-s.md","retained_lines":592,"retained_sections":13}` (archived `## Architecture handoff — US-0138` through `## Discovery handoff — US-0139`; archived_body_lines=119; retained_body_lines=592). `arch_linkage_guard.py --pre` not run (architecture.md not touched). Architecture not rolled. final `--check` PASS (`state` 1141/1200; `po_to_tl` 592/650). Discovery handoff retained at true end of `po_to_tl.md`.
- **Status**: US-0141 remains **OPEN**. AC-1..AC-8 remain unchecked. **Next**: orchestrator sovereign-critic of discovery, then `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

