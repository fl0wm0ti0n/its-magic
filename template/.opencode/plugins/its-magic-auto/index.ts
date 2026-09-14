// BUG-0019 — TUI slash listing sibling (discovery entry only).
// Execute owner remains .opencode/plugins/orchestrator.ts plugin-command
// `execute` → `runAutoLifecycle` (do not register a second auto command here).
// Cite R-0124 / architecture # BUG-0019.

type PluginDefineFn = (spec: any) => any;
let Plugin: { define: PluginDefineFn } = {
  define(spec: any) {
    return spec;
  },
};
try {
  // @ts-ignore — optional peer dependency (auto-discovered by the OpenCode host)
  const mod: { Plugin?: { define: PluginDefineFn } } = await import(
    "@opencode-ai/plugin"
  );
  if (mod && typeof mod.Plugin?.define === "function") {
    Plugin = { define: mod.Plugin.define.bind(mod.Plugin) };
  }
} catch {
  try {
    // @ts-ignore — public v2 docs use @opencode/plugin
    const mod2: { Plugin?: { define: PluginDefineFn } } = await import(
      "@opencode/plugin"
    );
    if (mod2 && typeof mod2.Plugin?.define === "function") {
      Plugin = { define: mod2.Plugin.define.bind(mod2.Plugin) };
    }
  } catch {
    // keep the local shim — module stays loadable without the peer dep.
  }
}

const plugin = Plugin.define({
  id: "its-magic.auto",
  setup(_ctx: any) {
    // Discovery-only server entry so project `.opencode/plugins/its-magic-auto/`
    // loads. Do not register command.transform or a second auto command here.
    return {
      listingSurface: "tui",
      executeOwner: "its-magic.orchestrator",
    };
  },
});

export default plugin;
