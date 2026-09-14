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
// http://localhost:4096. DISPATCH toast only when client/RPC truly absent.
// Cite R-0137 / architecture # BUG-0023.
// Compose-only vs test_bug0021: "api.client.rpc" in src is not dispatch proof.

const LISTING_UNSUPPORTED = "OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED";
const DISPATCH_UNSUPPORTED = "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED";
const LOAD_UNSUPPORTED = "OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED";
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

/**
 * Invoke server `runAutoLifecycle` without Command.Info template expansion.
 * Prefer api.client.rpc(ITS_MAGIC_AUTO_RPC) → runAutoLifecycle(payload).
 * Else OpenCode.make({ baseUrl }).rpc(Defined). Never invented POST { input }.
 * Never the SessionPrompt command API or session-command template expansion.
 *
 * LOAD_UNSUPPORTED cannot toast from this module if tui() never runs (#36505).
 */
export async function dispatchRunAutoLifecycle(
  context: any,
  input?: string,
): Promise<{ ok: boolean; reasonCode?: string }> {
  const client = context?.client ?? context?.api?.client;
  if (!client) {
    toast(context, DISPATCH_UNSUPPORTED);
    return { ok: false, reasonCode: DISPATCH_UNSUPPORTED };
  }

  const payload = {
    sessionID:
      typeof context?.sessionID === "string"
        ? context.sessionID
        : undefined,
    prompt: typeof input === "string" ? input : undefined,
  };

  let Defined: unknown;
  try {
    const rpcMod = await import("./rpc.ts");
    Defined = rpcMod.ITS_MAGIC_AUTO_RPC;
  } catch {
    toast(context, DISPATCH_UNSUPPORTED);
    return { ok: false, reasonCode: DISPATCH_UNSUPPORTED };
  }
  if (!Defined) {
    toast(context, DISPATCH_UNSUPPORTED);
    return { ok: false, reasonCode: DISPATCH_UNSUPPORTED };
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
    } catch {
      // fall through to OpenCode.make HTTP client.rpc(Defined)
    }
  }

  const baseUrl = resolveClientBaseUrl(client);
  if (baseUrl) {
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
      // fail closed below — DISPATCH is the defect if this is the happy path
    }
  }

  toast(context, DISPATCH_UNSUPPORTED);
  return { ok: false, reasonCode: DISPATCH_UNSUPPORTED };
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
export { LISTING_UNSUPPORTED, DISPATCH_UNSUPPORTED, LOAD_UNSUPPORTED, AUTO_DESCRIPTION };
