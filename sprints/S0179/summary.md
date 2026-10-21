# Sprint S0179 summary — US-0162

- sprint_id: S0179
- story_id: US-0162
- status: EXECUTE_FAIL
- tasks: T-anch and T-001..T-011 checked
- US-0162 stays **OPEN**. AC-1..AC-12 stay unchecked.
- plan-verify: skipped (`ultra_lean_not_in_resolved_phase_plan`)
- No git commit, push, or npm publish. No `.env` read.

## What shipped

`scripts/model_routing_lib.py` owns `.its-magic/model-routing.json`. An absent file still returns `resolve_model_for_phase`. A present file resolves explicit invocation, task, phase, role, complexity, then global default. `MODEL_*` maps through the adapter and is not deleted. Providers stay separate from models. `api_key_env` is a name only. The router does not read `.env`.

`scripts/build_phase_context.py` writes a budgeted pack. Hard caps are 6000 / 4000 / 2 / 3000. `lean` stays inside them. `full` uses the same caps. Over the single-artifact cap, the builder returns a section pointer. `pack_hash` is a SHA-256 of the pack JSON and is not a DEC-0038 proof.

The active architecture item is `docs/engineering/architecture/US-0162.md` plus an index stub in the hot file. The archiver was not edited. The kernel is eight lines in `.cursor/rules/core.mdc` and the template twin. Phase commands, agents, and the skill point at that file. Handoff deltas use story, from, to, changed, open, required_reads, and do_not_reload. `scripts/memory_audit_deterministic.py` records `model_calls=0` on a clean fixture. Duplicate reads are counted in `.its-magic/metrics/read-dedup.jsonl`.

## Tests

- `python -m pytest tests/us0162_token_routing_contract_test.py -q`: 10 passed / 0 failed.
- `python scripts/check-user-visible-metadata.py --repo .`: exit 0.
- `python scripts/enforce-triad-hot-surface.py --check --repo .`: exit 0 before the execute checkpoint append.
- `powershell -ExecutionPolicy Bypass -File tests/run-tests.ps1`: exit 1. `tests/report.md` Timestamp 2026-10-16T17:02:28Z Pass 873 / Fail 8.

The eight failures are not S0179 regressions:

- `slim auto command contract markers pass`
- `check_intake_template_parity` scopes `dev-environment`, `dev-environment` (US-0099), `model-tier` (US-0101), `model-tier-overrides` (US-0102), and `arch-linkage` (US-0129), each reporting `.cursor/scratchpad.md` byte mismatch against the template
- `validate_readme_feature_coverage repo --report` and the idempotent rerun: `README_FEATURE_COVERAGE_GAP:BUG-0029`

This phase did not edit the scratchpad, `config.json`, or the README, and it did not touch BUG-0029.
