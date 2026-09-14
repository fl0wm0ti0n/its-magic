# Architecture archive pack (2026-09-13)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 21
- First archived heading: `# US-0130 — Operator-pinned sovereign-critic model (catalog role + scratchpad override)`
- Last archived heading: `# US-0130 — Operator-pinned sovereign-critic model (catalog role + scratchpad override)`
- Verification tuple (mandatory):
  - archived_body_lines=156
  - preamble_lines=1
  - retained_body_lines=2965

---

# US-0130 — Operator-pinned sovereign-critic model (catalog role + scratchpad override)

## Overview

**US-0130** overlays an operator pin on `/sovereign-critic` model selection so operators can choose the critic the same way they pin PO/SA/DEV in a v2 role catalog. Today's gap: `select_critic_model` (`scripts/sovereign_critic_lib.py` L236–267) maps producer → opposition tier via `CRITIC_TIER_OPPOSITION` then calls `_resolve_slug_for_tier("sovereign-critic", critic_tier, pad)` and never reads scratchpad `MODEL_SOVEREIGN-CRITIC` or catalog `roles.critic`. `CATALOG_ROLE_KEYS` (L85–87) has no `critic`. `sovereign-critic` is a synthetic phase, not a canonical phase.

The fix is a **dedicated overlay inside `select_critic_model`** (R-0112 DQ2): pin → optional `roles.critic` when `MODEL_RESOLVE=role_catalog` → existing opposition/`dev` fallback **UNCHANGED**. Same-slug collision keeps `CROSS_MODEL_DEGRADED_MODE` (not a hard stop). One global critic for all producer phases. Optional `critic` is an allowlist overlay (`CATALOG_OPTIONAL_ROLE_KEYS`), **not** added to required `CATALOG_ROLE_KEYS`. Hyphen exact: `MODEL_SOVEREIGN-CRITIC` via `phase_to_model_key` — no underscore alias. Examples + installer compose US-0112: add `critic` to v2 role examples; ship `role-based-balanced_cursor_only.json` as 9th example; **never** write `model-catalog.local.json`.

This is an **additive overlay + validator allowlist + examples/installer + docs + parity + contract-test** change. No new fail-closed code family. No companion DEC (compose DEC-0104 §5 / DEC-0087 / DEC-0086).

**Research anchor**: **R-0112** (DQ1–DQ8 LOCKED). **Companion DEC**: **none**. **EARLY_RESEARCH**: consumed from R-0112 (JSON Schema optional overlay vs required-set; no new R-id).

**Fresh context marker**: `tl-US0130-architecture-20260826T214500Z-fresh`
**Orchestrator run id**: `auto-20260826-01`
**Timestamp**: 2026-08-26T21:45:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (orchestrator-owned; CROSS_MODEL_REVIEW=1 critic of architecture is orchestrator-owned)

## Approach locked (A1 — from R-0112 DQ1–DQ8)

**Approach A1** (locked): Dedicated overlay **inside** `select_critic_model` before existing opposition. Overlay order:

1. Exact pin `pad.get(phase_to_model_key("sovereign-critic"))` → `MODEL_SOVEREIGN-CRITIC` nonempty → use that slug (highest precedence). Validate via `validate_direct_slug` when `MODEL_RESOLVE` is `local_catalog`/`role_catalog` and a catalog is loaded (DEC-0087 §4). When `alias_only`, pin is an opaque slug.
2. Else if `MODEL_RESOLVE=role_catalog`: load catalog from `MODEL_CATALOG` (default `.cursor/model-catalog.local.json`); if `roles.critic` present and nonempty → use it. Catalog miss on optional `critic` is **not** `MODEL_ROLE_SLUG_UNKNOWN` — fall through.
3. Else existing opposition: `_resolve_slug_for_tier("sovereign-critic", …)` **UNCHANGED** (DQ7). Do not pass a newly loaded catalog into that helper.
4. Existing same-slug comparison → `degraded=True` / `CROSS_MODEL_DEGRADED_MODE` **UNCHANGED**.

Do **not** add `critic` to `CATALOG_ROLE_KEYS`. Introduce `CATALOG_OPTIONAL_ROLE_KEYS = frozenset({"critic"})`; subtract optional keys from the extra-key set. Do **not** register `sovereign-critic` in `PHASE_LOGICAL_ROLE`, `CANONICAL_PHASE_IDS`, or `DEFAULT_PHASE_TIER_MATRIX`. Do **not** consume `MODEL_SOVEREIGN_CRITIC` (underscore). Do **not** "fix" `_resolve_slug_for_tier`'s underscore injection in this slice.

Cursor-only example `critic` slug locked: **`composer-2.5-fast`** (Q2 — distinct from `roles.dev=grok-4-6-high`; cheap opposition analogue). Generic v2 examples use `<your-critic-model-slug>`.

|| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | **Dedicated overlay in `select_critic_model` + optional `CATALOG_OPTIONAL_ROLE_KEYS` + hyphen pin + examples/installer 9th file + 10 markers + scratchpad/runbook comments** | **Preferred** — additive; composes DEC-0104/DEC-0087/DEC-0086; no new fail-closed family; AC-1..AC-9 provable. |
| A2 (rejected) | Add `critic` to required `CATALOG_ROLE_KEYS` | **Rejected** — fail-closes every existing v2 catalog missing `critic` (AC-2 / DQ1). |
| A3 (rejected) | Register `sovereign-critic` in `PHASE_LOGICAL_ROLE` and reuse `resolve_model_for_phase("sovereign-critic")` | **Rejected** — unknown-phase maps to `"dev"`; would amend US-0101 matrix and US-0102 5-step chain (DQ2). |
| A4 (rejected) | Underscore alias `MODEL_SOVEREIGN_CRITIC` | **Rejected** — DQ3 hyphen exact; alias would hide the current gap. |
| A5 (rejected) | Hard-stop same-slug collision | **Rejected** — operator chose `degraded_keep`; DEC-0104 §5 UNCHANGED. |
| A6 (rejected) | Companion DEC-0130 | **Rejected** — R-0112: no new fail-closed family; would duplicate DEC-0104/DEC-0087/DEC-0086. |
| A7 (rejected) | Open `additionalProperties` on `roles` | **Rejected** — would silently accept typos and undo DEC-0087 unknown-key fail-closed. |
| A8 (rejected) | Per-lens / per-producer-phase critic models | **Rejected** — AC-5 / D5 out of scope for v1. |

## Components

### Overlay in `select_critic_model` (DQ2+DQ3+DQ7 LOCKED — AC-1/AC-3/AC-4/AC-5)

`scripts/sovereign_critic_lib.py` (+ `template/scripts/sovereign_critic_lib.py` byte-identical): prepend the overlay before L250–252 opposition. Pin lookup uses `phase_to_model_key("sovereign-critic")` → `MODEL_SOVEREIGN-CRITIC` only. `SelectCriticResult` shape UNCHANGED. One global critic (no per-lens / per-phase critic overrides). Same-slug path UNCHANGED.

### Optional catalog role (DQ1+DQ6 LOCKED — AC-2)

`scripts/model_tier_lib.py` (+ template): `CATALOG_OPTIONAL_ROLE_KEYS = frozenset({"critic"})`. `_validate_roles_object`: extra = `actual_keys - CATALOG_ROLE_KEYS - CATALOG_OPTIONAL_ROLE_KEYS`. Do not add `critic` to `CATALOG_ROLE_KEYS`, `LOGICAL_ROLE_TO_CATALOG_KEY`, or `PHASE_LOGICAL_ROLE`. `scripts/model_tier_validate.py` required-role loop stays `for role_name in CATALOG_ROLE_KEYS`. After that loop, if `"critic" in roles`: require nonempty string; empty/whitespace reuses `MODEL_CATALOG_SCHEMA_V2_INVALID` (message names the `critic` key; **no new reason-code family**). Missing `critic` is not an error. Unknown extras still fail-closed.

### Examples + installer (DQ4+DQ5 LOCKED — AC-8)

| Catalog | Action |
|---------|--------|
| v2 role-based-balanced + highend (active + `template/`) | add `"critic": "<your-critic-model-slug>"` |
| `.cursor/model-catalog.local.example.role-based-balanced_cursor_only.json` | add `"critic": "composer-2.5-fast"`; **ship as 9th example** — add `template/` copy + manifest `[install_include_paths]` + `installer.ps1` / `installer.py` explicit lists (`installer.sh` glob already matches) |
| v1 examples (`example.json`, `cursor-only.json`, `level-1-easy` … `level-4-super`) | **unchanged** (do not add `roles.critic`) |
| `role-based-budget.json` | out of installer compose this slice |
| OpenCode example | out of scope (US-0123) |
| `.cursor/model-catalog.local.json` | **never write** |

### Scratchpad comments (DQ8 LOCKED — AC-1/AC-9)

Two comment sites, mirrored to `template/.cursor/scratchpad.md`, `template/.cursor/scratchpad.local.example.md`, and active `scratchpad.local.example.md`:

1. Next to `MODEL_<PHASE>` examples after `MODEL_REFRESH-CONTEXT` hyphen precedent: synthetic-phase pin `MODEL_SOVEREIGN-CRITIC=<your-critic-model-slug>` — not a canonical phase; hyphen exact; no underscore alias; vendor slugs in `.cursor/scratchpad.local.md` only. **No live assignment** in committed scratchpad.
2. Next to `CROSS_MODEL_*` keys after `CROSS_MODEL_REWORK_MAX` comments, before enabled assignments: precedence pin > `roles.critic` (when `role_catalog`) > opposition/`dev`; same-slug keeps `CROSS_MODEL_DEGRADED_MODE`; one global critic.

### Contract tests (R-0112 inventory — AC-6; Q1 accepted: 10 markers)

`tests/us0130_contract_test.py` (+ `template/tests/us0130_contract_test.py` byte-identical):

1. `test_us0130_pin_wins_over_catalog_and_opposition`
2. `test_us0130_catalog_critic_hit_when_pin_absent`
3. `test_us0130_omitted_critic_falls_back_to_opposition`
4. `test_us0130_same_slug_keeps_degraded_mode`
5. `test_us0130_compose_us0104_findings_schema_unchanged`
6. `test_us0130_underscore_alias_not_consumed` (DQ3)
7. `test_us0130_extra_critic_allowed_missing_not_error` (DQ6)
8. `test_us0130_critic_not_in_catalog_role_keys` (DQ1)
9. `test_us0130_cursor_only_example_ships_critic` (DQ4/DQ5)
10. `test_us0130_installer_never_writes_local_catalog` (DQ5)

### Operator docs + parity (DQ8 + AC-9)

`docs/engineering/runbook.md` `#### Degraded fallback troubleshooting` (~L2948) — document pin precedence and optional `roles.critic` (do not change same-slug = not hard stop). `SOVEREIGN_CRITIC_PAIRS`: add `scripts/sovereign_critic_lib.py` ↔ `template/scripts/sovereign_critic_lib.py`. `MODEL_TIER_OVERRIDES_PAIRS`: add cursor_only json pair. `MODEL_TIER_PAIRS` already covers lib/validator/scratchpad.

## Companion DEC = none

**No companion DEC required.** Overlay implements AC-2/AC-3 on already-governed surfaces: DEC-0104 §5 (`select_critic_model` opposition + `degraded_keep`), DEC-0087 (optional v2 `roles` + 5-step chain for **canonical** phases + `validate_direct_slug`), DEC-0086 (phase-tier matrix untouched). Optional `critic` is a validator allowlist, not a new reason-code family. Empty-present-critic and unknown-extra reuse `MODEL_CATALOG_SCHEMA_V2_INVALID`. Pin slug unknown reuses `MODEL_OVERRIDE_SLUG_UNKNOWN`. Q3 accepted: none. Architecture discovered **no** new fail-closed code family.

## Risks finalized (R1–R5 from R-0112)

- **R1 (MEDIUM)**: Operators may assume `MODEL_SOVEREIGN-CRITIC` participates in canonical-phase resolution. Mitigation: DQ8 comments + runbook; tests pin exact key; do not register synthetic phase.
- **R2 (MEDIUM)**: Shipping cursor_only as 9th installer file expands US-0112 payload. Mitigation: AC-8 names the file; `installer.sh` glob already matches; never write `model-catalog.local.json`; marker 9+10.
- **R3 (LOW)**: `_resolve_slug_for_tier` hyphen/underscore mismatch remains. Mitigation: DQ7 forbids fixing it here; overlay bypasses that helper for pin/catalog.
- **R4 (LOW)**: Empty-present `critic` reuses `MODEL_CATALOG_SCHEMA_V2_INVALID`. Mitigation: error message names the `critic` key (text, not a new code).
- **R5 (LOW)**: Pin slug not in catalog under `role_catalog` → `MODEL_OVERRIDE_SLUG_UNKNOWN`. Mitigation: compose DEC-0087 §4; DQ8 documents pin slug must appear in catalog when `MODEL_RESOLVE` requires catalog.

## Compose, do not amend (verified 9/9)

| Story | Surface | Verification |
|-------|---------|--------------|
| US-0104 / DEC-0104 | findings JSONL / three lenses / `CROSS_MODEL_*` enable keys / anti-slop / opposition table / degraded_keep | ✓ overlay prepend; opposition + collision UNCHANGED; marker 5 |
| US-0102 / DEC-0087 | 5-step chain / `CATALOG_ROLE_KEYS` required-set / `PHASE_LOGICAL_ROLE` | ✓ chain canonical-phase-only; `critic` not in required-set; synthetic phase not registered |
| US-0101 / DEC-0086 | `DEFAULT_PHASE_TIER_MATRIX` / v1 catalogs | ✓ v1 examples unchanged; matrix not extended |
| US-0112 | 8 example catalogs + installer never writes `model-catalog.local.json` | ✓ compose; add `critic` to v2 role examples; ship cursor_only as 9th; never write local.json |
| US-0127 / US-0128 | hygiene / smoke surrogate | ✓ not reopened |
| US-0129 | architecture linkage guard | ✓ untouched |
| US-0123 | OpenCode `provider/slug` | ✓ distinct host; OpenCode example out of scope |
| R-0088 | Cursor Task allowlist / BYOK | ✓ document-only |
| US-0045 / US-0048 / US-0056 | status / isolation / runtime proof | ✓ Status stays OPEN; fresh isolation; this phase mints its own proof |

## Sprint seeds (8 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (`# US-0130` H1 — RESOLVED in THIS phase + compose-do-not-amend; NO-OP / verification)
- **T-001** (AC-1 consume + AC-3 + AC-4 + AC-5 — `select_critic_model` overlay per DQ2/DQ3/DQ7; + template mirror)
- **T-002** (AC-2 — `CATALOG_OPTIONAL_ROLE_KEYS` + `_validate_roles_object` extra-key subtract + validator empty-present-critic; + template mirrors)
- **T-003** (AC-8 — v2 example `critic` keys + ship cursor_only as 9th with `critic=composer-2.5-fast` + manifest/installer lists; never write `model-catalog.local.json`)
- **T-004** (AC-1 docs + AC-9 — scratchpad DQ8 comment sites; no live `MODEL_SOVEREIGN-CRITIC=` assignment)
- **T-005** (AC-6 + AC-7 — `tests/us0130_contract_test.py` 10 markers + template mirror)
- **T-006** (AC-9 — runbook `#### Degraded fallback troubleshooting` pin-precedence note; + template mirror)
- **T-007** (AC-9 — `SOVEREIGN_CRITIC_PAIRS` add `sovereign_critic_lib.py`; `MODEL_TIER_OVERRIDES_PAIRS` add cursor_only json pair)

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 (acyclic; overlay first, then schema, then examples, then docs/tests/parity).

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0130`, `sprint_id=(pending — created at sprint-plan)`, `orchestrator_run_id=auto-20260826-01`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro per US-0096 / DEC-0082)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required; glm-5.2-high usage-limited)
- `fresh_context_marker=tl-US0130-architecture-20260826T214500Z-fresh`, `timestamp=2026-08-26T21:45:00Z` (UTC)
- `evidence_ref=docs/product/backlog.md (## US-0130 L4511–L4551 narrow-read), docs/engineering/research.md (## R-0112 L10519–L10688 narrow-read), docs/product/vision.md (## Discovery Notes — US-0130 L2117–L2145), docs/engineering/phase-context.md, docs/engineering/architecture.md (grep ^# US- anchors + US-0128 L1671–L1814 insertion + US-0091 L1818 boundary), docs/engineering/state.md (research + sovereign-critic research checkpoints), scripts/sovereign_critic_lib.py (select_critic_model L236–267), scripts/model_tier_lib.py (CATALOG_ROLE_KEYS L85–87, phase_to_model_key L131–133), .cursor/model-catalog.local.example.role-based-balanced_cursor_only.json`
- Tech-lead subagent spawned fresh per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Narrow-read (US-0053). No `.env` reads, no credentials, no intake-evidence mutation, no backlog Status/AC mutation (architecture_notes only), no DONE-row mutation (US-0108 / US-0121..US-0128), no US-0129 mutation, no `/sprint-plan` spawn, no `model-catalog.local.json` write, no DEC-0130 file.
- `assemble_sovereign_memory_digest(...)` NOT called.
- No write to `mistakes.jsonl`.
- Prior phase strict proof consumed: `rp-auto-20260826-01-research-tech-lead-20260826T213327Z-US-0130` (proof_hash `445A566247CDC79A70F161BFD71C56471C4785B27E2816C38AE8B35BC1C49F62` — independently recomputed MATCH via Python 3.12 hashlib sorted-key compact lowercase-keys JSON; consumed at 2026-08-26T21:43:10Z before RUNTIME_PROOF_STALE ttl 2026-08-26T22:33:27Z). Critic of research PASS marker `tl-US0130-sovereign-critic-research-20260826T213900Z-fresh` (anti_slop=8, 0 blocking).
- Current architecture-phase strict proof recorded below.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260826-01-architecture-tech-lead-20260826T214500Z-US-0130`
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6-high","orchestrator_run_id":"auto-20260826-01","phase_id":"architecture","proof_issued_at":"2026-08-26T21:45:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260826-01-architecture-tech-lead-20260826T214500Z-US-0130","sprint_id":"pending","story_id":"US-0130"}`
- `proof_hash=B071AE0659D99E2513304490BD3D191550631E7564398EEEC4485BD556FD8B4D` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-26T22:45:00Z` (UTC)

## Decision gate + next scheduled phase

- `decision_gate=false` (no DECISION_GATE; companion DEC none; approach A1 locked; Q1=10 markers; Q2=`composer-2.5-fast`; Q3=no DEC; sprint seeds T-anch + T-001..T-007 within SPRINT_MAX_TASKS=12; risks R1–R5; compose 9/9)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead; orchestrator-owned; CROSS_MODEL_REVIEW=1 may insert sovereign-critic of architecture first — this subagent does not spawn either)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only. Do not spawn /sprint-plan from this subagent. Do not mark US-0130 DONE. Do not tick acceptance L158. Do not mutate intake JSON. Do not reopen US-0127/US-0128. Do not mutate US-0129. Do not amend US-0104 findings schema/lenses/CROSS_MODEL keys. Do not write model-catalog.local.json. Do not author DEC-0130.`

<!-- Restored from architecture-archive for contract-test linkage (execute loop-3) -->
