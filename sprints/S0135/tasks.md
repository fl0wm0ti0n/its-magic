# Sprint S0135 - Task checklist (BUG-0017)

Total tasks: 8 (T-anch + T-001..T-007). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# BUG-0017`.

**Isolation**: `tl-BUG0017-sprint-plan-20260911T192300Z-fresh` · `model_id=composer-2.5` · `orchestrator_run_id=auto-20260911-bug0017`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (DQ1 `.gitattributes` scoped LF rows)
3. T-002 (one-time scoped LF renormalize — NB2)
4. T-003 (extend `guard_installer_publish.py` OpenCode `\r` inventory)
5. T-004 (template guard mirror + active↔template parity gate)
6. T-005 (6 `test_bug0017_*` markers)
7. T-006 (runbook DQ6 upgrade recipe — NB3)
8. T-007 (release/CI `guard:installer` before GitHub tag — NB1)
9. Integration verification

## Critic NB awareness (execute)

- **T-007** (`bug0017arc-challenger-001` NB1): choco/GitHub-zip path must run extended `guard:installer` before tag; no choco-specific EOL post-process.
- **T-002** (NB2): scoped `git add --renormalize -- .opencode template/.opencode` only; if dirty unrelated files block commit, isolate/stash or commit attribute+normalize slice alone — do not renormalize whole repo.
- **T-006** (NB3): document `its-magic --mode upgrade --host opencode|both` after kit fix; kit-only does not heal already-copied CRLF trees.
- **T-anch** (`bug0017arc-subtractor-003`): verification-only; do not rewrite `# BUG-0017` / R-0118; reject A2–A5 + companion DEC; do not mark DONE.

## Task checklist

- [x] **T-anch**: Verify `# BUG-0017` H1 in `docs/engineering/architecture.md`; approach A* LOCKED; R-0118 DQ1–DQ6 LOCKED; NB1–NB3 closed; companion DEC=none; compose guards (BUG-0008/US-0084/DEC-0120; BUG-0015/0016 not reopened); verify `tests/bug0017_*` does NOT yet exist (or document baseline). Record to `sprints/S0135/t-anch-verification.md`. NO mutation to `architecture.md` / `docs/engineering/research.md` R-0118 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Append DQ1 `.gitattributes` rows (compose existing `*.sh` / `*.manifest`; **never** add repo-wide `*.md`):
  ```
  .opencode/**/*.md text eol=lf
  .opencode/**/*.ts text eol=lf
  .opencode/**/*.json text eol=lf
  template/.opencode/**/*.md text eol=lf
  template/.opencode/**/*.ts text eol=lf
  template/.opencode/**/*.json text eol=lf
  ```
  Tests: marker 1. (AC-1, AC-3)

- [x] **T-002**: One-time LF renormalize: `git add --renormalize -- .opencode template/.opencode` so index stores LF for in-scope pack text. Dirty-tree = scoped only (NB2). Do not renormalize whole repo. Do not rewrite installer copy paths. Tests: markers 2, 3. (AC-1, AC-2)

- [x] **T-003**: Extend `scripts/guard_installer_publish.py` to reject `\r` in OpenCode inventory:
  - `.opencode/commands/**/*.md`, `.opencode/agents/**/*.md`, `.opencode/plugins/**/*.{md,ts}`, `.opencode/README.md`
  - `template/.opencode/` same + `template/.opencode/model-catalog.local.example.json`
  Keep US-0084 / BUG-0008 checks unchanged. Hook: existing `npm run guard:installer` / `prepublishOnly`. Fail message names relative path + BUG-0017. Do **not** add install-time EOL rewrite. Do **not** create sibling `guard_opencode_eol.py`. Tests: markers 4, 5. (AC-1, AC-2, AC-4)

- [x] **T-004**: Mirror guard changes to `template/scripts/guard_installer_publish.py` (byte-identical where paired). Ensure active↔template OpenCode tracked in-scope text parity gate is ready for marker 6. Do not scan operator-local `model-catalog.local.json`. Tests: marker 6. (AC-5)

- [x] **T-005**: Create `tests/bug0017_opencode_eol_test.py` (or `tests/installer_opencode_eol_bug0017_test.py`) + template mirror if paired with **exactly 6** markers:
  1. `test_bug0017_gitattributes_scoped_opencode_eol_lf`
  2. `test_bug0017_no_cr_in_active_opencode_pack_text`
  3. `test_bug0017_no_cr_in_template_opencode_pack_text`
  4. `test_bug0017_guard_installer_publish_rejects_opencode_cr`
  5. `test_bug0017_guard_still_enforces_installer_sh_and_manifests`
  6. `test_bug0017_active_template_opencode_tracked_text_parity`
  Static/fixture only — **no live OpenCode CI probe**. Do **not** weaken BUG-0008 / US-0084 tests. (AC-1..AC-5, AC-7)

- [x] **T-006**: Add runbook section/recipe (active + template byte-identical) documenting consumer path: after kit fix, run `its-magic --mode upgrade --host opencode` or `--host both` (DEC-0120). Note kit-only insufficient for already-installed CRLF trees; conflicted locals → resolve then re-upgrade; `dos2unix` last resort only. Cross-link BUG-0017 / R-0118. (AC-6)

- [x] **T-007**: Document/enforce release/CI checklist: `npm run guard:installer` (extended) **required before any GitHub tag** that chocolatey downloads. No choco-specific EOL post-process (DQ4). May live in runbook release checklist and/or CI workflow comment — do not invent a second guard script. (AC-4)

## Integration verification (post T-007)

- [x] Test gate: `python -m pytest tests/bug0017*.py -v` → 6/6 PASS
- [x] Guard gate: `npm run guard:installer` → PASS (no `\r` in OpenCode inventory; BUG-0008/US-0084 still green)
- [x] Parity gate: active ↔ template guard + in-scope OpenCode tracked text
- [x] Scope gate: no install EOL rewrite; no repo-wide `*.md eol=lf`; no BUG-0015/0016 reopen; no companion DEC; no live OpenCode probe
- [x] Status gate: BUG-0017 remains OPEN; acceptance unchecked; intake JSON not mutated

## Files to touch (scope)

### New (create)

- `tests/bug0017_opencode_eol_test.py` (+ template if paired)
- `sprints/S0135/t-anch-verification.md` (execute)

### Edit (scoped)

- `.gitattributes` — DQ1 six rows
- `.opencode/**` + `template/.opencode/**` in-scope text — one-time LF normalize
- `scripts/guard_installer_publish.py` + `template/scripts/guard_installer_publish.py`
- `docs/engineering/runbook.md` + template — DQ6 upgrade + before-tag note
- Optional: CI / release checklist surface for T-007

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # BUG-0017`
- `docs/engineering/research.md ## R-0118`
- `docs/product/backlog.md ### BUG-0017` Status/acceptance (US-0045)
- `docs/product/acceptance.md` BUG-0017 row
- `handoffs/intake_evidence/BUG-0017-intake-20260911.json`

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / acceptance checkbox | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| BUG-0008 / US-0084 test expectations | extend only; do not weaken |
| Installer EOL rewrite paths | forbidden (DQ3 / A2 rejected) |
| BUG-0015 / BUG-0016 artifacts | DONE — do not reopen |
| Operator-local `model-catalog.local.json` | unscanned (DQ5) |
| Live OpenCode CI probe | forbidden |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-003, T-005 |
| AC-2 | T-002, T-003, T-005 |
| AC-3 | T-001, T-005 (m1) |
| AC-4 | T-003, T-005 (m4,m5), T-007 |
| AC-5 | T-004, T-005 (m6) |
| AC-6 | T-006 |
| AC-7 | T-anch, T-005 (m5) |
| DC / architecture | T-anch |

**Surjectivity check**: 7/7 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
