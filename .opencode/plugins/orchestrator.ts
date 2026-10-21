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
// BUG-0024 — when ctx.rpc.register absent: emit OPENCODE_AUTO_TUI_REGISTER_SKIPPED
// (observable; not silent skip-as-success). Cite R-0140 / # BUG-0024.
// Composes US-0069 phase→role matrix, US-0092 stop-matrix (Python SOT),
// US-0023/US-0048/BUG-0006 spawn isolation, US-0005 hook enforcement.
// See decisions/DEC-0124.md §1–§10 for the locked contract.
// See docs/engineering/architecture.md # BUG-0015 (cite R-0114; no DEC amend).
// See docs/engineering/architecture.md # BUG-0018 (cite R-0120; no companion DEC).

import { existsSync } from "node:fs";
import { join } from "node:path";

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
  // BUG-0024 additive — register absent is honest residual, not silent success.
  AUTO_TUI_REGISTER_SKIPPED: "OPENCODE_AUTO_TUI_REGISTER_SKIPPED",
  AUTO_TUI_MISSING_CLIENT: "OPENCODE_AUTO_TUI_MISSING_CLIENT",
  AUTO_TUI_RPC_ABSENT: "OPENCODE_AUTO_TUI_RPC_ABSENT",
  AUTO_TUI_DEFINED_UNBRANDED: "OPENCODE_AUTO_TUI_DEFINED_UNBRANDED",
  AUTO_TUI_MAKE_UNREACHABLE: "OPENCODE_AUTO_TUI_MAKE_UNREACHABLE",
  // BUG-0027 additive — manual phase persist (do not reuse OPENCODE_AUTO_TUI_*).
  MANUAL_PHASE_WRITE_DENIED: "OPENCODE_MANUAL_PHASE_WRITE_DENIED",
  MANUAL_PHASE_PERSIST_DENIED: "OPENCODE_MANUAL_PHASE_PERSIST_DENIED",
  MANUAL_PHASE_PERSIST_NOT_INVOKED: "OPENCODE_MANUAL_PHASE_PERSIST_NOT_INVOKED",
  PLACEHOLDER_PARENT_REJECTED: "OPENCODE_PLACEHOLDER_PARENT_REJECTED",
  MANUAL_PHASE_CONTEXT_MISSING: "OPENCODE_MANUAL_PHASE_CONTEXT_MISSING",
  // US-0156 / DEC-0152 additive — fail-closed resolver (no fallback_execute).
  RESOLUTION_FAILED: "OPENCODE_AUTO_RESOLUTION_FAILED",
  RESUME_AMBIGUOUS: "OPENCODE_AUTO_RESUME_AMBIGUOUS",
  PHASE_PLAN_INVALID: "OPENCODE_AUTO_PHASE_PLAN_INVALID",
  CONTINUATION_CONFLICT: "OPENCODE_AUTO_CONTINUATION_CONFLICT",
  DEPENDENCY_BLOCKED: "OPENCODE_AUTO_DEPENDENCY_BLOCKED",
} as const;

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
  closure: "curator",
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
  storyId?: string;
  sprintId?: string;
  orchestratorRunId?: string;
  bugId?: string;
}

export interface SpawnArgs {
  phaseId: string;
  prompt: string;
  orchestratorSessionId: string;
  freshContextMarker: string;
  storyId?: string;
  sprintId?: string;
  orchestratorRunId?: string;
  bugId?: string;
}

export interface SpawnResult {
  ok: boolean;
  reasonCode?: string;
  sessionID?: string;
  evidence?: IsolationEvidence;
  stopReason?: string;
  blockedSubcode?: string;
  deniedAgent?: string;
  recoverableClass?: "blocked" | "ai_error" | "aborted" | "permission_dead_end";
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
    const denied = deniedAgentOf(err);
    if (denied) {
      const denial = classifyTaskDenial({ deniedAgent: denied });
      if (denial.recoverableClass === "permission_dead_end") {
        return {
          ok: false,
          reasonCode: "permission_dead_end",
          recoverableClass: "permission_dead_end",
          deniedAgent: denied,
        };
      }
      if (denial.reasonCode) {
        return {
          ok: false,
          reasonCode: denial.reasonCode,
          deniedAgent: denied,
        };
      }
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
  let waitValue: unknown;
  if (typeof session.wait === "function") {
    try {
      waitValue = await session.wait(sessionID);
    } catch (err) {
      if (isAbortShapedWait(err)) {
        return {
          ok: false,
          reasonCode: "phase_aborted",
          recoverableClass: "aborted",
        };
      }
      // Every other rejection keeps today's evidence return.
    }
  }
  const childStop = classifyChildStop(waitValue);
  if (childStop) {
    return childStop;
  }
  const evidence: IsolationEvidence = {
    parentID: args.orchestratorSessionId,
    sessionID,
    role,
    phase_id: args.phaseId,
    timestamp: utcNowIso(),
    fresh_context_marker: args.freshContextMarker,
    storyId: args.storyId,
    sprintId: args.sprintId,
    orchestratorRunId: args.orchestratorRunId,
    bugId: args.bugId,
  };
  return { ok: true, sessionID, evidence };
}

// US-0157 — critic hook uses the existing tech-lead allow. PHASE_ROLE_MATRIX
// stays the delivery-phase matrix. A missing critic key is not a capability miss.
export const TASK_ALLOWLIST: readonly string[] = [
  "po",
  "tech-lead",
  "dev",
  "qa",
  "release",
  "curator",
  "security",
];

export const PHASE_ROLE_CAPABILITY_MISSING = "PHASE_ROLE_CAPABILITY_MISSING";

export interface CriticSpawnPlan {
  spawn: boolean;
  agent?: "tech-lead";
  command?: "/sovereign-critic";
  reasonCode?: string;
}

export function planSovereignCriticSpawn(input: {
  crossModelReview?: number | string | null;
  allowlist?: readonly string[];
}): CriticSpawnPlan {
  const review = input?.crossModelReview;
  const enabled = review === 1 || review === "1";
  if (!enabled) {
    return { spawn: false };
  }
  const allow = input.allowlist ?? TASK_ALLOWLIST;
  if (!allow.includes("tech-lead")) {
    return { spawn: false, reasonCode: PHASE_ROLE_CAPABILITY_MISSING };
  }
  return { spawn: true, agent: "tech-lead", command: "/sovereign-critic" };
}

export function deliveryRoleCapability(
  role: string,
  allowlist: readonly string[] = TASK_ALLOWLIST,
): { ok: boolean; reasonCode?: string } {
  if (!allowlist.includes(role)) {
    return { ok: false, reasonCode: PHASE_ROLE_CAPABILITY_MISSING };
  }
  return { ok: true };
}

export function isAbortShapedWait(err: unknown): boolean {
  const name =
    err instanceof Error
      ? err.name
      : String((err as { name?: unknown } | null)?.name ?? "");
  if (name === "AbortError") return true;
  const message = err instanceof Error ? err.message : String(err ?? "");
  const code = String((err as { code?: unknown } | null)?.code ?? "");
  const blob = `${name} ${message} ${code}`.toLowerCase();
  return /\baborted?\b/.test(blob) || blob.includes("aborterror");
}

export function deniedAgentOf(err: unknown): string | null {
  if (!err || typeof err !== "object") return null;
  const rec = err as Record<string, unknown>;
  for (const key of ["deniedAgent", "denied_agent"]) {
    const raw = rec[key];
    if (typeof raw === "string" && raw.trim()) return raw.trim();
  }
  const permissionShaped = /permission|denied/i.test(
    `${String(rec.name ?? "")} ${String(rec.message ?? "")}`,
  );
  if (permissionShaped && typeof rec.agent === "string" && rec.agent.trim()) {
    return rec.agent.trim();
  }
  return null;
}

export function classifyTaskDenial(input: {
  deniedAgent?: string | null;
  allowlist?: readonly string[];
}): {
  recoverableClass?: "permission_dead_end";
  reasonCode?: string;
  addToAllowlist: false;
} {
  const denied = (input.deniedAgent ?? "").trim();
  const allow = input.allowlist ?? TASK_ALLOWLIST;
  const matrixRoles = new Set(Object.values(PHASE_ROLE_MATRIX));
  if (!denied) return { addToAllowlist: false };
  if (matrixRoles.has(denied) && !allow.includes(denied)) {
    return {
      reasonCode: PHASE_ROLE_CAPABILITY_MISSING,
      addToAllowlist: false,
    };
  }
  if (!matrixRoles.has(denied) && !allow.includes(denied)) {
    return {
      recoverableClass: "permission_dead_end",
      addToAllowlist: false,
    };
  }
  return { addToAllowlist: false };
}

function stringField(obj: Record<string, unknown>, key: string): string | undefined {
  const raw = obj[key];
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return undefined;
}

export function classifyChildStop(value: unknown): SpawnResult | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  const reasonCode = stringField(obj, "reason_code") ?? stringField(obj, "reasonCode");
  const stopReason = stringField(obj, "stop_reason") ?? stringField(obj, "stopReason");
  const blockedSubcode =
    stringField(obj, "blocked_subcode") ?? stringField(obj, "blockedSubcode");
  const deniedAgent = stringField(obj, "deniedAgent") ?? stringField(obj, "denied_agent");
  if (!reasonCode && !stopReason && !deniedAgent) return null;
  if (deniedAgent) {
    const denial = classifyTaskDenial({ deniedAgent });
    if (denial.recoverableClass === "permission_dead_end") {
      return {
        ok: false,
        reasonCode: "permission_dead_end",
        recoverableClass: "permission_dead_end",
        deniedAgent,
      };
    }
    if (denial.reasonCode) {
      return { ok: false, reasonCode: denial.reasonCode, deniedAgent };
    }
  }
  if (stopReason === "error" || (reasonCode === "ai_error" && stopReason === "error")) {
    return { ok: false, reasonCode: "error", stopReason: "error" };
  }
  if (reasonCode === "ai_error") {
    return {
      ok: false,
      reasonCode: "ai_error",
      recoverableClass: "ai_error",
      stopReason,
    };
  }
  if (stopReason === "blocked") {
    return {
      ok: false,
      reasonCode: reasonCode || blockedSubcode || "blocked",
      stopReason: "blocked",
      blockedSubcode,
      recoverableClass: "blocked",
    };
  }
  return null;
}

export function inferRecoverableClass(
  result: SpawnResult,
): "blocked" | "ai_error" | "aborted" | "permission_dead_end" | null {
  if (result.recoverableClass) return result.recoverableClass;
  if (result.reasonCode === "phase_aborted") return "aborted";
  if (result.reasonCode === "ai_error") return "ai_error";
  if (result.reasonCode === "permission_dead_end") return "permission_dead_end";
  if (result.stopReason === "blocked") return "blocked";
  return null;
}

export interface ContinueSamePhaseParentDecision {
  writer: string;
  writes_state: false;
  writes_brief: false;
  sets_resume_brief_auto_refresh: false;
  calls_write_resume_pair: false;
  action: "continue_same_phase";
}

export function continueSamePhaseParentDecision(
  writer: string,
): ContinueSamePhaseParentDecision {
  return {
    writer,
    writes_state: false,
    writes_brief: false,
    sets_resume_brief_auto_refresh: false,
    calls_write_resume_pair: false,
    action: "continue_same_phase",
  };
}

const PARENT_WRITERS = new Set(["auto", "parent", "orchestrator"]);
const SHAPE_EXACT = new Set([
  "absent_required_record_key",
  "malformed_record_key",
  "strict_proof_ttl_invalid",
]);

export interface ResumePairView {
  ok: boolean;
  predicate?: string | null;
  reasonCode?: string | null;
  next_scheduled_phase?: string | null;
  writer_role?: string | null;
  completed_phase?: string | null;
  child_writer_role?: string | null;
  child_completed_phase?: string | null;
  identity_match?: boolean;
}

export interface ParentPairDecision {
  writes_state: false;
  writes_brief: false;
  sets_resume_brief_auto_refresh: false;
  spawn_repair: boolean;
  spawn_next: boolean;
  next_scheduled_phase: string | null;
  repair_role?: string;
  repair_phase?: string;
  charter?: "repair-only";
  reasonCode?: string | null;
  predicate?: string | null;
}

function predicateRepairable(predicate: string | null | undefined): boolean {
  if (!predicate || predicate === "expired_ttl") return false;
  if (
    predicate === "strict_proof_hash_invalid" ||
    predicate === "pair_key_mismatch" ||
    SHAPE_EXACT.has(predicate)
  ) {
    return true;
  }
  return (
    predicate.startsWith("tuple_conflict:") ||
    predicate.startsWith("absent_required_field:") ||
    predicate.startsWith("malformed_field:")
  );
}

export function parentResumePairDecision(
  input: ResumePairView,
): ParentPairDecision {
  const locked = {
    writes_state: false as const,
    writes_brief: false as const,
    sets_resume_brief_auto_refresh: false as const,
  };
  if (input.ok) {
    return {
      ...locked,
      spawn_repair: false,
      spawn_next: true,
      next_scheduled_phase: input.next_scheduled_phase ?? null,
    };
  }
  const child = input.child_writer_role ?? "";
  const sameChild =
    input.identity_match !== false &&
    child.length > 0 &&
    !PARENT_WRITERS.has(child) &&
    input.writer_role === child &&
    input.completed_phase != null &&
    input.completed_phase === input.child_completed_phase &&
    predicateRepairable(input.predicate);
  if (sameChild) {
    return {
      ...locked,
      spawn_repair: true,
      spawn_next: false,
      next_scheduled_phase: null,
      repair_role: child,
      repair_phase: input.completed_phase ?? undefined,
      charter: "repair-only",
      reasonCode: input.reasonCode,
      predicate: input.predicate,
    };
  }
  return {
    ...locked,
    spawn_repair: false,
    spawn_next: false,
    next_scheduled_phase: null,
    reasonCode: input.reasonCode,
    predicate: input.predicate,
  };
}

export async function spawnSovereignCriticHook(
  ctx: any,
  args: {
    crossModelReview?: number | string | null;
    allowlist?: readonly string[];
    orchestratorSessionId: string;
    freshContextMarker: string;
    prompt?: string;
    producerPhaseId?: string;
    storyId?: string;
    sprintId?: string;
    orchestratorRunId?: string;
    bugId?: string;
  },
): Promise<SpawnResult & { spawned: boolean }> {
  const plan = planSovereignCriticSpawn({
    crossModelReview: args.crossModelReview,
    allowlist: args.allowlist,
  });
  if (!plan.spawn) {
    return {
      ok: !plan.reasonCode,
      spawned: false,
      reasonCode: plan.reasonCode,
    };
  }
  const session = ctx?.session;
  if (!session || typeof session.create !== "function") {
    return {
      ok: false,
      spawned: false,
      reasonCode: REASON_CODES.PLUGIN_SPAWN_UNSUPPORTED,
    };
  }
  let handle: { sessionID?: string } | null;
  try {
    handle = await session.create({
      parentID: args.orchestratorSessionId,
      agent: "tech-lead",
      prompt: args.prompt ?? "/sovereign-critic",
    });
  } catch (err) {
    if (isMissingPrimitiveThrow(err)) {
      return {
        ok: false,
        spawned: false,
        reasonCode: REASON_CODES.PLUGIN_SPAWN_UNSUPPORTED,
      };
    }
    return { ok: false, spawned: false, reasonCode: REASON_CODES.SUBTASK_IGNORED };
  }
  if (!handle) {
    return { ok: false, spawned: false, reasonCode: REASON_CODES.SUBTASK_IGNORED };
  }
  const sessionID = handle.sessionID;
  if (!sessionID || sessionID === args.orchestratorSessionId) {
    return { ok: false, spawned: false, reasonCode: REASON_CODES.SUBTASK_IGNORED };
  }
  const evidence: IsolationEvidence = {
    parentID: args.orchestratorSessionId,
    sessionID,
    role: "tech-lead",
    phase_id: args.producerPhaseId ?? "execute",
    timestamp: utcNowIso(),
    fresh_context_marker: args.freshContextMarker,
    storyId: args.storyId,
    sprintId: args.sprintId,
    orchestratorRunId: args.orchestratorRunId,
    bugId: args.bugId,
  };
  return { ok: true, spawned: true, sessionID, evidence };
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
  recoverableClass?: string;
  reasonCode?: string;
  blockedSubcode?: string;
  deniedAgent?: string;
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
  if (args.recoverableClass)
    pyArgs.push("--recoverable-class", args.recoverableClass);
  if (args.reasonCode) pyArgs.push("--reason-code", args.reasonCode);
  if (args.blockedSubcode) pyArgs.push("--blocked-subcode", args.blockedSubcode);
  if (args.deniedAgent) pyArgs.push("--denied-agent", args.deniedAgent);
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

export interface ContinuationSelection extends FirstPhaseSelection {
  idempotent_noop?: boolean;
  work_item_kind?: string;
  story_id?: string;
  bug_id?: string;
  sprint_id?: string;
  effective_phase_plan?: string[];
  skipped_phases?: string[];
  cursor?: number;
  remaining_budget?: number;
  continuation_key?: string;
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
  bugId?: string;
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
  cursor?: number;
  remainingBudget?: number;
  resolveContinuationFn?: (opts: AutoLifecycleOpts) => ContinuationSelection;
  crossModelReview?: number | string;
  taskAllowlist?: readonly string[];
  spawnCriticFn?: (
    ctx: any,
    args: {
      crossModelReview?: number | string | null;
      allowlist?: readonly string[];
      orchestratorSessionId: string;
      freshContextMarker: string;
      prompt?: string;
      producerPhaseId?: string;
      storyId?: string;
      sprintId?: string;
      orchestratorRunId?: string;
      bugId?: string;
    },
  ) => Promise<SpawnResult & { spawned: boolean }>;
  resumePairValidation?: ResumePairView;
  resumePairValidationAfterRepair?: ResumePairView;
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
    // US-0156: fail closed before a Task spawn; no fallback phase.
    return { ok: false, reasonCode: REASON_CODES.RESOLUTION_FAILED };
  }
  try {
    const parsed = JSON.parse(proc.stdout || "{}") as {
      ok?: boolean;
      phase_id?: string;
      reasonCode?: string;
      source?: string;
    };
    if (parsed.reasonCode) {
      return { ok: false, reasonCode: parsed.reasonCode };
    }
    if (!parsed.ok || !parsed.phase_id) {
      return { ok: false, reasonCode: REASON_CODES.RESOLUTION_FAILED };
    }
    return {
      ok: true,
      phase_id: parsed.phase_id,
      source: parsed.source ?? "python",
    };
  } catch {
    return { ok: false, reasonCode: REASON_CODES.RESOLUTION_FAILED };
  }
}

/**
 * US-0156 / DEC-0152: typed, read-only continuation resolution.
 * Bridge owns the precedence, work-item selection, plan intersection, and
 * idempotent provenance. No fallback phase on any bridge failure.
 */
export function resolveContinuationViaPython(
  opts: AutoLifecycleOpts,
): ContinuationSelection {
  if (typeof opts.resolveContinuationFn === "function") {
    return opts.resolveContinuationFn(opts);
  }
  const spawnFn = opts.bridgeSpawnFn ?? defaultBridgeSpawnFn;
  const pythonBin = opts.pythonBin ?? "python";
  const bridgePath = opts.bridgePath ?? "scripts/opencode_auto_bridge.py";
  const pyArgs = [bridgePath, "--resolve-continuation"];
  if (opts.startFrom) pyArgs.push("--start-from", opts.startFrom);
  if (opts.bugTarget) pyArgs.push("--bug-target", opts.bugTarget);
  if (opts.orchestratorRunId)
    pyArgs.push("--orchestrator-run-id", opts.orchestratorRunId);
  if (typeof opts.cursor === "number")
    pyArgs.push("--cursor", String(opts.cursor));
  if (typeof opts.remainingBudget === "number")
    pyArgs.push("--remaining-budget", String(opts.remainingBudget));
  const proc = spawnFn(pyArgs);
  if (proc.status !== 0) {
    return { ok: false, reasonCode: REASON_CODES.RESOLUTION_FAILED };
  }
  try {
    const parsed = JSON.parse(proc.stdout || "{}") as ContinuationSelection & {
      reasonCode?: string;
    };
    if (!parsed.ok) {
      return {
        ok: false,
        reasonCode:
          parsed.reasonCode ??
          REASON_CODES.RESOLUTION_FAILED,
      };
    }
    if (!parsed.phase_id) {
      return { ok: false, reasonCode: REASON_CODES.PHASE_PLAN_INVALID };
    }
    return parsed;
  } catch {
    return { ok: false, reasonCode: REASON_CODES.RESOLUTION_FAILED };
  }
}

/**
 * Python bridge: durable IsolationEvidence append to state.md (CF2 / DQ5).
 * Not ctx.storage — US-0048 / DEC-0029 SOT remains docs/engineering/state.md.
 * BUG-0027: identity fields + reject tui-auto before spawn.
 */
export function persistIsolationViaPython(
  evidence: IsolationEvidence,
  opts: AutoLifecycleOpts = {} as AutoLifecycleOpts,
): PersistIsolationResult {
  if (
    isPlaceholderParent(evidence?.parentID) ||
    isPlaceholderParent(evidence?.orchestratorRunId)
  ) {
    return { ok: false, reasonCode: REASON_CODES.PLACEHOLDER_PARENT_REJECTED };
  }
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
  if (evidence.storyId) pyArgs.push("--story-id", evidence.storyId);
  if (evidence.sprintId) pyArgs.push("--sprint-id", evidence.sprintId);
  if (evidence.orchestratorRunId) {
    pyArgs.push("--orchestrator-run-id", evidence.orchestratorRunId);
  }
  if (evidence.bugId) pyArgs.push("--bug-id", evidence.bugId);
  const proc = spawnFn(pyArgs);
  if (proc.status !== 0) {
    return { ok: false, reasonCode: REASON_CODES.MANUAL_PHASE_PERSIST_DENIED };
  }
  return { ok: true };
}

export const PLACEHOLDER_PARENT_ID = "tui-auto";

export const MANUAL_PHASE_COMMAND_NAMES = [
  "intake",
  "discovery",
  "research",
  "architecture",
  "sprint-plan",
  "plan-verify",
  "execute",
  "qa",
  "verify-work",
  "release",
  "refresh-context",
  "closure",
] as const;

export type ManualPhaseCommandName =
  (typeof MANUAL_PHASE_COMMAND_NAMES)[number];

export function isPlaceholderParent(value: unknown): boolean {
  return typeof value === "string" && value.trim() === PLACEHOLDER_PARENT_ID;
}

export function isManualPhaseCommandName(
  name: unknown,
): name is ManualPhaseCommandName {
  return (
    typeof name === "string" &&
    (MANUAL_PHASE_COMMAND_NAMES as readonly string[]).includes(name)
  );
}

function pickNonEmpty(...candidates: unknown[]): string | undefined {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim() && c.trim() !== "(none)") {
      return c.trim();
    }
  }
  return undefined;
}

export interface ManualPhasePersistInput {
  type?: string;
  name?: string;
  command?: string;
  sessionID?: string;
  parentID?: string;
  arguments?: unknown;
  properties?: Record<string, unknown>;
  storyId?: string;
  sprintId?: string;
  orchestratorRunId?: string;
  bugId?: string;
  phaseId?: string;
}

const manualPersistKeys = new Set<string>();
let manualPersistInFlight = false;

/** Test/harness helper — reset manual-phase persist mutex between scenarios. */
export function __resetManualPhasePersistForTests(): void {
  manualPersistKeys.clear();
  manualPersistInFlight = false;
}

export interface ManualPhaseContextResolution {
  ok: boolean;
  storyId?: string;
  sprintId?: string;
  orchestratorRunId?: string;
  bugId?: string;
}

export function resolveManualPhaseContextViaPython(
  opts: AutoLifecycleOpts = {} as AutoLifecycleOpts,
): ManualPhaseContextResolution {
  const spawnFn = opts.bridgeSpawnFn ?? defaultBridgeSpawnFn;
  const bridgePath = opts.bridgePath ?? "scripts/opencode_auto_bridge.py";
  const proc = spawnFn([bridgePath, "--resolve-context"]);
  if (proc.status !== 0) {
    return { ok: false };
  }
  try {
    const parsed = JSON.parse(String(proc.stdout || "{}"));
    return {
      ok: parsed?.ok !== false,
      storyId: pickNonEmpty(parsed?.storyId, parsed?.story_id),
      sprintId: pickNonEmpty(parsed?.sprintId, parsed?.sprint_id),
      orchestratorRunId: pickNonEmpty(
        parsed?.orchestratorRunId,
        parsed?.orchestrator_run_id,
      ),
      bugId: pickNonEmpty(parsed?.bugId, parsed?.bug_id),
    };
  } catch {
    return { ok: false };
  }
}

/**
 * Thin invoker for manual OpenCode phase commands (BUG-0027).
 * Builds IsolationEvidence and calls persistIsolationViaPython.
 * Distinct from runAutoLifecycle drain. Mutex vs dual-fire double-append.
 */
export function persistManualPhaseIsolation(
  _ctx: any,
  eventOrArgs: ManualPhasePersistInput = {},
  opts: AutoLifecycleOpts = {} as AutoLifecycleOpts,
): PersistIsolationResult & { evidence?: IsolationEvidence } {
  const event = eventOrArgs ?? {};
  const props =
    event.properties && typeof event.properties === "object"
      ? event.properties
      : {};
  const argsObj =
    event.arguments &&
    typeof event.arguments === "object" &&
    !Array.isArray(event.arguments)
      ? (event.arguments as Record<string, unknown>)
      : {};

  const name = pickNonEmpty(
    event.name,
    event.command,
    props.name,
    props.command,
    event.phaseId,
    argsObj.phaseId,
    argsObj.name,
  );

  if (!isManualPhaseCommandName(name)) {
    return {
      ok: false,
      reasonCode: REASON_CODES.MANUAL_PHASE_PERSIST_NOT_INVOKED,
    };
  }

  const sessionID =
    pickNonEmpty(event.sessionID, props.sessionID, argsObj.sessionID) ?? "";
  const parentCandidate = pickNonEmpty(
    event.parentID,
    props.parentID,
    argsObj.parentID,
    sessionID,
  );

  let storyId = pickNonEmpty(
    event.storyId,
    argsObj.storyId,
    props.storyId,
    opts.storyId,
  );
  let sprintId = pickNonEmpty(
    event.sprintId,
    argsObj.sprintId,
    props.sprintId,
    opts.sprintId,
  );
  let orchestratorRunId = pickNonEmpty(
    event.orchestratorRunId,
    argsObj.orchestratorRunId,
    props.orchestratorRunId,
    opts.orchestratorRunId,
  );
  let bugId = pickNonEmpty(
    event.bugId,
    argsObj.bugId,
    props.bugId,
    opts.bugId,
    opts.bugTarget,
  );

  if (!orchestratorRunId || !storyId || !sprintId || !bugId) {
    const resolved = resolveManualPhaseContextViaPython(opts);
    storyId = storyId ?? resolved.storyId;
    sprintId = sprintId ?? resolved.sprintId;
    orchestratorRunId = orchestratorRunId ?? resolved.orchestratorRunId;
    bugId = bugId ?? resolved.bugId;
  }

  if (
    isPlaceholderParent(parentCandidate) ||
    isPlaceholderParent(sessionID) ||
    isPlaceholderParent(orchestratorRunId)
  ) {
    return {
      ok: false,
      reasonCode: REASON_CODES.PLACEHOLDER_PARENT_REJECTED,
    };
  }

  if (!sessionID || !orchestratorRunId) {
    // Missing real session/run context — do not invent proof tuples.
    return {
      ok: false,
      reasonCode: REASON_CODES.MANUAL_PHASE_CONTEXT_MISSING,
    };
  }

  // Distinct evidence session vs parent so spawn identical-id check is held
  // for runAutoLifecycle; composite is derived from real IDs (not a proof).
  const parentID = parentCandidate || sessionID;
  const evidenceSessionID =
    sessionID === parentID ? `${sessionID}::${name}` : sessionID;

  const key = `${parentID}|${name}|${orchestratorRunId}`;
  if (manualPersistKeys.has(key) || manualPersistInFlight) {
    return { ok: true };
  }
  manualPersistInFlight = true;
  try {
    let role: string;
    try {
      role = resolveRole(name);
    } catch (err) {
      return {
        ok: false,
        reasonCode: (err as { reasonCode?: string })?.reasonCode,
      };
    }
    const fresh =
      opts.freshContextMarker ??
      `${role}-${name}-${utcNowIso().replace(/[-:]/g, "").slice(0, 15)}Z-fresh`;
    const evidence: IsolationEvidence = {
      parentID,
      sessionID: evidenceSessionID,
      role,
      phase_id: name,
      timestamp: utcNowIso(),
      fresh_context_marker: fresh,
      storyId,
      sprintId,
      orchestratorRunId,
      bugId,
    };
    const persisted = persistIsolationViaPython(evidence, opts);
    if (!persisted.ok) {
      const code =
        persisted.reasonCode === REASON_CODES.SUBTASK_IGNORED
          ? REASON_CODES.SUBTASK_IGNORED
          : persisted.reasonCode === REASON_CODES.PLACEHOLDER_PARENT_REJECTED
            ? REASON_CODES.PLACEHOLDER_PARENT_REJECTED
            : REASON_CODES.MANUAL_PHASE_PERSIST_DENIED;
      return { ok: false, reasonCode: code, evidence };
    }
    manualPersistKeys.add(key);
    return { ok: true, evidence };
  } finally {
    manualPersistInFlight = false;
  }
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

function freshMarkerFor(
  role: string,
  phaseId: string,
  base: string | undefined,
  generation: number,
): string {
  if (generation === 0) {
    return (
      base ??
      `${role}-${phaseId}-${utcNowIso().replace(/[-:]/g, "").slice(0, 15)}Z-fresh`
    );
  }
  const stem = (base ?? `${role}-${phaseId}`).replace(/-fresh$/, "");
  return `${stem}-r${generation}-${utcNowIso().replace(/[-:]/g, "").slice(0, 15)}Z-fresh`;
}

function continueRecoverableSpawn(
  spawnResult: SpawnResult,
  phaseId: string,
  role: string,
  stopFn: NonNullable<AutoLifecycleOpts["dispatchStopMatrixFn"]>,
  opts: AutoLifecycleOpts,
  continueAttempts: Set<string>,
  storyId?: string,
  sprintId?: string,
): { respawn: boolean; reasonCode?: string } {
  const parentDecision = continueSamePhaseParentDecision("orchestrator");
  if (
    parentDecision.writes_state ||
    parentDecision.writes_brief ||
    parentDecision.sets_resume_brief_auto_refresh ||
    parentDecision.calls_write_resume_pair
  ) {
    return {
      respawn: false,
      reasonCode: REASON_CODES.MANUAL_PHASE_WRITE_DENIED,
    };
  }
  const klass = inferRecoverableClass(spawnResult);
  if (!klass) {
    return { respawn: false, reasonCode: spawnResult.reasonCode };
  }
  const attemptKey = `${phaseId}\0${klass}`;
  if (continueAttempts.has(attemptKey)) {
    return { respawn: false, reasonCode: spawnResult.reasonCode };
  }
  const stop = stopFn(
    {
      phase: phaseId,
      role,
      story: storyId,
      sprint: sprintId,
      orchestratorRunId: opts.orchestratorRunId,
      stopReason: klass === "blocked" ? spawnResult.stopReason ?? "blocked" : spawnResult.stopReason,
      recoverableClass: klass,
      reasonCode:
        klass === "aborted"
          ? "phase_aborted"
          : klass === "ai_error"
            ? "ai_error"
            : spawnResult.reasonCode,
      blockedSubcode: spawnResult.blockedSubcode,
      deniedAgent: spawnResult.deniedAgent,
    },
    opts.stopMatrixOpts,
  );
  if (!stop.ok) {
    return {
      respawn: false,
      reasonCode: stop.reasonCode ?? spawnResult.reasonCode,
    };
  }
  if (stop.action === "continue_same_phase" && stop.next_phase === phaseId) {
    continueAttempts.add(attemptKey);
    return { respawn: true };
  }
  return { respawn: false, reasonCode: spawnResult.reasonCode };
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
    const continuation = resolveContinuationViaPython(opts);
    if (!continuation.ok) {
      // US-0156: fail closed before a Task spawn; no fallback phase.
      return {
        ok: false,
        reasonCode: continuation.reasonCode ?? REASON_CODES.RESOLUTION_FAILED,
      };
    }
    const initialPhase = continuation.phase_id;
    if (!initialPhase) {
      return { ok: false, reasonCode: REASON_CODES.PHASE_PLAN_INVALID };
    }
    let phaseId = initialPhase;
    const continuationStoryId = continuation.story_id || opts.storyId;
    const continuationSprintId = continuation.sprint_id || opts.sprintId;
    const continuationBugId = continuation.bug_id || opts.bugId || opts.bugTarget;
    const spawnFn = opts.spawnPhaseFn ?? spawnPhase;
    const stopFn = opts.dispatchStopMatrixFn ?? dispatchStopMatrix;
    const maxCycles = opts.maxCycles ?? 32;
    let cycles = 0;
    let markerGeneration = 0;
    const continueAttempts = new Set<string>();
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
      const capability = deliveryRoleCapability(
        role,
        opts.taskAllowlist ?? TASK_ALLOWLIST,
      );
      if (!capability.ok) {
        return {
          ok: false,
          reasonCode: capability.reasonCode,
          cycles,
        };
      }
      const fresh = freshMarkerFor(
        role,
        phaseId,
        opts.freshContextMarker,
        markerGeneration,
      );
      const spawnResult = await spawnFn(ctx, {
        phaseId,
        prompt: opts.prompt ?? `phase=${phaseId}`,
        orchestratorSessionId: opts.orchestratorSessionId,
        freshContextMarker: fresh,
        storyId: continuationStoryId,
        sprintId: continuationSprintId,
        orchestratorRunId: opts.orchestratorRunId,
        bugId: continuationBugId,
      });
      if (!spawnResult.ok) {
        // Class matches call the matrix instead of returning before it.
        // Fail-closed paths still clear the mutex in finally.
        const continued = continueRecoverableSpawn(
          spawnResult,
          phaseId,
          role,
          stopFn,
          opts,
          continueAttempts,
          continuationStoryId,
          continuationSprintId,
        );
        if (continued.respawn) {
          markerGeneration += 1;
          continue;
        }
        return {
          ok: false,
          reasonCode: continued.reasonCode ?? spawnResult.reasonCode,
          cycles,
        };
      }
      lastSessionID = spawnResult.sessionID;
      lastEvidence = spawnResult.evidence;
      if (spawnResult.evidence) {
        const persisted = persistIsolationViaPython(spawnResult.evidence, opts);
        if (!persisted.ok) {
          if (
            persisted.reasonCode === REASON_CODES.SUBTASK_IGNORED ||
            persisted.reasonCode === REASON_CODES.PLACEHOLDER_PARENT_REJECTED ||
            persisted.reasonCode === REASON_CODES.MANUAL_PHASE_PERSIST_DENIED
          ) {
            return {
              ok: false,
              reasonCode: persisted.reasonCode,
              cycles,
            };
          }
        }
      }
      if (opts.crossModelReview === 1 || opts.crossModelReview === "1") {
        const criticFn = opts.spawnCriticFn ?? spawnSovereignCriticHook;
        const critic = await criticFn(ctx, {
          crossModelReview: opts.crossModelReview,
          allowlist: opts.taskAllowlist,
          orchestratorSessionId: opts.orchestratorSessionId,
          freshContextMarker: `${fresh}-critic`,
          prompt: "/sovereign-critic",
          producerPhaseId: phaseId,
          storyId: continuationStoryId,
          sprintId: continuationSprintId,
          orchestratorRunId: opts.orchestratorRunId,
          bugId: continuationBugId,
        });
        if (!critic.ok) {
          return {
            ok: false,
            reasonCode: critic.reasonCode,
            cycles,
          };
        }
      }
      if (opts.resumePairValidation) {
        const decision = parentResumePairDecision(opts.resumePairValidation);
        if (decision.spawn_repair && decision.repair_phase) {
          const repairSpawn = await spawnFn(ctx, {
            phaseId: decision.repair_phase,
            prompt: "repair-only",
            orchestratorSessionId: opts.orchestratorSessionId,
            freshContextMarker: `${fresh}-repair`,
            storyId: continuationStoryId,
            sprintId: continuationSprintId,
            orchestratorRunId: opts.orchestratorRunId,
            bugId: continuationBugId,
          });
          if (!repairSpawn.ok) {
            return {
              ok: false,
              reasonCode: repairSpawn.reasonCode,
              cycles,
            };
          }
          const again = parentResumePairDecision(
            opts.resumePairValidationAfterRepair ?? {
              ok: false,
              predicate: opts.resumePairValidation.predicate,
              reasonCode: opts.resumePairValidation.reasonCode,
              writer_role: opts.resumePairValidation.writer_role,
              completed_phase: opts.resumePairValidation.completed_phase,
              child_writer_role: opts.resumePairValidation.child_writer_role,
              child_completed_phase:
                opts.resumePairValidation.child_completed_phase,
              identity_match: false,
            },
          );
          if (!again.spawn_next) {
            return {
              ok: false,
              reasonCode: opts.resumePairValidation.reasonCode,
              cycles,
            };
          }
        } else if (!decision.spawn_next) {
          return {
            ok: false,
            reasonCode:
              decision.reasonCode ?? opts.resumePairValidation.reasonCode,
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
      if (stop.action === "continue_same_phase" && stop.next_phase === phaseId) {
        const klass = inferRecoverableClass(spawnResult) ?? "continue_same_phase";
        const attemptKey = `${phaseId}\0${klass}`;
        if (continueAttempts.has(attemptKey)) {
          return {
            ok: false,
            reasonCode: spawnResult.reasonCode,
            cycles,
          };
        }
        continueAttempts.add(attemptKey);
        markerGeneration += 1;
        continue;
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

export type RegisterSkippedEmitChannel =
  | "desktop-notify"
  | "session-notice"
  | "setup-session-error";

export type RegisterSkippedEmitResult = {
  emitted: boolean;
  channel: RegisterSkippedEmitChannel;
  reasonCode: string;
};

/**
 * Session-visible fail-closed when orchestrator cannot `ctx.rpc.register`
 * (BUG-0024). Not silent skip-as-success. Must not block editor.add.
 * Must not be TUI-toast-only. Must not restore auto.md.
 */
export function emitAutoTuiRegisterSkipped(ctx: any): RegisterSkippedEmitResult {
  const reasonCode = REASON_CODES.AUTO_TUI_REGISTER_SKIPPED;
  const message =
    "OpenCode orchestrator ctx.rpc.register absent — ITS_MAGIC_AUTO_RPC not registered. TUI may still try client/make limbs. " +
    reasonCode;

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

  if (ctx && typeof ctx === "object") {
    try {
      ctx.__itsMagicAutoTuiRegisterSkipped = {
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
  persistManualPhaseIsolation: (
    event: ManualPhasePersistInput,
    opts?: AutoLifecycleOpts,
  ) => PersistIsolationResult & { evidence?: IsolationEvidence };
  reasonCodes: typeof REASON_CODES;
  phaseRoleMatrix: Record<string, string>;
  attachSupported: boolean;
  attachReasonCode?: string;
  desktopCommandInfoListingUnsupported?: boolean;
  desktopCommandInfoListingReasonCode?: string;
  cliTuiPluginLoadUnsupported?: boolean;
  cliTuiPluginLoadReasonCode?: string;
  autoTuiRegisterSkipped?: boolean;
  autoTuiRegisterSkippedReasonCode?: string;
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

    // BUG-0030: `/auto` is owned by .opencode/commands/auto.md. This plugin
    // retains only orchestration support and BUG-0027 manual-phase persistence.
    const attachSupported = false;

    // Secondary defense only (CF1 / CF6): command.executed / event.subscribe.
    // Mutex-gated — second entry → OPENCODE_AUTO_ALREADY_RUNNING (marker 5).
    if (ctx?.event && typeof ctx.event.subscribe === "function") {
      ctx.event.subscribe((event: any) => {
        const type = event?.type ?? event?.event;
        const name = event?.name ?? event?.command ?? event?.properties?.name;
        if (type === "command.executed" && isManualPhaseCommandName(name)) {
          return persistManualPhaseIsolation(ctx, event ?? {});
        }
        if (
          (type === "tool.execute.after" || type === "session.idle") &&
          isManualPhaseCommandName(
            event?.command ?? event?.name ?? event?.properties?.command,
          )
        ) {
          return persistManualPhaseIsolation(ctx, event ?? {});
        }
        return undefined;
      });
    }

    const autoTuiRegisterSkipped = false;
    const autoTuiRegisterSkippedReasonCode: string | undefined = undefined;

    // BUG-0020: desktop Command.Info silent-miss is the defect. Emit after
    // editor.add when list() has no name === "auto" while execute is registered.
    // Non-blocking for attach + TUI keymap. Must not add a Command.Info template.
    let desktopListingUnsupported = false;
    let desktopListingReasonCode: string | undefined;

    // BUG-0021: listed-but-skipped residual. Best-effort only if the host
    // exposes TUI load skip for the listed spec. After editor.add (must not
    // block attach). Session-visible notice, not TUI-toast-only.
    let cliTuiPluginLoadUnsupported = false;
    let cliTuiPluginLoadReasonCode: string | undefined;

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
      persistManualPhaseIsolation: (
        event: ManualPhasePersistInput,
        opts?: AutoLifecycleOpts,
      ) => persistManualPhaseIsolation(ctx, event ?? {}, opts),
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
      autoTuiRegisterSkipped,
      autoTuiRegisterSkippedReasonCode,
      sessionError: undefined,
    };
    return api;
  },
});

export default plugin;
export {
  resolveRole,
  PHASE_ROLE_MATRIX,
  clearAutoMutex,
  acquireAutoMutex,
  mutexIsHeld,
};
