# Architecture archive pack (2026-09-12)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 21
- First archived heading: `# US-0126 — OpenCode host runbook, reason codes, and parity tests`
- Last archived heading: `# US-0126 — OpenCode host runbook, reason codes, and parity tests`
- Verification tuple (mandatory):
  - archived_body_lines=305
  - preamble_lines=1
  - retained_body_lines=2771

---

# US-0126 — OpenCode host runbook, reason codes, and parity tests

## Overview

**US-0126** is the sixth and final slice of the six-story OpenCode adapter epic (US-0121..US-0126). US-0121 shipped the empty-but-valid `template/.opencode/` pack + the `--host` installer switch. US-0122 populated the pack with eight markdown role agents and locked the Layer-1 permission matrix. US-0123 locked the per-role `provider/slug` resolution chain. US-0124 shipped the orchestrator plugin that makes `/auto` spawn-only on the OpenCode host. US-0125 shipped the 15 dispatch-only thin commands + the Python validator bridge contract. US-0126 owns **Layer 4** — the operator-facing runbook section (`## OpenCode host operator runbook (US-0126)` in `docs/engineering/runbook.md` + `template/docs/engineering/runbook.md` byte-identical), the consolidated cross-host reason-code table, the `--scope=opencode-adapter` parity extension (2 new pairs in `OPENCODE_ADAPTER_PAIRS`), and the 12 `test_us0126_*` contract markers (one-test-per-AC, AC-5 splits into readme + runbook no-dec-leak; static/grep, no live OpenCode probe).

This is an **additive docs + parity + contract-test** change: one new runbook h2 section (mirrored active↔template), one README user-visible OpenCode host blurb (mirrored to `template/its_magic/README.md`), one `OPENCODE_ADAPTER_PAIRS` additive extension (2 new pairs), one new contract test file (`tests/us0126_contract_test.py` — 12 markers, mirrored to `template/tests/us0126_contract_test.py` byte-identical), and the companion DEC-0126. The US-0121 installer-flag h2, the US-0124 stub reason-code h2, and the US-0125 stub reason-code h2 are NOT edited by US-0126 — US-0126 owns the consolidated cross-host table and cross-links to them (compose, do not amend). No Cursor kit docs are deleted (AC-10). No new GUI. No standalone runtime. No OpenCode fork. No VS Code contrib rewrite. No Caveman. No Cursor-browser-as-primary-UAT.

**Research anchor**: **R-0109** US-0126 deepened findings (DQ1..DQ8 LOCKED for `/architecture`; US-0121 Q1..Q12 + US-0122 DQ1..DQ8 + US-0123 DQ1..DQ10 + US-0124 DQ1..DQ8 + US-0125 DQ1..DQ8 locks PRESERVED, not wiped; 6 risks R1..R6 ACCEPTED; 3 research critic NBs closed: `ik_us0126_dq3_parity_grep_false_pass`, `ik_us0126_layering_runbook_dec_tests`, `ik_us0126_research_scope_yagni_markers`). **Companion DEC**: **DEC-0126** (authored Accepted in THIS phase).

**Fresh context marker**: `tl-US0126-architecture-20260825T160542Z-fresh`
**Orchestrator run id**: `auto-20260825-01`
**Timestamp**: 2026-08-25T16:05:42Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (after critic)

## Approach locked (A1 — from R-0109 US-0126 DQ1..DQ8)

**Approach A1** (locked): Ship a new sibling h2 `## OpenCode host operator runbook (US-0126)` in `docs/engineering/runbook.md` (DQ1) placed immediately after the `## OpenCode thin commands + validator bridge (US-0125)` section, mirrored byte-identical to `template/docs/engineering/runbook.md` (DQ8). The section body contains: the locked program DoD sentence (DQ5), the locked default-host reminder sentence (DQ6), the locked out-of-scope list + Boundaries subsection (DQ7), the consolidated cross-host reason-code table (DQ2 — 4 `OPENCODE_*` US-0124 + 5 installer `OPENCODE_*`/`CURSOR_*` US-0121 + 3 reused cross-host + raw Python validator codes; each code has a one-line semantics + fail-closed action + cross-link to its owning slice; NO `OPENCODE_VALIDATOR_FAILED` wrapper per DEC-0125 DQ7), and a parity scope cross-link to `--scope=opencode-adapter` (DQ3). The README user-visible OpenCode host blurb carries the default-host reminder + out-of-scope list (operator prose, no DEC ids per US-0071). The `OPENCODE_ADAPTER_PAIRS` tuple in `scripts/check_intake_template_parity.py` is extended additively with 2 new pairs: `tests/us0126_contract_test.py` ↔ template + `docs/engineering/runbook.md` ↔ template (DQ3). The `installer-owned-paths.manifest` is unchanged (DQ8 — runbook already installer-owned via `docs` in `[install_include_paths]`; `tests/us0126_contract_test.py` not installer-shipped per US-0121..US-0125 pattern). The 12 `test_us0126_*` markers live in `tests/us0126_contract_test.py` (mirrored to `template/tests/us0126_contract_test.py` byte-identical), all static/grep-based, no live OpenCode runtime probe (vision D10 lock — DQ4).

|| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | **New sibling h2 + consolidated reason-code table + additive `OPENCODE_ADAPTER_PAIRS` (2 pairs) + 12 static/grep markers + locked operator sentences + no manifest change** | **Preferred** — additive only; composes with US-0071/US-0113..US-0117/US-0121/US-0122/US-0123/US-0124/US-0125/US-0102; AC-1..AC-10 provable via static/grep contract tests; 3 research critic NBs closed. |
| A2 (rejected) | Merge US-0126 runbook into the US-0121 installer-flag h2 | **Rejected** — violates compose-do-not-amend (US-0121 h2 locked by US-0121 AC-9); conflates installer-flag docs with operator-runbook prose. |
| A3 (rejected) | Generic `## OpenCode host` h2 (no US-xxxx suffix) | **Rejected** — breaks the `(US-xxxx)` suffix convention for the five sibling OpenCode-epic h2 sections. |
| A4 (rejected) | New sibling script `scripts/check_opencode_adapter_parity.py` | **Rejected** — violates the established `--scope=<name>` pattern (15 scopes on the single CLI); diverges from US-0121's `--scope=opencode-adapter` lock. |
| A5 (rejected) | New `--scope=opencode-adapter-us0126` sibling scope | **Rejected** — fragments the epic parity surface; `--scope=opencode-adapter` was always intended to cover the whole epic (US-0121..US-0126). |
| A6 (rejected) | Add `tests/us0126_contract_test.py` to `[install_include_paths]` | **Rejected** — breaks the US-0121..US-0125 pattern (test files are NOT installer-shipped; parity-validated via `OPENCODE_ADAPTER_PAIRS` only). |
| A7 (rejected) | Resurrect `OPENCODE_VALIDATOR_FAILED` wrapper in the consolidated table | **Rejected** — DEC-0125 DQ7 REJECTED the wrapper; US-0126 documents raw Python codes + `OPENCODE_DRIVER_INVOKE_FAILED` only. |
| A8 (rejected) | Live OpenCode probe in CI for program DoD | **Rejected** — adds OpenCode runtime dependency to CI; forbidden by vision D10 — DoD is a static documentation test (grep for locked key phrases). |
| A9 (rejected) | AC-10 cursor-docs baseline via frozen pre-US-0126 git snapshot | **Rejected** — fragile; prefer deterministic static check asserting `.cursor/commands/` and `.cursor/agents/` still exist with expected file names vs current kit inventory. |
| A10 (rejected) | Collapse 12 markers to 11 by merging marker 4 + marker 12 | **Rejected** — AC-5 split is real (readme vs runbook no-dec-leak are distinct surfaces); keeping 12 preserves one-test-per-AC clarity; marker 4 (prior-story checklist) and marker 12 (aggregate) kept separate for explicit defense in depth. |

<!-- US-0126 ARCHITECTURE BODY CONTINUES BELOW -->

## Components

### Runbook section (DQ1 LOCKED — AC-1)

`docs/engineering/runbook.md` + `template/docs/engineering/runbook.md` (byte-identical active↔template) — new sibling h2 placed immediately after `## OpenCode thin commands + validator bridge (US-0125)`:

- **Heading**: `## OpenCode host operator runbook (US-0126)`
- **GitHub anchor**: `opencode-host-operator-runbook-us-0126`
- **Placement**: immediately after the `## OpenCode thin commands + validator bridge (US-0125)` section (after L4017), before the next non-OpenCode h2.
- **Mirror**: `template/docs/engineering/runbook.md` (active↔template byte-identical parity — DQ8; validated by the new `docs/engineering/runbook.md` ↔ template pair in `OPENCODE_ADAPTER_PAIRS` — DQ3).
- **US-0121/US-0124/US-0125 h2 sections untouched** (compose, do not amend): US-0126 cross-links to `## OpenCode host mode (US-0121)` as "installer `--host` flag reference (US-0121)"; cross-links to `## OpenCode orchestrator plugin reason codes (US-0124)` and `## OpenCode thin commands + validator bridge (US-0125)` as "stub reason-code references (US-0124, US-0125)".
- **Coupling risk (critic NB `ik_us0126_layering_runbook_dec_tests`)**: the runbook pair is a **whole-file** byte-identical pair (installer-owned `docs` covers the runbook). Execute must keep active↔template runbook byte-identical after adding the new h2 — any drift fails `--scope=opencode-adapter`. This is intentional (the runbook is installer-owned); documented here so execute does not accidentally edit only one side.

### Locked operator sentences (DQ5, DQ6, DQ7 LOCKED — AC-6, AC-7, AC-8)

`/architecture` locks the wording; **execute ships the actual h2 body into `docs/engineering/runbook.md` + `template/docs/engineering/runbook.md`** (architecture locks; execute implements — do NOT ship the runbook body in this phase).

**Program DoD sentence (DQ5 LOCKED — AC-6)** — verbatim into the runbook h2 body:

> "Program done: with a fresh `its-magic --host opencode` install and `/connect`ed keys, an operator can run `intake → … → release` on stock OpenCode with PO/Dev/QA as distinct sessions (optionally distinct providers per US-0123 role-slug routing), and the Python persistence-blocking validators (`intake_evidence_validate.py`, `bug_issue_validate.py`, and the US-0125 bridge contract set) refuse writes on non-zero exit exactly as on the Cursor host."

- **"without Cursor" disambiguated**: = no `.cursor/` directory loaded for this project (installer `--host opencode` skips `.cursor/` rows per US-0121; kernel paths still install). It does NOT mean "no Cursor IDE process on the operator machine" — the operator may have Cursor installed for other projects; the DoD is about the kit running without the Cursor host adapter loaded for this project.
- **"different sessions/providers" disambiguated**: = distinct OpenCode sessions (PO/Dev/QA as separate `opencode run --session` invocations or separate TUI sessions per US-0069 / DEC-0051 phase→role matrix); optionally distinct `/connect` profiles or distinct provider slugs per role (US-0123 per-role slug routing).
- **"validators still block" disambiguated**: = the regression baseline is the existing Python validator set (`intake_evidence_validate.py`, `bug_issue_validate.py`, plus the US-0125 bridge contract for any kit validator) — these remain Python SOT and the US-0124 plugin `ctx.tool.hook("execute.before")` enforces persistence on non-zero exit exactly as the Cursor host hook layer does.
- `test_us0126_program_dod_documented` (DQ4 marker 7) asserts the DoD sentence is present in runbook (static grep for key phrases: "fresh `its-magic --host opencode` install", "distinct sessions", "refuse writes on non-zero exit"). NOT a live end-to-end probe.

**Default-host reminder sentence (DQ6 LOCKED — AC-7)** — verbatim into the runbook h2 body + README user-visible OpenCode host blurb:

> "Default install is cursor-only. Pass `--host opencode` or `--host both` to install the OpenCode host adapter; without it, `.opencode/` is not installed. See `## OpenCode host mode (US-0121)` for the installer flag reference."

- **No DEC ids** in the operator-facing sentence (US-0071). Cross-reference is to the US-0121 runbook h2 heading, not to `DEC-0120`.
- `test_us0126_default_host_reminder` (DQ4 marker 8) greps runbook + README for the locked phrases: "Default install is cursor-only", "`--host opencode`", "`--host both`".

**Out-of-scope list (DQ7 LOCKED — AC-8)** — verbatim into the runbook h2 body + README user-visible OpenCode host blurb (operator prose only):

> "Out of scope for the OpenCode host adapter: standalone runtime, OpenCode fork, VS Code contrib rewrite, Caveman mode, Cursor browser as primary UAT."

- **Boundaries subsection** (separate, not operator prose; runbook only; cross-references allowed here):
  - "standalone runtime — see `docs/product/standalone-runtime-masterplan.md`."
  - "OpenCode fork — out of scope; the adapter uses stock OpenCode plugins/agents/commands only."
  - "VS Code contrib rewrite — out of scope; the adapter does not modify VS Code or its contrib extensions."
  - "Caveman mode — see `DEC-0055`."
  - "Cursor browser as primary UAT — out of scope; browser UAT remains a secondary surface (US-0093)."
- `test_us0126_out_of_scope_listed` (DQ4 marker 9) greps runbook + README for each excluded item name: "standalone runtime", "OpenCode fork", "VS Code contrib rewrite", "Caveman", "Cursor browser as primary UAT".

<!-- US-0126 ARCHITECTURE BODY CONTINUES BELOW -->

### Consolidated cross-host reason-code table (DQ2 LOCKED — AC-2; critic NB `ik_us0126_dq3_parity_grep_false_pass` closed)

The consolidated table documents **four `OPENCODE_*` codes from US-0124** + **five installer `OPENCODE_*`/`CURSOR_*` codes from US-0121** + **three reused cross-host codes** + **raw Python validator codes (no wrapper)**. Each code has a one-line semantics + fail-closed action + cross-link to its owning slice (US-0121/US-0124/US-0125/Python SOT). **NO `OPENCODE_VALIDATOR_FAILED` wrapper** (rejected by DEC-0125 DQ7 — US-0126 must not resurrect it). The table cross-links to the US-0124 stub h2 (`## OpenCode orchestrator plugin reason codes (US-0124)`) and US-0125 stub h2 (`## OpenCode thin commands + validator bridge (US-0125)`) for the per-slice stub references; US-0126 owns the consolidated cross-host view.

**`OPENCODE_*` family (OpenCode-host-specific — from US-0124 / DEC-0124 DQ4):**

| Code | Semantics + fail-closed action | Owning slice |
|------|--------------------------------|--------------|
| `OPENCODE_PLUGIN_SPAWN_UNSUPPORTED` | v2 `ctx.session.create` unavailable at runtime; fail closed; do not degrade to same-session roleplay. | US-0124 |
| `OPENCODE_SUBTASK_IGNORED` | `ctx.session.create` returned null/threw/identical-id (DQ5 matrix); fail closed; stop `/auto`. | US-0124 |
| `OPENCODE_HEADLESS_UNSUPPORTED` | `opencode run` CLI missing on PATH (DQ7); fail closed; stop `/auto`. | US-0124 |
| `OPENCODE_DRIVER_INVOKE_FAILED` | `scripts/auto_outer_driver.py` subprocess failed (non-zero exit, malformed JSON, timeout) (DQ6); fail closed; stop `/auto`. | US-0124 |

**Installer `OPENCODE_*` / `CURSOR_*` family (from US-0121 / DEC-0120 — runbook L3970–L3976 already documents these):**

| Code | Semantics + fail-closed action | Owning slice |
|------|--------------------------------|--------------|
| `INSTALL_HOST_INVALID` | Unknown or duplicate `--host` argv; fail closed. | US-0121 |
| `OPENCODE_ORPHANED_BY_CLEAN_CURSOR` | `clean --host cursor` left `.opencode/` in place. | US-0121 |
| `OPENCODE_STALE_BY_UPGRADE_CURSOR` | `upgrade --host cursor` did not refresh `.opencode/`. | US-0121 |
| `CURSOR_ORPHANED_BY_CLEAN_OPENCODE` | `clean --host opencode` left `.cursor/` in place. | US-0121 |
| `CURSOR_STALE_BY_UPGRADE_OPENCODE` | `upgrade --host opencode` did not refresh `.cursor/`. | US-0121 |

**Reused cross-host codes (no `OPENCODE_` prefix — same semantics on Cursor + OpenCode):**

| Code | Semantics + fail-closed action | Owning slice |
|------|--------------------------------|--------------|
| `AUTO_ORCHESTRATOR_PHASE_EXECUTION` | Orchestrator (or any role) performing another role's artifact writes; fail closed; stop `/auto`. | US-0092 / DEC-0078 |
| `PHASE_ROLE_MISMATCH` | Wrong-role spawn per US-0069 / DEC-0051 matrix; fail closed; stop `/auto`. | US-0069 / DEC-0051 |
| `NATIVE_CHAIN_UNAVAILABLE` | Headless fallback when native in-session chain unavailable (compose with `OPENCODE_HEADLESS_UNSUPPORTED`). | US-0092 / DEC-0078 |

**Raw Python validator reason codes (Python SOT — no `OPENCODE_*` wrapper per DEC-0125 DQ7):**

| Code | Semantics + fail-closed action | Owning slice |
|------|--------------------------------|--------------|
| `INTAKE_PERSISTENCE_BLOCKED` | `intake_evidence_validate.py` refused a persistence write; fail closed; surface to operator. | US-0078 / DEC-0060 (Python SOT) |
| `INTAKE_REQUIRED_TOPIC_MISSING` | `intake_evidence_validate.py` found a missing required topic; fail closed; surface to operator. | US-0078 / DEC-0060 (Python SOT) |
| `BUG_ISSUE_VALIDATION_FAILED` | `bug_issue_validate.py` refused a bug-row write; fail closed; surface to operator. | US-0079 / DEC-0061 (Python SOT) |

US-0126 documents these as the persistence-blocking gate surface; US-0125 owns the bridge contract; US-0126 does NOT enumerate every kit validator — the bridge contract is generic. `test_us0126_reason_code_catalog_present` (DQ4 marker 2) greps the runbook for each code in the consolidated table (4 `OPENCODE_*` US-0124 + 5 installer `OPENCODE_*`/`CURSOR_*` US-0121 + 3 reused cross-host + raw Python validator codes) and asserts each code has a one-line semantics + fail-closed action.

### Parity scope surface (DQ3 LOCKED — AC-3; critic NB `ik_us0126_dq3_parity_grep_false_pass` closed — explicit layer split)

`scripts/check_intake_template_parity.py` already registers `--scope=opencode-adapter` (L541) backed by `OPENCODE_ADAPTER_PAIRS` (L484–L517). US-0126 extends `OPENCODE_ADAPTER_PAIRS` **additively** with 2 new pairs (no sibling script, no sibling scope):

- **Existing pairs preserved (8)**: `installer-owned-paths.manifest` ↔ template, `check_intake_template_parity.py` ↔ template, `tests/us0121_host_mode_test.py` ↔ template, `tests/us0122_contract_test.py` ↔ template, `tests/us0123_contract_test.py` ↔ template, `tests/us0124_contract_test.py` ↔ template, `tests/us0125_contract_test.py` ↔ template, `model_tier_validate.py` ↔ template.
- **New pairs added by US-0126 (2)**:
  - `tests/us0126_contract_test.py` ↔ `template/tests/us0126_contract_test.py` (NEW contract test file — DQ4 inventory).
  - `docs/engineering/runbook.md` ↔ `template/docs/engineering/runbook.md` (NEW active↔template parity for the "OpenCode host operator runbook (US-0126)" h2 section — DQ1 lock; ensures the runbook section is byte-identical active↔template).

**Layer split (critic NB `ik_us0126_dq3_parity_grep_false_pass` closed)** — document this explicitly so execute does not overload `check_intake_template_parity.py`:

- **`--scope=opencode-adapter` parity CLI predicate** = **byte-identical pair check only**. Each pair must be byte-identical (file content hash match); each enumerated surface file must exist (non-empty). Exit 0 = `[INTAKE_TEMPLATE_PARITY_OK] scope=opencode-adapter`; non-zero = `INTAKE_TEMPLATE_PARITY_FAILED` with the failing pair name. The parity CLI does NOT grep for reason-code table presence and does NOT grep for `test_us0126_*` markers.
- **Reason-code table presence + `test_us0126_*` markers** = **contract-test grep**, NOT parity-CLI predicates. `test_us0126_reason_code_catalog_present` (marker 2) and `test_us0126_test_marker_checklist` (marker 4) / `test_us0126_prior_story_markers_present` (marker 12) are the grep layers — they live in `tests/us0126_contract_test.py`, not in `check_intake_template_parity.py`. Execute must NOT add reason-code-table or test-marker grep predicates to the parity CLI; the parity CLI stays byte-only.

**Surface coverage** (the `--scope=opencode-adapter` flag validates the whole epic surface in one invocation):

1. `template/.opencode/agents/**` (US-0122 — installed via manifest `[opencode_install_include_paths]`).
2. `template/.opencode/commands/**` (US-0125 — 15 files; installed via manifest).
3. `template/.opencode/plugins/orchestrator.ts` (US-0124 — installed via manifest).
4. `template/.opencode/model-catalog.local.example.json` (US-0123 — installed via manifest).
5. `scripts/opencode_model_catalog_apply.py` (US-0123 — installed via manifest).
6. Installer host help/manifest: `docs/engineering/context/installer-owned-paths.manifest` ↔ template (US-0121 — existing pair).
7. `scripts/check_intake_template_parity.py` ↔ template (US-0121 — existing pair; self-parity).
8. `tests/us0121_host_mode_test.py`..`tests/us0126_contract_test.py` ↔ template (US-0121..US-0126 — 6 pairs; US-0126 adds the 6th).
9. `scripts/model_tier_validate.py` ↔ template (US-0123 — existing pair).
10. `docs/engineering/runbook.md` ↔ `template/docs/engineering/runbook.md` (US-0126 — NEW pair; validates the runbook section byte-identical active↔template).

`test_us0126_parity_scope_opencode_adapter` (DQ4 marker 3) runs `python scripts/check_intake_template_parity.py --scope=opencode-adapter` and asserts exit 0.

<!-- US-0126 ARCHITECTURE BODY CONTINUES BELOW -->

### `test_us0126_*` contract-test list (DQ4 LOCKED — AC-4; 12 markers, static/grep, no live OpenCode probe)

`tests/us0126_contract_test.py` + `template/tests/us0126_contract_test.py` (byte-identical pair — DQ3). All markers are static/grep-based; no live OpenCode runtime probe (vision D10 lock). 12 markers (one-test-per-AC, AC-5 splits into readme + runbook no-dec-leak; +1 aggregate prior-story marker — kept separate from marker 4 for explicit defense in depth):

| # | Marker | AC | Assertion |
|---|--------|-----|-----------|
| 1 | `test_us0126_runbook_section_present` | AC-1 | grep `docs/engineering/runbook.md` + `template/docs/engineering/runbook.md` for `## OpenCode host operator runbook (US-0126)` h2 (DQ1 lock). |
| 2 | `test_us0126_reason_code_catalog_present` | AC-2 | grep runbook for each code in the consolidated table (DQ2 lock): 4 `OPENCODE_*` (US-0124) + 5 installer `OPENCODE_*`/`CURSOR_*` (US-0121) + 3 reused cross-host + raw Python validator codes; assert each code has a one-line semantics + fail-closed action. |
| 3 | `test_us0126_parity_scope_opencode_adapter` | AC-3 | run `python scripts/check_intake_template_parity.py --scope=opencode-adapter` and assert exit 0 (DQ3 lock). |
| 4 | `test_us0126_test_marker_checklist` | AC-4 | grep `tests/` for `test_us0121_*`..`test_us0125_*` markers (aggregate per-story checklist; one marker per prior epic slice); assert each prior slice has its documented markers. |
| 5 | `test_us0126_readme_no_dec_leak` | AC-5a | US-0071 sanitization grep on `README.md` (and `template/its_magic/README.md`): assert no `DEC-xxxx` ids in operator-facing sentences (code references in evidence/footnotes allowed; operator prose must not leak DEC ids). |
| 6 | `test_us0126_runbook_no_dec_leak` | AC-5b | US-0071 sanitization grep on `docs/engineering/runbook.md` US-0126 section + template: assert no `DEC-xxxx` ids in operator-facing sentences (cross-references to DEC ids allowed only in a separate "Boundaries/evidence" subsection, not in operator prose). |
| 7 | `test_us0126_program_dod_documented` | AC-6 | grep runbook for the DoD sentence key phrases (DQ5 lock): "fresh `its-magic --host opencode` install", "distinct sessions", "refuse writes on non-zero exit". |
| 8 | `test_us0126_default_host_reminder` | AC-7 | grep runbook + README for the default-host reminder phrases (DQ6 lock): "Default install is cursor-only", "`--host opencode`", "`--host both`". |
| 9 | `test_us0126_out_of_scope_listed` | AC-8 | grep runbook + README for each excluded item name (DQ7 lock): "standalone runtime", "OpenCode fork", "VS Code contrib rewrite", "Caveman", "Cursor browser as primary UAT". |
| 10 | `test_us0126_template_doc_parity` | AC-9 | assert `docs/engineering/context/installer-owned-paths.manifest` active↔template byte-identical (DQ8 lock — no new entries) + `docs/engineering/runbook.md` active↔template byte-identical for installer-owned doc paths touched by this slice. |
| 11 | `test_us0126_cursor_docs_not_deleted` | AC-10 | **Deterministic static check (DQ4 lock — NOT a frozen pre-US-0126 git snapshot, which is fragile)**: assert `.cursor/commands/` and `.cursor/agents/` directories still exist with expected file names vs current kit inventory (a manifest-style baseline checked into the repo, e.g. a sorted file-name list of `.cursor/commands/*.md` + `.cursor/agents/*.md` captured at execute time and asserted present). No git history dependency. |
| 12 | `test_us0126_prior_story_markers_present` | AC-4 aggregate | grep `tests/` for `test_us0121_*`..`test_us0125_*` markers (aggregate prior-story marker presence — kept separate from marker 4 for explicit defense in depth; may be merged with marker 4 at execute if redundancy is justified, but architecture locks 12 for clarity). |

Surjective AC coverage: AC-1 (marker 1), AC-2 (marker 2), AC-3 (marker 3 + marker 10), AC-4 (markers 4, 12), AC-5 (markers 5, 6), AC-6 (marker 7), AC-7 (marker 8), AC-8 (marker 9), AC-9 (marker 10), AC-10 (marker 11). Every AC has ≥1 marker.

**AC-10 baseline lock (critic NB `ik_us0126_research_scope_yagni_markers` closed)**: `test_us0126_cursor_docs_not_deleted` asserts via a **deterministic static check** — `.cursor/commands/` and `.cursor/agents/` still exist with expected file names vs a current-kit-inventory baseline (a sorted file-name list checked into the repo at execute time). NOT a frozen pre-US-0126 git snapshot (fragile — requires immutable historical git state). NOT a hash manifest of the entire `.cursor/` directory (over-broad). The static check is grep/file-presence only; no live OpenCode probe.

### Template parity manifest (DQ8 LOCKED — AC-9)

`docs/engineering/context/installer-owned-paths.manifest` (active + template byte-identical) is **unchanged** — no new entries. The runbook is already installer-owned via `docs` in `[install_include_paths]`; the new "OpenCode host operator runbook (US-0126)" h2 section is part of the runbook — no new manifest entry needed for the section. `tests/us0126_contract_test.py` is NOT installer-shipped (matches US-0121..US-0125 pattern); it is parity-validated via the new `OPENCODE_ADAPTER_PAIRS` pair (DQ3 lock). The manifest itself stays byte-identical active↔template (no new entries); the runbook active↔template parity is validated via the new `OPENCODE_ADAPTER_PAIRS` runbook pair (DQ3 lock).

<!-- US-0126 ARCHITECTURE BODY CONTINUES BELOW -->

## Risks mitigated

All 6 risks from R-0109 US-0126 ACCEPTED, plus 3 research critic NBs closed:

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1: Reason-code namespace collision with US-0125 stub references | MEDIUM → LOW | DQ2 consolidated table (US-0126 owns canonical cross-host table; US-0124/US-0125 stub h2 sections cross-link; NO `OPENCODE_VALIDATOR_FAILED` wrapper per DEC-0125 DQ7); T-005 + marker 2 `test_us0126_reason_code_catalog_present` asserts. |
| R2: Parity-scope drift — `--scope=opencode-adapter` coverage gaps | MEDIUM → LOW | DQ3 additive `OPENCODE_ADAPTER_PAIRS` extension (2 new pairs; no sibling script); T-003 + marker 3 `test_us0126_parity_scope_opencode_adapter` asserts exit 0. |
| R3: Operator-sentence DEC leakage | MEDIUM → LOW | DQ6/DQ7 US-0071 sanitization (no DEC ids in operator prose; cross-references to runbook h2 / Boundaries subsection only); markers 5 + 6 `test_us0126_readme_no_dec_leak` + `test_us0126_runbook_no_dec_leak` assert. |
| R4: Template-parity gap — new runbook section not mirrored under `template/` | LOW–MEDIUM → LOW | DQ8 runbook pair in `OPENCODE_ADAPTER_PAIRS` (active↔template byte-identical); T-003 + marker 10 `test_us0126_template_doc_parity` asserts. |
| R5: Program-DoD ambiguity ("without Cursor" + "different sessions/providers" + "validators still block") | LOW–MEDIUM → LOW | DQ5 operationally precise locked wording (static documentation test, not live probe); marker 7 `test_us0126_program_dod_documented` asserts key phrases. |
| R6: Cursor-kit deletion temptation | LOW → LOW | DQ4 marker 11 `test_us0126_cursor_docs_not_deleted` asserts `.cursor/commands/` + `.cursor/agents/` present via deterministic static check (current-kit-inventory baseline, not frozen git snapshot); AC-10 compose guard. |
| C1 (critic NB): `ik_us0126_dq3_parity_grep_false_pass` | → closed | DQ3 explicit layer split: `--scope=opencode-adapter` = byte-identical pair check only; reason-code table presence + `test_us0126_*` markers = contract-test grep, NOT parity-CLI predicates. Execute must not overload `check_intake_template_parity.py`. |
| C2 (critic NB): `ik_us0126_layering_runbook_dec_tests` | → closed | DQ1 + DQ8: runbook pair is whole-file byte-identical (installer-owned `docs`); coupling risk documented; execute must keep active↔template runbook byte-identical after adding the new h2. |
| C3 (critic NB): `ik_us0126_research_scope_yagni_markers` | → closed | DQ4: 12 markers locked (AC-5 split is real; marker 4 + marker 12 kept separate for defense in depth); AC-10 baseline = deterministic static check vs current-kit-inventory, not frozen git snapshot. |

## Non-goals (this slice)

- **Implement the runbook h2 body** — architecture locks the wording; execute ships the actual h2 body into `docs/engineering/runbook.md` + `template/docs/engineering/runbook.md`. Architecture does NOT write the runbook section body in this phase.
- **Implement the contract tests** — architecture locks the 12 marker names + grep patterns; execute authors `tests/us0126_contract_test.py` + `template/tests/us0126_contract_test.py`.
- **Extend `check_intake_template_parity.py` with grep predicates** — parity CLI stays byte-only (DQ3 layer split); reason-code table presence + test markers are contract-test grep, not parity-CLI predicates.
- **Edit `## OpenCode host mode (US-0121)` h2** — US-0121 owns the installer-flag reference; US-0126 cross-links to it (compose, do not amend).
- **Edit `## OpenCode orchestrator plugin reason codes (US-0124)` h2** — US-0124 owns the stub; US-0126 owns the consolidated table and cross-links.
- **Edit `## OpenCode thin commands + validator bridge (US-0125)` h2** — US-0125 owns the stub; US-0126 owns the consolidated table and cross-links.
- **Add `tests/us0126_contract_test.py` to `[install_include_paths]`** — test files are NOT installer-shipped per US-0121..US-0125 pattern (DQ8).
- **Resurrect `OPENCODE_VALIDATOR_FAILED` wrapper** — DEC-0125 DQ7 REJECTED it (DQ2).
- **Live OpenCode probe in CI** — forbidden by vision D10 (DQ4, DQ5).
- **Frozen pre-US-0126 git snapshot for AC-10** — fragile; deterministic static check used instead (DQ4).
- **New GUI / standalone runtime / OpenCode fork / VS Code contrib rewrite / Caveman / Cursor-browser-as-primary-UAT** — all out of scope (DQ7).

## Compose guards (UNCHANGED — additive only)

| Compose target | Verification | Result |
|---|---|---|
| US-0071 (operator-sentence sanitization) | no DEC ids in operator prose; cross-references to runbook h2 / Boundaries subsection only (DQ6/DQ7) | ✅ compose |
| US-0113..US-0117 (operator docs) | add OpenCode host section; do not rewrite Cursor command catalogs | ✅ compose |
| US-0121 / DEC-0120 (installer `--host` flag docs hook — runbook L3870 h2) | untouched — US-0126 cross-links to it; does not rewrite the US-0121 h2 | ✅ untouched |
| US-0122 / DEC-0122 (seven role agents) | runbook references seven role agents; does not redefine permissions | ✅ compose |
| US-0123 (per-role slug routing) | runbook references `/connect` keys + per-role slug routing; does not re-list vendor slugs | ✅ compose |
| US-0124 / DEC-0124 (orchestrator plugin + stub reason-code h2 L3995) | untouched — US-0126 owns consolidated table; cross-links to US-0124 stub h2; does not reimplement plugin logic | ✅ untouched |
| US-0125 / DEC-0125 (thin commands + validator-bridge stub h2 L4009) | untouched — US-0126 owns consolidated table; cross-links to US-0125 stub h2; **DEC-0125 DQ7 raw Python reason codes upheld — `OPENCODE_VALIDATOR_FAILED` wrapper NOT resurrected** | ✅ untouched |
| US-0102 / DEC-0087 (no vendor slugs in `template/`) | no vendor slugs in runbook/README operator prose | ✅ untouched |

Contract tests `test_us0126_readme_no_dec_leak` (marker 5) + `test_us0126_runbook_no_dec_leak` (marker 6) + `test_us0126_cursor_docs_not_deleted` (marker 11) + `test_us0126_template_doc_parity` (marker 10) enforce at execute boundary.

<!-- US-0126 ARCHITECTURE BODY CONTINUES BELOW -->

## Sprint seeds preview (within SPRINT_MAX_TASKS=12)

| Seed | Description | AC |
|------|-------------|-----|
| **T-anch** | Verify `# US-0126` H1 anchor placed AFTER `# US-0125` and BEFORE `US-0089` per DEC-0073; DEC-0126 Accepted; compose guards 8/8; 12-marker list locked; runbook h2 + reason-code table + parity extension + DoD/reminder/out-of-scope + manifest lock locked in DEC-0126. | AC-9, AC-10 |
| **T-001** | Runbook section `## OpenCode host operator runbook (US-0126)` in `docs/engineering/runbook.md` + `template/docs/engineering/runbook.md` byte-identical — program DoD sentence + default-host reminder + out-of-scope list + Boundaries subsection + consolidated reason-code table + parity scope cross-link; DQ1/DQ5/DQ6/DQ7/DQ2 locks. | AC-1, AC-2, AC-6, AC-7, AC-8 |
| **T-002** | README user-visible OpenCode host blurb in `README.md` + `template/its_magic/README.md` — default-host reminder + out-of-scope list (operator prose, no DEC ids); DQ6/DQ7 locks. | AC-5, AC-7, AC-8 |
| **T-003** | `scripts/check_intake_template_parity.py` `OPENCODE_ADAPTER_PAIRS` additive extension — 2 new pairs: `tests/us0126_contract_test.py` ↔ template + `docs/engineering/runbook.md` ↔ template; DQ3 lock; parity CLI stays byte-only (no grep predicates). | AC-3, AC-9 |
| **T-004** | `tests/us0126_contract_test.py` + `template/tests/us0126_contract_test.py` byte-identical — 12 markers per DQ4 lock; static/grep, no live OpenCode probe. | AC-4 |
| **T-005** | Consolidated reason-code table authoring — 4 `OPENCODE_*` US-0124 + 5 installer `OPENCODE_*`/`CURSOR_*` US-0121 + 3 reused cross-host + raw Python validator codes; each with one-line semantics + fail-closed action + cross-link to owning slice; NO `OPENCODE_VALIDATOR_FAILED` wrapper; DQ2 lock. | AC-2 |
| **T-006** | US-0071 sanitization grep tests — `test_us0126_readme_no_dec_leak` + `test_us0126_runbook_no_dec_leak`; assert no DEC ids in operator-facing sentences; cross-references to DEC ids allowed only in Boundaries/evidence subsection. | AC-5 |
| **T-007** | Program DoD static documentation test — `test_us0126_program_dod_documented`; grep for locked DoD sentence key phrases; DQ5 lock. | AC-6 |
| **T-008** | Default-host reminder + out-of-scope tests — `test_us0126_default_host_reminder` + `test_us0126_out_of_scope_listed`; DQ6/DQ7 locks. | AC-7, AC-8 |
| **T-009** | Parity + Cursor-docs-not-deleted tests — `test_us0126_parity_scope_opencode_adapter` + `test_us0126_template_doc_parity` + `test_us0126_cursor_docs_not_deleted`; DQ3/DQ8 locks; AC-10 deterministic static check (current-kit-inventory baseline, not frozen git snapshot). | AC-3, AC-9, AC-10 |
| **T-010** | Prior-story marker checklist — `test_us0126_test_marker_checklist` / `test_us0126_prior_story_markers_present`; grep `tests/` for `test_us0121_*`..`test_us0125_*` markers; AC-4 aggregate. | AC-4 |

**Total: 11 tasks (T-anch + T-001..T-010) — within `SPRINT_MAX_TASKS=12`.** `/sprint-plan` may merge or split within the 12-task budget.

**AC mapping (10 ACs → 11 tasks surjective)**: AC-1 → T-001+T-004; AC-2 → T-005+T-004; AC-3 → T-003+T-009+T-004; AC-4 → T-004+T-010; AC-5 → T-002+T-006; AC-6 → T-007; AC-7 → T-002+T-008; AC-8 → T-002+T-008; AC-9 → T-003+T-009; AC-10 → T-009.

## DC check

`dc_check=clean`. No `# US-0126` or `## US-0126` existed in `architecture.md` prior to THIS write (verified by R-0109 US-0126 DC check). H1 anchor added per DEC-0076 / BUG-0010 heading policy — placed AFTER `# US-0125` (L1836) and BEFORE `US-0089` (L2103) per DEC-0073. Deferral register clean.

## Stop conditions

- `decision_gate=false`
- `missing_acceptance_criteria=none` (10/10 ACs covered by 12 contract-test markers + compose guards 8/8)
- `compose_guards=8/8 UNCHANGED (additive only)`
- `dc_check=clean`
- DQ1..DQ8 LOCKED for US-0126; 6/6 R ACCEPTED; A1 locked; 3 research critic NBs closed
- Triad baseline `baseline_h2_count=38` preserved (H1 used, not H2)
- Triad `--rollover` + `--check` + `--check-arch-heading-policy --baseline-h2-count 38` (run from repo root after this write)

## Sovereign memory note

`assemble_sovereign_memory_digest(...)` NOT called. No write to `mistakes.jsonl`.

## Consequences

- **Positive**: Operators on the OpenCode host get a single consolidated cross-host reason-code table + a locked operator runbook section (program DoD + default-host reminder + out-of-scope list) mirrored active↔template byte-identical; `--scope=opencode-adapter` validates the whole epic surface (10 pairs) in one invocation; 12 static/grep contract markers prove AC-1..AC-10 without any live OpenCode runtime probe (vision D10 upheld); US-0121/US-0122/US-0123/US-0124/US-0125 stub h2 sections stay untouched (compose, do not amend); US-0071 sanitization enforced (no DEC ids in operator prose); AC-10 cursor-kit-not-deleted enforced via deterministic static check (no fragile git snapshot).
- **Negative**: One new runbook h2 section (mirrored); one README blurb (mirrored); one `OPENCODE_ADAPTER_PAIRS` additive extension (2 pairs); one new contract test file (12 markers, mirrored).
- **Neutral**: `installer-owned-paths.manifest` unchanged (runbook already covered by `docs`); `tests/us0126_contract_test.py` not installer-shipped (matches US-0121..US-0125 pattern); Cursor `.cursor/commands/*.md` + `.cursor/agents/*.md` unchanged; US-0102 volatile-ID rule respected.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0126`, `sprint_id=(pending — created at sprint-plan)`
- `orchestrator_run_id=auto-20260825-01`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro per US-0096 / DEC-0082)
- `model_id=glm-5.2-high` (CROSS_MODEL_REVIEW=1 — required; this spawn's producer model)
- `fresh_context_marker=tl-US0126-architecture-20260825T160542Z-fresh`, `timestamp=2026-08-25T16:05:42Z` (UTC)
- `evidence_ref=docs/engineering/architecture.md # US-0126 (this section), decisions/DEC-0126.md (companion DEC), docs/engineering/research.md ## R-0109 ### Deepened findings — US-0126 (DQ1..DQ8 LOCKED), docs/product/backlog.md ## US-0126 (D1..D10 + 10 ACs + DQ1..DQ8, status OPEN untouched, AC checkboxes untouched), docs/product/acceptance.md US-0126 row (L154 unchecked), docs/product/vision.md ## Intake Notes — US-0126 + ## Discovery Notes — US-0126, handoffs/po_to_tl.md US-0126 section, handoffs/sovereign_critic_findings.jsonl US-0126 research rows (3 non-blocking carry-forwards closed here), handoffs/resume_brief.md (US-0126 sovereign-critic PASS prepend consumed), decisions/DEC-0125.md (read-only compose — DQ7 raw Python reason codes + OPENCODE_VALIDATOR_FAILED wrapper REJECTED), decisions/DEC-0124.md (read-only compose — DQ4 reason-code namespace + DQ6 OPENCODE_DRIVER_INVOKE_FAILED), decisions/DEC-0122.md (read-only compose), decisions/DEC-0120.md (read-only compose), decisions/DEC-0060.md (read-only compose), decisions/DEC-0051.md (read-only compose), docs/engineering/runbook.md L3870–L4017 (OpenCode host h2 inventory — US-0121/US-0122/US-0123/US-0124/US-0125 h2 sections read-only compose), scripts/check_intake_template_parity.py L484–L517 (OPENCODE_ADAPTER_PAIRS read-only compose), docs/engineering/context/installer-owned-paths.manifest (read-only compose), docs/engineering/architecture.md # US-0125 (format template), docs/engineering/decisions.md ## DEC-0125 (stub format template), docs/product/acceptance.md L154 (US-0126 row — read-only, NOT mutated)`
- Fresh tech-lead subagent per BUG-0006 / US-0048 isolation; no prior chat history carried forward. Context limited to narrow-read files (US-0053). No `.env` reads, no credentials access, no intake-evidence mutation, no backlog status/AC mutation, no acceptance.md mutation, no vision.md D1–D10 rewrite, no US-0121..US-0125 DONE reopening.
- Prior proof consumed: `rp-auto-20260825-01-research-tech-lead-20260825T155615Z-US-0126` (`proof_hash=22035314D2CD5763ECDBED6A3426B696A57331035F84E3BDEC97FC7DFAC3B188`, ttl 2026-08-25T16:56:15Z — consumed before RUNTIME_PROOF_STALE).
- Triad baseline `baseline_h2_count=38` preserved via H1 anchor (no new H2 `## US-` headings added).

## Strict runtime proof (DEC-0038)

- `runtime_proof_id=rp-auto-20260825-01-architecture-tech-lead-20260825T160542Z-US-0126`
- Canonical payload (sorted-key JSON per DEC-0038): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"glm-5.2-high","orchestrator_run_id":"auto-20260825-01","phase_id":"architecture","proof_issued_at":"2026-08-25T16:05:42Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260825-01-architecture-tech-lead-20260825T160542Z-US-0126","sprint_id":"(pending)","story_id":"US-0126"}`
- `proof_hash=EEE667DAEE41839D9695C25D4BBFF2D8FA383CAEF6FDA69BFFEAF1D28B5263A2` (SHA-256 of sorted-key compact JSON payload, UTF-8 bytes via `C:\Users\flow\AppData\Local\Programs\Python\Python312\python.exe` hashlib; independently recomputed and confirmed match BEFORE returning)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-08-25T17:05:42Z` (UTC = issued_at + 3600s)
- `hash_recompute_confirmation=true` (independent Python hashlib recompute on the exact canonical payload above yields `EEE667DAEE41839D9695C25D4BBFF2D8FA383CAEF6FDA69BFFEAF1D28B5263A2` — byte-identical match)

## Decision gate

- `decision_gate=false` (companion DEC-0126 authored Accepted in THIS phase; approach A1 locked; DQ1..DQ8 LOCKED for US-0126; 6/6 R ACCEPTED; 3 research critic NBs closed; DC check clean; compose guards 8/8 UNCHANGED)
- `stop_conditions_met=yes`

## Next scheduled phase

- `next_scheduled_phase=/sprint-plan` (role=tech-lead per US-0069 / DEC-0051 phase→role matrix default; third canonical phase of `plan` macro per ultra_lean; research + architecture + sprint-plan merged into `plan` macro — after sovereign-critic of architecture)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to sovereign-critic of architecture, then /sprint-plan in fresh tech-lead subagent (BUG-0006). Do not spawn /sprint-plan from this subagent. Do not mark US-0126 DONE. Do not tick acceptance L154. Do not mutate intake JSON. Do not reopen US-0121..US-0125 DONE. Do not rewrite vision D1–D10.`

