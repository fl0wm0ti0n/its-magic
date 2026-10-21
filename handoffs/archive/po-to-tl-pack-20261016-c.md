# PO to TL archive pack (2026-10-16)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 27
- First archived heading: `## Intake handoff — US-0161 cross-host maximum autonomy`
- Last archived heading: `## Intake handoff — US-0161 cross-host maximum autonomy`
- Verification tuple (mandatory):
  - archived_body_lines=10
  - retained_body_lines=647

---

## Intake handoff — US-0161 cross-host maximum autonomy

- **Phase completed**: intake. **Role**: po. **Story**: US-0161 only. **Verdict**: persisted. **Timestamp (UTC)**: 2026-10-15T21:30:41Z. **writer_id**: `po-cursor-20261015-us0161`. **intake_run_id**: `ir-20261015T213041Z-us0161`. **Mode**: `INTAKE_GUIDED_MODE=0`, story kind, `WORK_KIND_ROUTING=0`, `ID_NAMESPACE_BOOTSTRAP=0`, `EARLY_RESEARCH=0`, `selected_pack=first-intake-pack`, `missing_topics` none, `assumptions_confirmed=(none)`, `decision_gate=false`. Highest US before write: US-0160. Evidence: `[INTAKE_EVIDENCE_VALIDATION_OK]`. Routing prose: `[INTAKE_BUG_ROUTING_OK] kind=story exit=0`. No BUG id. No `R-` entry. Status OPEN. `user_visible: true`.
- **Scope**: Check and shape the whole its-magic concept on Cursor, Pi, and OpenCode so maximum autonomy is possible. Clear phase sequences stay. A blocker caused by an error, a fault in the its-magic flow, or missing workflow rights is not possible, or the agent resolves it and continues. A result that does not match the expected outcome does not block the sequence. Quote 4 as typed: "es sollen klare abfolgen sein, aber nicht blocken wenn etwa snicht den ewrwartungen entspricht". Corrected reading: expectation mismatch must not block.
- **US-0160 boundary**: Do not reopen US-0160. It remains the OpenCode plus itsm TUI symptom slice (recoverable blocker, error, abort, permission, and faulty-state continue; latest diagnostic once; ask result visible). US-0161 owns the cross-host policy, including Cursor and Pi, and the expectation-mismatch rule. US-0158 stays the phase-child continuation-pair repair and is not a duplicate. US-0092, US-0095, and US-0156 stay DONE.
- **US-0092 AC-10 risk**: Reading `.env` and automatic npm publish or git push stay non-goals on US-0092 AC-10 and are not widened by this story. Recorded as a discovery risk, `decision_gate=false`. `UNKNOWN_COMMAND` for free text and `APP_HEALTH_UNAVAILABLE` when no app process is running stay honest results and are not expectation-mismatch repairs. Do not weaken spawn-only orchestration (BUG-0006).
- **Plan coverage**: `cross-host-autonomy`, `recoverable-flow-errors`, `permission-stop-recovery`, `expectation-mismatch-continue`, each mapped to US-0161, `coverage_complete=true`. Delegated topics: security_compliance (medium), language_framework_runtime (high), ui_design_expectations (medium), scope_timeline (high). No new client, no new language, no date.
- **Evidence**: `handoffs/intake_evidence/US-0161-intake-20261015T213041Z.json`. Routing prose: `handoffs/intake_evidence/US-0161-routing-prose.txt`.
- **Next**: `/discovery` in a fresh PO context. This PO child does not spawn it. STOP.

