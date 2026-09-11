"""Q0003 kit config example JSONC + upgrade copy contract.

Does not add US-0131 markers (10-marker contract stays unchanged).
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = REPO_ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

import host_runtime_config_lib as hrc  # noqa: E402
import installer  # noqa: E402

EXAMPLE = REPO_ROOT / ".its-magic" / "config.example.json"
EXAMPLE_TEMPLATE = REPO_ROOT / "template" / ".its-magic" / "config.example.json"
INSTALLER_PS1 = REPO_ROOT / "installer.ps1"
INSTALLER_SH = REPO_ROOT / "installer.sh"

REQUIRED_SHARED_KEYS = (
    "AUTO_STORY_SELECTION",
    "TEAM_MODE",
    "SYNC_POLICY_MODE",
    "RELEASE_PUBLISH_MODE",
    "CROSS_MODEL_REVIEW",
    "AUTO_SOVEREIGN",
    "AUTONOMY_PRESET",
)


def _kit_payload(shared: dict[str, str]) -> dict:
    return {
        "schema_version": 1,
        "shared": shared,
        "host_overlays": {"cursor": {}, "opencode": {}},
    }


def test_q0003_example_is_valid_jsonc_and_resolves() -> None:
    raw = EXAMPLE.read_text(encoding="utf-8")
    assert "// Its-Magic runtime catalog." in raw
    data = json.loads(hrc.strip_jsonc(raw))
    assert data["schema_version"] == 1
    shared = data["shared"]
    for key in shared:
        assert re.search(
            rf'^\s*// .+\n\s*"{re.escape(key)}"\s*:', raw, re.MULTILINE
        ), key
    for key in REQUIRED_SHARED_KEYS:
        assert key in shared, key
        assert isinstance(shared[key], str)
    model_keys = [k for k in shared if k.startswith("MODEL_") or k.startswith("MODEL_TIER_")]
    assert model_keys == []
    resolved = hrc.resolve_runtime_config(REPO_ROOT, host_mode="opencode")
    assert resolved.ok
    for key in REQUIRED_SHARED_KEYS:
        assert key in resolved.values


def test_q0003_root_example_matches_template_bytes() -> None:
    assert EXAMPLE.read_bytes() == EXAMPLE_TEMPLATE.read_bytes()


def test_q0003_strip_jsonc_preserves_slashes_inside_strings() -> None:
    raw = (
        '{"schema_version":1,"shared":{"URL":"http://example.com//path"},'
        '"host_overlays":{"cursor":{},"opencode":{}}}'
    )
    stripped = hrc.strip_jsonc(raw)
    data = json.loads(stripped)
    assert data["shared"]["URL"] == "http://example.com//path"


def test_q0003_load_kit_json_accepts_line_and_block_comments(tmp_path: Path) -> None:
    text = """// header
{
  "schema_version": 1,
  /* block comment */
  "shared": {
    "DONE": "0", // beside
    "URL": "http://keep.example//x"
  },
  "host_overlays": {"cursor": {}, "opencode": {}}
}
"""
    path = tmp_path / "config.example.json"
    path.write_text(text, encoding="utf-8")
    data = hrc._load_kit_json(path, [])
    assert data["shared"]["DONE"] == "0"
    assert data["shared"]["URL"] == "http://keep.example//x"


def test_q0003_malformed_after_strip_is_host_config_invalid(tmp_path: Path) -> None:
    path = tmp_path / ".its-magic" / "config.json"
    path.parent.mkdir(parents=True)
    path.write_text("{ // comment\n not-json }\n", encoding="utf-8")
    with pytest.raises(hrc.HostConfigError) as exc:
        hrc.resolve_runtime_config(tmp_path, host_mode="opencode")
    assert exc.value.code == hrc.HOST_CONFIG_INVALID


def test_q0003_upgrade_copies_example_from_template_only_layout(tmp_path: Path) -> None:
    example_bytes = EXAMPLE_TEMPLATE.read_bytes()
    src = tmp_path / "pkg"
    nested = src / "template" / ".its-magic" / "config.example.json"
    nested.parent.mkdir(parents=True)
    nested.write_bytes(example_bytes)
    assert not (src / ".its-magic").exists()

    target = tmp_path / "consumer"
    local = target / ".its-magic" / "config.local.json"
    local.parent.mkdir(parents=True)
    local.write_text(
        json.dumps(_kit_payload({"DONE": "1"}), indent=2) + "\n",
        encoding="utf-8",
    )
    local_bytes = local.read_bytes()

    assert installer.run_kit_config_postinstall(str(target), str(src), "upgrade", print_ok=False)
    copied = target / ".its-magic" / "config.example.json"
    assert copied.read_bytes() == example_bytes
    assert local.read_bytes() == local_bytes
    assert (target / ".its-magic" / "config.json").is_file()


def test_q0003_installers_invoke_kit_config_postinstall() -> None:
    ps1 = INSTALLER_PS1.read_text(encoding="utf-8")
    sh = INSTALLER_SH.read_text(encoding="utf-8")
    assert "--kit-config-postinstall" in ps1
    assert "Invoke-KitConfigPostinstall" in ps1
    assert "-Force" in ps1
    assert ".its-magic/config.example.json" in ps1
    assert "--kit-config-postinstall" in sh
    assert "kit_config_postinstall" in sh
    assert ".its-magic/config.example.json" in sh
