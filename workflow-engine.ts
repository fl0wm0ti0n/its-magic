import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { KernelBridge } from "@its-magic/kernel-bridge";
import type { SessionSupervisor, SupervisedSession } from "@its-magic/role-runtime";
import { crashResume } from "../recovery/crash-resume.ts";
import type { RepoCanonical, RunsStore } from "../runs/store.ts";
import {
	BLOCK_RETRY_CAP_EXHAUSTED,
	BUDGET_EXHAUSTED,
	DECISION_UNRESOLVED,
	FIX_FAILED,
	KERNEL_INCOMPATIBLE,
	QUALITY_EVIDENCE_FAILED,
	RESUME_AMBIGUOUS,
	WORKFLOW_LOOP_CAP,
} from "../stop-matrix/codes.ts";
import { applyClosure, releaseCannotMarkDone, writeReleaseEvidence } from "./closure.ts";
import {
	type CommandRouter,
	createCommandRouter,
	isRouteOk,
	type RouteInput,
	type RouteOk,
	type RouteScheduled,
} from "./command-router.ts";
import {
	type ConfigView,
	lookupAutonomyPreset,
	lookupBacklogMaxStories,
	lookupBacklogOnBlock,
	lookupBlockRetryMax,
	lookupBugMaxItems,
	lookupBugQueue,
	lookupCrossModelReview,
	lookupExecuteMaxItems,
	lookupImplementationLoop,
	lookupLoopCap,
	lookupPauseRequest,
	lookupQuiet,
	lookupSovereignRuntime,
} from "./config-view.ts";
import {
	createParallelDevCoordinator,
	kernelBridgeDeliveryAdapter,
	type ParallelDevCoordinator,
} from "./delivery/index.ts";
import {
	appendRepairLedger,
	assertCannotRelax,
	expandPresetBeforeRun,
	loadStopMatrix,
	type StopMatrixRow,
} from "./delivery-router.ts";
import { createGateEngine, type ReleaseGateInput } from "./gates/gate-engine.ts";
import { roleForPhase } from "./phase-graph.ts";
import {
	createSovereignRuntime,
	type SovereignRuntime,
	type SovereignRuntimeResult,
} from "./sovereign-runtime.ts";
import { type NextStateIntent, type ReleaseEvidence, WorkflowError } from "./types.ts";

export interface ExecuteQaCycle {
	execute: RouteOk;
	qa: RouteOk;
	critic?: SupervisedSession;
	security?: SupervisedSession;
	sovereign?: SovereignRuntimeResult;
	qa_pass: boolean;
}

export interface ExecuteQaLoopResult {
	cycles: ExecuteQaCycle[];
	passed: boolean;
	producer_role: string;
	supplementary_roles: string[];
	intent: NextStateIntent;
	codes?: string[];
	sovereign?: SovereignRuntimeResult;
}

export interface HookResult {
	critic?: SupervisedSession;
	security?: SupervisedSession;
	sovereign?: SovereignRuntimeResult;
}

export interface DrainItem {
	id: string;
	kind?: "story" | "bug";
	story_id?: string;
	acCount?: number;
	hasCompanionDec?: boolean;
	activeSprint?: boolean;
	blocked?: boolean;
	decisionUnresolved?: boolean;
	qualityFailed?: boolean;
	kernelIncompatible?: boolean;
	resumeAmbiguous?: boolean;
}

export interface AutoRunInput extends RouteInput {
	items?: DrainItem[];
	store?: RunsStore;
	ledgerRoot?: string;
	now?: string;
	tokenBudgetRemaining?: number;
	pauseRequested?: boolean;
	approvalGranted?: boolean;
	repo?: RepoCanonical;
	brief?: { last_completed_phase?: string; intended_resume_phase?: string; stale?: boolean };
	resume?: boolean;
}

export interface AutoRunResult {
	command: "/auto" | "/quick";
	scheduled: RouteScheduled;
	items_processed: number;
	bugs_drained: number;
	preset_expanded: Record<string, string>;
	preset: string;
	passed: boolean;
	intent: NextStateIntent;
	codes?: string[];
	ledger_path?: string;
	critic_scheduled: boolean;
	critic_content: boolean;
	sovereign?: SovereignRuntimeResult;
	resumed?: boolean;
}

export interface WorkflowAppPort {
	start(req: {
		id: string;
		run_id: string;
		phase_id: string;
		cwd: string;
		command?: string;
		url?: string;
		ports?: number[];
		health_path?: string;
	}): Promise<{ id: string; url?: string }>;
	health(id: string): Promise<{ ok: boolean; health?: string; reason_code?: string }>;
	restart(id: string): Promise<{ id: string; url?: string }>;
	getRestartMax(): number;
	logs(id: string): string[];
	cleanup(reason: "success" | "failure" | "cancel" | "runtime_restart"): Promise<{
		reason_code?: string;
	}>;
	snapshotHealth?(id?: string): { ok: boolean; reason_code?: string };
}

export interface WorkflowBrowserPort {
	evidenceRoot: string;
	driver: { kind: string };
	perform(req: {
		action: "navigate" | "snapshot" | "open" | "type";
		url?: string;
		account_ref?: string;
		operator_approved?: boolean;
	}): Promise<{
		passed: boolean;
		reason_code: string;
		trace_ref?: string;
		final_url?: string;
		app_runtime_ref?: string;
		browser_evidence_refs?: {
			screenshots?: string[];
			console_summary?: string;
			network_summary?: string;
		};
	}>;
	withRetry<T>(op: () => Promise<T>, classifiable: string): Promise<T>;
	bindAppRuntime?(id: string): string;
}

export interface WorkflowEngineDeps {
	supervisor: SessionSupervisor;
	config: ConfigView;
	kernelBridge?: Pick<KernelBridge, "runValidator" | "runStatusReconcile"> &
		Partial<Pick<KernelBridge, "runSovereignOperation" | "runDeliveryOperation">>;
	env?: NodeJS.ProcessEnv;
	qaPass?: (cycle: number) => boolean;
	kernelRoot?: string;
	app?: WorkflowAppPort;
	browser?: WorkflowBrowserPort;
	evidenceRoot?: string;
}

export class WorkflowEngine {
	readonly router: CommandRouter;
	private readonly supervisor: SessionSupervisor;
	private readonly config: ConfigView;
	private readonly kernelBridge?: Pick<KernelBridge, "runValidator" | "runStatusReconcile"> &
		Partial<Pick<KernelBridge, "runSovereignOperation" | "runDeliveryOperation">>;
	private readonly env?: NodeJS.ProcessEnv;
	private readonly qaPass: (cycle: number) => boolean;
	private readonly app?: WorkflowAppPort;
	private readonly browser?: WorkflowBrowserPort;
	private readonly evidenceRoot?: string;
	readonly phaseEvidence: Partial<Record<"execute" | "qa" | "uat" | "release", boolean>> = {};
	private readonly gates = createGateEngine();
	readonly sovereign: SovereignRuntime;
	readonly parallelDev: ParallelDevCoordinator;

	constructor(deps: WorkflowEngineDeps) {
		this.supervisor = deps.supervisor;
		this.config = deps.config;
		this.kernelBridge = deps.kernelBridge;
		this.env = deps.env;
		this.qaPass = deps.qaPass ?? (() => true);
		this.app = deps.app;
		this.browser = deps.browser;
		this.evidenceRoot = deps.evidenceRoot;
		this.sovereign = createSovereignRuntime({
			config: deps.config,
			kernelBridge: deps.kernelBridge,
			kernelRoot: deps.kernelRoot,
		});
		const deliveryBridge =
			deps.kernelBridge?.runDeliveryOperation !== undefined
				? kernelBridgeDeliveryAdapter(
						deps.kernelBridge as Pick<KernelBridge, "runDeliveryOperation">,
					)
				: undefined;
		this.parallelDev = createParallelDevCoordinator({
			config: deps.config,
			supervisor: deps.supervisor,
			bridge: deliveryBridge,
			kernelRoot: deps.kernelRoot,
		});
		this.router = createCommandRouter({
			supervisor: deps.supervisor,
			config: deps.config,
			kernelBridge: deps.kernelBridge,
			env: deps.env,
			kernelRoot: deps.kernelRoot,
		});
	}

	async runCommand(command: string, input: RouteInput) {
		return this.router.route(command, input);
	}

	async runAuto(input: AutoRunInput): Promise<AutoRunResult> {
		return this.runScheduler("/auto", input);
	}

	async runQuick(input: AutoRunInput): Promise<AutoRunResult> {
		return this.runScheduler("/quick", input);
	}

	private async runScheduler(
		command: "/auto" | "/quick",
		input: AutoRunInput,
	): Promise<AutoRunResult> {
		const preset = lookupAutonomyPreset(this.config);
		const expanded = expandPresetBeforeRun(this.config);
		const matrix = loadStopMatrix({
			yamlPath: input.yamlPath,
			kernelRoot: input.kernelRoot,
		});
		if (input.tokenBudgetRemaining !== undefined && input.tokenBudgetRemaining <= 0) {
			this.failNonRelaxable(BUDGET_EXHAUSTED, matrix, preset);
		}
		if (input.pauseRequested || lookupPauseRequest(this.config)) {
			return this.stopped(command, input, "pause_request", ["AUTO_PAUSE_REQUEST"], expanded);
		}
		if (preset === "none" && input.approvalGranted === false) {
			return this.stopped(command, input, "missing_input", ["APPROVAL_REQUIRED"], expanded);
		}
		if (input.resume) {
			if (input.brief?.stale) {
				this.failNonRelaxable(RESUME_AMBIGUOUS, matrix, preset);
			}
			if (!input.store) {
				this.failNonRelaxable(RESUME_AMBIGUOUS, matrix, preset);
			} else {
				await crashResume({
					supervisor: this.supervisor,
					store: input.store,
					config: this.config,
					repo: input.repo ?? {
						backlog_status: "OPEN",
						acceptance_done: false,
						sprint_done: false,
					},
					brief: input.brief ?? { stale: false, intended_resume_phase: "execute" },
					orchestrator_run_id: input.orchestrator_run_id,
					model_id: input.model_id,
					now: input.now,
				});
			}
		}

		const routed = await this.router.route(command, input);
		if (!routed.ok || !("implemented" in routed) || !routed.implemented) {
			throw new WorkflowError("WORKFLOW_ROUTE_DEFERRED", `${command} is not implemented`);
		}
		const scheduled = routed;

		const items = input.items ?? [{ id: input.orchestrator_run_id, kind: "story" }];
		const bugQueue = lookupBugQueue(this.config);
		const bugMax = lookupBugMaxItems(this.config);
		const storyCap = Math.min(
			lookupBacklogMaxStories(this.config),
			lookupExecuteMaxItems(this.config),
		);
		const onBlock = lookupBacklogOnBlock(this.config);
		const retryMax = lookupBlockRetryMax(this.config);
		const quiet = lookupQuiet(this.config);
		let processed = 0;
		let bugs = 0;
		let criticScheduled = false;
		let criticContent = false;
		let sovereignResult: SovereignRuntimeResult | undefined;
		const now = input.now ?? "2026-09-14T07:50:00Z";

		for (const item of items) {
			if (item.kind === "bug") {
				if (!bugQueue) {
					continue;
				}
				if (bugMax > 0 && bugs >= bugMax) {
					break;
				}
			} else if (processed >= storyCap) {
				throw new WorkflowError(WORKFLOW_LOOP_CAP, "AUTO_BACKLOG_MAX_STORIES exhausted", [
					BLOCK_RETRY_CAP_EXHAUSTED,
					BUDGET_EXHAUSTED,
				]);
			}
			if (item.decisionUnresolved) {
				this.failNonRelaxable(DECISION_UNRESOLVED, matrix, preset);
			}
			if (item.kernelIncompatible) {
				this.failNonRelaxable(KERNEL_INCOMPATIBLE, matrix, preset);
			}
			if (item.resumeAmbiguous) {
				this.failNonRelaxable(RESUME_AMBIGUOUS, matrix, preset);
			}
			if (item.qualityFailed) {
				this.failNonRelaxable(QUALITY_EVIDENCE_FAILED, matrix, preset);
			}
			if (item.blocked) {
				if (onBlock === "stop" || preset === "none") {
					throw new WorkflowError(BLOCK_RETRY_CAP_EXHAUSTED, `item ${item.id} blocked`, [
						FIX_FAILED,
					]);
				}
				this.writeLedger(input, scheduled, item, "skip", onBlock, expanded, matrix);
				continue;
			}

			const plan = scheduled.plan;
			const executeAt = plan.indexOf("execute");
			const prefix = executeAt >= 0 ? plan.slice(0, executeAt) : [];
			for (const phase of prefix) {
				await this.requireOk(phase, input);
			}

			let retries = 0;
			let qaOk = !plan.includes("execute") && !plan.includes("qa");
			if (plan.includes("execute") || plan.includes("qa")) {
				while (retries <= retryMax) {
					const loop = await this.runExecuteQaLoop(input);
					if (
						lookupCrossModelReview(this.config) &&
						loop.supplementary_roles.includes("tech-lead")
					) {
						criticScheduled = true;
					}
					if (loop.sovereign?.ok) {
						criticContent = true;
						sovereignResult = loop.sovereign;
					}
					if (loop.passed) {
						qaOk = true;
						break;
					}
					retries += 1;
					if (retries > retryMax) {
						throw new WorkflowError(
							BLOCK_RETRY_CAP_EXHAUSTED,
							`block retry cap exhausted for ${item.id}`,
							[FIX_FAILED, WORKFLOW_LOOP_CAP],
						);
					}
				}
			}
			if (!qaOk) {
				this.failNonRelaxable(QUALITY_EVIDENCE_FAILED, matrix, preset);
			}

			const rest =
				executeAt >= 0
					? plan.slice(executeAt + 1).filter((phase) => phase !== "qa")
					: plan.filter((phase) => phase !== "execute" && phase !== "qa");
			for (const phase of rest) {
				if (phase === "verify-work") {
					this.rememberPhaseEvidence("uat");
				}
				if (phase === "release") {
					const gates = this.evaluateRelease(
						await this.prepareReleaseGate({
							tests_pass: true,
							qa_evidence: true,
							uat_pass: true,
							artifact_refs: ["sprints/S0151/summary.md"],
						}),
					);
					if (!gates.ok) {
						this.failNonRelaxable(QUALITY_EVIDENCE_FAILED, matrix, preset);
					}
				}
				await this.requireOk(phase, input);
			}

			this.writeLedger(input, scheduled, item, "advance", undefined, expanded, matrix, retries);
			if (input.store) {
				input.store.audit(item.id, "drain_item", JSON.stringify({ command, retries, quiet }), now);
			}
			if (item.kind === "bug") {
				bugs += 1;
			} else {
				processed += 1;
			}
		}

		return {
			command,
			scheduled,
			items_processed: processed,
			bugs_drained: bugs,
			preset_expanded: expanded,
			preset,
			passed: true,
			intent: {
				schema_version: 1,
				next_phase: "refresh-context",
				next_role: roleForPhase("refresh-context", this.env),
				stop_reason: "completed",
			},
			ledger_path: input.ledgerRoot
				? appendRepairLedger(
						input.orchestrator_run_id,
						{
							event: "run_complete",
							phase_selection: scheduled.plan.join(","),
							axes: scheduled.axes,
							repair_kind: "n/a",
							cap_remaining: retryMax,
						},
						{ root: input.ledgerRoot, now },
					)
				: undefined,
			critic_scheduled: criticScheduled,
			critic_content: criticContent,
			sovereign: sovereignResult,
			resumed: Boolean(input.resume),
		};
	}

	private failNonRelaxable(code: string, matrix: StopMatrixRow[], preset: string): never {
		assertCannotRelax(code, matrix, preset);
		throw new WorkflowError(code, `${code} is non-relaxable`);
	}

	private stopped(
		command: "/auto" | "/quick",
		_input: AutoRunInput,
		stop_reason: NextStateIntent["stop_reason"],
		codes: string[],
		expanded: Record<string, string>,
	): AutoRunResult {
		void _input;
		return {
			command,
			scheduled: {
				ok: true,
				implemented: true,
				command,
				plan: [],
				axes: {
					delivery_mode: this.config.delivery?.DELIVERY_MODE ?? "standard",
					token_profile: this.config.token?.TOKEN_PROFILE ?? "balanced",
					voice: "CAVEMAN_MODE=0;CAVEMAN_LEVEL=;CAVEMAN_COMPRESS_INPUT=0",
					autonomy_preset: lookupAutonomyPreset(this.config),
					work_kind_routing: "0",
				},
				in_process_producer: false,
				host_scheduling_only: true,
			},
			items_processed: 0,
			bugs_drained: 0,
			preset_expanded: expanded,
			preset: lookupAutonomyPreset(this.config),
			passed: false,
			intent: {
				schema_version: 1,
				next_phase: "execute",
				next_role: roleForPhase("execute", this.env),
				stop_reason,
			},
			codes,
			critic_scheduled: false,
			critic_content: false,
		};
	}

	private writeLedger(
		input: AutoRunInput,
		scheduled: RouteScheduled,
		item: DrainItem,
		resumeChoice: string,
		skip: string | undefined,
		expanded: Record<string, string>,
		matrix: StopMatrixRow[],
		retries = 0,
	): void {
		void expanded;
		void matrix;
		if (!input.ledgerRoot) {
			return;
		}
		appendRepairLedger(
			input.orchestrator_run_id,
			{
				event: "drain_item",
				phase_selection: scheduled.plan.join(","),
				retries,
				skips: skip ? [skip] : [],
				stop_reason: skip,
				resume_choice: resumeChoice,
				repair_kind: "n/a",
				cap_remaining: lookupBlockRetryMax(this.config) - retries,
				axes: scheduled.axes,
				reason_code: item.id,
			},
			{ root: input.ledgerRoot, now: input.now },
		);
	}

	async runExecuteQaLoop(input: RouteInput): Promise<ExecuteQaLoopResult> {
		const loopOn = lookupImplementationLoop(this.config);
		const cap = lookupLoopCap(this.config);
		const cycles: ExecuteQaCycle[] = [];
		const supplementary_roles: string[] = [];
		const max = loopOn ? cap : 1;

		for (let i = 0; i < max; i += 1) {
			const execute = await this.requireOk("execute", input);
			this.rememberPhaseEvidence("execute");
			const parallelBefore = this.parallelDev.noopSnapshot();
			const parallelHook = this.parallelDev.enabled()
				? await this.parallelDev.afterExecutePass({
						orchestrator_run_id: input.orchestrator_run_id,
						story_id: input.orchestrator_run_id,
						model_id: input.model_id,
						kernel_root: input.kernelRoot,
						producer_session_id: execute.session.kernel_session_id,
					})
				: parallelBefore;
			void parallelHook;
			const hooks = await this.scheduleSupplementaryHooks(execute, input);
			if (hooks.critic) {
				supplementary_roles.push(hooks.critic.role_id);
			}
			if (hooks.security) {
				supplementary_roles.push(hooks.security.role_id);
			}
			const qa = await this.requireOk("qa", {
				...input,
				parent_phase_session_id: execute.session.kernel_session_id,
			});
			this.rememberPhaseEvidence("qa");
			const qa_pass = this.qaPass(i);
			cycles.push({
				execute,
				qa,
				critic: hooks.critic,
				security: hooks.security,
				sovereign: hooks.sovereign,
				qa_pass,
			});
			if (qa_pass) {
				return {
					cycles,
					passed: true,
					producer_role: execute.role_id,
					supplementary_roles,
					sovereign: hooks.sovereign,
					intent: {
						schema_version: 1,
						next_phase: "verify-work",
						next_role: roleForPhase("verify-work", this.env),
						stop_reason: "completed",
					},
				};
			}
		}

		if (loopOn) {
			throw new WorkflowError(
				WORKFLOW_LOOP_CAP,
				`execute↔qa loop exhausted at ${cap}`,
				[FIX_FAILED, BLOCK_RETRY_CAP_EXHAUSTED],
				{
					schema_version: 1,
					next_phase: "qa",
					next_role: roleForPhase("qa", this.env),
					stop_reason: "loop_max",
					gate_code: WORKFLOW_LOOP_CAP,
				},
			);
		}
		return {
			cycles,
			passed: false,
			producer_role: cycles[0]?.execute.role_id ?? "dev",
			supplementary_roles,
			intent: {
				schema_version: 1,
				next_phase: "qa",
				next_role: roleForPhase("qa", this.env),
				stop_reason: "blocked",
				gate_code: "QA_FAILED",
			},
			codes: ["QA_FAILED"],
		};
	}

	async scheduleSupplementaryHooks(producer: RouteOk, input: RouteInput): Promise<HookResult> {
		const out: HookResult = {};
		if (lookupCrossModelReview(this.config)) {
			out.critic = await this.supervisor.spawn({
				phase_id: "sovereign-critic",
				role_id: "tech-lead",
				orchestrator_run_id: input.orchestrator_run_id,
				model_id: input.model_id,
				parent_phase_session_id: producer.session.kernel_session_id,
				tools: [],
				policy_hash: producer.policy_hash,
			});
		}
		if (lookupSovereignRuntime(this.config) && lookupCrossModelReview(this.config)) {
			const sovereign = await this.sovereign.afterProducerBoundary({
				orchestrator_run_id: input.orchestrator_run_id,
				producer_model_id: input.model_id,
				phase_id: producer.phase_id,
				producer_role: producer.role_id,
				producer_evidence_ref: String(producer.session.kernel_session_id),
			});
			if (sovereign && sovereign.ok === false) {
				throw new WorkflowError(sovereign.reason_code, sovereign.remediation);
			}
			out.sovereign = sovereign;
		}
		return out;
	}

	async spawnSecurityReview(producer: RouteOk, input: RouteInput): Promise<SupervisedSession> {
		return this.supervisor.spawn({
			phase_id: "security-review",
			role_id: "security",
			orchestrator_run_id: input.orchestrator_run_id,
			model_id: input.model_id,
			parent_phase_session_id: producer.session.kernel_session_id,
			tools: [],
			policy_hash: producer.policy_hash,
		});
	}

	evaluateRelease(input: ReleaseGateInput) {
		return this.gates.evaluate(input);
	}

	/** Execute, QA, UAT, and release read repository evidence when services are owned. */
	rememberPhaseEvidence(phase: "execute" | "qa" | "uat" | "release"): boolean {
		if (!this.app || !this.browser) {
			return false;
		}
		const pass = this.repositoryUatPass(this.browser.evidenceRoot || this.evidenceRoot || "");
		this.phaseEvidence[phase] = pass;
		return pass;
	}

	/**
	 * Sets `uat_pass` from app start/health, a browser probe, and bounded retry.
	 * Engines without those services keep the caller input.
	 */
	async prepareReleaseGate(base: ReleaseGateInput): Promise<ReleaseGateInput> {
		if (!this.app || !this.browser) {
			return base;
		}
		const uat_pass = await this.collectUatPass();
		this.phaseEvidence.release = uat_pass;
		return { ...base, uat_pass };
	}

	private async collectUatPass(): Promise<boolean> {
		const app = this.app;
		const browser = this.browser;
		if (!app || !browser) {
			return false;
		}
		const root = browser.evidenceRoot || this.evidenceRoot || "";
		let healthOk = false;
		let handleId = "gate-app";
		let url = "http://127.0.0.1/";
		try {
			const handle = await app.start({
				id: handleId,
				run_id: "gate",
				phase_id: "execute",
				cwd: root || ".",
				url,
			});
			handleId = handle.id;
			url = handle.url || url;
			let health = await app.health(handleId);
			let used = 0;
			const cap = app.getRestartMax();
			while (!health.ok && used < cap) {
				used += 1;
				try {
					const restarted = await app.restart(handleId);
					handleId = restarted.id || handleId;
					url = restarted.url || url;
				} catch {
					health = { ok: false };
					break;
				}
				health = await app.health(handleId);
			}
			healthOk = health.ok;
		} catch {
			healthOk = false;
		}
		if (!healthOk) {
			return false;
		}
		try {
			await browser.withRetry(
				() => browser.perform({ action: "navigate", url }),
				"BROWSER_CRASHED",
			);
			browser.bindAppRuntime?.(handleId);
		} catch {
			return false;
		}
		return this.repositoryUatPass(root);
	}

	private repositoryUatPass(root: string): boolean {
		if (!root) {
			return false;
		}
		const dir = join(root, ".its-magic", "runtime", "browser-evidence");
		if (!existsSync(dir)) {
			return false;
		}
		const files = readdirSync(dir)
			.filter((name) => name.startsWith("probe-") && name.endsWith(".json"))
			.sort();
		const latest = files.at(-1);
		if (!latest) {
			return false;
		}
		let record: {
			passed?: boolean;
			trace_ref?: string;
			final_url?: string;
			app_runtime_ref?: string;
			browser_evidence_refs?: {
				screenshots?: string[];
				console_summary?: string;
				network_summary?: string;
			};
		};
		try {
			record = JSON.parse(readFileSync(join(dir, latest), "utf8")) as typeof record;
		} catch {
			return false;
		}
		if (record.passed !== true) {
			return false;
		}
		const refs = record.browser_evidence_refs ?? {};
		const shots = refs.screenshots ?? [];
		if (shots.length === 0 || !refs.console_summary || !refs.network_summary) {
			return false;
		}
		if (!record.trace_ref || !record.final_url || !record.app_runtime_ref) {
			return false;
		}
		for (const shot of shots) {
			if (shot.includes("screenshot-placeholder")) {
				return false;
			}
			if (existsSync(shot)) {
				const body = readFileSync(shot);
				if (body.toString("utf8") === "screenshot-placeholder") {
					return false;
				}
			}
		}
		return true;
	}

	writeRelease(evidence: ReleaseEvidence, gates: ReleaseGateInput) {
		const written = writeReleaseEvidence(evidence, gates);
		return { ...written, ...releaseCannotMarkDone() };
	}

	async close(evidence: ReleaseEvidence | null | undefined) {
		return applyClosure(evidence, { kernelBridge: this.kernelBridge });
	}

	async runStandardLifecycle(
		input: RouteInput,
		phases: string[] = [
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
			"closure",
			"refresh-context",
		],
	): Promise<RouteOk[]> {
		const results: RouteOk[] = [];
		for (const phase of phases) {
			if (phase === "plan-verify" && this.config.delivery?.DELIVERY_MODE === "ultra_lean") {
				const skipped = await this.requireOk("plan-verify", input);
				results.push(skipped);
				continue;
			}
			results.push(await this.requireOk(phase, input));
		}
		return results;
	}

	private async requireOk(command: string, input: RouteInput): Promise<RouteOk> {
		const result = await this.router.route(command, input);
		if (!isRouteOk(result)) {
			const code = !result.ok ? result.code : "WORKFLOW_ROUTE_DEFERRED";
			throw new WorkflowError(code, `command ${command} deferred`);
		}
		return result;
	}
}

export function createWorkflowEngine(deps: WorkflowEngineDeps): WorkflowEngine {
	return new WorkflowEngine(deps);
}
