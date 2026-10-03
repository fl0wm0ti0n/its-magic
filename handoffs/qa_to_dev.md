# QA -> Dev handoff — US-0156 / S0162 (QA_FAIL — B-1 repaired, B-2 platform-level)

- **sprint_id**: S0162
- **story_id**: US-0156 (OPEN — not mutated; acceptance unchecked)
- **phase_id**: qa
- **role**: qa (fresh per BUG-0006)
- **timestamp**: 2026-09-27T20:53:48Z (UTC) — persisted by the orchestrator
  via the S0161 closure-record precedent (orchestrator-enforced persistence
  path), because the qa role's own write to its designated artifacts was
  denied by the effective permission rule set (B-2).
- **verdict**: **FAIL** — blocking_count=2 (B-1 subsequently CLOSED and
  re-verified; B-2 subsequently RESOLVED — see correction below; the
  blocking item remaining for US-0156 is the DoD gate, per verify-work:
  BUG-0022 still OPEN → US-0156 stays OPEN).
  - **B-1 CLOSED**: acceptance-row corruption repaired, re-verified green.
  - **B-2 RESOLVED (2026-09-27, orchestrator)**: was NOT platform-level.
    Root cause = rule-order semantics (opencode evaluates the LAST
    matching rule): committed HEAD placed `"**": deny` last → deny won
    over every allow; working tree (deny first, allows last) → specific
    allows on owned paths win. Verified by 3 successful qa-role writes
    to fresh owned paths. All six role agents active+template confirmed
    in the working order; kit contracts green.
- **evidence**: `sprints/S0162/qa-findings.md` (QA record, full detail).

## B-1 (CLOSED)

- `docs/product/acceptance.md` L192 carried a stray U+2014 em-dash prefix
  (`—- [x] BUG-0001: ...`) in the uncommitted working tree, introduced by the
  US-0150..US-0156 session. Committed HEAD (`e34a7c4`) has the clean row.
- Validator row regex dropped the row → `BUG_RECONCILE_ACCEPTANCE_MISSING_ROW:BUG-0001`;
  observed `bug_issue_validate.py --repo . --check-acceptance` exit 1.
- **Repair (one character, applied by orchestrator @ 2026-09-27T20:47Z)**:
  L192 `—- [x] BUG-0001:` → `- [x] BUG-0001:`. Checkbox state unchanged;
  validator regex not loosened; BUG-0001 not unchecked.
- **Post-repair re-verified**: `bug_issue_validate.py --repo .
  --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0; compose
  `bug0027 + bug0030 + us0124 + us0156` → **36 passed, 2 skipped**.
- The dev handoff's `BUG_VALIDATION_OK` claim is now consistent with the
  working tree (it was stale against the corrupted row at QA time).

## B-2 (RESOLVED — correction of initial "PLATFORM" classification)

- qa role's own writes to `sprints/S0162/qa-findings.md` and
  `handoffs/qa_to_dev.md` were initially denied even though explicit allow
  patterns for exactly those paths exist in `.opencode/agents/qa.md`.
- **Initial (wrong) diagnosis**: "opencode resolves effective-deny over
  specific allow regardless of list order, so this is platform-level and
  needs orchestrator-enforced persistence".
- **Correct diagnosis** (opencode v1.18.33 embedded doc: *"Within an
  object, insertion order matters. opencode evaluates the LAST matching
  rule, so put broad rules first and narrow rules last"*):
  - Committed HEAD had the allows first and `"**": deny` **last** →
    last-match-wins → **deny won over every allow** → the observed
    refusals. This is exactly the "immer wieder Rechte-Probleme".
  - Working tree has `"**": deny` first and allows last → **specific
    allows on owned paths win** → qa writes to its own artifacts
    succeed.
- **Verified**: 3 fresh probes written successfully **by the qa role
  itself** (`sprints/S0198/qa-findings.md`, `sprints/S0199-x/qa-findings.md`,
  `sprints/S0201/plan-verify.json` — probes since cleaned up). All six role
  agents (dev, po, qa, release, tech-lead, curator) are deny-first in both
  active and template; `auto.md`/`security.md` use flat `edit: deny`
  (unaffected). Kit contracts green: us0156 10/10, bug0027 marker-10 suite
  pass, compose 36 passed / 2 skipped.
- **Do NOT do**: do not reorder the agents back to allows-first — that
  reintroduces the bug. Do not file this as a platform issue. Do not add
  "orchestrator-enforced persistence" workarounds for this — the S0161
  precedent was correctly applied there (qa genuinely could not write at
  that time because the active rule state was the HEAD ordering); here
  the qa role writes fine and the record was persisted by the qa spawn
  itself.

## Passing evidence (QA-reproduced, not taken on trust)

- `tests/us0156_contract_test.py` → **10/10 PASS** (pytest 9.1.1, 0.86s).
- Compose `bug0027 + bug0030 + us0124 + us0156` → **36 passed, 2 skipped**
  (matches dev handoff).
- Compose guards green: no `fallback_execute` (bridge + orchestrator,
  comments stripped); no active `client.rpc(`; no `localhost:<port>` in
  bridge; all five US-0156 reason codes present in both;
  `PHASE_ROLE_MATRIX` covers all 12 phases; fresh-Task guard +
  `fresh_context_marker` present.
- Permission-order contract green (broad `**` deny precedes specific allows
  in all six non-security roles; security read-only).
- Active/template byte-parity confirmed (bridge, orchestrator, command, all
  role agents; independent hash verification).
- `python scripts/check-user-visible-metadata.py --repo .` → exit 0.
- DoD composition held: backlog BUG-0027 DONE, BUG-0030 DONE; US-0156
  acceptance row correctly unchecked (closure-owner only).

## Guards / do NOT

- No live-desktop / `--pure` / provider-complete claim.
- Do NOT mark US-0156 DONE. Do NOT tick acceptance US-0156.
- Do NOT reopen BUG-0027/0030.
- Do NOT merge/drain BUG-0022/0026/0028/0029.
- Do NOT restore TUI/RPC or the retired `auto.md` route.
- Do NOT npm-publish or git push.
- Do NOT reorder role permission lists or loosen kit permission-order
  contracts "to fix" B-2 (the ordering is not a semantic knob on this host).

## Next

- **B-1**: closed; no further dev action.
- **B-2**: operator must decide how to treat the platform-level
  permission-resolution defect. It is not an in-repo execute defect and is
  not repairable by a dev sub-agent against the current kit contracts.
  Options are the operator's to choose (e.g., file a platform-level issue
  against opencode, or accept the documented limitation and proceed);
  **this handoff does not pre-empt that decision and does not direct a
  follow-on dev or verify-work phase**.

---

# QA -> Verify-work handoff — BUG-0030 / S0161 (QA_PASS)

- **sprint_id**: S0161
- **bug_id**: BUG-0030 (OPEN; acceptance unchanged)
- **phase_id**: qa
- **verdict**: PASS - blocking_count=0
- **evidence**: `sprints/S0161/qa-findings.md`
- **passing**: command registration host smoke, migration contracts, parity,
  BUG-0027 regression, and bug validator
- **credentialed evidence**: `ITS_MAGIC_OPENCODE_SESSION_SMOKE=1` with
  `ITS_MAGIC_OPENCODE_SMOKE_MODEL=openai/gpt-5.6-terra` returned
  `5 passed, 1 skipped`; the real session-command admission check passed
- **next**: fresh `/verify-work`; do not mark BUG-0030 DONE or tick acceptance
  before that phase

---

# QA -> Dev handoff — US-0150 / S0158 (QA_PASS)

- **sprint_id**: S0158
- **story_id**: US-0150 (OPEN - not marked DONE)
- **phase_id**: qa
- **verdict**: PASS - blocking_count=0
- **evidence**: `sprints/S0158/qa-findings.md`
- **green gates**: standalone lint, typecheck, 172 Node tests, 30 Python contracts, template mirror check
- **next**: fresh `/verify-work`; do not mark US-0150 DONE.

---

# Historical QA -> Dev handoff — US-0131 / S0133

- **sprint_id**: S0133
- **story_id**: US-0131 (OPEN — not marked DONE per US-0045)
- **phase_id**: qa (re-run after execute remediation)
- **role**: qa (fresh per BUG-0006)
- **orchestrator_run_id**: auto-20260907-us0131
- **delivery_mode**: ultra_lean
- **macro_phase**: build+verify
- **AUTO_IMPLEMENTATION_LOOP**: 1 (cycle complete — blockers closed)
- **fresh_context_marker**: qa-US0131-qa-20260907T203347Z-fresh
- **timestamp**: 2026-09-07T20:33:47Z (UTC)
- **model_id**: composer-2.5 (CROSS_MODEL_REVIEW=1 — required)
- **verdict**: **PASS** — blocking_count=0
- **story_status**: OPEN (US-0045 — not marked DONE; acceptance checkboxes unchecked)
- **intake_json**: NOT mutated
- **sibling_out_of_scope**: US-0132
- **producer_runtime_proof_id**: rp-auto-20260907-us0131-execute-remediation-dev-20260907T202531Z-US-0131
- **producer_proof_hash**: 7BB3B2E38B12A434B1039A1FEC7BC90727CD15823C36328B1A32BF5E12FEB95C (MATCH; consumed before TTL 2026-09-07T21:25:31Z)
- **qa_runtime_proof_id**: rp-auto-20260907-us0131-qa-qa-20260907T203347Z-US-0131
- **qa_proof_hash**: 84692196079278DF25EDF8781DCCE750282DC8F7DFCBA4A9039D7F5FBDCB87CC
- **qa_proof_ttl**: 2026-09-07T21:33:47Z

## Prior blocker status

- **B-1** `USER_VISIBLE_INTERNAL_METADATA_DETECTED` — **CLOSED**
  - Re-verify: `python scripts/check-user-visible-metadata.py --repo .` → exit 0
  - Docstrings at `materialize_kit_config_example` / `run_kit_config_postinstall` are neutral; ID only in allowlisted `#` comment L268

## Green gates

- pytest tests/us0131_contract_test.py -v → 10/10 PASS
- check_intake_template_parity.py --scope=us-0131 → OK
- check-user-visible-metadata.py --repo . → exit 0
- enforce-triad-hot-surface.py --check → exit 0 (pre-qa-write)
- 14/14 US-0131 template pairs byte-identical
- Critic NBs remain informational only

## Artifacts

- sprints/S0133/qa-findings.md (QA_PASS)
- sprints/S0133/uat.json / uat.md (verdict PASS)
- docs/engineering/state.md (qa re-run checkpoint)
- handoffs/resume_brief.md → verify-work

## Next

Orchestrator MUST Task-spawn fresh **qa** for `/verify-work` (BUG-0006). Do **not** spawn verify-work from this qa subagent. Do **not** route back to `/execute`. Do **not** mark US-0131 DONE. Do **not** work US-0132.

---

# SUPERSEDED — prior FAIL handoff (2026-09-07T20:16:47Z)

Prior content requested execute remediation for B-1. Remediation landed; this file now records CLOSED/PASS. Historical FAIL detail remains in `sprints/S0133/qa-findings.md` archive sections via git history / prior state packs.
