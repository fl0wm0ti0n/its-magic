# Architecture archive pack (2026-09-13)

- Rollover trigger: `ARCH_HOT_MAX_LINES=3000, ARCH_HOT_MAX_STORY_SECTIONS=120`
- Source: `docs/engineering/architecture.md`
- Archived units (oldest first, contiguous prefix): 2
- Retained units in hot file: 20
- First archived heading: `# US-0134 — Existing kernel bridge and compatibility handshake`
- Last archived heading: `# US-0135 — Standalone authentication and model routing`
- Verification tuple (mandatory):
  - archived_body_lines=283
  - preamble_lines=1
  - retained_body_lines=2992

---

# US-0134 — Existing kernel bridge and compatibility handshake

## Overview

**US-0134** adds a host-neutral TypeScript `KernelBridge` so the standalone runtime consumes shipped Python validators and canonical repository artifacts as authoritative contracts. No TypeScript rewrite of validator semantics. No `its-magic-kernel/` extraction. Kit npm `its-magic` stays installer/template. Locate is a three-marker parent walk. Compatibility is an explicit runtime→kernel range (`includePrerelease` so kit `0.1.3-9` is in-range). Fail-closed with exactly four `KERNEL_*` handshake codes.

**Research anchor**: **R-0122** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0134** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0122 + architecture-phase Context7 `/nodejs/node` confirm (`spawn` `cwd` / `timeout` / `AbortSignal` / `windowsHide` / `shell: false`) + `npm view semver version` → **7.8.5** — **no new R-id**.

**Fresh context marker**: `tl-US0134-architecture-20260912T124500Z-fresh`
**Orchestrator run id**: `auto-20260912-us0134`
**Timestamp**: 2026-09-12T12:45:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (orchestrator-owned; CROSS_MODEL_REVIEW=1 critic of architecture first). Do **not** spawn sprint-plan from this subagent (BUG-0006).

## Approach locked (A1 — from R-0122)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | `standalone/packages/kernel-bridge`; three-marker parent walk + `--kernel-root`; DEC-0045 version + `its_magic/kernel-contract.json`; runtime range JSON + `semver@7.8.5` `includePrerelease`; spawn real Python; four `KERNEL_*` codes; thin uat/status wrappers; 10 `test_us0134_*` Win+Linux | **Preferred / LOCKED** — AC-1..AC-6 |
| A2 | Extract `its-magic-kernel/` now | **Rejected** — D1 / §16.4 |
| A3 | Reimplement validators in TypeScript | **Rejected** — D2 / AC-4 |
| A4 | Infer compatibility from filenames / kit `package.json` | **Rejected** — D4 / AC-2 |
| A5 | Reuse OpenCode US-0125 plugin as the standalone bridge | **Rejected** — D9 parallel path |

**Can this be simpler?** Exact-string pin of `0.1.3-9` fails AC-2 (range). Homemade prerelease compare fails R-0122 R1. Folding into `pi-kernel` leaks Pi. Interval JSON + `semver` on `kernel-bridge` only is the simplest design that meets the ACs.

### Locked surfaces (DEC-0134)

1. **Package**: `@its-magic/kernel-bridge` in `standalone/packages/kernel-bridge`. No Pi / no `pi-kernel` dependency. Kit `files` omit `standalone/`.
2. **Locate**: three-marker AND (backlog + `intake_evidence_validate.py` + `.its-magic-version`); cap 16; `--kernel-root` must still pass markers; `locateMode` `kit-dev` | `consumer`.
3. **Version/manifest/range**: DEC-0045 version file + additive `its_magic/kernel-contract.json` (`schema_version`, `kernel_version`, `validators`, `artifact_keys`); runtime `supported-kernel-range.json` `{ minInclusive: "0.1.3-9", maxExclusive: "0.2.0", includePrerelease: true }`; pin `semver@7.8.5`.
4. **Handshake**: `KERNEL_NOT_FOUND` / `KERNEL_VERSION_UNSUPPORTED` / `KERNEL_VALIDATOR_MISSING` / `KERNEL_CONTRACT_MISMATCH` only. Unparseable version = mismatch. Validator FAIL/timeout/crash = `ValidatorResult`, not a fifth code.
5. **Spawn**: probe then resolved interpreter path (never keep `py -3` as the validator process); `cwd`=kernel root; 60s timeout; `windowsHide`; `shell: false`; raw Python reason codes.
6. **Allowlist**: six shipped CLIs + `uat-planner` / `status-reconcile`. Manifest cannot enable unknown names.
7. **Helpers**: `runUatPlanner` → `uat_probe_lib.py`; `runStatusReconcile` → new read-only `status_reconcile_validate.py` (no curator writes).
8. **Tests**: 10 `test_us0134_*`; fixture repos; real Python; Win+Linux; kit twin files-omit + no-Pi-in-bridge.

### Critic NB closures (research us0134rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 R1 semver prerelease / R2 Windows `py -3` orphan / R3 missing manifest / DQ9 codes | LOCKED §3/§4/§5/§10 — `includePrerelease` + `0.1.3-9` in-range and `0.1.2` unsupported fixtures (T-008); resolved interpreter after probe (T-004); fail-closed mismatch no silent default (T-002/T-009); handshake table in DEC-0134 §5 |
| NB2 `# US-0134` + DEC-0134 + durable API; execute owns kernel-bridge; semver pin + status schema architecture-owned | LOCKED this H1 + DEC-0134; API §5; `semver@7.8.5`; `status_reconcile_validate.py` schema §8 |
| NB3 no sprint-plan spawn; no extract; no TS rewrite; US-0135..US-0140 out; R-0120/R-0121 intact | Held — T-anch; Status OPEN; do not spawn `/sprint-plan` from this subagent |

## Components

### `kernel-bridge` package (AC-1, AC-2)

- `standalone/packages/kernel-bridge` with locked KernelBridge interface (DEC-0134 §5)
- `supported-kernel-range.json` beside the package
- `semver@7.8.5` dependency on this package only

### Locate + handshake (AC-1, AC-3)

- Parent walk + `--kernel-root`
- Ordered fail-closed codes (DEC-0134 §5)

### Python validators (AC-4)

- Named allowlist spawn; shipped semantics stay in Python
- New thin `scripts/status_reconcile_validate.py` (read-only)
- Installer include-list adds missing allowlist scripts (DEC-0134 §9)

### Artifact map (AC-5)

- Canonical §2.1 keys; required vs optional as R-0122 DQ6
- No SQLite; no Pi session history

### Contract tests (AC-6)

Ten markers (DEC-0134 §10). Kernel tests: `standalone/tests/contract`. Kit pytest `tests/us0134_contract_test.py` for files-omit + no-Pi-in-bridge. Matrix Windows + Linux.

## Companion DEC = DEC-0134 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0134.md`. Locks A1, KernelBridge API, locate, range, handshake codes, inventory, spawn, status schema, installer shipping, markers.

## Risks finalized (R1–R6 from R-0122)

- **R1 (MEDIUM)** npm semver prerelease footgun → `includePrerelease: true` + contract tests `0.1.3-9` in-range / `0.1.2` unsupported
- **R2 (MEDIUM)** Windows `py -3` launcher vs interpreter kill → probe then resolved `python.exe`; crash/timeout fixture
- **R3 (MEDIUM)** Missing `kernel-contract.json` on already-installed consumers → installer copies; runbook upgrade; fail-closed mismatch
- **R4 (LOW)** Thin status checker mistaken for curator writes → read-only schema; mutation tests
- **R5 (LOW)** Locate false-positive on incomplete trees → three-marker AND
- **R6 (LOW)** Pi import leak into `kernel-bridge` → no Pi deps + grep (compose US-0133 boundary)

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0133 / DEC-0133 / R-0121 | AgentKernel, pins, isolation, `# US-0133` | ✓ compose locate-path only; H1 not reopened |
| US-0125 / DEC-0125 | OpenCode plugin Python bridge | ✓ parallel host; no `OPENCODE_*` on standalone path |
| DEC-0045 | `its_magic/.its-magic-version` | ✓ path unchanged; not the whole contract |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/`; no kernel-bridge in tarball |
| US-0135..US-0148 | later capabilities | ✓ OUT OF SCOPE |
| BUG-0018 / R-0120 | OpenCode `/auto` | ✓ DONE; not reopened; R-0120 not wiped |
| R-0121 | US-0133 research | ✓ not wiped |

## Sprint seeds (10 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (`# US-0134` H1 + DEC-0134 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — locate three-marker parent walk + `--kernel-root` / `kernelRoot` option)
- **T-002** (AC-2 — version file + `kernel-contract.json` + `supported-kernel-range.json` + `semver@7.8.5`)
- **T-003** (AC-3 — ordered `KERNEL_*` handshake)
- **T-004** (AC-4 — Python discovery + resolved-interpreter spawn + timeout mapping)
- **T-005** (AC-1/AC-4 — allowlist `runValidator`)
- **T-006** (AC-5 — `resolveArtifactPaths` required vs optional)
- **T-007** (AC-1/AC-4 — `runUatPlanner` / `runStatusReconcile` + `status_reconcile_validate.py`)
- **T-008** (AC-6 — fixtures + 10 `test_us0134_*` Win/Linux)
- **T-009** (AC-1/AC-2 — compose US-0125/US-0133 docs + kit `files` omit-guard + installer include-list + upgrade recipe)

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered). Not `/quick`.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0134`, `sprint_id=none` (pending — sprint-plan owns folder), `orchestrator_run_id=auto-20260912-us0134`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0134-architecture-20260912T124500Z-fresh`, `timestamp=2026-09-12T12:45:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0122; docs/product/backlog.md ## US-0134; docs/product/acceptance.md US-0134 row; docs/engineering/architecture.md (this # US-0134); decisions/DEC-0134.md; handoffs/resume_brief.md; handoffs/po_to_tl.md Research handoff US-0134; Context7 /nodejs/node`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133 DONE compose-only not reopened. BUG-0018 DONE not reopened. No US-0135+ authoring. No `/sprint-plan` spawn from this subagent.
- Prior phase strict proof consumed: `rp-auto-20260912-us0134-research-techlead-20260912T123500Z-US-0134` / `5C25F84CEC351C1C21FB84DB65A8CAC8071F5598DDDFBF774226935C9FD30927` — RUNTIME_PROOF_VALID (MATCH before TTL 2026-09-12T13:35:00Z). Critic findings us0134rsc-* informational only.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260912-us0134-architecture-techlead-20260912T124500Z-US-0134`
- Canonical payload (sorted-key compact JSON per DEC-0038, lowercase keys): `{"delivery_mode":"ultra_lean","macro_phase":"plan","model_id":"cursor-grok-4.6","orchestrator_run_id":"auto-20260912-us0134","phase_id":"architecture","proof_issued_at":"2026-09-12T12:45:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260912-us0134-architecture-techlead-20260912T124500Z-US-0134","sprint_id":"none","story_id":"US-0134"}`
- `proof_hash=D7686414BA2C17E2053CD7DA5279B56F6B56F9D814CCD46D021A12A870CE2704` (SHA-256)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-12T13:45:00Z` (UTC)

## Decision gate + next scheduled phase

- `decision_gate=false` (no blocking unknown; DQ1–DQ10 LOCKED; DEC-0134 Accepted; approach A1 locked; critic NBs closed)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead; third canonical phase of `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to /sprint-plan in fresh tech-lead subagent (BUG-0006). Do NOT spawn /sprint-plan from this subagent. Do NOT mark US-0134 DONE. Do NOT tick acceptance. Do NOT reopen US-0133 or BUG-0018. Do NOT design US-0135+.`

# US-0135 — Standalone authentication and model routing

## Overview

**US-0135** adds owned standalone authentication and 6-step model routing so operators can use Codex OAuth, API-key providers, Chinese/local/custom gateways, independent thinking levels, and critic pinning without exposing credentials to agents, repositories, or audit. Pi stays behind `packages/pi-kernel`. Workflow/CLI never import Pi. Fake-model CI default, empty resource loader, `noTools: "builtin"`, and KernelBridge stay **unamended**.

**Research anchor**: **R-0127** (DQ1–DQ10 LOCKED). **Companion DEC**: **DEC-0135** (Accepted — THIS phase). **EARLY_RESEARCH**: consumed from R-0127 + architecture-phase Context7 `/earendil-works/pi` + `/websites/pi_dev` confirm (`ModelRuntime.create({ authPath, modelsPath, credentials })`; `login(providerId, type, interaction)`; `checkAuth`; `createAgentSession({ thinkingLevel })`; `setRuntimeApiKey` not persisted; `registerProvider` in-process) — **no new R-id**.

**Fresh context marker**: `tl-US0135-architecture-20260913T041500Z-fresh`
**Orchestrator run id**: `auto-20260913-us0135`
**Timestamp**: 2026-09-13T04:15:00Z (UTC)
**Verdict**: PASS
**Next**: `/sprint-plan` (orchestrator-owned; CROSS_MODEL_REVIEW=1 critic of architecture first). Do **not** spawn sprint-plan from this subagent (BUG-0006).

**baseline_h2_count (pre-mutate)**: `0`

## Approach locked (A1 — from R-0127)

| Option | Summary | Verdict |
|--------|---------|---------|
| **A1** | `standalone/packages/auth-models` (AuthService + ModelRouter + thin catalog + CLI handlers; **no Pi imports**); pi-kernel AuthRuntimeAdapter wrapping `ModelRuntime.create({ authPath, modelsPath })` / `login` / `checkAuth` / `registerProvider`; owned OS credential dir; 6-step router + provenance; thinking inject independent of slug/`TOKEN_PROFILE`; critic pin + `CROSS_MODEL_DEGRADED_MODE`; `itsm auth` / `models list` / `models test`; fake-model CI default **held**; empty loader / `noTools` / KernelBridge **unamended** | **Preferred / LOCKED** — AC-1..AC-7 |
| A2 | Stable store = `~/.pi/agent/auth.json` | **Rejected** — D1 spike-only |
| A3 | Credentials in project / `.env` | **Rejected** — AC-1 / D7 |
| A4 | Workflow/CLI import `@earendil-works/pi-*` | **Rejected** — DEC-0133 |
| A5 | Fold AuthService into `pi-kernel` only | **Rejected** — §30 / D8 |
| A6 | Load project `.pi/extensions` | **Rejected** — empty loader held |
| A7 | Live paid CI for `models test` | **Rejected** — fake-model held |
| A8 | Cursor catalog as standalone runtime | **Rejected** — D3 / US-0132 |
| A9 | Auto-next-slug on critic collision | **Rejected** — D5 |

**Can this be simpler?** Pi-importing CLI fails DEC-0133. Folding into `pi-kernel` fails D8. `~/.pi/agent` as ship store fails D1. A1 is the simplest split that meets the ACs.

### Locked surfaces (DEC-0135)

1. **Package**: `@its-magic/auth-models` in `standalone/packages/auth-models`. No Pi / no `pi-kernel` dependency. Kit `files` omit `standalone/`.
2. **Store**: OS config dir (`XDG` / `%APPDATA%` / macOS Application Support `its-magic/`); `auth.json` 0600-class; `InMemoryCredentialStore` tests; never project / `.env` / `~/.pi/agent` as ship store. `AUTH_PATH_IN_PROJECT` fail-closed.
3. **Adapter**: pi-kernel `AuthRuntimeAdapter` — `createRuntime` / three-arg `login` / `checkAuth` / in-process `registerProvider` (not resource-loader discovery). Codex `openai-codex` + `oauth`. `AUTH_SYNC_FAILED` on `CredentialSynchronizationError`. `setRuntimeApiKey` is one-run only.
4. **Router**: CLI > phase-local > role catalog > critic overlay > tier/catalog > runtime default; Pi `provider/model`; provenance required; Cursor aliases not SOT.
5. **Thinking**: inject `KernelCreateSessionOptions.thinkingLevel`; orthogonal to slug/`TOKEN_PROFILE`; map holes **clamp + provenance** (`thinkingClamped`); always-thinking → `thinkingForced`.
6. **Critic**: catalog `critic.model`; same slug → `CROSS_MODEL_DEGRADED_MODE` (reuse; not hard stop; not auto-next-slug). US-0144 owns critic session spawn.
7. **CLI**: `itsm auth` list/login/logout/migrate; `itsm models list`; `itsm models test` (`checkAuth` default; `--live` never CI); no token logs.
8. **Tests**: 10 `test_us0135_*`; Win+Linux; fake-model CI held; two-role unpaid fixture.

### Critic NB closures (research us0135rsc-* — informational)

| NB | Closure |
|----|---------|
| NB1 R-proof MATCH / DQ7 clamp vs fail-closed / R2 Windows ACL / R3 `setRuntimeApiKey` | LOCKED §6 clamp+provenance (not `MODEL_THINKING_UNSUPPORTED`); §3 Windows v1 = `%APPDATA%` user profile (no extra ACL this story); §4 persist via `login(..., "api_key")` not `setRuntimeApiKey` |
| NB2 `# US-0135` + DEC-0135 Accepted; execute owns auth-models + AuthRuntimeAdapter; DEC-0133/0134 compose | LOCKED this H1 + DEC-0135; T-001/T-003; isolation/`noTools`/KernelBridge unamended |
| NB3 no sprint-plan spawn; no DONE; no US-0136+; no isolation loader amend | Held — T-anch; Status OPEN; do not spawn `/sprint-plan` from this subagent |

## Components

### `auth-models` package (AC-1, AC-3)

- `standalone/packages/auth-models` with locked AuthService / ModelRouter / provenance (DEC-0135 §2/§5)
- Thin gitignored `.its-magic/model-catalog.local.json` (slugs/thinking only; not Cursor SOT; not US-0138 `RuntimeConfig`)

### Owned credential store (AC-1)

- OS config dir + 0600-class `auth.json` (DEC-0135 §3)
- Tests use `InMemoryCredentialStore` (no disk)

### AuthRuntimeAdapter (AC-1, AC-2)

- pi-kernel-only Pi wrap; three-arg login; `checkAuth`; in-process `registerProvider`
- Built-in Codex + API-key + Chinese; local/custom via owned `models.json`

### Thinking + critic (AC-4, AC-5)

- Session `thinkingLevel` inject; clamp+provenance
- Critic pin + `CROSS_MODEL_DEGRADED_MODE`

### CLI + contract tests (AC-6, AC-7)

- `itsm auth` / `models list` / `models test`
- Ten markers (DEC-0135 §9). Kernel tests: `standalone/tests/contract`. Matrix Windows + Linux.

## Companion DEC = DEC-0135 (Required → Accepted)

Authored Accepted in THIS phase at `decisions/DEC-0135.md`. Locks A1, adapter/router APIs, owned store, 6-step chain, thinking clamp, critic degraded, CLI, markers.

## Risks finalized (R1–R6 from R-0127)

- **R1 (MEDIUM)** Pi 0.85.1 `login(providerId, type, interaction)` vs docs shorthand → wrap three-arg SDK; fake `AuthInteraction` contract tests
- **R2 (MEDIUM)** Windows ACL weaker than POSIX 0600 → store under `%APPDATA%`; never project tree; extra ACL later
- **R3 (MEDIUM)** `setRuntimeApiKey` looks like persist → persist via `login(..., "api_key")` / CredentialStore; runtime key = one-run only
- **R4 (LOW)** `thinkingLevelMap` holes → DQ7 clamp + provenance
- **R5 (LOW)** accidental `.env` read → no dotenv; never project credentials; US-0137 owns tool deny
- **R6 (LOW)** AuthRuntimeAdapter mistaken for amending isolation → D8; tests assert empty loader + fake-model default still hold

## Compose, do not amend (verified)

| Story / DEC | Surface | Verification |
|-------------|---------|--------------|
| US-0133 / DEC-0133 / R-0121 | AgentKernel, pins, isolation loader, `noTools`, fake-model CI, `# US-0133` | ✓ compose inject seam + additive `thinkingLevel` option only; H1 not reopened |
| US-0134 / DEC-0134 / R-0122 | KernelBridge | ✓ locate-only; unamended |
| US-0101/0102 / DEC-0087 | 5-step kit resolver | ✓ ported to 6-step Pi slugs; Cursor alias dropped |
| US-0130 / US-0104 | `CROSS_MODEL_DEGRADED_MODE` | ✓ reuse; not `AUTH_CROSS_MODEL_*` |
| DEC-0062 | `TOKEN_PROFILE` | ✓ thinking orthogonal |
| US-0132 / DEC-0132 | Cursor catalog | ✓ host mapping only; not standalone SOT |
| Kit npm `its-magic` / DEC-0120 | `files` whitelist | ✓ omit `standalone/` |
| US-0136..US-0148 | later capabilities | ✓ OUT OF SCOPE |
| BUG-0020 / R-0126 | OpenCode `/auto` | ✓ DONE; not reopened; R-0126 not wiped |
| R-0121 / R-0122 / R-0127 | prior research | ✓ not wiped |

## Sprint seeds (10 tasks within SPRINT_MAX_TASKS=12 — for `/sprint-plan` refinement)

- **T-anch** (`# US-0135` H1 + DEC-0135 Accepted — RESOLVED in THIS phase; NO-OP / verification)
- **T-001** (AC-1 — `packages/auth-models` + Pi import-boundary grep)
- **T-002** (AC-1 — owned auth path + InMemory + 0600-class)
- **T-003** (AC-1/AC-2 — pi-kernel AuthRuntimeAdapter `login`/`checkAuth`/`authPath`; do not amend isolation/`noTools`/KernelBridge)
- **T-004** (AC-2 — provider matrix + owned `models.json`)
- **T-005** (AC-3 — ModelRouter 6-step + provenance)
- **T-006** (AC-4 — thinkingLevel inject orthogonal to slug/`TOKEN_PROFILE`)
- **T-007** (AC-5 — critic pin + `CROSS_MODEL_DEGRADED_MODE`)
- **T-008** (AC-1/AC-6 — `itsm auth` / `models list` / `models test`)
- **T-009** (AC-7 — 10 `test_us0135_*` Win/Linux fake-model CI)

Execution order: T-anch → T-001 → T-002 → T-003 → T-004 → T-005 → T-006 → T-007 → T-008 → T-009 (acyclic). No split (`SPRINT_AUTO_SPLIT` not triggered). Not `/quick`.

## Isolation evidence (US-0048 / DEC-0029)

- `phase_id=architecture`, `role=tech-lead`, `story_id=US-0135`, `sprint_id=none` (pending — sprint-plan owns folder), `orchestrator_run_id=auto-20260913-us0135`
- `delivery_mode=ultra_lean`, `macro_phase=plan` (architecture — second canonical phase of `plan` macro)
- `model_id=cursor-grok-4.6-high` (CROSS_MODEL_REVIEW=1 — required on isolation)
- `fresh_context_marker=tl-US0135-architecture-20260913T041500Z-fresh`, `timestamp=2026-09-13T04:15:00Z` (UTC)
- `evidence_ref=docs/engineering/research.md ## R-0127; docs/product/backlog.md ## US-0135; docs/engineering/architecture.md (this # US-0135); decisions/DEC-0135.md; handoffs/resume_brief.md; handoffs/po_to_tl.md Research handoff US-0135; Context7 /earendil-works/pi + /websites/pi_dev`
- Fresh tech-lead subagent per BUG-0006 / US-0048; no prior chat history. Narrow-read only. No `.env` reads. Status remains OPEN. US-0133/US-0134 DONE compose-only not reopened. BUG-0020 DONE not reopened. No US-0136+ authoring. No `/sprint-plan` spawn from this subagent.
- Prior phase strict proof consumed: `rp-auto-20260913-us0135-research-techlead-20260913T035500Z-US-0135` / `7100DE085C9DE36C44C9311B26E27B01492E7B3AD501A4EE4454D609811DE620` — RUNTIME_PROOF_VALID (independent `compute_strict_proof_hash` MATCH; critic consume-before-TTL `2026-09-13T04:05:00Z` < `2026-09-13T04:55:00Z`; immutable R-0127). Critic findings us0135rsc-* informational only.

## Strict runtime proof (mirror)

- `runtime_proof_id=rp-auto-20260913-us0135-architecture-techlead-20260913T041500Z-US-0135`
- Canonical hashed payload (DEC-0038, `compute_strict_proof_hash` positional): `{"orchestrator_run_id":"auto-20260913-us0135","phase_id":"architecture","proof_issued_at":"2026-09-13T04:15:00Z","proof_ttl_seconds":3600,"role":"tech-lead","runtime_proof_id":"rp-auto-20260913-us0135-architecture-techlead-20260913T041500Z-US-0135"}`
- `proof_hash=44CCE2BBAB0F863D610152D108DF62D1DACA1F722D2F12CF4DB98067DF1923D7` (SHA-256; actual `compute_strict_proof_hash`)
- `proof_ttl_seconds=3600`, `proof_ttl=2026-09-13T05:15:00Z` (UTC)
- Isolation extras (not hashed): `delivery_mode=ultra_lean`, `macro_phase=plan`, `model_id=cursor-grok-4.6-high`, `sprint_id=none`, `story_id=US-0135`

## Decision gate + next scheduled phase

- `decision_gate=false` (no blocking unknown; DQ1–DQ10 LOCKED; DEC-0135 Accepted; approach A1 locked; critic NBs closed)
- `next_scheduled_phase=/sprint-plan` (role=tech-lead; third canonical phase of `plan` macro)
- `next_scheduled_role=tech-lead`
- `stop_condition=STOP after architecture completes; hand off via artifacts only to /sprint-plan in fresh tech-lead subagent (BUG-0006). Do NOT spawn /sprint-plan from this subagent. Do NOT mark US-0135 DONE. Do NOT tick acceptance. Do NOT reopen US-0133, US-0134, or BUG-0020. Do NOT design US-0136+.`

