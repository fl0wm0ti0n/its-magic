# Sprint S0154 — Task checklist (US-0147)

Total tasks: 12 (T-anch + T-001..T-011). SPRINT_MAX_TASKS=12; SPRINT_AUTO_SPLIT=1; no split (at cap). T-anch retained as NO-OP verification. Seeds 1:1 from `docs/engineering/architecture.md` `# US-0147`. Sprint id **S0154** locked (S0153 = US-0146 — do not reuse).

**Isolation**: `tl-US0147-sprintplan-20260917T205000Z-fresh` · `model_id=inherit` · `orchestrator_run_id=auto-20260917-us0146`

## Task execution order

1. T-anch (NO-OP / verification)
2. T-001 (manifest + template standalone mirror)
3. T-002 (bootstrap hook + triple-installer wiring)
4. T-003 (adoption classifier)
5. T-004 (fresh init + deny_overwrite)
6. T-005 (staging + interrupted rollback)
7. T-006 (kernel preflight + runtime-metadata.json)
8. T-007 (itsm shim)
9. T-008 (itsm setup browser)
10. T-009 (uninstall-standalone)
11. T-010 (runbook + template doc parity)
12. T-011 (ten `test_us0147_*`)

## Task checklist

- [x] **T-anch**: Verify `# US-0147` H1 in `docs/engineering/architecture.md`; DEC-0147 Accepted; R-0144 DQ1–DQ10 LOCKED; ten-marker table locked; path/hook pins present; compose guards (US-0140..US-0146 DONE; US-0145/US-0148 OUT; no kit cli.json/tui.json; no auto.md restore; kit `files` omit root `standalone/`). Record to `sprints/S0154/t-anch-verification.md`. NO mutation to `architecture.md` / `DEC-0147.md` / R-0144 in /execute. (DC / architecture baseline; NO-OP)

- [x] **T-001**: Extend `docs/engineering/context/installer-owned-paths.manifest` (+ `template/` mirror) with standalone paths, `deny_overwrite`, staging dir; scaffold `template/.its-magic/standalone/` mirror (apps/cli, apps/tui, packages/*, lockfile). FRAMEWORK_KIT_REPO in-tree pin allowed for kit-dev. (AC-1, AC-2 foundation)

- [x] **T-002**: Implement `bootstrap_standalone_runtime_installer_hook` in `installer.py` (post host-config refresh, pre runbook bootstrap); PS1/sh invoke same Python subcommand; repair via `its-magic --mode upgrade --standalone-bootstrap` / `--mode missing` idempotent; `STANDALONE_BOOTSTRAP_FAILED` on failure. (AC-1)

- [x] **T-003**: Implement `classifyProjectAdoptionProfile(target_root)` composing US-0134 `locateProjectKernel`; profiles fresh / existing-its-magic / host_profile advisory; fail-closed `ADOPT_PARTIAL_MARKERS` when 1–2 of 3 kernel markers match; no host folder deletion. (AC-3, AC-4)

- [x] **T-004**: Fresh init via `template/` skeleton only (no US-0001..US-0132 backlog clone); enforce `install_include_paths` vs `deny_overwrite` for locals, credentials, browser profiles, `.its-magic/runtime/**`, operator auth stores, project source. (AC-2, AC-5)

- [x] **T-005**: Staged updates under `.its-magic/install-staging/<run_id>/`; success updates `runtime-metadata.json`; failure rolls back staging only with `INSTALL_INTERRUPTED_ROLLBACK_OK` and preserved user layers list. (AC-1, AC-5)

- [x] **T-006**: Kernel-bridge preflight (`getKernelVersion`, `readContractManifest`, semver range) before `itsm` shim write; persist `.its-magic/standalone/runtime-metadata.json` (`kernel_version`, `contract_schema_version`, `supported_range`, `validators[]` hash); surface `KERNEL_*` compose US-0134; no skip when `FRAMEWORK_KIT_REPO=1`. (AC-1, AC-6)

- [x] **T-007**: Write `.its-magic/bin/itsm` shim → standalone workspace `apps/cli` bin; optional repo-root `bin/itsm` only when operator opts in. (AC-1)

- [x] **T-008**: Wire `itsm setup browser` delegating to US-0142 Playwright install scoped under `.its-magic/standalone/node_modules`; install does not silently download browsers unless `ITS_MAGIC_INSTALL_BROWSER=1`; offline `INSTALL_BROWSER_OFFLINE`; failed browser setup does not roll back framework install (`browser_prereq=missing` in metadata). (AC-1, AC-7)

- [x] **T-009**: `its-magic --mode uninstall-standalone` removes `.its-magic/standalone/`, `itsm` shims, install-staging, runtime-metadata; preserves `.cursor/`, `.opencode/`, `its_magic/` framework copy, user locals, project source; version mismatch advisory `KIT_VERSION_COEXISTENCE`. (AC-7)

- [x] **T-010**: Update `docs/engineering/runbook.md` (+ template operator doc parity) with fresh setup, auth, adoption, coexistence, update, uninstall, troubleshooting sections per DEC-0147 AC-7. (AC-7)

- [x] **T-011**: Create ten hermetic pytest/installer fixtures exactly: `test_us0147_fresh_install_manifest_parity`, `test_us0147_upgrade_preserves_user_layers`, `test_us0147_adopt_cursor_only_repo`, `test_us0147_adopt_opencode_only_repo`, `test_us0147_adopt_both_hosts_repo`, `test_us0147_interrupted_update_rollback`, `test_us0147_kernel_mismatch_fail_closed`, `test_us0147_browser_setup_explicit_gate`, `test_us0147_uninstall_preserves_hosts`, `test_us0147_runbook_sections_present`. Windows + Linux. Do not weaken US-0146 compose tests. (AC-1..AC-8)

## Locked 10-marker table

| # | Marker | AC |
|---|---|---|
| 1 | `test_us0147_fresh_install_manifest_parity` | AC-1, AC-2 |
| 2 | `test_us0147_upgrade_preserves_user_layers` | AC-5 |
| 3 | `test_us0147_adopt_cursor_only_repo` | AC-3, AC-4 |
| 4 | `test_us0147_adopt_opencode_only_repo` | AC-3, AC-4 |
| 5 | `test_us0147_adopt_both_hosts_repo` | AC-3, AC-4 |
| 6 | `test_us0147_interrupted_update_rollback` | AC-1 |
| 7 | `test_us0147_kernel_mismatch_fail_closed` | AC-6 |
| 8 | `test_us0147_browser_setup_explicit_gate` | AC-1 |
| 9 | `test_us0147_uninstall_preserves_hosts` | AC-7 |
| 10 | `test_us0147_runbook_sections_present` | AC-7 |

## Integration verification (post T-011)

- [ ] Test gate: ten/ten `test_us0147_*` green Win+Linux; US-0146 `test_us0146_*` compose still green
- [ ] Installer gate: triple parity via single Python hook entry; kit `files` omit root `standalone/`
- [ ] Scope gate: no credentials / `.env` reads; no `auto.md` restore; no US-0148 daemon install
- [ ] Status gate: US-0147 remains OPEN; AC-1..AC-8 unchecked; US-0140..US-0146 remain DONE

## AC → Task surjective coverage

| AC | Task(s) |
|---|---|
| AC-1 | T-001, T-002, T-005, T-006, T-007, T-008 (T-011 m1,m6,m7,m8) |
| AC-2 | T-004 (T-011 m1) |
| AC-3 | T-003 (T-011 m3,m4,m5) |
| AC-4 | T-003 (T-011 m3,m4,m5) |
| AC-5 | T-004, T-005 (T-011 m2) |
| AC-6 | T-006 (T-011 m7) |
| AC-7 | T-008, T-009, T-010 (T-011 m9,m10) |
| AC-8 | T-011 (full matrix) |
| DC / architecture | T-anch |

**Surjectivity check**: 8/8 ACs covered. No `PLAN_AC_COVERAGE_GAP`.
