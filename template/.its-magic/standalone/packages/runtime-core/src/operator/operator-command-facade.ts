import type { CommandRouter, RouteInput } from "../workflow/command-router.ts";
import { isRouteScheduled } from "../workflow/command-router.ts";
import {
	PROGRAMMATIC_COMMANDS,
	type ProgrammaticCommand,
	SCHEDULER_COMMANDS,
	type SchedulerCommand,
} from "../workflow/types.ts";
import type {
	OperatorDedicatedCommand,
	OperatorParsedToken,
	OperatorRouteOutcome,
} from "./types.ts";

const DEDICATED_COMMANDS: readonly OperatorDedicatedCommand[] = [
	"ask",
	"status",
	"resume",
	"index",
	"app",
	"browser",
];

const SCHEDULER_ALIASES: Record<string, SchedulerCommand> = {
	auto: "/auto",
	"/auto": "/auto",
	quick: "/quick",
	"/quick": "/quick",
};

export interface OperatorCommandFacadeDeps {
	router: CommandRouter;
	defaultRouteInput?: Partial<RouteInput>;
}

export class OperatorCommandFacade {
	private readonly router: CommandRouter;
	private readonly defaultRouteInput: Partial<RouteInput>;

	constructor(deps: OperatorCommandFacadeDeps) {
		this.router = deps.router;
		this.defaultRouteInput = deps.defaultRouteInput ?? {};
	}

	static normalizeToken(raw: string): string {
		const trimmed = raw.trim();
		if (trimmed.startsWith("/")) {
			return trimmed.slice(1);
		}
		return trimmed;
	}

	static parseArgv(argv: string[], baseInput: Partial<RouteInput> = {}): OperatorParsedToken {
		const token = argv[0] ?? "";
		if (token === "auth" || token === "models") {
			return { kind: "auth", argv };
		}
		const scheduler = SCHEDULER_ALIASES[token] ?? SCHEDULER_ALIASES[`/${token}`];
		const routeInput: RouteInput = {
			orchestrator_run_id: baseInput.orchestrator_run_id ?? "local",
			model_id: baseInput.model_id ?? "inherit",
			...baseInput,
		};
		if (scheduler) {
			return { kind: "scheduler", command: scheduler, routeInput };
		}
		const normalized = OperatorCommandFacade.normalizeToken(token);
		if ((PROGRAMMATIC_COMMANDS as readonly string[]).includes(normalized)) {
			return {
				kind: "programmatic",
				command: normalized as ProgrammaticCommand,
				routeInput,
			};
		}
		if ((DEDICATED_COMMANDS as readonly string[]).includes(normalized as OperatorDedicatedCommand)) {
			return {
				kind: "dedicated",
				command: normalized as OperatorDedicatedCommand,
				routeInput,
			};
		}
		return { kind: "unknown", token };
	}

	listSurfaceCommands(): string[] {
		return [
			...PROGRAMMATIC_COMMANDS,
			...SCHEDULER_COMMANDS,
			"auto",
			"quick",
			...DEDICATED_COMMANDS,
			"auth",
			"models",
		];
	}

	async routeParsed(parsed: OperatorParsedToken): Promise<OperatorRouteOutcome | { kind: "dedicated"; command: OperatorDedicatedCommand }> {
		if (parsed.kind === "auth" || parsed.kind === "unknown") {
			throw new Error(parsed.kind === "unknown" ? `unknown command: ${parsed.token}` : "auth path");
		}
		if (parsed.kind === "dedicated") {
			return { kind: "dedicated", command: parsed.command };
		}
		const input = { ...this.defaultRouteInput, ...parsed.routeInput };
		return this.router.route(parsed.kind === "scheduler" ? parsed.command : parsed.command, input);
	}

	async routeArgv(argv: string[], baseInput?: Partial<RouteInput>): Promise<OperatorRouteOutcome | { kind: "dedicated"; command: OperatorDedicatedCommand }> {
		const parsed = OperatorCommandFacade.parseArgv(argv, baseInput);
		return this.routeParsed(parsed);
	}

	isScheduledResult(result: OperatorRouteOutcome): boolean {
		return isRouteScheduled(result);
	}

	schedulerCommands(): readonly SchedulerCommand[] {
		return SCHEDULER_COMMANDS;
	}
}

export function createOperatorCommandFacade(deps: OperatorCommandFacadeDeps): OperatorCommandFacade {
	return new OperatorCommandFacade(deps);
}
