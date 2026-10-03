# QA Findings - S0161 / BUG-0030

## Verdict

PASS. The implementation, deterministic contracts, and required real-host
lifecycle-start proof pass. BUG-0030 acceptance remains unchanged until
verify-work.

## Passing Evidence

- Credentialed session smoke returned `5 passed, 1 skipped` with
  `ITS_MAGIC_OPENCODE_SESSION_SMOKE=1` and
  `ITS_MAGIC_OPENCODE_SMOKE_MODEL=openai/gpt-5.6-terra`.
- The passing session smoke created a real OpenCode session, called
  `session.command(..., "auto")`, and observed agent `auto` plus the durable
  canonical prompt.
- The real OpenCode `1.18.32` `/command` endpoint exposes `auto` with
  `source: command`, `agent: auto`, and the canonical spawn-only prompt.
- `python scripts/check_intake_template_parity.py --repo . --scope bug-0030`
  returned `INTAKE_TEMPLATE_PARITY_OK`.
- `python scripts/bug_issue_validate.py --repo . --check-acceptance` returned
  `BUG_VALIDATION_OK`.

## Resolved Blocker

- **B-1 Provider admission unavailable**: CLOSED. The earlier test timed out
  because it waited for model completion. The smoke now triggers the command in
  the background and polls for prompt admission only; the user-confirmed
  credentialed run passed.

## Next

Run `/verify-work`. Do not mark BUG-0030 acceptance complete before that phase.

---

## Closure QA record — S0161 / BUG-0030 (phase closure, role qa, 2026-09-27T15:02:00Z)

- verdict: CLOSURE_PASS (prerequisites gate passed; persistence handoff to orchestrator)
- prerequisites: release_queue S0161=released @2026-09-27T14:35:00Z; S0161-release-notes RELEASE_PASS; qa PASS; UAT verified_ready=true (5/5 ACs, 6/6 steps).
- release proof consumed: rp-auto-20260927-bug0030-release-release-20260927T143000Z-BUG-0030 / E3BFED1E16C0F33DBB86D43AD35B8B517A281AD0FB547747272C5EEB532A752D; independently recomputed via scripts/token_cost_lib.compute_strict_proof_hash → MATCH @ 2026-09-27T15:02:17Z; within proof_ttl 2026-09-27T15:30:00Z.
- validator bridge (pre-mutation): python scripts/bug_issue_validate.py --repo . --check-acceptance → [BUG_VALIDATION_OK] exit 0 @ 2026-09-27T15:00:32Z.
- triad guard pre-check: enforce-triad-hot-surface.py --check exit 0; arch_linkage_guard.py --pre exit 0.
- required mutations (orchestrator-enforced persistence per permission model):
  1. docs/product/backlog.md ### BUG-0030: Status OPEN→DONE; AC-1..AC-5 [ ]→[x]
  2. docs/product/acceptance.md L218 BUG-0030 row: [ ]→[x]
  3. docs/engineering/state.md: closure checkpoint append-bottom (qa / S0161 / CLOSURE_PASS / fresh marker qa-BUG0030-closure-20260927T151000Z-fresh)
  4. sprints/S0161/closure-verification.md (CLOSURE_PASS record)
- operator note: agent edit/write permission rules blocked direct mutations of backlog.md, acceptance.md, state.md and closure-verification.md in this context; orchestrator plugin enforces persistence. Post-mutation validator bridge exit 0 required before handoff.
- NB1 residual: full provider-lifecycle completion remains operator UAT after ship; live CLI TUI UAT_PROBE_FORBIDDEN; npm_published=false (kit 0.1.9); no git push (SYNC_DISABLED).
