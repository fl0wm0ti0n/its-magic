# Q0003 — kit config example JSONC + upgrade copy

## Result
`acceptance_met: true`

## Problem
`.its-magic/config.example.json` listed only a subset of shared KEY catalog settings, with no per-key comments. Windows `installer.ps1` (and `installer.sh`) never called kit-config postinstall, so consumer upgrades could miss the packaged template example.

## Changes
- JSONC support: `strip_jsonc()` in `scripts/host_runtime_config_lib.py` (+ template mirror) before `json.loads` in `_load_kit_json`
- `.its-magic/config.example.json` (+ template, byte-identical): full shared catalog, `//` comments, safe defaults, empty `host_overlays`
- Triple-installer: `--kit-config-postinstall` CLI; ps1/sh invoke it (not cursor-gated); ps1 `List-SourceFiles -Force`; FRAMEWORK_EXACT / sh classify for `.its-magic/config.example.json`
- Robust example source resolve: `source_root/.its-magic/...` or `source_root/template/.its-magic/...`

## Verify
- `tests/us0131_contract_test.py` + `tests/q0003_kit_config_example_test.py`: 17 passed
- Upgrade from template-only layout copies example bytes; `config.local.json` unchanged
- Did not reopen US-0131/US-0132/BUG-0015/BUG-0016; did not flip story status
