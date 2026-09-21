// BUG-0021 — CLI TUI file-plugin shape for `/auto`.
// Loader `readV1Plugin(..., "tui")` requires default export `{ id, tui }`
// with `typeof tui === "function"`: "must default export an object with tui()".
// `Plugin.define({ setup })` is skipped (BUG-0020 C-limb live-falsified).
// Cite R-0134 / architecture # BUG-0021. Compose BUG-0019 E* keymap strings.
// Keep `@opencode/plugin/tui` as a comment (0019 string contract) — do not
// hard-require Plugin.define at runtime for the TUI default.
// Live docs:
// https://opencode.ai/v2/docs/build/plugins/cli/
// https://opencode.ai/v2/docs/cli/plugins
// https://opencode.ai/v2/docs/build/plugins/rpc/
// Public CLI Plugin.define from `@opencode/plugin/tui` is the *server/CLI*
// shape, not the tui.json file-plugin loader.
//
// BUG-0023 — dispatch: dynamic-import ITS_MAGIC_AUTO_RPC from ./rpc.ts inside
// dispatchRunAutoLifecycle (not top-level). Happy path is api.client.rpc(Defined)
// → runAutoLifecycle(payload), else OpenCode.make({ baseUrl }).rpc(Defined).
// Invented POST /rpc/… { input } is not the happy path. Do not silent-default
// http://localhost:4096. Cite R-0137 / architecture # BUG-0023.
//
// BUG-0024 — live residual: TUI happy path requires peer-branded Defined;
// stage-distinct OPENCODE_* before umbrella DISPATCH. Cite R-0140 / # BUG-0024.
// Compose-only vs test_bug0021: "api.client.rpc" in src is not dispatch proof.

const LISTING_UNSUPPORTED = "OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED";
const DISPATCH_UNSUPPORTED = "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED";
const LOAD_UNSUPPORTED = "OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED";
const MISSING_CLIENT = "OPENCODE_AUTO_TUI_MISSING_CLIENT";
const RPC_ABSENT = "OPENCODE_AUTO_TUI_RPC_ABSENT";
const DEFINED_UNBRANDED = "OPENCODE_AUTO_TUI_DEFINED_UNBRANDED";
const MAKE_UNREACHABLE = "OPENCODE_AUTO_TUI_MAKE_UNREACHABLE";
const AUTO_DESCRIPTION =
  "its-magic auto: orchestrator dispatch entry (spawn-only).";

type TuiPlugin = (
  api: any,
  options?: any,
  meta?: any,
) => void | Promise<void>;

function toast(context: any, message: string, variant = "error"): void {
  const ui = context?.ui ?? context?.api?.ui;
  const show = ui?.toast?.show ?? ui?.toast;
  if (typeof show === "function") {
    try {
      show.call(ui.toast ?? ui, {
        title: "its-magic /auto",
        message,
        variant,
      });
      return;
    } catch {
      // fall through to console
    }
  }
  try {
    console.error(message);
  } catch {
    // ignore
  }
}

function resolveClientBaseUrl(client: any): string | undefined {
  const raw =
    client?.baseUrl ?? client?.config?.baseUrl ?? client?.defaults?.baseUrl;
  if (typeof raw === "string" && raw.trim()) {
    return raw.trim();
  }
  return undefined;
}

function failStage(
  context: any,
  reasonCode: string,
): { ok: false; reasonCode: string } {
  toast(context, reasonCode);
  return { ok: false, reasonCode };
}

/**
 * Invoke server `runAutoLifecycle` without Command.Info template expansion.
 * Limb order (BUG-0024 / R-0140):
 * 1. Resolve client (api.client / context.client) → MISSING_CLIENT
 * 2. Dynamic-import Defined; peer-unbranded → DEFINED_UNBRANDED
 * 3. client.rpc(Defined).runAutoLifecycle(payload) when .rpc present
 * 4. Else emit RPC_ABSENT (observable) before make limb
 * 5. OpenCode.make({ baseUrl }) only when baseUrl resolvable → else MAKE_UNREACHABLE
 * 6. DISPATCH umbrella only when limbs exhausted
 * Never SessionPrompt / Command.Info template / invented POST / silent localhost.
 */
export async function dispatchRunAutoLifecycle(
  context: any,
  input?: string,
): Promise<{ ok: boolean; reasonCode?: string }> {
  const client = context?.client ?? context?.api?.client;
  if (!client) {
    return failStage(context, MISSING_CLIENT);
  }

  const payload = {
    sessionID:
      typeof context?.sessionID === "string"
        ? context.sessionID
        : undefined,
    prompt: typeof input === "string" ? input : undefined,
  };

  let Defined: unknown;
  let peerBranded = false;
  try {
    const rpcMod = await import("./rpc.ts");
    Defined = rpcMod.ITS_MAGIC_AUTO_RPC;
    peerBranded = rpcMod.ITS_MAGIC_AUTO_RPC_PEER_BRANDED === true;
  } catch {
    return failStage(context, DISPATCH_UNSUPPORTED);
  }
  if (!Defined) {
    return failStage(context, DISPATCH_UNSUPPORTED);
  }
  // TUI success requires peer `@opencode/plugin/rpc` brand (local define is
  // load-safe for orchestrator only — not TUI happy path).
  if (!peerBranded) {
    return failStage(context, DEFINED_UNBRANDED);
  }

  // Prefer api.client.rpc(Defined) → runAutoLifecycle(payload) — not { input }.
  if (typeof client.rpc === "function") {
    try {
      const rpc = client.rpc(Defined);
      if (rpc && typeof rpc.runAutoLifecycle === "function") {
        const result = await rpc.runAutoLifecycle(payload);
        const reason = result?.reasonCode;
        if (reason) toast(context, String(reason), result?.ok ? "success" : "error");
        else if (result?.ok) toast(context, "runAutoLifecycle started", "success");
        return result ?? { ok: true };
      }
      // rpc present but no runAutoLifecycle — fall through to make (not umbrella alone)
    } catch {
      // Swallowed rpc error: fall through to make limb (stage before umbrella).
    }
  } else {
    // Client present but .rpc absent — observable stage before make.
    toast(context, RPC_ABSENT);
  }

  const baseUrl = resolveClientBaseUrl(client);
  if (!baseUrl) {
    // Never invent http://localhost:4096.
    return failStage(context, MAKE_UNREACHABLE);
  }

  try {
    // @ts-ignore — optional peer; HTTP client LOCKED @opencode/client
    const clientMod: { OpenCode?: { make: (opts: { baseUrl: string }) => any } } =
      await import("@opencode/client");
    const OpenCode = clientMod?.OpenCode;
    if (OpenCode && typeof OpenCode.make === "function") {
      const httpClient = OpenCode.make({ baseUrl });
      if (httpClient && typeof httpClient.rpc === "function") {
        const rpc = httpClient.rpc(Defined);
        if (rpc && typeof rpc.runAutoLifecycle === "function") {
          const result = await rpc.runAutoLifecycle(payload);
          const reason = result?.reasonCode;
          if (reason)
            toast(context, String(reason), result?.ok ? "success" : "error");
          else if (result?.ok)
            toast(context, "runAutoLifecycle started", "success");
          return result ?? { ok: true };
        }
      }
    }
  } catch {
    // fail closed below — umbrella only when make limb exhausted
  }

  return failStage(context, DISPATCH_UNSUPPORTED);
}

function registerSlashListing(api: any): boolean {
  const keymap = api?.keymap;
  const command = {
    name: "its-magic.auto",
    title: "/auto",
    description: AUTO_DESCRIPTION,
    desc: AUTO_DESCRIPTION,
    group: "its-magic",
    category: "its-magic",
    palette: true,
    namespace: "palette",
    suggested: true,
    slash: { name: "auto" },
    slashName: "auto",
    run: async (input?: string) =>
      dispatchRunAutoLifecycle({ api, client: api?.client }, input),
  };
  const bindings = [
    { key: "ctrl+shift+a", cmd: "its-magic.auto", desc: AUTO_DESCRIPTION },
  ];

  if (keymap && typeof keymap.registerLayer === "function") {
    keymap.registerLayer({
      commands: [command],
      bindings,
    });
    return true;
  }
  if (keymap && typeof keymap.layer === "function") {
    keymap.layer(() => ({
      mode: "global",
      priority: 10,
      commands: [command],
      bindings,
    }));
    return true;
  }
  return false;
}

export default {
  id: "its-magic.auto.tui",
  tui: async (api, options, meta) => {
    void options;
    void meta;
    if (!registerSlashListing(api)) {
      toast({ api }, LISTING_UNSUPPORTED);
    }
  },
} satisfies { id: string; tui: TuiPlugin };
export {
  LISTING_UNSUPPORTED,
  DISPATCH_UNSUPPORTED,
  LOAD_UNSUPPORTED,
  MISSING_CLIENT,
  RPC_ABSENT,
  DEFINED_UNBRANDED,
  MAKE_UNREACHABLE,
  AUTO_DESCRIPTION,
};
