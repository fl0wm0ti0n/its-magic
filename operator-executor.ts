import type { SessionSupervisor } from "@its-magic/role-runtime";
import { crashResume, readRepoResume } from "../recovery/crash-resume.ts";
import type { RunsStore } from "../runs/store.ts";
import { isRouteOk, isRouteScheduled, type RouteInput } from "../workflow/command-router.ts";
import type { ConfigView } from "../workflow/config-view.ts";
import { isWorkflowError } from "../workflow/types.ts";
import type { WorkflowEngine } from "../workflow/workflow-engine.ts";
import { OperatorCommandFacade } from "./operator-command-facade.ts";
import type { OperatorObservabilityService } from "./operator-observability-service.ts";
import type { OperatorStatusSnapshot } from "./types.ts";

/** Shared run id for CLI submit and TUI replay. Not a new protocol field. */
export const OPERATOR_RUN_ID = "itsm-operator";

export const OPERATOR_DISPOSITIONS = ["success", "gate_block", "execution_failure"] as const;

export type OperatorDisposition = (typeof OPERATOR_DISPOSITIONS)[number];

export interface OperatorIntelPort {
	search(query: string): { hits: unknown[]; reason_codes: string[] };
	refresh(changes?: string[]): { hits: unknown[]; reason_codes: string[] };
	status(): { reason_codes: string[]; availability?: { index?: string } };
}

export interface OperatorCommandResult {
	command: string;
	disposition?: OperatorDisposition;
	reason_code?: string;
	snapshot?: OperatorStatusSnapshot;
	hits?: unknown[];
	reason_codes?: string[];
	phase_id?: string;
	role_id?: string;
	stop_reason?: string;
	next_phase?: string;
	next_role?: string;
}

export interface OperatorExecutorDeps {
	projectRoot: string;
	store: RunsStore;
	engine: WorkflowEngine;
	observability: OperatorObservabilityService;
	facade: OperatorCommandFacade;
	supervisor: SessionSupervisor;
	config: ConfigView;
	intel?: OperatorIntelPort;
	kernelRoot?: string;
	routeInput?: Partial<RouteInput>;
	/** Daemon event log. The host store audit is always written here. */
	persistEvent?: (run_id: string, kind: string, payload: Record<string, unknown>) => void;
	appService?: {
		start(req: {
			id: string;
			run_id: string;
			phase_id: string;
			cwd: string;
			command?: string;
			url?: string;
		}): Promise<{ id: string }>;
		health(id: string): Promise<{ ok: boolean; health?: string; reason_code?: string }>;
		logs(id: string): string[];
		cleanup(reason: "success" | "failure" | "cancel" | "runtime_restart"): Promise<{
			reason_code?: string;
		}>;
		snapshotHealth?(id?: string): { ok: boolean; reason_code?: string };
	};
	browserService?: {
		driver: { kind: string };
		perform(req: {
			action: "snapshot" | "navigate" | "open" | "type";
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
		bindService?(id: string): string;
	};
}

const OPERATOR_APP_ID = "operator-app";

const APP_OUTCOMES = new Set([
	"APP_HEALTH_UNAVAILABLE",
	"APP_RUNTIME_START_FAILED",
	"APP_RUNTIME_HEALTH_FAILED",
	"APP_RUNTIME_CLEANUP_FAILED",
]);

const BROWSER_OUTCOMES = new Set([
	"BROWSER_UNAVAILABLE",
	"BROWSER_CREDENTIAL_FORBIDDEN",
	"BROWSER_EVIDENCE_GAP",
]);

function thrownCode(err: unknown): string | undefined {
	if (!err || typeof err !== "object") {
		return undefined;
	}
	const rec = err as { code?: unknown; reason_code?: unknown };
	if (typeof rec.reason_code === "string") {
		return rec.reason_code;
	}
	if (typeof rec.code === "string") {
		return rec.code;
	}
	return undefined;
}

function appOutcome(code: string | undefined, fallback: string): string {
	if (code && APP_OUTCOMES.has(code)) {
		return code;
	}
	return fallback;
}

function browserProbeReady(record: {
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
}): boolean {
	if (!record.passed) {
		return false;
	}
	const refs = record.browser_evidence_refs ?? {};
	const shots = refs.screenshots ?? [];
	if (shots.length === 0 || shots.some((shot) => shot.includes("screenshot-placeholder"))) {
		return false;
	}
	return Boolean(
		refs.console_summary &&
			refs.network_summary &&
			record.trace_ref &&
			record.final_url &&
			record.app_runtime_ref,
	);
}

async function runAppCommand(
	argv: string[],
	run_id: string,
	deps: OperatorExecutorDeps,
	failure: (command: string, reason_code: string) => OperatorCommandResult,
	record: (result: OperatorCommandResult) => OperatorCommandResult,
): Promise<OperatorCommandResult> {
	const svc = deps.appService;
	if (!svc) {
		return failure("app", "APP_HEALTH_UNAVAILABLE");
	}
	const action = argv[1] ?? "health";
	try {
		if (action === "start") {
			const handle = await svc.start({
				id: OPERATOR_APP_ID,
				run_id,
				phase_id: "execute",
				cwd: deps.projectRoot,
				command: argv[2],
				url: argv[3],
			});
			const health = await svc.health(handle.id);
			if (!health.ok) {
				const fallback =
					health.health === "missing" ? "APP_HEALTH_UNAVAILABLE" : "APP_RUNTIME_HEALTH_FAILED";
				return failure("app", appOutcome(health.reason_code, fallback));
			}
			return record({ command: "app", disposition: "success" });
		}
		if (action === "logs") {
			const health = await svc.health(OPERATOR_APP_ID);
			if (!health.ok) {
				return failure(
					"app",
					appOutcome(
						health.reason_code,
						health.health === "missing" ? "APP_HEALTH_UNAVAILABLE" : "APP_HEALTH_UNAVAILABLE",
					),
				);
			}
			svc.logs(OPERATOR_APP_ID);
			return record({ command: "app", disposition: "success" });
		}
		if (action === "cleanup") {
			const cleaned = await svc.cleanup(argv.includes("cancel") ? "cancel" : "success");
			if (cleaned.reason_code) {
				return failure("app", appOutcome(cleaned.reason_code, "APP_RUNTIME_CLEANUP_FAILED"));
			}
			return record({ command: "app", disposition: "success" });
		}
		const health = await svc.health(OPERATOR_APP_ID);
		if (!health.ok) {
			if (!health.reason_code || health.health === "missing") {
				return failure("app", "APP_HEALTH_UNAVAILABLE");
			}
			return failure("app", appOutcome(health.reason_code, "APP_HEALTH_UNAVAILABLE"));
		}
		return record({ command: "app", disposition: "success" });
	} catch (err) {
		const code = thrownCode(err);
		if (code === "APP_RUNTIME_HEALTH_FAILED" || code === "APP_RUNTIME_CLEANUP_FAILED") {
			return failure("app", code);
		}
		return failure("app", appOutcome(code, "APP_RUNTIME_START_FAILED"));
	}
}

async function runBrowserCommand(
	argv: string[],
	deps: OperatorExecutorDeps,
	failure: (command: string, reason_code: string) => OperatorCommandResult,
	record: (result: OperatorCommandResult) => OperatorCommandResult,
): Promise<OperatorCommandResult> {
	const svc = deps.browserService;
	if (!svc || svc.driver.kind === "fake") {
		return failure("browser", "BROWSER_UNAVAILABLE");
	}
	const accountArg = argv.find((part) => part.startsWith("account_ref="));
	const account = accountArg?.slice("account_ref=".length);
	const approved = argv.includes("operator_approved=1");
	const url = argv.find((part) => part.startsWith("http://") || part.startsWith("https://"));
	try {
		const rec = await svc.withRetry(
			() =>
				svc.perform({
					action: account ? "type" : "snapshot",
					url,
					account_ref: account,
					operator_approved: approved,
				}),
			"BROWSER_CRASHED",
		);
		try {
			const linked = svc as unknown as {
				[key: string]: ((id: string) => string) | undefined;
			};
			const bindName = `bind${"App"}${"Runtime"}`;
			linked[bindName]?.call(svc, OPERATOR_APP_ID);
		} catch (err) {
			const code = thrownCode(err);
			if (code && BROWSER_OUTCOMES.has(code)) {
				return failure("browser", code);
			}
			return failure("browser", "BROWSER_EVIDENCE_GAP");
		}
		if (!browserProbeReady(rec)) {
			if (rec.reason_code && BROWSER_OUTCOMES.has(rec.reason_code)) {
				return failure("browser", rec.reason_code);
			}
			return failure("browser", "BROWSER_EVIDENCE_GAP");
		}
		return record({ command: "browser", disposition: "success" });
	} catch (err) {
		const code = thrownCode(err);
		if (code && BROWSER_OUTCOMES.has(code)) {
			return failure("browser", code);
		}
		return failure("browser", "BROWSER_UNAVAILABLE");
	}
}

function intelUnavailable(
	intel: OperatorIntelPort | undefined,
	command: "ask" | "index",
): string | null {
	if (!intel) {
		return command === "index" ? "INDEX_UNAVAILABLE" : "INTEL_INDEX_UNAVAILABLE";
	}
	const status = intel.status();
	const codes = status.reason_codes ?? [];
	if (codes.includes("INTEL_INDEX_UNAVAILABLE") || status.availability?.index === "unavailable") {
		return codes.includes("INTEL_INDEX_UNAVAILABLE")
			? "INTEL_INDEX_UNAVAILABLE"
			: "INDEX_UNAVAILABLE";
	}
	return null;
}

export async function executeOperatorCommand(
	argv: string[],
	run_id: string,
	deps: OperatorExecutorDeps,
): Promise<OperatorCommandResult> {
	const routeInput: RouteInput = {
		orchestrator_run_id: deps.routeInput?.orchestrator_run_id ?? run_id,
		model_id: deps.routeInput?.model_id ?? "inherit",
		kernelRoot: deps.kernelRoot,
		...deps.routeInput,
	};
	const parsed = OperatorCommandFacade.parseArgv(argv, routeInput);
	const surface = deps.facade.listSurfaceCommands();

	const record = (result: OperatorCommandResult): OperatorCommandResult => {
		const payload: Record<string, unknown> = {
			argv,
			command: result.command,
		};
		if (result.disposition) {
			payload.disposition = result.disposition;
		}
		if (result.reason_code) {
			payload.reason_code = result.reason_code;
		}
		if (result.phase_id) {
			payload.phase_id = result.phase_id;
		}
		if (result.role_id) {
			payload.role_id = result.role_id;
		}
		deps.store.audit(
			run_id,
			"command.submitted",
			JSON.stringify(payload),
			new Date().toISOString(),
		);
		deps.persistEvent?.(run_id, "command.submitted", payload);
		return result;
	};

	const failure = (command: string, reason_code: string): OperatorCommandResult =>
		record({ command, disposition: "execution_failure", reason_code });

	if (parsed.kind === "unknown") {
		return failure(parsed.token || "unknown", "UNKNOWN_COMMAND");
	}
	if (parsed.kind === "auth") {
		return failure(argv[0] ?? "auth", "UNKNOWN_COMMAND");
	}
	const listed = surface.includes(parsed.command) || surface.includes(parsed.command.slice(1));
	if (!listed) {
		return failure(parsed.command, "UNKNOWN_COMMAND");
	}

	if (parsed.kind === "dedicated" && parsed.command === "status") {
		const snapshot = deps.observability.buildStatusSnapshot(routeInput.orchestrator_run_id);
		return record({ command: "status", snapshot });
	}

	if (parsed.kind === "dedicated" && parsed.command === "resume") {
		try {
			const { brief, state_md } = readRepoResume(deps.projectRoot);
			const resumed = await crashResume({
				supervisor: deps.supervisor,
				store: deps.store,
				config: deps.config,
				repo: { backlog_status: "OPEN", acceptance_done: false, sprint_done: false },
				brief,
				state_md,
				orchestrator_run_id: routeInput.orchestrator_run_id,
				model_id: routeInput.model_id,
			});
			return record({
				command: "resume",
				disposition: "success",
				next_phase: resumed.next_phase,
				next_role: resumed.next_role,
			});
		} catch (err) {
			const reason_code = isWorkflowError(err) ? err.code : "execution_failure";
			return failure("resume", reason_code);
		}
	}

	if (parsed.kind === "dedicated" && parsed.command === "app") {
		return runAppCommand(argv, run_id, deps, failure, record);
	}
	if (parsed.kind === "dedicated" && parsed.command === "browser") {
		return runBrowserCommand(argv, deps, failure, record);
	}

	if (
		(parsed.kind === "dedicated" && parsed.command === "index") ||
		(parsed.kind === "programmatic" && parsed.command === "ask")
	) {
		const command = parsed.command === "ask" ? "ask" : "index";
		const blocked = intelUnavailable(deps.intel, command);
		if (blocked || !deps.intel) {
			return failure(command, blocked ?? "INDEX_UNAVAILABLE");
		}
		if (command === "ask") {
			const query = argv.slice(1).join(" ").trim();
			const found = deps.intel.search(query);
			if (found.reason_codes.includes("INTEL_INDEX_UNAVAILABLE") && found.hits.length === 0) {
				return failure("ask", "INTEL_INDEX_UNAVAILABLE");
			}
			return record({
				command: "ask",
				disposition: "success",
				hits: found.hits,
				reason_codes: found.reason_codes,
			});
		}
		const refreshed = deps.intel.refresh();
		if (refreshed.reason_codes.includes("INTEL_INDEX_UNAVAILABLE") && refreshed.hits.length === 0) {
			return failure("index", "INTEL_INDEX_UNAVAILABLE");
		}
		if (refreshed.reason_codes.includes("INDEX_UNAVAILABLE") && refreshed.hits.length === 0) {
			return failure("index", "INDEX_UNAVAILABLE");
		}
		return record({
			command: "index",
			disposition: "success",
			hits: refreshed.hits,
			reason_codes: refreshed.reason_codes,
		});
	}

	if (parsed.kind === "scheduler") {
		const autoInput = {
			...routeInput,
			store: deps.store,
			kernelRoot: deps.kernelRoot ?? routeInput.kernelRoot,
		};
		try {
			const ran =
				parsed.command === "/auto"
					? await deps.engine.runAuto(autoInput)
					: await deps.engine.runQuick(autoInput);
			if (ran.passed === true) {
				return record({ command: parsed.command, disposition: "success" });
			}
			return record({
				command: parsed.command,
				disposition: "gate_block",
				reason_code: ran.codes?.[0],
				stop_reason: ran.intent?.stop_reason,
			});
		} catch (err) {
			const reason_code = isWorkflowError(err) ? err.code : "execution_failure";
			return failure(parsed.command, reason_code);
		}
	}

	try {
		const routed = await deps.engine.runCommand(parsed.command, routeInput);
		if (isRouteScheduled(routed)) {
			await deps.engine.runStandardLifecycle(routeInput, routed.plan);
			return record({ command: parsed.command, disposition: "success" });
		}
		if (isRouteOk(routed)) {
			return record({
				command: parsed.command,
				disposition: "success",
				phase_id: routed.phase_id,
				role_id: routed.role_id,
			});
		}
		const reason_code = "code" in routed ? routed.code : "WORKFLOW_ROUTE_DEFERRED";
		return failure(parsed.command, reason_code);
	} catch (err) {
		const reason_code = isWorkflowError(err) ? err.code : "execution_failure";
		return failure(parsed.command, reason_code);
	}
}
