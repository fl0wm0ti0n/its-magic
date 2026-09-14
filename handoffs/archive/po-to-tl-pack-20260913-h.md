# PO to TL archive pack (2026-09-13)

- Rollover trigger: `PO_TO_TL_HOT_MAX_LINES=650, PO_TO_TL_HOT_MAX_SECTIONS=60`
- Source: `handoffs/po_to_tl.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 12
- First archived heading: `## Intake handoff — BUG-0020 OpenCode still has no invokable auto mode after BUG-0019 TUI keymap`
- Last archived heading: `## Discovery handoff — BUG-0020 OpenCode still has no invokable auto mode after BUG-0019 TUI keymap`
- Verification tuple (mandatory):
  - archived_body_lines=72
  - retained_body_lines=607

---

## Intake handoff — BUG-0020 OpenCode still has no invokable auto mode after BUG-0019 TUI keymap

- **Phase completed**: intake (`/intake bug`). **Role**: po. **Bug**: BUG-0020. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp**: 2026-09-12T22:35:00Z. **Fresh marker**: `po-BUG0020-intake-20260912T223500Z-fresh`.
- **Writer**: `writer_id=po-cursor-20260913-BUG0020-intake`, `intake_run_id=cursor-20260913-BUG0020-intake`.
- **Routing**: argv `/intake bug` wins over scratchpad `INTAKE_WORK_ITEM_KIND=story`. `selected_pack=small-intake-pack`. `INTAKE_GUIDED_MODE=1`. `WORK_KIND_ROUTING=0` (classifier skipped). `INTAKE_SUBAGENT_FALLBACK=deny`. Next id confirmed `python scripts/bug_issue_validate.py --print-next-id` → **BUG-0020** before write.
- **Evidence**:
  - `handoffs/intake_evidence/BUG-0020-intake-20260913.json` — `[INTAKE_EVIDENCE_VALIDATION_OK]` (pre-write and post-write)
  - `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` — `[BUG_VALIDATION_OK]`
  - `python scripts/intake_bug_resume_brief_refresh.py --bug-id BUG-0020 --validate-file` — `[INTAKE_RESUME_BRIEF_VALIDATE_OK]`; `intended_resume_phase=discovery`; `resolved_start_phase=discovery`; `resolution_source=resume_brief`; `bug_id=BUG-0020`. In-place `--resume-brief` upsert skipped: 38 historical `## Latest orchestration pointer*` headings would be clobbered; canonical DEC-0069 block prepended via `build_latest_pointer_markdown` (BUG-0019 history retained).
- **Research**: **R-0125** (`docs/engineering/research.md`) — intake-time web: Command.Info `/` list ≠ plugin execute ≠ TUI keymap; `tui.json` listing vs directory discovery contradiction; no list-without-template Command.Info. Compose **R-0124** (E* delivered; live-falsified as the operator picker). Do not wipe R-0120..R-0124.
- **Operator ask**: working auto mode on OpenCode comparable to Cursor `/auto`. Quotes (typos preserved): "ich hab imme rnoch kein auto befehl in opencode, in diesem repo"; "du hast jetzt schon so oft versucht das thema zu lösen.. warum ist es imme rnoch fehlerhaft? eventuell musst du tiefer suchen auch in den docs von opencode"; "i just want that the auto function is also possible in opencode .. like it is in cursor right now"; "i want to say /auto to start the auto process or in any other way.. but i need an auto mode".
- **Root cause (intake)**: BUG-0019 E* registered `/auto` on CLI TUI keymap (`its-magic-auto/tui.ts`). The operator picker that lists `/ask` is Command.Info (markdown `.md` / JSON `template`). Plugin `editor.add({execute})` does not feed that list. Kit has **no** `tui.json`/`cli.json`. Files already present in this repo. Silent missing command; no reported `OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED` in that UI.
- **Duplicate check**: Persist **NEW BUG-0020**. Do **not** reopen BUG-0019 DONE. Do **not** restore STOP-only `auto.md` (BUG-0018). Not BUG-0017/0015/0016. Do not drain US-0135. Do not mutate US-0133..US-0148.
- **Decomposition**: **single_bug** — operator already invoked `/intake bug` + `/auto` (treat as **accept**). One outcome: working OpenCode auto mode.
- **Alternatives**: (1) persist BUG-0020; lock actual UI surface; host-true listing+execute or equivalent non-slash start; tests not file-existence-only — **recommended**; (2) restore STOP-only `auto.md` — **reject**; (3) reopen BUG-0019 — **reject**; (4) Cursor-only — **reject**.
- **Scope for `/discovery`**: lock the operator-used listing surface vs CLI TUI keymap; require invokable auto (preferably `/auto`) that starts `runAutoLifecycle` or documented `OPENCODE_*`. Do not restore STOP-only `auto.md`. Do not reopen BUG-0019 ACs. Do not touch Cursor `auto.md`.
- **Risks**: R1 — desktop Command.Info never consumes TUI keymap (R-0125 high); R2 — `tui.json` listing may only affect CLI TUI, not desktop composer (medium); R3 — JSON `commands.auto`+`template` recreates BUG-0018; R4 — file-existence tests close the bug again without operator-visible `/auto`.
- **Isolation**: `phase_id=intake`; `role=po`; `bug_id=BUG-0020`; `fresh_context_marker=po-BUG0020-intake-20260912T223500Z-fresh`; `timestamp=2026-09-12T22:35:00Z`; `model_id=cursor-grok-4.6`; `evidence_ref=docs/product/backlog.md ### BUG-0020, docs/product/acceptance.md BUG-0020 row, handoffs/intake_evidence/BUG-0020-intake-20260913.json, docs/engineering/research.md ## R-0125, this handoff`.
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section (same policy as BUG-0019 intake). Post-append `python scripts/enforce-triad-hot-surface.py --rollover --json` → no units moved (under cap). `--check` exit 0 PASS. Tuple: `surface=po_to_tl path=handoffs/po_to_tl.md lines=638/800 units=16` (under cap; no pack). Intake did not append `docs/engineering/state.md`.
- **Status**: OPEN per US-0045. **Next**: `/discovery` (fresh **po**) for **BUG-0020**, or `/auto bug-target=BUG-0020`. Do not run discovery/architecture/execute from this intake chat. STOP.

## Discovery handoff — BUG-0020 OpenCode still has no invokable auto mode after BUG-0019 TUI keymap

- **Phase completed**: discovery. **Role**: po. **Bug**: BUG-0020 only. **Sprint**: (pending). **Verdict**: PASS (`decision_gate=false`).
- **Timestamp (UTC)**: 2026-09-12T22:45:00Z. **Fresh marker**: `po-BUG0020-discovery-20260912T224500Z-fresh`.
- **Orchestrator**: `orchestrator_run_id=auto-20260913-bug0020`, `parent_run=cursor-20260913-BUG0020-intake`, `delivery_mode=ultra_lean`, macro=`spec` (intake already DONE — not re-intaken), `model_id=cursor-grok-4.6`, CROSS_MODEL_REVIEW=1, AUTO_QUIET=1.
- **Sibling boundary**: BUG-0019/BUG-0018/BUG-0017/BUG-0015/BUG-0016 DONE — out of scope; do not reopen ACs / S0139. Do not mutate US-0133..US-0148; do not drain US-0135. Do not prune/touch `.cursor/commands/auto.md` or `.opencode/agents/auto.md`. Cursor `/auto` works — out of scope except do-not-touch.
- **Gap confirmed**: E* files present (`.opencode/plugins/its-magic-auto/{index.ts,tui.ts}` + template twins; `tui.ts` keymap `slash`/`slashName` `"auto"`; `orchestrator.ts` `editor.add` → `runAutoLifecycle`). **Absent**: `.opencode/commands/auto.md`, `.opencode/tui.json`, `.opencode/cli.json` (and template twins). Peer markdown commands remain. Operator desktop/GUI Command.Info picker (screenshot 2026-09-12 footer "Build · GPT-5.6 Sol OpenAI"; live `/ask` 2026-09-13) still has no `/auto`. **R-0124 E\*** “TUI keymap lists `/auto` in the operator picker” **live-falsified**. Compose **R-0125**. Do not wipe R-0120..R-0125.

### Discovery locks D1–D10

| ID | Lock |
|----|------|
| **D1** | Outcome: operator can start its-magic auto on OpenCode from the **surface they actually use** (Command.Info `/` next to `/ask`, **or** a documented equivalent they can find without hidden commands) **and** that start runs plugin `execute` → `runAutoLifecycle` **or** documented `OPENCODE_*`. Not silent missing. Not markdown STOP. |
| **D2** | Gap class: E* registered listing on the **wrong host surface** (CLI TUI keymap vs desktop Command.Info). Not missing attach (0015), not CRLF (0017), not markdown-wins STOP (0018), not “plugin name lists `/auto`” (0019 residual now live-falsified as keymap≠picker). |
| **D3** | Additive `# BUG-0020` must supersede **R-0124 E\*** “TUI keymap lists `/auto` in the operator picker”. Do not silently ignore. Do **not** reopen BUG-0019 ACs / S0139 tasks. |
| **D4** | **Forbidden**: restore STOP-only `.opencode/commands/auto.md` (or any markdown/JSON Command.Info `template` that owns `/auto` as a prompt and blocks plugin execute). Empty markdown is not sufficient (BUG-0018 D4). JSON `commands.auto`+`template` is 0018-class unless `/research` **proves** plugin execute still wins. |
| **D5** | Fix axes (research picks winner; **must live-fetch OpenCode docs/source**): (A) ship `.opencode/tui.json` listing `its-magic-auto` — only if that feeds the **desktop composer** (not CLI-only); (B) documented desktop/GUI API that lists execute-only `/auto` without `template`; (C) equivalent non-slash start **visible in the operator’s UI** that calls `runAutoLifecycle`; (D) other host-true coexistence of list+execute; (E) reject E* as listing fix for this picker and pick a new surface. |
| **D6** | Same-name JSON `template` vs plugin `execute` remains 0018-class until proven otherwise. |
| **D7** | Additive `test_bug0020_*` must **not** be “files exist / slash string present” only. Prefer live OpenCode probe **or** a contract test tied to the **operator picker** (`GET /api/command` / Command.Info / documented desktop list). Keep `test_bug0018_*` (`auto.md` absent). Do not weaken `test_bug0019_*` except compose-only if architecture replaces E*. |
| **D8** | Out of scope: Cursor `/auto`; US-0135+; reopen 0015/16/17/18/19 ACs; DEC-0124/0125 body rewrite unless research proves required (prefer additive `# BUG-0020`); host parser patch; unpublished-upgrade as the explanation for **this repo**. |
| **D9** | Done = operator can start auto on OpenCode (preferably `/auto` in their picker, or chosen equivalent) **and** lifecycle starts (or `OPENCODE_*`). Peers remain listed. |
| **D10** | Active `.opencode/` ↔ `template/.opencode/` parity for any listing/ownership/`tui.json` change; upgrade `--host opencode|both` must deliver the chosen surface. |

### Research questions DQ1–DQ8 (for `/research` → **R-0126**)

1. **DQ1**: Desktop/GUI composer slash list source — only Command.Info? Cite v2 commands + desktop vs TUI.
2. **DQ2**: Does `tui.json` listing a plugin make `/auto` appear in **desktop composer**, or only CLI TUI?
3. **DQ3**: Documented execute-only listing API for desktop?
4. **DQ4**: Equivalent non-slash visible start that still hits `runAutoLifecycle`?
5. **DQ5**: Fail-closed tokens: reuse vs new `OPENCODE_*` when the **operator picker** still cannot list/invoke while execute is registered (silent miss vs toast-only on CLI TUI).
6. **DQ6**: `test_bug0020_*` inventory + companion DEC vs additive `# BUG-0020`; no file-existence-only tests.
7. **DQ7**: Consumer upgrade path for already-E* trees (`tui.json` copy, etc.).
8. **DQ8**: Public CLI directory discovery vs internal “no directory auto-discovery / must list in tui.json” — which load path does the operator host use?

### Runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260913-bug0020-discovery-po-20260912T224500Z-BUG-0020`
- `proof_hash=935A9B7B69DBCBD3A07B4014322814A53C312D9A6A63415A0E6BCAB7FDF030F3`
- `proof_ttl=2026-09-12T23:45:00Z`
- Hash via `scripts.token_cost_lib.compute_strict_proof_hash` (compact sorted-key JSON; not `compute_proof_hash.py` default spaces).
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20260913-bug0020","phase_id":"discovery","proof_issued_at":"2026-09-12T22:45:00Z","proof_ttl_seconds":3600,"role":"po","runtime_proof_id":"rp-auto-20260913-bug0020-discovery-po-20260912T224500Z-BUG-0020"}`
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=spec`, `model_id=cursor-grok-4.6`, `sprint_id=none`, `story_id=BUG-0020`

### Isolation + stop

- `phase_id=discovery`, `role=po`, `bug_id=BUG-0020`, `fresh_context_marker=po-BUG0020-discovery-20260912T224500Z-fresh`, `model_id=cursor-grok-4.6`
- `evidence_ref=docs/product/backlog.md ### BUG-0020 discovery_notes; docs/product/vision.md ## Discovery Notes — BUG-0020; this handoff; docs/engineering/research.md ## R-0125; .opencode/plugins/orchestrator.ts editor.add; .opencode/plugins/its-magic-auto/{index.ts,tui.ts}; absent .opencode/commands/auto.md + .opencode/tui.json + .opencode/cli.json; docs/engineering/state.md discovery checkpoint`
- **Hot-surface note**: Appended (not prepended) so triad oldest-prefix rollover retains this newest section. Post-append `--check` → `STATE_ARCHIVE_REQUIRED` `state` 1255/1200 units=17/80 + `po_to_tl` 689/650 units=17/60 → `arch_linkage_guard.py --pre` exit 0 → `--rollover` `rollover_complete units=1,2` pack_state=`docs/engineering/state-archive/state-pack-20260912-bn.md` (archived `## Architecture checkpoint — BUG-0019 / auto-20260912-bug0019 (role=tech-lead)`; archived_body_lines=79; preamble_lines=11; retained_body_lines=1176) pack_po=`handoffs/archive/po-to-tl-pack-20260912-k.md` (archived `## Architecture handoff — BUG-0017 OpenCode Linux slash commands (CRLF YAML frontmatter)` through `## Intake handoff — US-0133..US-0148 standalone its-magic agent`; archived_body_lines=88; retained_body_lines=601) → `--post` exit 0; tuple fill then final `--check` PASS (`state` 1178/1200 units=16/80; `po_to_tl` 601/650 units=15/60).
- **Status**: BUG-0020 remains **OPEN**. **Next**: `/research` in fresh **tech-lead** subagent. Do not spawn research from this discovery chat. STOP.

