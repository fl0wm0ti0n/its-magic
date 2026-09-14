# Architecture archive pack (2026-09-13)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 21
- First archived heading: `# US-0129 — Architecture hot-surface rollover linkage guard (active contract preservation)`
- Last archived heading: `# US-0129 — Architecture hot-surface rollover linkage guard (active contract preservation)`
- Verification tuple (mandatory):
  - archived_body_lines=148
  - preamble_lines=1
  - retained_body_lines=2973

---

# US-0129 — Architecture hot-surface rollover linkage guard (active contract preservation)

## Overview

**US-0129** ships a fail-closed pre/post architecture-rollover linkage guard so contract-test H1 story/bug headings stay on the active `docs/engineering/architecture.md` hot surface. US-0126 loop-2 hit **B-1**: `rollover_architecture` archived US-0089 / US-0090 / US-0091 / US-0093 / BUG-0011 (and a body token) to `architecture-pack-20260825.md` while `tests/auto_command_contract_test.py` and `tests/readme_feature_coverage_fixtures_test.py` still `assertIn` those headings on the live file → harness Fail:7. Headings were restored in execute loop-2; **no guard shipped**. This story is that guard. Do **not** reopen US-0126 product scope.

The gap: `scripts/enforce-triad-hot-surface.py` `rollover_architecture` splits via `split_arch_stories` (DEC-0073 / BUG-0010), pops oldest blocks while `ARCH_HOT_MAX_LINES` / `ARCH_HOT_MAX_STORY_SECTIONS` are exceeded, writes an archive pack, then overwrites the hot file. `/refresh-context` step 4 runs `--rollover` then `--check` (`STATE_ARCHIVE_REQUIRED` / `ARTIFACT_HOT_SURFACE_OVERSIZE` only). Linkage is not a triad cap check. D10: cap numbers do **not** change — B-1 is linkage, not “caps too low”.

This is an **additive guard + reason-code + optional stub repair + command wiring + docs + parity + contract-test** change. Companion **DEC-0129** (new fail-closed family `ARCH_LINKAGE_ROLLOVER_BLOCKED`, new `security_hard` matrix row, new default-off scratchpad flag, stub-shape/insertion contract). Compose DEC-0054 / DEC-0073 / US-0049 / US-0126 B-1 fixture only.

**Research anchor**: **R-0113** (DQ1–DQ8 LOCKED). **Companion DEC**: **DEC-0129** (Accepted; authored THIS phase). **EARLY_RESEARCH**: consumed from R-0113 (fail-closed vs fail-open; Pact consumer-driven contracts; L0 opt-in `autoCorrect` — supports locks, no new R-id).

**Fresh context marker**: `tl-US0129-architecture-20260827T073000Z-fresh`
**Orchestrator run id**: `auto-20260827-01`
**Timestamp**: 2026-08-27T07:30:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (orchestrator-owned; CROSS_MODEL_REVIEW=1 critic of architecture is orchestrator-owned)

## Approach locked (A1 — from R-0113 DQ1–DQ8)

**Approach A1** (locked): New `scripts/arch_linkage_guard.py` (+ `template/scripts/` mirror) **wraps** `python scripts/enforce-triad-hot-surface.py --rollover`. Do **not** change `rollover_architecture` heading-split semantics, pack naming, or `ARCH_HOT_MAX_*` numbers (D4 / D10 / DEC-0054 compose).

1. **Discover** required active headings at runtime via `discover_required_arch_headings(repo) -> frozenset[str]` (stdlib only). Scan `tests/**/*_test.py`, exclude `tests/.tmp*`. Include a token only when the test reads live `docs/engineering/architecture.md` and asserts membership / `find` / `startswith` of a literal H1 story/bug heading. **No hand-maintained YAML/manifest** (DQ2 — manifest drift is the B-1 class). Live set at R-0113 (evidence, not a frozen manifest): US-0089, US-0090, US-0091, US-0093, BUG-0009, BUG-0010, BUG-0011, BUG-0012, US-0109. Helper re-discovers at runtime.
2. **Pre-hook**: reuse `split_arch_stories` + the same while-pop predicate as `rollover_architecture` (import/call; do **not** copy-fork). If any required heading is in the predicted moved set and `ARCH_LINKAGE_AUTO_REPAIR=0` → emit `ARCH_LINKAGE_ROLLOVER_BLOCKED` (story/bug id, missing heading, predicted pack path, remediation) and **do not write** archive pack or hot file.
3. **`--rollover`**: existing archiver unchanged.
4. **Repair-on** (`ARCH_LINKAGE_AUTO_REPAIR=1`): allow `--rollover` to archive **full** bodies; then inject **minimal H1 stubs** into the retained hot file (DQ8). Idempotent. One `state.md` audit row per repair event.
5. **Post-hook**: re-run discovery against active `architecture.md`; if any required heading still missing → `ARCH_LINKAGE_ROLLOVER_BLOCKED` (packs are append-only; no pack rollback).
6. **Wire** `/refresh-context` step 4: after cap read, **pre-guard → `--rollover` → post-guard → existing `--check`**.
7. Classify `ARCH_LINKAGE_ROLLOVER_BLOCKED` as **`security_hard`** (`auto_repair_kind=n/a`, `cap=0`). Never skip — including under `AUTONOMY_STOP_POLICY=auto_repair_then_skip`. Repair is a **guard-flag** path, **not** a 10th `auto_repair_kind` (DEC-0119 compose). Flag is **not** in `AUTONOMY_PRESET` expansion.

Q1 accepted: **8** `test_us0129_*` markers (fold “archiver unchanged” into marker 2). Q2 accepted: **DEC-0129** story-aligned (not sequential DEC-0127). Q3 accepted: **heading-only** stubs; body-token residual R3 documented, not in v1.

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | **Wrap `--rollover` with `arch_linkage_guard.py` pre+post + default-off stub repair + security_hard block + 8 markers + DEC-0129** | **Preferred** — additive; archiver UNCHANGED; AC-1..AC-6 provable. |
| A2 (rejected) | Mutate `rollover_architecture` internals to skip required headings | **Rejected** — D4 / DEC-0054 compose; changes heading-split / pack bytes. |
| A3 (rejected) | Hand-maintained YAML/manifest of required headings | **Rejected** — DQ2; manifest drift is the B-1 failure class. |
| A4 (rejected) | Default-on auto-repair | **Rejected** — DQ1; `AUTONOMY_PRESET=full` would silently rewrite architecture.md. |
| A5 (rejected) | `auto_repair_then_skip` / 10th `auto_repair_kind` | **Rejected** — DQ4; security_hard never skip; DEC-0119 9-kind taxonomy UNCHANGED. |
| A6 (rejected) | Sequential companion DEC-0127 | **Rejected** — US-0127/US-0128/US-0130 documented “none”; story-aligned DEC-0129. |
| A7 (rejected) | Full-section restore or named body-token restore | **Rejected** — D10 / Q3 heading-only; residual R3 (US-0100 `{semver}-release-notes.md`) stays documented. |
| A8 (rejected) | Raise `ARCH_HOT_MAX_*` instead of a guard | **Rejected** — D10; B-1 is linkage, not cap height. |

## Components

### Linkage guard script (DQ2+DQ3 LOCKED — AC-1)

`scripts/arch_linkage_guard.py` (+ `template/scripts/arch_linkage_guard.py` byte-identical). CLI invoked pre and post `--rollover`. Helper `discover_required_arch_headings(repo)`. Pre-simulates pop via imported `split_arch_stories` + the same while-pop predicate (`dry_run` today lacks heading lists — guard simulates pop itself, or may extend `dry_run` in-story without changing success-path pack bytes). Stdlib only; no network; no `.env`.

### Fail-closed block (DQ4+DQ5 LOCKED — AC-2)

Emit `ARCH_LINKAGE_ROLLOVER_BLOCKED` with: story/bug id, missing heading token, archive pack path (predicted or written), remediation (`set ARCH_LINKAGE_AUTO_REPAIR=1` for stub restore, or restore H1s manually, then rerun `--rollover`). Register new `## US-0129 — Architecture hot-surface rollover linkage guard` in `docs/engineering/reason_codes.md` after the last story family, before `## Other stories`. One-code table `### ARCH_LINKAGE_*`. Do **not** extend US-0110 / US-0127 / US-0128 / US-0111 tables. `ARCH_LINKAGE_REPAIR_FAILED` is message text under the same code unless execute proves a split. Matrix: `scripts/data/autonomy_stop_matrix.yaml` + `docs/engineering/autonomy-stop-matrix.md` row `security_hard`.

### Optional auto-repair (DQ1+DQ8 LOCKED — AC-3)

Scratchpad flag `ARCH_LINKAGE_AUTO_REPAIR=0|1` (default **0**). Comment next to `AUTONOMY_STOP_POLICY` in `.cursor/scratchpad.md` + template mirrors. **No live `=1` assignment** in committed scratchpad. Not in `AUTONOMY_PRESET` expansion (twelve flags unchanged).

**Stub shape (DQ8)**: H1 heading `US-xxxx — <title from archived block’s first heading line>` (or `BUG-xxxx — …`) matching `STORY_HEADING_H1` (`[:\u2014\-]` required). Body: exactly one pointer line, e.g. `Archived body in pack_ref: docs/engineering/architecture-archive/architecture-pack-<stamp>.md`. **Insertion**: into the retained hot surface **before** the US-0089 / US-0090 tail (DEC-0076 / `test_caveman_architecture_section_bottom_appended_and_linked` — only US-0090 may follow US-0089). Idempotent: if stub heading already exists, do not duplicate. Title source: first line of the archived block — do not invent titles.

### Rollover wiring (DQ3 LOCKED — AC-4)

`.cursor/commands/refresh-context.md` (+ template): after cap read, **pre-guard → `--rollover` → post-guard → existing `--check`**. Do not change `rollover_architecture` heading-split semantics or pack naming.

### Contract tests + harness (DQ6+DQ7 LOCKED — AC-5; Q1 accepted: 8 markers)

`tests/us0129_contract_test.py` (+ `template/tests/` mirror). Synthetic mini-architecture fixtures in temp dirs — **do not** replay `architecture-pack-20260825.md`. Harness section **26AB** after 26AA US-0102 in `tests/run-tests.ps1` **and** `tests/run-tests.sh`. Do not rename 26M rows. Do not call the section “B-1”. Existing linkage tests remain consumers; do not weaken them.

1. `test_us0129_guard_discovers_contract_heading_set` — AC-1 / DQ2
2. `test_us0129_pre_rollover_blocks_before_archive_write` — AC-1 / AC-2 / DQ3 (also folds “archiver unchanged”: no `split_arch_stories` / pack-header format change)
3. `test_us0129_block_emits_arch_linkage_rollover_blocked_metadata` — AC-2
4. `test_us0129_auto_repair_default_off` — AC-3 / DQ1
5. `test_us0129_auto_repair_restores_h1_stub_idempotent` — AC-3 / DQ8 (fixture includes US-0089 tail)
6. `test_us0129_post_rollover_verifies_active_linkage` — AC-1 / AC-4 / DQ3
7. `test_us0129_refresh_context_wires_pre_post_guard` — AC-4
8. `test_us0129_b1_regression_unprotected_rollover_fails` — AC-5

### Operator docs + parity (DQ5+DQ8 LOCKED — AC-4 / D8)

Runbook: new **h3** under `### Triad hot-surface enforcement (DEC-0054)` (~L871), not a new sibling h2. Operator troubleshooting + cross-link to reason_codes.md. New `ARCH_LINKAGE_PAIRS` + `--scope=arch-linkage` in `scripts/check_intake_template_parity.py` `SCOPES` (and `all`): `scripts/arch_linkage_guard.py`, `.cursor/commands/refresh-context.md`, `tests/us0129_contract_test.py` (plus scratchpad comment / runbook / reason_codes if not already covered). Add `scripts/arch_linkage_guard.py` to `docs/engineering/context/installer-owned-paths.manifest` (active + template), matching `enforce-triad-hot-surface.py`.

## Companion DEC = DEC-0129 (Required → Accepted)

**DEC-0129** authored Accepted in THIS phase at `decisions/DEC-0129.md`. This slice introduces a **new fail-closed family**, a **new security_hard matrix row**, a **new scratchpad flag**, and a **stub-shape/insertion contract**. DEC-0054 owns archiver split/caps/packs, not linkage. DEC-0073 owns H1 vs H2 anchors, not rollover guards. DEC-0119 owns the 9-kind taxonomy — compose it (security_hard, no 10th kind). Q2 accepted: story-aligned **DEC-0129** (highest existing DEC **file** is DEC-0126; US-0127/US-0128/US-0130 documented “none” — do not collide).

## Risks finalized (R1–R5 from R-0113)

- **R1 (HIGH)**: Helper false-positive on fixture strings (`# US-0067`) or command-file greps → over-blocking rollover. Mitigation: marker 1; exclude `.tmp*` and non-`docs/engineering/architecture.md` reads.
- **R2 (HIGH)**: Stub placed after the US-0089 heading breaks caveman bottom-append test. Mitigation: DQ8 insertion lock; marker 5 uses a fixture that includes an US-0089 tail.
- **R3 (MEDIUM)**: Body-token residual (US-0100 `{semver}-release-notes.md`) can still Fail the harness after heading-only repair. Mitigation: v1 heading-only (Q3); document residual; do not reopen US-0100.
- **R4 (MEDIUM)**: `AUTONOMY_STOP_POLICY=auto_repair_then_skip` operator expects skip — must still block. Mitigation: security_hard row + matrix validator coverage in execute if added.
- **R5 (LOW)**: Dual pre/post adds latency on every `/refresh-context`. Mitigation: stdlib scan of tests/ is local; no network.
- **R6 (LOW, architecture note)**: Helper may discover a required heading already absent from the hot file at first post-ship `--rollover` (live set is evidence, not a frozen manifest). Remediation is AC-2 (repair flag or manual stub). Do **not** pre-seed unrelated stubs in `/architecture`.

## Compose, do not amend (verified 8/8)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| DEC-0054 | `rollover_architecture` split / pack format / `ARCH_HOT_MAX_*` numbers | ✓ guard wraps; caps unchanged (D10); marker 2 |
| DEC-0073 | H1 anchor policy / H2 skip when H1 exists | ✓ stub is H1 with title separator |
| DEC-0076 / US-0089 | bottom-append: only US-0090 after US-0089 | ✓ stub insertion before that tail; marker 5 |
| US-0049 | state archive contract | ✓ state.md audit row append-bottom; no archive rewrite |
| US-0126 | B-1 fixture only | ✓ not reopened; acceptance L154 stays checked |
| US-0127 / US-0128 / US-0130 | DONE rows | ✓ not reopened; L155–L156 / L158 stay checked; L157 stays unchecked |
| DEC-0119 | 9 `auto_repair_kind` values + 12 preset flags | ✓ no 10th kind; no 13th preset flag |
| R-0112 | US-0130 overlay | ✓ not extended |

## Sprint seeds (8 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (`# US-0129` H1 + DEC-0129 — RESOLVED in THIS phase + compose-do-not-amend; NO-OP / verification) — AC-6
- **T-001** (AC-1 + AC-2 — `scripts/arch_linkage_guard.py` helper + pre-guard no-partial-write; + template mirror)
- **T-002** (AC-2 — `reason_codes.md` `## US-0129` + `ARCH_LINKAGE_ROLLOVER_BLOCKED` + autonomy-stop-matrix `security_hard` row; + template mirrors)
- **T-003** (AC-3 — `ARCH_LINKAGE_AUTO_REPAIR=0` scratchpad comment (no live `=1`) + DQ8 stub restore path; + template mirrors)
- **T-004** (AC-4 — `.cursor/commands/refresh-context.md` pre-guard → `--rollover` → post-guard → `--check`; + template mirror)
- **T-005** (AC-5 — `tests/us0129_contract_test.py` 8 markers + harness **26AB** in `run-tests.ps1` / `run-tests.sh`; + template test mirror)
- **T-006** (AC-4 / D8 — runbook h3 under triad + `ARCH_LINKAGE_PAIRS` / `--scope=arch-linkage`; + template runbook)
- **T-007** (D8 — `installer-owned-paths.manifest` active + template for `scripts/arch_linkage_guard.py`)

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic; guard first, then reason-code/matrix, then flag+stub, then wiring, then tests, then docs/parity/installer).

**AC surjection (preview for `/sprint-plan`)**: AC-1→T-001; AC-2→T-001,T-002; AC-3→T-003; AC-4→T-004,T-006; AC-5→T-005; AC-6→T-anch. 6/6.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0129`, `sprint_id=(pending — created at sprint-plan)`, `orchestrator_run_id=auto-20260827-01`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro per US-0096 / DEC-0082)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required)
- `fresh_context_marker=tl-US0129-architecture-20260827T073000Z-fresh`, `timestamp=2026-08-27T07:30:00Z` (UTC)
- `evidence_ref=docs/product/backlog.md (## US-0129 L4477–L4512 narrow-read), docs/engineering/research.md (## R-0113 L10695–L10833 narrow-read), docs/product/vision.md (## Discovery Notes — US-0129 L2155–L2181), docs/engineering/phase-context.md, docs/engineering/architecture.md (grep ^# US- anchors + US-0128 L1671–L1814 insertion + US-0130 L1815 boundary + US-0091 tail), docs/engineering/state.md (research + sovereign-critic research checkpoints), .cursor/commands/refresh-context.md (step 4), scripts/enforce-triad-hot-surface.py (STORY_HEADING_H1 / rollover_architecture)`
- Tech-lead subagent spawned fresh per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read (US-0053). No `.env` reads, no credentials, no intake-evidence mutation, no backlog Status/AC mutation (architecture_notes only), no DONE-row mutation (US-0108 / US-0121..US-0128 / US-0130), no `/sprint-plan` spawn, no acceptance L157 tick.
- `assemble_sovereign_memory_digest(...)` NOT called.
- No write to `mistakes.jsonl`.
- Prior phase strict proof consumed: `rp-auto-20260827-01-research-tech-lead-20260827T071534Z-US-0129` (proof_hash `137A157B8275E4BB6D1FE92DB823819726AEFE81DF38C5458806A6B1FF2607E8` — independently recomputed MATCH via Python 3.12 hashlib sorted-key compact lowercase-keys JSON; consumed at 2026-08-27T07:24:40Z before RUNTIME_PROOF_STALE ttl 2026-08-27T08:15:34Z). Critic of research PASS marker `tl-US0129-sovereign-critic-research-20260827T072146Z-fresh` (anti_slop=8, 0 blocking).
- Current architecture-phase strict proof recorded below.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260827-01-architecture-tech-lead-20260827T073000Z-US-0129`
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6-high","orchestrator_run_id":"auto-20260827-01","phase_id":"architecture","proof_issued_at":"2026-08-27T07:30:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260827-01-architecture-tech-lead-20260827T073000Z-US-0129","sprint_id":"pending","story_id":"US-0129"}`
- `proof_hash=DDDA46794ED39186D77F268EE47364E3070997916777582095FF9198FEEF6196` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-27T08:30:00Z` (UTC)

## Decision gate + next scheduled phase

- `decision_gate=false` (no DECISION_GATE; companion DEC-0129 Accepted; approach A1 locked; Q1=8 markers; Q2=DEC-0129; Q3=heading-only; sprint seeds T-anch + T-001..T-007 within SPRINT_MAX_TASKS=12; AC-1..AC-6 surjective; risks R1–R6; compose 8/8)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead; orchestrator-owned; CROSS_MODEL_REVIEW=1 may insert sovereign-critic of architecture first — this subagent does not spawn either)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only. Do not spawn /sprint-plan from this subagent. Do not mark US-0129 DONE. Do not tick acceptance L157. Do not mutate intake JSON. Do not reopen US-0126/US-0127/US-0128/US-0130. Do not change archiver heading semantics. Do not add ARCH_LINKAGE_AUTO_REPAIR to AUTONOMY_PRESET.`

