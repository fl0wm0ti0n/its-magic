# PO to TL archive pack (2026-10-15)

- Rollover trigger: manual tail archive so the US-0161 intake handoff stays on the hot surface
- Source: `handoffs/po_to_tl.md`
- Reason: prefix rollover (`po-to-tl-pack-20261015-b.md`) archived the new US-0161 section because the hot file was over `PO_TO_TL_HOT_MAX_LINES=650`. That section is restored at the top. This pack holds the tail section removed to stay within the line cap.
- Boundary: `triad-manual|po_to_tl`
- Archived units: 1
- First archived heading: Discovery handoff — BUG-0030 OpenCode `/auto` aborts with `OPENCODE_AUTO_TUI_DEFINED_UNBRANDED`

---

## Discovery handoff — BUG-0030 OpenCode `/auto` aborts with OPENCODE_AUTO_TUI_DEFINED_UNBRANDED

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0030 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Execution note**: The delegated manual discovery command stopped with `OPENCODE_MANUAL_PHASE_WRITE_DENIED` before it could persist. This direct handoff records the discovery result; the denial is an execution-context constraint, not evidence that BUG-0030 is fixed.
- **Locked outcome**: On the normal OpenCode CLI TUI, listed `/auto` must start `runAutoLifecycle`. The current unbranded local-RPC fallback is the identified blocker, not an acceptable happy-path result.
- **Technical boundary for research**: Determine a host-valid shared RPC definition, module-resolution, and registration route for the project TUI and server plugins. Preserve plugin-only `/auto`, `{ id, tui }`, `editor.add`, explicit unsupported-host failures, installer overwrite, and template parity. Do not restore `auto.md`, add a JSON command template, invent localhost, or require an undocumented consumer-side dependency install.
- **Proof boundary**: Replace mock-only closure confidence with a reproducible host-real integration or smoke contract proving the listed command invokes `runAutoLifecycle`. Desktop Command.Info and `--pure` remain out of scope.
- **Sibling boundary**: Do not reopen BUG-0024; do not merge BUG-0022, BUG-0027, BUG-0028, or BUG-0029. No npm publish, git push, or `.env` reads.
- **Next**: `/research` in a fresh tech-lead context. Live-inventory the next free `R-####`; do not author architecture or implementation from this discovery phase. BUG-0030 remains **OPEN**. STOP.

### Research correction — BUG-0030 / R-0152

- The private-RPC discovery direction is superseded: `@opencode/plugin@1.18.32` returns E404 and its v2 plugin documentation does not bind the installed host.
- The documented target is `.opencode/commands/auto.md` with `agent: auto` and a non-STOP spawn-only command body. Retire the legacy TUI/RPC route only during implementation.

