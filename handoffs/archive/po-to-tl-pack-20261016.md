# PO to TL archive pack (2026-10-16)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `## Intake handoff — US-0162 token optimization and host-neutral model routing v2`
- Last archived heading: `## Intake handoff — US-0162 token optimization and host-neutral model routing v2`
- Verification tuple (mandatory):
  - archived_body_lines=10
  - retained_body_lines=641

---

## Intake handoff — US-0162 token optimization and host-neutral model routing v2

- **Phase completed**: intake. **Role**: po. **Story**: US-0162 only. **Verdict**: persisted. **Timestamp (UTC)**: 2026-10-16T15:28:44Z. **writer_id**: `po-cursor-20261016-tokenopt`. **intake_run_id**: `ir-20261016T152844Z-us0162`. **Mode**: `INTAKE_GUIDED_MODE=0`, story kind, `WORK_KIND_ROUTING=0`, `ID_NAMESPACE_BOOTSTRAP=0`, `EARLY_RESEARCH=0`, `selected_pack=first-intake-pack`, `missing_topics` none, `assumptions_confirmed=(none)`, `decision_gate=false`. Highest US before write: US-0161. Evidence: `[INTAKE_EVIDENCE_VALIDATION_OK]`. Routing prose: `[INTAKE_BUG_ROUTING_OK] kind=story exit=0`. No BUG id. No `R-` entry. Status OPEN. `user_visible: true`. Priority P0.
- **Scope**: Fewer input tokens via phase context packs and slimmer memory, plus its-magic-owned per-role, per-phase, and per-task model routing across providers. Pack first, then targeted read, then bounded expansion, with the stated budgets. Large memory docs are sharded. Machine evidence stays out of prompts. Always-on rules shrink without dropping non-suppressible gates. Handoffs become deltas. Memory audit is deterministic first. Reads are deduplicated. Routing is host-neutral. `TOKEN_PROFILE` and the model profile stay separate axes. Existing quality, QA, UAT, release, isolation, and strict-proof gates stay.
- **Neighbor boundary**: Do not reopen or retick US-0053, US-0072, US-0080, US-0089, US-0090, US-0096, US-0123, US-0132, or US-0135. They stay DONE. US-0089 and US-0090 remain caveman voice and optional file compression. US-0123 and US-0132 remain host catalogs. US-0135 remains standalone auth and Pi routing. This story is the v2 delta. Do not weaken US-0048, US-0056, US-0069, or US-0039. Do not delete safety gates to save tokens. Do not silently replace `TOKEN_PROFILE`. No secrets in repo configuration.
- **Plan coverage**: `phase-context-packs`, `memory-doc-sharding`, `machine-evidence-split`, `always-on-rule-kernel`, `delta-handoffs`, `deterministic-memory-audit`, `read-deduplication`, `host-neutral-model-routing`, `provider-abstraction`, `complexity-router`, `routing-fallbacks`, `routing-observability`, `token-model-axis-separation`, `quality-gate-preservation`, each mapped to US-0162, `coverage_complete=true`. Delegated topics: language_framework_runtime (high), ui_design_expectations (high). No new language. No new screen. No date. Existing `MODEL_*` settings stay as compatibility adapters.
- **Evidence**: `handoffs/intake_evidence/US-0162-intake-20261016T152844Z.json`. Routing prose: `handoffs/intake_evidence/US-0162-routing-prose.txt`.
- **Vision**: not touched. No token or model section heading was a safe anchor. `## Discovery Notes — US-0053` stays historical for that closed story.
- **Next**: `/discovery` in a fresh PO context. This PO child does not spawn it. STOP.

