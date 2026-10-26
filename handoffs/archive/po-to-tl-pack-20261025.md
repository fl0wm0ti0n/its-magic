# PO to TL archive pack (2026-10-25)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 26
- First archived heading: `## Bug-intake handoff — BUG-0040..BUG-0043 (four defects persisted, `/intake bug`)`
- Last archived heading: `## Bug-intake handoff — BUG-0040..BUG-0043 (four defects persisted, `/intake bug`)`
- Verification tuple (mandatory):
  - archived_body_lines=12
  - retained_body_lines=645

---

## Bug-intake handoff — BUG-0040..BUG-0043 (four defects persisted, `/intake bug`)

- **Phase completed**: intake. **Role**: po. **Work item**: BUG-0040, BUG-0041, BUG-0042, BUG-0043 (all `INTAKE_WORK_ITEM_KIND=bug`). **Sprint**: (none — do not create). **Verdict**: PASS (`decision_gate=false`). **Timestamp (UTC)**: 2026-10-25T14:00:00Z. **Intake boundary**: `2026-10-25T14:00:00Z`.
- **Split decision (operator)**: the four orchestration error classes observed after the last `/auto` runs are persisted as **4 separate bugs** — BUG-0040 = fresh `/auto` start segment-bootstrap gap (Writer/Verifier-asymmetry class, fail-closed without autonomous repair); BUG-0041 = DEC-0069 bug writer emits breadcrumb-only pointer, no strict proof tuple (same class, writer surface); BUG-0042 = PO-spec `ultra_lean` fires `RUNTIME_PROOF_MISSING` because spec phases carry no proof section (parent never mints, DEC-0153; stays security_hard, outside repair class); BUG-0043 = fresh install omits the critical sovereign-frame scripts (`CROSS_MODEL_REVIEW=1` → `CROSS_MODEL_CRITIC_SPAWN_FAILED`; installer-completeness line BUG-0001/BUG-0003, **not** a Writer/Verifier asymmetry).
- **BUG-0043 scope (operator)**: "Kritischer Sovereign-Frame" — the `sovereign_*` family plus scripts referenced by installed commands. The 44/81-script audit (26 with template mirror, 18 without) is **discovery material, not a hard AC list**. Root cause evidence: `docs/engineering/context/installer-owned-paths.manifest` omits the `sovereign_*` family from `install_include_paths`/`required_install_script_paths`; live install artifact `tests/.tmp-debug-install/scripts/` = 25/81 py files; `installer.py:135` copies only `install_include_paths`; `validate_install_completeness` (L200) checks only `required_install_script_paths`; `tests/installer_completeness_bug0003_test.py` enforces only required⊆install + active==template (blind spot).
- **Intake evidence (small-intake-pack, 5 topics each, all "empfohlen")**: `handoffs/intake_evidence/BUG-0040-intake-20261025T140000Z.json`, `BUG-0041-intake-20261025T140000Z.json`, `BUG-0042-intake-20261025T140000Z.json`, `BUG-0043-intake-20261025T140000Z.json` — each `[INTAKE_EVIDENCE_VALIDATION_OK]`; per-topic `answer_ref` quotes are distinct (BUG-0007 anti-echo); `decomposition_verdict=single_bug` per bug.
- **Validation gates (this intake, all PASS)**: `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → `[BUG_VALIDATION_OK]`; `python scripts/intake_bug_routing_guard.py --kind bug --file <prose>` → `[INTAKE_BUG_ROUTING_OK] kind=bug` (and `--kind story` correctly fails `INTAKE_BUG_ROUTING_REQUIRED`, proving defect-shape routing); all four `intake_evidence_validate.py --file` → `[INTAKE_EVIDENCE_VALIDATION_OK]`.
- **Persistence**: four `### BUG-004x` blocks appended under `## Bug issues (canonical)` in `docs/product/backlog.md` (after BUG-0039, before `## US-0150`); four unchecked rows appended under `## Bug acceptance (canonical)` in `docs/product/acceptance.md` (after BUG-0039). All four `Status: OPEN`, AC-1..AC-5 unchecked.
- **Constraints locked (all packs, "empfohlen")**: `RESUME_BRIEF_AUTO_REFRESH=0` absolute (BUG-0040/0041); `RUNTIME_PROOF_MISSING` stays security_hard with TTL-expiry-only repair (BUG-0042); no parent proof-minting (DEC-0153; BUG-0040/0042); US-0164 story boundary — story intake does **not** refresh `handoffs/resume_brief.md` (BUG-0041); active+template manifest byte parity (BUG-0043); OpenCode plugin spawn path is a **separate defect class**, not reopened here (BUG-0043); fail-closed default preserved everywhere; `CROSS_MODEL_REVIEW` scratchpad value (0) untouched.
- **Not reopened / not mutated**: BUG-0001, BUG-0003, BUG-0005, BUG-0026 (referenced as related only); US-0164 boundary clause; `.opencode/plugins/orchestrator.ts` `spawnSovereignCriticHook` (L575) — its `PLUGIN_SPAWN_UNSUPPORTED`/`SUBTASK_IGNORED` path is distinct from `scripts/sovereign_critic_lib.py:121` `CROSS_MODEL_CRITIC_SPAWN_FAILED`.
- **Status**: BUG-0040..BUG-0043 remain **OPEN**. **Next**: `/discovery` in a fresh PO context per bug (order per operator priority: BUG-0043 P0 first, then BUG-0040/BUG-0041 P1, then BUG-0042 P2). This PO child does not spawn discovery. STOP.

