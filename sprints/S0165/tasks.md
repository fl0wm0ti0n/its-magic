# Sprint S0165 — Task checklist (BUG-0035)

Eight tasks: T-anch + T-001..T-007. This is within `SPRINT_MAX_TASKS=12`; no split is
required. Execute in the listed order.

## Checklist

- [ ] **T-anch — baseline / no-op:** Verify R-0157, architecture `# BUG-0035`, DEC-0153,
  the exact pair key and field set, the active/template tech-lead and auto maps,
  `scripts/opencode_auto_bridge.py` and its template twin, existing command/reference
  pairs, runbook twins, and US-0156/BUG-0005 regression patterns. Confirm BUG-0035 is
  OPEN with AC-1..AC-7 unchecked. Do not edit backlog, acceptance, state, or DEC files.
  (DC)
- [ ] **T-001 — least-privilege permission pair:** Add only
  `"handoffs/resume_brief.md": allow` to active and template
  `.opencode/agents/tech-lead.md`, after the broad deny and without changing other
  paths, `bash`, or `task`. Assert byte equality. Keep `.opencode/agents/auto.md` and
  its template `edit: deny`. (AC-1, AC-2, AC-7)
- [ ] **T-002 — active state-first pair writer/validator:** At the canonical active
  continuation bridge surface, integrate the child-owned writer that constructs and
  validates the complete keyed tuple, persists state first, then atomically writes the
  matching latest brief pointer. Enforce writer role/authorization, strict proof, fresh
  marker, exact same-key no-op, and no parent write. No state fallback/reconciler/next
  spawn on invalid evidence. (AC-1..AC-5)
- [ ] **T-003 — template writer parity and negative semantics:** Mirror T-002 exactly
  into `template/scripts/opencode_auto_bridge.py`; preserve byte parity. Ensure syntax
  failures produce `RESUME_BRIEF_UNPARSEABLE` while all absent-required, conflict,
  authorization, replay, proof, and isolation failures produce `RESUME_BRIEF_STALE`
  with a retained predicate. (AC-3, AC-5, AC-7)
- [ ] **T-004 — paired command/reference contract:** Update only the existing active and
  template OpenCode/Cursor `research`, `architecture`, and `auto` command instructions
  plus `docs/engineering/auto-orchestration-reference.md` and its template twin. State
  that the child writes the valid state-first pair and the parent only validates and
  spawns; preserve no-fallback and no-JSON/TUI/RPC/localhost rules. (AC-1, AC-4, AC-7)
- [ ] **T-005 — paired runbook remediation:** Add byte-aligned active/template runbook
  guidance to report the failed predicate and pair key, preserve evidence, obtain a
  fresh authorized child, and independently re-resolve. Explicitly forbid hand editing,
  automatic refresh, state fallback, reconciler recovery, and next spawn while invalid.
  (AC-5, AC-7)
- [ ] **T-006 — active contract fixtures:** Author
  `tests/bug0035_continuation_pair_test.py` with the seven locked groups: lawful child
  pair; parent deny; fresh marker/proof; missing/malformed stop; tuple conflict stop;
  unauthorized/replay/idempotence; active/template parity plus runbook remediation.
  Use fixtures/mocks only; no live-host assertion. (AC-1..AC-6)
- [ ] **T-007 — template test mirror and verification:** Mirror T-006 byte-for-byte in
  `template/tests/bug0035_continuation_pair_test.py`; run all BUG-0035 groups, relevant
  US-0156 continuation/idempotence and BUG-0005 resume-refresh regressions, and
  `python scripts/bug_issue_validate.py --repo . --check-acceptance`. Confirm all
  required active/template pairs and no BUG-0034/BUG-0005/US-0156 behavior mutation.
  (AC-6, AC-7)

## Completion evidence

- [ ] Seven `test_bug0035_*` groups pass in active and template suites.
- [ ] Parent remains edit-denied; only the one child permission allow was added.
- [ ] Every invalid pair path is fail-closed and does not schedule architecture.
- [ ] Exact canonical replay alone is an idempotent no-op.
- [ ] Active/template parity holds across maps, bridge, commands/reference, runbook, and
  test file.
- [ ] `bug_issue_validate.py --repo . --check-acceptance` exits 0.
- [ ] BUG-0035 status and acceptance remain unchanged by execute; closure owns the flip.

## Execute evidence

_Pending — a fresh `/execute` dev context records commands and results. This planning
artifact makes no implementation, QA, live-host, release, or closure claim._
