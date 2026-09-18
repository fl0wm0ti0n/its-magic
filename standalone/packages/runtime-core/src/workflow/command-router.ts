import {
	ALLOWED_VALIDATOR_NAMES,
	type KernelBridge,
	KernelBridgeError,
	type ValidatorResult,
} from "@its-magic/kernel-bridge";
import { computePolicyHash, DEFAULT_POLICY_SNAPSHOT } from "@its-magic/policy-engine";
import {
	assertOrchestratorSchedulingOnly,
	createDefaultRoleCatalog,
	resolvePhaseRole,
	type SessionSupervisor,
	SOVEREIGN_BOOTSTRAP_DELIVERY_FAILED,
	type SpawnBootstrap,
	type SupervisedSession,
	sha256Canonical,
	stubContextPackHash,
} from "@its-magic/role-runtime";
import { KERNEL_VALIDATOR_MISSING, WORKFLOW_ROUTE_DEFERRED } from "../stop-matrix/codes.ts";
import {
	type ConfigView,
	lookupDeliveryMode,
	lookupSovereignMemory,
	lookupSovereignRuntime,
} from "./config-view.ts";
import { resolveDeliveryRoute } from "./delivery-router.ts";
import { createNextStateIntent } from "./next-state.ts";
import {
	type CanonicalPhase,
	hasNode,
	intentForTransition,
	nextCanonicalPhase,
	roleForPhase,
	shouldSkipPlanVerify,
} from "./phase-graph.ts";
import { composeBootstrapText, toSpawnBootstrap } from "./sovereign-runtime.ts";
import {
	COMMAND_ROUTER_STEPS,
	type CommandRouterStep,
	DEFERRED_COMMANDS,
	type IndependentAxes,
	type NextStateIntent,
	PROGRAMMATIC_COMMANDS,
	type ProgrammaticCommand,
	type RouterCommand,
	SCHEDULER_COMMANDS,
	type SchedulerCommand,
	WorkflowError,
} from "./types.ts";

export const HOST_SCHEDULING_ONLY = true;
export const IN_PROCESS_PRODUCER_FORBIDDEN = true;

/** RoleCatalog has no memory-audit node; scout/ask analog. Catalog unamended. */
export const COMMAND_SPAWN_PHASE: Record<string, string> = {
	"memory-audit": "ask",
};

export interface RouteInput {
	orchestrator_run_id: string;
	model_id: string;
	tools?: string[];
	validator_name?: string;
	validator_args?: string[];
	context_pack_hash?: string;
	policy_hash?: string;
	parent_phase_session_id?: string | null;
	startFrom?: string;
	previousDeliveryMode?: string;
	backlogWorkKind?: string;
	backlogRecommendedDeliveryMode?: string;
	acCount?: number;
	hasCompanionDec?: boolean;
	activeSprint?: boolean;
	itemKind?: "story" | "bug";
	componentCount?: number;
	gateEscalation?: boolean;
	yamlPath?: string;
	kernelRoot?: string;
}

export interface RouteOk {
	ok: true;
	command: ProgrammaticCommand;
	steps: CommandRouterStep[];
	phase_id: string;
	role_id: string;
	session: SupervisedSession;
	fresh: true;
	in_process_producer: false;
	host_scheduling_only: true;
	policy_hash: string;
	context_pack_hash: string;
	delivery_mode: string;
	skip_reason?: string;
	validator?: ValidatorResult;
	intent: NextStateIntent;
	evidence: Record<string, unknown>;
}

export interface RouteDeferred {
	ok: false;
	command: string;
	code: typeof WORKFLOW_ROUTE_DEFERRED;
	in_process_producer: false;
	host_scheduling_only: true;
	implemented: false;
}

export interface RouteScheduled {
	ok: true;
	implemented: true;
	command: SchedulerCommand;
	plan: CanonicalPhase[];
	axes: IndependentAxes;
	in_process_producer: false;
	host_scheduling_only: true;
	conflict_code?: "WORK_KIND_DELIVERY_MODE_CONFLICT";
	reason_code?: string;
	skip_reason?: string;
}

export type RouteResult = RouteOk | RouteDeferred | RouteScheduled;

export function isRouteOk(result: RouteResult): result is RouteOk {
	return result.ok === true && "steps" in result;
}

export function isRouteScheduled(result: RouteResult): result is RouteScheduled {
	return result.ok === true && "implemented" in result && result.implemented === true;
}

export interface CommandRouterDeps {
	supervisor: SessionSupervisor;
	config: ConfigView;
	kernelBridge?: Pick<KernelBridge, "runValidator"> &
		Partial<Pick<KernelBridge, "runSovereignOperation">>;
	env?: NodeJS.ProcessEnv;
	kernelRoot?: string;
}

export class CommandRouter {
	private readonly supervisor: SessionSupervisor;
	private readonly config: ConfigView;
	private readonly kernelBridge?: Pick<KernelBridge, "runValidator"> &
		Partial<Pick<KernelBridge, "runSovereignOperation">>;
	private readonly env?: NodeJS.ProcessEnv;
	private readonly kernelRoot?: string;

	constructor(deps: CommandRouterDeps) {
		this.supervisor = deps.supervisor;
		this.config = deps.config;
		this.kernelBridge = deps.kernelBridge;
		this.env = deps.env;
		this.kernelRoot = deps.kernelRoot;
	}

	async assemblePreSpawnContext(input: {
		phase_id: string;
		role_id: string;
		orchestrator_run_id: string;
		command?: string;
		scratchpad?: Record<string, string>;
		kernelRoot?: string;
	}): Promise<SpawnBootstrap | undefined> {
		if (!lookupSovereignRuntime(this.config)) {
			return undefined;
		}
		const phaseContext = [
			"## Phase context",
			"",
			`phase_id=${input.phase_id}`,
			`role_id=${input.role_id}`,
			`command=${input.command ?? input.phase_id}`,
		].join("\n");
		let digestBlock = "";
		let digest_entry_ids: string[] = [];
		let digest_char_count = 0;
		if (lookupSovereignMemory(this.config)) {
			if (!this.kernelBridge?.runSovereignOperation) {
				throw new WorkflowError(
					"KERNEL_SOVEREIGN_FAILED",
					"memory digest required but KernelBridge is missing",
				);
			}
			const digest = await this.kernelBridge.runSovereignOperation({
				operation: "memory_digest",
				kernelRoot: input.kernelRoot ?? this.kernelRoot,
				request: {
					schema_version: 1,
					request_id: crypto.randomUUID(),
					operation: "memory_digest",
					orchestrator_run_id: input.orchestrator_run_id,
					payload: {
						scratchpad: {
							SOVEREIGN_MEMORY: "1",
							SOVEREIGN_RUNTIME: "1",
							...(input.scratchpad ?? {}),
						},
						repo_root: input.kernelRoot ?? this.kernelRoot,
					},
				},
			});
			if (!digest.ok) {
				throw new WorkflowError(
					digest.reason_code,
					"memory digest failure blocks spawn when memory is enabled",
				);
			}
			digestBlock = String(digest.result.block ?? "");
			digest_entry_ids = Array.isArray(digest.result.entry_ids)
				? digest.result.entry_ids.map((id) => String(id))
				: [];
			digest_char_count = Number(digest.result.char_count ?? 0);
		}
		const roleObjective = `## Role objective\n\n${input.role_id}`;
		const text = composeBootstrapText({
			phaseContext,
			digestBlock: digestBlock || undefined,
			roleObjective,
		});
		return toSpawnBootstrap({
			text,
			digest_entry_ids,
			digest_char_count,
			role_objective_applied: true,
		});
	}

	listCommands(): string[] {
		return [...PROGRAMMATIC_COMMANDS, ...SCHEDULER_COMMANDS, ...DEFERRED_COMMANDS];
	}

	async route(command: RouterCommand, input: RouteInput): Promise<RouteResult> {
		if ((SCHEDULER_COMMANDS as readonly string[]).includes(command)) {
			const resolved = resolveDeliveryRoute({
				command: command as SchedulerCommand,
				config: this.config,
				startFrom: input.startFrom,
				previousDeliveryMode: input.previousDeliveryMode,
				backlogWorkKind: input.backlogWorkKind,
				backlogRecommendedDeliveryMode: input.backlogRecommendedDeliveryMode,
				acCount: input.acCount,
				hasCompanionDec: input.hasCompanionDec,
				activeSprint: input.activeSprint,
				itemKind: input.itemKind,
				componentCount: input.componentCount,
				gateEscalation: input.gateEscalation,
				yamlPath: input.yamlPath,
				kernelRoot: input.kernelRoot,
			});
			return {
				ok: true,
				implemented: true,
				command: command as SchedulerCommand,
				plan: resolved.plan,
				axes: resolved.axes,
				in_process_producer: false,
				host_scheduling_only: HOST_SCHEDULING_ONLY,
				conflict_code: resolved.conflict_code,
				reason_code: resolved.reason_code,
				skip_reason: resolved.skip_reason,
			};
		}
		if ((DEFERRED_COMMANDS as readonly string[]).includes(command)) {
			return {
				ok: false,
				command,
				code: WORKFLOW_ROUTE_DEFERRED,
				in_process_producer: false,
				host_scheduling_only: HOST_SCHEDULING_ONLY,
				implemented: false,
			};
		}
		if (!(PROGRAMMATIC_COMMANDS as readonly string[]).includes(command)) {
			throw new WorkflowError("UNKNOWN_COMMAND", `unknown command: ${command}`);
		}
		return this.runSevenSteps(command as ProgrammaticCommand, input);
	}

	private async runSevenSteps(command: ProgrammaticCommand, input: RouteInput): Promise<RouteOk> {
		const steps: CommandRouterStep[] = [];

		// (1) target/config
		const delivery_mode = lookupDeliveryMode(this.config);
		steps.push("target_config");

		// (2) preconditions
		const spawnPhase = COMMAND_SPAWN_PHASE[command] ?? command;
		const skipPlanVerify =
			command === "plan-verify" && shouldSkipPlanVerify(this.config)
				? "ultra_lean_skip_plan_verify"
				: undefined;
		if (hasNode(spawnPhase) && spawnPhase !== "intake") {
			nextCanonicalPhase("intake", this.config);
		}
		steps.push("preconditions");

		// (3) role/model/tool/context
		const resolved = resolvePhaseRole({
			phase_id: spawnPhase,
			env: this.env,
			catalog: createDefaultRoleCatalog(),
		});
		const tools = input.tools ?? [];
		assertOrchestratorSchedulingOnly([]);
		const policy_hash =
			input.policy_hash ??
			computePolicyHash({
				policy_snapshot: DEFAULT_POLICY_SNAPSHOT,
				tool_allowlist: tools,
				role_catalog_digest: sha256Canonical({
					phase_id: spawnPhase,
					role_id: resolved.role_id,
				}),
			});
		const context_pack_hash = input.context_pack_hash ?? stubContextPackHash();
		steps.push("role_model_tool_context");

		// (4) fresh-session spawn — never restore parent transcripts
		const bootstrap = await this.assemblePreSpawnContext({
			phase_id: spawnPhase,
			role_id: resolved.role_id,
			orchestrator_run_id: input.orchestrator_run_id,
			command,
			kernelRoot: input.kernelRoot,
		});
		const session = await this.supervisor.spawn({
			phase_id: spawnPhase,
			role_id: resolved.role_id,
			orchestrator_run_id: input.orchestrator_run_id,
			model_id: input.model_id,
			tools,
			policy_hash,
			parent_phase_session_id: input.parent_phase_session_id ?? null,
			bootstrap,
		});
		if (!session.fresh) {
			throw new WorkflowError("SESSION_NOT_FRESH", "CommandRouter requires a fresh session");
		}
		if (bootstrap) {
			if (
				!session.bootstrap_ack?.bootstrap_delivered ||
				session.bootstrap_ack.bootstrap_context_hash !== bootstrap.context_hash
			) {
				throw new WorkflowError(
					SOVEREIGN_BOOTSTRAP_DELIVERY_FAILED,
					"bootstrap delivery missing or hash mismatch",
				);
			}
		}
		steps.push("fresh_session_spawn");

		// (5) KernelBridge validators — consume-not-copy
		let validator: ValidatorResult | undefined;
		if (input.validator_name) {
			validator = await this.runValidator(input.validator_name, input.validator_args ?? []);
			if (!validator.pass) {
				throw new WorkflowError(
					validator.reasonCode ?? "VALIDATOR_FAILED",
					`validator ${input.validator_name} failed`,
				);
			}
		}
		steps.push("kernel_validators");

		// (6) evidence
		const evidence: Record<string, unknown> = {
			command,
			phase_id: spawnPhase,
			role_id: resolved.role_id,
			kernel_session_id: session.kernel_session_id,
			delivery_mode,
			policy_hash,
			context_pack_hash,
			skip_reason: skipPlanVerify,
			in_process_producer: false,
		};
		steps.push("evidence");

		// (7) next-state intent
		let intent: NextStateIntent;
		if (hasNode(spawnPhase)) {
			intent = intentForTransition(
				spawnPhase as CanonicalPhase,
				this.config,
				skipPlanVerify ? "completed" : "completed",
			);
			if (skipPlanVerify) {
				intent = {
					...intent,
					skip_reason: skipPlanVerify,
					next_phase: "execute",
					next_role: roleForPhase("execute", this.env),
				};
			}
		} else {
			intent = createNextStateIntent({
				next_phase: spawnPhase,
				next_role: resolved.role_id,
				stop_reason: "completed",
			});
		}
		steps.push("next_state_intent");

		if (steps.length !== 7 || steps.some((s, i) => s !== COMMAND_ROUTER_STEPS[i])) {
			throw new WorkflowError("ROUTER_STEPS_INVALID", "seven-step order violated");
		}

		return {
			ok: true,
			command,
			steps,
			phase_id: spawnPhase,
			role_id: resolved.role_id,
			session,
			fresh: true,
			in_process_producer: false,
			host_scheduling_only: HOST_SCHEDULING_ONLY,
			policy_hash,
			context_pack_hash,
			delivery_mode,
			skip_reason: skipPlanVerify,
			validator,
			intent,
			evidence,
		};
	}

	private async runValidator(name: string, args: string[]): Promise<ValidatorResult> {
		if (!(ALLOWED_VALIDATOR_NAMES as readonly string[]).includes(name)) {
			throw new KernelBridgeError(
				KERNEL_VALIDATOR_MISSING,
				`validator ${name} is not allowlisted`,
				name,
			);
		}
		if (!this.kernelBridge) {
			throw new KernelBridgeError(
				KERNEL_VALIDATOR_MISSING,
				`KernelBridge missing for validator ${name}`,
				name,
			);
		}
		return this.kernelBridge.runValidator(name, args);
	}
}

export function createCommandRouter(deps: CommandRouterDeps): CommandRouter {
	return new CommandRouter(deps);
}
