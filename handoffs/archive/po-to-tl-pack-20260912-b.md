# PO to TL archive pack (2026-09-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Discovery handoff — BUG-0015 OpenCode `/auto` dispatch wiring gap`
- Last archived heading: `## Discovery handoff — BUG-0015 OpenCode `/auto` dispatch wiring gap`
- Verification tuple (mandatory):
  - archived_body_lines=43
  - retained_body_lines=636

---

## Discovery handoff — BUG-0015 OpenCode `/auto` dispatch wiring gap

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0015 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-06T14:05:00Z. **Fresh marker**: `po-BUG0015-discovery-20260906T140049Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260906-bug0015`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken).
- **Sibling boundary**: BUG-0016 remains OPEN and out of scope this segment (permissions only).
- **Gap confirmed (narrow-read)**: `.opencode/commands/auto.md` body is STOP-only; `.opencode/plugins/orchestrator.ts` exports `spawnPhase` from `setup()` return API and registers only `tool.hook("execute.before")` write-guard — no command/event hook starts the spawn loop on `/auto`.

### Discovery locks D1–D7

| ID | Lock |
|----|------|
| **D1** | Dispatch attaches primarily via **plugin command/event hook** that invokes the spawn loop when `/auto` starts. Thin `auto.md` stays dispatch-only (DEC-0125 DQ5). Agent prompt may restate "plugin owns spawn" but is **not** sole dispatch (success test (a) / BUG-0006). Returning `spawnPhase` from `setup()` alone is insufficient. Exact OpenCode v2 hook name → DQ1. |
| **D2** | Missing / non-function `session.create` → fail-closed **`OPENCODE_PLUGIN_SPAWN_UNSUPPORTED`**. No in-band roleplay; no Cursor Task port; operator-visible stop with reason code. |
| **D3** | Python `scripts/auto_outer_driver.py` remains stop-matrix SOT; plugin keeps `dispatchStopMatrix` subprocess; no TS reimplementation (DEC-0124 §6). Headless `opencode run --agent auto` compose unchanged — this bug is interactive `/auto` → spawn linkage. |
| **D4** | Each spawn MUST emit `IsolationEvidence` (`parentID`, `sessionID`, `role`, `phase_id`, `timestamp`, `fresh_context_marker`) with `sessionID !== parentID`; null/throw/identical-id → **`OPENCODE_SUBTASK_IGNORED`**; persist per US-0023/US-0048/BUG-0006. |
| **D5** | Additive `test_bug0015_*` (and/or amend us0124 markers) via mock-ctx harness — assert dispatch hook registration + `/auto` entry invokes `spawnPhase`; static `auto.md` ≤20 lines / no spawn literals; **no live OpenCode probe in CI**. |
| **D6** | BUG-0016 permissions OUT OF SCOPE; US-0131/US-0132 config/model OUT OF SCOPE; do not amend DEC-0122 Layer-1 matrix here; compose US-0124/US-0125 without reopening DONE ACs. |
| **D7** | Research questions DQ1–DQ7 below → `/research` authors **R-0114** (compose R-0109; do not wipe). |

### Research questions DQ1–DQ7 (for `/research`)

1. **DQ1**: Exact OpenCode v2 plugin API surface to detect `/auto` command invocation (event/hook name, args, lifecycle) — cite current docs.
2. **DQ2**: Should the spawn loop live entirely inside plugin `setup` callbacks vs host-invoked exported `spawnPhase` after command dispatch — single-owner rule?
3. **DQ3**: First-phase selection after `/auto` on OpenCode — `resume_brief` / argv / scratchpad / US-0087 bug-queue compose?
4. **DQ4**: How do interactive plugin path and headless `opencode run --auto` share one entry without duplicate spawn (DEC-0125 R3)?
5. **DQ5**: Isolation-evidence persistence target for OpenCode-spawned phases (`state.md` only vs additional plugin-local) — minimum contract?
6. **DQ6**: Minimal contract-test inventory for dispatch wiring without live host (markers, harness extensions)?
7. **DQ7**: Does the fix require amending DEC-0124/DEC-0125 vs additive companion DEC-0015-bug / `# BUG-0015` architecture section only?

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260906-bug0015-discovery-po-20260906T140500Z-BUG-0015`
- `proof_hash=700734379DE4CFE3B0509DB39E8F3208DFAEC8ADB2BA475EA8CDB9C0AF37C83F`
- `proof_ttl=2026-09-06T15:05:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"spec","model_id":"composer-2.5","orchestrator_run_id":"auto-20260906-bug0015","phase_id":"discovery","proof_issued_at":"2026-09-06T14:05:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260906-bug0015-discovery-po-20260906T140500Z-BUG-0015","sprint_id":"pending","story_id":"BUG-0015"}`

### Isolation + stop

- `phase_id=discovery`, `role=po`, `bug_id=BUG-0015`, `fresh_context_marker=po-BUG0015-discovery-20260906T140049Z-fresh`
- `evidence_ref=docs/product/vision.md ## Discovery Notes — BUG-0015; docs/product/backlog.md ### BUG-0015 discovery_notes; handoffs/intake_evidence/BUG-0015-intake-20260906.json; .opencode/commands/auto.md; .opencode/plugins/orchestrator.ts; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Status**: BUG-0015 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

