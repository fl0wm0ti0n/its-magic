# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 14
- First archived heading: `## Architecture handoff — US-0134 Existing kernel bridge and compatibility handshake`
- Last archived heading: `## Intake handoff — BUG-0019 OpenCode `/auto` missing from slash list after plugin-only ownership`
- Verification tuple (mandatory):
  - archived_body_lines=52
  - retained_body_lines=634

---

## Architecture handoff — US-0134 Existing kernel bridge and compatibility handshake

- **Phase completed**: architecture. **Role**: tech-lead. **Story**: US-0134 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T12:45:00Z. **Fresh marker**: `tl-US0134-architecture-20260912T124500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260912-us0134`, parent=`auto-20260912-us0133`, `delivery_mode=ultra_lean`, macro=`plan` (architecture = second of research+architecture+sprint-plan).
- **Sibling boundary**: **US-0135..US-0148** OPEN — OUT OF SCOPE. **US-0133** DONE — compose locate-path only; not reopened. **BUG-0018** DONE — do not reopen.
- **Architecture anchor**: `docs/engineering/architecture.md` **`# US-0134`**
- **Companion DEC**: `decisions/DEC-0134.md` (**Accepted**)
- **Research anchor**: `docs/engineering/research.md` **`## R-0122`** (DQ1–DQ10 LOCKED)

### Approach A1 LOCKED

`standalone/packages/kernel-bridge` (no Pi). Three-marker parent walk + `--kernel-root`. DEC-0045 version + `its_magic/kernel-contract.json`. Runtime range JSON + `semver@7.8.5` `includePrerelease` so kit `0.1.3-9` is in-range. Spawn real Python validators. Four `KERNEL_*` handshake codes. Thin uat/status wrappers (`status_reconcile_validate.py` read-only). 10 `test_us0134_*` on Windows+Linux. Reject A2 extract, A3 TS rewrite, A4 filename inference, A5 OpenCode-plugin reuse. Seeds **T-anch + T-001..T-009** (10 ≤ SPRINT_MAX_TASKS=12).

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260912-us0134-architecture-techlead-20260912T124500Z-US-0134`
- `proof_hash=D7686414BA2C17E2053CD7DA5279B56F6B56F9D814CCD46D021A12A870CE2704`
- `proof_ttl=2026-09-12T13:45:00Z`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0134","phase_id":"architecture","proof_issued_at":"2026-09-12T12:45:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-us0134-architecture-techlead-20260912T124500Z-US-0134","sprint_id":"none","story_id":"US-0134"}`
- Consumed research proof: `rp-auto-20260912-us0134-research-techlead-20260912T123500Z-US-0134` / `5C25F84CEC351C1C21FB84DB65A8CAC8071F5598DDDFBF774226935C9FD30927` — RUNTIME_PROOF_VALID (MATCH before TTL)

### Isolation + stop

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0134`, `model_id=cursor-grok-4.6`, `fresh_context_marker=tl-US0134-architecture-20260912T124500Z-fresh`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section.
- **Status**: US-0134 remains **OPEN**. **Next**: `/sprint-plan` in fresh **tech-lead** subagent (orchestrator may insert sovereign-critic of architecture first). Do not spawn sprint-plan from this architecture chat. STOP.

---

## Intake handoff — BUG-0019 OpenCode `/auto` missing from slash list after plugin-only ownership

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0019. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-12T17:26:00Z. **Fresh marker**: `po-BUG0019-intake-20260912T172600Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260912-BUG0019-intake`, `intake_run_id=cursor-20260912-BUG0019-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `INTAKE_SUBAGENT_FALLBACK=deny`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0019** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0019-intake-20260912.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]`
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — `[BUG_VALIDATION_OK]`
  - `python scripts/intake_bug_resume_brief_refresh.py --bug-id BUG-0019 --validate-file` — `[INTAKE_RESUME_BRIEF_VALIDATE_OK]`; `intended_resume_phase=discovery`; `resolved_start_phase=discovery`; `resolution_source=resume_brief`; `bug_id=BUG-0019`. In-place `--resume-brief` upsert skipped: 27 historical `## Latest orchestration pointer*` headings would be clobbered; canonical DEC-0069 block prepended via `build_latest_pointer_markdown` (US-0134 pause history retained).
- **Research**: **R-0123** (`docs/engineering/research.md`) — intake-time web + Context7 on markdown-only discovery vs plugin `editor.add`; compose **R-0120** R1 / architecture `# BUG-0018` NB1 now live-falsified. Do not wipe R-0120/R-0121/R-0122.
- **Operator ask**: `/intake bug` — working `/auto` command in OpenCode. Chat: "nun seh ich den auto befehl garnichtmehr im opencode... andere befehel existieren"; screenshot typed `/auto` with no match; "ich kann /auto nicht mehr verwenden in opencode... aber es ging ja beim fix genau darum, dass ich auto benötige"; "sieh den chat.. ioch brauche einen funktionierenden auto befehl in opencode".
- **Root cause (intake)**: BUG-0018 A* removed colliding `.opencode/commands/auto.md` so plugin execute could own `/auto`. OpenCode TUI lists markdown (and JSON) commands; plugin-only `editor.add({ name: "auto", execute })` does not appear in the slash palette. Operator cannot invoke `/auto`. Peers still listed.
- **Duplicate check**: Persist **NEW BUG-0019**. Do **not** reopen BUG-0018 DONE (collision/STOP fix still correct). Not BUG-0017 DONE (peers exist). Not BUG-0015 DONE (attach present). Not BUG-0016 DONE. Do not drain US-0135. Do not mutate US-0133..US-0148.
- **Decomposition**: **single_bug** — one operator outcome (OpenCode `/auto` invokable + lifecycle), one residual of BUG-0018 A* listing. Do not split Cursor vs OpenCode. Do not persist a second bug for US-0135. Cursor `.cursor/commands/auto.md` out of scope except do not prune. `.opencode/agents/auto.md` — do not prune.
- **Alternatives**: (1) persist BUG-0019; discovery/research restore invokable `/auto` in OpenCode TUI/picker AND plugin `execute` → `runAutoLifecycle` (or documented `OPENCODE_*`) without restoring markdown-wins STOP-only `auto.md` — **recommended** (candidates: JSON `commands.auto` if it shares the picker without owning execute; non-colliding markdown if research finds a path; different plugin/TUI registration; live listing probe — architecture picks winner); (2) restore STOP-only `.opencode/commands/auto.md` — **reject** (recreates BUG-0018); (3) reopen BUG-0018 — **reject**; (4) tell operator to type a hidden plugin command — **reject**.
- **Scope for `/discovery`**: lock listing + execute ownership so `/auto` is selectable in OpenCode **and** plugin lifecycle runs (or documented `OPENCODE_*`). Do not restore STOP-only `auto.md`. Do not reopen BUG-0018. Do not touch Cursor `auto.md`.
- **Risks**: R1 — TUI may list only markdown+JSON (R-0123; live screenshot); R2 — JSON `commands.auto` `template` may recreate same-name collision vs plugin `execute`; R3 — `command.list()` may include plugin commands while TUI does not consume it; R4 — live OpenCode listing probe still absent from CI.
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0019`; `fresh_context_marker=po-BUG0019-intake-20260912T172600Z-fresh`; `timestamp=2026-09-12T17:26:00Z`; `model_id=cursor-grok-4.6`; `evidence_ref=docs/product/backlog.md ### BUG-0019, docs/product/acceptance.md BUG-0019 row, handoffs/intake_evidence/BUG-0019-intake-20260912.json, docs/engineering/research.md ## R-0123, this handoff`.
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section (same policy as BUG-0018 intake). Post-append `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1242/1200 (pre-existing; intake did not append `state.md`) → `--rollover` `rollover_complete units=1` → `docs/engineering/state-archive/state-pack-20260912-au.md`; `po_to_tl` under cap (no po rollover); final `--check` PASS.
- **Status**: OPEN per US-0045. **Next**: `/discovery` (fresh **po**) for **BUG-0019**, or `/auto bug-target=BUG-0019`. Do not run discovery/architecture/execute from this intake chat. STOP.

