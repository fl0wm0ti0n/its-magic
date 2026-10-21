# PO to TL archive pack (2026-10-15)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60 (manual archive of oldest tail section; --rollover not run — a prefix rollover would archive the new BUG-0029 handoff, and a full --rollover can archive the protected BUG-0033 state checkpoint and roll architecture.md)`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `## Intake handoff — BUG-0030 OpenCode `/auto` aborts with OPENCODE_AUTO_TUI_DEFINED_UNBRANDED`
- Last archived heading: `## Intake handoff — BUG-0030 OpenCode `/auto` aborts with OPENCODE_AUTO_TUI_DEFINED_UNBRANDED`
- Verification tuple (mandatory):
  - archived_body_lines=11
  - boundary=triad-manual|po_to_tl
  - moved=1
  - pack_ref=handoffs/archive/po-to-tl-pack-20261015-d.md
  - retained_lines=641
  - retained_sections=26

---

## Intake handoff — BUG-0030 OpenCode `/auto` aborts with OPENCODE_AUTO_TUI_DEFINED_UNBRANDED

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0030. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-25T23:50:05Z. **Writer**: `po-opencode-BUG0030-intake`. **Intake run**: `opencode-20260925-BUG0030-intake`.
- **Evidence**: `handoffs/intake_evidence/BUG-0030-intake-20260925T235005Z.json`, validated with `python scripts/intake_evidence_validate.py --file ...`.
- **Defect**: OpenCode CLI TUI lists `/auto`, but invoking it returns `OPENCODE_AUTO_TUI_DEFINED_UNBRANDED` before `runAutoLifecycle` starts. The current `rpc.ts` dynamic import of `@opencode/plugin/rpc` falls back to `localRpcDefine`; `tui.ts` intentionally rejects that unbranded definition.
- **Duplicate check**: Persist NEW BUG-0030. BUG-0024 is not reopened: it added stage diagnostics and mock contracts, but its unbranded mock case is expected and live CLI TUI validation was excluded. BUG-0030 owns making the advertised OpenCode `/auto` path operational.
- **Scope for `/discovery`**: identify the host-valid RPC/module-resolution and registration path, then specify a host-real integration test or reproducible smoke test that proves `/auto` reaches `runAutoLifecycle`. Preserve plugin-only ownership; do not restore `.opencode/commands/auto.md`, invent a localhost endpoint, or weaken existing fail-closed diagnostics.
- **Boundaries**: Do not merge BUG-0022 (role-model inheritance), BUG-0027 (manual phase persistence), BUG-0028, or BUG-0029. Do not claim OpenCode desktop Command.Info support. No npm publish, git push, or `.env` reads.
- **Status**: BUG-0030 remains **OPEN**. AC-1..AC-5 remain unchecked. **Next**: `/discovery` in a fresh PO context. STOP.

