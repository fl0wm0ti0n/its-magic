#!/usr/bin/env node
/**
 * BUG-0024 mock-invoke harness — no live OpenCode CLI TUI probe.
 *
 * Mirrors `.opencode/plugins/its-magic-auto/tui.ts` `dispatchRunAutoLifecycle`
 * limb order + stage codes (R-0140 / # BUG-0024). Also mirrors register-skip
 * observability for orchestrator emitAutoTuiRegisterSkipped.
 *
 * Usage: node tests/bug0024_dispatch_harness.mjs <scenario>
 * Scenarios:
 *   missing-client | unbranded-defined | register-skipped |
 *   make-unreachable | swallowed-rpc | branded-client-rpc | rpc-absent-make
 */
const DISPATCH_UNSUPPORTED = "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED";
const MISSING_CLIENT = "OPENCODE_AUTO_TUI_MISSING_CLIENT";
const RPC_ABSENT = "OPENCODE_AUTO_TUI_RPC_ABSENT";
const DEFINED_UNBRANDED = "OPENCODE_AUTO_TUI_DEFINED_UNBRANDED";
const MAKE_UNREACHABLE = "OPENCODE_AUTO_TUI_MAKE_UNREACHABLE";
const REGISTER_SKIPPED = "OPENCODE_AUTO_TUI_REGISTER_SKIPPED";

function resolveClientBaseUrl(client) {
  const raw =
    client?.baseUrl ?? client?.config?.baseUrl ?? client?.defaults?.baseUrl;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return undefined;
}

export async function dispatchRunAutoLifecycle(context, input, deps = {}) {
  const calls = deps.calls ?? { rpc: [], make: [], post: [], toasts: [] };
  const toast = (code) => {
    calls.toasts.push(code);
  };
  const client = context?.client ?? context?.api?.client;
  if (!client) {
    toast(MISSING_CLIENT);
    return { ok: false, reasonCode: MISSING_CLIENT, calls };
  }

  const payload = {
    sessionID:
      typeof context?.sessionID === "string" ? context.sessionID : undefined,
    prompt: typeof input === "string" ? input : undefined,
  };

  let Defined;
  let peerBranded = false;
  try {
    const imported = await deps.importDefined();
    Defined = imported?.Defined ?? imported;
    peerBranded = imported?.peerBranded === true;
  } catch {
    toast(DISPATCH_UNSUPPORTED);
    return { ok: false, reasonCode: DISPATCH_UNSUPPORTED, calls };
  }
  if (!Defined) {
    toast(DISPATCH_UNSUPPORTED);
    return { ok: false, reasonCode: DISPATCH_UNSUPPORTED, calls };
  }
  if (!peerBranded) {
    toast(DEFINED_UNBRANDED);
    return { ok: false, reasonCode: DEFINED_UNBRANDED, calls };
  }

  if (typeof client.rpc === "function") {
    try {
      const rpc = client.rpc(Defined);
      if (rpc && typeof rpc.runAutoLifecycle === "function") {
        calls.rpc.push({ defined: Defined, payload });
        const result = await rpc.runAutoLifecycle(payload);
        return { ...(result ?? { ok: true }), calls, invoked: "client.rpc" };
      }
    } catch (err) {
      calls.rpc.push({ error: String(err?.message ?? err) });
      // fall through to make — stage before umbrella
    }
  } else {
    toast(RPC_ABSENT);
  }

  const baseUrl = resolveClientBaseUrl(client);
  if (!baseUrl) {
    toast(MAKE_UNREACHABLE);
    return { ok: false, reasonCode: MAKE_UNREACHABLE, calls };
  }

  try {
    const OpenCode = await deps.importOpenCode();
    if (OpenCode && typeof OpenCode.make === "function") {
      calls.make.push({ baseUrl });
      const httpClient = OpenCode.make({ baseUrl });
      if (httpClient && typeof httpClient.rpc === "function") {
        const rpc = httpClient.rpc(Defined);
        if (rpc && typeof rpc.runAutoLifecycle === "function") {
          calls.rpc.push({ defined: Defined, payload, via: "OpenCode.make" });
          const result = await rpc.runAutoLifecycle(payload);
          return {
            ...(result ?? { ok: true }),
            calls,
            invoked: "OpenCode.make",
          };
        }
      }
    }
  } catch {
    // fail closed
  }

  if (typeof client.post === "function") {
    calls.post.push({ ignored: true });
  }

  toast(DISPATCH_UNSUPPORTED);
  return { ok: false, reasonCode: DISPATCH_UNSUPPORTED, calls };
}

/** Mirror emitAutoTuiRegisterSkipped observability (not silent). */
export function emitRegisterSkipped(ctx = {}) {
  const reasonCode = REGISTER_SKIPPED;
  const message = `register absent ${reasonCode}`;
  if (typeof ctx?.session?.error === "function") {
    ctx.session.error({ message, reasonCode, level: "error" });
    return { emitted: true, channel: "session-notice", reasonCode };
  }
  ctx.__itsMagicAutoTuiRegisterSkipped = { reasonCode, message };
  return { emitted: true, channel: "setup-session-error", reasonCode };
}

const BRANDED = {
  Defined: {
    id: "its-magic.auto",
    methods: { runAutoLifecycle: { input: {}, output: {} } },
    __itsMagicPeerBranded: true,
  },
  peerBranded: true,
};

const UNBRANDED = {
  Defined: {
    id: "its-magic.auto",
    methods: { runAutoLifecycle: { input: {}, output: {} } },
  },
  peerBranded: false,
};

async function runScenario(name) {
  if (name === "missing-client") {
    const calls = { rpc: [], make: [], post: [], toasts: [] };
    return dispatchRunAutoLifecycle(
      { api: {} },
      "go",
      { importDefined: async () => BRANDED, calls },
    );
  }
  if (name === "unbranded-defined") {
    const calls = { rpc: [], make: [], post: [], toasts: [] };
    return dispatchRunAutoLifecycle(
      {
        sessionID: "sess-u",
        client: {
          rpc() {
            return {
              async runAutoLifecycle() {
                return { ok: true };
              },
            };
          },
        },
      },
      "go",
      { importDefined: async () => UNBRANDED, calls },
    );
  }
  if (name === "register-skipped") {
    const notices = [];
    const ctx = {
      session: {
        error(payload) {
          notices.push(payload);
        },
      },
    };
    const emission = emitRegisterSkipped(ctx);
    return {
      ok: false,
      reasonCode: emission.reasonCode,
      emitted: emission.emitted,
      channel: emission.channel,
      notices,
      marker: ctx.__itsMagicAutoTuiRegisterSkipped,
    };
  }
  if (name === "make-unreachable") {
    const calls = { rpc: [], make: [], post: [], toasts: [] };
    return dispatchRunAutoLifecycle(
      {
        client: {
          // no .rpc, no baseUrl — never invent localhost
          post: async () => ({ ok: true }),
        },
      },
      "go",
      { importDefined: async () => BRANDED, calls },
    );
  }
  if (name === "swallowed-rpc") {
    const calls = { rpc: [], make: [], post: [], toasts: [] };
    return dispatchRunAutoLifecycle(
      {
        client: {
          rpc() {
            throw new Error("rpc blew up");
          },
          // no baseUrl → MAKE_UNREACHABLE (stage), not DISPATCH alone
        },
      },
      "go",
      { importDefined: async () => BRANDED, calls },
    );
  }
  if (name === "branded-client-rpc") {
    const calls = { rpc: [], make: [], post: [], toasts: [] };
    return dispatchRunAutoLifecycle(
      {
        sessionID: "sess-1",
        client: {
          rpc(defined) {
            return {
              async runAutoLifecycle(payload) {
                return {
                  ok: true,
                  reasonCode: "ok",
                  payload,
                  definedId: defined.id,
                };
              },
            };
          },
        },
      },
      "go",
      { importDefined: async () => BRANDED, calls },
    );
  }
  if (name === "rpc-absent-make") {
    const calls = { rpc: [], make: [], post: [], toasts: [] };
    return dispatchRunAutoLifecycle(
      {
        sessionID: "sess-2",
        client: {
          baseUrl: "http://connected.example:4096",
        },
      },
      "go",
      {
        importDefined: async () => BRANDED,
        calls,
        importOpenCode: async () => ({
          make({ baseUrl }) {
            return {
              rpc(defined) {
                return {
                  async runAutoLifecycle(payload) {
                    return {
                      ok: true,
                      reasonCode: "ok",
                      payload,
                      definedId: defined.id,
                      baseUrl,
                    };
                  },
                };
              },
            };
          },
        }),
      },
    );
  }
  throw new Error(`unknown scenario: ${name}`);
}

const scenario = process.argv[2];
if (scenario) {
  runScenario(scenario)
    .then((out) => {
      process.stdout.write(JSON.stringify(out));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
