// US-0157 — Node harness for the OpenCode critic hook. Imports the active
// orchestrator under --experimental-strip-types and prints one JSON result.
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pluginPath = join(here, "..", ".opencode", "plugins", "orchestrator.ts");
const scenario = process.argv[2];

function out(obj) {
  process.stdout.write(JSON.stringify(obj));
  process.stdout.write("\n");
}

function mockSession() {
  const calls = [];
  return {
    calls,
    ctx: {
      session: {
        async create(args) {
          calls.push(args);
          return { sessionID: "critic-session-1" };
        },
        async wait() {},
      },
    },
  };
}

const plugin = await import(pathToFileURL(pluginPath).href);

if (scenario === "critic-on") {
  const mock = mockSession();
  const result = await plugin.spawnSovereignCriticHook(mock.ctx, {
    crossModelReview: 1,
    orchestratorSessionId: "parent-session",
    freshContextMarker: "dev-us0157-critic-fresh",
    producerPhaseId: "execute",
  });
  out({
    ok: result.ok,
    spawned: result.spawned,
    reasonCode: result.reasonCode ?? null,
    role: result.evidence?.role ?? null,
    calls: mock.calls,
  });
} else if (scenario === "critic-off") {
  const mock = mockSession();
  const result = await plugin.spawnSovereignCriticHook(mock.ctx, {
    crossModelReview: 0,
    orchestratorSessionId: "parent-session",
    freshContextMarker: "dev-us0157-critic-fresh",
  });
  out({
    ok: result.ok,
    spawned: result.spawned,
    reasonCode: result.reasonCode ?? null,
    calls: mock.calls,
  });
} else if (scenario === "critic-no-critic-key") {
  const mock = mockSession();
  const allowlist = plugin.TASK_ALLOWLIST.filter((role) => role !== "critic");
  const result = await plugin.spawnSovereignCriticHook(mock.ctx, {
    crossModelReview: 1,
    allowlist,
    orchestratorSessionId: "parent-session",
    freshContextMarker: "dev-us0157-critic-fresh",
  });
  out({
    ok: result.ok,
    spawned: result.spawned,
    reasonCode: result.reasonCode ?? null,
    calls: mock.calls,
    matrix: Object.keys(plugin.PHASE_ROLE_MATRIX),
  });
} else if (scenario === "tech-lead-missing") {
  const mock = mockSession();
  const allowlist = plugin.TASK_ALLOWLIST.filter((role) => role !== "tech-lead");
  const result = await plugin.spawnSovereignCriticHook(mock.ctx, {
    crossModelReview: 1,
    allowlist,
    orchestratorSessionId: "parent-session",
    freshContextMarker: "dev-us0157-critic-fresh",
  });
  out({
    ok: result.ok,
    spawned: result.spawned,
    reasonCode: result.reasonCode ?? null,
    calls: mock.calls,
  });
} else if (scenario === "delivery-missing") {
  const allowlist = plugin.TASK_ALLOWLIST.filter((role) => role !== "qa");
  out(plugin.deliveryRoleCapability("qa", allowlist));
} else if (scenario === "parent-no-write") {
  const repair = plugin.parentResumePairDecision({
    ok: false,
    predicate: "strict_proof_hash_invalid",
    reasonCode: "RESUME_BRIEF_UNPARSEABLE",
    writer_role: "dev",
    completed_phase: "execute",
    child_writer_role: "dev",
    child_completed_phase: "execute",
    identity_match: true,
    next_scheduled_phase: "qa",
  });
  const foreign = plugin.parentResumePairDecision({
    ok: false,
    predicate: "strict_proof_hash_invalid",
    reasonCode: "RESUME_BRIEF_UNPARSEABLE",
    writer_role: "qa",
    completed_phase: "execute",
    child_writer_role: "dev",
    child_completed_phase: "execute",
    identity_match: false,
  });
  const parent = plugin.parentResumePairDecision({
    ok: false,
    predicate: "unauthorized_writer_role",
    reasonCode: "RESUME_BRIEF_STALE",
    writer_role: "auto",
    completed_phase: "execute",
    child_writer_role: "auto",
    child_completed_phase: "execute",
  });
  out({ repair, foreign, parent });
} else {
  out({ error: "unknown scenario" });
  process.exit(2);
}
