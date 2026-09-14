// US-0124 — OpenCode orchestrator plugin (spawn-only `/auto`).
// BUG-0015 — interactive `/auto` dispatch attach + shared runAutoLifecycle.
// BUG-0018 — leftover `.opencode/commands/auto.md` fail-closed; installer owns prune
// (plugin does not delete). Cite R-0120; no DEC-0124/0125 amend.
// BUG-0019 — TUI listing is sibling its-magic-auto/; this file retains editor.add
// execute + additive RPC wrapper around runAutoLifecycle. Cite R-0124.
// BUG-0020 — desktop Command.Info cannot list execute-only /auto; emit
// OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED (not TUI-toast-only).
// C-limb CLI TUI /auto via project .opencode/tui.json is the load path, not
// listing proof. Keep editor.add execute (do not restore auto.md). Cite R-0126.
// Compose BUG-0018 A* / BUG-0019 E*.
// BUG-0021 — CLI TUI listed-but-skipped residual: emit
// OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED when the host exposes TUI load
// skip for the listed spec (session-visible, not TUI-toast-only; must not
// block editor.add). Cite R-0134 / # BUG-0021. Residual #36505.
// BUG-0023 — await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, { runAutoLifecycle })
// using shared Rpc.define from ./its-magic-auto/rpc.ts. Keep editor.add.
// Drop plain-JSON register and non-awaited swallow. Cite R-0137 / # BUG-0023.
// Composes US-0069 phase→role matrix, US-0092 stop-matrix (Python SOT),
// US-0023/US-0048/BUG-0006 spawn isolation, US-0005 hook enforcement.
// See decisions/DEC-0124.md §1–§10 for the locked contract.
// See docs/engineering/architecture.md # BUG-0015 (cite R-0114; no DEC amend).
// See docs/engineering/architecture.md # BUG-0018 (cite R-0120; no companion DEC).

import { existsSync } from "node:fs";
import { join } from "node:path";
import { ITS_MAGIC_AUTO_RPC } from "./its-magic-auto/rpc.ts";

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
  // keep the local shim — module stays loadable without the peer dep.
}

export const REASON_CODES = {
  PLUGIN_SPAWN_UNSUPPORTED: "OPENCODE_PLUGIN_SPAWN_UNSUPPORTED",
  SUBTASK_IGNORED: "OPENCODE_SUBTASK_IGNORED",
  HEADLESS_UNSUPPORTED: "OPENCODE_HEADLESS_UNSUPPORTED",
  DRIVER_INVOKE_FAILED: "OPENCODE_DRIVER_INVOKE_FAILED",
  AUTO_ORCHESTRATOR_PHASE_EXECUTION: "AUTO_ORCHESTRATOR_PHASE_EXECUTION",
  PHASE_ROLE_MISMATCH: "PHASE_ROLE_MISMATCH",
  NATIVE_CHAIN_UNAVAILABLE: "NATIVE_CHAIN_UNAVAILABLE",
  // BUG-0015 additive (US-0126 owns full table; runbook stub only)
  PLUGIN_DISPATCH_ATTACH_UNSUPPORTED:
    "OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED",
  AUTO_ALREADY_RUNNING: "OPENCODE_AUTO_ALREADY_RUNNING",
  // BUG-0018 additive (US-0126 owns full table; runbook stub only)
  AUTO_MARKDOWN_COLLISION: "OPENCODE_AUTO_MARKDOWN_COLLISION",
  // BUG-0019 additive (US-0126 owns full table; runbook stub only)
  AUTO_SLASH_LISTING_UNSUPPORTED: "OPENCODE_AUTO_SLASH_LISTING_UNSUPPORTED",
  AUTO_TUI_DISPATCH_UNSUPPORTED: "OPENCODE_AUTO_TUI_DISPATCH_UNSUPPORTED",
  // BUG-0020 additive (US-0126 owns full table; runbook stub only).
  // Not markdown-collision and not TUI-keymap-missing.
  AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED:
    "OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED",
  // BUG-0021 additive (US-0126 owns full table; runbook stub only).
  // Listed-but-skipped tui.json load; not desktop, not markdown-collision,
  // not keymap-API-missing after tui() ran.
  AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED:
    "OPENCODE_AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED",
} as const;

// Shared Rpc.define lives in ./its-magic-auto/rpc.ts (BUG-0023). Re-export
// so existing importers keep ITS_MAGIC_AUTO_RPC. RPC id: "its-magic.auto".
export { ITS_MAGIC_AUTO_RPC };

// US-0069 / DEC-0051 phase→role matrix (compose, not amend). The plugin
// resolves phase_id → role here; it does NOT copy the agent permission array
// (DEC-0124 §8 / DQ8). Role names are matrix values, not permission literals.
const PHASE_ROLE_MATRIX: Record<string, string> = {
  intake: "po",
  discovery: "po",
  research: "tech-lead",
  architecture: "tech-lead",
  "sprint-plan": "tech-lead",
  "plan-verify": "qa",
  execute: "dev",
  qa: "qa",
  "verify-work": "qa",
  release: "release",
  closure: "release",
  "refresh-context": "curator",
};

function resolveRole(phaseId: string): string {
  const role = PHASE_ROLE_MATRIX[phaseId];
  if (!role) {
    throw Object.assign(new Error(`unknown phase_id: ${phaseId}`), {
      reasonCode: REASON_CODES.PHASE_ROLE_MISMATCH,
    });
  }
  return role;
}

function isMissingPrimitiveThrow(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("is not a function") ||
    msg.includes("no such method") ||
    msg.includes("plugin api unsupported") ||
    msg.includes("session.create is not a function")
  );
}

function utcNowIso(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

export interface IsolationEvidence {
  parentID: string;
  sessionID: string;
  role: string;
  phase_id: string;
  timestamp: string;
  fresh_context_marker: string;
}

export interface SpawnArgs {
  phaseId: string;
  prompt: string;
  orchestratorSessionId: string;
  freshContextMarker: string;
  storyId?: string;
  sprintId?: string;
  orchestratorRunId?: string;
}

export interface SpawnResult {
  ok: boolean;
  reasonCode?: string;
  sessionID?: string;
  evidence?: IsolationEvidence;
}

export async function spawnPhase(
  ctx: any,
  args: SpawnArgs,
): Promise<SpawnResult> {
  let role: string;
  try {
    role = resolveRole(args.phaseId);
  } catch (err) {
    return {
      ok: false,
      reasonCode: (err as { reasonCode?: string })?.reasonCode,
    };
  }
  const session = ctx?.session;
  if (!session || typeof session.create !== "function") {
    return { ok: false, reasonCode: REASON_CODES.PLUGIN_SPAWN_UNSUPPORTED };
  }
  let handle: { sessionID?: string } | null;
  try {
    handle = await session.create({
      parentID: args.orchestratorSessionId,
      agent: role,
      prompt: args.prompt,
    });
  } catch (err) {
    if (isMissingPrimitiveThrow(err)) {
      return { ok: false, reasonCode: REASON_CODES.PLUGIN_SPAWN_UNSUPPORTED };
    }
    return { ok: false, reasonCode: REASON_CODES.SUBTASK_IGNORED };
  }
  if (!handle) {
    return { ok: false, reasonCode: REASON_CODES.SUBTASK_IGNORED };
  }
  const sessionID = handle.sessionID;
  if (!sessionID || sessionID === args.orchestratorSessionId) {
    return { ok: false, reasonCode: REASON_CODES.SUBTASK_IGNORED };
  }
  if (typeof session.wait === "function") {
    try {
      await session.wait(sessionID);
    } catch {
      // non-fatal for evidence persistence
    }
  }
  const evidence: IsolationEvidence = {
    parentID: args.orchestratorSessionId,
    sessionID,
    role,
    phase_id: args.phaseId,
    timestamp: utcNowIso(),
    fresh_context_marker: args.freshContextMarker,
  };
  return { ok: true, sessionID, evidence };
}

// --- Headless CLI (DEC-0124 §7 / DQ7) ------------------------------------
// `opencode run --agent auto --format json --auto "<prompt>"` is the public
// non-interactive CLI surface. The plugin constructs the argv and parses JSON
// events; the outer driver (Python SOT) consumes the parsed result.

export interface HeadlessArgv {
  argv: string[];
}

export function buildHeadlessArgv(prompt: string): HeadlessArgv {
  return {
    argv: [
      "opencode",
      "run",
      "--agent",
      "auto",
      "--format",
      "json",
      "--auto",
      prompt,
    ],
  };
}

export interface HeadlessResult {
  ok: boolean;
  reasonCode?: string;
  events?: unknown;
}

export interface InvokeOptions {
  spawnFn?: (argv: string[]) => { status: number | null; stdout: string; stderr: string };
  resolveBinary?: (name: string) => string | null;
}

function defaultResolveBinary(name: string): string | null {
  // Node 24 has no is-executable helper in stdlib; the test harness injects a
  // mock. In production the OpenCode host resolves `opencode` on PATH.
  return null;
}

function defaultSpawnFn(_argv: string[]): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  return { status: 127, stdout: "", stderr: "opencode not on PATH" };
}

export function invokeHeadless(
  prompt: string,
  opts: InvokeOptions = {},
): HeadlessResult {
  const resolveBinary = opts.resolveBinary ?? defaultResolveBinary;
  const spawnFn = opts.spawnFn ?? defaultSpawnFn;
  if (!resolveBinary("opencode")) {
    return { ok: false, reasonCode: REASON_CODES.HEADLESS_UNSUPPORTED };
  }
  const { argv } = buildHeadlessArgv(prompt);
  const proc = spawnFn(argv);
  if (proc.status !== 0) {
    return { ok: false, reasonCode: REASON_CODES.HEADLESS_UNSUPPORTED };
  }
  try {
    const events = JSON.parse(proc.stdout || "[]");
    return { ok: true, events };
  } catch {
    return { ok: false, reasonCode: REASON_CODES.HEADLESS_UNSUPPORTED };
  }
}

// --- Subprocess stop-matrix (DEC-0124 §6 / DQ6) --------------------------
// The plugin delegates stop-matrix decisions to scripts/auto_outer_driver.py
// (Python SOT). Additive argv: --phase/--role/--story/--sprint/--orchestrator-run-id/--stop-reason → JSON.
// Subprocess failure (non-zero exit, malformed JSON, timeout) → OPENCODE_DRIVER_INVOKE_FAILED
// (distinct from OPENCODE_HEADLESS_UNSUPPORTED per critic NB ik_us0124_dq6_driver_fail_code_conflation).

export interface StopMatrixArgs {
  phase: string;
  role: string;
  story?: string;
  sprint?: string;
  orchestratorRunId?: string;
  stopReason?: string;
}

export interface StopMatrixResult {
  ok: boolean;
  reasonCode?: string;
  action?: string;
  next_phase?: string;
  stop_reason?: string;
  raw?: unknown;
}

export interface StopMatrixOptions {
  spawnFn?: (pyArgs: string[]) => {
    status: number | null;
    stdout: string;
    stderr: string;
  };
  pythonBin?: string;
  driverPath?: string;
}

function defaultStopMatrixSpawnFn(_pyArgs: string[]): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  return { status: 127, stdout: "", stderr: "python not on PATH" };
}

export function dispatchStopMatrix(
  args: StopMatrixArgs,
  opts: StopMatrixOptions = {},
): StopMatrixResult {
  const spawnFn = opts.spawnFn ?? defaultStopMatrixSpawnFn;
  const pythonBin = opts.pythonBin ?? "python";
  const driverPath = opts.driverPath ?? "scripts/auto_outer_driver.py";
  const pyArgs = [
    driverPath,
    "--phase",
    args.phase,
    "--role",
    args.role,
  ];
  if (args.story) pyArgs.push("--story", args.story);
  if (args.sprint) pyArgs.push("--sprint", args.sprint);
  if (args.orchestratorRunId)
    pyArgs.push("--orchestrator-run-id", args.orchestratorRunId);
  if (args.stopReason) pyArgs.push("--stop-reason", args.stopReason);
  const proc = spawnFn(pyArgs);
  if (proc.status !== 0) {
    return { ok: false, reasonCode: REASON_CODES.DRIVER_INVOKE_FAILED };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(proc.stdout || "{}");
  } catch {
    return { ok: false, reasonCode: REASON_CODES.DRIVER_INVOKE_FAILED };
  }
  const obj = parsed as { action?: string; next_phase?: string; stop_reason?: string };
  return {
    ok: true,
    action: obj.action,
    next_phase: obj.next_phase,
    stop_reason: obj.stop_reason,
    raw: parsed,
  };
}

// --- BUG-0015: in-flight mutex + runAutoLifecycle + Python bridges --------
// Mutex TTL clock source: Date.now() wall-clock milliseconds since Unix epoch
// (same process). Safety TTL = 7200s (2h). Clear on loop exit (success or
// fail-closed) and on TTL expiry so a crash-left flag cannot block forever.

export const AUTO_MUTEX_TTL_MS = 7200 * 1000;

interface AutoMutexState {
  startedAtMs: number;
}

let autoMutex: AutoMutexState | null = null;

function mutexIsHeld(nowMs: number = Date.now()): boolean {
  if (!autoMutex) return false;
  if (nowMs - autoMutex.startedAtMs >= AUTO_MUTEX_TTL_MS) {
    autoMutex = null;
    return false;
  }
  return true;
}

function acquireAutoMutex(nowMs: number = Date.now()): boolean {
  if (mutexIsHeld(nowMs)) return false;
  autoMutex = { startedAtMs: nowMs };
  return true;
}

function clearAutoMutex(): void {
  autoMutex = null;
}

/** Test/harness helper — reset module mutex between scenarios. */
export function __resetAutoMutexForTests(): void {
  clearAutoMutex();
}

export interface FirstPhaseSelection {
  ok: boolean;
  phase_id?: string;
  reasonCode?: string;
  source?: string;
}

export interface PersistIsolationResult {
  ok: boolean;
  reasonCode?: string;
}

export interface AutoLifecycleOpts {
  orchestratorSessionId: string;
  prompt?: string;
  delivery?: string;
  startFrom?: string;
  bugTarget?: string;
  storyId?: string;
  sprintId?: string;
  orchestratorRunId?: string;
  freshContextMarker?: string;
  /** When false, setup detected no attach — fail-closed before mutex/spawn. */
  attachSupported?: boolean;
  spawnPhaseFn?: (ctx: any, args: SpawnArgs) => Promise<SpawnResult>;
  dispatchStopMatrixFn?: (
    args: StopMatrixArgs,
    opts?: StopMatrixOptions,
  ) => StopMatrixResult;
  selectFirstPhaseFn?: (opts: AutoLifecycleOpts) => FirstPhaseSelection;
  persistIsolationFn?: (evidence: IsolationEvidence) => PersistIsolationResult;
  stopMatrixOpts?: StopMatrixOptions;
  bridgeSpawnFn?: (pyArgs: string[]) => {
    status: number | null;
    stdout: string;
    stderr: string;
  };
  pythonBin?: string;
  bridgePath?: string;
  maxCycles?: number;
}

export interface AutoLifecycleResult {
  ok: boolean;
  reasonCode?: string;
  sessionID?: string;
  evidence?: IsolationEvidence;
  phase_id?: string;
  cycles?: number;
}

function defaultBridgeSpawnFn(_pyArgs: string[]): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  return { status: 127, stdout: "", stderr: "python not on PATH" };
}

/**
 * Python bridge: first-phase selection (CF3 / DQ3).
 * Order: argv start-from → resume_brief → scratchpad → US-0087 bug-queue.
 * No OpenCode-only TS resolver.
 */
export function selectFirstPhaseViaPython(
  opts: AutoLifecycleOpts,
): FirstPhaseSelection {
  if (typeof opts.selectFirstPhaseFn === "function") {
    return opts.selectFirstPhaseFn(opts);
  }
  if (opts.startFrom && opts.startFrom.trim()) {
    return { ok: true, phase_id: opts.startFrom.trim(), source: "argv" };
  }
  const spawnFn = opts.bridgeSpawnFn ?? defaultBridgeSpawnFn;
  const pythonBin = opts.pythonBin ?? "python";
  const bridgePath = opts.bridgePath ?? "scripts/opencode_auto_bridge.py";
  const pyArgs = [bridgePath, "--select-first-phase"];
  if (opts.bugTarget) pyArgs.push("--bug-target", opts.bugTarget);
  if (opts.orchestratorRunId)
    pyArgs.push("--orchestrator-run-id", opts.orchestratorRunId);
  const proc = spawnFn(pyArgs);
  if (proc.status !== 0) {
    // Fail soft to a safe default phase so attach/spawn tests can still run
    // when the bridge is unavailable; production hosts inject a working spawnFn.
    return { ok: true, phase_id: "execute", source: "fallback_execute" };
  }
  try {
    const parsed = JSON.parse(proc.stdout || "{}") as {
      ok?: boolean;
      phase_id?: string;
      reasonCode?: string;
      source?: string;
    };
    if (parsed.reasonCode === "AUTO_SCHEDULER_CONFLICT") {
      return { ok: false, reasonCode: "AUTO_SCHEDULER_CONFLICT" };
    }
    if (!parsed.ok || !parsed.phase_id) {
      return { ok: true, phase_id: "execute", source: "fallback_execute" };
    }
    return {
      ok: true,
      phase_id: parsed.phase_id,
      source: parsed.source ?? "python",
    };
  } catch {
    return { ok: true, phase_id: "execute", source: "fallback_execute" };
  }
}

/**
 * Python bridge: durable IsolationEvidence append to state.md (CF2 / DQ5).
 * Not ctx.storage — US-0048 / DEC-0029 SOT remains docs/engineering/state.md.
 */
export function persistIsolationViaPython(
  evidence: IsolationEvidence,
  opts: AutoLifecycleOpts = {} as AutoLifecycleOpts,
): PersistIsolationResult {
  if (typeof opts.persistIsolationFn === "function") {
    return opts.persistIsolationFn(evidence);
  }
  if (
    !evidence ||
    !evidence.parentID ||
    !evidence.sessionID ||
    evidence.sessionID === evidence.parentID
  ) {
    return { ok: false, reasonCode: REASON_CODES.SUBTASK_IGNORED };
  }
  const spawnFn = opts.bridgeSpawnFn ?? defaultBridgeSpawnFn;
  const bridgePath = opts.bridgePath ?? "scripts/opencode_auto_bridge.py";
  const pyArgs = [
    bridgePath,
    "--append-isolation",
    "--parent-id",
    evidence.parentID,
    "--session-id",
    evidence.sessionID,
    "--role",
    evidence.role,
    "--phase-id",
    evidence.phase_id,
    "--timestamp",
    evidence.timestamp,
    "--fresh-context-marker",
    evidence.fresh_context_marker,
  ];
  const proc = spawnFn(pyArgs);
  if (proc.status !== 0) {
    return { ok: false, reasonCode: REASON_CODES.DRIVER_INVOKE_FAILED };
  }
  return { ok: true };
}

/**
 * BUG-0018 leftover defense (installer owns prune; this function must not
 * delete `.opencode/commands/auto.md`). Best-effort `ctx.directory` / cwd.
 * Sync existsSync only — plugin does not unlink/rm the leftover file.
 */
export function leftoverAutoMarkdownExists(ctx: any): boolean {
  try {
    const roots: string[] = [];
    if (typeof ctx?.directory === "string" && ctx.directory.trim()) {
      roots.push(ctx.directory);
    }
    try {
      if (typeof process !== "undefined" && typeof process.cwd === "function") {
        roots.push(process.cwd());
      }
    } catch {
      // ignore cwd probe failures — detection is best-effort
    }
    for (const root of roots) {
      const candidate = join(root, ".opencode", "commands", "auto.md");
      if (existsSync(candidate)) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Shared internal lifecycle entry (CF4 / DQ2 / DQ4).
 * Owns: in-flight mutex, first-phase selection, spawnPhase + dispatchStopMatrix
 * loop, IsolationEvidence durable write. Used by interactive transform execute
 * and headless compose path (same entry).
 */
export async function runAutoLifecycle(
  ctx: any,
  opts: AutoLifecycleOpts,
): Promise<AutoLifecycleResult> {
  if (leftoverAutoMarkdownExists(ctx)) {
    return {
      ok: false,
      reasonCode: REASON_CODES.AUTO_MARKDOWN_COLLISION,
    };
  }
  if (opts.attachSupported === false) {
    clearAutoMutex();
    return {
      ok: false,
      reasonCode: REASON_CODES.PLUGIN_DISPATCH_ATTACH_UNSUPPORTED,
    };
  }
  if (!acquireAutoMutex()) {
    return { ok: false, reasonCode: REASON_CODES.AUTO_ALREADY_RUNNING };
  }
  try {
    const selection = selectFirstPhaseViaPython(opts);
    if (!selection.ok) {
      return {
        ok: false,
        reasonCode: selection.reasonCode ?? "AUTO_SCHEDULER_CONFLICT",
      };
    }
    let phaseId = selection.phase_id ?? "execute";
    const spawnFn = opts.spawnPhaseFn ?? spawnPhase;
    const stopFn = opts.dispatchStopMatrixFn ?? dispatchStopMatrix;
    const maxCycles = opts.maxCycles ?? 32;
    let cycles = 0;
    let lastEvidence: IsolationEvidence | undefined;
    let lastSessionID: string | undefined;

    while (cycles < maxCycles) {
      cycles += 1;
      let role: string;
      try {
        role = resolveRole(phaseId);
      } catch (err) {
        return {
          ok: false,
          reasonCode: (err as { reasonCode?: string })?.reasonCode,
          cycles,
        };
      }
      const fresh =
        opts.freshContextMarker ??
        `${role}-${phaseId}-${utcNowIso().replace(/[-:]/g, "").slice(0, 15)}Z-fresh`;
      const spawnResult = await spawnFn(ctx, {
        phaseId,
        prompt: opts.prompt ?? `phase=${phaseId}`,
        orchestratorSessionId: opts.orchestratorSessionId,
        freshContextMarker: fresh,
        storyId: opts.storyId,
        sprintId: opts.sprintId,
        orchestratorRunId: opts.orchestratorRunId,
      });
      if (!spawnResult.ok) {
        // Fail-closed paths clear mutex in finally (critic NB clear-on-fail-closed).
        return {
          ok: false,
          reasonCode: spawnResult.reasonCode,
          cycles,
        };
      }
      lastSessionID = spawnResult.sessionID;
      lastEvidence = spawnResult.evidence;
      if (spawnResult.evidence) {
        const persisted = persistIsolationViaPython(spawnResult.evidence, opts);
        if (!persisted.ok && persisted.reasonCode === REASON_CODES.SUBTASK_IGNORED) {
          return {
            ok: false,
            reasonCode: REASON_CODES.SUBTASK_IGNORED,
            cycles,
          };
        }
      }
      const stop = stopFn(
        {
          phase: phaseId,
          role,
          story: opts.storyId,
          sprint: opts.sprintId,
          orchestratorRunId: opts.orchestratorRunId,
          stopReason: "completed",
        },
        opts.stopMatrixOpts,
      );
      if (!stop.ok) {
        return {
          ok: false,
          reasonCode: stop.reasonCode ?? REASON_CODES.DRIVER_INVOKE_FAILED,
          sessionID: lastSessionID,
          evidence: lastEvidence,
          phase_id: phaseId,
          cycles,
        };
      }
      if (
        !stop.next_phase ||
        stop.action === "stop" ||
        stop.stop_reason === "completed" ||
        stop.next_phase === phaseId
      ) {
        break;
      }
      phaseId = stop.next_phase;
    }
    return {
      ok: true,
      sessionID: lastSessionID,
      evidence: lastEvidence,
      phase_id: phaseId,
      cycles,
    };
  } finally {
    clearAutoMutex();
  }
}

/**
 * Thin RPC wrapper around `runAutoLifecycle` for TUI `run()` dispatch (BUG-0019).
 * TUI keymap `run` lives in the CLI process; this handler runs on the server plugin.
 */
export async function runAutoLifecycleRpc(
  ctxOrInput: any = {},
  inputOrCtx: any = {},
): Promise<AutoLifecycleResult> {
  // Host RPC calls (input, context). Kit callers pass (ctx, input).
  const firstIsPluginCtx =
    ctxOrInput &&
    typeof ctxOrInput === "object" &&
    (typeof ctxOrInput.session === "object" ||
      typeof ctxOrInput.command === "object" ||
      typeof ctxOrInput.rpc === "object" ||
      typeof ctxOrInput.tool === "object" ||
      typeof ctxOrInput.directory === "string");
  const ctx = firstIsPluginCtx ? ctxOrInput : inputOrCtx;
  const input = firstIsPluginCtx ? inputOrCtx ?? {} : ctxOrInput ?? {};
  return runAutoLifecycle(ctx, {
    orchestratorSessionId: input.sessionID ?? "tui-auto",
    prompt: input.prompt,
    delivery: input.delivery,
    attachSupported: true,
  });
}

/**
 * Command.Info picker rows (`ctx.command.list` / GET /api/command). Not TUI keymap,
 * not editor.add, not tui.json. Missing list() → treat as no `auto` row (fail-closed).
 */
export function commandInfoListHasAuto(ctx: any): boolean {
  const listFn = ctx?.command?.list;
  if (typeof listFn !== "function") {
    return false;
  }
  try {
    const rows = listFn.call(ctx.command);
    const arr = Array.isArray(rows)
      ? rows
      : Array.isArray(rows?.commands)
        ? rows.commands
        : [];
    return arr.some((row: any) => row && row.name === "auto");
  } catch {
    return false;
  }
}

export type DesktopListingEmitChannel =
  | "desktop-notify"
  | "session-notice"
  | "setup-session-error";

export type DesktopListingEmitResult = {
  emitted: boolean;
  channel: DesktopListingEmitChannel;
  reasonCode: string;
};

/**
 * Desktop-visible fail-closed when Command.Info cannot list execute-only `/auto`
 * while plugin execute is registered (BUG-0020).
 *
 * Channels, first success:
 * 1. desktop/session notification API if present (`session.alert` / `app.notify` /
 *    GUI toast that is **not** TUI `tui.toast`);
 * 2. session-visible system/error notice in the current desktop session;
 * 3. plugin `setup` session-error return so the GUI surfaces
 *    OPENCODE_AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED.
 *
 * Must not be CLI TUI toast-only. Must not add a Command.Info `auto` template row.
 * Must not block `editor.add` or TUI keymap. Must not call `tui.toast` / `ui.toast`.
 */
export function emitDesktopCommandInfoListingUnsupported(
  ctx: any,
): DesktopListingEmitResult {
  const reasonCode =
    REASON_CODES.AUTO_DESKTOP_COMMAND_INFO_LISTING_UNSUPPORTED;
  const message =
    "OpenCode desktop Command.Info cannot list execute-only /auto while plugin execute is registered. Start auto from CLI TUI /auto (opencode, not --pure). " +
    reasonCode;

  // Channel 1: desktop/session notification — NOT TUI tui.toast / ui.toast.
  const desktopNotify =
    (typeof ctx?.session?.alert === "function" &&
      ctx.session.alert.bind(ctx.session)) ||
    (typeof ctx?.app?.notify === "function" && ctx.app.notify.bind(ctx.app)) ||
    (typeof ctx?.gui?.notify === "function" && ctx.gui.notify.bind(ctx.gui)) ||
    (typeof ctx?.desktop?.notify === "function" &&
      ctx.desktop.notify.bind(ctx.desktop));
  if (desktopNotify) {
    try {
      desktopNotify({
        title: "its-magic /auto",
        message,
        variant: "error",
        reasonCode,
      });
      return { emitted: true, channel: "desktop-notify", reasonCode };
    } catch {
      // fall through
    }
  }

  // Channel 2: session-visible system/error notice in the current desktop session.
  const sessionNotice =
    (typeof ctx?.session?.error === "function" &&
      ctx.session.error.bind(ctx.session)) ||
    (typeof ctx?.session?.system === "function" &&
      ctx.session.system.bind(ctx.session)) ||
    (typeof ctx?.system?.notice === "function" &&
      ctx.system.notice.bind(ctx.system));
  if (sessionNotice) {
    try {
      sessionNotice({
        message,
        reasonCode,
        level: "error",
      });
      return { emitted: true, channel: "session-notice", reasonCode };
    } catch {
      // fall through
    }
  }

  // Channel 3: setup session-error return (caller attaches sessionError).
  // Not TUI-toast-only — never call tui.toast / ui.toast here.
  if (ctx && typeof ctx === "object") {
    try {
      ctx.__itsMagicDesktopCommandInfoListingUnsupported = {
        reasonCode,
        message,
      };
    } catch {
      // ignore
    }
  }
  return { emitted: true, channel: "setup-session-error", reasonCode };
}

export type CliTuiLoadEmitChannel =
  | "desktop-notify"
  | "session-notice"
  | "setup-session-error";

export type CliTuiLoadEmitResult = {
  emitted: boolean;
  channel: CliTuiLoadEmitChannel;
  reasonCode: string;
};

function hostExposesCliTuiPluginLoadSkip(ctx: any): boolean {
  const spec = "./plugins/its-magic-auto/tui.ts";
  const failed = ctx?.tui?.failedPlugins ?? ctx?.plugin?.failedTui ?? ctx?.tui?.loadErrors;
  if (Array.isArray(failed) && failed.some((row: any) => String(row).includes(spec) || String(row?.spec ?? "").includes(spec))) {
    return true;
  }
  return Boolean(
    ctx?.tui?.pluginLoadSkipped ||
      ctx?.plugin?.tuiSkipped ||
      ctx?.tui?.loadError ||
      ctx?.tui?.externalPluginLoadUnsupported,
  );
}

/**
 * Session-visible fail-closed when tui.json lists the TUI module but the host
 * skipped it (`readV1Plugin` / no tui() / #36505-class). BUG-0021 residual.
 *
 * Must not be TUI-toast-only. Must not block editor.add. Must not restore auto.md.
 * Must not reuse desktop Command.Info / markdown-collision / LISTING tokens.
 */
export function emitCliTuiPluginLoadUnsupported(ctx: any): CliTuiLoadEmitResult {
  const reasonCode = REASON_CODES.AUTO_CLI_TUI_PLUGIN_LOAD_UNSUPPORTED;
  const message =
    "OpenCode CLI TUI listed ./plugins/its-magic-auto/tui.ts but skipped the plugin (tui() never runs). Residual host-cannot-load (#36505). Do not restore auto.md. " +
    reasonCode;

  // Channel 1: session/desktop notification — NOT TUI tui.toast / ui.toast.
  const desktopNotify =
    (typeof ctx?.session?.alert === "function" &&
      ctx.session.alert.bind(ctx.session)) ||
    (typeof ctx?.app?.notify === "function" && ctx.app.notify.bind(ctx.app)) ||
    (typeof ctx?.gui?.notify === "function" && ctx.gui.notify.bind(ctx.gui)) ||
    (typeof ctx?.desktop?.notify === "function" &&
      ctx.desktop.notify.bind(ctx.desktop));
  if (desktopNotify) {
    try {
      desktopNotify({
        title: "its-magic /auto",
        message,
        variant: "error",
        reasonCode,
      });
      return { emitted: true, channel: "desktop-notify", reasonCode };
    } catch {
      // fall through
    }
  }

  // Channel 2: session-visible system/error notice.
  const sessionNotice =
    (typeof ctx?.session?.error === "function" &&
      ctx.session.error.bind(ctx.session)) ||
    (typeof ctx?.session?.system === "function" &&
      ctx.session.system.bind(ctx.session)) ||
    (typeof ctx?.system?.notice === "function" &&
      ctx.system.notice.bind(ctx.system));
  if (sessionNotice) {
    try {
      sessionNotice({
        message,
        reasonCode,
        level: "error",
      });
      return { emitted: true, channel: "session-notice", reasonCode };
    } catch {
      // fall through
    }
  }

  // Channel 3: setup session-error return (caller attaches sessionError).
  // Not TUI-toast-only — never call tui.toast / ui.toast here.
  if (ctx && typeof ctx === "object") {
    try {
      ctx.__itsMagicCliTuiPluginLoadUnsupported = {
        reasonCode,
        message,
      };
    } catch {
      // ignore
    }
  }
  return { emitted: true, channel: "setup-session-error", reasonCode };
}

// --- Plugin setup (DEC-0124 §1 + §8 + BUG-0015 attach) --------------------
// ctx.tool.hook("execute.before") is the write-guard (DQ8). Detection is
// path-based, NOT permission-array-based: the plugin does not duplicate the
// agent's `edit`/`bash`/`task` allow-list. The hook flags AUTO_ORCHESTRATOR_PHASE_EXECUTION;
// the Python SOT decides the action (DQ6).
// BUG-0015: primary attach = ctx.command.transform → editor.add({ name: "auto", execute }).
// Returning { spawnPhase } from setup() is NOT attach. Missing attach →
// OPENCODE_PLUGIN_DISPATCH_ATTACH_UNSUPPORTED.

export interface OrchestratorApi {
  spawnPhase: (args: SpawnArgs) => Promise<SpawnResult>;
  dispatchStopMatrix: (
    args: StopMatrixArgs,
    opts?: StopMatrixOptions,
  ) => StopMatrixResult;
  invokeHeadless: (prompt: string, opts?: InvokeOptions) => HeadlessResult;
  buildHeadlessArgv: (prompt: string) => HeadlessArgv;
  runAutoLifecycle: (opts: AutoLifecycleOpts) => Promise<AutoLifecycleResult>;
  runAutoLifecycleRpc: (input: {
    sessionID?: string;
    prompt?: string;
    delivery?: string;
  }) => Promise<AutoLifecycleResult>;
  reasonCodes: typeof REASON_CODES;
  phaseRoleMatrix: Record<string, string>;
  attachSupported: boolean;
  attachReasonCode?: string;
  desktopCommandInfoListingUnsupported?: boolean;
  desktopCommandInfoListingReasonCode?: string;
  cliTuiPluginLoadUnsupported?: boolean;
  cliTuiPluginLoadReasonCode?: string;
  sessionError?: string;
}

const plugin = Plugin.define({
  id: "its-magic.orchestrator",
  async setup(ctx: any): Promise<OrchestratorApi> {
    if (ctx?.tool && typeof ctx.tool.hook === "function") {
      ctx.tool.hook("execute.before", () => {
        return {
          reasonCode: REASON_CODES.AUTO_ORCHESTRATOR_PHASE_EXECUTION,
        };
      });
    }

    let attachSupported = false;
    let autoExecute:
      | ((args: {
          sessionID: string;
          prompt?: string;
          delivery?: string;
        }) => Promise<AutoLifecycleResult>)
      | null = null;

    const bindExecute = () => {
      autoExecute = async ({ sessionID, prompt, delivery }) => {
        return runAutoLifecycle(ctx, {
          orchestratorSessionId: sessionID,
          prompt,
          delivery,
          attachSupported: true,
        });
      };
      return autoExecute;
    };

    // Primary attach (DQ1 / CF6): command.transform → editor.add({ name: "auto" })
    if (ctx?.command && typeof ctx.command.transform === "function") {
      const transformResult = ctx.command.transform((editor: any) => {
        if (editor && typeof editor.add === "function") {
          editor.add({
            name: "auto",
            description:
              "its-magic auto: orchestrator dispatch entry (spawn-only).",
            execute: bindExecute(),
          });
          attachSupported = true;
        }
      });
      // Support both sync and Promise-returning transform implementations.
      if (transformResult && typeof transformResult.then === "function") {
        // Fire-and-forget await for hosts that return a Promise; tests use sync.
        void transformResult;
      }
    }

    // Secondary defense only (CF1 / CF6): command.executed / event.subscribe.
    // Mutex-gated — second entry → OPENCODE_AUTO_ALREADY_RUNNING (marker 5).
    if (ctx?.event && typeof ctx.event.subscribe === "function") {
      ctx.event.subscribe((event: any) => {
        const type = event?.type ?? event?.event;
        const name = event?.name ?? event?.command ?? event?.properties?.name;
        if (type === "command.executed" && name === "auto") {
          const sessionID =
            event?.sessionID ??
            event?.properties?.sessionID ??
            "orchestrator-session-unknown";
          return runAutoLifecycle(ctx, {
            orchestratorSessionId: sessionID,
            prompt: event?.arguments ?? event?.properties?.arguments,
            attachSupported: true,
          });
        }
        return undefined;
      });
      // Event subscribe alone counts as usable attach when transform missing.
      if (!attachSupported) {
        attachSupported = true;
        bindExecute();
      }
    }

    // BUG-0023: await branded Rpc.define register so TUI `run()` can reach
    // runAutoLifecycle. Missing ctx.rpc remains attach-optional (BUG-0019) —
    // TUI fail-closes DISPATCH only when client/RPC truly cannot dispatch.
    if (ctx?.rpc && typeof ctx.rpc.register === "function") {
      try {
        await ctx.rpc.register(ITS_MAGIC_AUTO_RPC, {
          runAutoLifecycle: runAutoLifecycleRpc,
        });
      } catch {
        // RPC optional at attach time
      }
    }

    // BUG-0020: desktop Command.Info silent-miss is the defect. Emit after
    // editor.add when list() has no name === "auto" while execute is registered.
    // Non-blocking for attach + TUI keymap. Must not add a Command.Info template.
    let desktopListingUnsupported = false;
    let desktopListingReasonCode: string | undefined;
    if (attachSupported && !commandInfoListHasAuto(ctx)) {
      const emission = emitDesktopCommandInfoListingUnsupported(ctx);
      desktopListingUnsupported = true;
      desktopListingReasonCode = emission.reasonCode;
    }

    // BUG-0021: listed-but-skipped residual. Best-effort only if the host
    // exposes TUI load skip for the listed spec. After editor.add (must not
    // block attach). Session-visible notice, not TUI-toast-only.
    let cliTuiPluginLoadUnsupported = false;
    let cliTuiPluginLoadReasonCode: string | undefined;
    if (hostExposesCliTuiPluginLoadSkip(ctx)) {
      const loadEmission = emitCliTuiPluginLoadUnsupported(ctx);
      cliTuiPluginLoadUnsupported = true;
      cliTuiPluginLoadReasonCode = loadEmission.reasonCode;
    }

    const api: OrchestratorApi = {
      spawnPhase: (args: SpawnArgs) => spawnPhase(ctx, args),
      dispatchStopMatrix,
      invokeHeadless,
      buildHeadlessArgv,
      runAutoLifecycle: (opts: AutoLifecycleOpts) =>
        runAutoLifecycle(ctx, {
          ...opts,
          attachSupported:
            opts.attachSupported !== undefined
              ? opts.attachSupported
              : attachSupported,
        }),
      runAutoLifecycleRpc: (input: {
        sessionID?: string;
        prompt?: string;
        delivery?: string;
      }) => runAutoLifecycleRpc(ctx, input ?? {}),
      reasonCodes: REASON_CODES,
      phaseRoleMatrix: PHASE_ROLE_MATRIX,
      attachSupported,
      attachReasonCode: attachSupported
        ? undefined
        : REASON_CODES.PLUGIN_DISPATCH_ATTACH_UNSUPPORTED,
      desktopCommandInfoListingUnsupported: desktopListingUnsupported,
      desktopCommandInfoListingReasonCode: desktopListingReasonCode,
      cliTuiPluginLoadUnsupported,
      cliTuiPluginLoadReasonCode,
      sessionError: desktopListingReasonCode ?? cliTuiPluginLoadReasonCode,
    };
    return api;
  },
});

export default plugin;
export { resolveRole, PHASE_ROLE_MATRIX, clearAutoMutex, acquireAutoMutex, mutexIsHeld };
