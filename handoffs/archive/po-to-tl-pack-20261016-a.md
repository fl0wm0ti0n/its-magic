# PO to TL archive pack (2026-10-16)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 27
- First archived heading: `## Discovery handoff — BUG-0029 `itsm auth login` false configuration success`
- Last archived heading: `## Discovery handoff — BUG-0029 `itsm auth login` false configuration success`
- Verification tuple (mandatory):
  - archived_body_lines=11
  - retained_body_lines=650

---

## Discovery handoff — BUG-0029 `itsm auth login` false configuration success

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0029 only. **Sprint**: (none — do not create). **Verdict**: DISCOVERY_PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-15T22:48:27Z. **Fresh marker**: `po-BUG0029-discovery-20261015T224827Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20261016-bug0029`, `delivery_mode=ultra_lean`, `resolved_phase_plan=[spec, plan, build+verify, ship]`, `reinstatement_mode=none`, `memory_layer=pack`, `invocation_mode=auto`, `resolution_source=scratchpad`, `resolved_start_phase=discovery`. Intake already persisted (`handoffs/intake_evidence/standalone-cli-ux-intake-20260923T213043Z.json`, read-only). This child does not continue BUG-0026 (`release_blocked_RELEASE_TEST_FAILED`). Queue position 2, remaining 0.
- **Gap**: Live `itsm auth` is classified local and `runLocalCommand` calls `dispatchItsmCommand` with no `io.prompt`. Login prints the prompt message, returns `undefined` for a secret, then always writes `{"auth":"configured"}` and exits 0. No `--api-key-stdin` exists. Success is not preceded by runtime `checkAuth`.
- **Locks**: **D1** masked interactive TTY secret, no echo, no log, no argv (AC-1). **D2** documented `--api-key-stdin` reads one stdin secret; non-TTY interactive login without that flag fails closed (AC-2). **D3** cancel, empty, invalid, or persistence failure exits non-zero, redacted, and never emits configured (AC-3). **D4** configured success only after runtime verification; list, logout, and Pi migration stay as they are (AC-4). **D5** Windows and Linux tests for masked TTY, stdin, cancel, redaction, false success, and no secret outside the owned auth store (AC-5). **D6** no secret in argv; do not add `--api-key <value>`. **D7** redact diagnostics; do not echo the prompt result. **D8** do not merge BUG-0028 or BUG-0026; do not reopen US-0150, US-0151, US-0154, US-0155, or US-0156. **D9** no companion DEC; no sprint; tech-lead authors expected **R-0168** (do not wipe **R-0167**). **D10** status stays OPEN; AC-1..AC-5 stay unchecked.
- **Research questions** (tech-lead authors expected **R-0168**; PO does not author the body): **DQ1** Pi `secret` prompt and `ModelRuntime.login` when the callback returns undefined. **DQ2** masked TTY read on Windows and Linux. **DQ3** one-line `--api-key-stdin` contract. **DQ4** non-TTY diagnostic without the flag. **DQ5** what stored-credential verification counts as success. **DQ6** cancel/empty/invalid/persistence tokens. **DQ7** redaction beyond `sk-` and `Bearer`. **DQ8** list, logout, and migrate stay unchanged. **DQ9** contract-test placement. **DQ10** companion DEC stays none. Viable options: (1) masked TTY prompt plus `--api-key-stdin` plus verify-before-success — locked recommendation; (2) stdin-only — rejected, AC-1 requires a TTY; (3) argv `--api-key` — rejected, secret must not be in argv.
- **Non-goals**: no implementation, no sprint, no architecture, no DEC, no new `R-` body, no sovereign critic (`CROSS_MODEL_REVIEW=0`), no npm publish, no git commit, no git push, no `.env` read, no mutation of BUG-0026, BUG-0028, US-0150, US-0151, US-0154, US-0155, or US-0156.
- **Proof**: `rp-auto-20261016-bug0029-discovery-po-20261015T224827Z-BUG-0029` / `236e4675845879983d94898c6efd1bf1a52ff13870578869ed205106ce341f97`; issued 2026-10-15T22:48:27Z; `proof_ttl_seconds=3600`; ttl 2026-10-15T23:48:27Z; `hash_recompute_confirmation=true`.
- **Status**: BUG-0029 remains **OPEN**. AC-1..AC-5 remain `[ ]`. **Next**: `/research` in a fresh **tech-lead** context. This PO child does not spawn it. STOP.

