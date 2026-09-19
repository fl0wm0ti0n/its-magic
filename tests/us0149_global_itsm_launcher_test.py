from __future__ import annotations

import json
import os
from pathlib import Path
import shutil
import subprocess


ROOT = Path(__file__).resolve().parents[1]
LAUNCHER = ROOT / "bin" / "itsm.js"


def _seed_runtime(root: Path) -> Path:
    entry = root / ".its-magic/standalone/apps/cli/src/index.ts"
    entry.parent.mkdir(parents=True)
    entry.write_text(
        """import fs from 'node:fs';
fs.writeFileSync(process.env.ITSM_TEST_OUTPUT, JSON.stringify({
  argv: process.argv.slice(2),
  cwd: process.cwd(),
  standaloneRoot: process.env.ITSM_STANDALONE_ROOT
}));
""",
        encoding="utf-8",
    )
    return entry


def _run_launcher(cwd: Path, output: Path, *args: str, project_root: Path | None = None):
    env = os.environ.copy()
    env["ITSM_TEST_OUTPUT"] = str(output)
    if project_root is not None:
        env["ITSM_PROJECT_ROOT"] = str(project_root)
    else:
        env.pop("ITSM_PROJECT_ROOT", None)
    return subprocess.run(
        ["node", str(LAUNCHER), *args],
        cwd=cwd,
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )


def test_us0149_package_exposes_global_itsm_bin() -> None:
    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    assert package["bin"]["itsm"] == "bin/itsm.js"
    assert "bin/itsm.js" in package["files"]


def test_us0149_launcher_runs_runtime_from_project_root(tmp_path: Path) -> None:
    _seed_runtime(tmp_path)
    output = tmp_path / "result.json"
    result = _run_launcher(tmp_path, output, "status")
    assert result.returncode == 0, result.stderr
    payload = json.loads(output.read_text(encoding="utf-8"))
    assert payload["argv"] == ["status"]
    assert Path(payload["cwd"]).resolve() == tmp_path.resolve()


def test_us0149_launcher_discovers_runtime_from_nested_directory(tmp_path: Path) -> None:
    _seed_runtime(tmp_path)
    nested = tmp_path / "src" / "nested"
    nested.mkdir(parents=True)
    output = tmp_path / "result.json"
    result = _run_launcher(nested, output, "run", "discovery")
    assert result.returncode == 0, result.stderr
    payload = json.loads(output.read_text(encoding="utf-8"))
    assert payload["argv"] == ["run", "discovery"]
    assert Path(payload["cwd"]).resolve() == tmp_path.resolve()


def test_us0149_launcher_honors_user_chosen_project_root(tmp_path: Path) -> None:
    project = tmp_path / "chosen-project"
    elsewhere = tmp_path / "elsewhere"
    elsewhere.mkdir()
    _seed_runtime(project)
    output = tmp_path / "result.json"
    result = _run_launcher(elsewhere, output, "status", project_root=project)
    assert result.returncode == 0, result.stderr
    payload = json.loads(output.read_text(encoding="utf-8"))
    assert Path(payload["cwd"]).resolve() == project.resolve()


def test_us0149_launcher_fails_closed_without_runtime(tmp_path: Path) -> None:
    result = _run_launcher(tmp_path, tmp_path / "unused.json", "status")
    assert result.returncode == 1
    assert "[ITSM_RUNTIME_NOT_FOUND]" in result.stderr
    assert "its-magic --target <repo> --mode upgrade --host both" in result.stderr


def test_us0149_packed_package_contains_launcher_and_bin_mapping(tmp_path: Path) -> None:
    npm = shutil.which("npm")
    assert npm is not None
    result = subprocess.run(
        [npm, "pack", "--dry-run", "--json"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    items = json.loads(result.stdout)
    paths = {row["path"] for row in items[0]["files"]}
    assert "bin/itsm.js" in paths
    assert "template/.its-magic/standalone/apps/cli/src/index.ts" in paths
    assert "template/.its-magic/standalone/packages/runtime-core/src/index.ts" in paths
    assert not any("__pycache__" in item for item in paths)


def test_us0149_publishable_runtime_mirror_matches_source() -> None:
    result = subprocess.run(
        ["python", str(ROOT / "scripts/sync_standalone_template.py"), "--check"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr


def test_us0149_local_global_install_creates_itsm_command(tmp_path: Path) -> None:
    npm = shutil.which("npm")
    assert npm is not None
    pack_dir = tmp_path / "pack"
    prefix = tmp_path / "prefix"
    pack_dir.mkdir()
    packed = subprocess.run(
        [npm, "pack", "--pack-destination", str(pack_dir), "--json"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    assert packed.returncode == 0, packed.stderr or packed.stdout
    tarball = pack_dir / json.loads(packed.stdout)[0]["filename"]
    installed = subprocess.run(
        [npm, "install", "--global", "--ignore-scripts", "--prefix", str(prefix), str(tarball)],
        cwd=tmp_path,
        capture_output=True,
        text=True,
        check=False,
    )
    assert installed.returncode == 0, installed.stderr or installed.stdout
    bin_dir = prefix if os.name == "nt" else prefix / "bin"
    command = bin_dir / ("itsm.cmd" if os.name == "nt" else "itsm")
    assert command.is_file()
    path_value = os.pathsep.join((str(bin_dir), os.environ.get("PATH", "")))
    assert shutil.which("itsm", path=path_value) is not None

    removed = subprocess.run(
        [npm, "uninstall", "--global", "--prefix", str(prefix), "its-magic"],
        cwd=tmp_path,
        capture_output=True,
        text=True,
        check=False,
    )
    assert removed.returncode == 0, removed.stderr or removed.stdout
    assert not command.exists()
