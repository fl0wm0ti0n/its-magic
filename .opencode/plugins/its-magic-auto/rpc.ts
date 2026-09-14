// BUG-0023 — shared Rpc.define contract (TUI dispatch + orchestrator register).
// Import specifier LOCKED: @opencode/plugin/rpc (JSON Schema, no Zod).
// Optional alias @opencode-ai/plugin/rpc is probe-only — do not dual-import as
// the happy path. Unresolved specifier uses a local define so orchestrator
// editor.add still loads; TUI dispatch fail-closes DISPATCH if Defined cannot
// be used. Cite R-0137 / architecture # BUG-0023.

type RpcDefine = { define: (spec: unknown) => unknown };

function localRpcDefine(spec: unknown): unknown {
  return spec;
}

let Rpc: RpcDefine = { define: localRpcDefine };

try {
  // Host-true specifier (LOCKED). Static equivalent: import { Rpc } from "@opencode/plugin/rpc"
  // @ts-ignore — optional peer provided by the OpenCode host
  const mod: { Rpc?: RpcDefine } = await import("@opencode/plugin/rpc");
  if (mod?.Rpc && typeof mod.Rpc.define === "function") {
    Rpc = mod.Rpc;
  }
} catch {
  // keep local define — kit/orchestrator must still load without the peer
}

const RUN_AUTO_LIFECYCLE_INPUT = {
  type: "object",
  properties: {
    sessionID: { type: "string" },
    prompt: { type: "string" },
    delivery: { type: "string" },
  },
  additionalProperties: false,
};

const RUN_AUTO_LIFECYCLE_OUTPUT = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
    reasonCode: { type: "string" },
    sessionID: { type: "string" },
    phase_id: { type: "string" },
    cycles: { type: "number" },
  },
  required: ["ok"],
  additionalProperties: true,
};

export const ITS_MAGIC_AUTO_RPC = Rpc.define({
  id: "its-magic.auto",
  methods: {
    runAutoLifecycle: {
      input: RUN_AUTO_LIFECYCLE_INPUT,
      output: RUN_AUTO_LIFECYCLE_OUTPUT,
    },
  },
});
