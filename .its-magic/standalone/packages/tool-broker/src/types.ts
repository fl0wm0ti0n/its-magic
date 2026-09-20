export interface BrowserToolPort {
	invoke(params: unknown): Promise<{
		content: Array<{ type: string; text: string }>;
		details: object;
	}>;
}

export interface OwnedToolDefinition {
	name: string;
	label: string;
	description: string;
	parameters: unknown;
	execute: (
		toolCallId: string,
		params: unknown,
	) => Promise<{ content: Array<{ type: string; text: string }>; details: object }>;
}

export interface BrokerContext {
	role_id: string;
	phase_id: string;
	worktree_root: string;
	cwd: string;
	run_id: string;
	kernel_session_id: string;
	autonomy?: "supervised" | "autonomous";
	permission_mode?: "default-deny" | "ask-on-write";
	security_class?: "standard" | "security_hard";
	isolation_profile?: "trusted-local" | "isolated-development" | "untrusted-repository";
	backend?: string;
	approvals?: string[];
	sprint_id?: string;
	work_item_id?: string;
}
