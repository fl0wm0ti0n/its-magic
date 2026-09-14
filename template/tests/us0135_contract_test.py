"""US-0135 kit-side contract marker (files-omit + no-Pi-in-auth-models).

Markers 1–10 live primarily in `standalone/tests/contract/us0135.contract.test.ts`
(`node:test`). This module covers marker 3 kit-side (files omit + no Pi).
No live provider. No vitest/jest.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

MARKERS = (
    "test_us0135_owned_auth_path_outside_project",
    "test_us0135_inmemory_credential_store_no_disk",
    "test_us0135_no_pi_imports_in_auth_models",
    "test_us0135_model_router_six_step_precedence",
    "test_us0135_thinking_orthogonal_to_slug_and_token_profile",
    "test_us0135_critic_same_slug_degraded_mode",
    "test_us0135_models_test_checkauth_no_token_logs",
    "test_us0135_two_roles_different_providers_fake",
    "test_us0135_oauth_refresh_not_in_prompt_audit_or_repo",
    "test_us0135_fake_model_ci_default_held",
)

PI_IMPORT_RE = re.compile(r"""['"]@(?:earendil-works/pi-[^'"]+|its-magic/pi-kernel)['"]""")
CODE_SUFFIXES = {".ts", ".js", ".mjs", ".cjs", ".tsx", ".mts", ".cts", ".json"}
SKIP_DIR_NAMES = {
    "node_modules",
    ".git",
    "__pycache__",
    ".pytest_cache",
    "dist",
    ".runtime-isolation",
}


def _kit_root() -> Path:
    here = Path(__file__).resolve()
    for parent in [here.parent, *here.parents]:
        pkg = parent / "package.json"
        standalone = parent / "standalone"
        if pkg.is_file() and standalone.is_dir():
            return parent
    raise AssertionError("kit root with standalone/ not found")


def _load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def test_us0135_no_pi_imports_in_auth_models():
    """Marker 3 (kit): files omit standalone/; auth-models has no Pi deps/imports; no Biome override."""
    root = _kit_root()
    pkg = _load_json(root / "package.json")
    files = pkg.get("files") or []
    for entry in files:
        text = str(entry).replace("\\", "/").strip("/")
        assert text != "standalone"
        assert not text.startswith("standalone/")

    auth = root / "standalone" / "packages" / "auth-models"
    assert (auth / "package.json").is_file()
    auth_pkg = _load_json(auth / "package.json")
    assert auth_pkg.get("name") == "@its-magic/auth-models"
    assert auth_pkg.get("private") is True
    assert auth_pkg.get("version") == "0.0.0"
    deps = {**auth_pkg.get("dependencies", {}), **auth_pkg.get("devDependencies", {})}
    for key in deps:
        assert not str(key).startswith("@earendil-works/pi-"), key
        assert key != "@its-magic/pi-kernel"

    hits: list[str] = []
    for path in auth.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIR_NAMES for part in path.parts):
            continue
        if path.suffix not in CODE_SUFFIXES and path.name != "package.json":
            continue
        text = path.read_text(encoding="utf-8")
        if PI_IMPORT_RE.search(text) or "@earendil-works/pi-" in text or "@its-magic/pi-kernel" in text:
            hits.append(path.relative_to(root).as_posix())
    assert hits == [], f"Pi imports inside auth-models: {hits}"

    biome = json.loads((root / "standalone" / "biome.json").read_text(encoding="utf-8"))
    for override in biome.get("overrides") or []:
        includes = override.get("includes") or []
        joined = " ".join(str(x) for x in includes)
        assert "auth-models" not in joined

    contract = (
        root / "standalone" / "tests" / "contract" / "us0135.contract.test.ts"
    ).read_text(encoding="utf-8")
    for marker in MARKERS:
        assert marker in contract, marker

    cli = (root / "standalone" / "apps" / "cli" / "src" / "index.ts").read_text(encoding="utf-8")
    assert "@its-magic/auth-models" in cli
    assert "@earendil-works/pi-" not in cli
    kernel_src = "\n".join(
        p.read_text(encoding="utf-8")
        for p in (root / "standalone" / "packages" / "pi-kernel" / "src").glob("*.ts")
    )
    assert "createEmptyResourceLoader" in kernel_src
    assert 'noTools: spec.noTools' in kernel_src or 'noTools: spec.noTools' in kernel_src

    role_runtime = root / "standalone" / "packages" / "role-runtime"
    if role_runtime.is_dir():
        rr_pkg = _load_json(role_runtime / "package.json")
        deps = {**rr_pkg.get("dependencies", {}), **rr_pkg.get("devDependencies", {})}
        for key in deps:
            assert not str(key).startswith("@earendil-works/pi-"), key
        rr_hits: list[str] = []
        for path in role_runtime.rglob("*"):
            if not path.is_file():
                continue
            if any(part in SKIP_DIR_NAMES for part in path.parts):
                continue
            if path.suffix not in CODE_SUFFIXES and path.name != "package.json":
                continue
            text = path.read_text(encoding="utf-8")
            if "@earendil-works/pi-" in text:
                rr_hits.append(path.relative_to(root).as_posix())
        assert rr_hits == [], f"Pi imports inside role-runtime: {rr_hits}"
        for override in biome.get("overrides") or []:
            includes = override.get("includes") or []
            joined = " ".join(str(x) for x in includes)
            assert "role-runtime" not in joined
