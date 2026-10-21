// US-0158 — Node harness for same-run recoverable stops. Imports the active
// orchestrator under --experimental-strip-types and prints one JSON result.
import { spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..");
const pluginPath = join(repo, ".opencode", "plugins", "orchestrator.ts");
const driverPath = join(repo, "scripts", "auto_outer_driver.py");
const scenario = process.argv[2];

function out(obj) {
  process.stdout.write(JSON.stringify(obj));
  process.stdout.write("\n");
}

const plugin = await import(pathToFileURL(pluginPath).href);
const driverCalls = [];

function pythonSpawn(pyArgs) {
  driverCalls.push(pyArgs);
  const proc = spawnSync("python", pyArgs, { encoding: "utf8", cwd: repo });
  return {
    status: proc.status ?? 1,
    stdout: proc.stdout ?? "",
    stderr: proc.stderr ?? "",
  };
}

function stopOpts() {
  return { spawnFn: pythonSpawn, pythonBin: "python", driverPath };
}

function scriptedCtx(script) {
  const creates = [];
  let createsN = 0;
  let waits = 0;
  return {
    creates,
    ctx: {
      session: {
        async create(args) {
          creates.push(args);
          createsN += 1;
          if (script.onCreate) {
            const produced = script.onCreate(createsN, args);
            if (produced && produced.throw) throw produced.throw;
            if (produced && Object.prototype.hasOwnProperty.call(produced, "value")) {
              return produced.value;
            }
          }
          return { sessionID: `child-${createsN}` };
        },
        async wait() {
          waits += 1;
          if (script.onWait) return script.onWait(waits);
          return "phase-complete";
        },
      },
    },
  };
}

async function runLifecycle(script, extra = {}) {
  plugin.__resetAutoMutexForTests();
  driverCalls.length = 0;
  const scratch = mkdtempSync(join(tmpdir(), "us0158-"));
  const previous = process.cwd();
  const mock = scriptedCtx(script);
  const markers = [];
  process.chdir(scratch);
  try {
    const result = await plugin.runAutoLifecycle(mock.ctx, {
      orchestratorSessionId: "parent-session",
      prompt: "phase=execute",
      startFrom: extra.startFrom ?? "execute",
      storyId: "US-0158",
      sprintId: "S0182",
      orchestratorRunId: "auto-20261016-us0158",
      freshContextMarker: "dev-us0158-execute-fresh",
      persistIsolationFn: () => ({ ok: true }),
      stopMatrixOpts: stopOpts(),
      maxCycles: 4,
      taskAllowlist: extra.taskAllowlist,
      resolveContinuationFn: () => ({
        ok: true,
        phase_id: extra.startFrom ?? "execute",
        story_id: "US-0158",
        sprint_id: "S0182",
      }),
      spawnPhaseFn: async (ctx, args) => {
        markers.push(args.freshContextMarker);
        return plugin.spawnPhase(ctx, args);
      },
      ...extra.opts,
    });
    return {
      ok: result.ok,
      reasonCode: result.reasonCode ?? null,
      cycles: result.cycles ?? null,
      phase_id: result.phase_id ?? null,
      markers,
      agents: mock.creates.map((call) => call.agent),
      createCount: mock.creates.length,
      driverCalls,
      allowlist: plugin.TASK_ALLOWLIST,
      matrix: plugin.PHASE_ROLE_MATRIX,
    };
  } finally {
    process.chdir(previous);
  }
}

function abortErr() {
  const err = new Error("aborted");
  err.name = "AbortError";
  return err;
}

if (scenario === "continue-aborted") {
  out(
    await runLifecycle({
      onWait(n) {
        if (n === 1) throw abortErr();
        return "phase-complete";
      },
    }),
  );
} else if (scenario === "second-aborted") {
  out(
    await runLifecycle({
      onWait() {
        throw abortErr();
      },
    }),
  );
} else if (scenario === "continue-ai-error") {
  out(
    await runLifecycle({
      onWait(n) {
        if (n === 1) return { reason_code: "ai_error" };
        return "phase-complete";
      },
    }),
  );
} else if (scenario === "continue-blocked") {
  out(
    await runLifecycle({
      onWait(n) {
        if (n === 1) {
          return {
            stop_reason: "blocked",
            reason_code: "needs_input",
            blocked_subcode: "transient",
          };
        }
        return "phase-complete";
      },
    }),
  );
} else if (scenario === "hard-blocked") {
  out(
    await runLifecycle({
      onWait() {
        return { stop_reason: "blocked", blocked_subcode: "isolation" };
      },
    }),
  );
} else if (scenario === "bare-error") {
  out(
    await runLifecycle({
      onWait() {
        return { stop_reason: "error" };
      },
    }),
  );
} else if (scenario === "other-wait") {
  out(
    await runLifecycle({
      onWait() {
        throw new Error("network down");
      },
    }),
  );
} else if (scenario === "continue-permission") {
  const before = plugin.TASK_ALLOWLIST.slice();
  const result = await runLifecycle({
    onCreate(n) {
      if (n === 1) {
        const err = new Error("task denied");
        err.deniedAgent = "critic";
        return { throw: err };
      }
      return null;
    },
  });
  out({ ...result, allowBefore: before, allowAfter: plugin.TASK_ALLOWLIST.slice() });
} else if (scenario === "spawn-unsupported") {
  out(
    await runLifecycle({
      onCreate() {
        return { value: null };
      },
    }),
  );
} else if (scenario === "subtask-ignored") {
  out(
    await runLifecycle({
      onCreate() {
        return { throw: new Error("subagent not found") };
      },
    }),
  );
} else if (scenario === "missing-create") {
  plugin.__resetAutoMutexForTests();
  const scratch = mkdtempSync(join(tmpdir(), "us0158-"));
  const previous = process.cwd();
  process.chdir(scratch);
  try {
    const result = await plugin.runAutoLifecycle(
      { session: {} },
      {
        orchestratorSessionId: "parent-session",
        startFrom: "execute",
        freshContextMarker: "dev-us0158-execute-fresh",
        persistIsolationFn: () => ({ ok: true }),
        stopMatrixOpts: stopOpts(),
        resolveContinuationFn: () => ({ ok: true, phase_id: "execute" }),
        maxCycles: 2,
      },
    );
    out({
      ok: result.ok,
      reasonCode: result.reasonCode ?? null,
      cycles: result.cycles ?? null,
      driverCalls,
    });
  } finally {
    process.chdir(previous);
  }
} else if (scenario === "missing-matrix-role") {
  const allow = plugin.TASK_ALLOWLIST.filter((role) => role !== "dev");
  out(
    await runLifecycle(
      {},
      { taskAllowlist: allow },
    ),
  );
} else if (scenario === "roles") {
  const critic = plugin.planSovereignCriticSpawn({ crossModelReview: 1 });
  const off = plugin.planSovereignCriticSpawn({ crossModelReview: 0 });
  const missingTechLead = plugin.planSovereignCriticSpawn({
    crossModelReview: 1,
    allowlist: plugin.TASK_ALLOWLIST.filter((role) => role !== "tech-lead"),
  });
  const missingQa = plugin.deliveryRoleCapability(
    "qa",
    plugin.TASK_ALLOWLIST.filter((role) => role !== "qa"),
  );
  const denial = plugin.classifyTaskDenial({ deniedAgent: "critic" });
  const matrixMiss = plugin.classifyTaskDenial({
    deniedAgent: "qa",
    allowlist: plugin.TASK_ALLOWLIST.filter((role) => role !== "qa"),
  });
  out({
    allowlist: plugin.TASK_ALLOWLIST,
    matrix: plugin.PHASE_ROLE_MATRIX,
    critic,
    off,
    missingTechLead,
    missingQa,
    denial,
    matrixMiss,
    parent: {
      auto: plugin.continueSamePhaseParentDecision("auto"),
      parent: plugin.continueSamePhaseParentDecision("parent"),
      orchestrator: plugin.continueSamePhaseParentDecision("orchestrator"),
    },
  });
} else if (scenario === "spawn-abort-direct") {
  let waits = 0;
  const result = await plugin.spawnPhase(
    {
      session: {
        async create() {
          return { sessionID: "child-direct" };
        },
        async wait() {
          waits += 1;
          if (waits === 1) throw abortErr();
          return "phase-complete";
        },
      },
    },
    {
      phaseId: "execute",
      prompt: "phase=execute",
      orchestratorSessionId: "parent-session",
      freshContextMarker: "dev-us0158-direct-fresh",
    },
  );
  const other = await plugin.spawnPhase(
    {
      session: {
        async create() {
          return { sessionID: "child-other" };
        },
        async wait() {
          throw new Error("network down");
        },
      },
    },
    {
      phaseId: "execute",
      prompt: "phase=execute",
      orchestratorSessionId: "parent-session",
      freshContextMarker: "dev-us0158-direct-fresh",
    },
  );
  out({
    abort: {
      ok: result.ok,
      reasonCode: result.reasonCode ?? null,
      recoverableClass: result.recoverableClass ?? null,
    },
    other: { ok: other.ok, reasonCode: other.reasonCode ?? null },
  });
} else {
  out({ error: "unknown scenario" });
  process.exit(2);
}
