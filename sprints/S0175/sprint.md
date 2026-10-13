# Sprint S0175 — US-0155 interactive operator TUI

## Metadata

| Field | Value |
|---|---|
| sprint_id | **S0175** (next free id: `sprints/S0174/` exists; `sprints/S0175/` did not) |
| story_id | US-0155 — **OPEN**, P1, user_visible; AC-1..AC-5 unchecked |
| status | PLANNED |
| current_phase | sprint-plan complete |
| delivery_mode | ultra_lean; plan-verify is skipped and is not authored this phase |
| research_anchor | **R-0165** |
| architecture_anchor | `docs/engineering/architecture.md` `# US-0155` |
| companion_DEC | **none** |
| prior_sprint | S0174 closed US-0154. S0175 does not reopen it. |
| task_count | 6 (T-anch + T-001..T-005; `SPRINT_MAX_TASKS=12`; split not triggered) |
| fresh_context_marker | `tl-US0155-plan-20261012T191221Z-fresh` |

## Goal

Make `itsm-tui` an interactive client of the admitted daemon/operator transport: commands, streaming events, approvals, bounded panels, and a non-interactive fallback.

The design is locked by R-0165 and `# US-0155`. This sprint does not re-decide it.

- The TUI stays in `@its-magic/tui`. Interactive mode uses readline and the existing ANSI renderer. It does not start a second runtime or a Pi session.
- Commands, streaming events, failure diagnostics, and approve/cancel/pause/resume use the same transport as the CLI. Protocol version stays 1.
- New panels compose the locked four-panel renderer and stay bounded.
- Keyboard, resize, redaction, reconnect, and the print-once fallback work on Windows and Linux.
- Contract tests speak the real daemon protocol.

## Scope

### In scope (execute)

1. Interactive loop on the existing TUI package, still a daemon/operator client.
2. Shared submit, stream, approve, cancel, pause, and resume path.
3. Bounded conversation, changed-files, app/log, browser, and model/token/cost panels beside the locked four.
4. Keyboard, resize, redaction, reconnect/replay, and non-interactive fallback.
5. Five `test_us0155_*` markers in `standalone/tests/contract/us0155.contract.test.ts`.
6. Template twin of touched TUI files under `template/.its-magic/standalone/apps/tui`.

### Out of scope

- This phase implements nothing.
- Do not rewrite US-0146 or change `TuiPanelId` / `TUI_COLLAPSE_ORDER` in `panels.ts`.
- Do not add a JSON-RPC method or change `DAEMON_RPC_METHODS`.
- Do not import `@earendil-works/pi-coding-agent`, `pi-ai`, or `pi-tui` from the TUI.
- Do not add web, mobile, IDE, or remote-worker clients.
- Do not reopen US-0149 through US-0154. US-0156 stays DONE.
- Do not add a README coverage row.
- Do not flip US-0155 or tick AC-1..AC-5.
- Do not read `.env`. No publish, push, or `/auto`.

## Acceptance coverage

| AC | Tasks |
|---|---|
| AC-1 | T-001 |
| AC-2 | T-002 |
| AC-3 | T-003 |
| AC-4 | T-004 |
| AC-5 | T-005 |

All five ACs have a task. No split: 6 tasks, cap 12.

## Plan-verify

Ultra-lean skips plan-verify. This phase does not write `sprints/S0175/plan-verify.json`. QA may author that file inside build+verify.

## Proof

- `runtime_proof_id=rp-auto-20261012-us0155-plan-techlead-20261012T191221Z`
- `proof_hash=8dc83c4163517a894a1d42c5856fb05f32418139b19ffefc4dc151f77d654534`
- `proof_issued_at=2026-10-12T19:12:21Z`; `proof_ttl=2026-10-12T20:12:21Z`
- Canonical tuple: `{"orchestrator_run_id":"auto-20261012-us0155-plan","phase_id":"sprint-plan","proof_issued_at":"2026-10-12T19:12:21Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20261012-us0155-plan-techlead-20261012T191221Z"}`
- `hash_recompute_confirmation=true`
