# Release Notes — S0184 / BUG-0037

- **Sprint**: `S0184`
- **Bug**: `BUG-0037` — restores the canonical structured story-block contract on the OpenCode PO and `/intake` surfaces: `po.md` is the sole template source, `/intake` references it before `STOP`, and both active/template pairs are byte-identical.
- **Release date**: `2026-10-21T16:03:14Z` (UTC)
- **orchestrator_run_id**: `auto-20261020-bug0037`
- **fresh_context_marker**: `release-BUG0037-S0184-20261021T160314Z-fresh`
- **model_id**: `openai/gpt-5.6-terra`
- **runtime_proof_id**: `rp-auto-20261020-bug0037-release-release-20261021T160314Z-BUG-0037`
- **proof_hash**: `36aae656139a36723e8c45c081f01487a9122850ce6ab9ddb390f284167d859d`
- **proof_issued_at**: `2026-10-21T16:03:14Z`; **proof_ttl_seconds**: `3600`; **proof_ttl**: `2026-10-21T17:03:14Z`
- **release_version**: none (workflow-only; kit semver unchanged)
- **npm_published**: `false`
- **git_pushed**: `false`

## Verdict

**RELEASE_PASS**. BUG-0037 remains **OPEN/P1**. Closure exclusively owns any DONE flip and acceptance ticks.

## Gate summary

| Gate | Result |
|---|---|
| BUG-0037 contract | **PASS** — `python -m pytest tests/bug0037_story_shape_contract_test.py -v` → 5 passed / 0 failed. |
| focused regression | **PASS** — `BUG0037_FOCUSED_REGRESSION_OK`; active/template PO and intake pairs match. |
| canonical linkage | **PASS** — `[BUG_VALIDATION_OK]`; BUG remains OPEN and unchecked. |
| QA / UAT | **PASS** — QA has 0 blockers; non-placeholder `VERIFY_PASS` UAT is 5/5. |
| verify-work authority | **PASS** — exact incoming pair key, tuple, hash, and TTL match. |
| scope | **PASS** — R-0174 Option A, architecture locks, US-0161, exact template/directive split, and no-scope-breach guard hold. |
| release proof | **PASS** — strict six-tuple hash minted and independently recomputed MATCH. |
| publish / sync | **NOT PERFORMED** — no publish, commit, push, or deployment. |
| backlog | **deferred to `/closure`** — no BUG status, AC, or acceptance mutation. |

## Run

- **start_command**: not applicable (static OpenCode content-and-contract release)
- **runtime_mode**: local
- **runtime_context_ref**: not applicable

## Connect

- **service_url**: not applicable
- **service_port**: not applicable
- **health_endpoint**: not applicable

## Verify

1. Run `python -m pytest tests/bug0037_story_shape_contract_test.py -v` → 5 passed.
2. Run `python scripts/bug_issue_validate.py --backlog docs/product/backlog.md --check-acceptance` → `[BUG_VALIDATION_OK]`.
3. Confirm `.opencode/agents/po.md` and `template/.opencode/agents/po.md` are byte-identical, and likewise for the intake pair.
4. Validate the release state/brief pair by its exact key, locked tuple, and strict hash.

## Credentials

None required. No secret or `.env` value was read.

## Known Issues

- No live host probe is claimed or required; evidence is static contract verification.
- BUG-0037 remains **OPEN/P1** until `/closure`; AC-1..AC-5 and acceptance remain unchecked.

## Next

Fresh `/closure` as **release** only after parent validation of the continuation pair. This release child does not spawn it.
