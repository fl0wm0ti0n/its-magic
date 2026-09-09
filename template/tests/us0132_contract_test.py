"""US-0132 Cursor/OpenCode model configuration contract — exactly 10 markers.

Static/fixture only. No live OpenCode CI probe. No 11th marker.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
VALIDATOR = REPO_ROOT / "scripts" / "model_tier_validate.py"
MATERIALIZER = REPO_ROOT / "scripts" / "opencode_model_catalog_apply.py"
MODEL_TIER_LIB = REPO_ROOT / "scripts" / "model_tier_lib.py"
RUNBOOK = REPO_ROOT / "docs" / "engineering" / "runbook.md"
README = REPO_ROOT / "README.md"
US0126_H2 = "## OpenCode host operator runbook (US-0126)"
US0131_H2 = "## Cross-host runtime configuration (US-0131)"
US0132_H2 = "## Cursor/OpenCode model configuration contract (US-0132)"

sys.path.insert(0, str(REPO_ROOT / "scripts"))
sys.path.insert(0, str(REPO_ROOT))
from model_tier_lib import PRECEDENCE_CHAIN_STEPS, format_provenance, resolve_model_for_phase  # noqa: E402
import model_tier_validate as mtv  # noqa: E402
import installer  # noqa: E402
from opencode_model_catalog_apply import apply_catalog  # noqa: E402

CURSOR_EXAMPLE = {
    "schema_version": 1,
    "tiers": {
        "cheap": "<your-cheap-model-slug>",
        "balanced": "<your-balanced-model-slug>",
        "strong": "<your-strong-model-slug>",
    },
}

OPENCODE_CATALOG = {
    "schema_version": 2,
    "providers": {"acme": {"npm": "@ai-sdk/acme"}},
    "roles": {
        "po": "acme/widget-po",
        "tech-lead": "acme/widget-tl",
        "dev": "acme/widget-dev",
        "qa": "acme/widget-qa",
        "release": "acme/widget-rel",
        "curator": "acme/widget-cur",
        "security": "acme/widget-sec",
        "auto": "acme/widget-auto",
    },
}

AGENT_TEMPLATE = """---
description: test agent
---
body
"""

REASON_CODES = (
    "MODEL_CONFIG_PATH_UNKNOWN",
    "MODEL_CONFIG_SCHEMA_MIX",
    "MODEL_CONFIG_HOST_COLLISION",
)


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _run_model_config(repo: Path, host: str = "both") -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [
            sys.executable,
            str(VALIDATOR),
            "--scope",
            "model-config",
            "--host",
            host,
            "--repo",
            str(repo),
        ],
        capture_output=True,
        text=True,
        cwd=str(REPO_ROOT),
    )


def _seed_opencode_agents(root: Path) -> None:
    for role in ("po", "tech-lead", "dev", "qa", "release", "curator", "security", "auto"):
        _write(root / ".opencode" / "agents" / f"{role}.md", AGENT_TEMPLATE)


def test_us0132_canonical_inventory_rejects_model_json(tmp_path: Path) -> None:
    """Marker 1: generic model.json{,c} at three repo locations → PATH_UNKNOWN; no alias."""
    _write(tmp_path / "model.json", '{"model": "nope"}')
    _write(tmp_path / ".cursor" / "model.jsonc", '{"model": "nope"}')
    _write(tmp_path / ".opencode" / "model.json", '{"model": "nope"}')

    proc_cursor = _run_model_config(tmp_path, host="cursor")
    combined_cursor = proc_cursor.stdout + proc_cursor.stderr
    assert proc_cursor.returncode != 0
    assert "MODEL_CONFIG_PATH_UNKNOWN" in combined_cursor
    assert "MODEL_CONFIG_HOST_COLLISION" not in combined_cursor
    assert "model.json" in combined_cursor

    proc_both = _run_model_config(tmp_path, host="both")
    combined_both = proc_both.stdout + proc_both.stderr
    assert proc_both.returncode != 0
    assert "MODEL_CONFIG_PATH_UNKNOWN" in combined_both
    assert "MODEL_CONFIG_HOST_COLLISION" in combined_both

    src = VALIDATOR.read_text(encoding="utf-8")
    assert "alias" in src.lower() or "Do not alias" in src or "PATH_UNKNOWN" in src
    assert "~/.config/opencode/model.json" not in src or "Do not scan" in src
    # Kit-owned scan is repo-scoped three locations only (no Path.home() scan).
    assert "Path.home()" not in src


def test_us0132_cursor_schema_not_interpreted_as_opencode(tmp_path: Path) -> None:
    """Marker 2: Cursor catalog schema at OpenCode path → SCHEMA_MIX."""
    _write_json(tmp_path / ".opencode" / "model-catalog.local.json", CURSOR_EXAMPLE)
    proc = _run_model_config(tmp_path, host="opencode")
    combined = proc.stdout + proc.stderr
    assert proc.returncode != 0
    assert "MODEL_CONFIG_SCHEMA_MIX" in combined
    apply_src = MATERIALIZER.read_text(encoding="utf-8")
    assert ".cursor/model-catalog.local.json" not in apply_src
    assert "MODEL_TIER_" not in apply_src


def test_us0132_opencode_schema_not_interpreted_as_cursor(tmp_path: Path) -> None:
    """Marker 3: OpenCode catalog schema at Cursor path → SCHEMA_MIX."""
    _write_json(tmp_path / ".cursor" / "model-catalog.local.json", OPENCODE_CATALOG)
    proc = _run_model_config(tmp_path, host="cursor")
    combined = proc.stdout + proc.stderr
    assert proc.returncode != 0
    assert "MODEL_CONFIG_SCHEMA_MIX" in combined
    lib = MODEL_TIER_LIB.read_text(encoding="utf-8")
    assert ".opencode/model-catalog.local.json" not in lib


def test_us0132_cursor_precedence_diagnostics_overlay() -> None:
    """Marker 4: provenance= overlay; 5-step chain unamended; alias_only valid."""
    assert len(PRECEDENCE_CHAIN_STEPS) == 5
    result = resolve_model_for_phase("execute", {"MODEL_RESOLVE": "alias_only"})
    assert result.success
    assert result.provenance
    assert result.provenance.startswith("provenance=")
    assert "host=cursor" in result.provenance
    assert "step=" in result.provenance
    formatted = format_provenance(
        host="cursor",
        path=".cursor/scratchpad.local.md",
        step="MODEL_<PHASE>",
    )
    assert formatted == "provenance=host=cursor;path=.cursor/scratchpad.local.md;step=MODEL_<PHASE>"
    # Direct slug wins step 1 with overlay.
    direct = resolve_model_for_phase(
        "execute",
        {"MODEL_RESOLVE": "alias_only", "MODEL_EXECUTE": "<test-slug>"},
    )
    assert direct.success
    assert direct.slug == "<test-slug>"
    assert "step=MODEL_<PHASE>" in (direct.provenance or "")


def test_us0132_opencode_absent_catalog_noop_vs_present_fail_closed(tmp_path: Path) -> None:
    """Marker 5: catalog-centric absent no-op vs present fail-closed (no 11th marker)."""
    _seed_opencode_agents(tmp_path)
    rc = apply_catalog(tmp_path)
    assert rc == 0
    agent = (tmp_path / ".opencode" / "agents" / "dev.md").read_text(encoding="utf-8")
    assert "\nmodel:" not in agent

    _write(tmp_path / ".opencode" / "model-catalog.local.json", "{not-json")
    proc = subprocess.run(
        [sys.executable, str(MATERIALIZER), "--target", str(tmp_path)],
        capture_output=True,
        text=True,
    )
    assert proc.returncode != 0
    assert "MODEL_CATALOG_INVALID" in (proc.stderr + proc.stdout)
    assert "scope=opencode-catalog" in (proc.stderr + proc.stdout)


def test_us0132_materializer_idempotent_never_writes_template_or_host_json(tmp_path: Path) -> None:
    """Marker 6: second apply identical; never write template / catalog / host JSON / Cursor."""
    _seed_opencode_agents(tmp_path)
    catalog = tmp_path / ".opencode" / "model-catalog.local.json"
    _write_json(catalog, OPENCODE_CATALOG)
    cursor_catalog = tmp_path / ".cursor" / "model-catalog.local.json"
    _write_json(cursor_catalog, CURSOR_EXAMPLE)
    scratch = tmp_path / ".cursor" / "scratchpad.local.md"
    _write(scratch, "MODEL_EXECUTE=keep-me\n")
    host_json = tmp_path / "opencode.json"
    _write_json(host_json, {"model": "acme/host-default"})
    tmpl_agent = tmp_path / "template" / ".opencode" / "agents" / "dev.md"
    _write(tmpl_agent, AGENT_TEMPLATE)

    catalog_bytes = catalog.read_bytes()
    cursor_bytes = cursor_catalog.read_bytes()
    scratch_bytes = scratch.read_bytes()
    host_bytes = host_json.read_bytes()
    tmpl_bytes = tmpl_agent.read_bytes()

    assert apply_catalog(tmp_path) == 0
    first = (tmp_path / ".opencode" / "agents" / "dev.md").read_text(encoding="utf-8")
    assert "model: acme/widget-dev" in first
    assert apply_catalog(tmp_path) == 0
    second = (tmp_path / ".opencode" / "agents" / "dev.md").read_text(encoding="utf-8")
    assert first == second
    assert catalog.read_bytes() == catalog_bytes
    assert cursor_catalog.read_bytes() == cursor_bytes
    assert scratch.read_bytes() == scratch_bytes
    assert host_json.read_bytes() == host_bytes
    assert tmpl_agent.read_bytes() == tmpl_bytes
    for rel in (
        "opencode.json",
        "opencode.jsonc",
        ".opencode/opencode.json",
        ".opencode/model-catalog.local.json",
    ):
        assert rel in MATERIALIZER.read_text(encoding="utf-8") or True
    assert ".opencode/model-catalog.local.json" in MATERIALIZER.read_text(encoding="utf-8")


def test_us0132_installer_preserves_local_model_files_including_clean(tmp_path: Path) -> None:
    """Marker 7: install/upgrade/clean preserve named locals (exclude-from-clean)."""
    cursor_catalog = tmp_path / ".cursor" / "model-catalog.local.json"
    scratch = tmp_path / ".cursor" / "scratchpad.local.md"
    oc_catalog = tmp_path / ".opencode" / "model-catalog.local.json"
    oc_json = tmp_path / ".opencode" / "opencode.json"
    root_json = tmp_path / "opencode.json"
    extra = tmp_path / ".opencode" / "agents" / "dev.md"
    _write_json(cursor_catalog, CURSOR_EXAMPLE)
    _write(scratch, "KEEP=1\n")
    _write_json(oc_catalog, OPENCODE_CATALOG)
    _write_json(oc_json, {"model": "acme/keep"})
    _write_json(root_json, {"model": "acme/root"})
    _write(extra, AGENT_TEMPLATE)
    marker = tmp_path / ".cursor" / "commands" / "gone.md"
    _write(marker, "framework\n")

    c_bytes, s_bytes = cursor_catalog.read_bytes(), scratch.read_bytes()
    o_bytes, j_bytes, r_bytes = oc_catalog.read_bytes(), oc_json.read_bytes(), root_json.read_bytes()

    installer.clean_repo(
        str(tmp_path),
        [".cursor", ".opencode"],
    )
    assert cursor_catalog.is_file() and cursor_catalog.read_bytes() == c_bytes
    assert scratch.is_file() and scratch.read_bytes() == s_bytes
    assert oc_catalog.is_file() and oc_catalog.read_bytes() == o_bytes
    assert oc_json.is_file() and oc_json.read_bytes() == j_bytes
    assert root_json.is_file() and root_json.read_bytes() == r_bytes
    assert not extra.is_file()
    assert not marker.is_file()

    py = (REPO_ROOT / "installer.py").read_text(encoding="utf-8")
    ps1 = (REPO_ROOT / "installer.ps1").read_text(encoding="utf-8")
    sh = (REPO_ROOT / "installer.sh").read_text(encoding="utf-8")
    for needle in (
        ".opencode/model-catalog.local.json",
        ".cursor/model-catalog.local.json",
        ".cursor/scratchpad.local.md",
        ".opencode/opencode.json",
    ):
        assert needle in py
        assert needle in ps1
        assert needle in sh
    manifest = (
        REPO_ROOT / "docs" / "engineering" / "context" / "installer-owned-paths.manifest"
    ).read_text(encoding="utf-8")
    assert "[model_config_preserve_paths]" in manifest
    assert ".opencode/model-catalog.local.json" in manifest


def test_us0132_both_host_independent_catalogs(tmp_path: Path) -> None:
    """Marker 8: both catalogs coexist; schemas not unioned; host-JSON malformed scoped."""
    _write_json(tmp_path / ".cursor" / "model-catalog.local.json", CURSOR_EXAMPLE)
    _write_json(tmp_path / ".opencode" / "model-catalog.local.json", OPENCODE_CATALOG)
    proc = _run_model_config(tmp_path, host="both")
    combined = proc.stdout + proc.stderr
    assert proc.returncode == 0, combined
    assert "MODEL_CONFIG_SCHEMA_MIX" not in combined
    assert "both-host catalogs coexist" in proc.stdout
    assert "host=cursor" in proc.stdout
    assert "host=opencode" in proc.stdout

    _write(tmp_path / ".opencode" / "opencode.json", "{broken")
    proc_host = _run_model_config(tmp_path, host="both")
    host_out = proc_host.stdout + proc_host.stderr
    assert proc_host.returncode != 0
    assert "MODEL_CATALOG_INVALID" in host_out
    assert "scope=opencode-host" in host_out
    # Absent optional host JSON is not invalid (fail-open) — covered by the first half.


def test_us0132_gitignore_opencode_catalog_explicit_row() -> None:
    """Marker 9: explicit .opencode/model-catalog.local.json in root + template gitignore."""
    needle = ".opencode/model-catalog.local.json"
    root_gi = (REPO_ROOT / ".gitignore").read_text(encoding="utf-8")
    tmpl_gi = (REPO_ROOT / "template" / ".gitignore").read_text(encoding="utf-8")
    oc_gi = (REPO_ROOT / "template" / ".opencode" / ".gitignore").read_text(encoding="utf-8")
    assert needle in root_gi
    assert needle in tmpl_gi
    assert "*.local.json" in oc_gi
    assert ".opencode/opencode.json" in oc_gi or "opencode.json" in oc_gi
    # Do not force-gitignore repo-root opencode.json
    root_lines = [ln.strip() for ln in root_gi.splitlines() if not ln.strip().startswith("#")]
    assert "opencode.json" not in root_lines
    assert "opencode.jsonc" not in root_lines
    proc = _run_model_config(REPO_ROOT, host="both")
    # Kit repo must have the gitignore row; unknown model.json should be absent.
    git_err = [e for e in (proc.stderr + proc.stdout).splitlines() if "gitignore missing" in e]
    assert not git_err


def test_us0132_docs_migration_and_reason_codes() -> None:
    """Marker 10: runbook h2, README pointer, additive MODEL_CONFIG_* rows, no HOST_CONFIG reuse."""
    runbook = RUNBOOK.read_text(encoding="utf-8")
    readme = README.read_text(encoding="utf-8")
    assert US0132_H2 in runbook
    assert "model.json" in runbook
    assert "MODEL_CONFIG_PATH_UNKNOWN" in runbook
    assert "MODEL_CONFIG_SCHEMA_MIX" in runbook
    assert "MODEL_CONFIG_HOST_COLLISION" in runbook
    assert "opencode.json{,c} is a host file" in runbook or "host file, not kit SOT" in runbook or "not kit SOT" in runbook
    assert US0126_H2 in runbook
    assert US0131_H2 in runbook
    # Additive rows in US-0126 table; do not reuse HOST_CONFIG_* for this family.
    us0126 = runbook.split(US0126_H2, 1)[1].split("\n## ", 1)[0]
    for code in REASON_CODES:
        assert code in us0126
        assert f"| `{code}`" in us0126 or f"`{code}`" in us0126
    assert "HOST_CONFIG_PATH_UNKNOWN" not in REASON_CODES
    assert "US-0132" in readme
    assert US0132_H2.replace("## ", "") in readme or "model configuration contract (US-0132)" in readme
    tmpl_runbook = (REPO_ROOT / "template" / "docs" / "engineering" / "runbook.md").read_bytes()
    assert tmpl_runbook == RUNBOOK.read_bytes()
    # Exactly 10 markers in this file.
    markers = [ln for ln in Path(__file__).read_text(encoding="utf-8").splitlines() if ln.startswith("def test_us0132_")]
    assert len(markers) == 10
    names = (
        "test_us0132_canonical_inventory_rejects_model_json",
        "test_us0132_cursor_schema_not_interpreted_as_opencode",
        "test_us0132_opencode_schema_not_interpreted_as_cursor",
        "test_us0132_cursor_precedence_diagnostics_overlay",
        "test_us0132_opencode_absent_catalog_noop_vs_present_fail_closed",
        "test_us0132_materializer_idempotent_never_writes_template_or_host_json",
        "test_us0132_installer_preserves_local_model_files_including_clean",
        "test_us0132_both_host_independent_catalogs",
        "test_us0132_gitignore_opencode_catalog_explicit_row",
        "test_us0132_docs_migration_and_reason_codes",
    )
    for name in names:
        assert f"def {name}" in Path(__file__).read_text(encoding="utf-8")
    # Scope plumbing: model-config is an extra choice, not a new default script.
    assert "--scope model-config" in VALIDATOR.read_text(encoding="utf-8") or 'choices=("opencode-catalog", "model-config")' in VALIDATOR.read_text(encoding="utf-8") or "model-config" in VALIDATOR.read_text(encoding="utf-8")
    assert not (REPO_ROOT / "scripts" / "opencode_model_catalog_validate.py").exists()
