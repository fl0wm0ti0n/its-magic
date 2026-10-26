---
story_id: BUG-0026
closure_date: 2026-10-24T10:24:31Z
closure_role: curator
pre_closure_status: OPEN
post_closure_status: DONE
release_evidence_refs: ["handoffs/release_queue.md", "handoffs/releases/S0177-release-notes.md", "sprints/S0177/qa-findings.md", "sprints/S0177/uat.json", "tests/report.md"]
isolation_evidence: {"phase_id": "closure", "role": "curator", "model_id": "zelisko_llm/qwen3.8-27b", "fresh_context_marker": "curator-BUG0026-closure-20261024T102431Z-fresh", "timestamp": "2026-10-24T10:24:31Z", "evidence_ref": "sprints/S0177/closure-verification.md"}
runtime_proof: {"runtime_proof_id": "rp-auto-20261023-bug0026-closure-curator-20261024T102431Z-BUG-0026", "proof_hash": "aa72efda1ada595190e39188a42f709f921ffc0045b13ab6aa1778107c2fb0e2", "proof_ttl": "2026-10-24T11:24:31Z"}
normalization_notes: "Bug work-item closure: story_id=BUG-0026. qe unavailable -> curator alternate per DEC-0052 (precedents S0169/US-0149, S0160/BUG-0027). CROSS_MODEL_REVIEW=0 - no sovereign-critic consume. AC-3 cross-OS evidence cited (read-only): Windows row implementation_notes (2026-09-19) its-magic@0.1.5 upgrade --host both -> STANDALONE_BOOTSTRAP_OK/POSTINSTALL_OK; Linux row re-attested by execute child (Debian 13 WSL2, Node v24.19.0, CPython 3.12.15, global its-magic@0.1.5, range artifact present, upgrade v0.1.4->v0.1.5 exit 0; tokens present HOST_CONFIG_POSTINSTALL_OK/STANDALONE_BOOTSTRAP_OK/STANDALONE_POSTINSTALL_OK; absent KERNEL_CONTRACT_MISMATCH/STANDALONE_SUPPORTED_RANGE_MISSING/STANDALONE_BOOTSTRAP_FAILED/PYTHON_NOT_FOUND; posix .its-magic/bin/itsm mode 0755). npm_published=false; no git push; no republish. US-0149 (blocks_us) remains OPEN (not drained). BUG-0022/BUG-0024 remain OPEN (not drained). BUG-0025 DONE not reopened. No .env read. No /refresh-context spawn."
---

# Closure Verification — BUG-0026 / S0177 / auto-20261023-bug0026-closure

- **story_id** / **bug_id**: BUG-0026
- **sprint_id**: S0177
- **orchestrator_run_id**: auto-20261023-bug0026-closure
- **closure_date**: 2026-10-24T10:24:31Z (UTC)
- **closure_role**: curator
- **phase_id**: closure (ship macro phase 3 of 3 per DEC-0082)
- **delivery_mode**: ultra_lean
- **macro_phase**: ship
- **model_id**: zelisko_llm/qwen3.8-27b (CROSS_MODEL_REVIEW=0)
- **fresh_context_marker**: curator-BUG0026-closure-20261024T102431Z-fresh
- **pre_closure_status**: OPEN
- **post_closure_status**: DONE
- **verdict**: **CLOSURE_PASS**

## Input prerequisites (fail-gated — all met)

| # | Prerequisite | Evidence | Status |
|---|---|---|---|
| 1 | `handoffs/release_queue.md` S0177 row `status=released` | S0177 / BUG-0026 / released (RELEASE_PASS 2026-10-24T10:06:41Z) | **MET** |
| 2 | `handoffs/releases/S0177-release-notes.md` PASS verdict | Re-attestation (release2) RELEASE_PASS (run `auto-20261023-bug0026-release`; npm_published=false, git_pushed=false) | **MET** |
| 3 | `sprints/S0177/qa-findings.md` exists | RE-ATTEST QA_PASS; blocking_count=0 | **MET** |
| 4 | `sprints/S0177/uat.json` PASS | 9/9 PASS | **MET** |
| 5 | Harness gate | `tests/report.md` 2026-10-24T10:05:47Z Pass=884 Fail=0 | **MET** |
| 6 | Release strict proof consumed (not STALE) | `rp-auto-20261023-bug0026-release-release-20261024T100641Z-BUG-0026` / `8a92de7f66b2fbc08da87459e78840aab9e52de1d5ccadf6b7c271e9a757ca4c` (MATCH two-method); issued 2026-10-24T10:06:41Z + TTL 3600 = expiry 2026-10-24T11:06:41Z; **IN-TTL** at closure issue 2026-10-24T10:24:31Z (~3,513 s remaining); `validate_resume_pair(writer_role=release)` ok=true | **MET** |

CROSS_MODEL_REVIEW=0 — no sovereign-critic of release required. No `CLOSURE_RELEASE_EVIDENCE_MISSING` stop condition triggered.

## Canonical status source (US-0045 / DEC-0025)

- **Canonical status owner**: `docs/product/backlog.md` (### BUG-0026 block, L5566)
- **Pre-closure**: `Status: OPEN` (L5568)
- **Post-closure**: `Status: DONE` (mutated by this closure run — target block only)
- **Derived view**: `docs/product/acceptance.md` BUG-0026 row (L226) `- [ ]` → `- [x]`
- **Story-block ACs**: backlog AC-1/AC-2/AC-4/AC-5/AC-6/AC-7/AC-8 held `[x]`; AC-3 `[ ]` → `[x]` (L5572) — the final unticked AC
- **Derived view**: `docs/engineering/state.md` closure checkpoint append-bottom (US-0058 / DEC-0040)

## AC tick summary (contract evidence)

| AC | Closure tick | Evidence basis |
|---|---|---|
| AC-1 | `[x]` (held) | Published `its-magic@0.1.5` includes package-root `standalone/`; `load_supported_range` no longer returns `None` (execute child) |
| AC-2 | `[x]` (held) | Installer loads range from package-root `standalone/` without host-local `its-magic` checkout present (execute child) |
| AC-3 | `[x]` (closure tick) | Cross-OS evidence cited read-only: Windows row `implementation_notes (2026-09-19)` (global `its-magic@0.1.5`, `upgrade --host both` → STANDALONE_BOOTSTRAP_OK/STANDALONE_POSTINSTALL_OK, `.its-magic/bin/itsm` + `itsm.cmd` materialized); Linux row re-attested by execute child (Debian 13 WSL2, Node v24.19.0, CPython 3.12.15, consumer `/home/flow/bug0026-consumer-s0177`, global `its-magic@0.1.5`, `scripts/standalone-supported-kernel-range.json` present, upgrade v0.1.4 → v0.1.5 exit 0; tokens present HOST_CONFIG_POSTINSTALL_OK / STANDALONE_BOOTSTRAP_OK / STANDALONE_POSTINSTALL_OK; tokens absent KERNEL_CONTRACT_MISMATCH / STANDALONE_SUPPORTED_RANGE_MISSING / STANDALONE_BOOTSTRAP_FAILED / PYTHON_NOT_FOUND; posix `.its-magic/bin/itsm` mode 0755) |
| AC-4 | `[x]` (held) | Range source is the package artifact (no host-local checkout dependency) |
| AC-5 | `[x]` (held) | Upgrade completes on clean Windows + Linux environments (evidence above) |
| AC-6 | `[x]` (held) | No false KERNEL_CONTRACT_MISMATCH token emitted on either OS |
| AC-7 | `[x]` (held) | Bootstrap artifacts materialized (`.its-magic/bin/itsm` 0755 + `itsm.cmd`) |
| AC-8 | `[x]` (held) | `its-magic --version` post-upgrade resolves correctly |

Upgrade commands NOT re-run at closure; `.env` NOT read. Evidence consumed read-only from the S0177 execute/qa/verify-work/release artifacts.

## Mutations performed (exclusive writes per US-0120 / DEC-0082)

| # | Artifact | Mutation | Ordering |
|---|---|---|---|
| 1 | `docs/product/backlog.md` | ### BUG-0026: `Status: DONE`; AC-3 `[x]`; `closure_notes` appended | 1 |
| 2 | `docs/product/acceptance.md` | BUG-0026 primary row: `- [ ]` → `- [x]` | 2 |
| 3 | `sprints/S0177/closure-verification.md` | CLOSURE_PASS record (this file) | 3 |
| 4 | `docs/engineering/state.md` | Closure checkpoint append-bottom (state-first) | 4 |
| 5 | `handoffs/resume_brief.md` | Closure PASS prepend → `/refresh-context` (DEC-0153) | 5 |

## Validator bridge (mandated)

- `python scripts/bug_issue_validate.py --repo . --check-acceptance` → **`[BUG_VALIDATION_OK]`** exit 0 (GREEN before the flip; re-run after the flip GREEN).

## Cross-phase ownership guard (US-0061 / DEC-0043)

**Touched**: backlog ### BUG-0026 only; acceptance BUG-0026 row; state closure append; this file; resume_brief prepend.

**NOT touched**: `handoffs/release_queue.md`; `handoffs/releases/S0177-release-notes.md`; `CHANGELOG.md`; `docs/engineering/decisions.md`; `docs/engineering/architecture.md`; release/QA/UAT artifacts (read-only); BUG-0025 DONE not reopened; BUG-0022/BUG-0024 OPEN not drained; US-0149 (blocks_us) OPEN not drained/reopened; npm publish; `git commit`/`git push`; `.env` read; `/auto`; sub-task spawn; `/refresh-context` spawn.

## Release evidence refs

- `handoffs/release_queue.md` (S0177 status=released)
- `handoffs/releases/S0177-release-notes.md` (RELEASE_PASS, re-attestation release2)
- `sprints/S0177/qa-findings.md` (QA_PASS, 0 blocking)
- `sprints/S0177/uat.json` (9/9 PASS)
- `tests/report.md` (2026-10-24T10:05:47Z Pass=884 Fail=0)
- `docs/engineering/state.md` (release + this closure checkpoint)

## Isolation evidence (US-0048 / DEC-0029 / US-0104 v2)

- `phase_id=closure`
- `role=curator`
- `bug_id=BUG-0026`
- `sprint_id=S0177`
- `model_id=zelisko_llm/qwen3.8-27b` (CROSS_MODEL_REVIEW=0)
- `fresh_context_marker=curator-BUG0026-closure-20261024T102431Z-fresh` (NEW per BUG-0006; grep-verified 0 prior occurrences repo-wide before mint; not reused from release marker `release-BUG0026-20261024T100641Z-fresh`)
- `timestamp=2026-10-24T10:24:31Z` (UTC)
- `next_scheduled_phase=refresh-context`
- Fresh curator subagent per BUG-0006 / US-0120 (qe unavailable → curator alternate per DEC-0052). Narrow-read only.

## Runtime proof (US-0056 / DEC-0038)

- `orchestrator_run_id=auto-20261023-bug0026-closure`
- `runtime_proof_id=rp-auto-20261023-bug0026-closure-curator-20261024T102431Z-BUG-0026`
- `phase_id=closure`, `role=curator`, `bug_id=BUG-0026`, `sprint_id=S0177`
- `proof_issued_at=2026-10-24T10:24:31Z`
- `proof_ttl_seconds=3600`
- `proof_ttl=2026-10-24T11:24:31Z`
- `proof_hash=aa72efda1ada595190e39188a42f709f921ffc0045b13ab6aa1778107c2fb0e2`
- Canonical hashed payload: `{"orchestrator_run_id":"auto-20261023-bug0026-closure","phase_id":"closure","proof_issued_at":"2026-10-24T10:24:31Z","proof_ttl_seconds":3600,"role":"curator","runtime_proof_id":"rp-auto-20261023-bug0026-closure-curator-20261024T102431Z-BUG-0026"}`
- `hash_recompute_confirmation=true` (`compute_strict_proof_hash` sorted-key SHA-256 + independent `hashlib.sha256` compact sorted-key — both MATCH `aa72efda1ada595190e39188a42f709f921ffc0045b13ab6aa1778107c2fb0e2`; 0 prior repo occurrences at mint)
- Producer release proof consumed: `rp-auto-20261023-bug0026-release-release-20261024T100641Z-BUG-0026` / `8a92de7f66b2fbc08da87459e78840aab9e52de1d5ccadf6b7c271e9a757ca4c` (IN-TTL at closure issue; integrity-verified two-method + `validate_resume_pair(writer_role=release)` ok=true)

## Honest residual (NB)

- AC-3 cross-OS evidence is **cited, not re-run** at closure: the Windows row is historical (`implementation_notes (2026-09-19)`, `its-magic@0.1.5` post-republish) and the Linux row was re-attested by the execute child during the current cycle. No upgrade command was re-executed by this closure child; no `.env` read. This is consistent with the closure contract (verification, not re-probe).
- `npm_published=false` at closure (release boundary already passed with the republish recorded by the release child); no `git commit`/`git push`; `publish_status` held from release record.
- US-0149 (backlog `blocks_us`) remains **OPEN** (closure does not drain it). BUG-0022/BUG-0024 remain **OPEN** (not drained). BUG-0025 **DONE** not reopened.

## Next phase

**`/refresh-context`** (fresh **curator**). Closure does NOT spawn refresh-context. CROSS_MODEL_REVIEW=0 — no critic after closure.
