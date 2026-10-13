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
from collections.abc import Callable, Mapping
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
ITSM_PATH_SHIM_MISSING = "ITSM_PATH_SHIM_MISSING"
ITSM_PATH_REGISTER_FAILED = "ITSM_PATH_REGISTER_FAILED"
ITSM_PATH_REGISTER_OK = "ITSM_PATH_REGISTER_OK"
ITSM_PATH_UNREGISTER_OK = "ITSM_PATH_UNREGISTER_OK"
ITSM_PATH_MARK_BEGIN = "# its-magic:itsm-path:begin"
ITSM_PATH_MARK_END = "# its-magic:itsm-path:end"
ITSM_PATH_SOURCE_MARK = "its-magic:itsm-path:source"
ITSM_PATH_SOURCE_LINE = '. "$HOME/.config/its-magic/itsm-path.sh" # its-magic:itsm-path:source'
WINDOWS_ITSM_BIN_REL = os.path.join("its-magic", "bin")
POSIX_ITSM_BIN_REL = os.path.join(".local", "bin")
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


def _normalize_itsm_platform(platform_name: str | None) -> str:
    if platform_name in ("nt", "windows", "win32"):
        return "nt"
    if platform_name in ("posix", "linux", "darwin", "mac", "macos"):
        return "posix"
    return "nt" if os.name == "nt" else "posix"


def _user_base(platform: str, home: str | None, userprofile: str | None) -> str:
    if platform == "nt":
        if userprofile:
            return userprofile
        if home:
            return home
        return os.environ.get("USERPROFILE") or os.environ.get("HOME") or ""
    if home:
        return home
    return os.environ.get("HOME") or ""


def default_itsm_link_dir(
    *,
    platform: str,
    home: str | None,
    localappdata: str | None = None,
    userprofile: str | None = None,
) -> str:
    """Documented link directory. Windows: %LOCALAPPDATA%\\its-magic\\bin. POSIX: $HOME/.local/bin."""
    platform = _normalize_itsm_platform(platform)
    if platform == "nt":
        base = localappdata
        if not base:
            base = os.environ.get("LOCALAPPDATA")
        if not base:
            base = os.path.join(_user_base(platform, home, userprofile), "AppData", "Local")
        return os.path.join(base, WINDOWS_ITSM_BIN_REL)
    return os.path.join(_user_base(platform, home, userprofile), POSIX_ITSM_BIN_REL)


def itsm_path_ledger_path(
    *,
    platform: str,
    home: str | None = None,
    userprofile: str | None = None,
) -> str:
    platform = _normalize_itsm_platform(platform)
    if platform == "nt":
        return os.path.join(_user_base(platform, home, userprofile), ".its-magic", "itsm-path-registration.json")
    return os.path.join(_user_base(platform, home, userprofile), ".config", "its-magic", "itsm-path-registration.json")


def _posix_snippet_path(home: str) -> str:
    return os.path.join(home, ".config", "its-magic", "itsm-path.sh")


def resolve_itsm_path_opt_in(
    register_flag: str | None,
    env: Mapping[str, str] | None = None,
) -> bool:
    """True only for --register-itsm-path or ITS_MAGIC_REGISTER_ITSM_PATH=1."""
    if register_flag is not None:
        return True
    source = env if env is not None else os.environ
    return str(source.get("ITS_MAGIC_REGISTER_ITSM_PATH", "")).strip() == "1"


def resolve_itsm_path_directory(
    register_flag: str | None,
    *,
    platform: str,
    home: str | None,
    localappdata: str | None = None,
    userprofile: str | None = None,
    env: Mapping[str, str] | None = None,
    is_tty: bool | None = None,
    prompt_fn: Callable[[str], str] | None = None,
) -> tuple[str | None, str | None]:
    """Return (directory, error_token). `prompt` fail-closes when stdin is not a TTY."""
    source = env if env is not None else os.environ
    platform = _normalize_itsm_platform(platform)
    if register_flag not in (None, "", "prompt"):
        return os.path.abspath(str(register_flag)), None
    if register_flag == "prompt":
        tty = sys.stdin.isatty() if is_tty is None else bool(is_tty)
        if not tty or prompt_fn is None:
            return None, ITSM_PATH_REGISTER_FAILED
        entered = str(prompt_fn("Directory for itsm on PATH")).strip()
        if entered:
            return os.path.abspath(entered), None
    env_dir = str(source.get("ITS_MAGIC_ITSM_PATH_DIR", "")).strip()
    if env_dir:
        return os.path.abspath(env_dir), None
    return default_itsm_link_dir(
        platform=platform,
        home=home,
        localappdata=localappdata,
        userprofile=userprofile,
    ), None


def _shim_paths(target_root: str) -> tuple[str, str]:
    shim = os.path.join(os.path.abspath(target_root), ITSM_SHIM_REL)
    return shim, shim + ".cmd"


def _shim_ready(target_root: str, platform: str) -> bool:
    shim, cmd = _shim_paths(target_root)
    if not os.path.isfile(shim):
        return False
    if platform == "nt" and not os.path.isfile(cmd):
        return False
    return True


def _same_dir(left: str, right: str) -> bool:
    if not left or not right:
        return False
    return os.path.normcase(os.path.normpath(left)) == os.path.normcase(os.path.normpath(right))


def _is_inside(path: str, root: str) -> bool:
    if not path or not root:
        return False
    try:
        child = os.path.abspath(path)
        parent = os.path.abspath(root)
        return os.path.commonpath([child, parent]) == parent
    except ValueError:
        return False


def _read_ledger(path: str) -> dict[str, Any] | None:
    if not os.path.isfile(path):
        return None
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
    except (OSError, json.JSONDecodeError):
        return None
    if not isinstance(data, dict):
        return None
    return data


def _write_ledger(path: str, payload: dict[str, Any]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, sort_keys=True)
        fh.write("\n")


def _capture_link(path: str) -> tuple[Any, ...]:
    if not os.path.lexists(path):
        return ("missing",)
    if os.path.islink(path):
        return ("symlink", os.readlink(path))
    if os.path.isfile(path):
        with open(path, "rb") as fh:
            data = fh.read()
        return ("file", data, os.stat(path).st_mode & 0o777)
    return ("other",)


def _restore_link(path: str, captured: tuple[Any, ...]) -> None:
    if os.path.lexists(path):
        os.remove(path)
    kind = captured[0]
    if kind == "missing" or kind == "other":
        return
    if kind == "symlink":
        os.symlink(captured[1], path)
        return
    if kind == "file":
        with open(path, "wb") as fh:
            fh.write(captured[1])
        os.chmod(path, captured[2])


def _place_links(target_root: str, directory: str, platform: str) -> list[tuple[str, tuple[Any, ...]]]:
    shim, cmd = _shim_paths(target_root)
    placed: list[tuple[str, tuple[Any, ...]]] = []
    sources = [(shim, "itsm"), (cmd, "itsm.cmd")] if platform == "nt" else [(shim, "itsm")]
    for src, name in sources:
        dest = os.path.join(directory, name)
        captured = _capture_link(dest)
        if os.path.lexists(dest):
            os.remove(dest)
        try:
            if platform == "nt":
                shutil.copyfile(src, dest)
            else:
                try:
                    os.symlink(os.path.abspath(src), dest)
                except OSError:
                    shutil.copyfile(src, dest)
                    os.chmod(dest, 0o755)
        except OSError:
            _restore_link(dest, captured)
            for prev_name, prev_cap in reversed(placed):
                _restore_link(os.path.join(directory, prev_name), prev_cap)
            raise
        placed.append((name, captured))
    return placed


def _rollback_placed(directory: str, placed: list[tuple[str, tuple[Any, ...]]]) -> None:
    for name, captured in reversed(placed):
        _restore_link(os.path.join(directory, name), captured)


class _HkcuEnvironmentPathStore:
    """HKCU\\Environment Path read-modify-write. Tests inject a fake store instead."""

    def read(self) -> tuple[str, str]:
        import winreg

        try:
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment", 0, winreg.KEY_READ) as key:
                value, typ = winreg.QueryValueEx(key, "Path")
        except FileNotFoundError:
            return "", "REG_EXPAND_SZ"
        except OSError:
            return "", "REG_EXPAND_SZ"
        type_name = "REG_EXPAND_SZ" if typ == winreg.REG_EXPAND_SZ else "REG_SZ"
        return str(value or ""), type_name

    def write(self, value: str, type_name: str) -> None:
        import winreg

        typ = winreg.REG_EXPAND_SZ if type_name == "REG_EXPAND_SZ" else winreg.REG_SZ
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment", 0, winreg.KEY_SET_VALUE) as key:
            winreg.SetValueEx(key, "Path", 0, typ, value)


def _win_has_dir(value: str, directory: str) -> bool:
    want = os.path.normcase(os.path.normpath(directory))
    for part in value.split(";"):
        if part and os.path.normcase(os.path.normpath(part)) == want:
            return True
    return False


def _win_append(value: str, directory: str) -> tuple[str, bool]:
    if _win_has_dir(value, directory):
        return value, False
    if value == "":
        return directory, True
    if value.endswith(";"):
        return value + directory, True
    return value + ";" + directory, True


def _win_remove_one(value: str, directory: str) -> str:
    want = os.path.normcase(os.path.normpath(directory))
    parts = value.split(";")
    for index in range(len(parts) - 1, -1, -1):
        part = parts[index]
        if part and os.path.normcase(os.path.normpath(part)) == want:
            del parts[index]
            break
    return ";".join(parts)


def _posix_export_line(directory: str) -> str:
    return f'export PATH="{directory}:$PATH"'


def _posix_has_dir(text: str, directory: str) -> bool:
    return _posix_export_line(directory) in text


def _upsert_posix_block(text: str, directory: str) -> tuple[str, bool]:
    line = _posix_export_line(directory)
    block = f"{ITSM_PATH_MARK_BEGIN}\n{line}\n{ITSM_PATH_MARK_END}\n"
    if ITSM_PATH_MARK_BEGIN in text and ITSM_PATH_MARK_END in text:
        start = text.index(ITSM_PATH_MARK_BEGIN)
        end = text.index(ITSM_PATH_MARK_END) + len(ITSM_PATH_MARK_END)
        existing = text[start:end]
        if line in existing:
            return text, False
        suffix = text[end:]
        if suffix.startswith("\n"):
            suffix = suffix[1:]
        return text[:start] + block + suffix, True
    if text and not text.endswith("\n"):
        text += "\n"
    return text + block, True


def _append_source_line(path: str) -> None:
    existing = ""
    if os.path.isfile(path):
        with open(path, encoding="utf-8") as fh:
            existing = fh.read()
    if ITSM_PATH_SOURCE_MARK in existing:
        return
    if existing and not existing.endswith("\n"):
        existing += "\n"
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(existing + ITSM_PATH_SOURCE_LINE + "\n")


def _strip_source_lines(path: str) -> None:
    if not os.path.isfile(path):
        return
    with open(path, encoding="utf-8") as fh:
        lines = fh.readlines()
    kept = [line for line in lines if ITSM_PATH_SOURCE_MARK not in line]
    if kept == lines:
        return
    if not any(line.strip() for line in kept):
        os.remove(path)
        return
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        fh.writelines(kept)


def _strip_posix_block(path: str) -> None:
    if not os.path.isfile(path):
        return
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    if ITSM_PATH_MARK_BEGIN not in text or ITSM_PATH_MARK_END not in text:
        return
    start = text.index(ITSM_PATH_MARK_BEGIN)
    end = text.index(ITSM_PATH_MARK_END) + len(ITSM_PATH_MARK_END)
    suffix = text[end:]
    if suffix.startswith("\n"):
        suffix = suffix[1:]
    updated = text[:start] + suffix
    if not updated.strip():
        os.remove(path)
        return
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(updated)


def _snapshot_file(path: str) -> tuple[str, bytes | None]:
    if not os.path.isfile(path):
        return path, None
    with open(path, "rb") as fh:
        return path, fh.read()


def _restore_file(path: str, data: bytes | None) -> None:
    if data is None:
        if os.path.lexists(path):
            os.remove(path)
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as fh:
        fh.write(data)


def _commit_windows_path(
    directory: str,
    path_store: Any,
    *,
    fail_path_write: bool,
    prior_added: bool,
) -> bool:
    previous, type_name = path_store.read()
    previous = "" if previous is None else str(previous)
    type_name = type_name or "REG_EXPAND_SZ"
    updated, added = _win_append(previous, directory)
    if not added:
        return prior_added
    try:
        if fail_path_write:
            raise OSError("simulated PATH write failure")
        path_store.write(updated, type_name)
    except OSError:
        try:
            current, current_type = path_store.read()
        except OSError:
            current, current_type = updated, type_name
        if str(current or "") != previous or (current_type or type_name) != type_name:
            try:
                path_store.write(previous, type_name)
            except OSError:
                pass
        raise
    return True


def _commit_posix_path(
    home: str,
    directory: str,
    *,
    fail_path_write: bool,
    prior_added: bool,
) -> bool:
    snippet = _posix_snippet_path(home)
    profile = os.path.join(home, ".profile")
    bashrc = os.path.join(home, ".bashrc")
    text = ""
    if os.path.isfile(snippet):
        with open(snippet, encoding="utf-8") as fh:
            text = fh.read()
    if _posix_has_dir(text, directory):
        return prior_added
    if fail_path_write:
        raise OSError("simulated PATH write failure")
    snapshots = [_snapshot_file(snippet), _snapshot_file(profile), _snapshot_file(bashrc)]
    try:
        updated, _changed = _upsert_posix_block(text, directory)
        os.makedirs(os.path.dirname(snippet), exist_ok=True)
        with open(snippet, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(updated)
        if os.path.isfile(profile):
            _append_source_line(profile)
        if os.path.isfile(bashrc):
            _append_source_line(bashrc)
        if not os.path.isfile(profile) and not os.path.isfile(bashrc):
            _append_source_line(profile)
    except OSError:
        for path, data in snapshots:
            _restore_file(path, data)
        raise
    return True


def register_itsm_user_path(
    target_root: str,
    directory: str,
    *,
    platform_name: str | None = None,
    home: str | None = None,
    userprofile: str | None = None,
    path_store: Any | None = None,
    fail_path_write: bool = False,
) -> tuple[bool, str]:
    """Link the materialized shim into `directory` and append that directory when absent."""
    platform = _normalize_itsm_platform(platform_name)
    if not _shim_ready(target_root, platform):
        print(
            f"[{ITSM_PATH_SHIM_MISSING}] .its-magic/bin/itsm is not materialized"
            " (itsm.cmd is also required on Windows). PATH was not changed."
            " BUG-0026 owns published-kit materialize. Run: its-magic --mode upgrade"
        )
        return False, ITSM_PATH_SHIM_MISSING

    home_base = _user_base(platform, home, userprofile)
    ledger_path = itsm_path_ledger_path(platform=platform, home=home, userprofile=userprofile)
    directory = os.path.abspath(directory)
    try:
        os.makedirs(directory, exist_ok=True)
    except OSError as exc:
        print(f"[{ITSM_PATH_REGISTER_FAILED}] could not create directory: {exc}")
        return False, ITSM_PATH_REGISTER_FAILED

    try:
        placed = _place_links(target_root, directory, platform)
    except OSError as exc:
        print(f"[{ITSM_PATH_REGISTER_FAILED}] could not place itsm link: {exc}")
        return False, ITSM_PATH_REGISTER_FAILED

    prior = _read_ledger(ledger_path)
    prior_added = bool(prior and prior.get("path_entry_added") and _same_dir(str(prior.get("dir") or ""), directory))
    try:
        if platform == "nt":
            store = path_store if path_store is not None else _HkcuEnvironmentPathStore()
            added = _commit_windows_path(
                directory,
                store,
                fail_path_write=fail_path_write,
                prior_added=prior_added,
            )
        else:
            added = _commit_posix_path(
                home_base,
                directory,
                fail_path_write=fail_path_write,
                prior_added=prior_added,
            )
    except OSError as exc:
        _rollback_placed(directory, placed)
        print(f"[{ITSM_PATH_REGISTER_FAILED}] PATH write failed: {exc}")
        return False, ITSM_PATH_REGISTER_FAILED

    shim, _cmd = _shim_paths(target_root)
    payload = {
        "dir": directory,
        "path_entry_added": bool(added),
        "link_names": [name for name, _captured in placed],
        "link_target": os.path.abspath(shim),
    }
    try:
        _write_ledger(ledger_path, payload)
    except OSError as exc:
        _rollback_placed(directory, placed)
        if added:
            try:
                if platform == "nt":
                    current, type_name = store.read()
                    store.write(_win_remove_one(str(current or ""), directory), type_name or "REG_EXPAND_SZ")
                else:
                    _strip_posix_block(_posix_snippet_path(home_base))
                    _strip_source_lines(os.path.join(home_base, ".profile"))
                    _strip_source_lines(os.path.join(home_base, ".bashrc"))
            except OSError:
                pass
        print(f"[{ITSM_PATH_REGISTER_FAILED}] ledger write failed: {exc}")
        return False, ITSM_PATH_REGISTER_FAILED

    print(f"[{ITSM_PATH_REGISTER_OK}] itsm linked in {directory}")
    return True, ITSM_PATH_REGISTER_OK


def _delete_recorded_links(ledger: Mapping[str, Any]) -> None:
    directory = str(ledger.get("dir") or "")
    if not directory:
        return
    for name in ledger.get("link_names") or []:
        if not isinstance(name, str) or not name or os.path.basename(name) != name:
            continue
        if name in (".", ".."):
            continue
        path = os.path.join(directory, name)
        if os.path.lexists(path):
            os.remove(path)


def unregister_itsm_user_path(
    *,
    platform_name: str | None = None,
    home: str | None = None,
    userprofile: str | None = None,
    path_store: Any | None = None,
    only_if_inside: str | None = None,
    quiet_if_noop: bool = False,
    fail_path_write: bool = False,
) -> tuple[bool, str]:
    """Delete recorded links. Drop the PATH directory only when this story appended it."""
    platform = _normalize_itsm_platform(platform_name)
    home_base = _user_base(platform, home, userprofile)
    ledger_path = itsm_path_ledger_path(platform=platform, home=home, userprofile=userprofile)
    ledger = _read_ledger(ledger_path)
    if not ledger:
        if not quiet_if_noop:
            print(f"[{ITSM_PATH_UNREGISTER_OK}] no itsm PATH registration")
        return True, ITSM_PATH_UNREGISTER_OK
    link_target = str(ledger.get("link_target") or "")
    if only_if_inside is not None and not _is_inside(link_target, only_if_inside):
        return True, "ITSM_PATH_UNREGISTER_SKIPPED"

    directory = str(ledger.get("dir") or "")
    added = bool(ledger.get("path_entry_added"))
    try:
        if added and directory:
            if platform == "nt":
                store = path_store if path_store is not None else _HkcuEnvironmentPathStore()
                previous, type_name = store.read()
                previous = "" if previous is None else str(previous)
                type_name = type_name or "REG_EXPAND_SZ"
                if fail_path_write:
                    raise OSError("simulated PATH write failure")
                store.write(_win_remove_one(previous, directory), type_name)
            else:
                if fail_path_write:
                    raise OSError("simulated PATH write failure")
                _strip_posix_block(_posix_snippet_path(home_base))
                _strip_source_lines(os.path.join(home_base, ".profile"))
                _strip_source_lines(os.path.join(home_base, ".bashrc"))
        _delete_recorded_links(ledger)
        if os.path.isfile(ledger_path):
            os.remove(ledger_path)
    except OSError as exc:
        print(f"[{ITSM_PATH_REGISTER_FAILED}] PATH unregister failed: {exc}")
        return False, ITSM_PATH_REGISTER_FAILED

    print(f"[{ITSM_PATH_UNREGISTER_OK}] itsm PATH registration removed")
    return True, ITSM_PATH_UNREGISTER_OK


def dispatch_itsm_path_registration(
    target_root: str,
    *,
    register_flag: str | None = None,
    unregister: bool = False,
    env: Mapping[str, str] | None = None,
    platform_name: str | None = None,
    home: str | None = None,
    userprofile: str | None = None,
    localappdata: str | None = None,
    path_store: Any | None = None,
    is_tty: bool | None = None,
    prompt_fn: Callable[[str], str] | None = None,
    fail_path_write: bool = False,
) -> tuple[int, str | None]:
    """Installer entry. No flag and no env writes nothing."""
    source = env if env is not None else os.environ
    token: str | None = None
    if unregister:
        ok, token = unregister_itsm_user_path(
            platform_name=platform_name,
            home=home,
            userprofile=userprofile,
            path_store=path_store,
            fail_path_write=fail_path_write,
        )
        if not ok:
            return 1, token
        if not resolve_itsm_path_opt_in(register_flag, source):
            return 0, token
    if not resolve_itsm_path_opt_in(register_flag, source):
        return 0, None
    directory, err = resolve_itsm_path_directory(
        register_flag,
        platform=platform_name or ("nt" if os.name == "nt" else "posix"),
        home=home,
        localappdata=localappdata,
        userprofile=userprofile,
        env=source,
        is_tty=is_tty,
        prompt_fn=prompt_fn,
    )
    if err or not directory:
        print(f"[{ITSM_PATH_REGISTER_FAILED}] itsm PATH registration did not complete.")
        return 1, ITSM_PATH_REGISTER_FAILED
    ok, token = register_itsm_user_path(
        target_root,
        directory,
        platform_name=platform_name,
        home=home,
        userprofile=userprofile,
        path_store=path_store,
        fail_path_write=fail_path_write,
    )
    return (0 if ok else 1), token


def uninstall_standalone(
    target_root: str,
    *,
    root_shim: bool = False,
    platform_name: str | None = None,
    home: str | None = None,
    userprofile: str | None = None,
    path_store: Any | None = None,
) -> list[str]:
    target_root = os.path.abspath(target_root)
    unregister_itsm_user_path(
        platform_name=platform_name,
        home=home,
        userprofile=userprofile,
        path_store=path_store,
        only_if_inside=target_root,
        quiet_if_noop=True,
    )
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
