#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const STANDALONE_REL = path.join(".its-magic", "standalone");
const CLI_REL = path.join(STANDALONE_REL, "apps", "cli", "src", "index.ts");

function hasRuntime(root) {
  return fs.existsSync(path.join(root, CLI_REL));
}

function findProjectRoot(start) {
  let current = path.resolve(start);
  for (let depth = 0; depth <= 16; depth += 1) {
    if (hasRuntime(current)) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

const configuredRoot = String(process.env.ITSM_PROJECT_ROOT || "").trim();
const projectRoot = configuredRoot
  ? path.resolve(configuredRoot)
  : findProjectRoot(process.cwd());

if (!projectRoot || !hasRuntime(projectRoot)) {
  const checked = configuredRoot ? path.resolve(configuredRoot) : process.cwd();
  console.error(
    `[ITSM_RUNTIME_NOT_FOUND] No installed standalone runtime found from ${checked}. ` +
      "Run: its-magic --target <repo> --mode upgrade --host both"
  );
  process.exit(1);
}

const standaloneRoot = path.join(projectRoot, STANDALONE_REL);
const cliEntry = path.join(projectRoot, CLI_REL);
const result = spawnSync(
  process.execPath,
  ["--experimental-strip-types", cliEntry, ...process.argv.slice(2)],
  {
    cwd: projectRoot,
    env: { ...process.env, ITSM_STANDALONE_ROOT: standaloneRoot },
    stdio: "inherit",
  }
);

if (result.error) {
  console.error(`[ITSM_LAUNCH_FAILED] ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status === null ? 1 : result.status);
