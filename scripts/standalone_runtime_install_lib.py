"""US-0147 standalone runtime install/adopt/bootstrap helpers (installer hook SOT)."""

from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import uuid
from dataclasses import dataclass
from typing import Any

KERNEL_MARKER_REL = (
    "docs/product/backlog.md",
    "scripts/intake_evidence_validate.py",
    "its_magic/.its-magic-version",
)

STANDALONE_REL = ".its-magic/standalone"
STAGING_ROOT_REL = ".its-magic/install-staging"
RUNTIME_METADATA_REL = ".its-magic/standalone/runtime-metadata.json"
ITSM_SHIM_REL = ".its-magic/bin/itsm"
ROOT_ITSM_SHIM_REL = "bin/itsm"
STANDALONE_REQUIRED_PATHS = (
    "package.json",
    "package-lock.json",
    "apps/cli/src/index.ts",
    "packages/auth-models/src/index.ts",
    "packages/pi-kernel/src/index.ts",
    "packages/role-runtime/src/index.ts",
    "packages/runtime-core/src/index.ts",
)

SUPPORTED_RANGE_REL = os.path.join(
    "standalone",
    "packages",
    "kernel-bridge",
    "supported-kernel-range.json",
)
PACKAGED_SUPPORTED_RANGE_REL = os.path.join(
    "scripts",
    "standalone-supported-kernel-range.json",
)


def posix_relpath(rel: str) -> str:
    return rel.replace("\\", "/")


def count_kernel_markers(root: str) -> int:
    root = os.path.abspath(root)
    n = 0
    for rel in KERNEL_MARKER_REL:
        if os.path.isfile(os.path.join(root, rel)):
            n += 1
    return n


def locate_kernel_root_sync(target_root: str) -> str | None:
    """Three-marker locate (compose US-0134 marker list)."""
    root = os.path.abspath(target_root)
    cap = 16
    for hops in range(cap + 1):
        if count_kernel_markers(root) == 3:
            return root
        parent = os.path.dirname(root)
        if parent == root:
            break
        root = parent
    return None


def host_profile_advisory(target_root: str) -> str:
    has_cursor = os.path.isdir(os.path.join(target_root, ".cursor"))
    has_opencode = os.path.exists(os.path.join(target_root, ".opencode"))
    if has_cursor and has_opencode:
        return "both-host"
    if has_cursor:
        return "cursor-only"
    if has_opencode:
        return "opencode-only"
    standalone = os.path.join(target_root, STANDALONE_REL, "package.json")
    if os.path.isfile(standalone):
        return "standalone-only"
    return "fresh-host"


@dataclass
class AdoptionProfile:
    adoption_class: str
    host_profile: str
    kernel_root: str | None
    reason_code: str | None = None


def classify_project_adoption_profile(target_root: str) -> AdoptionProfile:
    target_root = os.path.abspath(target_root)
    marker_count = count_kernel_markers(target_root)
    if marker_count in (1, 2):
        return AdoptionProfile(
            adoption_class="invalid",
            host_profile=host_profile_advisory(target_root),
            kernel_root=None,
            reason_code="ADOPT_PARTIAL_MARKERS",
        )
    located = locate_kernel_root_sync(target_root)
    host = host_profile_advisory(target_root)
    if located is None:
        return AdoptionProfile(
            adoption_class="fresh",
            host_profile=host,
            kernel_root=None,
        )
    return AdoptionProfile(
        adoption_class="existing-its-magic",
        host_profile=host,
        kernel_root=located,
    )


def read_deny_overwrite(manifest_path: str) -> set[str]:
    if not os.path.isfile(manifest_path):
        return set()
    paths: list[str] = []
    section: str | None = None
    with open(manifest_path, encoding="utf-8") as fh:
        for line in fh:
            stripped = line.strip()
            if stripped.startswith("[") and stripped.endswith("]"):
                section = stripped[1:-1].strip()
                continue
            if not stripped or stripped.startswith("#"):
                continue
            if section == "deny_overwrite":
                paths.append(posix_relpath(stripped))
    return set(paths)


def path_denied_overwrite(rel: str, deny: set[str]) -> bool:
    rel = posix_relpath(rel)
    for entry in deny:
        entry = posix_relpath(entry)
        if entry.endswith("/**"):
            prefix = entry[:-3]
            if rel == prefix or rel.startswith(prefix + "/"):
                return True
        elif rel == entry or rel.startswith(entry + "/"):
            return True
    if rel.endswith(".local.md") or ".local." in rel:
        return True
    return False


def framework_kit_repo_enabled() -> bool:
    val = os.environ.get("FRAMEWORK_KIT_REPO", "").strip()
    return val in ("1", "true", "True", "yes")


def resolve_standalone_source(source_root: str, script_dir: str) -> str:
    template_mirror = os.path.join(source_root, ".its-magic", "standalone")
    if os.path.isfile(os.path.join(template_mirror, "package.json")):
        return template_mirror
    in_tree = os.path.join(script_dir, "standalone")
    if framework_kit_repo_enabled() and os.path.isfile(os.path.join(in_tree, "package.json")):
        return in_tree
    return template_mirror


def missing_standalone_payload_paths(source: str) -> list[str]:
    return [rel for rel in STANDALONE_REQUIRED_PATHS if not os.path.isfile(os.path.join(source, rel))]


def _copy_tree(src: str, dst: str, *, skip_npm: bool = False) -> None:
    if not os.path.isdir(src):
        raise FileNotFoundError(src)

    def _ignore(_dir: str, names: list[str]) -> set[str]:
        ignored = {".git", "node_modules", "__pycache__", ".pytest_cache"}
        if skip_npm:
            ignored.add("node_modules")
        return {n for n in names if n in ignored}

    if os.path.isdir(dst):
        shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=_ignore)


def _parse_prerelease_version(raw: str) -> tuple[tuple[int, ...], str | None]:
    raw = raw.strip()
    main, _, pre = raw.partition("-")
    parts: list[int] = []
    for chunk in re.split(r"[.+]", main):
        if chunk.isdigit():
            parts.append(int(chunk))
        else:
            break
    while len(parts) < 3:
        parts.append(0)
    return tuple(parts[:3]), pre or None


def _pre_num(pre: str | None) -> int | None:
    if not pre:
        return None
    if pre.isdigit():
        return int(pre)
    return None


def version_in_supported_range(version: str, range_doc: dict[str, Any]) -> bool:
    min_inc = str(range_doc.get("minInclusive", ""))
    max_exc = str(range_doc.get("maxExclusive", ""))
    if not min_inc or not max_exc:
        return False
    v_main, v_pre = _parse_prerelease_version(version)
    min_main, min_pre = _parse_prerelease_version(min_inc)
    max_main, _max_pre = _parse_prerelease_version(max_exc)
    if v_main < min_main:
        return False
    if v_main > max_main:
        return False
    if v_main == max_main:
        return False
    if v_main == min_main:
        vn = _pre_num(v_pre)
        mn = _pre_num(min_pre)
        if mn is not None:
            if vn is None:
                return False
            if vn < mn:
                return False
    return True


def load_supported_range(script_dir: str) -> dict[str, Any] | None:
    """Load the in-tree range or its small published-kit equivalent."""
    for rel in (SUPPORTED_RANGE_REL, PACKAGED_SUPPORTED_RANGE_REL):
        path = os.path.join(script_dir, rel)
        if not os.path.isfile(path):
            continue
        try:
            with open(path, encoding="utf-8") as fh:
                return json.load(fh)
        except (OSError, json.JSONDecodeError):
            return None
    return None


def run_kernel_preflight(target_root: str, script_dir: str) -> tuple[dict[str, Any], str | None]:
    """Returns (metadata_dict, reason_code). reason_code set on fail-closed."""
    profile = classify_project_adoption_profile(target_root)
    if profile.reason_code == "ADOPT_PARTIAL_MARKERS":
        return {}, profile.reason_code
    kernel_root = profile.kernel_root or locate_kernel_root_sync(target_root)
    if kernel_root is None:
        return {}, "KERNEL_NOT_FOUND"
    version_path = os.path.join(kernel_root, "its_magic", ".its-magic-version")
    contract_path = os.path.join(kernel_root, "its_magic", "kernel-contract.json")
    if not os.path.isfile(version_path):
        return {}, "KERNEL_CONTRACT_MISMATCH"
    version = open(version_path, encoding="utf-8").read().strip()
    if not version:
        return {}, "KERNEL_CONTRACT_MISMATCH"
    try:
        contract = json.loads(open(contract_path, encoding="utf-8").read())
    except (OSError, json.JSONDecodeError):
        return {}, "KERNEL_CONTRACT_MISMATCH"
    if contract.get("schema_version") != 1:
        return {}, "KERNEL_CONTRACT_MISMATCH"
    if contract.get("kernel_version") != version:
        return {}, "KERNEL_CONTRACT_MISMATCH"
    range_doc = load_supported_range(script_dir)
    # Published kits use the packaged fallback because the private standalone workspace stays omitted.
    if range_doc is None:
        return {}, "STANDALONE_SUPPORTED_RANGE_MISSING"
    if not version_in_supported_range(version, range_doc):
        return {}, "KERNEL_VERSION_UNSUPPORTED"
    validators = contract.get("validators") or []
    if not isinstance(validators, list):
        return {}, "KERNEL_CONTRACT_MISMATCH"
    val_blob = json.dumps(validators, sort_keys=True, separators=(",", ":"))
    val_hash = hashlib.sha256(val_blob.encode("utf-8")).hexdigest()
    meta = {
        "kernel_version": version,
        "contract_schema_version": 1,
        "supported_range": range_doc,
        "validators_hash": val_hash,
        "browser_prereq": "missing",
        "standalone_source": "template-mirror",
    }
    return meta, None


def write_runtime_metadata(target_root: str, meta: dict[str, Any]) -> None:
    path = os.path.join(target_root, RUNTIME_METADATA_REL)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(meta, fh, indent=2, sort_keys=True)
        fh.write("\n")


def write_itsm_shim(target_root: str, *, root_opt_in: bool = False) -> None:
    standalone_root = os.path.join(target_root, STANDALONE_REL)
    cli_entry = os.path.join(standalone_root, "apps", "cli", "src", "index.ts")
    shim_dir = os.path.join(target_root, ".its-magic", "bin")
    os.makedirs(shim_dir, exist_ok=True)
    shim_path = os.path.join(target_root, ITSM_SHIM_REL)
    if os.name == "nt":
        body = (
            "@echo off\r\n"
            f'set "ITSM_STANDALONE_ROOT={standalone_root}"\r\n'
            'node -e "const v=process.versions.node.split(\'.\').map(Number);process.exit(v[0]>22||(v[0]===22&&(v[1]>19||(v[1]===19&&v[2]>=0)))?0:1)" || (echo [ITSM_NODE_VERSION_UNSUPPORTED] itsm requires Node.js ^>=22.19.0. Found unsupported Node.js. Install Node.js 22.19.0 or newer, then retry. 1>&2 & exit /b 1)\r\n'
            f'node --experimental-strip-types "{cli_entry}" %*\r\n'
        )
        with open(shim_path + ".cmd", "w", encoding="utf-8", newline="\r\n") as fh:
            fh.write(body)
        with open(shim_path, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(
                "#!/usr/bin/env sh\n"
                f'export ITSM_STANDALONE_ROOT="{standalone_root.replace(chr(92), "/")}"\n'
                "if ! node -e 'const v=process.versions.node.split(\".\").map(Number);process.exit(v[0]>22||(v[0]===22&&(v[1]>19||(v[1]===19&&v[2]>=0)))?0:1)'; then\n"
                "  echo '[ITSM_NODE_VERSION_UNSUPPORTED] itsm requires Node.js >=22.19.0. Install Node.js 22.19.0 or newer, then retry.' >&2\n"
                "  exit 1\n"
                "fi\n"
                f'exec node --experimental-strip-types "{cli_entry.replace(chr(92), "/")}" "$@"\n'
            )
    else:
        with open(shim_path, "w", encoding="utf-8", newline="\n") as fh:
            fh.write("#!/usr/bin/env sh\n")
            fh.write(f'export ITSM_STANDALONE_ROOT="{standalone_root}"\n')
            fh.write("if ! node -e 'const v=process.versions.node.split(\".\").map(Number);process.exit(v[0]>22||(v[0]===22&&(v[1]>19||(v[1]===19&&v[2]>=0)))?0:1)'; then\n")
            fh.write("  echo '[ITSM_NODE_VERSION_UNSUPPORTED] itsm requires Node.js >=22.19.0. Install Node.js 22.19.0 or newer, then retry.' >&2\n")
            fh.write("  exit 1\n")
            fh.write("fi\n")
            fh.write(f'exec node --experimental-strip-types "{cli_entry}" "$@"\n')
        os.chmod(shim_path, 0o755)
    if root_opt_in:
        root_bin = os.path.join(target_root, ROOT_ITSM_SHIM_REL)
        os.makedirs(os.path.dirname(root_bin), exist_ok=True)
        shutil.copy2(shim_path, root_bin)


def run_npm_ci(standalone_dir: str, *, dry_run: bool = False) -> tuple[bool, str]:
    if dry_run or os.environ.get("ITSM_SKIP_NPM_CI") == "1":
        return True, "skipped"
    npm_bin = shutil.which("npm")
    if not npm_bin:
        return False, "npm not on PATH"
    try:
        proc = subprocess.run(
            [npm_bin, "ci", "--ignore-scripts"],
            cwd=standalone_dir,
            capture_output=True,
            text=True,
        )
    except OSError as exc:
        return False, f"npm spawn failed: {exc}"
    if proc.returncode != 0:
        err = (proc.stderr or proc.stdout or "").strip()
        return False, err[:2000]
    return True, "ok"


def bootstrap_standalone_runtime_installer_hook(
    target_root: str,
    source_root: str,
    script_dir: str,
    *,
    root_itsm_opt_in: bool = False,
    simulate_npm_failure: bool = False,
) -> tuple[bool, str | None]:
    target_root = os.path.abspath(target_root)
    profile = classify_project_adoption_profile(target_root)
    if profile.reason_code == "ADOPT_PARTIAL_MARKERS":
        print(f"[{profile.reason_code}] partial kernel markers under {target_root}")
        return False, profile.reason_code

    meta, kerr = run_kernel_preflight(target_root, script_dir)
    if kerr:
        print(f"[{kerr}] kernel preflight failed")
        return False, kerr

    src = resolve_standalone_source(source_root, script_dir)
    dst = os.path.join(target_root, STANDALONE_REL)
    missing_payload = missing_standalone_payload_paths(src)
    if missing_payload:
        missing_text = ", ".join(posix_relpath(rel) for rel in missing_payload)
        print(f"[STANDALONE_BOOTSTRAP_FAILED] runtime payload incomplete: {missing_text}")
        return False, "STANDALONE_BOOTSTRAP_FAILED"
    try:
        _copy_tree(src, dst, skip_npm=True)
    except OSError as exc:
        print(f"[STANDALONE_BOOTSTRAP_FAILED] mirror copy failed: {exc}")
        return False, "STANDALONE_BOOTSTRAP_FAILED"

    if framework_kit_repo_enabled() and src == os.path.join(script_dir, "standalone"):
        meta["standalone_source"] = "in-tree-pin"

    ok, npm_note = run_npm_ci(dst, dry_run=simulate_npm_failure)
    if not ok:
        print(f"[STANDALONE_BOOTSTRAP_FAILED] npm ci failed: {npm_note}")
        if os.path.isdir(dst):
            shutil.rmtree(dst, ignore_errors=True)
        return False, "STANDALONE_BOOTSTRAP_FAILED"

    write_runtime_metadata(target_root, meta)
    write_itsm_shim(target_root, root_opt_in=root_itsm_opt_in)
    print(f"[STANDALONE_BOOTSTRAP_OK] workspace at {STANDALONE_REL}")
    return True, None


def staged_update_begin(target_root: str, run_id: str | None = None) -> str:
    run_id = run_id or uuid.uuid4().hex[:12]
    staging = os.path.join(target_root, STAGING_ROOT_REL, run_id)
    os.makedirs(staging, exist_ok=True)
    return run_id


def staged_update_commit(target_root: str, run_id: str, meta: dict[str, Any]) -> None:
    staging = os.path.join(target_root, STAGING_ROOT_REL, run_id)
    if os.path.isdir(staging):
        shutil.rmtree(staging, ignore_errors=True)
    write_runtime_metadata(target_root, meta)


def staged_update_rollback(
    target_root: str,
    run_id: str,
    preserved_layers: list[str],
) -> str:
    staging = os.path.join(target_root, STAGING_ROOT_REL, run_id)
    if os.path.isdir(staging):
        shutil.rmtree(staging, ignore_errors=True)
    layers = ", ".join(preserved_layers) if preserved_layers else "(none)"
    print(f"[INSTALL_INTERRUPTED_ROLLBACK_OK] preserved user layers: {layers}")
    return "INSTALL_INTERRUPTED_ROLLBACK_OK"


def setup_browser_explicit(
    target_root: str,
    *,
    offline: bool = False,
) -> tuple[bool, str | None]:
    if offline:
        return False, "INSTALL_BROWSER_OFFLINE"
    if os.environ.get("ITS_MAGIC_INSTALL_BROWSER") != "1":
        meta_path = os.path.join(target_root, RUNTIME_METADATA_REL)
        if os.path.isfile(meta_path):
            meta = json.loads(open(meta_path, encoding="utf-8").read())
            meta["browser_prereq"] = "missing"
            write_runtime_metadata(target_root, meta)
        return False, "INSTALL_BROWSER_EXPLICIT_GATE"
    standalone = os.path.join(target_root, STANDALONE_REL)
    if not os.path.isdir(standalone):
        return False, "STANDALONE_BOOTSTRAP_FAILED"
    proc = subprocess.run(
        ["npm", "exec", "--yes", "playwright", "install", "chromium"],
        cwd=standalone,
        capture_output=True,
        text=True,
    )
    meta_path = os.path.join(target_root, RUNTIME_METADATA_REL)
    meta = {}
    if os.path.isfile(meta_path):
        meta = json.loads(open(meta_path, encoding="utf-8").read())
    if proc.returncode != 0:
        meta["browser_prereq"] = "missing"
        write_runtime_metadata(target_root, meta)
        return True, None
    meta["browser_prereq"] = "installed"
    write_runtime_metadata(target_root, meta)
    return True, None


def uninstall_standalone(target_root: str, *, root_shim: bool = False) -> list[str]:
    target_root = os.path.abspath(target_root)
    removed: list[str] = []
    for rel in (
        STANDALONE_REL,
        STAGING_ROOT_REL,
        RUNTIME_METADATA_REL,
        ITSM_SHIM_REL,
        ITSM_SHIM_REL + ".cmd",
    ):
        full = os.path.join(target_root, rel)
        if os.path.isdir(full):
            shutil.rmtree(full, ignore_errors=True)
            removed.append(rel)
        elif os.path.isfile(full):
            os.remove(full)
            removed.append(rel)
    if root_shim:
        root_bin = os.path.join(target_root, ROOT_ITSM_SHIM_REL)
        if os.path.isfile(root_bin):
            os.remove(root_bin)
            removed.append(ROOT_ITSM_SHIM_REL)
    kit_ver = os.path.join(target_root, ".its-magic-version")
    inner_ver = os.path.join(target_root, "its_magic", ".its-magic-version")
    if os.path.isfile(kit_ver) and os.path.isfile(inner_ver):
        a = open(kit_ver, encoding="utf-8").read().strip()
        b = open(inner_ver, encoding="utf-8").read().strip()
        if a and b and a != b:
            print(f"[KIT_VERSION_COEXISTENCE] .its-magic-version={a} its_magic/.its-magic-version={b}")
    return removed


def run_standalone_postinstall_cli(argv: list[str] | None = None) -> int:
    import argparse

    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--target", required=True)
    parser.add_argument("--source-root", required=True)
    parser.add_argument("--script-dir", required=True)
    parser.add_argument("--root-itsm-opt-in", action="store_true")
    parser.add_argument("--uninstall-standalone", action="store_true")
    parser.add_argument("--setup-browser", action="store_true")
    parser.add_argument("--browser-offline", action="store_true")
    args = parser.parse_args(argv)
    if args.uninstall_standalone:
        uninstall_standalone(args.target, root_shim=args.root_itsm_opt_in)
        return 0
    if args.setup_browser:
        ok, code = setup_browser_explicit(args.target, offline=args.browser_offline)
        if code == "INSTALL_BROWSER_OFFLINE":
            print(f"[{code}]")
            return 1
        if code == "INSTALL_BROWSER_EXPLICIT_GATE":
            print(f"[{code}] set ITS_MAGIC_INSTALL_BROWSER=1 to allow download")
            return 1
        return 0 if ok else 1
    ok, _code = bootstrap_standalone_runtime_installer_hook(
        args.target,
        args.source_root,
        args.script_dir,
        root_itsm_opt_in=args.root_itsm_opt_in,
    )
    return 0 if ok else 1
