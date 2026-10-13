# Progress — Sprint S0170

Execute finished. US-0150 stays OPEN. AC-1..AC-6 stay unchecked.

- T-anch: baseline confirmed. R-0150, DEC-0150, and `# US-0150` hold. Both production entrypoints already call `createRuntimeHost`. US-0133..US-0140 and US-0149 stay DONE. S0158 stays historical.
- T-001: host exposes one `codeContext` pack. Unavailable intelligence returns `RUNTIME_SERVICE_UNAVAILABLE` and writes no pack.
- T-002: host-present `crashResume` uses the host config. US-0148 supervisor-only path still starts.
- T-003: production session with no factories reports builtin tools disabled and fresh attestation. Role, model, and provider come from the resolved host config and route.
- T-004: file read is allowed with an audit row; path escape is denied. Edit, shell, git, and search do not return `ok:` text. No browser or app tools.
- T-005: bridge failure is `RUNTIME_BRIDGE_UNAVAILABLE` before a host exists. Provenance is non-secret. Pack hash is on the host. Store tables are operational only. Double `dispose()` leaves `package.json` unchanged.
- T-006: six `test_us0150_*` markers pass. The production case calls `createRuntimeHost` with no factories and `model_id` `deterministic-local-model`.

Contract runner: 6 pass / 0 fail. Harness `tests/report.md` `2026-10-11T15:13:10Z`, Pass 880 / Fail 0. Next phase is QA. This execute did not write `handoffs/resume_brief.md`.
