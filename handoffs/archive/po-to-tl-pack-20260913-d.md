# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Research handoff — US-0134 Existing kernel bridge and compatibility handshake`
- Last archived heading: `## Research handoff — US-0134 Existing kernel bridge and compatibility handshake`
- Verification tuple (mandatory):
  - archived_body_lines=48
  - retained_body_lines=623

---

## Research handoff — US-0134 Existing kernel bridge and compatibility handshake

- **Phase completed**: research. **Role**: tech-lead. **Story**: US-0134 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T12:35:00Z. **Fresh marker**: `tl-US0134-research-20260912T123500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-us0134`, parent=`auto-20260912-us0133`, `delivery_mode=ultra_lean`, macro=`plan` (research = first of research+architecture+sprint-plan).
- **Sibling boundary**: **US-0135..US-0148** OPEN — OUT OF SCOPE. **US-0133** DONE — compose locate-path only; not reopened. **BUG-0018** DONE — do not reopen.
- **Research anchor**: `docs/engineering/research.md` **`## R-0122`** (DQ1–DQ10 LOCKED). Discovery D1–D10 not rewritten. Do not wipe R-0120/R-0121.
- **Approach**: **A1** recommended. Reject A2 (`its-magic-kernel/` extract), A3 (TS validator rewrite), A4 (filename/`package.json` inference), A5 (reuse OpenCode US-0125 plugin).
- **Companion DEC**: **DEC-0134** Required → Accepted in `/architecture`.

### Closed questions DQ1–DQ10

| DQ | Topic | Resolution | LOCK |
|----|-------|------------|------|
| DQ1 | Locate | Three-marker parent walk (backlog + `intake_evidence_validate.py` + `.its-magic-version`) + `--kernel-root`; cap 16; reject scratchpad-only | LOCKED |
| DQ2 | Manifest SOT | `getKernelVersion()` = DEC-0045 marker; `readContractManifest()` = additive `its_magic/kernel-contract.json` | LOCKED |
| DQ3 | Range | Runtime `supported-kernel-range.json`; semver `includePrerelease` so `0.1.3-9` is in-range; not US-0138 | LOCKED |
| DQ4 | Validators | Allowlist of 6 shipped CLIs + `uat-planner`/`status-reconcile` wrappers; unknown → `KERNEL_VALIDATOR_MISSING` | LOCKED |
| DQ5 | Spawn | Env then `py -3`/`python`/`python3` probe; cwd=kernel root; 60s timeout; raw Python codes on FAIL; missing interp → `KERNEL_VALIDATOR_MISSING` | LOCKED |
| DQ6 | Artifact map | §2.1 keys; required product/engineering/decisions/sprints/handoffs; optional `work/` + sovereign | LOCKED |
| DQ7 | UAT/status | Thin `runValidator` aliases; existing `uat_probe_lib.py`; new read-only status checker; no curator writes | LOCKED |
| DQ8 | Tests | Fixture repos in `standalone/tests/contract` + kit twin; real Python; Win+Linux; no paid calls | LOCKED |
| DQ9 | Codes | UNSUPPORTED = parsed version outside range; MISMATCH = in-range schema/manifest/artifact; unparseable = MISMATCH | LOCKED |
| DQ10 | Compose | New `packages/kernel-bridge` (no Pi); US-0125 parallel; do not amend AgentKernel or `OPENCODE_*` | LOCKED |

### Architecture seeds

- Author `# US-0134` + **DEC-0134** (Accepted).
- Seeds T-anch + T-001..T-009 (10 ≤ SPRINT_MAX_TASKS=12).
- Do not expand US-0135+ ACs. Do not extract `its-magic-kernel/`. Do not reopen US-0133 / BUG-0018.

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-us0134-research-techlead-20260912T123500Z-US-0134`
- `proof_hash=5C25F84CEC351C1C21FB84DB65A8CAC8071F5598DDDFBF774226935C9FD30927`
- `proof_ttl=2026-09-12T13:35:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0134","phase_id":"research","proof_issued_at":"2026-09-12T12:35:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-us0134-research-techlead-20260912T123500Z-US-0134","sprint_id":"none","story_id":"US-0134"}`
- Consumed discovery proof: `rp-auto-20260912-us0134-discovery-po-20260912T122800Z-US-0134` / `2BA8441A2DCC0FB1E559A373160115B7DA44ACFA56A939761B65EFF3B98B3DE2` — RUNTIME_PROOF_VALID (MATCH before TTL)

### Isolation + stop

- `phase_id=research`, `role=tech-lead`, `story_id=US-0134`, `model_id=cursor-grok-4.6`, `fresh_context_marker=tl-US0134-research-20260912T123500Z-fresh`
- `evidence_ref=docs/engineering/research.md ## R-0122; docs/product/backlog.md ## US-0134 research_notes; docs/engineering/state.md research checkpoint; docs/engineering/decisions.md ## DEC-0134; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section.
- **Status**: US-0134 remains **OPEN**. **Next**: `/architecture` in fresh **tech-lead** subagent. Do not spawn architecture from this research chat. STOP.

---

