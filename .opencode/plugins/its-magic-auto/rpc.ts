// BUG-0023 — shared Rpc.define contract (TUI dispatch + orchestrator register).
// BUG-0024 — peer-brand signal for TUI happy path (R-0140 / # BUG-0024).
// Import specifier LOCKED: @opencode/plugin/rpc (JSON Schema, no Zod).
// Optional alias @opencode-ai/plugin/rpc is probe-only — do not dual-import as
// the happy path. Unresolved specifier uses a local define so orchestrator
// editor.add still loads; TUI dispatch requires peer brand (DEFINED_UNBRANDED
// when local-only). Cite R-0137 / R-0140 / architecture # BUG-0023 / # BUG-0024.

type RpcDefine = { define: (spec: unknown) => unknown };

function localRpcDefine(spec: unknown): unknown {
  return spec;
}

let Rpc: RpcDefine = { define: localRpcDefine };
/** True only when `@opencode/plugin/rpc` Rpc.define branded the Defined object. */
export let ITS_MAGIC_AUTO_RPC_PEER_BRANDED = false;

try {
  // Host-true specifier (LOCKED). Static equivalent: import { Rpc } from "@opencode/plugin/rpc"
  // @ts-ignore — optional peer provided by the OpenCode host
  const mod: { Rpc?: RpcDefine } = await import("@opencode/plugin/rpc");
  if (mod?.Rpc && typeof mod.Rpc.define === "function") {
    Rpc = mod.Rpc;
    ITS_MAGIC_AUTO_RPC_PEER_BRANDED = true;
  }
} catch {
  // keep local define — kit/orchestrator must still load without the peer
  ITS_MAGIC_AUTO_RPC_PEER_BRANDED = false;
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

// Detectable brand mark for tests / TUI gate (compose with PEER_BRANDED bool).
if (
  ITS_MAGIC_AUTO_RPC_PEER_BRANDED &&
  ITS_MAGIC_AUTO_RPC &&
  typeof ITS_MAGIC_AUTO_RPC === "object"
) {
  try {
    Object.defineProperty(ITS_MAGIC_AUTO_RPC as object, "__itsMagicPeerBranded", {
      value: true,
      enumerable: false,
      configurable: true,
    });
  } catch {
    // ignore — boolean export remains authoritative
  }
}
