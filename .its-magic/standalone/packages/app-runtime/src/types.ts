import type { ConfigView, IdentityKind, RunsStore } from "@its-magic/runtime-core";
import type { FailureClass } from "./codes.ts";

export type BackendName =
	| "local"
	| "docker"
	| "docker-local"
	| "wsl"
	| "ssh"
	| "remote-docker"
	| "micro-vm"
	| "sandbox";

export type StackProfile = "node" | "python" | "go" | "dotnet" | "java";

export interface ExecuteRequest {
	command: string;
	args?: string[];
	cwd?: string;
	env?: NodeJS.ProcessEnv;
	timeoutMs?: number;
	signal?: AbortSignal;
	wait?: boolean;
	identity?: string;
}

export interface ExecuteResult {
	command: string;
	backend: string;
	exit_code: number | null;
	duration_ms: number;
	stdout: string;
	stderr: string;
	stdout_ref?: string;
	stderr_ref?: string;
	reason_code?: string;
	pid?: number;
	identity?: string;
}

export interface EvidenceRecord {
	command: string;
	backend: string;
	exit_code: number | null;
	duration_ms: number;
	stdout_ref: string;
	stderr_ref: string;
	reason_code?: string;
}

export interface HealthCheckResult {
	ok: boolean;
	backend: string;
	reason_code?: string;
	detail?: string;
	healthcheck_status?: "healthy" | "unhealthy" | "starting" | "none";
}

export interface ExecutionBackend {
	name(): string;
	execute(req: ExecuteRequest): Promise<ExecuteResult>;
	health_check(): Promise<HealthCheckResult>;
}

export interface DockerClient {
	binaryPresent(): boolean;
	daemonReachable(): Promise<boolean>;
	run(args: string[], req?: ExecuteRequest): Promise<ExecuteResult>;
	healthcheckStatus(containerId: string): Promise<HealthCheckResult["healthcheck_status"]>;
}

export interface ConnectHandoff {
	connect_endpoint: string;
	health_path: string;
	service_id: string;
	container_id: string;
	env_refs: string[];
	url: string;
	ports: number[];
	health: string;
}

export interface StackDiscovery {
	profile: StackProfile | null;
	start_command?: string;
	test_command?: string;
	build_command?: string;
	reason_code?: string;
}

export interface StartRequest {
	id: string;
	run_id: string;
	phase_id: string;
	cwd: string;
	backend?: string;
	command?: string;
	args?: string[];
	ports?: number[];
	url?: string;
	health_path?: string;
	identity_kind?: IdentityKind;
	env_refs?: string[];
	signal?: AbortSignal;
	timeoutMs?: number;
}

export interface ManagedHandle {
	id: string;
	run_id: string;
	phase_id: string;
	backend: string;
	identity_kind: IdentityKind;
	identity: string;
	command: string;
	cwd: string;
	ports: number[];
	url: string;
	health_path: string;
	readiness: string;
	started_at: string;
	crash_count: number;
	restart_count: number;
	log_ring_ref: string;
	health: string;
	env_refs: string[];
	child?: { kill(signal?: NodeJS.Signals): boolean; pid?: number };
}

export interface SessionSpawnSlot {
	spawn(req: {
		phase_id: string;
		role_id: string;
		orchestrator_run_id: string;
		model_id: string;
	}): Promise<{ kernel_session_id: string }>;
}

export interface AppRuntimeOptions {
	store?: RunsStore;
	logsDir?: string;
	now?: () => Date;
	backends?: Record<string, ExecutionBackend>;
	restartMax?: number;
	config?: ConfigView;
	env?: NodeJS.ProcessEnv;
	sessionSupervisor?: SessionSpawnSlot;
	probe?: (target: {
		url?: string;
		ports?: number[];
		health_path?: string;
	}) => Promise<{ ok: boolean; health: string }>;
	commandExists?: (name: string) => boolean;
	orchestrator_run_id?: string;
	model_id?: string;
}

export interface SelfDebugResult {
	attempts: number;
	restart_count: number;
	classified: FailureClass;
	reason_code?: string;
	dev_session_id?: string;
	exhausted: boolean;
	healthcheck_status?: HealthCheckResult["healthcheck_status"];
}

export interface CleanupResult {
	stopped: string[];
	reaped: string[];
	reason_code?: string;
}
