# Architecture archive pack (2026-09-18)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 1
- Retained units in hot file: 24
- First archived heading: `# BUG-0016 — OpenCode Layer-1 permissions vs kit duties (amend DEC-0122 §2)`
- Last archived heading: `# BUG-0016 — OpenCode Layer-1 permissions vs kit duties (amend DEC-0122 §2)`
- Verification tuple (mandatory):
  - archived_body_lines=157
  - preamble_lines=1
  - retained_body_lines=2874

---

# BUG-0016 — OpenCode Layer-1 permissions vs kit duties (amend DEC-0122 §2)

## Overview

**`BUG-0016`** closes the **Layer-1 permission matrix vs kit phase-duty gap** on the OpenCode host. US-0122 / DEC-0122 §2 shipped a host-enforced matrix that matches agent frontmatter literally, but blocks required lifecycle validators and owned writes: `po`/`tech-lead`/`curator` `bash: deny`; PO missing intake_evidence / resume_brief / state.md edit allows; literal `sprints/Sxxxx/` globs that never match real sprint ids; release missing duty paths (`release-findings`, `verify-work-to-release`, state/resume_brief/runbook).

**Research anchor**: **`R-0115`** (DQ1–DQ8 LOCKED). **Companion DEC**: **none** — amend **`DEC-0122` §2 in place** as sole matrix SOT (R-0115 DQ6; reject thin DEC-0130 as second matrix). **Out of scope**: reopening US-0122 as a feature story; US-0131/US-0132; amending DEC-0124/0125 unless execute proves Layer-1∩write-guard double-deny; live OpenCode CI probe; bash:`allow`; Cursor Task port.

**Fresh context marker**: `tl-BUG0016-architecture-20260906T184500Z-fresh`
**Orchestrator run id**: `auto-20260906-bug0016`
**Timestamp**: 2026-09-06T18:45:00Z (UTC)
**baseline_h2_count (pre-mutate)**: `0`
**Verdict**: PASS
**Next**: `/sprint-plan`

## Approach locked (A* — from R-0115 DQ1–DQ8)

**Approach A\*** (locked): **Amend DEC-0122 §2** matrix + ship matching **active + template** `.opencode/agents/*.md` frontmatter (byte-identical parity). Bash: `po`/`tech-lead`/`curator` → `"ask"` (reject `"allow"`; object-form bash YAGNI). PO edit adds `handoffs/intake_evidence/**`, `handoffs/resume_brief.md`, `docs/engineering/state.md`. Replace all permission-key `sprints/Sxxxx/…` with `sprints/S*/…`. Release adds `sprints/S*/release-findings.md`, `handoffs/verify-work-to-release.md`, `docs/engineering/state.md`, `handoffs/resume_brief.md`, `docs/engineering/runbook.md` (keep `verify_to_release.md`). Preserve **deny-last** + **success test (c)** (no production/code allow for non-dev). Amend `test_us0122_*` expectations + add **7** additive `test_bug0016_*`. `security`/`auto` unchanged. Layer-1 ∩ plugin write-guard remain conjunctive (DQ8).

| Option | Summary | Verdict |
|--------|---------|---------|
| **A\*** | **Amend DEC-0122 §2 sole SOT + agent frontmatter parity; bash ask; real path globs; 7 static markers; success test (c) preserved** | **Preferred** — minimal duty unblock; R-0115 DQ1–DQ8 |
| A2 (rejected) | `bash: allow` for po/tl/curator | **Rejected** — removes operator prompt; D1/DQ1 |
| A3 (rejected) | Thin companion DEC-0130 as second matrix (or audit DEC that duplicates table) | **Rejected** — R-0115 DQ6 / critic subtractor YAGNI; amend-in-place only |
| A4 (rejected) | `sprints/S[0-9]*/…` or leave `Sxxxx` in permission keys | **Rejected** — OpenCode has no char classes; `Sxxxx` never matches |
| A5 (rejected) | Amend DEC-0124/DEC-0125 bodies preemptively | **Rejected** — DQ8; only if execute proves double-deny |
| A6 (rejected) | New permission middleware / runtime harness in CI | **Rejected** — static harness only; no live probe |

## Critic NB closures (research `b0016rs-*` architecture carry-forwards) — LOCKED here

| ID | Carry-forward | Architecture lock |
|----|---------------|-------------------|
| CF1 / R1 | OpenCode docs catch-all-first vs kit deny-last | **Preserve deny-last.** Document divergence in DEC-0122 §2 + this section; do not flip global order. |
| CF2 / DQ5 | release `runbook.md` allow vs US-0126 ownership | **ALLOW confirmed** — `.cursor/commands/release.md` lists `docs/engineering/runbook.md` as writable derived/ops surface. US-0126 still owns full runbook prose; Layer-1 allow does not transfer ownership. |
| CF3 / DQ8 | Layer-1 ∩ write-guard double-deny | Seed **T-007** execute verify; no DEC-0124/0125 amend unless proven. |
| CF4 / DQ6 | Optional thin DEC-0130 | **None** — amend DEC-0122 §2 only. |
| CF5 | active↔template parity | Gate in T-006 (`test_bug0016_active_template_agent_parity` / opencode-adapter scope). |

## Components

### Amended Layer-1 matrix (normative table = DEC-0122 §2)

Execute ships frontmatter to match the amended DEC table. Delta vs pre-BUG-0016:

| Agent | bash | edit adds / changes |
|-------|------|---------------------|
| po | deny→**ask** | +`handoffs/intake_evidence/**`, +`handoffs/resume_brief.md`, +`docs/engineering/state.md` |
| tech-lead | deny→**ask** | `sprints/Sxxxx/…`→`sprints/S*/…` |
| curator | deny→**ask** | (edit set unchanged) |
| dev | ask (unchanged) | `Sxxxx`→`S*` |
| qa | ask (unchanged) | `Sxxxx`→`S*` |
| release | ask (unchanged) | +`sprints/S*/release-findings.md`, +`verify-work-to-release.md`, +`state.md`, +`resume_brief.md`, +`runbook.md` |
| security | ask + edit deny | unchanged |
| auto | deny + task allowlist | unchanged |

### Contract tests (DQ7 — 7 markers)

Preferred: `tests/bug0016_contract_test.py` (+ template / parity). **Amend** `tests/us0122_contract_test.py` expectations to the new matrix (SOT alignment). Do **not** invent a live OpenCode probe.

| # | Marker | Asserts |
|---|--------|---------|
| 1 | `test_bug0016_po_tl_curator_bash_ask` | po/tech-lead/curator `bash == ask` (not deny/allow) |
| 2 | `test_bug0016_po_intake_resume_state_allows` | PO edit allows intake_evidence/**, resume_brief.md, state.md; `**` deny last; no scripts/** allow |
| 3 | `test_bug0016_sprint_globs_are_s_star_not_sxxxx` | tech-lead/dev/qa/release sprint keys use `sprints/S*/`; `Sxxxx` absent from permission keys |
| 4 | `test_bug0016_release_duty_paths` | release allows release-findings, verify-work-to-release, state.md, resume_brief.md, runbook.md |
| 5 | `test_bug0016_success_test_c_non_dev_no_production_allow` | non-dev: no production/code allow; object-form edit keeps `**` deny last |
| 6 | `test_bug0016_security_auto_unchanged` | security edit deny + bash ask; auto edit/bash deny + 7-role task allow + `*` deny last |
| 7 | `test_bug0016_active_template_agent_parity` | eight agents byte-identical active↔template (or parity scope) |

### Compose / defense-in-depth (DQ8)

- Layer-1 (host frontmatter) ∧ Layer-2 (plugin `tool.hook("execute.before")` write-guard per DEC-0124) — both must allow.
- BUG-0015 DONE = compose note only (spawn path may work); this bug remains permissions-only.

## Touch surfaces (execute)

| Surface | Change |
|---------|--------|
| `decisions/DEC-0122.md` §2 | **Amended in THIS architecture phase** (sole SOT) — execute must not regress |
| `.opencode/agents/{po,tech-lead,dev,qa,release,curator}.md` + `template/.opencode/agents/` peers | Frontmatter parity to amended matrix (`security`/`auto` unchanged) |
| `tests/us0122_contract_test.py` | Expectation realign to amended §2 |
| `tests/bug0016_contract_test.py` (+ template mirror if required) | 7 markers |
| Plugin write-guard (read-only verify) | Confirm no re-deny of duty globs; amend DEC-0124/0125 only if proven |

## Non-goals

- Companion DEC-0130 / second matrix SOT
- Reopening US-0122 as a feature story / DONE acceptance rewrite
- US-0131 / US-0132 config/model parity
- `bash: allow` for any role
- Live OpenCode runtime probe in CI
- Preemptive DEC-0124/0125 body amend

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| R1 deny-last vs OpenCode docs order | MEDIUM → LOW | CF1: preserve deny-last; document divergence |
| R2 `sprints/S*` breadth | LOW | Kit naming; marker 3 |
| R3 Plugin write-guard double-deny | LOW | CF3 / T-007 |
| R4 Companion DEC second SOT | LOW | CF4: no DEC-0130 |
| R5 us0122_* expectation churn | LOW | Intentional SOT realign + additive bug0016_* |

## AC coverage mapping (bug acceptance + R-0115)

| Expected slice | Architecture anchor | Seeds |
|----------------|---------------------|-------|
| bash ask for po/tl/curator | Approach A*; matrix delta | T-001, T-002, T-006(m1) |
| PO intake_evidence + resume_brief + state.md | DQ2; marker 2 | T-001, T-006 |
| Sprint globs `S*` not `Sxxxx` | DQ3; marker 3 | T-002, T-003, T-006 |
| Release duty paths complete | DQ5 / CF2; marker 4 | T-004, T-006 |
| Success test (c) preserved | Ordering + marker 5 | T-anch, T-005, T-006 |
| security/auto unchanged | marker 6 | T-anch, T-006 |
| active↔template parity | CF5; marker 7 | T-001..T-004, T-006 |
| DEC-0122 §2 sole SOT amend | Approach A*; CF4 | T-anch, T-005 |
| Layer-1 ∩ write-guard | DQ8 / CF3 | T-007 |

Acceptance checkbox: `docs/product/acceptance.md` BUG-0016 row remains unchecked until closure (US-0045).

## Atomic task seeds (for `/sprint-plan`)

| # | Seed | Surfaces |
|---|------|----------|
| T-anch | Verify `# BUG-0016` H1 + DEC-0122 §2 amended (sole SOT) + approach A* + R-0115 DQ1–DQ8 + CF1–CF5 closed + no DEC-0130 + success test (c) prose intact | architecture.md, `decisions/DEC-0122.md` (read-only verify) |
| T-001 | Amend `po.md` active+template: `bash: ask`; add intake_evidence/**, resume_brief.md, state.md; `**` deny last | `.opencode/agents/po.md` + template |
| T-002 | Amend `tech-lead.md` + `curator.md`: `bash: ask`; tech-lead `Sxxxx`→`S*` for sprint.md/tasks.md | active + template |
| T-003 | Amend `dev.md` + `qa.md`: sprint keys `Sxxxx`→`S*` | active + template |
| T-004 | Amend `release.md`: +release-findings, +verify-work-to-release, +state.md, +resume_brief.md, +runbook.md; keep verify_to_release | active + template |
| T-005 | Amend `tests/us0122_contract_test.py` expectations to amended §2 matrix | us0122_contract_test.py (+ template if paired) |
| T-006 | Add 7 `test_bug0016_*` markers + active↔template parity gate | `tests/bug0016_contract_test.py` (+ template) |
| T-007 | DQ8: verify plugin write-guard does not re-deny duty globs for owning roles; document only; amend DEC-0124/0125 **only if** contradiction proven | orchestrator write-guard (read/verify) |

**Task count**: 8 seeds (T-anch + T-001..T-007). `SPRINT_MAX_TASKS=12` — no auto-split. Not `/quick` (multi-file matrix + dual test surfaces).

## Decision linkage

- Decision: **DEC-0122** (Accepted — **§2 amended in THIS phase** by BUG-0016; sole matrix SOT)
- Companion DEC: **none** (DEC-0130 rejected)
- Compose (do not amend unless T-007 proves): **DEC-0124**, **DEC-0125**, **DEC-0069**, **US-0078** / **US-0079**, **US-0126** (runbook prose ownership)
- Research: **R-0115** (composes **R-0109**)
- Related: **US-0122**, **BUG-0015** (DONE compose-note only), **US-0131** / **US-0132** (out of scope)

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `bug_id=BUG-0016`, `sprint_id=none`, `orchestrator_run_id=auto-20260906-bug0016`
- `delivery_mode=ultra_lean`, `macro_phase=plan`
- `fresh_context_marker=tl-BUG0016-architecture-20260906T184500Z-fresh`, `timestamp=2026-09-06T18:45:00Z`
- Narrow-read: R-0115; BUG-0016 backlog/acceptance; DEC-0122 §2; `# BUG-0015` template; critic `b0016rs-*`; architecture heading policy
- No agent frontmatter mutation in this phase (execute owns); no DONE flip; acceptance unchecked

## Strict runtime proof

- `runtime_proof_id=rp-auto-20260906-bug0016-architecture-techlead-20260906T184500Z-BUG-0016`
- Canonical payload: `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"composer-2.5","orchestrator_run_id":"auto-20260906-bug0016","phase_id":"architecture","proof_issued_at":"2026-09-06T18:45:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260906-bug0016-architecture-techlead-20260906T184500Z-BUG-0016","sprint_id":"none","story_id":"BUG-0016"}`
- `proof_hash=7AC851CDF1953594365AFF11B015BFD850E737F75A327FA2A02B1CCB544D5A31`
- `proof_ttl=2026-09-06T19:45:00Z`

