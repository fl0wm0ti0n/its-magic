# PO to TL archive pack (2026-10-15)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Correction: prefix rollover archived the new US-0160 section because the hot file was already at 650 lines and the script archives the prefix. US-0160 was restored to the hot top. This pack holds the tail section removed so the hot file stays within the line cap.
- Archived units (tail): 1
- Retained units in hot file: 26
- First archived heading: `## Intake handoff — US-0156 OpenCode /auto parity: continuous multi-phase, drain, resume, phase-selection`
- Last archived heading: `## Intake handoff — US-0156 OpenCode /auto parity: continuous multi-phase, drain, resume, phase-selection`
- Verification tuple (mandatory):
  - archived_body_lines=13
  - retained_body_lines=646

---

## Intake handoff — US-0156 OpenCode `/auto` parity: continuous multi-phase, drain, resume, phase-selection

- **Phase completed**: intake (`/intake`). **Role**: po. **Story**: US-0156. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-27. **Writer**: `po-opencode-US0156-parity-intake`. **Intake run**: `opencode-20260927-US0156-parity-intake`.
- **Evidence**: `handoffs/intake_evidence/US-0156-intake-20260927T000000Z.json`, validated with `python scripts/intake_evidence_validate.py --file ...` (`[INTAKE_EVIDENCE_VALIDATION_OK]`, exit 0) before canonical writes.
- **Decision (operator, question tool)**: Close the full Cursor `/auto` parity gap (native in-chat chain, continuous multi-phase, backlog drain, bug-queue, start-from/resume, phase-selection) as **one Epic story with internal slices** (S1..S7). OpenCode `/auto` runs **DEFAULT continuous** (`AUTO_FLOW_MODE=full_autonomy`). Bug handling: BUG-0022 + BUG-0027 are **Definition-of-Done prerequisites** (must reach DONE); BUG-0028 + BUG-0029 are **triaged as prerequisite slices**, NOT merged/closed.
- **Duplicate check**: No existing US covers OpenCode continuous orchestration. US-0121..US-0126 (OpenCode adapter dispatch epic) are DONE and are the base, not the parity layer. BUG-0030 locked the dispatch route (`auto.md` + `agent: auto`, no plugin RPC); US-0156 builds **additively** on that route and does not reopen it. Cursor parity sources: US-0037, US-0044, US-0070, US-0080, US-0087, US-0088, US-0092, US-0095.
- **Scope for `/discovery`**: On the normal OpenCode CLI TUI, make `runAutoLifecycle` continue into subsequent admitted phases (S1/S2), drain the eligible backlog in dependency order with Stop-Matrix termination (S3), select story-vs-bug work from the OPEN queue (S4), support `start-from`/resume from persisted lifecycle evidence (S5), and apply the Cursor phase-selection policy with `persistManualPhaseIsolation` audit (S6). All within the BUG-0030-locked spawn-only contract (`agent: auto`, no TUI/RPC surface).
- **Locked boundaries**: Preserve `.opencode/tui.json` `"plugin": []` (BUG-0030 / DEC-0151). Do not restore `.opencode/commands/auto.md` beyond the BUG-0030-locked form; do not add a JSON command template or a localhost endpoint; do not claim OpenCode desktop Command.Info / `opencode --pure`. Desktop/IDE remain out of scope. US-0149..US-0155 (standalone runtime/TUI) stay separate.
- **DoD gate (AC-7)**: BUG-0022 + BUG-0027 must be DONE and cited in verify-work; BUG-0028 + BUG-0029 stay OPEN (prerequisite slices). No `itsm`-runtime work leaks into the OpenCode surface.
- **Safety**: No npm publish, no git push, no `.env` reads. `template/.opencode/**` parity with `.opencode/**` preserved. STOP-matrix fail-closed tokens in `orchestrator.ts` are not weakened.
- **Status**: US-0156 remains **OPEN**. AC-1..AC-10 remain unchecked. **Next**: `/discovery` in a fresh PO/tech-lead context (S1 first, then S2). Do not implement from intake. STOP.

