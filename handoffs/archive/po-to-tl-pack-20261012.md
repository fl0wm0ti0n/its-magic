# PO to TL archive pack (2026-10-12)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60` (manual archive of the oldest trailing section; `--rollover` not run because a prefix rollover would archive the new US-0155 handoff and the protected BUG-0033 state checkpoint)
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first): 1
- Retained units in hot file: 24
- First archived heading: `## Intake handoff — BUG-0031 `/closure` cannot complete on OpenCode: no spawnable closure role is authorized to write the canonical DONE-flip paths`
- Last archived heading: `## Intake handoff — BUG-0031 `/closure` cannot complete on OpenCode: no spawnable closure role is authorized to write the canonical DONE-flip paths`
- Verification tuple (mandatory):
  - archived_body_lines=12
  - retained_body_lines=640

---

## Intake handoff — BUG-0031 `/closure` cannot complete on OpenCode: no spawnable closure role is authorized to write the canonical DONE-flip paths

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0031. **Sprint**: (pending — expected after BUG-0022 DoD / US-0156 sequence). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-10-01T12:00:00Z. **Writer**: `po-cursor-20261001-BUG0031-intake`. **Intake run**: `po-cursor-20261001-BUG0031-intake`.
- **Evidence**: `handoffs/intake_evidence/BUG-0031-intake-20261001T120000Z.json`, validated pre-write with `python scripts/intake_evidence_validate.py --file ...` → `[INTAKE_EVIDENCE_VALIDATION_OK]` (exit 0).
- **Defect**: On the OpenCode host, `/closure` cannot complete: the primary closure role `qe` is **not spawnable** (OpenCode subagent has no `qe` type), and the spawnable closure role (`curator`) plus `qa` have **no write authorization** over the four canonical DONE-flip paths — `docs/product/backlog.md` `Status: OPEN`→`DONE` (+ AC tick), `docs/product/acceptance.md` `[ ]`→`[x]`, `sprints/S0xxx/closure-verification.md` (create), and the state.md closure checkpoint. Live-falsified in **S0163 / BUG-0022**: the full lifecycle reached RELEASE_PASS, the closure-evidence half passed (`CLOSURE_VERIFY_PASS`), and the closure-flip half fail-closed (`CLOSURE_BLOCKED_PERMISSION_MATRIX`), leaving only an **operator hand-flip** workaround.
- **Duplicate check**: NEW BUG-0031. **Distinct from BUG-0027** (manual-phase evidence *persistence* — a phase role writing its own phase's evidence; that already works). **Distinct from BUG-0016** (DONE — general bash/edit posture + `S*` globs for po/tech-lead/curator/dev/qa/release; it never granted a *closure* role the canonical DONE-flip paths). **Distinct from BUG-0024 / BUG-0030** (OpenCode `/auto` dispatch class). BUG-0022 and US-0156 are *affected consumers* (DoD gate — BUG-0022 must be DONE for US-0156) and must **not** be mutated, drained, or hand-flipped as this bug's fix.
- **Locked boundaries**: Do **not** close this by an operator hand-flip — the defect is the missing role/authorization contract, not the one pending flip. Do **not** weaken DEC-0152 (deny-by-default, broad-deny-before-path-allow), US-0045 (release cannot mark DONE / closure owns the DONE flip), or BUG-0006 (spawn-only). Preserve `template/.opencode/**` parity with `.opencode/**`. No npm publish, no git push, no `.env` reads.
- **Scope for `/discovery`**: Determine which spawnable closure role (`curator`, or make `qe` spawnable) must own the canonical DONE-flip, and the minimal permission-map change so that role is authorized over the four closure-owned flip paths (backlog status+AC, acceptance row, closure-verification.md, state.md) — while keeping deny-by-default for all other paths and preserving `qe`-default / `curator`-alternate semantics (US-0120 / DEC-0051). Also specify the fail-closed diagnostic that must surface the exact denied paths when no spawnable closure role can flip (not a silent operator fallback).
- **Sibling boundary**: Do not reopen/mutate BUG-0016, BUG-0019/0020 (OpenCode TUI listing), BUG-0022, BUG-0023, BUG-0024, BUG-0026, BUG-0027, BUG-0028, BUG-0029, BUG-0030, US-0156, US-0045, US-0120, US-0122, US-0124/0125/0126.
- **Status**: BUG-0031 remains **OPEN**. `docs/product/acceptance.md` BUG-0031 row remains **unchecked**. **Next**: `/discovery` in a fresh **PO** context, beginning with the role/authorization/contract repair. Do not implement from intake. STOP.
