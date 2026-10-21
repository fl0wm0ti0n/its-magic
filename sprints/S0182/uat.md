# UAT — Sprint S0182 / US-0158

- **uat_lifecycle**: placeholder
- **story status**: US-0158 stays **OPEN**. AC-1..AC-5 stay unchecked in `docs/product/backlog.md`. Closure owns the DONE flip.
- **results**: none yet

## Target

US-0158 (OPEN). Sprint S0182. Primary acceptance row in `docs/product/acceptance.md` stays unchecked.

## Acceptance criteria (no results)

| AC | Criterion | Result |
|---|---|---|
| AC-1 | Recoverable OpenCode `/auto` stops continue automatically: a blocker, an AI error, an aborted phase, and a permission dead-end such as the missing critic role. | |
| AC-2 | The operator is not asked to restart the session for those recoverable cases. | |
| AC-3 | Security-hard denies (`.env`, secrets) still stop. | |
| AC-4 | The `/auto` orchestrator still does not write or repair `docs/engineering/state.md` or `handoffs/resume_brief.md`. `RESUME_BRIEF_AUTO_REFRESH=0` stays absolute. A fresh phase child may repair only its own invalid continuation pair. Do not add a critic Task role; spawn tech-lead for `/sovereign-critic`. | |
| AC-5 | Contract tests cover continuation of a recoverable stop versus a security-hard stop, and they cover the orchestrator write lock in AC-4. | |
