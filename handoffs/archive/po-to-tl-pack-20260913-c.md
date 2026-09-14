# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 15
- First archived heading: `## Discovery handoff — US-0134 Existing kernel bridge and compatibility handshake`
- Last archived heading: `## Discovery handoff — US-0134 Existing kernel bridge and compatibility handshake`
- Verification tuple (mandatory):
  - archived_body_lines=57
  - retained_body_lines=629

---

## Discovery handoff — US-0134 Existing kernel bridge and compatibility handshake

- **Phase completed**: discovery. **Role**: po. **Story**: US-0134 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T12:28:00Z. **Fresh marker**: `po-US0134-discovery-20260912T122800Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-us0134`, parent=`auto-20260912-us0133`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken).
- **Sibling boundary**: **US-0135..US-0148** OPEN — OUT OF SCOPE this segment. **US-0133** DONE — compose locate-path only; do not reopen. **BUG-0018** DONE — do not reopen.
- **Gap confirmed (narrow-read)**: US-0133 shipped `standalone/` + AgentKernel; KernelBridge is still unimplemented. Kit Python validators remain the SOT (US-0125 host path is parallel, not a substitute). Observed kit marker `its_magic/.its-magic-version` = `0.1.3-9` — not yet a declared runtime→kernel range. Extraction of `its-magic-kernel/` is out of v1 (story Boundaries / §16.4).

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Host-neutral TypeScript `KernelBridge` lives in `standalone/` (compose US-0133 A1 / DEC-0133 / R-0121). Locate via parent walk from cwd / `standalone/` to the kit or installed project root that contains shipped Python validators and the canonical artifact tree. Do **not** extract `its-magic-kernel/` in v1. |
| **D2** | Python validators remain authoritative (masterplan R6, §16.1, AC-4). The bridge invokes named validators; it does not reimplement their semantics in TypeScript. |
| **D3** | KernelBridge API matches §16.1: `locateProjectKernel()`, `getKernelVersion()`, `runValidator(name, args)`, `readContractManifest()`, `resolveArtifactPaths()`, `runUatPlanner()`, `runStatusReconcile()`. |
| **D4** | Compatibility is an explicit runtime → supported kernel **contract range** (§16.3 / AC-2). Never infer from filenames. Observed marker `its_magic/.its-magic-version` (`0.1.3-9`) is a candidate, not a locked manifest — DQ2/DQ3. |
| **D5** | Fail closed with exactly `KERNEL_NOT_FOUND`, `KERNEL_VERSION_UNSUPPORTED`, `KERNEL_VALIDATOR_MISSING`, `KERNEL_CONTRACT_MISMATCH` (§16.2 / AC-3). No silent degrade. |
| **D6** | Repo artifacts remain canonical project memory (§2.1, §27.1, R5, AC-5). Pi session history and any later SQLite operational store (§27.2) are not substitutes. US-0134 does not introduce SQLite and must not relocate lifecycle state. |
| **D7** | Validator PASS advances the caller; FAIL or crash blocks with captured reason code and evidence (§35 Kernel/gates, AC-4). |
| **D8** | Contract tests (AC-6 / §36 kernel contract tests) run actual Python validators against fixtures; prove supported and unsupported kernel versions plus artifact-schema compatibility; Windows + Linux. §36 chaos items "invalid kernel version" and "validator crash" are in this story's fixtures; app/browser/full chaos farm are later stories. |
| **D9** | Out of scope: `its-magic-kernel/` extraction; US-0135 auth/models; US-0136 SessionSupervisor; US-0137 ToolBroker/PolicyEngine; US-0138 typed config; US-0140 lifecycle orchestration (later consumer); US-0133 Pi kernel (DONE — compose only); BUG-0018. Compose US-0125 OpenCode Python-validator bridge as a parallel host path — do not replace it. |
| **D10** | Research questions DQ1–DQ10 below → `/research` authors **R-0122** (next after R-0121; do not wipe R-0120/R-0121). |

### Research questions DQ1–DQ10 (for `/research` → expect **R-0122**)

1. **DQ1**: Locate algorithm — markers for in-tree kit-dev vs installed consumer project; walk from `standalone/` vs process cwd vs explicit `--kernel-root`.
2. **DQ2**: Contract version/manifest source of truth — reuse `its_magic/.its-magic-version` vs a new `readContractManifest()` schema and fields.
3. **DQ3**: Runtime→kernel range encoding — where declared (standalone package, dedicated manifest; typed config is US-0138); how kit prerelease `0.1.3-9` maps to a range.
4. **DQ4**: Named validator inventory for v1 `runValidator` — which shipped Python CLIs are in this story vs later phases.
5. **DQ5**: Process invocation — Python interpreter discovery on Windows/Linux; cwd; timeout; stdout/stderr capture; mapping existing validator exit contracts to KERNEL_* vs captured reason codes.
6. **DQ6**: `resolveArtifactPaths()` canonical map from §2.1 (vision/backlog/acceptance/architecture/decisions/research/state/DEC/sprints/handoffs/release/traceability/work-packs/sovereign).
7. **DQ7**: `runUatPlanner` / `runStatusReconcile` — existing script names; v1 required vs thin named-validator wrappers.
8. **DQ8**: Test strategy — in-tree version stubs vs fixture repos; kit `test_us0134_*` vs `standalone/tests/contract`; CI Windows+Linux; no paid calls.
9. **DQ9**: Distinguishing `KERNEL_VERSION_UNSUPPORTED` (range miss) vs `KERNEL_CONTRACT_MISMATCH` (in-range schema/artifact mismatch).
10. **DQ10**: Compose with US-0125 (OpenCode thin-command validator bridge) and US-0133 locate-path without amending those contracts.

### Design refs

- `docs/product/standalone-its-magic-pi-masterplan.md` sections 2, 16, 27, 35 Kernel/gates, 36 kernel contract tests
- Compose sibling: `docs/engineering/architecture.md` `# US-0133` (locate documented as parent walk; KernelBridge not implemented)
- Compose sibling: US-0125 Python validators remain fail-closed SOT for the OpenCode host
- Intake (read-only): `handoffs/intake_evidence/US-0133-0148-intake-20260911.json`

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-us0134-discovery-po-20260912T122800Z-US-0134`
- `proof_hash=2BA8441A2DCC0FB1E559A373160115B7DA44ACFA56A939761B65EFF3B98B3DE2`
- `proof_ttl=2026-09-12T13:28:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"spec","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0134","phase_id":"discovery","proof_issued_at":"2026-09-12T12:28:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260912-us0134-discovery-po-20260912T122800Z-US-0134","sprint_id":"none","story_id":"US-0134"}`

### Isolation + stop

- `phase_id=discovery`, `role=po`, `story_id=US-0134`, `model_id=cursor-grok-4.6`, `fresh_context_marker=po-US0134-discovery-20260912T122800Z-fresh`
- `evidence_ref=docs/product/backlog.md ## US-0134 discovery_notes; docs/product/acceptance.md US-0134 row (unchecked); handoffs/intake_evidence/US-0133-0148-intake-20260911.json; docs/engineering/state.md discovery checkpoint; handoffs/resume_brief.md`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Packs: `docs/engineering/state-archive/state-pack-20260912-aj.md`; `handoffs/archive/po-to-tl-pack-20260912-e.md`.
- **Status**: US-0134 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

