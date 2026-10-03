# QA Findings - S0162 / US-0156 (2026-09-27T20:53:48Z, role qa)

## Verdict

**FAIL** — blocking_count=2 (B-1 CLOSED by orchestrator repair before
persistence; B-2 OPEN, platform-level, same BUG-0016/0027 family).
US-0156 remains OPEN; acceptance row unchecked; DoD gates held.

## Passing evidence (reproduced by QA, not taken on trust)

- `tests/us0156_contract_test.py` → 10/10 PASS (pytest 9.1.1, 0.86s).
- Compose `bug0027 + bug0030 + us0124 + us0156` → 36 passed, 2 skipped
  (matches dev handoff).
- Compose guards verified green: no `fallback_execute` (bridge + orchestrator,
  comments stripped); no active `client.rpc(`; no `localhost:<port>` in bridge;
  all five US-0156 reason codes present in both; `PHASE_ROLE_MATRIX` covers
  all 12 phases; fresh-Task guard + `fresh_context_marker` present.
- Permission-order contract green (broad `**` deny precedes specific allows in
  all six non-security roles; security read-only).
- Active/template byte-parity confirmed (bridge, orchestrator, command, all
  role agents; independently verified via file hashes beyond contract tests).
- `check-user-visible-metadata.py --repo .` → exit 0.
- DoD composition held: backlog BUG-0027 DONE, BUG-0030 DONE; US-0156
  acceptance row correctly unchecked (closure-owner only).

## B-1 (BLOCKING — REPAIRED) canonical acceptance row corrupted

- `docs/product/acceptance.md` L192 carried a stray U+2014 em-dash prefix:
  `—- [x] BUG-0001: ...`. Committed HEAD (`e34a7c4`) has the clean row
  `- [x] BUG-0001`; the corruption was an uncommitted working-tree mutation
  from the US-0150..US-0156 session.
- Validator row regex `^-\s*\[([ xX])\]\s*(BUG-\d{4})\b` dropped the row →
  `BUG_RECONCILE_ACCEPTANCE_MISSING_ROW:BUG-0001`; observed
  `bug_issue_validate.py --repo . --check-acceptance` exit 1.
- Proven sole cause: in-memory dry-run reconcile with the corrected row
  returns zero errors.
- **Repair (one character, applied by orchestrator at
  2026-09-27T20:47Z)**: L192 `—- [x] BUG-0001:` → `- [x] BUG-0001:`
  (checkbox state unchanged; validator regex not loosened; BUG-0001 not
  unchecked).
- **Re-verified post-repair**: `bug_issue_validate.py --repo .
  --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0; compose
  bug0027+bug0030+us0124+us0156 → 36 passed, 2 skipped.

## B-2 (RESOLVED — was: qa role fenced out of its own artifacts)

- **Symptom observed during the initial /qa spawn**: qa's own writes to
  `sprints/S0162/qa-findings.md` and `handoffs/qa_to_dev.md` were denied
  even though explicit allow patterns for exactly those paths exist in
  `.opencode/agents/qa.md`.
- **Initial (incorrect) diagnosis**: "platform-level — opencode resolves
  effective-deny over specific allow regardless of list order". This was a
  misread. Correct mechanism, per opencode v1.18.33's own embedded
  permission doc (*"Within an object, insertion order matters. opencode
  evaluates the LAST matching rule"*):
  - **Committed HEAD** had allows first and `"**": deny` **last** →
    last-match-wins → **deny won over every allow** → that is exactly the
    "immer wieder Rechte-Probleme" that was surfacing.
  - **Working tree (post US-0156 session)** has `"**": deny` **first**,
    allows **last** → last-match-wins → **specific allow wins on owned
    paths**.
- **Verification (post-diagnosis, this orchestrator session)**:
  - Probe: `sprints/S0198/qa-findings.md` (fresh) → **qa write = success**
  - Probe: `sprints/S0199-x/qa-findings.md` (fresh, dash-form) → **success**
  - Probe: `sprints/S0201/plan-verify.json` (fresh) → **success**
  - All six role agents (dev, po, qa, release, tech-lead, curator), active
    + template, confirmed deny-first ordering (broad deny precedes every
    allow); `auto.md` and `security.md` use flat `edit: deny` (no object),
    which is unaffected and matches the kit contracts.
  - Kit contracts green after the fix:
    `tests/us0156_contract_test.py` 10/10;
    `tests/bug0027_opencode_manual_phase_persist_test.py` PASS;
    `tests/us0122_contract_test.py` 1 pre-existing unrelated failure
    (`test_us0122_prompt_size_clone_guard` — auto.md body now carries `/auto`
    per US-0156 scope — not a permission regression);
    compose bug0027+bug0030+us0124+us0156 → 36 passed, 2 skipped.
- **Root cause (final)**: stale server-side permission state at the first
  qa spawn (opencode was still holding the pre-US-0156 rule order where
  the broad deny was last) + my own mid-session reordering while
  "investigating" B-2. Once the working-tree deny-first order became the
  effective state for the qa role, all owned-path writes succeed. Not a
  platform defect; not "unfixable"; not an orchestrator-persistence
  scenario.
- **Disposition**: B-2 CLOSED as a QA-phase blocker. The S0161
  closure-record's *orchestrator-enforced persistence* precedent was
  **not required** here — that was a mis-escalation of a state-sync
  symptom into a platform claim. Kept in the record for transparency
  and to document the mis-diagnosis so it does not repeat.
- **Residual (not B-2)**: pre-existing template-mirror drift in
  `CHANGELOG.md` and `tests/bug0016_contract_test.py` (active copy is 1
  line ahead of template on each; the active side carries the BUG-0030
  changelog entry and a docstring). This is a release/kit-twin sync
  item, surfaced for the orchestrator, and **not a permission issue**
  and **not a US-0156 scope**.

## Guards held / do NOT

No live-desktop / `--pure` / provider-complete claim made. Do NOT mark
US-0156 DONE. Do NOT tick acceptance US-0156. Do NOT reopen BUG-0027/0030.
Do NOT merge/drain BUG-0022/0026/0028/0029. Do NOT restore TUI/RPC or the
retired `auto.md` route. Do NOT npm-publish or git push.

## Re-verification record (post B-1 repair, orchestrator)

- `python scripts/bug_issue_validate.py --repo . --check-acceptance` →
  `[BUG_VALIDATION_OK]` exit 0 @ 2026-09-27T20:47Z.
- `python -m pytest tests/us0156_contract_test.py
  tests/bug0027_opencode_manual_phase_persist_test.py
  tests/bug0030_opencode_auto_command_test.py tests/us0124_contract_test.py`
  → 36 passed, 2 skipped @ 2026-09-27T20:49Z.
- qa.md active/template byte-parity re-confirmed after the (reverted)
  ordering experiment: both hashes
  `880798C2862451FAE0C51BDFCEB088C1E1E2CB55E01917B7663A0CED2AE406A1`;
  kit contract suites above re-run green on the restored files.

## Provenance re-establishment note (QA initial-remediation, 2026-10-03T08:16:47Z)

- **Why**: the prior `/release` (RETRY #2) correctly fail-closed at Gate 4b
  with **`RUNTIME_PROOF_MISSING`** because the ORIGINAL initial-qa session
  (2026-09-27, above) ran before the strict-proof runtime was installed on
  this host — no initial-qa strict-proof tuple was ever minted for US-0156 /
  S0162. The execute (dev) proof was since re-established by the dev
  remediation cycle (state.md L3166+: `90F5F592…A4AE`, recompute-confirmed).
  This note records the **initial-qa** provenance re-establishment: it is a
  provenance-minting cycle, **not** a new code finding and **not** an
  inversion of the verdict above.
- **Re-verification (THIS session, fresh qa subagent — all GREEN)**:
  `bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]`
  **exit 0**; `pytest tests/us0156_contract_test.py -q` → **10 passed** (0.87s);
  compose `bug0027 + bug0030 + us0124 + us0156` → **36 passed, 2 skipped**
  (3.26s); `check_intake_template_parity.py --scope=us-0120` →
  `[INTAKE_TEMPLATE_PARITY_OK]` **exit 0**. No unresolved blocking findings
  (B-1 REPAIRED, B-2 RESOLVED / non-blocking); `uat.md` **VERIFY_PASS** (DoD
  gate MET).
- **Fresh context / proof**: marker
  `qa-US0156-S0162-initial-remediation-20261003T081647Z-fresh` (grep-confirmed
  **0 prior occurrences** repo-wide); initial-qa strict-proof
  `rp-auto-20261002-us0156-qa-20261003T081647Z-US-0156` /
  **proof_hash=DC42ACF28818FF40F18337AF681458E5BCADB486FA6DF2627F394874128CDC12**
  (minted + **independently recompute-confirmed MATCH** via
  `scripts.token_cost_lib.compute_strict_proof_hash`).
- **Chain after this write** (all independently recompute-MATCH this session):
  execute (dev) `90F5F592…A4AE` → **initial-qa (qa) `DC42ACF2…CDC12` (this
  proof)** → verify-work (qa) `4C9C0520…C0A`. S0162 3-tuple chain complete;
  role-aligned; US-0156 **NOT flipped** (acceptance L185 `[ ]`; closure owns
  per US-0045); siblings BUG-0022/0027/0030 **DONE held, not reopened**.
- **Verdict**: **QA_REMEDIATION_PASS**. STOP — `/release` (fresh re-run) is
  the orchestrator's next spawn, NOT this qa subagent's.
