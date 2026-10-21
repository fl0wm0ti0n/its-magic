# Sprint S0176 — Task checklist (BUG-0028)

Six planned tasks: **T-anch + T-001..T-005**, 1:1 with the `# BUG-0028` seeds, within `SPRINT_MAX_TASKS=12`.
Execute only in this order. Every box stays open until a fresh `/execute` dev context finishes it.

## Checklist

- [x] **T-anch — locked baseline (all AC):** Read R-0166 and `# BUG-0028`. Confirm BUG-0028 is OPEN and AC-1..AC-5 are unchecked. Confirm `standalone/apps/cli/src/index.ts` statically imports `createRuntimeHost` and `./run.ts` and builds the host before argv dispatch, and that `run.ts` statically imports the pi-kernel barrel (which evaluates `kernel.ts`). Confirm S0175 is historical and this sprint is S0176. Confirm BUG-0029, US-0150, US-0151, US-0155, BUG-0026, US-0154, and US-0156 are not mutated. Do not change product code in this task.
  **Done-when:** the notes match those gaps and BUG-0028 is still OPEN with AC-1..AC-5 unchecked.

- [x] **T-001 — classifier and `index.ts` (AC-1 help path, AC-3 admission):** Add `standalone/apps/cli/src/command-class.ts` using Node builtins only. `index.ts` statically imports only that module. Classify the first token after the same `--validator=` / `--policy-probe` strip. The strip is classification-only; the workflow path passes the original argv to `runCliArgv`. `--policy-probe` runs only after workflow admission. Three classes, classified before any static import of `./run.ts`:
  - help: no token, `help`, `--help`, `-h` — print help in the classifier; exit 0; do not construct RuntimeHost, the Pi kernel, code intelligence, ToolBroker, or SQLite
  - local: `auth`, `models` — dynamic import of `@its-magic/auth-models` only (adapter subpath is T-003)
  - status: bare `status` — dynamic import of `status-snapshot.ts` only (T-002)
  - workflow: every other token — dynamic import of `createRuntimeHost({ projectRoot, lifetime: "direct-cli" })`, then `runCliArgv` with the original argv, and `host.dispose()` in `finally`
  Only the bare token `status` is lightweight. A leading-slash token, including `/status`, stays on workflow admission and calls production `createRuntimeHost`. The classifier does not call `OperatorCommandFacade.normalizeToken` and does not strip a leading slash. First token wins: `itsm status --help` stays status. An unrecognized flag before `status` stays workflow. Error codes stay `RUNTIME_CONFIG_UNAVAILABLE`, `RUNTIME_BRIDGE_UNAVAILABLE`, `RUNTIME_KERNEL_ADMISSION_FAILED`, and `RUNTIME_SERVICE_UNAVAILABLE`. `runCliArgv` may keep help and auth for direct callers. Mirror touched CLI sources under `template/.its-magic/standalone/apps/cli/src/`. Do not hand-edit `.its-magic/bin/itsm` or `itsm.cmd`.
  **Done-when:** help is printed with no static import of `run.ts`, `@its-magic/runtime-host`, or the pi-kernel barrel, and `/status` still calls production `createRuntimeHost`.

- [x] **T-002 — `status-snapshot.ts` (AC-2):** Add `standalone/apps/cli/src/status-snapshot.ts`, dynamic-import only. `node:fs` reads `handoffs/resume_brief.md` (story, sprint, intended resume phase) and the single latest file in `handoffs/token_cost_runs`. App, index, and browser stay the unavailable defaults. `sovereign` is null. Keep `schema_version: 1` and `read_only: true`. Do not add `store_path`, host config, or transport. No `createRuntimeHost`, `walkDocs`, `createOperatorSession`, `createWorkflowEngine`, `resolveOperatorTransport`, `isDaemonReachable`, `daemon.ping`, `ops.sqlite`, or audit write. No repository scan and no workflow session. A missing, thrown, or malformed resume brief returns null story, sprint, phase, and token fields and must not fall back to `createRuntimeHost`. An empty `handoffs/token_cost_runs`, or a torn or missing token file, yields null token fields. No ping timeout wrapper. Mirror the file under `template/.its-magic/standalone/apps/cli/src/`.
  **Done-when:** bare `status` and `status --help` return the snapshot, and a missing, thrown, or malformed brief does not construct the host.

- [x] **T-003 — auth-runtime subpath (AC-1 auth/models):** In the pi-kernel `package.json`, export `"./auth-runtime": "./src/auth-runtime.ts"`. `auth list`, `auth login`, `auth logout`, and `models test` dynamically import `createAuthRuntimeAdapter` from `@its-magic/pi-kernel/auth-runtime`. `models list` and `auth migrate` do not import the adapter. `auth-runtime.ts` must not statically import `./kernel.ts` or `./index.ts`. Existing `pi-ai` and `pi-coding-agent` imports may stay. Do not change login prompting (BUG-0029). Mirror the export if that package file is touched, and mirror touched CLI sources under `template/.its-magic/standalone/apps/cli/src/`.
  **Done-when:** those four commands load the adapter subpath, `models list` and `auth migrate` do not, and `auth-runtime.ts` has no static import of `kernel.ts`.

- [x] **T-004 — five `test_bug0028_*` markers (AC-1..AC-5):** Add `standalone/tests/contract/bug0028.contract.test.ts` with no wall-clock SLA:
  - `test_bug0028_help_auth_models_skip_host_and_kernel_barrel` (AC-1): help, local auth, and models classify before any static import of the workflow runner and do not construct RuntimeHost, the Pi kernel, code intelligence, ToolBroker, or SQLite. The auth adapter import is only for `auth list` / `auth login` / `auth logout` and `models test`, and that import does not statically pull `kernel.ts`.
  - `test_bug0028_status_bounded_snapshot_no_scan_session_or_ping` (AC-2): bare `status`; `status --help` stays on the snapshot; a missing, thrown, or malformed resume brief is null fields and no host; no `ops.sqlite`; no repository scan; no workflow session; no daemon ping; no `resolveOperatorTransport`.
  - `test_bug0028_workflow_tokens_keep_production_host` (AC-3): dedicated `ask`, `resume`, `pause`, `index`, `app`, `browser`; scheduler `auto`, `quick`, `/auto`, `/quick`; phase tokens `intake`, `discovery`, `research`, `architecture`, `sprint-plan`, `plan-verify`, `execute`, `qa`, `verify-work`, `release`, `closure`, `refresh-context`, `memory-audit`, `map-codebase`, `security-review`; `/status` is workflow and expects production `createRuntimeHost`. Skipping every `DEDICATED_COMMANDS` token is rejected. `--policy-probe` runs only after workflow admission.
  - `test_bug0028_installed_entrypoint_windows_and_linux` (AC-4): the classifier and `index.ts` do not statically import `run.ts`, `@its-magic/runtime-host`, or the pi-kernel barrel; spawn `bin/itsm.js` and cover Windows and Linux launch behavior. Do not hand-edit generated bins.
  - `test_bug0028_operator_doc_lightweight_versus_full_runtime` (AC-5).
  Do not merge BUG-0029. Do not change US-0150, US-0151, or US-0155 tests or rows.
  **Done-when:** the five markers exist and fail if help/auth/models/status construct the heavy graph or if a workflow token skips `createRuntimeHost`.

- [x] **T-005 — operator docs (AC-5):** Extend the `itsm` paragraph in `its_magic/README.md` and `template/its_magic/README.md`. Name no-args, help, auth, models, and status as lightweight inspection/auth commands, and name workflow commands as the `createRuntimeHost` path. The runbook PATH section is out of scope.
  **Done-when:** both README paragraphs distinguish lightweight inspection/auth commands from full-runtime commands, and the two files agree.

## Execute boundary

BUG-0028 stays OPEN. AC boxes stay unchecked. Closure owns the DONE flip. Do not edit `docs/engineering/decisions.md`. Do not implement in this sprint-plan phase.
