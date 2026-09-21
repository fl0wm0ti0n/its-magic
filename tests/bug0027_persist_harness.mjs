#!/usr/bin/env node
/**
 * BUG-0027 mock-ctx harness — no live OpenCode CLI TUI probe.
 *
 * Exercises persistManualPhaseIsolation / persistIsolationViaPython /
 * runAutoLifecycleRpc against fakes. Usage:
 *   node --experimental-strip-types tests/bug0027_persist_harness.mjs <scenario>
 */
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const PLUGIN_PATH = join(REPO_ROOT, ".opencode", "plugins", "orchestrator.ts");

const scenario = process.argv[2];

function out(obj) {
  process.stdout.write(JSON.stringify(obj));
  process.stdout.write("\n");
}

async function main() {
  const plugin = await import(pathToFileURL(PLUGIN_PATH).href);
  plugin.__resetAutoMutexForTests?.();
  plugin.__resetManualPhasePersistForTests?.();

  if (scenario === "static-info") {
    out({
      reasonCodes: plugin.REASON_CODES,
      hasPersistManualPhaseIsolation:
        typeof plugin.persistManualPhaseIsolation === "function",
      hasRunAutoLifecycleRpc: typeof plugin.runAutoLifecycleRpc === "function",
      manualPhaseCommandNames: plugin.MANUAL_PHASE_COMMAND_NAMES,
      placeholder: plugin.PLACEHOLDER_PARENT_ID,
    });
    return;
  }

  if (scenario === "manual-execute-persist") {
    const captured = [];
    const r = plugin.persistManualPhaseIsolation(
      {},
      {
        type: "command.executed",
        name: "execute",
        sessionID: "sess-real-parent",
        arguments: {
          storyId: "US-0001",
          sprintId: "S0160",
          orchestratorRunId: "auto-20260921-bug0027",
          bugId: "BUG-0027",
        },
      },
      {
        persistIsolationFn: (evidence) => {
          captured.push(evidence);
          return { ok: true };
        },
      },
    );
    out({
      ok: r.ok,
      reasonCode: r.reasonCode ?? null,
      evidence: r.evidence ?? captured[0] ?? null,
      capturedCount: captured.length,
    });
    return;
  }

  if (scenario === "denied-persist") {
    const r = plugin.persistManualPhaseIsolation(
      {},
      {
        type: "command.executed",
        name: "execute",
        sessionID: "sess-real-parent",
        arguments: {
          storyId: "US-0001",
          sprintId: "S0160",
          orchestratorRunId: "auto-20260921-bug0027",
        },
      },
      {
        persistIsolationFn: () => ({
          ok: false,
          reasonCode: plugin.REASON_CODES.MANUAL_PHASE_PERSIST_DENIED,
        }),
      },
    );
    out({ ok: r.ok, reasonCode: r.reasonCode ?? null });
    return;
  }

  if (scenario === "rpc-forward") {
    const forwarded = [];
    const r = await plugin.runAutoLifecycleRpc(
      {
        session: { create: async () => ({ sessionID: "child-1" }) },
        command: { transform() {} },
      },
      {
        sessionID: "sess-rpc",
        prompt: "go",
        storyId: "US-0001",
        sprintId: "S0160",
        orchestratorRunId: "run-rpc-1",
        bugId: "BUG-0027",
      },
    );
    // Direct inspect via spawnPhase path: re-run with injected spawn
    plugin.__resetAutoMutexForTests?.();
    const r2 = await plugin.runAutoLifecycle(
      { session: { create: async () => ({ sessionID: "child-2" }) } },
      {
        orchestratorSessionId: "sess-rpc",
        prompt: "go",
        startFrom: "execute",
        storyId: "US-0001",
        sprintId: "S0160",
        orchestratorRunId: "run-rpc-1",
        bugId: "BUG-0027",
        attachSupported: true,
        persistIsolationFn: () => ({ ok: true }),
        spawnPhaseFn: async (_ctx, args) => {
          forwarded.push(args);
          return {
            ok: true,
            sessionID: "child-2",
            evidence: {
              parentID: args.orchestratorSessionId,
              sessionID: "child-2",
              role: "dev",
              phase_id: args.phaseId,
              timestamp: "2026-09-21T21:40:00Z",
              fresh_context_marker: args.freshContextMarker,
              storyId: args.storyId,
              sprintId: args.sprintId,
              orchestratorRunId: args.orchestratorRunId,
              bugId: args.bugId,
            },
          };
        },
        dispatchStopMatrixFn: () => ({
          ok: true,
          action: "stop",
          next_phase: null,
          stop_reason: "completed",
        }),
      },
    );
    const src = await import("node:fs").then((fs) =>
      fs.readFileSync(PLUGIN_PATH, "utf8"),
    );
    out({
      rpcMissingSessionOk: r.ok,
      rpcMissingUsedTuiAuto: /sessionID \?\? "tui-auto"/.test(src),
      rpcForwardsIds: /storyId: input.storyId/.test(src),
      lifecycleOk: r2.ok,
      forwarded: forwarded[0] ?? null,
    });
    return;
  }

  if (scenario === "tui-auto-rejected") {
    const written = [];
    const asParent = plugin.persistIsolationViaPython(
      {
        parentID: "tui-auto",
        sessionID: "child-x",
        role: "dev",
        phase_id: "execute",
        timestamp: "2026-09-21T21:40:00Z",
        fresh_context_marker: "fresh",
        orchestratorRunId: "run-1",
      },
      {
        persistIsolationFn: (ev) => {
          written.push(ev);
          return { ok: true };
        },
      },
    );
    const asRun = plugin.persistManualPhaseIsolation(
      {},
      {
        name: "execute",
        sessionID: "sess-real",
        arguments: { orchestratorRunId: "tui-auto" },
      },
      {
        persistIsolationFn: (ev) => {
          written.push(ev);
          return { ok: true };
        },
      },
    );
    const rpc = await plugin.runAutoLifecycleRpc({
      sessionID: "tui-auto",
      prompt: "go",
    });
    out({
      parentOk: asParent.ok,
      parentCode: asParent.reasonCode,
      runOk: asRun.ok,
      runCode: asRun.reasonCode,
      rpcOk: rpc.ok,
      rpcCode: rpc.reasonCode,
      writtenCount: written.length,
    });
    return;
  }

  if (scenario === "context-missing") {
    const r = plugin.persistManualPhaseIsolation(
      {},
      { name: "execute", sessionID: "sess-real" },
      {
        bridgeSpawnFn: () => ({
          status: 0,
          stdout: JSON.stringify({
            ok: true,
            storyId: "",
            sprintId: "",
            orchestratorRunId: "",
            bugId: "",
          }),
          stderr: "",
        }),
        persistIsolationFn: () => ({ ok: true }),
      },
    );
    out({
      ok: r.ok,
      reasonCode: r.reasonCode ?? null,
      evidence: r.evidence ?? null,
      hasProofId: Boolean(r.evidence?.runtime_proof_id || r.runtime_proof_id),
      hasProofHash: Boolean(r.evidence?.proof_hash || r.proof_hash),
    });
    return;
  }

  out({ error: "unknown scenario: " + scenario });
  process.exit(1);
}

main().catch((err) => {
  process.stderr.write(String(err && err.stack ? err.stack : err));
  process.exit(1);
});
