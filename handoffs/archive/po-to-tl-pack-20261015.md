# PO to TL archive pack (2026-10-15)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60 (manual archive of oldest tail section; --rollover not run — a prefix rollover would archive the new US-0157 handoff, and a full --rollover can archive the protected BUG-0033 state checkpoint and roll architecture.md)`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous tail): 1
- Retained units in hot file: 25
- First archived heading: `## Discovery handoff — US-0156 OpenCode `/auto` parity: continuous multi-phase, drain, resume, phase-selection`
- Last archived heading: `## Discovery handoff — US-0156 OpenCode `/auto` parity: continuous multi-phase, drain, resume, phase-selection`
- Verification tuple (mandatory):
  - boundary=triad-manual|po_to_tl
  - moved=1
  - retained_sections=25
  - retained_lines=644
  - pack_ref=handoffs/archive/po-to-tl-pack-20261015.md
  - archived_body_lines=20

---

## Discovery handoff — US-0156 OpenCode `/auto` parity: continuous multi-phase, drain, resume, phase-selection

- **Phase completed**: discovery. **Role**: po. **Story**: US-0156 only. **Verdict**: PASS (`decision_gate=false`).
- **Execution note**: The delegated manual discovery command returned `OPENCODE_MANUAL_PHASE_WRITE_DENIED` before it could persist phase isolation evidence. This direct continuation records the product discovery only; it does not claim manual-phase persistence or a live OpenCode execution proof.
- **Locked outcome**: On normal OpenCode CLI TUI, the BUG-0030 command-owned `/auto` route (`agent: auto`) defaults to `AUTO_FLOW_MODE=full_autonomy` and continues one spawn-only lifecycle across admitted phase and eligible segment boundaries. It must stop, rather than ask for a routine re-invocation, only at the inherited non-suppressible Stop-Matrix boundaries or bounded caps.
- **Scheduling and recovery**: Resolve a single effective phase plan before spawning; `start-from` overrides resume, then `resume_brief` precedes `state.md`. Invalid or ambiguous resolution fails closed, never falls back to `execute`. Story drain and bug queue are mutually exclusive; explicit `bug-target` wins, while ordinary drain selects dependency-eligible OPEN stories. Persist plan, skipped phases, item cursor/budget, stop reason, and fresh-isolation provenance at every continuation boundary.
- **Scope boundaries**: Preserve `.opencode/tui.json` `"plugin": []`, the BUG-0030 `.opencode/commands/auto.md` spawn-only route, and all Stop-Matrix, role, proof, QA, release, cap, and secret restrictions. Do not restore TUI/RPC, add JSON commands or localhost, claim Desktop Command.Info or `--pure`, alter standalone runtime work, read `.env`, publish, or push. `persistManualPhaseIsolation` remains an audit path for direct commands and cannot create lifecycle progress.
- **DoD boundary**: BUG-0022 and BUG-0027 must be DONE and cited during verify-work. BUG-0028 and BUG-0029 remain OPEN prerequisite slices unless their own work closes them; do not merge or close them here.
- **Research questions**:
  1. What host-valid continuation mechanism starts the next fresh phase without recursively reusing the `/auto` command session?
  2. Which Python bridge inputs/outputs define fail-closed first-phase, resume, effective-plan, next-item, and dependency resolution?
  3. What exact precedence and reason-code matrix covers `start-from`, phase policy, story drain, bug target, resume, and scheduler conflict?
  4. What durable tuple prevents duplicate phase/segment execution across an interruption and resume?
  5. Which existing Stop-Matrix reasons are terminal, retryable, or continuation-admitting on OpenCode without weakening the Cursor contract?
  6. How do loop, retry, backlog, and bug caps share deterministic accounting across a continuous OpenCode run?
  7. How are `effective_phase_plan`, `skipped_phases`, item cursor, queue budget, and isolation provenance validated at each boundary?
  8. Which active/template contract tests prove continuous phases, story drain, bug queue, resume/start-from, policy conflicts, hard stops, cap exhaustion, and DoD prerequisites without a live Desktop or `--pure` probe?
- **Evidence refs**: `handoffs/intake_evidence/US-0156-intake-20260927T000000Z.json`; `docs/product/vision.md` `## Discovery Notes — US-0156`; `docs/product/acceptance.md` US-0156 row; `.opencode/commands/auto.md`; `.opencode/plugins/orchestrator.ts` `runAutoLifecycle` / `selectFirstPhaseViaPython` / `persistManualPhaseIsolation`; US-0037, US-0044, US-0070, US-0087, US-0088, US-0092, and US-0095 contracts.
- **Status**: US-0156 remains **OPEN**. AC-1..AC-10 remain unchecked. **Next**: `/research` in a fresh **tech-lead** context. Live-inventory the next free `R-####`; do not author architecture or implementation from this discovery phase. STOP.

