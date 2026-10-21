# UAT — Sprint S0179 / US-0162

- **uat_lifecycle**: placeholder
- **story status**: US-0162 stays **OPEN**. AC-1..AC-12 stay unchecked in `docs/product/backlog.md`. Closure owns the DONE flip.
- **results**: none yet

## Target

US-0162 (OPEN).

## Acceptance criteria (no results)

| AC | Criterion | Result |
|---|---|---|
| AC-1 | A phase context pack replaces full-file memory reads, with pack-first read order and the hard budgets 6000 / 4000 / 2 / 3000. | |
| AC-2 | Architecture, state, po_to_tl, backlog, and acceptance are not one linear prompt surface. Active detail is sharded; the archiver stays unchanged. | |
| AC-3 | Proof bodies and metrics stay in machine files. The pack stores refs and a separate `pack_hash`. | |
| AC-4 | Always-on rules shrink to the eight-line kernel. Pasted copies become pointers. Safety gates stay named. | |
| AC-5 | Handoffs are deltas: story, from, to, changed, open, required_reads, do_not_reload. | |
| AC-6 | Memory audit is deterministic first. A clean audit records `model_calls=0`. | |
| AC-7 | The same unchanged path, sha256, and section is not fully read twice in one phase. Duplicate large reads stay under 10 percent. | |
| AC-8 | `.its-magic/model-routing.json` is the source of truth when present. Providers and models stay separate. API keys are env names only. | |
| AC-9 | Complexity is classified without a model call. Fallback records one of the five codes and stops at the failure cap. | |
| AC-10 | `TOKEN_PROFILE` and the model profile stay separate. Existing `MODEL_*` settings map through an adapter. | |
| AC-11 | QA, UAT, release, isolation, and strict-proof gates stay. US-0048, US-0056, US-0069, and US-0039 are not weakened. | |
| AC-12 | Contract tests cover the ten `test_us0162_*` markers, and benchmark fields are recorded without removing a gate. | |
