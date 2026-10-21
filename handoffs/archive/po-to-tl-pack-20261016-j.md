# PO to TL archive pack (2026-10-16)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `## Discovery handoff — BUG-0028 `itsm` read-only cold start`
- Last archived heading: `## Discovery handoff — BUG-0028 `itsm` read-only cold start`
- Verification tuple (mandatory):
  - archived_body_lines=11
  - retained_body_lines=642

---

## Discovery handoff — BUG-0028 `itsm` read-only cold start

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0028 only. **Sprint**: (none — do not create). **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-13T20:12:18Z. **Fresh marker**: `po-BUG0028-discovery-20261013T201218Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20261013-bug0028`, `delivery_mode=ultra_lean`, `invocation_mode=auto`, `resolution_source=argument`, `resolved_start_phase=discovery`. Intake already persisted (`handoffs/intake_evidence/standalone-cli-ux-intake-20260923T213043Z.json`, read-only). Do not continue the US-0155 refresh pair.
- **Problem lock**: Help, auth, and models pay for a full RuntimeHost before argv dispatch. Status pays for a recursive repository walk and an unused workflow engine. Confirmed: `bin/itsm.js` spawnSyncs `standalone/apps/cli/src/index.ts`; that file calls `createRuntimeHost` before `runCliArgv`. `createRuntimeHost` admits the Pi kernel, `createCodeIntelligenceProvider` (`walkDocs` reads supported project text), ToolBroker, and `.its-magic/runtime/ops.sqlite`. Help and auth/models run only after that. Status calls `resolveOperatorTransport` (`daemon.ping` or `createWorkflowEngine`) and then builds a snapshot.
- **Locks**: **D1** `itsm`, help, auth, and models finish before RuntimeHost, the Pi kernel, code intelligence, ToolBroker, or SQLite (AC-1). **D2** status is bounded read-only: no recursive project scan and no unused workflow session (AC-2). **D3** workflow commands keep production admission and deterministic unavailable-service errors (AC-3). **D4** tests prove those four paths do not construct code intelligence or scan project files; installed entrypoints cover Windows and Linux (AC-4). **D5** operator docs separate lightweight inspection/auth commands from full-runtime commands (AC-5). **D6** distinct from BUG-0029. **D7** compose US-0150, US-0151, and US-0155 (DONE); do not reopen. **D8** do not merge or mutate BUG-0026, US-0154, or US-0156. **D9** the `bin/itsm.js` locator, Node check, and spawn may stay. **D10** no companion DEC expected.
- **Research questions** (tech-lead authors the next free heading after delivered **R-0165**; expected **R-0166**; do not wipe R-0165; PO does not author the body): **DQ1** argv split versus dynamic import so static ESM loads of runtime-host and `@its-magic/pi-kernel` do not construct the kernel. **DQ2** minimum status reads without `walkDocs` and without `createWorkflowEngine`. **DQ3** whether `isDaemonReachable` / `daemon.ping` stays on status. **DQ4** auth/models local-store boundary versus the Pi auth adapter import. **DQ5** contract seam plus Windows and Linux installed `bin/itsm.js` checks; 10-20 seconds is the symptom, not a locked SLA. **DQ6** which operator doc satisfies AC-5. **DQ7** which commands must still call `createRuntimeHost`. **DQ8** confirm the shim spawn is not the scan owner. **DQ9** a lazy host for admitted commands must still be the US-0150 production host. **DQ10** companion DEC stays none unless a contract cannot live under `# BUG-0028`. Viable options for research: (1) dispatch argv first and dynamically import the host only for admitted commands, with a narrow status reader — recommended direction; (2) separate binaries per command class — heavier; (3) cache the repository walk inside the full host — does not meet AC-1.
- **Non-goals**: no CLI implementation, no sprint, no architecture, no DEC, no npm publish, no git commit, no git push, no `.env` read, no mutation of BUG-0026, BUG-0029, US-0150, US-0151, US-0154, US-0155, or US-0156. **Early research note** (not an R- entry): Node ESM evaluates top-level imports before the module body, so deferring the `createRuntimeHost` call is not enough while those modules stay static imports.
- **Proof**: `rp-auto-20261013-bug0028-discovery-po-20261013T201218Z-BUG-0028` / `f813df4d8936c8eb4ba977d97f6f84310a916d06f5c56fef474df6ec4842f597`; issued 2026-10-13T20:12:18Z; `proof_ttl_seconds=3600`; ttl 2026-10-13T21:12:18Z; `hash_recompute_confirmation=true`.
- **Status**: BUG-0028 remains **OPEN**. AC-1..AC-5 remain unchecked. Acceptance row stays `[ ]`. **Next**: `/research` in a fresh **tech-lead** context. This PO child does not spawn it. STOP.

