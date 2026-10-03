# S0161 Execute Progress - BUG-0030

## Completed

- Added the documented `.opencode/commands/auto.md` command and template twin.
- Retired the managed private TUI/RPC route and migrated all three installers.
- Added contract, parity, and real-host command-registration coverage.
- Added `ITS_MAGIC_OPENCODE_SMOKE_MODEL` so the session-admission smoke uses an
  explicit configured model instead of the server default.

## Verification

- `ITS_MAGIC_OPENCODE_SMOKE=1 python -m pytest tests/bug0030_opencode_auto_command_test.py -q`
  -> `5 passed, 1 skipped`.
- `python scripts/check_intake_template_parity.py --repo . --scope bug-0030`
  -> `INTAKE_TEMPLATE_PARITY_OK`.
- `python scripts/bug_issue_validate.py --repo . --check-acceptance`
  -> `BUG_VALIDATION_OK`.

## Remaining QA Input

Run the credentialed smoke with a model known to be available locally:

```powershell
$env:ITS_MAGIC_OPENCODE_SESSION_SMOKE='1'
$env:ITS_MAGIC_OPENCODE_SMOKE_MODEL='openai/gpt-5.6-terra'
python -m pytest tests/bug0030_opencode_auto_command_test.py -q
```

The command verifies durable `/auto` prompt admission only; it does not claim
provider completion.

## QA Evidence

The credentialed command completed with `5 passed, 1 skipped`. The skipped test
was the independent command-registration smoke; the stronger session-admission
smoke passed with `openai/gpt-5.6-terra`.
