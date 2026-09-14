#!/usr/bin/env node
/**
 * BUG-0023 mock-invoke harness — no live OpenCode CLI TUI probe.
 *
 * Mirrors `.opencode/plugins/its-magic-auto/tui.ts` `dispatchRunAutoLifecycle`:
 * dynamic-import Defined → client.rpc(Defined).runAutoLifecycle(payload)
 * else OpenCode.make({ baseUrl }).rpc(Defined). Invented POST is not a path.
 *
 * Usage: node tests/bug0023_dispatch_harness.mjs <scenario>
 * Scenarios: client-rpc | make-fallback | absent-rpc | missing-client | post-ignored
 */
const DISPATCH_UNSUPPORTED = "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED";

function resolveClientBaseUrl(client) {
  const raw =
    client?.baseUrl ?? client?.config?.baseUrl ?? client?.defaults?.baseUrl;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return undefined;
}

export async function dispatchRunAutoLifecycle(context, input, deps = {}) {
  const calls = deps.calls ?? { rpc: [], make: [], post: [] };
  const client = context?.client ?? context?.api?.client;
  if (!client) {
    return { ok: false, reasonCode: DISPATCH_UNSUPPORTED, calls };
  }

  const payload = {
    sessionID:
      typeof context?.sessionID === "string" ? context.sessionID : undefined,
    prompt: typeof input === "string" ? input : undefined,
  };

  let Defined;
  try {
    Defined = await deps.importDefined();
  } catch {
    return { ok: false, reasonCode: DISPATCH_UNSUPPORTED, calls };
  }
  if (!Defined) {
    return { ok: false, reasonCode: DISPATCH_UNSUPPORTED, calls };
  }

  if (typeof client.rpc === "function") {
    try {
      const rpc = client.rpc(Defined);
      if (rpc && typeof rpc.runAutoLifecycle === "function") {
        calls.rpc.push({ defined: Defined, payload });
        const result = await rpc.runAutoLifecycle(payload);
        return { ...(result ?? { ok: true }), calls, invoked: "client.rpc" };
      }
    } catch {
      // fall through to OpenCode.make
    }
  }

  const baseUrl = resolveClientBaseUrl(client);
  if (baseUrl) {
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
  }

  if (typeof client.post === "function") {
    calls.post.push({ ignored: true });
  }

  return { ok: false, reasonCode: DISPATCH_UNSUPPORTED, calls };
}

const DEFINED = {
  id: "its-magic.auto",
  methods: { runAutoLifecycle: { input: {}, output: {} } },
};

async function runScenario(name) {
  const importDefined = async () => DEFINED;
  if (name === "client-rpc") {
    const calls = { rpc: [], make: [], post: [] };
    const result = await dispatchRunAutoLifecycle(
      {
        sessionID: "sess-1",
        client: {
          rpc(defined) {
            return {
              async runAutoLifecycle(payload) {
                return { ok: true, reasonCode: "ok", payload, definedId: defined.id };
              },
            };
          },
          post() {
            throw new Error("invented POST must not run");
          },
        },
      },
      "go",
      { importDefined, calls },
    );
    return result;
  }
  if (name === "make-fallback") {
    const calls = { rpc: [], make: [], post: [] };
    const result = await dispatchRunAutoLifecycle(
      {
        sessionID: "sess-2",
        client: {
          baseUrl: "http://connected.example:4096",
          post() {
            throw new Error("invented POST must not run");
          },
        },
      },
      "go",
      {
        importDefined,
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
    return result;
  }
  if (name === "absent-rpc") {
    const calls = { rpc: [], make: [], post: [] };
    return dispatchRunAutoLifecycle(
      { client: { post: async () => ({ ok: true }) } },
      "go",
      { importDefined, calls, importOpenCode: async () => ({}) },
    );
  }
  if (name === "missing-client") {
    const calls = { rpc: [], make: [], post: [] };
    return dispatchRunAutoLifecycle({}, "go", { importDefined, calls });
  }
  if (name === "post-ignored") {
    const calls = { rpc: [], make: [], post: [] };
    return dispatchRunAutoLifecycle(
      {
        client: {
          post: async () => ({ ok: true, via: "invented-post" }),
        },
      },
      "go",
      { importDefined, calls },
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
