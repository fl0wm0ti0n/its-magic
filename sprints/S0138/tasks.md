# Sprint S0138 - Task checklist (US-0134)

Total tasks: 10 (T-anch + T-001..T-009). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split. T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0134`. Sprint id **S0138** (next free after S0137).

**Isolation**: `tl-US0134-sprintplan-20260912T125500Z-fresh` · `model_id=cursor-grok-4.6` · `orchestrator_run_id=auto-20260912-us0134`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (`kernel-bridge` package + three-marker locate + `--kernel-root`)
3. T-002 (version file + `kernel-contract.json` + range JSON + `semver@7.8.5`)
4. T-003 (ordered `KERNEL_*` handshake)
5. T-004 (Python discovery + resolved-interpreter spawn + timeout mapping)
6. T-005 (allowlist `runValidator`)
7. T-006 (`resolveArtifactPaths` required vs optional)
8. T-007 (`runUatPlanner` / `runStatusReconcile` + `status_reconcile_validate.py`)
9. T-008 (fixtures + 10 `test_us0134_*` Win/Linux)
10. T-009 (compose US-0125/US-0133 + kit omit-guard + installer include-list + upgrade recipe)
11. Integration verification

## Critic NB awareness (execute)

- **T-002 / T-004 / T-008 / T-009** (`us0134asc-challenger-001` NB1): R1 `includePrerelease` + `0.1.3-9` in-range / `0.1.2` unsupported fixtures; R2 probe then resolved interpreter (never keep `py -3`); R3 missing manifest fail-closed mismatch (no silent default); handshake order DEC-0134 §5.
- **T-anch..T-009** (`us0134asc-architect-002` NB2): keep 1:1 architecture seeds; sprint folder is **S0138**; execute owns `kernel-bridge` bootstrap + tests + installer include-list; architecture owns H1+DEC-0134 + status schema; US-0125 parallel host; `apps/cli` imports KernelBridge types only.
- **T-anch** (`us0134asc-subtractor-003` NB3): verification-only; do not rewrite `# US-0134` / DEC-0134 / R-0122; reject A2–A5; no extract; no TS validator rewrite; no wrapping all kit scripts; do not mark DONE; do not wipe R-0120/R-0121; do not reopen US-0133 or BUG-0018; do not design US-0135+.

## Task checklist

- [x] **T-anch**: Verify `# US-0134` H1 in `docs/engineering/architecture.md`; DEC-0134 Accepted; approach A1 LOCKED; R-0122 DQ1–DQ10 LOCKED; 10-marker table locked; compose guards (kit `files` omit; US-0133 AgentKernel not amended; US-0125 parallel; US-0135+ out; BUG-0018 DONE; R-0120/R-0121 intact); verify `standalone/packages/kernel-bridge` and `tests/us0134_*` do NOT yet exist (or document baseline). Record to `sprints/S0138/t-anch-verification.md`. NO mutation to `architecture.md` / `decisions/DEC-0134.md` / `docs/engineering/research.md` R-0122 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Create `standalone/packages/kernel-bridge`. `package.json`: name `@its-magic/kernel-bridge`, `private: true`, `version: 0.0.0`, `type: module`, `engines.node >=22.19.0`, export `./src/index.ts`. Workspaces glob `packages/*` already includes it — do **not** add `standalone/` to kit `workspaces`. Implement `locateProjectKernel({ cwd?, kernelRoot? })`: walk up from `process.cwd()` (and, if cwd is inside `standalone/`, also from the `standalone/` directory) until all three markers exist (`docs/product/backlog.md`, `scripts/intake_evidence_validate.py`, `its_magic/.its-magic-version`) or filesystem root / **cap 16**. Explicit `--kernel-root` / `kernelRoot` must still pass the three markers; failure → `KERNEL_NOT_FOUND` (not a silent accept). `locateMode`: `kit-dev` when `standalone/package.json` exists as a child of the kernel root; else `consumer`. **No Pi imports.** `package.json` must not depend on `@earendil-works/pi-*` or `@its-magic/pi-kernel`. Do **not** add a Biome override for `kernel-bridge`. Tests: markers 1, 2. (AC-1)

- [x] **T-002**: `getKernelVersion()` reads `its_magic/.its-magic-version` (DEC-0045; trim; no second version file). Ship additive `its_magic/kernel-contract.json` + `template/its_magic/kernel-contract.json` with locked schema (`schema_version: 1`, `kernel_version`, `validators`, `artifact_keys` per DEC-0134 §4). `kernel_version` must match the version file or → `KERNEL_CONTRACT_MISMATCH`. Missing/malformed manifest after successful locate → `KERNEL_CONTRACT_MISMATCH` (never silent-default). Runtime range file `standalone/packages/kernel-bridge/supported-kernel-range.json`: `{ "minInclusive": "0.1.3-9", "maxExclusive": "0.2.0", "includePrerelease": true }`. Compare only inside `kernel-bridge`: `semver.satisfies(version, '>=' + minInclusive + ' <' + maxExclusive, { includePrerelease: true })`. Pin exact **`semver@7.8.5`** + `@types/semver@7.8.0` on `kernel-bridge` only — not `pi-kernel`, not kit npm `its-magic`. Tests: markers 3, 4, 5. (AC-2)

- [x] **T-003**: Implement owned handshake types per DEC-0134 §5: `KernelHandshakeCode` quartet, `KernelBridgeError`, `LocateResult`, `ContractManifest`, `ValidatorResult`, `KernelBridge` methods. Handshake order (fail-closed; first match wins): (1) locate fails → `KERNEL_NOT_FOUND`; (2) version empty/unparseable as semver → `KERNEL_CONTRACT_MISMATCH`; (3) parsed version outside range → `KERNEL_VERSION_UNSUPPORTED`; (4) manifest missing/malformed / `kernel_version` ≠ version file → `KERNEL_CONTRACT_MISMATCH`; (5) required artifact path missing → `KERNEL_CONTRACT_MISMATCH`; (6) `runValidator` unknown name / missing script / missing interpreter → `KERNEL_VALIDATOR_MISSING`. Validator semantic FAIL and timeout/crash are **not** a fifth `KERNEL_*` code. `apps/cli` / workflow import **only** these types — never spawn Python themselves. Tests: markers 2, 4, 5, 6. (AC-3)

- [x] **T-004**: Interpreter discovery (first that probes `python -c "import sys; raise SystemExit(0 if sys.version_info[0]==3 else 1)"` with `shell: false`): `ITS_MAGIC_PYTHON` / `PYTHON` / `PYTHON_BIN` → win32 `py -3` then `python` then `python3` → posix `python3` then `python`. **After a successful probe, spawn the resolved interpreter path** (real `python.exe` / `python3`), not the Windows `py -3` launcher. `cwd` = kernel root. `windowsHide: true`. `shell: false`. Timeout default **60s** via `spawn` `timeout` + `AbortSignal.timeout`. Capture stdout/stderr UTF-8 (`maxBuffer` 1 MiB). Cannot spawn interpreter / ENOENT on script → `KERNEL_VALIDATOR_MISSING`. Timeout / signal / crash → `VALIDATOR_TIMEOUT` / `VALIDATOR_CRASH` evidence strings. Unit tests may mock spawn for timeout mapping only. Tests: marker 9. (AC-4)

- [x] **T-005**: Allowlist `runValidator(name, args?, kernelRoot?)`. Unknown name → `KERNEL_VALIDATOR_MISSING`. Manifest `validators[]` **intersects** this list; manifest cannot enable unknown names. Inventory: `intake_evidence_validate`, `bug_issue_validate`, `pack_json_validate`, `validate_closure_verification`, `ledger_validate`, `model_tier_validate`, `uat-planner` (`scripts/uat_probe_lib.py`), `status-reconcile` (`scripts/status_reconcile_validate.py`). Exit **0** → PASS. Exit **non-zero** → FAIL; first `[A-Z][A-Z0-9_]+` token from stderr is the **Python** reason (no `OPENCODE_*`). Callers must not advance on FAIL (D7 / AC-4). Do **not** wrap all 40+ `scripts/*.py`. Tests: markers 6, 7, 8. (AC-1, AC-4)

- [x] **T-006**: `resolveArtifactPaths(kernelRoot?)` returns `Record<ArtifactKey, string | null>`. Required (missing → `KERNEL_CONTRACT_MISMATCH`): vision, backlog, acceptance, architecture, decisions_index, research, state, decisions_dir, sprints, handoffs. Optional (`null` if absent): `work_packs`, `sovereign`; release_queue / release_notes / traceability follow DEC-0134 §7 / R-0122 DQ6 (traceability hot surface = `docs/engineering/state.md`). Pi session history is never a map entry. No SQLite paths. Do not relocate lifecycle state. Tests: marker 5 (missing backlog). (AC-5)

- [x] **T-007**: Thin aliases: `runUatPlanner(args)` → `runValidator('uat-planner', args)` → existing `scripts/uat_probe_lib.py` (tests use `--self-test` for a PASS fixture). `runStatusReconcile(args)` → `runValidator('status-reconcile', args)` → new `scripts/status_reconcile_validate.py` (+ template twin). Status CLI: `--kernel-root PATH` (default cwd); extra args ignored except `--kernel-root`. Read-only checks that all exist and contain at least one markdown heading (`^#{1,6} `): `docs/product/backlog.md`, `docs/product/acceptance.md`, `docs/engineering/state.md`, `handoffs/resume_brief.md`. Exit 0 → stdout `[STATUS_RECONCILE_VALIDATE_OK]`. Exit ≠ 0 → stderr `STATUS_RECONCILE_SURFACE_MISSING` or `STATUS_RECONCILE_PARSE_FAILED`. **Never writes** those surfaces (tests assert no mtime/content mutation). Does not perform curator `/status-reconcile`. Does not invent a TypeScript UAT planner (US-0142). Tests: markers 7, 8. (AC-1, AC-4)

- [x] **T-008**: Create contract tests covering **exactly 10** markers against **temp fixture copies** (not in-tree mutation of this kit’s version file):
  1. `test_us0134_locate_three_marker_and_kernel_root`
  2. `test_us0134_kernel_not_found_empty_walk`
  3. `test_us0134_supported_version_0_1_3_9_in_range`
  4. `test_us0134_unsupported_version_0_1_2`
  5. `test_us0134_contract_mismatch_bad_manifest_or_missing_backlog`
  6. `test_us0134_validator_missing`
  7. `test_us0134_validator_pass_advances`
  8. `test_us0134_validator_fail_blocks_with_python_reason`
  9. `test_us0134_validator_crash_or_timeout`
  10. `test_us0134_kit_files_omit_standalone_and_no_pi_in_kernel_bridge`
  Kernel tests: `standalone/tests/contract` (`node:test` + TypeScript; reject vitest/jest). Kit pytest `tests/us0134_contract_test.py` (+ `template/tests/` twin) at least for files-omit + no-Pi-in-bridge grep (extend US-0133 grep to also deny Pi inside `kernel-bridge`). Fixture classes: `supported`, `unsupported-version`, `contract-mismatch`, `validator-missing`, `validator-crash` / timeout, `not-found`. Handshake + PASS/FAIL must hit **real Python**; unit tests may mock spawn for timeout mapping only. Existing standalone GitHub Actions job Windows + Linux (`working-directory: standalone`) covers the suite — extend if the glob would miss new files; do **not** fold into kit `TEST_COMMAND`. No paid/model calls. (AC-6)

- [x] **T-009**: Compose US-0125 (OpenCode plugin remains the OpenCode host path — parallel; no `OPENCODE_*` on standalone) and US-0133 (locate = parent walk; do **not** amend AgentKernel, pins, isolation loader, or `# US-0133` / DEC-0133). Kit `files` continues to omit `standalone/` (compose DEC-0120 / US-0133 omit-guard). Installer: `its_magic/` already install-includes; ship `its_magic/kernel-contract.json`. Add allowlist scripts not already on `[install_include_paths]` / `[required_install_script_paths]`: `scripts/bug_issue_validate.py` + `scripts/bug_issue_lib.py`; `scripts/pack_json_validate.py`; `scripts/ledger_validate.py` + `scripts/decision_ledger_lib.py`; `scripts/model_tier_validate.py` + `scripts/model_tier_lib.py`; `scripts/status_reconcile_validate.py`. Do **not** add the rest of `scripts/*.py`. Runbook upgrade recipe: `its-magic --mode upgrade` copies the new manifest + scripts; old trees without the JSON fail-closed (`KERNEL_CONTRACT_MISMATCH`), never silent-default. Tests: marker 10. (AC-1, AC-2)

## Integration verification (post T-009)

- [x] Test gate: standalone `node --test` contract suite + `python -m pytest tests/us0134*.py -v` → 10/10 markers PASS
- [x] Kit publish gate: `standalone/` absent from `package.json` `files` and tarball inventory; guard fail-closed
- [x] Import-boundary gate: no `@earendil-works/pi-` / `@its-magic/pi-kernel` inside `standalone/packages/kernel-bridge/**`; no Biome override for kernel-bridge
- [x] Handshake gate: exactly four `KERNEL_*` codes; FAIL/timeout/crash = `ValidatorResult`
- [x] Scope gate: no `its-magic-kernel/` extract; no TS validator rewrite; no `OPENCODE_*` on standalone path; no AgentKernel amendment; no US-0135+; no wrapping all kit scripts; no live provider CI
- [x] Status gate: US-0134 remains OPEN; AC checkboxes unchecked; intake JSON not mutated; US-0133 / BUG-0018 not reopened; R-0120 / R-0121 not wiped

## Files to touch (scope)

### New (create)

- `standalone/packages/kernel-bridge/package.json` + `src/` (index, types, locate, handshake, spawn, artifacts)
- `standalone/packages/kernel-bridge/supported-kernel-range.json`
- `its_magic/kernel-contract.json` + `template/its_magic/kernel-contract.json`
- `scripts/status_reconcile_validate.py` + `template/scripts/status_reconcile_validate.py`
- `standalone/tests/contract/us0134.contract.test.ts` (or equivalent `node:test` file matching existing glob)
- optional `standalone/tests/unit/` timeout-mapping mocks
- `tests/us0134_contract_test.py` + `template/tests/us0134_contract_test.py`
- temp fixture factories (not in-tree mutation of kit version file)
- `sprints/S0138/t-anch-verification.md` (execute)

### Edit (scoped)

- `docs/engineering/context/installer-owned-paths.manifest` (+ installer consumers / template twin if paired) — add missing allowlist scripts + libs
- `docs/engineering/runbook.md` — upgrade recipe for new manifest + scripts
- `standalone/package-lock.json` — `semver@7.8.5` / `@types/semver@7.8.0` via kernel-bridge only
- `.github/workflows/ci.yml` — extend existing standalone Windows+Linux job only if glob would miss new tests; do not fold into kit `TEST_COMMAND`
- existing US-0133 kit grep (files-omit / no-Pi) — extend to deny Pi inside `kernel-bridge`

### Verify read-only (no mutation)

- `docs/engineering/architecture.md # US-0134`
- `decisions/DEC-0134.md`
- `docs/engineering/research.md ## R-0122` (and R-0120 / R-0121 intact)
- `docs/product/backlog.md ## US-0134` Status/ACs (US-0045)
- `docs/product/acceptance.md` US-0134 row
- `handoffs/intake_evidence/US-0133-0148-intake-20260911.json`
- `standalone/packages/pi-kernel` AgentKernel / DEC-0133 surfaces
- Kit OpenCode plugin `/auto` (US-0125 / BUG-0018)

### Compose-guard UNCHANGED (DO NOT TOUCH)

| File / surface | Reason |
|---|---|
| Backlog Status / AC checkboxes | US-0045 — closure only |
| `architecture.md` body beyond T-anch verify | locked in /architecture |
| `decisions/DEC-0134.md` body | locked in /architecture |
| R-0122 / R-0121 / R-0120 | do not rewrite; do not wipe R-0120/R-0121 |
| `# US-0133` / DEC-0133 / AgentKernel | compose locate-path only |
| Kit `package.json` `workspaces` | kit is not a workspace root |
| Kit `files` whitelist expansion | omit `standalone/` |
| OpenCode plugin Python bridge | US-0125 parallel host |
| US-0135..US-0148 bodies | OUT OF SCOPE |
| BUG-0018 / OpenCode `/auto` | DONE — do not reopen |
| RuntimeConfig range | US-0138 |
| TypeScript UAT planner | US-0142 |
| Live provider CI | forbidden |

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-005, T-007, T-009 |
| AC-2 | T-002, T-009 |
| AC-3 | T-003 |
| AC-4 | T-004, T-005, T-007 |
| AC-5 | T-006 |
| AC-6 | T-008 |
| DC / architecture | T-anch |

**Surjectivity check**: 6/6 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
