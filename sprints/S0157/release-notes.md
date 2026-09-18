# S0157 / BUG-0025 — Execute release notes (draft; publish deferred)

**sprint_id**: S0157  
**bug_id**: BUG-0025  
**kit_version**: **0.1.4** (patch bump from 0.1.3)  
**phase**: execute (T-008 / T-009 prepare)  
**RELEASE_PUBLISH_MODE**: confirm  
**RELEASE_PUBLISH_AUTO_CONFIRM**: 0  
**npm_published**: false (deferred — operator confirm required)

## Operator upgrade

```bash
npm install -g its-magic@0.1.4
# or, once @latest points at 0.1.4:
npm install -g its-magic@latest
```

Then re-run:

```bash
its-magic --target <repo> --mode upgrade --host both
```

## What fixed

- Root `package.json` `files` now includes `scripts/standalone_runtime_install_lib.py`.
- Loader fails closed with `[STANDALONE_BOOTSTRAP_FAILED]` when the lib is missing (no raw `FileNotFoundError`).
- `guard_installer_publish` requires the allowlist entry; US-0133 omit-`standalone/` unchanged.

## Optional semver quirk note

Operators who moved from local **`0.1.3-11`** to published **`0.1.3`** hit the packaging omit. Prefer **`0.1.4`** over same-line republish of immutable `0.1.3`.

## T-009 publish disposition (execute)

- Dry-run / prepare evidence recorded in `sprints/S0157/progress.md` and `handoffs/dev_to_qa.md`.
- **No** silent `npm publish` from execute (`RELEASE_PUBLISH_MODE=confirm`, `RELEASE_PUBLISH_AUTO_CONFIRM=0`).
- **Next**: `/release` with operator confirm to publish `its-magic@0.1.4` (npm + packaging twins checksums).
