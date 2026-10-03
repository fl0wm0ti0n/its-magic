# Release Notes — S0161 / BUG-0030

- **Sprint**: `S0161`
- **Bug**: `BUG-0030` — OpenCode `/auto` private TUI/RPC route must be replaced by the documented Markdown command + `auto` agent (A1; 5 ACs)
- **Story**: (none)
- **Release date**: `2026-09-27T14:35:00Z` (UTC)
- **orchestrator_run_id**: `auto-20260927-bug0030`
- **delivery_mode**: `ultra_lean`
- **macro_phase**: `build+verify`
- **policy_mode**: `confirm` (`RELEASE_PUBLISH_MODE=confirm`; operator confirm absent this turn → npm publish deferred)
- **branch**: `local` (no push; `SYNC_POLICY_MODE=disabled`)
- **fresh_context_marker**: `release-BUG0030-20260927T143500Z-fresh`
- **runtime_proof_id**: `rp-auto-20260927-bug0030-release-release-20260927T143000Z-BUG-0030`
- **proof_hash**: `E3BFED1E16C0F33DBB86D43AD35B8B517A281AD0FB547747272C5EEB532A752D`
- **proof_issued_at**: `2026-09-27T14:30:00Z` ; **proof_ttl**: `2026-09-27T15:30:00Z` (ttl_seconds=3600)
- **release_version**: (none — workflow-only release; no kit semver bump; kit remains `0.1.9`)
- **npm_published**: `false`

## Verdict
RELEASE_PASS. Mandatory gates 1, 2, 3, 4a, 4b all green on rerun-after-remediation.
Prior `/release` pass `2026-09-27T14:17:37Z` was RELEASE_BLOCKED on
PHASE_CONTEXT_ISOLATION_MISSING + RUNTIME_PROOF_MISSING — remediation performed
by orchestrator and re-verified this pass.
Publish deferred (PUBLISH_CONFIRMATION_REQUIRED). No backlog mutation (closure
owns OPEN→DONE). No npm publish. No git push.

## Summary
BUG-0030 ships the documented OpenCode Markdown command route for `/auto`:
- `.opencode/commands/auto.md` active + template twin — frontmatter `agent: auto`;
  body non-STOP-only, canonical spawn-only orchestration prompt.
- Managed private TUI/RPC `/auto` route retired from active + template config;
  `.opencode/plugins/its-magic-auto/{index,tui,rpc}.ts` absent (active+template);
  `tui.json` plugin list does not register the legacy route; `orchestrator.ts`
  has no `ctx.rpc.register` in Plugin.define setup.
- All three installers (Python / Bash / PowerShell) migrated: `upgrade --host
  opencode|both` installs the managed command and removes only the managed
  legacy TUI/RPC assets and configuration while preserving unrelated user
  `tui.json` keys / plugins.
- Six `test_bug0030_*` markers (4 deterministic + 2 opt-in host session-command smokes).
- `ITS_MAGIC_OPENCODE_SMOKE_MODEL` knob — opt-in real-host smoke uses explicit
  configured model (`openai/gpt-5.6-terra`) instead of server default.
- BUG-0027 manual-persistence behavior preserved (compose 10/10 green).

No live OpenCode CLI TUI PASS. No fake browser PASS. No toast-repair claim.
No provider-completion claim (NB1).

## What's new
- BUG-0030: documented `.opencode/commands/auto.md` (active + template) routing
  `/auto` through `agent: auto` with the canonical spawn-only prompt; private
  TUI/RPC legacy route retired from active/template configuration and from all
  three installer upgrade paths; six `test_bug0030_*` markers;
  `ITS_MAGIC_OPENCODE_SMOKE_MODEL` knob; BUG-0027 behavior preserved.

## ACs satisfied (QA + verify-work, UAT 6/6)
**5/5 PASS** (backlog ACs remain unchecked until `/closure`):

| AC | Status (slice evidence) |
|----|--------|
| AC-1 | PASS — real host `/auto` selects `auto` and admits canonical spawn-only prompt; credentialed `session.command("auto")` smoke observed `agent: auto` + durable canonical prompt on opencode 1.18.32 (model `openai/gpt-5.6-terra`); no `OPENCODE_AUTO_TUI_DEFINED_UNBRANDED` |
| AC-2 | PASS — `.opencode/commands/auto.md` documented command surface; frontmatter `agent: auto`; body not STOP-only |
| AC-3 | PASS — `@opencode/plugin/rpc`, `localRpcDefine`, `client.rpc`, `ctx.rpc.register`, invented localhost endpoint not on active `/auto` route |
| AC-4 | PASS — host-real integration proof (not mock-only); `live_opencode_session_command_pass_claimed=true` |
| AC-5 | PASS — upgrade installs managed command, removes only managed legacy TUI/RPC route, preserves unrelated `tui.json`, active/template parity |

## Test results (release — live this pass)
- Scoped bug0030 (deterministic): `pytest tests/bug0030_opencode_auto_command_test.py -v` → 4 passed, 2 skipped (0.12s; opt-in host smokes skipped by design)
- Credentialed bug0030 (carried): `ITS_MAGIC_OPENCODE_SESSION_SMOKE=1 ITS_MAGIC_OPENCODE_SMOKE_MODEL=openai/gpt-5.6-terra ...` → 5 passed, 1 skipped
- Compose (regression): `pytest tests/bug0027_opencode_manual_phase_persist_test.py -q` → 10/10 (0.86s)
- Parity: `check_intake_template_parity.py --repo . --scope all` → `[INTAKE_TEMPLATE_PARITY_OK]`
- Metadata guard: `check-user-visible-metadata.py --repo .` → exit 0
- Acceptance validator (bridge): `bug_issue_validate.py --repo . --check-acceptance` → `[BUG_VALIDATION_OK]` exit 0
- Canonical harness: not re-run; `harness_fail_zero_claimed=false`

## Gate snapshot
- check_in_tests      = PASS (scoped + compose + parity + metadata + bridge)
- qa                  = PASS (0 blockers; B-1 CLOSED)
- verify_work         = PASS (5/5 ACs; 6/6 UAT; `verified_ready=true`)
- uat                 = PASS (`contract_tests_primary` + live session-command prompt-admission)
- isolation           = PASS (execute+qa+verify-work in state.md; distinct fresh_context_marker)
- strict_runtime_proof = PASS (execute+qa+verify-work recomputed MATCH; not STALE)
- release_proof       = E3BFED1E16C0F33DBB86D43AD35B8B517A281AD0FB547747272C5EEB532A752D (minted + recorded)
- publish             = deferred (PUBLISH_CONFIRMATION_REQUIRED; `npm_published=false`)
- sync                = not_eligible (`SYNC_POLICY_MODE=disabled`)

## Run
```
python -m pytest tests/bug0030_opencode_auto_command_test.py -v                       # 4/4 pass + 2 skipped (host smokes)
$env:ITS_MAGIC_OPENCODE_SESSION_SMOKE='1'; $env:ITS_MAGIC_OPENCODE_SMOKE_MODEL='openai/gpt-5.6-terra'
python -m pytest tests/bug0030_opencode_auto_command_test.py -q                       # 5/5 pass + 1 skipped (credentialed)
python -m pytest tests/bug0027_opencode_manual_phase_persist_test.py -q               # 10/10 pass
python scripts/check_intake_template_parity.py --repo . --scope all                   # [INTAKE_TEMPLATE_PARITY_OK]
python scripts/bug_issue_validate.py --repo . --check-acceptance                      # [BUG_VALIDATION_OK]
# After operator confirm:
# its-magic --target <repo> --mode upgrade --host opencode|both
# Restart OpenCode; verify /auto selects agent "auto" and admits canonical prompt.
```

## Verify
1. `pytest tests/bug0030_opencode_auto_command_test.py -v` → 4/4 deterministic pass (2 host smokes SKIPPED by design)
2. (Optional credentialed) with env → 5/5 pass (session.command("auto") observed `agent: auto` + durable canonical prompt)
3. Compose `tests/bug0027_opencode_manual_phase_persist_test.py` → 10/10 (BUG-0027 preserved)
4. Parity `--scope all` → `[INTAKE_TEMPLATE_PARITY_OK]`
5. Confirm `.opencode/plugins/its-magic-auto/{index,tui,rpc}.ts` absent active+template; `tui.json` plugin[] empty; `orchestrator.ts` has no `ctx.rpc.register` in `Plugin.define` setup
6. Confirm `.opencode/commands/auto.md` active + template present with `agent: auto` frontmatter + non-STOP-only body
7. UAT honesty: `live_opencode_session_command_pass_claimed=true`; `live_opencode_cli_tui_pass_claimed=false`; `toast_repair_claimed=false`; `provider_completion_claimed=false`
8. Operator post-ship (optional): install / upgrade kit on a target repo; restart OpenCode; verify `/auto` works.

## Known Issues
- **NB1**: full auto-lifecycle provider completion (phase spawn loop) remains operator UAT after release; verify-work proves prompt admission only. `provider_completion_claimed=false`.
- Live OpenCode CLI TUI: residual operator re-probe after ship. `live_opencode_cli_tui_pass_claimed=false`.
- BUG-0030 backlog status remains OPEN until `/closure`. AC-1..AC-5 in `docs/product/backlog.md` + `docs/product/acceptance.md` (L218) unchecked (closure owns).
- BUG-0023 / BUG-0024 / BUG-0027 non-reopen boundary held.
- BUG-0022 / BUG-0026 remain OPEN (untouched).
- npm publish deferred (`RELEASE_PUBLISH_MODE=confirm`; no kit semver bump; kit 0.1.9).
- Git push not run (`SYNC_POLICY_MODE=disabled` → `push_decision=not_eligible`).

## Evidence refs
- `sprints/S0161/release-findings.md` (superseded blocked baseline @ 14:17:37Z + this rerun)
- `sprints/S0161/qa-findings.md`, `sprints/S0161/uat.json`, `sprints/S0161/uat.md`
- `sprints/S0161/sprint.md`, `tasks.md`, `progress.md`, `summary.md`
- `handoffs/qa_to_verify.md` (top section — VERIFY_PASS handoff)
- `handoffs/dev_to_qa.md` (top section — execute handoff)
- `docs/engineering/state.md` (13 S0161 refs: 3 isolation checkpoints + 3 strict-proof tuples)
- `docs/engineering/architecture.md` `# BUG-0030`
- `docs/engineering/runbook.md` `### OpenCode /auto command migration (BUG-0030)`
- `docs/product/backlog.md` `### BUG-0030` (OPEN)
- `docs/product/acceptance.md` L218 (BUG-0030 unchecked)
- `handoffs/release_queue.md` (S0161 = `released`)
- `scripts/token_cost_lib.py` `compute_strict_proof_hash`
- `scripts/bug_issue_validate.py` `--check-acceptance`
